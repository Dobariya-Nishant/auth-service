import { FastifyInstance } from "fastify";
import fastifyEnv from "@fastify/env";
import fastifyCors from "@fastify/cors";
import fastifyCookie from "@fastify/cookie";
import fastifyRateLimit from "@fastify/rate-limit";
import fastifyMultipart from "@fastify/multipart";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifyOauth2 from "@fastify/oauth2";
import envSchema from "@/config/env";

export default async function registerPlugins(app: FastifyInstance) {
  await app.register(fastifyEnv, {
    dotenv: true,
    schema: envSchema,
    data: process.env,
  });

  await app.register(fastifyRateLimit, {
    max: 40,
    timeWindow: "1 minute",
    hook: "onRequest",
  });

  await app.register(fastifyCors, {
    origin: [process.env.ORIGIN as string],
    credentials: true,
    hook: "onRequest",
  });

  await app.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET,
    parseOptions: { httpOnly: true, secure: true, signed: true },
    hook: "onRequest",
  });

  await app.register(fastifyMultipart, {
    limits: {
      fieldNameSize: 100,
      fieldSize: 100,
      fields: 20,
      fileSize: 1000000,
      files: 10,
      headerPairs: 2000,
      parts: 1000,
    },
  });

  await app.register(fastifySwagger, {
    openapi: {
      info: {
        title: "Auth API",
        description: "API documentation for Auth Service",
        version: "1.0.0",
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
    },
  });

  await app.register(fastifySwaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      deepLinking: false,
    },
  });

  // await app.register(fastifyOauth2, {
  //   name: "googleOAuth2",
  //   scope: ["profile", "email"],
  //   credentials: {
  //     client: {
  //       id: process.env.GOOGLE_CLIENT_ID as string,
  //       secret: process.env.GOOGLE_CLIENT_SECRET as string,
  //     },
  //     auth: fastifyOauth2.GOOGLE_CONFIGURATION,
  //   },
  //   startRedirectPath: "/auth/login/google",
  //   callbackUri: process.env.GOOGLE_CALLBACK_URL as string,
  // });
}
