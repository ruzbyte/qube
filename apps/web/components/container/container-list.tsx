'use client';

import { ContainerCardProps } from '@/types/contaier';
import { DataTable } from './data-table';
import columnDefinitions from './columns';
import { Card, CardContent, CardTitle } from '../ui/card';

export function ContainerList({ containers }: { containers: ContainerCardProps[] }) {
  return (
    <Card>
      <CardTitle className="pl-4 pb-2 border-b">Containers</CardTitle>
      <CardContent>
        <DataTable data={containers} columns={columnDefinitions} />
      </CardContent>
    </Card>
  );
}
