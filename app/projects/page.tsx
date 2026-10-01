const projects = [
  { name: "Optimal Schedule Builder", description: "Builds the best class schedule for UGA students." },
  { name: "Study Group Finder", description: "Helps students find study sessions for their classes." },
];

export default function ProjectsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Projects</h1>
      <ul className="mt-6 space-y-4">
        {projects.map((project) => (
          <li key={project.name} className="rounded-lg border border-gray-200 p-4">
            <h2 className="font-semibold">{project.name}</h2>
            <p className="text-gray-600">{project.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
