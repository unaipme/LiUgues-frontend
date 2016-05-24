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
	roundList: null,
	gameList: null,
	init: function() {
		this._super();
		var self = this;
		var tasks = 2;
		var error = function(data) {
			console.log(data);
			tasks = -1;
			self.set("isLoading", false);
			self.set("loadingError", true);
		};
		var complete = function() {
			if (--tasks===0) {
				self.set("isLoading", false);
			}
		};
		//Ember.$.ajax("http://localhost:5000/g/init", {
		Ember.$.ajax("https://liugues-api.herokuapp.com/g/init", {
			method: "GET",
			success: function(data) {
				if (data.error) {
					console.log("Error occurred initializing");
					error();
					return;
				}
				console.log("Loaded initializing info", data);
				self.set("countryList", data.data.countries);
				self.set("leagueList", data.data.leagues);
				self.set("roundList", data.data.rounds);
				self.set("teamList", data.data.teams);
				self.set("gameList", data.data.games);
				self.set("seasonList", data.data.seasons);
			},
			error: function() {
				console.log("Error occurred initializing");
				error();
			},
			complete: complete
		});
		//Ember.$.ajax("http://localhost:5000/g/users", {
		Ember.$.ajax("https://liugues-api.herokuapp.com/g/users", {
			method: "GET",
			data: {token: self.get("token")},
			success: function(data) {
				if (data.error) {
					console.log("Error loading user info", data);
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
			error: function(data) {
				console.log("Error loading user info");
				error(data);
			},
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
			//Ember.$.ajax("http://localhost:5000/p/logout", {
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
