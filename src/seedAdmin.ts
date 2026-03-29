import { prisma } from './lib/prisma.js';
import { auth } from './lib/auth.js';

const ADMIN_EMAIL = 'admin@dentaflow.com';
const ADMIN_PASSWORD = 'Admin123!';
const ADMIN_NAME = 'Admin User';

export async function seedAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { email: ADMIN_EMAIL },
    });

    if (existingAdmin) {
      // Update role to ADMIN if not already
      if (existingAdmin.role !== 'ADMIN') {
        const updated = await prisma.user.update({
          where: { id: existingAdmin.id },
          data: { role: 'ADMIN' },
        });
        console.log('✅ Admin role updated for existing user:', {
          id: updated.id,
          email: updated.email,
          name: updated.name,
          role: updated.role,
        });
      } else {
        console.log('✅ Admin user already exists:', {
          id: existingAdmin.id,
          email: existingAdmin.email,
          name: existingAdmin.name,
          role: existingAdmin.role,
        });
      }
      return;
    }

    // Create admin user using better-auth
    const signUpResult = await auth.api.signUpEmail({
      body: {
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        name: ADMIN_NAME,
        role: 'ADMIN',
      },
    });

    if (!signUpResult?.user?.id) {
      throw new Error('Failed to create admin user (missing user id)');
    }

    // Update user role to ADMIN
    const updatedUser = await prisma.user.update({
      where: { id: signUpResult.user.id },
      data: { role: 'ADMIN' },
    });

    console.log('✅ Admin user seeded successfully:', {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('❌ Error seeding admin:', message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if executed directly
if (require.main === module) {
  seedAdmin();
}
