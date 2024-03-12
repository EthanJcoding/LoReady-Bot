import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { firestore } from "../../bot.js";

const joinSchedule = async (scheduleId, userId, character) => {
  const scheduleRef = doc(firestore, "schedules", scheduleId);
  const scheduleSnap = await getDoc(scheduleRef);

  const { characters } = scheduleSnap.data();

  const updatedCharacters = { ...characters };

  try {
    updatedCharacters.party0.push({ character, userId });
    updateDoc(scheduleRef, {
      participants: arrayUnion(userId),
      characters: updatedCharacters,
    });
  } catch (err) {
    console.log(err);
    return;
  }
};

export { joinSchedule };
