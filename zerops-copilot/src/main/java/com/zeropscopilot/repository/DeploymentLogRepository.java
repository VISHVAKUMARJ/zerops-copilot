package com.zeropscopilot.repository;

import com.zeropscopilot.entity.DeploymentLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DeploymentLogRepository extends JpaRepository<DeploymentLog, UUID> {

    List<DeploymentLog> findByStageId(UUID stageId);

    List<DeploymentLog> findByStageIdOrderByTimestampAsc(UUID stageId);

    List<DeploymentLog> findByStageIdAndLevelOrderByTimestampAsc(
            UUID stageId,
            DeploymentLog.LogLevel level);

    List<DeploymentLog> findByStage_Deployment_IdOrderByTimestampAsc(
            UUID deploymentId);
}