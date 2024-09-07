from api.v1 import prefix
from db_connection import SessionLocal
from fastapi import APIRouter, Depends, HTTPException
from fastapi_jwt_auth import AuthJWT
from models import User, UserLogin
from utils import verify_password

router = APIRouter(prefix=prefix, tags=["User"])


@router.post("/login")
def login(user: UserLogin, Authorize: AuthJWT = Depends()):
    db = SessionLocal()
    db_user = db.query(User).filter(User.username == user.username).first()
    if not db_user or not verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = Authorize.create_access_token(subject=user.username)
    return {"access_token": access_token}
