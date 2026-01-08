import { IconCube } from '@tabler/icons-react';
import { ModeToggle } from '../core/theme-toggle';
import Link from 'next/link';
import { Button } from '../ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '../ui/navigation-menu';

export default function Navbar() {
  return (
    <nav className="w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-14 items-center relative">
        <div className="flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <IconCube className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">Qube</span>
          </Link>
        </div>

        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/browse">Browse</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/container">Containers</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              Login
            </Button>
            <ModeToggle />
          </nav>
        </div>
      </div>
    </nav>
  );
}
