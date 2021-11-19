<template>
  <div></div>
</template>

<script>
export default {
  validate({ redirect, params, app: { localePath } }) {
    redirect(localePath({ name: 'admin-hotel-id-rooms-room-images', params: { id: params.id, room: params.room } }))
  }
}
</script>
