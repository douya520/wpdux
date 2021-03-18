window.console || (window.console = {
    log: function() {}
}),
function(t) {
    var e = window.Chicago || {
        utils: {
            now: Date.now ||
            function() {
                return (new Date).getTime()
            },
            uid: function(t) {
                return (t || "id") + e.utils.now() + "RAND" + Math.ceil(1e5 * Math.random())
            },
            is: {
                number: function(t) {
                    return ! isNaN(parseFloat(t)) && isFinite(t)
                },
                fn: function(t) {
                    return "function" == typeof t
                },
                object: function(t) {
                    return "[object Object]" === Object.prototype.toString.call(t)
                }
            },
            debounce: function(t, e, i) {
                var r;
                return function() {
                    var n = this,
                    a = arguments,
                    o = i && !r;
                    r && clearTimeout(r),
                    r = setTimeout(function() {
                        r = null,
                        i || t.apply(n, a)
                    },
                    e),
                    o && t.apply(n, a)
                }
            }
        },
        $: window.jQuery || null
    };
    if ("function" == typeof define && define.amd && define("chicago",
    function() {
        return e.load = function(t, i, r, n) {
            var a = t.split(","),
            o = [],
            s = (n.config && n.config.chicago && n.config.chicago.base ? n.config.chicago.base: "").replace(/\/+$/g, "");
            if (!s) throw new Error("Please define base path to jQuery resize.end in the requirejs config.");
            for (var l = 0; l < a.length;) {
                var u = a[l].replace(/\./g, "/");
                o.push(s + "/" + u),
                l += 1
            }
            i(o,
            function() {
                r(e)
            })
        },
        e
    }), window && window.jQuery) return function(t, e, i) {
        t.$win = t.$(e),
        t.$doc = t.$(i),
        t.events || (t.events = {}),
        t.events.resizeend = {
            defaults: {
                delay: 250
            },
            setup: function() {
                var e = arguments,
                i = {
                    delay: t.$.event.special.resizeend.defaults.delay
                };
                t.utils.is.fn(e[0]) ? e[0] : t.utils.is.number(e[0]) ? i.delay = e[0] : t.utils.is.object(e[0]) && (i = t.$.extend({},
                i, e[0]));
                var r = t.utils.uid("resizeend"),
                n = t.$.extend({
                    delay: t.$.event.special.resizeend.defaults.delay
                },
                i),
                a = n,
                o = function(e) {
                    a && clearTimeout(a),
                    a = setTimeout(function() {
                        return a = null,
                        e.type = "resizeend.chicago.dom",
                        t.$(e.target).trigger("resizeend", e)
                    },
                    n.delay)
                };
                return t.$(this).data("chicago.event.resizeend.uid", r),
                t.$(this).on("resize", t.utils.debounce(o, 100)).data(r, o)
            },
            teardown: function() {
                var e = t.$(this).data("chicago.event.resizeend.uid");
                return t.$(this).off("resize", t.$(this).data(e)),
                t.$(this).removeData(e),
                t.$(this).removeData("chicago.event.resizeend.uid")
            }
        },
        t.$.event.special.resizeend = t.events.resizeend,
        t.$.fn.resizeend = function(e, i) {
            return this.each(function() {
                t.$(this).on("resizeend", e, i)
            })
        }
    } (e, window, window.document);
    if (!window.jQuery) throw new Error("jQuery resize.end requires jQuery")
} (),
function(t) {
    t.fn.qrcode = function(e) {
        function i(t) {
            this.mode = s,
            this.data = t
        }
        function r(t, e) {
            this.typeNumber = t,
            this.errorCorrectLevel = e,
            this.modules = null,
            this.moduleCount = 0,
            this.dataCache = null,
            this.dataList = []
        }
        function n(t, e) {
            if (void 0 == t.length) throw Error(t.length + "/" + e);
            for (var i = 0; i < t.length && 0 == t[i];) i++;
            this.num = Array(t.length - i + e);
            for (var r = 0; r < t.length - i; r++) this.num[r] = t[r + i]
        }
        function a(t, e) {
            this.totalCount = t,
            this.dataCount = e
        }
        function o() {
            this.buffer = [],
            this.length = 0
        }
        var s;
        i.prototype = {
            getLength: function() {
                return this.data.length
            },
            write: function(t) {
                for (var e = 0; e < this.data.length; e++) t.put(this.data.charCodeAt(e), 8)
            }
        },
        r.prototype = {
            addData: function(t) {
                this.dataList.push(new i(t)),
                this.dataCache = null
            },
            isDark: function(t, e) {
                if (0 > t || this.moduleCount <= t || 0 > e || this.moduleCount <= e) throw Error(t + "," + e);
                return this.modules[t][e]
            },
            getModuleCount: function() {
                return this.moduleCount
            },
            make: function() {
                if (1 > this.typeNumber) {
                    for (var t = 1,
                    t = 1; 40 > t; t++) {
                        for (var e = a.getRSBlocks(t, this.errorCorrectLevel), i = new o, r = 0, n = 0; n < e.length; n++) r += e[n].dataCount;
                        for (n = 0; n < this.dataList.length; n++) e = this.dataList[n],
                        i.put(e.mode, 4),
                        i.put(e.getLength(), l.getLengthInBits(e.mode, t)),
                        e.write(i);
                        if (i.getLengthInBits() <= 8 * r) break
                    }
                    this.typeNumber = t
                }
                this.makeImpl(!1, this.getBestMaskPattern())
            },
            makeImpl: function(t, e) {
                this.moduleCount = 4 * this.typeNumber + 17,
                this.modules = Array(this.moduleCount);
                for (var i = 0; i < this.moduleCount; i++) {
                    this.modules[i] = Array(this.moduleCount);
                    for (var n = 0; n < this.moduleCount; n++) this.modules[i][n] = null
                }
                this.setupPositionProbePattern(0, 0),
                this.setupPositionProbePattern(this.moduleCount - 7, 0),
                this.setupPositionProbePattern(0, this.moduleCount - 7),
                this.setupPositionAdjustPattern(),
                this.setupTimingPattern(),
                this.setupTypeInfo(t, e),
                7 <= this.typeNumber && this.setupTypeNumber(t),
                null == this.dataCache && (this.dataCache = r.createData(this.typeNumber, this.errorCorrectLevel, this.dataList)),
                this.mapData(this.dataCache, e)
            },
            setupPositionProbePattern: function(t, e) {
                for (var i = -1; 7 >= i; i++) if (! ( - 1 >= t + i || this.moduleCount <= t + i)) for (var r = -1; 7 >= r; r++) - 1 >= e + r || this.moduleCount <= e + r || (this.modules[t + i][e + r] = 0 <= i && 6 >= i && (0 == r || 6 == r) || 0 <= r && 6 >= r && (0 == i || 6 == i) || 2 <= i && 4 >= i && 2 <= r && 4 >= r)
            },
            getBestMaskPattern: function() {
                for (var t = 0,
                e = 0,
                i = 0; 8 > i; i++) {
                    this.makeImpl(!0, i);
                    var r = l.getLostPoint(this); (0 == i || t > r) && (t = r, e = i)
                }
                return e
            },
            createMovieClip: function(t, e, i) {
                for (t = t.createEmptyMovieClip(e, i), this.make(), e = 0; e < this.modules.length; e++) for (var i = 1 * e,
                r = 0; r < this.modules[e].length; r++) {
                    var n = 1 * r;
                    this.modules[e][r] && (t.beginFill(0, 100), t.moveTo(n, i), t.lineTo(n + 1, i), t.lineTo(n + 1, i + 1), t.lineTo(n, i + 1), t.endFill())
                }
                return t
            },
            setupTimingPattern: function() {
                for (var t = 8; t < this.moduleCount - 8; t++) null == this.modules[t][6] && (this.modules[t][6] = 0 == t % 2);
                for (t = 8; t < this.moduleCount - 8; t++) null == this.modules[6][t] && (this.modules[6][t] = 0 == t % 2)
            },
            setupPositionAdjustPattern: function() {
                for (var t = l.getPatternPosition(this.typeNumber), e = 0; e < t.length; e++) for (var i = 0; i < t.length; i++) {
                    var r = t[e],
                    n = t[i];
                    if (null == this.modules[r][n]) for (var a = -2; 2 >= a; a++) for (var o = -2; 2 >= o; o++) this.modules[r + a][n + o] = -2 == a || 2 == a || -2 == o || 2 == o || 0 == a && 0 == o
                }
            },
            setupTypeNumber: function(t) {
                for (var e = l.getBCHTypeNumber(this.typeNumber), i = 0; 18 > i; i++) {
                    var r = !t && 1 == (e >> i & 1);
                    this.modules[Math.floor(i / 3)][i % 3 + this.moduleCount - 8 - 3] = r
                }
                for (i = 0; 18 > i; i++) r = !t && 1 == (e >> i & 1),
                this.modules[i % 3 + this.moduleCount - 8 - 3][Math.floor(i / 3)] = r
            },
            setupTypeInfo: function(t, e) {
                for (var i = l.getBCHTypeInfo(this.errorCorrectLevel << 3 | e), r = 0; 15 > r; r++) {
                    var n = !t && 1 == (i >> r & 1);
                    6 > r ? this.modules[r][8] = n: 8 > r ? this.modules[r + 1][8] = n: this.modules[this.moduleCount - 15 + r][8] = n
                }
                for (r = 0; 15 > r; r++) n = !t && 1 == (i >> r & 1),
                8 > r ? this.modules[8][this.moduleCount - r - 1] = n: 9 > r ? this.modules[8][15 - r - 1 + 1] = n: this.modules[8][15 - r - 1] = n;
                this.modules[this.moduleCount - 8][8] = !t
            },
            mapData: function(t, e) {
                for (var i = -1,
                r = this.moduleCount - 1,
                n = 7,
                a = 0,
                o = this.moduleCount - 1; 0 < o; o -= 2) for (6 == o && o--;;) {
                    for (var s = 0; 2 > s; s++) if (null == this.modules[r][o - s]) {
                        var u = !1;
                        a < t.length && (u = 1 == (t[a] >>> n & 1)),
                        l.getMask(e, r, o - s) && (u = !u),
                        this.modules[r][o - s] = u,
                        -1 == --n && (a++, n = 7)
                    }
                    if (0 > (r += i) || this.moduleCount <= r) {
                        r -= i,
                        i = -i;
                        break
                    }
                }
            }
        },
        r.PAD0 = 236,
        r.PAD1 = 17,
        r.createData = function(t, e, i) {
            for (var e = a.getRSBlocks(t, e), n = new o, s = 0; s < i.length; s++) {
                var u = i[s];
                n.put(u.mode, 4),
                n.put(u.getLength(), l.getLengthInBits(u.mode, t)),
                u.write(n)
            }
            for (s = t = 0; s < e.length; s++) t += e[s].dataCount;
            if (n.getLengthInBits() > 8 * t) throw Error("code length overflow. (" + n.getLengthInBits() + ">" + 8 * t + ")");
            for (n.getLengthInBits() + 4 <= 8 * t && n.put(0, 4); 0 != n.getLengthInBits() % 8;) n.putBit(!1);
            for (; ! (n.getLengthInBits() >= 8 * t) && (n.put(r.PAD0, 8), !(n.getLengthInBits() >= 8 * t));) n.put(r.PAD1, 8);
            return r.createBytes(n, e)
        },
        r.createBytes = function(t, e) {
            for (var i = 0,
            r = 0,
            a = 0,
            o = Array(e.length), s = Array(e.length), u = 0; u < e.length; u++) {
                var c = e[u].dataCount,
                h = e[u].totalCount - c,
                r = Math.max(r, c),
                a = Math.max(a, h);
                o[u] = Array(c);
                for (var d = 0; d < o[u].length; d++) o[u][d] = 255 & t.buffer[d + i];
                for (i += c, d = l.getErrorCorrectPolynomial(h), c = new n(o[u], d.getLength() - 1).mod(d), s[u] = Array(d.getLength() - 1), d = 0; d < s[u].length; d++) h = d + c.getLength() - s[u].length,
                s[u][d] = 0 <= h ? c.get(h) : 0
            }
            for (d = u = 0; d < e.length; d++) u += e[d].totalCount;
            for (i = Array(u), d = c = 0; d < r; d++) for (u = 0; u < e.length; u++) d < o[u].length && (i[c++] = o[u][d]);
            for (d = 0; d < a; d++) for (u = 0; u < e.length; u++) d < s[u].length && (i[c++] = s[u][d]);
            return i
        },
        s = 4;
        for (var l = {
            PATTERN_POSITION_TABLE: [[], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50], [6, 30, 54], [6, 32, 58], [6, 34, 62], [6, 26, 46, 66], [6, 26, 48, 70], [6, 26, 50, 74], [6, 30, 54, 78], [6, 30, 56, 82], [6, 30, 58, 86], [6, 34, 62, 90], [6, 28, 50, 72, 94], [6, 26, 50, 74, 98], [6, 30, 54, 78, 102], [6, 28, 54, 80, 106], [6, 32, 58, 84, 110], [6, 30, 58, 86, 114], [6, 34, 62, 90, 118], [6, 26, 50, 74, 98, 122], [6, 30, 54, 78, 102, 126], [6, 26, 52, 78, 104, 130], [6, 30, 56, 82, 108, 134], [6, 34, 60, 86, 112, 138], [6, 30, 58, 86, 114, 142], [6, 34, 62, 90, 118, 146], [6, 30, 54, 78, 102, 126, 150], [6, 24, 50, 76, 102, 128, 154], [6, 28, 54, 80, 106, 132, 158], [6, 32, 58, 84, 110, 136, 162], [6, 26, 54, 82, 110, 138, 166], [6, 30, 58, 86, 114, 142, 170]],
            G15: 1335,
            G18: 7973,
            G15_MASK: 21522,
            getBCHTypeInfo: function(t) {
                for (var e = t << 10; 0 <= l.getBCHDigit(e) - l.getBCHDigit(l.G15);) e ^= l.G15 << l.getBCHDigit(e) - l.getBCHDigit(l.G15);
                return (t << 10 | e) ^ l.G15_MASK
            },
            getBCHTypeNumber: function(t) {
                for (var e = t << 12; 0 <= l.getBCHDigit(e) - l.getBCHDigit(l.G18);) e ^= l.G18 << l.getBCHDigit(e) - l.getBCHDigit(l.G18);
                return t << 12 | e
            },
            getBCHDigit: function(t) {
                for (var e = 0; 0 != t;) e++,
                t >>>= 1;
                return e
            },
            getPatternPosition: function(t) {
                return l.PATTERN_POSITION_TABLE[t - 1]
            },
            getMask: function(t, e, i) {
                switch (t) {
                case 0:
                    return 0 == (e + i) % 2;
                case 1:
                    return 0 == e % 2;
                case 2:
                    return 0 == i % 3;
                case 3:
                    return 0 == (e + i) % 3;
                case 4:
                    return 0 == (Math.floor(e / 2) + Math.floor(i / 3)) % 2;
                case 5:
                    return 0 == e * i % 2 + e * i % 3;
                case 6:
                    return 0 == (e * i % 2 + e * i % 3) % 2;
                case 7:
                    return 0 == (e * i % 3 + (e + i) % 2) % 2;
                default:
                    throw Error("bad maskPattern:" + t)
                }
            },
            getErrorCorrectPolynomial: function(t) {
                for (var e = new n([1], 0), i = 0; i < t; i++) e = e.multiply(new n([1, u.gexp(i)], 0));
                return e
            },
            getLengthInBits: function(t, e) {
                if (1 <= e && 10 > e) switch (t) {
                case 1:
                    return 10;
                case 2:
                    return 9;
                case s:
                case 8:
                    return 8;
                default:
                    throw Error("mode:" + t)
                } else if (27 > e) switch (t) {
                case 1:
                    return 12;
                case 2:
                    return 11;
                case s:
                    return 16;
                case 8:
                    return 10;
                default:
                    throw Error("mode:" + t)
                } else {
                    if (! (41 > e)) throw Error("type:" + e);
                    switch (t) {
                    case 1:
                        return 14;
                    case 2:
                        return 13;
                    case s:
                        return 16;
                    case 8:
                        return 12;
                    default:
                        throw Error("mode:" + t)
                    }
                }
            },
            getLostPoint: function(t) {
                for (var e = t.getModuleCount(), i = 0, r = 0; r < e; r++) for (var n = 0; n < e; n++) {
                    for (var a = 0,
                    o = t.isDark(r, n), s = -1; 1 >= s; s++) if (! (0 > r + s || e <= r + s)) for (var l = -1; 1 >= l; l++) 0 > n + l || e <= n + l || 0 == s && 0 == l || o == t.isDark(r + s, n + l) && a++;
                    5 < a && (i += 3 + a - 5)
                }
                for (r = 0; r < e - 1; r++) for (n = 0; n < e - 1; n++) a = 0,
                t.isDark(r, n) && a++,
                t.isDark(r + 1, n) && a++,
                t.isDark(r, n + 1) && a++,
                t.isDark(r + 1, n + 1) && a++,
                (0 == a || 4 == a) && (i += 3);
                for (r = 0; r < e; r++) for (n = 0; n < e - 6; n++) t.isDark(r, n) && !t.isDark(r, n + 1) && t.isDark(r, n + 2) && t.isDark(r, n + 3) && t.isDark(r, n + 4) && !t.isDark(r, n + 5) && t.isDark(r, n + 6) && (i += 40);
                for (n = 0; n < e; n++) for (r = 0; r < e - 6; r++) t.isDark(r, n) && !t.isDark(r + 1, n) && t.isDark(r + 2, n) && t.isDark(r + 3, n) && t.isDark(r + 4, n) && !t.isDark(r + 5, n) && t.isDark(r + 6, n) && (i += 40);
                for (n = a = 0; n < e; n++) for (r = 0; r < e; r++) t.isDark(r, n) && a++;
                return t = Math.abs(100 * a / e / e - 50) / 5,
                i + 10 * t
            }
        },
        u = {
            glog: function(t) {
                if (1 > t) throw Error("glog(" + t + ")");
                return u.LOG_TABLE[t]
            },
            gexp: function(t) {
                for (; 0 > t;) t += 255;
                for (; 256 <= t;) t -= 255;
                return u.EXP_TABLE[t]
            },
            EXP_TABLE: Array(256),
            LOG_TABLE: Array(256)
        },
        c = 0; 8 > c; c++) u.EXP_TABLE[c] = 1 << c;
        for (c = 8; 256 > c; c++) u.EXP_TABLE[c] = u.EXP_TABLE[c - 4] ^ u.EXP_TABLE[c - 5] ^ u.EXP_TABLE[c - 6] ^ u.EXP_TABLE[c - 8];
        for (c = 0; 255 > c; c++) u.LOG_TABLE[u.EXP_TABLE[c]] = c;
        return n.prototype = {
            get: function(t) {
                return this.num[t]
            },
            getLength: function() {
                return this.num.length
            },
            multiply: function(t) {
                for (var e = Array(this.getLength() + t.getLength() - 1), i = 0; i < this.getLength(); i++) for (var r = 0; r < t.getLength(); r++) e[i + r] ^= u.gexp(u.glog(this.get(i)) + u.glog(t.get(r)));
                return new n(e, 0)
            },
            mod: function(t) {
                if (0 > this.getLength() - t.getLength()) return this;
                for (var e = u.glog(this.get(0)) - u.glog(t.get(0)), i = Array(this.getLength()), r = 0; r < this.getLength(); r++) i[r] = this.get(r);
                for (r = 0; r < t.getLength(); r++) i[r] ^= u.gexp(u.glog(t.get(r)) + e);
                return new n(i, 0).mod(t)
            }
        },
        a.RS_BLOCK_TABLE = [[1, 26, 19], [1, 26, 16], [1, 26, 13], [1, 26, 9], [1, 44, 34], [1, 44, 28], [1, 44, 22], [1, 44, 16], [1, 70, 55], [1, 70, 44], [2, 35, 17], [2, 35, 13], [1, 100, 80], [2, 50, 32], [2, 50, 24], [4, 25, 9], [1, 134, 108], [2, 67, 43], [2, 33, 15, 2, 34, 16], [2, 33, 11, 2, 34, 12], [2, 86, 68], [4, 43, 27], [4, 43, 19], [4, 43, 15], [2, 98, 78], [4, 49, 31], [2, 32, 14, 4, 33, 15], [4, 39, 13, 1, 40, 14], [2, 121, 97], [2, 60, 38, 2, 61, 39], [4, 40, 18, 2, 41, 19], [4, 40, 14, 2, 41, 15], [2, 146, 116], [3, 58, 36, 2, 59, 37], [4, 36, 16, 4, 37, 17], [4, 36, 12, 4, 37, 13], [2, 86, 68, 2, 87, 69], [4, 69, 43, 1, 70, 44], [6, 43, 19, 2, 44, 20], [6, 43, 15, 2, 44, 16], [4, 101, 81], [1, 80, 50, 4, 81, 51], [4, 50, 22, 4, 51, 23], [3, 36, 12, 8, 37, 13], [2, 116, 92, 2, 117, 93], [6, 58, 36, 2, 59, 37], [4, 46, 20, 6, 47, 21], [7, 42, 14, 4, 43, 15], [4, 133, 107], [8, 59, 37, 1, 60, 38], [8, 44, 20, 4, 45, 21], [12, 33, 11, 4, 34, 12], [3, 145, 115, 1, 146, 116], [4, 64, 40, 5, 65, 41], [11, 36, 16, 5, 37, 17], [11, 36, 12, 5, 37, 13], [5, 109, 87, 1, 110, 88], [5, 65, 41, 5, 66, 42], [5, 54, 24, 7, 55, 25], [11, 36, 12], [5, 122, 98, 1, 123, 99], [7, 73, 45, 3, 74, 46], [15, 43, 19, 2, 44, 20], [3, 45, 15, 13, 46, 16], [1, 135, 107, 5, 136, 108], [10, 74, 46, 1, 75, 47], [1, 50, 22, 15, 51, 23], [2, 42, 14, 17, 43, 15], [5, 150, 120, 1, 151, 121], [9, 69, 43, 4, 70, 44], [17, 50, 22, 1, 51, 23], [2, 42, 14, 19, 43, 15], [3, 141, 113, 4, 142, 114], [3, 70, 44, 11, 71, 45], [17, 47, 21, 4, 48, 22], [9, 39, 13, 16, 40, 14], [3, 135, 107, 5, 136, 108], [3, 67, 41, 13, 68, 42], [15, 54, 24, 5, 55, 25], [15, 43, 15, 10, 44, 16], [4, 144, 116, 4, 145, 117], [17, 68, 42], [17, 50, 22, 6, 51, 23], [19, 46, 16, 6, 47, 17], [2, 139, 111, 7, 140, 112], [17, 74, 46], [7, 54, 24, 16, 55, 25], [34, 37, 13], [4, 151, 121, 5, 152, 122], [4, 75, 47, 14, 76, 48], [11, 54, 24, 14, 55, 25], [16, 45, 15, 14, 46, 16], [6, 147, 117, 4, 148, 118], [6, 73, 45, 14, 74, 46], [11, 54, 24, 16, 55, 25], [30, 46, 16, 2, 47, 17], [8, 132, 106, 4, 133, 107], [8, 75, 47, 13, 76, 48], [7, 54, 24, 22, 55, 25], [22, 45, 15, 13, 46, 16], [10, 142, 114, 2, 143, 115], [19, 74, 46, 4, 75, 47], [28, 50, 22, 6, 51, 23], [33, 46, 16, 4, 47, 17], [8, 152, 122, 4, 153, 123], [22, 73, 45, 3, 74, 46], [8, 53, 23, 26, 54, 24], [12, 45, 15, 28, 46, 16], [3, 147, 117, 10, 148, 118], [3, 73, 45, 23, 74, 46], [4, 54, 24, 31, 55, 25], [11, 45, 15, 31, 46, 16], [7, 146, 116, 7, 147, 117], [21, 73, 45, 7, 74, 46], [1, 53, 23, 37, 54, 24], [19, 45, 15, 26, 46, 16], [5, 145, 115, 10, 146, 116], [19, 75, 47, 10, 76, 48], [15, 54, 24, 25, 55, 25], [23, 45, 15, 25, 46, 16], [13, 145, 115, 3, 146, 116], [2, 74, 46, 29, 75, 47], [42, 54, 24, 1, 55, 25], [23, 45, 15, 28, 46, 16], [17, 145, 115], [10, 74, 46, 23, 75, 47], [10, 54, 24, 35, 55, 25], [19, 45, 15, 35, 46, 16], [17, 145, 115, 1, 146, 116], [14, 74, 46, 21, 75, 47], [29, 54, 24, 19, 55, 25], [11, 45, 15, 46, 46, 16], [13, 145, 115, 6, 146, 116], [14, 74, 46, 23, 75, 47], [44, 54, 24, 7, 55, 25], [59, 46, 16, 1, 47, 17], [12, 151, 121, 7, 152, 122], [12, 75, 47, 26, 76, 48], [39, 54, 24, 14, 55, 25], [22, 45, 15, 41, 46, 16], [6, 151, 121, 14, 152, 122], [6, 75, 47, 34, 76, 48], [46, 54, 24, 10, 55, 25], [2, 45, 15, 64, 46, 16], [17, 152, 122, 4, 153, 123], [29, 74, 46, 14, 75, 47], [49, 54, 24, 10, 55, 25], [24, 45, 15, 46, 46, 16], [4, 152, 122, 18, 153, 123], [13, 74, 46, 32, 75, 47], [48, 54, 24, 14, 55, 25], [42, 45, 15, 32, 46, 16], [20, 147, 117, 4, 148, 118], [40, 75, 47, 7, 76, 48], [43, 54, 24, 22, 55, 25], [10, 45, 15, 67, 46, 16], [19, 148, 118, 6, 149, 119], [18, 75, 47, 31, 76, 48], [34, 54, 24, 34, 55, 25], [20, 45, 15, 61, 46, 16]],
        a.getRSBlocks = function(t, e) {
            var i = a.getRsBlockTable(t, e);
            if (void 0 == i) throw Error("bad rs block @ typeNumber:" + t + "/errorCorrectLevel:" + e);
            for (var r = i.length / 3,
            n = [], o = 0; o < r; o++) for (var s = i[3 * o + 0], l = i[3 * o + 1], u = i[3 * o + 2], c = 0; c < s; c++) n.push(new a(l, u));
            return n
        },
        a.getRsBlockTable = function(t, e) {
            switch (e) {
            case 1:
                return a.RS_BLOCK_TABLE[4 * (t - 1) + 0];
            case 0:
                return a.RS_BLOCK_TABLE[4 * (t - 1) + 1];
            case 3:
                return a.RS_BLOCK_TABLE[4 * (t - 1) + 2];
            case 2:
                return a.RS_BLOCK_TABLE[4 * (t - 1) + 3]
            }
        },
        o.prototype = {
            get: function(t) {
                return 1 == (this.buffer[Math.floor(t / 8)] >>> 7 - t % 8 & 1)
            },
            put: function(t, e) {
                for (var i = 0; i < e; i++) this.putBit(1 == (t >>> e - i - 1 & 1))
            },
            getLengthInBits: function() {
                return this.length
            },
            putBit: function(t) {
                var e = Math.floor(this.length / 8);
                this.buffer.length <= e && this.buffer.push(0),
                t && (this.buffer[e] |= 128 >>> this.length % 8),
                this.length++
            }
        },
        "string" == typeof e && (e = {
            text: e
        }),
        e = t.extend({},
        {
            render: "canvas",
            width: 256,
            height: 256,
            typeNumber: -1,
            correctLevel: 2,
            background: "#ffffff",
            foreground: "#000000"
        },
        e),
        this.each(function() {
            var i;
            if ("canvas" == e.render) { (i = new r(e.typeNumber, e.correctLevel)).addData(e.text),
                i.make();
                var n = document.createElement("canvas");
                n.width = e.width,
                n.height = e.height;
                for (var a = n.getContext("2d"), o = e.width / i.getModuleCount(), s = e.height / i.getModuleCount(), l = 0; l < i.getModuleCount(); l++) for (var u = 0; u < i.getModuleCount(); u++) {
                    a.fillStyle = i.isDark(l, u) ? e.foreground: e.background;
                    var c = Math.ceil((u + 1) * o) - Math.floor(u * o),
                    h = Math.ceil((l + 1) * o) - Math.floor(l * o);
                    a.fillRect(Math.round(u * o), Math.round(l * s), c, h)
                }
            } else for ((i = new r(e.typeNumber, e.correctLevel)).addData(e.text), i.make(), n = t("<table></table>").css("width", e.width + "px").css("height", e.height + "px").css("border", "0px").css("border-collapse", "collapse").css("background-color", e.background), a = e.width / i.getModuleCount(), o = e.height / i.getModuleCount(), s = 0; s < i.getModuleCount(); s++) for (l = t("<tr></tr>").css("height", o + "px").appendTo(n), u = 0; u < i.getModuleCount(); u++) t("<td></td>").css("width", a + "px").css("background-color", i.isDark(s, u) ? e.foreground: e.background).appendTo(l);
            i = n,
            jQuery(i).appendTo(this)
        })
    }
} (jQuery),
function($) {
    function sideroll(t) {
        var e = $(".sidebar");
        if (e.length && t && !TBUI.bd.hasClass("is-phone")) {
            t = t.split(" ");
            for (var i = e.height(), r = 15, n = e.children(".widget"), a = 0; a < t.length; a++) {
                var o = n.eq(t[a] - 1);
                if (!o.length) break;
                r += o.outerHeight(!0)
            }
            $(window).scroll(function() {
                var a = $(document),
                o = a.height(),
                s = a.scrollTop(),
                l = e.offset().top,
                u = $(".footer").outerHeight(!0);
                $(".branding").length && (u += $(".branding").outerHeight(!0));
                var c = 15,
                h = 0;
                if (TBUI.bd.hasClass("nav-fixed") && (c = $(".header").outerHeight(!0), l -= h = $(".header").outerHeight(), u += c), s > l + i) for (var d = 0; d < t.length; d++) {
                    var g = n.eq(t[d] - 1);
                    if (!g.length) break;
                    s > o - u - r ? g.removeClass("-roll-top").addClass("-roll-bottom").css("top", o - u - r - h - l + c) : g.removeClass("-roll-bottom").addClass("-roll-top").css("top", c),
                    c += g.outerHeight(!0)
                } else n.removeClass("-roll-top -roll-bottom").css("top", "")
            })
        }
    }
    function video_ok() {
        var t = $(".article-content").width();
        $(".article-content embed, .article-content video, .article-content iframe").each(function() {
            var e = $(this).attr("width") || 0,
            i = $(this).attr("height") || 0;
            t && e && i && ($(this).css("width", t < e ? t: e), $(this).css("height", $(this).width() / (e / i)))
        }),
        rollbar_middle()
    }
    function rollbar_middle() {
        var t = $(".rollbar-rm");
        t.length && t.css({
            top: "50%",
            "margin-top": t.height() / 2 * -1 - 22
        })
    }
    $.fn.serializeObject = function() {
        var t = {},
        e = this.serializeArray();
        return $.each(e,
        function() {
            void 0 !== t[this.name] ? (t[this.name].push || (t[this.name] = [t[this.name]]), t[this.name].push(this.value || "")) : t[this.name] = this.value || ""
        }),
        t
    },
    TBUI.scrollTo = function(t, e, i) {
        i || (i = 300),
        t ? $(t).length > 0 && $("html,body").animate({
            scrollTop: $(t).offset().top + (e || 0)
        },
        i) : $("html,body").animate({
            scrollTop: 0
        },
        i)
    },
    TBUI.is_name = function(t) {
        return /.{2,12}$/.test(t)
    },
    TBUI.is_url = function(t) {
        return /^((http|https)\:\/\/)([a-z0-9-]{1,}.)?[a-z0-9-]{2,}.([a-z0-9-]{1,}.)?[a-z0-9]{2,}$/.test(t)
    },
    TBUI.is_qq = function(t) {
        return /^[1-9]\d{4,13}$/.test(t)
    },
    TBUI.is_mail = function(t) {
        return /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/.test(t)
    },
    TBUI.bd = $("body"),
    TBUI.is_signin = !!TBUI.bd.hasClass("logged-in"),
    sideroll(TBUI.roll || ""),
    $(".widget-nav").length && $(".widget-nav li").each(function(t) {
        $(this).hover(function() {
            $(this).addClass("active").siblings().removeClass("active"),
            $(".widget-navcontent .item:eq(" + t + ")").addClass("active").siblings().removeClass("active")
        })
    }),
    $(".sns-wechat").length && $(".sns-wechat").on("click",
    function() {
        var t = $(this);
        $("#modal-wechat").length || $("body").append('                <div class="modal fade" id="modal-wechat" tabindex="-1" role="dialog" aria-hidden="true">                    <div class="modal-dialog" style="margin-top:200px;width:340px;">                        <div class="modal-content">                            <div class="modal-header">                                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>                                <h4 class="modal-title">' + t.attr("title") + '</h4>                            </div>                            <div class="modal-body" style="text-align:center">                                <img style="max-width:100%" src="' + t.data("src") + '">                            </div>                        </div>                    </div>                </div>            '),
        $("#modal-wechat").modal()
    }),
    TBUI.fullimage && tbquire(["swiper"],
    function() {
        var t = $(".article-content img").map(function(t, e) {
            var i = $(this).parent(),
            r = i.attr("href");
            return "A" == i[0].tagName && r && /.(jpg|jpeg|webp|svg|bmp|png|gif)$/.test(r.toLowerCase()) ? r: $(this).attr("src")
        }),
        e = null;
        $(".article-content img").each(function(i, r) {
            var n = $(this).parent(),
            a = n.attr("href"),
            o = "A" == n[0].tagName && a && /.(jpg|jpeg|webp|svg|bmp|png|gif)$/.test(a.toLowerCase());
            o && n.on("click",
            function() {
                return ! 1
            }),
            $(this).on("click",
            function() {
                if ("A" !== n[0].tagName || "A" == n[0].tagName && !a || o) {
                    clearTimeout(e);
                    for (var r = "",
                    s = 0; s < t.length; s++) r += '<div class="swiper-slide"><div class="swiper-zoom-container"><img src="' + t[s] + '"></div></div>';
                    var l = '<div class="swiper-container article-swiper-container">                        <div class="swiper-wrapper">' + r + '</div>                        <div class="swiper-pagination"></div>                        <div class="swiper-button-next swiper-button-white"><i class="fa fa-chevron-right"></i></div>        \t\t\t\t<div class="swiper-button-prev swiper-button-white"><i class="fa fa-chevron-left"></i></div>                    </div>';
                    TBUI.bd.addClass("swiper-fixed").append(l);
                    var u = new Swiper(".article-swiper-container", {
                        initialSlide: i,
                        zoom: {
                            maxRatio: 5
                        },
                        pagination: {
                            el: ".swiper-pagination",
                            type: "fraction"
                        },
                        navigation: {
                            nextEl: ".swiper-button-next",
                            prevEl: ".swiper-button-prev"
                        },
                        on: {
                            click: function(t) {
                                t.target.className.indexOf("fa-") > -1 || t.target.className.indexOf("swiper-button") > -1 || (e = setTimeout(function() {
                                    TBUI.bd.removeClass("swiper-fixed"),
                                    $(".article-swiper-container").remove(),
                                    u.destroy(!0, !0)
                                },
                                50))
                            },
                            slideNextTransitionStart: function(t) {
                                $(".article-swiper-container .swiper-slide-prev img").addClass("article-swiper-no-transition")
                            },
                            slidePrevTransitionStart: function(t) {
                                $(".article-swiper-container .swiper-slide-next img").addClass("article-swiper-no-transition")
                            },
                            slideChange: function(t) {
                                $(".article-swiper-container .article-swiper-no-transition").removeClass("article-swiper-no-transition")
                            }
                        }
                    });
                    return ! 1
                }
            })
        })
    }),
    $("#focusslide").length && $("#focusslide .swiper-slide").length > 1 && tbquire(["swiper"],
    function() {
        new Swiper("#focusslide", {
            initialSlide: 0,
            loop: !0,
            speed: 800,
            autoplay: {
                delay: 4500,
                disableOnInteraction: !1
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: !0
            },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev"
            }
        })
    }),
    Number(TBUI.ajaxpager) > 0 && ($(".excerpt").length || $(".excerpt-minic").length) && tbquire(["ias"],
    function() { ! TBUI.bd.hasClass("site-minicat") && $(".excerpt").length && $.ias({
            triggerPageThreshold: TBUI.ajaxpager ? Number(TBUI.ajaxpager) + 1 : 5,
            history: !1,
            container: ".content",
            item: ".excerpt",
            pagination: ".pagination",
            next: ".next-page a",
            loader: '<div class="pagination-loading"><img src="' + TBUI.uri + '/img/loading.gif"></div>',
            trigger: "加载更多",
            onRenderComplete: function() {
                tbquire(["lazyload"],
                function() {
                    $(".excerpt .thumb").lazyload({
                        data_attribute: "src",
                        placeholder: TBUI.uri + "/img/thumbnail.png",
                        threshold: 400
                    })
                })
            }
        }),
        TBUI.bd.hasClass("site-minicat") && $(".excerpt-minic").length && $.ias({
            triggerPageThreshold: TBUI.ajaxpager ? Number(TBUI.ajaxpager) + 1 : 5,
            history: !1,
            container: ".content",
            item: ".excerpt-minic",
            pagination: ".pagination",
            next: ".next-page a",
            loader: '<div class="pagination-loading"><img src="' + TBUI.uri + '/img/loading.gif"></div>',
            trigger: "加载更多",
            onRenderComplete: function() {
                tbquire(["lazyload"],
                function() {
                    $(".excerpt .thumb").lazyload({
                        data_attribute: "src",
                        placeholder: TBUI.uri + "/img/thumbnail.png",
                        threshold: 400
                    })
                })
            }
        })
    }),
    tbquire(["lazyload"],
    function() {
        $(".avatar").lazyload({
            data_attribute: "src",
            placeholder: TBUI.uri + "/img/avatar-default.png",
            threshold: 400
        }),
        $(".widget .avatar").lazyload({
            data_attribute: "src",
            placeholder: TBUI.uri + "/img/avatar-default.png",
            threshold: 400
        }),
        $(".thumb").lazyload({
            data_attribute: "src",
            placeholder: TBUI.uri + "/img/thumbnail.png",
            threshold: 400
        }),
        $(".widget_ui_posts .thumb").lazyload({
            data_attribute: "src",
            placeholder: TBUI.uri + "/img/thumbnail.png",
            threshold: 400
        }),
        $(".wp-smiley").lazyload({
            data_attribute: "src",
            threshold: 400
        })
    }),
    $("pre").each(function() {
        $(this).attr("style") || $(this).hasClass("wp-block-preformatted") || $(this).hasClass("wp-block-verse") || $(this).addClass("prettyprint")
    }),
    $(".prettyprint").length && tbquire(["prettyprint"],
    function(t) {
        prettyPrint()
    }),
    TBUI.bd.append('<div class="m-mask"></div>');
    var _wid = $(window).width();
    $(window).resize(function(t) {
        _wid = $(window).width()
    });
    var scroller = $(".rollbar-totop"),
    _fix = !(!TBUI.bd.hasClass("nav_fixed") || TBUI.bd.hasClass("page-template-navs"));
    if ($(window).scroll(function() {
        var t = document.documentElement.scrollTop + document.body.scrollTop;
        _fix && t > 0 && _wid > 720 ? TBUI.bd.addClass("nav-fixed") : TBUI.bd.removeClass("nav-fixed"),
        t > 100 ? scroller.fadeIn() : scroller.fadeOut()
    }), TBUI.bd.hasClass("logged-in") || tbquire(["signpop"],
    function(t) {
        t.init()
    }), $(".loop-product-filters-more").on("click",
    function() {
        $(".loop-product-filters > ul").slideToggle(300)
    }), $('[data-event="rewards"]').on("click",
    function() {
        $(".rewards-popover-mask, .rewards-popover").fadeIn()
    }), $('[data-event="rewards-close"]').on("click",
    function() {
        $(".rewards-popover-mask, .rewards-popover").fadeOut()
    }), $("#SOHUCS").length && $("#SOHUCS").before('<span id="comments"></span>'), $(".post-like").length && tbquire(["jquery.cookie"],
    function() {
        $(".content").on("click", '[etap="like"]',
        function() {
            var t = $(this),
            e = t.attr("data-pid");
            if (t.hasClass("actived")) return alert("你已赞！");
            if (e && /^\d{1,}$/.test(e)) {
                if (!TBUI.is_signin) {
                    var i = lcs.get("_likes") || "";
                    if ( - 1 !== i.indexOf("," + e + ",")) return alert("你已赞！");
                    i ? i.length >= 160 ? ((i = (i = i.substring(0, i.length - 1)).substr(1).split(",")).splice(0, 1), i.push(e), i = i.join(","), lcs.set("_likes", "," + i + ",")) : lcs.set("_likes", i + e + ",") : lcs.set("_likes", "," + e + ",")
                }
                $.ajax({
                    url: TBUI.uri + "/action/like.php",
                    type: "POST",
                    dataType: "json",
                    data: {
                        key: "like",
                        pid: e
                    },
                    success: function(e, i, r) {
                        if (e.error) return ! 1;
                        t.toggleClass("actived"),
                        t.find("span").html(e.response)
                    }
                })
            }
        })
    }), TBUI.bd.hasClass("comment-open") && tbquire(["comment"],
    function(t) {
        t.init()
    }), TBUI.bd.hasClass("page-template-pagesuser-php") && tbquire(["user"],
    function(t) {
        t.init()
    }), TBUI.bd.hasClass("page-template-pagesnavs-php")) {
        var titles = "",
        i = 0;
        if ($("#navs .items h2").each(function() {
            titles += '<li><a href="#' + i + '">' + $(this).text() + "</a></li>",
            i++
        }), $("#navs nav ul").html(titles), $("#navs .items a").attr("target", "_blank"), $("#navs nav ul").affix({
            offset: {
                top: $("#navs nav").offset().top
            }
        }), location.hash) {
            var index = location.hash.split("#")[1];
            $("#navs nav li:eq(" + index + ")").addClass("active"),
            $("#navs nav .item:eq(" + index + ")").addClass("active"),
            TBUI.scrollTo("#navs .items .item:eq(" + index + ")")
        }
        $("#navs nav a").each(function(t) {
            $(this).click(function() {
                TBUI.scrollTo("#navs .items .item:eq(" + $(this).parent().index() + ")"),
                $(this).parent().addClass("active").siblings().removeClass("active")
            })
        })
    }
    if (TBUI.bd.hasClass("search-results")) {
        var val = $(".site-search-form .search-input").val(),
        reg = eval("/" + val + "/i");
        $(".excerpt h2 a, .excerpt .note").each(function() {
            $(this).html($(this).text().replace(reg,
            function(t) {
                return '<span style="color:#FF5E52;">' + t + "</span>"
            }))
        })
    }
    var tb_search_timer;
    $(".search-show").bind("click",
    function(t) {
        return t.stopPropagation(),
        $(this).find(".fa").toggleClass("fa-remove"),
        TBUI.bd.toggleClass("search-on"),
        TBUI.bd.hasClass("search-on") && (TBUI.bd.removeClass("m-nav-show"), tb_search_timer && clearTimeout(tb_search_timer), tb_search_timer = setTimeout(function() {
            $(".site-search").find("input").focus()
        },
        200)),
        !1
    }),
    $(document).click(function(t) {
        e = $(".search-show, .site-search");
        e.is(t.target) || 0 !== e.has(t.target).length || (TBUI.bd.removeClass("search-on"), e.find(".fa").removeClass("fa-remove"));
        var e; (e = $(".rollbar-qrcode")).is(t.target) || 0 !== e.has(t.target).length || e.find("h6").hide()
    }),
    TBUI.bd.append($(".site-navbar").clone().attr("class", "m-navbar")),
    $(".m-navbar li.menu-item-has-children").each(function() {
        $(this).append('<i class="fa fa-angle-down faa"></i>')
    }),
    $(".m-navbar li.menu-item-has-children .faa").on("click",
    function() {
        $(this).parent().find(".sub-menu").slideToggle(300)
    }),
    $(".m-icon-nav").on("click",
    function() {
        TBUI.bd.addClass("m-nav-show"),
        $(".m-mask").show(),
        TBUI.bd.removeClass("search-on"),
        $(".search-show .fa").removeClass("fa-remove")
    }),
    $(".m-mask").on("click",
    function() {
        $(this).hide(),
        TBUI.bd.removeClass("m-nav-show")
    }),
    $(".article-content").length && $(".article-content img").attr("data-tag", "bdshare"),
    video_ok(),
    $(window).resizeend(function(t) {
        video_ok()
    }),
    $(".rollbar-m-on .rollbar-qrcode a").on("click",
    function() {
        $(this).next("h6").toggle()
    }),
    $(".erphp-login-must").each(function() {
        $(this).addClass("signin-loader")
    }),
    $(".tbqrcode").each(function(t, e) {
        $(this).data("url") && $(this).qrcode({
            text: encodeURI($(this).data("url")),
            width: 130,
            height: 130
        })
    }),
    TBUI.captcha && TBUI.captcha_appid && tbquire(["qcaptcha"],
    function() {
        $("#site_resetpassword").on("click",
        function() {
            var t = $(this).parent().parent();
            return TBUI.cpt = new TencentCaptcha(document.getElementById("site_resetpassword"), TBUI.captcha_appid,
            function(e) {
                0 === e.ret && (t.append('<input type="hidden" name="ticket" value="' + e.ticket + '">'), t.append('<input type="hidden" name="randstr" value="' + e.randstr + '">'), t.submit())
            }),
            TBUI.cpt.show(),
            !1
        })
    }),
    $(".copy-wechat-number").on("click",
    function() {
        $("body").append('<input type="text" id="tb-wechat-copy" value="' + $(this).data("id") + '">'),
        $("#tb-wechat-copy")[0].select(),
        document.execCommand("copy"),
        $("#tb-wechat-copy").remove(),
        $(this).text("微信号已复制")
    })
} (jQuery);