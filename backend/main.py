import os

from api.v1 import message, user_login, user_register
from db_connection import Base, engine
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi_jwt_auth import AuthJWT
from pydantic import BaseModel
from websocket import socket

origins = ["http://localhost:3000"]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_register.router)
app.include_router(user_login.router)
app.include_router(socket.router)
app.include_router(message.router)


class Settings(BaseModel):
    authjwt_secret_key: str = os.getenv("JWT_SECRET_KEY", "weak_secret_key")


@AuthJWT.load_config
def get_config():
    return Settings()


@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)
