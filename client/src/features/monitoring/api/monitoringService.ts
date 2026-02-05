import { createBaseService } from "@/services/baseService";
import { Server, Service } from "@/types/infrastructure";

// Endpoints sincronizados com o backend (padronizados para plural)
const serverService = createBaseService<Server, Partial<Server>>('/servers');
const serviceService = createBaseService<Service, Partial<Service>>('/services');
const serviceTypeService = createBaseService<ServiceType, Partial<ServiceType>>('/service-types');
const featureService = createBaseService<any, any>('/features');
const subfeatureService = createBaseService<any, any>('/subfeatures');
const serviceConfigService = createBaseService<ServiceConfig, Partial<ServiceConfig>>('/service-configs');

// Local interfaces for types not yet in infrastructure.ts
export interface ServiceType {
    id: string;
    code: string;
    name: string;
    description?: string;
}

// export interface ServiceConfig is kept below

export interface ServiceConfig {
    id: string;
    serviceId: string;
    key: string;
    value: string;
    isSecret: boolean;
}

export const monitoringService = {
    // Servers
    // Servers
    async getServers(): Promise<Server[]> {
        const servers = await serverService.getAll();
        // Ensure dates are parsed correctly
        return servers.map(server => ({
            ...server,
            createdAt: new Date(server.createdAt),
            // updatedAt needed? Server interface in infrastructure might not have updatedAt.
            // Let's check infrastructure.ts again. It has createdAt. It doesn't have updatedAt.
            // So I just map what matches.
            // Also need to default missing fields if any.
            // Infrastructure Server: id, name, status, ip, region, cpu, memory, storage, uptime, services, createdAt.
            // Backend returns everything.
            // Need to ensure services is an array. Backend might return it if joined.
            // serverService.getAll() returns what backend sends.
            // If backend doesn't send 'services', I need to default it to [].
            services: server.services || []
        }));
    },
    async getServerById(id: string): Promise<Server> {
        const server = await serverService.getById(id);
        return {
            ...server,
            createdAt: new Date(server.createdAt),
            services: (server.services || []).map(parseServiceDates)
        };
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
        const services = await serviceService.getAll();
        return services.map(parseServiceDates);
    },
    async createService(data: Partial<Service>): Promise<Service> {
        const service = await serviceService.create(data);
        return parseServiceDates(service);
    },
    async updateService(id: string, data: Partial<Service>): Promise<Service> {
        const service = await serviceService.update(id, data);
        return parseServiceDates(service);
    },
    async deleteService(id: string): Promise<void> {
        await serviceService.delete(id);
    },
    async getServiceById(id: string): Promise<Service> {
        const service = await serviceService.getById(id);
        return parseServiceDates(service);
    },

    // Service Types
    async getServiceTypes(): Promise<ServiceType[]> {
        return await serviceTypeService.getAll();
    },

    // Service Configs
    async getServiceConfigs(serviceId?: string): Promise<ServiceConfig[]> {
        const configs = await serviceConfigService.getAll(serviceId ? { serviceId } : undefined);
        return configs;
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

    // Features
    async getFeatures(): Promise<any[]> {
        return await featureService.getAll();
    },
};

function parseServiceDates(service: any): Service {
    return {
        ...service,
        createdAt: new Date(service.createdAt),
        lastDeployment: service.lastDeployment ? new Date(service.lastDeployment) : undefined,
        // Ensure legacy or missing fields safely default if needed, though backend should provide them
    };
}
