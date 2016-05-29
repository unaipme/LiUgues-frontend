import Ember from 'ember';

export default Ember.Route.extend({
	model(tr) {
		return {id: parseInt(tr.id)};
	}
});
