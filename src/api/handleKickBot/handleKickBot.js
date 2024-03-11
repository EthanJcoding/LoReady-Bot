import { deleteDoc, doc } from "firebase/firestore";
import { firestore } from "../../bot.js";

const handleKickBot = async guild => {
  const guildId = guild.id;

  await deleteDoc(doc(firestore, "channels", guildId));
};

export { handleKickBot };
