from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from .jwt_helpers import generate_token
from .password_helpers import hash_password, compare_password
from sqlalchemy import text
from ..db.connect_connector import connect_with_connector

auth = Blueprint("auth", __name__)
engine = connect_with_connector()

# Blacklisted tokens for logout
blacklisted_tokens = set()


@auth.route("/login", methods=["POST"])
def login():
    data = request.json
    with engine.connect() as conn:
        result = conn.execute(
            text("SELECT * FROM users WHERE username = :username"),
            {"username": data["username"]},
        ).fetchone()

    if result and compare_password(data["password"], result[3]):
        token = generate_token({"uid": result[0], "is_admin": result[4]})
        return jsonify(message="User is valid", token=token)
    return jsonify(message="Invalid username or password"), 401


@auth.route("/signup", methods=["POST"])
def signup():
    data = request.json

    if "username" not in data or "email" not in data or "password" not in data:
        return jsonify(message="Missing required fields"), 400

    with engine.connect() as conn:
        existing_user = conn.execute(
            text("SELECT * FROM users WHERE username = :username OR email = :email"),
            {"username": data["username"], "email": data["email"]},
        ).fetchone()

        if existing_user:
            return jsonify(message="Username or Email already in use"), 400

        hashed_password = hash_password(data["password"])
        conn.execute(
            text(
                "INSERT INTO users (username, email, password, is_admin) VALUES (:username, :email, :password, :is_admin)"
            ),
            {
                "username": data["username"],
                "email": data["email"],
                "password": hashed_password,
                "is_admin": data.get("is_admin", False),
            },
        )
        conn.commit()

        new_user = conn.execute(
            text("SELECT * FROM users WHERE username = :username"),
            {"username": data["username"]},
        ).fetchone()

    token = generate_token({"uid": new_user[0], "is_admin": new_user[4]})
    return jsonify(
        uid=new_user[0],
        username=new_user[1],
        email=new_user[2],
        is_admin=new_user[4],
        token=token,
    )


@auth.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]
    blacklisted_tokens.add(jti)
    return jsonify(message="Logout successful")


@auth.route("/admin", methods=["GET"])
@jwt_required()
def admin_route():
    user = get_jwt_identity()
    if not user["is_admin"]:
        return jsonify(message="You have to be an admin for this operation!"), 403
    return jsonify(message="Verified Admin")
