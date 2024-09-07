import asyncio
import contextlib
import json
from typing import List, Tuple

from db_connection import SessionLocal
from fastapi import APIRouter, Depends, Query, WebSocket, WebSocketDisconnect
from fastapi_jwt_auth import AuthJWT
from models import Message, User

router = APIRouter()

active_connections: List[Tuple[str, WebSocket]] = []

lock = asyncio.Lock()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.websocket("/ws/chat")
async def chat(
    websocket: WebSocket, token: str = Query(...), Authorize: AuthJWT = Depends(), db: SessionLocal = Depends(get_db)
):
    try:
        Authorize.jwt_required("websocket", token=token)
        username = Authorize.get_raw_jwt(token).get("sub")

        await websocket.accept()

        async with lock:
            if not any(conn[0] == username for conn in active_connections):
                print(f"{username} connected")
                active_connections.append((username, websocket))

    except Exception as e:
        await websocket.close()
        return {"error": f"Authentication failed for {websocket.client}. Error: {e}"}

    try:
        while True:
            message_text = await websocket.receive_text()
            user = db.query(User).filter(User.username == username).first()
            if user:
                new_message = Message(content=message_text, user_id=user.id)
                db.add(new_message)
                db.commit()
                async with lock:
                    message_data = json.dumps({"username": username, "content": message_text})
                    for _, connection in active_connections:
                        await connection.send_text(message_data)
            else:
                print("user not found")
                await websocket.send_text("User not found.")

    except WebSocketDisconnect:
        async with lock:
            with contextlib.suppress(ValueError):
                active_connections.remove((username, websocket))

    except Exception as e:
        async with lock:
            with contextlib.suppress(ValueError):
                active_connections.remove((username, websocket))
        await websocket.close()
        return {"error": f"Error occurred for {username}: {e}"}
