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
</div>

<script>
`;

const TEMPLATE_HEAD_B = `
<!-- This is generated code, please do not change!!! -->
<% include ../partials/head.ejs %>

<div class="container pt-2">
    <% include ../partials/questionNav.ejs %>
    <% include ../partials/pairSessionInfo.ejs %>
</div>

<script>
`;

const TEMPLATE_TAIL = `
</script>

<% include partials/answerSection.ejs %>

<% include ../partials/foot.ejs %>
`;

const TEMPLATE_TAIL_B = `
</script>

<% include partials/answerSectionB.ejs %>

<% include ../partials/foot.ejs %>
`;

for (const file of files) {
    // Match q1-5
    if (file.match(/question[1-5]+\.html/)) { // Only match qXX.html files
        let content = fs.readFileSync(file).toString('utf-8');
        content     = content.split('// START YOUR QUESTION CONFIG HERE')[1];
        content     = content.split('// END HERE')[0];
        fs.writeFileSync("generated/" + file.split('.')[0] + ".ejs", TEMPLATE_HEAD + content + TEMPLATE_TAIL);
        // Match the rest
    } else if (file.match(/question[0-9]+\.html/)) {
        let content = fs.readFileSync(file).toString('utf-8');
        content     = content.split('// START YOUR QUESTION CONFIG HERE')[1];
        content     = content.split('// END HERE')[0];
        fs.writeFileSync("generated/" + file.split('.')[0] + ".ejs", TEMPLATE_HEAD_B + content + TEMPLATE_TAIL_B);
    }
}
