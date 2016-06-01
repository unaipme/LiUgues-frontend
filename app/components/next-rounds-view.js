import Ember from 'ember';

export default Ember.Component.extend({
	isLoading: true,
	isError: false,
	gameList: null,
	ajaxURL: null,
	// When the component initializes, the function below loads the information received
	//from the given URL (which will be an URL to the backend)
	init: function() {
		this._super();
		var self = this;
		var url = self.get("ajaxURL");
		Ember.$.ajax(url, {
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
