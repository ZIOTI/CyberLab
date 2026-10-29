using System;
using System.Diagnostics;
using System.Drawing;
using System.IO;
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

        private void BtnInstall_Click(object sender, EventArgs e)
        {
            string targetDir = txtInstallPath.Text.Trim();
            if (string.IsNullOrEmpty(targetDir)) return;

            btnInstall.Enabled = false;
            prgBar.Visible = true;
            prgBar.Value = 10;
            lblStatus.Text = "Préparation des dossiers...";
            lblStatus.ForeColor = Color.FromArgb(6, 182, 212);

            try
            {
                Directory.CreateDirectory(targetDir);
                prgBar.Value = 30;

                string sourceDir = AppDomain.CurrentDomain.BaseDirectory;
                lblStatus.Text = "Copie des fichiers du laboratoire (préservation SQLite)...";
                CopyFilesRecursively(sourceDir, targetDir);
                prgBar.Value = 70;

                // Création du raccourci Bureau si demandé
                if (chkDesktop.Checked)
                {
                    lblStatus.Text = "Création du raccourci Bureau...";
                    string desktopPath = Environment.GetFolderPath(Environment.SpecialFolder.Desktop);
                    string targetExe = Path.Combine(targetDir, "CyberRange-PRO.exe");
                    CreateShortcut(Path.Combine(desktopPath, "⚡ CyberRange PRO.lnk"), targetExe, targetDir);
                }

                // Création du raccourci Menu Démarrer si demandé
                if (chkStartMenu.Checked)
                {
                    lblStatus.Text = "Création du raccourci Menu Démarrer...";
                    string startMenu = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.StartMenu), "Programs", "CyberRange PRO");
                    Directory.CreateDirectory(startMenu);
                    string targetExe = Path.Combine(targetDir, "CyberRange-PRO.exe");
                    CreateShortcut(Path.Combine(startMenu, "CyberRange PRO.lnk"), targetExe, targetDir);
                }

                prgBar.Value = 100;
                lblStatus.Text = "Installation terminée avec succès !";
                lblStatus.ForeColor = Color.FromArgb(16, 185, 129);

                MessageBox.Show(
                    "Installation de CyberRange PRO terminée avec succès !\n\n" +
                    "Ton raccourci a été créé sur le Bureau.\n" +
                    "Toutes les futures mises à jour se feront en place sans jamais écraser tes niveaux !",
                    "CyberRange PRO - Installation Réussie",
                    MessageBoxButtons.OK, MessageBoxIcon.Information);

                if (chkLaunchNow.Checked)
                {
                    string targetExe = Path.Combine(targetDir, "CyberRange-PRO.exe");
                    if (File.Exists(targetExe))
                    {
                        Process.Start(new ProcessStartInfo(targetExe) { WorkingDirectory = targetDir });
                    }
                }

                this.Close();
            }
            catch (Exception ex)
            {
                MessageBox.Show("Erreur lors de l'installation :\n" + ex.Message, "Erreur", MessageBoxButtons.OK, MessageBoxIcon.Error);
                btnInstall.Enabled = true;
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
