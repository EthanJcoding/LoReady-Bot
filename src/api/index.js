// userDisocrdId:{
//     channels: [channelId...],
//     characters: [{
//       CharacterName: '태권도노란띠브레이커',
//       CharacterClassName: '브레이커',
//       CharacterImage: 'https://img.lostark.co.kr/armory/1/ba0b25d4c623c418cb8c5ddd9d289cb25e474512eac05c07f531b6a067aecc95.png?v=20240217062905',
//       CharacterLevel: 51,
//       ItemAvgLevel: '1,540.00',
//       ServerName: '카마인'
//     }]
//     globalName,
//     username,
//     userId,
//     updated,
//     joined,
// }

import { handleInitBot } from "./handleInitBot/handleInitBot.js";
import { handleKickBot } from "./handleKickBot/handleKickBot.js";
import { handleSaveUser } from "./saveUser/handleSaveUser.js";
import { isChannelCollectionExist } from "./isChannelCollectionExist/isChannelCollectionExist.js";
import { handleUpdateChannelMembers } from "./saveUser/handleUpdateChannelMembers.js";
import { createSchedule } from "./createSchedule/createSchedule.js";
import { handleUpdateChannelSchedules } from "./createSchedule/handleUpdateChannelSchedules.js";
import { handleUpdateMemberSchedule } from "./createSchedule/handleUpdateMemberSchedule.js";
import { handleSaveCharacters } from "./saveUser/handleSaveCharaters.js";
import { getCharacters } from "./getCharacters/getCharacters.js";
import { joinSchedule } from "./joinSchedule/joinSchedule.js";
import { handleWeeklyParticipation } from "./handleWeeklyParticipation/handleWeeklyParticipation.js";

export {
  createSchedule,
  handleInitBot,
  handleKickBot,
  handleSaveUser,
  isChannelCollectionExist,
  handleUpdateChannelMembers,
  handleUpdateChannelSchedules,
  handleUpdateMemberSchedule,
  handleSaveCharacters,
  getCharacters,
  joinSchedule,
  handleWeeklyParticipation,
};
