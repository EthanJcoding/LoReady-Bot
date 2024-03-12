import { firestore } from "../../bot.js";
import { doc, getDoc } from "firebase/firestore";

const getSchedule = async scheduleId => {
  try {
    const scheduleRef = doc(firestore, "schedules", scheduleId);
    const scheduleSnap = await getDoc(scheduleRef);

    if (!scheduleSnap.exists()) {
      return null;
    } else {
      return scheduleSnap.data();
    }
  } catch (err) {
    console.log("An error occurred while getting user data:", err);
    return;
  }
};

export { getSchedule };
