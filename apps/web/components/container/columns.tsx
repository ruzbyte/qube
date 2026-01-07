import { ContainerCardProps } from "@/types/contaier";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  IconDots,
  IconPlayerPlayFilled,
  IconPlayerStop,
  IconPlayerStopFilled,
  IconSearch,
  IconTrashFilled,
} from "@tabler/icons-react";
import { Button } from "../ui/button";

const columnDefinitions: ColumnDef<ContainerCardProps>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    id: "server",
    header: "Game",
    cell: ({ row }) => {
      return (
        <span className="font-medium">
          {row.original.labels["qube.server"] || "N/A"}
        </span>
      );
    },
  },
  {
    accessorKey: "image",
    header: "Image",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => (
      <div>
        {getValue() === "running" ? (
          <span className="text-green-500">Running</span>
        ) : (
          <span className="text-red-500">Stopped</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ getValue }) => new Date(getValue() as string).toLocaleString(),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const container = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <IconDots />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <div className="flex items-center gap-2">
                <IconSearch /> Inspect
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              {container.status === "running" ? (
                <div className="flex items-center gap-2">
                  <IconPlayerStopFilled /> Stop
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <IconPlayerPlayFilled /> Start
                </div>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="flex items-center text-red-400 gap-2">
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
