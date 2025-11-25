// Utilitaires pour le formatage des dates
import { format, parseISO, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';

export function formatDate(dateStr: string, formatStr: string = 'dd/MM/yyyy'): string {
    try {
        const date = parseISO(dateStr);
        if (!isValid(date)) return dateStr;
        return format(date, formatStr, { locale: fr });
    } catch {
        return dateStr;
    }
}

export function formatDateLong(dateStr: string): string {
    return formatDate(dateStr, 'dd MMMM yyyy');
}

export function formatDateShort(dateStr: string): string {
    return formatDate(dateStr, 'dd/MM/yy');
}

export function getCurrentDateISO(): string {
    return new Date().toISOString().split('T')[0];
}

export function isDateInRange(date: string, startDate: string, endDate: string): boolean {
    const d = new Date(date);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return d >= start && d <= end;
}
