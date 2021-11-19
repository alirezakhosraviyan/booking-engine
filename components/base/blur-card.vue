<template>
  <div class="card rounded overflow-hidden">
    <div class="background">
      <slot name="background"></slot>
    </div>
    <div class="foreground">
      <slot name="foreground"></slot>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.card {
  position: relative;
  overflow: hidden;
  .background {
    transition: filter 0.3s ease-in-out;
    filter: blur(2px);
  }
  &:hover .background {
    filter: blur(0px);
  }
  .foreground {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 1;
    transform-origin: center center;
    transition: all 0.3s ease-in-out;
    transform: scale(1);
  }
  &:hover .foreground {
    opacity: 0;
    transform: scale(0.95);
  }

}
</style>