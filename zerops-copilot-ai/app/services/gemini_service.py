import json
import logging

from google import genai

from app.core.config import settings
from app.services.prompt_builder import PromptBuilder

logger = logging.getLogger(__name__)


class GeminiService:

    def __init__(self):

        if not settings.GEMINI_API_KEY:
            raise ValueError("Gemini API key not configured.")

        self.client = genai.Client(
            api_key=settings.GEMINI_API_KEY
        )

        self.model = "gemini-2.5-flash"

    async def analyze_logs(self, logs: str):

        fallback = {
            "rootCause": "Unable to analyze",
            "severity": "UNKNOWN",
            "confidence": 0,
            "summary": "AI analysis failed.",
            "recommendations": []
        }

        try:

            prompt = PromptBuilder.build(logs)

            logger.info("Sending logs to Gemini...")

            response = self.client.models.generate_content(
                model=self.model,
                contents=prompt,
            )

            text = response.text

            print("\n================ GEMINI RAW RESPONSE ================\n")
            print(text)
            print("\n=====================================================\n")

            if not text:
                fallback["summary"] = "Gemini returned an empty response."
                return fallback

            text = text.strip()

            # Remove markdown code blocks if Gemini wraps JSON
            if text.startswith("```"):
                text = text.replace("```json", "")
                text = text.replace("```", "")
                text = text.strip()

            logger.info("Parsing Gemini JSON response...")

            parsed = json.loads(text)

            return {
                "rootCause": parsed.get("rootCause", "Unknown"),
                "severity": parsed.get("severity", "UNKNOWN"),
                "confidence": parsed.get("confidence", 0),
                "summary": parsed.get("summary", ""),
                "recommendations": parsed.get("recommendations", [])
            }

        except json.JSONDecodeError as ex:

            logger.exception("Gemini returned invalid JSON.")

            fallback["summary"] = f"Invalid JSON: {ex}"

            return fallback

        except Exception as ex:

            logger.exception("Unexpected Gemini error")

            fallback["summary"] = str(ex)

            return fallback