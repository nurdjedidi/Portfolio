import { mergeProps, withCtx, createTextVNode, createVNode, useSSRContext } from 'vue';
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { _ as _export_sfc, n as VIcon, V as VContainer } from './server.mjs';
import { V as VCard, a as VCardTitle, d as VRow, e as VCol, b as VCardSubtitle, c as VCardText } from './VCard-T53b_pL4.mjs';
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

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);
const _sfc_main = {
  name: "Skills",
  setup() {
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<section${ssrRenderAttrs(mergeProps({ class: "skills d-flex justify-center align-center" }, _attrs))}>`);
  _push(ssrRenderComponent(VCard, {
    class: "card-learn",
    "max-width": "500",
    color: "grey-darken-4"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(ssrRenderComponent(VCardTitle, { class: "headline" }, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(`Achievements`);
            } else {
              return [
                createTextVNode("Achievements")
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
        _push2(ssrRenderComponent(VRow, null, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(ssrRenderComponent(VCol, {
                cols: "12",
                sm: "6"
              }, {
                default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                  if (_push4) {
                    _push4(ssrRenderComponent(VCardSubtitle, null, {
                      default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                        if (_push5) {
                          _push5(ssrRenderComponent(VIcon, {
                            icon: "mdi-school",
                            left: ""
                          }, null, _parent5, _scopeId4));
                          _push5(` Learning `);
                        } else {
                          return [
                            createVNode(VIcon, {
                              icon: "mdi-school",
                              left: ""
                            }),
                            createTextVNode(" Learning ")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent4, _scopeId3));
                    _push4(ssrRenderComponent(VCardText, null, {
                      default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                        if (_push5) {
                          _push5(ssrRenderComponent(VIcon, {
                            icon: "mdi-calendar-check",
                            left: ""
                          }, null, _parent5, _scopeId4));
                          _push5(` &gt; 1 year `);
                        } else {
                          return [
                            createVNode(VIcon, {
                              icon: "mdi-calendar-check",
                              left: ""
                            }),
                            createTextVNode(" > 1 year ")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent4, _scopeId3));
                    _push4(ssrRenderComponent(VCardText, null, {
                      default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                        if (_push5) {
                          _push5(ssrRenderComponent(VIcon, {
                            icon: "mdi-code-tags",
                            left: ""
                          }, null, _parent5, _scopeId4));
                          _push5(` Full-Stack Developer `);
                        } else {
                          return [
                            createVNode(VIcon, {
                              icon: "mdi-code-tags",
                              left: ""
                            }),
                            createTextVNode(" Full-Stack Developer ")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent4, _scopeId3));
                  } else {
                    return [
                      createVNode(VCardSubtitle, null, {
                        default: withCtx(() => [
                          createVNode(VIcon, {
                            icon: "mdi-school",
                            left: ""
                          }),
                          createTextVNode(" Learning ")
                        ]),
                        _: 1
                      }),
                      createVNode(VCardText, null, {
                        default: withCtx(() => [
                          createVNode(VIcon, {
                            icon: "mdi-calendar-check",
                            left: ""
                          }),
                          createTextVNode(" > 1 year ")
                        ]),
                        _: 1
                      }),
                      createVNode(VCardText, null, {
                        default: withCtx(() => [
                          createVNode(VIcon, {
                            icon: "mdi-code-tags",
                            left: ""
                          }),
                          createTextVNode(" Full-Stack Developer ")
                        ]),
                        _: 1
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent3, _scopeId2));
              _push3(ssrRenderComponent(VCol, {
                cols: "12",
                sm: "6"
              }, {
                default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                  if (_push4) {
                    _push4(ssrRenderComponent(VCardSubtitle, null, {
                      default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                        if (_push5) {
                          _push5(ssrRenderComponent(VIcon, {
                            icon: "mdi-briefcase",
                            left: ""
                          }, null, _parent5, _scopeId4));
                          _push5(` Professional `);
                        } else {
                          return [
                            createVNode(VIcon, {
                              icon: "mdi-briefcase",
                              left: ""
                            }),
                            createTextVNode(" Professional ")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent4, _scopeId3));
                    _push4(ssrRenderComponent(VCardText, null, {
                      default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                        if (_push5) {
                          _push5(ssrRenderComponent(VIcon, {
                            icon: "mdi-calendar-check",
                            left: ""
                          }, null, _parent5, _scopeId4));
                          _push5(` 0-2 years `);
                        } else {
                          return [
                            createVNode(VIcon, {
                              icon: "mdi-calendar-check",
                              left: ""
                            }),
                            createTextVNode(" 0-2 years ")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent4, _scopeId3));
                    _push4(ssrRenderComponent(VCardText, null, {
                      default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                        if (_push5) {
                          _push5(ssrRenderComponent(VIcon, {
                            icon: "mdi-code-tags",
                            left: ""
                          }, null, _parent5, _scopeId4));
                          _push5(` Full-Stack Developer `);
                        } else {
                          return [
                            createVNode(VIcon, {
                              icon: "mdi-code-tags",
                              left: ""
                            }),
                            createTextVNode(" Full-Stack Developer ")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent4, _scopeId3));
                  } else {
                    return [
                      createVNode(VCardSubtitle, null, {
                        default: withCtx(() => [
                          createVNode(VIcon, {
                            icon: "mdi-briefcase",
                            left: ""
                          }),
                          createTextVNode(" Professional ")
                        ]),
                        _: 1
                      }),
                      createVNode(VCardText, null, {
                        default: withCtx(() => [
                          createVNode(VIcon, {
                            icon: "mdi-calendar-check",
                            left: ""
                          }),
                          createTextVNode(" 0-2 years ")
                        ]),
                        _: 1
                      }),
                      createVNode(VCardText, null, {
                        default: withCtx(() => [
                          createVNode(VIcon, {
                            icon: "mdi-code-tags",
                            left: ""
                          }),
                          createTextVNode(" Full-Stack Developer ")
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
                createVNode(VCol, {
                  cols: "12",
                  sm: "6"
                }, {
                  default: withCtx(() => [
                    createVNode(VCardSubtitle, null, {
                      default: withCtx(() => [
                        createVNode(VIcon, {
                          icon: "mdi-school",
                          left: ""
                        }),
                        createTextVNode(" Learning ")
                      ]),
                      _: 1
                    }),
                    createVNode(VCardText, null, {
                      default: withCtx(() => [
                        createVNode(VIcon, {
                          icon: "mdi-calendar-check",
                          left: ""
                        }),
                        createTextVNode(" > 1 year ")
                      ]),
                      _: 1
                    }),
                    createVNode(VCardText, null, {
                      default: withCtx(() => [
                        createVNode(VIcon, {
                          icon: "mdi-code-tags",
                          left: ""
                        }),
                        createTextVNode(" Full-Stack Developer ")
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                createVNode(VCol, {
                  cols: "12",
                  sm: "6"
                }, {
                  default: withCtx(() => [
                    createVNode(VCardSubtitle, null, {
                      default: withCtx(() => [
                        createVNode(VIcon, {
                          icon: "mdi-briefcase",
                          left: ""
                        }),
                        createTextVNode(" Professional ")
                      ]),
                      _: 1
                    }),
                    createVNode(VCardText, null, {
                      default: withCtx(() => [
                        createVNode(VIcon, {
                          icon: "mdi-calendar-check",
                          left: ""
                        }),
                        createTextVNode(" 0-2 years ")
                      ]),
                      _: 1
                    }),
                    createVNode(VCardText, null, {
                      default: withCtx(() => [
                        createVNode(VIcon, {
                          icon: "mdi-code-tags",
                          left: ""
                        }),
                        createTextVNode(" Full-Stack Developer ")
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
      } else {
        return [
          createVNode(VCardTitle, { class: "headline" }, {
            default: withCtx(() => [
              createTextVNode("Achievements")
            ]),
            _: 1
          }),
          createVNode(VRow, null, {
            default: withCtx(() => [
              createVNode(VCol, {
                cols: "12",
                sm: "6"
              }, {
                default: withCtx(() => [
                  createVNode(VCardSubtitle, null, {
                    default: withCtx(() => [
                      createVNode(VIcon, {
                        icon: "mdi-school",
                        left: ""
                      }),
                      createTextVNode(" Learning ")
                    ]),
                    _: 1
                  }),
                  createVNode(VCardText, null, {
                    default: withCtx(() => [
                      createVNode(VIcon, {
                        icon: "mdi-calendar-check",
                        left: ""
                      }),
                      createTextVNode(" > 1 year ")
                    ]),
                    _: 1
                  }),
                  createVNode(VCardText, null, {
                    default: withCtx(() => [
                      createVNode(VIcon, {
                        icon: "mdi-code-tags",
                        left: ""
                      }),
                      createTextVNode(" Full-Stack Developer ")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(VCol, {
                cols: "12",
                sm: "6"
              }, {
                default: withCtx(() => [
                  createVNode(VCardSubtitle, null, {
                    default: withCtx(() => [
                      createVNode(VIcon, {
                        icon: "mdi-briefcase",
                        left: ""
                      }),
                      createTextVNode(" Professional ")
                    ]),
                    _: 1
                  }),
                  createVNode(VCardText, null, {
                    default: withCtx(() => [
                      createVNode(VIcon, {
                        icon: "mdi-calendar-check",
                        left: ""
                      }),
                      createTextVNode(" 0-2 years ")
                    ]),
                    _: 1
                  }),
                  createVNode(VCardText, null, {
                    default: withCtx(() => [
                      createVNode(VIcon, {
                        icon: "mdi-code-tags",
                        left: ""
                      }),
                      createTextVNode(" Full-Stack Developer ")
                    ]),
                    _: 1
                  })
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
  }, _parent));
  _push(ssrRenderComponent(VContainer, {
    class: "chart-container",
    style: { "position": "relative", "height": "40vh", "width": "80vw" }
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<canvas id="myChart"${_scopeId}></canvas>`);
      } else {
        return [
          createVNode("canvas", { id: "myChart" })
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</section>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/skills.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const skills = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { skills as default };
//# sourceMappingURL=skills-CFMki2Gc.mjs.map
