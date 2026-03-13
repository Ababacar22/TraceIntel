import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateTaskStatusDto, SubmitTaskResultsDto } from './dto/task.dto';

@Injectable()
export class TasksService {
    private readonly logger = new Logger(TasksService.name);

    constructor(private prisma: PrismaService) { }

    async updateStatus(id: string, dto: UpdateTaskStatusDto) {
        this.logger.log(`Task ${id} status updated to ${dto.status}`);

        // Update task status
        const task = await this.prisma.task.update({
            where: { id },
            data: { status: dto.status },
        });

        // If it's the last task in an investigation, mark investigation as completed? 
        // We can do a check here.
        if (dto.status === 'COMPLETED' || dto.status === 'FAILED') {
            await this.checkInvestigationCompletion(task.investigationId);
        }

        return task;
    }

    async submitResults(id: string, dto: SubmitTaskResultsDto) {
        this.logger.log(`Task ${id} results submitted`);
        const task = await this.prisma.task.update({
            where: { id },
            data: {
                status: dto.error ? 'FAILED' : 'COMPLETED',
                rawResults: dto.data,
                updatedAt: new Date(),
            },
        });

        if (task.moduleName === 'nuclei' && dto.data && Array.isArray(dto.data.vulnerabilities)) {
            const vulnerabilities = dto.data.vulnerabilities;
            this.logger.log(`Parsing ${vulnerabilities.length} vulnerabilities for task ${id}`);

            for (const vul of vulnerabilities) {
                await this.prisma.vulnerability.create({
                    data: {
                        taskId: id,
                        templateId: vul.templateId || 'unknown',
                        name: vul.name || 'Unknown Vulnerability',
                        severity: vul.severity || 'info',
                        description: vul.description,
                        matchedAt: vul.matchedAt,
                        reference: vul.reference,
                        extractedResults: vul.extractedResults,
                    }
                });
            }
        }

        this.logger.debug(`Results for ${id}: ${JSON.stringify(dto.data)}`);

        await this.checkInvestigationCompletion(task.investigationId);
        return task;
    }

    private async checkInvestigationCompletion(investigationId: string) {
        const tasks = await this.prisma.task.findMany({
            where: { investigationId }
        });

        const allFinished = tasks.every(t => t.status === 'COMPLETED' || t.status === 'FAILED');
        if (allFinished) {
            await this.prisma.investigation.update({
                where: { id: investigationId },
                data: { status: 'COMPLETED' }
            });
            this.logger.log(`Investigation ${investigationId} marked as COMPLETED.`);
        }
    }
}
