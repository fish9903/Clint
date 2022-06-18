#include <stdio.h>

#define SQR(x) (x * x)

int main() {
	int a = 1;
	int b = 2;
	char c = 'a';
	int size = sizeof(a + 1);

	unsigned int c2 = 2;
	unsigned int c = 1 + 2;
	
 	int m = SQR(a + 1);

	if((a == 1 && b == 2) || a++) {
		printf("%d\n", a);
	}
	else if (b == 1 && b--) {
		printf("%d\n", b);
	}
	else if(a = b) {
		a--;
	}

	while(c = 'a') {
		printf("%c", c);
		c++;
	}

	while(a && b++) {
		c--;
	}

	for(int i = 0; i = 10; i++) {
		printf("%d", i);
	}
}