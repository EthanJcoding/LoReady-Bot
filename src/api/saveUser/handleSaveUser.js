import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { firestore } from "../../bot.js";

const handleSaveUser = async (guildId, userId, data) => {
  // 유저가 본인의 원정대를 users 컬렉션에 저장하고
  // channels 컬렉션의 members 배열에 유저가 등록한 원정대를 추가하고
  // channels 컬렉션의 memberIds 배열에 추가된 유저의 userId를 추가함
  try {
    const usersRef = doc(firestore, "users", userId);
    const usersSnap = await getDoc(usersRef);

    if (!usersSnap.exists()) {
      data.channels = [guildId];
      await setDoc(usersRef, data);
    } else {
      const { channels } = usersSnap.data();
      if (!channels.includes(guildId)) {
        data.channels = [...channels, guildId];
      }
      await updateDoc(usersRef, data);
    }
  } catch (err) {
    console.log("An error occurred while handling saving user data:", err);
  }
};

export { handleSaveUser };
