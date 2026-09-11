const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
const isiOS = /iphone|ipad|ipod/i.test(navigator.userAgent);

if (isiOS && !isStandalone) {
    showIOSInstallHint();
}

function showIOSInstallHint() {

    // Évite les doublons si la fonction est appelée 2 fois
    if (document.getElementById('ios-hint')) return;

    // Création du conteneur
    const hint = document.createElement('div');
    hint.id = 'ios-hint';
    hint.setAttribute('role', 'dialog');
    hint.setAttribute('aria-label', "Comment installer l'application sur iOS");

    // Contenu + bouton de fermeture
    hint.innerHTML = `
        <p class="ios-hint__title">Installer cette app sur iPhone / iPad</p>
        <p class="ios-hint__text">
            Appuyez sur <strong>Partager</strong>
            puis sur <strong>Sur l'écran d'accueil</strong>.
        </p>
        <button type="button" class="ios-hint__close" aria-label="Fermer">✕</button>
    `;

    // Fermeture 
    hint.querySelector('.ios-hint__close')
        .addEventListener('click', () => hint.remove());

    document.body.appendChild(hint);
}