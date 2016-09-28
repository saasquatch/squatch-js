(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["squatch"] = factory();
	else
		root["squatch"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.api = exports.OpenApi = undefined;

	var _OpenApi = __webpack_require__(2);

	Object.defineProperty(exports, 'OpenApi', {
	  enumerable: true,
	  get: function get() {
	    return _OpenApi.OpenApi;
	  }
	});
	exports.init = init;
	exports.ready = ready;

	var _Widget = __webpack_require__(16);

	var _async = __webpack_require__(31);

	var _store = __webpack_require__(33);

	var _store2 = _interopRequireDefault(_store);

	var _debug = __webpack_require__(34);

	var _debug2 = _interopRequireDefault(_debug);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	_debug2.default.disable('squatch-js*'); /**
	                                         * Squatch.js is the Referral SaaSquatch javascript SDK and a one-stop shop to integrate a referral program into your website or web app.
	                                         * It can show referral widgets on any website, track users, generate unique referral short links and referral codes, and more.
	                                         *
	                                         * @module squatch
	                                         */

	var _log = (0, _debug2.default)('squatch-js');

	/**
	 * Initializes a static `squatch` global. This sets up:
	 *
	 *  - `api` a static instance of the {@link OpenApi}
	 *
	 * @param {Object} config Configuration details
	 * @param {string} config.tenant_alias The tenant alias connects to your account. Note: There are both *live* and *test* tenant aliases.
	 * @returns {void}
	 * @example
	 * squatch.init({tenant_alias:'test_basbtabstq51v'});
	 */
	function init(config) {
	  if (config.tenant_alias.startsWith('ayw' /*'test'*/)) {
	    _debug2.default.enable('squatch-js*');
	  }

	  _log('initializing ...');
	  exports.api = api = new _OpenApi.OpenApi({
	    tenantAlias: config.tenant_alias
	  });

	  api.createCookieUser('text/html').then(function (response) {
	    _log('cookie user created');
	    if (config.mode) {
	      loadWidget(config.element, response, config.mode);
	    } else {
	      _log('cookie user:' + JSON.stringify(response));
	    }
	  }).catch(function (ex) {
	    _log(new Error('createCookieUser() ' + ex));
	  });

	  // api.upsertUser(config.user).then(function(response) {
	  //   console.log(response);
	  //   store.set('sqh_user', response);
	  // }).catch(function(ex) {
	  //   console.log(ex);
	  // });
	}

	/**
	 * Static instance of the {@link OpenApi}. Make sure you call {@link #init init} first
	 *
	 * @type {OpenApi}
	 * @example
	 * squatch.init({tenant_alias:'test_basbtabstq51v'});
	 * squatch.api.createUser({id:'123', accountId:'abc', firstName:'Tom'});
	 */
	var api = exports.api = null;

	function ready(fn) {
	  fn();
	}

	function loadWidget(element, content, mode) {
	  var embed = void 0;
	  var popup = void 0;

	  if (mode === 'EMBED') {
	    embed = new _Widget.EmbedWidget(content).load();
	  } else if (mode === 'POPUP') {
	    popup = new _Widget.PopupWidget(content).load();
	  }
	}

	if (window) (0, _async.asyncLoad)();

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.OpenApi = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _jsonschema = __webpack_require__(3);

	var _schema = __webpack_require__(13);

	var _schema2 = _interopRequireDefault(_schema);

	__webpack_require__(14);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 *
	 * The OpenApi class is a wrapper around the Open Endpoints of the SaaSquatch REST API.
	 *
	 * The Open Endpoints in the SaaSquatch REST API are endpoints designed to work
	 * in client applications like the Mobile SDK and Javascript SDK.
	 * Authentication relies on a User JWT and some API endpoints are unauthenticated.
	 * Even though the Open Endpoints are designed for client applications, they can
	 * still be used in server-to-server cases using API Key authentication.
	 *
	 */
	var OpenApi = exports.OpenApi = function () {

	  //TODO:
	  // - Authenticate with JWT
	  // - Add comments

	  /**
	   * Initialize a new {@link OpenApi} instance.
	   *
	   * @param {Object} config Config details
	   * @param {string} config.tenantAlias The tenant to access
	   * @param {string} [config.domain='https://app.referralsaasquatch.com'] The server domain.
	   *    Useful if you want to use a proxy like {@link https://requestb.in/ RequestBin} or {@link https://runscope.com/ Runscope}.
	   *
	   * @example <caption>Browser example</caption>
	   * var squatchApi = new squatch.OpenApi({tenantAlias:'test_12b5bo1b25125');
	   *
	   * @example <caption>Browserify/Webpack example</caption>
	   * var OpenApi = require('squatch-js').OpenApi;
	   * var squatchApi = new OpenApi({tenantAlias:'test_12b5bo1b25125');
	   *
	   * @example <caption>Babel+Browserify/Webpack example</caption>
	   * import {OpenApi} from 'squatch-js';
	   * let squatchApi = new OpenApi({tenantAlias:'test_12b5bo1b25125');
	   */
	  function OpenApi(config) {
	    _classCallCheck(this, OpenApi);

	    this.tenantAlias = config.tenantAlias;
	    this.domain = "https://staging.referralsaasquatch.com";
	  }

	  /**
	   * This method creates a user and an account in one call. Because this call creates a user, it requires either a write token or an API key.
	   * This is an Open Endpoint and disabled by default. Contact support to enable the open endpoints.
	   *
	   * {@link https://docs.referralsaasquatch.com/api/methods/#open_list_referrals List Referrals}
	   *
	   * @param {Object} params The User/Account
	   * @param {string} params.id the ID of user to be created
	   * @param {string} params.accountId the ID of account to be created
	   * @return {Promise<User>} details of the user create
	   */


	  _createClass(OpenApi, [{
	    key: 'createUser',
	    value: function createUser(params) {
	      this._validateInput(params, _schema2.default.user);

	      var tenant_alias = encodeURIComponent(this.tenantAlias);
	      var account_id = encodeURIComponent(params.accountId);
	      var user_id = encodeURIComponent(params.id);

	      var path = '/api/v1/' + tenant_alias + '/open/account/' + account_id + '/user/' + user_id;
	      var url = this.domain + path;
	      return this._doPost(url, JSON.stringify(params), 'application/json');
	    }
	  }, {
	    key: 'upsertUser',
	    value: function upsertUser(params) {
	      console.log(params);
	      this._validateInput(params, _schema2.default.user);

	      var tenant_alias = encodeURIComponent(this.tenantAlias);
	      var account_id = encodeURIComponent(params.accountId);
	      var user_id = encodeURIComponent(params.id);

	      var path = '/api/v1/' + tenant_alias + '/open/account/' + account_id + '/user/' + user_id;
	      var url = this.domain + path;
	      return this._doPut(url, JSON.stringify(params), 'application/json');
	    }
	  }, {
	    key: 'createCookieUser',
	    value: function createCookieUser() {
	      var params = arguments.length <= 0 || arguments[0] === undefined ? 'text/html' : arguments[0];

	      var responseType = params;
	      var tenant_alias = encodeURIComponent(this.tenantAlias);

	      var path = '/api/v1/' + tenant_alias + '/open/user/cookie_user';
	      var url = this.domain + path;
	      return this._doPost(url, JSON.stringify({}), responseType);
	    }

	    /**
	     * Looks up a user based upon their id and returns their personal information including sharelinks. This endpoint requires a read token or an API key.
	     *
	     * This is an Open Endpoint and disabled by default. Contact support to enable the open endpoints.
	     *
	     * {@link https://docs.referralsaasquatch.com/api/methods/#open_get_user Open API Spec}
	     *
	     * @param {Object} params The User/Account
	     * @param {string} params.id the ID of user to look up
	     * @param {string} params.accountId the ID of account to look up
	     * @return {Promise<User>} User details
	     */

	  }, {
	    key: 'lookUpUser',
	    value: function lookUpUser(params) {
	      this._validateInput(params, _schema2.default.userLookUp);

	      var tenant_alias = encodeURIComponent(this.tenantAlias);
	      var account_id = encodeURIComponent(params.accountId);
	      var user_id = encodeURIComponent(params.id);

	      var path = '/api/v1/' + tenant_alias + '/open/account/' + account_id + '/user/' + user_id;
	      var url = this.domain + path;
	      return this._doRequest(url);
	    }

	    /**
	     * Looks up a user by their Referral Code
	     *
	     * @param {Object} params stuff
	     * @param {string} params.referralCode the code used to look up a user
	     * @return {Promise} User details
	     */

	  }, {
	    key: 'getUserByReferralCode',
	    value: function getUserByReferralCode(params) {
	      this._validateInput(params, _schema2.default.userReferralCode);

	      var tenant_alias = encodeURIComponent(this.tenantAlias);
	      var referral_code = encodeURIComponent(params.referralCode);

	      var path = '/api/v1/' + tenant_alias + '/open/user?referralCode=' + referral_code;
	      var url = this.domain + path;
	      return this._doRequest(url);
	    }

	    /**
	     * Looks up a referral code
	     *
	     * @param {Object} params stuff
	     * @param {string} params.referralCode the code used to look up a code
	     * @return {Promise} User details
	     */

	  }, {
	    key: 'lookUpReferralCode',
	    value: function lookUpReferralCode(params) {
	      this._validateInput(params, _schema2.default.userReferralCode);

	      var tenant_alias = encodeURIComponent(this.tenantAlias);
	      var referral_code = encodeURIComponent(params.referralCode);

	      var path = '/api/v1/' + tenant_alias + '/open/code/' + referral_code;
	      var url = this.domain + path;
	      return this._doRequest(url);
	    }

	    /**
	     * Applies a referral code
	     *
	     * @param {Object} params stuff
	     * @param {string} params.id the ID of the User that is referred
	     * @param {string} params.accountId the Account ID of the User that is referred
	     * @param {string} params.referralCode the code to apply
	     * @return {Promise} Stuff
	     */

	  }, {
	    key: 'applyReferralCode',
	    value: function applyReferralCode(params) {
	      this._validateInput(params, _schema2.default.applyReferralCode);

	      var tenant_alias = encodeURIComponent(this.tenantAlias);
	      var referral_code = encodeURIComponent(params.referralCode);
	      var account_id = encodeURIComponent(params.accountId);
	      var user_id = encodeURIComponent(params.id);

	      var path = '/api/v1/' + tenant_alias + '/open/code/' + referral_code + '/account/' + account_id + '/user/' + user_id;
	      var url = this.domain + path;
	      return this._doPost(url, JSON.stringify(""), 'application/json');
	    }

	    /**
	     * Lists referrals
	     *
	     * @return {Promise} Stuff
	     */

	  }, {
	    key: 'listReferrals',
	    value: function listReferrals() {
	      var tenant_alias = encodeURIComponent(this.tenantAlias);

	      var path = '/api/v1/' + tenant_alias + '/open/referrals';
	      var url = this.domain + path;
	      return this._doRequest(url);
	    }

	    /**
	     * @private
	     */

	  }, {
	    key: '_validateInput',
	    value: function _validateInput(params, schema) {
	      var valid = (0, _jsonschema.validate)(params, schema);
	      if (!valid.valid) throw valid.errors;
	    }

	    /**
	     * @private
	     */

	  }, {
	    key: '_doRequest',
	    value: function _doRequest(url) {
	      return fetch(url, {
	        method: 'GET',
	        headers: {
	          'Accept': 'application/json',
	          'Content-Type': 'application/json'
	        }
	      }).then(function (response) {
	        return response.json();
	      });
	    }

	    /**
	     * @private
	     */

	  }, {
	    key: '_doPost',
	    value: function _doPost(url, data, responseType) {
	      return fetch(url, {
	        method: 'POST',
	        headers: {
	          'Accept': responseType,
	          'Content-Type': 'application/json'
	        },
	        body: data
	      }).then(function (response) {
	        if (responseType === 'text/html') {
	          return response.text();
	        } else {
	          return response.json();
	        }
	      });
	    }

	    /**
	     * @private
	     */

	  }, {
	    key: '_doPut',
	    value: function _doPut(url, data, responseType) {
	      return fetch(url, {
	        method: 'PUT',
	        headers: {
	          'Accept': responseType,
	          'Content-Type': 'application/json',
	          'X-SaaSquatch-User-Token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImFjY291bnRJZCI6ImFiYyIsImlkIjoiNTY3OCIsImVtYWlsIjoiam9yZ2VAcmVmZXJyYWwuY29tIiwiZmlyc3ROYW1lIjoiSm9yZ2UiLCJsYXN0TmFtZSI6IkNvbmRlIn19.ykHYlj-5akvJlZYtGPb7Fv6CXIkza7IWRjoRNpjMyq0'
	        },
	        credentials: 'cors',
	        body: data
	      }).then(function (response) {
	        if (responseType === 'text/html') {
	          return response.text();
	        } else {
	          return response.json();
	        }
	      });
	    }
	  }]);

	  return OpenApi;
	}();

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Validator = module.exports.Validator = __webpack_require__(4);

	module.exports.ValidatorResult = __webpack_require__(12).ValidatorResult;
	module.exports.ValidationError = __webpack_require__(12).ValidationError;
	module.exports.SchemaError = __webpack_require__(12).SchemaError;

	module.exports.validate = function (instance, schema, options) {
	  var v = new Validator();
	  return v.validate(instance, schema, options);
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var urilib = __webpack_require__(5);

	var attribute = __webpack_require__(11);
	var helpers = __webpack_require__(12);
	var ValidatorResult = helpers.ValidatorResult;
	var SchemaError = helpers.SchemaError;
	var SchemaContext = helpers.SchemaContext;

	/**
	 * Creates a new Validator object
	 * @name Validator
	 * @constructor
	 */
	var Validator = function Validator () {
	  // Allow a validator instance to override global custom formats or to have their
	  // own custom formats.
	  this.customFormats = Object.create(Validator.prototype.customFormats);
	  this.schemas = {};
	  this.unresolvedRefs = [];

	  // Use Object.create to make this extensible without Validator instances stepping on each other's toes.
	  this.types = Object.create(types);
	  this.attributes = Object.create(attribute.validators);
	};

	// Allow formats to be registered globally.
	Validator.prototype.customFormats = {};

	// Hint at the presence of a property
	Validator.prototype.schemas = null;
	Validator.prototype.types = null;
	Validator.prototype.attributes = null;
	Validator.prototype.unresolvedRefs = null;

	/**
	 * Adds a schema with a certain urn to the Validator instance.
	 * @param schema
	 * @param urn
	 * @return {Object}
	 */
	Validator.prototype.addSchema = function addSchema (schema, uri) {
	  if (!schema) {
	    return null;
	  }
	  var ourUri = uri || schema.id;
	  this.addSubSchema(ourUri, schema);
	  if (ourUri) {
	    this.schemas[ourUri] = schema;
	  }
	  return this.schemas[ourUri];
	};

	Validator.prototype.addSubSchema = function addSubSchema(baseuri, schema) {
	  if(!schema || typeof schema!='object') return;
	  // Mark all referenced schemas so we can tell later which schemas are referred to, but never defined
	  if(schema.$ref){
	    var resolvedUri = urilib.resolve(baseuri, schema.$ref);
	    // Only mark unknown schemas as unresolved
	    if (this.schemas[resolvedUri] === undefined) {
	      this.schemas[resolvedUri] = null;
	      this.unresolvedRefs.push(resolvedUri);
	    }
	    return;
	  }
	  var ourUri = schema.id && urilib.resolve(baseuri, schema.id);
	  var ourBase = ourUri || baseuri;
	  if (ourUri) {
	    if(this.schemas[ourUri]){
	      if(!helpers.deepCompareStrict(this.schemas[ourUri], schema)){
	        throw new Error('Schema <'+schema+'> already exists with different definition');
	      }
	      return this.schemas[ourUri];
	    }
	    this.schemas[ourUri] = schema;
	    var documentUri = ourUri.replace(/^([^#]*)#$/, '$1');
	    this.schemas[documentUri] = schema;
	  }
	  this.addSubSchemaArray(ourBase, ((schema.items instanceof Array)?schema.items:[schema.items]));
	  this.addSubSchemaArray(ourBase, ((schema.extends instanceof Array)?schema.extends:[schema.extends]));
	  this.addSubSchema(ourBase, schema.additionalItems);
	  this.addSubSchemaObject(ourBase, schema.properties);
	  this.addSubSchema(ourBase, schema.additionalProperties);
	  this.addSubSchemaObject(ourBase, schema.definitions);
	  this.addSubSchemaObject(ourBase, schema.patternProperties);
	  this.addSubSchemaObject(ourBase, schema.dependencies);
	  this.addSubSchemaArray(ourBase, schema.disallow);
	  this.addSubSchemaArray(ourBase, schema.allOf);
	  this.addSubSchemaArray(ourBase, schema.anyOf);
	  this.addSubSchemaArray(ourBase, schema.oneOf);
	  this.addSubSchema(ourBase, schema.not);
	  return this.schemas[ourUri];
	};

	Validator.prototype.addSubSchemaArray = function addSubSchemaArray(baseuri, schemas) {
	  if(!(schemas instanceof Array)) return;
	  for(var i=0; i<schemas.length; i++){
	    this.addSubSchema(baseuri, schemas[i]);
	  }
	};

	Validator.prototype.addSubSchemaObject = function addSubSchemaArray(baseuri, schemas) {
	  if(!schemas || typeof schemas!='object') return;
	  for(var p in schemas){
	    this.addSubSchema(baseuri, schemas[p]);
	  }
	};



	/**
	 * Sets all the schemas of the Validator instance.
	 * @param schemas
	 */
	Validator.prototype.setSchemas = function setSchemas (schemas) {
	  this.schemas = schemas;
	};

	/**
	 * Returns the schema of a certain urn
	 * @param urn
	 */
	Validator.prototype.getSchema = function getSchema (urn) {
	  return this.schemas[urn];
	};

	/**
	 * Validates instance against the provided schema
	 * @param instance
	 * @param schema
	 * @param [options]
	 * @param [ctx]
	 * @return {Array}
	 */
	Validator.prototype.validate = function validate (instance, schema, options, ctx) {
	  if (!options) {
	    options = {};
	  }
	  var propertyName = options.propertyName || 'instance';
	  // This will work so long as the function at uri.resolve() will resolve a relative URI to a relative URI
	  var base = urilib.resolve(options.base||'/', schema.id||'');
	  if(!ctx){
	    ctx = new SchemaContext(schema, options, propertyName, base, Object.create(this.schemas));
	    if (!ctx.schemas[base]) {
	      ctx.schemas[base] = schema;
	    }
	  }
	  if (schema) {
	    var result = this.validateSchema(instance, schema, options, ctx);
	    if (!result) {
	      throw new Error('Result undefined');
	    }
	    return result;
	  }
	  throw new SchemaError('no schema specified', schema);
	};

	/**
	 * Validates an instance against the schema (the actual work horse)
	 * @param instance
	 * @param schema
	 * @param options
	 * @param ctx
	 * @private
	 * @return {ValidatorResult}
	 */
	Validator.prototype.validateSchema = function validateSchema (instance, schema, options, ctx) {
	  var self = this;
	  var result = new ValidatorResult(instance, schema, options, ctx);
	  if (!schema) {
	    throw new Error("schema is undefined");
	  }

	  /**
	  * @param Object schema
	  * @return mixed schema uri or false
	  */
	  function shouldResolve(schema) {
	    var ref = (typeof schema === 'string') ? schema : schema.$ref;
	    if (typeof ref=='string') return ref;
	    return false;
	  }
	  /**
	  * @param Object schema
	  * @param SchemaContext ctx
	  * @returns Object schema or resolved schema
	  */
	  function resolve(schema, ctx) {
	    var ref;
	    if(ref = shouldResolve(schema)) {
	      return self.resolve(schema, ref, ctx).subschema;
	    }
	    return schema;
	  }

	  if (schema['extends']) {
	    if (schema['extends'] instanceof Array) {
	      schema['extends'].forEach(function (s) {
	        schema = helpers.deepMerge(schema, resolve(s, ctx));
	      });
	    } else {
	      schema = helpers.deepMerge(schema, resolve(schema['extends'], ctx));
	    }
	  }

	  var switchSchema;
	  if (switchSchema = shouldResolve(schema)) {
	    var resolved = this.resolve(schema, switchSchema, ctx);
	    var subctx = new SchemaContext(resolved.subschema, options, ctx.propertyPath, resolved.switchSchema, ctx.schemas);
	    return this.validateSchema(instance, resolved.subschema, options, subctx);
	  }

	  var skipAttributes = options && options.skipAttributes || [];
	  // Validate each schema attribute against the instance
	  for (var key in schema) {
	    if (!attribute.ignoreProperties[key] && skipAttributes.indexOf(key) < 0) {
	      var validatorErr = null;
	      var validator = self.attributes[key];
	      if (validator) {
	        validatorErr = validator.call(self, instance, schema, options, ctx);
	      } else if (options.allowUnknownAttributes === false) {
	        // This represents an error with the schema itself, not an invalid instance
	        throw new SchemaError("Unsupported attribute: " + key, schema);
	      }
	      if (validatorErr) {
	        result.importErrors(validatorErr);
	      }
	    }
	  }

	  if (typeof options.rewrite == 'function') {
	    var value = options.rewrite.call(this, instance, schema, options, ctx);
	    result.instance = value;
	  }
	  return result;
	};

	/**
	* @private
	* @param Object schema
	* @param Object switchSchema
	* @param SchemaContext ctx
	* @return Object resolved schemas {subschema:String, switchSchema: String}
	* @thorws SchemaError
	*/
	Validator.prototype.resolve = function resolve (schema, switchSchema, ctx) {
	  switchSchema = ctx.resolve(switchSchema);
	  // First see if the schema exists under the provided URI
	  if (ctx.schemas[switchSchema]) {
	    return {subschema: ctx.schemas[switchSchema], switchSchema: switchSchema};
	  }
	  // Else try walking the property pointer
	  var parsed = urilib.parse(switchSchema);
	  var fragment = parsed && parsed.hash;
	  var document = fragment && fragment.length && switchSchema.substr(0, switchSchema.length - fragment.length);
	  if (!document || !ctx.schemas[document]) {
	    throw new SchemaError("no such schema <" + switchSchema + ">", schema);
	  }
	  var subschema = helpers.objectGetPath(ctx.schemas[document], fragment.substr(1));
	  if(subschema===undefined){
	    throw new SchemaError("no such schema " + fragment + " located in <" + document + ">", schema);
	  }
	  return {subschema: subschema, switchSchema: switchSchema};
	};

	/**
	 * Tests whether the instance if of a certain type.
	 * @private
	 * @param instance
	 * @param schema
	 * @param options
	 * @param ctx
	 * @param type
	 * @return {boolean}
	 */
	Validator.prototype.testType = function validateType (instance, schema, options, ctx, type) {
	  if (typeof this.types[type] == 'function') {
	    return this.types[type].call(this, instance);
	  }
	  if (type && typeof type == 'object') {
	    var res = this.validateSchema(instance, type, options, ctx);
	    return res === undefined || !(res && res.errors.length);
	  }
	  // Undefined or properties not on the list are acceptable, same as not being defined
	  return true;
	};

	var types = Validator.prototype.types = {};
	types.string = function testString (instance) {
	  return typeof instance == 'string';
	};
	types.number = function testNumber (instance) {
	  // isFinite returns false for NaN, Infinity, and -Infinity
	  return typeof instance == 'number' && isFinite(instance);
	};
	types.integer = function testInteger (instance) {
	  return (typeof instance == 'number') && instance % 1 === 0;
	};
	types.boolean = function testBoolean (instance) {
	  return typeof instance == 'boolean';
	};
	types.array = function testArray (instance) {
	  return instance instanceof Array;
	};
	types['null'] = function testNull (instance) {
	  return instance === null;
	};
	types.date = function testDate (instance) {
	  return instance instanceof Date;
	};
	types.any = function testAny (instance) {
	  return true;
	};
	types.object = function testObject (instance) {
	  // TODO: fix this - see #15
	  return instance && (typeof instance) === 'object' && !(instance instanceof Array) && !(instance instanceof Date);
	};

	module.exports = Validator;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	var punycode = __webpack_require__(6);

	exports.parse = urlParse;
	exports.resolve = urlResolve;
	exports.resolveObject = urlResolveObject;
	exports.format = urlFormat;

	exports.Url = Url;

	function Url() {
	  this.protocol = null;
	  this.slashes = null;
	  this.auth = null;
	  this.host = null;
	  this.port = null;
	  this.hostname = null;
	  this.hash = null;
	  this.search = null;
	  this.query = null;
	  this.pathname = null;
	  this.path = null;
	  this.href = null;
	}

	// Reference: RFC 3986, RFC 1808, RFC 2396

	// define these here so at least they only have to be
	// compiled once on the first module load.
	var protocolPattern = /^([a-z0-9.+-]+:)/i,
	    portPattern = /:[0-9]*$/,

	    // RFC 2396: characters reserved for delimiting URLs.
	    // We actually just auto-escape these.
	    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

	    // RFC 2396: characters not allowed for various reasons.
	    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

	    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
	    autoEscape = ['\''].concat(unwise),
	    // Characters that are never ever allowed in a hostname.
	    // Note that any invalid chars are also handled, but these
	    // are the ones that are *expected* to be seen, so we fast-path
	    // them.
	    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
	    hostEndingChars = ['/', '?', '#'],
	    hostnameMaxLen = 255,
	    hostnamePartPattern = /^[a-z0-9A-Z_-]{0,63}$/,
	    hostnamePartStart = /^([a-z0-9A-Z_-]{0,63})(.*)$/,
	    // protocols that can allow "unsafe" and "unwise" chars.
	    unsafeProtocol = {
	      'javascript': true,
	      'javascript:': true
	    },
	    // protocols that never have a hostname.
	    hostlessProtocol = {
	      'javascript': true,
	      'javascript:': true
	    },
	    // protocols that always contain a // bit.
	    slashedProtocol = {
	      'http': true,
	      'https': true,
	      'ftp': true,
	      'gopher': true,
	      'file': true,
	      'http:': true,
	      'https:': true,
	      'ftp:': true,
	      'gopher:': true,
	      'file:': true
	    },
	    querystring = __webpack_require__(8);

	function urlParse(url, parseQueryString, slashesDenoteHost) {
	  if (url && isObject(url) && url instanceof Url) return url;

	  var u = new Url;
	  u.parse(url, parseQueryString, slashesDenoteHost);
	  return u;
	}

	Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
	  if (!isString(url)) {
	    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
	  }

	  var rest = url;

	  // trim before proceeding.
	  // This is to support parse stuff like "  http://foo.com  \n"
	  rest = rest.trim();

	  var proto = protocolPattern.exec(rest);
	  if (proto) {
	    proto = proto[0];
	    var lowerProto = proto.toLowerCase();
	    this.protocol = lowerProto;
	    rest = rest.substr(proto.length);
	  }

	  // figure out if it's got a host
	  // user@server is *always* interpreted as a hostname, and url
	  // resolution will treat //foo/bar as host=foo,path=bar because that's
	  // how the browser resolves relative URLs.
	  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
	    var slashes = rest.substr(0, 2) === '//';
	    if (slashes && !(proto && hostlessProtocol[proto])) {
	      rest = rest.substr(2);
	      this.slashes = true;
	    }
	  }

	  if (!hostlessProtocol[proto] &&
	      (slashes || (proto && !slashedProtocol[proto]))) {

	    // there's a hostname.
	    // the first instance of /, ?, ;, or # ends the host.
	    //
	    // If there is an @ in the hostname, then non-host chars *are* allowed
	    // to the left of the last @ sign, unless some host-ending character
	    // comes *before* the @-sign.
	    // URLs are obnoxious.
	    //
	    // ex:
	    // http://a@b@c/ => user:a@b host:c
	    // http://a@b?@c => user:a host:c path:/?@c

	    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
	    // Review our test case against browsers more comprehensively.

	    // find the first instance of any hostEndingChars
	    var hostEnd = -1;
	    for (var i = 0; i < hostEndingChars.length; i++) {
	      var hec = rest.indexOf(hostEndingChars[i]);
	      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
	        hostEnd = hec;
	    }

	    // at this point, either we have an explicit point where the
	    // auth portion cannot go past, or the last @ char is the decider.
	    var auth, atSign;
	    if (hostEnd === -1) {
	      // atSign can be anywhere.
	      atSign = rest.lastIndexOf('@');
	    } else {
	      // atSign must be in auth portion.
	      // http://a@b/c@d => host:b auth:a path:/c@d
	      atSign = rest.lastIndexOf('@', hostEnd);
	    }

	    // Now we have a portion which is definitely the auth.
	    // Pull that off.
	    if (atSign !== -1) {
	      auth = rest.slice(0, atSign);
	      rest = rest.slice(atSign + 1);
	      this.auth = decodeURIComponent(auth);
	    }

	    // the host is the remaining to the left of the first non-host char
	    hostEnd = -1;
	    for (var i = 0; i < nonHostChars.length; i++) {
	      var hec = rest.indexOf(nonHostChars[i]);
	      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
	        hostEnd = hec;
	    }
	    // if we still have not hit it, then the entire thing is a host.
	    if (hostEnd === -1)
	      hostEnd = rest.length;

	    this.host = rest.slice(0, hostEnd);
	    rest = rest.slice(hostEnd);

	    // pull out port.
	    this.parseHost();

	    // we've indicated that there is a hostname,
	    // so even if it's empty, it has to be present.
	    this.hostname = this.hostname || '';

	    // if hostname begins with [ and ends with ]
	    // assume that it's an IPv6 address.
	    var ipv6Hostname = this.hostname[0] === '[' &&
	        this.hostname[this.hostname.length - 1] === ']';

	    // validate a little.
	    if (!ipv6Hostname) {
	      var hostparts = this.hostname.split(/\./);
	      for (var i = 0, l = hostparts.length; i < l; i++) {
	        var part = hostparts[i];
	        if (!part) continue;
	        if (!part.match(hostnamePartPattern)) {
	          var newpart = '';
	          for (var j = 0, k = part.length; j < k; j++) {
	            if (part.charCodeAt(j) > 127) {
	              // we replace non-ASCII char with a temporary placeholder
	              // we need this to make sure size of hostname is not
	              // broken by replacing non-ASCII by nothing
	              newpart += 'x';
	            } else {
	              newpart += part[j];
	            }
	          }
	          // we test again with ASCII char only
	          if (!newpart.match(hostnamePartPattern)) {
	            var validParts = hostparts.slice(0, i);
	            var notHost = hostparts.slice(i + 1);
	            var bit = part.match(hostnamePartStart);
	            if (bit) {
	              validParts.push(bit[1]);
	              notHost.unshift(bit[2]);
	            }
	            if (notHost.length) {
	              rest = '/' + notHost.join('.') + rest;
	            }
	            this.hostname = validParts.join('.');
	            break;
	          }
	        }
	      }
	    }

	    if (this.hostname.length > hostnameMaxLen) {
	      this.hostname = '';
	    } else {
	      // hostnames are always lower case.
	      this.hostname = this.hostname.toLowerCase();
	    }

	    if (!ipv6Hostname) {
	      // IDNA Support: Returns a puny coded representation of "domain".
	      // It only converts the part of the domain name that
	      // has non ASCII characters. I.e. it dosent matter if
	      // you call it with a domain that already is in ASCII.
	      var domainArray = this.hostname.split('.');
	      var newOut = [];
	      for (var i = 0; i < domainArray.length; ++i) {
	        var s = domainArray[i];
	        newOut.push(s.match(/[^A-Za-z0-9_-]/) ?
	            'xn--' + punycode.encode(s) : s);
	      }
	      this.hostname = newOut.join('.');
	    }

	    var p = this.port ? ':' + this.port : '';
	    var h = this.hostname || '';
	    this.host = h + p;
	    this.href += this.host;

	    // strip [ and ] from the hostname
	    // the host field still retains them, though
	    if (ipv6Hostname) {
	      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
	      if (rest[0] !== '/') {
	        rest = '/' + rest;
	      }
	    }
	  }

	  // now rest is set to the post-host stuff.
	  // chop off any delim chars.
	  if (!unsafeProtocol[lowerProto]) {

	    // First, make 100% sure that any "autoEscape" chars get
	    // escaped, even if encodeURIComponent doesn't think they
	    // need to be.
	    for (var i = 0, l = autoEscape.length; i < l; i++) {
	      var ae = autoEscape[i];
	      var esc = encodeURIComponent(ae);
	      if (esc === ae) {
	        esc = escape(ae);
	      }
	      rest = rest.split(ae).join(esc);
	    }
	  }


	  // chop off from the tail first.
	  var hash = rest.indexOf('#');
	  if (hash !== -1) {
	    // got a fragment string.
	    this.hash = rest.substr(hash);
	    rest = rest.slice(0, hash);
	  }
	  var qm = rest.indexOf('?');
	  if (qm !== -1) {
	    this.search = rest.substr(qm);
	    this.query = rest.substr(qm + 1);
	    if (parseQueryString) {
	      this.query = querystring.parse(this.query);
	    }
	    rest = rest.slice(0, qm);
	  } else if (parseQueryString) {
	    // no query string, but parseQueryString still requested
	    this.search = '';
	    this.query = {};
	  }
	  if (rest) this.pathname = rest;
	  if (slashedProtocol[lowerProto] &&
	      this.hostname && !this.pathname) {
	    this.pathname = '/';
	  }

	  //to support http.request
	  if (this.pathname || this.search) {
	    var p = this.pathname || '';
	    var s = this.search || '';
	    this.path = p + s;
	  }

	  // finally, reconstruct the href based on what has been validated.
	  this.href = this.format();
	  return this;
	};

	// format a parsed object into a url string
	function urlFormat(obj) {
	  // ensure it's an object, and not a string url.
	  // If it's an obj, this is a no-op.
	  // this way, you can call url_format() on strings
	  // to clean up potentially wonky urls.
	  if (isString(obj)) obj = urlParse(obj);
	  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
	  return obj.format();
	}

	Url.prototype.format = function() {
	  var auth = this.auth || '';
	  if (auth) {
	    auth = encodeURIComponent(auth);
	    auth = auth.replace(/%3A/i, ':');
	    auth += '@';
	  }

	  var protocol = this.protocol || '',
	      pathname = this.pathname || '',
	      hash = this.hash || '',
	      host = false,
	      query = '';

	  if (this.host) {
	    host = auth + this.host;
	  } else if (this.hostname) {
	    host = auth + (this.hostname.indexOf(':') === -1 ?
	        this.hostname :
	        '[' + this.hostname + ']');
	    if (this.port) {
	      host += ':' + this.port;
	    }
	  }

	  if (this.query &&
	      isObject(this.query) &&
	      Object.keys(this.query).length) {
	    query = querystring.stringify(this.query);
	  }

	  var search = this.search || (query && ('?' + query)) || '';

	  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

	  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
	  // unless they had them to begin with.
	  if (this.slashes ||
	      (!protocol || slashedProtocol[protocol]) && host !== false) {
	    host = '//' + (host || '');
	    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
	  } else if (!host) {
	    host = '';
	  }

	  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
	  if (search && search.charAt(0) !== '?') search = '?' + search;

	  pathname = pathname.replace(/[?#]/g, function(match) {
	    return encodeURIComponent(match);
	  });
	  search = search.replace('#', '%23');

	  return protocol + host + pathname + search + hash;
	};

	function urlResolve(source, relative) {
	  return urlParse(source, false, true).resolve(relative);
	}

	Url.prototype.resolve = function(relative) {
	  return this.resolveObject(urlParse(relative, false, true)).format();
	};

	function urlResolveObject(source, relative) {
	  if (!source) return relative;
	  return urlParse(source, false, true).resolveObject(relative);
	}

	Url.prototype.resolveObject = function(relative) {
	  if (isString(relative)) {
	    var rel = new Url();
	    rel.parse(relative, false, true);
	    relative = rel;
	  }

	  var result = new Url();
	  Object.keys(this).forEach(function(k) {
	    result[k] = this[k];
	  }, this);

	  // hash is always overridden, no matter what.
	  // even href="" will remove it.
	  result.hash = relative.hash;

	  // if the relative url is empty, then there's nothing left to do here.
	  if (relative.href === '') {
	    result.href = result.format();
	    return result;
	  }

	  // hrefs like //foo/bar always cut to the protocol.
	  if (relative.slashes && !relative.protocol) {
	    // take everything except the protocol from relative
	    Object.keys(relative).forEach(function(k) {
	      if (k !== 'protocol')
	        result[k] = relative[k];
	    });

	    //urlParse appends trailing / to urls like http://www.example.com
	    if (slashedProtocol[result.protocol] &&
	        result.hostname && !result.pathname) {
	      result.path = result.pathname = '/';
	    }

	    result.href = result.format();
	    return result;
	  }

	  if (relative.protocol && relative.protocol !== result.protocol) {
	    // if it's a known url protocol, then changing
	    // the protocol does weird things
	    // first, if it's not file:, then we MUST have a host,
	    // and if there was a path
	    // to begin with, then we MUST have a path.
	    // if it is file:, then the host is dropped,
	    // because that's known to be hostless.
	    // anything else is assumed to be absolute.
	    if (!slashedProtocol[relative.protocol]) {
	      Object.keys(relative).forEach(function(k) {
	        result[k] = relative[k];
	      });
	      result.href = result.format();
	      return result;
	    }

	    result.protocol = relative.protocol;
	    if (!relative.host && !hostlessProtocol[relative.protocol]) {
	      var relPath = (relative.pathname || '').split('/');
	      while (relPath.length && !(relative.host = relPath.shift()));
	      if (!relative.host) relative.host = '';
	      if (!relative.hostname) relative.hostname = '';
	      if (relPath[0] !== '') relPath.unshift('');
	      if (relPath.length < 2) relPath.unshift('');
	      result.pathname = relPath.join('/');
	    } else {
	      result.pathname = relative.pathname;
	    }
	    result.search = relative.search;
	    result.query = relative.query;
	    result.host = relative.host || '';
	    result.auth = relative.auth;
	    result.hostname = relative.hostname || relative.host;
	    result.port = relative.port;
	    // to support http.request
	    if (result.pathname || result.search) {
	      var p = result.pathname || '';
	      var s = result.search || '';
	      result.path = p + s;
	    }
	    result.slashes = result.slashes || relative.slashes;
	    result.href = result.format();
	    return result;
	  }

	  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
	      isRelAbs = (
	          relative.host ||
	          relative.pathname && relative.pathname.charAt(0) === '/'
	      ),
	      mustEndAbs = (isRelAbs || isSourceAbs ||
	                    (result.host && relative.pathname)),
	      removeAllDots = mustEndAbs,
	      srcPath = result.pathname && result.pathname.split('/') || [],
	      relPath = relative.pathname && relative.pathname.split('/') || [],
	      psychotic = result.protocol && !slashedProtocol[result.protocol];

	  // if the url is a non-slashed url, then relative
	  // links like ../.. should be able
	  // to crawl up to the hostname, as well.  This is strange.
	  // result.protocol has already been set by now.
	  // Later on, put the first path part into the host field.
	  if (psychotic) {
	    result.hostname = '';
	    result.port = null;
	    if (result.host) {
	      if (srcPath[0] === '') srcPath[0] = result.host;
	      else srcPath.unshift(result.host);
	    }
	    result.host = '';
	    if (relative.protocol) {
	      relative.hostname = null;
	      relative.port = null;
	      if (relative.host) {
	        if (relPath[0] === '') relPath[0] = relative.host;
	        else relPath.unshift(relative.host);
	      }
	      relative.host = null;
	    }
	    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
	  }

	  if (isRelAbs) {
	    // it's absolute.
	    result.host = (relative.host || relative.host === '') ?
	                  relative.host : result.host;
	    result.hostname = (relative.hostname || relative.hostname === '') ?
	                      relative.hostname : result.hostname;
	    result.search = relative.search;
	    result.query = relative.query;
	    srcPath = relPath;
	    // fall through to the dot-handling below.
	  } else if (relPath.length) {
	    // it's relative
	    // throw away the existing file, and take the new path instead.
	    if (!srcPath) srcPath = [];
	    srcPath.pop();
	    srcPath = srcPath.concat(relPath);
	    result.search = relative.search;
	    result.query = relative.query;
	  } else if (!isNullOrUndefined(relative.search)) {
	    // just pull out the search.
	    // like href='?foo'.
	    // Put this after the other two cases because it simplifies the booleans
	    if (psychotic) {
	      result.hostname = result.host = srcPath.shift();
	      //occationaly the auth can get stuck only in host
	      //this especialy happens in cases like
	      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
	      var authInHost = result.host && result.host.indexOf('@') > 0 ?
	                       result.host.split('@') : false;
	      if (authInHost) {
	        result.auth = authInHost.shift();
	        result.host = result.hostname = authInHost.shift();
	      }
	    }
	    result.search = relative.search;
	    result.query = relative.query;
	    //to support http.request
	    if (!isNull(result.pathname) || !isNull(result.search)) {
	      result.path = (result.pathname ? result.pathname : '') +
	                    (result.search ? result.search : '');
	    }
	    result.href = result.format();
	    return result;
	  }

	  if (!srcPath.length) {
	    // no path at all.  easy.
	    // we've already handled the other stuff above.
	    result.pathname = null;
	    //to support http.request
	    if (result.search) {
	      result.path = '/' + result.search;
	    } else {
	      result.path = null;
	    }
	    result.href = result.format();
	    return result;
	  }

	  // if a url ENDs in . or .., then it must get a trailing slash.
	  // however, if it ends in anything else non-slashy,
	  // then it must NOT get a trailing slash.
	  var last = srcPath.slice(-1)[0];
	  var hasTrailingSlash = (
	      (result.host || relative.host) && (last === '.' || last === '..') ||
	      last === '');

	  // strip single dots, resolve double dots to parent dir
	  // if the path tries to go above the root, `up` ends up > 0
	  var up = 0;
	  for (var i = srcPath.length; i >= 0; i--) {
	    last = srcPath[i];
	    if (last == '.') {
	      srcPath.splice(i, 1);
	    } else if (last === '..') {
	      srcPath.splice(i, 1);
	      up++;
	    } else if (up) {
	      srcPath.splice(i, 1);
	      up--;
	    }
	  }

	  // if the path is allowed to go above the root, restore leading ..s
	  if (!mustEndAbs && !removeAllDots) {
	    for (; up--; up) {
	      srcPath.unshift('..');
	    }
	  }

	  if (mustEndAbs && srcPath[0] !== '' &&
	      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
	    srcPath.unshift('');
	  }

	  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
	    srcPath.push('');
	  }

	  var isAbsolute = srcPath[0] === '' ||
	      (srcPath[0] && srcPath[0].charAt(0) === '/');

	  // put the host back
	  if (psychotic) {
	    result.hostname = result.host = isAbsolute ? '' :
	                                    srcPath.length ? srcPath.shift() : '';
	    //occationaly the auth can get stuck only in host
	    //this especialy happens in cases like
	    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
	    var authInHost = result.host && result.host.indexOf('@') > 0 ?
	                     result.host.split('@') : false;
	    if (authInHost) {
	      result.auth = authInHost.shift();
	      result.host = result.hostname = authInHost.shift();
	    }
	  }

	  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

	  if (mustEndAbs && !isAbsolute) {
	    srcPath.unshift('');
	  }

	  if (!srcPath.length) {
	    result.pathname = null;
	    result.path = null;
	  } else {
	    result.pathname = srcPath.join('/');
	  }

	  //to support request.http
	  if (!isNull(result.pathname) || !isNull(result.search)) {
	    result.path = (result.pathname ? result.pathname : '') +
	                  (result.search ? result.search : '');
	  }
	  result.auth = relative.auth || result.auth;
	  result.slashes = result.slashes || relative.slashes;
	  result.href = result.format();
	  return result;
	};

	Url.prototype.parseHost = function() {
	  var host = this.host;
	  var port = portPattern.exec(host);
	  if (port) {
	    port = port[0];
	    if (port !== ':') {
	      this.port = port.substr(1);
	    }
	    host = host.substr(0, host.length - port.length);
	  }
	  if (host) this.hostname = host;
	};

	function isString(arg) {
	  return typeof arg === "string";
	}

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}

	function isNull(arg) {
	  return arg === null;
	}
	function isNullOrUndefined(arg) {
	  return  arg == null;
	}


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module, global) {/*! https://mths.be/punycode v1.3.2 by @mathias */
	;(function(root) {

		/** Detect free variables */
		var freeExports = typeof exports == 'object' && exports &&
			!exports.nodeType && exports;
		var freeModule = typeof module == 'object' && module &&
			!module.nodeType && module;
		var freeGlobal = typeof global == 'object' && global;
		if (
			freeGlobal.global === freeGlobal ||
			freeGlobal.window === freeGlobal ||
			freeGlobal.self === freeGlobal
		) {
			root = freeGlobal;
		}

		/**
		 * The `punycode` object.
		 * @name punycode
		 * @type Object
		 */
		var punycode,

		/** Highest positive signed 32-bit float value */
		maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

		/** Bootstring parameters */
		base = 36,
		tMin = 1,
		tMax = 26,
		skew = 38,
		damp = 700,
		initialBias = 72,
		initialN = 128, // 0x80
		delimiter = '-', // '\x2D'

		/** Regular expressions */
		regexPunycode = /^xn--/,
		regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
		regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

		/** Error messages */
		errors = {
			'overflow': 'Overflow: input needs wider integers to process',
			'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
			'invalid-input': 'Invalid input'
		},

		/** Convenience shortcuts */
		baseMinusTMin = base - tMin,
		floor = Math.floor,
		stringFromCharCode = String.fromCharCode,

		/** Temporary variable */
		key;

		/*--------------------------------------------------------------------------*/

		/**
		 * A generic error utility function.
		 * @private
		 * @param {String} type The error type.
		 * @returns {Error} Throws a `RangeError` with the applicable error message.
		 */
		function error(type) {
			throw RangeError(errors[type]);
		}

		/**
		 * A generic `Array#map` utility function.
		 * @private
		 * @param {Array} array The array to iterate over.
		 * @param {Function} callback The function that gets called for every array
		 * item.
		 * @returns {Array} A new array of values returned by the callback function.
		 */
		function map(array, fn) {
			var length = array.length;
			var result = [];
			while (length--) {
				result[length] = fn(array[length]);
			}
			return result;
		}

		/**
		 * A simple `Array#map`-like wrapper to work with domain name strings or email
		 * addresses.
		 * @private
		 * @param {String} domain The domain name or email address.
		 * @param {Function} callback The function that gets called for every
		 * character.
		 * @returns {Array} A new string of characters returned by the callback
		 * function.
		 */
		function mapDomain(string, fn) {
			var parts = string.split('@');
			var result = '';
			if (parts.length > 1) {
				// In email addresses, only the domain name should be punycoded. Leave
				// the local part (i.e. everything up to `@`) intact.
				result = parts[0] + '@';
				string = parts[1];
			}
			// Avoid `split(regex)` for IE8 compatibility. See #17.
			string = string.replace(regexSeparators, '\x2E');
			var labels = string.split('.');
			var encoded = map(labels, fn).join('.');
			return result + encoded;
		}

		/**
		 * Creates an array containing the numeric code points of each Unicode
		 * character in the string. While JavaScript uses UCS-2 internally,
		 * this function will convert a pair of surrogate halves (each of which
		 * UCS-2 exposes as separate characters) into a single code point,
		 * matching UTF-16.
		 * @see `punycode.ucs2.encode`
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode.ucs2
		 * @name decode
		 * @param {String} string The Unicode input string (UCS-2).
		 * @returns {Array} The new array of code points.
		 */
		function ucs2decode(string) {
			var output = [],
			    counter = 0,
			    length = string.length,
			    value,
			    extra;
			while (counter < length) {
				value = string.charCodeAt(counter++);
				if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
					// high surrogate, and there is a next character
					extra = string.charCodeAt(counter++);
					if ((extra & 0xFC00) == 0xDC00) { // low surrogate
						output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
					} else {
						// unmatched surrogate; only append this code unit, in case the next
						// code unit is the high surrogate of a surrogate pair
						output.push(value);
						counter--;
					}
				} else {
					output.push(value);
				}
			}
			return output;
		}

		/**
		 * Creates a string based on an array of numeric code points.
		 * @see `punycode.ucs2.decode`
		 * @memberOf punycode.ucs2
		 * @name encode
		 * @param {Array} codePoints The array of numeric code points.
		 * @returns {String} The new Unicode string (UCS-2).
		 */
		function ucs2encode(array) {
			return map(array, function(value) {
				var output = '';
				if (value > 0xFFFF) {
					value -= 0x10000;
					output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
					value = 0xDC00 | value & 0x3FF;
				}
				output += stringFromCharCode(value);
				return output;
			}).join('');
		}

		/**
		 * Converts a basic code point into a digit/integer.
		 * @see `digitToBasic()`
		 * @private
		 * @param {Number} codePoint The basic numeric code point value.
		 * @returns {Number} The numeric value of a basic code point (for use in
		 * representing integers) in the range `0` to `base - 1`, or `base` if
		 * the code point does not represent a value.
		 */
		function basicToDigit(codePoint) {
			if (codePoint - 48 < 10) {
				return codePoint - 22;
			}
			if (codePoint - 65 < 26) {
				return codePoint - 65;
			}
			if (codePoint - 97 < 26) {
				return codePoint - 97;
			}
			return base;
		}

		/**
		 * Converts a digit/integer into a basic code point.
		 * @see `basicToDigit()`
		 * @private
		 * @param {Number} digit The numeric value of a basic code point.
		 * @returns {Number} The basic code point whose value (when used for
		 * representing integers) is `digit`, which needs to be in the range
		 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
		 * used; else, the lowercase form is used. The behavior is undefined
		 * if `flag` is non-zero and `digit` has no uppercase form.
		 */
		function digitToBasic(digit, flag) {
			//  0..25 map to ASCII a..z or A..Z
			// 26..35 map to ASCII 0..9
			return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
		}

		/**
		 * Bias adaptation function as per section 3.4 of RFC 3492.
		 * http://tools.ietf.org/html/rfc3492#section-3.4
		 * @private
		 */
		function adapt(delta, numPoints, firstTime) {
			var k = 0;
			delta = firstTime ? floor(delta / damp) : delta >> 1;
			delta += floor(delta / numPoints);
			for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
				delta = floor(delta / baseMinusTMin);
			}
			return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
		}

		/**
		 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
		 * symbols.
		 * @memberOf punycode
		 * @param {String} input The Punycode string of ASCII-only symbols.
		 * @returns {String} The resulting string of Unicode symbols.
		 */
		function decode(input) {
			// Don't use UCS-2
			var output = [],
			    inputLength = input.length,
			    out,
			    i = 0,
			    n = initialN,
			    bias = initialBias,
			    basic,
			    j,
			    index,
			    oldi,
			    w,
			    k,
			    digit,
			    t,
			    /** Cached calculation results */
			    baseMinusT;

			// Handle the basic code points: let `basic` be the number of input code
			// points before the last delimiter, or `0` if there is none, then copy
			// the first basic code points to the output.

			basic = input.lastIndexOf(delimiter);
			if (basic < 0) {
				basic = 0;
			}

			for (j = 0; j < basic; ++j) {
				// if it's not a basic code point
				if (input.charCodeAt(j) >= 0x80) {
					error('not-basic');
				}
				output.push(input.charCodeAt(j));
			}

			// Main decoding loop: start just after the last delimiter if any basic code
			// points were copied; start at the beginning otherwise.

			for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

				// `index` is the index of the next character to be consumed.
				// Decode a generalized variable-length integer into `delta`,
				// which gets added to `i`. The overflow checking is easier
				// if we increase `i` as we go, then subtract off its starting
				// value at the end to obtain `delta`.
				for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

					if (index >= inputLength) {
						error('invalid-input');
					}

					digit = basicToDigit(input.charCodeAt(index++));

					if (digit >= base || digit > floor((maxInt - i) / w)) {
						error('overflow');
					}

					i += digit * w;
					t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

					if (digit < t) {
						break;
					}

					baseMinusT = base - t;
					if (w > floor(maxInt / baseMinusT)) {
						error('overflow');
					}

					w *= baseMinusT;

				}

				out = output.length + 1;
				bias = adapt(i - oldi, out, oldi == 0);

				// `i` was supposed to wrap around from `out` to `0`,
				// incrementing `n` each time, so we'll fix that now:
				if (floor(i / out) > maxInt - n) {
					error('overflow');
				}

				n += floor(i / out);
				i %= out;

				// Insert `n` at position `i` of the output
				output.splice(i++, 0, n);

			}

			return ucs2encode(output);
		}

		/**
		 * Converts a string of Unicode symbols (e.g. a domain name label) to a
		 * Punycode string of ASCII-only symbols.
		 * @memberOf punycode
		 * @param {String} input The string of Unicode symbols.
		 * @returns {String} The resulting Punycode string of ASCII-only symbols.
		 */
		function encode(input) {
			var n,
			    delta,
			    handledCPCount,
			    basicLength,
			    bias,
			    j,
			    m,
			    q,
			    k,
			    t,
			    currentValue,
			    output = [],
			    /** `inputLength` will hold the number of code points in `input`. */
			    inputLength,
			    /** Cached calculation results */
			    handledCPCountPlusOne,
			    baseMinusT,
			    qMinusT;

			// Convert the input in UCS-2 to Unicode
			input = ucs2decode(input);

			// Cache the length
			inputLength = input.length;

			// Initialize the state
			n = initialN;
			delta = 0;
			bias = initialBias;

			// Handle the basic code points
			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue < 0x80) {
					output.push(stringFromCharCode(currentValue));
				}
			}

			handledCPCount = basicLength = output.length;

			// `handledCPCount` is the number of code points that have been handled;
			// `basicLength` is the number of basic code points.

			// Finish the basic string - if it is not empty - with a delimiter
			if (basicLength) {
				output.push(delimiter);
			}

			// Main encoding loop:
			while (handledCPCount < inputLength) {

				// All non-basic code points < n have been handled already. Find the next
				// larger one:
				for (m = maxInt, j = 0; j < inputLength; ++j) {
					currentValue = input[j];
					if (currentValue >= n && currentValue < m) {
						m = currentValue;
					}
				}

				// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
				// but guard against overflow
				handledCPCountPlusOne = handledCPCount + 1;
				if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
					error('overflow');
				}

				delta += (m - n) * handledCPCountPlusOne;
				n = m;

				for (j = 0; j < inputLength; ++j) {
					currentValue = input[j];

					if (currentValue < n && ++delta > maxInt) {
						error('overflow');
					}

					if (currentValue == n) {
						// Represent delta as a generalized variable-length integer
						for (q = delta, k = base; /* no condition */; k += base) {
							t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
							if (q < t) {
								break;
							}
							qMinusT = q - t;
							baseMinusT = base - t;
							output.push(
								stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
							);
							q = floor(qMinusT / baseMinusT);
						}

						output.push(stringFromCharCode(digitToBasic(q, 0)));
						bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
						delta = 0;
						++handledCPCount;
					}
				}

				++delta;
				++n;

			}
			return output.join('');
		}

		/**
		 * Converts a Punycode string representing a domain name or an email address
		 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
		 * it doesn't matter if you call it on a string that has already been
		 * converted to Unicode.
		 * @memberOf punycode
		 * @param {String} input The Punycoded domain name or email address to
		 * convert to Unicode.
		 * @returns {String} The Unicode representation of the given Punycode
		 * string.
		 */
		function toUnicode(input) {
			return mapDomain(input, function(string) {
				return regexPunycode.test(string)
					? decode(string.slice(4).toLowerCase())
					: string;
			});
		}

		/**
		 * Converts a Unicode string representing a domain name or an email address to
		 * Punycode. Only the non-ASCII parts of the domain name will be converted,
		 * i.e. it doesn't matter if you call it with a domain that's already in
		 * ASCII.
		 * @memberOf punycode
		 * @param {String} input The domain name or email address to convert, as a
		 * Unicode string.
		 * @returns {String} The Punycode representation of the given domain name or
		 * email address.
		 */
		function toASCII(input) {
			return mapDomain(input, function(string) {
				return regexNonASCII.test(string)
					? 'xn--' + encode(string)
					: string;
			});
		}

		/*--------------------------------------------------------------------------*/

		/** Define the public API */
		punycode = {
			/**
			 * A string representing the current Punycode.js version number.
			 * @memberOf punycode
			 * @type String
			 */
			'version': '1.3.2',
			/**
			 * An object of methods to convert from JavaScript's internal character
			 * representation (UCS-2) to Unicode code points, and back.
			 * @see <https://mathiasbynens.be/notes/javascript-encoding>
			 * @memberOf punycode
			 * @type Object
			 */
			'ucs2': {
				'decode': ucs2decode,
				'encode': ucs2encode
			},
			'decode': decode,
			'encode': encode,
			'toASCII': toASCII,
			'toUnicode': toUnicode
		};

		/** Expose `punycode` */
		// Some AMD build optimizers, like r.js, check for specific condition patterns
		// like the following:
		if (
			true
		) {
			!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
				return punycode;
			}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else if (freeExports && freeModule) {
			if (module.exports == freeExports) { // in Node.js or RingoJS v0.8.0+
				freeModule.exports = punycode;
			} else { // in Narwhal or RingoJS v0.7.0-
				for (key in punycode) {
					punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
				}
			}
		} else { // in Rhino or a web browser
			root.punycode = punycode;
		}

	}(this));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)(module), (function() { return this; }())))

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.decode = exports.parse = __webpack_require__(9);
	exports.encode = exports.stringify = __webpack_require__(10);


