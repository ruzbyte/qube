export interface ContainerCardProps {
  name: string;
  image: string;
  environment: {
    [x: string]: string;
  };
  labels: {
    [x: string]: string;
  };
  ports: string[];
  containerName: string;
  id: string;
  domain: string | null;
  attachedNetworks: string[];
  createdAt: string;
  startedAt: string;
  status: string;
}
