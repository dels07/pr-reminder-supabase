import { getOpenPullRequests } from "../_shared/bitbucket.ts";
import { sendMessage } from "../_shared/flock.ts";
import { jakartaTime } from "../_shared/utils.ts";
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
      `<a href="${url}">${title}</a> by ${author}`
    ).join("<br/>");
    const greeter =
      `masih ada ${pullRequests.length} PR yang OPEN di repo ${config.bitbucket_repository}, dibantu review ya`;
    const message = `<flockml>${greeter}<br/>${links}</flockml>`;

    await sendMessage({
      baseUrl: Deno.env.get("FLOCK_BASE_URL")!,
      channel: config.flock_channel,
    }, message);
  }

  return results;
};