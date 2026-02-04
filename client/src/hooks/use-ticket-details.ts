import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ticketApi } from '@/services/ticketService';
import { ticketHistoryApi } from '@/services/ticketHistoryService';
import { Ticket, TicketHistory } from '@/types';
import { toast } from 'sonner';

export function useTicketDetails(code: string | undefined) {
    const navigate = useNavigate();
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState<TicketHistory[]>([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    // Fetch ticket by code
    useEffect(() => {
        const fetchTicket = async () => {
            if (!code) return;
            setLoading(true);
            try {
                const data = await ticketApi.getByCode(Number(code));
                setTicket(data);
            } catch (err) {
                console.error("Error fetching ticket by code:", err);
                toast.error("Erro ao carregar chamado. Verifique o código.");
                navigate("/tickets");
            } finally {
                setLoading(false);
            }
        };
        fetchTicket();
    }, [code, navigate]);

    // Load history
    const loadHistory = useCallback(async () => {
        if (!ticket?.id) return;
        setHistoryLoading(true);
        try {
            const data = await ticketHistoryApi.getByTicketId(ticket.id);
            setHistory(data);
        } catch (err) {
            console.error(err);
        } finally {
            setHistoryLoading(false);
        }
    }, [ticket?.id]);

    // Fetch history when ticket changes
    useEffect(() => {
        if (ticket?.id) {
            loadHistory();
        }
    }, [ticket?.id, loadHistory]);

    // Refresh ticket data
    const refreshTicket = useCallback(async () => {
        if (!ticket?.id) return;
        try {
            const updated = await ticketApi.getById(ticket.id);
            setTicket(updated);
            await loadHistory();
        } catch (err) {
            console.error("Error refreshing ticket:", err);
        }
    }, [ticket?.id, loadHistory]);

    // Computed values
    const isActive = useMemo(() =>
        ticket ? ['open', 'in_progress', 'waiting_operator', 'waiting_customer', 'waiting_team'].includes(ticket.status) : false,
        [ticket]
    );

    const isWaiting = useMemo(() =>
        ticket ? ['waiting_operator', 'waiting_customer', 'waiting_team'].includes(ticket.status) : false,
        [ticket]
    );

    return {
        ticket,
        loading,
        history,
        historyLoading,
        loadHistory,
        refreshTicket,
        isActive,
        isWaiting
    };
}
