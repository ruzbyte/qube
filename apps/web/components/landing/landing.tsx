import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  IconCpu,
  IconCube,
  IconDeviceGamepad,
  IconServer,
} from "@tabler/icons-react";

export default function Landing() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-linear-to-b from-background to-muted/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Qube Server Management
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Die modernste Plattform für das automatische Management und
                  Deployment von Minecraft Server Containern.
                </p>
              </div>
              <div className="space-x-4">
                <Button asChild size="lg">
                  <Link href="/dashboard">Jetzt Starten</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link
                    href="https://github.com/craftainer/qube"
                    target="_blank"
                  >
                    GitHub
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32" id="features">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <Card>
                <CardHeader>
                  <IconCube className="h-10 w-10 mb-2 text-primary" />
                  <CardTitle>Container Native</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Jeder Server läuft isoliert in seinem eigenen Container.
                    Maximale Sicherheit und Ressourcenkontrolle für deine
                    Minecraft Welten.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <IconCpu className="h-10 w-10 mb-2 text-primary" />
                  <CardTitle>Automatisches Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Erstelle, starte und stoppe Server mit einem Klick.
                    Automatische Backups und Updates sorgen für einen
                    reibungslosen Betrieb.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <IconServer className="h-10 w-10 mb-2 text-primary" />
                  <CardTitle>Skalierbare Infrastruktur</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Egal ob ein kleiner Survival-Server oder ein großes
                    Netzwerk. Qube wächst mit deinen Anforderungen.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-10 sm:px-10 md:gap-16 md:grid-cols-2">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm">
                  Performance
                </div>
                <h2 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
                  Gebaut für Geschwindigkeit
                </h2>
                <Button className="w-full sm:w-auto" asChild>
                  <Link href="/dashboard">Dashboard öffnen</Link>
                </Button>
              </div>
              <div className="flex flex-col items-start space-y-4">
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Unsere optimierte Architektur sorgt für minimale Latenz und
                  maximale TPS. Verwalte deine Plugins, Mods und Konfigurationen
                  direkt über das Webinterface.
                </p>
                <div className="grid gap-4 min-[400px]:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <IconDeviceGamepad className="h-5 w-5" />
                    <span>Bedrock & Java Support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconServer className="h-5 w-5" />
                    <span>Modpack Installer</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6">
        <div className="container mx-auto flex flex-col items-center gap-2 px-4 md:px-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; 2026 Qube Platform. Alle Rechte vorbehalten.
          </p>
          <nav className="flex gap-4 sm:ml-auto sm:gap-6">
            <Link
              className="text-xs hover:underline underline-offset-4"
              href="#"
            >
              Impressum
            </Link>
            <Link
              className="text-xs hover:underline underline-offset-4"
              href="#"
            >
              Datenschutz
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
