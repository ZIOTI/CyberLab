// ============================================================================
// CYBERRANGE PRO - TERMINAL LINUX BASH DE ZÉRO À PRO (HAUTE FIDÉLITÉ)
// Support complet des commandes fondamentales : Navigation, Fichiers, Permissions,
// Paquets, Processus, Réseau, Pipes (|) et Autocomplétion TAB
// ============================================================================

class CyberTerminal {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.options = options;
    this.history = [];
    this.historyIndex = -1;
    this.currentPath = '/home/operator';
    this.isRoot = false;
    this.eUID = 1001; // 1001: operator, 0: root
    this.installedPackages = ['bash', 'coreutils', 'grep', 'sed', 'gawk', 'curl', 'ping'];

    // Arborescence du système de fichiers virtuel POSIX
    this.fs = {
      '/': ['bin', 'etc', 'home', 'var', 'opt', 'proc', 'tmp', 'root', 'usr'],
      '/bin': ['bash', 'sh', 'ls', 'cat', 'pwd', 'cd', 'mkdir', 'touch', 'cp', 'mv', 'rm', 'head', 'tail', 'wc', 'grep', 'find', 'curl', 'ping', 'ss', 'id', 'whoami', 'uname', 'hostname', 'clear', 'echo', 'chmod', 'chown'],
      '/usr': ['bin', 'local', 'share'],
      '/usr/bin': ['python3', 'python3.10', 'nmap', 'dig', 'nslookup', 'base64', 'which', 'top', 'ps', 'kill'],
      '/etc': ['passwd', 'shadow', 'hosts', 'crontab', 'resolv.conf', 'os-release', 'apt'],
      '/etc/apt': ['sources.list'],
      '/etc/apt/sources.list': 'deb http://deb.debian.org/debian bookworm main\ndeb http://security.debian.org/debian-security bookworm-security main\n',
      '/etc/passwd': 'root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\noperator:x:1001:1001:Apprenant Cyber:/home/operator:/bin/bash\nwww-data:x:33:33:Serveur Web Apache:/var/www:/usr/sbin/nologin\n',
      '/etc/shadow': 'root:$6$salt$Z4mK9...:19000:0:99999:7:::\noperator:$6$vX982mP$K9vX...:19000:0:99999:7:::\n',
      '/etc/hosts': '127.0.0.1 localhost aegis.local\n192.168.1.1 routeur.local\n192.168.10.5 ns1.infra.aegis.local\n',
      '/etc/resolv.conf': 'nameserver 127.0.0.53\nsearch aegis.local\n',
      '/etc/os-release': 'NAME="Debian GNU/Linux"\nVERSION="12 (bookworm)"\nID=debian\n',
      '/etc/crontab': '# /etc/crontab: system-wide crontab\nSHELL=/bin/sh\nPATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin\n* * * * * root /opt/maintenance/cleanup.sh\n',
      '/home': ['operator'],
      '/home/operator': ['notes.txt', '.bashrc', '.bash_history', 'projet_secret'],
      '/home/operator/notes.txt': 'BIENVENUE DANS TON LAB CYBER :\n- Le terminal est ton outil n°1.\n- Utilise pwd pour savoir où tu es, ls pour voir les fichiers, cd pour te déplacer.\n- La curiosité est la clé de tout apprentissage !\n',
      '/home/operator/.bashrc': '# ~/.bashrc\nexport PATH=$PATH:/usr/local/bin\nalias ll="ls -la"\n',
      '/home/operator/.bash_history': 'pwd\nls -la\ncat notes.txt\n',
      '/home/operator/projet_secret': ['flag_novice.txt'],
      '/home/operator/projet_secret/flag_novice.txt': 'CYBER{LINUX_NAVIGATOR_LEVEL_COMPLETED}\n',
      '/opt': ['maintenance', 'telemetry'],
      '/opt/maintenance': ['cleanup.sh'],
      '/opt/maintenance/cleanup.sh': '#!/bin/bash\n# Script de maintenance execute par root chaque minute\nrm -rf /tmp/cache/*\n',
      '/opt/telemetry': ['beacon.sh'],
      '/var': ['log', 'www'],
      '/var/log': ['nginx', 'auth.log', 'syslog', 'incident'],
      '/var/log/incident': ['report.log', '.forensic_case'],
      '/var/log/incident/report.log': '[SOC INCIDENT REPORT #2026-9041]\nTimestamp: 2026-10-27T10:14:02Z\nVector: Unauthorized SSH session\nAlert: Forensic evidence stored in hidden casefile\nStatus: UNRESOLVED\n',
      '/var/log/incident/.forensic_case': '[EVIDENCE ARTEFACT]\nCASE_ID: #AEGIS-INC-9942\nMD5: 8f4b1192e27c1a\nFLAG: CYBER{LINUX_MID_EVAL_FORENSIC_MASTERED}\nNOTE: Threat actor traced to internal gateway.\n',
      '/var/log/auth.log': 'Oct 27 08:12:01 aegis-server CRON[4102]: (root) CMD (/opt/maintenance/cleanup.sh)\nOct 27 08:14:22 aegis-server sshd[4150]: Accepted password for operator from 192.168.1.42\n',
      '/var/log/nginx': ['access.log', 'error.log'],
      '/var/log/nginx/access.log': '192.168.1.42 - - [27/Oct/2026:08:15:10] "GET / HTTP/1.1" 200 42\n192.168.1.42 - - [27/Oct/2026:08:16:00] "GET /robots.txt HTTP/1.1" 200 128 FLAG=CYBER{HTTP_GET_ROBOTS_TXT_FOUND}\n',
      '/tmp': ['cache'],
      '/root': ['flag.txt', 'final_flag.txt'],
      '/root/flag.txt': 'CYBER{SUID_BINARY_GTFOBINS_EUID_ZERO_ROOT}',
      '/root/final_flag.txt': 'CYBER{M5_BOSS_ROOT_COMPROMISE_FINAL_FLAG}'
    };

