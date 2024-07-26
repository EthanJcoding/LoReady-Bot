import { doc, getDoc, setDoc } from "firebase/firestore";
import { firestore } from "../../bot.js";
import { customDateString } from "../../utils/customDateString.js";
import { saveCharacterData } from "../lostArk.js";

async function saveCharacter(character) {
  const characterRef = doc(firestore, "characters", character);

  try {
    const docSnapshot = await getDoc(characterRef);

    if (docSnapshot.exists()) {
      return;
    } else {
      const { charData, siblingsData } = await saveCharacterData(character);

      if (charData && siblingsData) {
        await setDoc(characterRef, {
          ...charData,
          siblingsData,
          updated: customDateString(),
        });
        console.log(`${character} data saved`);
      } else return null;
    }
  } catch (err) {
    console.error("Error in saveCharacter:", err);
    throw err; // 오류를 상위로 전파
  }
}

export { saveCharacter };