/***/ },
/* 9 */
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	'use strict';

	// If obj.hasOwnProperty has been overridden, then calling
	// obj.hasOwnProperty(prop) will break.
	// See: https://github.com/joyent/node/issues/1707
	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}

	module.exports = function(qs, sep, eq, options) {
	  sep = sep || '&';
	  eq = eq || '=';
	  var obj = {};

	  if (typeof qs !== 'string' || qs.length === 0) {
	    return obj;
	  }

	  var regexp = /\+/g;
	  qs = qs.split(sep);

	  var maxKeys = 1000;
	  if (options && typeof options.maxKeys === 'number') {
	    maxKeys = options.maxKeys;
	  }

	  var len = qs.length;
	  // maxKeys <= 0 means that we should not limit keys count
	  if (maxKeys > 0 && len > maxKeys) {
	    len = maxKeys;
	  }

	  for (var i = 0; i < len; ++i) {
	    var x = qs[i].replace(regexp, '%20'),
	        idx = x.indexOf(eq),
	        kstr, vstr, k, v;

	    if (idx >= 0) {
	      kstr = x.substr(0, idx);
	      vstr = x.substr(idx + 1);
	    } else {
	      kstr = x;
	      vstr = '';
	    }

	    k = decodeURIComponent(kstr);
	    v = decodeURIComponent(vstr);

	    if (!hasOwnProperty(obj, k)) {
	      obj[k] = v;
	    } else if (Array.isArray(obj[k])) {
	      obj[k].push(v);
	    } else {
	      obj[k] = [obj[k], v];
	    }
	  }

	  return obj;
	};


