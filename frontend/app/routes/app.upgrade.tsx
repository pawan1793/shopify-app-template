import { redirect } from "@remix-run/node";
import { authenticate, BASIC_PLAN, ANNUAL_PLAN, PRO_PLAN } from "../shopify.server";
import type { LoaderFunctionArgs } from "@remix-run/node";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { billing, session } = await authenticate.admin(request);
  let { shop } = session;
  let myShop = shop.replace(".myshopify.com", "");

  const url = new URL(request.url);
  const plan = url.searchParams.get('plan');
  console.log(plan);
  let selectedplan = "BASIC_PLAN";
  if(plan == "BASIC_PLAN"){
    selectedplan = BASIC_PLAN;
  }else if(plan == "ANNUAL_PLAN"){
    selectedplan = ANNUAL_PLAN;
  }else if(plan == "PRO_PLAN"){
    selectedplan = PRO_PLAN;
  }

  await billing.require({
    plans: [selectedplan],
    onFailure: async () => billing.request({
      plan: selectedplan,
      isTest: true,
      prorate: true,
      returnUrl: `https://admin.shopify.com/store/${myShop}/apps/${process.env.APP_NAME}/app/plans`,
    }),
  });


  return null;
};