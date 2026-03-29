import prisma from '../lib/prisma.js';
import { AppError } from '../utils/errors.js';

// ── Mark Attendance (Bulk) ─────────────────────────────────────
// Marks attendance for an entire class in one request.
// Uses upsert so re-submitting the same day updates instead of errors.
export const markAttendance = async (data) => {
  const { classId, date, records } = data;

  // Verify class exists
  const cls = await prisma.class.findUnique({ where: { id: classId } });
  if (!cls) throw new AppError('Class not found', 404);

  const attendanceDate = new Date(date);

  // Upsert each record — create if not exists, update if it does.
  // This means teachers can correct mistakes by resubmitting.
  const results = await Promise.all(
    records.map(record =>
      prisma.attendance.upsert({
        where: {
          studentId_classId_date: {
            studentId: record.studentId,
            classId,
            date: attendanceDate,
          }
        },
        update: {
          status: record.status,
          note:   record.note,
        },
        create: {
          studentId: record.studentId,
          classId,
          date:      attendanceDate,
          status:    record.status,
          note:      record.note,
        },
      })
    )
  );

  return {
    message: `Attendance marked for ${results.length} students`,
    data:    results,
  };
};

// ── Get Attendance ─────────────────────────────────────────────
export const getAttendance = async (query) => {
  const { classId, studentId, date, startDate, endDate, page, limit } = query;
  const skip = (page - 1) * limit;

  const where = {
    ...(classId   && { classId }),
    ...(studentId && { studentId }),
    ...(date      && { date: new Date(date) }),
    ...(startDate && endDate && {
      date: {
        gte: new Date(startDate), // greater than or equal
        lte: new Date(endDate),   // less than or equal
      }
    }),
  };

  const [total, records] = await Promise.all([
    prisma.attendance.count({ where }),
    prisma.attendance.findMany({
      where,
      skip,
      take: limit,
      orderBy: { date: 'desc' },
      include: {
        student: {
          select: {
            id: true, firstName: true,
            lastName: true, studentId: true
          }
        },
        class: { select: { id: true, name: true } },
      },
    }),
  ]);

  return {
    data: records,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

// ── Get Attendance Summary for a Student ──────────────────────
// Returns counts: how many present, absent, late, excused
export const getStudentAttendanceSummary = async (studentId) => {
  const student = await prisma.student.findUnique({
    where: { id: studentId }
  });
  if (!student) throw new AppError('Student not found', 404);

  const summary = await prisma.attendance.groupBy({
    by:     ['status'],        // group records by their status field
    where:  { studentId },
    _count: { status: true },  // count how many of each status
  });

  // Transform into a clean object
  const result = {
    PRESENT: 0, ABSENT: 0, LATE: 0, EXCUSED: 0
  };

  summary.forEach(item => {
    result[item.status] = item._count.status;
  });

  const total = Object.values(result).reduce((a, b) => a + b, 0);
  result.total           = total;
  result.attendanceRate  = total > 0
    ? ((result.PRESENT + result.LATE) / total * 100).toFixed(1) + '%'
    : '0%';

  return result;
};