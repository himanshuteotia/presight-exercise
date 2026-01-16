import { Request, Response } from "express";
import { people } from "../data/people.data";

export function getPeople(req: Request, res: Response) {
  const { page = 1, limit = 50, search, nationality, hobby } = req.query as {
    page?: number;
    limit?: number;
    search?: string;
    nationality?: string;
    hobby?: string;
  };
  let result = people;

  if (nationality) result = result.filter(p => p.nationality === nationality);
  if (hobby) result = result.filter(p => p.hobbies.includes(hobby));
  if (search) {
    const s = search.toLowerCase();
    result = result.filter(
      p => p.first_name.toLowerCase().includes(s) ||
           p.last_name.toLowerCase().includes(s)
    );
  }

  const start = (page - 1) * limit;
  res.json({ data: result.slice(start, start + Number(limit)), total: result.length });
}
