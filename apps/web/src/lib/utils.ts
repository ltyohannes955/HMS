import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes without conflicts */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/** Format a date to localized string */
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions) {
    return new Intl.DateTimeFormat('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        ...options,
    }).format(new Date(date));
}

/** Capitalize the first letter of a string */
export function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/** Format role enum to readable label */
export function formatRole(role: string) {
    return role.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}
