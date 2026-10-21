import { DIFFICULTIES } from '../../utils/constants';
import './DifficultyBadge.css';

export default function DifficultyBadge({ difficulty }) {
  const index = DIFFICULTIES.findIndex((option) => option.value === difficulty);
  const label = index === -1 ? difficulty : DIFFICULTIES[index].label;
  const level = index + 1;

  return (
    <span className={`difficulty-badge difficulty-badge-${difficulty}`}>
      <span className="difficulty-badge-meter" aria-hidden="true">
        {DIFFICULTIES.map((option, barIndex) => (
          <span
            key={option.value}
            className={barIndex < level ? 'difficulty-badge-bar is-filled' : 'difficulty-badge-bar'}
          />
        ))}
      </span>
      {label}
    </span>
  );
}
