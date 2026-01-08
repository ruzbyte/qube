'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Modpack } from '@/types/modpack';
import { createMinecraftServer, minecraftApi } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { IconCpu, IconServer } from '@tabler/icons-react';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';
import { useState } from 'react';
import { RequestType } from '@/types/contaier';
import { useRouter } from 'next/navigation';

const deploySchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(32),
  port: z.number().min(1024).max(65535),
  difficulty: z.enum(['peaceful', 'easy', 'normal', 'hard']).default('normal').optional(),
  type: z.enum(['VANILLA', 'BEDROCK', 'AUTO_CURSEFORGE']),
  memory: z.number().min(1).max(32), // In GB
  eula: z.boolean().refine((val) => val === true, {
    message: 'You must accept the EULA',
  }),
  whitelist: z.string().optional(),
  version: z.string().optional(),
  maxPlayers: z.number().min(1).max(100).optional(),
  startOnDeploy: z.boolean().optional(),
});

type DeployFormValues = z.infer<typeof deploySchema>;

interface DeployFormProps {
  slug: string;
  modpack?: Modpack;
}

export function DeployForm({ slug, modpack }: DeployFormProps) {
  const isModpack = slug !== 'vanilla' && slug !== 'bedrock';
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const defaultValues: Partial<DeployFormValues> = {
    name: modpack ? modpack.name : slug === 'vanilla' ? 'My Vanilla Server' : 'My Bedrock Server',
    port: slug === 'bedrock' ? 19132 : 25565,
    type: slug === 'bedrock' ? 'BEDROCK' : isModpack ? 'AUTO_CURSEFORGE' : 'VANILLA',
    memory: 4,
    eula: false,
    whitelist: '',
    version: 'latest',
    difficulty: 'normal',
    maxPlayers: 10,
    startOnDeploy: false,
  };

  const form = useForm<DeployFormValues>({
    resolver: zodResolver(deploySchema),
    defaultValues,
  });

  async function onSubmit(data: DeployFormValues) {
    setLoading(true);

    const requestBody: RequestType = {
      name: data.name,
      type: data.type,
      timezone: 'Europe/Berlin',
      maxPlayers: data.maxPlayers?.toString(),
      maxMemory: data.memory.toString() + 'G',
      port: data.port?.toString(),
      difficulty: data.difficulty,
      whitelist: data.whitelist,
      version: data.version,
      cfSlug: isModpack && modpack ? modpack.slug : undefined,
      onlineMode: `${true}`,
    };

    const response = await createMinecraftServer(requestBody);

    if (response.error) {
      toast.error('Error deploying server: ' + response.error);
      return;
    }

    if (response.data) {
      toast.success('Server deployed successfully!');
      form.reset();
      router.push(`/container/${response.data.id}`);
    }

    setLoading(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuration</CardTitle>
        <CardDescription>Customize your server settings</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Server Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My Awesome Server" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="port"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Port</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel>Type</FormLabel>
                <div className="flex items-center space-x-2 p-2 border rounded-md bg-muted/50">
                  <IconServer className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{defaultValues.type}</span>
                </div>
              </div>
            </div>

            <FormField
              control={form.control}
              name="memory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex justify-between">
                    <span>Memory (RAM)</span>
                    <span className="text-muted-foreground">{field.value} GB</span>
                  </FormLabel>
                  <FormControl>
                    <Slider
                      min={1}
                      max={16}
                      step={1}
                      defaultValue={[field.value]}
                      onValueChange={(vals) => field.onChange(vals[0])}
                    />
                  </FormControl>
                  <FormDescription>Maximum memory allocated to the java process.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-row justify-between">
              {!isModpack && (
                <FormField
                  control={form.control}
                  name="version"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Version</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select version" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="latest">Latest</SelectItem>
                          <SelectItem value="1.20.4">1.20.4</SelectItem>
                          <SelectItem value="1.20.1">1.20.1</SelectItem>
                          <SelectItem value="1.19.4">1.19.4</SelectItem>
                          <SelectItem value="1.18.2">1.18.2</SelectItem>
                          <SelectItem value="1.16.5">1.16.5</SelectItem>
                          <SelectItem value="1.12.2">1.12.2</SelectItem>
                          <SelectItem value="1.8.9">1.8.9</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>The minecraft version to use.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="peaceful">Peaceful</SelectItem>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>The game difficulty for the server.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxPlayers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Players</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Maximum number of players allowed on the server.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="whitelist"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Whitelist</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Player1, Player2, ..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Comma-separated list of usernames to whitelist.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Card>
              <CardContent className="space-y-2">
                <FormField
                  control={form.control}
                  name="eula"
                  render={({ field }) => (
                    <FormItem className="flex flex-row justify-between items-center">
                      <div className="space-y-0.5 flex-1 mr-4">
                        <FormLabel className="text-base">Accept EULA</FormLabel>
                        <FormDescription>
                          You agree to the Minecraft End User License Agreement.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="startOnDeploy"
                  render={({ field }) => (
                    <FormItem className="flex flex-row justify-between">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Start on Deploy</FormLabel>
                        <FormDescription>
                          Automatically start the server after deployment.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              <IconCpu className="w-4 h-4 mr-2" />
              {loading ? 'Deploying...' : ''}
              Deploy Server
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
