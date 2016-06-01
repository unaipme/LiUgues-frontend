import Ember from 'ember';

export default Ember.Component.extend({
	id: null,
	isLoading: true,
	isError: false,
	errorMsg: null,
	gameData: null,
	// When the component is loaded, the below init() function will retrieve all the 
	//needed information for the page to display
	// The isError variable, if true, will display an error message
	// The isLoading variable, while true, will display a loading animation
	// If the data has been correctly retrieved, both will be false, and gameData will be set
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
