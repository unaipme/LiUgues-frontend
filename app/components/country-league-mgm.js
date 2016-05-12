import Ember from 'ember';

export default Ember.Component.extend({
	countryList: null,
	leagueList: null,
	seasonList: null,
	toggleElement: null,
	showMessage: null,
	countryLeagues: null,
	leagueSeasons: null,
	selectedCountry: null,
	selectedCountryIndex: -1,
	selectedLeague: null,
	selectedLeagueIndex: -1,
	selectedSeason: null,
	selectedSeasonIndex: -1,
	selectedLCountry: null,
	selectedSLeague: null,
	connectionBusy: false,
	newCountry: false,
	newLeague: false,
	newSeason: false,
	countryLoading: false,
	seasonLoading: false,
	injectionCheck: function(txt) {
		if ((typeof txt) !== 'string') {
			return false;
		}
		if (txt.indexOf("\"") !== -1 || txt.indexOf("'") !== -1 || txt.indexOf("\\") !== -1 || txt.indexOf(";") !== -1) {
			return true;
		}			
		return false;
	},
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
			if (this.get("selectedLCountry") !== null) {
				Ember.$("#ch_league_select")[0].options[0].selected = true;
			}
			this.set("selectedLCountry", lc);
			var r = this.get("leagueList").filter(function(i){
				return i.l_country === id;
			});
			if (r.length === 0) {
				this.set("countryLeagues", {});
			} else {
				this.set("countryLeagues", r);
			}
		},
		showSeasons(event) {
			var t = event.target;
			var e = t.options[t.selectedIndex];
			var id = parseInt(e.id.substr("sleague".length));
			var ss = this.get("seasonList").filter(function(i) {
				return i.s_league === id;
			});
			var l = this.get("leagueList").filter(function(i) {
				return i.l_id === id;
			})[0];
			if (this.get("selectedSLeague") !== null) {
				//Ember.$("#ch_league_select")[0].options[0].selected = true;
			}
			this.set("selectedSLeague", l);
			if (ss.length === 0) {
				this.set("leagueSeasons", {});
			} else {
				this.set("leagueSeasons", ss);
			}
		},
		deleteElement(f) {
			var name, ajaxURL;
			var data;
			var checkFunc, successFunc, errorFunc;
			var self = this;
			switch (f) {
				case "league":
					name = self.get("selectedLeague").l_name;
					ajaxURL = "https://liugues-api.herokuapp.com/p/del_league";
					data = {l_id: self.get("selectedLeague").l_id};
					checkFunc = function() {
						if (self.get("leagueLoading")) {
							self.send("showMessage", "country_error", "The connection is now busy. Try again.");
							return false;
						}
						self.set("leagueLoading", true);
						return true;
					};
					successFunc = function(data) {
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
					};
					errorFunc = function() {
						self.send("showMessage", "league_error", "An unknown error occurred");
						self.set("leagueLoading", false);
						self.set("selectedLeague", null);
						self.set("newLeague", false);
					};
				break;
				case "country":
					name = self.get("selectedCountry").c_name;
					ajaxURL = "https://liugues-api.herokuapp.com/p/del_country";
					data = {c_id: self.get("selectedCountry").c_id};
					checkFunc = function() {
						if (self.get("countryLoading")) {
							self.send("showMessage", "country_error", "The connection is now busy. Try again.");
							return false;
						}
						self.set("countryLoading", true);
						return true;
					};
					successFunc = function(data) {
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
					};
					errorFunc = function() {
						self.send("showMessage", "country_error", "An unknown error occurred");
						self.set("countryLoading", false);
						self.set("selectedCountry", null);
						self.set("newCountry", false);
					};
				break;
				case "season":
					name = Ember.$("#sel_season_desc")[0].value;
					ajaxURL = "https://liugues-api.herokuapp.com/p/del_season";
					data = {s_id: self.get("selectedSeason").s_id};
					checkFunc = function() {
						if (self.get("seasonLoading")) {
							self.send("showMessage", "country_error", "The connection is now busy. Try again.");
							return false;
						}
						self.set("seasonLoading", true);
						return true;
					};
					successFunc = function(data) {
						if (data.error) {
							self.send("showMessage", "season_error", data.msg);
							return;
						}
						self.send("showMessage", "season_success", data.msg);
						setTimeout(function() {
							window.location.reload();
						}, 1500);
						self.set("seasonLoading", false);
					};
					errorFunc = function() {
						self.send("showMessage", "season_error", "An unknown error occurred");
						self.set("seasonLoading", false);
						self.set("selectedSeason", null);
						self.set("newSeason", false);
					};
				break;
			}
			if (!confirm("Are you sure you want to delete "+name+"?")) {
				return;
			}
			if (!(checkFunc || function(){return false;})()) {
				return;
			}
			Ember.$.ajax(ajaxURL, {
				method: "POST",
				data: data,
				success: function(data) {
					successFunc(data);
				},
				error: function() {
					errorFunc();
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
				case "country":
					data = {
						c_name: self.get("selectedCountry").c_name,
						c_flag: self.get("selectedCountry").c_flag
					};
					errorID = "country_error";
					checkFunc = function() {
						if (!data.c_name || data.c_name === "") {
							self.send("showMessage", errorID, "You have to fill the name field.");
							return false;
						}
						var ic = self.get("injectionCheck");
						if (ic(data.c_name) || ic(data.c_flag)) {
							self.send("showMessage", errorID, "You can't use any of the following characters: \\ \" ; '");
							return false;
						}
						return true;
					};
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
						l_country = self.get("selectedLCountry").c_id;
					} else {
						l_country = parseInt(Ember.$("#sel_league_country")[0].value);
					}
					data = {
						l_name: self.get("selectedLeague").l_name,
						l_logo: self.get("selectedLeague").l_logo,
						l_country: l_country
					};
					ajaxURL = "https://liugues-api.herokuapp.com/p/ch_league";
					errorID = "league_error";
					checkFunc = function(){
						if (!data.l_name || data.l_name === "") {
							self.send("showMessage", errorID, "You have to fill the name field.");
							return false;
						}
						if (!data.l_country) {
							self.send("showMessage", errorID, "You have to choose a country.");
							return false;
						}
						var ic = self.get("injectionCheck");
						if (ic(data.l_name) || ic(data.l_logo)) {
							self.send("showMessage", errorID, "You can't use any of the following characters: \\ \" ; '");
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
						if (data.error) {
							
						} else {
							self.send("showMessage", "league_success", data.msg);
							setTimeout(function() {
								window.location.reload();
							}, 1500);
							self.set("leagueLoading", false);
						}
					};
					errorFunc = function(){
						self.send("showMessage", errorID, "An error occurred when trying to connect to the database");
						self.set("leagueLoading", false);
					};
					break;
				case "season":
					data = {
						s_desc: Ember.$("#sel_season_desc")[0].value,
						s_year: self.get("selectedSeason").s_year,
						s_league: self.get("selectedSLeague").l_id
					};
					errorID = "season_error";
					checkFunc = function() {
						if (!data.s_desc || data.s_desc === "" || !data.s_year) {
							self.send("showMessage", errorID, "You have to specify a year");
							return false;
						}
						var ic = self.get("injectionCheck");
						if (ic(data.s_year) || ic(data.s_desc)) {
							self.send("showMessage", errorID, "You can't use any of the following characters: \\ \" ; '");
							return false;
						}
						return true;
					};
					beforeFunc = function() {
						if (self.get("selectedSeasonIndex") !== -1) {
							var r = self.get("seasonList")[self.get("selectedSeasonIndex")];
							data.s_id = r.s_id;
						}
						self.set("seasonLoading", true);
					};
					ajaxURL = "https://liugues-api.herokuapp.com/p/ch_season";
					successFunc = function(data) {
						if (data.error) {
							
						} else {
							self.send("showMessage", "season_success", data.msg);
							setTimeout(function() {
								window.location.reload();
							}, 1500);
							self.set("seasonLoading", false);
						}
					};
					errorFunc = function() {
						self.send("showMessage", "season_error", "An error occurred when connecting to the database");
						self.set("seasonLoading", false);
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
					(errorFunc || function(){
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
					this.set("selectedLCountry", null);
					this.set("selectedLeague", null);
					this.set("newLeague", false);
					this.set("countryLeagues", null);
					break;
				case "season":
					this.set("selectedSLeague", null);
					this.set("newSeason", false);
					this.set("selectedSeason", null);
					this.set("leagueSeasons", null);
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
		},
		loadSeason(event) {
			var t = event.target;
			var e = t.options[t.selectedIndex];
			var id = parseInt(e.id.substr("season".length));
			if (id !== undefined) {
				if (id === -1) {
					this.set("selectedSeason", {s_id: "", s_desc: "", s_year: "", s_league: ""});
					this.set("selectedSeasonIndex", -1);
					this.set("newSeason", true);
				} else {
					var s = null;
					var n = -1;
					var list = this.get("seasonList");
					for (var a in list) {
						if (list[a].s_id === id) {
							s = list[a];
							n = a;
							break;
						}
					}
					if (s !== null) {
						this.set("selectedSeason", {
							s_id: s.s_id,
							s_desc: s.s_desc,
							s_year: s.s_year,
							s_league: s.s_league
						});
						this.set("selectedSeasonIndex", n);
					} else {
						this.set("selectedSeason", {});
					}
				}
			} else {
				this.set("selectedLeague", null);
			}
		}
	}
});
