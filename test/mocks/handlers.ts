import { rest } from "msw";

export const PASSWORDLESS = "PASSWORDLESS_WIDGET";
export const VERIFIED = "VERIFIED_WIDGET";

export const handlers = [
  rest.put(
    "https://staging.referralsaasquatch.com/api/v1/:tenantAlias/widget/account/:accountId/user/:userId/upsert",
    (req, res, ctx) => {
      const widgetType = req.url.searchParams.get("widgetType");
      const engagementMedium = req.url.searchParams.get("engagementMedium");
      const { tenantAlias, userId, accountId } = req.params;

      if (!tenantAlias || !userId || !accountId) {
        return res(ctx.status(400));
      }

      if (tenantAlias === "INVALID_TENANT_ALIAS") return res(ctx.status(400));

      return res(
        ctx.status(200),
        ctx.json({
          template: `<span>${VERIFIED}, ${engagementMedium}, ${widgetType}</span>`,
        })
      );
    }
  ),
  rest.post(
    "https://staging.referralsaasquatch.com/api/v1/:tenantAlias/graphql",
    (req, res, ctx) => {
      const { query, variables } = req.body as {
        query: string;
        variables: any;
      };
      const hasUser = variables["user"] !== null;

      if (req.params.tenantAlias === "INVALID_TENANT_ALIAS")
        return res(ctx.status(400));

      if (query.includes("renderWidget")) {
        return res(
          ctx.status(200),
          ctx.json({
            data: {
              renderWidget: {
                template: `<p>${hasUser ? VERIFIED : PASSWORDLESS}, ${
                  variables["engagementMedium"]
                }, ${variables["widgetType"]}</p>`,
              },
            },
          })
        );
      }

      return res(ctx.status(400));
    }
  ),
];
