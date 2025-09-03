// ------------------------------------------------------------ //
// -----------------------  SPLIT TEXT  ----------------------- //

document.addEventListener("DOMContentLoaded", (event)=>{

    const st = SplitText.create(".splt");
  
    const tl = gsap
      .timeline()
      .from(st.chars, {
        duration: 1.2,
        opacity: 0,
        ease: "power1.inOut",
        stagger: { from: "center", each: 0.04 }
      })
      .from(
        st.words,
        {
          duration: 3,
          y: (i) => i * 100 - 50,
          ease: "expo"
        },
        0
      );
  
    window.onclick = () => tl.play(0); // click to replay
  });


  // ----------------------------------------------------------------//
// -----------------------   Stamp Circle  ----------------------- //

"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

var hoverButton;
var hoverTL;
var HoverButton = /*#__PURE__*/_createClass(function HoverButton(id) {
  var _this = this;
  _classCallCheck(this, HoverButton);
  _defineProperty(this, "onMouseEnter", function () {
    _this.hoverInAnim();
  });
  _defineProperty(this, "hoverInAnim", function () {
    if (!_this.hovered) {
      _this.hovered = true;
      _this.animatingHover = true;
      _this.forceOut = false;
      TweenMax.fromTo(_this.bg, _this.timing, {
        x: "-112%"
      }, {
        x: "-12%",
        ease: Power3.easeOut,
        onComplete: function onComplete() {
          _this.animatingHover = false;
          if (_this.forceOut) {
            _this.foceOut = false;
            _this.hoverOutAnim();
          }
        }
      });
    }
  });
  _defineProperty(this, "onMouseLeave", function () {
    if (!_this.animatingHover) {
      _this.hoverOutAnim();
    } else {
      _this.forceOut = true;
    }
  });
  _defineProperty(this, "hoverOutAnim", function () {
    _this.hovered = false;
    TweenMax.to(_this.bg, _this.timing, {
      x: "100%",
      ease: Power3.easeOut,
      onComplete: function onComplete() {}
    });
  });
  this.hovered = false;
  this.animatingHover = false;
  this.forceOut = false;
  this.timing = 0.65;
  this.el = document.getElementById(id);
  this.bg = this.el.getElementsByClassName("bg")[0];
  this.el.addEventListener("mouseenter", this.onMouseEnter);
  this.el.addEventListener("mouseleave", this.onMouseLeave);
});
var Dot = /*#__PURE__*/function () {
  function Dot() {
    var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    _classCallCheck(this, Dot);
    this.index = index;
    this.anglespeed = 0.05;
    this.x = 0;
    this.y = 0;
    this.scale = 1 - 0.05 * index;
    this.range = width / 2 - width / 2 * this.scale + 2;
    this.limit = width * 0.75 * this.scale;
    this.element = document.createElement("span");
    TweenMax.set(this.element, {
      scale: this.scale
    });
    cursor.appendChild(this.element);
  }
  return _createClass(Dot, [{
    key: "lock",
    value: function lock() {
      this.lockX = this.x;
      this.lockY = this.y;
      this.angleX = Math.PI * 2 * Math.random();
      this.angleY = Math.PI * 2 * Math.random();
    }
  }, {
    key: "draw",
    value: function draw(delta) {
      if (!idle || this.index <= sineDots) {
        TweenMax.set(this.element, {
          x: this.x,
          y: this.y
        });
      } else {
        this.angleX += this.anglespeed;
        this.angleY += this.anglespeed;
        this.y = this.lockY + Math.sin(this.angleY) * this.range;
        this.x = this.lockX + Math.sin(this.angleX) * this.range;
        TweenMax.set(this.element, {
          x: this.x,
          y: this.y
        });
      }
    }
  }]);
}();
var Circle = /*#__PURE__*/_createClass(function Circle(id) {
  _classCallCheck(this, Circle);
  var el = document.getElementById(id);
  var parent = el.parentElement;
  parent.removeChild(el);
  var chars = el.innerText.split("");
  chars.push(" ");
  for (var i = 0; i < chars.length; i++) {
    var span = document.createElement("span");
    span.innerText = chars[i];
    span.className = "char".concat(i + 1);
    parent.appendChild(span);
  }
});
function init() {
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("touchmove", onTouchMove);
  hoverButton = new HoverButton("button");
  // eslint-disable-next-line no-new
  new Circle("circle-content");
  lastFrame += new Date();
  buildDots();
  _render();
}

/*function limit(value, min, max) {
    return Math.min(Math.max(min, value), max);
}*/

function startIdleTimer() {
  timeoutID = setTimeout(goInactive, idleTimeout);
  idle = false;
}

var onMouseMove = function onMouseMove(event) {
  mousePosition.x = event.clientX - width / 2;
  mousePosition.y = event.clientY - width / 2;
  resetIdleTimer();
};
var onTouchMove = function onTouchMove() {
  mousePosition.x = event.touches[0].clientX - width / 2;
  mousePosition.y = event.touches[0].clientY - width / 2;
  resetIdleTimer();
};


init();


