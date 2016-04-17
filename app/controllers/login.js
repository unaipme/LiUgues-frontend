import Ember from 'ember';

export default Ember.Controller.extend({
	actions: {
		loginSuccess(token) {
			this.transitionToRoute("/admin/"+token);
		}
	}
});
