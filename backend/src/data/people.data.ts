import { faker } from "@faker-js/faker";
import type { Person } from "../../../shared/types/person";
import { HOBBIES } from "../../../shared/constants/hobbies";

export const people: Person[] = Array.from({ length: 1000 }).map(() => ({
  id: crypto.randomUUID(),
  avatar: faker.image.avatar(),
  first_name: faker.person.firstName(),
  last_name: faker.person.lastName(),
  age: faker.number.int({ min: 18, max: 70 }),
  nationality: faker.location.country(),
  hobbies: faker.helpers.arrayElements(
    HOBBIES,
    faker.number.int({ min: 0, max: 6 })
  ),
}));
