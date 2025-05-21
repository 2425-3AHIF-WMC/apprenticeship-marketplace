import { CheckCircle, XCircle, ShieldCheck, Building } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CompanyUIPropsAdmin } from '@/utils/interfaces';

export interface CompanyCardProps {
  company: CompanyUIPropsAdmin;
  children?: React.ReactNode;
}

const getStatus = (company: CompanyCardProps['company']) => {
  if (company.admin_verified && company.email_verified) return 'vollständig';
  if (company.email_verified) return 'nur_email';
  return 'keine';
};

const statusStyles = {
  vollständig: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  nur_email: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  keine: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const statusIcons = {
  vollständig: <CheckCircle className="h-5 w-5 text-green-600 mr-1" />, // fully verified
  nur_email: <ShieldCheck className="h-5 w-5 text-yellow-600 mr-1" />, // only email
  keine: <XCircle className="h-5 w-5 text-red-600 mr-1" />, // not verified
};

const statusLabels = {
  vollständig: 'Vollständig verifiziert',
  nur_email: 'Nur E-Mail verifiziert',
  keine: 'Nicht verifiziert',
};

export default function CompanyCard({ company, children }: CompanyCardProps) {
  const status = getStatus(company);
  return (
    <div
      className={cn(
        'flex flex-row items-center gap-4 p-4 border rounded-lg transition-colors',
        status === 'vollständig' && 'bg-green-50 dark:bg-green-950',
        status === 'nur_email' && 'bg-yellow-50 dark:bg-yellow-950',
        status === 'keine' && 'bg-red-50 dark:bg-red-950'
      )}
    >
      {company.logo ? (
        <div className="h-16 min-w-24 max-w-24 mr-3 rounded-md overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center dark:bg-gray-200 dark:border-gray-50">
          <img
            src={company.logo}
            alt={`${company.name} Logo`}
            className="h-full w-full object-contain"
          />
        </div>
      ) : (
        <div className="h-10 w-10 mr-3 rounded-md bg-primary/10 text-primary flex items-center justify-center">
          <Building className="h-5 w-5" />
        </div>
      )}
      <div className="flex-1 flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-1">
          <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', statusStyles[status])}>
            {statusIcons[status]}
            {statusLabels[status]}
          </span>
        </div>
        <h3 className="font-semibold text-left text-lg">{company.name}</h3>
        <div className="flex flex-col md:flex-row gap-1 md:gap-4 text-sm text-muted-foreground">
          <span className='text-left'>E-Mail: {company.email}</span>
          <span className='text-left'>Website: <a href={company.website} target="_blank" rel="noopener noreferrer" className="underline text-blue-700">{company.website}</a></span>
          <span className='text-left'>Telefon: {company.phone_number}</span>
        </div>
      </div>
      <div className="flex flex-row gap-2 self-end md:self-auto">
        {children}
      </div>
    </div>
  );
}
