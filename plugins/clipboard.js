export default (ctx, inject) => {
  const copyText = async (txt) => {
    try {
      if (process.client) {
        await navigator.clipboard.writeText(txt);
        return true
      }
    } catch (e) {}
    return false
  }

  ctx.$copyText = copyText
  inject('copyText', copyText)
}