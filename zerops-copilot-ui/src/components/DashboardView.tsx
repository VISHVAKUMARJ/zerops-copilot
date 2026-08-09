import React, { useEffect, useState } from 'react';

import {
  Rocket,
  CheckCircle,
  XCircle,
  Bot,
} from 'lucide-react';

import DeploymentCard from './DeploymentCard';

/* =========================================================
   Types
   ========================================================= */

interface DeploymentStage {
  id: string;
  deploymentId?: string;
  name?: string;
  status?: string;
  startedAt?: string;
  finishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Deployment {
  id: string;
  projectId?: string;
  commitHash?: string;
  branchName?: string;
  status?: string;
  stages?: DeploymentStage[];
  createdAt?: string;
  updatedAt?: string;
}

interface AnalysisHistory {
  id?: string;
  deploymentId: string;
  confidence?: number;
  severity?: string;
  rootCause?: string;
  summary?: string;
  recommendations?: string;
  recommendedFix?: string[];
  createdAt?: string;
}

interface DashboardViewProps {
  onNavigateToDeployments: () => void;
  onNavigateToAnalysis?: (deploymentId: string) => void;
}

/* =========================================================
   Constants
   ========================================================= */

const PROJECT_ID =
  '5152c581-d863-433b-bb5b-c795bc3410d6';

/* =========================================================
   Component
   ========================================================= */

const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateToDeployments,
  onNavigateToAnalysis,
}) => {
  const [deployments, setDeployments] =
    useState<Deployment[]>([]);

  const [analyses, setAnalyses] =
    useState<AnalysisHistory[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  /* =======================================================
     Fetch dashboard data
     ======================================================= */

  const fetchDeployments = async () => {
    try {
      setIsLoading(true);
      setError(null);

      /* ---------------------------------------------------
         1. Fetch real deployments
         --------------------------------------------------- */

      const deploymentResponse =
        await fetch(
          `/api/v1/deployments/project/${PROJECT_ID}`
        );

      if (!deploymentResponse.ok) {
        const errorText =
          await deploymentResponse.text();

        throw new Error(
          `Failed to fetch deployments (${deploymentResponse.status}): ${
            errorText ||
            'Unknown backend error'
          }`
        );
      }

      const deploymentData: Deployment[] =
        await deploymentResponse.json();

      console.log(
        'Dashboard deployments:',
        deploymentData
      );

      /* ---------------------------------------------------
         2. Fetch detailed deployment information
         
         We do this because the project-level deployment
         response may say PENDING while the actual stage
         has FAILED.
         --------------------------------------------------- */

      const detailedDeployments =
        await Promise.all(
          deploymentData.map(
            async (deployment) => {
              try {
                const response =
                  await fetch(
                    `/api/v1/deployments/${deployment.id}`
                  );

                if (!response.ok) {
                  console.warn(
                    `Could not fetch deployment details for ${deployment.id}`
                  );

                  return deployment;
                }

                const details: Deployment =
                  await response.json();

                return {
                  ...deployment,
                  ...details,
                  stages:
                    details.stages ??
                    deployment.stages,
                };
              } catch (detailError) {
                console.warn(
                  `Deployment detail request failed for ${deployment.id}:`,
                  detailError
                );

                return deployment;
              }
            }
          )
        );

      console.log(
        'Dashboard detailed deployments:',
        detailedDeployments
      );

      setDeployments(
        detailedDeployments
      );

      /* ---------------------------------------------------
         3. Fetch AI analysis for each deployment
         --------------------------------------------------- */

      const analysisResults =
        await Promise.all(
          detailedDeployments.map(
            async (deployment) => {
              try {
                const response =
                  await fetch(
                    `/api/v1/ai-analyses/deployment/${deployment.id}`
                  );

                /*
                 * 404 means this deployment
                 * has not been analyzed yet.
                 */
                if (response.status === 404) {
                  return null;
                }

                if (!response.ok) {
                  console.warn(
                    `Could not fetch AI analysis for ${deployment.id}`
                  );

                  return null;
                }

                const data =
                  await response.json();

                console.log(
                  `AI analysis for ${deployment.id}:`,
                  data
                );

                return {
                  ...data,
                  deploymentId:
                    data.deploymentId ||
                    deployment.id,
                } as AnalysisHistory;
              } catch (analysisError) {
                console.warn(
                  `AI analysis request failed for ${deployment.id}:`,
                  analysisError
                );

                return null;
              }
            }
          )
        );

      /* ---------------------------------------------------
         4. Remove deployments without analysis
         --------------------------------------------------- */

      const validAnalyses =
        analysisResults.filter(
          (
            analysis
          ): analysis is AnalysisHistory =>
            analysis !== null
        );

      /* ---------------------------------------------------
         5. Newest analysis first
         --------------------------------------------------- */

      validAnalyses.sort((a, b) => {
        const dateA = a.createdAt
          ? new Date(
              a.createdAt
            ).getTime()
          : 0;

        const dateB = b.createdAt
          ? new Date(
              b.createdAt
            ).getTime()
          : 0;

        return dateB - dateA;
      });

      console.log(
        'AI analysis history:',
        validAnalyses
      );

      setAnalyses(
        validAnalyses
      );

    } catch (err: unknown) {
      console.error(
        'Dashboard fetch failed:',
        err
      );

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          'Unable to load dashboard data.'
        );
      }

    } finally {
      setIsLoading(false);
    }
  };

  /* =======================================================
     Load dashboard when component mounts
     ======================================================= */

  useEffect(() => {
    fetchDeployments();
  }, []);

  /* =======================================================
     Determine actual deployment status
     ======================================================= */

  const getEffectiveStatus = (
    deployment: Deployment
  ): string => {
    const stages =
      deployment.stages || [];

    /*
     * If any stage failed, the deployment
     * should be considered FAILED.
     */
    const failedStage =
      stages.find(
        (stage) =>
          stage.status?.toUpperCase() ===
          'FAILED'
      );

    if (failedStage) {
      return 'FAILED';
    }

    /*
     * If any stage is currently running,
     * consider deployment RUNNING.
     */
    const runningStage =
      stages.find(
        (stage) =>
          stage.status?.toUpperCase() ===
          'RUNNING'
      );

    if (runningStage) {
      return 'RUNNING';
    }

    /*
     * If all available stages are successful,
     * consider deployment SUCCESS.
     */
    if (
      stages.length > 0 &&
      stages.every(
        (stage) =>
          stage.status?.toUpperCase() ===
          'SUCCESS'
      )
    ) {
      return 'SUCCESS';
    }

    /*
     * Otherwise fall back to deployment status.
     */
    return (
      deployment.status?.toUpperCase() ||
      'UNKNOWN'
    );
  };

  /* =======================================================
     Deployment statistics
     * ======================================================= */

  const totalDeployments =
    deployments.length;

  const successfulDeployments =
    deployments.filter(
      (deployment) =>
        getEffectiveStatus(
          deployment
        ) === 'SUCCESS'
    ).length;

  const failedDeployments =
    deployments.filter(
      (deployment) =>
        getEffectiveStatus(
          deployment
        ) === 'FAILED'
    ).length;

  /* =======================================================
     Recent deployments
     * ======================================================= */

  const recentDeployments = [
    ...deployments,
  ]
    .sort((a, b) => {
      const dateA = a.createdAt
        ? new Date(
            a.createdAt
          ).getTime()
        : 0;

      const dateB = b.createdAt
        ? new Date(
            b.createdAt
          ).getTime()
        : 0;

      return dateB - dateA;
    })
    .slice(0, 2);

  /* =======================================================
     Recent AI analyses
     * ======================================================= */

  const recentAnalyses =
    analyses.slice(0, 2);

  /* =======================================================
     Confidence formatter
     * ======================================================= */

  const formatConfidence = (
    confidence?: number
  ): number | null => {
    if (
      confidence === undefined ||
      confidence === null ||
      Number.isNaN(confidence)
    ) {
      return null;
    }

    const percentage =
      confidence <= 1
        ? confidence * 100
        : confidence;

    return Math.round(
      Math.min(
        Math.max(
          percentage,
          0
        ),
        100
      )
    );
  };

  /* =======================================================
     Severity badge
     * ======================================================= */

  const getSeverityClass = (
    severity?: string
  ): string => {
    switch (
      severity?.toUpperCase()
    ) {
      case 'CRITICAL':
        return 'badge badge-error';

      case 'HIGH':
        return 'badge badge-error';

      case 'WARNING':
        return 'badge badge-warning';

      case 'MEDIUM':
        return 'badge badge-warning';

      case 'LOW':
        return 'badge badge-success';

      case 'INFO':
        return 'badge badge-success';

      case 'SUCCESS':
        return 'badge badge-success';

      default:
        return 'badge badge-error';
    }
  };

  /* =======================================================
     Loading state
     * ======================================================= */

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        <h2
          style={{
            marginBottom: 0,
          }}
        >
          Dashboard Overview
        </h2>

        <div className="card">
          Loading dashboard data...
        </div>
      </div>
    );
  }

  /* =======================================================
     Error state
     * ======================================================= */

  if (error) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent:
              'space-between',
            alignItems: 'center',
          }}
        >
          <h2
            style={{
              marginBottom: 0,
            }}
          >
            Dashboard Overview
          </h2>

          <button
            className="btn"
            onClick={
              fetchDeployments
            }
          >
            Retry
          </button>
        </div>

        <div
          className="card"
          style={{
            borderColor:
              'var(--color-error)',
            color:
              'var(--color-error)',
          }}
        >
          {error}
        </div>
      </div>
    );
  }

  /* =======================================================
     Dashboard UI
     * ======================================================= */

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}
    >
      {/* =================================================
          Header
          ================================================= */}

      <div
        style={{
          display: 'flex',
          justifyContent:
            'space-between',
          alignItems: 'center',
        }}
      >
        <h2
          style={{
            marginBottom: 0,
          }}
        >
          Dashboard Overview
        </h2>

        <button
          className="btn"
          onClick={
            fetchDeployments
          }
        >
          Refresh
        </button>
      </div>

      {/* =================================================
          Statistics
          ================================================= */}

      <div
        className="grid-3"
        style={{
          gridTemplateColumns:
            'repeat(4, 1fr)',
        }}
      >
        {/* Total Deployments */}

        <div className="card flex items-center justify-between">
          <div>
            <h4 className="text-muted text-sm mb-1">
              Total Deployments
            </h4>

            <span className="text-lg font-semibold">
              {totalDeployments}
            </span>
          </div>

          <Rocket
            size={32}
            color="var(--accent-color)"
            style={{
              opacity: 0.2,
            }}
          />
        </div>

        {/* Successful */}

        <div className="card flex items-center justify-between">
          <div>
            <h4 className="text-muted text-sm mb-1">
              Successful
            </h4>

            <span className="text-lg font-semibold">
              {successfulDeployments}
            </span>
          </div>

          <CheckCircle
            size={32}
            color="var(--color-success)"
            style={{
              opacity: 0.2,
            }}
          />
        </div>

        {/* Failed */}

        <div
          className="card flex items-center justify-between"
          style={{
            borderColor:
              'var(--color-error)',
          }}
        >
          <div>
            <h4 className="text-muted text-sm mb-1">
              Failed
            </h4>

            <span
              className="text-lg font-semibold"
              style={{
                color:
                  'var(--color-error)',
              }}
            >
              {failedDeployments}
            </span>
          </div>

          <XCircle
            size={32}
            color="var(--color-error)"
            style={{
              opacity: 0.2,
            }}
          />
        </div>

        {/* AI Analyses */}

        <div className="card flex items-center justify-between">
          <div>
            <h4 className="text-muted text-sm mb-1">
              AI Analyses
            </h4>

            <span className="text-lg font-semibold">
              {analyses.length}
            </span>

            <div
              className="text-muted"
              style={{
                fontSize: '11px',
                marginTop: '4px',
              }}
            >
              Completed analyses
            </div>
          </div>

          <Bot
            size={32}
            color="var(--accent-color)"
            style={{
              opacity: 0.2,
            }}
          />
        </div>
      </div>

      {/* =================================================
          Recent Deployments + Recent AI Analysis
          ================================================= */}

      <div className="grid-2 mt-4">

        {/* =================================================
            Recent Deployments
            ================================================= */}

        <div>
          <div
            className="flex justify-between items-center mb-4"
          >
            <h3
              style={{
                marginBottom: 0,
              }}
            >
              Recent Deployments
            </h3>

            <button
              className="btn"
              onClick={
                onNavigateToDeployments
              }
            >
              View All
            </button>
          </div>

          {recentDeployments.length ===
          0 ? (
            <div className="card">
              No deployments found.
            </div>
          ) : (
            recentDeployments.map(
              (deployment) => {
                const effectiveStatus =
                  getEffectiveStatus(
                    deployment
                  );

                return (
                  <div
                    key={
                      deployment.id
                    }
                    style={{
                      cursor:
                        onNavigateToAnalysis
                          ? 'pointer'
                          : 'default',
                    }}
                    onClick={() => {
                      if (
                        onNavigateToAnalysis
                      ) {
                        onNavigateToAnalysis(
                          deployment.id
                        );
                      }
                    }}
                  >
                    <DeploymentCard
                      id={
                        deployment.id
                      }
                      status={
                        effectiveStatus
                      }
                      branchName={
                        deployment.branchName
                      }
                      commitHash={
                        deployment.commitHash
                      }
                      createdAt={
                        deployment.createdAt
                      }
                    />
                  </div>
                );
              }
            )
          )}
        </div>

        {/* =================================================
            Recent AI Analysis
            ================================================= */}

        <div>
          <h3 className="mb-4">
            Recent AI Analysis
          </h3>

          {recentAnalyses.length ===
          0 ? (
            <div
              className="card"
              style={{
                display: 'flex',
                flexDirection:
                  'column',
                gap: '12px',
              }}
            >
              <div className="flex items-center gap-2">
                <Bot
                  size={20}
                  color="var(--accent-color)"
                />

                <span className="font-semibold">
                  AI Copilot
                </span>
              </div>

              <p className="text-sm text-muted mb-0">
                No AI analyses have
                been completed yet.
              </p>

              <p className="text-sm text-muted mb-0">
                Select a deployment
                and click
                "Analyze with Copilot"
                to generate an
                analysis.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection:
                  'column',
                gap: '16px',
              }}
            >
              {recentAnalyses.map(
                (analysis) => {
                  const deployment =
                    deployments.find(
                      (item) =>
                        item.id ===
                        analysis.deploymentId
                    );

                  const severity =
                    analysis.severity ||
                    'CRITICAL';

                  const summary =
                    analysis.summary ||
                    analysis.rootCause ||
                    'AI analysis completed for this deployment.';

                  const confidence =
                    formatConfidence(
                      analysis.confidence
                    );

                  return (
                    <div
                      key={
                        analysis.id ||
                        analysis.deploymentId
                      }
                      className="card"
                      style={{
                        cursor:
                          onNavigateToAnalysis
                            ? 'pointer'
                            : 'default',

                        borderLeft:
                          '4px solid var(--color-error)',
                      }}
                      onClick={() => {
                        if (
                          onNavigateToAnalysis
                        ) {
                          onNavigateToAnalysis(
                            analysis.deploymentId
                          );
                        }
                      }}
                    >
                      {/* Analysis header */}

                      <div
                        className="flex justify-between items-center"
                      >
                        <span className="font-semibold">
                          {deployment
                            ? deployment.id
                            : analysis.deploymentId}
                        </span>

                        <span
                          className={getSeverityClass(
                            severity
                          )}
                        >
                          {severity.toUpperCase()}
                        </span>
                      </div>

                      {/* Summary */}

                      <p
                        className="text-sm text-muted"
                        style={{
                          marginTop:
                            '12px',
                          marginBottom:
                            '12px',
                          lineHeight: 1.5,
                        }}
                      >
                        {summary}
                      </p>

                      {/* Confidence */}

                      {confidence !==
                        null && (
                        <div className="flex items-center gap-2">
                          <Bot
                            size={16}
                            color="var(--color-success)"
                          />

                          <span className="text-sm">
                            {confidence}%
                            Confidence
                          </span>
                        </div>
                      )}

                      {/* Analysis date */}

                      {analysis.createdAt && (
                        <div
                          className="text-muted"
                          style={{
                            fontSize:
                              '11px',
                            marginTop:
                              '8px',
                          }}
                        >
                          Analyzed:{' '}
                          {new Date(
                            analysis.createdAt
                          ).toLocaleString()}
                        </div>
                      )}
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardView;