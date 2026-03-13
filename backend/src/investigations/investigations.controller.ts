import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { InvestigationsService } from './investigations.service';
import { CreateInvestigationDto } from './dto/create-investigation.dto';
import { PrismaService } from '../prisma/prisma.service';

@Controller('investigations')
export class InvestigationsController {
    constructor(
        private readonly investigationsService: InvestigationsService,
        private readonly prisma: PrismaService,
    ) { }

    @Post()
    async create(@Body() createInvestigationDto: CreateInvestigationDto) {
        return this.investigationsService.createInvestigation(createInvestigationDto);
    }

    @Get()
    async findAll() {
        return this.prisma.investigation.findMany({
            orderBy: { createdAt: 'desc' },
            take: 20
        });
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.prisma.investigation.findUnique({
            where: { id },
            include: {
                targets: true,
                tasks: {
                    include: {
                        vulnerabilities: true
                    }
                },
            }
        });
    }
}
