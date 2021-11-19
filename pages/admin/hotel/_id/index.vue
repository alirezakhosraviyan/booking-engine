<template>
  <div></div>
</template>

<script>
export default {
  validate({ redirect, params, app: { localePath } }) {
    redirect(localePath({ name: 'admin-hotel-id-slider', params: { id: params.id } }))
  }
}
</script>
