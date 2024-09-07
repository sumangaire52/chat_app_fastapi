from api.v1 import prefix
from db_connection import SessionLocal, get_db
from fastapi import APIRouter, Depends
from models import Message, User
from utils import get_current_user

router = APIRouter(prefix=prefix, tags=["Messages"])


@router.get("/messages", dependencies=[Depends(get_current_user)])
def get_messages(db: SessionLocal = Depends(get_db)):
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


@router.delete("/messages", dependencies=[Depends(get_current_user)])
async def delete_all_messages(db: SessionLocal = Depends(get_db)):
    db.query(Message).delete()
    db.commit()
    return {"message": "All messages deleted successfully"}


@router.get("/search", dependencies=[Depends(get_current_user)])
def search_messages(query: str, db: SessionLocal = Depends(get_db)):
    return db.query(Message).filter(Message.content.contains(query)).all()
