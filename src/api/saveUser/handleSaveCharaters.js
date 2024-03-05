import {
  collection,
  doc,
  setDoc,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import { firestore } from "../../bot.js";

const handleSaveCharacters = async (userId, characters) => {
  // 유저의 캐릭터명 입력으로 받은 데이터 유효성 검사
  if (!Array.isArray(characters) || characters.length === 0) {
    console.log("Invalid characters data. No changes made.");
    return;
  }

  const userRef = doc(firestore, "users", userId);
  const charactersCollectionRef = collection(userRef, "characters");

  // 기존에 존재하는 데이터 확인
  const querySnapshot = await getDocs(charactersCollectionRef);

  if (!querySnapshot.empty) {
    const batch = writeBatch(firestore);
    querySnapshot.forEach(doc => {
      batch.delete(doc.ref);
    });

    try {
      await batch.commit();
      console.log("All existing character documents deleted successfully.");
    } catch (err) {
      console.log(
        "An error occurred while deleting existing character documents:",
        err
      );
      return;
    }
  } else {
    console.log("No existing character documents found. No deletion needed.");
  }

  // 새로운 캐릭터 정보 문서화
  for (let i = 0; i < characters.length; i++) {
    const characterDocRef = doc(
      charactersCollectionRef,
      characters[i].CharacterName
    );
    await setDoc(characterDocRef, characters[i]);
    console.log(
      `Character document ${characters[i].CharacterName} replaced successfully.`
    );
  }
};

export { handleSaveCharacters };
