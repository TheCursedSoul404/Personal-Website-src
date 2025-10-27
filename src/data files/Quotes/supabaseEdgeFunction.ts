import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"));

Deno.serve(async ()=>{
  // Call the SQL function we just made
  const { data, error } = await supabase.rpc("get_random_quote");
  if (error) {
    console.error("Supabase RPC error:", error);
    return new Response(JSON.stringify({
      error
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
  return new Response(JSON.stringify(data && data[0] ? data[0] : {
    quote: null
  }), {
    headers: {
      "Content-Type": "application/json"
    }
  });
});
