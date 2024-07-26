import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import { getSchedule, getUserData } from "../../api/index.js";
import dayjs from "dayjs";

function getRaidImage(raidName) {
  if (raidName.includes("아브렐슈드")) {
    return "https://firebasestorage.googleapis.com/v0/b/loready.appspot.com/o/%E1%84%8B%E1%85%A1%E1%84%87%E1%85%B3%E1%84%85%E1%85%A6%E1%86%AF%E1%84%89%E1%85%B2%E1%84%83%E1%85%B3.webp?alt=media&token=89565bad-e98f-43bc-8b92-d47aacb5b682";
  }
  if (raidName.includes("쿠크세이튼")) {
    return "https://firebasestorage.googleapis.com/v0/b/loready.appspot.com/o/%E1%84%8F%E1%85%AE%E1%84%8F%E1%85%B3%E1%84%89%E1%85%A6%E1%84%8B%E1%85%B5%E1%84%90%E1%85%B3%E1%86%AB.webp?alt=media&token=182561cd-7348-42a0-92cb-1b5b43cf306c";
  }
  if (raidName.includes("발탄")) {
    return "https://firebasestorage.googleapis.com/v0/b/loready.appspot.com/o/%E1%84%87%E1%85%A1%E1%86%AF%E1%84%90%E1%85%A1%E1%86%AB.webp?alt=media&token=98e87964-ab4a-4919-a585-e207abce53ac";
  }
  if (raidName.includes("비아키스")) {
    return "https://firebasestorage.googleapis.com/v0/b/loready.appspot.com/o/%E1%84%87%E1%85%B5%E1%84%8B%E1%85%A1%E1%84%8F%E1%85%B5%E1%84%89%E1%85%B3.webp?alt=media&token=630fa548-03a0-4bd7-a5e3-98d83ad492d4";
  }
  if (raidName.includes("카멘")) {
    return "https://firebasestorage.googleapis.com/v0/b/loready.appspot.com/o/%E1%84%8F%E1%85%A1%E1%84%86%E1%85%A6%E1%86%AB.webp?alt=media&token=8969780d-5d8e-4988-93b3-b1c4d2cff1a7";
  }
  if (raidName.includes("일리아칸")) {
    return "https://firebasestorage.googleapis.com/v0/b/loready.appspot.com/o/%E1%84%8B%E1%85%B5%E1%86%AF%E1%84%85%E1%85%B5%E1%84%8B%E1%85%A1%E1%84%8F%E1%85%A1%E1%86%AB.webp?alt=media&token=66a1cea0-57b2-4217-a37c-5e9a90a95ab0";
  }
  if (raidName.includes("카양겔")) {
    return "https://firebasestorage.googleapis.com/v0/b/loready.appspot.com/o/%E1%84%85%E1%85%A1%E1%84%8B%E1%85%AE%E1%84%85%E1%85%B5%E1%84%8B%E1%85%A6%E1%86%AF.webp?alt=media&token=0b4ee0fc-ed3b-45eb-8b75-dfe3d814692b";
  }
  if (raidName.includes("상아탑")) {
    return "https://firebasestorage.googleapis.com/v0/b/loready.appspot.com/o/%E1%84%89%E1%85%A1%E1%86%BC%E1%84%8B%E1%85%A1%E1%84%90%E1%85%A1%E1%86%B8.webp?alt=media&token=91cba7ec-c2fa-4578-8a41-1b8d3817653e";
  }
  if (raidName.includes("에키드나")) {
    return "https://firebasestorage.googleapis.com/v0/b/loready.appspot.com/o/%E1%84%8B%E1%85%A6%E1%84%8F%E1%85%B5%E1%84%83%E1%85%B3%E1%84%82%E1%85%A1.webp?alt=media&token=2f581f70-54b8-4229-a3da-40142ae41511";
  }
}

const scheduleDetailListEmbed = async (scheduleId, guildId) => {
  try {
    const schedule = await getSchedule(scheduleId);
    const raidLeaderData = await getUserData(schedule.raidLeader.userId);
    const nop = `${schedule.participants.length}/${schedule.raidType[0]}`;
    const Title = `${schedule.raidType} ${schedule.raidName}`;
    const baseUrl = process.env.BASE_URL;
    if (!baseUrl) {
      throw new Error("BASE_URL environment variable is not set");
    }
    const URL = `${baseUrl}/${guildId}/schedule/${scheduleId}?join=true`;

    const raidImage = getRaidImage(schedule.raidName);

    if (!raidImage) {
      throw new Error("Invalid raid image URL");
    }

    const embedBuilder = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(Title)
      .setURL(URL)
      .setAuthor({
        name: `${raidLeaderData.globalName}님이 만드신 스케줄이에요!`,
        url: URL,
      })
      .setDescription(
        `${dayjs(schedule.raidDate).format("MM월DD일 HH:mm 출발")}`
      )
      .setThumbnail(raidImage)
      .addFields(
        { name: "공대장", value: schedule.raidLeader.character },
        { name: "\u200B", value: "\u200B" },
        { name: "공대 인원 정보", value: nop }
      )
      .setTimestamp();

    const button = new ButtonBuilder()
      .setLabel("레이드 참여하기")
      .setStyle(ButtonStyle.Link)
      .setURL(URL);

    const actionRow = new ActionRowBuilder().addComponents(button);

    return { embeds: [embedBuilder], components: [actionRow] };
  } catch (error) {
    console.error("Error creating schedule detail list embed:", error);
    return { embeds: [], components: [] };
  }
};

export { scheduleDetailListEmbed };
