angular.module('NgFormTest')

.directive('ngCustomClassOnError', [
	function () {
		return {
			restrict: 'A',
			require: '^form',
			link: function (scope, elem, attrs, form) {
				scope.$watch(function () {
					return form[attrs.name].$invalid && (form[attrs.name].$touched || form.$submitted)
					
				}, function (isMarkInvalid) {
					if (isMarkInvalid) {
						elem.addClass(attrs.ngCustomClassOnError)
					}
					else {
						elem.removeClass(attrs.ngCustomClassOnError)
					}
				})
			},
		}
	}
])
