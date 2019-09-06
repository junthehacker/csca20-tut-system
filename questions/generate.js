const path = require('path');
const fs   = require('fs');
const util = require('util');

const files = fs.readdirSync(__dirname);

const TEMPLATE_HEAD = `
<!-- This is generated code, please do not change!!! -->
<% include ../partials/head.ejs %>

<div class="container pt-2">
    <% include ../partials/questionNav.ejs %>
`;

const TEMPLATE_TAIL = `
    <% include ../partials/questionChoices.ejs %>
</div>

<% include ../partials/foot.ejs %>
`;

for(const file of files) {
    if(file.match(/q[0-9]+\.html/)) { // Only match qXX.html files
        let content = fs.readFileSync(file).toString('utf-8');
        content = content.split('<!--        START ADDING YOUR CODE HERE-->')[1];
        content = content.split('<!--        STOP HERE-->')[0];
        fs.writeFileSync("generated/" + file.split('.')[0] + ".ejs", TEMPLATE_HEAD + content + TEMPLATE_TAIL);
    }
}
