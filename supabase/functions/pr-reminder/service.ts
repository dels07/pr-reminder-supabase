import { getOpenPullRequests } from "../_shared/bitbucket.ts";
import { sendMessage } from "../_shared/gchat.ts";
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

  const pullRequestsPromises = configs.map((config) =>
    getOpenPullRequests({
      baseUrl: Deno.env.get("BITBUCKET_BASE_URL")!,
      repository: config.bitbucket_repository,
      username: config.bitbucket_username,
      password: config.bitbucket_password,
      authors: config.pr_authors?.split(",") ?? [],
      interval: +Deno.env.get("FETCH_INTERVAL")!,
    }).then((pullRequests) => ({
      config,
      pullRequests,
    }))
  );

  const pullRequestsResults = await Promise.allSettled(pullRequestsPromises);

  const results: FnResult[] = [];

  for (const pullRequestsResult of pullRequestsResults) {
    if (pullRequestsResult.status === "rejected") {
      console.error(`Failed to get open pull requests: ${pullRequestsResult.reason}`);
      continue;
    }

    const { config, pullRequests } = pullRequestsResult.value;

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
      pullRequests.map(async ({ title, author, url }) => {
        const greeter =
          await (config.custom_greeter ? getRandomGreeter() : getGreeter());
        const message = `<users/all> ${
          greeter?.message ?? ""
        }\n<${url}|${title}> by ${author}`;

        await sendMessage({
          baseUrl: Deno.env.get("GCHAT_BASE_URL")!,
          channel: config.gchat_channel,
        }, message);
      }),
    );
  }

  return results;
};
