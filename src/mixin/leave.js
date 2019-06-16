export default {
  data() {
    return {
      confirmLeave: false,
    };
  },
  async beforeRouteLeave(to, from, next) {
    if (!this.confirmLeave) {
      try {
        /* eslint-disable no-alert */

        const r = window.confirm('可能有未保存的内容，确认离开？');
        if (r) {
          this.confirmLeave = true;
          next();
        } else {
          next(false);
        }
        /*
        await kr.ui.confirm(this, '可能有未保存的内容，确认离开？');
        this.confirmLeave = true;
        next(); */
      } catch (e) {
        next(false);
      }
    } else {
      next();
    }
  },
};
