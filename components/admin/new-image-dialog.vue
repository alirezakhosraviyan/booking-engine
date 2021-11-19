<template>
  <v-card class="pa-1">
    <v-card-title class="pa-2">
      {{$t('Please choose an image')}}
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text style="max-height: calc(100vh - 194px);overflow-y: auto" class="px-2 py-4">
      <v-file-input
        dir="ltr"
        v-model="file"
        outlined
        dense
        hide-details
        prepend-inner-icon="mdi-paperclip"
        :prepend-icon="false"
        show-size
        accept="image/*"
        :label="$t('Choose File')"
      ></v-file-input>
      <v-expand-transition>
        <div v-if="src" class="pt-4">
          <v-card >
            <v-img :src="src"></v-img>
          </v-card>
        </div>
      </v-expand-transition>
      <div class="pt-4">
        <v-icon small>mdi-asterisk</v-icon>
        {{$t('It is advised to use an image with an aspect ratio of __ASPECT_RATIO__').replace('__ASPECT_RATIO__', aspectRatio)}}
      </div>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions class="pa-2">
      <v-row justify="end" dense class="mb-n1">
        <v-col cols="6" sm="auto">
          <v-btn block color="error" @click="$emit('close')">
            <v-icon class="ms-n1 me-1">mdi-close</v-icon>
            {{$t('Cancel')}}
          </v-btn>
        </v-col>
        <v-col cols="6" sm="auto">
          <v-btn block color="success" @click="submit" :disabled="!file">
            <v-icon class="ms-n1 me-1">mdi-check</v-icon>
            {{$t('Submit')}}
          </v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script>
import cropImg, { blobToImg } from "~/util/functions/crop-img"

export default {
  props: ['aspect-ratio'],
  data: () => ({
    file: null,
    src: '',
  }),
  methods: {
    async submit() {
      let img = (await cropImg(this.file, this.aspectRatioNumeric))
      this.$emit('submit', img)
    }
  },
  watch: {
    file: {
      deep: true,
      async handler(to) {
          this.src = 
          to 
          ? await cropImg(this.file, this.aspectRatioNumeric).then(blobToImg)
          : ''
      }
    }
  },
  computed: {
    aspectRatioNumeric() {
      return eval(this.aspectRatio)
    }
  },
}
</script>