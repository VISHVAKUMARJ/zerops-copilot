import React from 'react';
import {
  GitBranch,
  GitCommit,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';

interface DeploymentCardProps {
  id: string;
  status?: string;
  branchName?: string;
  commitHash?: string;
  createdAt?: string;
}

const DeploymentCard: React.FC<DeploymentCardProps> = ({
  id,
  status,
  branchName,
  commitHash,
  createdAt,
}) => {
  const normalizedStatus =
    status?.toUpperCase() || 'UNKNOWN';

  const getStatusColor = () => {
    switch (normalizedStatus) {
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

  const getStatusClass = () => {
    switch (normalizedStatus) {
      case 'SUCCESS':
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

  const getStatusIcon = () => {
    switch (normalizedStatus) {
      case 'SUCCESS':
        return (
          <CheckCircle
            size={24}
            color="var(--color-success)"
          />
        );

      case 'FAILED':
        return (
          <XCircle
            size={24}
            color="var(--color-error)"
          />
        );

      case 'RUNNING':
      case 'PENDING':
        return (
          <AlertCircle
            size={24}
            color="var(--color-warning)"
          />
        );

      default:
        return (
          <AlertCircle
            size={24}
            color="var(--text-muted)"
          />
        );
    }
  };

  const formattedTime = createdAt
    ? new Date(createdAt).toLocaleString()
    : 'N/A';

  return (
    <div
      className="card mb-6"
      style={{
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Status indicator */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '4px',
          height: '100%',
          backgroundColor: getStatusColor(),
        }}
      />

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div
            style={{
              backgroundColor:
                'rgba(88, 166, 255, 0.1)',
              padding: '8px',
              borderRadius: '8px',
            }}
          >
            {getStatusIcon()}
          </div>

          <div>
            <h3
              style={{
                marginBottom: 0,
                fontSize: '18px',
              }}
            >
              {id}
            </h3>

            <span className="text-muted text-sm">
              Production Environment
            </span>
          </div>
        </div>

        <span className={getStatusClass()}>
          {normalizedStatus}
        </span>
      </div>

      {/* Deployment information */}
      <div
        className="flex"
        style={{
          gap: '32px',
          flexWrap: 'wrap',
        }}
      >
        {/* Branch */}
        <div className="flex items-center gap-2 text-muted text-sm">
          <GitBranch size={16} />

          <span>
            Branch:{' '}

            <strong
              style={{
                color: 'var(--text-main)',
              }}
            >
              {branchName || 'N/A'}
            </strong>
          </span>
        </div>

        {/* Commit */}
        <div className="flex items-center gap-2 text-muted text-sm">
          <GitCommit size={16} />

          <span>
            Commit:{' '}

            <strong
              style={{
                color: 'var(--text-main)',
              }}
            >
              {commitHash || 'N/A'}
            </strong>
          </span>
        </div>

        {/* Created time */}
        <div className="flex items-center gap-2 text-muted text-sm">
          <Clock size={16} />

          <span>
            Time:{' '}

            <strong
              style={{
                color: 'var(--text-main)',
              }}
            >
              {formattedTime}
            </strong>
          </span>
        </div>
      </div>
    </div>
  );
};

export default DeploymentCard;