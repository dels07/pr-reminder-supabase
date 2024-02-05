import { request } from "./utils.ts";

type GChatConfig = {
  baseUrl: string;
  channel: string;
};

export const sendMessage = async (config: GChatConfig, message: string) => {
  const url = `${config.baseUrl}/${config.channel}`;
  const body = JSON.stringify({
    text: message,
  });

  return await request("POST", url, body);
};
