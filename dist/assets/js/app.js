"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger, SplitText, ScrollSmoother, Flip);
  var body = document.querySelector("body");
  /**
   * Preloader
   */
  var preloader = document.querySelector(".preloader");
  window.addEventListener("load", function () {
    if (preloader) {
      setTimeout(function () {
        preloader.style.display = "none";
      }, 300);
    }
  });
  /**
   * Slide Up
   */
  var slideUp = function slideUp(target) {
    var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;
    if (!target) return;
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.boxSizing = "border-box";
    target.style.height = target.offsetHeight + "px";
    target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = 0;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    window.setTimeout(function () {
      target.style.display = "none";
      target.style.removeProperty("height");
      target.style.removeProperty("padding-top");
      target.style.removeProperty("padding-bottom");
      target.style.removeProperty("margin-top");
      target.style.removeProperty("margin-bottom");
      target.style.removeProperty("overflow");
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
    }, duration);
  };
  /**
   * Slide Down
   */
  var slideDown = function slideDown(target) {
    var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;
    if (!target) return;
    target.style.removeProperty("display");
    var display = window.getComputedStyle(target).display;
    if (display === "none") display = "block";
    target.style.display = display;
    var height = target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = 0;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    target.offsetHeight;
    target.style.boxSizing = "border-box";
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height = height + "px";
    target.style.removeProperty("padding-top");
    target.style.removeProperty("padding-bottom");
    target.style.removeProperty("margin-top");
    target.style.removeProperty("margin-bottom");
    window.setTimeout(function () {
      target.style.removeProperty("height");
      target.style.removeProperty("overflow");
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
    }, duration);
  };
  /**
   * Slide Toggle
   */
  var slideToggle = function slideToggle(target) {
    var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;
    if (!target) return;
    if (target.style === undefined || target.style.display === "none") {
      return slideDown(target, duration);
    }
    return slideUp(target, duration);
  };
  /**
   * Header Crossed
   */
  var scrollTimeout;
  window.addEventListener("scroll", function () {
    if (!body) return;
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(function () {
      var primaryHeader = document.querySelector(".primary-header");
      if (primaryHeader) {
        var primaryHeaderTop = primaryHeader.offsetHeight / 3;
        var scrolled = window.scrollY;
        if (scrolled > primaryHeaderTop) {
          body.classList.add("primary-header-crossed");
        } else {
          body.classList.remove("primary-header-crossed");
        }
      }
    }, 100);
  });
  /**
   * Primary Menu
   */
  var mdScreen = "(max-width: 991px)";
  var primaryHeader = document.querySelector(".primary-header");
  if (primaryHeader) {
    primaryHeader.addEventListener("click", function (e) {
      var target = e.target.closest(".has-sub-menu > a, .has-sub-2nd > a");
      if (!target) return;
      var isMobile = window.matchMedia(mdScreen).matches;
      if (isMobile) {
        e.preventDefault();
        e.stopPropagation();
        target.classList.toggle("active");
        var menuSub = target.nextElementSibling;
        if (menuSub) {
          slideToggle(menuSub, 500);
        }
      } else {
        if (!target.getAttribute("href") || target.getAttribute("href") === "#") {
          e.preventDefault();
        }
      }
    });
    window.matchMedia(mdScreen).addEventListener("change", function (e) {
      var subMenus = primaryHeader.querySelectorAll(".navigation-0__menu, .navigation-1__menu, .navigation-1__sub-menu");
      if (!subMenus.length) return;
      for (var i = 0; i < subMenus.length; i++) {
        var menu = subMenus[i];
        if (menu.style.display !== "none") {
          slideUp(menu, 0);
          var parentLink = menu.previousElementSibling;
          if (parentLink) {
            parentLink.classList.remove("active");
          }
        }
      }
    });
  }
  /**
   * Duplicate Scroller-X Item
   */
  var scrollerX = document.querySelectorAll(".scroller-x");
  function scrollerXDuplication(scroller) {
    if (scroller.dataset.duplicated === "true") return;
    var scrollerInner = scroller.querySelector(".scroller-x__list");
    if (!scrollerInner) return;
    var scrollerContent = Array.from(scrollerInner.children);
    if (!scrollerContent.length) return;
    var fragment = document.createDocumentFragment();
    scrollerContent.forEach(function (item) {
      var duplicateItem = item.cloneNode(true);
      fragment.appendChild(duplicateItem);
    });
    scrollerInner.appendChild(fragment);
    scroller.dataset.duplicated = "true";
  }
  scrollerX.forEach(function (scroller) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          scrollerXDuplication(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0
    });
    observer.observe(scroller);
  });
  /**
   * Countdown Timer
   */
  function updateCountdown() {
    var countdownElements = document.querySelectorAll(".countdown");
    if (!countdownElements.length) return;
    function updateAll() {
      var currentDate = new Date().getTime();
      var activeCountdowns = false;
      countdownElements.forEach(function (countdown) {
        var targetDateStr = countdown.dataset.date;
        if (!targetDateStr) {
          console.error("Error: Target date not specified in the data-date attribute.");
          return;
        }
        var targetDate = new Date(targetDateStr).getTime();
        if (isNaN(targetDate)) {
          console.error("Error: Invalid target date format.");
          return;
        }
        var timeDifference = targetDate - currentDate;
        if (timeDifference <= 0) {
          var _selectors = [{
            sel: ".days",
            val: "00"
          }, {
            sel: ".months",
            val: "00"
          }, {
            sel: ".hours",
            val: "00"
          }, {
            sel: ".minutes",
            val: "00"
          }, {
            sel: ".seconds",
            val: "00"
          }];
          _selectors.forEach(function (_ref) {
            var sel = _ref.sel,
              val = _ref.val;
            var element = countdown.querySelector(sel);
            if (element) element.innerText = val;
          });
          return;
        }
        activeCountdowns = true;
        var days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        var months = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 30));
        var hours = Math.floor(timeDifference % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
        var minutes = Math.floor(timeDifference % (1000 * 60 * 60) / (1000 * 60));
        var seconds = Math.floor(timeDifference % (1000 * 60) / 1000);
        var selectors = [{
          sel: ".days",
          val: days.toString().padStart(2, "0")
        }, {
          sel: ".months",
          val: months.toString().padStart(2, "0")
        }, {
          sel: ".hours",
          val: hours.toString().padStart(2, "0")
        }, {
          sel: ".minutes",
          val: minutes.toString().padStart(2, "0")
        }, {
          sel: ".seconds",
          val: seconds.toString().padStart(2, "0")
        }];
        selectors.forEach(function (_ref2) {
          var sel = _ref2.sel,
            val = _ref2.val;
          var element = countdown.querySelector(sel);
          if (element) element.innerText = val;
        });
      });
      if (!activeCountdowns) {
        clearInterval(timer);
      }
    }
    updateAll();
    var timer = setInterval(updateAll, 1000);
  }
  // Initialize countdown timer
  updateCountdown();
  /**
   * Text Copy Functionality
   */
  var copyBtn = document.getElementById("copyBtn");
  var input = document.getElementById("walletAddress");
  if (copyBtn && input) {
    copyBtn.addEventListener("click", function () {
      var _navigator$clipboard,
        _this = this;
      if (!input.value) {
        console.warn("No wallet address to copy");
        return;
      }

      // Check if Clipboard API is available
      if ((_navigator$clipboard = navigator.clipboard) !== null && _navigator$clipboard !== void 0 && _navigator$clipboard.writeText) {
        navigator.clipboard.writeText(input.value).then(function () {
          // Success feedback
          _this.classList.add("btn-success");
          setTimeout(function () {
            return _this.classList.remove("btn-success");
          }, 2000);
        })["catch"](function (err) {
          console.error("Failed to copy:", err);
          alert("Your browser blocked clipboard access.");
        });
      } else {
        // Graceful fallback (no copy, just alert user)
        alert("Clipboard API not supported in this browser.");
      }
    });
  }

  /**
   * Initialize ScrollSmoother
   */
  ScrollSmoother.create({
    wrapper: "#smooth-wrapper",
    content: "#smooth-content",
    smooth: 1.5,
    effects: true,
    normalizeScroll: true,
    smoothTouch: 0.1
  });
  /**
   * Animation
   */
  var mm = gsap.matchMedia();
  mm.add("(min-width: 1200px)", function () {
    function textAnimation() {
      var items = gsap.utils.toArray(".gsap-text-animation");
      if (!items.length) return;
      var _loop = function _loop() {
          var item = items[i];
          var scrollTriggerSupport = item.dataset.scrollTrigger;
          var animationStart = item.dataset.start || "85%";
          var animationEnd = item.dataset.end || "25%";
          var animationStagger = item.dataset.stagger || "0.05";
          var animationDuration = item.dataset.duration || "1";
          var animationDelay = item.dataset.delay || "0";
          var animationY = item.dataset.y || "50";
          var animationOpacity = item.dataset.opacity || "0";
          var splitType = item.dataset.splitType || "chars";
          var scrollMarker = item.dataset.markers || false;
          var textSplit = new SplitText(item, {
            type: splitType
          });
          var itemsToAnimate;
          if (splitType === "chars") {
            itemsToAnimate = textSplit.chars;
          } else if (splitType === "words") {
            itemsToAnimate = textSplit.words;
          } else if (splitType === "lines") {
            itemsToAnimate = textSplit.lines;
          } else {
            console.error("Invalid split type:", splitType);
            return 0; // continue
          }
          if (!itemsToAnimate.length) {
            textSplit.revert();
            return 0; // continue
          }
          var tl = scrollTriggerSupport ? gsap.timeline({
            scrollTrigger: {
              trigger: item,
              start: "clamp(top ".concat(animationStart, ")"),
              end: "clamp(bottom ".concat(animationEnd, ")"),
              markers: scrollMarker,
              once: true
            }
          }) : gsap.timeline();
          tl.from(itemsToAnimate, {
            opacity: parseFloat(animationOpacity),
            delay: parseFloat(animationDelay),
            yPercent: parseFloat(animationY),
            duration: parseFloat(animationDuration),
            stagger: parseFloat(animationStagger),
            ease: "back.out",
            onComplete: function onComplete() {
              textSplit.revert();
            }
          });
        },
        _ret;
      for (var i = 0; i < items.length; i++) {
        _ret = _loop();
        if (_ret === 0) continue;
      }
    }
    function imageRevealAnimation() {
      var imageContainers = gsap.utils.toArray(".gsap-image-reveal");
      if (!imageContainers.length) return;
      for (var i = 0; i < imageContainers.length; i++) {
        var image = imageContainers[i];
        var revealImage = image.querySelector("img");
        if (!revealImage) continue;
        var scrollTriggerSupport = image.dataset.scrollTrigger;
        var animationStart = image.dataset.start || "85%";
        var animationEnd = image.dataset.end || "25%";
        var scrollMarker = image.dataset.markers || false;
        var tl = scrollTriggerSupport ? gsap.timeline({
          scrollTrigger: {
            trigger: image,
            start: "clamp(top ".concat(animationStart, ")"),
            end: "clamp(bottom ".concat(animationEnd, ")"),
            markers: scrollMarker,
            once: true
          }
        }) : gsap.timeline();
        tl.set(image, {
          autoAlpha: 1
        });
        tl.from(image, {
          xPercent: -100,
          duration: 1.5,
          ease: "power2.out"
        });
        tl.from(revealImage, {
          xPercent: 100,
          ease: "power2.out",
          scale: 1.5,
          duration: 1.5,
          delay: -1.5
        });
      }
    }
    function fadeInAnimation() {
      var fadeIn = gsap.utils.toArray(".gsap-fade-in");
      if (!fadeIn.length) return;
      for (var i = 0; i < fadeIn.length; i++) {
        var item = fadeIn[i];
        var scrollTriggerSupport = item.dataset.scrollTrigger;
        var animationStart = item.dataset.start || "85%";
        var animationEnd = item.dataset.end || "25%";
        var animationStagger = item.dataset.stagger || "0";
        var animationDuration = item.dataset.duration || "1";
        var animationDelay = item.dataset.delay || "0";
        var animationY = item.dataset.y || "0";
        var animationX = item.dataset.x || "0";
        var animationOpacity = item.dataset.opacity || "0";
        var scrollMarker = item.dataset.markers || false;
        var tl = scrollTriggerSupport ? gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: "clamp(top ".concat(animationStart, ")"),
            end: "clamp(bottom ".concat(animationEnd, ")"),
            markers: scrollMarker,
            once: true
          }
        }) : gsap.timeline();
        tl.from(item, {
          opacity: parseFloat(animationOpacity),
          yPercent: parseFloat(animationY),
          xPercent: parseFloat(animationX),
          delay: parseFloat(animationDelay),
          stagger: parseFloat(animationStagger),
          duration: parseFloat(animationDuration),
          ease: "back.out"
        });
      }
    }
    function zoomAnimation() {
      var zoomAnimation = gsap.utils.toArray(".gsap-zoom");
      if (!zoomAnimation.length) return;
      for (var i = 0; i < zoomAnimation.length; i++) {
        var item = zoomAnimation[i];
        var scrollTriggerSupport = item.dataset.scrollTrigger;
        var animationStart = item.dataset.start || "85%";
        var animationEnd = item.dataset.end || "25%";
        var animationOpacity = item.dataset.opacity || "1";
        var animationScale = item.dataset.scale || "1";
        var animationScrub = item.dataset.scrub || false;
        var tl = scrollTriggerSupport ? gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: "clamp(top ".concat(animationStart, ")"),
            end: "clamp(bottom ".concat(animationEnd, ")"),
            scrub: parseFloat(animationScrub),
            once: true
          }
        }) : gsap.timeline();
        tl.from(item, {
          opacity: parseFloat(animationOpacity),
          scale: parseFloat(animationScale)
        });
      }
    }
    function rocketLaunch() {
      var rocketLaunch = document.querySelector(".road-map-section-1__element--1");
      if (rocketLaunch) {
        var startY = 0;
        var endY = 1200;
        ScrollTrigger.create({
          trigger: rocketLaunch,
          start: "top 75%",
          end: "bottom -25%",
          scrub: true,
          onUpdate: function onUpdate(self) {
            var progress = self.progress;
            var interpolatedY = startY + (endY - startY) * progress;
            rocketLaunch.style.top = "".concat(interpolatedY, "px");
          }
        });
      }
    }
    function herothree() {
      var heroThree = document.querySelector(".hero-3");
      if (heroThree) {
        // Set initial CSS custom properties for pseudo-elements
        heroThree.style.setProperty("--before-opacity", 0);
        heroThree.style.setProperty("--after-opacity", 0);

        // Animate the custom properties using GSAP
        gsap.to(heroThree, {
          "--before-opacity": 1,
          duration: 1.5,
          delay: 4.5
        });
        gsap.to(heroThree, {
          "--after-opacity": 1,
          duration: 1.5,
          delay: 4
        });
      }
    }
    herothree();
    rocketLaunch();
    imageRevealAnimation();
    fadeInAnimation();
    zoomAnimation();
    document.fonts.ready.then(function () {
      textAnimation();
    })["catch"](function (error) {
      console.error("Font loading failed:", error);
      textAnimation();
    });
  });
});
/**
 * Scroll to Section
 */
