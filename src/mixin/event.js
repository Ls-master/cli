/* eslint-disable no-empty */

const getType = (src, event) => {
  return `${src}:${event}`;
};

export default function (option) {
  const {
    getId, getEmitter, getListen, getEmit, scope,
  } = option;
  if (!scope) {
    throw Error('scope未传入');
  }
  const listenStoreKey = `_listen_${scope}`;
  const emitStoreKey = `_emit_${scope}`;
  const emitMethodKey = `emit_${scope}`;
  const dataMethodKey = `_data_${scope}`;
  return {
    created() {
      const {
        emitter, listen, emit, id,
      } = this[dataMethodKey]();
      if (emitter && id) {
        this[listenStoreKey] = listen.reduce((result, { src, event, script }) => {
          const type = getType(src, event);
          const cb = function (...args) {
            kr.script.exec(script, this, args);
          }.bind(this);
          emitter.addListener(type, cb);
          result[type] = cb;
          return result;
        }, {});
        this[emitStoreKey] = emit.reduce((result, { event, script }) => {
          const type = getType(id, event);
          const cb = function (...args) {
            const e = kr.script.exec(script, this, args);
            emitter.emit(type, e);
          }.bind(this);
          result[event] = cb;
          return result;
        }, {});
      }
    },
    beforeDestroy() {
      const {
        emitter, listen, id,
      } = this[dataMethodKey]();
      if (emitter && id) {
        listen.forEach(({ src, event }) => {
          const type = getType(src, event);
          const cb = this[listenStoreKey][type];
          emitter.removeListener(type, cb);
        });
      }
    },
    methods: {
      [emitMethodKey](event, ...args) {
        if(this[emitStoreKey]){
          const target = this[emitStoreKey][event];
          if (typeof target === 'function') {
            target(...args);
          }
        }
      },
      [dataMethodKey]() {
        const metas = [
          {
            key: 'emitter',
            getter: getEmitter,
            default: null,
          },
          {
            key: 'listen',
            getter: getListen,
            default: [],
          },
          {
            key: 'emit',
            getter: getEmit,
            default: [],
          },
          {
            key: 'id',
            getter: getId,
            default: null,
          },
        ];
        return metas.reduce((result, meta) => {
          const { key, getter } = meta;
          try {
            result[key] = getter.call(this);
          } catch (e) {
            result[key] = meta.default;
          }
          return result;
        }, {});
      },
    },
  };
}
