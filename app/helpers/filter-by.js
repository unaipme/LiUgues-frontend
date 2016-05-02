import Ember from 'ember';

export function filterBy(params/*, hash*/) {
	var list = params[0];
	var l = params[1];
	var ref = params[2] || "name";
	var r = list.filter(function(e) {
		return e[ref][0] === l;
	});
	return r;
}

export default Ember.Helper.helper(filterBy);