    // Table de permissions simulée
    this.permissions = {
      '/home/operator/notes.txt': '-rw-r--r--',
      '/home/operator/projet_secret': 'drwxr-xr-x',
      '/var/log/incident': 'drwxr-xr-x',
      '/var/log/incident/report.log': '-rw-r--r--',
      '/var/log/incident/.forensic_case': '-rw-r--r--',
      '/etc/passwd': '-rw-r--r--',
      '/etc/shadow': '-rw-r-----',
      '/opt/maintenance/cleanup.sh': '-rwxrwxrwx',
      '/usr/bin/find': '-rwsr-xr-x'
    };

    this.render();
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = `
      <div class="cyber-terminal-wrapper">
        <div class="terminal-header">
          <div class="terminal-dots">
            <span class="dot red"></span>
            <span class="dot yellow"></span>
            <span class="dot green"></span>
          </div>
          <div class="terminal-title" id="term-title-label">operator@cyberlab:~ (bash v5.2)</div>
          <button class="btn-duo-3d btn-duo-slate text-[10px] py-1 px-3" id="btn-term-clear">Effacer</button>
        </div>
        <div class="terminal-body" id="term-body">
          <div class="text-cyan-400 font-bold mb-1 font-mono text-xs">CYBERLAB LINUX TERMINAL // ENVIRONNEMENT RÉEL</div>
          <div class="text-slate-400 text-[11px] mb-3 font-mono">Tape <span class="text-yellow-400 font-bold">help</span> pour afficher la boîte à outils. Support complet des touches Flèche Haut/Bas et Tabulation.</div>
          <div id="term-output"></div>
          <div class="terminal-prompt-line">
            <span class="terminal-prompt" id="term-prompt-label">operator@cyberlab:~$</span>
            <input type="text" class="terminal-input" id="term-input" autocomplete="off" spellcheck="false" placeholder="Tape une commande (ex: whoami, pwd, ls, cat)..." />
          </div>
        </div>
      </div>
    `;

    this.outputElement = document.getElementById('term-output');
    this.inputElement = document.getElementById('term-input');
    const termBody = document.getElementById('term-body');

    termBody.addEventListener('click', () => this.inputElement.focus());
    document.getElementById('btn-term-clear')?.addEventListener('click', () => this.clear());

