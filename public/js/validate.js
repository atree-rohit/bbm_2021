<<<<<<< HEAD
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/axios/index.js":
/*!*************************************!*\
  !*** ./node_modules/axios/index.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(/*! ./lib/axios */ "./node_modules/axios/lib/axios.js");

/***/ }),

/***/ "./node_modules/axios/lib/adapters/xhr.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/adapters/xhr.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var settle = __webpack_require__(/*! ./../core/settle */ "./node_modules/axios/lib/core/settle.js");
var cookies = __webpack_require__(/*! ./../helpers/cookies */ "./node_modules/axios/lib/helpers/cookies.js");
var buildURL = __webpack_require__(/*! ./../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var buildFullPath = __webpack_require__(/*! ../core/buildFullPath */ "./node_modules/axios/lib/core/buildFullPath.js");
var parseHeaders = __webpack_require__(/*! ./../helpers/parseHeaders */ "./node_modules/axios/lib/helpers/parseHeaders.js");
var isURLSameOrigin = __webpack_require__(/*! ./../helpers/isURLSameOrigin */ "./node_modules/axios/lib/helpers/isURLSameOrigin.js");
var createError = __webpack_require__(/*! ../core/createError */ "./node_modules/axios/lib/core/createError.js");

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request.onreadystatechange = function handleLoad() {
      if (!request || request.readyState !== 4) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(timeoutErrorMessage, config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (!requestData) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/axios.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/axios.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");
var Axios = __webpack_require__(/*! ./core/Axios */ "./node_modules/axios/lib/core/Axios.js");
var mergeConfig = __webpack_require__(/*! ./core/mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");
var defaults = __webpack_require__(/*! ./defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(/*! ./cancel/Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");
axios.CancelToken = __webpack_require__(/*! ./cancel/CancelToken */ "./node_modules/axios/lib/cancel/CancelToken.js");
axios.isCancel = __webpack_require__(/*! ./cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(/*! ./helpers/spread */ "./node_modules/axios/lib/helpers/spread.js");

// Expose isAxiosError
axios.isAxiosError = __webpack_require__(/*! ./helpers/isAxiosError */ "./node_modules/axios/lib/helpers/isAxiosError.js");

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/Cancel.js":
/*!*************************************************!*\
  !*** ./node_modules/axios/lib/cancel/Cancel.js ***!
  \*************************************************/
/***/ ((module) => {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/CancelToken.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/cancel/CancelToken.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var Cancel = __webpack_require__(/*! ./Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/isCancel.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/cancel/isCancel.js ***!
  \***************************************************/
/***/ ((module) => {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/Axios.js":
/*!**********************************************!*\
  !*** ./node_modules/axios/lib/core/Axios.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var buildURL = __webpack_require__(/*! ../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var InterceptorManager = __webpack_require__(/*! ./InterceptorManager */ "./node_modules/axios/lib/core/InterceptorManager.js");
var dispatchRequest = __webpack_require__(/*! ./dispatchRequest */ "./node_modules/axios/lib/core/dispatchRequest.js");
var mergeConfig = __webpack_require__(/*! ./mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),

/***/ "./node_modules/axios/lib/core/InterceptorManager.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/core/InterceptorManager.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),

/***/ "./node_modules/axios/lib/core/buildFullPath.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/buildFullPath.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var isAbsoluteURL = __webpack_require__(/*! ../helpers/isAbsoluteURL */ "./node_modules/axios/lib/helpers/isAbsoluteURL.js");
var combineURLs = __webpack_require__(/*! ../helpers/combineURLs */ "./node_modules/axios/lib/helpers/combineURLs.js");

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/createError.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/createError.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var enhanceError = __webpack_require__(/*! ./enhanceError */ "./node_modules/axios/lib/core/enhanceError.js");

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/dispatchRequest.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/core/dispatchRequest.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var transformData = __webpack_require__(/*! ./transformData */ "./node_modules/axios/lib/core/transformData.js");
var isCancel = __webpack_require__(/*! ../cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");
var defaults = __webpack_require__(/*! ../defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/core/enhanceError.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/core/enhanceError.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/mergeConfig.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/mergeConfig.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  var valueFromConfig2Keys = ['url', 'method', 'data'];
  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
  var defaultToConfig2Keys = [
    'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress',
    'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent',
    'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'
  ];
  var directMergeKeys = ['validateStatus'];

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  }

  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    }
  });

  utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);

  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  utils.forEach(directMergeKeys, function merge(prop) {
    if (prop in config2) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  var axiosKeys = valueFromConfig2Keys
    .concat(mergeDeepPropertiesKeys)
    .concat(defaultToConfig2Keys)
    .concat(directMergeKeys);

  var otherKeys = Object
    .keys(config1)
    .concat(Object.keys(config2))
    .filter(function filterAxiosKeys(key) {
      return axiosKeys.indexOf(key) === -1;
    });

  utils.forEach(otherKeys, mergeDeepProperties);

  return config;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/settle.js":
/*!***********************************************!*\
  !*** ./node_modules/axios/lib/core/settle.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var createError = __webpack_require__(/*! ./createError */ "./node_modules/axios/lib/core/createError.js");

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),

/***/ "./node_modules/axios/lib/core/transformData.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/transformData.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};


/***/ }),

/***/ "./node_modules/axios/lib/defaults.js":
/*!********************************************!*\
  !*** ./node_modules/axios/lib/defaults.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var process = __webpack_require__(/*! process/browser */ "./node_modules/process/browser.js");


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var normalizeHeaderName = __webpack_require__(/*! ./helpers/normalizeHeaderName */ "./node_modules/axios/lib/helpers/normalizeHeaderName.js");

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(/*! ./adapters/xhr */ "./node_modules/axios/lib/adapters/xhr.js");
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = __webpack_require__(/*! ./adapters/http */ "./node_modules/axios/lib/adapters/xhr.js");
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;


/***/ }),

/***/ "./node_modules/axios/lib/helpers/bind.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/bind.js ***!
  \************************************************/
/***/ ((module) => {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/buildURL.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/buildURL.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/combineURLs.js":
/*!*******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/combineURLs.js ***!
  \*******************************************************/
/***/ ((module) => {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/cookies.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/helpers/cookies.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAbsoluteURL.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAbsoluteURL.js ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAxiosError.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAxiosError.js ***!
  \********************************************************/
/***/ ((module) => {

"use strict";


/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
module.exports = function isAxiosError(payload) {
  return (typeof payload === 'object') && (payload.isAxiosError === true);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isURLSameOrigin.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isURLSameOrigin.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/normalizeHeaderName.js":
/*!***************************************************************!*\
  !*** ./node_modules/axios/lib/helpers/normalizeHeaderName.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/parseHeaders.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/parseHeaders.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/spread.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/helpers/spread.js ***!
  \**************************************************/
/***/ ((module) => {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/utils.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/utils.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM
};


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5[0].rules[0].use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/validate.vue?vue&type=script&lang=js&":
/*!***************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5[0].rules[0].use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/validate.vue?vue&type=script&lang=js& ***!
  \***************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _species_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./species.json */ "./resources/js/components/species.json");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "validate",
  props: ["form_data", "rows", "form_cols"],
  data: function data() {
    return {
      form_values: this.form_data,
      row_values: this.rows,
      row_cols: ["sl_no", "common_name", "scientific_name", "individuals", "remarks"],
      species_names: _species_json__WEBPACK_IMPORTED_MODULE_1__,
      row_comments: {}
    };
  },
  computed: {},
  watch: {
    row_values: {
      handler: function handler(val, oldVal) {
        this.populateRowComments(); // call it in the context of your component object
      },
      deep: true
    }
  },
  created: function created() {
    this.populateRowComments();
  },
  methods: {
    populateRowComments: function populateRowComments() {
      var _this = this;

      this.row_values.forEach(function (row) {
        _this.row_comments[row.id] = [];

        _this.row_cols.forEach(function (col) {
          var cell_class = _this.inputSpeciesClass(row.id, col, row[col]);

          switch (cell_class) {
            case "text-blank":
              _this.row_comments[row.id].push(_this.titleCase(col) + " is blank. Please fill it if possible");

              break;

            case "unmatched-name":
              _this.row_comments[row.id].push(_this.titleCase(col) + " doesnt with our list.");

            // Please check the name. If you are unsure, go ahead and validate it, we will review this in a short while.
          }
        });
      });
    },
    inputSpeciesClass: function inputSpeciesClass(row_id, col, val) {
      var op = "";

      switch (col) {
        case "sl_no":
        case "no_of_individuals":
          this.row_values.forEach(function (row) {
            if (row.id == row_id) {
              if (row[col] == "" || row[col] == null) op = "text-blank";
            }
          });
          break;

        case "common_name":
          op = "unmatched-name";
          this.species_names.forEach(function (sp) {
            if (sp[1] == val) {
              op = "matched-name";
            }
          });
          break;

        case "scientific_name":
          op = "unmatched-name";
          this.species_names.forEach(function (sp) {
            if (sp[0] == val) {
              op = "matched-name";
            }
          });
          break;
      }

      return op;
    },
    inputDetailsClass: function inputDetailsClass(col) {
      var op = "";
      if (this.form_values[col] == "" || this.form_values[col] == null) op = "text-blank";
      return op;
    },
    titleCase: function titleCase(str) {
      var splitStr = str.toLowerCase().split('_');

      for (var i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
      }

      return splitStr.join(' ');
    },
    validateData: function validateData() {
      var axios = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");

      var that = this;
      var post_data = {
        form: this.form_values,
        rows: this.row_values
      };
      axios.post('/butterfly_count/validate', post_data).then(function (response) {
        if (response.status == 200) {
          window.open("/butterfly_count", "_self");
        }
      })["catch"](function (error) {
        console.log(error);
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-10[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-10[0].rules[0].use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/validate.vue?vue&type=style&index=0&lang=css&":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??clonedRuleSet-10[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-10[0].rules[0].use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/validate.vue?vue&type=style&index=0&lang=css& ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, "\n.text-blank{\n\tbackground: rgba(255,100,100,.5);\n}\n.unmatched-name{\n\tbackground: rgba(255,0,0,.5);\n}\n.matched-name{\n\tbackground: rgba(100,255,100,.25);\n}\n.sl_no-row{\n\twidth: 10%;\n}\n.quality-cell{\n\twidth: 25%;\n\tfont-size: .75rem;\n}\n\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join("");
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === "string") {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, ""]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),

/***/ "./node_modules/process/browser.js":
/*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
/***/ ((module) => {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-10[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-10[0].rules[0].use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/validate.vue?vue&type=style&index=0&lang=css&":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-10[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-10[0].rules[0].use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/validate.vue?vue&type=style&index=0&lang=css& ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_clonedRuleSet_10_0_rules_0_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_10_0_rules_0_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_validate_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-10[0].rules[0].use[1]!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-10[0].rules[0].use[2]!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./validate.vue?vue&type=style&index=0&lang=css& */ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-10[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-10[0].rules[0].use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/validate.vue?vue&type=style&index=0&lang=css&");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_clonedRuleSet_10_0_rules_0_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_10_0_rules_0_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_validate_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_1__.default, options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_clonedRuleSet_10_0_rules_0_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_10_0_rules_0_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_validate_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_1__.default.locals || {});

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var isOldIE = function isOldIE() {
  var memo;
  return function memorize() {
    if (typeof memo === 'undefined') {
      // Test for IE <= 9 as proposed by Browserhacks
      // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
      // Tests for existence of standard globals is to allow style-loader
      // to operate correctly into non-standard environments
      // @see https://github.com/webpack-contrib/style-loader/issues/177
      memo = Boolean(window && document && document.all && !window.atob);
    }

    return memo;
  };
}();

var getTarget = function getTarget() {
  var memo = {};
  return function memorize(target) {
    if (typeof memo[target] === 'undefined') {
      var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

      if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
        try {
          // This will throw an exception if access to iframe is blocked
          // due to cross-origin restrictions
          styleTarget = styleTarget.contentDocument.head;
        } catch (e) {
          // istanbul ignore next
          styleTarget = null;
        }
      }

      memo[target] = styleTarget;
    }

    return memo[target];
  };
}();

var stylesInDom = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDom.length; i++) {
    if (stylesInDom[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var index = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3]
    };

    if (index !== -1) {
      stylesInDom[index].references++;
      stylesInDom[index].updater(obj);
    } else {
      stylesInDom.push({
        identifier: identifier,
        updater: addStyle(obj, options),
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function insertStyleElement(options) {
  var style = document.createElement('style');
  var attributes = options.attributes || {};

  if (typeof attributes.nonce === 'undefined') {
    var nonce =  true ? __webpack_require__.nc : 0;

    if (nonce) {
      attributes.nonce = nonce;
    }
  }

  Object.keys(attributes).forEach(function (key) {
    style.setAttribute(key, attributes[key]);
  });

  if (typeof options.insert === 'function') {
    options.insert(style);
  } else {
    var target = getTarget(options.insert || 'head');

    if (!target) {
      throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
    }

    target.appendChild(style);
  }

  return style;
}

function removeStyleElement(style) {
  // istanbul ignore if
  if (style.parentNode === null) {
    return false;
  }

  style.parentNode.removeChild(style);
}
/* istanbul ignore next  */


var replaceText = function replaceText() {
  var textStore = [];
  return function replace(index, replacement) {
    textStore[index] = replacement;
    return textStore.filter(Boolean).join('\n');
  };
}();

function applyToSingletonTag(style, index, remove, obj) {
  var css = remove ? '' : obj.media ? "@media ".concat(obj.media, " {").concat(obj.css, "}") : obj.css; // For old IE

  /* istanbul ignore if  */

  if (style.styleSheet) {
    style.styleSheet.cssText = replaceText(index, css);
  } else {
    var cssNode = document.createTextNode(css);
    var childNodes = style.childNodes;

    if (childNodes[index]) {
      style.removeChild(childNodes[index]);
    }

    if (childNodes.length) {
      style.insertBefore(cssNode, childNodes[index]);
    } else {
      style.appendChild(cssNode);
    }
  }
}

function applyToTag(style, options, obj) {
  var css = obj.css;
  var media = obj.media;
  var sourceMap = obj.sourceMap;

  if (media) {
    style.setAttribute('media', media);
  } else {
    style.removeAttribute('media');
  }

  if (sourceMap && typeof btoa !== 'undefined') {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }

    style.appendChild(document.createTextNode(css));
  }
}

var singleton = null;
var singletonCounter = 0;

function addStyle(obj, options) {
  var style;
  var update;
  var remove;

  if (options.singleton) {
    var styleIndex = singletonCounter++;
    style = singleton || (singleton = insertStyleElement(options));
    update = applyToSingletonTag.bind(null, style, styleIndex, false);
    remove = applyToSingletonTag.bind(null, style, styleIndex, true);
  } else {
    style = insertStyleElement(options);
    update = applyToTag.bind(null, style, options);

    remove = function remove() {
      removeStyleElement(style);
    };
  }

  update(obj);
  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
        return;
      }

      update(obj = newObj);
    } else {
      remove();
    }
  };
}

module.exports = function (list, options) {
  options = options || {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
  // tags it will allow on a page

  if (!options.singleton && typeof options.singleton !== 'boolean') {
    options.singleton = isOldIE();
  }

  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    if (Object.prototype.toString.call(newList) !== '[object Array]') {
      return;
    }

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDom[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDom[_index].references === 0) {
        stylesInDom[_index].updater();

        stylesInDom.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./resources/js/components/validate.vue":
/*!**********************************************!*\
  !*** ./resources/js/components/validate.vue ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _validate_vue_vue_type_template_id_50d65f61___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./validate.vue?vue&type=template&id=50d65f61& */ "./resources/js/components/validate.vue?vue&type=template&id=50d65f61&");
/* harmony import */ var _validate_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./validate.vue?vue&type=script&lang=js& */ "./resources/js/components/validate.vue?vue&type=script&lang=js&");
/* harmony import */ var _validate_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./validate.vue?vue&type=style&index=0&lang=css& */ "./resources/js/components/validate.vue?vue&type=style&index=0&lang=css&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__.default)(
  _validate_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__.default,
  _validate_vue_vue_type_template_id_50d65f61___WEBPACK_IMPORTED_MODULE_0__.render,
  _validate_vue_vue_type_template_id_50d65f61___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/components/validate.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/components/validate.vue?vue&type=script&lang=js&":
/*!***********************************************************************!*\
  !*** ./resources/js/components/validate.vue?vue&type=script&lang=js& ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_0_rules_0_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_validate_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5[0].rules[0].use[0]!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./validate.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5[0].rules[0].use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/validate.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_0_rules_0_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_validate_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__.default); 

/***/ }),

/***/ "./resources/js/components/validate.vue?vue&type=style&index=0&lang=css&":
/*!*******************************************************************************!*\
  !*** ./resources/js/components/validate.vue?vue&type=style&index=0&lang=css& ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_clonedRuleSet_10_0_rules_0_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_10_0_rules_0_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_validate_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/style-loader/dist/cjs.js!../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-10[0].rules[0].use[1]!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-10[0].rules[0].use[2]!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./validate.vue?vue&type=style&index=0&lang=css& */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-10[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-10[0].rules[0].use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/validate.vue?vue&type=style&index=0&lang=css&");


/***/ }),

/***/ "./resources/js/components/validate.vue?vue&type=template&id=50d65f61&":
/*!*****************************************************************************!*\
  !*** ./resources/js/components/validate.vue?vue&type=template&id=50d65f61& ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_validate_vue_vue_type_template_id_50d65f61___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_validate_vue_vue_type_template_id_50d65f61___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_validate_vue_vue_type_template_id_50d65f61___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./validate.vue?vue&type=template&id=50d65f61& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/validate.vue?vue&type=template&id=50d65f61&");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/validate.vue?vue&type=template&id=50d65f61&":
/*!********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/validate.vue?vue&type=template&id=50d65f61& ***!
  \********************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "staticRenderFns": () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "container-fluid" }, [
    _c("table", { staticClass: "table table-sm table-info" }, [
      _c(
        "tbody",
        _vm._l(_vm.form_cols, function(col) {
          return _c("tr", [
            _c("td", { domProps: { textContent: _vm._s(_vm.titleCase(col)) } }),
            _vm._v(" "),
            _c("td", [
              _c("input", {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.form_values[col],
                    expression: "form_values[col]"
                  }
                ],
                staticClass: "form-control",
                class: _vm.inputDetailsClass(col),
                attrs: { type: "text", name: col },
                domProps: { value: _vm.form_values[col] },
                on: {
                  input: function($event) {
                    if ($event.target.composing) {
                      return
                    }
                    _vm.$set(_vm.form_values, col, $event.target.value)
                  }
                }
              })
            ])
          ])
        }),
        0
      )
    ]),
    _vm._v(" "),
    _c("table", { staticClass: "table table-sm table-success" }, [
      _vm._m(0),
      _vm._v(" "),
      _c(
        "tbody",
        _vm._l(_vm.row_values, function(row) {
          return _c(
            "tr",
            [
              _vm._l(_vm.row_cols, function(col) {
                return _c("td", [
                  _c("input", {
                    directives: [
                      {
                        name: "model",
                        rawName: "v-model",
                        value: row[col],
                        expression: "row[col]"
                      }
                    ],
                    staticClass: "form-control",
                    class: _vm.inputSpeciesClass(row.id, col, row[col]),
                    attrs: { type: "text", name: col[row.id] },
                    domProps: { value: row[col] },
                    on: {
                      input: function($event) {
                        if ($event.target.composing) {
                          return
                        }
                        _vm.$set(row, col, $event.target.value)
                      }
                    }
                  })
                ])
              }),
              _vm._v(" "),
              _c("td", { staticClass: "quality-cell" }, [
                _vm.row_comments[row.id].length > 0
                  ? _c(
                      "ul",
                      _vm._l(_vm.row_comments[row.id], function(c) {
                        return _c("li", {
                          domProps: { textContent: _vm._s(c) }
                        })
                      }),
                      0
                    )
                  : _vm._e()
              ])
            ],
            2
          )
        }),
        0
      )
    ]),
    _vm._v(" "),
    _c("div", { staticClass: "row d-flex justify-content-center" }, [
      _c(
        "button",
        {
          staticClass: "btn btn-success btn-block",
          on: {
            click: function($event) {
              return _vm.validateData()
            }
          }
        },
        [_vm._v("Validate")]
      )
    ])
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("thead", { staticClass: "text-center" }, [
      _c("tr", [
        _c("th", { staticClass: "sl_no-row" }, [_vm._v("Sl. No")]),
        _vm._v(" "),
        _c("th", [_vm._v("Common Name")]),
        _vm._v(" "),
        _c("th", [_vm._v("Scientific Name")]),
        _vm._v(" "),
        _c("th", [_vm._v("No of Individuals")]),
        _vm._v(" "),
        _c("th", [_vm._v("Remarks")]),
        _vm._v(" "),
        _c("th", [_vm._v("Data Quality Notes")])
      ])
    ])
  }
]
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js":
/*!********************************************************************!*\
  !*** ./node_modules/vue-loader/lib/runtime/componentNormalizer.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ normalizeComponent)
/* harmony export */ });
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () {
        injectStyles.call(
          this,
          (options.functional ? this.parent : this).$root.$options.shadowRoot
        )
      }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functional component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}


/***/ }),

/***/ "./node_modules/vue/dist/vue.esm.js":
/*!******************************************!*\
  !*** ./node_modules/vue/dist/vue.esm.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/*!
 * Vue.js v2.6.14
 * (c) 2014-2021 Evan You
 * Released under the MIT License.
 */
/*  */

var emptyObject = Object.freeze({});

// These helpers produce better VM code in JS engines due to their
// explicitness and function inlining.
function isUndef (v) {
  return v === undefined || v === null
}

function isDef (v) {
  return v !== undefined && v !== null
}

function isTrue (v) {
  return v === true
}

function isFalse (v) {
  return v === false
}

/**
 * Check if value is primitive.
 */
function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * Get the raw type string of a value, e.g., [object Object].
 */
var _toString = Object.prototype.toString;

function toRawType (value) {
  return _toString.call(value).slice(8, -1)
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}

function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}

/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex (val) {
  var n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

function isPromise (val) {
  return (
    isDef(val) &&
    typeof val.then === 'function' &&
    typeof val.catch === 'function'
  )
}

/**
 * Convert a value to a string that is actually rendered.
 */
function toString (val) {
  return val == null
    ? ''
    : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert an input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Check if an attribute is a reserved attribute.
 */
var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

/**
 * Remove an item from an array.
 */
function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether an object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cached(function (str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
});

/**
 * Simple bind polyfill for environments that do not support it,
 * e.g., PhantomJS 1.x. Technically, we don't need this anymore
 * since native bind is now performant enough in most browsers.
 * But removing it would mean breaking code that was able to run in
 * PhantomJS 1.x, so this must be kept for backward compatibility.
 */

/* istanbul ignore next */
function polyfillBind (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }

  boundFn._length = fn.length;
  return boundFn
}

function nativeBind (fn, ctx) {
  return fn.bind(ctx)
}

var bind = Function.prototype.bind
  ? nativeBind
  : polyfillBind;

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res
}

/* eslint-disable no-unused-vars */

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
 */
function noop (a, b, c) {}

/**
 * Always return false.
 */
var no = function (a, b, c) { return false; };

/* eslint-enable no-unused-vars */

/**
 * Return the same value.
 */
var identity = function (_) { return _; };

/**
 * Generate a string containing static keys from compiler modules.
 */
function genStaticKeys (modules) {
  return modules.reduce(function (keys, m) {
    return keys.concat(m.staticKeys || [])
  }, []).join(',')
}

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
  if (a === b) { return true }
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i])
        })
      } else if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime()
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(function (key) {
          return looseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

/**
 * Return the first index at which a loosely equal value can be
 * found in the array (if value is a plain object, the array must
 * contain an object of the same shape), or -1 if it is not present.
 */
function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}

/**
 * Ensure a function is called only once.
 */
function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  }
}

var SSR_ATTR = 'data-server-rendered';

var ASSET_TYPES = [
  'component',
  'directive',
  'filter'
];

var LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured',
  'serverPrefetch'
];

/*  */



var config = ({
  /**
   * Option merge strategies (used in core/util/options)
   */
  // $flow-disable-line
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: "development" !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: "development" !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  // $flow-disable-line
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Perform updates asynchronously. Intended to be used by Vue Test Utils
   * This will significantly reduce performance if set to false.
   */
  async: true,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
});

/*  */

/**
 * unicode letters used for parsing html tags, component names and property paths.
 * using https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname
 * skipping \u10000-\uEFFFF due to it freezing up PhantomJS
 */
var unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;

/**
 * Check if a string starts with $ or _
 */
function isReserved (str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
var bailRE = new RegExp(("[^" + (unicodeRegExp.source) + ".$_\\d]"));
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) { return }
      obj = obj[segments[i]];
    }
    return obj
  }
}

/*  */

// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
var isPhantomJS = UA && /phantomjs/.test(UA);
var isFF = UA && UA.match(/firefox\/(\d+)/);

// Firefox has a "watch" function on Object.prototype...
var nativeWatch = ({}).watch;

var supportsPassive = false;
if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', ({
      get: function get () {
        /* istanbul ignore next */
        supportsPassive = true;
      }
    })); // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;
var isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && !inWeex && typeof __webpack_require__.g !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = __webpack_require__.g['process'] && __webpack_require__.g['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer
};

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

var hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

var _Set;
/* istanbul ignore if */ // $flow-disable-line
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = /*@__PURE__*/(function () {
    function Set () {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has (key) {
      return this.set[key] === true
    };
    Set.prototype.add = function add (key) {
      this.set[key] = true;
    };
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

/*  */

var warn = noop;
var tip = noop;
var generateComponentTrace = (noop); // work around flow check
var formatComponentName = (noop);

if (true) {
  var hasConsole = typeof console !== 'undefined';
  var classifyRE = /(?:^|[-_])(\w)/g;
  var classify = function (str) { return str
    .replace(classifyRE, function (c) { return c.toUpperCase(); })
    .replace(/[-_]/g, ''); };

  warn = function (msg, vm) {
    var trace = vm ? generateComponentTrace(vm) : '';

    if (config.warnHandler) {
      config.warnHandler.call(null, msg, vm, trace);
    } else if (hasConsole && (!config.silent)) {
      console.error(("[Vue warn]: " + msg + trace));
    }
  };

  tip = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.warn("[Vue tip]: " + msg + (
        vm ? generateComponentTrace(vm) : ''
      ));
    }
  };

  formatComponentName = function (vm, includeFile) {
    if (vm.$root === vm) {
      return '<Root>'
    }
    var options = typeof vm === 'function' && vm.cid != null
      ? vm.options
      : vm._isVue
        ? vm.$options || vm.constructor.options
        : vm;
    var name = options.name || options._componentTag;
    var file = options.__file;
    if (!name && file) {
      var match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (
      (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
      (file && includeFile !== false ? (" at " + file) : '')
    )
  };

  var repeat = function (str, n) {
    var res = '';
    while (n) {
      if (n % 2 === 1) { res += str; }
      if (n > 1) { str += str; }
      n >>= 1;
    }
    return res
  };

  generateComponentTrace = function (vm) {
    if (vm._isVue && vm.$parent) {
      var tree = [];
      var currentRecursiveSequence = 0;
      while (vm) {
        if (tree.length > 0) {
          var last = tree[tree.length - 1];
          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }
        tree.push(vm);
        vm = vm.$parent;
      }
      return '\n\nfound in\n\n' + tree
        .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
            ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
            : formatComponentName(vm))); })
        .join('\n')
    } else {
      return ("\n\n(found in " + (formatComponentName(vm)) + ")")
    }
  };
}

/*  */

var uid = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  this.id = uid++;
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend () {
  if (Dep.target) {
    Dep.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  if ( true && !config.async) {
    // subs aren't sorted in scheduler if not running async
    // we need to sort them now to make sure they fire in correct
    // order
    subs.sort(function (a, b) { return a.id - b.id; });
  }
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.
Dep.target = null;
var targetStack = [];

function pushTarget (target) {
  targetStack.push(target);
  Dep.target = target;
}

function popTarget () {
  targetStack.pop();
  Dep.target = targetStack[targetStack.length - 1];
}

/*  */

var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  context,
  componentOptions,
  asyncFactory
) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.fnContext = undefined;
  this.fnOptions = undefined;
  this.fnScopeId = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
  this.asyncFactory = asyncFactory;
  this.asyncMeta = undefined;
  this.isAsyncPlaceholder = false;
};

var prototypeAccessors = { child: { configurable: true } };

// DEPRECATED: alias for componentInstance for backwards compat.
/* istanbul ignore next */
prototypeAccessors.child.get = function () {
  return this.componentInstance
};

Object.defineProperties( VNode.prototype, prototypeAccessors );

var createEmptyVNode = function (text) {
  if ( text === void 0 ) text = '';

  var node = new VNode();
  node.text = text;
  node.isComment = true;
  return node
};

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode (vnode) {
  var cloned = new VNode(
    vnode.tag,
    vnode.data,
    // #7975
    // clone children array to avoid mutating original in case of cloning
    // a child.
    vnode.children && vnode.children.slice(),
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  );
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.fnContext = vnode.fnContext;
  cloned.fnOptions = vnode.fnOptions;
  cloned.fnScopeId = vnode.fnScopeId;
  cloned.asyncMeta = vnode.asyncMeta;
  cloned.isCloned = true;
  return cloned
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);

var methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
];

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * In some cases we may want to disable observation inside a component's
 * update computation.
 */
var shouldObserve = true;

function toggleObserving (value) {
  shouldObserve = value;
}

/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    if (hasProto) {
      protoAugment(value, arrayMethods);
    } else {
      copyAugment(value, arrayMethods, arrayKeys);
    }
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through all properties and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive$$1(obj, keys[i]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment a target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment a target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe (value, asRootData) {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive$$1 (
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key];
  }

  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if ( true && customSetter) {
        customSetter();
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) { return }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set (target, key, val) {
  if ( true &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot set reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
     true && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return val
  }
  if (!ob) {
    target[key] = val;
    return val
  }
  defineReactive$$1(ob.value, key, val);
  ob.dep.notify();
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
function del (target, key) {
  if ( true &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot delete reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
     true && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    );
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key];
  if (!ob) {
    return
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value) {
  for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
if (true) {
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        "option \"" + key + "\" can only be used during instance " +
        'creation with the `new` keyword.'
      );
    }
    return defaultStrat(parent, child)
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  if (!from) { return to }
  var key, toVal, fromVal;

  var keys = hasSymbol
    ? Reflect.ownKeys(from)
    : Object.keys(from);

  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    // in case the object is already observed...
    if (key === '__ob__') { continue }
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (
      toVal !== fromVal &&
      isPlainObject(toVal) &&
      isPlainObject(fromVal)
    ) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
function mergeDataOrFn (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this, this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
      )
    }
  } else {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm, vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm, vm)
        : parentVal;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}

strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
       true && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      );

      return parentVal
    }
    return mergeDataOrFn(parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
};

/**
 * Hooks and props are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  var res = childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal;
  return res
    ? dedupeHooks(res)
    : res
}

function dedupeHooks (hooks) {
  var res = [];
  for (var i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res
}

LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (
  parentVal,
  childVal,
  vm,
  key
) {
  var res = Object.create(parentVal || null);
  if (childVal) {
     true && assertObjectType(key, childVal, vm);
    return extend(res, childVal)
  } else {
    return res
  }
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (
  parentVal,
  childVal,
  vm,
  key
) {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) { parentVal = undefined; }
  if (childVal === nativeWatch) { childVal = undefined; }
  /* istanbul ignore if */
  if (!childVal) { return Object.create(parentVal || null) }
  if (true) {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = {};
  extend(ret, parentVal);
  for (var key$1 in childVal) {
    var parent = ret[key$1];
    var child = childVal[key$1];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key$1] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child];
  }
  return ret
};

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.inject =
strats.computed = function (
  parentVal,
  childVal,
  vm,
  key
) {
  if (childVal && "development" !== 'production') {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = Object.create(null);
  extend(ret, parentVal);
  if (childVal) { extend(ret, childVal); }
  return ret
};
strats.provide = mergeDataOrFn;

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * Validate component names
 */
function checkComponents (options) {
  for (var key in options.components) {
    validateComponentName(key);
  }
}

function validateComponentName (name) {
  if (!new RegExp(("^[a-zA-Z][\\-\\.0-9_" + (unicodeRegExp.source) + "]*$")).test(name)) {
    warn(
      'Invalid component name: "' + name + '". Component names ' +
      'should conform to valid custom element name in html5 specification.'
    );
  }
  if (isBuiltInTag(name) || config.isReservedTag(name)) {
    warn(
      'Do not use built-in or reserved HTML elements as component ' +
      'id: ' + name
    );
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps (options, vm) {
  var props = options.props;
  if (!props) { return }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else if (true) {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val)
        ? val
        : { type: val };
    }
  } else if (true) {
    warn(
      "Invalid value for option \"props\": expected an Array or an Object, " +
      "but got " + (toRawType(props)) + ".",
      vm
    );
  }
  options.props = res;
}

/**
 * Normalize all injections into Object-based format
 */
function normalizeInject (options, vm) {
  var inject = options.inject;
  if (!inject) { return }
  var normalized = options.inject = {};
  if (Array.isArray(inject)) {
    for (var i = 0; i < inject.length; i++) {
      normalized[inject[i]] = { from: inject[i] };
    }
  } else if (isPlainObject(inject)) {
    for (var key in inject) {
      var val = inject[key];
      normalized[key] = isPlainObject(val)
        ? extend({ from: key }, val)
        : { from: val };
    }
  } else if (true) {
    warn(
      "Invalid value for option \"inject\": expected an Array or an Object, " +
      "but got " + (toRawType(inject)) + ".",
      vm
    );
  }
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def$$1 = dirs[key];
      if (typeof def$$1 === 'function') {
        dirs[key] = { bind: def$$1, update: def$$1 };
      }
    }
  }
}

function assertObjectType (name, value, vm) {
  if (!isPlainObject(value)) {
    warn(
      "Invalid value for option \"" + name + "\": expected an Object, " +
      "but got " + (toRawType(value)) + ".",
      vm
    );
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions (
  parent,
  child,
  vm
) {
  if (true) {
    checkComponents(child);
  }

  if (typeof child === 'function') {
    child = child.options;
  }

  normalizeProps(child, vm);
  normalizeInject(child, vm);
  normalizeDirectives(child);

  // Apply extends and mixins on the child options,
  // but only if it is a raw options object that isn't
  // the result of another mergeOptions call.
  // Only merged options has the _base property.
  if (!child._base) {
    if (child.extends) {
      parent = mergeOptions(parent, child.extends, vm);
    }
    if (child.mixins) {
      for (var i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm);
      }
    }
  }

  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField (key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) { return assets[id] }
  var camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
  var PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
  // fallback to prototype chain
  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  if ( true && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    );
  }
  return res
}

/*  */



function validateProp (
  key,
  propOptions,
  propsData,
  vm
) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // boolean casting
  var booleanIndex = getTypeIndex(Boolean, prop.type);
  if (booleanIndex > -1) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (value === '' || value === hyphenate(key)) {
      // only cast empty string / same name to boolean if
      // boolean has higher priority
      var stringIndex = getTypeIndex(String, prop.type);
      if (stringIndex < 0 || booleanIndex < stringIndex) {
        value = true;
      }
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldObserve = shouldObserve;
    toggleObserving(true);
    observe(value);
    toggleObserving(prevShouldObserve);
  }
  if (
    true
  ) {
    assertProp(prop, key, value, vm, absent);
  }
  return value
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue (vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if ( true && isObject(def)) {
    warn(
      'Invalid default value for prop "' + key + '": ' +
      'Props with type Object/Array must use a factory function ' +
      'to return the default value.',
      vm
    );
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (vm && vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined
  ) {
    return vm._props[key]
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === 'function' && getType(prop.type) !== 'Function'
    ? def.call(vm)
    : def
}

/**
 * Assert whether a prop is valid.
 */
function assertProp (
  prop,
  name,
  value,
  vm,
  absent
) {
  if (prop.required && absent) {
    warn(
      'Missing required prop: "' + name + '"',
      vm
    );
    return
  }
  if (value == null && !prop.required) {
    return
  }
  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i], vm);
      expectedTypes.push(assertedType.expectedType || '');
      valid = assertedType.valid;
    }
  }

  var haveExpectedTypes = expectedTypes.some(function (t) { return t; });
  if (!valid && haveExpectedTypes) {
    warn(
      getInvalidTypeMessage(name, value, expectedTypes),
      vm
    );
    return
  }
  var validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      );
    }
  }
}

var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol|BigInt)$/;

function assertType (value, type, vm) {
  var valid;
  var expectedType = getType(type);
  if (simpleCheckRE.test(expectedType)) {
    var t = typeof value;
    valid = t === expectedType.toLowerCase();
    // for primitive wrapper objects
    if (!valid && t === 'object') {
      valid = value instanceof type;
    }
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    try {
      valid = value instanceof type;
    } catch (e) {
      warn('Invalid prop type: "' + String(type) + '" is not a constructor', vm);
      valid = false;
    }
  }
  return {
    valid: valid,
    expectedType: expectedType
  }
}

var functionTypeCheckRE = /^\s*function (\w+)/;

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType (fn) {
  var match = fn && fn.toString().match(functionTypeCheckRE);
  return match ? match[1] : ''
}

function isSameType (a, b) {
  return getType(a) === getType(b)
}

function getTypeIndex (type, expectedTypes) {
  if (!Array.isArray(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1
  }
  for (var i = 0, len = expectedTypes.length; i < len; i++) {
    if (isSameType(expectedTypes[i], type)) {
      return i
    }
  }
  return -1
}

function getInvalidTypeMessage (name, value, expectedTypes) {
  var message = "Invalid prop: type check failed for prop \"" + name + "\"." +
    " Expected " + (expectedTypes.map(capitalize).join(', '));
  var expectedType = expectedTypes[0];
  var receivedType = toRawType(value);
  // check if we need to specify expected value
  if (
    expectedTypes.length === 1 &&
    isExplicable(expectedType) &&
    isExplicable(typeof value) &&
    !isBoolean(expectedType, receivedType)
  ) {
    message += " with value " + (styleValue(value, expectedType));
  }
  message += ", got " + receivedType + " ";
  // check if we need to specify received value
  if (isExplicable(receivedType)) {
    message += "with value " + (styleValue(value, receivedType)) + ".";
  }
  return message
}

function styleValue (value, type) {
  if (type === 'String') {
    return ("\"" + value + "\"")
  } else if (type === 'Number') {
    return ("" + (Number(value)))
  } else {
    return ("" + value)
  }
}

var EXPLICABLE_TYPES = ['string', 'number', 'boolean'];
function isExplicable (value) {
  return EXPLICABLE_TYPES.some(function (elem) { return value.toLowerCase() === elem; })
}

function isBoolean () {
  var args = [], len = arguments.length;
  while ( len-- ) args[ len ] = arguments[ len ];

  return args.some(function (elem) { return elem.toLowerCase() === 'boolean'; })
}

/*  */

function handleError (err, vm, info) {
  // Deactivate deps tracking while processing error handler to avoid possible infinite rendering.
  // See: https://github.com/vuejs/vuex/issues/1505
  pushTarget();
  try {
    if (vm) {
      var cur = vm;
      while ((cur = cur.$parent)) {
        var hooks = cur.$options.errorCaptured;
        if (hooks) {
          for (var i = 0; i < hooks.length; i++) {
            try {
              var capture = hooks[i].call(cur, err, vm, info) === false;
              if (capture) { return }
            } catch (e) {
              globalHandleError(e, cur, 'errorCaptured hook');
            }
          }
        }
      }
    }
    globalHandleError(err, vm, info);
  } finally {
    popTarget();
  }
}

function invokeWithErrorHandling (
  handler,
  context,
  args,
  vm,
  info
) {
  var res;
  try {
    res = args ? handler.apply(context, args) : handler.call(context);
    if (res && !res._isVue && isPromise(res) && !res._handled) {
      res.catch(function (e) { return handleError(e, vm, info + " (Promise/async)"); });
      // issue #9511
      // avoid catch triggering multiple times when nested calls
      res._handled = true;
    }
  } catch (e) {
    handleError(e, vm, info);
  }
  return res
}

function globalHandleError (err, vm, info) {
  if (config.errorHandler) {
    try {
      return config.errorHandler.call(null, err, vm, info)
    } catch (e) {
      // if the user intentionally throws the original error in the handler,
      // do not log it twice
      if (e !== err) {
        logError(e, null, 'config.errorHandler');
      }
    }
  }
  logError(err, vm, info);
}

function logError (err, vm, info) {
  if (true) {
    warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
  }
  /* istanbul ignore else */
  if ((inBrowser || inWeex) && typeof console !== 'undefined') {
    console.error(err);
  } else {
    throw err
  }
}

/*  */

var isUsingMicroTask = false;

var callbacks = [];
var pending = false;

function flushCallbacks () {
  pending = false;
  var copies = callbacks.slice(0);
  callbacks.length = 0;
  for (var i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

// Here we have async deferring wrappers using microtasks.
// In 2.5 we used (macro) tasks (in combination with microtasks).
// However, it has subtle problems when state is changed right before repaint
// (e.g. #6813, out-in transitions).
// Also, using (macro) tasks in event handler would cause some weird behaviors
// that cannot be circumvented (e.g. #7109, #7153, #7546, #7834, #8109).
// So we now use microtasks everywhere, again.
// A major drawback of this tradeoff is that there are some scenarios
// where microtasks have too high a priority and fire in between supposedly
// sequential events (e.g. #4521, #6690, which have workarounds)
// or even between bubbling of the same event (#6566).
var timerFunc;

// The nextTick behavior leverages the microtask queue, which can be accessed
// via either native Promise.then or MutationObserver.
// MutationObserver has wider support, however it is seriously bugged in
// UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
// completely stops working after triggering a few times... so, if native
// Promise is available, we will use it:
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  var p = Promise.resolve();
  timerFunc = function () {
    p.then(flushCallbacks);
    // In problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) { setTimeout(noop); }
  };
  isUsingMicroTask = true;
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  // PhantomJS and iOS 7.x
  MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
  // Use MutationObserver where native Promise is not available,
  // e.g. PhantomJS, iOS7, Android 4.4
  // (#6466 MutationObserver is unreliable in IE11)
  var counter = 1;
  var observer = new MutationObserver(flushCallbacks);
  var textNode = document.createTextNode(String(counter));
  observer.observe(textNode, {
    characterData: true
  });
  timerFunc = function () {
    counter = (counter + 1) % 2;
    textNode.data = String(counter);
  };
  isUsingMicroTask = true;
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  // Fallback to setImmediate.
  // Technically it leverages the (macro) task queue,
  // but it is still a better choice than setTimeout.
  timerFunc = function () {
    setImmediate(flushCallbacks);
  };
} else {
  // Fallback to setTimeout.
  timerFunc = function () {
    setTimeout(flushCallbacks, 0);
  };
}

function nextTick (cb, ctx) {
  var _resolve;
  callbacks.push(function () {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, 'nextTick');
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  if (!pending) {
    pending = true;
    timerFunc();
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(function (resolve) {
      _resolve = resolve;
    })
  }
}

/*  */

var mark;
var measure;

if (true) {
  var perf = inBrowser && window.performance;
  /* istanbul ignore if */
  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    mark = function (tag) { return perf.mark(tag); };
    measure = function (name, startTag, endTag) {
      perf.measure(name, startTag, endTag);
      perf.clearMarks(startTag);
      perf.clearMarks(endTag);
      // perf.clearMeasures(name)
    };
  }
}

/* not type checking this file because flow doesn't play well with Proxy */

var initProxy;

if (true) {
  var allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt,' +
    'require' // for Webpack/Browserify
  );

  var warnNonPresent = function (target, key) {
    warn(
      "Property or method \"" + key + "\" is not defined on the instance but " +
      'referenced during render. Make sure that this property is reactive, ' +
      'either in the data option, or for class-based components, by ' +
      'initializing the property. ' +
      'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
      target
    );
  };

  var warnReservedPrefix = function (target, key) {
    warn(
      "Property \"" + key + "\" must be accessed with \"$data." + key + "\" because " +
      'properties starting with "$" or "_" are not proxied in the Vue instance to ' +
      'prevent conflicts with Vue internals. ' +
      'See: https://vuejs.org/v2/api/#data',
      target
    );
  };

  var hasProxy =
    typeof Proxy !== 'undefined' && isNative(Proxy);

  if (hasProxy) {
    var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
    config.keyCodes = new Proxy(config.keyCodes, {
      set: function set (target, key, value) {
        if (isBuiltInModifier(key)) {
          warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
          return false
        } else {
          target[key] = value;
          return true
        }
      }
    });
  }

  var hasHandler = {
    has: function has (target, key) {
      var has = key in target;
      var isAllowed = allowedGlobals(key) ||
        (typeof key === 'string' && key.charAt(0) === '_' && !(key in target.$data));
      if (!has && !isAllowed) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return has || !isAllowed
    }
  };

  var getHandler = {
    get: function get (target, key) {
      if (typeof key === 'string' && !(key in target)) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return target[key]
    }
  };

  initProxy = function initProxy (vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      var options = vm.$options;
      var handlers = options.render && options.render._withStripped
        ? getHandler
        : hasHandler;
      vm._renderProxy = new Proxy(vm, handlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}

/*  */

var seenObjects = new _Set();

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
function traverse (val) {
  _traverse(val, seenObjects);
  seenObjects.clear();
}

function _traverse (val, seen) {
  var i, keys;
  var isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
    return
  }
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) { _traverse(val[i], seen); }
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) { _traverse(val[keys[i]], seen); }
  }
}

/*  */

var normalizeEvent = cached(function (name) {
  var passive = name.charAt(0) === '&';
  name = passive ? name.slice(1) : name;
  var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
  name = once$$1 ? name.slice(1) : name;
  var capture = name.charAt(0) === '!';
  name = capture ? name.slice(1) : name;
  return {
    name: name,
    once: once$$1,
    capture: capture,
    passive: passive
  }
});

function createFnInvoker (fns, vm) {
  function invoker () {
    var arguments$1 = arguments;

    var fns = invoker.fns;
    if (Array.isArray(fns)) {
      var cloned = fns.slice();
      for (var i = 0; i < cloned.length; i++) {
        invokeWithErrorHandling(cloned[i], null, arguments$1, vm, "v-on handler");
      }
    } else {
      // return handler return value for single handlers
      return invokeWithErrorHandling(fns, null, arguments, vm, "v-on handler")
    }
  }
  invoker.fns = fns;
  return invoker
}

function updateListeners (
  on,
  oldOn,
  add,
  remove$$1,
  createOnceHandler,
  vm
) {
  var name, def$$1, cur, old, event;
  for (name in on) {
    def$$1 = cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);
    if (isUndef(cur)) {
       true && warn(
        "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
        vm
      );
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur, vm);
      }
      if (isTrue(event.once)) {
        cur = on[name] = createOnceHandler(event.name, cur, event.capture);
      }
      add(event.name, cur, event.capture, event.passive, event.params);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove$$1(event.name, oldOn[name], event.capture);
    }
  }
}

/*  */

function mergeVNodeHook (def, hookKey, hook) {
  if (def instanceof VNode) {
    def = def.data.hook || (def.data.hook = {});
  }
  var invoker;
  var oldHook = def[hookKey];

  function wrappedHook () {
    hook.apply(this, arguments);
    // important: remove merged hook to ensure it's called only once
    // and prevent memory leak
    remove(invoker.fns, wrappedHook);
  }

  if (isUndef(oldHook)) {
    // no existing hook
    invoker = createFnInvoker([wrappedHook]);
  } else {
    /* istanbul ignore if */
    if (isDef(oldHook.fns) && isTrue(oldHook.merged)) {
      // already a merged invoker
      invoker = oldHook;
      invoker.fns.push(wrappedHook);
    } else {
      // existing plain hook
      invoker = createFnInvoker([oldHook, wrappedHook]);
    }
  }

  invoker.merged = true;
  def[hookKey] = invoker;
}

/*  */

function extractPropsFromVNodeData (
  data,
  Ctor,
  tag
) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (isUndef(propOptions)) {
    return
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      if (true) {
        var keyInLowerCase = key.toLowerCase();
        if (
          key !== keyInLowerCase &&
          attrs && hasOwn(attrs, keyInLowerCase)
        ) {
          tip(
            "Prop \"" + keyInLowerCase + "\" is passed to component " +
            (formatComponentName(tag || Ctor)) + ", but the declared prop name is" +
            " \"" + key + "\". " +
            "Note that HTML attributes are case-insensitive and camelCased " +
            "props need to use their kebab-case equivalents when using in-DOM " +
            "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
          );
        }
      }
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey, false);
    }
  }
  return res
}

function checkProp (
  res,
  hash,
  key,
  altKey,
  preserve
) {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true
    }
  }
  return false
}

/*  */

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
function simpleNormalizeChildren (children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
function normalizeChildren (children) {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}

function isTextNode (node) {
  return isDef(node) && isDef(node.text) && isFalse(node.isComment)
}

function normalizeArrayChildren (children, nestedIndex) {
  var res = [];
  var i, c, lastIndex, last;
  for (i = 0; i < children.length; i++) {
    c = children[i];
    if (isUndef(c) || typeof c === 'boolean') { continue }
    lastIndex = res.length - 1;
    last = res[lastIndex];
    //  nested
    if (Array.isArray(c)) {
      if (c.length > 0) {
        c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i));
        // merge adjacent text nodes
        if (isTextNode(c[0]) && isTextNode(last)) {
          res[lastIndex] = createTextVNode(last.text + (c[0]).text);
          c.shift();
        }
        res.push.apply(res, c);
      }
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        res[lastIndex] = createTextVNode(last.text + c);
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[lastIndex] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)) {
          c.key = "__vlist" + nestedIndex + "_" + i + "__";
        }
        res.push(c);
      }
    }
  }
  return res
}

/*  */

function initProvide (vm) {
  var provide = vm.$options.provide;
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide;
  }
}

function initInjections (vm) {
  var result = resolveInject(vm.$options.inject, vm);
  if (result) {
    toggleObserving(false);
    Object.keys(result).forEach(function (key) {
      /* istanbul ignore else */
      if (true) {
        defineReactive$$1(vm, key, result[key], function () {
          warn(
            "Avoid mutating an injected value directly since the changes will be " +
            "overwritten whenever the provided component re-renders. " +
            "injection being mutated: \"" + key + "\"",
            vm
          );
        });
      } else {}
    });
    toggleObserving(true);
  }
}

function resolveInject (inject, vm) {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    var result = Object.create(null);
    var keys = hasSymbol
      ? Reflect.ownKeys(inject)
      : Object.keys(inject);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      // #6574 in case the inject object is observed...
      if (key === '__ob__') { continue }
      var provideKey = inject[key].from;
      var source = vm;
      while (source) {
        if (source._provided && hasOwn(source._provided, provideKey)) {
          result[key] = source._provided[provideKey];
          break
        }
        source = source.$parent;
      }
      if (!source) {
        if ('default' in inject[key]) {
          var provideDefault = inject[key].default;
          result[key] = typeof provideDefault === 'function'
            ? provideDefault.call(vm)
            : provideDefault;
        } else if (true) {
          warn(("Injection \"" + key + "\" not found"), vm);
        }
      }
    }
    return result
  }
}

/*  */



/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */
function resolveSlots (
  children,
  context
) {
  if (!children || !children.length) {
    return {}
  }
  var slots = {};
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    var data = child.data;
    // remove slot attribute if the node is resolved as a Vue slot node
    if (data && data.attrs && data.attrs.slot) {
      delete data.attrs.slot;
    }
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.fnContext === context) &&
      data && data.slot != null
    ) {
      var name = data.slot;
      var slot = (slots[name] || (slots[name] = []));
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children || []);
      } else {
        slot.push(child);
      }
    } else {
      (slots.default || (slots.default = [])).push(child);
    }
  }
  // ignore slots that contains only whitespace
  for (var name$1 in slots) {
    if (slots[name$1].every(isWhitespace)) {
      delete slots[name$1];
    }
  }
  return slots
}

function isWhitespace (node) {
  return (node.isComment && !node.asyncFactory) || node.text === ' '
}

/*  */

function isAsyncPlaceholder (node) {
  return node.isComment && node.asyncFactory
}

/*  */

function normalizeScopedSlots (
  slots,
  normalSlots,
  prevSlots
) {
  var res;
  var hasNormalSlots = Object.keys(normalSlots).length > 0;
  var isStable = slots ? !!slots.$stable : !hasNormalSlots;
  var key = slots && slots.$key;
  if (!slots) {
    res = {};
  } else if (slots._normalized) {
    // fast path 1: child component re-render only, parent did not change
    return slots._normalized
  } else if (
    isStable &&
    prevSlots &&
    prevSlots !== emptyObject &&
    key === prevSlots.$key &&
    !hasNormalSlots &&
    !prevSlots.$hasNormal
  ) {
    // fast path 2: stable scoped slots w/ no normal slots to proxy,
    // only need to normalize once
    return prevSlots
  } else {
    res = {};
    for (var key$1 in slots) {
      if (slots[key$1] && key$1[0] !== '$') {
        res[key$1] = normalizeScopedSlot(normalSlots, key$1, slots[key$1]);
      }
    }
  }
  // expose normal slots on scopedSlots
  for (var key$2 in normalSlots) {
    if (!(key$2 in res)) {
      res[key$2] = proxyNormalSlot(normalSlots, key$2);
    }
  }
  // avoriaz seems to mock a non-extensible $scopedSlots object
  // and when that is passed down this would cause an error
  if (slots && Object.isExtensible(slots)) {
    (slots)._normalized = res;
  }
  def(res, '$stable', isStable);
  def(res, '$key', key);
  def(res, '$hasNormal', hasNormalSlots);
  return res
}

function normalizeScopedSlot(normalSlots, key, fn) {
  var normalized = function () {
    var res = arguments.length ? fn.apply(null, arguments) : fn({});
    res = res && typeof res === 'object' && !Array.isArray(res)
      ? [res] // single vnode
      : normalizeChildren(res);
    var vnode = res && res[0];
    return res && (
      !vnode ||
      (res.length === 1 && vnode.isComment && !isAsyncPlaceholder(vnode)) // #9658, #10391
    ) ? undefined
      : res
  };
  // this is a slot using the new v-slot syntax without scope. although it is
  // compiled as a scoped slot, render fn users would expect it to be present
  // on this.$slots because the usage is semantically a normal slot.
  if (fn.proxy) {
    Object.defineProperty(normalSlots, key, {
      get: normalized,
      enumerable: true,
      configurable: true
    });
  }
  return normalized
}

function proxyNormalSlot(slots, key) {
  return function () { return slots[key]; }
}

/*  */

/**
 * Runtime helper for rendering v-for lists.
 */
function renderList (
  val,
  render
) {
  var ret, i, l, keys, key;
  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length);
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i);
    }
  } else if (typeof val === 'number') {
    ret = new Array(val);
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i);
    }
  } else if (isObject(val)) {
    if (hasSymbol && val[Symbol.iterator]) {
      ret = [];
      var iterator = val[Symbol.iterator]();
      var result = iterator.next();
      while (!result.done) {
        ret.push(render(result.value, ret.length));
        result = iterator.next();
      }
    } else {
      keys = Object.keys(val);
      ret = new Array(keys.length);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[i] = render(val[key], key, i);
      }
    }
  }
  if (!isDef(ret)) {
    ret = [];
  }
  (ret)._isVList = true;
  return ret
}

/*  */

/**
 * Runtime helper for rendering <slot>
 */
function renderSlot (
  name,
  fallbackRender,
  props,
  bindObject
) {
  var scopedSlotFn = this.$scopedSlots[name];
  var nodes;
  if (scopedSlotFn) {
    // scoped slot
    props = props || {};
    if (bindObject) {
      if ( true && !isObject(bindObject)) {
        warn('slot v-bind without argument expects an Object', this);
      }
      props = extend(extend({}, bindObject), props);
    }
    nodes =
      scopedSlotFn(props) ||
      (typeof fallbackRender === 'function' ? fallbackRender() : fallbackRender);
  } else {
    nodes =
      this.$slots[name] ||
      (typeof fallbackRender === 'function' ? fallbackRender() : fallbackRender);
  }

  var target = props && props.slot;
  if (target) {
    return this.$createElement('template', { slot: target }, nodes)
  } else {
    return nodes
  }
}

/*  */

/**
 * Runtime helper for resolving filters
 */
function resolveFilter (id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity
}

/*  */

function isKeyNotMatch (expect, actual) {
  if (Array.isArray(expect)) {
    return expect.indexOf(actual) === -1
  } else {
    return expect !== actual
  }
}

/**
 * Runtime helper for checking keyCodes from config.
 * exposed as Vue.prototype._k
 * passing in eventKeyName as last argument separately for backwards compat
 */
function checkKeyCodes (
  eventKeyCode,
  key,
  builtInKeyCode,
  eventKeyName,
  builtInKeyName
) {
  var mappedKeyCode = config.keyCodes[key] || builtInKeyCode;
  if (builtInKeyName && eventKeyName && !config.keyCodes[key]) {
    return isKeyNotMatch(builtInKeyName, eventKeyName)
  } else if (mappedKeyCode) {
    return isKeyNotMatch(mappedKeyCode, eventKeyCode)
  } else if (eventKeyName) {
    return hyphenate(eventKeyName) !== key
  }
  return eventKeyCode === undefined
}

/*  */

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */
function bindObjectProps (
  data,
  tag,
  value,
  asProp,
  isSync
) {
  if (value) {
    if (!isObject(value)) {
       true && warn(
        'v-bind without argument expects an Object or Array value',
        this
      );
    } else {
      if (Array.isArray(value)) {
        value = toObject(value);
      }
      var hash;
      var loop = function ( key ) {
        if (
          key === 'class' ||
          key === 'style' ||
          isReservedAttribute(key)
        ) {
          hash = data;
        } else {
          var type = data.attrs && data.attrs.type;
          hash = asProp || config.mustUseProp(tag, type, key)
            ? data.domProps || (data.domProps = {})
            : data.attrs || (data.attrs = {});
        }
        var camelizedKey = camelize(key);
        var hyphenatedKey = hyphenate(key);
        if (!(camelizedKey in hash) && !(hyphenatedKey in hash)) {
          hash[key] = value[key];

          if (isSync) {
            var on = data.on || (data.on = {});
            on[("update:" + key)] = function ($event) {
              value[key] = $event;
            };
          }
        }
      };

      for (var key in value) loop( key );
    }
  }
  return data
}

/*  */

/**
 * Runtime helper for rendering static trees.
 */
function renderStatic (
  index,
  isInFor
) {
  var cached = this._staticTrees || (this._staticTrees = []);
  var tree = cached[index];
  // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree.
  if (tree && !isInFor) {
    return tree
  }
  // otherwise, render a fresh tree.
  tree = cached[index] = this.$options.staticRenderFns[index].call(
    this._renderProxy,
    null,
    this // for render fns generated for functional component templates
  );
  markStatic(tree, ("__static__" + index), false);
  return tree
}

/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */
function markOnce (
  tree,
  index,
  key
) {
  markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
  return tree
}

function markStatic (
  tree,
  key,
  isOnce
) {
  if (Array.isArray(tree)) {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== 'string') {
        markStaticNode(tree[i], (key + "_" + i), isOnce);
      }
    }
  } else {
    markStaticNode(tree, key, isOnce);
  }
}

function markStaticNode (node, key, isOnce) {
  node.isStatic = true;
  node.key = key;
  node.isOnce = isOnce;
}

/*  */

function bindObjectListeners (data, value) {
  if (value) {
    if (!isPlainObject(value)) {
       true && warn(
        'v-on without argument expects an Object value',
        this
      );
    } else {
      var on = data.on = data.on ? extend({}, data.on) : {};
      for (var key in value) {
        var existing = on[key];
        var ours = value[key];
        on[key] = existing ? [].concat(existing, ours) : ours;
      }
    }
  }
  return data
}

/*  */

function resolveScopedSlots (
  fns, // see flow/vnode
  res,
  // the following are added in 2.6
  hasDynamicKeys,
  contentHashKey
) {
  res = res || { $stable: !hasDynamicKeys };
  for (var i = 0; i < fns.length; i++) {
    var slot = fns[i];
    if (Array.isArray(slot)) {
      resolveScopedSlots(slot, res, hasDynamicKeys);
    } else if (slot) {
      // marker for reverse proxying v-slot without scope on this.$slots
      if (slot.proxy) {
        slot.fn.proxy = true;
      }
      res[slot.key] = slot.fn;
    }
  }
  if (contentHashKey) {
    (res).$key = contentHashKey;
  }
  return res
}

/*  */

function bindDynamicKeys (baseObj, values) {
  for (var i = 0; i < values.length; i += 2) {
    var key = values[i];
    if (typeof key === 'string' && key) {
      baseObj[values[i]] = values[i + 1];
    } else if ( true && key !== '' && key !== null) {
      // null is a special value for explicitly removing a binding
      warn(
        ("Invalid value for dynamic directive argument (expected string or null): " + key),
        this
      );
    }
  }
  return baseObj
}

// helper to dynamically append modifier runtime markers to event names.
// ensure only append when value is already string, otherwise it will be cast
// to string and cause the type check to miss.
function prependModifier (value, symbol) {
  return typeof value === 'string' ? symbol + value : value
}

/*  */

function installRenderHelpers (target) {
  target._o = markOnce;
  target._n = toNumber;
  target._s = toString;
  target._l = renderList;
  target._t = renderSlot;
  target._q = looseEqual;
  target._i = looseIndexOf;
  target._m = renderStatic;
  target._f = resolveFilter;
  target._k = checkKeyCodes;
  target._b = bindObjectProps;
  target._v = createTextVNode;
  target._e = createEmptyVNode;
  target._u = resolveScopedSlots;
  target._g = bindObjectListeners;
  target._d = bindDynamicKeys;
  target._p = prependModifier;
}

/*  */

function FunctionalRenderContext (
  data,
  props,
  children,
  parent,
  Ctor
) {
  var this$1 = this;

  var options = Ctor.options;
  // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check
  var contextVm;
  if (hasOwn(parent, '_uid')) {
    contextVm = Object.create(parent);
    // $flow-disable-line
    contextVm._original = parent;
  } else {
    // the context vm passed in is a functional context as well.
    // in this case we want to make sure we are able to get a hold to the
    // real context instance.
    contextVm = parent;
    // $flow-disable-line
    parent = parent._original;
  }
  var isCompiled = isTrue(options._compiled);
  var needNormalization = !isCompiled;

  this.data = data;
  this.props = props;
  this.children = children;
  this.parent = parent;
  this.listeners = data.on || emptyObject;
  this.injections = resolveInject(options.inject, parent);
  this.slots = function () {
    if (!this$1.$slots) {
      normalizeScopedSlots(
        data.scopedSlots,
        this$1.$slots = resolveSlots(children, parent)
      );
    }
    return this$1.$slots
  };

  Object.defineProperty(this, 'scopedSlots', ({
    enumerable: true,
    get: function get () {
      return normalizeScopedSlots(data.scopedSlots, this.slots())
    }
  }));

  // support for compiled functional template
  if (isCompiled) {
    // exposing $options for renderStatic()
    this.$options = options;
    // pre-resolve slots for renderSlot()
    this.$slots = this.slots();
    this.$scopedSlots = normalizeScopedSlots(data.scopedSlots, this.$slots);
  }

  if (options._scopeId) {
    this._c = function (a, b, c, d) {
      var vnode = createElement(contextVm, a, b, c, d, needNormalization);
      if (vnode && !Array.isArray(vnode)) {
        vnode.fnScopeId = options._scopeId;
        vnode.fnContext = parent;
      }
      return vnode
    };
  } else {
    this._c = function (a, b, c, d) { return createElement(contextVm, a, b, c, d, needNormalization); };
  }
}

installRenderHelpers(FunctionalRenderContext.prototype);

function createFunctionalComponent (
  Ctor,
  propsData,
  data,
  contextVm,
  children
) {
  var options = Ctor.options;
  var props = {};
  var propOptions = options.props;
  if (isDef(propOptions)) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData || emptyObject);
    }
  } else {
    if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
    if (isDef(data.props)) { mergeProps(props, data.props); }
  }

  var renderContext = new FunctionalRenderContext(
    data,
    props,
    children,
    contextVm,
    Ctor
  );

  var vnode = options.render.call(null, renderContext._c, renderContext);

  if (vnode instanceof VNode) {
    return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options, renderContext)
  } else if (Array.isArray(vnode)) {
    var vnodes = normalizeChildren(vnode) || [];
    var res = new Array(vnodes.length);
    for (var i = 0; i < vnodes.length; i++) {
      res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options, renderContext);
    }
    return res
  }
}

function cloneAndMarkFunctionalResult (vnode, data, contextVm, options, renderContext) {
  // #7817 clone node before setting fnContext, otherwise if the node is reused
  // (e.g. it was from a cached normal slot) the fnContext causes named slots
  // that should not be matched to match.
  var clone = cloneVNode(vnode);
  clone.fnContext = contextVm;
  clone.fnOptions = options;
  if (true) {
    (clone.devtoolsMeta = clone.devtoolsMeta || {}).renderContext = renderContext;
  }
  if (data.slot) {
    (clone.data || (clone.data = {})).slot = data.slot;
  }
  return clone
}

function mergeProps (to, from) {
  for (var key in from) {
    to[camelize(key)] = from[key];
  }
}

/*  */

/*  */

/*  */

/*  */

// inline hooks to be invoked on component VNodes during patch
var componentVNodeHooks = {
  init: function init (vnode, hydrating) {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    } else {
      var child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      );
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    }
  },

  prepatch: function prepatch (oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    );
  },

  insert: function insert (vnode) {
    var context = vnode.context;
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true;
      callHook(componentInstance, 'mounted');
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true /* direct */);
      }
    }
  },

  destroy: function destroy (vnode) {
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true /* direct */);
      }
    }
  }
};

var hooksToMerge = Object.keys(componentVNodeHooks);

function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (isUndef(Ctor)) {
    return
  }

  var baseCtor = context.$options._base;

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    if (true) {
      warn(("Invalid Component definition: " + (String(Ctor))), context);
    }
    return
  }

  // async component
  var asyncFactory;
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor);
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }

  data = data || {};

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  }

  // extract props
  var propsData = extractPropsFromVNodeData(data, Ctor, tag);

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on;
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    var slot = data.slot;
    data = {};
    if (slot) {
      data.slot = slot;
    }
  }

  // install component management hooks onto the placeholder node
  installComponentHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode(
    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
    data, undefined, undefined, undefined, context,
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
    asyncFactory
  );

  return vnode
}

function createComponentInstanceForVnode (
  // we know it's MountedComponentVNode but flow doesn't
  vnode,
  // activeInstance in lifecycle state
  parent
) {
  var options = {
    _isComponent: true,
    _parentVnode: vnode,
    parent: parent
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnode.componentOptions.Ctor(options)
}

function installComponentHooks (data) {
  var hooks = data.hook || (data.hook = {});
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    var existing = hooks[key];
    var toMerge = componentVNodeHooks[key];
    if (existing !== toMerge && !(existing && existing._merged)) {
      hooks[key] = existing ? mergeHook$1(toMerge, existing) : toMerge;
    }
  }
}

function mergeHook$1 (f1, f2) {
  var merged = function (a, b) {
    // flow complains about extra args which is why we use any
    f1(a, b);
    f2(a, b);
  };
  merged._merged = true;
  return merged
}

// transform component v-model info (value and callback) into
// prop and event handler respectively.
function transformModel (options, data) {
  var prop = (options.model && options.model.prop) || 'value';
  var event = (options.model && options.model.event) || 'input'
  ;(data.attrs || (data.attrs = {}))[prop] = data.model.value;
  var on = data.on || (data.on = {});
  var existing = on[event];
  var callback = data.model.callback;
  if (isDef(existing)) {
    if (
      Array.isArray(existing)
        ? existing.indexOf(callback) === -1
        : existing !== callback
    ) {
      on[event] = [callback].concat(existing);
    }
  } else {
    on[event] = callback;
  }
}

/*  */

var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2;

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement (
  context,
  tag,
  data,
  children,
  normalizationType,
  alwaysNormalize
) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(context, tag, data, children, normalizationType)
}

function _createElement (
  context,
  tag,
  data,
  children,
  normalizationType
) {
  if (isDef(data) && isDef((data).__ob__)) {
     true && warn(
      "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
      'Always create fresh vnode data objects in each render!',
      context
    );
    return createEmptyVNode()
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is;
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if ( true &&
    isDef(data) && isDef(data.key) && !isPrimitive(data.key)
  ) {
    {
      warn(
        'Avoid using non-primitive value as key, ' +
        'use string/number value instead.',
        context
      );
    }
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      if ( true && isDef(data) && isDef(data.nativeOn) && data.tag !== 'component') {
        warn(
          ("The .native modifier for v-on is only valid on components but it was used on <" + tag + ">."),
          context
        );
      }
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      );
    } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      );
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  if (Array.isArray(vnode)) {
    return vnode
  } else if (isDef(vnode)) {
    if (isDef(ns)) { applyNS(vnode, ns); }
    if (isDef(data)) { registerDeepBindings(data); }
    return vnode
  } else {
    return createEmptyVNode()
  }
}

function applyNS (vnode, ns, force) {
  vnode.ns = ns;
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    ns = undefined;
    force = true;
  }
  if (isDef(vnode.children)) {
    for (var i = 0, l = vnode.children.length; i < l; i++) {
      var child = vnode.children[i];
      if (isDef(child.tag) && (
        isUndef(child.ns) || (isTrue(force) && child.tag !== 'svg'))) {
        applyNS(child, ns, force);
      }
    }
  }
}

// ref #5318
// necessary to ensure parent re-render when deep bindings like :style and
// :class are used on slot nodes
function registerDeepBindings (data) {
  if (isObject(data.style)) {
    traverse(data.style);
  }
  if (isObject(data.class)) {
    traverse(data.class);
  }
}

/*  */

function initRender (vm) {
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null; // v-once cached trees
  var options = vm.$options;
  var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
  var renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject;
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  var parentData = parentVnode && parentVnode.data;

  /* istanbul ignore else */
  if (true) {
    defineReactive$$1(vm, '$attrs', parentData && parentData.attrs || emptyObject, function () {
      !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
    }, true);
    defineReactive$$1(vm, '$listeners', options._parentListeners || emptyObject, function () {
      !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
    }, true);
  } else {}
}

var currentRenderingInstance = null;

function renderMixin (Vue) {
  // install runtime convenience helpers
  installRenderHelpers(Vue.prototype);

  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var _parentVnode = ref._parentVnode;

    if (_parentVnode) {
      vm.$scopedSlots = normalizeScopedSlots(
        _parentVnode.data.scopedSlots,
        vm.$slots,
        vm.$scopedSlots
      );
    }

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      // There's no need to maintain a stack because all render fns are called
      // separately from one another. Nested component's render fns are called
      // when parent component is patched.
      currentRenderingInstance = vm;
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      handleError(e, vm, "render");
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      if ( true && vm.$options.renderError) {
        try {
          vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
        } catch (e) {
          handleError(e, vm, "renderError");
          vnode = vm._vnode;
        }
      } else {
        vnode = vm._vnode;
      }
    } finally {
      currentRenderingInstance = null;
    }
    // if the returned array contains only a single node, allow it
    if (Array.isArray(vnode) && vnode.length === 1) {
      vnode = vnode[0];
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if ( true && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        );
      }
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode
  };
}

/*  */

function ensureCtor (comp, base) {
  if (
    comp.__esModule ||
    (hasSymbol && comp[Symbol.toStringTag] === 'Module')
  ) {
    comp = comp.default;
  }
  return isObject(comp)
    ? base.extend(comp)
    : comp
}

function createAsyncPlaceholder (
  factory,
  data,
  context,
  children,
  tag
) {
  var node = createEmptyVNode();
  node.asyncFactory = factory;
  node.asyncMeta = { data: data, context: context, children: children, tag: tag };
  return node
}

function resolveAsyncComponent (
  factory,
  baseCtor
) {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp
  }

  if (isDef(factory.resolved)) {
    return factory.resolved
  }

  var owner = currentRenderingInstance;
  if (owner && isDef(factory.owners) && factory.owners.indexOf(owner) === -1) {
    // already pending
    factory.owners.push(owner);
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp
  }

  if (owner && !isDef(factory.owners)) {
    var owners = factory.owners = [owner];
    var sync = true;
    var timerLoading = null;
    var timerTimeout = null

    ;(owner).$on('hook:destroyed', function () { return remove(owners, owner); });

    var forceRender = function (renderCompleted) {
      for (var i = 0, l = owners.length; i < l; i++) {
        (owners[i]).$forceUpdate();
      }

      if (renderCompleted) {
        owners.length = 0;
        if (timerLoading !== null) {
          clearTimeout(timerLoading);
          timerLoading = null;
        }
        if (timerTimeout !== null) {
          clearTimeout(timerTimeout);
          timerTimeout = null;
        }
      }
    };

    var resolve = once(function (res) {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor);
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        forceRender(true);
      } else {
        owners.length = 0;
      }
    });

    var reject = once(function (reason) {
       true && warn(
        "Failed to resolve async component: " + (String(factory)) +
        (reason ? ("\nReason: " + reason) : '')
      );
      if (isDef(factory.errorComp)) {
        factory.error = true;
        forceRender(true);
      }
    });

    var res = factory(resolve, reject);

    if (isObject(res)) {
      if (isPromise(res)) {
        // () => Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject);
        }
      } else if (isPromise(res.component)) {
        res.component.then(resolve, reject);

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor);
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor);
          if (res.delay === 0) {
            factory.loading = true;
          } else {
            timerLoading = setTimeout(function () {
              timerLoading = null;
              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true;
                forceRender(false);
              }
            }, res.delay || 200);
          }
        }

        if (isDef(res.timeout)) {
          timerTimeout = setTimeout(function () {
            timerTimeout = null;
            if (isUndef(factory.resolved)) {
              reject(
                 true
                  ? ("timeout (" + (res.timeout) + "ms)")
                  : 0
              );
            }
          }, res.timeout);
        }
      }
    }

    sync = false;
    // return in case resolved synchronously
    return factory.loading
      ? factory.loadingComp
      : factory.resolved
  }
}

/*  */

function getFirstComponentChild (children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
        return c
      }
    }
  }
}

/*  */

/*  */

function initEvents (vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

var target;

function add (event, fn) {
  target.$on(event, fn);
}

function remove$1 (event, fn) {
  target.$off(event, fn);
}

function createOnceHandler (event, fn) {
  var _target = target;
  return function onceHandler () {
    var res = fn.apply(null, arguments);
    if (res !== null) {
      _target.$off(event, onceHandler);
    }
  }
}

function updateComponentListeners (
  vm,
  listeners,
  oldListeners
) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add, remove$1, createOnceHandler, vm);
  target = undefined;
}

function eventsMixin (Vue) {
  var hookRE = /^hook:/;
  Vue.prototype.$on = function (event, fn) {
    var vm = this;
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        vm.$on(event[i], fn);
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn);
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }
    return vm
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on () {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm
  };

  Vue.prototype.$off = function (event, fn) {
    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
        vm.$off(event[i$1], fn);
      }
      return vm
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm
    }
    if (!fn) {
      vm._events[event] = null;
      return vm
    }
    // specific handler
    var cb;
    var i = cbs.length;
    while (i--) {
      cb = cbs[i];
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1);
        break
      }
    }
    return vm
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;
    if (true) {
      var lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          "Event \"" + lowerCaseEvent + "\" is emitted in component " +
          (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
          "Note that HTML attributes are case-insensitive and you cannot use " +
          "v-on to listen to camelCase events when using in-DOM templates. " +
          "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
        );
      }
    }
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      var info = "event handler for \"" + event + "\"";
      for (var i = 0, l = cbs.length; i < l; i++) {
        invokeWithErrorHandling(cbs[i], vm, args, vm, info);
      }
    }
    return vm
  };
}

/*  */

var activeInstance = null;
var isUpdatingChildComponent = false;

function setActiveInstance(vm) {
  var prevActiveInstance = activeInstance;
  activeInstance = vm;
  return function () {
    activeInstance = prevActiveInstance;
  }
}

function initLifecycle (vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    var prevEl = vm.$el;
    var prevVnode = vm._vnode;
    var restoreActiveInstance = setActiveInstance(vm);
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    restoreActiveInstance();
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
    // fire destroyed hook
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
    // release circular reference (#6759)
    if (vm.$vnode) {
      vm.$vnode.parent = null;
    }
  };
}

function mountComponent (
  vm,
  el,
  hydrating
) {
  vm.$el = el;
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode;
    if (true) {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        );
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        );
      }
    }
  }
  callHook(vm, 'beforeMount');

  var updateComponent;
  /* istanbul ignore if */
  if ( true && config.performance && mark) {
    updateComponent = function () {
      var name = vm._name;
      var id = vm._uid;
      var startTag = "vue-perf-start:" + id;
      var endTag = "vue-perf-end:" + id;

      mark(startTag);
      var vnode = vm._render();
      mark(endTag);
      measure(("vue " + name + " render"), startTag, endTag);

      mark(startTag);
      vm._update(vnode, hydrating);
      mark(endTag);
      measure(("vue " + name + " patch"), startTag, endTag);
    };
  } else {
    updateComponent = function () {
      vm._update(vm._render(), hydrating);
    };
  }

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(vm, updateComponent, noop, {
    before: function before () {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate');
      }
    }
  }, true /* isRenderWatcher */);
  hydrating = false;

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true;
    callHook(vm, 'mounted');
  }
  return vm
}

function updateChildComponent (
  vm,
  propsData,
  listeners,
  parentVnode,
  renderChildren
) {
  if (true) {
    isUpdatingChildComponent = true;
  }

  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren.

  // check if there are dynamic scopedSlots (hand-written or compiled but with
  // dynamic slot names). Static scoped slots compiled from template has the
  // "$stable" marker.
  var newScopedSlots = parentVnode.data.scopedSlots;
  var oldScopedSlots = vm.$scopedSlots;
  var hasDynamicScopedSlot = !!(
    (newScopedSlots && !newScopedSlots.$stable) ||
    (oldScopedSlots !== emptyObject && !oldScopedSlots.$stable) ||
    (newScopedSlots && vm.$scopedSlots.$key !== newScopedSlots.$key) ||
    (!newScopedSlots && vm.$scopedSlots.$key)
  );

  // Any static slot children from the parent may have changed during parent's
  // update. Dynamic scoped slots may also have changed. In such cases, a forced
  // update is necessary to ensure correctness.
  var needsForceUpdate = !!(
    renderChildren ||               // has new static slots
    vm.$options._renderChildren ||  // has old static slots
    hasDynamicScopedSlot
  );

  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render

  if (vm._vnode) { // update child tree's parent
    vm._vnode.parent = parentVnode;
  }
  vm.$options._renderChildren = renderChildren;

  // update $attrs and $listeners hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  vm.$attrs = parentVnode.data.attrs || emptyObject;
  vm.$listeners = listeners || emptyObject;

  // update props
  if (propsData && vm.$options.props) {
    toggleObserving(false);
    var props = vm._props;
    var propKeys = vm.$options._propKeys || [];
    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      var propOptions = vm.$options.props; // wtf flow?
      props[key] = validateProp(key, propOptions, propsData, vm);
    }
    toggleObserving(true);
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }

  // update listeners
  listeners = listeners || emptyObject;
  var oldListeners = vm.$options._parentListeners;
  vm.$options._parentListeners = listeners;
  updateComponentListeners(vm, listeners, oldListeners);

  // resolve slots + force update if has children
  if (needsForceUpdate) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }

  if (true) {
    isUpdatingChildComponent = false;
  }
}

function isInInactiveTree (vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) { return true }
  }
  return false
}

function activateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = false;
    if (isInInactiveTree(vm)) {
      return
    }
  } else if (vm._directInactive) {
    return
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false;
    for (var i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'activated');
  }
}

function deactivateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = true;
    if (isInInactiveTree(vm)) {
      return
    }
  }
  if (!vm._inactive) {
    vm._inactive = true;
    for (var i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'deactivated');
  }
}

function callHook (vm, hook) {
  // #7573 disable dep collection when invoking lifecycle hooks
  pushTarget();
  var handlers = vm.$options[hook];
  var info = hook + " hook";
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      invokeWithErrorHandling(handlers[i], vm, null, vm, info);
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }
  popTarget();
}

/*  */

var MAX_UPDATE_COUNT = 100;

var queue = [];
var activatedChildren = [];
var has = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0;
  has = {};
  if (true) {
    circular = {};
  }
  waiting = flushing = false;
}

// Async edge case #6566 requires saving the timestamp when event listeners are
// attached. However, calling performance.now() has a perf overhead especially
// if the page has thousands of event listeners. Instead, we take a timestamp
// every time the scheduler flushes and use that for all event listeners
// attached during that flush.
var currentFlushTimestamp = 0;

// Async edge case fix requires storing an event listener's attach timestamp.
var getNow = Date.now;

// Determine what event timestamp the browser is using. Annoyingly, the
// timestamp can either be hi-res (relative to page load) or low-res
// (relative to UNIX epoch), so in order to compare time we have to use the
// same timestamp type when saving the flush timestamp.
// All IE versions use low-res event timestamps, and have problematic clock
// implementations (#9632)
if (inBrowser && !isIE) {
  var performance = window.performance;
  if (
    performance &&
    typeof performance.now === 'function' &&
    getNow() > document.createEvent('Event').timeStamp
  ) {
    // if the event timestamp, although evaluated AFTER the Date.now(), is
    // smaller than it, it means the event is using a hi-res timestamp,
    // and we need to use the hi-res version for event listener timestamps as
    // well.
    getNow = function () { return performance.now(); };
  }
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  currentFlushTimestamp = getNow();
  flushing = true;
  var watcher, id;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) { return a.id - b.id; });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    if (watcher.before) {
      watcher.before();
    }
    id = watcher.id;
    has[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if ( true && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? ("in watcher with expression \"" + (watcher.expression) + "\"")
              : "in a component render function."
          ),
          watcher.vm
        );
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  var activatedQueue = activatedChildren.slice();
  var updatedQueue = queue.slice();

  resetSchedulerState();

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue);

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }
}

function callUpdatedHooks (queue) {
  var i = queue.length;
  while (i--) {
    var watcher = queue[i];
    var vm = watcher.vm;
    if (vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
      callHook(vm, 'updated');
    }
  }
}

/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
function queueActivatedComponent (vm) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false;
  activatedChildren.push(vm);
}

function callActivatedHooks (queue) {
  for (var i = 0; i < queue.length; i++) {
    queue[i]._inactive = true;
    activateChildComponent(queue[i], true /* true */);
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;

      if ( true && !config.async) {
        flushSchedulerQueue();
        return
      }
      nextTick(flushSchedulerQueue);
    }
  }
}

/*  */



var uid$2 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options,
  isRenderWatcher
) {
  this.vm = vm;
  if (isRenderWatcher) {
    vm._watcher = this;
  }
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
    this.before = options.before;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid$2; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression =  true
    ? expOrFn.toString()
    : 0;
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = noop;
       true && warn(
        "Failed watching path: \"" + expOrFn + "\" " +
        'Watcher only accepts simple dot-delimited paths. ' +
        'For full control, use a function instead.',
        vm
      );
    }
  }
  this.value = this.lazy
    ? undefined
    : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get () {
  pushTarget(this);
  var value;
  var vm = this.vm;
  try {
    value = this.getter.call(vm, vm);
  } catch (e) {
    if (this.user) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
    } else {
      throw e
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }
    popTarget();
    this.cleanupDeps();
  }
  return value
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
  var i = this.deps.length;
  while (i--) {
    var dep = this.deps[i];
    if (!this.newDepIds.has(dep.id)) {
      dep.removeSub(this);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        var info = "callback for watcher \"" + (this.expression) + "\"";
        invokeWithErrorHandling(this.cb, this.vm, [value, oldValue], this.vm, info);
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend () {
  var i = this.deps.length;
  while (i--) {
    this.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subscriber list.
 */
Watcher.prototype.teardown = function teardown () {
  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this.deps[i].removeSub(this);
    }
    this.active = false;
  }
};

/*  */

var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  };
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initState (vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) { initProps(vm, opts.props); }
  if (opts.methods) { initMethods(vm, opts.methods); }
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) { initComputed(vm, opts.computed); }
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}

function initProps (vm, propsOptions) {
  var propsData = vm.$options.propsData || {};
  var props = vm._props = {};
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  var keys = vm.$options._propKeys = [];
  var isRoot = !vm.$parent;
  // root instance props should be converted
  if (!isRoot) {
    toggleObserving(false);
  }
  var loop = function ( key ) {
    keys.push(key);
    var value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    if (true) {
      var hyphenatedKey = hyphenate(key);
      if (isReservedAttribute(hyphenatedKey) ||
          config.isReservedAttr(hyphenatedKey)) {
        warn(
          ("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop."),
          vm
        );
      }
      defineReactive$$1(props, key, value, function () {
        if (!isRoot && !isUpdatingChildComponent) {
          warn(
            "Avoid mutating a prop directly since the value will be " +
            "overwritten whenever the parent component re-renders. " +
            "Instead, use a data or computed property based on the prop's " +
            "value. Prop being mutated: \"" + key + "\"",
            vm
          );
        }
      });
    } else {}
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, "_props", key);
    }
  };

  for (var key in propsOptions) loop( key );
  toggleObserving(true);
}

function initData (vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};
  if (!isPlainObject(data)) {
    data = {};
     true && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var methods = vm.$options.methods;
  var i = keys.length;
  while (i--) {
    var key = keys[i];
    if (true) {
      if (methods && hasOwn(methods, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a data property."),
          vm
        );
      }
    }
    if (props && hasOwn(props, key)) {
       true && warn(
        "The data property \"" + key + "\" is already declared as a prop. " +
        "Use prop default value instead.",
        vm
      );
    } else if (!isReserved(key)) {
      proxy(vm, "_data", key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}

function getData (data, vm) {
  // #7573 disable dep collection when invoking data getters
  pushTarget();
  try {
    return data.call(vm, vm)
  } catch (e) {
    handleError(e, vm, "data()");
    return {}
  } finally {
    popTarget();
  }
}

var computedWatcherOptions = { lazy: true };

function initComputed (vm, computed) {
  // $flow-disable-line
  var watchers = vm._computedWatchers = Object.create(null);
  // computed properties are just getters during SSR
  var isSSR = isServerRendering();

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;
    if ( true && getter == null) {
      warn(
        ("Getter is missing for computed property \"" + key + "\"."),
        vm
      );
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      );
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else if (true) {
      if (key in vm.$data) {
        warn(("The computed property \"" + key + "\" is already defined in data."), vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
      } else if (vm.$options.methods && key in vm.$options.methods) {
        warn(("The computed property \"" + key + "\" is already defined as a method."), vm);
      }
    }
  }
}

function defineComputed (
  target,
  key,
  userDef
) {
  var shouldCache = !isServerRendering();
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : createGetterInvoker(userDef);
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get)
      : noop;
    sharedPropertyDefinition.set = userDef.set || noop;
  }
  if ( true &&
      sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn(
        ("Computed property \"" + key + "\" was assigned to but it has no setter."),
        this
      );
    };
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter (key) {
  return function computedGetter () {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.target) {
        watcher.depend();
      }
      return watcher.value
    }
  }
}

function createGetterInvoker(fn) {
  return function computedGetter () {
    return fn.call(this, this)
  }
}

function initMethods (vm, methods) {
  var props = vm.$options.props;
  for (var key in methods) {
    if (true) {
      if (typeof methods[key] !== 'function') {
        warn(
          "Method \"" + key + "\" has type \"" + (typeof methods[key]) + "\" in the component definition. " +
          "Did you reference the function correctly?",
          vm
        );
      }
      if (props && hasOwn(props, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a prop."),
          vm
        );
      }
      if ((key in vm) && isReserved(key)) {
        warn(
          "Method \"" + key + "\" conflicts with an existing Vue instance method. " +
          "Avoid defining component methods that start with _ or $."
        );
      }
    }
    vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm);
  }
}

function initWatch (vm, watch) {
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher (
  vm,
  expOrFn,
  handler,
  options
) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(expOrFn, handler, options)
}

function stateMixin (Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};
  dataDef.get = function () { return this._data };
  var propsDef = {};
  propsDef.get = function () { return this._props };
  if (true) {
    dataDef.set = function () {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      );
    };
    propsDef.set = function () {
      warn("$props is readonly.", this);
    };
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef);
  Object.defineProperty(Vue.prototype, '$props', propsDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this;
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      var info = "callback for immediate watcher \"" + (watcher.expression) + "\"";
      pushTarget();
      invokeWithErrorHandling(cb, vm, [watcher.value], vm, info);
      popTarget();
    }
    return function unwatchFn () {
      watcher.teardown();
    }
  };
}

/*  */

var uid$3 = 0;

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid$3++;

    var startTag, endTag;
    /* istanbul ignore if */
    if ( true && config.performance && mark) {
      startTag = "vue-perf-start:" + (vm._uid);
      endTag = "vue-perf-end:" + (vm._uid);
      mark(startTag);
    }

    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    if (true) {
      initProxy(vm);
    } else {}
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    initInjections(vm); // resolve injections before data/props
    initState(vm);
    initProvide(vm); // resolve provide after data/props
    callHook(vm, 'created');

    /* istanbul ignore if */
    if ( true && config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure(("vue " + (vm._name) + " init"), startTag, endTag);
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

function initInternalComponent (vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options);
  // doing this because it's faster than dynamic enumeration.
  var parentVnode = options._parentVnode;
  opts.parent = options.parent;
  opts._parentVnode = parentVnode;

  var vnodeComponentOptions = parentVnode.componentOptions;
  opts.propsData = vnodeComponentOptions.propsData;
  opts._parentListeners = vnodeComponentOptions.listeners;
  opts._renderChildren = vnodeComponentOptions.children;
  opts._componentTag = vnodeComponentOptions.tag;

  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions (Ctor) {
  var options = Ctor.options;
  if (Ctor.super) {
    var superOptions = resolveConstructorOptions(Ctor.super);
    var cachedSuperOptions = Ctor.superOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      var modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor) {
  var modified;
  var latest = Ctor.options;
  var sealed = Ctor.sealedOptions;
  for (var key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) { modified = {}; }
      modified[key] = latest[key];
    }
  }
  return modified
}

function Vue (options) {
  if ( true &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

initMixin(Vue);
stateMixin(Vue);
eventsMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);

/*  */

function initUse (Vue) {
  Vue.use = function (plugin) {
    var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this
  };
}

/*  */

function initMixin$1 (Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this
  };
}

/*  */

function initExtend (Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    var name = extendOptions.name || Super.options.name;
    if ( true && name) {
      validateComponentName(name);
    }

    var Sub = function VueComponent (options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );
    Sub['super'] = Super;

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps$1(Sub);
    }
    if (Sub.options.computed) {
      initComputed$1(Sub);
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    Sub.sealedOptions = extend({}, Sub.options);

    // cache constructor
    cachedCtors[SuperId] = Sub;
    return Sub
  };
}

function initProps$1 (Comp) {
  var props = Comp.options.props;
  for (var key in props) {
    proxy(Comp.prototype, "_props", key);
  }
}

function initComputed$1 (Comp) {
  var computed = Comp.options.computed;
  for (var key in computed) {
    defineComputed(Comp.prototype, key, computed[key]);
  }
}

/*  */

function initAssetRegisters (Vue) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(function (type) {
    Vue[type] = function (
      id,
      definition
    ) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if ( true && type === 'component') {
          validateComponentName(id);
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition
      }
    };
  });
}

/*  */





function getComponentName (opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

function matches (pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function pruneCache (keepAliveInstance, filter) {
  var cache = keepAliveInstance.cache;
  var keys = keepAliveInstance.keys;
  var _vnode = keepAliveInstance._vnode;
  for (var key in cache) {
    var entry = cache[key];
    if (entry) {
      var name = entry.name;
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode);
      }
    }
  }
}

function pruneCacheEntry (
  cache,
  key,
  keys,
  current
) {
  var entry = cache[key];
  if (entry && (!current || entry.tag !== current.tag)) {
    entry.componentInstance.$destroy();
  }
  cache[key] = null;
  remove(keys, key);
}

var patternTypes = [String, RegExp, Array];

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  methods: {
    cacheVNode: function cacheVNode() {
      var ref = this;
      var cache = ref.cache;
      var keys = ref.keys;
      var vnodeToCache = ref.vnodeToCache;
      var keyToCache = ref.keyToCache;
      if (vnodeToCache) {
        var tag = vnodeToCache.tag;
        var componentInstance = vnodeToCache.componentInstance;
        var componentOptions = vnodeToCache.componentOptions;
        cache[keyToCache] = {
          name: getComponentName(componentOptions),
          tag: tag,
          componentInstance: componentInstance,
        };
        keys.push(keyToCache);
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode);
        }
        this.vnodeToCache = null;
      }
    }
  },

  created: function created () {
    this.cache = Object.create(null);
    this.keys = [];
  },

  destroyed: function destroyed () {
    for (var key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys);
    }
  },

  mounted: function mounted () {
    var this$1 = this;

    this.cacheVNode();
    this.$watch('include', function (val) {
      pruneCache(this$1, function (name) { return matches(val, name); });
    });
    this.$watch('exclude', function (val) {
      pruneCache(this$1, function (name) { return !matches(val, name); });
    });
  },

  updated: function updated () {
    this.cacheVNode();
  },

  render: function render () {
    var slot = this.$slots.default;
    var vnode = getFirstComponentChild(slot);
    var componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      // check pattern
      var name = getComponentName(componentOptions);
      var ref = this;
      var include = ref.include;
      var exclude = ref.exclude;
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      var ref$1 = this;
      var cache = ref$1.cache;
      var keys = ref$1.keys;
      var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
        : vnode.key;
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance;
        // make current key freshest
        remove(keys, key);
        keys.push(key);
      } else {
        // delay setting the cache until update
        this.vnodeToCache = vnode;
        this.keyToCache = key;
      }

      vnode.data.keepAlive = true;
    }
    return vnode || (slot && slot[0])
  }
};

var builtInComponents = {
  KeepAlive: KeepAlive
};

/*  */

function initGlobalAPI (Vue) {
  // config
  var configDef = {};
  configDef.get = function () { return config; };
  if (true) {
    configDef.set = function () {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      );
    };
  }
  Object.defineProperty(Vue, 'config', configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn: warn,
    extend: extend,
    mergeOptions: mergeOptions,
    defineReactive: defineReactive$$1
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  // 2.6 explicit observable API
  Vue.observable = function (obj) {
    observe(obj);
    return obj
  };

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue);

Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering
});

Object.defineProperty(Vue.prototype, '$ssrContext', {
  get: function get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
});

// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, 'FunctionalRenderContext', {
  value: FunctionalRenderContext
});

Vue.version = '2.6.14';

/*  */

// these are reserved for web because they are directly compiled away
// during template compilation
var isReservedAttr = makeMap('style,class');

// attributes that should be using props for binding
var acceptValue = makeMap('input,textarea,option,select,progress');
var mustUseProp = function (tag, type, attr) {
  return (
    (attr === 'value' && acceptValue(tag)) && type !== 'button' ||
    (attr === 'selected' && tag === 'option') ||
    (attr === 'checked' && tag === 'input') ||
    (attr === 'muted' && tag === 'video')
  )
};

var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');

var isValidContentEditableValue = makeMap('events,caret,typing,plaintext-only');

var convertEnumeratedValue = function (key, value) {
  return isFalsyAttrValue(value) || value === 'false'
    ? 'false'
    // allow arbitrary string value for contenteditable
    : key === 'contenteditable' && isValidContentEditableValue(value)
      ? value
      : 'true'
};

var isBooleanAttr = makeMap(
  'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
  'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
  'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
  'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
  'required,reversed,scoped,seamless,selected,sortable,' +
  'truespeed,typemustmatch,visible'
);

var xlinkNS = 'http://www.w3.org/1999/xlink';

var isXlink = function (name) {
  return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink'
};

var getXlinkProp = function (name) {
  return isXlink(name) ? name.slice(6, name.length) : ''
};

var isFalsyAttrValue = function (val) {
  return val == null || val === false
};

/*  */

function genClassForVnode (vnode) {
  var data = vnode.data;
  var parentNode = vnode;
  var childNode = vnode;
  while (isDef(childNode.componentInstance)) {
    childNode = childNode.componentInstance._vnode;
    if (childNode && childNode.data) {
      data = mergeClassData(childNode.data, data);
    }
  }
  while (isDef(parentNode = parentNode.parent)) {
    if (parentNode && parentNode.data) {
      data = mergeClassData(data, parentNode.data);
    }
  }
  return renderClass(data.staticClass, data.class)
}

function mergeClassData (child, parent) {
  return {
    staticClass: concat(child.staticClass, parent.staticClass),
    class: isDef(child.class)
      ? [child.class, parent.class]
      : parent.class
  }
}

function renderClass (
  staticClass,
  dynamicClass
) {
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  /* istanbul ignore next */
  return ''
}

function concat (a, b) {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}

function stringifyClass (value) {
  if (Array.isArray(value)) {
    return stringifyArray(value)
  }
  if (isObject(value)) {
    return stringifyObject(value)
  }
  if (typeof value === 'string') {
    return value
  }
  /* istanbul ignore next */
  return ''
}

function stringifyArray (value) {
  var res = '';
  var stringified;
  for (var i = 0, l = value.length; i < l; i++) {
    if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
      if (res) { res += ' '; }
      res += stringified;
    }
  }
  return res
}

function stringifyObject (value) {
  var res = '';
  for (var key in value) {
    if (value[key]) {
      if (res) { res += ' '; }
      res += key;
    }
  }
  return res
}

/*  */

var namespaceMap = {
  svg: 'http://www.w3.org/2000/svg',
  math: 'http://www.w3.org/1998/Math/MathML'
};

var isHTMLTag = makeMap(
  'html,body,base,head,link,meta,style,title,' +
  'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
  'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
  'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
  's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
  'embed,object,param,source,canvas,script,noscript,del,ins,' +
  'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
  'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
  'output,progress,select,textarea,' +
  'details,dialog,menu,menuitem,summary,' +
  'content,element,shadow,template,blockquote,iframe,tfoot'
);

// this map is intentionally selective, only covering SVG elements that may
// contain child elements.
var isSVG = makeMap(
  'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' +
  'foreignobject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
  'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
  true
);

var isPreTag = function (tag) { return tag === 'pre'; };

var isReservedTag = function (tag) {
  return isHTMLTag(tag) || isSVG(tag)
};

function getTagNamespace (tag) {
  if (isSVG(tag)) {
    return 'svg'
  }
  // basic support for MathML
  // note it doesn't support other MathML elements being component roots
  if (tag === 'math') {
    return 'math'
  }
}

var unknownElementCache = Object.create(null);
function isUnknownElement (tag) {
  /* istanbul ignore if */
  if (!inBrowser) {
    return true
  }
  if (isReservedTag(tag)) {
    return false
  }
  tag = tag.toLowerCase();
  /* istanbul ignore if */
  if (unknownElementCache[tag] != null) {
    return unknownElementCache[tag]
  }
  var el = document.createElement(tag);
  if (tag.indexOf('-') > -1) {
    // http://stackoverflow.com/a/28210364/1070244
    return (unknownElementCache[tag] = (
      el.constructor === window.HTMLUnknownElement ||
      el.constructor === window.HTMLElement
    ))
  } else {
    return (unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString()))
  }
}

var isTextInputType = makeMap('text,number,password,search,email,tel,url');

/*  */

/**
 * Query an element selector if it's not an element already.
 */
function query (el) {
  if (typeof el === 'string') {
    var selected = document.querySelector(el);
    if (!selected) {
       true && warn(
        'Cannot find element: ' + el
      );
      return document.createElement('div')
    }
    return selected
  } else {
    return el
  }
}

/*  */

function createElement$1 (tagName, vnode) {
  var elm = document.createElement(tagName);
  if (tagName !== 'select') {
    return elm
  }
  // false or null will remove the attribute but undefined will not
  if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined) {
    elm.setAttribute('multiple', 'multiple');
  }
  return elm
}

function createElementNS (namespace, tagName) {
  return document.createElementNS(namespaceMap[namespace], tagName)
}

function createTextNode (text) {
  return document.createTextNode(text)
}

function createComment (text) {
  return document.createComment(text)
}

function insertBefore (parentNode, newNode, referenceNode) {
  parentNode.insertBefore(newNode, referenceNode);
}

function removeChild (node, child) {
  node.removeChild(child);
}

function appendChild (node, child) {
  node.appendChild(child);
}

function parentNode (node) {
  return node.parentNode
}

function nextSibling (node) {
  return node.nextSibling
}

function tagName (node) {
  return node.tagName
}

function setTextContent (node, text) {
  node.textContent = text;
}

function setStyleScope (node, scopeId) {
  node.setAttribute(scopeId, '');
}

var nodeOps = /*#__PURE__*/Object.freeze({
  createElement: createElement$1,
  createElementNS: createElementNS,
  createTextNode: createTextNode,
  createComment: createComment,
  insertBefore: insertBefore,
  removeChild: removeChild,
  appendChild: appendChild,
  parentNode: parentNode,
  nextSibling: nextSibling,
  tagName: tagName,
  setTextContent: setTextContent,
  setStyleScope: setStyleScope
});

/*  */

var ref = {
  create: function create (_, vnode) {
    registerRef(vnode);
  },
  update: function update (oldVnode, vnode) {
    if (oldVnode.data.ref !== vnode.data.ref) {
      registerRef(oldVnode, true);
      registerRef(vnode);
    }
  },
  destroy: function destroy (vnode) {
    registerRef(vnode, true);
  }
};

function registerRef (vnode, isRemoval) {
  var key = vnode.data.ref;
  if (!isDef(key)) { return }

  var vm = vnode.context;
  var ref = vnode.componentInstance || vnode.elm;
  var refs = vm.$refs;
  if (isRemoval) {
    if (Array.isArray(refs[key])) {
      remove(refs[key], ref);
    } else if (refs[key] === ref) {
      refs[key] = undefined;
    }
  } else {
    if (vnode.data.refInFor) {
      if (!Array.isArray(refs[key])) {
        refs[key] = [ref];
      } else if (refs[key].indexOf(ref) < 0) {
        // $flow-disable-line
        refs[key].push(ref);
      }
    } else {
      refs[key] = ref;
    }
  }
}

/**
 * Virtual DOM patching algorithm based on Snabbdom by
 * Simon Friis Vindum (@paldepind)
 * Licensed under the MIT License
 * https://github.com/paldepind/snabbdom/blob/master/LICENSE
 *
 * modified by Evan You (@yyx990803)
 *
 * Not type-checking this because this file is perf-critical and the cost
 * of making flow understand it is not worth it.
 */

var emptyNode = new VNode('', {}, []);

var hooks = ['create', 'activate', 'update', 'remove', 'destroy'];

function sameVnode (a, b) {
  return (
    a.key === b.key &&
    a.asyncFactory === b.asyncFactory && (
      (
        a.tag === b.tag &&
        a.isComment === b.isComment &&
        isDef(a.data) === isDef(b.data) &&
        sameInputType(a, b)
      ) || (
        isTrue(a.isAsyncPlaceholder) &&
        isUndef(b.asyncFactory.error)
      )
    )
  )
}

function sameInputType (a, b) {
  if (a.tag !== 'input') { return true }
  var i;
  var typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type;
  var typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type;
  return typeA === typeB || isTextInputType(typeA) && isTextInputType(typeB)
}

function createKeyToOldIdx (children, beginIdx, endIdx) {
  var i, key;
  var map = {};
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key;
    if (isDef(key)) { map[key] = i; }
  }
  return map
}

function createPatchFunction (backend) {
  var i, j;
  var cbs = {};

  var modules = backend.modules;
  var nodeOps = backend.nodeOps;

  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = [];
    for (j = 0; j < modules.length; ++j) {
      if (isDef(modules[j][hooks[i]])) {
        cbs[hooks[i]].push(modules[j][hooks[i]]);
      }
    }
  }

  function emptyNodeAt (elm) {
    return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
  }

  function createRmCb (childElm, listeners) {
    function remove$$1 () {
      if (--remove$$1.listeners === 0) {
        removeNode(childElm);
      }
    }
    remove$$1.listeners = listeners;
    return remove$$1
  }

  function removeNode (el) {
    var parent = nodeOps.parentNode(el);
    // element may have already been removed due to v-html / v-text
    if (isDef(parent)) {
      nodeOps.removeChild(parent, el);
    }
  }

  function isUnknownElement$$1 (vnode, inVPre) {
    return (
      !inVPre &&
      !vnode.ns &&
      !(
        config.ignoredElements.length &&
        config.ignoredElements.some(function (ignore) {
          return isRegExp(ignore)
            ? ignore.test(vnode.tag)
            : ignore === vnode.tag
        })
      ) &&
      config.isUnknownElement(vnode.tag)
    )
  }

  var creatingElmInVPre = 0;

  function createElm (
    vnode,
    insertedVnodeQueue,
    parentElm,
    refElm,
    nested,
    ownerArray,
    index
  ) {
    if (isDef(vnode.elm) && isDef(ownerArray)) {
      // This vnode was used in a previous render!
      // now it's used as a new node, overwriting its elm would cause
      // potential patch errors down the road when it's used as an insertion
      // reference node. Instead, we clone the node on-demand before creating
      // associated DOM element for it.
      vnode = ownerArray[index] = cloneVNode(vnode);
    }

    vnode.isRootInsert = !nested; // for transition enter check
    if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
      return
    }

    var data = vnode.data;
    var children = vnode.children;
    var tag = vnode.tag;
    if (isDef(tag)) {
      if (true) {
        if (data && data.pre) {
          creatingElmInVPre++;
        }
        if (isUnknownElement$$1(vnode, creatingElmInVPre)) {
          warn(
            'Unknown custom element: <' + tag + '> - did you ' +
            'register the component correctly? For recursive components, ' +
            'make sure to provide the "name" option.',
            vnode.context
          );
        }
      }

      vnode.elm = vnode.ns
        ? nodeOps.createElementNS(vnode.ns, tag)
        : nodeOps.createElement(tag, vnode);
      setScope(vnode);

      /* istanbul ignore if */
      {
        createChildren(vnode, children, insertedVnodeQueue);
        if (isDef(data)) {
          invokeCreateHooks(vnode, insertedVnodeQueue);
        }
        insert(parentElm, vnode.elm, refElm);
      }

      if ( true && data && data.pre) {
        creatingElmInVPre--;
      }
    } else if (isTrue(vnode.isComment)) {
      vnode.elm = nodeOps.createComment(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    } else {
      vnode.elm = nodeOps.createTextNode(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    }
  }

  function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    var i = vnode.data;
    if (isDef(i)) {
      var isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
      if (isDef(i = i.hook) && isDef(i = i.init)) {
        i(vnode, false /* hydrating */);
      }
      // after calling the init hook, if the vnode is a child component
      // it should've created a child instance and mounted it. the child
      // component also has set the placeholder vnode's elm.
      // in that case we can just return the element and be done.
      if (isDef(vnode.componentInstance)) {
        initComponent(vnode, insertedVnodeQueue);
        insert(parentElm, vnode.elm, refElm);
        if (isTrue(isReactivated)) {
          reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
        }
        return true
      }
    }
  }

  function initComponent (vnode, insertedVnodeQueue) {
    if (isDef(vnode.data.pendingInsert)) {
      insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
      vnode.data.pendingInsert = null;
    }
    vnode.elm = vnode.componentInstance.$el;
    if (isPatchable(vnode)) {
      invokeCreateHooks(vnode, insertedVnodeQueue);
      setScope(vnode);
    } else {
      // empty component root.
      // skip all element-related modules except for ref (#3455)
      registerRef(vnode);
      // make sure to invoke the insert hook
      insertedVnodeQueue.push(vnode);
    }
  }

  function reactivateComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    var i;
    // hack for #4339: a reactivated component with inner transition
    // does not trigger because the inner node's created hooks are not called
    // again. It's not ideal to involve module-specific logic in here but
    // there doesn't seem to be a better way to do it.
    var innerNode = vnode;
    while (innerNode.componentInstance) {
      innerNode = innerNode.componentInstance._vnode;
      if (isDef(i = innerNode.data) && isDef(i = i.transition)) {
        for (i = 0; i < cbs.activate.length; ++i) {
          cbs.activate[i](emptyNode, innerNode);
        }
        insertedVnodeQueue.push(innerNode);
        break
      }
    }
    // unlike a newly created component,
    // a reactivated keep-alive component doesn't insert itself
    insert(parentElm, vnode.elm, refElm);
  }

  function insert (parent, elm, ref$$1) {
    if (isDef(parent)) {
      if (isDef(ref$$1)) {
        if (nodeOps.parentNode(ref$$1) === parent) {
          nodeOps.insertBefore(parent, elm, ref$$1);
        }
      } else {
        nodeOps.appendChild(parent, elm);
      }
    }
  }

  function createChildren (vnode, children, insertedVnodeQueue) {
    if (Array.isArray(children)) {
      if (true) {
        checkDuplicateKeys(children);
      }
      for (var i = 0; i < children.length; ++i) {
        createElm(children[i], insertedVnodeQueue, vnode.elm, null, true, children, i);
      }
    } else if (isPrimitive(vnode.text)) {
      nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)));
    }
  }

  function isPatchable (vnode) {
    while (vnode.componentInstance) {
      vnode = vnode.componentInstance._vnode;
    }
    return isDef(vnode.tag)
  }

  function invokeCreateHooks (vnode, insertedVnodeQueue) {
    for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
      cbs.create[i$1](emptyNode, vnode);
    }
    i = vnode.data.hook; // Reuse variable
    if (isDef(i)) {
      if (isDef(i.create)) { i.create(emptyNode, vnode); }
      if (isDef(i.insert)) { insertedVnodeQueue.push(vnode); }
    }
  }

  // set scope id attribute for scoped CSS.
  // this is implemented as a special case to avoid the overhead
  // of going through the normal attribute patching process.
  function setScope (vnode) {
    var i;
    if (isDef(i = vnode.fnScopeId)) {
      nodeOps.setStyleScope(vnode.elm, i);
    } else {
      var ancestor = vnode;
      while (ancestor) {
        if (isDef(i = ancestor.context) && isDef(i = i.$options._scopeId)) {
          nodeOps.setStyleScope(vnode.elm, i);
        }
        ancestor = ancestor.parent;
      }
    }
    // for slot content they should also get the scopeId from the host instance.
    if (isDef(i = activeInstance) &&
      i !== vnode.context &&
      i !== vnode.fnContext &&
      isDef(i = i.$options._scopeId)
    ) {
      nodeOps.setStyleScope(vnode.elm, i);
    }
  }

  function addVnodes (parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
    for (; startIdx <= endIdx; ++startIdx) {
      createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm, false, vnodes, startIdx);
    }
  }

  function invokeDestroyHook (vnode) {
    var i, j;
    var data = vnode.data;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.destroy)) { i(vnode); }
      for (i = 0; i < cbs.destroy.length; ++i) { cbs.destroy[i](vnode); }
    }
    if (isDef(i = vnode.children)) {
      for (j = 0; j < vnode.children.length; ++j) {
        invokeDestroyHook(vnode.children[j]);
      }
    }
  }

  function removeVnodes (vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      var ch = vnodes[startIdx];
      if (isDef(ch)) {
        if (isDef(ch.tag)) {
          removeAndInvokeRemoveHook(ch);
          invokeDestroyHook(ch);
        } else { // Text node
          removeNode(ch.elm);
        }
      }
    }
  }

  function removeAndInvokeRemoveHook (vnode, rm) {
    if (isDef(rm) || isDef(vnode.data)) {
      var i;
      var listeners = cbs.remove.length + 1;
      if (isDef(rm)) {
        // we have a recursively passed down rm callback
        // increase the listeners count
        rm.listeners += listeners;
      } else {
        // directly removing
        rm = createRmCb(vnode.elm, listeners);
      }
      // recursively invoke hooks on child component root node
      if (isDef(i = vnode.componentInstance) && isDef(i = i._vnode) && isDef(i.data)) {
        removeAndInvokeRemoveHook(i, rm);
      }
      for (i = 0; i < cbs.remove.length; ++i) {
        cbs.remove[i](vnode, rm);
      }
      if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
        i(vnode, rm);
      } else {
        rm();
      }
    } else {
      removeNode(vnode.elm);
    }
  }

  function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    var oldStartIdx = 0;
    var newStartIdx = 0;
    var oldEndIdx = oldCh.length - 1;
    var oldStartVnode = oldCh[0];
    var oldEndVnode = oldCh[oldEndIdx];
    var newEndIdx = newCh.length - 1;
    var newStartVnode = newCh[0];
    var newEndVnode = newCh[newEndIdx];
    var oldKeyToIdx, idxInOld, vnodeToMove, refElm;

    // removeOnly is a special flag used only by <transition-group>
    // to ensure removed elements stay in correct relative positions
    // during leaving transitions
    var canMove = !removeOnly;

    if (true) {
      checkDuplicateKeys(newCh);
    }

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx);
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        if (isUndef(oldKeyToIdx)) { oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx); }
        idxInOld = isDef(newStartVnode.key)
          ? oldKeyToIdx[newStartVnode.key]
          : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
        if (isUndef(idxInOld)) { // New element
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
        } else {
          vnodeToMove = oldCh[idxInOld];
          if (sameVnode(vnodeToMove, newStartVnode)) {
            patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
            oldCh[idxInOld] = undefined;
            canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
          } else {
            // same key but different element. treat as new element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
          }
        }
        newStartVnode = newCh[++newStartIdx];
      }
    }
    if (oldStartIdx > oldEndIdx) {
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
      addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
    } else if (newStartIdx > newEndIdx) {
      removeVnodes(oldCh, oldStartIdx, oldEndIdx);
    }
  }

  function checkDuplicateKeys (children) {
    var seenKeys = {};
    for (var i = 0; i < children.length; i++) {
      var vnode = children[i];
      var key = vnode.key;
      if (isDef(key)) {
        if (seenKeys[key]) {
          warn(
            ("Duplicate keys detected: '" + key + "'. This may cause an update error."),
            vnode.context
          );
        } else {
          seenKeys[key] = true;
        }
      }
    }
  }

  function findIdxInOld (node, oldCh, start, end) {
    for (var i = start; i < end; i++) {
      var c = oldCh[i];
      if (isDef(c) && sameVnode(node, c)) { return i }
    }
  }

  function patchVnode (
    oldVnode,
    vnode,
    insertedVnodeQueue,
    ownerArray,
    index,
    removeOnly
  ) {
    if (oldVnode === vnode) {
      return
    }

    if (isDef(vnode.elm) && isDef(ownerArray)) {
      // clone reused vnode
      vnode = ownerArray[index] = cloneVNode(vnode);
    }

    var elm = vnode.elm = oldVnode.elm;

    if (isTrue(oldVnode.isAsyncPlaceholder)) {
      if (isDef(vnode.asyncFactory.resolved)) {
        hydrate(oldVnode.elm, vnode, insertedVnodeQueue);
      } else {
        vnode.isAsyncPlaceholder = true;
      }
      return
    }

    // reuse element for static trees.
    // note we only do this if the vnode is cloned -
    // if the new node is not cloned it means the render functions have been
    // reset by the hot-reload-api and we need to do a proper re-render.
    if (isTrue(vnode.isStatic) &&
      isTrue(oldVnode.isStatic) &&
      vnode.key === oldVnode.key &&
      (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
    ) {
      vnode.componentInstance = oldVnode.componentInstance;
      return
    }

    var i;
    var data = vnode.data;
    if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
      i(oldVnode, vnode);
    }

    var oldCh = oldVnode.children;
    var ch = vnode.children;
    if (isDef(data) && isPatchable(vnode)) {
      for (i = 0; i < cbs.update.length; ++i) { cbs.update[i](oldVnode, vnode); }
      if (isDef(i = data.hook) && isDef(i = i.update)) { i(oldVnode, vnode); }
    }
    if (isUndef(vnode.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) { updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly); }
      } else if (isDef(ch)) {
        if (true) {
          checkDuplicateKeys(ch);
        }
        if (isDef(oldVnode.text)) { nodeOps.setTextContent(elm, ''); }
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
      } else if (isDef(oldCh)) {
        removeVnodes(oldCh, 0, oldCh.length - 1);
      } else if (isDef(oldVnode.text)) {
        nodeOps.setTextContent(elm, '');
      }
    } else if (oldVnode.text !== vnode.text) {
      nodeOps.setTextContent(elm, vnode.text);
    }
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.postpatch)) { i(oldVnode, vnode); }
    }
  }

  function invokeInsertHook (vnode, queue, initial) {
    // delay insert hooks for component root nodes, invoke them after the
    // element is really inserted
    if (isTrue(initial) && isDef(vnode.parent)) {
      vnode.parent.data.pendingInsert = queue;
    } else {
      for (var i = 0; i < queue.length; ++i) {
        queue[i].data.hook.insert(queue[i]);
      }
    }
  }

  var hydrationBailed = false;
  // list of modules that can skip create hook during hydration because they
  // are already rendered on the client or has no need for initialization
  // Note: style is excluded because it relies on initial clone for future
  // deep updates (#7063).
  var isRenderedModule = makeMap('attrs,class,staticClass,staticStyle,key');

  // Note: this is a browser-only function so we can assume elms are DOM nodes.
  function hydrate (elm, vnode, insertedVnodeQueue, inVPre) {
    var i;
    var tag = vnode.tag;
    var data = vnode.data;
    var children = vnode.children;
    inVPre = inVPre || (data && data.pre);
    vnode.elm = elm;

    if (isTrue(vnode.isComment) && isDef(vnode.asyncFactory)) {
      vnode.isAsyncPlaceholder = true;
      return true
    }
    // assert node match
    if (true) {
      if (!assertNodeMatch(elm, vnode, inVPre)) {
        return false
      }
    }
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.init)) { i(vnode, true /* hydrating */); }
      if (isDef(i = vnode.componentInstance)) {
        // child component. it should have hydrated its own tree.
        initComponent(vnode, insertedVnodeQueue);
        return true
      }
    }
    if (isDef(tag)) {
      if (isDef(children)) {
        // empty element, allow client to pick up and populate children
        if (!elm.hasChildNodes()) {
          createChildren(vnode, children, insertedVnodeQueue);
        } else {
          // v-html and domProps: innerHTML
          if (isDef(i = data) && isDef(i = i.domProps) && isDef(i = i.innerHTML)) {
            if (i !== elm.innerHTML) {
              /* istanbul ignore if */
              if ( true &&
                typeof console !== 'undefined' &&
                !hydrationBailed
              ) {
                hydrationBailed = true;
                console.warn('Parent: ', elm);
                console.warn('server innerHTML: ', i);
                console.warn('client innerHTML: ', elm.innerHTML);
              }
              return false
            }
          } else {
            // iterate and compare children lists
            var childrenMatch = true;
            var childNode = elm.firstChild;
            for (var i$1 = 0; i$1 < children.length; i$1++) {
              if (!childNode || !hydrate(childNode, children[i$1], insertedVnodeQueue, inVPre)) {
                childrenMatch = false;
                break
              }
              childNode = childNode.nextSibling;
            }
            // if childNode is not null, it means the actual childNodes list is
            // longer than the virtual children list.
            if (!childrenMatch || childNode) {
              /* istanbul ignore if */
              if ( true &&
                typeof console !== 'undefined' &&
                !hydrationBailed
              ) {
                hydrationBailed = true;
                console.warn('Parent: ', elm);
                console.warn('Mismatching childNodes vs. VNodes: ', elm.childNodes, children);
              }
              return false
            }
          }
        }
      }
      if (isDef(data)) {
        var fullInvoke = false;
        for (var key in data) {
          if (!isRenderedModule(key)) {
            fullInvoke = true;
            invokeCreateHooks(vnode, insertedVnodeQueue);
            break
          }
        }
        if (!fullInvoke && data['class']) {
          // ensure collecting deps for deep class bindings for future updates
          traverse(data['class']);
        }
      }
    } else if (elm.data !== vnode.text) {
      elm.data = vnode.text;
    }
    return true
  }

  function assertNodeMatch (node, vnode, inVPre) {
    if (isDef(vnode.tag)) {
      return vnode.tag.indexOf('vue-component') === 0 || (
        !isUnknownElement$$1(vnode, inVPre) &&
        vnode.tag.toLowerCase() === (node.tagName && node.tagName.toLowerCase())
      )
    } else {
      return node.nodeType === (vnode.isComment ? 8 : 3)
    }
  }

  return function patch (oldVnode, vnode, hydrating, removeOnly) {
    if (isUndef(vnode)) {
      if (isDef(oldVnode)) { invokeDestroyHook(oldVnode); }
      return
    }

    var isInitialPatch = false;
    var insertedVnodeQueue = [];

    if (isUndef(oldVnode)) {
      // empty mount (likely as component), create new root element
      isInitialPatch = true;
      createElm(vnode, insertedVnodeQueue);
    } else {
      var isRealElement = isDef(oldVnode.nodeType);
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        // patch existing root node
        patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly);
      } else {
        if (isRealElement) {
          // mounting to a real element
          // check if this is server-rendered content and if we can perform
          // a successful hydration.
          if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
            oldVnode.removeAttribute(SSR_ATTR);
            hydrating = true;
          }
          if (isTrue(hydrating)) {
            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
              invokeInsertHook(vnode, insertedVnodeQueue, true);
              return oldVnode
            } else if (true) {
              warn(
                'The client-side rendered virtual DOM tree is not matching ' +
                'server-rendered content. This is likely caused by incorrect ' +
                'HTML markup, for example nesting block-level elements inside ' +
                '<p>, or missing <tbody>. Bailing hydration and performing ' +
                'full client-side render.'
              );
            }
          }
          // either not server-rendered, or hydration failed.
          // create an empty node and replace it
          oldVnode = emptyNodeAt(oldVnode);
        }

        // replacing existing element
        var oldElm = oldVnode.elm;
        var parentElm = nodeOps.parentNode(oldElm);

        // create new node
        createElm(
          vnode,
          insertedVnodeQueue,
          // extremely rare edge case: do not insert if old element is in a
          // leaving transition. Only happens when combining transition +
          // keep-alive + HOCs. (#4590)
          oldElm._leaveCb ? null : parentElm,
          nodeOps.nextSibling(oldElm)
        );

        // update parent placeholder node element, recursively
        if (isDef(vnode.parent)) {
          var ancestor = vnode.parent;
          var patchable = isPatchable(vnode);
          while (ancestor) {
            for (var i = 0; i < cbs.destroy.length; ++i) {
              cbs.destroy[i](ancestor);
            }
            ancestor.elm = vnode.elm;
            if (patchable) {
              for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
                cbs.create[i$1](emptyNode, ancestor);
              }
              // #6513
              // invoke insert hooks that may have been merged by create hooks.
              // e.g. for directives that uses the "inserted" hook.
              var insert = ancestor.data.hook.insert;
              if (insert.merged) {
                // start at index 1 to avoid re-invoking component mounted hook
                for (var i$2 = 1; i$2 < insert.fns.length; i$2++) {
                  insert.fns[i$2]();
                }
              }
            } else {
              registerRef(ancestor);
            }
            ancestor = ancestor.parent;
          }
        }

        // destroy old node
        if (isDef(parentElm)) {
          removeVnodes([oldVnode], 0, 0);
        } else if (isDef(oldVnode.tag)) {
          invokeDestroyHook(oldVnode);
        }
      }
    }

    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
    return vnode.elm
  }
}

/*  */

var directives = {
  create: updateDirectives,
  update: updateDirectives,
  destroy: function unbindDirectives (vnode) {
    updateDirectives(vnode, emptyNode);
  }
};

function updateDirectives (oldVnode, vnode) {
  if (oldVnode.data.directives || vnode.data.directives) {
    _update(oldVnode, vnode);
  }
}

function _update (oldVnode, vnode) {
  var isCreate = oldVnode === emptyNode;
  var isDestroy = vnode === emptyNode;
  var oldDirs = normalizeDirectives$1(oldVnode.data.directives, oldVnode.context);
  var newDirs = normalizeDirectives$1(vnode.data.directives, vnode.context);

  var dirsWithInsert = [];
  var dirsWithPostpatch = [];

  var key, oldDir, dir;
  for (key in newDirs) {
    oldDir = oldDirs[key];
    dir = newDirs[key];
    if (!oldDir) {
      // new directive, bind
      callHook$1(dir, 'bind', vnode, oldVnode);
      if (dir.def && dir.def.inserted) {
        dirsWithInsert.push(dir);
      }
    } else {
      // existing directive, update
      dir.oldValue = oldDir.value;
      dir.oldArg = oldDir.arg;
      callHook$1(dir, 'update', vnode, oldVnode);
      if (dir.def && dir.def.componentUpdated) {
        dirsWithPostpatch.push(dir);
      }
    }
  }

  if (dirsWithInsert.length) {
    var callInsert = function () {
      for (var i = 0; i < dirsWithInsert.length; i++) {
        callHook$1(dirsWithInsert[i], 'inserted', vnode, oldVnode);
      }
    };
    if (isCreate) {
      mergeVNodeHook(vnode, 'insert', callInsert);
    } else {
      callInsert();
    }
  }

  if (dirsWithPostpatch.length) {
    mergeVNodeHook(vnode, 'postpatch', function () {
      for (var i = 0; i < dirsWithPostpatch.length; i++) {
        callHook$1(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode);
      }
    });
  }

  if (!isCreate) {
    for (key in oldDirs) {
      if (!newDirs[key]) {
        // no longer present, unbind
        callHook$1(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy);
      }
    }
  }
}

var emptyModifiers = Object.create(null);

function normalizeDirectives$1 (
  dirs,
  vm
) {
  var res = Object.create(null);
  if (!dirs) {
    // $flow-disable-line
    return res
  }
  var i, dir;
  for (i = 0; i < dirs.length; i++) {
    dir = dirs[i];
    if (!dir.modifiers) {
      // $flow-disable-line
      dir.modifiers = emptyModifiers;
    }
    res[getRawDirName(dir)] = dir;
    dir.def = resolveAsset(vm.$options, 'directives', dir.name, true);
  }
  // $flow-disable-line
  return res
}

function getRawDirName (dir) {
  return dir.rawName || ((dir.name) + "." + (Object.keys(dir.modifiers || {}).join('.')))
}

function callHook$1 (dir, hook, vnode, oldVnode, isDestroy) {
  var fn = dir.def && dir.def[hook];
  if (fn) {
    try {
      fn(vnode.elm, dir, vnode, oldVnode, isDestroy);
    } catch (e) {
      handleError(e, vnode.context, ("directive " + (dir.name) + " " + hook + " hook"));
    }
  }
}

var baseModules = [
  ref,
  directives
];

/*  */

function updateAttrs (oldVnode, vnode) {
  var opts = vnode.componentOptions;
  if (isDef(opts) && opts.Ctor.options.inheritAttrs === false) {
    return
  }
  if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) {
    return
  }
  var key, cur, old;
  var elm = vnode.elm;
  var oldAttrs = oldVnode.data.attrs || {};
  var attrs = vnode.data.attrs || {};
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(attrs.__ob__)) {
    attrs = vnode.data.attrs = extend({}, attrs);
  }

  for (key in attrs) {
    cur = attrs[key];
    old = oldAttrs[key];
    if (old !== cur) {
      setAttr(elm, key, cur, vnode.data.pre);
    }
  }
  // #4391: in IE9, setting type can reset value for input[type=radio]
  // #6666: IE/Edge forces progress value down to 1 before setting a max
  /* istanbul ignore if */
  if ((isIE || isEdge) && attrs.value !== oldAttrs.value) {
    setAttr(elm, 'value', attrs.value);
  }
  for (key in oldAttrs) {
    if (isUndef(attrs[key])) {
      if (isXlink(key)) {
        elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
      } else if (!isEnumeratedAttr(key)) {
        elm.removeAttribute(key);
      }
    }
  }
}

function setAttr (el, key, value, isInPre) {
  if (isInPre || el.tagName.indexOf('-') > -1) {
    baseSetAttr(el, key, value);
  } else if (isBooleanAttr(key)) {
    // set attribute for blank value
    // e.g. <option disabled>Select one</option>
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      // technically allowfullscreen is a boolean attribute for <iframe>,
      // but Flash expects a value of "true" when used on <embed> tag
      value = key === 'allowfullscreen' && el.tagName === 'EMBED'
        ? 'true'
        : key;
      el.setAttribute(key, value);
    }
  } else if (isEnumeratedAttr(key)) {
    el.setAttribute(key, convertEnumeratedValue(key, value));
  } else if (isXlink(key)) {
    if (isFalsyAttrValue(value)) {
      el.removeAttributeNS(xlinkNS, getXlinkProp(key));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    baseSetAttr(el, key, value);
  }
}

function baseSetAttr (el, key, value) {
  if (isFalsyAttrValue(value)) {
    el.removeAttribute(key);
  } else {
    // #7138: IE10 & 11 fires input event when setting placeholder on
    // <textarea>... block the first input event and remove the blocker
    // immediately.
    /* istanbul ignore if */
    if (
      isIE && !isIE9 &&
      el.tagName === 'TEXTAREA' &&
      key === 'placeholder' && value !== '' && !el.__ieph
    ) {
      var blocker = function (e) {
        e.stopImmediatePropagation();
        el.removeEventListener('input', blocker);
      };
      el.addEventListener('input', blocker);
      // $flow-disable-line
      el.__ieph = true; /* IE placeholder patched */
    }
    el.setAttribute(key, value);
  }
}

var attrs = {
  create: updateAttrs,
  update: updateAttrs
};

/*  */

function updateClass (oldVnode, vnode) {
  var el = vnode.elm;
  var data = vnode.data;
  var oldData = oldVnode.data;
  if (
    isUndef(data.staticClass) &&
    isUndef(data.class) && (
      isUndef(oldData) || (
        isUndef(oldData.staticClass) &&
        isUndef(oldData.class)
      )
    )
  ) {
    return
  }

  var cls = genClassForVnode(vnode);

  // handle transition classes
  var transitionClass = el._transitionClasses;
  if (isDef(transitionClass)) {
    cls = concat(cls, stringifyClass(transitionClass));
  }

  // set the class
  if (cls !== el._prevClass) {
    el.setAttribute('class', cls);
    el._prevClass = cls;
  }
}

var klass = {
  create: updateClass,
  update: updateClass
};

/*  */

var validDivisionCharRE = /[\w).+\-_$\]]/;

function parseFilters (exp) {
  var inSingle = false;
  var inDouble = false;
  var inTemplateString = false;
  var inRegex = false;
  var curly = 0;
  var square = 0;
  var paren = 0;
  var lastFilterIndex = 0;
  var c, prev, i, expression, filters;

  for (i = 0; i < exp.length; i++) {
    prev = c;
    c = exp.charCodeAt(i);
    if (inSingle) {
      if (c === 0x27 && prev !== 0x5C) { inSingle = false; }
    } else if (inDouble) {
      if (c === 0x22 && prev !== 0x5C) { inDouble = false; }
    } else if (inTemplateString) {
      if (c === 0x60 && prev !== 0x5C) { inTemplateString = false; }
    } else if (inRegex) {
      if (c === 0x2f && prev !== 0x5C) { inRegex = false; }
    } else if (
      c === 0x7C && // pipe
      exp.charCodeAt(i + 1) !== 0x7C &&
      exp.charCodeAt(i - 1) !== 0x7C &&
      !curly && !square && !paren
    ) {
      if (expression === undefined) {
        // first filter, end of expression
        lastFilterIndex = i + 1;
        expression = exp.slice(0, i).trim();
      } else {
        pushFilter();
      }
    } else {
      switch (c) {
        case 0x22: inDouble = true; break         // "
        case 0x27: inSingle = true; break         // '
        case 0x60: inTemplateString = true; break // `
        case 0x28: paren++; break                 // (
        case 0x29: paren--; break                 // )
        case 0x5B: square++; break                // [
        case 0x5D: square--; break                // ]
        case 0x7B: curly++; break                 // {
        case 0x7D: curly--; break                 // }
      }
      if (c === 0x2f) { // /
        var j = i - 1;
        var p = (void 0);
        // find first non-whitespace prev char
        for (; j >= 0; j--) {
          p = exp.charAt(j);
          if (p !== ' ') { break }
        }
        if (!p || !validDivisionCharRE.test(p)) {
          inRegex = true;
        }
      }
    }
  }

  if (expression === undefined) {
    expression = exp.slice(0, i).trim();
  } else if (lastFilterIndex !== 0) {
    pushFilter();
  }

  function pushFilter () {
    (filters || (filters = [])).push(exp.slice(lastFilterIndex, i).trim());
    lastFilterIndex = i + 1;
  }

  if (filters) {
    for (i = 0; i < filters.length; i++) {
      expression = wrapFilter(expression, filters[i]);
    }
  }

  return expression
}

function wrapFilter (exp, filter) {
  var i = filter.indexOf('(');
  if (i < 0) {
    // _f: resolveFilter
    return ("_f(\"" + filter + "\")(" + exp + ")")
  } else {
    var name = filter.slice(0, i);
    var args = filter.slice(i + 1);
    return ("_f(\"" + name + "\")(" + exp + (args !== ')' ? ',' + args : args))
  }
}

/*  */



/* eslint-disable no-unused-vars */
function baseWarn (msg, range) {
  console.error(("[Vue compiler]: " + msg));
}
/* eslint-enable no-unused-vars */

function pluckModuleFunction (
  modules,
  key
) {
  return modules
    ? modules.map(function (m) { return m[key]; }).filter(function (_) { return _; })
    : []
}

function addProp (el, name, value, range, dynamic) {
  (el.props || (el.props = [])).push(rangeSetItem({ name: name, value: value, dynamic: dynamic }, range));
  el.plain = false;
}

function addAttr (el, name, value, range, dynamic) {
  var attrs = dynamic
    ? (el.dynamicAttrs || (el.dynamicAttrs = []))
    : (el.attrs || (el.attrs = []));
  attrs.push(rangeSetItem({ name: name, value: value, dynamic: dynamic }, range));
  el.plain = false;
}

// add a raw attr (use this in preTransforms)
function addRawAttr (el, name, value, range) {
  el.attrsMap[name] = value;
  el.attrsList.push(rangeSetItem({ name: name, value: value }, range));
}

function addDirective (
  el,
  name,
  rawName,
  value,
  arg,
  isDynamicArg,
  modifiers,
  range
) {
  (el.directives || (el.directives = [])).push(rangeSetItem({
    name: name,
    rawName: rawName,
    value: value,
    arg: arg,
    isDynamicArg: isDynamicArg,
    modifiers: modifiers
  }, range));
  el.plain = false;
}

function prependModifierMarker (symbol, name, dynamic) {
  return dynamic
    ? ("_p(" + name + ",\"" + symbol + "\")")
    : symbol + name // mark the event as captured
}

function addHandler (
  el,
  name,
  value,
  modifiers,
  important,
  warn,
  range,
  dynamic
) {
  modifiers = modifiers || emptyObject;
  // warn prevent and passive modifier
  /* istanbul ignore if */
  if (
     true && warn &&
    modifiers.prevent && modifiers.passive
  ) {
    warn(
      'passive and prevent can\'t be used together. ' +
      'Passive handler can\'t prevent default event.',
      range
    );
  }

  // normalize click.right and click.middle since they don't actually fire
  // this is technically browser-specific, but at least for now browsers are
  // the only target envs that have right/middle clicks.
  if (modifiers.right) {
    if (dynamic) {
      name = "(" + name + ")==='click'?'contextmenu':(" + name + ")";
    } else if (name === 'click') {
      name = 'contextmenu';
      delete modifiers.right;
    }
  } else if (modifiers.middle) {
    if (dynamic) {
      name = "(" + name + ")==='click'?'mouseup':(" + name + ")";
    } else if (name === 'click') {
      name = 'mouseup';
    }
  }

  // check capture modifier
  if (modifiers.capture) {
    delete modifiers.capture;
    name = prependModifierMarker('!', name, dynamic);
  }
  if (modifiers.once) {
    delete modifiers.once;
    name = prependModifierMarker('~', name, dynamic);
  }
  /* istanbul ignore if */
  if (modifiers.passive) {
    delete modifiers.passive;
    name = prependModifierMarker('&', name, dynamic);
  }

  var events;
  if (modifiers.native) {
    delete modifiers.native;
    events = el.nativeEvents || (el.nativeEvents = {});
  } else {
    events = el.events || (el.events = {});
  }

  var newHandler = rangeSetItem({ value: value.trim(), dynamic: dynamic }, range);
  if (modifiers !== emptyObject) {
    newHandler.modifiers = modifiers;
  }

  var handlers = events[name];
  /* istanbul ignore if */
  if (Array.isArray(handlers)) {
    important ? handlers.unshift(newHandler) : handlers.push(newHandler);
  } else if (handlers) {
    events[name] = important ? [newHandler, handlers] : [handlers, newHandler];
  } else {
    events[name] = newHandler;
  }

  el.plain = false;
}

function getRawBindingAttr (
  el,
  name
) {
  return el.rawAttrsMap[':' + name] ||
    el.rawAttrsMap['v-bind:' + name] ||
    el.rawAttrsMap[name]
}

function getBindingAttr (
  el,
  name,
  getStatic
) {
  var dynamicValue =
    getAndRemoveAttr(el, ':' + name) ||
    getAndRemoveAttr(el, 'v-bind:' + name);
  if (dynamicValue != null) {
    return parseFilters(dynamicValue)
  } else if (getStatic !== false) {
    var staticValue = getAndRemoveAttr(el, name);
    if (staticValue != null) {
      return JSON.stringify(staticValue)
    }
  }
}

// note: this only removes the attr from the Array (attrsList) so that it
// doesn't get processed by processAttrs.
// By default it does NOT remove it from the map (attrsMap) because the map is
// needed during codegen.
function getAndRemoveAttr (
  el,
  name,
  removeFromMap
) {
  var val;
  if ((val = el.attrsMap[name]) != null) {
    var list = el.attrsList;
    for (var i = 0, l = list.length; i < l; i++) {
      if (list[i].name === name) {
        list.splice(i, 1);
        break
      }
    }
  }
  if (removeFromMap) {
    delete el.attrsMap[name];
  }
  return val
}

function getAndRemoveAttrByRegex (
  el,
  name
) {
  var list = el.attrsList;
  for (var i = 0, l = list.length; i < l; i++) {
    var attr = list[i];
    if (name.test(attr.name)) {
      list.splice(i, 1);
      return attr
    }
  }
}

function rangeSetItem (
  item,
  range
) {
  if (range) {
    if (range.start != null) {
      item.start = range.start;
    }
    if (range.end != null) {
      item.end = range.end;
    }
  }
  return item
}

/*  */

/**
 * Cross-platform code generation for component v-model
 */
function genComponentModel (
  el,
  value,
  modifiers
) {
  var ref = modifiers || {};
  var number = ref.number;
  var trim = ref.trim;

  var baseValueExpression = '$$v';
  var valueExpression = baseValueExpression;
  if (trim) {
    valueExpression =
      "(typeof " + baseValueExpression + " === 'string'" +
      "? " + baseValueExpression + ".trim()" +
      ": " + baseValueExpression + ")";
  }
  if (number) {
    valueExpression = "_n(" + valueExpression + ")";
  }
  var assignment = genAssignmentCode(value, valueExpression);

  el.model = {
    value: ("(" + value + ")"),
    expression: JSON.stringify(value),
    callback: ("function (" + baseValueExpression + ") {" + assignment + "}")
  };
}

/**
 * Cross-platform codegen helper for generating v-model value assignment code.
 */
function genAssignmentCode (
  value,
  assignment
) {
  var res = parseModel(value);
  if (res.key === null) {
    return (value + "=" + assignment)
  } else {
    return ("$set(" + (res.exp) + ", " + (res.key) + ", " + assignment + ")")
  }
}

/**
 * Parse a v-model expression into a base path and a final key segment.
 * Handles both dot-path and possible square brackets.
 *
 * Possible cases:
 *
 * - test
 * - test[key]
 * - test[test1[key]]
 * - test["a"][key]
 * - xxx.test[a[a].test1[key]]
 * - test.xxx.a["asa"][test1[key]]
 *
 */

var len, str, chr, index$1, expressionPos, expressionEndPos;



function parseModel (val) {
  // Fix https://github.com/vuejs/vue/pull/7730
  // allow v-model="obj.val " (trailing whitespace)
  val = val.trim();
  len = val.length;

  if (val.indexOf('[') < 0 || val.lastIndexOf(']') < len - 1) {
    index$1 = val.lastIndexOf('.');
    if (index$1 > -1) {
      return {
        exp: val.slice(0, index$1),
        key: '"' + val.slice(index$1 + 1) + '"'
      }
    } else {
      return {
        exp: val,
        key: null
      }
    }
  }

  str = val;
  index$1 = expressionPos = expressionEndPos = 0;

  while (!eof()) {
    chr = next();
    /* istanbul ignore if */
    if (isStringStart(chr)) {
      parseString(chr);
    } else if (chr === 0x5B) {
      parseBracket(chr);
    }
  }

  return {
    exp: val.slice(0, expressionPos),
    key: val.slice(expressionPos + 1, expressionEndPos)
  }
}

function next () {
  return str.charCodeAt(++index$1)
}

function eof () {
  return index$1 >= len
}

function isStringStart (chr) {
  return chr === 0x22 || chr === 0x27
}

function parseBracket (chr) {
  var inBracket = 1;
  expressionPos = index$1;
  while (!eof()) {
    chr = next();
    if (isStringStart(chr)) {
      parseString(chr);
      continue
    }
    if (chr === 0x5B) { inBracket++; }
    if (chr === 0x5D) { inBracket--; }
    if (inBracket === 0) {
      expressionEndPos = index$1;
      break
    }
  }
}

function parseString (chr) {
  var stringQuote = chr;
  while (!eof()) {
    chr = next();
    if (chr === stringQuote) {
      break
    }
  }
}

/*  */

var warn$1;

// in some cases, the event used has to be determined at runtime
// so we used some reserved tokens during compile.
var RANGE_TOKEN = '__r';
var CHECKBOX_RADIO_TOKEN = '__c';

function model (
  el,
  dir,
  _warn
) {
  warn$1 = _warn;
  var value = dir.value;
  var modifiers = dir.modifiers;
  var tag = el.tag;
  var type = el.attrsMap.type;

  if (true) {
    // inputs with type="file" are read only and setting the input's
    // value will throw an error.
    if (tag === 'input' && type === 'file') {
      warn$1(
        "<" + (el.tag) + " v-model=\"" + value + "\" type=\"file\">:\n" +
        "File inputs are read only. Use a v-on:change listener instead.",
        el.rawAttrsMap['v-model']
      );
    }
  }

  if (el.component) {
    genComponentModel(el, value, modifiers);
    // component v-model doesn't need extra runtime
    return false
  } else if (tag === 'select') {
    genSelect(el, value, modifiers);
  } else if (tag === 'input' && type === 'checkbox') {
    genCheckboxModel(el, value, modifiers);
  } else if (tag === 'input' && type === 'radio') {
    genRadioModel(el, value, modifiers);
  } else if (tag === 'input' || tag === 'textarea') {
    genDefaultModel(el, value, modifiers);
  } else if (!config.isReservedTag(tag)) {
    genComponentModel(el, value, modifiers);
    // component v-model doesn't need extra runtime
    return false
  } else if (true) {
    warn$1(
      "<" + (el.tag) + " v-model=\"" + value + "\">: " +
      "v-model is not supported on this element type. " +
      'If you are working with contenteditable, it\'s recommended to ' +
      'wrap a library dedicated for that purpose inside a custom component.',
      el.rawAttrsMap['v-model']
    );
  }

  // ensure runtime directive metadata
  return true
}

function genCheckboxModel (
  el,
  value,
  modifiers
) {
  var number = modifiers && modifiers.number;
  var valueBinding = getBindingAttr(el, 'value') || 'null';
  var trueValueBinding = getBindingAttr(el, 'true-value') || 'true';
  var falseValueBinding = getBindingAttr(el, 'false-value') || 'false';
  addProp(el, 'checked',
    "Array.isArray(" + value + ")" +
    "?_i(" + value + "," + valueBinding + ")>-1" + (
      trueValueBinding === 'true'
        ? (":(" + value + ")")
        : (":_q(" + value + "," + trueValueBinding + ")")
    )
  );
  addHandler(el, 'change',
    "var $$a=" + value + "," +
        '$$el=$event.target,' +
        "$$c=$$el.checked?(" + trueValueBinding + "):(" + falseValueBinding + ");" +
    'if(Array.isArray($$a)){' +
      "var $$v=" + (number ? '_n(' + valueBinding + ')' : valueBinding) + "," +
          '$$i=_i($$a,$$v);' +
      "if($$el.checked){$$i<0&&(" + (genAssignmentCode(value, '$$a.concat([$$v])')) + ")}" +
      "else{$$i>-1&&(" + (genAssignmentCode(value, '$$a.slice(0,$$i).concat($$a.slice($$i+1))')) + ")}" +
    "}else{" + (genAssignmentCode(value, '$$c')) + "}",
    null, true
  );
}

function genRadioModel (
  el,
  value,
  modifiers
) {
  var number = modifiers && modifiers.number;
  var valueBinding = getBindingAttr(el, 'value') || 'null';
  valueBinding = number ? ("_n(" + valueBinding + ")") : valueBinding;
  addProp(el, 'checked', ("_q(" + value + "," + valueBinding + ")"));
  addHandler(el, 'change', genAssignmentCode(value, valueBinding), null, true);
}

function genSelect (
  el,
  value,
  modifiers
) {
  var number = modifiers && modifiers.number;
  var selectedVal = "Array.prototype.filter" +
    ".call($event.target.options,function(o){return o.selected})" +
    ".map(function(o){var val = \"_value\" in o ? o._value : o.value;" +
    "return " + (number ? '_n(val)' : 'val') + "})";

  var assignment = '$event.target.multiple ? $$selectedVal : $$selectedVal[0]';
  var code = "var $$selectedVal = " + selectedVal + ";";
  code = code + " " + (genAssignmentCode(value, assignment));
  addHandler(el, 'change', code, null, true);
}

function genDefaultModel (
  el,
  value,
  modifiers
) {
  var type = el.attrsMap.type;

  // warn if v-bind:value conflicts with v-model
  // except for inputs with v-bind:type
  if (true) {
    var value$1 = el.attrsMap['v-bind:value'] || el.attrsMap[':value'];
    var typeBinding = el.attrsMap['v-bind:type'] || el.attrsMap[':type'];
    if (value$1 && !typeBinding) {
      var binding = el.attrsMap['v-bind:value'] ? 'v-bind:value' : ':value';
      warn$1(
        binding + "=\"" + value$1 + "\" conflicts with v-model on the same element " +
        'because the latter already expands to a value binding internally',
        el.rawAttrsMap[binding]
      );
    }
  }

  var ref = modifiers || {};
  var lazy = ref.lazy;
  var number = ref.number;
  var trim = ref.trim;
  var needCompositionGuard = !lazy && type !== 'range';
  var event = lazy
    ? 'change'
    : type === 'range'
      ? RANGE_TOKEN
      : 'input';

  var valueExpression = '$event.target.value';
  if (trim) {
    valueExpression = "$event.target.value.trim()";
  }
  if (number) {
    valueExpression = "_n(" + valueExpression + ")";
  }

  var code = genAssignmentCode(value, valueExpression);
  if (needCompositionGuard) {
    code = "if($event.target.composing)return;" + code;
  }

  addProp(el, 'value', ("(" + value + ")"));
  addHandler(el, event, code, null, true);
  if (trim || number) {
    addHandler(el, 'blur', '$forceUpdate()');
  }
}

/*  */

// normalize v-model event tokens that can only be determined at runtime.
// it's important to place the event as the first in the array because
// the whole point is ensuring the v-model callback gets called before
// user-attached handlers.
function normalizeEvents (on) {
  /* istanbul ignore if */
  if (isDef(on[RANGE_TOKEN])) {
    // IE input[type=range] only supports `change` event
    var event = isIE ? 'change' : 'input';
    on[event] = [].concat(on[RANGE_TOKEN], on[event] || []);
    delete on[RANGE_TOKEN];
  }
  // This was originally intended to fix #4521 but no longer necessary
  // after 2.5. Keeping it for backwards compat with generated code from < 2.4
  /* istanbul ignore if */
  if (isDef(on[CHECKBOX_RADIO_TOKEN])) {
    on.change = [].concat(on[CHECKBOX_RADIO_TOKEN], on.change || []);
    delete on[CHECKBOX_RADIO_TOKEN];
  }
}

var target$1;

function createOnceHandler$1 (event, handler, capture) {
  var _target = target$1; // save current target element in closure
  return function onceHandler () {
    var res = handler.apply(null, arguments);
    if (res !== null) {
      remove$2(event, onceHandler, capture, _target);
    }
  }
}

// #9446: Firefox <= 53 (in particular, ESR 52) has incorrect Event.timeStamp
// implementation and does not fire microtasks in between event propagation, so
// safe to exclude.
var useMicrotaskFix = isUsingMicroTask && !(isFF && Number(isFF[1]) <= 53);

function add$1 (
  name,
  handler,
  capture,
  passive
) {
  // async edge case #6566: inner click event triggers patch, event handler
  // attached to outer element during patch, and triggered again. This
  // happens because browsers fire microtask ticks between event propagation.
  // the solution is simple: we save the timestamp when a handler is attached,
  // and the handler would only fire if the event passed to it was fired
  // AFTER it was attached.
  if (useMicrotaskFix) {
    var attachedTimestamp = currentFlushTimestamp;
    var original = handler;
    handler = original._wrapper = function (e) {
      if (
        // no bubbling, should always fire.
        // this is just a safety net in case event.timeStamp is unreliable in
        // certain weird environments...
        e.target === e.currentTarget ||
        // event is fired after handler attachment
        e.timeStamp >= attachedTimestamp ||
        // bail for environments that have buggy event.timeStamp implementations
        // #9462 iOS 9 bug: event.timeStamp is 0 after history.pushState
        // #9681 QtWebEngine event.timeStamp is negative value
        e.timeStamp <= 0 ||
        // #9448 bail if event is fired in another document in a multi-page
        // electron/nw.js app, since event.timeStamp will be using a different
        // starting reference
        e.target.ownerDocument !== document
      ) {
        return original.apply(this, arguments)
      }
    };
  }
  target$1.addEventListener(
    name,
    handler,
    supportsPassive
      ? { capture: capture, passive: passive }
      : capture
  );
}

function remove$2 (
  name,
  handler,
  capture,
  _target
) {
  (_target || target$1).removeEventListener(
    name,
    handler._wrapper || handler,
    capture
  );
}

function updateDOMListeners (oldVnode, vnode) {
  if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
    return
  }
  var on = vnode.data.on || {};
  var oldOn = oldVnode.data.on || {};
  target$1 = vnode.elm;
  normalizeEvents(on);
  updateListeners(on, oldOn, add$1, remove$2, createOnceHandler$1, vnode.context);
  target$1 = undefined;
}

var events = {
  create: updateDOMListeners,
  update: updateDOMListeners
};

/*  */

var svgContainer;

function updateDOMProps (oldVnode, vnode) {
  if (isUndef(oldVnode.data.domProps) && isUndef(vnode.data.domProps)) {
    return
  }
  var key, cur;
  var elm = vnode.elm;
  var oldProps = oldVnode.data.domProps || {};
  var props = vnode.data.domProps || {};
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(props.__ob__)) {
    props = vnode.data.domProps = extend({}, props);
  }

  for (key in oldProps) {
    if (!(key in props)) {
      elm[key] = '';
    }
  }

  for (key in props) {
    cur = props[key];
    // ignore children if the node has textContent or innerHTML,
    // as these will throw away existing DOM nodes and cause removal errors
    // on subsequent patches (#3360)
    if (key === 'textContent' || key === 'innerHTML') {
      if (vnode.children) { vnode.children.length = 0; }
      if (cur === oldProps[key]) { continue }
      // #6601 work around Chrome version <= 55 bug where single textNode
      // replaced by innerHTML/textContent retains its parentNode property
      if (elm.childNodes.length === 1) {
        elm.removeChild(elm.childNodes[0]);
      }
    }

    if (key === 'value' && elm.tagName !== 'PROGRESS') {
      // store value as _value as well since
      // non-string values will be stringified
      elm._value = cur;
      // avoid resetting cursor position when value is the same
      var strCur = isUndef(cur) ? '' : String(cur);
      if (shouldUpdateValue(elm, strCur)) {
        elm.value = strCur;
      }
    } else if (key === 'innerHTML' && isSVG(elm.tagName) && isUndef(elm.innerHTML)) {
      // IE doesn't support innerHTML for SVG elements
      svgContainer = svgContainer || document.createElement('div');
      svgContainer.innerHTML = "<svg>" + cur + "</svg>";
      var svg = svgContainer.firstChild;
      while (elm.firstChild) {
        elm.removeChild(elm.firstChild);
      }
      while (svg.firstChild) {
        elm.appendChild(svg.firstChild);
      }
    } else if (
      // skip the update if old and new VDOM state is the same.
      // `value` is handled separately because the DOM value may be temporarily
      // out of sync with VDOM state due to focus, composition and modifiers.
      // This  #4521 by skipping the unnecessary `checked` update.
      cur !== oldProps[key]
    ) {
      // some property updates can throw
      // e.g. `value` on <progress> w/ non-finite value
      try {
        elm[key] = cur;
      } catch (e) {}
    }
  }
}

// check platforms/web/util/attrs.js acceptValue


function shouldUpdateValue (elm, checkVal) {
  return (!elm.composing && (
    elm.tagName === 'OPTION' ||
    isNotInFocusAndDirty(elm, checkVal) ||
    isDirtyWithModifiers(elm, checkVal)
  ))
}

function isNotInFocusAndDirty (elm, checkVal) {
  // return true when textbox (.number and .trim) loses focus and its value is
  // not equal to the updated value
  var notInFocus = true;
  // #6157
  // work around IE bug when accessing document.activeElement in an iframe
  try { notInFocus = document.activeElement !== elm; } catch (e) {}
  return notInFocus && elm.value !== checkVal
}

function isDirtyWithModifiers (elm, newVal) {
  var value = elm.value;
  var modifiers = elm._vModifiers; // injected by v-model runtime
  if (isDef(modifiers)) {
    if (modifiers.number) {
      return toNumber(value) !== toNumber(newVal)
    }
    if (modifiers.trim) {
      return value.trim() !== newVal.trim()
    }
  }
  return value !== newVal
}

var domProps = {
  create: updateDOMProps,
  update: updateDOMProps
};

/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res
});

// merge static and dynamic style data on the same vnode
function normalizeStyleData (data) {
  var style = normalizeStyleBinding(data.style);
  // static style is pre-processed into an object during compilation
  // and is always a fresh object, so it's safe to merge into it
  return data.staticStyle
    ? extend(data.staticStyle, style)
    : style
}

// normalize possible array / string values into Object
function normalizeStyleBinding (bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle)
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle)
  }
  return bindingStyle
}

/**
 * parent component style should be after child's
 * so that parent component's style could override it
 */
function getStyle (vnode, checkChild) {
  var res = {};
  var styleData;

  if (checkChild) {
    var childNode = vnode;
    while (childNode.componentInstance) {
      childNode = childNode.componentInstance._vnode;
      if (
        childNode && childNode.data &&
        (styleData = normalizeStyleData(childNode.data))
      ) {
        extend(res, styleData);
      }
    }
  }

  if ((styleData = normalizeStyleData(vnode.data))) {
    extend(res, styleData);
  }

  var parentNode = vnode;
  while ((parentNode = parentNode.parent)) {
    if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) {
      extend(res, styleData);
    }
  }
  return res
}

/*  */

var cssVarRE = /^--/;
var importantRE = /\s*!important$/;
var setProp = function (el, name, val) {
  /* istanbul ignore if */
  if (cssVarRE.test(name)) {
    el.style.setProperty(name, val);
  } else if (importantRE.test(val)) {
    el.style.setProperty(hyphenate(name), val.replace(importantRE, ''), 'important');
  } else {
    var normalizedName = normalize(name);
    if (Array.isArray(val)) {
      // Support values array created by autoprefixer, e.g.
      // {display: ["-webkit-box", "-ms-flexbox", "flex"]}
      // Set them one by one, and the browser will only set those it can recognize
      for (var i = 0, len = val.length; i < len; i++) {
        el.style[normalizedName] = val[i];
      }
    } else {
      el.style[normalizedName] = val;
    }
  }
};

var vendorNames = ['Webkit', 'Moz', 'ms'];

var emptyStyle;
var normalize = cached(function (prop) {
  emptyStyle = emptyStyle || document.createElement('div').style;
  prop = camelize(prop);
  if (prop !== 'filter' && (prop in emptyStyle)) {
    return prop
  }
  var capName = prop.charAt(0).toUpperCase() + prop.slice(1);
  for (var i = 0; i < vendorNames.length; i++) {
    var name = vendorNames[i] + capName;
    if (name in emptyStyle) {
      return name
    }
  }
});

function updateStyle (oldVnode, vnode) {
  var data = vnode.data;
  var oldData = oldVnode.data;

  if (isUndef(data.staticStyle) && isUndef(data.style) &&
    isUndef(oldData.staticStyle) && isUndef(oldData.style)
  ) {
    return
  }

  var cur, name;
  var el = vnode.elm;
  var oldStaticStyle = oldData.staticStyle;
  var oldStyleBinding = oldData.normalizedStyle || oldData.style || {};

  // if static style exists, stylebinding already merged into it when doing normalizeStyleData
  var oldStyle = oldStaticStyle || oldStyleBinding;

  var style = normalizeStyleBinding(vnode.data.style) || {};

  // store normalized style under a different key for next diff
  // make sure to clone it if it's reactive, since the user likely wants
  // to mutate it.
  vnode.data.normalizedStyle = isDef(style.__ob__)
    ? extend({}, style)
    : style;

  var newStyle = getStyle(vnode, true);

  for (name in oldStyle) {
    if (isUndef(newStyle[name])) {
      setProp(el, name, '');
    }
  }
  for (name in newStyle) {
    cur = newStyle[name];
    if (cur !== oldStyle[name]) {
      // ie9 setting to null has no effect, must use empty string
      setProp(el, name, cur == null ? '' : cur);
    }
  }
}

var style = {
  create: updateStyle,
  update: updateStyle
};

/*  */

var whitespaceRE = /\s+/;

/**
 * Add class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function addClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(whitespaceRE).forEach(function (c) { return el.classList.add(c); });
    } else {
      el.classList.add(cls);
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    if (cur.indexOf(' ' + cls + ' ') < 0) {
      el.setAttribute('class', (cur + cls).trim());
    }
  }
}

/**
 * Remove class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function removeClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(whitespaceRE).forEach(function (c) { return el.classList.remove(c); });
    } else {
      el.classList.remove(cls);
    }
    if (!el.classList.length) {
      el.removeAttribute('class');
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    var tar = ' ' + cls + ' ';
    while (cur.indexOf(tar) >= 0) {
      cur = cur.replace(tar, ' ');
    }
    cur = cur.trim();
    if (cur) {
      el.setAttribute('class', cur);
    } else {
      el.removeAttribute('class');
    }
  }
}

/*  */

function resolveTransition (def$$1) {
  if (!def$$1) {
    return
  }
  /* istanbul ignore else */
  if (typeof def$$1 === 'object') {
    var res = {};
    if (def$$1.css !== false) {
      extend(res, autoCssTransition(def$$1.name || 'v'));
    }
    extend(res, def$$1);
    return res
  } else if (typeof def$$1 === 'string') {
    return autoCssTransition(def$$1)
  }
}

var autoCssTransition = cached(function (name) {
  return {
    enterClass: (name + "-enter"),
    enterToClass: (name + "-enter-to"),
    enterActiveClass: (name + "-enter-active"),
    leaveClass: (name + "-leave"),
    leaveToClass: (name + "-leave-to"),
    leaveActiveClass: (name + "-leave-active")
  }
});

var hasTransition = inBrowser && !isIE9;
var TRANSITION = 'transition';
var ANIMATION = 'animation';

// Transition property/event sniffing
var transitionProp = 'transition';
var transitionEndEvent = 'transitionend';
var animationProp = 'animation';
var animationEndEvent = 'animationend';
if (hasTransition) {
  /* istanbul ignore if */
  if (window.ontransitionend === undefined &&
    window.onwebkittransitionend !== undefined
  ) {
    transitionProp = 'WebkitTransition';
    transitionEndEvent = 'webkitTransitionEnd';
  }
  if (window.onanimationend === undefined &&
    window.onwebkitanimationend !== undefined
  ) {
    animationProp = 'WebkitAnimation';
    animationEndEvent = 'webkitAnimationEnd';
  }
}

// binding to window is necessary to make hot reload work in IE in strict mode
var raf = inBrowser
  ? window.requestAnimationFrame
    ? window.requestAnimationFrame.bind(window)
    : setTimeout
  : /* istanbul ignore next */ function (fn) { return fn(); };

function nextFrame (fn) {
  raf(function () {
    raf(fn);
  });
}

function addTransitionClass (el, cls) {
  var transitionClasses = el._transitionClasses || (el._transitionClasses = []);
  if (transitionClasses.indexOf(cls) < 0) {
    transitionClasses.push(cls);
    addClass(el, cls);
  }
}

function removeTransitionClass (el, cls) {
  if (el._transitionClasses) {
    remove(el._transitionClasses, cls);
  }
  removeClass(el, cls);
}

function whenTransitionEnds (
  el,
  expectedType,
  cb
) {
  var ref = getTransitionInfo(el, expectedType);
  var type = ref.type;
  var timeout = ref.timeout;
  var propCount = ref.propCount;
  if (!type) { return cb() }
  var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
  var ended = 0;
  var end = function () {
    el.removeEventListener(event, onEnd);
    cb();
  };
  var onEnd = function (e) {
    if (e.target === el) {
      if (++ended >= propCount) {
        end();
      }
    }
  };
  setTimeout(function () {
    if (ended < propCount) {
      end();
    }
  }, timeout + 1);
  el.addEventListener(event, onEnd);
}

var transformRE = /\b(transform|all)(,|$)/;

function getTransitionInfo (el, expectedType) {
  var styles = window.getComputedStyle(el);
  // JSDOM may return undefined for transition properties
  var transitionDelays = (styles[transitionProp + 'Delay'] || '').split(', ');
  var transitionDurations = (styles[transitionProp + 'Duration'] || '').split(', ');
  var transitionTimeout = getTimeout(transitionDelays, transitionDurations);
  var animationDelays = (styles[animationProp + 'Delay'] || '').split(', ');
  var animationDurations = (styles[animationProp + 'Duration'] || '').split(', ');
  var animationTimeout = getTimeout(animationDelays, animationDurations);

  var type;
  var timeout = 0;
  var propCount = 0;
  /* istanbul ignore if */
  if (expectedType === TRANSITION) {
    if (transitionTimeout > 0) {
      type = TRANSITION;
      timeout = transitionTimeout;
      propCount = transitionDurations.length;
    }
  } else if (expectedType === ANIMATION) {
    if (animationTimeout > 0) {
      type = ANIMATION;
      timeout = animationTimeout;
      propCount = animationDurations.length;
    }
  } else {
    timeout = Math.max(transitionTimeout, animationTimeout);
    type = timeout > 0
      ? transitionTimeout > animationTimeout
        ? TRANSITION
        : ANIMATION
      : null;
    propCount = type
      ? type === TRANSITION
        ? transitionDurations.length
        : animationDurations.length
      : 0;
  }
  var hasTransform =
    type === TRANSITION &&
    transformRE.test(styles[transitionProp + 'Property']);
  return {
    type: type,
    timeout: timeout,
    propCount: propCount,
    hasTransform: hasTransform
  }
}

function getTimeout (delays, durations) {
  /* istanbul ignore next */
  while (delays.length < durations.length) {
    delays = delays.concat(delays);
  }

  return Math.max.apply(null, durations.map(function (d, i) {
    return toMs(d) + toMs(delays[i])
  }))
}

// Old versions of Chromium (below 61.0.3163.100) formats floating pointer numbers
// in a locale-dependent way, using a comma instead of a dot.
// If comma is not replaced with a dot, the input will be rounded down (i.e. acting
// as a floor function) causing unexpected behaviors
function toMs (s) {
  return Number(s.slice(0, -1).replace(',', '.')) * 1000
}

/*  */

function enter (vnode, toggleDisplay) {
  var el = vnode.elm;

  // call leave callback now
  if (isDef(el._leaveCb)) {
    el._leaveCb.cancelled = true;
    el._leaveCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (isUndef(data)) {
    return
  }

  /* istanbul ignore if */
  if (isDef(el._enterCb) || el.nodeType !== 1) {
    return
  }

  var css = data.css;
  var type = data.type;
  var enterClass = data.enterClass;
  var enterToClass = data.enterToClass;
  var enterActiveClass = data.enterActiveClass;
  var appearClass = data.appearClass;
  var appearToClass = data.appearToClass;
  var appearActiveClass = data.appearActiveClass;
  var beforeEnter = data.beforeEnter;
  var enter = data.enter;
  var afterEnter = data.afterEnter;
  var enterCancelled = data.enterCancelled;
  var beforeAppear = data.beforeAppear;
  var appear = data.appear;
  var afterAppear = data.afterAppear;
  var appearCancelled = data.appearCancelled;
  var duration = data.duration;

  // activeInstance will always be the <transition> component managing this
  // transition. One edge case to check is when the <transition> is placed
  // as the root node of a child component. In that case we need to check
  // <transition>'s parent for appear check.
  var context = activeInstance;
  var transitionNode = activeInstance.$vnode;
  while (transitionNode && transitionNode.parent) {
    context = transitionNode.context;
    transitionNode = transitionNode.parent;
  }

  var isAppear = !context._isMounted || !vnode.isRootInsert;

  if (isAppear && !appear && appear !== '') {
    return
  }

  var startClass = isAppear && appearClass
    ? appearClass
    : enterClass;
  var activeClass = isAppear && appearActiveClass
    ? appearActiveClass
    : enterActiveClass;
  var toClass = isAppear && appearToClass
    ? appearToClass
    : enterToClass;

  var beforeEnterHook = isAppear
    ? (beforeAppear || beforeEnter)
    : beforeEnter;
  var enterHook = isAppear
    ? (typeof appear === 'function' ? appear : enter)
    : enter;
  var afterEnterHook = isAppear
    ? (afterAppear || afterEnter)
    : afterEnter;
  var enterCancelledHook = isAppear
    ? (appearCancelled || enterCancelled)
    : enterCancelled;

  var explicitEnterDuration = toNumber(
    isObject(duration)
      ? duration.enter
      : duration
  );

  if ( true && explicitEnterDuration != null) {
    checkDuration(explicitEnterDuration, 'enter', vnode);
  }

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(enterHook);

  var cb = el._enterCb = once(function () {
    if (expectsCSS) {
      removeTransitionClass(el, toClass);
      removeTransitionClass(el, activeClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, startClass);
      }
      enterCancelledHook && enterCancelledHook(el);
    } else {
      afterEnterHook && afterEnterHook(el);
    }
    el._enterCb = null;
  });

  if (!vnode.data.show) {
    // remove pending leave element on enter by injecting an insert hook
    mergeVNodeHook(vnode, 'insert', function () {
      var parent = el.parentNode;
      var pendingNode = parent && parent._pending && parent._pending[vnode.key];
      if (pendingNode &&
        pendingNode.tag === vnode.tag &&
        pendingNode.elm._leaveCb
      ) {
        pendingNode.elm._leaveCb();
      }
      enterHook && enterHook(el, cb);
    });
  }

  // start enter transition
  beforeEnterHook && beforeEnterHook(el);
  if (expectsCSS) {
    addTransitionClass(el, startClass);
    addTransitionClass(el, activeClass);
    nextFrame(function () {
      removeTransitionClass(el, startClass);
      if (!cb.cancelled) {
        addTransitionClass(el, toClass);
        if (!userWantsControl) {
          if (isValidDuration(explicitEnterDuration)) {
            setTimeout(cb, explicitEnterDuration);
          } else {
            whenTransitionEnds(el, type, cb);
          }
        }
      }
    });
  }

  if (vnode.data.show) {
    toggleDisplay && toggleDisplay();
    enterHook && enterHook(el, cb);
  }

  if (!expectsCSS && !userWantsControl) {
    cb();
  }
}

function leave (vnode, rm) {
  var el = vnode.elm;

  // call enter callback now
  if (isDef(el._enterCb)) {
    el._enterCb.cancelled = true;
    el._enterCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (isUndef(data) || el.nodeType !== 1) {
    return rm()
  }

  /* istanbul ignore if */
  if (isDef(el._leaveCb)) {
    return
  }

  var css = data.css;
  var type = data.type;
  var leaveClass = data.leaveClass;
  var leaveToClass = data.leaveToClass;
  var leaveActiveClass = data.leaveActiveClass;
  var beforeLeave = data.beforeLeave;
  var leave = data.leave;
  var afterLeave = data.afterLeave;
  var leaveCancelled = data.leaveCancelled;
  var delayLeave = data.delayLeave;
  var duration = data.duration;

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(leave);

  var explicitLeaveDuration = toNumber(
    isObject(duration)
      ? duration.leave
      : duration
  );

  if ( true && isDef(explicitLeaveDuration)) {
    checkDuration(explicitLeaveDuration, 'leave', vnode);
  }

  var cb = el._leaveCb = once(function () {
    if (el.parentNode && el.parentNode._pending) {
      el.parentNode._pending[vnode.key] = null;
    }
    if (expectsCSS) {
      removeTransitionClass(el, leaveToClass);
      removeTransitionClass(el, leaveActiveClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, leaveClass);
      }
      leaveCancelled && leaveCancelled(el);
    } else {
      rm();
      afterLeave && afterLeave(el);
    }
    el._leaveCb = null;
  });

  if (delayLeave) {
    delayLeave(performLeave);
  } else {
    performLeave();
  }

  function performLeave () {
    // the delayed leave may have already been cancelled
    if (cb.cancelled) {
      return
    }
    // record leaving element
    if (!vnode.data.show && el.parentNode) {
      (el.parentNode._pending || (el.parentNode._pending = {}))[(vnode.key)] = vnode;
    }
    beforeLeave && beforeLeave(el);
    if (expectsCSS) {
      addTransitionClass(el, leaveClass);
      addTransitionClass(el, leaveActiveClass);
      nextFrame(function () {
        removeTransitionClass(el, leaveClass);
        if (!cb.cancelled) {
          addTransitionClass(el, leaveToClass);
          if (!userWantsControl) {
            if (isValidDuration(explicitLeaveDuration)) {
              setTimeout(cb, explicitLeaveDuration);
            } else {
              whenTransitionEnds(el, type, cb);
            }
          }
        }
      });
    }
    leave && leave(el, cb);
    if (!expectsCSS && !userWantsControl) {
      cb();
    }
  }
}

// only used in dev mode
function checkDuration (val, name, vnode) {
  if (typeof val !== 'number') {
    warn(
      "<transition> explicit " + name + " duration is not a valid number - " +
      "got " + (JSON.stringify(val)) + ".",
      vnode.context
    );
  } else if (isNaN(val)) {
    warn(
      "<transition> explicit " + name + " duration is NaN - " +
      'the duration expression might be incorrect.',
      vnode.context
    );
  }
}

function isValidDuration (val) {
  return typeof val === 'number' && !isNaN(val)
}

/**
 * Normalize a transition hook's argument length. The hook may be:
 * - a merged hook (invoker) with the original in .fns
 * - a wrapped component method (check ._length)
 * - a plain function (.length)
 */
function getHookArgumentsLength (fn) {
  if (isUndef(fn)) {
    return false
  }
  var invokerFns = fn.fns;
  if (isDef(invokerFns)) {
    // invoker
    return getHookArgumentsLength(
      Array.isArray(invokerFns)
        ? invokerFns[0]
        : invokerFns
    )
  } else {
    return (fn._length || fn.length) > 1
  }
}

function _enter (_, vnode) {
  if (vnode.data.show !== true) {
    enter(vnode);
  }
}

var transition = inBrowser ? {
  create: _enter,
  activate: _enter,
  remove: function remove$$1 (vnode, rm) {
    /* istanbul ignore else */
    if (vnode.data.show !== true) {
      leave(vnode, rm);
    } else {
      rm();
    }
  }
} : {};

var platformModules = [
  attrs,
  klass,
  events,
  domProps,
  style,
  transition
];

/*  */

// the directive module should be applied last, after all
// built-in modules have been applied.
var modules = platformModules.concat(baseModules);

var patch = createPatchFunction({ nodeOps: nodeOps, modules: modules });

/**
 * Not type checking this file because flow doesn't like attaching
 * properties to Elements.
 */

/* istanbul ignore if */
if (isIE9) {
  // http://www.matts411.com/post/internet-explorer-9-oninput/
  document.addEventListener('selectionchange', function () {
    var el = document.activeElement;
    if (el && el.vmodel) {
      trigger(el, 'input');
    }
  });
}

var directive = {
  inserted: function inserted (el, binding, vnode, oldVnode) {
    if (vnode.tag === 'select') {
      // #6903
      if (oldVnode.elm && !oldVnode.elm._vOptions) {
        mergeVNodeHook(vnode, 'postpatch', function () {
          directive.componentUpdated(el, binding, vnode);
        });
      } else {
        setSelected(el, binding, vnode.context);
      }
      el._vOptions = [].map.call(el.options, getValue);
    } else if (vnode.tag === 'textarea' || isTextInputType(el.type)) {
      el._vModifiers = binding.modifiers;
      if (!binding.modifiers.lazy) {
        el.addEventListener('compositionstart', onCompositionStart);
        el.addEventListener('compositionend', onCompositionEnd);
        // Safari < 10.2 & UIWebView doesn't fire compositionend when
        // switching focus before confirming composition choice
        // this also fixes the issue where some browsers e.g. iOS Chrome
        // fires "change" instead of "input" on autocomplete.
        el.addEventListener('change', onCompositionEnd);
        /* istanbul ignore if */
        if (isIE9) {
          el.vmodel = true;
        }
      }
    }
  },

  componentUpdated: function componentUpdated (el, binding, vnode) {
    if (vnode.tag === 'select') {
      setSelected(el, binding, vnode.context);
      // in case the options rendered by v-for have changed,
      // it's possible that the value is out-of-sync with the rendered options.
      // detect such cases and filter out values that no longer has a matching
      // option in the DOM.
      var prevOptions = el._vOptions;
      var curOptions = el._vOptions = [].map.call(el.options, getValue);
      if (curOptions.some(function (o, i) { return !looseEqual(o, prevOptions[i]); })) {
        // trigger change event if
        // no matching option found for at least one value
        var needReset = el.multiple
          ? binding.value.some(function (v) { return hasNoMatchingOption(v, curOptions); })
          : binding.value !== binding.oldValue && hasNoMatchingOption(binding.value, curOptions);
        if (needReset) {
          trigger(el, 'change');
        }
      }
    }
  }
};

function setSelected (el, binding, vm) {
  actuallySetSelected(el, binding, vm);
  /* istanbul ignore if */
  if (isIE || isEdge) {
    setTimeout(function () {
      actuallySetSelected(el, binding, vm);
    }, 0);
  }
}

function actuallySetSelected (el, binding, vm) {
  var value = binding.value;
  var isMultiple = el.multiple;
  if (isMultiple && !Array.isArray(value)) {
     true && warn(
      "<select multiple v-model=\"" + (binding.expression) + "\"> " +
      "expects an Array value for its binding, but got " + (Object.prototype.toString.call(value).slice(8, -1)),
      vm
    );
    return
  }
  var selected, option;
  for (var i = 0, l = el.options.length; i < l; i++) {
    option = el.options[i];
    if (isMultiple) {
      selected = looseIndexOf(value, getValue(option)) > -1;
      if (option.selected !== selected) {
        option.selected = selected;
      }
    } else {
      if (looseEqual(getValue(option), value)) {
        if (el.selectedIndex !== i) {
          el.selectedIndex = i;
        }
        return
      }
    }
  }
  if (!isMultiple) {
    el.selectedIndex = -1;
  }
}

function hasNoMatchingOption (value, options) {
  return options.every(function (o) { return !looseEqual(o, value); })
}

function getValue (option) {
  return '_value' in option
    ? option._value
    : option.value
}

function onCompositionStart (e) {
  e.target.composing = true;
}

function onCompositionEnd (e) {
  // prevent triggering an input event for no reason
  if (!e.target.composing) { return }
  e.target.composing = false;
  trigger(e.target, 'input');
}

function trigger (el, type) {
  var e = document.createEvent('HTMLEvents');
  e.initEvent(type, true, true);
  el.dispatchEvent(e);
}

/*  */

// recursively search for possible transition defined inside the component root
function locateNode (vnode) {
  return vnode.componentInstance && (!vnode.data || !vnode.data.transition)
    ? locateNode(vnode.componentInstance._vnode)
    : vnode
}

var show = {
  bind: function bind (el, ref, vnode) {
    var value = ref.value;

    vnode = locateNode(vnode);
    var transition$$1 = vnode.data && vnode.data.transition;
    var originalDisplay = el.__vOriginalDisplay =
      el.style.display === 'none' ? '' : el.style.display;
    if (value && transition$$1) {
      vnode.data.show = true;
      enter(vnode, function () {
        el.style.display = originalDisplay;
      });
    } else {
      el.style.display = value ? originalDisplay : 'none';
    }
  },

  update: function update (el, ref, vnode) {
    var value = ref.value;
    var oldValue = ref.oldValue;

    /* istanbul ignore if */
    if (!value === !oldValue) { return }
    vnode = locateNode(vnode);
    var transition$$1 = vnode.data && vnode.data.transition;
    if (transition$$1) {
      vnode.data.show = true;
      if (value) {
        enter(vnode, function () {
          el.style.display = el.__vOriginalDisplay;
        });
      } else {
        leave(vnode, function () {
          el.style.display = 'none';
        });
      }
    } else {
      el.style.display = value ? el.__vOriginalDisplay : 'none';
    }
  },

  unbind: function unbind (
    el,
    binding,
    vnode,
    oldVnode,
    isDestroy
  ) {
    if (!isDestroy) {
      el.style.display = el.__vOriginalDisplay;
    }
  }
};

var platformDirectives = {
  model: directive,
  show: show
};

/*  */

var transitionProps = {
  name: String,
  appear: Boolean,
  css: Boolean,
  mode: String,
  type: String,
  enterClass: String,
  leaveClass: String,
  enterToClass: String,
  leaveToClass: String,
  enterActiveClass: String,
  leaveActiveClass: String,
  appearClass: String,
  appearActiveClass: String,
  appearToClass: String,
  duration: [Number, String, Object]
};

// in case the child is also an abstract component, e.g. <keep-alive>
// we want to recursively retrieve the real component to be rendered
function getRealChild (vnode) {
  var compOptions = vnode && vnode.componentOptions;
  if (compOptions && compOptions.Ctor.options.abstract) {
    return getRealChild(getFirstComponentChild(compOptions.children))
  } else {
    return vnode
  }
}

function extractTransitionData (comp) {
  var data = {};
  var options = comp.$options;
  // props
  for (var key in options.propsData) {
    data[key] = comp[key];
  }
  // events.
  // extract listeners and pass them directly to the transition methods
  var listeners = options._parentListeners;
  for (var key$1 in listeners) {
    data[camelize(key$1)] = listeners[key$1];
  }
  return data
}

function placeholder (h, rawChild) {
  if (/\d-keep-alive$/.test(rawChild.tag)) {
    return h('keep-alive', {
      props: rawChild.componentOptions.propsData
    })
  }
}

function hasParentTransition (vnode) {
  while ((vnode = vnode.parent)) {
    if (vnode.data.transition) {
      return true
    }
  }
}

function isSameChild (child, oldChild) {
  return oldChild.key === child.key && oldChild.tag === child.tag
}

var isNotTextNode = function (c) { return c.tag || isAsyncPlaceholder(c); };

var isVShowDirective = function (d) { return d.name === 'show'; };

var Transition = {
  name: 'transition',
  props: transitionProps,
  abstract: true,

  render: function render (h) {
    var this$1 = this;

    var children = this.$slots.default;
    if (!children) {
      return
    }

    // filter out text nodes (possible whitespaces)
    children = children.filter(isNotTextNode);
    /* istanbul ignore if */
    if (!children.length) {
      return
    }

    // warn multiple elements
    if ( true && children.length > 1) {
      warn(
        '<transition> can only be used on a single element. Use ' +
        '<transition-group> for lists.',
        this.$parent
      );
    }

    var mode = this.mode;

    // warn invalid mode
    if ( true &&
      mode && mode !== 'in-out' && mode !== 'out-in'
    ) {
      warn(
        'invalid <transition> mode: ' + mode,
        this.$parent
      );
    }

    var rawChild = children[0];

    // if this is a component root node and the component's
    // parent container node also has transition, skip.
    if (hasParentTransition(this.$vnode)) {
      return rawChild
    }

    // apply transition data to child
    // use getRealChild() to ignore abstract components e.g. keep-alive
    var child = getRealChild(rawChild);
    /* istanbul ignore if */
    if (!child) {
      return rawChild
    }

    if (this._leaving) {
      return placeholder(h, rawChild)
    }

    // ensure a key that is unique to the vnode type and to this transition
    // component instance. This key will be used to remove pending leaving nodes
    // during entering.
    var id = "__transition-" + (this._uid) + "-";
    child.key = child.key == null
      ? child.isComment
        ? id + 'comment'
        : id + child.tag
      : isPrimitive(child.key)
        ? (String(child.key).indexOf(id) === 0 ? child.key : id + child.key)
        : child.key;

    var data = (child.data || (child.data = {})).transition = extractTransitionData(this);
    var oldRawChild = this._vnode;
    var oldChild = getRealChild(oldRawChild);

    // mark v-show
    // so that the transition module can hand over the control to the directive
    if (child.data.directives && child.data.directives.some(isVShowDirective)) {
      child.data.show = true;
    }

    if (
      oldChild &&
      oldChild.data &&
      !isSameChild(child, oldChild) &&
      !isAsyncPlaceholder(oldChild) &&
      // #6687 component root is a comment node
      !(oldChild.componentInstance && oldChild.componentInstance._vnode.isComment)
    ) {
      // replace old child transition data with fresh one
      // important for dynamic transitions!
      var oldData = oldChild.data.transition = extend({}, data);
      // handle transition mode
      if (mode === 'out-in') {
        // return placeholder node and queue update when leave finishes
        this._leaving = true;
        mergeVNodeHook(oldData, 'afterLeave', function () {
          this$1._leaving = false;
          this$1.$forceUpdate();
        });
        return placeholder(h, rawChild)
      } else if (mode === 'in-out') {
        if (isAsyncPlaceholder(child)) {
          return oldRawChild
        }
        var delayedLeave;
        var performLeave = function () { delayedLeave(); };
        mergeVNodeHook(data, 'afterEnter', performLeave);
        mergeVNodeHook(data, 'enterCancelled', performLeave);
        mergeVNodeHook(oldData, 'delayLeave', function (leave) { delayedLeave = leave; });
      }
    }

    return rawChild
  }
};

/*  */

var props = extend({
  tag: String,
  moveClass: String
}, transitionProps);

delete props.mode;

var TransitionGroup = {
  props: props,

  beforeMount: function beforeMount () {
    var this$1 = this;

    var update = this._update;
    this._update = function (vnode, hydrating) {
      var restoreActiveInstance = setActiveInstance(this$1);
      // force removing pass
      this$1.__patch__(
        this$1._vnode,
        this$1.kept,
        false, // hydrating
        true // removeOnly (!important, avoids unnecessary moves)
      );
      this$1._vnode = this$1.kept;
      restoreActiveInstance();
      update.call(this$1, vnode, hydrating);
    };
  },

  render: function render (h) {
    var tag = this.tag || this.$vnode.data.tag || 'span';
    var map = Object.create(null);
    var prevChildren = this.prevChildren = this.children;
    var rawChildren = this.$slots.default || [];
    var children = this.children = [];
    var transitionData = extractTransitionData(this);

    for (var i = 0; i < rawChildren.length; i++) {
      var c = rawChildren[i];
      if (c.tag) {
        if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
          children.push(c);
          map[c.key] = c
          ;(c.data || (c.data = {})).transition = transitionData;
        } else if (true) {
          var opts = c.componentOptions;
          var name = opts ? (opts.Ctor.options.name || opts.tag || '') : c.tag;
          warn(("<transition-group> children must be keyed: <" + name + ">"));
        }
      }
    }

    if (prevChildren) {
      var kept = [];
      var removed = [];
      for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
        var c$1 = prevChildren[i$1];
        c$1.data.transition = transitionData;
        c$1.data.pos = c$1.elm.getBoundingClientRect();
        if (map[c$1.key]) {
          kept.push(c$1);
        } else {
          removed.push(c$1);
        }
      }
      this.kept = h(tag, null, kept);
      this.removed = removed;
    }

    return h(tag, null, children)
  },

  updated: function updated () {
    var children = this.prevChildren;
    var moveClass = this.moveClass || ((this.name || 'v') + '-move');
    if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
      return
    }

    // we divide the work into three loops to avoid mixing DOM reads and writes
    // in each iteration - which helps prevent layout thrashing.
    children.forEach(callPendingCbs);
    children.forEach(recordPosition);
    children.forEach(applyTranslation);

    // force reflow to put everything in position
    // assign to this to avoid being removed in tree-shaking
    // $flow-disable-line
    this._reflow = document.body.offsetHeight;

    children.forEach(function (c) {
      if (c.data.moved) {
        var el = c.elm;
        var s = el.style;
        addTransitionClass(el, moveClass);
        s.transform = s.WebkitTransform = s.transitionDuration = '';
        el.addEventListener(transitionEndEvent, el._moveCb = function cb (e) {
          if (e && e.target !== el) {
            return
          }
          if (!e || /transform$/.test(e.propertyName)) {
            el.removeEventListener(transitionEndEvent, cb);
            el._moveCb = null;
            removeTransitionClass(el, moveClass);
          }
        });
      }
    });
  },

  methods: {
    hasMove: function hasMove (el, moveClass) {
      /* istanbul ignore if */
      if (!hasTransition) {
        return false
      }
      /* istanbul ignore if */
      if (this._hasMove) {
        return this._hasMove
      }
      // Detect whether an element with the move class applied has
      // CSS transitions. Since the element may be inside an entering
      // transition at this very moment, we make a clone of it and remove
      // all other transition classes applied to ensure only the move class
      // is applied.
      var clone = el.cloneNode();
      if (el._transitionClasses) {
        el._transitionClasses.forEach(function (cls) { removeClass(clone, cls); });
      }
      addClass(clone, moveClass);
      clone.style.display = 'none';
      this.$el.appendChild(clone);
      var info = getTransitionInfo(clone);
      this.$el.removeChild(clone);
      return (this._hasMove = info.hasTransform)
    }
  }
};

function callPendingCbs (c) {
  /* istanbul ignore if */
  if (c.elm._moveCb) {
    c.elm._moveCb();
  }
  /* istanbul ignore if */
  if (c.elm._enterCb) {
    c.elm._enterCb();
  }
}

function recordPosition (c) {
  c.data.newPos = c.elm.getBoundingClientRect();
}

function applyTranslation (c) {
  var oldPos = c.data.pos;
  var newPos = c.data.newPos;
  var dx = oldPos.left - newPos.left;
  var dy = oldPos.top - newPos.top;
  if (dx || dy) {
    c.data.moved = true;
    var s = c.elm.style;
    s.transform = s.WebkitTransform = "translate(" + dx + "px," + dy + "px)";
    s.transitionDuration = '0s';
  }
}

var platformComponents = {
  Transition: Transition,
  TransitionGroup: TransitionGroup
};

/*  */

// install platform specific utils
Vue.config.mustUseProp = mustUseProp;
Vue.config.isReservedTag = isReservedTag;
Vue.config.isReservedAttr = isReservedAttr;
Vue.config.getTagNamespace = getTagNamespace;
Vue.config.isUnknownElement = isUnknownElement;

// install platform runtime directives & components
extend(Vue.options.directives, platformDirectives);
extend(Vue.options.components, platformComponents);

// install platform patch function
Vue.prototype.__patch__ = inBrowser ? patch : noop;

// public mount method
Vue.prototype.$mount = function (
  el,
  hydrating
) {
  el = el && inBrowser ? query(el) : undefined;
  return mountComponent(this, el, hydrating)
};

// devtools global hook
/* istanbul ignore next */
if (inBrowser) {
  setTimeout(function () {
    if (config.devtools) {
      if (devtools) {
        devtools.emit('init', Vue);
      } else if (
        true
      ) {
        console[console.info ? 'info' : 'log'](
          'Download the Vue Devtools extension for a better development experience:\n' +
          'https://github.com/vuejs/vue-devtools'
        );
      }
    }
    if ( true &&
      config.productionTip !== false &&
      typeof console !== 'undefined'
    ) {
      console[console.info ? 'info' : 'log'](
        "You are running Vue in development mode.\n" +
        "Make sure to turn on production mode when deploying for production.\n" +
        "See more tips at https://vuejs.org/guide/deployment.html"
      );
    }
  }, 0);
}

/*  */

var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g;

var buildRegex = cached(function (delimiters) {
  var open = delimiters[0].replace(regexEscapeRE, '\\$&');
  var close = delimiters[1].replace(regexEscapeRE, '\\$&');
  return new RegExp(open + '((?:.|\\n)+?)' + close, 'g')
});



function parseText (
  text,
  delimiters
) {
  var tagRE = delimiters ? buildRegex(delimiters) : defaultTagRE;
  if (!tagRE.test(text)) {
    return
  }
  var tokens = [];
  var rawTokens = [];
  var lastIndex = tagRE.lastIndex = 0;
  var match, index, tokenValue;
  while ((match = tagRE.exec(text))) {
    index = match.index;
    // push text token
    if (index > lastIndex) {
      rawTokens.push(tokenValue = text.slice(lastIndex, index));
      tokens.push(JSON.stringify(tokenValue));
    }
    // tag token
    var exp = parseFilters(match[1].trim());
    tokens.push(("_s(" + exp + ")"));
    rawTokens.push({ '@binding': exp });
    lastIndex = index + match[0].length;
  }
  if (lastIndex < text.length) {
    rawTokens.push(tokenValue = text.slice(lastIndex));
    tokens.push(JSON.stringify(tokenValue));
  }
  return {
    expression: tokens.join('+'),
    tokens: rawTokens
  }
}

/*  */

function transformNode (el, options) {
  var warn = options.warn || baseWarn;
  var staticClass = getAndRemoveAttr(el, 'class');
  if ( true && staticClass) {
    var res = parseText(staticClass, options.delimiters);
    if (res) {
      warn(
        "class=\"" + staticClass + "\": " +
        'Interpolation inside attributes has been removed. ' +
        'Use v-bind or the colon shorthand instead. For example, ' +
        'instead of <div class="{{ val }}">, use <div :class="val">.',
        el.rawAttrsMap['class']
      );
    }
  }
  if (staticClass) {
    el.staticClass = JSON.stringify(staticClass);
  }
  var classBinding = getBindingAttr(el, 'class', false /* getStatic */);
  if (classBinding) {
    el.classBinding = classBinding;
  }
}

function genData (el) {
  var data = '';
  if (el.staticClass) {
    data += "staticClass:" + (el.staticClass) + ",";
  }
  if (el.classBinding) {
    data += "class:" + (el.classBinding) + ",";
  }
  return data
}

var klass$1 = {
  staticKeys: ['staticClass'],
  transformNode: transformNode,
  genData: genData
};

/*  */

function transformNode$1 (el, options) {
  var warn = options.warn || baseWarn;
  var staticStyle = getAndRemoveAttr(el, 'style');
  if (staticStyle) {
    /* istanbul ignore if */
    if (true) {
      var res = parseText(staticStyle, options.delimiters);
      if (res) {
        warn(
          "style=\"" + staticStyle + "\": " +
          'Interpolation inside attributes has been removed. ' +
          'Use v-bind or the colon shorthand instead. For example, ' +
          'instead of <div style="{{ val }}">, use <div :style="val">.',
          el.rawAttrsMap['style']
        );
      }
    }
    el.staticStyle = JSON.stringify(parseStyleText(staticStyle));
  }

  var styleBinding = getBindingAttr(el, 'style', false /* getStatic */);
  if (styleBinding) {
    el.styleBinding = styleBinding;
  }
}

function genData$1 (el) {
  var data = '';
  if (el.staticStyle) {
    data += "staticStyle:" + (el.staticStyle) + ",";
  }
  if (el.styleBinding) {
    data += "style:(" + (el.styleBinding) + "),";
  }
  return data
}

var style$1 = {
  staticKeys: ['staticStyle'],
  transformNode: transformNode$1,
  genData: genData$1
};

/*  */

var decoder;

var he = {
  decode: function decode (html) {
    decoder = decoder || document.createElement('div');
    decoder.innerHTML = html;
    return decoder.textContent
  }
};

/*  */

var isUnaryTag = makeMap(
  'area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' +
  'link,meta,param,source,track,wbr'
);

// Elements that you can, intentionally, leave open
// (and which close themselves)
var canBeLeftOpenTag = makeMap(
  'colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source'
);

// HTML5 tags https://html.spec.whatwg.org/multipage/indices.html#elements-3
// Phrasing Content https://html.spec.whatwg.org/multipage/dom.html#phrasing-content
var isNonPhrasingTag = makeMap(
  'address,article,aside,base,blockquote,body,caption,col,colgroup,dd,' +
  'details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,' +
  'h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,' +
  'optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,' +
  'title,tr,track'
);

/**
 * Not type-checking this file because it's mostly vendor code.
 */

// Regular Expressions for parsing tags and attributes
var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
var dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+?\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z" + (unicodeRegExp.source) + "]*";
var qnameCapture = "((?:" + ncname + "\\:)?" + ncname + ")";
var startTagOpen = new RegExp(("^<" + qnameCapture));
var startTagClose = /^\s*(\/?)>/;
var endTag = new RegExp(("^<\\/" + qnameCapture + "[^>]*>"));
var doctype = /^<!DOCTYPE [^>]+>/i;
// #7298: escape - to avoid being passed as HTML comment when inlined in page
var comment = /^<!\--/;
var conditionalComment = /^<!\[/;

// Special Elements (can contain anything)
var isPlainTextElement = makeMap('script,style,textarea', true);
var reCache = {};

var decodingMap = {
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&amp;': '&',
  '&#10;': '\n',
  '&#9;': '\t',
  '&#39;': "'"
};
var encodedAttr = /&(?:lt|gt|quot|amp|#39);/g;
var encodedAttrWithNewLines = /&(?:lt|gt|quot|amp|#39|#10|#9);/g;

// #5992
var isIgnoreNewlineTag = makeMap('pre,textarea', true);
var shouldIgnoreFirstNewline = function (tag, html) { return tag && isIgnoreNewlineTag(tag) && html[0] === '\n'; };

function decodeAttr (value, shouldDecodeNewlines) {
  var re = shouldDecodeNewlines ? encodedAttrWithNewLines : encodedAttr;
  return value.replace(re, function (match) { return decodingMap[match]; })
}

function parseHTML (html, options) {
  var stack = [];
  var expectHTML = options.expectHTML;
  var isUnaryTag$$1 = options.isUnaryTag || no;
  var canBeLeftOpenTag$$1 = options.canBeLeftOpenTag || no;
  var index = 0;
  var last, lastTag;
  while (html) {
    last = html;
    // Make sure we're not in a plaintext content element like script/style
    if (!lastTag || !isPlainTextElement(lastTag)) {
      var textEnd = html.indexOf('<');
      if (textEnd === 0) {
        // Comment:
        if (comment.test(html)) {
          var commentEnd = html.indexOf('-->');

          if (commentEnd >= 0) {
            if (options.shouldKeepComment) {
              options.comment(html.substring(4, commentEnd), index, index + commentEnd + 3);
            }
            advance(commentEnd + 3);
            continue
          }
        }

        // http://en.wikipedia.org/wiki/Conditional_comment#Downlevel-revealed_conditional_comment
        if (conditionalComment.test(html)) {
          var conditionalEnd = html.indexOf(']>');

          if (conditionalEnd >= 0) {
            advance(conditionalEnd + 2);
            continue
          }
        }

        // Doctype:
        var doctypeMatch = html.match(doctype);
        if (doctypeMatch) {
          advance(doctypeMatch[0].length);
          continue
        }

        // End tag:
        var endTagMatch = html.match(endTag);
        if (endTagMatch) {
          var curIndex = index;
          advance(endTagMatch[0].length);
          parseEndTag(endTagMatch[1], curIndex, index);
          continue
        }

        // Start tag:
        var startTagMatch = parseStartTag();
        if (startTagMatch) {
          handleStartTag(startTagMatch);
          if (shouldIgnoreFirstNewline(startTagMatch.tagName, html)) {
            advance(1);
          }
          continue
        }
      }

      var text = (void 0), rest = (void 0), next = (void 0);
      if (textEnd >= 0) {
        rest = html.slice(textEnd);
        while (
          !endTag.test(rest) &&
          !startTagOpen.test(rest) &&
          !comment.test(rest) &&
          !conditionalComment.test(rest)
        ) {
          // < in plain text, be forgiving and treat it as text
          next = rest.indexOf('<', 1);
          if (next < 0) { break }
          textEnd += next;
          rest = html.slice(textEnd);
        }
        text = html.substring(0, textEnd);
      }

      if (textEnd < 0) {
        text = html;
      }

      if (text) {
        advance(text.length);
      }

      if (options.chars && text) {
        options.chars(text, index - text.length, index);
      }
    } else {
      var endTagLength = 0;
      var stackedTag = lastTag.toLowerCase();
      var reStackedTag = reCache[stackedTag] || (reCache[stackedTag] = new RegExp('([\\s\\S]*?)(</' + stackedTag + '[^>]*>)', 'i'));
      var rest$1 = html.replace(reStackedTag, function (all, text, endTag) {
        endTagLength = endTag.length;
        if (!isPlainTextElement(stackedTag) && stackedTag !== 'noscript') {
          text = text
            .replace(/<!\--([\s\S]*?)-->/g, '$1') // #7298
            .replace(/<!\[CDATA\[([\s\S]*?)]]>/g, '$1');
        }
        if (shouldIgnoreFirstNewline(stackedTag, text)) {
          text = text.slice(1);
        }
        if (options.chars) {
          options.chars(text);
        }
        return ''
      });
      index += html.length - rest$1.length;
      html = rest$1;
      parseEndTag(stackedTag, index - endTagLength, index);
    }

    if (html === last) {
      options.chars && options.chars(html);
      if ( true && !stack.length && options.warn) {
        options.warn(("Mal-formatted tag at end of template: \"" + html + "\""), { start: index + html.length });
      }
      break
    }
  }

  // Clean up any remaining tags
  parseEndTag();

  function advance (n) {
    index += n;
    html = html.substring(n);
  }

  function parseStartTag () {
    var start = html.match(startTagOpen);
    if (start) {
      var match = {
        tagName: start[1],
        attrs: [],
        start: index
      };
      advance(start[0].length);
      var end, attr;
      while (!(end = html.match(startTagClose)) && (attr = html.match(dynamicArgAttribute) || html.match(attribute))) {
        attr.start = index;
        advance(attr[0].length);
        attr.end = index;
        match.attrs.push(attr);
      }
      if (end) {
        match.unarySlash = end[1];
        advance(end[0].length);
        match.end = index;
        return match
      }
    }
  }

  function handleStartTag (match) {
    var tagName = match.tagName;
    var unarySlash = match.unarySlash;

    if (expectHTML) {
      if (lastTag === 'p' && isNonPhrasingTag(tagName)) {
        parseEndTag(lastTag);
      }
      if (canBeLeftOpenTag$$1(tagName) && lastTag === tagName) {
        parseEndTag(tagName);
      }
    }

    var unary = isUnaryTag$$1(tagName) || !!unarySlash;

    var l = match.attrs.length;
    var attrs = new Array(l);
    for (var i = 0; i < l; i++) {
      var args = match.attrs[i];
      var value = args[3] || args[4] || args[5] || '';
      var shouldDecodeNewlines = tagName === 'a' && args[1] === 'href'
        ? options.shouldDecodeNewlinesForHref
        : options.shouldDecodeNewlines;
      attrs[i] = {
        name: args[1],
        value: decodeAttr(value, shouldDecodeNewlines)
      };
      if ( true && options.outputSourceRange) {
        attrs[i].start = args.start + args[0].match(/^\s*/).length;
        attrs[i].end = args.end;
      }
    }

    if (!unary) {
      stack.push({ tag: tagName, lowerCasedTag: tagName.toLowerCase(), attrs: attrs, start: match.start, end: match.end });
      lastTag = tagName;
    }

    if (options.start) {
      options.start(tagName, attrs, unary, match.start, match.end);
    }
  }

  function parseEndTag (tagName, start, end) {
    var pos, lowerCasedTagName;
    if (start == null) { start = index; }
    if (end == null) { end = index; }

    // Find the closest opened tag of the same type
    if (tagName) {
      lowerCasedTagName = tagName.toLowerCase();
      for (pos = stack.length - 1; pos >= 0; pos--) {
        if (stack[pos].lowerCasedTag === lowerCasedTagName) {
          break
        }
      }
    } else {
      // If no tag name is provided, clean shop
      pos = 0;
    }

    if (pos >= 0) {
      // Close all the open elements, up the stack
      for (var i = stack.length - 1; i >= pos; i--) {
        if ( true &&
          (i > pos || !tagName) &&
          options.warn
        ) {
          options.warn(
            ("tag <" + (stack[i].tag) + "> has no matching end tag."),
            { start: stack[i].start, end: stack[i].end }
          );
        }
        if (options.end) {
          options.end(stack[i].tag, start, end);
        }
      }

      // Remove the open elements from the stack
      stack.length = pos;
      lastTag = pos && stack[pos - 1].tag;
    } else if (lowerCasedTagName === 'br') {
      if (options.start) {
        options.start(tagName, [], true, start, end);
      }
    } else if (lowerCasedTagName === 'p') {
      if (options.start) {
        options.start(tagName, [], false, start, end);
      }
      if (options.end) {
        options.end(tagName, start, end);
      }
    }
  }
}

/*  */

var onRE = /^@|^v-on:/;
var dirRE = /^v-|^@|^:|^#/;
var forAliasRE = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/;
var forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/;
var stripParensRE = /^\(|\)$/g;
var dynamicArgRE = /^\[.*\]$/;

var argRE = /:(.*)$/;
var bindRE = /^:|^\.|^v-bind:/;
var modifierRE = /\.[^.\]]+(?=[^\]]*$)/g;

var slotRE = /^v-slot(:|$)|^#/;

var lineBreakRE = /[\r\n]/;
var whitespaceRE$1 = /[ \f\t\r\n]+/g;

var invalidAttributeRE = /[\s"'<>\/=]/;

var decodeHTMLCached = cached(he.decode);

var emptySlotScopeToken = "_empty_";

// configurable state
var warn$2;
var delimiters;
var transforms;
var preTransforms;
var postTransforms;
var platformIsPreTag;
var platformMustUseProp;
var platformGetTagNamespace;
var maybeComponent;

function createASTElement (
  tag,
  attrs,
  parent
) {
  return {
    type: 1,
    tag: tag,
    attrsList: attrs,
    attrsMap: makeAttrsMap(attrs),
    rawAttrsMap: {},
    parent: parent,
    children: []
  }
}

/**
 * Convert HTML string to AST.
 */
function parse (
  template,
  options
) {
  warn$2 = options.warn || baseWarn;

  platformIsPreTag = options.isPreTag || no;
  platformMustUseProp = options.mustUseProp || no;
  platformGetTagNamespace = options.getTagNamespace || no;
  var isReservedTag = options.isReservedTag || no;
  maybeComponent = function (el) { return !!(
    el.component ||
    el.attrsMap[':is'] ||
    el.attrsMap['v-bind:is'] ||
    !(el.attrsMap.is ? isReservedTag(el.attrsMap.is) : isReservedTag(el.tag))
  ); };
  transforms = pluckModuleFunction(options.modules, 'transformNode');
  preTransforms = pluckModuleFunction(options.modules, 'preTransformNode');
  postTransforms = pluckModuleFunction(options.modules, 'postTransformNode');

  delimiters = options.delimiters;

  var stack = [];
  var preserveWhitespace = options.preserveWhitespace !== false;
  var whitespaceOption = options.whitespace;
  var root;
  var currentParent;
  var inVPre = false;
  var inPre = false;
  var warned = false;

  function warnOnce (msg, range) {
    if (!warned) {
      warned = true;
      warn$2(msg, range);
    }
  }

  function closeElement (element) {
    trimEndingWhitespace(element);
    if (!inVPre && !element.processed) {
      element = processElement(element, options);
    }
    // tree management
    if (!stack.length && element !== root) {
      // allow root elements with v-if, v-else-if and v-else
      if (root.if && (element.elseif || element.else)) {
        if (true) {
          checkRootConstraints(element);
        }
        addIfCondition(root, {
          exp: element.elseif,
          block: element
        });
      } else if (true) {
        warnOnce(
          "Component template should contain exactly one root element. " +
          "If you are using v-if on multiple elements, " +
          "use v-else-if to chain them instead.",
          { start: element.start }
        );
      }
    }
    if (currentParent && !element.forbidden) {
      if (element.elseif || element.else) {
        processIfConditions(element, currentParent);
      } else {
        if (element.slotScope) {
          // scoped slot
          // keep it in the children list so that v-else(-if) conditions can
          // find it as the prev node.
          var name = element.slotTarget || '"default"'
          ;(currentParent.scopedSlots || (currentParent.scopedSlots = {}))[name] = element;
        }
        currentParent.children.push(element);
        element.parent = currentParent;
      }
    }

    // final children cleanup
    // filter out scoped slots
    element.children = element.children.filter(function (c) { return !(c).slotScope; });
    // remove trailing whitespace node again
    trimEndingWhitespace(element);

    // check pre state
    if (element.pre) {
      inVPre = false;
    }
    if (platformIsPreTag(element.tag)) {
      inPre = false;
    }
    // apply post-transforms
    for (var i = 0; i < postTransforms.length; i++) {
      postTransforms[i](element, options);
    }
  }

  function trimEndingWhitespace (el) {
    // remove trailing whitespace node
    if (!inPre) {
      var lastNode;
      while (
        (lastNode = el.children[el.children.length - 1]) &&
        lastNode.type === 3 &&
        lastNode.text === ' '
      ) {
        el.children.pop();
      }
    }
  }

  function checkRootConstraints (el) {
    if (el.tag === 'slot' || el.tag === 'template') {
      warnOnce(
        "Cannot use <" + (el.tag) + "> as component root element because it may " +
        'contain multiple nodes.',
        { start: el.start }
      );
    }
    if (el.attrsMap.hasOwnProperty('v-for')) {
      warnOnce(
        'Cannot use v-for on stateful component root element because ' +
        'it renders multiple elements.',
        el.rawAttrsMap['v-for']
      );
    }
  }

  parseHTML(template, {
    warn: warn$2,
    expectHTML: options.expectHTML,
    isUnaryTag: options.isUnaryTag,
    canBeLeftOpenTag: options.canBeLeftOpenTag,
    shouldDecodeNewlines: options.shouldDecodeNewlines,
    shouldDecodeNewlinesForHref: options.shouldDecodeNewlinesForHref,
    shouldKeepComment: options.comments,
    outputSourceRange: options.outputSourceRange,
    start: function start (tag, attrs, unary, start$1, end) {
      // check namespace.
      // inherit parent ns if there is one
      var ns = (currentParent && currentParent.ns) || platformGetTagNamespace(tag);

      // handle IE svg bug
      /* istanbul ignore if */
      if (isIE && ns === 'svg') {
        attrs = guardIESVGBug(attrs);
      }

      var element = createASTElement(tag, attrs, currentParent);
      if (ns) {
        element.ns = ns;
      }

      if (true) {
        if (options.outputSourceRange) {
          element.start = start$1;
          element.end = end;
          element.rawAttrsMap = element.attrsList.reduce(function (cumulated, attr) {
            cumulated[attr.name] = attr;
            return cumulated
          }, {});
        }
        attrs.forEach(function (attr) {
          if (invalidAttributeRE.test(attr.name)) {
            warn$2(
              "Invalid dynamic argument expression: attribute names cannot contain " +
              "spaces, quotes, <, >, / or =.",
              {
                start: attr.start + attr.name.indexOf("["),
                end: attr.start + attr.name.length
              }
            );
          }
        });
      }

      if (isForbiddenTag(element) && !isServerRendering()) {
        element.forbidden = true;
         true && warn$2(
          'Templates should only be responsible for mapping the state to the ' +
          'UI. Avoid placing tags with side-effects in your templates, such as ' +
          "<" + tag + ">" + ', as they will not be parsed.',
          { start: element.start }
        );
      }

      // apply pre-transforms
      for (var i = 0; i < preTransforms.length; i++) {
        element = preTransforms[i](element, options) || element;
      }

      if (!inVPre) {
        processPre(element);
        if (element.pre) {
          inVPre = true;
        }
      }
      if (platformIsPreTag(element.tag)) {
        inPre = true;
      }
      if (inVPre) {
        processRawAttrs(element);
      } else if (!element.processed) {
        // structural directives
        processFor(element);
        processIf(element);
        processOnce(element);
      }

      if (!root) {
        root = element;
        if (true) {
          checkRootConstraints(root);
        }
      }

      if (!unary) {
        currentParent = element;
        stack.push(element);
      } else {
        closeElement(element);
      }
    },

    end: function end (tag, start, end$1) {
      var element = stack[stack.length - 1];
      // pop stack
      stack.length -= 1;
      currentParent = stack[stack.length - 1];
      if ( true && options.outputSourceRange) {
        element.end = end$1;
      }
      closeElement(element);
    },

    chars: function chars (text, start, end) {
      if (!currentParent) {
        if (true) {
          if (text === template) {
            warnOnce(
              'Component template requires a root element, rather than just text.',
              { start: start }
            );
          } else if ((text = text.trim())) {
            warnOnce(
              ("text \"" + text + "\" outside root element will be ignored."),
              { start: start }
            );
          }
        }
        return
      }
      // IE textarea placeholder bug
      /* istanbul ignore if */
      if (isIE &&
        currentParent.tag === 'textarea' &&
        currentParent.attrsMap.placeholder === text
      ) {
        return
      }
      var children = currentParent.children;
      if (inPre || text.trim()) {
        text = isTextTag(currentParent) ? text : decodeHTMLCached(text);
      } else if (!children.length) {
        // remove the whitespace-only node right after an opening tag
        text = '';
      } else if (whitespaceOption) {
        if (whitespaceOption === 'condense') {
          // in condense mode, remove the whitespace node if it contains
          // line break, otherwise condense to a single space
          text = lineBreakRE.test(text) ? '' : ' ';
        } else {
          text = ' ';
        }
      } else {
        text = preserveWhitespace ? ' ' : '';
      }
      if (text) {
        if (!inPre && whitespaceOption === 'condense') {
          // condense consecutive whitespaces into single space
          text = text.replace(whitespaceRE$1, ' ');
        }
        var res;
        var child;
        if (!inVPre && text !== ' ' && (res = parseText(text, delimiters))) {
          child = {
            type: 2,
            expression: res.expression,
            tokens: res.tokens,
            text: text
          };
        } else if (text !== ' ' || !children.length || children[children.length - 1].text !== ' ') {
          child = {
            type: 3,
            text: text
          };
        }
        if (child) {
          if ( true && options.outputSourceRange) {
            child.start = start;
            child.end = end;
          }
          children.push(child);
        }
      }
    },
    comment: function comment (text, start, end) {
      // adding anything as a sibling to the root node is forbidden
      // comments should still be allowed, but ignored
      if (currentParent) {
        var child = {
          type: 3,
          text: text,
          isComment: true
        };
        if ( true && options.outputSourceRange) {
          child.start = start;
          child.end = end;
        }
        currentParent.children.push(child);
      }
    }
  });
  return root
}

function processPre (el) {
  if (getAndRemoveAttr(el, 'v-pre') != null) {
    el.pre = true;
  }
}

function processRawAttrs (el) {
  var list = el.attrsList;
  var len = list.length;
  if (len) {
    var attrs = el.attrs = new Array(len);
    for (var i = 0; i < len; i++) {
      attrs[i] = {
        name: list[i].name,
        value: JSON.stringify(list[i].value)
      };
      if (list[i].start != null) {
        attrs[i].start = list[i].start;
        attrs[i].end = list[i].end;
      }
    }
  } else if (!el.pre) {
    // non root node in pre blocks with no attributes
    el.plain = true;
  }
}

function processElement (
  element,
  options
) {
  processKey(element);

  // determine whether this is a plain element after
  // removing structural attributes
  element.plain = (
    !element.key &&
    !element.scopedSlots &&
    !element.attrsList.length
  );

  processRef(element);
  processSlotContent(element);
  processSlotOutlet(element);
  processComponent(element);
  for (var i = 0; i < transforms.length; i++) {
    element = transforms[i](element, options) || element;
  }
  processAttrs(element);
  return element
}

function processKey (el) {
  var exp = getBindingAttr(el, 'key');
  if (exp) {
    if (true) {
      if (el.tag === 'template') {
        warn$2(
          "<template> cannot be keyed. Place the key on real elements instead.",
          getRawBindingAttr(el, 'key')
        );
      }
      if (el.for) {
        var iterator = el.iterator2 || el.iterator1;
        var parent = el.parent;
        if (iterator && iterator === exp && parent && parent.tag === 'transition-group') {
          warn$2(
            "Do not use v-for index as key on <transition-group> children, " +
            "this is the same as not using keys.",
            getRawBindingAttr(el, 'key'),
            true /* tip */
          );
        }
      }
    }
    el.key = exp;
  }
}

function processRef (el) {
  var ref = getBindingAttr(el, 'ref');
  if (ref) {
    el.ref = ref;
    el.refInFor = checkInFor(el);
  }
}

function processFor (el) {
  var exp;
  if ((exp = getAndRemoveAttr(el, 'v-for'))) {
    var res = parseFor(exp);
    if (res) {
      extend(el, res);
    } else if (true) {
      warn$2(
        ("Invalid v-for expression: " + exp),
        el.rawAttrsMap['v-for']
      );
    }
  }
}



function parseFor (exp) {
  var inMatch = exp.match(forAliasRE);
  if (!inMatch) { return }
  var res = {};
  res.for = inMatch[2].trim();
  var alias = inMatch[1].trim().replace(stripParensRE, '');
  var iteratorMatch = alias.match(forIteratorRE);
  if (iteratorMatch) {
    res.alias = alias.replace(forIteratorRE, '').trim();
    res.iterator1 = iteratorMatch[1].trim();
    if (iteratorMatch[2]) {
      res.iterator2 = iteratorMatch[2].trim();
    }
  } else {
    res.alias = alias;
  }
  return res
}

function processIf (el) {
  var exp = getAndRemoveAttr(el, 'v-if');
  if (exp) {
    el.if = exp;
    addIfCondition(el, {
      exp: exp,
      block: el
    });
  } else {
    if (getAndRemoveAttr(el, 'v-else') != null) {
      el.else = true;
    }
    var elseif = getAndRemoveAttr(el, 'v-else-if');
    if (elseif) {
      el.elseif = elseif;
    }
  }
}

function processIfConditions (el, parent) {
  var prev = findPrevElement(parent.children);
  if (prev && prev.if) {
    addIfCondition(prev, {
      exp: el.elseif,
      block: el
    });
  } else if (true) {
    warn$2(
      "v-" + (el.elseif ? ('else-if="' + el.elseif + '"') : 'else') + " " +
      "used on element <" + (el.tag) + "> without corresponding v-if.",
      el.rawAttrsMap[el.elseif ? 'v-else-if' : 'v-else']
    );
  }
}

function findPrevElement (children) {
  var i = children.length;
  while (i--) {
    if (children[i].type === 1) {
      return children[i]
    } else {
      if ( true && children[i].text !== ' ') {
        warn$2(
          "text \"" + (children[i].text.trim()) + "\" between v-if and v-else(-if) " +
          "will be ignored.",
          children[i]
        );
      }
      children.pop();
    }
  }
}

function addIfCondition (el, condition) {
  if (!el.ifConditions) {
    el.ifConditions = [];
  }
  el.ifConditions.push(condition);
}

function processOnce (el) {
  var once$$1 = getAndRemoveAttr(el, 'v-once');
  if (once$$1 != null) {
    el.once = true;
  }
}

// handle content being passed to a component as slot,
// e.g. <template slot="xxx">, <div slot-scope="xxx">
function processSlotContent (el) {
  var slotScope;
  if (el.tag === 'template') {
    slotScope = getAndRemoveAttr(el, 'scope');
    /* istanbul ignore if */
    if ( true && slotScope) {
      warn$2(
        "the \"scope\" attribute for scoped slots have been deprecated and " +
        "replaced by \"slot-scope\" since 2.5. The new \"slot-scope\" attribute " +
        "can also be used on plain elements in addition to <template> to " +
        "denote scoped slots.",
        el.rawAttrsMap['scope'],
        true
      );
    }
    el.slotScope = slotScope || getAndRemoveAttr(el, 'slot-scope');
  } else if ((slotScope = getAndRemoveAttr(el, 'slot-scope'))) {
    /* istanbul ignore if */
    if ( true && el.attrsMap['v-for']) {
      warn$2(
        "Ambiguous combined usage of slot-scope and v-for on <" + (el.tag) + "> " +
        "(v-for takes higher priority). Use a wrapper <template> for the " +
        "scoped slot to make it clearer.",
        el.rawAttrsMap['slot-scope'],
        true
      );
    }
    el.slotScope = slotScope;
  }

  // slot="xxx"
  var slotTarget = getBindingAttr(el, 'slot');
  if (slotTarget) {
    el.slotTarget = slotTarget === '""' ? '"default"' : slotTarget;
    el.slotTargetDynamic = !!(el.attrsMap[':slot'] || el.attrsMap['v-bind:slot']);
    // preserve slot as an attribute for native shadow DOM compat
    // only for non-scoped slots.
    if (el.tag !== 'template' && !el.slotScope) {
      addAttr(el, 'slot', slotTarget, getRawBindingAttr(el, 'slot'));
    }
  }

  // 2.6 v-slot syntax
  {
    if (el.tag === 'template') {
      // v-slot on <template>
      var slotBinding = getAndRemoveAttrByRegex(el, slotRE);
      if (slotBinding) {
        if (true) {
          if (el.slotTarget || el.slotScope) {
            warn$2(
              "Unexpected mixed usage of different slot syntaxes.",
              el
            );
          }
          if (el.parent && !maybeComponent(el.parent)) {
            warn$2(
              "<template v-slot> can only appear at the root level inside " +
              "the receiving component",
              el
            );
          }
        }
        var ref = getSlotName(slotBinding);
        var name = ref.name;
        var dynamic = ref.dynamic;
        el.slotTarget = name;
        el.slotTargetDynamic = dynamic;
        el.slotScope = slotBinding.value || emptySlotScopeToken; // force it into a scoped slot for perf
      }
    } else {
      // v-slot on component, denotes default slot
      var slotBinding$1 = getAndRemoveAttrByRegex(el, slotRE);
      if (slotBinding$1) {
        if (true) {
          if (!maybeComponent(el)) {
            warn$2(
              "v-slot can only be used on components or <template>.",
              slotBinding$1
            );
          }
          if (el.slotScope || el.slotTarget) {
            warn$2(
              "Unexpected mixed usage of different slot syntaxes.",
              el
            );
          }
          if (el.scopedSlots) {
            warn$2(
              "To avoid scope ambiguity, the default slot should also use " +
              "<template> syntax when there are other named slots.",
              slotBinding$1
            );
          }
        }
        // add the component's children to its default slot
        var slots = el.scopedSlots || (el.scopedSlots = {});
        var ref$1 = getSlotName(slotBinding$1);
        var name$1 = ref$1.name;
        var dynamic$1 = ref$1.dynamic;
        var slotContainer = slots[name$1] = createASTElement('template', [], el);
        slotContainer.slotTarget = name$1;
        slotContainer.slotTargetDynamic = dynamic$1;
        slotContainer.children = el.children.filter(function (c) {
          if (!c.slotScope) {
            c.parent = slotContainer;
            return true
          }
        });
        slotContainer.slotScope = slotBinding$1.value || emptySlotScopeToken;
        // remove children as they are returned from scopedSlots now
        el.children = [];
        // mark el non-plain so data gets generated
        el.plain = false;
      }
    }
  }
}

function getSlotName (binding) {
  var name = binding.name.replace(slotRE, '');
  if (!name) {
    if (binding.name[0] !== '#') {
      name = 'default';
    } else if (true) {
      warn$2(
        "v-slot shorthand syntax requires a slot name.",
        binding
      );
    }
  }
  return dynamicArgRE.test(name)
    // dynamic [name]
    ? { name: name.slice(1, -1), dynamic: true }
    // static name
    : { name: ("\"" + name + "\""), dynamic: false }
}

// handle <slot/> outlets
function processSlotOutlet (el) {
  if (el.tag === 'slot') {
    el.slotName = getBindingAttr(el, 'name');
    if ( true && el.key) {
      warn$2(
        "`key` does not work on <slot> because slots are abstract outlets " +
        "and can possibly expand into multiple elements. " +
        "Use the key on a wrapping element instead.",
        getRawBindingAttr(el, 'key')
      );
    }
  }
}

function processComponent (el) {
  var binding;
  if ((binding = getBindingAttr(el, 'is'))) {
    el.component = binding;
  }
  if (getAndRemoveAttr(el, 'inline-template') != null) {
    el.inlineTemplate = true;
  }
}

function processAttrs (el) {
  var list = el.attrsList;
  var i, l, name, rawName, value, modifiers, syncGen, isDynamic;
  for (i = 0, l = list.length; i < l; i++) {
    name = rawName = list[i].name;
    value = list[i].value;
    if (dirRE.test(name)) {
      // mark element as dynamic
      el.hasBindings = true;
      // modifiers
      modifiers = parseModifiers(name.replace(dirRE, ''));
      // support .foo shorthand syntax for the .prop modifier
      if (modifiers) {
        name = name.replace(modifierRE, '');
      }
      if (bindRE.test(name)) { // v-bind
        name = name.replace(bindRE, '');
        value = parseFilters(value);
        isDynamic = dynamicArgRE.test(name);
        if (isDynamic) {
          name = name.slice(1, -1);
        }
        if (
           true &&
          value.trim().length === 0
        ) {
          warn$2(
            ("The value for a v-bind expression cannot be empty. Found in \"v-bind:" + name + "\"")
          );
        }
        if (modifiers) {
          if (modifiers.prop && !isDynamic) {
            name = camelize(name);
            if (name === 'innerHtml') { name = 'innerHTML'; }
          }
          if (modifiers.camel && !isDynamic) {
            name = camelize(name);
          }
          if (modifiers.sync) {
            syncGen = genAssignmentCode(value, "$event");
            if (!isDynamic) {
              addHandler(
                el,
                ("update:" + (camelize(name))),
                syncGen,
                null,
                false,
                warn$2,
                list[i]
              );
              if (hyphenate(name) !== camelize(name)) {
                addHandler(
                  el,
                  ("update:" + (hyphenate(name))),
                  syncGen,
                  null,
                  false,
                  warn$2,
                  list[i]
                );
              }
            } else {
              // handler w/ dynamic event name
              addHandler(
                el,
                ("\"update:\"+(" + name + ")"),
                syncGen,
                null,
                false,
                warn$2,
                list[i],
                true // dynamic
              );
            }
          }
        }
        if ((modifiers && modifiers.prop) || (
          !el.component && platformMustUseProp(el.tag, el.attrsMap.type, name)
        )) {
          addProp(el, name, value, list[i], isDynamic);
        } else {
          addAttr(el, name, value, list[i], isDynamic);
        }
      } else if (onRE.test(name)) { // v-on
        name = name.replace(onRE, '');
        isDynamic = dynamicArgRE.test(name);
        if (isDynamic) {
          name = name.slice(1, -1);
        }
        addHandler(el, name, value, modifiers, false, warn$2, list[i], isDynamic);
      } else { // normal directives
        name = name.replace(dirRE, '');
        // parse arg
        var argMatch = name.match(argRE);
        var arg = argMatch && argMatch[1];
        isDynamic = false;
        if (arg) {
          name = name.slice(0, -(arg.length + 1));
          if (dynamicArgRE.test(arg)) {
            arg = arg.slice(1, -1);
            isDynamic = true;
          }
        }
        addDirective(el, name, rawName, value, arg, isDynamic, modifiers, list[i]);
        if ( true && name === 'model') {
          checkForAliasModel(el, value);
        }
      }
    } else {
      // literal attribute
      if (true) {
        var res = parseText(value, delimiters);
        if (res) {
          warn$2(
            name + "=\"" + value + "\": " +
            'Interpolation inside attributes has been removed. ' +
            'Use v-bind or the colon shorthand instead. For example, ' +
            'instead of <div id="{{ val }}">, use <div :id="val">.',
            list[i]
          );
        }
      }
      addAttr(el, name, JSON.stringify(value), list[i]);
      // #6887 firefox doesn't update muted state if set via attribute
      // even immediately after element creation
      if (!el.component &&
          name === 'muted' &&
          platformMustUseProp(el.tag, el.attrsMap.type, name)) {
        addProp(el, name, 'true', list[i]);
      }
    }
  }
}

function checkInFor (el) {
  var parent = el;
  while (parent) {
    if (parent.for !== undefined) {
      return true
    }
    parent = parent.parent;
  }
  return false
}

function parseModifiers (name) {
  var match = name.match(modifierRE);
  if (match) {
    var ret = {};
    match.forEach(function (m) { ret[m.slice(1)] = true; });
    return ret
  }
}

function makeAttrsMap (attrs) {
  var map = {};
  for (var i = 0, l = attrs.length; i < l; i++) {
    if (
       true &&
      map[attrs[i].name] && !isIE && !isEdge
    ) {
      warn$2('duplicate attribute: ' + attrs[i].name, attrs[i]);
    }
    map[attrs[i].name] = attrs[i].value;
  }
  return map
}

// for script (e.g. type="x/template") or style, do not decode content
function isTextTag (el) {
  return el.tag === 'script' || el.tag === 'style'
}

function isForbiddenTag (el) {
  return (
    el.tag === 'style' ||
    (el.tag === 'script' && (
      !el.attrsMap.type ||
      el.attrsMap.type === 'text/javascript'
    ))
  )
}

var ieNSBug = /^xmlns:NS\d+/;
var ieNSPrefix = /^NS\d+:/;

/* istanbul ignore next */
function guardIESVGBug (attrs) {
  var res = [];
  for (var i = 0; i < attrs.length; i++) {
    var attr = attrs[i];
    if (!ieNSBug.test(attr.name)) {
      attr.name = attr.name.replace(ieNSPrefix, '');
      res.push(attr);
    }
  }
  return res
}

function checkForAliasModel (el, value) {
  var _el = el;
  while (_el) {
    if (_el.for && _el.alias === value) {
      warn$2(
        "<" + (el.tag) + " v-model=\"" + value + "\">: " +
        "You are binding v-model directly to a v-for iteration alias. " +
        "This will not be able to modify the v-for source array because " +
        "writing to the alias is like modifying a function local variable. " +
        "Consider using an array of objects and use v-model on an object property instead.",
        el.rawAttrsMap['v-model']
      );
    }
    _el = _el.parent;
  }
}

/*  */

function preTransformNode (el, options) {
  if (el.tag === 'input') {
    var map = el.attrsMap;
    if (!map['v-model']) {
      return
    }

    var typeBinding;
    if (map[':type'] || map['v-bind:type']) {
      typeBinding = getBindingAttr(el, 'type');
    }
    if (!map.type && !typeBinding && map['v-bind']) {
      typeBinding = "(" + (map['v-bind']) + ").type";
    }

    if (typeBinding) {
      var ifCondition = getAndRemoveAttr(el, 'v-if', true);
      var ifConditionExtra = ifCondition ? ("&&(" + ifCondition + ")") : "";
      var hasElse = getAndRemoveAttr(el, 'v-else', true) != null;
      var elseIfCondition = getAndRemoveAttr(el, 'v-else-if', true);
      // 1. checkbox
      var branch0 = cloneASTElement(el);
      // process for on the main node
      processFor(branch0);
      addRawAttr(branch0, 'type', 'checkbox');
      processElement(branch0, options);
      branch0.processed = true; // prevent it from double-processed
      branch0.if = "(" + typeBinding + ")==='checkbox'" + ifConditionExtra;
      addIfCondition(branch0, {
        exp: branch0.if,
        block: branch0
      });
      // 2. add radio else-if condition
      var branch1 = cloneASTElement(el);
      getAndRemoveAttr(branch1, 'v-for', true);
      addRawAttr(branch1, 'type', 'radio');
      processElement(branch1, options);
      addIfCondition(branch0, {
        exp: "(" + typeBinding + ")==='radio'" + ifConditionExtra,
        block: branch1
      });
      // 3. other
      var branch2 = cloneASTElement(el);
      getAndRemoveAttr(branch2, 'v-for', true);
      addRawAttr(branch2, ':type', typeBinding);
      processElement(branch2, options);
      addIfCondition(branch0, {
        exp: ifCondition,
        block: branch2
      });

      if (hasElse) {
        branch0.else = true;
      } else if (elseIfCondition) {
        branch0.elseif = elseIfCondition;
      }

      return branch0
    }
  }
}

function cloneASTElement (el) {
  return createASTElement(el.tag, el.attrsList.slice(), el.parent)
}

var model$1 = {
  preTransformNode: preTransformNode
};

var modules$1 = [
  klass$1,
  style$1,
  model$1
];

/*  */

function text (el, dir) {
  if (dir.value) {
    addProp(el, 'textContent', ("_s(" + (dir.value) + ")"), dir);
  }
}

/*  */

function html (el, dir) {
  if (dir.value) {
    addProp(el, 'innerHTML', ("_s(" + (dir.value) + ")"), dir);
  }
}

var directives$1 = {
  model: model,
  text: text,
  html: html
};

/*  */

var baseOptions = {
  expectHTML: true,
  modules: modules$1,
  directives: directives$1,
  isPreTag: isPreTag,
  isUnaryTag: isUnaryTag,
  mustUseProp: mustUseProp,
  canBeLeftOpenTag: canBeLeftOpenTag,
  isReservedTag: isReservedTag,
  getTagNamespace: getTagNamespace,
  staticKeys: genStaticKeys(modules$1)
};

/*  */

var isStaticKey;
var isPlatformReservedTag;

var genStaticKeysCached = cached(genStaticKeys$1);

/**
 * Goal of the optimizer: walk the generated template AST tree
 * and detect sub-trees that are purely static, i.e. parts of
 * the DOM that never needs to change.
 *
 * Once we detect these sub-trees, we can:
 *
 * 1. Hoist them into constants, so that we no longer need to
 *    create fresh nodes for them on each re-render;
 * 2. Completely skip them in the patching process.
 */
function optimize (root, options) {
  if (!root) { return }
  isStaticKey = genStaticKeysCached(options.staticKeys || '');
  isPlatformReservedTag = options.isReservedTag || no;
  // first pass: mark all non-static nodes.
  markStatic$1(root);
  // second pass: mark static roots.
  markStaticRoots(root, false);
}

function genStaticKeys$1 (keys) {
  return makeMap(
    'type,tag,attrsList,attrsMap,plain,parent,children,attrs,start,end,rawAttrsMap' +
    (keys ? ',' + keys : '')
  )
}

function markStatic$1 (node) {
  node.static = isStatic(node);
  if (node.type === 1) {
    // do not make component slot content static. this avoids
    // 1. components not able to mutate slot nodes
    // 2. static slot content fails for hot-reloading
    if (
      !isPlatformReservedTag(node.tag) &&
      node.tag !== 'slot' &&
      node.attrsMap['inline-template'] == null
    ) {
      return
    }
    for (var i = 0, l = node.children.length; i < l; i++) {
      var child = node.children[i];
      markStatic$1(child);
      if (!child.static) {
        node.static = false;
      }
    }
    if (node.ifConditions) {
      for (var i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++) {
        var block = node.ifConditions[i$1].block;
        markStatic$1(block);
        if (!block.static) {
          node.static = false;
        }
      }
    }
  }
}

function markStaticRoots (node, isInFor) {
  if (node.type === 1) {
    if (node.static || node.once) {
      node.staticInFor = isInFor;
    }
    // For a node to qualify as a static root, it should have children that
    // are not just static text. Otherwise the cost of hoisting out will
    // outweigh the benefits and it's better off to just always render it fresh.
    if (node.static && node.children.length && !(
      node.children.length === 1 &&
      node.children[0].type === 3
    )) {
      node.staticRoot = true;
      return
    } else {
      node.staticRoot = false;
    }
    if (node.children) {
      for (var i = 0, l = node.children.length; i < l; i++) {
        markStaticRoots(node.children[i], isInFor || !!node.for);
      }
    }
    if (node.ifConditions) {
      for (var i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++) {
        markStaticRoots(node.ifConditions[i$1].block, isInFor);
      }
    }
  }
}

function isStatic (node) {
  if (node.type === 2) { // expression
    return false
  }
  if (node.type === 3) { // text
    return true
  }
  return !!(node.pre || (
    !node.hasBindings && // no dynamic bindings
    !node.if && !node.for && // not v-if or v-for or v-else
    !isBuiltInTag(node.tag) && // not a built-in
    isPlatformReservedTag(node.tag) && // not a component
    !isDirectChildOfTemplateFor(node) &&
    Object.keys(node).every(isStaticKey)
  ))
}

function isDirectChildOfTemplateFor (node) {
  while (node.parent) {
    node = node.parent;
    if (node.tag !== 'template') {
      return false
    }
    if (node.for) {
      return true
    }
  }
  return false
}

/*  */

var fnExpRE = /^([\w$_]+|\([^)]*?\))\s*=>|^function(?:\s+[\w$]+)?\s*\(/;
var fnInvokeRE = /\([^)]*?\);*$/;
var simplePathRE = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['[^']*?']|\["[^"]*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*$/;

// KeyboardEvent.keyCode aliases
var keyCodes = {
  esc: 27,
  tab: 9,
  enter: 13,
  space: 32,
  up: 38,
  left: 37,
  right: 39,
  down: 40,
  'delete': [8, 46]
};

// KeyboardEvent.key aliases
var keyNames = {
  // #7880: IE11 and Edge use `Esc` for Escape key name.
  esc: ['Esc', 'Escape'],
  tab: 'Tab',
  enter: 'Enter',
  // #9112: IE11 uses `Spacebar` for Space key name.
  space: [' ', 'Spacebar'],
  // #7806: IE11 uses key names without `Arrow` prefix for arrow keys.
  up: ['Up', 'ArrowUp'],
  left: ['Left', 'ArrowLeft'],
  right: ['Right', 'ArrowRight'],
  down: ['Down', 'ArrowDown'],
  // #9112: IE11 uses `Del` for Delete key name.
  'delete': ['Backspace', 'Delete', 'Del']
};

// #4868: modifiers that prevent the execution of the listener
// need to explicitly return null so that we can determine whether to remove
// the listener for .once
var genGuard = function (condition) { return ("if(" + condition + ")return null;"); };

var modifierCode = {
  stop: '$event.stopPropagation();',
  prevent: '$event.preventDefault();',
  self: genGuard("$event.target !== $event.currentTarget"),
  ctrl: genGuard("!$event.ctrlKey"),
  shift: genGuard("!$event.shiftKey"),
  alt: genGuard("!$event.altKey"),
  meta: genGuard("!$event.metaKey"),
  left: genGuard("'button' in $event && $event.button !== 0"),
  middle: genGuard("'button' in $event && $event.button !== 1"),
  right: genGuard("'button' in $event && $event.button !== 2")
};

function genHandlers (
  events,
  isNative
) {
  var prefix = isNative ? 'nativeOn:' : 'on:';
  var staticHandlers = "";
  var dynamicHandlers = "";
  for (var name in events) {
    var handlerCode = genHandler(events[name]);
    if (events[name] && events[name].dynamic) {
      dynamicHandlers += name + "," + handlerCode + ",";
    } else {
      staticHandlers += "\"" + name + "\":" + handlerCode + ",";
    }
  }
  staticHandlers = "{" + (staticHandlers.slice(0, -1)) + "}";
  if (dynamicHandlers) {
    return prefix + "_d(" + staticHandlers + ",[" + (dynamicHandlers.slice(0, -1)) + "])"
  } else {
    return prefix + staticHandlers
  }
}

function genHandler (handler) {
  if (!handler) {
    return 'function(){}'
  }

  if (Array.isArray(handler)) {
    return ("[" + (handler.map(function (handler) { return genHandler(handler); }).join(',')) + "]")
  }

  var isMethodPath = simplePathRE.test(handler.value);
  var isFunctionExpression = fnExpRE.test(handler.value);
  var isFunctionInvocation = simplePathRE.test(handler.value.replace(fnInvokeRE, ''));

  if (!handler.modifiers) {
    if (isMethodPath || isFunctionExpression) {
      return handler.value
    }
    return ("function($event){" + (isFunctionInvocation ? ("return " + (handler.value)) : handler.value) + "}") // inline statement
  } else {
    var code = '';
    var genModifierCode = '';
    var keys = [];
    for (var key in handler.modifiers) {
      if (modifierCode[key]) {
        genModifierCode += modifierCode[key];
        // left/right
        if (keyCodes[key]) {
          keys.push(key);
        }
      } else if (key === 'exact') {
        var modifiers = (handler.modifiers);
        genModifierCode += genGuard(
          ['ctrl', 'shift', 'alt', 'meta']
            .filter(function (keyModifier) { return !modifiers[keyModifier]; })
            .map(function (keyModifier) { return ("$event." + keyModifier + "Key"); })
            .join('||')
        );
      } else {
        keys.push(key);
      }
    }
    if (keys.length) {
      code += genKeyFilter(keys);
    }
    // Make sure modifiers like prevent and stop get executed after key filtering
    if (genModifierCode) {
      code += genModifierCode;
    }
    var handlerCode = isMethodPath
      ? ("return " + (handler.value) + ".apply(null, arguments)")
      : isFunctionExpression
        ? ("return (" + (handler.value) + ").apply(null, arguments)")
        : isFunctionInvocation
          ? ("return " + (handler.value))
          : handler.value;
    return ("function($event){" + code + handlerCode + "}")
  }
}

function genKeyFilter (keys) {
  return (
    // make sure the key filters only apply to KeyboardEvents
    // #9441: can't use 'keyCode' in $event because Chrome autofill fires fake
    // key events that do not have keyCode property...
    "if(!$event.type.indexOf('key')&&" +
    (keys.map(genFilterCode).join('&&')) + ")return null;"
  )
}

function genFilterCode (key) {
  var keyVal = parseInt(key, 10);
  if (keyVal) {
    return ("$event.keyCode!==" + keyVal)
  }
  var keyCode = keyCodes[key];
  var keyName = keyNames[key];
  return (
    "_k($event.keyCode," +
    (JSON.stringify(key)) + "," +
    (JSON.stringify(keyCode)) + "," +
    "$event.key," +
    "" + (JSON.stringify(keyName)) +
    ")"
  )
}

/*  */

function on (el, dir) {
  if ( true && dir.modifiers) {
    warn("v-on without argument does not support modifiers.");
  }
  el.wrapListeners = function (code) { return ("_g(" + code + "," + (dir.value) + ")"); };
}

/*  */

function bind$1 (el, dir) {
  el.wrapData = function (code) {
    return ("_b(" + code + ",'" + (el.tag) + "'," + (dir.value) + "," + (dir.modifiers && dir.modifiers.prop ? 'true' : 'false') + (dir.modifiers && dir.modifiers.sync ? ',true' : '') + ")")
  };
}

/*  */

var baseDirectives = {
  on: on,
  bind: bind$1,
  cloak: noop
};

/*  */





var CodegenState = function CodegenState (options) {
  this.options = options;
  this.warn = options.warn || baseWarn;
  this.transforms = pluckModuleFunction(options.modules, 'transformCode');
  this.dataGenFns = pluckModuleFunction(options.modules, 'genData');
  this.directives = extend(extend({}, baseDirectives), options.directives);
  var isReservedTag = options.isReservedTag || no;
  this.maybeComponent = function (el) { return !!el.component || !isReservedTag(el.tag); };
  this.onceId = 0;
  this.staticRenderFns = [];
  this.pre = false;
};



function generate (
  ast,
  options
) {
  var state = new CodegenState(options);
  // fix #11483, Root level <script> tags should not be rendered.
  var code = ast ? (ast.tag === 'script' ? 'null' : genElement(ast, state)) : '_c("div")';
  return {
    render: ("with(this){return " + code + "}"),
    staticRenderFns: state.staticRenderFns
  }
}

function genElement (el, state) {
  if (el.parent) {
    el.pre = el.pre || el.parent.pre;
  }

  if (el.staticRoot && !el.staticProcessed) {
    return genStatic(el, state)
  } else if (el.once && !el.onceProcessed) {
    return genOnce(el, state)
  } else if (el.for && !el.forProcessed) {
    return genFor(el, state)
  } else if (el.if && !el.ifProcessed) {
    return genIf(el, state)
  } else if (el.tag === 'template' && !el.slotTarget && !state.pre) {
    return genChildren(el, state) || 'void 0'
  } else if (el.tag === 'slot') {
    return genSlot(el, state)
  } else {
    // component or element
    var code;
    if (el.component) {
      code = genComponent(el.component, el, state);
    } else {
      var data;
      if (!el.plain || (el.pre && state.maybeComponent(el))) {
        data = genData$2(el, state);
      }

      var children = el.inlineTemplate ? null : genChildren(el, state, true);
      code = "_c('" + (el.tag) + "'" + (data ? ("," + data) : '') + (children ? ("," + children) : '') + ")";
    }
    // module transforms
    for (var i = 0; i < state.transforms.length; i++) {
      code = state.transforms[i](el, code);
    }
    return code
  }
}

// hoist static sub-trees out
function genStatic (el, state) {
  el.staticProcessed = true;
  // Some elements (templates) need to behave differently inside of a v-pre
  // node.  All pre nodes are static roots, so we can use this as a location to
  // wrap a state change and reset it upon exiting the pre node.
  var originalPreState = state.pre;
  if (el.pre) {
    state.pre = el.pre;
  }
  state.staticRenderFns.push(("with(this){return " + (genElement(el, state)) + "}"));
  state.pre = originalPreState;
  return ("_m(" + (state.staticRenderFns.length - 1) + (el.staticInFor ? ',true' : '') + ")")
}

// v-once
function genOnce (el, state) {
  el.onceProcessed = true;
  if (el.if && !el.ifProcessed) {
    return genIf(el, state)
  } else if (el.staticInFor) {
    var key = '';
    var parent = el.parent;
    while (parent) {
      if (parent.for) {
        key = parent.key;
        break
      }
      parent = parent.parent;
    }
    if (!key) {
       true && state.warn(
        "v-once can only be used inside v-for that is keyed. ",
        el.rawAttrsMap['v-once']
      );
      return genElement(el, state)
    }
    return ("_o(" + (genElement(el, state)) + "," + (state.onceId++) + "," + key + ")")
  } else {
    return genStatic(el, state)
  }
}

function genIf (
  el,
  state,
  altGen,
  altEmpty
) {
  el.ifProcessed = true; // avoid recursion
  return genIfConditions(el.ifConditions.slice(), state, altGen, altEmpty)
}

function genIfConditions (
  conditions,
  state,
  altGen,
  altEmpty
) {
  if (!conditions.length) {
    return altEmpty || '_e()'
  }

  var condition = conditions.shift();
  if (condition.exp) {
    return ("(" + (condition.exp) + ")?" + (genTernaryExp(condition.block)) + ":" + (genIfConditions(conditions, state, altGen, altEmpty)))
  } else {
    return ("" + (genTernaryExp(condition.block)))
  }

  // v-if with v-once should generate code like (a)?_m(0):_m(1)
  function genTernaryExp (el) {
    return altGen
      ? altGen(el, state)
      : el.once
        ? genOnce(el, state)
        : genElement(el, state)
  }
}

function genFor (
  el,
  state,
  altGen,
  altHelper
) {
  var exp = el.for;
  var alias = el.alias;
  var iterator1 = el.iterator1 ? ("," + (el.iterator1)) : '';
  var iterator2 = el.iterator2 ? ("," + (el.iterator2)) : '';

  if ( true &&
    state.maybeComponent(el) &&
    el.tag !== 'slot' &&
    el.tag !== 'template' &&
    !el.key
  ) {
    state.warn(
      "<" + (el.tag) + " v-for=\"" + alias + " in " + exp + "\">: component lists rendered with " +
      "v-for should have explicit keys. " +
      "See https://vuejs.org/guide/list.html#key for more info.",
      el.rawAttrsMap['v-for'],
      true /* tip */
    );
  }

  el.forProcessed = true; // avoid recursion
  return (altHelper || '_l') + "((" + exp + ")," +
    "function(" + alias + iterator1 + iterator2 + "){" +
      "return " + ((altGen || genElement)(el, state)) +
    '})'
}

function genData$2 (el, state) {
  var data = '{';

  // directives first.
  // directives may mutate the el's other properties before they are generated.
  var dirs = genDirectives(el, state);
  if (dirs) { data += dirs + ','; }

  // key
  if (el.key) {
    data += "key:" + (el.key) + ",";
  }
  // ref
  if (el.ref) {
    data += "ref:" + (el.ref) + ",";
  }
  if (el.refInFor) {
    data += "refInFor:true,";
  }
  // pre
  if (el.pre) {
    data += "pre:true,";
  }
  // record original tag name for components using "is" attribute
  if (el.component) {
    data += "tag:\"" + (el.tag) + "\",";
  }
  // module data generation functions
  for (var i = 0; i < state.dataGenFns.length; i++) {
    data += state.dataGenFns[i](el);
  }
  // attributes
  if (el.attrs) {
    data += "attrs:" + (genProps(el.attrs)) + ",";
  }
  // DOM props
  if (el.props) {
    data += "domProps:" + (genProps(el.props)) + ",";
  }
  // event handlers
  if (el.events) {
    data += (genHandlers(el.events, false)) + ",";
  }
  if (el.nativeEvents) {
    data += (genHandlers(el.nativeEvents, true)) + ",";
  }
  // slot target
  // only for non-scoped slots
  if (el.slotTarget && !el.slotScope) {
    data += "slot:" + (el.slotTarget) + ",";
  }
  // scoped slots
  if (el.scopedSlots) {
    data += (genScopedSlots(el, el.scopedSlots, state)) + ",";
  }
  // component v-model
  if (el.model) {
    data += "model:{value:" + (el.model.value) + ",callback:" + (el.model.callback) + ",expression:" + (el.model.expression) + "},";
  }
  // inline-template
  if (el.inlineTemplate) {
    var inlineTemplate = genInlineTemplate(el, state);
    if (inlineTemplate) {
      data += inlineTemplate + ",";
    }
  }
  data = data.replace(/,$/, '') + '}';
  // v-bind dynamic argument wrap
  // v-bind with dynamic arguments must be applied using the same v-bind object
  // merge helper so that class/style/mustUseProp attrs are handled correctly.
  if (el.dynamicAttrs) {
    data = "_b(" + data + ",\"" + (el.tag) + "\"," + (genProps(el.dynamicAttrs)) + ")";
  }
  // v-bind data wrap
  if (el.wrapData) {
    data = el.wrapData(data);
  }
  // v-on data wrap
  if (el.wrapListeners) {
    data = el.wrapListeners(data);
  }
  return data
}

function genDirectives (el, state) {
  var dirs = el.directives;
  if (!dirs) { return }
  var res = 'directives:[';
  var hasRuntime = false;
  var i, l, dir, needRuntime;
  for (i = 0, l = dirs.length; i < l; i++) {
    dir = dirs[i];
    needRuntime = true;
    var gen = state.directives[dir.name];
    if (gen) {
      // compile-time directive that manipulates AST.
      // returns true if it also needs a runtime counterpart.
      needRuntime = !!gen(el, dir, state.warn);
    }
    if (needRuntime) {
      hasRuntime = true;
      res += "{name:\"" + (dir.name) + "\",rawName:\"" + (dir.rawName) + "\"" + (dir.value ? (",value:(" + (dir.value) + "),expression:" + (JSON.stringify(dir.value))) : '') + (dir.arg ? (",arg:" + (dir.isDynamicArg ? dir.arg : ("\"" + (dir.arg) + "\""))) : '') + (dir.modifiers ? (",modifiers:" + (JSON.stringify(dir.modifiers))) : '') + "},";
    }
  }
  if (hasRuntime) {
    return res.slice(0, -1) + ']'
  }
}

function genInlineTemplate (el, state) {
  var ast = el.children[0];
  if ( true && (
    el.children.length !== 1 || ast.type !== 1
  )) {
    state.warn(
      'Inline-template components must have exactly one child element.',
      { start: el.start }
    );
  }
  if (ast && ast.type === 1) {
    var inlineRenderFns = generate(ast, state.options);
    return ("inlineTemplate:{render:function(){" + (inlineRenderFns.render) + "},staticRenderFns:[" + (inlineRenderFns.staticRenderFns.map(function (code) { return ("function(){" + code + "}"); }).join(',')) + "]}")
  }
}

function genScopedSlots (
  el,
  slots,
  state
) {
  // by default scoped slots are considered "stable", this allows child
  // components with only scoped slots to skip forced updates from parent.
  // but in some cases we have to bail-out of this optimization
  // for example if the slot contains dynamic names, has v-if or v-for on them...
  var needsForceUpdate = el.for || Object.keys(slots).some(function (key) {
    var slot = slots[key];
    return (
      slot.slotTargetDynamic ||
      slot.if ||
      slot.for ||
      containsSlotChild(slot) // is passing down slot from parent which may be dynamic
    )
  });

  // #9534: if a component with scoped slots is inside a conditional branch,
  // it's possible for the same component to be reused but with different
  // compiled slot content. To avoid that, we generate a unique key based on
  // the generated code of all the slot contents.
  var needsKey = !!el.if;

  // OR when it is inside another scoped slot or v-for (the reactivity may be
  // disconnected due to the intermediate scope variable)
  // #9438, #9506
  // TODO: this can be further optimized by properly analyzing in-scope bindings
  // and skip force updating ones that do not actually use scope variables.
  if (!needsForceUpdate) {
    var parent = el.parent;
    while (parent) {
      if (
        (parent.slotScope && parent.slotScope !== emptySlotScopeToken) ||
        parent.for
      ) {
        needsForceUpdate = true;
        break
      }
      if (parent.if) {
        needsKey = true;
      }
      parent = parent.parent;
    }
  }

  var generatedSlots = Object.keys(slots)
    .map(function (key) { return genScopedSlot(slots[key], state); })
    .join(',');

  return ("scopedSlots:_u([" + generatedSlots + "]" + (needsForceUpdate ? ",null,true" : "") + (!needsForceUpdate && needsKey ? (",null,false," + (hash(generatedSlots))) : "") + ")")
}

function hash(str) {
  var hash = 5381;
  var i = str.length;
  while(i) {
    hash = (hash * 33) ^ str.charCodeAt(--i);
  }
  return hash >>> 0
}

function containsSlotChild (el) {
  if (el.type === 1) {
    if (el.tag === 'slot') {
      return true
    }
    return el.children.some(containsSlotChild)
  }
  return false
}

function genScopedSlot (
  el,
  state
) {
  var isLegacySyntax = el.attrsMap['slot-scope'];
  if (el.if && !el.ifProcessed && !isLegacySyntax) {
    return genIf(el, state, genScopedSlot, "null")
  }
  if (el.for && !el.forProcessed) {
    return genFor(el, state, genScopedSlot)
  }
  var slotScope = el.slotScope === emptySlotScopeToken
    ? ""
    : String(el.slotScope);
  var fn = "function(" + slotScope + "){" +
    "return " + (el.tag === 'template'
      ? el.if && isLegacySyntax
        ? ("(" + (el.if) + ")?" + (genChildren(el, state) || 'undefined') + ":undefined")
        : genChildren(el, state) || 'undefined'
      : genElement(el, state)) + "}";
  // reverse proxy v-slot without scope on this.$slots
  var reverseProxy = slotScope ? "" : ",proxy:true";
  return ("{key:" + (el.slotTarget || "\"default\"") + ",fn:" + fn + reverseProxy + "}")
}

function genChildren (
  el,
  state,
  checkSkip,
  altGenElement,
  altGenNode
) {
  var children = el.children;
  if (children.length) {
    var el$1 = children[0];
    // optimize single v-for
    if (children.length === 1 &&
      el$1.for &&
      el$1.tag !== 'template' &&
      el$1.tag !== 'slot'
    ) {
      var normalizationType = checkSkip
        ? state.maybeComponent(el$1) ? ",1" : ",0"
        : "";
      return ("" + ((altGenElement || genElement)(el$1, state)) + normalizationType)
    }
    var normalizationType$1 = checkSkip
      ? getNormalizationType(children, state.maybeComponent)
      : 0;
    var gen = altGenNode || genNode;
    return ("[" + (children.map(function (c) { return gen(c, state); }).join(',')) + "]" + (normalizationType$1 ? ("," + normalizationType$1) : ''))
  }
}

// determine the normalization needed for the children array.
// 0: no normalization needed
// 1: simple normalization needed (possible 1-level deep nested array)
// 2: full normalization needed
function getNormalizationType (
  children,
  maybeComponent
) {
  var res = 0;
  for (var i = 0; i < children.length; i++) {
    var el = children[i];
    if (el.type !== 1) {
      continue
    }
    if (needsNormalization(el) ||
        (el.ifConditions && el.ifConditions.some(function (c) { return needsNormalization(c.block); }))) {
      res = 2;
      break
    }
    if (maybeComponent(el) ||
        (el.ifConditions && el.ifConditions.some(function (c) { return maybeComponent(c.block); }))) {
      res = 1;
    }
  }
  return res
}

function needsNormalization (el) {
  return el.for !== undefined || el.tag === 'template' || el.tag === 'slot'
}

function genNode (node, state) {
  if (node.type === 1) {
    return genElement(node, state)
  } else if (node.type === 3 && node.isComment) {
    return genComment(node)
  } else {
    return genText(node)
  }
}

function genText (text) {
  return ("_v(" + (text.type === 2
    ? text.expression // no need for () because already wrapped in _s()
    : transformSpecialNewlines(JSON.stringify(text.text))) + ")")
}

function genComment (comment) {
  return ("_e(" + (JSON.stringify(comment.text)) + ")")
}

function genSlot (el, state) {
  var slotName = el.slotName || '"default"';
  var children = genChildren(el, state);
  var res = "_t(" + slotName + (children ? (",function(){return " + children + "}") : '');
  var attrs = el.attrs || el.dynamicAttrs
    ? genProps((el.attrs || []).concat(el.dynamicAttrs || []).map(function (attr) { return ({
        // slot props are camelized
        name: camelize(attr.name),
        value: attr.value,
        dynamic: attr.dynamic
      }); }))
    : null;
  var bind$$1 = el.attrsMap['v-bind'];
  if ((attrs || bind$$1) && !children) {
    res += ",null";
  }
  if (attrs) {
    res += "," + attrs;
  }
  if (bind$$1) {
    res += (attrs ? '' : ',null') + "," + bind$$1;
  }
  return res + ')'
}

// componentName is el.component, take it as argument to shun flow's pessimistic refinement
function genComponent (
  componentName,
  el,
  state
) {
  var children = el.inlineTemplate ? null : genChildren(el, state, true);
  return ("_c(" + componentName + "," + (genData$2(el, state)) + (children ? ("," + children) : '') + ")")
}

function genProps (props) {
  var staticProps = "";
  var dynamicProps = "";
  for (var i = 0; i < props.length; i++) {
    var prop = props[i];
    var value = transformSpecialNewlines(prop.value);
    if (prop.dynamic) {
      dynamicProps += (prop.name) + "," + value + ",";
    } else {
      staticProps += "\"" + (prop.name) + "\":" + value + ",";
    }
  }
  staticProps = "{" + (staticProps.slice(0, -1)) + "}";
  if (dynamicProps) {
    return ("_d(" + staticProps + ",[" + (dynamicProps.slice(0, -1)) + "])")
  } else {
    return staticProps
  }
}

// #3895, #4268
function transformSpecialNewlines (text) {
  return text
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

/*  */



// these keywords should not appear inside expressions, but operators like
// typeof, instanceof and in are allowed
var prohibitedKeywordRE = new RegExp('\\b' + (
  'do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,' +
  'super,throw,while,yield,delete,export,import,return,switch,default,' +
  'extends,finally,continue,debugger,function,arguments'
).split(',').join('\\b|\\b') + '\\b');

// these unary operators should not be used as property/method names
var unaryOperatorsRE = new RegExp('\\b' + (
  'delete,typeof,void'
).split(',').join('\\s*\\([^\\)]*\\)|\\b') + '\\s*\\([^\\)]*\\)');

// strip strings in expressions
var stripStringRE = /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`/g;

// detect problematic expressions in a template
function detectErrors (ast, warn) {
  if (ast) {
    checkNode(ast, warn);
  }
}

function checkNode (node, warn) {
  if (node.type === 1) {
    for (var name in node.attrsMap) {
      if (dirRE.test(name)) {
        var value = node.attrsMap[name];
        if (value) {
          var range = node.rawAttrsMap[name];
          if (name === 'v-for') {
            checkFor(node, ("v-for=\"" + value + "\""), warn, range);
          } else if (name === 'v-slot' || name[0] === '#') {
            checkFunctionParameterExpression(value, (name + "=\"" + value + "\""), warn, range);
          } else if (onRE.test(name)) {
            checkEvent(value, (name + "=\"" + value + "\""), warn, range);
          } else {
            checkExpression(value, (name + "=\"" + value + "\""), warn, range);
          }
        }
      }
    }
    if (node.children) {
      for (var i = 0; i < node.children.length; i++) {
        checkNode(node.children[i], warn);
      }
    }
  } else if (node.type === 2) {
    checkExpression(node.expression, node.text, warn, node);
  }
}

function checkEvent (exp, text, warn, range) {
  var stripped = exp.replace(stripStringRE, '');
  var keywordMatch = stripped.match(unaryOperatorsRE);
  if (keywordMatch && stripped.charAt(keywordMatch.index - 1) !== '$') {
    warn(
      "avoid using JavaScript unary operator as property name: " +
      "\"" + (keywordMatch[0]) + "\" in expression " + (text.trim()),
      range
    );
  }
  checkExpression(exp, text, warn, range);
}

function checkFor (node, text, warn, range) {
  checkExpression(node.for || '', text, warn, range);
  checkIdentifier(node.alias, 'v-for alias', text, warn, range);
  checkIdentifier(node.iterator1, 'v-for iterator', text, warn, range);
  checkIdentifier(node.iterator2, 'v-for iterator', text, warn, range);
}

function checkIdentifier (
  ident,
  type,
  text,
  warn,
  range
) {
  if (typeof ident === 'string') {
    try {
      new Function(("var " + ident + "=_"));
    } catch (e) {
      warn(("invalid " + type + " \"" + ident + "\" in expression: " + (text.trim())), range);
    }
  }
}

function checkExpression (exp, text, warn, range) {
  try {
    new Function(("return " + exp));
  } catch (e) {
    var keywordMatch = exp.replace(stripStringRE, '').match(prohibitedKeywordRE);
    if (keywordMatch) {
      warn(
        "avoid using JavaScript keyword as property name: " +
        "\"" + (keywordMatch[0]) + "\"\n  Raw expression: " + (text.trim()),
        range
      );
    } else {
      warn(
        "invalid expression: " + (e.message) + " in\n\n" +
        "    " + exp + "\n\n" +
        "  Raw expression: " + (text.trim()) + "\n",
        range
      );
    }
  }
}

function checkFunctionParameterExpression (exp, text, warn, range) {
  try {
    new Function(exp, '');
  } catch (e) {
    warn(
      "invalid function parameter expression: " + (e.message) + " in\n\n" +
      "    " + exp + "\n\n" +
      "  Raw expression: " + (text.trim()) + "\n",
      range
    );
  }
}

/*  */

var range = 2;

function generateCodeFrame (
  source,
  start,
  end
) {
  if ( start === void 0 ) start = 0;
  if ( end === void 0 ) end = source.length;

  var lines = source.split(/\r?\n/);
  var count = 0;
  var res = [];
  for (var i = 0; i < lines.length; i++) {
    count += lines[i].length + 1;
    if (count >= start) {
      for (var j = i - range; j <= i + range || end > count; j++) {
        if (j < 0 || j >= lines.length) { continue }
        res.push(("" + (j + 1) + (repeat$1(" ", 3 - String(j + 1).length)) + "|  " + (lines[j])));
        var lineLength = lines[j].length;
        if (j === i) {
          // push underline
          var pad = start - (count - lineLength) + 1;
          var length = end > count ? lineLength - pad : end - start;
          res.push("   |  " + repeat$1(" ", pad) + repeat$1("^", length));
        } else if (j > i) {
          if (end > count) {
            var length$1 = Math.min(end - count, lineLength);
            res.push("   |  " + repeat$1("^", length$1));
          }
          count += lineLength + 1;
        }
      }
      break
    }
  }
  return res.join('\n')
}

function repeat$1 (str, n) {
  var result = '';
  if (n > 0) {
    while (true) { // eslint-disable-line
      if (n & 1) { result += str; }
      n >>>= 1;
      if (n <= 0) { break }
      str += str;
    }
  }
  return result
}

/*  */



function createFunction (code, errors) {
  try {
    return new Function(code)
  } catch (err) {
    errors.push({ err: err, code: code });
    return noop
  }
}

function createCompileToFunctionFn (compile) {
  var cache = Object.create(null);

  return function compileToFunctions (
    template,
    options,
    vm
  ) {
    options = extend({}, options);
    var warn$$1 = options.warn || warn;
    delete options.warn;

    /* istanbul ignore if */
    if (true) {
      // detect possible CSP restriction
      try {
        new Function('return 1');
      } catch (e) {
        if (e.toString().match(/unsafe-eval|CSP/)) {
          warn$$1(
            'It seems you are using the standalone build of Vue.js in an ' +
            'environment with Content Security Policy that prohibits unsafe-eval. ' +
            'The template compiler cannot work in this environment. Consider ' +
            'relaxing the policy to allow unsafe-eval or pre-compiling your ' +
            'templates into render functions.'
          );
        }
      }
    }

    // check cache
    var key = options.delimiters
      ? String(options.delimiters) + template
      : template;
    if (cache[key]) {
      return cache[key]
    }

    // compile
    var compiled = compile(template, options);

    // check compilation errors/tips
    if (true) {
      if (compiled.errors && compiled.errors.length) {
        if (options.outputSourceRange) {
          compiled.errors.forEach(function (e) {
            warn$$1(
              "Error compiling template:\n\n" + (e.msg) + "\n\n" +
              generateCodeFrame(template, e.start, e.end),
              vm
            );
          });
        } else {
          warn$$1(
            "Error compiling template:\n\n" + template + "\n\n" +
            compiled.errors.map(function (e) { return ("- " + e); }).join('\n') + '\n',
            vm
          );
        }
      }
      if (compiled.tips && compiled.tips.length) {
        if (options.outputSourceRange) {
          compiled.tips.forEach(function (e) { return tip(e.msg, vm); });
        } else {
          compiled.tips.forEach(function (msg) { return tip(msg, vm); });
        }
      }
    }

    // turn code into functions
    var res = {};
    var fnGenErrors = [];
    res.render = createFunction(compiled.render, fnGenErrors);
    res.staticRenderFns = compiled.staticRenderFns.map(function (code) {
      return createFunction(code, fnGenErrors)
    });

    // check function generation errors.
    // this should only happen if there is a bug in the compiler itself.
    // mostly for codegen development use
    /* istanbul ignore if */
    if (true) {
      if ((!compiled.errors || !compiled.errors.length) && fnGenErrors.length) {
        warn$$1(
          "Failed to generate render function:\n\n" +
          fnGenErrors.map(function (ref) {
            var err = ref.err;
            var code = ref.code;

            return ((err.toString()) + " in\n\n" + code + "\n");
        }).join('\n'),
          vm
        );
      }
    }

    return (cache[key] = res)
  }
}

/*  */

function createCompilerCreator (baseCompile) {
  return function createCompiler (baseOptions) {
    function compile (
      template,
      options
    ) {
      var finalOptions = Object.create(baseOptions);
      var errors = [];
      var tips = [];

      var warn = function (msg, range, tip) {
        (tip ? tips : errors).push(msg);
      };

      if (options) {
        if ( true && options.outputSourceRange) {
          // $flow-disable-line
          var leadingSpaceLength = template.match(/^\s*/)[0].length;

          warn = function (msg, range, tip) {
            var data = { msg: msg };
            if (range) {
              if (range.start != null) {
                data.start = range.start + leadingSpaceLength;
              }
              if (range.end != null) {
                data.end = range.end + leadingSpaceLength;
              }
            }
            (tip ? tips : errors).push(data);
          };
        }
        // merge custom modules
        if (options.modules) {
          finalOptions.modules =
            (baseOptions.modules || []).concat(options.modules);
        }
        // merge custom directives
        if (options.directives) {
          finalOptions.directives = extend(
            Object.create(baseOptions.directives || null),
            options.directives
          );
        }
        // copy other options
        for (var key in options) {
          if (key !== 'modules' && key !== 'directives') {
            finalOptions[key] = options[key];
          }
        }
      }

      finalOptions.warn = warn;

      var compiled = baseCompile(template.trim(), finalOptions);
      if (true) {
        detectErrors(compiled.ast, warn);
      }
      compiled.errors = errors;
      compiled.tips = tips;
      return compiled
    }

    return {
      compile: compile,
      compileToFunctions: createCompileToFunctionFn(compile)
    }
  }
}

/*  */

// `createCompilerCreator` allows creating compilers that use alternative
// parser/optimizer/codegen, e.g the SSR optimizing compiler.
// Here we just export a default compiler using the default parts.
var createCompiler = createCompilerCreator(function baseCompile (
  template,
  options
) {
  var ast = parse(template.trim(), options);
  if (options.optimize !== false) {
    optimize(ast, options);
  }
  var code = generate(ast, options);
  return {
    ast: ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
});

/*  */

var ref$1 = createCompiler(baseOptions);
var compile = ref$1.compile;
var compileToFunctions = ref$1.compileToFunctions;

/*  */

// check whether current browser encodes a char inside attribute values
var div;
function getShouldDecode (href) {
  div = div || document.createElement('div');
  div.innerHTML = href ? "<a href=\"\n\"/>" : "<div a=\"\n\"/>";
  return div.innerHTML.indexOf('&#10;') > 0
}

// #3663: IE encodes newlines inside attribute values while other browsers don't
var shouldDecodeNewlines = inBrowser ? getShouldDecode(false) : false;
// #6828: chrome encodes content in a[href]
var shouldDecodeNewlinesForHref = inBrowser ? getShouldDecode(true) : false;

/*  */

var idToTemplate = cached(function (id) {
  var el = query(id);
  return el && el.innerHTML
});

var mount = Vue.prototype.$mount;
Vue.prototype.$mount = function (
  el,
  hydrating
) {
  el = el && query(el);

  /* istanbul ignore if */
  if (el === document.body || el === document.documentElement) {
     true && warn(
      "Do not mount Vue to <html> or <body> - mount to normal elements instead."
    );
    return this
  }

  var options = this.$options;
  // resolve template/el and convert to render function
  if (!options.render) {
    var template = options.template;
    if (template) {
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {
          template = idToTemplate(template);
          /* istanbul ignore if */
          if ( true && !template) {
            warn(
              ("Template element not found or is empty: " + (options.template)),
              this
            );
          }
        }
      } else if (template.nodeType) {
        template = template.innerHTML;
      } else {
        if (true) {
          warn('invalid template option:' + template, this);
        }
        return this
      }
    } else if (el) {
      template = getOuterHTML(el);
    }
    if (template) {
      /* istanbul ignore if */
      if ( true && config.performance && mark) {
        mark('compile');
      }

      var ref = compileToFunctions(template, {
        outputSourceRange: "development" !== 'production',
        shouldDecodeNewlines: shouldDecodeNewlines,
        shouldDecodeNewlinesForHref: shouldDecodeNewlinesForHref,
        delimiters: options.delimiters,
        comments: options.comments
      }, this);
      var render = ref.render;
      var staticRenderFns = ref.staticRenderFns;
      options.render = render;
      options.staticRenderFns = staticRenderFns;

      /* istanbul ignore if */
      if ( true && config.performance && mark) {
        mark('compile end');
        measure(("vue " + (this._name) + " compile"), 'compile', 'compile end');
      }
    }
  }
  return mount.call(this, el, hydrating)
};

/**
 * Get outerHTML of elements, taking care
 * of SVG elements in IE as well.
 */
function getOuterHTML (el) {
  if (el.outerHTML) {
    return el.outerHTML
  } else {
    var container = document.createElement('div');
    container.appendChild(el.cloneNode(true));
    return container.innerHTML
  }
}

Vue.compile = compileToFunctions;

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Vue);


/***/ }),

/***/ "./resources/js/components/species.json":
/*!**********************************************!*\
  !*** ./resources/js/components/species.json ***!
  \**********************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('[["Losaria coon","Common Clubtail"],["Losaria rhodifer","Andaman Clubtail"],["Pachliopta aristolochiae","Common Rose"],["Pachliopta hector","Crimson Rose"],["Pachliopta pandiyana","Malabar Rose"],["Troides aeacus","Golden Birdwing"],["Troides helena","Common Birdwing"],["Troides minos","Southern Birdwing"],["Atrophaneura aidoneus","Lesser Batwing"],["Atrophaneura varuna","Common Batwing"],["Byasa crassipes","Black Windmill"],["Byasa dasarada","Great Windmill"],["Byasa latreillei","Rose Windmill"],["Byasa nevilli","Nevill\'s Windmill"],["Byasa plutonius","Chinese Windmill"],["Byasa polla","de Niceville\'s Windmill"],["Byasa polyeuctes","Common Windmill"],["Papilio agestor","Tawny Mime"],["Papilio alcmenor","Redbreast"],["Papilio arcturus","Blue Peacock"],["Papilio bianor","Common Peacock"],["Papilio bootes","Tailed Redbreast"],["Papilio buddha","Malabar Banded Peacock"],["Papilio castor","Common Raven"],["Papilio clytia","Common Mime"],["Papilio crino","Common Banded Peacock"],["Papilio demoleus","Lime Butterfly"],["Papilio dravidarum","Malabar Raven"],["Papilio elephenor","Yellow-crested Spangle"],["Papilio epycides","Lesser Mime"],["Papilio helenus","Red Helen"],["Papilio krishna","Krishna Peacock"],["Papilio liomedon","Malabar Banded Swallowtail"],["Papilio machaon","Common Yellow Swallowtail"],["Papilio mayo","Andaman Mormon"],["Papilio memnon","Great Mormon"],["Papilio nephelus","Yellow Helen"],["Papilio paradoxa","Great Blue Mime"],["Papilio paris","Paris Peacock"],["Papilio polymnestor","Blue Mormon"],["Papilio polytes","Common Mormon"],["Papilio prexaspes","Andaman Helen"],["Papilio protenor","Spangle"],["Papilio slateri","Blue-striped Mime"],["Papilio xuthus","Chinese Yellow Swallowtail"],["Graphium adonarensis","Cryptic Bluebottle"],["Graphium agamemnon","Tailed Jay"],["Graphium agetes","Fourbar Swordtail"],["Graphium albociliatis","Scarce Jay"],["Graphium antiphates","Fivebar Swordtail"],["Graphium aristeus","Chain Swordtail"],["Graphium arycles","Spotted Jay"],["Graphium chironides","Veined Jay"],["Graphium cloanthus","Glassy Bluebottle"],["Graphium doson","Common Jay"],["Graphium epaminondas","Andaman Swordtail"],["Graphium eurous","Sixbar Swordtail"],["Graphium eurypylus","Great Jay"],["Graphium macareus","Lesser Zebra"],["Graphium mandarinus","Spectacle Swordtail"],["Graphium megarus","Spotted Zebra"],["Graphium nomius","Spot Swordtail"],["Graphium sarpedon","Common Bluebottle"],["Graphium teredon","Southern Bluebottle"],["Graphium xenocles","Great Zebra"],["Lamproptera curius","White Dragontail"],["Lamproptera meges","Green Dragontail"],["Meandrusa lachinus","Brown Gorgon"],["Meandrusa payeni","Yellow Gorgon"],["Teinopalpus imperialis","Kaiser-i-Hind"],["Bhutanitis lidderdalii","Bhutan Glory"],["Bhutanitis ludlowi","Ludlow\'s Bhutan Glory"],["Parnassius (Parnassius)",""],["Parnassius (Parnassius)","Common Red Apollo"],["Parnassius (Parnassius)","Keeled Apollo"],["Parnassius (Parnassius)","Large Keeled Apollo"],["Parnassius (Kailasus)","Regal Apollo"],["Parnassius (Kailasius)","Stately Apollo"],["Parnassius (Kailasius)","augustus Fruhstorfer, 1903 Noble Apollo"],["Parnassius (Kailasius)","Dusky Apollo"],["Parnassius (Koramius)","hunza Grum-Grshimailo, 1888 Karakoram Banded Apollo"],["Parnassius (Koramius)","mamaievi Bang-Haas, 1915 Scarce Banded Apollo"],["Parnassius (Koramius)","Greater Banded Apollo"],["Parnassius (Koramius)","Lesser Banded Apollo"],["Parnassius (Koramius)","Himalayan Banded Apollo"],["Parnassius (Tadumia)","Varnished Apollo"],["Parnassius (Tadumia)","Royal Apollo"],["Parnassius (Lingamius)","Common Blue Apollo"],["Parnassius (Kreizbergia)","Black-edged Apollo"],["Badamia exclamationis","Brown Awl"],["Bibasis iluska","Slate Awlet"],["Bibasis sena","Orange-tailed Awlet"],["Burara amara","Small Green Awlet"],["Burara anadi","Plain Orange Awlet"],["Burara etelka","Great Orange Awlet"],["Burara gomata","Pale Green Awlet"],["Burara harisa","Orange Striped Awlet"],["Burara jaina","Orange Awlet"],["Burara oedipodea","Branded Orange Awlet"],["Burara vasutana","Green Awlet"],["Hasora anura","Slate Awl"],["Hasora badra","Common Awl"],["Hasora chromus","Common Banded Awl"],["Hasora danda","Purple Awl"],["Hasora khoda","Large Banded Awl"],["Hasora leucospila","Violet Awl"],["Hasora schoenherr","Yellow Banded Awl"],["Hasora taminatus","White Banded Awl"],["Hasora vitta","Plain Banded Awl"],["Choaspes benjaminii","Indian Awlking"],["Choaspes furcatus","Hooked Awlking"],["Choaspes stigmatus","Branded Awlking"],["Choaspes xanthopogon","Similar Awlking"],["Lobocla liliana","Marbled Flat"],["Capila jayadeva","Striped Dawnfly"],["Capila lidderdali","Lidderdale\'s Dawnfly"],["Capila pennicillatum","Fringed Dawnfly"],["Capila phanaeus","Fulvous Dawnfly"],["Capila pieridoides","White Dawnfly"],["Capila zennara","Pale Striped Dawnfly"],["Tapena thwaitesi","Black Angle"],["Darpa hanria","Hairy Angle"],["Darpa pteria","Snowy Angle"],["Darpa striata","Striated Angle"],["Odina decoratus","Zigzag Flat"],["Coladenia agni","Brown Pied Flat"],["Coladenia agnioides","Elwes\'s Pied Flat"],["Coladenia indrani","Tricolour Pied Flat"],["Coladenia laxmi","Grey Pied Flat"],["Satarupa gopala","Large White Flat"],["Satarupa splendens","Splendid White Flat"],["Satarupa zulla","Tytler\'s White Flat"],["Seseria dohertyi","Himalayan White Flat"],["Seseria sambara","Sikkim White Flat"],["Pintara tabrica","Crenulate Orange Flat"],["Chamunda chamunda","Olive Flat"],["Gerosis bhagava","Common Yellow-breast Flat"],["Gerosis phisara","Dusky Yello-w-breast Flat"],["Gerosis sinica","White Yellow -breast Flat"],["Tagiades calligana","Malayan Snow Flat"],["Tagiades cohaerens","Striped Snow Flat"],["Tagiades gana","Large Snow Flat"],["Tagiades japetus","Suffused Snow Flat"],["Tagiades menaka","Spotted Snow Flat"],["Tagiades parra","Common Snow Flat"],["Tagiades litigiosa","Water Snow Flat"],["Mooreana trichoneura","Yellow Flat"],["Ctenoptilum multiguttata","Multispot Angle"],["Ctenoptilum vasava","Tawny Angle"],["Odontoptilum angulatum","Chestnut Angle"],["Caprona agama","Spotted Angle"],["Caprona alida","Evans\' Angle"],["Caprona ransonnetii","Golden Angle"],["Celaenorrhinus ambareesa","Malabar Flat"],["Celaenorrhinus andamanicus","Andaman Yellow-banded Flat"],["Celaenorrhinus asmara","White Banded Flat"],["Celaenorrhinus aspersa","Large Streaked Flat"],["Celaenorrhinus aurivittatus","Dark Yellow -banded Flat"],["Celaenorrhinus badius","Scarce Banded Flat"],["Celaenorrhinus dhanada","Himalayan Yellow-banded Flat"],["Celaenorrhinus ficulnea","Velvet Flat"],["Celaenorrhinus flavicincta","Bhutan Flat"],["Celaenorrhinus leucocera","Common Spotted Flat"],["Celaenorrhinus morena","Evans\' Spotted Flat"],["Celaenorrhinus munda","Himalayan Spotted Flat"],["Celaenorrhinus nigricans","Small Banded Flat"],["Celaenorrhinus patula","Large Spotted Flat"],["Celaenorrhinus pero","Mussoorie Spotted Flat"],["Celaenorrhinus plagifera","de Niceville\'s Spotted Flat"],["Celaenorrhinus pulomaya","Multi-spotted Flat"],["Celaenorrhinus putra","Bengal Spotted Flat"],["Celaenorrhinus pyrrha","Double Spotted Flat"],["Celaenorrhinus ratna","Tytler\'s Multi-spotted Flat"],["Celaenorrhinus ruficornis","Tamil Spotted Flat"],["Celaenorrhinus sumitra","Moore\'s Spotted Flat"],["Celaenorrhinus tibetanus","Tibet Flat"],["Celaenorrhinus zea","Swinhoe\'s Flat"],["Pseudocoladenia dan","Fulvous Pied Flat"],["Pseudocoladenia fatua","Sikkim Pied Flat"],["Pseudocoladenia festa","Naga Pied Flat"],["Sarangesa purendra","Spotted Small Flat"],["Sarangesa dasahara","Common Small Flat"],["Gomalia elma","African Marbled Skipper"],["Carcharodus alceae","Plain Marbled Skipper"],["Carcharodus dravira","Tufted Marbled Skipper"],["Spialia doris","Sind Skipper"],["Spialia galba","Indian Skipper"],["Spialia orbifer","Brick Skipper"],["Erynnis pathan","Inky Skipper"],["Pyrgus alpinus","Mountain Skipper"],["Pyrgus cashmirensis","Kashmir Skipper"],["Carterocephalus avanti","Orange-and-silver Hopper"],["Ochus subvittatus","Tiger Hopper"],["Baracus vittatus","Hedge Hopper"],["Ampittia dioscorides","Bush Hopper"],["Ampittia maroides","Scarce Bush Hopper"],["Aeromachus dubius","Dingy Scrub Hopper"],["Aeromachus jhora","Grey Scrub Hopper"],["Aeromachus kali","Blue-spotted Scrub Hopper"],["Aeromachus pygmaeus","Pigmy Scrub Hopper"],["Aeromachus stigmatus","Veined Scrub Hopper"],["Sebastonyma dolopia","Tufted Ace"],["Sovia grahami","Graham\'s Ace"],["Sovia hyrtacus","White-branded Ace"],["Sovia lucasii","Lucas\' Ace."],["Sovia malta","Manipur Ace"],["Sovia separata","Chequered Ace"],["Pedesta masuriensis","Mussoorie Bush Bob"],["Pedesta panda","Naga Bush Bob"],["Pedesta pandita","Brown Bush Bob"],["Thoressa aina","Garhwal Ace"],["Thoressa astigmata","Southern Spotted Ace"],["Thoressa cerata","Northern Spotted Ace"],["Thoressa evershedi","Evershed\'s Ace"],["Thoressa fusca","Fuscous Ace"],["Thoressa gupta","Olive Ace"],["Thoressa honorei","Madras Ace"],["Thoressa hyrie","Largespot Plain Ace"],["Thoressa masoni","Mason\'s Ace"],["Thoressa sitala","Tamil Ace"],["Halpe arcuata","Evans\' Ace"],["Halpe filda","Elwes\'s Ace"],["Halpe flava","Tavoy Sulphur Ace"],["Halpe hauxwelli","Hauxwell\'s Ace"],["Halpe homolea","Indian Ace"],["Halpe knyvetti","Knyvett\'s Ace"],["Halpe kumara","Plain Ace"],["Halpe kusala","Tenasserim Ace"],["Halpe porus","Moore\'s Ace"],["Halpe sikkima","Sikkim Ace"],["Halpe wantona","Confusing Ace"],["Halpe zema","Banded Ace"],["Halpe zola","Long-banded Ace"],["Pithauria marsena","Branded Straw Ace"],["Pithauria murdava","Dark Straw Ace"],["Pithauria stramineipennis","Light Straw Ace"],["Apostictopterus fuliginosus","Giant Hopper"],["Astictopterus jama","Forest Hopper"],["Arnetta atkinsoni","Atkinson\'s Bob"],["Arnetta mercara","Coorg Forest Bob"],["Arnetta vindhiana","Vindhyan Bob"],["Actinor radians","Veined Dart"],["Iambrix salsala","Chestnut Bob"],["Koruthaialos butleri","Dark Velvet Bob"],["Koruthaialos rubecula","Narrow-banded Velvet Bob"],["Koruthaialos sindu","Bright Red Velvet Bob"],["Psolos fuligo","Coon"],["Stimula swinhoei","Watson\'s Demon"],["Ancistroides nigrita","Chocolate Demon"],["Notocrypta curvifascia","Restricted Demon"],["Notocrypta feisthamelii","Spotted Demon"],["Notocrypta paralysos","Common Banded Demon"],["Udaspes folus","Grass Demon"],["Scobura cephala","Forest Bob"],["Scobura cephaloides","Large Forest Bob"],["Scobura isota","Swinhoe\'s Forest Bob"],["Scobura phiditia","Malay Forest Bob"],["Scobura tytleri","Tytler\'s Forest Bob"],["Scobura woolletti","Wollett\'s Forest Bob"],["Suada swerga","Grass Bob"],["Suastus gremius","Indian Palm Bob"],["Suastus minutus","Ceylon Palm Bob"],["Cupitha purreea","Wax Dart"],["Zographetus ogygia","Purple-spotted Flitter"],["Zographetus rama","Small Flitter"],["Zographetus satwa","Purple-and-gold Flitter"],["Hyarotis adrastus","Tree Flitter"],["Hyarotis microstictum","Brush Flitter"],["Quedara basiflava","Golden Flitter"],["Quedara monteithi","Dubious Flitter"],["Isma bonota","Assam Lancer"],["Plastingia naga","Silver-spotted Lancer"],["Salanoemia fuscicornis","Purple Lancer"],["Salanoemia noemi","Spotted Yellow Lancer"],["Salanoemia sala","Maculate Lancer"],["Salanoemia tavoyana","Yellow-streaked Lancer"],["Pyroneura margherita","Assamese Yellow-vein Lancer"],["Pyroneura niasana","Red-vein Lancer"],["Lotongus sarala","Yellowband Palmer"],["Zela zeus","Redeye Palmer"],["Gangara lebadea","Banded Redeye"],["Gangara thyrsis","Giant Redeye"],["Erionota hiraca","Andaman Redeye"],["Erionota thrax","Palm Redeye"],["Erionota torus","Banana Skipper"],["Matapa aria","Common Redeye"],["Matapa cresta","Darkbrand Redeye"],["Matapa druna","Greybrand Redeye"],["Matapa purpurascens","Purple Redeye"],["Matapa sasivarna","Black-veined Redeye"],["Pudicitia pholus","Spotted Redeye"],["Unkana ambasa","Hoary Palmer"],["Hidari bhawani","Veined Palmer"],["Pirdana hyela","Green-striped Palmer"],["Pirdana distanti","Plain Green Palmer"],["Creteus cyrina","Nonsuch Palmer"],["Gegenes nostrodamus","Dingy Swift"],["Gegenes pumilio","Pygmy Swift"],["Parnara ganga","Evans\' Swift"],["Parnara guttatus","Straight Swift"],["Parnara bada","Ceylon Swift"],["Borbo bevani","Bevan\'s Swift"],["Borbo cinnara","Rice Swift"],["Pelopidas agna","Obscure Branded Swift"],["Pelopidas conjuncta","Conjoined Swift"],["Pelopidas mathias","Variable Swift"],["Pelopidas sinensis","Large Branded Swift"],["Pelopidas subochracea","Moore\'s Swift"],["Pelopidas thrax","Small Branded Swift"],["Polytremis discreta","Himalayan Swift"],["Polytremis eltola","Yellow Spot Swift"],["Polytremis lubricans","Contiguous Swift"],["Polytremis minuta","Baby Swift Assam; Manipur."],["Baoris chapmani","Small Paintbrush Swift"],["Baoris farri","Paintbrush Swift"],["Baoris pagana","Figure of Eight Swift"],["Baoris unicolor","Black Paintbrush Swift"],["Caltoris aurociliata","Yellow Fringed Swift"],["Caltoris bromus","Leech\'s Swift"],["Caltoris brunnea","Dark-branded Swift"],["Caltoris cahira","Colon Swift"],["Caltoris canaraica","Canara Swift"],["Caltoris confusa","Confusing Swift"],["Caltoris cormasa","Full-stop Swift"],["Caltoris kumara","Blank Swift"],["Caltoris philippina","Philippine Swift"],["Caltoris plebeia","Tufted Swift"],["Caltoris sirius","Sirius Swift"],["Caltoris tulsi","Purple Swift"],["Iton semamora","Common Wight"],["Taractocera ceramas","Tamil Grassdart"],["Taractocera danna","Himalayan Grass Dart"],["Taractocera maevius","Common Grass Dart"],["Oriens concinna","Tamil Dartlet"],["Oriens gola","Common Dartlet"],["Oriens goloides","Ceylon Dartlet"],["Oriens paragola","Malay Dartlet"],["Potanthus confucius","Chinese Dart"],["Potanthus dara","Himalayan Dart"],["Potanthus ganda","Sumatran Dart"],["Potanthus flavus","Japanese Dart"],["Potanthus hetaerus","Large Dart"],["Potanthus juno","Burmese Dart"],["Potanthus lydia","Forest Dart"],["Potanthus mara","Sikkim Dart"],["Potanthus mingo","Narrow Bi-dent Dart"],["Potanthus nesta","Brandless Dart"],["Potanthus pallidus","Pale Dart"],["Potanthus palnia","Palni Dart"],["Potanthus pava","Yellow Dart"],["Potanthus pseudomaesa","Indian Dart"],["Potanthus rectifasciata","Branded Dart"],["Potanthus sita","Yellow-and-black Dart"],["Potanthus trachala","Broad Bi-dent Dart"],["Telicota augias","Pale Palm Dart"],["Telicota bambusae","Dark Palm Dart Throughout"],["Telicota besta","Large Palm Dart"],["Telicota colon","Common Palm Dart"],["Telicota linna","Evans\' Palm Dart"],["Telicota ohara","Crested Palm Dart"],["Cephrenes acalle","Plain Palm Dart"],["Hesperia comma","Chequered Darter"],["Ochlodes brahma","Himalayan Darter"],["Ochlodes siva","Assam Darter"],["Ochlodes subhyalina","Sub-hyaline Darter"],["Catopsilia pomona","Common Emigrant"],["Catopsilia pyranthe","Mottled Emigrant"],["Dercas verhuelli","Tailed Sulphur"],["Dercas lycorias","Plain Sulphur"],["Gonepteryx amintha","Chinese Brimstone"],["Gonepteryx chitralensis","Karakoram Brimstone"],["Gonepteryx mahaguru","Lesser Brimstone"],["Gonepteryx nepalensis","Himalayan Brimstone"],["Gandaca harina","Tree Yellow"],["Eurema andersoni","One-spot Grass Yellow"],["Eurema blanda","Three-spot Grass Yellow"],["Eurema brigitta","Small Grass Yellow"],["Eurema hecabe","Common Grass Yellow"],["Eurema laeta","Spotless Grass Yellow"],["Eurema nilgiriensis","Nilgiri Grass Yellow"],["Eurema simulatrix","Scarce Grass Yellow"],["Colias cocandica","Pamir Clouded Yellow"],["Colias dubia","Dwarf Clouded Yellow"],["Colias eogene","Fiery Clouded Yellow"],["Colias erate","Pale Clouded Yellow"],["Colias fieldi","Dark Clouded Yellow"],["Colias ladakensis","Ladak Clouded Yellow"],["Colias leechi","Glaucous Clouded Yellow"],["Colias marcopolo","Marcopolo\'s Clouded Yellow"],["Colias nilagiriensis","Nilgiri Clouded Yellow"],["Colias stoliczkana","Orange Clouded Yellow"],["Colias thrasibulus","Lemon Clouded Yellow"],["Colias wiskotti","Broad-bordered Clouded Yellow"],["Leptosia nina","Psyche"],["Baltia butleri","Butler\'s Dwarf"],["Baltia shawii","Shaw\'s Dwarf"],["Baltia sikkima","Sikkim Dwarf"],["Mesapia peloria","Thibet Blackvein"],["Aporia agathon","Great Blackvein"],["Aporia harrietae","Bhutan Blackvein"],["Aporia leucodice","Baluchi Blackvein"],["Aporia nabellica","Dusky Blackvein"],["Aporia soracta","Himalayan Blackvein"],["Pieris ajaka","Himalayan White"],["Pieris brassicae","Large Cabbage White"],["Pieris canidia","Indian Cabbage White"],["Pieris deota","Kashmir White"],["Pieris dubernardi","Chumbi White"],["Pieris extensa","Bhutan White"],["Pieris krueperi","Green Banded White"],["Pieris melete","Western Black-Veined White"],["Pieris rapae","Small Cabbage White"],["Talbotia naganum","Naga White"],["Pontia callidice","Lofty Bath White"],["Pontia chloridice","Lesser Bath White"],["Pontia daplidice","Bath White"],["Pontia glauconome","Desert Bath White"],["Pontia sherpae","Sherpa White"],["Ixias marianne","White Orange Tip"],["Ixias pyrene","Yellow Orange Tip"],["Colotis amata","Small Salmon Arab"],["Colotis aurora","Plain Orange Tip"],["Colotis danae","Crimson Tip"],["Colotis etrida","Little Orange Tip"],["Colotis fausta","Large Salmon Arab"],["Colotis phisadia","White Arab"],["Colotis protractus","Blue Spotted Arab"],["Appias albina","Common Albatross"],["Appias indra","Plain Puffin"],["Appias lalage","Spot Puffin"],["Appias libythea","Striped Albatross"],["Appias lyncida","Chocolate Albatross"],["Appias nero","Orange Albatross"],["Appias paulina","Lesser Albatross"],["Appias wardi","Indian Albatross"],["Saletara liberia","Nicobar Albatross"],["Prioneris philonome","Redspot Sawtooth"],["Prioneris sita","Painted Sawtooth"],["Prioneris thestylis","Spotted Sawtooth"],["Belenois aurota","Pioneer"],["Cepora nadina","Lesser Gull"],["Cepora nerissa","Common Gull"],["Delias acalis","Redbreast Jezabel"],["Delias agostina","Yellow Jezabel"],["Delias belladonna","Hill Jezabel"],["Delias berinda","Dark Jezabel"],["Delias descombesi","Redspot Jezabel"],["Delias eucharis","Common Jezabel"],["Delias hyparete","Painted Jezabel"],["Delias lativitta","Broadwing Jezabel"],["Delias sanaca","Pale Jezabel"],["Delias pasithoe","Redbase Jezabel"],["Euchloe daphalis","Little White"],["Pareronia avatar","Pale Wanderer"],["Pareronia ceylanica","Dark Wanderer"],["Pareronia valeria","Common Wanderer"],["Hebomoia glaucippe","Great Orange Tip"],["Zemeros flegyas","Punchinello"],["Dodona adonira","Striped Punch"],["Dodona dipoea","Lesser Punch"],["Dodona durga","Common Punch"],["Dodona egeon","Orange Punch"],["Dodona eugenes","Tailed Punch"],["Dodona longicaudata","Long-tailed Punch"],["Dodona ouida","Mixed Punch"],["Abisara abnormis","Abnormal Judy"],["Abisara attenuata","Short Tailed Judy"],["Abisara bifasciata","Twospot Plum Judy"],["Abisara burnii","Burn\'s Judy"],["Abisara chela","Spot Judy"],["Abisara echerius","Plum Judy"],["Abisara fylla","Dark Judy"],["Abisara neophron","Tailed Judy"],["Abisara saturata","Malayan Plum Judy"],["Taxila haquinus","Harlequin"],["Stiboges nymphidia","Columbine"],["Curetis acuta","Angled Sunbeam"],["Curetis bulis","Bright Sunbeam"],["Curetis naga","Naga Sunbeam"],["Curetis saronis","Burmese Sunbeam"],["Curetis siva","Siva Sunbeam"],["Curetis thetis","Indian Sunbeam"],["Poritia erycinoides","Blue Gem"],["Poritia hewitsoni","Common Gem"],["Simiskina phalena","Broad-banded Brilliant"],["Liphyra brassolis","Moth Butterfly"],["Allotinus drumila","Great Darkie"],["Allotinus subviolaceus","Blue Darkie"],["Allotinus unicolor","Common Darkie"],["Allotinus taras","Brown-tipped Darkie"],["Logania distanti","Dark Mottle"],["Logania marmorata","Pale Mottle"],["Logania watsoniana","Watson\'s Mottle"],["Miletus chinensis","Common Brownie"],["Miletus symethus","Great Brownie"],["Taraka hamada","Forest Pierrot"],["Spalgis baiongus","Assam Apefly"],["Spalgis epius","Common Apefly"],["Lycaena kasyapa","Green Copper"],["Lycaena panava","White-bordered Copper"],["Lycaena phlaeas","Common Copper"],["Thersamonia aditya","Ladakh Copper"],["Heliophorus androcles","Green Sapphire"],["Heliophorus bakeri","Western Blue Sapphire"],["Heliophorus brahma","Golden Sapphire"],["Heliophorus epicles","Purple Sapphire"],["Heliophorus hybrida","Hybrid Sapphire"],["Heliophorus ila","Restricted Purple Sapphire"],["Heliophorus indicus","Indian Purple Sapphire"],["Heliophorus kohimensis","Naga Sapphire"],["Heliophorus moorei","Azure Sapphire"],["Heliophorus oda","Eastern Blue Sapphire"],["Heliophorus sena","Sorrel Sapphire"],["Heliophorus tamu","Powdery Green Sapphire"],["Apharitis acamas","Tawny Silverline"],["Apharitis lilacinus","Lilac Silverline"],["Spindasis abnormis","Abnormal Silverline"],["Spindasis elima","Scarce Shot Silverline"],["Spindasis elwesi","Elwes\' Silverline"],["Spindasis evansii","Cinnamon Silverline"],["Spindasis ictis","Common Shot Silverline"],["Spindasis lohita","Long-banded Silverline"],["Spindasis nipalicus","Silvergrey Silverline"],["Spindasis rukma","Obscure Silverline"],["Spindasis rukmini","Khaki Silverline"],["Spindasis schistacea","Plumbeous Silverline"],["Spindasis syama","Club Silverline"],["Spindasis vulcanus","Common Silverline"],["Chaetoprocta kurumi","Nepal Walnut Blue"],["Chaetoprocta odata","Walnut Blue"],["Euaspa milionia","Water Hairstreak"],["Euaspa miyashitai","Darjeeling Hairstreak"],["Euaspa mikamii","Arunachal Hairstreak"],["Euaspa pavo","Peacock Hairstreak"],["Shizuyaozephyrus ziha","White-spotted Hairstreak"],["Fujiokaozephyrus tsangkie","Suroifui Hairstreak"],["Iwaseozephyrus mandara","Indian Purple Hairstreak"],["Esakiozephyrus icana","Dull Green Hairstreak"],["Chrysozephyrus disparatus","Howarth\'s Green Hairstreak"],["Chrysozephyrus duma","Metallic Green Hairstreak"],["Chrysozephyrus dumoides","Broad-bordered Green Hairstreak"],["Chrysozephyrus intermedius","Intermediate Green Hairstreak"],["Chrysozephyrus kabrua","Kabru Green Hairstreak"],["Chrysozephyrus sandersi","Sanders\' Green Hairstreak"],["Chrysozephyrus sikkimensis","Sikkim Green Hairstreak"],["Chrysozephyrus tytleri","Manipur Green Hairstreak"],["Chrysozephyrus vittatus","Tytler\'s Green Hairstreak"],["Chrysozephyrus zoa","Powdered Green Hairstreak"],["Neozephyrus suroia","Cerulean Hairstreak"],["Shirozuozephyrus bhutanensis","Bhutan Hairstreak"],["Shirozuozephyrus birupa","Fawn Hairstreak"],["Shirozuozephyrus jakamensis","Jakama Hairstreak"],["Shirozuozephyrus khasia","Tailless Metallic Green Hairstreak"],["Shirozuozephyrus kirbariensis","Kirbari Hairstreak"],["Shirozuozephyrus paona","Paona Hairstreak"],["Shirozuozephyrus triloka","Kumaon Hairstreak"],["Inomataozephyrus assamicus","Assam Hairstreak"],["Inomataozephyrus syla","Silver Hairstreak"],["Thermozephyrus ataxus","Wonderful Hairstreak"],["Leucantigius atayalicus","Pale Hairstreak"],["Amblopala avidiena","Chinese Hairstreak"],["Arhopala aberrans","Pale Bushblue"],["Arhopala abseus","Aberrant Bushblue"],["Arhopala ace","Tytler\'s Dull Oakblue"],["Arhopala aeeta","Dawnas Tailless Oakblue"],["Arhopala alea","Kanara Oakblue"],["Arhopala allata","Tytler\'s Rosy Oakblue"],["Arhopala agrata","de Niceville\'s Dull Oakblue"],["Arhopala alax","Silky Oakblue"],["Arhopala alesia","Pallid Oakblue"],["Arhopala amantes","Large Oakblue"],["Arhopala ammonides","Dark Bushblue"],["Arhopala anarte","Magnificient Oakblue"],["Arhopala arvina","Purple-brown Tailless Oakblue"],["Arhopala asinarus","Broad-banded Oakblue"],["Arhopala asopia","Plain Tailless Oakblue"],["Arhopala athada","Vinous Oakblue"],["Arhopala atrax","Indian Oakblue"],["Arhopala aurelia","Grey-washed Oakblue"],["Arhopala bazaloides","Tamil Oakblue"],["Arhopala bazalus","Powdered Oakblue"],["Arhopala belphoebe","Doherty\'s Oakblue"],["Arhopala birmana","Burmese Bushblue"],["Arhopala camdeo","Lilac Oakblue"],["Arhopala centaurus","Centaur Oakblue"],["Arhopala comica","Comic Oakblue"],["Arhopala curiosa","Bhutan Oakblue"],["Arhopala democritus","White-spotted Oakblue"],["Arhopala dispar","Frosted Oakblue"],["Arhopala dodonea","Pale Himalayan Oakblue"],["Arhopala eumolphus","Green Oakblue"],["Arhopala fulla","Spotless Oakblue"],["Arhopala ganesa","Tailless Bushblue"],["Arhopala hellenore","Pointed Green Oakblue"],["Arhopala khamti","Doherty\'s Dull Oakblue"],["Arhopala nicevillei","Large Spotted Oakblue"],["Arhopala oenea","Hewitson\'s Dull Oakblue"],["Arhopala opalina","Opal Oakblue"],["Arhopala paraganesa","Dusky Bushblue"],["Arhopala paralea","Glazed Oakblue"],["Arhopala paramuta","Hooked Oakblue"],["Arhopala perimuta","Yellowdisc Tailless Oakblue"],["Arhopala rama","Dark Himalayan Oakblue"],["Arhopala ralanda","Bright Oakblue"],["Arhopala selta","Rosy Oakblue"],["Arhopala silhetensis","Sylhet Oakblue"],["Arhopala singla","Yellow-disc Oakblue"],["Arhopala zeta","Andaman Tailless Oakblue"],["Thaduka multicaudata","Many-tailed Oakblue"],["Apporasa atkinsoni","Crenulate Oakblue"],["Mahathala ameria","Falcate Oakblue"],["Flos apidanus","Plain Plushblue"],["Flos adriana","Vareigated Plushblue"],["Flos areste","Tailless Plushblue"],["Flos asoka","Spangled Plushblue"],["Flos chinensis","Chinese Plushblue"],["Flos diardi","Bifid Plushblue"],["Flos fulgida","Shining Plushblue"],["Mota massyla","Saffron"],["Surendra quercetorum","Common Acacia Blue"],["Surendra vivarna","Burmese Acacia Blue"],["Zinaspa todara","Silver Streaked Acacia Blue"],["Zesius chrysomallus","Redspot"],["Amblypodia anita","Purple Leaf Blue"],["Iraota rochana","Scarce Silverstreak Blue"],["Iraota timoleon","Silverstreak Blue"],["Catapaecilma major","Common Tinsel"],["Catapaecilma subochracea","Yellow Tinsel Nagaland."],["Acupicta delicatum","Dark Tinsel"],["Loxura atymnus","Yamfly"],["Yasoda tripunctata","Branded Yamfly"],["Drina donina","Brown Yam"],["Horaga albimacula","Violet Onyx"],["Horaga onyx","Common Onyx"],["Horaga syrinx","Yellow Onyx"],["Horaga viola","Brown Onyx"],["Rathinda amor","Monkey Puzzle"],["Cheritra freja","Common Imperial"],["Cheritrella truncipennis","Truncate Imperial"],["Ticherra acte","Blue Imperial"],["Drupadia scaeva","Blue Posy"],["Pratapa deva",""],["Pratapa icetas","Dark Blue Royal"],["Pratapa icetoides","Blue Royal"],["Tajuria albiplaga","Pallid Royal"],["Tajuria cippus","Peacock Royal"],["Tajuria culta","Black-branded Royal"],["Tajuria deudorix","Flash Royal"],["Tajuria diaeus","Straightline Royal"],["Tajuria illurgioides","Scarce White Royal"],["Tajuria illurgis","White Royal"],["Tajuria isaeus","Bornean Royal"],["Tajuria ister","Uncertain Royal"],["Tajuria jehana","Plains Blue Royal"],["Tajuria luculenta","Chinese Royal"],["Tajuria maculata","Spotted Royal"],["Tajuria megistia","Orange-and-black Royal"],["Tajuria melastigma","Branded Royal"],["Tajuria yajna","Chestnut-and-black Royal"],["Dacalana cotys","White-banded Royal"],["Dacalana penicilligera","Double-tufted Royal"],["Maneca bhotea","Slate Royal"],["Creon cleobis","Broadtail Royal"],["Bullis buto","Baby Royal"],["Eliotiana jalindra","Banded Royal"],["Neocheritra fabronia","Pale Grand Imperial"],["Charana cepheis","Cachar Mandarin Blue"],["Charana mandarina","Mandarin Blue"],["Suasa lisides","Red Imperial"],["Britomartis cleoboides","Azure Royal"],["Remelana jangala","Chocolate Royal"],["Ancema blanka","Silver Royal"],["Ancema ctesia","Bi-Spot Royal"],["Hypolycaena erylus","Common Tit"],["Hypolycaena narada","Banded Tit"],["Hypolycaena nilgirica","Nilgiri Tit"],["Hypolycaena thecloides","Brown Tit"],["Chliaria kina","Blue Tit"],["Chliaria othona","Orchid Tit"],["Zeltus amasa","Fluffy Tit"],["Deudorix epijarbas","Cornelian"],["Deudorix gaetulia","Assam Cornelian"],["Virachola dohertyi","Doherty\'s Guava Blue"],["Virachola isocrates","Common Guava Blue"],["Virachola kessuma","Whiteline Flash"],["Virachola perse","Large Guava Blue"],["Virachola similis","Scarce Guava Blue"],["Artipe eryx","Green Flash"],["Sinthusa chandrana","Broad Spark"],["Sinthusa nasaka","Narrow Spark"],["Sinthusa virgo","Pale Spark"],["Araotes lapithis","Witch"],["Bindahara phocides","Plane"],["Rapala buxaria","Shot Flash"],["Rapala damona","Malay Red Flash"],["Rapala dieneces","Scarlet Flash"],["Rapala extensa","Chitral Flash"],["Rapala iarbus","Common Red Flash"],["Rapala lankana","Malabar Flash"],["Rapala manea","Slate Flash"],["Rapala nissa","Common Flash"],["Rapala pheretima","Copper Flash"],["Rapala rectivitta","Scarce Shot Flash"],["Rapala refulgens","Refulgent Flash"],["Rapala melida","Brilliant Flash"],["Rapala rosacea","Rosy Flash"],["Rapala rubida","Tytler\'s Flash"],["Rapala selira","Himalayan Red Flash"],["Rapala scintilla","Scarce Slate Flash"],["Rapala suffusa","Suffused Flash"],["Rapala tara","Assam Flash"],["Rapala varuna","Indigo Flash"],["Pamela dudgeoni","Lister\'s Hairstreak"],["Ahlbergia leechii","Ferruginous Hairstreak"],["Strymon mackwoodi","Mackwood\'s Hairstreak"],["Superflua deria","Moore\'s Hairstreak"],["Niphanda asialis","Fawcett\'s Pierrot"],["Niphanda cymbia","Pointed Pierrot"],["Anthene emolus","Ciliate Blue"],["Anthene lycaenina","Pointed Ciliate Blue"],["Una usta","Una"],["Orthomiella pontis","Straightwing Blue"],["Orthomiella rantaizana","Burmese Straightwing Blue"],["Petrelaea dana","Dingy Lineblue"],["Nacaduba berenice","Rounded Sixlineblue"],["Nacaduba beroe","Opaque Sixlineblue"],["Nacaduba calauria","Dark Ceylon Sixlineblue"],["Nacaduba hermus","Pale Fourlineblue"],["Nacaduba kurava","Transparent Sixlineblue"],["Nacaduba pactolus","Large Fourlineblue"],["Nacaduba pavana","Small Fourlineblue"],["Nacaduba sanaya","Jewel Fourlineblue"],["Nacaduba subperusia","Violet Fourlineblue"],["Prosotas aluta","Barred Lineblue"],["Prosotas bhutea","Bhutya Lineblue"],["Prosotas dubiosa","Tailless Lineblue"],["Prosotas lutea","Banded Lineblue"],["Prosotas nora","Common Lineblue"],["Prosotas noreia","White-tipped Lineblue"],["Prosotas pia","Margined Lineblue"],["Ionolyce helicon","Pointed Lineblue"],["Catopyrops ancyra","Felder\'s Lineblue"],["Caleta decidia","Angled Pierrot"],["Caleta elna","Elbowed Pierrot"],["Caleta roxus","Straight Pierrot"],["Discolampa ethion","Banded Blue Pierrot"],["Jamides alecto","Metallic Cerulean"],["Jamides bochus","Dark Cerulean"],["Jamides caeruleus","Royal Cerulean"],["Jamides celeno","Common Cerulean"],["Jamides elpis","Glistening Cerulean"],["Jamides ferrari","Ferrar\'s Cerulean"],["Jamides kankena","Frosted Cerulean"],["Jamides pura","White Cerulean"],["Catochrysops panormus","Silver Forgetmenot"],["Catochrysops strabo","Forgetmenot"],["Lampides boeticus","Peablue"],["eptotes plinius","Zebra Blue"],["Castalius rosimon","Common Pierrot"],["Tarucus ananda","Dark Pierrot"],["Tarucus balkanicus","Black-spotted Pierrot"],["Tarucus callinara","Spotted Pierrot"],["Tarucus hazara","Hazara Pierrot"],["Tarucus indicus","Indian Pointed Pierrot"],["Tarucus nara","Striped Pierrot"],["Tarucus venosus","Himalayan Pierrot"],["Tarucus waterstradti","Assam Pierrot"],["Zizeeria karsandra","Dark Grass Blue"],["Pseudozizeeria maha","Pale Grass Blue"],["Zizina otis","Lesser Grass Blue"],["Zizula hylax","Tiny Grass Blue"],["Everes argiades","Tailed Cupid"],["Everes hugelii","Dusky-blue Cupid"],["Everes lacturnus","Indian Cupid"],["Cupido alainus","Staudinger\'s Cupid"],["Cupido buddhista","Shandur Cupid"],["Iolana gigantea","Gilgit Mountain Blue"],["Bothrinia chennelli","Hedge Cupid"],["Tongeia kala","Black Cupid"],["Tongeia pseudozuthus","False Tibetan Cupid"],["Shijimia moorei","Moore\'s Cupid"],["Talicada nyseus","Red Pierrot"],["Pithecops fulgens","Blue Quaker"],["Pithecops corvus","Forest Quaker"],["Azanus jesous","African Babul Blue"],["Azanus ubaldus","Bright Babul Blue"],["Azanus uranus","Dull Babul Blue"],["Neopithecops zalmora","Quaker"],["Megisba malaya","Malayan"],["Celastrina argiolus","Hill Hedge Blue"],["Celastrina gigas","Silvery Hedge Blue"],["Celastrina hersilia","Mishmi Hedge Blue"],["Celastrina hugelii","Large Hedge Blue"],["Celastrina lavendularis","Plain Hedge Blue"],["Celastrina oreas","Khasi Hedge Blue"],["Lestranicus transpectus","White-banded Hedge Blue"],["Celatoxia albidisca","Whitedisc Hedge Blue"],["Celatoxia marginata","Margined Hedge Blue"],["Notarthrinus binghami","Chapman\'s Hedge Blue"],["Acytolepis lilacea","Hampson\'s Hedge Blue"],["Acytolepis puspa","Common Hedge Blue"],["Oreolyce dohertyi","Naga Hedge Blue"],["Oreolyce vardhana","Dusky Hedge Blue"],["Callenya melaena","Metallic Hedge Blue"],["Monodontides musina","Swinhoe\'s Hedge Blue"],["Udara akasa","White Hedge Blue"],["Udara albocaerulea","Albocerulean"],["Udara dilecta","Pale Hedge Blue"],["Udara placidula","Narrow-bordered Hedge Blue"],["Udara selma","Bicoloured Hedge Blue"],["Udara singalensis","Singhalese Hedge Blue"],["Euchrysops cnejus","Gram Blue"],["Freyeria putli","Small Grass Jewel"],["Freyeria trochylus","Grass Jewel"],["Luthrodes pandava","Plains Cupid"],["Chilades lajus","Lime Blue"],["Chilades parrhasius","Small Cupid"],["Turanana chitrali","Chitral Argus Blue"],["Pseudophilotes vicrama","Eastern Baton Blue"],["Phengaris atroguttata","Great Spotted Blue"],["Plebejus eversmanni","Tibetan Jewel Blue"],["Plebejus samudra","Ladakh Jewel Blue"],["Aricia agestis","Orange-bordered Argus"],["Aricia artaxerxes","Northern Brown Argus"],["Aricia astorica","Astor Argus"],["Eumedonia eumedon","Streaked Argus"],["Agriades jaloka","Greenish Mountain Blue"],["Agriades morsheadi","Evans\' Mountain Blue"],["Agriades pheretiades","Tien Shan Blue"],["Albulina asiatica","Azure Mountain Blue"],["Albulina chitralensis","Chitral Green Underwing"],["Albulina chrysopis","Golden Green Underwing"],["Albulina galathea","Large Green Underwing"],["Albulina lehanus","Common Mountain Blue"],["Albulina metallica","Small Green Underwing"],["Albulina omphisa","Dusky Green Underwing"],["Albulina pharis","Fawcett\'s Mountain Blue"],["Albulina sikkima","Sikkim Mountain Blue"],["Patricius younghusbandi","Chumbi Green Underwing"],["Plebejidea loewii","Large Jewel Blue"],["Kretania beani","Bean\'s Jewel Blue"],["Farsia ashretha","Evans\' Argus Blue"],["Farsia hanna","Jewel Argus Blue"],["Alpherakya devanica","Dusky Meadow Blue"],["Alpherakya sarta","Brilliant Meadow Blue"],["Polyommatus ariana","Lahaul Meadow Blue"],["Polyommatus drasula","Ladakh Meadow Blue"],["Polyommatus dux","Kumaon Meadow Blue"],["Polyommatus erigone","Grshimailo\'s Meadow Blue"],["Polyommatus hunza","Hunza Meadow Blue"],["Polyommatus icadius","Gilgit Meadow Blue"],["Polyommatus janetae","Janet\'s Meadow Blue"],["Polyommatus pseuderos","Kashmir Meadow Blue"],["Polyommatus pulchellus","Bernardi\'s Meadow Blue"],["Polyommatus stoliczkanus","Stoliczka\'s Meadow Blue"],["Danaus affinis","Malay Tiger"],["Danaus chrysippus","Plain Tiger"],["Danaus genutia","Common Tiger"],["Danaus melanippus","White Tiger"],["Ideopsis juventa","Grey Glassy Tiger"],["Ideopsis similis","Blue Glassy Tiger"],["Parantica aglea","Glassy Tiger"],["Parantica agleoides","Dark Glassy Tiger"],["Parantica melaneus","Chocolate Tiger"],["Parantica swinhoei","Swinhoe\'s Chocolate Tiger"],["Parantica nilgiriensis","Nilgiri Tiger"],["Parantica pedonga","Talbot\'s Chestnut Tiger"],["Parantica sita","Chestnut Tiger"],["Tirumala gautama","Scarce Blue Tiger"],["Tirumala limniace","Blue Tiger"],["Tirumala septentrionis","Dark Blue Tiger"],["Idea agamarschana","Burmese Tree Nymph"],["Idea malabarica","Malabar Tree Nymph"],["Euploea algea","Long-branded Blue Crow"],["Euploea core","Common Crow"],["Euploea crameri","Spotted Black Crow"],["Euploea doubledayi","Striped Black Crow"],["Euploea eunice","Blue-branded King Crow"],["Euploea klugii","King Crow"],["Euploea midamus","Spotted Blue Crow"],["Euploea mulciber","Striped Blue Crow"],["Euploea phaenareta","Great Crow"],["Euploea radamanthus","Magpie Crow"],["Euploea sylvester","Double-branded Crow"],["Calinaga buddha","Freak"],["Prothoe franck","Blue Begum"],["Polyura agraria","Anomalous Nawab"],["Polyura arja","Pallid Nawab"],["Polyura athamas","Common Nawab"],["Polyura bharata","Cryptic Nawab"],["Polyura delphis","Jewelled Nawab"],["Polyura dolon","Stately Nawab"],["Polyura eudamippus","Great Nawab"],["Polyura moori","Malayan Nawab"],["Polyura narcaeus","China Nawab"],["Polyura schreiber","Blue Nawab"],["Charaxes aristogiton","Scarce Tawny Rajah"],["Charaxes bernardus","Tawny Rajah"],["Charaxes durnfordi","Chestnut Rajah"],["Charaxes kahruba","Variegated Rajah"],["Charaxes marmax","Yellow Rajah"],["Charaxes psaphon","Plain Tawny Rajah"],["Charaxes solon","Black Rajah"],["Faunis eumeus","Large Faun"],["Faunis canens","Common Faun"],["Aemona amathusia","Yellow Dryad"],["Stichophthalma camadeva","Northern Junglequeen"],["Stichophthalma nourmahal","Chocolate Junglequeen"],["Stichophthalma sparta","Manipur Junglequeen"],["Amathusia andamanensis","Andaman Palmking"],["Amathusia phidippus","Common Palmking"],["Amathuxidia amythaon","Koh-i-Noor"],["Thaumantis diores","Jungleglory"],["Thauria lathyi","Jungleking"],["Discophora deo","Banded Duffer"],["Discophora lepida","Southern Duffer"],["Discophora sondaica","Common Duffer"],["Discophora timora","Great Duffer"],["Enispe cycnus","Blue Caliph"],["Enispe euthymius","Red Caliph"],["Enispe intermedia","Malayan Red Caliph"],["Elymnias cottonis","Andaman Palmfly"],["Elymnias hypermnestra","Common Palmfly"],["Elymnias malelas","Spotted Palmfly"],["Elymnias nesaea","Tiger Palmfly"],["Elymnias panthera","Nicobar Palmfly"],["Elymnias patna","Blue-striped Palmfly"],["Elymnias peali","Peal\'s Palmfly"],["Elymnias penaga","Pointed Palmfly"],["Elymnias vasudeva","Jezabel Palmfly"],["Neorina hilda","Yellow Owl"],["Neorina patria","White Owl"],["Penthema lisarda","Yellow Kaiser"],["Ethope himachala","Dusky Diadem"],["Melanitis leda","Common Evening Brown"],["Melanitis phedima","Dark Evening Brown"],["Melanitis zitenius","Great Evening Brown"],["Cyllogenes janetae","Scarce Evening Brown"],["Cyllogenes suradeva","Branded Evening Brown"],["Parantirrhoea marshalli","Travancore Evening Brown"],["Lethe andersoni","Anderson\'s Silverstripe"],["Lethe atkinsonia","Small Goldenfork"],["Lethe baladeva","Treble Silverstripe"],["Lethe bhairava","Rusty Forester"],["Lethe brisanda","Dark Forester"],["Lethe chandica","Angled Red Forester"],["Lethe confusa","Banded Treebrown"],["Lethe dakwania","Garhwal Woodbrown"],["Lethe dura","Scarce Lilacfork"],["Lethe distans","Scarce Red Forester"],["Lethe drypetis","Tamil Treebrown"],["Lethe europa","Bamboo Treebrown"],["Lethe goalpara","Large Goldenfork"],["Lethe gemina","Tytler\'s Treebrown"],["Lethe gulnihal","Dull Forester"],["Lethe isana","Common Forester"],["Lethe jalaurida","Small Silverfork"],["Lethe kabrua","Manipur Goldenfork"],["Lethe kanjupkula","Manipur Woodbrown"],["Lethe kansa","Bamboo Forester"],["Lethe latiaris","Pale Forester"],["Lethe maitrya","Barred Woodbrown"],["Lethe margaritae","Bhutan Treebrown"],["Lethe mekara","Common Red Forester"],["Lethe moelleri","Moeller‘s Silverfork"],["Lethe naga","Naga Treebrown"],["Lethe nicetas","Yellow Woodbrown"],["Lethe nicetella","Small Woodbrown"],["Lethe ramadeva","Single Silverstripe"],["Lethe rohria","Common Treebrown"],["Lethe satyavati","Pallid Forester"],["Lethe scanda","Blue Forester"],["Lethe serbonis","Brown Forester"],["Lethe siderea","Scarce Woodbrown"],["Lethe sidonis","Common Woodbrown"],["Lethe sinorix","Tailed Red Forester"],["Lethe sura","Scarce Lilacfork"],["Lethe tristigmata","Spotted Mystic"],["Lethe verma","Straight-banded Treebrown"],["Lethe vindhya","Black Forester"],["Lethe visrava","White-edged Woodbrown"],["Neope armandii","Chinese Labyrinth"],["Neope bhadra","Tailed Labyrinth"],["Neope pulaha","Veined Labyrinth"],["Neope pulahina","Scarce Labyrinth"],["Neope pulahoides","Assam Veined Labyrinth"],["Neope yama","Dusky Labyrinth"],["Lasiommata maerula","Scarce Wall"],["Lasiommata menava","Dark Wall"],["Lasiommata schakra","Common Wall"],["Kirinia eversmanni","Yellow Wall"],["Chonala masoni","Chumbi Wall"],["Rhaphicera moorei","Small Tawny Wall"],["Rhaphicera satricus","Large Tawny Wall"],["Orinoma damaris","Tigerbrown"],["Heteropsis adolphei","Redeye Bushbrown"],["Heteropsis malsara","White-line Bushbrown"],["Heteropsis mamerta","Blind-eye Bushbrown"],["Mycalesis adamsoni","Watson\'s Bushbrown"],["Mycalesis anaptia","Tawny Bushbrown"],["Mycalesis anaxias","Whitebar Bushbrown"],["Mycalesis annamitica","Blindeyed Bushbrown"],["Mycalesis evansii","Tytler\'s Bushbrown"],["Mycalesis francisca","Lilacine Bushbrown"],["Mycalesis gotama","Chinese Bushbrown"],["Mycalesis heri","Moore\'s Bushbrown"],["Mycalesis igilia","Small Long-brand Bushbrown"],["Mycalesis intermedia","Intermediate Bushbrown"],["Mycalesis lepcha","Lepcha Bushbrown"],["Mycalesis malsarida","Plain Bushbrown"],["Mycalesis manii","Nicobar Bushbrown"],["Mycalesis mestra","White-edged Bushbrown"],["Mycalesis mineus","Dark-brand Bushbrown"],["Mycalesis misenus","De Niceville\'s Bushbrown"],["Mycalesis mnasicles","Cyclops Bushbrown"],["Mycalesis mystes","Many-tufted Bushbrown"],["Mycalesis nicotia","Brighteye Bushbrown"],["Mycalesis oculus","Red-disc Bushbrown"],["Mycalesis orcha","Pale-brand Bushbrown"],["Mycalesis patiana","Eliot\'s Bushbrown"],["Mycalesis patnia","Glad-eye Bushbrown"],["Mycalesis perseus","Common Bushbrown"],["Mycalesis suaveolens","Wood-Mason\'s Bushbrown"],["Mycalesis visala","Long-brand Bushbrown"],["OrsotriaenaWallengren, medus","Nigger"],["Zipaetis saitis","Tamil Catseye"],["Zipaetis scylax","Dark Catseye"],["Erites falcipennis","Common Cyclops"],["Coelites nnootthhiiss","Scarce Catseye"],["RRaaggaaddiiaa crisilda","Striped Ringlet"],["Hyponephele carbonelli","Baltistan Meadowbrown"],["Hyponephele cheena","Branded Meadowbrown"],["Hyponephele coenonympha","Spotted Meadowbrown"],["Hyponephele davendra","White-ringed Meadowbrown"],["Hyponephele brevistigma","Short-branded Meadowbrown"],["Hyponephele tenuistigma","Lesser White-ringed Meadowbrown"],["Hyponephele pulchella","Tawny Meadowbrown"],["Hyponephele pulchra","Dusky Meadowbrown"],["Hyponephele hilaris","Pamir Meadowbrown"],["Callerebia annada","Ringed Argus"],["Callerebia baileyi","White-bordered Argus"],["Callerebia dibangensis","Roy\'s Argus"],["Callerebia hybrida","Hybrid Argus"],["Callerebia nirmala","Common Argus"],["Callerebia orixa","Moore\'s Argus"],["Callerebia scanda","Pallid Argus"],["Callerebia suroia","Manipur Argus"],["Paralasa chitralica","Chitral Argus"],["Paralasa kalinda","Scarce Mountain Argus"],["Paralasa mani","Yellow Argus"],["Paralasa shallada","Mountain Argus"],["Loxerebia narasingha","Mottled Argus"],["Ypthima affectata","Khasi Fivering"],["Ypthima asterope","Common Threering"],["Ypthima atra","Black Fivering"],["Ypthima baldus","Common Fivering"],["Ypthima bolanica","Desert Fourring"],["Ypthima cantliei","Cantlie\'s Fourring"],["Ypthima ceylonica","White Fourring"],["Ypthima chenu","Nilgiri Fourring"],["Ypthima davidsoni","Davidson\'s Fivering"],["Ypthima dohertyi","Great Fivering"],["Ypthima fusca","Assam Threering"],["Ypthima hannyngtoni","Hannyngton\'s Fivering"],["Ypthima huebneri","Common Fourring"],["Ypthima hyagriva","Brown Argus"],["Ypthima indecora","Western Fivering"],["Ypthima inica","Lesser Threering"],["Ypthima kasmira","Kashmir Fourring"],["Ypthima lisandra","Jewel Fourring"],["Ypthima lycus","Plain Threering"],["Ypthima methora","Variegated Fivering"],["Ypthima nareda","Large Threering"],["Ypthima newara","Newar Threering"],["Ypthima nikaea","Moore\'s Fivering"],["Ypthima norma","Burmese Threering"],["Ypthima parasakra","Himalayan Fourring"],["Ypthima persimilis","Manipur Fivering"],["Ypthima philomela","Baby Fivering"],["Ypthima sakra","Himalayan Fivering"],["Ypthima savara","Pallid Fivering"],["Ypthima similis","Eastern Fivering"],["Ypthima singala","Small Jewel Fourring"],["Ypthima sobrina","Karen Fivering"],["Ypthima striata","Nilgiri Jewel Fourring"],["Ypthima watsoni","Looped Threering"],["Ypthima yphthimoides","Palni Fourring"],["Oeneis buddha","Tibetan Satyr"],["Paroeneis pumilus","Mountain Satyr"],["Paroeneis sikkimensis","Sikkim Satyr"],["Karanasa alpherakyi","Avinoff\'s Satyr"],["Karanasa bolorica","Turkestan Satyr"],["Karanasa cadesia","Moore\'s Satyr"],["Karanasa huebneri","Tawny Satyr"],["Karanasa modesta","Small Satyr"],["Karanasa moorei","Shandur Satyr"],["Karanasa leechi","Leech\'s Satyr"],["Karanasa rohtanga","Rohtang Satyr"],["Satyrus pimpla","Black Satyr"],["Aulocera brahminus","Narrow-banded Satyr"],["Aulocera loha","Doherty\'s Satyr"],["Aulocera padma","Great Satyr"],["Aulocera saraswati","Striated Satyr"],["Aulocera swaha","Common Satyr"],["Hipparchia parisatis","White-edged Rockbrown"],["Chazara heydenreichi","Shandur Rockbrown"],["Pseudochazara baldiva","Kashmir Rockbrown"],["Pseudochazara droshica","Tytler\'s Rockbrown"],["Kanetisa digna","Chitrali Satyr"],["Neptis ananta","Yellow Sailer"],["Neptis armandia","Variegated Sailer"],["Neptis capnodes","Eliot\'s Sailer"],["Neptis cartica","Plain Sailer"],["Neptis clinia","Clear Sailer"],["Neptis cydippe","Chinese Yellow Sailer"],["Neptis harita","Dingiest Sailer"],["Neptis hylas","Common Sailer"],["Neptis ilira","Dark Dingy Sailer"],["Neptis jumbah","Chestnut-streaked Sailer"],["Neptis magadha","Spotted Sailer"],["Neptis mahendra","Himalayan Sailer"],["Neptis manasa","Pale Hockeystick Sailer"],["Neptis miah","Small Yellow Sailer"],["Neptis namba","Manipur Yellow Sailer"],["Neptis narayana","Broadstick Sailer"],["Neptis nashona","Less Rich Sailer"],["Neptis nata","Sullied Sailer"],["Neptis nemorum","Naga Hockeystick Sailer"],["Neptis pseudovikasi","Dingy Sailer"],["Neptis radha","Great Yellow Sailer"],["Neptis sankara","Broad-banded Sailer"],["Neptis sappho","Pallas\' Sailer"],["Neptis soma","Creamy Sailer"],["Neptis zaida","Pale Green Sailer"],["Phaedyma aspasia","Great Hockeystick Sailer"],["Phaedyma columella","Short-banded Sailer"],["Lasippa tiga","Burmese Lascar"],["Lasippa viraja","Yellowjack Sailer"],["Pantoporia assamica","Assamese Lascar"],["Pantoporia aurelia","Baby Lascar"],["Pantoporia bieti","Tytler\'s Lascar"],["Pantoporia hordonia","Common Lascar"],["Pantoporia paraka","Perak Lascar"],["Pantoporia sandaca","Extra Lascar"],["Athyma asura","Studded Sergeant"],["Athyma cama","Orange Staff Sergeant"],["Athyma nefte","Colour Sergeant"],["Athyma jina","Bhutan Sergeant"],["Athyma kanwa","Dot-dash Sergeant"],["Athyma larymna","Great Sergeant"],["Athyma opalina","Himalayan Sergeant"],["Athyma orientalis","Oriental Sergeant"],["Athyma perius","Common Sergeant"],["Athyma pravara","Unbroken Sergeant"],["Athyma ranga","Blackvein Sergeant"],["Athyma reta","Malay Staff Sergeant"],["Athyma rufula","Andaman Sergeant"],["Athyma selenophora","Staff Sergeant"],["Athyma whitei","Cryptic Sergeant"],["Athyma zeroca","Small Staff Sergeant"],["Limenitis lepechini","Chitral White Admiral"],["Limenitis trivena","Indian White Admiral"],["Moduza procris","Commander"],["Parasarpa dudu","White Commodore"],["Parasarpa zayla","Bicolour Commodore"],["Sumalia daraxa","Green Commodore"],["Sumalia zulema","Scarce White Commodore"],["Auzakia danava","Commodore"],["Bhagadatta austenia","Grey Commodore"],["Lebadea martha","Knight"],["Parthenos sylla","Clipper"],["Neurosigma siva","Panther"],["Abrota ganga","Sergeant-major"],["Cynitia cocytus","Lavender Count"],["Cynitia lepidea","Grey Count"],["Cynitia telchinia","Blue Baron"],["Tanaecia cibaritis","Andaman Viscount"],["Tanaecia jahnu","Plain Earl"],["Tanaecia julii","Common Earl"],["Euthalia aconthea","Common Baron"],["Euthalia alpheda","Streaked Baron"],["Euthalia anosia","Grey Baron"],["Euthalia confucius","Chinese Duke"],["Euthalia curvifascia","Naga Duke"],["Euthalia durga","Blue Duke"],["Euthalia duda","Blue Duchess"],["Euthalia evelina","Red-spot Duke"],["Euthalia eriphylae","White-tipped Baron"],["Euthalia franciae","French Duke"],["Euthalia iva","Grand Duke"],["Euthalia lengba","Tytler\'s Duchess"],["Euthalia lubentina","Gaudy Baron"],["Euthalia malaccana","Fruhstorfer\'s Baron"],["Euthalia merta","Dark Baron"],["Euthalia monina","Powdered Baron"],["Euthalia nara","Bronze Duke"],["Euthalia narayana","Burmese Baron"],["Euthalia patala","Grand Duchess"],["Euthalia phemius","White-edged Blue Baron"],["Euthalia recta","Redtail Maquis"],["Euthalia sahadeva","Green Duke"],["Euthalia saitaphernes","Mottled Baron"],["Euthalia teuta","Banded Marquis"],["Euthalia thawgawa","Tytler\'s Duke"],["Symphaedra nais","Baronet"],["Lexias cyanipardus","Great Archduke"],["Lexias dirtea","Dark Archduke"],["Lexias pardalis","Archduke"],["Argynnis aglaja","Dark Green Silverspot"],["Argynnis childreni","Great Silverstripe"],["Argynnis clara","Silverstreak"],["Argynnis hyperbius","Indian Fritillary"],["Argynnis jainadeva","Highbrown Silverspot"],["Argynnis kamala","Common Silverstripe"],["Argynnis laodice","Eastern Silverstripe"],["Argynnis pandora","Cardinal"],["Issoria altissima","Mountain Silverspot"],["Issoria gemmata","Gem Silverspot"],["Issoria lathonia","Queen of Spain Fritillary"],["Issoria mackinnoni","Brilliant Silverspot"],["Boloria erubescens","Whitespot Fritillary"],["Boloria generator","Hunza Silverspot"],["Boloria jerdoni","Jerdon\'s Silverspot"],["Boloria sipora","Straightwing Silverspot"],["Phalanta alcippe","Small Leopard"],["Phalanta phalantha","Common Leopard"],["Cupha erymanthis","Rustic"],["Vagrans egista","Vagrant"],["Vindula erota","Cruiser"],["Algia fasciata","Branded Yeoman"],["Cirrochroa aoris","Large Yeoman"],["Cirrochroa nicobarica","Nicobar Yeoman"],["Cirrochroa thais","Tamil Yeoman"],["Cirrochroa tyche","Common Yeoman"],["Ariadne ariadne","Angled Castor"],["Ariadne merione","Common Castor"],["Laringa horsfieldi","Banded Dandy"],["Byblia marathus","Pasha"],["Euripus consimilis","Painted Courtesan"],["Euripus nyctelius","Courtesan"],["Hestina nicevillei","Scarce Siren"],["Hestina persimilis","Siren"],["Hestinalis nama","Circe"],["Sasakia funebris","Empress"],["Cyrestis cocles","Marbled Map"],["Cyrestis tabula","Nicobar Map"],["Cyrestis thyodamas","Common Map"],["Chersonesia intermedia","Wavy Maplet"],["Chersonesia risa","Common Maplet"],["Pseudergolis wedah","Tabby"],["Stibochiona nicea","Popinjay"],["Dichorragia nesimachus","Constable"],["Melitaea arcesia","Blackvein Fritillary"],["Melitaea shandura","Shandur Fritillary"],["Melitaea fergana","Uzbek Fritillary"],["Melitaea nadezhdae","Sheljuzhko\'s Fritillary"],["Melitaea balbina","Pamir Fritillary"],["Symbrenthia brabira","Himalayan Jester"],["Symbrenthia doni","Naga Jester"],["Symbrenthia hypselis","Spotted Jester"],["Symbrenthia lilaea","Common Jester"],["Symbrenthia niphanda","Blue-tailed Jester"],["Symbrenthia silana","Scarce Jester"],["Araschnia prorsoides","Mongol"],["Nymphalis xanthomelas","Large Tortoiseshell"],["Aglais caschmirensis","Indian Tortoiseshell"],["Aglais ladakensis","Ladakh Tortoiseshell"],["Aglais rizana","Mountain Tortoiseshell"],["Kaniska canace","Blue Admiral"],["Polygonia c-album","Comma"],["Polygonia l-album","False Comma"],["Polygonia undina","Pamir Comma"],["Vanessa cardui","Painted Lady"],["Vanessa indica","Indian Red Admiral"],["Junonia almana","Peacock Pansy"],["Junonia atlites","Grey Pansy"],["Junonia hierta","Yellow Pansy"],["Junonia iphita","Chocolate Pansy"],["Junonia lemonias","Lemon Pansy"],["Junonia orithya","Blue Pansy"],["Hypolimnas anomala","Malayan Eggfly"],["Hypolimnas bolina","Great Eggfly"],["Hypolimnas misippus","Danaid Eggfly"],["Kallima albofasciata","White Oakleaf"],["Kallima horsfieldi","Southern Blue Oakleaf"],["Kallima inachus","Orange Oakleaf"],["Kallima knyvetti","Scarce Blue Oakleaf"],["Doleschallia bisaltide","Autumn Leaf"],["Rhinopalpa polynice","Wizard"],["Yoma sabina","Lurcher"],["Acraea issoria","Yellow Coster"],["Acraea violae","Tawny Coster"],["Cethosia biblis","Red Lacewing"],["Cethosia cyane","Leopard Lacewing"],["Cethosia nietneri","Tamil Lacewing"],["Libythea lepita","Common Beak"],["Libythea myrrha","Club Beak"],["Libythea narina","White-spotted Beak"]]');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************************!*\
  !*** ./resources/js/validate.js ***!
  \**********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm.js");
/* harmony import */ var _components_validate__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/validate */ "./resources/js/components/validate.vue");


var app = new vue__WEBPACK_IMPORTED_MODULE_1__.default({
  el: '#app',
  components: {
    Validate: _components_validate__WEBPACK_IMPORTED_MODULE_0__.default
  },
  data: function data() {
    return {};
  },
  methods: {}
});
})();

/******/ })()
;
=======
/*! For license information please see validate.js.LICENSE.txt */
(()=>{var e={9669:(e,a,t)=>{e.exports=t(1609)},5448:(e,a,t)=>{"use strict";var n=t(4867),r=t(6026),i=t(4372),o=t(5327),s=t(4097),l=t(4109),u=t(7985),c=t(5061);e.exports=function(e){return new Promise((function(a,t){var d=e.data,p=e.headers,f=e.responseType;n.isFormData(d)&&delete p["Content-Type"];var h=new XMLHttpRequest;if(e.auth){var m=e.auth.username||"",v=e.auth.password?unescape(encodeURIComponent(e.auth.password)):"";p.Authorization="Basic "+btoa(m+":"+v)}var g=s(e.baseURL,e.url);function y(){if(h){var n="getAllResponseHeaders"in h?l(h.getAllResponseHeaders()):null,i={data:f&&"text"!==f&&"json"!==f?h.response:h.responseText,status:h.status,statusText:h.statusText,headers:n,config:e,request:h};r(a,t,i),h=null}}if(h.open(e.method.toUpperCase(),o(g,e.params,e.paramsSerializer),!0),h.timeout=e.timeout,"onloadend"in h?h.onloadend=y:h.onreadystatechange=function(){h&&4===h.readyState&&(0!==h.status||h.responseURL&&0===h.responseURL.indexOf("file:"))&&setTimeout(y)},h.onabort=function(){h&&(t(c("Request aborted",e,"ECONNABORTED",h)),h=null)},h.onerror=function(){t(c("Network Error",e,null,h)),h=null},h.ontimeout=function(){var a="timeout of "+e.timeout+"ms exceeded";e.timeoutErrorMessage&&(a=e.timeoutErrorMessage),t(c(a,e,e.transitional&&e.transitional.clarifyTimeoutError?"ETIMEDOUT":"ECONNABORTED",h)),h=null},n.isStandardBrowserEnv()){var b=(e.withCredentials||u(g))&&e.xsrfCookieName?i.read(e.xsrfCookieName):void 0;b&&(p[e.xsrfHeaderName]=b)}"setRequestHeader"in h&&n.forEach(p,(function(e,a){void 0===d&&"content-type"===a.toLowerCase()?delete p[a]:h.setRequestHeader(a,e)})),n.isUndefined(e.withCredentials)||(h.withCredentials=!!e.withCredentials),f&&"json"!==f&&(h.responseType=e.responseType),"function"==typeof e.onDownloadProgress&&h.addEventListener("progress",e.onDownloadProgress),"function"==typeof e.onUploadProgress&&h.upload&&h.upload.addEventListener("progress",e.onUploadProgress),e.cancelToken&&e.cancelToken.promise.then((function(e){h&&(h.abort(),t(e),h=null)})),d||(d=null),h.send(d)}))}},1609:(e,a,t)=>{"use strict";var n=t(4867),r=t(1849),i=t(321),o=t(7185);function s(e){var a=new i(e),t=r(i.prototype.request,a);return n.extend(t,i.prototype,a),n.extend(t,a),t}var l=s(t(5655));l.Axios=i,l.create=function(e){return s(o(l.defaults,e))},l.Cancel=t(5263),l.CancelToken=t(4972),l.isCancel=t(6502),l.all=function(e){return Promise.all(e)},l.spread=t(8713),l.isAxiosError=t(6268),e.exports=l,e.exports.default=l},5263:e=>{"use strict";function a(e){this.message=e}a.prototype.toString=function(){return"Cancel"+(this.message?": "+this.message:"")},a.prototype.__CANCEL__=!0,e.exports=a},4972:(e,a,t)=>{"use strict";var n=t(5263);function r(e){if("function"!=typeof e)throw new TypeError("executor must be a function.");var a;this.promise=new Promise((function(e){a=e}));var t=this;e((function(e){t.reason||(t.reason=new n(e),a(t.reason))}))}r.prototype.throwIfRequested=function(){if(this.reason)throw this.reason},r.source=function(){var e;return{token:new r((function(a){e=a})),cancel:e}},e.exports=r},6502:e=>{"use strict";e.exports=function(e){return!(!e||!e.__CANCEL__)}},321:(e,a,t)=>{"use strict";var n=t(4867),r=t(5327),i=t(782),o=t(3572),s=t(7185),l=t(4875),u=l.validators;function c(e){this.defaults=e,this.interceptors={request:new i,response:new i}}c.prototype.request=function(e){"string"==typeof e?(e=arguments[1]||{}).url=arguments[0]:e=e||{},(e=s(this.defaults,e)).method?e.method=e.method.toLowerCase():this.defaults.method?e.method=this.defaults.method.toLowerCase():e.method="get";var a=e.transitional;void 0!==a&&l.assertOptions(a,{silentJSONParsing:u.transitional(u.boolean,"1.0.0"),forcedJSONParsing:u.transitional(u.boolean,"1.0.0"),clarifyTimeoutError:u.transitional(u.boolean,"1.0.0")},!1);var t=[],n=!0;this.interceptors.request.forEach((function(a){"function"==typeof a.runWhen&&!1===a.runWhen(e)||(n=n&&a.synchronous,t.unshift(a.fulfilled,a.rejected))}));var r,i=[];if(this.interceptors.response.forEach((function(e){i.push(e.fulfilled,e.rejected)})),!n){var c=[o,void 0];for(Array.prototype.unshift.apply(c,t),c=c.concat(i),r=Promise.resolve(e);c.length;)r=r.then(c.shift(),c.shift());return r}for(var d=e;t.length;){var p=t.shift(),f=t.shift();try{d=p(d)}catch(e){f(e);break}}try{r=o(d)}catch(e){return Promise.reject(e)}for(;i.length;)r=r.then(i.shift(),i.shift());return r},c.prototype.getUri=function(e){return e=s(this.defaults,e),r(e.url,e.params,e.paramsSerializer).replace(/^\?/,"")},n.forEach(["delete","get","head","options"],(function(e){c.prototype[e]=function(a,t){return this.request(s(t||{},{method:e,url:a,data:(t||{}).data}))}})),n.forEach(["post","put","patch"],(function(e){c.prototype[e]=function(a,t,n){return this.request(s(n||{},{method:e,url:a,data:t}))}})),e.exports=c},782:(e,a,t)=>{"use strict";var n=t(4867);function r(){this.handlers=[]}r.prototype.use=function(e,a,t){return this.handlers.push({fulfilled:e,rejected:a,synchronous:!!t&&t.synchronous,runWhen:t?t.runWhen:null}),this.handlers.length-1},r.prototype.eject=function(e){this.handlers[e]&&(this.handlers[e]=null)},r.prototype.forEach=function(e){n.forEach(this.handlers,(function(a){null!==a&&e(a)}))},e.exports=r},4097:(e,a,t)=>{"use strict";var n=t(1793),r=t(7303);e.exports=function(e,a){return e&&!n(a)?r(e,a):a}},5061:(e,a,t)=>{"use strict";var n=t(481);e.exports=function(e,a,t,r,i){var o=new Error(e);return n(o,a,t,r,i)}},3572:(e,a,t)=>{"use strict";var n=t(4867),r=t(8527),i=t(6502),o=t(5655);function s(e){e.cancelToken&&e.cancelToken.throwIfRequested()}e.exports=function(e){return s(e),e.headers=e.headers||{},e.data=r.call(e,e.data,e.headers,e.transformRequest),e.headers=n.merge(e.headers.common||{},e.headers[e.method]||{},e.headers),n.forEach(["delete","get","head","post","put","patch","common"],(function(a){delete e.headers[a]})),(e.adapter||o.adapter)(e).then((function(a){return s(e),a.data=r.call(e,a.data,a.headers,e.transformResponse),a}),(function(a){return i(a)||(s(e),a&&a.response&&(a.response.data=r.call(e,a.response.data,a.response.headers,e.transformResponse))),Promise.reject(a)}))}},481:e=>{"use strict";e.exports=function(e,a,t,n,r){return e.config=a,t&&(e.code=t),e.request=n,e.response=r,e.isAxiosError=!0,e.toJSON=function(){return{message:this.message,name:this.name,description:this.description,number:this.number,fileName:this.fileName,lineNumber:this.lineNumber,columnNumber:this.columnNumber,stack:this.stack,config:this.config,code:this.code}},e}},7185:(e,a,t)=>{"use strict";var n=t(4867);e.exports=function(e,a){a=a||{};var t={},r=["url","method","data"],i=["headers","auth","proxy","params"],o=["baseURL","transformRequest","transformResponse","paramsSerializer","timeout","timeoutMessage","withCredentials","adapter","responseType","xsrfCookieName","xsrfHeaderName","onUploadProgress","onDownloadProgress","decompress","maxContentLength","maxBodyLength","maxRedirects","transport","httpAgent","httpsAgent","cancelToken","socketPath","responseEncoding"],s=["validateStatus"];function l(e,a){return n.isPlainObject(e)&&n.isPlainObject(a)?n.merge(e,a):n.isPlainObject(a)?n.merge({},a):n.isArray(a)?a.slice():a}function u(r){n.isUndefined(a[r])?n.isUndefined(e[r])||(t[r]=l(void 0,e[r])):t[r]=l(e[r],a[r])}n.forEach(r,(function(e){n.isUndefined(a[e])||(t[e]=l(void 0,a[e]))})),n.forEach(i,u),n.forEach(o,(function(r){n.isUndefined(a[r])?n.isUndefined(e[r])||(t[r]=l(void 0,e[r])):t[r]=l(void 0,a[r])})),n.forEach(s,(function(n){n in a?t[n]=l(e[n],a[n]):n in e&&(t[n]=l(void 0,e[n]))}));var c=r.concat(i).concat(o).concat(s),d=Object.keys(e).concat(Object.keys(a)).filter((function(e){return-1===c.indexOf(e)}));return n.forEach(d,u),t}},6026:(e,a,t)=>{"use strict";var n=t(5061);e.exports=function(e,a,t){var r=t.config.validateStatus;t.status&&r&&!r(t.status)?a(n("Request failed with status code "+t.status,t.config,null,t.request,t)):e(t)}},8527:(e,a,t)=>{"use strict";var n=t(4867),r=t(5655);e.exports=function(e,a,t){var i=this||r;return n.forEach(t,(function(t){e=t.call(i,e,a)})),e}},5655:(e,a,t)=>{"use strict";var n=t(4155),r=t(4867),i=t(6016),o=t(481),s={"Content-Type":"application/x-www-form-urlencoded"};function l(e,a){!r.isUndefined(e)&&r.isUndefined(e["Content-Type"])&&(e["Content-Type"]=a)}var u,c={transitional:{silentJSONParsing:!0,forcedJSONParsing:!0,clarifyTimeoutError:!1},adapter:(("undefined"!=typeof XMLHttpRequest||void 0!==n&&"[object process]"===Object.prototype.toString.call(n))&&(u=t(5448)),u),transformRequest:[function(e,a){return i(a,"Accept"),i(a,"Content-Type"),r.isFormData(e)||r.isArrayBuffer(e)||r.isBuffer(e)||r.isStream(e)||r.isFile(e)||r.isBlob(e)?e:r.isArrayBufferView(e)?e.buffer:r.isURLSearchParams(e)?(l(a,"application/x-www-form-urlencoded;charset=utf-8"),e.toString()):r.isObject(e)||a&&"application/json"===a["Content-Type"]?(l(a,"application/json"),function(e,a,t){if(r.isString(e))try{return(a||JSON.parse)(e),r.trim(e)}catch(e){if("SyntaxError"!==e.name)throw e}return(t||JSON.stringify)(e)}(e)):e}],transformResponse:[function(e){var a=this.transitional,t=a&&a.silentJSONParsing,n=a&&a.forcedJSONParsing,i=!t&&"json"===this.responseType;if(i||n&&r.isString(e)&&e.length)try{return JSON.parse(e)}catch(e){if(i){if("SyntaxError"===e.name)throw o(e,this,"E_JSON_PARSE");throw e}}return e}],timeout:0,xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN",maxContentLength:-1,maxBodyLength:-1,validateStatus:function(e){return e>=200&&e<300}};c.headers={common:{Accept:"application/json, text/plain, */*"}},r.forEach(["delete","get","head"],(function(e){c.headers[e]={}})),r.forEach(["post","put","patch"],(function(e){c.headers[e]=r.merge(s)})),e.exports=c},1849:e=>{"use strict";e.exports=function(e,a){return function(){for(var t=new Array(arguments.length),n=0;n<t.length;n++)t[n]=arguments[n];return e.apply(a,t)}}},5327:(e,a,t)=>{"use strict";var n=t(4867);function r(e){return encodeURIComponent(e).replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,"+").replace(/%5B/gi,"[").replace(/%5D/gi,"]")}e.exports=function(e,a,t){if(!a)return e;var i;if(t)i=t(a);else if(n.isURLSearchParams(a))i=a.toString();else{var o=[];n.forEach(a,(function(e,a){null!=e&&(n.isArray(e)?a+="[]":e=[e],n.forEach(e,(function(e){n.isDate(e)?e=e.toISOString():n.isObject(e)&&(e=JSON.stringify(e)),o.push(r(a)+"="+r(e))})))})),i=o.join("&")}if(i){var s=e.indexOf("#");-1!==s&&(e=e.slice(0,s)),e+=(-1===e.indexOf("?")?"?":"&")+i}return e}},7303:e=>{"use strict";e.exports=function(e,a){return a?e.replace(/\/+$/,"")+"/"+a.replace(/^\/+/,""):e}},4372:(e,a,t)=>{"use strict";var n=t(4867);e.exports=n.isStandardBrowserEnv()?{write:function(e,a,t,r,i,o){var s=[];s.push(e+"="+encodeURIComponent(a)),n.isNumber(t)&&s.push("expires="+new Date(t).toGMTString()),n.isString(r)&&s.push("path="+r),n.isString(i)&&s.push("domain="+i),!0===o&&s.push("secure"),document.cookie=s.join("; ")},read:function(e){var a=document.cookie.match(new RegExp("(^|;\\s*)("+e+")=([^;]*)"));return a?decodeURIComponent(a[3]):null},remove:function(e){this.write(e,"",Date.now()-864e5)}}:{write:function(){},read:function(){return null},remove:function(){}}},1793:e=>{"use strict";e.exports=function(e){return/^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(e)}},6268:e=>{"use strict";e.exports=function(e){return"object"==typeof e&&!0===e.isAxiosError}},7985:(e,a,t)=>{"use strict";var n=t(4867);e.exports=n.isStandardBrowserEnv()?function(){var e,a=/(msie|trident)/i.test(navigator.userAgent),t=document.createElement("a");function r(e){var n=e;return a&&(t.setAttribute("href",n),n=t.href),t.setAttribute("href",n),{href:t.href,protocol:t.protocol?t.protocol.replace(/:$/,""):"",host:t.host,search:t.search?t.search.replace(/^\?/,""):"",hash:t.hash?t.hash.replace(/^#/,""):"",hostname:t.hostname,port:t.port,pathname:"/"===t.pathname.charAt(0)?t.pathname:"/"+t.pathname}}return e=r(window.location.href),function(a){var t=n.isString(a)?r(a):a;return t.protocol===e.protocol&&t.host===e.host}}():function(){return!0}},6016:(e,a,t)=>{"use strict";var n=t(4867);e.exports=function(e,a){n.forEach(e,(function(t,n){n!==a&&n.toUpperCase()===a.toUpperCase()&&(e[a]=t,delete e[n])}))}},4109:(e,a,t)=>{"use strict";var n=t(4867),r=["age","authorization","content-length","content-type","etag","expires","from","host","if-modified-since","if-unmodified-since","last-modified","location","max-forwards","proxy-authorization","referer","retry-after","user-agent"];e.exports=function(e){var a,t,i,o={};return e?(n.forEach(e.split("\n"),(function(e){if(i=e.indexOf(":"),a=n.trim(e.substr(0,i)).toLowerCase(),t=n.trim(e.substr(i+1)),a){if(o[a]&&r.indexOf(a)>=0)return;o[a]="set-cookie"===a?(o[a]?o[a]:[]).concat([t]):o[a]?o[a]+", "+t:t}})),o):o}},8713:e=>{"use strict";e.exports=function(e){return function(a){return e.apply(null,a)}}},4875:(e,a,t)=>{"use strict";var n=t(8593),r={};["object","boolean","number","function","string","symbol"].forEach((function(e,a){r[e]=function(t){return typeof t===e||"a"+(a<1?"n ":" ")+e}}));var i={},o=n.version.split(".");function s(e,a){for(var t=a?a.split("."):o,n=e.split("."),r=0;r<3;r++){if(t[r]>n[r])return!0;if(t[r]<n[r])return!1}return!1}r.transitional=function(e,a,t){var r=a&&s(a);function o(e,a){return"[Axios v"+n.version+"] Transitional option '"+e+"'"+a+(t?". "+t:"")}return function(t,n,s){if(!1===e)throw new Error(o(n," has been removed in "+a));return r&&!i[n]&&(i[n]=!0,console.warn(o(n," has been deprecated since v"+a+" and will be removed in the near future"))),!e||e(t,n,s)}},e.exports={isOlderVersion:s,assertOptions:function(e,a,t){if("object"!=typeof e)throw new TypeError("options must be an object");for(var n=Object.keys(e),r=n.length;r-- >0;){var i=n[r],o=a[i];if(o){var s=e[i],l=void 0===s||o(s,i,e);if(!0!==l)throw new TypeError("option "+i+" must be "+l)}else if(!0!==t)throw Error("Unknown option "+i)}},validators:r}},4867:(e,a,t)=>{"use strict";var n=t(1849),r=Object.prototype.toString;function i(e){return"[object Array]"===r.call(e)}function o(e){return void 0===e}function s(e){return null!==e&&"object"==typeof e}function l(e){if("[object Object]"!==r.call(e))return!1;var a=Object.getPrototypeOf(e);return null===a||a===Object.prototype}function u(e){return"[object Function]"===r.call(e)}function c(e,a){if(null!=e)if("object"!=typeof e&&(e=[e]),i(e))for(var t=0,n=e.length;t<n;t++)a.call(null,e[t],t,e);else for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&a.call(null,e[r],r,e)}e.exports={isArray:i,isArrayBuffer:function(e){return"[object ArrayBuffer]"===r.call(e)},isBuffer:function(e){return null!==e&&!o(e)&&null!==e.constructor&&!o(e.constructor)&&"function"==typeof e.constructor.isBuffer&&e.constructor.isBuffer(e)},isFormData:function(e){return"undefined"!=typeof FormData&&e instanceof FormData},isArrayBufferView:function(e){return"undefined"!=typeof ArrayBuffer&&ArrayBuffer.isView?ArrayBuffer.isView(e):e&&e.buffer&&e.buffer instanceof ArrayBuffer},isString:function(e){return"string"==typeof e},isNumber:function(e){return"number"==typeof e},isObject:s,isPlainObject:l,isUndefined:o,isDate:function(e){return"[object Date]"===r.call(e)},isFile:function(e){return"[object File]"===r.call(e)},isBlob:function(e){return"[object Blob]"===r.call(e)},isFunction:u,isStream:function(e){return s(e)&&u(e.pipe)},isURLSearchParams:function(e){return"undefined"!=typeof URLSearchParams&&e instanceof URLSearchParams},isStandardBrowserEnv:function(){return("undefined"==typeof navigator||"ReactNative"!==navigator.product&&"NativeScript"!==navigator.product&&"NS"!==navigator.product)&&("undefined"!=typeof window&&"undefined"!=typeof document)},forEach:c,merge:function e(){var a={};function t(t,n){l(a[n])&&l(t)?a[n]=e(a[n],t):l(t)?a[n]=e({},t):i(t)?a[n]=t.slice():a[n]=t}for(var n=0,r=arguments.length;n<r;n++)c(arguments[n],t);return a},extend:function(e,a,t){return c(a,(function(a,r){e[r]=t&&"function"==typeof a?n(a,t):a})),e},trim:function(e){return e.trim?e.trim():e.replace(/^\s+|\s+$/g,"")},stripBOM:function(e){return 65279===e.charCodeAt(0)&&(e=e.slice(1)),e}}},5478:(e,a,t)=>{"use strict";t.d(a,{Z:()=>i});var n=t(1519),r=t.n(n)()((function(e){return e[1]}));r.push([e.id,".text-blank{background:hsla(0,100%,70%,.5)}.unmatched-name{background:rgba(255,0,0,.5)}.matched-name{background:rgba(100,255,100,.25)}.sl_no-row{width:10%}.quality-cell{font-size:.75rem;width:25%}",""]);const i=r},1519:e=>{"use strict";e.exports=function(e){var a=[];return a.toString=function(){return this.map((function(a){var t=e(a);return a[2]?"@media ".concat(a[2]," {").concat(t,"}"):t})).join("")},a.i=function(e,t,n){"string"==typeof e&&(e=[[null,e,""]]);var r={};if(n)for(var i=0;i<this.length;i++){var o=this[i][0];null!=o&&(r[o]=!0)}for(var s=0;s<e.length;s++){var l=[].concat(e[s]);n&&r[l[0]]||(t&&(l[2]?l[2]="".concat(t," and ").concat(l[2]):l[2]=t),a.push(l))}},a}},4155:e=>{var a,t,n=e.exports={};function r(){throw new Error("setTimeout has not been defined")}function i(){throw new Error("clearTimeout has not been defined")}function o(e){if(a===setTimeout)return setTimeout(e,0);if((a===r||!a)&&setTimeout)return a=setTimeout,setTimeout(e,0);try{return a(e,0)}catch(t){try{return a.call(null,e,0)}catch(t){return a.call(this,e,0)}}}!function(){try{a="function"==typeof setTimeout?setTimeout:r}catch(e){a=r}try{t="function"==typeof clearTimeout?clearTimeout:i}catch(e){t=i}}();var s,l=[],u=!1,c=-1;function d(){u&&s&&(u=!1,s.length?l=s.concat(l):c=-1,l.length&&p())}function p(){if(!u){var e=o(d);u=!0;for(var a=l.length;a;){for(s=l,l=[];++c<a;)s&&s[c].run();c=-1,a=l.length}s=null,u=!1,function(e){if(t===clearTimeout)return clearTimeout(e);if((t===i||!t)&&clearTimeout)return t=clearTimeout,clearTimeout(e);try{t(e)}catch(a){try{return t.call(null,e)}catch(a){return t.call(this,e)}}}(e)}}function f(e,a){this.fun=e,this.array=a}function h(){}n.nextTick=function(e){var a=new Array(arguments.length-1);if(arguments.length>1)for(var t=1;t<arguments.length;t++)a[t-1]=arguments[t];l.push(new f(e,a)),1!==l.length||u||o(p)},f.prototype.run=function(){this.fun.apply(null,this.array)},n.title="browser",n.browser=!0,n.env={},n.argv=[],n.version="",n.versions={},n.on=h,n.addListener=h,n.once=h,n.off=h,n.removeListener=h,n.removeAllListeners=h,n.emit=h,n.prependListener=h,n.prependOnceListener=h,n.listeners=function(e){return[]},n.binding=function(e){throw new Error("process.binding is not supported")},n.cwd=function(){return"/"},n.chdir=function(e){throw new Error("process.chdir is not supported")},n.umask=function(){return 0}},3379:(e,a,t)=>{"use strict";var n,r=function(){return void 0===n&&(n=Boolean(window&&document&&document.all&&!window.atob)),n},i=function(){var e={};return function(a){if(void 0===e[a]){var t=document.querySelector(a);if(window.HTMLIFrameElement&&t instanceof window.HTMLIFrameElement)try{t=t.contentDocument.head}catch(e){t=null}e[a]=t}return e[a]}}(),o=[];function s(e){for(var a=-1,t=0;t<o.length;t++)if(o[t].identifier===e){a=t;break}return a}function l(e,a){for(var t={},n=[],r=0;r<e.length;r++){var i=e[r],l=a.base?i[0]+a.base:i[0],u=t[l]||0,c="".concat(l," ").concat(u);t[l]=u+1;var d=s(c),p={css:i[1],media:i[2],sourceMap:i[3]};-1!==d?(o[d].references++,o[d].updater(p)):o.push({identifier:c,updater:v(p,a),references:1}),n.push(c)}return n}function u(e){var a=document.createElement("style"),n=e.attributes||{};if(void 0===n.nonce){var r=t.nc;r&&(n.nonce=r)}if(Object.keys(n).forEach((function(e){a.setAttribute(e,n[e])})),"function"==typeof e.insert)e.insert(a);else{var o=i(e.insert||"head");if(!o)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");o.appendChild(a)}return a}var c,d=(c=[],function(e,a){return c[e]=a,c.filter(Boolean).join("\n")});function p(e,a,t,n){var r=t?"":n.media?"@media ".concat(n.media," {").concat(n.css,"}"):n.css;if(e.styleSheet)e.styleSheet.cssText=d(a,r);else{var i=document.createTextNode(r),o=e.childNodes;o[a]&&e.removeChild(o[a]),o.length?e.insertBefore(i,o[a]):e.appendChild(i)}}function f(e,a,t){var n=t.css,r=t.media,i=t.sourceMap;if(r?e.setAttribute("media",r):e.removeAttribute("media"),i&&"undefined"!=typeof btoa&&(n+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(i))))," */")),e.styleSheet)e.styleSheet.cssText=n;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(n))}}var h=null,m=0;function v(e,a){var t,n,r;if(a.singleton){var i=m++;t=h||(h=u(a)),n=p.bind(null,t,i,!1),r=p.bind(null,t,i,!0)}else t=u(a),n=f.bind(null,t,a),r=function(){!function(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e)}(t)};return n(e),function(a){if(a){if(a.css===e.css&&a.media===e.media&&a.sourceMap===e.sourceMap)return;n(e=a)}else r()}}e.exports=function(e,a){(a=a||{}).singleton||"boolean"==typeof a.singleton||(a.singleton=r());var t=l(e=e||[],a);return function(e){if(e=e||[],"[object Array]"===Object.prototype.toString.call(e)){for(var n=0;n<t.length;n++){var r=s(t[n]);o[r].references--}for(var i=l(e,a),u=0;u<t.length;u++){var c=s(t[u]);0===o[c].references&&(o[c].updater(),o.splice(c,1))}t=i}}}},8593:e=>{"use strict";e.exports=JSON.parse('{"name":"axios","version":"0.21.4","description":"Promise based HTTP client for the browser and node.js","main":"index.js","scripts":{"test":"grunt test","start":"node ./sandbox/server.js","build":"NODE_ENV=production grunt build","preversion":"npm test","version":"npm run build && grunt version && git add -A dist && git add CHANGELOG.md bower.json package.json","postversion":"git push && git push --tags","examples":"node ./examples/server.js","coveralls":"cat coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js","fix":"eslint --fix lib/**/*.js"},"repository":{"type":"git","url":"https://github.com/axios/axios.git"},"keywords":["xhr","http","ajax","promise","node"],"author":"Matt Zabriskie","license":"MIT","bugs":{"url":"https://github.com/axios/axios/issues"},"homepage":"https://axios-http.com","devDependencies":{"coveralls":"^3.0.0","es6-promise":"^4.2.4","grunt":"^1.3.0","grunt-banner":"^0.6.0","grunt-cli":"^1.2.0","grunt-contrib-clean":"^1.1.0","grunt-contrib-watch":"^1.0.0","grunt-eslint":"^23.0.0","grunt-karma":"^4.0.0","grunt-mocha-test":"^0.13.3","grunt-ts":"^6.0.0-beta.19","grunt-webpack":"^4.0.2","istanbul-instrumenter-loader":"^1.0.0","jasmine-core":"^2.4.1","karma":"^6.3.2","karma-chrome-launcher":"^3.1.0","karma-firefox-launcher":"^2.1.0","karma-jasmine":"^1.1.1","karma-jasmine-ajax":"^0.1.13","karma-safari-launcher":"^1.0.0","karma-sauce-launcher":"^4.3.6","karma-sinon":"^1.0.5","karma-sourcemap-loader":"^0.3.8","karma-webpack":"^4.0.2","load-grunt-tasks":"^3.5.2","minimist":"^1.2.0","mocha":"^8.2.1","sinon":"^4.5.0","terser-webpack-plugin":"^4.2.3","typescript":"^4.0.5","url-search-params":"^0.10.0","webpack":"^4.44.2","webpack-dev-server":"^3.11.0"},"browser":{"./lib/adapters/http.js":"./lib/adapters/xhr.js"},"jsdelivr":"dist/axios.min.js","unpkg":"dist/axios.min.js","typings":"./index.d.ts","dependencies":{"follow-redirects":"^1.14.0"},"bundlesize":[{"path":"./dist/axios.min.js","threshold":"5kB"}]}')}},a={};function t(n){var r=a[n];if(void 0!==r)return r.exports;var i=a[n]={id:n,exports:{}};return e[n](i,i.exports,t),i.exports}t.n=e=>{var a=e&&e.__esModule?()=>e.default:()=>e;return t.d(a,{a}),a},t.d=(e,a)=>{for(var n in a)t.o(a,n)&&!t.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:a[n]})},t.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),t.o=(e,a)=>Object.prototype.hasOwnProperty.call(e,a),t.nc=void 0,(()=>{"use strict";var e=Object.freeze({}),a=Array.isArray;function n(e){return null==e}function r(e){return null!=e}function i(e){return!0===e}function o(e){return"string"==typeof e||"number"==typeof e||"symbol"==typeof e||"boolean"==typeof e}function s(e){return"function"==typeof e}function l(e){return null!==e&&"object"==typeof e}var u=Object.prototype.toString;function c(e){return"[object Object]"===u.call(e)}function d(e){return"[object RegExp]"===u.call(e)}function p(e){var a=parseFloat(String(e));return a>=0&&Math.floor(a)===a&&isFinite(e)}function f(e){return r(e)&&"function"==typeof e.then&&"function"==typeof e.catch}function h(e){return null==e?"":Array.isArray(e)||c(e)&&e.toString===u?JSON.stringify(e,null,2):String(e)}function m(e){var a=parseFloat(e);return isNaN(a)?e:a}function v(e,a){for(var t=Object.create(null),n=e.split(","),r=0;r<n.length;r++)t[n[r]]=!0;return a?function(e){return t[e.toLowerCase()]}:function(e){return t[e]}}var g=v("slot,component",!0),y=v("key,ref,slot,slot-scope,is");function b(e,a){if(e.length){var t=e.indexOf(a);if(t>-1)return e.splice(t,1)}}var w=Object.prototype.hasOwnProperty;function C(e,a){return w.call(e,a)}function S(e){var a=Object.create(null);return function(t){return a[t]||(a[t]=e(t))}}var k=/-(\w)/g,_=S((function(e){return e.replace(k,(function(e,a){return a?a.toUpperCase():""}))})),P=S((function(e){return e.charAt(0).toUpperCase()+e.slice(1)})),A=/\B([A-Z])/g,B=S((function(e){return e.replace(A,"-$1").toLowerCase()}));var x=Function.prototype.bind?function(e,a){return e.bind(a)}:function(e,a){function t(t){var n=arguments.length;return n?n>1?e.apply(a,arguments):e.call(a,t):e.call(a)}return t._length=e.length,t};function T(e,a){a=a||0;for(var t=e.length-a,n=new Array(t);t--;)n[t]=e[t+a];return n}function O(e,a){for(var t in a)e[t]=a[t];return e}function L(e){for(var a={},t=0;t<e.length;t++)e[t]&&O(a,e[t]);return a}function $(e,a,t){}var D=function(e,a,t){return!1},M=function(e){return e};function E(e,a){if(e===a)return!0;var t=l(e),n=l(a);if(!t||!n)return!t&&!n&&String(e)===String(a);try{var r=Array.isArray(e),i=Array.isArray(a);if(r&&i)return e.length===a.length&&e.every((function(e,t){return E(e,a[t])}));if(e instanceof Date&&a instanceof Date)return e.getTime()===a.getTime();if(r||i)return!1;var o=Object.keys(e),s=Object.keys(a);return o.length===s.length&&o.every((function(t){return E(e[t],a[t])}))}catch(e){return!1}}function F(e,a){for(var t=0;t<e.length;t++)if(E(e[t],a))return t;return-1}function N(e){var a=!1;return function(){a||(a=!0,e.apply(this,arguments))}}function j(e,a){return e===a?0===e&&1/e!=1/a:e==e||a==a}var R="data-server-rendered",H=["component","directive","filter"],G=["beforeCreate","created","beforeMount","mounted","beforeUpdate","updated","beforeDestroy","destroyed","activated","deactivated","errorCaptured","serverPrefetch","renderTracked","renderTriggered"],I={optionMergeStrategies:Object.create(null),silent:!1,productionTip:!1,devtools:!1,performance:!1,errorHandler:null,warnHandler:null,ignoredElements:[],keyCodes:Object.create(null),isReservedTag:D,isReservedAttr:D,isUnknownElement:D,getTagNamespace:$,parsePlatformTagName:M,mustUseProp:D,async:!0,_lifecycleHooks:G},z=/a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;function W(e){var a=(e+"").charCodeAt(0);return 36===a||95===a}function Y(e,a,t,n){Object.defineProperty(e,a,{value:t,enumerable:!!n,writable:!0,configurable:!0})}var J=new RegExp("[^".concat(z.source,".$_\\d]"));var U="__proto__"in{},K="undefined"!=typeof window,V=K&&window.navigator.userAgent.toLowerCase(),q=V&&/msie|trident/.test(V),Z=V&&V.indexOf("msie 9.0")>0,X=V&&V.indexOf("edge/")>0;V&&V.indexOf("android");var Q=V&&/iphone|ipad|ipod|ios/.test(V);V&&/chrome\/\d+/.test(V),V&&/phantomjs/.test(V);var ee,ae=V&&V.match(/firefox\/(\d+)/),te={}.watch,ne=!1;if(K)try{var re={};Object.defineProperty(re,"passive",{get:function(){ne=!0}}),window.addEventListener("test-passive",null,re)}catch(e){}var ie=function(){return void 0===ee&&(ee=!K&&void 0!==t.g&&(t.g.process&&"server"===t.g.process.env.VUE_ENV)),ee},oe=K&&window.__VUE_DEVTOOLS_GLOBAL_HOOK__;function se(e){return"function"==typeof e&&/native code/.test(e.toString())}var le,ue="undefined"!=typeof Symbol&&se(Symbol)&&"undefined"!=typeof Reflect&&se(Reflect.ownKeys);le="undefined"!=typeof Set&&se(Set)?Set:function(){function e(){this.set=Object.create(null)}return e.prototype.has=function(e){return!0===this.set[e]},e.prototype.add=function(e){this.set[e]=!0},e.prototype.clear=function(){this.set=Object.create(null)},e}();var ce=null;function de(e){void 0===e&&(e=null),e||ce&&ce._scope.off(),ce=e,e&&e._scope.on()}var pe=function(){function e(e,a,t,n,r,i,o,s){this.tag=e,this.data=a,this.children=t,this.text=n,this.elm=r,this.ns=void 0,this.context=i,this.fnContext=void 0,this.fnOptions=void 0,this.fnScopeId=void 0,this.key=a&&a.key,this.componentOptions=o,this.componentInstance=void 0,this.parent=void 0,this.raw=!1,this.isStatic=!1,this.isRootInsert=!0,this.isComment=!1,this.isCloned=!1,this.isOnce=!1,this.asyncFactory=s,this.asyncMeta=void 0,this.isAsyncPlaceholder=!1}return Object.defineProperty(e.prototype,"child",{get:function(){return this.componentInstance},enumerable:!1,configurable:!0}),e}(),fe=function(e){void 0===e&&(e="");var a=new pe;return a.text=e,a.isComment=!0,a};function he(e){return new pe(void 0,void 0,void 0,String(e))}function me(e){var a=new pe(e.tag,e.data,e.children&&e.children.slice(),e.text,e.elm,e.context,e.componentOptions,e.asyncFactory);return a.ns=e.ns,a.isStatic=e.isStatic,a.key=e.key,a.isComment=e.isComment,a.fnContext=e.fnContext,a.fnOptions=e.fnOptions,a.fnScopeId=e.fnScopeId,a.asyncMeta=e.asyncMeta,a.isCloned=!0,a}var ve=0,ge=function(){function e(){this.id=ve++,this.subs=[]}return e.prototype.addSub=function(e){this.subs.push(e)},e.prototype.removeSub=function(e){b(this.subs,e)},e.prototype.depend=function(a){e.target&&e.target.addDep(this)},e.prototype.notify=function(e){var a=this.subs.slice();for(var t=0,n=a.length;t<n;t++){a[t].update()}},e}();ge.target=null;var ye=[];function be(e){ye.push(e),ge.target=e}function we(){ye.pop(),ge.target=ye[ye.length-1]}var Ce=Array.prototype,Se=Object.create(Ce);["push","pop","shift","unshift","splice","sort","reverse"].forEach((function(e){var a=Ce[e];Y(Se,e,(function(){for(var t=[],n=0;n<arguments.length;n++)t[n]=arguments[n];var r,i=a.apply(this,t),o=this.__ob__;switch(e){case"push":case"unshift":r=t;break;case"splice":r=t.slice(2)}return r&&o.observeArray(r),o.dep.notify(),i}))}));var ke=Object.getOwnPropertyNames(Se),_e={},Pe=!0;function Ae(e){Pe=e}var Be={notify:$,depend:$,addSub:$,removeSub:$},xe=function(){function e(e,t,n){if(void 0===t&&(t=!1),void 0===n&&(n=!1),this.value=e,this.shallow=t,this.mock=n,this.dep=n?Be:new ge,this.vmCount=0,Y(e,"__ob__",this),a(e)){if(!n)if(U)e.__proto__=Se;else for(var r=0,i=ke.length;r<i;r++){Y(e,s=ke[r],Se[s])}t||this.observeArray(e)}else{var o=Object.keys(e);for(r=0;r<o.length;r++){var s;Oe(e,s=o[r],_e,void 0,t,n)}}}return e.prototype.observeArray=function(e){for(var a=0,t=e.length;a<t;a++)Te(e[a],!1,this.mock)},e}();function Te(e,t,n){var r;if(!(!l(e)||Ne(e)||e instanceof pe))return C(e,"__ob__")&&e.__ob__ instanceof xe?r=e.__ob__:!Pe||!n&&ie()||!a(e)&&!c(e)||!Object.isExtensible(e)||e.__v_skip||(r=new xe(e,t,n)),r}function Oe(e,t,n,r,i,o){var s=new ge,l=Object.getOwnPropertyDescriptor(e,t);if(!l||!1!==l.configurable){var u=l&&l.get,c=l&&l.set;u&&!c||n!==_e&&2!==arguments.length||(n=e[t]);var d=!i&&Te(n,!1,o);return Object.defineProperty(e,t,{enumerable:!0,configurable:!0,get:function(){var t=u?u.call(e):n;return ge.target&&(s.depend(),d&&(d.dep.depend(),a(t)&&De(t))),Ne(t)&&!i?t.value:t},set:function(a){var t=u?u.call(e):n;if(j(t,a)){if(c)c.call(e,a);else{if(u)return;if(!i&&Ne(t)&&!Ne(a))return void(t.value=a);n=a}d=!i&&Te(a,!1,o),s.notify()}}}),s}}function Le(e,t,n){if(!Fe(e)){var r=e.__ob__;return a(e)&&p(t)?(e.length=Math.max(e.length,t),e.splice(t,1,n),r&&!r.shallow&&r.mock&&Te(n,!1,!0),n):t in e&&!(t in Object.prototype)?(e[t]=n,n):e._isVue||r&&r.vmCount?n:r?(Oe(r.value,t,n,void 0,r.shallow,r.mock),r.dep.notify(),n):(e[t]=n,n)}}function $e(e,t){if(a(e)&&p(t))e.splice(t,1);else{var n=e.__ob__;e._isVue||n&&n.vmCount||Fe(e)||C(e,t)&&(delete e[t],n&&n.dep.notify())}}function De(e){for(var t=void 0,n=0,r=e.length;n<r;n++)(t=e[n])&&t.__ob__&&t.__ob__.dep.depend(),a(t)&&De(t)}function Me(e){return Ee(e,!0),Y(e,"__v_isShallow",!0),e}function Ee(e,a){if(!Fe(e)){Te(e,a,ie());0}}function Fe(e){return!(!e||!e.__v_isReadonly)}function Ne(e){return!(!e||!0!==e.__v_isRef)}function je(e,a,t){Object.defineProperty(e,t,{enumerable:!0,configurable:!0,get:function(){var e=a[t];if(Ne(e))return e.value;var n=e&&e.__ob__;return n&&n.dep.depend(),e},set:function(e){var n=a[t];Ne(n)&&!Ne(e)?n.value=e:a[t]=e}})}var Re=S((function(e){var a="&"===e.charAt(0),t="~"===(e=a?e.slice(1):e).charAt(0),n="!"===(e=t?e.slice(1):e).charAt(0);return{name:e=n?e.slice(1):e,once:t,capture:n,passive:a}}));function He(e,t){function n(){var e=n.fns;if(!a(e))return Za(e,null,arguments,t,"v-on handler");for(var r=e.slice(),i=0;i<r.length;i++)Za(r[i],null,arguments,t,"v-on handler")}return n.fns=e,n}function Ge(e,a,t,r,o,s){var l,u,c,d;for(l in e)u=e[l],c=a[l],d=Re(l),n(u)||(n(c)?(n(u.fns)&&(u=e[l]=He(u,s)),i(d.once)&&(u=e[l]=o(d.name,u,d.capture)),t(d.name,u,d.capture,d.passive,d.params)):u!==c&&(c.fns=u,e[l]=c));for(l in a)n(e[l])&&r((d=Re(l)).name,a[l],d.capture)}function Ie(e,a,t){var o;e instanceof pe&&(e=e.data.hook||(e.data.hook={}));var s=e[a];function l(){t.apply(this,arguments),b(o.fns,l)}n(s)?o=He([l]):r(s.fns)&&i(s.merged)?(o=s).fns.push(l):o=He([s,l]),o.merged=!0,e[a]=o}function ze(e,a,t,n,i){if(r(a)){if(C(a,t))return e[t]=a[t],i||delete a[t],!0;if(C(a,n))return e[t]=a[n],i||delete a[n],!0}return!1}function We(e){return o(e)?[he(e)]:a(e)?Je(e):void 0}function Ye(e){return r(e)&&r(e.text)&&!1===e.isComment}function Je(e,t){var s,l,u,c,d=[];for(s=0;s<e.length;s++)n(l=e[s])||"boolean"==typeof l||(c=d[u=d.length-1],a(l)?l.length>0&&(Ye((l=Je(l,"".concat(t||"","_").concat(s)))[0])&&Ye(c)&&(d[u]=he(c.text+l[0].text),l.shift()),d.push.apply(d,l)):o(l)?Ye(c)?d[u]=he(c.text+l):""!==l&&d.push(he(l)):Ye(l)&&Ye(c)?d[u]=he(c.text+l.text):(i(e._isVList)&&r(l.tag)&&n(l.key)&&r(t)&&(l.key="__vlist".concat(t,"_").concat(s,"__")),d.push(l)));return d}function Ue(e,t,n,u,c,d){return(a(n)||o(n))&&(c=u,u=n,n=void 0),i(d)&&(c=2),function(e,t,n,i,o){if(r(n)&&r(n.__ob__))return fe();r(n)&&r(n.is)&&(t=n.is);if(!t)return fe();0;a(i)&&s(i[0])&&((n=n||{}).scopedSlots={default:i[0]},i.length=0);2===o?i=We(i):1===o&&(i=function(e){for(var t=0;t<e.length;t++)if(a(e[t]))return Array.prototype.concat.apply([],e);return e}(i));var u,c;if("string"==typeof t){var d=void 0;c=e.$vnode&&e.$vnode.ns||I.getTagNamespace(t),u=I.isReservedTag(t)?new pe(I.parsePlatformTagName(t),n,i,void 0,void 0,e):n&&n.pre||!r(d=zt(e.$options,"components",t))?new pe(t,n,i,void 0,void 0,e):Dt(d,n,e,i,t)}else u=Dt(t,n,e,i);return a(u)?u:r(u)?(r(c)&&Ke(u,c),r(n)&&function(e){l(e.style)&&pt(e.style);l(e.class)&&pt(e.class)}(n),u):fe()}(e,t,n,u,c)}function Ke(e,a,t){if(e.ns=a,"foreignObject"===e.tag&&(a=void 0,t=!0),r(e.children))for(var o=0,s=e.children.length;o<s;o++){var l=e.children[o];r(l.tag)&&(n(l.ns)||i(t)&&"svg"!==l.tag)&&Ke(l,a,t)}}function Ve(e,t){var n,i,o,s,u=null;if(a(e)||"string"==typeof e)for(u=new Array(e.length),n=0,i=e.length;n<i;n++)u[n]=t(e[n],n);else if("number"==typeof e)for(u=new Array(e),n=0;n<e;n++)u[n]=t(n+1,n);else if(l(e))if(ue&&e[Symbol.iterator]){u=[];for(var c=e[Symbol.iterator](),d=c.next();!d.done;)u.push(t(d.value,u.length)),d=c.next()}else for(o=Object.keys(e),u=new Array(o.length),n=0,i=o.length;n<i;n++)s=o[n],u[n]=t(e[s],s,n);return r(u)||(u=[]),u._isVList=!0,u}function qe(e,a,t,n){var r,i=this.$scopedSlots[e];i?(t=t||{},n&&(t=O(O({},n),t)),r=i(t)||(s(a)?a():a)):r=this.$slots[e]||(s(a)?a():a);var o=t&&t.slot;return o?this.$createElement("template",{slot:o},r):r}function Ze(e){return zt(this.$options,"filters",e,!0)||M}function Xe(e,t){return a(e)?-1===e.indexOf(t):e!==t}function Qe(e,a,t,n,r){var i=I.keyCodes[a]||t;return r&&n&&!I.keyCodes[a]?Xe(r,n):i?Xe(i,e):n?B(n)!==a:void 0===e}function ea(e,t,n,r,i){if(n)if(l(n)){a(n)&&(n=L(n));var o=void 0,s=function(a){if("class"===a||"style"===a||y(a))o=e;else{var s=e.attrs&&e.attrs.type;o=r||I.mustUseProp(t,s,a)?e.domProps||(e.domProps={}):e.attrs||(e.attrs={})}var l=_(a),u=B(a);l in o||u in o||(o[a]=n[a],i&&((e.on||(e.on={}))["update:".concat(a)]=function(e){n[a]=e}))};for(var u in n)s(u)}else;return e}function aa(e,a){var t=this._staticTrees||(this._staticTrees=[]),n=t[e];return n&&!a||na(n=t[e]=this.$options.staticRenderFns[e].call(this._renderProxy,this._c,this),"__static__".concat(e),!1),n}function ta(e,a,t){return na(e,"__once__".concat(a).concat(t?"_".concat(t):""),!0),e}function na(e,t,n){if(a(e))for(var r=0;r<e.length;r++)e[r]&&"string"!=typeof e[r]&&ra(e[r],"".concat(t,"_").concat(r),n);else ra(e,t,n)}function ra(e,a,t){e.isStatic=!0,e.key=a,e.isOnce=t}function ia(e,a){if(a)if(c(a)){var t=e.on=e.on?O({},e.on):{};for(var n in a){var r=t[n],i=a[n];t[n]=r?[].concat(r,i):i}}else;return e}function oa(e,t,n,r){t=t||{$stable:!n};for(var i=0;i<e.length;i++){var o=e[i];a(o)?oa(o,t,n):o&&(o.proxy&&(o.fn.proxy=!0),t[o.key]=o.fn)}return r&&(t.$key=r),t}function sa(e,a){for(var t=0;t<a.length;t+=2){var n=a[t];"string"==typeof n&&n&&(e[a[t]]=a[t+1])}return e}function la(e,a){return"string"==typeof e?a+e:e}function ua(e){e._o=ta,e._n=m,e._s=h,e._l=Ve,e._t=qe,e._q=E,e._i=F,e._m=aa,e._f=Ze,e._k=Qe,e._b=ea,e._v=he,e._e=fe,e._u=oa,e._g=ia,e._d=sa,e._p=la}function ca(e,a){if(!e||!e.length)return{};for(var t={},n=0,r=e.length;n<r;n++){var i=e[n],o=i.data;if(o&&o.attrs&&o.attrs.slot&&delete o.attrs.slot,i.context!==a&&i.fnContext!==a||!o||null==o.slot)(t.default||(t.default=[])).push(i);else{var s=o.slot,l=t[s]||(t[s]=[]);"template"===i.tag?l.push.apply(l,i.children||[]):l.push(i)}}for(var u in t)t[u].every(da)&&delete t[u];return t}function da(e){return e.isComment&&!e.asyncFactory||" "===e.text}function pa(e){return e.isComment&&e.asyncFactory}function fa(a,t,n,r){var i,o=Object.keys(n).length>0,s=t?!!t.$stable:!o,l=t&&t.$key;if(t){if(t._normalized)return t._normalized;if(s&&r&&r!==e&&l===r.$key&&!o&&!r.$hasNormal)return r;for(var u in i={},t)t[u]&&"$"!==u[0]&&(i[u]=ha(a,n,u,t[u]))}else i={};for(var c in n)c in i||(i[c]=ma(n,c));return t&&Object.isExtensible(t)&&(t._normalized=i),Y(i,"$stable",s),Y(i,"$key",l),Y(i,"$hasNormal",o),i}function ha(e,t,n,r){var i=function(){var t=ce;de(e);var n=arguments.length?r.apply(null,arguments):r({}),i=(n=n&&"object"==typeof n&&!a(n)?[n]:We(n))&&n[0];return de(t),n&&(!i||1===n.length&&i.isComment&&!pa(i))?void 0:n};return r.proxy&&Object.defineProperty(t,n,{get:i,enumerable:!0,configurable:!0}),i}function ma(e,a){return function(){return e[a]}}function va(a){return{get attrs(){if(!a._attrsProxy){var t=a._attrsProxy={};Y(t,"_v_attr_proxy",!0),ga(t,a.$attrs,e,a,"$attrs")}return a._attrsProxy},get listeners(){a._listenersProxy||ga(a._listenersProxy={},a.$listeners,e,a,"$listeners");return a._listenersProxy},get slots(){return function(e){e._slotsProxy||ba(e._slotsProxy={},e.$scopedSlots);return e._slotsProxy}(a)},emit:x(a.$emit,a),expose:function(e){e&&Object.keys(e).forEach((function(t){return je(a,e,t)}))}}}function ga(e,a,t,n,r){var i=!1;for(var o in a)o in e?a[o]!==t[o]&&(i=!0):(i=!0,ya(e,o,n,r));for(var o in e)o in a||(i=!0,delete e[o]);return i}function ya(e,a,t,n){Object.defineProperty(e,a,{enumerable:!0,configurable:!0,get:function(){return t[n][a]}})}function ba(e,a){for(var t in a)e[t]=a[t];for(var t in e)t in a||delete e[t]}var wa,Ca=null;function Sa(e,a){return(e.__esModule||ue&&"Module"===e[Symbol.toStringTag])&&(e=e.default),l(e)?a.extend(e):e}function ka(e){if(a(e))for(var t=0;t<e.length;t++){var n=e[t];if(r(n)&&(r(n.componentOptions)||pa(n)))return n}}function _a(e,a){wa.$on(e,a)}function Pa(e,a){wa.$off(e,a)}function Aa(e,a){var t=wa;return function n(){var r=a.apply(null,arguments);null!==r&&t.$off(e,n)}}function Ba(e,a,t){wa=e,Ge(a,t||{},_a,Pa,Aa,e),wa=void 0}var xa=null;function Ta(e){var a=xa;return xa=e,function(){xa=a}}function Oa(e){for(;e&&(e=e.$parent);)if(e._inactive)return!0;return!1}function La(e,a){if(a){if(e._directInactive=!1,Oa(e))return}else if(e._directInactive)return;if(e._inactive||null===e._inactive){e._inactive=!1;for(var t=0;t<e.$children.length;t++)La(e.$children[t]);Da(e,"activated")}}function $a(e,a){if(!(a&&(e._directInactive=!0,Oa(e))||e._inactive)){e._inactive=!0;for(var t=0;t<e.$children.length;t++)$a(e.$children[t]);Da(e,"deactivated")}}function Da(e,a,t,n){void 0===n&&(n=!0),be();var r=ce;n&&de(e);var i=e.$options[a],o="".concat(a," hook");if(i)for(var s=0,l=i.length;s<l;s++)Za(i[s],e,t||null,e,o);e._hasHookEvent&&e.$emit("hook:"+a),n&&de(r),we()}var Ma=[],Ea=[],Fa={},Na=!1,ja=!1,Ra=0;var Ha=0,Ga=Date.now;if(K&&!q){var Ia=window.performance;Ia&&"function"==typeof Ia.now&&Ga()>document.createEvent("Event").timeStamp&&(Ga=function(){return Ia.now()})}var za=function(e,a){if(e.post){if(!a.post)return 1}else if(a.post)return-1;return e.id-a.id};function Wa(){var e,a;for(Ha=Ga(),ja=!0,Ma.sort(za),Ra=0;Ra<Ma.length;Ra++)(e=Ma[Ra]).before&&e.before(),a=e.id,Fa[a]=null,e.run();var t=Ea.slice(),n=Ma.slice();Ra=Ma.length=Ea.length=0,Fa={},Na=ja=!1,function(e){for(var a=0;a<e.length;a++)e[a]._inactive=!0,La(e[a],!0)}(t),function(e){var a=e.length;for(;a--;){var t=e[a],n=t.vm;n&&n._watcher===t&&n._isMounted&&!n._isDestroyed&&Da(n,"updated")}}(n),oe&&I.devtools&&oe.emit("flush")}function Ya(e){var a=e.id;if(null==Fa[a]&&(e!==ge.target||!e.noRecurse)){if(Fa[a]=!0,ja){for(var t=Ma.length-1;t>Ra&&Ma[t].id>e.id;)t--;Ma.splice(t+1,0,e)}else Ma.push(e);Na||(Na=!0,ut(Wa))}}var Ja="watcher";"".concat(Ja," callback"),"".concat(Ja," getter"),"".concat(Ja," cleanup");var Ua;var Ka=function(){function e(e){void 0===e&&(e=!1),this.active=!0,this.effects=[],this.cleanups=[],!e&&Ua&&(this.parent=Ua,this.index=(Ua.scopes||(Ua.scopes=[])).push(this)-1)}return e.prototype.run=function(e){if(this.active){var a=Ua;try{return Ua=this,e()}finally{Ua=a}}else 0},e.prototype.on=function(){Ua=this},e.prototype.off=function(){Ua=this.parent},e.prototype.stop=function(e){if(this.active){var a=void 0,t=void 0;for(a=0,t=this.effects.length;a<t;a++)this.effects[a].teardown();for(a=0,t=this.cleanups.length;a<t;a++)this.cleanups[a]();if(this.scopes)for(a=0,t=this.scopes.length;a<t;a++)this.scopes[a].stop(!0);if(this.parent&&!e){var n=this.parent.scopes.pop();n&&n!==this&&(this.parent.scopes[this.index]=n,n.index=this.index)}this.active=!1}},e}();function Va(e){var a=e._provided,t=e.$parent&&e.$parent._provided;return t===a?e._provided=Object.create(t):a}function qa(e,a,t){be();try{if(a)for(var n=a;n=n.$parent;){var r=n.$options.errorCaptured;if(r)for(var i=0;i<r.length;i++)try{if(!1===r[i].call(n,e,a,t))return}catch(e){Xa(e,n,"errorCaptured hook")}}Xa(e,a,t)}finally{we()}}function Za(e,a,t,n,r){var i;try{(i=t?e.apply(a,t):e.call(a))&&!i._isVue&&f(i)&&!i._handled&&(i.catch((function(e){return qa(e,n,r+" (Promise/async)")})),i._handled=!0)}catch(e){qa(e,n,r)}return i}function Xa(e,a,t){if(I.errorHandler)try{return I.errorHandler.call(null,e,a,t)}catch(a){a!==e&&Qa(a,null,"config.errorHandler")}Qa(e,a,t)}function Qa(e,a,t){if(!K||"undefined"==typeof console)throw e;console.error(e)}var et,at=!1,tt=[],nt=!1;function rt(){nt=!1;var e=tt.slice(0);tt.length=0;for(var a=0;a<e.length;a++)e[a]()}if("undefined"!=typeof Promise&&se(Promise)){var it=Promise.resolve();et=function(){it.then(rt),Q&&setTimeout($)},at=!0}else if(q||"undefined"==typeof MutationObserver||!se(MutationObserver)&&"[object MutationObserverConstructor]"!==MutationObserver.toString())et="undefined"!=typeof setImmediate&&se(setImmediate)?function(){setImmediate(rt)}:function(){setTimeout(rt,0)};else{var ot=1,st=new MutationObserver(rt),lt=document.createTextNode(String(ot));st.observe(lt,{characterData:!0}),et=function(){ot=(ot+1)%2,lt.data=String(ot)},at=!0}function ut(e,a){var t;if(tt.push((function(){if(e)try{e.call(a)}catch(e){qa(e,a,"nextTick")}else t&&t(a)})),nt||(nt=!0,et()),!e&&"undefined"!=typeof Promise)return new Promise((function(e){t=e}))}function ct(e){return function(a,t){if(void 0===t&&(t=ce),t)return function(e,a,t){var n=e.$options;n[a]=Rt(n[a],t)}(t,e,a)}}ct("beforeMount"),ct("mounted"),ct("beforeUpdate"),ct("updated"),ct("beforeDestroy"),ct("destroyed"),ct("errorCaptured"),ct("activated"),ct("deactivated"),ct("serverPrefetch"),ct("renderTracked"),ct("renderTriggered");var dt=new le;function pt(e){return ft(e,dt),dt.clear(),e}function ft(e,t){var n,r,i=a(e);if(!(!i&&!l(e)||Object.isFrozen(e)||e instanceof pe)){if(e.__ob__){var o=e.__ob__.dep.id;if(t.has(o))return;t.add(o)}if(i)for(n=e.length;n--;)ft(e[n],t);else if(Ne(e))ft(e.value,t);else for(n=(r=Object.keys(e)).length;n--;)ft(e[r[n]],t)}}var ht=0,mt=function(){function e(e,a,t,n,r){var i,o;i=this,void 0===(o=Ua||(e?e._scope:void 0))&&(o=Ua),o&&o.active&&o.effects.push(i),(this.vm=e)&&r&&(e._watcher=this),n?(this.deep=!!n.deep,this.user=!!n.user,this.lazy=!!n.lazy,this.sync=!!n.sync,this.before=n.before):this.deep=this.user=this.lazy=this.sync=!1,this.cb=t,this.id=++ht,this.active=!0,this.post=!1,this.dirty=this.lazy,this.deps=[],this.newDeps=[],this.depIds=new le,this.newDepIds=new le,this.expression="",s(a)?this.getter=a:(this.getter=function(e){if(!J.test(e)){var a=e.split(".");return function(e){for(var t=0;t<a.length;t++){if(!e)return;e=e[a[t]]}return e}}}(a),this.getter||(this.getter=$)),this.value=this.lazy?void 0:this.get()}return e.prototype.get=function(){var e;be(this);var a=this.vm;try{e=this.getter.call(a,a)}catch(e){if(!this.user)throw e;qa(e,a,'getter for watcher "'.concat(this.expression,'"'))}finally{this.deep&&pt(e),we(),this.cleanupDeps()}return e},e.prototype.addDep=function(e){var a=e.id;this.newDepIds.has(a)||(this.newDepIds.add(a),this.newDeps.push(e),this.depIds.has(a)||e.addSub(this))},e.prototype.cleanupDeps=function(){for(var e=this.deps.length;e--;){var a=this.deps[e];this.newDepIds.has(a.id)||a.removeSub(this)}var t=this.depIds;this.depIds=this.newDepIds,this.newDepIds=t,this.newDepIds.clear(),t=this.deps,this.deps=this.newDeps,this.newDeps=t,this.newDeps.length=0},e.prototype.update=function(){this.lazy?this.dirty=!0:this.sync?this.run():Ya(this)},e.prototype.run=function(){if(this.active){var e=this.get();if(e!==this.value||l(e)||this.deep){var a=this.value;if(this.value=e,this.user){var t='callback for watcher "'.concat(this.expression,'"');Za(this.cb,this.vm,[e,a],this.vm,t)}else this.cb.call(this.vm,e,a)}}},e.prototype.evaluate=function(){this.value=this.get(),this.dirty=!1},e.prototype.depend=function(){for(var e=this.deps.length;e--;)this.deps[e].depend()},e.prototype.teardown=function(){if(this.vm&&!this.vm._isBeingDestroyed&&b(this.vm._scope.effects,this),this.active){for(var e=this.deps.length;e--;)this.deps[e].removeSub(this);this.active=!1,this.onStop&&this.onStop()}},e}(),vt={enumerable:!0,configurable:!0,get:$,set:$};function gt(e,a,t){vt.get=function(){return this[a][t]},vt.set=function(e){this[a][t]=e},Object.defineProperty(e,t,vt)}function yt(e){var t=e.$options;if(t.props&&function(e,a){var t=e.$options.propsData||{},n=e._props=Me({}),r=e.$options._propKeys=[];e.$parent&&Ae(!1);var i=function(i){r.push(i);var o=Wt(i,a,t,e);Oe(n,i,o),i in e||gt(e,"_props",i)};for(var o in a)i(o);Ae(!0)}(e,t.props),function(e){var a=e.$options,t=a.setup;if(t){var n=e._setupContext=va(e);de(e),be();var r=Za(t,null,[e._props||Me({}),n],e,"setup");if(we(),de(),s(r))a.render=r;else if(l(r))if(e._setupState=r,r.__sfc){var i=e._setupProxy={};for(var o in r)"__sfc"!==o&&je(i,r,o)}else for(var o in r)W(o)||je(e,r,o)}}(e),t.methods&&function(e,a){e.$options.props;for(var t in a)e[t]="function"!=typeof a[t]?$:x(a[t],e)}(e,t.methods),t.data)!function(e){var a=e.$options.data;c(a=e._data=s(a)?function(e,a){be();try{return e.call(a,a)}catch(e){return qa(e,a,"data()"),{}}finally{we()}}(a,e):a||{})||(a={});var t=Object.keys(a),n=e.$options.props,r=(e.$options.methods,t.length);for(;r--;){var i=t[r];0,n&&C(n,i)||W(i)||gt(e,"_data",i)}var o=Te(a);o&&o.vmCount++}(e);else{var n=Te(e._data={});n&&n.vmCount++}t.computed&&function(e,a){var t=e._computedWatchers=Object.create(null),n=ie();for(var r in a){var i=a[r],o=s(i)?i:i.get;0,n||(t[r]=new mt(e,o||$,$,bt)),r in e||wt(e,r,i)}}(e,t.computed),t.watch&&t.watch!==te&&function(e,t){for(var n in t){var r=t[n];if(a(r))for(var i=0;i<r.length;i++)kt(e,n,r[i]);else kt(e,n,r)}}(e,t.watch)}var bt={lazy:!0};function wt(e,a,t){var n=!ie();s(t)?(vt.get=n?Ct(a):St(t),vt.set=$):(vt.get=t.get?n&&!1!==t.cache?Ct(a):St(t.get):$,vt.set=t.set||$),Object.defineProperty(e,a,vt)}function Ct(e){return function(){var a=this._computedWatchers&&this._computedWatchers[e];if(a)return a.dirty&&a.evaluate(),ge.target&&a.depend(),a.value}}function St(e){return function(){return e.call(this,this)}}function kt(e,a,t,n){return c(t)&&(n=t,t=t.handler),"string"==typeof t&&(t=e[t]),e.$watch(a,t,n)}function _t(e,a){if(e){for(var t=Object.create(null),n=ue?Reflect.ownKeys(e):Object.keys(e),r=0;r<n.length;r++){var i=n[r];if("__ob__"!==i){var o=e[i].from;if(o in a._provided)t[i]=a._provided[o];else if("default"in e[i]){var l=e[i].default;t[i]=s(l)?l.call(a):l}else 0}}return t}}var Pt=0;function At(e){var a=e.options;if(e.super){var t=At(e.super);if(t!==e.superOptions){e.superOptions=t;var n=function(e){var a,t=e.options,n=e.sealedOptions;for(var r in t)t[r]!==n[r]&&(a||(a={}),a[r]=t[r]);return a}(e);n&&O(e.extendOptions,n),(a=e.options=It(t,e.extendOptions)).name&&(a.components[a.name]=e)}}return a}function Bt(t,n,r,o,s){var l,u=this,c=s.options;C(o,"_uid")?(l=Object.create(o))._original=o:(l=o,o=o._original);var d=i(c._compiled),p=!d;this.data=t,this.props=n,this.children=r,this.parent=o,this.listeners=t.on||e,this.injections=_t(c.inject,o),this.slots=function(){return u.$slots||fa(o,t.scopedSlots,u.$slots=ca(r,o)),u.$slots},Object.defineProperty(this,"scopedSlots",{enumerable:!0,get:function(){return fa(o,t.scopedSlots,this.slots())}}),d&&(this.$options=c,this.$slots=this.slots(),this.$scopedSlots=fa(o,t.scopedSlots,this.$slots)),c._scopeId?this._c=function(e,t,n,r){var i=Ue(l,e,t,n,r,p);return i&&!a(i)&&(i.fnScopeId=c._scopeId,i.fnContext=o),i}:this._c=function(e,a,t,n){return Ue(l,e,a,t,n,p)}}function xt(e,a,t,n,r){var i=me(e);return i.fnContext=t,i.fnOptions=n,a.slot&&((i.data||(i.data={})).slot=a.slot),i}function Tt(e,a){for(var t in a)e[_(t)]=a[t]}function Ot(e){return e.name||e.__name||e._componentTag}ua(Bt.prototype);var Lt={init:function(e,a){if(e.componentInstance&&!e.componentInstance._isDestroyed&&e.data.keepAlive){var t=e;Lt.prepatch(t,t)}else{var n=e.componentInstance=function(e,a){var t={_isComponent:!0,_parentVnode:e,parent:a},n=e.data.inlineTemplate;r(n)&&(t.render=n.render,t.staticRenderFns=n.staticRenderFns);return new e.componentOptions.Ctor(t)}(e,xa);n.$mount(a?e.elm:void 0,a)}},prepatch:function(a,t){var n=t.componentOptions;!function(a,t,n,r,i){var o=r.data.scopedSlots,s=a.$scopedSlots,l=!!(o&&!o.$stable||s!==e&&!s.$stable||o&&a.$scopedSlots.$key!==o.$key||!o&&a.$scopedSlots.$key),u=!!(i||a.$options._renderChildren||l),c=a.$vnode;a.$options._parentVnode=r,a.$vnode=r,a._vnode&&(a._vnode.parent=r),a.$options._renderChildren=i;var d=r.data.attrs||e;a._attrsProxy&&ga(a._attrsProxy,d,c.data&&c.data.attrs||e,a,"$attrs")&&(u=!0),a.$attrs=d,n=n||e;var p=a.$options._parentListeners;if(a._listenersProxy&&ga(a._listenersProxy,n,p||e,a,"$listeners"),a.$listeners=a.$options._parentListeners=n,Ba(a,n,p),t&&a.$options.props){Ae(!1);for(var f=a._props,h=a.$options._propKeys||[],m=0;m<h.length;m++){var v=h[m],g=a.$options.props;f[v]=Wt(v,g,t,a)}Ae(!0),a.$options.propsData=t}u&&(a.$slots=ca(i,r.context),a.$forceUpdate())}(t.componentInstance=a.componentInstance,n.propsData,n.listeners,t,n.children)},insert:function(e){var a,t=e.context,n=e.componentInstance;n._isMounted||(n._isMounted=!0,Da(n,"mounted")),e.data.keepAlive&&(t._isMounted?((a=n)._inactive=!1,Ea.push(a)):La(n,!0))},destroy:function(e){var a=e.componentInstance;a._isDestroyed||(e.data.keepAlive?$a(a,!0):a.$destroy())}},$t=Object.keys(Lt);function Dt(t,o,s,u,c){if(!n(t)){var d=s.$options._base;if(l(t)&&(t=d.extend(t)),"function"==typeof t){var p;if(n(t.cid)&&(t=function(e,a){if(i(e.error)&&r(e.errorComp))return e.errorComp;if(r(e.resolved))return e.resolved;var t=Ca;if(t&&r(e.owners)&&-1===e.owners.indexOf(t)&&e.owners.push(t),i(e.loading)&&r(e.loadingComp))return e.loadingComp;if(t&&!r(e.owners)){var o=e.owners=[t],s=!0,u=null,c=null;t.$on("hook:destroyed",(function(){return b(o,t)}));var d=function(e){for(var a=0,t=o.length;a<t;a++)o[a].$forceUpdate();e&&(o.length=0,null!==u&&(clearTimeout(u),u=null),null!==c&&(clearTimeout(c),c=null))},p=N((function(t){e.resolved=Sa(t,a),s?o.length=0:d(!0)})),h=N((function(a){r(e.errorComp)&&(e.error=!0,d(!0))})),m=e(p,h);return l(m)&&(f(m)?n(e.resolved)&&m.then(p,h):f(m.component)&&(m.component.then(p,h),r(m.error)&&(e.errorComp=Sa(m.error,a)),r(m.loading)&&(e.loadingComp=Sa(m.loading,a),0===m.delay?e.loading=!0:u=setTimeout((function(){u=null,n(e.resolved)&&n(e.error)&&(e.loading=!0,d(!1))}),m.delay||200)),r(m.timeout)&&(c=setTimeout((function(){c=null,n(e.resolved)&&h(null)}),m.timeout)))),s=!1,e.loading?e.loadingComp:e.resolved}}(p=t,d),void 0===t))return function(e,a,t,n,r){var i=fe();return i.asyncFactory=e,i.asyncMeta={data:a,context:t,children:n,tag:r},i}(p,o,s,u,c);o=o||{},At(t),r(o.model)&&function(e,t){var n=e.model&&e.model.prop||"value",i=e.model&&e.model.event||"input";(t.attrs||(t.attrs={}))[n]=t.model.value;var o=t.on||(t.on={}),s=o[i],l=t.model.callback;r(s)?(a(s)?-1===s.indexOf(l):s!==l)&&(o[i]=[l].concat(s)):o[i]=l}(t.options,o);var h=function(e,a,t){var i=a.options.props;if(!n(i)){var o={},s=e.attrs,l=e.props;if(r(s)||r(l))for(var u in i){var c=B(u);ze(o,l,u,c,!0)||ze(o,s,u,c,!1)}return o}}(o,t);if(i(t.options.functional))return function(t,n,i,o,s){var l=t.options,u={},c=l.props;if(r(c))for(var d in c)u[d]=Wt(d,c,n||e);else r(i.attrs)&&Tt(u,i.attrs),r(i.props)&&Tt(u,i.props);var p=new Bt(i,u,s,o,t),f=l.render.call(null,p._c,p);if(f instanceof pe)return xt(f,i,p.parent,l);if(a(f)){for(var h=We(f)||[],m=new Array(h.length),v=0;v<h.length;v++)m[v]=xt(h[v],i,p.parent,l);return m}}(t,h,o,s,u);var m=o.on;if(o.on=o.nativeOn,i(t.options.abstract)){var v=o.slot;o={},v&&(o.slot=v)}!function(e){for(var a=e.hook||(e.hook={}),t=0;t<$t.length;t++){var n=$t[t],r=a[n],i=Lt[n];r===i||r&&r._merged||(a[n]=r?Mt(i,r):i)}}(o);var g=Ot(t.options)||c;return new pe("vue-component-".concat(t.cid).concat(g?"-".concat(g):""),o,void 0,void 0,void 0,s,{Ctor:t,propsData:h,listeners:m,tag:c,children:u},p)}}}function Mt(e,a){var t=function(t,n){e(t,n),a(t,n)};return t._merged=!0,t}var Et=$,Ft=I.optionMergeStrategies;function Nt(e,a){if(!a)return e;for(var t,n,r,i=ue?Reflect.ownKeys(a):Object.keys(a),o=0;o<i.length;o++)"__ob__"!==(t=i[o])&&(n=e[t],r=a[t],C(e,t)?n!==r&&c(n)&&c(r)&&Nt(n,r):Le(e,t,r));return e}function jt(e,a,t){return t?function(){var n=s(a)?a.call(t,t):a,r=s(e)?e.call(t,t):e;return n?Nt(n,r):r}:a?e?function(){return Nt(s(a)?a.call(this,this):a,s(e)?e.call(this,this):e)}:a:e}function Rt(e,t){var n=t?e?e.concat(t):a(t)?t:[t]:e;return n?function(e){for(var a=[],t=0;t<e.length;t++)-1===a.indexOf(e[t])&&a.push(e[t]);return a}(n):n}function Ht(e,a,t,n){var r=Object.create(e||null);return a?O(r,a):r}Ft.data=function(e,a,t){return t?jt(e,a,t):a&&"function"!=typeof a?e:jt(e,a)},G.forEach((function(e){Ft[e]=Rt})),H.forEach((function(e){Ft[e+"s"]=Ht})),Ft.watch=function(e,t,n,r){if(e===te&&(e=void 0),t===te&&(t=void 0),!t)return Object.create(e||null);if(!e)return t;var i={};for(var o in O(i,e),t){var s=i[o],l=t[o];s&&!a(s)&&(s=[s]),i[o]=s?s.concat(l):a(l)?l:[l]}return i},Ft.props=Ft.methods=Ft.inject=Ft.computed=function(e,a,t,n){if(!e)return a;var r=Object.create(null);return O(r,e),a&&O(r,a),r},Ft.provide=jt;var Gt=function(e,a){return void 0===a?e:a};function It(e,t,n){if(s(t)&&(t=t.options),function(e,t){var n=e.props;if(n){var r,i,o={};if(a(n))for(r=n.length;r--;)"string"==typeof(i=n[r])&&(o[_(i)]={type:null});else if(c(n))for(var s in n)i=n[s],o[_(s)]=c(i)?i:{type:i};e.props=o}}(t),function(e,t){var n=e.inject;if(n){var r=e.inject={};if(a(n))for(var i=0;i<n.length;i++)r[n[i]]={from:n[i]};else if(c(n))for(var o in n){var s=n[o];r[o]=c(s)?O({from:o},s):{from:s}}}}(t),function(e){var a=e.directives;if(a)for(var t in a){var n=a[t];s(n)&&(a[t]={bind:n,update:n})}}(t),!t._base&&(t.extends&&(e=It(e,t.extends,n)),t.mixins))for(var r=0,i=t.mixins.length;r<i;r++)e=It(e,t.mixins[r],n);var o,l={};for(o in e)u(o);for(o in t)C(e,o)||u(o);function u(a){var r=Ft[a]||Gt;l[a]=r(e[a],t[a],n,a)}return l}function zt(e,a,t,n){if("string"==typeof t){var r=e[a];if(C(r,t))return r[t];var i=_(t);if(C(r,i))return r[i];var o=P(i);return C(r,o)?r[o]:r[t]||r[i]||r[o]}}function Wt(e,a,t,n){var r=a[e],i=!C(t,e),o=t[e],l=Kt(Boolean,r.type);if(l>-1)if(i&&!C(r,"default"))o=!1;else if(""===o||o===B(e)){var u=Kt(String,r.type);(u<0||l<u)&&(o=!0)}if(void 0===o){o=function(e,a,t){if(!C(a,"default"))return;var n=a.default;0;if(e&&e.$options.propsData&&void 0===e.$options.propsData[t]&&void 0!==e._props[t])return e._props[t];return s(n)&&"Function"!==Jt(a.type)?n.call(e):n}(n,r,e);var c=Pe;Ae(!0),Te(o),Ae(c)}return o}var Yt=/^\s*function (\w+)/;function Jt(e){var a=e&&e.toString().match(Yt);return a?a[1]:""}function Ut(e,a){return Jt(e)===Jt(a)}function Kt(e,t){if(!a(t))return Ut(t,e)?0:-1;for(var n=0,r=t.length;n<r;n++)if(Ut(t[n],e))return n;return-1}function Vt(e){this._init(e)}function qt(e){e.cid=0;var a=1;e.extend=function(e){e=e||{};var t=this,n=t.cid,r=e._Ctor||(e._Ctor={});if(r[n])return r[n];var i=Ot(e)||Ot(t.options);var o=function(e){this._init(e)};return(o.prototype=Object.create(t.prototype)).constructor=o,o.cid=a++,o.options=It(t.options,e),o.super=t,o.options.props&&function(e){var a=e.options.props;for(var t in a)gt(e.prototype,"_props",t)}(o),o.options.computed&&function(e){var a=e.options.computed;for(var t in a)wt(e.prototype,t,a[t])}(o),o.extend=t.extend,o.mixin=t.mixin,o.use=t.use,H.forEach((function(e){o[e]=t[e]})),i&&(o.options.components[i]=o),o.superOptions=t.options,o.extendOptions=e,o.sealedOptions=O({},o.options),r[n]=o,o}}function Zt(e){return e&&(Ot(e.Ctor.options)||e.tag)}function Xt(e,t){return a(e)?e.indexOf(t)>-1:"string"==typeof e?e.split(",").indexOf(t)>-1:!!d(e)&&e.test(t)}function Qt(e,a){var t=e.cache,n=e.keys,r=e._vnode;for(var i in t){var o=t[i];if(o){var s=o.name;s&&!a(s)&&en(t,i,n,r)}}}function en(e,a,t,n){var r=e[a];!r||n&&r.tag===n.tag||r.componentInstance.$destroy(),e[a]=null,b(t,a)}!function(a){a.prototype._init=function(a){var t=this;t._uid=Pt++,t._isVue=!0,t.__v_skip=!0,t._scope=new Ka(!0),a&&a._isComponent?function(e,a){var t=e.$options=Object.create(e.constructor.options),n=a._parentVnode;t.parent=a.parent,t._parentVnode=n;var r=n.componentOptions;t.propsData=r.propsData,t._parentListeners=r.listeners,t._renderChildren=r.children,t._componentTag=r.tag,a.render&&(t.render=a.render,t.staticRenderFns=a.staticRenderFns)}(t,a):t.$options=It(At(t.constructor),a||{},t),t._renderProxy=t,t._self=t,function(e){var a=e.$options,t=a.parent;if(t&&!a.abstract){for(;t.$options.abstract&&t.$parent;)t=t.$parent;t.$children.push(e)}e.$parent=t,e.$root=t?t.$root:e,e.$children=[],e.$refs={},e._provided=t?t._provided:Object.create(null),e._watcher=null,e._inactive=null,e._directInactive=!1,e._isMounted=!1,e._isDestroyed=!1,e._isBeingDestroyed=!1}(t),function(e){e._events=Object.create(null),e._hasHookEvent=!1;var a=e.$options._parentListeners;a&&Ba(e,a)}(t),function(a){a._vnode=null,a._staticTrees=null;var t=a.$options,n=a.$vnode=t._parentVnode,r=n&&n.context;a.$slots=ca(t._renderChildren,r),a.$scopedSlots=n?fa(a.$parent,n.data.scopedSlots,a.$slots):e,a._c=function(e,t,n,r){return Ue(a,e,t,n,r,!1)},a.$createElement=function(e,t,n,r){return Ue(a,e,t,n,r,!0)};var i=n&&n.data;Oe(a,"$attrs",i&&i.attrs||e,null,!0),Oe(a,"$listeners",t._parentListeners||e,null,!0)}(t),Da(t,"beforeCreate",void 0,!1),function(e){var a=_t(e.$options.inject,e);a&&(Ae(!1),Object.keys(a).forEach((function(t){Oe(e,t,a[t])})),Ae(!0))}(t),yt(t),function(e){var a=e.$options.provide;if(a){var t=s(a)?a.call(e):a;if(!l(t))return;for(var n=Va(e),r=ue?Reflect.ownKeys(t):Object.keys(t),i=0;i<r.length;i++){var o=r[i];Object.defineProperty(n,o,Object.getOwnPropertyDescriptor(t,o))}}}(t),Da(t,"created"),t.$options.el&&t.$mount(t.$options.el)}}(Vt),function(e){var a={get:function(){return this._data}},t={get:function(){return this._props}};Object.defineProperty(e.prototype,"$data",a),Object.defineProperty(e.prototype,"$props",t),e.prototype.$set=Le,e.prototype.$delete=$e,e.prototype.$watch=function(e,a,t){var n=this;if(c(a))return kt(n,e,a,t);(t=t||{}).user=!0;var r=new mt(n,e,a,t);if(t.immediate){var i='callback for immediate watcher "'.concat(r.expression,'"');be(),Za(a,n,[r.value],n,i),we()}return function(){r.teardown()}}}(Vt),function(e){var t=/^hook:/;e.prototype.$on=function(e,n){var r=this;if(a(e))for(var i=0,o=e.length;i<o;i++)r.$on(e[i],n);else(r._events[e]||(r._events[e]=[])).push(n),t.test(e)&&(r._hasHookEvent=!0);return r},e.prototype.$once=function(e,a){var t=this;function n(){t.$off(e,n),a.apply(t,arguments)}return n.fn=a,t.$on(e,n),t},e.prototype.$off=function(e,t){var n=this;if(!arguments.length)return n._events=Object.create(null),n;if(a(e)){for(var r=0,i=e.length;r<i;r++)n.$off(e[r],t);return n}var o,s=n._events[e];if(!s)return n;if(!t)return n._events[e]=null,n;for(var l=s.length;l--;)if((o=s[l])===t||o.fn===t){s.splice(l,1);break}return n},e.prototype.$emit=function(e){var a=this,t=a._events[e];if(t){t=t.length>1?T(t):t;for(var n=T(arguments,1),r='event handler for "'.concat(e,'"'),i=0,o=t.length;i<o;i++)Za(t[i],a,n,a,r)}return a}}(Vt),function(e){e.prototype._update=function(e,a){var t=this,n=t.$el,r=t._vnode,i=Ta(t);t._vnode=e,t.$el=r?t.__patch__(r,e):t.__patch__(t.$el,e,a,!1),i(),n&&(n.__vue__=null),t.$el&&(t.$el.__vue__=t),t.$vnode&&t.$parent&&t.$vnode===t.$parent._vnode&&(t.$parent.$el=t.$el)},e.prototype.$forceUpdate=function(){this._watcher&&this._watcher.update()},e.prototype.$destroy=function(){var e=this;if(!e._isBeingDestroyed){Da(e,"beforeDestroy"),e._isBeingDestroyed=!0;var a=e.$parent;!a||a._isBeingDestroyed||e.$options.abstract||b(a.$children,e),e._scope.stop(),e._data.__ob__&&e._data.__ob__.vmCount--,e._isDestroyed=!0,e.__patch__(e._vnode,null),Da(e,"destroyed"),e.$off(),e.$el&&(e.$el.__vue__=null),e.$vnode&&(e.$vnode.parent=null)}}}(Vt),function(e){ua(e.prototype),e.prototype.$nextTick=function(e){return ut(e,this)},e.prototype._render=function(){var e,t=this,n=t.$options,r=n.render,i=n._parentVnode;i&&t._isMounted&&(t.$scopedSlots=fa(t.$parent,i.data.scopedSlots,t.$slots,t.$scopedSlots),t._slotsProxy&&ba(t._slotsProxy,t.$scopedSlots)),t.$vnode=i;try{de(t),Ca=t,e=r.call(t._renderProxy,t.$createElement)}catch(a){qa(a,t,"render"),e=t._vnode}finally{Ca=null,de()}return a(e)&&1===e.length&&(e=e[0]),e instanceof pe||(e=fe()),e.parent=i,e}}(Vt);var an=[String,RegExp,Array],tn={name:"keep-alive",abstract:!0,props:{include:an,exclude:an,max:[String,Number]},methods:{cacheVNode:function(){var e=this,a=e.cache,t=e.keys,n=e.vnodeToCache,r=e.keyToCache;if(n){var i=n.tag,o=n.componentInstance,s=n.componentOptions;a[r]={name:Zt(s),tag:i,componentInstance:o},t.push(r),this.max&&t.length>parseInt(this.max)&&en(a,t[0],t,this._vnode),this.vnodeToCache=null}}},created:function(){this.cache=Object.create(null),this.keys=[]},destroyed:function(){for(var e in this.cache)en(this.cache,e,this.keys)},mounted:function(){var e=this;this.cacheVNode(),this.$watch("include",(function(a){Qt(e,(function(e){return Xt(a,e)}))})),this.$watch("exclude",(function(a){Qt(e,(function(e){return!Xt(a,e)}))}))},updated:function(){this.cacheVNode()},render:function(){var e=this.$slots.default,a=ka(e),t=a&&a.componentOptions;if(t){var n=Zt(t),r=this.include,i=this.exclude;if(r&&(!n||!Xt(r,n))||i&&n&&Xt(i,n))return a;var o=this.cache,s=this.keys,l=null==a.key?t.Ctor.cid+(t.tag?"::".concat(t.tag):""):a.key;o[l]?(a.componentInstance=o[l].componentInstance,b(s,l),s.push(l)):(this.vnodeToCache=a,this.keyToCache=l),a.data.keepAlive=!0}return a||e&&e[0]}},nn={KeepAlive:tn};!function(e){var a={get:function(){return I}};Object.defineProperty(e,"config",a),e.util={warn:Et,extend:O,mergeOptions:It,defineReactive:Oe},e.set=Le,e.delete=$e,e.nextTick=ut,e.observable=function(e){return Te(e),e},e.options=Object.create(null),H.forEach((function(a){e.options[a+"s"]=Object.create(null)})),e.options._base=e,O(e.options.components,nn),function(e){e.use=function(e){var a=this._installedPlugins||(this._installedPlugins=[]);if(a.indexOf(e)>-1)return this;var t=T(arguments,1);return t.unshift(this),s(e.install)?e.install.apply(e,t):s(e)&&e.apply(null,t),a.push(e),this}}(e),function(e){e.mixin=function(e){return this.options=It(this.options,e),this}}(e),qt(e),function(e){H.forEach((function(a){e[a]=function(e,t){return t?("component"===a&&c(t)&&(t.name=t.name||e,t=this.options._base.extend(t)),"directive"===a&&s(t)&&(t={bind:t,update:t}),this.options[a+"s"][e]=t,t):this.options[a+"s"][e]}}))}(e)}(Vt),Object.defineProperty(Vt.prototype,"$isServer",{get:ie}),Object.defineProperty(Vt.prototype,"$ssrContext",{get:function(){return this.$vnode&&this.$vnode.ssrContext}}),Object.defineProperty(Vt,"FunctionalRenderContext",{value:Bt}),Vt.version="2.7.8";var rn=v("style,class"),on=v("input,textarea,option,select,progress"),sn=function(e,a,t){return"value"===t&&on(e)&&"button"!==a||"selected"===t&&"option"===e||"checked"===t&&"input"===e||"muted"===t&&"video"===e},ln=v("contenteditable,draggable,spellcheck"),un=v("events,caret,typing,plaintext-only"),cn=v("allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,default,defaultchecked,defaultmuted,defaultselected,defer,disabled,enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,required,reversed,scoped,seamless,selected,sortable,truespeed,typemustmatch,visible"),dn="http://www.w3.org/1999/xlink",pn=function(e){return":"===e.charAt(5)&&"xlink"===e.slice(0,5)},fn=function(e){return pn(e)?e.slice(6,e.length):""},hn=function(e){return null==e||!1===e};function mn(e){for(var a=e.data,t=e,n=e;r(n.componentInstance);)(n=n.componentInstance._vnode)&&n.data&&(a=vn(n.data,a));for(;r(t=t.parent);)t&&t.data&&(a=vn(a,t.data));return function(e,a){if(r(e)||r(a))return gn(e,yn(a));return""}(a.staticClass,a.class)}function vn(e,a){return{staticClass:gn(e.staticClass,a.staticClass),class:r(e.class)?[e.class,a.class]:a.class}}function gn(e,a){return e?a?e+" "+a:e:a||""}function yn(e){return Array.isArray(e)?function(e){for(var a,t="",n=0,i=e.length;n<i;n++)r(a=yn(e[n]))&&""!==a&&(t&&(t+=" "),t+=a);return t}(e):l(e)?function(e){var a="";for(var t in e)e[t]&&(a&&(a+=" "),a+=t);return a}(e):"string"==typeof e?e:""}var bn={svg:"http://www.w3.org/2000/svg",math:"http://www.w3.org/1998/Math/MathML"},wn=v("html,body,base,head,link,meta,style,title,address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,menuitem,summary,content,element,shadow,template,blockquote,iframe,tfoot"),Cn=v("svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,foreignobject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view",!0),Sn=function(e){return wn(e)||Cn(e)};function kn(e){return Cn(e)?"svg":"math"===e?"math":void 0}var _n=Object.create(null);var Pn=v("text,number,password,search,email,tel,url");function An(e){if("string"==typeof e){var a=document.querySelector(e);return a||document.createElement("div")}return e}var Bn=Object.freeze({__proto__:null,createElement:function(e,a){var t=document.createElement(e);return"select"!==e||a.data&&a.data.attrs&&void 0!==a.data.attrs.multiple&&t.setAttribute("multiple","multiple"),t},createElementNS:function(e,a){return document.createElementNS(bn[e],a)},createTextNode:function(e){return document.createTextNode(e)},createComment:function(e){return document.createComment(e)},insertBefore:function(e,a,t){e.insertBefore(a,t)},removeChild:function(e,a){e.removeChild(a)},appendChild:function(e,a){e.appendChild(a)},parentNode:function(e){return e.parentNode},nextSibling:function(e){return e.nextSibling},tagName:function(e){return e.tagName},setTextContent:function(e,a){e.textContent=a},setStyleScope:function(e,a){e.setAttribute(a,"")}}),xn={create:function(e,a){Tn(a)},update:function(e,a){e.data.ref!==a.data.ref&&(Tn(e,!0),Tn(a))},destroy:function(e){Tn(e,!0)}};function Tn(e,t){var n=e.data.ref;if(r(n)){var i=e.context,o=e.componentInstance||e.elm,l=t?null:o,u=t?void 0:o;if(s(n))Za(n,i,[l],i,"template ref function");else{var c=e.data.refInFor,d="string"==typeof n||"number"==typeof n,p=Ne(n),f=i.$refs;if(d||p)if(c){var h=d?f[n]:n.value;t?a(h)&&b(h,o):a(h)?h.includes(o)||h.push(o):d?(f[n]=[o],On(i,n,f[n])):n.value=[o]}else if(d){if(t&&f[n]!==o)return;f[n]=u,On(i,n,l)}else if(p){if(t&&n.value!==o)return;n.value=l}else 0}}}function On(e,a,t){var n=e._setupState;n&&C(n,a)&&(Ne(n[a])?n[a].value=t:n[a]=t)}var Ln=new pe("",{},[]),$n=["create","activate","update","remove","destroy"];function Dn(e,a){return e.key===a.key&&e.asyncFactory===a.asyncFactory&&(e.tag===a.tag&&e.isComment===a.isComment&&r(e.data)===r(a.data)&&function(e,a){if("input"!==e.tag)return!0;var t,n=r(t=e.data)&&r(t=t.attrs)&&t.type,i=r(t=a.data)&&r(t=t.attrs)&&t.type;return n===i||Pn(n)&&Pn(i)}(e,a)||i(e.isAsyncPlaceholder)&&n(a.asyncFactory.error))}function Mn(e,a,t){var n,i,o={};for(n=a;n<=t;++n)r(i=e[n].key)&&(o[i]=n);return o}var En={create:Fn,update:Fn,destroy:function(e){Fn(e,Ln)}};function Fn(e,a){(e.data.directives||a.data.directives)&&function(e,a){var t,n,r,i=e===Ln,o=a===Ln,s=jn(e.data.directives,e.context),l=jn(a.data.directives,a.context),u=[],c=[];for(t in l)n=s[t],r=l[t],n?(r.oldValue=n.value,r.oldArg=n.arg,Hn(r,"update",a,e),r.def&&r.def.componentUpdated&&c.push(r)):(Hn(r,"bind",a,e),r.def&&r.def.inserted&&u.push(r));if(u.length){var d=function(){for(var t=0;t<u.length;t++)Hn(u[t],"inserted",a,e)};i?Ie(a,"insert",d):d()}c.length&&Ie(a,"postpatch",(function(){for(var t=0;t<c.length;t++)Hn(c[t],"componentUpdated",a,e)}));if(!i)for(t in s)l[t]||Hn(s[t],"unbind",e,e,o)}(e,a)}var Nn=Object.create(null);function jn(e,a){var t,n,r=Object.create(null);if(!e)return r;for(t=0;t<e.length;t++)(n=e[t]).modifiers||(n.modifiers=Nn),r[Rn(n)]=n,a._setupState&&a._setupState.__sfc&&(n.def=n.def||zt(a,"_setupState","v-"+n.name)),n.def=n.def||zt(a.$options,"directives",n.name);return r}function Rn(e){return e.rawName||"".concat(e.name,".").concat(Object.keys(e.modifiers||{}).join("."))}function Hn(e,a,t,n,r){var i=e.def&&e.def[a];if(i)try{i(t.elm,e,t,n,r)}catch(n){qa(n,t.context,"directive ".concat(e.name," ").concat(a," hook"))}}var Gn=[xn,En];function In(e,a){var t=a.componentOptions;if(!(r(t)&&!1===t.Ctor.options.inheritAttrs||n(e.data.attrs)&&n(a.data.attrs))){var o,s,l=a.elm,u=e.data.attrs||{},c=a.data.attrs||{};for(o in(r(c.__ob__)||i(c._v_attr_proxy))&&(c=a.data.attrs=O({},c)),c)s=c[o],u[o]!==s&&zn(l,o,s,a.data.pre);for(o in(q||X)&&c.value!==u.value&&zn(l,"value",c.value),u)n(c[o])&&(pn(o)?l.removeAttributeNS(dn,fn(o)):ln(o)||l.removeAttribute(o))}}function zn(e,a,t,n){n||e.tagName.indexOf("-")>-1?Wn(e,a,t):cn(a)?hn(t)?e.removeAttribute(a):(t="allowfullscreen"===a&&"EMBED"===e.tagName?"true":a,e.setAttribute(a,t)):ln(a)?e.setAttribute(a,function(e,a){return hn(a)||"false"===a?"false":"contenteditable"===e&&un(a)?a:"true"}(a,t)):pn(a)?hn(t)?e.removeAttributeNS(dn,fn(a)):e.setAttributeNS(dn,a,t):Wn(e,a,t)}function Wn(e,a,t){if(hn(t))e.removeAttribute(a);else{if(q&&!Z&&"TEXTAREA"===e.tagName&&"placeholder"===a&&""!==t&&!e.__ieph){var n=function(a){a.stopImmediatePropagation(),e.removeEventListener("input",n)};e.addEventListener("input",n),e.__ieph=!0}e.setAttribute(a,t)}}var Yn={create:In,update:In};function Jn(e,a){var t=a.elm,i=a.data,o=e.data;if(!(n(i.staticClass)&&n(i.class)&&(n(o)||n(o.staticClass)&&n(o.class)))){var s=mn(a),l=t._transitionClasses;r(l)&&(s=gn(s,yn(l))),s!==t._prevClass&&(t.setAttribute("class",s),t._prevClass=s)}}var Un,Kn,Vn,qn,Zn,Xn,Qn={create:Jn,update:Jn},er=/[\w).+\-_$\]]/;function ar(e){var a,t,n,r,i,o=!1,s=!1,l=!1,u=!1,c=0,d=0,p=0,f=0;for(n=0;n<e.length;n++)if(t=a,a=e.charCodeAt(n),o)39===a&&92!==t&&(o=!1);else if(s)34===a&&92!==t&&(s=!1);else if(l)96===a&&92!==t&&(l=!1);else if(u)47===a&&92!==t&&(u=!1);else if(124!==a||124===e.charCodeAt(n+1)||124===e.charCodeAt(n-1)||c||d||p){switch(a){case 34:s=!0;break;case 39:o=!0;break;case 96:l=!0;break;case 40:p++;break;case 41:p--;break;case 91:d++;break;case 93:d--;break;case 123:c++;break;case 125:c--}if(47===a){for(var h=n-1,m=void 0;h>=0&&" "===(m=e.charAt(h));h--);m&&er.test(m)||(u=!0)}}else void 0===r?(f=n+1,r=e.slice(0,n).trim()):v();function v(){(i||(i=[])).push(e.slice(f,n).trim()),f=n+1}if(void 0===r?r=e.slice(0,n).trim():0!==f&&v(),i)for(n=0;n<i.length;n++)r=tr(r,i[n]);return r}function tr(e,a){var t=a.indexOf("(");if(t<0)return'_f("'.concat(a,'")(').concat(e,")");var n=a.slice(0,t),r=a.slice(t+1);return'_f("'.concat(n,'")(').concat(e).concat(")"!==r?","+r:r)}function nr(e,a){console.error("[Vue compiler]: ".concat(e))}function rr(e,a){return e?e.map((function(e){return e[a]})).filter((function(e){return e})):[]}function ir(e,a,t,n,r){(e.props||(e.props=[])).push(hr({name:a,value:t,dynamic:r},n)),e.plain=!1}function or(e,a,t,n,r){(r?e.dynamicAttrs||(e.dynamicAttrs=[]):e.attrs||(e.attrs=[])).push(hr({name:a,value:t,dynamic:r},n)),e.plain=!1}function sr(e,a,t,n){e.attrsMap[a]=t,e.attrsList.push(hr({name:a,value:t},n))}function lr(e,a,t,n,r,i,o,s){(e.directives||(e.directives=[])).push(hr({name:a,rawName:t,value:n,arg:r,isDynamicArg:i,modifiers:o},s)),e.plain=!1}function ur(e,a,t){return t?"_p(".concat(a,',"').concat(e,'")'):e+a}function cr(a,t,n,r,i,o,s,l){var u;(r=r||e).right?l?t="(".concat(t,")==='click'?'contextmenu':(").concat(t,")"):"click"===t&&(t="contextmenu",delete r.right):r.middle&&(l?t="(".concat(t,")==='click'?'mouseup':(").concat(t,")"):"click"===t&&(t="mouseup")),r.capture&&(delete r.capture,t=ur("!",t,l)),r.once&&(delete r.once,t=ur("~",t,l)),r.passive&&(delete r.passive,t=ur("&",t,l)),r.native?(delete r.native,u=a.nativeEvents||(a.nativeEvents={})):u=a.events||(a.events={});var c=hr({value:n.trim(),dynamic:l},s);r!==e&&(c.modifiers=r);var d=u[t];Array.isArray(d)?i?d.unshift(c):d.push(c):u[t]=d?i?[c,d]:[d,c]:c,a.plain=!1}function dr(e,a,t){var n=pr(e,":"+a)||pr(e,"v-bind:"+a);if(null!=n)return ar(n);if(!1!==t){var r=pr(e,a);if(null!=r)return JSON.stringify(r)}}function pr(e,a,t){var n;if(null!=(n=e.attrsMap[a]))for(var r=e.attrsList,i=0,o=r.length;i<o;i++)if(r[i].name===a){r.splice(i,1);break}return t&&delete e.attrsMap[a],n}function fr(e,a){for(var t=e.attrsList,n=0,r=t.length;n<r;n++){var i=t[n];if(a.test(i.name))return t.splice(n,1),i}}function hr(e,a){return a&&(null!=a.start&&(e.start=a.start),null!=a.end&&(e.end=a.end)),e}function mr(e,a,t){var n=t||{},r=n.number,i="$$v",o=i;n.trim&&(o="(typeof ".concat(i," === 'string'")+"? ".concat(i,".trim()")+": ".concat(i,")")),r&&(o="_n(".concat(o,")"));var s=vr(a,o);e.model={value:"(".concat(a,")"),expression:JSON.stringify(a),callback:"function (".concat(i,") {").concat(s,"}")}}function vr(e,a){var t=function(e){if(e=e.trim(),Un=e.length,e.indexOf("[")<0||e.lastIndexOf("]")<Un-1)return(qn=e.lastIndexOf("."))>-1?{exp:e.slice(0,qn),key:'"'+e.slice(qn+1)+'"'}:{exp:e,key:null};Kn=e,qn=Zn=Xn=0;for(;!yr();)br(Vn=gr())?Cr(Vn):91===Vn&&wr(Vn);return{exp:e.slice(0,Zn),key:e.slice(Zn+1,Xn)}}(e);return null===t.key?"".concat(e,"=").concat(a):"$set(".concat(t.exp,", ").concat(t.key,", ").concat(a,")")}function gr(){return Kn.charCodeAt(++qn)}function yr(){return qn>=Un}function br(e){return 34===e||39===e}function wr(e){var a=1;for(Zn=qn;!yr();)if(br(e=gr()))Cr(e);else if(91===e&&a++,93===e&&a--,0===a){Xn=qn;break}}function Cr(e){for(var a=e;!yr()&&(e=gr())!==a;);}var Sr,kr="__r";function _r(e,a,t){var n=Sr;return function r(){var i=a.apply(null,arguments);null!==i&&Br(e,r,t,n)}}var Pr=at&&!(ae&&Number(ae[1])<=53);function Ar(e,a,t,n){if(Pr){var r=Ha,i=a;a=i._wrapper=function(e){if(e.target===e.currentTarget||e.timeStamp>=r||e.timeStamp<=0||e.target.ownerDocument!==document)return i.apply(this,arguments)}}Sr.addEventListener(e,a,ne?{capture:t,passive:n}:t)}function Br(e,a,t,n){(n||Sr).removeEventListener(e,a._wrapper||a,t)}function xr(e,a){if(!n(e.data.on)||!n(a.data.on)){var t=a.data.on||{},i=e.data.on||{};Sr=a.elm||e.elm,function(e){if(r(e.__r)){var a=q?"change":"input";e[a]=[].concat(e.__r,e[a]||[]),delete e.__r}r(e.__c)&&(e.change=[].concat(e.__c,e.change||[]),delete e.__c)}(t),Ge(t,i,Ar,Br,_r,a.context),Sr=void 0}}var Tr,Or={create:xr,update:xr,destroy:function(e){return xr(e,Ln)}};function Lr(e,a){if(!n(e.data.domProps)||!n(a.data.domProps)){var t,o,s=a.elm,l=e.data.domProps||{},u=a.data.domProps||{};for(t in(r(u.__ob__)||i(u._v_attr_proxy))&&(u=a.data.domProps=O({},u)),l)t in u||(s[t]="");for(t in u){if(o=u[t],"textContent"===t||"innerHTML"===t){if(a.children&&(a.children.length=0),o===l[t])continue;1===s.childNodes.length&&s.removeChild(s.childNodes[0])}if("value"===t&&"PROGRESS"!==s.tagName){s._value=o;var c=n(o)?"":String(o);$r(s,c)&&(s.value=c)}else if("innerHTML"===t&&Cn(s.tagName)&&n(s.innerHTML)){(Tr=Tr||document.createElement("div")).innerHTML="<svg>".concat(o,"</svg>");for(var d=Tr.firstChild;s.firstChild;)s.removeChild(s.firstChild);for(;d.firstChild;)s.appendChild(d.firstChild)}else if(o!==l[t])try{s[t]=o}catch(e){}}}}function $r(e,a){return!e.composing&&("OPTION"===e.tagName||function(e,a){var t=!0;try{t=document.activeElement!==e}catch(e){}return t&&e.value!==a}(e,a)||function(e,a){var t=e.value,n=e._vModifiers;if(r(n)){if(n.number)return m(t)!==m(a);if(n.trim)return t.trim()!==a.trim()}return t!==a}(e,a))}var Dr={create:Lr,update:Lr},Mr=S((function(e){var a={},t=/:(.+)/;return e.split(/;(?![^(]*\))/g).forEach((function(e){if(e){var n=e.split(t);n.length>1&&(a[n[0].trim()]=n[1].trim())}})),a}));function Er(e){var a=Fr(e.style);return e.staticStyle?O(e.staticStyle,a):a}function Fr(e){return Array.isArray(e)?L(e):"string"==typeof e?Mr(e):e}var Nr,jr=/^--/,Rr=/\s*!important$/,Hr=function(e,a,t){if(jr.test(a))e.style.setProperty(a,t);else if(Rr.test(t))e.style.setProperty(B(a),t.replace(Rr,""),"important");else{var n=Ir(a);if(Array.isArray(t))for(var r=0,i=t.length;r<i;r++)e.style[n]=t[r];else e.style[n]=t}},Gr=["Webkit","Moz","ms"],Ir=S((function(e){if(Nr=Nr||document.createElement("div").style,"filter"!==(e=_(e))&&e in Nr)return e;for(var a=e.charAt(0).toUpperCase()+e.slice(1),t=0;t<Gr.length;t++){var n=Gr[t]+a;if(n in Nr)return n}}));function zr(e,a){var t=a.data,i=e.data;if(!(n(t.staticStyle)&&n(t.style)&&n(i.staticStyle)&&n(i.style))){var o,s,l=a.elm,u=i.staticStyle,c=i.normalizedStyle||i.style||{},d=u||c,p=Fr(a.data.style)||{};a.data.normalizedStyle=r(p.__ob__)?O({},p):p;var f=function(e,a){var t,n={};if(a)for(var r=e;r.componentInstance;)(r=r.componentInstance._vnode)&&r.data&&(t=Er(r.data))&&O(n,t);(t=Er(e.data))&&O(n,t);for(var i=e;i=i.parent;)i.data&&(t=Er(i.data))&&O(n,t);return n}(a,!0);for(s in d)n(f[s])&&Hr(l,s,"");for(s in f)(o=f[s])!==d[s]&&Hr(l,s,null==o?"":o)}}var Wr={create:zr,update:zr},Yr=/\s+/;function Jr(e,a){if(a&&(a=a.trim()))if(e.classList)a.indexOf(" ")>-1?a.split(Yr).forEach((function(a){return e.classList.add(a)})):e.classList.add(a);else{var t=" ".concat(e.getAttribute("class")||""," ");t.indexOf(" "+a+" ")<0&&e.setAttribute("class",(t+a).trim())}}function Ur(e,a){if(a&&(a=a.trim()))if(e.classList)a.indexOf(" ")>-1?a.split(Yr).forEach((function(a){return e.classList.remove(a)})):e.classList.remove(a),e.classList.length||e.removeAttribute("class");else{for(var t=" ".concat(e.getAttribute("class")||""," "),n=" "+a+" ";t.indexOf(n)>=0;)t=t.replace(n," ");(t=t.trim())?e.setAttribute("class",t):e.removeAttribute("class")}}function Kr(e){if(e){if("object"==typeof e){var a={};return!1!==e.css&&O(a,Vr(e.name||"v")),O(a,e),a}return"string"==typeof e?Vr(e):void 0}}var Vr=S((function(e){return{enterClass:"".concat(e,"-enter"),enterToClass:"".concat(e,"-enter-to"),enterActiveClass:"".concat(e,"-enter-active"),leaveClass:"".concat(e,"-leave"),leaveToClass:"".concat(e,"-leave-to"),leaveActiveClass:"".concat(e,"-leave-active")}})),qr=K&&!Z,Zr="transition",Xr="animation",Qr="transition",ei="transitionend",ai="animation",ti="animationend";qr&&(void 0===window.ontransitionend&&void 0!==window.onwebkittransitionend&&(Qr="WebkitTransition",ei="webkitTransitionEnd"),void 0===window.onanimationend&&void 0!==window.onwebkitanimationend&&(ai="WebkitAnimation",ti="webkitAnimationEnd"));var ni=K?window.requestAnimationFrame?window.requestAnimationFrame.bind(window):setTimeout:function(e){return e()};function ri(e){ni((function(){ni(e)}))}function ii(e,a){var t=e._transitionClasses||(e._transitionClasses=[]);t.indexOf(a)<0&&(t.push(a),Jr(e,a))}function oi(e,a){e._transitionClasses&&b(e._transitionClasses,a),Ur(e,a)}function si(e,a,t){var n=ui(e,a),r=n.type,i=n.timeout,o=n.propCount;if(!r)return t();var s=r===Zr?ei:ti,l=0,u=function(){e.removeEventListener(s,c),t()},c=function(a){a.target===e&&++l>=o&&u()};setTimeout((function(){l<o&&u()}),i+1),e.addEventListener(s,c)}var li=/\b(transform|all)(,|$)/;function ui(e,a){var t,n=window.getComputedStyle(e),r=(n[Qr+"Delay"]||"").split(", "),i=(n[Qr+"Duration"]||"").split(", "),o=ci(r,i),s=(n[ai+"Delay"]||"").split(", "),l=(n[ai+"Duration"]||"").split(", "),u=ci(s,l),c=0,d=0;return a===Zr?o>0&&(t=Zr,c=o,d=i.length):a===Xr?u>0&&(t=Xr,c=u,d=l.length):d=(t=(c=Math.max(o,u))>0?o>u?Zr:Xr:null)?t===Zr?i.length:l.length:0,{type:t,timeout:c,propCount:d,hasTransform:t===Zr&&li.test(n[Qr+"Property"])}}function ci(e,a){for(;e.length<a.length;)e=e.concat(e);return Math.max.apply(null,a.map((function(a,t){return di(a)+di(e[t])})))}function di(e){return 1e3*Number(e.slice(0,-1).replace(",","."))}function pi(e,a){var t=e.elm;r(t._leaveCb)&&(t._leaveCb.cancelled=!0,t._leaveCb());var i=Kr(e.data.transition);if(!n(i)&&!r(t._enterCb)&&1===t.nodeType){for(var o=i.css,u=i.type,c=i.enterClass,d=i.enterToClass,p=i.enterActiveClass,f=i.appearClass,h=i.appearToClass,v=i.appearActiveClass,g=i.beforeEnter,y=i.enter,b=i.afterEnter,w=i.enterCancelled,C=i.beforeAppear,S=i.appear,k=i.afterAppear,_=i.appearCancelled,P=i.duration,A=xa,B=xa.$vnode;B&&B.parent;)A=B.context,B=B.parent;var x=!A._isMounted||!e.isRootInsert;if(!x||S||""===S){var T=x&&f?f:c,O=x&&v?v:p,L=x&&h?h:d,$=x&&C||g,D=x&&s(S)?S:y,M=x&&k||b,E=x&&_||w,F=m(l(P)?P.enter:P);0;var j=!1!==o&&!Z,R=mi(D),H=t._enterCb=N((function(){j&&(oi(t,L),oi(t,O)),H.cancelled?(j&&oi(t,T),E&&E(t)):M&&M(t),t._enterCb=null}));e.data.show||Ie(e,"insert",(function(){var a=t.parentNode,n=a&&a._pending&&a._pending[e.key];n&&n.tag===e.tag&&n.elm._leaveCb&&n.elm._leaveCb(),D&&D(t,H)})),$&&$(t),j&&(ii(t,T),ii(t,O),ri((function(){oi(t,T),H.cancelled||(ii(t,L),R||(hi(F)?setTimeout(H,F):si(t,u,H)))}))),e.data.show&&(a&&a(),D&&D(t,H)),j||R||H()}}}function fi(e,a){var t=e.elm;r(t._enterCb)&&(t._enterCb.cancelled=!0,t._enterCb());var i=Kr(e.data.transition);if(n(i)||1!==t.nodeType)return a();if(!r(t._leaveCb)){var o=i.css,s=i.type,u=i.leaveClass,c=i.leaveToClass,d=i.leaveActiveClass,p=i.beforeLeave,f=i.leave,h=i.afterLeave,v=i.leaveCancelled,g=i.delayLeave,y=i.duration,b=!1!==o&&!Z,w=mi(f),C=m(l(y)?y.leave:y);0;var S=t._leaveCb=N((function(){t.parentNode&&t.parentNode._pending&&(t.parentNode._pending[e.key]=null),b&&(oi(t,c),oi(t,d)),S.cancelled?(b&&oi(t,u),v&&v(t)):(a(),h&&h(t)),t._leaveCb=null}));g?g(k):k()}function k(){S.cancelled||(!e.data.show&&t.parentNode&&((t.parentNode._pending||(t.parentNode._pending={}))[e.key]=e),p&&p(t),b&&(ii(t,u),ii(t,d),ri((function(){oi(t,u),S.cancelled||(ii(t,c),w||(hi(C)?setTimeout(S,C):si(t,s,S)))}))),f&&f(t,S),b||w||S())}}function hi(e){return"number"==typeof e&&!isNaN(e)}function mi(e){if(n(e))return!1;var a=e.fns;return r(a)?mi(Array.isArray(a)?a[0]:a):(e._length||e.length)>1}function vi(e,a){!0!==a.data.show&&pi(a)}var gi=function(e){var t,s,l={},u=e.modules,c=e.nodeOps;for(t=0;t<$n.length;++t)for(l[$n[t]]=[],s=0;s<u.length;++s)r(u[s][$n[t]])&&l[$n[t]].push(u[s][$n[t]]);function d(e){var a=c.parentNode(e);r(a)&&c.removeChild(a,e)}function p(e,a,t,n,o,s,u){if(r(e.elm)&&r(s)&&(e=s[u]=me(e)),e.isRootInsert=!o,!function(e,a,t,n){var o=e.data;if(r(o)){var s=r(e.componentInstance)&&o.keepAlive;if(r(o=o.hook)&&r(o=o.init)&&o(e,!1),r(e.componentInstance))return f(e,a),h(t,e.elm,n),i(s)&&function(e,a,t,n){var i,o=e;for(;o.componentInstance;)if(r(i=(o=o.componentInstance._vnode).data)&&r(i=i.transition)){for(i=0;i<l.activate.length;++i)l.activate[i](Ln,o);a.push(o);break}h(t,e.elm,n)}(e,a,t,n),!0}}(e,a,t,n)){var d=e.data,p=e.children,v=e.tag;r(v)?(e.elm=e.ns?c.createElementNS(e.ns,v):c.createElement(v,e),b(e),m(e,p,a),r(d)&&y(e,a),h(t,e.elm,n)):i(e.isComment)?(e.elm=c.createComment(e.text),h(t,e.elm,n)):(e.elm=c.createTextNode(e.text),h(t,e.elm,n))}}function f(e,a){r(e.data.pendingInsert)&&(a.push.apply(a,e.data.pendingInsert),e.data.pendingInsert=null),e.elm=e.componentInstance.$el,g(e)?(y(e,a),b(e)):(Tn(e),a.push(e))}function h(e,a,t){r(e)&&(r(t)?c.parentNode(t)===e&&c.insertBefore(e,a,t):c.appendChild(e,a))}function m(e,t,n){if(a(t)){0;for(var r=0;r<t.length;++r)p(t[r],n,e.elm,null,!0,t,r)}else o(e.text)&&c.appendChild(e.elm,c.createTextNode(String(e.text)))}function g(e){for(;e.componentInstance;)e=e.componentInstance._vnode;return r(e.tag)}function y(e,a){for(var n=0;n<l.create.length;++n)l.create[n](Ln,e);r(t=e.data.hook)&&(r(t.create)&&t.create(Ln,e),r(t.insert)&&a.push(e))}function b(e){var a;if(r(a=e.fnScopeId))c.setStyleScope(e.elm,a);else for(var t=e;t;)r(a=t.context)&&r(a=a.$options._scopeId)&&c.setStyleScope(e.elm,a),t=t.parent;r(a=xa)&&a!==e.context&&a!==e.fnContext&&r(a=a.$options._scopeId)&&c.setStyleScope(e.elm,a)}function w(e,a,t,n,r,i){for(;n<=r;++n)p(t[n],i,e,a,!1,t,n)}function C(e){var a,t,n=e.data;if(r(n))for(r(a=n.hook)&&r(a=a.destroy)&&a(e),a=0;a<l.destroy.length;++a)l.destroy[a](e);if(r(a=e.children))for(t=0;t<e.children.length;++t)C(e.children[t])}function S(e,a,t){for(;a<=t;++a){var n=e[a];r(n)&&(r(n.tag)?(k(n),C(n)):d(n.elm))}}function k(e,a){if(r(a)||r(e.data)){var t,n=l.remove.length+1;for(r(a)?a.listeners+=n:a=function(e,a){function t(){0==--t.listeners&&d(e)}return t.listeners=a,t}(e.elm,n),r(t=e.componentInstance)&&r(t=t._vnode)&&r(t.data)&&k(t,a),t=0;t<l.remove.length;++t)l.remove[t](e,a);r(t=e.data.hook)&&r(t=t.remove)?t(e,a):a()}else d(e.elm)}function _(e,a,t,n){for(var i=t;i<n;i++){var o=a[i];if(r(o)&&Dn(e,o))return i}}function P(e,a,t,o,s,u){if(e!==a){r(a.elm)&&r(o)&&(a=o[s]=me(a));var d=a.elm=e.elm;if(i(e.isAsyncPlaceholder))r(a.asyncFactory.resolved)?x(e.elm,a,t):a.isAsyncPlaceholder=!0;else if(i(a.isStatic)&&i(e.isStatic)&&a.key===e.key&&(i(a.isCloned)||i(a.isOnce)))a.componentInstance=e.componentInstance;else{var f,h=a.data;r(h)&&r(f=h.hook)&&r(f=f.prepatch)&&f(e,a);var m=e.children,v=a.children;if(r(h)&&g(a)){for(f=0;f<l.update.length;++f)l.update[f](e,a);r(f=h.hook)&&r(f=f.update)&&f(e,a)}n(a.text)?r(m)&&r(v)?m!==v&&function(e,a,t,i,o){var s,l,u,d=0,f=0,h=a.length-1,m=a[0],v=a[h],g=t.length-1,y=t[0],b=t[g],C=!o;for(;d<=h&&f<=g;)n(m)?m=a[++d]:n(v)?v=a[--h]:Dn(m,y)?(P(m,y,i,t,f),m=a[++d],y=t[++f]):Dn(v,b)?(P(v,b,i,t,g),v=a[--h],b=t[--g]):Dn(m,b)?(P(m,b,i,t,g),C&&c.insertBefore(e,m.elm,c.nextSibling(v.elm)),m=a[++d],b=t[--g]):Dn(v,y)?(P(v,y,i,t,f),C&&c.insertBefore(e,v.elm,m.elm),v=a[--h],y=t[++f]):(n(s)&&(s=Mn(a,d,h)),n(l=r(y.key)?s[y.key]:_(y,a,d,h))?p(y,i,e,m.elm,!1,t,f):Dn(u=a[l],y)?(P(u,y,i,t,f),a[l]=void 0,C&&c.insertBefore(e,u.elm,m.elm)):p(y,i,e,m.elm,!1,t,f),y=t[++f]);d>h?w(e,n(t[g+1])?null:t[g+1].elm,t,f,g,i):f>g&&S(a,d,h)}(d,m,v,t,u):r(v)?(r(e.text)&&c.setTextContent(d,""),w(d,null,v,0,v.length-1,t)):r(m)?S(m,0,m.length-1):r(e.text)&&c.setTextContent(d,""):e.text!==a.text&&c.setTextContent(d,a.text),r(h)&&r(f=h.hook)&&r(f=f.postpatch)&&f(e,a)}}}function A(e,a,t){if(i(t)&&r(e.parent))e.parent.data.pendingInsert=a;else for(var n=0;n<a.length;++n)a[n].data.hook.insert(a[n])}var B=v("attrs,class,staticClass,staticStyle,key");function x(e,a,t,n){var o,s=a.tag,l=a.data,u=a.children;if(n=n||l&&l.pre,a.elm=e,i(a.isComment)&&r(a.asyncFactory))return a.isAsyncPlaceholder=!0,!0;if(r(l)&&(r(o=l.hook)&&r(o=o.init)&&o(a,!0),r(o=a.componentInstance)))return f(a,t),!0;if(r(s)){if(r(u))if(e.hasChildNodes())if(r(o=l)&&r(o=o.domProps)&&r(o=o.innerHTML)){if(o!==e.innerHTML)return!1}else{for(var c=!0,d=e.firstChild,p=0;p<u.length;p++){if(!d||!x(d,u[p],t,n)){c=!1;break}d=d.nextSibling}if(!c||d)return!1}else m(a,u,t);if(r(l)){var h=!1;for(var v in l)if(!B(v)){h=!0,y(a,t);break}!h&&l.class&&pt(l.class)}}else e.data!==a.text&&(e.data=a.text);return!0}return function(e,a,t,o){if(!n(a)){var s,u=!1,d=[];if(n(e))u=!0,p(a,d);else{var f=r(e.nodeType);if(!f&&Dn(e,a))P(e,a,d,null,null,o);else{if(f){if(1===e.nodeType&&e.hasAttribute(R)&&(e.removeAttribute(R),t=!0),i(t)&&x(e,a,d))return A(a,d,!0),e;s=e,e=new pe(c.tagName(s).toLowerCase(),{},[],void 0,s)}var h=e.elm,m=c.parentNode(h);if(p(a,d,h._leaveCb?null:m,c.nextSibling(h)),r(a.parent))for(var v=a.parent,y=g(a);v;){for(var b=0;b<l.destroy.length;++b)l.destroy[b](v);if(v.elm=a.elm,y){for(var w=0;w<l.create.length;++w)l.create[w](Ln,v);var k=v.data.hook.insert;if(k.merged)for(var _=1;_<k.fns.length;_++)k.fns[_]()}else Tn(v);v=v.parent}r(m)?S([e],0,0):r(e.tag)&&C(e)}}return A(a,d,u),a.elm}r(e)&&C(e)}}({nodeOps:Bn,modules:[Yn,Qn,Or,Dr,Wr,K?{create:vi,activate:vi,remove:function(e,a){!0!==e.data.show?fi(e,a):a()}}:{}].concat(Gn)});Z&&document.addEventListener("selectionchange",(function(){var e=document.activeElement;e&&e.vmodel&&Pi(e,"input")}));var yi={inserted:function(e,a,t,n){"select"===t.tag?(n.elm&&!n.elm._vOptions?Ie(t,"postpatch",(function(){yi.componentUpdated(e,a,t)})):bi(e,a,t.context),e._vOptions=[].map.call(e.options,Si)):("textarea"===t.tag||Pn(e.type))&&(e._vModifiers=a.modifiers,a.modifiers.lazy||(e.addEventListener("compositionstart",ki),e.addEventListener("compositionend",_i),e.addEventListener("change",_i),Z&&(e.vmodel=!0)))},componentUpdated:function(e,a,t){if("select"===t.tag){bi(e,a,t.context);var n=e._vOptions,r=e._vOptions=[].map.call(e.options,Si);if(r.some((function(e,a){return!E(e,n[a])})))(e.multiple?a.value.some((function(e){return Ci(e,r)})):a.value!==a.oldValue&&Ci(a.value,r))&&Pi(e,"change")}}};function bi(e,a,t){wi(e,a,t),(q||X)&&setTimeout((function(){wi(e,a,t)}),0)}function wi(e,a,t){var n=a.value,r=e.multiple;if(!r||Array.isArray(n)){for(var i,o,s=0,l=e.options.length;s<l;s++)if(o=e.options[s],r)i=F(n,Si(o))>-1,o.selected!==i&&(o.selected=i);else if(E(Si(o),n))return void(e.selectedIndex!==s&&(e.selectedIndex=s));r||(e.selectedIndex=-1)}}function Ci(e,a){return a.every((function(a){return!E(a,e)}))}function Si(e){return"_value"in e?e._value:e.value}function ki(e){e.target.composing=!0}function _i(e){e.target.composing&&(e.target.composing=!1,Pi(e.target,"input"))}function Pi(e,a){var t=document.createEvent("HTMLEvents");t.initEvent(a,!0,!0),e.dispatchEvent(t)}function Ai(e){return!e.componentInstance||e.data&&e.data.transition?e:Ai(e.componentInstance._vnode)}var Bi={bind:function(e,a,t){var n=a.value,r=(t=Ai(t)).data&&t.data.transition,i=e.__vOriginalDisplay="none"===e.style.display?"":e.style.display;n&&r?(t.data.show=!0,pi(t,(function(){e.style.display=i}))):e.style.display=n?i:"none"},update:function(e,a,t){var n=a.value;!n!=!a.oldValue&&((t=Ai(t)).data&&t.data.transition?(t.data.show=!0,n?pi(t,(function(){e.style.display=e.__vOriginalDisplay})):fi(t,(function(){e.style.display="none"}))):e.style.display=n?e.__vOriginalDisplay:"none")},unbind:function(e,a,t,n,r){r||(e.style.display=e.__vOriginalDisplay)}},xi={model:yi,show:Bi},Ti={name:String,appear:Boolean,css:Boolean,mode:String,type:String,enterClass:String,leaveClass:String,enterToClass:String,leaveToClass:String,enterActiveClass:String,leaveActiveClass:String,appearClass:String,appearActiveClass:String,appearToClass:String,duration:[Number,String,Object]};function Oi(e){var a=e&&e.componentOptions;return a&&a.Ctor.options.abstract?Oi(ka(a.children)):e}function Li(e){var a={},t=e.$options;for(var n in t.propsData)a[n]=e[n];var r=t._parentListeners;for(var n in r)a[_(n)]=r[n];return a}function $i(e,a){if(/\d-keep-alive$/.test(a.tag))return e("keep-alive",{props:a.componentOptions.propsData})}var Di=function(e){return e.tag||pa(e)},Mi=function(e){return"show"===e.name},Ei={name:"transition",props:Ti,abstract:!0,render:function(e){var a=this,t=this.$slots.default;if(t&&(t=t.filter(Di)).length){0;var n=this.mode;0;var r=t[0];if(function(e){for(;e=e.parent;)if(e.data.transition)return!0}(this.$vnode))return r;var i=Oi(r);if(!i)return r;if(this._leaving)return $i(e,r);var s="__transition-".concat(this._uid,"-");i.key=null==i.key?i.isComment?s+"comment":s+i.tag:o(i.key)?0===String(i.key).indexOf(s)?i.key:s+i.key:i.key;var l=(i.data||(i.data={})).transition=Li(this),u=this._vnode,c=Oi(u);if(i.data.directives&&i.data.directives.some(Mi)&&(i.data.show=!0),c&&c.data&&!function(e,a){return a.key===e.key&&a.tag===e.tag}(i,c)&&!pa(c)&&(!c.componentInstance||!c.componentInstance._vnode.isComment)){var d=c.data.transition=O({},l);if("out-in"===n)return this._leaving=!0,Ie(d,"afterLeave",(function(){a._leaving=!1,a.$forceUpdate()})),$i(e,r);if("in-out"===n){if(pa(i))return u;var p,f=function(){p()};Ie(l,"afterEnter",f),Ie(l,"enterCancelled",f),Ie(d,"delayLeave",(function(e){p=e}))}}return r}}},Fi=O({tag:String,moveClass:String},Ti);delete Fi.mode;var Ni={props:Fi,beforeMount:function(){var e=this,a=this._update;this._update=function(t,n){var r=Ta(e);e.__patch__(e._vnode,e.kept,!1,!0),e._vnode=e.kept,r(),a.call(e,t,n)}},render:function(e){for(var a=this.tag||this.$vnode.data.tag||"span",t=Object.create(null),n=this.prevChildren=this.children,r=this.$slots.default||[],i=this.children=[],o=Li(this),s=0;s<r.length;s++){if((c=r[s]).tag)if(null!=c.key&&0!==String(c.key).indexOf("__vlist"))i.push(c),t[c.key]=c,(c.data||(c.data={})).transition=o;else;}if(n){var l=[],u=[];for(s=0;s<n.length;s++){var c;(c=n[s]).data.transition=o,c.data.pos=c.elm.getBoundingClientRect(),t[c.key]?l.push(c):u.push(c)}this.kept=e(a,null,l),this.removed=u}return e(a,null,i)},updated:function(){var e=this.prevChildren,a=this.moveClass||(this.name||"v")+"-move";e.length&&this.hasMove(e[0].elm,a)&&(e.forEach(ji),e.forEach(Ri),e.forEach(Hi),this._reflow=document.body.offsetHeight,e.forEach((function(e){if(e.data.moved){var t=e.elm,n=t.style;ii(t,a),n.transform=n.WebkitTransform=n.transitionDuration="",t.addEventListener(ei,t._moveCb=function e(n){n&&n.target!==t||n&&!/transform$/.test(n.propertyName)||(t.removeEventListener(ei,e),t._moveCb=null,oi(t,a))})}})))},methods:{hasMove:function(e,a){if(!qr)return!1;if(this._hasMove)return this._hasMove;var t=e.cloneNode();e._transitionClasses&&e._transitionClasses.forEach((function(e){Ur(t,e)})),Jr(t,a),t.style.display="none",this.$el.appendChild(t);var n=ui(t);return this.$el.removeChild(t),this._hasMove=n.hasTransform}}};function ji(e){e.elm._moveCb&&e.elm._moveCb(),e.elm._enterCb&&e.elm._enterCb()}function Ri(e){e.data.newPos=e.elm.getBoundingClientRect()}function Hi(e){var a=e.data.pos,t=e.data.newPos,n=a.left-t.left,r=a.top-t.top;if(n||r){e.data.moved=!0;var i=e.elm.style;i.transform=i.WebkitTransform="translate(".concat(n,"px,").concat(r,"px)"),i.transitionDuration="0s"}}var Gi={Transition:Ei,TransitionGroup:Ni};Vt.config.mustUseProp=sn,Vt.config.isReservedTag=Sn,Vt.config.isReservedAttr=rn,Vt.config.getTagNamespace=kn,Vt.config.isUnknownElement=function(e){if(!K)return!0;if(Sn(e))return!1;if(e=e.toLowerCase(),null!=_n[e])return _n[e];var a=document.createElement(e);return e.indexOf("-")>-1?_n[e]=a.constructor===window.HTMLUnknownElement||a.constructor===window.HTMLElement:_n[e]=/HTMLUnknownElement/.test(a.toString())},O(Vt.options.directives,xi),O(Vt.options.components,Gi),Vt.prototype.__patch__=K?gi:$,Vt.prototype.$mount=function(e,a){return function(e,a,t){var n;e.$el=a,e.$options.render||(e.$options.render=fe),Da(e,"beforeMount"),n=function(){e._update(e._render(),t)},new mt(e,n,$,{before:function(){e._isMounted&&!e._isDestroyed&&Da(e,"beforeUpdate")}},!0),t=!1;var r=e._preWatchers;if(r)for(var i=0;i<r.length;i++)r[i].run();return null==e.$vnode&&(e._isMounted=!0,Da(e,"mounted")),e}(this,e=e&&K?An(e):void 0,a)},K&&setTimeout((function(){I.devtools&&oe&&oe.emit("init",Vt)}),0);var Ii=/\{\{((?:.|\r?\n)+?)\}\}/g,zi=/[-.*+?^${}()|[\]\/\\]/g,Wi=S((function(e){var a=e[0].replace(zi,"\\$&"),t=e[1].replace(zi,"\\$&");return new RegExp(a+"((?:.|\\n)+?)"+t,"g")}));var Yi={staticKeys:["staticClass"],transformNode:function(e,a){a.warn;var t=pr(e,"class");t&&(e.staticClass=JSON.stringify(t.replace(/\s+/g," ").trim()));var n=dr(e,"class",!1);n&&(e.classBinding=n)},genData:function(e){var a="";return e.staticClass&&(a+="staticClass:".concat(e.staticClass,",")),e.classBinding&&(a+="class:".concat(e.classBinding,",")),a}};var Ji,Ui={staticKeys:["staticStyle"],transformNode:function(e,a){a.warn;var t=pr(e,"style");t&&(e.staticStyle=JSON.stringify(Mr(t)));var n=dr(e,"style",!1);n&&(e.styleBinding=n)},genData:function(e){var a="";return e.staticStyle&&(a+="staticStyle:".concat(e.staticStyle,",")),e.styleBinding&&(a+="style:(".concat(e.styleBinding,"),")),a}},Ki=function(e){return(Ji=Ji||document.createElement("div")).innerHTML=e,Ji.textContent},Vi=v("area,base,br,col,embed,frame,hr,img,input,isindex,keygen,link,meta,param,source,track,wbr"),qi=v("colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source"),Zi=v("address,article,aside,base,blockquote,body,caption,col,colgroup,dd,details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,title,tr,track"),Xi=/^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/,Qi=/^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+?\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/,eo="[a-zA-Z_][\\-\\.0-9_a-zA-Z".concat(z.source,"]*"),ao="((?:".concat(eo,"\\:)?").concat(eo,")"),to=new RegExp("^<".concat(ao)),no=/^\s*(\/?)>/,ro=new RegExp("^<\\/".concat(ao,"[^>]*>")),io=/^<!DOCTYPE [^>]+>/i,oo=/^<!\--/,so=/^<!\[/,lo=v("script,style,textarea",!0),uo={},co={"&lt;":"<","&gt;":">","&quot;":'"',"&amp;":"&","&#10;":"\n","&#9;":"\t","&#39;":"'"},po=/&(?:lt|gt|quot|amp|#39);/g,fo=/&(?:lt|gt|quot|amp|#39|#10|#9);/g,ho=v("pre,textarea",!0),mo=function(e,a){return e&&ho(e)&&"\n"===a[0]};function vo(e,a){var t=a?fo:po;return e.replace(t,(function(e){return co[e]}))}function go(e,a){for(var t,n,r=[],i=a.expectHTML,o=a.isUnaryTag||D,s=a.canBeLeftOpenTag||D,l=0,u=function(){if(t=e,n&&lo(n)){var u=0,p=n.toLowerCase(),f=uo[p]||(uo[p]=new RegExp("([\\s\\S]*?)(</"+p+"[^>]*>)","i"));S=e.replace(f,(function(e,t,n){return u=n.length,lo(p)||"noscript"===p||(t=t.replace(/<!\--([\s\S]*?)-->/g,"$1").replace(/<!\[CDATA\[([\s\S]*?)]]>/g,"$1")),mo(p,t)&&(t=t.slice(1)),a.chars&&a.chars(t),""}));l+=e.length-S.length,e=S,d(p,l-u,l)}else{var h=e.indexOf("<");if(0===h){if(oo.test(e)){var m=e.indexOf("--\x3e");if(m>=0)return a.shouldKeepComment&&a.comment&&a.comment(e.substring(4,m),l,l+m+3),c(m+3),"continue"}if(so.test(e)){var v=e.indexOf("]>");if(v>=0)return c(v+2),"continue"}var g=e.match(io);if(g)return c(g[0].length),"continue";var y=e.match(ro);if(y){var b=l;return c(y[0].length),d(y[1],b,l),"continue"}var w=function(){var a=e.match(to);if(a){var t={tagName:a[1],attrs:[],start:l};c(a[0].length);for(var n=void 0,r=void 0;!(n=e.match(no))&&(r=e.match(Qi)||e.match(Xi));)r.start=l,c(r[0].length),r.end=l,t.attrs.push(r);if(n)return t.unarySlash=n[1],c(n[0].length),t.end=l,t}}();if(w)return function(e){var t=e.tagName,l=e.unarySlash;i&&("p"===n&&Zi(t)&&d(n),s(t)&&n===t&&d(t));for(var u=o(t)||!!l,c=e.attrs.length,p=new Array(c),f=0;f<c;f++){var h=e.attrs[f],m=h[3]||h[4]||h[5]||"",v="a"===t&&"href"===h[1]?a.shouldDecodeNewlinesForHref:a.shouldDecodeNewlines;p[f]={name:h[1],value:vo(m,v)}}u||(r.push({tag:t,lowerCasedTag:t.toLowerCase(),attrs:p,start:e.start,end:e.end}),n=t);a.start&&a.start(t,p,u,e.start,e.end)}(w),mo(w.tagName,e)&&c(1),"continue"}var C=void 0,S=void 0,k=void 0;if(h>=0){for(S=e.slice(h);!(ro.test(S)||to.test(S)||oo.test(S)||so.test(S)||(k=S.indexOf("<",1))<0);)h+=k,S=e.slice(h);C=e.substring(0,h)}h<0&&(C=e),C&&c(C.length),a.chars&&C&&a.chars(C,l-C.length,l)}if(e===t)return a.chars&&a.chars(e),"break"};e;){if("break"===u())break}function c(a){l+=a,e=e.substring(a)}function d(e,t,i){var o,s;if(null==t&&(t=l),null==i&&(i=l),e)for(s=e.toLowerCase(),o=r.length-1;o>=0&&r[o].lowerCasedTag!==s;o--);else o=0;if(o>=0){for(var u=r.length-1;u>=o;u--)a.end&&a.end(r[u].tag,t,i);r.length=o,n=o&&r[o-1].tag}else"br"===s?a.start&&a.start(e,[],!0,t,i):"p"===s&&(a.start&&a.start(e,[],!1,t,i),a.end&&a.end(e,t,i))}d()}var yo,bo,wo,Co,So,ko,_o,Po,Ao=/^@|^v-on:/,Bo=/^v-|^@|^:|^#/,xo=/([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/,To=/,([^,\}\]]*)(?:,([^,\}\]]*))?$/,Oo=/^\(|\)$/g,Lo=/^\[.*\]$/,$o=/:(.*)$/,Do=/^:|^\.|^v-bind:/,Mo=/\.[^.\]]+(?=[^\]]*$)/g,Eo=/^v-slot(:|$)|^#/,Fo=/[\r\n]/,No=/[ \f\t\r\n]+/g,jo=S(Ki),Ro="_empty_";function Ho(e,a,t){return{type:1,tag:e,attrsList:a,attrsMap:Uo(a),rawAttrsMap:{},parent:t,children:[]}}function Go(e,a){yo=a.warn||nr,ko=a.isPreTag||D,_o=a.mustUseProp||D,Po=a.getTagNamespace||D;var t=a.isReservedTag||D;(function(e){return!(!(e.component||e.attrsMap[":is"]||e.attrsMap["v-bind:is"])&&(e.attrsMap.is?t(e.attrsMap.is):t(e.tag)))}),wo=rr(a.modules,"transformNode"),Co=rr(a.modules,"preTransformNode"),So=rr(a.modules,"postTransformNode"),bo=a.delimiters;var n,r,i=[],o=!1!==a.preserveWhitespace,s=a.whitespace,l=!1,u=!1;function c(e){if(d(e),l||e.processed||(e=Io(e,a)),i.length||e===n||n.if&&(e.elseif||e.else)&&Wo(n,{exp:e.elseif,block:e}),r&&!e.forbidden)if(e.elseif||e.else)o=e,s=function(e){for(var a=e.length;a--;){if(1===e[a].type)return e[a];e.pop()}}(r.children),s&&s.if&&Wo(s,{exp:o.elseif,block:o});else{if(e.slotScope){var t=e.slotTarget||'"default"';(r.scopedSlots||(r.scopedSlots={}))[t]=e}r.children.push(e),e.parent=r}var o,s;e.children=e.children.filter((function(e){return!e.slotScope})),d(e),e.pre&&(l=!1),ko(e.tag)&&(u=!1);for(var c=0;c<So.length;c++)So[c](e,a)}function d(e){if(!u)for(var a=void 0;(a=e.children[e.children.length-1])&&3===a.type&&" "===a.text;)e.children.pop()}return go(e,{warn:yo,expectHTML:a.expectHTML,isUnaryTag:a.isUnaryTag,canBeLeftOpenTag:a.canBeLeftOpenTag,shouldDecodeNewlines:a.shouldDecodeNewlines,shouldDecodeNewlinesForHref:a.shouldDecodeNewlinesForHref,shouldKeepComment:a.comments,outputSourceRange:a.outputSourceRange,start:function(e,t,o,s,d){var p=r&&r.ns||Po(e);q&&"svg"===p&&(t=function(e){for(var a=[],t=0;t<e.length;t++){var n=e[t];Ko.test(n.name)||(n.name=n.name.replace(Vo,""),a.push(n))}return a}(t));var f,h=Ho(e,t,r);p&&(h.ns=p),"style"!==(f=h).tag&&("script"!==f.tag||f.attrsMap.type&&"text/javascript"!==f.attrsMap.type)||ie()||(h.forbidden=!0);for(var m=0;m<Co.length;m++)h=Co[m](h,a)||h;l||(!function(e){null!=pr(e,"v-pre")&&(e.pre=!0)}(h),h.pre&&(l=!0)),ko(h.tag)&&(u=!0),l?function(e){var a=e.attrsList,t=a.length;if(t)for(var n=e.attrs=new Array(t),r=0;r<t;r++)n[r]={name:a[r].name,value:JSON.stringify(a[r].value)},null!=a[r].start&&(n[r].start=a[r].start,n[r].end=a[r].end);else e.pre||(e.plain=!0)}(h):h.processed||(zo(h),function(e){var a=pr(e,"v-if");if(a)e.if=a,Wo(e,{exp:a,block:e});else{null!=pr(e,"v-else")&&(e.else=!0);var t=pr(e,"v-else-if");t&&(e.elseif=t)}}(h),function(e){null!=pr(e,"v-once")&&(e.once=!0)}(h)),n||(n=h),o?c(h):(r=h,i.push(h))},end:function(e,a,t){var n=i[i.length-1];i.length-=1,r=i[i.length-1],c(n)},chars:function(e,a,t){if(r&&(!q||"textarea"!==r.tag||r.attrsMap.placeholder!==e)){var n,i=r.children;if(e=u||e.trim()?"script"===(n=r).tag||"style"===n.tag?e:jo(e):i.length?s?"condense"===s&&Fo.test(e)?"":" ":o?" ":"":""){u||"condense"!==s||(e=e.replace(No," "));var c=void 0,d=void 0;!l&&" "!==e&&(c=function(e,a){var t=a?Wi(a):Ii;if(t.test(e)){for(var n,r,i,o=[],s=[],l=t.lastIndex=0;n=t.exec(e);){(r=n.index)>l&&(s.push(i=e.slice(l,r)),o.push(JSON.stringify(i)));var u=ar(n[1].trim());o.push("_s(".concat(u,")")),s.push({"@binding":u}),l=r+n[0].length}return l<e.length&&(s.push(i=e.slice(l)),o.push(JSON.stringify(i))),{expression:o.join("+"),tokens:s}}}(e,bo))?d={type:2,expression:c.expression,tokens:c.tokens,text:e}:" "===e&&i.length&&" "===i[i.length-1].text||(d={type:3,text:e}),d&&i.push(d)}}},comment:function(e,a,t){if(r){var n={type:3,text:e,isComment:!0};0,r.children.push(n)}}}),n}function Io(e,a){var t;!function(e){var a=dr(e,"key");if(a){e.key=a}}(e),e.plain=!e.key&&!e.scopedSlots&&!e.attrsList.length,function(e){var a=dr(e,"ref");a&&(e.ref=a,e.refInFor=function(e){var a=e;for(;a;){if(void 0!==a.for)return!0;a=a.parent}return!1}(e))}(e),function(e){var a;"template"===e.tag?(a=pr(e,"scope"),e.slotScope=a||pr(e,"slot-scope")):(a=pr(e,"slot-scope"))&&(e.slotScope=a);var t=dr(e,"slot");t&&(e.slotTarget='""'===t?'"default"':t,e.slotTargetDynamic=!(!e.attrsMap[":slot"]&&!e.attrsMap["v-bind:slot"]),"template"===e.tag||e.slotScope||or(e,"slot",t,function(e,a){return e.rawAttrsMap[":"+a]||e.rawAttrsMap["v-bind:"+a]||e.rawAttrsMap[a]}(e,"slot")));if("template"===e.tag){if(o=fr(e,Eo)){0;var n=Yo(o),r=n.name,i=n.dynamic;e.slotTarget=r,e.slotTargetDynamic=i,e.slotScope=o.value||Ro}}else{var o;if(o=fr(e,Eo)){0;var s=e.scopedSlots||(e.scopedSlots={}),l=Yo(o),u=l.name,c=(i=l.dynamic,s[u]=Ho("template",[],e));c.slotTarget=u,c.slotTargetDynamic=i,c.children=e.children.filter((function(e){if(!e.slotScope)return e.parent=c,!0})),c.slotScope=o.value||Ro,e.children=[],e.plain=!1}}}(e),"slot"===(t=e).tag&&(t.slotName=dr(t,"name")),function(e){var a;(a=dr(e,"is"))&&(e.component=a);null!=pr(e,"inline-template")&&(e.inlineTemplate=!0)}(e);for(var n=0;n<wo.length;n++)e=wo[n](e,a)||e;return function(e){var a,t,n,r,i,o,s,l,u=e.attrsList;for(a=0,t=u.length;a<t;a++){if(n=r=u[a].name,i=u[a].value,Bo.test(n))if(e.hasBindings=!0,(o=Jo(n.replace(Bo,"")))&&(n=n.replace(Mo,"")),Do.test(n))n=n.replace(Do,""),i=ar(i),(l=Lo.test(n))&&(n=n.slice(1,-1)),o&&(o.prop&&!l&&"innerHtml"===(n=_(n))&&(n="innerHTML"),o.camel&&!l&&(n=_(n)),o.sync&&(s=vr(i,"$event"),l?cr(e,'"update:"+('.concat(n,")"),s,null,!1,0,u[a],!0):(cr(e,"update:".concat(_(n)),s,null,!1,0,u[a]),B(n)!==_(n)&&cr(e,"update:".concat(B(n)),s,null,!1,0,u[a])))),o&&o.prop||!e.component&&_o(e.tag,e.attrsMap.type,n)?ir(e,n,i,u[a],l):or(e,n,i,u[a],l);else if(Ao.test(n))n=n.replace(Ao,""),(l=Lo.test(n))&&(n=n.slice(1,-1)),cr(e,n,i,o,!1,0,u[a],l);else{var c=(n=n.replace(Bo,"")).match($o),d=c&&c[1];l=!1,d&&(n=n.slice(0,-(d.length+1)),Lo.test(d)&&(d=d.slice(1,-1),l=!0)),lr(e,n,r,i,d,l,o,u[a])}else or(e,n,JSON.stringify(i),u[a]),!e.component&&"muted"===n&&_o(e.tag,e.attrsMap.type,n)&&ir(e,n,"true",u[a])}}(e),e}function zo(e){var a;if(a=pr(e,"v-for")){var t=function(e){var a=e.match(xo);if(!a)return;var t={};t.for=a[2].trim();var n=a[1].trim().replace(Oo,""),r=n.match(To);r?(t.alias=n.replace(To,"").trim(),t.iterator1=r[1].trim(),r[2]&&(t.iterator2=r[2].trim())):t.alias=n;return t}(a);t&&O(e,t)}}function Wo(e,a){e.ifConditions||(e.ifConditions=[]),e.ifConditions.push(a)}function Yo(e){var a=e.name.replace(Eo,"");return a||"#"!==e.name[0]&&(a="default"),Lo.test(a)?{name:a.slice(1,-1),dynamic:!0}:{name:'"'.concat(a,'"'),dynamic:!1}}function Jo(e){var a=e.match(Mo);if(a){var t={};return a.forEach((function(e){t[e.slice(1)]=!0})),t}}function Uo(e){for(var a={},t=0,n=e.length;t<n;t++)a[e[t].name]=e[t].value;return a}var Ko=/^xmlns:NS\d+/,Vo=/^NS\d+:/;function qo(e){return Ho(e.tag,e.attrsList.slice(),e.parent)}var Zo={preTransformNode:function(e,a){if("input"===e.tag){var t=e.attrsMap;if(!t["v-model"])return;var n=void 0;if((t[":type"]||t["v-bind:type"])&&(n=dr(e,"type")),t.type||n||!t["v-bind"]||(n="(".concat(t["v-bind"],").type")),n){var r=pr(e,"v-if",!0),i=r?"&&(".concat(r,")"):"",o=null!=pr(e,"v-else",!0),s=pr(e,"v-else-if",!0),l=qo(e);zo(l),sr(l,"type","checkbox"),Io(l,a),l.processed=!0,l.if="(".concat(n,")==='checkbox'")+i,Wo(l,{exp:l.if,block:l});var u=qo(e);pr(u,"v-for",!0),sr(u,"type","radio"),Io(u,a),Wo(l,{exp:"(".concat(n,")==='radio'")+i,block:u});var c=qo(e);return pr(c,"v-for",!0),sr(c,":type",n),Io(c,a),Wo(l,{exp:r,block:c}),o?l.else=!0:s&&(l.elseif=s),l}}}},Xo=[Yi,Ui,Zo];var Qo,es,as={model:function(e,a,t){t;var n=a.value,r=a.modifiers,i=e.tag,o=e.attrsMap.type;if(e.component)return mr(e,n,r),!1;if("select"===i)!function(e,a,t){var n=t&&t.number,r='Array.prototype.filter.call($event.target.options,function(o){return o.selected}).map(function(o){var val = "_value" in o ? o._value : o.value;'+"return ".concat(n?"_n(val)":"val","})"),i="$event.target.multiple ? $$selectedVal : $$selectedVal[0]",o="var $$selectedVal = ".concat(r,";");o="".concat(o," ").concat(vr(a,i)),cr(e,"change",o,null,!0)}(e,n,r);else if("input"===i&&"checkbox"===o)!function(e,a,t){var n=t&&t.number,r=dr(e,"value")||"null",i=dr(e,"true-value")||"true",o=dr(e,"false-value")||"false";ir(e,"checked","Array.isArray(".concat(a,")")+"?_i(".concat(a,",").concat(r,")>-1")+("true"===i?":(".concat(a,")"):":_q(".concat(a,",").concat(i,")"))),cr(e,"change","var $$a=".concat(a,",")+"$$el=$event.target,"+"$$c=$$el.checked?(".concat(i,"):(").concat(o,");")+"if(Array.isArray($$a)){"+"var $$v=".concat(n?"_n("+r+")":r,",")+"$$i=_i($$a,$$v);"+"if($$el.checked){$$i<0&&(".concat(vr(a,"$$a.concat([$$v])"),")}")+"else{$$i>-1&&(".concat(vr(a,"$$a.slice(0,$$i).concat($$a.slice($$i+1))"),")}")+"}else{".concat(vr(a,"$$c"),"}"),null,!0)}(e,n,r);else if("input"===i&&"radio"===o)!function(e,a,t){var n=t&&t.number,r=dr(e,"value")||"null";r=n?"_n(".concat(r,")"):r,ir(e,"checked","_q(".concat(a,",").concat(r,")")),cr(e,"change",vr(a,r),null,!0)}(e,n,r);else if("input"===i||"textarea"===i)!function(e,a,t){var n=e.attrsMap.type;0;var r=t||{},i=r.lazy,o=r.number,s=r.trim,l=!i&&"range"!==n,u=i?"change":"range"===n?kr:"input",c="$event.target.value";s&&(c="$event.target.value.trim()");o&&(c="_n(".concat(c,")"));var d=vr(a,c);l&&(d="if($event.target.composing)return;".concat(d));ir(e,"value","(".concat(a,")")),cr(e,u,d,null,!0),(s||o)&&cr(e,"blur","$forceUpdate()")}(e,n,r);else{if(!I.isReservedTag(i))return mr(e,n,r),!1}return!0},text:function(e,a){a.value&&ir(e,"textContent","_s(".concat(a.value,")"),a)},html:function(e,a){a.value&&ir(e,"innerHTML","_s(".concat(a.value,")"),a)}},ts={expectHTML:!0,modules:Xo,directives:as,isPreTag:function(e){return"pre"===e},isUnaryTag:Vi,mustUseProp:sn,canBeLeftOpenTag:qi,isReservedTag:Sn,getTagNamespace:kn,staticKeys:function(e){return e.reduce((function(e,a){return e.concat(a.staticKeys||[])}),[]).join(",")}(Xo)},ns=S((function(e){return v("type,tag,attrsList,attrsMap,plain,parent,children,attrs,start,end,rawAttrsMap"+(e?","+e:""))}));function rs(e,a){e&&(Qo=ns(a.staticKeys||""),es=a.isReservedTag||D,is(e),os(e,!1))}function is(e){if(e.static=function(e){if(2===e.type)return!1;if(3===e.type)return!0;return!(!e.pre&&(e.hasBindings||e.if||e.for||g(e.tag)||!es(e.tag)||function(e){for(;e.parent;){if("template"!==(e=e.parent).tag)return!1;if(e.for)return!0}return!1}(e)||!Object.keys(e).every(Qo)))}(e),1===e.type){if(!es(e.tag)&&"slot"!==e.tag&&null==e.attrsMap["inline-template"])return;for(var a=0,t=e.children.length;a<t;a++){var n=e.children[a];is(n),n.static||(e.static=!1)}if(e.ifConditions)for(a=1,t=e.ifConditions.length;a<t;a++){var r=e.ifConditions[a].block;is(r),r.static||(e.static=!1)}}}function os(e,a){if(1===e.type){if((e.static||e.once)&&(e.staticInFor=a),e.static&&e.children.length&&(1!==e.children.length||3!==e.children[0].type))return void(e.staticRoot=!0);if(e.staticRoot=!1,e.children)for(var t=0,n=e.children.length;t<n;t++)os(e.children[t],a||!!e.for);if(e.ifConditions)for(t=1,n=e.ifConditions.length;t<n;t++)os(e.ifConditions[t].block,a)}}var ss=/^([\w$_]+|\([^)]*?\))\s*=>|^function(?:\s+[\w$]+)?\s*\(/,ls=/\([^)]*?\);*$/,us=/^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['[^']*?']|\["[^"]*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*$/,cs={esc:27,tab:9,enter:13,space:32,up:38,left:37,right:39,down:40,delete:[8,46]},ds={esc:["Esc","Escape"],tab:"Tab",enter:"Enter",space:[" ","Spacebar"],up:["Up","ArrowUp"],left:["Left","ArrowLeft"],right:["Right","ArrowRight"],down:["Down","ArrowDown"],delete:["Backspace","Delete","Del"]},ps=function(e){return"if(".concat(e,")return null;")},fs={stop:"$event.stopPropagation();",prevent:"$event.preventDefault();",self:ps("$event.target !== $event.currentTarget"),ctrl:ps("!$event.ctrlKey"),shift:ps("!$event.shiftKey"),alt:ps("!$event.altKey"),meta:ps("!$event.metaKey"),left:ps("'button' in $event && $event.button !== 0"),middle:ps("'button' in $event && $event.button !== 1"),right:ps("'button' in $event && $event.button !== 2")};function hs(e,a){var t=a?"nativeOn:":"on:",n="",r="";for(var i in e){var o=ms(e[i]);e[i]&&e[i].dynamic?r+="".concat(i,",").concat(o,","):n+='"'.concat(i,'":').concat(o,",")}return n="{".concat(n.slice(0,-1),"}"),r?t+"_d(".concat(n,",[").concat(r.slice(0,-1),"])"):t+n}function ms(e){if(!e)return"function(){}";if(Array.isArray(e))return"[".concat(e.map((function(e){return ms(e)})).join(","),"]");var a=us.test(e.value),t=ss.test(e.value),n=us.test(e.value.replace(ls,""));if(e.modifiers){var r="",i="",o=[],s=function(a){if(fs[a])i+=fs[a],cs[a]&&o.push(a);else if("exact"===a){var t=e.modifiers;i+=ps(["ctrl","shift","alt","meta"].filter((function(e){return!t[e]})).map((function(e){return"$event.".concat(e,"Key")})).join("||"))}else o.push(a)};for(var l in e.modifiers)s(l);o.length&&(r+=function(e){return"if(!$event.type.indexOf('key')&&"+"".concat(e.map(vs).join("&&"),")return null;")}(o)),i&&(r+=i);var u=a?"return ".concat(e.value,".apply(null, arguments)"):t?"return (".concat(e.value,").apply(null, arguments)"):n?"return ".concat(e.value):e.value;return"function($event){".concat(r).concat(u,"}")}return a||t?e.value:"function($event){".concat(n?"return ".concat(e.value):e.value,"}")}function vs(e){var a=parseInt(e,10);if(a)return"$event.keyCode!==".concat(a);var t=cs[e],n=ds[e];return"_k($event.keyCode,"+"".concat(JSON.stringify(e),",")+"".concat(JSON.stringify(t),",")+"$event.key,"+"".concat(JSON.stringify(n))+")"}var gs={on:function(e,a){e.wrapListeners=function(e){return"_g(".concat(e,",").concat(a.value,")")}},bind:function(e,a){e.wrapData=function(t){return"_b(".concat(t,",'").concat(e.tag,"',").concat(a.value,",").concat(a.modifiers&&a.modifiers.prop?"true":"false").concat(a.modifiers&&a.modifiers.sync?",true":"",")")}},cloak:$},ys=function(e){this.options=e,this.warn=e.warn||nr,this.transforms=rr(e.modules,"transformCode"),this.dataGenFns=rr(e.modules,"genData"),this.directives=O(O({},gs),e.directives);var a=e.isReservedTag||D;this.maybeComponent=function(e){return!!e.component||!a(e.tag)},this.onceId=0,this.staticRenderFns=[],this.pre=!1};function bs(e,a){var t=new ys(a),n=e?"script"===e.tag?"null":ws(e,t):'_c("div")';return{render:"with(this){return ".concat(n,"}"),staticRenderFns:t.staticRenderFns}}function ws(e,a){if(e.parent&&(e.pre=e.pre||e.parent.pre),e.staticRoot&&!e.staticProcessed)return Cs(e,a);if(e.once&&!e.onceProcessed)return Ss(e,a);if(e.for&&!e.forProcessed)return Ps(e,a);if(e.if&&!e.ifProcessed)return ks(e,a);if("template"!==e.tag||e.slotTarget||a.pre){if("slot"===e.tag)return function(e,a){var t=e.slotName||'"default"',n=Ts(e,a),r="_t(".concat(t).concat(n?",function(){return ".concat(n,"}"):""),i=e.attrs||e.dynamicAttrs?$s((e.attrs||[]).concat(e.dynamicAttrs||[]).map((function(e){return{name:_(e.name),value:e.value,dynamic:e.dynamic}}))):null,o=e.attrsMap["v-bind"];!i&&!o||n||(r+=",null");i&&(r+=",".concat(i));o&&(r+="".concat(i?"":",null",",").concat(o));return r+")"}(e,a);var t=void 0;if(e.component)t=function(e,a,t){var n=a.inlineTemplate?null:Ts(a,t,!0);return"_c(".concat(e,",").concat(As(a,t)).concat(n?",".concat(n):"",")")}(e.component,e,a);else{var n=void 0,r=a.maybeComponent(e);(!e.plain||e.pre&&r)&&(n=As(e,a));var i=void 0,o=a.options.bindings;r&&o&&!1!==o.__isScriptSetup&&(i=function(e,a){var t=_(a),n=P(t),r=function(r){return e[a]===r?a:e[t]===r?t:e[n]===r?n:void 0},i=r("setup-const")||r("setup-reactive-const");if(i)return i;var o=r("setup-let")||r("setup-ref")||r("setup-maybe-ref");if(o)return o}(o,e.tag)),i||(i="'".concat(e.tag,"'"));var s=e.inlineTemplate?null:Ts(e,a,!0);t="_c(".concat(i).concat(n?",".concat(n):"").concat(s?",".concat(s):"",")")}for(var l=0;l<a.transforms.length;l++)t=a.transforms[l](e,t);return t}return Ts(e,a)||"void 0"}function Cs(e,a){e.staticProcessed=!0;var t=a.pre;return e.pre&&(a.pre=e.pre),a.staticRenderFns.push("with(this){return ".concat(ws(e,a),"}")),a.pre=t,"_m(".concat(a.staticRenderFns.length-1).concat(e.staticInFor?",true":"",")")}function Ss(e,a){if(e.onceProcessed=!0,e.if&&!e.ifProcessed)return ks(e,a);if(e.staticInFor){for(var t="",n=e.parent;n;){if(n.for){t=n.key;break}n=n.parent}return t?"_o(".concat(ws(e,a),",").concat(a.onceId++,",").concat(t,")"):ws(e,a)}return Cs(e,a)}function ks(e,a,t,n){return e.ifProcessed=!0,_s(e.ifConditions.slice(),a,t,n)}function _s(e,a,t,n){if(!e.length)return n||"_e()";var r=e.shift();return r.exp?"(".concat(r.exp,")?").concat(i(r.block),":").concat(_s(e,a,t,n)):"".concat(i(r.block));function i(e){return t?t(e,a):e.once?Ss(e,a):ws(e,a)}}function Ps(e,a,t,n){var r=e.for,i=e.alias,o=e.iterator1?",".concat(e.iterator1):"",s=e.iterator2?",".concat(e.iterator2):"";return e.forProcessed=!0,"".concat(n||"_l","((").concat(r,"),")+"function(".concat(i).concat(o).concat(s,"){")+"return ".concat((t||ws)(e,a))+"})"}function As(e,a){var t="{",n=function(e,a){var t=e.directives;if(!t)return;var n,r,i,o,s="directives:[",l=!1;for(n=0,r=t.length;n<r;n++){i=t[n],o=!0;var u=a.directives[i.name];u&&(o=!!u(e,i,a.warn)),o&&(l=!0,s+='{name:"'.concat(i.name,'",rawName:"').concat(i.rawName,'"').concat(i.value?",value:(".concat(i.value,"),expression:").concat(JSON.stringify(i.value)):"").concat(i.arg?",arg:".concat(i.isDynamicArg?i.arg:'"'.concat(i.arg,'"')):"").concat(i.modifiers?",modifiers:".concat(JSON.stringify(i.modifiers)):"","},"))}if(l)return s.slice(0,-1)+"]"}(e,a);n&&(t+=n+","),e.key&&(t+="key:".concat(e.key,",")),e.ref&&(t+="ref:".concat(e.ref,",")),e.refInFor&&(t+="refInFor:true,"),e.pre&&(t+="pre:true,"),e.component&&(t+='tag:"'.concat(e.tag,'",'));for(var r=0;r<a.dataGenFns.length;r++)t+=a.dataGenFns[r](e);if(e.attrs&&(t+="attrs:".concat($s(e.attrs),",")),e.props&&(t+="domProps:".concat($s(e.props),",")),e.events&&(t+="".concat(hs(e.events,!1),",")),e.nativeEvents&&(t+="".concat(hs(e.nativeEvents,!0),",")),e.slotTarget&&!e.slotScope&&(t+="slot:".concat(e.slotTarget,",")),e.scopedSlots&&(t+="".concat(function(e,a,t){var n=e.for||Object.keys(a).some((function(e){var t=a[e];return t.slotTargetDynamic||t.if||t.for||Bs(t)})),r=!!e.if;if(!n)for(var i=e.parent;i;){if(i.slotScope&&i.slotScope!==Ro||i.for){n=!0;break}i.if&&(r=!0),i=i.parent}var o=Object.keys(a).map((function(e){return xs(a[e],t)})).join(",");return"scopedSlots:_u([".concat(o,"]").concat(n?",null,true":"").concat(!n&&r?",null,false,".concat(function(e){var a=5381,t=e.length;for(;t;)a=33*a^e.charCodeAt(--t);return a>>>0}(o)):"",")")}(e,e.scopedSlots,a),",")),e.model&&(t+="model:{value:".concat(e.model.value,",callback:").concat(e.model.callback,",expression:").concat(e.model.expression,"},")),e.inlineTemplate){var i=function(e,a){var t=e.children[0];0;if(t&&1===t.type){var n=bs(t,a.options);return"inlineTemplate:{render:function(){".concat(n.render,"},staticRenderFns:[").concat(n.staticRenderFns.map((function(e){return"function(){".concat(e,"}")})).join(","),"]}")}}(e,a);i&&(t+="".concat(i,","))}return t=t.replace(/,$/,"")+"}",e.dynamicAttrs&&(t="_b(".concat(t,',"').concat(e.tag,'",').concat($s(e.dynamicAttrs),")")),e.wrapData&&(t=e.wrapData(t)),e.wrapListeners&&(t=e.wrapListeners(t)),t}function Bs(e){return 1===e.type&&("slot"===e.tag||e.children.some(Bs))}function xs(e,a){var t=e.attrsMap["slot-scope"];if(e.if&&!e.ifProcessed&&!t)return ks(e,a,xs,"null");if(e.for&&!e.forProcessed)return Ps(e,a,xs);var n=e.slotScope===Ro?"":String(e.slotScope),r="function(".concat(n,"){")+"return ".concat("template"===e.tag?e.if&&t?"(".concat(e.if,")?").concat(Ts(e,a)||"undefined",":undefined"):Ts(e,a)||"undefined":ws(e,a),"}"),i=n?"":",proxy:true";return"{key:".concat(e.slotTarget||'"default"',",fn:").concat(r).concat(i,"}")}function Ts(e,a,t,n,r){var i=e.children;if(i.length){var o=i[0];if(1===i.length&&o.for&&"template"!==o.tag&&"slot"!==o.tag){var s=t?a.maybeComponent(o)?",1":",0":"";return"".concat((n||ws)(o,a)).concat(s)}var l=t?function(e,a){for(var t=0,n=0;n<e.length;n++){var r=e[n];if(1===r.type){if(Os(r)||r.ifConditions&&r.ifConditions.some((function(e){return Os(e.block)}))){t=2;break}(a(r)||r.ifConditions&&r.ifConditions.some((function(e){return a(e.block)})))&&(t=1)}}return t}(i,a.maybeComponent):0,u=r||Ls;return"[".concat(i.map((function(e){return u(e,a)})).join(","),"]").concat(l?",".concat(l):"")}}function Os(e){return void 0!==e.for||"template"===e.tag||"slot"===e.tag}function Ls(e,a){return 1===e.type?ws(e,a):3===e.type&&e.isComment?function(e){return"_e(".concat(JSON.stringify(e.text),")")}(e):"_v(".concat(2===(t=e).type?t.expression:Ds(JSON.stringify(t.text)),")");var t}function $s(e){for(var a="",t="",n=0;n<e.length;n++){var r=e[n],i=Ds(r.value);r.dynamic?t+="".concat(r.name,",").concat(i,","):a+='"'.concat(r.name,'":').concat(i,",")}return a="{".concat(a.slice(0,-1),"}"),t?"_d(".concat(a,",[").concat(t.slice(0,-1),"])"):a}function Ds(e){return e.replace(/\u2028/g,"\\u2028").replace(/\u2029/g,"\\u2029")}new RegExp("\\b"+"do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,super,throw,while,yield,delete,export,import,return,switch,default,extends,finally,continue,debugger,function,arguments".split(",").join("\\b|\\b")+"\\b"),new RegExp("\\b"+"delete,typeof,void".split(",").join("\\s*\\([^\\)]*\\)|\\b")+"\\s*\\([^\\)]*\\)");function Ms(e,a){try{return new Function(e)}catch(t){return a.push({err:t,code:e}),$}}function Es(e){var a=Object.create(null);return function(t,n,r){(n=O({},n)).warn;delete n.warn;var i=n.delimiters?String(n.delimiters)+t:t;if(a[i])return a[i];var o=e(t,n);var s={},l=[];return s.render=Ms(o.render,l),s.staticRenderFns=o.staticRenderFns.map((function(e){return Ms(e,l)})),a[i]=s}}var Fs,Ns,js=(Fs=function(e,a){var t=Go(e.trim(),a);!1!==a.optimize&&rs(t,a);var n=bs(t,a);return{ast:t,render:n.render,staticRenderFns:n.staticRenderFns}},function(e){function a(a,t){var n=Object.create(e),r=[],i=[];if(t)for(var o in t.modules&&(n.modules=(e.modules||[]).concat(t.modules)),t.directives&&(n.directives=O(Object.create(e.directives||null),t.directives)),t)"modules"!==o&&"directives"!==o&&(n[o]=t[o]);n.warn=function(e,a,t){(t?i:r).push(e)};var s=Fs(a.trim(),n);return s.errors=r,s.tips=i,s}return{compile:a,compileToFunctions:Es(a)}}),Rs=js(ts).compileToFunctions;function Hs(e){return(Ns=Ns||document.createElement("div")).innerHTML=e?'<a href="\n"/>':'<div a="\n"/>',Ns.innerHTML.indexOf("&#10;")>0}var Gs=!!K&&Hs(!1),Is=!!K&&Hs(!0),zs=S((function(e){var a=An(e);return a&&a.innerHTML})),Ws=Vt.prototype.$mount;Vt.prototype.$mount=function(e,a){if((e=e&&An(e))===document.body||e===document.documentElement)return this;var t=this.$options;if(!t.render){var n=t.template;if(n)if("string"==typeof n)"#"===n.charAt(0)&&(n=zs(n));else{if(!n.nodeType)return this;n=n.innerHTML}else e&&(n=function(e){if(e.outerHTML)return e.outerHTML;var a=document.createElement("div");return a.appendChild(e.cloneNode(!0)),a.innerHTML}(e));if(n){0;var r=Rs(n,{outputSourceRange:!1,shouldDecodeNewlines:Gs,shouldDecodeNewlinesForHref:Is,delimiters:t.delimiters,comments:t.comments},this),i=r.render,o=r.staticRenderFns;t.render=i,t.staticRenderFns=o}}return Ws.call(this,e,a)},Vt.compile=Rs;t(9669);const Ys=JSON.parse('[["Losaria coon","Common Clubtail"],["Losaria rhodifer","Andaman Clubtail"],["Pachliopta aristolochiae","Common Rose"],["Pachliopta hector","Crimson Rose"],["Pachliopta pandiyana","Malabar Rose"],["Troides aeacus","Golden Birdwing"],["Troides helena","Common Birdwing"],["Troides minos","Southern Birdwing"],["Atrophaneura aidoneus","Lesser Batwing"],["Atrophaneura varuna","Common Batwing"],["Byasa crassipes","Black Windmill"],["Byasa dasarada","Great Windmill"],["Byasa latreillei","Rose Windmill"],["Byasa nevilli","Nevill\'s Windmill"],["Byasa plutonius","Chinese Windmill"],["Byasa polla","de Niceville\'s Windmill"],["Byasa polyeuctes","Common Windmill"],["Papilio agestor","Tawny Mime"],["Papilio alcmenor","Redbreast"],["Papilio arcturus","Blue Peacock"],["Papilio bianor","Common Peacock"],["Papilio bootes","Tailed Redbreast"],["Papilio buddha","Malabar Banded Peacock"],["Papilio castor","Common Raven"],["Papilio clytia","Common Mime"],["Papilio crino","Common Banded Peacock"],["Papilio demoleus","Lime Butterfly"],["Papilio dravidarum","Malabar Raven"],["Papilio elephenor","Yellow-crested Spangle"],["Papilio epycides","Lesser Mime"],["Papilio helenus","Red Helen"],["Papilio krishna","Krishna Peacock"],["Papilio liomedon","Malabar Banded Swallowtail"],["Papilio machaon","Common Yellow Swallowtail"],["Papilio mayo","Andaman Mormon"],["Papilio memnon","Great Mormon"],["Papilio nephelus","Yellow Helen"],["Papilio paradoxa","Great Blue Mime"],["Papilio paris","Paris Peacock"],["Papilio polymnestor","Blue Mormon"],["Papilio polytes","Common Mormon"],["Papilio prexaspes","Andaman Helen"],["Papilio protenor","Spangle"],["Papilio slateri","Blue-striped Mime"],["Papilio xuthus","Chinese Yellow Swallowtail"],["Graphium adonarensis","Cryptic Bluebottle"],["Graphium agamemnon","Tailed Jay"],["Graphium agetes","Fourbar Swordtail"],["Graphium albociliatis","Scarce Jay"],["Graphium antiphates","Fivebar Swordtail"],["Graphium aristeus","Chain Swordtail"],["Graphium arycles","Spotted Jay"],["Graphium chironides","Veined Jay"],["Graphium cloanthus","Glassy Bluebottle"],["Graphium doson","Common Jay"],["Graphium epaminondas","Andaman Swordtail"],["Graphium eurous","Sixbar Swordtail"],["Graphium eurypylus","Great Jay"],["Graphium macareus","Lesser Zebra"],["Graphium mandarinus","Spectacle Swordtail"],["Graphium megarus","Spotted Zebra"],["Graphium nomius","Spot Swordtail"],["Graphium sarpedon","Common Bluebottle"],["Graphium teredon","Southern Bluebottle"],["Graphium xenocles","Great Zebra"],["Lamproptera curius","White Dragontail"],["Lamproptera meges","Green Dragontail"],["Meandrusa lachinus","Brown Gorgon"],["Meandrusa payeni","Yellow Gorgon"],["Teinopalpus imperialis","Kaiser-i-Hind"],["Bhutanitis lidderdalii","Bhutan Glory"],["Bhutanitis ludlowi","Ludlow\'s Bhutan Glory"],["Parnassius (Parnassius)",""],["Parnassius (Parnassius)","Common Red Apollo"],["Parnassius (Parnassius)","Keeled Apollo"],["Parnassius (Parnassius)","Large Keeled Apollo"],["Parnassius (Kailasus)","Regal Apollo"],["Parnassius (Kailasius)","Stately Apollo"],["Parnassius (Kailasius)","augustus Fruhstorfer, 1903 Noble Apollo"],["Parnassius (Kailasius)","Dusky Apollo"],["Parnassius (Koramius)","hunza Grum-Grshimailo, 1888 Karakoram Banded Apollo"],["Parnassius (Koramius)","mamaievi Bang-Haas, 1915 Scarce Banded Apollo"],["Parnassius (Koramius)","Greater Banded Apollo"],["Parnassius (Koramius)","Lesser Banded Apollo"],["Parnassius (Koramius)","Himalayan Banded Apollo"],["Parnassius (Tadumia)","Varnished Apollo"],["Parnassius (Tadumia)","Royal Apollo"],["Parnassius (Lingamius)","Common Blue Apollo"],["Parnassius (Kreizbergia)","Black-edged Apollo"],["Badamia exclamationis","Brown Awl"],["Bibasis iluska","Slate Awlet"],["Bibasis sena","Orange-tailed Awlet"],["Burara amara","Small Green Awlet"],["Burara anadi","Plain Orange Awlet"],["Burara etelka","Great Orange Awlet"],["Burara gomata","Pale Green Awlet"],["Burara harisa","Orange Striped Awlet"],["Burara jaina","Orange Awlet"],["Burara oedipodea","Branded Orange Awlet"],["Burara vasutana","Green Awlet"],["Hasora anura","Slate Awl"],["Hasora badra","Common Awl"],["Hasora chromus","Common Banded Awl"],["Hasora danda","Purple Awl"],["Hasora khoda","Large Banded Awl"],["Hasora leucospila","Violet Awl"],["Hasora schoenherr","Yellow Banded Awl"],["Hasora taminatus","White Banded Awl"],["Hasora vitta","Plain Banded Awl"],["Choaspes benjaminii","Indian Awlking"],["Choaspes furcatus","Hooked Awlking"],["Choaspes stigmatus","Branded Awlking"],["Choaspes xanthopogon","Similar Awlking"],["Lobocla liliana","Marbled Flat"],["Capila jayadeva","Striped Dawnfly"],["Capila lidderdali","Lidderdale\'s Dawnfly"],["Capila pennicillatum","Fringed Dawnfly"],["Capila phanaeus","Fulvous Dawnfly"],["Capila pieridoides","White Dawnfly"],["Capila zennara","Pale Striped Dawnfly"],["Tapena thwaitesi","Black Angle"],["Darpa hanria","Hairy Angle"],["Darpa pteria","Snowy Angle"],["Darpa striata","Striated Angle"],["Odina decoratus","Zigzag Flat"],["Coladenia agni","Brown Pied Flat"],["Coladenia agnioides","Elwes\'s Pied Flat"],["Coladenia indrani","Tricolour Pied Flat"],["Coladenia laxmi","Grey Pied Flat"],["Satarupa gopala","Large White Flat"],["Satarupa splendens","Splendid White Flat"],["Satarupa zulla","Tytler\'s White Flat"],["Seseria dohertyi","Himalayan White Flat"],["Seseria sambara","Sikkim White Flat"],["Pintara tabrica","Crenulate Orange Flat"],["Chamunda chamunda","Olive Flat"],["Gerosis bhagava","Common Yellow-breast Flat"],["Gerosis phisara","Dusky Yello-w-breast Flat"],["Gerosis sinica","White Yellow -breast Flat"],["Tagiades calligana","Malayan Snow Flat"],["Tagiades cohaerens","Striped Snow Flat"],["Tagiades gana","Large Snow Flat"],["Tagiades japetus","Suffused Snow Flat"],["Tagiades menaka","Spotted Snow Flat"],["Tagiades parra","Common Snow Flat"],["Tagiades litigiosa","Water Snow Flat"],["Mooreana trichoneura","Yellow Flat"],["Ctenoptilum multiguttata","Multispot Angle"],["Ctenoptilum vasava","Tawny Angle"],["Odontoptilum angulatum","Chestnut Angle"],["Caprona agama","Spotted Angle"],["Caprona alida","Evans\' Angle"],["Caprona ransonnetii","Golden Angle"],["Celaenorrhinus ambareesa","Malabar Flat"],["Celaenorrhinus andamanicus","Andaman Yellow-banded Flat"],["Celaenorrhinus asmara","White Banded Flat"],["Celaenorrhinus aspersa","Large Streaked Flat"],["Celaenorrhinus aurivittatus","Dark Yellow -banded Flat"],["Celaenorrhinus badius","Scarce Banded Flat"],["Celaenorrhinus dhanada","Himalayan Yellow-banded Flat"],["Celaenorrhinus ficulnea","Velvet Flat"],["Celaenorrhinus flavicincta","Bhutan Flat"],["Celaenorrhinus leucocera","Common Spotted Flat"],["Celaenorrhinus morena","Evans\' Spotted Flat"],["Celaenorrhinus munda","Himalayan Spotted Flat"],["Celaenorrhinus nigricans","Small Banded Flat"],["Celaenorrhinus patula","Large Spotted Flat"],["Celaenorrhinus pero","Mussoorie Spotted Flat"],["Celaenorrhinus plagifera","de Niceville\'s Spotted Flat"],["Celaenorrhinus pulomaya","Multi-spotted Flat"],["Celaenorrhinus putra","Bengal Spotted Flat"],["Celaenorrhinus pyrrha","Double Spotted Flat"],["Celaenorrhinus ratna","Tytler\'s Multi-spotted Flat"],["Celaenorrhinus ruficornis","Tamil Spotted Flat"],["Celaenorrhinus sumitra","Moore\'s Spotted Flat"],["Celaenorrhinus tibetanus","Tibet Flat"],["Celaenorrhinus zea","Swinhoe\'s Flat"],["Pseudocoladenia dan","Fulvous Pied Flat"],["Pseudocoladenia fatua","Sikkim Pied Flat"],["Pseudocoladenia festa","Naga Pied Flat"],["Sarangesa purendra","Spotted Small Flat"],["Sarangesa dasahara","Common Small Flat"],["Gomalia elma","African Marbled Skipper"],["Carcharodus alceae","Plain Marbled Skipper"],["Carcharodus dravira","Tufted Marbled Skipper"],["Spialia doris","Sind Skipper"],["Spialia galba","Indian Skipper"],["Spialia orbifer","Brick Skipper"],["Erynnis pathan","Inky Skipper"],["Pyrgus alpinus","Mountain Skipper"],["Pyrgus cashmirensis","Kashmir Skipper"],["Carterocephalus avanti","Orange-and-silver Hopper"],["Ochus subvittatus","Tiger Hopper"],["Baracus vittatus","Hedge Hopper"],["Ampittia dioscorides","Bush Hopper"],["Ampittia maroides","Scarce Bush Hopper"],["Aeromachus dubius","Dingy Scrub Hopper"],["Aeromachus jhora","Grey Scrub Hopper"],["Aeromachus kali","Blue-spotted Scrub Hopper"],["Aeromachus pygmaeus","Pigmy Scrub Hopper"],["Aeromachus stigmatus","Veined Scrub Hopper"],["Sebastonyma dolopia","Tufted Ace"],["Sovia grahami","Graham\'s Ace"],["Sovia hyrtacus","White-branded Ace"],["Sovia lucasii","Lucas\' Ace."],["Sovia malta","Manipur Ace"],["Sovia separata","Chequered Ace"],["Pedesta masuriensis","Mussoorie Bush Bob"],["Pedesta panda","Naga Bush Bob"],["Pedesta pandita","Brown Bush Bob"],["Thoressa aina","Garhwal Ace"],["Thoressa astigmata","Southern Spotted Ace"],["Thoressa cerata","Northern Spotted Ace"],["Thoressa evershedi","Evershed\'s Ace"],["Thoressa fusca","Fuscous Ace"],["Thoressa gupta","Olive Ace"],["Thoressa honorei","Madras Ace"],["Thoressa hyrie","Largespot Plain Ace"],["Thoressa masoni","Mason\'s Ace"],["Thoressa sitala","Tamil Ace"],["Halpe arcuata","Evans\' Ace"],["Halpe filda","Elwes\'s Ace"],["Halpe flava","Tavoy Sulphur Ace"],["Halpe hauxwelli","Hauxwell\'s Ace"],["Halpe homolea","Indian Ace"],["Halpe knyvetti","Knyvett\'s Ace"],["Halpe kumara","Plain Ace"],["Halpe kusala","Tenasserim Ace"],["Halpe porus","Moore\'s Ace"],["Halpe sikkima","Sikkim Ace"],["Halpe wantona","Confusing Ace"],["Halpe zema","Banded Ace"],["Halpe zola","Long-banded Ace"],["Pithauria marsena","Branded Straw Ace"],["Pithauria murdava","Dark Straw Ace"],["Pithauria stramineipennis","Light Straw Ace"],["Apostictopterus fuliginosus","Giant Hopper"],["Astictopterus jama","Forest Hopper"],["Arnetta atkinsoni","Atkinson\'s Bob"],["Arnetta mercara","Coorg Forest Bob"],["Arnetta vindhiana","Vindhyan Bob"],["Actinor radians","Veined Dart"],["Iambrix salsala","Chestnut Bob"],["Koruthaialos butleri","Dark Velvet Bob"],["Koruthaialos rubecula","Narrow-banded Velvet Bob"],["Koruthaialos sindu","Bright Red Velvet Bob"],["Psolos fuligo","Coon"],["Stimula swinhoei","Watson\'s Demon"],["Ancistroides nigrita","Chocolate Demon"],["Notocrypta curvifascia","Restricted Demon"],["Notocrypta feisthamelii","Spotted Demon"],["Notocrypta paralysos","Common Banded Demon"],["Udaspes folus","Grass Demon"],["Scobura cephala","Forest Bob"],["Scobura cephaloides","Large Forest Bob"],["Scobura isota","Swinhoe\'s Forest Bob"],["Scobura phiditia","Malay Forest Bob"],["Scobura tytleri","Tytler\'s Forest Bob"],["Scobura woolletti","Wollett\'s Forest Bob"],["Suada swerga","Grass Bob"],["Suastus gremius","Indian Palm Bob"],["Suastus minutus","Ceylon Palm Bob"],["Cupitha purreea","Wax Dart"],["Zographetus ogygia","Purple-spotted Flitter"],["Zographetus rama","Small Flitter"],["Zographetus satwa","Purple-and-gold Flitter"],["Hyarotis adrastus","Tree Flitter"],["Hyarotis microstictum","Brush Flitter"],["Quedara basiflava","Golden Flitter"],["Quedara monteithi","Dubious Flitter"],["Isma bonota","Assam Lancer"],["Plastingia naga","Silver-spotted Lancer"],["Salanoemia fuscicornis","Purple Lancer"],["Salanoemia noemi","Spotted Yellow Lancer"],["Salanoemia sala","Maculate Lancer"],["Salanoemia tavoyana","Yellow-streaked Lancer"],["Pyroneura margherita","Assamese Yellow-vein Lancer"],["Pyroneura niasana","Red-vein Lancer"],["Lotongus sarala","Yellowband Palmer"],["Zela zeus","Redeye Palmer"],["Gangara lebadea","Banded Redeye"],["Gangara thyrsis","Giant Redeye"],["Erionota hiraca","Andaman Redeye"],["Erionota thrax","Palm Redeye"],["Erionota torus","Banana Skipper"],["Matapa aria","Common Redeye"],["Matapa cresta","Darkbrand Redeye"],["Matapa druna","Greybrand Redeye"],["Matapa purpurascens","Purple Redeye"],["Matapa sasivarna","Black-veined Redeye"],["Pudicitia pholus","Spotted Redeye"],["Unkana ambasa","Hoary Palmer"],["Hidari bhawani","Veined Palmer"],["Pirdana hyela","Green-striped Palmer"],["Pirdana distanti","Plain Green Palmer"],["Creteus cyrina","Nonsuch Palmer"],["Gegenes nostrodamus","Dingy Swift"],["Gegenes pumilio","Pygmy Swift"],["Parnara ganga","Evans\' Swift"],["Parnara guttatus","Straight Swift"],["Parnara bada","Ceylon Swift"],["Borbo bevani","Bevan\'s Swift"],["Borbo cinnara","Rice Swift"],["Pelopidas agna","Obscure Branded Swift"],["Pelopidas conjuncta","Conjoined Swift"],["Pelopidas mathias","Variable Swift"],["Pelopidas sinensis","Large Branded Swift"],["Pelopidas subochracea","Moore\'s Swift"],["Pelopidas thrax","Small Branded Swift"],["Polytremis discreta","Himalayan Swift"],["Polytremis eltola","Yellow Spot Swift"],["Polytremis lubricans","Contiguous Swift"],["Polytremis minuta","Baby Swift Assam; Manipur."],["Baoris chapmani","Small Paintbrush Swift"],["Baoris farri","Paintbrush Swift"],["Baoris pagana","Figure of Eight Swift"],["Baoris unicolor","Black Paintbrush Swift"],["Caltoris aurociliata","Yellow Fringed Swift"],["Caltoris bromus","Leech\'s Swift"],["Caltoris brunnea","Dark-branded Swift"],["Caltoris cahira","Colon Swift"],["Caltoris canaraica","Canara Swift"],["Caltoris confusa","Confusing Swift"],["Caltoris cormasa","Full-stop Swift"],["Caltoris kumara","Blank Swift"],["Caltoris philippina","Philippine Swift"],["Caltoris plebeia","Tufted Swift"],["Caltoris sirius","Sirius Swift"],["Caltoris tulsi","Purple Swift"],["Iton semamora","Common Wight"],["Taractocera ceramas","Tamil Grassdart"],["Taractocera danna","Himalayan Grass Dart"],["Taractocera maevius","Common Grass Dart"],["Oriens concinna","Tamil Dartlet"],["Oriens gola","Common Dartlet"],["Oriens goloides","Ceylon Dartlet"],["Oriens paragola","Malay Dartlet"],["Potanthus confucius","Chinese Dart"],["Potanthus dara","Himalayan Dart"],["Potanthus ganda","Sumatran Dart"],["Potanthus flavus","Japanese Dart"],["Potanthus hetaerus","Large Dart"],["Potanthus juno","Burmese Dart"],["Potanthus lydia","Forest Dart"],["Potanthus mara","Sikkim Dart"],["Potanthus mingo","Narrow Bi-dent Dart"],["Potanthus nesta","Brandless Dart"],["Potanthus pallidus","Pale Dart"],["Potanthus palnia","Palni Dart"],["Potanthus pava","Yellow Dart"],["Potanthus pseudomaesa","Indian Dart"],["Potanthus rectifasciata","Branded Dart"],["Potanthus sita","Yellow-and-black Dart"],["Potanthus trachala","Broad Bi-dent Dart"],["Telicota augias","Pale Palm Dart"],["Telicota bambusae","Dark Palm Dart Throughout"],["Telicota besta","Large Palm Dart"],["Telicota colon","Common Palm Dart"],["Telicota linna","Evans\' Palm Dart"],["Telicota ohara","Crested Palm Dart"],["Cephrenes acalle","Plain Palm Dart"],["Hesperia comma","Chequered Darter"],["Ochlodes brahma","Himalayan Darter"],["Ochlodes siva","Assam Darter"],["Ochlodes subhyalina","Sub-hyaline Darter"],["Catopsilia pomona","Common Emigrant"],["Catopsilia pyranthe","Mottled Emigrant"],["Dercas verhuelli","Tailed Sulphur"],["Dercas lycorias","Plain Sulphur"],["Gonepteryx amintha","Chinese Brimstone"],["Gonepteryx chitralensis","Karakoram Brimstone"],["Gonepteryx mahaguru","Lesser Brimstone"],["Gonepteryx nepalensis","Himalayan Brimstone"],["Gandaca harina","Tree Yellow"],["Eurema andersoni","One-spot Grass Yellow"],["Eurema blanda","Three-spot Grass Yellow"],["Eurema brigitta","Small Grass Yellow"],["Eurema hecabe","Common Grass Yellow"],["Eurema laeta","Spotless Grass Yellow"],["Eurema nilgiriensis","Nilgiri Grass Yellow"],["Eurema simulatrix","Scarce Grass Yellow"],["Colias cocandica","Pamir Clouded Yellow"],["Colias dubia","Dwarf Clouded Yellow"],["Colias eogene","Fiery Clouded Yellow"],["Colias erate","Pale Clouded Yellow"],["Colias fieldi","Dark Clouded Yellow"],["Colias ladakensis","Ladak Clouded Yellow"],["Colias leechi","Glaucous Clouded Yellow"],["Colias marcopolo","Marcopolo\'s Clouded Yellow"],["Colias nilagiriensis","Nilgiri Clouded Yellow"],["Colias stoliczkana","Orange Clouded Yellow"],["Colias thrasibulus","Lemon Clouded Yellow"],["Colias wiskotti","Broad-bordered Clouded Yellow"],["Leptosia nina","Psyche"],["Baltia butleri","Butler\'s Dwarf"],["Baltia shawii","Shaw\'s Dwarf"],["Baltia sikkima","Sikkim Dwarf"],["Mesapia peloria","Thibet Blackvein"],["Aporia agathon","Great Blackvein"],["Aporia harrietae","Bhutan Blackvein"],["Aporia leucodice","Baluchi Blackvein"],["Aporia nabellica","Dusky Blackvein"],["Aporia soracta","Himalayan Blackvein"],["Pieris ajaka","Himalayan White"],["Pieris brassicae","Large Cabbage White"],["Pieris canidia","Indian Cabbage White"],["Pieris deota","Kashmir White"],["Pieris dubernardi","Chumbi White"],["Pieris extensa","Bhutan White"],["Pieris krueperi","Green Banded White"],["Pieris melete","Western Black-Veined White"],["Pieris rapae","Small Cabbage White"],["Talbotia naganum","Naga White"],["Pontia callidice","Lofty Bath White"],["Pontia chloridice","Lesser Bath White"],["Pontia daplidice","Bath White"],["Pontia glauconome","Desert Bath White"],["Pontia sherpae","Sherpa White"],["Ixias marianne","White Orange Tip"],["Ixias pyrene","Yellow Orange Tip"],["Colotis amata","Small Salmon Arab"],["Colotis aurora","Plain Orange Tip"],["Colotis danae","Crimson Tip"],["Colotis etrida","Little Orange Tip"],["Colotis fausta","Large Salmon Arab"],["Colotis phisadia","White Arab"],["Colotis protractus","Blue Spotted Arab"],["Appias albina","Common Albatross"],["Appias indra","Plain Puffin"],["Appias lalage","Spot Puffin"],["Appias libythea","Striped Albatross"],["Appias lyncida","Chocolate Albatross"],["Appias nero","Orange Albatross"],["Appias paulina","Lesser Albatross"],["Appias wardi","Indian Albatross"],["Saletara liberia","Nicobar Albatross"],["Prioneris philonome","Redspot Sawtooth"],["Prioneris sita","Painted Sawtooth"],["Prioneris thestylis","Spotted Sawtooth"],["Belenois aurota","Pioneer"],["Cepora nadina","Lesser Gull"],["Cepora nerissa","Common Gull"],["Delias acalis","Redbreast Jezabel"],["Delias agostina","Yellow Jezabel"],["Delias belladonna","Hill Jezabel"],["Delias berinda","Dark Jezabel"],["Delias descombesi","Redspot Jezabel"],["Delias eucharis","Common Jezabel"],["Delias hyparete","Painted Jezabel"],["Delias lativitta","Broadwing Jezabel"],["Delias sanaca","Pale Jezabel"],["Delias pasithoe","Redbase Jezabel"],["Euchloe daphalis","Little White"],["Pareronia avatar","Pale Wanderer"],["Pareronia ceylanica","Dark Wanderer"],["Pareronia valeria","Common Wanderer"],["Hebomoia glaucippe","Great Orange Tip"],["Zemeros flegyas","Punchinello"],["Dodona adonira","Striped Punch"],["Dodona dipoea","Lesser Punch"],["Dodona durga","Common Punch"],["Dodona egeon","Orange Punch"],["Dodona eugenes","Tailed Punch"],["Dodona longicaudata","Long-tailed Punch"],["Dodona ouida","Mixed Punch"],["Abisara abnormis","Abnormal Judy"],["Abisara attenuata","Short Tailed Judy"],["Abisara bifasciata","Twospot Plum Judy"],["Abisara burnii","Burn\'s Judy"],["Abisara chela","Spot Judy"],["Abisara echerius","Plum Judy"],["Abisara fylla","Dark Judy"],["Abisara neophron","Tailed Judy"],["Abisara saturata","Malayan Plum Judy"],["Taxila haquinus","Harlequin"],["Stiboges nymphidia","Columbine"],["Curetis acuta","Angled Sunbeam"],["Curetis bulis","Bright Sunbeam"],["Curetis naga","Naga Sunbeam"],["Curetis saronis","Burmese Sunbeam"],["Curetis siva","Siva Sunbeam"],["Curetis thetis","Indian Sunbeam"],["Poritia erycinoides","Blue Gem"],["Poritia hewitsoni","Common Gem"],["Simiskina phalena","Broad-banded Brilliant"],["Liphyra brassolis","Moth Butterfly"],["Allotinus drumila","Great Darkie"],["Allotinus subviolaceus","Blue Darkie"],["Allotinus unicolor","Common Darkie"],["Allotinus taras","Brown-tipped Darkie"],["Logania distanti","Dark Mottle"],["Logania marmorata","Pale Mottle"],["Logania watsoniana","Watson\'s Mottle"],["Miletus chinensis","Common Brownie"],["Miletus symethus","Great Brownie"],["Taraka hamada","Forest Pierrot"],["Spalgis baiongus","Assam Apefly"],["Spalgis epius","Common Apefly"],["Lycaena kasyapa","Green Copper"],["Lycaena panava","White-bordered Copper"],["Lycaena phlaeas","Common Copper"],["Thersamonia aditya","Ladakh Copper"],["Heliophorus androcles","Green Sapphire"],["Heliophorus bakeri","Western Blue Sapphire"],["Heliophorus brahma","Golden Sapphire"],["Heliophorus epicles","Purple Sapphire"],["Heliophorus hybrida","Hybrid Sapphire"],["Heliophorus ila","Restricted Purple Sapphire"],["Heliophorus indicus","Indian Purple Sapphire"],["Heliophorus kohimensis","Naga Sapphire"],["Heliophorus moorei","Azure Sapphire"],["Heliophorus oda","Eastern Blue Sapphire"],["Heliophorus sena","Sorrel Sapphire"],["Heliophorus tamu","Powdery Green Sapphire"],["Apharitis acamas","Tawny Silverline"],["Apharitis lilacinus","Lilac Silverline"],["Spindasis abnormis","Abnormal Silverline"],["Spindasis elima","Scarce Shot Silverline"],["Spindasis elwesi","Elwes\' Silverline"],["Spindasis evansii","Cinnamon Silverline"],["Spindasis ictis","Common Shot Silverline"],["Spindasis lohita","Long-banded Silverline"],["Spindasis nipalicus","Silvergrey Silverline"],["Spindasis rukma","Obscure Silverline"],["Spindasis rukmini","Khaki Silverline"],["Spindasis schistacea","Plumbeous Silverline"],["Spindasis syama","Club Silverline"],["Spindasis vulcanus","Common Silverline"],["Chaetoprocta kurumi","Nepal Walnut Blue"],["Chaetoprocta odata","Walnut Blue"],["Euaspa milionia","Water Hairstreak"],["Euaspa miyashitai","Darjeeling Hairstreak"],["Euaspa mikamii","Arunachal Hairstreak"],["Euaspa pavo","Peacock Hairstreak"],["Shizuyaozephyrus ziha","White-spotted Hairstreak"],["Fujiokaozephyrus tsangkie","Suroifui Hairstreak"],["Iwaseozephyrus mandara","Indian Purple Hairstreak"],["Esakiozephyrus icana","Dull Green Hairstreak"],["Chrysozephyrus disparatus","Howarth\'s Green Hairstreak"],["Chrysozephyrus duma","Metallic Green Hairstreak"],["Chrysozephyrus dumoides","Broad-bordered Green Hairstreak"],["Chrysozephyrus intermedius","Intermediate Green Hairstreak"],["Chrysozephyrus kabrua","Kabru Green Hairstreak"],["Chrysozephyrus sandersi","Sanders\' Green Hairstreak"],["Chrysozephyrus sikkimensis","Sikkim Green Hairstreak"],["Chrysozephyrus tytleri","Manipur Green Hairstreak"],["Chrysozephyrus vittatus","Tytler\'s Green Hairstreak"],["Chrysozephyrus zoa","Powdered Green Hairstreak"],["Neozephyrus suroia","Cerulean Hairstreak"],["Shirozuozephyrus bhutanensis","Bhutan Hairstreak"],["Shirozuozephyrus birupa","Fawn Hairstreak"],["Shirozuozephyrus jakamensis","Jakama Hairstreak"],["Shirozuozephyrus khasia","Tailless Metallic Green Hairstreak"],["Shirozuozephyrus kirbariensis","Kirbari Hairstreak"],["Shirozuozephyrus paona","Paona Hairstreak"],["Shirozuozephyrus triloka","Kumaon Hairstreak"],["Inomataozephyrus assamicus","Assam Hairstreak"],["Inomataozephyrus syla","Silver Hairstreak"],["Thermozephyrus ataxus","Wonderful Hairstreak"],["Leucantigius atayalicus","Pale Hairstreak"],["Amblopala avidiena","Chinese Hairstreak"],["Arhopala aberrans","Pale Bushblue"],["Arhopala abseus","Aberrant Bushblue"],["Arhopala ace","Tytler\'s Dull Oakblue"],["Arhopala aeeta","Dawnas Tailless Oakblue"],["Arhopala alea","Kanara Oakblue"],["Arhopala allata","Tytler\'s Rosy Oakblue"],["Arhopala agrata","de Niceville\'s Dull Oakblue"],["Arhopala alax","Silky Oakblue"],["Arhopala alesia","Pallid Oakblue"],["Arhopala amantes","Large Oakblue"],["Arhopala ammonides","Dark Bushblue"],["Arhopala anarte","Magnificient Oakblue"],["Arhopala arvina","Purple-brown Tailless Oakblue"],["Arhopala asinarus","Broad-banded Oakblue"],["Arhopala asopia","Plain Tailless Oakblue"],["Arhopala athada","Vinous Oakblue"],["Arhopala atrax","Indian Oakblue"],["Arhopala aurelia","Grey-washed Oakblue"],["Arhopala bazaloides","Tamil Oakblue"],["Arhopala bazalus","Powdered Oakblue"],["Arhopala belphoebe","Doherty\'s Oakblue"],["Arhopala birmana","Burmese Bushblue"],["Arhopala camdeo","Lilac Oakblue"],["Arhopala centaurus","Centaur Oakblue"],["Arhopala comica","Comic Oakblue"],["Arhopala curiosa","Bhutan Oakblue"],["Arhopala democritus","White-spotted Oakblue"],["Arhopala dispar","Frosted Oakblue"],["Arhopala dodonea","Pale Himalayan Oakblue"],["Arhopala eumolphus","Green Oakblue"],["Arhopala fulla","Spotless Oakblue"],["Arhopala ganesa","Tailless Bushblue"],["Arhopala hellenore","Pointed Green Oakblue"],["Arhopala khamti","Doherty\'s Dull Oakblue"],["Arhopala nicevillei","Large Spotted Oakblue"],["Arhopala oenea","Hewitson\'s Dull Oakblue"],["Arhopala opalina","Opal Oakblue"],["Arhopala paraganesa","Dusky Bushblue"],["Arhopala paralea","Glazed Oakblue"],["Arhopala paramuta","Hooked Oakblue"],["Arhopala perimuta","Yellowdisc Tailless Oakblue"],["Arhopala rama","Dark Himalayan Oakblue"],["Arhopala ralanda","Bright Oakblue"],["Arhopala selta","Rosy Oakblue"],["Arhopala silhetensis","Sylhet Oakblue"],["Arhopala singla","Yellow-disc Oakblue"],["Arhopala zeta","Andaman Tailless Oakblue"],["Thaduka multicaudata","Many-tailed Oakblue"],["Apporasa atkinsoni","Crenulate Oakblue"],["Mahathala ameria","Falcate Oakblue"],["Flos apidanus","Plain Plushblue"],["Flos adriana","Vareigated Plushblue"],["Flos areste","Tailless Plushblue"],["Flos asoka","Spangled Plushblue"],["Flos chinensis","Chinese Plushblue"],["Flos diardi","Bifid Plushblue"],["Flos fulgida","Shining Plushblue"],["Mota massyla","Saffron"],["Surendra quercetorum","Common Acacia Blue"],["Surendra vivarna","Burmese Acacia Blue"],["Zinaspa todara","Silver Streaked Acacia Blue"],["Zesius chrysomallus","Redspot"],["Amblypodia anita","Purple Leaf Blue"],["Iraota rochana","Scarce Silverstreak Blue"],["Iraota timoleon","Silverstreak Blue"],["Catapaecilma major","Common Tinsel"],["Catapaecilma subochracea","Yellow Tinsel Nagaland."],["Acupicta delicatum","Dark Tinsel"],["Loxura atymnus","Yamfly"],["Yasoda tripunctata","Branded Yamfly"],["Drina donina","Brown Yam"],["Horaga albimacula","Violet Onyx"],["Horaga onyx","Common Onyx"],["Horaga syrinx","Yellow Onyx"],["Horaga viola","Brown Onyx"],["Rathinda amor","Monkey Puzzle"],["Cheritra freja","Common Imperial"],["Cheritrella truncipennis","Truncate Imperial"],["Ticherra acte","Blue Imperial"],["Drupadia scaeva","Blue Posy"],["Pratapa deva",""],["Pratapa icetas","Dark Blue Royal"],["Pratapa icetoides","Blue Royal"],["Tajuria albiplaga","Pallid Royal"],["Tajuria cippus","Peacock Royal"],["Tajuria culta","Black-branded Royal"],["Tajuria deudorix","Flash Royal"],["Tajuria diaeus","Straightline Royal"],["Tajuria illurgioides","Scarce White Royal"],["Tajuria illurgis","White Royal"],["Tajuria isaeus","Bornean Royal"],["Tajuria ister","Uncertain Royal"],["Tajuria jehana","Plains Blue Royal"],["Tajuria luculenta","Chinese Royal"],["Tajuria maculata","Spotted Royal"],["Tajuria megistia","Orange-and-black Royal"],["Tajuria melastigma","Branded Royal"],["Tajuria yajna","Chestnut-and-black Royal"],["Dacalana cotys","White-banded Royal"],["Dacalana penicilligera","Double-tufted Royal"],["Maneca bhotea","Slate Royal"],["Creon cleobis","Broadtail Royal"],["Bullis buto","Baby Royal"],["Eliotiana jalindra","Banded Royal"],["Neocheritra fabronia","Pale Grand Imperial"],["Charana cepheis","Cachar Mandarin Blue"],["Charana mandarina","Mandarin Blue"],["Suasa lisides","Red Imperial"],["Britomartis cleoboides","Azure Royal"],["Remelana jangala","Chocolate Royal"],["Ancema blanka","Silver Royal"],["Ancema ctesia","Bi-Spot Royal"],["Hypolycaena erylus","Common Tit"],["Hypolycaena narada","Banded Tit"],["Hypolycaena nilgirica","Nilgiri Tit"],["Hypolycaena thecloides","Brown Tit"],["Chliaria kina","Blue Tit"],["Chliaria othona","Orchid Tit"],["Zeltus amasa","Fluffy Tit"],["Deudorix epijarbas","Cornelian"],["Deudorix gaetulia","Assam Cornelian"],["Virachola dohertyi","Doherty\'s Guava Blue"],["Virachola isocrates","Common Guava Blue"],["Virachola kessuma","Whiteline Flash"],["Virachola perse","Large Guava Blue"],["Virachola similis","Scarce Guava Blue"],["Artipe eryx","Green Flash"],["Sinthusa chandrana","Broad Spark"],["Sinthusa nasaka","Narrow Spark"],["Sinthusa virgo","Pale Spark"],["Araotes lapithis","Witch"],["Bindahara phocides","Plane"],["Rapala buxaria","Shot Flash"],["Rapala damona","Malay Red Flash"],["Rapala dieneces","Scarlet Flash"],["Rapala extensa","Chitral Flash"],["Rapala iarbus","Common Red Flash"],["Rapala lankana","Malabar Flash"],["Rapala manea","Slate Flash"],["Rapala nissa","Common Flash"],["Rapala pheretima","Copper Flash"],["Rapala rectivitta","Scarce Shot Flash"],["Rapala refulgens","Refulgent Flash"],["Rapala melida","Brilliant Flash"],["Rapala rosacea","Rosy Flash"],["Rapala rubida","Tytler\'s Flash"],["Rapala selira","Himalayan Red Flash"],["Rapala scintilla","Scarce Slate Flash"],["Rapala suffusa","Suffused Flash"],["Rapala tara","Assam Flash"],["Rapala varuna","Indigo Flash"],["Pamela dudgeoni","Lister\'s Hairstreak"],["Ahlbergia leechii","Ferruginous Hairstreak"],["Strymon mackwoodi","Mackwood\'s Hairstreak"],["Superflua deria","Moore\'s Hairstreak"],["Niphanda asialis","Fawcett\'s Pierrot"],["Niphanda cymbia","Pointed Pierrot"],["Anthene emolus","Ciliate Blue"],["Anthene lycaenina","Pointed Ciliate Blue"],["Una usta","Una"],["Orthomiella pontis","Straightwing Blue"],["Orthomiella rantaizana","Burmese Straightwing Blue"],["Petrelaea dana","Dingy Lineblue"],["Nacaduba berenice","Rounded Sixlineblue"],["Nacaduba beroe","Opaque Sixlineblue"],["Nacaduba calauria","Dark Ceylon Sixlineblue"],["Nacaduba hermus","Pale Fourlineblue"],["Nacaduba kurava","Transparent Sixlineblue"],["Nacaduba pactolus","Large Fourlineblue"],["Nacaduba pavana","Small Fourlineblue"],["Nacaduba sanaya","Jewel Fourlineblue"],["Nacaduba subperusia","Violet Fourlineblue"],["Prosotas aluta","Barred Lineblue"],["Prosotas bhutea","Bhutya Lineblue"],["Prosotas dubiosa","Tailless Lineblue"],["Prosotas lutea","Banded Lineblue"],["Prosotas nora","Common Lineblue"],["Prosotas noreia","White-tipped Lineblue"],["Prosotas pia","Margined Lineblue"],["Ionolyce helicon","Pointed Lineblue"],["Catopyrops ancyra","Felder\'s Lineblue"],["Caleta decidia","Angled Pierrot"],["Caleta elna","Elbowed Pierrot"],["Caleta roxus","Straight Pierrot"],["Discolampa ethion","Banded Blue Pierrot"],["Jamides alecto","Metallic Cerulean"],["Jamides bochus","Dark Cerulean"],["Jamides caeruleus","Royal Cerulean"],["Jamides celeno","Common Cerulean"],["Jamides elpis","Glistening Cerulean"],["Jamides ferrari","Ferrar\'s Cerulean"],["Jamides kankena","Frosted Cerulean"],["Jamides pura","White Cerulean"],["Catochrysops panormus","Silver Forgetmenot"],["Catochrysops strabo","Forgetmenot"],["Lampides boeticus","Peablue"],["eptotes plinius","Zebra Blue"],["Castalius rosimon","Common Pierrot"],["Tarucus ananda","Dark Pierrot"],["Tarucus balkanicus","Black-spotted Pierrot"],["Tarucus callinara","Spotted Pierrot"],["Tarucus hazara","Hazara Pierrot"],["Tarucus indicus","Indian Pointed Pierrot"],["Tarucus nara","Striped Pierrot"],["Tarucus venosus","Himalayan Pierrot"],["Tarucus waterstradti","Assam Pierrot"],["Zizeeria karsandra","Dark Grass Blue"],["Pseudozizeeria maha","Pale Grass Blue"],["Zizina otis","Lesser Grass Blue"],["Zizula hylax","Tiny Grass Blue"],["Everes argiades","Tailed Cupid"],["Everes hugelii","Dusky-blue Cupid"],["Everes lacturnus","Indian Cupid"],["Cupido alainus","Staudinger\'s Cupid"],["Cupido buddhista","Shandur Cupid"],["Iolana gigantea","Gilgit Mountain Blue"],["Bothrinia chennelli","Hedge Cupid"],["Tongeia kala","Black Cupid"],["Tongeia pseudozuthus","False Tibetan Cupid"],["Shijimia moorei","Moore\'s Cupid"],["Talicada nyseus","Red Pierrot"],["Pithecops fulgens","Blue Quaker"],["Pithecops corvus","Forest Quaker"],["Azanus jesous","African Babul Blue"],["Azanus ubaldus","Bright Babul Blue"],["Azanus uranus","Dull Babul Blue"],["Neopithecops zalmora","Quaker"],["Megisba malaya","Malayan"],["Celastrina argiolus","Hill Hedge Blue"],["Celastrina gigas","Silvery Hedge Blue"],["Celastrina hersilia","Mishmi Hedge Blue"],["Celastrina hugelii","Large Hedge Blue"],["Celastrina lavendularis","Plain Hedge Blue"],["Celastrina oreas","Khasi Hedge Blue"],["Lestranicus transpectus","White-banded Hedge Blue"],["Celatoxia albidisca","Whitedisc Hedge Blue"],["Celatoxia marginata","Margined Hedge Blue"],["Notarthrinus binghami","Chapman\'s Hedge Blue"],["Acytolepis lilacea","Hampson\'s Hedge Blue"],["Acytolepis puspa","Common Hedge Blue"],["Oreolyce dohertyi","Naga Hedge Blue"],["Oreolyce vardhana","Dusky Hedge Blue"],["Callenya melaena","Metallic Hedge Blue"],["Monodontides musina","Swinhoe\'s Hedge Blue"],["Udara akasa","White Hedge Blue"],["Udara albocaerulea","Albocerulean"],["Udara dilecta","Pale Hedge Blue"],["Udara placidula","Narrow-bordered Hedge Blue"],["Udara selma","Bicoloured Hedge Blue"],["Udara singalensis","Singhalese Hedge Blue"],["Euchrysops cnejus","Gram Blue"],["Freyeria putli","Small Grass Jewel"],["Freyeria trochylus","Grass Jewel"],["Luthrodes pandava","Plains Cupid"],["Chilades lajus","Lime Blue"],["Chilades parrhasius","Small Cupid"],["Turanana chitrali","Chitral Argus Blue"],["Pseudophilotes vicrama","Eastern Baton Blue"],["Phengaris atroguttata","Great Spotted Blue"],["Plebejus eversmanni","Tibetan Jewel Blue"],["Plebejus samudra","Ladakh Jewel Blue"],["Aricia agestis","Orange-bordered Argus"],["Aricia artaxerxes","Northern Brown Argus"],["Aricia astorica","Astor Argus"],["Eumedonia eumedon","Streaked Argus"],["Agriades jaloka","Greenish Mountain Blue"],["Agriades morsheadi","Evans\' Mountain Blue"],["Agriades pheretiades","Tien Shan Blue"],["Albulina asiatica","Azure Mountain Blue"],["Albulina chitralensis","Chitral Green Underwing"],["Albulina chrysopis","Golden Green Underwing"],["Albulina galathea","Large Green Underwing"],["Albulina lehanus","Common Mountain Blue"],["Albulina metallica","Small Green Underwing"],["Albulina omphisa","Dusky Green Underwing"],["Albulina pharis","Fawcett\'s Mountain Blue"],["Albulina sikkima","Sikkim Mountain Blue"],["Patricius younghusbandi","Chumbi Green Underwing"],["Plebejidea loewii","Large Jewel Blue"],["Kretania beani","Bean\'s Jewel Blue"],["Farsia ashretha","Evans\' Argus Blue"],["Farsia hanna","Jewel Argus Blue"],["Alpherakya devanica","Dusky Meadow Blue"],["Alpherakya sarta","Brilliant Meadow Blue"],["Polyommatus ariana","Lahaul Meadow Blue"],["Polyommatus drasula","Ladakh Meadow Blue"],["Polyommatus dux","Kumaon Meadow Blue"],["Polyommatus erigone","Grshimailo\'s Meadow Blue"],["Polyommatus hunza","Hunza Meadow Blue"],["Polyommatus icadius","Gilgit Meadow Blue"],["Polyommatus janetae","Janet\'s Meadow Blue"],["Polyommatus pseuderos","Kashmir Meadow Blue"],["Polyommatus pulchellus","Bernardi\'s Meadow Blue"],["Polyommatus stoliczkanus","Stoliczka\'s Meadow Blue"],["Danaus affinis","Malay Tiger"],["Danaus chrysippus","Plain Tiger"],["Danaus genutia","Common Tiger"],["Danaus melanippus","White Tiger"],["Ideopsis juventa","Grey Glassy Tiger"],["Ideopsis similis","Blue Glassy Tiger"],["Parantica aglea","Glassy Tiger"],["Parantica agleoides","Dark Glassy Tiger"],["Parantica melaneus","Chocolate Tiger"],["Parantica swinhoei","Swinhoe\'s Chocolate Tiger"],["Parantica nilgiriensis","Nilgiri Tiger"],["Parantica pedonga","Talbot\'s Chestnut Tiger"],["Parantica sita","Chestnut Tiger"],["Tirumala gautama","Scarce Blue Tiger"],["Tirumala limniace","Blue Tiger"],["Tirumala septentrionis","Dark Blue Tiger"],["Idea agamarschana","Burmese Tree Nymph"],["Idea malabarica","Malabar Tree Nymph"],["Euploea algea","Long-branded Blue Crow"],["Euploea core","Common Crow"],["Euploea crameri","Spotted Black Crow"],["Euploea doubledayi","Striped Black Crow"],["Euploea eunice","Blue-branded King Crow"],["Euploea klugii","King Crow"],["Euploea midamus","Spotted Blue Crow"],["Euploea mulciber","Striped Blue Crow"],["Euploea phaenareta","Great Crow"],["Euploea radamanthus","Magpie Crow"],["Euploea sylvester","Double-branded Crow"],["Calinaga buddha","Freak"],["Prothoe franck","Blue Begum"],["Polyura agraria","Anomalous Nawab"],["Polyura arja","Pallid Nawab"],["Polyura athamas","Common Nawab"],["Polyura bharata","Cryptic Nawab"],["Polyura delphis","Jewelled Nawab"],["Polyura dolon","Stately Nawab"],["Polyura eudamippus","Great Nawab"],["Polyura moori","Malayan Nawab"],["Polyura narcaeus","China Nawab"],["Polyura schreiber","Blue Nawab"],["Charaxes aristogiton","Scarce Tawny Rajah"],["Charaxes bernardus","Tawny Rajah"],["Charaxes durnfordi","Chestnut Rajah"],["Charaxes kahruba","Variegated Rajah"],["Charaxes marmax","Yellow Rajah"],["Charaxes psaphon","Plain Tawny Rajah"],["Charaxes solon","Black Rajah"],["Faunis eumeus","Large Faun"],["Faunis canens","Common Faun"],["Aemona amathusia","Yellow Dryad"],["Stichophthalma camadeva","Northern Junglequeen"],["Stichophthalma nourmahal","Chocolate Junglequeen"],["Stichophthalma sparta","Manipur Junglequeen"],["Amathusia andamanensis","Andaman Palmking"],["Amathusia phidippus","Common Palmking"],["Amathuxidia amythaon","Koh-i-Noor"],["Thaumantis diores","Jungleglory"],["Thauria lathyi","Jungleking"],["Discophora deo","Banded Duffer"],["Discophora lepida","Southern Duffer"],["Discophora sondaica","Common Duffer"],["Discophora timora","Great Duffer"],["Enispe cycnus","Blue Caliph"],["Enispe euthymius","Red Caliph"],["Enispe intermedia","Malayan Red Caliph"],["Elymnias cottonis","Andaman Palmfly"],["Elymnias hypermnestra","Common Palmfly"],["Elymnias malelas","Spotted Palmfly"],["Elymnias nesaea","Tiger Palmfly"],["Elymnias panthera","Nicobar Palmfly"],["Elymnias patna","Blue-striped Palmfly"],["Elymnias peali","Peal\'s Palmfly"],["Elymnias penaga","Pointed Palmfly"],["Elymnias vasudeva","Jezabel Palmfly"],["Neorina hilda","Yellow Owl"],["Neorina patria","White Owl"],["Penthema lisarda","Yellow Kaiser"],["Ethope himachala","Dusky Diadem"],["Melanitis leda","Common Evening Brown"],["Melanitis phedima","Dark Evening Brown"],["Melanitis zitenius","Great Evening Brown"],["Cyllogenes janetae","Scarce Evening Brown"],["Cyllogenes suradeva","Branded Evening Brown"],["Parantirrhoea marshalli","Travancore Evening Brown"],["Lethe andersoni","Anderson\'s Silverstripe"],["Lethe atkinsonia","Small Goldenfork"],["Lethe baladeva","Treble Silverstripe"],["Lethe bhairava","Rusty Forester"],["Lethe brisanda","Dark Forester"],["Lethe chandica","Angled Red Forester"],["Lethe confusa","Banded Treebrown"],["Lethe dakwania","Garhwal Woodbrown"],["Lethe dura","Scarce Lilacfork"],["Lethe distans","Scarce Red Forester"],["Lethe drypetis","Tamil Treebrown"],["Lethe europa","Bamboo Treebrown"],["Lethe goalpara","Large Goldenfork"],["Lethe gemina","Tytler\'s Treebrown"],["Lethe gulnihal","Dull Forester"],["Lethe isana","Common Forester"],["Lethe jalaurida","Small Silverfork"],["Lethe kabrua","Manipur Goldenfork"],["Lethe kanjupkula","Manipur Woodbrown"],["Lethe kansa","Bamboo Forester"],["Lethe latiaris","Pale Forester"],["Lethe maitrya","Barred Woodbrown"],["Lethe margaritae","Bhutan Treebrown"],["Lethe mekara","Common Red Forester"],["Lethe moelleri","Moeller‘s Silverfork"],["Lethe naga","Naga Treebrown"],["Lethe nicetas","Yellow Woodbrown"],["Lethe nicetella","Small Woodbrown"],["Lethe ramadeva","Single Silverstripe"],["Lethe rohria","Common Treebrown"],["Lethe satyavati","Pallid Forester"],["Lethe scanda","Blue Forester"],["Lethe serbonis","Brown Forester"],["Lethe siderea","Scarce Woodbrown"],["Lethe sidonis","Common Woodbrown"],["Lethe sinorix","Tailed Red Forester"],["Lethe sura","Scarce Lilacfork"],["Lethe tristigmata","Spotted Mystic"],["Lethe verma","Straight-banded Treebrown"],["Lethe vindhya","Black Forester"],["Lethe visrava","White-edged Woodbrown"],["Neope armandii","Chinese Labyrinth"],["Neope bhadra","Tailed Labyrinth"],["Neope pulaha","Veined Labyrinth"],["Neope pulahina","Scarce Labyrinth"],["Neope pulahoides","Assam Veined Labyrinth"],["Neope yama","Dusky Labyrinth"],["Lasiommata maerula","Scarce Wall"],["Lasiommata menava","Dark Wall"],["Lasiommata schakra","Common Wall"],["Kirinia eversmanni","Yellow Wall"],["Chonala masoni","Chumbi Wall"],["Rhaphicera moorei","Small Tawny Wall"],["Rhaphicera satricus","Large Tawny Wall"],["Orinoma damaris","Tigerbrown"],["Heteropsis adolphei","Redeye Bushbrown"],["Heteropsis malsara","White-line Bushbrown"],["Heteropsis mamerta","Blind-eye Bushbrown"],["Mycalesis adamsoni","Watson\'s Bushbrown"],["Mycalesis anaptia","Tawny Bushbrown"],["Mycalesis anaxias","Whitebar Bushbrown"],["Mycalesis annamitica","Blindeyed Bushbrown"],["Mycalesis evansii","Tytler\'s Bushbrown"],["Mycalesis francisca","Lilacine Bushbrown"],["Mycalesis gotama","Chinese Bushbrown"],["Mycalesis heri","Moore\'s Bushbrown"],["Mycalesis igilia","Small Long-brand Bushbrown"],["Mycalesis intermedia","Intermediate Bushbrown"],["Mycalesis lepcha","Lepcha Bushbrown"],["Mycalesis malsarida","Plain Bushbrown"],["Mycalesis manii","Nicobar Bushbrown"],["Mycalesis mestra","White-edged Bushbrown"],["Mycalesis mineus","Dark-brand Bushbrown"],["Mycalesis misenus","De Niceville\'s Bushbrown"],["Mycalesis mnasicles","Cyclops Bushbrown"],["Mycalesis mystes","Many-tufted Bushbrown"],["Mycalesis nicotia","Brighteye Bushbrown"],["Mycalesis oculus","Red-disc Bushbrown"],["Mycalesis orcha","Pale-brand Bushbrown"],["Mycalesis patiana","Eliot\'s Bushbrown"],["Mycalesis patnia","Glad-eye Bushbrown"],["Mycalesis perseus","Common Bushbrown"],["Mycalesis suaveolens","Wood-Mason\'s Bushbrown"],["Mycalesis visala","Long-brand Bushbrown"],["OrsotriaenaWallengren, medus","Nigger"],["Zipaetis saitis","Tamil Catseye"],["Zipaetis scylax","Dark Catseye"],["Erites falcipennis","Common Cyclops"],["Coelites nnootthhiiss","Scarce Catseye"],["RRaaggaaddiiaa crisilda","Striped Ringlet"],["Hyponephele carbonelli","Baltistan Meadowbrown"],["Hyponephele cheena","Branded Meadowbrown"],["Hyponephele coenonympha","Spotted Meadowbrown"],["Hyponephele davendra","White-ringed Meadowbrown"],["Hyponephele brevistigma","Short-branded Meadowbrown"],["Hyponephele tenuistigma","Lesser White-ringed Meadowbrown"],["Hyponephele pulchella","Tawny Meadowbrown"],["Hyponephele pulchra","Dusky Meadowbrown"],["Hyponephele hilaris","Pamir Meadowbrown"],["Callerebia annada","Ringed Argus"],["Callerebia baileyi","White-bordered Argus"],["Callerebia dibangensis","Roy\'s Argus"],["Callerebia hybrida","Hybrid Argus"],["Callerebia nirmala","Common Argus"],["Callerebia orixa","Moore\'s Argus"],["Callerebia scanda","Pallid Argus"],["Callerebia suroia","Manipur Argus"],["Paralasa chitralica","Chitral Argus"],["Paralasa kalinda","Scarce Mountain Argus"],["Paralasa mani","Yellow Argus"],["Paralasa shallada","Mountain Argus"],["Loxerebia narasingha","Mottled Argus"],["Ypthima affectata","Khasi Fivering"],["Ypthima asterope","Common Threering"],["Ypthima atra","Black Fivering"],["Ypthima baldus","Common Fivering"],["Ypthima bolanica","Desert Fourring"],["Ypthima cantliei","Cantlie\'s Fourring"],["Ypthima ceylonica","White Fourring"],["Ypthima chenu","Nilgiri Fourring"],["Ypthima davidsoni","Davidson\'s Fivering"],["Ypthima dohertyi","Great Fivering"],["Ypthima fusca","Assam Threering"],["Ypthima hannyngtoni","Hannyngton\'s Fivering"],["Ypthima huebneri","Common Fourring"],["Ypthima hyagriva","Brown Argus"],["Ypthima indecora","Western Fivering"],["Ypthima inica","Lesser Threering"],["Ypthima kasmira","Kashmir Fourring"],["Ypthima lisandra","Jewel Fourring"],["Ypthima lycus","Plain Threering"],["Ypthima methora","Variegated Fivering"],["Ypthima nareda","Large Threering"],["Ypthima newara","Newar Threering"],["Ypthima nikaea","Moore\'s Fivering"],["Ypthima norma","Burmese Threering"],["Ypthima parasakra","Himalayan Fourring"],["Ypthima persimilis","Manipur Fivering"],["Ypthima philomela","Baby Fivering"],["Ypthima sakra","Himalayan Fivering"],["Ypthima savara","Pallid Fivering"],["Ypthima similis","Eastern Fivering"],["Ypthima singala","Small Jewel Fourring"],["Ypthima sobrina","Karen Fivering"],["Ypthima striata","Nilgiri Jewel Fourring"],["Ypthima watsoni","Looped Threering"],["Ypthima yphthimoides","Palni Fourring"],["Oeneis buddha","Tibetan Satyr"],["Paroeneis pumilus","Mountain Satyr"],["Paroeneis sikkimensis","Sikkim Satyr"],["Karanasa alpherakyi","Avinoff\'s Satyr"],["Karanasa bolorica","Turkestan Satyr"],["Karanasa cadesia","Moore\'s Satyr"],["Karanasa huebneri","Tawny Satyr"],["Karanasa modesta","Small Satyr"],["Karanasa moorei","Shandur Satyr"],["Karanasa leechi","Leech\'s Satyr"],["Karanasa rohtanga","Rohtang Satyr"],["Satyrus pimpla","Black Satyr"],["Aulocera brahminus","Narrow-banded Satyr"],["Aulocera loha","Doherty\'s Satyr"],["Aulocera padma","Great Satyr"],["Aulocera saraswati","Striated Satyr"],["Aulocera swaha","Common Satyr"],["Hipparchia parisatis","White-edged Rockbrown"],["Chazara heydenreichi","Shandur Rockbrown"],["Pseudochazara baldiva","Kashmir Rockbrown"],["Pseudochazara droshica","Tytler\'s Rockbrown"],["Kanetisa digna","Chitrali Satyr"],["Neptis ananta","Yellow Sailer"],["Neptis armandia","Variegated Sailer"],["Neptis capnodes","Eliot\'s Sailer"],["Neptis cartica","Plain Sailer"],["Neptis clinia","Clear Sailer"],["Neptis cydippe","Chinese Yellow Sailer"],["Neptis harita","Dingiest Sailer"],["Neptis hylas","Common Sailer"],["Neptis ilira","Dark Dingy Sailer"],["Neptis jumbah","Chestnut-streaked Sailer"],["Neptis magadha","Spotted Sailer"],["Neptis mahendra","Himalayan Sailer"],["Neptis manasa","Pale Hockeystick Sailer"],["Neptis miah","Small Yellow Sailer"],["Neptis namba","Manipur Yellow Sailer"],["Neptis narayana","Broadstick Sailer"],["Neptis nashona","Less Rich Sailer"],["Neptis nata","Sullied Sailer"],["Neptis nemorum","Naga Hockeystick Sailer"],["Neptis pseudovikasi","Dingy Sailer"],["Neptis radha","Great Yellow Sailer"],["Neptis sankara","Broad-banded Sailer"],["Neptis sappho","Pallas\' Sailer"],["Neptis soma","Creamy Sailer"],["Neptis zaida","Pale Green Sailer"],["Phaedyma aspasia","Great Hockeystick Sailer"],["Phaedyma columella","Short-banded Sailer"],["Lasippa tiga","Burmese Lascar"],["Lasippa viraja","Yellowjack Sailer"],["Pantoporia assamica","Assamese Lascar"],["Pantoporia aurelia","Baby Lascar"],["Pantoporia bieti","Tytler\'s Lascar"],["Pantoporia hordonia","Common Lascar"],["Pantoporia paraka","Perak Lascar"],["Pantoporia sandaca","Extra Lascar"],["Athyma asura","Studded Sergeant"],["Athyma cama","Orange Staff Sergeant"],["Athyma nefte","Colour Sergeant"],["Athyma jina","Bhutan Sergeant"],["Athyma kanwa","Dot-dash Sergeant"],["Athyma larymna","Great Sergeant"],["Athyma opalina","Himalayan Sergeant"],["Athyma orientalis","Oriental Sergeant"],["Athyma perius","Common Sergeant"],["Athyma pravara","Unbroken Sergeant"],["Athyma ranga","Blackvein Sergeant"],["Athyma reta","Malay Staff Sergeant"],["Athyma rufula","Andaman Sergeant"],["Athyma selenophora","Staff Sergeant"],["Athyma whitei","Cryptic Sergeant"],["Athyma zeroca","Small Staff Sergeant"],["Limenitis lepechini","Chitral White Admiral"],["Limenitis trivena","Indian White Admiral"],["Moduza procris","Commander"],["Parasarpa dudu","White Commodore"],["Parasarpa zayla","Bicolour Commodore"],["Sumalia daraxa","Green Commodore"],["Sumalia zulema","Scarce White Commodore"],["Auzakia danava","Commodore"],["Bhagadatta austenia","Grey Commodore"],["Lebadea martha","Knight"],["Parthenos sylla","Clipper"],["Neurosigma siva","Panther"],["Abrota ganga","Sergeant-major"],["Cynitia cocytus","Lavender Count"],["Cynitia lepidea","Grey Count"],["Cynitia telchinia","Blue Baron"],["Tanaecia cibaritis","Andaman Viscount"],["Tanaecia jahnu","Plain Earl"],["Tanaecia julii","Common Earl"],["Euthalia aconthea","Common Baron"],["Euthalia alpheda","Streaked Baron"],["Euthalia anosia","Grey Baron"],["Euthalia confucius","Chinese Duke"],["Euthalia curvifascia","Naga Duke"],["Euthalia durga","Blue Duke"],["Euthalia duda","Blue Duchess"],["Euthalia evelina","Red-spot Duke"],["Euthalia eriphylae","White-tipped Baron"],["Euthalia franciae","French Duke"],["Euthalia iva","Grand Duke"],["Euthalia lengba","Tytler\'s Duchess"],["Euthalia lubentina","Gaudy Baron"],["Euthalia malaccana","Fruhstorfer\'s Baron"],["Euthalia merta","Dark Baron"],["Euthalia monina","Powdered Baron"],["Euthalia nara","Bronze Duke"],["Euthalia narayana","Burmese Baron"],["Euthalia patala","Grand Duchess"],["Euthalia phemius","White-edged Blue Baron"],["Euthalia recta","Redtail Maquis"],["Euthalia sahadeva","Green Duke"],["Euthalia saitaphernes","Mottled Baron"],["Euthalia teuta","Banded Marquis"],["Euthalia thawgawa","Tytler\'s Duke"],["Symphaedra nais","Baronet"],["Lexias cyanipardus","Great Archduke"],["Lexias dirtea","Dark Archduke"],["Lexias pardalis","Archduke"],["Argynnis aglaja","Dark Green Silverspot"],["Argynnis childreni","Great Silverstripe"],["Argynnis clara","Silverstreak"],["Argynnis hyperbius","Indian Fritillary"],["Argynnis jainadeva","Highbrown Silverspot"],["Argynnis kamala","Common Silverstripe"],["Argynnis laodice","Eastern Silverstripe"],["Argynnis pandora","Cardinal"],["Issoria altissima","Mountain Silverspot"],["Issoria gemmata","Gem Silverspot"],["Issoria lathonia","Queen of Spain Fritillary"],["Issoria mackinnoni","Brilliant Silverspot"],["Boloria erubescens","Whitespot Fritillary"],["Boloria generator","Hunza Silverspot"],["Boloria jerdoni","Jerdon\'s Silverspot"],["Boloria sipora","Straightwing Silverspot"],["Phalanta alcippe","Small Leopard"],["Phalanta phalantha","Common Leopard"],["Cupha erymanthis","Rustic"],["Vagrans egista","Vagrant"],["Vindula erota","Cruiser"],["Algia fasciata","Branded Yeoman"],["Cirrochroa aoris","Large Yeoman"],["Cirrochroa nicobarica","Nicobar Yeoman"],["Cirrochroa thais","Tamil Yeoman"],["Cirrochroa tyche","Common Yeoman"],["Ariadne ariadne","Angled Castor"],["Ariadne merione","Common Castor"],["Laringa horsfieldi","Banded Dandy"],["Byblia marathus","Pasha"],["Euripus consimilis","Painted Courtesan"],["Euripus nyctelius","Courtesan"],["Hestina nicevillei","Scarce Siren"],["Hestina persimilis","Siren"],["Hestinalis nama","Circe"],["Sasakia funebris","Empress"],["Cyrestis cocles","Marbled Map"],["Cyrestis tabula","Nicobar Map"],["Cyrestis thyodamas","Common Map"],["Chersonesia intermedia","Wavy Maplet"],["Chersonesia risa","Common Maplet"],["Pseudergolis wedah","Tabby"],["Stibochiona nicea","Popinjay"],["Dichorragia nesimachus","Constable"],["Melitaea arcesia","Blackvein Fritillary"],["Melitaea shandura","Shandur Fritillary"],["Melitaea fergana","Uzbek Fritillary"],["Melitaea nadezhdae","Sheljuzhko\'s Fritillary"],["Melitaea balbina","Pamir Fritillary"],["Symbrenthia brabira","Himalayan Jester"],["Symbrenthia doni","Naga Jester"],["Symbrenthia hypselis","Spotted Jester"],["Symbrenthia lilaea","Common Jester"],["Symbrenthia niphanda","Blue-tailed Jester"],["Symbrenthia silana","Scarce Jester"],["Araschnia prorsoides","Mongol"],["Nymphalis xanthomelas","Large Tortoiseshell"],["Aglais caschmirensis","Indian Tortoiseshell"],["Aglais ladakensis","Ladakh Tortoiseshell"],["Aglais rizana","Mountain Tortoiseshell"],["Kaniska canace","Blue Admiral"],["Polygonia c-album","Comma"],["Polygonia l-album","False Comma"],["Polygonia undina","Pamir Comma"],["Vanessa cardui","Painted Lady"],["Vanessa indica","Indian Red Admiral"],["Junonia almana","Peacock Pansy"],["Junonia atlites","Grey Pansy"],["Junonia hierta","Yellow Pansy"],["Junonia iphita","Chocolate Pansy"],["Junonia lemonias","Lemon Pansy"],["Junonia orithya","Blue Pansy"],["Hypolimnas anomala","Malayan Eggfly"],["Hypolimnas bolina","Great Eggfly"],["Hypolimnas misippus","Danaid Eggfly"],["Kallima albofasciata","White Oakleaf"],["Kallima horsfieldi","Southern Blue Oakleaf"],["Kallima inachus","Orange Oakleaf"],["Kallima knyvetti","Scarce Blue Oakleaf"],["Doleschallia bisaltide","Autumn Leaf"],["Rhinopalpa polynice","Wizard"],["Yoma sabina","Lurcher"],["Acraea issoria","Yellow Coster"],["Acraea violae","Tawny Coster"],["Cethosia biblis","Red Lacewing"],["Cethosia cyane","Leopard Lacewing"],["Cethosia nietneri","Tamil Lacewing"],["Libythea lepita","Common Beak"],["Libythea myrrha","Club Beak"],["Libythea narina","White-spotted Beak"]]'),Js={name:"validate",props:["form_data","rows","form_cols"],data:function(){return{form_values:this.form_data,row_values:this.rows,row_cols:["sl_no","common_name","scientific_name","individuals","remarks"],species_names:Ys,row_comments:{}}},computed:{},watch:{row_values:{handler:function(e,a){this.populateRowComments()},deep:!0}},created:function(){this.populateRowComments()},methods:{populateRowComments:function(){var e=this;this.row_values.forEach((function(a){e.row_comments[a.id]=[],e.row_cols.forEach((function(t){switch(e.inputSpeciesClass(a.id,t,a[t])){case"text-blank":e.row_comments[a.id].push(e.titleCase(t)+" is blank. Please fill it if possible");break;case"unmatched-name":e.row_comments[a.id].push(e.titleCase(t)+" doesnt with our list.")}}))}))},inputSpeciesClass:function(e,a,t){var n="";switch(a){case"sl_no":case"no_of_individuals":this.row_values.forEach((function(t){t.id==e&&(""!=t[a]&&null!=t[a]||(n="text-blank"))}));break;case"common_name":n="unmatched-name",this.species_names.forEach((function(e){e[1]==t&&(n="matched-name")}));break;case"scientific_name":n="unmatched-name",this.species_names.forEach((function(e){e[0]==t&&(n="matched-name")}))}return n},inputDetailsClass:function(e){var a="";return""!=this.form_values[e]&&null!=this.form_values[e]||(a="text-blank"),a},titleCase:function(e){for(var a=e.toLowerCase().split("_"),t=0;t<a.length;t++)a[t]=a[t].charAt(0).toUpperCase()+a[t].substring(1);return a.join(" ")},validateData:function(){var e=t(9669),a={form:this.form_values,rows:this.row_values};e.post("/butterfly_count/validate",a).then((function(e){200==e.status&&window.open("/butterfly_count","_self")})).catch((function(e){console.log(e)}))}}},Us=Js;var Ks=t(3379),Vs=t.n(Ks),qs=t(5478),Zs={insert:"head",singleton:!1};Vs()(qs.Z,Zs);qs.Z.locals;var Xs=function(e,a,t,n,r,i,o,s){var l,u="function"==typeof e?e.options:e;if(a&&(u.render=a,u.staticRenderFns=t,u._compiled=!0),n&&(u.functional=!0),i&&(u._scopeId="data-v-"+i),o?(l=function(e){(e=e||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext)||"undefined"==typeof __VUE_SSR_CONTEXT__||(e=__VUE_SSR_CONTEXT__),r&&r.call(this,e),e&&e._registeredComponents&&e._registeredComponents.add(o)},u._ssrRegister=l):r&&(l=s?function(){r.call(this,(u.functional?this.parent:this).$root.$options.shadowRoot)}:r),l)if(u.functional){u._injectStyles=l;var c=u.render;u.render=function(e,a){return l.call(a),c(e,a)}}else{var d=u.beforeCreate;u.beforeCreate=d?[].concat(d,l):[l]}return{exports:e,options:u}}(Us,(function(){var e=this,a=e._self._c;return a("div",{staticClass:"container-fluid"},[a("table",{staticClass:"table table-sm table-info"},[a("tbody",e._l(e.form_cols,(function(t){return a("tr",[a("td",{domProps:{textContent:e._s(e.titleCase(t))}}),e._v(" "),a("td",[a("input",{directives:[{name:"model",rawName:"v-model",value:e.form_values[t],expression:"form_values[col]"}],staticClass:"form-control",class:e.inputDetailsClass(t),attrs:{type:"text",name:t},domProps:{value:e.form_values[t]},on:{input:function(a){a.target.composing||e.$set(e.form_values,t,a.target.value)}}})])])})),0)]),e._v(" "),a("table",{staticClass:"table table-sm table-success"},[e._m(0),e._v(" "),a("tbody",e._l(e.row_values,(function(t){return a("tr",[e._l(e.row_cols,(function(n){return a("td",[a("input",{directives:[{name:"model",rawName:"v-model",value:t[n],expression:"row[col]"}],staticClass:"form-control",class:e.inputSpeciesClass(t.id,n,t[n]),attrs:{type:"text",name:n[t.id]},domProps:{value:t[n]},on:{input:function(a){a.target.composing||e.$set(t,n,a.target.value)}}})])})),e._v(" "),a("td",{staticClass:"quality-cell"},[e.row_comments[t.id].length>0?a("ul",e._l(e.row_comments[t.id],(function(t){return a("li",{domProps:{textContent:e._s(t)}})})),0):e._e()])],2)})),0)]),e._v(" "),a("div",{staticClass:"row d-flex justify-content-center"},[a("button",{staticClass:"btn btn-success btn-block",on:{click:function(a){return e.validateData()}}},[e._v("Validate")])])])}),[function(){var e=this,a=e._self._c;return a("thead",{staticClass:"text-center"},[a("tr",[a("th",{staticClass:"sl_no-row"},[e._v("Sl. No")]),e._v(" "),a("th",[e._v("Common Name")]),e._v(" "),a("th",[e._v("Scientific Name")]),e._v(" "),a("th",[e._v("No of Individuals")]),e._v(" "),a("th",[e._v("Remarks")]),e._v(" "),a("th",[e._v("Data Quality Notes")])])])}],!1,null,null,null);new Vt({el:"#app",components:{Validate:Xs.exports},data:function(){return{}},methods:{}})})()})();
>>>>>>> update_22
