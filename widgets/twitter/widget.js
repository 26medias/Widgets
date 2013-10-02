/**
	Gird Widget: Twitter
	@version:		1.0.0
	@author:		Julien Loutre <julien.loutre@gmail.com>
*/
(function($){
 	$.fn.extend({
 		widget_twitter: function() {
			var plugin_namespace = "widget_twitter";
			
			
			var pluginClass = function() {};
			
			
			
			pluginClass.prototype.init = function (options) {
				try {
					
					var scope = this;
					
					this.options = $.extend({
						onResize:	this.onResize
					},options);
					
					this.screens = {};	// Will contain the screens
					
					this.build();
					
					this.display("settings");
					
				} catch (err) {
					this.error(err);
				}
			};
			
			
			pluginClass.prototype.build = function () {
				try {
					
					this.element.addClass("nano");
					
					this.container			= $.create("div", this.element);
					this.container.addClass("content");
					
					this.screens.settings 	= $.create("div", this.container);
					this.screens.app 		= $.create("div", this.container);
					
					
					var survey = [{
						twitter: {
							type:			"varchar",
							placeholder:	"Twitter ID",
							label:			"Twitter ID",
							required:		true,
							value:			"",
							attr:	{
								"data-group": "1"
							}
						}
					},{
						count: {
							type:			"list",
							label:			"Display",
							placeholder:	"Select one",
							required:		true,
							list: 			[
								{label:"5 tweets",		value:5},
								{label:"10 tweets",		value:10},
								{label:"15 tweets",		value:15},
								{label:"20 tweets",		value:20}
							],
							value:			10,
							attr:	{
								"data-group": "1"
							}
						}
					}];
					
					this.screens.settings.jsurvey({
						survey:		survey,
						submit:		$(".btn_submit"),
						next:		$(".btn_next"),
						previous:	$(".btn_previous"),
						block:		true,
						group:		true,
						onSubmit:	function(data) {
							
						}
					});
					
					
					this.element.nanoScroller();
					
					
				} catch (err) {
					this.error(err);
				}
			};
			
			
			pluginClass.prototype.display = function (scr) {
				try {
					
					var i;
					for (i in this.screens) {
						if (i == scr) {
							this.screens[i].show();
						} else {
							this.screens[i].hide();
						}
					}
					
				} catch (err) {
					this.error(err);
				}
			};
			
			
			pluginClass.prototype.onResize = function () {
				try {
					
					console.log("widget was resized!");
					
					this.container.nanoScroller();
					
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

