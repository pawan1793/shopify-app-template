import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getUserData } from "../lib/user.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userData = await getUserData(request);
  return json({ userData });
}; 