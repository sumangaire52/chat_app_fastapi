from api.v1 import prefix
from db_connection import SessionLocal
from fastapi import APIRouter
from models import Message

router = APIRouter(prefix=prefix, tags=["Messages"])


@router.get("/messages")
def get_messages():
    db = SessionLocal()
    return db.query(Message).all()


@router.get("/search")
def search_messages(query: str):
    db = SessionLocal()
    return db.query(Message).filter(Message.content.contains(query)).all()
