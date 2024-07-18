from typing import Generator

from fastapi import Depends
from sqlalchemy.orm import sessionmaker, Session

from template_matching_api.db import get_db


def get_session_maker() -> sessionmaker:
    return get_db()


def get_session(session_maker: sessionmaker = Depends(get_session_maker)) -> Generator[Session, None, None]:
    with session_maker.begin() as session:
        yield session
