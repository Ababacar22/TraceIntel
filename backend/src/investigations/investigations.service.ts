import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { CreateInvestigationDto } from './dto/create-investigation.dto';

@Injectable()
export class InvestigationsService {
    private readonly logger = new Logger(InvestigationsService.name);

    constructor(
        private prisma: PrismaService,
        @InjectQueue('osint-tasks') private osintTaskQueue: Queue,
    ) { }

    async createInvestigation(dto: CreateInvestigationDto) {
        this.logger.log(`Creating investigation with ${dto.targets.length} targets.`);

        // 1. Transactional state creation in PostgreSQL
        const investigation = await this.prisma.investigation.create({
            data: {
                title: dto.title,
                config: dto.config || {},
                targets: {
                    create: dto.targets.map(t => ({
                        targetType: t.targetType,
                        targetValue: t.targetValue,
                    })),
                },
            },
            include: {
                targets: true,
            },
        });

        // 2. Dispatch OSINT tasks based on Target Types
        // In a real scenario, this queries a Plugin Registry. We hardcode it for now.
        for (const target of investigation.targets) {
            let activeModules = [];
            if (target.targetType === 'EMAIL_ADDRESS') {
                activeModules = ['holehe', 'haveibeenpwned'];
            } else if (target.targetType === 'DOMAIN_NAME') {
                activeModules = ['whois', 'sublist3r'];
            } else {
                activeModules = ['generic_search'];
            }

            for (const moduleName of activeModules) {
                const task = await this.prisma.task.create({
                    data: {
                        investigationId: investigation.id,
                        moduleName: moduleName,
                        status: 'QUEUED',
                    },
                });

                // Push to BullMQ Redis Queue
                await this.osintTaskQueue.add(moduleName, {
                    taskId: task.id,
                    investigationId: investigation.id,
                    moduleName: moduleName,
                    target: {
                        type: target.targetType,
                        value: target.targetValue,
                    },
                    config: investigation.config,
                });
            }
        }

        return investigation;
    }
}
