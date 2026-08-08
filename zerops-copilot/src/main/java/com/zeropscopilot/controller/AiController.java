package com.zeropscopilot.controller;

import com.zeropscopilot.dto.request.AiServiceRequest;
import com.zeropscopilot.dto.response.AiAnalysisResponse;
import com.zeropscopilot.service.DeploymentAnalysisService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
public class AiController {

    private final DeploymentAnalysisService deploymentAnalysisService;

    @PostMapping("/analyze")
    public ResponseEntity<AiAnalysisResponse> analyzeDeployment(
            @Valid @RequestBody AiServiceRequest request) {

        AiAnalysisResponse response = deploymentAnalysisService.analyzeAndSave(request);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/analysis/{deploymentId}")
    public ResponseEntity<AiAnalysisResponse> getAnalysis(
            @PathVariable UUID deploymentId) {

        AiAnalysisResponse response = deploymentAnalysisService.getAnalysisByDeploymentId(
                deploymentId);

        return ResponseEntity.ok(response);
    }
}