// Smooth scroll with GSAP
function smoothScrollTo(targetId) {
  var target = document.querySelector(targetId);
  if (target) {
    gsap.to(window, {
      duration: 1,
      scrollTo: {
        y: target,
        offsetY: getHeaderHeight()
      },
      ease: "power2.inOut"
    });
  }
}
function getHeaderHeight() {
  var header = document.querySelector("header"); // adjust selector if needed
  return header ? header.offsetHeight : 0;
}

// Detect homepage by body attribute
function isHomePage() {
  return document.body.dataset.page === "home";
}

// Save the current homepage variation in sessionStorage
function rememberHomePage() {
  if (isHomePage()) {
    var path = window.location.pathname;
    var file = path.substring(path.lastIndexOf("/") + 1) || "index.html";
    sessionStorage.setItem("homePageFile", file);
  }
}

// Get the remembered homepage variation (fallback: index.html)
function getRememberedHomePage() {
  return sessionStorage.getItem("homePageFile") || "index.html";
}

// Redirect back to the remembered homepage variation with hash
function redirectToRememberedHome(targetId) {
  var currentPath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/") + 1);
  var homeFile = getRememberedHomePage();
  window.location.href = currentPath + homeFile + targetId;
}

// Handle clicks for all internal section links
document.querySelectorAll('a[href^="#"]').forEach(function (link) {
  link.addEventListener("click", function (e) {
    var targetId = this.getAttribute("href");
    e.preventDefault();

    // If not on homepage, redirect back to remembered variation
    if (!isHomePage()) {
      redirectToRememberedHome(targetId);
      return;
    }

    // If already on homepage, smooth scroll
    smoothScrollTo(targetId);
  });
});

// On homepage load, remember which homepage this is
rememberHomePage();

// On homepage load, check if URL has hash and scroll smoothly
window.addEventListener("load", function () {
  if (isHomePage() && window.location.hash) {
    setTimeout(function () {
      smoothScrollTo(window.location.hash);
    }, 300); // delay so layout is ready
  }
});

