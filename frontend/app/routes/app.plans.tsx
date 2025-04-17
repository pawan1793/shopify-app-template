import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useSubmit } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  BlockStack,
  Button,
  InlineStack,
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate, BASIC_PLAN, PRO_PLAN, ANNUAL_PLAN } from "../shopify.server";
import { laravelAuth } from "../lib/laravelAuth";
import { json, redirect } from "@remix-run/node";
import { BillingInterval } from "@shopify/shopify-api";

interface Plan {
  id: string;
  name: string;
  price: number;
  url: string;
  features: string[];
  interval: string;
  shopify_plan_id: string;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session, billing } = await authenticate.admin(request);
  const plans = await laravelAuth.makeAuthenticatedRequest<Plan[]>('/plans', request);

  try {
    // Attempt to check if the shop has an active payment for any plan
    const billingCheck = await billing.require({
      plans: [BASIC_PLAN, ANNUAL_PLAN, PRO_PLAN],
      isTest: true,
      onFailure: () => {
        throw new Error('No active plan');
      },
    });

    // If the shop has an active subscription, log and return the details
    const subscription = billingCheck.appSubscriptions[0];
    console.log(subscription);
    console.log(`Shop is on ${subscription.name} (id ${subscription.id})`);
    return { shop: session.shop, plans, activeplan: subscription };

  } catch (error) {
    // If the shop does not have an active plan, return an empty plan object
    if (error.message === 'No active plan') {
      console.log('Shop does not have any active plans.');
      // return json({ billing, plan: { name: "Free" } });
      return { shop: session.shop, plans, activeplan: { name: "Free" } };
    }
    // If there is another error, rethrow it
    throw error;
  }


};


export default function PlansPage() {
  const { shop, plans,activeplan } = useLoaderData<typeof loader>();
  const submit = useSubmit();
  const shopify = useAppBridge();


  return (
    <Page>
      <TitleBar title={`Subscription Plans - ${shop}`} />
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Text as="h1" variant="headingXl">Choose Your Plan</Text>
            <Text as="p" variant="bodyLg">Select the plan that best fits your needs</Text>
          </Layout.Section>
          <Layout.Section>
            <InlineStack gap="400" align="space-around">
              {plans.map((plan: Plan) => (
                <Card key={plan.id}>
                  <BlockStack gap="400">
                    <Text as="h2" variant="headingMd">{plan.name}</Text>
                    <Text as="h3" variant="headingXl">${plan.price}</Text>
                    <Text as="p" variant="bodySm">per {plan.interval}</Text>
                    <BlockStack gap="200">
                      {plan.features.map((feature, index) => (
                        <Text key={index} as="p" variant="bodyMd">✓ {feature}</Text>
                      ))}
                    </BlockStack>

                    {plan.name == activeplan.name ? (
                      <Button
                        variant="primary"
                        url={"/app/cancel-subscription"}
                      >
                      Cancel Subscription
                    </Button>
                    ):(
                      <Button
                        variant="primary"
                        url={plan.url + "?plan=" + plan.shopify_plan_id}
                      >
                      Subscribe Now
                    </Button>
                    )}
                  </BlockStack>
                </Card>
              ))}
            </InlineStack>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}

