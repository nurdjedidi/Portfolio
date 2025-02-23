import { defineComponent, withCtx, createVNode, createBlock, openBlock, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderList, ssrRenderAttr } from 'vue/server-renderer';
import { B as Background, _ as _sfc_main$1 } from './footer-CWrmtMII.mjs';
import { V as VApp, a as VMain } from './VMain-C1CmiDK_.mjs';
import { V as VContainer } from './VContainer-C8upTZrU.mjs';
import { V as VResponsive, a as VImg } from './VAvatar-fb85QHBQ.mjs';
import { V as VRow, a as VCol } from './VRow-CO7bP95K.mjs';
import { V as VCard } from './VCard-D72yKgqE.mjs';
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
import './VList-C17lKoQa.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "services",
  __ssrInlineRender: true,
  setup(__props) {
    const services = [
      { title: "Full stack website", img: "/images/nurdjedd.avif", link: "https://www.fiverr.com/nurdjedd/do-full-stack-website-for-you" },
      { title: "On page and technical SEO optimization", img: "/images/seo.avif", link: "https://www.fiverr.com/nurdjedd/optimise-the-seo-of-your-website" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(VApp, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(Background, null, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(VMain, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(VContainer, {
                    class: "pa-sm-4 pa-md-12",
                    fluid: ""
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VResponsive, {
                          class: "text-center mx-auto",
                          "max-width": "700"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<p id="services" class="mt-2 text-h5 font-weight-bold text-md-h4"${_scopeId4}> Everything you need to build a great business. </p><p class="mt-4 text-body-1 text-medium-emphasis"${_scopeId4}> If you don&#39;t have a website or your search engine rankings are non-existent, let me build you a site that will boost your business, combined with SEO for ubiquitous search rankings. </p>`);
                            } else {
                              return [
                                createVNode("p", {
                                  id: "services",
                                  class: "mt-2 text-h5 font-weight-bold text-md-h4"
                                }, " Everything you need to build a great business. "),
                                createVNode("p", { class: "mt-4 text-body-1 text-medium-emphasis" }, " If you don't have a website or your search engine rankings are non-existent, let me build you a site that will boost your business, combined with SEO for ubiquitous search rankings. ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(VRow, { class: "mt-8" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<!--[-->`);
                              ssrRenderList(services, (service, i) => {
                                _push5(ssrRenderComponent(VCol, {
                                  key: i,
                                  class: "d-flex",
                                  md: "6",
                                  cols: "12"
                                }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(VResponsive, {
                                        class: "mx-auto",
                                        "max-width": "500",
                                        width: "100%"
                                      }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(VCard, null, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(`<a${ssrRenderAttr("href", service.link)} target="_blank" rel="noopener" calt="Services"${_scopeId7}>`);
                                                  _push8(ssrRenderComponent(VImg, {
                                                    class: "rounded-lg",
                                                    src: service.img
                                                  }, null, _parent8, _scopeId7));
                                                  _push8(`</a>`);
                                                } else {
                                                  return [
                                                    createVNode("a", {
                                                      href: service.link,
                                                      target: "_blank",
                                                      rel: "noopener",
                                                      calt: "Services"
                                                    }, [
                                                      createVNode(VImg, {
                                                        class: "rounded-lg",
                                                        src: service.img
                                                      }, null, 8, ["src"])
                                                    ], 8, ["href"])
                                                  ];
                                                }
                                              }),
                                              _: 2
                                            }, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(VCard, null, {
                                                default: withCtx(() => [
                                                  createVNode("a", {
                                                    href: service.link,
                                                    target: "_blank",
                                                    rel: "noopener",
                                                    calt: "Services"
                                                  }, [
                                                    createVNode(VImg, {
                                                      class: "rounded-lg",
                                                      src: service.img
                                                    }, null, 8, ["src"])
                                                  ], 8, ["href"])
                                                ]),
                                                _: 2
                                              }, 1024)
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent6, _scopeId5));
                                    } else {
                                      return [
                                        createVNode(VResponsive, {
                                          class: "mx-auto",
                                          "max-width": "500",
                                          width: "100%"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(VCard, null, {
                                              default: withCtx(() => [
                                                createVNode("a", {
                                                  href: service.link,
                                                  target: "_blank",
                                                  rel: "noopener",
                                                  calt: "Services"
                                                }, [
                                                  createVNode(VImg, {
                                                    class: "rounded-lg",
                                                    src: service.img
                                                  }, null, 8, ["src"])
                                                ], 8, ["href"])
                                              ]),
                                              _: 2
                                            }, 1024)
                                          ]),
                                          _: 2
                                        }, 1024)
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                              });
                              _push5(`<!--]-->`);
                            } else {
                              return [
                                (openBlock(), createBlock(Fragment, null, renderList(services, (service, i) => {
                                  return createVNode(VCol, {
                                    key: i,
                                    class: "d-flex",
                                    md: "6",
                                    cols: "12"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(VResponsive, {
                                        class: "mx-auto",
                                        "max-width": "500",
                                        width: "100%"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(VCard, null, {
                                            default: withCtx(() => [
                                              createVNode("a", {
                                                href: service.link,
                                                target: "_blank",
                                                rel: "noopener",
                                                calt: "Services"
                                              }, [
                                                createVNode(VImg, {
                                                  class: "rounded-lg",
                                                  src: service.img
                                                }, null, 8, ["src"])
                                              ], 8, ["href"])
                                            ]),
                                            _: 2
                                          }, 1024)
                                        ]),
                                        _: 2
                                      }, 1024)
                                    ]),
                                    _: 2
                                  }, 1024);
                                }), 64))
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(VResponsive, {
                            class: "text-center mx-auto",
                            "max-width": "700"
                          }, {
                            default: withCtx(() => [
                              createVNode("p", {
                                id: "services",
                                class: "mt-2 text-h5 font-weight-bold text-md-h4"
                              }, " Everything you need to build a great business. "),
                              createVNode("p", { class: "mt-4 text-body-1 text-medium-emphasis" }, " If you don't have a website or your search engine rankings are non-existent, let me build you a site that will boost your business, combined with SEO for ubiquitous search rankings. ")
                            ]),
                            _: 1
                          }),
                          createVNode(VRow, { class: "mt-8" }, {
                            default: withCtx(() => [
                              (openBlock(), createBlock(Fragment, null, renderList(services, (service, i) => {
                                return createVNode(VCol, {
                                  key: i,
                                  class: "d-flex",
                                  md: "6",
                                  cols: "12"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(VResponsive, {
                                      class: "mx-auto",
                                      "max-width": "500",
                                      width: "100%"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(VCard, null, {
                                          default: withCtx(() => [
                                            createVNode("a", {
                                              href: service.link,
                                              target: "_blank",
                                              rel: "noopener",
                                              calt: "Services"
                                            }, [
                                              createVNode(VImg, {
                                                class: "rounded-lg",
                                                src: service.img
                                              }, null, 8, ["src"])
                                            ], 8, ["href"])
                                          ]),
                                          _: 2
                                        }, 1024)
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ]),
                                  _: 2
                                }, 1024);
                              }), 64))
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
                      class: "pa-sm-4 pa-md-12",
                      fluid: ""
                    }, {
                      default: withCtx(() => [
                        createVNode(VResponsive, {
                          class: "text-center mx-auto",
                          "max-width": "700"
                        }, {
                          default: withCtx(() => [
                            createVNode("p", {
                              id: "services",
                              class: "mt-2 text-h5 font-weight-bold text-md-h4"
                            }, " Everything you need to build a great business. "),
                            createVNode("p", { class: "mt-4 text-body-1 text-medium-emphasis" }, " If you don't have a website or your search engine rankings are non-existent, let me build you a site that will boost your business, combined with SEO for ubiquitous search rankings. ")
                          ]),
                          _: 1
                        }),
                        createVNode(VRow, { class: "mt-8" }, {
                          default: withCtx(() => [
                            (openBlock(), createBlock(Fragment, null, renderList(services, (service, i) => {
                              return createVNode(VCol, {
                                key: i,
                                class: "d-flex",
                                md: "6",
                                cols: "12"
                              }, {
                                default: withCtx(() => [
                                  createVNode(VResponsive, {
                                    class: "mx-auto",
                                    "max-width": "500",
                                    width: "100%"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(VCard, null, {
                                        default: withCtx(() => [
                                          createVNode("a", {
                                            href: service.link,
                                            target: "_blank",
                                            rel: "noopener",
                                            calt: "Services"
                                          }, [
                                            createVNode(VImg, {
                                              class: "rounded-lg",
                                              src: service.img
                                            }, null, 8, ["src"])
                                          ], 8, ["href"])
                                        ]),
                                        _: 2
                                      }, 1024)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ]),
                                _: 2
                              }, 1024);
                            }), 64))
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
                    class: "pa-sm-4 pa-md-12",
                    fluid: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(VResponsive, {
                        class: "text-center mx-auto",
                        "max-width": "700"
                      }, {
                        default: withCtx(() => [
                          createVNode("p", {
                            id: "services",
                            class: "mt-2 text-h5 font-weight-bold text-md-h4"
                          }, " Everything you need to build a great business. "),
                          createVNode("p", { class: "mt-4 text-body-1 text-medium-emphasis" }, " If you don't have a website or your search engine rankings are non-existent, let me build you a site that will boost your business, combined with SEO for ubiquitous search rankings. ")
                        ]),
                        _: 1
                      }),
                      createVNode(VRow, { class: "mt-8" }, {
                        default: withCtx(() => [
                          (openBlock(), createBlock(Fragment, null, renderList(services, (service, i) => {
                            return createVNode(VCol, {
                              key: i,
                              class: "d-flex",
                              md: "6",
                              cols: "12"
                            }, {
                              default: withCtx(() => [
                                createVNode(VResponsive, {
                                  class: "mx-auto",
                                  "max-width": "500",
                                  width: "100%"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(VCard, null, {
                                      default: withCtx(() => [
                                        createVNode("a", {
                                          href: service.link,
                                          target: "_blank",
                                          rel: "noopener",
                                          calt: "Services"
                                        }, [
                                          createVNode(VImg, {
                                            class: "rounded-lg",
                                            src: service.img
                                          }, null, 8, ["src"])
                                        ], 8, ["href"])
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ]),
                                  _: 2
                                }, 1024)
                              ]),
                              _: 2
                            }, 1024);
                          }), 64))
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
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/services.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=services-rlvamZAe.mjs.map