/**
 * Tokemoji Market Dashboard
 */

// Mock data for Tokemoji tokens (moved outside DOMContentLoaded for global access)
var tokemojiData = [{
  emoji: "❤️",
  ticker: "LOVE",
  price: "$0.0042",
  change: "+12.5%",
  marketCap: "$2.1M",
  changeType: "positive"
}, {
  emoji: "🤬",
  ticker: "MAD",
  price: "$0.0038",
  change: "-8.2%",
  marketCap: "$1.9M",
  changeType: "negative"
}, {
  emoji: "🤯",
  ticker: "OMG",
  price: "$0.0055",
  change: "+25.3%",
  marketCap: "$2.8M",
  changeType: "positive"
}, {
  emoji: "😁",
  ticker: "HAPPY",
  price: "$0.0029",
  change: "+5.7%",
  marketCap: "$1.5M",
  changeType: "positive"
}, {
  emoji: "😔",
  ticker: "SAD",
  price: "$0.0018",
  change: "-15.4%",
  marketCap: "$0.9M",
  changeType: "negative"
}, {
  emoji: "😂",
  ticker: "LOL",
  price: "$0.0047",
  change: "+18.9%",
  marketCap: "$2.4M",
  changeType: "positive"
}, {
  emoji: "😈",
  ticker: "EVIL",
  price: "$0.0032",
  change: "-3.1%",
  marketCap: "$1.6M",
  changeType: "negative"
}, {
  emoji: "😇",
  ticker: "GOOD",
  price: "$0.0041",
  change: "+9.8%",
  marketCap: "$2.1M",
  changeType: "positive"
}, {
  emoji: "😱",
  ticker: "FEAR",
  price: "$0.0023",
  change: "-12.7%",
  marketCap: "$1.2M",
  changeType: "negative"
}, {
  emoji: "🤑",
  ticker: "GREED",
  price: "$0.0067",
  change: "+31.2%",
  marketCap: "$3.4M",
  changeType: "positive"
}, {
  emoji: "👍",
  ticker: "LIKE",
  price: "$0.0035",
  change: "+7.3%",
  marketCap: "$1.8M",
  changeType: "positive"
}, {
  emoji: "🔥",
  ticker: "HOT",
  price: "$0.0059",
  change: "+22.1%",
  marketCap: "$3.0M",
  changeType: "positive"
}, {
  emoji: "😡",
  ticker: "HATE",
  price: "$0.0021",
  change: "-9.5%",
  marketCap: "$1.1M",
  changeType: "negative"
}, {
  emoji: "🤔",
  ticker: "DOUBT",
  price: "$0.0027",
  change: "-1.8%",
  marketCap: "$1.4M",
  changeType: "negative"
}, {
  emoji: "🚀",
  ticker: "MOON",
  price: "$0.0078",
  change: "+45.6%",
  marketCap: "$3.9M",
  changeType: "positive"
}];

