import { SlashCommandBuilder } from "@discordjs/builders";

const create8pRaid = new SlashCommandBuilder()
  .setName("8인레이드")
  .setDescription("8인레이드 스케줄을 만들어요 ☺️")
  .addStringOption(option =>
    option
      .setName("레이드")
      .setDescription("어떤 레이드에 가시나요? 🧐")
      .setRequired(true)
      .setChoices(
        { name: "발탄 [노말]", value: "발탄 [노말]" },
        { name: "발탄 [하드]", value: "발탄 [하드]" },

        { name: "비아키스 [노말]", value: "비아키스 [노말]" },
        { name: "비아키스 [하드]", value: "비아키스 [하드]" },

        { name: "아브렐슈드 [노말]", value: "아브렐슈드 [노말]" },
        { name: "아브렐슈드 [하드]", value: "아브렐슈드 [하드]" },
        { name: "아브렐슈드 [하12노3]", value: "아브렐슈드 [하12노3]" },

        { name: "일리아칸 [노말]", value: "일리아칸 [노말]" },
        { name: "일리아칸 [하드]", value: "일리아칸 [하드]" },

        { name: "카멘 [노말]", value: "카멘 [노말]" },
        { name: "카멘 [하드]", value: "카멘 [하드]" },
        { name: "카멘 [노12하3]", value: "카멘 [노12하3]" },
        { name: "카멘 [노13하4]", value: "카멘 [노13하4]" },

        { name: "에키드나 [노말]", value: "에키드나 [노말]" },
        { name: "에키드나 [하드]", value: "에키드나 [하드]" }
      )
  )
  .addStringOption(option =>
    option.setName("날짜").setDescription("Date (YYYY-MM-DD)").setRequired(true)
  )
  .addStringOption(option =>
    option.setName("시작시간").setDescription("Time (HH:MM)").setRequired(true)
  );

export { create8pRaid };
