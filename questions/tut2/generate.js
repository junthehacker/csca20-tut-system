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

const TEMPLATE_HEAD_B = `
<!-- This is generated code, please do not change!!! -->
<% include ../partials/head.ejs %>

<div class="container-fluid pt-2">
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

const TEMPLATE_TAIL_B = `
    </div>
        <% include partials/answerSectionB.ejs %>
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
        // Match the rest
    } else if (file.match(/question[0-9]+\.html/)) {
        let content     = fs.readFileSync(file).toString('utf-8');
        let description = content.split('<!--        START ADDING YOUR DESCRIPTION HERE-->')[1];
        description     = description.split('<!--        STOP HERE-->')[0];
        let algorithm   = content.split('<!--        START ADDING YOUR CODE HERE-->')[1];
        algorithm       = algorithm.split('<!--        STOP HERE-->')[0];
        fs.writeFileSync("generated/" + file.split('.')[0] + ".ejs", TEMPLATE_HEAD_B + description + TEMPLATE_TAIL_B);
    }
}
