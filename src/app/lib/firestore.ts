/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "./firebase";
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  DocumentData
} from "firebase/firestore";

export async function getAllProjects(): Promise<DocumentData[]> {
  const snapshot = await getDocs(collection(db, "projects"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function addProject(data: any) {
  const docRef = await addDoc(collection(db, "projects"), {
    ...data,
    createdAt: new Date()
  });
  return docRef.id;
}

export async function updateProject(id: string, data: any) {
  const docRef = doc(db, "projects", id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: new Date()
  });
}

export async function deleteProject(id: string) {
  const docRef = doc(db, "projects", id);
  await deleteDoc(docRef);
}


export async function getAllBoardMembers() {
  const membersRef = collection(db, "board-members");
  const snapshot = await getDocs(membersRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}