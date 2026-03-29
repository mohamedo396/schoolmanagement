// src/controllers/student.controller.js
import * as studentService from '../services/student.service.js';
import { studentQuerySchema } from '../schemas/student.schema.js';

// Notice: controllers are thin. They just:
// 1. Parse/validate input
// 2. Call a service
// 3. Send the response
// All real logic lives in the service.

export const getStudents = async (req, res, next) => {
  try {
    // Validate and coerce query parameters
    const query  = studentQuerySchema.parse(req.query);
    const result = await studentService.getStudents(query);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getStudent = async (req, res, next) => {
  try {
    const student = await studentService.getStudentById(req.params.id);
    res.json({ data: student });
  } catch (error) {
    next(error);
  }
};

export const createStudent = async (req, res, next) => {
  try {
    // req.body is already validated by the validate middleware
    const student = await studentService.createStudent(req.body);
    res.status(201).json({ data: student });
    // 201 = Created (vs 200 = OK)
  } catch (error) {
    next(error);
  }
};

export const updateStudent = async (req, res, next) => {
  try {
    const student = await studentService.updateStudent(
      req.params.id,
      req.body
    );
    res.json({ data: student });
  } catch (error) {
    next(error);
  }
};

export const deleteStudent = async (req, res, next) => {
  try {
    const result = await studentService.deleteStudent(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};