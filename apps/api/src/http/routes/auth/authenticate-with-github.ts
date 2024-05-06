// For more information: https://docs.github.com/pt/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps
// https://github.com/login/oauth/authorize?client_id=Ov23liEduheiZK9UG1SQ&client_secret=91f7a91b871c3b159d25ee229df8cee8acffabba&redirect_uri=http://localhost:3000/api/auth/callback&scope=user:email
// code = 3613c74c954308792b62

import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { BadRequestError } from "../_errors/bad-request-error";
import { prisma } from "@/lib/prisma";
import { env } from "@saas-monorepo/env";

export async function authenticateWithGithub(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/session/github",
    {
      schema: {
        tags: ["Auth"],
        summary: "Authenticate with GitHub.",
        body: z.object({
          code: z.string()
        }),
        response: {
          201: z.object({ token: z.string() })
        }
      }
    },
    async (request, reply) => {
      const { code } = request.body;

      const githubOAuthURL = new URL("https://github.com/login/oauth/access_token");

      githubOAuthURL.searchParams.set("client_id", env.GITHUB_OAUTH_CLIENT_ID);
      githubOAuthURL.searchParams.set("client_secret", env.GITHUB_OAUTH_CLIENT_SECRET);
      githubOAuthURL.searchParams.set("redirect_uri", env.GITHUB_OAUTH_CLIENT_REDIRECT_URI);
      githubOAuthURL.searchParams.set("code", code);

      const githubAccessTokenResponse = await fetch(githubOAuthURL, {
        method: "POST",
        headers: { Accept: "application/json" }
      });

      const githubAccessTokenData = await githubAccessTokenResponse.json();

      const { access_token: githubAccessToken } = z
        .object({
          access_token: z.string(),
          token_type: z.literal("bearer"),
          scope: z.string()
        })
        .parse(githubAccessTokenData);

      const githubUserResponse = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${githubAccessToken}`
        }
      });

      const githubUserData = await githubUserResponse.json();

      const {
        avatar_url: avatarUrl,
        id: githubId,
        email,
        name
      } = z
        .object({
          id: z.number().int().transform(String),
          avatar_url: z.string().url(),
          name: z.string().nullable(),
          email: z.string().email().nullable()
        })
        .parse(githubUserData);

      if (email === null) {
        throw new BadRequestError("Your GitHub account must have an email to authenticate.");
      }

      let user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        user = await prisma.user.create({
          data: { email, name, avatarUrl }
        });
      }

      let account = await prisma.account.findUnique({
        where: {
          provider_userId: {
            provider: "GITHUB",
            userId: user.id
          }
        }
      });

      if (!account) {
        account = await prisma.account.create({
          data: {
            provider: "GITHUB",
            providerAccountId: githubId,
            userId: user.id
          }
        });
      }

      const token = await reply.jwtSign({ sub: user.id }, { sign: { expiresIn: "7d" } });

      return reply.status(201).send({ token });
    }
  );
}
