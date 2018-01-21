angular.module('NgFormTest', [
	'ngRoute',
	'ngMessages',
	
	'pascalprecht.translate',
	
	'text-mask',
	'moment-picker',
	'LocalForageModule',
])

.config([
	'$routeProvider', '$translateProvider', 'momentPickerProvider',
	function ($routeProvider, $translateProvider, momentPickerProvider) {
		// ng route definitions
		$routeProvider.otherwise({
			redirectTo: '/home',
		})
		.when('/home', {
			templateUrl: 'partials/home/page.html?v=' + cachebust,
		})
		.when('/form', {
			templateUrl: 'partials/main_form/page.html?v=' + cachebust,
		})
		
		// use a static loader
		$translateProvider.useStaticFilesLoader({
			prefix: 'static/locale/',
			suffix: '.json?v=' + cachebust,
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
	}
])

.run([
	'$localForage',
	function ($localForage) {
		$localForage.createInstance({name: 'mainform'})
		
	}
])
