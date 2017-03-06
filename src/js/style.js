$(function() {
  // $(window).on('load resize', function() {
  //   var grid = $('.Content');
  //   var w = $(window).width();
  //   var sp = 480;
  //
  //   if (sp < w) {
  //
  //     grid.masonry({
  //       itemSelector: '.Content__item',
  //       columnWidth: 249,
  //       isAnimated: true,
  //       isFitWidth: true,
  //       isRTL: false,
  //       gutterWidth: 0,
  //       containerStyle: {
  //         position: 'relative'
  //       }
  //     });
  //
  //   } else if (sp > w) {
  //
  //     grid.masonry({
  //       itemSelector: '.Content__item',
  //       columnWidth: w,
  //       isAnimated: true,
  //       isFitWidth: true,
  //       isRTL: false,
  //       gutterWidth: 0,
  //       containerStyle: {
  //         position: 'relative'
  //       }
  //     });
  //
  //   }
  //
  // });



  var $toggleBtn = '.header-toggle';
  var $triggers = '.toggle-lines';
  $($toggleBtn).click(function() {
    $($triggers).toggleClass('active');
  });
});
