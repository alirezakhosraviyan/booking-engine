<template>
  <v-card>
    <v-card-title class="pa-4">{{title}}</v-card-title>
    <v-card-subtitle class="px-4 pb-4">{{$t('List of Targets')}}</v-card-subtitle>
    <v-card-text class="px-4 pb-4">
      <v-simple-table class="elevation-1">
        <thead>
          <tr>
            <th>{{$t('Phone Number')}}</th>
            <th>{{$t('Times Used')}}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="targets.length == 0">
            <td colspan="2" class="text-center text-subtitle-2">
              {{$t('No Targets Found')}}
            </td>
          </tr>
          <tr v-for="(row,i) in targets" :key="i">
            <td>{{ row.target }}</td>
            <td>{{ row.numOfUse }}</td>
          </tr>
        </tbody>
      </v-simple-table>
    </v-card-text>
    <v-card-actions class="px-4 pb-4">
      <v-row justify="end" no-gutters>
        <v-col cols="auto">
          <v-btn @click="$emit('close')" color="error">
            <v-icon class="ms-n1 me-1">mdi-close</v-icon>
            {{$t('Return')}}
          </v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: ['title', 'targets']
}
</script>