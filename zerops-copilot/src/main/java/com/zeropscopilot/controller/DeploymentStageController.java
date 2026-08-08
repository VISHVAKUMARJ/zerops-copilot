package com.zeropscopilot.controller;

import com.zeropscopilot.dto.request.CreateDeploymentStageRequest;
import com.zeropscopilot.dto.request.UpdateDeploymentStageStatusRequest;
import com.zeropscopilot.dto.response.DeploymentStageResponse;
import com.zeropscopilot.service.DeploymentStageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/deployment-stages")
@RequiredArgsConstructor
public class DeploymentStageController {

    private final DeploymentStageService deploymentStageService;

    @PostMapping
    public ResponseEntity<DeploymentStageResponse> createStage(
            @Valid @RequestBody CreateDeploymentStageRequest request) {

        DeploymentStageResponse response = deploymentStageService.createStage(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping("/{stageId}")
    public ResponseEntity<DeploymentStageResponse> getStageById(
            @PathVariable UUID stageId) {

        return ResponseEntity.ok(
                deploymentStageService.getStageById(stageId));
    }

    @GetMapping("/deployment/{deploymentId}")
    public ResponseEntity<List<DeploymentStageResponse>> getStagesByDeploymentId(
            @PathVariable UUID deploymentId) {

        return ResponseEntity.ok(
                deploymentStageService
                        .getStagesByDeploymentId(deploymentId));
    }

    @PatchMapping("/{stageId}/status")
    public ResponseEntity<DeploymentStageResponse> updateStageStatus(
            @PathVariable UUID stageId,
            @Valid @RequestBody UpdateDeploymentStageStatusRequest request) {

        return ResponseEntity.ok(
                deploymentStageService.updateStageStatus(
                        stageId,
                        request));
    }
}