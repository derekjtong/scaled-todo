import os
from google.cloud import secretmanager


PROJECT_ID = int(
    os.environ.get("PROJECT_ID_NUM"),
)


def get_secret(key):
    if os.environ.get("FLASK_ENV") == "production":
        secret_manager_key = (
            f"projects/{PROJECT_ID}/secrets/scaled-todo-prod-{key}/versions/latest"
        )
    else:
        secret_manager_key = (
            f"projects/{PROJECT_ID}/secrets/scaled-todo-dev-{key}/versions/latest"
        )

    client = secretmanager.SecretManagerServiceClient()
    response = client.access_secret_version(name=secret_manager_key)
    return response.payload.data.decode("UTF-8")
