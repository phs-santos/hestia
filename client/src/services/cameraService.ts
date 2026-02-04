import { api, handleApiError } from "@/lib/api";
import { createBaseService } from "./baseService";
import { Camera, CreateCameraInput } from "@/types";

const base = createBaseService<Camera, CreateCameraInput>("/cameras");

export const cameraService = {
    ...base,
    update: async (id: string, data: Partial<CreateCameraInput>): Promise<Camera> => {
        try {
            const response = await api.patch<Camera>(`/cameras/${id}`, data);
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }
};

