import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { firestore } from "../../bot.js";

const handleUpdateMemberSchedule = async (scheduleId, userId) => {
  const userRef = doc(firestore, "users", userId);

  await updateDoc(userRef, { schedules: arrayUnion(scheduleId) });
};

export { handleUpdateMemberSchedule };
