export function renderTemplate(htmlTemplate, obj) {
    // Define a regular expression that matches "{{ prop_name }}"
    var myregex = /\{\{\s*(\w+)\s*\}\}/g;

    // Replace all occurrences of "{{ prop_name }}" with obj.prop_name
    var newHtml = htmlTemplate.replace(myregex, function (match, p1) {
        return obj[p1];
    });

    return newHtml;
}
