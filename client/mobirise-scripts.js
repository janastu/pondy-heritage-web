//Mobirise scripts inject

Template.navBar.onRendered(function(){
 $.getScript('assets/smooth-scroll/SmoothScroll.js', function(){
  $.getScript('assets/bootstrap-carousel-swipe/bootstrap-carousel-swipe.js', function() {
    $.getScript('assets/mobirise/js/script.js', function(){
        // script has loaded
  		console.log('conectaReady', "loaded");
    });
  });
  
 });
});