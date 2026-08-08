import asyncio

from app.services.gemini_service import GeminiService

from app.core.config import settings

print("Loaded key:", settings.GEMINI_API_KEY)
print("Starts with:", settings.GEMINI_API_KEY[:10])

async def main():

    service = GeminiService()

    result = await service.analyze_logs("""

Application failed.

Caused by

Database Connection Refused

Connection Timeout

    """)

    print(result)


asyncio.run(main())