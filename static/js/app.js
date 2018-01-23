angular.module('NgFormTest', [
	'ngRoute',
	'ngMessages',
	'ngResource',

	'pascalprecht.translate',
	
	'text-mask',
	'moment-picker',
	'LocalForageModule',
	// 'selector',
	'localytics.directives',
])

.config([
	'$routeProvider', '$httpProvider', '$translateProvider', 'momentPickerProvider', 'chosenProvider',
	function ($routeProvider, $httpProvider, $translateProvider, momentPickerProvider, chosenProvider) {
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
		
		// chosen jquery
		chosenProvider.setOption({
			no_results_text: 'There is no results!',
			placeholder_text_multiple: 'Choose one or more!',
			placeholder_text_single: 'Select an option',
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
