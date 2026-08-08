import React from 'react';

export const SeverityBadge: React.FC<{ severity: string }> = ({ severity }) => {
  const normalized = severity.toUpperCase();
  
  let badgeClass = 'badge-warning';
  if (normalized === 'CRITICAL') badgeClass = 'badge-critical';
  else if (normalized === 'HIGH' || normalized === 'ERROR') badgeClass = 'badge-error';
  else if (normalized === 'LOW' || normalized === 'INFO') badgeClass = 'badge-success';

  return (
    <span className={`badge ${badgeClass}`}>
      {normalized}
    </span>
  );
};
