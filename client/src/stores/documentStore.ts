import { create } from 'zustand';
import { api } from '@/lib/api';
import { Document, CreateDocumentInput, UpdateDocumentInput } from '@/types/document';
import { toast } from 'sonner';

interface DocumentStore {
    documents: Document[];
    loading: boolean;
    error: string | null;
    currentDocument: Document | null;

    fetchDocuments: () => Promise<void>;
    fetchDocumentById: (id: string) => Promise<Document | null>;
    createDocument: (data: CreateDocumentInput) => Promise<Document | null>;
    updateDocument: (id: string, data: UpdateDocumentInput) => Promise<Document | null>;
    deleteDocument: (id: string) => Promise<void>;
}

export const useDocumentStore = create<DocumentStore>((set, get) => ({
    documents: [],
    loading: false,
    error: null,
    currentDocument: null,

    fetchDocuments: async () => {
        set({ loading: true, error: null });
        try {
            const response = await api.get('/documents');
            set({ documents: response.data });
        } catch (error) {
            console.error('Failed to fetch documents:', error);
            set({ error: 'Falha ao carregar documentos' });
            toast.error('Erro ao carregar lista de documentos');
        } finally {
            set({ loading: false });
        }
    },

    fetchDocumentById: async (id: string) => {
        set({ loading: true, error: null });
        try {
            const response = await api.get(`/documents/${id}`);
            set({ currentDocument: response.data });
            return response.data;
        } catch (error) {
            console.error(`Failed to fetch document ${id}:`, error);
            set({ error: 'Documento não encontrado' });
            toast.error('Erro ao carregar documento');
            return null;
        } finally {
            set({ loading: false });
        }
    },

    createDocument: async (data: CreateDocumentInput) => {
        set({ loading: true, error: null });
        try {
            const response = await api.post('/documents', data);
            const newDoc = response.data;
            set((state) => ({ documents: [newDoc, ...state.documents] }));
            toast.success('Documento criado com sucesso');
            return newDoc;
        } catch (error) {
            console.error('Failed to create document:', error);
            set({ error: 'Erro ao criar documento' });
            toast.error('Erro ao criar documento');
            return null;
        } finally {
            set({ loading: false });
        }
    },

    updateDocument: async (id: string, data: UpdateDocumentInput) => {
        set({ loading: true, error: null });
        try {
            const response = await api.put(`/documents/${id}`, data);
            const updatedDoc = response.data;
            set((state) => ({
                documents: state.documents.map((doc) => (doc.id === id ? updatedDoc : doc)),
                currentDocument: updatedDoc,
            }));
            toast.success('Documento atualizado com sucesso');
            return updatedDoc;
        } catch (error) {
            console.error(`Failed to update document ${id}:`, error);
            set({ error: 'Erro ao atualizar documento' });
            toast.error('Erro ao atualizar documento');
            return null;
        } finally {
            set({ loading: false });
        }
    },

    deleteDocument: async (id: string) => {
        set({ loading: true, error: null });
        try {
            await api.delete(`/documents/${id}`);
            set((state) => ({
                documents: state.documents.filter((doc) => doc.id !== id),
                currentDocument: state.currentDocument?.id === id ? null : state.currentDocument,
            }));
            toast.success('Documento excluído');
        } catch (error) {
            console.error(`Failed to delete document ${id}:`, error);
            set({ error: 'Erro ao excluir documento' });
            toast.error('Erro ao excluir documento');
        } finally {
            set({ loading: false });
        }
    },
}));
