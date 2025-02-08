/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  doc,
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
  query,
  where,
  DocumentData,
  orderBy,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase";

// ========== PROJECTS ==========

// Create a new project (with multiple images).
// `files` is an array of File objects from the form.
// We'll upload each file to Storage and store the URLs in Firestore.
export async function createProject(data: any, files: File[]): Promise<string> {
  // 1. Upload each file to Storage
  const imageUrls: string[] = [];
  for (const file of files) {
    const url = await uploadFile(file, "projects");
    if (url) imageUrls.push(url);
  }

  // 2. Add doc to Firestore
  const docRef = await addDoc(collection(db, "projects"), {
    title: data.title,
    description: data.description,
    location: data.location,
    startDate: data.startDate ? Timestamp.fromDate(new Date(data.startDate)) : null,
    endDate: data.endDate ? Timestamp.fromDate(new Date(data.endDate)) : null,
    status: data.status, // "past" or "upcoming"
    videoUrls: data.videoUrls ? data.videoUrls.split(",").map((s: string) => s.trim()) : [],
    images: imageUrls,
    createdAt: Timestamp.now(),
  });

  return docRef.id;
}

// Update an existing project (can also handle new files).
export async function updateProject(
  id: string,
  data: any,
  newFiles: File[]
): Promise<void> {
  const docRef = doc(db, "projects", id);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) throw new Error("Project not found.");

  // 1. If new files are provided, upload them and append to the existing images
  const existingData = snapshot.data();
  const existingImages = existingData.images || [];
  const newImageUrls: string[] = [];

  for (const file of newFiles) {
    const url = await uploadFile(file, "projects");
    if (url) newImageUrls.push(url);
  }

  const updatedImages = [...existingImages, ...newImageUrls];

  // 2. Build updated fields
  const updatedData = {
    title: data.title,
    description: data.description,
    location: data.location,
    startDate: data.startDate ? Timestamp.fromDate(new Date(data.startDate)) : null,
    endDate: data.endDate ? Timestamp.fromDate(new Date(data.endDate)) : null,
    status: data.status,
    videoUrls: data.videoUrls ? data.videoUrls.split(",").map((s: string) => s.trim()) : [],
    images: updatedImages,
    updatedAt: Timestamp.now(),
  };

  await updateDoc(docRef, updatedData);
}

// Get a single project
export async function getProjectById(id: string): Promise<any> {
  const docRef = doc(db, "projects", id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() };
}

// Delete a project
export async function deleteProject(id: string): Promise<void> {
  const docRef = doc(db, "projects", id);
  await deleteDoc(docRef);
}

// List projects (optionally filter by status)
export async function getProjectsByStatus(status?: string): Promise<DocumentData[]> {
  let q;
  if (status) {
    q = query(collection(db, "projects"), where("status", "==", status), orderBy("startDate", "asc"));
  } else {
    q = query(collection(db, "projects"), orderBy("startDate", "asc"));
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// ========== BOARD MEMBERS ==========

// Create a board member (single photo)
export async function createBoardMember(data: any, file?: File): Promise<string> {
  let photoUrl = "";
  if (file) {
    const url = await uploadFile(file, "board");
    if (url) photoUrl = url;
  }

  const docRef = await addDoc(collection(db, "boardMembers"), {
    name: data.name,
    position: data.position,
    priority: data.priority,
    photoUrl,
    createdAt: Timestamp.now(),
  });

  return docRef.id;
}

// Update a board member
export async function updateBoardMember(
  id: string,
  data: any,
  newFile?: File
): Promise<void> {
  const docRef = doc(db, "boardMembers", id);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) throw new Error("Member not found.");

  let updatedPhoto = snapshot.data().photoUrl || "";
  if (newFile) {
    const url = await uploadFile(newFile, "board");
    if (url) updatedPhoto = url;
  }

  await updateDoc(docRef, {
    name: data.name,
    position: data.position,
    priority: data.priority,
    photoUrl: updatedPhoto,
    updatedAt: Timestamp.now(),
  });
}

// Delete a board member
export async function deleteBoardMember(id: string): Promise<void> {
  const docRef = doc(db, "boardMembers", id);
  await deleteDoc(docRef);
}

// Get a single board member
export async function getBoardMemberById(id: string) {
  const docRef = doc(db, "boardMembers", id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() };
}

// List all board members
import { BoardMember } from "@/app/types/BoardMember";

export async function getAllBoardMembers(): Promise<BoardMember[]> {
  const snapshot = await getDocs(collection(db, "boardMembers"));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    name: doc.data().name,
    position: doc.data().position,
    photoUrl: doc.data().photoUrl,
    priority: doc.data().priority,
  }));
}

// ========== FILE UPLOAD UTILITY ==========

async function uploadFile(file: File, folder: string): Promise<string | null> {
  try {
    const storageRef = ref(storage, `${folder}/${Date.now()}-${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl;
  } catch (err) {
    console.error("File upload failed", err);
    return null;
  }
}

// ========== STATISTICS ==========

export async function getStats(): Promise<any> {
  // Fetch all documents from "projects" and "boardMembers"
  const projectsSnapshot = await getDocs(collection(db, "projects"));
  const boardSnapshot = await getDocs(collection(db, "boardMembers"));

  // Extract the raw data from the snapshots
  const projects = projectsSnapshot.docs.map((doc) => doc.data());
  const boardMembers = boardSnapshot.docs.map((doc) => doc.data());

  // Calculate how many projects are "past" vs. "upcoming"
  const completedProjects = projects.filter((project: any) => project.status === "past").length;
  const plannedProjects = projects.filter((project: any) => project.status === "upcoming").length;

  // Calculate the number of active board members (as an example)
  const activeMembers = boardMembers.length;

  // Return the stats object
  return {
    completedProjects,  // e.g. 5
    plannedProjects,    // e.g. 3
    activeMembers,      // e.g. 10
  };
}