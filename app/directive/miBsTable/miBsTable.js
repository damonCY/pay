/**
 * bootstrap table directive
 *
 * @see https://github.com/wenzhixin/bootstrap-table/tree/develop/src/extensions/angular
 * 
 * @author  Yang,junlong at 2016-06-13 14:24:36 build.
 * @version $Id$
 */

var app = require('app/app.js');
var $ = require('app/lib/bootstrap-table/bootstrap-table.js');
module.exports = $;

app.registerDirective('miBsTable', ['$compile', function($compile) {
    var CONTAINER_SELECTOR = '.bootstrap-table';
    var SCROLLABLE_SELECTOR = '.fixed-table-body';
    var SEARCH_SELECTOR = '.search input';
    var bsTables = {};
    var loaded = false;

    function getBsTable (el) {
       var result;
        $.each(bsTables, function (id, bsTable) {
            if (!bsTable.$element.closest(CONTAINER_SELECTOR).has(el).length) return;
            result = bsTable;
            return true;
        });
        return result;
    }

    // reset tables size
    $(window).resize(function () {
        $.each(bsTables, function (id, bsTable) {
            bsTable.$element.bootstrapTable('resetView');
        });
    });

    function onScroll () {
        var bsTable = this;
        var state = bsTable.$scope.miBsTable.state;
        bsTable.$scope.$apply(function () {
            state.scroll = bsTable.$element.bootstrapTable('getScrollPosition');
        });
    }

    $(document)
      .on('post-header.bs.table', CONTAINER_SELECTOR+' table', function (evt) { // bootstrap-table calls .off('scroll') in initHeader so reattach here
        var bsTable = getBsTable(evt.target);
        if (!bsTable) return;
        bsTable.$element
          .closest(CONTAINER_SELECTOR)
          .find(SCROLLABLE_SELECTOR)
          .on('scroll', onScroll.bind(bsTable));
      })
      .on('sort.bs.table', CONTAINER_SELECTOR+' table', function (evt, sortName, sortOrder) {
        var bsTable = getBsTable(evt.target);
        if (!bsTable) return;
        var state = bsTable.$scope.miBsTable.state;
        bsTable.$scope.$apply(function () {
          state.sortName = sortName;
          state.sortOrder = sortOrder;
        });
      })
      .on('page-change.bs.table', CONTAINER_SELECTOR+' table', function (evt, pageNumber, pageSize) {
        var bsTable = getBsTable(evt.target);
        if (!bsTable) return;
        var state = bsTable.$scope.miBsTable.state;
        bsTable.$scope.$apply(function () {
          state.pageNumber = pageNumber;
          state.pageSize = pageSize;
        });
      })
      .on('search.bs.table', CONTAINER_SELECTOR+' table', function (evt, searchText) {
        var bsTable = getBsTable(evt.target);
        if (!bsTable) return;
        var state = bsTable.$scope.miBsTable.state;
        bsTable.$scope.$apply(function () {
          state.searchText = searchText;
        });
      })
      .on('focus blur', CONTAINER_SELECTOR+' '+SEARCH_SELECTOR, function (evt) {
        var bsTable = getBsTable(evt.target);
        if (!bsTable) return;
        var state = bsTable.$scope.miBsTable.state;
        bsTable.$scope.$apply(function () {
          state.searchHasFocus = $(evt.target).is(':focus');
        });
      })
      .on('post-body.bs.table', CONTAINER_SELECTOR+' table', function (evt) {
        refreshMeta($(this));
      })
      .on('column-switch.bs.table', CONTAINER_SELECTOR+' table', function() {
        refreshMeta($(this));
      });

    function refreshMeta($table) {
        var htr = $table.find('thead').first().children().last();
        var htd = htr.children();
        var size = htd.size();
        var startDate = $('#startDate input').val();
        var endDate = $('#endDate input').val();
        var subtitle = $('<tr class="__meta"><th>开始日期：</th><th>'+startDate+'</th><th colspan="'+(size-4)+'" align="center"></th><th>结束日期：</th><th>'+endDate+'</th></tr>').hide();
        if(size == 0) {
            subtitle = $('<tr class="__meta"><th>开始日期：</th><th>'+startDate+'</th><th>结束日期：</th><th>'+endDate+'</th></tr>').hide();
        }

        if (!loaded && size > 0) {
            var title = $('.thumbtable h2').last().html();
            title = $('<tr class="__meta"><th colspan="'+size+'" align="center">'+title+'</th></tr>').hide();
            title.insertBefore(htr);
            if (startDate) {
              subtitle.insertBefore(htr);
            }
            loaded = true;
        } else {
          if (startDate) {
            $table.find('thead').first().children().eq(1).replaceWith(subtitle);
          }
        }
    }

    return {
        restrict: 'EA',
        replace: true,
        template: '<table></table>',
        scope: {
            miBsTable: '='
        },
        link: function($scope, $element, attrs) {
            loaded = false;

            $element = $($element);

            var bsTable = bsTables[$scope.$id] = {$scope: $scope, $element: $element};
            $scope.instantiated = false;

            $scope.$watch('miBsTable.options', function (options) {
                if (!options) {
                      options = $scope.miBsTable.options = {};
                }
                var state = $scope.miBsTable.state || {};

                if ($scope.instantiated) {
                      $element.bootstrapTable('destroy');
                }
                  $element.bootstrapTable(angular.extend(angular.copy(options), state));
                $scope.instantiated = true;

                // Update the UI for state that isn't settable via options
                if ('scroll' in state) {
                    $element.bootstrapTable('scrollTo', state.scroll);
                }
                if ('searchHasFocus' in state) {
                    $element.closest(CONTAINER_SELECTOR).find(SEARCH_SELECTOR).focus(); // $el gets detached so have to recompute whole chain
                }

                $compile($('.bootstrap-table .dropdown-toggle'))($scope);
            }, true);

            $scope.$watch('miBsTable.state', function (state) {
                  if (!state) {
                      state = $scope.miBsTable.state = {};
                  }
                  $element.trigger('directive-updated.bs.table', [state]);
            }, true);

            $scope.$on('$destroy', function () {
                  delete bsTables[$scope.$id];
            });
        }
    };
}]);
