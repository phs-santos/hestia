import { api } from "@/lib/api";

export interface UploadFileResponse {
    id: string;
    objectKey: string;
    filename: string;
    url: string;
}

export const filesService = {
    upload: async (file: File, visibility: 'public' | 'private' | 'internal' = 'internal', companyId?: string | number): Promise<UploadFileResponse> => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("visibility", visibility);
        if (companyId) formData.append("companyId", String(companyId));

        const response = await api.post("/files/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },

    getUrl: async (id: string): Promise<string> => {
        const response = await api.get(`/files/${id}/url`);
        return response.data.url;
    }
};
