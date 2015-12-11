"use strict";



var pageTitle='testtitle';

function replaceText(str)
{
    var str1 = String(str);
    return str1.replace(/\n/g,"<br/>");
}

/**
 * @module dmatix
 * @chapter client
 * 
 * */

var factory={};

/**
 * A test function
 * @global
 * */
function testfunction(){}

var dmAtix = angular.module("dmAtix", ['ngRoute','ngMaterial'])
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
	$routeProvider.when('/', {
		templateUrl: '/base.html',
		controller: 'viewCtrl',
		controllerAs: 'view'
		
	}).when('/:partial',{
		templateUrl: function(params){ return '/'+params.partial; },
		controller: 'viewCtrl',
		controllerAs: 'view'					
	});

	$locationProvider.html5Mode(true);
	
}])
.config(['$provide', '$mdThemingProvider', function($provide, $mdThemingProvider) {
	
	$mdThemingProvider.theme('default')
	.primaryPalette('indigo')
    .backgroundPalette('grey',{
		'default':'50'
	})
	.accentPalette('blue-grey',{
		'default':'800',
		'hue-1':'50',
		'hue-2':'100',
		'hue-3':'300'
	});
	

	/**
	* Of form:
	* {
	*  'blue':{ // Palette name
	*      '50': #abcdef, // Color name: color value
	*      '100': #abcdee,
	*          ...
	*      },
	*      ...
	* }
	* @type {{}}
	*/
	var colorStore = {};
	//fetch the colors out of the themeing provider
	Object.keys($mdThemingProvider._PALETTES).forEach(
	// clone the pallete colors to the colorStore var
	function(palleteName) {
		var pallete = $mdThemingProvider._PALETTES[palleteName];
		var colors  = [];
		colorStore[palleteName]=colors;
		Object.keys(pallete).forEach(function(colorName) {
			// use an regex to look for hex colors, ignore the rest
			if (/#[0-9A-Fa-f]{6}|0-9A-Fa-f]{8}\b/.exec(pallete[colorName])) {
				colors[colorName] = pallete[colorName];
			}
		});
	});

	/**
	* mdThemeColors service
	*
	* The mdThemeColors service will provide easy, programmatic access to the themes that have been configured
	* So that the colors can be used according to intent instead of hard coding color values.
	*
	* e.g.
	*
	* <span ng-style="{background: mdThemeColors.primary['50']}">Hello World!</span>
	*
	* So the theme can change but the code doesn't need to.
	*/
	$provide.factory('mdThemeColors', [function() {

		var service = {};

		var getColorFactory = function(intent){

			return function(){
				var colors = $mdThemingProvider._THEMES['default'].colors[intent];
				var name = colors.name
				// Append the colors with links like hue-1, etc
				colorStore[name].default = colorStore[name][colors.hues['default']]
				colorStore[name].hue1 = colorStore[name][colors.hues['hue-1']]
				colorStore[name].hue2 = colorStore[name][colors.hues['hue-2']]
				colorStore[name].hue3 = colorStore[name][colors.hues['hue-3']]
				return colorStore[name];
			}
		}

		/**
		* Define the getter methods for accessing the colors
		*/

		Object.defineProperty(service,'primary', {
		get: getColorFactory('primary')
		});

		Object.defineProperty(service,'accent', {
		get: getColorFactory('accent')
		});

		Object.defineProperty(service,'warn', {
		get: getColorFactory('warn')
		});

		Object.defineProperty(service,'background', {
		get: getColorFactory('background')
		});

		return service;
	}]);
}]);

/**
 * # Test factory
 * @ngdoc factory
 * */
function dmcontent() {
	
	/**
	 * Keep track of the chapter
	 * 
	 * */
	var chap=0;
	var verse=0;
	var items={};
	return {
		make:function(id,type,toggle,open,fixheight,getheight){
			if(!items[type]){
				items[type]=[];
			}
			items[type].push({id:id,toggle:toggle,open:open,fixheight:fixheight,getheight:getheight});
		},
		vheight:function(id,height){
			items.verse.forEach(function(verse){
				if(verse.id===id){
					verse.getheight=height;
				}				
			});
		},
		chap:function(add){
			if(add){
				chap++;
				verse=0;
			}
			return 'chap_'+chap;						
		},
		verse:function(add){
			if(add){
				verse++;
			}
			return 'chap_'+chap+'_verse'+verse;						
		},
		click:function(id,type){
			var parent=id.split('_verse')[0];
			for(var i = 0; i < items[type].length; i++){
				if(items[type][i].id===id){					
					var target = items[type][i];
					
				}								
			}
			if(parent===id){
				return target;
			}else{
				return {parent:parent,target:target}
			}
			
		},
		hide:function(type){
			if(items[type]){
				items[type].forEach(function(container){
					if(container.open){
						container.toggle(true);
						container.open=false;
					}
				});
			}
		}
		
	}
}




