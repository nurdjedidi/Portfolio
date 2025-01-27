import process from 'node:process';globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import http from 'node:http';
import https from 'node:https';
import { promises, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { ipxFSStorage, ipxHttpStorage, createIPX, createIPXH3Handler } from 'ipx';
import { dirname as dirname$1, resolve as resolve$1, join } from 'node:path';

const suspectProtoRx = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/;
const suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
const JsonSigRx = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
function jsonParseTransform(key, value) {
  if (key === "__proto__" || key === "constructor" && value && typeof value === "object" && "prototype" in value) {
    warnKeyDropped(key);
    return;
  }
  return value;
}
function warnKeyDropped(key) {
  console.warn(`[destr] Dropping "${key}" key to prevent prototype pollution.`);
}
function destr(value, options = {}) {
  if (typeof value !== "string") {
    return value;
  }
  const _value = value.trim();
  if (
    // eslint-disable-next-line unicorn/prefer-at
    value[0] === '"' && value.endsWith('"') && !value.includes("\\")
  ) {
    return _value.slice(1, -1);
  }
  if (_value.length <= 9) {
    const _lval = _value.toLowerCase();
    if (_lval === "true") {
      return true;
    }
    if (_lval === "false") {
      return false;
    }
    if (_lval === "undefined") {
      return undefined;
    }
    if (_lval === "null") {
      return null;
    }
    if (_lval === "nan") {
      return Number.NaN;
    }
    if (_lval === "infinity") {
      return Number.POSITIVE_INFINITY;
    }
    if (_lval === "-infinity") {
      return Number.NEGATIVE_INFINITY;
    }
  }
  if (!JsonSigRx.test(value)) {
    if (options.strict) {
      throw new SyntaxError("[destr] Invalid JSON");
    }
    return value;
  }
  try {
    if (suspectProtoRx.test(value) || suspectConstructorRx.test(value)) {
      if (options.strict) {
        throw new Error("[destr] Possible prototype pollution");
      }
      return JSON.parse(value, jsonParseTransform);
    }
    return JSON.parse(value);
  } catch (error) {
    if (options.strict) {
      throw error;
    }
    return value;
  }
}

const HASH_RE = /#/g;
const AMPERSAND_RE = /&/g;
const SLASH_RE = /\//g;
const EQUAL_RE = /=/g;
const PLUS_RE = /\+/g;
const ENC_CARET_RE = /%5e/gi;
const ENC_BACKTICK_RE = /%60/gi;
const ENC_PIPE_RE = /%7c/gi;
const ENC_SPACE_RE = /%20/gi;
const ENC_SLASH_RE = /%2f/gi;
function encode(text) {
  return encodeURI("" + text).replace(ENC_PIPE_RE, "|");
}
function encodeQueryValue(input) {
  return encode(typeof input === "string" ? input : JSON.stringify(input)).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CARET_RE, "^").replace(SLASH_RE, "%2F");
}
function encodeQueryKey(text) {
  return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
}
function decode(text = "") {
  try {
    return decodeURIComponent("" + text);
  } catch {
    return "" + text;
  }
}
function decodePath(text) {
  return decode(text.replace(ENC_SLASH_RE, "%252F"));
}
function decodeQueryKey(text) {
  return decode(text.replace(PLUS_RE, " "));
}
function decodeQueryValue(text) {
  return decode(text.replace(PLUS_RE, " "));
}

function parseQuery(parametersString = "") {
  const object = {};
  if (parametersString[0] === "?") {
    parametersString = parametersString.slice(1);
  }
  for (const parameter of parametersString.split("&")) {
    const s = parameter.match(/([^=]+)=?(.*)/) || [];
    if (s.length < 2) {
      continue;
    }
    const key = decodeQueryKey(s[1]);
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = decodeQueryValue(s[2] || "");
    if (object[key] === undefined) {
      object[key] = value;
    } else if (Array.isArray(object[key])) {
      object[key].push(value);
    } else {
      object[key] = [object[key], value];
    }
  }
  return object;
}
function encodeQueryItem(key, value) {
  if (typeof value === "number" || typeof value === "boolean") {
    value = String(value);
  }
  if (!value) {
    return encodeQueryKey(key);
  }
  if (Array.isArray(value)) {
    return value.map((_value) => `${encodeQueryKey(key)}=${encodeQueryValue(_value)}`).join("&");
  }
  return `${encodeQueryKey(key)}=${encodeQueryValue(value)}`;
}
function stringifyQuery(query) {
  return Object.keys(query).filter((k) => query[k] !== undefined).map((k) => encodeQueryItem(k, query[k])).filter(Boolean).join("&");
}

const PROTOCOL_STRICT_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{1,2})/;
const PROTOCOL_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{2})?/;
const PROTOCOL_RELATIVE_REGEX = /^([/\\]\s*){2,}[^/\\]/;
const PROTOCOL_SCRIPT_RE = /^[\s\0]*(blob|data|javascript|vbscript):$/i;
const TRAILING_SLASH_RE = /\/$|\/\?|\/#/;
const JOIN_LEADING_SLASH_RE = /^\.?\//;
function hasProtocol(inputString, opts = {}) {
  if (typeof opts === "boolean") {
    opts = { acceptRelative: opts };
  }
  if (opts.strict) {
    return PROTOCOL_STRICT_REGEX.test(inputString);
  }
  return PROTOCOL_REGEX.test(inputString) || (opts.acceptRelative ? PROTOCOL_RELATIVE_REGEX.test(inputString) : false);
}
function isScriptProtocol(protocol) {
  return !!protocol && PROTOCOL_SCRIPT_RE.test(protocol);
}
function hasTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return input.endsWith("/");
  }
  return TRAILING_SLASH_RE.test(input);
}
function withoutTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return (hasTrailingSlash(input) ? input.slice(0, -1) : input) || "/";
  }
  if (!hasTrailingSlash(input, true)) {
    return input || "/";
  }
  let path = input;
  let fragment = "";
  const fragmentIndex = input.indexOf("#");
  if (fragmentIndex >= 0) {
    path = input.slice(0, fragmentIndex);
    fragment = input.slice(fragmentIndex);
  }
  const [s0, ...s] = path.split("?");
  const cleanPath = s0.endsWith("/") ? s0.slice(0, -1) : s0;
  return (cleanPath || "/") + (s.length > 0 ? `?${s.join("?")}` : "") + fragment;
}
function withTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return input.endsWith("/") ? input : input + "/";
  }
  if (hasTrailingSlash(input, true)) {
    return input || "/";
  }
  let path = input;
  let fragment = "";
  const fragmentIndex = input.indexOf("#");
  if (fragmentIndex >= 0) {
    path = input.slice(0, fragmentIndex);
    fragment = input.slice(fragmentIndex);
    if (!path) {
      return fragment;
    }
  }
  const [s0, ...s] = path.split("?");
  return s0 + "/" + (s.length > 0 ? `?${s.join("?")}` : "") + fragment;
}
function hasLeadingSlash(input = "") {
  return input.startsWith("/");
}
function withLeadingSlash(input = "") {
  return hasLeadingSlash(input) ? input : "/" + input;
}
function withBase(input, base) {
  if (isEmptyURL(base) || hasProtocol(input)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (input.startsWith(_base)) {
    return input;
  }
  return joinURL(_base, input);
}
function withoutBase(input, base) {
  if (isEmptyURL(base)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (!input.startsWith(_base)) {
    return input;
  }
  const trimmed = input.slice(_base.length);
  return trimmed[0] === "/" ? trimmed : "/" + trimmed;
}
function withQuery(input, query) {
  const parsed = parseURL(input);
  const mergedQuery = { ...parseQuery(parsed.search), ...query };
  parsed.search = stringifyQuery(mergedQuery);
  return stringifyParsedURL(parsed);
}
function getQuery$1(input) {
  return parseQuery(parseURL(input).search);
}
function isEmptyURL(url) {
  return !url || url === "/";
}
function isNonEmptyURL(url) {
  return url && url !== "/";
}
function joinURL(base, ...input) {
  let url = base || "";
  for (const segment of input.filter((url2) => isNonEmptyURL(url2))) {
    if (url) {
      const _segment = segment.replace(JOIN_LEADING_SLASH_RE, "");
      url = withTrailingSlash(url) + _segment;
    } else {
      url = segment;
    }
  }
  return url;
}
function joinRelativeURL(..._input) {
  const JOIN_SEGMENT_SPLIT_RE = /\/(?!\/)/;
  const input = _input.filter(Boolean);
  const segments = [];
  let segmentsDepth = 0;
  for (const i of input) {
    if (!i || i === "/") {
      continue;
    }
    for (const [sindex, s] of i.split(JOIN_SEGMENT_SPLIT_RE).entries()) {
      if (!s || s === ".") {
        continue;
      }
      if (s === "..") {
        if (segments.length === 1 && hasProtocol(segments[0])) {
          continue;
        }
        segments.pop();
        segmentsDepth--;
        continue;
      }
      if (sindex === 1 && segments[segments.length - 1]?.endsWith(":/")) {
        segments[segments.length - 1] += "/" + s;
        continue;
      }
      segments.push(s);
      segmentsDepth++;
    }
  }
  let url = segments.join("/");
  if (segmentsDepth >= 0) {
    if (input[0]?.startsWith("/") && !url.startsWith("/")) {
      url = "/" + url;
    } else if (input[0]?.startsWith("./") && !url.startsWith("./")) {
      url = "./" + url;
    }
  } else {
    url = "../".repeat(-1 * segmentsDepth) + url;
  }
  if (input[input.length - 1]?.endsWith("/") && !url.endsWith("/")) {
    url += "/";
  }
  return url;
}

const protocolRelative = Symbol.for("ufo:protocolRelative");
function parseURL(input = "", defaultProto) {
  const _specialProtoMatch = input.match(
    /^[\s\0]*(blob:|data:|javascript:|vbscript:)(.*)/i
  );
  if (_specialProtoMatch) {
    const [, _proto, _pathname = ""] = _specialProtoMatch;
    return {
      protocol: _proto.toLowerCase(),
      pathname: _pathname,
      href: _proto + _pathname,
      auth: "",
      host: "",
      search: "",
      hash: ""
    };
  }
  if (!hasProtocol(input, { acceptRelative: true })) {
    return parsePath(input);
  }
  const [, protocol = "", auth, hostAndPath = ""] = input.replace(/\\/g, "/").match(/^[\s\0]*([\w+.-]{2,}:)?\/\/([^/@]+@)?(.*)/) || [];
  let [, host = "", path = ""] = hostAndPath.match(/([^#/?]*)(.*)?/) || [];
  if (protocol === "file:") {
    path = path.replace(/\/(?=[A-Za-z]:)/, "");
  }
  const { pathname, search, hash } = parsePath(path);
  return {
    protocol: protocol.toLowerCase(),
    auth: auth ? auth.slice(0, Math.max(0, auth.length - 1)) : "",
    host,
    pathname,
    search,
    hash,
    [protocolRelative]: !protocol
  };
}
function parsePath(input = "") {
  const [pathname = "", search = "", hash = ""] = (input.match(/([^#?]*)(\?[^#]*)?(#.*)?/) || []).splice(1);
  return {
    pathname,
    search,
    hash
  };
}
function stringifyParsedURL(parsed) {
  const pathname = parsed.pathname || "";
  const search = parsed.search ? (parsed.search.startsWith("?") ? "" : "?") + parsed.search : "";
  const hash = parsed.hash || "";
  const auth = parsed.auth ? parsed.auth + "@" : "";
  const host = parsed.host || "";
  const proto = parsed.protocol || parsed[protocolRelative] ? (parsed.protocol || "") + "//" : "";
  return proto + auth + host + pathname + search + hash;
}

const defaults = Object.freeze({
  ignoreUnknown: false,
  respectType: false,
  respectFunctionNames: false,
  respectFunctionProperties: false,
  unorderedObjects: true,
  unorderedArrays: false,
  unorderedSets: false,
  excludeKeys: undefined,
  excludeValues: undefined,
  replacer: undefined
});
function objectHash(object, options) {
  if (options) {
    options = { ...defaults, ...options };
  } else {
    options = defaults;
  }
  const hasher = createHasher(options);
  hasher.dispatch(object);
  return hasher.toString();
}
const defaultPrototypesKeys = Object.freeze([
  "prototype",
  "__proto__",
  "constructor"
]);
function createHasher(options) {
  let buff = "";
  let context = /* @__PURE__ */ new Map();
  const write = (str) => {
    buff += str;
  };
  return {
    toString() {
      return buff;
    },
    getContext() {
      return context;
    },
    dispatch(value) {
      if (options.replacer) {
        value = options.replacer(value);
      }
      const type = value === null ? "null" : typeof value;
      return this[type](value);
    },
    object(object) {
      if (object && typeof object.toJSON === "function") {
        return this.object(object.toJSON());
      }
      const objString = Object.prototype.toString.call(object);
      let objType = "";
      const objectLength = objString.length;
      if (objectLength < 10) {
        objType = "unknown:[" + objString + "]";
      } else {
        objType = objString.slice(8, objectLength - 1);
      }
      objType = objType.toLowerCase();
      let objectNumber = null;
      if ((objectNumber = context.get(object)) === undefined) {
        context.set(object, context.size);
      } else {
        return this.dispatch("[CIRCULAR:" + objectNumber + "]");
      }
      if (typeof Buffer !== "undefined" && Buffer.isBuffer && Buffer.isBuffer(object)) {
        write("buffer:");
        return write(object.toString("utf8"));
      }
      if (objType !== "object" && objType !== "function" && objType !== "asyncfunction") {
        if (this[objType]) {
          this[objType](object);
        } else if (!options.ignoreUnknown) {
          this.unkown(object, objType);
        }
      } else {
        let keys = Object.keys(object);
        if (options.unorderedObjects) {
          keys = keys.sort();
        }
        let extraKeys = [];
        if (options.respectType !== false && !isNativeFunction(object)) {
          extraKeys = defaultPrototypesKeys;
        }
        if (options.excludeKeys) {
          keys = keys.filter((key) => {
            return !options.excludeKeys(key);
          });
          extraKeys = extraKeys.filter((key) => {
            return !options.excludeKeys(key);
          });
        }
        write("object:" + (keys.length + extraKeys.length) + ":");
        const dispatchForKey = (key) => {
          this.dispatch(key);
          write(":");
          if (!options.excludeValues) {
            this.dispatch(object[key]);
          }
          write(",");
        };
        for (const key of keys) {
          dispatchForKey(key);
        }
        for (const key of extraKeys) {
          dispatchForKey(key);
        }
      }
    },
    array(arr, unordered) {
      unordered = unordered === undefined ? options.unorderedArrays !== false : unordered;
      write("array:" + arr.length + ":");
      if (!unordered || arr.length <= 1) {
        for (const entry of arr) {
          this.dispatch(entry);
        }
        return;
      }
      const contextAdditions = /* @__PURE__ */ new Map();
      const entries = arr.map((entry) => {
        const hasher = createHasher(options);
        hasher.dispatch(entry);
        for (const [key, value] of hasher.getContext()) {
          contextAdditions.set(key, value);
        }
        return hasher.toString();
      });
      context = contextAdditions;
      entries.sort();
      return this.array(entries, false);
    },
    date(date) {
      return write("date:" + date.toJSON());
    },
    symbol(sym) {
      return write("symbol:" + sym.toString());
    },
    unkown(value, type) {
      write(type);
      if (!value) {
        return;
      }
      write(":");
      if (value && typeof value.entries === "function") {
        return this.array(
          Array.from(value.entries()),
          true
          /* ordered */
        );
      }
    },
    error(err) {
      return write("error:" + err.toString());
    },
    boolean(bool) {
      return write("bool:" + bool);
    },
    string(string) {
      write("string:" + string.length + ":");
      write(string);
    },
    function(fn) {
      write("fn:");
      if (isNativeFunction(fn)) {
        this.dispatch("[native]");
      } else {
        this.dispatch(fn.toString());
      }
      if (options.respectFunctionNames !== false) {
        this.dispatch("function-name:" + String(fn.name));
      }
      if (options.respectFunctionProperties) {
        this.object(fn);
      }
    },
    number(number) {
      return write("number:" + number);
    },
    xml(xml) {
      return write("xml:" + xml.toString());
    },
    null() {
      return write("Null");
    },
    undefined() {
      return write("Undefined");
    },
    regexp(regex) {
      return write("regex:" + regex.toString());
    },
    uint8array(arr) {
      write("uint8array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    uint8clampedarray(arr) {
      write("uint8clampedarray:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    int8array(arr) {
      write("int8array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    uint16array(arr) {
      write("uint16array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    int16array(arr) {
      write("int16array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    uint32array(arr) {
      write("uint32array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    int32array(arr) {
      write("int32array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    float32array(arr) {
      write("float32array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    float64array(arr) {
      write("float64array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    arraybuffer(arr) {
      write("arraybuffer:");
      return this.dispatch(new Uint8Array(arr));
    },
    url(url) {
      return write("url:" + url.toString());
    },
    map(map) {
      write("map:");
      const arr = [...map];
      return this.array(arr, options.unorderedSets !== false);
    },
    set(set) {
      write("set:");
      const arr = [...set];
      return this.array(arr, options.unorderedSets !== false);
    },
    file(file) {
      write("file:");
      return this.dispatch([file.name, file.size, file.type, file.lastModfied]);
    },
    blob() {
      if (options.ignoreUnknown) {
        return write("[blob]");
      }
      throw new Error(
        'Hashing Blob objects is currently not supported\nUse "options.replacer" or "options.ignoreUnknown"\n'
      );
    },
    domwindow() {
      return write("domwindow");
    },
    bigint(number) {
      return write("bigint:" + number.toString());
    },
    /* Node.js standard native objects */
    process() {
      return write("process");
    },
    timer() {
      return write("timer");
    },
    pipe() {
      return write("pipe");
    },
    tcp() {
      return write("tcp");
    },
    udp() {
      return write("udp");
    },
    tty() {
      return write("tty");
    },
    statwatcher() {
      return write("statwatcher");
    },
    securecontext() {
      return write("securecontext");
    },
    connection() {
      return write("connection");
    },
    zlib() {
      return write("zlib");
    },
    context() {
      return write("context");
    },
    nodescript() {
      return write("nodescript");
    },
    httpparser() {
      return write("httpparser");
    },
    dataview() {
      return write("dataview");
    },
    signal() {
      return write("signal");
    },
    fsevent() {
      return write("fsevent");
    },
    tlswrap() {
      return write("tlswrap");
    }
  };
}
const nativeFunc = "[native code] }";
const nativeFuncLength = nativeFunc.length;
function isNativeFunction(f) {
  if (typeof f !== "function") {
    return false;
  }
  return Function.prototype.toString.call(f).slice(-nativeFuncLength) === nativeFunc;
}

var __defProp$1 = Object.defineProperty;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$1 = (obj, key, value) => {
  __defNormalProp$1(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class WordArray {
  constructor(words, sigBytes) {
    __publicField$1(this, "words");
    __publicField$1(this, "sigBytes");
    words = this.words = words || [];
    this.sigBytes = sigBytes === undefined ? words.length * 4 : sigBytes;
  }
  toString(encoder) {
    return (encoder || Hex).stringify(this);
  }
  concat(wordArray) {
    this.clamp();
    if (this.sigBytes % 4) {
      for (let i = 0; i < wordArray.sigBytes; i++) {
        const thatByte = wordArray.words[i >>> 2] >>> 24 - i % 4 * 8 & 255;
        this.words[this.sigBytes + i >>> 2] |= thatByte << 24 - (this.sigBytes + i) % 4 * 8;
      }
    } else {
      for (let j = 0; j < wordArray.sigBytes; j += 4) {
        this.words[this.sigBytes + j >>> 2] = wordArray.words[j >>> 2];
      }
    }
    this.sigBytes += wordArray.sigBytes;
    return this;
  }
  clamp() {
    this.words[this.sigBytes >>> 2] &= 4294967295 << 32 - this.sigBytes % 4 * 8;
    this.words.length = Math.ceil(this.sigBytes / 4);
  }
  clone() {
    return new WordArray([...this.words]);
  }
}
const Hex = {
  stringify(wordArray) {
    const hexChars = [];
    for (let i = 0; i < wordArray.sigBytes; i++) {
      const bite = wordArray.words[i >>> 2] >>> 24 - i % 4 * 8 & 255;
      hexChars.push((bite >>> 4).toString(16), (bite & 15).toString(16));
    }
    return hexChars.join("");
  }
};
const Base64 = {
  stringify(wordArray) {
    const keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const base64Chars = [];
    for (let i = 0; i < wordArray.sigBytes; i += 3) {
      const byte1 = wordArray.words[i >>> 2] >>> 24 - i % 4 * 8 & 255;
      const byte2 = wordArray.words[i + 1 >>> 2] >>> 24 - (i + 1) % 4 * 8 & 255;
      const byte3 = wordArray.words[i + 2 >>> 2] >>> 24 - (i + 2) % 4 * 8 & 255;
      const triplet = byte1 << 16 | byte2 << 8 | byte3;
      for (let j = 0; j < 4 && i * 8 + j * 6 < wordArray.sigBytes * 8; j++) {
        base64Chars.push(keyStr.charAt(triplet >>> 6 * (3 - j) & 63));
      }
    }
    return base64Chars.join("");
  }
};
const Latin1 = {
  parse(latin1Str) {
    const latin1StrLength = latin1Str.length;
    const words = [];
    for (let i = 0; i < latin1StrLength; i++) {
      words[i >>> 2] |= (latin1Str.charCodeAt(i) & 255) << 24 - i % 4 * 8;
    }
    return new WordArray(words, latin1StrLength);
  }
};
const Utf8 = {
  parse(utf8Str) {
    return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
  }
};
class BufferedBlockAlgorithm {
  constructor() {
    __publicField$1(this, "_data", new WordArray());
    __publicField$1(this, "_nDataBytes", 0);
    __publicField$1(this, "_minBufferSize", 0);
    __publicField$1(this, "blockSize", 512 / 32);
  }
  reset() {
    this._data = new WordArray();
    this._nDataBytes = 0;
  }
  _append(data) {
    if (typeof data === "string") {
      data = Utf8.parse(data);
    }
    this._data.concat(data);
    this._nDataBytes += data.sigBytes;
  }
  _doProcessBlock(_dataWords, _offset) {
  }
  _process(doFlush) {
    let processedWords;
    let nBlocksReady = this._data.sigBytes / (this.blockSize * 4);
    if (doFlush) {
      nBlocksReady = Math.ceil(nBlocksReady);
    } else {
      nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
    }
    const nWordsReady = nBlocksReady * this.blockSize;
    const nBytesReady = Math.min(nWordsReady * 4, this._data.sigBytes);
    if (nWordsReady) {
      for (let offset = 0; offset < nWordsReady; offset += this.blockSize) {
        this._doProcessBlock(this._data.words, offset);
      }
      processedWords = this._data.words.splice(0, nWordsReady);
      this._data.sigBytes -= nBytesReady;
    }
    return new WordArray(processedWords, nBytesReady);
  }
}
class Hasher extends BufferedBlockAlgorithm {
  update(messageUpdate) {
    this._append(messageUpdate);
    this._process();
    return this;
  }
  finalize(messageUpdate) {
    if (messageUpdate) {
      this._append(messageUpdate);
    }
  }
}

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, key + "" , value);
  return value;
};
const H = [
  1779033703,
  -1150833019,
  1013904242,
  -1521486534,
  1359893119,
  -1694144372,
  528734635,
  1541459225
];
const K = [
  1116352408,
  1899447441,
  -1245643825,
  -373957723,
  961987163,
  1508970993,
  -1841331548,
  -1424204075,
  -670586216,
  310598401,
  607225278,
  1426881987,
  1925078388,
  -2132889090,
  -1680079193,
  -1046744716,
  -459576895,
  -272742522,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  -1740746414,
  -1473132947,
  -1341970488,
  -1084653625,
  -958395405,
  -710438585,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  -2117940946,
  -1838011259,
  -1564481375,
  -1474664885,
  -1035236496,
  -949202525,
  -778901479,
  -694614492,
  -200395387,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  -2067236844,
  -1933114872,
  -1866530822,
  -1538233109,
  -1090935817,
  -965641998
];
const W = [];
class SHA256 extends Hasher {
  constructor() {
    super(...arguments);
    __publicField(this, "_hash", new WordArray([...H]));
  }
  /**
   * Resets the internal state of the hash object to initial values.
   */
  reset() {
    super.reset();
    this._hash = new WordArray([...H]);
  }
  _doProcessBlock(M, offset) {
    const H2 = this._hash.words;
    let a = H2[0];
    let b = H2[1];
    let c = H2[2];
    let d = H2[3];
    let e = H2[4];
    let f = H2[5];
    let g = H2[6];
    let h = H2[7];
    for (let i = 0; i < 64; i++) {
      if (i < 16) {
        W[i] = M[offset + i] | 0;
      } else {
        const gamma0x = W[i - 15];
        const gamma0 = (gamma0x << 25 | gamma0x >>> 7) ^ (gamma0x << 14 | gamma0x >>> 18) ^ gamma0x >>> 3;
        const gamma1x = W[i - 2];
        const gamma1 = (gamma1x << 15 | gamma1x >>> 17) ^ (gamma1x << 13 | gamma1x >>> 19) ^ gamma1x >>> 10;
        W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16];
      }
      const ch = e & f ^ ~e & g;
      const maj = a & b ^ a & c ^ b & c;
      const sigma0 = (a << 30 | a >>> 2) ^ (a << 19 | a >>> 13) ^ (a << 10 | a >>> 22);
      const sigma1 = (e << 26 | e >>> 6) ^ (e << 21 | e >>> 11) ^ (e << 7 | e >>> 25);
      const t1 = h + sigma1 + ch + K[i] + W[i];
      const t2 = sigma0 + maj;
      h = g;
      g = f;
      f = e;
      e = d + t1 | 0;
      d = c;
      c = b;
      b = a;
      a = t1 + t2 | 0;
    }
    H2[0] = H2[0] + a | 0;
    H2[1] = H2[1] + b | 0;
    H2[2] = H2[2] + c | 0;
    H2[3] = H2[3] + d | 0;
    H2[4] = H2[4] + e | 0;
    H2[5] = H2[5] + f | 0;
    H2[6] = H2[6] + g | 0;
    H2[7] = H2[7] + h | 0;
  }
  /**
   * Finishes the hash calculation and returns the hash as a WordArray.
   *
   * @param {string} messageUpdate - Additional message content to include in the hash.
   * @returns {WordArray} The finalised hash as a WordArray.
   */
  finalize(messageUpdate) {
    super.finalize(messageUpdate);
    const nBitsTotal = this._nDataBytes * 8;
    const nBitsLeft = this._data.sigBytes * 8;
    this._data.words[nBitsLeft >>> 5] |= 128 << 24 - nBitsLeft % 32;
    this._data.words[(nBitsLeft + 64 >>> 9 << 4) + 14] = Math.floor(
      nBitsTotal / 4294967296
    );
    this._data.words[(nBitsLeft + 64 >>> 9 << 4) + 15] = nBitsTotal;
    this._data.sigBytes = this._data.words.length * 4;
    this._process();
    return this._hash;
  }
}
function sha256base64(message) {
  return new SHA256().finalize(message).toString(Base64);
}

function hash(object, options = {}) {
  const hashed = typeof object === "string" ? object : objectHash(object, options);
  return sha256base64(hashed).slice(0, 10);
}

const NODE_TYPES = {
  NORMAL: 0,
  WILDCARD: 1,
  PLACEHOLDER: 2
};

function createRouter$1(options = {}) {
  const ctx = {
    options,
    rootNode: createRadixNode(),
    staticRoutesMap: {}
  };
  const normalizeTrailingSlash = (p) => options.strictTrailingSlash ? p : p.replace(/\/$/, "") || "/";
  if (options.routes) {
    for (const path in options.routes) {
      insert(ctx, normalizeTrailingSlash(path), options.routes[path]);
    }
  }
  return {
    ctx,
    lookup: (path) => lookup(ctx, normalizeTrailingSlash(path)),
    insert: (path, data) => insert(ctx, normalizeTrailingSlash(path), data),
    remove: (path) => remove(ctx, normalizeTrailingSlash(path))
  };
}
function lookup(ctx, path) {
  const staticPathNode = ctx.staticRoutesMap[path];
  if (staticPathNode) {
    return staticPathNode.data;
  }
  const sections = path.split("/");
  const params = {};
  let paramsFound = false;
  let wildcardNode = null;
  let node = ctx.rootNode;
  let wildCardParam = null;
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (node.wildcardChildNode !== null) {
      wildcardNode = node.wildcardChildNode;
      wildCardParam = sections.slice(i).join("/");
    }
    const nextNode = node.children.get(section);
    if (nextNode === undefined) {
      if (node && node.placeholderChildren.length > 1) {
        const remaining = sections.length - i;
        node = node.placeholderChildren.find((c) => c.maxDepth === remaining) || null;
      } else {
        node = node.placeholderChildren[0] || null;
      }
      if (!node) {
        break;
      }
      if (node.paramName) {
        params[node.paramName] = section;
      }
      paramsFound = true;
    } else {
      node = nextNode;
    }
  }
  if ((node === null || node.data === null) && wildcardNode !== null) {
    node = wildcardNode;
    params[node.paramName || "_"] = wildCardParam;
    paramsFound = true;
  }
  if (!node) {
    return null;
  }
  if (paramsFound) {
    return {
      ...node.data,
      params: paramsFound ? params : undefined
    };
  }
  return node.data;
}
function insert(ctx, path, data) {
  let isStaticRoute = true;
  const sections = path.split("/");
  let node = ctx.rootNode;
  let _unnamedPlaceholderCtr = 0;
  const matchedNodes = [node];
  for (const section of sections) {
    let childNode;
    if (childNode = node.children.get(section)) {
      node = childNode;
    } else {
      const type = getNodeType(section);
      childNode = createRadixNode({ type, parent: node });
      node.children.set(section, childNode);
      if (type === NODE_TYPES.PLACEHOLDER) {
        childNode.paramName = section === "*" ? `_${_unnamedPlaceholderCtr++}` : section.slice(1);
        node.placeholderChildren.push(childNode);
        isStaticRoute = false;
      } else if (type === NODE_TYPES.WILDCARD) {
        node.wildcardChildNode = childNode;
        childNode.paramName = section.slice(
          3
          /* "**:" */
        ) || "_";
        isStaticRoute = false;
      }
      matchedNodes.push(childNode);
      node = childNode;
    }
  }
  for (const [depth, node2] of matchedNodes.entries()) {
    node2.maxDepth = Math.max(matchedNodes.length - depth, node2.maxDepth || 0);
  }
  node.data = data;
  if (isStaticRoute === true) {
    ctx.staticRoutesMap[path] = node;
  }
  return node;
}
function remove(ctx, path) {
  let success = false;
  const sections = path.split("/");
  let node = ctx.rootNode;
  for (const section of sections) {
    node = node.children.get(section);
    if (!node) {
      return success;
    }
  }
  if (node.data) {
    const lastSection = sections.at(-1) || "";
    node.data = null;
    if (Object.keys(node.children).length === 0 && node.parent) {
      node.parent.children.delete(lastSection);
      node.parent.wildcardChildNode = null;
      node.parent.placeholderChildren = [];
    }
    success = true;
  }
  return success;
}
function createRadixNode(options = {}) {
  return {
    type: options.type || NODE_TYPES.NORMAL,
    maxDepth: 0,
    parent: options.parent || null,
    children: /* @__PURE__ */ new Map(),
    data: options.data || null,
    paramName: options.paramName || null,
    wildcardChildNode: null,
    placeholderChildren: []
  };
}
function getNodeType(str) {
  if (str.startsWith("**")) {
    return NODE_TYPES.WILDCARD;
  }
  if (str[0] === ":" || str === "*") {
    return NODE_TYPES.PLACEHOLDER;
  }
  return NODE_TYPES.NORMAL;
}

function toRouteMatcher(router) {
  const table = _routerNodeToTable("", router.ctx.rootNode);
  return _createMatcher(table, router.ctx.options.strictTrailingSlash);
}
function _createMatcher(table, strictTrailingSlash) {
  return {
    ctx: { table },
    matchAll: (path) => _matchRoutes(path, table, strictTrailingSlash)
  };
}
function _createRouteTable() {
  return {
    static: /* @__PURE__ */ new Map(),
    wildcard: /* @__PURE__ */ new Map(),
    dynamic: /* @__PURE__ */ new Map()
  };
}
function _matchRoutes(path, table, strictTrailingSlash) {
  if (strictTrailingSlash !== true && path.endsWith("/")) {
    path = path.slice(0, -1) || "/";
  }
  const matches = [];
  for (const [key, value] of _sortRoutesMap(table.wildcard)) {
    if (path === key || path.startsWith(key + "/")) {
      matches.push(value);
    }
  }
  for (const [key, value] of _sortRoutesMap(table.dynamic)) {
    if (path.startsWith(key + "/")) {
      const subPath = "/" + path.slice(key.length).split("/").splice(2).join("/");
      matches.push(..._matchRoutes(subPath, value));
    }
  }
  const staticMatch = table.static.get(path);
  if (staticMatch) {
    matches.push(staticMatch);
  }
  return matches.filter(Boolean);
}
function _sortRoutesMap(m) {
  return [...m.entries()].sort((a, b) => a[0].length - b[0].length);
}
function _routerNodeToTable(initialPath, initialNode) {
  const table = _createRouteTable();
  function _addNode(path, node) {
    if (path) {
      if (node.type === NODE_TYPES.NORMAL && !(path.includes("*") || path.includes(":"))) {
        if (node.data) {
          table.static.set(path, node.data);
        }
      } else if (node.type === NODE_TYPES.WILDCARD) {
        table.wildcard.set(path.replace("/**", ""), node.data);
      } else if (node.type === NODE_TYPES.PLACEHOLDER) {
        const subTable = _routerNodeToTable("", node);
        if (node.data) {
          subTable.static.set("/", node.data);
        }
        table.dynamic.set(path.replace(/\/\*|\/:\w+/, ""), subTable);
        return;
      }
    }
    for (const [childPath, child] of node.children.entries()) {
      _addNode(`${path}/${childPath}`.replace("//", "/"), child);
    }
  }
  _addNode(initialPath, initialNode);
  return table;
}

function isPlainObject(value) {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== null && prototype !== Object.prototype && Object.getPrototypeOf(prototype) !== null) {
    return false;
  }
  if (Symbol.iterator in value) {
    return false;
  }
  if (Symbol.toStringTag in value) {
    return Object.prototype.toString.call(value) === "[object Module]";
  }
  return true;
}

function _defu(baseObject, defaults, namespace = ".", merger) {
  if (!isPlainObject(defaults)) {
    return _defu(baseObject, {}, namespace, merger);
  }
  const object = Object.assign({}, defaults);
  for (const key in baseObject) {
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = baseObject[key];
    if (value === null || value === undefined) {
      continue;
    }
    if (merger && merger(object, key, value, namespace)) {
      continue;
    }
    if (Array.isArray(value) && Array.isArray(object[key])) {
      object[key] = [...value, ...object[key]];
    } else if (isPlainObject(value) && isPlainObject(object[key])) {
      object[key] = _defu(
        value,
        object[key],
        (namespace ? `${namespace}.` : "") + key.toString(),
        merger
      );
    } else {
      object[key] = value;
    }
  }
  return object;
}
function createDefu(merger) {
  return (...arguments_) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    arguments_.reduce((p, c) => _defu(p, c, "", merger), {})
  );
}
const defu = createDefu();
const defuFn = createDefu((object, key, currentValue) => {
  if (object[key] !== undefined && typeof currentValue === "function") {
    object[key] = currentValue(object[key]);
    return true;
  }
});

function rawHeaders(headers) {
  const rawHeaders2 = [];
  for (const key in headers) {
    if (Array.isArray(headers[key])) {
      for (const h of headers[key]) {
        rawHeaders2.push(key, h);
      }
    } else {
      rawHeaders2.push(key, headers[key]);
    }
  }
  return rawHeaders2;
}
function mergeFns(...functions) {
  return function(...args) {
    for (const fn of functions) {
      fn(...args);
    }
  };
}
function createNotImplementedError(name) {
  throw new Error(`[unenv] ${name} is not implemented yet!`);
}

let defaultMaxListeners = 10;
let EventEmitter$1 = class EventEmitter {
  __unenv__ = true;
  _events = /* @__PURE__ */ Object.create(null);
  _maxListeners;
  static get defaultMaxListeners() {
    return defaultMaxListeners;
  }
  static set defaultMaxListeners(arg) {
    if (typeof arg !== "number" || arg < 0 || Number.isNaN(arg)) {
      throw new RangeError(
        'The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + "."
      );
    }
    defaultMaxListeners = arg;
  }
  setMaxListeners(n) {
    if (typeof n !== "number" || n < 0 || Number.isNaN(n)) {
      throw new RangeError(
        'The value of "n" is out of range. It must be a non-negative number. Received ' + n + "."
      );
    }
    this._maxListeners = n;
    return this;
  }
  getMaxListeners() {
    return _getMaxListeners(this);
  }
  emit(type, ...args) {
    if (!this._events[type] || this._events[type].length === 0) {
      return false;
    }
    if (type === "error") {
      let er;
      if (args.length > 0) {
        er = args[0];
      }
      if (er instanceof Error) {
        throw er;
      }
      const err = new Error(
        "Unhandled error." + (er ? " (" + er.message + ")" : "")
      );
      err.context = er;
      throw err;
    }
    for (const _listener of this._events[type]) {
      (_listener.listener || _listener).apply(this, args);
    }
    return true;
  }
  addListener(type, listener) {
    return _addListener(this, type, listener, false);
  }
  on(type, listener) {
    return _addListener(this, type, listener, false);
  }
  prependListener(type, listener) {
    return _addListener(this, type, listener, true);
  }
  once(type, listener) {
    return this.on(type, _wrapOnce(this, type, listener));
  }
  prependOnceListener(type, listener) {
    return this.prependListener(type, _wrapOnce(this, type, listener));
  }
  removeListener(type, listener) {
    return _removeListener(this, type, listener);
  }
  off(type, listener) {
    return this.removeListener(type, listener);
  }
  removeAllListeners(type) {
    return _removeAllListeners(this, type);
  }
  listeners(type) {
    return _listeners(this, type, true);
  }
  rawListeners(type) {
    return _listeners(this, type, false);
  }
  listenerCount(type) {
    return this.rawListeners(type).length;
  }
  eventNames() {
    return Object.keys(this._events);
  }
};
function _addListener(target, type, listener, prepend) {
  _checkListener(listener);
  if (target._events.newListener !== undefined) {
    target.emit("newListener", type, listener.listener || listener);
  }
  if (!target._events[type]) {
    target._events[type] = [];
  }
  if (prepend) {
    target._events[type].unshift(listener);
  } else {
    target._events[type].push(listener);
  }
  const maxListeners = _getMaxListeners(target);
  if (maxListeners > 0 && target._events[type].length > maxListeners && !target._events[type].warned) {
    target._events[type].warned = true;
    const warning = new Error(
      `[unenv] Possible EventEmitter memory leak detected. ${target._events[type].length} ${type} listeners added. Use emitter.setMaxListeners() to increase limit`
    );
    warning.name = "MaxListenersExceededWarning";
    warning.emitter = target;
    warning.type = type;
    warning.count = target._events[type]?.length;
    console.warn(warning);
  }
  return target;
}
function _removeListener(target, type, listener) {
  _checkListener(listener);
  if (!target._events[type] || target._events[type].length === 0) {
    return target;
  }
  const lenBeforeFilter = target._events[type].length;
  target._events[type] = target._events[type].filter((fn) => fn !== listener);
  if (lenBeforeFilter === target._events[type].length) {
    return target;
  }
  if (target._events.removeListener) {
    target.emit("removeListener", type, listener.listener || listener);
  }
  if (target._events[type].length === 0) {
    delete target._events[type];
  }
  return target;
}
function _removeAllListeners(target, type) {
  if (!target._events[type] || target._events[type].length === 0) {
    return target;
  }
  if (target._events.removeListener) {
    for (const _listener of target._events[type]) {
      target.emit("removeListener", type, _listener.listener || _listener);
    }
  }
  delete target._events[type];
  return target;
}
function _wrapOnce(target, type, listener) {
  let fired = false;
  const wrapper = (...args) => {
    if (fired) {
      return;
    }
    target.removeListener(type, wrapper);
    fired = true;
    return args.length === 0 ? listener.call(target) : listener.apply(target, args);
  };
  wrapper.listener = listener;
  return wrapper;
}
function _getMaxListeners(target) {
  return target._maxListeners ?? EventEmitter$1.defaultMaxListeners;
}
function _listeners(target, type, unwrap) {
  let listeners = target._events[type];
  if (typeof listeners === "function") {
    listeners = [listeners];
  }
  return unwrap ? listeners.map((l) => l.listener || l) : listeners;
}
function _checkListener(listener) {
  if (typeof listener !== "function") {
    throw new TypeError(
      'The "listener" argument must be of type Function. Received type ' + typeof listener
    );
  }
}

const EventEmitter = globalThis.EventEmitter || EventEmitter$1;

class _Readable extends EventEmitter {
  __unenv__ = true;
  readableEncoding = null;
  readableEnded = true;
  readableFlowing = false;
  readableHighWaterMark = 0;
  readableLength = 0;
  readableObjectMode = false;
  readableAborted = false;
  readableDidRead = false;
  closed = false;
  errored = null;
  readable = false;
  destroyed = false;
  static from(_iterable, options) {
    return new _Readable(options);
  }
  constructor(_opts) {
    super();
  }
  _read(_size) {
  }
  read(_size) {
  }
  setEncoding(_encoding) {
    return this;
  }
  pause() {
    return this;
  }
  resume() {
    return this;
  }
  isPaused() {
    return true;
  }
  unpipe(_destination) {
    return this;
  }
  unshift(_chunk, _encoding) {
  }
  wrap(_oldStream) {
    return this;
  }
  push(_chunk, _encoding) {
    return false;
  }
  _destroy(_error, _callback) {
    this.removeAllListeners();
  }
  destroy(error) {
    this.destroyed = true;
    this._destroy(error);
    return this;
  }
  pipe(_destenition, _options) {
    return {};
  }
  compose(stream, options) {
    throw new Error("[unenv] Method not implemented.");
  }
  [Symbol.asyncDispose]() {
    this.destroy();
    return Promise.resolve();
  }
  // eslint-disable-next-line require-yield
  async *[Symbol.asyncIterator]() {
    throw createNotImplementedError("Readable.asyncIterator");
  }
  iterator(options) {
    throw createNotImplementedError("Readable.iterator");
  }
  map(fn, options) {
    throw createNotImplementedError("Readable.map");
  }
  filter(fn, options) {
    throw createNotImplementedError("Readable.filter");
  }
  forEach(fn, options) {
    throw createNotImplementedError("Readable.forEach");
  }
  reduce(fn, initialValue, options) {
    throw createNotImplementedError("Readable.reduce");
  }
  find(fn, options) {
    throw createNotImplementedError("Readable.find");
  }
  findIndex(fn, options) {
    throw createNotImplementedError("Readable.findIndex");
  }
  some(fn, options) {
    throw createNotImplementedError("Readable.some");
  }
  toArray(options) {
    throw createNotImplementedError("Readable.toArray");
  }
  every(fn, options) {
    throw createNotImplementedError("Readable.every");
  }
  flatMap(fn, options) {
    throw createNotImplementedError("Readable.flatMap");
  }
  drop(limit, options) {
    throw createNotImplementedError("Readable.drop");
  }
  take(limit, options) {
    throw createNotImplementedError("Readable.take");
  }
  asIndexedPairs(options) {
    throw createNotImplementedError("Readable.asIndexedPairs");
  }
}
const Readable = globalThis.Readable || _Readable;

class _Writable extends EventEmitter {
  __unenv__ = true;
  writable = true;
  writableEnded = false;
  writableFinished = false;
  writableHighWaterMark = 0;
  writableLength = 0;
  writableObjectMode = false;
  writableCorked = 0;
  closed = false;
  errored = null;
  writableNeedDrain = false;
  destroyed = false;
  _data;
  _encoding = "utf-8";
  constructor(_opts) {
    super();
  }
  pipe(_destenition, _options) {
    return {};
  }
  _write(chunk, encoding, callback) {
    if (this.writableEnded) {
      if (callback) {
        callback();
      }
      return;
    }
    if (this._data === undefined) {
      this._data = chunk;
    } else {
      const a = typeof this._data === "string" ? Buffer.from(this._data, this._encoding || encoding || "utf8") : this._data;
      const b = typeof chunk === "string" ? Buffer.from(chunk, encoding || this._encoding || "utf8") : chunk;
      this._data = Buffer.concat([a, b]);
    }
    this._encoding = encoding;
    if (callback) {
      callback();
    }
  }
  _writev(_chunks, _callback) {
  }
  _destroy(_error, _callback) {
  }
  _final(_callback) {
  }
  write(chunk, arg2, arg3) {
    const encoding = typeof arg2 === "string" ? this._encoding : "utf-8";
    const cb = typeof arg2 === "function" ? arg2 : typeof arg3 === "function" ? arg3 : undefined;
    this._write(chunk, encoding, cb);
    return true;
  }
  setDefaultEncoding(_encoding) {
    return this;
  }
  end(arg1, arg2, arg3) {
    const callback = typeof arg1 === "function" ? arg1 : typeof arg2 === "function" ? arg2 : typeof arg3 === "function" ? arg3 : undefined;
    if (this.writableEnded) {
      if (callback) {
        callback();
      }
      return this;
    }
    const data = arg1 === callback ? undefined : arg1;
    if (data) {
      const encoding = arg2 === callback ? undefined : arg2;
      this.write(data, encoding, callback);
    }
    this.writableEnded = true;
    this.writableFinished = true;
    this.emit("close");
    this.emit("finish");
    return this;
  }
  cork() {
  }
  uncork() {
  }
  destroy(_error) {
    this.destroyed = true;
    delete this._data;
    this.removeAllListeners();
    return this;
  }
  compose(stream, options) {
    throw new Error("[h3] Method not implemented.");
  }
}
const Writable = globalThis.Writable || _Writable;

const __Duplex = class {
  allowHalfOpen = true;
  _destroy;
  constructor(readable = new Readable(), writable = new Writable()) {
    Object.assign(this, readable);
    Object.assign(this, writable);
    this._destroy = mergeFns(readable._destroy, writable._destroy);
  }
};
function getDuplex() {
  Object.assign(__Duplex.prototype, Readable.prototype);
  Object.assign(__Duplex.prototype, Writable.prototype);
  return __Duplex;
}
const _Duplex = /* @__PURE__ */ getDuplex();
const Duplex = globalThis.Duplex || _Duplex;

class Socket extends Duplex {
  __unenv__ = true;
  bufferSize = 0;
  bytesRead = 0;
  bytesWritten = 0;
  connecting = false;
  destroyed = false;
  pending = false;
  localAddress = "";
  localPort = 0;
  remoteAddress = "";
  remoteFamily = "";
  remotePort = 0;
  autoSelectFamilyAttemptedAddresses = [];
  readyState = "readOnly";
  constructor(_options) {
    super();
  }
  write(_buffer, _arg1, _arg2) {
    return false;
  }
  connect(_arg1, _arg2, _arg3) {
    return this;
  }
  end(_arg1, _arg2, _arg3) {
    return this;
  }
  setEncoding(_encoding) {
    return this;
  }
  pause() {
    return this;
  }
  resume() {
    return this;
  }
  setTimeout(_timeout, _callback) {
    return this;
  }
  setNoDelay(_noDelay) {
    return this;
  }
  setKeepAlive(_enable, _initialDelay) {
    return this;
  }
  address() {
    return {};
  }
  unref() {
    return this;
  }
  ref() {
    return this;
  }
  destroySoon() {
    this.destroy();
  }
  resetAndDestroy() {
    const err = new Error("ERR_SOCKET_CLOSED");
    err.code = "ERR_SOCKET_CLOSED";
    this.destroy(err);
    return this;
  }
}

class IncomingMessage extends Readable {
  __unenv__ = {};
  aborted = false;
  httpVersion = "1.1";
  httpVersionMajor = 1;
  httpVersionMinor = 1;
  complete = true;
  connection;
  socket;
  headers = {};
  trailers = {};
  method = "GET";
  url = "/";
  statusCode = 200;
  statusMessage = "";
  closed = false;
  errored = null;
  readable = false;
  constructor(socket) {
    super();
    this.socket = this.connection = socket || new Socket();
  }
  get rawHeaders() {
    return rawHeaders(this.headers);
  }
  get rawTrailers() {
    return [];
  }
  setTimeout(_msecs, _callback) {
    return this;
  }
  get headersDistinct() {
    return _distinct(this.headers);
  }
  get trailersDistinct() {
    return _distinct(this.trailers);
  }
}
function _distinct(obj) {
  const d = {};
  for (const [key, value] of Object.entries(obj)) {
    if (key) {
      d[key] = (Array.isArray(value) ? value : [value]).filter(
        Boolean
      );
    }
  }
  return d;
}

class ServerResponse extends Writable {
  __unenv__ = true;
  statusCode = 200;
  statusMessage = "";
  upgrading = false;
  chunkedEncoding = false;
  shouldKeepAlive = false;
  useChunkedEncodingByDefault = false;
  sendDate = false;
  finished = false;
  headersSent = false;
  strictContentLength = false;
  connection = null;
  socket = null;
  req;
  _headers = {};
  constructor(req) {
    super();
    this.req = req;
  }
  assignSocket(socket) {
    socket._httpMessage = this;
    this.socket = socket;
    this.connection = socket;
    this.emit("socket", socket);
    this._flush();
  }
  _flush() {
    this.flushHeaders();
  }
  detachSocket(_socket) {
  }
  writeContinue(_callback) {
  }
  writeHead(statusCode, arg1, arg2) {
    if (statusCode) {
      this.statusCode = statusCode;
    }
    if (typeof arg1 === "string") {
      this.statusMessage = arg1;
      arg1 = undefined;
    }
    const headers = arg2 || arg1;
    if (headers) {
      if (Array.isArray(headers)) ; else {
        for (const key in headers) {
          this.setHeader(key, headers[key]);
        }
      }
    }
    this.headersSent = true;
    return this;
  }
  writeProcessing() {
  }
  setTimeout(_msecs, _callback) {
    return this;
  }
  appendHeader(name, value) {
    name = name.toLowerCase();
    const current = this._headers[name];
    const all = [
      ...Array.isArray(current) ? current : [current],
      ...Array.isArray(value) ? value : [value]
    ].filter(Boolean);
    this._headers[name] = all.length > 1 ? all : all[0];
    return this;
  }
  setHeader(name, value) {
    this._headers[name.toLowerCase()] = value;
    return this;
  }
  getHeader(name) {
    return this._headers[name.toLowerCase()];
  }
  getHeaders() {
    return this._headers;
  }
  getHeaderNames() {
    return Object.keys(this._headers);
  }
  hasHeader(name) {
    return name.toLowerCase() in this._headers;
  }
  removeHeader(name) {
    delete this._headers[name.toLowerCase()];
  }
  addTrailers(_headers) {
  }
  flushHeaders() {
  }
  writeEarlyHints(_headers, cb) {
    if (typeof cb === "function") {
      cb();
    }
  }
}

function useBase(base, handler) {
  base = withoutTrailingSlash(base);
  if (!base || base === "/") {
    return handler;
  }
  return eventHandler(async (event) => {
    event.node.req.originalUrl = event.node.req.originalUrl || event.node.req.url || "/";
    const _path = event._path || event.node.req.url || "/";
    event._path = withoutBase(event.path || "/", base);
    event.node.req.url = event._path;
    try {
      return await handler(event);
    } finally {
      event._path = event.node.req.url = _path;
    }
  });
}

function hasProp(obj, prop) {
  try {
    return prop in obj;
  } catch {
    return false;
  }
}

class H3Error extends Error {
  static __h3_error__ = true;
  statusCode = 500;
  fatal = false;
  unhandled = false;
  statusMessage;
  data;
  cause;
  constructor(message, opts = {}) {
    super(message, opts);
    if (opts.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
  toJSON() {
    const obj = {
      message: this.message,
      statusCode: sanitizeStatusCode(this.statusCode, 500)
    };
    if (this.statusMessage) {
      obj.statusMessage = sanitizeStatusMessage(this.statusMessage);
    }
    if (this.data !== undefined) {
      obj.data = this.data;
    }
    return obj;
  }
}
function createError$1(input) {
  if (typeof input === "string") {
    return new H3Error(input);
  }
  if (isError(input)) {
    return input;
  }
  const err = new H3Error(input.message ?? input.statusMessage ?? "", {
    cause: input.cause || input
  });
  if (hasProp(input, "stack")) {
    try {
      Object.defineProperty(err, "stack", {
        get() {
          return input.stack;
        }
      });
    } catch {
      try {
        err.stack = input.stack;
      } catch {
      }
    }
  }
  if (input.data) {
    err.data = input.data;
  }
  if (input.statusCode) {
    err.statusCode = sanitizeStatusCode(input.statusCode, err.statusCode);
  } else if (input.status) {
    err.statusCode = sanitizeStatusCode(input.status, err.statusCode);
  }
  if (input.statusMessage) {
    err.statusMessage = input.statusMessage;
  } else if (input.statusText) {
    err.statusMessage = input.statusText;
  }
  if (err.statusMessage) {
    const originalMessage = err.statusMessage;
    const sanitizedMessage = sanitizeStatusMessage(err.statusMessage);
    if (sanitizedMessage !== originalMessage) {
      console.warn(
        "[h3] Please prefer using `message` for longer error messages instead of `statusMessage`. In the future, `statusMessage` will be sanitized by default."
      );
    }
  }
  if (input.fatal !== undefined) {
    err.fatal = input.fatal;
  }
  if (input.unhandled !== undefined) {
    err.unhandled = input.unhandled;
  }
  return err;
}
function sendError(event, error, debug) {
  if (event.handled) {
    return;
  }
  const h3Error = isError(error) ? error : createError$1(error);
  const responseBody = {
    statusCode: h3Error.statusCode,
    statusMessage: h3Error.statusMessage,
    stack: [],
    data: h3Error.data
  };
  if (debug) {
    responseBody.stack = (h3Error.stack || "").split("\n").map((l) => l.trim());
  }
  if (event.handled) {
    return;
  }
  const _code = Number.parseInt(h3Error.statusCode);
  setResponseStatus(event, _code, h3Error.statusMessage);
  event.node.res.setHeader("content-type", MIMES.json);
  event.node.res.end(JSON.stringify(responseBody, undefined, 2));
}
function isError(input) {
  return input?.constructor?.__h3_error__ === true;
}

function getQuery(event) {
  return getQuery$1(event.path || "");
}
function isMethod(event, expected, allowHead) {
  if (typeof expected === "string") {
    if (event.method === expected) {
      return true;
    }
  } else if (expected.includes(event.method)) {
    return true;
  }
  return false;
}
function assertMethod(event, expected, allowHead) {
  if (!isMethod(event, expected)) {
    throw createError$1({
      statusCode: 405,
      statusMessage: "HTTP method is not allowed."
    });
  }
}
function getRequestHeaders(event) {
  const _headers = {};
  for (const key in event.node.req.headers) {
    const val = event.node.req.headers[key];
    _headers[key] = Array.isArray(val) ? val.filter(Boolean).join(", ") : val;
  }
  return _headers;
}
function getRequestHeader(event, name) {
  const headers = getRequestHeaders(event);
  const value = headers[name.toLowerCase()];
  return value;
}

const RawBodySymbol = Symbol.for("h3RawBody");
const ParsedBodySymbol = Symbol.for("h3ParsedBody");
const PayloadMethods$1 = ["PATCH", "POST", "PUT", "DELETE"];
function readRawBody(event, encoding = "utf8") {
  assertMethod(event, PayloadMethods$1);
  const _rawBody = event._requestBody || event.web?.request?.body || event.node.req[RawBodySymbol] || event.node.req.rawBody || event.node.req.body;
  if (_rawBody) {
    const promise2 = Promise.resolve(_rawBody).then((_resolved) => {
      if (Buffer.isBuffer(_resolved)) {
        return _resolved;
      }
      if (typeof _resolved.pipeTo === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.pipeTo(
            new WritableStream({
              write(chunk) {
                chunks.push(chunk);
              },
              close() {
                resolve(Buffer.concat(chunks));
              },
              abort(reason) {
                reject(reason);
              }
            })
          ).catch(reject);
        });
      } else if (typeof _resolved.pipe === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.on("data", (chunk) => {
            chunks.push(chunk);
          }).on("end", () => {
            resolve(Buffer.concat(chunks));
          }).on("error", reject);
        });
      }
      if (_resolved.constructor === Object) {
        return Buffer.from(JSON.stringify(_resolved));
      }
      if (_resolved instanceof URLSearchParams) {
        return Buffer.from(_resolved.toString());
      }
      return Buffer.from(_resolved);
    });
    return encoding ? promise2.then((buff) => buff.toString(encoding)) : promise2;
  }
  if (!Number.parseInt(event.node.req.headers["content-length"] || "") && !String(event.node.req.headers["transfer-encoding"] ?? "").split(",").map((e) => e.trim()).filter(Boolean).includes("chunked")) {
    return Promise.resolve(undefined);
  }
  const promise = event.node.req[RawBodySymbol] = new Promise(
    (resolve, reject) => {
      const bodyData = [];
      event.node.req.on("error", (err) => {
        reject(err);
      }).on("data", (chunk) => {
        bodyData.push(chunk);
      }).on("end", () => {
        resolve(Buffer.concat(bodyData));
      });
    }
  );
  const result = encoding ? promise.then((buff) => buff.toString(encoding)) : promise;
  return result;
}
async function readBody(event, options = {}) {
  const request = event.node.req;
  if (hasProp(request, ParsedBodySymbol)) {
    return request[ParsedBodySymbol];
  }
  const contentType = request.headers["content-type"] || "";
  const body = await readRawBody(event);
  let parsed;
  if (contentType === "application/json") {
    parsed = _parseJSON(body, options.strict ?? true);
  } else if (contentType.startsWith("application/x-www-form-urlencoded")) {
    parsed = _parseURLEncodedBody(body);
  } else if (contentType.startsWith("text/")) {
    parsed = body;
  } else {
    parsed = _parseJSON(body, options.strict ?? false);
  }
  request[ParsedBodySymbol] = parsed;
  return parsed;
}
function getRequestWebStream(event) {
  if (!PayloadMethods$1.includes(event.method)) {
    return;
  }
  const bodyStream = event.web?.request?.body || event._requestBody;
  if (bodyStream) {
    return bodyStream;
  }
  const _hasRawBody = RawBodySymbol in event.node.req || "rawBody" in event.node.req || "body" in event.node.req || "__unenv__" in event.node.req;
  if (_hasRawBody) {
    return new ReadableStream({
      async start(controller) {
        const _rawBody = await readRawBody(event, false);
        if (_rawBody) {
          controller.enqueue(_rawBody);
        }
        controller.close();
      }
    });
  }
  return new ReadableStream({
    start: (controller) => {
      event.node.req.on("data", (chunk) => {
        controller.enqueue(chunk);
      });
      event.node.req.on("end", () => {
        controller.close();
      });
      event.node.req.on("error", (err) => {
        controller.error(err);
      });
    }
  });
}
function _parseJSON(body = "", strict) {
  if (!body) {
    return undefined;
  }
  try {
    return destr(body, { strict });
  } catch {
    throw createError$1({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "Invalid JSON body"
    });
  }
}
function _parseURLEncodedBody(body) {
  const form = new URLSearchParams(body);
  const parsedForm = /* @__PURE__ */ Object.create(null);
  for (const [key, value] of form.entries()) {
    if (hasProp(parsedForm, key)) {
      if (!Array.isArray(parsedForm[key])) {
        parsedForm[key] = [parsedForm[key]];
      }
      parsedForm[key].push(value);
    } else {
      parsedForm[key] = value;
    }
  }
  return parsedForm;
}

function handleCacheHeaders(event, opts) {
  const cacheControls = ["public", ...opts.cacheControls || []];
  let cacheMatched = false;
  if (opts.maxAge !== undefined) {
    cacheControls.push(`max-age=${+opts.maxAge}`, `s-maxage=${+opts.maxAge}`);
  }
  if (opts.modifiedTime) {
    const modifiedTime = new Date(opts.modifiedTime);
    const ifModifiedSince = event.node.req.headers["if-modified-since"];
    event.node.res.setHeader("last-modified", modifiedTime.toUTCString());
    if (ifModifiedSince && new Date(ifModifiedSince) >= opts.modifiedTime) {
      cacheMatched = true;
    }
  }
  if (opts.etag) {
    event.node.res.setHeader("etag", opts.etag);
    const ifNonMatch = event.node.req.headers["if-none-match"];
    if (ifNonMatch === opts.etag) {
      cacheMatched = true;
    }
  }
  event.node.res.setHeader("cache-control", cacheControls.join(", "));
  if (cacheMatched) {
    event.node.res.statusCode = 304;
    if (!event.handled) {
      event.node.res.end();
    }
    return true;
  }
  return false;
}

const MIMES = {
  html: "text/html",
  json: "application/json"
};

const DISALLOWED_STATUS_CHARS = /[^\u0009\u0020-\u007E]/g;
function sanitizeStatusMessage(statusMessage = "") {
  return statusMessage.replace(DISALLOWED_STATUS_CHARS, "");
}
function sanitizeStatusCode(statusCode, defaultStatusCode = 200) {
  if (!statusCode) {
    return defaultStatusCode;
  }
  if (typeof statusCode === "string") {
    statusCode = Number.parseInt(statusCode, 10);
  }
  if (statusCode < 100 || statusCode > 999) {
    return defaultStatusCode;
  }
  return statusCode;
}
function splitCookiesString(cookiesString) {
  if (Array.isArray(cookiesString)) {
    return cookiesString.flatMap((c) => splitCookiesString(c));
  }
  if (typeof cookiesString !== "string") {
    return [];
  }
  const cookiesStrings = [];
  let pos = 0;
  let start;
  let ch;
  let lastComma;
  let nextStart;
  let cookiesSeparatorFound;
  const skipWhitespace = () => {
    while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
      pos += 1;
    }
    return pos < cookiesString.length;
  };
  const notSpecialChar = () => {
    ch = cookiesString.charAt(pos);
    return ch !== "=" && ch !== ";" && ch !== ",";
  };
  while (pos < cookiesString.length) {
    start = pos;
    cookiesSeparatorFound = false;
    while (skipWhitespace()) {
      ch = cookiesString.charAt(pos);
      if (ch === ",") {
        lastComma = pos;
        pos += 1;
        skipWhitespace();
        nextStart = pos;
        while (pos < cookiesString.length && notSpecialChar()) {
          pos += 1;
        }
        if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
          cookiesSeparatorFound = true;
          pos = nextStart;
          cookiesStrings.push(cookiesString.slice(start, lastComma));
          start = pos;
        } else {
          pos = lastComma + 1;
        }
      } else {
        pos += 1;
      }
    }
    if (!cookiesSeparatorFound || pos >= cookiesString.length) {
      cookiesStrings.push(cookiesString.slice(start));
    }
  }
  return cookiesStrings;
}

const defer = typeof setImmediate === "undefined" ? (fn) => fn() : setImmediate;
function send(event, data, type) {
  if (type) {
    defaultContentType(event, type);
  }
  return new Promise((resolve) => {
    defer(() => {
      if (!event.handled) {
        event.node.res.end(data);
      }
      resolve();
    });
  });
}
function sendNoContent(event, code) {
  if (event.handled) {
    return;
  }
  if (!code && event.node.res.statusCode !== 200) {
    code = event.node.res.statusCode;
  }
  const _code = sanitizeStatusCode(code, 204);
  if (_code === 204) {
    event.node.res.removeHeader("content-length");
  }
  event.node.res.writeHead(_code);
  event.node.res.end();
}
function setResponseStatus(event, code, text) {
  if (code) {
    event.node.res.statusCode = sanitizeStatusCode(
      code,
      event.node.res.statusCode
    );
  }
  if (text) {
    event.node.res.statusMessage = sanitizeStatusMessage(text);
  }
}
function getResponseStatus(event) {
  return event.node.res.statusCode;
}
function getResponseStatusText(event) {
  return event.node.res.statusMessage;
}
function defaultContentType(event, type) {
  if (type && event.node.res.statusCode !== 304 && !event.node.res.getHeader("content-type")) {
    event.node.res.setHeader("content-type", type);
  }
}
function sendRedirect(event, location, code = 302) {
  event.node.res.statusCode = sanitizeStatusCode(
    code,
    event.node.res.statusCode
  );
  event.node.res.setHeader("location", location);
  const encodedLoc = location.replace(/"/g, "%22");
  const html = `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`;
  return send(event, html, MIMES.html);
}
function getResponseHeader(event, name) {
  return event.node.res.getHeader(name);
}
function setResponseHeaders(event, headers) {
  for (const [name, value] of Object.entries(headers)) {
    event.node.res.setHeader(
      name,
      value
    );
  }
}
const setHeaders = setResponseHeaders;
function setResponseHeader(event, name, value) {
  event.node.res.setHeader(name, value);
}
function appendResponseHeader(event, name, value) {
  let current = event.node.res.getHeader(name);
  if (!current) {
    event.node.res.setHeader(name, value);
    return;
  }
  if (!Array.isArray(current)) {
    current = [current.toString()];
  }
  event.node.res.setHeader(name, [...current, value]);
}
function removeResponseHeader(event, name) {
  return event.node.res.removeHeader(name);
}
function isStream(data) {
  if (!data || typeof data !== "object") {
    return false;
  }
  if (typeof data.pipe === "function") {
    if (typeof data._read === "function") {
      return true;
    }
    if (typeof data.abort === "function") {
      return true;
    }
  }
  if (typeof data.pipeTo === "function") {
    return true;
  }
  return false;
}
function isWebResponse(data) {
  return typeof Response !== "undefined" && data instanceof Response;
}
function sendStream(event, stream) {
  if (!stream || typeof stream !== "object") {
    throw new Error("[h3] Invalid stream provided.");
  }
  event.node.res._data = stream;
  if (!event.node.res.socket) {
    event._handled = true;
    return Promise.resolve();
  }
  if (hasProp(stream, "pipeTo") && typeof stream.pipeTo === "function") {
    return stream.pipeTo(
      new WritableStream({
        write(chunk) {
          event.node.res.write(chunk);
        }
      })
    ).then(() => {
      event.node.res.end();
    });
  }
  if (hasProp(stream, "pipe") && typeof stream.pipe === "function") {
    return new Promise((resolve, reject) => {
      stream.pipe(event.node.res);
      if (stream.on) {
        stream.on("end", () => {
          event.node.res.end();
          resolve();
        });
        stream.on("error", (error) => {
          reject(error);
        });
      }
      event.node.res.on("close", () => {
        if (stream.abort) {
          stream.abort();
        }
      });
    });
  }
  throw new Error("[h3] Invalid or incompatible stream provided.");
}
function sendWebResponse(event, response) {
  for (const [key, value] of response.headers) {
    if (key === "set-cookie") {
      event.node.res.appendHeader(key, splitCookiesString(value));
    } else {
      event.node.res.setHeader(key, value);
    }
  }
  if (response.status) {
    event.node.res.statusCode = sanitizeStatusCode(
      response.status,
      event.node.res.statusCode
    );
  }
  if (response.statusText) {
    event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  }
  if (response.redirected) {
    event.node.res.setHeader("location", response.url);
  }
  if (!response.body) {
    event.node.res.end();
    return;
  }
  return sendStream(event, response.body);
}

const PayloadMethods = /* @__PURE__ */ new Set(["PATCH", "POST", "PUT", "DELETE"]);
const ignoredHeaders = /* @__PURE__ */ new Set([
  "transfer-encoding",
  "accept-encoding",
  "connection",
  "keep-alive",
  "upgrade",
  "expect",
  "host",
  "accept"
]);
async function proxyRequest(event, target, opts = {}) {
  let body;
  let duplex;
  if (PayloadMethods.has(event.method)) {
    if (opts.streamRequest) {
      body = getRequestWebStream(event);
      duplex = "half";
    } else {
      body = await readRawBody(event, false).catch(() => undefined);
    }
  }
  const method = opts.fetchOptions?.method || event.method;
  const fetchHeaders = mergeHeaders$1(
    getProxyRequestHeaders(event, { host: target.startsWith("/") }),
    opts.fetchOptions?.headers,
    opts.headers
  );
  return sendProxy(event, target, {
    ...opts,
    fetchOptions: {
      method,
      body,
      duplex,
      ...opts.fetchOptions,
      headers: fetchHeaders
    }
  });
}
async function sendProxy(event, target, opts = {}) {
  let response;
  try {
    response = await _getFetch(opts.fetch)(target, {
      headers: opts.headers,
      ignoreResponseError: true,
      // make $ofetch.raw transparent
      ...opts.fetchOptions
    });
  } catch (error) {
    throw createError$1({
      status: 502,
      statusMessage: "Bad Gateway",
      cause: error
    });
  }
  event.node.res.statusCode = sanitizeStatusCode(
    response.status,
    event.node.res.statusCode
  );
  event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  const cookies = [];
  for (const [key, value] of response.headers.entries()) {
    if (key === "content-encoding") {
      continue;
    }
    if (key === "content-length") {
      continue;
    }
    if (key === "set-cookie") {
      cookies.push(...splitCookiesString(value));
      continue;
    }
    event.node.res.setHeader(key, value);
  }
  if (cookies.length > 0) {
    event.node.res.setHeader(
      "set-cookie",
      cookies.map((cookie) => {
        if (opts.cookieDomainRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookieDomainRewrite,
            "domain"
          );
        }
        if (opts.cookiePathRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookiePathRewrite,
            "path"
          );
        }
        return cookie;
      })
    );
  }
  if (opts.onResponse) {
    await opts.onResponse(event, response);
  }
  if (response._data !== undefined) {
    return response._data;
  }
  if (event.handled) {
    return;
  }
  if (opts.sendStream === false) {
    const data = new Uint8Array(await response.arrayBuffer());
    return event.node.res.end(data);
  }
  if (response.body) {
    for await (const chunk of response.body) {
      event.node.res.write(chunk);
    }
  }
  return event.node.res.end();
}
function getProxyRequestHeaders(event, opts) {
  const headers = /* @__PURE__ */ Object.create(null);
  const reqHeaders = getRequestHeaders(event);
  for (const name in reqHeaders) {
    if (!ignoredHeaders.has(name) || name === "host" && opts?.host) {
      headers[name] = reqHeaders[name];
    }
  }
  return headers;
}
function fetchWithEvent(event, req, init, options) {
  return _getFetch(options?.fetch)(req, {
    ...init,
    context: init?.context || event.context,
    headers: {
      ...getProxyRequestHeaders(event, {
        host: typeof req === "string" && req.startsWith("/")
      }),
      ...init?.headers
    }
  });
}
function _getFetch(_fetch) {
  if (_fetch) {
    return _fetch;
  }
  if (globalThis.fetch) {
    return globalThis.fetch;
  }
  throw new Error(
    "fetch is not available. Try importing `node-fetch-native/polyfill` for Node.js."
  );
}
function rewriteCookieProperty(header, map, property) {
  const _map = typeof map === "string" ? { "*": map } : map;
  return header.replace(
    new RegExp(`(;\\s*${property}=)([^;]+)`, "gi"),
    (match, prefix, previousValue) => {
      let newValue;
      if (previousValue in _map) {
        newValue = _map[previousValue];
      } else if ("*" in _map) {
        newValue = _map["*"];
      } else {
        return match;
      }
      return newValue ? prefix + newValue : "";
    }
  );
}
function mergeHeaders$1(defaults, ...inputs) {
  const _inputs = inputs.filter(Boolean);
  if (_inputs.length === 0) {
    return defaults;
  }
  const merged = new Headers(defaults);
  for (const input of _inputs) {
    for (const [key, value] of Object.entries(input)) {
      if (value !== undefined) {
        merged.set(key, value);
      }
    }
  }
  return merged;
}

class H3Event {
  "__is_event__" = true;
  // Context
  node;
  // Node
  web;
  // Web
  context = {};
  // Shared
  // Request
  _method;
  _path;
  _headers;
  _requestBody;
  // Response
  _handled = false;
  // Hooks
  _onBeforeResponseCalled;
  _onAfterResponseCalled;
  constructor(req, res) {
    this.node = { req, res };
  }
  // --- Request ---
  get method() {
    if (!this._method) {
      this._method = (this.node.req.method || "GET").toUpperCase();
    }
    return this._method;
  }
  get path() {
    return this._path || this.node.req.url || "/";
  }
  get headers() {
    if (!this._headers) {
      this._headers = _normalizeNodeHeaders(this.node.req.headers);
    }
    return this._headers;
  }
  // --- Respoonse ---
  get handled() {
    return this._handled || this.node.res.writableEnded || this.node.res.headersSent;
  }
  respondWith(response) {
    return Promise.resolve(response).then(
      (_response) => sendWebResponse(this, _response)
    );
  }
  // --- Utils ---
  toString() {
    return `[${this.method}] ${this.path}`;
  }
  toJSON() {
    return this.toString();
  }
  // --- Deprecated ---
  /** @deprecated Please use `event.node.req` instead. */
  get req() {
    return this.node.req;
  }
  /** @deprecated Please use `event.node.res` instead. */
  get res() {
    return this.node.res;
  }
}
function isEvent(input) {
  return hasProp(input, "__is_event__");
}
function createEvent(req, res) {
  return new H3Event(req, res);
}
function _normalizeNodeHeaders(nodeHeaders) {
  const headers = new Headers();
  for (const [name, value] of Object.entries(nodeHeaders)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        headers.append(name, item);
      }
    } else if (value) {
      headers.set(name, value);
    }
  }
  return headers;
}

function defineEventHandler(handler) {
  if (typeof handler === "function") {
    handler.__is_handler__ = true;
    return handler;
  }
  const _hooks = {
    onRequest: _normalizeArray(handler.onRequest),
    onBeforeResponse: _normalizeArray(handler.onBeforeResponse)
  };
  const _handler = (event) => {
    return _callHandler(event, handler.handler, _hooks);
  };
  _handler.__is_handler__ = true;
  _handler.__resolve__ = handler.handler.__resolve__;
  _handler.__websocket__ = handler.websocket;
  return _handler;
}
function _normalizeArray(input) {
  return input ? Array.isArray(input) ? input : [input] : undefined;
}
async function _callHandler(event, handler, hooks) {
  if (hooks.onRequest) {
    for (const hook of hooks.onRequest) {
      await hook(event);
      if (event.handled) {
        return;
      }
    }
  }
  const body = await handler(event);
  const response = { body };
  if (hooks.onBeforeResponse) {
    for (const hook of hooks.onBeforeResponse) {
      await hook(event, response);
    }
  }
  return response.body;
}
const eventHandler = defineEventHandler;
function isEventHandler(input) {
  return hasProp(input, "__is_handler__");
}
function toEventHandler(input, _, _route) {
  if (!isEventHandler(input)) {
    console.warn(
      "[h3] Implicit event handler conversion is deprecated. Use `eventHandler()` or `fromNodeMiddleware()` to define event handlers.",
      _route && _route !== "/" ? `
     Route: ${_route}` : "",
      `
     Handler: ${input}`
    );
  }
  return input;
}
function defineLazyEventHandler(factory) {
  let _promise;
  let _resolved;
  const resolveHandler = () => {
    if (_resolved) {
      return Promise.resolve(_resolved);
    }
    if (!_promise) {
      _promise = Promise.resolve(factory()).then((r) => {
        const handler2 = r.default || r;
        if (typeof handler2 !== "function") {
          throw new TypeError(
            "Invalid lazy handler result. It should be a function:",
            handler2
          );
        }
        _resolved = { handler: toEventHandler(r.default || r) };
        return _resolved;
      });
    }
    return _promise;
  };
  const handler = eventHandler((event) => {
    if (_resolved) {
      return _resolved.handler(event);
    }
    return resolveHandler().then((r) => r.handler(event));
  });
  handler.__resolve__ = resolveHandler;
  return handler;
}
const lazyEventHandler = defineLazyEventHandler;

function createApp(options = {}) {
  const stack = [];
  const handler = createAppEventHandler(stack, options);
  const resolve = createResolver(stack);
  handler.__resolve__ = resolve;
  const getWebsocket = cachedFn(() => websocketOptions(resolve, options));
  const app = {
    // @ts-expect-error
    use: (arg1, arg2, arg3) => use(app, arg1, arg2, arg3),
    resolve,
    handler,
    stack,
    options,
    get websocket() {
      return getWebsocket();
    }
  };
  return app;
}
function use(app, arg1, arg2, arg3) {
  if (Array.isArray(arg1)) {
    for (const i of arg1) {
      use(app, i, arg2, arg3);
    }
  } else if (Array.isArray(arg2)) {
    for (const i of arg2) {
      use(app, arg1, i, arg3);
    }
  } else if (typeof arg1 === "string") {
    app.stack.push(
      normalizeLayer({ ...arg3, route: arg1, handler: arg2 })
    );
  } else if (typeof arg1 === "function") {
    app.stack.push(normalizeLayer({ ...arg2, handler: arg1 }));
  } else {
    app.stack.push(normalizeLayer({ ...arg1 }));
  }
  return app;
}
function createAppEventHandler(stack, options) {
  const spacing = options.debug ? 2 : undefined;
  return eventHandler(async (event) => {
    event.node.req.originalUrl = event.node.req.originalUrl || event.node.req.url || "/";
    const _reqPath = event._path || event.node.req.url || "/";
    let _layerPath;
    if (options.onRequest) {
      await options.onRequest(event);
    }
    for (const layer of stack) {
      if (layer.route.length > 1) {
        if (!_reqPath.startsWith(layer.route)) {
          continue;
        }
        _layerPath = _reqPath.slice(layer.route.length) || "/";
      } else {
        _layerPath = _reqPath;
      }
      if (layer.match && !layer.match(_layerPath, event)) {
        continue;
      }
      event._path = _layerPath;
      event.node.req.url = _layerPath;
      const val = await layer.handler(event);
      const _body = val === undefined ? undefined : await val;
      if (_body !== undefined) {
        const _response = { body: _body };
        if (options.onBeforeResponse) {
          event._onBeforeResponseCalled = true;
          await options.onBeforeResponse(event, _response);
        }
        await handleHandlerResponse(event, _response.body, spacing);
        if (options.onAfterResponse) {
          event._onAfterResponseCalled = true;
          await options.onAfterResponse(event, _response);
        }
        return;
      }
      if (event.handled) {
        if (options.onAfterResponse) {
          event._onAfterResponseCalled = true;
          await options.onAfterResponse(event, undefined);
        }
        return;
      }
    }
    if (!event.handled) {
      throw createError$1({
        statusCode: 404,
        statusMessage: `Cannot find any path matching ${event.path || "/"}.`
      });
    }
    if (options.onAfterResponse) {
      event._onAfterResponseCalled = true;
      await options.onAfterResponse(event, undefined);
    }
  });
}
function createResolver(stack) {
  return async (path) => {
    let _layerPath;
    for (const layer of stack) {
      if (layer.route === "/" && !layer.handler.__resolve__) {
        continue;
      }
      if (!path.startsWith(layer.route)) {
        continue;
      }
      _layerPath = path.slice(layer.route.length) || "/";
      if (layer.match && !layer.match(_layerPath, undefined)) {
        continue;
      }
      let res = { route: layer.route, handler: layer.handler };
      if (res.handler.__resolve__) {
        const _res = await res.handler.__resolve__(_layerPath);
        if (!_res) {
          continue;
        }
        res = {
          ...res,
          ..._res,
          route: joinURL(res.route || "/", _res.route || "/")
        };
      }
      return res;
    }
  };
}
function normalizeLayer(input) {
  let handler = input.handler;
  if (handler.handler) {
    handler = handler.handler;
  }
  if (input.lazy) {
    handler = lazyEventHandler(handler);
  } else if (!isEventHandler(handler)) {
    handler = toEventHandler(handler, undefined, input.route);
  }
  return {
    route: withoutTrailingSlash(input.route),
    match: input.match,
    handler
  };
}
function handleHandlerResponse(event, val, jsonSpace) {
  if (val === null) {
    return sendNoContent(event);
  }
  if (val) {
    if (isWebResponse(val)) {
      return sendWebResponse(event, val);
    }
    if (isStream(val)) {
      return sendStream(event, val);
    }
    if (val.buffer) {
      return send(event, val);
    }
    if (val.arrayBuffer && typeof val.arrayBuffer === "function") {
      return val.arrayBuffer().then((arrayBuffer) => {
        return send(event, Buffer.from(arrayBuffer), val.type);
      });
    }
    if (val instanceof Error) {
      throw createError$1(val);
    }
    if (typeof val.end === "function") {
      return true;
    }
  }
  const valType = typeof val;
  if (valType === "string") {
    return send(event, val, MIMES.html);
  }
  if (valType === "object" || valType === "boolean" || valType === "number") {
    return send(event, JSON.stringify(val, undefined, jsonSpace), MIMES.json);
  }
  if (valType === "bigint") {
    return send(event, val.toString(), MIMES.json);
  }
  throw createError$1({
    statusCode: 500,
    statusMessage: `[h3] Cannot send ${valType} as response.`
  });
}
function cachedFn(fn) {
  let cache;
  return () => {
    if (!cache) {
      cache = fn();
    }
    return cache;
  };
}
function websocketOptions(evResolver, appOptions) {
  return {
    ...appOptions.websocket,
    async resolve(info) {
      const url = info.request?.url || info.url || "/";
      const { pathname } = typeof url === "string" ? parseURL(url) : url;
      const resolved = await evResolver(pathname);
      return resolved?.handler?.__websocket__ || {};
    }
  };
}

const RouterMethods = [
  "connect",
  "delete",
  "get",
  "head",
  "options",
  "post",
  "put",
  "trace",
  "patch"
];
function createRouter(opts = {}) {
  const _router = createRouter$1({});
  const routes = {};
  let _matcher;
  const router = {};
  const addRoute = (path, handler, method) => {
    let route = routes[path];
    if (!route) {
      routes[path] = route = { path, handlers: {} };
      _router.insert(path, route);
    }
    if (Array.isArray(method)) {
      for (const m of method) {
        addRoute(path, handler, m);
      }
    } else {
      route.handlers[method] = toEventHandler(handler, undefined, path);
    }
    return router;
  };
  router.use = router.add = (path, handler, method) => addRoute(path, handler, method || "all");
  for (const method of RouterMethods) {
    router[method] = (path, handle) => router.add(path, handle, method);
  }
  const matchHandler = (path = "/", method = "get") => {
    const qIndex = path.indexOf("?");
    if (qIndex !== -1) {
      path = path.slice(0, Math.max(0, qIndex));
    }
    const matched = _router.lookup(path);
    if (!matched || !matched.handlers) {
      return {
        error: createError$1({
          statusCode: 404,
          name: "Not Found",
          statusMessage: `Cannot find any route matching ${path || "/"}.`
        })
      };
    }
    let handler = matched.handlers[method] || matched.handlers.all;
    if (!handler) {
      if (!_matcher) {
        _matcher = toRouteMatcher(_router);
      }
      const _matches = _matcher.matchAll(path).reverse();
      for (const _match of _matches) {
        if (_match.handlers[method]) {
          handler = _match.handlers[method];
          matched.handlers[method] = matched.handlers[method] || handler;
          break;
        }
        if (_match.handlers.all) {
          handler = _match.handlers.all;
          matched.handlers.all = matched.handlers.all || handler;
          break;
        }
      }
    }
    if (!handler) {
      return {
        error: createError$1({
          statusCode: 405,
          name: "Method Not Allowed",
          statusMessage: `Method ${method} is not allowed on this route.`
        })
      };
    }
    return { matched, handler };
  };
  const isPreemptive = opts.preemptive || opts.preemtive;
  router.handler = eventHandler((event) => {
    const match = matchHandler(
      event.path,
      event.method.toLowerCase()
    );
    if ("error" in match) {
      if (isPreemptive) {
        throw match.error;
      } else {
        return;
      }
    }
    event.context.matchedRoute = match.matched;
    const params = match.matched.params || {};
    event.context.params = params;
    return Promise.resolve(match.handler(event)).then((res) => {
      if (res === undefined && isPreemptive) {
        return null;
      }
      return res;
    });
  });
  router.handler.__resolve__ = async (path) => {
    path = withLeadingSlash(path);
    const match = matchHandler(path);
    if ("error" in match) {
      return;
    }
    let res = {
      route: match.matched.path,
      handler: match.handler
    };
    if (match.handler.__resolve__) {
      const _res = await match.handler.__resolve__(path);
      if (!_res) {
        return;
      }
      res = { ...res, ..._res };
    }
    return res;
  };
  return router;
}
function toNodeListener(app) {
  const toNodeHandle = async function(req, res) {
    const event = createEvent(req, res);
    try {
      await app.handler(event);
    } catch (_error) {
      const error = createError$1(_error);
      if (!isError(_error)) {
        error.unhandled = true;
      }
      setResponseStatus(event, error.statusCode, error.statusMessage);
      if (app.options.onError) {
        await app.options.onError(error, event);
      }
      if (event.handled) {
        return;
      }
      if (error.unhandled || error.fatal) {
        console.error("[h3]", error.fatal ? "[fatal]" : "[unhandled]", error);
      }
      if (app.options.onBeforeResponse && !event._onBeforeResponseCalled) {
        await app.options.onBeforeResponse(event, { body: error });
      }
      await sendError(event, error, !!app.options.debug);
      if (app.options.onAfterResponse && !event._onAfterResponseCalled) {
        await app.options.onAfterResponse(event, { body: error });
      }
    }
  };
  return toNodeHandle;
}

function flatHooks(configHooks, hooks = {}, parentName) {
  for (const key in configHooks) {
    const subHook = configHooks[key];
    const name = parentName ? `${parentName}:${key}` : key;
    if (typeof subHook === "object" && subHook !== null) {
      flatHooks(subHook, hooks, name);
    } else if (typeof subHook === "function") {
      hooks[name] = subHook;
    }
  }
  return hooks;
}
const defaultTask = { run: (function_) => function_() };
const _createTask = () => defaultTask;
const createTask = typeof console.createTask !== "undefined" ? console.createTask : _createTask;
function serialTaskCaller(hooks, args) {
  const name = args.shift();
  const task = createTask(name);
  return hooks.reduce(
    (promise, hookFunction) => promise.then(() => task.run(() => hookFunction(...args))),
    Promise.resolve()
  );
}
function parallelTaskCaller(hooks, args) {
  const name = args.shift();
  const task = createTask(name);
  return Promise.all(hooks.map((hook) => task.run(() => hook(...args))));
}
function callEachWith(callbacks, arg0) {
  for (const callback of [...callbacks]) {
    callback(arg0);
  }
}

class Hookable {
  constructor() {
    this._hooks = {};
    this._before = undefined;
    this._after = undefined;
    this._deprecatedMessages = undefined;
    this._deprecatedHooks = {};
    this.hook = this.hook.bind(this);
    this.callHook = this.callHook.bind(this);
    this.callHookWith = this.callHookWith.bind(this);
  }
  hook(name, function_, options = {}) {
    if (!name || typeof function_ !== "function") {
      return () => {
      };
    }
    const originalName = name;
    let dep;
    while (this._deprecatedHooks[name]) {
      dep = this._deprecatedHooks[name];
      name = dep.to;
    }
    if (dep && !options.allowDeprecated) {
      let message = dep.message;
      if (!message) {
        message = `${originalName} hook has been deprecated` + (dep.to ? `, please use ${dep.to}` : "");
      }
      if (!this._deprecatedMessages) {
        this._deprecatedMessages = /* @__PURE__ */ new Set();
      }
      if (!this._deprecatedMessages.has(message)) {
        console.warn(message);
        this._deprecatedMessages.add(message);
      }
    }
    if (!function_.name) {
      try {
        Object.defineProperty(function_, "name", {
          get: () => "_" + name.replace(/\W+/g, "_") + "_hook_cb",
          configurable: true
        });
      } catch {
      }
    }
    this._hooks[name] = this._hooks[name] || [];
    this._hooks[name].push(function_);
    return () => {
      if (function_) {
        this.removeHook(name, function_);
        function_ = undefined;
      }
    };
  }
  hookOnce(name, function_) {
    let _unreg;
    let _function = (...arguments_) => {
      if (typeof _unreg === "function") {
        _unreg();
      }
      _unreg = undefined;
      _function = undefined;
      return function_(...arguments_);
    };
    _unreg = this.hook(name, _function);
    return _unreg;
  }
  removeHook(name, function_) {
    if (this._hooks[name]) {
      const index = this._hooks[name].indexOf(function_);
      if (index !== -1) {
        this._hooks[name].splice(index, 1);
      }
      if (this._hooks[name].length === 0) {
        delete this._hooks[name];
      }
    }
  }
  deprecateHook(name, deprecated) {
    this._deprecatedHooks[name] = typeof deprecated === "string" ? { to: deprecated } : deprecated;
    const _hooks = this._hooks[name] || [];
    delete this._hooks[name];
    for (const hook of _hooks) {
      this.hook(name, hook);
    }
  }
  deprecateHooks(deprecatedHooks) {
    Object.assign(this._deprecatedHooks, deprecatedHooks);
    for (const name in deprecatedHooks) {
      this.deprecateHook(name, deprecatedHooks[name]);
    }
  }
  addHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    const removeFns = Object.keys(hooks).map(
      (key) => this.hook(key, hooks[key])
    );
    return () => {
      for (const unreg of removeFns.splice(0, removeFns.length)) {
        unreg();
      }
    };
  }
  removeHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    for (const key in hooks) {
      this.removeHook(key, hooks[key]);
    }
  }
  removeAllHooks() {
    for (const key in this._hooks) {
      delete this._hooks[key];
    }
  }
  callHook(name, ...arguments_) {
    arguments_.unshift(name);
    return this.callHookWith(serialTaskCaller, name, ...arguments_);
  }
  callHookParallel(name, ...arguments_) {
    arguments_.unshift(name);
    return this.callHookWith(parallelTaskCaller, name, ...arguments_);
  }
  callHookWith(caller, name, ...arguments_) {
    const event = this._before || this._after ? { name, args: arguments_, context: {} } : undefined;
    if (this._before) {
      callEachWith(this._before, event);
    }
    const result = caller(
      name in this._hooks ? [...this._hooks[name]] : [],
      arguments_
    );
    if (result instanceof Promise) {
      return result.finally(() => {
        if (this._after && event) {
          callEachWith(this._after, event);
        }
      });
    }
    if (this._after && event) {
      callEachWith(this._after, event);
    }
    return result;
  }
  beforeEach(function_) {
    this._before = this._before || [];
    this._before.push(function_);
    return () => {
      if (this._before !== undefined) {
        const index = this._before.indexOf(function_);
        if (index !== -1) {
          this._before.splice(index, 1);
        }
      }
    };
  }
  afterEach(function_) {
    this._after = this._after || [];
    this._after.push(function_);
    return () => {
      if (this._after !== undefined) {
        const index = this._after.indexOf(function_);
        if (index !== -1) {
          this._after.splice(index, 1);
        }
      }
    };
  }
}
function createHooks() {
  return new Hookable();
}

const s=globalThis.Headers,i=globalThis.AbortController,l=globalThis.fetch||(()=>{throw new Error("[node-fetch-native] Failed to fetch: `globalThis.fetch` is not available!")});

class FetchError extends Error {
  constructor(message, opts) {
    super(message, opts);
    this.name = "FetchError";
    if (opts?.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
}
function createFetchError(ctx) {
  const errorMessage = ctx.error?.message || ctx.error?.toString() || "";
  const method = ctx.request?.method || ctx.options?.method || "GET";
  const url = ctx.request?.url || String(ctx.request) || "/";
  const requestStr = `[${method}] ${JSON.stringify(url)}`;
  const statusStr = ctx.response ? `${ctx.response.status} ${ctx.response.statusText}` : "<no response>";
  const message = `${requestStr}: ${statusStr}${errorMessage ? ` ${errorMessage}` : ""}`;
  const fetchError = new FetchError(
    message,
    ctx.error ? { cause: ctx.error } : undefined
  );
  for (const key of ["request", "options", "response"]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx[key];
      }
    });
  }
  for (const [key, refKey] of [
    ["data", "_data"],
    ["status", "status"],
    ["statusCode", "status"],
    ["statusText", "statusText"],
    ["statusMessage", "statusText"]
  ]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx.response && ctx.response[refKey];
      }
    });
  }
  return fetchError;
}

const payloadMethods = new Set(
  Object.freeze(["PATCH", "POST", "PUT", "DELETE"])
);
function isPayloadMethod(method = "GET") {
  return payloadMethods.has(method.toUpperCase());
}
function isJSONSerializable(value) {
  if (value === undefined) {
    return false;
  }
  const t = typeof value;
  if (t === "string" || t === "number" || t === "boolean" || t === null) {
    return true;
  }
  if (t !== "object") {
    return false;
  }
  if (Array.isArray(value)) {
    return true;
  }
  if (value.buffer) {
    return false;
  }
  return value.constructor && value.constructor.name === "Object" || typeof value.toJSON === "function";
}
const textTypes = /* @__PURE__ */ new Set([
  "image/svg",
  "application/xml",
  "application/xhtml",
  "application/html"
]);
const JSON_RE = /^application\/(?:[\w!#$%&*.^`~-]*\+)?json(;.+)?$/i;
function detectResponseType(_contentType = "") {
  if (!_contentType) {
    return "json";
  }
  const contentType = _contentType.split(";").shift() || "";
  if (JSON_RE.test(contentType)) {
    return "json";
  }
  if (textTypes.has(contentType) || contentType.startsWith("text/")) {
    return "text";
  }
  return "blob";
}
function resolveFetchOptions(request, input, defaults, Headers) {
  const headers = mergeHeaders(
    input?.headers ?? request?.headers,
    defaults?.headers,
    Headers
  );
  let query;
  if (defaults?.query || defaults?.params || input?.params || input?.query) {
    query = {
      ...defaults?.params,
      ...defaults?.query,
      ...input?.params,
      ...input?.query
    };
  }
  return {
    ...defaults,
    ...input,
    query,
    params: query,
    headers
  };
}
function mergeHeaders(input, defaults, Headers) {
  if (!defaults) {
    return new Headers(input);
  }
  const headers = new Headers(defaults);
  if (input) {
    for (const [key, value] of Symbol.iterator in input || Array.isArray(input) ? input : new Headers(input)) {
      headers.set(key, value);
    }
  }
  return headers;
}
async function callHooks(context, hooks) {
  if (hooks) {
    if (Array.isArray(hooks)) {
      for (const hook of hooks) {
        await hook(context);
      }
    } else {
      await hooks(context);
    }
  }
}

const retryStatusCodes = /* @__PURE__ */ new Set([
  408,
  // Request Timeout
  409,
  // Conflict
  425,
  // Too Early (Experimental)
  429,
  // Too Many Requests
  500,
  // Internal Server Error
  502,
  // Bad Gateway
  503,
  // Service Unavailable
  504
  // Gateway Timeout
]);
const nullBodyResponses$1 = /* @__PURE__ */ new Set([101, 204, 205, 304]);
function createFetch$1(globalOptions = {}) {
  const {
    fetch = globalThis.fetch,
    Headers = globalThis.Headers,
    AbortController = globalThis.AbortController
  } = globalOptions;
  async function onError(context) {
    const isAbort = context.error && context.error.name === "AbortError" && !context.options.timeout || false;
    if (context.options.retry !== false && !isAbort) {
      let retries;
      if (typeof context.options.retry === "number") {
        retries = context.options.retry;
      } else {
        retries = isPayloadMethod(context.options.method) ? 0 : 1;
      }
      const responseCode = context.response && context.response.status || 500;
      if (retries > 0 && (Array.isArray(context.options.retryStatusCodes) ? context.options.retryStatusCodes.includes(responseCode) : retryStatusCodes.has(responseCode))) {
        const retryDelay = typeof context.options.retryDelay === "function" ? context.options.retryDelay(context) : context.options.retryDelay || 0;
        if (retryDelay > 0) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
        return $fetchRaw(context.request, {
          ...context.options,
          retry: retries - 1
        });
      }
    }
    const error = createFetchError(context);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(error, $fetchRaw);
    }
    throw error;
  }
  const $fetchRaw = async function $fetchRaw2(_request, _options = {}) {
    const context = {
      request: _request,
      options: resolveFetchOptions(
        _request,
        _options,
        globalOptions.defaults,
        Headers
      ),
      response: undefined,
      error: undefined
    };
    if (context.options.method) {
      context.options.method = context.options.method.toUpperCase();
    }
    if (context.options.onRequest) {
      await callHooks(context, context.options.onRequest);
    }
    if (typeof context.request === "string") {
      if (context.options.baseURL) {
        context.request = withBase(context.request, context.options.baseURL);
      }
      if (context.options.query) {
        context.request = withQuery(context.request, context.options.query);
        delete context.options.query;
      }
      if ("query" in context.options) {
        delete context.options.query;
      }
      if ("params" in context.options) {
        delete context.options.params;
      }
    }
    if (context.options.body && isPayloadMethod(context.options.method)) {
      if (isJSONSerializable(context.options.body)) {
        context.options.body = typeof context.options.body === "string" ? context.options.body : JSON.stringify(context.options.body);
        context.options.headers = new Headers(context.options.headers || {});
        if (!context.options.headers.has("content-type")) {
          context.options.headers.set("content-type", "application/json");
        }
        if (!context.options.headers.has("accept")) {
          context.options.headers.set("accept", "application/json");
        }
      } else if (
        // ReadableStream Body
        "pipeTo" in context.options.body && typeof context.options.body.pipeTo === "function" || // Node.js Stream Body
        typeof context.options.body.pipe === "function"
      ) {
        if (!("duplex" in context.options)) {
          context.options.duplex = "half";
        }
      }
    }
    let abortTimeout;
    if (!context.options.signal && context.options.timeout) {
      const controller = new AbortController();
      abortTimeout = setTimeout(() => {
        const error = new Error(
          "[TimeoutError]: The operation was aborted due to timeout"
        );
        error.name = "TimeoutError";
        error.code = 23;
        controller.abort(error);
      }, context.options.timeout);
      context.options.signal = controller.signal;
    }
    try {
      context.response = await fetch(
        context.request,
        context.options
      );
    } catch (error) {
      context.error = error;
      if (context.options.onRequestError) {
        await callHooks(
          context,
          context.options.onRequestError
        );
      }
      return await onError(context);
    } finally {
      if (abortTimeout) {
        clearTimeout(abortTimeout);
      }
    }
    const hasBody = (context.response.body || // https://github.com/unjs/ofetch/issues/324
    // https://github.com/unjs/ofetch/issues/294
    // https://github.com/JakeChampion/fetch/issues/1454
    context.response._bodyInit) && !nullBodyResponses$1.has(context.response.status) && context.options.method !== "HEAD";
    if (hasBody) {
      const responseType = (context.options.parseResponse ? "json" : context.options.responseType) || detectResponseType(context.response.headers.get("content-type") || "");
      switch (responseType) {
        case "json": {
          const data = await context.response.text();
          const parseFunction = context.options.parseResponse || destr;
          context.response._data = parseFunction(data);
          break;
        }
        case "stream": {
          context.response._data = context.response.body || context.response._bodyInit;
          break;
        }
        default: {
          context.response._data = await context.response[responseType]();
        }
      }
    }
    if (context.options.onResponse) {
      await callHooks(
        context,
        context.options.onResponse
      );
    }
    if (!context.options.ignoreResponseError && context.response.status >= 400 && context.response.status < 600) {
      if (context.options.onResponseError) {
        await callHooks(
          context,
          context.options.onResponseError
        );
      }
      return await onError(context);
    }
    return context.response;
  };
  const $fetch = async function $fetch2(request, options) {
    const r = await $fetchRaw(request, options);
    return r._data;
  };
  $fetch.raw = $fetchRaw;
  $fetch.native = (...args) => fetch(...args);
  $fetch.create = (defaultOptions = {}, customGlobalOptions = {}) => createFetch$1({
    ...globalOptions,
    ...customGlobalOptions,
    defaults: {
      ...globalOptions.defaults,
      ...customGlobalOptions.defaults,
      ...defaultOptions
    }
  });
  return $fetch;
}

function createNodeFetch() {
  const useKeepAlive = JSON.parse(process.env.FETCH_KEEP_ALIVE || "false");
  if (!useKeepAlive) {
    return l;
  }
  const agentOptions = { keepAlive: true };
  const httpAgent = new http.Agent(agentOptions);
  const httpsAgent = new https.Agent(agentOptions);
  const nodeFetchOptions = {
    agent(parsedURL) {
      return parsedURL.protocol === "http:" ? httpAgent : httpsAgent;
    }
  };
  return function nodeFetchWithKeepAlive(input, init) {
    return l(input, { ...nodeFetchOptions, ...init });
  };
}
const fetch = globalThis.fetch ? (...args) => globalThis.fetch(...args) : createNodeFetch();
const Headers$1 = globalThis.Headers || s;
const AbortController = globalThis.AbortController || i;
const ofetch = createFetch$1({ fetch, Headers: Headers$1, AbortController });
const $fetch = ofetch;

const nullBodyResponses = /* @__PURE__ */ new Set([101, 204, 205, 304]);
function createCall(handle) {
  return function callHandle(context) {
    const req = new IncomingMessage();
    const res = new ServerResponse(req);
    req.url = context.url || "/";
    req.method = context.method || "GET";
    req.headers = {};
    if (context.headers) {
      const headerEntries = typeof context.headers.entries === "function" ? context.headers.entries() : Object.entries(context.headers);
      for (const [name, value] of headerEntries) {
        if (!value) {
          continue;
        }
        req.headers[name.toLowerCase()] = value;
      }
    }
    req.headers.host = req.headers.host || context.host || "localhost";
    req.connection.encrypted = // @ts-ignore
    req.connection.encrypted || context.protocol === "https";
    req.body = context.body || null;
    req.__unenv__ = context.context;
    return handle(req, res).then(() => {
      let body = res._data;
      if (nullBodyResponses.has(res.statusCode) || req.method.toUpperCase() === "HEAD") {
        body = null;
        delete res._headers["content-length"];
      }
      const r = {
        body,
        headers: res._headers,
        status: res.statusCode,
        statusText: res.statusMessage
      };
      req.destroy();
      res.destroy();
      return r;
    });
  };
}

function createFetch(call, _fetch = global.fetch) {
  return async function ufetch(input, init) {
    const url = input.toString();
    if (!url.startsWith("/")) {
      return _fetch(url, init);
    }
    try {
      const r = await call({ url, ...init });
      return new Response(r.body, {
        status: r.status,
        statusText: r.statusText,
        headers: Object.fromEntries(
          Object.entries(r.headers).map(([name, value]) => [
            name,
            Array.isArray(value) ? value.join(",") : String(value) || ""
          ])
        )
      });
    } catch (error) {
      return new Response(error.toString(), {
        status: Number.parseInt(error.statusCode || error.code) || 500,
        statusText: error.statusText
      });
    }
  };
}

function hasReqHeader(event, name, includes) {
  const value = getRequestHeader(event, name);
  return value && typeof value === "string" && value.toLowerCase().includes(includes);
}
function isJsonRequest(event) {
  if (hasReqHeader(event, "accept", "text/html")) {
    return false;
  }
  return hasReqHeader(event, "accept", "application/json") || hasReqHeader(event, "user-agent", "curl/") || hasReqHeader(event, "user-agent", "httpie/") || hasReqHeader(event, "sec-fetch-mode", "cors") || event.path.startsWith("/api/") || event.path.endsWith(".json");
}
function normalizeError(error, isDev) {
  const cwd = typeof process.cwd === "function" ? process.cwd() : "/";
  const stack = (error.unhandled || error.fatal) ? [] : (error.stack || "").split("\n").splice(1).filter((line) => line.includes("at ")).map((line) => {
    const text = line.replace(cwd + "/", "./").replace("webpack:/", "").replace("file://", "").trim();
    return {
      text,
      internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
    };
  });
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage ?? (statusCode === 404 ? "Not Found" : "");
  const message = error.unhandled ? "internal server error" : error.message || error.toString();
  return {
    stack,
    statusCode,
    statusMessage,
    message
  };
}
function _captureError(error, type) {
  console.error(`[nitro] [${type}]`, error);
  useNitroApp().captureError(error, { tags: [type] });
}
function trapUnhandledNodeErrors() {
  process.on(
    "unhandledRejection",
    (error) => _captureError(error, "unhandledRejection")
  );
  process.on(
    "uncaughtException",
    (error) => _captureError(error, "uncaughtException")
  );
}
function joinHeaders(value) {
  return Array.isArray(value) ? value.join(", ") : String(value);
}
function normalizeFetchResponse(response) {
  if (!response.headers.has("set-cookie")) {
    return response;
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: normalizeCookieHeaders(response.headers)
  });
}
function normalizeCookieHeader(header = "") {
  return splitCookiesString(joinHeaders(header));
}
function normalizeCookieHeaders(headers) {
  const outgoingHeaders = new Headers();
  for (const [name, header] of headers) {
    if (name === "set-cookie") {
      for (const cookie of normalizeCookieHeader(header)) {
        outgoingHeaders.append("set-cookie", cookie);
      }
    } else {
      outgoingHeaders.set(name, joinHeaders(header));
    }
  }
  return outgoingHeaders;
}

const errorHandler = (async function errorhandler(error, event) {
  const { stack, statusCode, statusMessage, message } = normalizeError(error);
  const errorObject = {
    url: event.path,
    statusCode,
    statusMessage,
    message,
    stack: "",
    // TODO: check and validate error.data for serialisation into query
    data: error.data
  };
  if (error.unhandled || error.fatal) {
    const tags = [
      "[nuxt]",
      "[request error]",
      error.unhandled && "[unhandled]",
      error.fatal && "[fatal]",
      Number(errorObject.statusCode) !== 200 && `[${errorObject.statusCode}]`
    ].filter(Boolean).join(" ");
    console.error(tags, (error.message || error.toString() || "internal server error") + "\n" + stack.map((l) => "  " + l.text).join("  \n"));
  }
  if (event.handled) {
    return;
  }
  setResponseStatus(event, errorObject.statusCode !== 200 && errorObject.statusCode || 500, errorObject.statusMessage);
  if (isJsonRequest(event)) {
    setResponseHeader(event, "Content-Type", "application/json");
    return send(event, JSON.stringify(errorObject));
  }
  const reqHeaders = getRequestHeaders(event);
  const isRenderingError = event.path.startsWith("/__nuxt_error") || !!reqHeaders["x-nuxt-error"];
  const res = isRenderingError ? null : await useNitroApp().localFetch(
    withQuery(joinURL(useRuntimeConfig(event).app.baseURL, "/__nuxt_error"), errorObject),
    {
      headers: { ...reqHeaders, "x-nuxt-error": "true" },
      redirect: "manual"
    }
  ).catch(() => null);
  if (!res) {
    const { template } = await import('./error-500.mjs');
    if (event.handled) {
      return;
    }
    setResponseHeader(event, "Content-Type", "text/html;charset=UTF-8");
    return send(event, template(errorObject));
  }
  const html = await res.text();
  if (event.handled) {
    return;
  }
  for (const [header, value] of res.headers.entries()) {
    setResponseHeader(event, header, value);
  }
  setResponseStatus(event, res.status && res.status !== 200 ? res.status : undefined, res.statusText);
  return send(event, html);
});

const plugins = [
  
];

const assets$1 = {
  "/portfolio.ico": {
    "type": "image/vnd.microsoft.icon",
    "etag": "\"7d26-WFFSfjGnW4+ow5gJkFqt76Vaq5I\"",
    "mtime": "2025-01-19T12:44:39.507Z",
    "size": 32038,
    "path": "../public/portfolio.ico"
  },
  "/robots.txt": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"2-uoq1oCgLlTqpdDX/iUbLy7J1Wic\"",
    "mtime": "2025-01-19T12:44:39.517Z",
    "size": 2,
    "path": "../public/robots.txt"
  },
  "/style.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"53e-x41YO4dE+Xq/8W+EC5WK5HQbxOY\"",
    "mtime": "2025-01-19T12:44:39.517Z",
    "size": 1342,
    "path": "../public/style.css"
  },
  "/components/Navigation.vue": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"abd-JXthDppUFU4BK2KbKgr25iR6lZE\"",
    "mtime": "2025-01-25T16:56:00.963Z",
    "size": 2749,
    "path": "../public/components/Navigation.vue"
  },
  "/components/Projects.vue": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"1477-BZrxdQx1HBiTq7do6zAZQxKybeY\"",
    "mtime": "2025-01-27T08:22:43.858Z",
    "size": 5239,
    "path": "../public/components/Projects.vue"
  },
  "/_nuxt/animation.CcCz6yOD.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1ec2-zsXvf5IDsURi+qO0hdJUmhzPZB4\"",
    "mtime": "2025-01-27T08:23:43.420Z",
    "size": 7874,
    "path": "../public/_nuxt/animation.CcCz6yOD.css"
  },
  "/_nuxt/Baen6DhN.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1ebc-LpFLlJ6t/+ny5wAD8WrT2TZuUvs\"",
    "mtime": "2025-01-27T08:23:43.445Z",
    "size": 7868,
    "path": "../public/_nuxt/Baen6DhN.js"
  },
  "/_nuxt/Baf7Ww0W.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"fe6-Xx/mNvxiuFstgcbPik0u6hyQD+8\"",
    "mtime": "2025-01-27T08:23:43.421Z",
    "size": 4070,
    "path": "../public/_nuxt/Baf7Ww0W.js"
  },
  "/_nuxt/C28bVtHI.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"17b-eMsfxMQ/aM7gpUI/LIBPOS0vcHE\"",
    "mtime": "2025-01-27T08:23:43.422Z",
    "size": 379,
    "path": "../public/_nuxt/C28bVtHI.js"
  },
  "/_nuxt/CgN6ELAe.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"23c85-oLRlkZN/7YIYKYaHjzZlHvOm8LE\"",
    "mtime": "2025-01-27T08:23:43.446Z",
    "size": 146565,
    "path": "../public/_nuxt/CgN6ELAe.js"
  },
  "/_nuxt/CkmClJg1.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"8d92-HlDlK/qSDE+FZ0Q0iZaOX1qwa3Y\"",
    "mtime": "2025-01-27T08:23:43.443Z",
    "size": 36242,
    "path": "../public/_nuxt/CkmClJg1.js"
  },
  "/_nuxt/CNlDc5yb.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"d52-RxfTgo2nvsDJNHfCssQGkztE8TU\"",
    "mtime": "2025-01-27T08:23:43.421Z",
    "size": 3410,
    "path": "../public/_nuxt/CNlDc5yb.js"
  },
  "/_nuxt/DQGpt5EW.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"ea9-Pf+QEPxuNVzLFgs+Kl+p0lL9F1s\"",
    "mtime": "2025-01-27T08:23:43.420Z",
    "size": 3753,
    "path": "../public/_nuxt/DQGpt5EW.js"
  },
  "/_nuxt/entry.a3fVNRjW.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"9d7d0-x0c5/oGo2zwX2quGYCs256YkLe8\"",
    "mtime": "2025-01-27T08:23:43.422Z",
    "size": 645072,
    "path": "../public/_nuxt/entry.a3fVNRjW.css"
  },
  "/_nuxt/error-404.C3V-3Mc4.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"de4-tk05rgubWwonEl8hX4lgLuosKN0\"",
    "mtime": "2025-01-27T08:23:43.420Z",
    "size": 3556,
    "path": "../public/_nuxt/error-404.C3V-3Mc4.css"
  },
  "/_nuxt/error-500.dGVH929u.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"75c-KF6NWZfD3QI/4EI5b2MfK1uNuAg\"",
    "mtime": "2025-01-27T08:23:43.420Z",
    "size": 1884,
    "path": "../public/_nuxt/error-500.dGVH929u.css"
  },
  "/_nuxt/fitness.BbG25ixC.avif": {
    "type": "image/avif",
    "etag": "\"ebf4-YQGg328YRLfC5oHFgz6bVYXMuWk\"",
    "mtime": "2025-01-27T08:23:43.419Z",
    "size": 60404,
    "path": "../public/_nuxt/fitness.BbG25ixC.avif"
  },
  "/_nuxt/index.CZ8C1jta.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"37d3-/2gYDQgW5kUu1k5QbFv2LwAUcXw\"",
    "mtime": "2025-01-27T08:23:43.420Z",
    "size": 14291,
    "path": "../public/_nuxt/index.CZ8C1jta.css"
  },
  "/_nuxt/JwPtcLXd.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"338-2rJbEcOkr8u+l1Bi2WA3gXGQQZg\"",
    "mtime": "2025-01-27T08:23:43.443Z",
    "size": 824,
    "path": "../public/_nuxt/JwPtcLXd.js"
  },
  "/_nuxt/materialdesignicons-webfont.B7mPwVP_.ttf": {
    "type": "font/ttf",
    "etag": "\"13f40c-T1Gk3HWmjT5XMhxEjv3eojyKnbA\"",
    "mtime": "2025-01-27T08:23:43.424Z",
    "size": 1307660,
    "path": "../public/_nuxt/materialdesignicons-webfont.B7mPwVP_.ttf"
  },
  "/_nuxt/materialdesignicons-webfont.CSr8KVlo.eot": {
    "type": "application/vnd.ms-fontobject",
    "etag": "\"13f4e8-ApygSKV9BTQg/POr5dCUzjU5OZw\"",
    "mtime": "2025-01-27T08:23:43.413Z",
    "size": 1307880,
    "path": "../public/_nuxt/materialdesignicons-webfont.CSr8KVlo.eot"
  },
  "/_nuxt/materialdesignicons-webfont.Dp5v-WZN.woff2": {
    "type": "font/woff2",
    "etag": "\"62710-TiD2zPQxmd6lyFsjoODwuoH/7iY\"",
    "mtime": "2025-01-27T08:23:43.419Z",
    "size": 403216,
    "path": "../public/_nuxt/materialdesignicons-webfont.Dp5v-WZN.woff2"
  },
  "/_nuxt/materialdesignicons-webfont.PXm3-2wK.woff": {
    "type": "font/woff",
    "etag": "\"8f8d0-zD3UavWtb7zNpwtFPVWUs57NasQ\"",
    "mtime": "2025-01-27T08:23:43.421Z",
    "size": 587984,
    "path": "../public/_nuxt/materialdesignicons-webfont.PXm3-2wK.woff"
  },
  "/_nuxt/news.BZEkL1Fo.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3d6-cs8mOUBzu57CJguJBTGDFKgsNhw\"",
    "mtime": "2025-01-27T08:23:43.420Z",
    "size": 982,
    "path": "../public/_nuxt/news.BZEkL1Fo.css"
  },
  "/_nuxt/news.TMP8sPdg.avif": {
    "type": "image/avif",
    "etag": "\"214ff-fqxnW79cFEkocuAlZ2wX6QvKdu0\"",
    "mtime": "2025-01-27T08:23:43.419Z",
    "size": 136447,
    "path": "../public/_nuxt/news.TMP8sPdg.avif"
  },
  "/_nuxt/PVm8yw9B.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4f519-BXc2878th0AExGFtLmEO6I+DUWk\"",
    "mtime": "2025-01-27T08:23:43.421Z",
    "size": 324889,
    "path": "../public/_nuxt/PVm8yw9B.js"
  },
  "/_nuxt/skills.CKM9MLr4.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"bf-P4swwXB2xFLK/sZp/udWl3EFUIY\"",
    "mtime": "2025-01-27T08:23:43.420Z",
    "size": 191,
    "path": "../public/_nuxt/skills.CKM9MLr4.css"
  },
  "/_nuxt/urbanstyle.QgN-5x_1.avif": {
    "type": "image/avif",
    "etag": "\"13a6c-dx8fT0i7fNjDD4nKG1qadLmCGUQ\"",
    "mtime": "2025-01-27T08:23:43.420Z",
    "size": 80492,
    "path": "../public/_nuxt/urbanstyle.QgN-5x_1.avif"
  },
  "/_nuxt/VCard.8Js4-u2y.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"199f-FNn2tbuY6iKc9uUgnn30bdUoWks\"",
    "mtime": "2025-01-27T08:23:43.420Z",
    "size": 6559,
    "path": "../public/_nuxt/VCard.8Js4-u2y.css"
  },
  "/images/fitness.avif": {
    "type": "image/avif",
    "etag": "\"ebf4-YQGg328YRLfC5oHFgz6bVYXMuWk\"",
    "mtime": "2025-01-19T12:44:39.507Z",
    "size": 60404,
    "path": "../public/images/fitness.avif"
  },
  "/images/logo.avif": {
    "type": "image/avif",
    "etag": "\"6737-0M0oSr/hkjCvlbpUP7HWhF8SH+c\"",
    "mtime": "2025-01-19T12:44:39.507Z",
    "size": 26423,
    "path": "../public/images/logo.avif"
  },
  "/images/news.avif": {
    "type": "image/avif",
    "etag": "\"214ff-fqxnW79cFEkocuAlZ2wX6QvKdu0\"",
    "mtime": "2025-01-19T12:44:39.507Z",
    "size": 136447,
    "path": "../public/images/news.avif"
  },
  "/images/profil.avif": {
    "type": "image/avif",
    "etag": "\"8a08-d3b4rksA0xxcRn6HqMufmhli85w\"",
    "mtime": "2025-01-19T12:44:39.515Z",
    "size": 35336,
    "path": "../public/images/profil.avif"
  },
  "/images/success.avif": {
    "type": "image/avif",
    "etag": "\"1ca-BGAvVC980h999Sj5Wxl/gU/gvaU\"",
    "mtime": "2025-01-19T12:44:39.515Z",
    "size": 458,
    "path": "../public/images/success.avif"
  },
  "/images/urbanstyle.avif": {
    "type": "image/avif",
    "etag": "\"13a6c-dx8fT0i7fNjDD4nKG1qadLmCGUQ\"",
    "mtime": "2025-01-19T12:44:39.517Z",
    "size": 80492,
    "path": "../public/images/urbanstyle.avif"
  },
  "/images/Vignette.avif": {
    "type": "image/avif",
    "etag": "\"15056-CiVQKghUqmrSF7c1pHxLQ0Ba+bc\"",
    "mtime": "2025-01-19T12:44:39.507Z",
    "size": 86102,
    "path": "../public/images/Vignette.avif"
  },
  "/ext/Urbanstyle/accueil.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"3eab-GvDRpJyCdbZ9oCFrQK2SmgXg9uw\"",
    "mtime": "2025-01-21T00:52:56.493Z",
    "size": 16043,
    "path": "../public/ext/Urbanstyle/accueil.html"
  },
  "/ext/Urbanstyle/bfg.jar": {
    "type": "application/java-archive",
    "etag": "\"dd0000-q6v1nRcDCig1Uu0baBYTT2o1P5E\"",
    "mtime": "2025-01-16T12:12:14.836Z",
    "size": 14483456,
    "path": "../public/ext/Urbanstyle/bfg.jar"
  },
  "/ext/Urbanstyle/panier.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"80e-O3LdF8y71cdlrguSRGieSYFTugU\"",
    "mtime": "2025-01-16T12:12:14.854Z",
    "size": 2062,
    "path": "../public/ext/Urbanstyle/panier.css"
  },
  "/ext/Urbanstyle/panier.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"3ea-vXOfBpyPaPD+W8ALN/F2fYPv7Wk\"",
    "mtime": "2025-01-16T12:12:14.857Z",
    "size": 1002,
    "path": "../public/ext/Urbanstyle/panier.html"
  },
  "/ext/Urbanstyle/panier.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"111d-gUmfFKVNJ1irYEMb8rk85ggTjRY\"",
    "mtime": "2025-01-20T18:40:51.994Z",
    "size": 4381,
    "path": "../public/ext/Urbanstyle/panier.js"
  },
  "/ext/Urbanstyle/script.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"c84-zVYAZ1XKdV/231p0Zwh4vP1O+oI\"",
    "mtime": "2025-01-16T12:12:14.860Z",
    "size": 3204,
    "path": "../public/ext/Urbanstyle/script.js"
  },
  "/ext/Urbanstyle/style.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"17f5-u47OmAhKtWSPFG8MUB3A5UrcKM8\"",
    "mtime": "2025-01-20T08:41:32.081Z",
    "size": 6133,
    "path": "../public/ext/Urbanstyle/style.css"
  },
  "/ext/World/app.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3c2-IUhKACBGi3UiLzR6BICkOlGgY48\"",
    "mtime": "2025-01-19T16:23:41.319Z",
    "size": 962,
    "path": "../public/ext/World/app.js"
  },
  "/ext/World/news.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"6cc-MCW1Q+wARQshZAyTenH0zsg+EhE\"",
    "mtime": "2025-01-16T12:12:14.864Z",
    "size": 1740,
    "path": "../public/ext/World/news.css"
  },
  "/ext/World/news.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"c04-V5ibqHc4h2ohna/OMxaDM7daPJ4\"",
    "mtime": "2025-01-19T15:41:39.845Z",
    "size": 3076,
    "path": "../public/ext/World/news.html"
  },
  "/ext/World/news.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"296-1xgC1e+5R4muOqG3llzgR3OTVOE\"",
    "mtime": "2025-01-19T15:28:31.415Z",
    "size": 662,
    "path": "../public/ext/World/news.js"
  },
  "/ext/World/package-lock.json": {
    "type": "application/json",
    "etag": "\"7688-8uAre6+Jbd4i1jVmuOz2LpvSypY\"",
    "mtime": "2025-01-19T16:22:36.989Z",
    "size": 30344,
    "path": "../public/ext/World/package-lock.json"
  },
  "/ext/World/package.json": {
    "type": "application/json",
    "etag": "\"128-KayNu4Wj18H/i2tAk37Je+yf7ck\"",
    "mtime": "2025-01-19T16:22:36.952Z",
    "size": 296,
    "path": "../public/ext/World/package.json"
  },
  "/_nuxt/builds/latest.json": {
    "type": "application/json",
    "etag": "\"47-bO9Q+adPiEuw0KTHizx0liGLAQc\"",
    "mtime": "2025-01-27T08:23:48.801Z",
    "size": 71,
    "path": "../public/_nuxt/builds/latest.json"
  },
  "/ext/Urbanstyle/images/bonnet.avif": {
    "type": "image/avif",
    "etag": "\"179b3-P8kZo+LeXLYK+KbLVaB2Bn9es1A\"",
    "mtime": "2025-01-16T12:12:14.841Z",
    "size": 96691,
    "path": "../public/ext/Urbanstyle/images/bonnet.avif"
  },
  "/ext/Urbanstyle/images/echarpe.avif": {
    "type": "image/avif",
    "etag": "\"1da7d-drNX5ylvm3gE/Fo182chHFYvlNY\"",
    "mtime": "2025-01-16T12:12:14.841Z",
    "size": 121469,
    "path": "../public/ext/Urbanstyle/images/echarpe.avif"
  },
  "/ext/Urbanstyle/images/gants.avif": {
    "type": "image/avif",
    "etag": "\"22716-POfQSbOYx2pRFs7FmnZjgCZYCtI\"",
    "mtime": "2025-01-16T12:12:14.845Z",
    "size": 141078,
    "path": "../public/ext/Urbanstyle/images/gants.avif"
  },
  "/ext/Urbanstyle/images/loupe.png": {
    "type": "image/png",
    "etag": "\"4c3-sGWGIBpAKHahFxXUBRhEeD69pjA\"",
    "mtime": "2024-10-20T09:56:46.797Z",
    "size": 1219,
    "path": "../public/ext/Urbanstyle/images/loupe.png"
  },
  "/ext/Urbanstyle/images/manteau.avif": {
    "type": "image/avif",
    "etag": "\"189c5-Kmemt8ClKdEg1/dnWAJtYpxkzv8\"",
    "mtime": "2025-01-16T12:12:14.851Z",
    "size": 100805,
    "path": "../public/ext/Urbanstyle/images/manteau.avif"
  },
  "/ext/Urbanstyle/images/panier.png": {
    "type": "image/png",
    "etag": "\"911-qH8UDJcIE+erHRrjZWempvLKaeo\"",
    "mtime": "2024-10-20T10:02:45.406Z",
    "size": 2321,
    "path": "../public/ext/Urbanstyle/images/panier.png"
  },
  "/ext/Urbanstyle/images/profile.png": {
    "type": "image/png",
    "etag": "\"2b2-vGuJvkMkXioVPANlNa2OmRNUPXc\"",
    "mtime": "2024-10-20T10:00:17.446Z",
    "size": 690,
    "path": "../public/ext/Urbanstyle/images/profile.png"
  },
  "/ext/Urbanstyle/images/urban.png": {
    "type": "image/png",
    "etag": "\"61f4-w3yAA3kpuJe4m0DhPm3LTKV0Up4\"",
    "mtime": "2025-01-16T12:12:14.854Z",
    "size": 25076,
    "path": "../public/ext/Urbanstyle/images/urban.png"
  },
  "/_nuxt/builds/meta/8a6ff463-5b4e-4608-8bc8-b70c2a5cae26.json": {
    "type": "application/json",
    "etag": "\"8b-4Crv+ODyi/AbbJ8pB/UCzHWr6/U\"",
    "mtime": "2025-01-27T08:23:48.802Z",
    "size": 139,
    "path": "../public/_nuxt/builds/meta/8a6ff463-5b4e-4608-8bc8-b70c2a5cae26.json"
  },
  "/ext/World/node_modules/.package-lock.json": {
    "type": "application/json",
    "etag": "\"75d5-4lBDfspXFDx8DKByK682LgOrovQ\"",
    "mtime": "2025-01-19T16:22:36.998Z",
    "size": 30165,
    "path": "../public/ext/World/node_modules/.package-lock.json"
  },
  "/ext/World/node_modules/.bin/mime": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"173-51rUBu8vn8sam95EumafQWyCTE8\"",
    "mtime": "2025-01-19T16:22:36.945Z",
    "size": 371,
    "path": "../public/ext/World/node_modules/.bin/mime"
  },
  "/ext/World/node_modules/.bin/mime.cmd": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"13c-g/pmzQX2TeHvfzAQNEoPe6vlSBk\"",
    "mtime": "2025-01-19T16:22:36.945Z",
    "size": 316,
    "path": "../public/ext/World/node_modules/.bin/mime.cmd"
  },
  "/ext/World/node_modules/.bin/mime.ps1": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"301-u4EHPY4HxIPuKRITWIcVNZczNuc\"",
    "mtime": "2025-01-19T16:22:36.944Z",
    "size": 769,
    "path": "../public/ext/World/node_modules/.bin/mime.ps1"
  },
  "/ext/World/node_modules/.bin/node": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"10f-OCJQe4JQ3JKb/5qSodeqByE0DTs\"",
    "mtime": "2025-01-19T16:22:36.945Z",
    "size": 271,
    "path": "../public/ext/World/node_modules/.bin/node"
  },
  "/ext/World/node_modules/.bin/node.cmd": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"7b-qPwKl4tzn/O0WvGJ0tQwwT2E1L4\"",
    "mtime": "2025-01-19T16:22:36.945Z",
    "size": 123,
    "path": "../public/ext/World/node_modules/.bin/node.cmd"
  },
  "/ext/World/node_modules/.bin/node.ps1": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"1be-VIm927Pob74tNfbsvNEXseKiiI4\"",
    "mtime": "2025-01-19T16:22:36.945Z",
    "size": 446,
    "path": "../public/ext/World/node_modules/.bin/node.ps1"
  },
  "/ext/World/node_modules/accepts/HISTORY.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"13e8-WL6GeEJVEcfPpg4O4PAJdA6qRhY\"",
    "mtime": "2025-01-19T16:22:33.129Z",
    "size": 5096,
    "path": "../public/ext/World/node_modules/accepts/HISTORY.md"
  },
  "/ext/World/node_modules/accepts/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1484-KCJj9F9r+A+/Q/QJfVO1tg/xoF8\"",
    "mtime": "2025-01-19T16:22:33.063Z",
    "size": 5252,
    "path": "../public/ext/World/node_modules/accepts/index.js"
  },
  "/ext/World/node_modules/accepts/LICENSE": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"48f-8CevPmGvOID9f3uLqUUqhd0hVzg\"",
    "mtime": "2025-01-19T16:22:33.032Z",
    "size": 1167,
    "path": "../public/ext/World/node_modules/accepts/LICENSE"
  },
  "/ext/World/node_modules/accepts/package.json": {
    "type": "application/json",
    "etag": "\"485-Exuk1jdH5mY6nBlAnkOsA0vVMs8\"",
    "mtime": "2025-01-19T16:22:33.102Z",
    "size": 1157,
    "path": "../public/ext/World/node_modules/accepts/package.json"
  },
  "/ext/World/node_modules/accepts/README.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"101b-OohFENLu7XOkzVrglHpscs08dCY\"",
    "mtime": "2025-01-19T16:22:33.154Z",
    "size": 4123,
    "path": "../public/ext/World/node_modules/accepts/README.md"
  },
  "/ext/World/node_modules/array-flatten/array-flatten.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4ab-/GzDDouOwJ7rpiusB27WJ6o+6NE\"",
    "mtime": "2025-01-19T16:22:33.129Z",
    "size": 1195,
    "path": "../public/ext/World/node_modules/array-flatten/array-flatten.js"
  },
  "/ext/World/node_modules/array-flatten/LICENSE": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"44f-On+Ia2MtIZdnakACDTVOhLeGBgQ\"",
    "mtime": "2025-01-19T16:22:33.099Z",
    "size": 1103,
    "path": "../public/ext/World/node_modules/array-flatten/LICENSE"
  },
  "/ext/World/node_modules/array-flatten/package.json": {
    "type": "application/json",
    "etag": "\"36f-/FG4nQ+3zGQKBJW6pABTZOg3GMM\"",
    "mtime": "2025-01-19T16:22:33.032Z",
    "size": 879,
    "path": "../public/ext/World/node_modules/array-flatten/package.json"
  },
  "/ext/World/node_modules/array-flatten/README.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"4dd-mO+p5L1ta8pOu3aZGiGHqKSWyLY\"",
    "mtime": "2025-01-19T16:22:33.063Z",
    "size": 1245,
    "path": "../public/ext/World/node_modules/array-flatten/README.md"
  },
  "/ext/World/node_modules/body-parser/HISTORY.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"4159-yaq2fThyRf9wHZUg/wf4Ssz8xCI\"",
    "mtime": "2025-01-19T16:22:33.218Z",
    "size": 16729,
    "path": "../public/ext/World/node_modules/body-parser/HISTORY.md"
  },
  "/ext/World/node_modules/body-parser/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"a79-DLa563sxDDfllQu8r2cpQ2V8lLU\"",
    "mtime": "2025-01-19T16:22:33.063Z",
    "size": 2681,
    "path": "../public/ext/World/node_modules/body-parser/index.js"
  },
  "/ext/World/node_modules/body-parser/LICENSE": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"494-ak7TtenP9or3WT38uL48HL6oN9A\"",
    "mtime": "2025-01-19T16:22:33.032Z",
    "size": 1172,
    "path": "../public/ext/World/node_modules/body-parser/LICENSE"
  },
  "/ext/World/node_modules/body-parser/package.json": {
    "type": "application/json",
    "etag": "\"5c0-qlC0hS3HgaiDvqzrV8Kxd07vj+Q\"",
    "mtime": "2025-01-19T16:22:33.205Z",
    "size": 1472,
    "path": "../public/ext/World/node_modules/body-parser/package.json"
  },
  "/ext/World/node_modules/body-parser/README.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"4aec-J29gtZFknbJQ9EVWzaH7mE09Tr4\"",
    "mtime": "2025-01-19T16:22:33.228Z",
    "size": 19180,
    "path": "../public/ext/World/node_modules/body-parser/README.md"
  },
  "/ext/World/node_modules/body-parser/SECURITY.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"4a9-Fc7qEUgj2vuDhgiVsHefytsRVlM\"",
    "mtime": "2025-01-19T16:22:33.233Z",
    "size": 1193,
    "path": "../public/ext/World/node_modules/body-parser/SECURITY.md"
  },
  "/ext/World/node_modules/bytes/History.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"6ef-VDVQvp5xNggwSuL4mn6bTfBw7I8\"",
    "mtime": "2025-01-19T16:22:33.121Z",
    "size": 1775,
    "path": "../public/ext/World/node_modules/bytes/History.md"
  },
  "/ext/World/node_modules/bytes/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"e1d-vUZSnlY3/xplnx1K8lmJJbEnQeA\"",
    "mtime": "2025-01-19T16:22:33.054Z",
    "size": 3613,
    "path": "../public/ext/World/node_modules/bytes/index.js"
  },
  "/ext/World/node_modules/bytes/LICENSE": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"481-C4TNufxiY+wX2JkdkQmSK4QNTzA\"",
    "mtime": "2025-01-19T16:22:33.026Z",
    "size": 1153,
    "path": "../public/ext/World/node_modules/bytes/LICENSE"
  },
  "/ext/World/node_modules/bytes/package.json": {
    "type": "application/json",
    "etag": "\"3bf-2P4+cOtOz0v1g4Xksn+Jt85laig\"",
    "mtime": "2025-01-19T16:22:33.088Z",
    "size": 959,
    "path": "../public/ext/World/node_modules/bytes/package.json"
  },
  "/ext/World/node_modules/bytes/Readme.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"12a2-wfZLtwictZ1bPZKTiBGNJUSK4io\"",
    "mtime": "2025-01-19T16:22:33.145Z",
    "size": 4770,
    "path": "../public/ext/World/node_modules/bytes/Readme.md"
  },
  "/ext/World/node_modules/call-bind-apply-helpers/.eslintrc": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"d0-au/ohwdQ4jf8JiRpl7nyf2ArRh4\"",
    "mtime": "2025-01-19T16:22:33.014Z",
    "size": 208,
    "path": "../public/ext/World/node_modules/call-bind-apply-helpers/.eslintrc"
  },
  "/ext/World/node_modules/call-bind-apply-helpers/.nycrc": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"8b-VPnXrfiUPLB/ghQ1uyaetLpAzMI\"",
    "mtime": "2025-01-19T16:22:33.048Z",
    "size": 139,
    "path": "../public/ext/World/node_modules/call-bind-apply-helpers/.nycrc"
  },
  "/ext/World/node_modules/call-bind-apply-helpers/actualApply.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"118-uKisCYlpUUephTpFspP3Y9u4IM4\"",
    "mtime": "2025-01-19T16:22:33.121Z",
    "size": 280,
    "path": "../public/ext/World/node_modules/call-bind-apply-helpers/actualApply.js"
  },
  "/ext/World/node_modules/call-bind-apply-helpers/applyBind.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"108-PJKWVaT5kMzy7mJv5hyqfI0EhlY\"",
    "mtime": "2025-01-19T16:22:33.145Z",
    "size": 264,
    "path": "../public/ext/World/node_modules/call-bind-apply-helpers/applyBind.js"
  },
  "/ext/World/node_modules/call-bind-apply-helpers/CHANGELOG.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"58b-KlMO4S+FtZ6NJrHfFIFp676zaDs\"",
    "mtime": "2025-01-19T16:22:33.233Z",
    "size": 1419,
    "path": "../public/ext/World/node_modules/call-bind-apply-helpers/CHANGELOG.md"
  },
  "/ext/World/node_modules/call-bind-apply-helpers/functionApply.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"63-ANbuT+EX+RoFOoCyVZrsazTFZbA\"",
    "mtime": "2025-01-19T16:22:33.163Z",
    "size": 99,
    "path": "../public/ext/World/node_modules/call-bind-apply-helpers/functionApply.js"
  },
  "/ext/World/node_modules/call-bind-apply-helpers/functionCall.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"61-bwOyrYDEQHwjEbUmWSfrQvzTcGU\"",
    "mtime": "2025-01-19T16:22:33.180Z",
    "size": 97,
    "path": "../public/ext/World/node_modules/call-bind-apply-helpers/functionCall.js"
  },
  "/ext/World/node_modules/call-bind-apply-helpers/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"19b-FCXzV1mdKcz4jc+RfqL0luY7RHU\"",
    "mtime": "2025-01-19T16:22:33.188Z",
    "size": 411,
    "path": "../public/ext/World/node_modules/call-bind-apply-helpers/index.js"
  },
  "/ext/World/node_modules/call-bind-apply-helpers/LICENSE": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"42f-pHhoq5C1Mt+Cq+Pk9Qe8supEE2Q\"",
    "mtime": "2025-01-19T16:22:33.080Z",
    "size": 1071,
    "path": "../public/ext/World/node_modules/call-bind-apply-helpers/LICENSE"
  },
  "/ext/World/node_modules/call-bind-apply-helpers/package.json": {
    "type": "application/json",
    "etag": "\"9b0-e3/IeQUR6+aktiJMVZ4NCawcvxo\"",
    "mtime": "2025-01-19T16:22:33.221Z",
    "size": 2480,
    "path": "../public/ext/World/node_modules/call-bind-apply-helpers/package.json"
  },
  "/ext/World/node_modules/call-bind-apply-helpers/README.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"91a-AVaV3ujCgZXhUhHFodBj01lVXz0\"",
    "mtime": "2025-01-19T16:22:33.238Z",
    "size": 2330,
    "path": "../public/ext/World/node_modules/call-bind-apply-helpers/README.md"
  },
  "/ext/World/node_modules/call-bind-apply-helpers/reflectApply.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"84-JmfmXLrhVBtM8tPK4ZCmylGREYc\"",
    "mtime": "2025-01-19T16:22:33.211Z",
    "size": 132,
    "path": "../public/ext/World/node_modules/call-bind-apply-helpers/reflectApply.js"
  },
  "/ext/World/node_modules/call-bind-apply-helpers/tsconfig.json": {
    "type": "application/json",
    "etag": "\"73-F0jeniDkWdCDDQtXvMnfeyEh/sk\"",
    "mtime": "2025-01-19T16:22:33.228Z",
    "size": 115,
    "path": "../public/ext/World/node_modules/call-bind-apply-helpers/tsconfig.json"
  },
  "/ext/World/node_modules/call-bound/.eslintrc": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"8a-ajoYQMp7uDO8G3itu7fwbtt5Ajs\"",
    "mtime": "2025-01-19T16:22:33.021Z",
    "size": 138,
    "path": "../public/ext/World/node_modules/call-bound/.eslintrc"
  },
  "/ext/World/node_modules/call-bound/.nycrc": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"8b-VPnXrfiUPLB/ghQ1uyaetLpAzMI\"",
    "mtime": "2025-01-19T16:22:33.048Z",
    "size": 139,
    "path": "../public/ext/World/node_modules/call-bound/.nycrc"
  },
  "/ext/World/node_modules/call-bound/CHANGELOG.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"8cc-jPPNflm9tR8s36+M7cUY95zlJHw\"",
    "mtime": "2025-01-19T16:22:33.192Z",
    "size": 2252,
    "path": "../public/ext/World/node_modules/call-bound/CHANGELOG.md"
  },
  "/ext/World/node_modules/call-bound/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"29b-F2FaGolIz+cx2uzzHmYrq02CBYE\"",
    "mtime": "2025-01-19T16:22:33.121Z",
    "size": 667,
    "path": "../public/ext/World/node_modules/call-bound/index.js"
  },
  "/ext/World/node_modules/call-bound/LICENSE": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"42f-pHhoq5C1Mt+Cq+Pk9Qe8supEE2Q\"",
    "mtime": "2025-01-19T16:22:33.080Z",
    "size": 1071,
    "path": "../public/ext/World/node_modules/call-bound/LICENSE"
  },
  "/ext/World/node_modules/call-bound/package.json": {
    "type": "application/json",
    "etag": "\"9cb-K96cMo397XrNcGDECitF+rdf6T8\"",
    "mtime": "2025-01-19T16:22:33.171Z",
    "size": 2507,
    "path": "../public/ext/World/node_modules/call-bound/package.json"
  },
  "/ext/World/node_modules/call-bound/README.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"769-vPzI+Syc6hJ7lTuJT5KCD97zvJk\"",
    "mtime": "2025-01-19T16:22:33.199Z",
    "size": 1897,
    "path": "../public/ext/World/node_modules/call-bound/README.md"
  },
  "/ext/World/node_modules/call-bound/tsconfig.json": {
    "type": "application/json",
    "etag": "\"74-oWRyQk+MJhhN5Vfv+NaCSTnR/I4\"",
    "mtime": "2025-01-19T16:22:33.180Z",
    "size": 116,
    "path": "../public/ext/World/node_modules/call-bound/tsconfig.json"
  },
  "/ext/World/node_modules/content-disposition/HISTORY.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"3fc-HdtQxarD4xEHw9WyReSRD6ssuck\"",
    "mtime": "2025-01-19T16:22:33.140Z",
    "size": 1020,
    "path": "../public/ext/World/node_modules/content-disposition/HISTORY.md"
  },
  "/ext/World/node_modules/content-disposition/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2962-7X8Ye3KnsfgdETutWqk0fCQhINU\"",
    "mtime": "2025-01-19T16:22:33.063Z",
    "size": 10594,
    "path": "../public/ext/World/node_modules/content-disposition/index.js"
  },
  "/ext/World/node_modules/content-disposition/LICENSE": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"446-SIGtLsjrJHCnBJQhBHxtB29I8d4\"",
    "mtime": "2025-01-19T16:22:33.032Z",
    "size": 1094,
    "path": "../public/ext/World/node_modules/content-disposition/LICENSE"
  },
  "/ext/World/node_modules/content-disposition/package.json": {
    "type": "application/json",
    "etag": "\"4b0-G4cf+u/iof1pqpsVOLQAO/Dq6as\"",
    "mtime": "2025-01-19T16:22:33.102Z",
    "size": 1200,
    "path": "../public/ext/World/node_modules/content-disposition/package.json"
  },
  "/ext/World/node_modules/content-disposition/README.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"1455-4dEJ1YSmPeJBit/Y+1mymNDZNo4\"",
    "mtime": "2025-01-19T16:22:33.163Z",
    "size": 5205,
    "path": "../public/ext/World/node_modules/content-disposition/README.md"
  },
  "/ext/World/node_modules/content-type/HISTORY.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"20b-eElRXR6uHlg75jI5nk/sYbEiHaI\"",
    "mtime": "2025-01-19T16:22:33.129Z",
    "size": 523,
    "path": "../public/ext/World/node_modules/content-type/HISTORY.md"
  },
  "/ext/World/node_modules/content-type/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"138a-G25+jRljzpWM8PIlIj+tte8S+G0\"",
    "mtime": "2025-01-19T16:22:33.063Z",
    "size": 5002,
    "path": "../public/ext/World/node_modules/content-type/index.js"
  },
  "/ext/World/node_modules/content-type/LICENSE": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"441-MP6TsyMdvbmhIs9XwsmiqyjO9oI\"",
    "mtime": "2025-01-19T16:22:33.032Z",
    "size": 1089,
    "path": "../public/ext/World/node_modules/content-type/LICENSE"
  },
  "/ext/World/node_modules/content-type/package.json": {
    "type": "application/json",
    "etag": "\"433-FUXG2FONflnzddSuSw4NEEcabBw\"",
    "mtime": "2025-01-19T16:22:33.099Z",
    "size": 1075,
    "path": "../public/ext/World/node_modules/content-type/package.json"
  },
  "/ext/World/node_modules/content-type/README.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"ade-9BsrQfNUQ41u0A0dAotUqT+hWGI\"",
    "mtime": "2025-01-19T16:22:33.154Z",
    "size": 2782,
    "path": "../public/ext/World/node_modules/content-type/README.md"
  },
  "/ext/World/node_modules/cookie/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1fa7-EjjWWmc8LzyKhYFPAvp96WwlNMk\"",
    "mtime": "2025-01-19T16:22:33.063Z",
    "size": 8103,
    "path": "../public/ext/World/node_modules/cookie/index.js"
  },
  "/ext/World/node_modules/cookie/LICENSE": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"497-GRiPGKahjw4COIUp7JBbu/pWT0E\"",
    "mtime": "2025-01-19T16:22:33.032Z",
    "size": 1175,
    "path": "../public/ext/World/node_modules/cookie/LICENSE"
  },
  "/ext/World/node_modules/cookie/package.json": {
    "type": "application/json",
    "etag": "\"444-UnSCBnrkK6YSwtmSSDTDK1B/xFo\"",
    "mtime": "2025-01-19T16:22:33.099Z",
    "size": 1092,
    "path": "../public/ext/World/node_modules/cookie/package.json"
  },
  "/ext/World/node_modules/cookie/README.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"2df9-pNaNP3ZRLIfPvPam5VOHbRmApug\"",
    "mtime": "2025-01-19T16:22:33.137Z",
    "size": 11769,
    "path": "../public/ext/World/node_modules/cookie/README.md"
  },
  "/ext/World/node_modules/cookie/SECURITY.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"49c-wvh0Y6j6FTJUwhUA4bkGxkqBOtk\"",
    "mtime": "2025-01-19T16:22:33.161Z",
    "size": 1180,
    "path": "../public/ext/World/node_modules/cookie/SECURITY.md"
  },
  "/ext/World/node_modules/cookie-signature/.npmignore": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"1d-PNbt8OjstgyMboy+ds01hxJQTVc\"",
    "mtime": "2025-01-19T16:22:33.063Z",
    "size": 29,
    "path": "../public/ext/World/node_modules/cookie-signature/.npmignore"
  },
  "/ext/World/node_modules/cookie-signature/History.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"2b7-DuKagPAvCNczQoQjduJ7w7f309s\"",
    "mtime": "2025-01-19T16:22:33.129Z",
    "size": 695,
    "path": "../public/ext/World/node_modules/cookie-signature/History.md"
  },
  "/ext/World/node_modules/cookie-signature/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4ce-u1wsCkY6oQB0yvmR9naBIxsfDCE\"",
    "mtime": "2025-01-19T16:22:33.099Z",
    "size": 1230,
    "path": "../public/ext/World/node_modules/cookie-signature/index.js"
  },
  "/ext/World/node_modules/cookie-signature/package.json": {
    "type": "application/json",
    "etag": "\"1ec-6wcUIyBfw1Vz5xS6p1XjqekAqXk\"",
    "mtime": "2025-01-19T16:22:33.031Z",
    "size": 492,
    "path": "../public/ext/World/node_modules/cookie-signature/package.json"
  },
  "/ext/World/node_modules/cookie-signature/Readme.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"5d2-7t8N7ZN/Nrj/UFSlsIzzj9wkHes\"",
    "mtime": "2025-01-19T16:22:33.154Z",
    "size": 1490,
    "path": "../public/ext/World/node_modules/cookie-signature/Readme.md"
  },
  "/ext/World/node_modules/debug/.coveralls.yml": {
    "type": "text/yaml; charset=utf-8",
    "etag": "\"2e-kHCeT7TOF3KZdLOhQMy/MwUZg1w\"",
    "mtime": "2025-01-19T16:22:33.203Z",
    "size": 46,
    "path": "../public/ext/World/node_modules/debug/.coveralls.yml"
  },
  "/ext/World/node_modules/debug/.eslintrc": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"b4-jRVK7d9mp7y9Qz48YZ92uw2SCuI\"",
    "mtime": "2025-01-19T16:22:33.180Z",
    "size": 180,
    "path": "../public/ext/World/node_modules/debug/.eslintrc"
  },
  "/ext/World/node_modules/debug/.npmignore": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"48-kP73zBBYvQ+FsJWcT81JIwopWT4\"",
    "mtime": "2025-01-19T16:22:33.063Z",
    "size": 72,
    "path": "../public/ext/World/node_modules/debug/.npmignore"
  },
  "/ext/World/node_modules/debug/.travis.yml": {
    "type": "text/yaml; charset=utf-8",
    "etag": "\"8c-6HppoGT2qVsWYzPUa5Ga+8VIf1k\"",
    "mtime": "2025-01-19T16:22:33.220Z",
    "size": 140,
    "path": "../public/ext/World/node_modules/debug/.travis.yml"
  },
  "/ext/World/node_modules/debug/CHANGELOG.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"2dbb-w15qhbSocy7Ir2O+6pZEg+Gy3ZQ\"",
    "mtime": "2025-01-19T16:22:33.228Z",
    "size": 11707,
    "path": "../public/ext/World/node_modules/debug/CHANGELOG.md"
  },
  "/ext/World/node_modules/debug/component.json": {
    "type": "application/json",
    "etag": "\"141-SWOIm3kFq9WolVuNJ8MHni1ElWQ\"",
    "mtime": "2025-01-19T16:22:33.211Z",
    "size": 321,
    "path": "../public/ext/World/node_modules/debug/component.json"
  },
  "/ext/World/node_modules/debug/karma.conf.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"6c8-k/73zz7W8E0s/DzQuNXZctNc/Sk\"",
    "mtime": "2025-01-19T16:22:33.154Z",
    "size": 1736,
    "path": "../public/ext/World/node_modules/debug/karma.conf.js"
  },
  "/ext/World/node_modules/debug/LICENSE": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"453-0WonhpYlcSgKEcrgHV5ZrrE1HJo\"",
    "mtime": "2025-01-19T16:22:33.137Z",
    "size": 1107,
    "path": "../public/ext/World/node_modules/debug/LICENSE"
  },
  "/ext/World/node_modules/debug/Makefile": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"423-ietae4OFc073/0+RDUYFzeC8Ev0\"",
    "mtime": "2025-01-19T16:22:33.195Z",
    "size": 1059,
    "path": "../public/ext/World/node_modules/debug/Makefile"
  },
  "/ext/World/node_modules/debug/node.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"28-qnZV7oDJpIUxNnX5N5wvGNM+oGE\"",
    "mtime": "2025-01-19T16:22:33.172Z",
    "size": 40,
    "path": "../public/ext/World/node_modules/debug/node.js"
  },
  "/ext/World/node_modules/debug/package.json": {
    "type": "application/json",
    "etag": "\"472-jr8PgGYNmC/GjwD4KFVpYVfnSxA\"",
    "mtime": "2025-01-19T16:22:33.031Z",
    "size": 1138,
    "path": "../public/ext/World/node_modules/debug/package.json"
  },
  "/ext/World/node_modules/debug/README.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"45fe-OAlqnBCDBxRpWpeoUBuBfrCnU04\"",
    "mtime": "2025-01-19T16:22:33.102Z",
    "size": 17918,
    "path": "../public/ext/World/node_modules/debug/README.md"
  },
  "/ext/World/node_modules/destroy/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"10a2-ZUfpxtv7KHyyKBmVVybvwBoplQ8\"",
    "mtime": "2025-01-19T16:22:33.054Z",
    "size": 4258,
    "path": "../public/ext/World/node_modules/destroy/index.js"
  },
  "/ext/World/node_modules/destroy/LICENSE": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"495-6H2su+voL0ewL4KXFBRoLANWA3M\"",
    "mtime": "2025-01-19T16:22:33.026Z",
    "size": 1173,
    "path": "../public/ext/World/node_modules/destroy/LICENSE"
  },
  "/ext/World/node_modules/destroy/package.json": {
    "type": "application/json",
    "etag": "\"468-4SEV7ZoeLFbrNez8FP+DuMApNdU\"",
    "mtime": "2025-01-19T16:22:33.095Z",
    "size": 1128,
    "path": "../public/ext/World/node_modules/destroy/package.json"
  },
  "/ext/World/node_modules/destroy/README.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"99b-MdbQ9LjxfCVRVAhXBWlQxAZhj1E\"",
    "mtime": "2025-01-19T16:22:33.129Z",
    "size": 2459,
    "path": "../public/ext/World/node_modules/destroy/README.md"
  },
  "/ext/World/node_modules/depd/History.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"8d0-XFQN2qBPQxQJDX+3S1UniflZFVE\"",
    "mtime": "2025-01-19T16:22:33.063Z",
    "size": 2256,
    "path": "../public/ext/World/node_modules/depd/History.md"
  },
  "/ext/World/node_modules/depd/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2ab4-FpDCdFdjfsI01rdljxuW5Ueg65k\"",
    "mtime": "2025-01-19T16:22:33.103Z",
    "size": 10932,
    "path": "../public/ext/World/node_modules/depd/index.js"
  },
  "/ext/World/node_modules/depd/LICENSE": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"446-sfxAYECQW73Hmi6Rh7xYqku+l3Q\"",
    "mtime": "2025-01-19T16:22:33.137Z",
    "size": 1094,
    "path": "../public/ext/World/node_modules/depd/LICENSE"
  },
  "/ext/World/node_modules/depd/package.json": {
    "type": "application/json",
    "etag": "\"537-PBAILBRkpvWJqhDNqIKF54Dr+Fc\"",
    "mtime": "2025-01-19T16:22:33.031Z",
    "size": 1335,
    "path": "../public/ext/World/node_modules/depd/package.json"
  },
  "/ext/World/node_modules/depd/Readme.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"2704-3umfq5WmRBGRxwmwELq7GnAVtXU\"",
    "mtime": "2025-01-19T16:22:33.154Z",
    "size": 9988,
    "path": "../public/ext/World/node_modules/depd/Readme.md"
  },
  "/ext/World/node_modules/dunder-proto/.eslintrc": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"2b-r3nIG9YcmpN/yhhCXdhM34MXyLk\"",
    "mtime": "2025-01-19T16:22:33.014Z",
    "size": 43,
    "path": "../public/ext/World/node_modules/dunder-proto/.eslintrc"
  },
  "/ext/World/node_modules/dunder-proto/.nycrc": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"d8-lUYhcmmRh6wC6uxgdAJLJubXHP8\"",
    "mtime": "2025-01-19T16:22:33.048Z",
    "size": 216,
    "path": "../public/ext/World/node_modules/dunder-proto/.nycrc"
  },
  "/ext/World/node_modules/dunder-proto/CHANGELOG.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"60b-35WLHF6jqPQH5adsQ9gJQGNhoTU\"",
    "mtime": "2025-01-19T16:22:33.215Z",
    "size": 1547,
    "path": "../public/ext/World/node_modules/dunder-proto/CHANGELOG.md"
  },
  "/ext/World/node_modules/dunder-proto/get.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3d4-zXO1Et2FGqQMn04mK9isLMtT8+M\"",
    "mtime": "2025-01-19T16:22:33.121Z",
    "size": 980,
    "path": "../public/ext/World/node_modules/dunder-proto/get.js"
  },
  "/ext/World/node_modules/dunder-proto/LICENSE": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"431-4xos4SUGZLoCxbDlI2AKzEMwrCQ\"",
    "mtime": "2025-01-19T16:22:33.080Z",
    "size": 1073,
    "path": "../public/ext/World/node_modules/dunder-proto/LICENSE"
  },
  "/ext/World/node_modules/dunder-proto/package.json": {
    "type": "application/json",
    "etag": "\"83c-1PTahfqeUbSEPSnX5UGZHPN3uNU\"",
    "mtime": "2025-01-19T16:22:33.199Z",
    "size": 2108,
    "path": "../public/ext/World/node_modules/dunder-proto/package.json"
  },
  "/ext/World/node_modules/dunder-proto/README.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"773-/tihpbm7R1EZbQZ/aDjRexACXAY\"",
    "mtime": "2025-01-19T16:22:33.222Z",
    "size": 1907,
    "path": "../public/ext/World/node_modules/dunder-proto/README.md"
  },
  "/ext/World/node_modules/dunder-proto/set.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4fc-a4hBvLZxgmcHNyTy9Z4HA8KMc5c\"",
    "mtime": "2025-01-19T16:22:33.180Z",
    "size": 1276,
    "path": "../public/ext/World/node_modules/dunder-proto/set.js"
  },
  "/ext/World/node_modules/dunder-proto/tsconfig.json": {
    "type": "application/json",
    "etag": "\"74-kDQsVMD57qovAQ+GXhUEGTbMY1A\"",
    "mtime": "2025-01-19T16:22:33.208Z",
    "size": 116,
    "path": "../public/ext/World/node_modules/dunder-proto/tsconfig.json"
  },
  "/ext/World/node_modules/ee-first/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"694-ZyG1Iaw1CXMdPQ+bAHSQgXbh/MQ\"",
    "mtime": "2025-01-19T16:22:33.121Z",
    "size": 1684,
    "path": "../public/ext/World/node_modules/ee-first/index.js"
  },
  "/ext/World/node_modules/ee-first/LICENSE": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"44b-tVnEXI0H8meWINl3HmhpbuPVlks\"",
    "mtime": "2025-01-19T16:22:33.088Z",
    "size": 1099,
    "path": "../public/ext/World/node_modules/ee-first/LICENSE"
  },
  "/ext/World/node_modules/ee-first/package.json": {
    "type": "application/json",
    "etag": "\"35b-f/5h+H+UpVj6vBd8rVybkLFkgc8\"",
    "mtime": "2025-01-19T16:22:33.023Z",
    "size": 859,
    "path": "../public/ext/World/node_modules/ee-first/package.json"
  },
  "/ext/World/node_modules/ee-first/README.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"a39-fGEc3ra2bfeK37SxpW/sCH3OFLU\"",
    "mtime": "2025-01-19T16:22:33.048Z",
    "size": 2617,
    "path": "../public/ext/World/node_modules/ee-first/README.md"
  },
  "/ext/World/node_modules/encodeurl/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"62a-l2KoK7BvV4KRUDCkVtucO+loEcE\"",
    "mtime": "2025-01-19T16:22:33.063Z",
    "size": 1578,
    "path": "../public/ext/World/node_modules/encodeurl/index.js"
  },
  "/ext/World/node_modules/encodeurl/LICENSE": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"441-ZdTCBqJmZlPC/W5RZGj6WqMh6PE\"",
    "mtime": "2025-01-19T16:22:33.032Z",
    "size": 1089,
    "path": "../public/ext/World/node_modules/encodeurl/LICENSE"
  },
  "/ext/World/node_modules/encodeurl/package.json": {
    "type": "application/json",
    "etag": "\"444-QCKCWbtPEGcGSQ0LC3PNTzXW20Q\"",
    "mtime": "2025-01-19T16:22:33.095Z",
    "size": 1092,
    "path": "../public/ext/World/node_modules/encodeurl/package.json"
  },
  "/ext/World/node_modules/encodeurl/README.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"c95-37dlwHXejBN9zAjdoQKOEUtSSw4\"",
    "mtime": "2025-01-19T16:22:33.129Z",
    "size": 3221,
    "path": "../public/ext/World/node_modules/encodeurl/README.md"
  },
  "/ext/World/node_modules/es-define-property/.eslintrc": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"90-DDyR0ygrem948X5suxvGcEOeRWs\"",
    "mtime": "2025-01-19T16:22:33.014Z",
    "size": 144,
    "path": "../public/ext/World/node_modules/es-define-property/.eslintrc"
  },
  "/ext/World/node_modules/es-define-property/.nycrc": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"8b-VPnXrfiUPLB/ghQ1uyaetLpAzMI\"",
    "mtime": "2025-01-19T16:22:33.048Z",
    "size": 139,
    "path": "../public/ext/World/node_modules/es-define-property/.nycrc"
  },
  "/ext/World/node_modules/es-define-property/CHANGELOG.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"8f8-m5j3mSeI4jKIPzk/9f3tPaqqKqg\"",
    "mtime": "2025-01-19T16:22:33.192Z",
    "size": 2296,
    "path": "../public/ext/World/node_modules/es-define-property/CHANGELOG.md"
  },
  "/ext/World/node_modules/es-define-property/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"120-ekvPfL/uQNOh4pPnnBqh+RaBIr0\"",
    "mtime": "2025-01-19T16:22:33.121Z",
    "size": 288,
    "path": "../public/ext/World/node_modules/es-define-property/index.js"
  },
  "/ext/World/node_modules/es-define-property/LICENSE": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"42f-pHhoq5C1Mt+Cq+Pk9Qe8supEE2Q\"",
    "mtime": "2025-01-19T16:22:33.080Z",
    "size": 1071,
    "path": "../public/ext/World/node_modules/es-define-property/LICENSE"
  },
  "/ext/World/node_modules/es-define-property/package.json": {
    "type": "application/json",
    "etag": "\"851-8aNctD/v7w0OYJIMTfUxO6Yw7m0\"",
    "mtime": "2025-01-19T16:22:33.171Z",
    "size": 2129,
    "path": "../public/ext/World/node_modules/es-define-property/package.json"
  },
  "/ext/World/node_modules/es-define-property/README.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"808-F6PKXf+cMW9SsJ9I0Gq9dLkIodY\"",
    "mtime": "2025-01-19T16:22:33.202Z",
    "size": 2056,
    "path": "../public/ext/World/node_modules/es-define-property/README.md"
  },
  "/ext/World/node_modules/es-define-property/tsconfig.json": {
    "type": "application/json",
    "etag": "\"8a-eZ6xEWFLd7Q+HjOX1grfijSrIEo\"",
    "mtime": "2025-01-19T16:22:33.180Z",
    "size": 138,
    "path": "../public/ext/World/node_modules/es-define-property/tsconfig.json"
  },
  "/ext/World/node_modules/es-errors/.eslintrc": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"2b-r3nIG9YcmpN/yhhCXdhM34MXyLk\"",
    "mtime": "2025-01-19T16:22:33.021Z",
    "size": 43,
    "path": "../public/ext/World/node_modules/es-errors/.eslintrc"
  },
  "/ext/World/node_modules/es-errors/CHANGELOG.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"729-E/4Us77wjxa1NIltKRYBGVg3BNE\"",
    "mtime": "2025-01-19T16:22:33.233Z",
    "size": 1833,
    "path": "../public/ext/World/node_modules/es-errors/CHANGELOG.md"
  },
  "/ext/World/node_modules/es-errors/eval.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4b-Pe3sw02Mjshg5MSeUQUfYPTYf4I\"",
    "mtime": "2025-01-19T16:22:33.087Z",
    "size": 75,
    "path": "../public/ext/World/node_modules/es-errors/eval.js"
  },
  "/ext/World/node_modules/es-errors/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"42-RtD7v/stEbvvM7XCP/IBTw8ber4\"",
    "mtime": "2025-01-19T16:22:33.121Z",
    "size": 66,
    "path": "../public/ext/World/node_modules/es-errors/index.js"
  },
  "/ext/World/node_modules/es-errors/LICENSE": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"42f-pHhoq5C1Mt+Cq+Pk9Qe8supEE2Q\"",
    "mtime": "2025-01-19T16:22:33.048Z",
    "size": 1071,
    "path": "../public/ext/World/node_modules/es-errors/LICENSE"
  },
  "/ext/World/node_modules/es-errors/package.json": {
    "type": "application/json",
    "etag": "\"87e-0TvLN6tqt/CRHOcoFIyxyEhagdE\"",
    "mtime": "2025-01-19T16:22:33.218Z",
    "size": 2174,
    "path": "../public/ext/World/node_modules/es-errors/package.json"
  },
  "/ext/World/node_modules/es-errors/range.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4d-I+hDoEdqsrvgiViQIs+i6mJ4ct0\"",
    "mtime": "2025-01-19T16:22:33.172Z",
    "size": 77,
    "path": "../public/ext/World/node_modules/es-errors/range.js"
  },
  "/ext/World/node_modules/es-errors/README.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"842-d4/CNBSJU0YwQIVbERHtnMKV0DA\"",
    "mtime": "2025-01-19T16:22:33.236Z",
    "size": 2114,
    "path": "../public/ext/World/node_modules/es-errors/README.md"
  },
  "/ext/World/node_modules/es-errors/ref.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4f-uG6p5wbkyd9mOdEuX3KKy5sY73I\"",
    "mtime": "2025-01-19T16:22:33.180Z",
    "size": 79,
    "path": "../public/ext/World/node_modules/es-errors/ref.js"
  },
  "/ext/World/node_modules/es-errors/syntax.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4f-Nbw2o5biDxXkLIFyBcolmCCnmYw\"",
    "mtime": "2025-01-19T16:22:33.193Z",
    "size": 79,
    "path": "../public/ext/World/node_modules/es-errors/syntax.js"
  },
  "/ext/World/node_modules/es-errors/tsconfig.json": {
    "type": "application/json",
    "etag": "\"c62-JrnSVFPygzB++xnQ4AXPcE4zaKY\"",
    "mtime": "2025-01-19T16:22:33.222Z",
    "size": 3170,
    "path": "../public/ext/World/node_modules/es-errors/tsconfig.json"
  },
  "/ext/World/node_modules/es-errors/type.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4b-Z+zLFyUppdJNgEyDFt5KiJv92YU\"",
    "mtime": "2025-01-19T16:22:33.199Z",
    "size": 75,
    "path": "../public/ext/World/node_modules/es-errors/type.js"
  },
  "/ext/World/node_modules/es-errors/uri.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"49-AxnHS/021Oc63UQqCgy5xtt46CI\"",
    "mtime": "2025-01-19T16:22:33.208Z",
    "size": 73,
    "path": "../public/ext/World/node_modules/es-errors/uri.js"
  },
  "/ext/World/node_modules/es-object-atoms/.eslintrc": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"e5-GOZWA0h0HbxBE9fQ6ar36X/WFCc\"",
    "mtime": "2025-01-19T16:22:33.014Z",
    "size": 229,
    "path": "../public/ext/World/node_modules/es-object-atoms/.eslintrc"
  },
  "/ext/World/node_modules/es-object-atoms/CHANGELOG.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"858-d7dYO6KLhNH9ny7W589FKCfeBZY\"",
    "mtime": "2025-01-19T16:22:33.208Z",
    "size": 2136,
    "path": "../public/ext/World/node_modules/es-object-atoms/CHANGELOG.md"
  },
  "/ext/World/node_modules/es-object-atoms/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"43-glwul/Tz76EPHJ4TtDOX22LiQH8\"",
    "mtime": "2025-01-19T16:22:33.080Z",
    "size": 67,
    "path": "../public/ext/World/node_modules/es-object-atoms/index.js"
  },
  "/ext/World/node_modules/es-object-atoms/isObject.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"a1-4TR1xgeQagIOR/alZAHL2rnwRoM\"",
    "mtime": "2025-01-19T16:22:33.154Z",
    "size": 161,
    "path": "../public/ext/World/node_modules/es-object-atoms/isObject.js"
  },
  "/ext/World/node_modules/es-object-atoms/LICENSE": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"42f-pHhoq5C1Mt+Cq+Pk9Qe8supEE2Q\"",
    "mtime": "2025-01-19T16:22:33.048Z",
    "size": 1071,
    "path": "../public/ext/World/node_modules/es-object-atoms/LICENSE"
  },
  "/ext/World/node_modules/es-object-atoms/package.json": {
    "type": "application/json",
    "etag": "\"8e1-Yj5RADTPOUQOhpKqJslHN2WYFnQ\"",
    "mtime": "2025-01-19T16:22:33.193Z",
    "size": 2273,
    "path": "../public/ext/World/node_modules/es-object-atoms/package.json"
  },
  "/ext/World/node_modules/es-object-atoms/README.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"a2b-CQuyyNrR/I/ZjVPdOlcdtwUH0e4\"",
    "mtime": "2025-01-19T16:22:33.220Z",
    "size": 2603,
    "path": "../public/ext/World/node_modules/es-object-atoms/README.md"
  },
  "/ext/World/node_modules/es-object-atoms/RequireObjectCoercible.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"139-cI0uEnt3swcTiEM2/plzxtlp+Bc\"",
    "mtime": "2025-01-19T16:22:33.172Z",
    "size": 313,
    "path": "../public/ext/World/node_modules/es-object-atoms/RequireObjectCoercible.js"
  },
  "/ext/World/node_modules/es-object-atoms/ToObject.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"fa-bae3s5YP08C3fHpbMOEVCvKpDoU\"",
    "mtime": "2025-01-19T16:22:33.180Z",
    "size": 250,
    "path": "../public/ext/World/node_modules/es-object-atoms/ToObject.js"
  },
  "/ext/World/node_modules/es-object-atoms/tsconfig.json": {
    "type": "application/json",
    "etag": "\"51-Bw/KrHwmb+qSVOT2NVsly4e8ZuI\"",
    "mtime": "2025-01-19T16:22:33.202Z",
    "size": 81,
    "path": "../public/ext/World/node_modules/es-object-atoms/tsconfig.json"
  },
  "/ext/World/node_modules/escape-html/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"552-37sZx56wyn/yYl+xl1o1z0e+N4o\"",
    "mtime": "2025-01-19T16:22:33.099Z",
    "size": 1362,
    "path": "../public/ext/World/node_modules/escape-html/index.js"
  },
  "/ext/World/node_modules/escape-html/LICENSE": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"485-rfekUsR/+HxI3v831wPxZo8Sdso\"",
    "mtime": "2025-01-19T16:22:33.063Z",
    "size": 1157,
    "path": "../public/ext/World/node_modules/escape-html/LICENSE"
  },
  "/ext/World/node_modules/escape-html/package.json": {
    "type": "application/json",
    "etag": "\"1b2-+dP9ZKAZbneWVInOm4H+TOOp7LE\"",
    "mtime": "2025-01-19T16:22:33.032Z",
    "size": 434,
    "path": "../public/ext/World/node_modules/escape-html/package.json"
  },
  "/ext/World/node_modules/escape-html/Readme.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"2c3-NZI6l9Si+LcS2FoYr6Pap+G3pT4\"",
    "mtime": "2025-01-19T16:22:33.129Z",
    "size": 707,
    "path": "../public/ext/World/node_modules/escape-html/Readme.md"
  },
  "/ext/World/node_modules/etag/HISTORY.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"6c4-klS9mWFPq6Mk15P7msCm34Tlhc8\"",
    "mtime": "2025-01-19T16:22:33.154Z",
    "size": 1732,
    "path": "../public/ext/World/node_modules/etag/HISTORY.md"
  },
  "/ext/World/node_modules/etag/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"9af-aoezyRapueSyApSb41aHHhaCr54\"",
    "mtime": "2025-01-19T16:22:33.129Z",
    "size": 2479,
    "path": "../public/ext/World/node_modules/etag/index.js"
  },
  "/ext/World/node_modules/etag/LICENSE": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"446-sFihOcsjnGWMjx+EGkdaUIGLX3M\"",
    "mtime": "2025-01-19T16:22:33.099Z",
    "size": 1094,
    "path": "../public/ext/World/node_modules/etag/LICENSE"
  },
  "/ext/World/node_modules/etag/package.json": {
    "type": "application/json",
    "etag": "\"51a-4t69XGUwJUq+Fku9RPHki3x8ABg\"",
    "mtime": "2025-01-19T16:22:33.032Z",
    "size": 1306,
    "path": "../public/ext/World/node_modules/etag/package.json"
  },
  "/ext/World/node_modules/etag/README.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"1066-HI1lYYdeDjonZUaxbwWWyaIx4mk\"",
    "mtime": "2025-01-19T16:22:33.063Z",
    "size": 4198,
    "path": "../public/ext/World/node_modules/etag/README.md"
  },
  "/ext/World/node_modules/express/History.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"1c1d1-PAMccGcUigctq0PVpnVd8aEwHZk\"",
    "mtime": "2025-01-19T16:22:33.261Z",
    "size": 115153,
    "path": "../public/ext/World/node_modules/express/History.md"
  },
  "/ext/World/node_modules/express/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"e0-P0FHj9qzGsq6uPodJhJkg6FB/7Y\"",
    "mtime": "2025-01-19T16:22:33.145Z",
    "size": 224,
    "path": "../public/ext/World/node_modules/express/index.js"
  },
  "/ext/World/node_modules/express/LICENSE": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"4e1-BW1FWxvY3gUNkqNbbSC2gDcl8ps\"",
    "mtime": "2025-01-19T16:22:33.032Z",
    "size": 1249,
    "path": "../public/ext/World/node_modules/express/LICENSE"
  },
  "/ext/World/node_modules/express/package.json": {
    "type": "application/json",
    "etag": "\"af6-EwQYGsLzAKOSzzxt8XHnB9VCEHo\"",
    "mtime": "2025-01-19T16:22:33.247Z",
    "size": 2806,
    "path": "../public/ext/World/node_modules/express/package.json"
  },
  "/ext/World/node_modules/express/Readme.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"264e-6GyqbFrqRCF5+skDpdvuvqnd8pk\"",
    "mtime": "2025-01-19T16:22:33.269Z",
    "size": 9806,
    "path": "../public/ext/World/node_modules/express/Readme.md"
  },
  "/ext/World/node_modules/finalhandler/HISTORY.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"11c5-yJioOlvG0sPB7mT7aoGCGnLcfZc\"",
    "mtime": "2025-01-19T16:22:33.137Z",
    "size": 4549,
    "path": "../public/ext/World/node_modules/finalhandler/HISTORY.md"
  },
  "/ext/World/node_modules/finalhandler/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1a70-9ev/fPGuprRBC9c7UstnaQMU/Gs\"",
    "mtime": "2025-01-19T16:22:33.054Z",
    "size": 6768,
    "path": "../public/ext/World/node_modules/finalhandler/index.js"
  },
  "/ext/World/node_modules/finalhandler/LICENSE": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"45f-0HwxLGa+S92rpifoc7ngxey6fNQ\"",
    "mtime": "2025-01-19T16:22:33.029Z",
    "size": 1119,
    "path": "../public/ext/World/node_modules/finalhandler/LICENSE"
  },
  "/ext/World/node_modules/finalhandler/package.json": {
    "type": "application/json",
    "etag": "\"4fc-A8C1DscvDQX9bGd7yF5tgm10PUk\"",
    "mtime": "2025-01-19T16:22:33.095Z",
    "size": 1276,
    "path": "../public/ext/World/node_modules/finalhandler/package.json"
  },
  "/ext/World/node_modules/finalhandler/README.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"1018-BuAXSSLsTyhhBPW2Z4we2iwXlD0\"",
    "mtime": "2025-01-19T16:22:33.154Z",
    "size": 4120,
    "path": "../public/ext/World/node_modules/finalhandler/README.md"
  },
  "/ext/World/node_modules/finalhandler/SECURITY.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"4b2-O302xVrJHs3dFM67D46xWLRD13Y\"",
    "mtime": "2025-01-19T16:22:33.172Z",
    "size": 1202,
    "path": "../public/ext/World/node_modules/finalhandler/SECURITY.md"
  },
  "/ext/World/node_modules/forwarded/HISTORY.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"190-vQ7+ZprVBqsli7Rh0URNdN0ojOU\"",
    "mtime": "2025-01-19T16:22:33.121Z",
    "size": 400,
    "path": "../public/ext/World/node_modules/forwarded/HISTORY.md"
  },
  "/ext/World/node_modules/forwarded/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"62a-VbowE9JegnPQbsgxhHRR0Vsz/yk\"",
    "mtime": "2025-01-19T16:22:33.048Z",
    "size": 1578,
    "path": "../public/ext/World/node_modules/forwarded/index.js"
  },
  "/ext/World/node_modules/forwarded/LICENSE": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"446-SIGtLsjrJHCnBJQhBHxtB29I8d4\"",
    "mtime": "2025-01-19T16:22:33.023Z",
    "size": 1094,
    "path": "../public/ext/World/node_modules/forwarded/LICENSE"
  },
  "/ext/World/node_modules/forwarded/package.json": {
    "type": "application/json",
    "etag": "\"47e-XVWMrVICTUE3OuAwwNf/Z+jf1/4\"",
    "mtime": "2025-01-19T16:22:33.088Z",
    "size": 1150,
    "path": "../public/ext/World/node_modules/forwarded/package.json"
  },
  "/ext/World/node_modules/forwarded/README.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"676-GXC08tDda871BN8riKVb6j+7Ra8\"",
    "mtime": "2025-01-19T16:22:33.145Z",
    "size": 1654,
    "path": "../public/ext/World/node_modules/forwarded/README.md"
  },
  "/ext/World/node_modules/fresh/HISTORY.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"5dc-DEYyZ6fS8V7eHKy9XjJiAqEjII8\"",
    "mtime": "2025-01-19T16:22:33.154Z",
    "size": 1500,
    "path": "../public/ext/World/node_modules/fresh/HISTORY.md"
  },
  "/ext/World/node_modules/fresh/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"a97-z8BwQjC10Iw5+YR/fh6Ag2m0EQ4\"",
    "mtime": "2025-01-19T16:22:33.129Z",
    "size": 2711,
    "path": "../public/ext/World/node_modules/fresh/index.js"
  },
  "/ext/World/node_modules/fresh/LICENSE": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"496-1FI16NnR1lZCCnYKZ26nFSOGlp8\"",
    "mtime": "2025-01-19T16:22:33.095Z",
    "size": 1174,
    "path": "../public/ext/World/node_modules/fresh/LICENSE"
  },
  "/ext/World/node_modules/fresh/package.json": {
    "type": "application/json",
    "etag": "\"54d-bZD3ZYJ5GEBmxe55DPo93mkhlRs\"",
    "mtime": "2025-01-19T16:22:33.030Z",
    "size": 1357,
    "path": "../public/ext/World/node_modules/fresh/package.json"
  },
  "/ext/World/node_modules/fresh/README.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"d2e-2aRFlK+eAFd79ttXA42r1s7tWKc\"",
    "mtime": "2025-01-19T16:22:33.063Z",
    "size": 3374,
    "path": "../public/ext/World/node_modules/fresh/README.md"
  },
  "/ext/World/node_modules/function-bind/.eslintrc": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"fd-Is5Uy31PxztsO73mHb7KJr+aZqo\"",
    "mtime": "2025-01-19T16:22:33.014Z",
    "size": 253,
    "path": "../public/ext/World/node_modules/function-bind/.eslintrc"
  },
  "/ext/World/node_modules/function-bind/.nycrc": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"d8-lUYhcmmRh6wC6uxgdAJLJubXHP8\"",
    "mtime": "2025-01-19T16:22:33.102Z",
    "size": 216,
    "path": "../public/ext/World/node_modules/function-bind/.nycrc"
  },
  "/ext/World/node_modules/function-bind/CHANGELOG.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"35f4-d04mQf6B1Nh/5hUPqAudcDRSREg\"",
    "mtime": "2025-01-19T16:22:33.208Z",
    "size": 13812,
    "path": "../public/ext/World/node_modules/function-bind/CHANGELOG.md"
  },
  "/ext/World/node_modules/function-bind/implementation.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"7fb-QjIRNqEIiC41NSD/80Efv8t5i1s\"",
    "mtime": "2025-01-19T16:22:33.154Z",
    "size": 2043,
    "path": "../public/ext/World/node_modules/function-bind/implementation.js"
  },
  "/ext/World/node_modules/function-bind/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"7e-92G8EBvzFeYST3N9FpGqp35QclM\"",
    "mtime": "2025-01-19T16:22:33.171Z",
    "size": 126,
    "path": "../public/ext/World/node_modules/function-bind/index.js"
  },
  "/ext/World/node_modules/function-bind/LICENSE": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"41c-KQM289qG9fmpGiMbBYxViKqp9gY\"",
    "mtime": "2025-01-19T16:22:33.129Z",
    "size": 1052,
    "path": "../public/ext/World/node_modules/function-bind/LICENSE"
  },
  "/ext/World/node_modules/function-bind/package.json": {
    "type": "application/json",
    "etag": "\"8d6-H9zZLGrTPPqxxVZQQZjimjh1mnw\"",
    "mtime": "2025-01-19T16:22:33.195Z",
    "size": 2262,
    "path": "../public/ext/World/node_modules/function-bind/package.json"
  },
  "/ext/World/node_modules/function-bind/README.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"6db-qNtMLzh8Qut1MBH0jFxGJtjoJjU\"",
    "mtime": "2025-01-19T16:22:33.215Z",
    "size": 1755,
    "path": "../public/ext/World/node_modules/function-bind/README.md"
  },
  "/ext/World/node_modules/get-intrinsic/.eslintrc": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"25b-T6xC9zz39btVGQ7HqGNp/z4Ufx4\"",
    "mtime": "2025-01-19T16:22:33.014Z",
    "size": 603,
    "path": "../public/ext/World/node_modules/get-intrinsic/.eslintrc"
  },
  "/ext/World/node_modules/get-intrinsic/.nycrc": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"8b-VPnXrfiUPLB/ghQ1uyaetLpAzMI\"",
    "mtime": "2025-01-19T16:22:33.048Z",
    "size": 139,
    "path": "../public/ext/World/node_modules/get-intrinsic/.nycrc"
  },
  "/ext/World/node_modules/get-intrinsic/CHANGELOG.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"3a5f-D4bv4l4PX9Z7rMSM3DaufcmOvbk\"",
    "mtime": "2025-01-19T16:22:33.186Z",
    "size": 14943,
    "path": "../public/ext/World/node_modules/get-intrinsic/CHANGELOG.md"
  },
  "/ext/World/node_modules/get-intrinsic/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3814-UwPdqOn0qsnlJOU4s9eISZo0gxA\"",
    "mtime": "2025-01-19T16:22:33.162Z",
    "size": 14356,
    "path": "../public/ext/World/node_modules/get-intrinsic/index.js"
  },
  "/ext/World/node_modules/get-intrinsic/LICENSE": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"42f-cIepJXfIaAYzijY6iKmjtPdi4m0\"",
    "mtime": "2025-01-19T16:22:33.080Z",
    "size": 1071,
    "path": "../public/ext/World/node_modules/get-intrinsic/LICENSE"
  },
  "/ext/World/node_modules/get-intrinsic/package.json": {
    "type": "application/json",
    "etag": "\"a10-Ia2k208PDvbiB9pKkh/2QZZhbWA\"",
    "mtime": "2025-01-19T16:22:33.177Z",
    "size": 2576,
    "path": "../public/ext/World/node_modules/get-intrinsic/package.json"
  },
  "/ext/World/node_modules/get-intrinsic/README.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"ae7-HT0doQdCmeWOJkkEsSuwcxjIVrw\"",
    "mtime": "2025-01-19T16:22:33.195Z",
    "size": 2791,
    "path": "../public/ext/World/node_modules/get-intrinsic/README.md"
  },
  "/ext/World/node_modules/get-proto/.eslintrc": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"68-F563vcpzikmNcVvbjpWOuGv9i98\"",
    "mtime": "2025-01-19T16:22:33.014Z",
    "size": 104,
    "path": "../public/ext/World/node_modules/get-proto/.eslintrc"
  },
  "/ext/World/node_modules/get-proto/.nycrc": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"8b-VPnXrfiUPLB/ghQ1uyaetLpAzMI\"",
    "mtime": "2025-01-19T16:22:33.048Z",
    "size": 139,
    "path": "../public/ext/World/node_modules/get-proto/.nycrc"
  },
  "/ext/World/node_modules/get-proto/CHANGELOG.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"41e-D3OJkJyH8SGGKERbI7HfwsZ/R7E\"",
    "mtime": "2025-01-19T16:22:33.211Z",
    "size": 1054,
    "path": "../public/ext/World/node_modules/get-proto/CHANGELOG.md"
  },
  "/ext/World/node_modules/get-proto/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"335-BZHVX9VbELCI/Z81pz/jxNAak40\"",
    "mtime": "2025-01-19T16:22:33.121Z",
    "size": 821,
    "path": "../public/ext/World/node_modules/get-proto/index.js"
  },
  "/ext/World/node_modules/get-proto/LICENSE": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"42f-fQxRmdFoen5TLzmhevlB5FtnZLw\"",
    "mtime": "2025-01-19T16:22:33.080Z",
    "size": 1071,
    "path": "../public/ext/World/node_modules/get-proto/LICENSE"
  },
  "/ext/World/node_modules/get-proto/Object.getPrototypeOf.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"9c-9S6qCLDw8FGo3w1m5jF+GCuX7+g\"",
    "mtime": "2025-01-19T16:22:33.170Z",
    "size": 156,
    "path": "../public/ext/World/node_modules/get-proto/Object.getPrototypeOf.js"
  },
  "/ext/World/node_modules/get-proto/package.json": {
    "type": "application/json",
    "etag": "\"880-bb2MX1mLQrlEWnlYxXSRIuCRWNQ\"",
    "mtime": "2025-01-19T16:22:33.192Z",
    "size": 2176,
    "path": "../public/ext/World/node_modules/get-proto/package.json"
  },
  "/ext/World/node_modules/get-proto/README.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"702-cn08WFHKvPwdOXKRo84dbb8KF4A\"",
    "mtime": "2025-01-19T16:22:33.220Z",
    "size": 1794,
    "path": "../public/ext/World/node_modules/get-proto/README.md"
  },
  "/ext/World/node_modules/get-proto/Reflect.getPrototypeOf.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"96-6HYt0Wyrju3ykNxc/Zn55lqZevA\"",
    "mtime": "2025-01-19T16:22:33.180Z",
    "size": 150,
    "path": "../public/ext/World/node_modules/get-proto/Reflect.getPrototypeOf.js"
  },
  "/ext/World/node_modules/get-proto/tsconfig.json": {
    "type": "application/json",
    "etag": "\"76-GJWQZmbh3FZw5QPl8QcnbBSxBSs\"",
    "mtime": "2025-01-19T16:22:33.199Z",
    "size": 118,
    "path": "../public/ext/World/node_modules/get-proto/tsconfig.json"
  },
  "/ext/World/node_modules/gopd/.eslintrc": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"e0-nKKmbWK9aHw9GMUSF7/jcoAlbsE\"",
    "mtime": "2025-01-19T16:22:33.014Z",
    "size": 224,
    "path": "../public/ext/World/node_modules/gopd/.eslintrc"
  },
  "/ext/World/node_modules/gopd/CHANGELOG.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"c05-imURpURMpE3K78rNsqjGqE9cFj4\"",
    "mtime": "2025-01-19T16:22:33.192Z",
    "size": 3077,
    "path": "../public/ext/World/node_modules/gopd/CHANGELOG.md"
  },
  "/ext/World/node_modules/gopd/gOPD.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"61-0a2w9TB40e9iOioZeJ9TrZ3cRuE\"",
    "mtime": "2025-01-19T16:22:33.080Z",
    "size": 97,
    "path": "../public/ext/World/node_modules/gopd/gOPD.js"
  },
  "/ext/World/node_modules/gopd/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"ce-Z758E/Ob73AB9sfKo22LCXGR89w\"",
    "mtime": "2025-01-19T16:22:33.121Z",
    "size": 206,
    "path": "../public/ext/World/node_modules/gopd/index.js"
  },
  "/ext/World/node_modules/gopd/LICENSE": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"42f-t5srUcvkLsZVJ3Q1uGPvm6hAhA0\"",
    "mtime": "2025-01-19T16:22:33.048Z",
    "size": 1071,
    "path": "../public/ext/World/node_modules/gopd/LICENSE"
  },
  "/ext/World/node_modules/gopd/package.json": {
    "type": "application/json",
    "etag": "\"816-aCtLd70EFQFUakhSmNZisaVN5wI\"",
    "mtime": "2025-01-19T16:22:33.170Z",
    "size": 2070,
    "path": "../public/ext/World/node_modules/gopd/package.json"
  },
  "/ext/World/node_modules/gopd/README.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"61a-ToedbCLjtUQRms5ILMIS2drCQHU\"",
    "mtime": "2025-01-19T16:22:33.202Z",
    "size": 1562,
    "path": "../public/ext/World/node_modules/gopd/README.md"
  },
  "/ext/World/node_modules/gopd/tsconfig.json": {
    "type": "application/json",
    "etag": "\"74-oWRyQk+MJhhN5Vfv+NaCSTnR/I4\"",
    "mtime": "2025-01-19T16:22:33.180Z",
    "size": 116,
    "path": "../public/ext/World/node_modules/gopd/tsconfig.json"
  },
  "/ext/World/node_modules/has-symbols/.eslintrc": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"a4-93vVVW9iOpk6Z8Rj3r3AxpF4v8s\"",
    "mtime": "2025-01-19T16:22:33.014Z",
    "size": 164,
    "path": "../public/ext/World/node_modules/has-symbols/.eslintrc"
  },
  "/ext/World/node_modules/has-symbols/.nycrc": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"8b-VPnXrfiUPLB/ghQ1uyaetLpAzMI\"",
    "mtime": "2025-01-19T16:22:33.047Z",
    "size": 139,
    "path": "../public/ext/World/node_modules/has-symbols/.nycrc"
  },
  "/ext/World/node_modules/has-symbols/CHANGELOG.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"24d7-dmYWsJ6XJqDZsWQnUP7tuADVWps\"",
    "mtime": "2025-01-19T16:22:33.229Z",
    "size": 9431,
    "path": "../public/ext/World/node_modules/has-symbols/CHANGELOG.md"
  },
  "/ext/World/node_modules/has-symbols/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1bf-m0l5L3+XMPb2s3z7MZF/aErfhkU\"",
    "mtime": "2025-01-19T16:22:33.172Z",
    "size": 447,
    "path": "../public/ext/World/node_modules/has-symbols/index.js"
  },
  "/ext/World/node_modules/has-symbols/LICENSE": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"42f-/5fZBsGToQZtGFPZ5O9FgoHIZy0\"",
    "mtime": "2025-01-19T16:22:33.080Z",
    "size": 1071,
    "path": "../public/ext/World/node_modules/has-symbols/LICENSE"
  },
  "/ext/World/node_modules/has-symbols/package.json": {
    "type": "application/json",
    "etag": "\"b9e-jkmlZUY+niPZwy2MzBgAkyGvGb8\"",
    "mtime": "2025-01-19T16:22:33.218Z",
    "size": 2974,
    "path": "../public/ext/World/node_modules/has-symbols/package.json"
  },
  "/ext/World/node_modules/has-symbols/README.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"7fc-8jfRXnnD+AFRk8pNRqLO72Me6bw\"",
    "mtime": "2025-01-19T16:22:33.236Z",
    "size": 2044,
    "path": "../public/ext/World/node_modules/has-symbols/README.md"
  },
  "/ext/World/node_modules/has-symbols/shams.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"782-gPsQJSG4nnXGMNuhf0XqRCznnOo\"",
    "mtime": "2025-01-19T16:22:33.199Z",
    "size": 1922,
    "path": "../public/ext/World/node_modules/has-symbols/shams.js"
  },
  "/ext/World/node_modules/has-symbols/tsconfig.json": {
    "type": "application/json",
    "etag": "\"8f-75nqUvINySwRIHEbZi3Y+aVndLk\"",
    "mtime": "2025-01-19T16:22:33.222Z",
    "size": 143,
    "path": "../public/ext/World/node_modules/has-symbols/tsconfig.json"
  },
  "/ext/World/node_modules/hasown/.eslintrc": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"2b-r3nIG9YcmpN/yhhCXdhM34MXyLk\"",
    "mtime": "2025-01-19T16:22:33.014Z",
    "size": 43,
    "path": "../public/ext/World/node_modules/hasown/.eslintrc"
  },
  "/ext/World/node_modules/hasown/.nycrc": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"d8-lUYhcmmRh6wC6uxgdAJLJubXHP8\"",
    "mtime": "2025-01-19T16:22:33.048Z",
    "size": 216,
    "path": "../public/ext/World/node_modules/hasown/.nycrc"
  },
  "/ext/World/node_modules/hasown/CHANGELOG.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"a13-NDOM6hGgGf/V+Gc5rfnMJ1sxB3U\"",
    "mtime": "2025-01-19T16:22:33.178Z",
    "size": 2579,
    "path": "../public/ext/World/node_modules/hasown/CHANGELOG.md"
  },
  "/ext/World/node_modules/hasown/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"ce-ZohX96fzag97gMi2mStUOBnOOoI\"",
    "mtime": "2025-01-19T16:22:33.121Z",
    "size": 206,
    "path": "../public/ext/World/node_modules/hasown/index.js"
  },
  "/ext/World/node_modules/hasown/LICENSE": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"43b-rL/5e1KoB6NmEkcyjcRd9jbXuPc\"",
    "mtime": "2025-01-19T16:22:33.080Z",
    "size": 1083,
    "path": "../public/ext/World/node_modules/hasown/LICENSE"
  },
  "/ext/World/node_modules/hasown/package.json": {
    "type": "application/json",
    "etag": "\"8eb-Kquelk4Z7fNAyOiXjZvX6s1r/E4\"",
    "mtime": "2025-01-19T16:22:33.145Z",
    "size": 2283,
    "path": "../public/ext/World/node_modules/hasown/package.json"
  },
  "/ext/World/node_modules/hasown/README.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"64d-NBBposyrYZQYjFYMwBZI6bVQu2k\"",
    "mtime": "2025-01-19T16:22:33.188Z",
    "size": 1613,
    "path": "../public/ext/World/node_modules/hasown/README.md"
  },
  "/ext/World/node_modules/hasown/tsconfig.json": {
    "type": "application/json",
    "etag": "\"49-xQtrcSybY5PIt+DfjWabDeOEpvg\"",
    "mtime": "2025-01-19T16:22:33.163Z",
    "size": 73,
    "path": "../public/ext/World/node_modules/hasown/tsconfig.json"
  },
  "/ext/World/node_modules/http-errors/HISTORY.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"f85-IHWJWI7cGezHes28oAXH9Nu1pE4\"",
    "mtime": "2025-01-19T16:22:33.129Z",
    "size": 3973,
    "path": "../public/ext/World/node_modules/http-errors/HISTORY.md"
  },
  "/ext/World/node_modules/http-errors/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"18f7-uPYKhgRDsFpi62xOwcMA8ZRYhvE\"",
    "mtime": "2025-01-19T16:22:33.063Z",
    "size": 6391,
    "path": "../public/ext/World/node_modules/http-errors/index.js"
  },
  "/ext/World/node_modules/http-errors/LICENSE": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"490-IK1FvSnss8xvOKCKJ+sJx7dKH20\"",
    "mtime": "2025-01-19T16:22:33.031Z",
    "size": 1168,
    "path": "../public/ext/World/node_modules/http-errors/LICENSE"
  },
  "/ext/World/node_modules/http-errors/package.json": {
    "type": "application/json",
    "etag": "\"522-vLF2hSX39eGvdcJyhnv+1m3Zg8c\"",
    "mtime": "2025-01-19T16:22:33.099Z",
    "size": 1314,
    "path": "../public/ext/World/node_modules/http-errors/package.json"
  },
  "/ext/World/node_modules/http-errors/README.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"174a-NfjUD7JOgitc+8gp5aP6Dl+Qrjw\"",
    "mtime": "2025-01-19T16:22:33.154Z",
    "size": 5962,
    "path": "../public/ext/World/node_modules/http-errors/README.md"
  },
  "/ext/World/node_modules/iconv-lite/Changelog.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"10f6-27KM67isXBRy0D3zf5N8ysYQvMM\"",
    "mtime": "2025-01-19T16:22:33.054Z",
    "size": 4342,
    "path": "../public/ext/World/node_modules/iconv-lite/Changelog.md"
  },
  "/ext/World/node_modules/iconv-lite/LICENSE": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"428-Tzykmnk/a7hGWjcx/ZZaEodXuM4\"",
    "mtime": "2025-01-19T16:22:33.088Z",
    "size": 1064,
    "path": "../public/ext/World/node_modules/iconv-lite/LICENSE"
  },
  "/ext/World/node_modules/iconv-lite/package.json": {
    "type": "application/json",
    "etag": "\"4cb-oedu22Qo5ENF7ThR/3r12FBDTPU\"",
    "mtime": "2025-01-19T16:22:33.026Z",
    "size": 1227,
    "path": "../public/ext/World/node_modules/iconv-lite/package.json"
  },
  "/ext/World/node_modules/iconv-lite/README.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"1986-gGm8F73S+oduMEuus3uoKlBGq8g\"",
    "mtime": "2025-01-19T16:22:33.129Z",
    "size": 6534,
    "path": "../public/ext/World/node_modules/iconv-lite/README.md"
  },
  "/ext/World/node_modules/inherits/inherits.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"fa-Ii2iiKB9j2Wyrtm4iBWUjP4LQtk\"",
    "mtime": "2025-01-19T16:22:33.088Z",
    "size": 250,
    "path": "../public/ext/World/node_modules/inherits/inherits.js"
  },
  "/ext/World/node_modules/inherits/inherits_browser.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2f1-cPz3H0SROey/el1seOzgabvfTcM\"",
    "mtime": "2025-01-19T16:22:33.048Z",
    "size": 753,
    "path": "../public/ext/World/node_modules/inherits/inherits_browser.js"
  },
  "/ext/World/node_modules/inherits/LICENSE": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"2ed-Ow6NWKNisXh+81BPuk9ZOyLzzuQ\"",
    "mtime": "2025-01-19T16:22:33.121Z",
    "size": 749,
    "path": "../public/ext/World/node_modules/inherits/LICENSE"
  },
  "/ext/World/node_modules/inherits/package.json": {
    "type": "application/json",
    "etag": "\"245-YrEd1zagBH+9jS3AQG0hGKVJo1k\"",
    "mtime": "2025-01-19T16:22:33.023Z",
    "size": 581,
    "path": "../public/ext/World/node_modules/inherits/package.json"
  },
  "/ext/World/node_modules/inherits/README.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"659-8vjSbxz1+x46aKoiUiGwZPmZ/vs\"",
    "mtime": "2025-01-19T16:22:33.145Z",
    "size": 1625,
    "path": "../public/ext/World/node_modules/inherits/README.md"
  },
  "/ext/World/node_modules/ipaddr.js/ipaddr.min.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"260a-mrsn8xpq912P7ca5eg/63IcjjOY\"",
    "mtime": "2025-01-19T16:22:33.048Z",
    "size": 9738,
    "path": "../public/ext/World/node_modules/ipaddr.js/ipaddr.min.js"
  },
  "/ext/World/node_modules/ipaddr.js/LICENSE": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"43f-jFa5mNYBYWWwo5nSc2vpjvKtHGI\"",
    "mtime": "2025-01-19T16:22:33.088Z",
    "size": 1087,
    "path": "../public/ext/World/node_modules/ipaddr.js/LICENSE"
  },
  "/ext/World/node_modules/ipaddr.js/package.json": {
    "type": "application/json",
    "etag": "\"2cf-UyvgRM5Xqfgf7TXzdCdn9YfPvJU\"",
    "mtime": "2025-01-19T16:22:33.022Z",
    "size": 719,
    "path": "../public/ext/World/node_modules/ipaddr.js/package.json"
  },
  "/ext/World/node_modules/ipaddr.js/README.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"2075-4VU/DSZYH0MSAIpJtA740LDkaX4\"",
    "mtime": "2025-01-19T16:22:33.129Z",
    "size": 8309,
    "path": "../public/ext/World/node_modules/ipaddr.js/README.md"
  },
  "/ext/World/node_modules/math-intrinsics/.eslintrc": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"e5-GOZWA0h0HbxBE9fQ6ar36X/WFCc\"",
    "mtime": "2025-01-19T16:22:33.014Z",
    "size": 229,
    "path": "../public/ext/World/node_modules/math-intrinsics/.eslintrc"
  },
  "/ext/World/node_modules/math-intrinsics/abs.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"49-x8svRNA3qcDt4YfNgqGQfOX1WjI\"",
    "mtime": "2025-01-19T16:22:33.080Z",
    "size": 73,
    "path": "../public/ext/World/node_modules/math-intrinsics/abs.js"
  },
  "/ext/World/node_modules/math-intrinsics/CHANGELOG.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"5ba-zuh+H8SCi0ToWEkZAsmcwTMpwBA\"",
    "mtime": "2025-01-19T16:22:33.261Z",
    "size": 1466,
    "path": "../public/ext/World/node_modules/math-intrinsics/CHANGELOG.md"
  },
  "/ext/World/node_modules/math-intrinsics/floor.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4d-NjaWkOg8g6ITST/E5u4v+8ndD9s\"",
    "mtime": "2025-01-19T16:22:33.121Z",
    "size": 77,
    "path": "../public/ext/World/node_modules/math-intrinsics/floor.js"
  },
  "/ext/World/node_modules/math-intrinsics/isFinite.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"106-tKPjzUXRZpML8CjMP8lRShCRiYQ\"",
    "mtime": "2025-01-19T16:22:33.170Z",
    "size": 262,
    "path": "../public/ext/World/node_modules/math-intrinsics/isFinite.js"
  },
  "/ext/World/node_modules/math-intrinsics/isInteger.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"19a-V4Ii/C5nq/mt25RsP/mvr23HVKY\"",
    "mtime": "2025-01-19T16:22:33.180Z",
    "size": 410,
    "path": "../public/ext/World/node_modules/math-intrinsics/isInteger.js"
  },
  "/ext/World/node_modules/math-intrinsics/isNaN.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"79-5DUQmo1mG3jJG2pUpjXbWZWGHM8\"",
    "mtime": "2025-01-19T16:22:33.191Z",
    "size": 121,
    "path": "../public/ext/World/node_modules/math-intrinsics/isNaN.js"
  },
  "/ext/World/node_modules/math-intrinsics/isNegativeZero.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"8f-kdz6j/ecIpVdcq3gXOvcnQM+z0g\"",
    "mtime": "2025-01-19T16:22:33.199Z",
    "size": 143,
    "path": "../public/ext/World/node_modules/math-intrinsics/isNegativeZero.js"
  },
  "/ext/World/node_modules/math-intrinsics/LICENSE": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"431-4xos4SUGZLoCxbDlI2AKzEMwrCQ\"",
    "mtime": "2025-01-19T16:22:33.048Z",
    "size": 1073,
    "path": "../public/ext/World/node_modules/math-intrinsics/LICENSE"
  },
  "/ext/World/node_modules/math-intrinsics/max.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"49-Eu/OTiu3zpuoFXw88VzW9oSwcR0\"",
    "mtime": "2025-01-19T16:22:33.208Z",
    "size": 73,
    "path": "../public/ext/World/node_modules/math-intrinsics/max.js"
  },
  "/ext/World/node_modules/math-intrinsics/min.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"49-M7wkqLvkoMXkedd2uY8uXbbrP8U\"",
    "mtime": "2025-01-19T16:22:33.236Z",
    "size": 73,
    "path": "../public/ext/World/node_modules/math-intrinsics/min.js"
  },
  "/ext/World/node_modules/math-intrinsics/mod.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"da-M36ISIjODkxWRLL2KYkRYQUBQaU\"",
    "mtime": "2025-01-19T16:22:33.238Z",
    "size": 218,
    "path": "../public/ext/World/node_modules/math-intrinsics/mod.js"
  },
  "/ext/World/node_modules/math-intrinsics/package.json": {
    "type": "application/json",
    "etag": "\"a6e-AXsplsUKSfBz914suSthudQli84\"",
    "mtime": "2025-01-19T16:22:33.261Z",
    "size": 2670,
    "path": "../public/ext/World/node_modules/math-intrinsics/package.json"
  },
  "/ext/World/node_modules/math-intrinsics/pow.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"49-wEsSlO/rZIfR4Z7P0YsSsN2pM9M\"",
    "mtime": "2025-01-19T16:22:33.247Z",
    "size": 73,
    "path": "../public/ext/World/node_modules/math-intrinsics/pow.js"
  },
  "/ext/World/node_modules/math-intrinsics/README.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"75c-P0N0bsuqRsJg9EjxG3ml84YJnIA\"",
    "mtime": "2025-01-19T16:22:33.269Z",
    "size": 1884,
    "path": "../public/ext/World/node_modules/math-intrinsics/README.md"
  },
  "/ext/World/node_modules/math-intrinsics/round.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4d-yR7PjMKSYMnVRc65SBh+Xep0R0I\"",
    "mtime": "2025-01-19T16:22:33.247Z",
    "size": 77,
    "path": "../public/ext/World/node_modules/math-intrinsics/round.js"
  },
  "/ext/World/node_modules/math-intrinsics/sign.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"d6-SMqT95azgtVGMiJziNE7waeHjFg\"",
    "mtime": "2025-01-19T16:22:33.254Z",
    "size": 214,
    "path": "../public/ext/World/node_modules/math-intrinsics/sign.js"
  },
  "/ext/World/node_modules/math-intrinsics/tsconfig.json": {
    "type": "application/json",
    "etag": "\"24-fh2LCLrFcEeP/xGtxd5TD6SlW2E\"",
    "mtime": "2025-01-19T16:22:33.261Z",
    "size": 36,
    "path": "../public/ext/World/node_modules/math-intrinsics/tsconfig.json"
  },
  "/ext/World/node_modules/media-typer/HISTORY.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"1cd-WRIlL4PNo+KldB8s0lk++pXsXdA\"",
    "mtime": "2025-01-19T16:22:33.145Z",
    "size": 461,
    "path": "../public/ext/World/node_modules/media-typer/HISTORY.md"
  },
  "/ext/World/node_modules/media-typer/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"18e7-zHmAfoWFwJ+xlf+4yje7wE3CZwg\"",
    "mtime": "2025-01-19T16:22:33.121Z",
    "size": 6375,
    "path": "../public/ext/World/node_modules/media-typer/index.js"
  },
  "/ext/World/node_modules/media-typer/LICENSE": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"441-bqu/BAWAmh/MrLGwjOXPNK2X6YA\"",
    "mtime": "2025-01-19T16:22:33.080Z",
    "size": 1089,
    "path": "../public/ext/World/node_modules/media-typer/LICENSE"
  },
  "/ext/World/node_modules/media-typer/package.json": {
    "type": "application/json",
    "etag": "\"2f7-hmyeoooWe2gA2mfNvhjMnw7Fy6s\"",
    "mtime": "2025-01-19T16:22:33.014Z",
    "size": 759,
    "path": "../public/ext/World/node_modules/media-typer/package.json"
  },
  "/ext/World/node_modules/media-typer/README.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"943-eJmhsLFoo2oJM9ke2cPjmXUajZw\"",
    "mtime": "2025-01-19T16:22:33.048Z",
    "size": 2371,
    "path": "../public/ext/World/node_modules/media-typer/README.md"
  },
  "/ext/World/node_modules/merge-descriptors/HISTORY.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"16b-HP1f7A3HV6kuOoV7GV+TExZVe6c\"",
    "mtime": "2025-01-19T16:22:33.129Z",
    "size": 363,
    "path": "../public/ext/World/node_modules/merge-descriptors/HISTORY.md"
  },
  "/ext/World/node_modules/merge-descriptors/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4c2-uuZvy3OjH81vJ0wGR0osEiblFUE\"",
    "mtime": "2025-01-19T16:22:33.063Z",
    "size": 1218,
    "path": "../public/ext/World/node_modules/merge-descriptors/index.js"
  },
  "/ext/World/node_modules/merge-descriptors/LICENSE": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"48f-M49WoJRTx50eUnnE50yRzmePXc8\"",
    "mtime": "2025-01-19T16:22:33.030Z",
    "size": 1167,
    "path": "../public/ext/World/node_modules/merge-descriptors/LICENSE"
  },
  "/ext/World/node_modules/merge-descriptors/package.json": {
    "type": "application/json",
    "etag": "\"404-05PJHF18UpGVbEhXFiWxPN3SiZA\"",
    "mtime": "2025-01-19T16:22:33.099Z",
    "size": 1028,
    "path": "../public/ext/World/node_modules/merge-descriptors/package.json"
  },
  "/ext/World/node_modules/merge-descriptors/README.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"519-uVSiQ2KHNEqRfXfizFDXuuvPYzA\"",
    "mtime": "2025-01-19T16:22:33.154Z",
    "size": 1305,
    "path": "../public/ext/World/node_modules/merge-descriptors/README.md"
  },
  "/ext/World/node_modules/methods/HISTORY.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"1ab-ptJdW1XGBcZsoWUsYb7ASUUF+i8\"",
    "mtime": "2025-01-19T16:22:33.153Z",
    "size": 427,
    "path": "../public/ext/World/node_modules/methods/HISTORY.md"
  },
  "/ext/World/node_modules/methods/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"410-gutVJF9RDmy8WA9c7R3J1k1mTSo\"",
    "mtime": "2025-01-19T16:22:33.129Z",
    "size": 1040,
    "path": "../public/ext/World/node_modules/methods/index.js"
  },
  "/ext/World/node_modules/methods/LICENSE": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"49c-xXYdYopT9Z6/utyk7/cVAIPT69Y\"",
    "mtime": "2025-01-19T16:22:33.095Z",
    "size": 1180,
    "path": "../public/ext/World/node_modules/methods/LICENSE"
  },
  "/ext/World/node_modules/methods/package.json": {
    "type": "application/json",
    "etag": "\"3b3-k/q3uHSvpCMphqLKuafpALXq7lo\"",
    "mtime": "2025-01-19T16:22:33.029Z",
    "size": 947,
    "path": "../public/ext/World/node_modules/methods/package.json"
  },
  "/ext/World/node_modules/methods/README.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"69e-QUjAgHeBJpCus5nQsGPfR7supnQ\"",
    "mtime": "2025-01-19T16:22:33.063Z",
    "size": 1694,
    "path": "../public/ext/World/node_modules/methods/README.md"
  },
  "/ext/World/node_modules/mime/.npmignore": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"0-2jmj7l5rSw0yVb/vlWAYkK/YBwk\"",
    "mtime": "2025-01-19T16:22:33.040Z",
    "size": 0,
    "path": "../public/ext/World/node_modules/mime/.npmignore"
  },
  "/ext/World/node_modules/mime/CHANGELOG.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"2501-+xiUBo/xpADdZP1eW1AG11YddTQ\"",
    "mtime": "2025-01-19T16:22:33.180Z",
    "size": 9473,
    "path": "../public/ext/World/node_modules/mime/CHANGELOG.md"
  },
  "/ext/World/node_modules/mime/cli.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"95-TV8BsS/j/BjgbYcc4A0CZGQyAPo\"",
    "mtime": "2025-01-19T16:22:33.163Z",
    "size": 149,
    "path": "../public/ext/World/node_modules/mime/cli.js"
  },
  "/ext/World/node_modules/mime/LICENSE": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"44a-LoSFP7XycRkBtuy0oLj+TUGTSP0\"",
    "mtime": "2025-01-19T16:22:33.116Z",
    "size": 1098,
    "path": "../public/ext/World/node_modules/mime/LICENSE"
  },
  "/ext/World/node_modules/mime/mime.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"aa6-88z/W6J68LnTnMXC8ij1rj4nbRM\"",
    "mtime": "2025-01-19T16:22:33.145Z",
    "size": 2726,
    "path": "../public/ext/World/node_modules/mime/mime.js"
  },
  "/ext/World/node_modules/mime/package.json": {
    "type": "application/json",
    "etag": "\"3a5-B3nqIq/lk6LsAiPRbpzLXQ4B5F8\"",
    "mtime": "2025-01-19T16:22:33.022Z",
    "size": 933,
    "path": "../public/ext/World/node_modules/mime/package.json"
  },
  "/ext/World/node_modules/mime/README.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"847-7TOekFwHSyORdg67RtYkv7wYYPs\"",
    "mtime": "2025-01-19T16:22:33.071Z",
    "size": 2119,
    "path": "../public/ext/World/node_modules/mime/README.md"
  },
  "/ext/World/node_modules/mime/types.json": {
    "type": "application/json",
    "etag": "\"7b43-yszScm9GlPpaJ280oowp6PsHPvU\"",
    "mtime": "2025-01-19T16:22:33.215Z",
    "size": 31555,
    "path": "../public/ext/World/node_modules/mime/types.json"
  },
  "/ext/World/node_modules/mime-db/db.json": {
    "type": "application/json",
    "etag": "\"2d61a-NBr1qWB6Ea6KWEXC42vAOxN+poQ\"",
    "mtime": "2025-01-19T16:22:33.163Z",
    "size": 185882,
    "path": "../public/ext/World/node_modules/mime-db/db.json"
  },
  "/ext/World/node_modules/mime-db/HISTORY.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"3125-FxGmM7TCwkPoeWle4NxrNZ/FjZM\"",
    "mtime": "2025-01-19T16:22:33.192Z",
    "size": 12581,
    "path": "../public/ext/World/node_modules/mime-db/HISTORY.md"
  },
  "/ext/World/node_modules/mime-db/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"bd-8mXStqk+urpAjQAhWiu6mBWDY6s\"",
    "mtime": "2025-01-19T16:22:33.048Z",
    "size": 189,
    "path": "../public/ext/World/node_modules/mime-db/index.js"
  },
  "/ext/World/node_modules/mime-db/LICENSE": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"494-2uD5gv/nF2IEX8d8AVyDvaOMHJ4\"",
    "mtime": "2025-01-19T16:22:33.023Z",
    "size": 1172,
    "path": "../public/ext/World/node_modules/mime-db/LICENSE"
  },
  "/ext/World/node_modules/mime-db/package.json": {
    "type": "application/json",
    "etag": "\"658-GSppaFoy8czF34pU6g8RfEi9h/E\"",
    "mtime": "2025-01-19T16:22:33.177Z",
    "size": 1624,
    "path": "../public/ext/World/node_modules/mime-db/package.json"
  },
  "/ext/World/node_modules/mime-db/README.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"ffb-MmR1CJDp2Pz7o2znJDPf5SyjcDQ\"",
    "mtime": "2025-01-19T16:22:33.199Z",
    "size": 4091,
    "path": "../public/ext/World/node_modules/mime-db/README.md"
  },
  "/ext/World/node_modules/mime-types/HISTORY.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"226c-cGfNlC41XszcQWmKwQwoIob3Yx8\"",
    "mtime": "2025-01-19T16:22:33.137Z",
    "size": 8812,
    "path": "../public/ext/World/node_modules/mime-types/HISTORY.md"
  },
  "/ext/World/node_modules/mime-types/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"e4f-jR8HrmGSxN1rwIqSR6ka9KClHso\"",
    "mtime": "2025-01-19T16:22:33.054Z",
    "size": 3663,
    "path": "../public/ext/World/node_modules/mime-types/index.js"
  },
  "/ext/World/node_modules/mime-types/LICENSE": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"48f-8CevPmGvOID9f3uLqUUqhd0hVzg\"",
    "mtime": "2025-01-19T16:22:33.026Z",
    "size": 1167,
    "path": "../public/ext/World/node_modules/mime-types/LICENSE"
  },
  "/ext/World/node_modules/mime-types/package.json": {
    "type": "application/json",
    "etag": "\"47d-7iyerjATWL99ZGtbft5sKP7Uv5Y\"",
    "mtime": "2025-01-19T16:22:33.095Z",
    "size": 1149,
    "path": "../public/ext/World/node_modules/mime-types/package.json"
  },
  "/ext/World/node_modules/mime-types/README.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"d99-4Fk9L7t6+EWY519lEGaF+JiKVdg\"",
    "mtime": "2025-01-19T16:22:33.154Z",
    "size": 3481,
    "path": "../public/ext/World/node_modules/mime-types/README.md"
  },
  "/ext/World/node_modules/ms/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"acc-DRDukhQ2+l/1mIRFzGdnYhnf/74\"",
    "mtime": "2025-01-19T16:22:33.048Z",
    "size": 2764,
    "path": "../public/ext/World/node_modules/ms/index.js"
  },
  "/ext/World/node_modules/ms/license.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"435-iE6E6/3a/ZO1u4FN8HbS69F1e6g\"",
    "mtime": "2025-01-19T16:22:33.088Z",
    "size": 1077,
    "path": "../public/ext/World/node_modules/ms/license.md"
  },
  "/ext/World/node_modules/ms/package.json": {
    "type": "application/json",
    "etag": "\"2c0-TTVNp+zhx9Vom4EE87bz3LrHeQ4\"",
    "mtime": "2025-01-19T16:22:33.023Z",
    "size": 704,
    "path": "../public/ext/World/node_modules/ms/package.json"
  },
  "/ext/World/node_modules/ms/readme.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"6b9-6HXZ+nQf5EiTx3iXSGDzYnJONew\"",
    "mtime": "2025-01-19T16:22:33.129Z",
    "size": 1721,
    "path": "../public/ext/World/node_modules/ms/readme.md"
  },
  "/ext/World/node_modules/negotiator/HISTORY.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"9c3-L+VTgvMN7CrnnBFqKAy136Ubl3I\"",
    "mtime": "2025-01-19T16:22:33.195Z",
    "size": 2499,
    "path": "../public/ext/World/node_modules/negotiator/HISTORY.md"
  },
  "/ext/World/node_modules/negotiator/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"993-0tzkHEFfiLW7SZOSkNVCvvjsWY0\"",
    "mtime": "2025-01-19T16:22:33.137Z",
    "size": 2451,
    "path": "../public/ext/World/node_modules/negotiator/index.js"
  },
  "/ext/World/node_modules/negotiator/LICENSE": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"499-c/7GT9ilzt2/ZfcFmHpUfDZ42YE\"",
    "mtime": "2025-01-19T16:22:33.026Z",
    "size": 1177,
    "path": "../public/ext/World/node_modules/negotiator/LICENSE"
  },
  "/ext/World/node_modules/negotiator/package.json": {
    "type": "application/json",
    "etag": "\"3e1-PBsi5uyuBLUUkSMmlX5qIFsBUJg\"",
    "mtime": "2025-01-19T16:22:33.186Z",
    "size": 993,
    "path": "../public/ext/World/node_modules/negotiator/package.json"
  },
  "/ext/World/node_modules/negotiator/README.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"1325-ZOd/VCpDYGiI2VVyQNyjBZfa4kI\"",
    "mtime": "2025-01-19T16:22:33.208Z",
    "size": 4901,
    "path": "../public/ext/World/node_modules/negotiator/README.md"
  },
  "/ext/World/node_modules/node/installArchSpecificPackage.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2d-HoFA+r0waNx1vFCnzQkDLATINEg\"",
    "mtime": "2025-01-19T16:22:33.032Z",
    "size": 45,
    "path": "../public/ext/World/node_modules/node/installArchSpecificPackage.js"
  },
  "/ext/World/node_modules/node/package.json": {
    "type": "application/json",
    "etag": "\"1df-0BdiBqYVn+4cSqIxG7RJoIqHGOo\"",
    "mtime": "2025-01-19T16:22:36.915Z",
    "size": 479,
    "path": "../public/ext/World/node_modules/node/package.json"
  },
  "/ext/World/node_modules/node/README.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"3c5-Dy4gOVkZJY8/yA8iTgHXlDJyeOY\"",
    "mtime": "2025-01-19T16:22:33.102Z",
    "size": 965,
    "path": "../public/ext/World/node_modules/node/README.md"
  },
  "/ext/World/node_modules/node-bin-setup/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"6d5-5bf48B3tszLqupCGeNGmR10/bMU\"",
    "mtime": "2025-01-19T16:22:33.023Z",
    "size": 1749,
    "path": "../public/ext/World/node_modules/node-bin-setup/index.js"
  },
  "/ext/World/node_modules/node-bin-setup/package.json": {
    "type": "application/json",
    "etag": "\"15f-BmYOuH7XT6UqjmpVNJIzlvFy51s\"",
    "mtime": "2025-01-19T16:22:33.048Z",
    "size": 351,
    "path": "../public/ext/World/node_modules/node-bin-setup/package.json"
  },
  "/ext/World/node_modules/object-inspect/.eslintrc": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"512-s+8AuQOQ+RkPF9/c9Ts9W0khZiY\"",
    "mtime": "2025-01-19T16:22:33.023Z",
    "size": 1298,
    "path": "../public/ext/World/node_modules/object-inspect/.eslintrc"
  },
  "/ext/World/node_modules/object-inspect/.nycrc": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"ec-/BlRwQ1FwxbaB0q1lw4v3nVmT0E\"",
    "mtime": "2025-01-19T16:22:33.048Z",
    "size": 236,
    "path": "../public/ext/World/node_modules/object-inspect/.nycrc"
  },
  "/ext/World/node_modules/object-inspect/CHANGELOG.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"8c83-d0JpS5/H+oHjsWKO/kMxuVTA3R4\"",
    "mtime": "2025-01-19T16:22:33.294Z",
    "size": 35971,
    "path": "../public/ext/World/node_modules/object-inspect/CHANGELOG.md"
  },
  "/ext/World/node_modules/object-inspect/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4b11-9ePINlaRxwzOR5ya08tEl6JjwUI\"",
    "mtime": "2025-01-19T16:22:33.261Z",
    "size": 19217,
    "path": "../public/ext/World/node_modules/object-inspect/index.js"
  },
  "/ext/World/node_modules/object-inspect/LICENSE": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"42f-MW8PF4w2mCDcy6x+TV1U5GBvV4s\"",
    "mtime": "2025-01-19T16:22:33.088Z",
    "size": 1071,
    "path": "../public/ext/World/node_modules/object-inspect/LICENSE"
  },
  "/ext/World/node_modules/object-inspect/package-support.json": {
    "type": "application/json",
    "etag": "\"16d-q9vW/ViC+nkrATzehruM4OCYiw0\"",
    "mtime": "2025-01-19T16:22:33.286Z",
    "size": 365,
    "path": "../public/ext/World/node_modules/object-inspect/package-support.json"
  },
  "/ext/World/node_modules/object-inspect/package.json": {
    "type": "application/json",
    "etag": "\"b01-SYNu4gdpEGU7jSAaLNpQjvyRes0\"",
    "mtime": "2025-01-19T16:22:33.286Z",
    "size": 2817,
    "path": "../public/ext/World/node_modules/object-inspect/package.json"
  },
  "/ext/World/node_modules/object-inspect/readme.markdown": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"bac-iyedQBzwZG8wwMSMR2Z56auxl0k\"",
    "mtime": "2025-01-19T16:22:33.286Z",
    "size": 2988,
    "path": "../public/ext/World/node_modules/object-inspect/readme.markdown"
  },
  "/ext/World/node_modules/object-inspect/test-core-js.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"216-gQh6vijSbawICNbCEDkOo9V6EjI\"",
    "mtime": "2025-01-19T16:22:33.279Z",
    "size": 534,
    "path": "../public/ext/World/node_modules/object-inspect/test-core-js.js"
  },
  "/ext/World/node_modules/object-inspect/util.inspect.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2a-ESAiST+9/yEjTdyyyU0s9Ddmx/s\"",
    "mtime": "2025-01-19T16:22:33.279Z",
    "size": 42,
    "path": "../public/ext/World/node_modules/object-inspect/util.inspect.js"
  },
  "/ext/World/node_modules/on-finished/HISTORY.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"749-kLSpxxNFZ61MgKuLl0crHXeSQ04\"",
    "mtime": "2025-01-19T16:22:33.129Z",
    "size": 1865,
    "path": "../public/ext/World/node_modules/on-finished/HISTORY.md"
  },
  "/ext/World/node_modules/on-finished/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"114e-P2kwe9BMxN/nHNE2FlCfRDtI+SM\"",
    "mtime": "2025-01-19T16:22:33.063Z",
    "size": 4430,
    "path": "../public/ext/World/node_modules/on-finished/index.js"
  },
  "/ext/World/node_modules/on-finished/LICENSE": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"48f-o6oVVDg/JBnsDbzyB8pEnvfcZs8\"",
    "mtime": "2025-01-19T16:22:33.030Z",
    "size": 1167,
    "path": "../public/ext/World/node_modules/on-finished/LICENSE"
  },
  "/ext/World/node_modules/on-finished/package.json": {
    "type": "application/json",
    "etag": "\"421-d36c1AC0Le4RmerPsyWHbK6v88w\"",
    "mtime": "2025-01-19T16:22:33.095Z",
    "size": 1057,
    "path": "../public/ext/World/node_modules/on-finished/package.json"
  },
  "/ext/World/node_modules/on-finished/README.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"1428-9QY7qHTy47KC/oeSHflF7wNY1hY\"",
    "mtime": "2025-01-19T16:22:33.154Z",
    "size": 5160,
    "path": "../public/ext/World/node_modules/on-finished/README.md"
  },
  "/ext/World/node_modules/parseurl/HISTORY.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"413-3uc27cAO1SgrJM1tuzrs5rNsyy0\"",
    "mtime": "2025-01-19T16:22:33.054Z",
    "size": 1043,
    "path": "../public/ext/World/node_modules/parseurl/HISTORY.md"
  },
  "/ext/World/node_modules/parseurl/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"af9-f4hwqKjVO9oE0cYQN6NIta4vfeg\"",
    "mtime": "2025-01-19T16:22:33.095Z",
    "size": 2809,
    "path": "../public/ext/World/node_modules/parseurl/index.js"
  },
  "/ext/World/node_modules/parseurl/LICENSE": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"495-lu41pU/Af/mUWQHG4K/aD73AW78\"",
    "mtime": "2025-01-19T16:22:33.129Z",
    "size": 1173,
    "path": "../public/ext/World/node_modules/parseurl/LICENSE"
  },
  "/ext/World/node_modules/parseurl/package.json": {
    "type": "application/json",
    "etag": "\"49c-ZG3HVv8WxGT8tj4Xss1e5K1Pi2Y\"",
    "mtime": "2025-01-19T16:22:33.029Z",
    "size": 1180,
    "path": "../public/ext/World/node_modules/parseurl/package.json"
  },
  "/ext/World/node_modules/parseurl/README.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"ffe-dLjgpZi/L2nTpAs5YiZu6ptPMGE\"",
    "mtime": "2025-01-19T16:22:33.145Z",
    "size": 4094,
    "path": "../public/ext/World/node_modules/parseurl/README.md"
  },
  "/ext/World/node_modules/path-to-regexp/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"eff-IBRh6luLJj6neQP3YnCh8nv3/gY\"",
    "mtime": "2025-01-19T16:22:33.063Z",
    "size": 3839,
    "path": "../public/ext/World/node_modules/path-to-regexp/index.js"
  },
  "/ext/World/node_modules/path-to-regexp/LICENSE": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"44f-On+Ia2MtIZdnakACDTVOhLeGBgQ\"",
    "mtime": "2025-01-19T16:22:33.029Z",
    "size": 1103,
    "path": "../public/ext/World/node_modules/path-to-regexp/LICENSE"
  },
  "/ext/World/node_modules/path-to-regexp/package.json": {
    "type": "application/json",
    "etag": "\"22a-RHV68Ptu5JKi+Iznwibqx9G9nwI\"",
    "mtime": "2025-01-19T16:22:33.095Z",
    "size": 554,
    "path": "../public/ext/World/node_modules/path-to-regexp/package.json"
  },
  "/ext/World/node_modules/path-to-regexp/Readme.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"44e-Al1Qooj+lVQiV8d2v0PvyqS+1KA\"",
    "mtime": "2025-01-19T16:22:33.129Z",
    "size": 1102,
    "path": "../public/ext/World/node_modules/path-to-regexp/Readme.md"
  },
  "/ext/World/node_modules/qs/.editorconfig": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"255-grpVxR8BSDILHl+prq8yGCgNahE\"",
    "mtime": "2025-01-19T16:22:33.026Z",
    "size": 597,
    "path": "../public/ext/World/node_modules/qs/.editorconfig"
  },
  "/ext/World/node_modules/qs/.eslintrc": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"402-cqjolz8TBySqaK/p9Z+fJMrsunE\"",
    "mtime": "2025-01-19T16:22:33.063Z",
    "size": 1026,
    "path": "../public/ext/World/node_modules/qs/.eslintrc"
  },
  "/ext/World/node_modules/qs/.nycrc": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"d8-MQ18Td4JutyqEL+F84btSxfxd0U\"",
    "mtime": "2025-01-19T16:22:33.095Z",
    "size": 216,
    "path": "../public/ext/World/node_modules/qs/.nycrc"
  },
  "/ext/World/node_modules/qs/CHANGELOG.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"7d56-AwKoKnY/mdcKE6+BnBHB94xMoYU\"",
    "mtime": "2025-01-19T16:22:33.261Z",
    "size": 32086,
    "path": "../public/ext/World/node_modules/qs/CHANGELOG.md"
  },
  "/ext/World/node_modules/qs/LICENSE.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"640-bs42b+dQ7ZFfuYyhhFiPkAYcqoY\"",
    "mtime": "2025-01-19T16:22:33.261Z",
    "size": 1600,
    "path": "../public/ext/World/node_modules/qs/LICENSE.md"
  },
  "/ext/World/node_modules/qs/package.json": {
    "type": "application/json",
    "etag": "\"c01-nFDHx49IUBt4qvalmWRsB9P5duo\"",
    "mtime": "2025-01-19T16:22:33.254Z",
    "size": 3073,
    "path": "../public/ext/World/node_modules/qs/package.json"
  },
  "/ext/World/node_modules/qs/README.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"5fe9-BA/F+kyQZ/Smm9SIphs7Gr//L+0\"",
    "mtime": "2025-01-19T16:22:33.272Z",
    "size": 24553,
    "path": "../public/ext/World/node_modules/qs/README.md"
  },
  "/ext/World/node_modules/proxy-addr/HISTORY.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"baf-qUO9lpBv960cZMDDI8U4xEv+vc4\"",
    "mtime": "2025-01-19T16:22:33.129Z",
    "size": 2991,
    "path": "../public/ext/World/node_modules/proxy-addr/HISTORY.md"
  },
  "/ext/World/node_modules/proxy-addr/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1770-sDpURRXl/xInaCjusIrXc2YVE8g\"",
    "mtime": "2025-01-19T16:22:33.054Z",
    "size": 6000,
    "path": "../public/ext/World/node_modules/proxy-addr/index.js"
  },
  "/ext/World/node_modules/proxy-addr/LICENSE": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"446-sFihOcsjnGWMjx+EGkdaUIGLX3M\"",
    "mtime": "2025-01-19T16:22:33.026Z",
    "size": 1094,
    "path": "../public/ext/World/node_modules/proxy-addr/LICENSE"
  },
  "/ext/World/node_modules/proxy-addr/package.json": {
    "type": "application/json",
    "etag": "\"49f-oExg1rJEHW4qbr3cq3WqbvwtHZw\"",
    "mtime": "2025-01-19T16:22:33.095Z",
    "size": 1183,
    "path": "../public/ext/World/node_modules/proxy-addr/package.json"
  },
  "/ext/World/node_modules/proxy-addr/README.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"1023-CsU+PvKXx9G9ytoqLQCtaKNpa5s\"",
    "mtime": "2025-01-19T16:22:33.154Z",
    "size": 4131,
    "path": "../public/ext/World/node_modules/proxy-addr/README.md"
  },
  "/ext/World/node_modules/range-parser/HISTORY.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"395-zTw3mt1BiPX0GGvPj6em59TzldA\"",
    "mtime": "2025-01-19T16:22:33.054Z",
    "size": 917,
    "path": "../public/ext/World/node_modules/range-parser/HISTORY.md"
  },
  "/ext/World/node_modules/range-parser/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b54-mfYFzVukcRg2V/vzGNvI5eyC8EI\"",
    "mtime": "2025-01-19T16:22:33.088Z",
    "size": 2900,
    "path": "../public/ext/World/node_modules/range-parser/index.js"
  },
  "/ext/World/node_modules/range-parser/LICENSE": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"49a-Q6YfJgTIJh5/A61EdEw4dknEgLM\"",
    "mtime": "2025-01-19T16:22:33.129Z",
    "size": 1178,
    "path": "../public/ext/World/node_modules/range-parser/LICENSE"
  },
  "/ext/World/node_modules/range-parser/package.json": {
    "type": "application/json",
    "etag": "\"4a0-6CpQ1L4cV97UC/OaUjK/XG2rtG0\"",
    "mtime": "2025-01-19T16:22:33.026Z",
    "size": 1184,
    "path": "../public/ext/World/node_modules/range-parser/package.json"
  },
  "/ext/World/node_modules/range-parser/README.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"8e6-s1WMv37+7nFRdd5BXcZ/ScSUEOg\"",
    "mtime": "2025-01-19T16:22:33.145Z",
    "size": 2278,
    "path": "../public/ext/World/node_modules/range-parser/README.md"
  },
  "/ext/World/node_modules/safe-buffer/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"686-lK5C8IazVTfMadgsD1XG1Z5rjZg\"",
    "mtime": "2025-01-19T16:22:33.054Z",
    "size": 1670,
    "path": "../public/ext/World/node_modules/safe-buffer/index.js"
  },
  "/ext/World/node_modules/safe-buffer/LICENSE": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"439-B9lWP2FTZY3hJHB3h/9D8EWKsko\"",
    "mtime": "2025-01-19T16:22:33.026Z",
    "size": 1081,
    "path": "../public/ext/World/node_modules/safe-buffer/LICENSE"
  },
  "/ext/World/node_modules/safe-buffer/package.json": {
    "type": "application/json",
    "etag": "\"421-bOHd37hznFd64q2E8augFCd5H1c\"",
    "mtime": "2025-01-19T16:22:33.088Z",
    "size": 1057,
    "path": "../public/ext/World/node_modules/safe-buffer/package.json"
  },
  "/ext/World/node_modules/safe-buffer/README.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"4c63-dZFgZZcPqmRbymAzJ+y66gmv4S4\"",
    "mtime": "2025-01-19T16:22:33.137Z",
    "size": 19555,
    "path": "../public/ext/World/node_modules/safe-buffer/README.md"
  },
  "/ext/World/node_modules/raw-body/HISTORY.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"17a0-BFUV6Ule05dvUrL4Lbf26Egs+KY\"",
    "mtime": "2025-01-19T16:22:33.137Z",
    "size": 6048,
    "path": "../public/ext/World/node_modules/raw-body/HISTORY.md"
  },
  "/ext/World/node_modules/raw-body/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1c03-iky6eNl4RSqoxyL3erB8DaErNeE\"",
    "mtime": "2025-01-19T16:22:33.054Z",
    "size": 7171,
    "path": "../public/ext/World/node_modules/raw-body/index.js"
  },
  "/ext/World/node_modules/raw-body/LICENSE": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"49d-ZPQHu0vhqYVrcQY0hLajHKwz4W4\"",
    "mtime": "2025-01-19T16:22:33.023Z",
    "size": 1181,
    "path": "../public/ext/World/node_modules/raw-body/LICENSE"
  },
  "/ext/World/node_modules/raw-body/package.json": {
    "type": "application/json",
    "etag": "\"52d-ltY1tmJa17VyeyXtItX7jszsAnY\"",
    "mtime": "2025-01-19T16:22:33.088Z",
    "size": 1325,
    "path": "../public/ext/World/node_modules/raw-body/package.json"
  },
  "/ext/World/node_modules/raw-body/README.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"1999-Ng6YQDC7HKaYxGrms/EljmP4B2Y\"",
    "mtime": "2025-01-19T16:22:33.154Z",
    "size": 6553,
    "path": "../public/ext/World/node_modules/raw-body/README.md"
  },
  "/ext/World/node_modules/raw-body/SECURITY.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"4a4-ksxRvUCj1nnIZQaimpJPkzeMvbg\"",
    "mtime": "2025-01-19T16:22:33.172Z",
    "size": 1188,
    "path": "../public/ext/World/node_modules/raw-body/SECURITY.md"
  },
  "/ext/World/node_modules/safer-buffer/dangerous.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"5cb-9dEXKXBrDePtfW81Bg63NoDM5C8\"",
    "mtime": "2025-01-19T16:22:33.048Z",
    "size": 1483,
    "path": "../public/ext/World/node_modules/safer-buffer/dangerous.js"
  },
  "/ext/World/node_modules/safer-buffer/LICENSE": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"446-z8sZqyNzguTOElPF8OKK0VOjx3o\"",
    "mtime": "2025-01-19T16:22:33.088Z",
    "size": 1094,
    "path": "../public/ext/World/node_modules/safer-buffer/LICENSE"
  },
  "/ext/World/node_modules/safer-buffer/package.json": {
    "type": "application/json",
    "etag": "\"336-XtD6uOXKxT5NByrL2C/Km+CPXmc\"",
    "mtime": "2025-01-19T16:22:33.023Z",
    "size": 822,
    "path": "../public/ext/World/node_modules/safer-buffer/package.json"
  },
  "/ext/World/node_modules/safer-buffer/Porting-Buffer.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"31fa-HyOhWNxXwCgSuu8zNO+WuhyUDlw\"",
    "mtime": "2025-01-19T16:22:33.137Z",
    "size": 12794,
    "path": "../public/ext/World/node_modules/safer-buffer/Porting-Buffer.md"
  },
  "/ext/World/node_modules/safer-buffer/Readme.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"2045-EziQ7MQhjZxniQ8OWITnVOgkyFk\"",
    "mtime": "2025-01-19T16:22:33.154Z",
    "size": 8261,
    "path": "../public/ext/World/node_modules/safer-buffer/Readme.md"
  },
  "/ext/World/node_modules/safer-buffer/safer.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"83e-rZGcrVAQYfZjAm84IzTMbOWos4E\"",
    "mtime": "2025-01-19T16:22:33.172Z",
    "size": 2110,
    "path": "../public/ext/World/node_modules/safer-buffer/safer.js"
  },
  "/ext/World/node_modules/safer-buffer/tests.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3d77-3H/YrRH2wKfeaJaXr8hw9Y96KEQ\"",
    "mtime": "2025-01-19T16:22:33.185Z",
    "size": 15735,
    "path": "../public/ext/World/node_modules/safer-buffer/tests.js"
  },
  "/ext/World/node_modules/send/HISTORY.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"3455-VI+f61Jx4VI2v9TeFgTyeC8KEUI\"",
    "mtime": "2025-01-19T16:22:33.140Z",
    "size": 13397,
    "path": "../public/ext/World/node_modules/send/HISTORY.md"
  },
  "/ext/World/node_modules/send/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"5b9f-+esruBK4DOdhb/Moa9H6Cj5/ats\"",
    "mtime": "2025-01-19T16:22:33.063Z",
    "size": 23455,
    "path": "../public/ext/World/node_modules/send/index.js"
  },
  "/ext/World/node_modules/send/LICENSE": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"468-uPNBo6hqgl7XXg2tW3yw7467vCk\"",
    "mtime": "2025-01-19T16:22:33.026Z",
    "size": 1128,
    "path": "../public/ext/World/node_modules/send/LICENSE"
  },
  "/ext/World/node_modules/send/package.json": {
    "type": "application/json",
    "etag": "\"623-ykC9c71rf0Vri+oYb0ILXXm7Fdg\"",
    "mtime": "2025-01-19T16:22:33.103Z",
    "size": 1571,
    "path": "../public/ext/World/node_modules/send/package.json"
  },
  "/ext/World/node_modules/send/README.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"2504-kcNUbH/t5meGHJUbgmCA2evdhzg\"",
    "mtime": "2025-01-19T16:22:33.163Z",
    "size": 9476,
    "path": "../public/ext/World/node_modules/send/README.md"
  },
  "/ext/World/node_modules/send/SECURITY.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"492-/7e4jZHOAOGOt0ltWzCjgBgGnK4\"",
    "mtime": "2025-01-19T16:22:33.178Z",
    "size": 1170,
    "path": "../public/ext/World/node_modules/send/SECURITY.md"
  },
  "/ext/World/node_modules/serve-static/HISTORY.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"2a0b-fAC1VlFNfhzWhr5KHXv9OD9XI7E\"",
    "mtime": "2025-01-19T16:22:33.137Z",
    "size": 10763,
    "path": "../public/ext/World/node_modules/serve-static/HISTORY.md"
  },
  "/ext/World/node_modules/serve-static/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"11a9-2szdMjyeWehIZGZflHvhUnaA2Rs\"",
    "mtime": "2025-01-19T16:22:33.063Z",
    "size": 4521,
    "path": "../public/ext/World/node_modules/serve-static/index.js"
  },
  "/ext/World/node_modules/serve-static/LICENSE": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"4a5-tkJ3hCuvjcJA8tvTupKtRylc2DM\"",
    "mtime": "2025-01-19T16:22:33.031Z",
    "size": 1189,
    "path": "../public/ext/World/node_modules/serve-static/LICENSE"
  },
  "/ext/World/node_modules/serve-static/package.json": {
    "type": "application/json",
    "etag": "\"475-83W1QQVZHDwVWWsE0e2c2xE1Eos\"",
    "mtime": "2025-01-19T16:22:33.095Z",
    "size": 1141,
    "path": "../public/ext/World/node_modules/serve-static/package.json"
  },
  "/ext/World/node_modules/serve-static/README.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"1e84-CAsAavMe2X6luJmlylqz2hDte9I\"",
    "mtime": "2025-01-19T16:22:33.154Z",
    "size": 7812,
    "path": "../public/ext/World/node_modules/serve-static/README.md"
  },
  "/ext/World/node_modules/setprototypeof/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"197-P3ciE2QK66ik6ay/XYsxyR/LxLE\"",
    "mtime": "2025-01-19T16:22:33.088Z",
    "size": 407,
    "path": "../public/ext/World/node_modules/setprototypeof/index.js"
  },
  "/ext/World/node_modules/setprototypeof/LICENSE": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"2d7-jxB3I6JNzgzINGuJCeEk43gtpq4\"",
    "mtime": "2025-01-19T16:22:33.129Z",
    "size": 727,
    "path": "../public/ext/World/node_modules/setprototypeof/LICENSE"
  },
  "/ext/World/node_modules/setprototypeof/package.json": {
    "type": "application/json",
    "etag": "\"4f0-y/LXrlQlanq4QkXrbXLFb2oBVFM\"",
    "mtime": "2025-01-19T16:22:33.026Z",
    "size": 1264,
    "path": "../public/ext/World/node_modules/setprototypeof/package.json"
  },
  "/ext/World/node_modules/setprototypeof/README.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"34c-7ShraPKiTCavSJaa8VA75iQV8xc\"",
    "mtime": "2025-01-19T16:22:33.145Z",
    "size": 844,
    "path": "../public/ext/World/node_modules/setprototypeof/README.md"
  },
  "/ext/World/node_modules/side-channel/.editorconfig": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"91-Iy8vzdx9VMbHAH2u3JtfMIj9s+A\"",
    "mtime": "2025-01-19T16:22:33.021Z",
    "size": 145,
    "path": "../public/ext/World/node_modules/side-channel/.editorconfig"
  },
  "/ext/World/node_modules/side-channel/.eslintrc": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"cb-8pX75q3wt4IGQMEPHlq0cDtRvi4\"",
    "mtime": "2025-01-19T16:22:33.048Z",
    "size": 203,
    "path": "../public/ext/World/node_modules/side-channel/.eslintrc"
  },
  "/ext/World/node_modules/side-channel/.nycrc": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"d8-lUYhcmmRh6wC6uxgdAJLJubXHP8\"",
    "mtime": "2025-01-19T16:22:33.088Z",
    "size": 216,
    "path": "../public/ext/World/node_modules/side-channel/.nycrc"
  },
  "/ext/World/node_modules/side-channel/CHANGELOG.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"28d2-Zc6BYoyaHrK/lk45fe9i7kGIcVk\"",
    "mtime": "2025-01-19T16:22:33.204Z",
    "size": 10450,
    "path": "../public/ext/World/node_modules/side-channel/CHANGELOG.md"
  },
  "/ext/World/node_modules/side-channel/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4a5-+kb6OYeHPifOB/v1PaghDU6zVDU\"",
    "mtime": "2025-01-19T16:22:33.145Z",
    "size": 1189,
    "path": "../public/ext/World/node_modules/side-channel/index.js"
  },
  "/ext/World/node_modules/side-channel/LICENSE": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"42f-dc3ZyNeVlB+FH0Oxj8fa5G6KWfw\"",
    "mtime": "2025-01-19T16:22:33.121Z",
    "size": 1071,
    "path": "../public/ext/World/node_modules/side-channel/LICENSE"
  },
  "/ext/World/node_modules/side-channel/package.json": {
    "type": "application/json",
    "etag": "\"939-yhDbolXIH6ADSZvn/KYYKew8Mx4\"",
    "mtime": "2025-01-19T16:22:33.180Z",
    "size": 2361,
    "path": "../public/ext/World/node_modules/side-channel/package.json"
  },
  "/ext/World/node_modules/side-channel/README.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"868-c1yjqzy2TVS6cdXY/PQJpO6b2X0\"",
    "mtime": "2025-01-19T16:22:33.211Z",
    "size": 2152,
    "path": "../public/ext/World/node_modules/side-channel/README.md"
  },
  "/ext/World/node_modules/side-channel/tsconfig.json": {
    "type": "application/json",
    "etag": "\"74-oWRyQk+MJhhN5Vfv+NaCSTnR/I4\"",
    "mtime": "2025-01-19T16:22:33.192Z",
    "size": 116,
    "path": "../public/ext/World/node_modules/side-channel/tsconfig.json"
  },
  "/ext/World/node_modules/side-channel-list/.editorconfig": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"91-Iy8vzdx9VMbHAH2u3JtfMIj9s+A\"",
    "mtime": "2025-01-19T16:22:33.021Z",
    "size": 145,
    "path": "../public/ext/World/node_modules/side-channel-list/.editorconfig"
  },
  "/ext/World/node_modules/side-channel-list/.eslintrc": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"b9-ZuADQsNjVziNUD2vBjxmRe1knMo\"",
    "mtime": "2025-01-19T16:22:33.048Z",
    "size": 185,
    "path": "../public/ext/World/node_modules/side-channel-list/.eslintrc"
  },
  "/ext/World/node_modules/side-channel-list/.nycrc": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"d8-lUYhcmmRh6wC6uxgdAJLJubXHP8\"",
    "mtime": "2025-01-19T16:22:33.080Z",
    "size": 216,
    "path": "../public/ext/World/node_modules/side-channel-list/.nycrc"
  },
  "/ext/World/node_modules/side-channel-list/CHANGELOG.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"332-aqlR8kHNUBWkKO0kni/M/gufZeQ\"",
    "mtime": "2025-01-19T16:22:33.199Z",
    "size": 818,
    "path": "../public/ext/World/node_modules/side-channel-list/CHANGELOG.md"
  },
  "/ext/World/node_modules/side-channel-list/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"d3f-KHIpjULCmM1JEmXVku7z3vV77XU\"",
    "mtime": "2025-01-19T16:22:33.145Z",
    "size": 3391,
    "path": "../public/ext/World/node_modules/side-channel-list/index.js"
  },
  "/ext/World/node_modules/side-channel-list/LICENSE": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"42f-pHhoq5C1Mt+Cq+Pk9Qe8supEE2Q\"",
    "mtime": "2025-01-19T16:22:33.121Z",
    "size": 1071,
    "path": "../public/ext/World/node_modules/side-channel-list/LICENSE"
  },
  "/ext/World/node_modules/side-channel-list/package.json": {
    "type": "application/json",
    "etag": "\"8d1-Ie92fduFqZbVL+jz8rmIBEoCWY8\"",
    "mtime": "2025-01-19T16:22:33.180Z",
    "size": 2257,
    "path": "../public/ext/World/node_modules/side-channel-list/package.json"
  },
  "/ext/World/node_modules/side-channel-list/README.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"8ed-uQXibPxVXkoc8NkyPFgHUAtRiLU\"",
    "mtime": "2025-01-19T16:22:33.208Z",
    "size": 2285,
    "path": "../public/ext/World/node_modules/side-channel-list/README.md"
  },
  "/ext/World/node_modules/side-channel-list/tsconfig.json": {
    "type": "application/json",
    "etag": "\"74-oWRyQk+MJhhN5Vfv+NaCSTnR/I4\"",
    "mtime": "2025-01-19T16:22:33.192Z",
    "size": 116,
    "path": "../public/ext/World/node_modules/side-channel-list/tsconfig.json"
  },
  "/ext/World/node_modules/side-channel-map/.editorconfig": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"91-Iy8vzdx9VMbHAH2u3JtfMIj9s+A\"",
    "mtime": "2025-01-19T16:22:33.021Z",
    "size": 145,
    "path": "../public/ext/World/node_modules/side-channel-map/.editorconfig"
  },
  "/ext/World/node_modules/side-channel-map/.eslintrc": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"b9-ZuADQsNjVziNUD2vBjxmRe1knMo\"",
    "mtime": "2025-01-19T16:22:33.048Z",
    "size": 185,
    "path": "../public/ext/World/node_modules/side-channel-map/.eslintrc"
  },
  "/ext/World/node_modules/side-channel-map/.nycrc": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"d8-lUYhcmmRh6wC6uxgdAJLJubXHP8\"",
    "mtime": "2025-01-19T16:22:33.087Z",
    "size": 216,
    "path": "../public/ext/World/node_modules/side-channel-map/.nycrc"
  },
  "/ext/World/node_modules/side-channel-map/CHANGELOG.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"4a7-otnGcAo5J7ahjE8JRbZShkZgh7k\"",
    "mtime": "2025-01-19T16:22:33.203Z",
    "size": 1191,
    "path": "../public/ext/World/node_modules/side-channel-map/CHANGELOG.md"
  },
  "/ext/World/node_modules/side-channel-map/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"7bd-klNnq7LPvHNsZjp+nNtYXlksVCo\"",
    "mtime": "2025-01-19T16:22:33.145Z",
    "size": 1981,
    "path": "../public/ext/World/node_modules/side-channel-map/index.js"
  },
  "/ext/World/node_modules/side-channel-map/LICENSE": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"42f-pHhoq5C1Mt+Cq+Pk9Qe8supEE2Q\"",
    "mtime": "2025-01-19T16:22:33.121Z",
    "size": 1071,
    "path": "../public/ext/World/node_modules/side-channel-map/LICENSE"
  },
  "/ext/World/node_modules/side-channel-map/package.json": {
    "type": "application/json",
    "etag": "\"920-qxD0RNuap0IBJeMhiEyn12WFSy8\"",
    "mtime": "2025-01-19T16:22:33.180Z",
    "size": 2336,
    "path": "../public/ext/World/node_modules/side-channel-map/package.json"
  },
  "/ext/World/node_modules/side-channel-map/README.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"8e6-yyx06j9aaQRyMtRl76iU2G6pSHQ\"",
    "mtime": "2025-01-19T16:22:33.211Z",
    "size": 2278,
    "path": "../public/ext/World/node_modules/side-channel-map/README.md"
  },
  "/ext/World/node_modules/side-channel-map/tsconfig.json": {
    "type": "application/json",
    "etag": "\"74-oWRyQk+MJhhN5Vfv+NaCSTnR/I4\"",
    "mtime": "2025-01-19T16:22:33.192Z",
    "size": 116,
    "path": "../public/ext/World/node_modules/side-channel-map/tsconfig.json"
  },
  "/ext/World/node_modules/side-channel-weakmap/.editorconfig": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"91-Iy8vzdx9VMbHAH2u3JtfMIj9s+A\"",
    "mtime": "2025-01-19T16:22:33.021Z",
    "size": 145,
    "path": "../public/ext/World/node_modules/side-channel-weakmap/.editorconfig"
  },
  "/ext/World/node_modules/side-channel-weakmap/.eslintrc": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"cb-8pX75q3wt4IGQMEPHlq0cDtRvi4\"",
    "mtime": "2025-01-19T16:22:33.048Z",
    "size": 203,
    "path": "../public/ext/World/node_modules/side-channel-weakmap/.eslintrc"
  },
  "/ext/World/node_modules/side-channel-weakmap/.nycrc": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"d8-lUYhcmmRh6wC6uxgdAJLJubXHP8\"",
    "mtime": "2025-01-19T16:22:33.087Z",
    "size": 216,
    "path": "../public/ext/World/node_modules/side-channel-weakmap/.nycrc"
  },
  "/ext/World/node_modules/side-channel-weakmap/CHANGELOG.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"5c5-nSVGJDjLE9VO7IWF43lmJmq7ric\"",
    "mtime": "2025-01-19T16:22:33.202Z",
    "size": 1477,
    "path": "../public/ext/World/node_modules/side-channel-weakmap/CHANGELOG.md"
  },
  "/ext/World/node_modules/side-channel-weakmap/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"a94-pJBST7hVT8ExwDC8Q7Qi/7/QDOs\"",
    "mtime": "2025-01-19T16:22:33.145Z",
    "size": 2708,
    "path": "../public/ext/World/node_modules/side-channel-weakmap/index.js"
  },
  "/ext/World/node_modules/side-channel-weakmap/LICENSE": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"42f-dc3ZyNeVlB+FH0Oxj8fa5G6KWfw\"",
    "mtime": "2025-01-19T16:22:33.121Z",
    "size": 1071,
    "path": "../public/ext/World/node_modules/side-channel-weakmap/LICENSE"
  },
  "/ext/World/node_modules/side-channel-weakmap/package.json": {
    "type": "application/json",
    "etag": "\"98f-zbM3kI0Z0yp53Bice85jmBurw14\"",
    "mtime": "2025-01-19T16:22:33.180Z",
    "size": 2447,
    "path": "../public/ext/World/node_modules/side-channel-weakmap/package.json"
  },
  "/ext/World/node_modules/side-channel-weakmap/README.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"926-hYQnQ1KYbhfY0f4hrgwmkVJpjPk\"",
    "mtime": "2025-01-19T16:22:33.211Z",
    "size": 2342,
    "path": "../public/ext/World/node_modules/side-channel-weakmap/README.md"
  },
  "/ext/World/node_modules/side-channel-weakmap/tsconfig.json": {
    "type": "application/json",
    "etag": "\"74-oWRyQk+MJhhN5Vfv+NaCSTnR/I4\"",
    "mtime": "2025-01-19T16:22:33.193Z",
    "size": 116,
    "path": "../public/ext/World/node_modules/side-channel-weakmap/tsconfig.json"
  },
  "/ext/World/node_modules/toidentifier/HISTORY.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"80-inEyjY+x0PmVeT9zH1vkYv1I0Eg\"",
    "mtime": "2025-01-19T16:22:33.121Z",
    "size": 128,
    "path": "../public/ext/World/node_modules/toidentifier/HISTORY.md"
  },
  "/ext/World/node_modules/toidentifier/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1f8-/GbkRFAhtJsfQ4bKcsrWVNxAjTQ\"",
    "mtime": "2025-01-19T16:22:33.048Z",
    "size": 504,
    "path": "../public/ext/World/node_modules/toidentifier/index.js"
  },
  "/ext/World/node_modules/toidentifier/LICENSE": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"454-Piqf7URQwcuQbo4UOukyfCVC7k0\"",
    "mtime": "2025-01-19T16:22:33.023Z",
    "size": 1108,
    "path": "../public/ext/World/node_modules/toidentifier/LICENSE"
  },
  "/ext/World/node_modules/toidentifier/package.json": {
    "type": "application/json",
    "etag": "\"476-6P4dAqOBtxoz5BWIriZ0bTT6SQM\"",
    "mtime": "2025-01-19T16:22:33.088Z",
    "size": 1142,
    "path": "../public/ext/World/node_modules/toidentifier/package.json"
  },
  "/ext/World/node_modules/toidentifier/README.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"70b-S5/TWypmmzPUPSVCNUOrK9UiwUQ\"",
    "mtime": "2025-01-19T16:22:33.145Z",
    "size": 1803,
    "path": "../public/ext/World/node_modules/toidentifier/README.md"
  },
  "/ext/World/node_modules/statuses/codes.json": {
    "type": "application/json",
    "etag": "\"6fd-iV/quD1vequFCEK1MysvKqfyo0Q\"",
    "mtime": "2025-01-19T16:22:33.095Z",
    "size": 1789,
    "path": "../public/ext/World/node_modules/statuses/codes.json"
  },
  "/ext/World/node_modules/statuses/HISTORY.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"60a-MbNbYQG61YJ8n2ht+wIciEc2aEo\"",
    "mtime": "2025-01-19T16:22:33.145Z",
    "size": 1546,
    "path": "../public/ext/World/node_modules/statuses/HISTORY.md"
  },
  "/ext/World/node_modules/statuses/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"a32-2ciy8y3tSvzzBWZcM2nllximmeY\"",
    "mtime": "2025-01-19T16:22:33.054Z",
    "size": 2610,
    "path": "../public/ext/World/node_modules/statuses/index.js"
  },
  "/ext/World/node_modules/statuses/LICENSE": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"494-TVBFN0EmfDuTHGBekxbau/pkERc\"",
    "mtime": "2025-01-19T16:22:33.026Z",
    "size": 1172,
    "path": "../public/ext/World/node_modules/statuses/LICENSE"
  },
  "/ext/World/node_modules/statuses/package.json": {
    "type": "application/json",
    "etag": "\"5a0-MyjZv8guT5gaGs0vP3jFJL+FMzw\"",
    "mtime": "2025-01-19T16:22:33.129Z",
    "size": 1440,
    "path": "../public/ext/World/node_modules/statuses/package.json"
  },
  "/ext/World/node_modules/statuses/README.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"de7-uPTubuKdR1fFFWADGQ2fqrjR1G0\"",
    "mtime": "2025-01-19T16:22:33.172Z",
    "size": 3559,
    "path": "../public/ext/World/node_modules/statuses/README.md"
  },
  "/ext/World/node_modules/type-is/HISTORY.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"1547-dn1/KwSEKDJCxqn/hO5O+F55QDw\"",
    "mtime": "2025-01-19T16:22:33.054Z",
    "size": 5447,
    "path": "../public/ext/World/node_modules/type-is/HISTORY.md"
  },
  "/ext/World/node_modules/type-is/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"15ba-ezbd0osJ0xtFnpy9FUdt7C+sP9s\"",
    "mtime": "2025-01-19T16:22:33.095Z",
    "size": 5562,
    "path": "../public/ext/World/node_modules/type-is/index.js"
  },
  "/ext/World/node_modules/type-is/LICENSE": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"494-ak7TtenP9or3WT38uL48HL6oN9A\"",
    "mtime": "2025-01-19T16:22:33.129Z",
    "size": 1172,
    "path": "../public/ext/World/node_modules/type-is/LICENSE"
  },
  "/ext/World/node_modules/type-is/package.json": {
    "type": "application/json",
    "etag": "\"46d-KNVcRzD9rPkBkxf64LqToLauvQs\"",
    "mtime": "2025-01-19T16:22:33.026Z",
    "size": 1133,
    "path": "../public/ext/World/node_modules/type-is/package.json"
  },
  "/ext/World/node_modules/type-is/README.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"143f-tiSmZ4GbGg5mqEIUQJLty3icMNk\"",
    "mtime": "2025-01-19T16:22:33.145Z",
    "size": 5183,
    "path": "../public/ext/World/node_modules/type-is/README.md"
  },
  "/ext/World/node_modules/unpipe/HISTORY.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"3b-fTBcAUhPNPG2zsYpNoMXocdq/W8\"",
    "mtime": "2025-01-19T16:22:33.145Z",
    "size": 59,
    "path": "../public/ext/World/node_modules/unpipe/HISTORY.md"
  },
  "/ext/World/node_modules/unpipe/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"45e-35EG0gGf4uS/rpiC5Ki+cBLrVc8\"",
    "mtime": "2025-01-19T16:22:33.121Z",
    "size": 1118,
    "path": "../public/ext/World/node_modules/unpipe/index.js"
  },
  "/ext/World/node_modules/unpipe/LICENSE": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"45a-FAwO1/h350JG1Fl1CISq3X80ZqA\"",
    "mtime": "2025-01-19T16:22:33.088Z",
    "size": 1114,
    "path": "../public/ext/World/node_modules/unpipe/LICENSE"
  },
  "/ext/World/node_modules/unpipe/package.json": {
    "type": "application/json",
    "etag": "\"302-9n8tF6GMPe2TyUI5A9+OZnj05BY\"",
    "mtime": "2025-01-19T16:22:33.023Z",
    "size": 770,
    "path": "../public/ext/World/node_modules/unpipe/package.json"
  },
  "/ext/World/node_modules/unpipe/README.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"4e2-vabgd+JFPlI0UQj6lzsuPQB02hQ\"",
    "mtime": "2025-01-19T16:22:33.048Z",
    "size": 1250,
    "path": "../public/ext/World/node_modules/unpipe/README.md"
  },
  "/ext/World/node_modules/utils-merge/.npmignore": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"4f-xnWyazs/c5+G5XBSX7r6GvZZgDE\"",
    "mtime": "2025-01-19T16:22:33.054Z",
    "size": 79,
    "path": "../public/ext/World/node_modules/utils-merge/.npmignore"
  },
  "/ext/World/node_modules/utils-merge/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"17d-d3WaaAvSLKy5S9xDjtYlDusQ5Qo\"",
    "mtime": "2025-01-19T16:22:33.145Z",
    "size": 381,
    "path": "../public/ext/World/node_modules/utils-merge/index.js"
  },
  "/ext/World/node_modules/utils-merge/LICENSE": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"43c-hA7BfcezEx3uQElUtpxiuIK6ZZk\"",
    "mtime": "2025-01-19T16:22:33.128Z",
    "size": 1084,
    "path": "../public/ext/World/node_modules/utils-merge/LICENSE"
  },
  "/ext/World/node_modules/utils-merge/package.json": {
    "type": "application/json",
    "etag": "\"359-oDRzMpw0CS6mqIzBHECaTs+LrTM\"",
    "mtime": "2025-01-19T16:22:33.026Z",
    "size": 857,
    "path": "../public/ext/World/node_modules/utils-merge/package.json"
  },
  "/ext/World/node_modules/utils-merge/README.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"527-MTmzGC9JxICmpkF9aaZlfjelby8\"",
    "mtime": "2025-01-19T16:22:33.088Z",
    "size": 1319,
    "path": "../public/ext/World/node_modules/utils-merge/README.md"
  },
  "/ext/World/node_modules/vary/HISTORY.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"318-NLDUGGjjAJg49Si6CPC32cQhojI\"",
    "mtime": "2025-01-19T16:22:33.145Z",
    "size": 792,
    "path": "../public/ext/World/node_modules/vary/HISTORY.md"
  },
  "/ext/World/node_modules/vary/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b72-Dj8uObSWY+uT6RHJ+cltLIQ9hdo\"",
    "mtime": "2025-01-19T16:22:33.128Z",
    "size": 2930,
    "path": "../public/ext/World/node_modules/vary/index.js"
  },
  "/ext/World/node_modules/vary/LICENSE": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"446-SIGtLsjrJHCnBJQhBHxtB29I8d4\"",
    "mtime": "2025-01-19T16:22:33.088Z",
    "size": 1094,
    "path": "../public/ext/World/node_modules/vary/LICENSE"
  },
  "/ext/World/node_modules/vary/package.json": {
    "type": "application/json",
    "etag": "\"4bf-gvdA4iVLeG96OjmnYtTQ/G7HsAg\"",
    "mtime": "2025-01-19T16:22:33.023Z",
    "size": 1215,
    "path": "../public/ext/World/node_modules/vary/package.json"
  },
  "/ext/World/node_modules/vary/README.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"a9c-hbplTQyZQ4yjF/hYHeCNGXlUgQ4\"",
    "mtime": "2025-01-19T16:22:33.054Z",
    "size": 2716,
    "path": "../public/ext/World/node_modules/vary/README.md"
  },
  "/ext/World/node_modules/body-parser/lib/read.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"10e5-An8/vYpTcN3sdE0z7J1ZTbQfYpM\"",
    "mtime": "2025-01-19T16:22:33.174Z",
    "size": 4325,
    "path": "../public/ext/World/node_modules/body-parser/lib/read.js"
  },
  "/ext/World/node_modules/call-bind-apply-helpers/.github/FUNDING.yml": {
    "type": "text/yaml; charset=utf-8",
    "etag": "\"252-2oWQrl4wbJ8SeEn6pPDtpzGB6h8\"",
    "mtime": "2025-01-19T16:22:33.270Z",
    "size": 594,
    "path": "../public/ext/World/node_modules/call-bind-apply-helpers/.github/FUNDING.yml"
  },
  "/ext/World/node_modules/call-bind-apply-helpers/test/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"a2d-RBJOt8npJn4iFlKhzeW70B0Ya4o\"",
    "mtime": "2025-01-19T16:22:33.202Z",
    "size": 2605,
    "path": "../public/ext/World/node_modules/call-bind-apply-helpers/test/index.js"
  },
  "/ext/World/node_modules/call-bound/.github/FUNDING.yml": {
    "type": "text/yaml; charset=utf-8",
    "etag": "\"245-5AfvbJTmjKMj1jPw/dc0fr7safA\"",
    "mtime": "2025-01-19T16:22:33.220Z",
    "size": 581,
    "path": "../public/ext/World/node_modules/call-bound/.github/FUNDING.yml"
  },
  "/ext/World/node_modules/call-bound/test/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"924-msXrkNQ2IiL+AW0BzkkR5hoVqx0\"",
    "mtime": "2025-01-19T16:22:33.154Z",
    "size": 2340,
    "path": "../public/ext/World/node_modules/call-bound/test/index.js"
  },
  "/ext/World/node_modules/debug/src/browser.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"127e-xBrceUh/N309+zl8UxgS+5zEKaI\"",
    "mtime": "2025-01-19T16:22:33.236Z",
    "size": 4734,
    "path": "../public/ext/World/node_modules/debug/src/browser.js"
  },
  "/ext/World/node_modules/debug/src/debug.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"112a-oripFchvx1D1anE3hg8Z7BGC7iE\"",
    "mtime": "2025-01-19T16:22:33.238Z",
    "size": 4394,
    "path": "../public/ext/World/node_modules/debug/src/debug.js"
  },
  "/ext/World/node_modules/debug/src/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"107-GCMU0y54nk+cKeMVCuOS8WMPFxw\"",
    "mtime": "2025-01-19T16:22:33.247Z",
    "size": 263,
    "path": "../public/ext/World/node_modules/debug/src/index.js"
  },
  "/ext/World/node_modules/debug/src/inspector-log.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"175-svKZax84ts7AsXRr5s/kWPJYXqw\"",
    "mtime": "2025-01-19T16:22:33.247Z",
    "size": 373,
    "path": "../public/ext/World/node_modules/debug/src/inspector-log.js"
  },
  "/ext/World/node_modules/debug/src/node.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"177f-8k1Sy8kUSwEd7yGCNP97UOfdyxk\"",
    "mtime": "2025-01-19T16:22:33.254Z",
    "size": 6015,
    "path": "../public/ext/World/node_modules/debug/src/node.js"
  },
  "/ext/World/node_modules/dunder-proto/.github/FUNDING.yml": {
    "type": "text/yaml; charset=utf-8",
    "etag": "\"247-ix5gxwvmn8KUn4K+uiI5F1jRuo4\"",
    "mtime": "2025-01-19T16:22:33.238Z",
    "size": 583,
    "path": "../public/ext/World/node_modules/dunder-proto/.github/FUNDING.yml"
  },
  "/ext/World/node_modules/dunder-proto/test/get.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"477-1s/g3tVahYx+9TWP4PN3Q15xEzo\"",
    "mtime": "2025-01-19T16:22:33.154Z",
    "size": 1143,
    "path": "../public/ext/World/node_modules/dunder-proto/test/get.js"
  },
  "/ext/World/node_modules/dunder-proto/test/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"33-zsaGTux/6ZmWXW1ot81x+MP0DI8\"",
    "mtime": "2025-01-19T16:22:33.163Z",
    "size": 51,
    "path": "../public/ext/World/node_modules/dunder-proto/test/index.js"
  },
  "/ext/World/node_modules/dunder-proto/test/set.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"69f-PiYDTVcGHydye9dpaw1D8q9fFBk\"",
    "mtime": "2025-01-19T16:22:33.191Z",
    "size": 1695,
    "path": "../public/ext/World/node_modules/dunder-proto/test/set.js"
  },
  "/ext/World/node_modules/es-define-property/.github/FUNDING.yml": {
    "type": "text/yaml; charset=utf-8",
    "etag": "\"234-w0pXCmBMhNTgQkQvhRj+tH/WwCc\"",
    "mtime": "2025-01-19T16:22:33.221Z",
    "size": 564,
    "path": "../public/ext/World/node_modules/es-define-property/.github/FUNDING.yml"
  },
  "/ext/World/node_modules/es-define-property/test/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"513-UgnsRl+6y3LKYlIkT54iNOeQAfk\"",
    "mtime": "2025-01-19T16:22:33.154Z",
    "size": 1299,
    "path": "../public/ext/World/node_modules/es-define-property/test/index.js"
  },
  "/ext/World/node_modules/es-errors/.github/FUNDING.yml": {
    "type": "text/yaml; charset=utf-8",
    "etag": "\"22b-mazxXlDzkYLAj4jd603OKzvM8Ho\"",
    "mtime": "2025-01-19T16:22:33.270Z",
    "size": 555,
    "path": "../public/ext/World/node_modules/es-errors/.github/FUNDING.yml"
  },
  "/ext/World/node_modules/es-errors/test/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"164-UMC9p7hGkBK/bZ+VH5rvV5Eu7gY\"",
    "mtime": "2025-01-19T16:22:33.154Z",
    "size": 356,
    "path": "../public/ext/World/node_modules/es-errors/test/index.js"
  },
  "/ext/World/node_modules/es-object-atoms/.github/FUNDING.yml": {
    "type": "text/yaml; charset=utf-8",
    "etag": "\"22b-s6fOh/YuPFSOy70I+lhuog+wQUQ\"",
    "mtime": "2025-01-19T16:22:33.247Z",
    "size": 555,
    "path": "../public/ext/World/node_modules/es-object-atoms/.github/FUNDING.yml"
  },
  "/ext/World/node_modules/es-object-atoms/test/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"449-8ZN2Fwv15cOAvKt/Lue9TGJo6qw\"",
    "mtime": "2025-01-19T16:22:33.129Z",
    "size": 1097,
    "path": "../public/ext/World/node_modules/es-object-atoms/test/index.js"
  },
  "/ext/World/node_modules/express/lib/application.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3901-Gcdxj2o9D53NTKaSwZcY7Cmq4JI\"",
    "mtime": "2025-01-19T16:22:33.080Z",
    "size": 14593,
    "path": "../public/ext/World/node_modules/express/lib/application.js"
  },
  "/ext/World/node_modules/express/lib/express.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"969-4jOILeYusJWzyuCylW6HduavPWo\"",
    "mtime": "2025-01-19T16:22:33.121Z",
    "size": 2409,
    "path": "../public/ext/World/node_modules/express/lib/express.js"
  },
  "/ext/World/node_modules/express/lib/request.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"30d9-jJHwg4Wz0kGxgOpTJqPhvgFpRdE\"",
    "mtime": "2025-01-19T16:22:33.218Z",
    "size": 12505,
    "path": "../public/ext/World/node_modules/express/lib/request.js"
  },
  "/ext/World/node_modules/express/lib/response.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"7039-p+eeOjGwnd9I4EK4sN1QNi37enQ\"",
    "mtime": "2025-01-19T16:22:33.229Z",
    "size": 28729,
    "path": "../public/ext/World/node_modules/express/lib/response.js"
  },
  "/ext/World/node_modules/express/lib/utils.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"16ef-jXlwpmPDBFw2ZUVhDuU/C6DzMUQ\"",
    "mtime": "2025-01-19T16:22:33.238Z",
    "size": 5871,
    "path": "../public/ext/World/node_modules/express/lib/utils.js"
  },
  "/ext/World/node_modules/express/lib/view.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"cfd-TPt/I8sKS58R2sx+gdyjeC9jVS8\"",
    "mtime": "2025-01-19T16:22:33.245Z",
    "size": 3325,
    "path": "../public/ext/World/node_modules/express/lib/view.js"
  },
  "/ext/World/node_modules/function-bind/.github/FUNDING.yml": {
    "type": "text/yaml; charset=utf-8",
    "etag": "\"248-hkNO3ujb1akNBcWOL2gIiRUbQ64\"",
    "mtime": "2025-01-19T16:22:33.229Z",
    "size": 584,
    "path": "../public/ext/World/node_modules/function-bind/.github/FUNDING.yml"
  },
  "/ext/World/node_modules/function-bind/.github/SECURITY.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"9d-8wB/h+x8IJ+E59ZNrrB9dujfH24\"",
    "mtime": "2025-01-19T16:22:33.222Z",
    "size": 157,
    "path": "../public/ext/World/node_modules/function-bind/.github/SECURITY.md"
  },
  "/ext/World/node_modules/function-bind/test/.eslintrc": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"b0-GG7bu2SQO3HxxTDtgTR8oACztnM\"",
    "mtime": "2025-01-19T16:22:33.063Z",
    "size": 176,
    "path": "../public/ext/World/node_modules/function-bind/test/.eslintrc"
  },
  "/ext/World/node_modules/function-bind/test/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"231f-CeCPs4ZTQQqFG2svq1cA+To7dvI\"",
    "mtime": "2025-01-19T16:22:33.180Z",
    "size": 8991,
    "path": "../public/ext/World/node_modules/function-bind/test/index.js"
  },
  "/ext/World/node_modules/get-intrinsic/.github/FUNDING.yml": {
    "type": "text/yaml; charset=utf-8",
    "etag": "\"248-Y93704njcqUbYpqcZK4bquxr4ls\"",
    "mtime": "2025-01-19T16:22:33.208Z",
    "size": 584,
    "path": "../public/ext/World/node_modules/get-intrinsic/.github/FUNDING.yml"
  },
  "/ext/World/node_modules/get-intrinsic/test/GetIntrinsic.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2236-YRp+do5+kjrBuNtgmW2zUS6Tekk\"",
    "mtime": "2025-01-19T16:22:33.129Z",
    "size": 8758,
    "path": "../public/ext/World/node_modules/get-intrinsic/test/GetIntrinsic.js"
  },
  "/ext/World/node_modules/get-proto/.github/FUNDING.yml": {
    "type": "text/yaml; charset=utf-8",
    "etag": "\"244-nJwqm4ustOKQ4YTjyZIHknAF0Qg\"",
    "mtime": "2025-01-19T16:22:33.245Z",
    "size": 580,
    "path": "../public/ext/World/node_modules/get-proto/.github/FUNDING.yml"
  },
  "/ext/World/node_modules/get-proto/test/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"937-wzf8r/oGRgD7CEMFon0iN9niszk\"",
    "mtime": "2025-01-19T16:22:33.154Z",
    "size": 2359,
    "path": "../public/ext/World/node_modules/get-proto/test/index.js"
  },
  "/ext/World/node_modules/gopd/.github/FUNDING.yml": {
    "type": "text/yaml; charset=utf-8",
    "etag": "\"23f-1MbiAXuNyIKAL1a+RCq8GOnQ+YQ\"",
    "mtime": "2025-01-19T16:22:33.228Z",
    "size": 575,
    "path": "../public/ext/World/node_modules/gopd/.github/FUNDING.yml"
  },
  "/ext/World/node_modules/gopd/test/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"290-oZcxDpDYKUxl0UJR+ufFO3ccJ8A\"",
    "mtime": "2025-01-19T16:22:33.154Z",
    "size": 656,
    "path": "../public/ext/World/node_modules/gopd/test/index.js"
  },
  "/ext/World/node_modules/has-symbols/.github/FUNDING.yml": {
    "type": "text/yaml; charset=utf-8",
    "etag": "\"246-WtEvFIEN9LNO/XpVQHBB/pGWfeM\"",
    "mtime": "2025-01-19T16:22:33.253Z",
    "size": 582,
    "path": "../public/ext/World/node_modules/has-symbols/.github/FUNDING.yml"
  },
  "/ext/World/node_modules/has-symbols/test/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"28e-w4jVYVtkLSz/yudlpekgoTiduZQ\"",
    "mtime": "2025-01-19T16:22:33.188Z",
    "size": 654,
    "path": "../public/ext/World/node_modules/has-symbols/test/index.js"
  },
  "/ext/World/node_modules/has-symbols/test/tests.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"85b-CZDk2xrEck74q3yMhon21Y27ixA\"",
    "mtime": "2025-01-19T16:22:33.207Z",
    "size": 2139,
    "path": "../public/ext/World/node_modules/has-symbols/test/tests.js"
  },
  "/ext/World/node_modules/hasown/.github/FUNDING.yml": {
    "type": "text/yaml; charset=utf-8",
    "etag": "\"228-4gDdlnld+eYS1m+YyxvJ2EXqNE8\"",
    "mtime": "2025-01-19T16:22:33.208Z",
    "size": 552,
    "path": "../public/ext/World/node_modules/hasown/.github/FUNDING.yml"
  },
  "/ext/World/node_modules/iconv-lite/encodings/dbcs-codec.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"53a7-TqietzorPMPAypRSgLong/z5Rrw\"",
    "mtime": "2025-01-19T16:22:33.163Z",
    "size": 21415,
    "path": "../public/ext/World/node_modules/iconv-lite/encodings/dbcs-codec.js"
  },
  "/ext/World/node_modules/iconv-lite/encodings/dbcs-data.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2063-HMzvhYOsbgcOnZEXYGM8qNn3yow\"",
    "mtime": "2025-01-19T16:22:33.176Z",
    "size": 8291,
    "path": "../public/ext/World/node_modules/iconv-lite/encodings/dbcs-data.js"
  },
  "/ext/World/node_modules/iconv-lite/encodings/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2c6-eeOVtt+v0K5RbhjIG4KO894Mdqo\"",
    "mtime": "2025-01-19T16:22:33.185Z",
    "size": 710,
    "path": "../public/ext/World/node_modules/iconv-lite/encodings/index.js"
  },
  "/ext/World/node_modules/iconv-lite/encodings/internal.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"17e3-aw5CG/1vpwHQ/bQvv1pRJ3h3R1c\"",
    "mtime": "2025-01-19T16:22:33.195Z",
    "size": 6115,
    "path": "../public/ext/World/node_modules/iconv-lite/encodings/internal.js"
  },
  "/ext/World/node_modules/iconv-lite/encodings/sbcs-codec.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"88f-0MK94FPc6AJ+/wCy4XLL7UVXnmw\"",
    "mtime": "2025-01-19T16:22:33.205Z",
    "size": 2191,
    "path": "../public/ext/World/node_modules/iconv-lite/encodings/sbcs-codec.js"
  },
  "/ext/World/node_modules/iconv-lite/encodings/sbcs-data-generated.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"7d22-jOt1QIQrf7I3OR7DwyQDWj/rczY\"",
    "mtime": "2025-01-19T16:22:33.220Z",
    "size": 32034,
    "path": "../public/ext/World/node_modules/iconv-lite/encodings/sbcs-data-generated.js"
  },
  "/ext/World/node_modules/iconv-lite/encodings/sbcs-data.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"124e-six4bFzIo7WPZQ5BP3reNxUs0XM\"",
    "mtime": "2025-01-19T16:22:33.222Z",
    "size": 4686,
    "path": "../public/ext/World/node_modules/iconv-lite/encodings/sbcs-data.js"
  },
  "/ext/World/node_modules/iconv-lite/encodings/utf16.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1393-08Y84QZlnwDW8tu0C6TchT+8hwM\"",
    "mtime": "2025-01-19T16:22:33.277Z",
    "size": 5011,
    "path": "../public/ext/World/node_modules/iconv-lite/encodings/utf16.js"
  },
  "/ext/World/node_modules/iconv-lite/encodings/utf7.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"23ff-XazHbGha7aXEiQ1fjY56q92FIWE\"",
    "mtime": "2025-01-19T16:22:33.279Z",
    "size": 9215,
    "path": "../public/ext/World/node_modules/iconv-lite/encodings/utf7.js"
  },
  "/ext/World/node_modules/iconv-lite/lib/bom-handling.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"455-XGUYzjrMNcPh2pYbwCwRDgj4HbI\"",
    "mtime": "2025-01-19T16:22:33.279Z",
    "size": 1109,
    "path": "../public/ext/World/node_modules/iconv-lite/lib/bom-handling.js"
  },
  "/ext/World/node_modules/iconv-lite/lib/extend-node.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"21fd-hQZDqiJkQcDQ2ZE+pTYruFVDwmo\"",
    "mtime": "2025-01-19T16:22:33.286Z",
    "size": 8701,
    "path": "../public/ext/World/node_modules/iconv-lite/lib/extend-node.js"
  },
  "/ext/World/node_modules/iconv-lite/lib/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1403-aMzFtTsbeqZtrllK0xULD2bRWKU\"",
    "mtime": "2025-01-19T16:22:33.286Z",
    "size": 5123,
    "path": "../public/ext/World/node_modules/iconv-lite/lib/index.js"
  },
  "/ext/World/node_modules/iconv-lite/lib/streams.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"d3b-OYLD5Mar5exAZKjFGWOVBn0MUEs\"",
    "mtime": "2025-01-19T16:22:33.286Z",
    "size": 3387,
    "path": "../public/ext/World/node_modules/iconv-lite/lib/streams.js"
  },
  "/ext/World/node_modules/ipaddr.js/lib/ipaddr.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4b85-cO9fIsHq01vVIh86tH69aCDu00I\"",
    "mtime": "2025-01-19T16:22:33.163Z",
    "size": 19333,
    "path": "../public/ext/World/node_modules/ipaddr.js/lib/ipaddr.js"
  },
  "/ext/World/node_modules/math-intrinsics/.github/FUNDING.yml": {
    "type": "text/yaml; charset=utf-8",
    "etag": "\"231-dWXYH2axTpDs/BZkQQfWsJie9ts\"",
    "mtime": "2025-01-19T16:22:33.294Z",
    "size": 561,
    "path": "../public/ext/World/node_modules/math-intrinsics/.github/FUNDING.yml"
  },
  "/ext/World/node_modules/math-intrinsics/constants/maxArrayLength.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"6e-N2CreuMjjSKEyP3Ww82nMGpYN+g\"",
    "mtime": "2025-01-19T16:22:33.220Z",
    "size": 110,
    "path": "../public/ext/World/node_modules/math-intrinsics/constants/maxArrayLength.js"
  },
  "/ext/World/node_modules/math-intrinsics/constants/maxSafeInteger.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"e7-t0FUBU3exS1T6Cc6q55ClTrYO1U\"",
    "mtime": "2025-01-19T16:22:33.222Z",
    "size": 231,
    "path": "../public/ext/World/node_modules/math-intrinsics/constants/maxSafeInteger.js"
  },
  "/ext/World/node_modules/math-intrinsics/constants/maxValue.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"c5-/dNRcBwAzkmJxcZ3sKkHrNBzwRA\"",
    "mtime": "2025-01-19T16:22:33.229Z",
    "size": 197,
    "path": "../public/ext/World/node_modules/math-intrinsics/constants/maxValue.js"
  },
  "/ext/World/node_modules/math-intrinsics/test/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"18b0-1YhCh7PhmY3IxQlkZpfZCn76QZw\"",
    "mtime": "2025-01-19T16:22:33.154Z",
    "size": 6320,
    "path": "../public/ext/World/node_modules/math-intrinsics/test/index.js"
  },
  "/ext/World/node_modules/mime/src/build.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"547-83cisirRe0KLi0uXtcCXILToap0\"",
    "mtime": "2025-01-19T16:22:33.193Z",
    "size": 1351,
    "path": "../public/ext/World/node_modules/mime/src/build.js"
  },
  "/ext/World/node_modules/mime/src/test.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"91e-htPSvPFi88GYrYMVyAP6f0uSjwc\"",
    "mtime": "2025-01-19T16:22:33.203Z",
    "size": 2334,
    "path": "../public/ext/World/node_modules/mime/src/test.js"
  },
  "/ext/World/node_modules/negotiator/lib/charset.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"c09-v58lp79twhdrcLydoE/BYr379MQ\"",
    "mtime": "2025-01-19T16:22:33.063Z",
    "size": 3081,
    "path": "../public/ext/World/node_modules/negotiator/lib/charset.js"
  },
  "/ext/World/node_modules/negotiator/lib/encoding.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"db2-YGbhU7ysDQYM0uR13a0OI5Qiqg0\"",
    "mtime": "2025-01-19T16:22:33.104Z",
    "size": 3506,
    "path": "../public/ext/World/node_modules/negotiator/lib/encoding.js"
  },
  "/ext/World/node_modules/negotiator/lib/language.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"d51-JIuqZhtc1KQ2jh3ph6WpEWNsQas\"",
    "mtime": "2025-01-19T16:22:33.163Z",
    "size": 3409,
    "path": "../public/ext/World/node_modules/negotiator/lib/language.js"
  },
  "/ext/World/node_modules/negotiator/lib/mediaType.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"14ee-n+fR9lcOhwv1qQrae6GnpTSA9cw\"",
    "mtime": "2025-01-19T16:22:33.176Z",
    "size": 5358,
    "path": "../public/ext/World/node_modules/negotiator/lib/mediaType.js"
  },
  "/ext/World/node_modules/node/bin/node": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"22-VNeXCbzatxV87kKRkhWN5s/m9jU\"",
    "mtime": "2025-01-19T16:22:36.915Z",
    "size": 34,
    "path": "../public/ext/World/node_modules/node/bin/node"
  },
  "/ext/World/node_modules/node/bin/node.exe": {
    "type": "application/octet-stream",
    "etag": "\"4f5aa90-zp5t5GRSMBeMVkDeQTFlaYHX2S4\"",
    "mtime": "2025-01-19T16:22:35.987Z",
    "size": 83208848,
    "path": "../public/ext/World/node_modules/node/bin/node.exe"
  },
  "/ext/World/node_modules/node/node_modules/.package-lock.json": {
    "type": "application/json",
    "etag": "\"2e3-gv1rrG+Mwq0cFRF70CI7u2P+ZTE\"",
    "mtime": "2025-01-19T16:22:36.859Z",
    "size": 739,
    "path": "../public/ext/World/node_modules/node/node_modules/.package-lock.json"
  },
  "/ext/World/node_modules/node-bin-setup/.github/dependabot.yml": {
    "type": "text/yaml; charset=utf-8",
    "etag": "\"8f-9dlEHLQXx4nGvUKw6hVqEL45W5U\"",
    "mtime": "2025-01-19T16:22:33.102Z",
    "size": 143,
    "path": "../public/ext/World/node_modules/node-bin-setup/.github/dependabot.yml"
  },
  "/ext/World/node_modules/object-inspect/example/all.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"187-/xe1joTY0RTEJt7fQNqqepKTQS0\"",
    "mtime": "2025-01-19T16:22:33.137Z",
    "size": 391,
    "path": "../public/ext/World/node_modules/object-inspect/example/all.js"
  },
  "/ext/World/node_modules/object-inspect/example/circular.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"74-N+GnU+8VUwZvMNwJYoM1LBmuBu8\"",
    "mtime": "2025-01-19T16:22:33.174Z",
    "size": 116,
    "path": "../public/ext/World/node_modules/object-inspect/example/circular.js"
  },
  "/ext/World/node_modules/object-inspect/example/fn.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"7e-1ylce32bc+Z2DJbhqbi9prRfzms\"",
    "mtime": "2025-01-19T16:22:33.233Z",
    "size": 126,
    "path": "../public/ext/World/node_modules/object-inspect/example/fn.js"
  },
  "/ext/World/node_modules/object-inspect/example/inspect.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"fb-U3JT6DJgLEg5+TW940DEmgzUSqI\"",
    "mtime": "2025-01-19T16:22:33.261Z",
    "size": 251,
    "path": "../public/ext/World/node_modules/object-inspect/example/inspect.js"
  },
  "/ext/World/node_modules/object-inspect/.github/FUNDING.yml": {
    "type": "text/yaml; charset=utf-8",
    "etag": "\"249-MpcUxNLE+091oXcIvbg3L/sIdAI\"",
    "mtime": "2025-01-19T16:22:33.294Z",
    "size": 585,
    "path": "../public/ext/World/node_modules/object-inspect/.github/FUNDING.yml"
  },
  "/ext/World/node_modules/qs/.github/FUNDING.yml": {
    "type": "text/yaml; charset=utf-8",
    "etag": "\"224-WWgHXhy+nxHWK3APq6HJtEKRvX4\"",
    "mtime": "2025-01-19T16:22:33.274Z",
    "size": 548,
    "path": "../public/ext/World/node_modules/qs/.github/FUNDING.yml"
  },
  "/ext/World/node_modules/object-inspect/test/bigint.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"822-DUF0n+FlB5pUCeSJwynndXmqChE\"",
    "mtime": "2025-01-19T16:22:33.163Z",
    "size": 2082,
    "path": "../public/ext/World/node_modules/object-inspect/test/bigint.js"
  },
  "/ext/World/node_modules/object-inspect/test/circular.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1c3-NA8UZpOo6ZV5zZ5hIR+7AjAwx9w\"",
    "mtime": "2025-01-19T16:22:33.180Z",
    "size": 451,
    "path": "../public/ext/World/node_modules/object-inspect/test/circular.js"
  },
  "/ext/World/node_modules/object-inspect/test/deep.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"190-If4g0+PBTII5maJD1pfwnbHoCqk\"",
    "mtime": "2025-01-19T16:22:33.195Z",
    "size": 400,
    "path": "../public/ext/World/node_modules/object-inspect/test/deep.js"
  },
  "/ext/World/node_modules/object-inspect/test/element.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"627-9tr+sCwv+qroFYwBOhPq0zaQUKA\"",
    "mtime": "2025-01-19T16:22:33.215Z",
    "size": 1575,
    "path": "../public/ext/World/node_modules/object-inspect/test/element.js"
  },
  "/ext/World/node_modules/object-inspect/test/err.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"600-+qGjhZgS0y9yPV8iavajIhI8sQQ\"",
    "mtime": "2025-01-19T16:22:33.222Z",
    "size": 1536,
    "path": "../public/ext/World/node_modules/object-inspect/test/err.js"
  },
  "/ext/World/node_modules/object-inspect/test/fakes.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2ab-54vuLZ7rD3lw24QgHwGUHJGcY70\"",
    "mtime": "2025-01-19T16:22:33.229Z",
    "size": 683,
    "path": "../public/ext/World/node_modules/object-inspect/test/fakes.js"
  },
  "/ext/World/node_modules/object-inspect/test/fn.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"8b3-fyYy2vJL+AQX6eIUB87Cp3cKm7M\"",
    "mtime": "2025-01-19T16:22:33.238Z",
    "size": 2227,
    "path": "../public/ext/World/node_modules/object-inspect/test/fn.js"
  },
  "/ext/World/node_modules/object-inspect/test/global.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"174-T9g9c7sDPTBvC5s8z7gj/oNnp6o\"",
    "mtime": "2025-01-19T16:22:33.245Z",
    "size": 372,
    "path": "../public/ext/World/node_modules/object-inspect/test/global.js"
  },
  "/ext/World/node_modules/object-inspect/test/has.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"202-vDirgD1QgscFknJauvMUKvZutSo\"",
    "mtime": "2025-01-19T16:22:33.247Z",
    "size": 514,
    "path": "../public/ext/World/node_modules/object-inspect/test/has.js"
  },
  "/ext/World/node_modules/object-inspect/test/holes.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"ff-NjwBWcqFLrvtwwUu7VoisYcFvdw\"",
    "mtime": "2025-01-19T16:22:33.254Z",
    "size": 255,
    "path": "../public/ext/World/node_modules/object-inspect/test/holes.js"
  },
  "/ext/World/node_modules/object-inspect/test/indent-option.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"19e9-9j0DUyam1mF5Dn3wzV7AnIS2wGs\"",
    "mtime": "2025-01-19T16:22:33.261Z",
    "size": 6633,
    "path": "../public/ext/World/node_modules/object-inspect/test/indent-option.js"
  },
  "/ext/World/node_modules/object-inspect/test/inspect.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1352-n8W08SNiFZdYmyERK7sJcug7cKM\"",
    "mtime": "2025-01-19T16:22:33.270Z",
    "size": 4946,
    "path": "../public/ext/World/node_modules/object-inspect/test/inspect.js"
  },
  "/ext/World/node_modules/object-inspect/test/lowbyte.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"10c-M/sFRQGnrEORErmqIJpSx04h/fk\"",
    "mtime": "2025-01-19T16:22:33.272Z",
    "size": 268,
    "path": "../public/ext/World/node_modules/object-inspect/test/lowbyte.js"
  },
  "/ext/World/node_modules/object-inspect/test/number.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"908-0FnWaR+NInqwXoHPtAEZliFUtR0\"",
    "mtime": "2025-01-19T16:22:33.274Z",
    "size": 2312,
    "path": "../public/ext/World/node_modules/object-inspect/test/number.js"
  },
  "/ext/World/node_modules/object-inspect/test/quoteStyle.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"5fa-k4RBopn+Zw7cRrp/SHchfOHvx4k\"",
    "mtime": "2025-01-19T16:22:33.274Z",
    "size": 1530,
    "path": "../public/ext/World/node_modules/object-inspect/test/quoteStyle.js"
  },
  "/ext/World/node_modules/object-inspect/test/toStringTag.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"60a-iZBYm4FO0OYtXd+jep1f4lYetok\"",
    "mtime": "2025-01-19T16:22:33.279Z",
    "size": 1546,
    "path": "../public/ext/World/node_modules/object-inspect/test/toStringTag.js"
  },
  "/ext/World/node_modules/object-inspect/test/undef.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"12e-2orcNX29jjxVciRzfGCElDEe9J0\"",
    "mtime": "2025-01-19T16:22:33.279Z",
    "size": 302,
    "path": "../public/ext/World/node_modules/object-inspect/test/undef.js"
  },
  "/ext/World/node_modules/object-inspect/test/values.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1b7a-cxef91+9j5+aKjol1BUmL9jILqY\"",
    "mtime": "2025-01-19T16:22:33.286Z",
    "size": 7034,
    "path": "../public/ext/World/node_modules/object-inspect/test/values.js"
  },
  "/ext/World/node_modules/qs/dist/qs.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b639-l/gtnkiYnWQOPva9+Athz8umelE\"",
    "mtime": "2025-01-19T16:22:33.222Z",
    "size": 46649,
    "path": "../public/ext/World/node_modules/qs/dist/qs.js"
  },
  "/ext/World/node_modules/qs/test/empty-keys-cases.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1e12-AmRV6jiOwKrvgIh8iHouKzERZrw\"",
    "mtime": "2025-01-19T16:22:33.137Z",
    "size": 7698,
    "path": "../public/ext/World/node_modules/qs/test/empty-keys-cases.js"
  },
  "/ext/World/node_modules/qs/test/parse.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b71a-/1YT+G03XftS72FVZEz8uN+/Zgk\"",
    "mtime": "2025-01-19T16:22:33.204Z",
    "size": 46874,
    "path": "../public/ext/World/node_modules/qs/test/parse.js"
  },
  "/ext/World/node_modules/qs/test/stringify.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"ced3-sI4kCUYEQGZ8K8eDQ0uNnIf2Nlo\"",
    "mtime": "2025-01-19T16:22:33.238Z",
    "size": 52947,
    "path": "../public/ext/World/node_modules/qs/test/stringify.js"
  },
  "/ext/World/node_modules/qs/test/utils.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"13f8-1Bi251l6sSLSbh5TW/xX4UgTTc8\"",
    "mtime": "2025-01-19T16:22:33.247Z",
    "size": 5112,
    "path": "../public/ext/World/node_modules/qs/test/utils.js"
  },
  "/ext/World/node_modules/qs/lib/formats.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1dc-7dw7KBI72ekls3Q2JGWySIc0/94\"",
    "mtime": "2025-01-19T16:22:33.163Z",
    "size": 476,
    "path": "../public/ext/World/node_modules/qs/lib/formats.js"
  },
  "/ext/World/node_modules/qs/lib/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"d3-kDmu9DvrucmZ5HEdNnIRzJe3ENM\"",
    "mtime": "2025-01-19T16:22:33.175Z",
    "size": 211,
    "path": "../public/ext/World/node_modules/qs/lib/index.js"
  },
  "/ext/World/node_modules/qs/lib/parse.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2c35-fK60/9xIvPbrMeDO6MHxVh1yJNU\"",
    "mtime": "2025-01-19T16:22:33.186Z",
    "size": 11317,
    "path": "../public/ext/World/node_modules/qs/lib/parse.js"
  },
  "/ext/World/node_modules/qs/lib/stringify.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2c43-9IlnKMMtTJKMLMbc+2zZkRFyDuo\"",
    "mtime": "2025-01-19T16:22:33.229Z",
    "size": 11331,
    "path": "../public/ext/World/node_modules/qs/lib/stringify.js"
  },
  "/ext/World/node_modules/qs/lib/utils.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1c63-Frvt8LFQ4CT20smRQ6swcOEkptM\"",
    "mtime": "2025-01-19T16:22:33.247Z",
    "size": 7267,
    "path": "../public/ext/World/node_modules/qs/lib/utils.js"
  },
  "/ext/World/node_modules/side-channel/.github/FUNDING.yml": {
    "type": "text/yaml; charset=utf-8",
    "etag": "\"247-X91D4EfVS5mJ6lYjq0HykJC/Ex4\"",
    "mtime": "2025-01-19T16:22:33.229Z",
    "size": 583,
    "path": "../public/ext/World/node_modules/side-channel/.github/FUNDING.yml"
  },
  "/ext/World/node_modules/side-channel/test/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"a0d-spsUgDZ9AlraVegzIKSSkFn2u1g\"",
    "mtime": "2025-01-19T16:22:33.171Z",
    "size": 2573,
    "path": "../public/ext/World/node_modules/side-channel/test/index.js"
  },
  "/ext/World/node_modules/setprototypeof/test/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2b2-uRu27nE9hHOzsJe1hUn2UcZGlBA\"",
    "mtime": "2025-01-19T16:22:33.172Z",
    "size": 690,
    "path": "../public/ext/World/node_modules/setprototypeof/test/index.js"
  },
  "/ext/World/node_modules/side-channel-list/.github/FUNDING.yml": {
    "type": "text/yaml; charset=utf-8",
    "etag": "\"24c-DXyAu7dbcVU2KuoY3CFBaMyIsR8\"",
    "mtime": "2025-01-19T16:22:33.233Z",
    "size": 588,
    "path": "../public/ext/World/node_modules/side-channel-list/.github/FUNDING.yml"
  },
  "/ext/World/node_modules/side-channel-list/test/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"a35-iUICAr2F6c74z7bDS2pgJ7CZt2U\"",
    "mtime": "2025-01-19T16:22:33.171Z",
    "size": 2613,
    "path": "../public/ext/World/node_modules/side-channel-list/test/index.js"
  },
  "/ext/World/node_modules/side-channel-map/.github/FUNDING.yml": {
    "type": "text/yaml; charset=utf-8",
    "etag": "\"24b-Xgqno6LDjPShHpryCRMMxkUlzXk\"",
    "mtime": "2025-01-19T16:22:33.229Z",
    "size": 587,
    "path": "../public/ext/World/node_modules/side-channel-map/.github/FUNDING.yml"
  },
  "/ext/World/node_modules/side-channel-map/test/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b3b-OZtu02B7P+SISrlyy6i0eZBxxLk\"",
    "mtime": "2025-01-19T16:22:33.171Z",
    "size": 2875,
    "path": "../public/ext/World/node_modules/side-channel-map/test/index.js"
  },
  "/ext/World/node_modules/side-channel-weakmap/.github/FUNDING.yml": {
    "type": "text/yaml; charset=utf-8",
    "etag": "\"24f-fxewgtqFQHpy4L6s+OgX/Bcd7uw\"",
    "mtime": "2025-01-19T16:22:33.228Z",
    "size": 591,
    "path": "../public/ext/World/node_modules/side-channel-weakmap/.github/FUNDING.yml"
  },
  "/ext/World/node_modules/side-channel-weakmap/test/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b99-VmZrD3YXKzVnWFB4ttxuhGjIrsQ\"",
    "mtime": "2025-01-19T16:22:33.172Z",
    "size": 2969,
    "path": "../public/ext/World/node_modules/side-channel-weakmap/test/index.js"
  },
  "/ext/World/node_modules/body-parser/lib/types/json.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"14b3-rx8UQoFSV28cBHw0YtJqf+uYY1o\"",
    "mtime": "2025-01-19T16:22:33.107Z",
    "size": 5299,
    "path": "../public/ext/World/node_modules/body-parser/lib/types/json.js"
  },
  "/ext/World/node_modules/body-parser/lib/types/raw.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"75c-6nQR/1px341CYyLQcQPliUYw4ps\"",
    "mtime": "2025-01-19T16:22:33.140Z",
    "size": 1884,
    "path": "../public/ext/World/node_modules/body-parser/lib/types/raw.js"
  },
  "/ext/World/node_modules/body-parser/lib/types/text.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"8ed-7am8A2ydEPFADNLkqIMpSWccrcc\"",
    "mtime": "2025-01-19T16:22:33.180Z",
    "size": 2285,
    "path": "../public/ext/World/node_modules/body-parser/lib/types/text.js"
  },
  "/ext/World/node_modules/body-parser/lib/types/urlencoded.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1904-anAzKNQmuhGOSOKs51oHke8FIZ4\"",
    "mtime": "2025-01-19T16:22:33.195Z",
    "size": 6404,
    "path": "../public/ext/World/node_modules/body-parser/lib/types/urlencoded.js"
  },
  "/ext/World/node_modules/depd/lib/browser/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"5e8-wBD3VOzR6Vn2usrBDpdr7iTCFaA\"",
    "mtime": "2025-01-19T16:22:33.178Z",
    "size": 1512,
    "path": "../public/ext/World/node_modules/depd/lib/browser/index.js"
  },
  "/ext/World/node_modules/express/lib/middleware/init.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"355-S4uUVrVyZ9WJKwl9T/MWg45B390\"",
    "mtime": "2025-01-19T16:22:33.186Z",
    "size": 853,
    "path": "../public/ext/World/node_modules/express/lib/middleware/init.js"
  },
  "/ext/World/node_modules/express/lib/middleware/query.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"375-pmqmQq1sZmRwgDAizHxcRnMr1bw\"",
    "mtime": "2025-01-19T16:22:33.205Z",
    "size": 885,
    "path": "../public/ext/World/node_modules/express/lib/middleware/query.js"
  },
  "/ext/World/node_modules/has-symbols/test/shams/core-js.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"31d-f/EEM8s28q/Vddzk+dZ1itU2X20\"",
    "mtime": "2025-01-19T16:22:33.137Z",
    "size": 797,
    "path": "../public/ext/World/node_modules/has-symbols/test/shams/core-js.js"
  },
  "/ext/World/node_modules/has-symbols/test/shams/get-own-property-symbols.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2f8-tHBH9P9I7j4KbfKSL8VCBkncHfc\"",
    "mtime": "2025-01-19T16:22:33.161Z",
    "size": 760,
    "path": "../public/ext/World/node_modules/has-symbols/test/shams/get-own-property-symbols.js"
  },
  "/ext/World/node_modules/iconv-lite/encodings/tables/big5-added.json": {
    "type": "application/json",
    "etag": "\"4535-5hstd6NrzpdvVj9lkwDgajPJ5uk\"",
    "mtime": "2025-01-19T16:22:33.236Z",
    "size": 17717,
    "path": "../public/ext/World/node_modules/iconv-lite/encodings/tables/big5-added.json"
  },
  "/ext/World/node_modules/iconv-lite/encodings/tables/cp936.json": {
    "type": "application/json",
    "etag": "\"b8d8-Irlc4+l0PcjfgVuKa5wT0an3wik\"",
    "mtime": "2025-01-19T16:22:33.247Z",
    "size": 47320,
    "path": "../public/ext/World/node_modules/iconv-lite/encodings/tables/cp936.json"
  },
  "/ext/World/node_modules/iconv-lite/encodings/tables/cp949.json": {
    "type": "application/json",
    "etag": "\"94ea-o6bm9hp4tQ5UlH8Rzo2uu4dWIJ0\"",
    "mtime": "2025-01-19T16:22:33.254Z",
    "size": 38122,
    "path": "../public/ext/World/node_modules/iconv-lite/encodings/tables/cp949.json"
  },
  "/ext/World/node_modules/iconv-lite/encodings/tables/cp950.json": {
    "type": "application/json",
    "etag": "\"a574-M603kKBmDNK3wMWZp/XTwUdZa+w\"",
    "mtime": "2025-01-19T16:22:33.261Z",
    "size": 42356,
    "path": "../public/ext/World/node_modules/iconv-lite/encodings/tables/cp950.json"
  },
  "/ext/World/node_modules/iconv-lite/encodings/tables/eucjp.json": {
    "type": "application/json",
    "etag": "\"a068-m+tq+jkimgRP1pNakspemX9vrHg\"",
    "mtime": "2025-01-19T16:22:33.261Z",
    "size": 41064,
    "path": "../public/ext/World/node_modules/iconv-lite/encodings/tables/eucjp.json"
  },
  "/ext/World/node_modules/iconv-lite/encodings/tables/gb18030-ranges.json": {
    "type": "application/json",
    "etag": "\"8a8-v86I/JLpjBmRD77xsCuF+10s8vk\"",
    "mtime": "2025-01-19T16:22:33.270Z",
    "size": 2216,
    "path": "../public/ext/World/node_modules/iconv-lite/encodings/tables/gb18030-ranges.json"
  },
  "/ext/World/node_modules/iconv-lite/encodings/tables/gbk-added.json": {
    "type": "application/json",
    "etag": "\"4cb-kY7syi922yqj/gv4Y0gWWEvzHXg\"",
    "mtime": "2025-01-19T16:22:33.272Z",
    "size": 1227,
    "path": "../public/ext/World/node_modules/iconv-lite/encodings/tables/gbk-added.json"
  },
  "/ext/World/node_modules/iconv-lite/encodings/tables/shiftjis.json": {
    "type": "application/json",
    "etag": "\"5ce6-4C0m5Hp7KVIiw8pwAVAkyhY+c4E\"",
    "mtime": "2025-01-19T16:22:33.274Z",
    "size": 23782,
    "path": "../public/ext/World/node_modules/iconv-lite/encodings/tables/shiftjis.json"
  },
  "/ext/World/node_modules/express/lib/router/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3b13-xx09j/hD1mh8nSiHQ3SoKNYXkuo\"",
    "mtime": "2025-01-19T16:22:33.172Z",
    "size": 15123,
    "path": "../public/ext/World/node_modules/express/lib/router/index.js"
  },
  "/ext/World/node_modules/express/lib/router/layer.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"ce0-MCJE2Wr8bW/Kqjr64Bb76BaPGSw\"",
    "mtime": "2025-01-19T16:22:33.195Z",
    "size": 3296,
    "path": "../public/ext/World/node_modules/express/lib/router/layer.js"
  },
  "/ext/World/node_modules/express/lib/router/route.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"112f-QV6rreILlOGGPn0cuJ24IkMpSiQ\"",
    "mtime": "2025-01-19T16:22:33.233Z",
    "size": 4399,
    "path": "../public/ext/World/node_modules/express/lib/router/route.js"
  },
  "/ext/World/node_modules/node/node_modules/.bin/node": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"11b-EPr83zqnCwKUsOVxFrss4+6XJXM\"",
    "mtime": "2025-01-19T16:22:36.850Z",
    "size": 283,
    "path": "../public/ext/World/node_modules/node/node_modules/.bin/node"
  },
  "/ext/World/node_modules/node/node_modules/.bin/node.cmd": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"87-Ib3/UGbGEH6q1wUOsoKZbicIago\"",
    "mtime": "2025-01-19T16:22:36.850Z",
    "size": 135,
    "path": "../public/ext/World/node_modules/node/node_modules/.bin/node.cmd"
  },
  "/ext/World/node_modules/node/node_modules/.bin/node.ps1": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"1d6-yZ6dbNwIlhHuvu6fjabzBC4lkOU\"",
    "mtime": "2025-01-19T16:22:36.845Z",
    "size": 470,
    "path": "../public/ext/World/node_modules/node/node_modules/.bin/node.ps1"
  },
  "/ext/World/node_modules/node/node_modules/node-bin-setup/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"6d5-5bf48B3tszLqupCGeNGmR10/bMU\"",
    "mtime": "2025-01-19T16:22:34.945Z",
    "size": 1749,
    "path": "../public/ext/World/node_modules/node/node_modules/node-bin-setup/index.js"
  },
  "/ext/World/node_modules/node/node_modules/node-bin-setup/package.json": {
    "type": "application/json",
    "etag": "\"15f-BmYOuH7XT6UqjmpVNJIzlvFy51s\"",
    "mtime": "2025-01-19T16:22:34.948Z",
    "size": 351,
    "path": "../public/ext/World/node_modules/node/node_modules/node-bin-setup/package.json"
  },
  "/ext/World/node_modules/object-inspect/test/browser/dom.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1a0-LNUWXPm4rfGm6l96gk9hsyY76OQ\"",
    "mtime": "2025-01-19T16:22:33.207Z",
    "size": 416,
    "path": "../public/ext/World/node_modules/object-inspect/test/browser/dom.js"
  },
  "/ext/World/node_modules/node/node_modules/node-win-x64/package.json": {
    "type": "application/json",
    "etag": "\"f6-ZCTJR3HtTFEgLp9BzlAAI2q6bfs\"",
    "mtime": "2025-01-19T16:22:35.989Z",
    "size": 246,
    "path": "../public/ext/World/node_modules/node/node_modules/node-win-x64/package.json"
  },
  "/ext/World/node_modules/send/node_modules/ms/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"bd0-6oaWY0hvUTzE0cqDEu1SoWXEF/o\"",
    "mtime": "2025-01-19T16:22:33.032Z",
    "size": 3024,
    "path": "../public/ext/World/node_modules/send/node_modules/ms/index.js"
  },
  "/ext/World/node_modules/send/node_modules/ms/license.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"437-rGRupOxlzR/qxFmhlKFaUtFHvc8\"",
    "mtime": "2025-01-19T16:22:33.099Z",
    "size": 1079,
    "path": "../public/ext/World/node_modules/send/node_modules/ms/license.md"
  },
  "/ext/World/node_modules/send/node_modules/ms/package.json": {
    "type": "application/json",
    "etag": "\"2dc-wpDrl3NhdxdtBx2krIVauZVoXJc\"",
    "mtime": "2025-01-19T16:22:33.063Z",
    "size": 732,
    "path": "../public/ext/World/node_modules/send/node_modules/ms/package.json"
  },
  "/ext/World/node_modules/send/node_modules/ms/readme.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"75e-5a9lgPrL+WqsU3QYRtWEXKcW/5c\"",
    "mtime": "2025-01-19T16:22:33.129Z",
    "size": 1886,
    "path": "../public/ext/World/node_modules/send/node_modules/ms/readme.md"
  },
  "/ext/World/node_modules/send/node_modules/encodeurl/HISTORY.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"ee-UpxyW9b1fTqDFU23yBqO1o5T4I8\"",
    "mtime": "2025-01-19T16:22:33.154Z",
    "size": 238,
    "path": "../public/ext/World/node_modules/send/node_modules/encodeurl/HISTORY.md"
  },
  "/ext/World/node_modules/send/node_modules/encodeurl/index.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"632-hC9C2e5YHZGsgqf6AY9huz+O9jo\"",
    "mtime": "2025-01-19T16:22:33.137Z",
    "size": 1586,
    "path": "../public/ext/World/node_modules/send/node_modules/encodeurl/index.js"
  },
  "/ext/World/node_modules/send/node_modules/encodeurl/LICENSE": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"441-ZdTCBqJmZlPC/W5RZGj6WqMh6PE\"",
    "mtime": "2025-01-19T16:22:33.102Z",
    "size": 1089,
    "path": "../public/ext/World/node_modules/send/node_modules/encodeurl/LICENSE"
  },
  "/ext/World/node_modules/send/node_modules/encodeurl/package.json": {
    "type": "application/json",
    "etag": "\"443-c8AbgfNKmXixWN8nRO+MRSUdYZM\"",
    "mtime": "2025-01-19T16:22:33.032Z",
    "size": 1091,
    "path": "../public/ext/World/node_modules/send/node_modules/encodeurl/package.json"
  },
  "/ext/World/node_modules/send/node_modules/encodeurl/README.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"f0f-9/8R3lUEymKh1gmU6liPAkK1mUY\"",
    "mtime": "2025-01-19T16:22:33.063Z",
    "size": 3855,
    "path": "../public/ext/World/node_modules/send/node_modules/encodeurl/README.md"
  },
  "/ext/World/node_modules/node/node_modules/node-bin-setup/.github/dependabot.yml": {
    "type": "text/yaml; charset=utf-8",
    "etag": "\"8f-9dlEHLQXx4nGvUKw6hVqEL45W5U\"",
    "mtime": "2025-01-19T16:22:34.948Z",
    "size": 143,
    "path": "../public/ext/World/node_modules/node/node_modules/node-bin-setup/.github/dependabot.yml"
  },
  "/ext/World/node_modules/node/node_modules/node-win-x64/bin/node.exe": {
    "type": "application/octet-stream",
    "etag": "\"4f5aa90-zp5t5GRSMBeMVkDeQTFlaYHX2S4\"",
    "mtime": "2025-01-19T16:22:35.987Z",
    "size": 83208848,
    "path": "../public/ext/World/node_modules/node/node_modules/node-win-x64/bin/node.exe"
  }
};

const _DRIVE_LETTER_START_RE = /^[A-Za-z]:\//;
function normalizeWindowsPath(input = "") {
  if (!input) {
    return input;
  }
  return input.replace(/\\/g, "/").replace(_DRIVE_LETTER_START_RE, (r) => r.toUpperCase());
}
const _IS_ABSOLUTE_RE = /^[/\\](?![/\\])|^[/\\]{2}(?!\.)|^[A-Za-z]:[/\\]/;
const _DRIVE_LETTER_RE = /^[A-Za-z]:$/;
function cwd() {
  if (typeof process !== "undefined" && typeof process.cwd === "function") {
    return process.cwd().replace(/\\/g, "/");
  }
  return "/";
}
const resolve = function(...arguments_) {
  arguments_ = arguments_.map((argument) => normalizeWindowsPath(argument));
  let resolvedPath = "";
  let resolvedAbsolute = false;
  for (let index = arguments_.length - 1; index >= -1 && !resolvedAbsolute; index--) {
    const path = index >= 0 ? arguments_[index] : cwd();
    if (!path || path.length === 0) {
      continue;
    }
    resolvedPath = `${path}/${resolvedPath}`;
    resolvedAbsolute = isAbsolute(path);
  }
  resolvedPath = normalizeString(resolvedPath, !resolvedAbsolute);
  if (resolvedAbsolute && !isAbsolute(resolvedPath)) {
    return `/${resolvedPath}`;
  }
  return resolvedPath.length > 0 ? resolvedPath : ".";
};
function normalizeString(path, allowAboveRoot) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let char = null;
  for (let index = 0; index <= path.length; ++index) {
    if (index < path.length) {
      char = path[index];
    } else if (char === "/") {
      break;
    } else {
      char = "/";
    }
    if (char === "/") {
      if (lastSlash === index - 1 || dots === 1) ; else if (dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res[res.length - 1] !== "." || res[res.length - 2] !== ".") {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf("/");
            if (lastSlashIndex === -1) {
              res = "";
              lastSegmentLength = 0;
            } else {
              res = res.slice(0, lastSlashIndex);
              lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
            }
            lastSlash = index;
            dots = 0;
            continue;
          } else if (res.length > 0) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = index;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          res += res.length > 0 ? "/.." : "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0) {
          res += `/${path.slice(lastSlash + 1, index)}`;
        } else {
          res = path.slice(lastSlash + 1, index);
        }
        lastSegmentLength = index - lastSlash - 1;
      }
      lastSlash = index;
      dots = 0;
    } else if (char === "." && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
const isAbsolute = function(p) {
  return _IS_ABSOLUTE_RE.test(p);
};
const dirname = function(p) {
  const segments = normalizeWindowsPath(p).replace(/\/$/, "").split("/").slice(0, -1);
  if (segments.length === 1 && _DRIVE_LETTER_RE.test(segments[0])) {
    segments[0] += "/";
  }
  return segments.join("/") || (isAbsolute(p) ? "/" : ".");
};

function readAsset (id) {
  const serverDir = dirname(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve(serverDir, assets$1[id].path))
}

const publicAssetBases = {"/_nuxt/builds/meta/":{"maxAge":31536000},"/_nuxt/builds/":{"maxAge":1},"/_nuxt/":{"maxAge":31536000}};

function isPublicAssetURL(id = '') {
  if (assets$1[id]) {
    return true
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets$1[id]
}

const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = { gzip: ".gz", br: ".br" };
const _ToOWU7 = eventHandler((event) => {
  if (event.method && !METHODS.has(event.method)) {
    return;
  }
  let id = decodePath(
    withLeadingSlash(withoutTrailingSlash(parseURL(event.path).pathname))
  );
  let asset;
  const encodingHeader = String(
    getRequestHeader(event, "accept-encoding") || ""
  );
  const encodings = [
    ...encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(),
    ""
  ];
  if (encodings.length > 1) {
    appendResponseHeader(event, "Vary", "Accept-Encoding");
  }
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      removeResponseHeader(event, "Cache-Control");
      throw createError$1({
        statusMessage: "Cannot find static asset " + id,
        statusCode: 404
      });
    }
    return;
  }
  const ifNotMatch = getRequestHeader(event, "if-none-match") === asset.etag;
  if (ifNotMatch) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  const ifModifiedSinceH = getRequestHeader(event, "if-modified-since");
  const mtimeDate = new Date(asset.mtime);
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  if (asset.type && !getResponseHeader(event, "Content-Type")) {
    setResponseHeader(event, "Content-Type", asset.type);
  }
  if (asset.etag && !getResponseHeader(event, "ETag")) {
    setResponseHeader(event, "ETag", asset.etag);
  }
  if (asset.mtime && !getResponseHeader(event, "Last-Modified")) {
    setResponseHeader(event, "Last-Modified", mtimeDate.toUTCString());
  }
  if (asset.encoding && !getResponseHeader(event, "Content-Encoding")) {
    setResponseHeader(event, "Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !getResponseHeader(event, "Content-Length")) {
    setResponseHeader(event, "Content-Length", asset.size);
  }
  return readAsset(id);
});

function klona(x) {
	if (typeof x !== 'object') return x;

	var k, tmp, str=Object.prototype.toString.call(x);

	if (str === '[object Object]') {
		if (x.constructor !== Object && typeof x.constructor === 'function') {
			tmp = new x.constructor();
			for (k in x) {
				if (x.hasOwnProperty(k) && tmp[k] !== x[k]) {
					tmp[k] = klona(x[k]);
				}
			}
		} else {
			tmp = {}; // null
			for (k in x) {
				if (k === '__proto__') {
					Object.defineProperty(tmp, k, {
						value: klona(x[k]),
						configurable: true,
						enumerable: true,
						writable: true,
					});
				} else {
					tmp[k] = klona(x[k]);
				}
			}
		}
		return tmp;
	}

	if (str === '[object Array]') {
		k = x.length;
		for (tmp=Array(k); k--;) {
			tmp[k] = klona(x[k]);
		}
		return tmp;
	}

	if (str === '[object Set]') {
		tmp = new Set;
		x.forEach(function (val) {
			tmp.add(klona(val));
		});
		return tmp;
	}

	if (str === '[object Map]') {
		tmp = new Map;
		x.forEach(function (val, key) {
			tmp.set(klona(key), klona(val));
		});
		return tmp;
	}

	if (str === '[object Date]') {
		return new Date(+x);
	}

	if (str === '[object RegExp]') {
		tmp = new RegExp(x.source, x.flags);
		tmp.lastIndex = x.lastIndex;
		return tmp;
	}

	if (str === '[object DataView]') {
		return new x.constructor( klona(x.buffer) );
	}

	if (str === '[object ArrayBuffer]') {
		return x.slice(0);
	}

	// ArrayBuffer.isView(x)
	// ~> `new` bcuz `Buffer.slice` => ref
	if (str.slice(-6) === 'Array]') {
		return new x.constructor(x);
	}

	return x;
}

const inlineAppConfig = {
  "nuxt": {}
};



const appConfig = defuFn(inlineAppConfig);

const NUMBER_CHAR_RE = /\d/;
const STR_SPLITTERS = ["-", "_", "/", "."];
function isUppercase(char = "") {
  if (NUMBER_CHAR_RE.test(char)) {
    return undefined;
  }
  return char !== char.toLowerCase();
}
function splitByCase(str, separators) {
  const splitters = STR_SPLITTERS;
  const parts = [];
  if (!str || typeof str !== "string") {
    return parts;
  }
  let buff = "";
  let previousUpper;
  let previousSplitter;
  for (const char of str) {
    const isSplitter = splitters.includes(char);
    if (isSplitter === true) {
      parts.push(buff);
      buff = "";
      previousUpper = undefined;
      continue;
    }
    const isUpper = isUppercase(char);
    if (previousSplitter === false) {
      if (previousUpper === false && isUpper === true) {
        parts.push(buff);
        buff = char;
        previousUpper = isUpper;
        continue;
      }
      if (previousUpper === true && isUpper === false && buff.length > 1) {
        const lastChar = buff.at(-1);
        parts.push(buff.slice(0, Math.max(0, buff.length - 1)));
        buff = lastChar + char;
        previousUpper = isUpper;
        continue;
      }
    }
    buff += char;
    previousUpper = isUpper;
    previousSplitter = isSplitter;
  }
  parts.push(buff);
  return parts;
}
function kebabCase(str, joiner) {
  return str ? (Array.isArray(str) ? str : splitByCase(str)).map((p) => p.toLowerCase()).join(joiner) : "";
}
function snakeCase(str) {
  return kebabCase(str || "", "_");
}

function getEnv(key, opts) {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[opts.prefix + envKey] ?? process.env[opts.altPrefix + envKey]
  );
}
function _isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function applyEnv(obj, opts, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = getEnv(subKey, opts);
    if (_isObject(obj[key])) {
      if (_isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
        applyEnv(obj[key], opts, subKey);
      } else if (envValue === undefined) {
        applyEnv(obj[key], opts, subKey);
      } else {
        obj[key] = envValue ?? obj[key];
      }
    } else {
      obj[key] = envValue ?? obj[key];
    }
    if (opts.envExpansion && typeof obj[key] === "string") {
      obj[key] = _expandFromEnv(obj[key]);
    }
  }
  return obj;
}
const envExpandRx = /{{(.*?)}}/g;
function _expandFromEnv(value) {
  return value.replace(envExpandRx, (match, key) => {
    return process.env[key] || match;
  });
}

const _inlineRuntimeConfig = {
  "app": {
    "baseURL": "/",
    "buildId": "8a6ff463-5b4e-4608-8bc8-b70c2a5cae26",
    "buildAssetsDir": "/_nuxt/",
    "cdnURL": ""
  },
  "nitro": {
    "envPrefix": "NUXT_",
    "routeRules": {
      "/__nuxt_error": {
        "cache": false
      },
      "/_nuxt/builds/meta/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      },
      "/_nuxt/builds/**": {
        "headers": {
          "cache-control": "public, max-age=1, immutable"
        }
      },
      "/_nuxt/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      }
    }
  },
  "public": {},
  "ipx": {
    "baseURL": "/_ipx",
    "alias": {},
    "fs": {
      "dir": "../public"
    },
    "http": {
      "domains": [
        "portfolionurdjedd.com"
      ]
    }
  }
};
const envOptions = {
  prefix: "NITRO_",
  altPrefix: _inlineRuntimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_",
  envExpansion: _inlineRuntimeConfig.nitro.envExpansion ?? process.env.NITRO_ENV_EXPANSION ?? false
};
const _sharedRuntimeConfig = _deepFreeze(
  applyEnv(klona(_inlineRuntimeConfig), envOptions)
);
function useRuntimeConfig(event) {
  if (!event) {
    return _sharedRuntimeConfig;
  }
  if (event.context.nitro.runtimeConfig) {
    return event.context.nitro.runtimeConfig;
  }
  const runtimeConfig = klona(_inlineRuntimeConfig);
  applyEnv(runtimeConfig, envOptions);
  event.context.nitro.runtimeConfig = runtimeConfig;
  return runtimeConfig;
}
_deepFreeze(klona(appConfig));
function _deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      _deepFreeze(value);
    }
  }
  return Object.freeze(object);
}
new Proxy(/* @__PURE__ */ Object.create(null), {
  get: (_, prop) => {
    console.warn(
      "Please use `useRuntimeConfig()` instead of accessing config directly."
    );
    const runtimeConfig = useRuntimeConfig();
    if (prop in runtimeConfig) {
      return runtimeConfig[prop];
    }
    return undefined;
  }
});

function wrapToPromise(value) {
  if (!value || typeof value.then !== "function") {
    return Promise.resolve(value);
  }
  return value;
}
function asyncCall(function_, ...arguments_) {
  try {
    return wrapToPromise(function_(...arguments_));
  } catch (error) {
    return Promise.reject(error);
  }
}
function isPrimitive(value) {
  const type = typeof value;
  return value === null || type !== "object" && type !== "function";
}
function isPureObject(value) {
  const proto = Object.getPrototypeOf(value);
  return !proto || proto.isPrototypeOf(Object);
}
function stringify(value) {
  if (isPrimitive(value)) {
    return String(value);
  }
  if (isPureObject(value) || Array.isArray(value)) {
    return JSON.stringify(value);
  }
  if (typeof value.toJSON === "function") {
    return stringify(value.toJSON());
  }
  throw new Error("[unstorage] Cannot stringify value!");
}
const BASE64_PREFIX = "base64:";
function serializeRaw(value) {
  if (typeof value === "string") {
    return value;
  }
  return BASE64_PREFIX + base64Encode(value);
}
function deserializeRaw(value) {
  if (typeof value !== "string") {
    return value;
  }
  if (!value.startsWith(BASE64_PREFIX)) {
    return value;
  }
  return base64Decode(value.slice(BASE64_PREFIX.length));
}
function base64Decode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input, "base64");
  }
  return Uint8Array.from(
    globalThis.atob(input),
    (c) => c.codePointAt(0)
  );
}
function base64Encode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input).toString("base64");
  }
  return globalThis.btoa(String.fromCodePoint(...input));
}

const storageKeyProperties = [
  "hasItem",
  "getItem",
  "getItemRaw",
  "setItem",
  "setItemRaw",
  "removeItem",
  "getMeta",
  "setMeta",
  "removeMeta",
  "getKeys",
  "clear",
  "mount",
  "unmount"
];
function prefixStorage(storage, base) {
  base = normalizeBaseKey(base);
  if (!base) {
    return storage;
  }
  const nsStorage = { ...storage };
  for (const property of storageKeyProperties) {
    nsStorage[property] = (key = "", ...args) => (
      // @ts-ignore
      storage[property](base + key, ...args)
    );
  }
  nsStorage.getKeys = (key = "", ...arguments_) => storage.getKeys(base + key, ...arguments_).then((keys) => keys.map((key2) => key2.slice(base.length)));
  return nsStorage;
}
function normalizeKey$1(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
}
function joinKeys(...keys) {
  return normalizeKey$1(keys.join(":"));
}
function normalizeBaseKey(base) {
  base = normalizeKey$1(base);
  return base ? base + ":" : "";
}

function defineDriver$1(factory) {
  return factory;
}

const DRIVER_NAME$1 = "memory";
const memory = defineDriver$1(() => {
  const data = /* @__PURE__ */ new Map();
  return {
    name: DRIVER_NAME$1,
    getInstance: () => data,
    hasItem(key) {
      return data.has(key);
    },
    getItem(key) {
      return data.get(key) ?? null;
    },
    getItemRaw(key) {
      return data.get(key) ?? null;
    },
    setItem(key, value) {
      data.set(key, value);
    },
    setItemRaw(key, value) {
      data.set(key, value);
    },
    removeItem(key) {
      data.delete(key);
    },
    getKeys() {
      return [...data.keys()];
    },
    clear() {
      data.clear();
    },
    dispose() {
      data.clear();
    }
  };
});

function createStorage(options = {}) {
  const context = {
    mounts: { "": options.driver || memory() },
    mountpoints: [""],
    watching: false,
    watchListeners: [],
    unwatch: {}
  };
  const getMount = (key) => {
    for (const base of context.mountpoints) {
      if (key.startsWith(base)) {
        return {
          base,
          relativeKey: key.slice(base.length),
          driver: context.mounts[base]
        };
      }
    }
    return {
      base: "",
      relativeKey: key,
      driver: context.mounts[""]
    };
  };
  const getMounts = (base, includeParent) => {
    return context.mountpoints.filter(
      (mountpoint) => mountpoint.startsWith(base) || includeParent && base.startsWith(mountpoint)
    ).map((mountpoint) => ({
      relativeBase: base.length > mountpoint.length ? base.slice(mountpoint.length) : undefined,
      mountpoint,
      driver: context.mounts[mountpoint]
    }));
  };
  const onChange = (event, key) => {
    if (!context.watching) {
      return;
    }
    key = normalizeKey$1(key);
    for (const listener of context.watchListeners) {
      listener(event, key);
    }
  };
  const startWatch = async () => {
    if (context.watching) {
      return;
    }
    context.watching = true;
    for (const mountpoint in context.mounts) {
      context.unwatch[mountpoint] = await watch(
        context.mounts[mountpoint],
        onChange,
        mountpoint
      );
    }
  };
  const stopWatch = async () => {
    if (!context.watching) {
      return;
    }
    for (const mountpoint in context.unwatch) {
      await context.unwatch[mountpoint]();
    }
    context.unwatch = {};
    context.watching = false;
  };
  const runBatch = (items, commonOptions, cb) => {
    const batches = /* @__PURE__ */ new Map();
    const getBatch = (mount) => {
      let batch = batches.get(mount.base);
      if (!batch) {
        batch = {
          driver: mount.driver,
          base: mount.base,
          items: []
        };
        batches.set(mount.base, batch);
      }
      return batch;
    };
    for (const item of items) {
      const isStringItem = typeof item === "string";
      const key = normalizeKey$1(isStringItem ? item : item.key);
      const value = isStringItem ? undefined : item.value;
      const options2 = isStringItem || !item.options ? commonOptions : { ...commonOptions, ...item.options };
      const mount = getMount(key);
      getBatch(mount).items.push({
        key,
        value,
        relativeKey: mount.relativeKey,
        options: options2
      });
    }
    return Promise.all([...batches.values()].map((batch) => cb(batch))).then(
      (r) => r.flat()
    );
  };
  const storage = {
    // Item
    hasItem(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.hasItem, relativeKey, opts);
    },
    getItem(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => destr(value)
      );
    },
    getItems(items, commonOptions = {}) {
      return runBatch(items, commonOptions, (batch) => {
        if (batch.driver.getItems) {
          return asyncCall(
            batch.driver.getItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              options: item.options
            })),
            commonOptions
          ).then(
            (r) => r.map((item) => ({
              key: joinKeys(batch.base, item.key),
              value: destr(item.value)
            }))
          );
        }
        return Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.getItem,
              item.relativeKey,
              item.options
            ).then((value) => ({
              key: item.key,
              value: destr(value)
            }));
          })
        );
      });
    },
    getItemRaw(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.getItemRaw) {
        return asyncCall(driver.getItemRaw, relativeKey, opts);
      }
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => deserializeRaw(value)
      );
    },
    async setItem(key, value, opts = {}) {
      if (value === undefined) {
        return storage.removeItem(key);
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.setItem) {
        return;
      }
      await asyncCall(driver.setItem, relativeKey, stringify(value), opts);
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async setItems(items, commonOptions) {
      await runBatch(items, commonOptions, async (batch) => {
        if (batch.driver.setItems) {
          return asyncCall(
            batch.driver.setItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              value: stringify(item.value),
              options: item.options
            })),
            commonOptions
          );
        }
        if (!batch.driver.setItem) {
          return;
        }
        await Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.setItem,
              item.relativeKey,
              stringify(item.value),
              item.options
            );
          })
        );
      });
    },
    async setItemRaw(key, value, opts = {}) {
      if (value === undefined) {
        return storage.removeItem(key, opts);
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.setItemRaw) {
        await asyncCall(driver.setItemRaw, relativeKey, value, opts);
      } else if (driver.setItem) {
        await asyncCall(driver.setItem, relativeKey, serializeRaw(value), opts);
      } else {
        return;
      }
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async removeItem(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { removeMeta: opts };
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.removeItem) {
        return;
      }
      await asyncCall(driver.removeItem, relativeKey, opts);
      if (opts.removeMeta || opts.removeMata) {
        await asyncCall(driver.removeItem, relativeKey + "$", opts);
      }
      if (!driver.watch) {
        onChange("remove", key);
      }
    },
    // Meta
    async getMeta(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { nativeOnly: opts };
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      const meta = /* @__PURE__ */ Object.create(null);
      if (driver.getMeta) {
        Object.assign(meta, await asyncCall(driver.getMeta, relativeKey, opts));
      }
      if (!opts.nativeOnly) {
        const value = await asyncCall(
          driver.getItem,
          relativeKey + "$",
          opts
        ).then((value_) => destr(value_));
        if (value && typeof value === "object") {
          if (typeof value.atime === "string") {
            value.atime = new Date(value.atime);
          }
          if (typeof value.mtime === "string") {
            value.mtime = new Date(value.mtime);
          }
          Object.assign(meta, value);
        }
      }
      return meta;
    },
    setMeta(key, value, opts = {}) {
      return this.setItem(key + "$", value, opts);
    },
    removeMeta(key, opts = {}) {
      return this.removeItem(key + "$", opts);
    },
    // Keys
    async getKeys(base, opts = {}) {
      base = normalizeBaseKey(base);
      const mounts = getMounts(base, true);
      let maskedMounts = [];
      const allKeys = [];
      for (const mount of mounts) {
        const rawKeys = await asyncCall(
          mount.driver.getKeys,
          mount.relativeBase,
          opts
        );
        for (const key of rawKeys) {
          const fullKey = mount.mountpoint + normalizeKey$1(key);
          if (!maskedMounts.some((p) => fullKey.startsWith(p))) {
            allKeys.push(fullKey);
          }
        }
        maskedMounts = [
          mount.mountpoint,
          ...maskedMounts.filter((p) => !p.startsWith(mount.mountpoint))
        ];
      }
      return base ? allKeys.filter(
        (key) => key.startsWith(base) && key[key.length - 1] !== "$"
      ) : allKeys.filter((key) => key[key.length - 1] !== "$");
    },
    // Utils
    async clear(base, opts = {}) {
      base = normalizeBaseKey(base);
      await Promise.all(
        getMounts(base, false).map(async (m) => {
          if (m.driver.clear) {
            return asyncCall(m.driver.clear, m.relativeBase, opts);
          }
          if (m.driver.removeItem) {
            const keys = await m.driver.getKeys(m.relativeBase || "", opts);
            return Promise.all(
              keys.map((key) => m.driver.removeItem(key, opts))
            );
          }
        })
      );
    },
    async dispose() {
      await Promise.all(
        Object.values(context.mounts).map((driver) => dispose(driver))
      );
    },
    async watch(callback) {
      await startWatch();
      context.watchListeners.push(callback);
      return async () => {
        context.watchListeners = context.watchListeners.filter(
          (listener) => listener !== callback
        );
        if (context.watchListeners.length === 0) {
          await stopWatch();
        }
      };
    },
    async unwatch() {
      context.watchListeners = [];
      await stopWatch();
    },
    // Mount
    mount(base, driver) {
      base = normalizeBaseKey(base);
      if (base && context.mounts[base]) {
        throw new Error(`already mounted at ${base}`);
      }
      if (base) {
        context.mountpoints.push(base);
        context.mountpoints.sort((a, b) => b.length - a.length);
      }
      context.mounts[base] = driver;
      if (context.watching) {
        Promise.resolve(watch(driver, onChange, base)).then((unwatcher) => {
          context.unwatch[base] = unwatcher;
        }).catch(console.error);
      }
      return storage;
    },
    async unmount(base, _dispose = true) {
      base = normalizeBaseKey(base);
      if (!base || !context.mounts[base]) {
        return;
      }
      if (context.watching && base in context.unwatch) {
        context.unwatch[base]?.();
        delete context.unwatch[base];
      }
      if (_dispose) {
        await dispose(context.mounts[base]);
      }
      context.mountpoints = context.mountpoints.filter((key) => key !== base);
      delete context.mounts[base];
    },
    getMount(key = "") {
      key = normalizeKey$1(key) + ":";
      const m = getMount(key);
      return {
        driver: m.driver,
        base: m.base
      };
    },
    getMounts(base = "", opts = {}) {
      base = normalizeKey$1(base);
      const mounts = getMounts(base, opts.parents);
      return mounts.map((m) => ({
        driver: m.driver,
        base: m.mountpoint
      }));
    },
    // Aliases
    keys: (base, opts = {}) => storage.getKeys(base, opts),
    get: (key, opts = {}) => storage.getItem(key, opts),
    set: (key, value, opts = {}) => storage.setItem(key, value, opts),
    has: (key, opts = {}) => storage.hasItem(key, opts),
    del: (key, opts = {}) => storage.removeItem(key, opts),
    remove: (key, opts = {}) => storage.removeItem(key, opts)
  };
  return storage;
}
function watch(driver, onChange, base) {
  return driver.watch ? driver.watch((event, key) => onChange(event, base + key)) : () => {
  };
}
async function dispose(driver) {
  if (typeof driver.dispose === "function") {
    await asyncCall(driver.dispose);
  }
}

const _assets = {

};

const normalizeKey = function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
};

const assets = {
  getKeys() {
    return Promise.resolve(Object.keys(_assets))
  },
  hasItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(id in _assets)
  },
  getItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].import() : null)
  },
  getMeta (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].meta : {})
  }
};

function defineDriver(factory) {
  return factory;
}
function createError(driver, message, opts) {
  const err = new Error(`[unstorage] [${driver}] ${message}`, opts);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(err, createError);
  }
  return err;
}
function createRequiredError(driver, name) {
  if (Array.isArray(name)) {
    return createError(
      driver,
      `Missing some of the required options ${name.map((n) => "`" + n + "`").join(", ")}`
    );
  }
  return createError(driver, `Missing required option \`${name}\`.`);
}

function ignoreNotfound(err) {
  return err.code === "ENOENT" || err.code === "EISDIR" ? null : err;
}
function ignoreExists(err) {
  return err.code === "EEXIST" ? null : err;
}
async function writeFile(path, data, encoding) {
  await ensuredir(dirname$1(path));
  return promises.writeFile(path, data, encoding);
}
function readFile(path, encoding) {
  return promises.readFile(path, encoding).catch(ignoreNotfound);
}
function unlink(path) {
  return promises.unlink(path).catch(ignoreNotfound);
}
function readdir(dir) {
  return promises.readdir(dir, { withFileTypes: true }).catch(ignoreNotfound).then((r) => r || []);
}
async function ensuredir(dir) {
  if (existsSync(dir)) {
    return;
  }
  await ensuredir(dirname$1(dir)).catch(ignoreExists);
  await promises.mkdir(dir).catch(ignoreExists);
}
async function readdirRecursive(dir, ignore) {
  if (ignore && ignore(dir)) {
    return [];
  }
  const entries = await readdir(dir);
  const files = [];
  await Promise.all(
    entries.map(async (entry) => {
      const entryPath = resolve$1(dir, entry.name);
      if (entry.isDirectory()) {
        const dirFiles = await readdirRecursive(entryPath, ignore);
        files.push(...dirFiles.map((f) => entry.name + "/" + f));
      } else {
        if (!(ignore && ignore(entry.name))) {
          files.push(entry.name);
        }
      }
    })
  );
  return files;
}
async function rmRecursive(dir) {
  const entries = await readdir(dir);
  await Promise.all(
    entries.map((entry) => {
      const entryPath = resolve$1(dir, entry.name);
      if (entry.isDirectory()) {
        return rmRecursive(entryPath).then(() => promises.rmdir(entryPath));
      } else {
        return promises.unlink(entryPath);
      }
    })
  );
}

const PATH_TRAVERSE_RE = /\.\.:|\.\.$/;
const DRIVER_NAME = "fs-lite";
const unstorage_47drivers_47fs_45lite = defineDriver((opts = {}) => {
  if (!opts.base) {
    throw createRequiredError(DRIVER_NAME, "base");
  }
  opts.base = resolve$1(opts.base);
  const r = (key) => {
    if (PATH_TRAVERSE_RE.test(key)) {
      throw createError(
        DRIVER_NAME,
        `Invalid key: ${JSON.stringify(key)}. It should not contain .. segments`
      );
    }
    const resolved = join(opts.base, key.replace(/:/g, "/"));
    return resolved;
  };
  return {
    name: DRIVER_NAME,
    options: opts,
    hasItem(key) {
      return existsSync(r(key));
    },
    getItem(key) {
      return readFile(r(key), "utf8");
    },
    getItemRaw(key) {
      return readFile(r(key));
    },
    async getMeta(key) {
      const { atime, mtime, size, birthtime, ctime } = await promises.stat(r(key)).catch(() => ({}));
      return { atime, mtime, size, birthtime, ctime };
    },
    setItem(key, value) {
      if (opts.readOnly) {
        return;
      }
      return writeFile(r(key), value, "utf8");
    },
    setItemRaw(key, value) {
      if (opts.readOnly) {
        return;
      }
      return writeFile(r(key), value);
    },
    removeItem(key) {
      if (opts.readOnly) {
        return;
      }
      return unlink(r(key));
    },
    getKeys() {
      return readdirRecursive(r("."), opts.ignore);
    },
    async clear() {
      if (opts.readOnly || opts.noClear) {
        return;
      }
      await rmRecursive(r("."));
    }
  };
});

const storage = createStorage({});

storage.mount('/assets', assets);

storage.mount('data', unstorage_47drivers_47fs_45lite({"driver":"fsLite","base":"C:\\Users\\djedi\\Documents\\.vscode\\Portfolio\\.data\\kv"}));

function useStorage(base = "") {
  return base ? prefixStorage(storage, base) : storage;
}

function defaultCacheOptions() {
  return {
    name: "_",
    base: "/cache",
    swr: true,
    maxAge: 1
  };
}
function defineCachedFunction(fn, opts = {}) {
  opts = { ...defaultCacheOptions(), ...opts };
  const pending = {};
  const group = opts.group || "nitro/functions";
  const name = opts.name || fn.name || "_";
  const integrity = opts.integrity || hash([fn, opts]);
  const validate = opts.validate || ((entry) => entry.value !== undefined);
  async function get(key, resolver, shouldInvalidateCache, event) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    let entry = await useStorage().getItem(cacheKey).catch((error) => {
      console.error(`[nitro] [cache] Cache read error.`, error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }) || {};
    if (typeof entry !== "object") {
      entry = {};
      const error = new Error("Malformed data read from cache.");
      console.error("[nitro] [cache]", error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }
    const ttl = (opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || validate(entry) === false;
    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== undefined && (opts.staleMaxAge || 0) >= 0 && opts.swr === false) {
          entry.value = undefined;
          entry.integrity = undefined;
          entry.mtime = undefined;
          entry.expires = undefined;
        }
        pending[key] = Promise.resolve(resolver());
      }
      try {
        entry.value = await pending[key];
      } catch (error) {
        if (!isPending) {
          delete pending[key];
        }
        throw error;
      }
      if (!isPending) {
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry) !== false) {
          let setOpts;
          if (opts.maxAge && !opts.swr) {
            setOpts = { ttl: opts.maxAge };
          }
          const promise = useStorage().setItem(cacheKey, entry, setOpts).catch((error) => {
            console.error(`[nitro] [cache] Cache write error.`, error);
            useNitroApp().captureError(error, { event, tags: ["cache"] });
          });
          if (event?.waitUntil) {
            event.waitUntil(promise);
          }
        }
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (entry.value === undefined) {
      await _resolvePromise;
    } else if (expired && event && event.waitUntil) {
      event.waitUntil(_resolvePromise);
    }
    if (opts.swr && validate(entry) !== false) {
      _resolvePromise.catch((error) => {
        console.error(`[nitro] [cache] SWR handler error.`, error);
        useNitroApp().captureError(error, { event, tags: ["cache"] });
      });
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = await opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = await opts.shouldInvalidateCache?.(...args);
    const entry = await get(
      key,
      () => fn(...args),
      shouldInvalidateCache,
      args[0] && isEvent(args[0]) ? args[0] : undefined
    );
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
function cachedFunction(fn, opts = {}) {
  return defineCachedFunction(fn, opts);
}
function getKey(...args) {
  return args.length > 0 ? hash(args, {}) : "";
}
function escapeKey(key) {
  return String(key).replace(/\W/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions()) {
  const variableHeaderNames = (opts.varies || []).filter(Boolean).map((h) => h.toLowerCase()).sort();
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const customKey = await opts.getKey?.(event);
      if (customKey) {
        return escapeKey(customKey);
      }
      const _path = event.node.req.originalUrl || event.node.req.url || event.path;
      let _pathname;
      try {
        _pathname = escapeKey(decodeURI(parseURL(_path).pathname)).slice(0, 16) || "index";
      } catch {
        _pathname = "-";
      }
      const _hashedPath = `${_pathname}.${hash(_path)}`;
      const _headers = variableHeaderNames.map((header) => [header, event.node.req.headers[header]]).map(([name, value]) => `${escapeKey(name)}.${hash(value)}`);
      return [_hashedPath, ..._headers].join(":");
    },
    validate: (entry) => {
      if (!entry.value) {
        return false;
      }
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === undefined) {
        return false;
      }
      if (entry.value.headers.etag === "undefined" || entry.value.headers["last-modified"] === "undefined") {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: opts.integrity || hash([handler, opts])
  };
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const variableHeaders = {};
      for (const header of variableHeaderNames) {
        const value = incomingEvent.node.req.headers[header];
        if (value !== undefined) {
          variableHeaders[header] = value;
        }
      }
      const reqProxy = cloneWithProxy(incomingEvent.node.req, {
        headers: variableHeaders
      });
      const resHeaders = {};
      let _resSendBody;
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
        statusCode: 200,
        writableEnded: false,
        writableFinished: false,
        headersSent: false,
        closed: false,
        getHeader(name) {
          return resHeaders[name];
        },
        setHeader(name, value) {
          resHeaders[name] = value;
          return this;
        },
        getHeaderNames() {
          return Object.keys(resHeaders);
        },
        hasHeader(name) {
          return name in resHeaders;
        },
        removeHeader(name) {
          delete resHeaders[name];
        },
        getHeaders() {
          return resHeaders;
        },
        end(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        write(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2(undefined);
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return true;
        },
        writeHead(statusCode, headers2) {
          this.statusCode = statusCode;
          if (headers2) {
            if (Array.isArray(headers2) || typeof headers2 === "string") {
              throw new TypeError("Raw headers  is not supported.");
            }
            for (const header in headers2) {
              const value = headers2[header];
              if (value !== undefined) {
                this.setHeader(
                  header,
                  value
                );
              }
            }
          }
          return this;
        }
      });
      const event = createEvent(reqProxy, resProxy);
      event.fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: useNitroApp().localFetch
      });
      event.$fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: globalThis.$fetch
      });
      event.context = incomingEvent.context;
      event.context.cache = {
        options: _opts
      };
      const body = await handler(event) || _resSendBody;
      const headers = event.node.res.getHeaders();
      headers.etag = String(
        headers.Etag || headers.etag || `W/"${hash(body)}"`
      );
      headers["last-modified"] = String(
        headers["Last-Modified"] || headers["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString()
      );
      const cacheControl = [];
      if (opts.swr) {
        if (opts.maxAge) {
          cacheControl.push(`s-maxage=${opts.maxAge}`);
        }
        if (opts.staleMaxAge) {
          cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
        } else {
          cacheControl.push("stale-while-revalidate");
        }
      } else if (opts.maxAge) {
        cacheControl.push(`max-age=${opts.maxAge}`);
      }
      if (cacheControl.length > 0) {
        headers["cache-control"] = cacheControl.join(", ");
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      };
      return cacheEntry;
    },
    _opts
  );
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(
      event
    );
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.node.res.statusCode = response.code;
    for (const name in response.headers) {
      const value = response.headers[name];
      if (name === "set-cookie") {
        event.node.res.appendHeader(
          name,
          splitCookiesString(value)
        );
      } else {
        if (value !== undefined) {
          event.node.res.setHeader(name, value);
        }
      }
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

function defineRenderHandler(render) {
  const runtimeConfig = useRuntimeConfig();
  return eventHandler(async (event) => {
    const nitroApp = useNitroApp();
    const ctx = { event, render, response: undefined };
    await nitroApp.hooks.callHook("render:before", ctx);
    if (!ctx.response) {
      if (event.path === `${runtimeConfig.app.baseURL}favicon.ico`) {
        setResponseHeader(event, "Content-Type", "image/x-icon");
        return send(
          event,
          "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        );
      }
      ctx.response = await ctx.render(event);
      if (!ctx.response) {
        const _currentStatus = getResponseStatus(event);
        setResponseStatus(event, _currentStatus === 200 ? 500 : _currentStatus);
        return send(
          event,
          "No response returned from render handler: " + event.path
        );
      }
    }
    await nitroApp.hooks.callHook("render:response", ctx.response, ctx);
    if (ctx.response.headers) {
      setResponseHeaders(event, ctx.response.headers);
    }
    if (ctx.response.statusCode || ctx.response.statusMessage) {
      setResponseStatus(
        event,
        ctx.response.statusCode,
        ctx.response.statusMessage
      );
    }
    return ctx.response.body;
  });
}

const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter$1({ routes: config.nitro.routeRules })
);
function createRouteRulesHandler(ctx) {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      let target = routeRules.redirect.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.redirect._redirectStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery$1(event.path);
        target = withQuery(target, query);
      }
      return sendRedirect(event, target, routeRules.redirect.statusCode);
    }
    if (routeRules.proxy) {
      let target = routeRules.proxy.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.proxy._proxyStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery$1(event.path);
        target = withQuery(target, query);
      }
      return proxyRequest(event, target, {
        fetch: ctx.localFetch,
        ...routeRules.proxy
      });
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(event.path.split("?")[0], useRuntimeConfig().app.baseURL)
    );
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

function createContext(opts = {}) {
  let currentInstance;
  let isSingleton = false;
  const checkConflict = (instance) => {
    if (currentInstance && currentInstance !== instance) {
      throw new Error("Context conflict");
    }
  };
  let als;
  if (opts.asyncContext) {
    const _AsyncLocalStorage = opts.AsyncLocalStorage || globalThis.AsyncLocalStorage;
    if (_AsyncLocalStorage) {
      als = new _AsyncLocalStorage();
    } else {
      console.warn("[unctx] `AsyncLocalStorage` is not provided.");
    }
  }
  const _getCurrentInstance = () => {
    if (als) {
      const instance = als.getStore();
      if (instance !== undefined) {
        return instance;
      }
    }
    return currentInstance;
  };
  return {
    use: () => {
      const _instance = _getCurrentInstance();
      if (_instance === undefined) {
        throw new Error("Context is not available");
      }
      return _instance;
    },
    tryUse: () => {
      return _getCurrentInstance();
    },
    set: (instance, replace) => {
      if (!replace) {
        checkConflict(instance);
      }
      currentInstance = instance;
      isSingleton = true;
    },
    unset: () => {
      currentInstance = undefined;
      isSingleton = false;
    },
    call: (instance, callback) => {
      checkConflict(instance);
      currentInstance = instance;
      try {
        return als ? als.run(instance, callback) : callback();
      } finally {
        if (!isSingleton) {
          currentInstance = undefined;
        }
      }
    },
    async callAsync(instance, callback) {
      currentInstance = instance;
      const onRestore = () => {
        currentInstance = instance;
      };
      const onLeave = () => currentInstance === instance ? onRestore : undefined;
      asyncHandlers.add(onLeave);
      try {
        const r = als ? als.run(instance, callback) : callback();
        if (!isSingleton) {
          currentInstance = void 0;
        }
        return await r;
      } finally {
        asyncHandlers.delete(onLeave);
      }
    }
  };
}
function createNamespace(defaultOpts = {}) {
  const contexts = {};
  return {
    get(key, opts = {}) {
      if (!contexts[key]) {
        contexts[key] = createContext({ ...defaultOpts, ...opts });
      }
      return contexts[key];
    }
  };
}
const _globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : {};
const globalKey = "__unctx__";
const defaultNamespace = _globalThis[globalKey] || (_globalThis[globalKey] = createNamespace());
const getContext = (key, opts = {}) => defaultNamespace.get(key, opts);
const asyncHandlersKey = "__unctx_async_handlers__";
const asyncHandlers = _globalThis[asyncHandlersKey] || (_globalThis[asyncHandlersKey] = /* @__PURE__ */ new Set());

function baseURL() {
  return useRuntimeConfig().app.baseURL;
}
function buildAssetsDir() {
  return useRuntimeConfig().app.buildAssetsDir;
}
function buildAssetsURL(...path) {
  return joinRelativeURL(publicAssetsURL(), buildAssetsDir(), ...path);
}
function publicAssetsURL(...path) {
  const app = useRuntimeConfig().app;
  const publicBase = app.cdnURL || app.baseURL;
  return path.length ? joinRelativeURL(publicBase, ...path) : publicBase;
}

const _VSNWbu = lazyEventHandler(() => {
  const opts = useRuntimeConfig().ipx || {};
  const fsDir = opts?.fs?.dir ? (Array.isArray(opts.fs.dir) ? opts.fs.dir : [opts.fs.dir]).map((dir) => isAbsolute(dir) ? dir : fileURLToPath(new URL(dir, globalThis._importMeta_.url))) : undefined;
  const fsStorage = opts.fs?.dir ? ipxFSStorage({ ...opts.fs, dir: fsDir }) : undefined;
  const httpStorage = opts.http?.domains ? ipxHttpStorage({ ...opts.http }) : undefined;
  if (!fsStorage && !httpStorage) {
    throw new Error("IPX storage is not configured!");
  }
  const ipxOptions = {
    ...opts,
    storage: fsStorage || httpStorage,
    httpStorage
  };
  const ipx = createIPX(ipxOptions);
  const ipxHandler = createIPXH3Handler(ipx);
  return useBase(opts.baseURL, ipxHandler);
});

const _lazy_J1BZl5 = () => import('../routes/api/news.mjs');
const _lazy_xdUejA = () => import('../routes/api/send-mail.mjs');
const _lazy_Z8gmGm = () => import('../routes/renderer.mjs');

const handlers = [
  { route: '', handler: _ToOWU7, lazy: false, middleware: true, method: undefined },
  { route: '/api/news', handler: _lazy_J1BZl5, lazy: true, middleware: false, method: undefined },
  { route: '/api/send-mail', handler: _lazy_xdUejA, lazy: true, middleware: false, method: undefined },
  { route: '/__nuxt_error', handler: _lazy_Z8gmGm, lazy: true, middleware: false, method: undefined },
  { route: '/_ipx/**', handler: _VSNWbu, lazy: false, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_Z8gmGm, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const captureError = (error, context = {}) => {
    const promise = hooks.callHookParallel("error", error, context).catch((error_) => {
      console.error("Error while capturing another error", error_);
    });
    if (context.event && isEvent(context.event)) {
      const errors = context.event.context.nitro?.errors;
      if (errors) {
        errors.push({ error, context });
      }
      if (context.event.waitUntil) {
        context.event.waitUntil(promise);
      }
    }
  };
  const h3App = createApp({
    debug: destr(false),
    onError: (error, event) => {
      captureError(error, { event, tags: ["request"] });
      return errorHandler(error, event);
    },
    onRequest: async (event) => {
      await nitroApp.hooks.callHook("request", event).catch((error) => {
        captureError(error, { event, tags: ["request"] });
      });
    },
    onBeforeResponse: async (event, response) => {
      await nitroApp.hooks.callHook("beforeResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    },
    onAfterResponse: async (event, response) => {
      await nitroApp.hooks.callHook("afterResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    }
  });
  const router = createRouter({
    preemptive: true
  });
  const localCall = createCall(toNodeListener(h3App));
  const _localFetch = createFetch(localCall, globalThis.fetch);
  const localFetch = (input, init) => _localFetch(input, init).then(
    (response) => normalizeFetchResponse(response)
  );
  const $fetch = createFetch$1({
    fetch: localFetch,
    Headers: Headers$1,
    defaults: { baseURL: config.app.baseURL }
  });
  globalThis.$fetch = $fetch;
  h3App.use(createRouteRulesHandler({ localFetch }));
  h3App.use(
    eventHandler((event) => {
      event.context.nitro = event.context.nitro || { errors: [] };
      const envContext = event.node.req?.__unenv__;
      if (envContext) {
        Object.assign(event.context, envContext);
      }
      event.fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: localFetch });
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, {
        fetch: $fetch
      });
      event.waitUntil = (promise) => {
        if (!event.context.nitro._waitUntilPromises) {
          event.context.nitro._waitUntilPromises = [];
        }
        event.context.nitro._waitUntilPromises.push(promise);
        if (envContext?.waitUntil) {
          envContext.waitUntil(promise);
        }
      };
      event.captureError = (error, context) => {
        captureError(error, { event, ...context });
      };
    })
  );
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(
        /\/+/g,
        "/"
      );
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, "_")
      );
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router.handler);
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch,
    captureError
  };
  return app;
}
function runNitroPlugins(nitroApp2) {
  for (const plugin of plugins) {
    try {
      plugin(nitroApp2);
    } catch (error) {
      nitroApp2.captureError(error, { tags: ["plugin"] });
      throw error;
    }
  }
}
const nitroApp = createNitroApp();
function useNitroApp() {
  return nitroApp;
}
runNitroPlugins(nitroApp);

const debug = (...args) => {
};
function GracefulShutdown(server, opts) {
  opts = opts || {};
  const options = Object.assign(
    {
      signals: "SIGINT SIGTERM",
      timeout: 3e4,
      development: false,
      forceExit: true,
      onShutdown: (signal) => Promise.resolve(signal),
      preShutdown: (signal) => Promise.resolve(signal)
    },
    opts
  );
  let isShuttingDown = false;
  const connections = {};
  let connectionCounter = 0;
  const secureConnections = {};
  let secureConnectionCounter = 0;
  let failed = false;
  let finalRun = false;
  function onceFactory() {
    let called = false;
    return (emitter, events, callback) => {
      function call() {
        if (!called) {
          called = true;
          return Reflect.apply(callback, this, arguments);
        }
      }
      for (const e of events) {
        emitter.on(e, call);
      }
    };
  }
  const signals = options.signals.split(" ").map((s) => s.trim()).filter((s) => s.length > 0);
  const once = onceFactory();
  once(process, signals, (signal) => {
    shutdown(signal).then(() => {
      if (options.forceExit) {
        process.exit(failed ? 1 : 0);
      }
    }).catch((error) => {
      process.exit(1);
    });
  });
  function isFunction(functionToCheck) {
    const getType = Object.prototype.toString.call(functionToCheck);
    return /^\[object\s([A-Za-z]+)?Function]$/.test(getType);
  }
  function destroy(socket, force = false) {
    if (socket._isIdle && isShuttingDown || force) {
      socket.destroy();
      if (socket.server instanceof http.Server) {
        delete connections[socket._connectionId];
      } else {
        delete secureConnections[socket._connectionId];
      }
    }
  }
  function destroyAllConnections(force = false) {
    for (const key of Object.keys(connections)) {
      const socket = connections[key];
      const serverResponse = socket._httpMessage;
      if (serverResponse && !force) {
        if (!serverResponse.headersSent) {
          serverResponse.setHeader("connection", "close");
        }
      } else {
        destroy(socket);
      }
    }
    for (const key of Object.keys(secureConnections)) {
      const socket = secureConnections[key];
      const serverResponse = socket._httpMessage;
      if (serverResponse && !force) {
        if (!serverResponse.headersSent) {
          serverResponse.setHeader("connection", "close");
        }
      } else {
        destroy(socket);
      }
    }
  }
  server.on("request", (req, res) => {
    req.socket._isIdle = false;
    if (isShuttingDown && !res.headersSent) {
      res.setHeader("connection", "close");
    }
    res.on("finish", () => {
      req.socket._isIdle = true;
      destroy(req.socket);
    });
  });
  server.on("connection", (socket) => {
    if (isShuttingDown) {
      socket.destroy();
    } else {
      const id = connectionCounter++;
      socket._isIdle = true;
      socket._connectionId = id;
      connections[id] = socket;
      socket.once("close", () => {
        delete connections[socket._connectionId];
      });
    }
  });
  server.on("secureConnection", (socket) => {
    if (isShuttingDown) {
      socket.destroy();
    } else {
      const id = secureConnectionCounter++;
      socket._isIdle = true;
      socket._connectionId = id;
      secureConnections[id] = socket;
      socket.once("close", () => {
        delete secureConnections[socket._connectionId];
      });
    }
  });
  process.on("close", () => {
  });
  function shutdown(sig) {
    function cleanupHttp() {
      destroyAllConnections();
      return new Promise((resolve, reject) => {
        server.close((err) => {
          if (err) {
            return reject(err);
          }
          return resolve(true);
        });
      });
    }
    if (options.development) {
      return process.exit(0);
    }
    function finalHandler() {
      if (!finalRun) {
        finalRun = true;
        if (options.finally && isFunction(options.finally)) {
          options.finally();
        }
      }
      return Promise.resolve();
    }
    function waitForReadyToShutDown(totalNumInterval) {
      if (totalNumInterval === 0) {
        debug(
          `Could not close connections in time (${options.timeout}ms), will forcefully shut down`
        );
        return Promise.resolve(true);
      }
      const allConnectionsClosed = Object.keys(connections).length === 0 && Object.keys(secureConnections).length === 0;
      if (allConnectionsClosed) {
        return Promise.resolve(false);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(waitForReadyToShutDown(totalNumInterval - 1));
        }, 250);
      });
    }
    if (isShuttingDown) {
      return Promise.resolve();
    }
    return options.preShutdown(sig).then(() => {
      isShuttingDown = true;
      cleanupHttp();
    }).then(() => {
      const pollIterations = options.timeout ? Math.round(options.timeout / 250) : 0;
      return waitForReadyToShutDown(pollIterations);
    }).then((force) => {
      if (force) {
        destroyAllConnections(force);
      }
      return options.onShutdown(sig);
    }).then(finalHandler).catch((error) => {
      const errString = typeof error === "string" ? error : JSON.stringify(error);
      failed = true;
      throw errString;
    });
  }
  function shutdownManual() {
    return shutdown("manual");
  }
  return shutdownManual;
}

function getGracefulShutdownConfig() {
  return {
    disabled: !!process.env.NITRO_SHUTDOWN_DISABLED,
    signals: (process.env.NITRO_SHUTDOWN_SIGNALS || "SIGTERM SIGINT").split(" ").map((s) => s.trim()),
    timeout: Number.parseInt(process.env.NITRO_SHUTDOWN_TIMEOUT || "", 10) || 3e4,
    forceExit: !process.env.NITRO_SHUTDOWN_NO_FORCE_EXIT
  };
}
function setupGracefulShutdown(listener, nitroApp) {
  const shutdownConfig = getGracefulShutdownConfig();
  if (shutdownConfig.disabled) {
    return;
  }
  GracefulShutdown(listener, {
    signals: shutdownConfig.signals.join(" "),
    timeout: shutdownConfig.timeout,
    forceExit: shutdownConfig.forceExit,
    onShutdown: async () => {
      await new Promise((resolve) => {
        const timeout = setTimeout(() => {
          console.warn("Graceful shutdown timeout, force exiting...");
          resolve();
        }, shutdownConfig.timeout);
        nitroApp.hooks.callHook("close").catch((error) => {
          console.error(error);
        }).finally(() => {
          clearTimeout(timeout);
          resolve();
        });
      });
    }
  });
}

export { $fetch as $, withTrailingSlash as A, withoutTrailingSlash as B, toRouteMatcher as C, createRouter$1 as D, trapUnhandledNodeErrors as a, useNitroApp as b, defineEventHandler as c, destr as d, defineRenderHandler as e, buildAssetsURL as f, getQuery as g, createError$1 as h, getRouteRules as i, getResponseStatus as j, getResponseStatusText as k, baseURL as l, defu as m, parseQuery as n, createHooks as o, publicAssetsURL as p, hasProtocol as q, readBody as r, setupGracefulShutdown as s, toNodeListener as t, useRuntimeConfig as u, joinURL as v, getContext as w, isScriptProtocol as x, withQuery as y, sanitizeStatusCode as z };
//# sourceMappingURL=nitro.mjs.map
