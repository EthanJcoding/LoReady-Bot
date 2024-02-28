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
export { handleInitBot, handleKickBot, handleSaveUser };
