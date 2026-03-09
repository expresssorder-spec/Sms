import express from "express";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import { getNumbers, getMessages } from "./src/scraper/index.js";
import { configs } from "./src/scraper/config.js";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/configs", (req, res) => {
    res.json(Object.keys(configs).map(key => ({
        id: key,
        name: configs[key].name
    })));
  });

  app.get("/api/numbers", async (req, res) => {
    try {
      const promises = Object.values(configs).map(config => 
        getNumbers(config).catch(e => {
          console.error(`Failed to scrape ${config.name}:`, e.message);
          return []; // Return empty array on failure so Promise.all doesn't crash
        })
      );
      const results = await Promise.all(promises);
      const allNumbers = results.flat();
      res.json(allNumbers);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
    }
  });

  app.get("/api/messages", async (req, res) => {
    try {
      const siteId = req.query.siteId as string;
      const numberUrl = req.query.url as string;
      
      if (!siteId || !configs[siteId]) {
        return res.status(400).json({ error: "Invalid or missing siteId" });
      }
      if (!numberUrl) {
        return res.status(400).json({ error: "Missing url parameter" });
      }

      const messages = await getMessages(numberUrl, configs[siteId]);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
