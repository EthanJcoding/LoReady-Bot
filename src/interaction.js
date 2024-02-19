import { getCharsData } from "./utils/lostArk.js";
import {
  saveUserData,
  updateChannelRelUserData,
  getChannelData,
  isUserAlreadyRegistered,
} from "./utils/pocketBase.js";

async function handleCommandInteraction(interaction) {
  const { commandName, options } = interaction;

  if (interaction.isCommand()) {
    if (commandName === "test") {
      // try {
      // } catch (err) {
      // }
    }
    if (commandName === "등록하기") {
      const chaName = options.getString("캐릭터명");
      const guildId = interaction.guildId;
      const username = interaction.user.username;
      const globalName = interaction.user.globalName;
      const userId = interaction.user.id;
      const CHANNEL_ID = await getChannelData(guildId);

      // 이미 등록된 친구가 아래에 코드를 실행하지 않게 하는 함수 필요

      if (!(await isUserAlreadyRegistered(userId))) {
        try {
          const data = {
            channelId: guildId,
            username,
            globalName,
            userId,
            characters: JSON.stringify(await getCharsData(chaName)), // 로스트아크 API
            channels: [CHANNEL_ID],
          };

          const record = await saveUserData(data);
          const RECORD_ID = record.id;

          await updateChannelRelUserData(CHANNEL_ID, {
            "members+": [RECORD_ID],
          });
          await interaction.reply({
            content: `${globalName}님이 ${chaName} 원정대를 등록하셨어요! 🎉`,
          });

          console.log(
            `${globalName}님이 ${chaName} 원정대를 ${CHANNEL_ID} 채널DB에 저장했습니다.`
          );
        } catch (err) {
          console.log(err);
        }
      } else {
        await interaction.reply({
          content: "이미 등록된 유저입니다 🙅‍♂️",
        });
      }
    }
  }
}

export { handleCommandInteraction };
