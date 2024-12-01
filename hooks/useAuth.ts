import { useQuery } from "@tanstack/react-query";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/config/firebase";
import { useEffect, useState } from "react";

export function useAuth() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (initializing) setInitializing(false);
    });

    return unsubscribe;
  }, [initializing]);

  return {
    data: user,
    isLoading: initializing,
  };
} 