import { redirect } from "@remix-run/node";
import { authenticate, CREDIT_PACKAGE } from "../shopify.server";
import type { LoaderFunctionArgs } from "@remix-run/node";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { billing, session } = await authenticate.admin(request);
  let { shop } = session;
  let myShop = shop.replace(".myshopify.com", "");

  const url = new URL(request.url);
  const creditamount = url.searchParams.get('creditamount');
  console.log(creditamount);
 
  console.log(CREDIT_PACKAGE);

  await billing.require({
    plans: [CREDIT_PACKAGE],
    onFailure: async () => billing.request({
      plan: CREDIT_PACKAGE,
      amount: creditamount,
      isTest: true,
      returnUrl: `https://admin.shopify.com/store/${myShop}/apps/${process.env.APP_NAME}/app/plans`,
    }),
  });


  return null;
};