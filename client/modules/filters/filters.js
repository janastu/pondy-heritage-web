Template.FilterUI.helpers({
	categories: function() {
    //return Template.instance().categories.get();
		return Session.get('Categories');
	},
	groups: function() {
		return Session.get('Groups');
	},
  checkedItems: function(category) {
    
    var filterArray = Session.get('categoryFilter');
    if(filterArray.indexOf(category) !== -1){
      console.log(category, "true");
      return true;
    }
    /*return _.each(filterArray, function(item){
      
       if(category === item ) {
        console.log(category, item, "true");
        return true;
      }
    });*/
   
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
	'change input': function(event, template) {
    event.preventDefault();
    var x = template;
    console.log(template.state, Template.instance());
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
     Router.go('app.show',{}, {'query': {'categories': cats.toString()}});
     return false; 
  	
 	}
});