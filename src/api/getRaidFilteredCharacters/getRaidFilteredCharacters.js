const getRaidFilteredCharacters = (characters, raid) => {
  let minItemAvgLevel;

  switch (raid) {
    case "발탄 [노말]":
      minItemAvgLevel = 1415;
      break;
    case "발탄 [하드]":
      minItemAvgLevel = 1445;
      break;
    case "비아키스 [노말]":
      minItemAvgLevel = 1430;
      break;
    case "비아키스 [하드]":
      minItemAvgLevel = 1460;
      break;
    case "쿠크세이튼":
      minItemAvgLevel = 1430;
      break;
    case "아브렐슈드 [노말]":
      minItemAvgLevel = 1520;
      break;
    case "아브렐슈드 [하12노3]":
      minItemAvgLevel = 1540;
      break;
    case "카양겔 [노말]":
      minItemAvgLevel = 1540;
      break;
    case "아브렐슈드 [하드]":
      minItemAvgLevel = 1560;
      break;
    case "카양겔 [하드]":
      minItemAvgLevel = 1580;
      break;
    case "일리아칸 [노말]":
      minItemAvgLevel = 1580;
      break;
    case "일리아칸 [하드]":
      minItemAvgLevel = 1600;
      break;
    case "상아탑 [노말]":
      minItemAvgLevel = 1600;
      break;
    case "상아탑 [하드]":
      minItemAvgLevel = 1620;
      break;
    case "카멘 [노말]":
      minItemAvgLevel = 1610;
      break;
    case "카멘 [하드]":
      minItemAvgLevel = 1630;
      break;
    case "에키드나 [노말]":
      minItemAvgLevel = 1620;
      break;
    case "에키드나 [하드]":
      minItemAvgLevel = 1630;
      break;
    default:
      return characters;
  }

  const filteredCharacters = characters.filter(character => {
    const itemAvgLevel = parseFloat(character.ItemAvgLevel.replace(",", ""));
    return itemAvgLevel >= minItemAvgLevel;
  });

  return filteredCharacters;
};

export { getRaidFilteredCharacters };
