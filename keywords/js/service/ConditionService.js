(function (a) {
    function ConditionService() {
        var ConditionService = {};

        ConditionService.TYPE_STARTS = "starts";
        ConditionService.TYPE_EQUALS = "equals";
        ConditionService.TYPE_CONTAINS = "contains";

        ConditionService.types = {};

        ConditionService.types[ConditionService.TYPE_STARTS] = "начинается с";
        ConditionService.types[ConditionService.TYPE_EQUALS] = "совпадает";
        ConditionService.types[ConditionService.TYPE_CONTAINS] = "содержит";

        ConditionService.check = function (type, str1, str2) {
            switch (type) {
                case ConditionService.TYPE_EQUALS:
                    return str1 === str2;
                case ConditionService.TYPE_CONTAINS:
                    return str1.includes(str2);
                case ConditionService.TYPE_STARTS:
                default:
                    return str1.startsWith(str2);
            }
        }

        return ConditionService;
    }

    a.module(appId).factory('ConditionService', ConditionService);
})(angular);