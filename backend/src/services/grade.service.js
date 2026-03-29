import prisma from '../lib/prisma.js';
import { AppError } from '../utils/errors.js';

export const createGrade = async (data, teacherId) => {
  // Verify student, subject, and class all exist
  const [student, subject, cls] = await Promise.all([
    prisma.student.findUnique({ where: { id: data.studentId } }),
    prisma.subject.findUnique({ where: { id: data.subjectId } }),
    prisma.class.findUnique({   where: { id: data.classId   } }),
  ]);

  if (!student) throw new AppError('Student not found', 404);
  if (!subject) throw new AppError('Subject not found', 404);
  if (!cls)     throw new AppError('Class not found', 404);

  return prisma.gradeRecord.create({
    data: { ...data, teacherId },
    include: {
      student: { select: { id: true, firstName: true, lastName: true } },
      subject: { select: { id: true, name: true } },
    },
  });
};

export const getGrades = async (query) => {
  const { studentId, classId, subjectId, term, page, limit } = query;
  const skip = (page - 1) * limit;

  const where = {
    ...(studentId && { studentId }),
    ...(classId   && { classId   }),
    ...(subjectId && { subjectId }),
    ...(term      && { term      }),
  };

  const [total, grades] = await Promise.all([
    prisma.gradeRecord.count({ where }),
    prisma.gradeRecord.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        student: { select: { id: true, firstName: true, lastName: true, studentId: true } },
        subject: { select: { id: true, name: true } },
        teacher: { select: { id: true, firstName: true, lastName: true } },
      },
    }),
  ]);

  return {
    data: grades,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

export const getStudentGradeSummary = async (studentId) => {
  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student) throw new AppError('Student not found', 404);

  // Get average score per subject
  const summary = await prisma.gradeRecord.groupBy({
    by:    ['subjectId'],
    where: { studentId },
    _avg:  { score: true },
    _count:{ score: true },
    _min:  { score: true },
    _max:  { score: true },
  });

  // Enrich with subject names
  const enriched = await Promise.all(
    summary.map(async item => {
      const subject = await prisma.subject.findUnique({
        where: { id: item.subjectId },
        select: { name: true },
      });
      return {
        subject:   subject?.name,
        average:   item._avg.score?.toFixed(1),
        highest:   item._max.score,
        lowest:    item._min.score,
        totalExams:item._count.score,
      };
    })
  );

  return enriched;
};

export const updateGrade = async (id, data) => {
  const existing = await prisma.gradeRecord.findUnique({ where: { id } });
  if (!existing) throw new AppError('Grade record not found', 404);

  return prisma.gradeRecord.update({
    where: { id },
    data,
    include: {
      student: { select: { id: true, firstName: true, lastName: true } },
      subject: { select: { id: true, name: true } },
    },
  });
};

export const deleteGrade = async (id) => {
  const existing = await prisma.gradeRecord.findUnique({ where: { id } });
  if (!existing) throw new AppError('Grade record not found', 404);

  await prisma.gradeRecord.delete({ where: { id } });
  return { message: 'Grade record deleted' };
};