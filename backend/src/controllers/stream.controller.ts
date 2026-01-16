import { Request, Response } from "express";
import { faker } from "@faker-js/faker";

export function streamText(_: Request, res: Response) {
  const text = faker.lorem.paragraphs(32);
  let i = 0;

  res.setHeader("Content-Type", "text/plain");

  const interval = setInterval(() => {
    if (i >= text.length) {
      clearInterval(interval);
      res.end();
    } else {
      res.write(text[i++]);
    }
  }, 20);
}
