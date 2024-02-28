import { Client, GatewayIntentBits } from "discord.js";
import { config } from "dotenv";
import { handleCommandInteraction } from "./interaction.js";
import { handleInitBot, handleKickBot } from "./api/index.js";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

const firebaseConfig = {
  apiKey: process.env.APIKEY,
  authDomain: process.env.AUTHDOMAIN,
  projectId: process.env.PROJECTID,
  storageBucket: process.env.STORAGEBUCKET,
  messagingSenderId: process.env.MESSAGINGSENDERID,
  appId: process.env.APPID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("guildCreate", async guild => {
  try {
    await handleInitBot(guild);
    console.log(`${guild.name} 채널을 DB에 등록했습니다`);
  } catch (err) {
    console.log("An error occurred while saving channel:", err);
  }
});

client.on("guildDelete", async guild => {
  try {
    await handleKickBot(guild);
    console.log(
      `채널명: ${guild.name}, 채널아이디:${guild.id} 의 정보를 DB에서 삭제했습니다`
    );
  } catch (err) {
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
