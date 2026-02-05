import { Server, ActivityLog } from '@/types/infrastructure';

export const mockServers: Server[] = [
    {
        id: '1',
        name: 'production-api-01',
        status: 'running',
        ip: '192.168.1.101',
        region: 'us-east-1',
        cpu: 45,
        memory: 62,
        storage: 38,
        uptime: '15d 4h 32m',
        services: [
            { id: 's1', name: 'Node.js API', type: 'api', status: 'healthy', version: 'v18.17.0', port: 3000, lastDeployment: new Date('2024-01-15') },
            { id: 's2', name: 'PostgreSQL', type: 'database', status: 'healthy', version: '15.4', port: 5432, lastDeployment: new Date('2024-01-10') },
            { id: 's3', name: 'Redis Cache', type: 'cache', status: 'healthy', version: '7.2', port: 6379, lastDeployment: new Date('2024-01-12') },
        ],
        createdAt: new Date('2023-06-15'),
    },
    {
        id: '2',
        name: 'staging-web-02',
        status: 'running',
        ip: '192.168.1.102',
        region: 'us-west-2',
        cpu: 28,
        memory: 45,
        storage: 22,
        uptime: '8d 12h 15m',
        services: [
            { id: 's4', name: 'React App', type: 'web', status: 'healthy', version: 'v18.2.0', port: 80, lastDeployment: new Date('2024-01-18') },
            { id: 's5', name: 'Nginx', type: 'web', status: 'healthy', version: '1.25', port: 443, lastDeployment: new Date('2024-01-05') },
        ],
        createdAt: new Date('2023-08-20'),
    },
    {
        id: '3',
        name: 'dev-db-03',
        status: 'maintenance',
        ip: '192.168.1.103',
        region: 'eu-central-1',
        cpu: 12,
        memory: 78,
        storage: 65,
        uptime: '2d 6h 45m',
        services: [
            { id: 's6', name: 'MongoDB', type: 'database', status: 'pending', version: '7.0', port: 27017, lastDeployment: new Date('2024-01-20') },
            { id: 's7', name: 'RabbitMQ', type: 'queue', status: 'degraded', version: '3.12', port: 5672, lastDeployment: new Date('2024-01-08') },
        ],
        createdAt: new Date('2023-11-10'),
    },
    {
        id: '4',
        name: 'backup-storage-04',
        status: 'stopped',
        ip: '192.168.1.104',
        region: 'ap-southeast-1',
        cpu: 0,
        memory: 0,
        storage: 85,
        uptime: '0d 0h 0m',
        services: [
            { id: 's8', name: 'MinIO', type: 'storage', status: 'down', version: 'RELEASE.2024', port: 9000, lastDeployment: new Date('2024-01-01') },
        ],
        createdAt: new Date('2023-12-01'),
    },
];

export const mockActivities: ActivityLog[] = [
    { id: 'a1', serverId: '1', serverName: 'production-api-01', action: 'Deploy v2.4.1', timestamp: new Date('2024-01-20T14:32:00'), user: 'admin@company.com', status: 'success' },
    { id: 'a2', serverId: '2', serverName: 'staging-web-02', action: 'Scale up to 4 instances', timestamp: new Date('2024-01-20T13:15:00'), user: 'devops@company.com', status: 'success' },
    { id: 'a3', serverId: '3', serverName: 'dev-db-03', action: 'Maintenance mode enabled', timestamp: new Date('2024-01-20T12:00:00'), user: 'admin@company.com', status: 'pending' },
    { id: 'a4', serverId: '1', serverName: 'production-api-01', action: 'SSL certificate renewed', timestamp: new Date('2024-01-19T18:45:00'), user: 'system', status: 'success' },
    { id: 'a5', serverId: '4', serverName: 'backup-storage-04', action: 'Server shutdown', timestamp: new Date('2024-01-19T10:30:00'), user: 'admin@company.com', status: 'success' },
    { id: 'a6', serverId: '2', serverName: 'staging-web-02', action: 'Rollback to v1.9.0', timestamp: new Date('2024-01-18T22:10:00'), user: 'devops@company.com', status: 'failed' },
];
