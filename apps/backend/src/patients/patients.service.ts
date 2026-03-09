import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePatientDto, UpdatePatientDto, PatientQueryDto } from './dto/create-patient.dto';

@Injectable()
export class PatientsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPatientDto: CreatePatientDto) {
    return this.prisma.patient.create({
      data: createPatientDto,
    });
  }

  async findAll(query: PatientQueryDto) {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { firstName: { contains: search, mode: 'insensitive' as const } },
            { lastName: { contains: search, mode: 'insensitive' as const } },
            { patientNumber: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [patients, total] = await Promise.all([
      this.prisma.patient.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.patient.count({ where }),
    ]);

    return {
      data: patients,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { id },
    });

    if (!patient) {
      throw new NotFoundException(`Patient #${id} not found`);
    }

    return patient;
  }

  async update(id: string, updatePatientDto: UpdatePatientDto) {
    await this.findOne(id);

    return this.prisma.patient.update({
      where: { id },
      data: updatePatientDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.patient.delete({
      where: { id },
    });
  }
}
