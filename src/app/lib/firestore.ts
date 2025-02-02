import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase";
import { Project } from "@/types/Project";
import { BoardMember } from "@/types/BoardMember";

// ---------- PROJECTS ---------- //

// Add a new project
export async function addProject(data: Omit<Project, "id">) {
  const docRef = await addDoc(collection(db, "projects"), data);
  return docRef.id;
}

// Get all projects
export async function getAllProjects(): Promise<Project[]> {
  const snapshot = await getDocs(collection(db, "projects"));
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as Project[];
}

// Get a single project by ID
export async function getProject(id: string): Promise<Project | null> {
  const docRef = doc(db, "projects", id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as Project;
}

// Update project
export async function updateProject(id: string, data: Partial<Project>) {
  const docRef = doc(db, "projects", id);
  await updateDoc(docRef, data);
}

// Delete project
export async function deleteProject(id: string) {
  const docRef = doc(db, "projects", id);
  await deleteDoc(docRef);
}

// ---------- BOARD MEMBERS ---------- //

// Add a new board member
export async function addBoardMember(data: Omit<BoardMember, "id">) {
  const docRef = await addDoc(collection(db, "boardMembers"), data);
  return docRef.id;
}

// Get all board members
export async function getAllBoardMembers(): Promise<BoardMember[]> {
  const snapshot = await getDocs(
    query(collection(db, "boardMembers"), orderBy("position", "asc"))
  );
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as BoardMember[];
}

// Update board member
export async function updateBoardMember(
  id: string,
  data: Partial<BoardMember>
) {
  const docRef = doc(db, "boardMembers", id);
  await updateDoc(docRef, data);
}

// Delete board member
export async function deleteBoardMember(id: string) {
  const docRef = doc(db, "boardMembers", id);
  await deleteDoc(docRef);
}
