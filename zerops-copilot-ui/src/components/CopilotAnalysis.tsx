import React from 'react';
import {
  Bot,
  CheckCircle,
  ShieldAlert,
  Cpu,
} from 'lucide-react';

import { AiAnalysisResponse } from '../types';
import { SeverityBadge } from './SeverityBadge';
import FilesToCheck from './FilesToCheck';

interface CopilotAnalysisProps {
  analysis: AiAnalysisResponse | null;
  isLoading: boolean;
  onAnalyze: () => void;
  error: string | null;
}

/*
 * Backend currently returns:
 *
 * {
 *   confidence: 1,
 *   recommendations: "...",
 *   summary: "...",
 *   deploymentId: "...",
 *   id: "...",
 *   createdAt: "..."
 * }
 *
 * But the frontend may also receive the richer format:
 *
 * {
 *   severity,
 *   rootCause,
 *   recommendedFix,
 *   filesToCheck
 * }
 *
 * This type allows us to safely support both.
 */
type ExtendedAnalysis = AiAnalysisResponse & {
  recommendations?: string | string[];
  deploymentId?: string;
  id?: string;
  createdAt?: string;
};

const CopilotAnalysis: React.FC<CopilotAnalysisProps> = ({
  analysis,
  isLoading,
  onAnalyze,
  error,
}) => {
  /*
   * ERROR STATE
   */
  if (error) {
    return (
      <div
        className="card flex items-center justify-between"
        style={{
          borderColor: 'var(--color-error)',
          backgroundColor: 'rgba(218, 54, 51, 0.05)',
          gap: '20px',
        }}
      >
        <span
          style={{
            color: 'var(--color-error)',
            lineHeight: 1.5,
          }}
        >
          {error}
        </span>

        <button
          className="btn"
          onClick={onAnalyze}
        >
          Retry
        </button>
      </div>
    );
  }

  /*
   * LOADING STATE
   */
  if (isLoading) {
    return (
      <div
        className="card"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '64px 24px',
          background:
            'linear-gradient(180deg, var(--bg-panel) 0%, rgba(13,17,23,1) 100%)',
        }}
      >
        <div
          className="animate-spin mb-4"
          style={{
            background:
              'linear-gradient(135deg, var(--accent-color), #8a2be2)',
            padding: '16px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow:
              '0 0 20px rgba(88, 166, 255, 0.4)',
          }}
        >
          <Bot
            size={28}
            color="white"
          />
        </div>

        <h3
          style={{
            marginBottom: '8px',
          }}
        >
          Copilot is analyzing...
        </h3>

        <p className="text-muted">
          Reading deployment logs...
        </p>

        <p className="text-muted">
          Analyzing failure...
        </p>

        <p className="text-muted">
          Generating recommendations...
        </p>
      </div>
    );
  }

  /*
   * INITIAL STATE
   */
  if (!analysis) {
    return (
      <div
        className="card"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '64px 24px',
          textAlign: 'center',
          borderStyle: 'dashed',
        }}
      >
        <Bot
          size={48}
          color="var(--accent-color)"
          style={{
            marginBottom: '16px',
          }}
        />

        <h3
          style={{
            marginBottom: '8px',
          }}
        >
          AI Copilot Ready
        </h3>

        <p
          className="text-muted"
          style={{
            maxWidth: '650px',
            marginBottom: '24px',
          }}
        >
          Let Zerops Copilot analyze the deployment
          logs to find the root cause and provide
          a suggested resolution.
        </p>

        <button
          className="btn btn-primary"
          onClick={onAnalyze}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Bot size={18} />
          Analyze with Copilot
        </button>
      </div>
    );
  }

  /*
   * Convert response into a flexible format.
   */
  const extendedAnalysis =
    analysis as ExtendedAnalysis;

  /*
   * CONFIDENCE
   *
   * Backend returns:
   *
   * 1     -> 100%
   * 0.95  -> 95%
   * 0.75  -> 75%
   */
  const confidencePercentage = Math.min(
    Math.max(
      Math.round(
        Number(analysis.confidence ?? 0) * 100
      ),
      0
    ),
    100
  );

  /*
   * SEVERITY
   *
   * If backend does not return severity,
   * use CRITICAL because the current
   * deployment failure is a critical failure.
   */
  const severity =
    analysis.severity ||
    'CRITICAL';

  /*
   * ROOT CAUSE
   *
   * Current backend does not return rootCause.
   *
   * Therefore:
   *
   * rootCause -> if available
   * summary   -> otherwise
   */
  const rootCause =
    analysis.rootCause ||
    analysis.summary ||
    'Unable to determine the root cause.';

  /*
   * SUGGESTED RESOLUTION
   */
  const suggestedResolution =
    analysis.summary ||
    rootCause ||
    'No resolution was returned by the AI service.';

  /*
   * RECOMMENDATIONS
   *
   * Current backend:
   *
   * recommendations: "line1\nline2\nline3"
   *
   * Future backend:
   *
   * recommendedFix: ["line1", "line2"]
   *
   * We support both.
   */
  let recommendations: string[] = [];

  if (
    extendedAnalysis.recommendations
  ) {
    if (
      Array.isArray(
        extendedAnalysis.recommendations
      )
    ) {
      recommendations =
        extendedAnalysis.recommendations;
    } else {
      recommendations =
        extendedAnalysis.recommendations
          .split('\n')
          .map((item) =>
            item.trim()
          )
          .filter(
            (item) =>
              item.length > 0
          );
    }
  }

  /*
   * Support the older recommendedFix field.
   */
  if (
    recommendations.length === 0 &&
    Array.isArray(
      analysis.recommendedFix
    )
  ) {
    recommendations =
      analysis.recommendedFix
        .map((item) =>
          item.trim()
        )
        .filter(
          (item) =>
            item.length > 0
        );
  }

  /*
   * FILES TO CHECK
   */
  const filesToCheck =
    analysis.filesToCheck ?? [];

  /*
   * ANALYSIS DATE
   */
  const analyzedAt =
    extendedAnalysis.createdAt
      ? new Date(
          extendedAnalysis.createdAt
        ).toLocaleString()
      : null;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}
    >
      {/* =========================================
          TOP STATISTICS
         ========================================= */}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
        }}
      >
        {/* SEVERITY */}

        <div className="card">
          <div
            style={{
              display: 'flex',
              justifyContent:
                'space-between',
              alignItems:
                'flex-start',
            }}
          >
            <div>
              <h3
                style={{
                  marginBottom: '8px',
                }}
              >
                Severity
              </h3>

              <p
                className="text-muted"
                style={{
                  marginBottom: '16px',
                }}
              >
                Deployment failure severity
              </p>

              <SeverityBadge
                severity={severity}
              />
            </div>

            <ShieldAlert
              size={32}
              color="var(--color-error)"
              style={{
                opacity: 0.2,
              }}
            />
          </div>
        </div>

        {/* CONFIDENCE */}

        <div className="card">
          <div
            style={{
              display: 'flex',
              justifyContent:
                'space-between',
              alignItems:
                'flex-start',
            }}
          >
            <div
              style={{
                width: '100%',
              }}
            >
              <h3
                style={{
                  marginBottom: '8px',
                }}
              >
                AI Confidence
              </h3>

              <p
                className="text-muted"
                style={{
                  marginBottom: '16px',
                }}
              >
                Confidence in this analysis
              </p>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <strong
                  style={{
                    fontSize: '22px',
                    color:
                      'var(--color-success)',
                    minWidth: '55px',
                  }}
                >
                  {confidencePercentage}%
                </strong>

                <div
                  style={{
                    flex: 1,
                    height: '6px',
                    backgroundColor:
                      'var(--bg-app)',
                    borderRadius: '3px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${confidencePercentage}%`,
                      height: '100%',
                      backgroundColor:
                        'var(--color-success)',
                      transition:
                        'width 0.5s ease',
                    }}
                  />
                </div>
              </div>
            </div>

            <Cpu
              size={32}
              color="var(--color-success)"
              style={{
                opacity: 0.2,
                marginLeft: '16px',
              }}
            />
          </div>
        </div>
      </div>

      {/* =========================================
          ROOT CAUSE
         ========================================= */}

      <div
        className="card"
        style={{
          borderLeft:
            '4px solid var(--color-error)',
        }}
      >
        <h3
          className="text-muted text-sm mb-2 uppercase tracking-wider"
        >
          Root Cause
        </h3>

        <div
          style={{
            display: 'flex',
            alignItems:
              'flex-start',
            gap: '12px',
          }}
        >
          <ShieldAlert
            size={20}
            color="var(--color-error)"
            style={{
              marginTop: '2px',
              flexShrink: 0,
            }}
          />

          <p
            style={{
              fontSize: '16px',
              margin: 0,
              lineHeight: 1.6,
              color:
                'var(--text-main)',
            }}
          >
            {rootCause}
          </p>
        </div>
      </div>

      {/* =========================================
          SUGGESTED RESOLUTION
         ========================================= */}

      <div className="card">
        <h3
          className="mb-4 flex items-center gap-2"
        >
          <Bot
            size={20}
            color="var(--accent-color)"
          />

          Suggested Resolution
        </h3>

        <p
          style={{
            fontSize: '15px',
            lineHeight: 1.6,
            color: '#c9d1d9',
            marginBottom: 0,
          }}
        >
          {suggestedResolution}
        </p>
      </div>

      {/* =========================================
          RECOMMENDED FIX
         ========================================= */}

      <div className="card bg-panel-hover">
        <h3
          className="mb-4 flex items-center gap-2"
        >
          <CheckCircle
            size={20}
            color="var(--color-success)"
          />

          Recommended Fix
        </h3>

        {recommendations.length > 0 ? (
          <div
            style={{
              border:
                '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '16px',
              backgroundColor:
                'rgba(255,255,255,0.01)',
            }}
          >
            <ul
              style={{
                listStyle: 'none',
                display: 'flex',
                flexDirection:
                  'column',
                gap: '12px',
                margin: 0,
                padding: 0,
              }}
            >
              {recommendations.map(
                (fix, index) => (
                  <li
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems:
                        'flex-start',
                      gap: '10px',
                      lineHeight: 1.5,
                    }}
                  >
                    <span
                      style={{
                        color:
                          'var(--accent-color)',
                        fontWeight:
                          'bold',
                      }}
                    >
                      •
                    </span>

                    <span>
                      {fix}
                    </span>
                  </li>
                )
              )}
            </ul>
          </div>
        ) : (
          <p className="text-muted">
            No specific recommendations
            were returned by the AI service.
          </p>
        )}
      </div>

      {/* =========================================
          FILES TO CHECK
         ========================================= */}

      {filesToCheck.length > 0 && (
        <FilesToCheck
          files={filesToCheck}
        />
      )}

      {/* =========================================
          ANALYSIS METADATA
         ========================================= */}

      {analyzedAt && (
        <div
          className="text-muted text-sm"
          style={{
            textAlign: 'right',
          }}
        >
          Analyzed: {analyzedAt}
        </div>
      )}

      {/* =========================================
          COMPLETION MESSAGE
         ========================================= */}

      <div
        className="card"
        style={{
          borderColor:
            'rgba(46, 160, 67, 0.5)',
          backgroundColor:
            'rgba(46, 160, 67, 0.05)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems:
              'center',
            gap: '12px',
          }}
        >
          <CheckCircle
            size={22}
            color="var(--color-success)"
          />

          <div>
            <strong
              style={{
                color:
                  'var(--color-success)',
              }}
            >
              Analysis completed
            </strong>

            <p
              className="text-muted"
              style={{
                margin:
                  '4px 0 0',
              }}
            >
              Zerops Copilot analyzed the
              deployment failure and generated
              the recommended resolution.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CopilotAnalysis;