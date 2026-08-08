from pydantic import BaseModel, Field
from typing import List

class AnalyzeDeploymentResponse(BaseModel):
    rootCause: str = Field(..., description="The root cause of the deployment failure")
    severity: str = Field(..., description="The severity of the issue (e.g., HIGH, MEDIUM, LOW)")
    confidence: float = Field(..., ge=0, le=100, description="Confidence percentage of the analysis")
    summary: str = Field(..., description="A summary of the issue")
    recommendations: List[str] = Field(..., description="List of recommended fixes")
