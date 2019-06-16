<template lang="html">
  <div class="comp-md-form-detail">
    <el-form size="medium" class="detail-main" v-bind:style="customStyles" 
      :class="{'adaptable': customStyles.adaptable, 'fullWidth': customStyles.fullWidth }" 
      label-position="top" @submit.native.prevent>
      <template v-for="(item, i) in commonLayout">
        <!-- 普通模式, 单列撑满 -->
        <template v-if="item.type === 'FORM_FIELDS'">
          <div v-if="item.name && item.children.length && !item.hideHeader" class="area-header" :style="item.headerStyle">
            <span class="area-header-sign"></span>
            <span class="area-header-title">{{item.name}}</span>
          </div>
          <div v-for="(meta) in item.children" :label="meta.name" :key="meta.key" v-show="!meta.hidden" :style="$_.merge(item.style, meta.style)">
            <component
              v-if="fields.find(meta)"
              ref="fields"
              :is="fields.find(meta)"
              :key="meta.key"
              :meta="meta"
              :env="meta.env || env"
              :outerValue="runtime_value[meta.key]"
              :submitDataflow="fieldSubmitDataflow"
              :sceneEmitter="sceneEmitter"
              :fieldEmitter="fieldEmitter"
              @handleTitleRight="handleTitleRight"
              :getFormValue="getForm"
            />
          </div>
        </template>

        <!-- 折叠面板模式 -->
        <template v-if="item.type === 'COLLAPSE'">
          <KrCollapse :collapseTitle="item.name">
            <div v-for="(meta) in item.children" :label="meta.name" :key="meta.key" v-show="!meta.hidden" :style="$_.merge(item.style, meta.style)">
              <component
                v-if="fields.find(meta)"
                ref="fields"
                :is="fields.find(meta)"
                :key="meta.key"
                :meta="meta"
                :env="meta.env || env"
                :outerValue="runtime_value[meta.key]"
                :submitDataflow="fieldSubmitDataflow"
                :sceneEmitter="sceneEmitter"
                :fieldEmitter="fieldEmitter"
                @handleTitleRight="handleTitleRight"
                :getFormValue="getForm"
              />
            </div>
          </KrCollapse>
        </template>

        <!-- 瀑布流模式 -->
        <template v-if="item.type === 'PARALLEL_FIELDS'">
          <div v-if="item.name && item.children.length && !item.hidden" class="area-header" :style="item.headerStyle">
            <span class="area-header-sign"></span>
            <span class="area-header-title">{{item.name}}</span>
          </div>
          <template v-for="(meta,index) in item.children">
            <div v-show="!meta.hidden" :label="meta.name" :key="meta.key" :class="['parallel-fields',index%2==0?'even':'odd']" :style="$_.merge(item.style, meta.style)">
              <component
                v-if="fields.find(meta)"
                ref="fields"
                :is="fields.find(meta)"
                :key="meta.key"
                :meta="meta"
                :env="meta.env || env"
                :outerValue="runtime_value[meta.key]"
                :submitDataflow="fieldSubmitDataflow"
                :sceneEmitter="sceneEmitter"
                :fieldEmitter="fieldEmitter"
                @handleTitleRight="handleTitleRight"
                :getFormValue="getForm"
              />
            </div>
          </template>
        </template>

        <!-- 特殊字段模式 -->
        <template v-if="item.type === 'SPECIAL_FIELDS'">
          <div v-if="item.name && item.children.length && !item.hidden" class="area-header" :style="item.headerStyle">
            <span class="area-header-sign"></span>
            <span class="area-header-title">{{item.name}}</span>
          </div>
          <div :class="['special-container', i==0?'area-left':(i==1?'area-middle':'area-right')]">
            <template v-for="(meta,index) in item.children">
              <div v-show="!meta.hidden" :label="meta.name" :key="meta.key" :class="['special-fields', 'color' + (i*7+index)%5]" :style="$_.merge(item.style, meta.style)">
                <component
                  v-if="fields.find(meta)"
                  ref="fields"
                  :is="fields.find(meta)"
                  :key="meta.key"
                  :meta="meta"
                  :env="meta.env || env"
                  :outerValue="runtime_value[meta.key]"
                  :submitDataflow="fieldSubmitDataflow"
                  :sceneEmitter="sceneEmitter"
                  :fieldEmitter="fieldEmitter"
                  @handleTitleRight="handleTitleRight"
                  :getFormValue="getForm"
                />
              </div>
            </template>
          </div>
        </template>
        <div v-if="item.showMore" class="show-more" @click="showMore" :style="item.headerStyle">{{item.showMore}}</div>
      </template>
    </el-form>
  </div>
