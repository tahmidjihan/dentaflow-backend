/**
 * Seed script to create demo users and clinics for DentaFlow
 * 
 * Run with: npx tsx prisma/seed.ts
 * 
 * Note: Passwords are hashed by better-auth automatically.
 * After running this script, you'll need to create accounts 
 * through the app's signup form or use the better-auth API.
 * 
 * Demo Credentials (create these via the app signup or API):
 * 
 * USER ACCOUNT
 * Email: demo@dentawave.com
 * Password: password123
 * Role: Patient (USER)
 * 
 * ADMIN ACCOUNT  
 * Email: admin@dentawave.com
 * Password: admin123
 * Role: Administrator (ADMIN)
 * 
 * DOCTOR ACCOUNT
 * Email: doctor@dentawave.com
 * Password: password123
 * Role: Doctor (DOCTOR)
 */

import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clean existing data (optional - remove if you want to keep existing data)
  // await prisma.payment.deleteMany({});
  // await prisma.appointment.deleteMany({});
  // await prisma.account.deleteMany({});
  // await prisma.user.deleteMany({});
  // await prisma.clinic.deleteMany({});

  // Create demo clinics
  const clinic1 = await prisma.clinic.upsert({
    where: { id: 'clinic-001' },
    update: {},
    create: {
      id: 'clinic-001',
      name: 'DentaWave Central London',
      status: 'open',
      email: 'central@dentawave.com',
      phone: '+44 20 7946 0958',
      location: '123 Oxford Street, London, W1D 2HG',
    },
  });

  const clinic2 = await prisma.clinic.upsert({
    where: { id: 'clinic-002' },
    update: {},
    create: {
      id: 'clinic-002',
      name: 'DentaWave Manchester',
      status: 'open',
      email: 'manchester@dentawave.com',
      phone: '+44 161 946 0958',
      location: '45 Deansgate, Manchester, M3 2BW',
    },
  });

  const clinic3 = await prisma.clinic.upsert({
    where: { id: 'clinic-003' },
    update: {},
    create: {
      id: 'clinic-003',
      name: 'DentaWave Birmingham',
      status: 'open',
      email: 'birmingham@dentawave.com',
      phone: '+44 121 946 0958',
      location: '78 High Street, Birmingham, B4 7SL',
    },
  });

  console.log('✅ Seed data created successfully!');
  console.log('\n📋 Demo Credentials:');
  console.log('┌─────────────────────────────────────────────────────────────┐');
  console.log('│ USER ACCOUNT                                               │');
  console.log('│ Email: demo@dentawave.com                                  │');
  console.log('│ Password: password123                                      │');
  console.log('│ Role: Patient (USER)                                       │');
  console.log('├─────────────────────────────────────────────────────────────┤');
  console.log('│ ADMIN ACCOUNT                                              │');
  console.log('│ Email: admin@dentawave.com                                 │');
  console.log('│ Password: admin123                                         │');
  console.log('│ Role: Administrator (ADMIN)                                │');
  console.log('├─────────────────────────────────────────────────────────────┤');
  console.log('│ DOCTOR ACCOUNT                                             │');
  console.log('│ Email: doctor@dentawave.com                                │');
  console.log('│ Password: password123                                      │');
  console.log('│ Role: Doctor (DOCTOR)                                      │');
  console.log('└─────────────────────────────────────────────────────────────┘');
  console.log('\n⚠️  Note: Create these accounts via the app signup form');
  console.log('   or use the better-auth API to set passwords.');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
