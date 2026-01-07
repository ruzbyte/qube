import { DeployForm } from "@/components/deploy/deploy-form";
import Navbar from "@/components/navigation/navbar";
import { getModpack, getModpackBySlug } from "@/lib/curseforge";
import { IconCube, IconDeviceGamepad } from "@tabler/icons-react";
import Image from "next/image";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let modpack = null;
  const isVanilla = slug === "vanilla";
  const isBedrock = slug === "bedrock";
  const isModpack = !isVanilla && !isBedrock;

  if (isModpack) {
    try {
      modpack = await getModpackBySlug(slug);
    } catch (e) {
      // Handle error or invalid slug
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Deploy New Server
            </h1>
            <p className="text-muted-foreground">
              Configure your server settings below.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Info */}
            <div className="space-y-6">
              <div className="p-6 border rounded-xl bg-muted/10 flex flex-col items-center text-center space-y-4">
                {isModpack && modpack ? (
                  <>
                    <div className="relative w-32 h-32 rounded-xl overflow-hidden shadow-md">
                      <Image
                        src={modpack.logo?.thumbnailUrl || ""}
                        alt={modpack.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{modpack.name}</h2>
                      <p className="text-sm text-muted-foreground">
                        {modpack.authors[0]?.name}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-32 h-32 rounded-xl bg-primary/10 flex items-center justify-center">
                      {isBedrock ? (
                        <IconDeviceGamepad className="w-16 h-16 text-primary" />
                      ) : (
                        <IconCube className="w-16 h-16 text-primary" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">
                        {isBedrock ? "Bedrock Edition" : "Java Vanilla"}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Official Minecraft Server
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Right Column: Form */}
            <div className="lg:col-span-2">
              <DeployForm slug={slug} modpack={modpack || undefined} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
