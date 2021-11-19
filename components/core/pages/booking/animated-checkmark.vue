<template>
  <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
    <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
    <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
  </svg>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.checkmark__circle {
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  stroke-width: 2;
  stroke-miterlimit: 10;
  fill: none;
  animation: stroke 3.2s cubic-bezier(0.65, 0, 0.45, 1) forwards infinite;
}
.checkmark {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: block;
  stroke-width: 2;
  stroke-miterlimit: 10;
  box-shadow: inset 0px 0px 0px var(--v-success-base);
  animation: fill 3.2s ease-in-out forwards infinite, scale 3.2s ease-in-out both infinite;
}
.checkmark__check {
  transform-origin: 50% 50%;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  stroke: white;
  stroke-width: 4px;
  animation: stroke-check 3.2s cubic-bezier(0.65, 0, 0.45, 1) forwards infinite;
}
@keyframes stroke {
  18.75%, 100% {
    stroke-dashoffset: 0;
  }
}
@keyframes stroke-check {
  25% {
    stroke-dashoffset: 48;
  }
  34.37%,
  100% {
    stroke-dashoffset: 0;
  }
}
@keyframes scale {
  0%, 28.125%, 37.5%, 100% {
    transform: none;
  }
  32.8125% {
    transform: scale3d(1.1, 1.1, 1);
  }
}
@keyframes fill {
  12.5% {
    box-shadow: inset 0px 0px 0px var(--v-success-base);
  }
  25%,
  100% {
    box-shadow: inset 0px 0px 0px 30px var(--v-success-base);
  }
}
</style>
