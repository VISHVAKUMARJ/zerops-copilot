package com.zeropscopilot.repository;

import com.zeropscopilot.entity.DeploymentStage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DeploymentStageRepository extends JpaRepository<DeploymentStage, UUID> {
    List<DeploymentStage> findByDeploymentId(UUID deploymentId);
    List<DeploymentStage> findByDeploymentIdOrderByCreatedAtAsc(UUID deploymentId);
}
