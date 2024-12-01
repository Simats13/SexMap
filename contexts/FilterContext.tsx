import { createContext, useContext, useState, ReactNode } from "react";
import { FilterType } from "@/hooks/usePins";

interface FilterContextType {
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filter, setFilter] = useState<FilterType>("public");

  return (
    <FilterContext.Provider value={{ filter, setFilter }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilter() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error("useFilter must be used within a FilterProvider");
  }
  return context;
} 