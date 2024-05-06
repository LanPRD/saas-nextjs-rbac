import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    GITHUB_OAUTH_CLIENT_ID: z.string(),
    GITHUB_OAUTH_CLIENT_SECRET: z.string(),
    GITHUB_OAUTH_CLIENT_REDIRECT_URI: z.string().url(),

    JWT_SCRET: z.string(),

    SERVER_PORT: z.coerce.number().default(3333)
  },
  client: {},
  shared: {},
  runtimeEnv: {
    GITHUB_OAUTH_CLIENT_ID: process.env.GITHUB_OAUTH_CLIENT_ID,
    GITHUB_OAUTH_CLIENT_SECRET: process.env.GITHUB_OAUTH_CLIENT_SECRET,
    GITHUB_OAUTH_CLIENT_REDIRECT_URI: process.env.GITHUB_OAUTH_CLIENT_REDIRECT_URI,

    JWT_SCRET: process.env.JWT_SCRET,

    SERVER_PORT: process.env.SERVER_PORT
  },
  emptyStringAsUndefined: true
});
