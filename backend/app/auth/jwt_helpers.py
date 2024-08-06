from flask_jwt_extended import create_access_token, decode_token
from typing import Dict


def generate_token(user: Dict) -> str:
    token = create_access_token(identity=user)
    return token


def verify_token(token: str) -> Dict:
    decoded = decode_token(token)
    return decoded["sub"]