dmAtix.factory("dmContent", dmcontent)
.directive("dmSidemen",["dmContent", function(dmContent){

    return {
        link: function () {

        },
    };
}])
/**
 * See {@tutorial test}
 * @ngdoc directive
 * @name module:client/dmatix~dmSidemen
 * */
.directive("dmChapterTitle",["dmContent", function(dmContent){
	var dm = dmContent;
    return {
		transclude: true,
		replace:true,		
        link: function (scope, element) {
			
			var id=dm.chap(true);
			element.on('click',function(){
				var container = dm.click(id,'chap');
				if(container.open){
					container.toggle(true);
					container.open=false;
					dm.hide('verse');
				}else{
					dm.hide('verse');
					dm.hide('chap');
					container.toggle(false);
					container.open=true;
					var players=dm.click(id+'_verse1','verse');					
					container=players.target;
					if(container){
						container.toggle(false);
						container.open=true;
						dm.click(id,'chap').fixheight(container.getheight);
					}
				}
			})			
        },
        template:"<md-toolbar class='ctitle' style='border-bottom:1px solid {{color.primary.hue2}}; cursor:pointer' md-ink-ripple><h1 class='md-title' layout layout-padding >"+
					"<div ng-transclude flex></div>"+
					"<div class='material-icons state' style='color:{{color.primary.hue3}}'>arrow_drop_down_circle</div>"+
				"</h1></md-toolbar>"

    };
}])
.directive("dmVerseTitle",["dmContent","$timeout", function(dmContent,$timeout){
	var dm = dmContent;
    return {
		transclude: true,
		replace:true,		
        link: function (scope, element) {
			var id=dm.verse(true);
			element.on('click',function(){
				var players=dm.click(id,'verse');
				var container = players.target;
				var parent = players.parent;
				if(container.open){
					container.toggle(true);
					container.open=false;
				}else{
					dm.hide('verse');
					container.toggle(false);
					container.open=true;
					dm.click(parent,'chap').fixheight(container.getheight);
				}
			})			
        },
        template: "<h2 class='vtitle md-subhead md-whiteframe-3dp' style='background:{{color.primary.hue1}}; position:relative; cursor:pointer' layout layout-padding  md-ink-ripple>"+
						"<div ng-transclude flex ></div>"+
						"<div class='material-icons state' style='color:{{color.primary.hue2}}'>expand_more</div>"+
					"</h2>"
						

    };
}])
.directive("dmChapterDeep",["dmContent", function(dmContent){
	var dm = dmContent;
    return {
		transclude: true,
		replace:true,
        link: function (scope, element) {
			var toggle = function (open) {
				if (open) {
					element.css("max-height", '0px');
					element.parent().removeClass('copen').addClass('cclosed');
				} else {
					element.css("max-height", element[0].scrollHeight + 'px');
					element.parent().removeClass('cclosed').addClass('copen');
				}
			};
			var fixheight=function(add){
				element.css("max-height", element[0].scrollHeight + add + 'px');
			}
			toggle(true);
			dm.make(dm.chap(false),'chap',toggle,false,fixheight,false);
        },
        template: "<md-content class='expander' layout='column' flex ng-transclude></md-content>"
    };
}])

.directive("dmChapter",["dmContent", function(dmContent){
	var dm = dmContent;
    return {
		transclude: true,
		replace:true,
        link: function (scope, element) {
			var toggle = function (open) {
				if (open) {
					element.css("max-height", '0px');
					element.css("background", scope.color.primary.hue3);
					element.parent().removeClass('copen').addClass('cclosed');
				} else {
					element.css("max-height", element[0].scrollHeight + 'px');
					element.parent().removeClass('cclosed').addClass('copen');
				}
			};
			toggle(true);
			dm.make(dm.chap(false),'chap',toggle,false,false,false);
        },
        template: "<md-content class='expander' layout='column' layout-padding flex ng-transclude></md-content>"
    };
}])

