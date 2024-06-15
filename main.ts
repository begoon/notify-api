import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();

const BOT_TOKEN = Deno.env.get("BOT_TOKEN");
const [teapot, me] = Deno.env.get("ME")?.split(":") || ["", ""];

if (!BOT_TOKEN) throw new Error("BOT_TOKEN is not set");

function people() {
  const pairs = Deno.env.get("PEOPLE")?.split(",");
  return Object.fromEntries(pairs?.map((person) => person.split(":")) ?? []);
}

console.log(people());

app.use("/*", cors());

app.get("/", (c) => c.text("ha?", 418));

app.get("/notify/:who/:message", async (c) => {
  if (c.req.header(teapot) != me) return c.text("tea?", 418);

  const who = c.req.param("who");
  const text = c.req.param("message");

  const result = await send(who, text, "text");
  return c.json(result, !result.ok ? 418 : 200);
});

app.post("/notify/:who", async (c) => {
  if (c.req.header(teapot) != me) return c.text("tea?", 418);

  const who = c.req.param("who");
  const body = await c.req.json();

  const { text, format } = body;
  const result = await send(who, text, format);
  return c.json(result, !result.ok ? 418 : 200);
});

async function send(who: string, message: string, format: string) {
  const recepient = people()[who];
  if (!recepient) return;
  console.log({ send: { who, recepient, message, format } });
  const telegramURL = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  const body = { chat_id: recepient, text: message, parse_mode: format };
  const response = await fetch(telegramURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return await response.json();
}

const port = Number(Deno.env.get("PORT") ?? 8000);
Deno.serve(
  { port, onListen: () => console.log("listening on", port) },
  app.fetch
);
