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
			'static/templates/main_form/_step1.html',
			'static/templates/main_form/_step2.html',
		]
		
		self.stepActiveIndex = 1
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
	'$rootScope', 'Vehicle',
	function ($rootScope, Vehicle) {
		var self = this
		
		self.vm = {
			brand: '',
			model: '',
		}
		
		self.opt = {
			brand: [],
			model: [],
		}
		
		self.goBack = function () {
			$rootScope.$emit('main-form:show-previous')
		}
		
		self.brandChange = function () {
			self.opt.model = []
			
			Vehicle.$getModels({brand: self.vm.brand}).then(function (data) {
				self.opt.model = data
			})
		}
		
		Vehicle.$query().then(function (data) {
			var optBrand = []
			
			for (var i=0; i<data.length; i++) {
				optBrand.push(data[i]['brand'])
			}
			
			self.opt.brand = optBrand
		})
	}
])
