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

  app.get("/robots.txt", (req, res) => {
    res.type("text/plain");
    const baseUrl = process.env.APP_URL || "https://globalsms-hub.com";
    res.send(`User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${baseUrl}/sitemap.xml`);
  });

  app.get("/sitemap.xml", async (req, res) => {
    res.type("application/xml");
    const baseUrl = process.env.APP_URL || "https://globalsms-hub.com";
    const date = new Date().toISOString().split('T')[0];
    
    // Blog posts
    const blogPosts = [
      "privacy-virtual-numbers",
      "why-bypass-otp",
      "staying-safe-online"
    ];

    // Top countries
    const topCountries = ["USA", "UK", "Canada", "France", "Germany", "Netherlands", "Spain", "Italy", "Sweden", "Finland", "Denmark", "Poland", "Russia", "Australia"];
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    
    // Main Pages
    xml += `  <url><loc>${baseUrl}/</loc><lastmod>${date}</lastmod><priority>1.0</priority></url>\n`;
    xml += `  <url><loc>${baseUrl}/blog</loc><lastmod>${date}</lastmod><priority>0.8</priority></url>\n`;
    xml += `  <url><loc>${baseUrl}/countries</loc><lastmod>${date}</lastmod><priority>0.8</priority></url>\n`;
    xml += `  <url><loc>${baseUrl}/about</loc><lastmod>${date}</lastmod><priority>0.7</priority></url>\n`;
    xml += `  <url><loc>${baseUrl}/privacy</loc><lastmod>${date}</lastmod><priority>0.5</priority></url>\n`;
    xml += `  <url><loc>${baseUrl}/contact</loc><lastmod>${date}</lastmod><priority>0.5</priority></url>\n`;
    
    // Blog Posts
    blogPosts.forEach(id => {
      xml += `  <url><loc>${baseUrl}/blog/${id}</loc><lastmod>${date}</lastmod><priority>0.7</priority></url>\n`;
    });

    // Country Pages
    topCountries.forEach(country => {
      xml += `  <url><loc>${baseUrl}/countries?search=${encodeURIComponent(country)}</loc><lastmod>${date}</lastmod><priority>0.6</priority></url>\n`;
    });

    // Numbers (Dynamic)
    try {
      const allNumbersPromises = Object.values(configs).map(config => getNumbers(config).catch(() => []));
      const results = await Promise.all(allNumbersPromises);
      const allNumbers = results.flat();
      
      // Limit to 200 numbers to keep sitemap manageable
      allNumbers.slice(0, 200).forEach(num => {
        const url = `${baseUrl}/messages?number=${encodeURIComponent(num.number)}&country=${encodeURIComponent(num.country)}&link=${encodeURIComponent(num.link)}&siteId=${encodeURIComponent(num.siteId)}`;
        xml += `  <url><loc>${url.replace(/&/g, '&amp;')}</loc><lastmod>${date}</lastmod><priority>0.4</priority></url>\n`;
      });
    } catch (e) {
      console.error("Sitemap numbers error:", e);
    }

    xml += `</urlset>`;
    res.send(xml);
  });

  app.get("/api/blog", (req, res) => {
    res.json([
      {
        id: "privacy-virtual-numbers",
        title: "How to use virtual numbers for privacy",
        excerpt: "Learn how to protect your personal information by using temporary virtual numbers for online registrations.",
        date: "March 8, 2026",
        author: "Privacy Expert"
      },
      {
        id: "why-bypass-otp",
        title: "Why bypass OTP? The security implications",
        excerpt: "Understanding why users choose to bypass OTP and how to stay safe while doing so.",
        date: "March 7, 2026",
        author: "Security Analyst"
      },
      {
        id: "staying-safe-online",
        title: "Staying safe online: A comprehensive guide",
        excerpt: "Best practices for maintaining your digital footprint and avoiding common online scams.",
        date: "March 6, 2026",
        author: "Web Safety Team"
      }
    ]);
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
