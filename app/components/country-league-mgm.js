import Ember from 'ember';

export default Ember.Component.extend({
	toggleElement: null,
	showMessage: null,
	countryLeagues: null,
	selectedCountry: null,
	selectedCountryIndex: -1,
	selectedLeague: null,
	selectedLeagueIndex: -1,
	selectedLCountry: null,
	countryList: null,
	leagueList: null,
	connectionBusy: false,
	actions: {
		toggleElement(id) {
			this.get("toggleElement")(id);
		},
		showMessage(id, txt) {
			this.get("showMessage")(id, txt);
		},
		showLeagues(event) {
			var t = event.target;
			var e = t.options[t.selectedIndex];
			var id = parseInt(e.id.substr("lcountry".length));
			var lc = this.get("countryList").filter(function(i) {
				return i.c_id === id;
			})[0];
			this.set("selectedLCountry", lc);
			var r = this.get("leagueList").filter(function(i){
				return i.l_country === id;
			});
			if (r.length === 0) {
				this.set("countryLeagues", {});
			} else {
				this.set("countryLeagues", r);
			}
			Ember.$("#ch_league_select")[0].options[0].selected = true;
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
			Ember.$.ajax("https://liugues-api.herokuapp.com/p/del_country", {
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
		},
		deleteLeague() {
			if (!confirm("Are you sure you want to delete "+this.get("selectedLeague").l_name+"?")) {
				return;
			}
			var id = this.get("selectedLeague").l_id;
			var self = this;
			if (this.get("leagueLoading")) {
				this.send("showMessage", "country_error", "The connection is now busy. Try again.");
				return;
			}
			this.set("leagueLoading", true);
			Ember.$.ajax("http://liugues-api.herokuapp.com/p/del_league", {
				method: "POST",
				data: {l_id: id},
				success: function(data) {
					if (data.error) {
						self.send("showMessage", "league_error", data.msg);
						return;
					}
					self.send("showMessage", "league_success", data.msg);
					setTimeout(function() {
						window.location.reload();
					}, 1500);
					self.set("leagueLoading", false);
					self.set("selectedLeague", null);
					self.set("newLeague", false);
				},
				error: function() {
					self.send("showMessage", "league_error", "An unknown error occurred");
					self.set("leagueLoading", false);
					self.set("selectedLeague", null);
					self.set("newLeague", false);
				}
			});
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
		checkLeagueChange() {
			var nl = this.get("selectedLeague");
			var ol = this.get("leagueList")[this.get("selectedLeagueIndex")];
			var nn = nl.l_name;
			var on = ol.l_name;
			var nlg = (nl.l_logo===null)?"":nl.l_logo;
			var olg = (ol.l_logo===null)?"":ol.l_logo;
			var nc = parseInt(Ember.$("#sel_league_country")[0].value);
			var oc = ol.l_country;
			if (nn !== on || nlg !== olg || nc !== oc) {
				Ember.$("#save_ch_league")[0].disabled = false;
			} else {
				Ember.$("#save_ch_league")[0].disabled = true;
			}
		},
		saveChanges(f) {
			var self = this;
			var data;
			var ajaxURL, errorID;
			var checkFunc, beforeFunc, successFunc, errorFunc;
			switch (f) {
				/* TEMPLATE */
				/*
				case CASE:
					data = {
						
					};
					checkFunc = function() {
						//check all needed information is there
						//if everything's right then
						return true;
						//else
						return false;
					};
					errorID = "ID of error displaying element (Usually CASE_error)";
					beforeFunc = function() {
						//Some stuff to do before the ajax request
					};
					ajaxURL = "URL to which perform AJAX request";
					successFunc = function(data) {
						//Function to be called if request is successful.
						//Data parameters is response for the request
					}
					errorFunc = function() {
						//Error handling
					}
					break;
				*/
				case "country":
					data = {
						c_name: this.get("selectedCountry").c_name,
						c_flag: this.get("selectedCountry").c_flag
					};
					checkFunc = function() {
						if (!data.c_name || data.c_name === "") {
							this.send("showMessage", "country_error", "You have to fill the name field.");
							return false;
						}
						return true;
					};
					errorID = "country_error";
					beforeFunc = function() {
						if (self.get("selectedCountryIndex") !== -1) {
							var r = self.get("countryList")[self.get("selectedCountryIndex")];
							data.c_id = r.c_id;
						}
						self.set("countryLoading", true);
					};
					ajaxURL = "https://liugues-api.herokuapp.com/p/ch_country";
					successFunc = function(data) {
						self.send("showMessage", "country_success", data.msg);
						setTimeout(function() {
							window.location.reload();
						}, 1500);
						self.set("countryLoading", false);
					};
					errorFunc = function() {
						self.send("showMessage", "country_error", "An error occurred when trying to connect to the database");
						self.set("countryLoading", false);
					};
					break;
				case "league":
					var l_country;
					if (!Ember.$("#sel_league_country")[0]) {
						l_country = this.get("selectedLCountry").c_id;
					} else {
						l_country = parseInt(Ember.$("#sel_league_country")[0].value);
					}
					data = {
						l_name: this.get("selectedLeague").l_name,
						l_logo: this.get("selectedLeague").l_logo,
						l_country: l_country
					};
					ajaxURL = "http://liugues-api.herokuapp.com/p/ch_league";
					errorID = "league_error";
					checkFunc = function(){
						if (!data.l_name || data.l_name === "") {
							this.send("showMessage", errorID, "You have to fill the name field.");
							return false;
						}
						if (!data.l_country) {
							this.send("showMessage", errorID, "You have to choose a country.");
							return false;
						}
						return true;
					};
					beforeFunc = function(){
						if (self.get("selectedLeagueIndex") !== -1) {
							var r = self.get("leagueList")[self.get("selectedLeagueIndex")];
							data.l_id = r.l_id;
						}
						self.set("leagueLoading", true);
					};
					successFunc = function(data){
						self.send("showMessage", "league_success", data.msg);
						setTimeout(function() {
							window.location.reload();
						}, 1500);
						self.set("leagueLoading", false);
					};
					errorFunc = function(){
						self.send("showMessage", errorID, "An error occurred when trying to connect to the database");
						self.set("leagueLoading", false);
					};
					break;
			}
			if (!(checkFunc || function(){return false;})()) {return;}
			if (self.get("connectionBusy")) {
				this.send("showMessage", errorID, "The connection is now busy. Try again.");
				return;
			}
			self.set("connectionBusy", true);
			beforeFunc();
			Ember.$.ajax(ajaxURL, {
				method: "POST",
				data: data,
				before: function() {
					(beforeFunc || function(){})();
				},
				success: function(data) {
					(successFunc || function(data){
						console.log("Connection successful", data);
					})(data);
					self.set("connectionBusy", false);
				},
				error: function() {
					(successFunc || function(){
						console.log("An error happened");
					})();
					self.set("connectionBusy", false);
				}
			});
		},
		discardChanges(f) {
			switch (f) {
				case "country":
					this.set("selectedCountry", null);
					this.set("newCountry", false);
					break;
				case "league":
					this.set("selectedLeague", null);
					this.set("newLeague", false);
					this.set("countryLeagues", null);
					break;
			}
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
		loadLeague(event) {
			var t = event.target;
			var e = t.options[t.selectedIndex];
			var id = parseInt(e.id.substr("league".length));
			if (id !== undefined) {
				if (id === -1) {
					this.set("selectedLeague", {l_name: "", l_logo: "", l_country: ""});
					this.set("selectedLeagueIndex", -1);
					this.set("newLeague", true);
				} else {
					var l = null;
					var n = -1;
					var list = this.get("leagueList");
					for (var a in list) {
						if (list[a].l_id === id) {
							l = list[a];
							n = a;
							break;
						}
					}
					if (l !== null) {
						this.set("selectedLeague", {
							l_name: l.l_name,
							l_id: l.l_id,
							l_logo: l.l_logo,
							l_country: l.l_country
						});
						this.set("selectedLeagueIndex", n);
					} else {
						this.set("selectedLeague", {});
					}
				}
			} else {
				this.set("selectedLeague", null);
			}
		}
	}
});
