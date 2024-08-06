from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from .auth.auth_routes import auth
from .routes.todolist_routes import todolist_bp
from .routes.user_routes import user


def create_app():
    app = Flask(__name__)
    app.config.from_object("config.Config")

    CORS(app)
    JWTManager(app)

    app.register_blueprint(auth, url_prefix="/auth")
    app.register_blueprint(user, url_prefix="/user")
    app.register_blueprint(todolist_bp)

    return app
