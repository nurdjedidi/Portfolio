import { defineComponent, useSSRContext, withCtx, createTextVNode, createVNode } from 'vue';
import { ssrRenderComponent, ssrRenderStyle } from 'vue/server-renderer';
import { V as VContainer, _ as _sfc_main$1 } from './footer-BphUiFS0.mjs';
import { V as VApp, a as VMain, c as VBtn } from './VMain-4nSgokiH.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(VApp, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(VMain, {
              class: "position-relative",
              "min-height": _ctx.$vuetify.display.mdAndUp ? 800 : 550
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="v-bg position-absolute top-0 right-0 left-0 bottom-0" style="${ssrRenderStyle({ "z-index": "1" })}" data-v-3b204486${_scopeId2}><div aria-hidden="true" class="overflow-hidden opacity-20 w-100 h-100" data-v-3b204486${_scopeId2}></div></div>`);
                  _push3(ssrRenderComponent(VContainer, {
                    class: "h-100 d-flex align-center justify-center",
                    style: { "z-index": "2" }
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="w-100 w-md-50 text-center" data-v-3b204486${_scopeId3}><h1 class="text-h6 text-md-h2 font-weight-bold my-6" data-v-3b204486${_scopeId3}> Boost your online presence with tailor-made development. </h1><div class="text-body-1 text-medium-emphasis mb-10" data-v-3b204486${_scopeId3}> Get your business off the ground with web design and SEO expertise tailored to your needs. </div><div class="d-flex ga-4 justify-center" data-v-3b204486${_scopeId3}>`);
                        _push4(ssrRenderComponent(VBtn, {
                          class: "text-none",
                          color: "primary",
                          flat: "",
                          rounded: "lg",
                          to: "/contact",
                          nuxt: ""
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` Get started `);
                            } else {
                              return [
                                createTextVNode(" Get started ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(VBtn, {
                          "append-icon": "mdi-chevron-right",
                          class: "text-none",
                          flat: "",
                          rounded: "lg",
                          to: "/services",
                          nuxt: ""
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` Learn more `);
                            } else {
                              return [
                                createTextVNode(" Learn more ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`</div></div>`);
                      } else {
                        return [
                          createVNode("div", { class: "w-100 w-md-50 text-center" }, [
                            createVNode("h1", { class: "text-h6 text-md-h2 font-weight-bold my-6" }, " Boost your online presence with tailor-made development. "),
                            createVNode("div", { class: "text-body-1 text-medium-emphasis mb-10" }, " Get your business off the ground with web design and SEO expertise tailored to your needs. "),
                            createVNode("div", { class: "d-flex ga-4 justify-center" }, [
                              createVNode(VBtn, {
                                class: "text-none",
                                color: "primary",
                                flat: "",
                                rounded: "lg",
                                to: "/contact",
                                nuxt: ""
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(" Get started ")
                                ]),
                                _: 1
                              }),
                              createVNode(VBtn, {
                                "append-icon": "mdi-chevron-right",
                                class: "text-none",
                                flat: "",
                                rounded: "lg",
                                to: "/services",
                                nuxt: ""
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(" Learn more ")
                                ]),
                                _: 1
                              })
                            ])
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode("div", {
                      class: "v-bg position-absolute top-0 right-0 left-0 bottom-0",
                      style: { "z-index": "1" }
                    }, [
                      createVNode("div", {
                        "aria-hidden": "true",
                        class: "overflow-hidden opacity-20 w-100 h-100"
                      })
                    ]),
                    createVNode(VContainer, {
                      class: "h-100 d-flex align-center justify-center",
                      style: { "z-index": "2" }
                    }, {
                      default: withCtx(() => [
                        createVNode("div", { class: "w-100 w-md-50 text-center" }, [
                          createVNode("h1", { class: "text-h6 text-md-h2 font-weight-bold my-6" }, " Boost your online presence with tailor-made development. "),
                          createVNode("div", { class: "text-body-1 text-medium-emphasis mb-10" }, " Get your business off the ground with web design and SEO expertise tailored to your needs. "),
                          createVNode("div", { class: "d-flex ga-4 justify-center" }, [
                            createVNode(VBtn, {
                              class: "text-none",
                              color: "primary",
                              flat: "",
                              rounded: "lg",
                              to: "/contact",
                              nuxt: ""
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" Get started ")
                              ]),
                              _: 1
                            }),
                            createVNode(VBtn, {
                              "append-icon": "mdi-chevron-right",
                              class: "text-none",
                              flat: "",
                              rounded: "lg",
                              to: "/services",
                              nuxt: ""
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" Learn more ")
                              ]),
                              _: 1
                            })
                          ])
                        ])
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$1, null, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(VMain, {
                class: "position-relative",
                "min-height": _ctx.$vuetify.display.mdAndUp ? 800 : 550
              }, {
                default: withCtx(() => [
                  createVNode("div", {
                    class: "v-bg position-absolute top-0 right-0 left-0 bottom-0",
                    style: { "z-index": "1" }
                  }, [
                    createVNode("div", {
                      "aria-hidden": "true",
                      class: "overflow-hidden opacity-20 w-100 h-100"
                    })
                  ]),
                  createVNode(VContainer, {
                    class: "h-100 d-flex align-center justify-center",
                    style: { "z-index": "2" }
                  }, {
                    default: withCtx(() => [
                      createVNode("div", { class: "w-100 w-md-50 text-center" }, [
                        createVNode("h1", { class: "text-h6 text-md-h2 font-weight-bold my-6" }, " Boost your online presence with tailor-made development. "),
                        createVNode("div", { class: "text-body-1 text-medium-emphasis mb-10" }, " Get your business off the ground with web design and SEO expertise tailored to your needs. "),
                        createVNode("div", { class: "d-flex ga-4 justify-center" }, [
                          createVNode(VBtn, {
                            class: "text-none",
                            color: "primary",
                            flat: "",
                            rounded: "lg",
                            to: "/contact",
                            nuxt: ""
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" Get started ")
                            ]),
                            _: 1
                          }),
                          createVNode(VBtn, {
                            "append-icon": "mdi-chevron-right",
                            class: "text-none",
                            flat: "",
                            rounded: "lg",
                            to: "/services",
                            nuxt: ""
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" Learn more ")
                            ]),
                            _: 1
                          })
                        ])
                      ])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, ["min-height"]),
              createVNode(_sfc_main$1)
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-3b204486"]]);

export { index as default };
//# sourceMappingURL=index-Ch2mQvvm.mjs.map
