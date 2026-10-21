import TrailCard from './TrailCard';
import './TrailGrid.css';

export default function TrailGrid({ trails }) {
  return (
    <ul className="trail-grid">
      {trails.map((trail) => (
        <li key={trail.id} className="trail-grid-item">
          <TrailCard trail={trail} />
        </li>
      ))}
    </ul>
  );
}
