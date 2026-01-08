export interface ContainerCardProps {
  name: string;
  id: string;
  image: string;
  environment: {
    [x: string]: string;
  };
  labels: {
    "qube.server.game"?: string | undefined;
    "qube.server.name"?: string | undefined;
    "qube.server.domain"?: string | undefined;
  };
  ports: string[];
  containerName: string;
  domain: string | null;
  attachedNetworks: string[];
  createdAt: string;
  startedAt: string;
  status: string;
}

interface RequestType {
  port?: string | undefined;
  difficulty?: "peaceful" | "easy" | "normal" | "hard" | undefined;
  whitelist?: string | undefined;
  version?: string | undefined;
  motd?: string | undefined;
  maxPlayers?: string | undefined;
  onlineMode?: "true" | "false" | undefined;
  seed?: string | undefined;
  cfSlug?: string | undefined;
  type: "VANILLA" | "AUTOCURSEFORGE";
  name: string;
  timezone: string;
  maxMemory: string;
}
