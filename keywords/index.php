<!doctype html>
<html ng-app="keywords-app">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <base href="/local/keywords/">

    <link rel="stylesheet" href="/resources/lib/semantic1.12/semantic.min.css">

    <link rel="stylesheet" href="resources/css/button.min.css">
    <link rel="stylesheet" href="resources/css/dragndrop.css">
    <link rel="stylesheet" href="resources/contextmenu/style.css">

    <link rel="stylesheet" href="/resources/css.2/generated/styles/keywords.css">

    <script src="/resources/lib/jquery-1.11.1.min.js"></script>
    <script src="/resources/lib/semantic1.12/semantic.min.js"></script>

    <script src="resources/js/angular.min.js"></script>
    <script src="resources/js/angular-route.min.js"></script>

    <script src="resources/contextmenu/contextmenu.js"></script>
    <script src="resources/js/angular-drag-and-drop-lists.js"></script>

    <script src="app.js"></script>

    <script src="js/service/ConditionService.js"></script>
    <script src="js/service/PhraseService.js"></script>
    <script src="js/service/RuleDataService.js"></script>
    <script src="js/service/GroupService.js"></script>

    <script src="js/controller/SubjectListCtrl.js"></script>
    <script src="js/controller/WorkAreaCtrl.js"></script>
    <script src="js/controller/MainCtrl.js"></script>
    <script src="js/controller/PhrasesCtrl.js"></script>
    <script src="js/controller/RulesCtrl.js"></script>
    <script src="js/controller/GroupsCtrl.js"></script>
    <script src="js/controller/ResultsCtrl.js"></script>
</head>
<body>

<main ng-controller="MainCtrl as mainCtrl">
    <div class="ng-view"></div>
</main>

</div>

</body>
</html>
