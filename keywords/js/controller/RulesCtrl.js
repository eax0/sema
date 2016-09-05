(function (a) {
    function RulesCtrl($scope, $timeout, ConditionService) {
        var self = this;

        self.edit = false;
        self.scope = $scope;
        self.conditionTypes = ConditionService.types;
        self.state = 'default';

        self.topBarData = {
            title: "Правила обработки",
            actions: [
                {title: 'Удалить', icon: 'red remove', action: 'delete'},
                {title: 'Изменить', icon: 'green edit', action: "edit"},
            ]
        };

        self.selectedItems = [];

        self.scope.$watchCollection(function () {
            return self.selectedItems;
        }, function (newItems) {
            self.state = newItems.length == 0 ? 'default' : 'active';
        });

        self.selectedItemsCount = function () {
            return self.selectedItems.length;
        }

        $scope.$on('AddToRuleGroupEvent', function (e, data) {
            var group = $scope.ruleGroups.filter(function (group) {
                return group.id == data.groupId;
            })[0];

            if (!group) {
                for (var i = 0; i < $scope.ruleGroups.length; i++) {
                    group = $scope.ruleGroups[i];
                    if (data.type == group.type) {
                        break;
                    }
                }
            }

            var groupItems = group.items.map(function (item) {
                return item.text;
            })

            for (var i = 0; i < data.items.length; i++) {
                if (groupItems.indexOf(data.items[i]) === -1) {
                    group.items.splice(0, 0, {is_new: true, condition_type: ConditionService.TYPE_CONTAINS, text: data.items[i]});
                }
            }

            $timeout(function () {
                $scope.ruleGroups.forEach(function (group) {
                    group.items.forEach(function (item) {
                        item.is_new = false;
                    });
                });
            }, 1000);

            $scope.$emit('RuleGroupsChanged');
        });

        function updateSorting() {
            for (var j in $scope.ruleGroups) {
                $scope.ruleGroups[j].sort = parseInt(j) + 1;
            }
            self.cancelSelection();
        }

        self.onGroupMoved = function (group) {
            $scope.ruleGroups.splice($scope.ruleGroups.indexOf(group), 1);
            updateSorting();
        }

        self.onItemSelected = function (item) {
            if (self.state == 'edit') {
                return true;
            }

            item.selected = !item.selected;
            var i = self.selectedItems.indexOf(item);
            if (i !== -1) {
                self.selectedItems.splice(i, 1);
            } else {
                self.selectedItems.push(item);
            }
        }

        self.cancelSelection = function () {
            self.selectedItems = [];
            $scope.ruleGroups.forEach(function (group) {
                group.items.forEach(function (item) {
                    item.selected = false;
                });
            });
            self.state = 'default';
        }

        self.deleteGroup = function (group) {
            $scope.groups.splice($scope.groups.indexOf(group), 1);
            $scope.$emit('RuleGroupsChanged');
        }

        self.doAction = function (action) {
            switch (action) {
                case "delete":
                    for (var i in $scope.ruleGroups) {
                        var group = $scope.ruleGroups[i];
                        for (var j=0; j<group.items.length; j++) {
                            if (group.items[j].selected) {
                                group.items.splice(j, 1);
                                j--;
                            }
                        }
                    }

                    $scope.$emit('RuleGroupsChanged');
                    self.cancelSelection();
                    break;
                case "edit":
                    self.state = 'edit';
            }
        }
    }

    a.module(appId).controller('RulesCtrl', RulesCtrl);
})(angular);