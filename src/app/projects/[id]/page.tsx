import { getProjectById } from "@/app/lib/firestore";
import { notFound } from "next/navigation";

export const revalidate = 0; // Force dynamic fetch if desired

interface ProjectPageProps {
  params: { id: string };
}

// Server Component that fetches Firestore doc by ID
export default async function ProjectDetailsPage({ params }: ProjectPageProps) {
  const project = await getProjectById(params.id);

  if (!project) {
    return notFound();
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
      <p className="text-sm text-gray-600 mb-2">
        {project.location} |{" "}
        {project.startDate?.seconds
          ? new Date(project.startDate.seconds * 1000).toDateString()
          : ""}
      </p>
      <p className="text-gray-700 mb-4">{project.description}</p>

      {/* Images */}
      {project.images && project.images.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {project.images.map((url: string, i: number) => (
            <img key={i} src={url} alt="Project image" className="w-full" />
          ))}
        </div>
      )}

      {/* Videos */}
      {project.videoUrls && project.videoUrls.length > 0 && (
        <div className="space-y-4">
          {project.videoUrls.map((vidUrl: string, i: number) => (
            <div key={i} className="aspect-w-16 aspect-h-9">
              <iframe
                src={vidUrl}
                allowFullScreen
                className="w-full h-full"
                title={`Video ${i}`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
