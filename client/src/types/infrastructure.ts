export type ServerStatus = 'running' | 'stopped' | 'maintenance' | 'error';
export type ServiceStatus = 'healthy' | 'degraded' | 'down' | 'pending';

export interface Server {
    id: string;
    name: string;
    status: ServerStatus;
    ip: string;
    region: string;
    cpu: number;
    memory: number;
    storage: number;
    uptime: string;
    services: Service[];
    createdAt: Date;
}

export interface Service {
    id: string;
    name: string;
    type: 'database' | 'api' | 'web' | 'cache' | 'queue' | 'storage';
    status: ServiceStatus;
    version: string;
    port: number;
    lastDeployment: Date;
    createdAt: Date;
}

export interface ActivityLog {
    id: string;
    serverId: string;
    serverName: string;
    action: string;
    timestamp: Date;
    user: string;
    status: 'success' | 'pending' | 'failed';
}
