import { getOpenPullRequests } from "../_shared/bitbucket.ts";
import { sendMessage } from "../_shared/flock.ts";
import { jakartaTime } from "../_shared/utils.ts";
import {
  getConfigs,
  getGreeter,
  getRandomGreeter,
} from "../_shared/supabase.ts";

type FnResult = {
  type: string;
  time: string;
  repository: string;
  open_pull_request: number;
};

export const execute = async (): Promise<FnResult[] | void> => {
  const configs = await getConfigs();

  if (!configs) {
    return;
  }

  const results: FnResult[] = [];

  for (const config of configs) {
    const pullRequests = await getOpenPullRequests({
      baseUrl: Deno.env.get("BITBUCKET_BASE_URL")!,
      repository: config.bitbucket_repository,
      username: config.bitbucket_username,
      password: config.bitbucket_password,
      authors: config.pr_authors?.split(",") ?? [],
      interval: +Deno.env.get("FETCH_INTERVAL")!,
    });

    const result = {
      type: "regular",
      time: jakartaTime(),
      repository: config.bitbucket_repository,
      open_pull_request: pullRequests?.length ?? 0,
    };

    results.push(result);

    console.info(
      `[${result.time}][${result.repository}] Found ${result.open_pull_request} PR(s)`,
    );

    if (!pullRequests.length) {
      continue;
    }

    await Promise.allSettled(
      pullRequests.map(async ({ title, author, url, target }) => {
        if (
          target.search("master|release") !== -1 && config.flock_review_channel
        ) {
          const greeter = await getGreeter();
          const message = `<flockml>${
            greeter?.message ?? ""
          }<br/><a href="${url}">${title}</a> by ${author}</flockml>`;

          await sendMessage({
            baseUrl: Deno.env.get("FLOCK_BASE_URL")!,
            channel: config.flock_review_channel,
          }, message);
        }

        const greeter =
          await (config.custom_greeter ? getRandomGreeter() : getGreeter());
        const message = `<flockml>${
          greeter?.message ?? ""
        }<br/><a href="${url}">${title}</a> by ${author}</flockml>`;

        await sendMessage({
          baseUrl: Deno.env.get("FLOCK_BASE_URL")!,
          channel: config.flock_channel,
        }, message);
      }),
    );
  }

  return results;
};
