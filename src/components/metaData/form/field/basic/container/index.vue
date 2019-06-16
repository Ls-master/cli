<template lang="html">
  <div v-if="env.PURE">
    <el-form-item
      :error="err"
      :required="required"
      class="comp-md-form-field-basic-container-item"
      :style="meta.style && meta.style.kr_form_item"
    >
      <span slot="label">
        {{meta.name}}
        <slot name="icon"/>
        <span slot="icon" v-if="element_props.tooltip" style="margin-left: 3px">
          <el-tooltip effect="dark" :content="element_props.tooltip" placement="top-start" ref="tooltip">
            <i class="icon iconfont icon-question"></i>
          </el-tooltip>
        </span>

        <span
          v-html="title_right"
          v-if="env.TITLE_RIGHT"
          class="title_right_common"
          @click="handleTitleRight"/>

        <Help
          :description="meta.description"
          v-if="meta.description"
        />
        <span class="edit-hint" v-if="meta.edit_tip">({{meta.edit_tip}})</span>
      </span>
      <slot name="field"/>
    </el-form-item>
  </div>
  <div v-else-if="env.READONLY" class="comp-md-form-field-basic-container  comp-md-form-field-basic-container-readonly">
    <el-form-item
      :error="err"
      :required="required"
      class="comp-md-form-field-basic-container-item"
      :style="meta.style && meta.style.kr_form_item">
      <span slot="label">
        {{meta.name}}
        <slot name="icon"/>
        <span
          v-html="title_right"
          v-if="env.TITLE_RIGHT"
          class="title_right"
          @click="handleTitleRight">
        </span>
      </span>
      <div class="view">
        <slot name="view"/>
      </div>
      <div v-show="!env.READONLY">
        <slot name="field"/>
      </div>
    </el-form-item>
  </div>
  <div
    v-else
    class="comp-md-form-field-basic-container"
    :class="[disabled ? 'lock' : env.MAX ? 'mexEdit' : 'edit', env.MAX ? 'max-container' : '']"
    @click="!editing&&$emit('click')"
  >
    <el-form-item
      :error="err"
      :required="required"
      class="comp-md-form-field-basic-container-item"
      :class="[env.MAX ? '' : 'container-row-layout' ]"
      :style="meta.style && meta.style.kr_form_item">
      <span class="container-label" slot="label">
        <el-popover
          placement="top"
          trigger="hover"
          popper-class="detail-popper"
          :open-delay="200"
          :disabled="meta.name&&meta.name.length > 8 ? false : true"
          style="display: inline-block"
          >
          <div class="content">
            <div class="text">{{meta.name}}</div>
          </div>
          <div slot="reference" class="item">
            <div class="text">{{meta.name | krEllipsis(9)}}</div>
          </div>
        </el-popover>
        <!-- {{meta.name | krEllipsis(8)}} -->
        <slot name="icon"/>
        <span slot="icon" v-if="element_props.tooltip" style="margin-left: 3px">
          <el-tooltip effect="dark" :content="element_props.tooltip" placement="top-start" ref="tooltip">
            <i class="icon iconfont icon-question"></i>
          </el-tooltip>
        </span>
        <span
                v-html="title_right"
                v-if="env.TITLE_RIGHT"
                class="title_right_common"
                @click="handleTitleRight">
        </span>
      </span>
      <div v-show="!editing" class="view">
        <slot name="view"/>
      </div>
      <div v-show="editing" class="field">
        <slot name="field"/>
      </div>
    </el-form-item>
  </div>
</template>

