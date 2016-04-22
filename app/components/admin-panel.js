import Ember from 'ember';

export default Ember.Component.extend({
	isLoading: true,
	registerAllowed: false,
	token: null,
	username: null,
	goToLogin: null,
	countryList: null,
	selectedCountry: null,
	selectedCountryIndex: -1,
	newCountry: false,
	countryLoading: false,
	init: function() {
		this._super();
		var tasks = 2;
		var self = this;
		Ember.$.ajax("https://liugues-api.herokuapp.com/g/users", {
			method: "GET",
			data: {token: self.get("token")},
			success: function(data) {
				var u = data[0];
				self.set("username", u.u_name);
				if (u.u_pic !== null) {
					self.set("user_pic", u.u_pic);
				} else {
					self.set("user_pic", "unknown.gif");
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
		Ember.$.ajax("https://liugues-api.herokuapp.com/g/countries", {
			method: "GET",
			success: function(data) {
				self.set("countryList", data);
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
					console.log(data);
					if (data.error) {
						alert(data.msg);
					} else {
						self.get("goToLogin")();
					}
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
						self.send("showMessage", id, data.msg);
					}
				},
				error: function() {
					self.send("showMessage", id, "An error occurred when connecting to the database");
				}
			});
		},
		loadCountry(event) {
			var t = event.target;
			var e = t.options[t.selectedIndex];
			var id = parseInt(e.id.substr("country".length));
			if (id !== undefined) {
				if (id === -1) {
					this.set("selectedCountry", {c_name: "", c_flag: ""});
					this.set("selectedCountryIndex", -1);
					this.set("newCountry", true);
				} else {
					var c = null;
					var n = -1;
					var list = this.get("countryList");
					for (var a in list) {
						if (list[a].c_id === id) {
							c = list[a];
							n = a;
							break;
						}
					}
					if (c !== null) {
						this.set("selectedCountry", {
							c_name: c.c_name,
							c_id: c.c_id,
							c_flag: c.c_flag
						});
						this.set("selectedCountryIndex", n);
					} else {
						this.set("selectedCountry", {});
					}
				}
			} else {
				this.set("selectedCountry", null);
				//ERROR HANDLING
			}
		},
		discardChanges(f) {
			switch (f) {
				case "country":
					this.set("selectedCountry", null);
					this.set("newCountry", false);
					break;
			}
		},
		saveChanges(f) {
			var self = this;
			switch (f) {
				case "country":
					var data = {
						c_name: this.get("selectedCountry").c_name,
						c_flag: this.get("selectedCountry").c_flag
					};
					if (!data.c_name) {
						this.send("showMessage", "country_error", "You have to fill the name field.");
						return;
					}
					if (self.get("countryLoading")) {
						this.send("showMessage", "country_error", "The connection is now busy. Try again.");
						return;
					}
					if (self.get("selectedCountryIndex") !== -1) {
						var r = self.get("countryList")[self.get("selectedCountryIndex")];
						data.c_id = r.c_id;
					}
					self.set("connectionToDB", true);
					self.set("countryLoading", true);
					Ember.$.ajax("https://liugues-api.herokuapp.com/p/ch_country", {
						method: "POST",
						data: data,
						success: function(data) {
							console.log(data);
							self.send("showMessage", "country_success", data.msg);
							setTimeout(function() {
								window.location.reload();
							}, 1500);
							self.set("countryLoading", false);
						},
						error: function() {
							self.send("showMessage", "country_error", "An error occurred when trying to connect to the database");
							self.set("connectionToDB", false);
							self.set("countryLoading", false);
						}
					});
					break;
			}
		},
		checkCountryChange() {
			var nn = this.get("selectedCountry").c_name;
			var on = this.get("countryList")[this.get("selectedCountryIndex")].c_name;
			var nf = this.get("selectedCountry").c_flag;
			var of = this.get("countryList")[this.get("selectedCountryIndex")].c_flag;
			if (nn !== on || nf !== of) {
				Ember.$("#save_ch_country")[0].disabled = false;
			} else {
				Ember.$("#save_ch_country")[0].disabled = true;
			}
		},
		deleteCountry() {
			if (!confirm("Are you sure you want to delete "+this.get("selectedCountry").c_name+"?")) {
				return;
			}
			var id = this.get("selectedCountry").c_id;
			var self = this;
			if (this.get("countryLoading")) {
				this.send("showMessage", "country_error", "The connection is now busy. Try again.");
				return;
			}
			this.set("countryLoading", true);
			Ember.$.ajax("http://liugues-api.herokuapp.com/p/del_country", {
				method: "POST",
				data: {c_id: id},
				success: function(data) {
					if (data.error) {
						self.send("showMessage", "country_error", data.msg);
						return;
					}
					self.send("showMessage", "country_success", data.msg);
					setTimeout(function() {
						window.location.reload();
					}, 1500);
					self.set("countryLoading", false);
					self.set("selectedCountry", null);
					self.set("newCountry", false);
				},
				error: function() {
					self.send("showMessage", "country_error", "An unknown error occurred");
					self.set("countryLoading", false);
					self.set("selectedCountry", null);
					self.set("newCountry", false);
				}
			});
		}
	}
});
