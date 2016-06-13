Template.FilterUI.helpers({
	categories: function() {
		return Session.get('Categories');
	},
	groups: function() {
		return Session.get('Groups');
	}
});

Template.FilterUI.events({
	'click li a': function(event){
		var cats = Session.get("categoryList");
		
		var clickIndex = cats.indexOf(event.target.innerHTML);
		cats.splice(clickIndex, 1);
		Session.set("categoryFilter", cats);
		console.log(cats);
		myLayer.fireEvent('ready')
	}
});