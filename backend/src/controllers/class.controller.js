import * as classService from '../services/class.service.js';

export const getClasses = async (req, res, next) => {
  try {
    const classes = await classService.getClasses(req.query);
    res.json({ data: classes });
  } catch (error) { next(error); }
};

export const getClass = async (req, res, next) => {
  try {
    const cls = await classService.getClassById(req.params.id);
    res.json({ data: cls });
  } catch (error) { next(error); }
};

export const createClass = async (req, res, next) => {
  try {
    const cls = await classService.createClass(req.body);
    res.status(201).json({ data: cls });
  } catch (error) { next(error); }
};

export const updateClass = async (req, res, next) => {
  try {
    const cls = await classService.updateClass(req.params.id, req.body);
    res.json({ data: cls });
  } catch (error) { next(error); }
};

export const deleteClass = async (req, res, next) => {
  try {
    const result = await classService.deleteClass(req.params.id);
    res.json(result);
  } catch (error) { next(error); }
};