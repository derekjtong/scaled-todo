import sqlalchemy


def migrate_db(db: sqlalchemy.engine.base.Engine) -> None:
    """Creates the `users` and `entries` tables if they don't exist."""
    with db.connect() as conn:
        # Create the `users` table if it doesn't exist
        conn.execute(
            sqlalchemy.text(
                """
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTO_INCREMENT,
                    username VARCHAR(255) UNIQUE NOT NULL,
                    email VARCHAR(255) UNIQUE NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    is_admin BOOLEAN DEFAULT FALSE
                )
                """
            )
        )
        # Create the `entries` table if it doesn't exist
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
