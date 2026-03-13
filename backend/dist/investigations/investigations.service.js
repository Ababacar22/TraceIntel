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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var InvestigationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvestigationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
let InvestigationsService = InvestigationsService_1 = class InvestigationsService {
    prisma;
    osintTaskQueue;
    logger = new common_1.Logger(InvestigationsService_1.name);
    constructor(prisma, osintTaskQueue) {
        this.prisma = prisma;
        this.osintTaskQueue = osintTaskQueue;
    }
    async createInvestigation(dto) {
        this.logger.log(`Creating investigation with ${dto.targets.length} targets.`);
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
        for (const target of investigation.targets) {
            let activeModules = [];
            if (target.targetType === 'EMAIL_ADDRESS') {
                activeModules = ['holehe', 'haveibeenpwned'];
            }
            else if (target.targetType === 'DOMAIN_NAME') {
                activeModules = ['whois', 'sublist3r'];
            }
            else {
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
};
exports.InvestigationsService = InvestigationsService;
exports.InvestigationsService = InvestigationsService = InvestigationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, bullmq_1.InjectQueue)('osint-tasks')),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        bullmq_2.Queue])
], InvestigationsService);
//# sourceMappingURL=investigations.service.js.map