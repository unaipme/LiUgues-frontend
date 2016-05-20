import Ember from 'ember';

export default Ember.Route.extend({
	model(tr) {
		var model = {};
		var tkn = tr.token;
		var self = this;
		//Ember.$.ajax("http://localhost:5000/p/check_user", {
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
				console.log("Error!", data);
			}
		});
		model.token = tkn;
		return model;
	}
});