.directive("dmVerse",["dmContent","$timeout", function(dmContent,$timeout){
	var dm = dmContent;
    return {
		transclude: true,
		replace:true,
        link: function (scope, element) {
			
			var toggle = function (open) {
				
				if (open) {				
					element.css("max-height", '0px');
					element.css("background", scope.color.primary.hue3);
					element.parent().removeClass('vopen').addClass('vclosed');
				} else {
					element.css("max-height", element[0].scrollHeight + 'px');
					element.parent().removeClass('vclosed').addClass('vopen');
				}
			};
			
			toggle(true);
			var id = dm.verse(false);
			dm.make(id,'verse',toggle,false,false,0);
			$timeout(function(){
				var getheight = element[0].scrollHeight;
				dm.vheight(id,getheight);				
			});	
			
					
        },
        template: "<md-content class='expander' layout='column' layout-padding flex><div class='dmInner' ng-transclude></div></md-content>"
    };
}])
.directive("dmItemWrapper",function(){
    return {
		transclude: true,
		replace:true,
        template: "<div style='background:{{color.primary.hue3}}' ng-transclude></div>"
    };
})
.directive("dmMenulink",function(){
    return {
		transclude: true,
		replace:true,
        template: "<div class='dmItem' ng-transclude></div>"
    };
})
.directive('prism', function($window,$location,$rootScope,$anchorScroll,$timeout) {
	return {
		restrict: 'C',
		link: function postLink(scope, element, attrs) {
			//$location.hash($location.$$hash.replace('line','code.'));
			scope.hashno=$location.$$hash.split('.')[1];
			$('#main').css('opacity',0);
			$timeout(function(){
				Prism.highlightElement(element[0]);
				$('#main').css('opacity',1);
				$('#code .comment').css('display','inline-block');
				$('#code .comment').each(function(){
					var height=$(this).outerHeight();
					var self=this;
					var tout;
					$(this).attr({
						'data-h':height+'px'
					})
					.css('height',height)					
					.hover(function(){
						if($(self).hasClass('shrink')){
							clearTimeout(tout);
							$(self).css({'height':$(self).attr('data-h'),'marginTop':'18px'});
						}
					},function(){
						if($(self).hasClass('shrink')){
							$(self).css('height',0);
							tout=setTimeout(function(){
								$(self).css('marginTop',0);
							},500);
						}						
					});
					
				})
				$('#code .comment').css('display','inline');
			});
			
		}
	};

})
.controller('main',function($scope,$route,$routeParams,$location,$mdSidenav,$timeout,mdThemeColors){
	$scope.color=mdThemeColors;
	$scope.g={};
	$scope.g.pageTitle='pageTitle';
	$scope.basepath=$location.protocol()+'://'+$location.host();

    $scope.index = 0;

    $scope.toggleSidenav = function (menuId) {
        $mdSidenav(menuId).toggle();
    };
})
.controller('viewCtrl',function($scope,$timeout,$window,$mdSidenav,mdThemeColors){
	var winwidth;
	function fixwidth(){
		$scope.winwidth={width:winwidth+'px'};
		if($('#sourceouter')[0].scrollWidth < winwidth){
			winwidth=winwidth-(winwidth-$('#sourceouter')[0].scrollWidth)
			$scope.winwidth={width:winwidth+'px'};
		}		
	};
	function checkside(){
		if($('.md-sidenav-left').hasClass('md-locked-open-add') || $('.md-sidenav-left').hasClass('md-locked-open')){
			return true;
		}else{
			return false;
		};
	};
	
		
	$timeout(function(){
		if($('#sourceouter')[0]){
			if(checkside()){				
				winwidth=$("body").innerWidth()-304;
			}else{
				winwidth=$window.screen.width;
			}
			
			fixwidth();	
		}		
	});
		
	angular.element($window).bind('resize', function() {
		if($('#sourceouter')[0]){
			$timeout(function(){
				if(checkside()){				
					winwidth=$("body").innerWidth()-304;
				}else{
					winwidth=$window.screen.width;
				}
				fixwidth();
								
			});
		}
	})
	
	
	$scope.toggle=true;
	
	$scope.$watch('toggle',function(){
		if(!$scope.toggle){
			$timeout(function(){
				$('#code').removeClass('line-numbers');
				$('.line-highlight').css('opacity',0);
				$('#code .comment').css({'height':0,'display':'inline-block'});
				setTimeout(function(){
					$('.line-numbers-rows').css('display','none');
					$('#code .comment').addClass('shrink');
				},500);
			})

			$scope.icon='mode_comment';
		}else{
			$('#code .shrink').removeClass('shrink');
			$('#code .comment').each(function(){
				$(this).css({'height':$(this).attr('data-h')});
			});
			$('.line-numbers-rows').css('display','inline');				
			setTimeout(function(){					
				$('#code').addClass('line-numbers');
				$('#code .comment').css({'display':'inline'});
				$('.line-highlight').css('opacity',1);
			},500);			
			$scope.icon='comment';
		}		
	});
	$scope.color=mdThemeColors;
	$timeout(function(){
		$scope.g.pageTitle=pageTitle;
	});	
})
