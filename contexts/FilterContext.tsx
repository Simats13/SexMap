import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { FilterType } from "@/hooks/usePins";
import { useAuth } from "@/hooks/useAuth";

interface FilterContextType {
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filter, setFilter] = useState<FilterType>("public");
  const { data: user } = useAuth();

  // Réinitialiser le filtre à "public" lors de la déconnexion si le filtre est "friends"
  useEffect(() => {
    if (!user && filter === "friends") {
      setFilter("public");
    }
  }, [user, filter]);

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