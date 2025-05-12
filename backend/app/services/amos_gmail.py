import asyncio
import csv
from datetime import date, datetime, time, timedelta
from io import StringIO
import sys
import os



x = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
sys.path.append(x)
print()
print(x)

import os
import base64
from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from app.core import config, base_config, log

from app.db.redis import redis_manager

from app.core.utils.amos_file_handler import amos_file_handler
SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']

file_handlers = {
    'FutureFlightsFromAmosToday.csv': amos_file_handler.save_flights_file,
    'WPEventReport.csv': amos_file_handler.save_events_file,
    'WPReportToday.csv': amos_file_handler.save_packages_file,
}

class AmosGmailService:
    def __init__(self, scopes):
        self.scopes = scopes
        self.credentials = self.get_credentials()
        self.service = self.authenticate_gmail_api()

    
    def get_credentials(self):
        try:
            credentials = None
            if os.path.exists(base_config.TOKEN_PATH):
                credentials = Credentials.from_authorized_user_file(base_config.TOKEN_PATH, self.scopes)

            if not credentials or not credentials.valid:
                log.warning("Credentials are invalid or expired.")
                if credentials and credentials.expired and credentials.refresh_token:
                    log.info("Refreshing credentials...")
                    credentials.refresh(Request())
                else:
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="No valid credentials available. Re-authentication required."
                    )
            return credentials
            
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to load token.json: {e}"
            )
    
    def authenticate_gmail_api(self):
        """
        Аутентификация с использованием полученных учетных данных и создание клиента для работы с Gmail API.
        """
        try:
            service = build('gmail', 'v1', credentials=self.credentials)
            log.info("Gmail API client successfully authenticated.")
            return service
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to authenticate Gmail API: {e}"
            )

    
    async def fetch_and_process_emails(self, query):
        """
        Fetch and process emails from Gmail using a query filter.
        
        :param query: Query string for filtering emails (e.g., "is:unread from:example@example.com subject:question").
        """
        results = self.service.users().messages().list(userId='me', q=query).execute()
        messages = results.get('messages', [])
        
        if not messages:
            log.warning("No messages found.")
            return
        
        for message in messages:
            msg = self.service.users().messages().get(userId='me', id=message['id']).execute()
            await self.process_message(msg)

    def get_attachment(self, message_id: str, attachment_id: str) -> bytes:
        try:
            attachment = self.service.users().messages().attachments().get(
                userId='me',
                messageId=message_id,
                id=attachment_id
            ).execute()

            data = attachment.get('data')
            if data:
                file_data = base64.urlsafe_b64decode(data.encode('UTF-8'))
                return file_data
            else:
                log.warning("No data in attachment.")
                return b''
        except Exception as e:
            log.error(f"Failed to download attachment: {e}", exc_info=True)
            return b''
    
    async def process_message(self, msg):
        """
        Обработка полученного письма и сохранение вложений.
        
        :param msg: Объект письма, полученный из Gmail API.
        """
        parts = msg['payload'].get('parts', [])
        for part in parts:
            try:
                body = part.get('body', {})
                file_data = None
                data = body.get('data')
                if data:
                    file_data = base64.urlsafe_b64decode(data.encode('UTF-8'))
                elif 'attachmentId' in body:
                    attachment_id = body['attachmentId']
                    file_data = self.get_attachment(msg['id'], attachment_id)
                else:
                    continue  # Skip if no data or attachmentId

                if file_data:
                    async with redis_manager.session() as redis:
                        try:
                            handler = file_handlers.get(part['filename'])
                            if handler:
                                await handler(file_data, redis)
                                log.info(f"✅ Файл {part['filename']} успешно обработан.")

                        except Exception as e:
                            log.error(f"❌ Error saving file data: {e}", exc_info=True)
                            raise HTTPException(
                                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                                detail=f"❌ Failed to save file data: {e}"
                            )
                        else:
                            log.info("✅ All files processed successfully.")
                else:
                    log.warning(f"❌ No file data found in part: {part.get('filename', 'Unnamed')}")
            except Exception as e:
                log.error(f"❌ Error processing part: {e}", exc_info=True)
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail=f"❌ Failed to process message: {e}"
                )

    async def update_amos_tables(self):
        query = f"is:unread from:{config.gmail_config.GMAIL_FROM_EMAIL} subject:{config.gmail_config.GMAIL_LETTER_SUBJECT}"
        async with redis_manager.session() as redis:
            await amos_file_handler.delete_all_data(redis)
        await self.fetch_and_process_emails(query)

service_gmail = AmosGmailService(SCOPES)


if __name__ == "__main__":
    # Example usage
    
    service = AmosGmailService(SCOPES)
    asyncio.run(service.update_amos_tables())