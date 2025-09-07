import type { AppProps as NextJsAppProps } from 'next/app';
import type { ReactNode } from 'react';

export type PageProps<
  SearchParams extends Record<string, string> = never,
  PathParams extends Record<string, string> = never,
> = {
  children: ReactNode;
  /** partial because search params are not guaranteed */
  searchParams: Promise<Partial<SearchParams>>;
  params: Promise<[PathParams] extends [never] ? {} : PathParams>;
} & NextJsAppProps;
