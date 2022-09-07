import { createClient } from "https://esm.sh/@supabase/supabase-js@^1.33.2";

import { jakartaTime } from "./utils.ts";

type Config = {
  id: number;
  bitbucket_repository: string;
  bitbucket_username: string;
  bitbucket_password: string;
  flock_channel: string;
  flock_review_channel: string | null;
  pr_authors: string;
  active: boolean;
  created_at: string;
  updated_at: string | null;
};

type Greeter = {
  id: number;
  message: string;
  created_at: string;
  updated_at: string | null;
};

const url = Deno.env.get("SUPABASE_URL")!;
const key = Deno.env.get("SUPABASE_ANON_KEY")!;
const supabase = createClient(url, key);

export const getConfigs = async (): Promise<Config[] | null> => {
  const { error, data } = await supabase.from("configs")
    .select()
    .eq("active", true);

  if (error) {
    console.error(`[${jakartaTime()}][supabase] Error: ` + error);

    return null;
  }

  return data;
};

export const getGreeter = async (): Promise<Greeter | null> => {
  const { error, data } = await supabase.from("random_greeters")
    .select()
    .limit(1)
    .single();

  if (error) {
    console.error(`[${jakartaTime()}][supabase] Error: ` + error);

    return null;
  }

  return data;
};

export const getRandomGreeter = async (): Promise<Greeter | null> => {
  const { error, data } = await supabase.from("random_greeters")
    .select()
    .limit(1)
    .single();

  if (error) {
    console.error(`[${jakartaTime()}][supabase] Error: ` + error);

    return null;
  }

  return data;
};
