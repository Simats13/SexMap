import { useState } from "react";
import { AddSexTemplate } from "@/components/templates/AddSexTemplate";
import { useAuth } from "@/hooks/useAuth";
import { useAddPin } from "@/hooks/useAddPin";

export default function AddSexModal() {
  const { addPin, loading, error } = useAddPin();
  const { data: user } = useAuth();

  const handleSubmit = async (data: any) => {
    await addPin(data);
  };

  return (
    <AddSexTemplate 
      user={user ?? null}
      onSubmit={handleSubmit} 
      loading={loading} 
      error={error} 
    />
  );
}
