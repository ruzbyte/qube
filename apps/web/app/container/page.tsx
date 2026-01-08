import { ContainerList } from "@/components/container/container-list";
import Navbar from "@/components/navigation/navbar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { containerApi } from "@/lib/api";

export default async function Page() {
  const { data: containers, error } = await containerApi.list.get({
    query: {},
  });

  if (error) {
    console.error("Error loading containers:", error);
  }

  return (
    <main className="relative flex min-h-screen flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8">
        {error && <p>Error loading containers</p>}
        {containers && <ContainerList containers={containers} />}
      </div>
    </main>
  );
}

function ContainerStatus(status: string) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {status == "running" ? (
          <span className="ml-4 text-green-500">◉</span>
        ) : (
          <span className="ml-4 text-red-500">◉</span>
        )}
      </TooltipTrigger>
      <TooltipContent>
        {status == "running" ? "Container is running" : "Container is stopped"}
      </TooltipContent>
    </Tooltip>
  );
}
