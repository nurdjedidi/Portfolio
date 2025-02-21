import { f as buildAssetsURL } from '../_/nitro.mjs';
import { defineComponent, withCtx, createVNode, createTextVNode, toDisplayString, createBlock, openBlock, Fragment, renderList, toRef, mergeProps, computed, withDirectives, vShow, resolveDirective, shallowRef, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';
import { B as Background, _ as _sfc_main$2 } from './footer-BNNUX0Im.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import { V as VRow, a as VCol } from './VRow-BHXPRnQ3.mjs';
import { V as VCard, a as VCardText } from './VCard-Bg8RgQh1.mjs';
import { V as VResponsive, c as VImg, a as VExpandXTransition, d as VAvatar, e as VFadeTransition } from './VList-DZJLyHZ4.mjs';
import { V as VApp, a as VMain, p as useGroup, u as useRender, R as Ripple, q as useBorder, r as useVariant, c as useDensity, s as useElevation, f as useRounded, t as useSize, v as useGroupItem, w as useLink, x as genOverlays, o as VIcon, i as VDefaultsProvider, y as makeVariantProps, z as makeTagProps, A as makeGroupProps, k as makeComponentProps, B as useResizeObserver, C as makeSizeProps, D as makeRouterProps, m as makeRoundedProps, E as makeGroupItemProps, F as makeElevationProps, l as makeDensityProps, G as makeBorderProps } from './VMain-C2JahtCb.mjs';
import { g as genericComponent, p as propsFactory, e as provideTheme, z as provideDefaults, U as useLocale, A as useProxiedModel, m as makeThemeProps, B as deepEqual, G as useRtl, $ as useDisplay, a0 as useGoTo, O as EventProp, I as IconValue, a1 as makeDisplayProps, a2 as focusableChildren } from './server.mjs';
import { V as VContainer } from './VContainer-DPDpy6NR.mjs';
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

const urbanstyle = "" + buildAssetsURL("urbanstyle.QgN-5x_1.avif");
const news = "" + buildAssetsURL("news.TMP8sPdg.avif");
const fitness = "" + buildAssetsURL("portfolio-nutriweb.DCO15oTY.avif");
function calculateUpdatedTarget(_ref) {
  let {
    selectedElement,
    containerElement,
    isRtl,
    isHorizontal
  } = _ref;
  const containerSize = getOffsetSize(isHorizontal, containerElement);
  const scrollPosition = getScrollPosition(isHorizontal, isRtl, containerElement);
  const childrenSize = getOffsetSize(isHorizontal, selectedElement);
  const childrenStartPosition = getOffsetPosition(isHorizontal, selectedElement);
  const additionalOffset = childrenSize * 0.4;
  if (scrollPosition > childrenStartPosition) {
    return childrenStartPosition - additionalOffset;
  } else if (scrollPosition + containerSize < childrenStartPosition + childrenSize) {
    return childrenStartPosition - containerSize + childrenSize + additionalOffset;
  }
  return scrollPosition;
}
function getScrollSize(isHorizontal, element) {
  const key = isHorizontal ? "scrollWidth" : "scrollHeight";
  return (element == null ? void 0 : element[key]) || 0;
}
function getClientSize(isHorizontal, element) {
  const key = isHorizontal ? "clientWidth" : "clientHeight";
  return (element == null ? void 0 : element[key]) || 0;
}
function getScrollPosition(isHorizontal, rtl, element) {
  if (!element) {
    return 0;
  }
  const {
    scrollLeft,
    offsetWidth,
    scrollWidth
  } = element;
  if (isHorizontal) {
    return rtl ? scrollWidth - offsetWidth + scrollLeft : scrollLeft;
  }
  return element.scrollTop;
}
function getOffsetSize(isHorizontal, element) {
  const key = isHorizontal ? "offsetWidth" : "offsetHeight";
  return (element == null ? void 0 : element[key]) || 0;
}
function getOffsetPosition(isHorizontal, element) {
  const key = isHorizontal ? "offsetLeft" : "offsetTop";
  return (element == null ? void 0 : element[key]) || 0;
}
const VSlideGroupSymbol = Symbol.for("vuetify:v-slide-group");
const makeVSlideGroupProps = propsFactory({
  centerActive: Boolean,
  direction: {
    type: String,
    default: "horizontal"
  },
  symbol: {
    type: null,
    default: VSlideGroupSymbol
  },
  nextIcon: {
    type: IconValue,
    default: "$next"
  },
  prevIcon: {
    type: IconValue,
    default: "$prev"
  },
  showArrows: {
    type: [Boolean, String],
    validator: (v) => typeof v === "boolean" || ["always", "desktop", "mobile"].includes(v)
  },
  ...makeComponentProps(),
  ...makeDisplayProps({
    mobile: null
  }),
  ...makeTagProps(),
  ...makeGroupProps({
    selectedClass: "v-slide-group-item--active"
  })
}, "VSlideGroup");
const VSlideGroup = genericComponent()({
  name: "VSlideGroup",
  props: makeVSlideGroupProps(),
  emits: {
    "update:modelValue": (value) => true
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      isRtl
    } = useRtl();
    const {
      displayClasses,
      mobile
    } = useDisplay(props);
    const group = useGroup(props, props.symbol);
    const isOverflowing = shallowRef(false);
    const scrollOffset = shallowRef(0);
    const containerSize = shallowRef(0);
    shallowRef(0);
    const isHorizontal = computed(() => props.direction === "horizontal");
    const {
      resizeRef: containerRef
    } = useResizeObserver();
    const {
      resizeRef: contentRef
    } = useResizeObserver();
    useGoTo();
    computed(() => {
      return {
        container: containerRef.el,
        duration: 200,
        easing: "easeOutQuart"
      };
    });
    computed(() => {
      if (!group.selected.value.length) return -1;
      return group.items.value.findIndex((item) => item.id === group.selected.value[0]);
    });
    computed(() => {
      if (!group.selected.value.length) return -1;
      return group.items.value.findIndex((item) => item.id === group.selected.value[group.selected.value.length - 1]);
    });
    const isFocused = shallowRef(false);
    function scrollToChildren(children, center) {
      {
        calculateUpdatedTarget({
          containerElement: containerRef.el,
          isHorizontal: isHorizontal.value,
          isRtl: isRtl.value,
          selectedElement: children
        });
      }
    }
    function onScroll(e) {
      const {
        scrollTop,
        scrollLeft
      } = e.target;
      scrollOffset.value = isHorizontal.value ? scrollLeft : scrollTop;
    }
    function onFocusin(e) {
      isFocused.value = true;
      if (!isOverflowing.value || !contentRef.el) return;
      for (const el of e.composedPath()) {
        for (const item of contentRef.el.children) {
          if (item === el) {
            scrollToChildren(item);
            return;
          }
        }
      }
    }
    function onFocusout(e) {
      isFocused.value = false;
    }
    let ignoreFocusEvent = false;
    function onFocus(e) {
      var _a;
      if (!ignoreFocusEvent && !isFocused.value && !(e.relatedTarget && ((_a = contentRef.el) == null ? void 0 : _a.contains(e.relatedTarget)))) focus();
      ignoreFocusEvent = false;
    }
    function onFocusAffixes() {
      ignoreFocusEvent = true;
    }
    function onKeydown(e) {
      if (!contentRef.el) return;
      function toFocus(location) {
        e.preventDefault();
        focus(location);
      }
      if (isHorizontal.value) {
        if (e.key === "ArrowRight") {
          toFocus(isRtl.value ? "prev" : "next");
        } else if (e.key === "ArrowLeft") {
          toFocus(isRtl.value ? "next" : "prev");
        }
      } else {
        if (e.key === "ArrowDown") {
          toFocus("next");
        } else if (e.key === "ArrowUp") {
          toFocus("prev");
        }
      }
      if (e.key === "Home") {
        toFocus("first");
      } else if (e.key === "End") {
        toFocus("last");
      }
    }
    function getSiblingElement(el, location) {
      if (!el) return void 0;
      let sibling = el;
      do {
        sibling = sibling == null ? void 0 : sibling[location === "next" ? "nextElementSibling" : "previousElementSibling"];
      } while (sibling == null ? void 0 : sibling.hasAttribute("disabled"));
      return sibling;
    }
    function focus(location) {
      if (!contentRef.el) return;
      let el;
      if (!location) {
        const focusable = focusableChildren(contentRef.el);
        el = focusable[0];
      } else if (location === "next") {
        el = getSiblingElement(contentRef.el.querySelector(":focus"), location);
        if (!el) return focus("first");
      } else if (location === "prev") {
        el = getSiblingElement(contentRef.el.querySelector(":focus"), location);
        if (!el) return focus("last");
      } else if (location === "first") {
        el = contentRef.el.firstElementChild;
        if (el == null ? void 0 : el.hasAttribute("disabled")) el = getSiblingElement(el, "next");
      } else if (location === "last") {
        el = contentRef.el.lastElementChild;
        if (el == null ? void 0 : el.hasAttribute("disabled")) el = getSiblingElement(el, "prev");
      }
      if (el) {
        el.focus({
          preventScroll: true
        });
      }
    }
    function scrollTo(location) {
      const direction = isHorizontal.value && isRtl.value ? -1 : 1;
      const offsetStep = (location === "prev" ? -direction : direction) * containerSize.value;
      scrollOffset.value + offsetStep;
      if (isHorizontal.value && isRtl.value && containerRef.el) {
        const {
          scrollWidth,
          offsetWidth: containerWidth
        } = containerRef.el;
      }
    }
    const slotProps = computed(() => ({
      next: group.next,
      prev: group.prev,
      select: group.select,
      isSelected: group.isSelected
    }));
    const hasAffixes = computed(() => {
      switch (props.showArrows) {
        // Always show arrows on desktop & mobile
        case "always":
          return true;
        // Always show arrows on desktop
        case "desktop":
          return !mobile.value;
        // Show arrows on mobile when overflowing.
        // This matches the default 2.2 behavior
        case true:
          return isOverflowing.value || Math.abs(scrollOffset.value) > 0;
        // Always show on mobile
        case "mobile":
          return mobile.value || isOverflowing.value || Math.abs(scrollOffset.value) > 0;
        // https://material.io/components/tabs#scrollable-tabs
        // Always show arrows when
        // overflowed on desktop
        default:
          return !mobile.value && (isOverflowing.value || Math.abs(scrollOffset.value) > 0);
      }
    });
    const hasPrev = computed(() => {
      return Math.abs(scrollOffset.value) > 1;
    });
    const hasNext = computed(() => {
      if (!containerRef.value) return false;
      const scrollSize = getScrollSize(isHorizontal.value, containerRef.el);
      const clientSize = getClientSize(isHorizontal.value, containerRef.el);
      const scrollSizeMax = scrollSize - clientSize;
      return scrollSizeMax - Math.abs(scrollOffset.value) > 1;
    });
    useRender(() => createVNode(props.tag, {
      "class": ["v-slide-group", {
        "v-slide-group--vertical": !isHorizontal.value,
        "v-slide-group--has-affixes": hasAffixes.value,
        "v-slide-group--is-overflowing": isOverflowing.value
      }, displayClasses.value, props.class],
      "style": props.style,
      "tabindex": isFocused.value || group.selected.value.length ? -1 : 0,
      "onFocus": onFocus
    }, {
      default: () => {
        var _a2, _b2;
        var _a, _b, _c;
        return [hasAffixes.value && createVNode("div", {
          "key": "prev",
          "class": ["v-slide-group__prev", {
            "v-slide-group__prev--disabled": !hasPrev.value
          }],
          "onMousedown": onFocusAffixes,
          "onClick": () => hasPrev.value && scrollTo("prev")
        }, [(_a2 = (_a = slots.prev) == null ? void 0 : _a.call(slots, slotProps.value)) != null ? _a2 : createVNode(VFadeTransition, null, {
          default: () => [createVNode(VIcon, {
            "icon": isRtl.value ? props.nextIcon : props.prevIcon
          }, null)]
        })]), createVNode("div", {
          "key": "container",
          "ref": containerRef,
          "class": "v-slide-group__container",
          "onScroll": onScroll
        }, [createVNode("div", {
          "ref": contentRef,
          "class": "v-slide-group__content",
          "onFocusin": onFocusin,
          "onFocusout": onFocusout,
          "onKeydown": onKeydown
        }, [(_b = slots.default) == null ? void 0 : _b.call(slots, slotProps.value)])]), hasAffixes.value && createVNode("div", {
          "key": "next",
          "class": ["v-slide-group__next", {
            "v-slide-group__next--disabled": !hasNext.value
          }],
          "onMousedown": onFocusAffixes,
          "onClick": () => hasNext.value && scrollTo("next")
        }, [(_b2 = (_c = slots.next) == null ? void 0 : _c.call(slots, slotProps.value)) != null ? _b2 : createVNode(VFadeTransition, null, {
          default: () => [createVNode(VIcon, {
            "icon": isRtl.value ? props.prevIcon : props.nextIcon
          }, null)]
        })])];
      }
    }));
    return {
      selected: group.selected,
      scrollTo,
      scrollOffset,
      focus,
      hasPrev,
      hasNext
    };
  }
});
const VChipGroupSymbol = Symbol.for("vuetify:v-chip-group");
const makeVChipGroupProps = propsFactory({
  column: Boolean,
  filter: Boolean,
  valueComparator: {
    type: Function,
    default: deepEqual
  },
  ...makeVSlideGroupProps(),
  ...makeComponentProps(),
  ...makeGroupProps({
    selectedClass: "v-chip--selected"
  }),
  ...makeTagProps(),
  ...makeThemeProps(),
  ...makeVariantProps({
    variant: "tonal"
  })
}, "VChipGroup");
const VChipGroup = genericComponent()({
  name: "VChipGroup",
  props: makeVChipGroupProps(),
  emits: {
    "update:modelValue": (value) => true
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      themeClasses
    } = provideTheme(props);
    const {
      isSelected,
      select,
      next,
      prev,
      selected
    } = useGroup(props, VChipGroupSymbol);
    provideDefaults({
      VChip: {
        color: toRef(props, "color"),
        disabled: toRef(props, "disabled"),
        filter: toRef(props, "filter"),
        variant: toRef(props, "variant")
      }
    });
    useRender(() => {
      const slideGroupProps = VSlideGroup.filterProps(props);
      return createVNode(VSlideGroup, mergeProps(slideGroupProps, {
        "class": ["v-chip-group", {
          "v-chip-group--column": props.column
        }, themeClasses.value, props.class],
        "style": props.style
      }), {
        default: () => {
          var _a;
          return [(_a = slots.default) == null ? void 0 : _a.call(slots, {
            isSelected,
            select,
            next,
            prev,
            selected: selected.value
          })];
        }
      });
    });
    return {};
  }
});
const makeVChipProps = propsFactory({
  activeClass: String,
  appendAvatar: String,
  appendIcon: IconValue,
  closable: Boolean,
  closeIcon: {
    type: IconValue,
    default: "$delete"
  },
  closeLabel: {
    type: String,
    default: "$vuetify.close"
  },
  draggable: Boolean,
  filter: Boolean,
  filterIcon: {
    type: IconValue,
    default: "$complete"
  },
  label: Boolean,
  link: {
    type: Boolean,
    default: void 0
  },
  pill: Boolean,
  prependAvatar: String,
  prependIcon: IconValue,
  ripple: {
    type: [Boolean, Object],
    default: true
  },
  text: String,
  modelValue: {
    type: Boolean,
    default: true
  },
  onClick: EventProp(),
  onClickOnce: EventProp(),
  ...makeBorderProps(),
  ...makeComponentProps(),
  ...makeDensityProps(),
  ...makeElevationProps(),
  ...makeGroupItemProps(),
  ...makeRoundedProps(),
  ...makeRouterProps(),
  ...makeSizeProps(),
  ...makeTagProps({
    tag: "span"
  }),
  ...makeThemeProps(),
  ...makeVariantProps({
    variant: "tonal"
  })
}, "VChip");
const VChip = genericComponent()({
  name: "VChip",
  directives: {
    Ripple
  },
  props: makeVChipProps(),
  emits: {
    "click:close": (e) => true,
    "update:modelValue": (value) => true,
    "group:selected": (val) => true,
    click: (e) => true
  },
  setup(props, _ref) {
    let {
      attrs,
      emit,
      slots
    } = _ref;
    const {
      t
    } = useLocale();
    const {
      borderClasses
    } = useBorder(props);
    const {
      colorClasses,
      colorStyles,
      variantClasses
    } = useVariant(props);
    const {
      densityClasses
    } = useDensity(props);
    const {
      elevationClasses
    } = useElevation(props);
    const {
      roundedClasses
    } = useRounded(props);
    const {
      sizeClasses
    } = useSize(props);
    const {
      themeClasses
    } = provideTheme(props);
    const isActive = useProxiedModel(props, "modelValue");
    const group = useGroupItem(props, VChipGroupSymbol, false);
    const link = useLink(props, attrs);
    const isLink = computed(() => props.link !== false && link.isLink.value);
    const isClickable = computed(() => !props.disabled && props.link !== false && (!!group || props.link || link.isClickable.value));
    const closeProps = computed(() => ({
      "aria-label": t(props.closeLabel),
      onClick(e) {
        e.preventDefault();
        e.stopPropagation();
        isActive.value = false;
        emit("click:close", e);
      }
    }));
    function onClick(e) {
      var _a;
      emit("click", e);
      if (!isClickable.value) return;
      (_a = link.navigate) == null ? void 0 : _a.call(link, e);
      group == null ? void 0 : group.toggle();
    }
    function onKeyDown(e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick(e);
      }
    }
    return () => {
      var _a;
      const Tag = link.isLink.value ? "a" : props.tag;
      const hasAppendMedia = !!(props.appendIcon || props.appendAvatar);
      const hasAppend = !!(hasAppendMedia || slots.append);
      const hasClose = !!(slots.close || props.closable);
      const hasFilter = !!(slots.filter || props.filter) && group;
      const hasPrependMedia = !!(props.prependIcon || props.prependAvatar);
      const hasPrepend = !!(hasPrependMedia || slots.prepend);
      const hasColor = !group || group.isSelected.value;
      return isActive.value && withDirectives(createVNode(Tag, mergeProps({
        "class": ["v-chip", {
          "v-chip--disabled": props.disabled,
          "v-chip--label": props.label,
          "v-chip--link": isClickable.value,
          "v-chip--filter": hasFilter,
          "v-chip--pill": props.pill,
          [`${props.activeClass}`]: props.activeClass && ((_a = link.isActive) == null ? void 0 : _a.value)
        }, themeClasses.value, borderClasses.value, hasColor ? colorClasses.value : void 0, densityClasses.value, elevationClasses.value, roundedClasses.value, sizeClasses.value, variantClasses.value, group == null ? void 0 : group.selectedClass.value, props.class],
        "style": [hasColor ? colorStyles.value : void 0, props.style],
        "disabled": props.disabled || void 0,
        "draggable": props.draggable,
        "tabindex": isClickable.value ? 0 : void 0,
        "onClick": onClick,
        "onKeydown": isClickable.value && !isLink.value && onKeyDown
      }, link.linkProps), {
        default: () => {
          var _a3;
          var _a2;
          return [genOverlays(isClickable.value, "v-chip"), hasFilter && createVNode(VExpandXTransition, {
            "key": "filter"
          }, {
            default: () => [withDirectives(createVNode("div", {
              "class": "v-chip__filter"
            }, [!slots.filter ? createVNode(VIcon, {
              "key": "filter-icon",
              "icon": props.filterIcon
            }, null) : createVNode(VDefaultsProvider, {
              "key": "filter-defaults",
              "disabled": !props.filterIcon,
              "defaults": {
                VIcon: {
                  icon: props.filterIcon
                }
              }
            }, slots.filter)]), [[vShow, group.isSelected.value]])]
          }), hasPrepend && createVNode("div", {
            "key": "prepend",
            "class": "v-chip__prepend"
          }, [!slots.prepend ? createVNode(Fragment, null, [props.prependIcon && createVNode(VIcon, {
            "key": "prepend-icon",
            "icon": props.prependIcon,
            "start": true
          }, null), props.prependAvatar && createVNode(VAvatar, {
            "key": "prepend-avatar",
            "image": props.prependAvatar,
            "start": true
          }, null)]) : createVNode(VDefaultsProvider, {
            "key": "prepend-defaults",
            "disabled": !hasPrependMedia,
            "defaults": {
              VAvatar: {
                image: props.prependAvatar,
                start: true
              },
              VIcon: {
                icon: props.prependIcon,
                start: true
              }
            }
          }, slots.prepend)]), createVNode("div", {
            "class": "v-chip__content",
            "data-no-activator": ""
          }, [(_a3 = (_a2 = slots.default) == null ? void 0 : _a2.call(slots, {
            isSelected: group == null ? void 0 : group.isSelected.value,
            selectedClass: group == null ? void 0 : group.selectedClass.value,
            select: group == null ? void 0 : group.select,
            toggle: group == null ? void 0 : group.toggle,
            value: group == null ? void 0 : group.value.value,
            disabled: props.disabled
          })) != null ? _a3 : props.text]), hasAppend && createVNode("div", {
            "key": "append",
            "class": "v-chip__append"
          }, [!slots.append ? createVNode(Fragment, null, [props.appendIcon && createVNode(VIcon, {
            "key": "append-icon",
            "end": true,
            "icon": props.appendIcon
          }, null), props.appendAvatar && createVNode(VAvatar, {
            "key": "append-avatar",
            "end": true,
            "image": props.appendAvatar
          }, null)]) : createVNode(VDefaultsProvider, {
            "key": "append-defaults",
            "disabled": !hasAppendMedia,
            "defaults": {
              VAvatar: {
                end: true,
                image: props.appendAvatar
              },
              VIcon: {
                end: true,
                icon: props.appendIcon
              }
            }
          }, slots.append)]), hasClose && createVNode("button", mergeProps({
            "key": "close",
            "class": "v-chip__close",
            "type": "button",
            "data-testid": "close-chip"
          }, closeProps.value), [!slots.close ? createVNode(VIcon, {
            "key": "close-icon",
            "icon": props.closeIcon,
            "size": "x-small"
          }, null) : createVNode(VDefaultsProvider, {
            "key": "close-defaults",
            "defaults": {
              VIcon: {
                icon: props.closeIcon,
                size: "x-small"
              }
            }
          }, slots.close)])];
        }
      }), [[resolveDirective("ripple"), isClickable.value && props.ripple, null]]);
    };
  }
});
const _sfc_main$1 = {
  name: "Projects",
  data() {
    return {
      projects: [
        {
          img: urbanstyle,
          title: "Urbanstyle (desktop only)",
          description: "Below is the link to a fictitious online shop that I designed.",
          skills: [
            { name: "HTML", icon: "mdi-language-html5" },
            { name: "CSS", icon: "mdi-language-css3" },
            { name: "Vue.js", icon: "mdi-vuejs" },
            { name: "Vuetify", icon: "mdi-vuetify" },
            { name: "Node.js", icon: "mdi-nodejs" }
          ],
          link: "https://urbanstyle-mvwkc.ondigitalocean.app/"
        },
        {
          img: news,
          title: "World news",
          description: "Below is a link to see the latest news in your country.",
          skills: [
            { name: "HTML", icon: "mdi-language-html5" },
            { name: "CSS", icon: "mdi-language-css3" },
            { name: "Vue.js", icon: "mdi-vuejs" },
            { name: "Node.js", icon: "mdi-nodejs" },
            { name: "API", icon: "mdi-access-point" }
          ],
          link: "/news"
        },
        {
          img: fitness,
          title: "NutriWeb (prototype)",
          description: "Below is the link to a fitness and health monitoring project.",
          skills: [
            { name: "HTML", icon: "mdi-language-html5" },
            { name: "CSS", icon: "mdi-language-css3" },
            { name: "Vue.js", icon: "mdi-vuejs" },
            { name: "Vuetify", icon: "mdi-vuetify" },
            { name: "Nuxt.js", icon: "mdi-nuxt" },
            { name: "Node.js", icon: "mdi-nodejs" },
            { name: "MySQL", icon: "mdi-database" },
            { name: "API", icon: "mdi-access-point" }
          ],
          link: "https://softai.info"
        }
      ]
    };
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}>`);
  _push(ssrRenderComponent(VRow, null, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<!--[-->`);
        ssrRenderList($data.projects, (projects, index) => {
          _push2(ssrRenderComponent(VCol, {
            cols: "12",
            sm: "6",
            md: "4",
            key: index
          }, {
            default: withCtx((_2, _push3, _parent3, _scopeId2) => {
              if (_push3) {
                _push3(ssrRenderComponent(VCard, {
                  rounded: "lg",
                  color: "#FFFFFF00",
                  class: "border-thin d-flex flex-column hover-transition"
                }, {
                  default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                    if (_push4) {
                      _push4(ssrRenderComponent(VImg, {
                        height: "200px",
                        width: "100%",
                        src: projects.img,
                        loading: "lazy",
                        alt: projects.title,
                        class: "card-image"
                      }, null, _parent4, _scopeId3));
                      _push4(ssrRenderComponent(VCardText, { class: "card-content d-flex flex-column flex-grow-1" }, {
                        default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                          if (_push5) {
                            _push5(`<h2 class="card-title"${_scopeId4}>${ssrInterpolate(projects.title)}</h2><p class="card-description"${_scopeId4}>${ssrInterpolate(projects.description)}</p>`);
                            _push5(ssrRenderComponent(VChipGroup, {
                              class: "card-skill d-flex flex-wrap",
                              column: ""
                            }, {
                              default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                if (_push6) {
                                  _push6(`<!--[-->`);
                                  ssrRenderList(projects.skills, (skill, skillIndex) => {
                                    _push6(ssrRenderComponent(VChip, {
                                      key: skillIndex,
                                      "prepend-icon": skill.icon,
                                      class: "d-flex"
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`${ssrInterpolate(skill.name)}`);
                                        } else {
                                          return [
                                            createTextVNode(toDisplayString(skill.name), 1)
                                          ];
                                        }
                                      }),
                                      _: 2
                                    }, _parent6, _scopeId5));
                                  });
                                  _push6(`<!--]-->`);
                                } else {
                                  return [
                                    (openBlock(true), createBlock(Fragment, null, renderList(projects.skills, (skill, skillIndex) => {
                                      return openBlock(), createBlock(VChip, {
                                        key: skillIndex,
                                        "prepend-icon": skill.icon,
                                        class: "d-flex"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(skill.name), 1)
                                        ]),
                                        _: 2
                                      }, 1032, ["prepend-icon"]);
                                    }), 128))
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent5, _scopeId4));
                            _push5(`<a${ssrRenderAttr("href", projects.link)} target="_blank" class="card-link mt-auto"${_scopeId4}>See the projects</a>`);
                          } else {
                            return [
                              createVNode("h2", { class: "card-title" }, toDisplayString(projects.title), 1),
                              createVNode("p", { class: "card-description" }, toDisplayString(projects.description), 1),
                              createVNode(VChipGroup, {
                                class: "card-skill d-flex flex-wrap",
                                column: ""
                              }, {
                                default: withCtx(() => [
                                  (openBlock(true), createBlock(Fragment, null, renderList(projects.skills, (skill, skillIndex) => {
                                    return openBlock(), createBlock(VChip, {
                                      key: skillIndex,
                                      "prepend-icon": skill.icon,
                                      class: "d-flex"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(skill.name), 1)
                                      ]),
                                      _: 2
                                    }, 1032, ["prepend-icon"]);
                                  }), 128))
                                ]),
                                _: 2
                              }, 1024),
                              createVNode("a", {
                                href: projects.link,
                                target: "_blank",
                                class: "card-link mt-auto"
                              }, "See the projects", 8, ["href"])
                            ];
                          }
                        }),
                        _: 2
                      }, _parent4, _scopeId3));
                    } else {
                      return [
                        createVNode(VImg, {
                          height: "200px",
                          width: "100%",
                          src: projects.img,
                          loading: "lazy",
                          alt: projects.title,
                          class: "card-image"
                        }, null, 8, ["src", "alt"]),
                        createVNode(VCardText, { class: "card-content d-flex flex-column flex-grow-1" }, {
                          default: withCtx(() => [
                            createVNode("h2", { class: "card-title" }, toDisplayString(projects.title), 1),
                            createVNode("p", { class: "card-description" }, toDisplayString(projects.description), 1),
                            createVNode(VChipGroup, {
                              class: "card-skill d-flex flex-wrap",
                              column: ""
                            }, {
                              default: withCtx(() => [
                                (openBlock(true), createBlock(Fragment, null, renderList(projects.skills, (skill, skillIndex) => {
                                  return openBlock(), createBlock(VChip, {
                                    key: skillIndex,
                                    "prepend-icon": skill.icon,
                                    class: "d-flex"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(skill.name), 1)
                                    ]),
                                    _: 2
                                  }, 1032, ["prepend-icon"]);
                                }), 128))
                              ]),
                              _: 2
                            }, 1024),
                            createVNode("a", {
                              href: projects.link,
                              target: "_blank",
                              class: "card-link mt-auto"
                            }, "See the projects", 8, ["href"])
                          ]),
                          _: 2
                        }, 1024)
                      ];
                    }
                  }),
                  _: 2
                }, _parent3, _scopeId2));
              } else {
                return [
                  createVNode(VCard, {
                    rounded: "lg",
                    color: "#FFFFFF00",
                    class: "border-thin d-flex flex-column hover-transition"
                  }, {
                    default: withCtx(() => [
                      createVNode(VImg, {
                        height: "200px",
                        width: "100%",
                        src: projects.img,
                        loading: "lazy",
                        alt: projects.title,
                        class: "card-image"
                      }, null, 8, ["src", "alt"]),
                      createVNode(VCardText, { class: "card-content d-flex flex-column flex-grow-1" }, {
                        default: withCtx(() => [
                          createVNode("h2", { class: "card-title" }, toDisplayString(projects.title), 1),
                          createVNode("p", { class: "card-description" }, toDisplayString(projects.description), 1),
                          createVNode(VChipGroup, {
                            class: "card-skill d-flex flex-wrap",
                            column: ""
                          }, {
                            default: withCtx(() => [
                              (openBlock(true), createBlock(Fragment, null, renderList(projects.skills, (skill, skillIndex) => {
                                return openBlock(), createBlock(VChip, {
                                  key: skillIndex,
                                  "prepend-icon": skill.icon,
                                  class: "d-flex"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(skill.name), 1)
                                  ]),
                                  _: 2
                                }, 1032, ["prepend-icon"]);
                              }), 128))
                            ]),
                            _: 2
                          }, 1024),
                          createVNode("a", {
                            href: projects.link,
                            target: "_blank",
                            class: "card-link mt-auto"
                          }, "See the projects", 8, ["href"])
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
          }, _parent2, _scopeId));
        });
        _push2(`<!--]-->`);
      } else {
        return [
          (openBlock(true), createBlock(Fragment, null, renderList($data.projects, (projects, index) => {
            return openBlock(), createBlock(VCol, {
              cols: "12",
              sm: "6",
              md: "4",
              key: index
            }, {
              default: withCtx(() => [
                createVNode(VCard, {
                  rounded: "lg",
                  color: "#FFFFFF00",
                  class: "border-thin d-flex flex-column hover-transition"
                }, {
                  default: withCtx(() => [
                    createVNode(VImg, {
                      height: "200px",
                      width: "100%",
                      src: projects.img,
                      loading: "lazy",
                      alt: projects.title,
                      class: "card-image"
                    }, null, 8, ["src", "alt"]),
                    createVNode(VCardText, { class: "card-content d-flex flex-column flex-grow-1" }, {
                      default: withCtx(() => [
                        createVNode("h2", { class: "card-title" }, toDisplayString(projects.title), 1),
                        createVNode("p", { class: "card-description" }, toDisplayString(projects.description), 1),
                        createVNode(VChipGroup, {
                          class: "card-skill d-flex flex-wrap",
                          column: ""
                        }, {
                          default: withCtx(() => [
                            (openBlock(true), createBlock(Fragment, null, renderList(projects.skills, (skill, skillIndex) => {
                              return openBlock(), createBlock(VChip, {
                                key: skillIndex,
                                "prepend-icon": skill.icon,
                                class: "d-flex"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(skill.name), 1)
                                ]),
                                _: 2
                              }, 1032, ["prepend-icon"]);
                            }), 128))
                          ]),
                          _: 2
                        }, 1024),
                        createVNode("a", {
                          href: projects.link,
                          target: "_blank",
                          class: "card-link mt-auto"
                        }, "See the projects", 8, ["href"])
                      ]),
                      _: 2
                    }, 1024)
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
  }, _parent));
  _push(`</div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("public/components/Projects.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const Projects = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "projects",
  __ssrInlineRender: true,
  setup(__props) {
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
                              _push5(`<p id="services" class="mt-2 text-h5 font-weight-bold text-md-h4"${_scopeId4}> What to expect </p><p class="mt-4 text-body-1 text-medium-emphasis"${_scopeId4}> Below you&#39;ll find a list of some of the projects I&#39;ve completed. Please note that, for the moment, these are only personal projects and therefore not functional. </p>`);
                            } else {
                              return [
                                createVNode("p", {
                                  id: "services",
                                  class: "mt-2 text-h5 font-weight-bold text-md-h4"
                                }, " What to expect "),
                                createVNode("p", { class: "mt-4 text-body-1 text-medium-emphasis" }, " Below you'll find a list of some of the projects I've completed. Please note that, for the moment, these are only personal projects and therefore not functional. ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(VResponsive, {
                          class: "mx-auto",
                          width: "100%"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(Projects, null, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(Projects)
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
                              }, " What to expect "),
                              createVNode("p", { class: "mt-4 text-body-1 text-medium-emphasis" }, " Below you'll find a list of some of the projects I've completed. Please note that, for the moment, these are only personal projects and therefore not functional. ")
                            ]),
                            _: 1
                          }),
                          createVNode(VResponsive, {
                            class: "mx-auto",
                            width: "100%"
                          }, {
                            default: withCtx(() => [
                              createVNode(Projects)
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
                            }, " What to expect "),
                            createVNode("p", { class: "mt-4 text-body-1 text-medium-emphasis" }, " Below you'll find a list of some of the projects I've completed. Please note that, for the moment, these are only personal projects and therefore not functional. ")
                          ]),
                          _: 1
                        }),
                        createVNode(VResponsive, {
                          class: "mx-auto",
                          width: "100%"
                        }, {
                          default: withCtx(() => [
                            createVNode(Projects)
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
            _push2(ssrRenderComponent(_sfc_main$2, null, null, _parent2, _scopeId));
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
                          }, " What to expect "),
                          createVNode("p", { class: "mt-4 text-body-1 text-medium-emphasis" }, " Below you'll find a list of some of the projects I've completed. Please note that, for the moment, these are only personal projects and therefore not functional. ")
                        ]),
                        _: 1
                      }),
                      createVNode(VResponsive, {
                        class: "mx-auto",
                        width: "100%"
                      }, {
                        default: withCtx(() => [
                          createVNode(Projects)
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(_sfc_main$2)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/projects.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=projects-CVFwkVpe.mjs.map
