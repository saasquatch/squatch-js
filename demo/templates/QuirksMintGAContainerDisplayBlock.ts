export default {
  template:
    '<html>  <head>    <script type="text/javascript">      window.widgetIdent = {"programId":"klip-referral-program","userId":"sam+klip@saasquat.ch","accountId":"sam+klip@saasquat.ch","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImFjY291bnRJZCI6InNhbStrbGlwQHNhYXNxdWF0LmNoIiwiaWQiOiJzYW0ra2xpcEBzYWFzcXVhdC5jaCIsImVtYWlsIjoic2FtK2tsaXBAc2Fhc3F1YXQuY2gifX0.GiaY8wwQdpUoVRnp_AV7uys3MsYsMzKUkdnZgUb0wYU","tenantAlias":"test_a74miwdpofztj","engagementMedium":"EMBED","appDomain":"https://staging.referralsaasquatch.com"};    </script>          <link rel="stylesheet" type="text/css" href="https://fast-staging.ssqt.io/npm/@saasquatch/mint-components@1.3.2-17/dist/mint-components/mint-components.css">          <script src="https://fast-staging.ssqt.io/npm/@saasquatch/bedrock-components@1.2.0/dist/bedrock-components/bedrock-components.js"></script>          <script src="https://fast-staging.ssqt.io/npm/@saasquatch/mint-components@1.3.2-17/dist/mint-components/mint-components.js"></script>            <script src="https://fast-staging.ssqt.io/npm/@elastic/apm-rum@4.0.1/dist/bundles/elastic-apm-rum.umd.min.js" crossorigin></script>    <script>      window.apm = elasticApm.init({        serviceName: \'programwidget-staging\',        serverUrl: \'https://1c9081d2ac2d43548254f581dca2dbee.apm.us-central1.gcp.cloud.es.io:443\',        active: Math.random() < 0.1      })    </script>      </head>  <body>    <sqm-portal-container class="squatch-container" direction="column" padding="small" gap="xxxx-large" style="display:block;"><sqm-portal-container direction="column" padding="none" gap="xxx-large"><sqm-titled-section padding="none" label-margin="x-large"><sqm-text slot="label"><h2>Partner and Profit</h2></sqm-text><sqm-text slot="content"><p>          Get rewarded for referring potential customers to Klip and for          completing loyalty objectives!        </p></sqm-text></sqm-titled-section><sqm-titled-section label-margin="small" padding="none"><sqm-text slot="label"><h3>Share your referral link</h3></sqm-text><sqm-share-link slot="content"> </sqm-share-link></sqm-titled-section><sqm-titled-section label-margin="small" padding="none"><sqm-text slot="label"><h3>Share via social media</h3></sqm-text><sqm-portal-container slot="content" direction="row" padding="none" gap="xxx-large" min-width="160px"><sqm-share-button icon="envelope" medium="email" size="medium" pill="true">Email a friend        </sqm-share-button><sqm-share-button medium="twitter" size="medium" pill="true">Tweet about us        </sqm-share-button><sqm-share-button medium="facebook" size="medium" pill="true">Share on Facebook        </sqm-share-button></sqm-portal-container></sqm-titled-section></sqm-portal-container><sqm-portal-container direction="column" padding="none" gap="xx-large"><sqm-titled-section padding="none" label-margin="none"><sqm-text slot="label"><h2>Referrals And Rewards</h2></sqm-text></sqm-titled-section><sqm-stat-container space="xxxx-large"><sqm-big-stat flex-reverse="true" alignment="left" stat-type="/referralsCount"><sqm-text><p>Referrals</p></sqm-text></sqm-big-stat><sqm-big-stat flex-reverse="true" alignment="left" stat-type="/integrationRewardsCountFiltered/AVAILABLE"><sqm-text><p>Giftcards Earned</p></sqm-text></sqm-big-stat><sqm-big-stat flex-reverse="true" alignment="left" stat-type="/rewardBalance/CREDIT/POINT/global"><sqm-text><p>Points Balance</p></sqm-text></sqm-big-stat></sqm-stat-container><div id="i5i16c"><sqm-task-card reward-amount="50" card-title="Refer a friends" description="Invite your friends to klip and get rewarded when they signup for a free trial or contact our sales team for an enterprise license" button-text="Start Referring" button-link="https://klip-staging.vercel.app/app/invite-friends" goal="1">      </sqm-task-card><sqm-task-card reward-amount="50" goal="10" repeatable="" show-progress-bar="true" steps="true" card-title="Record 10 Hours of Video" description="Get rewarded for recording and uploading 10 hours of video on Klip each time you do it. Let us reward you for being a super user!" button-text="Record" button-link="https://klip-staging.vercel.app/app" stat-type="/customFields/videoHoursCount">      </sqm-task-card><sqb-program-section program-id="klip-loyalty"><sqm-task-card reward-amount="10" goal="1" repeatable="true" card-title="Upload a Video" description="Upload a video and get rewarded for exploring the functionality of Klip!" button-text="Upload" button-link="https://klip-staging.vercel.app/app" stat-type="/programGoals/count/Upload-Video">        </sqm-task-card></sqb-program-section><sqm-task-card reward-amount="50" goal="500" show-progress-bar="true" card-title="Spend 500$ on Klip Products" description="Let us reward you for being a loyal Klip customer! Spend 500$ on seats or licenses and get rewarded." button-text="See Plans" button-link="https://klip-staging.vercel.app/app/plans" stat-type="/customFields/purchaseTotal">      </sqm-task-card></div><sl-tab-group><sl-tab slot="nav" panel="referralHistory">Referral History </sl-tab><sl-tab slot="nav" panel="rewardHistory">Reward History </sl-tab><sl-tab slot="nav" panel="rewardExchange">Reward Exchange </sl-tab><sl-tab-panel name="referralHistory"><sqm-referral-table><sqm-referral-table-user-column column-title="User">          </sqm-referral-table-user-column><sqm-referral-table-status-column column-title="Referral Status">          </sqm-referral-table-status-column><sqm-referral-table-rewards-column>          </sqm-referral-table-rewards-column><sqm-referral-table-date-column column-title="Date Referred" date-shown="dateReferralStarted">          </sqm-referral-table-date-column></sqm-referral-table></sl-tab-panel><sl-tab-panel name="rewardHistory"><sqb-program-section program-id=""><sqm-rewards-table><sqm-rewards-table-column></sqm-rewards-table-column></sqm-rewards-table></sqb-program-section></sl-tab-panel><sl-tab-panel name="rewardExchange"><sqm-reward-exchange-list not-available-error="{unavailableReason, select, US_TAX {US Tax limit} INSUFFICIENT_REDEEMABLE_CREDIT {Not enough points} TESTING {JSONata special case} other {Not available} }"></sqm-reward-exchange-list></sl-tab-panel></sl-tab-group></sqm-portal-container></sqm-portal-container><style>* { box-sizing: border-box; } body {margin: 0;}#i5i16c{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:auto auto;grid-gap:10px;grid-auto-flow:column;}:root{--sqm-portal-background: white;--sl-color-primary-50: #e8e5f8;--sl-color-primary-100: #c6beed;--sl-color-primary-200: #a192e2;--sl-color-primary-300: #7b66d6;--sl-color-primary-400: #5e46cd;--sl-color-primary-500: #4225c4;--sl-color-primary-600: #3c21be;--sl-color-primary-700: #331bb6;--sl-color-primary-800: #2b16af;--sl-color-primary-900: #1d0da2;}</style> </body></html>',
  jsOptions: {},
  user: {
    id: "sam+klip@saasquat.ch",
    accountId: "sam+klip@saasquat.ch",
    firstName: "sam",
    lastName: "b",
    referralCodes: {
      "klip-referral-program": "SAMBSAMKLIP",
    },
    imageUrl: "",
    email: "sam+klip@saasquat.ch",
    cookieId: null,
    locale: null,
    countryCode: null,
    referable: true,
    firstSeenIP: "24.69.152.171",
    lastSeenIP: "70.66.140.31",
    dateCreated: 1637885093233,
    programShareLinks: {
      "klip-referral-program": {
        cleanShareLink: "http://short.staging.referralsaasquatch.com/mz2Yk1",
        UNKNOWN: {
          DIRECT: "http://short.staging.referralsaasquatch.com/mv2Yk1",
        },
        EMAIL: {
          DIRECT: "http://short.staging.referralsaasquatch.com/mP2Yk1",
        },
        MOBILE: {
          DIRECT: "http://short.staging.referralsaasquatch.com/me2Yk1",
        },
      },
    },
    customFields: {
      activityCount: 10,
      videoHoursCount: 2,
      lastSeenDate: 1638898707592,
      purchaseTotal: 1050,
    },
    segments: ["dog"],
    referredByCodes: [],
  },
};
