$(function(){
  var gamburger = $('.navbar-toggle'),
      head = $('.head'),
      nav = $('.js-page-nav'),

      innerNav = $('.page-nav-inner'),
      logo = $('.head__logo'),
      search = $('.head__search'),
      profile =$('.head__profile');

  $(gamburger).on('click' ,function(){
    head.toggleClass('active-mobile-menu');
    nav.toggleClass('active-mobile-menu');
    gamburger.toggleClass('navbar-on');

    innerNav.toggleClass('active-mobile-menu');
    logo.toggleClass('hidden');
    search.toggleClass('hidden');
    profile.toggleClass('hidden');
  });
});