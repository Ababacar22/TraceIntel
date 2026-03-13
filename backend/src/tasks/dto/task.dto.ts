import { IsString, IsNotEmpty, IsIn, IsObject, IsOptional } from 'class-validator';

export class UpdateTaskStatusDto {
    @IsString()
    @IsNotEmpty()
    @IsIn(['RUNNING', 'COMPLETED', 'FAILED'])
    status: string;
}

export class SubmitTaskResultsDto {
    @IsObject()
    @IsOptional()
    data?: Record<string, any>;

    @IsString()
    @IsOptional()
    error?: string;
}
