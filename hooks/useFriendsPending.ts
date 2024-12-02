import { useQuery, useQueryClient } from "@tanstack/react-query";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/config/firebase";
import { Friend } from "@/components/templates/FriendsTemplate";
import { useEffect } from "react";

export const useFriendsPending = (userId?: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = onSnapshot(doc(db, "users", userId), async (snapshot) => {
      if (!snapshot.exists()) return;
      
      const friendsPending = snapshot.data()?.friendsPending || [];
      if (friendsPending.length === 0) {
        queryClient.setQueryData(["friendsPending", userId], []);
        return;
      }

      const pendings = await Promise.all(
        friendsPending.map(async (id: string) => {
          const friendDoc = await getDoc(doc(db, "users", id));
          const data = friendDoc.data();
          if (!data) return null;
          return {
            id,
            displayName: data.display_name || "Utilisateur inconnu",
          };
        })
      );

      queryClient.setQueryData(
        ["friendsPending", userId], 
        pendings.filter((r): r is Friend => r !== null)
      );
    });

    return () => unsubscribe();
  }, [userId, queryClient]);

  return useQuery({
    queryKey: ["friendsPending", userId],
    enabled: !!userId,
    queryFn: async (): Promise<Friend[]> => {
      if (!userId) return [];
      const userDoc = await getDoc(doc(db, "users", userId));
      const friendsPending = userDoc.data()?.friendsPending || [];
      if (friendsPending.length === 0) return [];

      const pendings = await Promise.all(
        friendsPending.map(async (id: string) => {
          const friendDoc = await getDoc(doc(db, "users", id));
          const data = friendDoc.data();
          if (!data) return null;
          return {
            id,
            displayName: data.display_name || "Utilisateur inconnu",
          };
        })
      );
      return pendings.filter((r): r is Friend => r !== null);
    },
  });
};
