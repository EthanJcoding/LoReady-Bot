import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { firestore } from "../../bot.js";

const joinSchedule = async (scheduleId, userId, character) => {
  const scheduleRef = doc(firestore, "schedules", scheduleId);
  const scheduleSnap = await getDoc(scheduleRef);

  const { parties } = scheduleSnap.data();

  const updatedCharacters = { ...parties };

  try {
    if (updatedCharacters.party1.length >= 4) {
      updatedCharacters.party2.push({ character, userId });
    } else updatedCharacters.party1.push({ character, userId });
    updateDoc(scheduleRef, {
      participants: arrayUnion(userId),
      parties: updatedCharacters,
      characters: arrayUnion({ character, userId }),
    });
  } catch (err) {
    console.log(err);
    return;
  }
};

export { joinSchedule };
