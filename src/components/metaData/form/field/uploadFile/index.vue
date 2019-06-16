<template>
  <Container
    @click="handleClick"
    ref="container"
    :runtime_validate="runtime_validate"
    :meta="meta"
    :disabled="conf_element_props.disabled"
    :env="finalEnv"
  >
    <el-upload
      v-if="pathData"
      slot="field"
      ref="field"
      v-bind="[local_element_props, element_props, runtime_element_props]"
      :action="getAction"
      :data="{ token: pathData.token }"
      :on-success="success"
      :on-remove="remove"
      :before-upload="beforeAvatarUpload"
      name="file"
      :file-list="fileList"
    >
        <span class="upload-file-button">
          <i class="icon iconfont icon-upload"></i>
          本地上传
        </span>
        <span class="upload-file-button upload-file-text"> 或 </span>
        <span class="upload-file-button" @click.stop="handleFromFileLibrary">
          <i class="icon iconfont icon-fromcloud"></i>
          从文件库中选择
        </span>
    </el-upload>
  </Container>
</template>

<script>
import fieldMixin from '../basic/field-mixin';
import { getFileUploadPath } from '@/service/metaData/module/edit';

export default {
  INDEX: ['UPLOAD_FILE'],
  props: {
    fromLibraryClick: kr.vue.getPropFunction(null)
  },
  data() {
    return {
      pathData: '',
      accept: 'video/mp4,application/pdf,' +
      'application/vnd.ms-powerpoint,' +
      'application/vnd.openxmlformats-officedocument.presentationml.presentation,' +
      'audio/wav,' +
      'application/vnd.ms-excel,' +
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,' +
      'video/avi,application/msword,' +
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document,' +
      'audio/mp3,' +
      'image/jpg,' +
      'image/jpeg,' +
      'image/png,' +
      'image/gif',
      fileList: []
    }
  },
  mixins: [
    fieldMixin,
  ],
  watch: {
    fileList(val) {
      this.setValue(val);
    }
  },
  computed: {
    getAction() {
      if (process.env.NODE_ENV === 'development') {
        return /api.+/.exec(this.pathData.requestPath)[0];
      }
      return this.pathData.requestPath;
    }
  },
  methods: {
    async max() {
      await new Promise((resolve, reject) => {
        const maxLength = this.fileList.length >= 9;
        if (!maxLength) {
          resolve();
        } else {
          this.setError('上传文件最多支持同时上传9个文件!');
          reject();
        }
      })
    },
    remove(file, fileList) {
      this.fileList = fileList;
    },
    success(res) {
      this.fileList.push(res.result);
    },
    handleFromFileLibrary() {
      if (this.fromLibraryClick) {
        this.fromLibraryClick();
      } else {
        kr.bus.$emit('selectFileFromLibrary', true);
      }
    },
    async getFileUploadPath() {
      let path = await getFileUploadPath({
        data: {
          expire: 2000
        }
      });

      this.pathData = path;
    },
    async beforeAvatarUpload(file) {
      const size = file.size / 1024 / 1024 > 200;
      await this.max();
      if (size) {
        this.setError('您的文件已超过200MB，请压缩后重新上传!');
      }

      return !size;
    }
  },
  created() {
    this.getFileUploadPath();
  }
}
</script>

<style scoped>

  .upload-file-button {
    display: inline-block;
    height: 100%;
    font-size: 13px;
    color: #525975;
    /*line-height: 18px;*/
  }

  .upload-file-text {
    color: #9DA2B3;
    padding: 0 10px;
  }

</style>
