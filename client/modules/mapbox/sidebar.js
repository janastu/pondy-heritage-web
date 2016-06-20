  // testing the meteor way components will be easy to customize
       // TODO: filter function is not working && event click on item should change view in map

Template.sidebar.helpers({
  content: function(){
    console.log("calling");
    console.log(Router.current().params);
    var filters = Session.get('categoryFilter');
    var filteredFeatures = _.compact(_.map(GeoJson.get('Features').features, function(item) {
      if(filters.indexOf(item.properties.category) !== -1){
        
        return item
      } 
    }));
    console.log(filteredFeatures, GeoJson);
    return filteredFeatures;
   
  }
});

Template.sidebar.events({
  'click a':function(event){
    var features = GeoJson.get("Features");
    var featureId = event.target.getAttribute('for');
    myLayer.eachLayer(function(layer){
      if(layer.feature.id === featureId){
        layer.openPopup();
            console.log(layer.feature);
          }
    });
    
    console.log(event.target);
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