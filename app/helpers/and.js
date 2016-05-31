import Ember from 'ember';

export function and(params/*, hash*/) {
	for (var i=0; i<params.length; i++) {
		if (params[i] === false) {
			return false;
		}
	}
	return true;
}

export default Ember.Helper.helper(and);
