import Fields from './basic/fields';
import { some } from './some';
import SearchCondition from './search-condition';
import RangeCondition from './range-condition';
import ChangeField from './changeField';
import CountFilterCondition from './count_filter_condition';
// import Audit from './audit';

export const expand = [ChangeField, SearchCondition, CountFilterCondition, RangeCondition].concat(some);
export default new Fields(expand);
