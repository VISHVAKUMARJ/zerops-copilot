package com.zeropscopilot.controller;

import com.zeropscopilot.dto.request.CreateAiAnalysisRequest;
import com.zeropscopilot.dto.response.AiAnalysisResponse;
import com.zeropscopilot.service.AiAnalysisService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/ai-analyses")
@RequiredArgsConstructor
@Tag(name = "AI Analysis", description = "Endpoints for managing AI analyses of deployments")
public class AiAnalysisController {

    private final AiAnalysisService aiAnalysisService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create an AI analysis", description = "Creates a new AI analysis for a specific deployment.")
    public ResponseEntity<AiAnalysisResponse> createAnalysis(@Valid @RequestBody CreateAiAnalysisRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(aiAnalysisService.createAnalysis(request));
    }

    @GetMapping("/deployment/{deploymentId}")
    @Operation(summary = "Get AI analysis by Deployment ID", description = "Retrieves the AI analysis associated with a specific deployment.")
    public ResponseEntity<AiAnalysisResponse> getAnalysisByDeploymentId(@PathVariable UUID deploymentId) {
        return ResponseEntity.ok(aiAnalysisService.getAnalysisByDeploymentId(deploymentId));
    }
}
