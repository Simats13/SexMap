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
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

export type FavoriteLocation = {
  locationsList: string[];
};

export function useFavoriteLocations(userId: string | undefined) {
  return useQuery({
    queryKey: ["favoriteLocations", userId],
    queryFn: async (): Promise<FavoriteLocation> => {
      if (!userId) return { locationsList: [] };
      const userDoc = doc(db, "users", userId);
      const snapshot = await getDoc(userDoc);
      if (!snapshot.exists()) {
        return { locationsList: [] };
      }
      return snapshot.data() as FavoriteLocation;
    },
    enabled: !!userId,
  });
}

export function useAddFavoriteLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, name }: { userId: string; name: string }) => {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        locationsList: arrayUnion(name)
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
    mutationFn: async ({ userId, name }: { userId: string; name: string }) => {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        locationsList: arrayRemove(name)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favoriteLocations"] });
    },
  });
}
