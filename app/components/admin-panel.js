import Ember from 'ember';

export default Ember.Component.extend({
	chosenTab: 0,
	isLoading: true,
	registerAllowed: false,
	newCountry: false,
	countryLoading: false,
	loadingError: false,
	token: null,
	username: null,
	goToLogin: null,
	countryList: null,
	leagueList: null,
	seasonList: null,
	init: function() {
		this._super();
		var tasks = 5;
		var self = this;
		var error = function() {
			tasks = -1;
			self.set("isLoading", false);
			self.set("loadingError", true);
		};
		var complete = function() {
			if (--tasks===0) {
				self.set("isLoading", false);
			}
		};
		Ember.$.ajax("https://liugues-api.herokuapp.com/g/countries", {
			method: "GET",
			success: function(data) {
				if (data.error) {
					console.log("Error loading country list");
					error();
				} else {
					self.set("countryList", data.data);
					console.log("Loaded country list", data);
				}
			},
			error: error,
			complete: complete
		});
		Ember.$.ajax("https://liugues-api.herokuapp.com/g/users", {
			method: "GET",
			data: {token: self.get("token")},
			success: function(data) {
				if (data.error) {
					console.log("Error loading user info");
					error();
				} else {
					var u = data.data[0];
					self.set("username", u.u_name);
					if (u.u_pic !== null) {
						self.set("user_pic", u.u_pic);
					} else {
						self.set("user_pic", "unknown.gif");
					}
					console.log("Loaded user info", data);
				}
			},
			error: error,
			complete: complete
		});
		Ember.$.ajax("https://liugues-api.herokuapp.com/g/leagues", {
			method: "GET",
			success: function(data) {
				if (data.error) {
					console.log("Error loading league list");
					error();
				} else {
					self.set("leagueList", data.data);
					console.log("Loaded league list", data);
				}
			},
			error: error,
			complete: complete
		});
		Ember.$.ajax("https://liugues-api.herokuapp.com/g/seasons", {
		//Ember.$.ajax("http://localhost:5000/g/seasons", {
			method: "GET",
			success: function(data) {
				if (data.error) {
					console.log("Error loading season list");
					error();
				} else {
					self.set("seasonList", data.data);
					console.log("Loaded season list", data);
				}
			},
			error: error,
			complete: complete
		});
		Ember.$.ajax("https://liugues-api.herokuapp.com/g/teams", {
			method: "GET",
			success: function(data) {
				if (data.error) {
					console.log("Error loading team list");
					error();
				} else {
					self.set("teamList", data.data);
					console.log("Loaded team info", data);
				}
			},
			error: error,
			complete: complete
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
		setTab(n) {
			this.set("chosenTab", n);
		}
	}
});
