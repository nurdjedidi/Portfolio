<template>
    <section>
      <v-container class="explorer">
        <h2>Animation</h2>
        <p>Below is a nice animation that I've made with css keyframes :</p>
        <v-container class="cube-btn">
        <div class="controls" xs="d-flex">
          <input id="checkbox" type="checkbox" v-model="isChecked"/>
<label class="switch" for="checkbox" @click="startAnimation">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="slider">
    <path
      d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V256c0 17.7 14.3 32 32 32s32-14.3 32-32V32zM143.5 120.6c13.6-11.3 15.4-31.5 4.1-45.1s-31.5-15.4-45.1-4.1C49.7 115.4 16 181.8 16 256c0 132.5 107.5 240 240 240s240-107.5 240-240c0-74.2-33.8-140.6-86.6-184.6c-13.6-11.3-33.8-9.4-45.1 4.1s-9.4 33.8 4.1 45.1c38.9 32.3 63.5 81 63.5 135.4c0 97.2-78.8 176-176 176s-176-78.8-176-176c0-54.4 24.7-103.1 63.5-135.4z"
    ></path>
  </svg>
</label>
<button class="glowbutton" @click="changeColor">
    <div class="wrapper">
        <div class="circle circle-12"></div>
        <div class="circle circle-11"></div>
        <div class="circle circle-10"></div>
        <div class="circle circle-9"></div>
        <div class="circle circle-8"></div>
        <div class="circle circle-7"></div>
        <div class="circle circle-6"></div>
        <div class="circle circle-5"></div>
        <div class="circle circle-4"></div>
        <div class="circle circle-3"></div>
        <div class="circle circle-2"></div>
        <div class="circle circle-1"></div>
    </div>
</button>

    </div>
  </v-container>
        <div class="scene">
            <div ref="cube" class="cube">
                <div class="face front"></div>
                <div class="face back"></div>
                <div class="face right"></div>
                <div class="face left"></div>
                <div class="face top"></div>
                <div class="face bottom"></div>
                <div class="middle-cube">
                    <div class="middle-face middle-front"></div>
                    <div class="middle-face middle-back"></div>
                    <div class="middle-face middle-right"></div>
                    <div class="middle-face middle-left"></div>
                    <div class="middle-face middle-top"></div>
                    <div class="middle-face middle-bottom"></div>
                    <div class="inner-cube">
                        <div class="inner-face inner-front"></div>
                        <div class="inner-face inner-back"></div>
                        <div class="inner-face inner-right"></div>
                        <div class="inner-face inner-left"></div>
                        <div class="inner-face inner-top"></div>
                        <div class="inner-face inner-bottom"></div>
                        <div class="innermost-cube">
                            <div class="innermost-face innermost-front"></div>
                            <div class="innermost-face innermost-back"></div>
                            <div class="innermost-face innermost-right"></div>
                            <div class="innermost-face innermost-left"></div>
                            <div class="innermost-face innermost-top"></div>
                            <div class="innermost-face innermost-bottom"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </v-container>
    </section>
  </template>
  
  <script>
  
  export default {
    name: 'Animation',
    data() {
    return {
      isChecked: false,  
    };
  },
    methods: {
    startAnimation() {
      const cube = this.$refs.cube;
      if (this.isChecked && cube) {
        cube.style.animationPlayState = 'running';
      } else {
        const cube = this.$refs.cube;
        cube.style.animationPlayState = 'paused';
      }
    },
  changeColor() {
  const faces = document.querySelectorAll('.face');
  
  const randomColor = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.251)`;

  faces.forEach(face => {
    face.style.background = randomColor;
  });

  const middleFaces = document.querySelectorAll('.middle-face');
  
  const randomColorM = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.3)`;

  middleFaces.forEach(middleFace => {
    middleFace.style.background = randomColorM;
  });

  const innerFaces = document.querySelectorAll('.inner-face');
  
  const randomColorI = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.3)`;

  innerFaces.forEach(innerFace => {
    innerFace.style.background = randomColorI;
  });

  const innerMostFaces = document.querySelectorAll('.innermost-face');
  
  const randomColorIM = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.1)`;

  innerMostFaces.forEach(innerMostFace => {
    innerMostFace.style.background = randomColorIM;
  });
}
  },
  };
  </script>

  <style>
  
  .scene {
  width: 157.46px; 
  height: 157.46px; 
  perspective: 700px;
  margin-top: 50px; 
  position: absolute;
  left: 38%;
  top: 30%;
  transform: translate(-50%, -50%);
}

