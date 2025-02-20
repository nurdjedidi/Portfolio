import { withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js';
import { B as Background, _ as _sfc_main$1 } from './footer-DS8_Ppo8.mjs';
import { V as VApp, a as VMain } from './VMain-C2JahtCb.mjs';
import { V as VContainer } from './VContainer-DPDpy6NR.mjs';
import { V as VResponsive } from './VList-DZJLyHZ4.mjs';
import './_plugin-vue_export-helper-1tPrXgE0.mjs';
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

const _sfc_main = {
  __name: "about",
  __ssrInlineRender: true,
  setup(__props) {
    Chart.register(DoughnutController, ArcElement, Tooltip, Legend);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(VApp, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(Background, null, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(VMain, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(VContainer, {
                    class: "pa-sm-6 pa-md-12",
                    fluid: ""
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VResponsive, {
                          class: "text-center mx-auto my-10",
                          "max-width": "700"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<p id="services" class="mt-2 text-h5 font-weight-bold text-md-h4"${_scopeId4}> What about my skills </p><p class="mt-4 text-body-1 text-medium-emphasis"${_scopeId4}> Passionate about web development, over the years I&#39;ve acquired a diverse set of skills, combining technical rigour and creativity. From mastering modern frameworks to designing intuitive interfaces, I transform ideas into high-performance, elegant digital solutions. </p>`);
                            } else {
                              return [
                                createVNode("p", {
                                  id: "services",
                                  class: "mt-2 text-h5 font-weight-bold text-md-h4"
                                }, " What about my skills "),
                                createVNode("p", { class: "mt-4 text-body-1 text-medium-emphasis" }, " Passionate about web development, over the years I've acquired a diverse set of skills, combining technical rigour and creativity. From mastering modern frameworks to designing intuitive interfaces, I transform ideas into high-performance, elegant digital solutions. ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(VResponsive, {
                          class: "mx-auto",
                          width: "75%"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<canvas id="myChart"${_scopeId4}></canvas>`);
                            } else {
                              return [
                                createVNode("canvas", { id: "myChart" })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(VResponsive, {
                            class: "text-center mx-auto my-10",
                            "max-width": "700"
                          }, {
                            default: withCtx(() => [
                              createVNode("p", {
                                id: "services",
                                class: "mt-2 text-h5 font-weight-bold text-md-h4"
                              }, " What about my skills "),
                              createVNode("p", { class: "mt-4 text-body-1 text-medium-emphasis" }, " Passionate about web development, over the years I've acquired a diverse set of skills, combining technical rigour and creativity. From mastering modern frameworks to designing intuitive interfaces, I transform ideas into high-performance, elegant digital solutions. ")
                            ]),
                            _: 1
                          }),
                          createVNode(VResponsive, {
                            class: "mx-auto",
                            width: "75%"
                          }, {
                            default: withCtx(() => [
                              createVNode("canvas", { id: "myChart" })
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(VContainer, {
                      class: "pa-sm-6 pa-md-12",
                      fluid: ""
                    }, {
                      default: withCtx(() => [
                        createVNode(VResponsive, {
                          class: "text-center mx-auto my-10",
                          "max-width": "700"
                        }, {
                          default: withCtx(() => [
                            createVNode("p", {
                              id: "services",
                              class: "mt-2 text-h5 font-weight-bold text-md-h4"
                            }, " What about my skills "),
                            createVNode("p", { class: "mt-4 text-body-1 text-medium-emphasis" }, " Passionate about web development, over the years I've acquired a diverse set of skills, combining technical rigour and creativity. From mastering modern frameworks to designing intuitive interfaces, I transform ideas into high-performance, elegant digital solutions. ")
                          ]),
                          _: 1
                        }),
                        createVNode(VResponsive, {
                          class: "mx-auto",
                          width: "75%"
                        }, {
                          default: withCtx(() => [
                            createVNode("canvas", { id: "myChart" })
                          ]),
                          _: 1
                        })
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
              createVNode(Background),
              createVNode(VMain, null, {
                default: withCtx(() => [
                  createVNode(VContainer, {
                    class: "pa-sm-6 pa-md-12",
                    fluid: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(VResponsive, {
                        class: "text-center mx-auto my-10",
                        "max-width": "700"
                      }, {
                        default: withCtx(() => [
                          createVNode("p", {
                            id: "services",
                            class: "mt-2 text-h5 font-weight-bold text-md-h4"
                          }, " What about my skills "),
                          createVNode("p", { class: "mt-4 text-body-1 text-medium-emphasis" }, " Passionate about web development, over the years I've acquired a diverse set of skills, combining technical rigour and creativity. From mastering modern frameworks to designing intuitive interfaces, I transform ideas into high-performance, elegant digital solutions. ")
                        ]),
                        _: 1
                      }),
                      createVNode(VResponsive, {
                        class: "mx-auto",
                        width: "75%"
                      }, {
                        default: withCtx(() => [
                          createVNode("canvas", { id: "myChart" })
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(_sfc_main$1)
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/about.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=about-B-J9KZy2.mjs.map
