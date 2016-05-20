import Ember from 'ember';

export default Ember.Component.extend({
	token: null,
	toggleElement: null,
	showMessage: null,
	actions: {
		toggleElement(id) {
			this.get("toggleElement")(id);
		},
		showMessage(id, txt) {
			this.get("showMessage")(id, txt);
		},
		changePassword() {
			const id = "ch_pass_error";
			var cur_pass = Ember.$("#ch_pass_old_pass")[0].value;
			var new_pass = Ember.$("#ch_pass_new_pass")[0].value;
			var conf_pass = Ember.$("#ch_pass_conf_pass")[0].value;
			var self = this;
			if (cur_pass === "" || new_pass === "" || conf_pass === "") {
				this.send("showMessage", id, "All three fields must be filled");
				return;
			}
			if (new_pass !== conf_pass) {
				this.send("showMessage", id, "New password does not match the confirmation");
				return;
			}
			//Ember.$.ajax("http://localhost:5000/p/pass_ch", {
			Ember.$.ajax("https://liugues-api.herokuapp.com/p/pass_ch", {
				method: "POST",
				data: {
					token: self.get("token"),
					old_pass: cur_pass,
					new_pass: new_pass
				},
				success: function(data) {
					if (data.error) {
						self.send("showMessage", id, data.msg);
					} else {
						self.send("showMessage", "ch_pass_success", data.msg);
					}
					Ember.$("#ch_pass_old_pass")[0].value = "";
					Ember.$("#ch_pass_new_pass")[0].value = "";
					Ember.$("#ch_pass_conf_pass")[0].value = "";
				},
				error: function(data) {
					console.log("Failure!", data);
				}
			});
		},
		generatePassword() {
			var letters = "abcdefghiklmnopqrstuvwwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
			var pass = "";
			const pass_length = 12;
			for (var i = 0 ; i < pass_length; i++) {
				pass += letters[Math.floor(Math.random() * letters.length)];
			}
			Ember.$("#reg_new_password")[0].value = pass;
			this.set("registerAllowed", true);
		},
		register() {
			const id = "reg_error";
			var u = Ember.$("#reg_new_username")[0].value;
			var p = Ember.$("#reg_new_password")[0].value;
			var self = this;
			if (u === "") {
				this.send("showMessage", id, "The username field must be filled.");
				return;
			}
			//Ember.$.ajax("http://localhost:5000/p/register", {
			Ember.$.ajax("https://liugues-api.herokuapp.com/p/register", {
				method: "POST",
				data: {
					username: u,
					password: p
				},
				success: function(data) {
					if (!data.error) {
						self.send("showMessage", "reg_success", data.msg);
					} else {
						console.log(data);
						self.send("showMessage", id, data.msg);
					}
				},
				error: function() {
					self.send("showMessage", id, "An error occurred when connecting to the database");
				}
			});
		}
	}
});
