import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { InvestigationsController } from './investigations.controller';
import { InvestigationsService } from './investigations.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({
      name: 'osint-tasks',
    }),
  ],
  controllers: [InvestigationsController],
  providers: [InvestigationsService],
})
export class InvestigationsModule { }
