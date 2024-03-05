import { collection, doc, getDocs } from "firebase/firestore";
import { firestore } from "../../bot.js";

const getCharacters = async userId => {
  const userRef = doc(firestore, "users", userId);
  const charactersCollectionRef = collection(userRef, "characters");

  try {
    // Get all documents from the "characters" subcollection
    const querySnapshot = await getDocs(charactersCollectionRef);

    // Initialize an array to store characters
    const characters = [];

    // Iterate over the documents and add character data to the array
    querySnapshot.forEach(doc => {
      characters.push(doc.data());
    });

    // Return the array of characters
    return characters;
  } catch (error) {
    console.error("Error accessing character subcollection:", error);
    return []; // Return an empty array in case of error
  }
};

export { getCharacters };
