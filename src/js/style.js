

//jquery

//tgglemenu
$(function(){
  var $toggleBtn = '.header-toggle';
  var $triggers = '.toggle-lines';
  $($toggleBtn).click(function() {
    $($triggers).toggleClass('active');
  });
});


//TweenMax

//ピョンピョン
if(!navigator.userAgent.match(/(iPhone|android)/)){

  (function () {
      var dth, jhg, speed, jupmText;
      dth = 30;
      jhg = 40;
      speed = 0.5;
      jumpText = '.logo-wrap__text';
      $(jumpText).mouseenter(function () {
          var tl;
          tl = new TimelineLite();
          return tl.to(this, 0.2 * speed, {
              ease: Sine.easeOut,
              scaleY: 0.6,
              scaleX: 1.2,
              y: dth
          }).to(this, 0.2 * speed, {
              ease: Sine.easeOut,
              scaleY: 1,
              scaleX: 1
          }).to(this, 0.4 * speed, {
              ease: Sine.easeOut,
              y: -jhg
          }, '-=0.2').to(this, 0.4 * speed, {
              ease: Sine.easeIn,
              y: 0
          }).to(this, 0.2 * speed, {
              ease: Sine.easeOut,
              scaleY: 0.6,
              scaleX: 1.2,
              y: dth
          }).to(this, 0.2 * speed, {
              ease: Sine.easeOut,
              scaleY: 1,
              scaleX: 1,
              y: 0
          });
      });
  }.call(this));

  (function(){
    var d = 30;
    var jh = 40;
    var sf = 0.5;
    $(jumpText).mouseenter(function(){
      var tl;
      tl = new TimelineLite();
      return tl.to(this ,0.2 * sf,{
        ease: Sine.easeOut,
        scaleY: 0.6,
        scaleX: 1.2,
        y: d
      });
    });
  })
}
