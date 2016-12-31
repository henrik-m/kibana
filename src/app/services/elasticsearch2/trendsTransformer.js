define([
		'angular'
	],
	function (angular) {
		'use strict';

		var signature = /^\{\"facets\":\{\"0\":\{\"query\":.*\"old_.*/;

		return {
			condition: function (config) {
				return (/\/_search$/).test(config.url) && signature.test(config.data);
			},

			request: function (config) {
				var facetData = angular.fromJson(config.data);

				var aggregationsData = {};
				aggregationsData.aggs = {};

				var fLen = Object.keys(facetData["facets"]).length;

				for (var i = 0; i < fLen / 2; i++) {
					aggregationsData["aggs"][i] = {};
					aggregationsData["aggs"][i]["filter"] = facetData["facets"][i]["query"];

					aggregationsData["aggs"]["old_" + i] = {};
					aggregationsData["aggs"]["old_" + i]["filter"] = facetData["facets"]["old_" + i]["query"];
				}
				config.data = angular.toJson(aggregationsData);

				return config;
			},

			response: function (response) {
				var data = response.data;

				data.facets = data.aggregations;

				var fLen = Object.keys(data["facets"]).length;

				for (var i = 0; i < fLen / 2; i++) {
					data["facets"][i]["count"] = data["facets"][i]["doc_count"];
					data["facets"]["old_" + i]["count"] = data["facets"]["old_" + i]["doc_count"];

					data["facets"][i]["type"] = "query";
					data["facets"]["old_" + i]["type"] = "query";
				}

				return response;
			}
		};
	});
