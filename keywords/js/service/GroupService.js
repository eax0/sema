(function (a) {
    function GroupService() {
        var self = {};

        self.loadGroups = function (subject, callback) {
            $.post("/local/keywords/logic.php", {method: 'get_groups', subject: subject}, function (data) {
                callback(data);
            }, "json");
        }

        self.saveGroups = function (subject, groups) {
            if (!groups) {
                return false;
            }

            var groupsData = [];
            for (var i = 0; i < groups.length; i++) {
                var groupData = $.extend(true, {}, groups[i]);
                removeProperties(groupData, "$$hashKey");
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
            $.post("/local/keywords/logic.php", {method: 'save_groups', subject: subject, subject_groups: JSON.stringify(subjectGroups), common_groups: JSON.stringify(commonGroups)});
        }

        return self;
    }

    a.module(appId).factory('GroupService', GroupService);
})(angular);