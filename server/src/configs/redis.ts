import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL! || "redis://localhost:6379",
  legacyMode: false,
});

redisClient.connect().catch(console.error);

redisClient.on("error", (err) => console.log("Redis Client Error", err));
redisClient.on("connect", () => console.log("Redis Client Connected"));

export { redisClient };
