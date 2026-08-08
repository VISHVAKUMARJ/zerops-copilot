package com.zeropscopilot.dto.request;

import jakarta.validation.constraints.NotBlank;

public record AiServiceRequest(

                @NotBlank String deploymentId,

                @NotBlank String logs

) {
}