/***/ },
/* 10 */
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	'use strict';

	var stringifyPrimitive = function(v) {
	  switch (typeof v) {
	    case 'string':
	      return v;

	    case 'boolean':
	      return v ? 'true' : 'false';

	    case 'number':
	      return isFinite(v) ? v : '';

	    default:
	      return '';
	  }
	};

	module.exports = function(obj, sep, eq, name) {
	  sep = sep || '&';
	  eq = eq || '=';
	  if (obj === null) {
	    obj = undefined;
	  }

	  if (typeof obj === 'object') {
	    return Object.keys(obj).map(function(k) {
	      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
	      if (Array.isArray(obj[k])) {
	        return obj[k].map(function(v) {
	          return ks + encodeURIComponent(stringifyPrimitive(v));
	        }).join(sep);
	      } else {
	        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
	      }
	    }).join(sep);

	  }

	  if (!name) return '';
	  return encodeURIComponent(stringifyPrimitive(name)) + eq +
	         encodeURIComponent(stringifyPrimitive(obj));
	};


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var helpers = __webpack_require__(12);

	/** @type ValidatorResult */
	var ValidatorResult = helpers.ValidatorResult;
	/** @type SchemaError */
	var SchemaError = helpers.SchemaError;

	var attribute = {};

	attribute.ignoreProperties = {
	  // informative properties
	  'id': true,
	  'default': true,
	  'description': true,
	  'title': true,
	  // arguments to other properties
	  'exclusiveMinimum': true,
	  'exclusiveMaximum': true,
	  'additionalItems': true,
	  // special-handled properties
	  '$schema': true,
	  '$ref': true,
	  'extends': true
	};

	/**
	 * @name validators
	 */
	var validators = attribute.validators = {};

	/**
	 * Validates whether the instance if of a certain type
	 * @param instance
	 * @param schema
	 * @param options
	 * @param ctx
	 * @return {ValidatorResult|null}
	 */
	validators.type = function validateType (instance, schema, options, ctx) {
	  // Ignore undefined instances
	  if (instance === undefined) {
	    return null;
	  }
	  var result = new ValidatorResult(instance, schema, options, ctx);
	  var types = (schema.type instanceof Array) ? schema.type : [schema.type];
	  if (!types.some(this.testType.bind(this, instance, schema, options, ctx))) {
	    var list = types.map(function (v) {
	      return v.id && ('<' + v.id + '>') || (v+'');
	    });
	    result.addError({
	      name: 'type',
	      argument: list,
	      message: "is not of a type(s) " + list,
	    });
	  }
	  return result;
	};

	function testSchema(instance, options, ctx, schema){
	  return this.validateSchema(instance, schema, options, ctx).valid;
	}

	/**
	 * Validates whether the instance matches some of the given schemas
	 * @param instance
	 * @param schema
	 * @param options
	 * @param ctx
	 * @return {ValidatorResult|null}
	 */
	validators.anyOf = function validateAnyOf (instance, schema, options, ctx) {
	  // Ignore undefined instances
	  if (instance === undefined) {
	    return null;
	  }
	  var result = new ValidatorResult(instance, schema, options, ctx);
	  if (!(schema.anyOf instanceof Array)){
	    throw new SchemaError("anyOf must be an array");
	  }
	  if (!schema.anyOf.some(testSchema.bind(this, instance, options, ctx))) {
	    var list = schema.anyOf.map(function (v, i) {
	      return (v.id && ('<' + v.id + '>')) || (v.title && JSON.stringify(v.title)) || (v['$ref'] && ('<' + v['$ref'] + '>')) || '[subschema '+i+']';
	    });
	    result.addError({
	      name: 'anyOf',
	      argument: list,
	      message: "is not any of " + list.join(','),
	    });
	  }
	  return result;
	};

	/**
	 * Validates whether the instance matches every given schema
	 * @param instance
	 * @param schema
	 * @param options
	 * @param ctx
	 * @return {String|null}
	 */
	validators.allOf = function validateAllOf (instance, schema, options, ctx) {
	  // Ignore undefined instances
	  if (instance === undefined) {
	    return null;
	  }
	  if (!(schema.allOf instanceof Array)){
	    throw new SchemaError("allOf must be an array");
	  }
	  var result = new ValidatorResult(instance, schema, options, ctx);
	  var self = this;
	  schema.allOf.forEach(function(v, i){
	    var valid = self.validateSchema(instance, v, options, ctx);
	    if(!valid.valid){
	      var msg = (v.id && ('<' + v.id + '>')) || (v.title && JSON.stringify(v.title)) || (v['$ref'] && ('<' + v['$ref'] + '>')) || '[subschema '+i+']';
	      result.addError({
	        name: 'allOf',
	        argument: { id: msg, length: valid.errors.length, valid: valid },
	        message: 'does not match allOf schema ' + msg + ' with ' + valid.errors.length + ' error[s]:',
	      });
	      result.importErrors(valid);
	    }
	  });
	  return result;
	};

	/**
	 * Validates whether the instance matches exactly one of the given schemas
	 * @param instance
	 * @param schema
	 * @param options
	 * @param ctx
	 * @return {String|null}
	 */
	validators.oneOf = function validateOneOf (instance, schema, options, ctx) {
	  // Ignore undefined instances
	  if (instance === undefined) {
	    return null;
	  }
	  if (!(schema.oneOf instanceof Array)){
	    throw new SchemaError("oneOf must be an array");
	  }
	  var result = new ValidatorResult(instance, schema, options, ctx);
	  var count = schema.oneOf.filter(testSchema.bind(this, instance, options, ctx)).length;
	  var list = schema.oneOf.map(function (v, i) {
	    return (v.id && ('<' + v.id + '>')) || (v.title && JSON.stringify(v.title)) || (v['$ref'] && ('<' + v['$ref'] + '>')) || '[subschema '+i+']';
	  });
	  if (count!==1) {
	    result.addError({
	      name: 'oneOf',
	      argument: list,
	      message: "is not exactly one from " + list.join(','),
	    });
	  }
	  return result;
	};

	/**
	 * Validates properties
	 * @param instance
	 * @param schema
	 * @param options
	 * @param ctx
	 * @return {String|null|ValidatorResult}
	 */
	validators.properties = function validateProperties (instance, schema, options, ctx) {
	  if(instance === undefined || !(instance instanceof Object)) return;
	  var result = new ValidatorResult(instance, schema, options, ctx);
	  var properties = schema.properties || {};
	  for (var property in properties) {
	    var prop = (instance || undefined) && instance[property];
	    var res = this.validateSchema(prop, properties[property], options, ctx.makeChild(properties[property], property));
	    if(res.instance !== result.instance[property]) result.instance[property] = res.instance;
	    result.importErrors(res);
	  }
	  return result;
	};

	/**
	 * Test a specific property within in instance against the additionalProperties schema attribute
	 * This ignores properties with definitions in the properties schema attribute, but no other attributes.
	 * If too many more types of property-existance tests pop up they may need their own class of tests (like `type` has)
	 * @private
	 * @return {boolean}
	 */
	function testAdditionalProperty (instance, schema, options, ctx, property, result) {
	  if (schema.properties && schema.properties[property] !== undefined) {
	    return;
	  }
	  if (schema.additionalProperties === false) {
	    result.addError({
	      name: 'additionalProperties',
	      argument: property,
	      message: "additionalProperty " + JSON.stringify(property) + " exists in instance when not allowed",
	    });
	  } else {
	    var additionalProperties = schema.additionalProperties || {};
	    var res = this.validateSchema(instance[property], additionalProperties, options, ctx.makeChild(additionalProperties, property));
	    if(res.instance !== result.instance[property]) result.instance[property] = res.instance;
	    result.importErrors(res);
	  }
	}

	/**
	 * Validates patternProperties
	 * @param instance
	 * @param schema
	 * @param options
	 * @param ctx
	 * @return {String|null|ValidatorResult}
	 */
	validators.patternProperties = function validatePatternProperties (instance, schema, options, ctx) {
	  if(instance === undefined) return;
	  if(!this.types.object(instance)) return;
	  var result = new ValidatorResult(instance, schema, options, ctx);
	  var patternProperties = schema.patternProperties || {};

	  for (var property in instance) {
	    var test = true;
	    for (var pattern in patternProperties) {
	      var expr = new RegExp(pattern);
	      if (!expr.test(property)) {
	        continue;
	      }
	      test = false;
	      var res = this.validateSchema(instance[property], patternProperties[pattern], options, ctx.makeChild(patternProperties[pattern], property));
	      if(res.instance !== result.instance[property]) result.instance[property] = res.instance;
	      result.importErrors(res);
	    }
	    if (test) {
	      testAdditionalProperty.call(this, instance, schema, options, ctx, property, result);
	    }
	  }

	  return result;
	};

	/**
	 * Validates additionalProperties
	 * @param instance
	 * @param schema
	 * @param options
	 * @param ctx
	 * @return {String|null|ValidatorResult}
	 */
	validators.additionalProperties = function validateAdditionalProperties (instance, schema, options, ctx) {
	  if(instance === undefined) return;
	  if(!this.types.object(instance)) return;
	  // if patternProperties is defined then we'll test when that one is called instead
	  if (schema.patternProperties) {
	    return null;
	  }
	  var result = new ValidatorResult(instance, schema, options, ctx);
	  for (var property in instance) {
	    testAdditionalProperty.call(this, instance, schema, options, ctx, property, result);
	  }
	  return result;
	};

	/**
	 * Validates whether the instance value is at least of a certain length, when the instance value is a string.
	 * @param instance
	 * @param schema
	 * @return {String|null}
	 */
	validators.minProperties = function validateMinProperties (instance, schema, options, ctx) {
	  if (!instance || typeof instance !== 'object') {
	    return null;
	  }
	  var result = new ValidatorResult(instance, schema, options, ctx);
	  var keys = Object.keys(instance);
	  if (!(keys.length >= schema.minProperties)) {
	    result.addError({
	      name: 'minProperties',
	      argument: schema.minProperties,
	      message: "does not meet minimum property length of " + schema.minProperties,
	    })
	  }
	  return result;
	};

	/**
	 * Validates whether the instance value is at most of a certain length, when the instance value is a string.
	 * @param instance
	 * @param schema
	 * @return {String|null}
	 */
	validators.maxProperties = function validateMaxProperties (instance, schema, options, ctx) {
	  if (!instance || typeof instance !== 'object') {
	    return null;
	  }
	  var result = new ValidatorResult(instance, schema, options, ctx);
	  var keys = Object.keys(instance);
	  if (!(keys.length <= schema.maxProperties)) {
	    result.addError({
	      name: 'maxProperties',
	      argument: schema.maxProperties,
	      message: "does not meet maximum property length of " + schema.maxProperties,
	    });
	  }
	  return result;
	};

	/**
	 * Validates items when instance is an array
	 * @param instance
	 * @param schema
	 * @param options
	 * @param ctx
	 * @return {String|null|ValidatorResult}
	 */
	validators.items = function validateItems (instance, schema, options, ctx) {
	  if (!(instance instanceof Array)) {
	    return null;
	  }
	  var self = this;
	  var result = new ValidatorResult(instance, schema, options, ctx);
	  if (instance === undefined || !schema.items) {
	    return result;
	  }
	  instance.every(function (value, i) {
	    var items = (schema.items instanceof Array) ? (schema.items[i] || schema.additionalItems) : schema.items;
	    if (items === undefined) {
	      return true;
	    }
	    if (items === false) {
	      result.addError({
	        name: 'items',
	        message: "additionalItems not permitted",
	      });
	      return false;
	    }
	    var res = self.validateSchema(value, items, options, ctx.makeChild(items, i));
	    if(res.instance !== result.instance[i]) result.instance[i] = res.instance;
	    result.importErrors(res);
	    return true;
	  });
	  return result;
	};

	/**
	 * Validates minimum and exclusiveMinimum when the type of the instance value is a number.
	 * @param instance
	 * @param schema
	 * @return {String|null}
	 */
	validators.minimum = function validateMinimum (instance, schema, options, ctx) {
	  if (typeof instance !== 'number') {
	    return null;
	  }
	  var result = new ValidatorResult(instance, schema, options, ctx);
	  var valid = true;
	  if (schema.exclusiveMinimum && schema.exclusiveMinimum === true) {
	    valid = instance > schema.minimum;
	  } else {
	    valid = instance >= schema.minimum;
	  }
	  if (!valid) {
	    result.addError({
	      name: 'minimum',
	      argument: schema.minimum,
	      message: "must have a minimum value of " + schema.minimum,
	    });
	  }
	  return result;
	};

	/**
	 * Validates maximum and exclusiveMaximum when the type of the instance value is a number.
	 * @param instance
	 * @param schema
	 * @return {String|null}
	 */
	validators.maximum = function validateMaximum (instance, schema, options, ctx) {
	  if (typeof instance !== 'number') {
	    return null;
	  }
	  var result = new ValidatorResult(instance, schema, options, ctx);
	  var valid;
	  if (schema.exclusiveMaximum && schema.exclusiveMaximum === true) {
	    valid = instance < schema.maximum;
	  } else {
	    valid = instance <= schema.maximum;
	  }
	  if (!valid) {
	    result.addError({
	      name: 'maximum',
	      argument: schema.maximum,
	      message: "must have a maximum value of " + schema.maximum,
	    });
	  }
	  return result;
	};

	/**
	 * Validates divisibleBy when the type of the instance value is a number.
	 * Of course, this is susceptible to floating point error since it compares the floating points
	 * and not the JSON byte sequences to arbitrary precision.
	 * @param instance
	 * @param schema
	 * @return {String|null}
	 */
	validators.divisibleBy = function validateDivisibleBy (instance, schema, options, ctx) {
	  if (typeof instance !== 'number') {
	    return null;
	  }

	  if (schema.divisibleBy == 0) {
	    throw new SchemaError("divisibleBy cannot be zero");
	  }

	  var result = new ValidatorResult(instance, schema, options, ctx);
	  if (instance / schema.divisibleBy % 1) {
	    result.addError({
	      name: 'divisibleBy',
	      argument: schema.divisibleBy,
	      message: "is not divisible by (multiple of) " + JSON.stringify(schema.divisibleBy),
	    });
	  }
	  return result;
	};

	/**
	 * Validates divisibleBy when the type of the instance value is a number.
	 * Of course, this is susceptible to floating point error since it compares the floating points
	 * and not the JSON byte sequences to arbitrary precision.
	 * @param instance
	 * @param schema
	 * @return {String|null}
	 */
	validators.multipleOf = function validateMultipleOf (instance, schema, options, ctx) {
	  if (typeof instance !== 'number') {
	    return null;
	  }

	  if (schema.multipleOf == 0) {
	    throw new SchemaError("multipleOf cannot be zero");
	  }

	  var result = new ValidatorResult(instance, schema, options, ctx);
	  if (instance / schema.multipleOf % 1) {
	    result.addError({
	      name: 'multipleOf',
	      argument:  schema.multipleOf,
	      message: "is not a multiple of (divisible by) " + JSON.stringify(schema.multipleOf),
	    });
	  }
	  return result;
	};

	/**
	 * Validates whether the instance value is present.
	 * @param instance
	 * @param schema
	 * @return {String|null}
	 */
	validators.required = function validateRequired (instance, schema, options, ctx) {
	  var result = new ValidatorResult(instance, schema, options, ctx);
	  if (instance === undefined && schema.required === true) {
	    result.addError({
	      name: 'required',
	      message: "is required"
	    });
	  } else if (instance && typeof instance==='object' && Array.isArray(schema.required)) {
	    schema.required.forEach(function(n){
	      if(instance[n]===undefined){
	        result.addError({
	          name: 'required',
	          argument: n,
	          message: "requires property " + JSON.stringify(n),
	        });
	      }
	    });
	  }
	  return result;
	};

	/**
	 * Validates whether the instance value matches the regular expression, when the instance value is a string.
	 * @param instance
	 * @param schema
	 * @return {String|null}
	 */
	validators.pattern = function validatePattern (instance, schema, options, ctx) {
	  if (typeof instance !== 'string') {
	    return null;
	  }
	  var result = new ValidatorResult(instance, schema, options, ctx);
	  if (!instance.match(schema.pattern)) {
	    result.addError({
	      name: 'pattern',
	      argument: schema.pattern,
	      message: "does not match pattern " + JSON.stringify(schema.pattern),
	    });
	  }
	  return result;
	};

	/**
	 * Validates whether the instance value is of a certain defined format or a custom
	 * format.
	 * The following formats are supported for string types:
	 *   - date-time
	 *   - date
	 *   - time
	 *   - ip-address
	 *   - ipv6
	 *   - uri
	 *   - color
	 *   - host-name
	 *   - alpha
	 *   - alpha-numeric
	 *   - utc-millisec
	 * @param instance
	 * @param schema
	 * @param [options]
	 * @param [ctx]
	 * @return {String|null}
	 */
	validators.format = function validateFormat (instance, schema, options, ctx) {
	  var result = new ValidatorResult(instance, schema, options, ctx);
	  if (!result.disableFormat && !helpers.isFormat(instance, schema.format, this)) {
	    result.addError({
	      name: 'format',
	      argument: schema.format,
	      message: "does not conform to the " + JSON.stringify(schema.format) + " format",
	    });
	  }
	  return result;
	};

	/**
	 * Validates whether the instance value is at least of a certain length, when the instance value is a string.
	 * @param instance
	 * @param schema
	 * @return {String|null}
	 */
	validators.minLength = function validateMinLength (instance, schema, options, ctx) {
	  if (!(typeof instance === 'string')) {
	    return null;
	  }
	  var result = new ValidatorResult(instance, schema, options, ctx);
	  if (!(instance.length >= schema.minLength)) {
	    result.addError({
	      name: 'minLength',
	      argument: schema.minLength,
	      message: "does not meet minimum length of " + schema.minLength,
	    });
	  }
	  return result;
	};

	/**
	 * Validates whether the instance value is at most of a certain length, when the instance value is a string.
	 * @param instance
	 * @param schema
	 * @return {String|null}
	 */
	validators.maxLength = function validateMaxLength (instance, schema, options, ctx) {
	  if (!(typeof instance === 'string')) {
	    return null;
	  }
	  var result = new ValidatorResult(instance, schema, options, ctx);
	  if (!(instance.length <= schema.maxLength)) {
	    result.addError({
	      name: 'maxLength',
	      argument: schema.maxLength,
	      message: "does not meet maximum length of " + schema.maxLength,
	    });
	  }
	  return result;
	};

	/**
	 * Validates whether instance contains at least a minimum number of items, when the instance is an Array.
	 * @param instance
	 * @param schema
	 * @return {String|null}
	 */
	validators.minItems = function validateMinItems (instance, schema, options, ctx) {
	  if (!(instance instanceof Array)) {
	    return null;
	  }
	  var result = new ValidatorResult(instance, schema, options, ctx);
	  if (!(instance.length >= schema.minItems)) {
	    result.addError({
	      name: 'minItems',
	      argument: schema.minItems,
	      message: "does not meet minimum length of " + schema.minItems,
	    });
	  }
	  return result;
	};

	/**
	 * Validates whether instance contains no more than a maximum number of items, when the instance is an Array.
	 * @param instance
	 * @param schema
	 * @return {String|null}
	 */
	validators.maxItems = function validateMaxItems (instance, schema, options, ctx) {
	  if (!(instance instanceof Array)) {
	    return null;
	  }
	  var result = new ValidatorResult(instance, schema, options, ctx);
	  if (!(instance.length <= schema.maxItems)) {
	    result.addError({
	      name: 'maxItems',
	      argument: schema.maxItems,
	      message: "does not meet maximum length of " + schema.maxItems,
	    });
	  }
	  return result;
	};

	/**
	 * Validates that every item in an instance array is unique, when instance is an array
	 * @param instance
	 * @param schema
	 * @param options
	 * @param ctx
	 * @return {String|null|ValidatorResult}
	 */
	validators.uniqueItems = function validateUniqueItems (instance, schema, options, ctx) {
	  var result = new ValidatorResult(instance, schema, options, ctx);
	  if (!(instance instanceof Array)) {
	    return result;
	  }
	  function testArrays (v, i, a) {
	    for (var j = i + 1; j < a.length; j++) if (helpers.deepCompareStrict(v, a[j])) {
	      return false;
	    }
	    return true;
	  }
	  if (!instance.every(testArrays)) {
	    result.addError({
	      name: 'uniqueItems',
	      message: "contains duplicate item",
	    });
	  }
	  return result;
	};

	/**
	 * Deep compares arrays for duplicates
	 * @param v
	 * @param i
	 * @param a
	 * @private
	 * @return {boolean}
	 */
	function testArrays (v, i, a) {
	  var j, len = a.length;
	  for (j = i + 1, len; j < len; j++) {
	    if (helpers.deepCompareStrict(v, a[j])) {
	      return false;
	    }
	  }
	  return true;
	}

	/**
	 * Validates whether there are no duplicates, when the instance is an Array.
	 * @param instance
	 * @return {String|null}
	 */
	validators.uniqueItems = function validateUniqueItems (instance, schema, options, ctx) {
	  if (!(instance instanceof Array)) {
	    return null;
	  }
	  var result = new ValidatorResult(instance, schema, options, ctx);
	  if (!instance.every(testArrays)) {
	    result.addError({
	      name: 'uniqueItems',
	      message: "contains duplicate item",
	    });
	  }
	  return result;
	};

	/**
	 * Validate for the presence of dependency properties, if the instance is an object.
	 * @param instance
	 * @param schema
	 * @param options
	 * @param ctx
	 * @return {null|ValidatorResult}
	 */
	validators.dependencies = function validateDependencies (instance, schema, options, ctx) {
	  if (!instance || typeof instance != 'object') {
	    return null;
	  }
	  var result = new ValidatorResult(instance, schema, options, ctx);
	  for (var property in schema.dependencies) {
	    if (instance[property] === undefined) {
	      continue;
	    }
	    var dep = schema.dependencies[property];
	    var childContext = ctx.makeChild(dep, property);
	    if (typeof dep == 'string') {
	      dep = [dep];
	    }
	    if (dep instanceof Array) {
	      dep.forEach(function (prop) {
	        if (instance[prop] === undefined) {
	          result.addError({
	            // FIXME there's two different "dependencies" errors here with slightly different outputs
	            // Can we make these the same? Or should we create different error types?
	            name: 'dependencies',
	            argument: childContext.propertyPath,
	            message: "property " + prop + " not found, required by " + childContext.propertyPath,
	          });
	        }
	      });
	    } else {
	      var res = this.validateSchema(instance, dep, options, childContext);
	      if(result.instance !== res.instance) result.instance = res.instance;
	      if (res && res.errors.length) {
	        result.addError({
	          name: 'dependencies',
	          argument: childContext.propertyPath,
	          message: "does not meet dependency required by " + childContext.propertyPath,
	        });
	        result.importErrors(res);
	      }
	    }
	  }
	  return result;
	};

	/**
	 * Validates whether the instance value is one of the enumerated values.
	 *
	 * @param instance
	 * @param schema
	 * @return {ValidatorResult|null}
	 */
	validators['enum'] = function validateEnum (instance, schema, options, ctx) {
	  if (!(schema['enum'] instanceof Array)) {
	    throw new SchemaError("enum expects an array", schema);
	  }
	  if (instance === undefined) {
	    return null;
	  }
	  var result = new ValidatorResult(instance, schema, options, ctx);
	  if (!schema['enum'].some(helpers.deepCompareStrict.bind(null, instance))) {
	    result.addError({
	      name: 'enum',
	      argument: schema['enum'],
	      message: "is not one of enum values: " + schema['enum'].join(','),
	    });
	  }
	  return result;
	};

	/**
	 * Validates whether the instance if of a prohibited type.
	 * @param instance
	 * @param schema
	 * @param options
	 * @param ctx
	 * @return {null|ValidatorResult}
	 */
	validators.not = validators.disallow = function validateNot (instance, schema, options, ctx) {
	  var self = this;
	  if(instance===undefined) return null;
	  var result = new ValidatorResult(instance, schema, options, ctx);
	  var notTypes = schema.not || schema.disallow;
	  if(!notTypes) return null;
	  if(!(notTypes instanceof Array)) notTypes=[notTypes];
	  notTypes.forEach(function (type) {
	    if (self.testType(instance, schema, options, ctx, type)) {
	      var schemaId = type && type.id && ('<' + type.id + '>') || type;
	      result.addError({
	        name: 'not',
	        argument: schemaId,
	        message: "is of prohibited type " + schemaId,
	      });
	    }
	  });
	  return result;
	};

	module.exports = attribute;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var uri = __webpack_require__(5);

	var ValidationError = exports.ValidationError = function ValidationError (message, instance, schema, propertyPath, name, argument) {
	  if (propertyPath) {
	    this.property = propertyPath;
	  }
	  if (message) {
	    this.message = message;
	  }
	  if (schema) {
	    if (schema.id) {
	      this.schema = schema.id;
	    } else {
	      this.schema = schema;
	    }
	  }
	  if (instance) {
	    this.instance = instance;
	  }
	  this.name = name;
	  this.argument = argument;
	  this.stack = this.toString();
	};

	ValidationError.prototype.toString = function toString() {
	  return this.property + ' ' + this.message;
	};

	var ValidatorResult = exports.ValidatorResult = function ValidatorResult(instance, schema, options, ctx) {
	  this.instance = instance;
	  this.schema = schema;
	  this.propertyPath = ctx.propertyPath;
	  this.errors = [];
	  this.throwError = options && options.throwError;
	  this.disableFormat = options && options.disableFormat === true;
	};

	ValidatorResult.prototype.addError = function addError(detail) {
	  var err;
	  if (typeof detail == 'string') {
	    err = new ValidationError(detail, this.instance, this.schema, this.propertyPath);
	  } else {
	    if (!detail) throw new Error('Missing error detail');
	    if (!detail.message) throw new Error('Missing error message');
	    if (!detail.name) throw new Error('Missing validator type');
	    err = new ValidationError(detail.message, this.instance, this.schema, this.propertyPath, detail.name, detail.argument);
	  }

	  if (this.throwError) {
	    throw err;
	  }
	  this.errors.push(err);
	  return err;
	};

	ValidatorResult.prototype.importErrors = function importErrors(res) {
	  if (typeof res == 'string' || (res && res.validatorType)) {
	    this.addError(res);
	  } else if (res && res.errors) {
	    var errs = this.errors;
	    res.errors.forEach(function (v) {
	      errs.push(v);
	    });
	  }
	};

	ValidatorResult.prototype.toString = function toString(res) {
	  return this.errors.map(function(v,i){ return i+': '+v.toString()+'\n'; }).join('');
	};

	Object.defineProperty(ValidatorResult.prototype, "valid", { get: function() {
	  return !this.errors.length;
	} });

	/**
	 * Describes a problem with a Schema which prevents validation of an instance
	 * @name SchemaError
	 * @constructor
	 */
	var SchemaError = exports.SchemaError = function SchemaError (msg, schema) {
	  this.message = msg;
	  this.schema = schema;
	  Error.call(this, msg);
	  Error.captureStackTrace(this, SchemaError);
	};
	SchemaError.prototype = Object.create(Error.prototype,
	  { constructor: {value: SchemaError, enumerable: false}
	  , name: {value: 'SchemaError', enumerable: false}
	  });

	var SchemaContext = exports.SchemaContext = function SchemaContext (schema, options, propertyPath, base, schemas) {
	  this.schema = schema;
	  this.options = options;
	  this.propertyPath = propertyPath;
	  this.base = base;
	  this.schemas = schemas;
	};

	SchemaContext.prototype.resolve = function resolve (target) {
	  return uri.resolve(this.base, target);
	};

	SchemaContext.prototype.makeChild = function makeChild(schema, propertyName){
	  var propertyPath = (propertyName===undefined) ? this.propertyPath : this.propertyPath+makeSuffix(propertyName);
	  var base = uri.resolve(this.base, schema.id||'');
	  var ctx = new SchemaContext(schema, this.options, propertyPath, base, Object.create(this.schemas));
	  if(schema.id && !ctx.schemas[base]){
	    ctx.schemas[base] = schema;
	  }
	  return ctx;
	}

	var FORMAT_REGEXPS = exports.FORMAT_REGEXPS = {
	  'date-time': /^\d{4}-(?:0[0-9]{1}|1[0-2]{1})-(3[01]|0[1-9]|[12][0-9])[tT ](2[0-4]|[01][0-9]):([0-5][0-9]):(60|[0-5][0-9])(\.\d+)?([zZ]|[+-]([0-5][0-9]):(60|[0-5][0-9]))$/,
	  'date': /^\d{4}-(?:0[0-9]{1}|1[0-2]{1})-(3[01]|0[1-9]|[12][0-9])$/,
	  'time': /^(2[0-4]|[01][0-9]):([0-5][0-9]):(60|[0-5][0-9])$/,

	  'email': /^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/,
	  'ip-address': /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
	  'ipv6': /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/,
	  'uri': /^[a-zA-Z][a-zA-Z0-9+-.]*:[^\s]*$/,

	  'color': /^(#?([0-9A-Fa-f]{3}){1,2}\b|aqua|black|blue|fuchsia|gray|green|lime|maroon|navy|olive|orange|purple|red|silver|teal|white|yellow|(rgb\(\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*,\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*,\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*\))|(rgb\(\s*(\d?\d%|100%)+\s*,\s*(\d?\d%|100%)+\s*,\s*(\d?\d%|100%)+\s*\)))$/,

	  // hostname regex from: http://stackoverflow.com/a/1420225/5628
	  'hostname': /^(?=.{1,255}$)[0-9A-Za-z](?:(?:[0-9A-Za-z]|-){0,61}[0-9A-Za-z])?(?:\.[0-9A-Za-z](?:(?:[0-9A-Za-z]|-){0,61}[0-9A-Za-z])?)*\.?$/,
	  'host-name': /^(?=.{1,255}$)[0-9A-Za-z](?:(?:[0-9A-Za-z]|-){0,61}[0-9A-Za-z])?(?:\.[0-9A-Za-z](?:(?:[0-9A-Za-z]|-){0,61}[0-9A-Za-z])?)*\.?$/,

	  'alpha': /^[a-zA-Z]+$/,
	  'alphanumeric': /^[a-zA-Z0-9]+$/,
	  'utc-millisec': function (input) {
	    return (typeof input === 'string') && parseFloat(input) === parseInt(input, 10) && !isNaN(input);
	  },
	  'regex': function (input) {
	    var result = true;
	    try {
	      new RegExp(input);
	    } catch (e) {
	      result = false;
	    }
	    return result;
	  },
	  'style': /\s*(.+?):\s*([^;]+);?/g,
	  'phone': /^\+(?:[0-9] ?){6,14}[0-9]$/
	};

	FORMAT_REGEXPS.regexp = FORMAT_REGEXPS.regex;
	FORMAT_REGEXPS.pattern = FORMAT_REGEXPS.regex;
	FORMAT_REGEXPS.ipv4 = FORMAT_REGEXPS['ip-address'];

	exports.isFormat = function isFormat (input, format, validator) {
	  if (typeof input === 'string' && FORMAT_REGEXPS[format] !== undefined) {
	    if (FORMAT_REGEXPS[format] instanceof RegExp) {
	      return FORMAT_REGEXPS[format].test(input);
	    }
	    if (typeof FORMAT_REGEXPS[format] === 'function') {
	      return FORMAT_REGEXPS[format](input);
	    }
	  } else if (validator && validator.customFormats &&
	      typeof validator.customFormats[format] === 'function') {
	    return validator.customFormats[format](input);
	  }
	  return true;
	};

	var makeSuffix = exports.makeSuffix = function makeSuffix (key) {
	  key = key.toString();
	  // This function could be capable of outputting valid a ECMAScript string, but the
	  // resulting code for testing which form to use would be tens of thousands of characters long
	  // That means this will use the name form for some illegal forms
	  if (!key.match(/[.\s\[\]]/) && !key.match(/^[\d]/)) {
	    return '.' + key;
	  }
	  if (key.match(/^\d+$/)) {
	    return '[' + key + ']';
	  }
	  return '[' + JSON.stringify(key) + ']';
	};

	exports.deepCompareStrict = function deepCompareStrict (a, b) {
	  if (typeof a !== typeof b) {
	    return false;
	  }
	  if (a instanceof Array) {
	    if (!(b instanceof Array)) {
	      return false;
	    }
	    if (a.length !== b.length) {
	      return false;
	    }
	    return a.every(function (v, i) {
	      return deepCompareStrict(a[i], b[i]);
	    });
	  }
	  if (typeof a === 'object') {
	    if (!a || !b) {
	      return a === b;
	    }
	    var aKeys = Object.keys(a);
	    var bKeys = Object.keys(b);
	    if (aKeys.length !== bKeys.length) {
	      return false;
	    }
	    return aKeys.every(function (v) {
	      return deepCompareStrict(a[v], b[v]);
	    });
	  }
	  return a === b;
	};

	module.exports.deepMerge = function deepMerge (target, src) {
	  var array = Array.isArray(src);
	  var dst = array && [] || {};

	  if (array) {
	    target = target || [];
	    dst = dst.concat(target);
	    src.forEach(function (e, i) {
	      if (typeof e === 'object') {
	        dst[i] = deepMerge(target[i], e)
	      } else {
	        if (target.indexOf(e) === -1) {
	          dst.push(e)
	        }
	      }
	    });
	  } else {
	    if (target && typeof target === 'object') {
	      Object.keys(target).forEach(function (key) {
	        dst[key] = target[key];
	      });
	    }
	    Object.keys(src).forEach(function (key) {
	      if (typeof src[key] !== 'object' || !src[key]) {
	        dst[key] = src[key];
	      }
	      else {
	        if (!target[key]) {
	          dst[key] = src[key];
	        } else {
	          dst[key] = deepMerge(target[key], src[key])
	        }
	      }
	    });
	  }

	  return dst;
	};

	/**
	 * Validates instance against the provided schema
	 * Implements URI+JSON Pointer encoding, e.g. "%7e"="~0"=>"~", "~1"="%2f"=>"/"
	 * @param o
	 * @param s The path to walk o along
	 * @return any
	 */
	exports.objectGetPath = function objectGetPath(o, s) {
	  var parts = s.split('/').slice(1);
	  var k;
	  while (typeof (k=parts.shift()) == 'string') {
	    var n = decodeURIComponent(k.replace(/~0/,'~').replace(/~1/g,'/'));
	    if (!(n in o)) return;
	    o = o[n];
	  }
	  return o;
	};

	/**
	 * Accept an Array of property names and return a JSON Pointer URI fragment
	 * @param Array a
	 * @return {String}
	 */
	exports.encodePath = function encodePointer(a){
		// ~ must be encoded explicitly because hacks
		// the slash is encoded by encodeURIComponent
		return a.map(function(v){ return '/'+encodeURIComponent(v).replace(/~/g,'%7E'); }).join('');
	};


/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = {
		"user": {
			"type": "object",
			"properties": {
				"id": {
					"type": "string"
				},
				"accountId": {
					"type": "string"
				},
				"email": {
					"type": "string"
				},
				"firstName": {
					"type": "string"
				},
				"lastName": {
					"type": "string"
				},
				"imageUrl": {
					"type": "string"
				},
				"referralCode": {
					"type": "string"
				},
				"locale": {
					"type": "string"
				}
			},
			"required": [
				"id",
				"accountId"
			]
		},
		"userLookUp": {
			"type": "object",
			"properties": {
				"id": {
					"type": "string"
				},
				"accountId": {
					"type": "string"
				}
			},
			"required": [
				"id",
				"accountId"
			]
		},
		"userReferralCode": {
			"type": "object",
			"properties": {
				"referralCode": {
					"type": "string"
				}
			},
			"required": [
				"referralCode"
			]
		},
		"applyReferralCode": {
			"type": "object",
			"properties": {
				"id": {
					"type": "string"
				},
				"accountId": {
					"type": "string"
				},
				"referralCode": {
					"type": "string"
				}
			},
			"required": [
				"id",
				"accountId",
				"referralCode"
			]
		}
	};

/***/ },
/* 14 */
/***/ function(module, exports) {

	(function(self) {
	  'use strict';

	  if (self.fetch) {
	    return
	  }

	  var support = {
	    searchParams: 'URLSearchParams' in self,
	    iterable: 'Symbol' in self && 'iterator' in Symbol,
	    blob: 'FileReader' in self && 'Blob' in self && (function() {
	      try {
	        new Blob()
	        return true
	      } catch(e) {
	        return false
	      }
	    })(),
	    formData: 'FormData' in self,
	    arrayBuffer: 'ArrayBuffer' in self
	  }

	  function normalizeName(name) {
	    if (typeof name !== 'string') {
	      name = String(name)
	    }
	    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
	      throw new TypeError('Invalid character in header field name')
	    }
	    return name.toLowerCase()
	  }

	  function normalizeValue(value) {
	    if (typeof value !== 'string') {
	      value = String(value)
	    }
	    return value
	  }

	  // Build a destructive iterator for the value list
	  function iteratorFor(items) {
	    var iterator = {
	      next: function() {
	        var value = items.shift()
	        return {done: value === undefined, value: value}
	      }
	    }

	    if (support.iterable) {
	      iterator[Symbol.iterator] = function() {
	        return iterator
	      }
	    }

	    return iterator
	  }

	  function Headers(headers) {
	    this.map = {}

	    if (headers instanceof Headers) {
	      headers.forEach(function(value, name) {
	        this.append(name, value)
	      }, this)

	    } else if (headers) {
	      Object.getOwnPropertyNames(headers).forEach(function(name) {
	        this.append(name, headers[name])
	      }, this)
	    }
	  }

	  Headers.prototype.append = function(name, value) {
	    name = normalizeName(name)
	    value = normalizeValue(value)
	    var list = this.map[name]
	    if (!list) {
	      list = []
	      this.map[name] = list
	    }
	    list.push(value)
	  }

	  Headers.prototype['delete'] = function(name) {
	    delete this.map[normalizeName(name)]
	  }

	  Headers.prototype.get = function(name) {
	    var values = this.map[normalizeName(name)]
	    return values ? values[0] : null
	  }

	  Headers.prototype.getAll = function(name) {
	    return this.map[normalizeName(name)] || []
	  }

	  Headers.prototype.has = function(name) {
	    return this.map.hasOwnProperty(normalizeName(name))
	  }

	  Headers.prototype.set = function(name, value) {
	    this.map[normalizeName(name)] = [normalizeValue(value)]
	  }

	  Headers.prototype.forEach = function(callback, thisArg) {
	    Object.getOwnPropertyNames(this.map).forEach(function(name) {
	      this.map[name].forEach(function(value) {
	        callback.call(thisArg, value, name, this)
	      }, this)
	    }, this)
	  }

	  Headers.prototype.keys = function() {
	    var items = []
	    this.forEach(function(value, name) { items.push(name) })
	    return iteratorFor(items)
	  }

	  Headers.prototype.values = function() {
	    var items = []
	    this.forEach(function(value) { items.push(value) })
	    return iteratorFor(items)
	  }

	  Headers.prototype.entries = function() {
	    var items = []
	    this.forEach(function(value, name) { items.push([name, value]) })
	    return iteratorFor(items)
	  }

	  if (support.iterable) {
	    Headers.prototype[Symbol.iterator] = Headers.prototype.entries
	  }

	  function consumed(body) {
	    if (body.bodyUsed) {
	      return Promise.reject(new TypeError('Already read'))
	    }
	    body.bodyUsed = true
	  }

	  function fileReaderReady(reader) {
	    return new Promise(function(resolve, reject) {
	      reader.onload = function() {
	        resolve(reader.result)
	      }
	      reader.onerror = function() {
	        reject(reader.error)
	      }
	    })
	  }

	  function readBlobAsArrayBuffer(blob) {
	    var reader = new FileReader()
	    reader.readAsArrayBuffer(blob)
	    return fileReaderReady(reader)
	  }

	  function readBlobAsText(blob) {
	    var reader = new FileReader()
	    reader.readAsText(blob)
	    return fileReaderReady(reader)
	  }

	  function Body() {
	    this.bodyUsed = false

	    this._initBody = function(body) {
	      this._bodyInit = body
	      if (typeof body === 'string') {
	        this._bodyText = body
	      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
	        this._bodyBlob = body
	      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
	        this._bodyFormData = body
	      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
	        this._bodyText = body.toString()
	      } else if (!body) {
	        this._bodyText = ''
	      } else if (support.arrayBuffer && ArrayBuffer.prototype.isPrototypeOf(body)) {
	        // Only support ArrayBuffers for POST method.
	        // Receiving ArrayBuffers happens via Blobs, instead.
	      } else {
	        throw new Error('unsupported BodyInit type')
	      }

	      if (!this.headers.get('content-type')) {
	        if (typeof body === 'string') {
	          this.headers.set('content-type', 'text/plain;charset=UTF-8')
	        } else if (this._bodyBlob && this._bodyBlob.type) {
	          this.headers.set('content-type', this._bodyBlob.type)
	        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
	          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
	        }
	      }
	    }

	    if (support.blob) {
	      this.blob = function() {
	        var rejected = consumed(this)
	        if (rejected) {
	          return rejected
	        }

	        if (this._bodyBlob) {
	          return Promise.resolve(this._bodyBlob)
	        } else if (this._bodyFormData) {
	          throw new Error('could not read FormData body as blob')
	        } else {
	          return Promise.resolve(new Blob([this._bodyText]))
	        }
	      }

	      this.arrayBuffer = function() {
	        return this.blob().then(readBlobAsArrayBuffer)
	      }

	      this.text = function() {
	        var rejected = consumed(this)
	        if (rejected) {
	          return rejected
	        }

	        if (this._bodyBlob) {
	          return readBlobAsText(this._bodyBlob)
	        } else if (this._bodyFormData) {
	          throw new Error('could not read FormData body as text')
	        } else {
	          return Promise.resolve(this._bodyText)
	        }
	      }
	    } else {
	      this.text = function() {
	        var rejected = consumed(this)
	        return rejected ? rejected : Promise.resolve(this._bodyText)
	      }
	    }

	    if (support.formData) {
	      this.formData = function() {
	        return this.text().then(decode)
	      }
	    }

	    this.json = function() {
	      return this.text().then(JSON.parse)
	    }

	    return this
	  }

	  // HTTP methods whose capitalization should be normalized
	  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

	  function normalizeMethod(method) {
	    var upcased = method.toUpperCase()
	    return (methods.indexOf(upcased) > -1) ? upcased : method
	  }

	  function Request(input, options) {
	    options = options || {}
	    var body = options.body
	    if (Request.prototype.isPrototypeOf(input)) {
	      if (input.bodyUsed) {
	        throw new TypeError('Already read')
	      }
	      this.url = input.url
	      this.credentials = input.credentials
	      if (!options.headers) {
	        this.headers = new Headers(input.headers)
	      }
	      this.method = input.method
	      this.mode = input.mode
	      if (!body) {
	        body = input._bodyInit
	        input.bodyUsed = true
	      }
	    } else {
	      this.url = input
	    }

	    this.credentials = options.credentials || this.credentials || 'omit'
	    if (options.headers || !this.headers) {
	      this.headers = new Headers(options.headers)
	    }
	    this.method = normalizeMethod(options.method || this.method || 'GET')
	    this.mode = options.mode || this.mode || null
	    this.referrer = null

	    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
	      throw new TypeError('Body not allowed for GET or HEAD requests')
	    }
	    this._initBody(body)
	  }

	  Request.prototype.clone = function() {
	    return new Request(this)
	  }

	  function decode(body) {
	    var form = new FormData()
	    body.trim().split('&').forEach(function(bytes) {
	      if (bytes) {
	        var split = bytes.split('=')
	        var name = split.shift().replace(/\+/g, ' ')
	        var value = split.join('=').replace(/\+/g, ' ')
	        form.append(decodeURIComponent(name), decodeURIComponent(value))
	      }
	    })
	    return form
	  }

	  function headers(xhr) {
	    var head = new Headers()
	    var pairs = (xhr.getAllResponseHeaders() || '').trim().split('\n')
	    pairs.forEach(function(header) {
	      var split = header.trim().split(':')
	      var key = split.shift().trim()
	      var value = split.join(':').trim()
	      head.append(key, value)
	    })
	    return head
	  }

	  Body.call(Request.prototype)

	  function Response(bodyInit, options) {
	    if (!options) {
	      options = {}
	    }

	    this.type = 'default'
	    this.status = options.status
	    this.ok = this.status >= 200 && this.status < 300
	    this.statusText = options.statusText
	    this.headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers)
	    this.url = options.url || ''
	    this._initBody(bodyInit)
	  }

	  Body.call(Response.prototype)

	  Response.prototype.clone = function() {
	    return new Response(this._bodyInit, {
	      status: this.status,
	      statusText: this.statusText,
	      headers: new Headers(this.headers),
	      url: this.url
	    })
	  }

	  Response.error = function() {
	    var response = new Response(null, {status: 0, statusText: ''})
	    response.type = 'error'
	    return response
	  }

	  var redirectStatuses = [301, 302, 303, 307, 308]

	  Response.redirect = function(url, status) {
	    if (redirectStatuses.indexOf(status) === -1) {
	      throw new RangeError('Invalid status code')
	    }

	    return new Response(null, {status: status, headers: {location: url}})
	  }

	  self.Headers = Headers
	  self.Request = Request
	  self.Response = Response

	  self.fetch = function(input, init) {
	    return new Promise(function(resolve, reject) {
	      var request
	      if (Request.prototype.isPrototypeOf(input) && !init) {
	        request = input
	      } else {
	        request = new Request(input, init)
	      }

	      var xhr = new XMLHttpRequest()

	      function responseURL() {
	        if ('responseURL' in xhr) {
	          return xhr.responseURL
	        }

	        // Avoid security warnings on getResponseHeader when not allowed by CORS
	        if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
	          return xhr.getResponseHeader('X-Request-URL')
	        }

	        return
	      }

	      xhr.onload = function() {
	        var options = {
	          status: xhr.status,
	          statusText: xhr.statusText,
	          headers: headers(xhr),
	          url: responseURL()
	        }
	        var body = 'response' in xhr ? xhr.response : xhr.responseText
	        resolve(new Response(body, options))
	      }

	      xhr.onerror = function() {
	        reject(new TypeError('Network request failed'))
	      }

	      xhr.ontimeout = function() {
	        reject(new TypeError('Network request failed'))
	      }

	      xhr.open(request.method, request.url, true)

	      if (request.credentials === 'include') {
	        xhr.withCredentials = true
	      }

	      if ('responseType' in xhr && support.blob) {
	        xhr.responseType = 'blob'
	      }

	      request.headers.forEach(function(value, name) {
	        xhr.setRequestHeader(name, value)
	      })

	      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
	    })
	  }
	  self.fetch.polyfill = true
	})(typeof self !== 'undefined' ? self : this);


