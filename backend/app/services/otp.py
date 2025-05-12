from pathlib import Path

from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from fastapi_mail.errors import ConnectionErrors
from pydantic import EmailStr

from app.core import config, log
from app.services.auth import auth_service


class Email_OTP:
    def __init__(self):
        self.conf = ConnectionConfig(
            MAIL_USERNAME=config.email_config.MAIL_USERNAME,
            MAIL_PASSWORD=config.email_config.MAIL_PASSWORD,
            MAIL_FROM=config.email_config.MAIL_FROM,
            MAIL_PORT=config.email_config.MAIL_PORT,
            MAIL_SERVER=config.email_config.MAIL_SERVER,
            MAIL_FROM_NAME=config.email_config.MAIL_FROM_NAME,
            MAIL_STARTTLS=config.email_config.MAIL_STARTTLS,
            MAIL_SSL_TLS=config.email_config.MAIL_SSL_TLS,
            USE_CREDENTIALS=config.email_config.USE_CREDENTIALS,
            VALIDATE_CERTS=config.email_config.VALIDATE_CERTS,
            TEMPLATE_FOLDER=Path(__file__).parent / 'templates',
        )

    async def __call__(self, email: EmailStr, username: str, host: str):
        """
        Sends an email containing a token verification link to the specified email address.

        This function generates an email verification token for the given email address,
        creates an email message with a link to confirm the email, and sends it using FastMail.
        
        The email content is dynamically populated with the `host`, `username`, and the generated token. 
        The email is sent as an HTML message using the `otp.html` template located in the `templates` folder.

        Args:
            email (EmailStr): The email address to which the verification link will be sent.
            username (str): The username associated with the email account.
            host (str): The host URL that will be included in the email message to provide the link.

        Raises:
            ConnectionErrors: If there is an issue connecting to the mail server, a `ConnectionErrors` exception is raised.
        
        Example:
            ```python
            await send_email("example@example.com", "john_doe", "https://example.com")
            ```
        """
        try:
            token_verification = await auth_service.create_email_token({"sub": email})
            message = MessageSchema(
                subject="Confirm your email ",
                recipients=[email],
                template_body={"host": host, "username": username, "token": token_verification},
                subtype=MessageType.html
            )

            fm = FastMail(self.conf)
            await fm.send_message(message, template_name="otp.html")
        except ConnectionErrors as err:
            log.error(repr(err))

email_otp_service = Email_OTP()