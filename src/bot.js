import { Client, GatewayIntentBits } from "discord.js";
import { config } from "dotenv";
import { handleCommandInteraction } from "./interaction.js";
import { saveChannel, deleteChannel } from "./api/pocketBase.js";

config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// 주기적으로 앞으로 다가올 스케줄과 지나간 스케줄의 isActive값을 관리함 ? 프론트에서 스케줄을 확인할 수 있으니 거기서 지나간 것과 아닌것을 관리?
client.on("ready", () => {
  //   setInterval(() => {
  //     console.log("hi");
  //   }, 6000);
});

client.on("guildCreate", async guild => {
  const data = {
    channelId: guild.id,
    channelName: guild.name,
  };

  try {
    await saveChannel(data);
    console.log(`${guild.name} 채널을 DB에 등록했습니다`);
  } catch (err) {
    console.log("An error occurred while saving channel:", err);
  }
});

client.on("guildDelete", async guild => {
  try {
    await deleteChannel(guild.id);
    console.log(
      `채널명: ${guild.name}, 채널아이디:${guild.id} 의 정보를 DB에서 삭제했습니다`
    );
  } catch (err) {
    if (err.status === 404) {
      console.log("해당 채널은 이미 삭제됐습니다");
    }
    console.log("An error occurred while deleting channel:", err);
  }
});

client.on("interactionCreate", handleCommandInteraction);

async function startBot() {
  try {
    await client.login(process.env.TOKEN);
  } catch (err) {
    console.error("An error occurred while starting the bot:", err);
  }
}

export { client, startBot };
