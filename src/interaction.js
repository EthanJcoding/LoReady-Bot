import { getCharsData } from "./utils/lostArk.js";
import { deleteChannel } from "./utils/pocketBase.js";

async function handleCommandInteraction(interaction) {
  const { commandName, options } = interaction;

  const guildId = interaction.guildId;
  const username = interaction.user.globalName;

  if (interaction.isCommand()) {
    if (commandName === "test") {
      //   try {
      //     await deleteChannel(guildId);
      //   } catch (err) {
      //     console.log(err);
      //   }
    }
    if (commandName === "등록하기") {
      const chaName = options.getString("캐릭터명");

      const json = await getCharsData(chaName);
      console.log(json);
    }
  }
}

export { handleCommandInteraction };
