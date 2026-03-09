import { IsEmail, IsString, MinLength, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  firstName!: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName!: string;

  @ApiProperty({ example: 'john.doe@hms.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'TempPass123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  roleId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  departmentId?: string;
}

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  roleId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  departmentId?: string;
}

export class ChangePasswordDto {
  @ApiProperty({ example: 'OldPass123' })
  @IsString()
  currentPassword!: string;

  @ApiProperty({ example: 'NewPass123', minLength: 6 })
  @IsString()
  @MinLength(6)
  newPassword!: string;
}

export class ResetPasswordDto {
  @ApiProperty({ example: 'NewTempPass123', minLength: 6 })
  @IsString()
  @MinLength(6)
  newPassword!: string;
}
