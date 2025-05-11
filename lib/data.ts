// lib/data.ts
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export async function getAllAnggota() {
  const querySnapshot = await getDocs(collection(db, "anggota"));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}
