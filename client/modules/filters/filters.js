Template.FilterUI.helpers({
	categories: function() {
		return Session.get('Categories');
	},
	groups: function() {
		return Session.get('Groups');
	}
});

Template.FilterUI.events({
	'change input': function(event) {
  		var x = event.target.checked;
  		var cats = [];
  		if(Session.get("categoryFilter") == undefined){
  			cats = Session.get("categoryList");
  		} else {
  			cats = Session.get("categoryFilter")
  		}
  		if(x == true){
  			console.log("checked");
  			cats.push(event.target.name);
  			Session.set("categoryFilter", cats);
  		} else {
  			console.log("unchecked");
  			var clickIndex = cats.indexOf(event.target.name);
 			cats.splice(clickIndex, 1);
 			Session.set("categoryFilter", cats);
  		}
  		 
  		
 		myLayer.fireEvent('ready');
  		console.log(x, event.target.name, cats);
 	}
});