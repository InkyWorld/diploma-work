import os
import sys
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials


from app.core.config import gmail_config


SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']

def get_token_from_client_token():
    credentials = None
    # Проверяем, есть ли сохранённый токен
    if os.path.exists('token.json'):
        credentials = Credentials.from_authorized_user_file('token.json', SCOPES)

    # Если нет токена или он недействителен — проводим авторизацию
    if not credentials or not credentials.valid:
        if credentials and credentials.expired and credentials.refresh_token:
            credentials.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_config(gmail_config.GMAIL_CLIENT_TOKEN, SCOPES)
            credentials = flow.run_local_server(port=0)
        # Сохраняем токен в файл
        with open('app/utils/token.json', 'w') as token:
            token.write(credentials.to_json())

    print("✅ token.json успешно создан!")

if __name__ == '__main__':
    get_token_from_client_token()
