import { ContainerCardProps } from '@/types/contaier';
import { ColumnDef } from '@tanstack/react-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  IconDots,
  IconPlayerPlayFilled,
  IconPlayerStop,
  IconPlayerStopFilled,
  IconSearch,
  IconTrashFilled,
} from '@tabler/icons-react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { deleteContainer, startContainer, stopContainer } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Badge } from '../ui/badge';

const columnDefinitions: ColumnDef<ContainerCardProps>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      return (
        <Link
          href={`/container/${row.original.id}`}
          className="font-medium text-blue-500 hover:underline"
        >
          {row.original.name}
        </Link>
      );
    },
  },
  {
    id: 'serverid',
    header: 'Server ID',
    cell: ({ row }) => {
      return <span className="font-mono">{row.original.containerName || 'N/A'}</span>;
    },
  },
  {
    id: 'Game',
    header: 'Game',
    cell: ({ row }) => {
      return (
        <span className="font-medium">{row.original.labels['qube.server.game'] || 'N/A'}</span>
      );
    },
  },
  {
    accessorKey: 'image',
    header: 'Image',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => (
      <div>
        {getValue() === 'running' ? (
          <Badge className="bg-green-500">Running</Badge>
        ) : (
          <Badge className="bg-red-500">Stopped</Badge>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ getValue }) => new Date(getValue() as string).toLocaleString(),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const container = row.original;
      const router = useRouter();
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <IconDots />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Link href={`/container/${container.id}`} className="flex items-center gap-2">
                <IconSearch /> Inspect
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              {container.status === 'running' ? (
                <div
                  onClick={async () => {
                    await stopContainer(container.id);
                    router.refresh();
                  }}
                  className="flex items-center gap-2"
                >
                  <IconPlayerStopFilled /> Stop
                </div>
              ) : (
                <div
                  onClick={async () => {
                    await startContainer(container.id);
                    router.refresh();
                  }}
                  className="flex items-center gap-2"
                >
                  <IconPlayerPlayFilled /> Start
                </div>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div
                className="flex items-center text-red-400 gap-2"
                onClick={() => deleteContainer(container.id).then(() => router.refresh())}
              >
                <IconTrashFilled /> Delete
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default columnDefinitions;
