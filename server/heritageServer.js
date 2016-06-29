Meteor.startup( function() {
  process.env.MAIL_URL = "smtp://postmaster%40sandboxdcda33a4a60a4ce6957fcd7aaa64adf0.mailgun.org:44e7f23bfbccd381d177de055f6ba5c9@smtp.mailgun.org:587";
});

Meteor.publish('heritageGeoJson', function(){
	return pondyHeritage.find({});
});

//Kadira.connect('rCPwr3YYdfqiNu427', 'd83f81f7-1d7a-49c1-8075-0f25bfc2be1b');