/***/ },
/* 15 */,
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.EmbedWidget = exports.PopupWidget = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _domready = __webpack_require__(17);

	var _elementResizeDetector = __webpack_require__(18);

	var _elementResizeDetector2 = _interopRequireDefault(_elementResizeDetector);

	var _debug = __webpack_require__(34);

	var _debug2 = _interopRequireDefault(_debug);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var _log = (0, _debug2.default)('squatch-js:widget');

	var Widget = function () {
	  function Widget(content) {
	    _classCallCheck(this, Widget);

	    _log('widget initializing ...');
	    this.content = content;
	    this.frame = document.createElement('iframe');
	    this.frame.width = '100%';
	    this.frame.style = 'border: 0; background-color: none;';
	    this.erd = (0, _elementResizeDetector2.default)({ strategy: 'scroll' });
	    // this.api = new WidgetApi(/*params*/)
	  }

	  _createClass(Widget, [{
	    key: 'load',
	    value: function load() {}
	  }]);

	  return Widget;
	}();

	var PopupWidget = exports.PopupWidget = function (_Widget) {
	  _inherits(PopupWidget, _Widget);

	  function PopupWidget(content) {
	    var triggerId = arguments.length <= 1 || arguments[1] === undefined ? 'squatchpop' : arguments[1];

	    _classCallCheck(this, PopupWidget);

	    var _this = _possibleConstructorReturn(this, (PopupWidget.__proto__ || Object.getPrototypeOf(PopupWidget)).call(this, content));

	    var me = _this;
	    // me.frame.id = 'someId';
	    me.frame.style.backgroundColor = '#fff';
	    me.triggerElement = document.getElementById(triggerId);

	    if (!me.triggerElement) throw new Error("elementId \'" + triggerId + "\' not found.");

	    me.popupdiv = document.createElement('div');
	    me.popupdiv.id = 'squatchModal';
	    me.popupdiv.style = 'display: none; position: fixed; z-index: 1; padding-top: 5%; left: 0; top: -2000px; width: 100%; height: 100%; overflow: auto; background-color: rgb(0,0,0); background-color: rgba(0,0,0,0.4);';

	    me.closebtn = document.createElement('span');
	    me.closebtn.style = 'position: absolute; right: 5px; top: 5px; font-size: 11px; font-family: "Helvetica Neue",Helvetica,Arial,sans-serif; color: #4486E1; cursor: pointer;';
	    me.closebtn.innerHTML = 'Close';

	    me.popupcontent = document.createElement('div');
	    me.popupcontent.style = "margin: auto; width: 80%; max-width: 500px; position: relative;";
	    me.popupcontent.appendChild(me.closebtn);

	    me.triggerElement.onclick = function () {
	      me.open();
	    };
	    me.popupdiv.onclick = function (event) {
	      me._clickedOutside(event);
	    };
	    me.closebtn.onclick = function () {
	      me.close();
	    };
	    return _this;
	  }

	  _createClass(PopupWidget, [{
	    key: 'load',
	    value: function load() {
	      var me = this;

	      me.popupdiv.appendChild(me.popupcontent);
	      document.body.appendChild(me.popupdiv);
	      me.popupcontent.appendChild(me.frame);

	      var frameDoc = me.frame.contentWindow.document;
	      frameDoc.open();
	      frameDoc.write(me.content);
	      frameDoc.close();
	    }
	  }, {
	    key: 'open',
	    value: function open() {
	      var popupdiv = this.popupdiv;
	      var frame = this.frame;
	      var frameDoc = frame.contentWindow.document;
	      var erd = this.erd;

	      // Adjust frame height when size of body changes
	      (0, _domready.domready)(frameDoc, function () {
	        frameDoc.body.style.overflowY = 'hidden';
	        popupdiv.style.display = 'table';
	        popupdiv.style.top = '0';

	        erd.listenTo(frameDoc.body, function (element) {
	          var height = element.offsetHeight;

	          if (height > 0) frame.height = height;

	          if (window.innerHeight > frame.height) {
	            popupdiv.style.paddingTop = (window.innerHeight - frame.height) / 2 + "px";
	          } else {
	            popupdiv.style.paddingTop = "5px";
	          }
	        });
	      });
	    }
	  }, {
	    key: 'close',
	    value: function close() {
	      var popupdiv = this.popupdiv;
	      var frameDoc = this.frame.contentWindow.document;
	      var erd = this.erd;

	      popupdiv.style.display = 'none';
	      erd.uninstall(frameDoc.body);
	    }
	  }, {
	    key: '_clickedOutside',
	    value: function _clickedOutside(e) {
	      var popupdiv = this.popupdiv;

	      if (e.target == this.popupdiv) {
	        this.close();
	      }
	    }
	  }]);

	  return PopupWidget;
	}(Widget);

	var EmbedWidget = exports.EmbedWidget = function (_Widget2) {
	  _inherits(EmbedWidget, _Widget2);

	  function EmbedWidget(content) {
	    var elementId = arguments.length <= 1 || arguments[1] === undefined ? 'squatchembed' : arguments[1];

	    _classCallCheck(this, EmbedWidget);

	    // this.frame.id = 'someId';
	    var _this2 = _possibleConstructorReturn(this, (EmbedWidget.__proto__ || Object.getPrototypeOf(EmbedWidget)).call(this, content));

	    _this2.element = document.getElementById(elementId);

	    if (!_this2.element) throw new Error("elementId \'" + elementId + "\' not found.");
	    return _this2;
	  }

	  _createClass(EmbedWidget, [{
	    key: 'load',
	    value: function load() {
	      var me = this;

	      me.element.appendChild(me.frame);

	      var frameDoc = me.frame.contentWindow.document;
	      frameDoc.open();
	      frameDoc.write(me.content);
	      frameDoc.close();

	      (0, _domready.domready)(frameDoc, function () {
	        me.frame.height = frameDoc.body.scrollHeight;

	        // Adjust frame height when size of body changes
	        me.erd.listenTo(frameDoc.body, function (element) {
	          var height = element.offsetHeight;
	          me.frame.height = height;
	        });
	      });
	    }
	  }]);

	  return EmbedWidget;
	}(Widget);

