import { IsEmail, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';

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

    @ApiProperty({ example: 'password123', minLength: 6 })
    @IsString()
    @MinLength(6)
    password!: string;

    @ApiPropertyOptional({ enum: Role, default: Role.PATIENT })
    @IsOptional()
    @IsEnum(Role)
    role?: Role;
}
