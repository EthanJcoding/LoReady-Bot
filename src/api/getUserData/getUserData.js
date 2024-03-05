import { firestore } from "../../bot.js";
import { doc, getDoc } from "firebase/firestore";

const getUserData = async userId => {
  try {
    const userRef = doc(firestore, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return null;
    } else {
      return userSnap.data();
    }
  } catch (err) {
    console.log("An error occurred while getting user data:", err);
  }
};

export { getUserData };
