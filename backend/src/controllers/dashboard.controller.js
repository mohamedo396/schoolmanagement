import prisma from '../lib/prisma.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    // Run all queries in parallel — much faster than sequential awaits
    const [
      totalStudents,
      totalClasses,
      totalTeachers,
      todayAttendance,
      recentStudents,
    ] = await Promise.all([

      // Total active students
      prisma.student.count({ where: { isActive: true } }),

      // Total classes this academic year
      prisma.class.count({
        where: { academicYear: '2024-2025' }
      }),

      // Total active teachers
      prisma.user.count({
        where: { role: 'TEACHER', isActive: true }
      }),

      // Today's attendance breakdown
      prisma.attendance.groupBy({
        by:    ['status'],
        where: { date: new Date(new Date().setHours(0, 0, 0, 0)) },
        _count:{ status: true },
      }),

      // 5 most recently added students
      prisma.student.findMany({
        where:   { isActive: true },
        orderBy: { createdAt: 'desc' },
        take:    5,
        include: {
          class: { select: { name: true } }
        },
      }),
    ]);

    // Format today's attendance into a clean object
    const attendanceToday = { PRESENT: 0, ABSENT: 0, LATE: 0, EXCUSED: 0 };
    todayAttendance.forEach(item => {
      attendanceToday[item.status] = item._count.status;
    });

    res.json({
      data: {
        stats: {
          totalStudents,
          totalClasses,
          totalTeachers,
        },
        attendanceToday,
        recentStudents,
      }
    });

  } catch (error) { next(error); }
};