import os
from flask import Blueprint, request, jsonify, Response
import json
import sqlalchemy
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..db.connect_connector import connect_with_connector
from ..db.migrations import migrate_db
from ..utils.secret_manager import get_secret

todolist_bp = Blueprint("todolist", __name__)

cloud_db = None


@todolist_bp.before_app_request
def init_db():
    """Initiates connection to database and its structure."""
    global cloud_db
    if cloud_db is None:
        cloud_db = init_connection_pool()
        migrate_db(cloud_db)


def init_connection_pool() -> sqlalchemy.engine.base.Engine:
    return connect_with_connector()


@todolist_bp.route("/")
def health_check_1():
    return health_check()


@todolist_bp.route("/api/items")
@jwt_required()
def get_items():
    uid = get_jwt_identity()["uid"]
    with cloud_db.connect() as conn:
        result = conn.execute(
            sqlalchemy.text(
                "SELECT eid, what_to_do, due_date, status FROM entries WHERE uid = :uid"
            ),
            {"uid": uid},
        )
        entries = result.fetchall()
        tdlist = [
            dict(
                eid=row[0],
                what_to_do=row[1],
                due_date=row[2],
                status=row[3],
            )
            for row in entries
        ]
        response = {"todos": tdlist}
        return jsonify(response)


@todolist_bp.route("/api/items", methods=["POST"])
@jwt_required()
def add_item():
    uid = get_jwt_identity()["uid"]
    with cloud_db.connect() as conn:
        result = conn.execute(
            sqlalchemy.text(
                "INSERT INTO entries (what_to_do, due_date, uid) VALUES (:what_to_do, :due_date, :uid)"
            ),
            {
                "what_to_do": request.json["what_to_do"],
                "due_date": request.json["due_date"],
                "uid": uid,
            },
        )
        conn.commit()

        new_item = conn.execute(
            sqlalchemy.text(
                "SELECT eid, what_to_do, due_date, status FROM entries WHERE eid = LAST_INSERT_ID() AND uid = :uid"
            ),
            {"uid": uid},
        ).fetchone()

        new_item_dict = {
            "eid": new_item[0],
            "what_to_do": new_item[1],
            "due_date": new_item[2],
            "status": new_item[3],
        }
        response = {"todo": new_item_dict}
        return jsonify(response)


@todolist_bp.route("/api/items/<int:item_id>", methods=["DELETE"])
@jwt_required()
def delete_item(item_id):
    uid = get_jwt_identity()["uid"]
    with cloud_db.connect() as conn:
        conn.execute(
            sqlalchemy.text("DELETE FROM entries WHERE eid=:eid AND uid = :uid"),
            {"eid": item_id, "uid": uid},
        )
        conn.commit()
        return jsonify({"result": True})


@todolist_bp.route("/api/items/<int:item_id>", methods=["PUT"])
@jwt_required()
def update_item(item_id):
    uid = get_jwt_identity()["uid"]
    with cloud_db.connect() as conn:
        conn.execute(
            sqlalchemy.text(
                "UPDATE entries SET status='done' WHERE eid=:eid AND uid = :uid"
            ),
            {"eid": item_id, "uid": uid},
        )
        conn.commit()
        return jsonify({"result": True})


@todolist_bp.route("/health-check")
def health_check():
    return jsonify({"status": "ok", "mode": os.environ.get("FLASK_ENV")})


@todolist_bp.route("/secret-check")
def secret_check():
    return jsonify(get_secret("test"), os.environ.get("PROJECT_ID_NUM"), "hello https!")
