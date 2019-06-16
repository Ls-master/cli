export default {
  stop() {
    /* eslint-disable prefer-rest-params */
    window.event.stopPropagation();
  },

  /**
   * 递归DOM
   * @method recursiveParentNode
   * @param  { Dom } node (必填)
   * @param  { Dom Name } target (必填)
   * @return { Dom } DOM节点
   */
  recursiveParentNode(node, target) {
    if(node && target && node.nodeName.toLowerCase() !== 'body') {
      return node.nodeName.toLowerCase() === target ? node : this.recursiveParentNode(node.parentNode, target);
    }else {
      return null;
    }
  },
  
};
