import { SlashCommandBuilder } from "@discordjs/builders";

const saveUser = new SlashCommandBuilder()
  .setName("등록하기")
  .setDescription("로레디봇 사용을 위해 본인의 로스트아크 캐릭터를 등록해요 ☺️")
  .addStringOption(option =>
    option
      .setName("캐릭터명")
      .setDescription("본인의 캐릭터명을 적어주세요")
      .setRequired(true)
  );

export { saveUser };
