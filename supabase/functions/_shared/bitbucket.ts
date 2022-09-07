import dayjs from "https://deno.land/x/deno_dayjs/mod.ts";

import { jakartaTime, request } from "./utils.ts";

export type PullRequest = {
  title: string;
  author: string;
  url: string;
  target: string;
};

export type BitbucketConfig = {
  baseUrl: string;
  repository: string;
  username: string;
  password: string;
  authors: string[];
  interval: number;
};

export type PullRequestsResult = {
  title: string;
  author: { display_name: string };
  links: { html: { href: string } };
  destination: { branch: { name: string } };
};

export type BitbucketResponse = {
  pagelen: number;
  values: PullRequestsResult[];
  page: number;
  size: number;
};

export type BitbucketError = {
  type: string;
  error: { message: string };
};

export const getOpenPullRequests = async (
  config: BitbucketConfig,
): Promise<PullRequest[]> => {
  const datetime = dayjs().subtract(config.interval, "minutes").toISOString();
  const endpoint = `/repositories/${config.repository}/pullrequests`;
  const query =
    `?q=state="OPEN" AND created_on >= ${datetime}&sort=-updated_on&pagelen=50`;
  const url = encodeURI(`${config.baseUrl}${endpoint}${query}`);
  const credential = btoa(`${config.username}:${config.password}`);

  const json: BitbucketResponse | BitbucketError = await request(
    "GET",
    url,
    null,
    credential,
  );

  if (!json || (json as BitbucketError)?.error) {
    console.error(
      `[${jakartaTime()}][${config.repository}] Error: ` +
        (json as BitbucketError)?.error,
    );

    return [];
  }

  const pullRequests = (json as BitbucketResponse).values;

  return pullRequests
    .filter(({ author }) => config.authors.includes(author.display_name))
    .map(({ title, author, links, destination }) => {
      return {
        title: title,
        author: author.display_name,
        url: links.html.href,
        target: destination.branch.name,
      };
    });
};
