import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { firestore } from "../../bot.js";

const joinSchedule = async (scheduleId, userId, character) => {
  const scheduleRef = doc(firestore, "schedules", scheduleId);

  try {
    updateDoc(scheduleRef, {
      participants: arrayUnion(userId),
      characters: arrayUnion({ character, userId }),
    });
  } catch (err) {
    console.log(err);
    return;
  }
};

export { joinSchedule };
