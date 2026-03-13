"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvestigationsModule = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const investigations_controller_1 = require("./investigations.controller");
const investigations_service_1 = require("./investigations.service");
const prisma_module_1 = require("../prisma/prisma.module");
let InvestigationsModule = class InvestigationsModule {
};
exports.InvestigationsModule = InvestigationsModule;
exports.InvestigationsModule = InvestigationsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            bullmq_1.BullModule.registerQueue({
                name: 'osint-tasks',
            }),
        ],
        controllers: [investigations_controller_1.InvestigationsController],
        providers: [investigations_service_1.InvestigationsService],
    })
], InvestigationsModule);
//# sourceMappingURL=investigations.module.js.map