import { doc, collection, getDocs, updateDoc } from "firebase/firestore";
import { firestore } from "../../bot.js";

const clearWeeklyHistory = async () => {
  const usersCollectionRef = collection(firestore, "users");

  try {
    const querySnapshot = await getDocs(usersCollectionRef);

    querySnapshot.forEach(async userDoc => {
      const charactersCollectionRef = collection(userDoc.ref, "characters");
      const charactersQuerySnapshot = await getDocs(charactersCollectionRef);

      charactersQuerySnapshot.forEach(async characterDoc => {
        if (characterDoc.exists()) {
          const characterRef = doc(firestore, characterDoc.ref.path);
          try {
            await updateDoc(characterRef, {
              weeklyParticipationHistory: [],
            });
            console.log(
              `Weekly history cleared for character ${characterDoc.id} of user ${userDoc.id}`
            );
          } catch (updateError) {
            console.error(
              `Error updating weekly history for character ${characterDoc.id} of user ${userDoc.id}:`,
              updateError
            );
          }
        }
      });
    });

    console.log("Weekly history cleared for all users.");
    return;
  } catch (error) {
    console.error("Error accessing users collection:", error);
    return;
  }
};

export { clearWeeklyHistory };
