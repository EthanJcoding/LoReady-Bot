import { SlashCommandBuilder } from "@discordjs/builders";

const joinSchedule = new SlashCommandBuilder()
  .setName("스케줄참여")
  .setDescription("레이드 스케줄에 참여해요");

export { joinSchedule };
