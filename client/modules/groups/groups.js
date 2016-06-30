Template.Groups.helpers({
	groups: function(){
		return Session.get('Groups');
	}
});

Template.Groups.events({
	 'click .content-show-event': function(event, template){
    event.preventDefault();
      template.$('div.card-reveal[data-rel=' + event.target.getAttribute('data-rel') + ']').slideToggle('slow');
  },
  'click .card-reveal .close': function(event, template){
    event.preventDefault();
      template.$('div.card-reveal[data-rel=' + event.target.getAttribute('data-rel') + ']').slideToggle('slow');
  }

});