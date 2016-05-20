import Ember from 'ember';

export function math(params/*, hash*/) {
	var lv = params[0], rv = params[2];
	var op = params[1];
	var ret;
	
	switch (op) {
		case "+":
			ret = lv + rv;
			break;
		case "-":
			ret = lv - rv;
			break;
		case "*":
			ret = lv * rv;
			break;
		case "/":
			ret = lv / rv;
			break;
		case "%":
			ret = lv % rv;
			break;
	}
	
	return ret;
}

export default Ember.Helper.helper(math);
