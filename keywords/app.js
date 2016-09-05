var
    appId = 'keywords-app';

angular.module(appId, [
    'dndLists',
    //'ngResource',
    'ngRoute',
    //'io.dennis.contextmenu'
]);

function getSelectionItem() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}

function clearSelection() {
    if (window.getSelection) {
        if (window.getSelection().empty) {  // Chrome
            window.getSelection().empty();
        } else if (window.getSelection().removeAllRanges) {  // Firefox
            window.getSelection().removeAllRanges();
        }
    }
}

function removeProperties(object, properties) {
    if (!Array.isArray(properties) && typeof(properties) === "string") {
        properties = [properties];
    }

    for (var i in object) {
        if (properties.indexOf(i) !== -1) {
            delete object[i];
        } else if (typeof(object[i]) === "object") {
            object[i] = removeProperties(object[i], properties);
        }
    }
    return object;
}

String.prototype.ucFirst = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

/*
 $('.list')
 .visibility({
 once: false,
 observeChanges: true,
 onBottomVisible: function() {
 // loads a max of 5 times
 window.loadFakeContent();
 }
 })
 ;*/