import React from 'react';
import { AlertCircle, Terminal, ExternalLink } from 'lucide-react';

interface ConnectionBannerProps {
  isConnected: boolean | null;
  onRetry: () => void;
}

export const ConnectionBanner: React.FC<ConnectionBannerProps> = ({
  isConnected,
  onRetry,
}) => {
  if (isConnected !== false) return null;

  return (
    <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-amber-900 dark:text-amber-100">
              Spring Boot Backend is Offline (:8080)
            </h4>
            <p className="text-xs text-amber-700 dark:text-amber-300/90 mt-0.5">
              The frontend is currently using local state storage. To connect with your Spring Boot REST API & H2 database, run:
            </p>
            <div className="mt-2 inline-flex items-center space-x-2 px-2.5 py-1 bg-amber-900/10 dark:bg-amber-950/60 rounded-lg text-xs font-mono">
              <Terminal className="w-3.5 h-3.5" />
              <span>./mvnw spring-boot:run</span>
            </div>
          </div>
        </div>

        <button
          onClick={onRetry}
          className="self-start sm:self-center px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center space-x-1.5"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Retry Connection</span>
        </button>
      </div>
    </div>
  );
};
