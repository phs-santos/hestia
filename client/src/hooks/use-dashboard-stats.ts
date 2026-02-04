import { useMemo } from 'react';
import { useTicketStore } from '@/stores/ticketStore';
import { useCategoryStore } from '@/stores/categoryStore';
import { useCompanyStore } from '@/stores/companyStore';
import { isToday, isThisMonth, startOfMonth, startOfWeek, endOfWeek, subWeeks } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { pabxLabel } from '@/constants/commons';

export function useDashboardStats() {
    const { tickets, globalStats } = useTicketStore();
    const { categories } = useCategoryStore();
    const { companies } = useCompanyStore();

    const stats = useMemo(() => {
        const now = new Date();
        const weekStart = startOfWeek(now, { locale: ptBR });
        const weekEnd = endOfWeek(now, { locale: ptBR });

        const todayTickets = tickets.filter(t => isToday(new Date(t.startAt)));
        const weekTickets = tickets.filter(t => {
            const date = new Date(t.startAt);
            return date >= weekStart && date <= weekEnd;
        });
        const monthTickets = tickets.filter(t => isThisMonth(new Date(t.startAt)));

        // Use global stats if available for authoritative totals, otherwise fallback to local calculation
        const inProgress = globalStats?.open ?? tickets.filter(t => t.status === 'open').length;
        const resolved = globalStats?.resolved ?? tickets.filter(t => t.status === 'resolved').length;
        // Finished implies closed/resolved, usually. Dashboard.tsx uses 'finished' then 'resolved'.
        // Original code: finished = tickets.filter(t => t.status === 'closed').length
        // Original code: resolved = tickets.filter(t => t.status === 'resolved').length
        // DB stats returns 'resolved' count. Let's assume 'finished' logic is similar or we map it.
        // For now, let's keep 'finished' as local calc if we don't have it in DB stats, or map 'resolved' to it if they are synonymous.
        // Actually, let's use local calc for 'finished' (closed) if DB stats doesn't provide it clearly.
        // But for 'resolved', use globalStats.resolved.

        const finished = tickets.filter(t => t.status === 'closed').length; // Keep local for now unless we add to backend
        const abandoned = tickets.filter(t => t.status === 'abandoned').length;

        // Tempo médio de resolução (em minutos)
        // Global stats has avgResolutionTime
        const avgResolutionTime = globalStats?.avgResolutionTime ?? (
            tickets.filter(t => t.status === 'resolved' && t.durationMs).length > 0
                ? Math.round(tickets.filter(t => t.status === 'resolved' && t.durationMs).reduce((acc, t) => acc + (t.durationMs || 0), 0) / tickets.filter(t => t.status === 'resolved' && t.durationMs).length / 60000)
                : 0
        );

        // Taxa de resolução uses totalFinalized = resolved + abandoned.
        // If we use globalResolved, we should probably use globalAbandoned? We don't have globalAbandoned.
        // Mixed sources might be risky.
        // But 'resolved' is the main one users care about being accurate over time.

        const totalFinalized = resolved + abandoned;
        const resolutionRate = totalFinalized > 0
            ? Math.round((resolved / totalFinalized) * 100)
            : 0;

        // Chamados por empresa (top 5)
        const companyMap = new Map<string, number>();
        tickets.forEach(t => {
            let name = t.companyName || companies.find(c => String(c.id) === String(t.companyId))?.name || companies.find(c => String(c.id) === String(t.companyId))?.accountcode;
            if (name) {
                companyMap.set(name, (companyMap.get(name) || 0) + 1);
            }
        });

        const companyStats = Array.from(companyMap.entries())
            .map(([name, count]) => {
                const company = companies.find(c => c.name === name || c.accountcode === name);
                return { id: company?.id, name, count };
            })
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        // Chamados por categoria (top 5 - usando nível 1)
        const categoryMap = new Map<string, number>();
        tickets.forEach(t => {
            const category = categories.find(c => c.id === t.categoryId);
            if (category) {
                // Encontrar categoria raiz (nível 1)
                let rootCategory = category;
                if (category.parentId) {
                    const parent = categories.find(c => c.id === category.parentId);
                    if (parent?.parentId) {
                        const grandParent = categories.find(c => c.id === parent.parentId);
                        rootCategory = grandParent || parent;
                    } else if (parent) {
                        rootCategory = parent;
                    }
                }
                categoryMap.set(rootCategory.name, (categoryMap.get(rootCategory.name) || 0) + 1);
            }
        });
        const categoryStats = Array.from(categoryMap.entries())
            .map(([name, count]) => {
                const cat = categories.find(c => c.name === name && !c.parentId); // Root categories usually
                return { id: cat?.id, name, count };
            })
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        // Chamados por PABX (top 5)
        const pabxMap = new Map<string, number>();
        tickets.forEach(t => {
            // Find company to get PABX info
            const company = companies.find(c => String(c.id) === String(t.companyId));
            if (company && company.pabx) {
                const label = pabxLabel[company.pabx as keyof typeof pabxLabel] || pabxLabel["not_defined"] || company.pabx;
                pabxMap.set(label, (pabxMap.get(label) || 0) + 1);
            }
        });
        const pabxStats = Array.from(pabxMap.entries())
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        // Chamados por Técnico (Top 5) - semana & hoje
        const technicianMap = new Map<string, { week: number, today: number }>();

        // Count for Week (Primary)
        weekTickets.forEach(t => {
            if (t.userName) {
                const current = technicianMap.get(t.userName) || { week: 0, today: 0 };
                current.week += 1;
                // Check if it's also today (optimization: reuse logic)
                const isTodayTicket = isToday(new Date(t.startAt));
                if (isTodayTicket) {
                    current.today += 1;
                }
                technicianMap.set(t.userName, current);
            }
        });

        // Convert Map to Array
        const technicianStats = Array.from(technicianMap.entries())
            .map(([name, counts]) => {
                const technicianId = tickets.find(t => t.userName === name)?.userId;
                return {
                    id: technicianId,
                    name,
                    count: counts.week,
                    secondaryCount: counts.today
                };
            })
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        // Recalcular stats de empresa/categoria/pabx para semana
        const weekCompanyMap = new Map<string, number>();
        weekTickets.forEach(t => {
            let name = t.companyName || companies.find(c => String(c.id) === String(t.companyId))?.name || companies.find(c => String(c.id) === String(t.companyId))?.accountcode;
            if (name) {
                weekCompanyMap.set(name, (weekCompanyMap.get(name) || 0) + 1);
            }
        });
        const weekCompanyStats = Array.from(weekCompanyMap.entries())
            .map(([name, count]) => {
                const company = companies.find(c => c.name === name || c.accountcode === name);
                return { id: company?.id, name, count };
            })
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        const weekCategoryMap = new Map<string, number>();
        weekTickets.forEach(t => {
            const category = categories.find(c => c.id === t.categoryId);
            if (category) {
                let rootCategory = category;
                if (category.parentId) {
                    const parent = categories.find(c => c.id === category.parentId);
                    if (parent?.parentId) {
                        const grandParent = categories.find(c => c.id === parent.parentId);
                        rootCategory = grandParent || parent;
                    } else if (parent) {
                        rootCategory = parent;
                    }
                }
                weekCategoryMap.set(rootCategory.name, (weekCategoryMap.get(rootCategory.name) || 0) + 1);
            }
        });
        const weekCategoryStats = Array.from(weekCategoryMap.entries())
            .map(([name, count]) => {
                const cat = categories.find(c => c.name === name && !c.parentId);
                return { id: cat?.id, name, count };
            })
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        const weekPabxMap = new Map<string, number>();
        weekTickets.forEach(t => {
            const company = companies.find(c => String(c.id) === String(t.companyId));
            if (company && company.pabx) {
                const label = pabxLabel[company.pabx as keyof typeof pabxLabel] || pabxLabel["not_defined"] || company.pabx;
                weekPabxMap.set(label, (weekPabxMap.get(label) || 0) + 1);
            }
        });
        const weekPabxStats = Array.from(weekPabxMap.entries())
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);


        // Calculate trends
        const monthStart = startOfMonth(now);
        const prevMonthStart = new Date(monthStart);
        prevMonthStart.setMonth(prevMonthStart.getMonth() - 1);
        const prevMonthEnd = new Date(monthStart);
        prevMonthEnd.setDate(prevMonthEnd.getDate() - 1);

        const prevMonthTickets = tickets.filter(t => {
            const date = new Date(t.startAt);
            return date >= prevMonthStart && date <= prevMonthEnd;
        });

        const monthTrend = prevMonthTickets.length > 0
            ? Math.round(((monthTickets.length - prevMonthTickets.length) / prevMonthTickets.length) * 100)
            : 0;

        // Trend da semana
        const prevWeekStart = subWeeks(weekStart, 1);
        const prevWeekEnd = subWeeks(weekEnd, 1);
        const prevWeekTickets = tickets.filter(t => {
            const date = new Date(t.startAt);
            return date >= prevWeekStart && date <= prevWeekEnd;
        });
        const weekTrend = prevWeekTickets.length > 0
            ? Math.round(((weekTickets.length - prevWeekTickets.length) / prevWeekTickets.length) * 100)
            : 0;

        return {
            todayTickets: todayTickets.length,
            weekTickets: weekTickets.length,
            weekTrend,
            monthTickets: monthTickets.length,
            monthTrend,
            inProgress,
            finished,
            resolved,
            abandoned,
            avgResolutionTime,
            resolutionRate,
            companyStats,
            categoryStats,
            pabxStats,
            technicianStats,
            weekCompanyStats,
            weekCategoryStats,
            weekPabxStats,
            recentTickets: weekTickets,
            openTicketsList: tickets.filter(t => t.status === 'open'),
            totalTickets: tickets.length,
            totalWeekTickets: weekTickets.length,
        };
    }, [tickets, categories, companies, globalStats]);

    return stats;
}