</template>

<script>
import fields from 'components/metaData/form/field/all';
import KrCollapse from 'components/metaData/krCollapse';
import Emitter from 'wolfy87-eventemitter';
import getEventMixin from 'mixin/event';
import detailMixin from "./detail-mixin.js";

const sceneMixin = getEventMixin({
  scope: 'SCENE',
  getEmitter() {
    return this.sceneEmitter;
  },
  getListen() {
    return this.scene_event_listen || [];
  },
  getEmit() {
    return this.scene_event_emit || [];
  },
  getId() {
    return 'scene';
  },
});

export default {
  mixins: [
    sceneMixin,
    detailMixin
  ],
  props: {
    fieldMetas: kr.vue.getPropArray(),
    value: kr.vue.getPropObject(),
    layout: kr.vue.getPropArray(),
    hostObjInfo: kr.vue.getPropObject(),
    env: {
      type: Object,
      default() {
        return {
          PURE: true
        }
      }
    },
    customStyles: kr.vue.getPropObject(),
    fieldSubmitDataflow: kr.vue.getPropArray(),
  },
  data() {
    return {
      fields,
      init_layout: this.layout,
      fieldEmitter: new Emitter(),
      sceneEmitter: new Emitter(),
      scene_event_listen: [
        {
          src: 'field',
          event: 'change',
          script: (ctx) => {
            const nv = ctx.args[0];
            // const component = ctx.component;
            if (nv) {
              this.$emit('change', nv);
            }
            if(nv && nv.insightData){ // 来源于洞见的数据同步
              this.showMore();
              this.getInsightRelate(nv.insightData);
            }
            if(nv && nv.updateTransaction){   // 来源于更新交易相关的关联项
              this.updateTransaction(nv);
            }
            this.$emit('sceneChange', ctx);
          },
        },
        {
          src: 'field',
          event: 'ready',
          script: (ctx) => {
            const nv = ctx.args[0];
            this.$emit('sceneReady', nv);
          }
        }        
      ],
      scene_event_emit: [],
      runtime_value: {},    //暂存某些字段的运行时的值(仅仅部分字段最新值)，以解决运行时某几个字段动态联合更新另一个字段的情况
      commonLayout: [],
    }
  },
  watch: {
    layout: {
      immediate: true,
      handler(val){
        this.init_layout = val;
        // this.updateCommonLayout();
      }
    },
    value: {
      immediate: true,
      deep: true,
      handler(val){
        this.runtime_value = Object.assign({}, this.runtime_value, val);
      }
    },
    fieldMetas: {
      immediate: true,
      deep: true,
      handler(val){
        this.updateCommonLayout();
      }
    },
    // 外部可能修改init_layout，需要额外监听一下
    init_layout: {
      immediate: true,
      deep: true,
      handler(){
        this.updateCommonLayout();
      }
    }
  },
  computed: {

  },
  methods: {
    updateCommonLayout(){
      const { fieldMetas, init_layout } = this;
      const tmpMetas = _.cloneDeep(fieldMetas);
      const metas = tmpMetas.reduce((result, meta) => {
        const { key } = meta;
        result[key] = meta;
        return result;
      }, {});

      // const v = JSON.parse(JSON.stringify(layout)).reduce((result, item) => {
      const v = JSON.parse(JSON.stringify(init_layout)).reduce((result, item) => {
        item.children = item.children.reduce((result, child) => {
          let meta = metas[child.field];
          //如果layout里面设置了hidden, 这里使用layout的hidden来代替meta的hidden
          if (item.hidden) {
            meta = Object.assign({}, meta, {
              hidden: child.hidden
            });
          }
          result.push(meta);
          return result;
        }, []);

        // if (item.children.length) {
        result.push(item);
        // }
        return result;
      }, []);
      this.commonLayout =  v;
      this.updateTransaction({}); // 正常流程应该判断当前对象(或相关项对象)是否是交易再决定是否修改commonLayout，但目前没有传递主对象参数，所以都调用一次,有点浪费效率。。。
    },
    getForm() {
      const {fields} = this.$refs;
      if (kr.script.isArray(fields)) {
        return fields.reduce((result, component) => {
          const keyVal = component.getKV();
          if(kr.script.isArray(keyVal)){  // 如果是数组
            const [key, value] = keyVal;
            result[key] = value;
          }else{    // 如果是对象
            for(var i in keyVal){
              result[i] = keyVal[i];
            }
          }
          
          return result;
        }, {});
      }
      return {};
    },
    async submit() {
      const form = this.getForm();

      const {fields} = this.$refs;
      if (kr.script.isArray(fields)) {
        await Promise.all(fields.map(field => field.doValidate(form)));
      }
      return form;
    },
    showMore() {
      const item = this.init_layout.find(item => item.type === "ALL_FIELDS");
      if (!item) {
        return;
      }
      this.init_layout = item.children;
      this.init_layout.forEach(item => {
        item.hidden = false;
        item.showMore = null;
      });
      this.updateCommonLayout();
    },
    handleTitleRight(result) {
      this.$emit('handleTitleRight', result);
    },
    getComponents() {
      const { fields } = this.$refs;
      if (Array.isArray(fields)) {
        return fields.reduce((result, field) => {
          result[field.$props.meta.key] = field;
          return result;
        }, {});
      }
      return {};
    },
    _refresh() {
      const { fields } = this.$refs;
      if (Array.isArray(fields)) {
        fields.forEach(field => {
          if (field) {
            field.refresh();
          }
        });
      }
    },
    sceneReady(source = "detail") {
      const { fields } = this.$refs;
      if (Array.isArray(fields)) {
        fields.forEach(f => {
          f.emit_SCENE('ready', this);
        })
      }
    }
  },
  created() {
    this.refresh = _.debounce(this._refresh, 200);
  },
  mounted() {
    // this.emit_SCENE('ready');
    this.sceneReady();
  },
  components: {
    ...fields,
    KrCollapse
  }
}
</script>


