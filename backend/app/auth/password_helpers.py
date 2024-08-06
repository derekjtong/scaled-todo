from bcrypt import gensalt, hashpw, checkpw


def hash_password(password: str) -> str:
    salt = gensalt()
    hashed = hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")


def compare_password(password: str, hashed_password: str) -> bool:
    return checkpw(password.encode("utf-8"), hashed_password.encode("utf-8"))
