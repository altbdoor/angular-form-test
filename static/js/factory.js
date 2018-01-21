angular.module('NgFormTest')

.factory('MainFormService', [
	'$localForage',
	function ($localForage) {
		var lf = $localForage.instance('mainform')
		var keyPrefix = 'form-data-'
		
		return {
			setStepData: function (step, data) {
				lf.setItem(keyPrefix + step, data)
			},
			getStepData: function (step) {
				return lf.getItem(keyPrefix + step)
			},
		}
	}
])
