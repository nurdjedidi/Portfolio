import { withCtx, createVNode, withDirectives, vModelCheckbox, createBlock, openBlock, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrIncludeBooleanAttr, ssrLooseContain } from 'vue/server-renderer';
import { _ as _export_sfc, V as VContainer } from './server.mjs';
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
  name: "Animation",
  data() {
    return {
      isChecked: false
    };
  },
  methods: {
    startAnimation() {
      const cube = this.$refs.cube;
      if (this.isChecked && cube) {
        cube.style.animationPlayState = "running";
      } else {
        const cube2 = this.$refs.cube;
        cube2.style.animationPlayState = "paused";
      }
    },
    changeColor() {
      const faces = (void 0).querySelectorAll(".face");
      const randomColor = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.251)`;
      faces.forEach((face) => {
        face.style.background = randomColor;
      });
      const middleFaces = (void 0).querySelectorAll(".middle-face");
      const randomColorM = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.3)`;
      middleFaces.forEach((middleFace) => {
        middleFace.style.background = randomColorM;
      });
      const innerFaces = (void 0).querySelectorAll(".inner-face");
      const randomColorI = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.3)`;
      innerFaces.forEach((innerFace) => {
        innerFace.style.background = randomColorI;
      });
      const innerMostFaces = (void 0).querySelectorAll(".innermost-face");
      const randomColorIM = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.1)`;
      innerMostFaces.forEach((innerMostFace) => {
        innerMostFace.style.background = randomColorIM;
      });
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<section${ssrRenderAttrs(_attrs)}>`);
  _push(ssrRenderComponent(VContainer, { class: "explorer" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<h2${_scopeId}>Animation</h2><p${_scopeId}>Below is a nice animation that I&#39;ve made with css keyframes :</p>`);
        _push2(ssrRenderComponent(VContainer, { class: "cube-btn" }, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(`<div class="controls" xs="d-flex"${_scopeId2}><input id="checkbox" type="checkbox"${ssrIncludeBooleanAttr(Array.isArray($data.isChecked) ? ssrLooseContain($data.isChecked, null) : $data.isChecked) ? " checked" : ""}${_scopeId2}><label class="switch" for="checkbox"${_scopeId2}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="slider"${_scopeId2}><path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V256c0 17.7 14.3 32 32 32s32-14.3 32-32V32zM143.5 120.6c13.6-11.3 15.4-31.5 4.1-45.1s-31.5-15.4-45.1-4.1C49.7 115.4 16 181.8 16 256c0 132.5 107.5 240 240 240s240-107.5 240-240c0-74.2-33.8-140.6-86.6-184.6c-13.6-11.3-33.8-9.4-45.1 4.1s-9.4 33.8 4.1 45.1c38.9 32.3 63.5 81 63.5 135.4c0 97.2-78.8 176-176 176s-176-78.8-176-176c0-54.4 24.7-103.1 63.5-135.4z"${_scopeId2}></path></svg></label><button class="glowbutton"${_scopeId2}><div class="wrapper"${_scopeId2}><div class="circle circle-12"${_scopeId2}></div><div class="circle circle-11"${_scopeId2}></div><div class="circle circle-10"${_scopeId2}></div><div class="circle circle-9"${_scopeId2}></div><div class="circle circle-8"${_scopeId2}></div><div class="circle circle-7"${_scopeId2}></div><div class="circle circle-6"${_scopeId2}></div><div class="circle circle-5"${_scopeId2}></div><div class="circle circle-4"${_scopeId2}></div><div class="circle circle-3"${_scopeId2}></div><div class="circle circle-2"${_scopeId2}></div><div class="circle circle-1"${_scopeId2}></div></div></button></div>`);
            } else {
              return [
                createVNode("div", {
                  class: "controls",
                  xs: "d-flex"
                }, [
                  withDirectives(createVNode("input", {
                    id: "checkbox",
                    type: "checkbox",
                    "onUpdate:modelValue": ($event) => $data.isChecked = $event
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelCheckbox, $data.isChecked]
                  ]),
                  createVNode("label", {
                    class: "switch",
                    for: "checkbox",
                    onClick: $options.startAnimation
                  }, [
                    (openBlock(), createBlock("svg", {
                      xmlns: "http://www.w3.org/2000/svg",
                      viewBox: "0 0 512 512",
                      class: "slider"
                    }, [
                      createVNode("path", { d: "M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V256c0 17.7 14.3 32 32 32s32-14.3 32-32V32zM143.5 120.6c13.6-11.3 15.4-31.5 4.1-45.1s-31.5-15.4-45.1-4.1C49.7 115.4 16 181.8 16 256c0 132.5 107.5 240 240 240s240-107.5 240-240c0-74.2-33.8-140.6-86.6-184.6c-13.6-11.3-33.8-9.4-45.1 4.1s-9.4 33.8 4.1 45.1c38.9 32.3 63.5 81 63.5 135.4c0 97.2-78.8 176-176 176s-176-78.8-176-176c0-54.4 24.7-103.1 63.5-135.4z" })
                    ]))
                  ], 8, ["onClick"]),
                  createVNode("button", {
                    class: "glowbutton",
                    onClick: $options.changeColor
                  }, [
                    createVNode("div", { class: "wrapper" }, [
                      createVNode("div", { class: "circle circle-12" }),
                      createVNode("div", { class: "circle circle-11" }),
                      createVNode("div", { class: "circle circle-10" }),
                      createVNode("div", { class: "circle circle-9" }),
                      createVNode("div", { class: "circle circle-8" }),
                      createVNode("div", { class: "circle circle-7" }),
                      createVNode("div", { class: "circle circle-6" }),
                      createVNode("div", { class: "circle circle-5" }),
                      createVNode("div", { class: "circle circle-4" }),
                      createVNode("div", { class: "circle circle-3" }),
                      createVNode("div", { class: "circle circle-2" }),
                      createVNode("div", { class: "circle circle-1" })
                    ])
                  ], 8, ["onClick"])
                ])
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
        _push2(`<div class="scene"${_scopeId}><div class="cube"${_scopeId}><div class="face front"${_scopeId}></div><div class="face back"${_scopeId}></div><div class="face right"${_scopeId}></div><div class="face left"${_scopeId}></div><div class="face top"${_scopeId}></div><div class="face bottom"${_scopeId}></div><div class="middle-cube"${_scopeId}><div class="middle-face middle-front"${_scopeId}></div><div class="middle-face middle-back"${_scopeId}></div><div class="middle-face middle-right"${_scopeId}></div><div class="middle-face middle-left"${_scopeId}></div><div class="middle-face middle-top"${_scopeId}></div><div class="middle-face middle-bottom"${_scopeId}></div><div class="inner-cube"${_scopeId}><div class="inner-face inner-front"${_scopeId}></div><div class="inner-face inner-back"${_scopeId}></div><div class="inner-face inner-right"${_scopeId}></div><div class="inner-face inner-left"${_scopeId}></div><div class="inner-face inner-top"${_scopeId}></div><div class="inner-face inner-bottom"${_scopeId}></div><div class="innermost-cube"${_scopeId}><div class="innermost-face innermost-front"${_scopeId}></div><div class="innermost-face innermost-back"${_scopeId}></div><div class="innermost-face innermost-right"${_scopeId}></div><div class="innermost-face innermost-left"${_scopeId}></div><div class="innermost-face innermost-top"${_scopeId}></div><div class="innermost-face innermost-bottom"${_scopeId}></div></div></div></div></div></div>`);
      } else {
        return [
          createVNode("h2", null, "Animation"),
          createVNode("p", null, "Below is a nice animation that I've made with css keyframes :"),
          createVNode(VContainer, { class: "cube-btn" }, {
            default: withCtx(() => [
              createVNode("div", {
                class: "controls",
                xs: "d-flex"
              }, [
                withDirectives(createVNode("input", {
                  id: "checkbox",
                  type: "checkbox",
                  "onUpdate:modelValue": ($event) => $data.isChecked = $event
                }, null, 8, ["onUpdate:modelValue"]), [
                  [vModelCheckbox, $data.isChecked]
                ]),
                createVNode("label", {
                  class: "switch",
                  for: "checkbox",
                  onClick: $options.startAnimation
                }, [
                  (openBlock(), createBlock("svg", {
                    xmlns: "http://www.w3.org/2000/svg",
                    viewBox: "0 0 512 512",
                    class: "slider"
                  }, [
                    createVNode("path", { d: "M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V256c0 17.7 14.3 32 32 32s32-14.3 32-32V32zM143.5 120.6c13.6-11.3 15.4-31.5 4.1-45.1s-31.5-15.4-45.1-4.1C49.7 115.4 16 181.8 16 256c0 132.5 107.5 240 240 240s240-107.5 240-240c0-74.2-33.8-140.6-86.6-184.6c-13.6-11.3-33.8-9.4-45.1 4.1s-9.4 33.8 4.1 45.1c38.9 32.3 63.5 81 63.5 135.4c0 97.2-78.8 176-176 176s-176-78.8-176-176c0-54.4 24.7-103.1 63.5-135.4z" })
                  ]))
                ], 8, ["onClick"]),
                createVNode("button", {
                  class: "glowbutton",
                  onClick: $options.changeColor
                }, [
                  createVNode("div", { class: "wrapper" }, [
                    createVNode("div", { class: "circle circle-12" }),
                    createVNode("div", { class: "circle circle-11" }),
                    createVNode("div", { class: "circle circle-10" }),
                    createVNode("div", { class: "circle circle-9" }),
                    createVNode("div", { class: "circle circle-8" }),
                    createVNode("div", { class: "circle circle-7" }),
                    createVNode("div", { class: "circle circle-6" }),
                    createVNode("div", { class: "circle circle-5" }),
                    createVNode("div", { class: "circle circle-4" }),
                    createVNode("div", { class: "circle circle-3" }),
                    createVNode("div", { class: "circle circle-2" }),
                    createVNode("div", { class: "circle circle-1" })
                  ])
                ], 8, ["onClick"])
              ])
            ]),
            _: 1
          }),
          createVNode("div", { class: "scene" }, [
            createVNode("div", {
              ref: "cube",
              class: "cube"
            }, [
              createVNode("div", { class: "face front" }),
              createVNode("div", { class: "face back" }),
              createVNode("div", { class: "face right" }),
              createVNode("div", { class: "face left" }),
              createVNode("div", { class: "face top" }),
              createVNode("div", { class: "face bottom" }),
              createVNode("div", { class: "middle-cube" }, [
                createVNode("div", { class: "middle-face middle-front" }),
                createVNode("div", { class: "middle-face middle-back" }),
                createVNode("div", { class: "middle-face middle-right" }),
                createVNode("div", { class: "middle-face middle-left" }),
                createVNode("div", { class: "middle-face middle-top" }),
                createVNode("div", { class: "middle-face middle-bottom" }),
                createVNode("div", { class: "inner-cube" }, [
                  createVNode("div", { class: "inner-face inner-front" }),
                  createVNode("div", { class: "inner-face inner-back" }),
                  createVNode("div", { class: "inner-face inner-right" }),
                  createVNode("div", { class: "inner-face inner-left" }),
                  createVNode("div", { class: "inner-face inner-top" }),
                  createVNode("div", { class: "inner-face inner-bottom" }),
                  createVNode("div", { class: "innermost-cube" }, [
                    createVNode("div", { class: "innermost-face innermost-front" }),
                    createVNode("div", { class: "innermost-face innermost-back" }),
                    createVNode("div", { class: "innermost-face innermost-right" }),
                    createVNode("div", { class: "innermost-face innermost-left" }),
                    createVNode("div", { class: "innermost-face innermost-top" }),
                    createVNode("div", { class: "innermost-face innermost-bottom" })
                  ])
                ])
              ])
            ], 512)
          ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/animation.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const animation = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { animation as default };
//# sourceMappingURL=animation-CTCL1hZT.mjs.map
