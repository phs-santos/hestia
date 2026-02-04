import { createBaseService } from "./baseService";

// Endpoints sincronizados com o backend (padronizados para plural)
const serverService = createBaseService<Server, Partial<Server>>('/servers');
const serviceService = createBaseService<Service, Partial<Service>>('/services');
const serviceTypeService = createBaseService<ServiceType, Partial<ServiceType>>('/service-types');
const serviceConfigService = createBaseService<ServiceConfig, Partial<ServiceConfig>>('/service-configs');

export interface Server {
    id: string;
    name: string;
    description?: string;
    host: string;
    provider?: string;
    environment: string;
    createdAt: string;
    updatedAt: string;
}

export interface ServiceType {
    id: string;
    code: string;
    name: string;
    description?: string;
}

export interface Service {
    id: string;
    serverId: string;
    serviceTypeId: string;
    name: string;
    description?: string;
    version?: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface ServiceConfig {
    id: string;
    serviceId: string;
    key: string;
    value: string;
    isSecret: boolean;
}

export const monitoringService = {
    // Servers
    async getServers(): Promise<Server[]> {
        return await serverService.getAll();
    },
    async createServer(data: Partial<Server>): Promise<Server> {
        return await serverService.create(data);
    },
    async updateServer(id: string, data: Partial<Server>): Promise<Server> {
        return await serverService.update(id, data);
    },
    async deleteServer(id: string): Promise<void> {
        await serverService.delete(id);
    },

    // Services
    async getServices(): Promise<Service[]> {
        return await serviceService.getAll();
    },
    async createService(data: Partial<Service>): Promise<Service> {
        return await serviceService.create(data);
    },
    async updateService(id: string, data: Partial<Service>): Promise<Service> {
        return await serviceService.update(id, data);
    },
    async deleteService(id: string): Promise<void> {
        await serviceService.delete(id);
    },

    // Service Types
    async getServiceTypes(): Promise<ServiceType[]> {
        return await serviceTypeService.getAll();
    },

    // Service Configs
    async getServiceConfigs(serviceId?: string): Promise<ServiceConfig[]> {
        const configs = await serviceConfigService.getAll();
        return serviceId ? configs.filter(c => c.serviceId === serviceId) : configs;
    },
    async createServiceConfig(data: Partial<ServiceConfig>): Promise<ServiceConfig> {
        return await serviceConfigService.create(data);
    },
    async updateServiceConfig(id: string, data: Partial<ServiceConfig>): Promise<ServiceConfig> {
        return await serviceConfigService.update(id, data);
    },
    async deleteServiceConfig(id: string): Promise<void> {
        await serviceConfigService.delete(id);
    },
};
