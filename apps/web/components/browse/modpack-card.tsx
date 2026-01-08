import { Modpack } from '@/types/modpack.d';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { IconDownload, IconThumbUp } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';

interface ModpackCardProps {
  modpack: Modpack;
}

export function ModpackCard({ modpack }: ModpackCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative w-full aspect-video sm:aspect-[2/1] md:aspect-video lg:aspect-[3/2] overflow-hidden bg-muted">
        {modpack.logo?.thumbnailUrl ? (
          <Image
            src={modpack.logo.thumbnailUrl}
            alt={modpack.name}
            fill
            className="object-cover transition-transform hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No Image
          </div>
        )}
      </div>
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start gap-2">
          <div>
            <h3 className="font-bold text-lg line-clamp-1">{modpack.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-1">
              by {modpack.authors.map((a) => a.name).join(', ')}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-1">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{modpack.summary}</p>
        <div className="flex flex-wrap gap-2">
          {modpack.categories.slice(0, 3).map((category) => (
            <Badge key={category.id} variant="secondary" className="text-xs">
              {category.name}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t bg-muted/20 flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <IconDownload className="h-4 w-4" />
            <span>{(modpack.downloadCount / 1000).toFixed(1)}k</span>
          </div>
          <div className="flex items-center gap-1">
            <IconThumbUp className="h-4 w-4" />
            <span>{modpack.thumbsUpCount}</span>
          </div>
        </div>
        <Button size="sm" asChild>
          <Link href={`/browse/${modpack.id}`}>Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
