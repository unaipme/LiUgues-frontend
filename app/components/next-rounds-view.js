import Ember from 'ember';

export default Ember.Component.extend({
	isLoading: true,
	isError: false,
	gameList: null,
	init: function() {
		this._super();
		var self = this;
		//Ember.$.ajax("http://localhost:5000/g/next_games", {
		Ember.$.ajax("https://liugues-api.herokuapp.com/g/next_games", {
			method: "GET",
			success: function(data) {
				console.log("Success");
				self.set("isLoading", false);
				if (data.error) {
					self.set("isError", true);
				} else {
					self.set("gameList", data.data);
				}
			},
			error: function() {
				self.set("isLoading", false);
				self.set("isError", true);
			}
		});
	}
});
