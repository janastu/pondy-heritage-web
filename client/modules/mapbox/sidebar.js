  // testing the meteor way components will be easy to customize
       // TODO: filter function is not working && event click on item should change view in map
Template.sidebar.helpers({
  content: function(){
    console.log("calling");
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

// sidebar form item for filter with type ahead
Template.filterForm.helpers({
  content: function(){
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
})