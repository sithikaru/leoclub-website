// app/projects/[id]/page.tsx
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Project } from "../../types/Project";

interface ProjectPageProps {
  params: { id: string };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = params;
  const docRef = doc(db, "projects", id);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    return <div>Project not found</div>;
  }

  const data = snapshot.data();
  const project: Project = {
    id: snapshot.id,
    ...JSON.parse(JSON.stringify(data)), // or parse timestamps manually
  };

  return (
    <div>
      <h1>{project.title}</h1>
      {/* etc. */}
    </div>
  );
}
