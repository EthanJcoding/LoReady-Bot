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
  handleSaveCharacters,
  getCharacters,
  joinSchedule,
  handleWeeklyParticipation,
  getChannelSchedules,
  clearWeeklyHistory,
} from "./api/index.js";
import { scheduleDetailListEmbed } from "./embed/index.js";
import { customDateString } from "./utils/customDateString.js";
import { setTimeout as wait } from "node:timers/promises";
import dayjs from "dayjs";

async function handleCommandInteraction(interaction) {
  const { commandName, options } = interaction;
  const guild = interaction.member.guild;
  const globalName = interaction.user.globalName;
  const username = interaction.user.username;
  const guildId = interaction.guildId;
  const userId = interaction.user.id;

  if (interaction.isCommand()) {
    try {
      await isChannelCollectionExist(guild);
    } catch (err) {
      console.log("An error occurred while initiating channel:", err);
    }

    if (commandName === "test") {
      await clearWeeklyHistory(userId);
    }

    if (commandName === "등록하기") {
      const chaName = options.getString("캐릭터명");
      const characters = await getCharsData(chaName);

      const data = {
        username,
        globalName,
        userId,
        updated: customDateString(),
        schedules: [],
      };

      if (characters.length === 0) {
        await interaction.reply({ content: "캐릭터 정보를 찾을 수 없어요 😭" });
      } else {
        try {
          await interaction.deferReply();
          await wait(10_000);
          await handleSaveUser(guildId, userId, data);
          await handleSaveCharacters(userId, characters);
          await handleUpdateChannelMembers(guildId, userId);
          await interaction.editReply({
            content: `🎉 \n ${globalName}님의 ${chaName} 원정대를 로레디에 등록하셨어요!  🎉  `,
          });
        } catch (err) {
          await interaction.reply({ content: "에러발생🚨 다시 시도해주세요" });
          console.log("An error occurred while saving user data:", err);
        }
      }
    }
    if (commandName === "4인레이드") {
      const raidName = options.getString("레이드");
      const date = options.getString("날짜");
      const time = options.getString("시작시간");

      if (!isDateTimeValid(date, time)) {
        await interaction.reply({
          content:
            "🚨 \n 잘못된 날짜 또는 시간 형식이에요 🙅‍♂️ \n 날짜 형식: YYYY-MM-DD, 시간 형식: HH:MM",
        });
        return;
      }

      const USER_CHARACTERS = await getCharacters(userId);

      if (USER_CHARACTERS.length === 0) {
        await interaction.reply({
          content:
            "🚨 \n 본인 캐릭터를 먼저 로레디에 등록해주세요 🙅‍♂️ \n 등록 명령어: `/등록하기`",
        });
        return;
      }

      const selectMenu = new StringSelectMenuBuilder()
        .setCustomId("select4pCharacter")
        .setPlaceholder("레이드에 참여할 캐릭터를 선택해주세요")
        .addOptions(
          USER_CHARACTERS.map(character => {
            return new StringSelectMenuOptionBuilder()
              .setLabel(character.CharacterName)
              .setDescription(
                `${character.CharacterClassName} ${
                  character.ItemAvgLevel
                } 이번주 남은 골드 획득 횟수 ${
                  3 - character.weeklyParticipationHistory.length
                }`
              )
              .setValue(
                `${raidName}, ${date} ${time}:00, ${character.CharacterName}`
              );
          })
        );

      const row = new ActionRowBuilder().addComponents(selectMenu);

      await interaction.reply({
        content: `🧐 \n **${raidName}** 레이드에 참여해요!`,
        components: [row],
        ephemeral: true,
      });
    }
    if (commandName === "8인레이드") {
      const raidName = options.getString("레이드");
      const date = options.getString("날짜");
      const time = options.getString("시작시간");

      if (!isDateTimeValid(date, time)) {
        await interaction.reply({
          content:
            "🚨 \n 잘못된 날짜 또는 시간 형식이에요 🙅‍♂️ \n 날짜 형식: YYYY-MM-DD, 시간 형식: HH:MM",
        });
        return;
      }

      // 관문 별

      const USER_CHARACTERS = await getCharacters(userId);

      if (USER_CHARACTERS.length === 0) {
        await interaction.reply({
          content:
            "🚨 \n 본인 캐릭터를 먼저 로레디에 등록해주세요 🙅‍♂️ \n 등록 명령어: `/등록하기`",
        });
        return;
      }

      const selectMenu = new StringSelectMenuBuilder()
        .setCustomId("select4pCharacter")
        .setPlaceholder("레이드에 참여할 캐릭터를 선택해주세요")
        .addOptions(
          USER_CHARACTERS.map(character => {
            return new StringSelectMenuOptionBuilder()
              .setLabel(character.CharacterName)
              .setDescription(
                `${character.CharacterClassName} ${
                  character.ItemAvgLevel
                } 이번주 남은 골드 획득 횟수 ${
                  3 - character.weeklyParticipationHistory.length
                }`
              )
              .setValue(
                `${raidName}, ${date} ${time}:00, ${character.CharacterName}`
              );
          })
        );

      const row = new ActionRowBuilder().addComponents(selectMenu);

      await interaction.reply({
        content: `🧐 \n **${raidName}** 레이드에 참여해요!`,
        components: [row],
        ephemeral: true,
      });
    }
    if (commandName === "스케줄참여") {
      const USER_CHARACTERS = await getCharacters(userId);

      if (USER_CHARACTERS.length === 0) {
        await interaction.reply({
          content:
            "🚨 \n 본인 캐릭터를 먼저 로레디에 등록해주세요 🙅‍♂️ \n 등록 명령어: `/등록하기`",
        });
        return;
      }
      // 스케줄 리스트
      const scheduleList = await getChannelSchedules(guildId);

      // participants의 userId를 비교해서 존재하면 필터
      // const userFilteredList = scheduleList.filter(
      //   schedule => !schedule.data.participants.includes(userId)
      // );

      // if (userFilteredList.length === 0) {
      //   await interaction.reply({
      //     content:
      //       "🚨 \n 현재 참여 가능한 스케줄이 없어요 🙅‍♂️ \n 스케줄 명령어: `/4인레이드` or `/8인레이드`",
      //   });
      //   return;
      // }

      const selectMenu = new StringSelectMenuBuilder()
        .setCustomId("joinSchedule")
        .setPlaceholder("현재 참여 가능한 레이드 리스트에요!")
        .addOptions(
          scheduleList.map(schedule => {
            return new StringSelectMenuOptionBuilder()
              .setLabel(schedule.data.raidName)
              .setDescription(
                `${dayjs(schedule.data.raidDate).format(
                  "MM월DD일 HH:mm 출발 "
                )} 공대장: ${schedule.data.raidLeader.character}`
              )
              .setValue(schedule.scheduleId);
          })
        );

      const row = new ActionRowBuilder().addComponents(selectMenu);

      await interaction.reply({
        components: [row],
        ephemeral: true,
      });

      // 본인 캐릭 리스트

      // 주간 레이드 참여 배열에 스케줄 id 추가
    }
    if (commandName === "스케줄확인") {
      // 스케줄 리스트
      const scheduleList = await getChannelSchedules(guildId);

      const selectMenu = new StringSelectMenuBuilder()
        .setCustomId("checkingSchedule")
        .setPlaceholder("현재 유효한 레이드 리스트에요!")
        .addOptions(
          scheduleList.map(schedule => {
            return new StringSelectMenuOptionBuilder()
              .setLabel(schedule.data.raidName)
              .setDescription(
                `${dayjs(schedule.data.raidDate).format("MM월DD일 HH:mm 출발")}`
              )
              .setValue(schedule.scheduleId);
          })
        );

      const row = new ActionRowBuilder().addComponents(selectMenu);

      await interaction.reply({
        components: [row],
        ephemeral: true,
      });
    }
  } else if (interaction.isStringSelectMenu()) {
    if (interaction.customId === "select4pCharacter") {
      const dataArr = interaction.values[0].split(", ");
      const [raidName, raidDate, character] = dataArr;

      const data = {
        isActive: true,
        created: customDateString(),
        updated: customDateString(),
        channel: guildId,
        participants: [userId],
        raidName,
        raidLeader: { userId, character },
        raidDate,
        createdBy: userId,
        raidType: "4인레이드",
        characters: { party0: [{ userId, character }], party1: [], party2: [] },
      };

      try {
        await interaction.deferReply();
        await wait(10_000);
        const scheduleId = await createSchedule(data, userId);
        await handleWeeklyParticipation(userId, character, scheduleId);
        await handleUpdateChannelSchedules(scheduleId, guildId);
        await handleUpdateMemberSchedule(scheduleId, userId);
        await interaction.editReply({
          content: `@everyone \n ${raidName} 레이드 스케줄이 올라왔어요 \n 공대장: ${character} \n 날짜: ${raidDate} \n 스케줄 만든 사람: ${globalName}`,
        });
      } catch (err) {
        console.log(err);
        await interaction.reply({
          content: "에러발생! 다시 시도해주세요 🥲",
        });
      }
    }
    if (interaction.customId === "select8pCharacter") {
      const dataArr = interaction.values[0].split(", ");
      const [raidName, raidDate, character] = dataArr;

      const data = {
        isActive: true,
        created: customDateString(),
        updated: customDateString(),
        channel: guildId,
        participants: [userId],
        raidName,
        raidLeader: { userId, character },
        raidDate,
        createdBy: userId,
        raidType: "8인레이드",
        characters: [{ userId, character }],
      };

      try {
        await interaction.deferReply();
        await wait(10_000);
        const scheduleId = await createSchedule(data, userId);
        await handleWeeklyParticipation(userId, character, scheduleId);
        await handleUpdateChannelSchedules(scheduleId, guildId);
        await handleUpdateMemberSchedule(scheduleId, userId);
        await interaction.editReply({
          content: `@everyone \n ${raidName} 레이드 스케줄이 올라왔어요 \n 공대장: ${character} \n 날짜: ${raidDate} \n 스케줄 만든 사람: ${globalName}`,
        });
      } catch (err) {
        console.log(err);
        await interaction.reply({
          content: "에러발생! 다시 시도해주세요 🥲",
        });
      }
    }
    if (interaction.customId === "joinSchedule") {
      const USER_CHARACTERS = await getCharacters(userId);
      const [scheduleId] = interaction.values;

      const selectMenu = new StringSelectMenuBuilder()
        .setCustomId("selectCharacter")
        .setPlaceholder("레이드에 참여할 캐릭터를 선택해주세요")
        .addOptions(
          USER_CHARACTERS.map(character => {
            return new StringSelectMenuOptionBuilder()
              .setLabel(character.CharacterName)
              .setDescription(
                `${character.CharacterClassName} ${character.ItemAvgLevel}`
              )
              .setValue(`${character.CharacterName}, ${scheduleId}`);
          })
        );

      const row = new ActionRowBuilder().addComponents(selectMenu);

      await interaction.reply({
        components: [row],
        ephemeral: true,
      });
    }
    if (interaction.customId === "selectCharacter") {
      const [character, scheduleId] = interaction.values[0].split(", ");

      await joinSchedule(scheduleId, userId, character);
      await handleWeeklyParticipation(userId, character, scheduleId);
      await handleUpdateMemberSchedule(scheduleId, userId);
      await interaction.reply({
        content: "레이드에 참여했습니다!",
        embeds: await scheduleDetailListEmbed(scheduleId, guildId),
      });
    }

    if (interaction.customId === "checkingSchedule") {
      const [scheduleId] = interaction.values;

      await interaction.reply({
        embeds: await scheduleDetailListEmbed(scheduleId, guildId),
      });
    }
  }
}

export { handleCommandInteraction };
