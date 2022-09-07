import { serve } from "https://deno.land/std@0.131.0/http/server.ts";

import { execute } from "./service.ts";
import { corsHeaders } from "../_shared/utils.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const results = await execute();

    return new Response(
      JSON.stringify(results),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200.,
      },
    );
  } catch (error) {
    return new Response(
      error,
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      },
    );
  }
});
