import { doc, setDoc } from "firebase/firestore";
import { customDateString } from "../../utils/customDateString.js";
import { firestore } from "../../bot.js";

const handleInitBot = async guild => {
  const { id, name } = guild;
  const created = customDateString();

  if (guild.icon !== null) {
    const channelIconURL = `https://cdn.discordapp.com/icons/${id}/${guild.icon}`;
    const channelsRef = doc(firestore, "channels", id);
    await setDoc(channelsRef, {
      id,
      channelName: name,
      channelIconURL,
      created,
      members: [],
      memberIds: [],
    });
  } else {
    const channelIconURL = `https://cdn.discordapp.com/icons/1209059689657016371/0f0a953c0d6c76e50b88304b1b00032e`;
    const channelsRef = doc(firestore, "channels", id);
    await setDoc(channelsRef, {
      id,
      channelName: name,
      channelIconURL,
      created,
      members: [],
      memberIds: [],
    });
  }
};

export { handleInitBot };
