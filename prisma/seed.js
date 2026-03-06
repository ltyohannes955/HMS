const { PrismaClient } = require('../node_modules/.prisma-custom/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding...');

  const roles = [
    {
      name: 'SUPER_ADMIN',
      description: 'Super Administrator with full access',
      permissions: ['*'],
    },
    {
      name: 'ADMIN',
      description: 'Administrator with managed access',
      permissions: ['READ', 'WRITE', 'UPDATE', 'DELETE'],
    },
    {
      name: 'DOCTOR',
      description: 'Doctor role for medical staff',
      permissions: ['READ_PATIENTS', 'WRITE_PATIENTS'],
    },
    { name: 'NURSE', description: 'Nurse role for patient care', permissions: ['READ_PATIENTS'] },
    {
      name: 'RECEPTIONIST',
      description: 'Receptionist for front desk operations',
      permissions: ['READ_APPOINTMENTS'],
    },
    {
      name: 'PHARMACIST',
      description: 'Pharmacist for pharmacy operations',
      permissions: ['READ_PRESCRIPTIONS'],
    },
    {
      name: 'LAB_TECHNICIAN',
      description: 'Lab Technician for laboratory tests',
      permissions: ['READ_LAB_TESTS'],
    },
    { name: 'PATIENT', description: 'Patient role', permissions: [] },
  ];

  for (const r of roles) {
    await prisma.role.upsert({
      where: { name: r.name },
      update: {},
      create: r,
    });
    console.log('Created role: ' + r.name);
  }

  const departments = [
    { name: 'Cardiology', description: 'Heart and cardiovascular department' },
    { name: 'Neurology', description: 'Brain and nervous system department' },
    { name: 'Orthopedics', description: 'Bone and joint department' },
    { name: 'Pediatrics', description: 'Children healthcare department' },
    { name: 'Emergency', description: 'Emergency and trauma department' },
    { name: 'Radiology', description: 'Imaging and diagnostics department' },
    { name: 'Pharmacy', description: 'Pharmacy and medication department' },
    { name: 'Laboratory', description: 'Medical laboratory department' },
  ];

  for (const d of departments) {
    await prisma.department.upsert({
      where: { name: d.name },
      update: {},
      create: d,
    });
    console.log('Created department: ' + d.name);
  }

  const adminRole = await prisma.role.findUnique({ where: { name: 'SUPER_ADMIN' } });
  await prisma.user.upsert({
    where: { email: 'admin@hms.com' },
    update: {},
    create: {
      email: 'admin@hms.com',
      password: '$2b$12$.tMKri8Ob33mQI8RanLwFurBGPv3BG8u/r7RB4vzqzpHg1Ze1pKbm',
      firstName: 'Super',
      lastName: 'Admin',
      roleId: adminRole.id,
    },
  });
  console.log('Created admin: admin@hms.com (password: Admin@123)');

  const doctorRole = await prisma.role.findUnique({ where: { name: 'DOCTOR' } });
  const cardio = await prisma.department.findUnique({ where: { name: 'Cardiology' } });
  await prisma.user.upsert({
    where: { email: 'doctor@hms.com' },
    update: {},
    create: {
      email: 'doctor@hms.com',
      password: '$2b$12$.tMKri8Ob33mQI8RanLwFurBGPv3BG8u/r7RB4vzqzpHg1Ze1pKbm',
      firstName: 'John',
      lastName: 'Smith',
      roleId: doctorRole.id,
      departmentId: cardio.id,
    },
  });
  console.log('Created doctor: doctor@hms.com (password: Admin@123)');

  console.log('Seeding complete!');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
