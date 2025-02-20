import { useSSRContext, withCtx, createVNode } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import { V as VApp, a as VMain, b as VBtn } from './VMain-C2JahtCb.mjs';
import { V as VContainer } from './VContainer-DPDpy6NR.mjs';
import './server.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:url';
import 'consola/core';
import 'ipx';
import 'node:path';
import 'unhead';
import '@unhead/shared';
import 'vue-router';

const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(ssrRenderComponent(VApp, _attrs, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(ssrRenderComponent(VMain, {
          "min-height": _ctx.$vuetify.display.mdAndUp ? 800 : 550
        }, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(ssrRenderComponent(VContainer, { class: "h-100 d-flex align-center justify-center" }, {
                default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                  if (_push4) {
                    _push4(`<div class="w-100 w-md-50 text-center" data-v-969f388d${_scopeId3}><h1 class="text-h4 text-md-h2 font-weight-bold my-6" data-v-969f388d${_scopeId3}> Boost your online presence with tailor-made development. </h1><div class="text-body-1 text-medium-emphasis mb-10" data-v-969f388d${_scopeId3}> Get your business off the ground with web design and SEO expertise tailored to your needs. </div><div class="d-flex ga-4 justify-center" data-v-969f388d${_scopeId3}>`);
                    _push4(ssrRenderComponent(VBtn, {
                      class: "text-none",
                      color: "primary",
                      flat: "",
                      rounded: "lg",
                      text: "Get started",
                      to: "/contact",
                      nuxt: ""
                    }, null, _parent4, _scopeId3));
                    _push4(ssrRenderComponent(VBtn, {
                      "append-icon": "mdi-chevron-right",
                      class: "text-none",
                      flat: "",
                      rounded: "lg",
                      text: "Learn more",
                      to: "/services",
                      nuxt: ""
                    }, null, _parent4, _scopeId3));
                    _push4(`</div></div><div class="v-bg position-absolute top-0 right-0 left-0 bottom-0" data-v-969f388d${_scopeId3}><div aria-hidden="true" class="overflow-hidden opacity-20 w-100 h-100" data-v-969f388d${_scopeId3}></div></div>`);
                  } else {
                    return [
                      createVNode("div", { class: "w-100 w-md-50 text-center" }, [
                        createVNode("h1", { class: "text-h4 text-md-h2 font-weight-bold my-6" }, " Boost your online presence with tailor-made development. "),
                        createVNode("div", { class: "text-body-1 text-medium-emphasis mb-10" }, " Get your business off the ground with web design and SEO expertise tailored to your needs. "),
                        createVNode("div", { class: "d-flex ga-4 justify-center" }, [
                          createVNode(VBtn, {
                            class: "text-none",
                            color: "primary",
                            flat: "",
                            rounded: "lg",
                            text: "Get started",
                            to: "/contact",
                            nuxt: ""
                          }),
                          createVNode(VBtn, {
                            "append-icon": "mdi-chevron-right",
                            class: "text-none",
                            flat: "",
                            rounded: "lg",
                            text: "Learn more",
                            to: "/services",
                            nuxt: ""
                          })
                        ])
                      ]),
                      createVNode("div", { class: "v-bg position-absolute top-0 right-0 left-0 bottom-0" }, [
                        createVNode("div", {
                          "aria-hidden": "true",
                          class: "overflow-hidden opacity-20 w-100 h-100"
                        })
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent3, _scopeId2));
            } else {
              return [
                createVNode(VContainer, { class: "h-100 d-flex align-center justify-center" }, {
                  default: withCtx(() => [
                    createVNode("div", { class: "w-100 w-md-50 text-center" }, [
                      createVNode("h1", { class: "text-h4 text-md-h2 font-weight-bold my-6" }, " Boost your online presence with tailor-made development. "),
                      createVNode("div", { class: "text-body-1 text-medium-emphasis mb-10" }, " Get your business off the ground with web design and SEO expertise tailored to your needs. "),
                      createVNode("div", { class: "d-flex ga-4 justify-center" }, [
                        createVNode(VBtn, {
                          class: "text-none",
                          color: "primary",
                          flat: "",
                          rounded: "lg",
                          text: "Get started",
                          to: "/contact",
                          nuxt: ""
                        }),
                        createVNode(VBtn, {
                          "append-icon": "mdi-chevron-right",
                          class: "text-none",
                          flat: "",
                          rounded: "lg",
                          text: "Learn more",
                          to: "/services",
                          nuxt: ""
                        })
                      ])
                    ]),
                    createVNode("div", { class: "v-bg position-absolute top-0 right-0 left-0 bottom-0" }, [
                      createVNode("div", {
                        "aria-hidden": "true",
                        class: "overflow-hidden opacity-20 w-100 h-100"
                      })
                    ])
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
      } else {
        return [
          createVNode(VMain, {
            "min-height": _ctx.$vuetify.display.mdAndUp ? 800 : 550
          }, {
            default: withCtx(() => [
              createVNode(VContainer, { class: "h-100 d-flex align-center justify-center" }, {
                default: withCtx(() => [
                  createVNode("div", { class: "w-100 w-md-50 text-center" }, [
                    createVNode("h1", { class: "text-h4 text-md-h2 font-weight-bold my-6" }, " Boost your online presence with tailor-made development. "),
                    createVNode("div", { class: "text-body-1 text-medium-emphasis mb-10" }, " Get your business off the ground with web design and SEO expertise tailored to your needs. "),
                    createVNode("div", { class: "d-flex ga-4 justify-center" }, [
                      createVNode(VBtn, {
                        class: "text-none",
                        color: "primary",
                        flat: "",
                        rounded: "lg",
                        text: "Get started",
                        to: "/contact",
                        nuxt: ""
                      }),
                      createVNode(VBtn, {
                        "append-icon": "mdi-chevron-right",
                        class: "text-none",
                        flat: "",
                        rounded: "lg",
                        text: "Learn more",
                        to: "/services",
                        nuxt: ""
                      })
                    ])
                  ]),
                  createVNode("div", { class: "v-bg position-absolute top-0 right-0 left-0 bottom-0" }, [
                    createVNode("div", {
                      "aria-hidden": "true",
                      class: "overflow-hidden opacity-20 w-100 h-100"
                    })
                  ])
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["min-height"])
        ];
      }
    }),
    _: 1
  }, _parent));
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-969f388d"]]);

export { index as default };
//# sourceMappingURL=index-CoQ8Tpnx.mjs.map
