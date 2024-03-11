import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { firestore } from "../../bot.js";

const handleUpdateChannelSchedules = async (scheduleId, guildId) => {
  const channelRef = doc(firestore, "channels", guildId);

  await updateDoc(channelRef, { schedules: arrayUnion(scheduleId) });
};

export { handleUpdateChannelSchedules };
