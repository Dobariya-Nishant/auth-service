import container from "@/config/dependency";
import { FastifyInstance } from "fastify";
import AuthController from "@/auth/auth.controller";

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
          fullName: { type: "string" },
          profilePicture: { type: "string" },
          dateOfBirth: { type: "string", format: "date-time" },
        },
        additionalProperties: false,
      },
    },
    handler: authController.login.bind(authController),
  });

  app.route({
    method: "DELETE",
    url: `${prefixPath}/logout`,
    schema: {
      tags: ["Auth"],
      security: [{ bearerAuth: [] }],
    },
    handler: authController.logout.bind(authController),
  });
}
