import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import './OfflineBanner.css';

export default function OfflineBanner() {
  const isOnline = useOnlineStatus();

  if (isOnline) {
    return null;
  }

  return (
    <div className="offline-banner" role="status">
      <div className="container offline-banner-inner">
        <WifiOff size={18} strokeWidth={2} aria-hidden="true" />
        <p>
          You are offline. You can keep browsing what is loaded, but changes will not be saved
          until the connection is back.
        </p>
      </div>
    </div>
  );
}
