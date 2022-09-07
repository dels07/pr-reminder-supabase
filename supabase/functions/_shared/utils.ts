import dayjs from "https://deno.land/x/deno_dayjs/mod.ts";

export const request = async (
  method: string,
  url: string,
  body?: object | null,
  credential?: string,
) => {
  const options: any = {
    method,
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  if (credential) {
    options.headers["Authorization"] = `Basic ${credential}`;
  }

  const res = await fetch(url, options);
  const json = await res.json();

  return json;
};

export const jakartaTime = () => {
  return dayjs().add(7, "hours").format();
};

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey",
};
