import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { useAuth } from "@/hooks/useAuth";
import { AddSexTemplate } from "@/components/templates/AddSexTemplate";
import { useRouter } from "expo-router";
import { AddPinParams, useAddPin } from "@/hooks/useAddPin";

interface UserData {
  partners?: string[];
  friendsList?: string[];
  name?: string;
  locationsList?: string[];
}

export default function AddSexModal() {
  const { data: user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [partners, setPartners] = useState<
    Array<{ label: string; value: string }>
  >([]);
  const [selectedPartners, setSelectedPartners] = useState<
    Array<{ label: string; value: string }>
  >([]);
  const [locations, setLocations] = useState<
    Array<{ label: string; value: string }>
  >([]);
  const [selectedLocations, setSelectedLocations] = useState<
    Array<{ label: string; value: string }>
  >([]);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [selectedVisibility, setSelectedVisibility] = useState<
    "public" | "private" | "friends"
  >("public");
  const [rating, setRating] = useState(0);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  }>({
    latitude: 48.866667,
    longitude: 2.333333,
  });
  const [description, setDescription] = useState("");
  const [anonym, setAnonym] = useState(false);
  const [partnersInput, setPartnersInput] = useState("");
  const [locationsInput, setLocationsInput] = useState("");
  const [partnersFiltered, setPartnersFiltered] = useState<string[]>([]);
  const [locationsFiltered, setLocationsFiltered] = useState<string[]>([]);

  const router = useRouter();
  const addPin = useAddPin();

  useEffect(() => {
    const fetchPartnersAndFriends = async () => {
      if (!user) return;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.data() as UserData;
      const partnersList = userData?.partners || [];
      const friendsList = userData?.friendsList || [];

      const friendsData = await Promise.all(
        friendsList.map(async (friendId: string) => {
          const friendDoc = await getDoc(doc(db, "users", friendId));
          return friendDoc.data()?.display_name;
        })
      );

      const allOptions = [...partnersList, ...friendsData.filter(Boolean)];
      setPartners(allOptions.map((name) => ({ label: name, value: name })));
    };

    fetchPartnersAndFriends();
  }, [user]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.data() as UserData;
      const locationsList = userData?.locationsList || [];
      setLocations(locationsList.map((loc) => ({ label: loc, value: loc })));
    };

    fetchUserData();
  }, [user]);

  useEffect(() => {
    if (partnersInput.length > 0) {
      const filtered = partners
        .map(p => p.label)
        .filter(partner => 
          partner.toLowerCase().includes(partnersInput.toLowerCase())
        );
      setPartnersFiltered(filtered);
    } else {
      setPartnersFiltered([]);
    }
  }, [partnersInput, partners]);

  useEffect(() => {
    if (locationsInput.length > 0) {
      const filtered = locations
        .map(l => l.label)
        .filter(location => 
          location.toLowerCase().includes(locationsInput.toLowerCase())
        );
      setLocationsFiltered(filtered);
    } else {
      setLocationsFiltered([]);
    }
  }, [locationsInput, locations]);

  const handleUpdatePartners = async (newTags: string[]) => {
    if (!user) return;

    const newItems = newTags.map((tag) => ({ label: tag, value: tag }));
    setSelectedPartners(newItems);
    setPartnersInput('');

    const userDoc = await getDoc(doc(db, "users", user.uid));
    const userData = userDoc.data() as UserData;
    const currentPartners = userData?.partners || [];
    const friendsList = userData?.friendsList || [];

    const friendsNames = await Promise.all(
      friendsList.map(async (friendId: string) => {
        const friendDoc = await getDoc(doc(db, "users", friendId));
        return friendDoc.data()?.display_name;
      })
    );

    const newPartners = newTags.filter(
      (tag) => !currentPartners.includes(tag) && !friendsNames.includes(tag)
    );

    if (newPartners.length > 0) {
      await updateDoc(doc(db, "users", user.uid), {
        partners: [...currentPartners, ...newPartners],
      });
      setPartners((prev) => [
        ...prev,
        ...newPartners.map((value) => ({ label: value, value })),
      ]);
    }
  };

  const handleUpdateLocations = async (newTags: string[]) => {
    if (!user) return;

    const newItems = newTags.map((tag) => ({ label: tag, value: tag }));
    setSelectedLocations(newItems);
    setLocationsInput('');

    const userDoc = await getDoc(doc(db, "users", user.uid));
    const userData = userDoc.data() as UserData;
    const currentLocations = userData?.locationsList || [];

    const newLocations = newTags.filter(
      (tag) => !currentLocations.includes(tag)
    );

    if (newLocations.length > 0) {
      await updateDoc(doc(db, "users", user.uid), {
        locationsList: [...currentLocations, ...newLocations],
      });
      setLocations((prev) => [
        ...prev,
        ...newLocations.map((value) => ({ label: value, value })),
      ]);
    }
  };

  const handleSubmit = async (data: AddPinParams) => {
    setLoading(true);
    try {
      await addPin.addPin(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    router.back();
  };

  const handlePressAuth = () => {
    router.push("/modals/auth");
  };

  return (
    <AddSexTemplate
      user={user ?? null}
      loading={loading}
      error={error}
      partners={partners}
      selectedPartners={selectedPartners}
      locations={locations}
      selectedLocations={selectedLocations}
      onUpdatePartners={handleUpdatePartners}
      onUpdateLocations={handleUpdateLocations}
      date={date}
      setDate={setDate}
      showDatePicker={showDatePicker}
      setShowDatePicker={setShowDatePicker}
      showPicker={showPicker}
      setShowPicker={setShowPicker}
      selectedVisibility={selectedVisibility}
      setSelectedVisibility={setSelectedVisibility}
      rating={rating}
      setRating={setRating}
      location={location}
      setLocation={setLocation}
      description={description}
      setDescription={setDescription}
      anonym={anonym}
      setAnonym={setAnonym}
      onSubmit={handleSubmit}
      onClose={handleClose}
      onPressAuth={handlePressAuth}
      partnersInput={partnersInput}
      setPartnersInput={setPartnersInput}
      locationsInput={locationsInput}
      setLocationsInput={setLocationsInput}
      partnersFiltered={partnersFiltered}
      locationsFiltered={locationsFiltered}
    />
  );
}
