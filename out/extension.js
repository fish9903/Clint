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
        assignmentInIfstatement(decorate);
        assignmentInWhilestatement(decorate);
        unsignedIntegerWrap(decorate);
        signedIntegerOverflow(decorate);
        sideEffectOnIfstatement(decorate);
        sideEffectOnWhilestatement(decorate);
        sideEffectOnSizeof(decorate);
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
        let regEx = /(unsigned)\s+(int)\s+[_a-zA-Z0-9]+\s*[-+*]=|(unsigned)\s+(int)\s+[_a-zA-Z0-9]+\s*(<<)=|(unsigned)\s+(int)\s+[_a-zA-Z0-9]+\s*=\s*[_a-zA-Z0-9]\s*[-+*]+/g;
        let hoverMessage = '(INT30-C) Ensure that unsigned integer operations do not wrap. You should check';
        updateDecorations(regEx, hoverMessage, decorate);
    }
    // check signed integer do not result in overflow
    // CERT INT32-C
    // Priority P9, Level L2
    function signedIntegerOverflow(decorate) {
        let regEx = /(int)\s+[_a-zA-Z0-9]+\s*[-+*]=|(int)\s+[_a-zA-Z0-9]+\s*(<<)=|(int)\s+[_a-zA-Z0-9]+\s*=\s*[_a-zA-Z0-9]\s*[-+*]+|(signed)\s+(int)\s+[_a-zA-Z0-9]+\s*[-+*]=|(signed)\s+(int)\s+[_a-zA-Z0-9]+\s*(<<)=|(signed)\s+(int)\s+[_a-zA-Z0-9]+\s*=\s*[_a-zA-Z0-9]\s*[-+*]+/g;
        let hoverMessage = '(INT32-C) Ensure that signed integer operations do not result in overflow. You should check';
        updateDecorations(regEx, hoverMessage, decorate);
    }
    // check side effect on if statement(shortcut evaluation) -> while문도 작성필요?
    // CERT EXP30-C
    // Priority P8, Level L2
    // ||, && operator
    function sideEffectOnIfstatement(decorate) {
        // if statement
        let regEx = /if ?\(([^\r\n])*(\|\|)([^\r\n]*)\)|if ?\(([^\r\n])*(\&\&)([^\r\n]*)\)/g;
        let hoverMessage = '(EXP30-C)(shortcut evaluation) If Right-hand side of \'||\', \'&&\' has side effect, it may not be executed';
        updateDecorations(regEx, hoverMessage, decorate);
    }
    function sideEffectOnWhilestatement(decorate) {
        // while statement
        let regEx = /while ?\(([^\r\n])*(\|\|)([^\r\n]*)\)|while ?\(([^\r\n])*(\&\&)([^\r\n]*)\)/g;
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
    // vscode에 표시할 메시지(decorate) 설정
    function updateDecorations(regEx = /^$/, hoverMessage = '', decorate) {
        if (!activeEditor) {
            return;
        }
        const text = activeEditor.document.getText();
        let match;
        // 주어진 regular expression에 매칭되는 문자열이 있는지 코드 시작(startPos)부터 끝(endPos)까지 검사
        while ((match = regEx.exec(text))) {
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
exports.activate = activate;
//# sourceMappingURL=extension.js.map