export declare class TargetDto {
    targetType: string;
    targetValue: string;
}
export declare class CreateInvestigationDto {
    title?: string;
    targets: TargetDto[];
    config?: Record<string, any>;
}
