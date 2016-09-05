(function (a) {
    function PhraseService($rootScope, $http, ConditionService) {
        var PhraseService = {},
            cityShortcuts = ["спб", "москв", "казань", "казани", "самар", "екатерин", "уфа", "рязан", "нижнем", "нижний", "новгород", "новосиб", "ростов", "мурманск",
                "саратов", "челябинск", "волгоград", "воронеж", "омск", "иркутск", "пермь", "перми", "ярославл", "красноярск", "краснодар", "обнинск", "россия", "россии", "санкт", "петербург", "новокузнецк", "курган", "ульяновск", "уфе"];

        PhraseService.doAction = function (action, data) {
            switch (action) {
                case 'addToRules':
                    $rootScope.$broadcast('AddToRuleGroupEvent', data);
                    break;
                case 'createGroup':
                    $rootScope.$broadcast('CreateGroupEvent', data);
                    break;
                case 'addGroupConditions':
                    $rootScope.$broadcast('AddGroupConditions', data);
                    break;
            }
        };

        PhraseService.loadPhrases = function (subject, callback) {
            $http.get("/local/keywords/data/" + subject + "/phrases.json").success(function (phrasesResp) {
                var phrases = [];
                for (var i in phrasesResp) {
                    var phrase = phrasesResp[i],
                        words = replaceGeo(phrase.text).split(" ");

                    for (var k = 0; k < words.length; k++) {

                        words[k] = {id: self.wordIndex++, text: words[k]};
                    }
                    phrase.words = words;
                    phrases.push(phrase);
                }
                phrases.sort(function (p1, p2) {
                    return p1.text.localeCompare(p2.text);
                });
                for (var i in phrases) {
                    phrases[i].index = i;
                }
                callback(phrases);
            });

            function replaceGeo(phraseText) {
                for (var i = 0; i < cityShortcuts.length; i++) {
                    if (phraseText.indexOf(cityShortcuts[i]) !== -1) {
                        phraseText = phraseText.replace(cityShortcuts[i], cityShortcuts[i].ucFirst());
                    }
                }
                return phraseText;
            }
        }

        PhraseService.filterPhrases = function (phrases, ruleGroups) {
            var filteredPhrases = [],
                deletedPhrases = [];
            for (var i = 0; i < phrases.length; i++) {
                var phrase = phrases[i],
                    include = true,
                    matchedGroupTitle = false;

                for (var j = 0; j < ruleGroups.length; j++) {
                    var ruleGroup = ruleGroups[j];

                    for (var z = 0; z < ruleGroup.items.length; z++) {
                        var rule = ruleGroup.items[z];
                        if (ConditionService.check(rule.condition_type, phrase.text, rule.text)) {
                            include = ruleGroup.type == "include";
                            matchedGroupTitle = ruleGroup.title + " | " + rule.text + " | ";
                            break;
                        }
                    }
                }

                if (include) {
                    filteredPhrases.push(phrase);
                } else {
                    phrase.text = matchedGroupTitle + phrase.text;
                    deletedPhrases.push(phrase);
                }
            }
            return {filtered: filteredPhrases, deleted: deletedPhrases};
        }

        PhraseService.groupPhrases = function (phrases, groups) {
            var resultGroups = [{id: "default", title: "По умолчанию", sort: 1, items: []}],
                phrases = phrases.slice();

            for (var j = 0; j < groups.length; j++) {
                var group = groups[j],
                    newItems = [];

                if (!group.items) {
                    continue;
                }

                for (var i = 0; i < phrases.length; i++) {
                    var phrase = phrases[i];

                    for (var z = 0; z < group.items.length; z++) {
                        var item = group.items[z];
                        if (ConditionService.check(item.condition_type, phrase.text, item.text)) {
                            var t = phrases.splice(i--, 1)[0];
                            newItems.push(t);
                            break;
                        }
                    }
                }

                if (newItems.length) {
                    resultGroups.push({id: group.id, title: group.title, sort: group.sort, items: newItems});
                }
            }

            resultGroups[0].items = phrases;
            return resultGroups;
        }

        PhraseService.searchOnServer = function (phrase) {
            $.post('/local/keywords/logic.php', {keyword: phrase, method: 'search_products'}, function (data) {
                var $modal = $("#search-modal"),
                    contentHtml = '<div class="content">';

                if (!$modal[0]) {
                    $modal = $('<div id="search-modal" class="ui modal"></div>');
                }

                if (!data) {
                    contentHtml += "Ничего не найдено...";
                } else {
                    contentHtml += data.map(function (item, i) {
                        return "<p>" + (i+1) + ") " + item + "</p>";
                    }).join("\n");
                }
                contentHtml += '</div>';
                $modal.html(contentHtml);
                $modal.modal('show');
            }, "json");
        }

        return PhraseService;
    }

    a.module(appId).factory('PhraseService', PhraseService)
})(angular);