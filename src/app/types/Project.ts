/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Project {
  id: string;
  title: string;
  description: string;
  location?: string;
  time?: string; // or a more specific date-time type
  status: "past" | "upcoming";
  images?: string[]; // image URLs
  videoUrls?: string[]; // video URLs
  createdAt?: any; // or a Timestamp
  updatedAt?: any;
}
