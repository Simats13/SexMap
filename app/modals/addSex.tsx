import { useState } from "react";
import { AddSexTemplate } from "@/components/templates/AddSexTemplate";
import { useAuth } from "@/hooks/useAuth";

export default function AddSexModal() {
  const { data: user } = useAuth();
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [selectedVisibility, setSelectedVisibility] = useState("public");
  const [rating, setRating] = useState(0);
  const [location, setLocation] = useState<{ latitude: number; longitude: number }>({
    latitude: 48.866667,
    longitude: 2.333333
  });

  return (
    <AddSexTemplate
      user={user ?? null}
      date={date}
      showDatePicker={showDatePicker}
      showVisibilityPicker={showPicker}
      selectedVisibility={selectedVisibility}
      onDateChange={setDate}
      onVisibilityChange={setSelectedVisibility}
      onToggleDatePicker={setShowDatePicker}
      onToggleVisibilityPicker={setShowPicker}
      rating={rating}
      onRatingChange={setRating}
      onLocationChange={setLocation}
    />
  );
}
