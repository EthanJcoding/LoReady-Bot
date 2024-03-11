import { firestore } from "../../bot.js";
import { addDoc, collection } from "firebase/firestore";

const createSchedule = async data => {
  try {
    const scheduleCollection = collection(firestore, "schedules");
    const newRef = await addDoc(scheduleCollection, data);

    return newRef.id;
  } catch (err) {
    console.log("An error occurred while creating schedule:", err);
  }
};

export { createSchedule };
