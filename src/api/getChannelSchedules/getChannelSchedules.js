import { firestore } from "../../bot.js";
import { doc, getDoc } from "firebase/firestore";

const getChannelSchedules = async guildId => {
  const data = [];
  const currentTime = new Date();

  try {
    const channelRef = doc(firestore, "channels", guildId);
    const channelSnap = await getDoc(channelRef);

    if (!channelSnap.exists()) {
      return null;
    } else {
      const scheduleIdList = channelSnap.data().schedules;

      for (let i = 0; i < scheduleIdList.length; i++) {
        const scheduleRef = doc(firestore, "schedules", scheduleIdList[i]);
        const scheduleSnap = await getDoc(scheduleRef);

        const raidDateTime = new Date(scheduleSnap.data().raidDate);

        // 이미 지난 레이드 필터
        if (raidDateTime <= currentTime) {
          continue;
        }

        data.push({ scheduleId: scheduleIdList[i], data: scheduleSnap.data() });
      }

      return data;
    }
  } catch (err) {
    console.log("An error occurred while getting channel schedules:", err);
  }
};

export { getChannelSchedules };
