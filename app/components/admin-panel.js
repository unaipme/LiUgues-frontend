import Ember from 'ember';

export default Ember.Component.extend({
	chosenTab: 0,
	isLoading: false,
	registerAllowed: false,
	newCountry: false,
	countryLoading: false,
	token: null,
	username: null,
	goToLogin: null,
	countryList: null,
	leagueList: null,
	seasonList: null,
	init: function() {
		this._super();
		var tasks = 4;
		var self = this;
		var complete = function() {
			if (--tasks===0) {
				self.set("isLoading", false);
			}
		};
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
			},
			complete: complete
		});
		Ember.$.ajax("https://liugues-api.herokuapp.com/g/countries", {
			method: "GET",
			success: function(data) {
				self.set("countryList", data);
			},
			complete: complete
		});
		Ember.$.ajax("https://liugues-api.herokuapp.com/g/leagues", {
			method: "GET",
			success: function(data) {
				self.set("leagueList", data);
			},
			complete: complete
		});
		Ember.$.ajax("https://liugues-api.herokuapp.com/g/seasons", {
			method: "GET",
			success: function(data) {
				self.set("seasonList", data);
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
