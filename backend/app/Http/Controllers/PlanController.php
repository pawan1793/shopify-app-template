<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Thalia\ShopifyRestToGraphql\Endpoints\RecurringApplicationChargesEndpoints;
class PlanController extends Controller
{
    /**
     * Get all available plans
     */
    public function getPlans(): JsonResponse
    {
        $plans = [
            [
                'id' => 1,
                'name' => 'Basic Plan',
                'price' => 9.99,
                "url"=>"/app/upgrade",
                'features' => ['Feature 1', 'Feature 2'],
                'description' => 'Basic plan for small businesses',
                'shopify_plan_id' => 'BASIC_PLAN',
            ],
            [
                'id' => 2,
                'name' => 'Pro Plan',
                'price' => 19.99,
                "url"=>"/app/upgrade",
                'features' => ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4'],
                'description' => 'Pro plan for growing businesses',
                'shopify_plan_id' => 'PRO_PLAN',
            ],
            [
                'id' => 3,
                'name' => 'Enterprise Plan',
                'price' => 49.99,
                "url"=>"/app/upgrade",
                'features' => ['All Features', 'Priority Support', 'Custom Integration'],
                'description' => 'Enterprise plan for large businesses',
                'shopify_plan_id' => 'ANNUAL_PLAN',
            ]
        ];

        return response()->json($plans);
    }

    /**
     * Subscribe to a plan
     */
    public function subscribe(Request $request, int $planId): JsonResponse
    {
        Log::info($planId);
        // Validate the request
        $user = $request->user();
        $shop = $user->name;
        $accesstoken = $user->access_token;
        Log::info($shop);
        Log::info($accesstoken);
        Log::info($user);
        $price = 10;
        $test = true;
        $trialdays = 7;
        $params = array(
            "recurring_application_charge" => array(
                "name" => "Maintenance Plan",
                "price" => $price,
                "return_url" => env('APP_URL') . "plan-redirect?&action=rcharge&chargeshop=" . $shop . '&user=' . $user->id . '&tid=' . $accesstoken . '&planamount=' . $price,
                "test" => $test,
                "url"=>"/app/upgrade",
                "trial_days" => $trialdays,

            )
        );


        $chargeshopifygl = new RecurringApplicationChargesEndpoints($shop, $accesstoken);
        $charges = $chargeshopifygl->appSubscriptionCreate($params);
     
        return response()->json(['confirmationUrl' => $charges['confirmation_url']]);
    }
} 