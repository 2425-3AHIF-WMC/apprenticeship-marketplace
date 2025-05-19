import {Clock, Building, CalendarDays, ArrowUpRight, ExternalLink} from 'lucide-react';
import {Link} from 'react-router-dom';
import {Button} from '@/components/ui/button';
import {cn} from '@/lib/utils';
import {useState} from 'react';
import { InternshipUIProps } from '@/utils/interfaces';


interface InternshipCardProps {
    internship: InternshipUIProps;
    className?: string;
}

const InternshipCard = ({internship, className}: InternshipCardProps) => {
    const [isHovered, setIsHovered] = useState(false);

    const getCategoryClasses = (category: string) => {
        return `tag-${category}`;
    };

    return <div
        className={cn(
            'group relative rounded-xl p-5 transition-all duration-300 ease-apple h-full flex flex-col',
            'border border-border hover:border-primary/20 hover:shadow-card min-h-80',
            isHovered ? 'scale-[1.01]' : 'scale-100',
            className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
    >
        <div className="flex items-start justify-between mb-4 min-h-20">
            <div className="flex items-center">
                {internship.company_logo ? <div
                    className="h-16 min-w-24 max-w-24 mr-3 rounded-md overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center dark:bg-gray-200 dark:border-gray-50 ">
                    <img
                        src={internship.company_logo}
                        alt={`${internship.company_name} Logo`}
                        className="h-full w-full object-contain"
                    />
                </div> : <div
                    className="h-10 w-10 mr-3 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                    <Building className="h-5 w-5"/>
                </div>}
                <div>
                    <h3 className="font-semibold text-lg transition-colors group-hover:text-primary line-clamp-2 max-w-72 text-left">
                        {internship.title}
                    </h3>
                    <p className="text-sm text-muted-foreground text-left">{internship.company_name}</p>
                </div>
            </div>
        </div>

        <div className="space-y-3 mb-5 flex-1">
            <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground"/>
                <span>{internship.duration}</span>
            </div>
            <div className="flex items-center text-sm">
                <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground"/>
                <span>Bewerbungsfrist: {new Date(internship.application_end).toLocaleDateString('de-AT', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                })}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-3">
                {internship.category.map((cat, index) => (
                    <span
                        key={`${cat}-${index}`}
                        className={cn(
                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                            getCategoryClasses(cat)
                        )}
                    >
            {cat}
          </span>
                ))}
                {internship.location && internship.work_type != "Remote" && (
                    <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
              {internship.location}
            </span>
                )}
                {internship.min_year && <span
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
          {internship.min_year}
        </span>}
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {internship.work_type}
          </span>
            </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
            <Button asChild variant="outline" size="sm">
                <Link to={`/internships/${internship.id}`}>
                    Details ansehen
                </Link>
            </Button>
            <Button asChild size="sm">
                <Link
                    to={internship.company_link}
                    target={internship.company_link ? "_blank" : undefined}
                    className="flex items-center"
                >
                    Bewerben
                    {internship.company_link ? <ExternalLink className="ml-1 h-3 w-3"/> :
                        <ArrowUpRight className="ml-1 h-3 w-3"/>}
                </Link>
            </Button>
        </div>
    </div>;
};

export default InternshipCard;
