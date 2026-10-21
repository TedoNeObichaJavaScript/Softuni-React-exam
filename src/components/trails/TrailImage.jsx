import { useState } from 'react';
import TrailArt from './TrailArt';
import './TrailImage.css';

export default function TrailImage({ trail, className = '' }) {
  const [failedUrl, setFailedUrl] = useState(null);
  const url = trail.image_url;

  // A new url gets a fresh attempt because the stored failed url no longer matches
  if (!url || failedUrl === url) {
    return <TrailArt seed={trail.id} title={trail.title} className={className} />;
  }

  return (
    <img
      className={`trail-image ${className}`}
      src={url}
      alt={trail.title}
      loading="lazy"
      onError={() => setFailedUrl(url)}
    />
  );
}
