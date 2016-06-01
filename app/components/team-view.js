import Ember from 'ember';

export default Ember.Component.extend({
	id: null,
	isLoading: true,
	isError: false,
	errorMsg: null,
	teamData: null,
	//When the component is initialized, loads the information from the backend
	init: function() {
		this._super();
		var self = this;
		//Ember.$.ajax("http://localhost:5000/g/teams", {
		Ember.$.ajax("https://liugues-api.herokuapp.com/g/teams", {
			method: "GET",
			data: {t_id: self.get("id")},
			success: function(data) {
				self.set("isLoading", false);
				if (data.error) {
					self.set("isError", true);
					self.set("errorMsg", data.data);
				} else {
					self.set("teamData", data.data);
				}
			},
			error: function() {
				self.set("isError", true);
				self.set("isLoading", false);
			}
		});
	}
});
