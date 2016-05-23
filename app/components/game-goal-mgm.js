import Ember from 'ember';

export default Ember.Component.extend({
	teamList: null,
	gameList: null,
	seasonList: null,
	roundList: null,
	selectedSeason: null,
	selectedSRounds: null,
	selectedSRoundEl: 0,
	selectedSRGames: null,
	selectedEGame: null,
	selectedEGameIndex: -1,
	selectedSTeams: null,
	actions: {
		showMessage(id, txt) {
			this.get("showMessage")(id, txt);
		},
		toggleElement(id) {
			this.get("toggleElement")(id);
		},
		discardChanges(f) {
			switch(f) {
				case "game":
					this.set("selectedSeason", null);
					this.set("selectedSRounds", null);
					this.set("selectedSRGames", null);
					this.set("selectedSRoundEl", 0);
					this.set("selectedSTeams", null);
				break;
				case "gameEdit":
					this.set("newGame", false);
					this.set("selectedEGame", null);
				break;
			}
		},
		saveChanges(f) {
			var self = this;
			var data;
			var ajaxURL, errorID;
			var checkFunc, beforeFunc, successFunc, errorFunc;
			switch (f) {
				case "game":
					var regexp = /\d{4}[-]\d{2}[-]\d{2}[ ]\d{2}[:]\d{2}/;
					data = {
						g_hometeam_id: parseInt(Ember.$("#ch_home_game")[0].value),
						g_awayteam_id: parseInt(Ember.$("#ch_away_game")[0].value),
						g_when: Ember.$("#ch_when_game")[0].value,
						g_round: self.get("selectedSRounds")[self.get("selectedSRoundEl")].r_id
					};
					ajaxURL = "https://liugues-api.herokuapp.com/p/ch_game";
					//ajaxURL = "http://localhost:5000/p/ch_game";
					errorID = "game_error";
					checkFunc = function() {
						if (data.g_hometeam_id === -1 || data.g_awayteam_id === -1 || !data.g_when) {
							self.send("showMessage", errorID, "Fill all fields");
							return false;
						}
						if (data.g_hometeam_id === data.g_awayteam_id) {
							self.send("showMessage", errorID, "Both home and away teams can not be the same");
							return false;
						}
						if (!regexp.test(data.g_when)) {
							self.send("showMessage", errorID, "The date and time are not in the required format: YYYY-MM-DD hh:mm");
							return false;
						}
						return true;
					};
					beforeFunc = function() {
						if (self.get("selectedEGame").g_id) {
							data.g_id = self.get("selectedEGame").g_id;
						}
					};
					successFunc = function(data) {
						if (data.error) {
							self.send("showMessage", errorID, data.data);
						} else {
							self.send("showMessage", "game_success", "Successfully updated");
							if (data.data) {
								self.set("gameList", data.data);
								self.set("newGame", false);
								self.set("selectedEGame", null);
								self.send("scrollList", 0);
							} else {
								setTimeout(function() {
									window.location.reload();
								}, 1500);
							}
						}
					};
					errorFunc = function() {
						self.send("showMessage", errorID, "An error occurred when approaching the database");
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
		deleteElement(f) {
			var name, ajaxURL;
			var data;
			var checkFunc, successFunc, errorFunc;
			var self = this;
			switch (f) {
				case "game":
					var game = self.get("selectedEGame");
					name = game.g_hometeam + " - " + game.g_awayteam;
					//ajaxURL = "http://localhost:5000/p/del_game";
					ajaxURL = "https://liugues-api.herokuapp.com/p/del_game";
					data = {g_id: game.g_id};
					checkFunc = function() {
						if (!data.g_id) {
							self.send("showMessage", "game_error", "The game's ID was not specified");
							return false;
						}
						return true;
					};
					successFunc = function(data) {
						if (data.error) {
							self.send("showMessage", "game_error", data.data);
						} else {
							self.send("showMessage", "game_success", data.data);
							setTimeout(function() {
								window.location.reload();
							}, 1500);
						}
					};
					errorFunc = function() {
						self.send("showMessage", "game_error", "An error occurred when approaching the database");
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
		loadSeason() {
			var id = parseInt(Ember.$("#ch_game_season")[0].value);
			var self = this;
			var l = self.get("roundList").filter(function(e) {
				return (e.r_season === id);
			});
			var s = self.get("seasonList").filter(function(e) {
				return (e.s_id === id);
			})[0];
			var g;
			if (l.length > 0) {
				g = self.get("gameList").filter(function(e) {
					return (e.g_round === l[0].r_id);
				});
			} else {
				g = null;
			}
			self.set("selectedSTeams", s.teams);
			self.set("selectedSRounds", l);
			self.set("selectedSeason", s);
			self.set("selectedSRGames", g);
		},
		loadGame(id) {
			if (id === -1) {
				this.set("selectedEGame", {});
				this.set("selectedEGameIndex", -1);
				this.set("newGame", true);
			} else {
				var l = this.get("selectedSRGames");
				for (var i=0; i < l.length; i++) {
					if (l[i].g_id === id) {
						var g = l[i];
						this.set("selectedEGame", {
							g_id: g.g_id,
							g_hometeam_id: g.g_hometeam_id,
							g_awayteam_id: g.g_awayteam_id,
							g_when: g.g_when,
							g_hometeam: g.g_hometeam,
							g_awayteam: g.g_awayteam
						});
						this.set("selectedEGameIndex", i);
						this.set("newGame", false);
						return;
					}
				}
			}
		},
		scrollList(n) {
			var v = this.get("selectedSRoundEl");
			var nv = v + n;
			var l = this.get("selectedSRounds").length;
			var self = this;
			if (nv === l) {
				nv = 0;
			} else if (nv < 0) {
				nv = l - 1;
			}
			console.log("HEJEH", this.get("gameList"));
			var g = this.get("gameList").filter(function(e) {
				return (e.g_round === self.get("selectedSRounds")[nv].r_id);
			});
			this.set("selectedSRGames", g);
			this.set("selectedSRoundEl", nv);
		}
	}
});
