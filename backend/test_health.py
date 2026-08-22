import asyncio
from httpx import AsyncClient, ASGITransport
from app.main import app


async def test():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Test /health
        res_health = await client.get("/health")
        print("Health Endpoint Status:", res_health.status_code)
        print("Health Body:", res_health.json())
        assert res_health.status_code == 200
        assert res_health.json()["status"] == "healthy"

        # Test /docs
        res_docs = await client.get("/docs")
        print("Docs Endpoint Status:", res_docs.status_code)
        assert res_docs.status_code == 200

        # Test /api/v1/openapi.json
        res_openapi = await client.get("/api/v1/openapi.json")
        print("OpenAPI Endpoint Status:", res_openapi.status_code)
        assert res_openapi.status_code == 200

        print("\nDEV ENVIRONMENT VERIFICATION PASSED SUCCESSFULLY!")


if __name__ == "__main__":
    asyncio.run(test())
