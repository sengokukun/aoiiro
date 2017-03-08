

//jquery

//tgglemenu
$(function(){
  var menu = $('.master-navi'),
      triggers = $('.toggle-lines'),
      menuBtn = $('.header-toggle'),
      body = $(document.body),
      // .layer もオブジェクト化
      layer = $('.layer'),
      menuWidth = menu.outerWidth();

      menuBtn.on('click', function(){
      body.toggleClass('open');
        if(body.hasClass('open')){
          // css で非表示にしていた .layer を表示
          $(".layer").show();
          body.animate({'right' : menuWidth }, 300);
          menu.animate({'right' : 0 }, 300);
          $(triggers).addClass('active');
        } else {
          // .layer を非表示
          $(".layer").hide();
          menu.animate({'right' : -menuWidth }, 300);
          body.animate({'right' : 0 }, 300);
          $(triggers).removeClass('active');
        }
      });
      // .layer をクリック時にもメニューを閉じる
      layer.on('click', function(){
        menu.animate({'right' : -menuWidth }, 300);
        body.animate({'right' : 0 }, 300).removeClass('open');
        $(triggers).removeClass('active');
        layer.hide();
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
