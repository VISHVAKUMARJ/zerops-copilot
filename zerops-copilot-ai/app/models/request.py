from pydantic import BaseModel, Field

class AnalyzeDeploymentRequest(BaseModel):
    deploymentId: str = Field(..., description="The ID of the deployment")
    logs: str = Field(..., description="The logs of the deployment to analyze")