// Mock news data (moved outside DOMContentLoaded for global access)
var newsData = [{
  title: "GREED token surges 31% as market sentiment shifts",
  timestamp: "2m ago",
  emoji: "🤑"
}, {
  title: "MOON token reaches new ATH with 45% gains",
  timestamp: "5m ago",
  emoji: "🚀"
}, {
  title: "Market analysis: Fear & Greed index shows extreme greed",
  timestamp: "12m ago",
  emoji: "📊"
}, {
  title: "New Tokemoji protocol upgrade goes live",
  timestamp: "1h ago",
  emoji: "⚡"
}, {
  title: "Community votes on next emotion token launch",
  timestamp: "2h ago",
  emoji: "🗳️"
}, {
  title: "Technical analysis: LOVE vs HATE token battle",
  timestamp: "3h ago",
  emoji: "💕"
}, {
  title: "DeFi integration brings new utility to emotion tokens",
  timestamp: "5h ago",
  emoji: "🔗"
}, {
  title: "Market cap milestone: Tokemoji ecosystem hits $25M",
  timestamp: "8h ago",
  emoji: "🎉"
}];
document.addEventListener("DOMContentLoaded", function () {
  // Initialize dashboard
  function initTokemojiDashboard() {
    populateTokenList();
    populateNewsFeed();
    updateMarketDominance();
    updateGauges();
    initializeCarouselData();
    updateTopGainers();
    updateTopLosers();
    updateGlobalAdoption();
    startNewsRotation();
    setupSortButtons();

    // Start carousel intervals
    setInterval(updateTopGainers, 3000); // Every 3 seconds
    setInterval(updateTopLosers, 3000); // Every 3 seconds
  }

  // Current sort type
  var currentSortType = 'marketcap';

  // Populate token list
  function populateTokenList() {
    var tokenList = document.getElementById('token-list');
    if (!tokenList) return;

    // Sort tokens based on current sort type
    var sortedTokens = [].concat(tokemojiData);
    switch (currentSortType) {
      case 'marketcap':
        sortedTokens.sort(function (a, b) {
          var aCap = parseFloat(a.marketCap.replace('$', '').replace('M', ''));
          var bCap = parseFloat(b.marketCap.replace('$', '').replace('M', ''));
          return bCap - aCap;
        });
        break;
      case 'losers':
        sortedTokens.sort(function (a, b) {
          var aChange = parseFloat(a.change.replace('%', '').replace('+', ''));
          var bChange = parseFloat(b.change.replace('%', '').replace('+', ''));
          return aChange - bChange; // Most negative first
        });
        break;
      case 'gainers':
        sortedTokens.sort(function (a, b) {
          var aChange = parseFloat(a.change.replace('%', '').replace('+', ''));
          var bChange = parseFloat(b.change.replace('%', '').replace('+', ''));
          return bChange - aChange; // Most positive first
        });
        break;
    }
    tokenList.innerHTML = sortedTokens.map(function (token, index) {
      return "\n\t\t\t<div class=\"token-row d-flex align-items-center py-1 border-bottom border-light\" data-token=\"".concat(token.ticker, "\">\n\t\t\t\t<span class=\"token-rank me-2 fw-bold text-muted\" style=\"min-width: 20px; flex-shrink: 0;\">").concat(index + 1, "</span>\n\t\t\t\t<span class=\"token-emoji me-2\" style=\"flex-shrink: 0;\">").concat(token.emoji, "</span>\n\t\t\t\t<span class=\"token-ticker fw-bold text-heading me-2\" style=\"min-width: 60px; flex-shrink: 0;\">").concat(token.ticker, "</span>\n\t\t\t\t<span class=\"token-price text-muted me-2\" style=\"min-width: 70px; flex-shrink: 0;\">").concat(token.price, "</span>\n\t\t\t\t<span class=\"token-change ").concat(token.changeType === 'positive' ? 'text-success' : 'text-danger', " fw-bold me-2\" style=\"min-width: 60px; flex-shrink: 0;\">").concat(token.change, "</span>\n\t\t\t\t<span class=\"token-marketcap text-muted me-2\" style=\"min-width: 50px; flex-shrink: 0;\">").concat(token.marketCap, "</span>\n\t\t\t\t<button class=\"btn btn-sm btn-primary buy-btn me-1\" style=\"font-size: 0.7rem; padding: 0.2rem 0.5rem; flex-shrink: 0;\">BUY</button>\n\t\t\t\t<button class=\"btn btn-sm btn-outline-secondary chart-btn\" style=\"font-size: 0.7rem; padding: 0.2rem 0.5rem; flex-shrink: 0;\" data-token=\"").concat(token.ticker, "\">CHART</button>\n\t\t\t\t<div class=\"token-chart\" id=\"chart-").concat(token.ticker, "\" style=\"display: none; width: 100%; margin-top: 10px; padding: 10px; background: rgba(0,0,0,0.05); border-radius: 5px;\">\n\t\t\t\t\t<canvas id=\"chart-canvas-").concat(token.ticker, "\" width=\"300\" height=\"100\"></canvas>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t");
    }).join('');

    // Setup chart buttons after populating
    setupChartButtons();
  }

  // Populate news feed (single item)
  var currentNewsIndex = 0;
  function populateNewsFeed() {
    var newsFeed = document.getElementById('news-feed');
    if (!newsFeed) return;
    var currentNews = newsData[currentNewsIndex];
    newsFeed.innerHTML = "\n\t\t\t<div class=\"news-item-single text-center\">\n\t\t\t\t<div class=\"news-emoji mb-2\">\n\t\t\t\t\t<span class=\"fs-2\">".concat(currentNews.emoji, "</span>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"news-title fw-bold text-heading mb-2\" style=\"font-size: 1.3rem; line-height: 1.3;\">").concat(currentNews.title, "</div>\n\t\t\t\t<div class=\"news-timestamp text-muted\" style=\"font-size: 0.9rem;\">").concat(currentNews.timestamp, "</div>\n\t\t\t</div>\n\t\t");
  }

  // Rotate news every 5 seconds
  function startNewsRotation() {
    setInterval(function () {
      currentNewsIndex = (currentNewsIndex + 1) % newsData.length;
      populateNewsFeed();
    }, 5000);
  }

  // Update market dominance (shows #1 coin)
  function updateMarketDominance() {
    // Sort by market cap to get #1 coin
    var sortedTokens = [].concat(tokemojiData).sort(function (a, b) {
      var aCap = parseFloat(a.marketCap.replace('$', '').replace('M', ''));
      var bCap = parseFloat(b.marketCap.replace('$', '').replace('M', ''));
      return bCap - aCap;
    });
    var topToken = sortedTokens[0];
    var totalMarketCap = tokemojiData.reduce(function (sum, token) {
      return sum + parseFloat(token.marketCap.replace('$', '').replace('M', ''));
    }, 0);
    var topTokenMarketCap = parseFloat(topToken.marketCap.replace('$', '').replace('M', ''));
    var dominancePercentage = (topTokenMarketCap / totalMarketCap * 100).toFixed(1);

    // Update DOM elements
    var dominanceGifEl = document.getElementById('dominance-gif');
    var dominanceTickerEl = document.getElementById('dominance-ticker');
    var dominancePercentageEl = document.getElementById('dominance-percentage');
    var dominanceBarEl = document.getElementById('dominance-bar');

    // Map token tickers to GIF paths
    var tokenGifMap = {
      'LOVE': 'assets/img/Emojis/Love/Love emoji.gif',
      'MAD': 'assets/img/Emojis/Anger/Anger emoji.gif',
      'OMG': 'assets/img/Emojis/OMG/OMG emoji.gif',
      'HAPPY': 'assets/img/Emojis/Happy/Happy Emoji.gif',
      'SAD': 'assets/img/Emojis/SAD/Sad emoji.gif',
      'LOL': 'assets/img/Emojis/LOL/LOL Emoji.gif',
      'EVIL': 'assets/img/Emojis/Evil/Evil emoji.gif',
      'GOOD': 'assets/img/Emojis/Good/Good emoji.gif',
      'FEAR': 'assets/img/Emojis/Fear/Fear emoji.gif',
      'GREED': 'assets/img/Emojis/Greed/Greed emoji.gif',
      'LIKE': 'assets/img/Emojis/Like/Like with emoji.gif',
      'HOT': 'assets/img/Emojis/HOT/Hot emoji.gif',
      'HATE': 'assets/img/Emojis/Anger/Anger emoji.gif',
      'DOUBT': 'assets/img/Emojis/Doubt/Doubt emoji.gif',
      'MOON': 'assets/img/Emojis/Crown/Crown emoji.gif'
    };
    if (dominanceGifEl) {
      var gifPath = tokenGifMap[topToken.ticker] || 'assets/img/Emojis/Crown/Crown emoji.gif';
      dominanceGifEl.src = gifPath;
    }
    if (dominanceTickerEl) dominanceTickerEl.textContent = topToken.ticker;
    if (dominancePercentageEl) dominancePercentageEl.textContent = dominancePercentage + '%';
    if (dominanceBarEl) dominanceBarEl.style.width = dominancePercentage + '%';
  }

  // Setup sort buttons
  function setupSortButtons() {
    var sortButtons = document.querySelectorAll('.sort-btn');
    sortButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        // Remove active class from all buttons
        sortButtons.forEach(function (btn) {
          return btn.classList.remove('active');
        });
        // Add active class to clicked button
        button.classList.add('active');
        // Update sort type
        currentSortType = button.dataset.sort;
        // Repopulate token list
        populateTokenList();
      });
    });
  }

  // Update gauges
  function updateGauges() {
    // Calculate greed vs fear ratio
    var greedTokens = tokemojiData.filter(function (token) {
      return ['GREED', 'HAPPY', 'LOVE', 'MOON', 'HOT', 'LOL', 'GOOD', 'LIKE'].includes(token.ticker);
    });
    var fearTokens = tokemojiData.filter(function (token) {
      return ['FEAR', 'SAD', 'HATE', 'DOUBT', 'MAD'].includes(token.ticker);
    });
    var greedMarketCap = greedTokens.reduce(function (sum, token) {
      return sum + parseFloat(token.marketCap.replace('$', '').replace('M', ''));
    }, 0);
    var fearMarketCap = fearTokens.reduce(function (sum, token) {
      return sum + parseFloat(token.marketCap.replace('$', '').replace('M', ''));
    }, 0);
    var totalEmotionCap = greedMarketCap + fearMarketCap;
    var greedRatio = greedMarketCap / totalEmotionCap * 100;
    var greedOffset = 157.1 - greedRatio / 100 * 157.1;

    // Calculate good vs evil ratio
    var goodTokens = tokemojiData.filter(function (token) {
      return ['GOOD', 'LOVE', 'HAPPY', 'LIKE'].includes(token.ticker);
    });
    var evilTokens = tokemojiData.filter(function (token) {
      return ['EVIL', 'HATE', 'MAD'].includes(token.ticker);
    });
    var goodMarketCap = goodTokens.reduce(function (sum, token) {
      return sum + parseFloat(token.marketCap.replace('$', '').replace('M', ''));
    }, 0);
    var evilMarketCap = evilTokens.reduce(function (sum, token) {
      return sum + parseFloat(token.marketCap.replace('$', '').replace('M', ''));
    }, 0);
    var totalMoralCap = goodMarketCap + evilMarketCap;
    var goodRatio = goodMarketCap / totalMoralCap * 100;
    var goodOffset = 157.1 - goodRatio / 100 * 157.1;

    // Calculate love vs hate ratio
    var loveTokens = tokemojiData.filter(function (token) {
      return ['LOVE', 'HAPPY', 'LIKE'].includes(token.ticker);
    });
    var hateTokens = tokemojiData.filter(function (token) {
      return ['HATE', 'MAD', 'EVIL'].includes(token.ticker);
    });
    var loveMarketCap = loveTokens.reduce(function (sum, token) {
      return sum + parseFloat(token.marketCap.replace('$', '').replace('M', ''));
    }, 0);
    var hateMarketCap = hateTokens.reduce(function (sum, token) {
      return sum + parseFloat(token.marketCap.replace('$', '').replace('M', ''));
    }, 0);
    var totalLoveHateCap = loveMarketCap + hateMarketCap;
    var loveRatio = loveMarketCap / totalLoveHateCap * 100;
    var loveOffset = 157.1 - loveRatio / 100 * 157.1;

    // Update gauge animations
    var greedFearGauge = document.getElementById('greed-fear-gauge');
    var goodEvilGauge = document.getElementById('good-evil-gauge');
    var loveHateGauge = document.getElementById('love-hate-gauge');
    if (greedFearGauge) {
      greedFearGauge.style.strokeDashoffset = greedOffset;
    }
    if (goodEvilGauge) {
      goodEvilGauge.style.strokeDashoffset = goodOffset;
    }
    if (loveHateGauge) {
      loveHateGauge.style.strokeDashoffset = loveOffset;
    }

    // Update gauge result text
    var greedFearResult = document.getElementById('greed-fear-result');
    var goodEvilResult = document.getElementById('good-evil-result');
    var loveHateResult = document.getElementById('love-hate-result');
    if (greedFearResult) {
      var dominantEmotion = greedRatio > 50 ? 'GREED' : 'FEAR';
      var dominancePercent = Math.max(greedRatio, 100 - greedRatio);
      greedFearResult.querySelector('.gauge-ticker').textContent = dominantEmotion;
      greedFearResult.querySelector('.gauge-percentage').textContent = "".concat(dominancePercent.toFixed(0), "%");
    }
    if (goodEvilResult) {
      var _dominantEmotion = goodRatio > 50 ? 'GOOD' : 'EVIL';
      var _dominancePercent = Math.max(goodRatio, 100 - goodRatio);
      goodEvilResult.querySelector('.gauge-ticker').textContent = _dominantEmotion;
      goodEvilResult.querySelector('.gauge-percentage').textContent = "".concat(_dominancePercent.toFixed(0), "%");
    }
    if (loveHateResult) {
      var _dominantEmotion2 = loveRatio > 50 ? 'LOVE' : 'HATE';
      var _dominancePercent2 = Math.max(loveRatio, 100 - loveRatio);
      loveHateResult.querySelector('.gauge-ticker').textContent = _dominantEmotion2;
      loveHateResult.querySelector('.gauge-percentage').textContent = "".concat(_dominancePercent2.toFixed(0), "%");
    }
  }

  // Initialize dashboard when DOM is ready
  initTokemojiDashboard();

  // Initialize ticker news
  initTickerNews();

  // Initialize promo ticker
  initPromoTicker();

  // Initialize ticker with AI news content
  function initTickerNews() {
    var tickerList = document.getElementById('ticker-news-list');
    if (!tickerList) return;

    // Create ticker content with news and market data
    var tickerContent = [
    // Market indicators
    {
      type: 'icon',
      src: 'assets/img/icon-coin-1.png'
    }, {
      type: 'text',
      content: 'FEAR VS GREED INDEX',
      "class": 'text-secondary'
    }, {
      type: 'icon',
      src: 'assets/img/icon-coin-1.png'
    }, {
      type: 'text',
      content: 'GOOD VS EVIL METER',
      "class": 'text-primary'
    }, {
      type: 'icon',
      src: 'assets/img/icon-coin-2.png'
    },
    // AI News items
    {
      type: 'text',
      content: '📰 GREED token surges 31% as market sentiment shifts',
      "class": 'text-warning'
    }, {
      type: 'icon',
      src: 'assets/img/icon-coin-1.png'
    }, {
      type: 'text',
      content: '🚀 MOON token reaches new ATH with 45% gains',
      "class": 'text-success'
    }, {
      type: 'icon',
      src: 'assets/img/icon-coin-2.png'
    }, {
      type: 'text',
      content: '📊 Market analysis: Fear & Greed index shows extreme greed',
      "class": 'text-info'
    }, {
      type: 'icon',
      src: 'assets/img/icon-coin-1.png'
    }, {
      type: 'text',
      content: '⚡ New Tokemoji protocol upgrade goes live',
      "class": 'text-primary'
    }, {
      type: 'icon',
      src: 'assets/img/icon-coin-2.png'
    }, {
      type: 'text',
      content: '🗳️ Community votes on next emotion token launch',
      "class": 'text-secondary'
    }, {
      type: 'icon',
      src: 'assets/img/icon-coin-1.png'
    }, {
      type: 'text',
      content: '💕 Technical analysis: LOVE vs HATE token battle',
      "class": 'text-danger'
    }, {
      type: 'icon',
      src: 'assets/img/icon-coin-2.png'
    }, {
      type: 'text',
      content: '🔗 DeFi integration brings new utility to emotion tokens',
      "class": 'text-warning'
    }, {
      type: 'icon',
      src: 'assets/img/icon-coin-1.png'
    }, {
      type: 'text',
      content: '🎉 Market cap milestone: Tokemoji ecosystem hits $25M',
      "class": 'text-success'
    },
    // Repeat for continuous scrolling
    {
      type: 'icon',
      src: 'assets/img/icon-coin-1.png'
    }, {
      type: 'text',
      content: 'FEAR VS GREED INDEX',
      "class": 'text-secondary'
    }, {
      type: 'icon',
      src: 'assets/img/icon-coin-1.png'
    }, {
      type: 'text',
      content: 'GOOD VS EVIL METER',
      "class": 'text-primary'
    }, {
      type: 'icon',
      src: 'assets/img/icon-coin-2.png'
    }, {
      type: 'text',
      content: '📰 GREED token surges 31% as market sentiment shifts',
      "class": 'text-warning'
    }, {
      type: 'icon',
      src: 'assets/img/icon-coin-1.png'
    }, {
      type: 'text',
      content: '🚀 MOON token reaches new ATH with 45% gains',
      "class": 'text-success'
    }, {
      type: 'icon',
      src: 'assets/img/icon-coin-2.png'
    }, {
      type: 'text',
      content: '📊 Market analysis: Fear & Greed index shows extreme greed',
      "class": 'text-info'
    }, {
      type: 'icon',
      src: 'assets/img/icon-coin-1.png'
    }, {
      type: 'text',
      content: '⚡ New Tokemoji protocol upgrade goes live',
      "class": 'text-primary'
    }, {
      type: 'icon',
      src: 'assets/img/icon-coin-2.png'
    }, {
      type: 'text',
      content: '🗳️ Community votes on next emotion token launch',
      "class": 'text-secondary'
    }, {
      type: 'icon',
      src: 'assets/img/icon-coin-1.png'
    }, {
      type: 'text',
      content: '💕 Technical analysis: LOVE vs HATE token battle',
      "class": 'text-danger'
    }, {
      type: 'icon',
      src: 'assets/img/icon-coin-2.png'
    }, {
      type: 'text',
      content: '🔗 DeFi integration brings new utility to emotion tokens',
      "class": 'text-warning'
    }, {
      type: 'icon',
      src: 'assets/img/icon-coin-1.png'
    }, {
      type: 'text',
      content: '🎉 Market cap milestone: Tokemoji ecosystem hits $25M',
      "class": 'text-success'
    }];

    // Populate ticker list
    tickerList.innerHTML = tickerContent.map(function (item) {
      if (item.type === 'icon') {
        return "<li><img src=\"".concat(item.src, "\" alt=\"image\" class=\"img-fluid\" /></li>");
      } else {
        return "<li><h4 class=\"mb-0 ".concat(item["class"], " text-stroke text-shadow text-uppercase\">").concat(item.content, "</h4></li>");
      }
    }).join('');
  }

  // Initialize promo ticker with promotional information
  function initPromoTicker() {
    var promoList = document.getElementById('ticker-promo-list');
    if (!promoList) return;

    // Create promo ticker content
    var promoContent = [
    // Promo items
    {
      type: 'icon',
      src: 'assets/img/icon-coin-4.png'
    }, {
      type: 'text',
      content: 'GLOBAL EMOTION BAROMETER',
      "class": 'text-light'
    }, {
      type: 'icon',
      src: 'assets/img/icon-coin-4.png'
    }, {
      type: 'text',
      content: 'FEAR VS GREED INDEX',
      "class": 'text-primary text-stroke text-shadow'
    }, {
      type: 'icon',
      src: 'assets/img/icon-coin-4.png'
    }, {
      type: 'text',
      content: 'GOOD VS EVIL METER',
      "class": 'text-light'
    }, {
      type: 'icon',
      src: 'assets/img/icon-coin-4.png'
    }, {
      type: 'text',
      content: 'LIVE NEWS FEED',
      "class": 'text-primary text-stroke text-shadow'
    }, {
      type: 'icon',
      src: 'assets/img/icon-coin-4.png'
    }, {
      type: 'text',
      content: 'REAL-TIME EMOTION TRACKING',
      "class": 'text-light'
    }, {
      type: 'icon',
      src: 'assets/img/icon-coin-4.png'
    }, {
      type: 'text',
      content: 'MARKET SENTIMENT ANALYSIS',
      "class": 'text-primary text-stroke text-shadow'
    }, {
      type: 'icon',
      src: 'assets/img/icon-coin-4.png'
    }, {
      type: 'text',
      content: 'TOKEMOJI ECOSYSTEM',
      "class": 'text-light'
    }, {
      type: 'icon',
      src: 'assets/img/icon-coin-4.png'
    }, {
      type: 'text',
      content: 'EMOTION-BASED TRADING',
      "class": 'text-primary text-stroke text-shadow'
    },
    // Repeat for continuous scrolling
    {
      type: 'icon',
      src: 'assets/img/icon-coin-4.png'
    }, {
      type: 'text',
      content: 'GLOBAL EMOTION BAROMETER',
      "class": 'text-light'
    }, {
      type: 'icon',
      src: 'assets/img/icon-coin-4.png'
    }, {
      type: 'text',
      content: 'FEAR VS GREED INDEX',
      "class": 'text-primary text-stroke text-shadow'
    }, {
      type: 'icon',
      src: 'assets/img/icon-coin-4.png'
    }, {
      type: 'text',
      content: 'GOOD VS EVIL METER',
      "class": 'text-light'
    }, {
      type: 'icon',
      src: 'assets/img/icon-coin-4.png'
    }, {
      type: 'text',
      content: 'LIVE NEWS FEED',
      "class": 'text-primary text-stroke text-shadow'
    }, {
      type: 'icon',
      src: 'assets/img/icon-coin-4.png'
    }, {
      type: 'text',
      content: 'REAL-TIME EMOTION TRACKING',
      "class": 'text-light'
    }, {
      type: 'icon',
      src: 'assets/img/icon-coin-4.png'
    }, {
      type: 'text',
      content: 'MARKET SENTIMENT ANALYSIS',
      "class": 'text-primary text-stroke text-shadow'
    }, {
      type: 'icon',
      src: 'assets/img/icon-coin-4.png'
    }, {
      type: 'text',
      content: 'TOKEMOJI ECOSYSTEM',
      "class": 'text-light'
    }, {
      type: 'icon',
      src: 'assets/img/icon-coin-4.png'
    }, {
      type: 'text',
      content: 'EMOTION-BASED TRADING',
      "class": 'text-primary text-stroke text-shadow'
    }];

    // Populate promo ticker list
    promoList.innerHTML = promoContent.map(function (item) {
      if (item.type === 'icon') {
        return "<li><img src=\"".concat(item.src, "\" alt=\"image\" class=\"img-fluid\" /></li>");
      } else {
        return "<li><h4 class=\"mb-0 ".concat(item["class"], " text-uppercase\">").concat(item.content, "</h4></li>");
      }
    }).join('');
  }

  // Simulate real-time updates (optional)
  setInterval(function () {
    // Add some random fluctuation to prices
    tokemojiData.forEach(function (token) {
      var currentPrice = parseFloat(token.price.replace('$', ''));
      var fluctuation = (Math.random() - 0.5) * 0.0002; // ±0.0001
      var newPrice = Math.max(0.0001, currentPrice + fluctuation);
      token.price = '$' + newPrice.toFixed(4);

      // Update change percentage
      var changePercent = (Math.random() - 0.5) * 20; // ±10%
      token.change = (changePercent >= 0 ? '+' : '') + changePercent.toFixed(1) + '%';
      token.changeType = changePercent >= 0 ? 'positive' : 'negative';
    });

    // Re-populate with updated data
    populateTokenList();
    updateMarketDominance();
    updateGauges();
    initializeCarouselData(); // Reinitialize carousel data with new prices
    updateTopGainers();
    updateTopLosers();
    updateGlobalAdoption();

    // Add price change effects
    addPriceChangeEffects();
  }, 10000); // Update every 10 seconds

  // Setup chart buttons
  setupChartButtons();

  // Add price change effects
  function addPriceChangeEffects() {
    var tokenRows = document.querySelectorAll('.token-row');
    tokenRows.forEach(function (row) {
      var changeElement = row.querySelector('.token-change');
      if (!changeElement) return;
      var changeText = changeElement.textContent;
      var isPositive = changeText.includes('+');

      // Add flash effect
      if (isPositive) {
        row.style.backgroundColor = 'rgba(40, 167, 69, 0.2)';
        row.style.transition = 'background-color 0.3s ease';
        setTimeout(function () {
          row.style.backgroundColor = '';
        }, 1000);
      } else {
        row.style.backgroundColor = 'rgba(220, 53, 69, 0.2)';
        row.style.transition = 'background-color 0.3s ease';
        setTimeout(function () {
          row.style.backgroundColor = '';
        }, 1000);
      }
    });
  }

  // Setup chart buttons
  function setupChartButtons() {
    var chartButtons = document.querySelectorAll('.chart-btn');
    chartButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        var tokenTicker = this.dataset.token;
        var chartDiv = document.getElementById("chart-".concat(tokenTicker));
        var canvas = document.getElementById("chart-canvas-".concat(tokenTicker));
        if (chartDiv.style.display === 'none') {
          // Show chart
          chartDiv.style.display = 'block';
          chartDiv.style.maxHeight = '0';
          chartDiv.style.overflow = 'hidden';
          chartDiv.style.transition = 'max-height 0.5s ease-out';

          // Animate roll down
          setTimeout(function () {
            chartDiv.style.maxHeight = '150px';
          }, 10);

          // Draw chart
          drawSimpleChart(canvas, tokenTicker);
        } else {
          // Hide chart
          chartDiv.style.maxHeight = '0';
          setTimeout(function () {
            chartDiv.style.display = 'none';
          }, 500);
        }
      });
    });
  }

  // Draw simple chart
  function drawSimpleChart(canvas, tokenTicker) {
    var ctx = canvas.getContext('2d');
    var width = canvas.width;
    var height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Generate mock price data
    var dataPoints = 20;
    var prices = [];
    var basePrice = Math.random() * 0.01 + 0.001; // Random base price

    for (var i = 0; i < dataPoints; i++) {
      var variation = (Math.random() - 0.5) * 0.002;
      prices.push(basePrice + variation);
    }

    // Find min and max for scaling
    var minPrice = Math.min.apply(Math, prices);
    var maxPrice = Math.max.apply(Math, prices);
    var priceRange = maxPrice - minPrice;

    // Draw grid
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;

    // Horizontal lines
    for (var _i = 0; _i <= 4; _i++) {
      var y = height / 4 * _i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Vertical lines
    for (var _i2 = 0; _i2 <= 4; _i2++) {
      var x = width / 4 * _i2;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Draw price line
    ctx.strokeStyle = '#0d6efd';
    ctx.lineWidth = 2;
    ctx.beginPath();
    prices.forEach(function (price, index) {
      var x = width / (dataPoints - 1) * index;
      var y = height - (price - minPrice) / priceRange * height;
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw data points
    ctx.fillStyle = '#0d6efd';
    prices.forEach(function (price, index) {
      var x = width / (dataPoints - 1) * index;
      var y = height - (price - minPrice) / priceRange * height;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Add price labels
    ctx.fillStyle = '#666';
    ctx.font = '10px Arial';
    ctx.textAlign = 'left';
    ctx.fillText("Min: $".concat(minPrice.toFixed(4)), 5, height - 5);
    ctx.textAlign = 'right';
    ctx.fillText("Max: $".concat(maxPrice.toFixed(4)), width - 5, 15);
  }

  // Carousel data for gainers and losers
  var gainersCarouselData = [];
  var losersCarouselData = [];
  var gainersCurrentIndex = 0;
  var losersCurrentIndex = 0;

  // Initialize carousel data
  function initializeCarouselData() {
    var gainers = tokemojiData.filter(function (token) {
      return token.changeType === 'positive';
    });
    var losers = tokemojiData.filter(function (token) {
      return token.changeType === 'negative';
    });

    // Sort and store all gainers
    gainersCarouselData = gainers.sort(function (a, b) {
      var aChange = parseFloat(a.change.replace('%', '').replace('+', ''));
      var bChange = parseFloat(b.change.replace('%', '').replace('+', ''));
      return bChange - aChange;
    });

    // Sort and store all losers
    losersCarouselData = losers.sort(function (a, b) {
      var aChange = parseFloat(a.change.replace('%', '').replace('+', ''));
      var bChange = parseFloat(b.change.replace('%', '').replace('+', ''));
      return aChange - bChange; // Most negative first
    });
  }

  // Update Top Gainers Widget with carousel
  function updateTopGainers() {
    if (gainersCarouselData.length === 0) return;

    // Map token tickers to GIF paths
    var tokenGifMap = {
      'LOVE': 'assets/img/Emojis/Love/Love emoji.gif',
      'MAD': 'assets/img/Emojis/Anger/Anger emoji.gif',
      'OMG': 'assets/img/Emojis/OMG/OMG emoji.gif',
      'HAPPY': 'assets/img/Emojis/Happy/Happy Emoji.gif',
      'SAD': 'assets/img/Emojis/SAD/Sad emoji.gif',
      'LOL': 'assets/img/Emojis/LOL/LOL Emoji.gif',
      'EVIL': 'assets/img/Emojis/Evil/Evil emoji.gif',
      'GOOD': 'assets/img/Emojis/Good/Good emoji.gif',
      'FEAR': 'assets/img/Emojis/Fear/Fear emoji.gif',
      'GREED': 'assets/img/Emojis/Greed/Greed emoji.gif',
      'LIKE': 'assets/img/Emojis/Like/Like with emoji.gif',
      'HOT': 'assets/img/Emojis/HOT/Hot emoji.gif',
      'HATE': 'assets/img/Emojis/Anger/Anger emoji.gif',
      'DOUBT': 'assets/img/Emojis/Doubt/Doubt emoji.gif',
      'MOON': 'assets/img/Emojis/Crown/Crown emoji.gif'
    };

    // Get current set of 3 tokens (with wrapping)
    var currentSet = [gainersCarouselData[(gainersCurrentIndex - 1 + gainersCarouselData.length) % gainersCarouselData.length], gainersCarouselData[gainersCurrentIndex], gainersCarouselData[(gainersCurrentIndex + 1) % gainersCarouselData.length]];

    // Update GIFs
    var leftGif = document.getElementById('top-gainer-gif-left');
    var centerGif = document.getElementById('top-gainer-gif-center');
    var rightGif = document.getElementById('top-gainer-gif-right');
    if (leftGif && currentSet[0]) {
      var gifPath = tokenGifMap[currentSet[0].ticker] || 'assets/img/Emojis/HOT/Hot emoji.gif';
      leftGif.src = gifPath;
    }
    if (centerGif && currentSet[1]) {
      var _gifPath = tokenGifMap[currentSet[1].ticker] || 'assets/img/Emojis/HOT/Hot emoji.gif';
      centerGif.src = _gifPath;
    }
    if (rightGif && currentSet[2]) {
      var _gifPath2 = tokenGifMap[currentSet[2].ticker] || 'assets/img/Emojis/HOT/Hot emoji.gif';
      rightGif.src = _gifPath2;
    }

    // Update ticker and change for the center (current) token
    var topGainerTickerEl = document.getElementById('top-gainer-ticker');
    var topGainerChangeEl = document.getElementById('top-gainer-change');
    if (topGainerTickerEl && currentSet[1]) topGainerTickerEl.textContent = currentSet[1].ticker;
    if (topGainerChangeEl && currentSet[1]) topGainerChangeEl.textContent = currentSet[1].change;

    // Move to next index
    gainersCurrentIndex = (gainersCurrentIndex + 1) % gainersCarouselData.length;
  }

  // Update Top Losers Widget with carousel
  function updateTopLosers() {
    if (losersCarouselData.length === 0) return;

    // Map token tickers to GIF paths
    var tokenGifMap = {
      'LOVE': 'assets/img/Emojis/Love/Love emoji.gif',
      'MAD': 'assets/img/Emojis/Anger/Anger emoji.gif',
      'OMG': 'assets/img/Emojis/OMG/OMG emoji.gif',
      'HAPPY': 'assets/img/Emojis/Happy/Happy Emoji.gif',
      'SAD': 'assets/img/Emojis/SAD/Sad emoji.gif',
      'LOL': 'assets/img/Emojis/LOL/LOL Emoji.gif',
      'EVIL': 'assets/img/Emojis/Evil/Evil emoji.gif',
      'GOOD': 'assets/img/Emojis/Good/Good emoji.gif',
      'FEAR': 'assets/img/Emojis/Fear/Fear emoji.gif',
      'GREED': 'assets/img/Emojis/Greed/Greed emoji.gif',
      'LIKE': 'assets/img/Emojis/Like/Like with emoji.gif',
      'HOT': 'assets/img/Emojis/HOT/Hot emoji.gif',
      'HATE': 'assets/img/Emojis/Anger/Anger emoji.gif',
      'DOUBT': 'assets/img/Emojis/Doubt/Doubt emoji.gif',
      'MOON': 'assets/img/Emojis/Crown/Crown emoji.gif'
    };

    // Get current set of 3 tokens (with wrapping)
    var currentSet = [losersCarouselData[(losersCurrentIndex - 1 + losersCarouselData.length) % losersCarouselData.length], losersCarouselData[losersCurrentIndex], losersCarouselData[(losersCurrentIndex + 1) % losersCarouselData.length]];

    // Update GIFs
    var leftGif = document.getElementById('top-loser-gif-left');
    var centerGif = document.getElementById('top-loser-gif-center');
    var rightGif = document.getElementById('top-loser-gif-right');
    if (leftGif && currentSet[0]) {
      var gifPath = tokenGifMap[currentSet[0].ticker] || 'assets/img/Emojis/SAD/Sad emoji.gif';
      leftGif.src = gifPath;
    }
    if (centerGif && currentSet[1]) {
      var _gifPath3 = tokenGifMap[currentSet[1].ticker] || 'assets/img/Emojis/SAD/Sad emoji.gif';
      centerGif.src = _gifPath3;
    }
    if (rightGif && currentSet[2]) {
      var _gifPath4 = tokenGifMap[currentSet[2].ticker] || 'assets/img/Emojis/SAD/Sad emoji.gif';
      rightGif.src = _gifPath4;
    }

    // Update ticker and change for the center (current) token
    var topLoserTickerEl = document.getElementById('top-loser-ticker');
    var topLoserChangeEl = document.getElementById('top-loser-change');
    if (topLoserTickerEl && currentSet[1]) topLoserTickerEl.textContent = currentSet[1].ticker;
    if (topLoserChangeEl && currentSet[1]) topLoserChangeEl.textContent = currentSet[1].change;

    // Move to next index
    losersCurrentIndex = (losersCurrentIndex + 1) % losersCarouselData.length;
  }

  // Update Global Adoption Meter
  function updateGlobalAdoption() {
    // Mock data - in the future this will be real blockchain data
    var mockAdoptionPercentage = Math.random() * 5 + 1; // 1-6%

    var adoptionPercentageEl = document.getElementById('adoption-percentage');
    var adoptionBarEl = document.getElementById('adoption-bar');
    if (adoptionPercentageEl) {
      adoptionPercentageEl.textContent = mockAdoptionPercentage.toFixed(1) + '%';
    }
    if (adoptionBarEl) {
      adoptionBarEl.style.width = mockAdoptionPercentage.toFixed(1) + '%';
    }
  }

  // Contract Copy Functionality
  function initContractCopy() {
    var contractSelect = document.getElementById('contract-select');
    var contractAddress = document.getElementById('contract-address');
    var copyBtn = document.getElementById('copy-contract-btn');
    var solscanBtn = document.getElementById('solscan-btn');
    if (!contractSelect || !contractAddress || !copyBtn || !solscanBtn) return;

    // Update contract address when selection changes
    contractSelect.addEventListener('change', function () {
      contractAddress.value = this.value;
      if (this.value) {
        solscanBtn.style.display = 'inline-block';
        // Update button text with emoji instead of token name
        var selectedText = this.options[this.selectedIndex].text;
        var emoji = selectedText.split(' ')[0]; // Extract emoji (e.g., "😀")
        solscanBtn.innerHTML = "<iconify-icon icon=\"ri:external-link-line\"></iconify-icon> Check ".concat(emoji, " on Solscan");
      } else {
        solscanBtn.style.display = 'none';
      }
    });

    // Copy to clipboard functionality
    copyBtn.addEventListener('click', function () {
      if (contractAddress.value) {
        navigator.clipboard.writeText(contractAddress.value).then(function () {
          // Visual feedback
          var originalIcon = copyBtn.innerHTML;
          copyBtn.innerHTML = '<iconify-icon icon="ri:check-line"></iconify-icon>';
          copyBtn.classList.add('btn-success');
          copyBtn.classList.remove('btn-light');
          setTimeout(function () {
            copyBtn.innerHTML = originalIcon;
            copyBtn.classList.remove('btn-success');
            copyBtn.classList.add('btn-light');
          }, 2000);
        })["catch"](function (err) {
          console.error('Failed to copy: ', err);
          // Fallback for older browsers
          contractAddress.select();
          document.execCommand('copy');
        });
      }
    });

    // Solscan button functionality
    solscanBtn.addEventListener('click', function () {
      if (contractAddress.value) {
        var solscanUrl = "https://solscan.io/token/".concat(contractAddress.value);
        window.open(solscanUrl, '_blank');
      }
    });
  }

  // Initialize contract copy functionality
  initContractCopy();

  // ========================================
  // Alt Market — Pump.fun Live Test
  // ========================================

  // Alt Market Configuration
  var MORALIS_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImFkNzYxZjgyLTUwMTYtNDQ5OS04MzRjLWI4OTNjMDI0MjIzOSIsIm9yZ0lkIjoiNDc0MjcxIiwidXNlcklkIjoiNDg3OTAyIiwidHlwZUlkIjoiZjA5YzRiODItYzlmYi00MmU3LWE1MjUtZDQyOTAzZjNjMzQ2IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3NTk2ODI1MjgsImV4cCI6NDkxNTQ0MjUyOH0.jc9g3IvglMRPRXkw8YdGesMxzvwEvw5X1mY6jb23BgI";
  var MINTS = ["J2eaKn35rp82T6RFEsNK9CLRHEKV9BLXjedFM3q6pump", "H8xQ6poBjB9DTPMDTKWzWPrnxu4bDEhybxiouF8Ppump", "E7x954J5CUmFQBJvZGvi8FbS3XDWxG7Gyc7eJSEpump", "9tTRFq88NeZFpD2DcSZDMEvkvHtLivBeYd1w5Chfpump", "AK9yVoXKK1Cjww7HDyjYNyW5FujD3FJ2xbjMUStspump"];

  // Alt Market Token Data
  var altTokenData = [];
  var previousTokenData = []; // Store previous prices for change calculation

  // Fetch token price from Moralis
  function fetchTokenPrice(_x) {
    return _fetchTokenPrice.apply(this, arguments);
  } // Calculate price change percentage
  function _fetchTokenPrice() {
    _fetchTokenPrice = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(mint) {
      var response, data;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return fetch("https://solana-gateway.moralis.io/token/mainnet/".concat(mint, "/price"), {
              headers: {
                "X-API-Key": MORALIS_API_KEY
              }
            });
          case 3:
            response = _context.sent;
            if (response.ok) {
              _context.next = 6;
              break;
            }
            throw new Error("HTTP error! status: ".concat(response.status));
          case 6:
            _context.next = 8;
            return response.json();
          case 8:
            data = _context.sent;
            return _context.abrupt("return", data);
          case 12:
            _context.prev = 12;
            _context.t0 = _context["catch"](0);
            console.error("Error fetching price for ".concat(mint, ":"), _context.t0);
            return _context.abrupt("return", null);
          case 16:
          case "end":
            return _context.stop();
        }
      }, _callee, null, [[0, 12]]);
    }));
    return _fetchTokenPrice.apply(this, arguments);
  }
  function calculatePriceChange(currentPrice, previousPrice) {
    if (!previousPrice || previousPrice === 0) return 0;
    return (currentPrice - previousPrice) / previousPrice * 100;
  }

  // Get price change indicator class
  function getPriceChangeClass(change) {
    if (change > 0) return 'bg-success-subtle border-success';
    if (change < 0) return 'bg-danger-subtle border-danger';
    return 'bg-light border-dark';
  }

  // Get price change text color
  function getPriceChangeTextColor(change) {
    if (change > 0) return 'text-success';
    if (change < 0) return 'text-danger';
    return 'text-muted';
  }

  // Generate token name from mint (simplified)
  function getTokenName(mint) {
    var names = ["PUMP1", "PUMP2", "PUMP3", "PUMP4", "PUMP5"];
    var index = MINTS.indexOf(mint);
    return names[index] || "UNKNOWN";
  }

  // Generate emoji for token
  function getTokenEmoji(mint) {
    var emojis = ["🚀", "💎", "🔥", "⭐", "🌙"];
    var index = MINTS.indexOf(mint);
    return emojis[index] || "💰";
  }

  // Format market cap
  function formatMarketCap(price) {
    var supply = 1000000000; // 1B supply
    var marketCap = price * supply;
    if (marketCap >= 1000000) {
      return "$".concat((marketCap / 1000000).toFixed(2), "M");
    } else if (marketCap >= 1000) {
      return "$".concat((marketCap / 1000).toFixed(2), "K");
    } else {
      return "$".concat(marketCap.toFixed(2));
    }
  }

  // Format price
  function formatPrice(price) {
    if (price >= 1) {
      return "$".concat(price.toFixed(4));
    } else if (price >= 0.01) {
      return "$".concat(price.toFixed(6));
    } else {
      return "$".concat(price.toExponential(2));
    }
  }

  // Update alt market tokens
  function updateAltMarketTokens() {
    return _updateAltMarketTokens.apply(this, arguments);
  } // Initialize alt market
  function _updateAltMarketTokens() {
    _updateAltMarketTokens = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
      var spinner, tokenList, promises, results, newTokenData;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            spinner = document.getElementById('alt-market-spinner');
            tokenList = document.getElementById('alt-token-list');
            if (spinner) spinner.style.display = 'inline-block';
            _context3.prev = 3;
            promises = MINTS.map(/*#__PURE__*/function () {
              var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(mint) {
                var priceData, previousData, previousPrice, priceChange;
                return _regeneratorRuntime().wrap(function _callee2$(_context2) {
                  while (1) switch (_context2.prev = _context2.next) {
                    case 0:
                      _context2.next = 2;
                      return fetchTokenPrice(mint);
                    case 2:
                      priceData = _context2.sent;
                      if (!(priceData && priceData.usdPrice)) {
                        _context2.next = 8;
                        break;
                      }
                      // Find previous data for this mint
                      previousData = previousTokenData.find(function (p) {
                        return p.mint === mint;
                      });
                      previousPrice = previousData ? previousData.price : null; // Calculate price changes
                      priceChange = calculatePriceChange(priceData.usdPrice, previousPrice);
                      return _context2.abrupt("return", {
                        mint: mint,
                        name: getTokenName(mint),
                        emoji: getTokenEmoji(mint),
                        price: priceData.usdPrice,
                        previousPrice: previousPrice,
                        priceChange: priceChange,
                        marketCap: formatMarketCap(priceData.usdPrice),
                        change1h: 'N/A',
                        // Moralis doesn't provide 1h change in this endpoint
                        change24h: 'N/A' // Moralis doesn't provide 24h change in this endpoint
                      });
                    case 8:
                      return _context2.abrupt("return", null);
                    case 9:
                    case "end":
                      return _context2.stop();
                  }
                }, _callee2);
              }));
              return function (_x2) {
                return _ref3.apply(this, arguments);
              };
            }());
            _context3.next = 7;
            return Promise.all(promises);
          case 7:
            results = _context3.sent;
            newTokenData = results.filter(function (token) {
              return token !== null;
            }); // Store current data as previous for next update
            previousTokenData = _toConsumableArray(newTokenData);

            // Sort by market cap (descending)
            newTokenData.sort(function (a, b) {
              var aCap = parseFloat(a.marketCap.replace(/[$,]/g, ''));
              var bCap = parseFloat(b.marketCap.replace(/[$,]/g, ''));
              return bCap - aCap;
            });
            altTokenData = newTokenData;

            // Update DOM
            if (tokenList) {
              tokenList.innerHTML = altTokenData.map(function (token, index) {
                var priceChangeClass = getPriceChangeClass(token.priceChange);
                var priceChangeTextColor = getPriceChangeTextColor(token.priceChange);
                var priceChangeText = token.previousPrice ? "".concat(token.priceChange > 0 ? '+' : '').concat(token.priceChange.toFixed(2), "%") : 'NEW';
                return "\n\t\t\t\t\t<div class=\"token-row d-flex align-items-center justify-content-between p-3 border-bottom border-dark ".concat(priceChangeClass, "\">\n\t\t\t\t\t\t<div class=\"d-flex align-items-center gap-3\">\n\t\t\t\t\t\t\t<span class=\"rank text-muted fw-bold\">").concat(index + 1, "</span>\n\t\t\t\t\t\t\t<span class=\"emoji fs-4\">").concat(token.emoji, "</span>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<div class=\"ticker fw-bold text-heading\">").concat(token.name, "</div>\n\t\t\t\t\t\t\t\t<div class=\"mint text-muted small\">").concat(token.mint.substring(0, 8), "...</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"d-flex align-items-center gap-4\">\n\t\t\t\t\t\t\t<div class=\"text-end\">\n\t\t\t\t\t\t\t\t<div class=\"price fw-bold text-heading\">").concat(formatPrice(token.price), "</div>\n\t\t\t\t\t\t\t\t<div class=\"d-flex gap-3 small\">\n\t\t\t\t\t\t\t\t\t<span class=\"text-muted\">1h: ").concat(token.change1h, "</span>\n\t\t\t\t\t\t\t\t\t<span class=\"text-muted\">24h: ").concat(token.change24h, "</span>\n\t\t\t\t\t\t\t\t\t<span class=\"text-muted\">Mkt Cap: ").concat(token.marketCap, "</span>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class=\"price-change ").concat(priceChangeTextColor, " fw-bold small\">\n\t\t\t\t\t\t\t\t\t").concat(priceChangeText, "\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<a href=\"https://pump.fun/").concat(token.mint, "\" target=\"_blank\" class=\"btn btn-sm btn-primary\">\n\t\t\t\t\t\t\t\tOpen on Pump.fun\n\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t");
              }).join('');
            }
            _context3.next = 19;
            break;
          case 15:
            _context3.prev = 15;
            _context3.t0 = _context3["catch"](3);
            console.error('Error updating alt market tokens:', _context3.t0);
            if (tokenList) {
              tokenList.innerHTML = '<div class="text-center p-4 text-muted">Error loading token data. Please try again later.</div>';
            }
          case 19:
            _context3.prev = 19;
            if (spinner) spinner.style.display = 'none';
            return _context3.finish(19);
          case 22:
          case "end":
            return _context3.stop();
        }
      }, _callee3, null, [[3, 15, 19, 22]]);
    }));
    return _updateAltMarketTokens.apply(this, arguments);
  }
  function initAltMarket() {
    // Initial load
    updateAltMarketTokens();

    // Update every 5 seconds
    setInterval(updateAltMarketTokens, 5000);
  }

  // Initialize alt market functionality
  initAltMarket();
}); // End of DOMContentLoaded event listener