.cube, .middle-cube, .inner-cube, .innermost-cube {
  position: relative;
  transform-style: preserve-3d;
}

.cube {
  width: 72%; 
  height: 72%; 
  animation: rotate-outer 5s linear infinite;
}

.middle-cube {
  width: 78.732px;
  height: 78.732px; 
  top: 39.366px; 
  left: 39.366px;
  animation: rotate-middle 5s linear infinite;
}

.inner-cube {
  width: 39.393px; 
  height: 39.393px; 
  top: 19.696px; 
  left: 19.696px; 
  animation: rotate-inner 5s linear infinite;
}

.innermost-cube {
  width: 19.683px; 
  height: 19.683px; 
  top: 9.842px; 
  left: 9.842px; 
}

.face, .middle-face, .inner-face, .innermost-face {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid white;
}

.face {
  width: 157.46px; 
  height: 157.46px; 
  background: rgba(34, 0, 255, 0.251);
  font-size: 20px;
  color: white;
}

.middle-face {
  width: 78.732px; 
  height: 78.732px; 
  background: rgba(255, 0, 255, 0.3);
}

.inner-face {
  width: 39.393px; 
  height: 39.393px; 
  background: rgba(234, 0, 255, 0.3);
}

.innermost-face {
  width: 19.683px; 
  height: 19.683px; 
  background: rgba(255, 0, 0, 1);
}

.front  { transform: rotateY(0deg) translateZ(78.732px); } 
.back   { transform: rotateY(180deg) translateZ(78.732px); } 
.right  { transform: rotateY(90deg) translateZ(78.732px); }
.left   { transform: rotateY(-90deg) translateZ(78.732px); } 
.top    { transform: rotateX(90deg) translateZ(78.732px); } 
.bottom { transform: rotateX(-90deg) translateZ(78.732px); } 

.middle-front  { transform: rotateY(0deg) translateZ(39.366px); } 
.middle-back   { transform: rotateY(180deg) translateZ(39.366px); } 
.middle-right  { transform: rotateY(90deg) translateZ(39.366px); } 
.middle-left   { transform: rotateY(-90deg) translateZ(39.366px); } 
.middle-top    { transform: rotateX(90deg) translateZ(39.366px); }
.middle-bottom { transform: rotateX(-90deg) translateZ(39.366px); } 

.inner-front  { transform: rotateY(0deg) translateZ(19.696px); } 
.inner-back   { transform: rotateY(180deg) translateZ(19.696px); }
.inner-right  { transform: rotateY(90deg) translateZ(19.696px); } 
.inner-left   { transform: rotateY(-90deg) translateZ(19.696px); } 
.inner-top    { transform: rotateX(90deg) translateZ(19.696px); } 
.inner-bottom { transform: rotateX(-90deg) translateZ(19.696px); } 

.innermost-front  { transform: rotateY(0deg) translateZ(9.842px); } 
.innermost-back   { transform: rotateY(180deg) translateZ(9.842px); } 
.innermost-right  { transform: rotateY(90deg) translateZ(9.842px); } 
.innermost-left   { transform: rotateY(-90deg) translateZ(9.842px); } 
.innermost-top    { transform: rotateX(90deg) translateZ(9.842px); } 
.innermost-bottom { transform: rotateX(-90deg) translateZ(9.842px); }


@keyframes rotate-outer {
    0% { transform: rotateX(0deg) rotateY(0deg); }
    100% { transform: rotateX(360deg) rotateY(360deg); }
}
@keyframes rotate-middle {
    0% { transform: rotateX(0deg) rotateY(0deg); }
    100% { transform: rotateX(-360deg) rotateY(720deg); }
}
@keyframes rotate-inner {
    0% { transform: rotateX(0deg) rotateY(0deg); }
    100% { transform: rotateX(720deg) rotateY(-360deg); }
}
@keyframes rotate-innermost {
    0% { transform: rotateX(0deg) rotateY(0deg); }
    100% { transform: rotateX(-720deg) rotateY(-720deg); }
}

