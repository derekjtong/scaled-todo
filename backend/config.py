from app.utils import secret_manager


class Config:
    SECRET_KEY = secret_manager.get_secret("jwt-secret")
    JWT_SECRET_KEY = secret_manager.get_secret("jwt-secret")
    JWT_ACCESS_TOKEN_EXPIRES = 18760 * 3600  # hours
    JWT_BLACKLIST_ENABLED = True
    JWT_BLACKLIST_TOKEN_CHECKS = ["access", "refresh"]
