import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../bot.js";

const getCharacters = async userId => {
  const userRef = doc(firestore, "users", userId);

  try {
    const userSnapshot = await getDoc(userRef);

    const { registeredBy } = userSnapshot.data();
    const characterRef = doc(firestore, "characters", registeredBy);
    const characterSnapshot = await getDoc(characterRef);
    const { siblingsData } = characterSnapshot.data();

    return siblingsData;
  } catch (error) {
    console.error("Error accessing character collection:", error);
  }
};

export { getCharacters };
