(function (a) {
    function PhrasesCtrl($scope, $rootScope, $timeout, PhraseService) {
        var self = this;

        self.filtered = false;

        self.scope = $scope;
        self.$timeout = $timeout;

        self.rootScope = $rootScope;
        self.selectedItems = [];
        self.state = 'default';
        self.phrases = $scope.originalPhrases;

        $scope.$watch('originalPhrases', function (newPhrases) {
            self.phrases = $scope.originalPhrases;
        });

        self.itemsLength = function () {
            return self.phrases.length;
        }

        self.topBarData = {
            title: "Фразы",
            actions: [
                {icon: "red ban", title: 'Добавить в исключения:', action: "addToRules", actionParams: {type: 'exclude'}},
                {icon: "green checkmark", title: 'Добавить во включения', action: "addToRules", actionParams: {type: 'include'}},
            ],

            dropdown_menu: [
                {title: 'Добавить в правила:', items: []},
                {title: 'Добавить в группу', items: []},
                {title: 'Создать группу', icon: 'write', action: "createGroup"},
            ]
        };

        self.scope.$watchCollection('ruleGroups', function (newValue, oldValue, scope) {
            self.topBarData.dropdown_menu[0].items = newValue.map(function (ruleGroup) {
                return {
                    action: "addToRules",
                    actionParams: {groupId: ruleGroup.id},
                    title: ruleGroup.title,
                    icon: ruleGroup.type == 'include' ? 'green checkmark' : 'red ban'
                };
            });
        });

        self.scope.$watch('groups', function (newValue, oldValue, scope) {
            self.topBarData.dropdown_menu[1].items = newValue.map(function (group) {
                return {
                    action: "addGroupConditions",
                    actionParams: {groupId: group.id},
                    title: group.title
                };
            });
        });

        self.scope.$watch(function () {
            return self.filtered;
        }, function (value) {
            if (value) {
                self.phrases = self.scope.filteredPhrases;
            } else {
                self.phrases = self.scope.originalPhrases;
            }
        });

        self.scope.$watchCollection(function () {
            return self.selectedItems;
        }, function (newItems) {
            self.state = newItems.length == 0 ? 'default' : 'active';
        });

        self.scope.$on('ResultPhraseGroupsChanged', function () {
            $timeout(function () {
                self.filtered = true;
                self.phrases = self.scope.filteredPhrases
            });
        });

        self.doAction = function (action, data) {
            var data = data || {};

            data.items = self.selectedItems;
            PhraseService.doAction(action, data);
            self.cancelSelection();
        }
    }

    PhrasesCtrl.prototype.cancelSelection = function () {
        $('.phrases.list .word.selected').removeClass('selected');
        this.selectedItems = [];
    }

    PhrasesCtrl.prototype.toggleWord = function (event, el) {
        if (event.shiftKey || window.getSelection().toString().length) {
            return true;
        }

        var text = el.word.text,
            index = this.selectedItems.indexOf(el.word.text);

        if (index === -1 && !el.word.selected) {
            this.selectedItems.push(text);
        } else if (index !== -1 && el.word.selected) {
            this.selectedItems.splice(index, 1);
        }
        
        $(event.currentTarget).toggleClass('selected');
    }

    PhrasesCtrl.prototype.onMouseUp = function (e) {
        var selection = window.getSelection(),
            selectedText = selection.toString();

        if (!selectedText || selection.type !== "Range" || e.shiftKey) {
            return true;
        }

        var startWord = selection.anchorNode,
            endWord = selection.focusNode,
            $parent = angular.element(startWord).parent().parent(),
            phraseIndex = $parent[0].dataset.phraseIndex,
            $words = $parent.children(),
            words = [];

        if (phraseIndex !== angular.element(endWord).parent().parent()[0].dataset.phraseIndex
            || !$parent.hasClass('words')) {
            return true;
        }

        for (var i = 0; i < $words.length; i++) {
            if ($words.eq(i).hasClass('selected')) {
                return true;
            }
            words.push($words.eq(i).text().replace(/\s+/g, ""));
        }

        var self = this;

        this.$timeout(function () {
            self.selectedItems.push(selectedText);
        });
    }

    a.module(appId).controller('PhrasesCtrl', PhrasesCtrl)
})(angular);