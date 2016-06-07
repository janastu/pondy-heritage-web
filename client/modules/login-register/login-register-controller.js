
    //Submit login form to Meteor method
    Template.Login.events({
      'submit form': function(event){
        event.preventDefault();
        Session.set('loginSpinner', true);
        Meteor.call('Login', {username: event.target.username.value, password: event.target.password.value}, function(err, data){
          if(!err){
            console.log(data);
            Meteor.call('getGroupForUser', function(response){
              console.log(response);
              Session.set("Groupinfo", response); 

            });
           
          }
        });
      }
    });
    Template.Login.helpers({
        loaded: function(){
            return Session.get('loginSpinner');
        }
    });

    Template.Register.helpers({
        loaded: function() {
            return Session.get('registerSpinner');
        }
    });
    Template.Register.events({
      'submit form': function(event){
        event.preventDefault();
          Session.set('registerSpinner', true);
        Meteor.call('Register', {
          username: event.target.username.value, 
          password: event.target.password.value, 
          emailId: event.target.email.value,
          residentstatus: event.target.residentStatus.value,
          agestatus: event.target.ageGroup.value,
          specialmessage: event.target.specialmessage.value
        });
      }
    });