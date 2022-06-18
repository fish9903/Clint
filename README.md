# Clinter for vscode
22-1 개별연구1

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
[https://code.visualstudio.com/api/working-with-extensions/publishing-extension](https://code.visualstudio.com/api/references/vscode-api)

[https://github.com/microsoft/vscode-extension-samples/tree/main/decorator-sample](https://github.com/microsoft/vscode-extension-samples/tree/main/decorator-sample)