.scene:hover .cube > .face {
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }
  
  .scene:hover .middle-cube > .middle-face {
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }
  
  .scene:hover .inner-cube > .inner-face {
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }

.scene:hover .innermost-cube {
    animation: none;
  }  

  .scene:hover .innermost-cube {
    animation: rotate 1.5s linear infinite;
  } 

  @keyframes rotate {
    0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
    100% { transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg); }
  }

  .controls button {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  border: none;
  width: 70px;
  height: 70px;
  padding: 0;
  margin: 25px;
}
 .power { 
  background-image: url('../images/power.png');
  background-position: center;
  background-size: cover; 
  width: 100%;
  height: 100%;
}

#checkbox {
  display: none;
}

.switch {
  position: relative;
  width: 70px;
  height: 70px;
  background-color: rgb(99, 99, 99);
  border-radius: 50%;
  z-index: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgb(126, 126, 126);
  box-shadow: 0px 0px 3px rgb(2, 2, 2) inset;
  margin: 25px;
}
.switch svg {
  width: 1.2em;
}
.switch svg path {
  fill: rgb(48, 48, 48);
}
#checkbox:checked + .switch {
  box-shadow: 0px 0px 1px rgb(151, 243, 255) inset,
    0px 0px 2px rgb(151, 243, 255) inset, 0px 0px 10px rgb(151, 243, 255) inset,
    0px 0px 40px rgb(151, 243, 255), 0px 0px 100px rgb(151, 243, 255),
    0px 0px 5px rgb(151, 243, 255);
  border: 2px solid rgb(255, 255, 255);
  background-color: rgb(146, 180, 184);
}
#checkbox:checked + .switch svg {
  filter: drop-shadow(0px 0px 5px rgb(151, 243, 255));
}
#checkbox:checked + .switch svg path {
  fill: rgb(255, 255, 255);
}

.glowbutton {
  --duration: 7s;
  --easing: linear;
  --c-color-1: rgba(0, 44, 238, 0.7);
  --c-color-2: #00023c;
  --c-color-3: #7203bd;
  --c-color-4: rgba(0, 224, 224, 0.7);
  --c-shadow: rgba(0, 175, 123, 0.5);
  --c-shadow-inset-top: rgba(0, 140, 175, 0.671);
  --c-shadow-inset-bottom: rgba(157, 0, 209, 0.8);
  --c-radial-inner: #002396;
  --c-radial-outer: #00c0b7;
  --c-color: #fff;
  -webkit-tap-highlight-color: transparent;
  outline: none;
  position: relative;
  cursor: pointer;
  border: none;
  display: table;
  border-radius: 24px;
  padding: 0;
  margin: 0;
  text-align: center;
  font-weight: 600;
  font-size: 16px;
  letter-spacing: 0.02em;
  line-height: 1.5;
  color: var(--c-color);
  background: radial-gradient(circle, var(--c-radial-inner), var(--c-radial-outer) 80%);
  box-shadow: 0 0 14px var(--c-shadow);
}

.glowbutton .wrapper .circle.circle-1, .glowbutton .wrapper .circle.circle-9, .glowbutton .wrapper .circle.circle-10 {
  --background: var(--c-color-4);
}

.glowbutton .wrapper .circle.circle-3, .glowbutton .wrapper .circle.circle-4 {
  --background: var(--c-color-2);
  --blur: 14px;
}

.glowbutton .wrapper .circle.circle-5, .glowbutton .wrapper .circle.circle-6 {
  --background: var(--c-color-3);
  --blur: 16px;
}

.glowbutton .wrapper .circle.circle-2, .glowbutton .wrapper .circle.circle-7, .glowbutton .wrapper .circle.circle-8, .glowbutton .wrapper .circle.circle-11, .glowbutton .wrapper .circle.circle-12 {
  --background: var(--c-color-1);
  --blur: 12px;
}

