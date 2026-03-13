import { PrismaService } from '../prisma/prisma.service';
import { Queue } from 'bullmq';
import { CreateInvestigationDto } from './dto/create-investigation.dto';
export declare class InvestigationsService {
    private prisma;
    private osintTaskQueue;
    private readonly logger;
    constructor(prisma: PrismaService, osintTaskQueue: Queue);
    createInvestigation(dto: CreateInvestigationDto): Promise<{
        targets: {
            targetType: string;
            targetValue: string;
            id: string;
            investigationId: string;
        }[];
    } & {
        title: string | null;
        config: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
