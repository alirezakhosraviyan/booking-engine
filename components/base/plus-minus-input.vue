<template>
  <v-btn-toggle class="root" dense>
    <template>
      <v-btn v-if="$vuetify.rtl" depressed color="success" small class="small-btn border-none" :disabled="value >= max" @click="$emit('input', value + 1)">
        <v-icon color="white">mdi-plus</v-icon>
      </v-btn>
      <v-btn v-else depressed color="error" small class="small-btn border-none" :disabled="value <= min" @click="$emit('input', value - 1)">
        <v-icon color="white">mdi-minus</v-icon>
      </v-btn>
    </template>
    <v-btn depressed color="white" small class="small-btn border-none value-btn" disabled icon>
      {{value}}
    </v-btn>
    <template>
      <v-btn v-if="$vuetify.rtl" depressed color="error" small class="small-btn border-none" :disabled="value <= min" @click="$emit('input', value - 1)">
        <v-icon color="white">mdi-minus</v-icon>
      </v-btn>
      <v-btn v-else depressed color="success" small class="small-btn border-none" :disabled="value >= max" @click="$emit('input', value + 1)">
        <v-icon color="white">mdi-plus</v-icon>
      </v-btn>
    </template>
  </v-btn-toggle>
</template>

<script>
export default {
  name: 'plus-minus-input',
  props: {
    value: {},
    max: {},
    min: { default: 0 },
  },
  mounted() {
    if((typeof this.value !== 'number') || (this.value > this.max)) {
      this.$emit('input', this.value - 1)
    }
  },
  watch: {
    value(to,from) {
      if(to > this.max) {
        this.$emit('input', to - 1)
      }
    },
    max(to,from) {
      if(to < this.value) {
        this.$emit('input', this.value - 1)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.root {
  border: 1px solid rgba(0, 0, 0, 0.12) !important;
  border-radius: 4px !important;
  overflow: hidden;
  .small-btn {
    border-radius: 0px !important;
    min-width: unset !important;
    height: 24px;
    width: 24px !important;
    &.value-btn {
      background-color: white !important;
      color: black !important;
    }
  }
}
</style>