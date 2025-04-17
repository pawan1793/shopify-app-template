import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  BlockStack,
  InlineStack,
  Badge,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { getUserData, UserData } from "../lib/user.server";

interface LoaderData {
  userData: UserData | null;
  shop: string;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const userData = await getUserData(request);
  return { shop: session.shop, userData };
};

export default function Index() {
  const { userData, shop } = useLoaderData<LoaderData>();

  return (
    <Page>
      <TitleBar title={`Dashboard - ${shop}`} />
      <BlockStack gap="500">
        <Layout>
          <Layout.Section variant="oneHalf">
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">Shop Overview</Text>
                <InlineStack gap="400">
                  <Card>
                    <BlockStack gap="200">
                      <Text as="p" variant="bodySm">Total Products</Text>
                      <Text as="h2" variant="headingXl">24</Text>
                      <Badge tone="success">+12%</Badge>
                    </BlockStack>
                  </Card>
                  <Card>
                    <BlockStack gap="200">
                      <Text as="p" variant="bodySm">Active Users</Text>
                      <Text as="h2" variant="headingXl">156</Text>
                      <Badge tone="success">+8%</Badge>
                    </BlockStack>
                  </Card>
                </InlineStack>
              </BlockStack>
            </Card>
          </Layout.Section>
          <Layout.Section variant="oneHalf">
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">Recent Activity</Text>
                <BlockStack gap="200">
                  <InlineStack align="space-between">
                    <Text as="p">New product added</Text>
                    <Text as="p" variant="bodySm">2 hours ago</Text>
                  </InlineStack>
                  <InlineStack align="space-between">
                    <Text as="p">User login</Text>
                    <Text as="p" variant="bodySm">4 hours ago</Text>
                  </InlineStack>
                  <InlineStack align="space-between">
                    <Text as="p">Order processed</Text>
                    <Text as="p" variant="bodySm">6 hours ago</Text>
                  </InlineStack>
                </BlockStack>
              </BlockStack>
            </Card>
          </Layout.Section>
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">System Status</Text>
                <InlineStack gap="400">
                  <Badge tone="success">API Connected</Badge>
                  <Badge tone="success">Database Online</Badge>
                  <Badge tone="success">Sync Active</Badge>
                </InlineStack>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
