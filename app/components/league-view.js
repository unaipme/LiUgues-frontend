import Ember from 'ember';

export default Ember.Component.extend({
	id: null,
	isLoading: true,
	isError: false,
	errorMsg: null,
	ranking: null,
	//When the component initializes, the function below loads the ranking information for the given season ID
	init: function() {
		this._super();
		var self = this;
		//Ember.$.ajax("http://localhost:5000/g/ranking", {
		Ember.$.ajax("https://liugues-api.herokuapp.com/g/ranking", {
			method: "GET",
			data: {s_id: self.get("id")},
			success: function(data) {
				if (data.error) {
					self.set("isError", true);
					self.set("errorMsg", data.data);
				} else {
					self.set("ranking", data.data);
				}
				self.set("isLoading", false);
				console.log(self.get("ranking"));
			},
			error: function() {
				self.set("isError", true);
				self.set("isLoading", false);
			}
		});
	}
});
