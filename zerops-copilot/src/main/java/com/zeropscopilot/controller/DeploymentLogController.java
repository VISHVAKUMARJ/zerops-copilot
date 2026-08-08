package com.zeropscopilot.controller;

import com.zeropscopilot.dto.request.CreateDeploymentLogRequest;
import com.zeropscopilot.dto.response.DeploymentLogResponse;
import com.zeropscopilot.service.DeploymentLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/deployment-logs")
@RequiredArgsConstructor
@Tag(name = "Deployment Logs", description = "Endpoints for managing and retrieving deployment logs")
public class DeploymentLogController {

    private final DeploymentLogService deploymentLogService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Add a new log entry", description = "Adds a log entry for a specific deployment stage.")
    public ResponseEntity<DeploymentLogResponse> addLog(@Valid @RequestBody CreateDeploymentLogRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(deploymentLogService.addLog(request));
    }

    @GetMapping("/stage/{stageId}")
    @Operation(summary = "Get logs by Stage ID", description = "Retrieves all logs for a specific deployment stage, sorted chronologically.")
    public ResponseEntity<List<DeploymentLogResponse>> getLogsByStageId(@PathVariable UUID stageId) {
        return ResponseEntity.ok(deploymentLogService.getLogsByStageId(stageId));
    }
}
