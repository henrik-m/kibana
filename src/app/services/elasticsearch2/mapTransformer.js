define([
		'angular',
		'lodash'
	],
	function (angular, _) {
		'use strict';
		var signature = /^\{\"facets\":\{\"map\":\{\"terms\"/;

		return {
			condition: function (config) {
				return signature.test(config.data);
			},

			request: function (config) {
				var facetData = angular.fromJson(config.data);

				var aggregationsData = {
					aggs: {},
					size: facetData.size
				};

				_.forOwn(facetData.facets, function (num, key) {
					var facet = facetData.facets[key];
					var aggregations = {};

					aggregations[key] = {
						terms: facet.terms
					};
					aggregationsData.aggs[key] = {
						filter: facet.facet_filter.fquery.query,
						aggs: aggregations
					};
				});

				config.data = angular.toJson(aggregationsData);

				return config;
			},

			response: function (response) {
				var data = response.data;

				var facetsData = {};

				_.forOwn(data.aggregations, function (num, key) {
					var agregation = data.aggregations[key];

					facetsData[key] = {
						_type: 'map',
						terms: _.map(agregation[key].buckets, function (bucket) {
							return {
								term: bucket.key,
								count: bucket.doc_count
							};
						})
					};
				});

				data.facets = facetsData;
				console.log(data);
				return response;
			}
		};
	});