.uiverse .wrapper .circle.circle-1 {
  --x: 0;
  --y: -40px;
  --animation: circle-1;
}

.uiverse .wrapper .circle.circle-2 {
  --x: 92px;
  --y: 8px;
  --animation: circle-2;
}

.uiverse .wrapper .circle.circle-3 {
  --x: -12px;
  --y: -12px;
  --animation: circle-3;
}

.uiverse .wrapper .circle.circle-4 {
  --x: 80px;
  --y: -12px;
  --animation: circle-4;
}

.uiverse .wrapper .circle.circle-5 {
  --x: 12px;
  --y: -4px;
  --animation: circle-5;
}

.uiverse .wrapper .circle.circle-6 {
  --x: 56px;
  --y: 16px;
  --animation: circle-6;
}

.uiverse .wrapper .circle.circle-7 {
  --x: 8px;
  --y: 28px;
  --animation: circle-7;
}

.uiverse .wrapper .circle.circle-8 {
  --x: 28px;
  --y: -4px;
  --animation: circle-8;
}

.uiverse .wrapper .circle.circle-9 {
  --x: 20px;
  --y: -12px;
  --animation: circle-9;
}

.uiverse .wrapper .circle.circle-10 {
  --x: 64px;
  --y: 16px;
  --animation: circle-10;
}

.uiverse .wrapper .circle.circle-11 {
  --x: 4px;
  --y: 4px;
  --animation: circle-11;
}

.uiverse .wrapper .circle.circle-12 {
  --blur: 14px;
  --x: 52px;
  --y: 4px;
  --animation: circle-12;
}

@keyframes circle-1 {
  33% {
    transform: translate(0px, 16px) translateZ(0);
  }

  66% {
    transform: translate(12px, 64px) translateZ(0);
  }
}

@keyframes circle-2 {
  33% {
    transform: translate(80px, -10px) translateZ(0);
  }

  66% {
    transform: translate(72px, -48px) translateZ(0);
  }
}

@keyframes circle-3 {
  33% {
    transform: translate(20px, 12px) translateZ(0);
  }

  66% {
    transform: translate(12px, 4px) translateZ(0);
  }
}

@keyframes circle-4 {
  33% {
    transform: translate(76px, -12px) translateZ(0);
  }

  66% {
    transform: translate(112px, -8px) translateZ(0);
  }
}

@keyframes circle-5 {
  33% {
    transform: translate(84px, 28px) translateZ(0);
  }

  66% {
    transform: translate(40px, -32px) translateZ(0);
  }
}

@keyframes circle-6 {
  33% {
    transform: translate(28px, -16px) translateZ(0);
  }

  66% {
    transform: translate(76px, -56px) translateZ(0);
  }
}

@keyframes circle-7 {
  33% {
    transform: translate(8px, 28px) translateZ(0);
  }

  66% {
    transform: translate(20px, -60px) translateZ(0);
  }
}

@keyframes circle-8 {
  33% {
    transform: translate(32px, -4px) translateZ(0);
  }

  66% {
    transform: translate(56px, -20px) translateZ(0);
  }
}

@keyframes circle-9 {
  33% {
    transform: translate(20px, -12px) translateZ(0);
  }

  66% {
    transform: translate(80px, -8px) translateZ(0);
  }
}

@keyframes circle-10 {
  33% {
    transform: translate(68px, 20px) translateZ(0);
  }

  66% {
    transform: translate(100px, 28px) translateZ(0);
  }
}

@keyframes circle-11 {
  33% {
    transform: translate(4px, 4px) translateZ(0);
  }

  66% {
    transform: translate(68px, 20px) translateZ(0);
  }
}

@keyframes circle-12 {
  33% {
    transform: translate(56px, 0px) translateZ(0);
  }

  66% {
    transform: translate(60px, -32px) translateZ(0);
  }
}

@media (max-width: 768px)  { 
  .scene { 
    margin-top: 45%;
    margin-left: 20%;
    position: relative;
  }

  .controls { 
  display: flex;
}


  .explorer p { 
    display: flex;
  }

  .cube-btn { 
    display: inline-flex;
  }
}

  </style>