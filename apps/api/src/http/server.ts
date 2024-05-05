import fastifyCors from "@fastify/cors";
import { fastify } from "fastify";
import { ZodTypeProvider, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { createAccount } from "./routes/auth/create-account";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.register(fastifyCors);

app.register(createAccount);

app.listen({ port: 3333 }).then(() => {
  console.log("server is listening on port 3333");
});
