import Ember from 'ember';

export default Ember.Component.extend({
	showID: 0,
	actions: {
		//Manages the "tabs" of the front page, and allows for more tabs in the future
		show(id) {
			switch(id) {
				case "next_games":
					this.set("showID", 0);
				break;
				case "last_games":
					this.set("showID", 1);
				break;
			}
		}
	}
});
