import { firestore } from "../../bot.js";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";

const handleWeeklyParticipation = async (userId, character, scheduleId) => {
  const userRef = doc(firestore, "users", userId);

  const characterRef = doc(userRef, "characters", character);

  await updateDoc(characterRef, {
    weeklyParticipationHistory: arrayUnion(scheduleId),
  });
};

export { handleWeeklyParticipation };
