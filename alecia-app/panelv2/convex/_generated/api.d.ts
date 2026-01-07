/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as actions_finance from "../actions/finance.js";
import type * as actions_intelligence from "../actions/intelligence.js";
import type * as actions_microsoft from "../actions/microsoft.js";
import type * as actions_openai from "../actions/openai.js";
import type * as auth_utils from "../auth_utils.js";
import type * as cms from "../cms.js";
import type * as crm from "../crm.js";
import type * as deals from "../deals.js";
import type * as matchmaker from "../matchmaker.js";
import type * as mutations from "../mutations.js";
import type * as pipedrive from "../pipedrive.js";
import type * as queries from "../queries.js";
import type * as seed from "../seed.js";
import type * as seed_cms from "../seed_cms.js";
import type * as voice from "../voice.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "actions/finance": typeof actions_finance;
  "actions/intelligence": typeof actions_intelligence;
  "actions/microsoft": typeof actions_microsoft;
  "actions/openai": typeof actions_openai;
  auth_utils: typeof auth_utils;
  cms: typeof cms;
  crm: typeof crm;
  deals: typeof deals;
  matchmaker: typeof matchmaker;
  mutations: typeof mutations;
  pipedrive: typeof pipedrive;
  queries: typeof queries;
  seed: typeof seed;
  seed_cms: typeof seed_cms;
  voice: typeof voice;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
