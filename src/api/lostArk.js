import axios from "axios";
import { config } from "dotenv";
import * as cheerio from "cheerio";

config();

async function getHtml(url) {
  return await axios.get(`${url}`);
}

const url = `https://developer-lostark.game.onstove.com`;

function mergeArraysToCharacters(data) {
  const { own_job, own_userName } = data;
  const characters = [];

  for (let i = 0; i < own_job.length; i++) {
    const CharacterName = own_userName[i];
    const CharacterClassName = own_job[i];
    characters.push({
      CharacterName,
      CharacterClassName,
      CharacterImage: "",
      CharacterLevel: 0,
      ItemAvgLevel: "",
      ServerName: "",
    });
  }

  return {
    characters,
  };
}

// 최초 유저의 캐릭터들 배열
const getData = async chaName => {
  const html = await getHtml(
    `https://lostark.game.onstove.com/Profile/Character/${encodeURI(
      chaName
    )}#profile-collection`
  );
  const $ = cheerio.load(html.data);

  let json = {};
  let count = 0;
  let temp = [];

  // 보유 캐릭터 직업
  count = 0;
  temp = [];
  $("ul.profile-character-list__char")
    .children()
    .each(function () {
      $(this)
        .children()
        .children()
        .children()
        .each(function () {
          if ($(this).attr("alt") !== undefined) {
            temp[count] = $(this).attr("alt");
            count = count + 1;
          }
        });
    });
  json.own_job = temp;

  // 보유 캐릭터 명
  count = 0;
  temp = [];
  $("ul.profile-character-list__char > li > span > button").each(function () {
    temp[count] = $(this).attr("onclick")?.split("/")[3].replace("'", "");
    count = count + 1;
  });
  json.own_userName = temp;

  return mergeArraysToCharacters(json);
};

const getUserDetailInfo = async chaName => {
  try {
    const { characters } = await getData(chaName);

    for (let i = 0; i < characters.length; i++) {
      let data = await axios.get(
        url +
          `/armories/characters/${characters[i].CharacterName}?filters=profiles%2Bequipment%2Bengravings%2Bcards%2Bgems`,
        {
          headers: {
            accept: "application/json",
            Authorization: `bearer ${process.env.LOSTARK_API}`,
          },
        }
      );

      if (data) {
        // characters[i].weeklyParticipationHistory = [];
        // characters[i].CharacterImage = data.data.ArmoryProfile.CharacterImage;
        // characters[i].CharacterLevel = data.data.ArmoryProfile.CharacterLevel;
        // characters[i].ItemAvgLevel = data.data.ArmoryProfile.ItemAvgLevel;
        // characters[i].ServerName = data.data.ArmoryProfile.ServerName;

        console.log(data.data.ArmoryEquipment);

        // characters[i].ArmoryEquipment = data.data.ArmoryEquipment;
        // characters[i].ArmoryEngraving = data.data.ArmoryEngraving;
        // characters[i].ArmoryCard = data.data.ArmoryCard;
        // characters[i].ArmoryGem = data.data.ArmoryGem;
      } else return null;
    }

    return characters;
  } catch (err) {
    console.log("An error occurred while getting characters:", err);
  }
};

// 캐릭터들의 정보 (api 호출이 캐릭당 한번 일어남)
const getCharsData = async chaName => {
  try {
    const { characters } = await getData(chaName);

    for (let i = 0; i < characters.length; i++) {
      let data = await axios.get(
        url +
          `/armories/characters/${characters[i].CharacterName}?filters=profiles%2Bequipment%2Bengravings%2Bcards%2Bgems`,
        {
          headers: {
            accept: "application/json",
            Authorization: `bearer ${process.env.LOSTARK_API}`,
          },
        }
      );

      if (data) {
        characters[i].weeklyParticipationHistory = [];
        characters[i].CharacterImage = data.data.ArmoryProfile.CharacterImage;
        characters[i].CharacterLevel = data.data.ArmoryProfile.CharacterLevel;
        characters[i].ItemAvgLevel = data.data.ArmoryProfile.ItemAvgLevel;
        characters[i].ServerName = data.data.ArmoryProfile.ServerName;
      } else return null;
    }

    return characters;
  } catch (err) {
    console.log("An error occurred while getting characters:", err);
  }
};

export { getCharsData, getUserDetailInfo };
