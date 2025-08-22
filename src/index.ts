import "reflect-metadata";
import Fastify from "fastify";
import registerPlugins from "@/config/plugins";

async function server() {
  const app = Fastify({ logger: true });

  await registerPlugins(app);

  // await registerRoutes(app);

  app.setNotFoundHandler(
    {
      preHandler: app.rateLimit({
        max: 4,
        timeWindow: 500,
      }),
    },
    function (request, reply) {
      reply.code(404).send({ message: "Not Found" });
    }
  );

  app.listen({ port: Number(process.env.PORT) }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  });
}

server();
