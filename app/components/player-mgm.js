import Ember from 'ember';

export default Ember.Component.extend({
	playerList: null,
	seasonList: null,
	teamList: null,
	countryList: null,
	positionList: [{id: 2, desc: "Goalkeeper"},{id: 12, desc: "Defender"},{id: 22, desc: "Midfielder"},{id: 32, desc: "Striker"}],
	alphabet: "A\u00c5BCDEFGHIJKLMNO\u00d6PQRSTUVWXYZ".split(""),
	selectedPlayer: null,
	selectedSPlayer: null,
	selectedCareer: null,
	selectedSTeams: null,
	loadingPlayer: false,
	loadingCareer: false,
	newPlayer: false,
	actions: {
		toggleElement(id) {
			this.get("toggleElement")(id);
		},
		showMessage(id, txt) {
			this.get("showMessage")(id, txt);
		},
		loadPlayer(id) {
			if (id === -1) {
				this.set("selectedPlayer", {});
				this.set("newPlayer", true);
			} else {
				this.set("selectedPlayer", this.get("playerList").filter(function(e) {
					return (e.p_id === id);
				})[0]);
			}
		},
		discardChanges(f) {
			switch (f) {
				case "player":
					this.set("selectedPlayer", null);
					this.set("newPlayer", false);
				break;
				case "signup":
					this.set("selectedSPlayer", null);
					this.set("selectedCareer", null);
					this.set("selectedSTeams", null);
				break;
			}
		},
		saveChanges(f) {
			var self = this;
			var data;
			var ajaxURL, errorID;
			var checkFunc, beforeFunc, successFunc, errorFunc;
			switch (f) {
				case "signup":
					data = {
						p_id: self.get("selectedSPlayer").p_id,
						s_id: Ember.$("#sign_new_season")[0].value,
						t_id: Ember.$("#sign_new_team")[0].value
					};
					//ajaxURL = "http://localhost:5000/p/ch_career";
					ajaxURL = "https://liugues-api.herokuapp.com/p/ch_career";
					errorID = "player_s_error";
					checkFunc = function() {
						if (!data.p_id || !data.s_id || !data.t_id || data.p_id < 0 || data.s_id < 0 || data.t_id < 0) {
							self.send("showMessage", errorID, "Some information is still missing");
							return false;
						}
						return true;
					};
					beforeFunc = function() {
						self.set("loadingCareer", true);
					};
					successFunc = function(data) {
						if (data.error) {
							self.send("showMessage", errorID, data.data);
						} else {
							self.send("showMessage", "player_s_success", "Signed up correctly");
							Ember.$("#sign_new_season")[0].options[0].selected = true;
							self.set("selectedSTeams", null);
							if (data.data) {
								if (data.data.players) {
									self.set("playerList", data.data.players);
								}
								var c = data.data.career;
								var l = [];
								for (var i=0; i<c.length; i++) {
									var t = self.get("teamList").filter(function(e) {
										return (e.t_id === c[i].t_id);
									})[0];
									var s = self.get("seasonList").filter(function(e) {
										return (e.s_id === c[i].s_id);
									})[0];
									l.push({season: s, team: t, id: i});
								}
								self.set("selectedCareer", l);
							} else {
								setTimeout(function() {
									window.location.reload();
								}, 1500);
							}
							self.set("loadingCareer", false);
						}
					};
					errorFunc = function() {
						self.send("showMessage", errorID, "An error occurred when approaching the database");
						self.set("loadingCareer", false);
					};
				break;
				case "player":
					data = {
						p_name: self.get("selectedPlayer").p_name,
						p_sname: self.get("selectedPlayer").p_sname,
						p_country: parseInt(Ember.$("#ch_player_country")[0].value),
						p_position: parseInt(Ember.$("#ch_player_position")[0].value)
					};
					ajaxURL = "http://liugues-api.herokuapp.com/p/ch_player";
					//ajaxURL = "http://localhost:5000/p/ch_player";
					errorID = "player_error";
					checkFunc = function() {
						if (!data.p_name || data.p_name === "" || !data.p_sname || data.p_sname === "") {
							self.send("showMessage", errorID, "You have to fill both the name and the surname");
							return false;
						}
						if (!data.p_country || data.p_country === -1) {
							self.send("showMessage", errorID, "You have to choose a country");
							return false;
						}
						if (!data.p_position || data.p_position === -1) {
							self.send("showMessage", errorID, "You have to choose a position");
							return false;
						}
						return true;
					};
					beforeFunc = function() {
						if (self.get("selectedPlayer").p_id) {
							data.p_id = self.get("selectedPlayer").p_id;
						}
						self.set("loadingPlayer", true);
					};
					successFunc = function(data) {
						if (data.error) {
							self.send("showMessage", errorID, data.data);
						} else {
							self.send("showMessage", "player_success", "The changes were saved successfully");
							if (data.data) {
								self.set("playerList", data.data);
							} else {
								setTimeout(function() {
									window.location.reload();
								}, 1500);
							}
						}
						self.set("selectedPlayer", null);
						self.set("newPlayer", false);
						self.set("loadingPlayer", false);
					};
					errorFunc = function() {
						self.send("showMessage", errorID, "An error occurred when approaching the database");
						self.set("selectedPlayer", null);
						self.set("newPlayer", false);
						self.set("loadingPlayer", false);
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
				case "signup":
					var p = self.get("selectedSPlayer");
					var el = self.get("selectedCareer").filter(function(e) {
						return (e.id === id);
					})[0];
					console.log(el);
					name = p.p_name + " " + p.p_sname + " from " + el.team.t_name;
					//ajaxURL = "http://localhost:5000/p/del_career";
					ajaxURL = "https://liugues-api.herokuapp.com/p/del_career";
					data = {
						p_id: p.p_id,
						s_id: el.season.s_id,
						t_id: el.team.t_id
					};
					checkFunc = function() {
						if (!data.p_id || !data.s_id || !data.t_id) {
							self.send("showMessage", "player_s_error", "More information is required");
							return false;
						}
						return true;
					};
					successFunc = function(data) {
						if (data.error) {
							self.send("showMessage", "player_s_error", data.data);
						} else {
							self.send("showMessage", "player_s_success", "Deleted successfully");
							if (data.data) {
								if (data.data.length > 0) {
									var c = data.data;
									var l = [];
									for (var i=0; i<c.length; i++) {
										var t = self.get("teamList").filter(function(e) {
											return (e.t_id === c[i].t_id);
										})[0];
										var s = self.get("seasonList").filter(function(e) {
											return (e.s_id === c[i].s_id);
										})[0];
										l.push({season: s, team: t, id: i});
									}
									self.set("selectedCareer", l);
								} else {
									self.set("selectedCareer", null);
								}
							} else {
								setTimeout(function() {
									window.location.reload();
								}, 1500);
							}
						}
					};
					errorFunc = function() {
						self.send("showMessage", "player_s_error", "An error occurred when approaching the database");
					};
				break;
				case "player":
					var p = self.get("playerList").filter(function(e) {
						return (id === e.p_id);
					})[0];
					name = p.p_name + " " + p.p_sname;
					//ajaxURL = "http://localhost:5000/p/del_player";
					ajaxURL = "https://liugues-api.herokuapp.com/p/del_player";
					data = {p_id: id};
					checkFunc = function() {
						if (!data.p_id || data.p_id < 0) {
							return false;
						}
						return true;
					};
					successFunc = function(data) {
						if (data.error) {
							self.send("showMessage", "player_error", data.data);
						} else {
							self.send("showMessage", "player_success", "Player deleted successfully");
							if (data.data) {
								self.set("playerList", data.data);
							} else {
								setTimeout(function() {
									window.location.reload();
								}, 1500);
							}
							if (self.get("selectedSPlayer").p_id === id) {
								self.set("selectedSPlayer", null);
								self.set("selectedCareer", null);
							}
						}
						self.set("loadingPlayer", false);
					};
					errorFunc = function() {
						self.send("showMessage", "player_error", "An error occurred when approaching the database");
						self.set("loadingPlayer", false);
					};
					self.set("loadingPlayer", true);
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
		showPlayer(id) {
			var self = this;
			Ember.$("#choose_player_"+id)[0].style.display = "none";
			Ember.$("#loading_player_"+id)[0].style.display = "initial";
			//Ember.$.ajax("http://localhost:5000/g/career", {
			Ember.$.ajax("https://liugues-api.herokuapp.com/g/career", {
				method: "GET",
				data: {p_id: id},
				success: function(data) {
					if (data.error) {
						self.send("showMessage", "player_s_error", data.error);
					} else {
						if (data.data.length > 0) {
							var c = data.data;
							var l = [];
							for (var i=0; i<c.length; i++) {
								var t = self.get("teamList").filter(function(e) {
									return (e.t_id === c[i].t_id);
								})[0];
								var s = self.get("seasonList").filter(function(e) {
									return (e.s_id === c[i].s_id);
								})[0];
								l.push({season: s, team: t, id: i});
							}
							self.set("selectedCareer", l);
						} else {
							self.set("selectedCareer", null);
						}
						var p = self.get("playerList").filter(function(e) {
							return (e.p_id === id);
						})[0];
						self.set("selectedSPlayer", p);
					}
					
				},
				error: function() {
					self.send("showMessage", "player_s_error", "An error occurred when approaching the database");
				},
				complete: function() {
					Ember.$("#choose_player_"+id)[0].style.display = "initial";
					Ember.$("#loading_player_"+id)[0].style.display = "none";
				}
			});
		},
		loadTeamList() {
			var id = parseInt(Ember.$("#sign_new_season")[0].value);
			var t = this.get("teamList").filter(function(e) {
				for (var i=0; i<e.seasons.length; i++) {
					if (e.seasons[i].s_id === id) {
						return true;
					}
				}
				return false;
			});
			this.set("selectedSTeams", t);
		}
	}
});
