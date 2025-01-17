'use client';

import { useSearchContext } from '@/lib/hooks';

export default function SearchForm() {
  const { searchQuery, handleChangeSearchQuery } = useSearchContext();

  return (
    <form className="h-full w-full">
      <input
        className="h-full w-full bg-white/20 rounded-md px-5 outline-none transition focus:bg-white/50 hover:bg-white/30 placeholder:text-white/50"
        placeholder="Search pets"
        type="search"
        value={searchQuery}
        onChange={(e) => handleChangeSearchQuery(e.target.value)}
      />
    </form>
  );
}
