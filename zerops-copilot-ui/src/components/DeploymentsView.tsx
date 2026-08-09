import React, { useEffect, useState } from 'react';

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

interface DeploymentsViewProps {
  onNavigateToAnalysis: (
    deploymentId: string
  ) => void;
}

const PROJECT_ID =
  '5152c581-d863-433b-bb5b-c795bc3410d6';

const DeploymentsView: React.FC<
  DeploymentsViewProps
> = ({
  onNavigateToAnalysis,
}) => {
  const [deployments, setDeployments] =
    useState<Deployment[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  /*
   * -----------------------------------------
   * Fetch deployments when page loads
   * -----------------------------------------
   */

  useEffect(() => {
    fetchDeployments();
  }, []);

  /*
   * -----------------------------------------
   * Fetch deployments from backend
   * -----------------------------------------
   */

  const fetchDeployments = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const url =
        `/api/v1/deployments/project/${PROJECT_ID}`;

      console.log(
        'Fetching deployments:',
        url
      );

      const response =
        await fetch(url);

      if (!response.ok) {
        const errorText =
          await response.text();

        throw new Error(
          `Failed to fetch deployments (${response.status}): ${
            errorText ||
            'Unknown backend error'
          }`
        );
      }

      const data: Deployment[] =
        await response.json();

      console.log(
        'Real deployments from backend:',
        data
      );

      setDeployments(data);

    } catch (err: unknown) {
      console.error(
        'Failed to fetch deployments:',
        err
      );

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          'Unable to load deployments.'
        );
      }

    } finally {
      setIsLoading(false);
    }
  };

  /*
   * -----------------------------------------
   * Determine the REAL deployment status
   * -----------------------------------------
   *
   * Sometimes the deployment itself may say
   * PENDING while one of its stages has FAILED.
   *
   * We therefore inspect the stages first.
   */

  const getEffectiveStatus = (
    deployment: Deployment
  ): string => {
    const stages =
      deployment.stages || [];

    const stageStatuses =
      stages.map(
        (stage) =>
          stage.status?.toUpperCase()
      );

    /*
     * FAILED has highest priority.
     */
    if (
      stageStatuses.includes('FAILED')
    ) {
      return 'FAILED';
    }

    /*
     * Then check RUNNING.
     */
    if (
      stageStatuses.includes('RUNNING')
    ) {
      return 'RUNNING';
    }

    /*
     * Then check PENDING.
     */
    if (
      stageStatuses.includes('PENDING')
    ) {
      return 'PENDING';
    }

    /*
     * If all stages completed successfully.
     */
    if (
      stageStatuses.length > 0 &&
      stageStatuses.every(
        (status) =>
          status === 'SUCCESS' ||
          status === 'COMPLETED'
      )
    ) {
      return 'SUCCESS';
    }

    /*
     * Fall back to deployment status.
     */
    return (
      deployment.status?.toUpperCase() ||
      'UNKNOWN'
    );
  };

  /*
   * -----------------------------------------
   * Status badge
   * -----------------------------------------
   */

  const getStatusClass = (
    status: string
  ) => {
    switch (
      status.toUpperCase()
    ) {
      case 'SUCCESS':
        return 'badge badge-success';

      case 'FAILED':
        return 'badge badge-error';

      case 'RUNNING':
        return 'badge badge-warning';

      case 'PENDING':
        return 'badge badge-warning';

      default:
        return 'badge';
    }
  };

  /*
   * -----------------------------------------
   * Status left border
   * -----------------------------------------
   */

  const getStatusColor = (
    status: string
  ) => {
    switch (
      status.toUpperCase()
    ) {
      case 'SUCCESS':
        return 'var(--color-success)';

      case 'FAILED':
        return 'var(--color-error)';

      case 'RUNNING':
      case 'PENDING':
        return 'var(--color-warning)';

      default:
        return 'var(--border-color)';
    }
  };

  /*
   * -----------------------------------------
   * Stage status badge
   * -----------------------------------------
   */

  const getStageStatusClass = (
    status?: string
  ) => {
    switch (
      status?.toUpperCase()
    ) {
      case 'SUCCESS':
      case 'COMPLETED':
        return 'badge badge-success';

      case 'FAILED':
        return 'badge badge-error';

      case 'RUNNING':
      case 'PENDING':
        return 'badge badge-warning';

      default:
        return 'badge';
    }
  };

  /*
   * -----------------------------------------
   * Loading state
   * -----------------------------------------
   */

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection:
            'column',
          gap: '24px',
        }}
      >
        <h2
          style={{
            marginBottom: 0,
          }}
        >
          Deployments
        </h2>

        <div className="card">
          Loading deployments...
        </div>
      </div>
    );
  }

  /*
   * -----------------------------------------
   * Error state
   * -----------------------------------------
   */

  if (error) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection:
            'column',
          gap: '24px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent:
              'space-between',
            alignItems:
              'center',
          }}
        >
          <h2
            style={{
              marginBottom: 0,
            }}
          >
            Deployments
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

  /*
   * -----------------------------------------
   * Main deployment list
   * -----------------------------------------
   */

  return (
    <div
      style={{
        display: 'flex',
        flexDirection:
          'column',
        gap: '24px',
      }}
    >
      {/* Header */}

      <div
        style={{
          display: 'flex',
          justifyContent:
            'space-between',
          alignItems:
            'center',
        }}
      >
        <h2
          style={{
            marginBottom: 0,
          }}
        >
          Deployments
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

      {/* Empty state */}

      {deployments.length ===
      0 ? (
        <div className="card">
          No deployments found
          for this project.
        </div>
      ) : (
        deployments.map(
          (deployment) => {
            /*
             * Calculate actual status
             * using stages.
             */
            const status =
              getEffectiveStatus(
                deployment
              );

            return (
              <div
                key={deployment.id}
                className="card"
                style={{
                  position:
                    'relative',
                  overflow:
                    'hidden',
                  cursor:
                    'pointer',
                }}
                onClick={() =>
                  onNavigateToAnalysis(
                    deployment.id
                  )
                }
              >
                {/* Status indicator */}

                <div
                  style={{
                    position:
                      'absolute',
                    top: 0,
                    left: 0,
                    width: '4px',
                    height:
                      '100%',
                    backgroundColor:
                      getStatusColor(
                        status
                      ),
                  }}
                />

                {/* Deployment header */}

                <div
                  className="flex justify-between items-center mb-4"
                >
                  <div>
                    <h3
                      style={{
                        marginBottom:
                          0,
                        fontSize:
                          '18px',
                      }}
                    >
                      {
                        deployment.id
                      }
                    </h3>

                    <span className="text-muted text-sm">
                      Production
                      Environment
                    </span>
                  </div>

                  <span
                    className={getStatusClass(
                      status
                    )}
                  >
                    {status}
                  </span>
                </div>

                {/* Deployment information */}

                <div
                  className="flex text-muted text-sm gap-4"
                  style={{
                    flexWrap:
                      'wrap',
                  }}
                >
                  <span>
                    Branch:{' '}

                    <strong
                      style={{
                        color:
                          'var(--text-main)',
                      }}
                    >
                      {deployment.branchName ||
                        'N/A'}
                    </strong>
                  </span>

                  <span>
                    Commit:{' '}

                    <strong
                      style={{
                        color:
                          'var(--text-main)',
                      }}
                    >
                      {deployment.commitHash ||
                        'N/A'}
                    </strong>
                  </span>

                  <span>
                    Created:{' '}

                    <strong
                      style={{
                        color:
                          'var(--text-main)',
                      }}
                    >
                      {deployment.createdAt
                        ? new Date(
                            deployment.createdAt
                          ).toLocaleString()
                        : 'N/A'}
                    </strong>
                  </span>
                </div>

                {/* Stage summary */}

                {deployment.stages &&
                  deployment
                    .stages
                    .length >
                    0 && (
                    <div
                      style={{
                        marginTop:
                          '20px',
                        paddingTop:
                          '16px',
                        borderTop:
                          '1px solid var(--border-color)',
                      }}
                    >
                      <div
                        className="text-muted text-sm"
                        style={{
                          marginBottom:
                            '10px',
                        }}
                      >
                        Deployment
                        Stages
                      </div>

                      <div
                        style={{
                          display:
                            'flex',
                          flexDirection:
                            'column',
                          gap:
                            '8px',
                        }}
                      >
                        {deployment.stages.map(
                          (
                            stage
                          ) => (
                            <div
                              key={
                                stage.id
                              }
                              style={{
                                display:
                                  'flex',
                                justifyContent:
                                  'space-between',
                                alignItems:
                                  'center',
                                padding:
                                  '8px 10px',
                                borderRadius:
                                  '6px',
                                backgroundColor:
                                  'rgba(255,255,255,0.02)',
                              }}
                            >
                              <span
                                style={{
                                  fontSize:
                                    '13px',
                                }}
                              >
                                {stage.name ||
                                  'Unnamed Stage'}
                              </span>

                              <span
                                className={getStageStatusClass(
                                  stage.status
                                )}
                                style={{
                                  fontSize:
                                    '11px',
                                }}
                              >
                                {stage.status?.toUpperCase() ||
                                  'UNKNOWN'}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {/* Deployment ID */}

                <div
                  className="text-muted text-sm"
                  style={{
                    marginTop:
                      '12px',
                    fontSize:
                      '11px',
                  }}
                >
                  ID:{' '}
                  {deployment.id}
                </div>

                {/* Click hint */}

                <div
                  style={{
                    marginTop:
                      '12px',
                    color:
                      'var(--accent-color)',
                    fontSize:
                      '12px',
                  }}
                >
                  Click to analyze
                  deployment →
                </div>
              </div>
            );
          }
        )
      )}
    </div>
  );
};

export default DeploymentsView;