$(document).ready(function(){

  // making the #content div have a higher height then the #navigation div
  var offset = $('#content').offset();
  var contentBottom = $('#content').height() + offset.top;

  var offsetNav = $('#navigation').offset();
  var navBottom = $('#navigation').height() + offsetNav.top;

  if (navBottom > contentBottom){
        $('#content').height($('#navigation').height() + 20 + 'px');
  }

  // changing class of links on navigation

  $(document).on('click', '#navigation a', function(a){
    $('#navigation').children().attr('class', '');
    $(a.currentTarget).attr('class', 'selected');
  });


});
