import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Create super admin
    const hashedPassword = await bcrypt.hash('Admin@123', 12);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@hms.com' },
        update: {},
        create: {
            email: 'admin@hms.com',
            password: hashedPassword,
            firstName: 'Super',
            lastName: 'Admin',
            role: Role.SUPER_ADMIN,
        },
    });

    console.log(`✅ Created admin: ${admin.email}`);
    console.log('✅ Seeding complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
