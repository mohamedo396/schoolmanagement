import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ── Admin User ─────────────────────────────────────────────
  const hashedAdminPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@school.com' },
    update: {},
    create: {
      email: 'admin@school.com',
      password: hashedAdminPassword,
      firstName: 'School',
      lastName: 'Admin',
      role: 'ADMIN',
    },
  });

  console.log('✅ Admin created:', admin.email);

  // ── Teacher ────────────────────────────────────────────────
  const hashedTeacherPassword = await bcrypt.hash('teacher123', 10);

  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@school.com' },
    update: {},
    create: {
      email: 'teacher@school.com',
      password: hashedTeacherPassword,
      firstName: 'Fatima',
      lastName: 'Ait Omar',
      role: 'TEACHER',
    },
  });

  console.log('✅ Teacher created:', teacher.email);

  // ── Grade Levels ───────────────────────────────────────────
  const gradeLevelNames = [
    'Year 1', 'Year 2', 'Year 3',
    'Year 4', 'Year 5', 'Year 6'
  ];

  const gradeLevels = await Promise.all(
    gradeLevelNames.map((name, index) =>
      prisma.gradeLevel.upsert({
        where: { name },
        update: {},
        create: {
          name,
          description: `Primary school year ${index + 1}`,
        },
      })
    )
  );

  console.log('✅ Grade levels created:', gradeLevels.length);

  // ── Subjects for Year 1 ────────────────────────────────────
  const year1 = gradeLevels[0];

  const subjectsData = [
    { name: 'Mathematics',       code: 'MATH-Y1' },
    { name: 'Arabic Language',   code: 'ARAB-Y1' },
    { name: 'French Language',   code: 'FREN-Y1' },
    { name: 'Science',           code: 'SCI-Y1'  },
    { name: 'Islamic Education', code: 'ISLA-Y1' },
  ];

  const subjects = await Promise.all(
    subjectsData.map(subject =>
      prisma.subject.upsert({
        where: { code: subject.code },
        update: {},
        create: { ...subject, gradeLevelId: year1.id },
      })
    )
  );

  console.log('✅ Subjects created:', subjects.length);

  // ── Class ──────────────────────────────────────────────────
  const class1A = await prisma.class.upsert({
    where: {
      name_academicYear: {
        name: 'Year 1-A',
        academicYear: '2024-2025',
      },
    },
    update: {},
    create: {
      name: 'Year 1-A',
      academicYear: '2024-2025',
      capacity: 30,
      gradeLevelId: year1.id,
      teacherId: teacher.id,
    },
  });

  console.log('✅ Class created:', class1A.name);

  // ── Students ───────────────────────────────────────────────
  const studentsData = [
    {
      studentId:   'STU-2024-001',
      firstName:   'Ahmed',
      lastName:    'Benali',
      gender:      'MALE',
      dateOfBirth: new Date('2018-03-15'),
      parentName:  'Omar Benali',
      parentPhone: '0661234567',
    },
    {
      studentId:   'STU-2024-002',
      firstName:   'Fatima',
      lastName:    'Zahra',
      gender:      'FEMALE',
      dateOfBirth: new Date('2018-07-22'),
      parentName:  'Youssef Zahra',
      parentPhone: '0662345678',
    },
    {
      studentId:   'STU-2024-003',
      firstName:   'Youssef',
      lastName:    'Idrissi',
      gender:      'MALE',
      dateOfBirth: new Date('2018-11-08'),
      parentName:  'Hassan Idrissi',
      parentPhone: '0663456789',
    },
  ];

  await Promise.all(
    studentsData.map(student =>
      prisma.student.upsert({
        where: { studentId: student.studentId },
        update: {},
        create: { ...student, classId: class1A.id },
      })
    )
  );

  console.log('✅ Students created:', studentsData.length);
  console.log('🎉 Seeding complete!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());