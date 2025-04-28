import asyncio
import csv
from datetime import date, datetime, time, timedelta
from io import StringIO
import sys
import os

# from app.models.flights import Flight

from sqlalchemy import Boolean, String, Integer, DateTime, ForeignKey, Enum, Date, Time, func
from sqlalchemy.orm import relationship, mapped_column, Mapped
from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    pass

class Flight(Base):
    __tablename__ = "flights"

    id: Mapped[int] = mapped_column(primary_key=True)
    aircraft_name: Mapped[str] = mapped_column(String(10), nullable=False)
    
    departure_date: Mapped[Date] = mapped_column(Date, nullable=False)
    departure_time: Mapped[Time] = mapped_column(Time, nullable=False)
    departure_airport: Mapped[str] = mapped_column(String(10), nullable=False)
    
    arrival_date: Mapped[Date] = mapped_column(Date, nullable=False)
    arrival_time: Mapped[Time] = mapped_column(Time, nullable=False)
    arrival_airport: Mapped[str] = mapped_column(String(10), nullable=False)
    
    flight_name: Mapped[str] = mapped_column(String(10), nullable=False)
    service_class: Mapped[str] = mapped_column(String(1), nullable=False)
    
    field1: Mapped[int] = mapped_column(Integer, default=0)
    field2: Mapped[int] = mapped_column(Integer, default=0)



x = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
sys.path.append(x)
print()
print(x)
from app.db.database import get_db
import os
import base64
from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from app.core import config, base_config, log

from app.db.database import sessionmanager

SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']

class GmailService:
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
                    if part['filename'] == 'FutureFlightsFromAmosToday.csv':
                        async with sessionmanager.session() as db:
                            await self.save_file(file_data, db)
                            log.info(f"Файл {part['filename']} успешно обработан.")
                    
                    await db.commit()
                else:
                    log.warning(f"No file data found in part: {part.get('filename', 'Unnamed')}")
            except Exception as e:
                log.error(f"Error processing part: {e}", exc_info=True)
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail=f"Failed to process message: {e}"
                )
    
    @staticmethod
    def convert_minutes_to_time(minutes: int) -> time:
        # Calculate hours and minutes from the total minutes
        hours = minutes // 60
        mins = minutes % 60
        return time(hours, mins)
    
    @staticmethod
    def convert_days_to_date(days_since_1970: int) -> date:
        """Конвертирует количество дней с 1970-01-01 в объект даты."""
        base_date = date(1970, 1, 1)
        target_date = base_date + timedelta(days=days_since_1970)
        return target_date

    async def save_file(self, file_data, db: AsyncSession):
        """
        Извлечение данных о рейсах из файла и сохранение в базу данных.
        
        :param file_data: Данные файла.
        :param db: Сессия базы данных для сохранения данных.
        """
        try:
            # Преобразование данных файла в список строк
            decoded_data = file_data.decode('utf-8')
            f = StringIO(decoded_data)
            reader = csv.DictReader(f, delimiter=';')
            rows = list(reader)
            
            # Пропускаем заголовок
            for row in rows:
                flight = Flight(
                    aircraft_name=row['Flight_Code'],
                    departure_date=self.convert_days_to_date(int(row['Departure_Date'])),
                    departure_time=self.convert_minutes_to_time(int(row['Departure_Time'])),
                    departure_airport=row['Departure_Code'],
                    arrival_date=self.convert_days_to_date(int(row['Arrival_Date'])),
                    arrival_time=self.convert_minutes_to_time(int(row['Arrival_Time'])),
                    arrival_airport=row['Arrival_Code'],
                    flight_name=row['Flight_Number'],
                    service_class=row['Flight_Type'],
                    field1=int(row['Field_1']),
                    field2=int(row['Field_2'])
                )
                db.add(flight)

        except Exception as e:
            log.error(f"Error saving flight data: {e}", exc_info=True)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to save flight data to database: {e}"
            )
        
    

service_gmail = None
# Использование класса:
if __name__ == "__main__":
    # Передаем client_token из конфигурации
    gmail_service = GmailService(SCOPES)
    
    # Указываем запрос для фильтрации писем
    query = f"is:unread from:{config.gmail_config.GMAIL_FROM_EMAIL} subject:{config.gmail_config.GMAIL_LETTER_SUBJECT}"
    
    # Получаем и обрабатываем письма
    asyncio.run(gmail_service.fetch_and_process_emails(query))


    print("✅ Письма успешно обработаны.")