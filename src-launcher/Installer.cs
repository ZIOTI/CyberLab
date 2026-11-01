using System;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.IO.Compression;
using System.Net;
using System.Threading;
using System.Windows.Forms;

namespace CyberRangeSetup
{
    public class SetupForm : Form
    {
        private TextBox txtInstallPath;
        private CheckBox chkDesktop;
        private CheckBox chkStartMenu;
        private CheckBox chkLaunchNow;
        private Button btnInstall;
        private ProgressBar prgBar;
        private Label lblStatus;

        public SetupForm()
        {
            InitializeComponent();
        }

        private void InitializeComponent()
        {
            this.Text = "CyberRange PRO - Assistant d'Installation";
            this.Size = new Size(540, 420);
            this.StartPosition = FormStartPosition.CenterScreen;
            this.FormBorderStyle = FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            this.BackColor = Color.FromArgb(8, 12, 20);
            this.ForeColor = Color.FromArgb(248, 250, 252);
            this.Font = new Font("Segoe UI", 9F, FontStyle.Regular);

            // En-tête Cyber
            Panel headerPanel = new Panel();
            headerPanel.Dock = DockStyle.Top;
            headerPanel.Height = 80;
            headerPanel.BackColor = Color.FromArgb(11, 17, 30);
            this.Controls.Add(headerPanel);

            Label lblTitle = new Label();
            lblTitle.Text = "⚡ CYBERRANGE PRO";
            lblTitle.Font = new Font("Segoe UI", 14F, FontStyle.Bold);
            lblTitle.ForeColor = Color.FromArgb(6, 182, 212);
            lblTitle.Location = new Point(20, 16);
            lblTitle.AutoSize = true;
            headerPanel.Controls.Add(lblTitle);

            Label lblSubtitle = new Label();
            lblSubtitle.Text = "Académie de Hacking Offensif & Laboratoire CTF Local";
            lblSubtitle.Font = new Font("Segoe UI", 9F, FontStyle.Regular);
            lblSubtitle.ForeColor = Color.FromArgb(148, 163, 184);
            lblSubtitle.Location = new Point(22, 44);
            lblSubtitle.AutoSize = true;
            headerPanel.Controls.Add(lblSubtitle);

            // Dossier de destination
            Label lblDest = new Label();
            lblDest.Text = "Dossier d'installation :";
            lblDest.Location = new Point(24, 100);
            lblDest.AutoSize = true;
            this.Controls.Add(lblDest);

            string defaultPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "Programs", "CyberRange-PRO");
            txtInstallPath = new TextBox();
            txtInstallPath.Text = defaultPath;
            txtInstallPath.Location = new Point(24, 124);
            txtInstallPath.Size = new Size(380, 25);
            txtInstallPath.BackColor = Color.FromArgb(15, 23, 42);
            txtInstallPath.ForeColor = Color.White;
            txtInstallPath.BorderStyle = BorderStyle.FixedSingle;
            this.Controls.Add(txtInstallPath);

            Button btnBrowse = new Button();
            btnBrowse.Text = "Parcourir...";
            btnBrowse.Location = new Point(415, 123);
            btnBrowse.Size = new Size(85, 27);
            btnBrowse.BackColor = Color.FromArgb(30, 41, 59);
            btnBrowse.ForeColor = Color.White;
            btnBrowse.FlatStyle = FlatStyle.Flat;
            btnBrowse.Click += (s, e) => {
                FolderBrowserDialog fbd = new FolderBrowserDialog();
                fbd.SelectedPath = txtInstallPath.Text;
                if (fbd.ShowDialog() == DialogResult.OK) {
                    txtInstallPath.Text = fbd.SelectedPath;
                }
            };
            this.Controls.Add(btnBrowse);

            // Options de raccourcis
            chkDesktop = new CheckBox();
            chkDesktop.Text = "Créer un raccourci sur le Bureau (⚡ CyberRange PRO)";
            chkDesktop.Checked = true;
            chkDesktop.Location = new Point(24, 170);
            chkDesktop.AutoSize = true;
            this.Controls.Add(chkDesktop);

