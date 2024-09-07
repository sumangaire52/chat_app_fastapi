from fastapi import Depends, HTTPException
from fastapi_jwt_auth import AuthJWT
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)


def get_current_user(Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()
    user_id = Authorize.get_jwt_subject()
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    return user_id
