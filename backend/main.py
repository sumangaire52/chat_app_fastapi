from fastapi import FastAPI
from db_connection import Base, engine

app = FastAPI()


@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)