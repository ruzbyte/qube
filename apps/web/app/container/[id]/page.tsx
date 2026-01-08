import { containerApi } from '@/lib/api';
import { ContainerInspectView } from '@/components/container/inspect/container-inspect-view';
import Navbar from '@/components/navigation/navbar';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  setTimeout(() => {}, 2000);

  const { data: container, error } = await containerApi({
    id,
  }).get();

  if (error) {
    console.error('Error loading container:', error);
  }

  return (
    <main className="relative flex min-h-screen flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8">
        {error && (
          <div className="bg-destructive/15 text-destructive p-4 rounded-md">
            Error loading container: <pre> {JSON.stringify(error, null, 2)} </pre>
          </div>
        )}
        {container && <ContainerInspectView container={container} />}
      </div>
    </main>
  );
}
