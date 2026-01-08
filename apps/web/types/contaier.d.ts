import type { minecraftApi } from '@/lib/api';

export interface ContainerCardProps {
  name: string;
  id: string;
  image: string;
  environment: {
    [x: string]: string;
  };
  labels: {
    'qube.server.game'?: string | undefined;
    'qube.server.name'?: string | undefined;
    'qube.server.domain'?: string | undefined;
  };
  ports: string[];
  containerName: string;
  domain: string | null;
  attachedNetworks: string[];
  createdAt: string;
  startedAt: string;
  status: string;
}

export type RequestType = Parameters<typeof minecraftApi.new.post>[0];
