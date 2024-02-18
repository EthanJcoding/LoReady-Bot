import PocketBase from "pocketbase";

const pb = new PocketBase("https://loreadybase.fly.dev");

const saveChannel = async data => {
  await pb.collection("channel").create(data);
};

const deleteChannel = async guildId => {
  const { id } = await pb
    .collection("channel")
    .getFirstListItem(`channelId="${guildId}"`);

  await pb.collection("channel").delete(id);
};

export { saveChannel, deleteChannel };
