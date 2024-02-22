import { SlashCommandBuilder } from "@discordjs/builders";

const create4pRaid = new SlashCommandBuilder()
  .setName("4인레이드")
  .setDescription("4인레이드 스케줄을 만들어요 ☺️")
  .addStringOption(option =>
    option
      .setName("레이드")
      .setDescription("어떤 레이드에 가시나요? 🧐")
      .setRequired(true)
      .setChoices(
        { name: "쿠크세이튼", value: "쿠크세이튼" },
        { name: "카양겔 [노말]", value: "카양겔 [노말]" },
        { name: "카양겔 [하드]", value: "카양겔 [하드]" },
        { name: "상아탑 [노말]", value: "상아탑 [노말]" },
        { name: "상아탑 [하드]", value: "상아탑 [하드]" }
      )
  )
  .addStringOption(option =>
    option.setName("날짜").setDescription("Date (YYYY-MM-DD)").setRequired(true)
  )
  .addStringOption(option =>
    option.setName("시작시간").setDescription("Time (HH:MM)").setRequired(true)
  );

export { create4pRaid };
