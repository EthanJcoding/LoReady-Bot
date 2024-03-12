import { EmbedBuilder } from "discord.js";
import { getSchedule, getUserData } from "../../api/index.js";
import dayjs from "dayjs";

const scheduleDetailListEmbed = async (scheduleId, guildId) => {
  try {
    const schedule = await getSchedule(scheduleId);
    const raidLeaderData = await getUserData(schedule.raidLeader.userId);

    const nop = schedule.participants.length + "/" + schedule.raidType[0];
    const Title = schedule.raidType + " " + schedule.raidName;
    const URL = `https://loready.vercel.app/${guildId}/schedule/${scheduleId}`;

    const embedBuilder = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(Title)
      .setURL(URL)
      .setAuthor({
        name: raidLeaderData.globalName + "님이 만드신 스케줄이에요!",
        url: URL,
      })
      .setDescription(
        `${dayjs(schedule.raidDate).format("MM월DD일 HH:mm 출발")}`
      )
      .setThumbnail("https://i.imgur.com/AfFp7pu.png")
      .addFields(
        { name: "공대장", value: schedule.raidLeader.character },
        { name: "\u200B", value: "\u200B" },
        { name: "공대 인원 정보", value: nop }
      );

    embedBuilder.setTimestamp();

    return [embedBuilder];
  } catch (error) {
    console.error("Error creating schedule detail list embed:", error);
    return [];
  }
};

export { scheduleDetailListEmbed };
