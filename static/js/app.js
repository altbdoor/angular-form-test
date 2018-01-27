angular.module('NgFormTest', [
	'ngRoute',
	'ngMessages',
	'ngResource',
	'ngSanitize',

	'pascalprecht.translate',
	
	'text-mask',
	'moment-picker',
	'LocalForageModule',
	'ui.select',
])

.factory('CacheBustService', [
	function () {
		return {
			request: function (config) {
				if (config.url.indexOf('templates') !== -1 || config.url.indexOf('partials') !== -1) {
					config.url += (config.url.indexOf('?') === -1 ? '?' : '&') + 'v=' + parseInt(Date.now() / 1000)
				}
				return config
			}
		}
	}
])

.config([
	'$routeProvider', '$httpProvider', '$translateProvider', 'momentPickerProvider',
	function ($routeProvider, $httpProvider, $translateProvider, momentPickerProvider) {
		// ng route definitions
		$routeProvider.otherwise({
			redirectTo: '/home',
		})
		.when('/home', {
			templateUrl: 'static/templates/home/page.html',
		})
		.when('/form', {
			templateUrl: 'static/templates/main_form/page.html',
		})
		
		// use a static loader
		$translateProvider.useStaticFilesLoader({
			prefix: 'static/locale/',
			suffix: '.json',
		})
		$translateProvider.preferredLanguage('en')
		
		// use no sanitization. its insane, but we start small
		$translateProvider.useSanitizeValueStrategy(null)
		
		// moment picker
		momentPickerProvider.options({
			locale: 'en',
			format: 'D MMMM YYYY',
			// setOnSelect: true,
			today: true,
			leftArrow: '<i class="icon-arrow-left"></i>',
			rightArrow: '<i class="icon-arrow-right"></i>',
		})
		
		// push our cache buster
		$httpProvider.interceptors.push('CacheBustService');
	}
])

.run([
	'$localForage',
	function ($localForage) {
		$localForage.createInstance({name: 'mainform'})
		
	}
])
