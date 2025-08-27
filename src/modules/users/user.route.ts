import container from "@/config/dependency";
import { FastifyInstance } from "fastify";
import UserController from "@/users/user.controller";

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
          email: { type: "string" },
          isMultiple: { type: "boolean" },
          lastCreatedAt: { type: "string", format: "date-time" },
        },
        additionalProperties: false,
      },
    },
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
          email: { type: "string" },
          password: { type: "string" },
        },
        required: ["userName", "email", "password"],
        additionalProperties: false,
      },
    },
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
          email: { type: "string" },
        },
        additionalProperties: false,
      },
    },
    handler: userController.delete.bind(userController),
  });
}
