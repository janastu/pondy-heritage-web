Template.FilterUI.helpers({
	categories: function() {
		return Session.get('Categories');
	},
	groups: function() {
		return Session.get('Groups');
	}
});