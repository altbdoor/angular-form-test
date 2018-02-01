angular.module('NgFormTest')

.controller('RootController', [
	function () {
		var self = this
		
	}
])

.controller('MainFormController', [
	'$rootScope', '$window',
	function ($rootScope, $window) {
		var self = this
		
		self.stepTemplateList = [
			'static/templates/main_form/_step1.html',
			'static/templates/main_form/_step2.html',
			'static/templates/main_form/_step3.html',
		]
		
		self.stepActiveIndex = 0
		self.isReady = true
		
		self.goNextStep = function () {
			self.stepActiveIndex = Math.min(self.stepActiveIndex + 1, self.stepTemplateList.length)
		}
		
		self.goPreviousStep = function () {
			self.stepActiveIndex = Math.max(0, self.stepActiveIndex - 1)
		}
		
		$rootScope.$on('main-form:go-next', function (e) {
			e.stopPropagation()
			$window.scrollTo(0, 0)
			self.goNextStep()
		})
		
		$rootScope.$on('main-form:go-previous', function (e) {
			e.stopPropagation()
			$window.scrollTo(0, 0)
			self.goPreviousStep()
		})
		
	}
])

.controller('PersonalDetailsController', [
	'$rootScope', 'MainFormService', 'moment',
	function ($rootScope, MainFormService, moment) {
		var vm = this
		
		var formKeys = [
			'firstName',
			'lastName',
			'dateOfBirth',
			'emailAddress',
		]
		
		vm.momentPicker = {
			dateOfBirth: {
				max: moment(),
				min: moment().subtract(80, 'years')
			}
		}
		
		vm.submit = vmFormSubmit
		
		vmInit()
		
		// ========================================
		
		function vmInit () {
			MainFormService.getStepData(1).then(function (data) {
				if (data) {
					angular.extend(vm, data)
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
				$rootScope.$emit('main-form:go-next')
			}
			
		}
		
	}
])

.controller('VehicleDetailsController', [
	'$rootScope', 'Vehicle', 'createNumberMask', 'MainFormService',
	function ($rootScope, Vehicle, createNumberMask, MainFormService) {
		var vm = this
		
		var vehicleModel = {
			brand: '',
			model: '',
			carValue: '',
			carPlate: '',
			opt: {
				brand: [],
				model: [],
			},
		}
		
		var formKeys = [
			'brand',
			'model',
			'carValue',
			'carPlate',
		]
		
		vm.vehicleVmList = []
		
		vm.mask = {
			carValue: {
				'mask': createNumberMask.forDecimal(),
			}
		}
		
		vm.goBack = vmGoBack
		
		vm.brandChange = vmBrandChange
		
		vm.addVehicle = vmAddVehicle
		vm.addVehicleDisabled = false
		vm.removeVehicle = vmRemoveVehicle
		vm.removeVehicleDisabled = true
		
		vm.submit = vmFormSubmit
		
		vmInit()
		
		// ========================================
		
		function vmFormSubmit (form) {
			if (form.$valid) {
				var formDataList = []
				for (var i=0; i<vm.vehicleVmList.length; i++) {
					var formData = {}
					
					for (var j=0; j<formKeys.length; j++) {
						formData[formKeys[j]] = vm.vehicleVmList[i][formKeys[j]]
					}
					
					formDataList.push(formData)
				}
				
				MainFormService.setStepData(2, formDataList)
				$rootScope.$emit('main-form:go-next')
			}
		}
		
		function vmGoBack () {
			$rootScope.$emit('main-form:go-previous')
		}
		
		function vmBrandChange (vehicleVm, vehicleModelValue) {
			vehicleVm.model = ''
			vehicleVm.opt.model = []
			
			Vehicle.$getModels({id: vehicleVm.brand.id}).then(function (data) {
				vehicleVm.opt.model = data
				
				if (vehicleModelValue) {
					vehicleVm.model = vehicleModelValue
				}
			})
		}
		
		function vmAddVehicle (vehicleData) {
			if (!vm.addVehicleDisabled) {
				var newVehicleModel = angular.copy(vehicleModel)
				
				if (vehicleData) {
					angular.extend(newVehicleModel, vehicleData)
					vmBrandChange(newVehicleModel, vehicleData.model)
				}
				
				vm.vehicleVmList.push(newVehicleModel)
			}
			
			checkVehicleAction()
		}
		
		function vmRemoveVehicle (index) {
			if (!vm.removeVehicleDisabled) {
				vm.vehicleVmList.splice(index, 1)
			}
			
			checkVehicleAction()
		}
		
		function checkVehicleAction () {
			vm.addVehicleDisabled = (vm.vehicleVmList.length >= 3)
			vm.removeVehicleDisabled = (vm.vehicleVmList.length == 1)
		}
		
		function vmInit () {
			MainFormService.getStepData(2).then(function (data) {
				if (data) {
					for (var i=0; i<data.length; i++) {
						vmAddVehicle(data[i])
					}
				}
				else {
					vmAddVehicle()
				}
				
			})
			
			Vehicle.$query().then(function (data) {
				var optBrand = []
				
				for (var i=0; i<data.length; i++) {
					optBrand.push({
						'id': data[i]['id'],
						'brand': data[i]['brand'],
					})
				}
				
				vehicleModel.opt.brand = optBrand
				
				for (var i=0; i<vm.vehicleVmList.length; i++) {
					vm.vehicleVmList[i].opt.brand = optBrand
				}
			})
			
		}
	}
])

.controller('SummaryController', [
	'$rootScope', '$location', 'MainFormService', 'ModalBoxFactory',
	function ($rootScope, $location, MainFormService, ModalBoxFactory) {
		var vm = this
		
		vm.formData = {}
		
		vm.goBack = vmGoBack
		
		vm.submit = vmFormSubmit
		
		vmInit()
		
		// ========================================
		
		function vmInit () {
			MainFormService.getAllStepData().then(function (data) {
				vm.formData = data
			})
		}
		
		function vmGoBack () {
			$rootScope.$emit('main-form:go-previous')
		}
		
		function vmFormSubmit (form) {
			form.tncAgree.$setValidity('required', (vm.tncAgree === true))
			
			if (form.$valid) {
				ModalBoxFactory.show('#summary-process-modal')
				MainFormService.save().then(function () {
					ModalBoxFactory.hide()
					$location.path('/thanks');
				})
			}
		}
	}
])

.controller('ThankYouController', [
	'MainFormService',
	function (MainFormService) {
		var vm = this
		
		vmInit()
		
		// ========================================
		
		function vmInit () {
			MainFormService.toJSON().then(function (data) {
				vm.formData = JSON.stringify(data, null, '  ')
			})
		}
	}
])
