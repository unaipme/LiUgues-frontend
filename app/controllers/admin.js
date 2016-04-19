import Ember from 'ember';

export default Ember.Controller.extend({
	actions: {
		goToLogin() {
			this.transitionToRoute("/login");
		}
	}
});
