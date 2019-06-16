<template>
  <Container
          @click="handleClick"
          ref="container"
          :runtime_validate="runtime_validate"
          :meta="meta"
          :disabled="conf_element_props.disabled"
          :env="finalEnv"
  >
    <KrInputGroup
            ref="field"
            slot="field"
            v-bind="[local_element_props, element_props, runtime_element_props]"
            v-model="value"
    >
    </KrInputGroup>
  </Container>
</template>

<script>
import fieldMixin from '../basic/field-mixin';
import KrInputGroup from '../../../krInputGroup';

export default {
  INDEX: ['INPUT_GROUP'],
  mixins: [
    fieldMixin,
  ],
  components: {
    KrInputGroup
  },
  methods: {
    refresh() {},
    getFormItem() {
      const { field } = this.$refs;
      return field.getFormItem();
    },
    async doValidate(form) {
      const { field } = this.$refs;
      await new Promise((resolve, reject) => {
        let [ k, v ] = this.getKV();
        // let reg = /^(?=^.{3,255}$)(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d+)*(\/\w+\.\w+)*([?&]\w+=\w*)*$/;
        let reg = /^http(s)?:\/\/.+$/g;

        if (v) {
          let errs = v.reduce((per, item, index) => {

            let { label, targetValue, type, urlHref } = item;
            if(label.length == 0){
              per[index] = '二级菜单名称必填!';
            }else if(label.length > 8){
              per[index] = '二级菜单名称不能超过8个字符!';
            }else{
              if(!type){
                per[index] = '二级菜单类型必填!';
              }else{
                if(type== 2 && !targetValue){
                  per[index] = '关联对象必填!';
                }else if(type == 7 && !urlHref){
                  per[index] = 'URL地址必填!';
                }else if(type == 7 && !reg.test(urlHref)){
                  per[index] = 'URL地址格式错误!';
                }
              }
            }
            // if (label.length === 0 && !targetValue) {
            //   per[index] = '二级菜单名称和关联对象都为必填！'
            // } else if (label.length > 8 && !targetValue) {
            //   per[index] = '二级菜单名称不能超过8个字符且关联对象必须选择！';
            // } else if (label.length === 0 && targetValue) {
            //   per[index] = '二级菜单名称为必填！';
            // } else if (label.length > 8 && targetValue) {
            //   per[index] = '二级菜单名称不能超过8个字符！';
            // } else if (!targetValue) {
            //   per[index] = '关联对象必须选择！';
            // }
            return per;
          }, {})

          if (Object.keys(errs).length > 0) {
            field.setErr(errs);
            reject();
          } else {
            resolve();
          }
        } else {
          this.setError('二级菜单名称不能超过8个字符且关联对象必须选择！');
          reject();
        }

        resolve();
      });
    }
  },
  created() {
    this.setValue(this.meta.scene.related_data && this.meta.scene.related_data.options || []);
  }
}
</script>

<style scoped>

</style>