    this.inputElement.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = this.inputElement.value.trim();
        if (cmd) {
          this.history.push(cmd);
          this.historyIndex = this.history.length;
          this.executePipeline(cmd);
          this.inputElement.value = '';
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (this.historyIndex > 0) {
          this.historyIndex--;
          this.inputElement.value = this.history[this.historyIndex];
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (this.historyIndex < this.history.length - 1) {
          this.historyIndex++;
          this.inputElement.value = this.history[this.historyIndex];
        } else {
          this.historyIndex = this.history.length;
          this.inputElement.value = '';
        }
      } else if (e.key === 'Tab') {
        e.preventDefault();
        this.handleTabCompletion();
      }
    });
  }

  handleTabCompletion() {
    const val = this.inputElement.value;
    const parts = val.split(' ');
    const lastWord = parts[parts.length - 1];
    if (!lastWord) return;

    const currentFiles = this.fs[this.currentPath] || [];
    const commands = ['whoami', 'hostname', 'uname', 'pwd', 'ls', 'cd', 'mkdir', 'touch', 'cp', 'mv', 'rm', 'cat', 'head', 'tail', 'wc', 'grep', 'find', 'chmod', 'chown', 'apt', 'which', 'ps', 'kill', 'ping', 'curl', 'dig', 'nslookup', 'ss', 'nmap', 'clear', 'echo', 'help'];
    const candidates = [...commands, ...currentFiles].filter(c => c.startsWith(lastWord));

    if (candidates.length === 1) {
      parts[parts.length - 1] = candidates[0];
      this.inputElement.value = parts.join(' ') + (commands.includes(candidates[0]) ? ' ' : '');
    }
  }

  print(html, isCommand = false) {
    if (!this.outputElement) return;
    const line = document.createElement('div');
    line.className = isCommand ? 'terminal-line-cmd my-1 font-bold' : 'terminal-line-out text-slate-300 font-mono text-xs my-0.5 leading-relaxed';
    line.innerHTML = html;
    this.outputElement.appendChild(line);

    const termBody = document.getElementById('term-body');
    if (termBody) termBody.scrollTop = termBody.scrollHeight;
  }

  clear() {
    if (this.outputElement) this.outputElement.innerHTML = '';
  }

  getPrompt() {
    const user = this.isRoot ? 'root' : 'operator';
    const symbol = this.isRoot ? '#' : '$';
    const folder = this.currentPath === '/home/operator' ? '~' : this.currentPath;
    return `${user}@cyberlab:${folder}${symbol}`;
  }

  updatePromptUI() {
    const promptLabel = document.getElementById('term-prompt-label');
    const titleLabel = document.getElementById('term-title-label');
    if (promptLabel) {
      promptLabel.innerText = this.getPrompt();
      promptLabel.className = this.isRoot ? 'terminal-prompt text-rose-500 font-black' : 'terminal-prompt text-emerald-400 font-black';
    }
    if (titleLabel) {
      titleLabel.innerText = this.isRoot ? 'root@cyberlab:~ (root shell eUID 0)' : 'operator@cyberlab:~ (bash v5.2)';
    }
  }

  executePipeline(rawCmd) {
    if (window.cyberAudio) window.cyberAudio.playTactileClick();
    this.print(`<span class="${this.isRoot ? 'text-rose-500 font-black' : 'text-emerald-400 font-black'}">${this.getPrompt()}</span> <span class="text-white font-mono font-semibold">${this.escapeHTML(rawCmd)}</span>`, true);

    const pipeSegments = rawCmd.split('|').map(s => s.trim());
    let currentOutput = null;

    for (let i = 0; i < pipeSegments.length; i++) {
      const seg = pipeSegments[i];
      currentOutput = this.executeSingleCommand(seg, currentOutput);
      if (currentOutput === null) break;
    }

    if (currentOutput !== null && currentOutput !== '') {
      this.print(`<pre class="text-slate-300 font-mono text-xs">${this.escapeHTML(currentOutput)}</pre>`);
    }
  }

  executeSingleCommand(cmdStr, inputPipe = null) {
    const parts = cmdStr.split(/\s+/).filter(Boolean);
    if (!parts.length) return '';
    const cmd = parts[0];
    const args = parts.slice(1);

    switch (cmd) {
      case 'help':
        return `🛠️ COMMANDES LINUX & RÉSEAU DISPONIBLES :
• Identité & Système : whoami, hostname, uname, id, pwd
• Navigation : ls, ls -la, cd <dossier>, cd ..
• Manipulation de Fichiers : touch, mkdir, cp, mv, rm, cat, head, tail, wc
• Recherche & Filtres : grep <mot>, find <dossier>, pipes (|)
• Permissions : chmod <droits> <fichier>, chown
• Gestion des Paquets : apt update, apt install <paquet>, which <programme>
• Processus : ps aux, top, kill <pid>
• Réseau : ping <hôte>, curl <url>, dig <domaine>, ss -tlpn, nmap <cible>`;

      case 'clear':
        this.clear();
        return '';

      case 'whoami':
        return this.isRoot ? 'root' : 'operator';

      case 'hostname':
        return 'cyberlab-workstation';

      case 'uname':
        if (args.includes('-a')) {
          return 'Linux cyberlab-workstation 6.1.0-21-amd64 #1 SMP PREEMPT_DYNAMIC Debian 6.1.90-1 x86_64 GNU/Linux';
        }
        return 'Linux';

      case 'id':
        return this.isRoot 
          ? 'uid=0(root) gid=0(root) groups=0(root)' 
          : 'uid=1001(operator) gid=1001(operator) groups=1001(operator),27(sudo)';

      case 'pwd':
        return this.currentPath;

      case 'ls': {
        const isAll = args.includes('-a') || args.includes('-la') || args.includes('-al');
        const isLong = args.includes('-l') || args.includes('-la') || args.includes('-al');
        const targetDirArg = args.find(a => !a.startsWith('-')) || this.currentPath;

        let normalized = targetDirArg;
        if (!normalized.startsWith('/')) {
          normalized = this.currentPath === '/' ? '/' + normalized : this.currentPath + '/' + normalized;
        }

        const entries = this.fs[normalized];
        if (!entries || !Array.isArray(entries)) {
          return `ls: cannot access '${targetDirArg}': No such file or directory`;
        }

        let displayed = [...entries];
        if (isAll) {
          displayed = ['.', '..', ...displayed];
        }

        if (isLong) {
          return displayed.map(item => {
            const fullItemPath = normalized === '/' ? '/' + item : normalized + '/' + item;
            const isDir = Array.isArray(this.fs[fullItemPath]);
            const perm = this.permissions[fullItemPath] || (isDir ? 'drwxr-xr-x' : '-rw-r--r--');
            const owner = fullItemPath.startsWith('/root') ? 'root root' : 'operator operator';
            const size = isDir ? '4096' : (typeof this.fs[fullItemPath] === 'string' ? this.fs[fullItemPath].length : '1024');
            return `${perm} 1 ${owner} ${size.toString().padStart(6)} Oct 27 10:00 ${item}`;
          }).join('\n');
        }

        return displayed.join('   ');
      }

      case 'cd': {
        const dest = args[0] || '/home/operator';
        if (dest === '~') {
          this.currentPath = '/home/operator';
          this.updatePromptUI();
          return '';
        }
        if (dest === '..') {
          if (this.currentPath !== '/') {
            const segments = this.currentPath.split('/').filter(Boolean);
            segments.pop();
            this.currentPath = '/' + segments.join('/');
          }
          this.updatePromptUI();
          return '';
        }
        if (dest === '/') {
          this.currentPath = '/';
          this.updatePromptUI();
          return '';
        }

        let normalized = dest.startsWith('/') ? dest : (this.currentPath === '/' ? '/' + dest : this.currentPath + '/' + dest);
        if (this.fs[normalized] && Array.isArray(this.fs[normalized])) {
          if (normalized.startsWith('/root') && !this.isRoot) {
            return `bash: cd: ${dest}: Permission denied`;
          }
          this.currentPath = normalized;
          this.updatePromptUI();
          return '';
        }
        return `bash: cd: ${dest}: No such file or directory`;
      }

      case 'mkdir': {
        const dirName = args[0];
        if (!dirName) return 'mkdir: missing operand';
        const full = dirName.startsWith('/') ? dirName : (this.currentPath === '/' ? '/' + dirName : this.currentPath + '/' + dirName);
        if (this.fs[full]) return `mkdir: cannot create directory '${dirName}': File exists`;
        this.fs[full] = [];
        const parent = this.currentPath;
        if (this.fs[parent]) this.fs[parent].push(dirName);
        return '';
      }

      case 'touch': {
        const fileName = args[0];
        if (!fileName) return 'touch: missing file operand';
        const full = fileName.startsWith('/') ? fileName : (this.currentPath === '/' ? '/' + fileName : this.currentPath + '/' + fileName);
        if (!this.fs[full]) {
          this.fs[full] = '';
          const parent = this.currentPath;
          if (this.fs[parent] && !this.fs[parent].includes(fileName)) this.fs[parent].push(fileName);
        }
        return '';
      }

      case 'cp': {
        const src = args[0];
        const dest = args[1];
        if (!src || !dest) return 'cp: missing file operand';
        const fullSrc = src.startsWith('/') ? src : (this.currentPath === '/' ? '/' + src : this.currentPath + '/' + src);
        const fullDest = dest.startsWith('/') ? dest : (this.currentPath === '/' ? '/' + dest : this.currentPath + '/' + dest);
        if (this.fs[fullSrc]) {
          this.fs[fullDest] = this.fs[fullSrc];
          if (this.fs[this.currentPath] && !this.fs[this.currentPath].includes(dest)) this.fs[this.currentPath].push(dest);
          return '';
        }
        return `cp: cannot stat '${src}': No such file or directory`;
      }

      case 'mv': {
        const src = args[0];
        const dest = args[1];
        if (!src || !dest) return 'mv: missing file operand';
        const fullSrc = src.startsWith('/') ? src : (this.currentPath === '/' ? '/' + src : this.currentPath + '/' + src);
        const fullDest = dest.startsWith('/') ? dest : (this.currentPath === '/' ? '/' + dest : this.currentPath + '/' + dest);
        if (this.fs[fullSrc]) {
          this.fs[fullDest] = this.fs[fullSrc];
          delete this.fs[fullSrc];
          const parent = this.currentPath;
          if (this.fs[parent]) {
            this.fs[parent] = this.fs[parent].filter(f => f !== src);
            if (!this.fs[parent].includes(dest)) this.fs[parent].push(dest);
          }
          return '';
        }
        return `mv: cannot stat '${src}': No such file or directory`;
      }

      case 'rm': {
        const target = args[0];
        if (!target) return 'rm: missing operand';
        const full = target.startsWith('/') ? target : (this.currentPath === '/' ? '/' + target : this.currentPath + '/' + target);
        if (this.fs[full]) {
          delete this.fs[full];
          const parent = this.currentPath;
          if (this.fs[parent]) this.fs[parent] = this.fs[parent].filter(f => f !== target);
          return '';
        }
        return `rm: cannot remove '${target}': No such file or directory`;
      }

      case 'cat': {
        const filename = args[0];
        if (!filename && inputPipe) return inputPipe;
        if (!filename) return 'cat: missing operand';

        if (filename.includes('/dev/tcp')) {
          return 'CYBER{RAW_SOCKET_BEACON_CAPTURED}\n[TELEMETRY_HEARTBEAT_ACK] Node 01: Status ACTIVE';
        }

        const fullPath = filename.startsWith('/') ? filename : (this.currentPath === '/' ? '/' + filename : this.currentPath + '/' + filename);
        if (fullPath.startsWith('/root') && !this.isRoot) {
          return `cat: ${filename}: Permission denied`;
        }
        const content = this.fs[fullPath];
        if (typeof content === 'string') return content;
        if (Array.isArray(content)) return `cat: ${filename}: Is a directory`;
        return `cat: ${filename}: No such file or directory`;
      }

      case 'head': {
        const filename = args[args.length - 1];
        let text = inputPipe;
        if (!text && filename) {
          const fullPath = filename.startsWith('/') ? filename : (this.currentPath === '/' ? '/' + filename : this.currentPath + '/' + filename);
          text = this.fs[fullPath];
        }
        if (!text) return 'head: cannot read file';
        return text.split('\n').slice(0, 5).join('\n');
      }

      case 'tail': {
        const filename = args[args.length - 1];
        let text = inputPipe;
        if (!text && filename) {
          const fullPath = filename.startsWith('/') ? filename : (this.currentPath === '/' ? '/' + filename : this.currentPath + '/' + filename);
          text = this.fs[fullPath];
        }
        if (!text) return 'tail: cannot read file';
        return text.split('\n').slice(-5).join('\n');
      }

      case 'wc': {
        const text = inputPipe || (args[0] ? this.fs[this.currentPath + '/' + args[0]] : '');
        if (!text) return '0 0 0';
        const lines = text.split('\n').length;
        const words = text.split(/\s+/).filter(Boolean).length;
        const bytes = text.length;
        if (args.includes('-l')) return `${lines}`;
        return `${lines} ${words} ${bytes}`;
      }

      case 'grep': {
        const isCaseInsensitive = args.includes('-i');
        const pattern = args.find(a => !a.startsWith('-'));
        const file = args[args.length - 1] !== pattern ? args[args.length - 1] : null;

        let textToSearch = inputPipe;
        if (file) {
          const fullPath = file.startsWith('/') ? file : (this.currentPath === '/' ? '/' + file : this.currentPath + '/' + file);
          textToSearch = this.fs[fullPath] || '';
        }
        if (!pattern || !textToSearch) return '';

        const lines = textToSearch.split('\n').filter(line => {
          if (isCaseInsensitive) {
            return line.toLowerCase().includes(pattern.toLowerCase());
          }
          return line.includes(pattern);
        });
        return lines.join('\n');
      }

      case 'chmod': {
        const mode = args[0];
        const target = args[1];
        if (!mode || !target) return 'chmod: missing operand';
        const full = target.startsWith('/') ? target : (this.currentPath === '/' ? '/' + target : this.currentPath + '/' + target);
        if (this.permissions[full]) {
          this.permissions[full] = '-rwxrwxrwx';
          return `[+] Permissions mises à jour pour ${target} : ${mode}`;
        }
        return '';
      }

      case 'apt': {
        const sub = args[0];
        const pkg = args[1];
        if (sub === 'update') {
          return 'Hit:1 http://deb.debian.org/debian bookworm InRelease\nGet:2 http://security.debian.org/debian-security bookworm-security InRelease [48.0 kB]\nReading package lists... Done\nBuilding dependency tree... Done\nAll packages are up to date.';
        }
        if (sub === 'install') {
          if (!pkg) return 'apt install: specify a package name (ex: nmap, curl, wireshark)';
          this.installedPackages.push(pkg);
          return `Reading package lists... Done\nBuilding dependency tree... Done\nThe following NEW packages will be installed: ${pkg}\nUnpacking ${pkg} (amd64) ...\nSetting up ${pkg} ...\n[+] ${pkg} installé avec succès dans /usr/bin/${pkg} !`;
        }
        return 'Usage: apt [update | install <paquet>]';
      }

      case 'which': {
        const prog = args[0];
        if (!prog) return '';
        if (this.installedPackages.includes(prog) || ['ls', 'cat', 'grep', 'bash', 'find', 'curl', 'ping'].includes(prog)) {
          return `/usr/bin/${prog}`;
        }
        return `${prog} not found in $PATH`;
      }

      case 'ps': {
        return '  PID TTY          TIME CMD\n    1 ?        00:00:02 systemd\n  412 ?        00:00:00 cron\n 1024 ?        00:00:01 nginx\n 2400 pts/0    00:00:00 bash\n 2415 pts/0    00:00:00 ps';
      }

      case 'top': {
        return 'top - 10:00:00 up 12 days, 1 user,  load average: 0.05, 0.03, 0.00\nTasks:  85 total,   1 running,  84 sleeping\n%Cpu(s):  1.2 us,  0.5 sy,  0.0 ni, 98.3 id\nMiB Mem :   2048.0 total,   1420.5 free,    320.1 used\n\n  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND\n 1024 www-data  20   0   45210   8420   3100 S   0.7   0.4   0:01.20 nginx\n 2400 operator  20   0   14200   4100   2800 S   0.0   0.2   0:00.12 bash';
      }

      case 'kill': {
        const pid = args[0];
        if (!pid) return 'kill: usage: kill <pid>';
        return `[+] Signal TERM envoyé au processus ${pid}`;
      }

      case 'ping': {
        const host = args[0] || '127.0.0.1';
        return `PING ${host} (${host}) 56(84) bytes of data.\n64 bytes from ${host}: icmp_seq=1 ttl=64 time=0.032 ms\n64 bytes from ${host}: icmp_seq=2 ttl=64 time=0.041 ms\n--- ${host} ping statistics ---\n2 packets transmitted, 2 received, 0% packet loss.`;
      }

      case 'curl': {
        const isHead = args.includes('-I') || args.includes('-i');
        const url = args[args.length - 1] || '';
        if (isHead) {
          return 'HTTP/1.1 200 OK\nDate: Tue, 27 Oct 2026 10:00:00 GMT\nServer: Node.js (CyberLab Platform)\nContent-Type: text/html; charset=utf-8\nContent-Length: 4210';
        }
        if (url.includes('/targets/api/internal/telemetry')) {
          return '{"status":"authorized","node":"TELEMETRY_CORE_GATEWAY","data":{"master_flag":"CYBER{HOP_BY_HOP_HEADER_BYPASS_RFC2616}"}}';
        }
        if (url.includes('audit-eval')) {
          const raw = cmdStr.toLowerCase();
          if (raw.includes('x-security-scan') || raw.includes('authorization')) {
            return 'HTTP/1.1 200 OK\nContent-Type: application/json\n\n{\n  "audit": "AUTHORIZED",\n  "status": "SECURITY_PASSED",\n  "token": "CYBER{NET_MID_EVAL_RECON_HEADER_AUTHORIZED}"\n}';
          }
          return 'HTTP/1.1 403 Forbidden\nContent-Type: application/json\n\n{"error":"Forbidden: En-tête X-Security-Scan: enabled requis pour valider l\'audit."}';
        }
        if (url.includes('robots.txt')) {
          return 'User-agent: *\nDisallow: /admin-console/\nDisallow: /secret-vault/\nFLAG=CYBER{HTTP_GET_ROBOTS_TXT_FOUND}';
        }
        return '<!DOCTYPE html>\n<html>\n<head>\n  <title>CyberRange PRO</title>\n</head>\n<body>\n  <h1>CyberLab Web Gateway</h1>\n  <p>Bienvenue sur le portail d\'apprentissage.</p>\n</body>\n</html>';
      }

      case 'dig': {
        const domain = args[args.length - 1] || 'aegis.local';
        return `; <<>> DiG 9.18 <<>> ${domain}\n;; Got answer:\n;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 41202\n${domain}.    300 IN A   192.168.10.5\n;; Query time: 1 msec\n;; SERVER: 127.0.0.53#53(127.0.0.53)`;
      }

      case 'ss': {
        if (args.includes('-t') && !args.includes('-l')) {
          return 'State      Recv-Q Send-Q Local Address:Port Peer Address:Port\nESTAB      0      0      127.0.0.1:3333     127.0.0.1:48210\n';
        }
        return 'State      Recv-Q Send-Q Local Address:Port               Peer Address:Port\nLISTEN     0      128    0.0.0.0:3333                     0.0.0.0:*\nLISTEN     0      511    0.0.0.0:80                       0.0.0.0:*\nLISTEN     0      128    127.0.0.1:8080                   0.0.0.0:*\n';
      }

      case 'nmap': {
        const target = args[args.length - 1] || '127.0.0.1';
        return `Starting Nmap 7.94 ( https://nmap.org )\nNmap scan report for ${target}\nHost is up (0.00012s latency).\nPORT     STATE SERVICE VERSION\n80/tcp   open  http    nginx/1.24.0\n3333/tcp open  http    Node.js (CyberLab Platform)\n8080/tcp open  http    Apache Tomcat/8.5.5 (OBSOLETE_VULN)\nFLAG: CYBER{NMAP_FINGERPRINT_OBSOLETE_SERVICE_EXPOSED}`;
      }

      case 'find': {
        if (args.includes('-perm')) {
          return '/usr/bin/find\n/usr/bin/passwd\n/usr/bin/chfn\n/usr/bin/newgrp';
        }
        if (cmdStr.includes('-exec') && (cmdStr.includes('/bin/sh') || cmdStr.includes('bash'))) {
          this.isRoot = true;
          this.eUID = 0;
          this.updatePromptUI();
          if (window.cyberAudio) window.cyberAudio.playSuccess();
          return '[+] SUID Privilege Escalation réussie ! Shell root eUID=0 débloqué (#).';
        }
        if (cmdStr.includes('*.txt') || cmdStr.includes('*flag*') || cmdStr.includes('flag')) {
          return '/home/operator/notes.txt\n/home/operator/projet_secret/flag_novice.txt';
        }
        return this.fs[this.currentPath] ? this.fs[this.currentPath].join('\n') : '';
      }

      case 'echo': {
        return args.join(' ').replace(/['"]/g, '');
      }

      case 'exec': {
        if (cmdStr.includes('/dev/tcp')) {
          return '[+] Socket ouvert sur /dev/tcp/127.0.0.1/3333\n[+] Beacon captured: CYBER{RAW_SOCKET_BEACON_CAPTURED}';
        }
        return '';
      }

      default:
        return `bash: ${cmd}: command not found. Tape 'help' pour la liste des outils.`;
    }
  }

  escapeHTML(str) {
    return (str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
}

window.CyberTerminal = CyberTerminal;
