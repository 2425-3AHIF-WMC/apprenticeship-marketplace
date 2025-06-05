import { Clock, Building, CalendarDays, ArrowUpRight, ExternalLink, BookmarkCheck, BookmarkPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/utils';
import { useState, useEffect } from 'react';
import { InternshipUIProps } from '@/utils/interfaces';
import { isAdmin } from '@/lib/authUtils';
import { useAuth } from '@/context/AuthContext';


interface InternshipCardProps {
    internship: InternshipUIProps;
    className?: string;
    isFavourite?: boolean;
    onToggleFavourite?: (internshipId: number) => void;
    backPath: string;
}
/*
// Helper to get YYYY-MM-DD string from a Date
function toDateString(date: Date) {
  if (isNaN(date.getTime())) return ""; // Invalid date
  return date.toISOString().split('T')[0];
}
*/
const InternshipCard = ({ internship, className, isFavourite = false, onToggleFavourite, backPath }: InternshipCardProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const { studentId } = useAuth();
    const [isAdminUser, setIsAdminUser] = useState(false);

    useEffect(() => {
        let mounted = true;
        if (studentId) {
            isAdmin(studentId).then((result) => {
                if (mounted) setIsAdminUser(result);
            });
        } else {
            setIsAdminUser(false);
        }
        return () => { mounted = false; };
    }, [studentId]);

    const getCategoryClasses = (category: string) => {
        return `tag-${category}`;
    };

    const isDeadlineExpired = (deadline: string) => {
        if (!deadline) return true;
        const today = new Date();
        const deadlineDate = new Date(deadline);
        if (isNaN(deadlineDate.getTime())) return false; // Invalid date, treat as not expired
        today.setHours(0,0,0,0);
        deadlineDate.setHours(0,0,0,0);
        return deadlineDate < today;
    };

    return <div
        className={cn(
            'group relative rounded-xl p-5 transition-all duration-300 ease-apple h-full flex flex-col',
            'border border-border hover:border-primary/20 hover:shadow-card min-h-80',
            isHovered ? 'scale-[1.01]' : 'scale-100',
            className,
            isDeadlineExpired(internship.application_end) ? 'bg-gray-100 hover:bg-gray-200 dark:bg-muted/20 dark:hover:bg-muted/40' : ' dark:bg-black/60 dark:hover:bg-black/40'
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
    >
        <div className="flex items-start justify-between mb-4 min-h-20">
            <div className="flex items-center">
            {internship.company_logo ? <div
                className="h-16 min-w-24 max-w-24 mr-3 rounded-md overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center dark:bg-gray-200 dark:border-gray-50 ">
                <img
                    src={`http://localhost:5000/api/media/${internship.company_logo}`}
                    alt={`${internship.company_name} Logo`}
                    className="h-full w-full object-contain"
                />
            </div> : <div
                className="h-10 w-10 mr-3 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                <Building className="h-5 w-5" />
            </div>}
            <div className="flex items-center ">
                <div>
                    <h3 className="font-semibold text-lg text-left transition-colors group-hover:text-primary line-clamp-2 max-w-72">
                        {internship.title}
                    </h3>
                    <p className="text-sm text-muted-foreground text-left">{internship.company_name}</p>
                </div>
            </div>
            </div>
            { studentId && !isAdminUser && <Button 
                variant="ghost" 
                size="icon" 
                className={cn(
                    "transition-opacity",
                    isFavourite ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                )}
                onClick={() => onToggleFavourite && onToggleFavourite(Number(internship.id))}
            >
                {isFavourite ? (
                    <BookmarkCheck className="h-5 w-5" />
                ) : (
                    <BookmarkPlus className="h-5 w-5" />
                )}
                <span className="sr-only">
                    {isFavourite ? "Aus Favoriten entfernen" : "Zu Favoriten hinzufügen"}
                </span>
            </Button>
}
        </div>

        <div className="space-y-3 mb-5 flex-1">
            <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{internship.duration}</span>
            </div>
            <div className="flex items-center text-sm">
                <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Bewerbungsfrist: {new Date(internship.application_end).toLocaleDateString('de-AT', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                })}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-3">
                {internship.department.map((dep, index) => (
                    <span
                        key={`${dep}-${index}`}
                        className={cn(
                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                            getCategoryClasses(dep)
                        )}
                    >
                        {dep}
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
                <Link to={`/internships/${internship.id}`} state={{ backPath: `${backPath}` }}>
                    Details ansehen
                </Link>
            </Button>
            <Button asChild size="sm">
                <Link
                    to={internship.internship_link}
                    target={internship.internship_link ? "_blank" : undefined}
                    className="flex items-center"
                >
                    Bewerben
                    {internship.internship_link ? <ExternalLink className="ml-1 h-3 w-3" /> :
                        <ArrowUpRight className="ml-1 h-3 w-3" />}
                </Link>
            </Button>
        </div>
    </div>;
};

export default InternshipCard;
