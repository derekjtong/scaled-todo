import os
from dotenv import load_dotenv
from google.cloud import secretmanager


load_dotenv()


def get_env_variable(key):
    if os.environ.get("FLASK_ENV") == "production":
        print("google secret manager")
        client = secretmanager.SecretManagerServiceClient()
        secret_manager_key = f"projects/730768768367/secrets/{key}/versions/latest"
        response = client.access_secret_version(name=secret_manager_key)
        return response.payload.data.decode("UTF-8")
    else:
        return os.environ.get(key)
