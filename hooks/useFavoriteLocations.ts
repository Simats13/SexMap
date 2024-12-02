import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "@/config/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

export type FavoriteLocation = {
  id: string;
  name: string;
  address: string;
};

export function useFavoriteLocations(userId: string | undefined) {
  return useQuery({
    queryKey: ["favoriteLocations", userId],
    queryFn: async (): Promise<FavoriteLocation[]> => {
      if (!userId) return [];
      const q = query(
        collection(db, "favoriteLocations"),
        where("userId", "==", userId)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<FavoriteLocation, "id">),
      }));
    },
    enabled: !!userId,
  });
}

export function useAddFavoriteLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, name }: { userId: string; name: string }) => {
      await addDoc(collection(db, "favoriteLocations"), {
        userId,
        name,
        createdAt: new Date(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favoriteLocations"] });
    },
  });
}

export function useDeleteFavoriteLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (locationId: string) => {
      await deleteDoc(doc(db, "favoriteLocations", locationId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favoriteLocations"] });
    },
  });
}
