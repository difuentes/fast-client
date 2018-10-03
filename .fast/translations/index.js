import actions from './actions';
import gps from './gps';
import time from './time';
import validations from './validations';

export default [...actions, ...time, ...gps, ...validations];
