from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import text
from ..db.connect_connector import connect_with_connector

user = Blueprint("user", __name__)
engine = connect_with_connector()


@user.route("/me", methods=["GET"])
@jwt_required()
def get_own_user_profile():
    try:
        user_id = get_jwt_identity()["_id"]  # Extract user ID from the JWT token

        with engine.connect() as conn:
            result = conn.execute(
                text("SELECT * FROM users WHERE id = :user_id"), {"user_id": user_id}
            ).fetchone()

        if result:
            user_profile = {
                "id": result[0],
                "username": result[1],
                "email": result[2],
                "is_admin": result[4],
            }
            return jsonify(user=user_profile, message="User found!")
        else:
            return jsonify(message="User not found!"), 404

    except Exception as err:
        return jsonify(err=str(err), message="Internal server error!"), 500
