import prisma from '../lib/prisma.js';
import { AppError } from '../utils/errors.js';

export const getClasses = async (query = {}) => {
  const { academicYear, gradeLevelId } = query;

  const where = {
    ...(academicYear  && { academicYear }),
    ...(gradeLevelId  && { gradeLevelId }),
  };

  const classes = await prisma.class.findMany({
    where,
    include: {
      gradeLevel: true,
      teacher: {
        select: {
          id: true, firstName: true, lastName: true
        }
      },
      _count: {
        select: { students: true } // how many students in each class
      }
    },
    orderBy: { name: 'asc' },
  });

  return classes;
};

export const getClassById = async (id) => {
  const cls = await prisma.class.findUnique({
    where: { id },
    include: {
      gradeLevel: true,
      teacher: {
        select: { id: true, firstName: true, lastName: true, email: true }
      },
      students: {
        where: { isActive: true },
        orderBy: { lastName: 'asc' },
      },
      _count: { select: { students: true } },
    },
  });

  if (!cls) throw new AppError('Class not found', 404);
  return cls;
};

export const createClass = async (data) => {
  // Check grade level exists
  const gradeLevel = await prisma.gradeLevel.findUnique({
    where: { id: data.gradeLevelId }
  });
  if (!gradeLevel) throw new AppError('Grade level not found', 404);

  // Check teacher exists if provided
  if (data.teacherId) {
    const teacher = await prisma.user.findUnique({
      where: { id: data.teacherId }
    });
    if (!teacher) throw new AppError('Teacher not found', 404);
  }

  // Check for duplicate class name in same academic year
  const duplicate = await prisma.class.findUnique({
    where: {
      name_academicYear: {
        name:         data.name,
        academicYear: data.academicYear,
      }
    }
  });
  if (duplicate) {
    throw new AppError(
      `Class "${data.name}" already exists for ${data.academicYear}`, 409
    );
  }

  return prisma.class.create({
    data,
    include: { gradeLevel: true }
  });
};

export const updateClass = async (id, data) => {
  const existing = await prisma.class.findUnique({ where: { id } });
  if (!existing) throw new AppError('Class not found', 404);

  return prisma.class.update({
    where: { id },
    data,
    include: { gradeLevel: true, teacher: true },
  });
};

export const deleteClass = async (id) => {
  const existing = await prisma.class.findUnique({
    where: { id },
    include: { _count: { select: { students: true } } }
  });

  if (!existing) throw new AppError('Class not found', 404);

  // Prevent deletion if students are enrolled
  if (existing._count.students > 0) {
    throw new AppError(
      'Cannot delete a class with enrolled students. Reassign students first.',
      400
    );
  }

  await prisma.class.delete({ where: { id } });
  return { message: 'Class deleted successfully' };
};