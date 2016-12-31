define([
  'angular'
],
function (angular) {
  'use strict';
  var signature = /^\{\"facets\":\{\"[0-9]+\":\{\"query\":\{\"bool\":\{\"must\"/;

  return {
    condition: function(config){
      return (/\/_search$/).test(config.url) && signature.test(config.data);
    },

    request: function(config){
      var facetData = angular.fromJson(config.data);

      var aggregationsData = {};
      aggregationsData.aggs = {};

      var facets = facetData["facets"];

      for (var i in facets) {
        aggregationsData["aggs"][i] = {};
        aggregationsData["aggs"][i]["filter"] = facetData["facets"][i]["query"];
      }

      aggregationsData.size = 0;

      config.data = angular.toJson(aggregationsData);

      return config;
    },

    response: function(response){
      var data = response.data;

      data.facets = data.aggregations;

      for (var b in data.facets) {
        data["facets"][b]["count"] = data["facets"][b]["doc_count"];
        data["facets"][b]["_type"] = "query";
      }

      return response;
    }
  };
});
