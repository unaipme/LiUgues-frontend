import Ember from 'ember';

export function xIn(params/*, hash*/) {
	var x = params[0];
	for (var i=1; i<params.length; i++) {
		if (params[i]==x) {
			return true;
		}
	}
	return false;
}

export default Ember.Helper.helper(xIn);
