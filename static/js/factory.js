angular.module('NgFormTest')

.factory('CacheBustService', [
	function () {
		return {
			request: function (config) {
				if (config.url.indexOf('templates') !== -1 || config.url.indexOf('partials') !== -1) {
					config.url += (config.url.indexOf('?') === -1 ? '?' : '&') + 'v=' + parseInt(Date.now() / 60000)
				}
				return config
			}
		}
	}
])

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
				var brandName = param['brand']
				var models = []
				
				for (var i=0; i<jsonData.length; i++) {
					if (jsonData[i]['brand'] == brandName) {
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
