<template>
  <Container
    @click="handleClick"
    ref="container"
    :runtime_validate="runtime_validate"
    :meta="meta"
    :disabled="conf_element_props.disabled"
    :env="finalEnv">
    <span slot="view" style="line-height: 0px"><img :src="imgPath" width="80px" height="80px" alt=""></span>
    <div class="upload-image-container" 
      ref="field" slot="field" 
      v-bind="[local_element_props, element_props, runtime_element_props]"
      :class="{'margin': imgPath}">
      <div class="upload-image-view" v-if="imgPath" :class="{'available': !conf_element_props.disabled}">
        <div class="upload-image-image">
          <img :src="imgPath" width="80px" height="80px" alt="">
        </div>
        <div class="upload-image-actions">
          <i class="icon iconfont icon-download image-action" @click="downloadImg"></i>
          <i class="icon iconfont icon-tocloud image-action" @click="transferImgToLibrary"></i>
          <i class="icon iconfont icon-refresh image-action" @click="updateImg"></i>
          <i class="icon iconfont icon-garbage image-action" @click="deleteImg"></i>
        </div>
      </div>
      <div v-else>
        <div class="upload-image-button" :class="{'disabled': conf_element_props.disabled }">
          <el-upload
            action=''
            :auto-upload="false"
            accept="image/jpeg,image/jpg,image/png"
            :show-file-list="false"
            :on-change='changeUpload'>
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
      </div>
      <el-dialog
        v-if="uploadDialog.visible"
        append-to-body
        top="60px"
        :close-on-click-modal="false"
        :visible.sync="uploadDialog.visible"
        :title="uploadDialog.title">
        <div class="upload-image-upload">
          <KrUpload ref="krupload" @onsuccess="handleUploadImage" :imgUrl="imgPath" :imgFile="imgFile" :uploadText="uploadDialog.uploadText">
          </KrUpload>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="uploadDialog.visible = false">取消</el-button>
          <el-button :disabled="false" type="primary" @click="handleUpload">确认</el-button>
        </span>
      </el-dialog>
      <el-dialog 
        v-if="transferToLibraryDialog.visible"
        append-to-body
        top="60px"
        :close-on-click-modal="false"
        :visible.sync="transferToLibraryDialog.visible"
        :title="transferToLibraryDialog.title">
        <KrDataForm 
          :fieldMetas="transferToLibraryDialog.metas"
          ref="transferToLibrary"
          :value="transferToLibraryDialog.value">
        </KrDataForm>
        <span slot="footer" class="dialog-footer">
          <el-button @click="transferToLibraryDialog.visible = false">取 消</el-button>
          <el-button type="primary" @click="handleTransferToLibrary">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </Container>
</template>

