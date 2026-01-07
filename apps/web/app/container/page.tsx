import columnDefinitions from "@/components/container/columns";
import { ContainerList } from "@/components/container/container-list";
import { DataTable } from "@/components/container/data-table";
import Navbar from "@/components/navigation/navbar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { containerApi } from "@/lib/api";
import { ContainerCardProps } from "@/types/contaier";

export default async function Page() {
  const { data: containers, error } = await containerApi.list.get();
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

function ContainerCard(container: ContainerCardProps) {
  return (
    <Card className="p-4 mb-4 border rounded-lg">
      <CardHeader>
        <CardTitle className="flex flex-col justify-center gap-2">
          <div className="flex flex-row justify-between">
            <h2 className="text-xl font-bold">{container.name}</h2>
            {ContainerStatus(container.status)}
          </div>
          <Badge variant={"secondary"}>{container.labels["qube.server"]}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="">{container.labels["qube.server.domain"]}</p>

        <p className="text-muted-foreground">
          Created At: {new Date(container.createdAt).toLocaleString()}
        </p>
      </CardContent>
    </Card>
  );
}