<script>
export default {
  props: {
    meta: kr.vue.getPropObject(),
    runtime_validate: kr.vue.getPropArray(),
    disabled: kr.vue.getPropBoolean(false),
    env: kr.vue.getPropObject(),
  },
  data() {
    return {
      err: '',
      editing: false
    }
  },
  computed: {
    element_props() {
      return this.meta.scene.element_props || {};
    },
    required() {
      let required = false;
      try {
        const { runtime_validate } = this;
        const { validate } = this.meta.scene;
        required = runtime_validate.concat(validate).some(rule => {
          return rule.required;
        });
      } catch (e) {
        e;
      }
      return required;
    },
    title_right() {
      const { icon, label, handle } = this.meta.env && this.meta.env.TITLE_RIGHT;
      let vhtml = '';
      if(icon) {
        vhtml += `<i class="icon iconfont ${icon}" style="font-size: 12px; margin-right: 5px;"></i>`;
      }
      if(label) {
        vhtml += `<span>${label}</span>`
      }
      return vhtml;
    }
  },
  methods: {
    setEditing(nv) {
      this.editing = nv;
    },
    setError(msg) {
      this.err = msg;
      if (msg) {
        this.timer = setTimeout(() => {
          this.err = '';
        }, 3000);
      }
    },
    handleTitleRight() {
      kr.dom.stop();
      const { handle, prepare } = this.meta.env && this.meta.env.TITLE_RIGHT;
      const component = this.$parent;

      if(!handle) {
        return;
      }
      let result = kr.script.exec(handle, component, prepare);
      this.$emit('handleTitleRight', result);
    }
  },
  components: {
    Help: require('../help').default
  }
}
</script>

<style lang="scss">

  // .comp-md-form-field-basic-container-readonly:hover {
  //   background-color: #ffffff !important;
  // }

  .comp-md-form-field-basic-container-item-title-panel {
    display: flex;
    /*justify-content: center;*/
  }

  .comp-md-form-field-basic-container-item {
    .title_right {
      position: absolute;
      right: 0;
      font-size: 12px;
      color: #525975;
      line-height: 24px;
      cursor: pointer;
      // &:hover {
      //   color: $color-blue;
      // }
    }
    .title_right_common {
      font-size: 12px;
      color: #525975;
      line-height: 24px;
      float: right;
      cursor: pointer;
    }
    .el-form-item__content {
      .view {
        > span {
          float: left; //奇怪的样式问题
          word-break: break-word;
          user-select: text;
        }
      }
    }
    .edit-hint {
      color: #9DA2B3;
      font-size: 12px;
    }
    .text{
      user-select: text;
    }
  }

  .max-container {
    padding-right: 40px !important;
  }

  .comp-md-form-field-basic-container {
    position: relative;
    padding: 6px 12px;
    &:hover {
      cursor: pointer;
      background-color: #F6F7FB;
      &.lock {
        &:after {
          position: absolute;
          right: 12px;
          bottom: 6px;
          font-family:"iconfont";
          content: '\e6f4';
          font-size: 16px;
          line-height: 36px;
        }
      }
      &.edit {
        &:after {
          position: absolute;
          right: 12px;
          bottom: 6px;
          font-family:"iconfont";
          content: '\e617';
          font-size: 16px;
          line-height: 36px;
        }
      }
      &.mexEdit {
        &:after {
          position: absolute;
          right: 12px;
          bottom: 0px;
          font-family:"iconfont";
          content: '\e617';
          font-size: 16px;
          line-height: 36px;
        }
      }
    }

    .view {
      font-size: $font-size-small;
      color: $font-color-title;
      line-height: $font-line-height-secondary;
      font-weight: normal;
      // margin-top: 18px;
    }

    .el-form-item {
      .el-form-item__label {
        font-size: $font-size-mini;
        line-height: 16px;
        color: $font-color-body;
      }
    }
  }

  // 详情页新布局样式
  .container-row-layout {
    display: flex;
    margin-bottom: 0px !important;
    .el-form-item__label {
      width: fit-content !important;
      max-width: 165px !important;  //为适应字号变为14，最大宽度变为165
      line-height: 36px !important;
      margin-right: 12px;
      color: #8F94A5 !important;
    }
    .el-form-item__content {
      flex: 1;
      .view {
        line-height: 36px;
        .type-textarea{
          margin-top: 8px;
          line-height: 20px;
        }
      }
      .field {
        width: calc(100% - 25px);
      }
    }
  }
</style>
