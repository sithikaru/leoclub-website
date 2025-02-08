/* eslint-disable @typescript-eslint/no-explicit-any */
// app/types/BoardMember.ts
export interface BoardMember {
  id: string;
  name: string;
  position: string;
  photoUrl?: string;
  priority: number; // Add this line
}
