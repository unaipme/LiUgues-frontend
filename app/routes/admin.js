import Ember from 'ember';

export default Ember.Route.extend({
	beforeModel(tr) {
		var tkn = tr.params.admin.token;
		var self = this;
		Ember.$.ajax("https://liugues-api.herokuapp.com/p/check_user", {
			method: "POST",
			data: {token: tkn},
			success: function(data) {
				if (!data.login) {
					alert(data.msg);
					self.transitionTo("/login");
				} else {
					console.log("Correctly logged in");
				}
			},
			error: function(data) {
				console.log("Error!");
			}
		});
	}
});
