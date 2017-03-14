// TODO:
//  Make it a plugin, make it re-usable
//  Ability to save image as png


$(document).ready(function(){
  "use strict";
  // Vars
    var paint = false,
        points = [],
        click_x = [],
        click_y = [],
        click_drag = [],
        $canvas = $('.paint-canvas'),
        ctxt = $canvas[0].getContext('2d'),
        touch_mouse = {
          up: 'mouseup',
          down: 'mousedown',
          leave: 'mouseleave',
          move: 'mousemove'
        },
        colors = {
          "turquoise": "#0086a2",
          "aiiro": "#105889",
          "darkturquoise": "#00A5BF",
          "blue": "#00a5bf",
        },
        stroke_color = colors[Object.keys(colors)[0]];

  // Mobile
    if ('ontouchstart' in window) {
      touch_mouse = {
          up: 'touchend',
          down: 'touchstart',
          leave: 'touchleave',
          move: 'touchmove'
        };
    }

  // Helpers
    var mousedown = function(e) {
      var mouse_x = e.pageX - this.offsetLeft,
          mouse_y = e.pageY - this.offsetTop;

      paint = true;
      add_click(mouse_x, mouse_y);
      redraw();
    };
    var mousemove = function(e) {
      if (paint) {
        var mouse_x = e.pageX - this.offsetLeft,
            mouse_y = e.pageY - this.offsetTop;
        add_click(mouse_x, mouse_y, true);
        redraw();
      }
    };
    var mouseleave = function(e) {
      paint = false;
    };
    var add_click = function(x,y,dragging) {
      var tmp = {
        x: x,
        y: y,
        drag: (dragging)? true: false,
        color: stroke_color
      };
      points.push(tmp);
      /*click_x.push(x);
      click_y.push(y);
      click_drag.push(dragging);*/
    };
    var redraw = function() {
      clear_canvas();
      var points_len = points.length;

      ctxt.lineJoin = "round";
      ctxt.lineWidth = 5;

      for( var i = 0; i < points_len; i++) {
        var cur_point = points[i],
            prev_point = points[i-1];

        ctxt.strokeStyle = cur_point.color;
        ctxt.beginPath();
        if (cur_point.drag) {
          ctxt.moveTo(prev_point.x, prev_point.y);
        } else {
          ctxt.moveTo(cur_point.x - 1, cur_point.y)
        }
        ctxt.lineTo(cur_point.x, cur_point.y)
        ctxt.closePath();
        ctxt.stroke();
      }
      /*
      for(var i=0; i < click_x.length; i++) {
        ctxt.beginPath();
        if(click_drag[i] && i){
          ctxt.moveTo(click_x[i-1], click_y[i-1]);
        }else{
          ctxt.moveTo(click_x[i]-1, click_y[i]);
        }
        ctxt.lineTo(click_x[i], click_y[i]);
        ctxt.closePath();
        ctxt.stroke();
      }
      */
    };
    var clear_canvas = function(clear_all) {
      ctxt.clearRect(0, 0, ctxt.canvas.width, ctxt.canvas.height); // Clears the canvas
      if (clear_all) {
        points = [];
        /*click_x = [];
        click_y = [];
        click_drag = [];*/
      }
    };

  // Events
    $canvas
      //.attr('width',$canvas.parent().outerWidth())
      .on(touch_mouse.down,mousedown)
      .on(touch_mouse.move, mousemove)
      .on(touch_mouse.up, mouseleave)
      .on(touch_mouse.leave, mouseleave);

    $('.button--clear').on('click', function(){
      clear_canvas(true);
    });
    $('#color-box').on('click','li',function(){
      stroke_color = colors[$(this).attr('class')];
    });
    $('.button--getimage').on('click', function(){
      var $img;

      if ( $('#preview').length ) {
        $img = $('#preview');
      } else {
        $img = $(new Image()).insertAfter('.bg .paint');
      }

      $img
        .hide()
        .addClass('paint')
        .attr('id','preview')
        .attr('src',$canvas[0].toDataURL())
        .on('load', function() {
          $img.fadeIn();
        });
    });
});
