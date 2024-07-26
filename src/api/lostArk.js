import axios from "axios";
import { config } from "dotenv";

config();

const url = `https://developer-lostark.game.onstove.com`;

const headers = {
  headers: {
    accept: "application/json",
    Authorization: `bearer ${process.env.LOSTARK_API}`,
  },
};

// 최초 유저의 캐릭터들 배열
const getSiblings = async chaName => {
  const { data } = await axios.get(
    url + "/characters/" + chaName + "/siblings",
    headers
  );

  if (data) {
    return data;
  } else {
    return "not able to find character data:", data;
  }
};

const getCharacter = async chaName => {
  const { data } = await axios.get(
    url +
      `/armories/characters/${chaName}?filters=profiles%2Bequipment%2Bengravings%2Bcards%2Bgems`,
    headers
  );

  if (data) {
    return data;
  } else {
    return "not able to find character data:", data;
  }
};

const saveCharacterData = async chaName => {
  try {
    const siblingsData = await getSiblings(chaName);
    const charData = await getCharacter(chaName);

    return { charData, siblingsData };
  } catch (err) {
    console.log("An error occurred while getting characters:", err);
  }
};

export { saveCharacterData, getSiblings, getCharacter };
