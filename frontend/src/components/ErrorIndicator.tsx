import { FC, ReactNode } from 'react';
import { Search } from 'lucide-react';
import FadeIn from './FadeIn';

interface ErrorIndicatorProps {
  message?: string;
  error?: string | null;
  className?: string;
  iconClassName?: string;
  children?: ReactNode;
}

const ErrorIndicator: FC<ErrorIndicatorProps> = ({
  message = 'Fehler beim Laden',
  error,
  className = '',
  iconClassName = '',
  children,
}) => (
  <div className={`text-center py-20 ${className}`}>
    <FadeIn>
      <div className={`inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100 text-red-600 mb-4 ${iconClassName}`}>
        <Search className="h-8 w-8" />
      </div>
      {children ? children : <>
        <h3 className="text-xl font-semibold mb-2">{message}</h3>
        {error && <p className="text-muted-foreground max-w-md mx-auto mb-6">{error}</p>}
      </>}
    </FadeIn>
  </div>
);

export default ErrorIndicator; 