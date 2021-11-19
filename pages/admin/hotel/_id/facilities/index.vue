<template>
  <div>
    <v-dialog
      v-if="loading"
      content-class="elevation-0 h-100 d-flex flex-column align-center justify-center"
      light
      no-click-animation
      overlay-color="white"
      v-model="loading"
      persistent
    >
      <v-progress-circular
        v-if="loading"
        :size="70"
        :width="7"
        color="primary"
        indeterminate
      />
    </v-dialog>
    <v-dialog max-width="500" v-model="newAmenityDialog">
      <v-fade-transition>
        <new-amenity-dialog
          v-if="newAmenityDialog"
          @submit="createNewAmenity"
          @close="newAmenityDialog=false"
        />
      </v-fade-transition>
    </v-dialog>
    <v-dialog max-width="500" v-model="editImageDialog">
      <v-fade-transition>
        <new-image-dialog
          v-if="editImageDialog"
          aspect-ratio="1"
          @submit="setAmenityImage"
          @close="editImageDialog=false"
        />
      </v-fade-transition>
    </v-dialog>
    <v-card-title class="black--text pa-2">{{$t('Facilities')}}</v-card-title>
    <v-card-text class="pa-2 pb-0">
      <v-row>
        <template v-for="(amenity,idx) in hotelsDic[id].info.hotel.amenities">
          <v-col
            v-if="amenity && amenity.title"
            :key="idx"
            cols="12"
            sm="6"
            md="4"
          >
            <v-card
              elevation="1"
              class="rounded"
            >
              <div class="p-relative overflow-hidden">
                <v-img class="secondary" :src="amenity.image" :aspect-ratio="1" />
                <div class="overlay d-flex flex-column actions">
                  <div class="mt-auto px-3">
                    <v-row align="center" justify="space-between" dense>
                      <v-col cols="auto">
                        <v-card-title class="text-h5 white--text">
                          {{ amenity.title[$i18n.locale] }}
                        </v-card-title>
                      </v-col>
                      <v-col cols="auto">
                        <v-btn icon color="white" @click="editImageDialog=true;facilityToEdit=amenity._id">
                          <v-icon>
                            mdi-pencil
                          </v-icon>
                        </v-btn>
                      </v-col>
                    </v-row>
                  </div>
                </div>
              </div>
            </v-card>
          </v-col>
        </template>
        <v-col cols="12" sm="6" md="4">
          <v-responsive :aspect-ratio="1">
            <v-card
              flat
              style="border: 3px dashed var(--v-secondary-darken2)"
              class="h-100 v-100 d-flex flex-row align-center justify-center"
              @click="newAmenityDialog = true"
            >
              <v-icon x-large>mdi-plus</v-icon>
            </v-card>
          </v-responsive>
        </v-col>
      </v-row>
    </v-card-text>
  </div>
</template>

<script>
import { mapState } from "vuex"

import NewImageDialog from "~/components/admin/new-image-dialog"
import NewAmenityDialog from "~/components/admin/new-amenity-dialog"

import { IMAGES, EDIT_AMENITY } from "~/api"

export default {
  head() {
    return {
      title: this.$t('Facilities')
    }
  },
  asyncData({ params }) {
    return { id: params.id }
  },
  data: () => ({
    editImageDialog: false,
    newAmenityDialog: false,
    facilityToEdit: null,
    loading: false,
  }),
  methods: {
    async setAmenityImage(image) {
      this.editImageDialog = false
      this.loading = true
      let submitData = {
        image,
        type: 'amenity',
        hotelId: this.id,
        hostName: this.$store.state.info.hostName,
        amenityId: this.facilityToEdit,
        caption: '',
        main: true,
      }
      let formData = Object.keys(submitData).reduce((acc, curr) => {
        acc.append(curr, submitData[curr])
        return acc
      }, new FormData())

      try {
        await this.$axios.post(IMAGES, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        await this.refreshConfig()
      } catch (error) {}
      finally {
        this.loading = false
      }
    },
    async createNewAmenity(title) {
      this.newAmenityDialog = false
      this.loading = true
      try {
        await this.$axios.post(
          (EDIT_AMENITY
          .replace("__ENGINE_ID__", this.$store.state.info.id)
          .replace("__HOTEL_ID__", this.id)),
          { title, image: '' }
        )
        setTimeout(
          () =>  this.refreshConfig()
          .then(() => this.$forceUpdate())
          .catch(() => {}),
          1000
        )
      } catch (error) {}
      finally {
        this.loading = false
      }
    }
  },
  computed: mapState(['hotelsDic']),
  components: { NewImageDialog, NewAmenityDialog },
}
</script>

<style lang="scss" scoped>
.actions {
  background: linear-gradient(0deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 50%);
}
</style>