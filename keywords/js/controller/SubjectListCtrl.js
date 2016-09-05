(function (a) {
    function SubjectListCtrl($scope, $timeout) {
        var self = this;
        self.directories = [];

        $.post('/local/keywords/logic.php', {method: 'get_subject_list'}, function (data) {
            $timeout(function () {
                self.directories = data;
            });
        }, "json");
    }

    a.module(appId).controller('SubjectListCtrl', SubjectListCtrl);
})(angular);