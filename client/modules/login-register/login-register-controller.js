
    //Submit login form to Meteor method
    Template.Login.events({
      'submit form': function(event){
        event.preventDefault();
        Session.set('loginSpinner', true);
        Meteor.call('Login', 
          {username: event.target.username.value, 
            password: event.target.password.value
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

    //JQuery validation library for form validation
    Template.Login.onRendered(function(){
      Template.instance().$('form').validate({
        onsubmit: false,
        onfocusout: function(element, event){
          $(element).valid();
        },
        rules:{
          username:{
            required: true,
            minlength: 5
          },
          password: {
            required:true,
            minlength: 5
          }
        }
    });
    });
    //register component
    Template.Register.onRendered(function(){
      
      Template.instance().$('form').validate({
        onsubmit: function(form){
          form.valid();
        },
        onfocusout: function(element, event){
          $(element).valid();
        },
        
        rules:{
          username:{
            required: true,
            minlength: 5
          },
          email:{
            required:true,
            email:true
          },
          password: {
            required:true,
            minlength: 5
          },
          confirmPassword:{
            required:true,
            minlength:5,
            equalTo: '[name="password"]'
          },
          ageGroup:{
            required:true
          },
          residentStatus: {
            required:true
          },
          messages: {
            username: "Require username with atleast 5 characters",
            password: "Doesnot match the password"
          }
        }
        });
    });
