(function (a) {
    function ResultsCtrl($scope, $timeout, PhraseService) {
        var self = this;
        self.itemGroups = [];
        self.scope = $scope;
        self.scope.selectedItems = {};
        self.state = 'default';

        self.topBarData = {
            title: "Результаты",
            dropdown_menu: [
                {action: false, title: 'Добавить в правила:', items: []},
                {title: 'Создать группу', icon: 'write', action: "createGroup"},
                {title: 'Добавить в группу', icon: 'add', action: "addToGroup"},
            ]
        };

        self.itemsLength = function () {
            return $scope.filteredPhrases.length;
        }

        self.scope.$watchCollection('selectedItems', function (newItems, oldItems, scope) {
            self.state = Object.keys(newItems).length == 0 ? 'default' : 'active';
        });

        self.scope.$on('ResultPhraseGroupsChanged', function (e, data) {
            self.itemGroups = data.groups;
            self.itemGroups.push({title: "Удаленные", id:"deleted", items: data.deleted.sort(function (a, b) {
                return a.text.localeCompare(b.text);
            })});
        });

        self.wordIndex = 0;
        for (var j in self.itemGroups) {
            var t = self.itemGroups[j].items;
            for (var i in t) {
                var words = t[i].text.split(" ");

                for (var k = 0; k < words.length; k++) {
                    words[k] = {id: self.wordIndex++, text: words[k]};
                }
                t[i].words = words;
            }
        }

        self.doAction = function (action, data) {
            var data = data || {};
            data.items = self.scope.selectedItems;
            PhraseService.doAction(action, data);
            self.cancelSelection();
        }

        /*$http.get("/local/keywords/data/cnd-source-phrases.json").success(function (phrasesResp) {
         for (var i in phrasesResp) {
         var phrase = phrasesResp[i];
         scope.phrases.push({words: phrase.text.split(" "), shows: phrase.shows});
         }
         });*/

        // logic with custom selection
        self.onMouseUp = function (e) {
            var selection = window.getSelection(),
                selectedText = selection.toString();
            if (/*!e.shiftKey ||*/ selection.type !== "Range") {
                return true;
            } else {
                // search on server
                if (e.shiftKey) {
                    self.searchOnServer(selectedText);
                    return false;
                } else if (selectedText.indexOf(" ") === -1) {
                    return false;
                }
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

            $words.remove();

            var text = words.join(" "),
                splitItems = text.split(selectedText);
            $timeout(function () {
                var words = [];
                words.push({id: self.wordIndex++, text: splitItems[0]});
                self.scope.selectedItems[self.wordIndex] = selectedText;
                words.push({id: self.wordIndex++, text: selectedText});
                words.push({id: self.wordIndex++, text: splitItems[1]});
                self.phrases[phraseIndex].words = words;
            });
        }

        self.searchOnServer = function (phrase) {
            $.post('/local/scripts/keywordshelper.php', {keyword: phrase}, function (data) {
                var $modal = $("#search-modal");
                if (!$modal[0]) {
                    $modal = $('<div id="search-modal" class="ui modal"></div>');
                }
                var contentHtml = '<div class="content">';
                if (!data) {
                    contentHtml += "Ничего не найдено...";
                } else {
                    for (var i = 0; i < data.length; i++) {
                        contentHtml += "<p>" + data[i] + "</p>";
                    }
                }
                contentHtml += '</div>';
                $modal.html(contentHtml);
                $modal.modal('show');
            }, "json");
        }
    }

    ResultsCtrl.prototype.selectedItemsCount = function () {
        return Object.keys(this.scope.selectedItems).length;
    }

    ResultsCtrl.prototype.cancelSelection = function () {
        this.scope.selectedItems = {};
        //this.topBarData.state = 'default';
    }

    ResultsCtrl.prototype.toggleWord = function (event, el) {
        if (event.shiftKey) {
            return true;
        }

        var id = el.word.id;
        if (id in this.scope.selectedItems) {
            delete this.scope.selectedItems[id];
        } else {
            this.scope.selectedItems[id] = el.word.text;
        }
        //this.topBarData.state = this.scope.selectedItemsCount() == 0 ? 'default' : 'active';
    }

    a.module(appId).controller('ResultsCtrl', ResultsCtrl);
})(angular);