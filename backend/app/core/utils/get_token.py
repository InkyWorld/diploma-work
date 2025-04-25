import json
import os
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials

from app.core.config.base_config import BASE_DIR, TOKEN_PATH, SCOPES
from app.core.config.config import gmail_config
from app.core.logger.logger import logger


def get_token_from_client_token():
    credentials = None

    if os.path.exists(TOKEN_PATH):
        credentials = Credentials.from_authorized_user_file(TOKEN_PATH, SCOPES)

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

        with open(TOKEN_PATH, 'w') as token:
            json.dump(json.loads(credentials.to_json()), token, indent=4)

    logger.info("✅ token.json успішно створено!")
