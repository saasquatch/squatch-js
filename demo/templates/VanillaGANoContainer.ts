export default {
  template:
    '<!DOCTYPE html><html>  <head>    <script type="text/javascript">      window.widgetIdent = {"programId":"two-goal-program","userId":"testestest","accountId":"testestest","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoidGVzdGVzdGVzdCIsImFjY291bnRJZCI6InRlc3Rlc3Rlc3QiLCJlbWFpbCI6ImppbWJvQHRlc3QuY2EifX0.g_54aEQqbp5o_z0ZjmDtEMTkmm0qtWcTW-YkX67LWkM","tenantAlias":"test_a8b41jotf8a1v","engagementMedium":"EMBED","appDomain":"https://staging.referralsaasquatch.com"};    </script>          <script src="https://fast-staging.ssqt.io/npm/@saasquatch/vanilla-components@1.2.2/dist/widget-components/entrypoint.js"></script>          <link rel="stylesheet" type="text/css" href="https://fast-staging.ssqt.io/npm/@saasquatch/vanilla-components-assets@0.0.12/icons.css">            <script src="https://fast-staging.ssqt.io/npm/@elastic/apm-rum@4.0.1/dist/bundles/elastic-apm-rum.umd.min.js" crossorigin></script>    <script>      window.apm = elasticApm.init({        serviceName: \'programwidget-staging\',        serverUrl: \'https://1c9081d2ac2d43548254f581dca2dbee.apm.us-central1.gcp.cloud.es.io:443\',        active: Math.random() < 0.1      })    </script>      </head>  <body>  <sqh-text-component sqhbanner="true" ishidden="true" ismarkdown="false" background="https://res.cloudinary.com/saasquatch/image/upload/v1535746336/prod_default_assets/default_banner.jpg" height="auto" paddingtop="150" paddingbottom="150" text="" color="#000000"></sqh-text-component><sqh-text-component sqhheader="true" ishidden="false" ismarkdown="false" text="Give $10 and Get $10!" color="#4486E1" fontsize="30" textalign="center" paddingtop="30" paddingbottom="10"></sqh-text-component><sqh-text-component sqhbody="true" ishidden="false" ismarkdown="true" text="Give a friend a $10 and receive $10 for yourself when they purchase.<br/><br/>Share the link below or use the code **<sqh-referral-code />**" color="#000000" fontsize="13" textalign="center" paddingtop="5" paddingbottom="20"></sqh-text-component><sqh-copy-link-button ishidden="false" copysuccess="copied!" copyfailure="Press Ctrl+C to copy" text="Copy" buttoncolor="#5C6164" textcolor="#FFFFFF"></sqh-copy-link-button><sqh-share-button-container ishidden="false" emaildisplayrule="mobile-and-desktop" emailtext="Email" emailtextcolor="#ffffff" emailbackgroundcolor="#4b4d50" facebookdisplayrule="mobile-and-desktop" facebooktext="Facebook" facebooktextcolor="#ffffff" facebookbackgroundcolor="#234079" twitterdisplayrule="mobile-and-desktop" twittertext="Twitter" twittertextcolor="#ffffff" twitterbackgroundcolor="#4797d2" smsdisplayrule="mobile-only" smstext="SMS" smstextcolor="#ffffff" smsbackgroundcolor="#7bbf38" whatsappdisplayrule="mobile-only" whatsapptext="Whatspp" whatsapptextcolor="#ffffff" whatsappbackgroundcolor="#25D366" linkedindisplayrule="hidden" linkedintext="LinkedIn" linkedintextcolor="#ffffff" linkedinbackgroundcolor="#0084b9" pinterestdisplayrule="hidden" pinteresttext="Pinterest" pinteresttextcolor="#ffffff" pinterestbackgroundcolor="#cb2027" messengerdisplayrule="hidden" messengertext="Messenger" messengertextcolor="#ffffff" messengerbackgroundcolor="#0084ff" linedisplayrule="mobile-only" linetext="Line Messenger" linetextcolor="#ffffff" linebackgroundcolor="#00c300"></sqh-share-button-container><sqh-text-component sqhreferralsheader="true" ismarkdown="true" ishidden="false" text="**Rewards Dashboard**" color="#000000" fontsize="13" textalign="center" paddingtop="20" paddingbottom="10"></sqh-text-component><sqh-stats-container ishidden="false" paddingtop="0" paddingbottom="0"><sqh-stat-component ishidden="false" statcolor="#4caf50" stattype="/referralsCount" statdescription="Friends Referred" paddingtop="10" paddingbottom="10"></sqh-stat-component><sqh-stat-component ishidden="false" stattype="/rewardsCount" statdescription="Total Rewards" paddingtop="10" paddingbottom="10" statcolor="#000000"></sqh-stat-component><sqh-stat-component ishidden="false" stattype="/rewardBalance/CREDIT/CENTS/prettyAssignedCredit" statdescription="Credit earned" paddingtop="10" paddingbottom="10" statcolor="#000000"></sqh-stat-component></sqh-stats-container><sqh-referral-list ishidden="false" showreferrer="true" usefirstreward="false" referralnamecolor="darkslategray" referraltextcolor="lightgray" rewardcolor="#4BB543" pendingcolor="lightgray" pendingvalue="Reward Pending" referrervalue="Referred" referrercontent="Referred you {date}" convertedcontent="Signed up, referred {date}" pendingcontent="Trial user, referred {date}" pendingvalue="Referral pending" valuecontent="and {extrarewards} more {extrarewards, plural, one {reward} other {rewards}}" expiredcolor="lightgray" expiredvalue="Expired Reward" expiredcontent="Signed up, referred {date}" cancelledcolor="#C81D05" cancelledvalue="Cancelled Reward" cancelledcontent="Signed up, referred {date}" paginatemore="View More" paginateless="Previous" noreferralsyet="No Referrals Yet..." unknownuser="Your Friend"></sqh-referral-list><sqh-text-component sqhfooter="true" ishidden="false" ismarkdown="false" text="Terms and Conditions" color="lightgray" fontsize="13" textalign="center" paddingtop="10" paddingbottom="10"></sqh-text-component>  </body></html>',
  jsOptions: {},
  user: {
    id: "testestest",
    accountId: "testestest",
    firstName: "jimbo",
    lastName: "neutron",
    lastInitial: "n",
    referralCode: "JIMBONEUTRON",
    referralCodes: {
      r2: "JIMBONEUTRON22",
      r3: "JIMBONEUTRON251",
      "new-referral": "JIMBONEUTRON299",
      asdasdsadsad: "JIMBONEUTRON245",
      "asdf-multi-tier": "JIMBONEUTRON397",
      "refreral-test": "JIMBONEUTRON398",
      asdsadasd: "JIMBONEUTRON369",
      "referral-program": "JIMBONEUTRON250",
      translated: "JIMBONEUTRON258",
      "sam-partner-test-2": "JIMBONEUTRON2",
      "qa-ms-14": "JIMBONEUTRON259",
      "sam-partner-comm-login": "JIMBONEUTRON26",
      "new-partner-2": "JIMBONEUTRON313",
      "sam-login-test": "JIMBONEUTRON230",
      asdadsdas: "JIMBONEUTRON264",
      "deep-dive": "JIMBONEUTRON211",
      "consultant-referral": "JIMBONEUTRON252",
      dfsadfssdfa: "JIMBONEUTRON227",
      "partner-test-program": "JIMBONEUTRON287",
      asddfasbf: "JIMBONEUTRON316",
      vsssdvsdv: "JIMBONEUTRON241",
      "sam-partner-test": "JIMBONEUTRON268",
      "objective-program-take-2": "JIMBONEUTRON271",
      "additional-program": "JIMBONEUTRON286",
      "simple-conversions": "JIMBONEUTRON224",
      "program-to-play-with": "JIMBONEUTRON354",
      "please-work-referral": "JIMBONEUTRON247",
      "asd-referral": "JIMBONEUTRON355",
      "testing-testing": "JIMBONEUTRON273",
      "asdfg-multi-step": "JIMBONEUTRON238",
      "testing-jorge": "JIMBONEUTRON28",
      "new-program-123": "JIMBONEUTRON256",
      "new-referral-program": "JIMBONEUTRON214",
      fgkjhd: "JIMBONEUTRON244",
      "straightaway-referral-program": "JIMBONEUTRON233",
      "another-one": "JIMBONEUTRON282",
      "cool-program": "JIMBONEUTRON284",
      adsasdasddsadsa: "JIMBONEUTRON254",
      johan: "JIMBONEUTRON219",
      "fresh-referral-program-asd": "JIMBONEUTRON370",
      "sams-test-2": "JIMBONEUTRON266",
      "grapes-testing": "JIMBONEUTRON277",
      "i43nrfioe-gn-": "JIMBONEUTRON267",
      "testing-broken-referral": "JIMBONEUTRON213",
      asdasdasd: "JIMBONEUTRON283",
      "ref-valid": "JIMBONEUTRON29",
      "widget-test": "JIMBONEUTRON274",
      "testing-key-input": "JIMBONEUTRON297",
      "another-objective-program": "JIMBONEUTRON218",
      "test-bug-123": "JIMBONEUTRON393",
      "new-partner-program": "JIMBONEUTRON351",
      asdasdasdasd: "JIMBONEUTRON242",
      "empty-objective-program": "JIMBONEUTRON311",
      "testing-emails-bug": "JIMBONEUTRON253",
      asdasdasdasdasd: "JIMBONEUTRON289",
      "partner-metric-test-2": "JIMBONEUTRON49",
      fghcfb: "JIMBONEUTRON217",
      zcxvzcvxvzcx: "JIMBONEUTRON326",
      coleton: "JIMBONEUTRON36",
      dfghfgh: "JIMBONEUTRON30",
      "the-newest-objective-program": "JIMBONEUTRON265",
      sdfdfdsfsdf: "JIMBONEUTRON279",
      "a-whole-new-partner-world": "JIMBONEUTRON210",
      "sam-qa-test": "JIMBONEUTRON25",
      "testing-again-123": "JIMBONEUTRON261",
      a: "JIMBONEUTRON324",
      b: "JIMBONEUTRON48",
      "testing-points": "JIMBONEUTRON20",
      "two-goal-program": "JIMBONEUTRON275",
      "testing-partner-widget": "JIMBONEUTRON317",
      "another-new-program": "JIMBONEUTRON285",
      "maybe-broke": "JIMBONEUTRON229",
      "give-me-the-program": "JIMBONEUTRON328",
      "customer-referral": "JIMBONEUTRON272",
      "a-final-test-of-the-partner-thing": "JIMBONEUTRON212",
      "yet-another": "JIMBONEUTRON296",
      classic: "JIMBONEUTRON",
      "partner-super-fresh": "JIMBONEUTRON269",
      "deep-dive-goals": "JIMBONEUTRON462",
      "do-i-get-the-old-one": "JIMBONEUTRON385",
      "jorge-is-testing": "JIMBONEUTRON331",
      "employee-referral": "JIMBONEUTRON226",
      "partner-jorge": "JIMBONEUTRON237",
      xcvxcvvcx: "JIMBONEUTRON45",
      "new-schema": "JIMBONEUTRON249",
      r1: "JIMBONEUTRON288",
      "default-grapes": "JIMBONEUTRON257",
    },
    imageUrl: "",
    email: "jimbo@test.ca",
    cookieId: null,
    paymentProviderId: null,
    locale: "en_US",
    countryCode: "CA",
    referable: true,
    firstSeenIP: null,
    lastSeenIP: null,
    dateCreated: 1550012800974,
    emailHash: "2cd375cf9329a8277efbdb9e07beaa5e",
    referralSource: "UNKNOWN",
    shareLinks: {
      shareLink: "https://short.staging.referralsaasquatch.com/mvm0sH",
      facebookShareLink: "https://short.staging.referralsaasquatch.com/mmm0sH",
      twitterShareLink: "https://short.staging.referralsaasquatch.com/mRm0sH",
      emailShareLink: "https://short.staging.referralsaasquatch.com/mLm0sH",
      linkedinShareLink: "https://short.staging.referralsaasquatch.com/m6m0sH",
      mobileShareLink: "https://short.staging.referralsaasquatch.com/mem0sH",
      mobileFacebookShareLink:
        "https://short.staging.referralsaasquatch.com/mnm0sH",
      mobileTwitterShareLink:
        "https://short.staging.referralsaasquatch.com/mCm0sH",
      mobileEmailShareLink:
        "https://short.staging.referralsaasquatch.com/mEm0sH",
      EMBED: {
        shareLink: "https://short.staging.referralsaasquatch.com/mQm0sH",
        facebookShareLink:
          "https://short.staging.referralsaasquatch.com/mwm0sH",
        twitterShareLink: "https://short.staging.referralsaasquatch.com/mcm0sH",
        emailShareLink: "https://short.staging.referralsaasquatch.com/mJm0sH",
        linkedinShareLink:
          "https://short.staging.referralsaasquatch.com/mHm0sH",
      },
      POPUP: {
        shareLink: "https://short.staging.referralsaasquatch.com/m5m0sH",
        facebookShareLink:
          "https://short.staging.referralsaasquatch.com/m9m0sH",
        twitterShareLink: "https://short.staging.referralsaasquatch.com/mMm0sH",
        emailShareLink: "https://short.staging.referralsaasquatch.com/mom0sH",
        linkedinShareLink:
          "https://short.staging.referralsaasquatch.com/m7m0sH",
      },
      HOSTED: {
        shareLink: "https://short.staging.referralsaasquatch.com/mtm0sH",
        facebookShareLink:
          "https://short.staging.referralsaasquatch.com/mum0sH",
        twitterShareLink: "https://short.staging.referralsaasquatch.com/mSm0sH",
        emailShareLink: "https://short.staging.referralsaasquatch.com/mlm0sH",
        linkedinShareLink:
          "https://short.staging.referralsaasquatch.com/mYm0sH",
      },
      MOBILE: {
        shareLink: "https://short.staging.referralsaasquatch.com/mem0sH",
        facebookShareLink:
          "https://short.staging.referralsaasquatch.com/mnm0sH",
        twitterShareLink: "https://short.staging.referralsaasquatch.com/mCm0sH",
        emailShareLink: "https://short.staging.referralsaasquatch.com/mEm0sH",
        linkedinShareLink:
          "https://short.staging.referralsaasquatch.com/m3m0sH",
      },
      EMAIL: {
        shareLink: "https://short.staging.referralsaasquatch.com/mPm0sH",
        facebookShareLink:
          "https://short.staging.referralsaasquatch.com/mTm0sH",
        twitterShareLink: "https://short.staging.referralsaasquatch.com/mGm0sH",
        emailShareLink: "https://short.staging.referralsaasquatch.com/mbm0sH",
        linkedinShareLink:
          "https://short.staging.referralsaasquatch.com/m1m0sH",
      },
    },
    programShareLinks: {
      "sam-partner-comm-login": {
        cleanShareLink: "https://short.staging.referralsaasquatch.com/mz2V5f",
        UNKNOWN: {
          DIRECT: "https://short.staging.referralsaasquatch.com/mv2V5f",
        },
        EMAIL: {
          DIRECT: "https://short.staging.referralsaasquatch.com/mP2V5f",
        },
        MOBILE: {
          DIRECT: "https://short.staging.referralsaasquatch.com/me2V5f",
        },
      },
      a: {
        cleanShareLink: "https://short.staging.referralsaasquatch.com/mz2LjP",
        UNKNOWN: {
          DIRECT: "https://short.staging.referralsaasquatch.com/mv2LjP",
        },
        EMAIL: {
          DIRECT: "https://short.staging.referralsaasquatch.com/mP2LjP",
        },
        MOBILE: {
          DIRECT: "https://short.staging.referralsaasquatch.com/me2LjP",
        },
      },
      "new-referral": {
        cleanShareLink: "https://short.staging.referralsaasquatch.com/mz2QxK",
        UNKNOWN: {
          DIRECT: "https://short.staging.referralsaasquatch.com/mv2QxK",
        },
        EMAIL: {
          DIRECT: "https://short.staging.referralsaasquatch.com/mP2QxK",
        },
        MOBILE: {
          DIRECT: "https://short.staging.referralsaasquatch.com/me2QxK",
        },
      },
      "yet-another": {
        cleanShareLink: "https://short.staging.referralsaasquatch.com/mz2V4R",
        UNKNOWN: {
          DIRECT: "https://short.staging.referralsaasquatch.com/mv2V4R",
        },
        EMAIL: {
          DIRECT: "https://short.staging.referralsaasquatch.com/mP2V4R",
        },
        MOBILE: {
          DIRECT: "https://short.staging.referralsaasquatch.com/me2V4R",
        },
      },
      "partner-super-fresh": {
        cleanShareLink: "https://short.staging.referralsaasquatch.com/mz2V5H",
        UNKNOWN: {
          DIRECT: "https://short.staging.referralsaasquatch.com/mv2V5H",
        },
        EMAIL: {
          DIRECT: "https://short.staging.referralsaasquatch.com/mP2V5H",
        },
        MOBILE: {
          DIRECT: "https://short.staging.referralsaasquatch.com/me2V5H",
        },
      },
      asdadsdas: {
        cleanShareLink: "https://short.staging.referralsaasquatch.com/mzz5aX",
        UNKNOWN: {
          DIRECT: "https://short.staging.referralsaasquatch.com/mvz5aX",
        },
        EMAIL: {
          DIRECT: "https://short.staging.referralsaasquatch.com/mPz5aX",
        },
        MOBILE: {
          DIRECT: "https://short.staging.referralsaasquatch.com/mez5aX",
        },
      },
      "sam-partner-test-2": {
        cleanShareLink: "https://short.staging.referralsaasquatch.com/mzmzsH",
        UNKNOWN: {
          DIRECT: "https://short.staging.referralsaasquatch.com/mvmzsH",
        },
        EMAIL: {
          DIRECT: "https://short.staging.referralsaasquatch.com/mPmzsH",
        },
        MOBILE: {
          DIRECT: "https://short.staging.referralsaasquatch.com/memzsH",
        },
      },
      translated: {
        cleanShareLink: "https://short.staging.referralsaasquatch.com/mz2V57",
        UNKNOWN: {
          DIRECT: "https://short.staging.referralsaasquatch.com/mv2V57",
        },
        EMAIL: {
          DIRECT: "https://short.staging.referralsaasquatch.com/mP2V57",
        },
        MOBILE: {
          DIRECT: "https://short.staging.referralsaasquatch.com/me2V57",
        },
      },
      dfsadfssdfa: {
        cleanShareLink: "https://short.staging.referralsaasquatch.com/mz2V4K",
        UNKNOWN: {
          DIRECT: "https://short.staging.referralsaasquatch.com/mv2V4K",
        },
        EMAIL: {
          DIRECT: "https://short.staging.referralsaasquatch.com/mP2V4K",
        },
        MOBILE: {
          DIRECT: "https://short.staging.referralsaasquatch.com/me2V4K",
        },
      },
      "maybe-broke": {
        cleanShareLink: "https://short.staging.referralsaasquatch.com/mz2V4S",
        UNKNOWN: {
          DIRECT: "https://short.staging.referralsaasquatch.com/mv2V4S",
        },
        EMAIL: {
          DIRECT: "https://short.staging.referralsaasquatch.com/mP2V4S",
        },
        MOBILE: {
          DIRECT: "https://short.staging.referralsaasquatch.com/me2V4S",
        },
      },
    },
    customFields: {
      foo: "bar",
      lastSeenDate: 1638901913364,
    },
    segments: ["vip"],
    referredBy: {
      isConverted: false,
      code: null,
      newlyReferred: false,
      referredReward: null,
    },
    referredByCodes: [],
    dateUsTaxFormSubmitted: null,
  },
};
