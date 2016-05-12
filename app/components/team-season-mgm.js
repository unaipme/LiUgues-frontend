import Ember from 'ember';

export default Ember.Component.extend({
	toggleElement: null,
	showMessage: null,
	teamList: null,
	matchingList: null,
	countryList: null,
	seasonList: null,
	alphabet: "A\u00c5BCDEFGHIJKLMNO\u00d6PQRSTUVWXYZ".split(""),
	selectedTeam: null,
	selectedTeamIndex: -1,
	selectedSUTeam: null,
	selectedSUTSeasons: null,
	selectedSUTMSeasons: null,
	newTeam: false,
	connectionBusy: false,
	actions: {
		toggleElement(id) {
			this.get("toggleElement")(id);
		},
		showMessage(id, txt) {
			this.get("showMessage")(id, txt);
		},
		updateTeam(id) {
			var teamList = this.get("teamList");
			for (var i in teamList) {
				if (teamList[i].t_id === id) {
					this.set("selectedTeam", teamList[i]);
					this.set("selectedTeamIndex", i);
					this.set("newTeam", false);
					return;
				}
			}
			this.set("newTeam", true);
			this.set("selectedTeam", {});
			this.set("selectedTeamIndex", -1);
		},
		discardChanges(f) {
			switch (f) {
				case "team":
					this.set("newTeam", false);
					this.set("selectedTeam", null);
					this.set("selectedTeamIndex", -1);
				break;
				case "signup":
					this.set("selectedSUTeam", null);
					this.set("selectedSUTSeasons", null);
				break;
			}
		},
		saveChanges(f) {
			var self = this;
			var data;
			var ajaxURL, errorID;
			var checkFunc, beforeFunc, successFunc, errorFunc;
			switch (f) {
				case "team":
					data = {
						t_name: this.get("selectedTeam").t_name,
						t_crest: this.get("selectedTeam").t_crest,
						t_country: parseInt(Ember.$("#sel_team_country")[0].value),
						t_stadium: this.get("selectedTeam").t_stadium,
						t_city: this.get("selectedTeam").t_city
					};
					ajaxURL = "https://liugues-api.herokuapp.com/p/ch_team";
					errorID = "team_error";
					checkFunc = function() {
						if (!data.t_name || data.t_name === "") {
							self.send("showMessage", errorID, "A name for the team is required");
							return false;
						}
						if (!data.t_country || data.t_country === -1) {
							self.send("showMessage", errorID, "Choose a country");
							return false;
						}
						return true;
					};
					beforeFunc = function() {
						if (self.get("selectedTeam").t_id) {
							data.t_id = self.get("selectedTeam").t_id;
						}
					};
					successFunc = function(data) {
						self.send("showMessage", "team_success", data.msg);
						setTimeout(function() {
							window.location.reload();
						}, 1500);
					};
					errorFunc = function() {
						self.send("showMessage", errorID, "An error occurred when connecting to the database");
					};
				break;
				case "signup":
					data = {
						t_id: this.get("selectedSUTeam").t_id,
						s_id: parseInt(Ember.$("#season_signup_select")[0].value)
					};
					ajaxURL = "https://liugues-api.herokuapp.com/p/add_team_season";
					//ajaxURL = "http://localhost:5000/p/add_team_season";
					errorID = "signup_error";
					checkFunc = function() {
						if (!data.s_id) {
							self.send("showMessage", errorID, "Somehow you managed to try and sign up for no season. Choose one season, please.");
							return false;
						}
						return true;
					};
					successFunc = function(data) {
						if (data.error) {
							self.send("showMessage", errorID, data.msg);
						} else {
							self.send("showMessage", "signup_success", data.msg);
							setTimeout(function() {
								window.location.reload();
							}, 1500);
						}
					};
					errorFunc = function() {
						self.send("showMessage", errorID, "An error occurred when connecting to the database");
					};
				break;
			}
			if (!(checkFunc || function(){return false;})()) {return;}
			if (self.get("connectionBusy")) {
				this.send("showMessage", errorID, "The connection is now busy. Try again.");
				return;
			}
			self.set("connectionBusy", true);
			(beforeFunc || function(){})();
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
		deleteElement(f, id) {
			var name, ajaxURL;
			var data;
			var checkFunc, successFunc, errorFunc;
			var self = this;
			switch (f) {
				case "team":
					ajaxURL = "https://liugues-api.herokuapp.com/p/del_team";
					var t = this.get("teamList").filter(function(i) {
						return i.t_id === id;
					})[0];
					name = t.t_name;
					data = {t_id: id};
					checkFunc = function() {
						return true;
					};
					successFunc = function(data) {
						if (data.error) {
							self.send("showMessage", "team_error", data.msg);
							return;
						}
						self.send("showMessage", "team_success", data.msg);
						setTimeout(function() {
							window.location.reload();
						}, 1500);
					};
					errorFunc = function() {
						self.send("showMessage", "team_error", "An error occurred");
					};
				break;
				case "signup":
					ajaxURL = "https://liugues-api.herokuapp.com/p/del_team_season";
					//ajaxURL = "http://localhost:5000/p/del_team_season";
					var s = this.get("seasonList").filter(function(i) {
						return i.s_id === id;
					})[0];
					name = this.get("selectedSUTeam").t_name + " from " + s.s_desc;
					data = {s_id: id, t_id: this.get("selectedSUTeam").t_id};
					checkFunc = function() {
						if (!data.s_id) {
							self.send("showMessage", "signup_error", "Season ID missing");
							return false;
						}
						if (!data.t_id) {
							self.send("showMessage", "signup_error", "Team ID missing");
							return false;
						}
						return true;
					};
					successFunc = function(data) {
						if (data.error) {
							self.send("showMessage", "signup_error", data.msg);
							return;
						}
						self.send("showMessage", "signup_success", data.msg);
						setTimeout(function() {
							window.location.reload();
						}, 1500);
					};
					errorFunc = function() {
						self.send("showMessage", "signup_error", "An error occurred");
					};
				break;
				
			}
			if (!(checkFunc || function(){return false;})()) {
				return;
			}
			if (!confirm("Are you sure you want to delete "+name+"?")) {
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
		searchTeam() {
			var t = Ember.$("#team_search_field")[0].value;
			var l = Ember.$("#matching_team_list")[0];
			var self = this;
			if (t !== "") {
				var r = this.get("teamList").filter(function(e) {
					return (e.t_name.toLowerCase().indexOf(t.toLowerCase()) !== -1);
				});
				this.set("matchingList", r);
				Ember.$(l).slideDown();
			} else {
				Ember.$(l).slideUp({complete: function() {
					self.set("matchingList", null);
				}});
			}
		},
		chooseForSignup(id) {
			var self = this;
			Ember.$("#signup_choose_"+id)[0].style.display = "none";
			Ember.$("#signup_loading_"+id)[0].style.display = "initial";
			//Ember.$.ajax("http://localhost:5000/g/teams", {
			Ember.$.ajax("https://liugues-api.herokuapp.com/g/teams", {
				method: "GET",
				data: {t_id: id},
				success: function(data) {
					self.set("selectedSUTeam", data);
					self.set("selectedSUTSeasons", data.seasons);
					var sutms = self.get("seasonList").filter(function(e) {
						var s = data.seasons;
						console.log(e);
						if (e.l_country !== data.t_country) return false;
						console.log("SAME COUNTRY");
						for (var i=0; i<s.length; i++) {
							if (s[i].s_id === e.s_id) {
								console.log("SIGNED UP");
								return false;
							}
						}
						return true;
					});
					self.set("selectedSUTMSeasons", (sutms.length === 0)?null:sutms);
				},
				error: function() {
					self.send("showMessage", "signup_error", "An error occurred when trying to reach the database");
				}
			});
		}
	}
});
