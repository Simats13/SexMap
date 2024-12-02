import { useQuery } from "@tanstack/react-query";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase";

export const useUserStats = (userId?: string) => {
  return useQuery({
    queryKey: ["userStats", userId],
    queryFn: async () => {
      if (!userId) return { locations: 0, pins: 0, partners: 0 };

      const pinsQuery = query(
        collection(db, "maps"),
        where("userId", "==", userId)
      );
      const pinsSnap = await getDocs(pinsQuery);
      
      let uniqueLocations = new Set();
      let uniquePartners = new Set();
      
      pinsSnap.forEach((doc) => {
        const data = doc.data();
        if (data.locationName) uniqueLocations.add(data.locationName);
        if (data.partners) {
          data.partners.forEach((partner: string) => uniquePartners.add(partner));
        }
      });

      return {
        locations: uniqueLocations.size,
        pins: pinsSnap.size,
        partners: uniquePartners.size,
      };
    },
    enabled: !!userId,
  });
}; 