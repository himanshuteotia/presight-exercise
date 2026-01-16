import { Request, Response } from "express";
import { people } from "../data/people.data";

export function getMeta(req: Request, res: Response) {
  const hobbies: Record<string, number> = {};
  const nationalities: Record<string, number> = {};

  people.forEach((p) => {
    nationalities[p.nationality] = (nationalities[p.nationality] || 0) + 1;
    p.hobbies.forEach((h) => (hobbies[h] = (hobbies[h] || 0) + 1));
  });

  res.json({
    topHobbies: Object.keys(hobbies).slice(0, 20),
    topNationalities: Object.keys(nationalities).slice(0, 20),
  });
}
