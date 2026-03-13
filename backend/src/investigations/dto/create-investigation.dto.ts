import { IsString, IsNotEmpty, IsArray, ValidateNested, IsOptional, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

export class TargetDto {
    @IsString()
    @IsNotEmpty()
    targetType: string;

    @IsString()
    @IsNotEmpty()
    targetValue: string;
}

export class CreateInvestigationDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TargetDto)
    targets: TargetDto[];

    @IsObject()
    @IsOptional()
    config?: Record<string, any>;
}
