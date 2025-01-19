import { ref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';

const _sfc_main = {
  __name: "news",
  __ssrInlineRender: true,
  setup(__props) {
    const news = ref([]);
    const loading = ref(true);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<main${ssrRenderAttrs(mergeProps({ id: "app" }, _attrs))}>`);
      if (loading.value) {
        _push(`<div class="load"></div>`);
      } else {
        _push(`<!---->`);
      }
      if (!loading.value) {
        _push(`<section class="news-container"><!--[-->`);
        ssrRenderList(news.value, (news2, index) => {
          _push(`<div class="news"><img${ssrRenderAttr("src", news2.image)} alt="Image de l&#39;article"><p>${ssrInterpolate(news2.author)}</p><p>${ssrInterpolate(news2.description)}</p><button class="btn-view"><a${ssrRenderAttr("href", news2.url)} target="_blank">Learn more</a></button></div>`);
        });
        _push(`<!--]--></section>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</main>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/news.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : undefined;
};

export { _sfc_main as default };
//# sourceMappingURL=news-BntuCVNg.mjs.map
