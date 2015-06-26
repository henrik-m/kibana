  define(function (require) {
  require('modules')
  .get('kibana')
  .service('timefilter', function (Private, globalState, $rootScope, config) {

    var _ = require('lodash');
    var angular = require('angular');
    var moment = require('moment');
    var datemath = require('utils/datemath');
    var Events = Private(require('factories/events'));
    var diff = Private(require('utils/diff_time_picker_vals'));

    require('components/state_management/global_state');

    function convertISO8601(stringTime) {
      var obj = moment(stringTime, 'YYYY-MM-DDTHH:mm:ss.SSSZ', true);
      return obj.isValid() ? obj : stringTime;
    }

    _.class(Timefilter).inherits(Events);
    function Timefilter() {
      Timefilter.Super.call(this);

      var self = this;
      var diffTime = Private(require('components/timefilter/lib/diff_time'))(self);
      var diffInterval = Private(require('components/timefilter/lib/diff_interval'))(self);

      self.enabled = false;

      var timeDefaults = config.get('timepicker:timeDefaults');

      var refreshIntervalDefaults = {
        display: 'Off',
        pause: false,
        section: 0,
        value: 0
      };

      // These can be date math strings or moments.
      self.time = _.defaults(globalState.time || {}, timeDefaults);
      self.refreshInterval = _.defaults(globalState.refreshInterval || {}, refreshIntervalDefaults);

      globalState.on('fetch_with_changes', function () {
        // clone and default to {} in one
        var newTime = _.defaults({}, globalState.time, timeDefaults);
        var newRefreshInterval = _.defaults({}, globalState.refreshInterval, refreshIntervalDefaults);

        if (newTime) {
          if (newTime.to) newTime.to = convertISO8601(newTime.to);
          if (newTime.from) newTime.from = convertISO8601(newTime.from);
        }

        self.time = newTime;
        self.refreshInterval = newRefreshInterval;
      });

      $rootScope.$$timefilter = self;

      $rootScope.$watchMulti([
        '$$timefilter.time',
        '$$timefilter.time.from',
        '$$timefilter.time.to',
        '$$timefilter.time.mode'
      ], diffTime);

      $rootScope.$watchMulti([
        '$$timefilter.refreshInterval',
        '$$timefilter.refreshInterval.pause',
        '$$timefilter.refreshInterval.value'
      ], diffInterval);
    }

    Timefilter.prototype.get = function (indexPattern) {
      var filter;
      var timefield = indexPattern.timeFieldName && _.find(indexPattern.fields, {name: indexPattern.timeFieldName});

      if (timefield) {
        var bounds = this.getBounds();
        filter = {range : {}};
        filter.range[timefield.name] = {
          gte: bounds.min.valueOf(),
          lte: bounds.max.valueOf(),
          format: 'epoch_millis'
        };
      }

      return filter;
    };

    Timefilter.prototype.getBounds = function (timefield) {
      return {
        min: datemath.parse(this.time.from),
        max: datemath.parse(this.time.to, true)
      };
    };

    Timefilter.prototype.getActiveBounds = function () {
      if (this.enabled) return this.getBounds();
    };

    return new Timefilter();
  });

});
