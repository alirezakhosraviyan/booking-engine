<template>
  <v-card class="pa-1">
    <v-card-title class="pa-2">
      {{$t('New Facility')}}
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text style="max-height: calc(100vh - 194px);overflow-y: auto" class="px-2 py-4">
      <v-row dense>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="title.en"
            label="English Title"
            dir="ltr"
            outlined
            dense
            hide-details
          >
            <template v-slot:prepend-inner>
              <div class="d-flex flex-row" dir="ltr">
                <v-icon class="mx-n1">mdi-alpha-e</v-icon>
                <v-icon class="mx-n1">mdi-alpha-n</v-icon>
              </div>
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="title.fa"
            label="عنوان فارسی"
            outlined
            dense
            hide-details
          >
            <template v-slot:prepend-inner>
              <div class="d-flex flex-row" dir="ltr">
                <v-icon class="mx-n1">mdi-alpha-f</v-icon>
                <v-icon class="mx-n1">mdi-alpha-a</v-icon>
              </div>
            </template>
          </v-text-field>
        </v-col>
      </v-row>
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
          <v-btn block color="success" @click="$emit('submit', title)" :disabled="!title.fa || !title.en">
            <v-icon class="ms-n1 me-1">mdi-check</v-icon>
            {{$t('Submit')}}
          </v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    title: {
      en: '',
      fa: '',
    }
  }),
}
</script>