<script>
import fieldMixin from '../basic/field-mixin';
import KrUpload from "@/components/metaData/krUpload";
import KrDataForm from '@/components/metaData/form/view/data-form';
import { getUploadPath, postFormData } from "service/metaData/org/account";
import { createFile } from '@/service/metaData/module/edit';
export default {
  INDEX: ['UPLOAD_IMAGE'],
  mixins: [
    fieldMixin,
  ],
  data() {
    return {
      uploadDialog: {
        visible: false,
        title: "上传图片",
        uploadText: "上传图片"
      },
      file: null,
      imgData: null,
      imgFile: null,
      transferToLibraryDialog: {
        title: '转存到文件库',
        visible: false,
        type: '',
        metas: [
          {
            type: 'FILE_TREE_LAZY',
            name: '',
            scene: {
              element_props: {},
              related_data_remote_query: {data: { parentId: '0000' }},
              related_data_remote: '/file/storeMgr/getLevelFoldersList'
            },
            key: 'file',
          }
        ],
        value: {
        }
      }
    }
  },
  computed: {
    imgPath() {
      return this.value ? this.value.imagePath : "";
    }
  },
  methods: {
    changeUpload(file) {
      this.updateImg();
      this.imgFile = file;
    },
    handleUploadImage(file) {
      this.file = file;
    },
    async handleUpload() {
      try {
        const result = await getUploadPath({
          data: {
            expire: 2000
          }
        });
        const { requestPath, token } = result;
        const postData = {
          requestPath,
          token,
          file: this.file.raw,
        };
        postFormData(requestPath, postData, this.handleUploadSuccess, (e) => console.warn(e));
      } catch(e) {
         
      }
    },
    async handleUploadSuccess(data) {
      if (!data) {
        return;
      }
      this.imgFile = {};
      this.value = { 
        imageName: data.name, 
        imagePath: data.requestPath, 
        imageFileName: data.fileName,
        imageSize: data.fileSize, 
        imageSuffix: data.fileSuffix,
        imageStorePath: data.storePath 
      };
      this.imgData = this.value;
      this.uploadDialog.visible = false;
      //详情页里面需要实时更新最新图片
      if (this.isEditing()) {
        this.handleFieldBlur();
      } 
    },
    async handleTransferToLibrary() {
      const { transferToLibrary } = this.$refs;
      let form = await transferToLibrary.submit();
      if (!form) {
        return;
      }
      const { file } = form;
      const postData = {
        fileType: 0,
        storageType: "0",
        fileSize: this.imgData.imageSize,
        storageName: this.imgData.imageFileName,
        storagePath: this.imgData.imageStorePath,
        name: this.imgData.imageName,
        bizType: file.bizType, 
        parentId: file.id,
      };
      await createFile({
        data: {
          fileEntity: postData
        }
      });
      this.$message.success("图片转存成功");
      this.transferToLibraryDialog.visible = false;
    },
    doCache(nv) {
      this.cache = nv;
    },
    setValue(nv, source = 'inner', always = false) {
      if(source !== 'inner') {
        this.doCache(nv);
      }
      this.value = nv;
      this.imgData = nv;
      if (always || !kr.script.compare(this.value, this.oldValue)) {
        this.$emit('input', nv, this.cache, source);
      }
      this.oldValue = this.value;
    },
    getKV() {
      const kv = fieldMixin.methods.getKV.call(this);
      if (!kv.length) {
        return kv;
      }
      let [k, v] = kv;
      return [k, v];
    },
    uploadImg() {
      this.uploadDialog.uploadText = "上传图片";
      this.uploadDialog.visible = true;
    },
    downloadImg() {
      if (!this.imgData || !this.imgData.imageFileName || !this.imgData.imageStorePath) {
        return;
      }
      this.$root.fileDownload({name: this.imgData.imageFileName, storePath: this.imgData.imageStorePath}, 'a');  
    },
    transferImgToLibrary() {
      this.transferToLibraryDialog.visible = true;
    },
    updateImg() {
      this.uploadDialog.uploadText = "更换图片";
      this.uploadDialog.visible = true;
    },
    deleteImg() {
      this.value = null;
      //详情页里面需要实时更新最新图片
      if (this.isEditing()) {
        this.handleFieldBlur();
      } 
    }
  },
  created() {
      
  },
  components: {
    KrUpload,
    KrDataForm
  } 
}
</script>

<style lang="scss">
  .upload-image-container {
    display: inline-block;
    width: 100%;
    &.margin {
      margin-top: 6px;
    }
    .upload-image-view {
      display: flex;
      align-items: center;
      height: 60px;
      .upload-image-image {
        width: 80px;
        line-height: 0px;
        margin-top: 30px;
      }
      .upload-image-actions {
        display: flex;
        flex: 1;
        justify-content: flex-end;
        visibility: hidden;
        .image-action {
          margin-left: 10px;
          font-size: 20px;
          color: #9DA2B3;
          cursor: pointer;
          &:hover {
            color: #606ECC;
          }
        }
      }
      &.available {
        &:hover { 
          .upload-image-actions {
            visibility: visible;
          }
        }
      }
    }
    .upload-image-button {
      border: 1px solid #CACEE0;
      border-radius: 2px;
      height: 60px;
      width: 60px;
      background-color: #F6F7FB;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      &.disabled {
        pointer-events: none;
        cursor: not-allowed;
      }
      .avatar-uploader-icon {
        font-size: 14px;
        color: #8c939d;
        width: 60px;
        height: 60px;
        line-height: 60px;
        text-align: center;
      }
    }
  }
  .upload-image-upload {
    padding: 20px 12px;
  }
</style>