/***/ },
/* 17 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.domready = domready;
	/*!
	  * domready (c) Dustin Diaz 2014 - License MIT
	  *
	  */
	function domready(targetDoc, fn) {
	  var fns = [],
	      _listener = void 0,
	      doc = targetDoc,
	      hack = doc.documentElement.doScroll,
	      domContentLoaded = 'DOMContentLoaded',
	      loaded = (hack ? /^loaded|^c/ : /^loaded|^i|^c/).test(doc.readyState);

	  if (!loaded) doc.addEventListener(domContentLoaded, _listener = function listener() {
	    doc.removeEventListener(domContentLoaded, _listener);
	    loaded = 1;
	    while (_listener = fns.shift()) {
	      _listener();
	    }
	  });

	  return loaded ? setTimeout(fn, 0) : fns.push(fn);
	}

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var forEach                 = __webpack_require__(19).forEach;
	var elementUtilsMaker       = __webpack_require__(20);
	var listenerHandlerMaker    = __webpack_require__(21);
	var idGeneratorMaker        = __webpack_require__(22);
	var idHandlerMaker          = __webpack_require__(23);
	var reporterMaker           = __webpack_require__(24);
	var browserDetector         = __webpack_require__(25);
	var batchProcessorMaker     = __webpack_require__(26);
	var stateHandler            = __webpack_require__(28);

	//Detection strategies.
	var objectStrategyMaker     = __webpack_require__(29);
	var scrollStrategyMaker     = __webpack_require__(30);

	function isCollection(obj) {
	    return Array.isArray(obj) || obj.length !== undefined;
	}

	function toArray(collection) {
	    if (!Array.isArray(collection)) {
	        var array = [];
	        forEach(collection, function (obj) {
	            array.push(obj);
	        });
	        return array;
	    } else {
	        return collection;
	    }
	}

	function isElement(obj) {
	    return obj && obj.nodeType === 1;
	}

	/**
	 * @typedef idHandler
	 * @type {object}
	 * @property {function} get Gets the resize detector id of the element.
	 * @property {function} set Generate and sets the resize detector id of the element.
	 */

	/**
	 * @typedef Options
	 * @type {object}
	 * @property {boolean} callOnAdd    Determines if listeners should be called when they are getting added.
	                                    Default is true. If true, the listener is guaranteed to be called when it has been added.
	                                    If false, the listener will not be guarenteed to be called when it has been added (does not prevent it from being called).
	 * @property {idHandler} idHandler  A custom id handler that is responsible for generating, setting and retrieving id's for elements.
	                                    If not provided, a default id handler will be used.
	 * @property {reporter} reporter    A custom reporter that handles reporting logs, warnings and errors.
	                                    If not provided, a default id handler will be used.
	                                    If set to false, then nothing will be reported.
	 * @property {boolean} debug        If set to true, the the system will report debug messages as default for the listenTo method.
	 */

	/**
	 * Creates an element resize detector instance.
	 * @public
	 * @param {Options?} options Optional global options object that will decide how this instance will work.
	 */
	module.exports = function(options) {
	    options = options || {};

	    //idHandler is currently not an option to the listenTo function, so it should not be added to globalOptions.
	    var idHandler;

	    if (options.idHandler) {
	        // To maintain compatability with idHandler.get(element, readonly), make sure to wrap the given idHandler
	        // so that readonly flag always is true when it's used here. This may be removed next major version bump.
	        idHandler = {
	            get: function (element) { return options.idHandler.get(element, true); },
	            set: options.idHandler.set
	        };
	    } else {
	        var idGenerator = idGeneratorMaker();
	        var defaultIdHandler = idHandlerMaker({
	            idGenerator: idGenerator,
	            stateHandler: stateHandler
	        });
	        idHandler = defaultIdHandler;
	    }

	    //reporter is currently not an option to the listenTo function, so it should not be added to globalOptions.
	    var reporter = options.reporter;

	    if(!reporter) {
	        //If options.reporter is false, then the reporter should be quiet.
	        var quiet = reporter === false;
	        reporter = reporterMaker(quiet);
	    }

	    //batchProcessor is currently not an option to the listenTo function, so it should not be added to globalOptions.
	    var batchProcessor = getOption(options, "batchProcessor", batchProcessorMaker({ reporter: reporter }));

	    //Options to be used as default for the listenTo function.
	    var globalOptions = {};
	    globalOptions.callOnAdd     = !!getOption(options, "callOnAdd", true);
	    globalOptions.debug         = !!getOption(options, "debug", false);

	    var eventListenerHandler    = listenerHandlerMaker(idHandler);
	    var elementUtils            = elementUtilsMaker({
	        stateHandler: stateHandler
	    });

	    //The detection strategy to be used.
	    var detectionStrategy;
	    var desiredStrategy = getOption(options, "strategy", "object");
	    var strategyOptions = {
	        reporter: reporter,
	        batchProcessor: batchProcessor,
	        stateHandler: stateHandler,
	        idHandler: idHandler
	    };

	    if(desiredStrategy === "scroll") {
	        if (browserDetector.isLegacyOpera()) {
	            reporter.warn("Scroll strategy is not supported on legacy Opera. Changing to object strategy.");
	            desiredStrategy = "object";
	        } else if (browserDetector.isIE(9)) {
	            reporter.warn("Scroll strategy is not supported on IE9. Changing to object strategy.");
	            desiredStrategy = "object";
	        }
	    }

	    if(desiredStrategy === "scroll") {
	        detectionStrategy = scrollStrategyMaker(strategyOptions);
	    } else if(desiredStrategy === "object") {
	        detectionStrategy = objectStrategyMaker(strategyOptions);
	    } else {
	        throw new Error("Invalid strategy name: " + desiredStrategy);
	    }

	    //Calls can be made to listenTo with elements that are still being installed.
	    //Also, same elements can occur in the elements list in the listenTo function.
	    //With this map, the ready callbacks can be synchronized between the calls
	    //so that the ready callback can always be called when an element is ready - even if
	    //it wasn't installed from the function itself.
	    var onReadyCallbacks = {};

	    /**
	     * Makes the given elements resize-detectable and starts listening to resize events on the elements. Calls the event callback for each event for each element.
	     * @public
	     * @param {Options?} options Optional options object. These options will override the global options. Some options may not be overriden, such as idHandler.
	     * @param {element[]|element} elements The given array of elements to detect resize events of. Single element is also valid.
	     * @param {function} listener The callback to be executed for each resize event for each element.
	     */
	    function listenTo(options, elements, listener) {
	        function onResizeCallback(element) {
	            var listeners = eventListenerHandler.get(element);
	            forEach(listeners, function callListenerProxy(listener) {
	                listener(element);
	            });
	        }

	        function addListener(callOnAdd, element, listener) {
	            eventListenerHandler.add(element, listener);

	            if(callOnAdd) {
	                listener(element);
	            }
	        }

	        //Options object may be omitted.
	        if(!listener) {
	            listener = elements;
	            elements = options;
	            options = {};
	        }

	        if(!elements) {
	            throw new Error("At least one element required.");
	        }

	        if(!listener) {
	            throw new Error("Listener required.");
	        }

	        if (isElement(elements)) {
	            // A single element has been passed in.
	            elements = [elements];
	        } else if (isCollection(elements)) {
	            // Convert collection to array for plugins.
	            // TODO: May want to check so that all the elements in the collection are valid elements.
	            elements = toArray(elements);
	        } else {
	            return reporter.error("Invalid arguments. Must be a DOM element or a collection of DOM elements.");
	        }

	        var elementsReady = 0;

	        var callOnAdd = getOption(options, "callOnAdd", globalOptions.callOnAdd);
	        var onReadyCallback = getOption(options, "onReady", function noop() {});
	        var debug = getOption(options, "debug", globalOptions.debug);

	        forEach(elements, function attachListenerToElement(element) {
	            if (!stateHandler.getState(element)) {
	                stateHandler.initState(element);
	                idHandler.set(element);
	            }

	            var id = idHandler.get(element);

	            debug && reporter.log("Attaching listener to element", id, element);

	            if(!elementUtils.isDetectable(element)) {
	                debug && reporter.log(id, "Not detectable.");
	                if(elementUtils.isBusy(element)) {
	                    debug && reporter.log(id, "System busy making it detectable");

	                    //The element is being prepared to be detectable. Do not make it detectable.
	                    //Just add the listener, because the element will soon be detectable.
	                    addListener(callOnAdd, element, listener);
	                    onReadyCallbacks[id] = onReadyCallbacks[id] || [];
	                    onReadyCallbacks[id].push(function onReady() {
	                        elementsReady++;

	                        if(elementsReady === elements.length) {
	                            onReadyCallback();
	                        }
	                    });
	                    return;
	                }

	                debug && reporter.log(id, "Making detectable...");
	                //The element is not prepared to be detectable, so do prepare it and add a listener to it.
	                elementUtils.markBusy(element, true);
	                return detectionStrategy.makeDetectable({ debug: debug }, element, function onElementDetectable(element) {
	                    debug && reporter.log(id, "onElementDetectable");

	                    if (stateHandler.getState(element)) {
	                        elementUtils.markAsDetectable(element);
	                        elementUtils.markBusy(element, false);
	                        detectionStrategy.addListener(element, onResizeCallback);
	                        addListener(callOnAdd, element, listener);

	                        // Since the element size might have changed since the call to "listenTo", we need to check for this change,
	                        // so that a resize event may be emitted.
	                        // Having the startSize object is optional (since it does not make sense in some cases such as unrendered elements), so check for its existance before.
	                        // Also, check the state existance before since the element may have been uninstalled in the installation process.
	                        var state = stateHandler.getState(element);
	                        if (state && state.startSize) {
	                            var width = element.offsetWidth;
	                            var height = element.offsetHeight;
	                            if (state.startSize.width !== width || state.startSize.height !== height) {
	                                onResizeCallback(element);
	                            }
	                        }

	                        if(onReadyCallbacks[id]) {
	                            forEach(onReadyCallbacks[id], function(callback) {
	                                callback();
	                            });
	                        }
	                    } else {
	                        // The element has been unisntalled before being detectable.
	                        debug && reporter.log(id, "Element uninstalled before being detectable.");
	                    }

	                    delete onReadyCallbacks[id];

	                    elementsReady++;
	                    if(elementsReady === elements.length) {
	                        onReadyCallback();
	                    }
	                });
	            }

	            debug && reporter.log(id, "Already detecable, adding listener.");

	            //The element has been prepared to be detectable and is ready to be listened to.
	            addListener(callOnAdd, element, listener);
	            elementsReady++;
	        });

	        if(elementsReady === elements.length) {
	            onReadyCallback();
	        }
	    }

	    function uninstall(elements) {
	        if(!elements) {
	            return reporter.error("At least one element is required.");
	        }

	        if (isElement(elements)) {
	            // A single element has been passed in.
	            elements = [elements];
	        } else if (isCollection(elements)) {
	            // Convert collection to array for plugins.
	            // TODO: May want to check so that all the elements in the collection are valid elements.
	            elements = toArray(elements);
	        } else {
	            return reporter.error("Invalid arguments. Must be a DOM element or a collection of DOM elements.");
	        }

	        forEach(elements, function (element) {
	            eventListenerHandler.removeAllListeners(element);
	            detectionStrategy.uninstall(element);
	            stateHandler.cleanState(element);
	        });
	    }

	    return {
	        listenTo: listenTo,
	        removeListener: eventListenerHandler.removeListener,
	        removeAllListeners: eventListenerHandler.removeAllListeners,
	        uninstall: uninstall
	    };
	};

	function getOption(options, name, defaultValue) {
	    var value = options[name];

	    if((value === undefined || value === null) && defaultValue !== undefined) {
	        return defaultValue;
	    }

	    return value;
	}


