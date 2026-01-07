import { ModpackCard } from "@/components/browse/modpack-card";
import { ModpackSearch } from "@/components/browse/search-bar";
import { SoftwareCard } from "@/components/browse/software-card";
import Navbar from "@/components/navigation/navbar";
import { getMods, searchModpacks } from "@/lib/curseforge";
import { IconCube, IconDeviceGamepad } from "@tabler/icons-react";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const modpacks = q ? await searchModpacks(q) : await getMods();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col space-y-2">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Browse Modpacks
                </h1>
                <p className="text-muted-foreground">
                  Entdecke und installiere deine Lieblings-Modpacks mit einem
                  Klick.
                </p>
              </div>
              <ModpackSearch />
            </div>
          </div>

          {!q && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              <SoftwareCard
                title="Vanilla Java"
                description="Der Standard Minecraft Java Edition Server."
                icon={IconCube}
                href="/deploy/vanilla"
              />
              <SoftwareCard
                title="Bedrock Edition"
                description="Offizieller Server für Minecraft Bedrock Edition."
                icon={IconDeviceGamepad}
                href="/deploy/bedrock"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {modpacks.map((modpack) => (
              <ModpackCard key={modpack.id} modpack={modpack} />
            ))}
            {modpacks.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                Keine Modpacks gefunden.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
