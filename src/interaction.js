import {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";
import { getCharsData } from "./api/lostArk.js";
import { isDateTimeValid } from "./utils/isDateTimeValid.js";
import {
  saveUserData,
  updateChannelRelUserData,
  getChannelId,
  isUserAlreadyRegistered,
  getUserData,
  createSchedule,
} from "./api/pocketBase.js";

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
      const CHANNEL_ID = await getChannelId(guildId);

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

    if (commandName === "4인레이드") {
      const raidTitle = options.getString("레이드");
      const date = options.getString("날짜");
      const time = options.getString("시작시간");
      const globalName = interaction.user.globalName;
      const userId = interaction.user.id;

      if (!isDateTimeValid(date, time)) {
        await interaction.reply({
          content:
            "잘못된 날짜 또는 시간 형식이에요 🙅‍♂️ 날짜 형식: YYYY-MM-DD, 시간 형식: HH:MM",
        });
        return;
      }
      const USER_DATA = await getUserData(userId);

      const selectMenu = new StringSelectMenuBuilder()
        .setCustomId("selectCharacter")
        .setPlaceholder("레이드에 참여할 캐릭터를 선택해주세요")
        .addOptions(
          USER_DATA.characters.map(character => {
            return new StringSelectMenuOptionBuilder()
              .setLabel(character.CharacterName)
              .setDescription(
                `${character.CharacterClassName} ${character.ItemAvgLevel}`
              )
              .setValue(
                `${raidTitle}, ${date} ${time}:00, ${globalName}, ${character.CharacterName}`
              );
          })
        );

      const row = new ActionRowBuilder().addComponents(selectMenu);

      await interaction.reply({
        content: "\n **현재 활성화된 내전이에요!**",
        components: [row],
        ephemeral: true,
      });
    }
  } else if (interaction.isStringSelectMenu()) {
    if (interaction.customId === "selectCharacter") {
      const dataArr = interaction.values[0].split(", ");
      const guildId = interaction.guildId;
      const CHANNEL_ID = await getChannelId(guildId);
      const userId = interaction.user.id;
      const USER_DATA = await getUserData(userId);

      const data = {
        channel: CHANNEL_ID,
        participants: [USER_DATA.id],
        raidName: dataArr[0],
        raidLeader: dataArr[3],
        raidDate: dataArr[1],
        createdBy: dataArr[2],
        raidType: "4인레이드",
        characters: {
          [dataArr[2]]: USER_DATA.characters.find(
            character => character.CharacterName === dataArr[3]
          ),
        },
      };

      try {
        await createSchedule(data);
        await interaction.reply({
          content: `@everyone \n ${dataArr[0]} 레이드 스케줄이 올라왔어요 \n 공대장: ${dataArr[3]} \n 날짜: ${dataArr[1]} \n 스케줄 만든 사람: ${dataArr[2]}`,
        });
      } catch (err) {
        console.log(err);
        await interaction.reply({
          content: "에러발생! 다시 시도해주세요 🥲",
        });
      }
    }
  }
}

export { handleCommandInteraction };
