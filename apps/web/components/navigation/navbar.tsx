import { IconCube } from "@tabler/icons-react";
import { ModeToggle } from "../core/theme-toggle";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between p-4 bg-secondary">
      <div className="flex items-center space-x-2 gap-4">
        <IconCube className="mr-auto h-6 w-6" />
        <h1> Qube </h1>
      </div>
      <div>
        <Link href="/dashboard" className="mr-4">
          Dashboard
        </Link>
        <Link href="/servers" className="mr-4">
          Servers
        </Link>
        <Link href="/settings" className="mr-4">
          Settings
        </Link>
      </div>
      <ModeToggle />
    </nav>
  );
}
