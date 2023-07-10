import debug from "debug";
import { defineFeature, loadFeature } from "jest-cucumber";
import AnalyticsApi from "../../src/api/AnalyticsApi";
import EventsApi from "../../src/api/EventsApi";
import * as squatchjs from "../../src/squatch";
import { ConfigOptions } from "../../src/types";
import Widgets from "../../src/widgets/Widgets";
import { setPath } from "../helpers/getPath";
import { sanitize } from "../helpers/sanitize";

const feature = loadFeature(
  "../blackbox-testing/features/squatchjs/DeclarativeAPI.feature",
  {
    tagFilter: "@automated and not @cant-be-tested",
  }
);
const defaultInit = {
  tenantAlias: "",
  domain: "",
  npmCdn: "",
  debug: false,
};

const Background = (given) => {
  given(
    /^the following squatchjs loader script is in the "(.*)" tag$/,
    (arg0, docString) => {}
  );
};

defineFeature(feature, (test) => {
  beforeEach(() => {
    // Reset global squatchjs objects

    debug.disable();
    // @ts-ignore
    global._api = null;
    // @ts-ignore
    global._events = null;
    // @ts-ignore
    global._widgets = null;

    // @ts-ignore
    window.squatchTenant = "DEFAULT";
    // @ts-ignore
    window.squatchToken = "DEFAULT";
    // @ts-ignore
    window.squatchConfig = {};
  });
  afterAll(() => {
    jest.clearAllMocks();
  });

  test("AnalyticsApi defaults to window configuration", ({
    given,
    when,
    and,
    then,
  }) => {
    let api!: AnalyticsApi;
    Background(given);

    given(
      /^the following window.squatchConfig field (.*) is set to (.*)$/,
      (_field, _value) => {
        const field = sanitize(_field) as string;
        const value = sanitize(_value);

        // @ts-ignore
        window.squatchConfig = {
          [field]: value,
        };
      }
    );

    when(
      /^a AnalyticsApi instance is initialised with property (.*) with value (.*)$/,
      (arg0, arg1) => {
        const field = sanitize(arg0) as string;
        const value = sanitize(arg1);
        const input = {
          [field]: value,
        } as { domain: string };

        api = new AnalyticsApi(input);
      }
    );

    then(
      /^the property (.*) of the AnalyticsApi instance is set to (.*)$/,
      (arg0, arg1) => {
        const field = sanitize(arg0) as string;
        const value = sanitize(arg1);
        expect(api[field]).toBe(value);
      }
    );
  });
  test("Widgets defaults to window configuration", ({ given, when, then }) => {
    let api!: Widgets;
    let initError: Error | undefined = undefined;

    beforeEach(() => {
      initError = undefined;
    });

    const defaultConfig = {
      domain: "",
      tenantAlias: "",
      npmCdn: "",
    };

    Background(given);

    given(/^the following window field (.*) is set to (.*)$/, (arg0, arg1) => {
      const path = sanitize(arg0) as string;
      const value = sanitize(arg1);

      setPath(window, path, value);
    });

    when(
      /^a Widgets instance is initialised with property (.*) with value (.*)$/,
      (arg0, arg1) => {
        const field = sanitize(arg0) as string;
        const value = sanitize(arg1);

        const input = {
          ...defaultConfig,
          [field]: value,
        } as ConfigOptions;

        try {
          api = new Widgets(input);
        } catch (e) {
          initError = e;
        }
      }
    );

    then(
      /^the property (.*) of the Widgets instance is equal to (.*)$/,
      (arg0, arg1) => {
        const field = sanitize(arg0) as string;
        const value = sanitize(arg1) as string;

        if (value.includes("ERROR")) {
          expect(initError).toBeDefined();
          expect(initError?.message).toContain("not provided");
        } else {
          expect(api[field]).toBe(value);
          expect(initError).toBeUndefined();
        }
      }
    );
  });
  test("EventsApi defaults to window configuration", ({
    given,
    when,
    and,
    then,
  }) => {
    let api!: EventsApi;
    let initError: Error | undefined = undefined;

    beforeEach(() => {
      initError = undefined;
    });

    const defaultConfig = {
      domain: "",
      tenantAlias: "",
      npmCdn: "",
    };

    Background(given);

    given(/^the following window field (.*) is set to (.*)$/, (arg0, arg1) => {
      const path = sanitize(arg0) as string;
      const value = sanitize(arg1);

      setPath(window, path, value);
    });

    when(
      /^a EventsApi instance is initialised with property (.*) with value (.*)$/,
      (arg0, arg1) => {
        const field = sanitize(arg0) as string;
        const value = sanitize(arg1);

        const input = {
          ...defaultConfig,
          [field]: value,
        } as ConfigOptions;

        try {
          api = new EventsApi(input);
        } catch (e) {
          initError = e;
        }
      }
    );

    then(
      /^the property (.*) of the EventsApi instance is equal to (.*)$/,
      (arg0, arg1) => {
        const field = sanitize(arg0) as string;
        const value = sanitize(arg1) as string;

        if (value.includes("ERROR")) {
          expect(initError).toBeDefined();
          expect(initError?.message).toContain("not provided");
        } else {
          expect(api[field]).toBe(value);
          expect(initError).toBeUndefined();
        }
      }
    );
  });
  test("squatch.init defaults its values to the window configuration", ({
    given,
    and,
    when,
    then,
  }) => {
    let initObj: ConfigOptions;
    let initError: Error | undefined;

    beforeEach(() => {
      initError = undefined;
    });

    Background(given);

    given(/^the following window field (.*) is set to (.*)$/, (arg0, arg1) => {
      const path = sanitize(arg0) as string;
      const value = sanitize(arg1);

      setPath(window, path, value);
    });

    and(
      /^the init config object has field (.*) with value (.*)$/,
      (arg0, arg1) => {
        const field = sanitize(arg0) as string;
        const value = sanitize(arg1);

        initObj = {
          ...defaultInit,
          [field]: value,
        };
      }
    );

    when("squatch.init is called with the init config as a parameter", () => {
      try {
        squatchjs.init(initObj);
      } catch (e) {
        initError = e?.message;
      }
    });

    then(/^the WidgetApi instance has (.*) equal to (.*)$/, (arg0, arg1) => {
      const field = sanitize(arg0) as string;
      const value = sanitize(arg1) as string;

      if (value.includes("ERROR")) {
        expect(initError).toContain("not provided");
      } else {
        const answer = squatchjs.api()?.[field];
        expect(answer).toBe(value);
      }
    });

    then(/^the Widgets instance has (.*) equal to (.*)$/, (arg0, arg1) => {
      const field = sanitize(arg0) as string;
      const value = sanitize(arg1) as string;

      if (value.includes("ERROR")) {
        expect(initError).toContain("not provided");
      } else {
        const answer = squatchjs.widgets()?.[field];
        expect(answer).toBe(value);
      }
    });

    then(
      /^the EventsApi instance has (.*) equal to (.*) if it exists as a property$/,
      (arg0, arg1) => {
        const field = sanitize(arg0) as string;
        const value = sanitize(arg1) as string;

        if (value.includes("ERROR")) {
          expect(initError).toContain("not provided");
        } else {
          // !: No npmCdn property on the EventsApi class
          if (field === "npmCdn") return;

          const answer = squatchjs.events()?.[field];
          expect(answer).toBe(value);
        }
      }
    );
  });
  test("squatch.init defaults its debug value to the window configuration", ({
    given,
    and,
    when,
    then,
  }) => {
    let initConfig: ConfigOptions;

    Background(given);

    given(/^squatchConfig.debug is set to (.*)$/, (arg0) => {
      const value = sanitize(arg0);

      // @ts-ignore
      window.squatchConfig.debug = value;
    });

    and(/^the init config has debug set to (.*)$/, (arg0) => {
      const value = sanitize(arg0) as boolean;
      initConfig = { ...defaultInit, debug: value };
    });

    when("squatch.init is called with the init config as a parameter", () => {
      squatchjs.init(initConfig);
    });

    then(
      /^debugging information (.*) displayed in the debug console$/,
      (arg0) => {
        const mayOrNot = sanitize(arg0);

        const enabled = debug("squatch-js").enabled;
        if (mayOrNot === "is") {
          expect(enabled).toBe(true);
        } else if (mayOrNot === "is not") {
          expect(enabled).toBe(false);
        } else {
          fail();
        }
      }
    );
  });

  // CA: Ideally this can be tested with jest.spyOn(squatchjs, "init")
  //     however there isn't a good way to mock the init for a single test

  // test("Squatchjs API methods if squatch.init hasn't been called", ({
  //   given,
  //   when,
  //   then,
  //   and,
  // }) => {
  //   Background(given);

  //   given("I have not called squatch.init or a squatchjs API method", () => {
  //     // @ts-ignore
  //     expect(global._api).toBeNull();
  //     // @ts-ignore
  //     expect(global._widgets).toBeNull();
  //     // @ts-ignore
  //     expect(global._events).toBeNull();
  //   });

  //   when(/^I call (.*)$/, (arg0) => {
  //     const method = sanitize(arg0);

  //     if (method === "squatch.api") {
  //       squatchjs.api();
  //     } else if (method === "squatch.widgets") {
  //       squatchjs.widgets();
  //     } else if (method === "squatch.events") {
  //       squatchjs.events();
  //     } else {
  //       fail();
  //     }
  //   });

  //   then("squatchjs implicitly calls squatch.init", () => {
  //     expect(squatchjs.init).toBeCalled();
  //   });

  //   and("the init method is passed an empty initial config", (arg0, arg1) => {
  //     expect(squatchjs.init).toBeCalledWith({});
  //   });
  // });
});
