import dayjs from "https://deno.land/x/deno_dayjs@v0.5.0/mod.ts";

export const request = async (
  method: string,
  url: string,
  body?: string | null,
  credential?: string | null,
) => {
  try {
    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    };

    if (body) {
      options.body = body;
    }

    if (credential) {
      const reqHeaders = new Headers(options.headers);
      reqHeaders.set("Authorization", `Basic ${credential}`);

      options.headers = reqHeaders;
    }

    const res = await fetch(url, options);
    const json = await res.json();

    return json;
  } catch (error) {
    console.error('utils: request', error)
  }
};

export const jakartaTime = () => {
  return dayjs().add(7, "hours").format();
};

export const isWeekend = () => {
  const today = dayjs().format("ddd");

  return ["Sun", "Sat"].includes(today);
};

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey",
};
