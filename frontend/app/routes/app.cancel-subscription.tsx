import { redirect } from "@remix-run/node";
import { authenticate, BASIC_PLAN, ANNUAL_PLAN, PRO_PLAN } from "../shopify.server";
import type { LoaderFunctionArgs } from "@remix-run/node";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { billing } = await authenticate.admin(request);
  const billingCheck = await billing.require({
    plans: [BASIC_PLAN, ANNUAL_PLAN, PRO_PLAN],
    onFailure: () => {
        throw new Error('No active plan');
    },
  });

  const subscription = billingCheck.appSubscriptions[0];
  const cancelledSubscription = await billing.cancel({
    subscriptionId: subscription.id,
    isTest: true,
    prorate: true,
   });

  // App logic
   return redirect("/app/plans");
};