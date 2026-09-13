// Validation du formulaire "Prêter Serment"
// informations du membre
const form = document.getElementById("formSerment");
const nom = document.getElementById("nom");
const courriel = document.getElementById("courriel");
const age = document.getElementById("age");
const saga = document.getElementById("saga");
const personnage = document.getElementById("personnage");
// engagement dans la guilde
const frequence = document.getElementById("frequence");
const message = document.getElementById("message");
// consentements
const infolettre = document.getElementById("infolettre");

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const isValid = validateForm();

    if (isValid) {
        const confirmation = document.getElementById("serment-confirmation");
        confirmation.textContent =
            "Ton serment a été forgé avec succès. Bienvenue dans la forge !";
        confirmation.classList.remove("hidden");
        form.reset();
        resetAllStates();
    }
})

function validateForm() {

    let noError = true;
    const nomValue = nom.value.trim();
    const courrielValue = courriel.value.trim();
    const ageValue = age.value;
    const sagaValue = saga.value;
    const personnageValue = personnage.value.trim();

    const rangValue = document.querySelector('input[name="rang"]:checked')?.value;
    const frequenceValue = frequence.value;
    const messageValue = message.value.trim();
    const reglementChecked = document.getElementById("reglement").checked;

    // Informations du membre
    //nom / pseudonyme
    if (nomValue === "") {
        setError(nom, "Le nom ou pseudonyme est requis");
        noError = false;
    } else if (nomValue.length < 2) {
        setError(nom, "Le nom doit comprendre un minimum de 2 caractères");
        noError = false;
    } else if (nomValue.length > 30) {
        setError(nom, "Le nom doit comprendre un maximum de 30 caractères");
        noError = false;
    } else {
        setSuccess(nom);
    }

    //courriel
    if (courrielValue === "") {
        setError(courriel, "Le courriel est requis");
        noError = false;
    } else if (!isValidEmail(courrielValue)) {
        setError(courriel, "Veuillez entrer une adresse courriel valide (ex: courriel@domaine.com)");
        noError = false;
    } else {
        setSuccess(courriel);
    }

    // tranche d'âge
    if (!ageValue || ageValue === "") {
        setError(age, "Veuillez sélectionner une tranche d'âge");
        noError = false;
    } else {
        setSuccess(age);
    }

    // saga préférée
    if (!sagaValue || sagaValue === "") {
        setError(saga, "Veuillez sélectionner une saga");
        noError = false;
    } else {
        setSuccess(saga);
    }

    // personnage préféré
    if (personnageValue === "") {
        setError(personnage, "Le personnage préféré est requis");
        noError = false;
    } else if (personnageValue.length < 2) {
        setError(personnage, "Le nom du personnage doit comprendre un minimum de 2 caractères");
        noError = false;
    } else {
        setSuccess(personnage);
    }

    // rang souhaité
    if (!rangValue) {
        setErrorRadioGroup("rang-group", "Veuillez sélectionner un rang");
        noError = false;
    } else {
        setSuccessRadioGroup("rang-group");
    }

    // fréquence de lecture
    if (!frequenceValue || frequenceValue === "") {
        setError(frequence, "Veuillez sélectionner une fréquence de lecture");
        noError = false;
    } else {
        setSuccess(frequence);
    }

    // message / motivation
    if (messageValue === "") {
        setError(message, "Le message de motivation est requis");
        noError = false;
    } else if (messageValue.length < 20) {
        setError(message, "Le message doit comprendre un minimum de 20 caractères");
        noError = false;
    } else if (messageValue.length > 500) {
        setError(message, "Le message doit comprendre un maximum de 500 caractères");
        noError = false;
    } else {
        setSuccess(message);
    }

    // Consentements
    // règlement de la guilde
    if (!reglementChecked) {
        setErrorCheckbox("reglement", "Vous devez accepter le règlement de la guilde");
        noError = false;
    } else {
        setSuccessCheckbox("reglement");
    }

    // infolettre : aucune validation requise (champ facultatif)

    return noError;
}

function setErrorCheckbox(containerId, msg) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const errorDisplay = document.getElementById("err-" + containerId);
    if (errorDisplay) {
        errorDisplay.innerText = msg;
    }

    container.closest(".serment__champ").classList.add("error");
    container.closest(".serment__champ").classList.remove("success");
}

function setSuccessCheckbox(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const errorDisplay = document.getElementById("err-" + containerId);
    if (errorDisplay) {
        errorDisplay.innerText = "";
    }

    container.closest(".serment__champ").classList.add("success");
    container.closest(".serment__champ").classList.remove("error");
}

function setErrorRadioGroup(containerId, msg) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const errorDisplay = container.querySelector(".serment__erreur");
    if (errorDisplay) {
        errorDisplay.innerText = msg;
    }

    container.classList.add("error");
    container.classList.remove("success");
}

function setSuccessRadioGroup(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const errorDisplay = container.querySelector(".serment__erreur");
    if (errorDisplay) {
        errorDisplay.innerText = "";
    }

    container.classList.add("success");
    container.classList.remove("error");
}

const setError = (element, msg) => {
    const inputControl = element.closest ? element.closest(".serment__champ") : element;
    const errorDisplay = inputControl.querySelector(".serment__erreur");

    if (errorDisplay) {
        errorDisplay.innerText = msg;
    }

    inputControl.classList.add("error");
    inputControl.classList.remove("success");
}

const setSuccess = (element) => {
    const inputControl = element.closest ? element.closest(".serment__champ") : element;
    const errorDisplay = inputControl.querySelector(".serment__erreur");

    if (errorDisplay) {
        errorDisplay.innerText = "";
    }

    inputControl.classList.add("success");
    inputControl.classList.remove("error");
}

const isValidEmail = (courriel) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(courriel)) {
        return false;
    }
    if (courriel.includes('..')) {
        return false;
    }
    const [localPart, domain] = courriel.split('@');
    if (localPart.length > 64) {
        return false;
    }
    if (domain.length > 253) {
        return false;
    }
    return true;
}

function resetAllStates() {
    document.querySelectorAll(".serment__champ, #rang-group").forEach(el => {
        el.classList.remove("error", "success");
    });
}