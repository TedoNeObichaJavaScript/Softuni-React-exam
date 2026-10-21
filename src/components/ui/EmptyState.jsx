import './ui.css';

export default function EmptyState({ icon: Icon, title, text, action }) {
  return (
    <div className="empty-state">
      {Icon && (
        <span className="empty-state-icon" aria-hidden="true">
          <Icon size={20} strokeWidth={2} />
        </span>
      )}
      <p className="empty-state-title">{title}</p>
      {text && <p className="empty-state-text">{text}</p>}
      {action && <div className="empty-state-action">{action}</div>}
    </div>
  );
}
