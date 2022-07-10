# Clinter for vscode
22-1 개별연구1

□ 연구/개발의 목적은 사용자가 코드를 작성할 때 특정 언어에서 권장되는 혹은 사용자가 직접 지키고자 하는 코딩 스타일, 패턴을 지켰는지 검사함으로써, 올바른 코딩 습관을 지닐 수 있도록 함.

□ 특정 언어에서 권장하는 코딩 스타일을 따르지 않고 코드를 작성하면 오류가 발생할 수 있고, 오류가 발생하지 않아도 프로그램에 좋지 않은 영향을 줄 수 있다. 따라서 적절한 코딩 스타일을 따르는 것이 필요하다.

## Examples
1. Consider side effects
- `if (a++ || b--)` ->  right-hand side of '||' may not be executed (shortcut evaluation)
- `sizeof(a + 1)` -> side effects in operands to sizeof

![sideeffects1](/images/sideeffect_example1.png)

![sideeffects2](/images/sideeffect_example2.png)

2. Perform assignments in selection statements
- `if(a = 3)` -> recommend to change to `if(a == 3)`
- `while(b = a)` -> recommend to change to `while(b == a)`

![assignment1](/images/assignment_example1.png)

3. Unsigned integer wrap
- `unsigned int a = b + c` -> you should ensure that unsigned integer do not wrap

![unsignedInterger1](/images/unsignedInteger_example1.png)

4. Side effects in unsafe Macro
```
#define SQR(x) x*x;
...
a = SQR(a + 1); -> a can be unintended value

// a = a + 1;
// a = SQR(a); -> recommended
``` 

![macro1](/images/macro_example1.png)

<br />
<br />

# Coding Standards reference 
https://wiki.sei.cmu.edu/confluence/display/seccode/SEI+CERT+Coding+Standards

# Visual Code extension reference
https://code.visualstudio.com/api/references/vscode-api

https://github.com/microsoft/vscode-extension-samples/tree/main/decorator-sample
