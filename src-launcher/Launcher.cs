using System;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Threading;
using System.Windows.Forms;

namespace CyberRangeLauncher
{
    static class Program
    {
        private static NotifyIcon trayIcon;
        private static Process serverProcess;
        private static bool isExiting = false;

        [STAThread]
        static void Main()
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);

            string appDir = AppDomain.CurrentDomain.BaseDirectory;
            string serverJsPath = Path.Combine(appDir, "server.js");

            if (!File.Exists(serverJsPath))
            {
                MessageBox.Show("Fichier 'server.js' introuvable dans :\n" + appDir, 
                    "CyberRange PRO - Erreur", MessageBoxButtons.OK, MessageBoxIcon.Error);
                return;
            }

            string nodePath = FindNodeExecutable(appDir);
            if (string.IsNullOrEmpty(nodePath))
            {
                DialogResult res = MessageBox.Show(
                    "Node.js est nécessaire pour faire tourner le laboratoire CyberRange PRO en local.\n\n" +
                    "Souhaitez-vous télécharger et installer Node.js gratuitement maintenant ?",
                    "CyberRange PRO - Dépendance Requise",
                    MessageBoxButtons.YesNo, MessageBoxIcon.Information);

                if (res == DialogResult.Yes)
                {
                    Process.Start(new ProcessStartInfo("https://nodejs.org/fr/download") { UseShellExecute = true });
                }
                return;
            }

            // Configuration du System Tray Icon
            trayIcon = new NotifyIcon();
            trayIcon.Text = "CyberRange PRO // En ligne (Port 3333)";
            trayIcon.Icon = SystemIcons.Shield;
            trayIcon.Visible = true;

            ContextMenu menu = new ContextMenu();
            menu.MenuItems.Add("⚡ Ouvrir dans le Navigateur", (s, e) => OpenBrowser());
            menu.MenuItems.Add("🔄 Redémarrer le Laboratoire", (s, e) => RestartServer(nodePath, serverJsPath, appDir));
            menu.MenuItems.Add("-");
            menu.MenuItems.Add("❌ Quitter", (s, e) => {
                isExiting = true;
                KillServer();
                trayIcon.Visible = false;
                Application.Exit();
            });
            trayIcon.ContextMenu = menu;
            trayIcon.DoubleClick += (s, e) => OpenBrowser();

            // Lancement du serveur dans un thread séparé avec gestion de la boucle d'auto-update (code 42)
            Thread serverThread = new Thread(() => RunServerLoop(nodePath, serverJsPath, appDir));
            serverThread.IsBackground = true;
            serverThread.Start();

            // Ouverture du navigateur après 1.2s
            new Thread(() => {
                Thread.Sleep(1200);
                OpenBrowser();
            }).Start();

            Application.ApplicationExit += (s, e) => {
                isExiting = true;
                KillServer();
            };

            Application.Run();
        }

        private static void RunServerLoop(string nodePath, string scriptPath, string workingDir)
        {
            while (!isExiting)
            {
                try
                {
                    ProcessStartInfo psi = new ProcessStartInfo();
                    psi.FileName = nodePath;
                    psi.Arguments = "\"" + scriptPath + "\"";
                    psi.WorkingDirectory = workingDir;
                    psi.CreateNoWindow = true;
                    psi.UseShellExecute = false;

                    serverProcess = Process.Start(psi);
                    if (serverProcess == null) break;

                    serverProcess.WaitForExit();
                    int exitCode = serverProcess.ExitCode;

                    // Code 42 = Le serveur a demandé un redémarrage après auto-update
                    if (!isExiting && exitCode == 42)
                    {
                        Thread.Sleep(1000);
                        continue;
                    }
                    else
                    {
                        break;
                    }
                }
                catch
                {
                    break;
                }
            }

            if (!isExiting)
            {
                Application.Exit();
            }
        }

        private static void KillServer()
        {
            try
            {
                if (serverProcess != null && !serverProcess.HasExited)
                {
                    serverProcess.Kill();
                }
            }
            catch { }
        }

        private static void RestartServer(string nodePath, string scriptPath, string workingDir)
        {
            KillServer();
        }

        private static void OpenBrowser()
        {
            try
            {
                Process.Start(new ProcessStartInfo("http://localhost:3333") { UseShellExecute = true });
            }
            catch { }
        }

        private static string FindNodeExecutable(string appDir)
        {
            // 1. node.exe local
            string localNode = Path.Combine(appDir, "node.exe");
            if (File.Exists(localNode)) return localNode;

            // 2. PATH global
            try
            {
                Process p = new Process();
                p.StartInfo.FileName = "where";
                p.StartInfo.Arguments = "node";
                p.StartInfo.CreateNoWindow = true;
                p.StartInfo.UseShellExecute = false;
                p.StartInfo.RedirectStandardOutput = true;
                p.Start();
                string output = p.StandardOutput.ReadLine();
                p.WaitForExit();
                if (!string.IsNullOrEmpty(output) && File.Exists(output.Trim()))
                {
                    return output.Trim();
                }
            }
            catch { }

            // 3. Chemins d'installation classiques
            string[] knownPaths = new string[]
            {
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), @"nodejs\node.exe"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), @"nodejs\node.exe"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), @"Antigravity\bin\agy-node.cmd"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), @"Programs\antigravity\Antigravity.exe")
            };

            foreach (string kp in knownPaths)
            {
                if (File.Exists(kp)) return kp;
            }

            return null;
        }
    }
}