/***/ },
/* 19 */
/***/ function(module, exports) {

	"use strict";

	var utils = module.exports = {};

	/**
	 * Loops through the collection and calls the callback for each element. if the callback returns truthy, the loop is broken and returns the same value.
	 * @public
	 * @param {*} collection The collection to loop through. Needs to have a length property set and have indices set from 0 to length - 1.
	 * @param {function} callback The callback to be called for each element. The element will be given as a parameter to the callback. If this callback returns truthy, the loop is broken and the same value is returned.
	 * @returns {*} The value that a callback has returned (if truthy). Otherwise nothing.
	 */
	utils.forEach = function(collection, callback) {
	    for(var i = 0; i < collection.length; i++) {
	        var result = callback(collection[i]);
	        if(result) {
	            return result;
	        }
	    }
	};


/***/ },
/* 20 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function(options) {
	    var getState = options.stateHandler.getState;

	    /**
	     * Tells if the element has been made detectable and ready to be listened for resize events.
	     * @public
	     * @param {element} The element to check.
	     * @returns {boolean} True or false depending on if the element is detectable or not.
	     */
	    function isDetectable(element) {
	        var state = getState(element);
	        return state && !!state.isDetectable;
	    }

	    /**
	     * Marks the element that it has been made detectable and ready to be listened for resize events.
	     * @public
	     * @param {element} The element to mark.
	     */
	    function markAsDetectable(element) {
	        getState(element).isDetectable = true;
	    }

	    /**
	     * Tells if the element is busy or not.
	     * @public
	     * @param {element} The element to check.
	     * @returns {boolean} True or false depending on if the element is busy or not.
	     */
	    function isBusy(element) {
	        return !!getState(element).busy;
	    }

	    /**
	     * Marks the object is busy and should not be made detectable.
	     * @public
	     * @param {element} element The element to mark.
	     * @param {boolean} busy If the element is busy or not.
	     */
	    function markBusy(element, busy) {
	        getState(element).busy = !!busy;
	    }

	    return {
	        isDetectable: isDetectable,
	        markAsDetectable: markAsDetectable,
	        isBusy: isBusy,
	        markBusy: markBusy
	    };
	};


/***/ },
/* 21 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function(idHandler) {
	    var eventListeners = {};

	    /**
	     * Gets all listeners for the given element.
	     * @public
	     * @param {element} element The element to get all listeners for.
	     * @returns All listeners for the given element.
	     */
	    function getListeners(element) {
	        var id = idHandler.get(element);

	        if (id === undefined) {
	            return [];
	        }

	        return eventListeners[id] || [];
	    }

	    /**
	     * Stores the given listener for the given element. Will not actually add the listener to the element.
	     * @public
	     * @param {element} element The element that should have the listener added.
	     * @param {function} listener The callback that the element has added.
	     */
	    function addListener(element, listener) {
	        var id = idHandler.get(element);

	        if(!eventListeners[id]) {
	            eventListeners[id] = [];
	        }

	        eventListeners[id].push(listener);
	    }

	    function removeListener(element, listener) {
	        var listeners = getListeners(element);
	        for (var i = 0, len = listeners.length; i < len; ++i) {
	            if (listeners[i] === listener) {
	              listeners.splice(i, 1);
	              break;
	            }
	        }
	    }

	    function removeAllListeners(element) {
	      var listeners = getListeners(element);
	      if (!listeners) { return; }
	      listeners.length = 0;
	    }

	    return {
	        get: getListeners,
	        add: addListener,
	        removeListener: removeListener,
	        removeAllListeners: removeAllListeners
	    };
	};


/***/ },
/* 22 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function() {
	    var idCount = 1;

	    /**
	     * Generates a new unique id in the context.
	     * @public
	     * @returns {number} A unique id in the context.
	     */
	    function generate() {
	        return idCount++;
	    }

	    return {
	        generate: generate
	    };
	};


/***/ },
/* 23 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function(options) {
	    var idGenerator     = options.idGenerator;
	    var getState        = options.stateHandler.getState;

	    /**
	     * Gets the resize detector id of the element.
	     * @public
	     * @param {element} element The target element to get the id of.
	     * @returns {string|number|null} The id of the element. Null if it has no id.
	     */
	    function getId(element) {
	        var state = getState(element);

	        if (state && state.id !== undefined) {
	            return state.id;
	        }

	        return null;
	    }

	    /**
	     * Sets the resize detector id of the element. Requires the element to have a resize detector state initialized.
	     * @public
	     * @param {element} element The target element to set the id of.
	     * @returns {string|number|null} The id of the element.
	     */
	    function setId(element) {
	        var state = getState(element);

	        if (!state) {
	            throw new Error("setId required the element to have a resize detection state.");
	        }

	        var id = idGenerator.generate();

	        state.id = id;

	        return id;
	    }

	    return {
	        get: getId,
	        set: setId
	    };
	};


