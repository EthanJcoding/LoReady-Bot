import { collection, doc, getDocs } from "firebase/firestore";
import { firestore } from "../../bot.js";

const getCharacters = async userId => {
  const userRef = doc(firestore, "users", userId);
  const charactersCollectionRef = collection(userRef, "characters");

  try {
    const querySnapshot = await getDocs(charactersCollectionRef);

    const characters = [];

    querySnapshot.forEach(doc => {
      characters.push(doc.data());
    });

    return characters;
  } catch (error) {
    console.error("Error accessing character subcollection:", error);
    return [];
  }
};

export { getCharacters };
