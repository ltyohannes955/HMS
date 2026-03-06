import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDepartmentDto {
  @ApiProperty({ example: 'Cardiology' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ example: 'Department for heart and cardiovascular treatments' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateDepartmentDto {
  @ApiPropertyOptional({ example: 'Cardiology' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Updated description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
