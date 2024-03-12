import { saveUser } from "./commands/SaveUser.js";
import { testCommand } from "./commands/test.js";
import { create4pRaid } from "./commands/create4pRaid.js";
import { create8pRaid } from "./commands/create8pRaid.js";
import { joinSchedule } from "./commands/joinSchedule.js";
import { REST, Routes } from "discord.js";
import { startBot } from "./bot.js";
import { checkSchedule } from "./commands/checkSchedule.js";

async function initializeCommands() {
  const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
  const commandArray = [
    testCommand,
    saveUser,
    create4pRaid,
    create8pRaid,
    joinSchedule,
    checkSchedule,
  ];

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
