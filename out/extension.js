"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
// called when vs code is activated
function activate(context) {
    // vscode에 출력할 message decorate 설정
    const decorationType = vscode.window.createTextEditorDecorationType({
        borderWidth: '1px',
        borderStyle: 'solid',
        overviewRulerColor: 'blue',
        overviewRulerLane: vscode.OverviewRulerLane.Right,
        light: {
            // this color will be used in light color themes
            borderColor: 'darkblue'
        },
        dark: {
            // this color will be used in dark color themes
            borderColor: 'lightblue'
        }
    });
    // 현재 사용중인 text editor
    let activeEditor = vscode.window.activeTextEditor;
    // macro 이름 저장(macro side effect 검사 위해)
    let macroName;
    // plugin 실행했을 때 실행되는 메소드
    let disposable = vscode.commands.registerCommand('extension.CLint', () => {
        // The code you place here will be executed every time your command is executed
        // 검사 시작
        startChecking();
        // Display a message box to the user
        // 잘 작동되는지 확인하는 message 출력
        vscode.window.showInformationMessage('Hello from Clint!');
    });
    context.subscriptions.push(disposable);
    function startChecking() {
        if (!activeEditor) {
            return;
        }
        let decorate = [];
        // 유저가 설정한 정규 표현식에 대항하는 코드가 있는지 검사
        unsignedIntegerWrap(decorate);
        //signedIntegerOverflow(decorate);
        assignmentInIfstatement(decorate);
        assignmentInWhilestatement(decorate);
        sideEffectOnIfstatement(decorate);
        sideEffectOnWhilestatement(decorate);
        sideEffectOnSizeof(decorate);
        checkMacro(decorate);
        // vscode에 updateDecorations()에서 설정한 decorate 출력
        activeEditor.setDecorations(decorationType, decorate);
    }
    // L1 = High severity
    // L2 = Medium severity
    // L3 = Low severity
    // check assignments in statements
    // CERT EXP45-C - Do not perform assignments in selection statements
    // Priority P6, Level L2
    // if statement
    function assignmentInIfstatement(decorate) {
        let regEx = /if\([^=!<>\r\n]*=[^=\r\n]+[^\r\n]*\)/g;
        let hoverMessage = '(EXP45-C)Recommend to change \'=\' to \'==\'';
        updateDecorations(regEx, hoverMessage, decorate);
    }
    // while statement
    function assignmentInWhilestatement(decorate) {
        let regEx = /while\([^=!<>\r\n]*=[^=\r\n]+[^\r\n]*\)/g;
        let hoverMessage = '(EXP45-C)Recommend to change \'=\' to \'==\'';
        updateDecorations(regEx, hoverMessage, decorate);
    }
    // check unsigned integer wrap(unsigned integer에는 overflow가 없음)
    // CERT INT30-C
    // Priority P9, Level L2
    function unsignedIntegerWrap(decorate) {
        let regEx = /(unsigned)\s+(int)\s+[_a-zA-Z0-9]+\s*([-+*]|(<<))=|(unsigned)\s+(int)\s+[_a-zA-Z0-9]+\s*=\s*[_a-zA-Z0-9]+\s*([-+*]+|(<<))/g;
        let hoverMessage = '(INT30-C) Ensure that unsigned integer operations do not wrap. You should check';
        updateDecorations(regEx, hoverMessage, decorate);
    }
    // check side effect on if statement(shortcut evaluation) -> while문도 작성필요?
    // CERT EXP30-C
    // Priority P8, Level L2
    // ||, && operator
    function sideEffectOnIfstatement(decorate) {
        // if statement
        let regEx = /if ?\(([^\r\n])*((\|\|)|(\&\&))([^\r\n]*)\)/g;
        let hoverMessage = '(EXP30-C)(shortcut evaluation) If Right-hand side of \'||\', \'&&\' has side effect, it may not be executed';
        updateDecorations(regEx, hoverMessage, decorate);
    }
    function sideEffectOnWhilestatement(decorate) {
        // while statement
        let regEx = /while ?\(([^\r\n])*((\|\|)|(\&\&))([^\r\n]*)\)/g;
        let hoverMessage = '(EXP30-C)(shortcut evaluation) If Right-hand side of \'||\', \'&&\' has side effect, it may not be executed';
        updateDecorations(regEx, hoverMessage, decorate);
    }
    // check side effect on sizeof()
    // CERT EXP44-C
    // Priority P3, Level L3
    function sideEffectOnSizeof(decorate) {
        let regEx = /sizeof\([^=!<>\r\n]*[-*+<>]/g;
        let hoverMessage = '(EXP44-C) Do not rely on side effects in operands to sizeof';
        updateDecorations(regEx, hoverMessage, decorate);
    }
    // check side effect on macro
    // CERT PRI31-C
    // Priority P3, Level L3
    // macro의 경우에는 사용자가 이름을 정하기 때문에 정해진 이름이 없다. 
    // 따라서 macro 정의부분에서 macro 이름을 얻어오고, 이후 코드에서 사용되는 같은 이름의 macro에 대해 검사
    function checkMacro(decorate) {
        let regEx = /#define\s+[_a-zA-Z0-9]+/g;
        let hoverMessage = '';
        // 1. macro 이름 얻기(updateDecorations 메소드의 temp parameter에 1을 넣어 macro이름을 얻는 동작이라고 전달)
        // temp parameter가 0이면 일반적인 동작(vscode에 message 띄우기)
        updateDecorations(regEx, hoverMessage, decorate, 1);
        // 2. macro에 대해 주의할 사항 띄우기
        sideEffectOnMacro(decorate);
    }
    function sideEffectOnMacro(decorate) {
        let regEx = new RegExp(`${macroName}`, 'g');
        let hoverMessage = '(PRI31-C) Avoid side effects in arguments to unsafe macros';
        updateDecorations(regEx, hoverMessage, decorate);
    }
    // vscode에 표시할 메시지(decorate) 설정
    function updateDecorations(regEx, hoverMessage, decorate, temp = 0) {
        if (!activeEditor) {
            return;
        }
        const text = activeEditor.document.getText();
        let match;
        // 주어진 regular expression에 매칭되는 문자열이 있는지 코드 시작(startPos)부터 끝(endPos)까지 검사
        while ((match = regEx.exec(text))) {
            // macro 이름 얻어오는 동작일 때 macroName 변수에 macro 이름 저장
            if (temp == 1) {
                macroName = match[0].replace("#define", "").trim();
                console.log(macroName);
            }
            // macro 이름을 얻는 동작이아닐 때
            if (temp != 1) {
                const startPos = activeEditor.document.positionAt(match.index);
                const endPos = activeEditor.document.positionAt(match.index + match[0].length);
                // 스캔 범위(range)와 마우스를 올렸을때(hover) 나오는 message 설정
                const decoration = {
                    'range': new vscode.Range(startPos, endPos),
                    'hoverMessage': hoverMessage,
                };
                decorate.push(decoration);
            }
        }
    }
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map