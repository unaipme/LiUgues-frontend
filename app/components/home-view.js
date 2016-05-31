import Ember from 'ember';

export default Ember.Component.extend({
	showID: 0,
	actions: {
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
