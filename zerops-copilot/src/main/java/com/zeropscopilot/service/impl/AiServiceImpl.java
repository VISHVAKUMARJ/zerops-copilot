package com.zeropscopilot.service.impl;

import com.zeropscopilot.client.AiClient;
import com.zeropscopilot.dto.request.AiServiceRequest;
import com.zeropscopilot.dto.response.AiServiceResponse;
import com.zeropscopilot.service.AiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AiServiceImpl implements AiService {

    private final AiClient aiClient;

    @Override
    public AiServiceResponse analyzeDeployment(AiServiceRequest request) {

        log.info("Sending deployment logs to AI Service...");

        AiServiceResponse response = aiClient.analyzeDeployment(request);

        log.info("AI Analysis completed successfully.");

        return response;
    }
}