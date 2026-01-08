"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  IconBox,
  IconClock,
  IconNetwork,
  IconServer,
  IconActivity,
  IconCpu,
  IconTerminal,
} from "@tabler/icons-react";

export interface ContainerInfo {
  name: string;
  containerName: string;
  id: string;
  image: string;
  ports: string[];
  domain: string | null;
  attachedNetworks: string[];
  labels: Record<string, string | undefined>;
  environment: Record<string, string>;
  createdAt: string;
  startedAt: string;
  status: string;
}

interface ContainerInspectViewProps {
  container: ContainerInfo;
}

export function ContainerInspectView({ container }: ContainerInspectViewProps) {
  const isRunning = container.status.toLowerCase() === "running";

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {container.name}
          </h2>
          <p className="text-muted-foreground flex items-center gap-2 mt-1">
            <IconBox className="w-4 h-4" />
            {container.containerName}
            <span className="text-xs bg-muted px-2 py-0.5 rounded-full font-mono text-muted-foreground">
              {container.id.substring(0, 12)}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            variant={isRunning ? "default" : "secondary"}
            className={isRunning ? "bg-green-600 hover:bg-green-700" : ""}
          >
            <IconActivity className="w-3 h-3 mr-1" />
            {container.status}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="environment">Environment</TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Image</CardTitle>
                <IconServer className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div
                  className="text-sm font-bold truncate"
                  title={container.image}
                >
                  {container.image}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Domain</CardTitle>
                <IconNetwork className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">
                  {container.domain || "-"}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Created</CardTitle>
                <IconClock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm font-mono text-muted-foreground">
                  {new Date(container.createdAt).toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Started</CardTitle>
                <IconClock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm font-mono text-muted-foreground">
                  {new Date(container.startedAt).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </div>
          {container.labels["qube.server.game"] === "minecraft" && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium ">Run</CardTitle>
                <IconTerminal className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                Run minecraft server command
                <Input placeholder="op zaroc" />
              </CardContent>
            </Card>
          )}
          <Card>
            <CardHeader>
              <CardTitle>Labels</CardTitle>
              <CardDescription>
                Docker labels attached to this container.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {Object.entries(container.labels).map(
                  ([key, value]) =>
                    value && (
                      <div
                        key={key}
                        className="flex flex-col space-y-1 p-2 border rounded-md bg-muted/30"
                      >
                        <span className="text-xs font-semibold text-muted-foreground">
                          {key}
                        </span>
                        <span className="text-sm font-mono break-all">
                          {value}
                        </span>
                      </div>
                    )
                )}
                {Object.keys(container.labels).length === 0 && (
                  <div className="text-muted-foreground text-sm">
                    No labels found.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Environment Tab */}
        <TabsContent value="environment" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Environment Variables</CardTitle>
              <CardDescription>
                Configuration injected into the container.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(container.environment).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-2 border-b last:border-0 hover:bg-muted/50 transition-colors"
                  >
                    <span className="font-mono text-sm font-semibold text-primary">
                      {key}
                    </span>
                    <code
                      className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground max-w-full sm:max-w-[60%] truncate"
                      title={value}
                    >
                      {value}
                    </code>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Network Tab */}
        <TabsContent value="network" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Open Ports</CardTitle>
              </CardHeader>
              <CardContent>
                {container.ports.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {container.ports.map((port) => (
                      <Badge
                        key={port}
                        variant="outline"
                        className="font-mono text-sm px-3 py-1"
                      >
                        {port}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No ports exposed.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Attached Networks</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-1">
                  {container.attachedNetworks.map((net) => (
                    <li key={net} className="text-sm font-mono">
                      {net}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="logs" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="max-h-96 overflow-y-auto text-xs font-mono bg-black text-green-400 p-4 rounded-md">
                {/* Placeholder for logs */}
                Container logs will be displayed here.
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
