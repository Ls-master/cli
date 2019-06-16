import Fields from './basic/fields';
import Input from './input';
import Select from './select';
import Cascader from './cascader';
import Number from './number';
import NumberRange from './numberRange';
// import KvTree from './kv-tree';
import Date from './date';
import Time from './time';
// import Cascade from './cascade';
import Checkbox from './checkbox';
import CheckboxGroup from './checkbox-group';
// import File from './file';
import Switch from './switch';
// import Formula from './formula';
import Transfer from './transfer';
import RadioGroup from './radioGroup';
import InputNumber from './inputNumber';
import InputGroup from './inputGroup';
import DragInputGroup from './dragInputGroup';
import Reference from './reference';
import UploadFile from './uploadFile';
import UploadImage from './uploadImage';
import FileTree from './fileTree';
import CalFormula from './calFormula';
import ModuleHeader from './moduleHeader';
import FormatExplain from './formatExplain';
import TreeSelect from './tree-select';
import Employee from './employee';
import CurrencyGroup from './currency_group';
import EmployeeNew from './employee_new';
import ColorSelect from './colorSelect';
import IconSelect from './iconSelect';


import Insight_select from './custom_field/insight_select';
import CodeLogic from './custom_field/autonum/codeLogic';
import CodeSwitch from './custom_field/autonum/codeSwitch';
import CodePreview from './custom_field/autonum/codePreview';

export const some = [Input, Select, Cascader, Number, NumberRange, Date, Time, Checkbox, Switch, Transfer,
  RadioGroup, InputNumber, CalFormula, InputGroup, DragInputGroup, UploadFile, UploadImage, Reference, FileTree, CheckboxGroup,
  ModuleHeader, FormatExplain, TreeSelect, Employee, Insight_select, CurrencyGroup, CodeLogic, CodeSwitch, CodePreview,
  EmployeeNew, ColorSelect, IconSelect];

export default new Fields(some);
