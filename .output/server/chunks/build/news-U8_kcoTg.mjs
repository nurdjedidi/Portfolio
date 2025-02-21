import { ref, withCtx, createTextVNode, toDisplayString, createVNode, createBlock, openBlock, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { V as VApp, a as VMain, b as VBtn } from './VMain-C1CmiDK_.mjs';
import { V as VContainer } from './VContainer-C8upTZrU.mjs';
import { V as VRow, a as VCol } from './VRow-i0CJxrzj.mjs';
import { V as VCard, a as VCardSubtitle, b as VCardText } from './VCard-D72yKgqE.mjs';
import { a as VImg } from './VAvatar-fb85QHBQ.mjs';
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
  __name: "news",
  __ssrInlineRender: true,
  setup(__props) {
    const news = ref([]);
    const loading = ref(true);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(VApp, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(VMain, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (loading.value) {
                    _push3(`<div class="load"${_scopeId2}></div>`);
                  } else {
                    _push3(ssrRenderComponent(VContainer, null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(VRow, null, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`<!--[-->`);
                                ssrRenderList(news.value, (article, index) => {
                                  _push5(ssrRenderComponent(VCol, {
                                    cols: "12",
                                    sm: "6",
                                    md: "4",
                                    key: index
                                  }, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(ssrRenderComponent(VCard, { class: "d-flex flex-column rounded-lg ma-2" }, {
                                          default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              _push7(ssrRenderComponent(VImg, {
                                                src: article.image,
                                                alt: "Image de l'article"
                                              }, null, _parent7, _scopeId6));
                                              _push7(ssrRenderComponent(VCardSubtitle, { class: "pa-2" }, {
                                                default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                  if (_push8) {
                                                    _push8(`${ssrInterpolate(article.author)}`);
                                                  } else {
                                                    return [
                                                      createTextVNode(toDisplayString(article.author), 1)
                                                    ];
                                                  }
                                                }),
                                                _: 2
                                              }, _parent7, _scopeId6));
                                              _push7(ssrRenderComponent(VCardText, { class: "pa-2" }, {
                                                default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                  if (_push8) {
                                                    _push8(`${ssrInterpolate(article.description)}`);
                                                  } else {
                                                    return [
                                                      createTextVNode(toDisplayString(article.description), 1)
                                                    ];
                                                  }
                                                }),
                                                _: 2
                                              }, _parent7, _scopeId6));
                                              _push7(ssrRenderComponent(VBtn, {
                                                href: article.url,
                                                target: "_blank",
                                                rel: "noopener",
                                                color: "primary"
                                              }, {
                                                default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                  if (_push8) {
                                                    _push8(`Learn more`);
                                                  } else {
                                                    return [
                                                      createTextVNode("Learn more")
                                                    ];
                                                  }
                                                }),
                                                _: 2
                                              }, _parent7, _scopeId6));
                                            } else {
                                              return [
                                                createVNode(VImg, {
                                                  src: article.image,
                                                  alt: "Image de l'article"
                                                }, null, 8, ["src"]),
                                                createVNode(VCardSubtitle, { class: "pa-2" }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(article.author), 1)
                                                  ]),
                                                  _: 2
                                                }, 1024),
                                                createVNode(VCardText, { class: "pa-2" }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(article.description), 1)
                                                  ]),
                                                  _: 2
                                                }, 1024),
                                                createVNode(VBtn, {
                                                  href: article.url,
                                                  target: "_blank",
                                                  rel: "noopener",
                                                  color: "primary"
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode("Learn more")
                                                  ]),
                                                  _: 2
                                                }, 1032, ["href"])
                                              ];
                                            }
                                          }),
                                          _: 2
                                        }, _parent6, _scopeId5));
                                      } else {
                                        return [
                                          createVNode(VCard, { class: "d-flex flex-column rounded-lg ma-2" }, {
                                            default: withCtx(() => [
                                              createVNode(VImg, {
                                                src: article.image,
                                                alt: "Image de l'article"
                                              }, null, 8, ["src"]),
                                              createVNode(VCardSubtitle, { class: "pa-2" }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(article.author), 1)
                                                ]),
                                                _: 2
                                              }, 1024),
                                              createVNode(VCardText, { class: "pa-2" }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(article.description), 1)
                                                ]),
                                                _: 2
                                              }, 1024),
                                              createVNode(VBtn, {
                                                href: article.url,
                                                target: "_blank",
                                                rel: "noopener",
                                                color: "primary"
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode("Learn more")
                                                ]),
                                                _: 2
                                              }, 1032, ["href"])
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
                                  (openBlock(true), createBlock(Fragment, null, renderList(news.value, (article, index) => {
                                    return openBlock(), createBlock(VCol, {
                                      cols: "12",
                                      sm: "6",
                                      md: "4",
                                      key: index
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(VCard, { class: "d-flex flex-column rounded-lg ma-2" }, {
                                          default: withCtx(() => [
                                            createVNode(VImg, {
                                              src: article.image,
                                              alt: "Image de l'article"
                                            }, null, 8, ["src"]),
                                            createVNode(VCardSubtitle, { class: "pa-2" }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(article.author), 1)
                                              ]),
                                              _: 2
                                            }, 1024),
                                            createVNode(VCardText, { class: "pa-2" }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(article.description), 1)
                                              ]),
                                              _: 2
                                            }, 1024),
                                            createVNode(VBtn, {
                                              href: article.url,
                                              target: "_blank",
                                              rel: "noopener",
                                              color: "primary"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode("Learn more")
                                              ]),
                                              _: 2
                                            }, 1032, ["href"])
                                          ]),
                                          _: 2
                                        }, 1024)
                                      ]),
                                      _: 2
                                    }, 1024);
                                  }), 128))
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(VRow, null, {
                              default: withCtx(() => [
                                (openBlock(true), createBlock(Fragment, null, renderList(news.value, (article, index) => {
                                  return openBlock(), createBlock(VCol, {
                                    cols: "12",
                                    sm: "6",
                                    md: "4",
                                    key: index
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(VCard, { class: "d-flex flex-column rounded-lg ma-2" }, {
                                        default: withCtx(() => [
                                          createVNode(VImg, {
                                            src: article.image,
                                            alt: "Image de l'article"
                                          }, null, 8, ["src"]),
                                          createVNode(VCardSubtitle, { class: "pa-2" }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(article.author), 1)
                                            ]),
                                            _: 2
                                          }, 1024),
                                          createVNode(VCardText, { class: "pa-2" }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(article.description), 1)
                                            ]),
                                            _: 2
                                          }, 1024),
                                          createVNode(VBtn, {
                                            href: article.url,
                                            target: "_blank",
                                            rel: "noopener",
                                            color: "primary"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode("Learn more")
                                            ]),
                                            _: 2
                                          }, 1032, ["href"])
                                        ]),
                                        _: 2
                                      }, 1024)
                                    ]),
                                    _: 2
                                  }, 1024);
                                }), 128))
                              ]),
                              _: 1
                            })
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  }
                } else {
                  return [
                    loading.value ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "load"
                    })) : (openBlock(), createBlock(VContainer, { key: 1 }, {
                      default: withCtx(() => [
                        createVNode(VRow, null, {
                          default: withCtx(() => [
                            (openBlock(true), createBlock(Fragment, null, renderList(news.value, (article, index) => {
                              return openBlock(), createBlock(VCol, {
                                cols: "12",
                                sm: "6",
                                md: "4",
                                key: index
                              }, {
                                default: withCtx(() => [
                                  createVNode(VCard, { class: "d-flex flex-column rounded-lg ma-2" }, {
                                    default: withCtx(() => [
                                      createVNode(VImg, {
                                        src: article.image,
                                        alt: "Image de l'article"
                                      }, null, 8, ["src"]),
                                      createVNode(VCardSubtitle, { class: "pa-2" }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(article.author), 1)
                                        ]),
                                        _: 2
                                      }, 1024),
                                      createVNode(VCardText, { class: "pa-2" }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(article.description), 1)
                                        ]),
                                        _: 2
                                      }, 1024),
                                      createVNode(VBtn, {
                                        href: article.url,
                                        target: "_blank",
                                        rel: "noopener",
                                        color: "primary"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("Learn more")
                                        ]),
                                        _: 2
                                      }, 1032, ["href"])
                                    ]),
                                    _: 2
                                  }, 1024)
                                ]),
                                _: 2
                              }, 1024);
                            }), 128))
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(VMain, null, {
                default: withCtx(() => [
                  loading.value ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "load"
                  })) : (openBlock(), createBlock(VContainer, { key: 1 }, {
                    default: withCtx(() => [
                      createVNode(VRow, null, {
                        default: withCtx(() => [
                          (openBlock(true), createBlock(Fragment, null, renderList(news.value, (article, index) => {
                            return openBlock(), createBlock(VCol, {
                              cols: "12",
                              sm: "6",
                              md: "4",
                              key: index
                            }, {
                              default: withCtx(() => [
                                createVNode(VCard, { class: "d-flex flex-column rounded-lg ma-2" }, {
                                  default: withCtx(() => [
                                    createVNode(VImg, {
                                      src: article.image,
                                      alt: "Image de l'article"
                                    }, null, 8, ["src"]),
                                    createVNode(VCardSubtitle, { class: "pa-2" }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(article.author), 1)
                                      ]),
                                      _: 2
                                    }, 1024),
                                    createVNode(VCardText, { class: "pa-2" }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(article.description), 1)
                                      ]),
                                      _: 2
                                    }, 1024),
                                    createVNode(VBtn, {
                                      href: article.url,
                                      target: "_blank",
                                      rel: "noopener",
                                      color: "primary"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("Learn more")
                                      ]),
                                      _: 2
                                    }, 1032, ["href"])
                                  ]),
                                  _: 2
                                }, 1024)
                              ]),
                              _: 2
                            }, 1024);
                          }), 128))
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }))
                ]),
                _: 1
              })
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/news.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=news-U8_kcoTg.mjs.map
