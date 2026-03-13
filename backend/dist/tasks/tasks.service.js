"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var TasksService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TasksService = TasksService_1 = class TasksService {
    prisma;
    logger = new common_1.Logger(TasksService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async updateStatus(id, dto) {
        this.logger.log(`Task ${id} status updated to ${dto.status}`);
        const task = await this.prisma.task.update({
            where: { id },
            data: { status: dto.status },
        });
        if (dto.status === 'COMPLETED' || dto.status === 'FAILED') {
            await this.checkInvestigationCompletion(task.investigationId);
        }
        return task;
    }
    async submitResults(id, dto) {
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
    async checkInvestigationCompletion(investigationId) {
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
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = TasksService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TasksService);
//# sourceMappingURL=tasks.service.js.map