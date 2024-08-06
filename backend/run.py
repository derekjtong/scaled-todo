import os
from app import create_app

app = create_app()

if __name__ == "__main__":
    if os.getenv("FLASK_ENV") == "production":
        app.run("0.0.0.0", port=5001, ssl_context=("cert.pem", "key.pem"))
    else:
        app.run("0.0.0.0", port=5001, debug=True)
