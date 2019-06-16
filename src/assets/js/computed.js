export default {
  pathBreadList() {
    try {
      return JSON.parse(this.$root.$route.query.pathBreadList)
    } catch (e) {
      return []
    }
  }
}