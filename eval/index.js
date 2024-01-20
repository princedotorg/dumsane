(function (exports, commands, metro, plugin$2, ui) {
	'use strict';

	function mSendMessage(vendetta) {
	  const { metro: { findByProps, findByStoreName, common: { lodash: { merge } } } } = vendetta;
	  const Send = findByProps("_sendMessage");
	  const { createBotMessage } = findByProps("createBotMessage");
	  const Avatars = findByProps("BOT_AVATARS");
	  const { getChannelId: getFocusedChannelId } = findByStoreName("SelectedChannelStore");
	  return function(message, mod) {
	    message.channelId ??= getFocusedChannelId();
	    if ([
	      null,
	      void 0
	    ].includes(message.channelId))
	      throw new Error("No channel id to receive the message into (channelId)");
	    let msg = message;
	    if (message.really) {
	      if (typeof mod === "object")
	        msg = merge(msg, mod);
	      const args = [
	        msg,
	        {}
	      ];
	      args[0].tts ??= false;
	      for (const key of [
	        "allowedMentions",
	        "messageReference"
	      ]) {
	        if (key in args[0]) {
	          args[1][key] = args[0][key];
	          delete args[0][key];
	        }
	      }
	      const overwriteKey = "overwriteSendMessageArg2";
	      if (overwriteKey in args[0]) {
	        args[1] = args[0][overwriteKey];
	        delete args[0][overwriteKey];
	      }
	      return Send._sendMessage(message.channelId, ...args);
	    }
	    if (mod !== true)
	      msg = createBotMessage(msg);
	    if (typeof mod === "object") {
	      msg = merge(msg, mod);
	      if (typeof mod.author === "object")
	        (function processAvatarURL() {
	          const author = mod.author;
	          if (typeof author.avatarURL === "string") {
	            Avatars.BOT_AVATARS[author.avatar ?? author.avatarURL] = author.avatarURL;
	            author.avatar ??= author.avatarURL;
	            delete author.avatarURL;
	          }
	        })();
	    }
	    Send.receiveMessage(msg.channel_id, msg);
	    return msg;
	  };
	}

	const ZWD = "\u200D", Promise_UNMINIFIED_PROPERTY_NAMES = [
	  "_deferredState",
	  "_state",
	  "_value",
	  "_deferreds"
	], PROMISE_STATE_NAMES = {
	  0: "pending",
	  1: "fulfilled",
	  2: "rejected",
	  3: "adopted"
	};
	function codeblock(text) {
	  let language = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", escape = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
	  if (!text)
	    throw new Error("No text to wrap in a codeblock provided");
	  if (escape)
	    text = text.replaceAll("```", `\`${ZWD}\`\``);
	  return `\`\`\`${language}
${text}
\`\`\``;
	}
	function cmdDisplays(obj, translations, locale) {
	  if (!obj?.name || !obj?.description)
	    throw new Error(`No name(${obj?.name}) or description(${obj?.description}) in the passed command (command name: ${obj?.name})`);
	  obj.displayName ??= translations?.names?.[locale] ?? obj.name;
	  obj.displayDescription ??= translations?.names?.[locale] ?? obj.description;
	  if (obj.options) {
	    if (!Array.isArray(obj.options))
	      throw new Error(`Options is not an array (received: ${typeof obj.options})`);
	    for (var optionIndex = 0; optionIndex < obj.options.length; optionIndex++) {
	      const option = obj.options[optionIndex];
	      if (!option?.name || !option?.description)
	        throw new Error(`No name(${option?.name}) or description(${option?.description} in the option with index ${optionIndex}`);
	      option.displayName ??= translations?.options?.[optionIndex]?.names?.[locale] ?? option.name;
	      option.displayDescription ??= translations?.options?.[optionIndex]?.descriptions?.[locale] ?? option.description;
	      if (option?.choices) {
	        if (!Array.isArray(option?.choices))
	          throw new Error(`Choices is not an array (received: ${typeof option.choices})`);
	        for (var choiceIndex = 0; choiceIndex < option.choices.length; choiceIndex++) {
	          const choice = option.choices[choiceIndex];
	          if (!choice?.name)
	            throw new Error(`No name of choice with index ${choiceIndex} in option with index ${optionIndex}`);
	          choice.displayName ??= translations?.options?.[optionIndex]?.choices?.[choiceIndex]?.names?.[locale] ?? choice.name;
	        }
	      }
	    }
	  }
	  return obj;
	}
	function generateRandomString(chars) {
	  let length = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 27;
	  if (typeof chars !== "string")
	    throw new Error("Passed chars isn't a string");
	  if (chars?.length <= 0)
	    throw new Error("Invalid chars length");
	  let result = "";
	  for (let i = 0; i < length; i++)
	    result += chars[Math.floor(Math.random() * chars.length)];
	  return result;
	}
	function areArraysEqual(arr1, arr2) {
	  if (arr1.length !== arr2.length)
	    return false;
	  for (let i = 0; i < arr1.length; i++) {
	    const item1 = arr1[i];
	    const item2 = arr2[i];
	    if (Array.isArray(item1) && Array.isArray(item2)) {
	      if (!areArraysEqual(item1, item2))
	        return false;
	    } else if (item1 !== null && item2 !== null && typeof item1 === "object" && typeof item2 === "object") {
	      if (!areArraysEqual(Object.values(item1), Object.values(item2)))
	        return false;
	    } else if (item1 !== item2) {
	      return false;
	    }
	  }
	  return true;
	}
	function cloneWithout(value, without, replace) {
	  if (typeof value !== "object")
	    return value;
	  if (without.some(function($) {
	    return Array.isArray($) ? Array.isArray(value) ? areArraysEqual($, value) : false : $ === value;
	  }))
	    return replace;
	  const newObj = Array.isArray(value) ? [] : {};
	  for (const key in value) {
	    if (Array.isArray(value[key])) {
	      newObj[key] = cloneWithout(value[key], without, replace);
	    } else if (without.includes(value[key])) {
	      newObj[key] = replace;
	    } else {
	      newObj[key] = cloneWithout(value[key], without, replace);
	    }
	  }
	  return newObj;
	}
	async function awaitPromise(promiseFn) {
	  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	    args[_key - 1] = arguments[_key];
	  }
	  let output = [
	    null,
	    null
	  ];
	  try {
	    output[0] = await promiseFn(...args);
	  } catch (error) {
	    output[1] = error;
	  }
	  return output;
	}
	function processRows(rows) {
	  if (!Array.isArray(rows) || !rows.every(function(row) {
	    return Array.isArray(row) && typeof row[0] === "string";
	  }))
	    return JSON.stringify(rows);
	  return rows.sort(function(param, param1) {
	    let [a] = param, [b] = param1;
	    return a.length - b.length || a.localeCompare(b);
	  }).map(function(row) {
	    return row[0] === "" ? row[1] : row.join("\u2236 ");
	  }).join("\n");
	}
	function fixPromiseProps(improperPromise) {
	  let mutate = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false, removeOldKeys = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
	  const originalKeys = Object.getOwnPropertyNames(improperPromise);
	  if (originalKeys.length !== 4 || originalKeys.every(function(name, i) {
	    return Promise_UNMINIFIED_PROPERTY_NAMES[i] === name;
	  }))
	    throw new Error("The passed promise is already proper or isn't a promise");
	  let properPromise = {};
	  if (mutate)
	    properPromise = improperPromise;
	  Promise_UNMINIFIED_PROPERTY_NAMES.forEach(function(name, i) {
	    properPromise[name] = improperPromise[originalKeys[i]];
	    if (mutate && removeOldKeys)
	      delete properPromise[originalKeys[i]];
	  });
	  Object.setPrototypeOf(properPromise, improperPromise.__proto__);
	  return properPromise;
	}
	function prettyTypeof(value) {
	  const name = [
	    value?.constructor?.name
	  ];
	  name[0] ??= "Undefined";
	  if (name[0] === "Promise" && Object.getOwnPropertyNames(value).length === 4) {
	    const state = value["_state"] ?? value[Object.getOwnPropertyNames(value)[1]];
	    const stateName = PROMISE_STATE_NAMES[state];
	    if (stateName)
	      name[1] = `(${stateName})`;
	  } else if (name[0] !== "Undefined" && value?.prototype?.constructor === value && typeof value === "function") {
	    name[0] = "Class";
	    name[1] = `(${value.name})`;
	  } else if (value === null) {
	    name[1] = `(null)`;
	  } else if ([
	    "symbol",
	    "function"
	  ].includes(typeof value) && value?.name) {
	    name[1] = `(${value.name})`;
	  } else if (typeof value === "boolean") {
	    name[1] = `(${value})`;
	  } else if (typeof value === "string") {
	    name[1] = `(len: ${value.length})`;
	  } else if (typeof value === "number" && value !== 0) {
	    const expo = value.toExponential();
	    if (!expo.endsWith("e+1") && !expo.endsWith("e+0"))
	      name[1] = `(${expo})`;
	  } else if (Array.isArray(value)) {
	    if (value.length !== 0)
	      name[1] = `(len: ${value.length})`;
	  }
	  return name.join(" ");
	}
	function makeDefaults(object, defaults) {
	  if (object === void 0)
	    throw new Error("No object passed to make defaults for");
	  if (defaults === void 0)
	    throw new Error("No defaults object passed to make defaults off of");
	  for (const key in defaults) {
	    if (typeof defaults[key] === "object" && !Array.isArray(defaults[key])) {
	      if (typeof object[key] !== "object")
	        object[key] = {};
	      makeDefaults(object[key], defaults[key]);
	    } else {
	      object[key] ??= defaults[key];
	    }
	  }
	  return object;
	}
	const EMOJIS = {
	  getLoading() {
	    return Math.random() < 0.01 ? this.aol : this.loadingDiscordSpinner;
	  },
	  getFailure() {
	    return Math.random() < 0.01 ? this.fuckyoy : this.linuth;
	  },
	  getSuccess() {
	    return "";
	  },
	  loadingDiscordSpinner: "a:loading:1105495814073229393",
	  aol: "a:aol:1108834296359301161",
	  linuth: ":linuth:1110531631409811547",
	  fuckyoy: ":fuckyoy:1108360628302782564"
	};
	const AVATARS = {
	  command: "https://cdn.discordapp.com/attachments/1099116247364407337/1112129955053187203/command.png"
	};
	function rng(min, max) {
	  let precision = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0;
	  if (typeof min !== "number" || isNaN(min)) {
	    throw new Error("Invalid first argument, minimum: expected a number");
	  }
	  if (typeof max !== "number" || isNaN(max)) {
	    throw new Error("Invalid second argument, maximum: expected a number");
	  }
	  if (typeof precision !== "number" || precision < 0) {
	    throw new Error("Invalid third argument, precision: expected a positive number");
	  }
	  if (precision > 13) {
	    throw new Error("Invalid third argument, precision: expected a number < 13");
	  }
	  if (precision !== 0 && precision % 1 !== 0) {
	    throw new Error("Invalid third argument, precision: expected an integer");
	  }
	  const maxPrecision = Math.max((max.toString().split(".")[1] || "").length, (min.toString().split(".")[1] || "").length);
	  const computedPrecision = typeof precision === "number" ? precision : maxPrecision;
	  return parseFloat((Math.random() * (max - min) + min).toFixed(computedPrecision));
	}

	var common = /*#__PURE__*/Object.freeze({
		__proto__: null,
		AVATARS: AVATARS,
		EMOJIS: EMOJIS,
		PROMISE_STATE_NAMES: PROMISE_STATE_NAMES,
		Promise_UNMINIFIED_PROPERTY_NAMES: Promise_UNMINIFIED_PROPERTY_NAMES,
		ZWD: ZWD,
		areArraysEqual: areArraysEqual,
		awaitPromise: awaitPromise,
		cloneWithout: cloneWithout,
		cmdDisplays: cmdDisplays,
		codeblock: codeblock,
		fixPromiseProps: fixPromiseProps,
		generateRandomString: generateRandomString,
		mSendMessage: mSendMessage,
		makeDefaults: makeDefaults,
		prettyTypeof: prettyTypeof,
		processRows: processRows,
		rng: rng
	});

	const AsyncFunction = async function() {
	}.constructor;
	async function evaluate(code) {
	  let aweight = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true, global = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false, that = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
	  if (!code)
	    throw new Error("No code to evaluate");
	  let result, errored = false, timings = [
	    +new Date()
	  ];
	  const args = [];
	  if (!global)
	    args.push(...Object.keys(that));
	  let evalFunction = new AsyncFunction(...args, code);
	  Object.keys(that).forEach(function(name, index) {
	    args[index] = that[name];
	  });
	  try {
	    if (aweight) {
	      result = await evalFunction(...args);
	    } else {
	      result = evalFunction(...args);
	    }
	  } catch (e) {
	    result = e;
	    errored = true;
	  }
	  timings[1] = +new Date();
	  const res = {
	    result,
	    errored,
	    timings
	  };
	  return res;
	}
	evaluate.SENSITIVE_PROPS = {
	  USER: [
	    "email",
	    "phone",
	    "mfaEnabled",
	    "hasBouncedEmail"
	  ]
	};

	const { inspect } = metro.findByProps("inspect"), authorMods = {
	  author: {
	    username: "eval",
	    avatar: "command",
	    avatarURL: AVATARS.command
	  }
	}, BUILTIN_AUTORUN_TYPES = [
	  "autorun_before",
	  "autorun_after",
	  "plugin_after_defaults",
	  "plugin_after_exports",
	  "plugin_onUnload",
	  "plugin_onLoad",
	  "command_before",
	  "command_after_interaction_def",
	  "command_before_return",
	  "command_after",
	  "command_autocomplete_before",
	  "command_autocomplete_after",
	  "evaluate_before",
	  "evaluate_after"
	];
	function addAutorun(type2, customId, code2) {
	  let options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
	  const { autoruns: autoruns2, settings: { output: { error: { stack } } } } = plugin$2.storage;
	  if (!BUILTIN_AUTORUN_TYPES.includes(type2)) {
	    const e = new Error(`Type "${type2}" is invalid${stack.enabled ? "" : ". Enable error stack to see valid types"}`);
	    throw e.valid_types = [
	      "1",
	      "666"
	    ], e;
	  }
	  if (typeof customId === "object")
	    throw new Error("customId must not be the type of object");
	  if (customId === "random")
	    customId = rng(0, 1e6, 0);
	  if (autoruns2.filter(function($) {
	    return !$.builtin;
	  }).find(function(a) {
	    return a.customId === customId;
	  }))
	    throw new Error(`Custom id "${customId}" is already being used, please use a different one`);
	  if (!code2 || typeof code2 !== "string")
	    throw new Error("Invalid code passed");
	  if (options.once !== void 0 && ![
	    true,
	    false,
	    1
	  ].includes(options.once))
	    throw new Error("options.once must be a boolean or a 1");
	  const newAutorun = {
	    createdAt: +new Date(),
	    name: options?.name,
	    description: options?.description,
	    enabled: options?.enabled ?? false,
	    customId,
	    once: options?.once ?? false,
	    type: type2,
	    code: code2
	  };
	  autoruns2.push(newAutorun);
	  return newAutorun;
	}
	function deleteAutorun(autorun, builtin) {
	  let aruns = plugin$2.storage.autoruns;
	  if (builtin)
	    aruns = aruns.filter(function($) {
	      return !$.builtin;
	    });
	  const autorunFound = aruns.find(function(a) {
	    return a.customId === (typeof autorun === "object") ? autorun?.customId : autorun;
	  });
	  if (!autorunFound) {
	    const e = new Error("Autorun not found");
	    throw e.autorun = autorun, e.autorunFound = autorunFound, e;
	  }
	  plugin$2.storage.autoruns = aruns.filter(function($) {
	    return $.customId !== autorunFound.customId;
	  });
	}
	function triggerAutorun(type, fn) {
	  if (plugin$2.storage.settings.autoruns.enabled === false)
	    return;
	  if ([
	    "autorun_before",
	    "autorun_after"
	  ].includes(type))
	    return;
	  triggerAutorun("autorun_before", function(code) {
	    return eval(code);
	  });
	  const optimizations = plugin$2.storage["settings"]["autoruns"]["optimizations"];
	  let autoruns = plugin$2.storage["autoruns"];
	  if (optimizations)
	    autoruns = autoruns.filter(function($) {
	      return $.type === type;
	    });
	  autoruns = autoruns.filter(function($) {
	    return $.enabled;
	  });
	  let index = 0;
	  for (const autorun of autoruns) {
	    try {
	      if (!optimizations && autorun.type !== type) {
	        index++;
	        continue;
	      }
	      fn(autorun.code);
	      plugin$2.storage["stats"]["autoruns"][autorun.type] ??= 0;
	      plugin$2.storage["stats"]["autoruns"][autorun.type]++;
	      autorun.runs ??= 0;
	      autorun.runs++;
	      if (autorun.once === true) {
	        autorun.enabled = false;
	      } else if (autorun.once === 1) {
	        autorun.deleting = true;
	        autorun.enabled = false;
	      }
	    } catch (e) {
	      e.message = `Failed to execute autorun ${autorun.name ?? "No Name"} (${index}${optimizations ? ", optimized" : ""}). ` + e.message;
	      console.error(e);
	      console.log(e.stack);
	    }
	    index++;
	  }
	  triggerAutorun("autorun_after", function(code) {
	    return eval(code);
	  });
	}
	makeDefaults(plugin$2.storage, {
	  autoruns: [
	    {
	      createdAt: +new Date(),
	      name: "example autorun",
	      description: "Example autorun, for more autorun types >> return util.BUILTIN_AUTORUN_TYPES",
	      enabled: false,
	      customId: 0,
	      once: false,
	      type: "plugin_onLoad",
	      code: `alert("plugin_onLoad
to disable this popup, run: /"+plugin.storage.settings.command.name+" code:plugin.storage.autoruns.find(a => a.name === "example autorun").enabled = false")`
	    },
	    {
	      builtin: true,
	      createdAt: +new Date(),
	      name: "Filter 'deleting' autoruns",
	      description: void 0,
	      enabled: true,
	      customId: 0,
	      once: false,
	      type: "plugin_onLoad",
	      code: "storage.autoruns = storage.autoruns.filter($=>!$?.deleting)"
	    }
	  ],
	  stats: {
	    runs: {
	      history: [],
	      failed: 0,
	      succeeded: 0,
	      plugin: 0,
	      sessionHistory: []
	    },
	    autoruns: {}
	  },
	  settings: {
	    history: {
	      enabled: true,
	      saveContext: false,
	      saveOnError: false,
	      checkLatestDupes: true
	    },
	    autoruns: {
	      enabled: true,
	      optimization: false
	    },
	    output: {
	      location: 0,
	      trim: 15e3,
	      fixPromiseProps: true,
	      hideSensitive: true,
	      sourceEmbed: {
	        name: "Code",
	        enabled: true,
	        codeblock: {
	          enabled: true,
	          escape: true,
	          lang: "js"
	        }
	      },
	      info: {
	        enabled: true,
	        prettyTypeof: true,
	        hints: true
	      },
	      useToString: false,
	      inspect: {
	        // this is passed as a whole to the inspect function's second argument. https://nodejs.org/api/util.html#:~:text=or%20Object.-,options,-%3CObject%3E
	        showHidden: false,
	        depth: 3,
	        maxArrayLength: 15,
	        compact: 2,
	        numericSeparator: true,
	        getters: false
	      },
	      codeblock: {
	        // same as in the codeblock settings in sourceEmbed
	        enabled: true,
	        escape: true,
	        lang: "js"
	      },
	      errors: {
	        trim: true,
	        stack: true
	      }
	    },
	    defaults: {
	      // defult choices for the arguments if no value is passed
	      await: true,
	      global: false,
	      return: false,
	      silent: false
	    },
	    command: {
	      name: "!eval"
	    }
	  }
	});
	triggerAutorun("plugin_after_defaults", function(code) {
	  return eval(code);
	});
	const { meta: { resolveSemanticColor } } = metro.findByProps("colors", "meta");
	const ThemeStore = metro.findByStoreName("ThemeStore");
	const EMBED_COLOR = function(color) {
	  return parseInt(resolveSemanticColor(ThemeStore.theme, ui.semanticColors.BACKGROUND_SECONDARY).slice(1), 16);
	};
	let madeSendMessage, UserStore, plugin, usedInSession = false;
	function sendMessage() {
	  if (window.sendMessage)
	    return window.sendMessage?.(...arguments);
	  if (!madeSendMessage)
	    madeSendMessage = mSendMessage(vendetta);
	  return madeSendMessage(...arguments);
	}
	const tini = function(number) {
	  return number < 100 ? `${number}ms` : `${number / 1e3}s`;
	};
	async function execute(rawArgs, ctx) {
	  try {
	    const ranAt = +new Date();
	    const { settings, stats } = plugin$2.storage;
	    const { history, defaults, output: outputSettings } = settings;
	    const { runs } = stats;
	    triggerAutorun("command_before", function(code) {
	      return eval(code);
	    });
	    UserStore ??= metro.findByStoreName("UserStore");
	    if (!usedInSession) {
	      usedInSession = true;
	      runs["plugin"]++;
	      runs["sessionHistory"] = [];
	    }
	    let currentUser = UserStore.getCurrentUser();
	    if (outputSettings["hideSensitive"]) {
	      const _ = currentUser;
	      currentUser = {
	        ...currentUser
	      };
	      Object.defineProperty(currentUser, "_", {
	        value: _,
	        enumerable: false
	      });
	      evaluate.SENSITIVE_PROPS.USER.forEach(function(prop) {
	        Object.defineProperty(currentUser, prop, {
	          enumerable: false
	        });
	      });
	    }
	    const messageMods = {
	      ...authorMods,
	      interaction: {
	        name: "/" + this.displayName,
	        user: currentUser
	      }
	    };
	    const interaction = {
	      messageMods,
	      ...ctx,
	      user: currentUser,
	      args: new Map(rawArgs.map(function(o) {
	        return [
	          o.name,
	          o
	        ];
	      }))
	    };
	    Object.defineProperty(interaction, "_args", {
	      value: rawArgs,
	      enunerable: false
	    });
	    triggerAutorun("command_after_interaction_def", function(code) {
	      return eval(code);
	    });
	    if (interaction.autocomplete) {
	      triggerAutorun("command_autocomplete_before", function(code) {
	        return eval(code);
	      });
	      triggerAutorun("command_autocomplete_after", function(code) {
	        return eval(code);
	      });
	      return;
	    }
	    const { channel, args } = interaction, code = args.get("code")?.value, aweight = args.get("await")?.value ?? defaults["await"], silent = args.get("silent")?.value ?? defaults["silent"], global = args.get("global")?.value ?? defaults["global"];
	    if (typeof code !== "string")
	      throw new Error("No code argument passed");
	    const evalEnv = {
	      interaction,
	      plugin,
	      util: {
	        addAutorun,
	        deleteAutorun,
	        sendMessage,
	        common,
	        evaluate,
	        BUILTIN_AUTORUN_TYPES,
	        triggerAutorun
	      }
	    };
	    triggerAutorun("evaluate_before", function(code) {
	      return eval(code);
	    });
	    let { result, errored, timings } = await evaluate(code, aweight, global, evalEnv);
	    triggerAutorun("evaluate_after", function(code) {
	      return eval(code);
	    });
	    let thisEvaluation = {};
	    if (history.enabled) {
	      thisEvaluation = {
	        _v: 0,
	        session: runs["plugin"],
	        code,
	        errored
	      };
	      Object.defineProperty(thisEvaluation, "_v", {
	        enumerable: false
	      });
	      if (!interaction.dontSaveResult) {
	        const filter = [
	          window,
	          runs["history"],
	          runs["sessionHistory"],
	          vendetta.plugin.storage
	        ];
	        try {
	          thisEvaluation.result = cloneWithout(result, filter, "not saved");
	          if (history.saveContext)
	            thisEvaluation.context = cloneWithout({
	              interaction,
	              plugin
	            }, filter, "not saved");
	        } catch (error) {
	          error.message = "Not saved because of: " + error.message;
	          thisEvaluation.result = error;
	        }
	      }
	      (function() {
	        if (errored)
	          return runs["failed"]++;
	        runs["succeeded"]++;
	        if (!history.saveOnError)
	          return;
	        runs["history"].push(thisEvaluation);
	        runs["sessionHistory"].push(thisEvaluation);
	      })();
	    }
	    if (!silent) {
	      thisEvaluation.timing = {
	        command: ranAt,
	        evaluate: timings,
	        process: [
	          +new Date()
	        ]
	      };
	      const message = {
	        channelId: channel.id,
	        content: "",
	        embeds: []
	      };
	      const outputEmbed = {
	        type: "rich",
	        color: EMBED_COLOR(errored ? "dissatisfactory" : "satisfactory")
	      };
	      message.embeds.push(outputEmbed);
	      if (outputSettings["fixPromiseProps"] && result?.constructor?.name === "Promise")
	        result = fixPromiseProps(result);
	      let processedResult = outputSettings["useToString"] ? result.toString() : inspect(result, outputSettings["inspect"]);
	      thisEvaluation.processedResult = processedResult;
	      if (errored) {
	        const { stack, trim } = outputSettings["errors"];
	        if (stack && result.stack !== void 0 && typeof result.stack === "string")
	          processedResult = result.stack;
	        if (trim)
	          processedResult = processedResult.split("    at ?anon_0_?anon_0_evaluate")[0];
	      }
	      if (typeof outputSettings["trim"] === "number" && outputSettings["trim"] < processedResult.length)
	        processedResult = processedResult.slice(0, outputSettings["trim"]);
	      if (outputSettings["codeblock"].enabled) {
	        const { lang, escape } = outputSettings["codeblock"];
	        processedResult = codeblock(processedResult, lang, escape);
	      }
	      if (outputSettings["location"] === 0) {
	        message.content = processedResult;
	      } else {
	        outputEmbed.description = processedResult;
	      }
	      if (outputSettings["info"].enabled) {
	        const { hints, prettyTypeof: prettyTypeof$1 } = outputSettings.info;
	        let rows = [
	          [
	            "",
	            prettyTypeof$1 ? prettyTypeof(result) : typeof result
	          ]
	        ];
	        if (hints) {
	          let hint;
	          if (result === void 0 && !code.includes("return"))
	            hint = `"return" the value to be shown here`;
	          if ([
	            "ReferenceError",
	            "TypeError",
	            void 0
	          ].includes(result?.constructor?.name)) {
	            if (code.includes("interaction.plugin.meta"))
	              hint = `use the "plugin" env variable`;
	            if (code.includes("util.hlp") && !code.includes("util.common"))
	              hint = `"util.hlp" was renamed to "util.common"`;
	          }
	          if (hint)
	            rows.push([
	              "hint",
	              hint
	            ]);
	        }
	        rows.push([
	          "took",
	          tini(timings[1] - timings[0])
	        ]);
	        outputEmbed.rawOutputInfoRows = rows;
	        if (outputSettings["location"] === 0) {
	          outputEmbed.description = processRows(rows);
	        } else {
	          outputEmbed.footer = {
	            text: processRows(rows)
	          };
	        }
	      }
	      if (outputSettings["sourceEmbed"].enabled) {
	        const { codeblock: { enabled: wrap, language, escape }, name } = outputSettings["sourceEmbed"];
	        const sourceEmbed = {
	          type: "rich",
	          color: EMBED_COLOR("source")
	        };
	        message.embeds.push(sourceEmbed);
	        if (typeof name === "object" && "name" in name)
	          sourceEmbed.provider = name;
	        if (typeof name === "string")
	          sourceEmbed.title = name;
	        if (wrap)
	          sourceEmbed.description = codeblock(code, language, escape);
	        if (true) {
	          const rows = [
	            [
	              "length",
	              code.length
	            ]
	          ];
	          sourceEmbed.rawSourceInfoRows = rows;
	          let lineCount = code.split("\n").length;
	          if (lineCount < 0)
	            rows.push([
	              "lines",
	              lineCount
	            ]);
	          sourceEmbed.footer = {
	            text: processRows(rows)
	          };
	        }
	      }
	      const sent = sendMessage(message, messageMods);
	      thisEvaluation.timing.process[1] = +new Date();
	      if (outputSettings["info"].enabled) {
	        const msgMods = {
	          ...messageMods,
	          id: sent.id,
	          edited_timestamp: Date.now()
	        };
	        const { timing: { process } } = thisEvaluation;
	        outputEmbed.rawOutputInfoRows.push([
	          "processed",
	          tini(process[1] - process[0])
	        ]);
	        if (outputSettings["location"] === 0) {
	          outputEmbed.description = processRows(outputEmbed.rawOutputInfoRows);
	        } else {
	          outputEmbed.footer.text = processRows(outputEmbed.rawOutputInfoRows);
	        }
	        sendMessage(message, msgMods);
	      }
	    }
	    if (!errored && args.get("return")?.value) {
	      triggerAutorun("command_before_return", function(code) {
	        return eval(code);
	      });
	      return result;
	    }
	    if (errored && silent) {
	      console.error(result);
	      console.log(result.stack);
	      alert("An error ocurred while running your silent & returned eval\n" + result.stack);
	    }
	  } catch (e) {
	    console.error(e);
	    console.log(e.stack);
	    alert("An uncatched error was thrown while running /eval\n" + e.stack);
	  }
	  triggerAutorun("command_after", function(code) {
	    return eval(code);
	  });
	}
	plugin = {
	  ...vendetta.plugin,
	  // TODO: settings, // if you pr this - you are the main maintainer of it. ping me in Exyl's server's bot channel for me to open dms with you
	  patches: [],
	  onUnload() {
	    triggerAutorun("plugin_onUnload", function(code) {
	      return eval(code);
	    });
	    this.patches.forEach(function(up) {
	      return up();
	    });
	    this.patches = [];
	  },
	  onLoad() {
	    try {
	      triggerAutorun("plugin_onLoad", function(code) {
	        return eval(code);
	      });
	      this.command(execute);
	    } catch (e) {
	      console.error(e);
	      console.log(e.stack);
	      alert(`There was an error while loading the plugin "${plugin.name}"
${e.stack}`);
	    }
	  },
	  command(execute1) {
	    var _this = this;
	    if (this.commandPatch) {
	      this.patches.splice(this.patches.findIndex(function($) {
	        return $ === _this.commandPatch;
	      }), 1)?.();
	    }
	    const { defaults: defaults2, command } = plugin$2.storage.settings;
	    this.commandPatch = commands.registerCommand(cmdDisplays({
	      execute: execute1,
	      type: 1,
	      inputType: 1,
	      applicationId: "-1",
	      name: command["name"] ?? "!eval",
	      description: "Evaluates code",
	      options: [
	        {
	          required: true,
	          type: 3,
	          // autocomplete: true,
	          name: "code",
	          description: "Code to evaluate"
	        },
	        {
	          type: 5,
	          name: "silent",
	          description: `Show the output of the evaluation? (default: ${defaults2["silent"]})`
	        },
	        {
	          type: 5,
	          name: "return",
	          description: `Return the returned value? (so it works as a real command, default: ${defaults2["return"]})`
	        },
	        {
	          type: 5,
	          name: "global",
	          description: `Evaluate the code in the global scope? (default: ${defaults2["global"]})`
	        },
	        {
	          type: 5,
	          name: "await",
	          description: `await the evaluation? (default: ${defaults2["await"]})`
	        }
	      ]
	    }));
	    this.patches.push(this.commandPatch);
	  }
	};
	var plugin$1 = plugin;
	triggerAutorun("plugin_after_exports", function(code) {
	  return eval(code);
	});

	exports.EMBED_COLOR = EMBED_COLOR;
	exports.addAutorun = addAutorun;
	exports.default = plugin$1;
	exports.deleteAutorun = deleteAutorun;
	exports.triggerAutorun = triggerAutorun;

	Object.defineProperty(exports, '__esModule', { value: true });

	return exports;

})({}, vendetta.commands, vendetta.metro, vendetta.plugin, vendetta.ui);
