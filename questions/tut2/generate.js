const path = require('path');
const fs   = require('fs');
const util = require('util');

const files = fs.readdirSync(__dirname);

const TEMPLATE_HEAD = `
<!-- This is generated code, please do not change!!! -->
<% include ../partials/head.ejs %>

<div class="container pt-2">
    <% include ../partials/questionNav.ejs %>
    <% include ../partials/pairSessionInfo.ejs %>
    <div class="row">
        <div class="col-md-6">
            <h3>Question</h3>
`;


const TEMPLATE_TAIL = `
    </div>
        <% include partials/answerSection.ejs %>
    </div>

</div>

<% include ../partials/foot.ejs %>
`;

for (const file of files) {
    // Match q1-5
    if (file.match(/question[1-5]+\.html/)) { // Only match qXX.html files
        let content = fs.readFileSync(file).toString('utf-8');
        content     = content.split('<!--        START ADDING YOUR CODE HERE-->')[1];
        content     = content.split('<!--        STOP HERE-->')[0];
        fs.writeFileSync("generated/" + file.split('.')[0] + ".ejs", TEMPLATE_HEAD + content + TEMPLATE_TAIL);
    }
}
