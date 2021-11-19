<template>
  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
    <circle
      class="path circle"
      :fill="$vuetify.theme.themes.light.error"
      stroke="none"
      stroke-width="0"
      cx="60.1"
      cy="60.1"
      r="60.1"
    />
    <line
      class="path line"
      fill="none"
      stroke="#fff"
      stroke-width="10.1"
      stroke-miterlimit="10"
      x1="37.60"
      y1="37.60"
      x2="82.60"
      y2="82.60"
    />
    <line
      class="path line"
      fill="none"
      stroke="#fff"
      stroke-width="10.1"
      stroke-miterlimit="10"
      x1="37.60"
      y1="82.60"
      x2="82.60"
      y2="37.60"
    />
  </svg>
</template>

<style lang="scss" scoped>
svg {
  width: 56px;
  height: 56px;
  display: block;
}
.path {
  stroke-dasharray: 1000;
  stroke-dashoffset: 0;
}
.path.circle {
  -webkit-animation: circle 3.2s linear infinite;
  animation: circle 3.2s linear infinite;
  transform-origin: center center
}
.path.line {
  stroke-dashoffset: 1000;

  -webkit-animation: dash 3.2s linear infinite;
  animation: dash 3.2s linear infinite;

  animation-name: dash;
  animation-duration: 3.2s;
  animation-timing-function: linear;

  animation-iteration-count: a;
  animation-direction: a;
  animation-fill-mode: a;
  animation-play-state: a;
}
@-webkit-keyframes dash {
  0% {
    stroke-dashoffset: 1000;
  }
  20% {
    stroke-dashoffset: 1000;
  }
  100% {
    stroke-dashoffset: 0;
  }
}
@keyframes dash {
  0% {
    stroke-dashoffset: 1000;
  }
  20% {
    stroke-dashoffset: 1000;
  }
  100% {
    stroke-dashoffset: 0;
  }
}
@keyframes circle {
  0% {
    transform: scale(0)
  }
  12.5% {
    transform: scale(1)
  }
  100% {
    transform: scale(1)
  }
}
@-webkit-keyframes circle {
  0% {
    transform: scale(0)
  }
  12.5% {
    transform: scale(1)
  }
  100% {
    transform: scale(1)
  }
}
</style>