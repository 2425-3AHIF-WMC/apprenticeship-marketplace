import { FC, ReactNode } from 'react';
import { Search } from 'lucide-react';
import FadeIn from './FadeIn';

interface LoadingIndicatorProps {
  message?: string;
  className?: string;
  iconClassName?: string;
  children?: ReactNode;
}

const LoadingIndicator: FC<LoadingIndicatorProps> = ({
  message = 'Lade ...',
  className = '',
  iconClassName = '',
  children,
}) => (
  <div className={`text-center py-20 ${className}`}>
    <FadeIn>
      <div className={`inline-flex items-center justify-center h-16 w-16 rounded-full bg-muted text-muted-foreground mb-4 ${iconClassName}`}>
        <Search className="h-8 w-8" />
      </div>
      {children ? children : <h3 className="text-xl font-semibold mb-2">{message}</h3>}
    </FadeIn>
  </div>
);

export default LoadingIndicator; 