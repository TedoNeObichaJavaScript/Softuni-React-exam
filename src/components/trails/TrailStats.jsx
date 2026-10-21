import { Clock, Route, TrendingUp } from 'lucide-react';
import { formatDistance, formatDuration, formatElevation } from '../../utils/format';
import './TrailStats.css';

export default function TrailStats({ trail, size = 'small' }) {
  const isLarge = size === 'large';
  const iconSize = isLarge ? 20 : 16;

  const stats = [
    { label: 'Distance', value: formatDistance(trail.distance_km), Icon: Route },
    { label: 'Elevation gain', value: formatElevation(trail.elevation_gain_m), Icon: TrendingUp },
    { label: 'Duration', value: formatDuration(trail.duration_hours), Icon: Clock },
  ];

  return (
    <dl className={`trail-stats trail-stats-${isLarge ? 'large' : 'small'}`}>
      {stats.map(({ label, value, Icon }) => (
        <div key={label} className="trail-stats-item">
          <span className="trail-stats-icon" aria-hidden="true">
            <Icon size={iconSize} strokeWidth={2} />
          </span>
          <dt className={isLarge ? 'trail-stats-label' : 'sr-only'}>{label}</dt>
          <dd className="trail-stats-value">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
