<template>
  <div class="custom-header">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.custom-header {
  padding-top: 30px;
  position: relative;
  margin: 0;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  &::before {
    content: "";
    position: absolute;
    right: calc(50% - 1px);
    top: 0;
    height: 24px;
    width: 2px;
    background-color: black;
  }
}
</style>