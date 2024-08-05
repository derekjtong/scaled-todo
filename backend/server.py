from flask import (
    Flask,
    request,
    jsonify,
    Response,
)
import json
import os
import secret as secret
import sqlalchemy
from connect_connector import connect_with_connector
from flask_cors import CORS

SQLLITE3_DATABASE = "todolist.db"

app = Flask(__name__)
CORS(app)
app.config.from_object(__name__)


def init_connection_pool() -> sqlalchemy.engine.base.Engine:
    return connect_with_connector()


def migrate_db(db: sqlalchemy.engine.base.Engine) -> None:
    """Creates the `entries` table if it doesn't exist."""
    with db.connect() as conn:
        conn.execute(
            sqlalchemy.text(
                """
                CREATE TABLE IF NOT EXISTS entries (
                    id INTEGER PRIMARY KEY AUTO_INCREMENT,
                    what_to_do TEXT NOT NULL,
                    due_date TEXT NOT NULL,
                    status VARCHAR(20) NOT NULL DEFAULT 'pending'
                )
                """
            )
        )
        conn.commit()


cloud_db = None


@app.before_request
def init_db() -> sqlalchemy.engine.base.Engine:
    """Initiates connection to database and its' structure."""
    global cloud_db
    if cloud_db is None:
        cloud_db = init_connection_pool()
        migrate_db(cloud_db)


@app.route("/")
def health_check_1():
    return health_check()


@app.route("/api/items")
def get_items():
    with cloud_db.connect() as conn:
        result = conn.execute(
            sqlalchemy.text("SELECT id, what_to_do, due_date, status FROM entries")
        )
        entries = result.fetchall()
        tdlist = [
            dict(
                id=row[0],
                what_to_do=row[1],
                due_date=row[2],
                status=row[3],
            )
            for row in entries
        ]
        return Response(json.dumps(tdlist), mimetype="application/json")


@app.route("/api/items", methods=["POST"])
def add_item():
    with cloud_db.connect() as conn:
        result = conn.execute(
            sqlalchemy.text(
                "INSERT INTO entries (what_to_do, due_date) VALUES (:what_to_do, :due_date)"
            ),
            {
                "what_to_do": request.json["what_to_do"],
                "due_date": request.json["due_date"],
            },
        )
        conn.commit()

        # Fetch the newly created item to return it
        new_item = conn.execute(
            sqlalchemy.text(
                "SELECT id, what_to_do, due_date, status FROM entries WHERE id = LAST_INSERT_ID()"
            )
        ).fetchone()

        new_item_dict = {
            "id": new_item[0],
            "what_to_do": new_item[1],
            "due_date": new_item[2],
            "status": new_item[3],
        }
        return jsonify(new_item_dict)


@app.route("/api/items/<int:item_id>", methods=["DELETE"])
def delete_item(item_id):
    with cloud_db.connect() as conn:
        conn.execute(
            sqlalchemy.text("DELETE FROM entries WHERE id=:id"),
            {"id": item_id},
        )
        conn.commit()
        return jsonify({"result": True})


@app.route("/api/items/<int:item_id>", methods=["PUT"])
def update_item(item_id):
    with cloud_db.connect() as conn:
        conn.execute(
            sqlalchemy.text("UPDATE entries SET status='done' WHERE id=:id"),
            {"id": item_id},
        )
        conn.commit()
        return jsonify({"result": True})


@app.route("/health-check")
def health_check():
    return jsonify({"status": "ok", "mode": os.environ.get("FLASK_ENV")})


@app.route("/secret-check")
def secret_check():
    return jsonify(
        secret.get_secret("test"), os.environ.get("PROJECT_ID_NUM"), "hello https!"
    )


if __name__ == "__main__":
    if os.getenv("FLASK_ENV") == "production":
        app.run("0.0.0.0", port=5001, ssl_context=("cert.pem", "key.pem"))
    else:
        app.run("0.0.0.0", port=5001)
