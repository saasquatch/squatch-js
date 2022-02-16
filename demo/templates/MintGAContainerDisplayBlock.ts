export default {
  template: `<!DOCTYPE html>
  <html>
  <head>
    <script type="text/javascript">
      window.widgetIdent = {"programId":"klip-referral-program","userId":"sam+klip@saasquat.ch","accountId":"sam+klip@saasquat.ch","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImFjY291bnRJZCI6InNhbStrbGlwQHNhYXNxdWF0LmNoIiwiaWQiOiJzYW0ra2xpcEBzYWFzcXVhdC5jaCIsImVtYWlsIjoic2FtK2tsaXBAc2Fhc3F1YXQuY2giLCJsb2NhbGUiOiJlbiIsImN1c3RvbUZpZWxkcyI6e319fQ.4AneYO6_38IcAr6q_k7V-UDeU8aTtOzVu24zvUsnml4","tenantAlias":"test_a74miwdpofztj","engagementMedium":"EMBED","appDomain":"https://staging.referralsaasquatch.com"};
    </script>
    
      <link rel="stylesheet" type="text/css" href="https://fast-staging.ssqt.io/npm/@saasquatch/mint-components@1.5.0-62/dist/mint-components/mint-components.css">
    
      <script src="https://fast-staging.ssqt.io/npm/@saasquatch/bedrock-components@1.3.1-7/dist/bedrock-components/bedrock-components.js"></script>
    
      <script src="https://fast-staging.ssqt.io/npm/@saasquatch/mint-components@1.5.0-62/dist/mint-components/mint-components.js"></script>
    
    
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
    <sqm-brand brand-color="#4225c4" brand-font="Nunito Sans"><sqm-portal-container style="display:block;" class="squatch-container" direction="column" padding="small" gap="xxxx-large"><sqm-portal-container direction="column" padding="none" gap="xxx-large"><sqm-hero-image image-url="https://i.imgur.com/yr6ER3R.png" header="Klip Rewards" description="Refer friends and complete tasks while using Klip to earn rewards" layout="columns" image-pos="right" background-color="#F9F9F9">
      </sqm-hero-image><sqm-stat-container space="xxxx-large"><sqm-big-stat flex-reverse="true" alignment="left" stat-type="/referralsCount"><sqm-text><p>Referrals</p></sqm-text></sqm-big-stat><sqm-big-stat flex-reverse="true" alignment="left" stat-type="/integrationRewardsCountFiltered/AVAILABLE"><sqm-text><p>Giftcards Earned</p></sqm-text></sqm-big-stat><sqm-big-stat flex-reverse="true" alignment="left" stat-type="/rewardBalance/CREDIT/POINT/value/global"><sqm-text><p>Points Balance</p></sqm-text></sqm-big-stat></sqm-stat-container><sqm-titled-section align="center"><sqm-text slot="label"><h3>Share $50 with friends</h3></sqm-text><sqm-text slot="content"><p>
            They’ll get a $50 credit towards a new account and you’ll get up to
            $1200
          </p></sqm-text></sqm-titled-section><sqm-referral-card><sqm-timeline slot="left" icon="circle"><sqm-timeline-entry reward="75" unit="points" desc="Your friends signs up for a free trial">
          </sqm-timeline-entry><sqm-timeline-entry reward="$50" unit="visa giftcard" desc="Your friends signs up for Klip Business">
          </sqm-timeline-entry><sqm-timeline-entry reward="$200" unit="visa giftcard" desc="Your friend qualifies as a good fit for Klip Enterprise">
          </sqm-timeline-entry><sqm-timeline-entry reward="$1000" unit="visa giftcard" desc="Your friend purchases Klip Enterprise">
          </sqm-timeline-entry></sqm-timeline><sqm-portal-container gap="large" slot="right"><sqm-text>Choose how you want to share: </sqm-text><sqm-text><p light="">Your unique referral link:</p><sqm-share-link> </sqm-share-link></sqm-text><sqm-portal-container gap="x-small"><sqm-share-button medium="email">
              Share via email
            </sqm-share-button><sqm-share-button medium="linkedin">
              Share on LinkedIn
            </sqm-share-button><sqm-share-button medium="twitter">
              Tweet about us
            </sqm-share-button></sqm-portal-container></sqm-portal-container></sqm-referral-card></sqm-portal-container><sqm-portal-container direction="column" padding="none" gap="xx-large"><sqm-titled-section align="center"><sqm-text slot="label"><h3>Earn more rewards</h3></sqm-text><sqm-text slot="content"><p>
            Get points while using Klip. Use those points to redeem rewards like
            one free month of Klip Enterprise or two plane tickets to anywhere
            in North America
          </p></sqm-text></sqm-titled-section><sqm-card-feed><sqb-program-section program-id="klip-loyalty"><sqm-task-card reward-amount="50" card-title="Follow Us on Twitter" description="Earn 50 points when you follow us on Twitter!" button-text="Follow" button-link="https://twitter.com/" goal="1" stat-type="/programGoals/count/Follow-on-Social-Media" open-new-tab="true" event-key="socialFollow">
          </sqm-task-card></sqb-program-section><sqm-task-card reward-amount="250" goal="500" show-progress-bar="true" card-title="Spend $500 on Klip Products" description="Earn 250 points when you spend $500 or more on Klip products." button-text="See plans" button-link="https://klip-staging.vercel.app/app/plans" stat-type="/customFields/purchaseTotal" open-new-tab="false">
        </sqm-task-card><sqb-program-section program-id="klip-loyalty"><sqm-task-card reward-amount="25" goal="1" card-title="Upload Your First Video" description="Earn 25 points for exploring the Klip platform when you upload your first video." button-text="Upload" button-link="https://klip-staging.vercel.app/app" stat-type="/programGoals/count/Record-First-Video" open-new-tab="false">
          </sqm-task-card></sqb-program-section><sqm-task-card reward-amount="100" goal="5" repeatable="true" show-progress-bar="true" steps="true" card-title="Share 5 Videos" description="Earn 100 points for collaborating each time you share 5 videos." button-text="Share" button-link="https://klip-staging.vercel.app/app" stat-type="/customFields/videosShared" open-new-tab="false">
        </sqm-task-card><sqb-program-section program-id="klip-loyalty"><sqm-task-card reward-amount="1" reward-unit="Free Month" goal="1" card-title="Upgrade Your Plan" description="Buy a Business or Enterprise plan and get 1 free month of Klip for being a committed customer." button-text="Upgrade" button-link="https://klip-staging.vercel.app/app/plans" stat-type="/programGoals/count/Upgrade-Plan" open-new-tab="false">
          </sqm-task-card></sqb-program-section><sqm-task-card reward-amount="200" goal="5" show-progress-bar="" steps="" card-title="Purchase 5 Seats" description="Earn 200 points when you expand your Klip Team by purchasing 5 or more seats." button-text="Purchase seats" button-link="https://klip-staging.vercel.app/app/plans" stat-type="/customFields/seatCount" reward-duration="2021-11-02T07:00:00.000Z/2021-11-07T07:00:00.000Z" show-expiry="">
        </sqm-task-card><sqm-task-card reward-amount="250" goal="1" repeatable="" show-progress-bar="" card-title="Upload 1 Hour of Video" description="Record and upload an hour of video and get 250 points for being a super user." button-text="Upload" button-link="https://klip-staging.vercel.app/app" stat-type="/customFields/videoHoursCount" reward-duration="2021-12-31T08:00:00.000Z/2022-01-02T08:00:00.000Z" show-expiry="" finite="3" progress-bar-unit="" reward-unit="Points">
        </sqm-task-card><sqb-program-section program-id="klip-loyalty"><sqm-task-card reward-amount="100" goal="1" card-title="Complete an NPS Survey" description="Fill out our NPS survey and get 100 points for giving us honest feedback. Be sure to use your Klip account email when completing the survey." button-text="Complete survey" button-link="https://y5tqgj96plv.typeform.com/to/p6N7lHUk" stat-type="/programGoals/count/NPS-Survey" reward-unit="Points" open-new-tab="true">
          </sqm-task-card></sqb-program-section><sqb-conditional-section condition="'champion' in user.segments"><sqb-program-section program-id="klip-loyalty"><sqm-task-card reward-amount="$100" goal="1" card-title="Complete a Case Study" description="Write a Klip case study and earn a $100 Visa Gift Card for letting us know how Klip has helped your team succeed." button-text="Complete case study" button-link="https://y5tqgj96plv.typeform.com/to/CPhkFBBW" stat-type="/programGoals/count/Case-Study" reward-unit="Visa Gift Card" open-new-tab="true">
            </sqm-task-card></sqb-program-section></sqb-conditional-section></sqm-card-feed><sl-tab-group><sl-tab slot="nav" panel="referralLeaderboard">Leaderboard </sl-tab><sl-tab slot="nav" panel="referralHistory">Referral history </sl-tab><sl-tab slot="nav" panel="rewardHistory">Reward history </sl-tab><sl-tab slot="nav" panel="rewardExchange">Redeem </sl-tab><sl-tab-panel name="referralHistory"><sqm-referral-table per-page="4"><sqm-referral-table-user-column column-title="User">
            </sqm-referral-table-user-column><sqm-referral-table-status-column column-title="Referral status">
            </sqm-referral-table-status-column><sqm-referral-table-rewards-column>
            </sqm-referral-table-rewards-column><sqm-referral-table-date-column column-title="Date referred" date-shown="dateReferralStarted">
            </sqm-referral-table-date-column></sqm-referral-table></sl-tab-panel><sl-tab-panel name="referralLeaderboard"><sqm-portal-container gap="large"><sqm-hero-image image-url="https://i.imgur.com/2evfTx7.png" description="Be one of the top 3 referrers at the end of the year and receive Klip free for 1 year!" layout="columns" image-pos="left" background-color="#EFF8FE">
            </sqm-hero-image><sqm-leaderboard usersheading="Referrer" statsheading="Referrals" rank-type="rank" leaderboard-type="topStartedReferrers" rankheading="Rank" show-rank="true">
            </sqm-leaderboard></sqm-portal-container></sl-tab-panel><sl-tab-panel name="rewardHistory"><sqb-program-section program-id=""><sqm-rewards-table per-page="4"><sqm-rewards-table-reward-column></sqm-rewards-table-reward-column><sqm-rewards-table-source-column></sqm-rewards-table-source-column><sqm-rewards-table-status-column></sqm-rewards-table-status-column><sqm-rewards-table-date-column></sqm-rewards-table-date-column></sqm-rewards-table></sqb-program-section></sl-tab-panel><sl-tab-panel name="rewardExchange"><sqm-reward-exchange-list></sqm-reward-exchange-list></sl-tab-panel></sl-tab-group></sqm-portal-container></sqm-portal-container></sqm-brand><style>* { box-sizing: border-box; } body {margin: 0;}:root{--sqm-portal-background: white;}sl-tab-panel::part(base){padding-top: !important;padding-right: !important;padding-bottom: !important;padding-left: !important;}*{box-sizing:border-box;}body{margin-top:0px;margin-right:0px;margin-bottom:0px;margin-left:0px;}.facebook-button::part(defaultsharebutton-base):active{outline-color:initial;outline-style:none;outline-width:initial;}</style>
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
