import { useState } from "react";
import { AddSexTemplate } from "@/components/templates/AddSexTemplate";

export default function AddSexModal() {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [selectedVisibility, setSelectedVisibility] = useState("public");

  return (
    <AddSexTemplate
      date={date}
      showDatePicker={showDatePicker}
      showVisibilityPicker={showPicker}
      selectedVisibility={selectedVisibility}
      onDateChange={setDate}
      onVisibilityChange={setSelectedVisibility}
      onToggleDatePicker={setShowDatePicker}
      onToggleVisibilityPicker={setShowPicker}
    />
  );
}
