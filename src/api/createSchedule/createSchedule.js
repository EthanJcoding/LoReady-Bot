import { firestore } from "../../bot.js";
import { addDoc, collection } from "firebase/firestore";

const createSchedule = async data => {
  try {
    const scheduleRef = collection(firestore, "schedules");
    const newRef = await addDoc(scheduleRef, data);
    return newRef.id;
  } catch (err) {
    console.log("An error occurred while creating schedule:", err);
  }
};

export { createSchedule };
