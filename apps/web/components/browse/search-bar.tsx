'use client';

import { Input } from '@/components/ui/input';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export function ModpackSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (query) {
        params.set('q', query);
      } else {
        params.delete('q');
      }
      router.push(`${pathname}?${params.toString()}`);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query, router, pathname, searchParams]); // searchParams in dep array might be tricky if it changes ref on every push

  // To avoid infinite loops or unnecessary runs, we can depend on "query" only and use the current values inside.
  // But strictly, we should depend on router and pathname.
  // Actually, if we update the URL, the component re-renders. "query" state stays as is (unless we sync it).
  // Implementation detail: We don't want to sync state FROM url after initial load while typing.

  return (
    <div className="w-full max-w-md">
      <Input
        placeholder="Search for modpacks..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full"
      />
    </div>
  );
}