<style lang="scss">
  .comp-md-form-detail {
    .detail-main {
      &.fullWidth {
        .parallel-fields {
          max-width: 100%;
        }
      }
      .parallel-fields {
        display: inline-block;
        width: 50%;
        max-width: 460px;
      }
      .special-container{
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        width: 33%;
      }
      .special-fields{
        display: block;
        width: 100%;
        margin-top: 16px;
        .comp-md-form-field-basic-container{
          border: 1px solid #F0F2FA;
          border-top: 3px solid #99A7FF;
          margin-right: 16px;
          .view{
            font-size: 14px;
          }
          .field{
            width: 100%;
          }
        }
        .container-row-layout{
          display: block;
        }
        &.color0 .comp-md-form-field-basic-container{
          border-top: 3px solid #99A7FF;
        }
        &.color1 .comp-md-form-field-basic-container{
          border-top: 3px solid #7AC0F7;
        }
        &.color2 .comp-md-form-field-basic-container{
          border-top: 3px solid #45C4B5;
        }
        &.color3 .comp-md-form-field-basic-container{
          border-top: 3px solid #FFB375;
        }
        &.color4 .comp-md-form-field-basic-container{
          border-top: 3px solid #F45E72;
        }
      }
      &.adaptable {
        .parallel-fields {
          width: 100%;
        }
        display: grid;
        grid-gap: 0 20px;
        @media only screen and (max-width: 1368px) {
          grid-template-columns: repeat(2, minmax(276px, 1fr));
        }
        @media only screen and (min-width: 1368px) and (max-width: 1920px) {
          grid-template-columns: repeat(3, minmax(276px, 1fr));
        }
        @media only screen and (min-width: 1920px) {
          grid-template-columns: repeat(4, minmax(276px, 1fr));
        }
      }
    }
    .area-header {
      position: relative;
      left: -12px;
      margin-bottom: 12px;
      font-size: 0;
      .area-header-title {
        font-size: 14px;
        color: #525975;
        text-align: left;
        line-height: 21px;
        padding-right: 16px;
        font-weight: 500;
      }
      .area-header-sign {
        display: inline-block;
        margin-right: 8px;
        width: 4px;
        height: 12px;
        background-color: #7280DB;
      }
    }
    .show-more {
      font-size: 13px;
      color: #3F9EE8;
      text-align: left;
      line-height: 18px;
      cursor: pointer;
    }
  }
</style>
