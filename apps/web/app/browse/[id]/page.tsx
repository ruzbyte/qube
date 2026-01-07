import Navbar from "@/components/navigation/navbar";
import { getModpack } from "@/lib/curseforge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  IconCalendar,
  IconDownload,
  IconExternalLink,
  IconThumbUp,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

export default async function ModpackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const modpack = await getModpack(parseInt(id));

  if (!modpack) {
    return <div>Modpack not found</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="relative w-32 h-32 md:w-48 md:h-48 shrink-0 rounded-xl overflow-hidden shadow-lg border bg-background">
              {modpack.logo?.thumbnailUrl ? (
                <Image
                  src={modpack.logo.thumbnailUrl}
                  alt={modpack.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  No Icon
                </div>
              )}
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <a
                  href={modpack.links.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:decoration-1 hover:underline text-3xl md:text-4xl font-bold"
                >
                  {modpack.name}
                </a>
                <p className="text-muted-foreground mt-2 line-clamp-2 md:line-clamp-none max-w-3xl">
                  {modpack.summary}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1 bg-muted px-2.5 py-1 rounded-md">
                  <IconDownload className="w-4 h-4" />
                  <span>
                    {(modpack.downloadCount / 1000000).toFixed(2)}M Downloads
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-muted px-2.5 py-1 rounded-md">
                  <IconThumbUp className="w-4 h-4" />
                  <span>{modpack.thumbsUpCount.toLocaleString()} Likes</span>
                </div>
                <div className="flex items-center gap-1 bg-muted px-2.5 py-1 rounded-md">
                  <IconCalendar className="w-4 h-4" />
                  <span>
                    Updated{" "}
                    {new Date(modpack.dateModified).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {modpack.categories.map((category) => (
                  <Badge key={category.id} variant="outline">
                    {category.name}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full md:w-auto shrink-0">
              <Link
                href={`/deploy/${modpack.slug}`}
                className="w-full md:w-auto"
              >
                <Button>Deploy</Button>
              </Link>
              <div className="flex gap-2">
                {modpack.links.wikiUrl && (
                  <Button variant="outline" asChild>
                    <Link href={modpack.links.wikiUrl} target="_blank">
                      Wiki
                    </Link>
                  </Button>
                )}
                {modpack.links.issuesUrl && (
                  <Button variant="outline" asChild>
                    <Link href={modpack.links.issuesUrl} target="_blank">
                      Issues
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="screenshots">
              Screenshots ({modpack.screenshots.length})
            </TabsTrigger>
            <TabsTrigger value="files">Latest Files</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <section>
                    <h3 className="text-lg font-semibold mb-2">About</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {modpack.summary}
                    </p>
                  </section>
                  <section>
                    <h3 className="text-lg font-semibold mb-2">Authors</h3>
                    <div className="flex flex-wrap gap-2">
                      {modpack.authors.map((author) => (
                        <div
                          key={author.id}
                          className="flex items-center gap-2 p-2 border rounded-md"
                        >
                          <span className="font-medium">{author.name}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="screenshots">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {modpack.screenshots.map((screen) => (
                <Card key={screen.id} className="overflow-hidden">
                  <div className="relative aspect-video">
                    <Image
                      src={screen.url}
                      alt={screen.title || modpack.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {screen.title && (
                    <div className="p-2 text-sm text-center text-muted-foreground">
                      {screen.title}
                    </div>
                  )}
                </Card>
              ))}
              {modpack.screenshots.length === 0 && (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  No screenshots available.
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="files">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Recent Files</h3>
                <div className="space-y-2">
                  {modpack.latestFiles.slice(0, 5).map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3 border rounded-md"
                    >
                      <div>
                        <div className="font-medium">{file.displayName}</div>
                        <div className="text-sm text-muted-foreground">
                          {file.fileName}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span>
                          {new Date(file.fileDate).toLocaleDateString()}
                        </span>
                        <Badge variant="secondary">
                          {file.releaseType === 1
                            ? "Release"
                            : file.releaseType === 2
                            ? "Beta"
                            : "Alpha"}
                        </Badge>
                        <Button size="sm" variant="ghost">
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
