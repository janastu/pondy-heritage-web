pondyHeritage = new Mongo.Collection('testPondy');

// In a file loaded on the server (ignored on the client)
pondyHeritage.allow({
  insert: function(){
  	return true
  },
  remove: function(){
  	return false
  },
  update: function(){
  	return false
  }
  // since there is no update field, all updates
  // are automatically denied
});


