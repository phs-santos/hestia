import { useMemo } from 'react';
import { Ticket } from '@/types';
import { differenceInMinutes, parseISO, isSaturday, isSunday, setHours, setMinutes, setSeconds, isAfter, isBefore, addDays, startOfDay, endOfDay } from 'date-fns';

export function useDashboardMetrics(tickets: Ticket[]) {

    // Helper to calculate business minutes
    const calculateBusinessMinutes = (start: Date, end: Date) => {
        const WORK_START_HOUR = 8;
        const WORK_END_HOUR = 18;
        let totalMinutes = 0;
        let current = new Date(start);

        // Safety check
        if (isAfter(current, end)) return 0;

        while (isBefore(current, end)) {
            // Skip weekends
            if (isSaturday(current)) {
                current = addDays(startOfDay(current), 2);
                current = setHours(current, WORK_START_HOUR);
                current = setMinutes(current, 0);
                continue;
            }
            if (isSunday(current)) {
                current = addDays(startOfDay(current), 1);
                current = setHours(current, WORK_START_HOUR);
                current = setMinutes(current, 0);
                continue;
            }

            // Define work window for current day
            const workStart = setSeconds(setMinutes(setHours(current, WORK_START_HOUR), 0), 0);
            const workEnd = setSeconds(setMinutes(setHours(current, WORK_END_HOUR), 0), 0);

            // If current time is after work hours, move to next day
            if (isAfter(current, workEnd)) {
                current = addDays(startOfDay(current), 1);
                current = setHours(current, WORK_START_HOUR);
                current = setMinutes(current, 0);
                continue;
            }

            // If current time is before work hours, set to work start
            if (isBefore(current, workStart)) {
                current = new Date(workStart);
            }

            // Calculate overlap with work window
            // We want to count from `current` until `end`, but capped at `workEnd`
            const nextStop = isBefore(end, workEnd) ? end : workEnd;

            if (isAfter(nextStop, current)) {
                const diff = differenceInMinutes(nextStop, current);
                totalMinutes += diff > 0 ? diff : 0;
            }

            // Move current to nextStop
            current = new Date(nextStop);

            // If we reached workEnd, force move to next day start to avoid infinite loop at 18:00
            if (!isBefore(current, workEnd)) {
                current = addDays(startOfDay(current), 1);
                current = setHours(current, WORK_START_HOUR);
                current = setMinutes(current, 0);
            }
        }

        return totalMinutes;
    };

    // Calculate Average Resolution Time
    const averageResolutionTime = useMemo(() => {
        const resolvedTickets = tickets.filter(t =>
            (t.status === 'resolved' || t.status === 'closed') && t.resolvedAt && t.createdAt
        );

        if (resolvedTickets.length === 0) return '0h 0m';

        const totalMinutes = resolvedTickets.reduce((acc, ticket) => {
            const start = ticket.createdAt instanceof Date ? ticket.createdAt : parseISO(ticket.createdAt as unknown as string);
            const end = ticket.resolvedAt instanceof Date ? ticket.resolvedAt! : parseISO(ticket.resolvedAt as unknown as string);

            return acc + calculateBusinessMinutes(start, end);
        }, 0);

        const avgMinutes = totalMinutes / resolvedTickets.length;
        const hours = Math.floor(avgMinutes / 60);
        const minutes = Math.floor(avgMinutes % 60);

        return `${hours}h ${minutes}m`;
    }, [tickets]);

    // Calculate Resolution Rate
    const resolutionRate = useMemo(() => {
        if (tickets.length === 0) return 0;

        const resolvedCount = tickets.filter(t =>
            t.status === 'resolved' || t.status === 'closed'
        ).length;

        return Math.round((resolvedCount / tickets.length) * 100);
    }, [tickets]);

    return {
        averageResolutionTime,
        resolutionRate
    };
}
