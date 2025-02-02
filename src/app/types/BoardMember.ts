/* eslint-disable @typescript-eslint/no-explicit-any */
// app/types/BoardMember.ts
export interface BoardMember {
  id: string;
  name: string;
  position: string;
  photoUrls: string[]; // each member can have multiple images
  createdAt?: any;
}
