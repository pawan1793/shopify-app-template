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
    Button,
    TextField,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { getUserData, UserData } from "../lib/user.server";
import { useState } from "react";

interface LoaderData {
    userData: UserData | null;
    shop: string;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const { session } = await authenticate.admin(request);
    
    return { shop: session.shop };
};

export default function Index() {
    const { shop } = useLoaderData<LoaderData>();
    const [creditAmount, setCreditAmount] = useState<string>("100");
    const [error, setError] = useState<boolean>(false);

    const handleCreditAmountChange = (value: string) => {
        setCreditAmount(value);
        setError(false);
    };

    const calculatePrice = (credits: number) => {
        const basePrice = 0.20; // Price per credit
        const total = credits * basePrice;
        return total.toFixed(2);
    };

    return (
        <Page>
            <TitleBar title={`Dashboard - ${shop}`} />
            <BlockStack gap="500">
                <Layout>
                    <Layout.Section variant="oneHalf">
                        <Card>
                            <BlockStack gap="400">
                                <Layout.Section>
                                    <Card>
                                        <BlockStack gap="400">
                                            <Text as="h2" variant="headingMd">Credit Purchase</Text>
                                            <TextField
                                                label="Number of Credits"
                                                type="number"
                                                value={creditAmount}
                                                onChange={handleCreditAmountChange}
                                                autoComplete="off"
                                                min={1}
                                                error={error}
                                            />
                                            <Text as="h3" variant="headingXl">
                                                ${calculatePrice(parseInt(creditAmount) || 0)}
                                            </Text>
                                            <Text as="p" variant="bodySm">Price per credit: $0.20</Text>
                                            <BlockStack gap="200">
                                                <Text as="p" variant="bodyMd">✓ No expiration</Text>
                                                <Text as="p" variant="bodyMd">✓ Instant delivery</Text>
                                            </BlockStack>
                                            <Button
                                                variant="primary"
                                                url={"/app/credits-purchase?creditamount=" + creditAmount}
                                                disabled={!!error}
                                            >
                                                Purchase Credits
                                            </Button>
                                        </BlockStack>
                                    </Card>
                                </Layout.Section>
                            </BlockStack>
                        </Card>
                    </Layout.Section>

                </Layout>
            </BlockStack>
        </Page>
    );
}
