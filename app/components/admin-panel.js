import Ember from 'ember';

export default Ember.Component.extend({
	isLoading: true,
	token: null,
	username: null,
	user_pic: "unknown.gif",
	goToLogin: null,
	init: function() {
		this._super();
		var tasks = 1;
		var self = this;
		Ember.$.ajax("https://liugues-api.herokuapp.com/g/users", {
			method: "GET",
			data: {token: self.get("token")},
			success: function(data) {
				var u = data[0];
				self.set("username", u.u_name);
				if (u.u_pic !== null) {
					self.set("user_pic", u.u_pic);
				}
				if (--tasks===0) {
					self.set("isLoading", false);
				}
			},
			error: function() {
				console.log("ERROR!");
				if (--tasks===0) {
					self.set("isLoading", false);
				}
			}
		});
	},
	actions: {
		toggleElement(id) {
			var p = Ember.$(id)[0];
			var el = p.nextElementSibling;
			var a = p.firstElementChild;
			Ember.$(el).slideToggle();
			if (a.className.indexOf("arrow_turn") !== -1) {
				a.className = "expand_arrow";
			} else {
				a.className += " arrow_turn";
			}
		},
		showMessage(id, txt) {
			var el = Ember.$("#"+id)[0];
			el.innerHTML = txt;
			Ember.$(el).fadeIn();
			setTimeout(function() {
				Ember.$(el).fadeOut();
			}, 5000);
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
		logOut() {
			var self = this;
			Ember.$.ajax("https://liugues-api.herokuapp.com/p/logout", {
				method: "POST",
				data: {token: self.get("token")},
				success: function(data) {
					if (data.error) {
						alert(data.msg);
					} else {
						self.get("goToLogin")();
					}
				}
			});
		}
	}
});
