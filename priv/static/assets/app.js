(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __reExport = (target, module, desc) => {
    if (module && typeof module === "object" || typeof module === "function") {
      for (let key of __getOwnPropNames(module))
        if (!__hasOwnProp.call(target, key) && key !== "default")
          __defProp(target, key, { get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable });
    }
    return target;
  };
  var __toModule = (module) => {
    return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", module && module.__esModule && "default" in module ? { get: () => module.default, enumerable: true } : { value: module, enumerable: true })), module);
  };

  // vendor/topbar.js
  var require_topbar = __commonJS({
    "vendor/topbar.js"(exports, module) {
      (function(window2, document2) {
        "use strict";
        (function() {
          var lastTime = 0;
          var vendors = ["ms", "moz", "webkit", "o"];
          for (var x = 0; x < vendors.length && !window2.requestAnimationFrame; ++x) {
            window2.requestAnimationFrame = window2[vendors[x] + "RequestAnimationFrame"];
            window2.cancelAnimationFrame = window2[vendors[x] + "CancelAnimationFrame"] || window2[vendors[x] + "CancelRequestAnimationFrame"];
          }
          if (!window2.requestAnimationFrame)
            window2.requestAnimationFrame = function(callback, element) {
              var currTime = new Date().getTime();
              var timeToCall = Math.max(0, 16 - (currTime - lastTime));
              var id = window2.setTimeout(function() {
                callback(currTime + timeToCall);
              }, timeToCall);
              lastTime = currTime + timeToCall;
              return id;
            };
          if (!window2.cancelAnimationFrame)
            window2.cancelAnimationFrame = function(id) {
              clearTimeout(id);
            };
        })();
        var canvas, progressTimerId, fadeTimerId, currentProgress, showing, addEvent = function(elem, type, handler) {
          if (elem.addEventListener)
            elem.addEventListener(type, handler, false);
          else if (elem.attachEvent)
            elem.attachEvent("on" + type, handler);
          else
            elem["on" + type] = handler;
        }, options = {
          autoRun: true,
          barThickness: 3,
          barColors: {
            0: "rgba(26,  188, 156, .9)",
            ".25": "rgba(52,  152, 219, .9)",
            ".50": "rgba(241, 196, 15,  .9)",
            ".75": "rgba(230, 126, 34,  .9)",
            "1.0": "rgba(211, 84,  0,   .9)"
          },
          shadowBlur: 10,
          shadowColor: "rgba(0,   0,   0,   .6)",
          className: null
        }, repaint = function() {
          canvas.width = window2.innerWidth;
          canvas.height = options.barThickness * 5;
          var ctx = canvas.getContext("2d");
          ctx.shadowBlur = options.shadowBlur;
          ctx.shadowColor = options.shadowColor;
          var lineGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
          for (var stop in options.barColors)
            lineGradient.addColorStop(stop, options.barColors[stop]);
          ctx.lineWidth = options.barThickness;
          ctx.beginPath();
          ctx.moveTo(0, options.barThickness / 2);
          ctx.lineTo(Math.ceil(currentProgress * canvas.width), options.barThickness / 2);
          ctx.strokeStyle = lineGradient;
          ctx.stroke();
        }, createCanvas = function() {
          canvas = document2.createElement("canvas");
          var style = canvas.style;
          style.position = "fixed";
          style.top = style.left = style.right = style.margin = style.padding = 0;
          style.zIndex = 100001;
          style.display = "none";
          if (options.className)
            canvas.classList.add(options.className);
          document2.body.appendChild(canvas);
          addEvent(window2, "resize", repaint);
        }, topbar2 = {
          config: function(opts) {
            for (var key in opts)
              if (options.hasOwnProperty(key))
                options[key] = opts[key];
          },
          show: function() {
            if (showing)
              return;
            showing = true;
            if (fadeTimerId !== null)
              window2.cancelAnimationFrame(fadeTimerId);
            if (!canvas)
              createCanvas();
            canvas.style.opacity = 1;
            canvas.style.display = "block";
            topbar2.progress(0);
            if (options.autoRun) {
              (function loop() {
                progressTimerId = window2.requestAnimationFrame(loop);
                topbar2.progress("+" + 0.05 * Math.pow(1 - Math.sqrt(currentProgress), 2));
              })();
            }
          },
          progress: function(to) {
            if (typeof to === "undefined")
              return currentProgress;
            if (typeof to === "string") {
              to = (to.indexOf("+") >= 0 || to.indexOf("-") >= 0 ? currentProgress : 0) + parseFloat(to);
            }
            currentProgress = to > 1 ? 1 : to;
            repaint();
            return currentProgress;
          },
          hide: function() {
            if (!showing)
              return;
            showing = false;
            if (progressTimerId != null) {
              window2.cancelAnimationFrame(progressTimerId);
              progressTimerId = null;
            }
            (function loop() {
              if (topbar2.progress("+.1") >= 1) {
                canvas.style.opacity -= 0.05;
                if (canvas.style.opacity <= 0.05) {
                  canvas.style.display = "none";
                  fadeTimerId = null;
                  return;
                }
              }
              fadeTimerId = window2.requestAnimationFrame(loop);
            })();
          }
        };
        if (typeof module === "object" && typeof module.exports === "object") {
          module.exports = topbar2;
        } else if (typeof define === "function" && define.amd) {
          define(function() {
            return topbar2;
          });
        } else {
          this.topbar = topbar2;
        }
      }).call(exports, window, document);
    }
  });

  // ../deps/phoenix_html/priv/static/phoenix_html.js
  "use strict";
  (function() {
    var PolyfillEvent = eventConstructor();
    function eventConstructor() {
      if (typeof window.CustomEvent === "function")
        return window.CustomEvent;
      function CustomEvent2(event, params) {
        params = params || { bubbles: false, cancelable: false, detail: void 0 };
        var evt = document.createEvent("CustomEvent");
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
      }
      CustomEvent2.prototype = window.Event.prototype;
      return CustomEvent2;
    }
    function buildHiddenInput(name, value) {
      var input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = value;
      return input;
    }
    function handleClick(element, targetModifierKey) {
      var to = element.getAttribute("data-to"), method = buildHiddenInput("_method", element.getAttribute("data-method")), csrf = buildHiddenInput("_csrf_token", element.getAttribute("data-csrf")), form = document.createElement("form"), submit = document.createElement("input"), target = element.getAttribute("target");
      form.method = element.getAttribute("data-method") === "get" ? "get" : "post";
      form.action = to;
      form.style.display = "none";
      if (target)
        form.target = target;
      else if (targetModifierKey)
        form.target = "_blank";
      form.appendChild(csrf);
      form.appendChild(method);
      document.body.appendChild(form);
      submit.type = "submit";
      form.appendChild(submit);
      submit.click();
    }
    window.addEventListener("click", function(e) {
      var element = e.target;
      if (e.defaultPrevented)
        return;
      while (element && element.getAttribute) {
        var phoenixLinkEvent = new PolyfillEvent("phoenix.link.click", {
          "bubbles": true,
          "cancelable": true
        });
        if (!element.dispatchEvent(phoenixLinkEvent)) {
          e.preventDefault();
          e.stopImmediatePropagation();
          return false;
        }
        if (element.getAttribute("data-method")) {
          handleClick(element, e.metaKey || e.shiftKey);
          e.preventDefault();
          return false;
        } else {
          element = element.parentNode;
        }
      }
    }, false);
    window.addEventListener("phoenix.link.click", function(e) {
      var message = e.target.getAttribute("data-confirm");
      if (message && !window.confirm(message)) {
        e.preventDefault();
      }
    }, false);
  })();

  // ../deps/phoenix/priv/static/phoenix.mjs
  var closure = (value) => {
    if (typeof value === "function") {
      return value;
    } else {
      let closure22 = function() {
        return value;
      };
      return closure22;
    }
  };
  var globalSelf = typeof self !== "undefined" ? self : null;
  var phxWindow = typeof window !== "undefined" ? window : null;
  var global = globalSelf || phxWindow || global;
  var DEFAULT_VSN = "2.0.0";
  var SOCKET_STATES = { connecting: 0, open: 1, closing: 2, closed: 3 };
  var DEFAULT_TIMEOUT = 1e4;
  var WS_CLOSE_NORMAL = 1e3;
  var CHANNEL_STATES = {
    closed: "closed",
    errored: "errored",
    joined: "joined",
    joining: "joining",
    leaving: "leaving"
  };
  var CHANNEL_EVENTS = {
    close: "phx_close",
    error: "phx_error",
    join: "phx_join",
    reply: "phx_reply",
    leave: "phx_leave"
  };
  var TRANSPORTS = {
    longpoll: "longpoll",
    websocket: "websocket"
  };
  var XHR_STATES = {
    complete: 4
  };
  var Push = class {
    constructor(channel, event, payload, timeout) {
      this.channel = channel;
      this.event = event;
      this.payload = payload || function() {
        return {};
      };
      this.receivedResp = null;
      this.timeout = timeout;
      this.timeoutTimer = null;
      this.recHooks = [];
      this.sent = false;
    }
    resend(timeout) {
      this.timeout = timeout;
      this.reset();
      this.send();
    }
    send() {
      if (this.hasReceived("timeout")) {
        return;
      }
      this.startTimeout();
      this.sent = true;
      this.channel.socket.push({
        topic: this.channel.topic,
        event: this.event,
        payload: this.payload(),
        ref: this.ref,
        join_ref: this.channel.joinRef()
      });
    }
    receive(status, callback) {
      if (this.hasReceived(status)) {
        callback(this.receivedResp.response);
      }
      this.recHooks.push({ status, callback });
      return this;
    }
    reset() {
      this.cancelRefEvent();
      this.ref = null;
      this.refEvent = null;
      this.receivedResp = null;
      this.sent = false;
    }
    matchReceive({ status, response, _ref }) {
      this.recHooks.filter((h) => h.status === status).forEach((h) => h.callback(response));
    }
    cancelRefEvent() {
      if (!this.refEvent) {
        return;
      }
      this.channel.off(this.refEvent);
    }
    cancelTimeout() {
      clearTimeout(this.timeoutTimer);
      this.timeoutTimer = null;
    }
    startTimeout() {
      if (this.timeoutTimer) {
        this.cancelTimeout();
      }
      this.ref = this.channel.socket.makeRef();
      this.refEvent = this.channel.replyEventName(this.ref);
      this.channel.on(this.refEvent, (payload) => {
        this.cancelRefEvent();
        this.cancelTimeout();
        this.receivedResp = payload;
        this.matchReceive(payload);
      });
      this.timeoutTimer = setTimeout(() => {
        this.trigger("timeout", {});
      }, this.timeout);
    }
    hasReceived(status) {
      return this.receivedResp && this.receivedResp.status === status;
    }
    trigger(status, response) {
      this.channel.trigger(this.refEvent, { status, response });
    }
  };
  var Timer = class {
    constructor(callback, timerCalc) {
      this.callback = callback;
      this.timerCalc = timerCalc;
      this.timer = null;
      this.tries = 0;
    }
    reset() {
      this.tries = 0;
      clearTimeout(this.timer);
    }
    scheduleTimeout() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.tries = this.tries + 1;
        this.callback();
      }, this.timerCalc(this.tries + 1));
    }
  };
  var Channel = class {
    constructor(topic, params, socket) {
      this.state = CHANNEL_STATES.closed;
      this.topic = topic;
      this.params = closure(params || {});
      this.socket = socket;
      this.bindings = [];
      this.bindingRef = 0;
      this.timeout = this.socket.timeout;
      this.joinedOnce = false;
      this.joinPush = new Push(this, CHANNEL_EVENTS.join, this.params, this.timeout);
      this.pushBuffer = [];
      this.stateChangeRefs = [];
      this.rejoinTimer = new Timer(() => {
        if (this.socket.isConnected()) {
          this.rejoin();
        }
      }, this.socket.rejoinAfterMs);
      this.stateChangeRefs.push(this.socket.onError(() => this.rejoinTimer.reset()));
      this.stateChangeRefs.push(this.socket.onOpen(() => {
        this.rejoinTimer.reset();
        if (this.isErrored()) {
          this.rejoin();
        }
      }));
      this.joinPush.receive("ok", () => {
        this.state = CHANNEL_STATES.joined;
        this.rejoinTimer.reset();
        this.pushBuffer.forEach((pushEvent) => pushEvent.send());
        this.pushBuffer = [];
      });
      this.joinPush.receive("error", () => {
        this.state = CHANNEL_STATES.errored;
        if (this.socket.isConnected()) {
          this.rejoinTimer.scheduleTimeout();
        }
      });
      this.onClose(() => {
        this.rejoinTimer.reset();
        if (this.socket.hasLogger())
          this.socket.log("channel", `close ${this.topic} ${this.joinRef()}`);
        this.state = CHANNEL_STATES.closed;
        this.socket.remove(this);
      });
      this.onError((reason) => {
        if (this.socket.hasLogger())
          this.socket.log("channel", `error ${this.topic}`, reason);
        if (this.isJoining()) {
          this.joinPush.reset();
        }
        this.state = CHANNEL_STATES.errored;
        if (this.socket.isConnected()) {
          this.rejoinTimer.scheduleTimeout();
        }
      });
      this.joinPush.receive("timeout", () => {
        if (this.socket.hasLogger())
          this.socket.log("channel", `timeout ${this.topic} (${this.joinRef()})`, this.joinPush.timeout);
        let leavePush = new Push(this, CHANNEL_EVENTS.leave, closure({}), this.timeout);
        leavePush.send();
        this.state = CHANNEL_STATES.errored;
        this.joinPush.reset();
        if (this.socket.isConnected()) {
          this.rejoinTimer.scheduleTimeout();
        }
      });
      this.on(CHANNEL_EVENTS.reply, (payload, ref) => {
        this.trigger(this.replyEventName(ref), payload);
      });
    }
    join(timeout = this.timeout) {
      if (this.joinedOnce) {
        throw new Error("tried to join multiple times. 'join' can only be called a single time per channel instance");
      } else {
        this.timeout = timeout;
        this.joinedOnce = true;
        this.rejoin();
        return this.joinPush;
      }
    }
    onClose(callback) {
      this.on(CHANNEL_EVENTS.close, callback);
    }
    onError(callback) {
      return this.on(CHANNEL_EVENTS.error, (reason) => callback(reason));
    }
    on(event, callback) {
      let ref = this.bindingRef++;
      this.bindings.push({ event, ref, callback });
      return ref;
    }
    off(event, ref) {
      this.bindings = this.bindings.filter((bind) => {
        return !(bind.event === event && (typeof ref === "undefined" || ref === bind.ref));
      });
    }
    canPush() {
      return this.socket.isConnected() && this.isJoined();
    }
    push(event, payload, timeout = this.timeout) {
      payload = payload || {};
      if (!this.joinedOnce) {
        throw new Error(`tried to push '${event}' to '${this.topic}' before joining. Use channel.join() before pushing events`);
      }
      let pushEvent = new Push(this, event, function() {
        return payload;
      }, timeout);
      if (this.canPush()) {
        pushEvent.send();
      } else {
        pushEvent.startTimeout();
        this.pushBuffer.push(pushEvent);
      }
      return pushEvent;
    }
    leave(timeout = this.timeout) {
      this.rejoinTimer.reset();
      this.joinPush.cancelTimeout();
      this.state = CHANNEL_STATES.leaving;
      let onClose = () => {
        if (this.socket.hasLogger())
          this.socket.log("channel", `leave ${this.topic}`);
        this.trigger(CHANNEL_EVENTS.close, "leave");
      };
      let leavePush = new Push(this, CHANNEL_EVENTS.leave, closure({}), timeout);
      leavePush.receive("ok", () => onClose()).receive("timeout", () => onClose());
      leavePush.send();
      if (!this.canPush()) {
        leavePush.trigger("ok", {});
      }
      return leavePush;
    }
    onMessage(_event, payload, _ref) {
      return payload;
    }
    isMember(topic, event, payload, joinRef) {
      if (this.topic !== topic) {
        return false;
      }
      if (joinRef && joinRef !== this.joinRef()) {
        if (this.socket.hasLogger())
          this.socket.log("channel", "dropping outdated message", { topic, event, payload, joinRef });
        return false;
      } else {
        return true;
      }
    }
    joinRef() {
      return this.joinPush.ref;
    }
    rejoin(timeout = this.timeout) {
      if (this.isLeaving()) {
        return;
      }
      this.socket.leaveOpenTopic(this.topic);
      this.state = CHANNEL_STATES.joining;
      this.joinPush.resend(timeout);
    }
    trigger(event, payload, ref, joinRef) {
      let handledPayload = this.onMessage(event, payload, ref, joinRef);
      if (payload && !handledPayload) {
        throw new Error("channel onMessage callbacks must return the payload, modified or unmodified");
      }
      let eventBindings = this.bindings.filter((bind) => bind.event === event);
      for (let i = 0; i < eventBindings.length; i++) {
        let bind = eventBindings[i];
        bind.callback(handledPayload, ref, joinRef || this.joinRef());
      }
    }
    replyEventName(ref) {
      return `chan_reply_${ref}`;
    }
    isClosed() {
      return this.state === CHANNEL_STATES.closed;
    }
    isErrored() {
      return this.state === CHANNEL_STATES.errored;
    }
    isJoined() {
      return this.state === CHANNEL_STATES.joined;
    }
    isJoining() {
      return this.state === CHANNEL_STATES.joining;
    }
    isLeaving() {
      return this.state === CHANNEL_STATES.leaving;
    }
  };
  var Ajax = class {
    static request(method, endPoint, accept, body, timeout, ontimeout, callback) {
      if (global.XDomainRequest) {
        let req = new global.XDomainRequest();
        return this.xdomainRequest(req, method, endPoint, body, timeout, ontimeout, callback);
      } else {
        let req = new global.XMLHttpRequest();
        return this.xhrRequest(req, method, endPoint, accept, body, timeout, ontimeout, callback);
      }
    }
    static xdomainRequest(req, method, endPoint, body, timeout, ontimeout, callback) {
      req.timeout = timeout;
      req.open(method, endPoint);
      req.onload = () => {
        let response = this.parseJSON(req.responseText);
        callback && callback(response);
      };
      if (ontimeout) {
        req.ontimeout = ontimeout;
      }
      req.onprogress = () => {
      };
      req.send(body);
      return req;
    }
    static xhrRequest(req, method, endPoint, accept, body, timeout, ontimeout, callback) {
      req.open(method, endPoint, true);
      req.timeout = timeout;
      req.setRequestHeader("Content-Type", accept);
      req.onerror = () => callback && callback(null);
      req.onreadystatechange = () => {
        if (req.readyState === XHR_STATES.complete && callback) {
          let response = this.parseJSON(req.responseText);
          callback(response);
        }
      };
      if (ontimeout) {
        req.ontimeout = ontimeout;
      }
      req.send(body);
      return req;
    }
    static parseJSON(resp) {
      if (!resp || resp === "") {
        return null;
      }
      try {
        return JSON.parse(resp);
      } catch (e) {
        console && console.log("failed to parse JSON response", resp);
        return null;
      }
    }
    static serialize(obj, parentKey) {
      let queryStr = [];
      for (var key in obj) {
        if (!Object.prototype.hasOwnProperty.call(obj, key)) {
          continue;
        }
        let paramKey = parentKey ? `${parentKey}[${key}]` : key;
        let paramVal = obj[key];
        if (typeof paramVal === "object") {
          queryStr.push(this.serialize(paramVal, paramKey));
        } else {
          queryStr.push(encodeURIComponent(paramKey) + "=" + encodeURIComponent(paramVal));
        }
      }
      return queryStr.join("&");
    }
    static appendParams(url, params) {
      if (Object.keys(params).length === 0) {
        return url;
      }
      let prefix = url.match(/\?/) ? "&" : "?";
      return `${url}${prefix}${this.serialize(params)}`;
    }
  };
  var LongPoll = class {
    constructor(endPoint) {
      this.endPoint = null;
      this.token = null;
      this.skipHeartbeat = true;
      this.reqs = /* @__PURE__ */ new Set();
      this.onopen = function() {
      };
      this.onerror = function() {
      };
      this.onmessage = function() {
      };
      this.onclose = function() {
      };
      this.pollEndpoint = this.normalizeEndpoint(endPoint);
      this.readyState = SOCKET_STATES.connecting;
      this.poll();
    }
    normalizeEndpoint(endPoint) {
      return endPoint.replace("ws://", "http://").replace("wss://", "https://").replace(new RegExp("(.*)/" + TRANSPORTS.websocket), "$1/" + TRANSPORTS.longpoll);
    }
    endpointURL() {
      return Ajax.appendParams(this.pollEndpoint, { token: this.token });
    }
    closeAndRetry(code, reason, wasClean) {
      this.close(code, reason, wasClean);
      this.readyState = SOCKET_STATES.connecting;
    }
    ontimeout() {
      this.onerror("timeout");
      this.closeAndRetry(1005, "timeout", false);
    }
    isActive() {
      return this.readyState === SOCKET_STATES.open || this.readyState === SOCKET_STATES.connecting;
    }
    poll() {
      this.ajax("GET", null, () => this.ontimeout(), (resp) => {
        if (resp) {
          var { status, token, messages } = resp;
          this.token = token;
        } else {
          status = 0;
        }
        switch (status) {
          case 200:
            messages.forEach((msg) => {
              setTimeout(() => this.onmessage({ data: msg }), 0);
            });
            this.poll();
            break;
          case 204:
            this.poll();
            break;
          case 410:
            this.readyState = SOCKET_STATES.open;
            this.onopen({});
            this.poll();
            break;
          case 403:
            this.onerror(403);
            this.close(1008, "forbidden", false);
            break;
          case 0:
          case 500:
            this.onerror(500);
            this.closeAndRetry(1011, "internal server error", 500);
            break;
          default:
            throw new Error(`unhandled poll status ${status}`);
        }
      });
    }
    send(body) {
      this.ajax("POST", body, () => this.onerror("timeout"), (resp) => {
        if (!resp || resp.status !== 200) {
          this.onerror(resp && resp.status);
          this.closeAndRetry(1011, "internal server error", false);
        }
      });
    }
    close(code, reason, wasClean) {
      for (let req of this.reqs) {
        req.abort();
      }
      this.readyState = SOCKET_STATES.closed;
      let opts = Object.assign({ code: 1e3, reason: void 0, wasClean: true }, { code, reason, wasClean });
      if (typeof CloseEvent !== "undefined") {
        this.onclose(new CloseEvent("close", opts));
      } else {
        this.onclose(opts);
      }
    }
    ajax(method, body, onCallerTimeout, callback) {
      let req;
      let ontimeout = () => {
        this.reqs.delete(req);
        onCallerTimeout();
      };
      req = Ajax.request(method, this.endpointURL(), "application/json", body, this.timeout, ontimeout, (resp) => {
        this.reqs.delete(req);
        if (this.isActive()) {
          callback(resp);
        }
      });
      this.reqs.add(req);
    }
  };
  var serializer_default = {
    HEADER_LENGTH: 1,
    META_LENGTH: 4,
    KINDS: { push: 0, reply: 1, broadcast: 2 },
    encode(msg, callback) {
      if (msg.payload.constructor === ArrayBuffer) {
        return callback(this.binaryEncode(msg));
      } else {
        let payload = [msg.join_ref, msg.ref, msg.topic, msg.event, msg.payload];
        return callback(JSON.stringify(payload));
      }
    },
    decode(rawPayload, callback) {
      if (rawPayload.constructor === ArrayBuffer) {
        return callback(this.binaryDecode(rawPayload));
      } else {
        let [join_ref, ref, topic, event, payload] = JSON.parse(rawPayload);
        return callback({ join_ref, ref, topic, event, payload });
      }
    },
    binaryEncode(message) {
      let { join_ref, ref, event, topic, payload } = message;
      let metaLength = this.META_LENGTH + join_ref.length + ref.length + topic.length + event.length;
      let header = new ArrayBuffer(this.HEADER_LENGTH + metaLength);
      let view = new DataView(header);
      let offset = 0;
      view.setUint8(offset++, this.KINDS.push);
      view.setUint8(offset++, join_ref.length);
      view.setUint8(offset++, ref.length);
      view.setUint8(offset++, topic.length);
      view.setUint8(offset++, event.length);
      Array.from(join_ref, (char) => view.setUint8(offset++, char.charCodeAt(0)));
      Array.from(ref, (char) => view.setUint8(offset++, char.charCodeAt(0)));
      Array.from(topic, (char) => view.setUint8(offset++, char.charCodeAt(0)));
      Array.from(event, (char) => view.setUint8(offset++, char.charCodeAt(0)));
      var combined = new Uint8Array(header.byteLength + payload.byteLength);
      combined.set(new Uint8Array(header), 0);
      combined.set(new Uint8Array(payload), header.byteLength);
      return combined.buffer;
    },
    binaryDecode(buffer) {
      let view = new DataView(buffer);
      let kind = view.getUint8(0);
      let decoder = new TextDecoder();
      switch (kind) {
        case this.KINDS.push:
          return this.decodePush(buffer, view, decoder);
        case this.KINDS.reply:
          return this.decodeReply(buffer, view, decoder);
        case this.KINDS.broadcast:
          return this.decodeBroadcast(buffer, view, decoder);
      }
    },
    decodePush(buffer, view, decoder) {
      let joinRefSize = view.getUint8(1);
      let topicSize = view.getUint8(2);
      let eventSize = view.getUint8(3);
      let offset = this.HEADER_LENGTH + this.META_LENGTH - 1;
      let joinRef = decoder.decode(buffer.slice(offset, offset + joinRefSize));
      offset = offset + joinRefSize;
      let topic = decoder.decode(buffer.slice(offset, offset + topicSize));
      offset = offset + topicSize;
      let event = decoder.decode(buffer.slice(offset, offset + eventSize));
      offset = offset + eventSize;
      let data = buffer.slice(offset, buffer.byteLength);
      return { join_ref: joinRef, ref: null, topic, event, payload: data };
    },
    decodeReply(buffer, view, decoder) {
      let joinRefSize = view.getUint8(1);
      let refSize = view.getUint8(2);
      let topicSize = view.getUint8(3);
      let eventSize = view.getUint8(4);
      let offset = this.HEADER_LENGTH + this.META_LENGTH;
      let joinRef = decoder.decode(buffer.slice(offset, offset + joinRefSize));
      offset = offset + joinRefSize;
      let ref = decoder.decode(buffer.slice(offset, offset + refSize));
      offset = offset + refSize;
      let topic = decoder.decode(buffer.slice(offset, offset + topicSize));
      offset = offset + topicSize;
      let event = decoder.decode(buffer.slice(offset, offset + eventSize));
      offset = offset + eventSize;
      let data = buffer.slice(offset, buffer.byteLength);
      let payload = { status: event, response: data };
      return { join_ref: joinRef, ref, topic, event: CHANNEL_EVENTS.reply, payload };
    },
    decodeBroadcast(buffer, view, decoder) {
      let topicSize = view.getUint8(1);
      let eventSize = view.getUint8(2);
      let offset = this.HEADER_LENGTH + 2;
      let topic = decoder.decode(buffer.slice(offset, offset + topicSize));
      offset = offset + topicSize;
      let event = decoder.decode(buffer.slice(offset, offset + eventSize));
      offset = offset + eventSize;
      let data = buffer.slice(offset, buffer.byteLength);
      return { join_ref: null, ref: null, topic, event, payload: data };
    }
  };
  var Socket = class {
    constructor(endPoint, opts = {}) {
      this.stateChangeCallbacks = { open: [], close: [], error: [], message: [] };
      this.channels = [];
      this.sendBuffer = [];
      this.ref = 0;
      this.timeout = opts.timeout || DEFAULT_TIMEOUT;
      this.transport = opts.transport || global.WebSocket || LongPoll;
      this.establishedConnections = 0;
      this.defaultEncoder = serializer_default.encode.bind(serializer_default);
      this.defaultDecoder = serializer_default.decode.bind(serializer_default);
      this.closeWasClean = false;
      this.binaryType = opts.binaryType || "arraybuffer";
      this.connectClock = 1;
      if (this.transport !== LongPoll) {
        this.encode = opts.encode || this.defaultEncoder;
        this.decode = opts.decode || this.defaultDecoder;
      } else {
        this.encode = this.defaultEncoder;
        this.decode = this.defaultDecoder;
      }
      let awaitingConnectionOnPageShow = null;
      if (phxWindow && phxWindow.addEventListener) {
        phxWindow.addEventListener("pagehide", (_e) => {
          if (this.conn) {
            this.disconnect();
            awaitingConnectionOnPageShow = this.connectClock;
          }
        });
        phxWindow.addEventListener("pageshow", (_e) => {
          if (awaitingConnectionOnPageShow === this.connectClock) {
            awaitingConnectionOnPageShow = null;
            this.connect();
          }
        });
      }
      this.heartbeatIntervalMs = opts.heartbeatIntervalMs || 3e4;
      this.rejoinAfterMs = (tries) => {
        if (opts.rejoinAfterMs) {
          return opts.rejoinAfterMs(tries);
        } else {
          return [1e3, 2e3, 5e3][tries - 1] || 1e4;
        }
      };
      this.reconnectAfterMs = (tries) => {
        if (opts.reconnectAfterMs) {
          return opts.reconnectAfterMs(tries);
        } else {
          return [10, 50, 100, 150, 200, 250, 500, 1e3, 2e3][tries - 1] || 5e3;
        }
      };
      this.logger = opts.logger || null;
      this.longpollerTimeout = opts.longpollerTimeout || 2e4;
      this.params = closure(opts.params || {});
      this.endPoint = `${endPoint}/${TRANSPORTS.websocket}`;
      this.vsn = opts.vsn || DEFAULT_VSN;
      this.heartbeatTimeoutTimer = null;
      this.heartbeatTimer = null;
      this.pendingHeartbeatRef = null;
      this.reconnectTimer = new Timer(() => {
        this.teardown(() => this.connect());
      }, this.reconnectAfterMs);
    }
    getLongPollTransport() {
      return LongPoll;
    }
    replaceTransport(newTransport) {
      this.connectClock++;
      this.closeWasClean = true;
      this.reconnectTimer.reset();
      this.sendBuffer = [];
      if (this.conn) {
        this.conn.close();
        this.conn = null;
      }
      this.transport = newTransport;
    }
    protocol() {
      return location.protocol.match(/^https/) ? "wss" : "ws";
    }
    endPointURL() {
      let uri = Ajax.appendParams(Ajax.appendParams(this.endPoint, this.params()), { vsn: this.vsn });
      if (uri.charAt(0) !== "/") {
        return uri;
      }
      if (uri.charAt(1) === "/") {
        return `${this.protocol()}:${uri}`;
      }
      return `${this.protocol()}://${location.host}${uri}`;
    }
    disconnect(callback, code, reason) {
      this.connectClock++;
      this.closeWasClean = true;
      this.reconnectTimer.reset();
      this.teardown(callback, code, reason);
    }
    connect(params) {
      if (params) {
        console && console.log("passing params to connect is deprecated. Instead pass :params to the Socket constructor");
        this.params = closure(params);
      }
      if (this.conn) {
        return;
      }
      this.connectClock++;
      this.closeWasClean = false;
      this.conn = new this.transport(this.endPointURL());
      this.conn.binaryType = this.binaryType;
      this.conn.timeout = this.longpollerTimeout;
      this.conn.onopen = () => this.onConnOpen();
      this.conn.onerror = (error) => this.onConnError(error);
      this.conn.onmessage = (event) => this.onConnMessage(event);
      this.conn.onclose = (event) => this.onConnClose(event);
    }
    log(kind, msg, data) {
      this.logger(kind, msg, data);
    }
    hasLogger() {
      return this.logger !== null;
    }
    onOpen(callback) {
      let ref = this.makeRef();
      this.stateChangeCallbacks.open.push([ref, callback]);
      return ref;
    }
    onClose(callback) {
      let ref = this.makeRef();
      this.stateChangeCallbacks.close.push([ref, callback]);
      return ref;
    }
    onError(callback) {
      let ref = this.makeRef();
      this.stateChangeCallbacks.error.push([ref, callback]);
      return ref;
    }
    onMessage(callback) {
      let ref = this.makeRef();
      this.stateChangeCallbacks.message.push([ref, callback]);
      return ref;
    }
    ping(callback) {
      if (!this.isConnected()) {
        return false;
      }
      let ref = this.makeRef();
      let startTime = Date.now();
      this.push({ topic: "phoenix", event: "heartbeat", payload: {}, ref });
      let onMsgRef = this.onMessage((msg) => {
        if (msg.ref === ref) {
          this.off([onMsgRef]);
          callback(Date.now() - startTime);
        }
      });
      return true;
    }
    clearHeartbeats() {
      clearTimeout(this.heartbeatTimer);
      clearTimeout(this.heartbeatTimeoutTimer);
    }
    onConnOpen() {
      if (this.hasLogger())
        this.log("transport", `connected to ${this.endPointURL()}`);
      this.closeWasClean = false;
      this.establishedConnections++;
      this.flushSendBuffer();
      this.reconnectTimer.reset();
      this.resetHeartbeat();
      this.stateChangeCallbacks.open.forEach(([, callback]) => callback());
    }
    heartbeatTimeout() {
      if (this.pendingHeartbeatRef) {
        this.pendingHeartbeatRef = null;
        if (this.hasLogger()) {
          this.log("transport", "heartbeat timeout. Attempting to re-establish connection");
        }
        this.triggerChanError();
        this.closeWasClean = false;
        this.teardown(() => this.reconnectTimer.scheduleTimeout(), WS_CLOSE_NORMAL, "heartbeat timeout");
      }
    }
    resetHeartbeat() {
      if (this.conn && this.conn.skipHeartbeat) {
        return;
      }
      this.pendingHeartbeatRef = null;
      this.clearHeartbeats();
      this.heartbeatTimer = setTimeout(() => this.sendHeartbeat(), this.heartbeatIntervalMs);
    }
    teardown(callback, code, reason) {
      if (!this.conn) {
        return callback && callback();
      }
      this.waitForBufferDone(() => {
        if (this.conn) {
          if (code) {
            this.conn.close(code, reason || "");
          } else {
            this.conn.close();
          }
        }
        this.waitForSocketClosed(() => {
          if (this.conn) {
            this.conn.onopen = function() {
            };
            this.conn.onerror = function() {
            };
            this.conn.onmessage = function() {
            };
            this.conn.onclose = function() {
            };
            this.conn = null;
          }
          callback && callback();
        });
      });
    }
    waitForBufferDone(callback, tries = 1) {
      if (tries === 5 || !this.conn || !this.conn.bufferedAmount) {
        callback();
        return;
      }
      setTimeout(() => {
        this.waitForBufferDone(callback, tries + 1);
      }, 150 * tries);
    }
    waitForSocketClosed(callback, tries = 1) {
      if (tries === 5 || !this.conn || this.conn.readyState === SOCKET_STATES.closed) {
        callback();
        return;
      }
      setTimeout(() => {
        this.waitForSocketClosed(callback, tries + 1);
      }, 150 * tries);
    }
    onConnClose(event) {
      let closeCode = event && event.code;
      if (this.hasLogger())
        this.log("transport", "close", event);
      this.triggerChanError();
      this.clearHeartbeats();
      if (!this.closeWasClean && closeCode !== 1e3) {
        this.reconnectTimer.scheduleTimeout();
      }
      this.stateChangeCallbacks.close.forEach(([, callback]) => callback(event));
    }
    onConnError(error) {
      if (this.hasLogger())
        this.log("transport", error);
      let transportBefore = this.transport;
      let establishedBefore = this.establishedConnections;
      this.stateChangeCallbacks.error.forEach(([, callback]) => {
        callback(error, transportBefore, establishedBefore);
      });
      if (transportBefore === this.transport || establishedBefore > 0) {
        this.triggerChanError();
      }
    }
    triggerChanError() {
      this.channels.forEach((channel) => {
        if (!(channel.isErrored() || channel.isLeaving() || channel.isClosed())) {
          channel.trigger(CHANNEL_EVENTS.error);
        }
      });
    }
    connectionState() {
      switch (this.conn && this.conn.readyState) {
        case SOCKET_STATES.connecting:
          return "connecting";
        case SOCKET_STATES.open:
          return "open";
        case SOCKET_STATES.closing:
          return "closing";
        default:
          return "closed";
      }
    }
    isConnected() {
      return this.connectionState() === "open";
    }
    remove(channel) {
      this.off(channel.stateChangeRefs);
      this.channels = this.channels.filter((c) => c.joinRef() !== channel.joinRef());
    }
    off(refs) {
      for (let key in this.stateChangeCallbacks) {
        this.stateChangeCallbacks[key] = this.stateChangeCallbacks[key].filter(([ref]) => {
          return refs.indexOf(ref) === -1;
        });
      }
    }
    channel(topic, chanParams = {}) {
      let chan = new Channel(topic, chanParams, this);
      this.channels.push(chan);
      return chan;
    }
    push(data) {
      if (this.hasLogger()) {
        let { topic, event, payload, ref, join_ref } = data;
        this.log("push", `${topic} ${event} (${join_ref}, ${ref})`, payload);
      }
      if (this.isConnected()) {
        this.encode(data, (result) => this.conn.send(result));
      } else {
        this.sendBuffer.push(() => this.encode(data, (result) => this.conn.send(result)));
      }
    }
    makeRef() {
      let newRef = this.ref + 1;
      if (newRef === this.ref) {
        this.ref = 0;
      } else {
        this.ref = newRef;
      }
      return this.ref.toString();
    }
    sendHeartbeat() {
      if (this.pendingHeartbeatRef && !this.isConnected()) {
        return;
      }
      this.pendingHeartbeatRef = this.makeRef();
      this.push({ topic: "phoenix", event: "heartbeat", payload: {}, ref: this.pendingHeartbeatRef });
      this.heartbeatTimeoutTimer = setTimeout(() => this.heartbeatTimeout(), this.heartbeatIntervalMs);
    }
    flushSendBuffer() {
      if (this.isConnected() && this.sendBuffer.length > 0) {
        this.sendBuffer.forEach((callback) => callback());
        this.sendBuffer = [];
      }
    }
    onConnMessage(rawMessage) {
      this.decode(rawMessage.data, (msg) => {
        let { topic, event, payload, ref, join_ref } = msg;
        if (ref && ref === this.pendingHeartbeatRef) {
          this.clearHeartbeats();
          this.pendingHeartbeatRef = null;
          this.heartbeatTimer = setTimeout(() => this.sendHeartbeat(), this.heartbeatIntervalMs);
        }
        if (this.hasLogger())
          this.log("receive", `${payload.status || ""} ${topic} ${event} ${ref && "(" + ref + ")" || ""}`, payload);
        for (let i = 0; i < this.channels.length; i++) {
          const channel = this.channels[i];
          if (!channel.isMember(topic, event, payload, join_ref)) {
            continue;
          }
          channel.trigger(event, payload, ref, join_ref);
        }
        for (let i = 0; i < this.stateChangeCallbacks.message.length; i++) {
          let [, callback] = this.stateChangeCallbacks.message[i];
          callback(msg);
        }
      });
    }
    leaveOpenTopic(topic) {
      let dupChannel = this.channels.find((c) => c.topic === topic && (c.isJoined() || c.isJoining()));
      if (dupChannel) {
        if (this.hasLogger())
          this.log("transport", `leaving duplicate topic "${topic}"`);
        dupChannel.leave();
      }
    }
  };

  // ../deps/phoenix_live_view/priv/static/phoenix_live_view.esm.js
  var CONSECUTIVE_RELOADS = "consecutive-reloads";
  var MAX_RELOADS = 10;
  var RELOAD_JITTER_MIN = 5e3;
  var RELOAD_JITTER_MAX = 1e4;
  var FAILSAFE_JITTER = 3e4;
  var PHX_EVENT_CLASSES = [
    "phx-click-loading",
    "phx-change-loading",
    "phx-submit-loading",
    "phx-keydown-loading",
    "phx-keyup-loading",
    "phx-blur-loading",
    "phx-focus-loading"
  ];
  var PHX_COMPONENT = "data-phx-component";
  var PHX_LIVE_LINK = "data-phx-link";
  var PHX_TRACK_STATIC = "track-static";
  var PHX_LINK_STATE = "data-phx-link-state";
  var PHX_REF = "data-phx-ref";
  var PHX_REF_SRC = "data-phx-ref-src";
  var PHX_TRACK_UPLOADS = "track-uploads";
  var PHX_UPLOAD_REF = "data-phx-upload-ref";
  var PHX_PREFLIGHTED_REFS = "data-phx-preflighted-refs";
  var PHX_DONE_REFS = "data-phx-done-refs";
  var PHX_DROP_TARGET = "drop-target";
  var PHX_ACTIVE_ENTRY_REFS = "data-phx-active-refs";
  var PHX_LIVE_FILE_UPDATED = "phx:live-file:updated";
  var PHX_SKIP = "data-phx-skip";
  var PHX_PRUNE = "data-phx-prune";
  var PHX_PAGE_LOADING = "page-loading";
  var PHX_CONNECTED_CLASS = "phx-connected";
  var PHX_DISCONNECTED_CLASS = "phx-loading";
  var PHX_NO_FEEDBACK_CLASS = "phx-no-feedback";
  var PHX_ERROR_CLASS = "phx-error";
  var PHX_PARENT_ID = "data-phx-parent-id";
  var PHX_MAIN = "data-phx-main";
  var PHX_ROOT_ID = "data-phx-root-id";
  var PHX_TRIGGER_ACTION = "trigger-action";
  var PHX_FEEDBACK_FOR = "feedback-for";
  var PHX_HAS_FOCUSED = "phx-has-focused";
  var FOCUSABLE_INPUTS = ["text", "textarea", "number", "email", "password", "search", "tel", "url", "date", "time", "datetime-local", "color", "range"];
  var CHECKABLE_INPUTS = ["checkbox", "radio"];
  var PHX_HAS_SUBMITTED = "phx-has-submitted";
  var PHX_SESSION = "data-phx-session";
  var PHX_VIEW_SELECTOR = `[${PHX_SESSION}]`;
  var PHX_STICKY = "data-phx-sticky";
  var PHX_STATIC = "data-phx-static";
  var PHX_READONLY = "data-phx-readonly";
  var PHX_DISABLED = "data-phx-disabled";
  var PHX_DISABLE_WITH = "disable-with";
  var PHX_DISABLE_WITH_RESTORE = "data-phx-disable-with-restore";
  var PHX_HOOK = "hook";
  var PHX_DEBOUNCE = "debounce";
  var PHX_THROTTLE = "throttle";
  var PHX_UPDATE = "update";
  var PHX_KEY = "key";
  var PHX_PRIVATE = "phxPrivate";
  var PHX_AUTO_RECOVER = "auto-recover";
  var PHX_LV_DEBUG = "phx:live-socket:debug";
  var PHX_LV_PROFILE = "phx:live-socket:profiling";
  var PHX_LV_LATENCY_SIM = "phx:live-socket:latency-sim";
  var PHX_PROGRESS = "progress";
  var LOADER_TIMEOUT = 1;
  var BEFORE_UNLOAD_LOADER_TIMEOUT = 200;
  var BINDING_PREFIX = "phx-";
  var PUSH_TIMEOUT = 3e4;
  var DEBOUNCE_TRIGGER = "debounce-trigger";
  var THROTTLED = "throttled";
  var DEBOUNCE_PREV_KEY = "debounce-prev-key";
  var DEFAULTS = {
    debounce: 300,
    throttle: 300
  };
  var DYNAMICS = "d";
  var STATIC = "s";
  var COMPONENTS = "c";
  var EVENTS = "e";
  var REPLY = "r";
  var TITLE = "t";
  var TEMPLATES = "p";
  var EntryUploader = class {
    constructor(entry, chunkSize, liveSocket2) {
      this.liveSocket = liveSocket2;
      this.entry = entry;
      this.offset = 0;
      this.chunkSize = chunkSize;
      this.chunkTimer = null;
      this.uploadChannel = liveSocket2.channel(`lvu:${entry.ref}`, { token: entry.metadata() });
    }
    error(reason) {
      clearTimeout(this.chunkTimer);
      this.uploadChannel.leave();
      this.entry.error(reason);
    }
    upload() {
      this.uploadChannel.onError((reason) => this.error(reason));
      this.uploadChannel.join().receive("ok", (_data) => this.readNextChunk()).receive("error", (reason) => this.error(reason));
    }
    isDone() {
      return this.offset >= this.entry.file.size;
    }
    readNextChunk() {
      let reader = new window.FileReader();
      let blob = this.entry.file.slice(this.offset, this.chunkSize + this.offset);
      reader.onload = (e) => {
        if (e.target.error === null) {
          this.offset += e.target.result.byteLength;
          this.pushChunk(e.target.result);
        } else {
          return logError("Read error: " + e.target.error);
        }
      };
      reader.readAsArrayBuffer(blob);
    }
    pushChunk(chunk) {
      if (!this.uploadChannel.isJoined()) {
        return;
      }
      this.uploadChannel.push("chunk", chunk).receive("ok", () => {
        this.entry.progress(this.offset / this.entry.file.size * 100);
        if (!this.isDone()) {
          this.chunkTimer = setTimeout(() => this.readNextChunk(), this.liveSocket.getLatencySim() || 0);
        }
      });
    }
  };
  var logError = (msg, obj) => console.error && console.error(msg, obj);
  var isCid = (cid) => {
    let type = typeof cid;
    return type === "number" || type === "string" && /^(0|[1-9]\d*)$/.test(cid);
  };
  function detectDuplicateIds() {
    let ids = /* @__PURE__ */ new Set();
    let elems = document.querySelectorAll("*[id]");
    for (let i = 0, len = elems.length; i < len; i++) {
      if (ids.has(elems[i].id)) {
        console.error(`Multiple IDs detected: ${elems[i].id}. Ensure unique element ids.`);
      } else {
        ids.add(elems[i].id);
      }
    }
  }
  var debug = (view, kind, msg, obj) => {
    if (view.liveSocket.isDebugEnabled()) {
      console.log(`${view.id} ${kind}: ${msg} - `, obj);
    }
  };
  var closure2 = (val) => typeof val === "function" ? val : function() {
    return val;
  };
  var clone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
  };
  var closestPhxBinding = (el, binding, borderEl) => {
    do {
      if (el.matches(`[${binding}]`)) {
        return el;
      }
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1 && !(borderEl && borderEl.isSameNode(el) || el.matches(PHX_VIEW_SELECTOR)));
    return null;
  };
  var isObject = (obj) => {
    return obj !== null && typeof obj === "object" && !(obj instanceof Array);
  };
  var isEqualObj = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2);
  var isEmpty = (obj) => {
    for (let x in obj) {
      return false;
    }
    return true;
  };
  var maybe = (el, callback) => el && callback(el);
  var channelUploader = function(entries, onError, resp, liveSocket2) {
    entries.forEach((entry) => {
      let entryUploader = new EntryUploader(entry, resp.config.chunk_size, liveSocket2);
      entryUploader.upload();
    });
  };
  var Browser = {
    canPushState() {
      return typeof history.pushState !== "undefined";
    },
    dropLocal(localStorage, namespace, subkey) {
      return localStorage.removeItem(this.localKey(namespace, subkey));
    },
    updateLocal(localStorage, namespace, subkey, initial, func) {
      let current = this.getLocal(localStorage, namespace, subkey);
      let key = this.localKey(namespace, subkey);
      let newVal = current === null ? initial : func(current);
      localStorage.setItem(key, JSON.stringify(newVal));
      return newVal;
    },
    getLocal(localStorage, namespace, subkey) {
      return JSON.parse(localStorage.getItem(this.localKey(namespace, subkey)));
    },
    updateCurrentState(callback) {
      if (!this.canPushState()) {
        return;
      }
      history.replaceState(callback(history.state || {}), "", window.location.href);
    },
    pushState(kind, meta, to) {
      if (this.canPushState()) {
        if (to !== window.location.href) {
          if (meta.type == "redirect" && meta.scroll) {
            let currentState = history.state || {};
            currentState.scroll = meta.scroll;
            history.replaceState(currentState, "", window.location.href);
          }
          delete meta.scroll;
          history[kind + "State"](meta, "", to || null);
          let hashEl = this.getHashTargetEl(window.location.hash);
          if (hashEl) {
            hashEl.scrollIntoView();
          } else if (meta.type === "redirect") {
            window.scroll(0, 0);
          }
        }
      } else {
        this.redirect(to);
      }
    },
    setCookie(name, value) {
      document.cookie = `${name}=${value}`;
    },
    getCookie(name) {
      return document.cookie.replace(new RegExp(`(?:(?:^|.*;s*)${name}s*=s*([^;]*).*$)|^.*$`), "$1");
    },
    redirect(toURL, flash) {
      if (flash) {
        Browser.setCookie("__phoenix_flash__", flash + "; max-age=60000; path=/");
      }
      window.location = toURL;
    },
    localKey(namespace, subkey) {
      return `${namespace}-${subkey}`;
    },
    getHashTargetEl(maybeHash) {
      let hash = maybeHash.toString().substring(1);
      if (hash === "") {
        return;
      }
      return document.getElementById(hash) || document.querySelector(`a[name="${hash}"]`);
    }
  };
  var browser_default = Browser;
  var DOM = {
    byId(id) {
      return document.getElementById(id) || logError(`no id found for ${id}`);
    },
    removeClass(el, className) {
      el.classList.remove(className);
      if (el.classList.length === 0) {
        el.removeAttribute("class");
      }
    },
    all(node, query, callback) {
      if (!node) {
        return [];
      }
      let array = Array.from(node.querySelectorAll(query));
      return callback ? array.forEach(callback) : array;
    },
    childNodeLength(html) {
      let template = document.createElement("template");
      template.innerHTML = html;
      return template.content.childElementCount;
    },
    isUploadInput(el) {
      return el.type === "file" && el.getAttribute(PHX_UPLOAD_REF) !== null;
    },
    findUploadInputs(node) {
      return this.all(node, `input[type="file"][${PHX_UPLOAD_REF}]`);
    },
    findComponentNodeList(node, cid) {
      return this.filterWithinSameLiveView(this.all(node, `[${PHX_COMPONENT}="${cid}"]`), node);
    },
    isPhxDestroyed(node) {
      return node.id && DOM.private(node, "destroyed") ? true : false;
    },
    markPhxChildDestroyed(el) {
      if (this.isPhxChild(el)) {
        el.setAttribute(PHX_SESSION, "");
      }
      this.putPrivate(el, "destroyed", true);
    },
    findPhxChildrenInFragment(html, parentId) {
      let template = document.createElement("template");
      template.innerHTML = html;
      return this.findPhxChildren(template.content, parentId);
    },
    isIgnored(el, phxUpdate) {
      return (el.getAttribute(phxUpdate) || el.getAttribute("data-phx-update")) === "ignore";
    },
    isPhxUpdate(el, phxUpdate, updateTypes) {
      return el.getAttribute && updateTypes.indexOf(el.getAttribute(phxUpdate)) >= 0;
    },
    findPhxSticky(el) {
      return this.all(el, `[${PHX_STICKY}]`);
    },
    findPhxChildren(el, parentId) {
      return this.all(el, `${PHX_VIEW_SELECTOR}[${PHX_PARENT_ID}="${parentId}"]`);
    },
    findParentCIDs(node, cids) {
      let initial = new Set(cids);
      return cids.reduce((acc, cid) => {
        let selector = `[${PHX_COMPONENT}="${cid}"] [${PHX_COMPONENT}]`;
        this.filterWithinSameLiveView(this.all(node, selector), node).map((el) => parseInt(el.getAttribute(PHX_COMPONENT))).forEach((childCID) => acc.delete(childCID));
        return acc;
      }, initial);
    },
    filterWithinSameLiveView(nodes, parent) {
      if (parent.querySelector(PHX_VIEW_SELECTOR)) {
        return nodes.filter((el) => this.withinSameLiveView(el, parent));
      } else {
        return nodes;
      }
    },
    withinSameLiveView(node, parent) {
      while (node = node.parentNode) {
        if (node.isSameNode(parent)) {
          return true;
        }
        if (node.getAttribute(PHX_SESSION) !== null) {
          return false;
        }
      }
    },
    private(el, key) {
      return el[PHX_PRIVATE] && el[PHX_PRIVATE][key];
    },
    deletePrivate(el, key) {
      el[PHX_PRIVATE] && delete el[PHX_PRIVATE][key];
    },
    putPrivate(el, key, value) {
      if (!el[PHX_PRIVATE]) {
        el[PHX_PRIVATE] = {};
      }
      el[PHX_PRIVATE][key] = value;
    },
    updatePrivate(el, key, defaultVal, updateFunc) {
      let existing = this.private(el, key);
      if (existing === void 0) {
        this.putPrivate(el, key, updateFunc(defaultVal));
      } else {
        this.putPrivate(el, key, updateFunc(existing));
      }
    },
    copyPrivates(target, source) {
      if (source[PHX_PRIVATE]) {
        target[PHX_PRIVATE] = source[PHX_PRIVATE];
      }
    },
    putTitle(str) {
      let titleEl = document.querySelector("title");
      let { prefix, suffix } = titleEl.dataset;
      document.title = `${prefix || ""}${str}${suffix || ""}`;
    },
    debounce(el, event, phxDebounce, defaultDebounce, phxThrottle, defaultThrottle, asyncFilter, callback) {
      let debounce = el.getAttribute(phxDebounce);
      let throttle = el.getAttribute(phxThrottle);
      if (debounce === "") {
        debounce = defaultDebounce;
      }
      if (throttle === "") {
        throttle = defaultThrottle;
      }
      let value = debounce || throttle;
      switch (value) {
        case null:
          return callback();
        case "blur":
          if (this.once(el, "debounce-blur")) {
            el.addEventListener("blur", () => callback());
          }
          return;
        default:
          let timeout = parseInt(value);
          let trigger = () => throttle ? this.deletePrivate(el, THROTTLED) : callback();
          let currentCycle = this.incCycle(el, DEBOUNCE_TRIGGER, trigger);
          if (isNaN(timeout)) {
            return logError(`invalid throttle/debounce value: ${value}`);
          }
          if (throttle) {
            let newKeyDown = false;
            if (event.type === "keydown") {
              let prevKey = this.private(el, DEBOUNCE_PREV_KEY);
              this.putPrivate(el, DEBOUNCE_PREV_KEY, event.key);
              newKeyDown = prevKey !== event.key;
            }
            if (!newKeyDown && this.private(el, THROTTLED)) {
              return false;
            } else {
              callback();
              this.putPrivate(el, THROTTLED, true);
              setTimeout(() => {
                if (asyncFilter()) {
                  this.triggerCycle(el, DEBOUNCE_TRIGGER);
                }
              }, timeout);
            }
          } else {
            setTimeout(() => {
              if (asyncFilter()) {
                this.triggerCycle(el, DEBOUNCE_TRIGGER, currentCycle);
              }
            }, timeout);
          }
          let form = el.form;
          if (form && this.once(form, "bind-debounce")) {
            form.addEventListener("submit", () => {
              Array.from(new FormData(form).entries(), ([name]) => {
                let input = form.querySelector(`[name="${name}"]`);
                this.incCycle(input, DEBOUNCE_TRIGGER);
                this.deletePrivate(input, THROTTLED);
              });
            });
          }
          if (this.once(el, "bind-debounce")) {
            el.addEventListener("blur", () => this.triggerCycle(el, DEBOUNCE_TRIGGER));
          }
      }
    },
    triggerCycle(el, key, currentCycle) {
      let [cycle, trigger] = this.private(el, key);
      if (!currentCycle) {
        currentCycle = cycle;
      }
      if (currentCycle === cycle) {
        this.incCycle(el, key);
        trigger();
      }
    },
    once(el, key) {
      if (this.private(el, key) === true) {
        return false;
      }
      this.putPrivate(el, key, true);
      return true;
    },
    incCycle(el, key, trigger = function() {
    }) {
      let [currentCycle] = this.private(el, key) || [0, trigger];
      currentCycle++;
      this.putPrivate(el, key, [currentCycle, trigger]);
      return currentCycle;
    },
    discardError(container, el, phxFeedbackFor) {
      let field = el.getAttribute && el.getAttribute(phxFeedbackFor);
      let input = field && container.querySelector(`[id="${field}"], [name="${field}"]`);
      if (!input) {
        return;
      }
      if (!(this.private(input, PHX_HAS_FOCUSED) || this.private(input.form, PHX_HAS_SUBMITTED))) {
        el.classList.add(PHX_NO_FEEDBACK_CLASS);
      }
    },
    showError(inputEl, phxFeedbackFor) {
      if (inputEl.id || inputEl.name) {
        this.all(inputEl.form, `[${phxFeedbackFor}="${inputEl.id}"], [${phxFeedbackFor}="${inputEl.name}"]`, (el) => {
          this.removeClass(el, PHX_NO_FEEDBACK_CLASS);
        });
      }
    },
    isPhxChild(node) {
      return node.getAttribute && node.getAttribute(PHX_PARENT_ID);
    },
    isPhxSticky(node) {
      return node.getAttribute && node.getAttribute(PHX_STICKY) !== null;
    },
    firstPhxChild(el) {
      return this.isPhxChild(el) ? el : this.all(el, `[${PHX_PARENT_ID}]`)[0];
    },
    dispatchEvent(target, name, opts = {}) {
      let bubbles = opts.bubbles === void 0 ? true : !!opts.bubbles;
      let eventOpts = { bubbles, cancelable: true, detail: opts.detail || {} };
      let event = name === "click" ? new MouseEvent("click", eventOpts) : new CustomEvent(name, eventOpts);
      target.dispatchEvent(event);
    },
    cloneNode(node, html) {
      if (typeof html === "undefined") {
        return node.cloneNode(true);
      } else {
        let cloned = node.cloneNode(false);
        cloned.innerHTML = html;
        return cloned;
      }
    },
    mergeAttrs(target, source, opts = {}) {
      let exclude = opts.exclude || [];
      let isIgnored = opts.isIgnored;
      let sourceAttrs = source.attributes;
      for (let i = sourceAttrs.length - 1; i >= 0; i--) {
        let name = sourceAttrs[i].name;
        if (exclude.indexOf(name) < 0) {
          target.setAttribute(name, source.getAttribute(name));
        }
      }
      let targetAttrs = target.attributes;
      for (let i = targetAttrs.length - 1; i >= 0; i--) {
        let name = targetAttrs[i].name;
        if (isIgnored) {
          if (name.startsWith("data-") && !source.hasAttribute(name)) {
            target.removeAttribute(name);
          }
        } else {
          if (!source.hasAttribute(name)) {
            target.removeAttribute(name);
          }
        }
      }
    },
    mergeFocusedInput(target, source) {
      if (!(target instanceof HTMLSelectElement)) {
        DOM.mergeAttrs(target, source, { exclude: ["value"] });
      }
      if (source.readOnly) {
        target.setAttribute("readonly", true);
      } else {
        target.removeAttribute("readonly");
      }
    },
    hasSelectionRange(el) {
      return el.setSelectionRange && (el.type === "text" || el.type === "textarea");
    },
    restoreFocus(focused, selectionStart, selectionEnd) {
      if (!DOM.isTextualInput(focused)) {
        return;
      }
      let wasFocused = focused.matches(":focus");
      if (focused.readOnly) {
        focused.blur();
      }
      if (!wasFocused) {
        focused.focus();
      }
      if (this.hasSelectionRange(focused)) {
        focused.setSelectionRange(selectionStart, selectionEnd);
      }
    },
    isFormInput(el) {
      return /^(?:input|select|textarea)$/i.test(el.tagName) && el.type !== "button";
    },
    syncAttrsToProps(el) {
      if (el instanceof HTMLInputElement && CHECKABLE_INPUTS.indexOf(el.type.toLocaleLowerCase()) >= 0) {
        el.checked = el.getAttribute("checked") !== null;
      }
    },
    isTextualInput(el) {
      return FOCUSABLE_INPUTS.indexOf(el.type) >= 0;
    },
    isNowTriggerFormExternal(el, phxTriggerExternal) {
      return el.getAttribute && el.getAttribute(phxTriggerExternal) !== null;
    },
    syncPendingRef(fromEl, toEl, disableWith) {
      let ref = fromEl.getAttribute(PHX_REF);
      if (ref === null) {
        return true;
      }
      let refSrc = fromEl.getAttribute(PHX_REF_SRC);
      if (DOM.isFormInput(fromEl) || fromEl.getAttribute(disableWith) !== null) {
        if (DOM.isUploadInput(fromEl)) {
          DOM.mergeAttrs(fromEl, toEl, { isIgnored: true });
        }
        DOM.putPrivate(fromEl, PHX_REF, toEl);
        return false;
      } else {
        PHX_EVENT_CLASSES.forEach((className) => {
          fromEl.classList.contains(className) && toEl.classList.add(className);
        });
        toEl.setAttribute(PHX_REF, ref);
        toEl.setAttribute(PHX_REF_SRC, refSrc);
        return true;
      }
    },
    cleanChildNodes(container, phxUpdate) {
      if (DOM.isPhxUpdate(container, phxUpdate, ["append", "prepend"])) {
        let toRemove = [];
        container.childNodes.forEach((childNode) => {
          if (!childNode.id) {
            let isEmptyTextNode = childNode.nodeType === Node.TEXT_NODE && childNode.nodeValue.trim() === "";
            if (!isEmptyTextNode) {
              logError(`only HTML element tags with an id are allowed inside containers with phx-update.

removing illegal node: "${(childNode.outerHTML || childNode.nodeValue).trim()}"

`);
            }
            toRemove.push(childNode);
          }
        });
        toRemove.forEach((childNode) => childNode.remove());
      }
    },
    replaceRootContainer(container, tagName, attrs) {
      let retainedAttrs = /* @__PURE__ */ new Set(["id", PHX_SESSION, PHX_STATIC, PHX_MAIN, PHX_ROOT_ID]);
      if (container.tagName.toLowerCase() === tagName.toLowerCase()) {
        Array.from(container.attributes).filter((attr) => !retainedAttrs.has(attr.name.toLowerCase())).forEach((attr) => container.removeAttribute(attr.name));
        Object.keys(attrs).filter((name) => !retainedAttrs.has(name.toLowerCase())).forEach((attr) => container.setAttribute(attr, attrs[attr]));
        return container;
      } else {
        let newContainer = document.createElement(tagName);
        Object.keys(attrs).forEach((attr) => newContainer.setAttribute(attr, attrs[attr]));
        retainedAttrs.forEach((attr) => newContainer.setAttribute(attr, container.getAttribute(attr)));
        newContainer.innerHTML = container.innerHTML;
        container.replaceWith(newContainer);
        return newContainer;
      }
    },
    getSticky(el, name, defaultVal) {
      let op = (DOM.private(el, "sticky") || []).find(([existingName]) => name === existingName);
      if (op) {
        let [_name, _op, stashedResult] = op;
        return stashedResult;
      } else {
        return typeof defaultVal === "function" ? defaultVal() : defaultVal;
      }
    },
    deleteSticky(el, name) {
      this.updatePrivate(el, "sticky", [], (ops) => {
        return ops.filter(([existingName, _]) => existingName !== name);
      });
    },
    putSticky(el, name, op) {
      let stashedResult = op(el);
      this.updatePrivate(el, "sticky", [], (ops) => {
        let existingIndex = ops.findIndex(([existingName]) => name === existingName);
        if (existingIndex >= 0) {
          ops[existingIndex] = [name, op, stashedResult];
        } else {
          ops.push([name, op, stashedResult]);
        }
        return ops;
      });
    },
    applyStickyOperations(el) {
      let ops = DOM.private(el, "sticky");
      if (!ops) {
        return;
      }
      ops.forEach(([name, op, _stashed]) => this.putSticky(el, name, op));
    }
  };
  var dom_default = DOM;
  var UploadEntry = class {
    static isActive(fileEl, file) {
      let isNew = file._phxRef === void 0;
      let activeRefs = fileEl.getAttribute(PHX_ACTIVE_ENTRY_REFS).split(",");
      let isActive = activeRefs.indexOf(LiveUploader.genFileRef(file)) >= 0;
      return file.size > 0 && (isNew || isActive);
    }
    static isPreflighted(fileEl, file) {
      let preflightedRefs = fileEl.getAttribute(PHX_PREFLIGHTED_REFS).split(",");
      let isPreflighted = preflightedRefs.indexOf(LiveUploader.genFileRef(file)) >= 0;
      return isPreflighted && this.isActive(fileEl, file);
    }
    constructor(fileEl, file, view) {
      this.ref = LiveUploader.genFileRef(file);
      this.fileEl = fileEl;
      this.file = file;
      this.view = view;
      this.meta = null;
      this._isCancelled = false;
      this._isDone = false;
      this._progress = 0;
      this._lastProgressSent = -1;
      this._onDone = function() {
      };
      this._onElUpdated = this.onElUpdated.bind(this);
      this.fileEl.addEventListener(PHX_LIVE_FILE_UPDATED, this._onElUpdated);
    }
    metadata() {
      return this.meta;
    }
    progress(progress) {
      this._progress = Math.floor(progress);
      if (this._progress > this._lastProgressSent) {
        if (this._progress >= 100) {
          this._progress = 100;
          this._lastProgressSent = 100;
          this._isDone = true;
          this.view.pushFileProgress(this.fileEl, this.ref, 100, () => {
            LiveUploader.untrackFile(this.fileEl, this.file);
            this._onDone();
          });
        } else {
          this._lastProgressSent = this._progress;
          this.view.pushFileProgress(this.fileEl, this.ref, this._progress);
        }
      }
    }
    cancel() {
      this._isCancelled = true;
      this._isDone = true;
      this._onDone();
    }
    isDone() {
      return this._isDone;
    }
    error(reason = "failed") {
      this.view.pushFileProgress(this.fileEl, this.ref, { error: reason });
      LiveUploader.clearFiles(this.fileEl);
    }
    onDone(callback) {
      this._onDone = () => {
        this.fileEl.removeEventListener(PHX_LIVE_FILE_UPDATED, this._onElUpdated);
        callback();
      };
    }
    onElUpdated() {
      let activeRefs = this.fileEl.getAttribute(PHX_ACTIVE_ENTRY_REFS).split(",");
      if (activeRefs.indexOf(this.ref) === -1) {
        this.cancel();
      }
    }
    toPreflightPayload() {
      return {
        last_modified: this.file.lastModified,
        name: this.file.name,
        size: this.file.size,
        type: this.file.type,
        ref: this.ref
      };
    }
    uploader(uploaders) {
      if (this.meta.uploader) {
        let callback = uploaders[this.meta.uploader] || logError(`no uploader configured for ${this.meta.uploader}`);
        return { name: this.meta.uploader, callback };
      } else {
        return { name: "channel", callback: channelUploader };
      }
    }
    zipPostFlight(resp) {
      this.meta = resp.entries[this.ref];
      if (!this.meta) {
        logError(`no preflight upload response returned with ref ${this.ref}`, { input: this.fileEl, response: resp });
      }
    }
  };
  var liveUploaderFileRef = 0;
  var LiveUploader = class {
    static genFileRef(file) {
      let ref = file._phxRef;
      if (ref !== void 0) {
        return ref;
      } else {
        file._phxRef = (liveUploaderFileRef++).toString();
        return file._phxRef;
      }
    }
    static getEntryDataURL(inputEl, ref, callback) {
      let file = this.activeFiles(inputEl).find((file2) => this.genFileRef(file2) === ref);
      callback(URL.createObjectURL(file));
    }
    static hasUploadsInProgress(formEl) {
      let active = 0;
      dom_default.findUploadInputs(formEl).forEach((input) => {
        if (input.getAttribute(PHX_PREFLIGHTED_REFS) !== input.getAttribute(PHX_DONE_REFS)) {
          active++;
        }
      });
      return active > 0;
    }
    static serializeUploads(inputEl) {
      let files = this.activeFiles(inputEl);
      let fileData = {};
      files.forEach((file) => {
        let entry = { path: inputEl.name };
        let uploadRef = inputEl.getAttribute(PHX_UPLOAD_REF);
        fileData[uploadRef] = fileData[uploadRef] || [];
        entry.ref = this.genFileRef(file);
        entry.name = file.name || entry.ref;
        entry.type = file.type;
        entry.size = file.size;
        fileData[uploadRef].push(entry);
      });
      return fileData;
    }
    static clearFiles(inputEl) {
      inputEl.value = null;
      inputEl.removeAttribute(PHX_UPLOAD_REF);
      dom_default.putPrivate(inputEl, "files", []);
    }
    static untrackFile(inputEl, file) {
      dom_default.putPrivate(inputEl, "files", dom_default.private(inputEl, "files").filter((f) => !Object.is(f, file)));
    }
    static trackFiles(inputEl, files) {
      if (inputEl.getAttribute("multiple") !== null) {
        let newFiles = files.filter((file) => !this.activeFiles(inputEl).find((f) => Object.is(f, file)));
        dom_default.putPrivate(inputEl, "files", this.activeFiles(inputEl).concat(newFiles));
        inputEl.value = null;
      } else {
        dom_default.putPrivate(inputEl, "files", files);
      }
    }
    static activeFileInputs(formEl) {
      let fileInputs = dom_default.findUploadInputs(formEl);
      return Array.from(fileInputs).filter((el) => el.files && this.activeFiles(el).length > 0);
    }
    static activeFiles(input) {
      return (dom_default.private(input, "files") || []).filter((f) => UploadEntry.isActive(input, f));
    }
    static inputsAwaitingPreflight(formEl) {
      let fileInputs = dom_default.findUploadInputs(formEl);
      return Array.from(fileInputs).filter((input) => this.filesAwaitingPreflight(input).length > 0);
    }
    static filesAwaitingPreflight(input) {
      return this.activeFiles(input).filter((f) => !UploadEntry.isPreflighted(input, f));
    }
    constructor(inputEl, view, onComplete) {
      this.view = view;
      this.onComplete = onComplete;
      this._entries = Array.from(LiveUploader.filesAwaitingPreflight(inputEl) || []).map((file) => new UploadEntry(inputEl, file, view));
      this.numEntriesInProgress = this._entries.length;
    }
    entries() {
      return this._entries;
    }
    initAdapterUpload(resp, onError, liveSocket2) {
      this._entries = this._entries.map((entry) => {
        entry.zipPostFlight(resp);
        entry.onDone(() => {
          this.numEntriesInProgress--;
          if (this.numEntriesInProgress === 0) {
            this.onComplete();
          }
        });
        return entry;
      });
      let groupedEntries = this._entries.reduce((acc, entry) => {
        let { name, callback } = entry.uploader(liveSocket2.uploaders);
        acc[name] = acc[name] || { callback, entries: [] };
        acc[name].entries.push(entry);
        return acc;
      }, {});
      for (let name in groupedEntries) {
        let { callback, entries } = groupedEntries[name];
        callback(entries, onError, resp, liveSocket2);
      }
    }
  };
  var Hooks = {
    LiveFileUpload: {
      activeRefs() {
        return this.el.getAttribute(PHX_ACTIVE_ENTRY_REFS);
      },
      preflightedRefs() {
        return this.el.getAttribute(PHX_PREFLIGHTED_REFS);
      },
      mounted() {
        this.preflightedWas = this.preflightedRefs();
      },
      updated() {
        let newPreflights = this.preflightedRefs();
        if (this.preflightedWas !== newPreflights) {
          this.preflightedWas = newPreflights;
          if (newPreflights === "") {
            this.__view.cancelSubmit(this.el.form);
          }
        }
        if (this.activeRefs() === "") {
          this.el.value = null;
        }
        this.el.dispatchEvent(new CustomEvent(PHX_LIVE_FILE_UPDATED));
      }
    },
    LiveImgPreview: {
      mounted() {
        this.ref = this.el.getAttribute("data-phx-entry-ref");
        this.inputEl = document.getElementById(this.el.getAttribute(PHX_UPLOAD_REF));
        LiveUploader.getEntryDataURL(this.inputEl, this.ref, (url) => {
          this.url = url;
          this.el.src = url;
        });
      },
      destroyed() {
        URL.revokeObjectURL(this.url);
      }
    }
  };
  var hooks_default = Hooks;
  var DOMPostMorphRestorer = class {
    constructor(containerBefore, containerAfter, updateType) {
      let idsBefore = /* @__PURE__ */ new Set();
      let idsAfter = new Set([...containerAfter.children].map((child) => child.id));
      let elementsToModify = [];
      Array.from(containerBefore.children).forEach((child) => {
        if (child.id) {
          idsBefore.add(child.id);
          if (idsAfter.has(child.id)) {
            let previousElementId = child.previousElementSibling && child.previousElementSibling.id;
            elementsToModify.push({ elementId: child.id, previousElementId });
          }
        }
      });
      this.containerId = containerAfter.id;
      this.updateType = updateType;
      this.elementsToModify = elementsToModify;
      this.elementIdsToAdd = [...idsAfter].filter((id) => !idsBefore.has(id));
    }
    perform() {
      let container = dom_default.byId(this.containerId);
      this.elementsToModify.forEach((elementToModify) => {
        if (elementToModify.previousElementId) {
          maybe(document.getElementById(elementToModify.previousElementId), (previousElem) => {
            maybe(document.getElementById(elementToModify.elementId), (elem) => {
              let isInRightPlace = elem.previousElementSibling && elem.previousElementSibling.id == previousElem.id;
              if (!isInRightPlace) {
                previousElem.insertAdjacentElement("afterend", elem);
              }
            });
          });
        } else {
          maybe(document.getElementById(elementToModify.elementId), (elem) => {
            let isInRightPlace = elem.previousElementSibling == null;
            if (!isInRightPlace) {
              container.insertAdjacentElement("afterbegin", elem);
            }
          });
        }
      });
      if (this.updateType == "prepend") {
        this.elementIdsToAdd.reverse().forEach((elemId) => {
          maybe(document.getElementById(elemId), (elem) => container.insertAdjacentElement("afterbegin", elem));
        });
      }
    }
  };
  var DOCUMENT_FRAGMENT_NODE = 11;
  function morphAttrs(fromNode, toNode) {
    var toNodeAttrs = toNode.attributes;
    var attr;
    var attrName;
    var attrNamespaceURI;
    var attrValue;
    var fromValue;
    if (toNode.nodeType === DOCUMENT_FRAGMENT_NODE || fromNode.nodeType === DOCUMENT_FRAGMENT_NODE) {
      return;
    }
    for (var i = toNodeAttrs.length - 1; i >= 0; i--) {
      attr = toNodeAttrs[i];
      attrName = attr.name;
      attrNamespaceURI = attr.namespaceURI;
      attrValue = attr.value;
      if (attrNamespaceURI) {
        attrName = attr.localName || attrName;
        fromValue = fromNode.getAttributeNS(attrNamespaceURI, attrName);
        if (fromValue !== attrValue) {
          if (attr.prefix === "xmlns") {
            attrName = attr.name;
          }
          fromNode.setAttributeNS(attrNamespaceURI, attrName, attrValue);
        }
      } else {
        fromValue = fromNode.getAttribute(attrName);
        if (fromValue !== attrValue) {
          fromNode.setAttribute(attrName, attrValue);
        }
      }
    }
    var fromNodeAttrs = fromNode.attributes;
    for (var d = fromNodeAttrs.length - 1; d >= 0; d--) {
      attr = fromNodeAttrs[d];
      attrName = attr.name;
      attrNamespaceURI = attr.namespaceURI;
      if (attrNamespaceURI) {
        attrName = attr.localName || attrName;
        if (!toNode.hasAttributeNS(attrNamespaceURI, attrName)) {
          fromNode.removeAttributeNS(attrNamespaceURI, attrName);
        }
      } else {
        if (!toNode.hasAttribute(attrName)) {
          fromNode.removeAttribute(attrName);
        }
      }
    }
  }
  var range;
  var NS_XHTML = "http://www.w3.org/1999/xhtml";
  var doc = typeof document === "undefined" ? void 0 : document;
  var HAS_TEMPLATE_SUPPORT = !!doc && "content" in doc.createElement("template");
  var HAS_RANGE_SUPPORT = !!doc && doc.createRange && "createContextualFragment" in doc.createRange();
  function createFragmentFromTemplate(str) {
    var template = doc.createElement("template");
    template.innerHTML = str;
    return template.content.childNodes[0];
  }
  function createFragmentFromRange(str) {
    if (!range) {
      range = doc.createRange();
      range.selectNode(doc.body);
    }
    var fragment = range.createContextualFragment(str);
    return fragment.childNodes[0];
  }
  function createFragmentFromWrap(str) {
    var fragment = doc.createElement("body");
    fragment.innerHTML = str;
    return fragment.childNodes[0];
  }
  function toElement(str) {
    str = str.trim();
    if (HAS_TEMPLATE_SUPPORT) {
      return createFragmentFromTemplate(str);
    } else if (HAS_RANGE_SUPPORT) {
      return createFragmentFromRange(str);
    }
    return createFragmentFromWrap(str);
  }
  function compareNodeNames(fromEl, toEl) {
    var fromNodeName = fromEl.nodeName;
    var toNodeName = toEl.nodeName;
    var fromCodeStart, toCodeStart;
    if (fromNodeName === toNodeName) {
      return true;
    }
    fromCodeStart = fromNodeName.charCodeAt(0);
    toCodeStart = toNodeName.charCodeAt(0);
    if (fromCodeStart <= 90 && toCodeStart >= 97) {
      return fromNodeName === toNodeName.toUpperCase();
    } else if (toCodeStart <= 90 && fromCodeStart >= 97) {
      return toNodeName === fromNodeName.toUpperCase();
    } else {
      return false;
    }
  }
  function createElementNS(name, namespaceURI) {
    return !namespaceURI || namespaceURI === NS_XHTML ? doc.createElement(name) : doc.createElementNS(namespaceURI, name);
  }
  function moveChildren(fromEl, toEl) {
    var curChild = fromEl.firstChild;
    while (curChild) {
      var nextChild = curChild.nextSibling;
      toEl.appendChild(curChild);
      curChild = nextChild;
    }
    return toEl;
  }
  function syncBooleanAttrProp(fromEl, toEl, name) {
    if (fromEl[name] !== toEl[name]) {
      fromEl[name] = toEl[name];
      if (fromEl[name]) {
        fromEl.setAttribute(name, "");
      } else {
        fromEl.removeAttribute(name);
      }
    }
  }
  var specialElHandlers = {
    OPTION: function(fromEl, toEl) {
      var parentNode = fromEl.parentNode;
      if (parentNode) {
        var parentName = parentNode.nodeName.toUpperCase();
        if (parentName === "OPTGROUP") {
          parentNode = parentNode.parentNode;
          parentName = parentNode && parentNode.nodeName.toUpperCase();
        }
        if (parentName === "SELECT" && !parentNode.hasAttribute("multiple")) {
          if (fromEl.hasAttribute("selected") && !toEl.selected) {
            fromEl.setAttribute("selected", "selected");
            fromEl.removeAttribute("selected");
          }
          parentNode.selectedIndex = -1;
        }
      }
      syncBooleanAttrProp(fromEl, toEl, "selected");
    },
    INPUT: function(fromEl, toEl) {
      syncBooleanAttrProp(fromEl, toEl, "checked");
      syncBooleanAttrProp(fromEl, toEl, "disabled");
      if (fromEl.value !== toEl.value) {
        fromEl.value = toEl.value;
      }
      if (!toEl.hasAttribute("value")) {
        fromEl.removeAttribute("value");
      }
    },
    TEXTAREA: function(fromEl, toEl) {
      var newValue = toEl.value;
      if (fromEl.value !== newValue) {
        fromEl.value = newValue;
      }
      var firstChild = fromEl.firstChild;
      if (firstChild) {
        var oldValue = firstChild.nodeValue;
        if (oldValue == newValue || !newValue && oldValue == fromEl.placeholder) {
          return;
        }
        firstChild.nodeValue = newValue;
      }
    },
    SELECT: function(fromEl, toEl) {
      if (!toEl.hasAttribute("multiple")) {
        var selectedIndex = -1;
        var i = 0;
        var curChild = fromEl.firstChild;
        var optgroup;
        var nodeName;
        while (curChild) {
          nodeName = curChild.nodeName && curChild.nodeName.toUpperCase();
          if (nodeName === "OPTGROUP") {
            optgroup = curChild;
            curChild = optgroup.firstChild;
          } else {
            if (nodeName === "OPTION") {
              if (curChild.hasAttribute("selected")) {
                selectedIndex = i;
                break;
              }
              i++;
            }
            curChild = curChild.nextSibling;
            if (!curChild && optgroup) {
              curChild = optgroup.nextSibling;
              optgroup = null;
            }
          }
        }
        fromEl.selectedIndex = selectedIndex;
      }
    }
  };
  var ELEMENT_NODE = 1;
  var DOCUMENT_FRAGMENT_NODE$1 = 11;
  var TEXT_NODE = 3;
  var COMMENT_NODE = 8;
  function noop() {
  }
  function defaultGetNodeKey(node) {
    if (node) {
      return node.getAttribute && node.getAttribute("id") || node.id;
    }
  }
  function morphdomFactory(morphAttrs2) {
    return function morphdom2(fromNode, toNode, options) {
      if (!options) {
        options = {};
      }
      if (typeof toNode === "string") {
        if (fromNode.nodeName === "#document" || fromNode.nodeName === "HTML" || fromNode.nodeName === "BODY") {
          var toNodeHtml = toNode;
          toNode = doc.createElement("html");
          toNode.innerHTML = toNodeHtml;
        } else {
          toNode = toElement(toNode);
        }
      }
      var getNodeKey = options.getNodeKey || defaultGetNodeKey;
      var onBeforeNodeAdded = options.onBeforeNodeAdded || noop;
      var onNodeAdded = options.onNodeAdded || noop;
      var onBeforeElUpdated = options.onBeforeElUpdated || noop;
      var onElUpdated = options.onElUpdated || noop;
      var onBeforeNodeDiscarded = options.onBeforeNodeDiscarded || noop;
      var onNodeDiscarded = options.onNodeDiscarded || noop;
      var onBeforeElChildrenUpdated = options.onBeforeElChildrenUpdated || noop;
      var childrenOnly = options.childrenOnly === true;
      var fromNodesLookup = Object.create(null);
      var keyedRemovalList = [];
      function addKeyedRemoval(key) {
        keyedRemovalList.push(key);
      }
      function walkDiscardedChildNodes(node, skipKeyedNodes) {
        if (node.nodeType === ELEMENT_NODE) {
          var curChild = node.firstChild;
          while (curChild) {
            var key = void 0;
            if (skipKeyedNodes && (key = getNodeKey(curChild))) {
              addKeyedRemoval(key);
            } else {
              onNodeDiscarded(curChild);
              if (curChild.firstChild) {
                walkDiscardedChildNodes(curChild, skipKeyedNodes);
              }
            }
            curChild = curChild.nextSibling;
          }
        }
      }
      function removeNode(node, parentNode, skipKeyedNodes) {
        if (onBeforeNodeDiscarded(node) === false) {
          return;
        }
        if (parentNode) {
          parentNode.removeChild(node);
        }
        onNodeDiscarded(node);
        walkDiscardedChildNodes(node, skipKeyedNodes);
      }
      function indexTree(node) {
        if (node.nodeType === ELEMENT_NODE || node.nodeType === DOCUMENT_FRAGMENT_NODE$1) {
          var curChild = node.firstChild;
          while (curChild) {
            var key = getNodeKey(curChild);
            if (key) {
              fromNodesLookup[key] = curChild;
            }
            indexTree(curChild);
            curChild = curChild.nextSibling;
          }
        }
      }
      indexTree(fromNode);
      function handleNodeAdded(el) {
        onNodeAdded(el);
        var curChild = el.firstChild;
        while (curChild) {
          var nextSibling = curChild.nextSibling;
          var key = getNodeKey(curChild);
          if (key) {
            var unmatchedFromEl = fromNodesLookup[key];
            if (unmatchedFromEl && compareNodeNames(curChild, unmatchedFromEl)) {
              curChild.parentNode.replaceChild(unmatchedFromEl, curChild);
              morphEl(unmatchedFromEl, curChild);
            } else {
              handleNodeAdded(curChild);
            }
          } else {
            handleNodeAdded(curChild);
          }
          curChild = nextSibling;
        }
      }
      function cleanupFromEl(fromEl, curFromNodeChild, curFromNodeKey) {
        while (curFromNodeChild) {
          var fromNextSibling = curFromNodeChild.nextSibling;
          if (curFromNodeKey = getNodeKey(curFromNodeChild)) {
            addKeyedRemoval(curFromNodeKey);
          } else {
            removeNode(curFromNodeChild, fromEl, true);
          }
          curFromNodeChild = fromNextSibling;
        }
      }
      function morphEl(fromEl, toEl, childrenOnly2) {
        var toElKey = getNodeKey(toEl);
        if (toElKey) {
          delete fromNodesLookup[toElKey];
        }
        if (!childrenOnly2) {
          if (onBeforeElUpdated(fromEl, toEl) === false) {
            return;
          }
          morphAttrs2(fromEl, toEl);
          onElUpdated(fromEl);
          if (onBeforeElChildrenUpdated(fromEl, toEl) === false) {
            return;
          }
        }
        if (fromEl.nodeName !== "TEXTAREA") {
          morphChildren(fromEl, toEl);
        } else {
          specialElHandlers.TEXTAREA(fromEl, toEl);
        }
      }
      function morphChildren(fromEl, toEl) {
        var curToNodeChild = toEl.firstChild;
        var curFromNodeChild = fromEl.firstChild;
        var curToNodeKey;
        var curFromNodeKey;
        var fromNextSibling;
        var toNextSibling;
        var matchingFromEl;
        outer:
          while (curToNodeChild) {
            toNextSibling = curToNodeChild.nextSibling;
            curToNodeKey = getNodeKey(curToNodeChild);
            while (curFromNodeChild) {
              fromNextSibling = curFromNodeChild.nextSibling;
              if (curToNodeChild.isSameNode && curToNodeChild.isSameNode(curFromNodeChild)) {
                curToNodeChild = toNextSibling;
                curFromNodeChild = fromNextSibling;
                continue outer;
              }
              curFromNodeKey = getNodeKey(curFromNodeChild);
              var curFromNodeType = curFromNodeChild.nodeType;
              var isCompatible = void 0;
              if (curFromNodeType === curToNodeChild.nodeType) {
                if (curFromNodeType === ELEMENT_NODE) {
                  if (curToNodeKey) {
                    if (curToNodeKey !== curFromNodeKey) {
                      if (matchingFromEl = fromNodesLookup[curToNodeKey]) {
                        if (fromNextSibling === matchingFromEl) {
                          isCompatible = false;
                        } else {
                          fromEl.insertBefore(matchingFromEl, curFromNodeChild);
                          if (curFromNodeKey) {
                            addKeyedRemoval(curFromNodeKey);
                          } else {
                            removeNode(curFromNodeChild, fromEl, true);
                          }
                          curFromNodeChild = matchingFromEl;
                        }
                      } else {
                        isCompatible = false;
                      }
                    }
                  } else if (curFromNodeKey) {
                    isCompatible = false;
                  }
                  isCompatible = isCompatible !== false && compareNodeNames(curFromNodeChild, curToNodeChild);
                  if (isCompatible) {
                    morphEl(curFromNodeChild, curToNodeChild);
                  }
                } else if (curFromNodeType === TEXT_NODE || curFromNodeType == COMMENT_NODE) {
                  isCompatible = true;
                  if (curFromNodeChild.nodeValue !== curToNodeChild.nodeValue) {
                    curFromNodeChild.nodeValue = curToNodeChild.nodeValue;
                  }
                }
              }
              if (isCompatible) {
                curToNodeChild = toNextSibling;
                curFromNodeChild = fromNextSibling;
                continue outer;
              }
              if (curFromNodeKey) {
                addKeyedRemoval(curFromNodeKey);
              } else {
                removeNode(curFromNodeChild, fromEl, true);
              }
              curFromNodeChild = fromNextSibling;
            }
            if (curToNodeKey && (matchingFromEl = fromNodesLookup[curToNodeKey]) && compareNodeNames(matchingFromEl, curToNodeChild)) {
              fromEl.appendChild(matchingFromEl);
              morphEl(matchingFromEl, curToNodeChild);
            } else {
              var onBeforeNodeAddedResult = onBeforeNodeAdded(curToNodeChild);
              if (onBeforeNodeAddedResult !== false) {
                if (onBeforeNodeAddedResult) {
                  curToNodeChild = onBeforeNodeAddedResult;
                }
                if (curToNodeChild.actualize) {
                  curToNodeChild = curToNodeChild.actualize(fromEl.ownerDocument || doc);
                }
                fromEl.appendChild(curToNodeChild);
                handleNodeAdded(curToNodeChild);
              }
            }
            curToNodeChild = toNextSibling;
            curFromNodeChild = fromNextSibling;
          }
        cleanupFromEl(fromEl, curFromNodeChild, curFromNodeKey);
        var specialElHandler = specialElHandlers[fromEl.nodeName];
        if (specialElHandler) {
          specialElHandler(fromEl, toEl);
        }
      }
      var morphedNode = fromNode;
      var morphedNodeType = morphedNode.nodeType;
      var toNodeType = toNode.nodeType;
      if (!childrenOnly) {
        if (morphedNodeType === ELEMENT_NODE) {
          if (toNodeType === ELEMENT_NODE) {
            if (!compareNodeNames(fromNode, toNode)) {
              onNodeDiscarded(fromNode);
              morphedNode = moveChildren(fromNode, createElementNS(toNode.nodeName, toNode.namespaceURI));
            }
          } else {
            morphedNode = toNode;
          }
        } else if (morphedNodeType === TEXT_NODE || morphedNodeType === COMMENT_NODE) {
          if (toNodeType === morphedNodeType) {
            if (morphedNode.nodeValue !== toNode.nodeValue) {
              morphedNode.nodeValue = toNode.nodeValue;
            }
            return morphedNode;
          } else {
            morphedNode = toNode;
          }
        }
      }
      if (morphedNode === toNode) {
        onNodeDiscarded(fromNode);
      } else {
        if (toNode.isSameNode && toNode.isSameNode(morphedNode)) {
          return;
        }
        morphEl(morphedNode, toNode, childrenOnly);
        if (keyedRemovalList) {
          for (var i = 0, len = keyedRemovalList.length; i < len; i++) {
            var elToRemove = fromNodesLookup[keyedRemovalList[i]];
            if (elToRemove) {
              removeNode(elToRemove, elToRemove.parentNode, false);
            }
          }
        }
      }
      if (!childrenOnly && morphedNode !== fromNode && fromNode.parentNode) {
        if (morphedNode.actualize) {
          morphedNode = morphedNode.actualize(fromNode.ownerDocument || doc);
        }
        fromNode.parentNode.replaceChild(morphedNode, fromNode);
      }
      return morphedNode;
    };
  }
  var morphdom = morphdomFactory(morphAttrs);
  var morphdom_esm_default = morphdom;
  var DOMPatch = class {
    static patchEl(fromEl, toEl, activeElement) {
      morphdom_esm_default(fromEl, toEl, {
        childrenOnly: false,
        onBeforeElUpdated: (fromEl2, toEl2) => {
          if (activeElement && activeElement.isSameNode(fromEl2) && dom_default.isFormInput(fromEl2)) {
            dom_default.mergeFocusedInput(fromEl2, toEl2);
            return false;
          }
        }
      });
    }
    constructor(view, container, id, html, targetCID) {
      this.view = view;
      this.liveSocket = view.liveSocket;
      this.container = container;
      this.id = id;
      this.rootID = view.root.id;
      this.html = html;
      this.targetCID = targetCID;
      this.cidPatch = isCid(this.targetCID);
      this.callbacks = {
        beforeadded: [],
        beforeupdated: [],
        beforephxChildAdded: [],
        afteradded: [],
        afterupdated: [],
        afterdiscarded: [],
        afterphxChildAdded: [],
        aftertransitionsDiscarded: []
      };
    }
    before(kind, callback) {
      this.callbacks[`before${kind}`].push(callback);
    }
    after(kind, callback) {
      this.callbacks[`after${kind}`].push(callback);
    }
    trackBefore(kind, ...args) {
      this.callbacks[`before${kind}`].forEach((callback) => callback(...args));
    }
    trackAfter(kind, ...args) {
      this.callbacks[`after${kind}`].forEach((callback) => callback(...args));
    }
    markPrunableContentForRemoval() {
      dom_default.all(this.container, "[phx-update=append] > *, [phx-update=prepend] > *", (el) => {
        el.setAttribute(PHX_PRUNE, "");
      });
    }
    perform() {
      let { view, liveSocket: liveSocket2, container, html } = this;
      let targetContainer = this.isCIDPatch() ? this.targetCIDContainer(html) : container;
      if (this.isCIDPatch() && !targetContainer) {
        return;
      }
      let focused = liveSocket2.getActiveElement();
      let { selectionStart, selectionEnd } = focused && dom_default.hasSelectionRange(focused) ? focused : {};
      let phxUpdate = liveSocket2.binding(PHX_UPDATE);
      let phxFeedbackFor = liveSocket2.binding(PHX_FEEDBACK_FOR);
      let disableWith = liveSocket2.binding(PHX_DISABLE_WITH);
      let phxTriggerExternal = liveSocket2.binding(PHX_TRIGGER_ACTION);
      let phxRemove = liveSocket2.binding("remove");
      let added = [];
      let updates = [];
      let appendPrependUpdates = [];
      let pendingRemoves = [];
      let externalFormTriggered = null;
      let diffHTML = liveSocket2.time("premorph container prep", () => {
        return this.buildDiffHTML(container, html, phxUpdate, targetContainer);
      });
      this.trackBefore("added", container);
      this.trackBefore("updated", container, container);
      liveSocket2.time("morphdom", () => {
        morphdom_esm_default(targetContainer, diffHTML, {
          childrenOnly: targetContainer.getAttribute(PHX_COMPONENT) === null,
          getNodeKey: (node) => {
            return dom_default.isPhxDestroyed(node) ? null : node.id;
          },
          onBeforeNodeAdded: (el) => {
            this.trackBefore("added", el);
            return el;
          },
          onNodeAdded: (el) => {
            if (el instanceof HTMLImageElement && el.srcset) {
              el.srcset = el.srcset;
            } else if (el instanceof HTMLVideoElement && el.autoplay) {
              el.play();
            }
            if (dom_default.isNowTriggerFormExternal(el, phxTriggerExternal)) {
              externalFormTriggered = el;
            }
            dom_default.discardError(targetContainer, el, phxFeedbackFor);
            if (dom_default.isPhxChild(el) && view.ownsElement(el) || dom_default.isPhxSticky(el) && view.ownsElement(el.parentNode)) {
              this.trackAfter("phxChildAdded", el);
            }
            added.push(el);
          },
          onNodeDiscarded: (el) => {
            if (dom_default.isPhxChild(el) || dom_default.isPhxSticky(el)) {
              liveSocket2.destroyViewByEl(el);
            }
            this.trackAfter("discarded", el);
          },
          onBeforeNodeDiscarded: (el) => {
            if (el.getAttribute && el.getAttribute(PHX_PRUNE) !== null) {
              return true;
            }
            if (el.parentNode !== null && dom_default.isPhxUpdate(el.parentNode, phxUpdate, ["append", "prepend"]) && el.id) {
              return false;
            }
            if (el.getAttribute && el.getAttribute(phxRemove)) {
              pendingRemoves.push(el);
              return false;
            }
            if (this.skipCIDSibling(el)) {
              return false;
            }
            return true;
          },
          onElUpdated: (el) => {
            if (dom_default.isNowTriggerFormExternal(el, phxTriggerExternal)) {
              externalFormTriggered = el;
            }
            updates.push(el);
          },
          onBeforeElUpdated: (fromEl, toEl) => {
            dom_default.cleanChildNodes(toEl, phxUpdate);
            if (this.skipCIDSibling(toEl)) {
              return false;
            }
            if (dom_default.isPhxSticky(fromEl)) {
              return false;
            }
            if (dom_default.isIgnored(fromEl, phxUpdate)) {
              this.trackBefore("updated", fromEl, toEl);
              dom_default.mergeAttrs(fromEl, toEl, { isIgnored: true });
              updates.push(fromEl);
              dom_default.applyStickyOperations(fromEl);
              return false;
            }
            if (fromEl.type === "number" && (fromEl.validity && fromEl.validity.badInput)) {
              return false;
            }
            if (!dom_default.syncPendingRef(fromEl, toEl, disableWith)) {
              if (dom_default.isUploadInput(fromEl)) {
                this.trackBefore("updated", fromEl, toEl);
                updates.push(fromEl);
              }
              dom_default.applyStickyOperations(fromEl);
              return false;
            }
            if (dom_default.isPhxChild(toEl)) {
              let prevSession = fromEl.getAttribute(PHX_SESSION);
              dom_default.mergeAttrs(fromEl, toEl, { exclude: [PHX_STATIC] });
              if (prevSession !== "") {
                fromEl.setAttribute(PHX_SESSION, prevSession);
              }
              fromEl.setAttribute(PHX_ROOT_ID, this.rootID);
              dom_default.applyStickyOperations(fromEl);
              return false;
            }
            dom_default.copyPrivates(toEl, fromEl);
            dom_default.discardError(targetContainer, toEl, phxFeedbackFor);
            let isFocusedFormEl = focused && fromEl.isSameNode(focused) && dom_default.isFormInput(fromEl);
            if (isFocusedFormEl) {
              this.trackBefore("updated", fromEl, toEl);
              dom_default.mergeFocusedInput(fromEl, toEl);
              dom_default.syncAttrsToProps(fromEl);
              updates.push(fromEl);
              dom_default.applyStickyOperations(fromEl);
              return false;
            } else {
              if (dom_default.isPhxUpdate(toEl, phxUpdate, ["append", "prepend"])) {
                appendPrependUpdates.push(new DOMPostMorphRestorer(fromEl, toEl, toEl.getAttribute(phxUpdate)));
              }
              dom_default.syncAttrsToProps(toEl);
              dom_default.applyStickyOperations(toEl);
              this.trackBefore("updated", fromEl, toEl);
              return true;
            }
          }
        });
      });
      if (liveSocket2.isDebugEnabled()) {
        detectDuplicateIds();
      }
      if (appendPrependUpdates.length > 0) {
        liveSocket2.time("post-morph append/prepend restoration", () => {
          appendPrependUpdates.forEach((update) => update.perform());
        });
      }
      liveSocket2.silenceEvents(() => dom_default.restoreFocus(focused, selectionStart, selectionEnd));
      dom_default.dispatchEvent(document, "phx:update");
      added.forEach((el) => this.trackAfter("added", el));
      updates.forEach((el) => this.trackAfter("updated", el));
      if (pendingRemoves.length > 0) {
        liveSocket2.transitionRemoves(pendingRemoves);
        liveSocket2.requestDOMUpdate(() => {
          pendingRemoves.forEach((el) => {
            let child = dom_default.firstPhxChild(el);
            if (child) {
              liveSocket2.destroyViewByEl(child);
            }
            el.remove();
          });
          this.trackAfter("transitionsDiscarded", pendingRemoves);
        });
      }
      if (externalFormTriggered) {
        liveSocket2.disconnect();
        externalFormTriggered.submit();
      }
      return true;
    }
    isCIDPatch() {
      return this.cidPatch;
    }
    skipCIDSibling(el) {
      return el.nodeType === Node.ELEMENT_NODE && el.getAttribute(PHX_SKIP) !== null;
    }
    targetCIDContainer(html) {
      if (!this.isCIDPatch()) {
        return;
      }
      let [first, ...rest] = dom_default.findComponentNodeList(this.container, this.targetCID);
      if (rest.length === 0 && dom_default.childNodeLength(html) === 1) {
        return first;
      } else {
        return first && first.parentNode;
      }
    }
    buildDiffHTML(container, html, phxUpdate, targetContainer) {
      let isCIDPatch = this.isCIDPatch();
      let isCIDWithSingleRoot = isCIDPatch && targetContainer.getAttribute(PHX_COMPONENT) === this.targetCID.toString();
      if (!isCIDPatch || isCIDWithSingleRoot) {
        return html;
      } else {
        let diffContainer = null;
        let template = document.createElement("template");
        diffContainer = dom_default.cloneNode(targetContainer);
        let [firstComponent, ...rest] = dom_default.findComponentNodeList(diffContainer, this.targetCID);
        template.innerHTML = html;
        rest.forEach((el) => el.remove());
        Array.from(diffContainer.childNodes).forEach((child) => {
          if (child.id && child.nodeType === Node.ELEMENT_NODE && child.getAttribute(PHX_COMPONENT) !== this.targetCID.toString()) {
            child.setAttribute(PHX_SKIP, "");
            child.innerHTML = "";
          }
        });
        Array.from(template.content.childNodes).forEach((el) => diffContainer.insertBefore(el, firstComponent));
        firstComponent.remove();
        return diffContainer.outerHTML;
      }
    }
  };
  var Rendered = class {
    static extract(diff) {
      let { [REPLY]: reply, [EVENTS]: events, [TITLE]: title } = diff;
      delete diff[REPLY];
      delete diff[EVENTS];
      delete diff[TITLE];
      return { diff, title, reply: reply || null, events: events || [] };
    }
    constructor(viewId, rendered) {
      this.viewId = viewId;
      this.rendered = {};
      this.mergeDiff(rendered);
    }
    parentViewId() {
      return this.viewId;
    }
    toString(onlyCids) {
      return this.recursiveToString(this.rendered, this.rendered[COMPONENTS], onlyCids);
    }
    recursiveToString(rendered, components = rendered[COMPONENTS], onlyCids) {
      onlyCids = onlyCids ? new Set(onlyCids) : null;
      let output = { buffer: "", components, onlyCids };
      this.toOutputBuffer(rendered, null, output);
      return output.buffer;
    }
    componentCIDs(diff) {
      return Object.keys(diff[COMPONENTS] || {}).map((i) => parseInt(i));
    }
    isComponentOnlyDiff(diff) {
      if (!diff[COMPONENTS]) {
        return false;
      }
      return Object.keys(diff).length === 1;
    }
    getComponent(diff, cid) {
      return diff[COMPONENTS][cid];
    }
    mergeDiff(diff) {
      let newc = diff[COMPONENTS];
      let cache = {};
      delete diff[COMPONENTS];
      this.rendered = this.mutableMerge(this.rendered, diff);
      this.rendered[COMPONENTS] = this.rendered[COMPONENTS] || {};
      if (newc) {
        let oldc = this.rendered[COMPONENTS];
        for (let cid in newc) {
          newc[cid] = this.cachedFindComponent(cid, newc[cid], oldc, newc, cache);
        }
        for (let cid in newc) {
          oldc[cid] = newc[cid];
        }
        diff[COMPONENTS] = newc;
      }
    }
    cachedFindComponent(cid, cdiff, oldc, newc, cache) {
      if (cache[cid]) {
        return cache[cid];
      } else {
        let ndiff, stat, scid = cdiff[STATIC];
        if (isCid(scid)) {
          let tdiff;
          if (scid > 0) {
            tdiff = this.cachedFindComponent(scid, newc[scid], oldc, newc, cache);
          } else {
            tdiff = oldc[-scid];
          }
          stat = tdiff[STATIC];
          ndiff = this.cloneMerge(tdiff, cdiff);
          ndiff[STATIC] = stat;
        } else {
          ndiff = cdiff[STATIC] !== void 0 ? cdiff : this.cloneMerge(oldc[cid] || {}, cdiff);
        }
        cache[cid] = ndiff;
        return ndiff;
      }
    }
    mutableMerge(target, source) {
      if (source[STATIC] !== void 0) {
        return source;
      } else {
        this.doMutableMerge(target, source);
        return target;
      }
    }
    doMutableMerge(target, source) {
      for (let key in source) {
        let val = source[key];
        let targetVal = target[key];
        if (isObject(val) && val[STATIC] === void 0 && isObject(targetVal)) {
          this.doMutableMerge(targetVal, val);
        } else {
          target[key] = val;
        }
      }
    }
    cloneMerge(target, source) {
      let merged = __spreadValues(__spreadValues({}, target), source);
      for (let key in merged) {
        let val = source[key];
        let targetVal = target[key];
        if (isObject(val) && val[STATIC] === void 0 && isObject(targetVal)) {
          merged[key] = this.cloneMerge(targetVal, val);
        }
      }
      return merged;
    }
    componentToString(cid) {
      return this.recursiveCIDToString(this.rendered[COMPONENTS], cid);
    }
    pruneCIDs(cids) {
      cids.forEach((cid) => delete this.rendered[COMPONENTS][cid]);
    }
    get() {
      return this.rendered;
    }
    isNewFingerprint(diff = {}) {
      return !!diff[STATIC];
    }
    templateStatic(part, templates) {
      if (typeof part === "number") {
        return templates[part];
      } else {
        return part;
      }
    }
    toOutputBuffer(rendered, templates, output) {
      if (rendered[DYNAMICS]) {
        return this.comprehensionToBuffer(rendered, templates, output);
      }
      let { [STATIC]: statics } = rendered;
      statics = this.templateStatic(statics, templates);
      output.buffer += statics[0];
      for (let i = 1; i < statics.length; i++) {
        this.dynamicToBuffer(rendered[i - 1], templates, output);
        output.buffer += statics[i];
      }
    }
    comprehensionToBuffer(rendered, templates, output) {
      let { [DYNAMICS]: dynamics, [STATIC]: statics } = rendered;
      statics = this.templateStatic(statics, templates);
      let compTemplates = templates || rendered[TEMPLATES];
      for (let d = 0; d < dynamics.length; d++) {
        let dynamic = dynamics[d];
        output.buffer += statics[0];
        for (let i = 1; i < statics.length; i++) {
          this.dynamicToBuffer(dynamic[i - 1], compTemplates, output);
          output.buffer += statics[i];
        }
      }
    }
    dynamicToBuffer(rendered, templates, output) {
      if (typeof rendered === "number") {
        output.buffer += this.recursiveCIDToString(output.components, rendered, output.onlyCids);
      } else if (isObject(rendered)) {
        this.toOutputBuffer(rendered, templates, output);
      } else {
        output.buffer += rendered;
      }
    }
    recursiveCIDToString(components, cid, onlyCids) {
      let component = components[cid] || logError(`no component for CID ${cid}`, components);
      let template = document.createElement("template");
      template.innerHTML = this.recursiveToString(component, components, onlyCids);
      let container = template.content;
      let skip = onlyCids && !onlyCids.has(cid);
      let [hasChildNodes, hasChildComponents] = Array.from(container.childNodes).reduce(([hasNodes, hasComponents], child, i) => {
        if (child.nodeType === Node.ELEMENT_NODE) {
          if (child.getAttribute(PHX_COMPONENT)) {
            return [hasNodes, true];
          }
          child.setAttribute(PHX_COMPONENT, cid);
          if (!child.id) {
            child.id = `${this.parentViewId()}-${cid}-${i}`;
          }
          if (skip) {
            child.setAttribute(PHX_SKIP, "");
            child.innerHTML = "";
          }
          return [true, hasComponents];
        } else {
          if (child.nodeValue.trim() !== "") {
            logError(`only HTML element tags are allowed at the root of components.

got: "${child.nodeValue.trim()}"

within:
`, template.innerHTML.trim());
            child.replaceWith(this.createSpan(child.nodeValue, cid));
            return [true, hasComponents];
          } else {
            child.remove();
            return [hasNodes, hasComponents];
          }
        }
      }, [false, false]);
      if (!hasChildNodes && !hasChildComponents) {
        logError("expected at least one HTML element tag inside a component, but the component is empty:\n", template.innerHTML.trim());
        return this.createSpan("", cid).outerHTML;
      } else if (!hasChildNodes && hasChildComponents) {
        logError("expected at least one HTML element tag directly inside a component, but only subcomponents were found. A component must render at least one HTML tag directly inside itself.", template.innerHTML.trim());
        return template.innerHTML;
      } else {
        return template.innerHTML;
      }
    }
    createSpan(text, cid) {
      let span = document.createElement("span");
      span.innerText = text;
      span.setAttribute(PHX_COMPONENT, cid);
      return span;
    }
  };
  var viewHookID = 1;
  var ViewHook = class {
    static makeID() {
      return viewHookID++;
    }
    static elementID(el) {
      return el.phxHookId;
    }
    constructor(view, el, callbacks) {
      this.__view = view;
      this.liveSocket = view.liveSocket;
      this.__callbacks = callbacks;
      this.__listeners = /* @__PURE__ */ new Set();
      this.__isDisconnected = false;
      this.el = el;
      this.el.phxHookId = this.constructor.makeID();
      for (let key in this.__callbacks) {
        this[key] = this.__callbacks[key];
      }
    }
    __mounted() {
      this.mounted && this.mounted();
    }
    __updated() {
      this.updated && this.updated();
    }
    __beforeUpdate() {
      this.beforeUpdate && this.beforeUpdate();
    }
    __destroyed() {
      this.destroyed && this.destroyed();
    }
    __reconnected() {
      if (this.__isDisconnected) {
        this.__isDisconnected = false;
        this.reconnected && this.reconnected();
      }
    }
    __disconnected() {
      this.__isDisconnected = true;
      this.disconnected && this.disconnected();
    }
    pushEvent(event, payload = {}, onReply = function() {
    }) {
      return this.__view.pushHookEvent(null, event, payload, onReply);
    }
    pushEventTo(phxTarget, event, payload = {}, onReply = function() {
    }) {
      return this.__view.withinTargets(phxTarget, (view, targetCtx) => {
        return view.pushHookEvent(targetCtx, event, payload, onReply);
      });
    }
    handleEvent(event, callback) {
      let callbackRef = (customEvent, bypass) => bypass ? event : callback(customEvent.detail);
      window.addEventListener(`phx:${event}`, callbackRef);
      this.__listeners.add(callbackRef);
      return callbackRef;
    }
    removeHandleEvent(callbackRef) {
      let event = callbackRef(null, true);
      window.removeEventListener(`phx:${event}`, callbackRef);
      this.__listeners.delete(callbackRef);
    }
    upload(name, files) {
      return this.__view.dispatchUploads(name, files);
    }
    uploadTo(phxTarget, name, files) {
      return this.__view.withinTargets(phxTarget, (view) => view.dispatchUploads(name, files));
    }
    __cleanup__() {
      this.__listeners.forEach((callbackRef) => this.removeHandleEvent(callbackRef));
    }
  };
  var JS = {
    exec(eventType, phxEvent, view, sourceEl, defaults) {
      let [defaultKind, defaultArgs] = defaults || [null, {}];
      let commands = phxEvent.charAt(0) === "[" ? JSON.parse(phxEvent) : [[defaultKind, defaultArgs]];
      commands.forEach(([kind, args]) => {
        if (kind === defaultKind && defaultArgs.data) {
          args.data = Object.assign(args.data || {}, defaultArgs.data);
        }
        this.filterToEls(sourceEl, args).forEach((el) => {
          this[`exec_${kind}`](eventType, phxEvent, view, sourceEl, el, args);
        });
      });
    },
    isVisible(el) {
      return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length > 0);
    },
    exec_dispatch(eventType, phxEvent, view, sourceEl, el, { to, event, detail, bubbles }) {
      detail = detail || {};
      detail.dispatcher = sourceEl;
      dom_default.dispatchEvent(el, event, { detail, bubbles });
    },
    exec_push(eventType, phxEvent, view, sourceEl, el, args) {
      if (!view.isConnected()) {
        return;
      }
      let { event, data, target, page_loading, loading, value, dispatcher } = args;
      let pushOpts = { loading, value, target, page_loading: !!page_loading };
      let targetSrc = eventType === "change" && dispatcher ? dispatcher : sourceEl;
      let phxTarget = target || targetSrc.getAttribute(view.binding("target")) || targetSrc;
      view.withinTargets(phxTarget, (targetView, targetCtx) => {
        if (eventType === "change") {
          let { newCid, _target, callback } = args;
          _target = _target || (sourceEl instanceof HTMLInputElement ? sourceEl.name : void 0);
          if (_target) {
            pushOpts._target = _target;
          }
          targetView.pushInput(sourceEl, targetCtx, newCid, event || phxEvent, pushOpts, callback);
        } else if (eventType === "submit") {
          targetView.submitForm(sourceEl, targetCtx, event || phxEvent, pushOpts);
        } else {
          targetView.pushEvent(eventType, sourceEl, targetCtx, event || phxEvent, data, pushOpts);
        }
      });
    },
    exec_add_class(eventType, phxEvent, view, sourceEl, el, { names, transition, time }) {
      this.addOrRemoveClasses(el, names, [], transition, time, view);
    },
    exec_remove_class(eventType, phxEvent, view, sourceEl, el, { names, transition, time }) {
      this.addOrRemoveClasses(el, [], names, transition, time, view);
    },
    exec_transition(eventType, phxEvent, view, sourceEl, el, { time, transition }) {
      let [transition_start, running, transition_end] = transition;
      let onStart = () => this.addOrRemoveClasses(el, transition_start.concat(running), []);
      let onDone = () => this.addOrRemoveClasses(el, transition_end, transition_start.concat(running));
      view.transition(time, onStart, onDone);
    },
    exec_toggle(eventType, phxEvent, view, sourceEl, el, { display, ins, outs, time }) {
      this.toggle(eventType, view, el, display, ins, outs, time);
    },
    exec_show(eventType, phxEvent, view, sourceEl, el, { display, transition, time }) {
      this.show(eventType, view, el, display, transition, time);
    },
    exec_hide(eventType, phxEvent, view, sourceEl, el, { display, transition, time }) {
      this.hide(eventType, view, el, display, transition, time);
    },
    exec_set_attr(eventType, phxEvent, view, sourceEl, el, { attr: [attr, val] }) {
      this.setOrRemoveAttrs(el, [[attr, val]], []);
    },
    exec_remove_attr(eventType, phxEvent, view, sourceEl, el, { attr }) {
      this.setOrRemoveAttrs(el, [], [attr]);
    },
    show(eventType, view, el, display, transition, time) {
      if (!this.isVisible(el)) {
        this.toggle(eventType, view, el, display, transition, null, time);
      }
    },
    hide(eventType, view, el, display, transition, time) {
      if (this.isVisible(el)) {
        this.toggle(eventType, view, el, display, null, transition, time);
      }
    },
    toggle(eventType, view, el, display, ins, outs, time) {
      let [inClasses, inStartClasses, inEndClasses] = ins || [[], [], []];
      let [outClasses, outStartClasses, outEndClasses] = outs || [[], [], []];
      if (inClasses.length > 0 || outClasses.length > 0) {
        if (this.isVisible(el)) {
          let onStart = () => {
            this.addOrRemoveClasses(el, outStartClasses, inClasses.concat(inStartClasses).concat(inEndClasses));
            window.requestAnimationFrame(() => {
              this.addOrRemoveClasses(el, outClasses, []);
              window.requestAnimationFrame(() => this.addOrRemoveClasses(el, outEndClasses, outStartClasses));
            });
          };
          el.dispatchEvent(new Event("phx:hide-start"));
          view.transition(time, onStart, () => {
            this.addOrRemoveClasses(el, [], outClasses.concat(outEndClasses));
            dom_default.putSticky(el, "toggle", (currentEl) => currentEl.style.display = "none");
            el.dispatchEvent(new Event("phx:hide-end"));
          });
        } else {
          if (eventType === "remove") {
            return;
          }
          let onStart = () => {
            this.addOrRemoveClasses(el, inStartClasses, outClasses.concat(outStartClasses).concat(outEndClasses));
            dom_default.putSticky(el, "toggle", (currentEl) => currentEl.style.display = display || "block");
            window.requestAnimationFrame(() => {
              this.addOrRemoveClasses(el, inClasses, []);
              window.requestAnimationFrame(() => this.addOrRemoveClasses(el, inEndClasses, inStartClasses));
            });
          };
          el.dispatchEvent(new Event("phx:show-start"));
          view.transition(time, onStart, () => {
            this.addOrRemoveClasses(el, [], inClasses.concat(inEndClasses));
            el.dispatchEvent(new Event("phx:show-end"));
          });
        }
      } else {
        if (this.isVisible(el)) {
          window.requestAnimationFrame(() => {
            el.dispatchEvent(new Event("phx:hide-start"));
            dom_default.putSticky(el, "toggle", (currentEl) => currentEl.style.display = "none");
            el.dispatchEvent(new Event("phx:hide-end"));
          });
        } else {
          window.requestAnimationFrame(() => {
            el.dispatchEvent(new Event("phx:show-start"));
            dom_default.putSticky(el, "toggle", (currentEl) => currentEl.style.display = display || "block");
            el.dispatchEvent(new Event("phx:show-end"));
          });
        }
      }
    },
    addOrRemoveClasses(el, adds, removes, transition, time, view) {
      let [transition_run, transition_start, transition_end] = transition || [[], [], []];
      if (transition_run.length > 0) {
        let onStart = () => this.addOrRemoveClasses(el, transition_start.concat(transition_run), []);
        let onDone = () => this.addOrRemoveClasses(el, adds.concat(transition_end), removes.concat(transition_run).concat(transition_start));
        return view.transition(time, onStart, onDone);
      }
      window.requestAnimationFrame(() => {
        let [prevAdds, prevRemoves] = dom_default.getSticky(el, "classes", [[], []]);
        let keepAdds = adds.filter((name) => prevAdds.indexOf(name) < 0 && !el.classList.contains(name));
        let keepRemoves = removes.filter((name) => prevRemoves.indexOf(name) < 0 && el.classList.contains(name));
        let newAdds = prevAdds.filter((name) => removes.indexOf(name) < 0).concat(keepAdds);
        let newRemoves = prevRemoves.filter((name) => adds.indexOf(name) < 0).concat(keepRemoves);
        dom_default.putSticky(el, "classes", (currentEl) => {
          currentEl.classList.remove(...newRemoves);
          currentEl.classList.add(...newAdds);
          return [newAdds, newRemoves];
        });
      });
    },
    setOrRemoveAttrs(el, sets, removes) {
      let [prevSets, prevRemoves] = dom_default.getSticky(el, "attrs", [[], []]);
      let alteredAttrs = sets.map(([attr, _val]) => attr).concat(removes);
      let newSets = prevSets.filter(([attr, _val]) => !alteredAttrs.includes(attr)).concat(sets);
      let newRemoves = prevRemoves.filter((attr) => !alteredAttrs.includes(attr)).concat(removes);
      dom_default.putSticky(el, "attrs", (currentEl) => {
        newRemoves.forEach((attr) => currentEl.removeAttribute(attr));
        newSets.forEach(([attr, val]) => currentEl.setAttribute(attr, val));
        return [newSets, newRemoves];
      });
    },
    hasAllClasses(el, classes) {
      return classes.every((name) => el.classList.contains(name));
    },
    isToggledOut(el, outClasses) {
      return !this.isVisible(el) || this.hasAllClasses(el, outClasses);
    },
    filterToEls(sourceEl, { to }) {
      return to ? dom_default.all(document, to) : [sourceEl];
    }
  };
  var js_default = JS;
  var serializeForm = (form, meta, onlyNames = []) => {
    let formData = new FormData(form);
    let toRemove = [];
    formData.forEach((val, key, _index) => {
      if (val instanceof File) {
        toRemove.push(key);
      }
    });
    toRemove.forEach((key) => formData.delete(key));
    let params = new URLSearchParams();
    for (let [key, val] of formData.entries()) {
      if (onlyNames.length === 0 || onlyNames.indexOf(key) >= 0) {
        params.append(key, val);
      }
    }
    for (let metaKey in meta) {
      params.append(metaKey, meta[metaKey]);
    }
    return params.toString();
  };
  var View = class {
    constructor(el, liveSocket2, parentView, flash) {
      this.liveSocket = liveSocket2;
      this.flash = flash;
      this.parent = parentView;
      this.root = parentView ? parentView.root : this;
      this.el = el;
      this.id = this.el.id;
      this.ref = 0;
      this.childJoins = 0;
      this.loaderTimer = null;
      this.pendingDiffs = [];
      this.pruningCIDs = [];
      this.redirect = false;
      this.href = null;
      this.joinCount = this.parent ? this.parent.joinCount - 1 : 0;
      this.joinPending = true;
      this.destroyed = false;
      this.joinCallback = function(onDone) {
        onDone && onDone();
      };
      this.stopCallback = function() {
      };
      this.pendingJoinOps = this.parent ? null : [];
      this.viewHooks = {};
      this.uploaders = {};
      this.formSubmits = [];
      this.children = this.parent ? null : {};
      this.root.children[this.id] = {};
      this.channel = this.liveSocket.channel(`lv:${this.id}`, () => {
        return {
          redirect: this.redirect ? this.href : void 0,
          url: this.redirect ? void 0 : this.href || void 0,
          params: this.connectParams(),
          session: this.getSession(),
          static: this.getStatic(),
          flash: this.flash
        };
      });
      this.showLoader(this.liveSocket.loaderTimeout);
      this.bindChannel();
    }
    setHref(href) {
      this.href = href;
    }
    setRedirect(href) {
      this.redirect = true;
      this.href = href;
    }
    isMain() {
      return this.el.hasAttribute(PHX_MAIN);
    }
    connectParams() {
      let params = this.liveSocket.params(this.el);
      let manifest = dom_default.all(document, `[${this.binding(PHX_TRACK_STATIC)}]`).map((node) => node.src || node.href).filter((url) => typeof url === "string");
      if (manifest.length > 0) {
        params["_track_static"] = manifest;
      }
      params["_mounts"] = this.joinCount;
      return params;
    }
    isConnected() {
      return this.channel.canPush();
    }
    getSession() {
      return this.el.getAttribute(PHX_SESSION);
    }
    getStatic() {
      let val = this.el.getAttribute(PHX_STATIC);
      return val === "" ? null : val;
    }
    destroy(callback = function() {
    }) {
      this.destroyAllChildren();
      this.destroyed = true;
      delete this.root.children[this.id];
      if (this.parent) {
        delete this.root.children[this.parent.id][this.id];
      }
      clearTimeout(this.loaderTimer);
      let onFinished = () => {
        callback();
        for (let id in this.viewHooks) {
          this.destroyHook(this.viewHooks[id]);
        }
      };
      dom_default.markPhxChildDestroyed(this.el);
      this.log("destroyed", () => ["the child has been removed from the parent"]);
      this.channel.leave().receive("ok", onFinished).receive("error", onFinished).receive("timeout", onFinished);
    }
    setContainerClasses(...classes) {
      this.el.classList.remove(PHX_CONNECTED_CLASS, PHX_DISCONNECTED_CLASS, PHX_ERROR_CLASS);
      this.el.classList.add(...classes);
    }
    showLoader(timeout) {
      clearTimeout(this.loaderTimer);
      if (timeout) {
        this.loaderTimer = setTimeout(() => this.showLoader(), timeout);
      } else {
        for (let id in this.viewHooks) {
          this.viewHooks[id].__disconnected();
        }
        this.setContainerClasses(PHX_DISCONNECTED_CLASS);
      }
    }
    hideLoader() {
      clearTimeout(this.loaderTimer);
      this.setContainerClasses(PHX_CONNECTED_CLASS);
    }
    triggerReconnected() {
      for (let id in this.viewHooks) {
        this.viewHooks[id].__reconnected();
      }
    }
    log(kind, msgCallback) {
      this.liveSocket.log(this, kind, msgCallback);
    }
    transition(time, onStart, onDone = function() {
    }) {
      this.liveSocket.transition(time, onStart, onDone);
    }
    withinTargets(phxTarget, callback) {
      if (phxTarget instanceof HTMLElement || phxTarget instanceof SVGElement) {
        return this.liveSocket.owner(phxTarget, (view) => callback(view, phxTarget));
      }
      if (isCid(phxTarget)) {
        let targets = dom_default.findComponentNodeList(this.el, phxTarget);
        if (targets.length === 0) {
          logError(`no component found matching phx-target of ${phxTarget}`);
        } else {
          callback(this, parseInt(phxTarget));
        }
      } else {
        let targets = Array.from(document.querySelectorAll(phxTarget));
        if (targets.length === 0) {
          logError(`nothing found matching the phx-target selector "${phxTarget}"`);
        }
        targets.forEach((target) => this.liveSocket.owner(target, (view) => callback(view, target)));
      }
    }
    applyDiff(type, rawDiff, callback) {
      this.log(type, () => ["", clone(rawDiff)]);
      let { diff, reply, events, title } = Rendered.extract(rawDiff);
      if (title) {
        dom_default.putTitle(title);
      }
      callback({ diff, reply, events });
      return reply;
    }
    onJoin(resp) {
      let { rendered, container } = resp;
      if (container) {
        let [tag, attrs] = container;
        this.el = dom_default.replaceRootContainer(this.el, tag, attrs);
      }
      this.childJoins = 0;
      this.joinPending = true;
      this.flash = null;
      browser_default.dropLocal(this.liveSocket.localStorage, window.location.pathname, CONSECUTIVE_RELOADS);
      this.applyDiff("mount", rendered, ({ diff, events }) => {
        this.rendered = new Rendered(this.id, diff);
        let html = this.renderContainer(null, "join");
        this.dropPendingRefs();
        let forms = this.formsForRecovery(html);
        this.joinCount++;
        if (forms.length > 0) {
          forms.forEach(([form, newForm, newCid], i) => {
            this.pushFormRecovery(form, newCid, (resp2) => {
              if (i === forms.length - 1) {
                this.onJoinComplete(resp2, html, events);
              }
            });
          });
        } else {
          this.onJoinComplete(resp, html, events);
        }
      });
    }
    dropPendingRefs() {
      dom_default.all(document, `[${PHX_REF_SRC}="${this.id}"][${PHX_REF}]`, (el) => {
        el.removeAttribute(PHX_REF);
        el.removeAttribute(PHX_REF_SRC);
      });
    }
    onJoinComplete({ live_patch }, html, events) {
      if (this.joinCount > 1 || this.parent && !this.parent.isJoinPending()) {
        return this.applyJoinPatch(live_patch, html, events);
      }
      let newChildren = dom_default.findPhxChildrenInFragment(html, this.id).filter((toEl) => {
        let fromEl = toEl.id && this.el.querySelector(`[id="${toEl.id}"]`);
        let phxStatic = fromEl && fromEl.getAttribute(PHX_STATIC);
        if (phxStatic) {
          toEl.setAttribute(PHX_STATIC, phxStatic);
        }
        return this.joinChild(toEl);
      });
      if (newChildren.length === 0) {
        if (this.parent) {
          this.root.pendingJoinOps.push([this, () => this.applyJoinPatch(live_patch, html, events)]);
          this.parent.ackJoin(this);
        } else {
          this.onAllChildJoinsComplete();
          this.applyJoinPatch(live_patch, html, events);
        }
      } else {
        this.root.pendingJoinOps.push([this, () => this.applyJoinPatch(live_patch, html, events)]);
      }
    }
    attachTrueDocEl() {
      this.el = dom_default.byId(this.id);
      this.el.setAttribute(PHX_ROOT_ID, this.root.id);
    }
    applyJoinPatch(live_patch, html, events) {
      this.attachTrueDocEl();
      let patch = new DOMPatch(this, this.el, this.id, html, null);
      patch.markPrunableContentForRemoval();
      this.performPatch(patch, false);
      this.joinNewChildren();
      dom_default.all(this.el, `[${this.binding(PHX_HOOK)}], [data-phx-${PHX_HOOK}]`, (hookEl) => {
        let hook = this.addHook(hookEl);
        if (hook) {
          hook.__mounted();
        }
      });
      this.joinPending = false;
      this.liveSocket.dispatchEvents(events);
      this.applyPendingUpdates();
      if (live_patch) {
        let { kind, to } = live_patch;
        this.liveSocket.historyPatch(to, kind);
      }
      this.hideLoader();
      if (this.joinCount > 1) {
        this.triggerReconnected();
      }
      this.stopCallback();
    }
    triggerBeforeUpdateHook(fromEl, toEl) {
      this.liveSocket.triggerDOM("onBeforeElUpdated", [fromEl, toEl]);
      let hook = this.getHook(fromEl);
      let isIgnored = hook && dom_default.isIgnored(fromEl, this.binding(PHX_UPDATE));
      if (hook && !fromEl.isEqualNode(toEl) && !(isIgnored && isEqualObj(fromEl.dataset, toEl.dataset))) {
        hook.__beforeUpdate();
        return hook;
      }
    }
    performPatch(patch, pruneCids) {
      let removedEls = [];
      let phxChildrenAdded = false;
      let updatedHookIds = /* @__PURE__ */ new Set();
      patch.after("added", (el) => {
        this.liveSocket.triggerDOM("onNodeAdded", [el]);
        let newHook = this.addHook(el);
        if (newHook) {
          newHook.__mounted();
        }
      });
      patch.after("phxChildAdded", (el) => {
        if (dom_default.isPhxSticky(el)) {
          this.liveSocket.joinRootViews();
        } else {
          phxChildrenAdded = true;
        }
      });
      patch.before("updated", (fromEl, toEl) => {
        let hook = this.triggerBeforeUpdateHook(fromEl, toEl);
        if (hook) {
          updatedHookIds.add(fromEl.id);
        }
      });
      patch.after("updated", (el) => {
        if (updatedHookIds.has(el.id)) {
          this.getHook(el).__updated();
        }
      });
      patch.after("discarded", (el) => {
        if (el.nodeType === Node.ELEMENT_NODE) {
          removedEls.push(el);
        }
      });
      patch.after("transitionsDiscarded", (els) => this.afterElementsRemoved(els, pruneCids));
      patch.perform();
      this.afterElementsRemoved(removedEls, pruneCids);
      return phxChildrenAdded;
    }
    afterElementsRemoved(elements, pruneCids) {
      let destroyedCIDs = [];
      elements.forEach((parent) => {
        let components = dom_default.all(parent, `[${PHX_COMPONENT}]`);
        let hooks2 = dom_default.all(parent, `[${this.binding(PHX_HOOK)}]`);
        components.concat(parent).forEach((el) => {
          let cid = this.componentID(el);
          if (isCid(cid) && destroyedCIDs.indexOf(cid) === -1) {
            destroyedCIDs.push(cid);
          }
        });
        hooks2.concat(parent).forEach((hookEl) => {
          let hook = this.getHook(hookEl);
          hook && this.destroyHook(hook);
        });
      });
      if (pruneCids) {
        this.maybePushComponentsDestroyed(destroyedCIDs);
      }
    }
    joinNewChildren() {
      dom_default.findPhxChildren(this.el, this.id).forEach((el) => this.joinChild(el));
    }
    getChildById(id) {
      return this.root.children[this.id][id];
    }
    getDescendentByEl(el) {
      if (el.id === this.id) {
        return this;
      } else {
        return this.children[el.getAttribute(PHX_PARENT_ID)][el.id];
      }
    }
    destroyDescendent(id) {
      for (let parentId in this.root.children) {
        for (let childId in this.root.children[parentId]) {
          if (childId === id) {
            return this.root.children[parentId][childId].destroy();
          }
        }
      }
    }
    joinChild(el) {
      let child = this.getChildById(el.id);
      if (!child) {
        let view = new View(el, this.liveSocket, this);
        this.root.children[this.id][view.id] = view;
        view.join();
        this.childJoins++;
        return true;
      }
    }
    isJoinPending() {
      return this.joinPending;
    }
    ackJoin(_child) {
      this.childJoins--;
      if (this.childJoins === 0) {
        if (this.parent) {
          this.parent.ackJoin(this);
        } else {
          this.onAllChildJoinsComplete();
        }
      }
    }
    onAllChildJoinsComplete() {
      this.joinCallback(() => {
        this.pendingJoinOps.forEach(([view, op]) => {
          if (!view.isDestroyed()) {
            op();
          }
        });
        this.pendingJoinOps = [];
      });
    }
    update(diff, events) {
      if (this.isJoinPending() || this.liveSocket.hasPendingLink() && !dom_default.isPhxSticky(this.el)) {
        return this.pendingDiffs.push({ diff, events });
      }
      this.rendered.mergeDiff(diff);
      let phxChildrenAdded = false;
      if (this.rendered.isComponentOnlyDiff(diff)) {
        this.liveSocket.time("component patch complete", () => {
          let parentCids = dom_default.findParentCIDs(this.el, this.rendered.componentCIDs(diff));
          parentCids.forEach((parentCID) => {
            if (this.componentPatch(this.rendered.getComponent(diff, parentCID), parentCID)) {
              phxChildrenAdded = true;
            }
          });
        });
      } else if (!isEmpty(diff)) {
        this.liveSocket.time("full patch complete", () => {
          let html = this.renderContainer(diff, "update");
          let patch = new DOMPatch(this, this.el, this.id, html, null);
          phxChildrenAdded = this.performPatch(patch, true);
        });
      }
      this.liveSocket.dispatchEvents(events);
      if (phxChildrenAdded) {
        this.joinNewChildren();
      }
    }
    renderContainer(diff, kind) {
      return this.liveSocket.time(`toString diff (${kind})`, () => {
        let tag = this.el.tagName;
        let cids = diff ? this.rendered.componentCIDs(diff).concat(this.pruningCIDs) : null;
        let html = this.rendered.toString(cids);
        return `<${tag}>${html}</${tag}>`;
      });
    }
    componentPatch(diff, cid) {
      if (isEmpty(diff))
        return false;
      let html = this.rendered.componentToString(cid);
      let patch = new DOMPatch(this, this.el, this.id, html, cid);
      let childrenAdded = this.performPatch(patch, true);
      return childrenAdded;
    }
    getHook(el) {
      return this.viewHooks[ViewHook.elementID(el)];
    }
    addHook(el) {
      if (ViewHook.elementID(el) || !el.getAttribute) {
        return;
      }
      let hookName = el.getAttribute(`data-phx-${PHX_HOOK}`) || el.getAttribute(this.binding(PHX_HOOK));
      if (hookName && !this.ownsElement(el)) {
        return;
      }
      let callbacks = this.liveSocket.getHookCallbacks(hookName);
      if (callbacks) {
        if (!el.id) {
          logError(`no DOM ID for hook "${hookName}". Hooks require a unique ID on each element.`, el);
        }
        let hook = new ViewHook(this, el, callbacks);
        this.viewHooks[ViewHook.elementID(hook.el)] = hook;
        return hook;
      } else if (hookName !== null) {
        logError(`unknown hook found for "${hookName}"`, el);
      }
    }
    destroyHook(hook) {
      hook.__destroyed();
      hook.__cleanup__();
      delete this.viewHooks[ViewHook.elementID(hook.el)];
    }
    applyPendingUpdates() {
      this.pendingDiffs.forEach(({ diff, events }) => this.update(diff, events));
      this.pendingDiffs = [];
    }
    onChannel(event, cb) {
      this.liveSocket.onChannel(this.channel, event, (resp) => {
        if (this.isJoinPending()) {
          this.root.pendingJoinOps.push([this, () => cb(resp)]);
        } else {
          this.liveSocket.requestDOMUpdate(() => cb(resp));
        }
      });
    }
    bindChannel() {
      this.liveSocket.onChannel(this.channel, "diff", (rawDiff) => {
        this.liveSocket.requestDOMUpdate(() => {
          this.applyDiff("update", rawDiff, ({ diff, events }) => this.update(diff, events));
        });
      });
      this.onChannel("redirect", ({ to, flash }) => this.onRedirect({ to, flash }));
      this.onChannel("live_patch", (redir) => this.onLivePatch(redir));
      this.onChannel("live_redirect", (redir) => this.onLiveRedirect(redir));
      this.channel.onError((reason) => this.onError(reason));
      this.channel.onClose((reason) => this.onClose(reason));
    }
    destroyAllChildren() {
      for (let id in this.root.children[this.id]) {
        this.getChildById(id).destroy();
      }
    }
    onLiveRedirect(redir) {
      let { to, kind, flash } = redir;
      let url = this.expandURL(to);
      this.liveSocket.historyRedirect(url, kind, flash);
    }
    onLivePatch(redir) {
      let { to, kind } = redir;
      this.href = this.expandURL(to);
      this.liveSocket.historyPatch(to, kind);
    }
    expandURL(to) {
      return to.startsWith("/") ? `${window.location.protocol}//${window.location.host}${to}` : to;
    }
    onRedirect({ to, flash }) {
      this.liveSocket.redirect(to, flash);
    }
    isDestroyed() {
      return this.destroyed;
    }
    join(callback) {
      if (this.isMain()) {
        this.stopCallback = this.liveSocket.withPageLoading({ to: this.href, kind: "initial" });
      }
      this.joinCallback = (onDone) => {
        onDone = onDone || function() {
        };
        callback ? callback(this.joinCount, onDone) : onDone();
      };
      this.liveSocket.wrapPush(this, { timeout: false }, () => {
        return this.channel.join().receive("ok", (data) => {
          if (!this.isDestroyed()) {
            this.liveSocket.requestDOMUpdate(() => this.onJoin(data));
          }
        }).receive("error", (resp) => !this.isDestroyed() && this.onJoinError(resp)).receive("timeout", () => !this.isDestroyed() && this.onJoinError({ reason: "timeout" }));
      });
    }
    onJoinError(resp) {
      if (resp.reason === "unauthorized" || resp.reason === "stale") {
        this.log("error", () => ["unauthorized live_redirect. Falling back to page request", resp]);
        return this.onRedirect({ to: this.href });
      }
      if (resp.redirect || resp.live_redirect) {
        this.joinPending = false;
        this.channel.leave();
      }
      if (resp.redirect) {
        return this.onRedirect(resp.redirect);
      }
      if (resp.live_redirect) {
        return this.onLiveRedirect(resp.live_redirect);
      }
      this.log("error", () => ["unable to join", resp]);
      if (this.liveSocket.isConnected()) {
        this.liveSocket.reloadWithJitter(this);
      }
    }
    onClose(reason) {
      if (this.isDestroyed()) {
        return;
      }
      if (this.liveSocket.hasPendingLink() && reason !== "leave") {
        return this.liveSocket.reloadWithJitter(this);
      }
      this.destroyAllChildren();
      this.liveSocket.dropActiveElement(this);
      if (document.activeElement) {
        document.activeElement.blur();
      }
      if (this.liveSocket.isUnloaded()) {
        this.showLoader(BEFORE_UNLOAD_LOADER_TIMEOUT);
      }
    }
    onError(reason) {
      this.onClose(reason);
      if (this.liveSocket.isConnected()) {
        this.log("error", () => ["view crashed", reason]);
      }
      if (!this.liveSocket.isUnloaded()) {
        this.displayError();
      }
    }
    displayError() {
      if (this.isMain()) {
        dom_default.dispatchEvent(window, "phx:page-loading-start", { detail: { to: this.href, kind: "error" } });
      }
      this.showLoader();
      this.setContainerClasses(PHX_DISCONNECTED_CLASS, PHX_ERROR_CLASS);
    }
    pushWithReply(refGenerator, event, payload, onReply = function() {
    }) {
      if (!this.isConnected()) {
        return;
      }
      let [ref, [el], opts] = refGenerator ? refGenerator() : [null, [], {}];
      let onLoadingDone = function() {
      };
      if (opts.page_loading || el && el.getAttribute(this.binding(PHX_PAGE_LOADING)) !== null) {
        onLoadingDone = this.liveSocket.withPageLoading({ kind: "element", target: el });
      }
      if (typeof payload.cid !== "number") {
        delete payload.cid;
      }
      return this.liveSocket.wrapPush(this, { timeout: true }, () => {
        return this.channel.push(event, payload, PUSH_TIMEOUT).receive("ok", (resp) => {
          if (ref !== null) {
            this.undoRefs(ref);
          }
          let finish = (hookReply) => {
            if (resp.redirect) {
              this.onRedirect(resp.redirect);
            }
            if (resp.live_patch) {
              this.onLivePatch(resp.live_patch);
            }
            if (resp.live_redirect) {
              this.onLiveRedirect(resp.live_redirect);
            }
            onLoadingDone();
            onReply(resp, hookReply);
          };
          if (resp.diff) {
            this.liveSocket.requestDOMUpdate(() => {
              let hookReply = this.applyDiff("update", resp.diff, ({ diff, events }) => {
                this.update(diff, events);
              });
              finish(hookReply);
            });
          } else {
            finish(null);
          }
        });
      });
    }
    undoRefs(ref) {
      dom_default.all(document, `[${PHX_REF_SRC}="${this.id}"][${PHX_REF}="${ref}"]`, (el) => {
        let disabledVal = el.getAttribute(PHX_DISABLED);
        el.removeAttribute(PHX_REF);
        el.removeAttribute(PHX_REF_SRC);
        if (el.getAttribute(PHX_READONLY) !== null) {
          el.readOnly = false;
          el.removeAttribute(PHX_READONLY);
        }
        if (disabledVal !== null) {
          el.disabled = disabledVal === "true" ? true : false;
          el.removeAttribute(PHX_DISABLED);
        }
        PHX_EVENT_CLASSES.forEach((className) => dom_default.removeClass(el, className));
        let disableRestore = el.getAttribute(PHX_DISABLE_WITH_RESTORE);
        if (disableRestore !== null) {
          el.innerText = disableRestore;
          el.removeAttribute(PHX_DISABLE_WITH_RESTORE);
        }
        let toEl = dom_default.private(el, PHX_REF);
        if (toEl) {
          let hook = this.triggerBeforeUpdateHook(el, toEl);
          DOMPatch.patchEl(el, toEl, this.liveSocket.getActiveElement());
          if (hook) {
            hook.__updated();
          }
          dom_default.deletePrivate(el, PHX_REF);
        }
      });
    }
    putRef(elements, event, opts = {}) {
      let newRef = this.ref++;
      let disableWith = this.binding(PHX_DISABLE_WITH);
      if (opts.loading) {
        elements = elements.concat(dom_default.all(document, opts.loading));
      }
      elements.forEach((el) => {
        el.classList.add(`phx-${event}-loading`);
        el.setAttribute(PHX_REF, newRef);
        el.setAttribute(PHX_REF_SRC, this.el.id);
        let disableText = el.getAttribute(disableWith);
        if (disableText !== null) {
          if (!el.getAttribute(PHX_DISABLE_WITH_RESTORE)) {
            el.setAttribute(PHX_DISABLE_WITH_RESTORE, el.innerText);
          }
          if (disableText !== "") {
            el.innerText = disableText;
          }
          el.setAttribute("disabled", "");
        }
      });
      return [newRef, elements, opts];
    }
    componentID(el) {
      let cid = el.getAttribute && el.getAttribute(PHX_COMPONENT);
      return cid ? parseInt(cid) : null;
    }
    targetComponentID(target, targetCtx, opts = {}) {
      if (isCid(targetCtx)) {
        return targetCtx;
      }
      let cidOrSelector = target.getAttribute(this.binding("target"));
      if (isCid(cidOrSelector)) {
        return parseInt(cidOrSelector);
      } else if (targetCtx && (cidOrSelector !== null || opts.target)) {
        return this.closestComponentID(targetCtx);
      } else {
        return null;
      }
    }
    closestComponentID(targetCtx) {
      if (isCid(targetCtx)) {
        return targetCtx;
      } else if (targetCtx) {
        return maybe(targetCtx.closest(`[${PHX_COMPONENT}]`), (el) => this.ownsElement(el) && this.componentID(el));
      } else {
        return null;
      }
    }
    pushHookEvent(targetCtx, event, payload, onReply) {
      if (!this.isConnected()) {
        this.log("hook", () => ["unable to push hook event. LiveView not connected", event, payload]);
        return false;
      }
      let [ref, els, opts] = this.putRef([], "hook");
      this.pushWithReply(() => [ref, els, opts], "event", {
        type: "hook",
        event,
        value: payload,
        cid: this.closestComponentID(targetCtx)
      }, (resp, reply) => onReply(reply, ref));
      return ref;
    }
    extractMeta(el, meta, value) {
      let prefix = this.binding("value-");
      for (let i = 0; i < el.attributes.length; i++) {
        if (!meta) {
          meta = {};
        }
        let name = el.attributes[i].name;
        if (name.startsWith(prefix)) {
          meta[name.replace(prefix, "")] = el.getAttribute(name);
        }
      }
      if (el.value !== void 0) {
        if (!meta) {
          meta = {};
        }
        meta.value = el.value;
        if (el.tagName === "INPUT" && CHECKABLE_INPUTS.indexOf(el.type) >= 0 && !el.checked) {
          delete meta.value;
        }
      }
      if (value) {
        if (!meta) {
          meta = {};
        }
        for (let key in value) {
          meta[key] = value[key];
        }
      }
      return meta;
    }
    pushEvent(type, el, targetCtx, phxEvent, meta, opts = {}) {
      this.pushWithReply(() => this.putRef([el], type, opts), "event", {
        type,
        event: phxEvent,
        value: this.extractMeta(el, meta, opts.value),
        cid: this.targetComponentID(el, targetCtx, opts)
      });
    }
    pushFileProgress(fileEl, entryRef, progress, onReply = function() {
    }) {
      this.liveSocket.withinOwners(fileEl.form, (view, targetCtx) => {
        view.pushWithReply(null, "progress", {
          event: fileEl.getAttribute(view.binding(PHX_PROGRESS)),
          ref: fileEl.getAttribute(PHX_UPLOAD_REF),
          entry_ref: entryRef,
          progress,
          cid: view.targetComponentID(fileEl.form, targetCtx)
        }, onReply);
      });
    }
    pushInput(inputEl, targetCtx, forceCid, phxEvent, opts, callback) {
      let uploads;
      let cid = isCid(forceCid) ? forceCid : this.targetComponentID(inputEl.form, targetCtx);
      let refGenerator = () => this.putRef([inputEl, inputEl.form], "change", opts);
      let formData;
      if (inputEl.getAttribute(this.binding("change"))) {
        formData = serializeForm(inputEl.form, { _target: opts._target }, [inputEl.name]);
      } else {
        formData = serializeForm(inputEl.form, { _target: opts._target });
      }
      if (dom_default.isUploadInput(inputEl) && inputEl.files && inputEl.files.length > 0) {
        LiveUploader.trackFiles(inputEl, Array.from(inputEl.files));
      }
      uploads = LiveUploader.serializeUploads(inputEl);
      let event = {
        type: "form",
        event: phxEvent,
        value: formData,
        uploads,
        cid
      };
      this.pushWithReply(refGenerator, "event", event, (resp) => {
        dom_default.showError(inputEl, this.liveSocket.binding(PHX_FEEDBACK_FOR));
        if (dom_default.isUploadInput(inputEl) && inputEl.getAttribute("data-phx-auto-upload") !== null) {
          if (LiveUploader.filesAwaitingPreflight(inputEl).length > 0) {
            let [ref, _els] = refGenerator();
            this.uploadFiles(inputEl.form, targetCtx, ref, cid, (_uploads) => {
              callback && callback(resp);
              this.triggerAwaitingSubmit(inputEl.form);
            });
          }
        } else {
          callback && callback(resp);
        }
      });
    }
    triggerAwaitingSubmit(formEl) {
      let awaitingSubmit = this.getScheduledSubmit(formEl);
      if (awaitingSubmit) {
        let [_el, _ref, _opts, callback] = awaitingSubmit;
        this.cancelSubmit(formEl);
        callback();
      }
    }
    getScheduledSubmit(formEl) {
      return this.formSubmits.find(([el, _ref, _opts, _callback]) => el.isSameNode(formEl));
    }
    scheduleSubmit(formEl, ref, opts, callback) {
      if (this.getScheduledSubmit(formEl)) {
        return true;
      }
      this.formSubmits.push([formEl, ref, opts, callback]);
    }
    cancelSubmit(formEl) {
      this.formSubmits = this.formSubmits.filter(([el, ref, _callback]) => {
        if (el.isSameNode(formEl)) {
          this.undoRefs(ref);
          return false;
        } else {
          return true;
        }
      });
    }
    pushFormSubmit(formEl, targetCtx, phxEvent, opts, onReply) {
      let filterIgnored = (el) => {
        let userIgnored = closestPhxBinding(el, `${this.binding(PHX_UPDATE)}=ignore`, el.form);
        return !(userIgnored || closestPhxBinding(el, "data-phx-update=ignore", el.form));
      };
      let filterDisables = (el) => {
        return el.hasAttribute(this.binding(PHX_DISABLE_WITH));
      };
      let filterButton = (el) => el.tagName == "BUTTON";
      let filterInput = (el) => ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName);
      let refGenerator = () => {
        let formElements = Array.from(formEl.elements);
        let disables = formElements.filter(filterDisables);
        let buttons = formElements.filter(filterButton).filter(filterIgnored);
        let inputs = formElements.filter(filterInput).filter(filterIgnored);
        buttons.forEach((button) => {
          button.setAttribute(PHX_DISABLED, button.disabled);
          button.disabled = true;
        });
        inputs.forEach((input) => {
          input.setAttribute(PHX_READONLY, input.readOnly);
          input.readOnly = true;
          if (input.files) {
            input.setAttribute(PHX_DISABLED, input.disabled);
            input.disabled = true;
          }
        });
        formEl.setAttribute(this.binding(PHX_PAGE_LOADING), "");
        return this.putRef([formEl].concat(disables).concat(buttons).concat(inputs), "submit", opts);
      };
      let cid = this.targetComponentID(formEl, targetCtx);
      if (LiveUploader.hasUploadsInProgress(formEl)) {
        let [ref, _els] = refGenerator();
        let push = () => this.pushFormSubmit(formEl, targetCtx, phxEvent, opts, onReply);
        return this.scheduleSubmit(formEl, ref, opts, push);
      } else if (LiveUploader.inputsAwaitingPreflight(formEl).length > 0) {
        let [ref, els] = refGenerator();
        let proxyRefGen = () => [ref, els, opts];
        this.uploadFiles(formEl, targetCtx, ref, cid, (_uploads) => {
          let formData = serializeForm(formEl, {});
          this.pushWithReply(proxyRefGen, "event", {
            type: "form",
            event: phxEvent,
            value: formData,
            cid
          }, onReply);
        });
      } else {
        let formData = serializeForm(formEl, {});
        this.pushWithReply(refGenerator, "event", {
          type: "form",
          event: phxEvent,
          value: formData,
          cid
        }, onReply);
      }
    }
    uploadFiles(formEl, targetCtx, ref, cid, onComplete) {
      let joinCountAtUpload = this.joinCount;
      let inputEls = LiveUploader.activeFileInputs(formEl);
      let numFileInputsInProgress = inputEls.length;
      inputEls.forEach((inputEl) => {
        let uploader = new LiveUploader(inputEl, this, () => {
          numFileInputsInProgress--;
          if (numFileInputsInProgress === 0) {
            onComplete();
          }
        });
        this.uploaders[inputEl] = uploader;
        let entries = uploader.entries().map((entry) => entry.toPreflightPayload());
        let payload = {
          ref: inputEl.getAttribute(PHX_UPLOAD_REF),
          entries,
          cid: this.targetComponentID(inputEl.form, targetCtx)
        };
        this.log("upload", () => ["sending preflight request", payload]);
        this.pushWithReply(null, "allow_upload", payload, (resp) => {
          this.log("upload", () => ["got preflight response", resp]);
          if (resp.error) {
            this.undoRefs(ref);
            let [entry_ref, reason] = resp.error;
            this.log("upload", () => [`error for entry ${entry_ref}`, reason]);
          } else {
            let onError = (callback) => {
              this.channel.onError(() => {
                if (this.joinCount === joinCountAtUpload) {
                  callback();
                }
              });
            };
            uploader.initAdapterUpload(resp, onError, this.liveSocket);
          }
        });
      });
    }
    dispatchUploads(name, filesOrBlobs) {
      let inputs = dom_default.findUploadInputs(this.el).filter((el) => el.name === name);
      if (inputs.length === 0) {
        logError(`no live file inputs found matching the name "${name}"`);
      } else if (inputs.length > 1) {
        logError(`duplicate live file inputs found matching the name "${name}"`);
      } else {
        dom_default.dispatchEvent(inputs[0], PHX_TRACK_UPLOADS, { detail: { files: filesOrBlobs } });
      }
    }
    pushFormRecovery(form, newCid, callback) {
      this.liveSocket.withinOwners(form, (view, targetCtx) => {
        let input = form.elements[0];
        let phxEvent = form.getAttribute(this.binding(PHX_AUTO_RECOVER)) || form.getAttribute(this.binding("change"));
        js_default.exec("change", phxEvent, view, input, ["push", { _target: input.name, newCid, callback }]);
      });
    }
    pushLinkPatch(href, targetEl, callback) {
      let linkRef = this.liveSocket.setPendingLink(href);
      let refGen = targetEl ? () => this.putRef([targetEl], "click") : null;
      let fallback = () => this.liveSocket.redirect(window.location.href);
      let push = this.pushWithReply(refGen, "live_patch", { url: href }, (resp) => {
        this.liveSocket.requestDOMUpdate(() => {
          if (resp.link_redirect) {
            this.liveSocket.replaceMain(href, null, callback, linkRef);
          } else {
            if (this.liveSocket.commitPendingLink(linkRef)) {
              this.href = href;
            }
            this.applyPendingUpdates();
            callback && callback(linkRef);
          }
        });
      });
      if (push) {
        push.receive("timeout", fallback);
      } else {
        fallback();
      }
    }
    formsForRecovery(html) {
      if (this.joinCount === 0) {
        return [];
      }
      let phxChange = this.binding("change");
      let template = document.createElement("template");
      template.innerHTML = html;
      return dom_default.all(this.el, `form[${phxChange}]`).filter((form) => form.id && this.ownsElement(form)).filter((form) => form.elements.length > 0).filter((form) => form.getAttribute(this.binding(PHX_AUTO_RECOVER)) !== "ignore").map((form) => {
        let newForm = template.content.querySelector(`form[id="${form.id}"][${phxChange}="${form.getAttribute(phxChange)}"]`);
        if (newForm) {
          return [form, newForm, this.targetComponentID(newForm)];
        } else {
          return [form, null, null];
        }
      }).filter(([form, newForm, newCid]) => newForm);
    }
    maybePushComponentsDestroyed(destroyedCIDs) {
      let willDestroyCIDs = destroyedCIDs.filter((cid) => {
        return dom_default.findComponentNodeList(this.el, cid).length === 0;
      });
      if (willDestroyCIDs.length > 0) {
        this.pruningCIDs.push(...willDestroyCIDs);
        this.pushWithReply(null, "cids_will_destroy", { cids: willDestroyCIDs }, () => {
          this.pruningCIDs = this.pruningCIDs.filter((cid) => willDestroyCIDs.indexOf(cid) !== -1);
          let completelyDestroyCIDs = willDestroyCIDs.filter((cid) => {
            return dom_default.findComponentNodeList(this.el, cid).length === 0;
          });
          if (completelyDestroyCIDs.length > 0) {
            this.pushWithReply(null, "cids_destroyed", { cids: completelyDestroyCIDs }, (resp) => {
              this.rendered.pruneCIDs(resp.cids);
            });
          }
        });
      }
    }
    ownsElement(el) {
      return el.getAttribute(PHX_PARENT_ID) === this.id || maybe(el.closest(PHX_VIEW_SELECTOR), (node) => node.id) === this.id;
    }
    submitForm(form, targetCtx, phxEvent, opts = {}) {
      dom_default.putPrivate(form, PHX_HAS_SUBMITTED, true);
      let phxFeedback = this.liveSocket.binding(PHX_FEEDBACK_FOR);
      let inputs = Array.from(form.elements);
      this.liveSocket.blurActiveElement(this);
      this.pushFormSubmit(form, targetCtx, phxEvent, opts, () => {
        inputs.forEach((input) => dom_default.showError(input, phxFeedback));
        this.liveSocket.restorePreviouslyActiveFocus();
      });
    }
    binding(kind) {
      return this.liveSocket.binding(kind);
    }
  };
  var LiveSocket = class {
    constructor(url, phxSocket, opts = {}) {
      this.unloaded = false;
      if (!phxSocket || phxSocket.constructor.name === "Object") {
        throw new Error(`
      a phoenix Socket must be provided as the second argument to the LiveSocket constructor. For example:

          import {Socket} from "phoenix"
          import {LiveSocket} from "phoenix_live_view"
          let liveSocket = new LiveSocket("/live", Socket, {...})
      `);
      }
      this.socket = new phxSocket(url, opts);
      this.bindingPrefix = opts.bindingPrefix || BINDING_PREFIX;
      this.opts = opts;
      this.params = closure2(opts.params || {});
      this.viewLogger = opts.viewLogger;
      this.metadataCallbacks = opts.metadata || {};
      this.defaults = Object.assign(clone(DEFAULTS), opts.defaults || {});
      this.activeElement = null;
      this.prevActive = null;
      this.silenced = false;
      this.main = null;
      this.outgoingMainEl = null;
      this.clickStartedAtTarget = null;
      this.linkRef = 1;
      this.roots = {};
      this.href = window.location.href;
      this.pendingLink = null;
      this.currentLocation = clone(window.location);
      this.hooks = opts.hooks || {};
      this.uploaders = opts.uploaders || {};
      this.loaderTimeout = opts.loaderTimeout || LOADER_TIMEOUT;
      this.reloadWithJitterTimer = null;
      this.maxReloads = opts.maxReloads || MAX_RELOADS;
      this.reloadJitterMin = opts.reloadJitterMin || RELOAD_JITTER_MIN;
      this.reloadJitterMax = opts.reloadJitterMax || RELOAD_JITTER_MAX;
      this.failsafeJitter = opts.failsafeJitter || FAILSAFE_JITTER;
      this.localStorage = opts.localStorage || window.localStorage;
      this.sessionStorage = opts.sessionStorage || window.sessionStorage;
      this.boundTopLevelEvents = false;
      this.domCallbacks = Object.assign({ onNodeAdded: closure2(), onBeforeElUpdated: closure2() }, opts.dom || {});
      this.transitions = new TransitionSet();
      window.addEventListener("pagehide", (_e) => {
        this.unloaded = true;
      });
      this.socket.onOpen(() => {
        if (this.isUnloaded()) {
          window.location.reload();
        }
      });
    }
    isProfileEnabled() {
      return this.sessionStorage.getItem(PHX_LV_PROFILE) === "true";
    }
    isDebugEnabled() {
      return this.sessionStorage.getItem(PHX_LV_DEBUG) === "true";
    }
    isDebugDisabled() {
      return this.sessionStorage.getItem(PHX_LV_DEBUG) === "false";
    }
    enableDebug() {
      this.sessionStorage.setItem(PHX_LV_DEBUG, "true");
    }
    enableProfiling() {
      this.sessionStorage.setItem(PHX_LV_PROFILE, "true");
    }
    disableDebug() {
      this.sessionStorage.setItem(PHX_LV_DEBUG, "false");
    }
    disableProfiling() {
      this.sessionStorage.removeItem(PHX_LV_PROFILE);
    }
    enableLatencySim(upperBoundMs) {
      this.enableDebug();
      console.log("latency simulator enabled for the duration of this browser session. Call disableLatencySim() to disable");
      this.sessionStorage.setItem(PHX_LV_LATENCY_SIM, upperBoundMs);
    }
    disableLatencySim() {
      this.sessionStorage.removeItem(PHX_LV_LATENCY_SIM);
    }
    getLatencySim() {
      let str = this.sessionStorage.getItem(PHX_LV_LATENCY_SIM);
      return str ? parseInt(str) : null;
    }
    getSocket() {
      return this.socket;
    }
    connect() {
      if (window.location.hostname === "localhost" && !this.isDebugDisabled()) {
        this.enableDebug();
      }
      let doConnect = () => {
        if (this.joinRootViews()) {
          this.bindTopLevelEvents();
          this.socket.connect();
        } else if (this.main) {
          this.socket.connect();
        }
      };
      if (["complete", "loaded", "interactive"].indexOf(document.readyState) >= 0) {
        doConnect();
      } else {
        document.addEventListener("DOMContentLoaded", () => doConnect());
      }
    }
    disconnect(callback) {
      clearTimeout(this.reloadWithJitterTimer);
      this.socket.disconnect(callback);
    }
    replaceTransport(transport) {
      clearTimeout(this.reloadWithJitterTimer);
      this.socket.replaceTransport(transport);
      this.connect();
    }
    execJS(el, encodedJS, eventType = null) {
      this.owner(el, (view) => js_default.exec(eventType, encodedJS, view, el));
    }
    triggerDOM(kind, args) {
      this.domCallbacks[kind](...args);
    }
    time(name, func) {
      if (!this.isProfileEnabled() || !console.time) {
        return func();
      }
      console.time(name);
      let result = func();
      console.timeEnd(name);
      return result;
    }
    log(view, kind, msgCallback) {
      if (this.viewLogger) {
        let [msg, obj] = msgCallback();
        this.viewLogger(view, kind, msg, obj);
      } else if (this.isDebugEnabled()) {
        let [msg, obj] = msgCallback();
        debug(view, kind, msg, obj);
      }
    }
    requestDOMUpdate(callback) {
      this.transitions.after(callback);
    }
    transition(time, onStart, onDone = function() {
    }) {
      this.transitions.addTransition(time, onStart, onDone);
    }
    onChannel(channel, event, cb) {
      channel.on(event, (data) => {
        let latency = this.getLatencySim();
        if (!latency) {
          cb(data);
        } else {
          console.log(`simulating ${latency}ms of latency from server to client`);
          setTimeout(() => cb(data), latency);
        }
      });
    }
    wrapPush(view, opts, push) {
      let latency = this.getLatencySim();
      let oldJoinCount = view.joinCount;
      if (!latency) {
        if (this.isConnected() && opts.timeout) {
          return push().receive("timeout", () => {
            if (view.joinCount === oldJoinCount && !view.isDestroyed()) {
              this.reloadWithJitter(view, () => {
                this.log(view, "timeout", () => ["received timeout while communicating with server. Falling back to hard refresh for recovery"]);
              });
            }
          });
        } else {
          return push();
        }
      }
      console.log(`simulating ${latency}ms of latency from client to server`);
      let fakePush = {
        receives: [],
        receive(kind, cb) {
          this.receives.push([kind, cb]);
        }
      };
      setTimeout(() => {
        if (view.isDestroyed()) {
          return;
        }
        fakePush.receives.reduce((acc, [kind, cb]) => acc.receive(kind, cb), push());
      }, latency);
      return fakePush;
    }
    reloadWithJitter(view, log) {
      clearTimeout(this.reloadWithJitterTimer);
      this.disconnect();
      let minMs = this.reloadJitterMin;
      let maxMs = this.reloadJitterMax;
      let afterMs = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
      let tries = browser_default.updateLocal(this.localStorage, window.location.pathname, CONSECUTIVE_RELOADS, 0, (count) => count + 1);
      if (tries > this.maxReloads) {
        afterMs = this.failsafeJitter;
      }
      this.reloadWithJitterTimer = setTimeout(() => {
        if (view.isDestroyed() || view.isConnected()) {
          return;
        }
        view.destroy();
        log ? log() : this.log(view, "join", () => [`encountered ${tries} consecutive reloads`]);
        if (tries > this.maxReloads) {
          this.log(view, "join", () => [`exceeded ${this.maxReloads} consecutive reloads. Entering failsafe mode`]);
        }
        if (this.hasPendingLink()) {
          window.location = this.pendingLink;
        } else {
          window.location.reload();
        }
      }, afterMs);
    }
    getHookCallbacks(name) {
      return name && name.startsWith("Phoenix.") ? hooks_default[name.split(".")[1]] : this.hooks[name];
    }
    isUnloaded() {
      return this.unloaded;
    }
    isConnected() {
      return this.socket.isConnected();
    }
    getBindingPrefix() {
      return this.bindingPrefix;
    }
    binding(kind) {
      return `${this.getBindingPrefix()}${kind}`;
    }
    channel(topic, params) {
      return this.socket.channel(topic, params);
    }
    joinRootViews() {
      let rootsFound = false;
      dom_default.all(document, `${PHX_VIEW_SELECTOR}:not([${PHX_PARENT_ID}])`, (rootEl) => {
        if (!this.getRootById(rootEl.id)) {
          let view = this.newRootView(rootEl);
          view.setHref(this.getHref());
          view.join();
          if (rootEl.hasAttribute(PHX_MAIN)) {
            this.main = view;
          }
        }
        rootsFound = true;
      });
      return rootsFound;
    }
    redirect(to, flash) {
      this.disconnect();
      browser_default.redirect(to, flash);
    }
    replaceMain(href, flash, callback = null, linkRef = this.setPendingLink(href)) {
      this.outgoingMainEl = this.outgoingMainEl || this.main.el;
      let newMainEl = dom_default.cloneNode(this.outgoingMainEl, "");
      this.main.showLoader(this.loaderTimeout);
      this.main.destroy();
      this.main = this.newRootView(newMainEl, flash);
      this.main.setRedirect(href);
      this.transitionRemoves();
      this.main.join((joinCount, onDone) => {
        if (joinCount === 1 && this.commitPendingLink(linkRef)) {
          this.requestDOMUpdate(() => {
            dom_default.findPhxSticky(document).forEach((el) => newMainEl.appendChild(el));
            this.outgoingMainEl.replaceWith(newMainEl);
            this.outgoingMainEl = null;
            callback && requestAnimationFrame(callback);
            onDone();
          });
        }
      });
    }
    transitionRemoves(elements) {
      let removeAttr = this.binding("remove");
      elements = elements || dom_default.all(document, `[${removeAttr}]`);
      elements.forEach((el) => {
        if (document.body.contains(el)) {
          this.execJS(el, el.getAttribute(removeAttr), "remove");
        }
      });
    }
    isPhxView(el) {
      return el.getAttribute && el.getAttribute(PHX_SESSION) !== null;
    }
    newRootView(el, flash) {
      let view = new View(el, this, null, flash);
      this.roots[view.id] = view;
      return view;
    }
    owner(childEl, callback) {
      let view = maybe(childEl.closest(PHX_VIEW_SELECTOR), (el) => this.getViewByEl(el)) || this.main;
      if (view) {
        callback(view);
      }
    }
    withinOwners(childEl, callback) {
      this.owner(childEl, (view) => callback(view, childEl));
    }
    getViewByEl(el) {
      let rootId = el.getAttribute(PHX_ROOT_ID);
      return maybe(this.getRootById(rootId), (root) => root.getDescendentByEl(el));
    }
    getRootById(id) {
      return this.roots[id];
    }
    destroyAllViews() {
      for (let id in this.roots) {
        this.roots[id].destroy();
        delete this.roots[id];
      }
      this.main = null;
    }
    destroyViewByEl(el) {
      let root = this.getRootById(el.getAttribute(PHX_ROOT_ID));
      if (root && root.id === el.id) {
        root.destroy();
        delete this.roots[root.id];
      } else if (root) {
        root.destroyDescendent(el.id);
      }
    }
    setActiveElement(target) {
      if (this.activeElement === target) {
        return;
      }
      this.activeElement = target;
      let cancel = () => {
        if (target === this.activeElement) {
          this.activeElement = null;
        }
        target.removeEventListener("mouseup", this);
        target.removeEventListener("touchend", this);
      };
      target.addEventListener("mouseup", cancel);
      target.addEventListener("touchend", cancel);
    }
    getActiveElement() {
      if (document.activeElement === document.body) {
        return this.activeElement || document.activeElement;
      } else {
        return document.activeElement || document.body;
      }
    }
    dropActiveElement(view) {
      if (this.prevActive && view.ownsElement(this.prevActive)) {
        this.prevActive = null;
      }
    }
    restorePreviouslyActiveFocus() {
      if (this.prevActive && this.prevActive !== document.body) {
        this.prevActive.focus();
      }
    }
    blurActiveElement() {
      this.prevActive = this.getActiveElement();
      if (this.prevActive !== document.body) {
        this.prevActive.blur();
      }
    }
    bindTopLevelEvents() {
      if (this.boundTopLevelEvents) {
        return;
      }
      this.boundTopLevelEvents = true;
      this.socket.onClose((event) => {
        if (event && event.code === 1e3 && this.main) {
          this.reloadWithJitter(this.main);
        }
      });
      document.body.addEventListener("click", function() {
      });
      window.addEventListener("pageshow", (e) => {
        if (e.persisted) {
          this.getSocket().disconnect();
          this.withPageLoading({ to: window.location.href, kind: "redirect" });
          window.location.reload();
        }
      }, true);
      this.bindNav();
      this.bindClicks();
      this.bindForms();
      this.bind({ keyup: "keyup", keydown: "keydown" }, (e, type, view, targetEl, phxEvent, eventTarget) => {
        let matchKey = targetEl.getAttribute(this.binding(PHX_KEY));
        let pressedKey = e.key && e.key.toLowerCase();
        if (matchKey && matchKey.toLowerCase() !== pressedKey) {
          return;
        }
        let data = __spreadValues({ key: e.key }, this.eventMeta(type, e, targetEl));
        js_default.exec(type, phxEvent, view, targetEl, ["push", { data }]);
      });
      this.bind({ blur: "focusout", focus: "focusin" }, (e, type, view, targetEl, phxEvent, eventTarget) => {
        if (!eventTarget) {
          let data = __spreadValues({ key: e.key }, this.eventMeta(type, e, targetEl));
          js_default.exec(type, phxEvent, view, targetEl, ["push", { data }]);
        }
      });
      this.bind({ blur: "blur", focus: "focus" }, (e, type, view, targetEl, targetCtx, phxEvent, phxTarget) => {
        if (phxTarget === "window") {
          let data = this.eventMeta(type, e, targetEl);
          js_default.exec(type, phxEvent, view, targetEl, ["push", { data }]);
        }
      });
      window.addEventListener("dragover", (e) => e.preventDefault());
      window.addEventListener("drop", (e) => {
        e.preventDefault();
        let dropTargetId = maybe(closestPhxBinding(e.target, this.binding(PHX_DROP_TARGET)), (trueTarget) => {
          return trueTarget.getAttribute(this.binding(PHX_DROP_TARGET));
        });
        let dropTarget = dropTargetId && document.getElementById(dropTargetId);
        let files = Array.from(e.dataTransfer.files || []);
        if (!dropTarget || dropTarget.disabled || files.length === 0 || !(dropTarget.files instanceof FileList)) {
          return;
        }
        LiveUploader.trackFiles(dropTarget, files);
        dropTarget.dispatchEvent(new Event("input", { bubbles: true }));
      });
      this.on(PHX_TRACK_UPLOADS, (e) => {
        let uploadTarget = e.target;
        if (!dom_default.isUploadInput(uploadTarget)) {
          return;
        }
        let files = Array.from(e.detail.files || []).filter((f) => f instanceof File || f instanceof Blob);
        LiveUploader.trackFiles(uploadTarget, files);
        uploadTarget.dispatchEvent(new Event("input", { bubbles: true }));
      });
    }
    eventMeta(eventName, e, targetEl) {
      let callback = this.metadataCallbacks[eventName];
      return callback ? callback(e, targetEl) : {};
    }
    setPendingLink(href) {
      this.linkRef++;
      this.pendingLink = href;
      return this.linkRef;
    }
    commitPendingLink(linkRef) {
      if (this.linkRef !== linkRef) {
        return false;
      } else {
        this.href = this.pendingLink;
        this.pendingLink = null;
        return true;
      }
    }
    getHref() {
      return this.href;
    }
    hasPendingLink() {
      return !!this.pendingLink;
    }
    bind(events, callback) {
      for (let event in events) {
        let browserEventName = events[event];
        this.on(browserEventName, (e) => {
          let binding = this.binding(event);
          let windowBinding = this.binding(`window-${event}`);
          let targetPhxEvent = e.target.getAttribute && e.target.getAttribute(binding);
          if (targetPhxEvent) {
            this.debounce(e.target, e, browserEventName, () => {
              this.withinOwners(e.target, (view) => {
                callback(e, event, view, e.target, targetPhxEvent, null);
              });
            });
          } else {
            dom_default.all(document, `[${windowBinding}]`, (el) => {
              let phxEvent = el.getAttribute(windowBinding);
              this.debounce(el, e, browserEventName, () => {
                this.withinOwners(el, (view) => {
                  callback(e, event, view, el, phxEvent, "window");
                });
              });
            });
          }
        });
      }
    }
    bindClicks() {
      window.addEventListener("mousedown", (e) => this.clickStartedAtTarget = e.target);
      this.bindClick("click", "click", false);
      this.bindClick("mousedown", "capture-click", true);
    }
    bindClick(eventName, bindingName, capture) {
      let click = this.binding(bindingName);
      window.addEventListener(eventName, (e) => {
        let target = null;
        if (capture) {
          target = e.target.matches(`[${click}]`) ? e.target : e.target.querySelector(`[${click}]`);
        } else {
          let clickStartedAtTarget = this.clickStartedAtTarget || e.target;
          target = closestPhxBinding(clickStartedAtTarget, click);
          this.dispatchClickAway(e, clickStartedAtTarget);
          this.clickStartedAtTarget = null;
        }
        let phxEvent = target && target.getAttribute(click);
        if (!phxEvent) {
          return;
        }
        if (target.getAttribute("href") === "#") {
          e.preventDefault();
        }
        this.debounce(target, e, "click", () => {
          this.withinOwners(target, (view) => {
            js_default.exec("click", phxEvent, view, target, ["push", { data: this.eventMeta("click", e, target) }]);
          });
        });
      }, capture);
    }
    dispatchClickAway(e, clickStartedAt) {
      let phxClickAway = this.binding("click-away");
      dom_default.all(document, `[${phxClickAway}]`, (el) => {
        if (!(el.isSameNode(clickStartedAt) || el.contains(clickStartedAt))) {
          this.withinOwners(e.target, (view) => {
            let phxEvent = el.getAttribute(phxClickAway);
            if (js_default.isVisible(el)) {
              js_default.exec("click", phxEvent, view, el, ["push", { data: this.eventMeta("click", e, e.target) }]);
            }
          });
        }
      });
    }
    bindNav() {
      if (!browser_default.canPushState()) {
        return;
      }
      if (history.scrollRestoration) {
        history.scrollRestoration = "manual";
      }
      let scrollTimer = null;
      window.addEventListener("scroll", (_e) => {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
          browser_default.updateCurrentState((state) => Object.assign(state, { scroll: window.scrollY }));
        }, 100);
      });
      window.addEventListener("popstate", (event) => {
        if (!this.registerNewLocation(window.location)) {
          return;
        }
        let { type, id, root, scroll } = event.state || {};
        let href = window.location.href;
        this.requestDOMUpdate(() => {
          if (this.main.isConnected() && (type === "patch" && id === this.main.id)) {
            this.main.pushLinkPatch(href, null);
          } else {
            this.replaceMain(href, null, () => {
              if (root) {
                this.replaceRootHistory();
              }
              if (typeof scroll === "number") {
                setTimeout(() => {
                  window.scrollTo(0, scroll);
                }, 0);
              }
            });
          }
        });
      }, false);
      window.addEventListener("click", (e) => {
        let target = closestPhxBinding(e.target, PHX_LIVE_LINK);
        let type = target && target.getAttribute(PHX_LIVE_LINK);
        let wantsNewTab = e.metaKey || e.ctrlKey || e.button === 1;
        if (!type || !this.isConnected() || !this.main || wantsNewTab) {
          return;
        }
        let href = target.href;
        let linkState = target.getAttribute(PHX_LINK_STATE);
        e.preventDefault();
        e.stopImmediatePropagation();
        if (this.pendingLink === href) {
          return;
        }
        this.requestDOMUpdate(() => {
          if (type === "patch") {
            this.pushHistoryPatch(href, linkState, target);
          } else if (type === "redirect") {
            this.historyRedirect(href, linkState);
          } else {
            throw new Error(`expected ${PHX_LIVE_LINK} to be "patch" or "redirect", got: ${type}`);
          }
        });
      }, false);
    }
    dispatchEvent(event, payload = {}) {
      dom_default.dispatchEvent(window, `phx:${event}`, { detail: payload });
    }
    dispatchEvents(events) {
      events.forEach(([event, payload]) => this.dispatchEvent(event, payload));
    }
    withPageLoading(info, callback) {
      dom_default.dispatchEvent(window, "phx:page-loading-start", { detail: info });
      let done = () => dom_default.dispatchEvent(window, "phx:page-loading-stop", { detail: info });
      return callback ? callback(done) : done;
    }
    pushHistoryPatch(href, linkState, targetEl) {
      this.withPageLoading({ to: href, kind: "patch" }, (done) => {
        this.main.pushLinkPatch(href, targetEl, (linkRef) => {
          this.historyPatch(href, linkState, linkRef);
          done();
        });
      });
    }
    historyPatch(href, linkState, linkRef = this.setPendingLink(href)) {
      if (!this.commitPendingLink(linkRef)) {
        return;
      }
      browser_default.pushState(linkState, { type: "patch", id: this.main.id }, href);
      this.registerNewLocation(window.location);
    }
    historyRedirect(href, linkState, flash) {
      let scroll = window.scrollY;
      this.withPageLoading({ to: href, kind: "redirect" }, (done) => {
        this.replaceMain(href, flash, () => {
          browser_default.pushState(linkState, { type: "redirect", id: this.main.id, scroll }, href);
          this.registerNewLocation(window.location);
          done();
        });
      });
    }
    replaceRootHistory() {
      browser_default.pushState("replace", { root: true, type: "patch", id: this.main.id });
    }
    registerNewLocation(newLocation) {
      let { pathname, search } = this.currentLocation;
      if (pathname + search === newLocation.pathname + newLocation.search) {
        return false;
      } else {
        this.currentLocation = clone(newLocation);
        return true;
      }
    }
    bindForms() {
      let iterations = 0;
      this.on("submit", (e) => {
        let phxEvent = e.target.getAttribute(this.binding("submit"));
        if (!phxEvent) {
          return;
        }
        e.preventDefault();
        e.target.disabled = true;
        this.withinOwners(e.target, (view) => {
          js_default.exec("submit", phxEvent, view, e.target, ["push", {}]);
        });
      }, false);
      for (let type of ["change", "input"]) {
        this.on(type, (e) => {
          let phxChange = this.binding("change");
          let input = e.target;
          let inputEvent = input.getAttribute(phxChange);
          let formEvent = input.form && input.form.getAttribute(phxChange);
          let phxEvent = inputEvent || formEvent;
          if (!phxEvent) {
            return;
          }
          if (input.type === "number" && input.validity && input.validity.badInput) {
            return;
          }
          let dispatcher = inputEvent ? input : input.form;
          let currentIterations = iterations;
          iterations++;
          let { at, type: lastType } = dom_default.private(input, "prev-iteration") || {};
          if (at === currentIterations - 1 && type !== lastType) {
            return;
          }
          dom_default.putPrivate(input, "prev-iteration", { at: currentIterations, type });
          this.debounce(input, e, type, () => {
            this.withinOwners(dispatcher, (view) => {
              dom_default.putPrivate(input, PHX_HAS_FOCUSED, true);
              if (!dom_default.isTextualInput(input)) {
                this.setActiveElement(input);
              }
              js_default.exec("change", phxEvent, view, input, ["push", { _target: e.target.name, dispatcher }]);
            });
          });
        }, false);
      }
    }
    debounce(el, event, eventType, callback) {
      if (eventType === "blur" || eventType === "focusout") {
        return callback();
      }
      let phxDebounce = this.binding(PHX_DEBOUNCE);
      let phxThrottle = this.binding(PHX_THROTTLE);
      let defaultDebounce = this.defaults.debounce.toString();
      let defaultThrottle = this.defaults.throttle.toString();
      this.withinOwners(el, (view) => {
        let asyncFilter = () => !view.isDestroyed() && document.body.contains(el);
        dom_default.debounce(el, event, phxDebounce, defaultDebounce, phxThrottle, defaultThrottle, asyncFilter, () => {
          callback();
        });
      });
    }
    silenceEvents(callback) {
      this.silenced = true;
      callback();
      this.silenced = false;
    }
    on(event, callback) {
      window.addEventListener(event, (e) => {
        if (!this.silenced) {
          callback(e);
        }
      });
    }
  };
  var TransitionSet = class {
    constructor() {
      this.transitions = /* @__PURE__ */ new Set();
      this.pendingOps = [];
      this.reset();
    }
    reset() {
      this.transitions.forEach((timer) => {
        cancelTimeout(timer);
        this.transitions.delete(timer);
      });
      this.flushPendingOps();
    }
    after(callback) {
      if (this.size() === 0) {
        callback();
      } else {
        this.pushPendingOp(callback);
      }
    }
    addTransition(time, onStart, onDone) {
      onStart();
      let timer = setTimeout(() => {
        this.transitions.delete(timer);
        onDone();
        if (this.size() === 0) {
          this.flushPendingOps();
        }
      }, time);
      this.transitions.add(timer);
    }
    pushPendingOp(op) {
      this.pendingOps.push(op);
    }
    size() {
      return this.transitions.size;
    }
    flushPendingOps() {
      this.pendingOps.forEach((op) => op());
      this.pendingOps = [];
    }
  };

  // js/app.js
  var import_topbar = __toModule(require_topbar());
  var hooks = {};
  hooks.Map = {
    mounted() {
      this.map = L.map("mapid").setView([37.7749, -122.4194], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 17
      }).addTo(this.map);
      const foodTrucks = JSON.parse(this.el.dataset.foodTrucks);
      const heatMapPoints = foodTrucks.map((truck) => [truck.latitude, truck.longitude]);
      L.heatLayer(heatMapPoints, { minOpacity: 0.4, radius: 25, blur: 15, gradient: { 0.2: "blue", 0.65: "lime", 1: "red" } }).addTo(this.map);
    }
  };
  var csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content");
  var liveSocket = new LiveSocket("/live", Socket, { params: { _csrf_token: csrfToken }, hooks });
  import_topbar.default.config({ barColors: { 0: "#29d" }, shadowColor: "rgba(0, 0, 0, .3)" });
  window.addEventListener("phx:page-loading-start", (info) => import_topbar.default.show());
  window.addEventListener("phx:page-loading-stop", (info) => import_topbar.default.hide());
  liveSocket.connect();
  window.liveSocket = liveSocket;
})();
/**
 * @license MIT
 * topbar 1.0.0, 2021-01-06
 * https://buunguyen.github.io/topbar
 * Copyright (c) 2021 Buu Nguyen
 */
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vYXNzZXRzL3ZlbmRvci90b3BiYXIuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2h0bWwvcHJpdi9zdGF0aWMvcGhvZW5peF9odG1sLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peC9hc3NldHMvanMvcGhvZW5peC91dGlscy5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXgvYXNzZXRzL2pzL3Bob2VuaXgvY29uc3RhbnRzLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peC9hc3NldHMvanMvcGhvZW5peC9wdXNoLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peC9hc3NldHMvanMvcGhvZW5peC90aW1lci5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXgvYXNzZXRzL2pzL3Bob2VuaXgvY2hhbm5lbC5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXgvYXNzZXRzL2pzL3Bob2VuaXgvYWpheC5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXgvYXNzZXRzL2pzL3Bob2VuaXgvbG9uZ3BvbGwuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4L2Fzc2V0cy9qcy9waG9lbml4L3ByZXNlbmNlLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peC9hc3NldHMvanMvcGhvZW5peC9zZXJpYWxpemVyLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peC9hc3NldHMvanMvcGhvZW5peC9zb2NrZXQuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9hc3NldHMvanMvcGhvZW5peF9saXZlX3ZpZXcvY29uc3RhbnRzLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L2VudHJ5X3VwbG9hZGVyLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L3V0aWxzLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L2Jyb3dzZXIuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9hc3NldHMvanMvcGhvZW5peF9saXZlX3ZpZXcvZG9tLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L3VwbG9hZF9lbnRyeS5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXhfbGl2ZV92aWV3L2Fzc2V0cy9qcy9waG9lbml4X2xpdmVfdmlldy9saXZlX3VwbG9hZGVyLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L2hvb2tzLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L2RvbV9wb3N0X21vcnBoX3Jlc3RvcmVyLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL25vZGVfbW9kdWxlcy9tb3JwaGRvbS9kaXN0L21vcnBoZG9tLWVzbS5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXhfbGl2ZV92aWV3L2Fzc2V0cy9qcy9waG9lbml4X2xpdmVfdmlldy9kb21fcGF0Y2guanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9hc3NldHMvanMvcGhvZW5peF9saXZlX3ZpZXcvcmVuZGVyZWQuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9hc3NldHMvanMvcGhvZW5peF9saXZlX3ZpZXcvdmlld19ob29rLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L2pzLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L3ZpZXcuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9hc3NldHMvanMvcGhvZW5peF9saXZlX3ZpZXcvbGl2ZV9zb2NrZXQuanMiLCAiLi4vLi4vLi4vYXNzZXRzL2pzL2FwcC5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLyoqXG4gKiBAbGljZW5zZSBNSVRcbiAqIHRvcGJhciAxLjAuMCwgMjAyMS0wMS0wNlxuICogaHR0cHM6Ly9idXVuZ3V5ZW4uZ2l0aHViLmlvL3RvcGJhclxuICogQ29weXJpZ2h0IChjKSAyMDIxIEJ1dSBOZ3V5ZW5cbiAqL1xuKGZ1bmN0aW9uICh3aW5kb3csIGRvY3VtZW50KSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIC8vIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL3BhdWxpcmlzaC8xNTc5NjcxXG4gIChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGxhc3RUaW1lID0gMDtcbiAgICB2YXIgdmVuZG9ycyA9IFtcIm1zXCIsIFwibW96XCIsIFwid2Via2l0XCIsIFwib1wiXTtcbiAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHZlbmRvcnMubGVuZ3RoICYmICF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lOyArK3gpIHtcbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPVxuICAgICAgICB3aW5kb3dbdmVuZG9yc1t4XSArIFwiUmVxdWVzdEFuaW1hdGlvbkZyYW1lXCJdO1xuICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID1cbiAgICAgICAgd2luZG93W3ZlbmRvcnNbeF0gKyBcIkNhbmNlbEFuaW1hdGlvbkZyYW1lXCJdIHx8XG4gICAgICAgIHdpbmRvd1t2ZW5kb3JzW3hdICsgXCJDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcIl07XG4gICAgfVxuICAgIGlmICghd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSlcbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbiAoY2FsbGJhY2ssIGVsZW1lbnQpIHtcbiAgICAgICAgdmFyIGN1cnJUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgIHZhciB0aW1lVG9DYWxsID0gTWF0aC5tYXgoMCwgMTYgLSAoY3VyclRpbWUgLSBsYXN0VGltZSkpO1xuICAgICAgICB2YXIgaWQgPSB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgY2FsbGJhY2soY3VyclRpbWUgKyB0aW1lVG9DYWxsKTtcbiAgICAgICAgfSwgdGltZVRvQ2FsbCk7XG4gICAgICAgIGxhc3RUaW1lID0gY3VyclRpbWUgKyB0aW1lVG9DYWxsO1xuICAgICAgICByZXR1cm4gaWQ7XG4gICAgICB9O1xuICAgIGlmICghd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKVxuICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgIGNsZWFyVGltZW91dChpZCk7XG4gICAgICB9O1xuICB9KSgpO1xuXG4gIHZhciBjYW52YXMsXG4gICAgcHJvZ3Jlc3NUaW1lcklkLFxuICAgIGZhZGVUaW1lcklkLFxuICAgIGN1cnJlbnRQcm9ncmVzcyxcbiAgICBzaG93aW5nLFxuICAgIGFkZEV2ZW50ID0gZnVuY3Rpb24gKGVsZW0sIHR5cGUsIGhhbmRsZXIpIHtcbiAgICAgIGlmIChlbGVtLmFkZEV2ZW50TGlzdGVuZXIpIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBoYW5kbGVyLCBmYWxzZSk7XG4gICAgICBlbHNlIGlmIChlbGVtLmF0dGFjaEV2ZW50KSBlbGVtLmF0dGFjaEV2ZW50KFwib25cIiArIHR5cGUsIGhhbmRsZXIpO1xuICAgICAgZWxzZSBlbGVtW1wib25cIiArIHR5cGVdID0gaGFuZGxlcjtcbiAgICB9LFxuICAgIG9wdGlvbnMgPSB7XG4gICAgICBhdXRvUnVuOiB0cnVlLFxuICAgICAgYmFyVGhpY2tuZXNzOiAzLFxuICAgICAgYmFyQ29sb3JzOiB7XG4gICAgICAgIDA6IFwicmdiYSgyNiwgIDE4OCwgMTU2LCAuOSlcIixcbiAgICAgICAgXCIuMjVcIjogXCJyZ2JhKDUyLCAgMTUyLCAyMTksIC45KVwiLFxuICAgICAgICBcIi41MFwiOiBcInJnYmEoMjQxLCAxOTYsIDE1LCAgLjkpXCIsXG4gICAgICAgIFwiLjc1XCI6IFwicmdiYSgyMzAsIDEyNiwgMzQsICAuOSlcIixcbiAgICAgICAgXCIxLjBcIjogXCJyZ2JhKDIxMSwgODQsICAwLCAgIC45KVwiLFxuICAgICAgfSxcbiAgICAgIHNoYWRvd0JsdXI6IDEwLFxuICAgICAgc2hhZG93Q29sb3I6IFwicmdiYSgwLCAgIDAsICAgMCwgICAuNilcIixcbiAgICAgIGNsYXNzTmFtZTogbnVsbCxcbiAgICB9LFxuICAgIHJlcGFpbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBjYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgIGNhbnZhcy5oZWlnaHQgPSBvcHRpb25zLmJhclRoaWNrbmVzcyAqIDU7IC8vIG5lZWQgc3BhY2UgZm9yIHNoYWRvd1xuXG4gICAgICB2YXIgY3R4ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICAgIGN0eC5zaGFkb3dCbHVyID0gb3B0aW9ucy5zaGFkb3dCbHVyO1xuICAgICAgY3R4LnNoYWRvd0NvbG9yID0gb3B0aW9ucy5zaGFkb3dDb2xvcjtcblxuICAgICAgdmFyIGxpbmVHcmFkaWVudCA9IGN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudCgwLCAwLCBjYW52YXMud2lkdGgsIDApO1xuICAgICAgZm9yICh2YXIgc3RvcCBpbiBvcHRpb25zLmJhckNvbG9ycylcbiAgICAgICAgbGluZUdyYWRpZW50LmFkZENvbG9yU3RvcChzdG9wLCBvcHRpb25zLmJhckNvbG9yc1tzdG9wXSk7XG4gICAgICBjdHgubGluZVdpZHRoID0gb3B0aW9ucy5iYXJUaGlja25lc3M7XG4gICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICBjdHgubW92ZVRvKDAsIG9wdGlvbnMuYmFyVGhpY2tuZXNzIC8gMik7XG4gICAgICBjdHgubGluZVRvKFxuICAgICAgICBNYXRoLmNlaWwoY3VycmVudFByb2dyZXNzICogY2FudmFzLndpZHRoKSxcbiAgICAgICAgb3B0aW9ucy5iYXJUaGlja25lc3MgLyAyXG4gICAgICApO1xuICAgICAgY3R4LnN0cm9rZVN0eWxlID0gbGluZUdyYWRpZW50O1xuICAgICAgY3R4LnN0cm9rZSgpO1xuICAgIH0sXG4gICAgY3JlYXRlQ2FudmFzID0gZnVuY3Rpb24gKCkge1xuICAgICAgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICAgIHZhciBzdHlsZSA9IGNhbnZhcy5zdHlsZTtcbiAgICAgIHN0eWxlLnBvc2l0aW9uID0gXCJmaXhlZFwiO1xuICAgICAgc3R5bGUudG9wID0gc3R5bGUubGVmdCA9IHN0eWxlLnJpZ2h0ID0gc3R5bGUubWFyZ2luID0gc3R5bGUucGFkZGluZyA9IDA7XG4gICAgICBzdHlsZS56SW5kZXggPSAxMDAwMDE7XG4gICAgICBzdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICBpZiAob3B0aW9ucy5jbGFzc05hbWUpIGNhbnZhcy5jbGFzc0xpc3QuYWRkKG9wdGlvbnMuY2xhc3NOYW1lKTtcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY2FudmFzKTtcbiAgICAgIGFkZEV2ZW50KHdpbmRvdywgXCJyZXNpemVcIiwgcmVwYWludCk7XG4gICAgfSxcbiAgICB0b3BiYXIgPSB7XG4gICAgICBjb25maWc6IGZ1bmN0aW9uIChvcHRzKSB7XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBvcHRzKVxuICAgICAgICAgIGlmIChvcHRpb25zLmhhc093blByb3BlcnR5KGtleSkpIG9wdGlvbnNba2V5XSA9IG9wdHNba2V5XTtcbiAgICAgIH0sXG4gICAgICBzaG93OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChzaG93aW5nKSByZXR1cm47XG4gICAgICAgIHNob3dpbmcgPSB0cnVlO1xuICAgICAgICBpZiAoZmFkZVRpbWVySWQgIT09IG51bGwpIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZShmYWRlVGltZXJJZCk7XG4gICAgICAgIGlmICghY2FudmFzKSBjcmVhdGVDYW52YXMoKTtcbiAgICAgICAgY2FudmFzLnN0eWxlLm9wYWNpdHkgPSAxO1xuICAgICAgICBjYW52YXMuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICAgdG9wYmFyLnByb2dyZXNzKDApO1xuICAgICAgICBpZiAob3B0aW9ucy5hdXRvUnVuKSB7XG4gICAgICAgICAgKGZ1bmN0aW9uIGxvb3AoKSB7XG4gICAgICAgICAgICBwcm9ncmVzc1RpbWVySWQgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGxvb3ApO1xuICAgICAgICAgICAgdG9wYmFyLnByb2dyZXNzKFxuICAgICAgICAgICAgICBcIitcIiArIDAuMDUgKiBNYXRoLnBvdygxIC0gTWF0aC5zcXJ0KGN1cnJlbnRQcm9ncmVzcyksIDIpXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0pKCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBwcm9ncmVzczogZnVuY3Rpb24gKHRvKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdG8gPT09IFwidW5kZWZpbmVkXCIpIHJldHVybiBjdXJyZW50UHJvZ3Jlc3M7XG4gICAgICAgIGlmICh0eXBlb2YgdG8gPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICB0byA9XG4gICAgICAgICAgICAodG8uaW5kZXhPZihcIitcIikgPj0gMCB8fCB0by5pbmRleE9mKFwiLVwiKSA+PSAwXG4gICAgICAgICAgICAgID8gY3VycmVudFByb2dyZXNzXG4gICAgICAgICAgICAgIDogMCkgKyBwYXJzZUZsb2F0KHRvKTtcbiAgICAgICAgfVxuICAgICAgICBjdXJyZW50UHJvZ3Jlc3MgPSB0byA+IDEgPyAxIDogdG87XG4gICAgICAgIHJlcGFpbnQoKTtcbiAgICAgICAgcmV0dXJuIGN1cnJlbnRQcm9ncmVzcztcbiAgICAgIH0sXG4gICAgICBoaWRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghc2hvd2luZykgcmV0dXJuO1xuICAgICAgICBzaG93aW5nID0gZmFsc2U7XG4gICAgICAgIGlmIChwcm9ncmVzc1RpbWVySWQgIT0gbnVsbCkge1xuICAgICAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZShwcm9ncmVzc1RpbWVySWQpO1xuICAgICAgICAgIHByb2dyZXNzVGltZXJJZCA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgKGZ1bmN0aW9uIGxvb3AoKSB7XG4gICAgICAgICAgaWYgKHRvcGJhci5wcm9ncmVzcyhcIisuMVwiKSA+PSAxKSB7XG4gICAgICAgICAgICBjYW52YXMuc3R5bGUub3BhY2l0eSAtPSAwLjA1O1xuICAgICAgICAgICAgaWYgKGNhbnZhcy5zdHlsZS5vcGFjaXR5IDw9IDAuMDUpIHtcbiAgICAgICAgICAgICAgY2FudmFzLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgICAgICAgZmFkZVRpbWVySWQgPSBudWxsO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGZhZGVUaW1lcklkID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShsb29wKTtcbiAgICAgICAgfSkoKTtcbiAgICAgIH0sXG4gICAgfTtcblxuICBpZiAodHlwZW9mIG1vZHVsZSA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgbW9kdWxlLmV4cG9ydHMgPT09IFwib2JqZWN0XCIpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHRvcGJhcjtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdG9wYmFyO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHRoaXMudG9wYmFyID0gdG9wYmFyO1xuICB9XG59LmNhbGwodGhpcywgd2luZG93LCBkb2N1bWVudCkpO1xuIiwgIlwidXNlIHN0cmljdFwiO1xuXG4oZnVuY3Rpb24oKSB7XG4gIHZhciBQb2x5ZmlsbEV2ZW50ID0gZXZlbnRDb25zdHJ1Y3RvcigpO1xuXG4gIGZ1bmN0aW9uIGV2ZW50Q29uc3RydWN0b3IoKSB7XG4gICAgaWYgKHR5cGVvZiB3aW5kb3cuQ3VzdG9tRXZlbnQgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIHdpbmRvdy5DdXN0b21FdmVudDtcbiAgICAvLyBJRTw9OSBTdXBwb3J0XG4gICAgZnVuY3Rpb24gQ3VzdG9tRXZlbnQoZXZlbnQsIHBhcmFtcykge1xuICAgICAgcGFyYW1zID0gcGFyYW1zIHx8IHtidWJibGVzOiBmYWxzZSwgY2FuY2VsYWJsZTogZmFsc2UsIGRldGFpbDogdW5kZWZpbmVkfTtcbiAgICAgIHZhciBldnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnQ3VzdG9tRXZlbnQnKTtcbiAgICAgIGV2dC5pbml0Q3VzdG9tRXZlbnQoZXZlbnQsIHBhcmFtcy5idWJibGVzLCBwYXJhbXMuY2FuY2VsYWJsZSwgcGFyYW1zLmRldGFpbCk7XG4gICAgICByZXR1cm4gZXZ0O1xuICAgIH1cbiAgICBDdXN0b21FdmVudC5wcm90b3R5cGUgPSB3aW5kb3cuRXZlbnQucHJvdG90eXBlO1xuICAgIHJldHVybiBDdXN0b21FdmVudDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGJ1aWxkSGlkZGVuSW5wdXQobmFtZSwgdmFsdWUpIHtcbiAgICB2YXIgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XG4gICAgaW5wdXQudHlwZSA9IFwiaGlkZGVuXCI7XG4gICAgaW5wdXQubmFtZSA9IG5hbWU7XG4gICAgaW5wdXQudmFsdWUgPSB2YWx1ZTtcbiAgICByZXR1cm4gaW5wdXQ7XG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVDbGljayhlbGVtZW50LCB0YXJnZXRNb2RpZmllcktleSkge1xuICAgIHZhciB0byA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiZGF0YS10b1wiKSxcbiAgICAgICAgbWV0aG9kID0gYnVpbGRIaWRkZW5JbnB1dChcIl9tZXRob2RcIiwgZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLW1ldGhvZFwiKSksXG4gICAgICAgIGNzcmYgPSBidWlsZEhpZGRlbklucHV0KFwiX2NzcmZfdG9rZW5cIiwgZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWNzcmZcIikpLFxuICAgICAgICBmb3JtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImZvcm1cIiksXG4gICAgICAgIHN1Ym1pdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKSxcbiAgICAgICAgdGFyZ2V0ID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJ0YXJnZXRcIik7XG5cbiAgICBmb3JtLm1ldGhvZCA9IChlbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGEtbWV0aG9kXCIpID09PSBcImdldFwiKSA/IFwiZ2V0XCIgOiBcInBvc3RcIjtcbiAgICBmb3JtLmFjdGlvbiA9IHRvO1xuICAgIGZvcm0uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuXG4gICAgaWYgKHRhcmdldCkgZm9ybS50YXJnZXQgPSB0YXJnZXQ7XG4gICAgZWxzZSBpZiAodGFyZ2V0TW9kaWZpZXJLZXkpIGZvcm0udGFyZ2V0ID0gXCJfYmxhbmtcIjtcblxuICAgIGZvcm0uYXBwZW5kQ2hpbGQoY3NyZik7XG4gICAgZm9ybS5hcHBlbmRDaGlsZChtZXRob2QpO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZm9ybSk7XG5cbiAgICAvLyBJbnNlcnQgYSBidXR0b24gYW5kIGNsaWNrIGl0IGluc3RlYWQgb2YgdXNpbmcgYGZvcm0uc3VibWl0YFxuICAgIC8vIGJlY2F1c2UgdGhlIGBzdWJtaXRgIGZ1bmN0aW9uIGRvZXMgbm90IGVtaXQgYSBgc3VibWl0YCBldmVudC5cbiAgICBzdWJtaXQudHlwZSA9IFwic3VibWl0XCI7XG4gICAgZm9ybS5hcHBlbmRDaGlsZChzdWJtaXQpO1xuICAgIHN1Ym1pdC5jbGljaygpO1xuICB9XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihlKSB7XG4gICAgdmFyIGVsZW1lbnQgPSBlLnRhcmdldDtcbiAgICBpZiAoZS5kZWZhdWx0UHJldmVudGVkKSByZXR1cm47XG5cbiAgICB3aGlsZSAoZWxlbWVudCAmJiBlbGVtZW50LmdldEF0dHJpYnV0ZSkge1xuICAgICAgdmFyIHBob2VuaXhMaW5rRXZlbnQgPSBuZXcgUG9seWZpbGxFdmVudCgncGhvZW5peC5saW5rLmNsaWNrJywge1xuICAgICAgICBcImJ1YmJsZXNcIjogdHJ1ZSwgXCJjYW5jZWxhYmxlXCI6IHRydWVcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoIWVsZW1lbnQuZGlzcGF0Y2hFdmVudChwaG9lbml4TGlua0V2ZW50KSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiZGF0YS1tZXRob2RcIikpIHtcbiAgICAgICAgaGFuZGxlQ2xpY2soZWxlbWVudCwgZS5tZXRhS2V5IHx8IGUuc2hpZnRLZXkpO1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudE5vZGU7XG4gICAgICB9XG4gICAgfVxuICB9LCBmYWxzZSk7XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Bob2VuaXgubGluay5jbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIG1lc3NhZ2UgPSBlLnRhcmdldC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWNvbmZpcm1cIik7XG4gICAgaWYobWVzc2FnZSAmJiAhd2luZG93LmNvbmZpcm0obWVzc2FnZSkpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG4gIH0sIGZhbHNlKTtcbn0pKCk7XG4iLCAiLy8gd3JhcHMgdmFsdWUgaW4gY2xvc3VyZSBvciByZXR1cm5zIGNsb3N1cmVcbmV4cG9ydCBsZXQgY2xvc3VyZSA9ICh2YWx1ZSkgPT4ge1xuICBpZih0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIil7XG4gICAgcmV0dXJuIHZhbHVlXG4gIH0gZWxzZSB7XG4gICAgbGV0IGNsb3N1cmUgPSBmdW5jdGlvbiAoKXsgcmV0dXJuIHZhbHVlIH1cbiAgICByZXR1cm4gY2xvc3VyZVxuICB9XG59XG4iLCAiZXhwb3J0IGNvbnN0IGdsb2JhbFNlbGYgPSB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiBudWxsXG5leHBvcnQgY29uc3QgcGh4V2luZG93ID0gdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IG51bGxcbmV4cG9ydCBjb25zdCBnbG9iYWwgPSBnbG9iYWxTZWxmIHx8IHBoeFdpbmRvdyB8fCBnbG9iYWxcbmV4cG9ydCBjb25zdCBERUZBVUxUX1ZTTiA9IFwiMi4wLjBcIlxuZXhwb3J0IGNvbnN0IFNPQ0tFVF9TVEFURVMgPSB7Y29ubmVjdGluZzogMCwgb3BlbjogMSwgY2xvc2luZzogMiwgY2xvc2VkOiAzfVxuZXhwb3J0IGNvbnN0IERFRkFVTFRfVElNRU9VVCA9IDEwMDAwXG5leHBvcnQgY29uc3QgV1NfQ0xPU0VfTk9STUFMID0gMTAwMFxuZXhwb3J0IGNvbnN0IENIQU5ORUxfU1RBVEVTID0ge1xuICBjbG9zZWQ6IFwiY2xvc2VkXCIsXG4gIGVycm9yZWQ6IFwiZXJyb3JlZFwiLFxuICBqb2luZWQ6IFwiam9pbmVkXCIsXG4gIGpvaW5pbmc6IFwiam9pbmluZ1wiLFxuICBsZWF2aW5nOiBcImxlYXZpbmdcIixcbn1cbmV4cG9ydCBjb25zdCBDSEFOTkVMX0VWRU5UUyA9IHtcbiAgY2xvc2U6IFwicGh4X2Nsb3NlXCIsXG4gIGVycm9yOiBcInBoeF9lcnJvclwiLFxuICBqb2luOiBcInBoeF9qb2luXCIsXG4gIHJlcGx5OiBcInBoeF9yZXBseVwiLFxuICBsZWF2ZTogXCJwaHhfbGVhdmVcIlxufVxuXG5leHBvcnQgY29uc3QgVFJBTlNQT1JUUyA9IHtcbiAgbG9uZ3BvbGw6IFwibG9uZ3BvbGxcIixcbiAgd2Vic29ja2V0OiBcIndlYnNvY2tldFwiXG59XG5leHBvcnQgY29uc3QgWEhSX1NUQVRFUyA9IHtcbiAgY29tcGxldGU6IDRcbn1cbiIsICIvKipcbiAqIEluaXRpYWxpemVzIHRoZSBQdXNoXG4gKiBAcGFyYW0ge0NoYW5uZWx9IGNoYW5uZWwgLSBUaGUgQ2hhbm5lbFxuICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50IC0gVGhlIGV2ZW50LCBmb3IgZXhhbXBsZSBgXCJwaHhfam9pblwiYFxuICogQHBhcmFtIHtPYmplY3R9IHBheWxvYWQgLSBUaGUgcGF5bG9hZCwgZm9yIGV4YW1wbGUgYHt1c2VyX2lkOiAxMjN9YFxuICogQHBhcmFtIHtudW1iZXJ9IHRpbWVvdXQgLSBUaGUgcHVzaCB0aW1lb3V0IGluIG1pbGxpc2Vjb25kc1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQdXNoIHtcbiAgY29uc3RydWN0b3IoY2hhbm5lbCwgZXZlbnQsIHBheWxvYWQsIHRpbWVvdXQpe1xuICAgIHRoaXMuY2hhbm5lbCA9IGNoYW5uZWxcbiAgICB0aGlzLmV2ZW50ID0gZXZlbnRcbiAgICB0aGlzLnBheWxvYWQgPSBwYXlsb2FkIHx8IGZ1bmN0aW9uICgpeyByZXR1cm4ge30gfVxuICAgIHRoaXMucmVjZWl2ZWRSZXNwID0gbnVsbFxuICAgIHRoaXMudGltZW91dCA9IHRpbWVvdXRcbiAgICB0aGlzLnRpbWVvdXRUaW1lciA9IG51bGxcbiAgICB0aGlzLnJlY0hvb2tzID0gW11cbiAgICB0aGlzLnNlbnQgPSBmYWxzZVxuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB0aW1lb3V0XG4gICAqL1xuICByZXNlbmQodGltZW91dCl7XG4gICAgdGhpcy50aW1lb3V0ID0gdGltZW91dFxuICAgIHRoaXMucmVzZXQoKVxuICAgIHRoaXMuc2VuZCgpXG4gIH1cblxuICAvKipcbiAgICpcbiAgICovXG4gIHNlbmQoKXtcbiAgICBpZih0aGlzLmhhc1JlY2VpdmVkKFwidGltZW91dFwiKSl7IHJldHVybiB9XG4gICAgdGhpcy5zdGFydFRpbWVvdXQoKVxuICAgIHRoaXMuc2VudCA9IHRydWVcbiAgICB0aGlzLmNoYW5uZWwuc29ja2V0LnB1c2goe1xuICAgICAgdG9waWM6IHRoaXMuY2hhbm5lbC50b3BpYyxcbiAgICAgIGV2ZW50OiB0aGlzLmV2ZW50LFxuICAgICAgcGF5bG9hZDogdGhpcy5wYXlsb2FkKCksXG4gICAgICByZWY6IHRoaXMucmVmLFxuICAgICAgam9pbl9yZWY6IHRoaXMuY2hhbm5lbC5qb2luUmVmKClcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSB7Kn0gc3RhdHVzXG4gICAqIEBwYXJhbSB7Kn0gY2FsbGJhY2tcbiAgICovXG4gIHJlY2VpdmUoc3RhdHVzLCBjYWxsYmFjayl7XG4gICAgaWYodGhpcy5oYXNSZWNlaXZlZChzdGF0dXMpKXtcbiAgICAgIGNhbGxiYWNrKHRoaXMucmVjZWl2ZWRSZXNwLnJlc3BvbnNlKVxuICAgIH1cblxuICAgIHRoaXMucmVjSG9va3MucHVzaCh7c3RhdHVzLCBjYWxsYmFja30pXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVzZXQoKXtcbiAgICB0aGlzLmNhbmNlbFJlZkV2ZW50KClcbiAgICB0aGlzLnJlZiA9IG51bGxcbiAgICB0aGlzLnJlZkV2ZW50ID0gbnVsbFxuICAgIHRoaXMucmVjZWl2ZWRSZXNwID0gbnVsbFxuICAgIHRoaXMuc2VudCA9IGZhbHNlXG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIG1hdGNoUmVjZWl2ZSh7c3RhdHVzLCByZXNwb25zZSwgX3JlZn0pe1xuICAgIHRoaXMucmVjSG9va3MuZmlsdGVyKGggPT4gaC5zdGF0dXMgPT09IHN0YXR1cylcbiAgICAgIC5mb3JFYWNoKGggPT4gaC5jYWxsYmFjayhyZXNwb25zZSkpXG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGNhbmNlbFJlZkV2ZW50KCl7XG4gICAgaWYoIXRoaXMucmVmRXZlbnQpeyByZXR1cm4gfVxuICAgIHRoaXMuY2hhbm5lbC5vZmYodGhpcy5yZWZFdmVudClcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgY2FuY2VsVGltZW91dCgpe1xuICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXRUaW1lcilcbiAgICB0aGlzLnRpbWVvdXRUaW1lciA9IG51bGxcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc3RhcnRUaW1lb3V0KCl7XG4gICAgaWYodGhpcy50aW1lb3V0VGltZXIpeyB0aGlzLmNhbmNlbFRpbWVvdXQoKSB9XG4gICAgdGhpcy5yZWYgPSB0aGlzLmNoYW5uZWwuc29ja2V0Lm1ha2VSZWYoKVxuICAgIHRoaXMucmVmRXZlbnQgPSB0aGlzLmNoYW5uZWwucmVwbHlFdmVudE5hbWUodGhpcy5yZWYpXG5cbiAgICB0aGlzLmNoYW5uZWwub24odGhpcy5yZWZFdmVudCwgcGF5bG9hZCA9PiB7XG4gICAgICB0aGlzLmNhbmNlbFJlZkV2ZW50KClcbiAgICAgIHRoaXMuY2FuY2VsVGltZW91dCgpXG4gICAgICB0aGlzLnJlY2VpdmVkUmVzcCA9IHBheWxvYWRcbiAgICAgIHRoaXMubWF0Y2hSZWNlaXZlKHBheWxvYWQpXG4gICAgfSlcblxuICAgIHRoaXMudGltZW91dFRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLnRyaWdnZXIoXCJ0aW1lb3V0XCIsIHt9KVxuICAgIH0sIHRoaXMudGltZW91dClcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgaGFzUmVjZWl2ZWQoc3RhdHVzKXtcbiAgICByZXR1cm4gdGhpcy5yZWNlaXZlZFJlc3AgJiYgdGhpcy5yZWNlaXZlZFJlc3Auc3RhdHVzID09PSBzdGF0dXNcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgdHJpZ2dlcihzdGF0dXMsIHJlc3BvbnNlKXtcbiAgICB0aGlzLmNoYW5uZWwudHJpZ2dlcih0aGlzLnJlZkV2ZW50LCB7c3RhdHVzLCByZXNwb25zZX0pXG4gIH1cbn1cbiIsICIvKipcbiAqXG4gKiBDcmVhdGVzIGEgdGltZXIgdGhhdCBhY2NlcHRzIGEgYHRpbWVyQ2FsY2AgZnVuY3Rpb24gdG8gcGVyZm9ybVxuICogY2FsY3VsYXRlZCB0aW1lb3V0IHJldHJpZXMsIHN1Y2ggYXMgZXhwb25lbnRpYWwgYmFja29mZi5cbiAqXG4gKiBAZXhhbXBsZVxuICogbGV0IHJlY29ubmVjdFRpbWVyID0gbmV3IFRpbWVyKCgpID0+IHRoaXMuY29ubmVjdCgpLCBmdW5jdGlvbih0cmllcyl7XG4gKiAgIHJldHVybiBbMTAwMCwgNTAwMCwgMTAwMDBdW3RyaWVzIC0gMV0gfHwgMTAwMDBcbiAqIH0pXG4gKiByZWNvbm5lY3RUaW1lci5zY2hlZHVsZVRpbWVvdXQoKSAvLyBmaXJlcyBhZnRlciAxMDAwXG4gKiByZWNvbm5lY3RUaW1lci5zY2hlZHVsZVRpbWVvdXQoKSAvLyBmaXJlcyBhZnRlciA1MDAwXG4gKiByZWNvbm5lY3RUaW1lci5yZXNldCgpXG4gKiByZWNvbm5lY3RUaW1lci5zY2hlZHVsZVRpbWVvdXQoKSAvLyBmaXJlcyBhZnRlciAxMDAwXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHRpbWVyQ2FsY1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaW1lciB7XG4gIGNvbnN0cnVjdG9yKGNhbGxiYWNrLCB0aW1lckNhbGMpe1xuICAgIHRoaXMuY2FsbGJhY2sgPSBjYWxsYmFja1xuICAgIHRoaXMudGltZXJDYWxjID0gdGltZXJDYWxjXG4gICAgdGhpcy50aW1lciA9IG51bGxcbiAgICB0aGlzLnRyaWVzID0gMFxuICB9XG5cbiAgcmVzZXQoKXtcbiAgICB0aGlzLnRyaWVzID0gMFxuICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVyKVxuICB9XG5cbiAgLyoqXG4gICAqIENhbmNlbHMgYW55IHByZXZpb3VzIHNjaGVkdWxlVGltZW91dCBhbmQgc2NoZWR1bGVzIGNhbGxiYWNrXG4gICAqL1xuICBzY2hlZHVsZVRpbWVvdXQoKXtcbiAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lcilcblxuICAgIHRoaXMudGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMudHJpZXMgPSB0aGlzLnRyaWVzICsgMVxuICAgICAgdGhpcy5jYWxsYmFjaygpXG4gICAgfSwgdGhpcy50aW1lckNhbGModGhpcy50cmllcyArIDEpKVxuICB9XG59XG4iLCAiaW1wb3J0IHtjbG9zdXJlfSBmcm9tIFwiLi91dGlsc1wiXG5pbXBvcnQge1xuICBDSEFOTkVMX0VWRU5UUyxcbiAgQ0hBTk5FTF9TVEFURVMsXG59IGZyb20gXCIuL2NvbnN0YW50c1wiXG5cbmltcG9ydCBQdXNoIGZyb20gXCIuL3B1c2hcIlxuaW1wb3J0IFRpbWVyIGZyb20gXCIuL3RpbWVyXCJcblxuLyoqXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRvcGljXG4gKiBAcGFyYW0geyhPYmplY3R8ZnVuY3Rpb24pfSBwYXJhbXNcbiAqIEBwYXJhbSB7U29ja2V0fSBzb2NrZXRcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2hhbm5lbCB7XG4gIGNvbnN0cnVjdG9yKHRvcGljLCBwYXJhbXMsIHNvY2tldCl7XG4gICAgdGhpcy5zdGF0ZSA9IENIQU5ORUxfU1RBVEVTLmNsb3NlZFxuICAgIHRoaXMudG9waWMgPSB0b3BpY1xuICAgIHRoaXMucGFyYW1zID0gY2xvc3VyZShwYXJhbXMgfHwge30pXG4gICAgdGhpcy5zb2NrZXQgPSBzb2NrZXRcbiAgICB0aGlzLmJpbmRpbmdzID0gW11cbiAgICB0aGlzLmJpbmRpbmdSZWYgPSAwXG4gICAgdGhpcy50aW1lb3V0ID0gdGhpcy5zb2NrZXQudGltZW91dFxuICAgIHRoaXMuam9pbmVkT25jZSA9IGZhbHNlXG4gICAgdGhpcy5qb2luUHVzaCA9IG5ldyBQdXNoKHRoaXMsIENIQU5ORUxfRVZFTlRTLmpvaW4sIHRoaXMucGFyYW1zLCB0aGlzLnRpbWVvdXQpXG4gICAgdGhpcy5wdXNoQnVmZmVyID0gW11cbiAgICB0aGlzLnN0YXRlQ2hhbmdlUmVmcyA9IFtdXG5cbiAgICB0aGlzLnJlam9pblRpbWVyID0gbmV3IFRpbWVyKCgpID0+IHtcbiAgICAgIGlmKHRoaXMuc29ja2V0LmlzQ29ubmVjdGVkKCkpeyB0aGlzLnJlam9pbigpIH1cbiAgICB9LCB0aGlzLnNvY2tldC5yZWpvaW5BZnRlck1zKVxuICAgIHRoaXMuc3RhdGVDaGFuZ2VSZWZzLnB1c2godGhpcy5zb2NrZXQub25FcnJvcigoKSA9PiB0aGlzLnJlam9pblRpbWVyLnJlc2V0KCkpKVxuICAgIHRoaXMuc3RhdGVDaGFuZ2VSZWZzLnB1c2godGhpcy5zb2NrZXQub25PcGVuKCgpID0+IHtcbiAgICAgIHRoaXMucmVqb2luVGltZXIucmVzZXQoKVxuICAgICAgaWYodGhpcy5pc0Vycm9yZWQoKSl7IHRoaXMucmVqb2luKCkgfVxuICAgIH0pXG4gICAgKVxuICAgIHRoaXMuam9pblB1c2gucmVjZWl2ZShcIm9rXCIsICgpID0+IHtcbiAgICAgIHRoaXMuc3RhdGUgPSBDSEFOTkVMX1NUQVRFUy5qb2luZWRcbiAgICAgIHRoaXMucmVqb2luVGltZXIucmVzZXQoKVxuICAgICAgdGhpcy5wdXNoQnVmZmVyLmZvckVhY2gocHVzaEV2ZW50ID0+IHB1c2hFdmVudC5zZW5kKCkpXG4gICAgICB0aGlzLnB1c2hCdWZmZXIgPSBbXVxuICAgIH0pXG4gICAgdGhpcy5qb2luUHVzaC5yZWNlaXZlKFwiZXJyb3JcIiwgKCkgPT4ge1xuICAgICAgdGhpcy5zdGF0ZSA9IENIQU5ORUxfU1RBVEVTLmVycm9yZWRcbiAgICAgIGlmKHRoaXMuc29ja2V0LmlzQ29ubmVjdGVkKCkpeyB0aGlzLnJlam9pblRpbWVyLnNjaGVkdWxlVGltZW91dCgpIH1cbiAgICB9KVxuICAgIHRoaXMub25DbG9zZSgoKSA9PiB7XG4gICAgICB0aGlzLnJlam9pblRpbWVyLnJlc2V0KClcbiAgICAgIGlmKHRoaXMuc29ja2V0Lmhhc0xvZ2dlcigpKSB0aGlzLnNvY2tldC5sb2coXCJjaGFubmVsXCIsIGBjbG9zZSAke3RoaXMudG9waWN9ICR7dGhpcy5qb2luUmVmKCl9YClcbiAgICAgIHRoaXMuc3RhdGUgPSBDSEFOTkVMX1NUQVRFUy5jbG9zZWRcbiAgICAgIHRoaXMuc29ja2V0LnJlbW92ZSh0aGlzKVxuICAgIH0pXG4gICAgdGhpcy5vbkVycm9yKHJlYXNvbiA9PiB7XG4gICAgICBpZih0aGlzLnNvY2tldC5oYXNMb2dnZXIoKSkgdGhpcy5zb2NrZXQubG9nKFwiY2hhbm5lbFwiLCBgZXJyb3IgJHt0aGlzLnRvcGljfWAsIHJlYXNvbilcbiAgICAgIGlmKHRoaXMuaXNKb2luaW5nKCkpeyB0aGlzLmpvaW5QdXNoLnJlc2V0KCkgfVxuICAgICAgdGhpcy5zdGF0ZSA9IENIQU5ORUxfU1RBVEVTLmVycm9yZWRcbiAgICAgIGlmKHRoaXMuc29ja2V0LmlzQ29ubmVjdGVkKCkpeyB0aGlzLnJlam9pblRpbWVyLnNjaGVkdWxlVGltZW91dCgpIH1cbiAgICB9KVxuICAgIHRoaXMuam9pblB1c2gucmVjZWl2ZShcInRpbWVvdXRcIiwgKCkgPT4ge1xuICAgICAgaWYodGhpcy5zb2NrZXQuaGFzTG9nZ2VyKCkpIHRoaXMuc29ja2V0LmxvZyhcImNoYW5uZWxcIiwgYHRpbWVvdXQgJHt0aGlzLnRvcGljfSAoJHt0aGlzLmpvaW5SZWYoKX0pYCwgdGhpcy5qb2luUHVzaC50aW1lb3V0KVxuICAgICAgbGV0IGxlYXZlUHVzaCA9IG5ldyBQdXNoKHRoaXMsIENIQU5ORUxfRVZFTlRTLmxlYXZlLCBjbG9zdXJlKHt9KSwgdGhpcy50aW1lb3V0KVxuICAgICAgbGVhdmVQdXNoLnNlbmQoKVxuICAgICAgdGhpcy5zdGF0ZSA9IENIQU5ORUxfU1RBVEVTLmVycm9yZWRcbiAgICAgIHRoaXMuam9pblB1c2gucmVzZXQoKVxuICAgICAgaWYodGhpcy5zb2NrZXQuaXNDb25uZWN0ZWQoKSl7IHRoaXMucmVqb2luVGltZXIuc2NoZWR1bGVUaW1lb3V0KCkgfVxuICAgIH0pXG4gICAgdGhpcy5vbihDSEFOTkVMX0VWRU5UUy5yZXBseSwgKHBheWxvYWQsIHJlZikgPT4ge1xuICAgICAgdGhpcy50cmlnZ2VyKHRoaXMucmVwbHlFdmVudE5hbWUocmVmKSwgcGF5bG9hZClcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIEpvaW4gdGhlIGNoYW5uZWxcbiAgICogQHBhcmFtIHtpbnRlZ2VyfSB0aW1lb3V0XG4gICAqIEByZXR1cm5zIHtQdXNofVxuICAgKi9cbiAgam9pbih0aW1lb3V0ID0gdGhpcy50aW1lb3V0KXtcbiAgICBpZih0aGlzLmpvaW5lZE9uY2Upe1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwidHJpZWQgdG8gam9pbiBtdWx0aXBsZSB0aW1lcy4gJ2pvaW4nIGNhbiBvbmx5IGJlIGNhbGxlZCBhIHNpbmdsZSB0aW1lIHBlciBjaGFubmVsIGluc3RhbmNlXCIpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudGltZW91dCA9IHRpbWVvdXRcbiAgICAgIHRoaXMuam9pbmVkT25jZSA9IHRydWVcbiAgICAgIHRoaXMucmVqb2luKClcbiAgICAgIHJldHVybiB0aGlzLmpvaW5QdXNoXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEhvb2sgaW50byBjaGFubmVsIGNsb3NlXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAqL1xuICBvbkNsb3NlKGNhbGxiYWNrKXtcbiAgICB0aGlzLm9uKENIQU5ORUxfRVZFTlRTLmNsb3NlLCBjYWxsYmFjaylcbiAgfVxuXG4gIC8qKlxuICAgKiBIb29rIGludG8gY2hhbm5lbCBlcnJvcnNcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICovXG4gIG9uRXJyb3IoY2FsbGJhY2spe1xuICAgIHJldHVybiB0aGlzLm9uKENIQU5ORUxfRVZFTlRTLmVycm9yLCByZWFzb24gPT4gY2FsbGJhY2socmVhc29uKSlcbiAgfVxuXG4gIC8qKlxuICAgKiBTdWJzY3JpYmVzIG9uIGNoYW5uZWwgZXZlbnRzXG4gICAqXG4gICAqIFN1YnNjcmlwdGlvbiByZXR1cm5zIGEgcmVmIGNvdW50ZXIsIHdoaWNoIGNhbiBiZSB1c2VkIGxhdGVyIHRvXG4gICAqIHVuc3Vic2NyaWJlIHRoZSBleGFjdCBldmVudCBsaXN0ZW5lclxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBjb25zdCByZWYxID0gY2hhbm5lbC5vbihcImV2ZW50XCIsIGRvX3N0dWZmKVxuICAgKiBjb25zdCByZWYyID0gY2hhbm5lbC5vbihcImV2ZW50XCIsIGRvX290aGVyX3N0dWZmKVxuICAgKiBjaGFubmVsLm9mZihcImV2ZW50XCIsIHJlZjEpXG4gICAqIC8vIFNpbmNlIHVuc3Vic2NyaXB0aW9uLCBkb19zdHVmZiB3b24ndCBmaXJlLFxuICAgKiAvLyB3aGlsZSBkb19vdGhlcl9zdHVmZiB3aWxsIGtlZXAgZmlyaW5nIG9uIHRoZSBcImV2ZW50XCJcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50XG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAqIEByZXR1cm5zIHtpbnRlZ2VyfSByZWZcbiAgICovXG4gIG9uKGV2ZW50LCBjYWxsYmFjayl7XG4gICAgbGV0IHJlZiA9IHRoaXMuYmluZGluZ1JlZisrXG4gICAgdGhpcy5iaW5kaW5ncy5wdXNoKHtldmVudCwgcmVmLCBjYWxsYmFja30pXG4gICAgcmV0dXJuIHJlZlxuICB9XG5cbiAgLyoqXG4gICAqIFVuc3Vic2NyaWJlcyBvZmYgb2YgY2hhbm5lbCBldmVudHNcbiAgICpcbiAgICogVXNlIHRoZSByZWYgcmV0dXJuZWQgZnJvbSBhIGNoYW5uZWwub24oKSB0byB1bnN1YnNjcmliZSBvbmVcbiAgICogaGFuZGxlciwgb3IgcGFzcyBub3RoaW5nIGZvciB0aGUgcmVmIHRvIHVuc3Vic2NyaWJlIGFsbFxuICAgKiBoYW5kbGVycyBmb3IgdGhlIGdpdmVuIGV2ZW50LlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiAvLyBVbnN1YnNjcmliZSB0aGUgZG9fc3R1ZmYgaGFuZGxlclxuICAgKiBjb25zdCByZWYxID0gY2hhbm5lbC5vbihcImV2ZW50XCIsIGRvX3N0dWZmKVxuICAgKiBjaGFubmVsLm9mZihcImV2ZW50XCIsIHJlZjEpXG4gICAqXG4gICAqIC8vIFVuc3Vic2NyaWJlIGFsbCBoYW5kbGVycyBmcm9tIGV2ZW50XG4gICAqIGNoYW5uZWwub2ZmKFwiZXZlbnRcIilcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50XG4gICAqIEBwYXJhbSB7aW50ZWdlcn0gcmVmXG4gICAqL1xuICBvZmYoZXZlbnQsIHJlZil7XG4gICAgdGhpcy5iaW5kaW5ncyA9IHRoaXMuYmluZGluZ3MuZmlsdGVyKChiaW5kKSA9PiB7XG4gICAgICByZXR1cm4gIShiaW5kLmV2ZW50ID09PSBldmVudCAmJiAodHlwZW9mIHJlZiA9PT0gXCJ1bmRlZmluZWRcIiB8fCByZWYgPT09IGJpbmQucmVmKSlcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBjYW5QdXNoKCl7IHJldHVybiB0aGlzLnNvY2tldC5pc0Nvbm5lY3RlZCgpICYmIHRoaXMuaXNKb2luZWQoKSB9XG5cbiAgLyoqXG4gICAqIFNlbmRzIGEgbWVzc2FnZSBgZXZlbnRgIHRvIHBob2VuaXggd2l0aCB0aGUgcGF5bG9hZCBgcGF5bG9hZGAuXG4gICAqIFBob2VuaXggcmVjZWl2ZXMgdGhpcyBpbiB0aGUgYGhhbmRsZV9pbihldmVudCwgcGF5bG9hZCwgc29ja2V0KWBcbiAgICogZnVuY3Rpb24uIGlmIHBob2VuaXggcmVwbGllcyBvciBpdCB0aW1lcyBvdXQgKGRlZmF1bHQgMTAwMDBtcyksXG4gICAqIHRoZW4gb3B0aW9uYWxseSB0aGUgcmVwbHkgY2FuIGJlIHJlY2VpdmVkLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBjaGFubmVsLnB1c2goXCJldmVudFwiKVxuICAgKiAgIC5yZWNlaXZlKFwib2tcIiwgcGF5bG9hZCA9PiBjb25zb2xlLmxvZyhcInBob2VuaXggcmVwbGllZDpcIiwgcGF5bG9hZCkpXG4gICAqICAgLnJlY2VpdmUoXCJlcnJvclwiLCBlcnIgPT4gY29uc29sZS5sb2coXCJwaG9lbml4IGVycm9yZWRcIiwgZXJyKSlcbiAgICogICAucmVjZWl2ZShcInRpbWVvdXRcIiwgKCkgPT4gY29uc29sZS5sb2coXCJ0aW1lZCBvdXQgcHVzaGluZ1wiKSlcbiAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwYXlsb2FkXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBbdGltZW91dF1cbiAgICogQHJldHVybnMge1B1c2h9XG4gICAqL1xuICBwdXNoKGV2ZW50LCBwYXlsb2FkLCB0aW1lb3V0ID0gdGhpcy50aW1lb3V0KXtcbiAgICBwYXlsb2FkID0gcGF5bG9hZCB8fCB7fVxuICAgIGlmKCF0aGlzLmpvaW5lZE9uY2Upe1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGB0cmllZCB0byBwdXNoICcke2V2ZW50fScgdG8gJyR7dGhpcy50b3BpY30nIGJlZm9yZSBqb2luaW5nLiBVc2UgY2hhbm5lbC5qb2luKCkgYmVmb3JlIHB1c2hpbmcgZXZlbnRzYClcbiAgICB9XG4gICAgbGV0IHB1c2hFdmVudCA9IG5ldyBQdXNoKHRoaXMsIGV2ZW50LCBmdW5jdGlvbiAoKXsgcmV0dXJuIHBheWxvYWQgfSwgdGltZW91dClcbiAgICBpZih0aGlzLmNhblB1c2goKSl7XG4gICAgICBwdXNoRXZlbnQuc2VuZCgpXG4gICAgfSBlbHNlIHtcbiAgICAgIHB1c2hFdmVudC5zdGFydFRpbWVvdXQoKVxuICAgICAgdGhpcy5wdXNoQnVmZmVyLnB1c2gocHVzaEV2ZW50KVxuICAgIH1cblxuICAgIHJldHVybiBwdXNoRXZlbnRcbiAgfVxuXG4gIC8qKiBMZWF2ZXMgdGhlIGNoYW5uZWxcbiAgICpcbiAgICogVW5zdWJzY3JpYmVzIGZyb20gc2VydmVyIGV2ZW50cywgYW5kXG4gICAqIGluc3RydWN0cyBjaGFubmVsIHRvIHRlcm1pbmF0ZSBvbiBzZXJ2ZXJcbiAgICpcbiAgICogVHJpZ2dlcnMgb25DbG9zZSgpIGhvb2tzXG4gICAqXG4gICAqIFRvIHJlY2VpdmUgbGVhdmUgYWNrbm93bGVkZ2VtZW50cywgdXNlIHRoZSBgcmVjZWl2ZWBcbiAgICogaG9vayB0byBiaW5kIHRvIHRoZSBzZXJ2ZXIgYWNrLCBpZTpcbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogY2hhbm5lbC5sZWF2ZSgpLnJlY2VpdmUoXCJva1wiLCAoKSA9PiBhbGVydChcImxlZnQhXCIpIClcbiAgICpcbiAgICogQHBhcmFtIHtpbnRlZ2VyfSB0aW1lb3V0XG4gICAqIEByZXR1cm5zIHtQdXNofVxuICAgKi9cbiAgbGVhdmUodGltZW91dCA9IHRoaXMudGltZW91dCl7XG4gICAgdGhpcy5yZWpvaW5UaW1lci5yZXNldCgpXG4gICAgdGhpcy5qb2luUHVzaC5jYW5jZWxUaW1lb3V0KClcblxuICAgIHRoaXMuc3RhdGUgPSBDSEFOTkVMX1NUQVRFUy5sZWF2aW5nXG4gICAgbGV0IG9uQ2xvc2UgPSAoKSA9PiB7XG4gICAgICBpZih0aGlzLnNvY2tldC5oYXNMb2dnZXIoKSkgdGhpcy5zb2NrZXQubG9nKFwiY2hhbm5lbFwiLCBgbGVhdmUgJHt0aGlzLnRvcGljfWApXG4gICAgICB0aGlzLnRyaWdnZXIoQ0hBTk5FTF9FVkVOVFMuY2xvc2UsIFwibGVhdmVcIilcbiAgICB9XG4gICAgbGV0IGxlYXZlUHVzaCA9IG5ldyBQdXNoKHRoaXMsIENIQU5ORUxfRVZFTlRTLmxlYXZlLCBjbG9zdXJlKHt9KSwgdGltZW91dClcbiAgICBsZWF2ZVB1c2gucmVjZWl2ZShcIm9rXCIsICgpID0+IG9uQ2xvc2UoKSlcbiAgICAgIC5yZWNlaXZlKFwidGltZW91dFwiLCAoKSA9PiBvbkNsb3NlKCkpXG4gICAgbGVhdmVQdXNoLnNlbmQoKVxuICAgIGlmKCF0aGlzLmNhblB1c2goKSl7IGxlYXZlUHVzaC50cmlnZ2VyKFwib2tcIiwge30pIH1cblxuICAgIHJldHVybiBsZWF2ZVB1c2hcbiAgfVxuXG4gIC8qKlxuICAgKiBPdmVycmlkYWJsZSBtZXNzYWdlIGhvb2tcbiAgICpcbiAgICogUmVjZWl2ZXMgYWxsIGV2ZW50cyBmb3Igc3BlY2lhbGl6ZWQgbWVzc2FnZSBoYW5kbGluZ1xuICAgKiBiZWZvcmUgZGlzcGF0Y2hpbmcgdG8gdGhlIGNoYW5uZWwgY2FsbGJhY2tzLlxuICAgKlxuICAgKiBNdXN0IHJldHVybiB0aGUgcGF5bG9hZCwgbW9kaWZpZWQgb3IgdW5tb2RpZmllZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRcbiAgICogQHBhcmFtIHtPYmplY3R9IHBheWxvYWRcbiAgICogQHBhcmFtIHtpbnRlZ2VyfSByZWZcbiAgICogQHJldHVybnMge09iamVjdH1cbiAgICovXG4gIG9uTWVzc2FnZShfZXZlbnQsIHBheWxvYWQsIF9yZWYpeyByZXR1cm4gcGF5bG9hZCB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBpc01lbWJlcih0b3BpYywgZXZlbnQsIHBheWxvYWQsIGpvaW5SZWYpe1xuICAgIGlmKHRoaXMudG9waWMgIT09IHRvcGljKXsgcmV0dXJuIGZhbHNlIH1cblxuICAgIGlmKGpvaW5SZWYgJiYgam9pblJlZiAhPT0gdGhpcy5qb2luUmVmKCkpe1xuICAgICAgaWYodGhpcy5zb2NrZXQuaGFzTG9nZ2VyKCkpIHRoaXMuc29ja2V0LmxvZyhcImNoYW5uZWxcIiwgXCJkcm9wcGluZyBvdXRkYXRlZCBtZXNzYWdlXCIsIHt0b3BpYywgZXZlbnQsIHBheWxvYWQsIGpvaW5SZWZ9KVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBqb2luUmVmKCl7IHJldHVybiB0aGlzLmpvaW5QdXNoLnJlZiB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZWpvaW4odGltZW91dCA9IHRoaXMudGltZW91dCl7XG4gICAgaWYodGhpcy5pc0xlYXZpbmcoKSl7IHJldHVybiB9XG4gICAgdGhpcy5zb2NrZXQubGVhdmVPcGVuVG9waWModGhpcy50b3BpYylcbiAgICB0aGlzLnN0YXRlID0gQ0hBTk5FTF9TVEFURVMuam9pbmluZ1xuICAgIHRoaXMuam9pblB1c2gucmVzZW5kKHRpbWVvdXQpXG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHRyaWdnZXIoZXZlbnQsIHBheWxvYWQsIHJlZiwgam9pblJlZil7XG4gICAgbGV0IGhhbmRsZWRQYXlsb2FkID0gdGhpcy5vbk1lc3NhZ2UoZXZlbnQsIHBheWxvYWQsIHJlZiwgam9pblJlZilcbiAgICBpZihwYXlsb2FkICYmICFoYW5kbGVkUGF5bG9hZCl7IHRocm93IG5ldyBFcnJvcihcImNoYW5uZWwgb25NZXNzYWdlIGNhbGxiYWNrcyBtdXN0IHJldHVybiB0aGUgcGF5bG9hZCwgbW9kaWZpZWQgb3IgdW5tb2RpZmllZFwiKSB9XG5cbiAgICBsZXQgZXZlbnRCaW5kaW5ncyA9IHRoaXMuYmluZGluZ3MuZmlsdGVyKGJpbmQgPT4gYmluZC5ldmVudCA9PT0gZXZlbnQpXG5cbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgZXZlbnRCaW5kaW5ncy5sZW5ndGg7IGkrKyl7XG4gICAgICBsZXQgYmluZCA9IGV2ZW50QmluZGluZ3NbaV1cbiAgICAgIGJpbmQuY2FsbGJhY2soaGFuZGxlZFBheWxvYWQsIHJlZiwgam9pblJlZiB8fCB0aGlzLmpvaW5SZWYoKSlcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHJlcGx5RXZlbnROYW1lKHJlZil7IHJldHVybiBgY2hhbl9yZXBseV8ke3JlZn1gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGlzQ2xvc2VkKCl7IHJldHVybiB0aGlzLnN0YXRlID09PSBDSEFOTkVMX1NUQVRFUy5jbG9zZWQgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgaXNFcnJvcmVkKCl7IHJldHVybiB0aGlzLnN0YXRlID09PSBDSEFOTkVMX1NUQVRFUy5lcnJvcmVkIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGlzSm9pbmVkKCl7IHJldHVybiB0aGlzLnN0YXRlID09PSBDSEFOTkVMX1NUQVRFUy5qb2luZWQgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgaXNKb2luaW5nKCl7IHJldHVybiB0aGlzLnN0YXRlID09PSBDSEFOTkVMX1NUQVRFUy5qb2luaW5nIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGlzTGVhdmluZygpeyByZXR1cm4gdGhpcy5zdGF0ZSA9PT0gQ0hBTk5FTF9TVEFURVMubGVhdmluZyB9XG59XG4iLCAiaW1wb3J0IHtcbiAgZ2xvYmFsLFxuICBYSFJfU1RBVEVTXG59IGZyb20gXCIuL2NvbnN0YW50c1wiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFqYXgge1xuXG4gIHN0YXRpYyByZXF1ZXN0KG1ldGhvZCwgZW5kUG9pbnQsIGFjY2VwdCwgYm9keSwgdGltZW91dCwgb250aW1lb3V0LCBjYWxsYmFjayl7XG4gICAgaWYoZ2xvYmFsLlhEb21haW5SZXF1ZXN0KXtcbiAgICAgIGxldCByZXEgPSBuZXcgZ2xvYmFsLlhEb21haW5SZXF1ZXN0KCkgLy8gSUU4LCBJRTlcbiAgICAgIHJldHVybiB0aGlzLnhkb21haW5SZXF1ZXN0KHJlcSwgbWV0aG9kLCBlbmRQb2ludCwgYm9keSwgdGltZW91dCwgb250aW1lb3V0LCBjYWxsYmFjaylcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IHJlcSA9IG5ldyBnbG9iYWwuWE1MSHR0cFJlcXVlc3QoKSAvLyBJRTcrLCBGaXJlZm94LCBDaHJvbWUsIE9wZXJhLCBTYWZhcmlcbiAgICAgIHJldHVybiB0aGlzLnhoclJlcXVlc3QocmVxLCBtZXRob2QsIGVuZFBvaW50LCBhY2NlcHQsIGJvZHksIHRpbWVvdXQsIG9udGltZW91dCwgY2FsbGJhY2spXG4gICAgfVxuICB9XG5cbiAgc3RhdGljIHhkb21haW5SZXF1ZXN0KHJlcSwgbWV0aG9kLCBlbmRQb2ludCwgYm9keSwgdGltZW91dCwgb250aW1lb3V0LCBjYWxsYmFjayl7XG4gICAgcmVxLnRpbWVvdXQgPSB0aW1lb3V0XG4gICAgcmVxLm9wZW4obWV0aG9kLCBlbmRQb2ludClcbiAgICByZXEub25sb2FkID0gKCkgPT4ge1xuICAgICAgbGV0IHJlc3BvbnNlID0gdGhpcy5wYXJzZUpTT04ocmVxLnJlc3BvbnNlVGV4dClcbiAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKHJlc3BvbnNlKVxuICAgIH1cbiAgICBpZihvbnRpbWVvdXQpeyByZXEub250aW1lb3V0ID0gb250aW1lb3V0IH1cblxuICAgIC8vIFdvcmsgYXJvdW5kIGJ1ZyBpbiBJRTkgdGhhdCByZXF1aXJlcyBhbiBhdHRhY2hlZCBvbnByb2dyZXNzIGhhbmRsZXJcbiAgICByZXEub25wcm9ncmVzcyA9ICgpID0+IHsgfVxuXG4gICAgcmVxLnNlbmQoYm9keSlcbiAgICByZXR1cm4gcmVxXG4gIH1cblxuICBzdGF0aWMgeGhyUmVxdWVzdChyZXEsIG1ldGhvZCwgZW5kUG9pbnQsIGFjY2VwdCwgYm9keSwgdGltZW91dCwgb250aW1lb3V0LCBjYWxsYmFjayl7XG4gICAgcmVxLm9wZW4obWV0aG9kLCBlbmRQb2ludCwgdHJ1ZSlcbiAgICByZXEudGltZW91dCA9IHRpbWVvdXRcbiAgICByZXEuc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLCBhY2NlcHQpXG4gICAgcmVxLm9uZXJyb3IgPSAoKSA9PiBjYWxsYmFjayAmJiBjYWxsYmFjayhudWxsKVxuICAgIHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICBpZihyZXEucmVhZHlTdGF0ZSA9PT0gWEhSX1NUQVRFUy5jb21wbGV0ZSAmJiBjYWxsYmFjayl7XG4gICAgICAgIGxldCByZXNwb25zZSA9IHRoaXMucGFyc2VKU09OKHJlcS5yZXNwb25zZVRleHQpXG4gICAgICAgIGNhbGxiYWNrKHJlc3BvbnNlKVxuICAgICAgfVxuICAgIH1cbiAgICBpZihvbnRpbWVvdXQpeyByZXEub250aW1lb3V0ID0gb250aW1lb3V0IH1cblxuICAgIHJlcS5zZW5kKGJvZHkpXG4gICAgcmV0dXJuIHJlcVxuICB9XG5cbiAgc3RhdGljIHBhcnNlSlNPTihyZXNwKXtcbiAgICBpZighcmVzcCB8fCByZXNwID09PSBcIlwiKXsgcmV0dXJuIG51bGwgfVxuXG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBKU09OLnBhcnNlKHJlc3ApXG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICBjb25zb2xlICYmIGNvbnNvbGUubG9nKFwiZmFpbGVkIHRvIHBhcnNlIEpTT04gcmVzcG9uc2VcIiwgcmVzcClcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuICB9XG5cbiAgc3RhdGljIHNlcmlhbGl6ZShvYmosIHBhcmVudEtleSl7XG4gICAgbGV0IHF1ZXJ5U3RyID0gW11cbiAgICBmb3IodmFyIGtleSBpbiBvYmope1xuICAgICAgaWYoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpeyBjb250aW51ZSB9XG4gICAgICBsZXQgcGFyYW1LZXkgPSBwYXJlbnRLZXkgPyBgJHtwYXJlbnRLZXl9WyR7a2V5fV1gIDoga2V5XG4gICAgICBsZXQgcGFyYW1WYWwgPSBvYmpba2V5XVxuICAgICAgaWYodHlwZW9mIHBhcmFtVmFsID09PSBcIm9iamVjdFwiKXtcbiAgICAgICAgcXVlcnlTdHIucHVzaCh0aGlzLnNlcmlhbGl6ZShwYXJhbVZhbCwgcGFyYW1LZXkpKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcXVlcnlTdHIucHVzaChlbmNvZGVVUklDb21wb25lbnQocGFyYW1LZXkpICsgXCI9XCIgKyBlbmNvZGVVUklDb21wb25lbnQocGFyYW1WYWwpKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcXVlcnlTdHIuam9pbihcIiZcIilcbiAgfVxuXG4gIHN0YXRpYyBhcHBlbmRQYXJhbXModXJsLCBwYXJhbXMpe1xuICAgIGlmKE9iamVjdC5rZXlzKHBhcmFtcykubGVuZ3RoID09PSAwKXsgcmV0dXJuIHVybCB9XG5cbiAgICBsZXQgcHJlZml4ID0gdXJsLm1hdGNoKC9cXD8vKSA/IFwiJlwiIDogXCI/XCJcbiAgICByZXR1cm4gYCR7dXJsfSR7cHJlZml4fSR7dGhpcy5zZXJpYWxpemUocGFyYW1zKX1gXG4gIH1cbn1cbiIsICJpbXBvcnQge1xuICBTT0NLRVRfU1RBVEVTLFxuICBUUkFOU1BPUlRTXG59IGZyb20gXCIuL2NvbnN0YW50c1wiXG5cbmltcG9ydCBBamF4IGZyb20gXCIuL2FqYXhcIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMb25nUG9sbCB7XG5cbiAgY29uc3RydWN0b3IoZW5kUG9pbnQpe1xuICAgIHRoaXMuZW5kUG9pbnQgPSBudWxsXG4gICAgdGhpcy50b2tlbiA9IG51bGxcbiAgICB0aGlzLnNraXBIZWFydGJlYXQgPSB0cnVlXG4gICAgdGhpcy5yZXFzID0gbmV3IFNldCgpXG4gICAgdGhpcy5vbm9wZW4gPSBmdW5jdGlvbiAoKXsgfSAvLyBub29wXG4gICAgdGhpcy5vbmVycm9yID0gZnVuY3Rpb24gKCl7IH0gLy8gbm9vcFxuICAgIHRoaXMub25tZXNzYWdlID0gZnVuY3Rpb24gKCl7IH0gLy8gbm9vcFxuICAgIHRoaXMub25jbG9zZSA9IGZ1bmN0aW9uICgpeyB9IC8vIG5vb3BcbiAgICB0aGlzLnBvbGxFbmRwb2ludCA9IHRoaXMubm9ybWFsaXplRW5kcG9pbnQoZW5kUG9pbnQpXG4gICAgdGhpcy5yZWFkeVN0YXRlID0gU09DS0VUX1NUQVRFUy5jb25uZWN0aW5nXG4gICAgdGhpcy5wb2xsKClcbiAgfVxuXG4gIG5vcm1hbGl6ZUVuZHBvaW50KGVuZFBvaW50KXtcbiAgICByZXR1cm4gKGVuZFBvaW50XG4gICAgICAucmVwbGFjZShcIndzOi8vXCIsIFwiaHR0cDovL1wiKVxuICAgICAgLnJlcGxhY2UoXCJ3c3M6Ly9cIiwgXCJodHRwczovL1wiKVxuICAgICAgLnJlcGxhY2UobmV3IFJlZ0V4cChcIiguKilcXC9cIiArIFRSQU5TUE9SVFMud2Vic29ja2V0KSwgXCIkMS9cIiArIFRSQU5TUE9SVFMubG9uZ3BvbGwpKVxuICB9XG5cbiAgZW5kcG9pbnRVUkwoKXtcbiAgICByZXR1cm4gQWpheC5hcHBlbmRQYXJhbXModGhpcy5wb2xsRW5kcG9pbnQsIHt0b2tlbjogdGhpcy50b2tlbn0pXG4gIH1cblxuICBjbG9zZUFuZFJldHJ5KGNvZGUsIHJlYXNvbiwgd2FzQ2xlYW4pe1xuICAgIHRoaXMuY2xvc2UoY29kZSwgcmVhc29uLCB3YXNDbGVhbilcbiAgICB0aGlzLnJlYWR5U3RhdGUgPSBTT0NLRVRfU1RBVEVTLmNvbm5lY3RpbmdcbiAgfVxuXG4gIG9udGltZW91dCgpe1xuICAgIHRoaXMub25lcnJvcihcInRpbWVvdXRcIilcbiAgICB0aGlzLmNsb3NlQW5kUmV0cnkoMTAwNSwgXCJ0aW1lb3V0XCIsIGZhbHNlKVxuICB9XG5cbiAgaXNBY3RpdmUoKXsgcmV0dXJuIHRoaXMucmVhZHlTdGF0ZSA9PT0gU09DS0VUX1NUQVRFUy5vcGVuIHx8IHRoaXMucmVhZHlTdGF0ZSA9PT0gU09DS0VUX1NUQVRFUy5jb25uZWN0aW5nIH1cblxuICBwb2xsKCl7XG4gICAgdGhpcy5hamF4KFwiR0VUXCIsIG51bGwsICgpID0+IHRoaXMub250aW1lb3V0KCksIHJlc3AgPT4ge1xuICAgICAgaWYocmVzcCl7XG4gICAgICAgIHZhciB7c3RhdHVzLCB0b2tlbiwgbWVzc2FnZXN9ID0gcmVzcFxuICAgICAgICB0aGlzLnRva2VuID0gdG9rZW5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0YXR1cyA9IDBcbiAgICAgIH1cblxuICAgICAgc3dpdGNoKHN0YXR1cyl7XG4gICAgICAgIGNhc2UgMjAwOlxuICAgICAgICAgIG1lc3NhZ2VzLmZvckVhY2gobXNnID0+IHtcbiAgICAgICAgICAgIC8vIFRhc2tzIGFyZSB3aGF0IHRoaW5ncyBsaWtlIGV2ZW50IGhhbmRsZXJzLCBzZXRUaW1lb3V0IGNhbGxiYWNrcyxcbiAgICAgICAgICAgIC8vIHByb21pc2UgcmVzb2x2ZXMgYW5kIG1vcmUgYXJlIHJ1biB3aXRoaW4uXG4gICAgICAgICAgICAvLyBJbiBtb2Rlcm4gYnJvd3NlcnMsIHRoZXJlIGFyZSB0d28gZGlmZmVyZW50IGtpbmRzIG9mIHRhc2tzLFxuICAgICAgICAgICAgLy8gbWljcm90YXNrcyBhbmQgbWFjcm90YXNrcy5cbiAgICAgICAgICAgIC8vIE1pY3JvdGFza3MgYXJlIG1haW5seSB1c2VkIGZvciBQcm9taXNlcywgd2hpbGUgbWFjcm90YXNrcyBhcmVcbiAgICAgICAgICAgIC8vIHVzZWQgZm9yIGV2ZXJ5dGhpbmcgZWxzZS5cbiAgICAgICAgICAgIC8vIE1pY3JvdGFza3MgYWx3YXlzIGhhdmUgcHJpb3JpdHkgb3ZlciBtYWNyb3Rhc2tzLiBJZiB0aGUgSlMgZW5naW5lXG4gICAgICAgICAgICAvLyBpcyBsb29raW5nIGZvciBhIHRhc2sgdG8gcnVuLCBpdCB3aWxsIGFsd2F5cyB0cnkgdG8gZW1wdHkgdGhlXG4gICAgICAgICAgICAvLyBtaWNyb3Rhc2sgcXVldWUgYmVmb3JlIGF0dGVtcHRpbmcgdG8gcnVuIGFueXRoaW5nIGZyb20gdGhlXG4gICAgICAgICAgICAvLyBtYWNyb3Rhc2sgcXVldWUuXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gRm9yIHRoZSBXZWJTb2NrZXQgdHJhbnNwb3J0LCBtZXNzYWdlcyBhbHdheXMgYXJyaXZlIGluIHRoZWlyIG93blxuICAgICAgICAgICAgLy8gZXZlbnQuIFRoaXMgbWVhbnMgdGhhdCBpZiBhbnkgcHJvbWlzZXMgYXJlIHJlc29sdmVkIGZyb20gd2l0aGluLFxuICAgICAgICAgICAgLy8gdGhlaXIgY2FsbGJhY2tzIHdpbGwgYWx3YXlzIGZpbmlzaCBleGVjdXRpb24gYnkgdGhlIHRpbWUgdGhlXG4gICAgICAgICAgICAvLyBuZXh0IG1lc3NhZ2UgZXZlbnQgaGFuZGxlciBpcyBydW4uXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gSW4gb3JkZXIgdG8gZW11bGF0ZSB0aGlzIGJlaGF2aW91ciwgd2UgbmVlZCB0byBtYWtlIHN1cmUgZWFjaFxuICAgICAgICAgICAgLy8gb25tZXNzYWdlIGhhbmRsZXIgaXMgcnVuIHdpdGhpbiBpdCdzIG93biBtYWNyb3Rhc2suXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMub25tZXNzYWdlKHtkYXRhOiBtc2d9KSwgMClcbiAgICAgICAgICB9KVxuICAgICAgICAgIHRoaXMucG9sbCgpXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAyMDQ6XG4gICAgICAgICAgdGhpcy5wb2xsKClcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDQxMDpcbiAgICAgICAgICB0aGlzLnJlYWR5U3RhdGUgPSBTT0NLRVRfU1RBVEVTLm9wZW5cbiAgICAgICAgICB0aGlzLm9ub3Blbih7fSlcbiAgICAgICAgICB0aGlzLnBvbGwoKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgNDAzOlxuICAgICAgICAgIHRoaXMub25lcnJvcig0MDMpXG4gICAgICAgICAgdGhpcy5jbG9zZSgxMDA4LCBcImZvcmJpZGRlblwiLCBmYWxzZSlcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDA6XG4gICAgICAgIGNhc2UgNTAwOlxuICAgICAgICAgIHRoaXMub25lcnJvcig1MDApXG4gICAgICAgICAgdGhpcy5jbG9zZUFuZFJldHJ5KDEwMTEsIFwiaW50ZXJuYWwgc2VydmVyIGVycm9yXCIsIDUwMClcbiAgICAgICAgICBicmVha1xuICAgICAgICBkZWZhdWx0OiB0aHJvdyBuZXcgRXJyb3IoYHVuaGFuZGxlZCBwb2xsIHN0YXR1cyAke3N0YXR1c31gKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBzZW5kKGJvZHkpe1xuICAgIHRoaXMuYWpheChcIlBPU1RcIiwgYm9keSwgKCkgPT4gdGhpcy5vbmVycm9yKFwidGltZW91dFwiKSwgcmVzcCA9PiB7XG4gICAgICBpZighcmVzcCB8fCByZXNwLnN0YXR1cyAhPT0gMjAwKXtcbiAgICAgICAgdGhpcy5vbmVycm9yKHJlc3AgJiYgcmVzcC5zdGF0dXMpXG4gICAgICAgIHRoaXMuY2xvc2VBbmRSZXRyeSgxMDExLCBcImludGVybmFsIHNlcnZlciBlcnJvclwiLCBmYWxzZSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgY2xvc2UoY29kZSwgcmVhc29uLCB3YXNDbGVhbil7XG4gICAgZm9yKGxldCByZXEgb2YgdGhpcy5yZXFzKXsgcmVxLmFib3J0KCkgfVxuICAgIHRoaXMucmVhZHlTdGF0ZSA9IFNPQ0tFVF9TVEFURVMuY2xvc2VkXG4gICAgbGV0IG9wdHMgPSBPYmplY3QuYXNzaWduKHtjb2RlOiAxMDAwLCByZWFzb246IHVuZGVmaW5lZCwgd2FzQ2xlYW46IHRydWV9LCB7Y29kZSwgcmVhc29uLCB3YXNDbGVhbn0pXG4gICAgaWYodHlwZW9mKENsb3NlRXZlbnQpICE9PSBcInVuZGVmaW5lZFwiKXtcbiAgICAgIHRoaXMub25jbG9zZShuZXcgQ2xvc2VFdmVudChcImNsb3NlXCIsIG9wdHMpKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9uY2xvc2Uob3B0cylcbiAgICB9XG4gIH1cblxuICBhamF4KG1ldGhvZCwgYm9keSwgb25DYWxsZXJUaW1lb3V0LCBjYWxsYmFjayl7XG4gICAgbGV0IHJlcVxuICAgIGxldCBvbnRpbWVvdXQgPSAoKSA9PiB7XG4gICAgICB0aGlzLnJlcXMuZGVsZXRlKHJlcSlcbiAgICAgIG9uQ2FsbGVyVGltZW91dCgpXG4gICAgfVxuICAgIHJlcSA9IEFqYXgucmVxdWVzdChtZXRob2QsIHRoaXMuZW5kcG9pbnRVUkwoKSwgXCJhcHBsaWNhdGlvbi9qc29uXCIsIGJvZHksIHRoaXMudGltZW91dCwgb250aW1lb3V0LCByZXNwID0+IHtcbiAgICAgIHRoaXMucmVxcy5kZWxldGUocmVxKVxuICAgICAgaWYodGhpcy5pc0FjdGl2ZSgpKXsgY2FsbGJhY2socmVzcCkgfVxuICAgIH0pXG4gICAgdGhpcy5yZXFzLmFkZChyZXEpXG4gIH1cbn1cbiIsICIvKipcbiAqIEluaXRpYWxpemVzIHRoZSBQcmVzZW5jZVxuICogQHBhcmFtIHtDaGFubmVsfSBjaGFubmVsIC0gVGhlIENoYW5uZWxcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRzIC0gVGhlIG9wdGlvbnMsXG4gKiAgICAgICAgZm9yIGV4YW1wbGUgYHtldmVudHM6IHtzdGF0ZTogXCJzdGF0ZVwiLCBkaWZmOiBcImRpZmZcIn19YFxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQcmVzZW5jZSB7XG5cbiAgY29uc3RydWN0b3IoY2hhbm5lbCwgb3B0cyA9IHt9KXtcbiAgICBsZXQgZXZlbnRzID0gb3B0cy5ldmVudHMgfHwge3N0YXRlOiBcInByZXNlbmNlX3N0YXRlXCIsIGRpZmY6IFwicHJlc2VuY2VfZGlmZlwifVxuICAgIHRoaXMuc3RhdGUgPSB7fVxuICAgIHRoaXMucGVuZGluZ0RpZmZzID0gW11cbiAgICB0aGlzLmNoYW5uZWwgPSBjaGFubmVsXG4gICAgdGhpcy5qb2luUmVmID0gbnVsbFxuICAgIHRoaXMuY2FsbGVyID0ge1xuICAgICAgb25Kb2luOiBmdW5jdGlvbiAoKXsgfSxcbiAgICAgIG9uTGVhdmU6IGZ1bmN0aW9uICgpeyB9LFxuICAgICAgb25TeW5jOiBmdW5jdGlvbiAoKXsgfVxuICAgIH1cblxuICAgIHRoaXMuY2hhbm5lbC5vbihldmVudHMuc3RhdGUsIG5ld1N0YXRlID0+IHtcbiAgICAgIGxldCB7b25Kb2luLCBvbkxlYXZlLCBvblN5bmN9ID0gdGhpcy5jYWxsZXJcblxuICAgICAgdGhpcy5qb2luUmVmID0gdGhpcy5jaGFubmVsLmpvaW5SZWYoKVxuICAgICAgdGhpcy5zdGF0ZSA9IFByZXNlbmNlLnN5bmNTdGF0ZSh0aGlzLnN0YXRlLCBuZXdTdGF0ZSwgb25Kb2luLCBvbkxlYXZlKVxuXG4gICAgICB0aGlzLnBlbmRpbmdEaWZmcy5mb3JFYWNoKGRpZmYgPT4ge1xuICAgICAgICB0aGlzLnN0YXRlID0gUHJlc2VuY2Uuc3luY0RpZmYodGhpcy5zdGF0ZSwgZGlmZiwgb25Kb2luLCBvbkxlYXZlKVxuICAgICAgfSlcbiAgICAgIHRoaXMucGVuZGluZ0RpZmZzID0gW11cbiAgICAgIG9uU3luYygpXG4gICAgfSlcblxuICAgIHRoaXMuY2hhbm5lbC5vbihldmVudHMuZGlmZiwgZGlmZiA9PiB7XG4gICAgICBsZXQge29uSm9pbiwgb25MZWF2ZSwgb25TeW5jfSA9IHRoaXMuY2FsbGVyXG5cbiAgICAgIGlmKHRoaXMuaW5QZW5kaW5nU3luY1N0YXRlKCkpe1xuICAgICAgICB0aGlzLnBlbmRpbmdEaWZmcy5wdXNoKGRpZmYpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnN0YXRlID0gUHJlc2VuY2Uuc3luY0RpZmYodGhpcy5zdGF0ZSwgZGlmZiwgb25Kb2luLCBvbkxlYXZlKVxuICAgICAgICBvblN5bmMoKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBvbkpvaW4oY2FsbGJhY2speyB0aGlzLmNhbGxlci5vbkpvaW4gPSBjYWxsYmFjayB9XG5cbiAgb25MZWF2ZShjYWxsYmFjayl7IHRoaXMuY2FsbGVyLm9uTGVhdmUgPSBjYWxsYmFjayB9XG5cbiAgb25TeW5jKGNhbGxiYWNrKXsgdGhpcy5jYWxsZXIub25TeW5jID0gY2FsbGJhY2sgfVxuXG4gIGxpc3QoYnkpeyByZXR1cm4gUHJlc2VuY2UubGlzdCh0aGlzLnN0YXRlLCBieSkgfVxuXG4gIGluUGVuZGluZ1N5bmNTdGF0ZSgpe1xuICAgIHJldHVybiAhdGhpcy5qb2luUmVmIHx8ICh0aGlzLmpvaW5SZWYgIT09IHRoaXMuY2hhbm5lbC5qb2luUmVmKCkpXG4gIH1cblxuICAvLyBsb3dlci1sZXZlbCBwdWJsaWMgc3RhdGljIEFQSVxuXG4gIC8qKlxuICAgKiBVc2VkIHRvIHN5bmMgdGhlIGxpc3Qgb2YgcHJlc2VuY2VzIG9uIHRoZSBzZXJ2ZXJcbiAgICogd2l0aCB0aGUgY2xpZW50J3Mgc3RhdGUuIEFuIG9wdGlvbmFsIGBvbkpvaW5gIGFuZCBgb25MZWF2ZWAgY2FsbGJhY2sgY2FuXG4gICAqIGJlIHByb3ZpZGVkIHRvIHJlYWN0IHRvIGNoYW5nZXMgaW4gdGhlIGNsaWVudCdzIGxvY2FsIHByZXNlbmNlcyBhY3Jvc3NcbiAgICogZGlzY29ubmVjdHMgYW5kIHJlY29ubmVjdHMgd2l0aCB0aGUgc2VydmVyLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJlc2VuY2V9XG4gICAqL1xuICBzdGF0aWMgc3luY1N0YXRlKGN1cnJlbnRTdGF0ZSwgbmV3U3RhdGUsIG9uSm9pbiwgb25MZWF2ZSl7XG4gICAgbGV0IHN0YXRlID0gdGhpcy5jbG9uZShjdXJyZW50U3RhdGUpXG4gICAgbGV0IGpvaW5zID0ge31cbiAgICBsZXQgbGVhdmVzID0ge31cblxuICAgIHRoaXMubWFwKHN0YXRlLCAoa2V5LCBwcmVzZW5jZSkgPT4ge1xuICAgICAgaWYoIW5ld1N0YXRlW2tleV0pe1xuICAgICAgICBsZWF2ZXNba2V5XSA9IHByZXNlbmNlXG4gICAgICB9XG4gICAgfSlcbiAgICB0aGlzLm1hcChuZXdTdGF0ZSwgKGtleSwgbmV3UHJlc2VuY2UpID0+IHtcbiAgICAgIGxldCBjdXJyZW50UHJlc2VuY2UgPSBzdGF0ZVtrZXldXG4gICAgICBpZihjdXJyZW50UHJlc2VuY2Upe1xuICAgICAgICBsZXQgbmV3UmVmcyA9IG5ld1ByZXNlbmNlLm1ldGFzLm1hcChtID0+IG0ucGh4X3JlZilcbiAgICAgICAgbGV0IGN1clJlZnMgPSBjdXJyZW50UHJlc2VuY2UubWV0YXMubWFwKG0gPT4gbS5waHhfcmVmKVxuICAgICAgICBsZXQgam9pbmVkTWV0YXMgPSBuZXdQcmVzZW5jZS5tZXRhcy5maWx0ZXIobSA9PiBjdXJSZWZzLmluZGV4T2YobS5waHhfcmVmKSA8IDApXG4gICAgICAgIGxldCBsZWZ0TWV0YXMgPSBjdXJyZW50UHJlc2VuY2UubWV0YXMuZmlsdGVyKG0gPT4gbmV3UmVmcy5pbmRleE9mKG0ucGh4X3JlZikgPCAwKVxuICAgICAgICBpZihqb2luZWRNZXRhcy5sZW5ndGggPiAwKXtcbiAgICAgICAgICBqb2luc1trZXldID0gbmV3UHJlc2VuY2VcbiAgICAgICAgICBqb2luc1trZXldLm1ldGFzID0gam9pbmVkTWV0YXNcbiAgICAgICAgfVxuICAgICAgICBpZihsZWZ0TWV0YXMubGVuZ3RoID4gMCl7XG4gICAgICAgICAgbGVhdmVzW2tleV0gPSB0aGlzLmNsb25lKGN1cnJlbnRQcmVzZW5jZSlcbiAgICAgICAgICBsZWF2ZXNba2V5XS5tZXRhcyA9IGxlZnRNZXRhc1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBqb2luc1trZXldID0gbmV3UHJlc2VuY2VcbiAgICAgIH1cbiAgICB9KVxuICAgIHJldHVybiB0aGlzLnN5bmNEaWZmKHN0YXRlLCB7am9pbnM6IGpvaW5zLCBsZWF2ZXM6IGxlYXZlc30sIG9uSm9pbiwgb25MZWF2ZSlcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBVc2VkIHRvIHN5bmMgYSBkaWZmIG9mIHByZXNlbmNlIGpvaW4gYW5kIGxlYXZlXG4gICAqIGV2ZW50cyBmcm9tIHRoZSBzZXJ2ZXIsIGFzIHRoZXkgaGFwcGVuLiBMaWtlIGBzeW5jU3RhdGVgLCBgc3luY0RpZmZgXG4gICAqIGFjY2VwdHMgb3B0aW9uYWwgYG9uSm9pbmAgYW5kIGBvbkxlYXZlYCBjYWxsYmFja3MgdG8gcmVhY3QgdG8gYSB1c2VyXG4gICAqIGpvaW5pbmcgb3IgbGVhdmluZyBmcm9tIGEgZGV2aWNlLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJlc2VuY2V9XG4gICAqL1xuICBzdGF0aWMgc3luY0RpZmYoc3RhdGUsIGRpZmYsIG9uSm9pbiwgb25MZWF2ZSl7XG4gICAgbGV0IHtqb2lucywgbGVhdmVzfSA9IHRoaXMuY2xvbmUoZGlmZilcbiAgICBpZighb25Kb2luKXsgb25Kb2luID0gZnVuY3Rpb24gKCl7IH0gfVxuICAgIGlmKCFvbkxlYXZlKXsgb25MZWF2ZSA9IGZ1bmN0aW9uICgpeyB9IH1cblxuICAgIHRoaXMubWFwKGpvaW5zLCAoa2V5LCBuZXdQcmVzZW5jZSkgPT4ge1xuICAgICAgbGV0IGN1cnJlbnRQcmVzZW5jZSA9IHN0YXRlW2tleV1cbiAgICAgIHN0YXRlW2tleV0gPSB0aGlzLmNsb25lKG5ld1ByZXNlbmNlKVxuICAgICAgaWYoY3VycmVudFByZXNlbmNlKXtcbiAgICAgICAgbGV0IGpvaW5lZFJlZnMgPSBzdGF0ZVtrZXldLm1ldGFzLm1hcChtID0+IG0ucGh4X3JlZilcbiAgICAgICAgbGV0IGN1ck1ldGFzID0gY3VycmVudFByZXNlbmNlLm1ldGFzLmZpbHRlcihtID0+IGpvaW5lZFJlZnMuaW5kZXhPZihtLnBoeF9yZWYpIDwgMClcbiAgICAgICAgc3RhdGVba2V5XS5tZXRhcy51bnNoaWZ0KC4uLmN1ck1ldGFzKVxuICAgICAgfVxuICAgICAgb25Kb2luKGtleSwgY3VycmVudFByZXNlbmNlLCBuZXdQcmVzZW5jZSlcbiAgICB9KVxuICAgIHRoaXMubWFwKGxlYXZlcywgKGtleSwgbGVmdFByZXNlbmNlKSA9PiB7XG4gICAgICBsZXQgY3VycmVudFByZXNlbmNlID0gc3RhdGVba2V5XVxuICAgICAgaWYoIWN1cnJlbnRQcmVzZW5jZSl7IHJldHVybiB9XG4gICAgICBsZXQgcmVmc1RvUmVtb3ZlID0gbGVmdFByZXNlbmNlLm1ldGFzLm1hcChtID0+IG0ucGh4X3JlZilcbiAgICAgIGN1cnJlbnRQcmVzZW5jZS5tZXRhcyA9IGN1cnJlbnRQcmVzZW5jZS5tZXRhcy5maWx0ZXIocCA9PiB7XG4gICAgICAgIHJldHVybiByZWZzVG9SZW1vdmUuaW5kZXhPZihwLnBoeF9yZWYpIDwgMFxuICAgICAgfSlcbiAgICAgIG9uTGVhdmUoa2V5LCBjdXJyZW50UHJlc2VuY2UsIGxlZnRQcmVzZW5jZSlcbiAgICAgIGlmKGN1cnJlbnRQcmVzZW5jZS5tZXRhcy5sZW5ndGggPT09IDApe1xuICAgICAgICBkZWxldGUgc3RhdGVba2V5XVxuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIHN0YXRlXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJlc2VuY2VzLCB3aXRoIHNlbGVjdGVkIG1ldGFkYXRhLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcHJlc2VuY2VzXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNob29zZXJcbiAgICpcbiAgICogQHJldHVybnMge1ByZXNlbmNlfVxuICAgKi9cbiAgc3RhdGljIGxpc3QocHJlc2VuY2VzLCBjaG9vc2VyKXtcbiAgICBpZighY2hvb3Nlcil7IGNob29zZXIgPSBmdW5jdGlvbiAoa2V5LCBwcmVzKXsgcmV0dXJuIHByZXMgfSB9XG5cbiAgICByZXR1cm4gdGhpcy5tYXAocHJlc2VuY2VzLCAoa2V5LCBwcmVzZW5jZSkgPT4ge1xuICAgICAgcmV0dXJuIGNob29zZXIoa2V5LCBwcmVzZW5jZSlcbiAgICB9KVxuICB9XG5cbiAgLy8gcHJpdmF0ZVxuXG4gIHN0YXRpYyBtYXAob2JqLCBmdW5jKXtcbiAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMob2JqKS5tYXAoa2V5ID0+IGZ1bmMoa2V5LCBvYmpba2V5XSkpXG4gIH1cblxuICBzdGF0aWMgY2xvbmUob2JqKXsgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkob2JqKSkgfVxufVxuIiwgIi8qIFRoZSBkZWZhdWx0IHNlcmlhbGl6ZXIgZm9yIGVuY29kaW5nIGFuZCBkZWNvZGluZyBtZXNzYWdlcyAqL1xuaW1wb3J0IHtcbiAgQ0hBTk5FTF9FVkVOVFNcbn0gZnJvbSBcIi4vY29uc3RhbnRzXCJcblxuZXhwb3J0IGRlZmF1bHQge1xuICBIRUFERVJfTEVOR1RIOiAxLFxuICBNRVRBX0xFTkdUSDogNCxcbiAgS0lORFM6IHtwdXNoOiAwLCByZXBseTogMSwgYnJvYWRjYXN0OiAyfSxcblxuICBlbmNvZGUobXNnLCBjYWxsYmFjayl7XG4gICAgaWYobXNnLnBheWxvYWQuY29uc3RydWN0b3IgPT09IEFycmF5QnVmZmVyKXtcbiAgICAgIHJldHVybiBjYWxsYmFjayh0aGlzLmJpbmFyeUVuY29kZShtc2cpKVxuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgcGF5bG9hZCA9IFttc2cuam9pbl9yZWYsIG1zZy5yZWYsIG1zZy50b3BpYywgbXNnLmV2ZW50LCBtc2cucGF5bG9hZF1cbiAgICAgIHJldHVybiBjYWxsYmFjayhKU09OLnN0cmluZ2lmeShwYXlsb2FkKSlcbiAgICB9XG4gIH0sXG5cbiAgZGVjb2RlKHJhd1BheWxvYWQsIGNhbGxiYWNrKXtcbiAgICBpZihyYXdQYXlsb2FkLmNvbnN0cnVjdG9yID09PSBBcnJheUJ1ZmZlcil7XG4gICAgICByZXR1cm4gY2FsbGJhY2sodGhpcy5iaW5hcnlEZWNvZGUocmF3UGF5bG9hZCkpXG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBbam9pbl9yZWYsIHJlZiwgdG9waWMsIGV2ZW50LCBwYXlsb2FkXSA9IEpTT04ucGFyc2UocmF3UGF5bG9hZClcbiAgICAgIHJldHVybiBjYWxsYmFjayh7am9pbl9yZWYsIHJlZiwgdG9waWMsIGV2ZW50LCBwYXlsb2FkfSlcbiAgICB9XG4gIH0sXG5cbiAgLy8gcHJpdmF0ZVxuXG4gIGJpbmFyeUVuY29kZShtZXNzYWdlKXtcbiAgICBsZXQge2pvaW5fcmVmLCByZWYsIGV2ZW50LCB0b3BpYywgcGF5bG9hZH0gPSBtZXNzYWdlXG4gICAgbGV0IG1ldGFMZW5ndGggPSB0aGlzLk1FVEFfTEVOR1RIICsgam9pbl9yZWYubGVuZ3RoICsgcmVmLmxlbmd0aCArIHRvcGljLmxlbmd0aCArIGV2ZW50Lmxlbmd0aFxuICAgIGxldCBoZWFkZXIgPSBuZXcgQXJyYXlCdWZmZXIodGhpcy5IRUFERVJfTEVOR1RIICsgbWV0YUxlbmd0aClcbiAgICBsZXQgdmlldyA9IG5ldyBEYXRhVmlldyhoZWFkZXIpXG4gICAgbGV0IG9mZnNldCA9IDBcblxuICAgIHZpZXcuc2V0VWludDgob2Zmc2V0KyssIHRoaXMuS0lORFMucHVzaCkgLy8ga2luZFxuICAgIHZpZXcuc2V0VWludDgob2Zmc2V0KyssIGpvaW5fcmVmLmxlbmd0aClcbiAgICB2aWV3LnNldFVpbnQ4KG9mZnNldCsrLCByZWYubGVuZ3RoKVxuICAgIHZpZXcuc2V0VWludDgob2Zmc2V0KyssIHRvcGljLmxlbmd0aClcbiAgICB2aWV3LnNldFVpbnQ4KG9mZnNldCsrLCBldmVudC5sZW5ndGgpXG4gICAgQXJyYXkuZnJvbShqb2luX3JlZiwgY2hhciA9PiB2aWV3LnNldFVpbnQ4KG9mZnNldCsrLCBjaGFyLmNoYXJDb2RlQXQoMCkpKVxuICAgIEFycmF5LmZyb20ocmVmLCBjaGFyID0+IHZpZXcuc2V0VWludDgob2Zmc2V0KyssIGNoYXIuY2hhckNvZGVBdCgwKSkpXG4gICAgQXJyYXkuZnJvbSh0b3BpYywgY2hhciA9PiB2aWV3LnNldFVpbnQ4KG9mZnNldCsrLCBjaGFyLmNoYXJDb2RlQXQoMCkpKVxuICAgIEFycmF5LmZyb20oZXZlbnQsIGNoYXIgPT4gdmlldy5zZXRVaW50OChvZmZzZXQrKywgY2hhci5jaGFyQ29kZUF0KDApKSlcblxuICAgIHZhciBjb21iaW5lZCA9IG5ldyBVaW50OEFycmF5KGhlYWRlci5ieXRlTGVuZ3RoICsgcGF5bG9hZC5ieXRlTGVuZ3RoKVxuICAgIGNvbWJpbmVkLnNldChuZXcgVWludDhBcnJheShoZWFkZXIpLCAwKVxuICAgIGNvbWJpbmVkLnNldChuZXcgVWludDhBcnJheShwYXlsb2FkKSwgaGVhZGVyLmJ5dGVMZW5ndGgpXG5cbiAgICByZXR1cm4gY29tYmluZWQuYnVmZmVyXG4gIH0sXG5cbiAgYmluYXJ5RGVjb2RlKGJ1ZmZlcil7XG4gICAgbGV0IHZpZXcgPSBuZXcgRGF0YVZpZXcoYnVmZmVyKVxuICAgIGxldCBraW5kID0gdmlldy5nZXRVaW50OCgwKVxuICAgIGxldCBkZWNvZGVyID0gbmV3IFRleHREZWNvZGVyKClcbiAgICBzd2l0Y2goa2luZCl7XG4gICAgICBjYXNlIHRoaXMuS0lORFMucHVzaDogcmV0dXJuIHRoaXMuZGVjb2RlUHVzaChidWZmZXIsIHZpZXcsIGRlY29kZXIpXG4gICAgICBjYXNlIHRoaXMuS0lORFMucmVwbHk6IHJldHVybiB0aGlzLmRlY29kZVJlcGx5KGJ1ZmZlciwgdmlldywgZGVjb2RlcilcbiAgICAgIGNhc2UgdGhpcy5LSU5EUy5icm9hZGNhc3Q6IHJldHVybiB0aGlzLmRlY29kZUJyb2FkY2FzdChidWZmZXIsIHZpZXcsIGRlY29kZXIpXG4gICAgfVxuICB9LFxuXG4gIGRlY29kZVB1c2goYnVmZmVyLCB2aWV3LCBkZWNvZGVyKXtcbiAgICBsZXQgam9pblJlZlNpemUgPSB2aWV3LmdldFVpbnQ4KDEpXG4gICAgbGV0IHRvcGljU2l6ZSA9IHZpZXcuZ2V0VWludDgoMilcbiAgICBsZXQgZXZlbnRTaXplID0gdmlldy5nZXRVaW50OCgzKVxuICAgIGxldCBvZmZzZXQgPSB0aGlzLkhFQURFUl9MRU5HVEggKyB0aGlzLk1FVEFfTEVOR1RIIC0gMSAvLyBwdXNoZXMgaGF2ZSBubyByZWZcbiAgICBsZXQgam9pblJlZiA9IGRlY29kZXIuZGVjb2RlKGJ1ZmZlci5zbGljZShvZmZzZXQsIG9mZnNldCArIGpvaW5SZWZTaXplKSlcbiAgICBvZmZzZXQgPSBvZmZzZXQgKyBqb2luUmVmU2l6ZVxuICAgIGxldCB0b3BpYyA9IGRlY29kZXIuZGVjb2RlKGJ1ZmZlci5zbGljZShvZmZzZXQsIG9mZnNldCArIHRvcGljU2l6ZSkpXG4gICAgb2Zmc2V0ID0gb2Zmc2V0ICsgdG9waWNTaXplXG4gICAgbGV0IGV2ZW50ID0gZGVjb2Rlci5kZWNvZGUoYnVmZmVyLnNsaWNlKG9mZnNldCwgb2Zmc2V0ICsgZXZlbnRTaXplKSlcbiAgICBvZmZzZXQgPSBvZmZzZXQgKyBldmVudFNpemVcbiAgICBsZXQgZGF0YSA9IGJ1ZmZlci5zbGljZShvZmZzZXQsIGJ1ZmZlci5ieXRlTGVuZ3RoKVxuICAgIHJldHVybiB7am9pbl9yZWY6IGpvaW5SZWYsIHJlZjogbnVsbCwgdG9waWM6IHRvcGljLCBldmVudDogZXZlbnQsIHBheWxvYWQ6IGRhdGF9XG4gIH0sXG5cbiAgZGVjb2RlUmVwbHkoYnVmZmVyLCB2aWV3LCBkZWNvZGVyKXtcbiAgICBsZXQgam9pblJlZlNpemUgPSB2aWV3LmdldFVpbnQ4KDEpXG4gICAgbGV0IHJlZlNpemUgPSB2aWV3LmdldFVpbnQ4KDIpXG4gICAgbGV0IHRvcGljU2l6ZSA9IHZpZXcuZ2V0VWludDgoMylcbiAgICBsZXQgZXZlbnRTaXplID0gdmlldy5nZXRVaW50OCg0KVxuICAgIGxldCBvZmZzZXQgPSB0aGlzLkhFQURFUl9MRU5HVEggKyB0aGlzLk1FVEFfTEVOR1RIXG4gICAgbGV0IGpvaW5SZWYgPSBkZWNvZGVyLmRlY29kZShidWZmZXIuc2xpY2Uob2Zmc2V0LCBvZmZzZXQgKyBqb2luUmVmU2l6ZSkpXG4gICAgb2Zmc2V0ID0gb2Zmc2V0ICsgam9pblJlZlNpemVcbiAgICBsZXQgcmVmID0gZGVjb2Rlci5kZWNvZGUoYnVmZmVyLnNsaWNlKG9mZnNldCwgb2Zmc2V0ICsgcmVmU2l6ZSkpXG4gICAgb2Zmc2V0ID0gb2Zmc2V0ICsgcmVmU2l6ZVxuICAgIGxldCB0b3BpYyA9IGRlY29kZXIuZGVjb2RlKGJ1ZmZlci5zbGljZShvZmZzZXQsIG9mZnNldCArIHRvcGljU2l6ZSkpXG4gICAgb2Zmc2V0ID0gb2Zmc2V0ICsgdG9waWNTaXplXG4gICAgbGV0IGV2ZW50ID0gZGVjb2Rlci5kZWNvZGUoYnVmZmVyLnNsaWNlKG9mZnNldCwgb2Zmc2V0ICsgZXZlbnRTaXplKSlcbiAgICBvZmZzZXQgPSBvZmZzZXQgKyBldmVudFNpemVcbiAgICBsZXQgZGF0YSA9IGJ1ZmZlci5zbGljZShvZmZzZXQsIGJ1ZmZlci5ieXRlTGVuZ3RoKVxuICAgIGxldCBwYXlsb2FkID0ge3N0YXR1czogZXZlbnQsIHJlc3BvbnNlOiBkYXRhfVxuICAgIHJldHVybiB7am9pbl9yZWY6IGpvaW5SZWYsIHJlZjogcmVmLCB0b3BpYzogdG9waWMsIGV2ZW50OiBDSEFOTkVMX0VWRU5UUy5yZXBseSwgcGF5bG9hZDogcGF5bG9hZH1cbiAgfSxcblxuICBkZWNvZGVCcm9hZGNhc3QoYnVmZmVyLCB2aWV3LCBkZWNvZGVyKXtcbiAgICBsZXQgdG9waWNTaXplID0gdmlldy5nZXRVaW50OCgxKVxuICAgIGxldCBldmVudFNpemUgPSB2aWV3LmdldFVpbnQ4KDIpXG4gICAgbGV0IG9mZnNldCA9IHRoaXMuSEVBREVSX0xFTkdUSCArIDJcbiAgICBsZXQgdG9waWMgPSBkZWNvZGVyLmRlY29kZShidWZmZXIuc2xpY2Uob2Zmc2V0LCBvZmZzZXQgKyB0b3BpY1NpemUpKVxuICAgIG9mZnNldCA9IG9mZnNldCArIHRvcGljU2l6ZVxuICAgIGxldCBldmVudCA9IGRlY29kZXIuZGVjb2RlKGJ1ZmZlci5zbGljZShvZmZzZXQsIG9mZnNldCArIGV2ZW50U2l6ZSkpXG4gICAgb2Zmc2V0ID0gb2Zmc2V0ICsgZXZlbnRTaXplXG4gICAgbGV0IGRhdGEgPSBidWZmZXIuc2xpY2Uob2Zmc2V0LCBidWZmZXIuYnl0ZUxlbmd0aClcblxuICAgIHJldHVybiB7am9pbl9yZWY6IG51bGwsIHJlZjogbnVsbCwgdG9waWM6IHRvcGljLCBldmVudDogZXZlbnQsIHBheWxvYWQ6IGRhdGF9XG4gIH1cbn1cbiIsICJpbXBvcnQge1xuICBnbG9iYWwsXG4gIHBoeFdpbmRvdyxcbiAgQ0hBTk5FTF9FVkVOVFMsXG4gIERFRkFVTFRfVElNRU9VVCxcbiAgREVGQVVMVF9WU04sXG4gIFNPQ0tFVF9TVEFURVMsXG4gIFRSQU5TUE9SVFMsXG4gIFdTX0NMT1NFX05PUk1BTFxufSBmcm9tIFwiLi9jb25zdGFudHNcIlxuXG5pbXBvcnQge1xuICBjbG9zdXJlXG59IGZyb20gXCIuL3V0aWxzXCJcblxuaW1wb3J0IEFqYXggZnJvbSBcIi4vYWpheFwiXG5pbXBvcnQgQ2hhbm5lbCBmcm9tIFwiLi9jaGFubmVsXCJcbmltcG9ydCBMb25nUG9sbCBmcm9tIFwiLi9sb25ncG9sbFwiXG5pbXBvcnQgU2VyaWFsaXplciBmcm9tIFwiLi9zZXJpYWxpemVyXCJcbmltcG9ydCBUaW1lciBmcm9tIFwiLi90aW1lclwiXG5cbi8qKiBJbml0aWFsaXplcyB0aGUgU29ja2V0ICpcbiAqXG4gKiBGb3IgSUU4IHN1cHBvcnQgdXNlIGFuIEVTNS1zaGltIChodHRwczovL2dpdGh1Yi5jb20vZXMtc2hpbXMvZXM1LXNoaW0pXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGVuZFBvaW50IC0gVGhlIHN0cmluZyBXZWJTb2NrZXQgZW5kcG9pbnQsIGllLCBgXCJ3czovL2V4YW1wbGUuY29tL3NvY2tldFwiYCxcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgXCJ3c3M6Ly9leGFtcGxlLmNvbVwiYFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBcIi9zb2NrZXRcImAgKGluaGVyaXRlZCBob3N0ICYgcHJvdG9jb2wpXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdHNdIC0gT3B0aW9uYWwgY29uZmlndXJhdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdHMudHJhbnNwb3J0XSAtIFRoZSBXZWJzb2NrZXQgVHJhbnNwb3J0LCBmb3IgZXhhbXBsZSBXZWJTb2NrZXQgb3IgUGhvZW5peC5Mb25nUG9sbC5cbiAqXG4gKiBEZWZhdWx0cyB0byBXZWJTb2NrZXQgd2l0aCBhdXRvbWF0aWMgTG9uZ1BvbGwgZmFsbGJhY2suXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0cy5lbmNvZGVdIC0gVGhlIGZ1bmN0aW9uIHRvIGVuY29kZSBvdXRnb2luZyBtZXNzYWdlcy5cbiAqXG4gKiBEZWZhdWx0cyB0byBKU09OIGVuY29kZXIuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdHMuZGVjb2RlXSAtIFRoZSBmdW5jdGlvbiB0byBkZWNvZGUgaW5jb21pbmcgbWVzc2FnZXMuXG4gKlxuICogRGVmYXVsdHMgdG8gSlNPTjpcbiAqXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiAocGF5bG9hZCwgY2FsbGJhY2spID0+IGNhbGxiYWNrKEpTT04ucGFyc2UocGF5bG9hZCkpXG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gW29wdHMudGltZW91dF0gLSBUaGUgZGVmYXVsdCB0aW1lb3V0IGluIG1pbGxpc2Vjb25kcyB0byB0cmlnZ2VyIHB1c2ggdGltZW91dHMuXG4gKlxuICogRGVmYXVsdHMgYERFRkFVTFRfVElNRU9VVGBcbiAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0cy5oZWFydGJlYXRJbnRlcnZhbE1zXSAtIFRoZSBtaWxsaXNlYyBpbnRlcnZhbCB0byBzZW5kIGEgaGVhcnRiZWF0IG1lc3NhZ2VcbiAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0cy5yZWNvbm5lY3RBZnRlck1zXSAtIFRoZSBvcHRpb25hbCBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIG1pbGxpc2VjXG4gKiBzb2NrZXQgcmVjb25uZWN0IGludGVydmFsLlxuICpcbiAqIERlZmF1bHRzIHRvIHN0ZXBwZWQgYmFja29mZiBvZjpcbiAqXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBmdW5jdGlvbih0cmllcyl7XG4gKiAgIHJldHVybiBbMTAsIDUwLCAxMDAsIDE1MCwgMjAwLCAyNTAsIDUwMCwgMTAwMCwgMjAwMF1bdHJpZXMgLSAxXSB8fCA1MDAwXG4gKiB9XG4gKiBgYGBgXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IFtvcHRzLnJlam9pbkFmdGVyTXNdIC0gVGhlIG9wdGlvbmFsIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgbWlsbGlzZWNcbiAqIHJlam9pbiBpbnRlcnZhbCBmb3IgaW5kaXZpZHVhbCBjaGFubmVscy5cbiAqXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBmdW5jdGlvbih0cmllcyl7XG4gKiAgIHJldHVybiBbMTAwMCwgMjAwMCwgNTAwMF1bdHJpZXMgLSAxXSB8fCAxMDAwMFxuICogfVxuICogYGBgYFxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRzLmxvZ2dlcl0gLSBUaGUgb3B0aW9uYWwgZnVuY3Rpb24gZm9yIHNwZWNpYWxpemVkIGxvZ2dpbmcsIGllOlxuICpcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGZ1bmN0aW9uKGtpbmQsIG1zZywgZGF0YSkge1xuICogICBjb25zb2xlLmxvZyhgJHtraW5kfTogJHttc2d9YCwgZGF0YSlcbiAqIH1cbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0cy5sb25ncG9sbGVyVGltZW91dF0gLSBUaGUgbWF4aW11bSB0aW1lb3V0IG9mIGEgbG9uZyBwb2xsIEFKQVggcmVxdWVzdC5cbiAqXG4gKiBEZWZhdWx0cyB0byAyMHMgKGRvdWJsZSB0aGUgc2VydmVyIGxvbmcgcG9sbCB0aW1lcikuXG4gKlxuICogQHBhcmFtIHsoT2JqZWN0fGZ1bmN0aW9uKX0gW29wdHMucGFyYW1zXSAtIFRoZSBvcHRpb25hbCBwYXJhbXMgdG8gcGFzcyB3aGVuIGNvbm5lY3RpbmdcbiAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0cy5iaW5hcnlUeXBlXSAtIFRoZSBiaW5hcnkgdHlwZSB0byB1c2UgZm9yIGJpbmFyeSBXZWJTb2NrZXQgZnJhbWVzLlxuICpcbiAqIERlZmF1bHRzIHRvIFwiYXJyYXlidWZmZXJcIlxuICpcbiAqIEBwYXJhbSB7dnNufSBbb3B0cy52c25dIC0gVGhlIHNlcmlhbGl6ZXIncyBwcm90b2NvbCB2ZXJzaW9uIHRvIHNlbmQgb24gY29ubmVjdC5cbiAqXG4gKiBEZWZhdWx0cyB0byBERUZBVUxUX1ZTTi5cbiovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTb2NrZXQge1xuICBjb25zdHJ1Y3RvcihlbmRQb2ludCwgb3B0cyA9IHt9KXtcbiAgICB0aGlzLnN0YXRlQ2hhbmdlQ2FsbGJhY2tzID0ge29wZW46IFtdLCBjbG9zZTogW10sIGVycm9yOiBbXSwgbWVzc2FnZTogW119XG4gICAgdGhpcy5jaGFubmVscyA9IFtdXG4gICAgdGhpcy5zZW5kQnVmZmVyID0gW11cbiAgICB0aGlzLnJlZiA9IDBcbiAgICB0aGlzLnRpbWVvdXQgPSBvcHRzLnRpbWVvdXQgfHwgREVGQVVMVF9USU1FT1VUXG4gICAgdGhpcy50cmFuc3BvcnQgPSBvcHRzLnRyYW5zcG9ydCB8fCBnbG9iYWwuV2ViU29ja2V0IHx8IExvbmdQb2xsXG4gICAgdGhpcy5lc3RhYmxpc2hlZENvbm5lY3Rpb25zID0gMFxuICAgIHRoaXMuZGVmYXVsdEVuY29kZXIgPSBTZXJpYWxpemVyLmVuY29kZS5iaW5kKFNlcmlhbGl6ZXIpXG4gICAgdGhpcy5kZWZhdWx0RGVjb2RlciA9IFNlcmlhbGl6ZXIuZGVjb2RlLmJpbmQoU2VyaWFsaXplcilcbiAgICB0aGlzLmNsb3NlV2FzQ2xlYW4gPSBmYWxzZVxuICAgIHRoaXMuYmluYXJ5VHlwZSA9IG9wdHMuYmluYXJ5VHlwZSB8fCBcImFycmF5YnVmZmVyXCJcbiAgICB0aGlzLmNvbm5lY3RDbG9jayA9IDFcbiAgICBpZih0aGlzLnRyYW5zcG9ydCAhPT0gTG9uZ1BvbGwpe1xuICAgICAgdGhpcy5lbmNvZGUgPSBvcHRzLmVuY29kZSB8fCB0aGlzLmRlZmF1bHRFbmNvZGVyXG4gICAgICB0aGlzLmRlY29kZSA9IG9wdHMuZGVjb2RlIHx8IHRoaXMuZGVmYXVsdERlY29kZXJcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lbmNvZGUgPSB0aGlzLmRlZmF1bHRFbmNvZGVyXG4gICAgICB0aGlzLmRlY29kZSA9IHRoaXMuZGVmYXVsdERlY29kZXJcbiAgICB9XG4gICAgbGV0IGF3YWl0aW5nQ29ubmVjdGlvbk9uUGFnZVNob3cgPSBudWxsXG4gICAgaWYocGh4V2luZG93ICYmIHBoeFdpbmRvdy5hZGRFdmVudExpc3RlbmVyKXtcbiAgICAgIHBoeFdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicGFnZWhpZGVcIiwgX2UgPT4ge1xuICAgICAgICBpZih0aGlzLmNvbm4pe1xuICAgICAgICAgIHRoaXMuZGlzY29ubmVjdCgpXG4gICAgICAgICAgYXdhaXRpbmdDb25uZWN0aW9uT25QYWdlU2hvdyA9IHRoaXMuY29ubmVjdENsb2NrXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICBwaHhXaW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInBhZ2VzaG93XCIsIF9lID0+IHtcbiAgICAgICAgaWYoYXdhaXRpbmdDb25uZWN0aW9uT25QYWdlU2hvdyA9PT0gdGhpcy5jb25uZWN0Q2xvY2spe1xuICAgICAgICAgIGF3YWl0aW5nQ29ubmVjdGlvbk9uUGFnZVNob3cgPSBudWxsXG4gICAgICAgICAgdGhpcy5jb25uZWN0KClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gICAgdGhpcy5oZWFydGJlYXRJbnRlcnZhbE1zID0gb3B0cy5oZWFydGJlYXRJbnRlcnZhbE1zIHx8IDMwMDAwXG4gICAgdGhpcy5yZWpvaW5BZnRlck1zID0gKHRyaWVzKSA9PiB7XG4gICAgICBpZihvcHRzLnJlam9pbkFmdGVyTXMpe1xuICAgICAgICByZXR1cm4gb3B0cy5yZWpvaW5BZnRlck1zKHRyaWVzKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFsxMDAwLCAyMDAwLCA1MDAwXVt0cmllcyAtIDFdIHx8IDEwMDAwXG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMucmVjb25uZWN0QWZ0ZXJNcyA9ICh0cmllcykgPT4ge1xuICAgICAgaWYob3B0cy5yZWNvbm5lY3RBZnRlck1zKXtcbiAgICAgICAgcmV0dXJuIG9wdHMucmVjb25uZWN0QWZ0ZXJNcyh0cmllcylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBbMTAsIDUwLCAxMDAsIDE1MCwgMjAwLCAyNTAsIDUwMCwgMTAwMCwgMjAwMF1bdHJpZXMgLSAxXSB8fCA1MDAwXG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMubG9nZ2VyID0gb3B0cy5sb2dnZXIgfHwgbnVsbFxuICAgIHRoaXMubG9uZ3BvbGxlclRpbWVvdXQgPSBvcHRzLmxvbmdwb2xsZXJUaW1lb3V0IHx8IDIwMDAwXG4gICAgdGhpcy5wYXJhbXMgPSBjbG9zdXJlKG9wdHMucGFyYW1zIHx8IHt9KVxuICAgIHRoaXMuZW5kUG9pbnQgPSBgJHtlbmRQb2ludH0vJHtUUkFOU1BPUlRTLndlYnNvY2tldH1gXG4gICAgdGhpcy52c24gPSBvcHRzLnZzbiB8fCBERUZBVUxUX1ZTTlxuICAgIHRoaXMuaGVhcnRiZWF0VGltZW91dFRpbWVyID0gbnVsbFxuICAgIHRoaXMuaGVhcnRiZWF0VGltZXIgPSBudWxsXG4gICAgdGhpcy5wZW5kaW5nSGVhcnRiZWF0UmVmID0gbnVsbFxuICAgIHRoaXMucmVjb25uZWN0VGltZXIgPSBuZXcgVGltZXIoKCkgPT4ge1xuICAgICAgdGhpcy50ZWFyZG93bigoKSA9PiB0aGlzLmNvbm5lY3QoKSlcbiAgICB9LCB0aGlzLnJlY29ubmVjdEFmdGVyTXMpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgTG9uZ1BvbGwgdHJhbnNwb3J0IHJlZmVyZW5jZVxuICAgKi9cbiAgZ2V0TG9uZ1BvbGxUcmFuc3BvcnQoKXsgcmV0dXJuIExvbmdQb2xsIH1cblxuICAvKipcbiAgICogRGlzY29ubmVjdHMgYW5kIHJlcGxhY2VzIHRoZSBhY3RpdmUgdHJhbnNwb3J0XG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IG5ld1RyYW5zcG9ydCAtIFRoZSBuZXcgdHJhbnNwb3J0IGNsYXNzIHRvIGluc3RhbnRpYXRlXG4gICAqXG4gICAqL1xuICByZXBsYWNlVHJhbnNwb3J0KG5ld1RyYW5zcG9ydCl7XG4gICAgdGhpcy5jb25uZWN0Q2xvY2srK1xuICAgIHRoaXMuY2xvc2VXYXNDbGVhbiA9IHRydWVcbiAgICB0aGlzLnJlY29ubmVjdFRpbWVyLnJlc2V0KClcbiAgICB0aGlzLnNlbmRCdWZmZXIgPSBbXVxuICAgIGlmKHRoaXMuY29ubil7XG4gICAgICB0aGlzLmNvbm4uY2xvc2UoKVxuICAgICAgdGhpcy5jb25uID0gbnVsbFxuICAgIH1cbiAgICB0aGlzLnRyYW5zcG9ydCA9IG5ld1RyYW5zcG9ydFxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHNvY2tldCBwcm90b2NvbFxuICAgKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgKi9cbiAgcHJvdG9jb2woKXsgcmV0dXJuIGxvY2F0aW9uLnByb3RvY29sLm1hdGNoKC9eaHR0cHMvKSA/IFwid3NzXCIgOiBcIndzXCIgfVxuXG4gIC8qKlxuICAgKiBUaGUgZnVsbHkgcXVhbGlmaWVkIHNvY2tldCB1cmxcbiAgICpcbiAgICogQHJldHVybnMge3N0cmluZ31cbiAgICovXG4gIGVuZFBvaW50VVJMKCl7XG4gICAgbGV0IHVyaSA9IEFqYXguYXBwZW5kUGFyYW1zKFxuICAgICAgQWpheC5hcHBlbmRQYXJhbXModGhpcy5lbmRQb2ludCwgdGhpcy5wYXJhbXMoKSksIHt2c246IHRoaXMudnNufSlcbiAgICBpZih1cmkuY2hhckF0KDApICE9PSBcIi9cIil7IHJldHVybiB1cmkgfVxuICAgIGlmKHVyaS5jaGFyQXQoMSkgPT09IFwiL1wiKXsgcmV0dXJuIGAke3RoaXMucHJvdG9jb2woKX06JHt1cml9YCB9XG5cbiAgICByZXR1cm4gYCR7dGhpcy5wcm90b2NvbCgpfTovLyR7bG9jYXRpb24uaG9zdH0ke3VyaX1gXG4gIH1cblxuICAvKipcbiAgICogRGlzY29ubmVjdHMgdGhlIHNvY2tldFxuICAgKlxuICAgKiBTZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0Nsb3NlRXZlbnQjU3RhdHVzX2NvZGVzIGZvciB2YWxpZCBzdGF0dXMgY29kZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gT3B0aW9uYWwgY2FsbGJhY2sgd2hpY2ggaXMgY2FsbGVkIGFmdGVyIHNvY2tldCBpcyBkaXNjb25uZWN0ZWQuXG4gICAqIEBwYXJhbSB7aW50ZWdlcn0gY29kZSAtIEEgc3RhdHVzIGNvZGUgZm9yIGRpc2Nvbm5lY3Rpb24gKE9wdGlvbmFsKS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHJlYXNvbiAtIEEgdGV4dHVhbCBkZXNjcmlwdGlvbiBvZiB0aGUgcmVhc29uIHRvIGRpc2Nvbm5lY3QuIChPcHRpb25hbClcbiAgICovXG4gIGRpc2Nvbm5lY3QoY2FsbGJhY2ssIGNvZGUsIHJlYXNvbil7XG4gICAgdGhpcy5jb25uZWN0Q2xvY2srK1xuICAgIHRoaXMuY2xvc2VXYXNDbGVhbiA9IHRydWVcbiAgICB0aGlzLnJlY29ubmVjdFRpbWVyLnJlc2V0KClcbiAgICB0aGlzLnRlYXJkb3duKGNhbGxiYWNrLCBjb2RlLCByZWFzb24pXG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtcyAtIFRoZSBwYXJhbXMgdG8gc2VuZCB3aGVuIGNvbm5lY3RpbmcsIGZvciBleGFtcGxlIGB7dXNlcl9pZDogdXNlclRva2VufWBcbiAgICpcbiAgICogUGFzc2luZyBwYXJhbXMgdG8gY29ubmVjdCBpcyBkZXByZWNhdGVkOyBwYXNzIHRoZW0gaW4gdGhlIFNvY2tldCBjb25zdHJ1Y3RvciBpbnN0ZWFkOlxuICAgKiBgbmV3IFNvY2tldChcIi9zb2NrZXRcIiwge3BhcmFtczoge3VzZXJfaWQ6IHVzZXJUb2tlbn19KWAuXG4gICAqL1xuICBjb25uZWN0KHBhcmFtcyl7XG4gICAgaWYocGFyYW1zKXtcbiAgICAgIGNvbnNvbGUgJiYgY29uc29sZS5sb2coXCJwYXNzaW5nIHBhcmFtcyB0byBjb25uZWN0IGlzIGRlcHJlY2F0ZWQuIEluc3RlYWQgcGFzcyA6cGFyYW1zIHRvIHRoZSBTb2NrZXQgY29uc3RydWN0b3JcIilcbiAgICAgIHRoaXMucGFyYW1zID0gY2xvc3VyZShwYXJhbXMpXG4gICAgfVxuICAgIGlmKHRoaXMuY29ubil7IHJldHVybiB9XG5cbiAgICB0aGlzLmNvbm5lY3RDbG9jaysrXG4gICAgdGhpcy5jbG9zZVdhc0NsZWFuID0gZmFsc2VcbiAgICB0aGlzLmNvbm4gPSBuZXcgdGhpcy50cmFuc3BvcnQodGhpcy5lbmRQb2ludFVSTCgpKVxuICAgIHRoaXMuY29ubi5iaW5hcnlUeXBlID0gdGhpcy5iaW5hcnlUeXBlXG4gICAgdGhpcy5jb25uLnRpbWVvdXQgPSB0aGlzLmxvbmdwb2xsZXJUaW1lb3V0XG4gICAgdGhpcy5jb25uLm9ub3BlbiA9ICgpID0+IHRoaXMub25Db25uT3BlbigpXG4gICAgdGhpcy5jb25uLm9uZXJyb3IgPSBlcnJvciA9PiB0aGlzLm9uQ29ubkVycm9yKGVycm9yKVxuICAgIHRoaXMuY29ubi5vbm1lc3NhZ2UgPSBldmVudCA9PiB0aGlzLm9uQ29ubk1lc3NhZ2UoZXZlbnQpXG4gICAgdGhpcy5jb25uLm9uY2xvc2UgPSBldmVudCA9PiB0aGlzLm9uQ29ubkNsb3NlKGV2ZW50KVxuICB9XG5cbiAgLyoqXG4gICAqIExvZ3MgdGhlIG1lc3NhZ2UuIE92ZXJyaWRlIGB0aGlzLmxvZ2dlcmAgZm9yIHNwZWNpYWxpemVkIGxvZ2dpbmcuIG5vb3BzIGJ5IGRlZmF1bHRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGtpbmRcbiAgICogQHBhcmFtIHtzdHJpbmd9IG1zZ1xuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICAgKi9cbiAgbG9nKGtpbmQsIG1zZywgZGF0YSl7IHRoaXMubG9nZ2VyKGtpbmQsIG1zZywgZGF0YSkgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRydWUgaWYgYSBsb2dnZXIgaGFzIGJlZW4gc2V0IG9uIHRoaXMgc29ja2V0LlxuICAgKi9cbiAgaGFzTG9nZ2VyKCl7IHJldHVybiB0aGlzLmxvZ2dlciAhPT0gbnVsbCB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBjYWxsYmFja3MgZm9yIGNvbm5lY3Rpb24gb3BlbiBldmVudHNcbiAgICpcbiAgICogQGV4YW1wbGUgc29ja2V0Lm9uT3BlbihmdW5jdGlvbigpeyBjb25zb2xlLmluZm8oXCJ0aGUgc29ja2V0IHdhcyBvcGVuZWRcIikgfSlcbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICovXG4gIG9uT3BlbihjYWxsYmFjayl7XG4gICAgbGV0IHJlZiA9IHRoaXMubWFrZVJlZigpXG4gICAgdGhpcy5zdGF0ZUNoYW5nZUNhbGxiYWNrcy5vcGVuLnB1c2goW3JlZiwgY2FsbGJhY2tdKVxuICAgIHJldHVybiByZWZcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgY2FsbGJhY2tzIGZvciBjb25uZWN0aW9uIGNsb3NlIGV2ZW50c1xuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgKi9cbiAgb25DbG9zZShjYWxsYmFjayl7XG4gICAgbGV0IHJlZiA9IHRoaXMubWFrZVJlZigpXG4gICAgdGhpcy5zdGF0ZUNoYW5nZUNhbGxiYWNrcy5jbG9zZS5wdXNoKFtyZWYsIGNhbGxiYWNrXSlcbiAgICByZXR1cm4gcmVmXG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGNhbGxiYWNrcyBmb3IgY29ubmVjdGlvbiBlcnJvciBldmVudHNcbiAgICpcbiAgICogQGV4YW1wbGUgc29ja2V0Lm9uRXJyb3IoZnVuY3Rpb24oZXJyb3IpeyBhbGVydChcIkFuIGVycm9yIG9jY3VycmVkXCIpIH0pXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAqL1xuICBvbkVycm9yKGNhbGxiYWNrKXtcbiAgICBsZXQgcmVmID0gdGhpcy5tYWtlUmVmKClcbiAgICB0aGlzLnN0YXRlQ2hhbmdlQ2FsbGJhY2tzLmVycm9yLnB1c2goW3JlZiwgY2FsbGJhY2tdKVxuICAgIHJldHVybiByZWZcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgY2FsbGJhY2tzIGZvciBjb25uZWN0aW9uIG1lc3NhZ2UgZXZlbnRzXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAqL1xuICBvbk1lc3NhZ2UoY2FsbGJhY2spe1xuICAgIGxldCByZWYgPSB0aGlzLm1ha2VSZWYoKVxuICAgIHRoaXMuc3RhdGVDaGFuZ2VDYWxsYmFja3MubWVzc2FnZS5wdXNoKFtyZWYsIGNhbGxiYWNrXSlcbiAgICByZXR1cm4gcmVmXG4gIH1cblxuICAvKipcbiAgICogUGluZ3MgdGhlIHNlcnZlciBhbmQgaW52b2tlcyB0aGUgY2FsbGJhY2sgd2l0aCB0aGUgUlRUIGluIG1pbGxpc2Vjb25kc1xuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgKlxuICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIHBpbmcgd2FzIHB1c2hlZCBvciBmYWxzZSBpZiB1bmFibGUgdG8gYmUgcHVzaGVkLlxuICAgKi9cbiAgcGluZyhjYWxsYmFjayl7XG4gICAgaWYoIXRoaXMuaXNDb25uZWN0ZWQoKSl7IHJldHVybiBmYWxzZSB9XG4gICAgbGV0IHJlZiA9IHRoaXMubWFrZVJlZigpXG4gICAgbGV0IHN0YXJ0VGltZSA9IERhdGUubm93KClcbiAgICB0aGlzLnB1c2goe3RvcGljOiBcInBob2VuaXhcIiwgZXZlbnQ6IFwiaGVhcnRiZWF0XCIsIHBheWxvYWQ6IHt9LCByZWY6IHJlZn0pXG4gICAgbGV0IG9uTXNnUmVmID0gdGhpcy5vbk1lc3NhZ2UobXNnID0+IHtcbiAgICAgIGlmKG1zZy5yZWYgPT09IHJlZil7XG4gICAgICAgIHRoaXMub2ZmKFtvbk1zZ1JlZl0pXG4gICAgICAgIGNhbGxiYWNrKERhdGUubm93KCkgLSBzdGFydFRpbWUpXG4gICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuXG4gIGNsZWFySGVhcnRiZWF0cygpe1xuICAgIGNsZWFyVGltZW91dCh0aGlzLmhlYXJ0YmVhdFRpbWVyKVxuICAgIGNsZWFyVGltZW91dCh0aGlzLmhlYXJ0YmVhdFRpbWVvdXRUaW1lcilcbiAgfVxuXG4gIG9uQ29ubk9wZW4oKXtcbiAgICBpZih0aGlzLmhhc0xvZ2dlcigpKSB0aGlzLmxvZyhcInRyYW5zcG9ydFwiLCBgY29ubmVjdGVkIHRvICR7dGhpcy5lbmRQb2ludFVSTCgpfWApXG4gICAgdGhpcy5jbG9zZVdhc0NsZWFuID0gZmFsc2VcbiAgICB0aGlzLmVzdGFibGlzaGVkQ29ubmVjdGlvbnMrK1xuICAgIHRoaXMuZmx1c2hTZW5kQnVmZmVyKClcbiAgICB0aGlzLnJlY29ubmVjdFRpbWVyLnJlc2V0KClcbiAgICB0aGlzLnJlc2V0SGVhcnRiZWF0KClcbiAgICB0aGlzLnN0YXRlQ2hhbmdlQ2FsbGJhY2tzLm9wZW4uZm9yRWFjaCgoWywgY2FsbGJhY2tdKSA9PiBjYWxsYmFjaygpKVxuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuXG4gIGhlYXJ0YmVhdFRpbWVvdXQoKXtcbiAgICBpZih0aGlzLnBlbmRpbmdIZWFydGJlYXRSZWYpe1xuICAgICAgdGhpcy5wZW5kaW5nSGVhcnRiZWF0UmVmID0gbnVsbFxuICAgICAgaWYodGhpcy5oYXNMb2dnZXIoKSl7IHRoaXMubG9nKFwidHJhbnNwb3J0XCIsIFwiaGVhcnRiZWF0IHRpbWVvdXQuIEF0dGVtcHRpbmcgdG8gcmUtZXN0YWJsaXNoIGNvbm5lY3Rpb25cIikgfVxuICAgICAgdGhpcy50cmlnZ2VyQ2hhbkVycm9yKClcbiAgICAgIHRoaXMuY2xvc2VXYXNDbGVhbiA9IGZhbHNlXG4gICAgICB0aGlzLnRlYXJkb3duKCgpID0+IHRoaXMucmVjb25uZWN0VGltZXIuc2NoZWR1bGVUaW1lb3V0KCksIFdTX0NMT1NFX05PUk1BTCwgXCJoZWFydGJlYXQgdGltZW91dFwiKVxuICAgIH1cbiAgfVxuXG4gIHJlc2V0SGVhcnRiZWF0KCl7XG4gICAgaWYodGhpcy5jb25uICYmIHRoaXMuY29ubi5za2lwSGVhcnRiZWF0KXsgcmV0dXJuIH1cbiAgICB0aGlzLnBlbmRpbmdIZWFydGJlYXRSZWYgPSBudWxsXG4gICAgdGhpcy5jbGVhckhlYXJ0YmVhdHMoKVxuICAgIHRoaXMuaGVhcnRiZWF0VGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHRoaXMuc2VuZEhlYXJ0YmVhdCgpLCB0aGlzLmhlYXJ0YmVhdEludGVydmFsTXMpXG4gIH1cblxuICB0ZWFyZG93bihjYWxsYmFjaywgY29kZSwgcmVhc29uKXtcbiAgICBpZighdGhpcy5jb25uKXtcbiAgICAgIHJldHVybiBjYWxsYmFjayAmJiBjYWxsYmFjaygpXG4gICAgfVxuXG4gICAgdGhpcy53YWl0Rm9yQnVmZmVyRG9uZSgoKSA9PiB7XG4gICAgICBpZih0aGlzLmNvbm4pe1xuICAgICAgICBpZihjb2RlKXsgdGhpcy5jb25uLmNsb3NlKGNvZGUsIHJlYXNvbiB8fCBcIlwiKSB9IGVsc2UgeyB0aGlzLmNvbm4uY2xvc2UoKSB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMud2FpdEZvclNvY2tldENsb3NlZCgoKSA9PiB7XG4gICAgICAgIGlmKHRoaXMuY29ubil7XG4gICAgICAgICAgdGhpcy5jb25uLm9ub3BlbiA9IGZ1bmN0aW9uICgpeyB9IC8vIG5vb3BcbiAgICAgICAgICB0aGlzLmNvbm4ub25lcnJvciA9IGZ1bmN0aW9uICgpeyB9IC8vIG5vb3BcbiAgICAgICAgICB0aGlzLmNvbm4ub25tZXNzYWdlID0gZnVuY3Rpb24gKCl7IH0gLy8gbm9vcFxuICAgICAgICAgIHRoaXMuY29ubi5vbmNsb3NlID0gZnVuY3Rpb24gKCl7IH0gLy8gbm9vcFxuICAgICAgICAgIHRoaXMuY29ubiA9IG51bGxcbiAgICAgICAgfVxuXG4gICAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKClcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIHdhaXRGb3JCdWZmZXJEb25lKGNhbGxiYWNrLCB0cmllcyA9IDEpe1xuICAgIGlmKHRyaWVzID09PSA1IHx8ICF0aGlzLmNvbm4gfHwgIXRoaXMuY29ubi5idWZmZXJlZEFtb3VudCl7XG4gICAgICBjYWxsYmFjaygpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMud2FpdEZvckJ1ZmZlckRvbmUoY2FsbGJhY2ssIHRyaWVzICsgMSlcbiAgICB9LCAxNTAgKiB0cmllcylcbiAgfVxuXG4gIHdhaXRGb3JTb2NrZXRDbG9zZWQoY2FsbGJhY2ssIHRyaWVzID0gMSl7XG4gICAgaWYodHJpZXMgPT09IDUgfHwgIXRoaXMuY29ubiB8fCB0aGlzLmNvbm4ucmVhZHlTdGF0ZSA9PT0gU09DS0VUX1NUQVRFUy5jbG9zZWQpe1xuICAgICAgY2FsbGJhY2soKVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLndhaXRGb3JTb2NrZXRDbG9zZWQoY2FsbGJhY2ssIHRyaWVzICsgMSlcbiAgICB9LCAxNTAgKiB0cmllcylcbiAgfVxuXG4gIG9uQ29ubkNsb3NlKGV2ZW50KXtcbiAgICBsZXQgY2xvc2VDb2RlID0gZXZlbnQgJiYgZXZlbnQuY29kZVxuICAgIGlmKHRoaXMuaGFzTG9nZ2VyKCkpIHRoaXMubG9nKFwidHJhbnNwb3J0XCIsIFwiY2xvc2VcIiwgZXZlbnQpXG4gICAgdGhpcy50cmlnZ2VyQ2hhbkVycm9yKClcbiAgICB0aGlzLmNsZWFySGVhcnRiZWF0cygpXG4gICAgaWYoIXRoaXMuY2xvc2VXYXNDbGVhbiAmJiBjbG9zZUNvZGUgIT09IDEwMDApe1xuICAgICAgdGhpcy5yZWNvbm5lY3RUaW1lci5zY2hlZHVsZVRpbWVvdXQoKVxuICAgIH1cbiAgICB0aGlzLnN0YXRlQ2hhbmdlQ2FsbGJhY2tzLmNsb3NlLmZvckVhY2goKFssIGNhbGxiYWNrXSkgPT4gY2FsbGJhY2soZXZlbnQpKVxuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBvbkNvbm5FcnJvcihlcnJvcil7XG4gICAgaWYodGhpcy5oYXNMb2dnZXIoKSkgdGhpcy5sb2coXCJ0cmFuc3BvcnRcIiwgZXJyb3IpXG4gICAgbGV0IHRyYW5zcG9ydEJlZm9yZSA9IHRoaXMudHJhbnNwb3J0XG4gICAgbGV0IGVzdGFibGlzaGVkQmVmb3JlID0gdGhpcy5lc3RhYmxpc2hlZENvbm5lY3Rpb25zXG4gICAgdGhpcy5zdGF0ZUNoYW5nZUNhbGxiYWNrcy5lcnJvci5mb3JFYWNoKChbLCBjYWxsYmFja10pID0+IHtcbiAgICAgIGNhbGxiYWNrKGVycm9yLCB0cmFuc3BvcnRCZWZvcmUsIGVzdGFibGlzaGVkQmVmb3JlKVxuICAgIH0pXG4gICAgaWYodHJhbnNwb3J0QmVmb3JlID09PSB0aGlzLnRyYW5zcG9ydCB8fCBlc3RhYmxpc2hlZEJlZm9yZSA+IDApe1xuICAgICAgdGhpcy50cmlnZ2VyQ2hhbkVycm9yKClcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHRyaWdnZXJDaGFuRXJyb3IoKXtcbiAgICB0aGlzLmNoYW5uZWxzLmZvckVhY2goY2hhbm5lbCA9PiB7XG4gICAgICBpZighKGNoYW5uZWwuaXNFcnJvcmVkKCkgfHwgY2hhbm5lbC5pc0xlYXZpbmcoKSB8fCBjaGFubmVsLmlzQ2xvc2VkKCkpKXtcbiAgICAgICAgY2hhbm5lbC50cmlnZ2VyKENIQU5ORUxfRVZFTlRTLmVycm9yKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogQHJldHVybnMge3N0cmluZ31cbiAgICovXG4gIGNvbm5lY3Rpb25TdGF0ZSgpe1xuICAgIHN3aXRjaCh0aGlzLmNvbm4gJiYgdGhpcy5jb25uLnJlYWR5U3RhdGUpe1xuICAgICAgY2FzZSBTT0NLRVRfU1RBVEVTLmNvbm5lY3Rpbmc6IHJldHVybiBcImNvbm5lY3RpbmdcIlxuICAgICAgY2FzZSBTT0NLRVRfU1RBVEVTLm9wZW46IHJldHVybiBcIm9wZW5cIlxuICAgICAgY2FzZSBTT0NLRVRfU1RBVEVTLmNsb3Npbmc6IHJldHVybiBcImNsb3NpbmdcIlxuICAgICAgZGVmYXVsdDogcmV0dXJuIFwiY2xvc2VkXCJcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICBpc0Nvbm5lY3RlZCgpeyByZXR1cm4gdGhpcy5jb25uZWN0aW9uU3RhdGUoKSA9PT0gXCJvcGVuXCIgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKlxuICAgKiBAcGFyYW0ge0NoYW5uZWx9XG4gICAqL1xuICByZW1vdmUoY2hhbm5lbCl7XG4gICAgdGhpcy5vZmYoY2hhbm5lbC5zdGF0ZUNoYW5nZVJlZnMpXG4gICAgdGhpcy5jaGFubmVscyA9IHRoaXMuY2hhbm5lbHMuZmlsdGVyKGMgPT4gYy5qb2luUmVmKCkgIT09IGNoYW5uZWwuam9pblJlZigpKVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYG9uT3BlbmAsIGBvbkNsb3NlYCwgYG9uRXJyb3IsYCBhbmQgYG9uTWVzc2FnZWAgcmVnaXN0cmF0aW9ucy5cbiAgICpcbiAgICogQHBhcmFtIHtyZWZzfSAtIGxpc3Qgb2YgcmVmcyByZXR1cm5lZCBieSBjYWxscyB0b1xuICAgKiAgICAgICAgICAgICAgICAgYG9uT3BlbmAsIGBvbkNsb3NlYCwgYG9uRXJyb3IsYCBhbmQgYG9uTWVzc2FnZWBcbiAgICovXG4gIG9mZihyZWZzKXtcbiAgICBmb3IobGV0IGtleSBpbiB0aGlzLnN0YXRlQ2hhbmdlQ2FsbGJhY2tzKXtcbiAgICAgIHRoaXMuc3RhdGVDaGFuZ2VDYWxsYmFja3Nba2V5XSA9IHRoaXMuc3RhdGVDaGFuZ2VDYWxsYmFja3Nba2V5XS5maWx0ZXIoKFtyZWZdKSA9PiB7XG4gICAgICAgIHJldHVybiByZWZzLmluZGV4T2YocmVmKSA9PT0gLTFcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYXRlcyBhIG5ldyBjaGFubmVsIGZvciB0aGUgZ2l2ZW4gdG9waWNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjaGFuUGFyYW1zIC0gUGFyYW1ldGVycyBmb3IgdGhlIGNoYW5uZWxcbiAgICogQHJldHVybnMge0NoYW5uZWx9XG4gICAqL1xuICBjaGFubmVsKHRvcGljLCBjaGFuUGFyYW1zID0ge30pe1xuICAgIGxldCBjaGFuID0gbmV3IENoYW5uZWwodG9waWMsIGNoYW5QYXJhbXMsIHRoaXMpXG4gICAgdGhpcy5jaGFubmVscy5wdXNoKGNoYW4pXG4gICAgcmV0dXJuIGNoYW5cbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICAgKi9cbiAgcHVzaChkYXRhKXtcbiAgICBpZih0aGlzLmhhc0xvZ2dlcigpKXtcbiAgICAgIGxldCB7dG9waWMsIGV2ZW50LCBwYXlsb2FkLCByZWYsIGpvaW5fcmVmfSA9IGRhdGFcbiAgICAgIHRoaXMubG9nKFwicHVzaFwiLCBgJHt0b3BpY30gJHtldmVudH0gKCR7am9pbl9yZWZ9LCAke3JlZn0pYCwgcGF5bG9hZClcbiAgICB9XG5cbiAgICBpZih0aGlzLmlzQ29ubmVjdGVkKCkpe1xuICAgICAgdGhpcy5lbmNvZGUoZGF0YSwgcmVzdWx0ID0+IHRoaXMuY29ubi5zZW5kKHJlc3VsdCkpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2VuZEJ1ZmZlci5wdXNoKCgpID0+IHRoaXMuZW5jb2RlKGRhdGEsIHJlc3VsdCA9PiB0aGlzLmNvbm4uc2VuZChyZXN1bHQpKSlcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBuZXh0IG1lc3NhZ2UgcmVmLCBhY2NvdW50aW5nIGZvciBvdmVyZmxvd3NcbiAgICogQHJldHVybnMge3N0cmluZ31cbiAgICovXG4gIG1ha2VSZWYoKXtcbiAgICBsZXQgbmV3UmVmID0gdGhpcy5yZWYgKyAxXG4gICAgaWYobmV3UmVmID09PSB0aGlzLnJlZil7IHRoaXMucmVmID0gMCB9IGVsc2UgeyB0aGlzLnJlZiA9IG5ld1JlZiB9XG5cbiAgICByZXR1cm4gdGhpcy5yZWYudG9TdHJpbmcoKVxuICB9XG5cbiAgc2VuZEhlYXJ0YmVhdCgpe1xuICAgIGlmKHRoaXMucGVuZGluZ0hlYXJ0YmVhdFJlZiAmJiAhdGhpcy5pc0Nvbm5lY3RlZCgpKXsgcmV0dXJuIH1cbiAgICB0aGlzLnBlbmRpbmdIZWFydGJlYXRSZWYgPSB0aGlzLm1ha2VSZWYoKVxuICAgIHRoaXMucHVzaCh7dG9waWM6IFwicGhvZW5peFwiLCBldmVudDogXCJoZWFydGJlYXRcIiwgcGF5bG9hZDoge30sIHJlZjogdGhpcy5wZW5kaW5nSGVhcnRiZWF0UmVmfSlcbiAgICB0aGlzLmhlYXJ0YmVhdFRpbWVvdXRUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4gdGhpcy5oZWFydGJlYXRUaW1lb3V0KCksIHRoaXMuaGVhcnRiZWF0SW50ZXJ2YWxNcylcbiAgfVxuXG4gIGZsdXNoU2VuZEJ1ZmZlcigpe1xuICAgIGlmKHRoaXMuaXNDb25uZWN0ZWQoKSAmJiB0aGlzLnNlbmRCdWZmZXIubGVuZ3RoID4gMCl7XG4gICAgICB0aGlzLnNlbmRCdWZmZXIuZm9yRWFjaChjYWxsYmFjayA9PiBjYWxsYmFjaygpKVxuICAgICAgdGhpcy5zZW5kQnVmZmVyID0gW11cbiAgICB9XG4gIH1cblxuICBvbkNvbm5NZXNzYWdlKHJhd01lc3NhZ2Upe1xuICAgIHRoaXMuZGVjb2RlKHJhd01lc3NhZ2UuZGF0YSwgbXNnID0+IHtcbiAgICAgIGxldCB7dG9waWMsIGV2ZW50LCBwYXlsb2FkLCByZWYsIGpvaW5fcmVmfSA9IG1zZ1xuICAgICAgaWYocmVmICYmIHJlZiA9PT0gdGhpcy5wZW5kaW5nSGVhcnRiZWF0UmVmKXtcbiAgICAgICAgdGhpcy5jbGVhckhlYXJ0YmVhdHMoKVxuICAgICAgICB0aGlzLnBlbmRpbmdIZWFydGJlYXRSZWYgPSBudWxsXG4gICAgICAgIHRoaXMuaGVhcnRiZWF0VGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHRoaXMuc2VuZEhlYXJ0YmVhdCgpLCB0aGlzLmhlYXJ0YmVhdEludGVydmFsTXMpXG4gICAgICB9XG5cbiAgICAgIGlmKHRoaXMuaGFzTG9nZ2VyKCkpIHRoaXMubG9nKFwicmVjZWl2ZVwiLCBgJHtwYXlsb2FkLnN0YXR1cyB8fCBcIlwifSAke3RvcGljfSAke2V2ZW50fSAke3JlZiAmJiBcIihcIiArIHJlZiArIFwiKVwiIHx8IFwiXCJ9YCwgcGF5bG9hZClcblxuICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMuY2hhbm5lbHMubGVuZ3RoOyBpKyspe1xuICAgICAgICBjb25zdCBjaGFubmVsID0gdGhpcy5jaGFubmVsc1tpXVxuICAgICAgICBpZighY2hhbm5lbC5pc01lbWJlcih0b3BpYywgZXZlbnQsIHBheWxvYWQsIGpvaW5fcmVmKSl7IGNvbnRpbnVlIH1cbiAgICAgICAgY2hhbm5lbC50cmlnZ2VyKGV2ZW50LCBwYXlsb2FkLCByZWYsIGpvaW5fcmVmKVxuICAgICAgfVxuXG4gICAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5zdGF0ZUNoYW5nZUNhbGxiYWNrcy5tZXNzYWdlLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgbGV0IFssIGNhbGxiYWNrXSA9IHRoaXMuc3RhdGVDaGFuZ2VDYWxsYmFja3MubWVzc2FnZVtpXVxuICAgICAgICBjYWxsYmFjayhtc2cpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGxlYXZlT3BlblRvcGljKHRvcGljKXtcbiAgICBsZXQgZHVwQ2hhbm5lbCA9IHRoaXMuY2hhbm5lbHMuZmluZChjID0+IGMudG9waWMgPT09IHRvcGljICYmIChjLmlzSm9pbmVkKCkgfHwgYy5pc0pvaW5pbmcoKSkpXG4gICAgaWYoZHVwQ2hhbm5lbCl7XG4gICAgICBpZih0aGlzLmhhc0xvZ2dlcigpKSB0aGlzLmxvZyhcInRyYW5zcG9ydFwiLCBgbGVhdmluZyBkdXBsaWNhdGUgdG9waWMgXCIke3RvcGljfVwiYClcbiAgICAgIGR1cENoYW5uZWwubGVhdmUoKVxuICAgIH1cbiAgfVxufSIsICJcbmV4cG9ydCBjb25zdCBDT05TRUNVVElWRV9SRUxPQURTID0gXCJjb25zZWN1dGl2ZS1yZWxvYWRzXCJcbmV4cG9ydCBjb25zdCBNQVhfUkVMT0FEUyA9IDEwXG5leHBvcnQgY29uc3QgUkVMT0FEX0pJVFRFUl9NSU4gPSA1MDAwXG5leHBvcnQgY29uc3QgUkVMT0FEX0pJVFRFUl9NQVggPSAxMDAwMFxuZXhwb3J0IGNvbnN0IEZBSUxTQUZFX0pJVFRFUiA9IDMwMDAwXG5leHBvcnQgY29uc3QgUEhYX0VWRU5UX0NMQVNTRVMgPSBbXG4gIFwicGh4LWNsaWNrLWxvYWRpbmdcIiwgXCJwaHgtY2hhbmdlLWxvYWRpbmdcIiwgXCJwaHgtc3VibWl0LWxvYWRpbmdcIixcbiAgXCJwaHgta2V5ZG93bi1sb2FkaW5nXCIsIFwicGh4LWtleXVwLWxvYWRpbmdcIiwgXCJwaHgtYmx1ci1sb2FkaW5nXCIsIFwicGh4LWZvY3VzLWxvYWRpbmdcIlxuXVxuZXhwb3J0IGNvbnN0IFBIWF9DT01QT05FTlQgPSBcImRhdGEtcGh4LWNvbXBvbmVudFwiXG5leHBvcnQgY29uc3QgUEhYX0xJVkVfTElOSyA9IFwiZGF0YS1waHgtbGlua1wiXG5leHBvcnQgY29uc3QgUEhYX1RSQUNLX1NUQVRJQyA9IFwidHJhY2stc3RhdGljXCJcbmV4cG9ydCBjb25zdCBQSFhfTElOS19TVEFURSA9IFwiZGF0YS1waHgtbGluay1zdGF0ZVwiXG5leHBvcnQgY29uc3QgUEhYX1JFRiA9IFwiZGF0YS1waHgtcmVmXCJcbmV4cG9ydCBjb25zdCBQSFhfUkVGX1NSQyA9IFwiZGF0YS1waHgtcmVmLXNyY1wiXG5leHBvcnQgY29uc3QgUEhYX1RSQUNLX1VQTE9BRFMgPSBcInRyYWNrLXVwbG9hZHNcIlxuZXhwb3J0IGNvbnN0IFBIWF9VUExPQURfUkVGID0gXCJkYXRhLXBoeC11cGxvYWQtcmVmXCJcbmV4cG9ydCBjb25zdCBQSFhfUFJFRkxJR0hURURfUkVGUyA9IFwiZGF0YS1waHgtcHJlZmxpZ2h0ZWQtcmVmc1wiXG5leHBvcnQgY29uc3QgUEhYX0RPTkVfUkVGUyA9IFwiZGF0YS1waHgtZG9uZS1yZWZzXCJcbmV4cG9ydCBjb25zdCBQSFhfRFJPUF9UQVJHRVQgPSBcImRyb3AtdGFyZ2V0XCJcbmV4cG9ydCBjb25zdCBQSFhfQUNUSVZFX0VOVFJZX1JFRlMgPSBcImRhdGEtcGh4LWFjdGl2ZS1yZWZzXCJcbmV4cG9ydCBjb25zdCBQSFhfTElWRV9GSUxFX1VQREFURUQgPSBcInBoeDpsaXZlLWZpbGU6dXBkYXRlZFwiXG5leHBvcnQgY29uc3QgUEhYX1NLSVAgPSBcImRhdGEtcGh4LXNraXBcIlxuZXhwb3J0IGNvbnN0IFBIWF9QUlVORSA9IFwiZGF0YS1waHgtcHJ1bmVcIlxuZXhwb3J0IGNvbnN0IFBIWF9QQUdFX0xPQURJTkcgPSBcInBhZ2UtbG9hZGluZ1wiXG5leHBvcnQgY29uc3QgUEhYX0NPTk5FQ1RFRF9DTEFTUyA9IFwicGh4LWNvbm5lY3RlZFwiXG5leHBvcnQgY29uc3QgUEhYX0RJU0NPTk5FQ1RFRF9DTEFTUyA9IFwicGh4LWxvYWRpbmdcIlxuZXhwb3J0IGNvbnN0IFBIWF9OT19GRUVEQkFDS19DTEFTUyA9IFwicGh4LW5vLWZlZWRiYWNrXCJcbmV4cG9ydCBjb25zdCBQSFhfRVJST1JfQ0xBU1MgPSBcInBoeC1lcnJvclwiXG5leHBvcnQgY29uc3QgUEhYX1BBUkVOVF9JRCA9IFwiZGF0YS1waHgtcGFyZW50LWlkXCJcbmV4cG9ydCBjb25zdCBQSFhfTUFJTiA9IFwiZGF0YS1waHgtbWFpblwiXG5leHBvcnQgY29uc3QgUEhYX1JPT1RfSUQgPSBcImRhdGEtcGh4LXJvb3QtaWRcIlxuZXhwb3J0IGNvbnN0IFBIWF9UUklHR0VSX0FDVElPTiA9IFwidHJpZ2dlci1hY3Rpb25cIlxuZXhwb3J0IGNvbnN0IFBIWF9GRUVEQkFDS19GT1IgPSBcImZlZWRiYWNrLWZvclwiXG5leHBvcnQgY29uc3QgUEhYX0hBU19GT0NVU0VEID0gXCJwaHgtaGFzLWZvY3VzZWRcIlxuZXhwb3J0IGNvbnN0IEZPQ1VTQUJMRV9JTlBVVFMgPSBbXCJ0ZXh0XCIsIFwidGV4dGFyZWFcIiwgXCJudW1iZXJcIiwgXCJlbWFpbFwiLCBcInBhc3N3b3JkXCIsIFwic2VhcmNoXCIsIFwidGVsXCIsIFwidXJsXCIsIFwiZGF0ZVwiLCBcInRpbWVcIiwgXCJkYXRldGltZS1sb2NhbFwiLCBcImNvbG9yXCIsIFwicmFuZ2VcIl1cbmV4cG9ydCBjb25zdCBDSEVDS0FCTEVfSU5QVVRTID0gW1wiY2hlY2tib3hcIiwgXCJyYWRpb1wiXVxuZXhwb3J0IGNvbnN0IFBIWF9IQVNfU1VCTUlUVEVEID0gXCJwaHgtaGFzLXN1Ym1pdHRlZFwiXG5leHBvcnQgY29uc3QgUEhYX1NFU1NJT04gPSBcImRhdGEtcGh4LXNlc3Npb25cIlxuZXhwb3J0IGNvbnN0IFBIWF9WSUVXX1NFTEVDVE9SID0gYFske1BIWF9TRVNTSU9OfV1gXG5leHBvcnQgY29uc3QgUEhYX1NUSUNLWSA9IFwiZGF0YS1waHgtc3RpY2t5XCJcbmV4cG9ydCBjb25zdCBQSFhfU1RBVElDID0gXCJkYXRhLXBoeC1zdGF0aWNcIlxuZXhwb3J0IGNvbnN0IFBIWF9SRUFET05MWSA9IFwiZGF0YS1waHgtcmVhZG9ubHlcIlxuZXhwb3J0IGNvbnN0IFBIWF9ESVNBQkxFRCA9IFwiZGF0YS1waHgtZGlzYWJsZWRcIlxuZXhwb3J0IGNvbnN0IFBIWF9ESVNBQkxFX1dJVEggPSBcImRpc2FibGUtd2l0aFwiXG5leHBvcnQgY29uc3QgUEhYX0RJU0FCTEVfV0lUSF9SRVNUT1JFID0gXCJkYXRhLXBoeC1kaXNhYmxlLXdpdGgtcmVzdG9yZVwiXG5leHBvcnQgY29uc3QgUEhYX0hPT0sgPSBcImhvb2tcIlxuZXhwb3J0IGNvbnN0IFBIWF9ERUJPVU5DRSA9IFwiZGVib3VuY2VcIlxuZXhwb3J0IGNvbnN0IFBIWF9USFJPVFRMRSA9IFwidGhyb3R0bGVcIlxuZXhwb3J0IGNvbnN0IFBIWF9VUERBVEUgPSBcInVwZGF0ZVwiXG5leHBvcnQgY29uc3QgUEhYX0tFWSA9IFwia2V5XCJcbmV4cG9ydCBjb25zdCBQSFhfUFJJVkFURSA9IFwicGh4UHJpdmF0ZVwiXG5leHBvcnQgY29uc3QgUEhYX0FVVE9fUkVDT1ZFUiA9IFwiYXV0by1yZWNvdmVyXCJcbmV4cG9ydCBjb25zdCBQSFhfTFZfREVCVUcgPSBcInBoeDpsaXZlLXNvY2tldDpkZWJ1Z1wiXG5leHBvcnQgY29uc3QgUEhYX0xWX1BST0ZJTEUgPSBcInBoeDpsaXZlLXNvY2tldDpwcm9maWxpbmdcIlxuZXhwb3J0IGNvbnN0IFBIWF9MVl9MQVRFTkNZX1NJTSA9IFwicGh4OmxpdmUtc29ja2V0OmxhdGVuY3ktc2ltXCJcbmV4cG9ydCBjb25zdCBQSFhfUFJPR1JFU1MgPSBcInByb2dyZXNzXCJcbmV4cG9ydCBjb25zdCBMT0FERVJfVElNRU9VVCA9IDFcbmV4cG9ydCBjb25zdCBCRUZPUkVfVU5MT0FEX0xPQURFUl9USU1FT1VUID0gMjAwXG5leHBvcnQgY29uc3QgQklORElOR19QUkVGSVggPSBcInBoeC1cIlxuZXhwb3J0IGNvbnN0IFBVU0hfVElNRU9VVCA9IDMwMDAwXG5leHBvcnQgY29uc3QgTElOS19IRUFERVIgPSBcIngtcmVxdWVzdGVkLXdpdGhcIlxuZXhwb3J0IGNvbnN0IFJFU1BPTlNFX1VSTF9IRUFERVIgPSBcIngtcmVzcG9uc2UtdXJsXCJcbmV4cG9ydCBjb25zdCBERUJPVU5DRV9UUklHR0VSID0gXCJkZWJvdW5jZS10cmlnZ2VyXCJcbmV4cG9ydCBjb25zdCBUSFJPVFRMRUQgPSBcInRocm90dGxlZFwiXG5leHBvcnQgY29uc3QgREVCT1VOQ0VfUFJFVl9LRVkgPSBcImRlYm91bmNlLXByZXYta2V5XCJcbmV4cG9ydCBjb25zdCBERUZBVUxUUyA9IHtcbiAgZGVib3VuY2U6IDMwMCxcbiAgdGhyb3R0bGU6IDMwMFxufVxuXG4vLyBSZW5kZXJlZFxuZXhwb3J0IGNvbnN0IERZTkFNSUNTID0gXCJkXCJcbmV4cG9ydCBjb25zdCBTVEFUSUMgPSBcInNcIlxuZXhwb3J0IGNvbnN0IENPTVBPTkVOVFMgPSBcImNcIlxuZXhwb3J0IGNvbnN0IEVWRU5UUyA9IFwiZVwiXG5leHBvcnQgY29uc3QgUkVQTFkgPSBcInJcIlxuZXhwb3J0IGNvbnN0IFRJVExFID0gXCJ0XCJcbmV4cG9ydCBjb25zdCBURU1QTEFURVMgPSBcInBcIlxuIiwgImltcG9ydCB7XG4gIGxvZ0Vycm9yXG59IGZyb20gXCIuL3V0aWxzXCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRW50cnlVcGxvYWRlciB7XG4gIGNvbnN0cnVjdG9yKGVudHJ5LCBjaHVua1NpemUsIGxpdmVTb2NrZXQpe1xuICAgIHRoaXMubGl2ZVNvY2tldCA9IGxpdmVTb2NrZXRcbiAgICB0aGlzLmVudHJ5ID0gZW50cnlcbiAgICB0aGlzLm9mZnNldCA9IDBcbiAgICB0aGlzLmNodW5rU2l6ZSA9IGNodW5rU2l6ZVxuICAgIHRoaXMuY2h1bmtUaW1lciA9IG51bGxcbiAgICB0aGlzLnVwbG9hZENoYW5uZWwgPSBsaXZlU29ja2V0LmNoYW5uZWwoYGx2dToke2VudHJ5LnJlZn1gLCB7dG9rZW46IGVudHJ5Lm1ldGFkYXRhKCl9KVxuICB9XG5cbiAgZXJyb3IocmVhc29uKXtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5jaHVua1RpbWVyKVxuICAgIHRoaXMudXBsb2FkQ2hhbm5lbC5sZWF2ZSgpXG4gICAgdGhpcy5lbnRyeS5lcnJvcihyZWFzb24pXG4gIH1cblxuICB1cGxvYWQoKXtcbiAgICB0aGlzLnVwbG9hZENoYW5uZWwub25FcnJvcihyZWFzb24gPT4gdGhpcy5lcnJvcihyZWFzb24pKVxuICAgIHRoaXMudXBsb2FkQ2hhbm5lbC5qb2luKClcbiAgICAgIC5yZWNlaXZlKFwib2tcIiwgX2RhdGEgPT4gdGhpcy5yZWFkTmV4dENodW5rKCkpXG4gICAgICAucmVjZWl2ZShcImVycm9yXCIsIHJlYXNvbiA9PiB0aGlzLmVycm9yKHJlYXNvbikpXG4gIH1cblxuICBpc0RvbmUoKXsgcmV0dXJuIHRoaXMub2Zmc2V0ID49IHRoaXMuZW50cnkuZmlsZS5zaXplIH1cblxuICByZWFkTmV4dENodW5rKCl7XG4gICAgbGV0IHJlYWRlciA9IG5ldyB3aW5kb3cuRmlsZVJlYWRlcigpXG4gICAgbGV0IGJsb2IgPSB0aGlzLmVudHJ5LmZpbGUuc2xpY2UodGhpcy5vZmZzZXQsIHRoaXMuY2h1bmtTaXplICsgdGhpcy5vZmZzZXQpXG4gICAgcmVhZGVyLm9ubG9hZCA9IChlKSA9PiB7XG4gICAgICBpZihlLnRhcmdldC5lcnJvciA9PT0gbnVsbCl7XG4gICAgICAgIHRoaXMub2Zmc2V0ICs9IGUudGFyZ2V0LnJlc3VsdC5ieXRlTGVuZ3RoXG4gICAgICAgIHRoaXMucHVzaENodW5rKGUudGFyZ2V0LnJlc3VsdClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBsb2dFcnJvcihcIlJlYWQgZXJyb3I6IFwiICsgZS50YXJnZXQuZXJyb3IpXG4gICAgICB9XG4gICAgfVxuICAgIHJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlcihibG9iKVxuICB9XG5cbiAgcHVzaENodW5rKGNodW5rKXtcbiAgICBpZighdGhpcy51cGxvYWRDaGFubmVsLmlzSm9pbmVkKCkpeyByZXR1cm4gfVxuICAgIHRoaXMudXBsb2FkQ2hhbm5lbC5wdXNoKFwiY2h1bmtcIiwgY2h1bmspXG4gICAgICAucmVjZWl2ZShcIm9rXCIsICgpID0+IHtcbiAgICAgICAgdGhpcy5lbnRyeS5wcm9ncmVzcygodGhpcy5vZmZzZXQgLyB0aGlzLmVudHJ5LmZpbGUuc2l6ZSkgKiAxMDApXG4gICAgICAgIGlmKCF0aGlzLmlzRG9uZSgpKXtcbiAgICAgICAgICB0aGlzLmNodW5rVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHRoaXMucmVhZE5leHRDaHVuaygpLCB0aGlzLmxpdmVTb2NrZXQuZ2V0TGF0ZW5jeVNpbSgpIHx8IDApXG4gICAgICAgIH1cbiAgICAgIH0pXG4gIH1cbn1cbiIsICJpbXBvcnQge1xuICBQSFhfVklFV19TRUxFQ1RPUlxufSBmcm9tIFwiLi9jb25zdGFudHNcIlxuXG5pbXBvcnQgRW50cnlVcGxvYWRlciBmcm9tIFwiLi9lbnRyeV91cGxvYWRlclwiXG5cbmV4cG9ydCBsZXQgbG9nRXJyb3IgPSAobXNnLCBvYmopID0+IGNvbnNvbGUuZXJyb3IgJiYgY29uc29sZS5lcnJvcihtc2csIG9iailcblxuZXhwb3J0IGxldCBpc0NpZCA9IChjaWQpID0+IHtcbiAgbGV0IHR5cGUgPSB0eXBlb2YoY2lkKVxuICByZXR1cm4gdHlwZSA9PT0gXCJudW1iZXJcIiB8fCAodHlwZSA9PT0gXCJzdHJpbmdcIiAmJiAvXigwfFsxLTldXFxkKikkLy50ZXN0KGNpZCkpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZXRlY3REdXBsaWNhdGVJZHMoKXtcbiAgbGV0IGlkcyA9IG5ldyBTZXQoKVxuICBsZXQgZWxlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiKltpZF1cIilcbiAgZm9yKGxldCBpID0gMCwgbGVuID0gZWxlbXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspe1xuICAgIGlmKGlkcy5oYXMoZWxlbXNbaV0uaWQpKXtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYE11bHRpcGxlIElEcyBkZXRlY3RlZDogJHtlbGVtc1tpXS5pZH0uIEVuc3VyZSB1bmlxdWUgZWxlbWVudCBpZHMuYClcbiAgICB9IGVsc2Uge1xuICAgICAgaWRzLmFkZChlbGVtc1tpXS5pZClcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGxldCBkZWJ1ZyA9ICh2aWV3LCBraW5kLCBtc2csIG9iaikgPT4ge1xuICBpZih2aWV3LmxpdmVTb2NrZXQuaXNEZWJ1Z0VuYWJsZWQoKSl7XG4gICAgY29uc29sZS5sb2coYCR7dmlldy5pZH0gJHtraW5kfTogJHttc2d9IC0gYCwgb2JqKVxuICB9XG59XG5cbi8vIHdyYXBzIHZhbHVlIGluIGNsb3N1cmUgb3IgcmV0dXJucyBjbG9zdXJlXG5leHBvcnQgbGV0IGNsb3N1cmUgPSAodmFsKSA9PiB0eXBlb2YgdmFsID09PSBcImZ1bmN0aW9uXCIgPyB2YWwgOiBmdW5jdGlvbiAoKXsgcmV0dXJuIHZhbCB9XG5cbmV4cG9ydCBsZXQgY2xvbmUgPSAob2JqKSA9PiB7IHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG9iaikpIH1cblxuZXhwb3J0IGxldCBjbG9zZXN0UGh4QmluZGluZyA9IChlbCwgYmluZGluZywgYm9yZGVyRWwpID0+IHtcbiAgZG8ge1xuICAgIGlmKGVsLm1hdGNoZXMoYFske2JpbmRpbmd9XWApKXsgcmV0dXJuIGVsIH1cbiAgICBlbCA9IGVsLnBhcmVudEVsZW1lbnQgfHwgZWwucGFyZW50Tm9kZVxuICB9IHdoaWxlKGVsICE9PSBudWxsICYmIGVsLm5vZGVUeXBlID09PSAxICYmICEoKGJvcmRlckVsICYmIGJvcmRlckVsLmlzU2FtZU5vZGUoZWwpKSB8fCBlbC5tYXRjaGVzKFBIWF9WSUVXX1NFTEVDVE9SKSkpXG4gIHJldHVybiBudWxsXG59XG5cbmV4cG9ydCBsZXQgaXNPYmplY3QgPSAob2JqKSA9PiB7XG4gIHJldHVybiBvYmogIT09IG51bGwgJiYgdHlwZW9mIG9iaiA9PT0gXCJvYmplY3RcIiAmJiAhKG9iaiBpbnN0YW5jZW9mIEFycmF5KVxufVxuXG5leHBvcnQgbGV0IGlzRXF1YWxPYmogPSAob2JqMSwgb2JqMikgPT4gSlNPTi5zdHJpbmdpZnkob2JqMSkgPT09IEpTT04uc3RyaW5naWZ5KG9iajIpXG5cbmV4cG9ydCBsZXQgaXNFbXB0eSA9IChvYmopID0+IHtcbiAgZm9yKGxldCB4IGluIG9iail7IHJldHVybiBmYWxzZSB9XG4gIHJldHVybiB0cnVlXG59XG5cbmV4cG9ydCBsZXQgbWF5YmUgPSAoZWwsIGNhbGxiYWNrKSA9PiBlbCAmJiBjYWxsYmFjayhlbClcblxuZXhwb3J0IGxldCBjaGFubmVsVXBsb2FkZXIgPSBmdW5jdGlvbiAoZW50cmllcywgb25FcnJvciwgcmVzcCwgbGl2ZVNvY2tldCl7XG4gIGVudHJpZXMuZm9yRWFjaChlbnRyeSA9PiB7XG4gICAgbGV0IGVudHJ5VXBsb2FkZXIgPSBuZXcgRW50cnlVcGxvYWRlcihlbnRyeSwgcmVzcC5jb25maWcuY2h1bmtfc2l6ZSwgbGl2ZVNvY2tldClcbiAgICBlbnRyeVVwbG9hZGVyLnVwbG9hZCgpXG4gIH0pXG59XG4iLCAibGV0IEJyb3dzZXIgPSB7XG4gIGNhblB1c2hTdGF0ZSgpeyByZXR1cm4gKHR5cGVvZiAoaGlzdG9yeS5wdXNoU3RhdGUpICE9PSBcInVuZGVmaW5lZFwiKSB9LFxuXG4gIGRyb3BMb2NhbChsb2NhbFN0b3JhZ2UsIG5hbWVzcGFjZSwgc3Via2V5KXtcbiAgICByZXR1cm4gbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0odGhpcy5sb2NhbEtleShuYW1lc3BhY2UsIHN1YmtleSkpXG4gIH0sXG5cbiAgdXBkYXRlTG9jYWwobG9jYWxTdG9yYWdlLCBuYW1lc3BhY2UsIHN1YmtleSwgaW5pdGlhbCwgZnVuYyl7XG4gICAgbGV0IGN1cnJlbnQgPSB0aGlzLmdldExvY2FsKGxvY2FsU3RvcmFnZSwgbmFtZXNwYWNlLCBzdWJrZXkpXG4gICAgbGV0IGtleSA9IHRoaXMubG9jYWxLZXkobmFtZXNwYWNlLCBzdWJrZXkpXG4gICAgbGV0IG5ld1ZhbCA9IGN1cnJlbnQgPT09IG51bGwgPyBpbml0aWFsIDogZnVuYyhjdXJyZW50KVxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkobmV3VmFsKSlcbiAgICByZXR1cm4gbmV3VmFsXG4gIH0sXG5cbiAgZ2V0TG9jYWwobG9jYWxTdG9yYWdlLCBuYW1lc3BhY2UsIHN1YmtleSl7XG4gICAgcmV0dXJuIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5sb2NhbEtleShuYW1lc3BhY2UsIHN1YmtleSkpKVxuICB9LFxuXG4gIHVwZGF0ZUN1cnJlbnRTdGF0ZShjYWxsYmFjayl7XG4gICAgaWYoIXRoaXMuY2FuUHVzaFN0YXRlKCkpeyByZXR1cm4gfVxuICAgIGhpc3RvcnkucmVwbGFjZVN0YXRlKGNhbGxiYWNrKGhpc3Rvcnkuc3RhdGUgfHwge30pLCBcIlwiLCB3aW5kb3cubG9jYXRpb24uaHJlZilcbiAgfSxcblxuICBwdXNoU3RhdGUoa2luZCwgbWV0YSwgdG8pe1xuICAgIGlmKHRoaXMuY2FuUHVzaFN0YXRlKCkpe1xuICAgICAgaWYodG8gIT09IHdpbmRvdy5sb2NhdGlvbi5ocmVmKXtcbiAgICAgICAgaWYobWV0YS50eXBlID09IFwicmVkaXJlY3RcIiAmJiBtZXRhLnNjcm9sbCl7XG4gICAgICAgICAgLy8gSWYgd2UncmUgcmVkaXJlY3Rpbmcgc3RvcmUgdGhlIGN1cnJlbnQgc2Nyb2xsWSBmb3IgdGhlIGN1cnJlbnQgaGlzdG9yeSBzdGF0ZS5cbiAgICAgICAgICBsZXQgY3VycmVudFN0YXRlID0gaGlzdG9yeS5zdGF0ZSB8fCB7fVxuICAgICAgICAgIGN1cnJlbnRTdGF0ZS5zY3JvbGwgPSBtZXRhLnNjcm9sbFxuICAgICAgICAgIGhpc3RvcnkucmVwbGFjZVN0YXRlKGN1cnJlbnRTdGF0ZSwgXCJcIiwgd2luZG93LmxvY2F0aW9uLmhyZWYpXG4gICAgICAgIH1cblxuICAgICAgICBkZWxldGUgbWV0YS5zY3JvbGwgLy8gT25seSBzdG9yZSB0aGUgc2Nyb2xsIGluIHRoZSByZWRpcmVjdCBjYXNlLlxuICAgICAgICBoaXN0b3J5W2tpbmQgKyBcIlN0YXRlXCJdKG1ldGEsIFwiXCIsIHRvIHx8IG51bGwpIC8vIElFIHdpbGwgY29lcmNlIHVuZGVmaW5lZCB0byBzdHJpbmdcbiAgICAgICAgbGV0IGhhc2hFbCA9IHRoaXMuZ2V0SGFzaFRhcmdldEVsKHdpbmRvdy5sb2NhdGlvbi5oYXNoKVxuXG4gICAgICAgIGlmKGhhc2hFbCl7XG4gICAgICAgICAgaGFzaEVsLnNjcm9sbEludG9WaWV3KClcbiAgICAgICAgfSBlbHNlIGlmKG1ldGEudHlwZSA9PT0gXCJyZWRpcmVjdFwiKXtcbiAgICAgICAgICB3aW5kb3cuc2Nyb2xsKDAsIDApXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZWRpcmVjdCh0bylcbiAgICB9XG4gIH0sXG5cbiAgc2V0Q29va2llKG5hbWUsIHZhbHVlKXtcbiAgICBkb2N1bWVudC5jb29raWUgPSBgJHtuYW1lfT0ke3ZhbHVlfWBcbiAgfSxcblxuICBnZXRDb29raWUobmFtZSl7XG4gICAgcmV0dXJuIGRvY3VtZW50LmNvb2tpZS5yZXBsYWNlKG5ldyBSZWdFeHAoYCg/Oig/Ol58Lio7XFxzKikke25hbWV9XFxzKlxcPVxccyooW147XSopLiokKXxeLiokYCksIFwiJDFcIilcbiAgfSxcblxuICByZWRpcmVjdCh0b1VSTCwgZmxhc2gpe1xuICAgIGlmKGZsYXNoKXsgQnJvd3Nlci5zZXRDb29raWUoXCJfX3Bob2VuaXhfZmxhc2hfX1wiLCBmbGFzaCArIFwiOyBtYXgtYWdlPTYwMDAwOyBwYXRoPS9cIikgfVxuICAgIHdpbmRvdy5sb2NhdGlvbiA9IHRvVVJMXG4gIH0sXG5cbiAgbG9jYWxLZXkobmFtZXNwYWNlLCBzdWJrZXkpeyByZXR1cm4gYCR7bmFtZXNwYWNlfS0ke3N1YmtleX1gIH0sXG5cbiAgZ2V0SGFzaFRhcmdldEVsKG1heWJlSGFzaCl7XG4gICAgbGV0IGhhc2ggPSBtYXliZUhhc2gudG9TdHJpbmcoKS5zdWJzdHJpbmcoMSlcbiAgICBpZihoYXNoID09PSBcIlwiKXsgcmV0dXJuIH1cbiAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaGFzaCkgfHwgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgYVtuYW1lPVwiJHtoYXNofVwiXWApXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQnJvd3NlclxuIiwgImltcG9ydCB7XG4gIENIRUNLQUJMRV9JTlBVVFMsXG4gIERFQk9VTkNFX1BSRVZfS0VZLFxuICBERUJPVU5DRV9UUklHR0VSLFxuICBGT0NVU0FCTEVfSU5QVVRTLFxuICBQSFhfQ09NUE9ORU5ULFxuICBQSFhfRVZFTlRfQ0xBU1NFUyxcbiAgUEhYX0hBU19GT0NVU0VELFxuICBQSFhfSEFTX1NVQk1JVFRFRCxcbiAgUEhYX01BSU4sXG4gIFBIWF9OT19GRUVEQkFDS19DTEFTUyxcbiAgUEhYX1BBUkVOVF9JRCxcbiAgUEhYX1BSSVZBVEUsXG4gIFBIWF9SRUYsXG4gIFBIWF9SRUZfU1JDLFxuICBQSFhfUk9PVF9JRCxcbiAgUEhYX1NFU1NJT04sXG4gIFBIWF9TVEFUSUMsXG4gIFBIWF9VUExPQURfUkVGLFxuICBQSFhfVklFV19TRUxFQ1RPUixcbiAgUEhYX1NUSUNLWSxcbiAgVEhST1RUTEVEXG59IGZyb20gXCIuL2NvbnN0YW50c1wiXG5cbmltcG9ydCB7XG4gIGxvZ0Vycm9yXG59IGZyb20gXCIuL3V0aWxzXCJcblxubGV0IERPTSA9IHtcbiAgYnlJZChpZCl7IHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkgfHwgbG9nRXJyb3IoYG5vIGlkIGZvdW5kIGZvciAke2lkfWApIH0sXG5cbiAgcmVtb3ZlQ2xhc3MoZWwsIGNsYXNzTmFtZSl7XG4gICAgZWwuY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpXG4gICAgaWYoZWwuY2xhc3NMaXN0Lmxlbmd0aCA9PT0gMCl7IGVsLnJlbW92ZUF0dHJpYnV0ZShcImNsYXNzXCIpIH1cbiAgfSxcblxuICBhbGwobm9kZSwgcXVlcnksIGNhbGxiYWNrKXtcbiAgICBpZighbm9kZSl7IHJldHVybiBbXSB9XG4gICAgbGV0IGFycmF5ID0gQXJyYXkuZnJvbShub2RlLnF1ZXJ5U2VsZWN0b3JBbGwocXVlcnkpKVxuICAgIHJldHVybiBjYWxsYmFjayA/IGFycmF5LmZvckVhY2goY2FsbGJhY2spIDogYXJyYXlcbiAgfSxcblxuICBjaGlsZE5vZGVMZW5ndGgoaHRtbCl7XG4gICAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRlbXBsYXRlXCIpXG4gICAgdGVtcGxhdGUuaW5uZXJIVE1MID0gaHRtbFxuICAgIHJldHVybiB0ZW1wbGF0ZS5jb250ZW50LmNoaWxkRWxlbWVudENvdW50XG4gIH0sXG5cbiAgaXNVcGxvYWRJbnB1dChlbCl7IHJldHVybiBlbC50eXBlID09PSBcImZpbGVcIiAmJiBlbC5nZXRBdHRyaWJ1dGUoUEhYX1VQTE9BRF9SRUYpICE9PSBudWxsIH0sXG5cbiAgZmluZFVwbG9hZElucHV0cyhub2RlKXsgcmV0dXJuIHRoaXMuYWxsKG5vZGUsIGBpbnB1dFt0eXBlPVwiZmlsZVwiXVske1BIWF9VUExPQURfUkVGfV1gKSB9LFxuXG4gIGZpbmRDb21wb25lbnROb2RlTGlzdChub2RlLCBjaWQpe1xuICAgIHJldHVybiB0aGlzLmZpbHRlcldpdGhpblNhbWVMaXZlVmlldyh0aGlzLmFsbChub2RlLCBgWyR7UEhYX0NPTVBPTkVOVH09XCIke2NpZH1cIl1gKSwgbm9kZSlcbiAgfSxcblxuICBpc1BoeERlc3Ryb3llZChub2RlKXtcbiAgICByZXR1cm4gbm9kZS5pZCAmJiBET00ucHJpdmF0ZShub2RlLCBcImRlc3Ryb3llZFwiKSA/IHRydWUgOiBmYWxzZVxuICB9LFxuXG4gIG1hcmtQaHhDaGlsZERlc3Ryb3llZChlbCl7XG4gICAgaWYodGhpcy5pc1BoeENoaWxkKGVsKSl7IGVsLnNldEF0dHJpYnV0ZShQSFhfU0VTU0lPTiwgXCJcIikgfVxuICAgIHRoaXMucHV0UHJpdmF0ZShlbCwgXCJkZXN0cm95ZWRcIiwgdHJ1ZSlcbiAgfSxcblxuICBmaW5kUGh4Q2hpbGRyZW5JbkZyYWdtZW50KGh0bWwsIHBhcmVudElkKXtcbiAgICBsZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGVtcGxhdGVcIilcbiAgICB0ZW1wbGF0ZS5pbm5lckhUTUwgPSBodG1sXG4gICAgcmV0dXJuIHRoaXMuZmluZFBoeENoaWxkcmVuKHRlbXBsYXRlLmNvbnRlbnQsIHBhcmVudElkKVxuICB9LFxuXG4gIGlzSWdub3JlZChlbCwgcGh4VXBkYXRlKXtcbiAgICByZXR1cm4gKGVsLmdldEF0dHJpYnV0ZShwaHhVcGRhdGUpIHx8IGVsLmdldEF0dHJpYnV0ZShcImRhdGEtcGh4LXVwZGF0ZVwiKSkgPT09IFwiaWdub3JlXCJcbiAgfSxcblxuICBpc1BoeFVwZGF0ZShlbCwgcGh4VXBkYXRlLCB1cGRhdGVUeXBlcyl7XG4gICAgcmV0dXJuIGVsLmdldEF0dHJpYnV0ZSAmJiB1cGRhdGVUeXBlcy5pbmRleE9mKGVsLmdldEF0dHJpYnV0ZShwaHhVcGRhdGUpKSA+PSAwXG4gIH0sXG5cbiAgZmluZFBoeFN0aWNreShlbCl7IHJldHVybiB0aGlzLmFsbChlbCwgYFske1BIWF9TVElDS1l9XWApIH0sXG5cbiAgZmluZFBoeENoaWxkcmVuKGVsLCBwYXJlbnRJZCl7XG4gICAgcmV0dXJuIHRoaXMuYWxsKGVsLCBgJHtQSFhfVklFV19TRUxFQ1RPUn1bJHtQSFhfUEFSRU5UX0lEfT1cIiR7cGFyZW50SWR9XCJdYClcbiAgfSxcblxuICBmaW5kUGFyZW50Q0lEcyhub2RlLCBjaWRzKXtcbiAgICBsZXQgaW5pdGlhbCA9IG5ldyBTZXQoY2lkcylcbiAgICByZXR1cm4gY2lkcy5yZWR1Y2UoKGFjYywgY2lkKSA9PiB7XG4gICAgICBsZXQgc2VsZWN0b3IgPSBgWyR7UEhYX0NPTVBPTkVOVH09XCIke2NpZH1cIl0gWyR7UEhYX0NPTVBPTkVOVH1dYFxuXG4gICAgICB0aGlzLmZpbHRlcldpdGhpblNhbWVMaXZlVmlldyh0aGlzLmFsbChub2RlLCBzZWxlY3RvciksIG5vZGUpXG4gICAgICAgIC5tYXAoZWwgPT4gcGFyc2VJbnQoZWwuZ2V0QXR0cmlidXRlKFBIWF9DT01QT05FTlQpKSlcbiAgICAgICAgLmZvckVhY2goY2hpbGRDSUQgPT4gYWNjLmRlbGV0ZShjaGlsZENJRCkpXG5cbiAgICAgIHJldHVybiBhY2NcbiAgICB9LCBpbml0aWFsKVxuICB9LFxuXG4gIGZpbHRlcldpdGhpblNhbWVMaXZlVmlldyhub2RlcywgcGFyZW50KXtcbiAgICBpZihwYXJlbnQucXVlcnlTZWxlY3RvcihQSFhfVklFV19TRUxFQ1RPUikpe1xuICAgICAgcmV0dXJuIG5vZGVzLmZpbHRlcihlbCA9PiB0aGlzLndpdGhpblNhbWVMaXZlVmlldyhlbCwgcGFyZW50KSlcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG5vZGVzXG4gICAgfVxuICB9LFxuXG4gIHdpdGhpblNhbWVMaXZlVmlldyhub2RlLCBwYXJlbnQpe1xuICAgIHdoaWxlKG5vZGUgPSBub2RlLnBhcmVudE5vZGUpe1xuICAgICAgaWYobm9kZS5pc1NhbWVOb2RlKHBhcmVudCkpeyByZXR1cm4gdHJ1ZSB9XG4gICAgICBpZihub2RlLmdldEF0dHJpYnV0ZShQSFhfU0VTU0lPTikgIT09IG51bGwpeyByZXR1cm4gZmFsc2UgfVxuICAgIH1cbiAgfSxcblxuICBwcml2YXRlKGVsLCBrZXkpeyByZXR1cm4gZWxbUEhYX1BSSVZBVEVdICYmIGVsW1BIWF9QUklWQVRFXVtrZXldIH0sXG5cbiAgZGVsZXRlUHJpdmF0ZShlbCwga2V5KXsgZWxbUEhYX1BSSVZBVEVdICYmIGRlbGV0ZSAoZWxbUEhYX1BSSVZBVEVdW2tleV0pIH0sXG5cbiAgcHV0UHJpdmF0ZShlbCwga2V5LCB2YWx1ZSl7XG4gICAgaWYoIWVsW1BIWF9QUklWQVRFXSl7IGVsW1BIWF9QUklWQVRFXSA9IHt9IH1cbiAgICBlbFtQSFhfUFJJVkFURV1ba2V5XSA9IHZhbHVlXG4gIH0sXG5cbiAgdXBkYXRlUHJpdmF0ZShlbCwga2V5LCBkZWZhdWx0VmFsLCB1cGRhdGVGdW5jKXtcbiAgICBsZXQgZXhpc3RpbmcgPSB0aGlzLnByaXZhdGUoZWwsIGtleSlcbiAgICBpZihleGlzdGluZyA9PT0gdW5kZWZpbmVkKXtcbiAgICAgIHRoaXMucHV0UHJpdmF0ZShlbCwga2V5LCB1cGRhdGVGdW5jKGRlZmF1bHRWYWwpKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnB1dFByaXZhdGUoZWwsIGtleSwgdXBkYXRlRnVuYyhleGlzdGluZykpXG4gICAgfVxuICB9LFxuXG4gIGNvcHlQcml2YXRlcyh0YXJnZXQsIHNvdXJjZSl7XG4gICAgaWYoc291cmNlW1BIWF9QUklWQVRFXSl7XG4gICAgICB0YXJnZXRbUEhYX1BSSVZBVEVdID0gc291cmNlW1BIWF9QUklWQVRFXVxuICAgIH1cbiAgfSxcblxuICBwdXRUaXRsZShzdHIpe1xuICAgIGxldCB0aXRsZUVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcInRpdGxlXCIpXG4gICAgbGV0IHtwcmVmaXgsIHN1ZmZpeH0gPSB0aXRsZUVsLmRhdGFzZXRcbiAgICBkb2N1bWVudC50aXRsZSA9IGAke3ByZWZpeCB8fCBcIlwifSR7c3RyfSR7c3VmZml4IHx8IFwiXCJ9YFxuICB9LFxuXG4gIGRlYm91bmNlKGVsLCBldmVudCwgcGh4RGVib3VuY2UsIGRlZmF1bHREZWJvdW5jZSwgcGh4VGhyb3R0bGUsIGRlZmF1bHRUaHJvdHRsZSwgYXN5bmNGaWx0ZXIsIGNhbGxiYWNrKXtcbiAgICBsZXQgZGVib3VuY2UgPSBlbC5nZXRBdHRyaWJ1dGUocGh4RGVib3VuY2UpXG4gICAgbGV0IHRocm90dGxlID0gZWwuZ2V0QXR0cmlidXRlKHBoeFRocm90dGxlKVxuICAgIGlmKGRlYm91bmNlID09PSBcIlwiKXsgZGVib3VuY2UgPSBkZWZhdWx0RGVib3VuY2UgfVxuICAgIGlmKHRocm90dGxlID09PSBcIlwiKXsgdGhyb3R0bGUgPSBkZWZhdWx0VGhyb3R0bGUgfVxuICAgIGxldCB2YWx1ZSA9IGRlYm91bmNlIHx8IHRocm90dGxlXG4gICAgc3dpdGNoKHZhbHVlKXtcbiAgICAgIGNhc2UgbnVsbDogcmV0dXJuIGNhbGxiYWNrKClcblxuICAgICAgY2FzZSBcImJsdXJcIjpcbiAgICAgICAgaWYodGhpcy5vbmNlKGVsLCBcImRlYm91bmNlLWJsdXJcIikpe1xuICAgICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoXCJibHVyXCIsICgpID0+IGNhbGxiYWNrKCkpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGxldCB0aW1lb3V0ID0gcGFyc2VJbnQodmFsdWUpXG4gICAgICAgIGxldCB0cmlnZ2VyID0gKCkgPT4gdGhyb3R0bGUgPyB0aGlzLmRlbGV0ZVByaXZhdGUoZWwsIFRIUk9UVExFRCkgOiBjYWxsYmFjaygpXG4gICAgICAgIGxldCBjdXJyZW50Q3ljbGUgPSB0aGlzLmluY0N5Y2xlKGVsLCBERUJPVU5DRV9UUklHR0VSLCB0cmlnZ2VyKVxuICAgICAgICBpZihpc05hTih0aW1lb3V0KSl7IHJldHVybiBsb2dFcnJvcihgaW52YWxpZCB0aHJvdHRsZS9kZWJvdW5jZSB2YWx1ZTogJHt2YWx1ZX1gKSB9XG4gICAgICAgIGlmKHRocm90dGxlKXtcbiAgICAgICAgICBsZXQgbmV3S2V5RG93biA9IGZhbHNlXG4gICAgICAgICAgaWYoZXZlbnQudHlwZSA9PT0gXCJrZXlkb3duXCIpe1xuICAgICAgICAgICAgbGV0IHByZXZLZXkgPSB0aGlzLnByaXZhdGUoZWwsIERFQk9VTkNFX1BSRVZfS0VZKVxuICAgICAgICAgICAgdGhpcy5wdXRQcml2YXRlKGVsLCBERUJPVU5DRV9QUkVWX0tFWSwgZXZlbnQua2V5KVxuICAgICAgICAgICAgbmV3S2V5RG93biA9IHByZXZLZXkgIT09IGV2ZW50LmtleVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmKCFuZXdLZXlEb3duICYmIHRoaXMucHJpdmF0ZShlbCwgVEhST1RUTEVEKSl7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FsbGJhY2soKVxuICAgICAgICAgICAgdGhpcy5wdXRQcml2YXRlKGVsLCBUSFJPVFRMRUQsIHRydWUpXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgaWYoYXN5bmNGaWx0ZXIoKSl7IHRoaXMudHJpZ2dlckN5Y2xlKGVsLCBERUJPVU5DRV9UUklHR0VSKSB9XG4gICAgICAgICAgICB9LCB0aW1lb3V0KVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIGlmKGFzeW5jRmlsdGVyKCkpeyB0aGlzLnRyaWdnZXJDeWNsZShlbCwgREVCT1VOQ0VfVFJJR0dFUiwgY3VycmVudEN5Y2xlKSB9XG4gICAgICAgICAgfSwgdGltZW91dClcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBmb3JtID0gZWwuZm9ybVxuICAgICAgICBpZihmb3JtICYmIHRoaXMub25jZShmb3JtLCBcImJpbmQtZGVib3VuY2VcIikpe1xuICAgICAgICAgIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcihcInN1Ym1pdFwiLCAoKSA9PiB7XG4gICAgICAgICAgICBBcnJheS5mcm9tKChuZXcgRm9ybURhdGEoZm9ybSkpLmVudHJpZXMoKSwgKFtuYW1lXSkgPT4ge1xuICAgICAgICAgICAgICBsZXQgaW5wdXQgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoYFtuYW1lPVwiJHtuYW1lfVwiXWApXG4gICAgICAgICAgICAgIHRoaXMuaW5jQ3ljbGUoaW5wdXQsIERFQk9VTkNFX1RSSUdHRVIpXG4gICAgICAgICAgICAgIHRoaXMuZGVsZXRlUHJpdmF0ZShpbnB1dCwgVEhST1RUTEVEKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIGlmKHRoaXMub25jZShlbCwgXCJiaW5kLWRlYm91bmNlXCIpKXtcbiAgICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKFwiYmx1clwiLCAoKSA9PiB0aGlzLnRyaWdnZXJDeWNsZShlbCwgREVCT1VOQ0VfVFJJR0dFUikpXG4gICAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgdHJpZ2dlckN5Y2xlKGVsLCBrZXksIGN1cnJlbnRDeWNsZSl7XG4gICAgbGV0IFtjeWNsZSwgdHJpZ2dlcl0gPSB0aGlzLnByaXZhdGUoZWwsIGtleSlcbiAgICBpZighY3VycmVudEN5Y2xlKXsgY3VycmVudEN5Y2xlID0gY3ljbGUgfVxuICAgIGlmKGN1cnJlbnRDeWNsZSA9PT0gY3ljbGUpe1xuICAgICAgdGhpcy5pbmNDeWNsZShlbCwga2V5KVxuICAgICAgdHJpZ2dlcigpXG4gICAgfVxuICB9LFxuXG4gIG9uY2UoZWwsIGtleSl7XG4gICAgaWYodGhpcy5wcml2YXRlKGVsLCBrZXkpID09PSB0cnVlKXsgcmV0dXJuIGZhbHNlIH1cbiAgICB0aGlzLnB1dFByaXZhdGUoZWwsIGtleSwgdHJ1ZSlcbiAgICByZXR1cm4gdHJ1ZVxuICB9LFxuXG4gIGluY0N5Y2xlKGVsLCBrZXksIHRyaWdnZXIgPSBmdW5jdGlvbiAoKXsgfSl7XG4gICAgbGV0IFtjdXJyZW50Q3ljbGVdID0gdGhpcy5wcml2YXRlKGVsLCBrZXkpIHx8IFswLCB0cmlnZ2VyXVxuICAgIGN1cnJlbnRDeWNsZSsrXG4gICAgdGhpcy5wdXRQcml2YXRlKGVsLCBrZXksIFtjdXJyZW50Q3ljbGUsIHRyaWdnZXJdKVxuICAgIHJldHVybiBjdXJyZW50Q3ljbGVcbiAgfSxcblxuICBkaXNjYXJkRXJyb3IoY29udGFpbmVyLCBlbCwgcGh4RmVlZGJhY2tGb3Ipe1xuICAgIGxldCBmaWVsZCA9IGVsLmdldEF0dHJpYnV0ZSAmJiBlbC5nZXRBdHRyaWJ1dGUocGh4RmVlZGJhY2tGb3IpXG4gICAgLy8gVE9ETzogUmVtb3ZlIGlkIGxvb2t1cCBhZnRlciB3ZSB1cGRhdGUgUGhvZW5peCB0byB1c2UgaW5wdXRfbmFtZSBpbnN0ZWFkIG9mIGlucHV0X2lkXG4gICAgbGV0IGlucHV0ID0gZmllbGQgJiYgY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoYFtpZD1cIiR7ZmllbGR9XCJdLCBbbmFtZT1cIiR7ZmllbGR9XCJdYClcbiAgICBpZighaW5wdXQpeyByZXR1cm4gfVxuXG4gICAgaWYoISh0aGlzLnByaXZhdGUoaW5wdXQsIFBIWF9IQVNfRk9DVVNFRCkgfHwgdGhpcy5wcml2YXRlKGlucHV0LmZvcm0sIFBIWF9IQVNfU1VCTUlUVEVEKSkpe1xuICAgICAgZWwuY2xhc3NMaXN0LmFkZChQSFhfTk9fRkVFREJBQ0tfQ0xBU1MpXG4gICAgfVxuICB9LFxuXG4gIHNob3dFcnJvcihpbnB1dEVsLCBwaHhGZWVkYmFja0Zvcil7XG4gICAgaWYoaW5wdXRFbC5pZCB8fCBpbnB1dEVsLm5hbWUpe1xuICAgICAgdGhpcy5hbGwoaW5wdXRFbC5mb3JtLCBgWyR7cGh4RmVlZGJhY2tGb3J9PVwiJHtpbnB1dEVsLmlkfVwiXSwgWyR7cGh4RmVlZGJhY2tGb3J9PVwiJHtpbnB1dEVsLm5hbWV9XCJdYCwgKGVsKSA9PiB7XG4gICAgICAgIHRoaXMucmVtb3ZlQ2xhc3MoZWwsIFBIWF9OT19GRUVEQkFDS19DTEFTUylcbiAgICAgIH0pXG4gICAgfVxuICB9LFxuXG4gIGlzUGh4Q2hpbGQobm9kZSl7XG4gICAgcmV0dXJuIG5vZGUuZ2V0QXR0cmlidXRlICYmIG5vZGUuZ2V0QXR0cmlidXRlKFBIWF9QQVJFTlRfSUQpXG4gIH0sXG5cbiAgaXNQaHhTdGlja3kobm9kZSl7XG4gICAgcmV0dXJuIG5vZGUuZ2V0QXR0cmlidXRlICYmIG5vZGUuZ2V0QXR0cmlidXRlKFBIWF9TVElDS1kpICE9PSBudWxsXG4gIH0sXG5cbiAgZmlyc3RQaHhDaGlsZChlbCl7XG4gICAgcmV0dXJuIHRoaXMuaXNQaHhDaGlsZChlbCkgPyBlbCA6IHRoaXMuYWxsKGVsLCBgWyR7UEhYX1BBUkVOVF9JRH1dYClbMF1cbiAgfSxcblxuICBkaXNwYXRjaEV2ZW50KHRhcmdldCwgbmFtZSwgb3B0cyA9IHt9KXtcbiAgICBsZXQgYnViYmxlcyA9IG9wdHMuYnViYmxlcyA9PT0gdW5kZWZpbmVkID8gdHJ1ZSA6ICEhb3B0cy5idWJibGVzXG4gICAgbGV0IGV2ZW50T3B0cyA9IHtidWJibGVzOiBidWJibGVzLCBjYW5jZWxhYmxlOiB0cnVlLCBkZXRhaWw6IG9wdHMuZGV0YWlsIHx8IHt9fVxuICAgIGxldCBldmVudCA9IG5hbWUgPT09IFwiY2xpY2tcIiA/IG5ldyBNb3VzZUV2ZW50KFwiY2xpY2tcIiwgZXZlbnRPcHRzKSA6IG5ldyBDdXN0b21FdmVudChuYW1lLCBldmVudE9wdHMpXG4gICAgdGFyZ2V0LmRpc3BhdGNoRXZlbnQoZXZlbnQpXG4gIH0sXG5cbiAgY2xvbmVOb2RlKG5vZGUsIGh0bWwpe1xuICAgIGlmKHR5cGVvZiAoaHRtbCkgPT09IFwidW5kZWZpbmVkXCIpe1xuICAgICAgcmV0dXJuIG5vZGUuY2xvbmVOb2RlKHRydWUpXG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBjbG9uZWQgPSBub2RlLmNsb25lTm9kZShmYWxzZSlcbiAgICAgIGNsb25lZC5pbm5lckhUTUwgPSBodG1sXG4gICAgICByZXR1cm4gY2xvbmVkXG4gICAgfVxuICB9LFxuXG4gIG1lcmdlQXR0cnModGFyZ2V0LCBzb3VyY2UsIG9wdHMgPSB7fSl7XG4gICAgbGV0IGV4Y2x1ZGUgPSBvcHRzLmV4Y2x1ZGUgfHwgW11cbiAgICBsZXQgaXNJZ25vcmVkID0gb3B0cy5pc0lnbm9yZWRcbiAgICBsZXQgc291cmNlQXR0cnMgPSBzb3VyY2UuYXR0cmlidXRlc1xuICAgIGZvcihsZXQgaSA9IHNvdXJjZUF0dHJzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKXtcbiAgICAgIGxldCBuYW1lID0gc291cmNlQXR0cnNbaV0ubmFtZVxuICAgICAgaWYoZXhjbHVkZS5pbmRleE9mKG5hbWUpIDwgMCl7IHRhcmdldC5zZXRBdHRyaWJ1dGUobmFtZSwgc291cmNlLmdldEF0dHJpYnV0ZShuYW1lKSkgfVxuICAgIH1cblxuICAgIGxldCB0YXJnZXRBdHRycyA9IHRhcmdldC5hdHRyaWJ1dGVzXG4gICAgZm9yKGxldCBpID0gdGFyZ2V0QXR0cnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pe1xuICAgICAgbGV0IG5hbWUgPSB0YXJnZXRBdHRyc1tpXS5uYW1lXG4gICAgICBpZihpc0lnbm9yZWQpe1xuICAgICAgICBpZihuYW1lLnN0YXJ0c1dpdGgoXCJkYXRhLVwiKSAmJiAhc291cmNlLmhhc0F0dHJpYnV0ZShuYW1lKSl7IHRhcmdldC5yZW1vdmVBdHRyaWJ1dGUobmFtZSkgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYoIXNvdXJjZS5oYXNBdHRyaWJ1dGUobmFtZSkpeyB0YXJnZXQucmVtb3ZlQXR0cmlidXRlKG5hbWUpIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgbWVyZ2VGb2N1c2VkSW5wdXQodGFyZ2V0LCBzb3VyY2Upe1xuICAgIC8vIHNraXAgc2VsZWN0cyBiZWNhdXNlIEZGIHdpbGwgcmVzZXQgaGlnaGxpZ2h0ZWQgaW5kZXggZm9yIGFueSBzZXRBdHRyaWJ1dGVcbiAgICBpZighKHRhcmdldCBpbnN0YW5jZW9mIEhUTUxTZWxlY3RFbGVtZW50KSl7IERPTS5tZXJnZUF0dHJzKHRhcmdldCwgc291cmNlLCB7ZXhjbHVkZTogW1widmFsdWVcIl19KSB9XG4gICAgaWYoc291cmNlLnJlYWRPbmx5KXtcbiAgICAgIHRhcmdldC5zZXRBdHRyaWJ1dGUoXCJyZWFkb25seVwiLCB0cnVlKVxuICAgIH0gZWxzZSB7XG4gICAgICB0YXJnZXQucmVtb3ZlQXR0cmlidXRlKFwicmVhZG9ubHlcIilcbiAgICB9XG4gIH0sXG5cbiAgaGFzU2VsZWN0aW9uUmFuZ2UoZWwpe1xuICAgIHJldHVybiBlbC5zZXRTZWxlY3Rpb25SYW5nZSAmJiAoZWwudHlwZSA9PT0gXCJ0ZXh0XCIgfHwgZWwudHlwZSA9PT0gXCJ0ZXh0YXJlYVwiKVxuICB9LFxuXG4gIHJlc3RvcmVGb2N1cyhmb2N1c2VkLCBzZWxlY3Rpb25TdGFydCwgc2VsZWN0aW9uRW5kKXtcbiAgICBpZighRE9NLmlzVGV4dHVhbElucHV0KGZvY3VzZWQpKXsgcmV0dXJuIH1cbiAgICBsZXQgd2FzRm9jdXNlZCA9IGZvY3VzZWQubWF0Y2hlcyhcIjpmb2N1c1wiKVxuICAgIGlmKGZvY3VzZWQucmVhZE9ubHkpeyBmb2N1c2VkLmJsdXIoKSB9XG4gICAgaWYoIXdhc0ZvY3VzZWQpeyBmb2N1c2VkLmZvY3VzKCkgfVxuICAgIGlmKHRoaXMuaGFzU2VsZWN0aW9uUmFuZ2UoZm9jdXNlZCkpe1xuICAgICAgZm9jdXNlZC5zZXRTZWxlY3Rpb25SYW5nZShzZWxlY3Rpb25TdGFydCwgc2VsZWN0aW9uRW5kKVxuICAgIH1cbiAgfSxcblxuICBpc0Zvcm1JbnB1dChlbCl7IHJldHVybiAvXig/OmlucHV0fHNlbGVjdHx0ZXh0YXJlYSkkL2kudGVzdChlbC50YWdOYW1lKSAmJiBlbC50eXBlICE9PSBcImJ1dHRvblwiIH0sXG5cbiAgc3luY0F0dHJzVG9Qcm9wcyhlbCl7XG4gICAgaWYoZWwgaW5zdGFuY2VvZiBIVE1MSW5wdXRFbGVtZW50ICYmIENIRUNLQUJMRV9JTlBVVFMuaW5kZXhPZihlbC50eXBlLnRvTG9jYWxlTG93ZXJDYXNlKCkpID49IDApe1xuICAgICAgZWwuY2hlY2tlZCA9IGVsLmdldEF0dHJpYnV0ZShcImNoZWNrZWRcIikgIT09IG51bGxcbiAgICB9XG4gIH0sXG5cbiAgaXNUZXh0dWFsSW5wdXQoZWwpeyByZXR1cm4gRk9DVVNBQkxFX0lOUFVUUy5pbmRleE9mKGVsLnR5cGUpID49IDAgfSxcblxuICBpc05vd1RyaWdnZXJGb3JtRXh0ZXJuYWwoZWwsIHBoeFRyaWdnZXJFeHRlcm5hbCl7XG4gICAgcmV0dXJuIGVsLmdldEF0dHJpYnV0ZSAmJiBlbC5nZXRBdHRyaWJ1dGUocGh4VHJpZ2dlckV4dGVybmFsKSAhPT0gbnVsbFxuICB9LFxuXG4gIHN5bmNQZW5kaW5nUmVmKGZyb21FbCwgdG9FbCwgZGlzYWJsZVdpdGgpe1xuICAgIGxldCByZWYgPSBmcm9tRWwuZ2V0QXR0cmlidXRlKFBIWF9SRUYpXG4gICAgaWYocmVmID09PSBudWxsKXsgcmV0dXJuIHRydWUgfVxuICAgIGxldCByZWZTcmMgPSBmcm9tRWwuZ2V0QXR0cmlidXRlKFBIWF9SRUZfU1JDKVxuXG4gICAgaWYoRE9NLmlzRm9ybUlucHV0KGZyb21FbCkgfHwgZnJvbUVsLmdldEF0dHJpYnV0ZShkaXNhYmxlV2l0aCkgIT09IG51bGwpe1xuICAgICAgaWYoRE9NLmlzVXBsb2FkSW5wdXQoZnJvbUVsKSl7IERPTS5tZXJnZUF0dHJzKGZyb21FbCwgdG9FbCwge2lzSWdub3JlZDogdHJ1ZX0pIH1cbiAgICAgIERPTS5wdXRQcml2YXRlKGZyb21FbCwgUEhYX1JFRiwgdG9FbClcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH0gZWxzZSB7XG4gICAgICBQSFhfRVZFTlRfQ0xBU1NFUy5mb3JFYWNoKGNsYXNzTmFtZSA9PiB7XG4gICAgICAgIGZyb21FbC5jbGFzc0xpc3QuY29udGFpbnMoY2xhc3NOYW1lKSAmJiB0b0VsLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKVxuICAgICAgfSlcbiAgICAgIHRvRWwuc2V0QXR0cmlidXRlKFBIWF9SRUYsIHJlZilcbiAgICAgIHRvRWwuc2V0QXR0cmlidXRlKFBIWF9SRUZfU1JDLCByZWZTcmMpXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgfSxcblxuICBjbGVhbkNoaWxkTm9kZXMoY29udGFpbmVyLCBwaHhVcGRhdGUpe1xuICAgIGlmKERPTS5pc1BoeFVwZGF0ZShjb250YWluZXIsIHBoeFVwZGF0ZSwgW1wiYXBwZW5kXCIsIFwicHJlcGVuZFwiXSkpe1xuICAgICAgbGV0IHRvUmVtb3ZlID0gW11cbiAgICAgIGNvbnRhaW5lci5jaGlsZE5vZGVzLmZvckVhY2goY2hpbGROb2RlID0+IHtcbiAgICAgICAgaWYoIWNoaWxkTm9kZS5pZCl7XG4gICAgICAgICAgLy8gU2tpcCB3YXJuaW5nIGlmIGl0J3MgYW4gZW1wdHkgdGV4dCBub2RlIChlLmcuIGEgbmV3LWxpbmUpXG4gICAgICAgICAgbGV0IGlzRW1wdHlUZXh0Tm9kZSA9IGNoaWxkTm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUgJiYgY2hpbGROb2RlLm5vZGVWYWx1ZS50cmltKCkgPT09IFwiXCJcbiAgICAgICAgICBpZighaXNFbXB0eVRleHROb2RlKXtcbiAgICAgICAgICAgIGxvZ0Vycm9yKFwib25seSBIVE1MIGVsZW1lbnQgdGFncyB3aXRoIGFuIGlkIGFyZSBhbGxvd2VkIGluc2lkZSBjb250YWluZXJzIHdpdGggcGh4LXVwZGF0ZS5cXG5cXG5cIiArXG4gICAgICAgICAgICAgIGByZW1vdmluZyBpbGxlZ2FsIG5vZGU6IFwiJHsoY2hpbGROb2RlLm91dGVySFRNTCB8fCBjaGlsZE5vZGUubm9kZVZhbHVlKS50cmltKCl9XCJcXG5cXG5gKVxuICAgICAgICAgIH1cbiAgICAgICAgICB0b1JlbW92ZS5wdXNoKGNoaWxkTm9kZSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIHRvUmVtb3ZlLmZvckVhY2goY2hpbGROb2RlID0+IGNoaWxkTm9kZS5yZW1vdmUoKSlcbiAgICB9XG4gIH0sXG5cbiAgcmVwbGFjZVJvb3RDb250YWluZXIoY29udGFpbmVyLCB0YWdOYW1lLCBhdHRycyl7XG4gICAgbGV0IHJldGFpbmVkQXR0cnMgPSBuZXcgU2V0KFtcImlkXCIsIFBIWF9TRVNTSU9OLCBQSFhfU1RBVElDLCBQSFhfTUFJTiwgUEhYX1JPT1RfSURdKVxuICAgIGlmKGNvbnRhaW5lci50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09IHRhZ05hbWUudG9Mb3dlckNhc2UoKSl7XG4gICAgICBBcnJheS5mcm9tKGNvbnRhaW5lci5hdHRyaWJ1dGVzKVxuICAgICAgICAuZmlsdGVyKGF0dHIgPT4gIXJldGFpbmVkQXR0cnMuaGFzKGF0dHIubmFtZS50b0xvd2VyQ2FzZSgpKSlcbiAgICAgICAgLmZvckVhY2goYXR0ciA9PiBjb250YWluZXIucmVtb3ZlQXR0cmlidXRlKGF0dHIubmFtZSkpXG5cbiAgICAgIE9iamVjdC5rZXlzKGF0dHJzKVxuICAgICAgICAuZmlsdGVyKG5hbWUgPT4gIXJldGFpbmVkQXR0cnMuaGFzKG5hbWUudG9Mb3dlckNhc2UoKSkpXG4gICAgICAgIC5mb3JFYWNoKGF0dHIgPT4gY29udGFpbmVyLnNldEF0dHJpYnV0ZShhdHRyLCBhdHRyc1thdHRyXSkpXG5cbiAgICAgIHJldHVybiBjb250YWluZXJcblxuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgbmV3Q29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWdOYW1lKVxuICAgICAgT2JqZWN0LmtleXMoYXR0cnMpLmZvckVhY2goYXR0ciA9PiBuZXdDb250YWluZXIuc2V0QXR0cmlidXRlKGF0dHIsIGF0dHJzW2F0dHJdKSlcbiAgICAgIHJldGFpbmVkQXR0cnMuZm9yRWFjaChhdHRyID0+IG5ld0NvbnRhaW5lci5zZXRBdHRyaWJ1dGUoYXR0ciwgY29udGFpbmVyLmdldEF0dHJpYnV0ZShhdHRyKSkpXG4gICAgICBuZXdDb250YWluZXIuaW5uZXJIVE1MID0gY29udGFpbmVyLmlubmVySFRNTFxuICAgICAgY29udGFpbmVyLnJlcGxhY2VXaXRoKG5ld0NvbnRhaW5lcilcbiAgICAgIHJldHVybiBuZXdDb250YWluZXJcbiAgICB9XG4gIH0sXG5cbiAgZ2V0U3RpY2t5KGVsLCBuYW1lLCBkZWZhdWx0VmFsKXtcbiAgICBsZXQgb3AgPSAoRE9NLnByaXZhdGUoZWwsIFwic3RpY2t5XCIpIHx8IFtdKS5maW5kKChbZXhpc3RpbmdOYW1lLCBdKSA9PiBuYW1lID09PSBleGlzdGluZ05hbWUpXG4gICAgaWYob3Ape1xuICAgICAgbGV0IFtfbmFtZSwgX29wLCBzdGFzaGVkUmVzdWx0XSA9IG9wXG4gICAgICByZXR1cm4gc3Rhc2hlZFJlc3VsdFxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdHlwZW9mKGRlZmF1bHRWYWwpID09PSBcImZ1bmN0aW9uXCIgPyBkZWZhdWx0VmFsKCkgOiBkZWZhdWx0VmFsXG4gICAgfVxuICB9LFxuXG4gIGRlbGV0ZVN0aWNreShlbCwgbmFtZSl7XG4gICAgdGhpcy51cGRhdGVQcml2YXRlKGVsLCBcInN0aWNreVwiLCBbXSwgb3BzID0+IHtcbiAgICAgIHJldHVybiBvcHMuZmlsdGVyKChbZXhpc3RpbmdOYW1lLCBfXSkgPT4gZXhpc3RpbmdOYW1lICE9PSBuYW1lKVxuICAgIH0pXG4gIH0sXG5cbiAgcHV0U3RpY2t5KGVsLCBuYW1lLCBvcCl7XG4gICAgbGV0IHN0YXNoZWRSZXN1bHQgPSBvcChlbClcbiAgICB0aGlzLnVwZGF0ZVByaXZhdGUoZWwsIFwic3RpY2t5XCIsIFtdLCBvcHMgPT4ge1xuICAgICAgbGV0IGV4aXN0aW5nSW5kZXggPSBvcHMuZmluZEluZGV4KChbZXhpc3RpbmdOYW1lLCBdKSA9PiBuYW1lID09PSBleGlzdGluZ05hbWUpXG4gICAgICBpZihleGlzdGluZ0luZGV4ID49IDApe1xuICAgICAgICBvcHNbZXhpc3RpbmdJbmRleF0gPSBbbmFtZSwgb3AsIHN0YXNoZWRSZXN1bHRdXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvcHMucHVzaChbbmFtZSwgb3AsIHN0YXNoZWRSZXN1bHRdKVxuICAgICAgfVxuICAgICAgcmV0dXJuIG9wc1xuICAgIH0pXG4gIH0sXG5cbiAgYXBwbHlTdGlja3lPcGVyYXRpb25zKGVsKXtcbiAgICBsZXQgb3BzID0gRE9NLnByaXZhdGUoZWwsIFwic3RpY2t5XCIpXG4gICAgaWYoIW9wcyl7IHJldHVybiB9XG5cbiAgICBvcHMuZm9yRWFjaCgoW25hbWUsIG9wLCBfc3Rhc2hlZF0pID0+IHRoaXMucHV0U3RpY2t5KGVsLCBuYW1lLCBvcCkpXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRE9NXG4iLCAiaW1wb3J0IHtcbiAgUEhYX0FDVElWRV9FTlRSWV9SRUZTLFxuICBQSFhfTElWRV9GSUxFX1VQREFURUQsXG4gIFBIWF9QUkVGTElHSFRFRF9SRUZTXG59IGZyb20gXCIuL2NvbnN0YW50c1wiXG5cbmltcG9ydCB7XG4gIGNoYW5uZWxVcGxvYWRlcixcbiAgbG9nRXJyb3Jcbn0gZnJvbSBcIi4vdXRpbHNcIlxuXG5pbXBvcnQgTGl2ZVVwbG9hZGVyIGZyb20gXCIuL2xpdmVfdXBsb2FkZXJcIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBVcGxvYWRFbnRyeSB7XG4gIHN0YXRpYyBpc0FjdGl2ZShmaWxlRWwsIGZpbGUpe1xuICAgIGxldCBpc05ldyA9IGZpbGUuX3BoeFJlZiA9PT0gdW5kZWZpbmVkXG4gICAgbGV0IGFjdGl2ZVJlZnMgPSBmaWxlRWwuZ2V0QXR0cmlidXRlKFBIWF9BQ1RJVkVfRU5UUllfUkVGUykuc3BsaXQoXCIsXCIpXG4gICAgbGV0IGlzQWN0aXZlID0gYWN0aXZlUmVmcy5pbmRleE9mKExpdmVVcGxvYWRlci5nZW5GaWxlUmVmKGZpbGUpKSA+PSAwXG4gICAgcmV0dXJuIGZpbGUuc2l6ZSA+IDAgJiYgKGlzTmV3IHx8IGlzQWN0aXZlKVxuICB9XG5cbiAgc3RhdGljIGlzUHJlZmxpZ2h0ZWQoZmlsZUVsLCBmaWxlKXtcbiAgICBsZXQgcHJlZmxpZ2h0ZWRSZWZzID0gZmlsZUVsLmdldEF0dHJpYnV0ZShQSFhfUFJFRkxJR0hURURfUkVGUykuc3BsaXQoXCIsXCIpXG4gICAgbGV0IGlzUHJlZmxpZ2h0ZWQgPSBwcmVmbGlnaHRlZFJlZnMuaW5kZXhPZihMaXZlVXBsb2FkZXIuZ2VuRmlsZVJlZihmaWxlKSkgPj0gMFxuICAgIHJldHVybiBpc1ByZWZsaWdodGVkICYmIHRoaXMuaXNBY3RpdmUoZmlsZUVsLCBmaWxlKVxuICB9XG5cbiAgY29uc3RydWN0b3IoZmlsZUVsLCBmaWxlLCB2aWV3KXtcbiAgICB0aGlzLnJlZiA9IExpdmVVcGxvYWRlci5nZW5GaWxlUmVmKGZpbGUpXG4gICAgdGhpcy5maWxlRWwgPSBmaWxlRWxcbiAgICB0aGlzLmZpbGUgPSBmaWxlXG4gICAgdGhpcy52aWV3ID0gdmlld1xuICAgIHRoaXMubWV0YSA9IG51bGxcbiAgICB0aGlzLl9pc0NhbmNlbGxlZCA9IGZhbHNlXG4gICAgdGhpcy5faXNEb25lID0gZmFsc2VcbiAgICB0aGlzLl9wcm9ncmVzcyA9IDBcbiAgICB0aGlzLl9sYXN0UHJvZ3Jlc3NTZW50ID0gLTFcbiAgICB0aGlzLl9vbkRvbmUgPSBmdW5jdGlvbiAoKXsgfVxuICAgIHRoaXMuX29uRWxVcGRhdGVkID0gdGhpcy5vbkVsVXBkYXRlZC5iaW5kKHRoaXMpXG4gICAgdGhpcy5maWxlRWwuYWRkRXZlbnRMaXN0ZW5lcihQSFhfTElWRV9GSUxFX1VQREFURUQsIHRoaXMuX29uRWxVcGRhdGVkKVxuICB9XG5cbiAgbWV0YWRhdGEoKXsgcmV0dXJuIHRoaXMubWV0YSB9XG5cbiAgcHJvZ3Jlc3MocHJvZ3Jlc3Mpe1xuICAgIHRoaXMuX3Byb2dyZXNzID0gTWF0aC5mbG9vcihwcm9ncmVzcylcbiAgICBpZih0aGlzLl9wcm9ncmVzcyA+IHRoaXMuX2xhc3RQcm9ncmVzc1NlbnQpe1xuICAgICAgaWYodGhpcy5fcHJvZ3Jlc3MgPj0gMTAwKXtcbiAgICAgICAgdGhpcy5fcHJvZ3Jlc3MgPSAxMDBcbiAgICAgICAgdGhpcy5fbGFzdFByb2dyZXNzU2VudCA9IDEwMFxuICAgICAgICB0aGlzLl9pc0RvbmUgPSB0cnVlXG4gICAgICAgIHRoaXMudmlldy5wdXNoRmlsZVByb2dyZXNzKHRoaXMuZmlsZUVsLCB0aGlzLnJlZiwgMTAwLCAoKSA9PiB7XG4gICAgICAgICAgTGl2ZVVwbG9hZGVyLnVudHJhY2tGaWxlKHRoaXMuZmlsZUVsLCB0aGlzLmZpbGUpXG4gICAgICAgICAgdGhpcy5fb25Eb25lKClcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2xhc3RQcm9ncmVzc1NlbnQgPSB0aGlzLl9wcm9ncmVzc1xuICAgICAgICB0aGlzLnZpZXcucHVzaEZpbGVQcm9ncmVzcyh0aGlzLmZpbGVFbCwgdGhpcy5yZWYsIHRoaXMuX3Byb2dyZXNzKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNhbmNlbCgpe1xuICAgIHRoaXMuX2lzQ2FuY2VsbGVkID0gdHJ1ZVxuICAgIHRoaXMuX2lzRG9uZSA9IHRydWVcbiAgICB0aGlzLl9vbkRvbmUoKVxuICB9XG5cbiAgaXNEb25lKCl7IHJldHVybiB0aGlzLl9pc0RvbmUgfVxuXG4gIGVycm9yKHJlYXNvbiA9IFwiZmFpbGVkXCIpe1xuICAgIHRoaXMudmlldy5wdXNoRmlsZVByb2dyZXNzKHRoaXMuZmlsZUVsLCB0aGlzLnJlZiwge2Vycm9yOiByZWFzb259KVxuICAgIExpdmVVcGxvYWRlci5jbGVhckZpbGVzKHRoaXMuZmlsZUVsKVxuICB9XG5cbiAgLy9wcml2YXRlXG5cbiAgb25Eb25lKGNhbGxiYWNrKXtcbiAgICB0aGlzLl9vbkRvbmUgPSAoKSA9PiB7XG4gICAgICB0aGlzLmZpbGVFbC5yZW1vdmVFdmVudExpc3RlbmVyKFBIWF9MSVZFX0ZJTEVfVVBEQVRFRCwgdGhpcy5fb25FbFVwZGF0ZWQpXG4gICAgICBjYWxsYmFjaygpXG4gICAgfVxuICB9XG5cbiAgb25FbFVwZGF0ZWQoKXtcbiAgICBsZXQgYWN0aXZlUmVmcyA9IHRoaXMuZmlsZUVsLmdldEF0dHJpYnV0ZShQSFhfQUNUSVZFX0VOVFJZX1JFRlMpLnNwbGl0KFwiLFwiKVxuICAgIGlmKGFjdGl2ZVJlZnMuaW5kZXhPZih0aGlzLnJlZikgPT09IC0xKXsgdGhpcy5jYW5jZWwoKSB9XG4gIH1cblxuICB0b1ByZWZsaWdodFBheWxvYWQoKXtcbiAgICByZXR1cm4ge1xuICAgICAgbGFzdF9tb2RpZmllZDogdGhpcy5maWxlLmxhc3RNb2RpZmllZCxcbiAgICAgIG5hbWU6IHRoaXMuZmlsZS5uYW1lLFxuICAgICAgc2l6ZTogdGhpcy5maWxlLnNpemUsXG4gICAgICB0eXBlOiB0aGlzLmZpbGUudHlwZSxcbiAgICAgIHJlZjogdGhpcy5yZWZcbiAgICB9XG4gIH1cblxuICB1cGxvYWRlcih1cGxvYWRlcnMpe1xuICAgIGlmKHRoaXMubWV0YS51cGxvYWRlcil7XG4gICAgICBsZXQgY2FsbGJhY2sgPSB1cGxvYWRlcnNbdGhpcy5tZXRhLnVwbG9hZGVyXSB8fCBsb2dFcnJvcihgbm8gdXBsb2FkZXIgY29uZmlndXJlZCBmb3IgJHt0aGlzLm1ldGEudXBsb2FkZXJ9YClcbiAgICAgIHJldHVybiB7bmFtZTogdGhpcy5tZXRhLnVwbG9hZGVyLCBjYWxsYmFjazogY2FsbGJhY2t9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7bmFtZTogXCJjaGFubmVsXCIsIGNhbGxiYWNrOiBjaGFubmVsVXBsb2FkZXJ9XG4gICAgfVxuICB9XG5cbiAgemlwUG9zdEZsaWdodChyZXNwKXtcbiAgICB0aGlzLm1ldGEgPSByZXNwLmVudHJpZXNbdGhpcy5yZWZdXG4gICAgaWYoIXRoaXMubWV0YSl7IGxvZ0Vycm9yKGBubyBwcmVmbGlnaHQgdXBsb2FkIHJlc3BvbnNlIHJldHVybmVkIHdpdGggcmVmICR7dGhpcy5yZWZ9YCwge2lucHV0OiB0aGlzLmZpbGVFbCwgcmVzcG9uc2U6IHJlc3B9KSB9XG4gIH1cbn1cbiIsICJpbXBvcnQge1xuICBQSFhfRE9ORV9SRUZTLFxuICBQSFhfUFJFRkxJR0hURURfUkVGUyxcbiAgUEhYX1VQTE9BRF9SRUZcbn0gZnJvbSBcIi4vY29uc3RhbnRzXCJcblxuaW1wb3J0IHtcbn0gZnJvbSBcIi4vdXRpbHNcIlxuXG5pbXBvcnQgRE9NIGZyb20gXCIuL2RvbVwiXG5pbXBvcnQgVXBsb2FkRW50cnkgZnJvbSBcIi4vdXBsb2FkX2VudHJ5XCJcblxubGV0IGxpdmVVcGxvYWRlckZpbGVSZWYgPSAwXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpdmVVcGxvYWRlciB7XG4gIHN0YXRpYyBnZW5GaWxlUmVmKGZpbGUpe1xuICAgIGxldCByZWYgPSBmaWxlLl9waHhSZWZcbiAgICBpZihyZWYgIT09IHVuZGVmaW5lZCl7XG4gICAgICByZXR1cm4gcmVmXG4gICAgfSBlbHNlIHtcbiAgICAgIGZpbGUuX3BoeFJlZiA9IChsaXZlVXBsb2FkZXJGaWxlUmVmKyspLnRvU3RyaW5nKClcbiAgICAgIHJldHVybiBmaWxlLl9waHhSZWZcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgZ2V0RW50cnlEYXRhVVJMKGlucHV0RWwsIHJlZiwgY2FsbGJhY2spe1xuICAgIGxldCBmaWxlID0gdGhpcy5hY3RpdmVGaWxlcyhpbnB1dEVsKS5maW5kKGZpbGUgPT4gdGhpcy5nZW5GaWxlUmVmKGZpbGUpID09PSByZWYpXG4gICAgY2FsbGJhY2soVVJMLmNyZWF0ZU9iamVjdFVSTChmaWxlKSlcbiAgfVxuXG4gIHN0YXRpYyBoYXNVcGxvYWRzSW5Qcm9ncmVzcyhmb3JtRWwpe1xuICAgIGxldCBhY3RpdmUgPSAwXG4gICAgRE9NLmZpbmRVcGxvYWRJbnB1dHMoZm9ybUVsKS5mb3JFYWNoKGlucHV0ID0+IHtcbiAgICAgIGlmKGlucHV0LmdldEF0dHJpYnV0ZShQSFhfUFJFRkxJR0hURURfUkVGUykgIT09IGlucHV0LmdldEF0dHJpYnV0ZShQSFhfRE9ORV9SRUZTKSl7XG4gICAgICAgIGFjdGl2ZSsrXG4gICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gYWN0aXZlID4gMFxuICB9XG5cbiAgc3RhdGljIHNlcmlhbGl6ZVVwbG9hZHMoaW5wdXRFbCl7XG4gICAgbGV0IGZpbGVzID0gdGhpcy5hY3RpdmVGaWxlcyhpbnB1dEVsKVxuICAgIGxldCBmaWxlRGF0YSA9IHt9XG4gICAgZmlsZXMuZm9yRWFjaChmaWxlID0+IHtcbiAgICAgIGxldCBlbnRyeSA9IHtwYXRoOiBpbnB1dEVsLm5hbWV9XG4gICAgICBsZXQgdXBsb2FkUmVmID0gaW5wdXRFbC5nZXRBdHRyaWJ1dGUoUEhYX1VQTE9BRF9SRUYpXG4gICAgICBmaWxlRGF0YVt1cGxvYWRSZWZdID0gZmlsZURhdGFbdXBsb2FkUmVmXSB8fCBbXVxuICAgICAgZW50cnkucmVmID0gdGhpcy5nZW5GaWxlUmVmKGZpbGUpXG4gICAgICBlbnRyeS5uYW1lID0gZmlsZS5uYW1lIHx8IGVudHJ5LnJlZlxuICAgICAgZW50cnkudHlwZSA9IGZpbGUudHlwZVxuICAgICAgZW50cnkuc2l6ZSA9IGZpbGUuc2l6ZVxuICAgICAgZmlsZURhdGFbdXBsb2FkUmVmXS5wdXNoKGVudHJ5KVxuICAgIH0pXG4gICAgcmV0dXJuIGZpbGVEYXRhXG4gIH1cblxuICBzdGF0aWMgY2xlYXJGaWxlcyhpbnB1dEVsKXtcbiAgICBpbnB1dEVsLnZhbHVlID0gbnVsbFxuICAgIGlucHV0RWwucmVtb3ZlQXR0cmlidXRlKFBIWF9VUExPQURfUkVGKVxuICAgIERPTS5wdXRQcml2YXRlKGlucHV0RWwsIFwiZmlsZXNcIiwgW10pXG4gIH1cblxuICBzdGF0aWMgdW50cmFja0ZpbGUoaW5wdXRFbCwgZmlsZSl7XG4gICAgRE9NLnB1dFByaXZhdGUoaW5wdXRFbCwgXCJmaWxlc1wiLCBET00ucHJpdmF0ZShpbnB1dEVsLCBcImZpbGVzXCIpLmZpbHRlcihmID0+ICFPYmplY3QuaXMoZiwgZmlsZSkpKVxuICB9XG5cbiAgc3RhdGljIHRyYWNrRmlsZXMoaW5wdXRFbCwgZmlsZXMpe1xuICAgIGlmKGlucHV0RWwuZ2V0QXR0cmlidXRlKFwibXVsdGlwbGVcIikgIT09IG51bGwpe1xuICAgICAgbGV0IG5ld0ZpbGVzID0gZmlsZXMuZmlsdGVyKGZpbGUgPT4gIXRoaXMuYWN0aXZlRmlsZXMoaW5wdXRFbCkuZmluZChmID0+IE9iamVjdC5pcyhmLCBmaWxlKSkpXG4gICAgICBET00ucHV0UHJpdmF0ZShpbnB1dEVsLCBcImZpbGVzXCIsIHRoaXMuYWN0aXZlRmlsZXMoaW5wdXRFbCkuY29uY2F0KG5ld0ZpbGVzKSlcbiAgICAgIGlucHV0RWwudmFsdWUgPSBudWxsXG4gICAgfSBlbHNlIHtcbiAgICAgIERPTS5wdXRQcml2YXRlKGlucHV0RWwsIFwiZmlsZXNcIiwgZmlsZXMpXG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGFjdGl2ZUZpbGVJbnB1dHMoZm9ybUVsKXtcbiAgICBsZXQgZmlsZUlucHV0cyA9IERPTS5maW5kVXBsb2FkSW5wdXRzKGZvcm1FbClcbiAgICByZXR1cm4gQXJyYXkuZnJvbShmaWxlSW5wdXRzKS5maWx0ZXIoZWwgPT4gZWwuZmlsZXMgJiYgdGhpcy5hY3RpdmVGaWxlcyhlbCkubGVuZ3RoID4gMClcbiAgfVxuXG4gIHN0YXRpYyBhY3RpdmVGaWxlcyhpbnB1dCl7XG4gICAgcmV0dXJuIChET00ucHJpdmF0ZShpbnB1dCwgXCJmaWxlc1wiKSB8fCBbXSkuZmlsdGVyKGYgPT4gVXBsb2FkRW50cnkuaXNBY3RpdmUoaW5wdXQsIGYpKVxuICB9XG5cbiAgc3RhdGljIGlucHV0c0F3YWl0aW5nUHJlZmxpZ2h0KGZvcm1FbCl7XG4gICAgbGV0IGZpbGVJbnB1dHMgPSBET00uZmluZFVwbG9hZElucHV0cyhmb3JtRWwpXG4gICAgcmV0dXJuIEFycmF5LmZyb20oZmlsZUlucHV0cykuZmlsdGVyKGlucHV0ID0+IHRoaXMuZmlsZXNBd2FpdGluZ1ByZWZsaWdodChpbnB1dCkubGVuZ3RoID4gMClcbiAgfVxuXG4gIHN0YXRpYyBmaWxlc0F3YWl0aW5nUHJlZmxpZ2h0KGlucHV0KXtcbiAgICByZXR1cm4gdGhpcy5hY3RpdmVGaWxlcyhpbnB1dCkuZmlsdGVyKGYgPT4gIVVwbG9hZEVudHJ5LmlzUHJlZmxpZ2h0ZWQoaW5wdXQsIGYpKVxuICB9XG5cbiAgY29uc3RydWN0b3IoaW5wdXRFbCwgdmlldywgb25Db21wbGV0ZSl7XG4gICAgdGhpcy52aWV3ID0gdmlld1xuICAgIHRoaXMub25Db21wbGV0ZSA9IG9uQ29tcGxldGVcbiAgICB0aGlzLl9lbnRyaWVzID1cbiAgICAgIEFycmF5LmZyb20oTGl2ZVVwbG9hZGVyLmZpbGVzQXdhaXRpbmdQcmVmbGlnaHQoaW5wdXRFbCkgfHwgW10pXG4gICAgICAgIC5tYXAoZmlsZSA9PiBuZXcgVXBsb2FkRW50cnkoaW5wdXRFbCwgZmlsZSwgdmlldykpXG5cbiAgICB0aGlzLm51bUVudHJpZXNJblByb2dyZXNzID0gdGhpcy5fZW50cmllcy5sZW5ndGhcbiAgfVxuXG4gIGVudHJpZXMoKXsgcmV0dXJuIHRoaXMuX2VudHJpZXMgfVxuXG4gIGluaXRBZGFwdGVyVXBsb2FkKHJlc3AsIG9uRXJyb3IsIGxpdmVTb2NrZXQpe1xuICAgIHRoaXMuX2VudHJpZXMgPVxuICAgICAgdGhpcy5fZW50cmllcy5tYXAoZW50cnkgPT4ge1xuICAgICAgICBlbnRyeS56aXBQb3N0RmxpZ2h0KHJlc3ApXG4gICAgICAgIGVudHJ5Lm9uRG9uZSgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5udW1FbnRyaWVzSW5Qcm9ncmVzcy0tXG4gICAgICAgICAgaWYodGhpcy5udW1FbnRyaWVzSW5Qcm9ncmVzcyA9PT0gMCl7IHRoaXMub25Db21wbGV0ZSgpIH1cbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIGVudHJ5XG4gICAgICB9KVxuXG4gICAgbGV0IGdyb3VwZWRFbnRyaWVzID0gdGhpcy5fZW50cmllcy5yZWR1Y2UoKGFjYywgZW50cnkpID0+IHtcbiAgICAgIGxldCB7bmFtZSwgY2FsbGJhY2t9ID0gZW50cnkudXBsb2FkZXIobGl2ZVNvY2tldC51cGxvYWRlcnMpXG4gICAgICBhY2NbbmFtZV0gPSBhY2NbbmFtZV0gfHwge2NhbGxiYWNrOiBjYWxsYmFjaywgZW50cmllczogW119XG4gICAgICBhY2NbbmFtZV0uZW50cmllcy5wdXNoKGVudHJ5KVxuICAgICAgcmV0dXJuIGFjY1xuICAgIH0sIHt9KVxuXG4gICAgZm9yKGxldCBuYW1lIGluIGdyb3VwZWRFbnRyaWVzKXtcbiAgICAgIGxldCB7Y2FsbGJhY2ssIGVudHJpZXN9ID0gZ3JvdXBlZEVudHJpZXNbbmFtZV1cbiAgICAgIGNhbGxiYWNrKGVudHJpZXMsIG9uRXJyb3IsIHJlc3AsIGxpdmVTb2NrZXQpXG4gICAgfVxuICB9XG59XG4iLCAiaW1wb3J0IHtcbiAgUEhYX0FDVElWRV9FTlRSWV9SRUZTLFxuICBQSFhfTElWRV9GSUxFX1VQREFURUQsXG4gIFBIWF9QUkVGTElHSFRFRF9SRUZTLFxuICBQSFhfVVBMT0FEX1JFRlxufSBmcm9tIFwiLi9jb25zdGFudHNcIlxuXG5pbXBvcnQgTGl2ZVVwbG9hZGVyIGZyb20gXCIuL2xpdmVfdXBsb2FkZXJcIlxuXG5sZXQgSG9va3MgPSB7XG4gIExpdmVGaWxlVXBsb2FkOiB7XG4gICAgYWN0aXZlUmVmcygpeyByZXR1cm4gdGhpcy5lbC5nZXRBdHRyaWJ1dGUoUEhYX0FDVElWRV9FTlRSWV9SRUZTKSB9LFxuXG4gICAgcHJlZmxpZ2h0ZWRSZWZzKCl7IHJldHVybiB0aGlzLmVsLmdldEF0dHJpYnV0ZShQSFhfUFJFRkxJR0hURURfUkVGUykgfSxcblxuICAgIG1vdW50ZWQoKXsgdGhpcy5wcmVmbGlnaHRlZFdhcyA9IHRoaXMucHJlZmxpZ2h0ZWRSZWZzKCkgfSxcblxuICAgIHVwZGF0ZWQoKXtcbiAgICAgIGxldCBuZXdQcmVmbGlnaHRzID0gdGhpcy5wcmVmbGlnaHRlZFJlZnMoKVxuICAgICAgaWYodGhpcy5wcmVmbGlnaHRlZFdhcyAhPT0gbmV3UHJlZmxpZ2h0cyl7XG4gICAgICAgIHRoaXMucHJlZmxpZ2h0ZWRXYXMgPSBuZXdQcmVmbGlnaHRzXG4gICAgICAgIGlmKG5ld1ByZWZsaWdodHMgPT09IFwiXCIpe1xuICAgICAgICAgIHRoaXMuX192aWV3LmNhbmNlbFN1Ym1pdCh0aGlzLmVsLmZvcm0pXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYodGhpcy5hY3RpdmVSZWZzKCkgPT09IFwiXCIpeyB0aGlzLmVsLnZhbHVlID0gbnVsbCB9XG4gICAgICB0aGlzLmVsLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KFBIWF9MSVZFX0ZJTEVfVVBEQVRFRCkpXG4gICAgfVxuICB9LFxuXG4gIExpdmVJbWdQcmV2aWV3OiB7XG4gICAgbW91bnRlZCgpe1xuICAgICAgdGhpcy5yZWYgPSB0aGlzLmVsLmdldEF0dHJpYnV0ZShcImRhdGEtcGh4LWVudHJ5LXJlZlwiKVxuICAgICAgdGhpcy5pbnB1dEVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5lbC5nZXRBdHRyaWJ1dGUoUEhYX1VQTE9BRF9SRUYpKVxuICAgICAgTGl2ZVVwbG9hZGVyLmdldEVudHJ5RGF0YVVSTCh0aGlzLmlucHV0RWwsIHRoaXMucmVmLCB1cmwgPT4ge1xuICAgICAgICB0aGlzLnVybCA9IHVybFxuICAgICAgICB0aGlzLmVsLnNyYyA9IHVybFxuICAgICAgfSlcbiAgICB9LFxuICAgIGRlc3Ryb3llZCgpe1xuICAgICAgVVJMLnJldm9rZU9iamVjdFVSTCh0aGlzLnVybClcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgSG9va3NcbiIsICJpbXBvcnQge1xuICBtYXliZVxufSBmcm9tIFwiLi91dGlsc1wiXG5cbmltcG9ydCBET00gZnJvbSBcIi4vZG9tXCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRE9NUG9zdE1vcnBoUmVzdG9yZXIge1xuICBjb25zdHJ1Y3Rvcihjb250YWluZXJCZWZvcmUsIGNvbnRhaW5lckFmdGVyLCB1cGRhdGVUeXBlKXtcbiAgICBsZXQgaWRzQmVmb3JlID0gbmV3IFNldCgpXG4gICAgbGV0IGlkc0FmdGVyID0gbmV3IFNldChbLi4uY29udGFpbmVyQWZ0ZXIuY2hpbGRyZW5dLm1hcChjaGlsZCA9PiBjaGlsZC5pZCkpXG5cbiAgICBsZXQgZWxlbWVudHNUb01vZGlmeSA9IFtdXG5cbiAgICBBcnJheS5mcm9tKGNvbnRhaW5lckJlZm9yZS5jaGlsZHJlbikuZm9yRWFjaChjaGlsZCA9PiB7XG4gICAgICBpZihjaGlsZC5pZCl7IC8vIGFsbCBvZiBvdXIgY2hpbGRyZW4gc2hvdWxkIGJlIGVsZW1lbnRzIHdpdGggaWRzXG4gICAgICAgIGlkc0JlZm9yZS5hZGQoY2hpbGQuaWQpXG4gICAgICAgIGlmKGlkc0FmdGVyLmhhcyhjaGlsZC5pZCkpe1xuICAgICAgICAgIGxldCBwcmV2aW91c0VsZW1lbnRJZCA9IGNoaWxkLnByZXZpb3VzRWxlbWVudFNpYmxpbmcgJiYgY2hpbGQucHJldmlvdXNFbGVtZW50U2libGluZy5pZFxuICAgICAgICAgIGVsZW1lbnRzVG9Nb2RpZnkucHVzaCh7ZWxlbWVudElkOiBjaGlsZC5pZCwgcHJldmlvdXNFbGVtZW50SWQ6IHByZXZpb3VzRWxlbWVudElkfSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLmNvbnRhaW5lcklkID0gY29udGFpbmVyQWZ0ZXIuaWRcbiAgICB0aGlzLnVwZGF0ZVR5cGUgPSB1cGRhdGVUeXBlXG4gICAgdGhpcy5lbGVtZW50c1RvTW9kaWZ5ID0gZWxlbWVudHNUb01vZGlmeVxuICAgIHRoaXMuZWxlbWVudElkc1RvQWRkID0gWy4uLmlkc0FmdGVyXS5maWx0ZXIoaWQgPT4gIWlkc0JlZm9yZS5oYXMoaWQpKVxuICB9XG5cbiAgLy8gV2UgZG8gdGhlIGZvbGxvd2luZyB0byBvcHRpbWl6ZSBhcHBlbmQvcHJlcGVuZCBvcGVyYXRpb25zOlxuICAvLyAgIDEpIFRyYWNrIGlkcyBvZiBtb2RpZmllZCBlbGVtZW50cyAmIG9mIG5ldyBlbGVtZW50c1xuICAvLyAgIDIpIEFsbCB0aGUgbW9kaWZpZWQgZWxlbWVudHMgYXJlIHB1dCBiYWNrIGluIHRoZSBjb3JyZWN0IHBvc2l0aW9uIGluIHRoZSBET00gdHJlZVxuICAvLyAgICAgIGJ5IHN0b3JpbmcgdGhlIGlkIG9mIHRoZWlyIHByZXZpb3VzIHNpYmxpbmdcbiAgLy8gICAzKSBOZXcgZWxlbWVudHMgYXJlIGdvaW5nIHRvIGJlIHB1dCBpbiB0aGUgcmlnaHQgcGxhY2UgYnkgbW9ycGhkb20gZHVyaW5nIGFwcGVuZC5cbiAgLy8gICAgICBGb3IgcHJlcGVuZCwgd2UgbW92ZSB0aGVtIHRvIHRoZSBmaXJzdCBwb3NpdGlvbiBpbiB0aGUgY29udGFpbmVyXG4gIHBlcmZvcm0oKXtcbiAgICBsZXQgY29udGFpbmVyID0gRE9NLmJ5SWQodGhpcy5jb250YWluZXJJZClcbiAgICB0aGlzLmVsZW1lbnRzVG9Nb2RpZnkuZm9yRWFjaChlbGVtZW50VG9Nb2RpZnkgPT4ge1xuICAgICAgaWYoZWxlbWVudFRvTW9kaWZ5LnByZXZpb3VzRWxlbWVudElkKXtcbiAgICAgICAgbWF5YmUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudFRvTW9kaWZ5LnByZXZpb3VzRWxlbWVudElkKSwgcHJldmlvdXNFbGVtID0+IHtcbiAgICAgICAgICBtYXliZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbGVtZW50VG9Nb2RpZnkuZWxlbWVudElkKSwgZWxlbSA9PiB7XG4gICAgICAgICAgICBsZXQgaXNJblJpZ2h0UGxhY2UgPSBlbGVtLnByZXZpb3VzRWxlbWVudFNpYmxpbmcgJiYgZWxlbS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nLmlkID09IHByZXZpb3VzRWxlbS5pZFxuICAgICAgICAgICAgaWYoIWlzSW5SaWdodFBsYWNlKXtcbiAgICAgICAgICAgICAgcHJldmlvdXNFbGVtLmluc2VydEFkamFjZW50RWxlbWVudChcImFmdGVyZW5kXCIsIGVsZW0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFRoaXMgaXMgdGhlIGZpcnN0IGVsZW1lbnQgaW4gdGhlIGNvbnRhaW5lclxuICAgICAgICBtYXliZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbGVtZW50VG9Nb2RpZnkuZWxlbWVudElkKSwgZWxlbSA9PiB7XG4gICAgICAgICAgbGV0IGlzSW5SaWdodFBsYWNlID0gZWxlbS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nID09IG51bGxcbiAgICAgICAgICBpZighaXNJblJpZ2h0UGxhY2Upe1xuICAgICAgICAgICAgY29udGFpbmVyLmluc2VydEFkamFjZW50RWxlbWVudChcImFmdGVyYmVnaW5cIiwgZWxlbSlcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcblxuICAgIGlmKHRoaXMudXBkYXRlVHlwZSA9PSBcInByZXBlbmRcIil7XG4gICAgICB0aGlzLmVsZW1lbnRJZHNUb0FkZC5yZXZlcnNlKCkuZm9yRWFjaChlbGVtSWQgPT4ge1xuICAgICAgICBtYXliZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbGVtSWQpLCBlbGVtID0+IGNvbnRhaW5lci5pbnNlcnRBZGphY2VudEVsZW1lbnQoXCJhZnRlcmJlZ2luXCIsIGVsZW0pKVxuICAgICAgfSlcbiAgICB9XG4gIH1cbn1cbiIsICJ2YXIgRE9DVU1FTlRfRlJBR01FTlRfTk9ERSA9IDExO1xuXG5mdW5jdGlvbiBtb3JwaEF0dHJzKGZyb21Ob2RlLCB0b05vZGUpIHtcbiAgICB2YXIgdG9Ob2RlQXR0cnMgPSB0b05vZGUuYXR0cmlidXRlcztcbiAgICB2YXIgYXR0cjtcbiAgICB2YXIgYXR0ck5hbWU7XG4gICAgdmFyIGF0dHJOYW1lc3BhY2VVUkk7XG4gICAgdmFyIGF0dHJWYWx1ZTtcbiAgICB2YXIgZnJvbVZhbHVlO1xuXG4gICAgLy8gZG9jdW1lbnQtZnJhZ21lbnRzIGRvbnQgaGF2ZSBhdHRyaWJ1dGVzIHNvIGxldHMgbm90IGRvIGFueXRoaW5nXG4gICAgaWYgKHRvTm9kZS5ub2RlVHlwZSA9PT0gRE9DVU1FTlRfRlJBR01FTlRfTk9ERSB8fCBmcm9tTm9kZS5ub2RlVHlwZSA9PT0gRE9DVU1FTlRfRlJBR01FTlRfTk9ERSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIHVwZGF0ZSBhdHRyaWJ1dGVzIG9uIG9yaWdpbmFsIERPTSBlbGVtZW50XG4gICAgZm9yICh2YXIgaSA9IHRvTm9kZUF0dHJzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIGF0dHIgPSB0b05vZGVBdHRyc1tpXTtcbiAgICAgICAgYXR0ck5hbWUgPSBhdHRyLm5hbWU7XG4gICAgICAgIGF0dHJOYW1lc3BhY2VVUkkgPSBhdHRyLm5hbWVzcGFjZVVSSTtcbiAgICAgICAgYXR0clZhbHVlID0gYXR0ci52YWx1ZTtcblxuICAgICAgICBpZiAoYXR0ck5hbWVzcGFjZVVSSSkge1xuICAgICAgICAgICAgYXR0ck5hbWUgPSBhdHRyLmxvY2FsTmFtZSB8fCBhdHRyTmFtZTtcbiAgICAgICAgICAgIGZyb21WYWx1ZSA9IGZyb21Ob2RlLmdldEF0dHJpYnV0ZU5TKGF0dHJOYW1lc3BhY2VVUkksIGF0dHJOYW1lKTtcblxuICAgICAgICAgICAgaWYgKGZyb21WYWx1ZSAhPT0gYXR0clZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGF0dHIucHJlZml4ID09PSAneG1sbnMnKXtcbiAgICAgICAgICAgICAgICAgICAgYXR0ck5hbWUgPSBhdHRyLm5hbWU7IC8vIEl0J3Mgbm90IGFsbG93ZWQgdG8gc2V0IGFuIGF0dHJpYnV0ZSB3aXRoIHRoZSBYTUxOUyBuYW1lc3BhY2Ugd2l0aG91dCBzcGVjaWZ5aW5nIHRoZSBgeG1sbnNgIHByZWZpeFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmcm9tTm9kZS5zZXRBdHRyaWJ1dGVOUyhhdHRyTmFtZXNwYWNlVVJJLCBhdHRyTmFtZSwgYXR0clZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZyb21WYWx1ZSA9IGZyb21Ob2RlLmdldEF0dHJpYnV0ZShhdHRyTmFtZSk7XG5cbiAgICAgICAgICAgIGlmIChmcm9tVmFsdWUgIT09IGF0dHJWYWx1ZSkge1xuICAgICAgICAgICAgICAgIGZyb21Ob2RlLnNldEF0dHJpYnV0ZShhdHRyTmFtZSwgYXR0clZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJlbW92ZSBhbnkgZXh0cmEgYXR0cmlidXRlcyBmb3VuZCBvbiB0aGUgb3JpZ2luYWwgRE9NIGVsZW1lbnQgdGhhdFxuICAgIC8vIHdlcmVuJ3QgZm91bmQgb24gdGhlIHRhcmdldCBlbGVtZW50LlxuICAgIHZhciBmcm9tTm9kZUF0dHJzID0gZnJvbU5vZGUuYXR0cmlidXRlcztcblxuICAgIGZvciAodmFyIGQgPSBmcm9tTm9kZUF0dHJzLmxlbmd0aCAtIDE7IGQgPj0gMDsgZC0tKSB7XG4gICAgICAgIGF0dHIgPSBmcm9tTm9kZUF0dHJzW2RdO1xuICAgICAgICBhdHRyTmFtZSA9IGF0dHIubmFtZTtcbiAgICAgICAgYXR0ck5hbWVzcGFjZVVSSSA9IGF0dHIubmFtZXNwYWNlVVJJO1xuXG4gICAgICAgIGlmIChhdHRyTmFtZXNwYWNlVVJJKSB7XG4gICAgICAgICAgICBhdHRyTmFtZSA9IGF0dHIubG9jYWxOYW1lIHx8IGF0dHJOYW1lO1xuXG4gICAgICAgICAgICBpZiAoIXRvTm9kZS5oYXNBdHRyaWJ1dGVOUyhhdHRyTmFtZXNwYWNlVVJJLCBhdHRyTmFtZSkpIHtcbiAgICAgICAgICAgICAgICBmcm9tTm9kZS5yZW1vdmVBdHRyaWJ1dGVOUyhhdHRyTmFtZXNwYWNlVVJJLCBhdHRyTmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoIXRvTm9kZS5oYXNBdHRyaWJ1dGUoYXR0ck5hbWUpKSB7XG4gICAgICAgICAgICAgICAgZnJvbU5vZGUucmVtb3ZlQXR0cmlidXRlKGF0dHJOYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxudmFyIHJhbmdlOyAvLyBDcmVhdGUgYSByYW5nZSBvYmplY3QgZm9yIGVmZmljZW50bHkgcmVuZGVyaW5nIHN0cmluZ3MgdG8gZWxlbWVudHMuXG52YXIgTlNfWEhUTUwgPSAnaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbCc7XG5cbnZhciBkb2MgPSB0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnID8gdW5kZWZpbmVkIDogZG9jdW1lbnQ7XG52YXIgSEFTX1RFTVBMQVRFX1NVUFBPUlQgPSAhIWRvYyAmJiAnY29udGVudCcgaW4gZG9jLmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG52YXIgSEFTX1JBTkdFX1NVUFBPUlQgPSAhIWRvYyAmJiBkb2MuY3JlYXRlUmFuZ2UgJiYgJ2NyZWF0ZUNvbnRleHR1YWxGcmFnbWVudCcgaW4gZG9jLmNyZWF0ZVJhbmdlKCk7XG5cbmZ1bmN0aW9uIGNyZWF0ZUZyYWdtZW50RnJvbVRlbXBsYXRlKHN0cikge1xuICAgIHZhciB0ZW1wbGF0ZSA9IGRvYy5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IHN0cjtcbiAgICByZXR1cm4gdGVtcGxhdGUuY29udGVudC5jaGlsZE5vZGVzWzBdO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVGcmFnbWVudEZyb21SYW5nZShzdHIpIHtcbiAgICBpZiAoIXJhbmdlKSB7XG4gICAgICAgIHJhbmdlID0gZG9jLmNyZWF0ZVJhbmdlKCk7XG4gICAgICAgIHJhbmdlLnNlbGVjdE5vZGUoZG9jLmJvZHkpO1xuICAgIH1cblxuICAgIHZhciBmcmFnbWVudCA9IHJhbmdlLmNyZWF0ZUNvbnRleHR1YWxGcmFnbWVudChzdHIpO1xuICAgIHJldHVybiBmcmFnbWVudC5jaGlsZE5vZGVzWzBdO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVGcmFnbWVudEZyb21XcmFwKHN0cikge1xuICAgIHZhciBmcmFnbWVudCA9IGRvYy5jcmVhdGVFbGVtZW50KCdib2R5Jyk7XG4gICAgZnJhZ21lbnQuaW5uZXJIVE1MID0gc3RyO1xuICAgIHJldHVybiBmcmFnbWVudC5jaGlsZE5vZGVzWzBdO1xufVxuXG4vKipcbiAqIFRoaXMgaXMgYWJvdXQgdGhlIHNhbWVcbiAqIHZhciBodG1sID0gbmV3IERPTVBhcnNlcigpLnBhcnNlRnJvbVN0cmluZyhzdHIsICd0ZXh0L2h0bWwnKTtcbiAqIHJldHVybiBodG1sLmJvZHkuZmlyc3RDaGlsZDtcbiAqXG4gKiBAbWV0aG9kIHRvRWxlbWVudFxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICovXG5mdW5jdGlvbiB0b0VsZW1lbnQoc3RyKSB7XG4gICAgc3RyID0gc3RyLnRyaW0oKTtcbiAgICBpZiAoSEFTX1RFTVBMQVRFX1NVUFBPUlQpIHtcbiAgICAgIC8vIGF2b2lkIHJlc3RyaWN0aW9ucyBvbiBjb250ZW50IGZvciB0aGluZ3MgbGlrZSBgPHRyPjx0aD5IaTwvdGg+PC90cj5gIHdoaWNoXG4gICAgICAvLyBjcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQgZG9lc24ndCBzdXBwb3J0XG4gICAgICAvLyA8dGVtcGxhdGU+IHN1cHBvcnQgbm90IGF2YWlsYWJsZSBpbiBJRVxuICAgICAgcmV0dXJuIGNyZWF0ZUZyYWdtZW50RnJvbVRlbXBsYXRlKHN0cik7XG4gICAgfSBlbHNlIGlmIChIQVNfUkFOR0VfU1VQUE9SVCkge1xuICAgICAgcmV0dXJuIGNyZWF0ZUZyYWdtZW50RnJvbVJhbmdlKHN0cik7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNyZWF0ZUZyYWdtZW50RnJvbVdyYXAoc3RyKTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgdHdvIG5vZGUncyBuYW1lcyBhcmUgdGhlIHNhbWUuXG4gKlxuICogTk9URTogV2UgZG9uJ3QgYm90aGVyIGNoZWNraW5nIGBuYW1lc3BhY2VVUklgIGJlY2F1c2UgeW91IHdpbGwgbmV2ZXIgZmluZCB0d28gSFRNTCBlbGVtZW50cyB3aXRoIHRoZSBzYW1lXG4gKiAgICAgICBub2RlTmFtZSBhbmQgZGlmZmVyZW50IG5hbWVzcGFjZSBVUklzLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gYVxuICogQHBhcmFtIHtFbGVtZW50fSBiIFRoZSB0YXJnZXQgZWxlbWVudFxuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gY29tcGFyZU5vZGVOYW1lcyhmcm9tRWwsIHRvRWwpIHtcbiAgICB2YXIgZnJvbU5vZGVOYW1lID0gZnJvbUVsLm5vZGVOYW1lO1xuICAgIHZhciB0b05vZGVOYW1lID0gdG9FbC5ub2RlTmFtZTtcbiAgICB2YXIgZnJvbUNvZGVTdGFydCwgdG9Db2RlU3RhcnQ7XG5cbiAgICBpZiAoZnJvbU5vZGVOYW1lID09PSB0b05vZGVOYW1lKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGZyb21Db2RlU3RhcnQgPSBmcm9tTm9kZU5hbWUuY2hhckNvZGVBdCgwKTtcbiAgICB0b0NvZGVTdGFydCA9IHRvTm9kZU5hbWUuY2hhckNvZGVBdCgwKTtcblxuICAgIC8vIElmIHRoZSB0YXJnZXQgZWxlbWVudCBpcyBhIHZpcnR1YWwgRE9NIG5vZGUgb3IgU1ZHIG5vZGUgdGhlbiB3ZSBtYXlcbiAgICAvLyBuZWVkIHRvIG5vcm1hbGl6ZSB0aGUgdGFnIG5hbWUgYmVmb3JlIGNvbXBhcmluZy4gTm9ybWFsIEhUTUwgZWxlbWVudHMgdGhhdCBhcmVcbiAgICAvLyBpbiB0aGUgXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sXCJcbiAgICAvLyBhcmUgY29udmVydGVkIHRvIHVwcGVyIGNhc2VcbiAgICBpZiAoZnJvbUNvZGVTdGFydCA8PSA5MCAmJiB0b0NvZGVTdGFydCA+PSA5NykgeyAvLyBmcm9tIGlzIHVwcGVyIGFuZCB0byBpcyBsb3dlclxuICAgICAgICByZXR1cm4gZnJvbU5vZGVOYW1lID09PSB0b05vZGVOYW1lLnRvVXBwZXJDYXNlKCk7XG4gICAgfSBlbHNlIGlmICh0b0NvZGVTdGFydCA8PSA5MCAmJiBmcm9tQ29kZVN0YXJ0ID49IDk3KSB7IC8vIHRvIGlzIHVwcGVyIGFuZCBmcm9tIGlzIGxvd2VyXG4gICAgICAgIHJldHVybiB0b05vZGVOYW1lID09PSBmcm9tTm9kZU5hbWUudG9VcHBlckNhc2UoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuXG4vKipcbiAqIENyZWF0ZSBhbiBlbGVtZW50LCBvcHRpb25hbGx5IHdpdGggYSBrbm93biBuYW1lc3BhY2UgVVJJLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIHRoZSBlbGVtZW50IG5hbWUsIGUuZy4gJ2Rpdicgb3IgJ3N2ZydcbiAqIEBwYXJhbSB7c3RyaW5nfSBbbmFtZXNwYWNlVVJJXSB0aGUgZWxlbWVudCdzIG5hbWVzcGFjZSBVUkksIGkuZS4gdGhlIHZhbHVlIG9mXG4gKiBpdHMgYHhtbG5zYCBhdHRyaWJ1dGUgb3IgaXRzIGluZmVycmVkIG5hbWVzcGFjZS5cbiAqXG4gKiBAcmV0dXJuIHtFbGVtZW50fVxuICovXG5mdW5jdGlvbiBjcmVhdGVFbGVtZW50TlMobmFtZSwgbmFtZXNwYWNlVVJJKSB7XG4gICAgcmV0dXJuICFuYW1lc3BhY2VVUkkgfHwgbmFtZXNwYWNlVVJJID09PSBOU19YSFRNTCA/XG4gICAgICAgIGRvYy5jcmVhdGVFbGVtZW50KG5hbWUpIDpcbiAgICAgICAgZG9jLmNyZWF0ZUVsZW1lbnROUyhuYW1lc3BhY2VVUkksIG5hbWUpO1xufVxuXG4vKipcbiAqIENvcGllcyB0aGUgY2hpbGRyZW4gb2Ygb25lIERPTSBlbGVtZW50IHRvIGFub3RoZXIgRE9NIGVsZW1lbnRcbiAqL1xuZnVuY3Rpb24gbW92ZUNoaWxkcmVuKGZyb21FbCwgdG9FbCkge1xuICAgIHZhciBjdXJDaGlsZCA9IGZyb21FbC5maXJzdENoaWxkO1xuICAgIHdoaWxlIChjdXJDaGlsZCkge1xuICAgICAgICB2YXIgbmV4dENoaWxkID0gY3VyQ2hpbGQubmV4dFNpYmxpbmc7XG4gICAgICAgIHRvRWwuYXBwZW5kQ2hpbGQoY3VyQ2hpbGQpO1xuICAgICAgICBjdXJDaGlsZCA9IG5leHRDaGlsZDtcbiAgICB9XG4gICAgcmV0dXJuIHRvRWw7XG59XG5cbmZ1bmN0aW9uIHN5bmNCb29sZWFuQXR0clByb3AoZnJvbUVsLCB0b0VsLCBuYW1lKSB7XG4gICAgaWYgKGZyb21FbFtuYW1lXSAhPT0gdG9FbFtuYW1lXSkge1xuICAgICAgICBmcm9tRWxbbmFtZV0gPSB0b0VsW25hbWVdO1xuICAgICAgICBpZiAoZnJvbUVsW25hbWVdKSB7XG4gICAgICAgICAgICBmcm9tRWwuc2V0QXR0cmlidXRlKG5hbWUsICcnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZyb21FbC5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbnZhciBzcGVjaWFsRWxIYW5kbGVycyA9IHtcbiAgICBPUFRJT046IGZ1bmN0aW9uKGZyb21FbCwgdG9FbCkge1xuICAgICAgICB2YXIgcGFyZW50Tm9kZSA9IGZyb21FbC5wYXJlbnROb2RlO1xuICAgICAgICBpZiAocGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgdmFyIHBhcmVudE5hbWUgPSBwYXJlbnROb2RlLm5vZGVOYW1lLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICBpZiAocGFyZW50TmFtZSA9PT0gJ09QVEdST1VQJykge1xuICAgICAgICAgICAgICAgIHBhcmVudE5vZGUgPSBwYXJlbnROb2RlLnBhcmVudE5vZGU7XG4gICAgICAgICAgICAgICAgcGFyZW50TmFtZSA9IHBhcmVudE5vZGUgJiYgcGFyZW50Tm9kZS5ub2RlTmFtZS50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBhcmVudE5hbWUgPT09ICdTRUxFQ1QnICYmICFwYXJlbnROb2RlLmhhc0F0dHJpYnV0ZSgnbXVsdGlwbGUnKSkge1xuICAgICAgICAgICAgICAgIGlmIChmcm9tRWwuaGFzQXR0cmlidXRlKCdzZWxlY3RlZCcpICYmICF0b0VsLnNlbGVjdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFdvcmthcm91bmQgZm9yIE1TIEVkZ2UgYnVnIHdoZXJlIHRoZSAnc2VsZWN0ZWQnIGF0dHJpYnV0ZSBjYW4gb25seSBiZVxuICAgICAgICAgICAgICAgICAgICAvLyByZW1vdmVkIGlmIHNldCB0byBhIG5vbi1lbXB0eSB2YWx1ZTpcbiAgICAgICAgICAgICAgICAgICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubWljcm9zb2Z0LmNvbS9lbi11cy9taWNyb3NvZnQtZWRnZS9wbGF0Zm9ybS9pc3N1ZXMvMTIwODc2NzkvXG4gICAgICAgICAgICAgICAgICAgIGZyb21FbC5zZXRBdHRyaWJ1dGUoJ3NlbGVjdGVkJywgJ3NlbGVjdGVkJyk7XG4gICAgICAgICAgICAgICAgICAgIGZyb21FbC5yZW1vdmVBdHRyaWJ1dGUoJ3NlbGVjdGVkJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIFdlIGhhdmUgdG8gcmVzZXQgc2VsZWN0IGVsZW1lbnQncyBzZWxlY3RlZEluZGV4IHRvIC0xLCBvdGhlcndpc2Ugc2V0dGluZ1xuICAgICAgICAgICAgICAgIC8vIGZyb21FbC5zZWxlY3RlZCB1c2luZyB0aGUgc3luY0Jvb2xlYW5BdHRyUHJvcCBiZWxvdyBoYXMgbm8gZWZmZWN0LlxuICAgICAgICAgICAgICAgIC8vIFRoZSBjb3JyZWN0IHNlbGVjdGVkSW5kZXggd2lsbCBiZSBzZXQgaW4gdGhlIFNFTEVDVCBzcGVjaWFsIGhhbmRsZXIgYmVsb3cuXG4gICAgICAgICAgICAgICAgcGFyZW50Tm9kZS5zZWxlY3RlZEluZGV4ID0gLTE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc3luY0Jvb2xlYW5BdHRyUHJvcChmcm9tRWwsIHRvRWwsICdzZWxlY3RlZCcpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogVGhlIFwidmFsdWVcIiBhdHRyaWJ1dGUgaXMgc3BlY2lhbCBmb3IgdGhlIDxpbnB1dD4gZWxlbWVudCBzaW5jZSBpdCBzZXRzXG4gICAgICogdGhlIGluaXRpYWwgdmFsdWUuIENoYW5naW5nIHRoZSBcInZhbHVlXCIgYXR0cmlidXRlIHdpdGhvdXQgY2hhbmdpbmcgdGhlXG4gICAgICogXCJ2YWx1ZVwiIHByb3BlcnR5IHdpbGwgaGF2ZSBubyBlZmZlY3Qgc2luY2UgaXQgaXMgb25seSB1c2VkIHRvIHRoZSBzZXQgdGhlXG4gICAgICogaW5pdGlhbCB2YWx1ZS4gIFNpbWlsYXIgZm9yIHRoZSBcImNoZWNrZWRcIiBhdHRyaWJ1dGUsIGFuZCBcImRpc2FibGVkXCIuXG4gICAgICovXG4gICAgSU5QVVQ6IGZ1bmN0aW9uKGZyb21FbCwgdG9FbCkge1xuICAgICAgICBzeW5jQm9vbGVhbkF0dHJQcm9wKGZyb21FbCwgdG9FbCwgJ2NoZWNrZWQnKTtcbiAgICAgICAgc3luY0Jvb2xlYW5BdHRyUHJvcChmcm9tRWwsIHRvRWwsICdkaXNhYmxlZCcpO1xuXG4gICAgICAgIGlmIChmcm9tRWwudmFsdWUgIT09IHRvRWwudmFsdWUpIHtcbiAgICAgICAgICAgIGZyb21FbC52YWx1ZSA9IHRvRWwudmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRvRWwuaGFzQXR0cmlidXRlKCd2YWx1ZScpKSB7XG4gICAgICAgICAgICBmcm9tRWwucmVtb3ZlQXR0cmlidXRlKCd2YWx1ZScpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIFRFWFRBUkVBOiBmdW5jdGlvbihmcm9tRWwsIHRvRWwpIHtcbiAgICAgICAgdmFyIG5ld1ZhbHVlID0gdG9FbC52YWx1ZTtcbiAgICAgICAgaWYgKGZyb21FbC52YWx1ZSAhPT0gbmV3VmFsdWUpIHtcbiAgICAgICAgICAgIGZyb21FbC52YWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGZpcnN0Q2hpbGQgPSBmcm9tRWwuZmlyc3RDaGlsZDtcbiAgICAgICAgaWYgKGZpcnN0Q2hpbGQpIHtcbiAgICAgICAgICAgIC8vIE5lZWRlZCBmb3IgSUUuIEFwcGFyZW50bHkgSUUgc2V0cyB0aGUgcGxhY2Vob2xkZXIgYXMgdGhlXG4gICAgICAgICAgICAvLyBub2RlIHZhbHVlIGFuZCB2aXNlIHZlcnNhLiBUaGlzIGlnbm9yZXMgYW4gZW1wdHkgdXBkYXRlLlxuICAgICAgICAgICAgdmFyIG9sZFZhbHVlID0gZmlyc3RDaGlsZC5ub2RlVmFsdWU7XG5cbiAgICAgICAgICAgIGlmIChvbGRWYWx1ZSA9PSBuZXdWYWx1ZSB8fCAoIW5ld1ZhbHVlICYmIG9sZFZhbHVlID09IGZyb21FbC5wbGFjZWhvbGRlcikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZpcnN0Q2hpbGQubm9kZVZhbHVlID0gbmV3VmFsdWU7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIFNFTEVDVDogZnVuY3Rpb24oZnJvbUVsLCB0b0VsKSB7XG4gICAgICAgIGlmICghdG9FbC5oYXNBdHRyaWJ1dGUoJ211bHRpcGxlJykpIHtcbiAgICAgICAgICAgIHZhciBzZWxlY3RlZEluZGV4ID0gLTE7XG4gICAgICAgICAgICB2YXIgaSA9IDA7XG4gICAgICAgICAgICAvLyBXZSBoYXZlIHRvIGxvb3AgdGhyb3VnaCBjaGlsZHJlbiBvZiBmcm9tRWwsIG5vdCB0b0VsIHNpbmNlIG5vZGVzIGNhbiBiZSBtb3ZlZFxuICAgICAgICAgICAgLy8gZnJvbSB0b0VsIHRvIGZyb21FbCBkaXJlY3RseSB3aGVuIG1vcnBoaW5nLlxuICAgICAgICAgICAgLy8gQXQgdGhlIHRpbWUgdGhpcyBzcGVjaWFsIGhhbmRsZXIgaXMgaW52b2tlZCwgYWxsIGNoaWxkcmVuIGhhdmUgYWxyZWFkeSBiZWVuIG1vcnBoZWRcbiAgICAgICAgICAgIC8vIGFuZCBhcHBlbmRlZCB0byAvIHJlbW92ZWQgZnJvbSBmcm9tRWwsIHNvIHVzaW5nIGZyb21FbCBoZXJlIGlzIHNhZmUgYW5kIGNvcnJlY3QuXG4gICAgICAgICAgICB2YXIgY3VyQ2hpbGQgPSBmcm9tRWwuZmlyc3RDaGlsZDtcbiAgICAgICAgICAgIHZhciBvcHRncm91cDtcbiAgICAgICAgICAgIHZhciBub2RlTmFtZTtcbiAgICAgICAgICAgIHdoaWxlKGN1ckNoaWxkKSB7XG4gICAgICAgICAgICAgICAgbm9kZU5hbWUgPSBjdXJDaGlsZC5ub2RlTmFtZSAmJiBjdXJDaGlsZC5ub2RlTmFtZS50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgICAgIGlmIChub2RlTmFtZSA9PT0gJ09QVEdST1VQJykge1xuICAgICAgICAgICAgICAgICAgICBvcHRncm91cCA9IGN1ckNoaWxkO1xuICAgICAgICAgICAgICAgICAgICBjdXJDaGlsZCA9IG9wdGdyb3VwLmZpcnN0Q2hpbGQ7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGVOYW1lID09PSAnT1BUSU9OJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1ckNoaWxkLmhhc0F0dHJpYnV0ZSgnc2VsZWN0ZWQnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkSW5kZXggPSBpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGN1ckNoaWxkID0gY3VyQ2hpbGQubmV4dFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgICAgIGlmICghY3VyQ2hpbGQgJiYgb3B0Z3JvdXApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1ckNoaWxkID0gb3B0Z3JvdXAubmV4dFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRncm91cCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZyb21FbC5zZWxlY3RlZEluZGV4ID0gc2VsZWN0ZWRJbmRleDtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbnZhciBFTEVNRU5UX05PREUgPSAxO1xudmFyIERPQ1VNRU5UX0ZSQUdNRU5UX05PREUkMSA9IDExO1xudmFyIFRFWFRfTk9ERSA9IDM7XG52YXIgQ09NTUVOVF9OT0RFID0gODtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbmZ1bmN0aW9uIGRlZmF1bHRHZXROb2RlS2V5KG5vZGUpIHtcbiAgaWYgKG5vZGUpIHtcbiAgICAgIHJldHVybiAobm9kZS5nZXRBdHRyaWJ1dGUgJiYgbm9kZS5nZXRBdHRyaWJ1dGUoJ2lkJykpIHx8IG5vZGUuaWQ7XG4gIH1cbn1cblxuZnVuY3Rpb24gbW9ycGhkb21GYWN0b3J5KG1vcnBoQXR0cnMpIHtcblxuICAgIHJldHVybiBmdW5jdGlvbiBtb3JwaGRvbShmcm9tTm9kZSwgdG9Ob2RlLCBvcHRpb25zKSB7XG4gICAgICAgIGlmICghb3B0aW9ucykge1xuICAgICAgICAgICAgb3B0aW9ucyA9IHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiB0b05vZGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBpZiAoZnJvbU5vZGUubm9kZU5hbWUgPT09ICcjZG9jdW1lbnQnIHx8IGZyb21Ob2RlLm5vZGVOYW1lID09PSAnSFRNTCcgfHwgZnJvbU5vZGUubm9kZU5hbWUgPT09ICdCT0RZJykge1xuICAgICAgICAgICAgICAgIHZhciB0b05vZGVIdG1sID0gdG9Ob2RlO1xuICAgICAgICAgICAgICAgIHRvTm9kZSA9IGRvYy5jcmVhdGVFbGVtZW50KCdodG1sJyk7XG4gICAgICAgICAgICAgICAgdG9Ob2RlLmlubmVySFRNTCA9IHRvTm9kZUh0bWw7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRvTm9kZSA9IHRvRWxlbWVudCh0b05vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGdldE5vZGVLZXkgPSBvcHRpb25zLmdldE5vZGVLZXkgfHwgZGVmYXVsdEdldE5vZGVLZXk7XG4gICAgICAgIHZhciBvbkJlZm9yZU5vZGVBZGRlZCA9IG9wdGlvbnMub25CZWZvcmVOb2RlQWRkZWQgfHwgbm9vcDtcbiAgICAgICAgdmFyIG9uTm9kZUFkZGVkID0gb3B0aW9ucy5vbk5vZGVBZGRlZCB8fCBub29wO1xuICAgICAgICB2YXIgb25CZWZvcmVFbFVwZGF0ZWQgPSBvcHRpb25zLm9uQmVmb3JlRWxVcGRhdGVkIHx8IG5vb3A7XG4gICAgICAgIHZhciBvbkVsVXBkYXRlZCA9IG9wdGlvbnMub25FbFVwZGF0ZWQgfHwgbm9vcDtcbiAgICAgICAgdmFyIG9uQmVmb3JlTm9kZURpc2NhcmRlZCA9IG9wdGlvbnMub25CZWZvcmVOb2RlRGlzY2FyZGVkIHx8IG5vb3A7XG4gICAgICAgIHZhciBvbk5vZGVEaXNjYXJkZWQgPSBvcHRpb25zLm9uTm9kZURpc2NhcmRlZCB8fCBub29wO1xuICAgICAgICB2YXIgb25CZWZvcmVFbENoaWxkcmVuVXBkYXRlZCA9IG9wdGlvbnMub25CZWZvcmVFbENoaWxkcmVuVXBkYXRlZCB8fCBub29wO1xuICAgICAgICB2YXIgY2hpbGRyZW5Pbmx5ID0gb3B0aW9ucy5jaGlsZHJlbk9ubHkgPT09IHRydWU7XG5cbiAgICAgICAgLy8gVGhpcyBvYmplY3QgaXMgdXNlZCBhcyBhIGxvb2t1cCB0byBxdWlja2x5IGZpbmQgYWxsIGtleWVkIGVsZW1lbnRzIGluIHRoZSBvcmlnaW5hbCBET00gdHJlZS5cbiAgICAgICAgdmFyIGZyb21Ob2Rlc0xvb2t1cCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgIHZhciBrZXllZFJlbW92YWxMaXN0ID0gW107XG5cbiAgICAgICAgZnVuY3Rpb24gYWRkS2V5ZWRSZW1vdmFsKGtleSkge1xuICAgICAgICAgICAga2V5ZWRSZW1vdmFsTGlzdC5wdXNoKGtleSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiB3YWxrRGlzY2FyZGVkQ2hpbGROb2Rlcyhub2RlLCBza2lwS2V5ZWROb2Rlcykge1xuICAgICAgICAgICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IEVMRU1FTlRfTk9ERSkge1xuICAgICAgICAgICAgICAgIHZhciBjdXJDaGlsZCA9IG5vZGUuZmlyc3RDaGlsZDtcbiAgICAgICAgICAgICAgICB3aGlsZSAoY3VyQ2hpbGQpIHtcblxuICAgICAgICAgICAgICAgICAgICB2YXIga2V5ID0gdW5kZWZpbmVkO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChza2lwS2V5ZWROb2RlcyAmJiAoa2V5ID0gZ2V0Tm9kZUtleShjdXJDaGlsZCkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBJZiB3ZSBhcmUgc2tpcHBpbmcga2V5ZWQgbm9kZXMgdGhlbiB3ZSBhZGQgdGhlIGtleVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdG8gYSBsaXN0IHNvIHRoYXQgaXQgY2FuIGJlIGhhbmRsZWQgYXQgdGhlIHZlcnkgZW5kLlxuICAgICAgICAgICAgICAgICAgICAgICAgYWRkS2V5ZWRSZW1vdmFsKGtleSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBPbmx5IHJlcG9ydCB0aGUgbm9kZSBhcyBkaXNjYXJkZWQgaWYgaXQgaXMgbm90IGtleWVkLiBXZSBkbyB0aGlzIGJlY2F1c2VcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGF0IHRoZSBlbmQgd2UgbG9vcCB0aHJvdWdoIGFsbCBrZXllZCBlbGVtZW50cyB0aGF0IHdlcmUgdW5tYXRjaGVkXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBhbmQgdGhlbiBkaXNjYXJkIHRoZW0gaW4gb25lIGZpbmFsIHBhc3MuXG4gICAgICAgICAgICAgICAgICAgICAgICBvbk5vZGVEaXNjYXJkZWQoY3VyQ2hpbGQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1ckNoaWxkLmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3YWxrRGlzY2FyZGVkQ2hpbGROb2RlcyhjdXJDaGlsZCwgc2tpcEtleWVkTm9kZXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY3VyQ2hpbGQgPSBjdXJDaGlsZC5uZXh0U2libGluZztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVtb3ZlcyBhIERPTSBub2RlIG91dCBvZiB0aGUgb3JpZ2luYWwgRE9NXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSAge05vZGV9IG5vZGUgVGhlIG5vZGUgdG8gcmVtb3ZlXG4gICAgICAgICAqIEBwYXJhbSAge05vZGV9IHBhcmVudE5vZGUgVGhlIG5vZGVzIHBhcmVudFxuICAgICAgICAgKiBAcGFyYW0gIHtCb29sZWFufSBza2lwS2V5ZWROb2RlcyBJZiB0cnVlIHRoZW4gZWxlbWVudHMgd2l0aCBrZXlzIHdpbGwgYmUgc2tpcHBlZCBhbmQgbm90IGRpc2NhcmRlZC5cbiAgICAgICAgICogQHJldHVybiB7dW5kZWZpbmVkfVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gcmVtb3ZlTm9kZShub2RlLCBwYXJlbnROb2RlLCBza2lwS2V5ZWROb2Rlcykge1xuICAgICAgICAgICAgaWYgKG9uQmVmb3JlTm9kZURpc2NhcmRlZChub2RlKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChwYXJlbnROb2RlKSB7XG4gICAgICAgICAgICAgICAgcGFyZW50Tm9kZS5yZW1vdmVDaGlsZChub2RlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgb25Ob2RlRGlzY2FyZGVkKG5vZGUpO1xuICAgICAgICAgICAgd2Fsa0Rpc2NhcmRlZENoaWxkTm9kZXMobm9kZSwgc2tpcEtleWVkTm9kZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gLy8gVHJlZVdhbGtlciBpbXBsZW1lbnRhdGlvbiBpcyBubyBmYXN0ZXIsIGJ1dCBrZWVwaW5nIHRoaXMgYXJvdW5kIGluIGNhc2UgdGhpcyBjaGFuZ2VzIGluIHRoZSBmdXR1cmVcbiAgICAgICAgLy8gZnVuY3Rpb24gaW5kZXhUcmVlKHJvb3QpIHtcbiAgICAgICAgLy8gICAgIHZhciB0cmVlV2Fsa2VyID0gZG9jdW1lbnQuY3JlYXRlVHJlZVdhbGtlcihcbiAgICAgICAgLy8gICAgICAgICByb290LFxuICAgICAgICAvLyAgICAgICAgIE5vZGVGaWx0ZXIuU0hPV19FTEVNRU5UKTtcbiAgICAgICAgLy9cbiAgICAgICAgLy8gICAgIHZhciBlbDtcbiAgICAgICAgLy8gICAgIHdoaWxlKChlbCA9IHRyZWVXYWxrZXIubmV4dE5vZGUoKSkpIHtcbiAgICAgICAgLy8gICAgICAgICB2YXIga2V5ID0gZ2V0Tm9kZUtleShlbCk7XG4gICAgICAgIC8vICAgICAgICAgaWYgKGtleSkge1xuICAgICAgICAvLyAgICAgICAgICAgICBmcm9tTm9kZXNMb29rdXBba2V5XSA9IGVsO1xuICAgICAgICAvLyAgICAgICAgIH1cbiAgICAgICAgLy8gICAgIH1cbiAgICAgICAgLy8gfVxuXG4gICAgICAgIC8vIC8vIE5vZGVJdGVyYXRvciBpbXBsZW1lbnRhdGlvbiBpcyBubyBmYXN0ZXIsIGJ1dCBrZWVwaW5nIHRoaXMgYXJvdW5kIGluIGNhc2UgdGhpcyBjaGFuZ2VzIGluIHRoZSBmdXR1cmVcbiAgICAgICAgLy9cbiAgICAgICAgLy8gZnVuY3Rpb24gaW5kZXhUcmVlKG5vZGUpIHtcbiAgICAgICAgLy8gICAgIHZhciBub2RlSXRlcmF0b3IgPSBkb2N1bWVudC5jcmVhdGVOb2RlSXRlcmF0b3Iobm9kZSwgTm9kZUZpbHRlci5TSE9XX0VMRU1FTlQpO1xuICAgICAgICAvLyAgICAgdmFyIGVsO1xuICAgICAgICAvLyAgICAgd2hpbGUoKGVsID0gbm9kZUl0ZXJhdG9yLm5leHROb2RlKCkpKSB7XG4gICAgICAgIC8vICAgICAgICAgdmFyIGtleSA9IGdldE5vZGVLZXkoZWwpO1xuICAgICAgICAvLyAgICAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgZnJvbU5vZGVzTG9va3VwW2tleV0gPSBlbDtcbiAgICAgICAgLy8gICAgICAgICB9XG4gICAgICAgIC8vICAgICB9XG4gICAgICAgIC8vIH1cblxuICAgICAgICBmdW5jdGlvbiBpbmRleFRyZWUobm9kZSkge1xuICAgICAgICAgICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IEVMRU1FTlRfTk9ERSB8fCBub2RlLm5vZGVUeXBlID09PSBET0NVTUVOVF9GUkFHTUVOVF9OT0RFJDEpIHtcbiAgICAgICAgICAgICAgICB2YXIgY3VyQ2hpbGQgPSBub2RlLmZpcnN0Q2hpbGQ7XG4gICAgICAgICAgICAgICAgd2hpbGUgKGN1ckNoaWxkKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBrZXkgPSBnZXROb2RlS2V5KGN1ckNoaWxkKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZnJvbU5vZGVzTG9va3VwW2tleV0gPSBjdXJDaGlsZDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIFdhbGsgcmVjdXJzaXZlbHlcbiAgICAgICAgICAgICAgICAgICAgaW5kZXhUcmVlKGN1ckNoaWxkKTtcblxuICAgICAgICAgICAgICAgICAgICBjdXJDaGlsZCA9IGN1ckNoaWxkLm5leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGluZGV4VHJlZShmcm9tTm9kZSk7XG5cbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlTm9kZUFkZGVkKGVsKSB7XG4gICAgICAgICAgICBvbk5vZGVBZGRlZChlbCk7XG5cbiAgICAgICAgICAgIHZhciBjdXJDaGlsZCA9IGVsLmZpcnN0Q2hpbGQ7XG4gICAgICAgICAgICB3aGlsZSAoY3VyQ2hpbGQpIHtcbiAgICAgICAgICAgICAgICB2YXIgbmV4dFNpYmxpbmcgPSBjdXJDaGlsZC5uZXh0U2libGluZztcblxuICAgICAgICAgICAgICAgIHZhciBrZXkgPSBnZXROb2RlS2V5KGN1ckNoaWxkKTtcbiAgICAgICAgICAgICAgICBpZiAoa2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB1bm1hdGNoZWRGcm9tRWwgPSBmcm9tTm9kZXNMb29rdXBba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgd2UgZmluZCBhIGR1cGxpY2F0ZSAjaWQgbm9kZSBpbiBjYWNoZSwgcmVwbGFjZSBgZWxgIHdpdGggY2FjaGUgdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgLy8gYW5kIG1vcnBoIGl0IHRvIHRoZSBjaGlsZCBub2RlLlxuICAgICAgICAgICAgICAgICAgICBpZiAodW5tYXRjaGVkRnJvbUVsICYmIGNvbXBhcmVOb2RlTmFtZXMoY3VyQ2hpbGQsIHVubWF0Y2hlZEZyb21FbCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1ckNoaWxkLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKHVubWF0Y2hlZEZyb21FbCwgY3VyQ2hpbGQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbW9ycGhFbCh1bm1hdGNoZWRGcm9tRWwsIGN1ckNoaWxkKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVOb2RlQWRkZWQoY3VyQ2hpbGQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIC8vIHJlY3Vyc2l2ZWx5IGNhbGwgZm9yIGN1ckNoaWxkIGFuZCBpdCdzIGNoaWxkcmVuIHRvIHNlZSBpZiB3ZSBmaW5kIHNvbWV0aGluZyBpblxuICAgICAgICAgICAgICAgICAgLy8gZnJvbU5vZGVzTG9va3VwXG4gICAgICAgICAgICAgICAgICBoYW5kbGVOb2RlQWRkZWQoY3VyQ2hpbGQpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGN1ckNoaWxkID0gbmV4dFNpYmxpbmc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBjbGVhbnVwRnJvbUVsKGZyb21FbCwgY3VyRnJvbU5vZGVDaGlsZCwgY3VyRnJvbU5vZGVLZXkpIHtcbiAgICAgICAgICAgIC8vIFdlIGhhdmUgcHJvY2Vzc2VkIGFsbCBvZiB0aGUgXCJ0byBub2Rlc1wiLiBJZiBjdXJGcm9tTm9kZUNoaWxkIGlzXG4gICAgICAgICAgICAvLyBub24tbnVsbCB0aGVuIHdlIHN0aWxsIGhhdmUgc29tZSBmcm9tIG5vZGVzIGxlZnQgb3ZlciB0aGF0IG5lZWRcbiAgICAgICAgICAgIC8vIHRvIGJlIHJlbW92ZWRcbiAgICAgICAgICAgIHdoaWxlIChjdXJGcm9tTm9kZUNoaWxkKSB7XG4gICAgICAgICAgICAgICAgdmFyIGZyb21OZXh0U2libGluZyA9IGN1ckZyb21Ob2RlQ2hpbGQubmV4dFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgaWYgKChjdXJGcm9tTm9kZUtleSA9IGdldE5vZGVLZXkoY3VyRnJvbU5vZGVDaGlsZCkpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFNpbmNlIHRoZSBub2RlIGlzIGtleWVkIGl0IG1pZ2h0IGJlIG1hdGNoZWQgdXAgbGF0ZXIgc28gd2UgZGVmZXJcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhlIGFjdHVhbCByZW1vdmFsIHRvIGxhdGVyXG4gICAgICAgICAgICAgICAgICAgIGFkZEtleWVkUmVtb3ZhbChjdXJGcm9tTm9kZUtleSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gTk9URTogd2Ugc2tpcCBuZXN0ZWQga2V5ZWQgbm9kZXMgZnJvbSBiZWluZyByZW1vdmVkIHNpbmNlIHRoZXJlIGlzXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgIHN0aWxsIGEgY2hhbmNlIHRoZXkgd2lsbCBiZSBtYXRjaGVkIHVwIGxhdGVyXG4gICAgICAgICAgICAgICAgICAgIHJlbW92ZU5vZGUoY3VyRnJvbU5vZGVDaGlsZCwgZnJvbUVsLCB0cnVlIC8qIHNraXAga2V5ZWQgbm9kZXMgKi8pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjdXJGcm9tTm9kZUNoaWxkID0gZnJvbU5leHRTaWJsaW5nO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gbW9ycGhFbChmcm9tRWwsIHRvRWwsIGNoaWxkcmVuT25seSkge1xuICAgICAgICAgICAgdmFyIHRvRWxLZXkgPSBnZXROb2RlS2V5KHRvRWwpO1xuXG4gICAgICAgICAgICBpZiAodG9FbEtleSkge1xuICAgICAgICAgICAgICAgIC8vIElmIGFuIGVsZW1lbnQgd2l0aCBhbiBJRCBpcyBiZWluZyBtb3JwaGVkIHRoZW4gaXQgd2lsbCBiZSBpbiB0aGUgZmluYWxcbiAgICAgICAgICAgICAgICAvLyBET00gc28gY2xlYXIgaXQgb3V0IG9mIHRoZSBzYXZlZCBlbGVtZW50cyBjb2xsZWN0aW9uXG4gICAgICAgICAgICAgICAgZGVsZXRlIGZyb21Ob2Rlc0xvb2t1cFt0b0VsS2V5XTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFjaGlsZHJlbk9ubHkpIHtcbiAgICAgICAgICAgICAgICAvLyBvcHRpb25hbFxuICAgICAgICAgICAgICAgIGlmIChvbkJlZm9yZUVsVXBkYXRlZChmcm9tRWwsIHRvRWwpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gdXBkYXRlIGF0dHJpYnV0ZXMgb24gb3JpZ2luYWwgRE9NIGVsZW1lbnQgZmlyc3RcbiAgICAgICAgICAgICAgICBtb3JwaEF0dHJzKGZyb21FbCwgdG9FbCk7XG4gICAgICAgICAgICAgICAgLy8gb3B0aW9uYWxcbiAgICAgICAgICAgICAgICBvbkVsVXBkYXRlZChmcm9tRWwpO1xuXG4gICAgICAgICAgICAgICAgaWYgKG9uQmVmb3JlRWxDaGlsZHJlblVwZGF0ZWQoZnJvbUVsLCB0b0VsKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGZyb21FbC5ub2RlTmFtZSAhPT0gJ1RFWFRBUkVBJykge1xuICAgICAgICAgICAgICBtb3JwaENoaWxkcmVuKGZyb21FbCwgdG9FbCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBzcGVjaWFsRWxIYW5kbGVycy5URVhUQVJFQShmcm9tRWwsIHRvRWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gbW9ycGhDaGlsZHJlbihmcm9tRWwsIHRvRWwpIHtcbiAgICAgICAgICAgIHZhciBjdXJUb05vZGVDaGlsZCA9IHRvRWwuZmlyc3RDaGlsZDtcbiAgICAgICAgICAgIHZhciBjdXJGcm9tTm9kZUNoaWxkID0gZnJvbUVsLmZpcnN0Q2hpbGQ7XG4gICAgICAgICAgICB2YXIgY3VyVG9Ob2RlS2V5O1xuICAgICAgICAgICAgdmFyIGN1ckZyb21Ob2RlS2V5O1xuXG4gICAgICAgICAgICB2YXIgZnJvbU5leHRTaWJsaW5nO1xuICAgICAgICAgICAgdmFyIHRvTmV4dFNpYmxpbmc7XG4gICAgICAgICAgICB2YXIgbWF0Y2hpbmdGcm9tRWw7XG5cbiAgICAgICAgICAgIC8vIHdhbGsgdGhlIGNoaWxkcmVuXG4gICAgICAgICAgICBvdXRlcjogd2hpbGUgKGN1clRvTm9kZUNoaWxkKSB7XG4gICAgICAgICAgICAgICAgdG9OZXh0U2libGluZyA9IGN1clRvTm9kZUNoaWxkLm5leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgIGN1clRvTm9kZUtleSA9IGdldE5vZGVLZXkoY3VyVG9Ob2RlQ2hpbGQpO1xuXG4gICAgICAgICAgICAgICAgLy8gd2FsayB0aGUgZnJvbU5vZGUgY2hpbGRyZW4gYWxsIHRoZSB3YXkgdGhyb3VnaFxuICAgICAgICAgICAgICAgIHdoaWxlIChjdXJGcm9tTm9kZUNoaWxkKSB7XG4gICAgICAgICAgICAgICAgICAgIGZyb21OZXh0U2libGluZyA9IGN1ckZyb21Ob2RlQ2hpbGQubmV4dFNpYmxpbmc7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1clRvTm9kZUNoaWxkLmlzU2FtZU5vZGUgJiYgY3VyVG9Ob2RlQ2hpbGQuaXNTYW1lTm9kZShjdXJGcm9tTm9kZUNoaWxkKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VyVG9Ob2RlQ2hpbGQgPSB0b05leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCA9IGZyb21OZXh0U2libGluZztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlIG91dGVyO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY3VyRnJvbU5vZGVLZXkgPSBnZXROb2RlS2V5KGN1ckZyb21Ob2RlQ2hpbGQpO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBjdXJGcm9tTm9kZVR5cGUgPSBjdXJGcm9tTm9kZUNoaWxkLm5vZGVUeXBlO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIHRoaXMgbWVhbnMgaWYgdGhlIGN1ckZyb21Ob2RlQ2hpbGQgZG9lc250IGhhdmUgYSBtYXRjaCB3aXRoIHRoZSBjdXJUb05vZGVDaGlsZFxuICAgICAgICAgICAgICAgICAgICB2YXIgaXNDb21wYXRpYmxlID0gdW5kZWZpbmVkO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJGcm9tTm9kZVR5cGUgPT09IGN1clRvTm9kZUNoaWxkLm5vZGVUeXBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3VyRnJvbU5vZGVUeXBlID09PSBFTEVNRU5UX05PREUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBCb3RoIG5vZGVzIGJlaW5nIGNvbXBhcmVkIGFyZSBFbGVtZW50IG5vZGVzXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3VyVG9Ob2RlS2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRoZSB0YXJnZXQgbm9kZSBoYXMgYSBrZXkgc28gd2Ugd2FudCB0byBtYXRjaCBpdCB1cCB3aXRoIHRoZSBjb3JyZWN0IGVsZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaW4gdGhlIG9yaWdpbmFsIERPTSB0cmVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdXJUb05vZGVLZXkgIT09IGN1ckZyb21Ob2RlS2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUaGUgY3VycmVudCBlbGVtZW50IGluIHRoZSBvcmlnaW5hbCBET00gdHJlZSBkb2VzIG5vdCBoYXZlIGEgbWF0Y2hpbmcga2V5IHNvXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBsZXQncyBjaGVjayBvdXIgbG9va3VwIHRvIHNlZSBpZiB0aGVyZSBpcyBhIG1hdGNoaW5nIGVsZW1lbnQgaW4gdGhlIG9yaWdpbmFsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBET00gdHJlZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKChtYXRjaGluZ0Zyb21FbCA9IGZyb21Ob2Rlc0xvb2t1cFtjdXJUb05vZGVLZXldKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmcm9tTmV4dFNpYmxpbmcgPT09IG1hdGNoaW5nRnJvbUVsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNwZWNpYWwgY2FzZSBmb3Igc2luZ2xlIGVsZW1lbnQgcmVtb3ZhbHMuIFRvIGF2b2lkIHJlbW92aW5nIHRoZSBvcmlnaW5hbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBET00gbm9kZSBvdXQgb2YgdGhlIHRyZWUgKHNpbmNlIHRoYXQgY2FuIGJyZWFrIENTUyB0cmFuc2l0aW9ucywgZXRjLiksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHdlIHdpbGwgaW5zdGVhZCBkaXNjYXJkIHRoZSBjdXJyZW50IG5vZGUgYW5kIHdhaXQgdW50aWwgdGhlIG5leHRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaXRlcmF0aW9uIHRvIHByb3Blcmx5IG1hdGNoIHVwIHRoZSBrZXllZCB0YXJnZXQgZWxlbWVudCB3aXRoIGl0cyBtYXRjaGluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBlbGVtZW50IGluIHRoZSBvcmlnaW5hbCB0cmVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzQ29tcGF0aWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdlIGZvdW5kIGEgbWF0Y2hpbmcga2V5ZWQgZWxlbWVudCBzb21ld2hlcmUgaW4gdGhlIG9yaWdpbmFsIERPTSB0cmVlLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBMZXQncyBtb3ZlIHRoZSBvcmlnaW5hbCBET00gbm9kZSBpbnRvIHRoZSBjdXJyZW50IHBvc2l0aW9uIGFuZCBtb3JwaFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpdC5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBOT1RFOiBXZSB1c2UgaW5zZXJ0QmVmb3JlIGluc3RlYWQgb2YgcmVwbGFjZUNoaWxkIGJlY2F1c2Ugd2Ugd2FudCB0byBnbyB0aHJvdWdoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoZSBgcmVtb3ZlTm9kZSgpYCBmdW5jdGlvbiBmb3IgdGhlIG5vZGUgdGhhdCBpcyBiZWluZyBkaXNjYXJkZWQgc28gdGhhdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhbGwgbGlmZWN5Y2xlIGhvb2tzIGFyZSBjb3JyZWN0bHkgaW52b2tlZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tRWwuaW5zZXJ0QmVmb3JlKG1hdGNoaW5nRnJvbUVsLCBjdXJGcm9tTm9kZUNoaWxkKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBmcm9tTmV4dFNpYmxpbmcgPSBjdXJGcm9tTm9kZUNoaWxkLm5leHRTaWJsaW5nO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdXJGcm9tTm9kZUtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU2luY2UgdGhlIG5vZGUgaXMga2V5ZWQgaXQgbWlnaHQgYmUgbWF0Y2hlZCB1cCBsYXRlciBzbyB3ZSBkZWZlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhlIGFjdHVhbCByZW1vdmFsIHRvIGxhdGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRLZXllZFJlbW92YWwoY3VyRnJvbU5vZGVLZXkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTk9URTogd2Ugc2tpcCBuZXN0ZWQga2V5ZWQgbm9kZXMgZnJvbSBiZWluZyByZW1vdmVkIHNpbmNlIHRoZXJlIGlzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICBzdGlsbCBhIGNoYW5jZSB0aGV5IHdpbGwgYmUgbWF0Y2hlZCB1cCBsYXRlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlTm9kZShjdXJGcm9tTm9kZUNoaWxkLCBmcm9tRWwsIHRydWUgLyogc2tpcCBrZXllZCBub2RlcyAqLyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJGcm9tTm9kZUNoaWxkID0gbWF0Y2hpbmdGcm9tRWw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUaGUgbm9kZXMgYXJlIG5vdCBjb21wYXRpYmxlIHNpbmNlIHRoZSBcInRvXCIgbm9kZSBoYXMgYSBrZXkgYW5kIHRoZXJlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaXMgbm8gbWF0Y2hpbmcga2V5ZWQgbm9kZSBpbiB0aGUgc291cmNlIHRyZWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0NvbXBhdGlibGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY3VyRnJvbU5vZGVLZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGhlIG9yaWdpbmFsIGhhcyBhIGtleVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0NvbXBhdGlibGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0NvbXBhdGlibGUgPSBpc0NvbXBhdGlibGUgIT09IGZhbHNlICYmIGNvbXBhcmVOb2RlTmFtZXMoY3VyRnJvbU5vZGVDaGlsZCwgY3VyVG9Ob2RlQ2hpbGQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc0NvbXBhdGlibGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2UgZm91bmQgY29tcGF0aWJsZSBET00gZWxlbWVudHMgc28gdHJhbnNmb3JtXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoZSBjdXJyZW50IFwiZnJvbVwiIG5vZGUgdG8gbWF0Y2ggdGhlIGN1cnJlbnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGFyZ2V0IERPTSBub2RlLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBNT1JQSFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb3JwaEVsKGN1ckZyb21Ob2RlQ2hpbGQsIGN1clRvTm9kZUNoaWxkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY3VyRnJvbU5vZGVUeXBlID09PSBURVhUX05PREUgfHwgY3VyRnJvbU5vZGVUeXBlID09IENPTU1FTlRfTk9ERSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEJvdGggbm9kZXMgYmVpbmcgY29tcGFyZWQgYXJlIFRleHQgb3IgQ29tbWVudCBub2Rlc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzQ29tcGF0aWJsZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU2ltcGx5IHVwZGF0ZSBub2RlVmFsdWUgb24gdGhlIG9yaWdpbmFsIG5vZGUgdG9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjaGFuZ2UgdGhlIHRleHQgdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3VyRnJvbU5vZGVDaGlsZC5ub2RlVmFsdWUgIT09IGN1clRvTm9kZUNoaWxkLm5vZGVWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJGcm9tTm9kZUNoaWxkLm5vZGVWYWx1ZSA9IGN1clRvTm9kZUNoaWxkLm5vZGVWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc0NvbXBhdGlibGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFkdmFuY2UgYm90aCB0aGUgXCJ0b1wiIGNoaWxkIGFuZCB0aGUgXCJmcm9tXCIgY2hpbGQgc2luY2Ugd2UgZm91bmQgYSBtYXRjaFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gTm90aGluZyBlbHNlIHRvIGRvIGFzIHdlIGFscmVhZHkgcmVjdXJzaXZlbHkgY2FsbGVkIG1vcnBoQ2hpbGRyZW4gYWJvdmVcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1clRvTm9kZUNoaWxkID0gdG9OZXh0U2libGluZztcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQgPSBmcm9tTmV4dFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZSBvdXRlcjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIE5vIGNvbXBhdGlibGUgbWF0Y2ggc28gcmVtb3ZlIHRoZSBvbGQgbm9kZSBmcm9tIHRoZSBET00gYW5kIGNvbnRpbnVlIHRyeWluZyB0byBmaW5kIGFcbiAgICAgICAgICAgICAgICAgICAgLy8gbWF0Y2ggaW4gdGhlIG9yaWdpbmFsIERPTS4gSG93ZXZlciwgd2Ugb25seSBkbyB0aGlzIGlmIHRoZSBmcm9tIG5vZGUgaXMgbm90IGtleWVkXG4gICAgICAgICAgICAgICAgICAgIC8vIHNpbmNlIGl0IGlzIHBvc3NpYmxlIHRoYXQgYSBrZXllZCBub2RlIG1pZ2h0IG1hdGNoIHVwIHdpdGggYSBub2RlIHNvbWV3aGVyZSBlbHNlIGluIHRoZVxuICAgICAgICAgICAgICAgICAgICAvLyB0YXJnZXQgdHJlZSBhbmQgd2UgZG9uJ3Qgd2FudCB0byBkaXNjYXJkIGl0IGp1c3QgeWV0IHNpbmNlIGl0IHN0aWxsIG1pZ2h0IGZpbmQgYVxuICAgICAgICAgICAgICAgICAgICAvLyBob21lIGluIHRoZSBmaW5hbCBET00gdHJlZS4gQWZ0ZXIgZXZlcnl0aGluZyBpcyBkb25lIHdlIHdpbGwgcmVtb3ZlIGFueSBrZXllZCBub2Rlc1xuICAgICAgICAgICAgICAgICAgICAvLyB0aGF0IGRpZG4ndCBmaW5kIGEgaG9tZVxuICAgICAgICAgICAgICAgICAgICBpZiAoY3VyRnJvbU5vZGVLZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNpbmNlIHRoZSBub2RlIGlzIGtleWVkIGl0IG1pZ2h0IGJlIG1hdGNoZWQgdXAgbGF0ZXIgc28gd2UgZGVmZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoZSBhY3R1YWwgcmVtb3ZhbCB0byBsYXRlclxuICAgICAgICAgICAgICAgICAgICAgICAgYWRkS2V5ZWRSZW1vdmFsKGN1ckZyb21Ob2RlS2V5KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5PVEU6IHdlIHNraXAgbmVzdGVkIGtleWVkIG5vZGVzIGZyb20gYmVpbmcgcmVtb3ZlZCBzaW5jZSB0aGVyZSBpc1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgc3RpbGwgYSBjaGFuY2UgdGhleSB3aWxsIGJlIG1hdGNoZWQgdXAgbGF0ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbW92ZU5vZGUoY3VyRnJvbU5vZGVDaGlsZCwgZnJvbUVsLCB0cnVlIC8qIHNraXAga2V5ZWQgbm9kZXMgKi8pO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCA9IGZyb21OZXh0U2libGluZztcbiAgICAgICAgICAgICAgICB9IC8vIEVORDogd2hpbGUoY3VyRnJvbU5vZGVDaGlsZCkge31cblxuICAgICAgICAgICAgICAgIC8vIElmIHdlIGdvdCB0aGlzIGZhciB0aGVuIHdlIGRpZCBub3QgZmluZCBhIGNhbmRpZGF0ZSBtYXRjaCBmb3JcbiAgICAgICAgICAgICAgICAvLyBvdXIgXCJ0byBub2RlXCIgYW5kIHdlIGV4aGF1c3RlZCBhbGwgb2YgdGhlIGNoaWxkcmVuIFwiZnJvbVwiXG4gICAgICAgICAgICAgICAgLy8gbm9kZXMuIFRoZXJlZm9yZSwgd2Ugd2lsbCBqdXN0IGFwcGVuZCB0aGUgY3VycmVudCBcInRvXCIgbm9kZVxuICAgICAgICAgICAgICAgIC8vIHRvIHRoZSBlbmRcbiAgICAgICAgICAgICAgICBpZiAoY3VyVG9Ob2RlS2V5ICYmIChtYXRjaGluZ0Zyb21FbCA9IGZyb21Ob2Rlc0xvb2t1cFtjdXJUb05vZGVLZXldKSAmJiBjb21wYXJlTm9kZU5hbWVzKG1hdGNoaW5nRnJvbUVsLCBjdXJUb05vZGVDaGlsZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgZnJvbUVsLmFwcGVuZENoaWxkKG1hdGNoaW5nRnJvbUVsKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gTU9SUEhcbiAgICAgICAgICAgICAgICAgICAgbW9ycGhFbChtYXRjaGluZ0Zyb21FbCwgY3VyVG9Ob2RlQ2hpbGQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBvbkJlZm9yZU5vZGVBZGRlZFJlc3VsdCA9IG9uQmVmb3JlTm9kZUFkZGVkKGN1clRvTm9kZUNoaWxkKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9uQmVmb3JlTm9kZUFkZGVkUmVzdWx0ICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9uQmVmb3JlTm9kZUFkZGVkUmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VyVG9Ob2RlQ2hpbGQgPSBvbkJlZm9yZU5vZGVBZGRlZFJlc3VsdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1clRvTm9kZUNoaWxkLmFjdHVhbGl6ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1clRvTm9kZUNoaWxkID0gY3VyVG9Ob2RlQ2hpbGQuYWN0dWFsaXplKGZyb21FbC5vd25lckRvY3VtZW50IHx8IGRvYyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBmcm9tRWwuYXBwZW5kQ2hpbGQoY3VyVG9Ob2RlQ2hpbGQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlTm9kZUFkZGVkKGN1clRvTm9kZUNoaWxkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGN1clRvTm9kZUNoaWxkID0gdG9OZXh0U2libGluZztcbiAgICAgICAgICAgICAgICBjdXJGcm9tTm9kZUNoaWxkID0gZnJvbU5leHRTaWJsaW5nO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjbGVhbnVwRnJvbUVsKGZyb21FbCwgY3VyRnJvbU5vZGVDaGlsZCwgY3VyRnJvbU5vZGVLZXkpO1xuXG4gICAgICAgICAgICB2YXIgc3BlY2lhbEVsSGFuZGxlciA9IHNwZWNpYWxFbEhhbmRsZXJzW2Zyb21FbC5ub2RlTmFtZV07XG4gICAgICAgICAgICBpZiAoc3BlY2lhbEVsSGFuZGxlcikge1xuICAgICAgICAgICAgICAgIHNwZWNpYWxFbEhhbmRsZXIoZnJvbUVsLCB0b0VsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSAvLyBFTkQ6IG1vcnBoQ2hpbGRyZW4oLi4uKVxuXG4gICAgICAgIHZhciBtb3JwaGVkTm9kZSA9IGZyb21Ob2RlO1xuICAgICAgICB2YXIgbW9ycGhlZE5vZGVUeXBlID0gbW9ycGhlZE5vZGUubm9kZVR5cGU7XG4gICAgICAgIHZhciB0b05vZGVUeXBlID0gdG9Ob2RlLm5vZGVUeXBlO1xuXG4gICAgICAgIGlmICghY2hpbGRyZW5Pbmx5KSB7XG4gICAgICAgICAgICAvLyBIYW5kbGUgdGhlIGNhc2Ugd2hlcmUgd2UgYXJlIGdpdmVuIHR3byBET00gbm9kZXMgdGhhdCBhcmUgbm90XG4gICAgICAgICAgICAvLyBjb21wYXRpYmxlIChlLmcuIDxkaXY+IC0tPiA8c3Bhbj4gb3IgPGRpdj4gLS0+IFRFWFQpXG4gICAgICAgICAgICBpZiAobW9ycGhlZE5vZGVUeXBlID09PSBFTEVNRU5UX05PREUpIHtcbiAgICAgICAgICAgICAgICBpZiAodG9Ob2RlVHlwZSA9PT0gRUxFTUVOVF9OT0RFKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghY29tcGFyZU5vZGVOYW1lcyhmcm9tTm9kZSwgdG9Ob2RlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb25Ob2RlRGlzY2FyZGVkKGZyb21Ob2RlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vcnBoZWROb2RlID0gbW92ZUNoaWxkcmVuKGZyb21Ob2RlLCBjcmVhdGVFbGVtZW50TlModG9Ob2RlLm5vZGVOYW1lLCB0b05vZGUubmFtZXNwYWNlVVJJKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBHb2luZyBmcm9tIGFuIGVsZW1lbnQgbm9kZSB0byBhIHRleHQgbm9kZVxuICAgICAgICAgICAgICAgICAgICBtb3JwaGVkTm9kZSA9IHRvTm9kZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG1vcnBoZWROb2RlVHlwZSA9PT0gVEVYVF9OT0RFIHx8IG1vcnBoZWROb2RlVHlwZSA9PT0gQ09NTUVOVF9OT0RFKSB7IC8vIFRleHQgb3IgY29tbWVudCBub2RlXG4gICAgICAgICAgICAgICAgaWYgKHRvTm9kZVR5cGUgPT09IG1vcnBoZWROb2RlVHlwZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAobW9ycGhlZE5vZGUubm9kZVZhbHVlICE9PSB0b05vZGUubm9kZVZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtb3JwaGVkTm9kZS5ub2RlVmFsdWUgPSB0b05vZGUubm9kZVZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1vcnBoZWROb2RlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFRleHQgbm9kZSB0byBzb21ldGhpbmcgZWxzZVxuICAgICAgICAgICAgICAgICAgICBtb3JwaGVkTm9kZSA9IHRvTm9kZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobW9ycGhlZE5vZGUgPT09IHRvTm9kZSkge1xuICAgICAgICAgICAgLy8gVGhlIFwidG8gbm9kZVwiIHdhcyBub3QgY29tcGF0aWJsZSB3aXRoIHRoZSBcImZyb20gbm9kZVwiIHNvIHdlIGhhZCB0b1xuICAgICAgICAgICAgLy8gdG9zcyBvdXQgdGhlIFwiZnJvbSBub2RlXCIgYW5kIHVzZSB0aGUgXCJ0byBub2RlXCJcbiAgICAgICAgICAgIG9uTm9kZURpc2NhcmRlZChmcm9tTm9kZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodG9Ob2RlLmlzU2FtZU5vZGUgJiYgdG9Ob2RlLmlzU2FtZU5vZGUobW9ycGhlZE5vZGUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBtb3JwaEVsKG1vcnBoZWROb2RlLCB0b05vZGUsIGNoaWxkcmVuT25seSk7XG5cbiAgICAgICAgICAgIC8vIFdlIG5vdyBuZWVkIHRvIGxvb3Agb3ZlciBhbnkga2V5ZWQgbm9kZXMgdGhhdCBtaWdodCBuZWVkIHRvIGJlXG4gICAgICAgICAgICAvLyByZW1vdmVkLiBXZSBvbmx5IGRvIHRoZSByZW1vdmFsIGlmIHdlIGtub3cgdGhhdCB0aGUga2V5ZWQgbm9kZVxuICAgICAgICAgICAgLy8gbmV2ZXIgZm91bmQgYSBtYXRjaC4gV2hlbiBhIGtleWVkIG5vZGUgaXMgbWF0Y2hlZCB1cCB3ZSByZW1vdmVcbiAgICAgICAgICAgIC8vIGl0IG91dCBvZiBmcm9tTm9kZXNMb29rdXAgYW5kIHdlIHVzZSBmcm9tTm9kZXNMb29rdXAgdG8gZGV0ZXJtaW5lXG4gICAgICAgICAgICAvLyBpZiBhIGtleWVkIG5vZGUgaGFzIGJlZW4gbWF0Y2hlZCB1cCBvciBub3RcbiAgICAgICAgICAgIGlmIChrZXllZFJlbW92YWxMaXN0KSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaT0wLCBsZW49a2V5ZWRSZW1vdmFsTGlzdC5sZW5ndGg7IGk8bGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVsVG9SZW1vdmUgPSBmcm9tTm9kZXNMb29rdXBba2V5ZWRSZW1vdmFsTGlzdFtpXV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChlbFRvUmVtb3ZlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZW1vdmVOb2RlKGVsVG9SZW1vdmUsIGVsVG9SZW1vdmUucGFyZW50Tm9kZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFjaGlsZHJlbk9ubHkgJiYgbW9ycGhlZE5vZGUgIT09IGZyb21Ob2RlICYmIGZyb21Ob2RlLnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgIGlmIChtb3JwaGVkTm9kZS5hY3R1YWxpemUpIHtcbiAgICAgICAgICAgICAgICBtb3JwaGVkTm9kZSA9IG1vcnBoZWROb2RlLmFjdHVhbGl6ZShmcm9tTm9kZS5vd25lckRvY3VtZW50IHx8IGRvYyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBJZiB3ZSBoYWQgdG8gc3dhcCBvdXQgdGhlIGZyb20gbm9kZSB3aXRoIGEgbmV3IG5vZGUgYmVjYXVzZSB0aGUgb2xkXG4gICAgICAgICAgICAvLyBub2RlIHdhcyBub3QgY29tcGF0aWJsZSB3aXRoIHRoZSB0YXJnZXQgbm9kZSB0aGVuIHdlIG5lZWQgdG9cbiAgICAgICAgICAgIC8vIHJlcGxhY2UgdGhlIG9sZCBET00gbm9kZSBpbiB0aGUgb3JpZ2luYWwgRE9NIHRyZWUuIFRoaXMgaXMgb25seVxuICAgICAgICAgICAgLy8gcG9zc2libGUgaWYgdGhlIG9yaWdpbmFsIERPTSBub2RlIHdhcyBwYXJ0IG9mIGEgRE9NIHRyZWUgd2hpY2hcbiAgICAgICAgICAgIC8vIHdlIGtub3cgaXMgdGhlIGNhc2UgaWYgaXQgaGFzIGEgcGFyZW50IG5vZGUuXG4gICAgICAgICAgICBmcm9tTm9kZS5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChtb3JwaGVkTm9kZSwgZnJvbU5vZGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG1vcnBoZWROb2RlO1xuICAgIH07XG59XG5cbnZhciBtb3JwaGRvbSA9IG1vcnBoZG9tRmFjdG9yeShtb3JwaEF0dHJzKTtcblxuZXhwb3J0IGRlZmF1bHQgbW9ycGhkb207XG4iLCAiaW1wb3J0IHtcbiAgUEhYX0NPTVBPTkVOVCxcbiAgUEhYX0RJU0FCTEVfV0lUSCxcbiAgUEhYX0ZFRURCQUNLX0ZPUixcbiAgUEhYX1BSVU5FLFxuICBQSFhfUk9PVF9JRCxcbiAgUEhYX1NFU1NJT04sXG4gIFBIWF9TS0lQLFxuICBQSFhfU1RBVElDLFxuICBQSFhfVFJJR0dFUl9BQ1RJT04sXG4gIFBIWF9VUERBVEVcbn0gZnJvbSBcIi4vY29uc3RhbnRzXCJcblxuaW1wb3J0IHtcbiAgZGV0ZWN0RHVwbGljYXRlSWRzLFxuICBpc0NpZFxufSBmcm9tIFwiLi91dGlsc1wiXG5cbmltcG9ydCBET00gZnJvbSBcIi4vZG9tXCJcbmltcG9ydCBET01Qb3N0TW9ycGhSZXN0b3JlciBmcm9tIFwiLi9kb21fcG9zdF9tb3JwaF9yZXN0b3JlclwiXG5pbXBvcnQgbW9ycGhkb20gZnJvbSBcIm1vcnBoZG9tXCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRE9NUGF0Y2gge1xuICBzdGF0aWMgcGF0Y2hFbChmcm9tRWwsIHRvRWwsIGFjdGl2ZUVsZW1lbnQpe1xuICAgIG1vcnBoZG9tKGZyb21FbCwgdG9FbCwge1xuICAgICAgY2hpbGRyZW5Pbmx5OiBmYWxzZSxcbiAgICAgIG9uQmVmb3JlRWxVcGRhdGVkOiAoZnJvbUVsLCB0b0VsKSA9PiB7XG4gICAgICAgIGlmKGFjdGl2ZUVsZW1lbnQgJiYgYWN0aXZlRWxlbWVudC5pc1NhbWVOb2RlKGZyb21FbCkgJiYgRE9NLmlzRm9ybUlucHV0KGZyb21FbCkpe1xuICAgICAgICAgIERPTS5tZXJnZUZvY3VzZWRJbnB1dChmcm9tRWwsIHRvRWwpXG4gICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgY29uc3RydWN0b3IodmlldywgY29udGFpbmVyLCBpZCwgaHRtbCwgdGFyZ2V0Q0lEKXtcbiAgICB0aGlzLnZpZXcgPSB2aWV3XG4gICAgdGhpcy5saXZlU29ja2V0ID0gdmlldy5saXZlU29ja2V0XG4gICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXJcbiAgICB0aGlzLmlkID0gaWRcbiAgICB0aGlzLnJvb3RJRCA9IHZpZXcucm9vdC5pZFxuICAgIHRoaXMuaHRtbCA9IGh0bWxcbiAgICB0aGlzLnRhcmdldENJRCA9IHRhcmdldENJRFxuICAgIHRoaXMuY2lkUGF0Y2ggPSBpc0NpZCh0aGlzLnRhcmdldENJRClcbiAgICB0aGlzLmNhbGxiYWNrcyA9IHtcbiAgICAgIGJlZm9yZWFkZGVkOiBbXSwgYmVmb3JldXBkYXRlZDogW10sIGJlZm9yZXBoeENoaWxkQWRkZWQ6IFtdLFxuICAgICAgYWZ0ZXJhZGRlZDogW10sIGFmdGVydXBkYXRlZDogW10sIGFmdGVyZGlzY2FyZGVkOiBbXSwgYWZ0ZXJwaHhDaGlsZEFkZGVkOiBbXSxcbiAgICAgIGFmdGVydHJhbnNpdGlvbnNEaXNjYXJkZWQ6IFtdXG4gICAgfVxuICB9XG5cbiAgYmVmb3JlKGtpbmQsIGNhbGxiYWNrKXsgdGhpcy5jYWxsYmFja3NbYGJlZm9yZSR7a2luZH1gXS5wdXNoKGNhbGxiYWNrKSB9XG4gIGFmdGVyKGtpbmQsIGNhbGxiYWNrKXsgdGhpcy5jYWxsYmFja3NbYGFmdGVyJHtraW5kfWBdLnB1c2goY2FsbGJhY2spIH1cblxuICB0cmFja0JlZm9yZShraW5kLCAuLi5hcmdzKXtcbiAgICB0aGlzLmNhbGxiYWNrc1tgYmVmb3JlJHtraW5kfWBdLmZvckVhY2goY2FsbGJhY2sgPT4gY2FsbGJhY2soLi4uYXJncykpXG4gIH1cblxuICB0cmFja0FmdGVyKGtpbmQsIC4uLmFyZ3Mpe1xuICAgIHRoaXMuY2FsbGJhY2tzW2BhZnRlciR7a2luZH1gXS5mb3JFYWNoKGNhbGxiYWNrID0+IGNhbGxiYWNrKC4uLmFyZ3MpKVxuICB9XG5cbiAgbWFya1BydW5hYmxlQ29udGVudEZvclJlbW92YWwoKXtcbiAgICBET00uYWxsKHRoaXMuY29udGFpbmVyLCBcIltwaHgtdXBkYXRlPWFwcGVuZF0gPiAqLCBbcGh4LXVwZGF0ZT1wcmVwZW5kXSA+ICpcIiwgZWwgPT4ge1xuICAgICAgZWwuc2V0QXR0cmlidXRlKFBIWF9QUlVORSwgXCJcIilcbiAgICB9KVxuICB9XG5cbiAgcGVyZm9ybSgpe1xuICAgIGxldCB7dmlldywgbGl2ZVNvY2tldCwgY29udGFpbmVyLCBodG1sfSA9IHRoaXNcbiAgICBsZXQgdGFyZ2V0Q29udGFpbmVyID0gdGhpcy5pc0NJRFBhdGNoKCkgPyB0aGlzLnRhcmdldENJRENvbnRhaW5lcihodG1sKSA6IGNvbnRhaW5lclxuICAgIGlmKHRoaXMuaXNDSURQYXRjaCgpICYmICF0YXJnZXRDb250YWluZXIpeyByZXR1cm4gfVxuXG4gICAgbGV0IGZvY3VzZWQgPSBsaXZlU29ja2V0LmdldEFjdGl2ZUVsZW1lbnQoKVxuICAgIGxldCB7c2VsZWN0aW9uU3RhcnQsIHNlbGVjdGlvbkVuZH0gPSBmb2N1c2VkICYmIERPTS5oYXNTZWxlY3Rpb25SYW5nZShmb2N1c2VkKSA/IGZvY3VzZWQgOiB7fVxuICAgIGxldCBwaHhVcGRhdGUgPSBsaXZlU29ja2V0LmJpbmRpbmcoUEhYX1VQREFURSlcbiAgICBsZXQgcGh4RmVlZGJhY2tGb3IgPSBsaXZlU29ja2V0LmJpbmRpbmcoUEhYX0ZFRURCQUNLX0ZPUilcbiAgICBsZXQgZGlzYWJsZVdpdGggPSBsaXZlU29ja2V0LmJpbmRpbmcoUEhYX0RJU0FCTEVfV0lUSClcbiAgICBsZXQgcGh4VHJpZ2dlckV4dGVybmFsID0gbGl2ZVNvY2tldC5iaW5kaW5nKFBIWF9UUklHR0VSX0FDVElPTilcbiAgICBsZXQgcGh4UmVtb3ZlID0gbGl2ZVNvY2tldC5iaW5kaW5nKFwicmVtb3ZlXCIpXG4gICAgbGV0IGFkZGVkID0gW11cbiAgICBsZXQgdXBkYXRlcyA9IFtdXG4gICAgbGV0IGFwcGVuZFByZXBlbmRVcGRhdGVzID0gW11cbiAgICBsZXQgcGVuZGluZ1JlbW92ZXMgPSBbXVxuICAgIGxldCBleHRlcm5hbEZvcm1UcmlnZ2VyZWQgPSBudWxsXG5cbiAgICBsZXQgZGlmZkhUTUwgPSBsaXZlU29ja2V0LnRpbWUoXCJwcmVtb3JwaCBjb250YWluZXIgcHJlcFwiLCAoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5idWlsZERpZmZIVE1MKGNvbnRhaW5lciwgaHRtbCwgcGh4VXBkYXRlLCB0YXJnZXRDb250YWluZXIpXG4gICAgfSlcblxuICAgIHRoaXMudHJhY2tCZWZvcmUoXCJhZGRlZFwiLCBjb250YWluZXIpXG4gICAgdGhpcy50cmFja0JlZm9yZShcInVwZGF0ZWRcIiwgY29udGFpbmVyLCBjb250YWluZXIpXG5cbiAgICBsaXZlU29ja2V0LnRpbWUoXCJtb3JwaGRvbVwiLCAoKSA9PiB7XG4gICAgICBtb3JwaGRvbSh0YXJnZXRDb250YWluZXIsIGRpZmZIVE1MLCB7XG4gICAgICAgIGNoaWxkcmVuT25seTogdGFyZ2V0Q29udGFpbmVyLmdldEF0dHJpYnV0ZShQSFhfQ09NUE9ORU5UKSA9PT0gbnVsbCxcbiAgICAgICAgZ2V0Tm9kZUtleTogKG5vZGUpID0+IHtcbiAgICAgICAgICByZXR1cm4gRE9NLmlzUGh4RGVzdHJveWVkKG5vZGUpID8gbnVsbCA6IG5vZGUuaWRcbiAgICAgICAgfSxcbiAgICAgICAgb25CZWZvcmVOb2RlQWRkZWQ6IChlbCkgPT4ge1xuICAgICAgICAgIHRoaXMudHJhY2tCZWZvcmUoXCJhZGRlZFwiLCBlbClcbiAgICAgICAgICByZXR1cm4gZWxcbiAgICAgICAgfSxcbiAgICAgICAgb25Ob2RlQWRkZWQ6IChlbCkgPT4ge1xuICAgICAgICAgIC8vIGhhY2sgdG8gZml4IFNhZmFyaSBoYW5kbGluZyBvZiBpbWcgc3Jjc2V0IGFuZCB2aWRlbyB0YWdzXG4gICAgICAgICAgaWYoZWwgaW5zdGFuY2VvZiBIVE1MSW1hZ2VFbGVtZW50ICYmIGVsLnNyY3NldCl7XG4gICAgICAgICAgICBlbC5zcmNzZXQgPSBlbC5zcmNzZXRcbiAgICAgICAgICB9IGVsc2UgaWYoZWwgaW5zdGFuY2VvZiBIVE1MVmlkZW9FbGVtZW50ICYmIGVsLmF1dG9wbGF5KXtcbiAgICAgICAgICAgIGVsLnBsYXkoKVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZihET00uaXNOb3dUcmlnZ2VyRm9ybUV4dGVybmFsKGVsLCBwaHhUcmlnZ2VyRXh0ZXJuYWwpKXtcbiAgICAgICAgICAgIGV4dGVybmFsRm9ybVRyaWdnZXJlZCA9IGVsXG4gICAgICAgICAgfVxuICAgICAgICAgIC8vaW5wdXQgaGFuZGxpbmdcbiAgICAgICAgICBET00uZGlzY2FyZEVycm9yKHRhcmdldENvbnRhaW5lciwgZWwsIHBoeEZlZWRiYWNrRm9yKVxuICAgICAgICAgIC8vIG5lc3RlZCB2aWV3IGhhbmRsaW5nXG4gICAgICAgICAgaWYoKERPTS5pc1BoeENoaWxkKGVsKSAmJiB2aWV3Lm93bnNFbGVtZW50KGVsKSkgfHwgRE9NLmlzUGh4U3RpY2t5KGVsKSAmJiB2aWV3Lm93bnNFbGVtZW50KGVsLnBhcmVudE5vZGUpKXtcbiAgICAgICAgICAgIHRoaXMudHJhY2tBZnRlcihcInBoeENoaWxkQWRkZWRcIiwgZWwpXG4gICAgICAgICAgfVxuICAgICAgICAgIGFkZGVkLnB1c2goZWwpXG4gICAgICAgIH0sXG4gICAgICAgIG9uTm9kZURpc2NhcmRlZDogKGVsKSA9PiB7XG4gICAgICAgICAgLy8gbmVzdGVkIHZpZXcgaGFuZGxpbmdcbiAgICAgICAgICBpZihET00uaXNQaHhDaGlsZChlbCkgfHwgRE9NLmlzUGh4U3RpY2t5KGVsKSl7IGxpdmVTb2NrZXQuZGVzdHJveVZpZXdCeUVsKGVsKSB9XG4gICAgICAgICAgdGhpcy50cmFja0FmdGVyKFwiZGlzY2FyZGVkXCIsIGVsKVxuICAgICAgICB9LFxuICAgICAgICBvbkJlZm9yZU5vZGVEaXNjYXJkZWQ6IChlbCkgPT4ge1xuICAgICAgICAgIGlmKGVsLmdldEF0dHJpYnV0ZSAmJiBlbC5nZXRBdHRyaWJ1dGUoUEhYX1BSVU5FKSAhPT0gbnVsbCl7IHJldHVybiB0cnVlIH1cbiAgICAgICAgICBpZihlbC5wYXJlbnROb2RlICE9PSBudWxsICYmIERPTS5pc1BoeFVwZGF0ZShlbC5wYXJlbnROb2RlLCBwaHhVcGRhdGUsIFtcImFwcGVuZFwiLCBcInByZXBlbmRcIl0pICYmIGVsLmlkKXsgcmV0dXJuIGZhbHNlIH1cbiAgICAgICAgICBpZihlbC5nZXRBdHRyaWJ1dGUgJiYgZWwuZ2V0QXR0cmlidXRlKHBoeFJlbW92ZSkpe1xuICAgICAgICAgICAgcGVuZGluZ1JlbW92ZXMucHVzaChlbClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZih0aGlzLnNraXBDSURTaWJsaW5nKGVsKSl7IHJldHVybiBmYWxzZSB9XG4gICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgb25FbFVwZGF0ZWQ6IChlbCkgPT4ge1xuICAgICAgICAgIGlmKERPTS5pc05vd1RyaWdnZXJGb3JtRXh0ZXJuYWwoZWwsIHBoeFRyaWdnZXJFeHRlcm5hbCkpe1xuICAgICAgICAgICAgZXh0ZXJuYWxGb3JtVHJpZ2dlcmVkID0gZWxcbiAgICAgICAgICB9XG4gICAgICAgICAgdXBkYXRlcy5wdXNoKGVsKVxuICAgICAgICB9LFxuICAgICAgICBvbkJlZm9yZUVsVXBkYXRlZDogKGZyb21FbCwgdG9FbCkgPT4ge1xuICAgICAgICAgIERPTS5jbGVhbkNoaWxkTm9kZXModG9FbCwgcGh4VXBkYXRlKVxuICAgICAgICAgIGlmKHRoaXMuc2tpcENJRFNpYmxpbmcodG9FbCkpeyByZXR1cm4gZmFsc2UgfVxuICAgICAgICAgIGlmKERPTS5pc1BoeFN0aWNreShmcm9tRWwpKXsgcmV0dXJuIGZhbHNlIH1cbiAgICAgICAgICBpZihET00uaXNJZ25vcmVkKGZyb21FbCwgcGh4VXBkYXRlKSl7XG4gICAgICAgICAgICB0aGlzLnRyYWNrQmVmb3JlKFwidXBkYXRlZFwiLCBmcm9tRWwsIHRvRWwpXG4gICAgICAgICAgICBET00ubWVyZ2VBdHRycyhmcm9tRWwsIHRvRWwsIHtpc0lnbm9yZWQ6IHRydWV9KVxuICAgICAgICAgICAgdXBkYXRlcy5wdXNoKGZyb21FbClcbiAgICAgICAgICAgIERPTS5hcHBseVN0aWNreU9wZXJhdGlvbnMoZnJvbUVsKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmKGZyb21FbC50eXBlID09PSBcIm51bWJlclwiICYmIChmcm9tRWwudmFsaWRpdHkgJiYgZnJvbUVsLnZhbGlkaXR5LmJhZElucHV0KSl7IHJldHVybiBmYWxzZSB9XG4gICAgICAgICAgaWYoIURPTS5zeW5jUGVuZGluZ1JlZihmcm9tRWwsIHRvRWwsIGRpc2FibGVXaXRoKSl7XG4gICAgICAgICAgICBpZihET00uaXNVcGxvYWRJbnB1dChmcm9tRWwpKXtcbiAgICAgICAgICAgICAgdGhpcy50cmFja0JlZm9yZShcInVwZGF0ZWRcIiwgZnJvbUVsLCB0b0VsKVxuICAgICAgICAgICAgICB1cGRhdGVzLnB1c2goZnJvbUVsKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgRE9NLmFwcGx5U3RpY2t5T3BlcmF0aW9ucyhmcm9tRWwpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBuZXN0ZWQgdmlldyBoYW5kbGluZ1xuICAgICAgICAgIGlmKERPTS5pc1BoeENoaWxkKHRvRWwpKXtcbiAgICAgICAgICAgIGxldCBwcmV2U2Vzc2lvbiA9IGZyb21FbC5nZXRBdHRyaWJ1dGUoUEhYX1NFU1NJT04pXG4gICAgICAgICAgICBET00ubWVyZ2VBdHRycyhmcm9tRWwsIHRvRWwsIHtleGNsdWRlOiBbUEhYX1NUQVRJQ119KVxuICAgICAgICAgICAgaWYocHJldlNlc3Npb24gIT09IFwiXCIpeyBmcm9tRWwuc2V0QXR0cmlidXRlKFBIWF9TRVNTSU9OLCBwcmV2U2Vzc2lvbikgfVxuICAgICAgICAgICAgZnJvbUVsLnNldEF0dHJpYnV0ZShQSFhfUk9PVF9JRCwgdGhpcy5yb290SUQpXG4gICAgICAgICAgICBET00uYXBwbHlTdGlja3lPcGVyYXRpb25zKGZyb21FbClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIGlucHV0IGhhbmRsaW5nXG4gICAgICAgICAgRE9NLmNvcHlQcml2YXRlcyh0b0VsLCBmcm9tRWwpXG4gICAgICAgICAgRE9NLmRpc2NhcmRFcnJvcih0YXJnZXRDb250YWluZXIsIHRvRWwsIHBoeEZlZWRiYWNrRm9yKVxuXG4gICAgICAgICAgbGV0IGlzRm9jdXNlZEZvcm1FbCA9IGZvY3VzZWQgJiYgZnJvbUVsLmlzU2FtZU5vZGUoZm9jdXNlZCkgJiYgRE9NLmlzRm9ybUlucHV0KGZyb21FbClcbiAgICAgICAgICBpZihpc0ZvY3VzZWRGb3JtRWwpe1xuICAgICAgICAgICAgdGhpcy50cmFja0JlZm9yZShcInVwZGF0ZWRcIiwgZnJvbUVsLCB0b0VsKVxuICAgICAgICAgICAgRE9NLm1lcmdlRm9jdXNlZElucHV0KGZyb21FbCwgdG9FbClcbiAgICAgICAgICAgIERPTS5zeW5jQXR0cnNUb1Byb3BzKGZyb21FbClcbiAgICAgICAgICAgIHVwZGF0ZXMucHVzaChmcm9tRWwpXG4gICAgICAgICAgICBET00uYXBwbHlTdGlja3lPcGVyYXRpb25zKGZyb21FbClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZihET00uaXNQaHhVcGRhdGUodG9FbCwgcGh4VXBkYXRlLCBbXCJhcHBlbmRcIiwgXCJwcmVwZW5kXCJdKSl7XG4gICAgICAgICAgICAgIGFwcGVuZFByZXBlbmRVcGRhdGVzLnB1c2gobmV3IERPTVBvc3RNb3JwaFJlc3RvcmVyKGZyb21FbCwgdG9FbCwgdG9FbC5nZXRBdHRyaWJ1dGUocGh4VXBkYXRlKSkpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBET00uc3luY0F0dHJzVG9Qcm9wcyh0b0VsKVxuICAgICAgICAgICAgRE9NLmFwcGx5U3RpY2t5T3BlcmF0aW9ucyh0b0VsKVxuICAgICAgICAgICAgdGhpcy50cmFja0JlZm9yZShcInVwZGF0ZWRcIiwgZnJvbUVsLCB0b0VsKVxuICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGlmKGxpdmVTb2NrZXQuaXNEZWJ1Z0VuYWJsZWQoKSl7IGRldGVjdER1cGxpY2F0ZUlkcygpIH1cblxuICAgIGlmKGFwcGVuZFByZXBlbmRVcGRhdGVzLmxlbmd0aCA+IDApe1xuICAgICAgbGl2ZVNvY2tldC50aW1lKFwicG9zdC1tb3JwaCBhcHBlbmQvcHJlcGVuZCByZXN0b3JhdGlvblwiLCAoKSA9PiB7XG4gICAgICAgIGFwcGVuZFByZXBlbmRVcGRhdGVzLmZvckVhY2godXBkYXRlID0+IHVwZGF0ZS5wZXJmb3JtKCkpXG4gICAgICB9KVxuICAgIH1cblxuICAgIGxpdmVTb2NrZXQuc2lsZW5jZUV2ZW50cygoKSA9PiBET00ucmVzdG9yZUZvY3VzKGZvY3VzZWQsIHNlbGVjdGlvblN0YXJ0LCBzZWxlY3Rpb25FbmQpKVxuICAgIERPTS5kaXNwYXRjaEV2ZW50KGRvY3VtZW50LCBcInBoeDp1cGRhdGVcIilcbiAgICBhZGRlZC5mb3JFYWNoKGVsID0+IHRoaXMudHJhY2tBZnRlcihcImFkZGVkXCIsIGVsKSlcbiAgICB1cGRhdGVzLmZvckVhY2goZWwgPT4gdGhpcy50cmFja0FmdGVyKFwidXBkYXRlZFwiLCBlbCkpXG5cbiAgICBpZihwZW5kaW5nUmVtb3Zlcy5sZW5ndGggPiAwKXtcbiAgICAgIGxpdmVTb2NrZXQudHJhbnNpdGlvblJlbW92ZXMocGVuZGluZ1JlbW92ZXMpXG4gICAgICBsaXZlU29ja2V0LnJlcXVlc3RET01VcGRhdGUoKCkgPT4ge1xuICAgICAgICBwZW5kaW5nUmVtb3Zlcy5mb3JFYWNoKGVsID0+IHtcbiAgICAgICAgICBsZXQgY2hpbGQgPSBET00uZmlyc3RQaHhDaGlsZChlbClcbiAgICAgICAgICBpZihjaGlsZCl7IGxpdmVTb2NrZXQuZGVzdHJveVZpZXdCeUVsKGNoaWxkKSB9XG4gICAgICAgICAgZWwucmVtb3ZlKClcbiAgICAgICAgfSlcbiAgICAgICAgdGhpcy50cmFja0FmdGVyKFwidHJhbnNpdGlvbnNEaXNjYXJkZWRcIiwgcGVuZGluZ1JlbW92ZXMpXG4gICAgICB9KVxuICAgIH1cblxuICAgIGlmKGV4dGVybmFsRm9ybVRyaWdnZXJlZCl7XG4gICAgICBsaXZlU29ja2V0LmRpc2Nvbm5lY3QoKVxuICAgICAgZXh0ZXJuYWxGb3JtVHJpZ2dlcmVkLnN1Ym1pdCgpXG4gICAgfVxuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICBpc0NJRFBhdGNoKCl7IHJldHVybiB0aGlzLmNpZFBhdGNoIH1cblxuICBza2lwQ0lEU2libGluZyhlbCl7XG4gICAgcmV0dXJuIGVsLm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERSAmJiBlbC5nZXRBdHRyaWJ1dGUoUEhYX1NLSVApICE9PSBudWxsXG4gIH1cblxuICB0YXJnZXRDSURDb250YWluZXIoaHRtbCl7XG4gICAgaWYoIXRoaXMuaXNDSURQYXRjaCgpKXsgcmV0dXJuIH1cbiAgICBsZXQgW2ZpcnN0LCAuLi5yZXN0XSA9IERPTS5maW5kQ29tcG9uZW50Tm9kZUxpc3QodGhpcy5jb250YWluZXIsIHRoaXMudGFyZ2V0Q0lEKVxuICAgIGlmKHJlc3QubGVuZ3RoID09PSAwICYmIERPTS5jaGlsZE5vZGVMZW5ndGgoaHRtbCkgPT09IDEpe1xuICAgICAgcmV0dXJuIGZpcnN0XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmaXJzdCAmJiBmaXJzdC5wYXJlbnROb2RlXG4gICAgfVxuICB9XG5cbiAgLy8gYnVpbGRzIEhUTUwgZm9yIG1vcnBoZG9tIHBhdGNoXG4gIC8vIC0gZm9yIGZ1bGwgcGF0Y2hlcyBvZiBMaXZlVmlldyBvciBhIGNvbXBvbmVudCB3aXRoIGEgc2luZ2xlXG4gIC8vICAgcm9vdCBub2RlLCBzaW1wbHkgcmV0dXJucyB0aGUgSFRNTFxuICAvLyAtIGZvciBwYXRjaGVzIG9mIGEgY29tcG9uZW50IHdpdGggbXVsdGlwbGUgcm9vdCBub2RlcywgdGhlXG4gIC8vICAgcGFyZW50IG5vZGUgYmVjb21lcyB0aGUgdGFyZ2V0IGNvbnRhaW5lciBhbmQgbm9uLWNvbXBvbmVudFxuICAvLyAgIHNpYmxpbmdzIGFyZSBtYXJrZWQgYXMgc2tpcC5cbiAgYnVpbGREaWZmSFRNTChjb250YWluZXIsIGh0bWwsIHBoeFVwZGF0ZSwgdGFyZ2V0Q29udGFpbmVyKXtcbiAgICBsZXQgaXNDSURQYXRjaCA9IHRoaXMuaXNDSURQYXRjaCgpXG4gICAgbGV0IGlzQ0lEV2l0aFNpbmdsZVJvb3QgPSBpc0NJRFBhdGNoICYmIHRhcmdldENvbnRhaW5lci5nZXRBdHRyaWJ1dGUoUEhYX0NPTVBPTkVOVCkgPT09IHRoaXMudGFyZ2V0Q0lELnRvU3RyaW5nKClcbiAgICBpZighaXNDSURQYXRjaCB8fCBpc0NJRFdpdGhTaW5nbGVSb290KXtcbiAgICAgIHJldHVybiBodG1sXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGNvbXBvbmVudCBwYXRjaCB3aXRoIG11bHRpcGxlIENJRCByb290c1xuICAgICAgbGV0IGRpZmZDb250YWluZXIgPSBudWxsXG4gICAgICBsZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGVtcGxhdGVcIilcbiAgICAgIGRpZmZDb250YWluZXIgPSBET00uY2xvbmVOb2RlKHRhcmdldENvbnRhaW5lcilcbiAgICAgIGxldCBbZmlyc3RDb21wb25lbnQsIC4uLnJlc3RdID0gRE9NLmZpbmRDb21wb25lbnROb2RlTGlzdChkaWZmQ29udGFpbmVyLCB0aGlzLnRhcmdldENJRClcbiAgICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IGh0bWxcbiAgICAgIHJlc3QuZm9yRWFjaChlbCA9PiBlbC5yZW1vdmUoKSlcbiAgICAgIEFycmF5LmZyb20oZGlmZkNvbnRhaW5lci5jaGlsZE5vZGVzKS5mb3JFYWNoKGNoaWxkID0+IHtcbiAgICAgICAgLy8gd2UgY2FuIG9ubHkgc2tpcCB0cmFja2FibGUgbm9kZXMgd2l0aCBhbiBJRFxuICAgICAgICBpZihjaGlsZC5pZCAmJiBjaGlsZC5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREUgJiYgY2hpbGQuZ2V0QXR0cmlidXRlKFBIWF9DT01QT05FTlQpICE9PSB0aGlzLnRhcmdldENJRC50b1N0cmluZygpKXtcbiAgICAgICAgICBjaGlsZC5zZXRBdHRyaWJ1dGUoUEhYX1NLSVAsIFwiXCIpXG4gICAgICAgICAgY2hpbGQuaW5uZXJIVE1MID0gXCJcIlxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgQXJyYXkuZnJvbSh0ZW1wbGF0ZS5jb250ZW50LmNoaWxkTm9kZXMpLmZvckVhY2goZWwgPT4gZGlmZkNvbnRhaW5lci5pbnNlcnRCZWZvcmUoZWwsIGZpcnN0Q29tcG9uZW50KSlcbiAgICAgIGZpcnN0Q29tcG9uZW50LnJlbW92ZSgpXG4gICAgICByZXR1cm4gZGlmZkNvbnRhaW5lci5vdXRlckhUTUxcbiAgICB9XG4gIH1cbn1cbiIsICJpbXBvcnQge1xuICBDT01QT05FTlRTLFxuICBEWU5BTUlDUyxcbiAgVEVNUExBVEVTLFxuICBFVkVOVFMsXG4gIFBIWF9DT01QT05FTlQsXG4gIFBIWF9TS0lQLFxuICBSRVBMWSxcbiAgU1RBVElDLFxuICBUSVRMRVxufSBmcm9tIFwiLi9jb25zdGFudHNcIlxuXG5pbXBvcnQge1xuICBpc09iamVjdCxcbiAgbG9nRXJyb3IsXG4gIGlzQ2lkLFxufSBmcm9tIFwiLi91dGlsc1wiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlbmRlcmVkIHtcbiAgc3RhdGljIGV4dHJhY3QoZGlmZil7XG4gICAgbGV0IHtbUkVQTFldOiByZXBseSwgW0VWRU5UU106IGV2ZW50cywgW1RJVExFXTogdGl0bGV9ID0gZGlmZlxuICAgIGRlbGV0ZSBkaWZmW1JFUExZXVxuICAgIGRlbGV0ZSBkaWZmW0VWRU5UU11cbiAgICBkZWxldGUgZGlmZltUSVRMRV1cbiAgICByZXR1cm4ge2RpZmYsIHRpdGxlLCByZXBseTogcmVwbHkgfHwgbnVsbCwgZXZlbnRzOiBldmVudHMgfHwgW119XG4gIH1cblxuICBjb25zdHJ1Y3Rvcih2aWV3SWQsIHJlbmRlcmVkKXtcbiAgICB0aGlzLnZpZXdJZCA9IHZpZXdJZFxuICAgIHRoaXMucmVuZGVyZWQgPSB7fVxuICAgIHRoaXMubWVyZ2VEaWZmKHJlbmRlcmVkKVxuICB9XG5cbiAgcGFyZW50Vmlld0lkKCl7IHJldHVybiB0aGlzLnZpZXdJZCB9XG5cbiAgdG9TdHJpbmcob25seUNpZHMpe1xuICAgIHJldHVybiB0aGlzLnJlY3Vyc2l2ZVRvU3RyaW5nKHRoaXMucmVuZGVyZWQsIHRoaXMucmVuZGVyZWRbQ09NUE9ORU5UU10sIG9ubHlDaWRzKVxuICB9XG5cbiAgcmVjdXJzaXZlVG9TdHJpbmcocmVuZGVyZWQsIGNvbXBvbmVudHMgPSByZW5kZXJlZFtDT01QT05FTlRTXSwgb25seUNpZHMpe1xuICAgIG9ubHlDaWRzID0gb25seUNpZHMgPyBuZXcgU2V0KG9ubHlDaWRzKSA6IG51bGxcbiAgICBsZXQgb3V0cHV0ID0ge2J1ZmZlcjogXCJcIiwgY29tcG9uZW50czogY29tcG9uZW50cywgb25seUNpZHM6IG9ubHlDaWRzfVxuICAgIHRoaXMudG9PdXRwdXRCdWZmZXIocmVuZGVyZWQsIG51bGwsIG91dHB1dClcbiAgICByZXR1cm4gb3V0cHV0LmJ1ZmZlclxuICB9XG5cbiAgY29tcG9uZW50Q0lEcyhkaWZmKXsgcmV0dXJuIE9iamVjdC5rZXlzKGRpZmZbQ09NUE9ORU5UU10gfHwge30pLm1hcChpID0+IHBhcnNlSW50KGkpKSB9XG5cbiAgaXNDb21wb25lbnRPbmx5RGlmZihkaWZmKXtcbiAgICBpZighZGlmZltDT01QT05FTlRTXSl7IHJldHVybiBmYWxzZSB9XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKGRpZmYpLmxlbmd0aCA9PT0gMVxuICB9XG5cbiAgZ2V0Q29tcG9uZW50KGRpZmYsIGNpZCl7IHJldHVybiBkaWZmW0NPTVBPTkVOVFNdW2NpZF0gfVxuXG4gIG1lcmdlRGlmZihkaWZmKXtcbiAgICBsZXQgbmV3YyA9IGRpZmZbQ09NUE9ORU5UU11cbiAgICBsZXQgY2FjaGUgPSB7fVxuICAgIGRlbGV0ZSBkaWZmW0NPTVBPTkVOVFNdXG4gICAgdGhpcy5yZW5kZXJlZCA9IHRoaXMubXV0YWJsZU1lcmdlKHRoaXMucmVuZGVyZWQsIGRpZmYpXG4gICAgdGhpcy5yZW5kZXJlZFtDT01QT05FTlRTXSA9IHRoaXMucmVuZGVyZWRbQ09NUE9ORU5UU10gfHwge31cblxuICAgIGlmKG5ld2Mpe1xuICAgICAgbGV0IG9sZGMgPSB0aGlzLnJlbmRlcmVkW0NPTVBPTkVOVFNdXG5cbiAgICAgIGZvcihsZXQgY2lkIGluIG5ld2Mpe1xuICAgICAgICBuZXdjW2NpZF0gPSB0aGlzLmNhY2hlZEZpbmRDb21wb25lbnQoY2lkLCBuZXdjW2NpZF0sIG9sZGMsIG5ld2MsIGNhY2hlKVxuICAgICAgfVxuXG4gICAgICBmb3IobGV0IGNpZCBpbiBuZXdjKXsgb2xkY1tjaWRdID0gbmV3Y1tjaWRdIH1cbiAgICAgIGRpZmZbQ09NUE9ORU5UU10gPSBuZXdjXG4gICAgfVxuICB9XG5cbiAgY2FjaGVkRmluZENvbXBvbmVudChjaWQsIGNkaWZmLCBvbGRjLCBuZXdjLCBjYWNoZSl7XG4gICAgaWYoY2FjaGVbY2lkXSl7XG4gICAgICByZXR1cm4gY2FjaGVbY2lkXVxuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgbmRpZmYsIHN0YXQsIHNjaWQgPSBjZGlmZltTVEFUSUNdXG5cbiAgICAgIGlmKGlzQ2lkKHNjaWQpKXtcbiAgICAgICAgbGV0IHRkaWZmXG5cbiAgICAgICAgaWYoc2NpZCA+IDApe1xuICAgICAgICAgIHRkaWZmID0gdGhpcy5jYWNoZWRGaW5kQ29tcG9uZW50KHNjaWQsIG5ld2Nbc2NpZF0sIG9sZGMsIG5ld2MsIGNhY2hlKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRkaWZmID0gb2xkY1stc2NpZF1cbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXQgPSB0ZGlmZltTVEFUSUNdXG4gICAgICAgIG5kaWZmID0gdGhpcy5jbG9uZU1lcmdlKHRkaWZmLCBjZGlmZilcbiAgICAgICAgbmRpZmZbU1RBVElDXSA9IHN0YXRcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5kaWZmID0gY2RpZmZbU1RBVElDXSAhPT0gdW5kZWZpbmVkID8gY2RpZmYgOiB0aGlzLmNsb25lTWVyZ2Uob2xkY1tjaWRdIHx8IHt9LCBjZGlmZilcbiAgICAgIH1cblxuICAgICAgY2FjaGVbY2lkXSA9IG5kaWZmXG4gICAgICByZXR1cm4gbmRpZmZcbiAgICB9XG4gIH1cblxuICBtdXRhYmxlTWVyZ2UodGFyZ2V0LCBzb3VyY2Upe1xuICAgIGlmKHNvdXJjZVtTVEFUSUNdICE9PSB1bmRlZmluZWQpe1xuICAgICAgcmV0dXJuIHNvdXJjZVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRvTXV0YWJsZU1lcmdlKHRhcmdldCwgc291cmNlKVxuICAgICAgcmV0dXJuIHRhcmdldFxuICAgIH1cbiAgfVxuXG4gIGRvTXV0YWJsZU1lcmdlKHRhcmdldCwgc291cmNlKXtcbiAgICBmb3IobGV0IGtleSBpbiBzb3VyY2Upe1xuICAgICAgbGV0IHZhbCA9IHNvdXJjZVtrZXldXG4gICAgICBsZXQgdGFyZ2V0VmFsID0gdGFyZ2V0W2tleV1cbiAgICAgIGlmKGlzT2JqZWN0KHZhbCkgJiYgdmFsW1NUQVRJQ10gPT09IHVuZGVmaW5lZCAmJiBpc09iamVjdCh0YXJnZXRWYWwpKXtcbiAgICAgICAgdGhpcy5kb011dGFibGVNZXJnZSh0YXJnZXRWYWwsIHZhbClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRhcmdldFtrZXldID0gdmFsXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY2xvbmVNZXJnZSh0YXJnZXQsIHNvdXJjZSl7XG4gICAgbGV0IG1lcmdlZCA9IHsuLi50YXJnZXQsIC4uLnNvdXJjZX1cbiAgICBmb3IobGV0IGtleSBpbiBtZXJnZWQpe1xuICAgICAgbGV0IHZhbCA9IHNvdXJjZVtrZXldXG4gICAgICBsZXQgdGFyZ2V0VmFsID0gdGFyZ2V0W2tleV1cbiAgICAgIGlmKGlzT2JqZWN0KHZhbCkgJiYgdmFsW1NUQVRJQ10gPT09IHVuZGVmaW5lZCAmJiBpc09iamVjdCh0YXJnZXRWYWwpKXtcbiAgICAgICAgbWVyZ2VkW2tleV0gPSB0aGlzLmNsb25lTWVyZ2UodGFyZ2V0VmFsLCB2YWwpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBtZXJnZWRcbiAgfVxuXG4gIGNvbXBvbmVudFRvU3RyaW5nKGNpZCl7IHJldHVybiB0aGlzLnJlY3Vyc2l2ZUNJRFRvU3RyaW5nKHRoaXMucmVuZGVyZWRbQ09NUE9ORU5UU10sIGNpZCkgfVxuXG4gIHBydW5lQ0lEcyhjaWRzKXtcbiAgICBjaWRzLmZvckVhY2goY2lkID0+IGRlbGV0ZSB0aGlzLnJlbmRlcmVkW0NPTVBPTkVOVFNdW2NpZF0pXG4gIH1cblxuICAvLyBwcml2YXRlXG5cbiAgZ2V0KCl7IHJldHVybiB0aGlzLnJlbmRlcmVkIH1cblxuICBpc05ld0ZpbmdlcnByaW50KGRpZmYgPSB7fSl7IHJldHVybiAhIWRpZmZbU1RBVElDXSB9XG5cbiAgdGVtcGxhdGVTdGF0aWMocGFydCwgdGVtcGxhdGVzKXtcbiAgICBpZih0eXBlb2YgKHBhcnQpID09PSBcIm51bWJlclwiKSB7XG4gICAgICByZXR1cm4gdGVtcGxhdGVzW3BhcnRdXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBwYXJ0XG4gICAgfVxuICB9XG5cbiAgdG9PdXRwdXRCdWZmZXIocmVuZGVyZWQsIHRlbXBsYXRlcywgb3V0cHV0KXtcbiAgICBpZihyZW5kZXJlZFtEWU5BTUlDU10peyByZXR1cm4gdGhpcy5jb21wcmVoZW5zaW9uVG9CdWZmZXIocmVuZGVyZWQsIHRlbXBsYXRlcywgb3V0cHV0KSB9XG4gICAgbGV0IHtbU1RBVElDXTogc3RhdGljc30gPSByZW5kZXJlZFxuICAgIHN0YXRpY3MgPSB0aGlzLnRlbXBsYXRlU3RhdGljKHN0YXRpY3MsIHRlbXBsYXRlcylcblxuICAgIG91dHB1dC5idWZmZXIgKz0gc3RhdGljc1swXVxuICAgIGZvcihsZXQgaSA9IDE7IGkgPCBzdGF0aWNzLmxlbmd0aDsgaSsrKXtcbiAgICAgIHRoaXMuZHluYW1pY1RvQnVmZmVyKHJlbmRlcmVkW2kgLSAxXSwgdGVtcGxhdGVzLCBvdXRwdXQpXG4gICAgICBvdXRwdXQuYnVmZmVyICs9IHN0YXRpY3NbaV1cbiAgICB9XG4gIH1cblxuICBjb21wcmVoZW5zaW9uVG9CdWZmZXIocmVuZGVyZWQsIHRlbXBsYXRlcywgb3V0cHV0KXtcbiAgICBsZXQge1tEWU5BTUlDU106IGR5bmFtaWNzLCBbU1RBVElDXTogc3RhdGljc30gPSByZW5kZXJlZFxuICAgIHN0YXRpY3MgPSB0aGlzLnRlbXBsYXRlU3RhdGljKHN0YXRpY3MsIHRlbXBsYXRlcylcbiAgICBsZXQgY29tcFRlbXBsYXRlcyA9IHRlbXBsYXRlcyB8fCByZW5kZXJlZFtURU1QTEFURVNdXG5cbiAgICBmb3IobGV0IGQgPSAwOyBkIDwgZHluYW1pY3MubGVuZ3RoOyBkKyspe1xuICAgICAgbGV0IGR5bmFtaWMgPSBkeW5hbWljc1tkXVxuICAgICAgb3V0cHV0LmJ1ZmZlciArPSBzdGF0aWNzWzBdXG4gICAgICBmb3IobGV0IGkgPSAxOyBpIDwgc3RhdGljcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgIHRoaXMuZHluYW1pY1RvQnVmZmVyKGR5bmFtaWNbaSAtIDFdLCBjb21wVGVtcGxhdGVzLCBvdXRwdXQpXG4gICAgICAgIG91dHB1dC5idWZmZXIgKz0gc3RhdGljc1tpXVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGR5bmFtaWNUb0J1ZmZlcihyZW5kZXJlZCwgdGVtcGxhdGVzLCBvdXRwdXQpe1xuICAgIGlmKHR5cGVvZiAocmVuZGVyZWQpID09PSBcIm51bWJlclwiKXtcbiAgICAgIG91dHB1dC5idWZmZXIgKz0gdGhpcy5yZWN1cnNpdmVDSURUb1N0cmluZyhvdXRwdXQuY29tcG9uZW50cywgcmVuZGVyZWQsIG91dHB1dC5vbmx5Q2lkcylcbiAgICB9IGVsc2UgaWYoaXNPYmplY3QocmVuZGVyZWQpKXtcbiAgICAgIHRoaXMudG9PdXRwdXRCdWZmZXIocmVuZGVyZWQsIHRlbXBsYXRlcywgb3V0cHV0KVxuICAgIH0gZWxzZSB7XG4gICAgICBvdXRwdXQuYnVmZmVyICs9IHJlbmRlcmVkXG4gICAgfVxuICB9XG5cbiAgcmVjdXJzaXZlQ0lEVG9TdHJpbmcoY29tcG9uZW50cywgY2lkLCBvbmx5Q2lkcyl7XG4gICAgbGV0IGNvbXBvbmVudCA9IGNvbXBvbmVudHNbY2lkXSB8fCBsb2dFcnJvcihgbm8gY29tcG9uZW50IGZvciBDSUQgJHtjaWR9YCwgY29tcG9uZW50cylcbiAgICBsZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGVtcGxhdGVcIilcbiAgICB0ZW1wbGF0ZS5pbm5lckhUTUwgPSB0aGlzLnJlY3Vyc2l2ZVRvU3RyaW5nKGNvbXBvbmVudCwgY29tcG9uZW50cywgb25seUNpZHMpXG4gICAgbGV0IGNvbnRhaW5lciA9IHRlbXBsYXRlLmNvbnRlbnRcbiAgICBsZXQgc2tpcCA9IG9ubHlDaWRzICYmICFvbmx5Q2lkcy5oYXMoY2lkKVxuXG4gICAgbGV0IFtoYXNDaGlsZE5vZGVzLCBoYXNDaGlsZENvbXBvbmVudHNdID1cbiAgICAgIEFycmF5LmZyb20oY29udGFpbmVyLmNoaWxkTm9kZXMpLnJlZHVjZSgoW2hhc05vZGVzLCBoYXNDb21wb25lbnRzXSwgY2hpbGQsIGkpID0+IHtcbiAgICAgICAgaWYoY2hpbGQubm9kZVR5cGUgPT09IE5vZGUuRUxFTUVOVF9OT0RFKXtcbiAgICAgICAgICBpZihjaGlsZC5nZXRBdHRyaWJ1dGUoUEhYX0NPTVBPTkVOVCkpe1xuICAgICAgICAgICAgcmV0dXJuIFtoYXNOb2RlcywgdHJ1ZV1cbiAgICAgICAgICB9XG4gICAgICAgICAgY2hpbGQuc2V0QXR0cmlidXRlKFBIWF9DT01QT05FTlQsIGNpZClcbiAgICAgICAgICBpZighY2hpbGQuaWQpeyBjaGlsZC5pZCA9IGAke3RoaXMucGFyZW50Vmlld0lkKCl9LSR7Y2lkfS0ke2l9YCB9XG4gICAgICAgICAgaWYoc2tpcCl7XG4gICAgICAgICAgICBjaGlsZC5zZXRBdHRyaWJ1dGUoUEhYX1NLSVAsIFwiXCIpXG4gICAgICAgICAgICBjaGlsZC5pbm5lckhUTUwgPSBcIlwiXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBbdHJ1ZSwgaGFzQ29tcG9uZW50c11cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZihjaGlsZC5ub2RlVmFsdWUudHJpbSgpICE9PSBcIlwiKXtcbiAgICAgICAgICAgIGxvZ0Vycm9yKFwib25seSBIVE1MIGVsZW1lbnQgdGFncyBhcmUgYWxsb3dlZCBhdCB0aGUgcm9vdCBvZiBjb21wb25lbnRzLlxcblxcblwiICtcbiAgICAgICAgICAgICAgYGdvdDogXCIke2NoaWxkLm5vZGVWYWx1ZS50cmltKCl9XCJcXG5cXG5gICtcbiAgICAgICAgICAgICAgXCJ3aXRoaW46XFxuXCIsIHRlbXBsYXRlLmlubmVySFRNTC50cmltKCkpXG4gICAgICAgICAgICBjaGlsZC5yZXBsYWNlV2l0aCh0aGlzLmNyZWF0ZVNwYW4oY2hpbGQubm9kZVZhbHVlLCBjaWQpKVxuICAgICAgICAgICAgcmV0dXJuIFt0cnVlLCBoYXNDb21wb25lbnRzXVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjaGlsZC5yZW1vdmUoKVxuICAgICAgICAgICAgcmV0dXJuIFtoYXNOb2RlcywgaGFzQ29tcG9uZW50c11cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIFtmYWxzZSwgZmFsc2VdKVxuXG4gICAgaWYoIWhhc0NoaWxkTm9kZXMgJiYgIWhhc0NoaWxkQ29tcG9uZW50cyl7XG4gICAgICBsb2dFcnJvcihcImV4cGVjdGVkIGF0IGxlYXN0IG9uZSBIVE1MIGVsZW1lbnQgdGFnIGluc2lkZSBhIGNvbXBvbmVudCwgYnV0IHRoZSBjb21wb25lbnQgaXMgZW1wdHk6XFxuXCIsXG4gICAgICAgIHRlbXBsYXRlLmlubmVySFRNTC50cmltKCkpXG4gICAgICByZXR1cm4gdGhpcy5jcmVhdGVTcGFuKFwiXCIsIGNpZCkub3V0ZXJIVE1MXG4gICAgfSBlbHNlIGlmKCFoYXNDaGlsZE5vZGVzICYmIGhhc0NoaWxkQ29tcG9uZW50cyl7XG4gICAgICBsb2dFcnJvcihcImV4cGVjdGVkIGF0IGxlYXN0IG9uZSBIVE1MIGVsZW1lbnQgdGFnIGRpcmVjdGx5IGluc2lkZSBhIGNvbXBvbmVudCwgYnV0IG9ubHkgc3ViY29tcG9uZW50cyB3ZXJlIGZvdW5kLiBBIGNvbXBvbmVudCBtdXN0IHJlbmRlciBhdCBsZWFzdCBvbmUgSFRNTCB0YWcgZGlyZWN0bHkgaW5zaWRlIGl0c2VsZi5cIixcbiAgICAgICAgdGVtcGxhdGUuaW5uZXJIVE1MLnRyaW0oKSlcbiAgICAgIHJldHVybiB0ZW1wbGF0ZS5pbm5lckhUTUxcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRlbXBsYXRlLmlubmVySFRNTFxuICAgIH1cbiAgfVxuXG4gIGNyZWF0ZVNwYW4odGV4dCwgY2lkKXtcbiAgICBsZXQgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpXG4gICAgc3Bhbi5pbm5lclRleHQgPSB0ZXh0XG4gICAgc3Bhbi5zZXRBdHRyaWJ1dGUoUEhYX0NPTVBPTkVOVCwgY2lkKVxuICAgIHJldHVybiBzcGFuXG4gIH1cbn1cbiIsICJsZXQgdmlld0hvb2tJRCA9IDFcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFZpZXdIb29rIHtcbiAgc3RhdGljIG1ha2VJRCgpeyByZXR1cm4gdmlld0hvb2tJRCsrIH1cbiAgc3RhdGljIGVsZW1lbnRJRChlbCl7IHJldHVybiBlbC5waHhIb29rSWQgfVxuXG4gIGNvbnN0cnVjdG9yKHZpZXcsIGVsLCBjYWxsYmFja3Mpe1xuICAgIHRoaXMuX192aWV3ID0gdmlld1xuICAgIHRoaXMubGl2ZVNvY2tldCA9IHZpZXcubGl2ZVNvY2tldFxuICAgIHRoaXMuX19jYWxsYmFja3MgPSBjYWxsYmFja3NcbiAgICB0aGlzLl9fbGlzdGVuZXJzID0gbmV3IFNldCgpXG4gICAgdGhpcy5fX2lzRGlzY29ubmVjdGVkID0gZmFsc2VcbiAgICB0aGlzLmVsID0gZWxcbiAgICB0aGlzLmVsLnBoeEhvb2tJZCA9IHRoaXMuY29uc3RydWN0b3IubWFrZUlEKClcbiAgICBmb3IobGV0IGtleSBpbiB0aGlzLl9fY2FsbGJhY2tzKXsgdGhpc1trZXldID0gdGhpcy5fX2NhbGxiYWNrc1trZXldIH1cbiAgfVxuXG4gIF9fbW91bnRlZCgpeyB0aGlzLm1vdW50ZWQgJiYgdGhpcy5tb3VudGVkKCkgfVxuICBfX3VwZGF0ZWQoKXsgdGhpcy51cGRhdGVkICYmIHRoaXMudXBkYXRlZCgpIH1cbiAgX19iZWZvcmVVcGRhdGUoKXsgdGhpcy5iZWZvcmVVcGRhdGUgJiYgdGhpcy5iZWZvcmVVcGRhdGUoKSB9XG4gIF9fZGVzdHJveWVkKCl7IHRoaXMuZGVzdHJveWVkICYmIHRoaXMuZGVzdHJveWVkKCkgfVxuICBfX3JlY29ubmVjdGVkKCl7XG4gICAgaWYodGhpcy5fX2lzRGlzY29ubmVjdGVkKXtcbiAgICAgIHRoaXMuX19pc0Rpc2Nvbm5lY3RlZCA9IGZhbHNlXG4gICAgICB0aGlzLnJlY29ubmVjdGVkICYmIHRoaXMucmVjb25uZWN0ZWQoKVxuICAgIH1cbiAgfVxuICBfX2Rpc2Nvbm5lY3RlZCgpe1xuICAgIHRoaXMuX19pc0Rpc2Nvbm5lY3RlZCA9IHRydWVcbiAgICB0aGlzLmRpc2Nvbm5lY3RlZCAmJiB0aGlzLmRpc2Nvbm5lY3RlZCgpXG4gIH1cblxuICBwdXNoRXZlbnQoZXZlbnQsIHBheWxvYWQgPSB7fSwgb25SZXBseSA9IGZ1bmN0aW9uICgpeyB9KXtcbiAgICByZXR1cm4gdGhpcy5fX3ZpZXcucHVzaEhvb2tFdmVudChudWxsLCBldmVudCwgcGF5bG9hZCwgb25SZXBseSlcbiAgfVxuXG4gIHB1c2hFdmVudFRvKHBoeFRhcmdldCwgZXZlbnQsIHBheWxvYWQgPSB7fSwgb25SZXBseSA9IGZ1bmN0aW9uICgpeyB9KXtcbiAgICByZXR1cm4gdGhpcy5fX3ZpZXcud2l0aGluVGFyZ2V0cyhwaHhUYXJnZXQsICh2aWV3LCB0YXJnZXRDdHgpID0+IHtcbiAgICAgIHJldHVybiB2aWV3LnB1c2hIb29rRXZlbnQodGFyZ2V0Q3R4LCBldmVudCwgcGF5bG9hZCwgb25SZXBseSlcbiAgICB9KVxuICB9XG5cbiAgaGFuZGxlRXZlbnQoZXZlbnQsIGNhbGxiYWNrKXtcbiAgICBsZXQgY2FsbGJhY2tSZWYgPSAoY3VzdG9tRXZlbnQsIGJ5cGFzcykgPT4gYnlwYXNzID8gZXZlbnQgOiBjYWxsYmFjayhjdXN0b21FdmVudC5kZXRhaWwpXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoYHBoeDoke2V2ZW50fWAsIGNhbGxiYWNrUmVmKVxuICAgIHRoaXMuX19saXN0ZW5lcnMuYWRkKGNhbGxiYWNrUmVmKVxuICAgIHJldHVybiBjYWxsYmFja1JlZlxuICB9XG5cbiAgcmVtb3ZlSGFuZGxlRXZlbnQoY2FsbGJhY2tSZWYpe1xuICAgIGxldCBldmVudCA9IGNhbGxiYWNrUmVmKG51bGwsIHRydWUpXG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoYHBoeDoke2V2ZW50fWAsIGNhbGxiYWNrUmVmKVxuICAgIHRoaXMuX19saXN0ZW5lcnMuZGVsZXRlKGNhbGxiYWNrUmVmKVxuICB9XG5cbiAgdXBsb2FkKG5hbWUsIGZpbGVzKXtcbiAgICByZXR1cm4gdGhpcy5fX3ZpZXcuZGlzcGF0Y2hVcGxvYWRzKG5hbWUsIGZpbGVzKVxuICB9XG5cbiAgdXBsb2FkVG8ocGh4VGFyZ2V0LCBuYW1lLCBmaWxlcyl7XG4gICAgcmV0dXJuIHRoaXMuX192aWV3LndpdGhpblRhcmdldHMocGh4VGFyZ2V0LCB2aWV3ID0+IHZpZXcuZGlzcGF0Y2hVcGxvYWRzKG5hbWUsIGZpbGVzKSlcbiAgfVxuXG4gIF9fY2xlYW51cF9fKCl7XG4gICAgdGhpcy5fX2xpc3RlbmVycy5mb3JFYWNoKGNhbGxiYWNrUmVmID0+IHRoaXMucmVtb3ZlSGFuZGxlRXZlbnQoY2FsbGJhY2tSZWYpKVxuICB9XG59XG4iLCAiaW1wb3J0IERPTSBmcm9tIFwiLi9kb21cIlxuXG5sZXQgSlMgPSB7XG4gIGV4ZWMoZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGRlZmF1bHRzKXtcbiAgICBsZXQgW2RlZmF1bHRLaW5kLCBkZWZhdWx0QXJnc10gPSBkZWZhdWx0cyB8fCBbbnVsbCwge31dXG4gICAgbGV0IGNvbW1hbmRzID0gcGh4RXZlbnQuY2hhckF0KDApID09PSBcIltcIiA/XG4gICAgICBKU09OLnBhcnNlKHBoeEV2ZW50KSA6IFtbZGVmYXVsdEtpbmQsIGRlZmF1bHRBcmdzXV1cblxuICAgIGNvbW1hbmRzLmZvckVhY2goKFtraW5kLCBhcmdzXSkgPT4ge1xuICAgICAgaWYoa2luZCA9PT0gZGVmYXVsdEtpbmQgJiYgZGVmYXVsdEFyZ3MuZGF0YSl7XG4gICAgICAgIGFyZ3MuZGF0YSA9IE9iamVjdC5hc3NpZ24oYXJncy5kYXRhIHx8IHt9LCBkZWZhdWx0QXJncy5kYXRhKVxuICAgICAgfVxuICAgICAgdGhpcy5maWx0ZXJUb0Vscyhzb3VyY2VFbCwgYXJncykuZm9yRWFjaChlbCA9PiB7XG4gICAgICAgIHRoaXNbYGV4ZWNfJHtraW5kfWBdKGV2ZW50VHlwZSwgcGh4RXZlbnQsIHZpZXcsIHNvdXJjZUVsLCBlbCwgYXJncylcbiAgICAgIH0pXG4gICAgfSlcbiAgfSxcblxuICBpc1Zpc2libGUoZWwpe1xuICAgIHJldHVybiAhIShlbC5vZmZzZXRXaWR0aCB8fCBlbC5vZmZzZXRIZWlnaHQgfHwgZWwuZ2V0Q2xpZW50UmVjdHMoKS5sZW5ndGggPiAwKVxuICB9LFxuXG4gIC8vIHByaXZhdGVcblxuICAvLyBjb21tYW5kc1xuXG4gIGV4ZWNfZGlzcGF0Y2goZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGVsLCB7dG8sIGV2ZW50LCBkZXRhaWwsIGJ1YmJsZXN9KXtcbiAgICBkZXRhaWwgPSBkZXRhaWwgfHwge31cbiAgICBkZXRhaWwuZGlzcGF0Y2hlciA9IHNvdXJjZUVsXG4gICAgRE9NLmRpc3BhdGNoRXZlbnQoZWwsIGV2ZW50LCB7ZGV0YWlsLCBidWJibGVzfSlcbiAgfSxcblxuICBleGVjX3B1c2goZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGVsLCBhcmdzKXtcbiAgICBpZighdmlldy5pc0Nvbm5lY3RlZCgpKXsgcmV0dXJuIH1cblxuICAgIGxldCB7ZXZlbnQsIGRhdGEsIHRhcmdldCwgcGFnZV9sb2FkaW5nLCBsb2FkaW5nLCB2YWx1ZSwgZGlzcGF0Y2hlcn0gPSBhcmdzXG4gICAgbGV0IHB1c2hPcHRzID0ge2xvYWRpbmcsIHZhbHVlLCB0YXJnZXQsIHBhZ2VfbG9hZGluZzogISFwYWdlX2xvYWRpbmd9XG4gICAgbGV0IHRhcmdldFNyYyA9IGV2ZW50VHlwZSA9PT0gXCJjaGFuZ2VcIiAmJiBkaXNwYXRjaGVyID8gZGlzcGF0Y2hlciA6IHNvdXJjZUVsXG4gICAgbGV0IHBoeFRhcmdldCA9IHRhcmdldCB8fCB0YXJnZXRTcmMuZ2V0QXR0cmlidXRlKHZpZXcuYmluZGluZyhcInRhcmdldFwiKSkgfHwgdGFyZ2V0U3JjXG4gICAgdmlldy53aXRoaW5UYXJnZXRzKHBoeFRhcmdldCwgKHRhcmdldFZpZXcsIHRhcmdldEN0eCkgPT4ge1xuICAgICAgaWYoZXZlbnRUeXBlID09PSBcImNoYW5nZVwiKXtcbiAgICAgICAgbGV0IHtuZXdDaWQsIF90YXJnZXQsIGNhbGxiYWNrfSA9IGFyZ3NcbiAgICAgICAgX3RhcmdldCA9IF90YXJnZXQgfHwgKHNvdXJjZUVsIGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudCA/IHNvdXJjZUVsLm5hbWUgOiB1bmRlZmluZWQpXG4gICAgICAgIGlmKF90YXJnZXQpeyBwdXNoT3B0cy5fdGFyZ2V0ID0gX3RhcmdldCB9XG4gICAgICAgIHRhcmdldFZpZXcucHVzaElucHV0KHNvdXJjZUVsLCB0YXJnZXRDdHgsIG5ld0NpZCwgZXZlbnQgfHwgcGh4RXZlbnQsIHB1c2hPcHRzLCBjYWxsYmFjaylcbiAgICAgIH0gZWxzZSBpZihldmVudFR5cGUgPT09IFwic3VibWl0XCIpe1xuICAgICAgICB0YXJnZXRWaWV3LnN1Ym1pdEZvcm0oc291cmNlRWwsIHRhcmdldEN0eCwgZXZlbnQgfHwgcGh4RXZlbnQsIHB1c2hPcHRzKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGFyZ2V0Vmlldy5wdXNoRXZlbnQoZXZlbnRUeXBlLCBzb3VyY2VFbCwgdGFyZ2V0Q3R4LCBldmVudCB8fCBwaHhFdmVudCwgZGF0YSwgcHVzaE9wdHMpXG4gICAgICB9XG4gICAgfSlcbiAgfSxcblxuICBleGVjX2FkZF9jbGFzcyhldmVudFR5cGUsIHBoeEV2ZW50LCB2aWV3LCBzb3VyY2VFbCwgZWwsIHtuYW1lcywgdHJhbnNpdGlvbiwgdGltZX0pe1xuICAgIHRoaXMuYWRkT3JSZW1vdmVDbGFzc2VzKGVsLCBuYW1lcywgW10sIHRyYW5zaXRpb24sIHRpbWUsIHZpZXcpXG4gIH0sXG5cbiAgZXhlY19yZW1vdmVfY2xhc3MoZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGVsLCB7bmFtZXMsIHRyYW5zaXRpb24sIHRpbWV9KXtcbiAgICB0aGlzLmFkZE9yUmVtb3ZlQ2xhc3NlcyhlbCwgW10sIG5hbWVzLCB0cmFuc2l0aW9uLCB0aW1lLCB2aWV3KVxuICB9LFxuXG4gIGV4ZWNfdHJhbnNpdGlvbihldmVudFR5cGUsIHBoeEV2ZW50LCB2aWV3LCBzb3VyY2VFbCwgZWwsIHt0aW1lLCB0cmFuc2l0aW9ufSl7XG4gICAgbGV0IFt0cmFuc2l0aW9uX3N0YXJ0LCBydW5uaW5nLCB0cmFuc2l0aW9uX2VuZF0gPSB0cmFuc2l0aW9uXG4gICAgbGV0IG9uU3RhcnQgPSAoKSA9PiB0aGlzLmFkZE9yUmVtb3ZlQ2xhc3NlcyhlbCwgdHJhbnNpdGlvbl9zdGFydC5jb25jYXQocnVubmluZyksIFtdKVxuICAgIGxldCBvbkRvbmUgPSAoKSA9PiB0aGlzLmFkZE9yUmVtb3ZlQ2xhc3NlcyhlbCwgdHJhbnNpdGlvbl9lbmQsIHRyYW5zaXRpb25fc3RhcnQuY29uY2F0KHJ1bm5pbmcpKVxuICAgIHZpZXcudHJhbnNpdGlvbih0aW1lLCBvblN0YXJ0LCBvbkRvbmUpXG4gIH0sXG5cbiAgZXhlY190b2dnbGUoZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGVsLCB7ZGlzcGxheSwgaW5zLCBvdXRzLCB0aW1lfSl7XG4gICAgdGhpcy50b2dnbGUoZXZlbnRUeXBlLCB2aWV3LCBlbCwgZGlzcGxheSwgaW5zLCBvdXRzLCB0aW1lKVxuICB9LFxuXG4gIGV4ZWNfc2hvdyhldmVudFR5cGUsIHBoeEV2ZW50LCB2aWV3LCBzb3VyY2VFbCwgZWwsIHtkaXNwbGF5LCB0cmFuc2l0aW9uLCB0aW1lfSl7XG4gICAgdGhpcy5zaG93KGV2ZW50VHlwZSwgdmlldywgZWwsIGRpc3BsYXksIHRyYW5zaXRpb24sIHRpbWUpXG4gIH0sXG5cbiAgZXhlY19oaWRlKGV2ZW50VHlwZSwgcGh4RXZlbnQsIHZpZXcsIHNvdXJjZUVsLCBlbCwge2Rpc3BsYXksIHRyYW5zaXRpb24sIHRpbWV9KXtcbiAgICB0aGlzLmhpZGUoZXZlbnRUeXBlLCB2aWV3LCBlbCwgZGlzcGxheSwgdHJhbnNpdGlvbiwgdGltZSlcbiAgfSxcblxuICBleGVjX3NldF9hdHRyKGV2ZW50VHlwZSwgcGh4RXZlbnQsIHZpZXcsIHNvdXJjZUVsLCBlbCwge2F0dHI6IFthdHRyLCB2YWxdfSl7XG4gICAgdGhpcy5zZXRPclJlbW92ZUF0dHJzKGVsLCBbW2F0dHIsIHZhbF1dLCBbXSlcbiAgfSxcblxuICBleGVjX3JlbW92ZV9hdHRyKGV2ZW50VHlwZSwgcGh4RXZlbnQsIHZpZXcsIHNvdXJjZUVsLCBlbCwge2F0dHJ9KXtcbiAgICB0aGlzLnNldE9yUmVtb3ZlQXR0cnMoZWwsIFtdLCBbYXR0cl0pXG4gIH0sXG5cbiAgLy8gdXRpbHMgZm9yIGNvbW1hbmRzXG5cbiAgc2hvdyhldmVudFR5cGUsIHZpZXcsIGVsLCBkaXNwbGF5LCB0cmFuc2l0aW9uLCB0aW1lKXtcbiAgICBpZighdGhpcy5pc1Zpc2libGUoZWwpKXtcbiAgICAgIHRoaXMudG9nZ2xlKGV2ZW50VHlwZSwgdmlldywgZWwsIGRpc3BsYXksIHRyYW5zaXRpb24sIG51bGwsIHRpbWUpXG4gICAgfVxuICB9LFxuXG4gIGhpZGUoZXZlbnRUeXBlLCB2aWV3LCBlbCwgZGlzcGxheSwgdHJhbnNpdGlvbiwgdGltZSl7XG4gICAgaWYodGhpcy5pc1Zpc2libGUoZWwpKXtcbiAgICAgIHRoaXMudG9nZ2xlKGV2ZW50VHlwZSwgdmlldywgZWwsIGRpc3BsYXksIG51bGwsIHRyYW5zaXRpb24sIHRpbWUpXG4gICAgfVxuICB9LFxuXG4gIHRvZ2dsZShldmVudFR5cGUsIHZpZXcsIGVsLCBkaXNwbGF5LCBpbnMsIG91dHMsIHRpbWUpe1xuICAgIGxldCBbaW5DbGFzc2VzLCBpblN0YXJ0Q2xhc3NlcywgaW5FbmRDbGFzc2VzXSA9IGlucyB8fCBbW10sIFtdLCBbXV1cbiAgICBsZXQgW291dENsYXNzZXMsIG91dFN0YXJ0Q2xhc3Nlcywgb3V0RW5kQ2xhc3Nlc10gPSBvdXRzIHx8IFtbXSwgW10sIFtdXVxuICAgIGlmKGluQ2xhc3Nlcy5sZW5ndGggPiAwIHx8IG91dENsYXNzZXMubGVuZ3RoID4gMCl7XG4gICAgICBpZih0aGlzLmlzVmlzaWJsZShlbCkpe1xuICAgICAgICBsZXQgb25TdGFydCA9ICgpID0+IHtcbiAgICAgICAgICB0aGlzLmFkZE9yUmVtb3ZlQ2xhc3NlcyhlbCwgb3V0U3RhcnRDbGFzc2VzLCBpbkNsYXNzZXMuY29uY2F0KGluU3RhcnRDbGFzc2VzKS5jb25jYXQoaW5FbmRDbGFzc2VzKSlcbiAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuYWRkT3JSZW1vdmVDbGFzc2VzKGVsLCBvdXRDbGFzc2VzLCBbXSlcbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGhpcy5hZGRPclJlbW92ZUNsYXNzZXMoZWwsIG91dEVuZENsYXNzZXMsIG91dFN0YXJ0Q2xhc3NlcykpXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICBlbC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcInBoeDpoaWRlLXN0YXJ0XCIpKVxuICAgICAgICB2aWV3LnRyYW5zaXRpb24odGltZSwgb25TdGFydCwgKCkgPT4ge1xuICAgICAgICAgIHRoaXMuYWRkT3JSZW1vdmVDbGFzc2VzKGVsLCBbXSwgb3V0Q2xhc3Nlcy5jb25jYXQob3V0RW5kQ2xhc3NlcykpXG4gICAgICAgICAgRE9NLnB1dFN0aWNreShlbCwgXCJ0b2dnbGVcIiwgY3VycmVudEVsID0+IGN1cnJlbnRFbC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCIpXG4gICAgICAgICAgZWwuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoXCJwaHg6aGlkZS1lbmRcIikpXG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZihldmVudFR5cGUgPT09IFwicmVtb3ZlXCIpeyByZXR1cm4gfVxuICAgICAgICBsZXQgb25TdGFydCA9ICgpID0+IHtcbiAgICAgICAgICB0aGlzLmFkZE9yUmVtb3ZlQ2xhc3NlcyhlbCwgaW5TdGFydENsYXNzZXMsIG91dENsYXNzZXMuY29uY2F0KG91dFN0YXJ0Q2xhc3NlcykuY29uY2F0KG91dEVuZENsYXNzZXMpKVxuICAgICAgICAgIERPTS5wdXRTdGlja3koZWwsIFwidG9nZ2xlXCIsIGN1cnJlbnRFbCA9PiBjdXJyZW50RWwuc3R5bGUuZGlzcGxheSA9IChkaXNwbGF5IHx8IFwiYmxvY2tcIikpXG4gICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmFkZE9yUmVtb3ZlQ2xhc3NlcyhlbCwgaW5DbGFzc2VzLCBbXSlcbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGhpcy5hZGRPclJlbW92ZUNsYXNzZXMoZWwsIGluRW5kQ2xhc3NlcywgaW5TdGFydENsYXNzZXMpKVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgZWwuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoXCJwaHg6c2hvdy1zdGFydFwiKSlcbiAgICAgICAgdmlldy50cmFuc2l0aW9uKHRpbWUsIG9uU3RhcnQsICgpID0+IHtcbiAgICAgICAgICB0aGlzLmFkZE9yUmVtb3ZlQ2xhc3NlcyhlbCwgW10sIGluQ2xhc3Nlcy5jb25jYXQoaW5FbmRDbGFzc2VzKSlcbiAgICAgICAgICBlbC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcInBoeDpzaG93LWVuZFwiKSlcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYodGhpcy5pc1Zpc2libGUoZWwpKXtcbiAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgZWwuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoXCJwaHg6aGlkZS1zdGFydFwiKSlcbiAgICAgICAgICBET00ucHV0U3RpY2t5KGVsLCBcInRvZ2dsZVwiLCBjdXJyZW50RWwgPT4gY3VycmVudEVsLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIilcbiAgICAgICAgICBlbC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcInBoeDpoaWRlLWVuZFwiKSlcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgIGVsLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KFwicGh4OnNob3ctc3RhcnRcIikpXG4gICAgICAgICAgRE9NLnB1dFN0aWNreShlbCwgXCJ0b2dnbGVcIiwgY3VycmVudEVsID0+IGN1cnJlbnRFbC5zdHlsZS5kaXNwbGF5ID0gZGlzcGxheSB8fCBcImJsb2NrXCIpXG4gICAgICAgICAgZWwuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoXCJwaHg6c2hvdy1lbmRcIikpXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIGFkZE9yUmVtb3ZlQ2xhc3NlcyhlbCwgYWRkcywgcmVtb3ZlcywgdHJhbnNpdGlvbiwgdGltZSwgdmlldyl7XG4gICAgbGV0IFt0cmFuc2l0aW9uX3J1biwgdHJhbnNpdGlvbl9zdGFydCwgdHJhbnNpdGlvbl9lbmRdID0gdHJhbnNpdGlvbiB8fCBbW10sIFtdLCBbXV1cbiAgICBpZih0cmFuc2l0aW9uX3J1bi5sZW5ndGggPiAwKXtcbiAgICAgIGxldCBvblN0YXJ0ID0gKCkgPT4gdGhpcy5hZGRPclJlbW92ZUNsYXNzZXMoZWwsIHRyYW5zaXRpb25fc3RhcnQuY29uY2F0KHRyYW5zaXRpb25fcnVuKSwgW10pXG4gICAgICBsZXQgb25Eb25lID0gKCkgPT4gdGhpcy5hZGRPclJlbW92ZUNsYXNzZXMoZWwsIGFkZHMuY29uY2F0KHRyYW5zaXRpb25fZW5kKSwgcmVtb3Zlcy5jb25jYXQodHJhbnNpdGlvbl9ydW4pLmNvbmNhdCh0cmFuc2l0aW9uX3N0YXJ0KSlcbiAgICAgIHJldHVybiB2aWV3LnRyYW5zaXRpb24odGltZSwgb25TdGFydCwgb25Eb25lKVxuICAgIH1cbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIGxldCBbcHJldkFkZHMsIHByZXZSZW1vdmVzXSA9IERPTS5nZXRTdGlja3koZWwsIFwiY2xhc3Nlc1wiLCBbW10sIFtdXSlcbiAgICAgIGxldCBrZWVwQWRkcyA9IGFkZHMuZmlsdGVyKG5hbWUgPT4gcHJldkFkZHMuaW5kZXhPZihuYW1lKSA8IDAgJiYgIWVsLmNsYXNzTGlzdC5jb250YWlucyhuYW1lKSlcbiAgICAgIGxldCBrZWVwUmVtb3ZlcyA9IHJlbW92ZXMuZmlsdGVyKG5hbWUgPT4gcHJldlJlbW92ZXMuaW5kZXhPZihuYW1lKSA8IDAgJiYgZWwuY2xhc3NMaXN0LmNvbnRhaW5zKG5hbWUpKVxuICAgICAgbGV0IG5ld0FkZHMgPSBwcmV2QWRkcy5maWx0ZXIobmFtZSA9PiByZW1vdmVzLmluZGV4T2YobmFtZSkgPCAwKS5jb25jYXQoa2VlcEFkZHMpXG4gICAgICBsZXQgbmV3UmVtb3ZlcyA9IHByZXZSZW1vdmVzLmZpbHRlcihuYW1lID0+IGFkZHMuaW5kZXhPZihuYW1lKSA8IDApLmNvbmNhdChrZWVwUmVtb3ZlcylcblxuICAgICAgRE9NLnB1dFN0aWNreShlbCwgXCJjbGFzc2VzXCIsIGN1cnJlbnRFbCA9PiB7XG4gICAgICAgIGN1cnJlbnRFbC5jbGFzc0xpc3QucmVtb3ZlKC4uLm5ld1JlbW92ZXMpXG4gICAgICAgIGN1cnJlbnRFbC5jbGFzc0xpc3QuYWRkKC4uLm5ld0FkZHMpXG4gICAgICAgIHJldHVybiBbbmV3QWRkcywgbmV3UmVtb3Zlc11cbiAgICAgIH0pXG4gICAgfSlcbiAgfSxcblxuICBzZXRPclJlbW92ZUF0dHJzKGVsLCBzZXRzLCByZW1vdmVzKXtcbiAgICBsZXQgW3ByZXZTZXRzLCBwcmV2UmVtb3Zlc10gPSBET00uZ2V0U3RpY2t5KGVsLCBcImF0dHJzXCIsIFtbXSwgW11dKVxuXG4gICAgbGV0IGFsdGVyZWRBdHRycyA9IHNldHMubWFwKChbYXR0ciwgX3ZhbF0pID0+IGF0dHIpLmNvbmNhdChyZW1vdmVzKTtcbiAgICBsZXQgbmV3U2V0cyA9IHByZXZTZXRzLmZpbHRlcigoW2F0dHIsIF92YWxdKSA9PiAhYWx0ZXJlZEF0dHJzLmluY2x1ZGVzKGF0dHIpKS5jb25jYXQoc2V0cyk7XG4gICAgbGV0IG5ld1JlbW92ZXMgPSBwcmV2UmVtb3Zlcy5maWx0ZXIoKGF0dHIpID0+ICFhbHRlcmVkQXR0cnMuaW5jbHVkZXMoYXR0cikpLmNvbmNhdChyZW1vdmVzKTtcblxuICAgIERPTS5wdXRTdGlja3koZWwsIFwiYXR0cnNcIiwgY3VycmVudEVsID0+IHtcbiAgICAgIG5ld1JlbW92ZXMuZm9yRWFjaChhdHRyID0+IGN1cnJlbnRFbC5yZW1vdmVBdHRyaWJ1dGUoYXR0cikpXG4gICAgICBuZXdTZXRzLmZvckVhY2goKFthdHRyLCB2YWxdKSA9PiBjdXJyZW50RWwuc2V0QXR0cmlidXRlKGF0dHIsIHZhbCkpXG4gICAgICByZXR1cm4gW25ld1NldHMsIG5ld1JlbW92ZXNdXG4gICAgfSlcbiAgfSxcblxuICBoYXNBbGxDbGFzc2VzKGVsLCBjbGFzc2VzKXsgcmV0dXJuIGNsYXNzZXMuZXZlcnkobmFtZSA9PiBlbC5jbGFzc0xpc3QuY29udGFpbnMobmFtZSkpIH0sXG5cbiAgaXNUb2dnbGVkT3V0KGVsLCBvdXRDbGFzc2VzKXtcbiAgICByZXR1cm4gIXRoaXMuaXNWaXNpYmxlKGVsKSB8fCB0aGlzLmhhc0FsbENsYXNzZXMoZWwsIG91dENsYXNzZXMpXG4gIH0sXG5cbiAgZmlsdGVyVG9FbHMoc291cmNlRWwsIHt0b30pe1xuICAgIHJldHVybiB0byA/IERPTS5hbGwoZG9jdW1lbnQsIHRvKSA6IFtzb3VyY2VFbF1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBKU1xuIiwgImltcG9ydCB7XG4gIEJFRk9SRV9VTkxPQURfTE9BREVSX1RJTUVPVVQsXG4gIENIRUNLQUJMRV9JTlBVVFMsXG4gIENPTlNFQ1VUSVZFX1JFTE9BRFMsXG4gIFBIWF9BVVRPX1JFQ09WRVIsXG4gIFBIWF9DT01QT05FTlQsXG4gIFBIWF9DT05ORUNURURfQ0xBU1MsXG4gIFBIWF9ESVNBQkxFX1dJVEgsXG4gIFBIWF9ESVNBQkxFX1dJVEhfUkVTVE9SRSxcbiAgUEhYX0RJU0FCTEVELFxuICBQSFhfRElTQ09OTkVDVEVEX0NMQVNTLFxuICBQSFhfRVZFTlRfQ0xBU1NFUyxcbiAgUEhYX0VSUk9SX0NMQVNTLFxuICBQSFhfRkVFREJBQ0tfRk9SLFxuICBQSFhfSEFTX1NVQk1JVFRFRCxcbiAgUEhYX0hPT0ssXG4gIFBIWF9QQUdFX0xPQURJTkcsXG4gIFBIWF9QQVJFTlRfSUQsXG4gIFBIWF9QUk9HUkVTUyxcbiAgUEhYX1JFQURPTkxZLFxuICBQSFhfUkVGLFxuICBQSFhfUkVGX1NSQyxcbiAgUEhYX1JPT1RfSUQsXG4gIFBIWF9TRVNTSU9OLFxuICBQSFhfU1RBVElDLFxuICBQSFhfVFJBQ0tfU1RBVElDLFxuICBQSFhfVFJBQ0tfVVBMT0FEUyxcbiAgUEhYX1VQREFURSxcbiAgUEhYX1VQTE9BRF9SRUYsXG4gIFBIWF9WSUVXX1NFTEVDVE9SLFxuICBQVVNIX1RJTUVPVVQsXG4gIFBIWF9NQUlOLFxufSBmcm9tIFwiLi9jb25zdGFudHNcIlxuXG5pbXBvcnQge1xuICBjbG9uZSxcbiAgY2xvc2VzdFBoeEJpbmRpbmcsXG4gIGlzRW1wdHksXG4gIGlzRXF1YWxPYmosXG4gIGxvZ0Vycm9yLFxuICBtYXliZSxcbiAgaXNDaWQsXG59IGZyb20gXCIuL3V0aWxzXCJcblxuaW1wb3J0IEJyb3dzZXIgZnJvbSBcIi4vYnJvd3NlclwiXG5pbXBvcnQgRE9NIGZyb20gXCIuL2RvbVwiXG5pbXBvcnQgRE9NUGF0Y2ggZnJvbSBcIi4vZG9tX3BhdGNoXCJcbmltcG9ydCBMaXZlVXBsb2FkZXIgZnJvbSBcIi4vbGl2ZV91cGxvYWRlclwiXG5pbXBvcnQgUmVuZGVyZWQgZnJvbSBcIi4vcmVuZGVyZWRcIlxuaW1wb3J0IFZpZXdIb29rIGZyb20gXCIuL3ZpZXdfaG9va1wiXG5pbXBvcnQgSlMgZnJvbSBcIi4vanNcIlxuXG5sZXQgc2VyaWFsaXplRm9ybSA9IChmb3JtLCBtZXRhLCBvbmx5TmFtZXMgPSBbXSkgPT4ge1xuICBsZXQgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoZm9ybSlcbiAgbGV0IHRvUmVtb3ZlID0gW11cblxuICBmb3JtRGF0YS5mb3JFYWNoKCh2YWwsIGtleSwgX2luZGV4KSA9PiB7XG4gICAgaWYodmFsIGluc3RhbmNlb2YgRmlsZSl7IHRvUmVtb3ZlLnB1c2goa2V5KSB9XG4gIH0pXG5cbiAgLy8gQ2xlYW51cCBhZnRlciBidWlsZGluZyBmaWxlRGF0YVxuICB0b1JlbW92ZS5mb3JFYWNoKGtleSA9PiBmb3JtRGF0YS5kZWxldGUoa2V5KSlcblxuICBsZXQgcGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcygpXG4gIGZvcihsZXQgW2tleSwgdmFsXSBvZiBmb3JtRGF0YS5lbnRyaWVzKCkpe1xuICAgIGlmKG9ubHlOYW1lcy5sZW5ndGggPT09IDAgfHwgb25seU5hbWVzLmluZGV4T2Yoa2V5KSA+PSAwKXtcbiAgICAgIHBhcmFtcy5hcHBlbmQoa2V5LCB2YWwpXG4gICAgfVxuICB9XG4gIGZvcihsZXQgbWV0YUtleSBpbiBtZXRhKXsgcGFyYW1zLmFwcGVuZChtZXRhS2V5LCBtZXRhW21ldGFLZXldKSB9XG5cbiAgcmV0dXJuIHBhcmFtcy50b1N0cmluZygpXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFZpZXcge1xuICBjb25zdHJ1Y3RvcihlbCwgbGl2ZVNvY2tldCwgcGFyZW50VmlldywgZmxhc2gpe1xuICAgIHRoaXMubGl2ZVNvY2tldCA9IGxpdmVTb2NrZXRcbiAgICB0aGlzLmZsYXNoID0gZmxhc2hcbiAgICB0aGlzLnBhcmVudCA9IHBhcmVudFZpZXdcbiAgICB0aGlzLnJvb3QgPSBwYXJlbnRWaWV3ID8gcGFyZW50Vmlldy5yb290IDogdGhpc1xuICAgIHRoaXMuZWwgPSBlbFxuICAgIHRoaXMuaWQgPSB0aGlzLmVsLmlkXG4gICAgdGhpcy5yZWYgPSAwXG4gICAgdGhpcy5jaGlsZEpvaW5zID0gMFxuICAgIHRoaXMubG9hZGVyVGltZXIgPSBudWxsXG4gICAgdGhpcy5wZW5kaW5nRGlmZnMgPSBbXVxuICAgIHRoaXMucHJ1bmluZ0NJRHMgPSBbXVxuICAgIHRoaXMucmVkaXJlY3QgPSBmYWxzZVxuICAgIHRoaXMuaHJlZiA9IG51bGxcbiAgICB0aGlzLmpvaW5Db3VudCA9IHRoaXMucGFyZW50ID8gdGhpcy5wYXJlbnQuam9pbkNvdW50IC0gMSA6IDBcbiAgICB0aGlzLmpvaW5QZW5kaW5nID0gdHJ1ZVxuICAgIHRoaXMuZGVzdHJveWVkID0gZmFsc2VcbiAgICB0aGlzLmpvaW5DYWxsYmFjayA9IGZ1bmN0aW9uKG9uRG9uZSl7IG9uRG9uZSAmJiBvbkRvbmUoKSB9XG4gICAgdGhpcy5zdG9wQ2FsbGJhY2sgPSBmdW5jdGlvbigpeyB9XG4gICAgdGhpcy5wZW5kaW5nSm9pbk9wcyA9IHRoaXMucGFyZW50ID8gbnVsbCA6IFtdXG4gICAgdGhpcy52aWV3SG9va3MgPSB7fVxuICAgIHRoaXMudXBsb2FkZXJzID0ge31cbiAgICB0aGlzLmZvcm1TdWJtaXRzID0gW11cbiAgICB0aGlzLmNoaWxkcmVuID0gdGhpcy5wYXJlbnQgPyBudWxsIDoge31cbiAgICB0aGlzLnJvb3QuY2hpbGRyZW5bdGhpcy5pZF0gPSB7fVxuICAgIHRoaXMuY2hhbm5lbCA9IHRoaXMubGl2ZVNvY2tldC5jaGFubmVsKGBsdjoke3RoaXMuaWR9YCwgKCkgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcmVkaXJlY3Q6IHRoaXMucmVkaXJlY3QgPyB0aGlzLmhyZWYgOiB1bmRlZmluZWQsXG4gICAgICAgIHVybDogdGhpcy5yZWRpcmVjdCA/IHVuZGVmaW5lZCA6IHRoaXMuaHJlZiB8fCB1bmRlZmluZWQsXG4gICAgICAgIHBhcmFtczogdGhpcy5jb25uZWN0UGFyYW1zKCksXG4gICAgICAgIHNlc3Npb246IHRoaXMuZ2V0U2Vzc2lvbigpLFxuICAgICAgICBzdGF0aWM6IHRoaXMuZ2V0U3RhdGljKCksXG4gICAgICAgIGZsYXNoOiB0aGlzLmZsYXNoXG4gICAgICB9XG4gICAgfSlcbiAgICB0aGlzLnNob3dMb2FkZXIodGhpcy5saXZlU29ja2V0LmxvYWRlclRpbWVvdXQpXG4gICAgdGhpcy5iaW5kQ2hhbm5lbCgpXG4gIH1cblxuICBzZXRIcmVmKGhyZWYpeyB0aGlzLmhyZWYgPSBocmVmIH1cblxuICBzZXRSZWRpcmVjdChocmVmKXtcbiAgICB0aGlzLnJlZGlyZWN0ID0gdHJ1ZVxuICAgIHRoaXMuaHJlZiA9IGhyZWZcbiAgfVxuXG4gIGlzTWFpbigpeyByZXR1cm4gdGhpcy5lbC5oYXNBdHRyaWJ1dGUoUEhYX01BSU4pIH1cblxuICBjb25uZWN0UGFyYW1zKCl7XG4gICAgbGV0IHBhcmFtcyA9IHRoaXMubGl2ZVNvY2tldC5wYXJhbXModGhpcy5lbClcbiAgICBsZXQgbWFuaWZlc3QgPVxuICAgICAgRE9NLmFsbChkb2N1bWVudCwgYFske3RoaXMuYmluZGluZyhQSFhfVFJBQ0tfU1RBVElDKX1dYClcbiAgICAgICAgLm1hcChub2RlID0+IG5vZGUuc3JjIHx8IG5vZGUuaHJlZikuZmlsdGVyKHVybCA9PiB0eXBlb2YgKHVybCkgPT09IFwic3RyaW5nXCIpXG5cbiAgICBpZihtYW5pZmVzdC5sZW5ndGggPiAwKXsgcGFyYW1zW1wiX3RyYWNrX3N0YXRpY1wiXSA9IG1hbmlmZXN0IH1cbiAgICBwYXJhbXNbXCJfbW91bnRzXCJdID0gdGhpcy5qb2luQ291bnRcblxuICAgIHJldHVybiBwYXJhbXNcbiAgfVxuXG4gIGlzQ29ubmVjdGVkKCl7IHJldHVybiB0aGlzLmNoYW5uZWwuY2FuUHVzaCgpIH1cblxuICBnZXRTZXNzaW9uKCl7IHJldHVybiB0aGlzLmVsLmdldEF0dHJpYnV0ZShQSFhfU0VTU0lPTikgfVxuXG4gIGdldFN0YXRpYygpe1xuICAgIGxldCB2YWwgPSB0aGlzLmVsLmdldEF0dHJpYnV0ZShQSFhfU1RBVElDKVxuICAgIHJldHVybiB2YWwgPT09IFwiXCIgPyBudWxsIDogdmFsXG4gIH1cblxuICBkZXN0cm95KGNhbGxiYWNrID0gZnVuY3Rpb24gKCl7IH0pe1xuICAgIHRoaXMuZGVzdHJveUFsbENoaWxkcmVuKClcbiAgICB0aGlzLmRlc3Ryb3llZCA9IHRydWVcbiAgICBkZWxldGUgdGhpcy5yb290LmNoaWxkcmVuW3RoaXMuaWRdXG4gICAgaWYodGhpcy5wYXJlbnQpeyBkZWxldGUgdGhpcy5yb290LmNoaWxkcmVuW3RoaXMucGFyZW50LmlkXVt0aGlzLmlkXSB9XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMubG9hZGVyVGltZXIpXG4gICAgbGV0IG9uRmluaXNoZWQgPSAoKSA9PiB7XG4gICAgICBjYWxsYmFjaygpXG4gICAgICBmb3IobGV0IGlkIGluIHRoaXMudmlld0hvb2tzKXtcbiAgICAgICAgdGhpcy5kZXN0cm95SG9vayh0aGlzLnZpZXdIb29rc1tpZF0pXG4gICAgICB9XG4gICAgfVxuXG4gICAgRE9NLm1hcmtQaHhDaGlsZERlc3Ryb3llZCh0aGlzLmVsKVxuXG4gICAgdGhpcy5sb2coXCJkZXN0cm95ZWRcIiwgKCkgPT4gW1widGhlIGNoaWxkIGhhcyBiZWVuIHJlbW92ZWQgZnJvbSB0aGUgcGFyZW50XCJdKVxuICAgIHRoaXMuY2hhbm5lbC5sZWF2ZSgpXG4gICAgICAucmVjZWl2ZShcIm9rXCIsIG9uRmluaXNoZWQpXG4gICAgICAucmVjZWl2ZShcImVycm9yXCIsIG9uRmluaXNoZWQpXG4gICAgICAucmVjZWl2ZShcInRpbWVvdXRcIiwgb25GaW5pc2hlZClcbiAgfVxuXG4gIHNldENvbnRhaW5lckNsYXNzZXMoLi4uY2xhc3Nlcyl7XG4gICAgdGhpcy5lbC5jbGFzc0xpc3QucmVtb3ZlKFxuICAgICAgUEhYX0NPTk5FQ1RFRF9DTEFTUyxcbiAgICAgIFBIWF9ESVNDT05ORUNURURfQ0xBU1MsXG4gICAgICBQSFhfRVJST1JfQ0xBU1NcbiAgICApXG4gICAgdGhpcy5lbC5jbGFzc0xpc3QuYWRkKC4uLmNsYXNzZXMpXG4gIH1cblxuICBzaG93TG9hZGVyKHRpbWVvdXQpe1xuICAgIGNsZWFyVGltZW91dCh0aGlzLmxvYWRlclRpbWVyKVxuICAgIGlmKHRpbWVvdXQpe1xuICAgICAgdGhpcy5sb2FkZXJUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4gdGhpcy5zaG93TG9hZGVyKCksIHRpbWVvdXQpXG4gICAgfSBlbHNlIHtcbiAgICAgIGZvcihsZXQgaWQgaW4gdGhpcy52aWV3SG9va3MpeyB0aGlzLnZpZXdIb29rc1tpZF0uX19kaXNjb25uZWN0ZWQoKSB9XG4gICAgICB0aGlzLnNldENvbnRhaW5lckNsYXNzZXMoUEhYX0RJU0NPTk5FQ1RFRF9DTEFTUylcbiAgICB9XG4gIH1cblxuICBoaWRlTG9hZGVyKCl7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMubG9hZGVyVGltZXIpXG4gICAgdGhpcy5zZXRDb250YWluZXJDbGFzc2VzKFBIWF9DT05ORUNURURfQ0xBU1MpXG4gIH1cblxuICB0cmlnZ2VyUmVjb25uZWN0ZWQoKXtcbiAgICBmb3IobGV0IGlkIGluIHRoaXMudmlld0hvb2tzKXsgdGhpcy52aWV3SG9va3NbaWRdLl9fcmVjb25uZWN0ZWQoKSB9XG4gIH1cblxuICBsb2coa2luZCwgbXNnQ2FsbGJhY2spe1xuICAgIHRoaXMubGl2ZVNvY2tldC5sb2codGhpcywga2luZCwgbXNnQ2FsbGJhY2spXG4gIH1cblxuICB0cmFuc2l0aW9uKHRpbWUsIG9uU3RhcnQsIG9uRG9uZSA9IGZ1bmN0aW9uKCl7fSl7XG4gICAgdGhpcy5saXZlU29ja2V0LnRyYW5zaXRpb24odGltZSwgb25TdGFydCwgb25Eb25lKVxuICB9XG5cbiAgd2l0aGluVGFyZ2V0cyhwaHhUYXJnZXQsIGNhbGxiYWNrKXtcbiAgICBpZihwaHhUYXJnZXQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCB8fCBwaHhUYXJnZXQgaW5zdGFuY2VvZiBTVkdFbGVtZW50KXtcbiAgICAgIHJldHVybiB0aGlzLmxpdmVTb2NrZXQub3duZXIocGh4VGFyZ2V0LCB2aWV3ID0+IGNhbGxiYWNrKHZpZXcsIHBoeFRhcmdldCkpXG4gICAgfVxuXG4gICAgaWYoaXNDaWQocGh4VGFyZ2V0KSl7XG4gICAgICBsZXQgdGFyZ2V0cyA9IERPTS5maW5kQ29tcG9uZW50Tm9kZUxpc3QodGhpcy5lbCwgcGh4VGFyZ2V0KVxuICAgICAgaWYodGFyZ2V0cy5sZW5ndGggPT09IDApe1xuICAgICAgICBsb2dFcnJvcihgbm8gY29tcG9uZW50IGZvdW5kIG1hdGNoaW5nIHBoeC10YXJnZXQgb2YgJHtwaHhUYXJnZXR9YClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbGxiYWNrKHRoaXMsIHBhcnNlSW50KHBoeFRhcmdldCkpXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCB0YXJnZXRzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHBoeFRhcmdldCkpXG4gICAgICBpZih0YXJnZXRzLmxlbmd0aCA9PT0gMCl7IGxvZ0Vycm9yKGBub3RoaW5nIGZvdW5kIG1hdGNoaW5nIHRoZSBwaHgtdGFyZ2V0IHNlbGVjdG9yIFwiJHtwaHhUYXJnZXR9XCJgKSB9XG4gICAgICB0YXJnZXRzLmZvckVhY2godGFyZ2V0ID0+IHRoaXMubGl2ZVNvY2tldC5vd25lcih0YXJnZXQsIHZpZXcgPT4gY2FsbGJhY2sodmlldywgdGFyZ2V0KSkpXG4gICAgfVxuICB9XG5cbiAgYXBwbHlEaWZmKHR5cGUsIHJhd0RpZmYsIGNhbGxiYWNrKXtcbiAgICB0aGlzLmxvZyh0eXBlLCAoKSA9PiBbXCJcIiwgY2xvbmUocmF3RGlmZildKVxuICAgIGxldCB7ZGlmZiwgcmVwbHksIGV2ZW50cywgdGl0bGV9ID0gUmVuZGVyZWQuZXh0cmFjdChyYXdEaWZmKVxuICAgIGlmKHRpdGxlKXsgRE9NLnB1dFRpdGxlKHRpdGxlKSB9XG5cbiAgICBjYWxsYmFjayh7ZGlmZiwgcmVwbHksIGV2ZW50c30pXG4gICAgcmV0dXJuIHJlcGx5XG4gIH1cblxuICBvbkpvaW4ocmVzcCl7XG4gICAgbGV0IHtyZW5kZXJlZCwgY29udGFpbmVyfSA9IHJlc3BcbiAgICBpZihjb250YWluZXIpe1xuICAgICAgbGV0IFt0YWcsIGF0dHJzXSA9IGNvbnRhaW5lclxuICAgICAgdGhpcy5lbCA9IERPTS5yZXBsYWNlUm9vdENvbnRhaW5lcih0aGlzLmVsLCB0YWcsIGF0dHJzKVxuICAgIH1cbiAgICB0aGlzLmNoaWxkSm9pbnMgPSAwXG4gICAgdGhpcy5qb2luUGVuZGluZyA9IHRydWVcbiAgICB0aGlzLmZsYXNoID0gbnVsbFxuXG4gICAgQnJvd3Nlci5kcm9wTG9jYWwodGhpcy5saXZlU29ja2V0LmxvY2FsU3RvcmFnZSwgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLCBDT05TRUNVVElWRV9SRUxPQURTKVxuICAgIHRoaXMuYXBwbHlEaWZmKFwibW91bnRcIiwgcmVuZGVyZWQsICh7ZGlmZiwgZXZlbnRzfSkgPT4ge1xuICAgICAgdGhpcy5yZW5kZXJlZCA9IG5ldyBSZW5kZXJlZCh0aGlzLmlkLCBkaWZmKVxuICAgICAgbGV0IGh0bWwgPSB0aGlzLnJlbmRlckNvbnRhaW5lcihudWxsLCBcImpvaW5cIilcbiAgICAgIHRoaXMuZHJvcFBlbmRpbmdSZWZzKClcbiAgICAgIGxldCBmb3JtcyA9IHRoaXMuZm9ybXNGb3JSZWNvdmVyeShodG1sKVxuICAgICAgdGhpcy5qb2luQ291bnQrK1xuXG4gICAgICBpZihmb3Jtcy5sZW5ndGggPiAwKXtcbiAgICAgICAgZm9ybXMuZm9yRWFjaCgoW2Zvcm0sIG5ld0Zvcm0sIG5ld0NpZF0sIGkpID0+IHtcbiAgICAgICAgICB0aGlzLnB1c2hGb3JtUmVjb3ZlcnkoZm9ybSwgbmV3Q2lkLCByZXNwID0+IHtcbiAgICAgICAgICAgIGlmKGkgPT09IGZvcm1zLmxlbmd0aCAtIDEpe1xuICAgICAgICAgICAgICB0aGlzLm9uSm9pbkNvbXBsZXRlKHJlc3AsIGh0bWwsIGV2ZW50cylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5vbkpvaW5Db21wbGV0ZShyZXNwLCBodG1sLCBldmVudHMpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGRyb3BQZW5kaW5nUmVmcygpe1xuICAgIERPTS5hbGwoZG9jdW1lbnQsIGBbJHtQSFhfUkVGX1NSQ309XCIke3RoaXMuaWR9XCJdWyR7UEhYX1JFRn1dYCwgZWwgPT4ge1xuICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKFBIWF9SRUYpXG4gICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoUEhYX1JFRl9TUkMpXG4gICAgfSlcbiAgfVxuXG4gIG9uSm9pbkNvbXBsZXRlKHtsaXZlX3BhdGNofSwgaHRtbCwgZXZlbnRzKXtcbiAgICAvLyBJbiBvcmRlciB0byBwcm92aWRlIGEgYmV0dGVyIGV4cGVyaWVuY2UsIHdlIHdhbnQgdG8gam9pblxuICAgIC8vIGFsbCBMaXZlVmlld3MgZmlyc3QgYW5kIG9ubHkgdGhlbiBhcHBseSB0aGVpciBwYXRjaGVzLlxuICAgIGlmKHRoaXMuam9pbkNvdW50ID4gMSB8fCAodGhpcy5wYXJlbnQgJiYgIXRoaXMucGFyZW50LmlzSm9pblBlbmRpbmcoKSkpe1xuICAgICAgcmV0dXJuIHRoaXMuYXBwbHlKb2luUGF0Y2gobGl2ZV9wYXRjaCwgaHRtbCwgZXZlbnRzKVxuICAgIH1cblxuICAgIC8vIE9uZSBkb3duc2lkZSBvZiB0aGlzIGFwcHJvYWNoIGlzIHRoYXQgd2UgbmVlZCB0byBmaW5kIHBoeENoaWxkcmVuXG4gICAgLy8gaW4gdGhlIGh0bWwgZnJhZ21lbnQsIGluc3RlYWQgb2YgZGlyZWN0bHkgb24gdGhlIERPTS4gVGhlIGZyYWdtZW50XG4gICAgLy8gYWxzbyBkb2VzIG5vdCBpbmNsdWRlIFBIWF9TVEFUSUMsIHNvIHdlIG5lZWQgdG8gY29weSBpdCBvdmVyIGZyb21cbiAgICAvLyB0aGUgRE9NLlxuICAgIGxldCBuZXdDaGlsZHJlbiA9IERPTS5maW5kUGh4Q2hpbGRyZW5JbkZyYWdtZW50KGh0bWwsIHRoaXMuaWQpLmZpbHRlcih0b0VsID0+IHtcbiAgICAgIGxldCBmcm9tRWwgPSB0b0VsLmlkICYmIHRoaXMuZWwucXVlcnlTZWxlY3RvcihgW2lkPVwiJHt0b0VsLmlkfVwiXWApXG4gICAgICBsZXQgcGh4U3RhdGljID0gZnJvbUVsICYmIGZyb21FbC5nZXRBdHRyaWJ1dGUoUEhYX1NUQVRJQylcbiAgICAgIGlmKHBoeFN0YXRpYyl7IHRvRWwuc2V0QXR0cmlidXRlKFBIWF9TVEFUSUMsIHBoeFN0YXRpYykgfVxuICAgICAgcmV0dXJuIHRoaXMuam9pbkNoaWxkKHRvRWwpXG4gICAgfSlcblxuICAgIGlmKG5ld0NoaWxkcmVuLmxlbmd0aCA9PT0gMCl7XG4gICAgICBpZih0aGlzLnBhcmVudCl7XG4gICAgICAgIHRoaXMucm9vdC5wZW5kaW5nSm9pbk9wcy5wdXNoKFt0aGlzLCAoKSA9PiB0aGlzLmFwcGx5Sm9pblBhdGNoKGxpdmVfcGF0Y2gsIGh0bWwsIGV2ZW50cyldKVxuICAgICAgICB0aGlzLnBhcmVudC5hY2tKb2luKHRoaXMpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm9uQWxsQ2hpbGRKb2luc0NvbXBsZXRlKClcbiAgICAgICAgdGhpcy5hcHBseUpvaW5QYXRjaChsaXZlX3BhdGNoLCBodG1sLCBldmVudHMpXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucm9vdC5wZW5kaW5nSm9pbk9wcy5wdXNoKFt0aGlzLCAoKSA9PiB0aGlzLmFwcGx5Sm9pblBhdGNoKGxpdmVfcGF0Y2gsIGh0bWwsIGV2ZW50cyldKVxuICAgIH1cbiAgfVxuXG4gIGF0dGFjaFRydWVEb2NFbCgpe1xuICAgIHRoaXMuZWwgPSBET00uYnlJZCh0aGlzLmlkKVxuICAgIHRoaXMuZWwuc2V0QXR0cmlidXRlKFBIWF9ST09UX0lELCB0aGlzLnJvb3QuaWQpXG4gIH1cblxuICBhcHBseUpvaW5QYXRjaChsaXZlX3BhdGNoLCBodG1sLCBldmVudHMpe1xuICAgIHRoaXMuYXR0YWNoVHJ1ZURvY0VsKClcbiAgICBsZXQgcGF0Y2ggPSBuZXcgRE9NUGF0Y2godGhpcywgdGhpcy5lbCwgdGhpcy5pZCwgaHRtbCwgbnVsbClcbiAgICBwYXRjaC5tYXJrUHJ1bmFibGVDb250ZW50Rm9yUmVtb3ZhbCgpXG4gICAgdGhpcy5wZXJmb3JtUGF0Y2gocGF0Y2gsIGZhbHNlKVxuICAgIHRoaXMuam9pbk5ld0NoaWxkcmVuKClcbiAgICBET00uYWxsKHRoaXMuZWwsIGBbJHt0aGlzLmJpbmRpbmcoUEhYX0hPT0spfV0sIFtkYXRhLXBoeC0ke1BIWF9IT09LfV1gLCBob29rRWwgPT4ge1xuICAgICAgbGV0IGhvb2sgPSB0aGlzLmFkZEhvb2soaG9va0VsKVxuICAgICAgaWYoaG9vayl7IGhvb2suX19tb3VudGVkKCkgfVxuICAgIH0pXG5cbiAgICB0aGlzLmpvaW5QZW5kaW5nID0gZmFsc2VcbiAgICB0aGlzLmxpdmVTb2NrZXQuZGlzcGF0Y2hFdmVudHMoZXZlbnRzKVxuICAgIHRoaXMuYXBwbHlQZW5kaW5nVXBkYXRlcygpXG5cbiAgICBpZihsaXZlX3BhdGNoKXtcbiAgICAgIGxldCB7a2luZCwgdG99ID0gbGl2ZV9wYXRjaFxuICAgICAgdGhpcy5saXZlU29ja2V0Lmhpc3RvcnlQYXRjaCh0bywga2luZClcbiAgICB9XG4gICAgdGhpcy5oaWRlTG9hZGVyKClcbiAgICBpZih0aGlzLmpvaW5Db3VudCA+IDEpeyB0aGlzLnRyaWdnZXJSZWNvbm5lY3RlZCgpIH1cbiAgICB0aGlzLnN0b3BDYWxsYmFjaygpXG4gIH1cblxuICB0cmlnZ2VyQmVmb3JlVXBkYXRlSG9vayhmcm9tRWwsIHRvRWwpe1xuICAgIHRoaXMubGl2ZVNvY2tldC50cmlnZ2VyRE9NKFwib25CZWZvcmVFbFVwZGF0ZWRcIiwgW2Zyb21FbCwgdG9FbF0pXG4gICAgbGV0IGhvb2sgPSB0aGlzLmdldEhvb2soZnJvbUVsKVxuICAgIGxldCBpc0lnbm9yZWQgPSBob29rICYmIERPTS5pc0lnbm9yZWQoZnJvbUVsLCB0aGlzLmJpbmRpbmcoUEhYX1VQREFURSkpXG4gICAgaWYoaG9vayAmJiAhZnJvbUVsLmlzRXF1YWxOb2RlKHRvRWwpICYmICEoaXNJZ25vcmVkICYmIGlzRXF1YWxPYmooZnJvbUVsLmRhdGFzZXQsIHRvRWwuZGF0YXNldCkpKXtcbiAgICAgIGhvb2suX19iZWZvcmVVcGRhdGUoKVxuICAgICAgcmV0dXJuIGhvb2tcbiAgICB9XG4gIH1cblxuICBwZXJmb3JtUGF0Y2gocGF0Y2gsIHBydW5lQ2lkcyl7XG4gICAgbGV0IHJlbW92ZWRFbHMgPSBbXVxuICAgIGxldCBwaHhDaGlsZHJlbkFkZGVkID0gZmFsc2VcbiAgICBsZXQgdXBkYXRlZEhvb2tJZHMgPSBuZXcgU2V0KClcblxuICAgIHBhdGNoLmFmdGVyKFwiYWRkZWRcIiwgZWwgPT4ge1xuICAgICAgdGhpcy5saXZlU29ja2V0LnRyaWdnZXJET00oXCJvbk5vZGVBZGRlZFwiLCBbZWxdKVxuXG4gICAgICBsZXQgbmV3SG9vayA9IHRoaXMuYWRkSG9vayhlbClcbiAgICAgIGlmKG5ld0hvb2speyBuZXdIb29rLl9fbW91bnRlZCgpIH1cbiAgICB9KVxuXG4gICAgcGF0Y2guYWZ0ZXIoXCJwaHhDaGlsZEFkZGVkXCIsIGVsID0+IHtcbiAgICAgIGlmKERPTS5pc1BoeFN0aWNreShlbCkpe1xuICAgICAgICB0aGlzLmxpdmVTb2NrZXQuam9pblJvb3RWaWV3cygpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwaHhDaGlsZHJlbkFkZGVkID0gdHJ1ZVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBwYXRjaC5iZWZvcmUoXCJ1cGRhdGVkXCIsIChmcm9tRWwsIHRvRWwpID0+IHtcbiAgICAgIGxldCBob29rID0gdGhpcy50cmlnZ2VyQmVmb3JlVXBkYXRlSG9vayhmcm9tRWwsIHRvRWwpXG4gICAgICBpZihob29rKXsgdXBkYXRlZEhvb2tJZHMuYWRkKGZyb21FbC5pZCkgfVxuICAgIH0pXG5cbiAgICBwYXRjaC5hZnRlcihcInVwZGF0ZWRcIiwgZWwgPT4ge1xuICAgICAgaWYodXBkYXRlZEhvb2tJZHMuaGFzKGVsLmlkKSl7IHRoaXMuZ2V0SG9vayhlbCkuX191cGRhdGVkKCkgfVxuICAgIH0pXG5cbiAgICBwYXRjaC5hZnRlcihcImRpc2NhcmRlZFwiLCAoZWwpID0+IHtcbiAgICAgIGlmKGVsLm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERSl7IHJlbW92ZWRFbHMucHVzaChlbCkgfVxuICAgIH0pXG5cbiAgICBwYXRjaC5hZnRlcihcInRyYW5zaXRpb25zRGlzY2FyZGVkXCIsIGVscyA9PiB0aGlzLmFmdGVyRWxlbWVudHNSZW1vdmVkKGVscywgcHJ1bmVDaWRzKSlcbiAgICBwYXRjaC5wZXJmb3JtKClcbiAgICB0aGlzLmFmdGVyRWxlbWVudHNSZW1vdmVkKHJlbW92ZWRFbHMsIHBydW5lQ2lkcylcblxuICAgIHJldHVybiBwaHhDaGlsZHJlbkFkZGVkXG4gIH1cblxuICBhZnRlckVsZW1lbnRzUmVtb3ZlZChlbGVtZW50cywgcHJ1bmVDaWRzKXtcbiAgICBsZXQgZGVzdHJveWVkQ0lEcyA9IFtdXG4gICAgZWxlbWVudHMuZm9yRWFjaChwYXJlbnQgPT4ge1xuICAgICAgbGV0IGNvbXBvbmVudHMgPSBET00uYWxsKHBhcmVudCwgYFske1BIWF9DT01QT05FTlR9XWApXG4gICAgICBsZXQgaG9va3MgPSBET00uYWxsKHBhcmVudCwgYFske3RoaXMuYmluZGluZyhQSFhfSE9PSyl9XWApXG4gICAgICBjb21wb25lbnRzLmNvbmNhdChwYXJlbnQpLmZvckVhY2goZWwgPT4ge1xuICAgICAgICBsZXQgY2lkID0gdGhpcy5jb21wb25lbnRJRChlbClcbiAgICAgICAgaWYoaXNDaWQoY2lkKSAmJiBkZXN0cm95ZWRDSURzLmluZGV4T2YoY2lkKSA9PT0gLTEpeyBkZXN0cm95ZWRDSURzLnB1c2goY2lkKSB9XG4gICAgICB9KVxuICAgICAgaG9va3MuY29uY2F0KHBhcmVudCkuZm9yRWFjaChob29rRWwgPT4ge1xuICAgICAgICBsZXQgaG9vayA9IHRoaXMuZ2V0SG9vayhob29rRWwpXG4gICAgICAgIGhvb2sgJiYgdGhpcy5kZXN0cm95SG9vayhob29rKVxuICAgICAgfSlcbiAgICB9KVxuICAgIC8vIFdlIHNob3VsZCBub3QgcHJ1bmVDaWRzIG9uIGpvaW5zLiBPdGhlcndpc2UsIGluIGNhc2Ugb2ZcbiAgICAvLyByZWpvaW5zLCB3ZSBtYXkgbm90aWZ5IGNpZHMgdGhhdCBubyBsb25nZXIgYmVsb25nIHRvIHRoZVxuICAgIC8vIGN1cnJlbnQgTGl2ZVZpZXcgdG8gYmUgcmVtb3ZlZC5cbiAgICBpZihwcnVuZUNpZHMpe1xuICAgICAgdGhpcy5tYXliZVB1c2hDb21wb25lbnRzRGVzdHJveWVkKGRlc3Ryb3llZENJRHMpXG4gICAgfVxuICB9XG5cbiAgam9pbk5ld0NoaWxkcmVuKCl7XG4gICAgRE9NLmZpbmRQaHhDaGlsZHJlbih0aGlzLmVsLCB0aGlzLmlkKS5mb3JFYWNoKGVsID0+IHRoaXMuam9pbkNoaWxkKGVsKSlcbiAgfVxuXG4gIGdldENoaWxkQnlJZChpZCl7IHJldHVybiB0aGlzLnJvb3QuY2hpbGRyZW5bdGhpcy5pZF1baWRdIH1cblxuICBnZXREZXNjZW5kZW50QnlFbChlbCl7XG4gICAgaWYoZWwuaWQgPT09IHRoaXMuaWQpe1xuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW5bZWwuZ2V0QXR0cmlidXRlKFBIWF9QQVJFTlRfSUQpXVtlbC5pZF1cbiAgICB9XG4gIH1cblxuICBkZXN0cm95RGVzY2VuZGVudChpZCl7XG4gICAgZm9yKGxldCBwYXJlbnRJZCBpbiB0aGlzLnJvb3QuY2hpbGRyZW4pe1xuICAgICAgZm9yKGxldCBjaGlsZElkIGluIHRoaXMucm9vdC5jaGlsZHJlbltwYXJlbnRJZF0pe1xuICAgICAgICBpZihjaGlsZElkID09PSBpZCl7IHJldHVybiB0aGlzLnJvb3QuY2hpbGRyZW5bcGFyZW50SWRdW2NoaWxkSWRdLmRlc3Ryb3koKSB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgam9pbkNoaWxkKGVsKXtcbiAgICBsZXQgY2hpbGQgPSB0aGlzLmdldENoaWxkQnlJZChlbC5pZClcbiAgICBpZighY2hpbGQpe1xuICAgICAgbGV0IHZpZXcgPSBuZXcgVmlldyhlbCwgdGhpcy5saXZlU29ja2V0LCB0aGlzKVxuICAgICAgdGhpcy5yb290LmNoaWxkcmVuW3RoaXMuaWRdW3ZpZXcuaWRdID0gdmlld1xuICAgICAgdmlldy5qb2luKClcbiAgICAgIHRoaXMuY2hpbGRKb2lucysrXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgfVxuXG4gIGlzSm9pblBlbmRpbmcoKXsgcmV0dXJuIHRoaXMuam9pblBlbmRpbmcgfVxuXG4gIGFja0pvaW4oX2NoaWxkKXtcbiAgICB0aGlzLmNoaWxkSm9pbnMtLVxuXG4gICAgaWYodGhpcy5jaGlsZEpvaW5zID09PSAwKXtcbiAgICAgIGlmKHRoaXMucGFyZW50KXtcbiAgICAgICAgdGhpcy5wYXJlbnQuYWNrSm9pbih0aGlzKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5vbkFsbENoaWxkSm9pbnNDb21wbGV0ZSgpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgb25BbGxDaGlsZEpvaW5zQ29tcGxldGUoKXtcbiAgICB0aGlzLmpvaW5DYWxsYmFjaygoKSA9PiB7XG4gICAgICB0aGlzLnBlbmRpbmdKb2luT3BzLmZvckVhY2goKFt2aWV3LCBvcF0pID0+IHtcbiAgICAgICAgaWYoIXZpZXcuaXNEZXN0cm95ZWQoKSl7IG9wKCkgfVxuICAgICAgfSlcbiAgICAgIHRoaXMucGVuZGluZ0pvaW5PcHMgPSBbXVxuICAgIH0pXG4gIH1cblxuICB1cGRhdGUoZGlmZiwgZXZlbnRzKXtcbiAgICBpZih0aGlzLmlzSm9pblBlbmRpbmcoKSB8fCAodGhpcy5saXZlU29ja2V0Lmhhc1BlbmRpbmdMaW5rKCkgJiYgIURPTS5pc1BoeFN0aWNreSh0aGlzLmVsKSkpe1xuICAgICAgcmV0dXJuIHRoaXMucGVuZGluZ0RpZmZzLnB1c2goe2RpZmYsIGV2ZW50c30pXG4gICAgfVxuXG4gICAgdGhpcy5yZW5kZXJlZC5tZXJnZURpZmYoZGlmZilcbiAgICBsZXQgcGh4Q2hpbGRyZW5BZGRlZCA9IGZhbHNlXG5cbiAgICAvLyBXaGVuIHRoZSBkaWZmIG9ubHkgY29udGFpbnMgY29tcG9uZW50IGRpZmZzLCB0aGVuIHdhbGsgY29tcG9uZW50c1xuICAgIC8vIGFuZCBwYXRjaCBvbmx5IHRoZSBwYXJlbnQgY29tcG9uZW50IGNvbnRhaW5lcnMgZm91bmQgaW4gdGhlIGRpZmYuXG4gICAgLy8gT3RoZXJ3aXNlLCBwYXRjaCBlbnRpcmUgTFYgY29udGFpbmVyLlxuICAgIGlmKHRoaXMucmVuZGVyZWQuaXNDb21wb25lbnRPbmx5RGlmZihkaWZmKSl7XG4gICAgICB0aGlzLmxpdmVTb2NrZXQudGltZShcImNvbXBvbmVudCBwYXRjaCBjb21wbGV0ZVwiLCAoKSA9PiB7XG4gICAgICAgIGxldCBwYXJlbnRDaWRzID0gRE9NLmZpbmRQYXJlbnRDSURzKHRoaXMuZWwsIHRoaXMucmVuZGVyZWQuY29tcG9uZW50Q0lEcyhkaWZmKSlcbiAgICAgICAgcGFyZW50Q2lkcy5mb3JFYWNoKHBhcmVudENJRCA9PiB7XG4gICAgICAgICAgaWYodGhpcy5jb21wb25lbnRQYXRjaCh0aGlzLnJlbmRlcmVkLmdldENvbXBvbmVudChkaWZmLCBwYXJlbnRDSUQpLCBwYXJlbnRDSUQpKXsgcGh4Q2hpbGRyZW5BZGRlZCA9IHRydWUgfVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9IGVsc2UgaWYoIWlzRW1wdHkoZGlmZikpe1xuICAgICAgdGhpcy5saXZlU29ja2V0LnRpbWUoXCJmdWxsIHBhdGNoIGNvbXBsZXRlXCIsICgpID0+IHtcbiAgICAgICAgbGV0IGh0bWwgPSB0aGlzLnJlbmRlckNvbnRhaW5lcihkaWZmLCBcInVwZGF0ZVwiKVxuICAgICAgICBsZXQgcGF0Y2ggPSBuZXcgRE9NUGF0Y2godGhpcywgdGhpcy5lbCwgdGhpcy5pZCwgaHRtbCwgbnVsbClcbiAgICAgICAgcGh4Q2hpbGRyZW5BZGRlZCA9IHRoaXMucGVyZm9ybVBhdGNoKHBhdGNoLCB0cnVlKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICB0aGlzLmxpdmVTb2NrZXQuZGlzcGF0Y2hFdmVudHMoZXZlbnRzKVxuICAgIGlmKHBoeENoaWxkcmVuQWRkZWQpeyB0aGlzLmpvaW5OZXdDaGlsZHJlbigpIH1cbiAgfVxuXG4gIHJlbmRlckNvbnRhaW5lcihkaWZmLCBraW5kKXtcbiAgICByZXR1cm4gdGhpcy5saXZlU29ja2V0LnRpbWUoYHRvU3RyaW5nIGRpZmYgKCR7a2luZH0pYCwgKCkgPT4ge1xuICAgICAgbGV0IHRhZyA9IHRoaXMuZWwudGFnTmFtZVxuICAgICAgLy8gRG9uJ3Qgc2tpcCBhbnkgY29tcG9uZW50IGluIHRoZSBkaWZmIG5vciBhbnkgbWFya2VkIGFzIHBydW5lZFxuICAgICAgLy8gKGFzIHRoZXkgbWF5IGhhdmUgYmVlbiBhZGRlZCBiYWNrKVxuICAgICAgbGV0IGNpZHMgPSBkaWZmID8gdGhpcy5yZW5kZXJlZC5jb21wb25lbnRDSURzKGRpZmYpLmNvbmNhdCh0aGlzLnBydW5pbmdDSURzKSA6IG51bGxcbiAgICAgIGxldCBodG1sID0gdGhpcy5yZW5kZXJlZC50b1N0cmluZyhjaWRzKVxuICAgICAgcmV0dXJuIGA8JHt0YWd9PiR7aHRtbH08LyR7dGFnfT5gXG4gICAgfSlcbiAgfVxuXG4gIGNvbXBvbmVudFBhdGNoKGRpZmYsIGNpZCl7XG4gICAgaWYoaXNFbXB0eShkaWZmKSkgcmV0dXJuIGZhbHNlXG4gICAgbGV0IGh0bWwgPSB0aGlzLnJlbmRlcmVkLmNvbXBvbmVudFRvU3RyaW5nKGNpZClcbiAgICBsZXQgcGF0Y2ggPSBuZXcgRE9NUGF0Y2godGhpcywgdGhpcy5lbCwgdGhpcy5pZCwgaHRtbCwgY2lkKVxuICAgIGxldCBjaGlsZHJlbkFkZGVkID0gdGhpcy5wZXJmb3JtUGF0Y2gocGF0Y2gsIHRydWUpXG4gICAgcmV0dXJuIGNoaWxkcmVuQWRkZWRcbiAgfVxuXG4gIGdldEhvb2soZWwpeyByZXR1cm4gdGhpcy52aWV3SG9va3NbVmlld0hvb2suZWxlbWVudElEKGVsKV0gfVxuXG4gIGFkZEhvb2soZWwpe1xuICAgIGlmKFZpZXdIb29rLmVsZW1lbnRJRChlbCkgfHwgIWVsLmdldEF0dHJpYnV0ZSl7IHJldHVybiB9XG4gICAgbGV0IGhvb2tOYW1lID0gZWwuZ2V0QXR0cmlidXRlKGBkYXRhLXBoeC0ke1BIWF9IT09LfWApIHx8IGVsLmdldEF0dHJpYnV0ZSh0aGlzLmJpbmRpbmcoUEhYX0hPT0spKVxuICAgIGlmKGhvb2tOYW1lICYmICF0aGlzLm93bnNFbGVtZW50KGVsKSl7IHJldHVybiB9XG4gICAgbGV0IGNhbGxiYWNrcyA9IHRoaXMubGl2ZVNvY2tldC5nZXRIb29rQ2FsbGJhY2tzKGhvb2tOYW1lKVxuXG4gICAgaWYoY2FsbGJhY2tzKXtcbiAgICAgIGlmKCFlbC5pZCl7IGxvZ0Vycm9yKGBubyBET00gSUQgZm9yIGhvb2sgXCIke2hvb2tOYW1lfVwiLiBIb29rcyByZXF1aXJlIGEgdW5pcXVlIElEIG9uIGVhY2ggZWxlbWVudC5gLCBlbCkgfVxuICAgICAgbGV0IGhvb2sgPSBuZXcgVmlld0hvb2sodGhpcywgZWwsIGNhbGxiYWNrcylcbiAgICAgIHRoaXMudmlld0hvb2tzW1ZpZXdIb29rLmVsZW1lbnRJRChob29rLmVsKV0gPSBob29rXG4gICAgICByZXR1cm4gaG9va1xuICAgIH0gZWxzZSBpZihob29rTmFtZSAhPT0gbnVsbCl7XG4gICAgICBsb2dFcnJvcihgdW5rbm93biBob29rIGZvdW5kIGZvciBcIiR7aG9va05hbWV9XCJgLCBlbClcbiAgICB9XG4gIH1cblxuICBkZXN0cm95SG9vayhob29rKXtcbiAgICBob29rLl9fZGVzdHJveWVkKClcbiAgICBob29rLl9fY2xlYW51cF9fKClcbiAgICBkZWxldGUgdGhpcy52aWV3SG9va3NbVmlld0hvb2suZWxlbWVudElEKGhvb2suZWwpXVxuICB9XG5cbiAgYXBwbHlQZW5kaW5nVXBkYXRlcygpe1xuICAgIHRoaXMucGVuZGluZ0RpZmZzLmZvckVhY2goKHtkaWZmLCBldmVudHN9KSA9PiB0aGlzLnVwZGF0ZShkaWZmLCBldmVudHMpKVxuICAgIHRoaXMucGVuZGluZ0RpZmZzID0gW11cbiAgfVxuXG4gIG9uQ2hhbm5lbChldmVudCwgY2Ipe1xuICAgIHRoaXMubGl2ZVNvY2tldC5vbkNoYW5uZWwodGhpcy5jaGFubmVsLCBldmVudCwgcmVzcCA9PiB7XG4gICAgICBpZih0aGlzLmlzSm9pblBlbmRpbmcoKSl7XG4gICAgICAgIHRoaXMucm9vdC5wZW5kaW5nSm9pbk9wcy5wdXNoKFt0aGlzLCAoKSA9PiBjYihyZXNwKV0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmxpdmVTb2NrZXQucmVxdWVzdERPTVVwZGF0ZSgoKSA9PiBjYihyZXNwKSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgYmluZENoYW5uZWwoKXtcbiAgICAvLyBUaGUgZGlmZiBldmVudCBzaG91bGQgYmUgaGFuZGxlZCBieSB0aGUgcmVndWxhciB1cGRhdGUgb3BlcmF0aW9ucy5cbiAgICAvLyBBbGwgb3RoZXIgb3BlcmF0aW9ucyBhcmUgcXVldWVkIHRvIGJlIGFwcGxpZWQgb25seSBhZnRlciBqb2luLlxuICAgIHRoaXMubGl2ZVNvY2tldC5vbkNoYW5uZWwodGhpcy5jaGFubmVsLCBcImRpZmZcIiwgKHJhd0RpZmYpID0+IHtcbiAgICAgIHRoaXMubGl2ZVNvY2tldC5yZXF1ZXN0RE9NVXBkYXRlKCgpID0+IHtcbiAgICAgICAgdGhpcy5hcHBseURpZmYoXCJ1cGRhdGVcIiwgcmF3RGlmZiwgKHtkaWZmLCBldmVudHN9KSA9PiB0aGlzLnVwZGF0ZShkaWZmLCBldmVudHMpKVxuICAgICAgfSlcbiAgICB9KVxuICAgIHRoaXMub25DaGFubmVsKFwicmVkaXJlY3RcIiwgKHt0bywgZmxhc2h9KSA9PiB0aGlzLm9uUmVkaXJlY3Qoe3RvLCBmbGFzaH0pKVxuICAgIHRoaXMub25DaGFubmVsKFwibGl2ZV9wYXRjaFwiLCAocmVkaXIpID0+IHRoaXMub25MaXZlUGF0Y2gocmVkaXIpKVxuICAgIHRoaXMub25DaGFubmVsKFwibGl2ZV9yZWRpcmVjdFwiLCAocmVkaXIpID0+IHRoaXMub25MaXZlUmVkaXJlY3QocmVkaXIpKVxuICAgIHRoaXMuY2hhbm5lbC5vbkVycm9yKHJlYXNvbiA9PiB0aGlzLm9uRXJyb3IocmVhc29uKSlcbiAgICB0aGlzLmNoYW5uZWwub25DbG9zZShyZWFzb24gPT4gdGhpcy5vbkNsb3NlKHJlYXNvbikpXG4gIH1cblxuICBkZXN0cm95QWxsQ2hpbGRyZW4oKXtcbiAgICBmb3IobGV0IGlkIGluIHRoaXMucm9vdC5jaGlsZHJlblt0aGlzLmlkXSl7XG4gICAgICB0aGlzLmdldENoaWxkQnlJZChpZCkuZGVzdHJveSgpXG4gICAgfVxuICB9XG5cbiAgb25MaXZlUmVkaXJlY3QocmVkaXIpe1xuICAgIGxldCB7dG8sIGtpbmQsIGZsYXNofSA9IHJlZGlyXG4gICAgbGV0IHVybCA9IHRoaXMuZXhwYW5kVVJMKHRvKVxuICAgIHRoaXMubGl2ZVNvY2tldC5oaXN0b3J5UmVkaXJlY3QodXJsLCBraW5kLCBmbGFzaClcbiAgfVxuXG4gIG9uTGl2ZVBhdGNoKHJlZGlyKXtcbiAgICBsZXQge3RvLCBraW5kfSA9IHJlZGlyXG4gICAgdGhpcy5ocmVmID0gdGhpcy5leHBhbmRVUkwodG8pXG4gICAgdGhpcy5saXZlU29ja2V0Lmhpc3RvcnlQYXRjaCh0bywga2luZClcbiAgfVxuXG4gIGV4cGFuZFVSTCh0byl7XG4gICAgcmV0dXJuIHRvLnN0YXJ0c1dpdGgoXCIvXCIpID8gYCR7d2luZG93LmxvY2F0aW9uLnByb3RvY29sfS8vJHt3aW5kb3cubG9jYXRpb24uaG9zdH0ke3RvfWAgOiB0b1xuICB9XG5cbiAgb25SZWRpcmVjdCh7dG8sIGZsYXNofSl7IHRoaXMubGl2ZVNvY2tldC5yZWRpcmVjdCh0bywgZmxhc2gpIH1cblxuICBpc0Rlc3Ryb3llZCgpeyByZXR1cm4gdGhpcy5kZXN0cm95ZWQgfVxuXG4gIGpvaW4oY2FsbGJhY2spe1xuICAgIGlmKHRoaXMuaXNNYWluKCkpe1xuICAgICAgdGhpcy5zdG9wQ2FsbGJhY2sgPSB0aGlzLmxpdmVTb2NrZXQud2l0aFBhZ2VMb2FkaW5nKHt0bzogdGhpcy5ocmVmLCBraW5kOiBcImluaXRpYWxcIn0pXG4gICAgfVxuICAgIHRoaXMuam9pbkNhbGxiYWNrID0gKG9uRG9uZSkgPT4ge1xuICAgICAgb25Eb25lID0gb25Eb25lIHx8IGZ1bmN0aW9uKCl7fVxuICAgICAgY2FsbGJhY2sgPyBjYWxsYmFjayh0aGlzLmpvaW5Db3VudCwgb25Eb25lKSA6IG9uRG9uZSgpXG4gICAgfVxuICAgIHRoaXMubGl2ZVNvY2tldC53cmFwUHVzaCh0aGlzLCB7dGltZW91dDogZmFsc2V9LCAoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5jaGFubmVsLmpvaW4oKVxuICAgICAgICAucmVjZWl2ZShcIm9rXCIsIGRhdGEgPT4ge1xuICAgICAgICAgIGlmKCF0aGlzLmlzRGVzdHJveWVkKCkpe1xuICAgICAgICAgICAgdGhpcy5saXZlU29ja2V0LnJlcXVlc3RET01VcGRhdGUoKCkgPT4gdGhpcy5vbkpvaW4oZGF0YSkpXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAucmVjZWl2ZShcImVycm9yXCIsIHJlc3AgPT4gIXRoaXMuaXNEZXN0cm95ZWQoKSAmJiB0aGlzLm9uSm9pbkVycm9yKHJlc3ApKVxuICAgICAgICAucmVjZWl2ZShcInRpbWVvdXRcIiwgKCkgPT4gIXRoaXMuaXNEZXN0cm95ZWQoKSAmJiB0aGlzLm9uSm9pbkVycm9yKHtyZWFzb246IFwidGltZW91dFwifSkpXG4gICAgfSlcbiAgfVxuXG4gIG9uSm9pbkVycm9yKHJlc3Ape1xuICAgIGlmKHJlc3AucmVhc29uID09PSBcInVuYXV0aG9yaXplZFwiIHx8IHJlc3AucmVhc29uID09PSBcInN0YWxlXCIpe1xuICAgICAgdGhpcy5sb2coXCJlcnJvclwiLCAoKSA9PiBbXCJ1bmF1dGhvcml6ZWQgbGl2ZV9yZWRpcmVjdC4gRmFsbGluZyBiYWNrIHRvIHBhZ2UgcmVxdWVzdFwiLCByZXNwXSlcbiAgICAgIHJldHVybiB0aGlzLm9uUmVkaXJlY3Qoe3RvOiB0aGlzLmhyZWZ9KVxuICAgIH1cbiAgICBpZihyZXNwLnJlZGlyZWN0IHx8IHJlc3AubGl2ZV9yZWRpcmVjdCl7XG4gICAgICB0aGlzLmpvaW5QZW5kaW5nID0gZmFsc2VcbiAgICAgIHRoaXMuY2hhbm5lbC5sZWF2ZSgpXG4gICAgfVxuICAgIGlmKHJlc3AucmVkaXJlY3QpeyByZXR1cm4gdGhpcy5vblJlZGlyZWN0KHJlc3AucmVkaXJlY3QpIH1cbiAgICBpZihyZXNwLmxpdmVfcmVkaXJlY3QpeyByZXR1cm4gdGhpcy5vbkxpdmVSZWRpcmVjdChyZXNwLmxpdmVfcmVkaXJlY3QpIH1cbiAgICB0aGlzLmxvZyhcImVycm9yXCIsICgpID0+IFtcInVuYWJsZSB0byBqb2luXCIsIHJlc3BdKVxuICAgIGlmKHRoaXMubGl2ZVNvY2tldC5pc0Nvbm5lY3RlZCgpKXsgdGhpcy5saXZlU29ja2V0LnJlbG9hZFdpdGhKaXR0ZXIodGhpcykgfVxuICB9XG5cbiAgb25DbG9zZShyZWFzb24pe1xuICAgIGlmKHRoaXMuaXNEZXN0cm95ZWQoKSl7IHJldHVybiB9XG4gICAgaWYodGhpcy5saXZlU29ja2V0Lmhhc1BlbmRpbmdMaW5rKCkgJiYgcmVhc29uICE9PSBcImxlYXZlXCIpe1xuICAgICAgcmV0dXJuIHRoaXMubGl2ZVNvY2tldC5yZWxvYWRXaXRoSml0dGVyKHRoaXMpXG4gICAgfVxuICAgIHRoaXMuZGVzdHJveUFsbENoaWxkcmVuKClcbiAgICB0aGlzLmxpdmVTb2NrZXQuZHJvcEFjdGl2ZUVsZW1lbnQodGhpcylcbiAgICAvLyBkb2N1bWVudC5hY3RpdmVFbGVtZW50IGNhbiBiZSBudWxsIGluIEludGVybmV0IEV4cGxvcmVyIDExXG4gICAgaWYoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCl7IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuYmx1cigpIH1cbiAgICBpZih0aGlzLmxpdmVTb2NrZXQuaXNVbmxvYWRlZCgpKXtcbiAgICAgIHRoaXMuc2hvd0xvYWRlcihCRUZPUkVfVU5MT0FEX0xPQURFUl9USU1FT1VUKVxuICAgIH1cbiAgfVxuXG4gIG9uRXJyb3IocmVhc29uKXtcbiAgICB0aGlzLm9uQ2xvc2UocmVhc29uKVxuICAgIGlmKHRoaXMubGl2ZVNvY2tldC5pc0Nvbm5lY3RlZCgpKXsgdGhpcy5sb2coXCJlcnJvclwiLCAoKSA9PiBbXCJ2aWV3IGNyYXNoZWRcIiwgcmVhc29uXSkgfVxuICAgIGlmKCF0aGlzLmxpdmVTb2NrZXQuaXNVbmxvYWRlZCgpKXsgdGhpcy5kaXNwbGF5RXJyb3IoKSB9XG4gIH1cblxuICBkaXNwbGF5RXJyb3IoKXtcbiAgICBpZih0aGlzLmlzTWFpbigpKXsgRE9NLmRpc3BhdGNoRXZlbnQod2luZG93LCBcInBoeDpwYWdlLWxvYWRpbmctc3RhcnRcIiwge2RldGFpbDoge3RvOiB0aGlzLmhyZWYsIGtpbmQ6IFwiZXJyb3JcIn19KSB9XG4gICAgdGhpcy5zaG93TG9hZGVyKClcbiAgICB0aGlzLnNldENvbnRhaW5lckNsYXNzZXMoUEhYX0RJU0NPTk5FQ1RFRF9DTEFTUywgUEhYX0VSUk9SX0NMQVNTKVxuICB9XG5cbiAgcHVzaFdpdGhSZXBseShyZWZHZW5lcmF0b3IsIGV2ZW50LCBwYXlsb2FkLCBvblJlcGx5ID0gZnVuY3Rpb24gKCl7IH0pe1xuICAgIGlmKCF0aGlzLmlzQ29ubmVjdGVkKCkpeyByZXR1cm4gfVxuXG4gICAgbGV0IFtyZWYsIFtlbF0sIG9wdHNdID0gcmVmR2VuZXJhdG9yID8gcmVmR2VuZXJhdG9yKCkgOiBbbnVsbCwgW10sIHt9XVxuICAgIGxldCBvbkxvYWRpbmdEb25lID0gZnVuY3Rpb24oKXsgfVxuICAgIGlmKG9wdHMucGFnZV9sb2FkaW5nIHx8IChlbCAmJiAoZWwuZ2V0QXR0cmlidXRlKHRoaXMuYmluZGluZyhQSFhfUEFHRV9MT0FESU5HKSkgIT09IG51bGwpKSl7XG4gICAgICBvbkxvYWRpbmdEb25lID0gdGhpcy5saXZlU29ja2V0LndpdGhQYWdlTG9hZGluZyh7a2luZDogXCJlbGVtZW50XCIsIHRhcmdldDogZWx9KVxuICAgIH1cblxuICAgIGlmKHR5cGVvZiAocGF5bG9hZC5jaWQpICE9PSBcIm51bWJlclwiKXsgZGVsZXRlIHBheWxvYWQuY2lkIH1cbiAgICByZXR1cm4gKFxuICAgICAgdGhpcy5saXZlU29ja2V0LndyYXBQdXNoKHRoaXMsIHt0aW1lb3V0OiB0cnVlfSwgKCkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGFubmVsLnB1c2goZXZlbnQsIHBheWxvYWQsIFBVU0hfVElNRU9VVCkucmVjZWl2ZShcIm9rXCIsIHJlc3AgPT4ge1xuICAgICAgICAgIGlmKHJlZiAhPT0gbnVsbCl7IHRoaXMudW5kb1JlZnMocmVmKSB9XG4gICAgICAgICAgbGV0IGZpbmlzaCA9IChob29rUmVwbHkpID0+IHtcbiAgICAgICAgICAgIGlmKHJlc3AucmVkaXJlY3QpeyB0aGlzLm9uUmVkaXJlY3QocmVzcC5yZWRpcmVjdCkgfVxuICAgICAgICAgICAgaWYocmVzcC5saXZlX3BhdGNoKXsgdGhpcy5vbkxpdmVQYXRjaChyZXNwLmxpdmVfcGF0Y2gpIH1cbiAgICAgICAgICAgIGlmKHJlc3AubGl2ZV9yZWRpcmVjdCl7IHRoaXMub25MaXZlUmVkaXJlY3QocmVzcC5saXZlX3JlZGlyZWN0KSB9XG4gICAgICAgICAgICBvbkxvYWRpbmdEb25lKClcbiAgICAgICAgICAgIG9uUmVwbHkocmVzcCwgaG9va1JlcGx5KVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZihyZXNwLmRpZmYpe1xuICAgICAgICAgICAgdGhpcy5saXZlU29ja2V0LnJlcXVlc3RET01VcGRhdGUoKCkgPT4ge1xuICAgICAgICAgICAgICBsZXQgaG9va1JlcGx5ID0gdGhpcy5hcHBseURpZmYoXCJ1cGRhdGVcIiwgcmVzcC5kaWZmLCAoe2RpZmYsIGV2ZW50c30pID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZShkaWZmLCBldmVudHMpXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIGZpbmlzaChob29rUmVwbHkpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmaW5pc2gobnVsbClcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIClcbiAgfVxuXG4gIHVuZG9SZWZzKHJlZil7XG4gICAgRE9NLmFsbChkb2N1bWVudCwgYFske1BIWF9SRUZfU1JDfT1cIiR7dGhpcy5pZH1cIl1bJHtQSFhfUkVGfT1cIiR7cmVmfVwiXWAsIGVsID0+IHtcbiAgICAgIGxldCBkaXNhYmxlZFZhbCA9IGVsLmdldEF0dHJpYnV0ZShQSFhfRElTQUJMRUQpXG4gICAgICAvLyByZW1vdmUgcmVmc1xuICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKFBIWF9SRUYpXG4gICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoUEhYX1JFRl9TUkMpXG4gICAgICAvLyByZXN0b3JlIGlucHV0c1xuICAgICAgaWYoZWwuZ2V0QXR0cmlidXRlKFBIWF9SRUFET05MWSkgIT09IG51bGwpe1xuICAgICAgICBlbC5yZWFkT25seSA9IGZhbHNlXG4gICAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZShQSFhfUkVBRE9OTFkpXG4gICAgICB9XG4gICAgICBpZihkaXNhYmxlZFZhbCAhPT0gbnVsbCl7XG4gICAgICAgIGVsLmRpc2FibGVkID0gZGlzYWJsZWRWYWwgPT09IFwidHJ1ZVwiID8gdHJ1ZSA6IGZhbHNlXG4gICAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZShQSFhfRElTQUJMRUQpXG4gICAgICB9XG4gICAgICAvLyByZW1vdmUgY2xhc3Nlc1xuICAgICAgUEhYX0VWRU5UX0NMQVNTRVMuZm9yRWFjaChjbGFzc05hbWUgPT4gRE9NLnJlbW92ZUNsYXNzKGVsLCBjbGFzc05hbWUpKVxuICAgICAgLy8gcmVzdG9yZSBkaXNhYmxlc1xuICAgICAgbGV0IGRpc2FibGVSZXN0b3JlID0gZWwuZ2V0QXR0cmlidXRlKFBIWF9ESVNBQkxFX1dJVEhfUkVTVE9SRSlcbiAgICAgIGlmKGRpc2FibGVSZXN0b3JlICE9PSBudWxsKXtcbiAgICAgICAgZWwuaW5uZXJUZXh0ID0gZGlzYWJsZVJlc3RvcmVcbiAgICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKFBIWF9ESVNBQkxFX1dJVEhfUkVTVE9SRSlcbiAgICAgIH1cbiAgICAgIGxldCB0b0VsID0gRE9NLnByaXZhdGUoZWwsIFBIWF9SRUYpXG4gICAgICBpZih0b0VsKXtcbiAgICAgICAgbGV0IGhvb2sgPSB0aGlzLnRyaWdnZXJCZWZvcmVVcGRhdGVIb29rKGVsLCB0b0VsKVxuICAgICAgICBET01QYXRjaC5wYXRjaEVsKGVsLCB0b0VsLCB0aGlzLmxpdmVTb2NrZXQuZ2V0QWN0aXZlRWxlbWVudCgpKVxuICAgICAgICBpZihob29rKXsgaG9vay5fX3VwZGF0ZWQoKSB9XG4gICAgICAgIERPTS5kZWxldGVQcml2YXRlKGVsLCBQSFhfUkVGKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBwdXRSZWYoZWxlbWVudHMsIGV2ZW50LCBvcHRzID0ge30pe1xuICAgIGxldCBuZXdSZWYgPSB0aGlzLnJlZisrXG4gICAgbGV0IGRpc2FibGVXaXRoID0gdGhpcy5iaW5kaW5nKFBIWF9ESVNBQkxFX1dJVEgpXG4gICAgaWYob3B0cy5sb2FkaW5nKXsgZWxlbWVudHMgPSBlbGVtZW50cy5jb25jYXQoRE9NLmFsbChkb2N1bWVudCwgb3B0cy5sb2FkaW5nKSl9XG5cbiAgICBlbGVtZW50cy5mb3JFYWNoKGVsID0+IHtcbiAgICAgIGVsLmNsYXNzTGlzdC5hZGQoYHBoeC0ke2V2ZW50fS1sb2FkaW5nYClcbiAgICAgIGVsLnNldEF0dHJpYnV0ZShQSFhfUkVGLCBuZXdSZWYpXG4gICAgICBlbC5zZXRBdHRyaWJ1dGUoUEhYX1JFRl9TUkMsIHRoaXMuZWwuaWQpXG4gICAgICBsZXQgZGlzYWJsZVRleHQgPSBlbC5nZXRBdHRyaWJ1dGUoZGlzYWJsZVdpdGgpXG4gICAgICBpZihkaXNhYmxlVGV4dCAhPT0gbnVsbCl7XG4gICAgICAgIGlmKCFlbC5nZXRBdHRyaWJ1dGUoUEhYX0RJU0FCTEVfV0lUSF9SRVNUT1JFKSl7XG4gICAgICAgICAgZWwuc2V0QXR0cmlidXRlKFBIWF9ESVNBQkxFX1dJVEhfUkVTVE9SRSwgZWwuaW5uZXJUZXh0KVxuICAgICAgICB9XG4gICAgICAgIGlmKGRpc2FibGVUZXh0ICE9PSBcIlwiKXsgZWwuaW5uZXJUZXh0ID0gZGlzYWJsZVRleHQgfVxuICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiLCBcIlwiKVxuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIFtuZXdSZWYsIGVsZW1lbnRzLCBvcHRzXVxuICB9XG5cbiAgY29tcG9uZW50SUQoZWwpe1xuICAgIGxldCBjaWQgPSBlbC5nZXRBdHRyaWJ1dGUgJiYgZWwuZ2V0QXR0cmlidXRlKFBIWF9DT01QT05FTlQpXG4gICAgcmV0dXJuIGNpZCA/IHBhcnNlSW50KGNpZCkgOiBudWxsXG4gIH1cblxuICB0YXJnZXRDb21wb25lbnRJRCh0YXJnZXQsIHRhcmdldEN0eCwgb3B0cyA9IHt9KXtcbiAgICBpZihpc0NpZCh0YXJnZXRDdHgpKXsgcmV0dXJuIHRhcmdldEN0eCB9XG5cbiAgICBsZXQgY2lkT3JTZWxlY3RvciA9IHRhcmdldC5nZXRBdHRyaWJ1dGUodGhpcy5iaW5kaW5nKFwidGFyZ2V0XCIpKVxuICAgIGlmKGlzQ2lkKGNpZE9yU2VsZWN0b3IpKXtcbiAgICAgIHJldHVybiBwYXJzZUludChjaWRPclNlbGVjdG9yKVxuICAgIH0gZWxzZSBpZih0YXJnZXRDdHggJiYgKGNpZE9yU2VsZWN0b3IgIT09IG51bGwgfHwgb3B0cy50YXJnZXQpKXtcbiAgICAgIHJldHVybiB0aGlzLmNsb3Nlc3RDb21wb25lbnRJRCh0YXJnZXRDdHgpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuICB9XG5cbiAgY2xvc2VzdENvbXBvbmVudElEKHRhcmdldEN0eCl7XG4gICAgaWYoaXNDaWQodGFyZ2V0Q3R4KSl7XG4gICAgICByZXR1cm4gdGFyZ2V0Q3R4XG4gICAgfSBlbHNlIGlmKHRhcmdldEN0eCl7XG4gICAgICByZXR1cm4gbWF5YmUodGFyZ2V0Q3R4LmNsb3Nlc3QoYFske1BIWF9DT01QT05FTlR9XWApLCBlbCA9PiB0aGlzLm93bnNFbGVtZW50KGVsKSAmJiB0aGlzLmNvbXBvbmVudElEKGVsKSlcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG4gIH1cblxuICBwdXNoSG9va0V2ZW50KHRhcmdldEN0eCwgZXZlbnQsIHBheWxvYWQsIG9uUmVwbHkpe1xuICAgIGlmKCF0aGlzLmlzQ29ubmVjdGVkKCkpe1xuICAgICAgdGhpcy5sb2coXCJob29rXCIsICgpID0+IFtcInVuYWJsZSB0byBwdXNoIGhvb2sgZXZlbnQuIExpdmVWaWV3IG5vdCBjb25uZWN0ZWRcIiwgZXZlbnQsIHBheWxvYWRdKVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICAgIGxldCBbcmVmLCBlbHMsIG9wdHNdID0gdGhpcy5wdXRSZWYoW10sIFwiaG9va1wiKVxuICAgIHRoaXMucHVzaFdpdGhSZXBseSgoKSA9PiBbcmVmLCBlbHMsIG9wdHNdLCBcImV2ZW50XCIsIHtcbiAgICAgIHR5cGU6IFwiaG9va1wiLFxuICAgICAgZXZlbnQ6IGV2ZW50LFxuICAgICAgdmFsdWU6IHBheWxvYWQsXG4gICAgICBjaWQ6IHRoaXMuY2xvc2VzdENvbXBvbmVudElEKHRhcmdldEN0eClcbiAgICB9LCAocmVzcCwgcmVwbHkpID0+IG9uUmVwbHkocmVwbHksIHJlZikpXG5cbiAgICByZXR1cm4gcmVmXG4gIH1cblxuICBleHRyYWN0TWV0YShlbCwgbWV0YSwgdmFsdWUpe1xuICAgIGxldCBwcmVmaXggPSB0aGlzLmJpbmRpbmcoXCJ2YWx1ZS1cIilcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgZWwuYXR0cmlidXRlcy5sZW5ndGg7IGkrKyl7XG4gICAgICBpZighbWV0YSl7IG1ldGEgPSB7fSB9XG4gICAgICBsZXQgbmFtZSA9IGVsLmF0dHJpYnV0ZXNbaV0ubmFtZVxuICAgICAgaWYobmFtZS5zdGFydHNXaXRoKHByZWZpeCkpeyBtZXRhW25hbWUucmVwbGFjZShwcmVmaXgsIFwiXCIpXSA9IGVsLmdldEF0dHJpYnV0ZShuYW1lKSB9XG4gICAgfVxuICAgIGlmKGVsLnZhbHVlICE9PSB1bmRlZmluZWQpe1xuICAgICAgaWYoIW1ldGEpeyBtZXRhID0ge30gfVxuICAgICAgbWV0YS52YWx1ZSA9IGVsLnZhbHVlXG5cbiAgICAgIGlmKGVsLnRhZ05hbWUgPT09IFwiSU5QVVRcIiAmJiBDSEVDS0FCTEVfSU5QVVRTLmluZGV4T2YoZWwudHlwZSkgPj0gMCAmJiAhZWwuY2hlY2tlZCl7XG4gICAgICAgIGRlbGV0ZSBtZXRhLnZhbHVlXG4gICAgICB9XG4gICAgfVxuICAgIGlmKHZhbHVlKXtcbiAgICAgIGlmKCFtZXRhKXsgbWV0YSA9IHt9IH1cbiAgICAgIGZvcihsZXQga2V5IGluIHZhbHVlKXsgbWV0YVtrZXldID0gdmFsdWVba2V5XSB9XG4gICAgfVxuICAgIHJldHVybiBtZXRhXG4gIH1cblxuICBwdXNoRXZlbnQodHlwZSwgZWwsIHRhcmdldEN0eCwgcGh4RXZlbnQsIG1ldGEsIG9wdHMgPSB7fSl7XG4gICAgdGhpcy5wdXNoV2l0aFJlcGx5KCgpID0+IHRoaXMucHV0UmVmKFtlbF0sIHR5cGUsIG9wdHMpLCBcImV2ZW50XCIsIHtcbiAgICAgIHR5cGU6IHR5cGUsXG4gICAgICBldmVudDogcGh4RXZlbnQsXG4gICAgICB2YWx1ZTogdGhpcy5leHRyYWN0TWV0YShlbCwgbWV0YSwgb3B0cy52YWx1ZSksXG4gICAgICBjaWQ6IHRoaXMudGFyZ2V0Q29tcG9uZW50SUQoZWwsIHRhcmdldEN0eCwgb3B0cylcbiAgICB9KVxuICB9XG5cbiAgcHVzaEZpbGVQcm9ncmVzcyhmaWxlRWwsIGVudHJ5UmVmLCBwcm9ncmVzcywgb25SZXBseSA9IGZ1bmN0aW9uICgpeyB9KXtcbiAgICB0aGlzLmxpdmVTb2NrZXQud2l0aGluT3duZXJzKGZpbGVFbC5mb3JtLCAodmlldywgdGFyZ2V0Q3R4KSA9PiB7XG4gICAgICB2aWV3LnB1c2hXaXRoUmVwbHkobnVsbCwgXCJwcm9ncmVzc1wiLCB7XG4gICAgICAgIGV2ZW50OiBmaWxlRWwuZ2V0QXR0cmlidXRlKHZpZXcuYmluZGluZyhQSFhfUFJPR1JFU1MpKSxcbiAgICAgICAgcmVmOiBmaWxlRWwuZ2V0QXR0cmlidXRlKFBIWF9VUExPQURfUkVGKSxcbiAgICAgICAgZW50cnlfcmVmOiBlbnRyeVJlZixcbiAgICAgICAgcHJvZ3Jlc3M6IHByb2dyZXNzLFxuICAgICAgICBjaWQ6IHZpZXcudGFyZ2V0Q29tcG9uZW50SUQoZmlsZUVsLmZvcm0sIHRhcmdldEN0eClcbiAgICAgIH0sIG9uUmVwbHkpXG4gICAgfSlcbiAgfVxuXG4gIHB1c2hJbnB1dChpbnB1dEVsLCB0YXJnZXRDdHgsIGZvcmNlQ2lkLCBwaHhFdmVudCwgb3B0cywgY2FsbGJhY2spe1xuICAgIGxldCB1cGxvYWRzXG4gICAgbGV0IGNpZCA9IGlzQ2lkKGZvcmNlQ2lkKSA/IGZvcmNlQ2lkIDogdGhpcy50YXJnZXRDb21wb25lbnRJRChpbnB1dEVsLmZvcm0sIHRhcmdldEN0eClcbiAgICBsZXQgcmVmR2VuZXJhdG9yID0gKCkgPT4gdGhpcy5wdXRSZWYoW2lucHV0RWwsIGlucHV0RWwuZm9ybV0sIFwiY2hhbmdlXCIsIG9wdHMpXG4gICAgbGV0IGZvcm1EYXRhXG4gICAgaWYoaW5wdXRFbC5nZXRBdHRyaWJ1dGUodGhpcy5iaW5kaW5nKFwiY2hhbmdlXCIpKSl7XG4gICAgICBmb3JtRGF0YSA9IHNlcmlhbGl6ZUZvcm0oaW5wdXRFbC5mb3JtLCB7X3RhcmdldDogb3B0cy5fdGFyZ2V0fSwgW2lucHV0RWwubmFtZV0pXG4gICAgfSBlbHNlIHtcbiAgICAgIGZvcm1EYXRhID0gc2VyaWFsaXplRm9ybShpbnB1dEVsLmZvcm0sIHtfdGFyZ2V0OiBvcHRzLl90YXJnZXR9KVxuICAgIH1cbiAgICBpZihET00uaXNVcGxvYWRJbnB1dChpbnB1dEVsKSAmJiBpbnB1dEVsLmZpbGVzICYmIGlucHV0RWwuZmlsZXMubGVuZ3RoID4gMCl7XG4gICAgICBMaXZlVXBsb2FkZXIudHJhY2tGaWxlcyhpbnB1dEVsLCBBcnJheS5mcm9tKGlucHV0RWwuZmlsZXMpKVxuICAgIH1cbiAgICB1cGxvYWRzID0gTGl2ZVVwbG9hZGVyLnNlcmlhbGl6ZVVwbG9hZHMoaW5wdXRFbClcbiAgICBsZXQgZXZlbnQgPSB7XG4gICAgICB0eXBlOiBcImZvcm1cIixcbiAgICAgIGV2ZW50OiBwaHhFdmVudCxcbiAgICAgIHZhbHVlOiBmb3JtRGF0YSxcbiAgICAgIHVwbG9hZHM6IHVwbG9hZHMsXG4gICAgICBjaWQ6IGNpZFxuICAgIH1cbiAgICB0aGlzLnB1c2hXaXRoUmVwbHkocmVmR2VuZXJhdG9yLCBcImV2ZW50XCIsIGV2ZW50LCByZXNwID0+IHtcbiAgICAgIERPTS5zaG93RXJyb3IoaW5wdXRFbCwgdGhpcy5saXZlU29ja2V0LmJpbmRpbmcoUEhYX0ZFRURCQUNLX0ZPUikpXG4gICAgICBpZihET00uaXNVcGxvYWRJbnB1dChpbnB1dEVsKSAmJiBpbnB1dEVsLmdldEF0dHJpYnV0ZShcImRhdGEtcGh4LWF1dG8tdXBsb2FkXCIpICE9PSBudWxsKXtcbiAgICAgICAgaWYoTGl2ZVVwbG9hZGVyLmZpbGVzQXdhaXRpbmdQcmVmbGlnaHQoaW5wdXRFbCkubGVuZ3RoID4gMCl7XG4gICAgICAgICAgbGV0IFtyZWYsIF9lbHNdID0gcmVmR2VuZXJhdG9yKClcbiAgICAgICAgICB0aGlzLnVwbG9hZEZpbGVzKGlucHV0RWwuZm9ybSwgdGFyZ2V0Q3R4LCByZWYsIGNpZCwgKF91cGxvYWRzKSA9PiB7XG4gICAgICAgICAgICBjYWxsYmFjayAmJiBjYWxsYmFjayhyZXNwKVxuICAgICAgICAgICAgdGhpcy50cmlnZ2VyQXdhaXRpbmdTdWJtaXQoaW5wdXRFbC5mb3JtKVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKHJlc3ApXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIHRyaWdnZXJBd2FpdGluZ1N1Ym1pdChmb3JtRWwpe1xuICAgIGxldCBhd2FpdGluZ1N1Ym1pdCA9IHRoaXMuZ2V0U2NoZWR1bGVkU3VibWl0KGZvcm1FbClcbiAgICBpZihhd2FpdGluZ1N1Ym1pdCl7XG4gICAgICBsZXQgW19lbCwgX3JlZiwgX29wdHMsIGNhbGxiYWNrXSA9IGF3YWl0aW5nU3VibWl0XG4gICAgICB0aGlzLmNhbmNlbFN1Ym1pdChmb3JtRWwpXG4gICAgICBjYWxsYmFjaygpXG4gICAgfVxuICB9XG5cbiAgZ2V0U2NoZWR1bGVkU3VibWl0KGZvcm1FbCl7XG4gICAgcmV0dXJuIHRoaXMuZm9ybVN1Ym1pdHMuZmluZCgoW2VsLCBfcmVmLCBfb3B0cywgX2NhbGxiYWNrXSkgPT4gZWwuaXNTYW1lTm9kZShmb3JtRWwpKVxuICB9XG5cbiAgc2NoZWR1bGVTdWJtaXQoZm9ybUVsLCByZWYsIG9wdHMsIGNhbGxiYWNrKXtcbiAgICBpZih0aGlzLmdldFNjaGVkdWxlZFN1Ym1pdChmb3JtRWwpKXsgcmV0dXJuIHRydWUgfVxuICAgIHRoaXMuZm9ybVN1Ym1pdHMucHVzaChbZm9ybUVsLCByZWYsIG9wdHMsIGNhbGxiYWNrXSlcbiAgfVxuXG4gIGNhbmNlbFN1Ym1pdChmb3JtRWwpe1xuICAgIHRoaXMuZm9ybVN1Ym1pdHMgPSB0aGlzLmZvcm1TdWJtaXRzLmZpbHRlcigoW2VsLCByZWYsIF9jYWxsYmFja10pID0+IHtcbiAgICAgIGlmKGVsLmlzU2FtZU5vZGUoZm9ybUVsKSl7XG4gICAgICAgIHRoaXMudW5kb1JlZnMocmVmKVxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIHB1c2hGb3JtU3VibWl0KGZvcm1FbCwgdGFyZ2V0Q3R4LCBwaHhFdmVudCwgb3B0cywgb25SZXBseSl7XG4gICAgbGV0IGZpbHRlcklnbm9yZWQgPSBlbCA9PiB7XG4gICAgICBsZXQgdXNlcklnbm9yZWQgPSBjbG9zZXN0UGh4QmluZGluZyhlbCwgYCR7dGhpcy5iaW5kaW5nKFBIWF9VUERBVEUpfT1pZ25vcmVgLCBlbC5mb3JtKVxuICAgICAgcmV0dXJuICEodXNlcklnbm9yZWQgfHwgY2xvc2VzdFBoeEJpbmRpbmcoZWwsIFwiZGF0YS1waHgtdXBkYXRlPWlnbm9yZVwiLCBlbC5mb3JtKSlcbiAgICB9XG4gICAgbGV0IGZpbHRlckRpc2FibGVzID0gZWwgPT4ge1xuICAgICAgcmV0dXJuIGVsLmhhc0F0dHJpYnV0ZSh0aGlzLmJpbmRpbmcoUEhYX0RJU0FCTEVfV0lUSCkpXG4gICAgfVxuICAgIGxldCBmaWx0ZXJCdXR0b24gPSBlbCA9PiBlbC50YWdOYW1lID09IFwiQlVUVE9OXCJcblxuICAgIGxldCBmaWx0ZXJJbnB1dCA9IGVsID0+IFtcIklOUFVUXCIsIFwiVEVYVEFSRUFcIiwgXCJTRUxFQ1RcIl0uaW5jbHVkZXMoZWwudGFnTmFtZSlcblxuICAgIGxldCByZWZHZW5lcmF0b3IgPSAoKSA9PiB7XG4gICAgICBsZXQgZm9ybUVsZW1lbnRzID0gQXJyYXkuZnJvbShmb3JtRWwuZWxlbWVudHMpXG4gICAgICBsZXQgZGlzYWJsZXMgPSBmb3JtRWxlbWVudHMuZmlsdGVyKGZpbHRlckRpc2FibGVzKVxuICAgICAgbGV0IGJ1dHRvbnMgPSBmb3JtRWxlbWVudHMuZmlsdGVyKGZpbHRlckJ1dHRvbikuZmlsdGVyKGZpbHRlcklnbm9yZWQpXG4gICAgICBsZXQgaW5wdXRzID0gZm9ybUVsZW1lbnRzLmZpbHRlcihmaWx0ZXJJbnB1dCkuZmlsdGVyKGZpbHRlcklnbm9yZWQpXG5cbiAgICAgIGJ1dHRvbnMuZm9yRWFjaChidXR0b24gPT4ge1xuICAgICAgICBidXR0b24uc2V0QXR0cmlidXRlKFBIWF9ESVNBQkxFRCwgYnV0dG9uLmRpc2FibGVkKVxuICAgICAgICBidXR0b24uZGlzYWJsZWQgPSB0cnVlXG4gICAgICB9KVxuICAgICAgaW5wdXRzLmZvckVhY2goaW5wdXQgPT4ge1xuICAgICAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoUEhYX1JFQURPTkxZLCBpbnB1dC5yZWFkT25seSlcbiAgICAgICAgaW5wdXQucmVhZE9ubHkgPSB0cnVlXG4gICAgICAgIGlmKGlucHV0LmZpbGVzKXtcbiAgICAgICAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoUEhYX0RJU0FCTEVELCBpbnB1dC5kaXNhYmxlZClcbiAgICAgICAgICBpbnB1dC5kaXNhYmxlZCA9IHRydWVcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIGZvcm1FbC5zZXRBdHRyaWJ1dGUodGhpcy5iaW5kaW5nKFBIWF9QQUdFX0xPQURJTkcpLCBcIlwiKVxuICAgICAgcmV0dXJuIHRoaXMucHV0UmVmKFtmb3JtRWxdLmNvbmNhdChkaXNhYmxlcykuY29uY2F0KGJ1dHRvbnMpLmNvbmNhdChpbnB1dHMpLCBcInN1Ym1pdFwiLCBvcHRzKVxuICAgIH1cblxuICAgIGxldCBjaWQgPSB0aGlzLnRhcmdldENvbXBvbmVudElEKGZvcm1FbCwgdGFyZ2V0Q3R4KVxuICAgIGlmKExpdmVVcGxvYWRlci5oYXNVcGxvYWRzSW5Qcm9ncmVzcyhmb3JtRWwpKXtcbiAgICAgIGxldCBbcmVmLCBfZWxzXSA9IHJlZkdlbmVyYXRvcigpXG4gICAgICBsZXQgcHVzaCA9ICgpID0+IHRoaXMucHVzaEZvcm1TdWJtaXQoZm9ybUVsLCB0YXJnZXRDdHgsIHBoeEV2ZW50LCBvcHRzLCBvblJlcGx5KVxuICAgICAgcmV0dXJuIHRoaXMuc2NoZWR1bGVTdWJtaXQoZm9ybUVsLCByZWYsIG9wdHMsIHB1c2gpXG4gICAgfSBlbHNlIGlmKExpdmVVcGxvYWRlci5pbnB1dHNBd2FpdGluZ1ByZWZsaWdodChmb3JtRWwpLmxlbmd0aCA+IDApe1xuICAgICAgbGV0IFtyZWYsIGVsc10gPSByZWZHZW5lcmF0b3IoKVxuICAgICAgbGV0IHByb3h5UmVmR2VuID0gKCkgPT4gW3JlZiwgZWxzLCBvcHRzXVxuICAgICAgdGhpcy51cGxvYWRGaWxlcyhmb3JtRWwsIHRhcmdldEN0eCwgcmVmLCBjaWQsIChfdXBsb2FkcykgPT4ge1xuICAgICAgICBsZXQgZm9ybURhdGEgPSBzZXJpYWxpemVGb3JtKGZvcm1FbCwge30pXG4gICAgICAgIHRoaXMucHVzaFdpdGhSZXBseShwcm94eVJlZkdlbiwgXCJldmVudFwiLCB7XG4gICAgICAgICAgdHlwZTogXCJmb3JtXCIsXG4gICAgICAgICAgZXZlbnQ6IHBoeEV2ZW50LFxuICAgICAgICAgIHZhbHVlOiBmb3JtRGF0YSxcbiAgICAgICAgICBjaWQ6IGNpZFxuICAgICAgICB9LCBvblJlcGx5KVxuICAgICAgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IGZvcm1EYXRhID0gc2VyaWFsaXplRm9ybShmb3JtRWwsIHt9KVxuICAgICAgdGhpcy5wdXNoV2l0aFJlcGx5KHJlZkdlbmVyYXRvciwgXCJldmVudFwiLCB7XG4gICAgICAgIHR5cGU6IFwiZm9ybVwiLFxuICAgICAgICBldmVudDogcGh4RXZlbnQsXG4gICAgICAgIHZhbHVlOiBmb3JtRGF0YSxcbiAgICAgICAgY2lkOiBjaWRcbiAgICAgIH0sIG9uUmVwbHkpXG4gICAgfVxuICB9XG5cbiAgdXBsb2FkRmlsZXMoZm9ybUVsLCB0YXJnZXRDdHgsIHJlZiwgY2lkLCBvbkNvbXBsZXRlKXtcbiAgICBsZXQgam9pbkNvdW50QXRVcGxvYWQgPSB0aGlzLmpvaW5Db3VudFxuICAgIGxldCBpbnB1dEVscyA9IExpdmVVcGxvYWRlci5hY3RpdmVGaWxlSW5wdXRzKGZvcm1FbClcbiAgICBsZXQgbnVtRmlsZUlucHV0c0luUHJvZ3Jlc3MgPSBpbnB1dEVscy5sZW5ndGhcblxuICAgIC8vIGdldCBlYWNoIGZpbGUgaW5wdXRcbiAgICBpbnB1dEVscy5mb3JFYWNoKGlucHV0RWwgPT4ge1xuICAgICAgbGV0IHVwbG9hZGVyID0gbmV3IExpdmVVcGxvYWRlcihpbnB1dEVsLCB0aGlzLCAoKSA9PiB7XG4gICAgICAgIG51bUZpbGVJbnB1dHNJblByb2dyZXNzLS1cbiAgICAgICAgaWYobnVtRmlsZUlucHV0c0luUHJvZ3Jlc3MgPT09IDApeyBvbkNvbXBsZXRlKCkgfVxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMudXBsb2FkZXJzW2lucHV0RWxdID0gdXBsb2FkZXJcbiAgICAgIGxldCBlbnRyaWVzID0gdXBsb2FkZXIuZW50cmllcygpLm1hcChlbnRyeSA9PiBlbnRyeS50b1ByZWZsaWdodFBheWxvYWQoKSlcblxuICAgICAgbGV0IHBheWxvYWQgPSB7XG4gICAgICAgIHJlZjogaW5wdXRFbC5nZXRBdHRyaWJ1dGUoUEhYX1VQTE9BRF9SRUYpLFxuICAgICAgICBlbnRyaWVzOiBlbnRyaWVzLFxuICAgICAgICBjaWQ6IHRoaXMudGFyZ2V0Q29tcG9uZW50SUQoaW5wdXRFbC5mb3JtLCB0YXJnZXRDdHgpXG4gICAgICB9XG5cbiAgICAgIHRoaXMubG9nKFwidXBsb2FkXCIsICgpID0+IFtcInNlbmRpbmcgcHJlZmxpZ2h0IHJlcXVlc3RcIiwgcGF5bG9hZF0pXG5cbiAgICAgIHRoaXMucHVzaFdpdGhSZXBseShudWxsLCBcImFsbG93X3VwbG9hZFwiLCBwYXlsb2FkLCByZXNwID0+IHtcbiAgICAgICAgdGhpcy5sb2coXCJ1cGxvYWRcIiwgKCkgPT4gW1wiZ290IHByZWZsaWdodCByZXNwb25zZVwiLCByZXNwXSlcbiAgICAgICAgaWYocmVzcC5lcnJvcil7XG4gICAgICAgICAgdGhpcy51bmRvUmVmcyhyZWYpXG4gICAgICAgICAgbGV0IFtlbnRyeV9yZWYsIHJlYXNvbl0gPSByZXNwLmVycm9yXG4gICAgICAgICAgdGhpcy5sb2coXCJ1cGxvYWRcIiwgKCkgPT4gW2BlcnJvciBmb3IgZW50cnkgJHtlbnRyeV9yZWZ9YCwgcmVhc29uXSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsZXQgb25FcnJvciA9IChjYWxsYmFjaykgPT4ge1xuICAgICAgICAgICAgdGhpcy5jaGFubmVsLm9uRXJyb3IoKCkgPT4ge1xuICAgICAgICAgICAgICBpZih0aGlzLmpvaW5Db3VudCA9PT0gam9pbkNvdW50QXRVcGxvYWQpeyBjYWxsYmFjaygpIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICAgIHVwbG9hZGVyLmluaXRBZGFwdGVyVXBsb2FkKHJlc3AsIG9uRXJyb3IsIHRoaXMubGl2ZVNvY2tldClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgZGlzcGF0Y2hVcGxvYWRzKG5hbWUsIGZpbGVzT3JCbG9icyl7XG4gICAgbGV0IGlucHV0cyA9IERPTS5maW5kVXBsb2FkSW5wdXRzKHRoaXMuZWwpLmZpbHRlcihlbCA9PiBlbC5uYW1lID09PSBuYW1lKVxuICAgIGlmKGlucHV0cy5sZW5ndGggPT09IDApeyBsb2dFcnJvcihgbm8gbGl2ZSBmaWxlIGlucHV0cyBmb3VuZCBtYXRjaGluZyB0aGUgbmFtZSBcIiR7bmFtZX1cImApIH1cbiAgICBlbHNlIGlmKGlucHV0cy5sZW5ndGggPiAxKXsgbG9nRXJyb3IoYGR1cGxpY2F0ZSBsaXZlIGZpbGUgaW5wdXRzIGZvdW5kIG1hdGNoaW5nIHRoZSBuYW1lIFwiJHtuYW1lfVwiYCkgfVxuICAgIGVsc2UgeyBET00uZGlzcGF0Y2hFdmVudChpbnB1dHNbMF0sIFBIWF9UUkFDS19VUExPQURTLCB7ZGV0YWlsOiB7ZmlsZXM6IGZpbGVzT3JCbG9ic319KSB9XG4gIH1cblxuICBwdXNoRm9ybVJlY292ZXJ5KGZvcm0sIG5ld0NpZCwgY2FsbGJhY2spe1xuICAgIHRoaXMubGl2ZVNvY2tldC53aXRoaW5Pd25lcnMoZm9ybSwgKHZpZXcsIHRhcmdldEN0eCkgPT4ge1xuICAgICAgbGV0IGlucHV0ID0gZm9ybS5lbGVtZW50c1swXVxuICAgICAgbGV0IHBoeEV2ZW50ID0gZm9ybS5nZXRBdHRyaWJ1dGUodGhpcy5iaW5kaW5nKFBIWF9BVVRPX1JFQ09WRVIpKSB8fCBmb3JtLmdldEF0dHJpYnV0ZSh0aGlzLmJpbmRpbmcoXCJjaGFuZ2VcIikpXG5cbiAgICAgIEpTLmV4ZWMoXCJjaGFuZ2VcIiwgcGh4RXZlbnQsIHZpZXcsIGlucHV0LCBbXCJwdXNoXCIsIHtfdGFyZ2V0OiBpbnB1dC5uYW1lLCBuZXdDaWQ6IG5ld0NpZCwgY2FsbGJhY2s6IGNhbGxiYWNrfV0pXG4gICAgfSlcbiAgfVxuXG4gIHB1c2hMaW5rUGF0Y2goaHJlZiwgdGFyZ2V0RWwsIGNhbGxiYWNrKXtcbiAgICBsZXQgbGlua1JlZiA9IHRoaXMubGl2ZVNvY2tldC5zZXRQZW5kaW5nTGluayhocmVmKVxuICAgIGxldCByZWZHZW4gPSB0YXJnZXRFbCA/ICgpID0+IHRoaXMucHV0UmVmKFt0YXJnZXRFbF0sIFwiY2xpY2tcIikgOiBudWxsXG4gICAgbGV0IGZhbGxiYWNrID0gKCkgPT4gdGhpcy5saXZlU29ja2V0LnJlZGlyZWN0KHdpbmRvdy5sb2NhdGlvbi5ocmVmKVxuXG4gICAgbGV0IHB1c2ggPSB0aGlzLnB1c2hXaXRoUmVwbHkocmVmR2VuLCBcImxpdmVfcGF0Y2hcIiwge3VybDogaHJlZn0sIHJlc3AgPT4ge1xuICAgICAgdGhpcy5saXZlU29ja2V0LnJlcXVlc3RET01VcGRhdGUoKCkgPT4ge1xuICAgICAgICBpZihyZXNwLmxpbmtfcmVkaXJlY3Qpe1xuICAgICAgICAgIHRoaXMubGl2ZVNvY2tldC5yZXBsYWNlTWFpbihocmVmLCBudWxsLCBjYWxsYmFjaywgbGlua1JlZilcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZih0aGlzLmxpdmVTb2NrZXQuY29tbWl0UGVuZGluZ0xpbmsobGlua1JlZikpe1xuICAgICAgICAgICAgdGhpcy5ocmVmID0gaHJlZlxuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLmFwcGx5UGVuZGluZ1VwZGF0ZXMoKVxuICAgICAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKGxpbmtSZWYpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGlmKHB1c2gpe1xuICAgICAgcHVzaC5yZWNlaXZlKFwidGltZW91dFwiLCBmYWxsYmFjaylcbiAgICB9IGVsc2Uge1xuICAgICAgZmFsbGJhY2soKVxuICAgIH1cbiAgfVxuXG4gIGZvcm1zRm9yUmVjb3ZlcnkoaHRtbCl7XG4gICAgaWYodGhpcy5qb2luQ291bnQgPT09IDApeyByZXR1cm4gW10gfVxuXG4gICAgbGV0IHBoeENoYW5nZSA9IHRoaXMuYmluZGluZyhcImNoYW5nZVwiKVxuICAgIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0ZW1wbGF0ZVwiKVxuICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IGh0bWxcblxuICAgIHJldHVybiAoXG4gICAgICBET00uYWxsKHRoaXMuZWwsIGBmb3JtWyR7cGh4Q2hhbmdlfV1gKVxuICAgICAgICAuZmlsdGVyKGZvcm0gPT4gZm9ybS5pZCAmJiB0aGlzLm93bnNFbGVtZW50KGZvcm0pKVxuICAgICAgICAuZmlsdGVyKGZvcm0gPT4gZm9ybS5lbGVtZW50cy5sZW5ndGggPiAwKVxuICAgICAgICAuZmlsdGVyKGZvcm0gPT4gZm9ybS5nZXRBdHRyaWJ1dGUodGhpcy5iaW5kaW5nKFBIWF9BVVRPX1JFQ09WRVIpKSAhPT0gXCJpZ25vcmVcIilcbiAgICAgICAgLm1hcChmb3JtID0+IHtcbiAgICAgICAgICBsZXQgbmV3Rm9ybSA9IHRlbXBsYXRlLmNvbnRlbnQucXVlcnlTZWxlY3RvcihgZm9ybVtpZD1cIiR7Zm9ybS5pZH1cIl1bJHtwaHhDaGFuZ2V9PVwiJHtmb3JtLmdldEF0dHJpYnV0ZShwaHhDaGFuZ2UpfVwiXWApXG4gICAgICAgICAgaWYobmV3Rm9ybSl7XG4gICAgICAgICAgICByZXR1cm4gW2Zvcm0sIG5ld0Zvcm0sIHRoaXMudGFyZ2V0Q29tcG9uZW50SUQobmV3Rm9ybSldXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBbZm9ybSwgbnVsbCwgbnVsbF1cbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC5maWx0ZXIoKFtmb3JtLCBuZXdGb3JtLCBuZXdDaWRdKSA9PiBuZXdGb3JtKVxuICAgIClcbiAgfVxuXG4gIG1heWJlUHVzaENvbXBvbmVudHNEZXN0cm95ZWQoZGVzdHJveWVkQ0lEcyl7XG4gICAgbGV0IHdpbGxEZXN0cm95Q0lEcyA9IGRlc3Ryb3llZENJRHMuZmlsdGVyKGNpZCA9PiB7XG4gICAgICByZXR1cm4gRE9NLmZpbmRDb21wb25lbnROb2RlTGlzdCh0aGlzLmVsLCBjaWQpLmxlbmd0aCA9PT0gMFxuICAgIH0pXG4gICAgaWYod2lsbERlc3Ryb3lDSURzLmxlbmd0aCA+IDApe1xuICAgICAgdGhpcy5wcnVuaW5nQ0lEcy5wdXNoKC4uLndpbGxEZXN0cm95Q0lEcylcblxuICAgICAgdGhpcy5wdXNoV2l0aFJlcGx5KG51bGwsIFwiY2lkc193aWxsX2Rlc3Ryb3lcIiwge2NpZHM6IHdpbGxEZXN0cm95Q0lEc30sICgpID0+IHtcbiAgICAgICAgLy8gVGhlIGNpZHMgYXJlIGVpdGhlciBiYWNrIG9uIHRoZSBwYWdlIG9yIHRoZXkgd2lsbCBiZSBmdWxseSByZW1vdmVkLFxuICAgICAgICAvLyBzbyB3ZSBjYW4gcmVtb3ZlIHRoZW0gZnJvbSB0aGUgcHJ1bmluZ0NJRHMuXG4gICAgICAgIHRoaXMucHJ1bmluZ0NJRHMgPSB0aGlzLnBydW5pbmdDSURzLmZpbHRlcihjaWQgPT4gd2lsbERlc3Ryb3lDSURzLmluZGV4T2YoY2lkKSAhPT0gLTEpXG5cbiAgICAgICAgLy8gU2VlIGlmIGFueSBvZiB0aGUgY2lkcyB3ZSB3YW50ZWQgdG8gZGVzdHJveSB3ZXJlIGFkZGVkIGJhY2ssXG4gICAgICAgIC8vIGlmIHRoZXkgd2VyZSBhZGRlZCBiYWNrLCB3ZSBkb24ndCBhY3R1YWxseSBkZXN0cm95IHRoZW0uXG4gICAgICAgIGxldCBjb21wbGV0ZWx5RGVzdHJveUNJRHMgPSB3aWxsRGVzdHJveUNJRHMuZmlsdGVyKGNpZCA9PiB7XG4gICAgICAgICAgcmV0dXJuIERPTS5maW5kQ29tcG9uZW50Tm9kZUxpc3QodGhpcy5lbCwgY2lkKS5sZW5ndGggPT09IDBcbiAgICAgICAgfSlcblxuICAgICAgICBpZihjb21wbGV0ZWx5RGVzdHJveUNJRHMubGVuZ3RoID4gMCl7XG4gICAgICAgICAgdGhpcy5wdXNoV2l0aFJlcGx5KG51bGwsIFwiY2lkc19kZXN0cm95ZWRcIiwge2NpZHM6IGNvbXBsZXRlbHlEZXN0cm95Q0lEc30sIChyZXNwKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnJlbmRlcmVkLnBydW5lQ0lEcyhyZXNwLmNpZHMpXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBvd25zRWxlbWVudChlbCl7XG4gICAgcmV0dXJuIGVsLmdldEF0dHJpYnV0ZShQSFhfUEFSRU5UX0lEKSA9PT0gdGhpcy5pZCB8fFxuICAgICAgbWF5YmUoZWwuY2xvc2VzdChQSFhfVklFV19TRUxFQ1RPUiksIG5vZGUgPT4gbm9kZS5pZCkgPT09IHRoaXMuaWRcbiAgfVxuXG4gIHN1Ym1pdEZvcm0oZm9ybSwgdGFyZ2V0Q3R4LCBwaHhFdmVudCwgb3B0cyA9IHt9KXtcbiAgICBET00ucHV0UHJpdmF0ZShmb3JtLCBQSFhfSEFTX1NVQk1JVFRFRCwgdHJ1ZSlcbiAgICBsZXQgcGh4RmVlZGJhY2sgPSB0aGlzLmxpdmVTb2NrZXQuYmluZGluZyhQSFhfRkVFREJBQ0tfRk9SKVxuICAgIGxldCBpbnB1dHMgPSBBcnJheS5mcm9tKGZvcm0uZWxlbWVudHMpXG4gICAgdGhpcy5saXZlU29ja2V0LmJsdXJBY3RpdmVFbGVtZW50KHRoaXMpXG4gICAgdGhpcy5wdXNoRm9ybVN1Ym1pdChmb3JtLCB0YXJnZXRDdHgsIHBoeEV2ZW50LCBvcHRzLCAoKSA9PiB7XG4gICAgICBpbnB1dHMuZm9yRWFjaChpbnB1dCA9PiBET00uc2hvd0Vycm9yKGlucHV0LCBwaHhGZWVkYmFjaykpXG4gICAgICB0aGlzLmxpdmVTb2NrZXQucmVzdG9yZVByZXZpb3VzbHlBY3RpdmVGb2N1cygpXG4gICAgfSlcbiAgfVxuXG4gIGJpbmRpbmcoa2luZCl7IHJldHVybiB0aGlzLmxpdmVTb2NrZXQuYmluZGluZyhraW5kKSB9XG59XG4iLCAiLyoqIEluaXRpYWxpemVzIHRoZSBMaXZlU29ja2V0XG4gKlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBlbmRQb2ludCAtIFRoZSBzdHJpbmcgV2ViU29ja2V0IGVuZHBvaW50LCBpZSwgYFwid3NzOi8vZXhhbXBsZS5jb20vbGl2ZVwiYCxcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgXCIvbGl2ZVwiYCAoaW5oZXJpdGVkIGhvc3QgJiBwcm90b2NvbClcbiAqIEBwYXJhbSB7UGhvZW5peC5Tb2NrZXR9IHNvY2tldCAtIHRoZSByZXF1aXJlZCBQaG9lbml4IFNvY2tldCBjbGFzcyBpbXBvcnRlZCBmcm9tIFwicGhvZW5peFwiLiBGb3IgZXhhbXBsZTpcbiAqXG4gKiAgICAgaW1wb3J0IHtTb2NrZXR9IGZyb20gXCJwaG9lbml4XCJcbiAqICAgICBpbXBvcnQge0xpdmVTb2NrZXR9IGZyb20gXCJwaG9lbml4X2xpdmVfdmlld1wiXG4gKiAgICAgbGV0IGxpdmVTb2NrZXQgPSBuZXcgTGl2ZVNvY2tldChcIi9saXZlXCIsIFNvY2tldCwgey4uLn0pXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRzXSAtIE9wdGlvbmFsIGNvbmZpZ3VyYXRpb24uIE91dHNpZGUgb2Yga2V5cyBsaXN0ZWQgYmVsb3csIGFsbFxuICogY29uZmlndXJhdGlvbiBpcyBwYXNzZWQgZGlyZWN0bHkgdG8gdGhlIFBob2VuaXggU29ja2V0IGNvbnN0cnVjdG9yLlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRzLmRlZmF1bHRzXSAtIFRoZSBvcHRpb25hbCBkZWZhdWx0cyB0byB1c2UgZm9yIHZhcmlvdXMgYmluZGluZ3MsXG4gKiBzdWNoIGFzIGBwaHgtZGVib3VuY2VgLiBTdXBwb3J0cyB0aGUgZm9sbG93aW5nIGtleXM6XG4gKlxuICogICAtIGRlYm91bmNlIC0gdGhlIG1pbGxpc2Vjb25kIHBoeC1kZWJvdW5jZSB0aW1lLiBEZWZhdWx0cyAzMDBcbiAqICAgLSB0aHJvdHRsZSAtIHRoZSBtaWxsaXNlY29uZCBwaHgtdGhyb3R0bGUgdGltZS4gRGVmYXVsdHMgMzAwXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdHMucGFyYW1zXSAtIFRoZSBvcHRpb25hbCBmdW5jdGlvbiBmb3IgcGFzc2luZyBjb25uZWN0IHBhcmFtcy5cbiAqIFRoZSBmdW5jdGlvbiByZWNlaXZlcyB0aGUgZWxlbWVudCBhc3NvY2lhdGVkIHdpdGggYSBnaXZlbiBMaXZlVmlldy4gRm9yIGV4YW1wbGU6XG4gKlxuICogICAgIChlbCkgPT4ge3ZpZXc6IGVsLmdldEF0dHJpYnV0ZShcImRhdGEtbXktdmlldy1uYW1lXCIsIHRva2VuOiB3aW5kb3cubXlUb2tlbn1cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gW29wdHMuYmluZGluZ1ByZWZpeF0gLSBUaGUgb3B0aW9uYWwgcHJlZml4IHRvIHVzZSBmb3IgYWxsIHBoeCBET00gYW5ub3RhdGlvbnMuXG4gKiBEZWZhdWx0cyB0byBcInBoeC1cIi5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0cy5ob29rc10gLSBUaGUgb3B0aW9uYWwgb2JqZWN0IGZvciByZWZlcmVuY2luZyBMaXZlVmlldyBob29rIGNhbGxiYWNrcy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0cy51cGxvYWRlcnNdIC0gVGhlIG9wdGlvbmFsIG9iamVjdCBmb3IgcmVmZXJlbmNpbmcgTGl2ZVZpZXcgdXBsb2FkZXIgY2FsbGJhY2tzLlxuICogQHBhcmFtIHtpbnRlZ2VyfSBbb3B0cy5sb2FkZXJUaW1lb3V0XSAtIFRoZSBvcHRpb25hbCBkZWxheSBpbiBtaWxsaXNlY29uZHMgdG8gd2FpdCBiZWZvcmUgYXBwbHlcbiAqIGxvYWRpbmcgc3RhdGVzLlxuICogQHBhcmFtIHtpbnRlZ2VyfSBbb3B0cy5tYXhSZWxvYWRzXSAtIFRoZSBtYXhpbXVtIHJlbG9hZHMgYmVmb3JlIGVudGVyaW5nIGZhaWxzYWZlIG1vZGUuXG4gKiBAcGFyYW0ge2ludGVnZXJ9IFtvcHRzLnJlbG9hZEppdHRlck1pbl0gLSBUaGUgbWluaW11bSB0aW1lIGJldHdlZW4gbm9ybWFsIHJlbG9hZCBhdHRlbXB0cy5cbiAqIEBwYXJhbSB7aW50ZWdlcn0gW29wdHMucmVsb2FkSml0dGVyTWF4XSAtIFRoZSBtYXhpbXVtIHRpbWUgYmV0d2VlbiBub3JtYWwgcmVsb2FkIGF0dGVtcHRzLlxuICogQHBhcmFtIHtpbnRlZ2VyfSBbb3B0cy5mYWlsc2FmZUppdHRlcl0gLSBUaGUgdGltZSBiZXR3ZWVuIHJlbG9hZCBhdHRlbXB0cyBpbiBmYWlsc2FmZSBtb2RlLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdHMudmlld0xvZ2dlcl0gLSBUaGUgb3B0aW9uYWwgZnVuY3Rpb24gdG8gbG9nIGRlYnVnIGluZm9ybWF0aW9uLiBGb3IgZXhhbXBsZTpcbiAqXG4gKiAgICAgKHZpZXcsIGtpbmQsIG1zZywgb2JqKSA9PiBjb25zb2xlLmxvZyhgJHt2aWV3LmlkfSAke2tpbmR9OiAke21zZ30gLSBgLCBvYmopXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRzLm1ldGFkYXRhXSAtIFRoZSBvcHRpb25hbCBvYmplY3QgbWFwcGluZyBldmVudCBuYW1lcyB0byBmdW5jdGlvbnMgZm9yXG4gKiBwb3B1bGF0aW5nIGV2ZW50IG1ldGFkYXRhLiBGb3IgZXhhbXBsZTpcbiAqXG4gKiAgICAgbWV0YWRhdGE6IHtcbiAqICAgICAgIGNsaWNrOiAoZSwgZWwpID0+IHtcbiAqICAgICAgICAgcmV0dXJuIHtcbiAqICAgICAgICAgICBjdHJsS2V5OiBlLmN0cmxLZXksXG4gKiAgICAgICAgICAgbWV0YUtleTogZS5tZXRhS2V5LFxuICogICAgICAgICAgIGRldGFpbDogZS5kZXRhaWwgfHwgMSxcbiAqICAgICAgICAgfVxuICogICAgICAgfSxcbiAqICAgICAgIGtleWRvd246IChlLCBlbCkgPT4ge1xuICogICAgICAgICByZXR1cm4ge1xuICogICAgICAgICAgIGtleTogZS5rZXksXG4gKiAgICAgICAgICAgY3RybEtleTogZS5jdHJsS2V5LFxuICogICAgICAgICAgIG1ldGFLZXk6IGUubWV0YUtleSxcbiAqICAgICAgICAgICBzaGlmdEtleTogZS5zaGlmdEtleVxuICogICAgICAgICB9XG4gKiAgICAgICB9XG4gKiAgICAgfVxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRzLnNlc3Npb25TdG9yYWdlXSAtIEFuIG9wdGlvbmFsIFN0b3JhZ2UgY29tcGF0aWJsZSBvYmplY3RcbiAqIFVzZWZ1bCB3aGVuIExpdmVWaWV3IHdvbid0IGhhdmUgYWNjZXNzIHRvIGBzZXNzaW9uU3RvcmFnZWAuICBGb3IgZXhhbXBsZSwgVGhpcyBjb3VsZFxuICogaGFwcGVuIGlmIGEgc2l0ZSBsb2FkcyBhIGNyb3NzLWRvbWFpbiBMaXZlVmlldyBpbiBhbiBpZnJhbWUuICBFeGFtcGxlIHVzYWdlOlxuICpcbiAqICAgICBjbGFzcyBJbk1lbW9yeVN0b3JhZ2Uge1xuICogICAgICAgY29uc3RydWN0b3IoKSB7IHRoaXMuc3RvcmFnZSA9IHt9IH1cbiAqICAgICAgIGdldEl0ZW0oa2V5TmFtZSkgeyByZXR1cm4gdGhpcy5zdG9yYWdlW2tleU5hbWVdIH1cbiAqICAgICAgIHJlbW92ZUl0ZW0oa2V5TmFtZSkgeyBkZWxldGUgdGhpcy5zdG9yYWdlW2tleU5hbWVdIH1cbiAqICAgICAgIHNldEl0ZW0oa2V5TmFtZSwga2V5VmFsdWUpIHsgdGhpcy5zdG9yYWdlW2tleU5hbWVdID0ga2V5VmFsdWUgfVxuICogICAgIH1cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdHMubG9jYWxTdG9yYWdlXSAtIEFuIG9wdGlvbmFsIFN0b3JhZ2UgY29tcGF0aWJsZSBvYmplY3RcbiAqIFVzZWZ1bCBmb3Igd2hlbiBMaXZlVmlldyB3b24ndCBoYXZlIGFjY2VzcyB0byBgbG9jYWxTdG9yYWdlYC5cbiAqIFNlZSBgb3B0cy5zZXNzaW9uU3RvcmFnZWAgZm9yIGV4YW1wbGVzLlxuKi9cblxuaW1wb3J0IHtcbiAgQklORElOR19QUkVGSVgsXG4gIENPTlNFQ1VUSVZFX1JFTE9BRFMsXG4gIERFRkFVTFRTLFxuICBGQUlMU0FGRV9KSVRURVIsXG4gIExPQURFUl9USU1FT1VULFxuICBNQVhfUkVMT0FEUyxcbiAgUEhYX0RFQk9VTkNFLFxuICBQSFhfRFJPUF9UQVJHRVQsXG4gIFBIWF9IQVNfRk9DVVNFRCxcbiAgUEhYX0tFWSxcbiAgUEhYX0xJTktfU1RBVEUsXG4gIFBIWF9MSVZFX0xJTkssXG4gIFBIWF9MVl9ERUJVRyxcbiAgUEhYX0xWX0xBVEVOQ1lfU0lNLFxuICBQSFhfTFZfUFJPRklMRSxcbiAgUEhYX01BSU4sXG4gIFBIWF9QQVJFTlRfSUQsXG4gIFBIWF9WSUVXX1NFTEVDVE9SLFxuICBQSFhfUk9PVF9JRCxcbiAgUEhYX1RIUk9UVExFLFxuICBQSFhfVFJBQ0tfVVBMT0FEUyxcbiAgUEhYX1NFU1NJT04sXG4gIFJFTE9BRF9KSVRURVJfTUlOLFxuICBSRUxPQURfSklUVEVSX01BWCxcbn0gZnJvbSBcIi4vY29uc3RhbnRzXCJcblxuaW1wb3J0IHtcbiAgY2xvbmUsXG4gIGNsb3Nlc3RQaHhCaW5kaW5nLFxuICBjbG9zdXJlLFxuICBkZWJ1ZyxcbiAgaXNPYmplY3QsXG4gIG1heWJlXG59IGZyb20gXCIuL3V0aWxzXCJcblxuaW1wb3J0IEJyb3dzZXIgZnJvbSBcIi4vYnJvd3NlclwiXG5pbXBvcnQgRE9NIGZyb20gXCIuL2RvbVwiXG5pbXBvcnQgSG9va3MgZnJvbSBcIi4vaG9va3NcIlxuaW1wb3J0IExpdmVVcGxvYWRlciBmcm9tIFwiLi9saXZlX3VwbG9hZGVyXCJcbmltcG9ydCBWaWV3IGZyb20gXCIuL3ZpZXdcIlxuaW1wb3J0IEpTIGZyb20gXCIuL2pzXCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGl2ZVNvY2tldCB7XG4gIGNvbnN0cnVjdG9yKHVybCwgcGh4U29ja2V0LCBvcHRzID0ge30pe1xuICAgIHRoaXMudW5sb2FkZWQgPSBmYWxzZVxuICAgIGlmKCFwaHhTb2NrZXQgfHwgcGh4U29ja2V0LmNvbnN0cnVjdG9yLm5hbWUgPT09IFwiT2JqZWN0XCIpe1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBcbiAgICAgIGEgcGhvZW5peCBTb2NrZXQgbXVzdCBiZSBwcm92aWRlZCBhcyB0aGUgc2Vjb25kIGFyZ3VtZW50IHRvIHRoZSBMaXZlU29ja2V0IGNvbnN0cnVjdG9yLiBGb3IgZXhhbXBsZTpcblxuICAgICAgICAgIGltcG9ydCB7U29ja2V0fSBmcm9tIFwicGhvZW5peFwiXG4gICAgICAgICAgaW1wb3J0IHtMaXZlU29ja2V0fSBmcm9tIFwicGhvZW5peF9saXZlX3ZpZXdcIlxuICAgICAgICAgIGxldCBsaXZlU29ja2V0ID0gbmV3IExpdmVTb2NrZXQoXCIvbGl2ZVwiLCBTb2NrZXQsIHsuLi59KVxuICAgICAgYClcbiAgICB9XG4gICAgdGhpcy5zb2NrZXQgPSBuZXcgcGh4U29ja2V0KHVybCwgb3B0cylcbiAgICB0aGlzLmJpbmRpbmdQcmVmaXggPSBvcHRzLmJpbmRpbmdQcmVmaXggfHwgQklORElOR19QUkVGSVhcbiAgICB0aGlzLm9wdHMgPSBvcHRzXG4gICAgdGhpcy5wYXJhbXMgPSBjbG9zdXJlKG9wdHMucGFyYW1zIHx8IHt9KVxuICAgIHRoaXMudmlld0xvZ2dlciA9IG9wdHMudmlld0xvZ2dlclxuICAgIHRoaXMubWV0YWRhdGFDYWxsYmFja3MgPSBvcHRzLm1ldGFkYXRhIHx8IHt9XG4gICAgdGhpcy5kZWZhdWx0cyA9IE9iamVjdC5hc3NpZ24oY2xvbmUoREVGQVVMVFMpLCBvcHRzLmRlZmF1bHRzIHx8IHt9KVxuICAgIHRoaXMuYWN0aXZlRWxlbWVudCA9IG51bGxcbiAgICB0aGlzLnByZXZBY3RpdmUgPSBudWxsXG4gICAgdGhpcy5zaWxlbmNlZCA9IGZhbHNlXG4gICAgdGhpcy5tYWluID0gbnVsbFxuICAgIHRoaXMub3V0Z29pbmdNYWluRWwgPSBudWxsXG4gICAgdGhpcy5jbGlja1N0YXJ0ZWRBdFRhcmdldCA9IG51bGxcbiAgICB0aGlzLmxpbmtSZWYgPSAxXG4gICAgdGhpcy5yb290cyA9IHt9XG4gICAgdGhpcy5ocmVmID0gd2luZG93LmxvY2F0aW9uLmhyZWZcbiAgICB0aGlzLnBlbmRpbmdMaW5rID0gbnVsbFxuICAgIHRoaXMuY3VycmVudExvY2F0aW9uID0gY2xvbmUod2luZG93LmxvY2F0aW9uKVxuICAgIHRoaXMuaG9va3MgPSBvcHRzLmhvb2tzIHx8IHt9XG4gICAgdGhpcy51cGxvYWRlcnMgPSBvcHRzLnVwbG9hZGVycyB8fCB7fVxuICAgIHRoaXMubG9hZGVyVGltZW91dCA9IG9wdHMubG9hZGVyVGltZW91dCB8fCBMT0FERVJfVElNRU9VVFxuICAgIHRoaXMucmVsb2FkV2l0aEppdHRlclRpbWVyID0gbnVsbFxuICAgIHRoaXMubWF4UmVsb2FkcyA9IG9wdHMubWF4UmVsb2FkcyB8fCBNQVhfUkVMT0FEU1xuICAgIHRoaXMucmVsb2FkSml0dGVyTWluID0gb3B0cy5yZWxvYWRKaXR0ZXJNaW4gfHwgUkVMT0FEX0pJVFRFUl9NSU5cbiAgICB0aGlzLnJlbG9hZEppdHRlck1heCA9IG9wdHMucmVsb2FkSml0dGVyTWF4IHx8IFJFTE9BRF9KSVRURVJfTUFYXG4gICAgdGhpcy5mYWlsc2FmZUppdHRlciA9IG9wdHMuZmFpbHNhZmVKaXR0ZXIgfHwgRkFJTFNBRkVfSklUVEVSXG4gICAgdGhpcy5sb2NhbFN0b3JhZ2UgPSBvcHRzLmxvY2FsU3RvcmFnZSB8fCB3aW5kb3cubG9jYWxTdG9yYWdlXG4gICAgdGhpcy5zZXNzaW9uU3RvcmFnZSA9IG9wdHMuc2Vzc2lvblN0b3JhZ2UgfHwgd2luZG93LnNlc3Npb25TdG9yYWdlXG4gICAgdGhpcy5ib3VuZFRvcExldmVsRXZlbnRzID0gZmFsc2VcbiAgICB0aGlzLmRvbUNhbGxiYWNrcyA9IE9iamVjdC5hc3NpZ24oe29uTm9kZUFkZGVkOiBjbG9zdXJlKCksIG9uQmVmb3JlRWxVcGRhdGVkOiBjbG9zdXJlKCl9LCBvcHRzLmRvbSB8fCB7fSlcbiAgICB0aGlzLnRyYW5zaXRpb25zID0gbmV3IFRyYW5zaXRpb25TZXQoKVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicGFnZWhpZGVcIiwgX2UgPT4ge1xuICAgICAgdGhpcy51bmxvYWRlZCA9IHRydWVcbiAgICB9KVxuICAgIHRoaXMuc29ja2V0Lm9uT3BlbigoKSA9PiB7XG4gICAgICBpZih0aGlzLmlzVW5sb2FkZWQoKSl7XG4gICAgICAgIC8vIHJlbG9hZCBwYWdlIGlmIGJlaW5nIHJlc3RvcmVkIGZyb20gYmFjay9mb3J3YXJkIGNhY2hlIGFuZCBicm93c2VyIGRvZXMgbm90IGVtaXQgXCJwYWdlc2hvd1wiXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICAvLyBwdWJsaWNcblxuICBpc1Byb2ZpbGVFbmFibGVkKCl7IHJldHVybiB0aGlzLnNlc3Npb25TdG9yYWdlLmdldEl0ZW0oUEhYX0xWX1BST0ZJTEUpID09PSBcInRydWVcIiB9XG5cbiAgaXNEZWJ1Z0VuYWJsZWQoKXsgcmV0dXJuIHRoaXMuc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShQSFhfTFZfREVCVUcpID09PSBcInRydWVcIiB9XG5cbiAgaXNEZWJ1Z0Rpc2FibGVkKCl7IHJldHVybiB0aGlzLnNlc3Npb25TdG9yYWdlLmdldEl0ZW0oUEhYX0xWX0RFQlVHKSA9PT0gXCJmYWxzZVwiIH1cblxuICBlbmFibGVEZWJ1ZygpeyB0aGlzLnNlc3Npb25TdG9yYWdlLnNldEl0ZW0oUEhYX0xWX0RFQlVHLCBcInRydWVcIikgfVxuXG4gIGVuYWJsZVByb2ZpbGluZygpeyB0aGlzLnNlc3Npb25TdG9yYWdlLnNldEl0ZW0oUEhYX0xWX1BST0ZJTEUsIFwidHJ1ZVwiKSB9XG5cbiAgZGlzYWJsZURlYnVnKCl7IHRoaXMuc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShQSFhfTFZfREVCVUcsIFwiZmFsc2VcIikgfVxuXG4gIGRpc2FibGVQcm9maWxpbmcoKXsgdGhpcy5zZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKFBIWF9MVl9QUk9GSUxFKSB9XG5cbiAgZW5hYmxlTGF0ZW5jeVNpbSh1cHBlckJvdW5kTXMpe1xuICAgIHRoaXMuZW5hYmxlRGVidWcoKVxuICAgIGNvbnNvbGUubG9nKFwibGF0ZW5jeSBzaW11bGF0b3IgZW5hYmxlZCBmb3IgdGhlIGR1cmF0aW9uIG9mIHRoaXMgYnJvd3NlciBzZXNzaW9uLiBDYWxsIGRpc2FibGVMYXRlbmN5U2ltKCkgdG8gZGlzYWJsZVwiKVxuICAgIHRoaXMuc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShQSFhfTFZfTEFURU5DWV9TSU0sIHVwcGVyQm91bmRNcylcbiAgfVxuXG4gIGRpc2FibGVMYXRlbmN5U2ltKCl7IHRoaXMuc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbShQSFhfTFZfTEFURU5DWV9TSU0pIH1cblxuICBnZXRMYXRlbmN5U2ltKCl7XG4gICAgbGV0IHN0ciA9IHRoaXMuc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShQSFhfTFZfTEFURU5DWV9TSU0pXG4gICAgcmV0dXJuIHN0ciA/IHBhcnNlSW50KHN0cikgOiBudWxsXG4gIH1cblxuICBnZXRTb2NrZXQoKXsgcmV0dXJuIHRoaXMuc29ja2V0IH1cblxuICBjb25uZWN0KCl7XG4gICAgLy8gZW5hYmxlIGRlYnVnIGJ5IGRlZmF1bHQgaWYgb24gbG9jYWxob3N0IGFuZCBub3QgZXhwbGljaXRseSBkaXNhYmxlZFxuICAgIGlmKHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZSA9PT0gXCJsb2NhbGhvc3RcIiAmJiAhdGhpcy5pc0RlYnVnRGlzYWJsZWQoKSl7IHRoaXMuZW5hYmxlRGVidWcoKSB9XG4gICAgbGV0IGRvQ29ubmVjdCA9ICgpID0+IHtcbiAgICAgIGlmKHRoaXMuam9pblJvb3RWaWV3cygpKXtcbiAgICAgICAgdGhpcy5iaW5kVG9wTGV2ZWxFdmVudHMoKVxuICAgICAgICB0aGlzLnNvY2tldC5jb25uZWN0KClcbiAgICAgIH0gZWxzZSBpZih0aGlzLm1haW4pe1xuICAgICAgICB0aGlzLnNvY2tldC5jb25uZWN0KClcbiAgICAgIH1cbiAgICB9XG4gICAgaWYoW1wiY29tcGxldGVcIiwgXCJsb2FkZWRcIiwgXCJpbnRlcmFjdGl2ZVwiXS5pbmRleE9mKGRvY3VtZW50LnJlYWR5U3RhdGUpID49IDApe1xuICAgICAgZG9Db25uZWN0KClcbiAgICB9IGVsc2Uge1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgKCkgPT4gZG9Db25uZWN0KCkpXG4gICAgfVxuICB9XG5cbiAgZGlzY29ubmVjdChjYWxsYmFjayl7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMucmVsb2FkV2l0aEppdHRlclRpbWVyKVxuICAgIHRoaXMuc29ja2V0LmRpc2Nvbm5lY3QoY2FsbGJhY2spXG4gIH1cblxuICByZXBsYWNlVHJhbnNwb3J0KHRyYW5zcG9ydCl7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMucmVsb2FkV2l0aEppdHRlclRpbWVyKVxuICAgIHRoaXMuc29ja2V0LnJlcGxhY2VUcmFuc3BvcnQodHJhbnNwb3J0KVxuICAgIHRoaXMuY29ubmVjdCgpXG4gIH1cblxuICBleGVjSlMoZWwsIGVuY29kZWRKUywgZXZlbnRUeXBlID0gbnVsbCl7XG4gICAgdGhpcy5vd25lcihlbCwgdmlldyA9PiBKUy5leGVjKGV2ZW50VHlwZSwgZW5jb2RlZEpTLCB2aWV3LCBlbCkpXG4gIH1cblxuICAvLyBwcml2YXRlXG5cbiAgdHJpZ2dlckRPTShraW5kLCBhcmdzKXsgdGhpcy5kb21DYWxsYmFja3Nba2luZF0oLi4uYXJncykgfVxuXG4gIHRpbWUobmFtZSwgZnVuYyl7XG4gICAgaWYoIXRoaXMuaXNQcm9maWxlRW5hYmxlZCgpIHx8ICFjb25zb2xlLnRpbWUpeyByZXR1cm4gZnVuYygpIH1cbiAgICBjb25zb2xlLnRpbWUobmFtZSlcbiAgICBsZXQgcmVzdWx0ID0gZnVuYygpXG4gICAgY29uc29sZS50aW1lRW5kKG5hbWUpXG4gICAgcmV0dXJuIHJlc3VsdFxuICB9XG5cbiAgbG9nKHZpZXcsIGtpbmQsIG1zZ0NhbGxiYWNrKXtcbiAgICBpZih0aGlzLnZpZXdMb2dnZXIpe1xuICAgICAgbGV0IFttc2csIG9ial0gPSBtc2dDYWxsYmFjaygpXG4gICAgICB0aGlzLnZpZXdMb2dnZXIodmlldywga2luZCwgbXNnLCBvYmopXG4gICAgfSBlbHNlIGlmKHRoaXMuaXNEZWJ1Z0VuYWJsZWQoKSl7XG4gICAgICBsZXQgW21zZywgb2JqXSA9IG1zZ0NhbGxiYWNrKClcbiAgICAgIGRlYnVnKHZpZXcsIGtpbmQsIG1zZywgb2JqKVxuICAgIH1cbiAgfVxuXG4gIHJlcXVlc3RET01VcGRhdGUoY2FsbGJhY2spe1xuICAgIHRoaXMudHJhbnNpdGlvbnMuYWZ0ZXIoY2FsbGJhY2spXG4gIH1cblxuICB0cmFuc2l0aW9uKHRpbWUsIG9uU3RhcnQsIG9uRG9uZSA9IGZ1bmN0aW9uKCl7fSl7XG4gICAgdGhpcy50cmFuc2l0aW9ucy5hZGRUcmFuc2l0aW9uKHRpbWUsIG9uU3RhcnQsIG9uRG9uZSlcbiAgfVxuXG4gIG9uQ2hhbm5lbChjaGFubmVsLCBldmVudCwgY2Ipe1xuICAgIGNoYW5uZWwub24oZXZlbnQsIGRhdGEgPT4ge1xuICAgICAgbGV0IGxhdGVuY3kgPSB0aGlzLmdldExhdGVuY3lTaW0oKVxuICAgICAgaWYoIWxhdGVuY3kpe1xuICAgICAgICBjYihkYXRhKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5sb2coYHNpbXVsYXRpbmcgJHtsYXRlbmN5fW1zIG9mIGxhdGVuY3kgZnJvbSBzZXJ2ZXIgdG8gY2xpZW50YClcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiBjYihkYXRhKSwgbGF0ZW5jeSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgd3JhcFB1c2godmlldywgb3B0cywgcHVzaCl7XG4gICAgbGV0IGxhdGVuY3kgPSB0aGlzLmdldExhdGVuY3lTaW0oKVxuICAgIGxldCBvbGRKb2luQ291bnQgPSB2aWV3LmpvaW5Db3VudFxuICAgIGlmKCFsYXRlbmN5KXtcbiAgICAgIGlmKHRoaXMuaXNDb25uZWN0ZWQoKSAmJiBvcHRzLnRpbWVvdXQpe1xuICAgICAgICByZXR1cm4gcHVzaCgpLnJlY2VpdmUoXCJ0aW1lb3V0XCIsICgpID0+IHtcbiAgICAgICAgICBpZih2aWV3LmpvaW5Db3VudCA9PT0gb2xkSm9pbkNvdW50ICYmICF2aWV3LmlzRGVzdHJveWVkKCkpe1xuICAgICAgICAgICAgdGhpcy5yZWxvYWRXaXRoSml0dGVyKHZpZXcsICgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5sb2codmlldywgXCJ0aW1lb3V0XCIsICgpID0+IFtcInJlY2VpdmVkIHRpbWVvdXQgd2hpbGUgY29tbXVuaWNhdGluZyB3aXRoIHNlcnZlci4gRmFsbGluZyBiYWNrIHRvIGhhcmQgcmVmcmVzaCBmb3IgcmVjb3ZlcnlcIl0pXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBwdXNoKClcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zb2xlLmxvZyhgc2ltdWxhdGluZyAke2xhdGVuY3l9bXMgb2YgbGF0ZW5jeSBmcm9tIGNsaWVudCB0byBzZXJ2ZXJgKVxuICAgIGxldCBmYWtlUHVzaCA9IHtcbiAgICAgIHJlY2VpdmVzOiBbXSxcbiAgICAgIHJlY2VpdmUoa2luZCwgY2IpeyB0aGlzLnJlY2VpdmVzLnB1c2goW2tpbmQsIGNiXSkgfVxuICAgIH1cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGlmKHZpZXcuaXNEZXN0cm95ZWQoKSl7IHJldHVybiB9XG4gICAgICBmYWtlUHVzaC5yZWNlaXZlcy5yZWR1Y2UoKGFjYywgW2tpbmQsIGNiXSkgPT4gYWNjLnJlY2VpdmUoa2luZCwgY2IpLCBwdXNoKCkpXG4gICAgfSwgbGF0ZW5jeSlcbiAgICByZXR1cm4gZmFrZVB1c2hcbiAgfVxuXG4gIHJlbG9hZFdpdGhKaXR0ZXIodmlldywgbG9nKXtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5yZWxvYWRXaXRoSml0dGVyVGltZXIpXG4gICAgdGhpcy5kaXNjb25uZWN0KClcbiAgICBsZXQgbWluTXMgPSB0aGlzLnJlbG9hZEppdHRlck1pblxuICAgIGxldCBtYXhNcyA9IHRoaXMucmVsb2FkSml0dGVyTWF4XG4gICAgbGV0IGFmdGVyTXMgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4TXMgLSBtaW5NcyArIDEpKSArIG1pbk1zXG4gICAgbGV0IHRyaWVzID0gQnJvd3Nlci51cGRhdGVMb2NhbCh0aGlzLmxvY2FsU3RvcmFnZSwgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLCBDT05TRUNVVElWRV9SRUxPQURTLCAwLCBjb3VudCA9PiBjb3VudCArIDEpXG4gICAgaWYodHJpZXMgPiB0aGlzLm1heFJlbG9hZHMpe1xuICAgICAgYWZ0ZXJNcyA9IHRoaXMuZmFpbHNhZmVKaXR0ZXJcbiAgICB9XG4gICAgdGhpcy5yZWxvYWRXaXRoSml0dGVyVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIC8vIGlmIHZpZXcgaGFzIHJlY292ZXJlZCwgc3VjaCBhcyB0cmFuc3BvcnQgcmVwbGFjZWQsIHRoZW4gY2FuY2VsXG4gICAgICBpZih2aWV3LmlzRGVzdHJveWVkKCkgfHwgdmlldy5pc0Nvbm5lY3RlZCgpKXsgcmV0dXJuIH1cbiAgICAgIHZpZXcuZGVzdHJveSgpXG4gICAgICBsb2cgPyBsb2coKSA6IHRoaXMubG9nKHZpZXcsIFwiam9pblwiLCAoKSA9PiBbYGVuY291bnRlcmVkICR7dHJpZXN9IGNvbnNlY3V0aXZlIHJlbG9hZHNgXSlcbiAgICAgIGlmKHRyaWVzID4gdGhpcy5tYXhSZWxvYWRzKXtcbiAgICAgICAgdGhpcy5sb2codmlldywgXCJqb2luXCIsICgpID0+IFtgZXhjZWVkZWQgJHt0aGlzLm1heFJlbG9hZHN9IGNvbnNlY3V0aXZlIHJlbG9hZHMuIEVudGVyaW5nIGZhaWxzYWZlIG1vZGVgXSlcbiAgICAgIH1cbiAgICAgIGlmKHRoaXMuaGFzUGVuZGluZ0xpbmsoKSl7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IHRoaXMucGVuZGluZ0xpbmtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKVxuICAgICAgfVxuICAgIH0sIGFmdGVyTXMpXG4gIH1cblxuICBnZXRIb29rQ2FsbGJhY2tzKG5hbWUpe1xuICAgIHJldHVybiBuYW1lICYmIG5hbWUuc3RhcnRzV2l0aChcIlBob2VuaXguXCIpID8gSG9va3NbbmFtZS5zcGxpdChcIi5cIilbMV1dIDogdGhpcy5ob29rc1tuYW1lXVxuICB9XG5cbiAgaXNVbmxvYWRlZCgpeyByZXR1cm4gdGhpcy51bmxvYWRlZCB9XG5cbiAgaXNDb25uZWN0ZWQoKXsgcmV0dXJuIHRoaXMuc29ja2V0LmlzQ29ubmVjdGVkKCkgfVxuXG4gIGdldEJpbmRpbmdQcmVmaXgoKXsgcmV0dXJuIHRoaXMuYmluZGluZ1ByZWZpeCB9XG5cbiAgYmluZGluZyhraW5kKXsgcmV0dXJuIGAke3RoaXMuZ2V0QmluZGluZ1ByZWZpeCgpfSR7a2luZH1gIH1cblxuICBjaGFubmVsKHRvcGljLCBwYXJhbXMpeyByZXR1cm4gdGhpcy5zb2NrZXQuY2hhbm5lbCh0b3BpYywgcGFyYW1zKSB9XG5cbiAgam9pblJvb3RWaWV3cygpe1xuICAgIGxldCByb290c0ZvdW5kID0gZmFsc2VcbiAgICBET00uYWxsKGRvY3VtZW50LCBgJHtQSFhfVklFV19TRUxFQ1RPUn06bm90KFske1BIWF9QQVJFTlRfSUR9XSlgLCByb290RWwgPT4ge1xuICAgICAgaWYoIXRoaXMuZ2V0Um9vdEJ5SWQocm9vdEVsLmlkKSl7XG4gICAgICAgIGxldCB2aWV3ID0gdGhpcy5uZXdSb290Vmlldyhyb290RWwpXG4gICAgICAgIHZpZXcuc2V0SHJlZih0aGlzLmdldEhyZWYoKSlcbiAgICAgICAgdmlldy5qb2luKClcbiAgICAgICAgaWYocm9vdEVsLmhhc0F0dHJpYnV0ZShQSFhfTUFJTikpeyB0aGlzLm1haW4gPSB2aWV3IH1cbiAgICAgIH1cbiAgICAgIHJvb3RzRm91bmQgPSB0cnVlXG4gICAgfSlcbiAgICByZXR1cm4gcm9vdHNGb3VuZFxuICB9XG5cbiAgcmVkaXJlY3QodG8sIGZsYXNoKXtcbiAgICB0aGlzLmRpc2Nvbm5lY3QoKVxuICAgIEJyb3dzZXIucmVkaXJlY3QodG8sIGZsYXNoKVxuICB9XG5cbiAgcmVwbGFjZU1haW4oaHJlZiwgZmxhc2gsIGNhbGxiYWNrID0gbnVsbCwgbGlua1JlZiA9IHRoaXMuc2V0UGVuZGluZ0xpbmsoaHJlZikpe1xuICAgIHRoaXMub3V0Z29pbmdNYWluRWwgPSB0aGlzLm91dGdvaW5nTWFpbkVsIHx8IHRoaXMubWFpbi5lbFxuICAgIGxldCBuZXdNYWluRWwgPSBET00uY2xvbmVOb2RlKHRoaXMub3V0Z29pbmdNYWluRWwsIFwiXCIpXG4gICAgdGhpcy5tYWluLnNob3dMb2FkZXIodGhpcy5sb2FkZXJUaW1lb3V0KVxuICAgIHRoaXMubWFpbi5kZXN0cm95KClcblxuICAgIHRoaXMubWFpbiA9IHRoaXMubmV3Um9vdFZpZXcobmV3TWFpbkVsLCBmbGFzaClcbiAgICB0aGlzLm1haW4uc2V0UmVkaXJlY3QoaHJlZilcbiAgICB0aGlzLnRyYW5zaXRpb25SZW1vdmVzKClcbiAgICB0aGlzLm1haW4uam9pbigoam9pbkNvdW50LCBvbkRvbmUpID0+IHtcbiAgICAgIGlmKGpvaW5Db3VudCA9PT0gMSAmJiB0aGlzLmNvbW1pdFBlbmRpbmdMaW5rKGxpbmtSZWYpKXtcbiAgICAgICAgdGhpcy5yZXF1ZXN0RE9NVXBkYXRlKCgpID0+IHtcbiAgICAgICAgICBET00uZmluZFBoeFN0aWNreShkb2N1bWVudCkuZm9yRWFjaChlbCA9PiBuZXdNYWluRWwuYXBwZW5kQ2hpbGQoZWwpKVxuICAgICAgICAgIHRoaXMub3V0Z29pbmdNYWluRWwucmVwbGFjZVdpdGgobmV3TWFpbkVsKVxuICAgICAgICAgIHRoaXMub3V0Z29pbmdNYWluRWwgPSBudWxsXG4gICAgICAgICAgY2FsbGJhY2sgJiYgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGNhbGxiYWNrKVxuICAgICAgICAgIG9uRG9uZSgpXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIHRyYW5zaXRpb25SZW1vdmVzKGVsZW1lbnRzKXtcbiAgICBsZXQgcmVtb3ZlQXR0ciA9IHRoaXMuYmluZGluZyhcInJlbW92ZVwiKVxuICAgIGVsZW1lbnRzID0gZWxlbWVudHMgfHwgRE9NLmFsbChkb2N1bWVudCwgYFske3JlbW92ZUF0dHJ9XWApXG4gICAgZWxlbWVudHMuZm9yRWFjaChlbCA9PiB7XG4gICAgICBpZihkb2N1bWVudC5ib2R5LmNvbnRhaW5zKGVsKSl7IC8vIHNraXAgY2hpbGRyZW4gYWxyZWFkeSByZW1vdmVkXG4gICAgICAgIHRoaXMuZXhlY0pTKGVsLCBlbC5nZXRBdHRyaWJ1dGUocmVtb3ZlQXR0ciksIFwicmVtb3ZlXCIpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGlzUGh4VmlldyhlbCl7IHJldHVybiBlbC5nZXRBdHRyaWJ1dGUgJiYgZWwuZ2V0QXR0cmlidXRlKFBIWF9TRVNTSU9OKSAhPT0gbnVsbCB9XG5cbiAgbmV3Um9vdFZpZXcoZWwsIGZsYXNoKXtcbiAgICBsZXQgdmlldyA9IG5ldyBWaWV3KGVsLCB0aGlzLCBudWxsLCBmbGFzaClcbiAgICB0aGlzLnJvb3RzW3ZpZXcuaWRdID0gdmlld1xuICAgIHJldHVybiB2aWV3XG4gIH1cblxuICBvd25lcihjaGlsZEVsLCBjYWxsYmFjayl7XG4gICAgbGV0IHZpZXcgPSBtYXliZShjaGlsZEVsLmNsb3Nlc3QoUEhYX1ZJRVdfU0VMRUNUT1IpLCBlbCA9PiB0aGlzLmdldFZpZXdCeUVsKGVsKSkgfHwgdGhpcy5tYWluXG4gICAgaWYodmlldyl7IGNhbGxiYWNrKHZpZXcpIH1cbiAgfVxuXG4gIHdpdGhpbk93bmVycyhjaGlsZEVsLCBjYWxsYmFjayl7XG4gICAgdGhpcy5vd25lcihjaGlsZEVsLCB2aWV3ID0+IGNhbGxiYWNrKHZpZXcsIGNoaWxkRWwpKVxuICB9XG5cbiAgZ2V0Vmlld0J5RWwoZWwpe1xuICAgIGxldCByb290SWQgPSBlbC5nZXRBdHRyaWJ1dGUoUEhYX1JPT1RfSUQpXG4gICAgcmV0dXJuIG1heWJlKHRoaXMuZ2V0Um9vdEJ5SWQocm9vdElkKSwgcm9vdCA9PiByb290LmdldERlc2NlbmRlbnRCeUVsKGVsKSlcbiAgfVxuXG4gIGdldFJvb3RCeUlkKGlkKXsgcmV0dXJuIHRoaXMucm9vdHNbaWRdIH1cblxuICBkZXN0cm95QWxsVmlld3MoKXtcbiAgICBmb3IobGV0IGlkIGluIHRoaXMucm9vdHMpe1xuICAgICAgdGhpcy5yb290c1tpZF0uZGVzdHJveSgpXG4gICAgICBkZWxldGUgdGhpcy5yb290c1tpZF1cbiAgICB9XG4gICAgdGhpcy5tYWluID0gbnVsbFxuICB9XG5cbiAgZGVzdHJveVZpZXdCeUVsKGVsKXtcbiAgICBsZXQgcm9vdCA9IHRoaXMuZ2V0Um9vdEJ5SWQoZWwuZ2V0QXR0cmlidXRlKFBIWF9ST09UX0lEKSlcbiAgICBpZihyb290ICYmIHJvb3QuaWQgPT09IGVsLmlkKXtcbiAgICAgIHJvb3QuZGVzdHJveSgpXG4gICAgICBkZWxldGUgdGhpcy5yb290c1tyb290LmlkXVxuICAgIH0gZWxzZSBpZihyb290KXtcbiAgICAgIHJvb3QuZGVzdHJveURlc2NlbmRlbnQoZWwuaWQpXG4gICAgfVxuICB9XG5cbiAgc2V0QWN0aXZlRWxlbWVudCh0YXJnZXQpe1xuICAgIGlmKHRoaXMuYWN0aXZlRWxlbWVudCA9PT0gdGFyZ2V0KXsgcmV0dXJuIH1cbiAgICB0aGlzLmFjdGl2ZUVsZW1lbnQgPSB0YXJnZXRcbiAgICBsZXQgY2FuY2VsID0gKCkgPT4ge1xuICAgICAgaWYodGFyZ2V0ID09PSB0aGlzLmFjdGl2ZUVsZW1lbnQpeyB0aGlzLmFjdGl2ZUVsZW1lbnQgPSBudWxsIH1cbiAgICAgIHRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCB0aGlzKVxuICAgICAgdGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCB0aGlzKVxuICAgIH1cbiAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgY2FuY2VsKVxuICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgY2FuY2VsKVxuICB9XG5cbiAgZ2V0QWN0aXZlRWxlbWVudCgpe1xuICAgIGlmKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IGRvY3VtZW50LmJvZHkpe1xuICAgICAgcmV0dXJuIHRoaXMuYWN0aXZlRWxlbWVudCB8fCBkb2N1bWVudC5hY3RpdmVFbGVtZW50XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgY2FuIGJlIG51bGwgaW4gSW50ZXJuZXQgRXhwbG9yZXIgMTFcbiAgICAgIHJldHVybiBkb2N1bWVudC5hY3RpdmVFbGVtZW50IHx8IGRvY3VtZW50LmJvZHlcbiAgICB9XG4gIH1cblxuICBkcm9wQWN0aXZlRWxlbWVudCh2aWV3KXtcbiAgICBpZih0aGlzLnByZXZBY3RpdmUgJiYgdmlldy5vd25zRWxlbWVudCh0aGlzLnByZXZBY3RpdmUpKXtcbiAgICAgIHRoaXMucHJldkFjdGl2ZSA9IG51bGxcbiAgICB9XG4gIH1cblxuICByZXN0b3JlUHJldmlvdXNseUFjdGl2ZUZvY3VzKCl7XG4gICAgaWYodGhpcy5wcmV2QWN0aXZlICYmIHRoaXMucHJldkFjdGl2ZSAhPT0gZG9jdW1lbnQuYm9keSl7XG4gICAgICB0aGlzLnByZXZBY3RpdmUuZm9jdXMoKVxuICAgIH1cbiAgfVxuXG4gIGJsdXJBY3RpdmVFbGVtZW50KCl7XG4gICAgdGhpcy5wcmV2QWN0aXZlID0gdGhpcy5nZXRBY3RpdmVFbGVtZW50KClcbiAgICBpZih0aGlzLnByZXZBY3RpdmUgIT09IGRvY3VtZW50LmJvZHkpeyB0aGlzLnByZXZBY3RpdmUuYmx1cigpIH1cbiAgfVxuXG4gIGJpbmRUb3BMZXZlbEV2ZW50cygpe1xuICAgIGlmKHRoaXMuYm91bmRUb3BMZXZlbEV2ZW50cyl7IHJldHVybiB9XG5cbiAgICB0aGlzLmJvdW5kVG9wTGV2ZWxFdmVudHMgPSB0cnVlXG4gICAgLy8gZW50ZXIgZmFpbHNhZmUgcmVsb2FkIGlmIHNlcnZlciBoYXMgZ29uZSBhd2F5IGludGVudGlvbmFsbHksIHN1Y2ggYXMgXCJkaXNjb25uZWN0XCIgYnJvYWRjYXN0XG4gICAgdGhpcy5zb2NrZXQub25DbG9zZShldmVudCA9PiB7XG4gICAgICBpZihldmVudCAmJiBldmVudC5jb2RlID09PSAxMDAwICYmIHRoaXMubWFpbil7XG4gICAgICAgIHRoaXMucmVsb2FkV2l0aEppdHRlcih0aGlzLm1haW4pXG4gICAgICB9XG4gICAgfSlcbiAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoKXsgfSkgLy8gZW5zdXJlIGFsbCBjbGljayBldmVudHMgYnViYmxlIGZvciBtb2JpbGUgU2FmYXJpXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJwYWdlc2hvd1wiLCBlID0+IHtcbiAgICAgIGlmKGUucGVyc2lzdGVkKXsgLy8gcmVsb2FkIHBhZ2UgaWYgYmVpbmcgcmVzdG9yZWQgZnJvbSBiYWNrL2ZvcndhcmQgY2FjaGVcbiAgICAgICAgdGhpcy5nZXRTb2NrZXQoKS5kaXNjb25uZWN0KClcbiAgICAgICAgdGhpcy53aXRoUGFnZUxvYWRpbmcoe3RvOiB3aW5kb3cubG9jYXRpb24uaHJlZiwga2luZDogXCJyZWRpcmVjdFwifSlcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpXG4gICAgICB9XG4gICAgfSwgdHJ1ZSlcbiAgICB0aGlzLmJpbmROYXYoKVxuICAgIHRoaXMuYmluZENsaWNrcygpXG4gICAgdGhpcy5iaW5kRm9ybXMoKVxuICAgIHRoaXMuYmluZCh7a2V5dXA6IFwia2V5dXBcIiwga2V5ZG93bjogXCJrZXlkb3duXCJ9LCAoZSwgdHlwZSwgdmlldywgdGFyZ2V0RWwsIHBoeEV2ZW50LCBldmVudFRhcmdldCkgPT4ge1xuICAgICAgbGV0IG1hdGNoS2V5ID0gdGFyZ2V0RWwuZ2V0QXR0cmlidXRlKHRoaXMuYmluZGluZyhQSFhfS0VZKSlcbiAgICAgIGxldCBwcmVzc2VkS2V5ID0gZS5rZXkgJiYgZS5rZXkudG9Mb3dlckNhc2UoKSAvLyBjaHJvbWUgY2xpY2tlZCBhdXRvY29tcGxldGVzIHNlbmQgYSBrZXlkb3duIHdpdGhvdXQga2V5XG4gICAgICBpZihtYXRjaEtleSAmJiBtYXRjaEtleS50b0xvd2VyQ2FzZSgpICE9PSBwcmVzc2VkS2V5KXsgcmV0dXJuIH1cblxuICAgICAgbGV0IGRhdGEgPSB7a2V5OiBlLmtleSwgLi4udGhpcy5ldmVudE1ldGEodHlwZSwgZSwgdGFyZ2V0RWwpfVxuICAgICAgSlMuZXhlYyh0eXBlLCBwaHhFdmVudCwgdmlldywgdGFyZ2V0RWwsIFtcInB1c2hcIiwge2RhdGF9XSlcbiAgICB9KVxuICAgIHRoaXMuYmluZCh7Ymx1cjogXCJmb2N1c291dFwiLCBmb2N1czogXCJmb2N1c2luXCJ9LCAoZSwgdHlwZSwgdmlldywgdGFyZ2V0RWwsIHBoeEV2ZW50LCBldmVudFRhcmdldCkgPT4ge1xuICAgICAgaWYoIWV2ZW50VGFyZ2V0KXtcbiAgICAgICAgbGV0IGRhdGEgPSB7a2V5OiBlLmtleSwgLi4udGhpcy5ldmVudE1ldGEodHlwZSwgZSwgdGFyZ2V0RWwpfVxuICAgICAgICBKUy5leGVjKHR5cGUsIHBoeEV2ZW50LCB2aWV3LCB0YXJnZXRFbCwgW1wicHVzaFwiLCB7ZGF0YX1dKVxuICAgICAgfVxuICAgIH0pXG4gICAgdGhpcy5iaW5kKHtibHVyOiBcImJsdXJcIiwgZm9jdXM6IFwiZm9jdXNcIn0sIChlLCB0eXBlLCB2aWV3LCB0YXJnZXRFbCwgdGFyZ2V0Q3R4LCBwaHhFdmVudCwgcGh4VGFyZ2V0KSA9PiB7XG4gICAgICAvLyBibHVyIGFuZCBmb2N1cyBhcmUgdHJpZ2dlcmVkIG9uIGRvY3VtZW50IGFuZCB3aW5kb3cuIERpc2NhcmQgb25lIHRvIGF2b2lkIGR1cHNcbiAgICAgIGlmKHBoeFRhcmdldCA9PT0gXCJ3aW5kb3dcIil7XG4gICAgICAgIGxldCBkYXRhID0gdGhpcy5ldmVudE1ldGEodHlwZSwgZSwgdGFyZ2V0RWwpXG4gICAgICAgIEpTLmV4ZWModHlwZSwgcGh4RXZlbnQsIHZpZXcsIHRhcmdldEVsLCBbXCJwdXNoXCIsIHtkYXRhfV0pXG4gICAgICB9XG4gICAgfSlcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdvdmVyXCIsIGUgPT4gZS5wcmV2ZW50RGVmYXVsdCgpKVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiZHJvcFwiLCBlID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgbGV0IGRyb3BUYXJnZXRJZCA9IG1heWJlKGNsb3Nlc3RQaHhCaW5kaW5nKGUudGFyZ2V0LCB0aGlzLmJpbmRpbmcoUEhYX0RST1BfVEFSR0VUKSksIHRydWVUYXJnZXQgPT4ge1xuICAgICAgICByZXR1cm4gdHJ1ZVRhcmdldC5nZXRBdHRyaWJ1dGUodGhpcy5iaW5kaW5nKFBIWF9EUk9QX1RBUkdFVCkpXG4gICAgICB9KVxuICAgICAgbGV0IGRyb3BUYXJnZXQgPSBkcm9wVGFyZ2V0SWQgJiYgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZHJvcFRhcmdldElkKVxuICAgICAgbGV0IGZpbGVzID0gQXJyYXkuZnJvbShlLmRhdGFUcmFuc2Zlci5maWxlcyB8fCBbXSlcbiAgICAgIGlmKCFkcm9wVGFyZ2V0IHx8IGRyb3BUYXJnZXQuZGlzYWJsZWQgfHwgZmlsZXMubGVuZ3RoID09PSAwIHx8ICEoZHJvcFRhcmdldC5maWxlcyBpbnN0YW5jZW9mIEZpbGVMaXN0KSl7IHJldHVybiB9XG5cbiAgICAgIExpdmVVcGxvYWRlci50cmFja0ZpbGVzKGRyb3BUYXJnZXQsIGZpbGVzKVxuICAgICAgZHJvcFRhcmdldC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcImlucHV0XCIsIHtidWJibGVzOiB0cnVlfSkpXG4gICAgfSlcbiAgICB0aGlzLm9uKFBIWF9UUkFDS19VUExPQURTLCBlID0+IHtcbiAgICAgIGxldCB1cGxvYWRUYXJnZXQgPSBlLnRhcmdldFxuICAgICAgaWYoIURPTS5pc1VwbG9hZElucHV0KHVwbG9hZFRhcmdldCkpeyByZXR1cm4gfVxuICAgICAgbGV0IGZpbGVzID0gQXJyYXkuZnJvbShlLmRldGFpbC5maWxlcyB8fCBbXSkuZmlsdGVyKGYgPT4gZiBpbnN0YW5jZW9mIEZpbGUgfHwgZiBpbnN0YW5jZW9mIEJsb2IpXG4gICAgICBMaXZlVXBsb2FkZXIudHJhY2tGaWxlcyh1cGxvYWRUYXJnZXQsIGZpbGVzKVxuICAgICAgdXBsb2FkVGFyZ2V0LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KFwiaW5wdXRcIiwge2J1YmJsZXM6IHRydWV9KSlcbiAgICB9KVxuICB9XG5cbiAgZXZlbnRNZXRhKGV2ZW50TmFtZSwgZSwgdGFyZ2V0RWwpe1xuICAgIGxldCBjYWxsYmFjayA9IHRoaXMubWV0YWRhdGFDYWxsYmFja3NbZXZlbnROYW1lXVxuICAgIHJldHVybiBjYWxsYmFjayA/IGNhbGxiYWNrKGUsIHRhcmdldEVsKSA6IHt9XG4gIH1cblxuICBzZXRQZW5kaW5nTGluayhocmVmKXtcbiAgICB0aGlzLmxpbmtSZWYrK1xuICAgIHRoaXMucGVuZGluZ0xpbmsgPSBocmVmXG4gICAgcmV0dXJuIHRoaXMubGlua1JlZlxuICB9XG5cbiAgY29tbWl0UGVuZGluZ0xpbmsobGlua1JlZil7XG4gICAgaWYodGhpcy5saW5rUmVmICE9PSBsaW5rUmVmKXtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmhyZWYgPSB0aGlzLnBlbmRpbmdMaW5rXG4gICAgICB0aGlzLnBlbmRpbmdMaW5rID0gbnVsbFxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH1cblxuICBnZXRIcmVmKCl7IHJldHVybiB0aGlzLmhyZWYgfVxuXG4gIGhhc1BlbmRpbmdMaW5rKCl7IHJldHVybiAhIXRoaXMucGVuZGluZ0xpbmsgfVxuXG4gIGJpbmQoZXZlbnRzLCBjYWxsYmFjayl7XG4gICAgZm9yKGxldCBldmVudCBpbiBldmVudHMpe1xuICAgICAgbGV0IGJyb3dzZXJFdmVudE5hbWUgPSBldmVudHNbZXZlbnRdXG5cbiAgICAgIHRoaXMub24oYnJvd3NlckV2ZW50TmFtZSwgZSA9PiB7XG4gICAgICAgIGxldCBiaW5kaW5nID0gdGhpcy5iaW5kaW5nKGV2ZW50KVxuICAgICAgICBsZXQgd2luZG93QmluZGluZyA9IHRoaXMuYmluZGluZyhgd2luZG93LSR7ZXZlbnR9YClcbiAgICAgICAgbGV0IHRhcmdldFBoeEV2ZW50ID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlICYmIGUudGFyZ2V0LmdldEF0dHJpYnV0ZShiaW5kaW5nKVxuICAgICAgICBpZih0YXJnZXRQaHhFdmVudCl7XG4gICAgICAgICAgdGhpcy5kZWJvdW5jZShlLnRhcmdldCwgZSwgYnJvd3NlckV2ZW50TmFtZSwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy53aXRoaW5Pd25lcnMoZS50YXJnZXQsIHZpZXcgPT4ge1xuICAgICAgICAgICAgICBjYWxsYmFjayhlLCBldmVudCwgdmlldywgZS50YXJnZXQsIHRhcmdldFBoeEV2ZW50LCBudWxsKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIERPTS5hbGwoZG9jdW1lbnQsIGBbJHt3aW5kb3dCaW5kaW5nfV1gLCBlbCA9PiB7XG4gICAgICAgICAgICBsZXQgcGh4RXZlbnQgPSBlbC5nZXRBdHRyaWJ1dGUod2luZG93QmluZGluZylcbiAgICAgICAgICAgIHRoaXMuZGVib3VuY2UoZWwsIGUsIGJyb3dzZXJFdmVudE5hbWUsICgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy53aXRoaW5Pd25lcnMoZWwsIHZpZXcgPT4ge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGUsIGV2ZW50LCB2aWV3LCBlbCwgcGh4RXZlbnQsIFwid2luZG93XCIpXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgYmluZENsaWNrcygpe1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIGUgPT4gdGhpcy5jbGlja1N0YXJ0ZWRBdFRhcmdldCA9IGUudGFyZ2V0KVxuICAgIHRoaXMuYmluZENsaWNrKFwiY2xpY2tcIiwgXCJjbGlja1wiLCBmYWxzZSlcbiAgICB0aGlzLmJpbmRDbGljayhcIm1vdXNlZG93blwiLCBcImNhcHR1cmUtY2xpY2tcIiwgdHJ1ZSlcbiAgfVxuXG4gIGJpbmRDbGljayhldmVudE5hbWUsIGJpbmRpbmdOYW1lLCBjYXB0dXJlKXtcbiAgICBsZXQgY2xpY2sgPSB0aGlzLmJpbmRpbmcoYmluZGluZ05hbWUpXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBlID0+IHtcbiAgICAgIGxldCB0YXJnZXQgPSBudWxsXG4gICAgICBpZihjYXB0dXJlKXtcbiAgICAgICAgdGFyZ2V0ID0gZS50YXJnZXQubWF0Y2hlcyhgWyR7Y2xpY2t9XWApID8gZS50YXJnZXQgOiBlLnRhcmdldC5xdWVyeVNlbGVjdG9yKGBbJHtjbGlja31dYClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBjbGlja1N0YXJ0ZWRBdFRhcmdldCA9IHRoaXMuY2xpY2tTdGFydGVkQXRUYXJnZXQgfHwgZS50YXJnZXRcbiAgICAgICAgdGFyZ2V0ID0gY2xvc2VzdFBoeEJpbmRpbmcoY2xpY2tTdGFydGVkQXRUYXJnZXQsIGNsaWNrKVxuICAgICAgICB0aGlzLmRpc3BhdGNoQ2xpY2tBd2F5KGUsIGNsaWNrU3RhcnRlZEF0VGFyZ2V0KVxuICAgICAgICB0aGlzLmNsaWNrU3RhcnRlZEF0VGFyZ2V0ID0gbnVsbFxuICAgICAgfVxuICAgICAgbGV0IHBoeEV2ZW50ID0gdGFyZ2V0ICYmIHRhcmdldC5nZXRBdHRyaWJ1dGUoY2xpY2spXG4gICAgICBpZighcGh4RXZlbnQpeyByZXR1cm4gfVxuICAgICAgaWYodGFyZ2V0LmdldEF0dHJpYnV0ZShcImhyZWZcIikgPT09IFwiI1wiKXsgZS5wcmV2ZW50RGVmYXVsdCgpIH1cblxuICAgICAgdGhpcy5kZWJvdW5jZSh0YXJnZXQsIGUsIFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICB0aGlzLndpdGhpbk93bmVycyh0YXJnZXQsIHZpZXcgPT4ge1xuICAgICAgICAgIEpTLmV4ZWMoXCJjbGlja1wiLCBwaHhFdmVudCwgdmlldywgdGFyZ2V0LCBbXCJwdXNoXCIsIHtkYXRhOiB0aGlzLmV2ZW50TWV0YShcImNsaWNrXCIsIGUsIHRhcmdldCl9XSlcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSwgY2FwdHVyZSlcbiAgfVxuXG4gIGRpc3BhdGNoQ2xpY2tBd2F5KGUsIGNsaWNrU3RhcnRlZEF0KXtcbiAgICBsZXQgcGh4Q2xpY2tBd2F5ID0gdGhpcy5iaW5kaW5nKFwiY2xpY2stYXdheVwiKVxuICAgIERPTS5hbGwoZG9jdW1lbnQsIGBbJHtwaHhDbGlja0F3YXl9XWAsIGVsID0+IHtcbiAgICAgIGlmKCEoZWwuaXNTYW1lTm9kZShjbGlja1N0YXJ0ZWRBdCkgfHwgZWwuY29udGFpbnMoY2xpY2tTdGFydGVkQXQpKSl7XG4gICAgICAgIHRoaXMud2l0aGluT3duZXJzKGUudGFyZ2V0LCB2aWV3ID0+IHtcbiAgICAgICAgICBsZXQgcGh4RXZlbnQgPSBlbC5nZXRBdHRyaWJ1dGUocGh4Q2xpY2tBd2F5KVxuICAgICAgICAgIGlmKEpTLmlzVmlzaWJsZShlbCkpe1xuICAgICAgICAgICAgSlMuZXhlYyhcImNsaWNrXCIsIHBoeEV2ZW50LCB2aWV3LCBlbCwgW1wicHVzaFwiLCB7ZGF0YTogdGhpcy5ldmVudE1ldGEoXCJjbGlja1wiLCBlLCBlLnRhcmdldCl9XSlcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGJpbmROYXYoKXtcbiAgICBpZighQnJvd3Nlci5jYW5QdXNoU3RhdGUoKSl7IHJldHVybiB9XG4gICAgaWYoaGlzdG9yeS5zY3JvbGxSZXN0b3JhdGlvbil7IGhpc3Rvcnkuc2Nyb2xsUmVzdG9yYXRpb24gPSBcIm1hbnVhbFwiIH1cbiAgICBsZXQgc2Nyb2xsVGltZXIgPSBudWxsXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgX2UgPT4ge1xuICAgICAgY2xlYXJUaW1lb3V0KHNjcm9sbFRpbWVyKVxuICAgICAgc2Nyb2xsVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgQnJvd3Nlci51cGRhdGVDdXJyZW50U3RhdGUoc3RhdGUgPT4gT2JqZWN0LmFzc2lnbihzdGF0ZSwge3Njcm9sbDogd2luZG93LnNjcm9sbFl9KSlcbiAgICAgIH0sIDEwMClcbiAgICB9KVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicG9wc3RhdGVcIiwgZXZlbnQgPT4ge1xuICAgICAgaWYoIXRoaXMucmVnaXN0ZXJOZXdMb2NhdGlvbih3aW5kb3cubG9jYXRpb24pKXsgcmV0dXJuIH1cbiAgICAgIGxldCB7dHlwZSwgaWQsIHJvb3QsIHNjcm9sbH0gPSBldmVudC5zdGF0ZSB8fCB7fVxuICAgICAgbGV0IGhyZWYgPSB3aW5kb3cubG9jYXRpb24uaHJlZlxuXG4gICAgICB0aGlzLnJlcXVlc3RET01VcGRhdGUoKCkgPT4ge1xuICAgICAgICBpZih0aGlzLm1haW4uaXNDb25uZWN0ZWQoKSAmJiAodHlwZSA9PT0gXCJwYXRjaFwiICYmIGlkID09PSB0aGlzLm1haW4uaWQpKXtcbiAgICAgICAgICB0aGlzLm1haW4ucHVzaExpbmtQYXRjaChocmVmLCBudWxsKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMucmVwbGFjZU1haW4oaHJlZiwgbnVsbCwgKCkgPT4ge1xuICAgICAgICAgICAgaWYocm9vdCl7IHRoaXMucmVwbGFjZVJvb3RIaXN0b3J5KCkgfVxuICAgICAgICAgICAgaWYodHlwZW9mKHNjcm9sbCkgPT09IFwibnVtYmVyXCIpe1xuICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgc2Nyb2xsKVxuICAgICAgICAgICAgICB9LCAwKSAvLyB0aGUgYm9keSBuZWVkcyB0byByZW5kZXIgYmVmb3JlIHdlIHNjcm9sbC5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0sIGZhbHNlKVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZSA9PiB7XG4gICAgICBsZXQgdGFyZ2V0ID0gY2xvc2VzdFBoeEJpbmRpbmcoZS50YXJnZXQsIFBIWF9MSVZFX0xJTkspXG4gICAgICBsZXQgdHlwZSA9IHRhcmdldCAmJiB0YXJnZXQuZ2V0QXR0cmlidXRlKFBIWF9MSVZFX0xJTkspXG4gICAgICBsZXQgd2FudHNOZXdUYWIgPSBlLm1ldGFLZXkgfHwgZS5jdHJsS2V5IHx8IGUuYnV0dG9uID09PSAxXG4gICAgICBpZighdHlwZSB8fCAhdGhpcy5pc0Nvbm5lY3RlZCgpIHx8ICF0aGlzLm1haW4gfHwgd2FudHNOZXdUYWIpeyByZXR1cm4gfVxuXG4gICAgICBsZXQgaHJlZiA9IHRhcmdldC5ocmVmXG4gICAgICBsZXQgbGlua1N0YXRlID0gdGFyZ2V0LmdldEF0dHJpYnV0ZShQSFhfTElOS19TVEFURSlcbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKSAvLyBkbyBub3QgYnViYmxlIGNsaWNrIHRvIHJlZ3VsYXIgcGh4LWNsaWNrIGJpbmRpbmdzXG4gICAgICBpZih0aGlzLnBlbmRpbmdMaW5rID09PSBocmVmKXsgcmV0dXJuIH1cblxuICAgICAgdGhpcy5yZXF1ZXN0RE9NVXBkYXRlKCgpID0+IHtcbiAgICAgICAgaWYodHlwZSA9PT0gXCJwYXRjaFwiKXtcbiAgICAgICAgICB0aGlzLnB1c2hIaXN0b3J5UGF0Y2goaHJlZiwgbGlua1N0YXRlLCB0YXJnZXQpXG4gICAgICAgIH0gZWxzZSBpZih0eXBlID09PSBcInJlZGlyZWN0XCIpe1xuICAgICAgICAgIHRoaXMuaGlzdG9yeVJlZGlyZWN0KGhyZWYsIGxpbmtTdGF0ZSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYGV4cGVjdGVkICR7UEhYX0xJVkVfTElOS30gdG8gYmUgXCJwYXRjaFwiIG9yIFwicmVkaXJlY3RcIiwgZ290OiAke3R5cGV9YClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9LCBmYWxzZSlcbiAgfVxuXG4gIGRpc3BhdGNoRXZlbnQoZXZlbnQsIHBheWxvYWQgPSB7fSl7XG4gICAgRE9NLmRpc3BhdGNoRXZlbnQod2luZG93LCBgcGh4OiR7ZXZlbnR9YCwge2RldGFpbDogcGF5bG9hZH0pXG4gIH1cblxuICBkaXNwYXRjaEV2ZW50cyhldmVudHMpe1xuICAgIGV2ZW50cy5mb3JFYWNoKChbZXZlbnQsIHBheWxvYWRdKSA9PiB0aGlzLmRpc3BhdGNoRXZlbnQoZXZlbnQsIHBheWxvYWQpKVxuICB9XG5cbiAgd2l0aFBhZ2VMb2FkaW5nKGluZm8sIGNhbGxiYWNrKXtcbiAgICBET00uZGlzcGF0Y2hFdmVudCh3aW5kb3csIFwicGh4OnBhZ2UtbG9hZGluZy1zdGFydFwiLCB7ZGV0YWlsOiBpbmZvfSlcbiAgICBsZXQgZG9uZSA9ICgpID0+IERPTS5kaXNwYXRjaEV2ZW50KHdpbmRvdywgXCJwaHg6cGFnZS1sb2FkaW5nLXN0b3BcIiwge2RldGFpbDogaW5mb30pXG4gICAgcmV0dXJuIGNhbGxiYWNrID8gY2FsbGJhY2soZG9uZSkgOiBkb25lXG4gIH1cblxuICBwdXNoSGlzdG9yeVBhdGNoKGhyZWYsIGxpbmtTdGF0ZSwgdGFyZ2V0RWwpe1xuICAgIHRoaXMud2l0aFBhZ2VMb2FkaW5nKHt0bzogaHJlZiwga2luZDogXCJwYXRjaFwifSwgZG9uZSA9PiB7XG4gICAgICB0aGlzLm1haW4ucHVzaExpbmtQYXRjaChocmVmLCB0YXJnZXRFbCwgbGlua1JlZiA9PiB7XG4gICAgICAgIHRoaXMuaGlzdG9yeVBhdGNoKGhyZWYsIGxpbmtTdGF0ZSwgbGlua1JlZilcbiAgICAgICAgZG9uZSgpXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICBoaXN0b3J5UGF0Y2goaHJlZiwgbGlua1N0YXRlLCBsaW5rUmVmID0gdGhpcy5zZXRQZW5kaW5nTGluayhocmVmKSl7XG4gICAgaWYoIXRoaXMuY29tbWl0UGVuZGluZ0xpbmsobGlua1JlZikpeyByZXR1cm4gfVxuXG4gICAgQnJvd3Nlci5wdXNoU3RhdGUobGlua1N0YXRlLCB7dHlwZTogXCJwYXRjaFwiLCBpZDogdGhpcy5tYWluLmlkfSwgaHJlZilcbiAgICB0aGlzLnJlZ2lzdGVyTmV3TG9jYXRpb24od2luZG93LmxvY2F0aW9uKVxuICB9XG5cbiAgaGlzdG9yeVJlZGlyZWN0KGhyZWYsIGxpbmtTdGF0ZSwgZmxhc2gpe1xuICAgIGxldCBzY3JvbGwgPSB3aW5kb3cuc2Nyb2xsWVxuICAgIHRoaXMud2l0aFBhZ2VMb2FkaW5nKHt0bzogaHJlZiwga2luZDogXCJyZWRpcmVjdFwifSwgZG9uZSA9PiB7XG4gICAgICB0aGlzLnJlcGxhY2VNYWluKGhyZWYsIGZsYXNoLCAoKSA9PiB7XG4gICAgICAgIEJyb3dzZXIucHVzaFN0YXRlKGxpbmtTdGF0ZSwge3R5cGU6IFwicmVkaXJlY3RcIiwgaWQ6IHRoaXMubWFpbi5pZCwgc2Nyb2xsOiBzY3JvbGx9LCBocmVmKVxuICAgICAgICB0aGlzLnJlZ2lzdGVyTmV3TG9jYXRpb24od2luZG93LmxvY2F0aW9uKVxuICAgICAgICBkb25lKClcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIHJlcGxhY2VSb290SGlzdG9yeSgpe1xuICAgIEJyb3dzZXIucHVzaFN0YXRlKFwicmVwbGFjZVwiLCB7cm9vdDogdHJ1ZSwgdHlwZTogXCJwYXRjaFwiLCBpZDogdGhpcy5tYWluLmlkfSlcbiAgfVxuXG4gIHJlZ2lzdGVyTmV3TG9jYXRpb24obmV3TG9jYXRpb24pe1xuICAgIGxldCB7cGF0aG5hbWUsIHNlYXJjaH0gPSB0aGlzLmN1cnJlbnRMb2NhdGlvblxuICAgIGlmKHBhdGhuYW1lICsgc2VhcmNoID09PSBuZXdMb2NhdGlvbi5wYXRobmFtZSArIG5ld0xvY2F0aW9uLnNlYXJjaCl7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jdXJyZW50TG9jYXRpb24gPSBjbG9uZShuZXdMb2NhdGlvbilcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICB9XG5cbiAgYmluZEZvcm1zKCl7XG4gICAgbGV0IGl0ZXJhdGlvbnMgPSAwXG4gICAgdGhpcy5vbihcInN1Ym1pdFwiLCBlID0+IHtcbiAgICAgIGxldCBwaHhFdmVudCA9IGUudGFyZ2V0LmdldEF0dHJpYnV0ZSh0aGlzLmJpbmRpbmcoXCJzdWJtaXRcIikpXG4gICAgICBpZighcGh4RXZlbnQpeyByZXR1cm4gfVxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBlLnRhcmdldC5kaXNhYmxlZCA9IHRydWVcbiAgICAgIHRoaXMud2l0aGluT3duZXJzKGUudGFyZ2V0LCB2aWV3ID0+IHtcbiAgICAgICAgSlMuZXhlYyhcInN1Ym1pdFwiLCBwaHhFdmVudCwgdmlldywgZS50YXJnZXQsIFtcInB1c2hcIiwge31dKVxuICAgICAgfSlcbiAgICB9LCBmYWxzZSlcblxuICAgIGZvcihsZXQgdHlwZSBvZiBbXCJjaGFuZ2VcIiwgXCJpbnB1dFwiXSl7XG4gICAgICB0aGlzLm9uKHR5cGUsIGUgPT4ge1xuICAgICAgICBsZXQgcGh4Q2hhbmdlID0gdGhpcy5iaW5kaW5nKFwiY2hhbmdlXCIpXG4gICAgICAgIGxldCBpbnB1dCA9IGUudGFyZ2V0XG4gICAgICAgIGxldCBpbnB1dEV2ZW50ID0gaW5wdXQuZ2V0QXR0cmlidXRlKHBoeENoYW5nZSlcbiAgICAgICAgbGV0IGZvcm1FdmVudCA9IGlucHV0LmZvcm0gJiYgaW5wdXQuZm9ybS5nZXRBdHRyaWJ1dGUocGh4Q2hhbmdlKVxuICAgICAgICBsZXQgcGh4RXZlbnQgPSBpbnB1dEV2ZW50IHx8IGZvcm1FdmVudFxuICAgICAgICBpZighcGh4RXZlbnQpeyByZXR1cm4gfVxuICAgICAgICBpZihpbnB1dC50eXBlID09PSBcIm51bWJlclwiICYmIGlucHV0LnZhbGlkaXR5ICYmIGlucHV0LnZhbGlkaXR5LmJhZElucHV0KXsgcmV0dXJuIH1cblxuICAgICAgICBsZXQgZGlzcGF0Y2hlciA9IGlucHV0RXZlbnQgPyBpbnB1dCA6IGlucHV0LmZvcm1cbiAgICAgICAgbGV0IGN1cnJlbnRJdGVyYXRpb25zID0gaXRlcmF0aW9uc1xuICAgICAgICBpdGVyYXRpb25zKytcbiAgICAgICAgbGV0IHthdDogYXQsIHR5cGU6IGxhc3RUeXBlfSA9IERPTS5wcml2YXRlKGlucHV0LCBcInByZXYtaXRlcmF0aW9uXCIpIHx8IHt9XG4gICAgICAgIC8vIGRldGVjdCBkdXAgYmVjYXVzZSBzb21lIGJyb3dzZXJzIGRpc3BhdGNoIGJvdGggXCJpbnB1dFwiIGFuZCBcImNoYW5nZVwiXG4gICAgICAgIGlmKGF0ID09PSBjdXJyZW50SXRlcmF0aW9ucyAtIDEgJiYgdHlwZSAhPT0gbGFzdFR5cGUpeyByZXR1cm4gfVxuXG4gICAgICAgIERPTS5wdXRQcml2YXRlKGlucHV0LCBcInByZXYtaXRlcmF0aW9uXCIsIHthdDogY3VycmVudEl0ZXJhdGlvbnMsIHR5cGU6IHR5cGV9KVxuXG4gICAgICAgIHRoaXMuZGVib3VuY2UoaW5wdXQsIGUsIHR5cGUsICgpID0+IHtcbiAgICAgICAgICB0aGlzLndpdGhpbk93bmVycyhkaXNwYXRjaGVyLCB2aWV3ID0+IHtcbiAgICAgICAgICAgIERPTS5wdXRQcml2YXRlKGlucHV0LCBQSFhfSEFTX0ZPQ1VTRUQsIHRydWUpXG4gICAgICAgICAgICBpZighRE9NLmlzVGV4dHVhbElucHV0KGlucHV0KSl7XG4gICAgICAgICAgICAgIHRoaXMuc2V0QWN0aXZlRWxlbWVudChpbnB1dClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIEpTLmV4ZWMoXCJjaGFuZ2VcIiwgcGh4RXZlbnQsIHZpZXcsIGlucHV0LCBbXCJwdXNoXCIsIHtfdGFyZ2V0OiBlLnRhcmdldC5uYW1lLCBkaXNwYXRjaGVyOiBkaXNwYXRjaGVyfV0pXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH0sIGZhbHNlKVxuICAgIH1cbiAgfVxuXG4gIGRlYm91bmNlKGVsLCBldmVudCwgZXZlbnRUeXBlLCBjYWxsYmFjayl7XG4gICAgaWYoZXZlbnRUeXBlID09PSBcImJsdXJcIiB8fCBldmVudFR5cGUgPT09IFwiZm9jdXNvdXRcIil7IHJldHVybiBjYWxsYmFjaygpIH1cblxuICAgIGxldCBwaHhEZWJvdW5jZSA9IHRoaXMuYmluZGluZyhQSFhfREVCT1VOQ0UpXG4gICAgbGV0IHBoeFRocm90dGxlID0gdGhpcy5iaW5kaW5nKFBIWF9USFJPVFRMRSlcbiAgICBsZXQgZGVmYXVsdERlYm91bmNlID0gdGhpcy5kZWZhdWx0cy5kZWJvdW5jZS50b1N0cmluZygpXG4gICAgbGV0IGRlZmF1bHRUaHJvdHRsZSA9IHRoaXMuZGVmYXVsdHMudGhyb3R0bGUudG9TdHJpbmcoKVxuXG4gICAgdGhpcy53aXRoaW5Pd25lcnMoZWwsIHZpZXcgPT4ge1xuICAgICAgbGV0IGFzeW5jRmlsdGVyID0gKCkgPT4gIXZpZXcuaXNEZXN0cm95ZWQoKSAmJiBkb2N1bWVudC5ib2R5LmNvbnRhaW5zKGVsKVxuICAgICAgRE9NLmRlYm91bmNlKGVsLCBldmVudCwgcGh4RGVib3VuY2UsIGRlZmF1bHREZWJvdW5jZSwgcGh4VGhyb3R0bGUsIGRlZmF1bHRUaHJvdHRsZSwgYXN5bmNGaWx0ZXIsICgpID0+IHtcbiAgICAgICAgY2FsbGJhY2soKVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgc2lsZW5jZUV2ZW50cyhjYWxsYmFjayl7XG4gICAgdGhpcy5zaWxlbmNlZCA9IHRydWVcbiAgICBjYWxsYmFjaygpXG4gICAgdGhpcy5zaWxlbmNlZCA9IGZhbHNlXG4gIH1cblxuICBvbihldmVudCwgY2FsbGJhY2spe1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBlID0+IHtcbiAgICAgIGlmKCF0aGlzLnNpbGVuY2VkKXsgY2FsbGJhY2soZSkgfVxuICAgIH0pXG4gIH1cbn1cblxuY2xhc3MgVHJhbnNpdGlvblNldCB7XG4gIGNvbnN0cnVjdG9yKCl7XG4gICAgdGhpcy50cmFuc2l0aW9ucyA9IG5ldyBTZXQoKVxuICAgIHRoaXMucGVuZGluZ09wcyA9IFtdXG4gICAgdGhpcy5yZXNldCgpXG4gIH1cblxuICByZXNldCgpe1xuICAgIHRoaXMudHJhbnNpdGlvbnMuZm9yRWFjaCh0aW1lciA9PiB7XG4gICAgICBjYW5jZWxUaW1lb3V0KHRpbWVyKVxuICAgICAgdGhpcy50cmFuc2l0aW9ucy5kZWxldGUodGltZXIpXG4gICAgfSlcbiAgICB0aGlzLmZsdXNoUGVuZGluZ09wcygpXG4gIH1cblxuICBhZnRlcihjYWxsYmFjayl7XG4gICAgaWYodGhpcy5zaXplKCkgPT09IDApe1xuICAgICAgY2FsbGJhY2soKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnB1c2hQZW5kaW5nT3AoY2FsbGJhY2spXG4gICAgfVxuICB9XG5cbiAgYWRkVHJhbnNpdGlvbih0aW1lLCBvblN0YXJ0LCBvbkRvbmUpe1xuICAgIG9uU3RhcnQoKVxuICAgIGxldCB0aW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy50cmFuc2l0aW9ucy5kZWxldGUodGltZXIpXG4gICAgICBvbkRvbmUoKVxuICAgICAgaWYodGhpcy5zaXplKCkgPT09IDApeyB0aGlzLmZsdXNoUGVuZGluZ09wcygpIH1cbiAgICB9LCB0aW1lKVxuICAgIHRoaXMudHJhbnNpdGlvbnMuYWRkKHRpbWVyKVxuICB9XG5cbiAgcHVzaFBlbmRpbmdPcChvcCl7IHRoaXMucGVuZGluZ09wcy5wdXNoKG9wKSB9XG5cbiAgc2l6ZSgpeyByZXR1cm4gdGhpcy50cmFuc2l0aW9ucy5zaXplIH1cblxuICBmbHVzaFBlbmRpbmdPcHMoKXtcbiAgICB0aGlzLnBlbmRpbmdPcHMuZm9yRWFjaChvcCA9PiBvcCgpKVxuICAgIHRoaXMucGVuZGluZ09wcyA9IFtdXG4gIH1cbn1cbiIsICIvLyBXZSBpbXBvcnQgdGhlIENTUyB3aGljaCBpcyBleHRyYWN0ZWQgdG8gaXRzIG93biBmaWxlIGJ5IGVzYnVpbGQuXG4vLyBSZW1vdmUgdGhpcyBsaW5lIGlmIHlvdSBhZGQgYSB5b3VyIG93biBDU1MgYnVpbGQgcGlwZWxpbmUgKGUuZyBwb3N0Y3NzKS5cbmltcG9ydCBcIi4uL2Nzcy9hcHAuY3NzXCJcblxuLy8gSWYgeW91IHdhbnQgdG8gdXNlIFBob2VuaXggY2hhbm5lbHMsIHJ1biBgbWl4IGhlbHAgcGh4Lmdlbi5jaGFubmVsYFxuLy8gdG8gZ2V0IHN0YXJ0ZWQgYW5kIHRoZW4gdW5jb21tZW50IHRoZSBsaW5lIGJlbG93LlxuLy8gaW1wb3J0IFwiLi91c2VyX3NvY2tldC5qc1wiXG5cbi8vIFlvdSBjYW4gaW5jbHVkZSBkZXBlbmRlbmNpZXMgaW4gdHdvIHdheXMuXG4vL1xuLy8gVGhlIHNpbXBsZXN0IG9wdGlvbiBpcyB0byBwdXQgdGhlbSBpbiBhc3NldHMvdmVuZG9yIGFuZFxuLy8gaW1wb3J0IHRoZW0gdXNpbmcgcmVsYXRpdmUgcGF0aHM6XG4vL1xuLy8gICAgIGltcG9ydCBcIi4uL3ZlbmRvci9zb21lLXBhY2thZ2UuanNcIlxuLy9cbi8vIEFsdGVybmF0aXZlbHksIHlvdSBjYW4gYG5wbSBpbnN0YWxsIHNvbWUtcGFja2FnZSAtLXByZWZpeCBhc3NldHNgIGFuZCBpbXBvcnRcbi8vIHRoZW0gdXNpbmcgYSBwYXRoIHN0YXJ0aW5nIHdpdGggdGhlIHBhY2thZ2UgbmFtZTpcbi8vXG4vLyAgICAgaW1wb3J0IFwic29tZS1wYWNrYWdlXCJcbi8vXG5cbi8vIEluY2x1ZGUgcGhvZW5peF9odG1sIHRvIGhhbmRsZSBtZXRob2Q9UFVUL0RFTEVURSBpbiBmb3JtcyBhbmQgYnV0dG9ucy5cbmltcG9ydCBcInBob2VuaXhfaHRtbFwiXG4vLyBFc3RhYmxpc2ggUGhvZW5peCBTb2NrZXQgYW5kIExpdmVWaWV3IGNvbmZpZ3VyYXRpb24uXG5pbXBvcnQge1NvY2tldH0gZnJvbSBcInBob2VuaXhcIlxuaW1wb3J0IHtMaXZlU29ja2V0fSBmcm9tIFwicGhvZW5peF9saXZlX3ZpZXdcIlxuaW1wb3J0IHRvcGJhciBmcm9tIFwiLi4vdmVuZG9yL3RvcGJhclwiXG5cbmxldCBob29rcyA9IHt9XG5cbmhvb2tzLk1hcCA9IHtcbiAgbW91bnRlZCgpIHtcbiAgICAvLyBJbml0YWxpemUgYW5kIGNlbnRlciB0aGUgbWFwIG9uIFNhbiBGcmFuY2lzY28gXG4gICAgdGhpcy5tYXAgPSBMLm1hcCgnbWFwaWQnKS5zZXRWaWV3KFszNy43NzQ5LCAtMTIyLjQxOTRdLCAxMyk7XG5cbiAgICBMLnRpbGVMYXllcignaHR0cHM6Ly97c30udGlsZS5vcGVuc3RyZWV0bWFwLm9yZy97en0ve3h9L3t5fS5wbmcnLCB7XG4gICAgICBtYXhab29tOiAxNyxcbiAgICB9KS5hZGRUbyh0aGlzLm1hcCk7XG5cbiAgICAvLyBHZXQgdGhlIGZvb2QgdHJ1Y2sgZGF0YSBmcm9tIHRoZSBET01cbiAgICBjb25zdCBmb29kVHJ1Y2tzID0gSlNPTi5wYXJzZSh0aGlzLmVsLmRhdGFzZXQuZm9vZFRydWNrcyk7XG5cbiAgICAvLyBQcmVwYXJlIHRoZSBwb2ludHMgZm9yIHRoZSBoZWF0bWFwXG4gICAgY29uc3QgaGVhdE1hcFBvaW50cyA9IGZvb2RUcnVja3MubWFwKHRydWNrID0+IFt0cnVjay5sYXRpdHVkZSwgdHJ1Y2subG9uZ2l0dWRlXSk7XG5cbiAgICAvLyBBZGQgdGhlIGhlYXRtYXAgbGF5ZXJcbiAgICBMLmhlYXRMYXllcihoZWF0TWFwUG9pbnRzLCB7bWluT3BhY2l0eTogLjQsIHJhZGl1czogMjUsIGJsdXI6IDE1LCBncmFkaWVudDogezAuMjogJ2JsdWUnLCAwLjY1OiAnbGltZScsIDE6ICdyZWQnfX0pLmFkZFRvKHRoaXMubWFwKTtcbiAgfVxufVxuXG5sZXQgY3NyZlRva2VuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIm1ldGFbbmFtZT0nY3NyZi10b2tlbiddXCIpLmdldEF0dHJpYnV0ZShcImNvbnRlbnRcIilcbmxldCBsaXZlU29ja2V0ID0gbmV3IExpdmVTb2NrZXQoXCIvbGl2ZVwiLCBTb2NrZXQsIHtwYXJhbXM6IHtfY3NyZl90b2tlbjogY3NyZlRva2VufSwgaG9va3M6IGhvb2tzfSlcblxuLy8gU2hvdyBwcm9ncmVzcyBiYXIgb24gbGl2ZSBuYXZpZ2F0aW9uIGFuZCBmb3JtIHN1Ym1pdHNcbnRvcGJhci5jb25maWcoe2JhckNvbG9yczogezA6IFwiIzI5ZFwifSwgc2hhZG93Q29sb3I6IFwicmdiYSgwLCAwLCAwLCAuMylcIn0pXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInBoeDpwYWdlLWxvYWRpbmctc3RhcnRcIiwgaW5mbyA9PiB0b3BiYXIuc2hvdygpKVxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJwaHg6cGFnZS1sb2FkaW5nLXN0b3BcIiwgaW5mbyA9PiB0b3BiYXIuaGlkZSgpKVxuXG4vLyBjb25uZWN0IGlmIHRoZXJlIGFyZSBhbnkgTGl2ZVZpZXdzIG9uIHRoZSBwYWdlXG5saXZlU29ja2V0LmNvbm5lY3QoKVxuXG4vLyBleHBvc2UgbGl2ZVNvY2tldCBvbiB3aW5kb3cgZm9yIHdlYiBjb25zb2xlIGRlYnVnIGxvZ3MgYW5kIGxhdGVuY3kgc2ltdWxhdGlvbjpcbi8vID4+IGxpdmVTb2NrZXQuZW5hYmxlRGVidWcoKVxuLy8gPj4gbGl2ZVNvY2tldC5lbmFibGVMYXRlbmN5U2ltKDEwMDApICAvLyBlbmFibGVkIGZvciBkdXJhdGlvbiBvZiBicm93c2VyIHNlc3Npb25cbi8vID4+IGxpdmVTb2NrZXQuZGlzYWJsZUxhdGVuY3lTaW0oKVxud2luZG93LmxpdmVTb2NrZXQgPSBsaXZlU29ja2V0XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFNQSxNQUFDLFVBQVUsU0FBUSxXQUFVO0FBQzNCO0FBR0EsUUFBQyxZQUFZO0FBQ1gsY0FBSSxXQUFXO0FBQ2YsY0FBSSxVQUFVLENBQUMsTUFBTSxPQUFPLFVBQVU7QUFDdEMsbUJBQVMsSUFBSSxHQUFHLElBQUksUUFBUSxVQUFVLENBQUMsUUFBTyx1QkFBdUIsRUFBRSxHQUFHO0FBQ3hFLG9CQUFPLHdCQUNMLFFBQU8sUUFBUSxLQUFLO0FBQ3RCLG9CQUFPLHVCQUNMLFFBQU8sUUFBUSxLQUFLLDJCQUNwQixRQUFPLFFBQVEsS0FBSztBQUFBO0FBRXhCLGNBQUksQ0FBQyxRQUFPO0FBQ1Ysb0JBQU8sd0JBQXdCLFNBQVUsVUFBVSxTQUFTO0FBQzFELGtCQUFJLFdBQVcsSUFBSSxPQUFPO0FBQzFCLGtCQUFJLGFBQWEsS0FBSyxJQUFJLEdBQUcsS0FBTSxZQUFXO0FBQzlDLGtCQUFJLEtBQUssUUFBTyxXQUFXLFdB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