            chkStartMenu = new CheckBox();
            chkStartMenu.Text = "Ajouter dans le Menu Démarrer";
            chkStartMenu.Checked = true;
            chkStartMenu.Location = new Point(24, 200);
            chkStartMenu.AutoSize = true;
            this.Controls.Add(chkStartMenu);

            chkLaunchNow = new CheckBox();
            chkLaunchNow.Text = "Lancer CyberRange PRO immédiatement après l'installation";
            chkLaunchNow.Checked = true;
            chkLaunchNow.Location = new Point(24, 230);
            chkLaunchNow.AutoSize = true;
            this.Controls.Add(chkLaunchNow);

            // Barre de progression
            prgBar = new ProgressBar();
            prgBar.Location = new Point(24, 268);
            prgBar.Size = new Size(476, 14);
            prgBar.Visible = false;
            this.Controls.Add(prgBar);

            lblStatus = new Label();
            lblStatus.Text = "Prêt pour l'installation.";
            lblStatus.Location = new Point(24, 288);
            lblStatus.Size = new Size(476, 20);
            lblStatus.ForeColor = Color.FromArgb(148, 163, 184);
            this.Controls.Add(lblStatus);

            // Bouton Installer
            btnInstall = new Button();
            btnInstall.Text = "🚀 Installer & Configurer";
            btnInstall.Font = new Font("Segoe UI", 10F, FontStyle.Bold);
            btnInstall.Location = new Point(24, 320);
            btnInstall.Size = new Size(476, 42);
            btnInstall.BackColor = Color.FromArgb(16, 185, 129);
            btnInstall.ForeColor = Color.FromArgb(2, 32, 19);
            btnInstall.FlatStyle = FlatStyle.Flat;
            btnInstall.Cursor = Cursors.Hand;
            btnInstall.Click += BtnInstall_Click;
            this.Controls.Add(btnInstall);
        }

        private void UpdateUI(string status, int progress)
        {
            if (this.InvokeRequired)
            {
                this.Invoke(new Action(() => UpdateUI(status, progress)));
                return;
            }
            if (!string.IsNullOrEmpty(status)) lblStatus.Text = status;
            if (progress >= 0 && progress <= 100) prgBar.Value = progress;
        }

