import Ember from 'ember';

export function filterBy(params/*, hash*/) {
	console.log("HEJ");
	var list = params[0];
	var l = params[1];
	var ref = params[2] || "name";
	var r = list.filter(function(e) {
		console.log(e[ref][0], l);
		return e[ref][0] === l;
	});
	console.log(r);
	return r;
}

export default Ember.Helper.helper(filterBy);
