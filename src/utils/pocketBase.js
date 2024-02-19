import PocketBase from "pocketbase";

const pb = new PocketBase("https://loreadybase.fly.dev");

const saveChannel = async data => {
  await pb.collection("channel").create(data);
};

const getChannelData = async guildId => {
  const record = await pb
    .collection("channel")
    .getFirstListItem(`channelId="${guildId}"`);

  return record.id;
};

// member컬렉션을 전부 조회하고 거기서 userId가 같은지 판단하여 리턴
const isUserAlreadyRegistered = async userId => {
  const records = await pb.collection("members").getFullList({
    sort: "-created",
  });

  return records.some(item => item.userId === userId);
};

const deleteChannel = async guildId => {
  const { id } = await pb
    .collection("channel")
    .getFirstListItem(`channelId="${guildId}"`);

  await pb.collection("channel").delete(id);
};

const saveUserData = async data => {
  const record = await pb.collection("members").create(data);

  return record;
};

const updateChannelRelUserData = async (RECORD_ID, data) => {
  const record = await pb.collection("channel").update(RECORD_ID, data);

  return record;
};

export {
  saveChannel,
  deleteChannel,
  saveUserData,
  updateChannelRelUserData,
  getChannelData,
  isUserAlreadyRegistered,
};
