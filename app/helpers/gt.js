import Ember from 'ember';

export function gt(params/*, hash*/) {
  return parseInt(params[0]) > parseInt(params[1]);
}

export default Ember.Helper.helper(gt);
