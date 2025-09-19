import pytest
import asyncio
from sqlalchemy.ext.asyncio import AsyncEngine
from apps.backend.app.main import engine, Base

@pytest.fixture(scope="session", autouse=True)
def clean_test_db():
    async def recreate():
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
            await conn.run_sync(Base.metadata.create_all)
    asyncio.run(recreate())
    yield
