import { Request, Response } from "express";
import { people } from "../data/people.data";

export function getPeople(req: Request, res: Response) {
  const page = Math.max(parseInt(req.query.page as string, 10) || 1, 1);
  const limit = Math.min(
    Math.max(parseInt(req.query.limit as string, 10) || 30, 1),
    100
  );

  const search = req.query.search as string | undefined;
  const nationality = req.query.nationality as string | undefined;
  const hobby = req.query.hobby as string | undefined;

  let result = people;

  if (nationality) {
    result = result.filter(p => p.nationality === nationality);
  }

  if (hobby) {
    result = result.filter(p => p.hobbies.includes(hobby));
  }

  if (search) {
    const s = search.toLowerCase();
    result = result.filter(
      p =>
        p.first_name.toLowerCase().includes(s) ||
        p.last_name.toLowerCase().includes(s)
    );
  }

  const start = (page - 1) * limit;

  res.json({
    data: result.slice(start, start + limit),
    total: result.length,
    page,
    limit
  });
}
