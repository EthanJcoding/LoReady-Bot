import { getDoc, doc, firestore } from "firebase/firestore";

const isChannelSaved = async guildId => {
  const channelsRef = doc(firestore, "channels", guildId);
  const docSnap = await getDoc(channelsRef);

  if (docSnap.exists()) {
    return true;
  }
  return false;
};

export { isChannelSaved };
