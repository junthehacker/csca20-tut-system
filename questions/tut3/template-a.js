const app = new Vue({
    el: '#app',
    data: {
        questionConfig: QUESTION_CONFIGURATION,
        currentSection: 0,
        studentAnswer: [],
        failedAttempts: [],
        currentLine: "",
        hasError: false,
    },
    methods: {
        submitCurrentLine() {
            if(!this.studentAnswer[this.currentSection]) {
                this.studentAnswer[this.currentSection] = [];
            }
            const correctLine = this.questionConfig.subsections[this.currentSection].answer[this.getAnswer(this.currentSection).length];
            if (correctLine !== this.currentLine) {
                this.hasError = true;
                if(!this.failedAttempts[this.currentSection]) {
                    this.failedAttempts[this.currentSection] = 1;
                } else {
                    this.failedAttempts[this.currentSection]++;
                }
            } else {
                this.hasError = false;
                this.studentAnswer[this.currentSection].push(this.currentLine);
                this.currentLine = "";
            }
        },
        getFailedAttempts(section) {
            if(!this.failedAttempts[this.currentSection]) {
                return 0;
            } else {
                return this.failedAttempts[this.currentSection];
            }
        },
        getAnswer(section) {
            if(this.studentAnswer[section]) {
                return this.studentAnswer[section];
            } else {
                return [];
            }
        }
    }
});
