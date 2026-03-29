// src/services/student.service.js
import prisma from '../lib/prisma.js';
import { AppError } from '../utils/errors.js';

// ── Generate Student ID ────────────────────────────────────────
// Creates a human-readable ID like "STU-2025-042"
const generateStudentId = async () => {
  const year  = new Date().getFullYear();
  const count = await prisma.student.count();
  const padded = String(count + 1).padStart(3, '0'); // "001", "042"
  return `STU-${year}-${padded}`;
};

// ── Get All Students (with pagination & filters) ───────────────
export const getStudents = async (query) => {
  const { page, limit, search, classId, gender } = query;
  const skip = (page - 1) * limit; // how many records to skip

  // Build the where clause dynamically
  // Only include a filter if the value was actually provided
  const where = {
    isActive: true,
    ...(classId && { classId }),
    ...(gender  && { gender  }),
    ...(search  && {
      OR: [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName:  { contains: search, mode: 'insensitive' } },
        { studentId: { contains: search, mode: 'insensitive' } },
      ],
      // OR means: match if firstName contains search
      // OR lastName contains it OR studentId contains it
      // mode: 'insensitive' = case-insensitive search
    }),
  };

  // Run count and data queries in parallel for performance
  const [total, students] = await Promise.all([
    prisma.student.count({ where }),
    prisma.student.findMany({
      where,
      skip,
      take: limit,
      orderBy: { lastName: 'asc' },
      include: {
        class: {
          select: {
            id:   true,
            name: true,
          }
        }
      }
    }),
  ]);

  return {
    data: students,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// ── Get Single Student ─────────────────────────────────────────
export const getStudentById = async (id) => {
  const student = await prisma.student.findUnique({
    where: { id },
    include: {
      class: {
        include: {
          gradeLevel: true,
          teacher: {
            select: {
              id: true, firstName: true, lastName: true, email: true
            }
          }
        }
      },
      attendances: {
        orderBy: { date: 'desc' },
        take: 10, // last 10 attendance records
      },
      gradeRecords: {
        include: { subject: true },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  });

  if (!student) {
    throw new AppError('Student not found', 404);
  }

  return student;
};

// ── Create Student ─────────────────────────────────────────────
export const createStudent = async (data) => {
  // Verify the class exists before creating the student
  const classExists = await prisma.class.findUnique({
    where: { id: data.classId },
  });

  if (!classExists) {
    throw new AppError('Class not found', 404);
  }

  const studentId = await generateStudentId();

  const student = await prisma.student.create({
    data: {
      ...data,
      studentId,
      dateOfBirth: new Date(data.dateOfBirth),
    },
    include: {
      class: { select: { id: true, name: true } }
    },
  });

  return student;
};

// ── Update Student ─────────────────────────────────────────────
export const updateStudent = async (id, data) => {
  // Check student exists first
  const existing = await prisma.student.findUnique({ where: { id } });
  if (!existing) throw new AppError('Student not found', 404);

  // If classId is being updated, verify new class exists
  if (data.classId) {
    const classExists = await prisma.class.findUnique({
      where: { id: data.classId }
    });
    if (!classExists) throw new AppError('Class not found', 404);
  }

  const student = await prisma.student.update({
    where: { id },
    data: {
      ...data,
      ...(data.dateOfBirth && { dateOfBirth: new Date(data.dateOfBirth) }),
    },
    include: {
      class: { select: { id: true, name: true } }
    },
  });

  return student;
};

// ── Soft Delete Student ────────────────────────────────────────
// We never hard-delete students — their historical records
// (attendance, grades) must remain intact.
// Instead we set isActive = false.
export const deleteStudent = async (id) => {
  const existing = await prisma.student.findUnique({ where: { id } });
  if (!existing) throw new AppError('Student not found', 404);

  await prisma.student.update({
    where: { id },
    data:  { isActive: false },
  });

  return { message: 'Student deactivated successfully' };
};