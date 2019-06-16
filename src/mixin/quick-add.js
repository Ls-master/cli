import { getEntityForm, postEntity } from 'wrapper/ajax/entity';
import { getRelationModuleForm } from 'wrapper/ajax/field';

export default {
  data() {
    return {
      nowQuickAdd: null,
      quickAddDialog: {
        title: '快速新增',
        visible: false,
      },
      quickAdd: {
        initDataflow: [{
          api: getRelationModuleForm,
          prepare: () => {
            const { key, scene: { relationId } } = this.nowQuickAdd.meta;
            return {
              pathParams: {
                key,
                moduleInfoId: relationId,
              },
            };
          },
          effect: ['detail'],
        }],
        submitDataflow: [{
          api: postEntity,
          prepare: ['form_to_data_data', () => {
            const { scene: { relationId } } = this.nowQuickAdd.meta;
            return {
              pathParams: {
                moduleInfoId: relationId,
              },
            };
          }],
        }],
        env: {
          QUICK_MODE: true,
          SIMPLE: true,
        },
      },
    };
  },
  methods: {
    handleQuickAddLayoutChange(nv) {
      if (Array.isArray(nv) && nv.length) {
        this.quickAddDialog.title = nv[0].name;
      }
    },
    handleStartQuickAdd(component) {
      const { scene: { relationId } } = component.meta;
      if (this.auth && this.auth.MODULE && !this.auth.MODULE[`${relationId}:create`]) {
        kr.ui.confirm(this, '很抱歉，您没有权限，请联系管理员获取权限', '提示', {
          confirmButtonText: '确定',
          showCancelButton: false,
          type: 'warning',
        });
        return false;
      }
      this.nowQuickAdd = component;
      this.quickAddDialog.visible = true;
      return true;
    },
    async handleQuickAdd() {
      const [result] = await this.$refs.quickAdd.submit();
      const newData = result['0,0'];
      const newValue = { label: newData.moduleDataName, value: newData.id };
      const { nowQuickAdd } = this;
      nowQuickAdd.runtime_related_data.push(newValue);
      if (Array.isArray(nowQuickAdd.value)) {
        nowQuickAdd.setValue(nowQuickAdd.value.concat(newValue.value));
      } else {
        nowQuickAdd.setValue(newValue.value);
      }
      this.quickAddDialog.visible = false;
    },
  },
};
