angular.module('NgFormTest')

.component('stepFormButtons', {
	templateUrl: 'partials/main_form/buttons.html?v=' + cachebust,
	bindings: {
		showPrevious: '<',
		showNext: '<',
		onPrevious: '&',
		onNext: '&',
	},
})
