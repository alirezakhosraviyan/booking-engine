<template>
  <v-card elevation="1">
    <v-card-title>{{$t('Primary Information')}}</v-card-title>
    <v-card-subtitle>{{$t('In this section, you can edit your businesses\' primary information')}}</v-card-subtitle>
    <v-form @submit.prevent="editInfo">
      <v-card-text class="pb-0">
        <v-row>
          <v-col v-for="{ lang, dir, title } in languages" :key="lang" cols="12" lg="6">
            <v-card elevation="1">
              <v-card-title :dir="dir">{{title}}</v-card-title>
              <v-card-text class="pb-2">
                <v-row>
                  <v-col cols="12" v-for="field in fields.multiLang" :key="field.name">
                    <component
                      v-bind="field.props"
                      v-model="data[field.name][lang]"
                      :is="field.component"
                      :dir="dir"
                      :prepend-inner-icon="field.icon"
                      :label="$t(field.title)"
                      outlined
                      dense
                      hide-details
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6" v-for="field in fields.other" :key="field.name">
            <component
              v-model="data[field.name]"
              hide-details
              :is="field.component"
              :prepend-inner-icon="field.icon"
              outlined
              dense
              v-bind="field.props"
              :label="$t(field.title)"
              :row-height="1"
              no-resize
            />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="px-4 pt-0 pb-2">
        <v-row justify="end">
          <v-col cols="12" sm="auto">
            <v-btn block color="success" type="submit">
              {{$t('Submit')}}
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import { mapState, mapMutations } from "vuex";

import VTextField from "vuetify/lib/components/VTextField"
import VTextarea from "vuetify/lib/components/VTextarea"

import { ENGINE_CONFIG_EDIT } from "~/api"

export default {
  head() {
    return {
      title: this.$t('Primary Information')
    }
  },
  data() {
    let info = this.$store.state.info
    return {
      fields: {
        multiLang: [
          {
            name: 'title',
            title: 'Title',
            icon: 'mdi-format-text-variant-outline',
            component: VTextField
          },
          {
            name: 'description',
            title: 'Description',
            icon: 'mdi-information-outline',
            component: VTextarea,
            props: {
              height: '150',
              noResize: true,
              rowHeight: 1
            }
          },
          {
            name: 'terms',
            title: 'Terms and Conditions',
            icon: 'mdi-text-subject',
            component: VTextarea,
            props: {
              height: '150',
              noResize: true,
              rowHeight: 1
            }
          },
          {
            name: 'notes',
            title: 'Notes',
            icon: 'mdi-alert-circle-outline',
            component: VTextarea,
            props: {
              height: '150',
              noResize: true,
              rowHeight: 1
            }
          },
        ],
        other: [
          {
            name: 'email',
            title: 'Email',
            icon: 'mdi-at',
            component: VTextField,
            props: {
              dir: 'ltr'
            }
          },
          {
            name: 'website',
            title: 'Website',
            icon: 'mdi-web',
            component: VTextField,
            props: {
              dir: 'ltr'
            }
          },
        ]
      },
      languages: [
        { lang: 'fa', dir: 'rtl', title: 'فارسی'   },
        { lang: 'en', dir: 'ltr', title: 'English' }
      ],
      data: {
        title:       { en: '', fa: '', ...info.title       },
        description: { en: '', fa: '', ...info.description },
        terms:       { en: '', fa: '', ...info.terms       },
        notes:       { en: '', fa: '', ...info.notes       },
        email: info.email,
        website: info.website,
      }
    }
  },
  computed: mapState({ id: state => state.info.id }),
  methods: {
    ...mapMutations(['setInfo']),
    async editInfo() {
      try {
        await this.$axios.put(
          ENGINE_CONFIG_EDIT.replace('__ENGINE_ID__', this.id),
          this.data
        );
        this.setInfo(this.data)
      } catch (error) {}
    }
  }
}
</script>