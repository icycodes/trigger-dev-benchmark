import {
  external_exports,
  schemaTask
} from "./chunk-QYZET73L.mjs";
import {
  __name,
  init_esm
} from "./chunk-YNHHDKFZ.mjs";

// src/trigger/weather.ts
init_esm();
var TRIAL_ID = "ai_agent_with_tool_and_streaming__B7MqwXh";
var weatherTask = schemaTask({
  id: `weatherTask-${TRIAL_ID}`,
  schema: external_exports.object({
    city: external_exports.string()
  }),
  run: /* @__PURE__ */ __name(async (payload) => {
    const { city } = payload;
    return { weather: `Sunny and 25°C in ${city}` };
  }, "run")
});

export {
  weatherTask
};
//# sourceMappingURL=chunk-7KJKWNVY.mjs.map
