import { InvestigationsService } from './investigations.service';
import { CreateInvestigationDto } from './dto/create-investigation.dto';
import { PrismaService } from '../prisma/prisma.service';
export declare class InvestigationsController {
    private readonly investigationsService;
    private readonly prisma;
    constructor(investigationsService: InvestigationsService, prisma: PrismaService);
    create(createInvestigationDto: CreateInvestigationDto): Promise<{
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
    findAll(): Promise<{
        title: string | null;
        config: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<({
        targets: {
            targetType: string;
            targetValue: string;
            id: string;
            investigationId: string;
        }[];
        tasks: ({
            vulnerabilities: {
                id: string;
                createdAt: Date;
                name: string;
                taskId: string;
                templateId: string;
                severity: string;
                description: string | null;
                matchedAt: string | null;
                reference: import("@prisma/client/runtime/library").JsonValue | null;
                extractedResults: import("@prisma/client/runtime/library").JsonValue | null;
            }[];
        } & {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            investigationId: string;
            moduleName: string;
            errorMessage: string | null;
            rawResults: import("@prisma/client/runtime/library").JsonValue | null;
        })[];
    } & {
        title: string | null;
        config: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
}
