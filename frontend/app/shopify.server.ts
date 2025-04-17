import "@shopify/shopify-app-remix/adapters/node";
import {
  ApiVersion,
  AppDistribution,
  shopifyApp,
  BillingInterval,
} from "@shopify/shopify-app-remix/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import prisma from "./db.server";

export type BillingPlan = 'Basic Plan' | 'Pro Plan' | 'Annual Plan' | 'Credit Package';

export const BASIC_PLAN: BillingPlan = 'Basic Plan';
export const PRO_PLAN: BillingPlan = 'Pro Plan';
export const ANNUAL_PLAN: BillingPlan = 'Annual Plan';
export const CREDIT_PACKAGE: BillingPlan = 'Credit Package';

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: ApiVersion.January25,
  scopes: process.env.SCOPES?.split(","),
  appUrl: process.env.SHOPIFY_APP_URL || "",
  authPathPrefix: "/auth",
  sessionStorage: new PrismaSessionStorage(prisma),
  distribution: AppDistribution.AppStore,
  billing: {
    [BASIC_PLAN]: {
      amount: 10,
      currencyCode: 'USD',
      interval: BillingInterval.Every30Days,
    },
    [PRO_PLAN]: {
      amount: 50,
      currencyCode: 'USD',
      interval: BillingInterval.Every30Days,
    },
    [ANNUAL_PLAN]: {
      amount: 100,
      currencyCode: 'USD',
      interval: BillingInterval.Annual,
    },
    [CREDIT_PACKAGE]: {
      amount: 1, // Base price per credit
      currencyCode: 'USD',
      interval: BillingInterval.OneTime,
    },
  },
  
  future: {
    unstable_newEmbeddedAuthStrategy: true,
    removeRest: true,
  },
  ...(process.env.SHOP_CUSTOM_DOMAIN
    ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] }
    : {}),
});

export default shopify;
export const apiVersion = ApiVersion.January25;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;
