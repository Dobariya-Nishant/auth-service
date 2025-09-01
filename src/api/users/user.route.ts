import container from "@/config/dependency";
import { FastifyInstance } from "fastify";
import UserController from "@/users/user.controller";
import authenticate from "@/core/middlewares/auth";

export default async function userRoutes(app: FastifyInstance) {
  const userController = container.resolve<UserController>("UserController");

  const prefixPath = "/users";

  app.route({
    method: "GET",
    url: `${prefixPath}`,
    schema: {
      tags: ["User"],
      security: [{ bearerAuth: [] }],
      querystring: {
        type: "object",
        properties: {
          userId: { type: "string" },
          userName: { type: "string" },
          email: { type: "string", format: "email" },
          isMultiple: { type: "boolean" },
          lastCreatedAt: { type: "string", format: "date-time" },
        },
        additionalProperties: false,
      },
    },
    preHandler: [authenticate],
    handler: userController.get.bind(userController),
  });

  app.route({
    method: "POST",
    url: `${prefixPath}`,
    schema: {
      tags: ["User"],
      security: [{ bearerAuth: [] }],
      body: {
        type: "object",
        properties: {
          fullName: { type: "string" },
          profilePicture: { type: "string" },
          dateOfBirth: { type: "string", format: "date-time" },
          userName: { type: "string" },
          email: { type: "string", format: "email" },
          password: { type: "string" },
        },
        required: ["userName", "email", "password"],
        additionalProperties: false,
      },
    },
    preHandler: [authenticate],
    handler: userController.create.bind(userController),
  });

  app.route({
    method: "PATCH",
    url: `${prefixPath}`,
    schema: {
      tags: ["User"],
      security: [{ bearerAuth: [] }],
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
    preHandler: [authenticate],
    handler: userController.update.bind(userController),
  });

  app.route({
    method: "DELETE",
    url: `${prefixPath}`,
    schema: {
      tags: ["User"],
      security: [{ bearerAuth: [] }],
      body: {
        type: "object",
        properties: {
          userId: { type: "string" },
          userName: { type: "string" },
          email: { type: "string", format: "email" },
        },
        additionalProperties: false,
      },
    },
    preHandler: [authenticate],
    handler: userController.delete.bind(userController),
  });
}
