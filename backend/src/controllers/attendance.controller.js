import * as attendanceService from '../services/attendance.service.js';
import { attendanceQuerySchema } from '../schemas/attendance.schema.js';

export const markAttendance = async (req, res, next) => {
  try {
    const result = await attendanceService.markAttendance(req.body);
    res.status(201).json(result);
  } catch (error) { next(error); }
};

export const getAttendance = async (req, res, next) => {
  try {
    const query  = attendanceQuerySchema.parse(req.query);
    const result = await attendanceService.getAttendance(query);
    res.json(result);
  } catch (error) { next(error); }
};

export const getStudentAttendanceSummary = async (req, res, next) => {
  try {
    const summary = await attendanceService.getStudentAttendanceSummary(
      req.params.studentId
    );
    res.json({ data: summary });
  } catch (error) { next(error); }
};