export default class UIController {

    constructor(gameController) {
        this.gameController = gameController;
        this.setupEventListeners();
    }

    setupEventListeners() {
        const testButton = document.getElementById('testButton');
        if (testButton) {
            testButton.addEventListener('click', () => this.testButtonClick());
        }
    }

    testButtonClick() {
        console.log('beep')
    }
}
