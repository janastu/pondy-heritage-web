Template.navBar.helpers({
	logo: function(){
		return Meteor.settings.public.appConfig.logo;
	},
	appName: function(){
		return Meteor.settings.public.appConfig.appName;
	},
	queryParams: function(){
		return "groups="+Meteor.settings.public.appConfig.groups.join(",")+"&"+"categories="+Meteor.settings.public.appConfig.categories.join(",");
	}
});