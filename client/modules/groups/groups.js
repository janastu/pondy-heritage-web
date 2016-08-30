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
  },
  'click .join-group-action': function(event, template){
    event.preventDefault();
    console.log(event.target.getAttribute('data-group-id'));
    Meteor.call('joinGroup', {userName: Session.get("userSession").token.split(":")[0],
                              groupId: event.target.getAttribute('data-group-id'),
                              token: Session.get("userSession").token
                            });
    /*MAPP.API.joinGroup({userName: Session.get("userSession").token.split(":")[0],
                              groupId: event.target.getAttribute('data-group-id'),
                              token: Session.get("userSession").token
                            });*/
  }

});