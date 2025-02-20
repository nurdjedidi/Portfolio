import { defineComponent, createVNode, mergeProps, withCtx, createTextVNode, toDisplayString, createBlock, openBlock, Fragment, renderList, ref, toRef, shallowRef, computed, watchEffect, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { e as useDimension, u as useRender, b as VResponsive, Y as VList, Z as VListItem, c as VBtn, F as makeTagProps, p as makeDimensionProps, n as makeComponentProps, h as useBackgroundColor, w as useBorder, y as useElevation, g as useRounded, H as useResizeObserver, _ as useLayoutItem, m as makeRoundedProps, $ as makeLayoutItemProps, P as makeElevationProps, Q as makeBorderProps } from './VMain-4nSgokiH.mjs';
import { g as genericComponent, p as propsFactory, j as useRtl, e as provideTheme, f as useToggleScope, h as convertToUnit, m as makeThemeProps } from './server.mjs';

const makeVFooterProps = propsFactory({
  app: Boolean,
  color: String,
  height: {
    type: [Number, String],
    default: "auto"
  },
  ...makeBorderProps(),
  ...makeComponentProps(),
  ...makeElevationProps(),
  ...makeLayoutItemProps(),
  ...makeRoundedProps(),
  ...makeTagProps({
    tag: "footer"
  }),
  ...makeThemeProps()
}, "VFooter");
const VFooter = genericComponent()({
  name: "VFooter",
  props: makeVFooterProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const layoutItemStyles = ref();
    const {
      themeClasses
    } = provideTheme(props);
    const {
      backgroundColorClasses,
      backgroundColorStyles
    } = useBackgroundColor(toRef(props, "color"));
    const {
      borderClasses
    } = useBorder(props);
    const {
      elevationClasses
    } = useElevation(props);
    const {
      roundedClasses
    } = useRounded(props);
    const autoHeight = shallowRef(32);
    const {
      resizeRef
    } = useResizeObserver();
    const height = computed(() => props.height === "auto" ? autoHeight.value : parseInt(props.height, 10));
    useToggleScope(() => props.app, () => {
      const layout = useLayoutItem({
        id: props.name,
        order: computed(() => parseInt(props.order, 10)),
        position: computed(() => "bottom"),
        layoutSize: height,
        elementSize: computed(() => props.height === "auto" ? void 0 : height.value),
        active: computed(() => props.app),
        absolute: toRef(props, "absolute")
      });
      watchEffect(() => {
        layoutItemStyles.value = layout.layoutItemStyles.value;
      });
    });
    useRender(() => createVNode(props.tag, {
      "ref": resizeRef,
      "class": ["v-footer", themeClasses.value, backgroundColorClasses.value, borderClasses.value, elevationClasses.value, roundedClasses.value, props.class],
      "style": [backgroundColorStyles.value, props.app ? layoutItemStyles.value : {
        height: convertToUnit(props.height)
      }, props.style]
    }, slots));
    return {};
  }
});
const makeVContainerProps = propsFactory({
  fluid: {
    type: Boolean,
    default: false
  },
  ...makeComponentProps(),
  ...makeDimensionProps(),
  ...makeTagProps()
}, "VContainer");
const VContainer = genericComponent()({
  name: "VContainer",
  props: makeVContainerProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      rtlClasses
    } = useRtl();
    const {
      dimensionStyles
    } = useDimension(props);
    useRender(() => createVNode(props.tag, {
      "class": ["v-container", {
        "v-container--fluid": props.fluid
      }, rtlClasses.value, props.class],
      "style": [dimensionStyles.value, props.style]
    }, slots));
    return {};
  }
});
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "footer",
  __ssrInlineRender: true,
  setup(__props) {
    const pages = [
      { title: "Home", link: "/" },
      { title: "Services", link: "/services" },
      { title: "Projects", link: "/projects" },
      { title: "About", link: "/about" },
      { title: "Contact", link: "/contact" }
    ];
    const socialIcons = [
      { icon: "mdi-code-tags", link: "https://github.com/nurdjedidi" },
      { icon: "mdi-github", link: "https://www.codecademy.com/profiles/Nur_djedd" },
      { icon: "mdi-linkedin", link: "https://www.linkedin.com/in/nur-djedidi/" },
      { icon: "mdi-twitter", link: "https://x.com/DjedidiNur" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(VFooter, mergeProps({ dark: "" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(VResponsive, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(VContainer, { class: "d-flex flex-column" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="pt-0 d-none d-md-flex"${_scopeId3}>`);
                        _push4(ssrRenderComponent(VList, { class: "d-flex" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<!--[-->`);
                              ssrRenderList(pages, (page) => {
                                _push5(ssrRenderComponent(VListItem, {
                                  class: "mx-1",
                                  key: page.title,
                                  to: page.link,
                                  nuxt: ""
                                }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`${ssrInterpolate(page.title)}`);
                                    } else {
                                      return [
                                        createTextVNode(toDisplayString(page.title), 1)
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                              });
                              _push5(`<!--]-->`);
                            } else {
                              return [
                                (openBlock(), createBlock(Fragment, null, renderList(pages, (page) => {
                                  return createVNode(VListItem, {
                                    class: "mx-1",
                                    key: page.title,
                                    to: page.link,
                                    nuxt: ""
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(page.title), 1)
                                    ]),
                                    _: 2
                                  }, 1032, ["to"]);
                                }), 64))
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`</div><div${_scopeId3}><!--[-->`);
                        ssrRenderList(socialIcons, (icon) => {
                          _push4(ssrRenderComponent(VBtn, {
                            key: icon.icon,
                            icon: icon.icon,
                            href: icon.link,
                            target: "_blank",
                            class: "mx-2",
                            variant: "text"
                          }, null, _parent4, _scopeId3));
                        });
                        _push4(`<!--]--></div><div class="mt-2"${_scopeId3}> \xA9 ${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())} N\xFBr Djedidi. All rights reserved </div>`);
                      } else {
                        return [
                          createVNode("div", { class: "pt-0 d-none d-md-flex" }, [
                            createVNode(VList, { class: "d-flex" }, {
                              default: withCtx(() => [
                                (openBlock(), createBlock(Fragment, null, renderList(pages, (page) => {
                                  return createVNode(VListItem, {
                                    class: "mx-1",
                                    key: page.title,
                                    to: page.link,
                                    nuxt: ""
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(page.title), 1)
                                    ]),
                                    _: 2
                                  }, 1032, ["to"]);
                                }), 64))
                              ]),
                              _: 1
                            })
                          ]),
                          createVNode("div", null, [
                            (openBlock(), createBlock(Fragment, null, renderList(socialIcons, (icon) => {
                              return createVNode(VBtn, {
                                key: icon.icon,
                                icon: icon.icon,
                                href: icon.link,
                                target: "_blank",
                                class: "mx-2",
                                variant: "text"
                              }, null, 8, ["icon", "href"]);
                            }), 64))
                          ]),
                          createVNode("div", { class: "mt-2" }, " \xA9 " + toDisplayString((/* @__PURE__ */ new Date()).getFullYear()) + " N\xFBr Djedidi. All rights reserved ", 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(VContainer, { class: "d-flex flex-column" }, {
                      default: withCtx(() => [
                        createVNode("div", { class: "pt-0 d-none d-md-flex" }, [
                          createVNode(VList, { class: "d-flex" }, {
                            default: withCtx(() => [
                              (openBlock(), createBlock(Fragment, null, renderList(pages, (page) => {
                                return createVNode(VListItem, {
                                  class: "mx-1",
                                  key: page.title,
                                  to: page.link,
                                  nuxt: ""
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(page.title), 1)
                                  ]),
                                  _: 2
                                }, 1032, ["to"]);
                              }), 64))
                            ]),
                            _: 1
                          })
                        ]),
                        createVNode("div", null, [
                          (openBlock(), createBlock(Fragment, null, renderList(socialIcons, (icon) => {
                            return createVNode(VBtn, {
                              key: icon.icon,
                              icon: icon.icon,
                              href: icon.link,
                              target: "_blank",
                              class: "mx-2",
                              variant: "text"
                            }, null, 8, ["icon", "href"]);
                          }), 64))
                        ]),
                        createVNode("div", { class: "mt-2" }, " \xA9 " + toDisplayString((/* @__PURE__ */ new Date()).getFullYear()) + " N\xFBr Djedidi. All rights reserved ", 1)
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
              createVNode(VResponsive, null, {
                default: withCtx(() => [
                  createVNode(VContainer, { class: "d-flex flex-column" }, {
                    default: withCtx(() => [
                      createVNode("div", { class: "pt-0 d-none d-md-flex" }, [
                        createVNode(VList, { class: "d-flex" }, {
                          default: withCtx(() => [
                            (openBlock(), createBlock(Fragment, null, renderList(pages, (page) => {
                              return createVNode(VListItem, {
                                class: "mx-1",
                                key: page.title,
                                to: page.link,
                                nuxt: ""
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(page.title), 1)
                                ]),
                                _: 2
                              }, 1032, ["to"]);
                            }), 64))
                          ]),
                          _: 1
                        })
                      ]),
                      createVNode("div", null, [
                        (openBlock(), createBlock(Fragment, null, renderList(socialIcons, (icon) => {
                          return createVNode(VBtn, {
                            key: icon.icon,
                            icon: icon.icon,
                            href: icon.link,
                            target: "_blank",
                            class: "mx-2",
                            variant: "text"
                          }, null, 8, ["icon", "href"]);
                        }), 64))
                      ]),
                      createVNode("div", { class: "mt-2" }, " \xA9 " + toDisplayString((/* @__PURE__ */ new Date()).getFullYear()) + " N\xFBr Djedidi. All rights reserved ", 1)
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
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("public/components/footer.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { VContainer as V, _sfc_main as _ };
//# sourceMappingURL=footer-BphUiFS0.mjs.map
