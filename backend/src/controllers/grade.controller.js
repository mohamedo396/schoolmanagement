import * as gradeService from '../services/grade.service.js';
import { gradeQuerySchema } from '../schemas/grade.schema.js';

export const createGrade = async (req, res, next) => {
  try {
    // req.user.userId comes from the protect middleware
    const grade = await gradeService.createGrade(req.body, req.user.userId);
    res.status(201).json({ data: grade });
  } catch (error) { next(error); }
};

export const getGrades = async (req, res, next) => {
  try {
    const query  = gradeQuerySchema.parse(req.query);
    const result = await gradeService.getGrades(query);
    res.json(result);
  } catch (error) { next(error); }
};

export const getStudentGradeSummary = async (req, res, next) => {
  try {
    const summary = await gradeService.getStudentGradeSummary(
      req.params.studentId
    );
    res.json({ data: summary });
  } catch (error) { next(error); }
};

export const updateGrade = async (req, res, next) => {
  try {
    const grade = await gradeService.updateGrade(req.params.id, req.body);
    res.json({ data: grade });
  } catch (error) { next(error); }
};

export const deleteGrade = async (req, res, next) => {
  try {
    const result = await gradeService.deleteGrade(req.params.id);
    res.json(result);
  } catch (error) { next(error); }
};