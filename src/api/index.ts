import { FastifyInstance } from "fastify";
import authRoutes from "@/auth/auth.route";
import userRoutes from "@/users/user.route";

export default async function registerRoutes(app: FastifyInstance) {
  const routes = [
    { route: authRoutes, prefix: "/api/v1" },
    { route: userRoutes, prefix: "/api/v1" },
  ];

  for (const obj of routes) {
    await app.register(obj.route, { prefix: obj.prefix });
  }
}
