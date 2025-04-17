import { redirect } from "@remix-run/node";
import { authenticate, CREDIT_PACKAGE, CREDIT_PACKAGE } from "../shopify.server";
import type { LoaderFunctionArgs } from "@remix-run/node";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { billing, session } = await authenticate.admin(request);
  let { shop } = session;
  let myShop = shop.replace(".myshopify.com", "");

  const url = new URL(request.url);
  const creditamount = url.searchParams.get('creditamount');
  console.log(creditamount);
 

  await billing.request({
    plan: CREDIT_PACKAGE,
    isTest: true,
    prorate: true,
    amount: creditamount,
    returnUrl: `https://admin.shopify.com/store/${myShop}/apps/${process.env.APP_NAME}/app/plans`,
  })
 

  return null;
};