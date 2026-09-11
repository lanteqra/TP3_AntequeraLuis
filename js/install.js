let deferredPrompt = null;
const installBtn =
    document.getElementById('butInstall');

window.addEventListener(
    'beforeinstallprompt', (evt) => {
        evt.preventDefault();
        deferredPrompt = evt;
        installBtn.hidden = false;
    }
);

installBtn.addEventListener('click',
    async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } =
            await deferredPrompt.userChoice;
        console.log('Choix :', outcome);
        deferredPrompt = null;
        installBtn.hidden = true;
    }
);

window.addEventListener('appinstalled',
    () => console.log('App installée !'));