/***/ },
/* 24 */
/***/ function(module, exports) {

	"use strict";

	/* global console: false */

	/**
	 * Reporter that handles the reporting of logs, warnings and errors.
	 * @public
	 * @param {boolean} quiet Tells if the reporter should be quiet or not.
	 */
	module.exports = function(quiet) {
	    function noop() {
	        //Does nothing.
	    }

	    var reporter = {
	        log: noop,
	        warn: noop,
	        error: noop
	    };

	    if(!quiet && window.console) {
	        var attachFunction = function(reporter, name) {
	            //The proxy is needed to be able to call the method with the console context,
	            //since we cannot use bind.
	            reporter[name] = function reporterProxy() {
	                var f = console[name];
	                if (f.apply) { //IE9 does not support console.log.apply :)
	                    f.apply(console, arguments);
	                } else {
	                    for (var i = 0; i < arguments.length; i++) {
	                        f(arguments[i]);
	                    }
	                }
	            };
	        };

	        attachFunction(reporter, "log");
	        attachFunction(reporter, "warn");
	        attachFunction(reporter, "error");
	    }

	    return reporter;
	};

/***/ },
/* 25 */
/***/ function(module, exports) {

	"use strict";

	var detector = module.exports = {};

	detector.isIE = function(version) {
	    function isAnyIeVersion() {
	        var agent = navigator.userAgent.toLowerCase();
	        return agent.indexOf("msie") !== -1 || agent.indexOf("trident") !== -1 || agent.indexOf(" edge/") !== -1;
	    }

	    if(!isAnyIeVersion()) {
	        return false;
	    }

	    if(!version) {
	        return true;
	    }

	    //Shamelessly stolen from https://gist.github.com/padolsey/527683
	    var ieVersion = (function(){
	        var undef,
	            v = 3,
	            div = document.createElement("div"),
	            all = div.getElementsByTagName("i");

	        do {
	            div.innerHTML = "<!--[if gt IE " + (++v) + "]><i></i><![endif]-->";
	        }
	        while (all[0]);

	        return v > 4 ? v : undef;
	    }());

	    return version === ieVersion;
	};

	detector.isLegacyOpera = function() {
	    return !!window.opera;
	};


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var utils = __webpack_require__(27);

	module.exports = function batchProcessorMaker(options) {
	    options             = options || {};
	    var reporter        = options.reporter;
	    var asyncProcess    = utils.getOption(options, "async", true);
	    var autoProcess     = utils.getOption(options, "auto", true);

	    if(autoProcess && !asyncProcess) {
	        reporter && reporter.warn("Invalid options combination. auto=true and async=false is invalid. Setting async=true.");
	        asyncProcess = true;
	    }

	    var batch = Batch();
	    var asyncFrameHandler;
	    var isProcessing = false;

	    function addFunction(level, fn) {
	        if(!isProcessing && autoProcess && asyncProcess && batch.size() === 0) {
	            // Since this is async, it is guaranteed to be executed after that the fn is added to the batch.
	            // This needs to be done before, since we're checking the size of the batch to be 0.
	            processBatchAsync();
	        }

	        batch.add(level, fn);
	    }

	    function processBatch() {
	        // Save the current batch, and create a new batch so that incoming functions are not added into the currently processing batch.
	        // Continue processing until the top-level batch is empty (functions may be added to the new batch while processing, and so on).
	        isProcessing = true;
	        while (batch.size()) {
	            var processingBatch = batch;
	            batch = Batch();
	            processingBatch.process();
	        }
	        isProcessing = false;
	    }

	    function forceProcessBatch(localAsyncProcess) {
	        if (isProcessing) {
	            return;
	        }

	        if(localAsyncProcess === undefined) {
	            localAsyncProcess = asyncProcess;
	        }

	        if(asyncFrameHandler) {
	            cancelFrame(asyncFrameHandler);
	            asyncFrameHandler = null;
	        }

	        if(localAsyncProcess) {
	            processBatchAsync();
	        } else {
	            processBatch();
	        }
	    }

	    function processBatchAsync() {
	        asyncFrameHandler = requestFrame(processBatch);
	    }

	    function clearBatch() {
	        batch           = {};
	        batchSize       = 0;
	        topLevel        = 0;
	        bottomLevel     = 0;
	    }

	    function cancelFrame(listener) {
	        // var cancel = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.clearTimeout;
	        var cancel = clearTimeout;
	        return cancel(listener);
	    }

	    function requestFrame(callback) {
	        // var raf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || function(fn) { return window.setTimeout(fn, 20); };
	        var raf = function(fn) { return setTimeout(fn, 0); };
	        return raf(callback);
	    }

	    return {
	        add: addFunction,
	        force: forceProcessBatch
	    };
	};

	function Batch() {
	    var batch       = {};
	    var size        = 0;
	    var topLevel    = 0;
	    var bottomLevel = 0;

	    function add(level, fn) {
	        if(!fn) {
	            fn = level;
	            level = 0;
	        }

	        if(level > topLevel) {
	            topLevel = level;
	        } else if(level < bottomLevel) {
	            bottomLevel = level;
	        }

	        if(!batch[level]) {
	            batch[level] = [];
	        }

	        batch[level].push(fn);
	        size++;
	    }

	    function process() {
	        for(var level = bottomLevel; level <= topLevel; level++) {
	            var fns = batch[level];

	            for(var i = 0; i < fns.length; i++) {
	                var fn = fns[i];
	                fn();
	            }
	        }
	    }

	    function getSize() {
	        return size;
	    }

	    return {
	        add: add,
	        process: process,
	        size: getSize
	    };
	}


/***/ },
/* 27 */
/***/ function(module, exports) {

	"use strict";

	var utils = module.exports = {};

	utils.getOption = getOption;

	function getOption(options, name, defaultValue) {
	    var value = options[name];

	    if((value === undefined || value === null) && defaultValue !== undefined) {
	        return defaultValue;
	    }

	    return value;
	}


/***/ },
/* 28 */
/***/ function(module, exports) {

	"use strict";

	var prop = "_erd";

	function initState(element) {
	    element[prop] = {};
	    return getState(element);
	}

	function getState(element) {
	    return element[prop];
	}

	function cleanState(element) {
	    delete element[prop];
	}

	module.exports = {
	    initState: initState,
	    getState: getState,
	    cleanState: cleanState
	};


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Resize detection strategy that injects objects to elements in order to detect resize events.
	 * Heavily inspired by: http://www.backalleycoder.com/2013/03/18/cross-browser-event-based-element-resize-detection/
	 */

	"use strict";

	var browserDetector = __webpack_require__(25);

	module.exports = function(options) {
	    options             = options || {};
	    var reporter        = options.reporter;
	    var batchProcessor  = options.batchProcessor;
	    var getState        = options.stateHandler.getState;

	    if(!reporter) {
	        throw new Error("Missing required dependency: reporter.");
	    }

	    /**
	     * Adds a resize event listener to the element.
	     * @public
	     * @param {element} element The element that should have the listener added.
	     * @param {function} listener The listener callback to be called for each resize event of the element. The element will be given as a parameter to the listener callback.
	     */
	    function addListener(element, listener) {
	        if(!getObject(element)) {
	            throw new Error("Element is not detectable by this strategy.");
	        }

	        function listenerProxy() {
	            listener(element);
	        }

	        if(browserDetector.isIE(8)) {
	            //IE 8 does not support object, but supports the resize event directly on elements.
	            getState(element).object = {
	                proxy: listenerProxy
	            };
	            element.attachEvent("onresize", listenerProxy);
	        } else {
	            var object = getObject(element);
	            object.contentDocument.defaultView.addEventListener("resize", listenerProxy);
	        }
	    }

	    /**
	     * Makes an element detectable and ready to be listened for resize events. Will call the callback when the element is ready to be listened for resize changes.
	     * @private
	     * @param {object} options Optional options object.
	     * @param {element} element The element to make detectable
	     * @param {function} callback The callback to be called when the element is ready to be listened for resize changes. Will be called with the element as first parameter.
	     */
	    function makeDetectable(options, element, callback) {
	        if (!callback) {
	            callback = element;
	            element = options;
	            options = null;
	        }

	        options = options || {};
	        var debug = options.debug;

	        function injectObject(element, callback) {
	            var OBJECT_STYLE = "display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; padding: 0; margin: 0; opacity: 0; z-index: -1000; pointer-events: none;";

	            //The target element needs to be positioned (everything except static) so the absolute positioned object will be positioned relative to the target element.

	            // Position altering may be performed directly or on object load, depending on if style resolution is possible directly or not.
	            var positionCheckPerformed = false;

	            // The element may not yet be attached to the DOM, and therefore the style object may be empty in some browsers.
	            // Since the style object is a reference, it will be updated as soon as the element is attached to the DOM.
	            var style = window.getComputedStyle(element);
	            var width = element.offsetWidth;
	            var height = element.offsetHeight;

	            getState(element).startSize = {
	                width: width,
	                height: height
	            };

	            function mutateDom() {
	                function alterPositionStyles() {
	                    if(style.position === "static") {
	                        element.style.position = "relative";

	                        var removeRelativeStyles = function(reporter, element, style, property) {
	                            function getNumericalValue(value) {
	                                return value.replace(/[^-\d\.]/g, "");
	                            }

	                            var value = style[property];

	                            if(value !== "auto" && getNumericalValue(value) !== "0") {
	                                reporter.warn("An element that is positioned static has style." + property + "=" + value + " which is ignored due to the static positioning. The element will need to be positioned relative, so the style." + property + " will be set to 0. Element: ", element);
	                                element.style[property] = 0;
	                            }
	                        };

	                        //Check so that there are no accidental styles that will make the element styled differently now that is is relative.
	                        //If there are any, set them to 0 (this should be okay with the user since the style properties did nothing before [since the element was positioned static] anyway).
	                        removeRelativeStyles(reporter, element, style, "top");
	                        removeRelativeStyles(reporter, element, style, "right");
	                        removeRelativeStyles(reporter, element, style, "bottom");
	                        removeRelativeStyles(reporter, element, style, "left");
	                    }
	                }

	                function onObjectLoad() {
	                    // The object has been loaded, which means that the element now is guaranteed to be attached to the DOM.
	                    if (!positionCheckPerformed) {
	                        alterPositionStyles();
	                    }

	                    /*jshint validthis: true */

	                    function getDocument(element, callback) {
	                        //Opera 12 seem to call the object.onload before the actual document has been created.
	                        //So if it is not present, poll it with an timeout until it is present.
	                        //TODO: Could maybe be handled better with object.onreadystatechange or similar.
	                        if(!element.contentDocument) {
	                            setTimeout(function checkForObjectDocument() {
	                                getDocument(element, callback);
	                            }, 100);

	                            return;
	                        }

	                        callback(element.contentDocument);
	                    }

	                    //Mutating the object element here seems to fire another load event.
	                    //Mutating the inner document of the object element is fine though.
	                    var objectElement = this;

	                    //Create the style element to be added to the object.
	                    getDocument(objectElement, function onObjectDocumentReady(objectDocument) {
	                        //Notify that the element is ready to be listened to.
	                        callback(element);
	                    });
	                }

	                // The element may be detached from the DOM, and some browsers does not support style resolving of detached elements.
	                // The alterPositionStyles needs to be delayed until we know the element has been attached to the DOM (which we are sure of when the onObjectLoad has been fired), if style resolution is not possible.
	                if (style.position !== "") {
	                    alterPositionStyles(style);
	                    positionCheckPerformed = true;
	                }

	                //Add an object element as a child to the target element that will be listened to for resize events.
	                var object = document.createElement("object");
	                object.style.cssText = OBJECT_STYLE;
	                object.type = "text/html";
	                object.onload = onObjectLoad;

	                //Safari: This must occur before adding the object to the DOM.
	                //IE: Does not like that this happens before, even if it is also added after.
	                if(!browserDetector.isIE()) {
	                    object.data = "about:blank";
	                }

	                element.appendChild(object);
	                getState(element).object = object;

	                //IE: This must occur after adding the object to the DOM.
	                if(browserDetector.isIE()) {
	                    object.data = "about:blank";
	                }
	            }

	            if(batchProcessor) {
	                batchProcessor.add(mutateDom);
	            } else {
	                mutateDom();
	            }
	        }

	        if(browserDetector.isIE(8)) {
	            //IE 8 does not support objects properly. Luckily they do support the resize event.
	            //So do not inject the object and notify that the element is already ready to be listened to.
	            //The event handler for the resize event is attached in the utils.addListener instead.
	            callback(element);
	        } else {
	            injectObject(element, callback);
	        }
	    }

	    /**
	     * Returns the child object of the target element.
	     * @private
	     * @param {element} element The target element.
	     * @returns The object element of the target.
	     */
	    function getObject(element) {
	        return getState(element).object;
	    }

	    function uninstall(element) {
	        if(browserDetector.isIE(8)) {
	            element.detachEvent("onresize", getState(element).object.proxy);
	        } else {
	            element.removeChild(getObject(element));
	        }
	        delete getState(element).object;
	    }

	    return {
	        makeDetectable: makeDetectable,
	        addListener: addListener,
	        uninstall: uninstall
	    };
	};


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Resize detection strategy that injects divs to elements in order to detect resize events on scroll events.
	 * Heavily inspired by: https://github.com/marcj/css-element-queries/blob/master/src/ResizeSensor.js
	 */

	"use strict";

	var forEach = __webpack_require__(19).forEach;

	module.exports = function(options) {
	    options             = options || {};
	    var reporter        = options.reporter;
	    var batchProcessor  = options.batchProcessor;
	    var getState        = options.stateHandler.getState;
	    var hasState        = options.stateHandler.hasState;
	    var idHandler       = options.idHandler;

	    if (!batchProcessor) {
	        throw new Error("Missing required dependency: batchProcessor");
	    }

	    if (!reporter) {
	        throw new Error("Missing required dependency: reporter.");
	    }

	    //TODO: Could this perhaps be done at installation time?
	    var scrollbarSizes = getScrollbarSizes();

	    // Inject the scrollbar styling that prevents them from appearing sometimes in Chrome.
	    // The injected container needs to have a class, so that it may be styled with CSS (pseudo elements).
	    var styleId = "erd_scroll_detection_scrollbar_style";
	    var detectionContainerClass = "erd_scroll_detection_container";
	    injectScrollStyle(styleId, detectionContainerClass);

	    function getScrollbarSizes() {
	        var width = 500;
	        var height = 500;

	        var child = document.createElement("div");
	        child.style.cssText = "position: absolute; width: " + width*2 + "px; height: " + height*2 + "px; visibility: hidden; margin: 0; padding: 0;";

	        var container = document.createElement("div");
	        container.style.cssText = "position: absolute; width: " + width + "px; height: " + height + "px; overflow: scroll; visibility: none; top: " + -width*3 + "px; left: " + -height*3 + "px; visibility: hidden; margin: 0; padding: 0;";

	        container.appendChild(child);

	        document.body.insertBefore(container, document.body.firstChild);

	        var widthSize = width - container.clientWidth;
	        var heightSize = height - container.clientHeight;

	        document.body.removeChild(container);

	        return {
	            width: widthSize,
	            height: heightSize
	        };
	    }

	    function injectScrollStyle(styleId, containerClass) {
	        function injectStyle(style, method) {
	            method = method || function (element) {
	                document.head.appendChild(element);
	            };

	            var styleElement = document.createElement("style");
	            styleElement.innerHTML = style;
	            styleElement.id = styleId;
	            method(styleElement);
	            return styleElement;
	        }

	        if (!document.getElementById(styleId)) {
	            var containerAnimationClass = containerClass + "_animation";
	            var containerAnimationActiveClass = containerClass + "_animation_active";
	            var style = "/* Created by the element-resize-detector library. */\n";
	            style += "." + containerClass + " > div::-webkit-scrollbar { display: none; }\n\n";
	            style += "." + containerAnimationActiveClass + " { -webkit-animation-duration: 0.1s; animation-duration: 0.1s; -webkit-animation-name: " + containerAnimationClass + "; animation-name: " + containerAnimationClass + "; }\n";
	            style += "@-webkit-keyframes " + containerAnimationClass +  " { 0% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 1; } }\n";
	            style += "@keyframes " + containerAnimationClass +          " { 0% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 1; } }";
	            injectStyle(style);
	        }
	    }

	    function addAnimationClass(element) {
	        element.className += " " + detectionContainerClass + "_animation_active";
	    }

	    function addEvent(el, name, cb) {
	        if (el.addEventListener) {
	            el.addEventListener(name, cb);
	        } else if(el.attachEvent) {
	            el.attachEvent("on" + name, cb);
	        } else {
	            return reporter.error("[scroll] Don't know how to add event listeners.");
	        }
	    }

	    function removeEvent(el, name, cb) {
	        if (el.removeEventListener) {
	            el.removeEventListener(name, cb);
	        } else if(el.detachEvent) {
	            el.detachEvent("on" + name, cb);
	        } else {
	            return reporter.error("[scroll] Don't know how to remove event listeners.");
	        }
	    }

	    function getExpandElement(element) {
	        return getState(element).container.childNodes[0].childNodes[0].childNodes[0];
	    }

	    function getShrinkElement(element) {
	        return getState(element).container.childNodes[0].childNodes[0].childNodes[1];
	    }

	    /**
	     * Adds a resize event listener to the element.
	     * @public
	     * @param {element} element The element that should have the listener added.
	     * @param {function} listener The listener callback to be called for each resize event of the element. The element will be given as a parameter to the listener callback.
	     */
	    function addListener(element, listener) {
	        var listeners = getState(element).listeners;

	        if (!listeners.push) {
	            throw new Error("Cannot add listener to an element that is not detectable.");
	        }

	        getState(element).listeners.push(listener);
	    }

	    /**
	     * Makes an element detectable and ready to be listened for resize events. Will call the callback when the element is ready to be listened for resize changes.
	     * @private
	     * @param {object} options Optional options object.
	     * @param {element} element The element to make detectable
	     * @param {function} callback The callback to be called when the element is ready to be listened for resize changes. Will be called with the element as first parameter.
	     */
	    function makeDetectable(options, element, callback) {
	        if (!callback) {
	            callback = element;
	            element = options;
	            options = null;
	        }

	        options = options || {};

	        function debug() {
	            if (options.debug) {
	                var args = Array.prototype.slice.call(arguments);
	                args.unshift(idHandler.get(element), "Scroll: ");
	                if (reporter.log.apply) {
	                    reporter.log.apply(null, args);
	                } else {
	                    for (var i = 0; i < args.length; i++) {
	                        reporter.log(args[i]);
	                    }
	                }
	            }
	        }

	        function isDetached(element) {
	            function isInDocument(element) {
	                return element === element.ownerDocument.body || element.ownerDocument.body.contains(element);
	            }
	            return !isInDocument(element);
	        }

	        function isUnrendered(element) {
	            // Check the absolute positioned container since the top level container is display: inline.
	            var container = getState(element).container.childNodes[0];
	            return getComputedStyle(container).width.indexOf("px") === -1; //Can only compute pixel value when rendered.
	        }

	        function getStyle() {
	            // Some browsers only force layouts when actually reading the style properties of the style object, so make sure that they are all read here,
	            // so that the user of the function can be sure that it will perform the layout here, instead of later (important for batching).
	            var elementStyle            = getComputedStyle(element);
	            var style                   = {};
	            style.position              = elementStyle.position;
	            style.width                 = element.offsetWidth;
	            style.height                = element.offsetHeight;
	            style.top                   = elementStyle.top;
	            style.right                 = elementStyle.right;
	            style.bottom                = elementStyle.bottom;
	            style.left                  = elementStyle.left;
	            style.widthCSS              = elementStyle.width;
	            style.heightCSS             = elementStyle.height;
	            return style;
	        }

	        function storeStartSize() {
	            var style = getStyle();
	            getState(element).startSize = {
	                width: style.width,
	                height: style.height
	            };
	            debug("Element start size", getState(element).startSize);
	        }

	        function initListeners() {
	            getState(element).listeners = [];
	        }

	        function storeStyle() {
	            debug("storeStyle invoked.");
	            if (!getState(element)) {
	                debug("Aborting because element has been uninstalled");
	                return;
	            }

	            var style = getStyle();
	            getState(element).style = style;
	        }

	        function storeCurrentSize(element, width, height) {
	            getState(element).lastWidth = width;
	            getState(element).lastHeight  = height;
	        }

	        function getExpandChildElement(element) {
	            return getExpandElement(element).childNodes[0];
	        }

	        function getWidthOffset() {
	            return 2 * scrollbarSizes.width + 1;
	        }

	        function getHeightOffset() {
	            return 2 * scrollbarSizes.height + 1;
	        }

	        function getExpandWidth(width) {
	            return width + 10 + getWidthOffset();
	        }

	        function getExpandHeight(height) {
	            return height + 10 + getHeightOffset();
	        }

	        function getShrinkWidth(width) {
	            return width * 2 + getWidthOffset();
	        }

	        function getShrinkHeight(height) {
	            return height * 2 + getHeightOffset();
	        }

	        function positionScrollbars(element, width, height) {
	            var expand          = getExpandElement(element);
	            var shrink          = getShrinkElement(element);
	            var expandWidth     = getExpandWidth(width);
	            var expandHeight    = getExpandHeight(height);
	            var shrinkWidth     = getShrinkWidth(width);
	            var shrinkHeight    = getShrinkHeight(height);
	            expand.scrollLeft   = expandWidth;
	            expand.scrollTop    = expandHeight;
	            shrink.scrollLeft   = shrinkWidth;
	            shrink.scrollTop    = shrinkHeight;
	        }

	        function injectContainerElement() {
	            var container = getState(element).container;

	            if (!container) {
	                container                   = document.createElement("div");
	                container.className         = detectionContainerClass;
	                container.style.cssText     = "visibility: hidden; display: inline; width: 0px; height: 0px; z-index: -1; overflow: hidden; margin: 0; padding: 0;";
	                getState(element).container = container;
	                addAnimationClass(container);
	                element.appendChild(container);

	                var onAnimationStart = function () {
	                    getState(element).onRendered && getState(element).onRendered();
	                };

	                addEvent(container, "animationstart", onAnimationStart);

	                // Store the event handler here so that they may be removed when uninstall is called.
	                // See uninstall function for an explanation why it is needed.
	                getState(element).onAnimationStart = onAnimationStart;
	            }

	            return container;
	        }

	        function injectScrollElements() {
	            function alterPositionStyles() {
	                var style = getState(element).style;

	                if(style.position === "static") {
	                    element.style.position = "relative";

	                    var removeRelativeStyles = function(reporter, element, style, property) {
	                        function getNumericalValue(value) {
	                            return value.replace(/[^-\d\.]/g, "");
	                        }

	                        var value = style[property];

	                        if(value !== "auto" && getNumericalValue(value) !== "0") {
	                            reporter.warn("An element that is positioned static has style." + property + "=" + value + " which is ignored due to the static positioning. The element will need to be positioned relative, so the style." + property + " will be set to 0. Element: ", element);
	                            element.style[property] = 0;
	                        }
	                    };

	                    //Check so that there are no accidental styles that will make the element styled differently now that is is relative.
	                    //If there are any, set them to 0 (this should be okay with the user since the style properties did nothing before [since the element was positioned static] anyway).
	                    removeRelativeStyles(reporter, element, style, "top");
	                    removeRelativeStyles(reporter, element, style, "right");
	                    removeRelativeStyles(reporter, element, style, "bottom");
	                    removeRelativeStyles(reporter, element, style, "left");
	                }
	            }

	            function getLeftTopBottomRightCssText(left, top, bottom, right) {
	                left = (!left ? "0" : (left + "px"));
	                top = (!top ? "0" : (top + "px"));
	                bottom = (!bottom ? "0" : (bottom + "px"));
	                right = (!right ? "0" : (right + "px"));

	                return "left: " + left + "; top: " + top + "; right: " + right + "; bottom: " + bottom + ";";
	            }

	            debug("Injecting elements");

	            if (!getState(element)) {
	                debug("Aborting because element has been uninstalled");
	                return;
	            }

	            alterPositionStyles();

	            var rootContainer = getState(element).container;

	            if (!rootContainer) {
	                rootContainer = injectContainerElement();
	            }

	            // Due to this WebKit bug https://bugs.webkit.org/show_bug.cgi?id=80808 (currently fixed in Blink, but still present in WebKit browsers such as Safari),
	            // we need to inject two containers, one that is width/height 100% and another that is left/top -1px so that the final container always is 1x1 pixels bigger than
	            // the targeted element.
	            // When the bug is resolved, "containerContainer" may be removed.

	            // The outer container can occasionally be less wide than the targeted when inside inline elements element in WebKit (see https://bugs.webkit.org/show_bug.cgi?id=152980).
	            // This should be no problem since the inner container either way makes sure the injected scroll elements are at least 1x1 px.

	            var scrollbarWidth          = scrollbarSizes.width;
	            var scrollbarHeight         = scrollbarSizes.height;
	            var containerContainerStyle = "position: absolute; overflow: hidden; z-index: -1; visibility: hidden; width: 100%; height: 100%; left: 0px; top: 0px;";
	            var containerStyle          = "position: absolute; overflow: hidden; z-index: -1; visibility: hidden; " + getLeftTopBottomRightCssText(-(1 + scrollbarWidth), -(1 + scrollbarHeight), -scrollbarHeight, -scrollbarWidth);
	            var expandStyle             = "position: absolute; overflow: scroll; z-index: -1; visibility: hidden; width: 100%; height: 100%;";
	            var shrinkStyle             = "position: absolute; overflow: scroll; z-index: -1; visibility: hidden; width: 100%; height: 100%;";
	            var expandChildStyle        = "position: absolute; left: 0; top: 0;";
	            var shrinkChildStyle        = "position: absolute; width: 200%; height: 200%;";

	            var containerContainer      = document.createElement("div");
	            var container               = document.createElement("div");
	            var expand                  = document.createElement("div");
	            var expandChild             = document.createElement("div");
	            var shrink                  = document.createElement("div");
	            var shrinkChild             = document.createElement("div");

	            // Some browsers choke on the resize system being rtl, so force it to ltr. https://github.com/wnr/element-resize-detector/issues/56
	            // However, dir should not be set on the top level container as it alters the dimensions of the target element in some browsers.
	            containerContainer.dir              = "ltr";

	            containerContainer.style.cssText    = containerContainerStyle;
	            containerContainer.className        = detectionContainerClass;
	            container.className                 = detectionContainerClass;
	            container.style.cssText             = containerStyle;
	            expand.style.cssText                = expandStyle;
	            expandChild.style.cssText           = expandChildStyle;
	            shrink.style.cssText                = shrinkStyle;
	            shrinkChild.style.cssText           = shrinkChildStyle;

	            expand.appendChild(expandChild);
	            shrink.appendChild(shrinkChild);
	            container.appendChild(expand);
	            container.appendChild(shrink);
	            containerContainer.appendChild(container);
	            rootContainer.appendChild(containerContainer);

	            function onExpandScroll() {
	                getState(element).onExpand && getState(element).onExpand();
	            }

	            function onShrinkScroll() {
	                getState(element).onShrink && getState(element).onShrink();
	            }

	            addEvent(expand, "scroll", onExpandScroll);
	            addEvent(shrink, "scroll", onShrinkScroll);

	            // Store the event handlers here so that they may be removed when uninstall is called.
	            // See uninstall function for an explanation why it is needed.
	            getState(element).onExpandScroll = onExpandScroll;
	            getState(element).onShrinkScroll = onShrinkScroll;
	        }

	        function registerListenersAndPositionElements() {
	            function updateChildSizes(element, width, height) {
	                var expandChild             = getExpandChildElement(element);
	                var expandWidth             = getExpandWidth(width);
	                var expandHeight            = getExpandHeight(height);
	                expandChild.style.width     = expandWidth + "px";
	                expandChild.style.height    = expandHeight + "px";
	            }

	            function updateDetectorElements(done) {
	                var width           = element.offsetWidth;
	                var height          = element.offsetHeight;

	                debug("Storing current size", width, height);

	                // Store the size of the element sync here, so that multiple scroll events may be ignored in the event listeners.
	                // Otherwise the if-check in handleScroll is useless.
	                storeCurrentSize(element, width, height);

	                // Since we delay the processing of the batch, there is a risk that uninstall has been called before the batch gets to execute.
	                // Since there is no way to cancel the fn executions, we need to add an uninstall guard to all fns of the batch.

	                batchProcessor.add(0, function performUpdateChildSizes() {
	                    if (!getState(element)) {
	                        debug("Aborting because element has been uninstalled");
	                        return;
	                    }

	                    if (options.debug) {
	                        var w = element.offsetWidth;
	                        var h = element.offsetHeight;

	                        if (w !== width || h !== height) {
	                            reporter.warn(idHandler.get(element), "Scroll: Size changed before updating detector elements.");
	                        }
	                    }

	                    updateChildSizes(element, width, height);
	                });

	                batchProcessor.add(1, function updateScrollbars() {
	                    if (!getState(element)) {
	                        debug("Aborting because element has been uninstalled");
	                        return;
	                    }

	                    positionScrollbars(element, width, height);
	                });

	                if (done) {
	                    batchProcessor.add(2, function () {
	                        if (!getState(element)) {
	                            debug("Aborting because element has been uninstalled");
	                            return;
	                        }

	                        done();
	                    });
	                }
	            }

	            function areElementsInjected() {
	                return !!getState(element).container;
	            }

	            function notifyListenersIfNeeded() {
	                function isFirstNotify() {
	                    return getState(element).lastNotifiedWidth === undefined;
	                }

	                debug("notifyListenersIfNeeded invoked");

	                var state = getState(element);

	                // Don't notify the if the current size is the start size, and this is the first notification.
	                if (isFirstNotify() && state.lastWidth === state.startSize.width && state.lastHeight === state.startSize.height) {
	                    return debug("Not notifying: Size is the same as the start size, and there has been no notification yet.");
	                }

	                // Don't notify if the size already has been notified.
	                if (state.lastWidth === state.lastNotifiedWidth && state.lastHeight === state.lastNotifiedHeight) {
	                    return debug("Not notifying: Size already notified");
	                }


	                debug("Current size not notified, notifying...");
	                state.lastNotifiedWidth = state.lastWidth;
	                state.lastNotifiedHeight = state.lastHeight;
	                forEach(getState(element).listeners, function (listener) {
	                    listener(element);
	                });
	            }

	            function handleRender() {
	                debug("startanimation triggered.");

	                if (isUnrendered(element)) {
	                    debug("Ignoring since element is still unrendered...");
	                    return;
	                }

	                debug("Element rendered.");
	                var expand = getExpandElement(element);
	                var shrink = getShrinkElement(element);
	                if (expand.scrollLeft === 0 || expand.scrollTop === 0 || shrink.scrollLeft === 0 || shrink.scrollTop === 0) {
	                    debug("Scrollbars out of sync. Updating detector elements...");
	                    updateDetectorElements(notifyListenersIfNeeded);
	                }
	            }

	            function handleScroll() {
	                debug("Scroll detected.");

	                if (isUnrendered(element)) {
	                    // Element is still unrendered. Skip this scroll event.
	                    debug("Scroll event fired while unrendered. Ignoring...");
	                    return;
	                }

	                var width = element.offsetWidth;
	                var height = element.offsetHeight;

	                if (width !== element.lastWidth || height !== element.lastHeight) {
	                    debug("Element size changed.");
	                    updateDetectorElements(notifyListenersIfNeeded);
	                } else {
	                    debug("Element size has not changed (" + width + "x" + height + ").");
	                }
	            }

	            debug("registerListenersAndPositionElements invoked.");

	            if (!getState(element)) {
	                debug("Aborting because element has been uninstalled");
	                return;
	            }

	            getState(element).onRendered = handleRender;
	            getState(element).onExpand = handleScroll;
	            getState(element).onShrink = handleScroll;

	            var style = getState(element).style;
	            updateChildSizes(element, style.width, style.height);
	        }

	        function finalizeDomMutation() {
	            debug("finalizeDomMutation invoked.");

	            if (!getState(element)) {
	                debug("Aborting because element has been uninstalled");
	                return;
	            }

	            var style = getState(element).style;
	            storeCurrentSize(element, style.width, style.height);
	            positionScrollbars(element, style.width, style.height);
	        }

	        function ready() {
	            callback(element);
	        }

	        function install() {
	            debug("Installing...");
	            initListeners();
	            storeStartSize();

	            batchProcessor.add(0, storeStyle);
	            batchProcessor.add(1, injectScrollElements);
	            batchProcessor.add(2, registerListenersAndPositionElements);
	            batchProcessor.add(3, finalizeDomMutation);
	            batchProcessor.add(4, ready);
	        }

	        debug("Making detectable...");

	        if (isDetached(element)) {
	            debug("Element is detached");

	            injectContainerElement();

	            debug("Waiting until element is attached...");

	            getState(element).onRendered = function () {
	                debug("Element is now attached");
	                install();
	            };
	        } else {
	            install();
	        }
	    }

	    function uninstall(element) {
	        var state = getState(element);

	        if (!state) {
	            // Uninstall has been called on a non-erd element.
	            return;
	        }

	        // Uninstall may have been called in the following scenarios:
	        // (1) Right between the sync code and async batch (here state.busy = true, but nothing have been registered or injected).
	        // (2) In the ready callback of the last level of the batch by another element (here, state.busy = true, but all the stuff has been injected).
	        // (3) After the installation process (here, state.busy = false and all the stuff has been injected).
	        // So to be on the safe side, let's check for each thing before removing.

	        // We need to remove the event listeners, because otherwise the event might fire on an uninstall element which results in an error when trying to get the state of the element.
	        state.onExpandScroll && removeEvent(getExpandElement(element), "scroll", state.onExpandScroll);
	        state.onShrinkScroll && removeEvent(getShrinkElement(element), "scroll", state.onShrinkScroll);
	        state.onAnimationStart && removeEvent(state.container, "animationstart", state.onAnimationStart);

	        state.container && element.removeChild(state.container);
	    }

	    return {
	        makeDetectable: makeDetectable,
	        addListener: addListener,
	        uninstall: uninstall
	    };
	};


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.asyncLoad = asyncLoad;

	var _each = __webpack_require__(32);

	function asyncLoad() {
	  var loaded = window['squatch'] || null;
	  var cached = window['_squatch'] || null;

	  if (loaded && cached) {
	    var _ready = cached.ready;

	    (0, _each.each)(_ready, function (cb, i) {
	      return setTimeout(function () {
	        cb();
	      }, 0);
	    });

	    window["_" + 'squatch'] = undefined;
	    try {
	      delete window['_' + 'squatch'];
	    } catch (e) {}
	  }
	}

/***/ },
/* 32 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.each = each;
	function each(o, cb, s) {
	  var n;
	  if (!o) {
	    return 0;
	  }
	  s = !s ? o : s;
	  if (o instanceof Array) {
	    // Indexed arrays, needed for Safari
	    for (n = 0; n < o.length; n++) {
	      if (cb.call(s, o[n], n, o) === false) {
	        return 0;
	      }
	    }
	  } else {
	    // Hashtables
	    for (n in o) {
	      if (o.hasOwnProperty(n)) {
	        if (cb.call(s, o[n], n, o) === false) {
	          return 0;
	        }
	      }
	    }
	  }
	  return 1;
	};

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(global) {"use strict"
	// Module export pattern from
	// https://github.com/umdjs/umd/blob/master/returnExports.js
	;(function (root, factory) {
	    if (true) {
	        // AMD. Register as an anonymous module.
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports === 'object') {
	        // Node. Does not work with strict CommonJS, but
	        // only CommonJS-like environments that support module.exports,
	        // like Node.
	        module.exports = factory();
	    } else {
	        // Browser globals (root is window)
	        root.store = factory();
	  }
	}(this, function () {
		
		// Store.js
		var store = {},
			win = (typeof window != 'undefined' ? window : global),
			doc = win.document,
			localStorageName = 'localStorage',
			scriptTag = 'script',
			storage

		store.disabled = false
		store.version = '1.3.20'
		store.set = function(key, value) {}
		store.get = function(key, defaultVal) {}
		store.has = function(key) { return store.get(key) !== undefined }
		store.remove = function(key) {}
		store.clear = function() {}
		store.transact = function(key, defaultVal, transactionFn) {
			if (transactionFn == null) {
				transactionFn = defaultVal
				defaultVal = null
			}
			if (defaultVal == null) {
				defaultVal = {}
			}
			var val = store.get(key, defaultVal)
			transactionFn(val)
			store.set(key, val)
		}
		store.getAll = function() {}
		store.forEach = function() {}

		store.serialize = function(value) {
			return JSON.stringify(value)
		}
		store.deserialize = function(value) {
			if (typeof value != 'string') { return undefined }
			try { return JSON.parse(value) }
			catch(e) { return value || undefined }
		}

		// Functions to encapsulate questionable FireFox 3.6.13 behavior
		// when about.config::dom.storage.enabled === false
		// See https://github.com/marcuswestin/store.js/issues#issue/13
		function isLocalStorageNameSupported() {
			try { return (localStorageName in win && win[localStorageName]) }
			catch(err) { return false }
		}

		if (isLocalStorageNameSupported()) {
			storage = win[localStorageName]
			store.set = function(key, val) {
				if (val === undefined) { return store.remove(key) }
				storage.setItem(key, store.serialize(val))
				return val
			}
			store.get = function(key, defaultVal) {
				var val = store.deserialize(storage.getItem(key))
				return (val === undefined ? defaultVal : val)
			}
			store.remove = function(key) { storage.removeItem(key) }
			store.clear = function() { storage.clear() }
			store.getAll = function() {
				var ret = {}
				store.forEach(function(key, val) {
					ret[key] = val
				})
				return ret
			}
			store.forEach = function(callback) {
				for (var i=0; i<storage.length; i++) {
					var key = storage.key(i)
					callback(key, store.get(key))
				}
			}
		} else if (doc && doc.documentElement.addBehavior) {
			var storageOwner,
				storageContainer
			// Since #userData storage applies only to specific paths, we need to
			// somehow link our data to a specific path.  We choose /favicon.ico
			// as a pretty safe option, since all browsers already make a request to
			// this URL anyway and being a 404 will not hurt us here.  We wrap an
			// iframe pointing to the favicon in an ActiveXObject(htmlfile) object
			// (see: http://msdn.microsoft.com/en-us/library/aa752574(v=VS.85).aspx)
			// since the iframe access rules appear to allow direct access and
			// manipulation of the document element, even for a 404 page.  This
			// document can be used instead of the current document (which would
			// have been limited to the current path) to perform #userData storage.
			try {
				storageContainer = new ActiveXObject('htmlfile')
				storageContainer.open()
				storageContainer.write('<'+scriptTag+'>document.w=window</'+scriptTag+'><iframe src="/favicon.ico"></iframe>')
				storageContainer.close()
				storageOwner = storageContainer.w.frames[0].document
				storage = storageOwner.createElement('div')
			} catch(e) {
				// somehow ActiveXObject instantiation failed (perhaps some special
				// security settings or otherwse), fall back to per-path storage
				storage = doc.createElement('div')
				storageOwner = doc.body
			}
			var withIEStorage = function(storeFunction) {
				return function() {
					var args = Array.prototype.slice.call(arguments, 0)
					args.unshift(storage)
					// See http://msdn.microsoft.com/en-us/library/ms531081(v=VS.85).aspx
					// and http://msdn.microsoft.com/en-us/library/ms531424(v=VS.85).aspx
					storageOwner.appendChild(storage)
					storage.addBehavior('#default#userData')
					storage.load(localStorageName)
					var result = storeFunction.apply(store, args)
					storageOwner.removeChild(storage)
					return result
				}
			}

			// In IE7, keys cannot start with a digit or contain certain chars.
			// See https://github.com/marcuswestin/store.js/issues/40
			// See https://github.com/marcuswestin/store.js/issues/83
			var forbiddenCharsRegex = new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]", "g")
			var ieKeyFix = function(key) {
				return key.replace(/^d/, '___$&').replace(forbiddenCharsRegex, '___')
			}
			store.set = withIEStorage(function(storage, key, val) {
				key = ieKeyFix(key)
				if (val === undefined) { return store.remove(key) }
				storage.setAttribute(key, store.serialize(val))
				storage.save(localStorageName)
				return val
			})
			store.get = withIEStorage(function(storage, key, defaultVal) {
				key = ieKeyFix(key)
				var val = store.deserialize(storage.getAttribute(key))
				return (val === undefined ? defaultVal : val)
			})
			store.remove = withIEStorage(function(storage, key) {
				key = ieKeyFix(key)
				storage.removeAttribute(key)
				storage.save(localStorageName)
			})
			store.clear = withIEStorage(function(storage) {
				var attributes = storage.XMLDocument.documentElement.attributes
				storage.load(localStorageName)
				for (var i=attributes.length-1; i>=0; i--) {
					storage.removeAttribute(attributes[i].name)
				}
				storage.save(localStorageName)
			})
			store.getAll = function(storage) {
				var ret = {}
				store.forEach(function(key, val) {
					ret[key] = val
				})
				return ret
			}
			store.forEach = withIEStorage(function(storage, callback) {
				var attributes = storage.XMLDocument.documentElement.attributes
				for (var i=0, attr; attr=attributes[i]; ++i) {
					callback(attr.name, store.deserialize(storage.getAttribute(attr.name)))
				}
			})
		}

		try {
			var testKey = '__storejs__'
			store.set(testKey, testKey)
			if (store.get(testKey) != testKey) { store.disabled = true }
			store.remove(testKey)
		} catch(e) {
			store.disabled = true
		}
		store.enabled = !store.disabled
		
		return store
	}));

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * This is the web browser implementation of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */

	exports = module.exports = __webpack_require__(35);
	exports.log = log;
	exports.formatArgs = formatArgs;
	exports.save = save;
	exports.load = load;
	exports.useColors = useColors;
	exports.storage = 'undefined' != typeof chrome
	               && 'undefined' != typeof chrome.storage
	                  ? chrome.storage.local
	                  : localstorage();

	/**
	 * Colors.
	 */

	exports.colors = [
	  'lightseagreen',
	  'forestgreen',
	  'goldenrod',
	  'dodgerblue',
	  'darkorchid',
	  'crimson'
	];

	/**
	 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
	 * and the Firebug extension (any Firefox version) are known
	 * to support "%c" CSS customizations.
	 *
	 * TODO: add a `localStorage` variable to explicitly enable/disable colors
	 */

	function useColors() {
	  // is webkit? http://stackoverflow.com/a/16459606/376773
	  return ('WebkitAppearance' in document.documentElement.style) ||
	    // is firebug? http://stackoverflow.com/a/398120/376773
	    (window.console && (console.firebug || (console.exception && console.table))) ||
	    // is firefox >= v31?
	    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
	    (navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31);
	}

	/**
	 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
	 */

	exports.formatters.j = function(v) {
	  return JSON.stringify(v);
	};


	/**
	 * Colorize log arguments if enabled.
	 *
	 * @api public
	 */

	function formatArgs() {
	  var args = arguments;
	  var useColors = this.useColors;

	  args[0] = (useColors ? '%c' : '')
	    + this.namespace
	    + (useColors ? ' %c' : ' ')
	    + args[0]
	    + (useColors ? '%c ' : ' ')
	    + '+' + exports.humanize(this.diff);

	  if (!useColors) return args;

	  var c = 'color: ' + this.color;
	  args = [args[0], c, 'color: inherit'].concat(Array.prototype.slice.call(args, 1));

	  // the final "%c" is somewhat tricky, because there could be other
	  // arguments passed either before or after the %c, so we need to
	  // figure out the correct index to insert the CSS into
	  var index = 0;
	  var lastC = 0;
	  args[0].replace(/%[a-z%]/g, function(match) {
	    if ('%%' === match) return;
	    index++;
	    if ('%c' === match) {
	      // we only are interested in the *last* %c
	      // (the user may have provided their own)
	      lastC = index;
	    }
	  });

	  args.splice(lastC, 0, c);
	  return args;
	}

	/**
	 * Invokes `console.log()` when available.
	 * No-op when `console.log` is not a "function".
	 *
	 * @api public
	 */

	function log() {
	  // this hackery is required for IE8/9, where
	  // the `console.log` function doesn't have 'apply'
	  return 'object' === typeof console
	    && console.log
	    && Function.prototype.apply.call(console.log, console, arguments);
	}

	/**
	 * Save `namespaces`.
	 *
	 * @param {String} namespaces
	 * @api private
	 */

	function save(namespaces) {
	  try {
	    if (null == namespaces) {
	      exports.storage.removeItem('debug');
	    } else {
	      exports.storage.debug = namespaces;
	    }
	  } catch(e) {}
	}

	/**
	 * Load `namespaces`.
	 *
	 * @return {String} returns the previously persisted debug modes
	 * @api private
	 */

	function load() {
	  var r;
	  try {
	    r = exports.storage.debug;
	  } catch(e) {}
	  return r;
	}

	/**
	 * Enable namespaces listed in `localStorage.debug` initially.
	 */

	exports.enable(load());

	/**
	 * Localstorage attempts to return the localstorage.
	 *
	 * This is necessary because safari throws
	 * when a user disables cookies/localstorage
	 * and you attempt to access it.
	 *
	 * @return {LocalStorage}
	 * @api private
	 */

	function localstorage(){
	  try {
	    return window.localStorage;
	  } catch (e) {}
	}


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * This is the common logic for both the Node.js and web browser
	 * implementations of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */

	exports = module.exports = debug;
	exports.coerce = coerce;
	exports.disable = disable;
	exports.enable = enable;
	exports.enabled = enabled;
	exports.humanize = __webpack_require__(36);

	/**
	 * The currently active debug mode names, and names to skip.
	 */

	exports.names = [];
	exports.skips = [];

	/**
	 * Map of special "%n" handling functions, for the debug "format" argument.
	 *
	 * Valid key names are a single, lowercased letter, i.e. "n".
	 */

	exports.formatters = {};

	/**
	 * Previously assigned color.
	 */

	var prevColor = 0;

	/**
	 * Previous log timestamp.
	 */

	var prevTime;

	/**
	 * Select a color.
	 *
	 * @return {Number}
	 * @api private
	 */

	function selectColor() {
	  return exports.colors[prevColor++ % exports.colors.length];
	}

	/**
	 * Create a debugger with the given `namespace`.
	 *
	 * @param {String} namespace
	 * @return {Function}
	 * @api public
	 */

	function debug(namespace) {

	  // define the `disabled` version
	  function disabled() {
	  }
	  disabled.enabled = false;

	  // define the `enabled` version
	  function enabled() {

	    var self = enabled;

	    // set `diff` timestamp
	    var curr = +new Date();
	    var ms = curr - (prevTime || curr);
	    self.diff = ms;
	    self.prev = prevTime;
	    self.curr = curr;
	    prevTime = curr;

	    // add the `color` if not set
	    if (null == self.useColors) self.useColors = exports.useColors();
	    if (null == self.color && self.useColors) self.color = selectColor();

	    var args = Array.prototype.slice.call(arguments);

	    args[0] = exports.coerce(args[0]);

	    if ('string' !== typeof args[0]) {
	      // anything else let's inspect with %o
	      args = ['%o'].concat(args);
	    }

	    // apply any `formatters` transformations
	    var index = 0;
	    args[0] = args[0].replace(/%([a-z%])/g, function(match, format) {
	      // if we encounter an escaped % then don't increase the array index
	      if (match === '%%') return match;
	      index++;
	      var formatter = exports.formatters[format];
	      if ('function' === typeof formatter) {
	        var val = args[index];
	        match = formatter.call(self, val);

	        // now we need to remove `args[index]` since it's inlined in the `format`
	        args.splice(index, 1);
	        index--;
	      }
	      return match;
	    });

	    if ('function' === typeof exports.formatArgs) {
	      args = exports.formatArgs.apply(self, args);
	    }
	    var logFn = enabled.log || exports.log || console.log.bind(console);
	    logFn.apply(self, args);
	  }
	  enabled.enabled = true;

	  var fn = exports.enabled(namespace) ? enabled : disabled;

	  fn.namespace = namespace;

	  return fn;
	}

	/**
	 * Enables a debug mode by namespaces. This can include modes
	 * separated by a colon and wildcards.
	 *
	 * @param {String} namespaces
	 * @api public
	 */

	function enable(namespaces) {
	  exports.save(namespaces);

	  var split = (namespaces || '').split(/[\s,]+/);
	  var len = split.length;

	  for (var i = 0; i < len; i++) {
	    if (!split[i]) continue; // ignore empty strings
	    namespaces = split[i].replace(/\*/g, '.*?');
	    if (namespaces[0] === '-') {
	      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
	    } else {
	      exports.names.push(new RegExp('^' + namespaces + '$'));
	    }
	  }
	}

	/**
	 * Disable debug output.
	 *
	 * @api public
	 */

	function disable() {
	  exports.enable('');
	}

	/**
	 * Returns true if the given mode name is enabled, false otherwise.
	 *
	 * @param {String} name
	 * @return {Boolean}
	 * @api public
	 */

	function enabled(name) {
	  var i, len;
	  for (i = 0, len = exports.skips.length; i < len; i++) {
	    if (exports.skips[i].test(name)) {
	      return false;
	    }
	  }
	  for (i = 0, len = exports.names.length; i < len; i++) {
	    if (exports.names[i].test(name)) {
	      return true;
	    }
	  }
	  return false;
	}

	/**
	 * Coerce `val`.
	 *
	 * @param {Mixed} val
	 * @return {Mixed}
	 * @api private
	 */

	function coerce(val) {
	  if (val instanceof Error) return val.stack || val.message;
	  return val;
	}


