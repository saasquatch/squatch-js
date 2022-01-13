export default {
  template: `
  <html>
    <head>
      <script type="text/javascript">
        window.widgetIdent = {"programId":"klip-referral-program","userId":"sam+klip@saasquat.ch","accountId":"sam+klip@saasquat.ch","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImFjY291bnRJZCI6InNhbStrbGlwQHNhYXNxdWF0LmNoIiwiaWQiOiJzYW0ra2xpcEBzYWFzcXVhdC5jaCIsImVtYWlsIjoic2FtK2tsaXBAc2Fhc3F1YXQuY2giLCJsb2NhbGUiOiJlbiJ9fQ.a2nYYrSJ81FHXlCU-Sqp_-wquQizinHBhzwzULDzimg","tenantAlias":"test_a74miwdpofztj","engagementMedium":"EMBED","appDomain":"https://staging.referralsaasquatch.com"};
      </script>
      
        <link rel="stylesheet" type="text/css" href="https://fast-staging.ssqt.io/npm/@saasquatch/mint-components@1.5.0-30/dist/mint-components/mint-components.css">
      
        <script src="https://fast-staging.ssqt.io/npm/@saasquatch/bedrock-components@1.3.0/dist/bedrock-components/bedrock-components.js"></script>
      
        <script src="https://fast-staging.ssqt.io/npm/@saasquatch/mint-components@1.5.0-30/dist/mint-components/mint-components.js"></script>
      
      
      <script src="https://fast-staging.ssqt.io/npm/@elastic/apm-rum@4.0.1/dist/bundles/elastic-apm-rum.umd.min.js" crossorigin></script>
      <script>
        window.apm = elasticApm.init({
          serviceName: 'programwidget-staging',
          serverUrl: 'https://1c9081d2ac2d43548254f581dca2dbee.apm.us-central1.gcp.cloud.es.io:443',
          active: Math.random() < 0.1
        })
      </script>
      
    </head>
    <body>
      <sqm-brand brand-color="#4225c4" brand-font="Nunito Sans"><sqm-portal-container class="squatch-container" direction="column" padding="small" gap="xxxx-large"><sqm-portal-container direction="column" padding="none" gap="xxx-large"><sqm-program-explainer header-background="#f3f0ec" card-background="#f4f2fd" color="black" card-description="Earn points by completing tasks like uploading your first video or sharing videos with friends. Use your points to redeem rewards like one free month of Klip Enterprise or two plane tickets to anywhere in North America." header="Klip Rewards" card-title="Earn rewards with our loyalty program"><sqm-program-explainer-step background="#5B3EDA" color="white" description="Earn up to $1200 in rewards for each referral" card-title="Invite your friends to Klip" icon="person-plus">
          </sqm-program-explainer-step><sqm-program-explainer-step background="#F3CC66" color="black" description="Get a $50 VISA giftcard when they pay for their first month" card-title="If your friend signs up for a Klip Business plan" icon="cash-stack">
          </sqm-program-explainer-step><sqm-program-explainer-step background="#D3CCF5" color="black" description="Get up to $1200 in rewards - a $200 VISA giftcard when our sales team qualifies them as a good fit for Klip, and a $1000 VISA giftcard when they become a paying customer" card-title="If your friend signs up for a Klip Enterprise plan" icon="people">
          </sqm-program-explainer-step></sqm-program-explainer><sqm-portal-container max-width="600px"><sqm-titled-section label-margin="small" padding="none" class="share-link-container"><sqm-text slot="label"><h3>Share your referral link</h3></sqm-text><sqm-share-link slot="content" class="share-link"> </sqm-share-link></sqm-titled-section><sqm-titled-section label-margin="small" padding="none"><sqm-text slot="label"><h3>Share via social media</h3></sqm-text><sqm-portal-container slot="content" direction="row" padding="none" gap="x-large" min-width="160px"><sqm-share-button icon="envelope" medium="email" size="medium" pill="true" class="email-button">Email a friend
              </sqm-share-button><sqm-share-button medium="twitter" size="medium" pill="true" class="twitter-button">Tweet about us
              </sqm-share-button><sqm-share-button medium="whatsapp" size="medium" pill="true" class="facebook-button">Share on Facebook
              </sqm-share-button></sqm-portal-container></sqm-titled-section></sqm-portal-container></sqm-portal-container><sqm-portal-container direction="column" padding="none" gap="xx-large"><sqm-titled-section padding="none" label-margin="none"><sqm-text slot="label"><h2>Referrals and rewards</h2></sqm-text></sqm-titled-section><sqm-stat-container space="xxxx-large"><sqm-big-stat flex-reverse="true" alignment="left" stat-type="/referralsCount"><sqm-text><p>Referrals</p></sqm-text></sqm-big-stat><sqm-big-stat flex-reverse="true" alignment="left" stat-type="/integrationRewardsCountFiltered/AVAILABLE"><sqm-text><p>Giftcards Earned</p></sqm-text></sqm-big-stat><sqm-big-stat flex-reverse="true" alignment="left" stat-type="/rewardBalance/CREDIT/POINT/global"><sqm-text><p>Points Balance</p></sqm-text></sqm-big-stat></sqm-stat-container><sqm-card-feed><sqm-task-card reward-amount="75" card-title="Refer a Friend" description="Invite a friend to Klip and get 75 points when they signup for a free trial or contact our us about an enterprise license." button-text="Start referring" button-link="https://klip-staging.vercel.app/app/klip-rewards" goal="1" repeatable="" open-new-tab="false">
          </sqm-task-card><sqm-task-card reward-amount="50" card-title="Follow Us on Twitter" description="Earn 50 points when you follow us on Twitter!" button-text="Follow" button-link="https://twitter.com/" goal="1" stat-type="/programGoals/count/Follow-on-Social-Media" open-new-tab="true">
          </sqm-task-card><sqm-task-card reward-amount="250" goal="500" show-progress-bar="true" card-title="Spend $500 on Klip Products" description="Earn 250 points when you spend $500 or more on Klip products." button-text="See plans" button-link="https://klip-staging.vercel.app/app/plans" stat-type="/customFields/purchaseTotal" open-new-tab="false">
          </sqm-task-card><sqb-program-section program-id="klip-loyalty"><sqm-task-card reward-amount="25" goal="1" card-title="Upload Your First Video" description="Earn 25 points for exploring the Klip platform when you upload your first video." button-text="Upload" button-link="https://klip-staging.vercel.app/app" stat-type="/programGoals/count/Record-First-Video" open-new-tab="false">
            </sqm-task-card></sqb-program-section><sqm-task-card reward-amount="100" goal="5" repeatable="true" show-progress-bar="true" steps="true" card-title="Share 5 Videos" description="Earn 100 points for collaborating each time you share 5 videos." button-text="Share" button-link="https://klip-staging.vercel.app/app" stat-type="/customFields/videosShared" open-new-tab="false">
          </sqm-task-card><sqb-program-section program-id="klip-loyalty"><sqm-task-card reward-amount="1" reward-unit="Free Month" goal="1" card-title="Upgrade Your Plan" description="Buy a Business or Enterprise plan and get 1 free month of Klip for being a committed customer." button-text="Upgrade" button-link="https://klip-staging.vercel.app/app/plans" stat-type="/programGoals/count/Upgrade-Plan" open-new-tab="false">
            </sqm-task-card></sqb-program-section><sqm-task-card reward-amount="200" goal="5" show-progress-bar="" steps="" card-title="Purchase 5 Seats" description="Earn 200 points when you expand your Klip Team by purchasing 5 or more seats." button-text="Purchase seats" button-link="https://klip-staging.vercel.app/app/plans" stat-type="/customFields/seatCount" reward-duration="2021-11-02T07:00:00.000Z/2021-11-07T07:00:00.000Z" show-expiry="">
          </sqm-task-card><sqm-task-card reward-amount="250" goal="1" repeatable="" show-progress-bar="" card-title="Upload 1 Hour of Video" description="Record and upload an hour of video and get 250 points for being a super user." button-text="Upload" button-link="https://klip-staging.vercel.app/app" stat-type="/customFields/videoHoursCount" reward-duration="2021-12-31T08:00:00.000Z/2022-01-02T08:00:00.000Z" show-expiry="" finite="3" progress-bar-unit="" reward-unit="Points">
          </sqm-task-card><sqb-program-section program-id="klip-loyalty"><sqm-task-card reward-amount="100" goal="1" card-title="Complete an NPS Survey" description="Fill out our NPS survey and get 100 points for giving us honest feedback. Be sure to use your Klip account email when completing the survey." button-text="Complete survey" button-link="https://y5tqgj96plv.typeform.com/to/p6N7lHUk" stat-type="/programGoals/count/NPS-Survey" reward-unit="Points" open-new-tab="true">
            </sqm-task-card></sqb-program-section><sqb-conditional-section condition="'champion' in user.segments"><sqb-program-section program-id="klip-loyalty"><sqm-task-card reward-amount="$100" goal="1" card-title="Complete a Case Study" description="Write a Klip case study and earn a $100 Visa Gift Card for letting us know how Klip has helped your team succeed." button-text="Complete case study" button-link="https://y5tqgj96plv.typeform.com/to/CPhkFBBW" stat-type="/programGoals/count/Case-Study" reward-unit="Visa Gift Card" open-new-tab="true">
              </sqm-task-card></sqb-program-section></sqb-conditional-section></sqm-card-feed><sl-tab-group><sl-tab slot="nav" panel="referralLeaderboard">Leaderboard</sl-tab><sl-tab slot="nav" panel="referralHistory">Referral history</sl-tab><sl-tab slot="nav" panel="rewardHistory">Reward history</sl-tab><sl-tab slot="nav" panel="rewardExchange">Redeem</sl-tab><sl-tab-panel name="referralHistory"><sqm-referral-table><sqm-referral-table-user-column column-title="User">
              </sqm-referral-table-user-column><sqm-referral-table-status-column column-title="Referral Status">
              </sqm-referral-table-status-column><sqm-referral-table-rewards-column>
              </sqm-referral-table-rewards-column><sqm-referral-table-date-column column-title="Date Referred" date-shown="dateReferralStarted">
              </sqm-referral-table-date-column></sqm-referral-table></sl-tab-panel><sl-tab-panel name="referralLeaderboard"><sqm-titled-section padding="medium" label-margin="small"><sqm-text slot="label"><h2>Leaderboard</h2></sqm-text><sqm-text slot="content"><p>
                  Be one of the top 3 referrers at the end of the year and receive
                  Klip free for 1 year!
                </p></sqm-text></sqm-titled-section><sqm-leaderboard usersheading="Referrer" statsheading="Referrals" rank-type="rank" leaderboard-type="topStartedReferrers" interval="2021-10-05T07:00:00.000Z/2022-03-13T08:00:00.000Z" rankheading="Rank">
            </sqm-leaderboard></sl-tab-panel><sl-tab-panel name="rewardHistory"><sqb-program-section program-id=""><sqm-rewards-table per-page="4"><sqm-rewards-table-reward-column></sqm-rewards-table-reward-column><sqm-rewards-table-source-column></sqm-rewards-table-source-column><sqm-rewards-table-status-column></sqm-rewards-table-status-column><sqm-rewards-table-date-column></sqm-rewards-table-date-column></sqm-rewards-table></sqb-program-section></sl-tab-panel><sl-tab-panel name="rewardExchange"><sqm-reward-exchange-list></sqm-reward-exchange-list></sl-tab-panel></sl-tab-group></sqm-portal-container></sqm-portal-container></sqm-brand><style>* { box-sizing: border-box; } body {margin: 0;}:root{--sqm-portal-background: white;--sl-color-primary-hue: var(--sl-color-primary-500);--sl-focus-ring-color-primary: var(--sl-color-primary-100);}.twitter-button::part(defaultsharebutton-base){border-top-left-radius:4px;border-top-right-radius:4px;border-bottom-right-radius:4px;border-bottom-left-radius:4px;color:rgb(255, 255, 255);border-top-width:initial;border-right-width:initial;border-bottom-width:initial;border-left-width:initial;border-top-style:none;border-right-style:none;border-bottom-style:none;border-left-style:none;border-top-color:initial;border-right-color:initial;border-bottom-color:initial;border-left-color:initial;border-image-source:initial;border-image-slice:initial;border-image-width:initial;border-image-outset:initial;border-image-repeat:initial;background-image:initial;background-position-x:initial;background-position-y:initial;background-size:initial;background-repeat-x:initial;background-repeat-y:initial;background-attachment:initial;background-origin:initial;background-clip:initial;background-color:rgb(0, 172, 238);}.facebook-button::part(defaultsharebutton-base){border-top-left-radius:4px;border-top-right-radius:4px;border-bottom-right-radius:4px;border-bottom-left-radius:4px;color:rgb(255, 255, 255);border-top-width:initial;border-right-width:initial;border-bottom-width:initial;border-left-width:initial;border-top-style:none;border-right-style:none;border-bottom-style:none;border-left-style:none;border-top-color:initial;border-right-color:initial;border-bottom-color:initial;border-left-color:initial;border-image-source:initial;border-image-slice:initial;border-image-width:initial;border-image-outset:initial;border-image-repeat:initial;background-image:initial;background-position-x:initial;background-position-y:initial;background-size:initial;background-repeat-x:initial;background-repeat-y:initial;background-attachment:initial;background-origin:initial;background-clip:initial;background-color:rgb(59, 89, 152);}.email-button::part(defaultsharebutton-base){border-top-left-radius:4px;border-top-right-radius:4px;border-bottom-right-radius:4px;border-bottom-left-radius:4px;color:rgb(255, 255, 255);border-top-width:initial;border-right-width:initial;border-bottom-width:initial;border-left-width:initial;border-top-style:none;border-right-style:none;border-bottom-style:none;border-left-style:none;border-top-color:initial;border-right-color:initial;border-bottom-color:initial;border-left-color:initial;border-image-source:initial;border-image-slice:initial;border-image-width:initial;border-image-outset:initial;border-image-repeat:initial;background-image:initial;background-position-x:initial;background-position-y:initial;background-size:initial;background-repeat-x:initial;background-repeat-y:initial;background-attachment:initial;background-origin:initial;background-clip:initial;background-color:rgb(102, 102, 102);}.facebook-button::part(defaultsharebutton-base):active{outline-color:initial;outline-style:none;outline-width:initial;}</style>
    </body>
  </html>`,
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
