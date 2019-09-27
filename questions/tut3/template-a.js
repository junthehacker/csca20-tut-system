const app = new Vue({
    el: '#app',
    data: {
        questionConfig: QUESTION_CONFIGURATION,
        studentAnswer: [],
        currentLine: "",
        hasError: false,
    },
    methods: {
        submitCurrentLine() {
            const correctLine = this.questionConfig.answer[this.studentAnswer.length];
            if (correctLine !== this.currentLine) {
                this.hasError = true;
            } else {
                this.hasError = false;
                this.studentAnswer.push(this.currentLine);
                this.currentLine = "";
            }
        }
    }
});
