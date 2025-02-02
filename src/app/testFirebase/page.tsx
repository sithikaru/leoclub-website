'use client'

import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  DocumentData,
} from "firebase/firestore";

const TestFirestore = () => {
  const [projects, setProjects] = useState<DocumentData[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const querySnapshot = await getDocs(collection(db, "testProjects"));
      const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjects(docs);
    };

    fetchProjects();
  }, []);

  const addProject = async () => {
    await addDoc(collection(db, "testProjects"), {
      title: "Sample Project",
      description: "This is a test",
      createdAt: new Date(),
    });
    alert("Project Added!");
  };

  return (
    <div className="p-6">
      <button
        className="px-4 py-2 bg-green-600 text-white rounded"
        onClick={addProject}
      >
        Add Project
      </button>

      <h2 className="text-2xl mt-4">Existing Projects:</h2>
      <ul className="mt-2">
        {projects.map((proj) => (
          <li key={proj.id} className="border p-2 my-2">
            <strong>{proj.title}</strong> - {proj.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TestFirestore;
