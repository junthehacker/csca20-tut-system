const app = new Vue({
    el: '#app',
    data: {
        questionConfig: QUESTION_CONFIGURATION,
        testCases: [],
    },
    methods: {
        getParsedInput(input) {
            let inputs      = input.split(',');
            let parsedInput = [];
            if (inputs.length !== this.questionConfig.inputs.length) {
                return false;
            }
            for (const inputType of this.questionConfig.inputs) {
                const currInput = inputs.shift().trim();
                if (inputType === 'boolean') {
                    if (currInput === 'true') {
                        parsedInput.push(true);
                    } else if (currInput === 'false') {
                        parsedInput.push(false);
                    } else {
                        return false;
                    }
                } else if (inputType === 'integer') {
                    const int = parseInt(currInput);
                    if (isNaN(int)) {
                        return false;
                    } else {
                        parsedInput.push(int);
                    }
                } else if (inputType === 'float') {
                    const float = parseFloat(currInput);
                    if (isNaN(float)) {
                        return false;
                    } else {
                        parsedInput.push(float);
                    }
                } else if (inputType === 'string') {
                    parsedInput.push(currInput);
                } else {
                    return false;
                }
            }
            return parsedInput;
        },
        runAlgorithm(input) {
            if(this.getParsedInput(input)) {
                return this.questionConfig.algorithm(...this.getParsedInput(input));
            } else {
                return "Invalid Input.";
            }
        },
        addTestCase() {
            this.testCases.push({
                input: "",
                expectedOutput: "",
            })
        },
        deleteTestCase(testCase) {
            this.testCases.splice(this.testCases.indexOf(testCase), 1);
        },
        getSaveData() {
            return JSON.stringify(this.testCases);
        }
    }
});
