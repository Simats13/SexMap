import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { useUserStats, UserStats } from "./useUserStats";
import * as Notifications from "expo-notifications";
import { useRef, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: number;
  type:
    | "pins"
    | "locations"
    | "partners"
    | "likes"
    | "friends"
    | "night_pins"
    | "countries"
    | "quick_pins";
  reward?: string;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_pin",
    title: "Première fois",
    description: "Créer votre premier pin",
    icon: "pin",
    condition: 1,
    type: "pins",
  },
  {
    id: "first_friend",
    title: "Premier LovePartner",
    description: "Ajouter votre premier ami",
    icon: "person-add",
    condition: 1,
    type: "friends",
  },
  {
    id: "explorer_bronze",
    title: "Explorateur Bronze",
    description: "Visiter 5 lieux différents",
    icon: "compass",
    condition: 5,
    type: "locations",
  },
  {
    id: "explorer_silver",
    title: "Explorateur Argent",
    description: "Visiter 15 lieux différents",
    icon: "compass",
    condition: 15,
    type: "locations",
  },
  {
    id: "explorer_gold",
    title: "Explorateur Or",
    description: "Visiter 30 lieux différents",
    icon: "compass",
    condition: 30,
    type: "locations",
  },
  {
    id: "social_starter",
    title: "Débutant Social",
    description: "Rencontrer 5 partenaires différents",
    icon: "people",
    condition: 5,
    type: "partners",
  },
  {
    id: "social_pro",
    title: "Pro du Social",
    description: "Rencontrer 20 partenaires différents",
    icon: "people",
    condition: 20,
    type: "partners",
  },
  {
    id: "social_legend",
    title: "Légende Sociale",
    description: "Rencontrer 50 partenaires différents",
    icon: "people",
    condition: 50,
    type: "partners",
  },
  {
    id: "pin_enthusiast",
    title: "Enthousiaste",
    description: "Créer 10 pins",
    icon: "pin",
    condition: 10,
    type: "pins",
  },
  {
    id: "pin_master",
    title: "Maître des Pins",
    description: "Créer 50 pins",
    icon: "trophy",
    condition: 50,
    type: "pins",
  },
  {
    id: "pin_legend",
    title: "Légende des Pins",
    description: "Créer 100 pins",
    icon: "star",
    condition: 100,
    type: "pins",
  },
  {
    id: "liked_bronze",
    title: "Apprécié",
    description: "Recevoir 10 likes sur vos pins",
    icon: "heart",
    condition: 10,
    type: "likes",
  },
  {
    id: "liked_silver",
    title: "Populaire",
    description: "Recevoir 50 likes sur vos pins",
    icon: "heart",
    condition: 50,
    type: "likes",
  },
  {
    id: "liked_gold",
    title: "Star",
    description: "Recevoir 100 likes sur vos pins",
    icon: "heart",
    condition: 100,
    type: "likes",
  },
  {
    id: "night_owl",
    title: "Oiseau de Nuit",
    description: "Créer 10 pins entre 22h et 5h",
    icon: "moon",
    condition: 10,
    type: "night_pins",
  },
  {
    id: "world_traveler",
    title: "Globe-Trotter",
    description: "Créer des pins dans 5 pays différents",
    icon: "globe",
    condition: 5,
    type: "countries",
  },
  {
    id: "speed_demon",
    title: "Rapide comme l'éclair",
    description: "Créer 3 pins en moins de 24h",
    icon: "flash",
    condition: 3,
    type: "quick_pins",
  },
];

export const useAchievements = (userId?: string) => {
  const { data: stats } = useUserStats(userId);
  const prevUnlockedRef = useRef<string[]>([]);

  useEffect(() => {
    if (!stats || !userId) return;

    const checkNewAchievements = async () => {
      // Récupérer les succès déjà notifiés
      const notifiedKey = `notified_achievements_${userId}`;
      const notifiedAchievements = JSON.parse(
        (await AsyncStorage.getItem(notifiedKey)) || "[]"
      );

      const newAchievements = ACHIEVEMENTS.filter((achievement) => {
        const progress = getProgress(achievement.type, stats);
        const isNewlyUnlocked =
          progress >= achievement.condition &&
          !prevUnlockedRef.current.includes(achievement.id) &&
          !notifiedAchievements.includes(achievement.id);

        if (isNewlyUnlocked) {
          Notifications.scheduleNotificationAsync({
            content: {
              title: "🏆 Nouveau succès débloqué !",
              body: `${achievement.title} - ${achievement.description}`,
              sound: true,
              data: { type: "achievement" },
            },
            trigger: null,
          });
        }
        return isNewlyUnlocked;
      });

      // Sauvegarder les nouveaux succès notifiés
      if (newAchievements.length > 0) {
        await AsyncStorage.setItem(
          notifiedKey,
          JSON.stringify([
            ...notifiedAchievements,
            ...newAchievements.map((a) => a.id),
          ])
        );
      }

      prevUnlockedRef.current = ACHIEVEMENTS.filter(
        (a) => getProgress(a.type, stats) >= a.condition
      ).map((a) => a.id);
    };

    checkNewAchievements();
  }, [stats, userId]);

  return useQuery({
    queryKey: ["achievements", userId],
    queryFn: async () => {
      if (!userId) return { achievements: [], unlockedCount: 0 };

      const userDoc = await getDoc(doc(db, "users", userId));
      const unlockedAchievements = userDoc.data()?.achievements || [];

      const achievements = ACHIEVEMENTS.map((achievement) => {
        let progress = 0;
        switch (achievement.type) {
          case "pins":
            progress = stats?.pins || 0;
            break;
          case "locations":
            progress = stats?.locations || 0;
            break;
          case "partners":
            progress = stats?.partners || 0;
            break;
          case "likes":
            progress = stats?.totalLikes || 0;
            break;
          case "friends":
            progress = stats?.friends || 0;
            break;
          case "night_pins":
            progress = stats?.nightPins || 0;
            break;
          case "countries":
            progress = stats?.countries || 0;
            break;
          case "quick_pins":
            progress = stats?.quickPins || 0;
            break;
        }

        return {
          ...achievement,
          unlocked: progress >= achievement.condition,
          progress: Math.min((progress / achievement.condition) * 100, 100),
        };
      });

      return {
        achievements,
        unlockedCount: achievements.filter((a) => a.unlocked).length,
      };
    },
    enabled: !!userId && !!stats,
  });
};

const getProgress = (type: Achievement["type"], stats: UserStats) => {
  switch (type) {
    case "pins":
      return stats.pins;
    case "locations":
      return stats.locations;
    case "partners":
      return stats.partners;
    case "likes":
      return stats.totalLikes;
    case "friends":
      return stats.friends;
    case "night_pins":
      return stats.nightPins;
    case "countries":
      return stats.countries;
    case "quick_pins":
      return stats.quickPins;
    default:
      return 0;
  }
};