        private void BtnInstall_Click(object sender, EventArgs e)
        {
            string targetDir = txtInstallPath.Text.Trim();
            if (string.IsNullOrEmpty(targetDir)) return;

            btnInstall.Enabled = false;
            prgBar.Visible = true;
            prgBar.Value = 5;
            lblStatus.Text = "Initialisation...";
            lblStatus.ForeColor = Color.FromArgb(6, 182, 212);

            bool createDesktop = chkDesktop.Checked;
            bool createStartMenu = chkStartMenu.Checked;
            bool launchNow = chkLaunchNow.Checked;

            Thread worker = new Thread(() =>
            {
                try
                {
                    Directory.CreateDirectory(targetDir);
                    UpdateUI("Préparation des dossiers...", 15);

                    string sourceDir = AppDomain.CurrentDomain.BaseDirectory;
                    bool hasLocalFiles = File.Exists(Path.Combine(sourceDir, "server.js"));

                    if (hasLocalFiles)
                    {
                        UpdateUI("Copie des fichiers locaux (préservation SQLite)...", 30);
                        CopyFilesRecursively(sourceDir, targetDir);
                        UpdateUI("Fichiers copiés.", 75);
                    }
                    else
                    {
                        UpdateUI("Téléchargement du package CyberRange PRO depuis GitHub...", 25);
                        string tempZip = Path.Combine(Path.GetTempPath(), "CyberRange-PRO-Download.zip");

                        try
                        {
                            ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072 | (SecurityProtocolType)12288;
                        }
                        catch { }

                        using (WebClient client = new WebClient())
                        {
                            client.Headers["User-Agent"] = "CyberRange-PRO-Installer";
                            client.DownloadProgressChanged += (s, ev) =>
                            {
                                int val = 25 + (int)(ev.ProgressPercentage * 0.45);
                                if (val > 70) val = 70;
                                UpdateUI(string.Format("Téléchargement en cours ({0}%)...", ev.ProgressPercentage), val);
                            };
                            string downloadUrl = "https://github.com/ZIOTI/CyberLab/releases/latest/download/CyberRange-PRO.zip";
                            client.DownloadFile(new Uri(downloadUrl), tempZip);
                            string checksums = client.DownloadString("https://github.com/ZIOTI/CyberLab/releases/latest/download/checksums.txt");
                            string expectedHash = null;
                            foreach (string line in checksums.Split('\n')) {
                                string[] parts = line.Trim().Split(new char[] { ' ', '\t' }, StringSplitOptions.RemoveEmptyEntries);
                                if (parts.Length == 2 && parts[1] == "CyberRange-PRO.zip") expectedHash = parts[0];
                            }
                            using (var sha = System.Security.Cryptography.SHA256.Create())
                            using (var stream = File.OpenRead(tempZip)) {
                                string actualHash = BitConverter.ToString(sha.ComputeHash(stream)).Replace("-", "").ToLowerInvariant();
                                if (expectedHash == null || !string.Equals(actualHash, expectedHash, StringComparison.OrdinalIgnoreCase))
                                    throw new InvalidDataException("Archive non vérifiée : installation refusée.");
                            }
                        }

                        UpdateUI("Extraction du laboratoire (préservation SQLite)...", 75);
                        ExtractZipSafe(tempZip, targetDir);

                        try { if (File.Exists(tempZip)) File.Delete(tempZip); } catch { }
                    }

                    // Création du raccourci Bureau si demandé
                    if (createDesktop)
                    {
                        UpdateUI("Création du raccourci Bureau...", 85);
                        string desktopPath = Environment.GetFolderPath(Environment.SpecialFolder.Desktop);
                        string targetExe = Path.Combine(targetDir, "CyberRange-PRO.exe");
                        CreateShortcut(Path.Combine(desktopPath, "⚡ CyberRange PRO.lnk"), targetExe, targetDir);
                    }

                    // Création du raccourci Menu Démarrer si demandé
                    if (createStartMenu)
                    {
                        UpdateUI("Création du raccourci Menu Démarrer...", 92);
                        string startMenu = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.StartMenu), "Programs", "CyberRange PRO");
                        Directory.CreateDirectory(startMenu);
                        string targetExe = Path.Combine(targetDir, "CyberRange-PRO.exe");
                        CreateShortcut(Path.Combine(startMenu, "CyberRange PRO.lnk"), targetExe, targetDir);
                    }

                    UpdateUI("Installation terminée avec succès !", 100);

                    this.Invoke(new Action(() =>
                    {
                        lblStatus.ForeColor = Color.FromArgb(16, 185, 129);
                        MessageBox.Show(
                            "Installation de CyberRange PRO terminée avec succès !\n\n" +
                            "Ton raccourci a été créé sur le Bureau.\n" +
                            "Toutes les futures mises à jour se feront en place sans jamais écraser tes niveaux !",
                            "CyberRange PRO - Installation Réussie",
                            MessageBoxButtons.OK, MessageBoxIcon.Information);

                        if (launchNow)
                        {
                            string targetExe = Path.Combine(targetDir, "CyberRange-PRO.exe");
                            if (File.Exists(targetExe))
                            {
                                Process.Start(new ProcessStartInfo(targetExe) { WorkingDirectory = targetDir });
                            }
                        }

                        this.Close();
                    }));
                }
                catch (Exception ex)
                {
                    this.Invoke(new Action(() =>
                    {
                        MessageBox.Show("Erreur lors de l'installation :\n" + ex.Message, "Erreur", MessageBoxButtons.OK, MessageBoxIcon.Error);
                        btnInstall.Enabled = true;
                        lblStatus.Text = "Erreur pendant l'installation.";
                        lblStatus.ForeColor = Color.FromArgb(239, 68, 68);
                    }));
                }
            });

            worker.IsBackground = true;
            worker.Start();
        }

        private void ExtractZipSafe(string zipPath, string targetDir)
        {
            using (ZipArchive archive = ZipFile.OpenRead(zipPath))
            {
                foreach (ZipArchiveEntry entry in archive.Entries)
                {
                    if (string.IsNullOrEmpty(entry.Name)) continue;

                    string destinationPath = Path.GetFullPath(Path.Combine(targetDir, entry.FullName));
                    if (!destinationPath.StartsWith(Path.GetFullPath(targetDir).TrimEnd(Path.DirectorySeparatorChar) + Path.DirectorySeparatorChar, StringComparison.OrdinalIgnoreCase))
                        continue;

                    // NE JAMAIS ÉCRASER LA BASE SQLITE
                    if (entry.Name == "cyberrange.db" || entry.Name.StartsWith("cyberrange.db-") || entry.Name.EndsWith(".bak"))
                    {
                        if (File.Exists(destinationPath)) continue;
                    }

                    string dir = Path.GetDirectoryName(destinationPath);
                    if (!Directory.Exists(dir)) Directory.CreateDirectory(dir);

                    entry.ExtractToFile(destinationPath, true);
                }
            }
        }

        private void CopyFilesRecursively(string sourcePath, string targetPath)
        {
            foreach (string dirPath in Directory.GetDirectories(sourcePath, "*", SearchOption.AllDirectories))
            {
                string dirName = Path.GetFileName(dirPath);
                if (dirName == ".git" || dirName == "src-launcher") continue;

                string relPath = dirPath.Substring(sourcePath.Length).TrimStart(Path.DirectorySeparatorChar, Path.AltDirectorySeparatorChar);
                Directory.CreateDirectory(Path.Combine(targetPath, relPath));
            }

            foreach (string newPath in Directory.GetFiles(sourcePath, "*.*", SearchOption.AllDirectories))
            {
                string fileName = Path.GetFileName(newPath);
                // NE JAMAIS ÉCRASER LA BASE SQLITE LORS D'UNE RÉINSTALLATION OU RÉPARATION
                if (fileName == "cyberrange.db" || fileName.StartsWith("cyberrange.db-") || fileName.EndsWith(".bak"))
                {
                    string destDb = Path.Combine(targetPath, fileName);
                    if (File.Exists(destDb)) continue;
                }

                // Ne pas copier l'installateur lui-même
                if (fileName == "CyberRange-PRO-Setup.exe") continue;

                string relPath = newPath.Substring(sourcePath.Length).TrimStart(Path.DirectorySeparatorChar, Path.AltDirectorySeparatorChar);
                if (relPath.StartsWith(".git") || relPath.StartsWith("src-launcher")) continue;

                string destFile = Path.Combine(targetPath, relPath);
                File.Copy(newPath, destFile, true);
            }
        }

        private void CreateShortcut(string shortcutPath, string targetExePath, string workingDir)
        {
            try
            {
                Type shellType = Type.GetTypeFromProgID("WScript.Shell");
                if (shellType != null)
                {
                    dynamic shell = Activator.CreateInstance(shellType);
                    dynamic shortcut = shell.CreateShortcut(shortcutPath);
                    shortcut.TargetPath = targetExePath;
                    shortcut.WorkingDirectory = workingDir;
                    shortcut.Description = "CyberRange PRO - Académie Offensive de Cybersécurité & CTF";
                    shortcut.Save();
                }
            }
            catch { }
        }
    }

    static class Program
    {
        [STAThread]
        static void Main()
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new SetupForm());
        }
    }
}
