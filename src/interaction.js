import {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";
import { getCharsData } from "./api/lostArk.js";
import { isDateTimeValid } from "./utils/isDateTimeValid.js";
import {
  handleSaveUser,
  isChannelCollectionExist,
  handleUpdateChannelMembers,
  createSchedule,
  handleUpdateChannelSchedules,
  handleUpdateMemberSchedule,
} from "./api/index.js";
import { customDateString } from "./utils/customDateString.js";
import { setTimeout as wait } from "node:timers/promises";
import { getUserData } from "./api/getUserData/getUserData.js";

async function handleCommandInteraction(interaction) {
  const { commandName, options } = interaction;
  const guild = interaction.member.guild;

  if (interaction.isCommand()) {
    try {
      await isChannelCollectionExist(guild);
    } catch (err) {
      console.log("An error occurred while initiating channel:", err);
    }

    if (commandName === "등록하기") {
      const chaName = options.getString("캐릭터명");
      const guildId = interaction.guildId;
      const username = interaction.user.username;
      const globalName = interaction.user.globalName;
      const userId = interaction.user.id;
      const characters = await getCharsData(chaName);

      const data = {
        characters,
        username,
        globalName,
        userId,
        updated: customDateString(),
        schedules: [],
      };

      try {
        await interaction.deferReply();
        await wait(4_000);
        await handleSaveUser(guildId, userId, data);
        await handleUpdateChannelMembers(guildId, userId);
        await interaction.editReply({
          content: `🎉 \n ${globalName}님의 ${chaName} 원정대를 로레디에 등록하셨어요!  🎉  `,
        });
      } catch (err) {
        await interaction.reply({ content: "에러발생🚨 다시 시도해주세요" });
        console.log("An error occurred while saving user data:", err);
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
            "🚨 \n 잘못된 날짜 또는 시간 형식이에요 🙅‍♂️ \n 날짜 형식: YYYY-MM-DD, 시간 형식: HH:MM",
        });
        return;
      }

      const USER_DATA = await getUserData(userId);

      if (!USER_DATA) {
        await interaction.reply({
          content:
            "🚨 \n 본인 캐릭터를 먼저 로레디에 등록해주세요 🙅‍♂️ \n 등록 명령어: `/등록하기`",
        });
        return;
      }

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
        content: `🧐 \n **${raidTitle}** 레이드에 참여해요!`,
        components: [row],
        ephemeral: true,
      });
    }
  } else if (interaction.isStringSelectMenu()) {
    if (interaction.customId === "selectCharacter") {
      const dataArr = interaction.values[0].split(", ");
      const guildId = interaction.guildId;
      const userId = interaction.user.id;
      const USER_DATA = await getUserData(userId);

      const data = {
        isActive: true,
        created: customDateString(),
        updated: customDateString(),
        channel: guildId,
        participants: [userId],
        raidName: dataArr[0],
        raidLeader: dataArr[3],
        raidDate: dataArr[1],
        createdBy: dataArr[2],
        raidType: "4인레이드",
        characters: {
          [userId]: USER_DATA.characters.find(
            character => character.CharacterName === dataArr[3]
          ),
        },
      };

      try {
        await interaction.deferReply();
        await wait(4_000);
        const scheduleId = await createSchedule(data);
        await handleUpdateChannelSchedules(scheduleId, guildId);
        await handleUpdateMemberSchedule(scheduleId, userId);
        await interaction.editReply({
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
