package com.zeropscopilot.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

public record AiAnalysisResponse(

        UUID id,

        UUID deploymentId,

        String summary,

        String recommendations,

        Double confidence,

        LocalDateTime createdAt

) {
}