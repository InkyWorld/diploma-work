import os
import base64
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from app.core.config import gmail_config

SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']

class GmailService:
    def __init__(self, scopes):
        self.scopes = scopes
        self.credentials = self.get_credentials()
        self.service = self.authenticate_gmail_api()
    
    def authenticate_gmail_api(self):
        """
        Аутентификация с использованием полученных учетных данных и создание клиента для работы с Gmail API.
        """
        service = build('gmail', 'v1', credentials=self.credentials)
        return service
    
    def get_filtered_emails(self, query):
        """
        Получение отфильтрованных писем по заданному запросу.
        
        :param query: строка запроса для фильтрации писем (например, "is:unread from:example@example.com subject:вопрос").
        """
        results = self.service.users().messages().list(userId='me', q=query).execute()
        messages = results.get('messages', [])
        
        for message in messages:
            msg = self.service.users().messages().get(userId='me', id=message['id']).execute()
            self.process_message(msg)
    
    def process_message(self, msg):
        """
        Обработка полученного письма и сохранение вложений.
        
        :param msg: Объект письма, полученный из Gmail API.
        """
        for part in msg['payload']['parts']:
            if part.get('filename'):  # Проверяем наличие вложения
                file_data = base64.urlsafe_b64decode(part['body']['data'].encode('UTF-8'))
                self.save_file(part['filename'], file_data)
    
    def save_file(self, filename, data):
        """
        Сохранение файла во временную директорию.
        
        :param filename: Имя файла.
        :param data: Данные файла.
        """
        os.makedirs('./downloads', exist_ok=True)  # Создаем директорию, если не существует
        file_path = os.path.join('./downloads', filename)
        
        with open(file_path, 'wb') as f:
            f.write(data)
        print(f"Файл {filename} сохранен.")


# Использование класса:
if __name__ == "__main__":
    # Передаем client_token из конфигурации
    gmail_service = GmailService(gmail_config.GMAIL_CLIENT_TOKEN, SCOPES)
    
    # Указываем запрос для фильтрации писем
    query = "is:unread from:example@example.com subject:вопрос"
    
    # Получаем и обрабатываем письма
    gmail_service.get_filtered_emails(query)