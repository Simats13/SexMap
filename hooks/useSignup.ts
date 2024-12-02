import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/config/firebase";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/config/firebase";

export const useSignup = () => {
  const signup = async (email: string, password: string, displayName: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Mettre à jour le profil
      await updateProfile(userCredential.user, { displayName });

      // Créer le document utilisateur avec les champs nécessaires
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email,
        displayName,
        friendsList: [],
        pendingFriends: [],
        createdAt: new Date(),
      });

      return userCredential.user;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  return { signup };
}; 