import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

async function createSuperAdmin() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL is not defined');
  }

  const sql = neon(connectionString);

  const email = 'admin@titafgroupe.com';
  const password = 'Mambelo2025';
  const name = 'Super Admin';
  const role = 'super_admin';

  console.log('🔐 Hashing password...');
  const hashedPassword = await bcrypt.hash(password, 10);

  const id = `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  console.log('📝 Checking if super admin already exists...');
  const existing = await sql`
    SELECT * FROM "SuperAdmin" WHERE email = ${email}
  `;

  if (existing.length > 0) {
    console.log('⚠️  Super admin already exists with email:', email);
    console.log('🔄 Updating password for existing admin...');
    
    await sql`
      UPDATE "SuperAdmin"
      SET password = ${hashedPassword}
      WHERE email = ${email}
    `;
    
    console.log('✅ Super admin password updated successfully!');
  } else {
    console.log('➕ Creating new super admin...');
    
    await sql`
      INSERT INTO "SuperAdmin" (id, email, password, name, role, created_at)
      VALUES (${id}, ${email}, ${hashedPassword}, ${name}, ${role}, NOW())
    `;
    
    console.log('✅ Super admin created successfully!');
  }

  console.log('\n📋 Super Admin Credentials:');
  console.log('   Email:', email);
  console.log('   Password:', password);
  console.log('   ⚠️  Please change this password after first login!\n');
}

createSuperAdmin()
  .then(() => {
    console.log('✨ Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error creating super admin:', error);
    process.exit(1);
  });
