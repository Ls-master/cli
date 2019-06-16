import utils from './utils';
import collection from './collection';
import dataflow from './dataflow';
import dom from './dom';
import fileTransfer from './fileTransfer';
import format from './format';
import lodash from './lodash';
import eventBus from './eventBus';
import random from './random';
import script from './script';
import statics from './statics';
import ui from './ui';
import url from './url';
import vue from './vue';
import validate from './validate';

window.kr = {
  utils,
  collection,
  dataflow,
  dom,
  fileTransfer,
  format,
  _: lodash,
  bus: eventBus,
  random,
  script,
  statics,
  ui,
  url,
  vue,
};

