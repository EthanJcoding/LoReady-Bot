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
    return "https://cdn.discordapp.com/attachments/1251062202102714409/1251063201190383666/1ca3910779e47e71.webp?ex=666d36e6&is=666be566&hm=d772643701d2e047339d1184dc731e3efaf2251c0031988478741354cbd2e2f5&";
  }
  if (raidName.includes("쿠크세이튼")) {
    return "https://cdn.discordapp.com/attachments/1251062202102714409/1251063201617940531/d06fa32b7dbc099d.webp?ex=666d36e6&is=666be566&hm=a959a06eb2075075eba99f372d055c18f036d4d98985a84f42b6d93280967e37&";
  }
  if (raidName.includes("발탄")) {
    return "https://cdn.discordapp.com/attachments/1251062202102714409/1251063201995423785/f2396d29f0326372.webp?ex=666d36e6&is=666be566&hm=c4abb17949081fc4ab8ff46e8d42279c757bb23fed00251f6313d9b348df37ed&";
  }
  if (raidName.includes("비아키스")) {
    return "https://cdn.discordapp.com/attachments/1251062202102714409/1251063202368983073/074ec4517d1dd500.webp?ex=666d36e7&is=666be567&hm=3cb3924df8fa7f098df17dab34f49fd40935682edeac6f97cb2a0aebfc4145db&";
  }
  if (raidName.includes("카멘")) {
    return "https://cdn.discordapp.com/attachments/1251062202102714409/1251063202683420702/53170efa06280f89.webp?ex=666d36e7&is=666be567&hm=85b5d2491a8d835d2e1d2173d789a6de19cc254ac76d42068d6944e592b9e7f1&";
  }
  if (raidName.includes("일리아칸")) {
    return "https://cdn.discordapp.com/attachments/1251062202102714409/1251063203048329297/59ac7c8c85b99e12.webp?ex=666d36e7&is=666be567&hm=8e4f19d2e3b6b16e34b95a7ce805d10fef53f752ab5724738853625804ec33e1&";
  }
  if (raidName.includes("카양겔")) {
    return "https://cdn.discordapp.com/attachments/1251062202102714409/1251097370406686791/0566490b5a87f574.webp?ex=666d56b9&is=666c0539&hm=2910e9f6401efd5af7c2068988243f21c6b4dd0825914eda0f4d61035af5f7e3&";
  }
  if (raidName.includes("상아탑")) {
    return "https://cdn.discordapp.com/attachments/1251062202102714409/1251098258583846944/4b0eed83a9c5511e.webp?ex=666d578d&is=666c060d&hm=bfdcd1a485eeb2bdd37219833444639090cdb7271cddbee45360866d7dd1e6f4&";
  }
}

const scheduleDetailListEmbed = async (scheduleId, guildId) => {
  try {
    const schedule = await getSchedule(scheduleId);
    const raidLeaderData = await getUserData(schedule.raidLeader.userId);
    const nop = schedule.participants.length + "/" + schedule.raidType[0];
    const Title = schedule.raidType + " " + schedule.raidName;
    const URL = `${process.env.BASE_URL}/${guildId}/schedule/${scheduleId}?join=true`;

    const raidImage = getRaidImage(schedule.raidName);

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
      .setThumbnail(raidImage)
      .addFields(
        { name: "공대장", value: schedule.raidLeader.character },
        { name: "\u200B", value: "\u200B" },
        { name: "공대 인원 정보", value: nop }
      );

    embedBuilder.setTimestamp();

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
