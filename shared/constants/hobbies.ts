export const HOBBIES = [
  "Music",
  "Sports",
  "Reading",
  "Gaming",
  "Travel",
  "Cooking",
  "Art",
  "Photography",
  "Fitness",
  "Writing"
] as const;

export type Hobby = typeof HOBBIES[number];
