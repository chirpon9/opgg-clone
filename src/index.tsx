import { serve } from "bun";
import index from "./index.html";

const server = serve({
  routes: {
    "/api/hello": {
      async GET(req) {
        return Response.json({
          message: "Hello, world!",
          method: "GET",
        });
      },
      async PUT(req) {
        return Response.json({
          message: "Hello, world!",
          method: "PUT",
        });
      },
    },

    "/api/hello/:name": async req => {
      const name = req.params.name;
      return Response.json({
        message: `Hello, ${name}!`,
      });
    },

    "/api/riot/account/:gameName/:tagLine": async req => {
      const { gameName, tagLine } = req.params;
      const RIOT_API_KEY = process.env.RIOT_API_KEY;
      const url = `https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`;

      // @ts-ignore
      const riotRes = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
          "Accept-Language": "en-US,en;q=0.9,zh-TW;q=0.8,zh-CN;q=0.7,zh;q=0.6",
          "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
          "Origin": "https://developer.riotgames.com",
          "X-Riot-Token": RIOT_API_KEY,
        },
      });

      if (!riotRes.ok) {
        return new Response(JSON.stringify({ error: "Failed to fetch Riot account" }), {
          status: riotRes.status,
          headers: { "Content-Type": "application/json" },
        });
      }

      const data = await riotRes.json();
      return Response.json(data);
    },

    "/api/lol/champion-masteries/:puuid": async req => {
      const { puuid } = req.params;
      const RIOT_API_KEY = process.env.RIOT_API_KEY;
      const url = `https://oc1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${encodeURIComponent(puuid)}`;

      // @ts-ignore
      const riotRes = await fetch(url, {
        headers: {
          "X-Riot-Token": RIOT_API_KEY,
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
          "Accept-Language": "en-US,en;q=0.9,zh-TW;q=0.8,zh-CN;q=0.7,zh;q=0.6",
          "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
          "Origin": "https://developer.riotgames.com"
        },
      });

      if (!riotRes.ok) {
        return new Response(JSON.stringify({ error: "Failed to fetch Riot account" }), {
          status: riotRes.status,
          headers: { "Content-Type": "application/json" },
        });
      }

      const data = await riotRes.json();
      return Response.json(data);
    },

    // Serve index.html for all unmatched routes.
    "/*": index,
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});
