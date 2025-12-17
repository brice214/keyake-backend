// Script pour créer le Super Admin directement dans Supabase
// Utilisez: node create-admin-local.js

const bcrypt = require('bcryptjs');
const postgres = require('postgres');

// Connection string Supabase
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:$yKte8fxb!nH5-W@db.hqefowxjfvbekvnktsoh.supabase.co:5432/postgres?sslmode=require';

async function createSuperAdmin() {
  const sql = postgres(connectionString, {
    ssl: 'require',
  });

  const email = 'admin@titafgroupe.com';
  const password = 'Mambelo2025';
  const name = 'Super Admin';

  try {
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
        VALUES (${id}, ${email}, ${hashedPassword}, ${name}, 'super_admin', NOW())
      `;
      
      console.log('✅ Super admin created successfully!');
    }

    console.log('\n📋 Super Admin Credentials:');
    console.log('   Email:', email);
    console.log('   Password:', password);
    console.log('   ⚠️  Please change this password after first login!\n');
    
    await sql.end();
  } catch (error) {
    console.error('❌ Error:', error);
    await sql.end();
    process.exit(1);
  }
}

createSuperAdmin();

