export default {
  dfs(parent, nodes, key, cb) {
    if (typeof cb !== 'function') {
      return;
    }
    if (!nodes) {
      return;
    }
    if (!Array.isArray(nodes)) {
      nodes = [nodes];
    }
    nodes.forEach(node => {
      this.dfs(cb(parent, node) || node, node[key], key, cb);
    });
  },
  walk(node, key, cb) {
    if (typeof cb !== 'function') {
      return null;
    }
    const step = (node) => {
      if (!node) {
        return node;
      }
      if (cb(node)) {
        return node;
      }
      const next = node[key];
      if (!next) {
        return null;
      }
      return step(next);
    };
    return step(node);
  },
};
