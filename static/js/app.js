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
	'$routeProvider', '$translateProvider', 'momentPickerProvider', 'chosenProvider',
	function ($routeProvider, $translateProvider, momentPickerProvider, chosenProvider) {
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
		
		// chosen jquery
		chosenProvider.setOption({
			no_results_text: 'There is no results!',
			placeholder_text_multiple: 'Choose one or more!',
			placeholder_text_single: 'Select an option',
		})
	}
])

.run([
	'$localForage',
	function ($localForage) {
		$localForage.createInstance({name: 'mainform'})
		
	}
])
