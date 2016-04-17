import Ember from 'ember';

var loginComp = Ember.Component.extend({
	loginSuccess: null,
	isLoading: false,
	actions: {
		connectionError() {
			Ember.$("#errorLogging").hide();
			Ember.$("#errorConnecting").fadeIn();
			setTimeout(function() {
				Ember.$("#errorConnecting").fadeOut();
			}, 5000);
		},
		loginError() {
			Ember.$("#errorConnecting").hide();
			Ember.$("#errorLogging").fadeIn();
			setTimeout(function() {
				Ember.$("#errorLogging").fadeOut();
			}, 5000);
		},
		loginSuccess(token) {
			this.get("loginSuccess")(token);
		},
		submit() {
			this.set("isLoading", true);
			var u = Ember.$("#username")[0].value;
			var p = Ember.$("#password")[0].value;
			var t = this;
			Ember.$.ajax("http://liugues-api.herokuapp.com/p/login", {
				method: "POST",
				data: {username: u, password: p},
				success: function(data) {
					if (data.login) {
						t.send("loginSuccess", data.token);
					} else {
						t.set("isLoading", false);
						t.send("loginError");
					}
				},
				error: function() {
					t.set("isLoading", false);
					t.send("connectionError");
				}
			});
		}
	}
});

export default loginComp;