function GroupsCtrl($scope, ConditionService) {
    var self = this;

    self.edit = false;
    self.scope = $scope;
    self.state = 'default';

    self.topBarData = {
        title: "Группы",
        actions: [
            {title: 'Удалить', icon: 'remove', action: 'delete'},
            {title: 'Изменить', icon: 'edit', action: "edit"},
        ]
    };

    self.scope.$on('CreateGroupEvent', function (e, data) {
        var items = [];
        for (var i in data.items) {
            items.push({condition_type: ConditionService.TYPE_CONTAINS, text: data.items[i]});
        }

        $scope.groups.push({id: data.items[0], title: data.items[0].toLocaleUpperCase(), items: items});
        $scope.$emit('GroupsChanged');
    });

    self.selectedItems = [];

    $scope.$watchCollection(function () {
        return self.selectedItems;
    }, function (newItems) {
        self.state = newItems.length == 0 ? 'default' : 'active';
    });

    self.selectedItemsCount = function () {
        return self.selectedItems.length;
    }

    self.deleteGroup = function (group) {
        $scope.groups.splice($scope.groups.indexOf(group), 1);
        $scope.$emit('GroupsChanged');
    }

    $scope.$on('AddGroupConditions', function (e, data) {
        var group = $scope.groups.filter(function (group) {
            return group.id == data.groupId;
        })[0];

        for (var i = 0; i < data.items.length; i++) {
            group.items.push({condition: ConditionService.condition(ConditionService.TYPE_CONTAINS), text: data.items[i]});
        }
        $scope.$emit('GroupsChanged');
    });

    function updateSorting() {
        for (var j in $scope.groups) {
            $scope.groups[j].sort = parseInt(j) + 1;
        }
        self.cancelSelection();
    }

    self.onGroupMoved = function (group) {
        $scope.groups.splice($scope.groups.indexOf(group), 1);
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
        $scope.groups.forEach(function (group) {
            group.items.forEach(function (item) {
                item.selected = false;
            });
        });
        self.state = 'default';
    }

    self.doAction = function (action) {
        switch (action) {
            case "delete":
                for (var i in $scope.groups) {
                    var group = $scope.groups[i];
                    for (var j=0; j<group.items.length; j++) {
                        if (group.items[j].selected) {
                            group.items.splice(j, 1);
                            j--;
                        }
                    }
                }

                $scope.$emit('GroupsChanged');
                self.cancelSelection();
                break;
            case "edit":
                self.state = 'edit';
        }
    }
}

angular.module('keywords-app')
    .controller('GroupsCtrl', GroupsCtrl);