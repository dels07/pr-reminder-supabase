import { getOpenPullRequests } from "../_shared/bitbucket.ts";
import { sendMessage } from "../_shared/flock.ts";
import { isWeekend, jakartaTime } from "../_shared/utils.ts";
import { getConfigs } from "../_shared/supabase.ts";

type FnResult = {
  type: string;
  time: string;
  repository: string;
  open_pull_request: number;
};

export const execute = async (): Promise<FnResult[] | void> => {
  const configs = await getConfigs();

  if (!configs) {
    console.error(
      `[${jakartaTime()}] No config(s) detected`,
    );

    return;
  }

  if (isWeekend()) {
    console.info(
      `[${jakartaTime()}] No PR summary on weekend`,
    );

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
      interval: 24 * 60,
    });

    const result = {
      type: "summary",
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

    const links = pullRequests.map(({ title, author, url }) =>
      `<${url}|${title}> by ${author}`
    ).join("\n");
    const greeter =
      `<users/all> masih ada *${pullRequests.length}* PR yang OPEN di repo *${config.bitbucket_repository}*, dibantu review ya`;
    const message = `${greeter}\n${links}`;

    await sendMessage({
      baseUrl: Deno.env.get("GCHAT_BASE_URL")!,
      channel: config.gchat_channel,
    }, message);
  }

  return results;
};
