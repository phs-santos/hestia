import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTicketStore } from '@/stores/ticketStore';
import { ticketHistoryApi } from '@/services/ticketHistoryService';
import { Ticket, User } from '@/types';
import { toast } from 'sonner';

interface UseTicketActionsProps {
    ticket: Ticket | null;
    currentUser: User | null;
    onRefresh: () => Promise<void>;
}

export function useTicketActions({ ticket, currentUser, onRefresh }: UseTicketActionsProps) {
    const navigate = useNavigate();
    const { finalizeTicket, abandonTicket, setWaitingStatus, deleteTicket } = useTicketStore();

    const handleSetWaiting = useCallback(async (status: string) => {
        if (!ticket || !currentUser) return;
        try {
            await setWaitingStatus(ticket.id, status, currentUser.id);

            toast.success("Status atualizado");
            await onRefresh();
        } catch (error) {
            toast.error("Erro ao atualizar status");
        }
    }, [ticket, currentUser, setWaitingStatus, onRefresh]);

    const handleResume = useCallback(async () => {
        if (!ticket || !currentUser) return;
        try {
            const { waitingDurationMs } = await setWaitingStatus(ticket.id, 'in_progress', currentUser.id);

            toast.success("Ticket retomado");
            await onRefresh();
        } catch (error) {
            toast.error("Erro ao retomar ticket");
        }
    }, [ticket, currentUser, setWaitingStatus, onRefresh]);

    const handleFinalize = useCallback(async (solution: string) => {
        if (!ticket || !currentUser) return;
        if (!solution.trim()) {
            toast.error("Escreva a solução");
            return;
        }

        try {
            await finalizeTicket(ticket.id, solution, currentUser.id);
            toast.success("Chamado finalizado!");
            await onRefresh();
        } catch (error) {
            toast.error("Erro ao finalizar chamado");
        }
    }, [ticket, currentUser, finalizeTicket, onRefresh]);

    const handleAbandon = useCallback(async (reason: string) => {
        if (!ticket || !currentUser) return;
        if (!reason.trim()) {
            toast.error("Informe o motivo");
            return;
        }

        try {
            await abandonTicket(ticket.id, reason, currentUser.id);
            toast.success("Chamado abandonado.");
            await onRefresh();
        } catch (error) {
            toast.error("Erro ao abandonar chamado");
        }
    }, [ticket, currentUser, abandonTicket, onRefresh]);

    const handleDelete = useCallback(async () => {
        if (!ticket) return;
        try {
            await deleteTicket(ticket.id);
            toast.success("Ticket excluído com sucesso");
            navigate("/tickets");
        } catch (error) {
            toast.error("Erro ao excluir ticket");
        }
    }, [ticket, deleteTicket, navigate]);

    return {
        handleSetWaiting,
        handleResume,
        handleFinalize,
        handleAbandon,
        handleDelete
    };
}
