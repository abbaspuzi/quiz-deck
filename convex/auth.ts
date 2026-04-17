import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex, crossDomain } from "@convex-dev/better-auth/plugins";
import { components } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";
import { betterAuth, type BetterAuthOptions } from "better-auth/minimal";
import authConfig from "./auth.config";

const siteUrl = process.env.VITE_SITE_URL!;
const extraOrigins = process.env.EXTRA_ORIGINS
  ? process.env.EXTRA_ORIGINS.split(",")
  : [];

export const authComponent = createClient<DataModel>(components.betterAuth);

export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth({
    trustedOrigins: [siteUrl, ...extraOrigins],
    database: authComponent.adapter(ctx),
    socialProviders: {
      google: {
        clientId: process.env.VITE_GOOGLE_CLIENT_ID!,
        clientSecret: process.env.VITE_GOOGLE_CLIENT_SECRET,
      },
    },
    plugins: [
      crossDomain({ siteUrl }),
      convex({ authConfig }),
    ],
  } satisfies BetterAuthOptions);
};

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    try {
      return await authComponent.getAuthUser(ctx);
    } catch {
      return null;
    }
  },
});
