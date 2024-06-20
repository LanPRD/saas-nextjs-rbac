import { auth } from "@/http/middlewares/auth";
import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export async function getMemberShip(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      "/organization/:slug/membership",
      {
        schema: {
          tags: ["Organization"],
          summary: "Get user membersgip on organization",
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string()
          }),
          response: {
            200: z.object({
              membership: z.object({
                id: z.string().uuid(),
                role: z.string(),
                organizationId: z.string().uuid()
              })
            })
          }
        }
      },
      async (request, reply) => {
        const { slug } = request.params;
        const { membership } = await request.getUserMembership(slug);

        return {
          membership: {
            id: membership.id,
            role: membership.role,
            organizationId: membership.organizationId
          }
        };
      }
    );
}
