import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { firestore } from "../../bot.js";

// const handleUpdateChannelMembers = async (guildId, userId) => {
//   const usersRef = doc(firestore, "users", userId);

//   const refreshedUsersSnap = await getDoc(usersRef);
//   const fetchedUserData = refreshedUsersSnap.data();

//   const channelsRef = doc(firestore, "channels", guildId);
//   const channelsSnap = await getDoc(channelsRef);
//   const { members, memberIds } = channelsSnap.data();

//   const { channels } = fetchedUserData;

//   for (let i = 0; i < channels.length; i++) {
//     const channelRef = doc(firestore, "channels", channels[i]);
//     const channelSnap = await getDoc(channelRef);
//     const { members, memberIds } = channelSnap.data();

//     if (members.length === 0 && memberIds.length === 0) {
//       try {
//         await updateDoc(channelsRef, {
//           members: [fetchedUserData],
//           memberIds: [userId],
//         });
//       } catch (err) {
//         console.log(
//           "An error occurred while handling updating channel members:",
//           err
//         );
//       }
//     }

//     // members 배열에서 userId를 조회하여 데이터를 업데이트함
//     for (let j = 0; j < members.length; j++) {
//       if (members[j].userId === userId) {
//         members[j] = fetchedUserData;
//         try {
//           await updateDoc(channelRef, { members });
//         } catch (err) {
//           console.log(
//             "An error occurred while handling updating channel members:",
//             err
//           );
//         }
//       }
//     }
//   }

//   // 이미 등록한 유저면 업데이트
//   if (memberIds.includes(userId)) {
//     for (let i = 0; i < members.length; i++) {
//       if (members[i].userId === userId) {
//         members[i] = fetchedUserData;
//         try {
//           await updateDoc(channelsRef, { members });
//         } catch (err) {
//           console.log(
//             "An error occurred while handling updating channel members:",
//             err
//           );
//         }
//       }
//     }
//   } else {
//     members.push(fetchedUserData);
//     memberIds.push(userId);
//     try {
//       await updateDoc(channelsRef, { members, memberIds });
//     } catch (err) {
//       console.log(
//         "An error occurred while handling updating channel members:",
//         err
//       );
//     }
//   }
// };

const handleUpdateChannelMembers = async (guildId, userId) => {
  try {
    const channelRef = doc(firestore, "channels", guildId);
    await updateDoc(channelRef, { memberIds: arrayUnion(userId) });
  } catch (err) {
    "An error occurred while handling updating channel's memberIds:", err;
  }
};

export { handleUpdateChannelMembers };
