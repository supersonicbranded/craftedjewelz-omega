import pytest
import httpx
from app.main import app

@pytest.mark.asyncio
async def test_root():
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/")
    assert response.status_code == 200
    assert response.json() == {"ok": True}

@pytest.mark.asyncio
async def test_register_and_login():
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as ac:
        reg_data = {"username": "testuser", "email": "test@example.com", "password": "testpass"}
        reg_resp = await ac.post("/register", json=reg_data)
        assert reg_resp.status_code == 200
        user = reg_resp.json()
        assert user["username"] == "testuser"
        login_resp = await ac.post("/login", json=reg_data)
        assert login_resp.status_code == 200
        token = login_resp.json()
        assert "access_token" in token
        assert token["token_type"] == "bearer"
