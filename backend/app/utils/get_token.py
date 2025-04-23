import os
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials

from app.core.config import gmail_config


SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']

def get_token_from_client_token():
    credentials = None
    token_path = 'app/utils/token.json'

    if os.path.exists(token_path):
        credentials = Credentials.from_authorized_user_file(token_path, SCOPES)

    if not credentials or not credentials.valid:
        if credentials and credentials.expired and credentials.refresh_token:
            credentials.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_config(
                gmail_config.GMAIL_CLIENT_TOKEN,
                SCOPES,
                redirect_uri='http://localhost'
            )
            auth_url, _ = flow.authorization_url(prompt='consent')
            print(f"\n👉 Visit this URL to authorize the app:\n{auth_url}")
            code = input("🔑 Enter the authorization code: ")
            flow.fetch_token(code=code)
            credentials = flow.credentials

        with open(token_path, 'w') as token:
            token.write(credentials.to_json())

    print("✅ token.json успішно створено!")
