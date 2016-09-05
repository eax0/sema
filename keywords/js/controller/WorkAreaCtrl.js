(function (a) {
    function WorkAreaCtrl($scope, $routeParams, RuleService, PhraseService, GroupService) {
        var self = this;

        self.subject = $routeParams.subject;
        $scope.ruleGroups = $scope.groups = [];
        $scope.originalPhrases  = $scope.filteredPhrases = [];

        PhraseService.loadPhrases(self.subject, function (phrases) {
            $scope.originalPhrases = phrases;
        });

        RuleService.loadRuleGroups(self.subject, function (ruleGroups) {
            $scope.ruleGroups = ruleGroups;
        });

        GroupService.loadGroups(self.subject, function (groups) {
            $scope.groups = groups;
        });

        $scope.$on('RuleGroupsChanged', function () {
            self.processPhrases();
            RuleService.saveRuleGroups(self.subject, $scope.ruleGroups)
        });

        $scope.$on('GroupsChanged', function () {
            GroupService.saveGroups(self.subject, $scope.groups)
        });

        self.processPhrases = function () {
            var filterRes = PhraseService.filterPhrases($scope.originalPhrases, $scope.ruleGroups);
            $scope.filteredPhrases = filterRes.filtered;

            var resultGroups = PhraseService.groupPhrases($scope.filteredPhrases, $scope.groups);
            $scope.$broadcast('ResultPhraseGroupsChanged', {groups: resultGroups, deleted: filterRes.deleted});

            // save
            $.post('/local/keywords/logic.php', {subject: self.subject, data: JSON.stringify(resultGroups), method: 'save_results'});
        };

        self.onMouseUp = function (e) {
            var selection = window.getSelection(),
                selectedText = selection.toString();

            if (!selectedText || selection.type !== "Range" || !e.shiftKey) {
                return true;
            }

            var startWord = selection.anchorNode,
                endWord = selection.focusNode;

            if (angular.element(startWord).parent().parent()[0] !== angular.element(endWord).parent().parent()[0]) {
                return true;
            }

            PhraseService.searchOnServer(selectedText);
        }
    }

    a.module(appId).controller('WorkAreaCtrl', WorkAreaCtrl);
})(angular);