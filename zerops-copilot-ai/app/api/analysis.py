import logging
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status

from app.models.request import AnalyzeDeploymentRequest
from app.models.response import AnalyzeDeploymentResponse
from app.services.gemini_service import GeminiService

logger = logging.getLogger(__name__)

router = APIRouter()


def get_gemini_service() -> GeminiService:
    return GeminiService()


@router.post(
    "/internal/api/v1/analyze",
    response_model=AnalyzeDeploymentResponse,
    status_code=status.HTTP_200_OK,
    summary="Analyze deployment logs",
    description="Analyze deployment logs using Google Gemini."
)
async def analyze_deployment(
    request: AnalyzeDeploymentRequest,
    gemini_service: Annotated[GeminiService, Depends(get_gemini_service)]
) -> AnalyzeDeploymentResponse:

    logger.info(
        "Received analysis request for deploymentId: %s",
        request.deploymentId
    )

    try:

        analysis_result = await gemini_service.analyze_logs(
            request.logs
        )

        logger.info(
            "Analysis completed successfully for deploymentId: %s",
            request.deploymentId
        )

        return AnalyzeDeploymentResponse(**analysis_result)

    except ValueError as ex:

        logger.exception(ex)

        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(ex)
        )

    except Exception as ex:

        logger.exception(ex)

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while analyzing deployment logs."
        )