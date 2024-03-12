import { SlashCommandBuilder } from "discord.js";

const checkSchedule = new SlashCommandBuilder()
  .setName("스케줄확인")
  .setDescription("현재 채널에서 유효한 스케줄들의 목록을 불러와요");

export { checkSchedule };
