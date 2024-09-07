from api.v1 import prefix
from db_connection import SessionLocal
from fastapi import APIRouter
from models import Message, User

router = APIRouter(prefix=prefix, tags=["Messages"])


@router.get("/messages")
def get_messages():
    db = SessionLocal()
    messages = db.query(Message, User.username).join(User, Message.user_id == User.id).all()
    response = [
        {
            "username": username,
            "content": message.content,
            "timestamp": message.timestamp.isoformat(),  # Include timestamp if needed
            "id": message.id,
        }
        for message, username in messages
    ]
    return response


@router.get("/search")
def search_messages(query: str):
    db = SessionLocal()
    return db.query(Message).filter(Message.content.contains(query)).all()
