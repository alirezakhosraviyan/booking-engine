<template>
  <v-card>
    <v-card-title>{{$t('Reservation Verification')}}</v-card-title>
    <v-card-subtitle>{{$t('Please enter the following details')}}</v-card-subtitle>
    <v-form v-model="isValid" @submit.prevent="submitData">
      <v-card-text>
        <v-row dense>
          <v-col cols="12" v-for="(_, idx) in inputs" :key="`input-field-${idx}`">
            <v-text-field
              v-bind="inputs[idx].props"
              :rules="inputs[idx].rules"
              v-model="outputs[idx].value"
              :prepend-inner-icon="inputs[idx].icon"
              :label="$t(inputs[idx].title)"
              outlined
              dense
            />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="px-4">
        <v-row align="center" justify="end" dense>
          <v-col cols="6" sm="6" md="auto">
            <v-btn block color="success" type="submit" :disabled="!isValid">
              <v-icon class="d-none d-sm-inline-block ms-n1 me-1">mdi-check</v-icon>
              {{$t('Verify')}}
            </v-btn>
          </v-col>
          <v-col cols="6" sm="6" md="auto">
            <v-btn block color="error" @click="$emit('close')">
              <v-icon class="d-none d-sm-inline-block ms-n1 me-1">
                {{$vuetify.rtl ? 'mdi-arrow-right' : 'mdi-arrow-left'}}
              </v-icon>
              {{$t('Return')}}
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      isValid: false,
      outputs: [
        { name: 'national_code' , value: '' },
        { name: 'reference_id'  , value: '' },
      ],
      inputs: [
        {
          props: { dir: 'ltr' },
          title: 'National ID or Passport Number',
          name: 'national_code',
          icon: 'mdi-card-account-details-outline',
          rules: [
            v => (v.length !== 0)   || this.$t('This field is required'),
            v => v.match(/\d{10}/g) || this.$t('Please enter a valid national ID or passport number'),
            v => v.length == 10     || this.$t('Please enter a valid national ID or passport number'),
          ]
        },
        {
          props: { dir: 'ltr' },
          title: 'Reference Number',
          name: 'reference_id',
          icon: 'mdi-text-box-outline',
          rules: [
            v => (v.length !== 0) || this.$t('This field is required'),
          ]
        }
      ]
    }
  },
  methods: {
    submitData() {
      this.$emit(
        'submit',
        this.outputs.reduce(
          (acc,curr) => ({ ...acc, [curr.name]: curr.value }),
          {}
        )
      )
    }
  }
};
</script>