package com.zeropscopilot.dto.response;

import java.util.List;

public record AiServiceResponse(

        String rootCause,

        String severity,

        Double confidence,

        String summary,

        List<String> recommendations

) {
}