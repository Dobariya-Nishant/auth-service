import container from "@/config/dependency";
import { FastifyInstance } from "fastify";
import AuthController from "@/auth/auth.controller";
import authenticate from "@/core/middlewares/auth";

export default async function authRoutes(app: FastifyInstance) {
  const authController = container.resolve<AuthController>("AuthController");

  const prefixPath = "/auth";

  app.route({
    method: "POST",
    url: `${prefixPath}/sign-up`,
    schema: {
      tags: ["Auth"],
      body: {
        type: "object",
        properties: {
          fullName: { type: "string" },
          profilePicture: { type: "string" },
          dateOfBirth: { type: "string", format: "date-time" },
          userName: { type: "string" },
          email: { type: "string" },
          password: { type: "string" },
        },
        required: ["userName", "email", "password"],
        additionalProperties: false,
      },
    },
    handler: authController.signUp.bind(authController),
  });

  app.route({
    method: "POST",
    url: `${prefixPath}/login`,
    schema: {
      tags: ["Auth"],
      body: {
        type: "object",
        properties: {
          userName: { type: "string" },
          email: { type: "string" },
          password: { type: "string" },
        },
        additionalProperties: false,
      },
    },
    handler: authController.login.bind(authController),
  });

  app.route({
    method: "POST",
    url: `${prefixPath}/refresh`,
    schema: {
      tags: ["Auth"],
      security: [{ bearerAuth: [] }],
    },
    handler: authController.refresh.bind(authController),
  });

  app.route({
    method: "DELETE",
    url: `${prefixPath}/logout`,
    schema: {
      tags: ["Auth"],
      security: [{ bearerAuth: [] }],
    },
    preHandler: [authenticate],
    handler: authController.logout.bind(authController),
  });
}
