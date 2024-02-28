import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
  addDoc,
  collectionGroup,
} from "firebase/firestore";
import { customDateString } from "../../utils/customDateString.js";
import { firestore } from "../../bot.js";
import { runTransaction } from "firebase/firestore";
import { handleInitBot } from "../handleInitBot/handleInitBot.js";

const handleSaveUser = async (guild, guildId, userId, data) => {
  data.updated = customDateString();
  const usersRef = doc(firestore, "users", userId);

  // 유저 정보 channels 배열에 이 채널 아이디가 존재하지 않으면 푸쉬
  const userDoc = await getDoc(usersRef);
  // 유저 정보 문서가 존재하면 data.channel 업데이트 없으면 (유저 컬렉션에 해당 유저가 없으면) 명령어를 작성한 채널의 ID를 부여
  if (userDoc.exists()) {
    const { channels } = userDoc.data();

    if (channels.includes(guildId)) {
      data.channels = channels;
    } else {
      channels.push(guildId);
      data.channels = channels;
    }
  } else {
    data.channels = [guildId];
  }

  const channelsCol = collection(firestore, "channels");
  const querySnapshot = await getDocs(channelsCol);

  const channelArr = [];
  const channelIdArr = [];

  querySnapshot.forEach(doc => {
    channelArr.push(doc.data());
  });

  for (let i = 0; i < channelArr.length; i++) {
    if (channelArr[i].memberIds.includes(userId)) {
      channelIdArr.push(channelArr[i].id);
    }
  }

  console.log(channelArr);

  // // 채널 컬렉션 members, array-contains, userId 로 userId를 보유한 모든 문서를 조회하고 해당 채널ID에 접근함
  // // 접근하면 반복문을 돌려서 해당 채널들의 member배열에서 동일한 userId를 보유한 member배열을 업데이트 함 => array of object는 사용을 할 수 없음
  // // 채널 컬렉션에 memberIds 배열을 만들어서 등록을 완료한 유저의 아이디를 저장, 다른 채널에서 등록한다면 채널 컬렉션을 불러오고 memberIds 배열에서 동일한 유저Id를 검색
  // // 등록한 userId가 있는 채널들의 Id를 배열로 만들어서 반복문을 돌려 해당 채널에 유저 정보 업데이트
  // const channelsCol = collection(firestore, "channels");
  // const querySnapshot = await getDocs(channelsCol);

  // const channelArr = [];
  // const channelIdArr = [];

  // querySnapshot.forEach(doc => {
  //   channelArr.push(doc.data());
  // });

  // for (let i = 0; i < channelArr.length; i++) {
  //   if (channelArr[i].memberIds.includes(userId)) {
  //     channelIdArr.push(channelArr[i].id);
  //   }
  // }

  // // 채널 컬렉션 members 배열에 해당 유저 정보 업데이트

  // if (channelIdArr.length === 0) {
  //   const channelsRef = doc(firestore, "channels", guildId);
  //   const newMemberIds = [];

  //   try {
  //     await runTransaction(firestore, async transaction => {
  //       const channelDoc = await transaction.get(channelsRef);
  //       const userDoc = await transaction.get(usersRef);
  //       // 채널 등록 X 일 경우
  //       if (!channelDoc.exists()) {
  //         await handleInitBot(guild);
  //       }

  //       // 채널 맴버 배열에 유저가 존재할경우 해당 유저만 업데이트
  //       const newMemberArr = [...channelDoc.data().members];

  //       const isUserExists = newMemberArr.some(user => user.userId === userId);

  //       if (isUserExists) {
  //         newMemberArr.forEach((member, idx) => {
  //           if (member.userId === userId) {
  //             newMemberArr[idx] = data;
  //           }
  //         });
  //         transaction.update(channelsRef, { members: newMemberArr });
  //       } else {
  //         newMemberArr.push(data);
  //         transaction.update(channelsRef, { members: newMemberArr });
  //         newMemberIds.push(userId);
  //       }
  //       transaction.update(channelsRef, { memberIds: newMemberIds });

  //       // 유저 컬렉션에 추가, 만약 유저가 존재하면 업데이트
  //       if (!userDoc.exists()) {
  //         await setDoc(usersRef, data);
  //       } else {
  //         transaction.update(usersRef, data);
  //       }
  //     });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // } else {
  //   channelIdArr.push(guildId);

  //   for (let i = 0; i < channelIdArr.length; i++) {
  //     const channelsRef = doc(firestore, "channels", channelIdArr[i]);
  //     const newMemberIds = [];
  //     try {
  //       await runTransaction(firestore, async transaction => {
  //         const channelDoc = await transaction.get(channelsRef);
  //         const userDoc = await transaction.get(usersRef);
  //         // 채널 등록 X 일 경우
  //         if (!channelDoc.exists()) {
  //           await handleInitBot(guild);
  //         }

  //         // 채널 맴버 배열에 유저가 존재할경우 해당 유저만 업데이트
  //         const newMemberArr = [...channelDoc.data().members];

  //         const isUserExists = newMemberArr.some(
  //           user => user.userId === userId
  //         );

  //         if (isUserExists) {
  //           newMemberArr.forEach((member, idx) => {
  //             if (member.userId === userId) {
  //               newMemberArr[idx] = data;
  //             }
  //           });
  //           transaction.update(channelsRef, { members: newMemberArr });
  //         } else {
  //           newMemberArr.push(data);
  //           transaction.update(channelsRef, { members: newMemberArr });

  //           newMemberIds.push(userId);
  //         }

  //         transaction.update(channelsRef, { memberIds: newMemberIds });

  //         // 유저 컬렉션에 추가, 만약 유저가 존재하면 업데이트
  //         if (!userDoc.exists()) {
  //           await setDoc(usersRef, data);
  //         } else {
  //           transaction.update(usersRef, data);
  //         }
  //       });
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   }
  // }
};

export { handleSaveUser };
