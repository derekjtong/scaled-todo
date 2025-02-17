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
        uid = get_jwt_identity()["uid"]

        with engine.connect() as conn:
            result = conn.execute(
                text("SELECT * FROM users WHERE uid = :uid"), {"uid": uid}
            ).fetchone()

        if result:
            user_profile = {
                "uid": result[0],
                "username": result[1],
                "email": result[2],
                "is_admin": result[4],
            }
            return jsonify(user=user_profile, message="User found!")
        else:
            return jsonify(message="User not found!"), 404

    except Exception as err:
        return jsonify(err=str(err), message="Internal server error!"), 500
