import { useRouter, useNavigation } from "expo-router";
import { useState, useEffect } from "react";
import { FiltersTemplate } from "@/components/templates/FiltersTemplate";
import { useFilter } from "@/contexts/FilterContext";
import { useAuth } from "@/hooks/useAuth";
import { getDoc, doc } from "firebase/firestore";
import { db } from "@/config/firebase";

type FilterType = "public" | "friends" | "private";

export default function FiltersModal() {
  const router = useRouter();
  const navigation = useNavigation();
  const { filter, setFilter } = useFilter();
  const { data: user } = useAuth();
  const [hasFriends, setHasFriends] = useState(false);

  useEffect(() => {
    const checkFriends = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const friendsList = userDoc.data()?.friendsList || [];
        setHasFriends(friendsList.length > 0);
      }
    };
    checkFriends();
  }, [user]);

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
    if (navigation.canGoBack()) {
      router.back();
    } else {
      router.push("/(tabs)");
    }
  };

  const handleClose = () => {
    if (navigation.canGoBack()) {
      router.back();
    } else {
      router.push("/(tabs)");
    }
  };

  return (
    <FiltersTemplate
      selectedFilter={filter}
      onFilterChange={handleFilterChange}
      onClose={handleClose}
      hasFriends={hasFriends}
    />
  );
}
