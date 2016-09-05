(function (a) {
    function RuleService() {
        var self = {};

        self.loadRuleGroups = function (subject, callback) {
            $.post("/local/keywords/logic.php", {method: 'get_rule_groups', subject: subject}, function (data) {
                callback(data);
            }, "json");
        }

        self.saveRuleGroups = function (subject, ruleGroups) {
            if (!ruleGroups) {
                return false;
            }

            var groupsData = [];
            for (var i = 0; i < ruleGroups.length; i++) {
                var groupData = $.extend(true, {}, ruleGroups[i]);
                removeProperties(groupData, ["$$hashKey", "is_new"]);
                groupsData.push(groupData);
            }

            var commonGroups = [],
                subjectGroups = [];
            for (var i = 0; i < groupsData.length; i++) {
                if (groupsData[i].common) {
                    commonGroups.push(groupsData[i]);
                } else {
                    subjectGroups.push(groupsData[i]);
                }
            }
            $.post("/local/keywords/logic.php", {method: 'save_rule_groups', subject: subject, subject_groups: JSON.stringify(subjectGroups), common_groups: JSON.stringify(commonGroups)});
        }
        
        return self;
    }

    a.module(appId).factory('RuleService', RuleService);
})(angular);