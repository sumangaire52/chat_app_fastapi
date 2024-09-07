from typing import List

from db_connection import SessionLocal
from fastapi import APIRouter, Depends, WebSocket
from fastapi_jwt_auth import AuthJWT
from models import Message, User

router = APIRouter()

active_connections: List[WebSocket] = []


@router.websocket("/ws/chat")
async def chat(websocket: WebSocket, Authorize: AuthJWT = Depends()):
    try:
        # Authenticate user via JWT
        Authorize.jwt_required()
        username = Authorize.get_jwt_subject()
        await websocket.accept()
        active_connections.append((username, websocket))
    except Exception as e:
        await websocket.close()
        raise e

    try:
        while True:
            message_text = await websocket.receive_text()
            db = SessionLocal()
            user = db.query(User).filter(User.username == username).first()

            # Save message in the database
            new_message = Message(content=message_text, user_id=user.id)
            db.add(new_message)
            db.commit()

            # Broadcast message to all active connections
            for _, connection in active_connections:
                await connection.send_text(f"{username}: {message_text}")
    except Exception as e:
        active_connections.remove((username, websocket))
        raise e
