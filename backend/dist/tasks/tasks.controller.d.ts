import { TasksService } from './tasks.service';
import { UpdateTaskStatusDto, SubmitTaskResultsDto } from './dto/task.dto';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    updateStatus(id: string, dto: UpdateTaskStatusDto): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        investigationId: string;
        moduleName: string;
        errorMessage: string | null;
        rawResults: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    submitResults(id: string, dto: SubmitTaskResultsDto): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        investigationId: string;
        moduleName: string;
        errorMessage: string | null;
        rawResults: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
}
