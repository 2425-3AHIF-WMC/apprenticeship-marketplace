import React, {useEffect, useRef, useState} from 'react';
import {cn} from "@/lib/utils";

interface FadeInProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    direction?: 'up' | 'right' | 'none';
    threshold?: number;
    duration?: number;
}

export const FadeIn: React.FC<FadeInProps> = ({
                                                  children,
                                                  className = '',
                                                  delay = 0,
                                                  direction = 'up',
                                                  threshold = 0.1,
                                                  duration = 500,
                                              }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                threshold,
            }
        );

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [threshold]);

    const getAnimationClass = () => {
        if (direction === 'up') return 'translate-y-8';
        if (direction === 'right') return 'translate-x-8';
        return '';
    };

    return (
        <div
            ref={ref}
            className={cn(
                'transition-all duration-500 ease-apple will-change-transform',
                isVisible ? 'opacity-100 transform-none' : `opacity-0 ${getAnimationClass()}`,
                className
            )}
            style={{
                transitionDelay: `${delay}ms`,
                transitionDuration: `${duration}ms`,
            }}
        >
            {children}
        </div>
    );
};

export default FadeIn;
