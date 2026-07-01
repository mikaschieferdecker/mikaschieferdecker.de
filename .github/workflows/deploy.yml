name: Deploy Website to All-Inkl

on:
  push:
    branches:
      - claude/install-ui-ux-pro-max-skill-q1oja4

jobs:
  web-deploy:
    name: 🎉 Deploy HTML Files
    runs-on: ubuntu-latest
    steps:
    - name: 🚚 Get latest code
      uses: actions/checkout@v4

    - name: 🚀 Upload via LFTP (All-Inkl kompatibel)
      env:
        FTP_SERVER: ${{ secrets.FTP_SERVER }}
        FTP_USERNAME: ${{ secrets.FTP_USERNAME }}
        FTP_PASSWORD: ${{ secrets.FTP_PASSWORD }}
      run: |
        # Installiere lftp
        sudo apt-get update && sudo apt-get install -y lftp
        
        # Übertrage die Dateien mit speziellen All-Inkl Einstellungen
        lftp -e "
          set ftp:ssl-allow no; 
          set ftp:passive-mode true;
          open -u $FTP_USERNAME,$FTP_PASSWORD $FTP_SERVER; 
          mirror -R --delete --reverse --no-perms \
            -x '^.git/' \
            -x '^.github/' \
            ./ ./; 
          quit
        "
