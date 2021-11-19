<template>
  <v-list-group v-if="item.show && (item.group || item.links)">
    <template v-slot:activator>
      <v-tooltip :disabled="!tooltip" :left="$vuetify.rtl" :right="!$vuetify.rtl">
        <template v-slot:activator="{ on, attrs }">
          <v-list-item-action class="ma-0 ms-n4 pa-4 pe-10" v-on="on" v-bind="attrs">
            <v-icon v-text="item.icon" :style="item.iconStyle" />
          </v-list-item-action>
        </template>
        <span v-text="$t(item.title)" />
      </v-tooltip>
      <v-list-item-content>
        <v-list-item-title v-text="$t(item.title)" />
      </v-list-item-content>
    </template>
    <v-divider></v-divider>
    <v-list class="py-0">
      <nav-list-item
        v-for="(innerItem, j) in item.links"
        :tooltip="tooltip"
        :item="innerItem" :key="j"
      />
    </v-list>
    <v-divider></v-divider>
  </v-list-group>
  <v-list-item v-else-if="item.show" v-on="item.on" link :to="localePath(item.link)">
    <v-tooltip :disabled="!tooltip" :left="$vuetify.rtl" :right="!$vuetify.rtl">
      <template v-slot:activator="{ on, attrs }">
        <v-list-item-action class="ma-0 ms-n4 pa-4 pe-10" v-on="on" v-bind="attrs">
          <v-icon v-text="item.icon" :style="item.iconStyle" />
        </v-list-item-action>
      </template>
      <span v-text="$t(item.title)" />
    </v-tooltip>
    <v-list-item-content>
      <v-list-item-title v-text="$t(item.title)" />
    </v-list-item-content>
  </v-list-item>
</template>

<script>
export default {
  name: 'nav-list-item',
  props: ['item', 'tooltip']
}
</script>