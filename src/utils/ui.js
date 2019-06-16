import { Message } from 'element-ui';

export default {
  error(text) {
    Message.closeAll();
    Message({
      message: text,
      type: 'error',
      duration: 2000,
    });
    // Message.error(text);
  },
  success(text = '操作成功') {
    Message.closeAll();
    // Message.success(text);
    Message({
      message: text,
      type: 'success',
      duration: 2000,
    });
  },
  async confirm(component, content, title = '提示', option = {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    closeOnClickModal: false,
  }) {
    return component.$confirm(content, title, option);
  },
  alert(component, content, title = '提示', option = {
    confirmButtonText: '确定',
    type: 'warning',
    closeOnClickModal: false,
  }) {
    return component.$alert(content, title, option);
  },
};
