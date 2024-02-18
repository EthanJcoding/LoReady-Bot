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

// 캐릭터들의 정보 (api 호출이 캐릭당 한번 일어남)
const getCharsData = async chaName => {
  const { characters } = await getData(chaName);

  for (let i = 0; i < characters.length; i++) {
    let data = await axios.get(
      url + `/armories/characters/${characters[i].characterName}/profiles`,
      {
        headers: {
          accept: "application/json",
          Authorization: `bearer ${process.env.LOSTARK_API}`,
        },
      }
    );

    characters[i].CharacterImage = data.data.CharacterImage;
    characters[i].CharacterLevel = data.data.CharacterLevel;
    characters[i].ItemAvgLevel = data.data.ItemAvgLevel;
    characters[i].ServerName = data.data.ServerName;
  }

  return characters;
};

export { getCharsData };
