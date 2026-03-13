import { Controller, Patch, Post, Body, Param } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { UpdateTaskStatusDto, SubmitTaskResultsDto } from './dto/task.dto';

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) { }

    @Patch(':id/status')
    async updateStatus(@Param('id') id: string, @Body() dto: UpdateTaskStatusDto) {
        return this.tasksService.updateStatus(id, dto);
    }

    @Post(':id/results')
    async submitResults(@Param('id') id: string, @Body() dto: SubmitTaskResultsDto) {
        return this.tasksService.submitResults(id, dto);
    }
}
