import type { Person } from "../types/person";

export async function getPersonMock(): Promise<Person> {
  return {
    id: "person-1",
    name: "Ava Brooks",
    role: "Lead Curator",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
  };
}
