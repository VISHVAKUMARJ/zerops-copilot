package com.zeropscopilot.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record CreateAiAnalysisRequest(
                @NotNull(message = "Deployment ID is required") UUID deploymentId,

                @NotBlank(message = "Summary is required") String summary,

                String recommendations,

                Double successProbabilityScore) {
}
