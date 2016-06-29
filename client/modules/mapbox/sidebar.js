  // testing the meteor way components will be easy to customize
       // TODO: filter function is not working && event click on item should change view in map

Template.sidebar.helpers({
  content: function(){
    
    var filters = Session.get('categoryFilter');
    var groupFilter = Session.get('groupFilter');
    var featuresByDate = _.sortBy(GeoJson.get("Features").features, function(item){
      return item.properties.uploadTime;
    });
    filteredFeatures = _.compact(_.map(featuresByDate, function(item) {
      if(filters.indexOf(item.properties.category) !== -1 && groupFilter.indexOf(item.properties.groupname) !== -1){
        
        return item
      } 
    }));
    return filteredFeatures;
 },
 isOwner: function(arg){
  var user = Session.get('userSession').token.split(":")[0].trim();
  if(user == arg){
    return true
  }
}

 
});

Template.sidebar.onRendered(function(){
  Session.set('uploadSpin', false);
});

Template.sidebarLayout.onRendered(function(){
  $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });
});

Template.sidebarLayout.helpers({

  showDialog: function() {
    return Session.get('showDialog');

  },
  loaded: function() {
    return Session.get('uploadSpin');
  }
});

Template.sidebarLayout.onCreated(function(){
  Session.set('uploadSpin', true);
});

Template.sidebarHeader.helpers({
   content: function(){
    
    var filters = Session.get('categoryFilter');
    var groupFilter = Session.get('groupFilter');
    filteredFeatures = _.compact(_.map(GeoJson.get('Features').features, function(item) {
     
            if(filters.indexOf(item.properties.category) !== -1 && groupFilter.indexOf(item.properties.groupname) !== -1){
                    return item;
      } 
   
    }));
    
    return filteredFeatures;
   
  },
  filterCategory: function(){
    return Session.get('categoryFilter');
  },
  filterCount: function(arg){
   
        return arg.length;
    
  }
});
Template.sidebar.events({
  'click img':function(event){
    var features = GeoJson.get("Features");
    var featureId = event.target.getAttribute('for');
    myLayer.eachLayer(function(layer){
      if(layer.feature.id === featureId){
        //TODO: map zoom is too high - to make the popup to open
        //since marker is in a clustergroup
        MAP.setView(layer.getLatLng(), 20);
        //map.panTo(marker.getLatLng());
        layer.openPopup();
        
            console.log(layer.getLatLng());
          }
    });
  },
  'click .content-show-event': function(event, template){
    event.preventDefault();
      template.$('div.card-reveal[data-rel=' + event.target.getAttribute('data-rel') + ']').slideToggle('slow');
  },
  'click .card-reveal .close': function(event, template){
    event.preventDefault();
      template.$('div.card-reveal[data-rel=' + event.target.getAttribute('data-rel') + ']').slideToggle('slow');
  }

});

Template.LoggedUser.helpers({


  userSession: function(){
    // user session if saved in browser session storage
if(sessionStorage.userSession){
            var userSession = JSON.parse(sessionStorage.userSession);
            Session.set('userSession', userSession);
            Session.set('showDialog', true);

}

    if(Session.get('userSession')){
      var userStr = Session.get('userSession').token;
      var usrArray = userStr.split(":");
      var loggedUser = usrArray[0].toUpperCase();
      return {"loggedUser": loggedUser};

    } else {
      console.log("log in");
    }
  }
});
Template.LoggedUser.events({
  "click li": function() {
    sessionStorage.userSession = "";
    Session.set('userSession', "");
    Session.set('showDialog', false);
    MAP.removeControl(DRAWCNTRL);

  }

});


/* disabled: TODO: Feature incomplete
// sidebar form item for filter with TODO: type ahead
Template.filterForm.helpers({
  content: function(){
    //return Template.instance.categories;
    return Session.get('categoryFilter');
  }
});

//TODO: event handler for the input field
Template.filterForm.events({
  "change input": function(event, template){
    event.preventDefault();
    var formValue = event.target.value;
    var arrayForm = formValue.split(',').map(function(n) {return Number(n);});
    //var arrayForm = JSON.parse("["+formValue.toString()+"]");
    console.log(formValue, arrayForm, template);
  }
});


/*Template.filterForm.onCreated(function(){
  var instance = this;
    instance.categories = function(){
      return appConfig.get('appConfig').categorys.map(function(cat){
        return cat.categoryName;
      })};
  
  instance.autorun = function() {
    Session.set('categoryFilter', Template.instance().categories);
    instance.subscribe('content', instance.categories());
  }
});*/
/*Template.filterForm.onRendered(function(){
  Template.instance().$('input').tagsinput();
  this.autorun = function() {
  Template.instance().$('input').tagsinput('add', Session.get('categoryList'));
}
  //console.log(Template.instance().categories, "rendered");
});*/