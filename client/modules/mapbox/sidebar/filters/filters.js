Template.FilterUI.helpers({
	categories: function() {
    //return Template.instance().categories.get();
		return Session.get('Categories');
	},
	groups: function() {
		return Session.get('Groups');
	},
  checkedCategories: function(arg) {
    
    var filterArray = Session.get('categoryFilter');
    if(filterArray.indexOf(arg) !== -1){
      
      return true;
    }   
  },
  checkedGroups: function(arg){
    var filteredGroups = Session.get('groupFilter');
    if(filteredGroups.indexOf(arg) !== -1){
     
      return true;
    }
  }
});

/*Template.FilterUI.onCreated(function() {
  this.categories = () => appConfig.categorys;
  console.log("created", appConfig, this.categories);
  this.autorun(() => {
    this.subscribe('appConfig', this.categories());
  });
})*/

// TODO: maintain and sync UI state between filter dropdown
// and filter form in sidebar   



Template.FilterUI.events({
	'change .category-filter-event input': function(event, template) {
    event.preventDefault();
    var x = template;
   
  		var x = event.target.checked;
  		var cats = [];
  		if(Session.get("categoryFilter") == undefined){
  			cats = Session.get("categoryList");
  		} else {
  			cats = Session.get("categoryFilter")
  		}
  		if(x == true){
  		
  			cats.push(event.target.name);
  			Session.set("categoryFilter", cats);

  		} else {
  			
  			var clickIndex = cats.indexOf(event.target.name);
 			cats.splice(clickIndex, 1);
 			Session.set("categoryFilter", cats);
  		}
     
 		myLayer.fireEvent('ready');
     Router.go('app.show',{}, {'query': {'groups': Router.current().params.query.groups,
      'categories': cats.toString()}});
     return false; 
  	
 	},
  'change .group-filter-event input': function(event, template){
     event.preventDefault();
     var x = event.target.checked;
     var filteredGroups = Session.get('groupFilter');
     if(x == true){
       
        filteredGroups.push(event.target.name);
        Session.set("groupFilter", filteredGroups);

      } else {
        
        var clickIndex = filteredGroups.indexOf(event.target.name);
        filteredGroups.splice(clickIndex, 1);
        Session.set("groupFilter", filteredGroups);
      }
    
     myLayer.fireEvent('ready');
     Router.go('app.show',{}, {'query': {'groups': filteredGroups.toString(),
      'categories': Router.current().params.query.categories}});
     return false; 
  }
});