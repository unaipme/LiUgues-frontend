import Ember from 'ember';

export function arrayElement(params/*, hash*/) {
	var array = params[0];
	var n = Math.abs(parseInt(params[1]));
	return array[n];
}

export default Ember.Helper.helper(arrayElement);
