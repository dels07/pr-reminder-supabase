import { request } from "./utils.ts";

type FlockConfig = {
  baseUrl: string;
  channel: string;
};

export const sendMessage = async (config: FlockConfig, message: string) => {
  const url = `${config.baseUrl}/${config.channel}`;
  const body = { flockml: message };

  return await request("POST", url, body);
};
