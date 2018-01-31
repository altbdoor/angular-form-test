angular.module('NgFormTest')

.factory('MainFormService', [
	'$localForage', '$q',
	function ($localForage, $q) {
		var lf = $localForage.instance('mainform')
		var keyPrefix = 'form-data-'
		
		var mainFormData = {}
		
		function setStepData (step, data) {
			// lf.setItem(keyPrefix + step, data)
			mainFormData[keyPrefix + step] = data
		}
		
		function getStepData (step) {
			// return lf.getItem(keyPrefix + step)
			return $q.when(mainFormData[keyPrefix + step])
		}
		
		function getAllStepData () {
			return $q.when(mainFormData)
		}
		
		function toJSON () {
			
		}
		
		return {
			setStepData: setStepData,
			getStepData: getStepData,
			getAllStepData: getAllStepData,
			toJSON: toJSON,
		}
	}
])

.factory('Vehicle', [
	'$http', '$timeout',
	function ($http, $timeout) {
		var jsonData = [
			{"id": 1, "brand": "Honda", "models": ["Accord", "Accord Coupé", "Accord Tourer", "City", "Civic"]},
			{"id": 2, "brand": "Subaru", "models": ["BRZ", "Forester", "Impreza", "Impreza Wagon", "Justy"]},
			{"id": 3, "brand": "Mazda", "models": ["121", "2", "3", "323", "323 Combi"]},
			{"id": 4, "brand": "Mitsubishi", "models": ["3000 GT", "ASX", "Carisma", "Colt", "Colt CC", "Eclipse"]},
			{"id": 5, "brand": "Lexus", "models": ["CT", "GS", "GS 300", "GX", "IS"]},
			{"id": 6, "brand": "Toyota", "models": ["4-Runner", "Auris", "Avensis", "Avensis Combi", "Avensis Van Verso"]},
			{"id": 7, "brand": "Suzuki", "models": ["Alto", "Baleno", "Baleno kombi", "Grand Vitara", "Grand Vitara XL-7"]}
		]
		
		function getDelay () {
			var max = 4
			var min = 2
			var delay = Math.floor(Math.random() * (max - min + 1)) + min;
			// console.log('Delay ' + delay + 's')
			// return (delay * 1000)
			return 0
		}
		
		function query () {
			return $timeout(function () {
				return jsonData
			}, getDelay())
		}
		
		function getModels (param) {
			return $timeout(function () {
				var brandId = param['id']
				var models = []
				
				for (var i=0; i<jsonData.length; i++) {
					if (jsonData[i]['id'] == brandId) {
						models = jsonData[i]['models']
						break
					}
				}
				
				return models
			}, getDelay())
		}
		
		return {
			$query: query,
			$getModels: getModels,
		}
	}
])

.factory('ScrollbarWidthService', [
	function () {
		var scrollDiv = document.createElement('div')
		scrollDiv.className = 'modal-scrollbar-measure'
		document.body.appendChild(scrollDiv)
		var scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth
		document.body.removeChild(scrollDiv)
		
		return {
			get: function () { return scrollbarWidth },
		}
	}
])

.factory('ModalBoxFactory', [
	'ScrollbarWidthService',
	function (ScrollbarWidthService) {
		function show (elemId) {
			var scrollWidth = ScrollbarWidthService.get() + 'px'
			
			var modalBox = document.querySelector(elemId)
			modalBox = angular.element(modalBox)
			modalBox.addClass('show')
			modalBox.css({
				'display': 'block',
				'padding-right': scrollWidth,
			})
			
			var bodyElem = angular.element(document.body)
			bodyElem.addClass('modal-open')
			bodyElem.css('padding-right', scrollWidth)
			
			var backdrop = document.createElement('div')
			backdrop.className = 'modal-backdrop show'
			document.body.appendChild(backdrop)
		}
		
		function hide () {
			var backdrop = document.querySelector('.modal-backdrop.show')
			backdrop = angular.element(backdrop)
			backdrop.remove()
			
			var bodyElem = angular.element(document.body)
			bodyElem.removeClass('modal-open')
			bodyElem.css('padding-right', 0)
			
			var modalBox = document.querySelector('.modal.show')
			modalBox = angular.element(modalBox)
			modalBox.removeClass('show')
			modalBox.css({
				'display': 'none',
				'padding-right': 0,
			})
		}
		
		return {
			show: show,
			hide: hide,
		}
	}
])
