from api.v1 import user_login, user_register
from db_connection import Base, engine
from fastapi import FastAPI

app = FastAPI()

app.include_router(user_register.router)
app.include_router(user_login.router)


@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)
