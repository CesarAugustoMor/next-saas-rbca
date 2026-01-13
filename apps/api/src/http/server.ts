import fastifyCors from "@fastify/cors";
import { fastify } from "fastify";
import { jsonSchemaTransform, serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod";
import { createAccount } from "./routes/auth/create-account";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifyJwt from "@fastify/jwt";
import { getProfile } from "./routes/auth/get-profile";
import { authenticateWithPassword } from "./routes/auth/authenticate-with-password";
import { errorHandler } from "./error-handler";


const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.setErrorHandler(errorHandler);

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'NextJs SaaS',
      description: 'Full-stack NextJs SaaS application with authentication, payments, and more.',
      version: '1.0.0',
    },
    servers: [],
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
});

app.register(fastifyJwt, {
  secret: 'my-jwt-secret',
});

app.register(fastifyCors)

app.register(createAccount)
app.register(authenticateWithPassword)
app.register(getProfile)

app.listen({ port: 3333 }).then(() => {
  console.log("Server is running on http://localhost:3333");
});