/***/ },
/* 36 */
/***/ function(module, exports) {

	/**
	 * Helpers.
	 */

	var s = 1000;
	var m = s * 60;
	var h = m * 60;
	var d = h * 24;
	var y = d * 365.25;

	/**
	 * Parse or format the given `val`.
	 *
	 * Options:
	 *
	 *  - `long` verbose formatting [false]
	 *
	 * @param {String|Number} val
	 * @param {Object} options
	 * @return {String|Number}
	 * @api public
	 */

	module.exports = function(val, options){
	  options = options || {};
	  if ('string' == typeof val) return parse(val);
	  return options.long
	    ? long(val)
	    : short(val);
	};

	/**
	 * Parse the given `str` and return milliseconds.
	 *
	 * @param {String} str
	 * @return {Number}
	 * @api private
	 */

	function parse(str) {
	  str = '' + str;
	  if (str.length > 10000) return;
	  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
	  if (!match) return;
	  var n = parseFloat(match[1]);
	  var type = (match[2] || 'ms').toLowerCase();
	  switch (type) {
	    case 'years':
	    case 'year':
	    case 'yrs':
	    case 'yr':
	    case 'y':
	      return n * y;
	    case 'days':
	    case 'day':
	    case 'd':
	      return n * d;
	    case 'hours':
	    case 'hour':
	    case 'hrs':
	    case 'hr':
	    case 'h':
	      return n * h;
	    case 'minutes':
	    case 'minute':
	    case 'mins':
	    case 'min':
	    case 'm':
	      return n * m;
	    case 'seconds':
	    case 'second':
	    case 'secs':
	    case 'sec':
	    case 's':
	      return n * s;
	    case 'milliseconds':
	    case 'millisecond':
	    case 'msecs':
	    case 'msec':
	    case 'ms':
	      return n;
	  }
	}

	/**
	 * Short format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */

	function short(ms) {
	  if (ms >= d) return Math.round(ms / d) + 'd';
	  if (ms >= h) return Math.round(ms / h) + 'h';
	  if (ms >= m) return Math.round(ms / m) + 'm';
	  if (ms >= s) return Math.round(ms / s) + 's';
	  return ms + 'ms';
	}

	/**
	 * Long format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */

	function long(ms) {
	  return plural(ms, d, 'day')
	    || plural(ms, h, 'hour')
	    || plural(ms, m, 'minute')
	    || plural(ms, s, 'second')
	    || ms + ' ms';
	}

	/**
	 * Pluralization helper.
	 */

	function plural(ms, n, name) {
	  if (ms < n) return;
	  if (ms < n * 1.5) return Math.floor(ms / n) + ' ' + name;
	  return Math.ceil(ms / n) + ' ' + name + 's';
	}


/***/ }
/******/ ])
});
;