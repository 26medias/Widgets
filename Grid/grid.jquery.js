/**
	Grid
	@version:		1.0.0
	@author:		Julien Loutre <julien.loutre@gmail.com>
*/
(function($){
 	$.fn.extend({
 		grid: function() {
			var plugin_namespace = "wgrid";
			
			
			var pluginClass = function() {};
			
			
			
			pluginClass.prototype.init = function (options) {
				try {
					
					var scope = this;
					
					this.options = $.extend({
						cols:	10,		// Number of columns
						ratio:	1,		// Cell ratio: 1 = square
						margin:	1,		// in %,
						ms:		500,
						marker:	{
							width:		7,
							height:		7
						},
						widgets:	{}
					},options);
					
					this.timer = false;
					
					// Global vars without poluting the scope
					this.props	= {
						cell:			{},	// pre-created
						row:			{},	// pre-created
						margin:			{}	// pre-created
					};	
					
					// cells
					this.cells 	= [];
					
					$(window).resize(function() {$
						scope.resetTimer();
					});
					
					
					// Create the helpers
					this.createHelpers();
					
					// Resize on init
					this.resize();
					
					// Now we monitor the drag actions on the widgets
					this.monitorDrag();
					
					
				} catch (err) {
					this.error(err);
				}
			};
			
			pluginClass.prototype.debug = function (label, value) {
				try {
					
					$('[data-debug="'+label+'"]').html(value);
					
				} catch (err) {
					this.error(err);
				}
			};
			
			pluginClass.prototype.createHelpers = function () {
				try {
					
					var scope = this;
					
					this.helper		= {
						shadow:	$.create("div", this.element)	
					}
					
					this.helper.shadow.addClass("widget-helper").addClass("shadow");
					
				} catch (err) {
					this.error(err);
				}
			};
			
			pluginClass.prototype.monitorDrag = function () {
				try {
					
					var scope = this;
					
					var buttons = $('[data-widget-drop]');
					buttons.each(function(idx, el) {
						var widget = $(el).attr("data-widget-drop");
						if (scope.options.widgets[widget]) {
							$(el).draggable({
								opacity: 	0.5,
								helper: 	"clone",
								start: 		function() {
									
								},
								drag: 		function(event, ui) {
									scope.displayShadow(scope.options.widgets[widget], ui.offset);		// Display the shadow (preview of the location, snap to grid)
								},
								stop: 		function() {
									// hide the shadow helper
									scope.helper.shadow.removeClass("visible");
								}
							});
						}
					});
					
				} catch (err) {
					this.error(err);
				}
			};
			
			pluginClass.prototype.displayShadow = function (widget, offset) {
				try {
					
					var scope = this;
					
					// Here we're going to snap to the grid
					// get the [0;0] position of the element
					var origin 	= this.element.offset();
					
					var fixedX	= offset.left-origin.left+(this.props.cell.pxwidth/2);
					var fixedY	= offset.top-origin.top+(this.props.cell.pxheight/2);
					
					// Pos is in cells, not pixels!
					var pos =  {
						x:		Math.max(0,Math.floor(fixedX/(this.props.cell.pxwidth+this.props.margin.pxwidth))),
						y:		Math.max(0,Math.floor(fixedY/(this.props.cell.pxheight+this.props.margin.pxheight)))
					}
					var pospx	= this.fromGrid(pos);
					
					// debug
					this.debug("colx", pos.x);
					this.debug("coly", pos.y);
					this.debug("posx", offset.left);
					this.debug("posy", offset.top);
					this.debug("snapx", pospx.left);
					this.debug("snapy", pospx.top);
					
					this.helper.shadow.addClass("visible").css($.extend({
						width:	(this.props.cell.pxwidth*widget.width.start)+((widget.width.start-1)*this.props.margin.pxwidth),
						height:	(this.props.cell.pxheight*widget.height.start)+((widget.height.start-1)*this.props.margin.pxheight)
					},pospx));
					
					
				} catch (err) {
					this.error(err);
				}
			};
			
			pluginClass.prototype.fromGrid = function (pos) {
				try {
					
					// Convert grid coordinates to pixel coordinates
					return {
						left:	pos.x*(this.props.cell.pxwidth+this.props.margin.pxwidth),
						top:	pos.y*(this.props.cell.pxheight+this.props.margin.pxheight)
					};
					
				} catch (err) {
					this.error(err);
				}
			};
			
			pluginClass.prototype.resize = function () {
				try {
					
					var x;
					var y;
					var l;
					
					
					// Current container width
					this.props.width			= this.element.width();
					this.props.height			= this.element.height();
					// Total % of space taken by margins
					this.props.margin.twidth	= (this.options.cols-1)*this.options.margin;
					// Width in pixels
					this.props.margin.pxwidth	= this.options.margin/100*this.props.width;
					// height in pixels
					this.props.margin.pxheight	= this.props.margin.pxwidth;
					// Individual cell width (in %)
					this.props.cell.width		= (100-this.props.margin.twidth)/this.options.cols;
					// Individual cell height (in %)
					this.props.cell.height		= this.props.cell.width*this.options.ratio;
					// Individual cell width (in pixels)
					this.props.cell.pxwidth		= this.props.cell.width/100*this.props.width;
					// Individual cell height (in pixels)
					this.props.cell.pxheight	= this.props.cell.pxwidth*this.options.ratio;
					
					// Calculate the number of rows
					this.props.row.count	= Math.floor(this.props.height/(this.props.cell.pxheight+this.props.margin.pxheight));
					
					console.log("this.props",this.props);
					
					if (this.cells.length < this.props.row.count) {
						// How many do we need to create?
						var diff = this.props.row.count-this.cells.length;
						
						for (y=0;y<diff;y++) {
							var buffer = [];
							for (x=0;x<this.options.cols;x++) {
								buffer.push(this.createCell());
							}
							this.cells.push(buffer);
						}
					}
					
					
					// to properly position the markers
					var hw		= this.options.marker.width;
					var hh		= this.options.marker.height;
					
					// Now we re-position the markers
					for (y=0;y<this.cells.length;y++) {
						for (x=0;x<this.cells[y].length;x++) {
							var xpos = x*(this.props.cell.pxwidth+this.props.margin.pxwidth);
							var ypos = y*(this.props.cell.pxheight+this.props.margin.pxheight);
							
							// realign the marker based on its size
							
							//console.log("["+x+";"+y+"]",xpos,ypos);
							this.cells[y][x].markers["00"].css({left: xpos, top: ypos});
							this.cells[y][x].markers["10"].css({left: xpos+this.props.cell.pxwidth-hw, top: ypos});
							this.cells[y][x].markers["11"].css({left: xpos+this.props.cell.pxwidth-hw, top: ypos+this.props.cell.pxheight-hh});
							this.cells[y][x].markers["01"].css({left: xpos, top: ypos+this.props.cell.pxheight-hh});
						}
					}
					
					
				} catch (err) {
					this.error(err);
				}
			};
			
			pluginClass.prototype.createCell = function () {
				try {
					
					var hw		= this.options.marker.width/2-0.5;
					var hh		= this.options.marker.height/2-0.5;
					
					var cell = {
						markers:	{
							"00":	this.createMarker(0-hw, 0-hh),
							"10":	this.createMarker(hw, 0-hh),
							"11":	this.createMarker(hw, hh),
							"01":	this.createMarker(0-hw, hh)
						}
					};
					
					return cell;
					
				} catch (err) {
					this.error(err);
				}
			};
			
			pluginClass.prototype.createMarker = function (px, py) {
				try {
					
					var marker = $.create("div", this.element);
					marker.addClass("grid_marker");
					marker.css("background-position", px+"px "+py+"px");
					return marker;
					
				} catch (err) {
					this.error(err);
				}
			};
			
			pluginClass.prototype.resetTimer = function () {
				try {
					
					var scope = this;
					clearTimeout(this.timer);
					this.timer = setTimeout(function() {
						scope.resize();
					}, this.options.ms);
					
				} catch (err) {
					this.error(err);
				}
			};
			
			
			pluginClass.prototype.__init = function (element) {
				try {
					this.element = element;
				} catch (err) {
					this.error(err);
				}
			};
			// centralized error handler
			pluginClass.prototype.error = function (e) {
				if (console && console.info) {
					console.info("error on "+plugin_namespace+":",e);
				}
			};
			// Centralized routing function
			pluginClass.prototype.execute = function (fn, options) {
				try {
					if (typeof(this[fn]) == "function") {
						var output = this[fn].apply(this, [options]);
					} else {
						this.error("'"+fn.toString()+"()' is not a function");
					}
				} catch (err) {
					this.error(err);
				}
			};
			
			// process
			var fn;
			var options;
			if (arguments.length == 0) {
				fn = "init";
				options = {};
			} else if (arguments.length == 1 && typeof(arguments[0]) == 'object') {
				fn = "init";
				options = $.extend({},arguments[0]);
			} else {
				fn = arguments[0];
				options = arguments[1];
			}
			$.each(this, function(idx, item) {
				// if the plugin does not yet exist, let's create it.
				if ($(item).data(plugin_namespace) == null) {
					$(item).data(plugin_namespace, new pluginClass());
					$(item).data(plugin_namespace).__init($(item));
				}
				$(item).data(plugin_namespace).execute(fn, options);
			});
			return this;
    	}
	});
})(jQuery);

