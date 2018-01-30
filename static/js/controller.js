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
		var vm = this
		
		vm.momentPicker = {
			dateOfBirth: {
				max: moment(),
				min: moment().subtract(80, 'years')
			}
		}
		
		vm.submit = vmFormSubmit
		
		var formKeys = [
			'firstName',
			'lastName',
			'dateOfBirth',
			'emailAddress',
		]
		
		init()
		
		// ========================================
		
		function init () {
			MainFormService.getStepData(1).then(function (data) {
				if (data) {
					for (var key in data) {
						vm[key] = data[key]
					}
				}
			})
		}
		
		function vmFormSubmit (form) {
			if (form.$valid) {
				var formData = {}
				for (var i=0; i<formKeys.length; i++) {
					formData[formKeys[i]] = vm[formKeys[i]]
				}
				
				MainFormService.setStepData(1, formData)
				$rootScope.$emit('main-form:show-next')
			}
			
		}
		
	}
])

.controller('VehicleDetailsController', [
	'$rootScope', 'Vehicle',
	function ($rootScope, Vehicle) {
		var vm = this
		
		vm.brand = ''
		vm.model = ''
		
		vm.opt = {
			brand: [],
			model: [],
		}
		
		vm.goBack = function () {
			$rootScope.$emit('main-form:show-previous')
		}
		
		vm.brandChange = function () {
			vm.model = ''
			vm.opt.model = []
			
			Vehicle.$getModels({name: vm.brand}).then(function (data) {
				for (var i=0; i<data.length; i++) {
					data[i] = {
						'name': data[i]
					}
				}
				
				vm.opt.model = data
			})
		}
		
		Vehicle.$query().then(function (data) {
			var optBrand = []
			
			for (var i=0; i<data.length; i++) {
				optBrand.push({
					'id': data[i]['id'],
					'name': data[i]['brand'],
				})
			}
			
			vm.opt.brand = optBrand
		})
	}
])
