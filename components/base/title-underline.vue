<template>
  <div class="custom-header">
    <slot></slot>
    <div class="after" :style="{ 'background-color': $vuetify.theme.themes.light.primary }"></div>
  </div>
</template>

<style lang="scss" scoped>
.custom-header {
  height: 100%;
  padding: 5% 0px;
  position: relative;
  margin: 0;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  & .after {
    margin-bottom: 20px;
    content: "";
    height: 2px;
    width: 10%;
    min-width: 50px;
  }
}
</style>