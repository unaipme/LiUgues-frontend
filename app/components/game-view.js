import Ember from 'ember';

export default Ember.Component.extend({
	id: null,
	isLoading: true,
	isError: false,
	errorMsg: null,
	gameData: null,
	init: function() {
		this._super();
		var self = this;
		//Ember.$.ajax("http://localhost:5000/g/games", {
		Ember.$.ajax("https://liugues-api.herokuapp.com/g/games", {
			method: "GET",
			data: {g_id: self.get("id")},
			success: function(data) {
				console.log(data);
				if (data.error) {
					self.set("isError", true);
					self.set("errorMsg", data.data);
				} else {
					self.set("gameData", data.data);
				}
				self.set("isLoading", false);
			},
			error: function() {
				self.set("isError", true);
				self.set("isLoading", false);
			}
		});
	}
});
