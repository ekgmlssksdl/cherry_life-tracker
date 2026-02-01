import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-1427e4c0/health", (c) => {
  return c.json({ status: "ok" });
});

// Get all app data
app.get("/make-server-1427e4c0/data", async (c) => {
  try {
    const [todos, exercises, catCares, dayLogs, events, supplementItems, supplements, languageItems, languageStudies] = await Promise.all([
      kv.get("todos"),
      kv.get("exercises"),
      kv.get("catCares"),
      kv.get("dayLogs"),
      kv.get("events"),
      kv.get("supplementItems"),
      kv.get("supplements"),
      kv.get("languageItems"),
      kv.get("languageStudies"),
    ]);

    return c.json({
      todos: todos || [],
      exercises: exercises || [],
      catCares: catCares || [],
      dayLogs: dayLogs || [],
      events: events || [],
      supplementItems: supplementItems || null,
      supplements: supplements || [],
      languageItems: languageItems || null,
      languageStudies: languageStudies || [],
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return c.json({ error: error.message }, 500);
  }
});

// Save todos
app.post("/make-server-1427e4c0/todos", async (c) => {
  try {
    const body = await c.req.json();
    await kv.set("todos", body.todos);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error saving todos:", error);
    return c.json({ error: error.message }, 500);
  }
});

// Save exercises
app.post("/make-server-1427e4c0/exercises", async (c) => {
  try {
    const body = await c.req.json();
    await kv.set("exercises", body.exercises);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error saving exercises:", error);
    return c.json({ error: error.message }, 500);
  }
});

// Save cat cares
app.post("/make-server-1427e4c0/cat-cares", async (c) => {
  try {
    const body = await c.req.json();
    await kv.set("catCares", body.catCares);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error saving cat cares:", error);
    return c.json({ error: error.message }, 500);
  }
});

// Save day logs
app.post("/make-server-1427e4c0/day-logs", async (c) => {
  try {
    const body = await c.req.json();
    await kv.set("dayLogs", body.dayLogs);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error saving day logs:", error);
    return c.json({ error: error.message }, 500);
  }
});

// Save events
app.post("/make-server-1427e4c0/events", async (c) => {
  try {
    const body = await c.req.json();
    await kv.set("events", body.events);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error saving events:", error);
    return c.json({ error: error.message }, 500);
  }
});

// Save supplement items
app.post("/make-server-1427e4c0/supplement-items", async (c) => {
  try {
    const body = await c.req.json();
    await kv.set("supplementItems", body.supplementItems);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error saving supplement items:", error);
    return c.json({ error: error.message }, 500);
  }
});

// Save supplements
app.post("/make-server-1427e4c0/supplements", async (c) => {
  try {
    const body = await c.req.json();
    await kv.set("supplements", body.supplements);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error saving supplements:", error);
    return c.json({ error: error.message }, 500);
  }
});

// Save language items
app.post("/make-server-1427e4c0/language-items", async (c) => {
  try {
    const body = await c.req.json();
    await kv.set("languageItems", body.languageItems);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error saving language items:", error);
    return c.json({ error: error.message }, 500);
  }
});

// Save language studies
app.post("/make-server-1427e4c0/language-studies", async (c) => {
  try {
    const body = await c.req.json();
    await kv.set("languageStudies", body.languageStudies);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error saving language studies:", error);
    return c.json({ error: error.message }, 500);
  }
});

Deno.serve(app.fetch);