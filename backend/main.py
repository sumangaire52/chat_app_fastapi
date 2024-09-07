from api.v1 import message, user_login, user_register
from db_connection import Base, engine
from fastapi import FastAPI
from websocket import socket

app = FastAPI()

app.include_router(user_register.router)
app.include_router(user_login.router)
app.include_router(socket.router)
app.include_router(message.router)


@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)
