<template functional>
  <div></div>
</template>

<script>
export default {
  validate({
    redirect,
    $auth,
    app: {
      localePath
    }
  }) {
    if($auth.loggedIn) {
      redirect(localePath('admin-colors'))
      return true
    }
    else {
      redirect(localePath('admin-login'))
      return false
    }
  },
}
</script>