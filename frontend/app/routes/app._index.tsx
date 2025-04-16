import { useEffect } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  Box,
  List,
  Link,
  InlineStack,
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { getUserData, UserData } from "../lib/user.server";

interface LoaderData {
  userData: UserData | null;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  const userData = await getUserData();
  return { userData };
};

export default function Index() {
  const shopify = useAppBridge();
  const { userData } = useLoaderData<LoaderData>();

  function generateToast(content: string) {
    shopify.toast.show(content);
  }

  return (
    <Page>
      <TitleBar title="Thalia App Template">
      </TitleBar>
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              {userData ? (
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">User Details</Text>
                  <Text as="p">Name: {userData.user.name}</Text>
                  <Text as="p">Email: {userData.user.email}</Text>
                  <Text as="p">Shop ID: {userData.user.id}</Text>
                  <Text as="p">Created: {new Date(userData.user.created_at).toLocaleDateString()}</Text>
                  {userData.user.email_verified_at && (
                    <Text as="p">Email Verified: {new Date(userData.user.email_verified_at).toLocaleDateString()}</Text>
                  )}
                </BlockStack>
              ) : (
                <Text as="p">Failed to load user data</Text>
              )}
              <Button onClick={() => generateToast('test toatsttt')}>Test</Button>
            </Card>
          </Layout.Section>
          <Layout.Section variant="oneThird">
            <BlockStack gap="500">
              <Card>
               
              </Card>
              <Card>
               
              </Card>
            </BlockStack>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
