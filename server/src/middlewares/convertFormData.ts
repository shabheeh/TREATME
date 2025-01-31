import { Request, Response, NextFunction } from "express";

export const convertFormData = (req: Request, res: Response, next: NextFunction): void => {
  try {

    req.body.experience = Number(req.body.experience);
    req.body.languages = JSON.parse(req.body.languages);

    next(); 
  } catch (error) {
    res.status(400).json({ error: "Invalid form data format" });
  }
};
