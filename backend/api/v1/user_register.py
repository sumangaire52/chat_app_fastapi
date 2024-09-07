from api.v1 import prefix
from db_connection import SessionLocal
from fastapi import APIRouter, HTTPException
from models import User, UserLogin
from utils import hash_password

router = APIRouter(prefix=prefix, tags=["User"])


@router.post("/register")
def register(user: UserLogin):
    db = SessionLocal()
    # Check if username already exists
    existing_user = db.query(User).filter(User.username == user.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    # Hash the password and create a new user
    new_user = User(username=user.username, password_hash=hash_password(user.password))
    db.add(new_user)
    db.commit()
    return {"message": "User registered successfully"}
