import Ember from 'ember';

var loginComp = Ember.Component.extend({
	loginSuccess: null,
	isLoading: false,
	badContent: false,
	actions: {
		checkContent(t) {
			var r = false;
			var b = ["'", "\\", ";", "\""];
			for (var i in b) {
				r |= (t.indexOf(b[i]) !== -1);
			}
			this.set("badContent", r);
		},
		connectionError() {
			Ember.$(".error_msg").hide();
			Ember.$("#errorConnecting").fadeIn();
			setTimeout(function() {
				Ember.$("#errorConnecting").fadeOut();
			}, 5000);
		},
		loginError() {
			Ember.$(".error_msg").hide();
			Ember.$("#errorLogging").fadeIn();
			setTimeout(function() {
				Ember.$("#errorLogging").fadeOut();
			}, 5000);
		},
		formError() {
			Ember.$(".error_msg").hide();
			Ember.$("#errorForm").fadeIn();
			setTimeout(function() {
				Ember.$("#errorForm").fadeOut();
			}, 5000);
		},
		contentError() {
			Ember.$(".error_msg").hide();
			Ember.$("#errorContent").fadeIn();
			setTimeout(function() {
				Ember.$("#errorContent").fadeOut();
			}, 5000);
		},
		loginSuccess(token) {
			this.get("loginSuccess")(token);
		},
		submit() {
			this.set("isLoading", true);
			var u = Ember.$("#username")[0].value;
			var p = Ember.$("#password")[0].value;
			if (u === '' || p === '') {
				console.log("Form error");
				this.set("isLoading", false);
				this.send("formError");
				return;
			}
			this.send("checkContent", u);
			var c1 = this.get("badContent");
			this.send("checkContent", p);
			var c2 = this.get("badContent");
			if (c1 || c2) {
				console.log("Content error");
				this.set("isLoading", false);
				this.send("contentError");
				return;
			}
			var t = this;
			//Ember.$.ajax("http://localhost:5000/p/login", {
			Ember.$.ajax("https://liugues-api.herokuapp.com/p/login", {
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