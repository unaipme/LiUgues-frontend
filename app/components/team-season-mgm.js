import Ember from 'ember';

export default Ember.Component.extend({
	toggleElement: null,
	showMessage: null,
	teamList: null,
	countryList: null,
	leagueList: null,
	alphabet: "A\u00c5BCDEFGHIJKLMNO\u00d6PQRSTUVWXYZ".split(""),
	selectedTeam: null,
	selectedTeamIndex: -1,
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
					self.send("showMessage", "season_error", "An error occurred when connecting to the database");
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
		}
	}
});
