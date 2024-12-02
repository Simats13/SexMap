import { useQuery } from "@tanstack/react-query";
import { collection, query, where, getDocs, getDoc, doc } from "firebase/firestore";
import { db } from "@/config/firebase";

export interface UserStats {
  pins: number;
  locations: number;
  partners: number;
  totalLikes: number;
  friends: number;
  nightPins: number;
  countries: number;
  quickPins: number;
}

export const useUserStats = (userId?: string) => {
  return useQuery<UserStats | null>({
    queryKey: ["userStats", userId],
    queryFn: async () => {
      if (!userId) return null;

      const pinsQuery = query(
        collection(db, "maps"),
        where("userId", "==", userId)
      );
      const pinsSnap = await getDocs(pinsQuery);
      
      let uniqueLocations = new Set();
      let uniquePartners = new Set();
      let uniqueCountries = new Set();
      let nightPinsCount = 0;
      let totalLikes = 0;
      let quickPinsCount = 0;
      let lastPinTime: Date | null = null;
      let pinsLast24h = 0;
      
      pinsSnap.forEach((doc) => {
        const data = doc.data();
        
        // Locations et pays
        if (data.locationName) {
          uniqueLocations.add(data.locationName);
          if (data.country) uniqueCountries.add(data.country);
        }

        // Partenaires
        if (data.partners) {
          data.partners.forEach((partner: string) => uniquePartners.add(partner));
        }

        // Likes
        if (data.like) {
          totalLikes += data.like.length;
        }

        // Pins de nuit (22h-5h)
        const pinDate = data.date.toDate();
        const hour = pinDate.getHours();
        if (hour >= 22 || hour <= 5) {
          nightPinsCount++;
        }

        // Pins rapides (3 en 24h)
        if (lastPinTime) {
          const timeDiff = pinDate.getTime() - lastPinTime.getTime();
          if (timeDiff <= 24 * 60 * 60 * 1000) { // 24 heures en millisecondes
            pinsLast24h++;
          } else {
            pinsLast24h = 1;
          }
          if (pinsLast24h >= 3) {
            quickPinsCount++;
          }
        }
        lastPinTime = pinDate;
      });

      // Récupérer le nombre d'amis
      const userDoc = await getDoc(doc(db, "users", userId));
      const friendsList = userDoc.data()?.friendsList || [];

      return {
        locations: uniqueLocations.size,
        pins: pinsSnap.size,
        partners: uniquePartners.size,
        totalLikes,
        friends: friendsList.length,
        nightPins: nightPinsCount,
        countries: uniqueCountries.size,
        quickPins: quickPinsCount,
      };
    },
    enabled: !!userId,
  });
}; 