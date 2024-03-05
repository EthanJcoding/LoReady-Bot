import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../bot.js";
import { handleInitBot } from "../handleInitBot/handleInitBot.js";

const isChannelCollectionExist = async guild => {
  const channelsRef = doc(firestore, "channels", guild.id);
  const channelsSnap = await getDoc(channelsRef);

  if (!channelsSnap.exists()) {
    await handleInitBot(guild);
    console.log("오프라인 상태에서 추가된 채널의 정보를 DB에 등록했습니다");
    return;
  }
};

export { isChannelCollectionExist };
