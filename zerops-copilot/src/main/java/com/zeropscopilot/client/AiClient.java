package com.zeropscopilot.client;

import com.zeropscopilot.dto.request.AiServiceRequest;
import com.zeropscopilot.dto.response.AiServiceResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

@Component
@RequiredArgsConstructor
public class AiClient {

    private final WebClient webClient;

    public AiServiceResponse analyzeDeployment(AiServiceRequest request) {

        return webClient
                .post()
                .uri("/internal/api/v1/analyze")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(AiServiceResponse.class)
                .block();
    }
}