import { mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs } from 'vue/server-renderer';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';

const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({
    class: "v-bg position-absolute top-0 right-0 left-0 bottom-0",
    style: { "z-index": "1" }
  }, _attrs))} data-v-3dd076fa><div aria-hidden="true" class="overflow-hidden opacity-20 w-100 h-100" data-v-3dd076fa></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("public/components/background.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Background = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-3dd076fa"]]);

export { Background as B };
//# sourceMappingURL=background-EsrnzWOf.mjs.map
