/**
	mobileViewport
	@version:		1.2.0
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
						}
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
					
					
					// Resize on init
					this.resize();
					
					
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

