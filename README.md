# Clinter for vscode
22-1 개별연구1

## Examples
consider side effects
- `if (a++ || b--)` ->  right handside of '||' may not be executed (shortcut evaluation)
- `sizeof(a + 1)` -> side effects in operands to sizeof

perform assignments in selection statements
- `if(a = 3)` -> recommend to change to `if(a == 3)`
- `while(b = a)` -> recommend to change to `while(b == a)`

# Coding Standards reference
https://wiki.sei.cmu.edu/confluence/display/seccode/SEI+CERT+Coding+Standards
