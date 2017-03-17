/**
 *
 * The MIT License
 *
 * Copyright (c) 2010 Mr.doob
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
/**
 * Based on Paul Irish modifications to harmony (github.com/paulirish/harmony)
 *
 * Author: mdaniel
 */
(function($) {
    var harmony,

		// To help prevent older browser to run the script
	    canvasTest = function() {
	        var elem = document.createElement('canvas');
	        return !!(elem.getContext && elem.getContext('2d'));
	    },

		// Module helper to convert hexa color values in their respective R,G,B value.
	    HexToRgb = (function() {

	        var cutHex = function(h) {
	            return (h.charAt(0) === "#") ? h.substring(1, 7) : h
	        };
	        return {
	            toR: function(h) {
	                return parseInt((cutHex(h)).substring(0, 2), 16)
	            },
	            toG: function(h) {
	                return parseInt((cutHex(h)).substring(2, 4), 16)
	            },
	            toB: function(h) {
	                return parseInt((cutHex(h)).substring(4, 6), 16)
	            },
	            isHex: function(h) {
	                return (h.charAt(0) === "#")
	            }
	        }
	  	})();

    // Harmony & default brush (which is ribbon, which is sexy)
    (function(window, document, undefined) {

        var brushes = {}, Brush, COLOR = [0, 0, 0], SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;

        // Brush Factory
        Brush = function(brush, context) {
            if (!(brush in brushes)) {
				// no valid brush, return default one
            	return new brushes.ribbon(context);
			}

            return new brushes[brush](context);
        };

        // Ribbon brush (default)
        (function() {
            brushes.ribbon = function(context) {
                this.init(context);
            };

            brushes.ribbon.prototype = {
                context: null,

                mouseX: null,
                mouseY: null,

                painters: null,

                interval: null,

                init: function(context) {
                    this.context = context;
                    this.context.lineWidth = 1;
                    this.context.globalCompositeOperation = 'source-over';

                    this.mouseX = SCREEN_WIDTH / 2;
                    this.mouseY = SCREEN_HEIGHT / 2;

                    this.painters = new Array();

                    for (var i = 0; i < 50; i++) {
                        this.painters.push({
                            dx: SCREEN_WIDTH / 2,
                            dy: SCREEN_HEIGHT / 2,
                            ax: 0,
                            ay: 0,
                            div: 0.1,
                            ease: Math.random() * 0.2 + 0.6
                        });
                    }

                    this.isDrawing = false;

                    this.interval = setInterval(bargs(function(_this) {
                        _this.update();
                        return false;
                    }, this), 1000 / 60);
                },

                destroy: function() {
                    clearInterval(this.interval);
                },

                strokeStart: function(mouseX, mouseY, color) {
                    this.mouseX = mouseX;
                    this.mouseY = mouseY;

                    this.context.strokeStyle = "rgba(" + color[0] + ", " + color[1] + ", " + color[2] + ", 0.05 )";

                    for (var i = 0; i < this.painters.length; i++) {
                        this.painters[i].dx = mouseX;
                        this.painters[i].dy = mouseY;
                    }

                    this.shouldDraw = true;
                },

                stroke: function(mouseX, mouseY) {
                    this.mouseX = mouseX;
                    this.mouseY = mouseY;
                },

                strokeEnd: function() {},

                update: function() {
                    var i;

                    for (i = 0; i < this.painters.length; i++) {
                        this.context.beginPath();
                        this.context.moveTo(this.painters[i].dx, this.painters[i].dy);

                        this.painters[i].dx -= this.painters[i].ax = (this.painters[i].ax + (this.painters[i].dx - this.mouseX) * this.painters[i].div) * this.painters[i].ease;
                        this.painters[i].dy -= this.painters[i].ay = (this.painters[i].ay + (this.painters[i].dy - this.mouseY) * this.painters[i].div) * this.painters[i].ease;
                        this.context.lineTo(this.painters[i].dx, this.painters[i].dy);
                        this.context.stroke();
                    }
                }
            }

            function bargs(_fn) {
                var n, args = [];
                for (n = 1; n < arguments.length; n++)
                    args.push(arguments[n]);
                return function() {
                    return _fn.apply(this, args);
                };
            }
        })();

        // The Great Harmony.
        (function() {
            harmony = function init(o) {
                var i, brush, container, canvas, flattenCanvas, context;

                o = o || {};

                var onWindowResize = function() {
                    SCREEN_WIDTH = o.width ? o.width : window.innerWidth;
                    SCREEN_HEIGHT = o.height ? o.height : window.innerHeight;

                    /* make a copy */
                    savecanvas = document.createElement("canvas");
                    savecanvas.width = canvas.width;
                    savecanvas.height = canvas.height;
                    savecanvas.getContext("2d").drawImage(canvas, 0, 0);

                    /* change the size */
                    canvas.width = SCREEN_WIDTH;
                    canvas.height = SCREEN_HEIGHT;

                    /* draw the copy */
                    context.drawImage(savecanvas, 0, 0);

                    /* reset the brush (sad we lose the old random setup) */
                    brush = Brush(o.brush, context);
                    //brush = new Ribbon(context);
                };


                var onCanvasMouseUp = function(event) {
                    brush.strokeEnd();

                    window.removeEventListener('mousemove', onCanvasMouseMove, false);
                    window.removeEventListener('mouseup', onCanvasMouseUp, false);
                };

                var onCanvasMouseMove = function(event) {
                    var pts = onCanvasMouseMove.pts, results, offset = o.offset.top - $(window).scrollTop(), x = event.clientX, y = event.clientY, t = event.target, p = t.parentNode;

                    // ugly workaround on mouse left position
                    x = o.offset ? (x - o.offset.left) : x;

                    // worse on y
                    y = y - offset;


                    if (!brush.isStroking) {
                        brush.strokeStart(event.clientX, event.clientY, o.color);
                        brush.isStroking = true;

                        if (window.DollarRecognizer) {
                            window.Rcgnzr = new DollarRecognizer();
                        }

                        return;
                    }

                    // has it been 300ms since the last movement? if so lets consider it a new
                    // thing and capture
                    if (onCanvasMouseMove.lastMove && (event.timeStamp - onCanvasMouseMove.lastMove) > 300) {


                        if (pts && pts.length) {

                            if (window.DollarRecognizer) {

                                results = Rcgnzr.Recognize(pts);

                                if (results.Name == 'star' && results.Score >= .6)
                                    window.starryEgg && starryEgg();
                            }

                            onCanvasMouseMove.pts = [];
                        } else {

                            onCanvasMouseMove.pts = [];
                        }
                    }

                    onCanvasMouseMove.lastMove = +event.timeStamp;

                    if (window.Point) {
                        pts && (pts[pts.length] = new Point(x, y));
                    }

                    console.log(o.color);
                    brush.stroke(x, y, o.color);
                };

                var onCanvasTouchStart = function(event) {
                    if (event.touches.length == 1) {
                        event.preventDefault();

                        brush.strokeStart(event.touches[0].pageX, event.touches[0].pageY, o.color);

                        window.addEventListener('touchmove', onCanvasTouchMove, false);
                        window.addEventListener('touchend', onCanvasTouchEnd, false);
                    }
                };

                var onCanvasTouchMove = function(event) {
                    if (event.touches.length == 1) {
                        event.preventDefault();
                        brush.stroke(event.touches[0].pageX, event.touches[0].pageY, o.color);
                    }
                };

                var onCanvasTouchEnd = function(event) {
                    if (event.touches.length == 0) {
                        event.preventDefault();

                        brush.strokeEnd();

                        window.removeEventListener('touchmove', onCanvasTouchMove, false);
                        window.removeEventListener('touchend', onCanvasTouchEnd, false);
                    }
                };

                container = document.createElement('div');

                (o.appendTo && o.appendTo instanceof jQuery) ? o.appendTo.append(container) : document.body.appendChild(container);

                canvas = document.createElement("canvas");
                canvas.width = o.width ? o.width : SCREEN_WIDTH;
                canvas.height = o.height ? o.height : SCREEN_HEIGHT;
                canvas.style.cursor = 'crosshair';
                container.appendChild(canvas);

                if (!canvas.getContext)
                    return;

                context = canvas.getContext("2d");

                flattenCanvas = document.createElement("canvas");
                flattenCanvas.width = o.width ? o.width : SCREEN_WIDTH;
                flattenCanvas.height = o.height ? o.height : SCREEN_HEIGHT;

                if (!brush) {
                    brush = Brush('ribbon', context)
                }


                if (!o.preventResize) {
                    window.addEventListener('resize', onWindowResize, false);
                }


                document.addEventListener('mouseout', onCanvasMouseUp, false);

                canvas.addEventListener('mousemove', onCanvasMouseMove, false);
                canvas.addEventListener('touchstart', onCanvasTouchStart, false);


                onWindowResize(o);

                return canvas;
            };
        })();


    })(this, this.document);


    // jquery harmony plugin wrapper
    $.fn.harmony = function(options) {

        options = options || {};

        // Test if the browser is canvas able, no need to loop if we're stuck in some older browser.
        if (!canvasTest()) { return this; }


        return this.each(function() {
            var data, o, color, colorDefault, brushDefault, target = $(this).css({
                position: 'relative'
            });

            colorDefault = options.color ? options.color : [0, 0, 0];
            brushDefault = options.brush ? options.brush : 'ribbon';

            data = {
                color: target.attr('data-color') ? target.attr('data-color').split(',') : colorDefault,
                brush: target.attr('data-brush') ? target.attr('data-brush') : brushDefault
            };

            o = $.extend({}, $.fn.harmony.defaults, options, data);

            if (o.color.length === 1) {
                color = o.color[0];
                o.color = [HexToRgb.toR(color), HexToRgb.toG(color), HexToRgb.toB(color)];
            }

            harmony({
                brush: o.brush,
                color: o.color,
                height: target.innerHeight(),
                width: target.innerWidth(),
                offset: target.offset(),
                preventResize: true,
                appendTo: target
            });
        });
    };

    $.fn.harmony.defaults = {
        color: [0, 0, 0],
        brush: 'ribbon'
    };
})(jQuery);
