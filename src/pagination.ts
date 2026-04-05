import type { PagedList } from "./types/base.js";

export type Page<T> = PagedList<T>;

/** Auto-paginate and collect all items into one array. */
export async function collectAll<T>(
  fetchPage: (after?: string) => Promise<Page<T>>,
): Promise<T[]> {
  const all: T[] = [];
  let cursor: string | undefined;

  do {
    const page = await fetchPage(cursor);
    all.push(...page.items);
    const next = page.continue ?? page.metadata?.continue;
    cursor =
      next === undefined || next === "" ? undefined : next;
  } while (cursor);

  return all;
}
