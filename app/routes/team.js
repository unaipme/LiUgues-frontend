import Ember from 'ember';

export default Ember.Route.extend({
	model(tr) {
		return {id: tr.id};
	}
});
