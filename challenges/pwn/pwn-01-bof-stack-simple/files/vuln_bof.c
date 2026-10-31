#include <stdio.h>
#include <stdlib.h>

void print_flag() {
    printf("CYBERLAB{BUFFER_OVERFLOW_STACK_CORRUPTION_RIP_REDIRECTED_881}\n");
    exit(0);
}

void vulnerable_function() {
    char buffer[64];
    printf("Entrez votre saisie: ");
    gets(buffer); // VULNERABLE: buffer overflow
}

int main() {
    setvbuf(stdout, NULL, _IONBF, 0);
    vulnerable_function();
    return 0;
}
