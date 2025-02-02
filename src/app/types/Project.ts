// types/Project.ts (or in the same file)
export interface Project {
    id: string;
    title: string;
    description?: string;
    images?: string[];
    videoUrls?: string[];
    // Add any other fields you store in Firestore
  }
  