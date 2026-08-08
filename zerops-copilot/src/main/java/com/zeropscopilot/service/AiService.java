package com.zeropscopilot.service;

import com.zeropscopilot.dto.request.AiServiceRequest;
import com.zeropscopilot.dto.response.AiServiceResponse;

public interface AiService {

    AiServiceResponse analyzeDeployment(AiServiceRequest request);

}