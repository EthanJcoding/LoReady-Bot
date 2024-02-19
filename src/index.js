import { saveUser } from "./commands/SaveUser.js";
import { testCommand } from "./commands/test.js";
import { REST, Routes } from "discord.js";
import { startBot } from "./bot.js";

async function initializeCommands() {
  const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
  const commandArray = [testCommand, saveUser];

  try {
    await rest.put(Routes.applicationCommands(process.env.ID), {
      body: commandArray,
    });

    console.log(
      `Successfully reloaded application ${commandArray.length} commands.`
    );
  } catch (error) {
    console.error(error);
  }
}

(async () => {
  initializeCommands();
  await startBot();
})();
