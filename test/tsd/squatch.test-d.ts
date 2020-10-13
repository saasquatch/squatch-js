import {
  expectType,
  expectError,
  expectAssignable,
  expectNotAssignable,
} from "tsd";
import squatch, { Widgets } from "../../";

/**
 * Error -- squatch has no property `foo`
 */
expectError(squatch.foo);

/**
 * Error -- squatch is not a function
 */
expectNotAssignable<() => unknown>(squatch);

/**
 * Success -- types are exported for the types that matter
 */
expectAssignable<{
  ready: unknown;
  init: unknown;
  api: unknown;
  widgets: unknown;
}>(squatch);

expectType<void>(squatch.init({ tenantAlias: "foo" }));

const user = {
  id: "abc_123",
  accountId: "abc_123",
  email: "john@example.com",
  firstName: "John",
  lastName: "Doe",
  locale: "en_US",
  referralCodes: {
    "program-id1": "JOHNDOECODE",
    "program-id2": "JOHNDOECODETWO",
  },
  referredByCodes: ["JANEDOE"],
};

const INIT = {
  user,
  engagementMedium: "EMBED" as const,
  widgetType: "/p/program-name/w/referrerWidget",
  jwt:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiYWJjXzEyMyIsImFjY291bnRJZCI6ImFiY18xMjMiLCJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJmaXJzdE5hbWUiOiJKb2huIiwibGFzdE5hbWUiOiJEb2UiLCJsb2NhbGUiOiJlbl9VUyIsInJlZmVycmVkQnlDb2RlcyI6WyJKQU5FRE9FIl19fQ.mlBQG0iaZuheMp4W4SmvmIMz7IiGWMpCzBQrABLLJgA",
};

const w = new Widgets({ tenantAlias: "foo" });

expectAssignable<Promise<{
  user?: unknown;
}> | null>(w.upsertUser(INIT));
