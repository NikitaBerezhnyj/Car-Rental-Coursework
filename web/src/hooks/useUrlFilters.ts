"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

const SEARCH_DELAY_MS = 300;

// Фільтри зберігаються в адресі сторінки: після зміни параметрів сервер знову виконує запит до БД
export function useUrlFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  function update(changes: Record<string, string>) {
    const params = new URLSearchParams(window.location.search);

    for (const [name, value] of Object.entries(changes)) {
      if (value === "") params.delete(name);
      else params.set(name, value);
    }

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  // Для текстового пошуку: чекаємо, поки користувач перестане вводити
  function updateDebounced(changes: Record<string, string>) {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => update(changes), SEARCH_DELAY_MS);
  }

  function reset(names: string[]) {
    clearTimeout(timer.current);
    update(Object.fromEntries(names.map(name => [name, ""])));
  }

  useEffect(() => () => clearTimeout(timer.current), []);

  return { update, updateDebounced, reset };
}
