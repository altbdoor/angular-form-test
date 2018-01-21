angular.module('NgFormTest')

.controller('RootController', [
	function () {
		var self = this
		
	}
])

.controller('MainFormController', [
	'$rootScope',
	function ($rootScope) {
		var self = this
		
		self.stepTemplateList = [
			'partials/main_form/_step1.html?v=' + cachebust,
			'partials/main_form/_step2.html?v=' + cachebust,
		]
		
		self.stepActiveIndex = 0
		self.isReady = true
		
		self.showNextStep = function () {
			self.stepActiveIndex = Math.min(self.stepActiveIndex + 1, self.stepTemplateList.length)
		}
		
		self.showPreviousStep = function () {
			self.stepActiveIndex = Math.max(0, self.stepActiveIndex - 1)
		}
		
		$rootScope.$on('main-form:show-next', function (e) {
			e.stopPropagation()
			window.scrollTo(0, 0)
			self.showNextStep()
		})
		
		$rootScope.$on('main-form:show-previous', function (e) {
			e.stopPropagation()
			window.scrollTo(0, 0)
			self.showPreviousStep()
		})
		
	}
])

.controller('PersonalDetailsController', [
	'$rootScope', 'MainFormService',
	function ($rootScope, MainFormService) {
		var self = this
		
		self.vm = {
			firstName: '',
			lastName: '',
			dateOfBirth: '',
			emailAddress: '',
		}
		
		MainFormService.getStepData(1).then(function (data) {
			if (data) {
				self.vm = data
			}
		})
		
		self.submit = function (form) {
			if (form.$valid) {
				MainFormService.setStepData(1, self.vm)
				$rootScope.$emit('main-form:show-next')
			}
			
		}
		
		self.momentPicker = {
			dateOfBirth: {
				max: moment(),
				min: moment().subtract(80, 'years')
			}
		}
	}
])

.controller('ItemController', [
	'$rootScope',
	function ($rootScope) {
		var self = this
		
		self.goBack = function () {
			$rootScope.$emit('main-form:show-previous')
		}
	}
])
