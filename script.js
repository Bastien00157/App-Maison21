const CLE_SAUVEGARDE = "maison_app_data";

let donnees = chargerDonnees();
let pageActuelle = "accueil";
let idEdition = null;

const ideesRepas = [
"Carbonara",
"Lasagnes",
"Pizza maison",
"Gratin de pâtes",
"Poulet rôti",
"Quiche",
"Riz au poulet",
"Spaghetti bolognaise",
"Tartiflette",
"Crêpes salées"
];

function structureVide() {
return {
profil: {
nom: "Maman",
theme: "light"
},
taches: [],
courses: [],
repas: [],
evenements: [],
notes: [],
depenses: [],
maman: {
message: "",
photo: ""
}
};
}

function chargerDonnees() {

const vide = structureVide();
const sauvegarde = localStorage.getItem(CLE_SAUVEGARDE);

if (!sauvegarde) {
return vide;
}

try {

const anciennes = JSON.parse(sauvegarde);

return {
profil: {
...vide.profil,
...(anciennes.profil || {})
},

taches: Array.isArray(anciennes.taches)
? anciennes.taches.map(normaliserTache)
: [],

courses: Array.isArray(anciennes.courses)
? anciennes.courses.map(normaliserCourse)
: [],

repas: Array.isArray(anciennes.repas)
? anciennes.repas.map(normaliserRepas)
: [],

evenements: Array.isArray(anciennes.evenements)
? anciennes.evenements.map(normaliserEvenement)
: [],

notes: Array.isArray(anciennes.notes)
? anciennes.notes.map(normaliserNote)
: [],

depenses: Array.isArray(anciennes.depenses)
? anciennes.depenses.map(normaliserDepense)
: [],

maman: {
...vide.maman,
...(anciennes.maman || {})
}
};

} catch (erreur) {

console.error(erreur);
return vide;
}

}

function sauvegarder() {
localStorage.setItem(CLE_SAUVEGARDE, JSON.stringify(donnees));
}

function idUnique() {
return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function normaliserTache(tache) {

return {
id: tache.id || idUnique(),
nom: tache.nom || tache.texte || "Tâche",
categorie: tache.categorie || "Maison",
priorite: tache.priorite || "normale",
date: tache.date || "",
recurrence: tache.recurrence || "aucune",
intervalle: Number(tache.intervalle) || 2,
terminee: Boolean(tache.terminee || tache.termine),
creee: tache.creee || new Date().toISOString()
};

}

function normaliserCourse(course) {

if (typeof course === "string") {
return {
id: idUnique(),
nom: course,
quantite: "",
categorie: "Alimentation",
achetee: false
};
}

return {
id: course.id || idUnique(),
nom: course.nom || course.texte || "Article",
quantite: course.quantite || "",
categorie: course.categorie || "Alimentation",
achetee: Boolean(course.achetee || course.terminee)
};

}

function normaliserRepas(repas) {

return {
id: repas.id || idUnique(),
date: repas.date || dateDansXJours(0),
type: repas.type || "Dîner",
nom: repas.nom || repas.repas || "Repas"
};

}

function normaliserEvenement(evenement) {

return {
id: evenement.id || idUnique(),
nom: evenement.nom || evenement.texte || "Événement",
date: evenement.date || dateDansXJours(0),
heure: evenement.heure || "",
icone: evenement.icone || "📅"
};

}

function normaliserNote(note) {

return {
id: note.id || idUnique(),
titre: note.titre || "Note",
contenu: note.contenu || "",
date: note.date || new Date().toISOString()
};

}

function normaliserDepense(depense) {

return {
id: depense.id || idUnique(),
nom: depense.nom || "Dépense",
montant: Number(depense.montant) || 0,
categorie: depense.categorie || "Autre",
date: depense.date || dateDansXJours(0)
};

}

function dateLocale(date) {

return new Intl.DateTimeFormat("fr-FR", {
weekday: "long",
day: "numeric",
month: "long",
year: "numeric"
}).format(date);

}

function dateDansXJours(nombre) {

const date = new Date();
date.setHours(12, 0, 0, 0);
date.setDate(date.getDate() + nombre);

return formatDateInput(date);

}

function formatDateInput(date) {

const annee = date.getFullYear();
const mois = String(date.getMonth() + 1).padStart(2, "0");
const jour = String(date.getDate()).padStart(2, "0");

return annee + "-" + mois + "-" + jour;

}

function formatDateFr(dateString) {

if (!dateString) {
return "Sans date";
}

const date = new Date(dateString + "T12:00:00");

if (Number.isNaN(date.getTime())) {
return dateString;
}

return new Intl.DateTimeFormat("fr-FR", {
day: "numeric",
month: "short"
}).format(date);

}

function formatDateLongue(dateString) {

if (!dateString) {
return "";
}

const date = new Date(dateString + "T12:00:00");

return new Intl.DateTimeFormat("fr-FR", {
weekday: "long",
day: "numeric",
month: "long"
}).format(date);

}

function echapper(texte) {


return String(texte ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");


}


function argent(nombre) {

return Number(nombre || 0).toLocaleString("fr-FR", {
style: "currency",
currency: "EUR"
});

}

function ouvrirPage(page) {

const pages = document.querySelectorAll(".page");

pages.forEach(function(section) {
section.classList.remove("active");
});

const cible = document.getElementById(page);

if (!cible) {
return;
}

cible.classList.add("active");
pageActuelle = page;

document.querySelectorAll(".nav-button").forEach(function(button) {
button.classList.toggle("active", button.dataset.page === page);
});

window.scrollTo({
top: 0,
behavior: "smooth"
});

afficherTout();

}

window.ouvrirPage = ouvrirPage;

function afficherDate() {

const element = document.getElementById("date");

if (element) {
element.textContent = dateLocale(new Date());
}

}

function afficherProfil() {

const nom = donnees.profil.nom || "Maman";

document.getElementById("nom-maman").textContent = nom;
document.getElementById("nom-maman-input").value = nom;

}

function afficherCompteurs() {

const tachesRestantes = donnees.taches.filter(function(tache) {
return !tache.terminee;
}).length;

const coursesRestantes = donnees.courses.filter(function(course) {
return !course.achetee;
}).length;

const repas = donnees.repas.length;
const evenements = donnees.evenements.length;

document.getElementById("nombre-taches").textContent = tachesRestantes;
document.getElementById("nombre-courses").textContent = coursesRestantes;
document.getElementById("nombre-repas").textContent = repas;
document.getElementById("nombre-evenements").textContent = evenements;

}

function afficherProgression() {

const total = donnees.taches.length;
const terminees = donnees.taches.filter(function(tache) {
return tache.terminee;
}).length;

let pourcentage = 0;

if (total > 0) {
pourcentage = Math.round((terminees / total) * 100);
}

document.getElementById("pourcentage-taches").textContent = pourcentage + "%";
document.getElementById("barre-progression").style.width = pourcentage + "%";

if (total === 0) {
document.getElementById("texte-progression").textContent = "Aucune tâche";
} else {
document.getElementById("texte-progression").textContent =
terminees + " / " + total + " tâche" + (total > 1 ? "s" : "") + " terminée" + (terminees > 1 ? "s" : "");
}

}

function afficherAccueil() {

const aujourdHui = dateDansXJours(0);
const agenda = [];

donnees.taches
.filter(function(tache) {
return !tache.terminee && tache.date === aujourdHui;
})
.forEach(function(tache) {
agenda.push({
icone: "✅",
titre: tache.nom,
sousTitre: "Tâche • " + tache.categorie
});
});

donnees.evenements
.filter(function(event) {
return event.date === aujourdHui;
})
.forEach(function(event) {
agenda.push({
icone: event.icone,
titre: event.nom,
sousTitre: event.heure ? event.heure : "Aujourd'hui"
});
});

const zone = document.getElementById("accueil-agenda");

if (agenda.length === 0) {

zone.className = "empty-state";
zone.innerHTML =
"<span>✨</span>" +
"<strong>Rien de prévu aujourd'hui</strong>" +
"<p>Profite de cette journée tranquille !</p>";

} else {

zone.className = "";

zone.innerHTML = agenda.map(function(element) {
return `

<div class="list-item">
<span class="big-icon">${element.icone}</span>
<div class="item-content">
<div class="item-title">${echapper(element.titre)}</div>
<div class="item-meta">
<span class="badge">${echapper(element.sousTitre)}</span>
</div>
</div>
</div>
`;
}).join("");
}

afficherProchainRepas();

}

function afficherProchainRepas() {

const aujourdHui = dateDansXJours(0);

const repas = donnees.repas
.filter(function(element) {
return element.date >= aujourdHui;
})
.sort(function(a, b) {
return (a.date + a.type).localeCompare(b.date + b.type);
})[0];

const zone = document.getElementById("prochain-repas");

if (!repas) {

zone.className = "empty-state";
zone.innerHTML =
"<span>🍽️</span>" +
"<strong>Aucun repas prévu</strong>" +
"<p>Ajoute ton prochain repas.</p>";

return;
}

zone.className = "meal-card";

zone.innerHTML =
"<div class='meal-card-top'>" +
"<span class='big-icon'>🍝</span>" +
"<span class='card-date'>" + echapper(formatDateFr(repas.date)) + "</span>" +
"</div>" +
"<h3>" + echapper(repas.nom) + "</h3>" +
"<p>" + echapper(repas.type) + "</p>";

}

function afficherTaches() {

const recherche = document.getElementById("recherche-taches").value.toLowerCase().trim();
const filtre = document.getElementById("filtre-taches").value;
const tri = document.getElementById("tri-taches").value;

let liste = donnees.taches.filter(function(tache) {

const correspondRecherche =
tache.nom.toLowerCase().includes(recherche) ||
tache.categorie.toLowerCase().includes(recherche);

const correspondFiltre =
filtre === "toutes" ||
(filtre === "a-faire" && !tache.terminee) ||
(filtre === "terminees" && tache.terminee);

return correspondRecherche && correspondFiltre;
});

if (tri === "date") {
liste.sort(function(a, b) {
return (a.date || "9999").localeCompare(b.date || "9999");
});
}

if (tri === "priorite") {
const ordre = {
urgente: 0,
importante: 1,
normale: 2
};

liste.sort(function(a, b) {
return ordre[a.priorite] - ordre[b.priorite];
});
}

if (tri === "creation") {
liste.sort(function(a, b) {
return b.creee.localeCompare(a.creee);
});
}

document.getElementById("infos-taches").textContent =
liste.length + " tâche" + (liste.length > 1 ? "s" : "");

const zone = document.getElementById("liste-taches");

if (liste.length === 0) {

zone.innerHTML =
"<div class='empty-state'>" +
"<span>🎉</span>" +
"<strong>Aucune tâche</strong>" +
"<p>Ajoute une tâche pour commencer.</p>" +
"</div>";

return;
}

zone.innerHTML = liste.map(function(tache) {

let badgePriorite = "";

if (tache.priorite === "urgente") {
badgePriorite = "<span class='badge urgent'>Urgente</span>";
} else if (tache.priorite === "importante") {
badgePriorite = "<span class='badge important'>Importante</span>";
}

const recurrence = tache.recurrence !== "aucune"
? "<span class='badge'>🔄 " + texteRecurrence(tache) + "</span>"
: "";

const date = tache.date
? "<span class='badge'>📅 " + echapper(formatDateFr(tache.date)) + "</span>"
: "";

return `

<div class="list-item">
<input
class="check"
type="checkbox"
data-task-id="${tache.id}"
${tache.terminee ? "checked" : ""}
>

<div class="item-content">
<div class="item-title ${tache.terminee ? "done" : ""}">
${echapper(tache.nom)}
</div>

<div class="item-meta">
<span class="badge">${echapper(tache.categorie)}</span>
${badgePriorite}
${date}
${recurrence}
</div>
</div>

<div class="item-buttons">
<button class="icon-button" data-action="edit-task" data-id="${tache.id}">✏️</button>
<button class="icon-button delete" data-action="delete-task" data-id="${tache.id}">🗑️</button>
</div>
</div>
`;

}).join("");

}

function texteRecurrence(tache) {

if (tache.recurrence === "quotidienne") {
return "Chaque jour";
}

if (tache.recurrence === "hebdomadaire") {
return "Chaque semaine";
}

if (tache.recurrence === "intervalle") {
return "Tous les " + tache.intervalle + " jours";
}

return "";

}

function afficherCourses() {

const recherche = document.getElementById("recherche-courses").value.toLowerCase().trim();
const filtre = document.getElementById("filtre-courses").value;

const liste = donnees.courses.filter(function(course) {

const rechercheOK =
course.nom.toLowerCase().includes(recherche) ||
course.categorie.toLowerCase().includes(recherche);

const filtreOK =
filtre === "toutes" ||
(filtre === "a-acheter" && !course.achetee) ||
(filtre === "achetees" && course.achetee);

return rechercheOK && filtreOK;
});

document.getElementById("infos-courses").textContent =
liste.length + " article" + (liste.length > 1 ? "s" : "");

const zone = document.getElementById("liste-courses");

if (liste.length === 0) {

zone.innerHTML =
"<div class='empty-state'>" +
"<span>🛒</span>" +
"<strong>Aucune course</strong>" +
"<p>Ta liste est vide.</p>" +
"</div>";

return;
}

zone.innerHTML = liste.map(function(course) {

return `

<div class="list-item">
<input
class="check"
type="checkbox"
data-course-id="${course.id}"
${course.achetee ? "checked" : ""}
>

<div class="item-content">
<div class="item-title ${course.achetee ? "done" : ""}">
${echapper(course.nom)}
</div>

<div class="item-meta">
<span class="badge">${echapper(course.categorie)}</span>
${course.quantite ? "<span class='badge'>× " + echapper(course.quantite) + "</span>" : ""}
</div>
</div>

<button class="icon-button delete" data-action="delete-course" data-id="${course.id}">
🗑️
</button>
</div>
`;

}).join("");

}

function afficherRepas() {

const zone = document.getElementById("liste-repas");

const liste = [...donnees.repas].sort(function(a, b) {
return (a.date + a.type).localeCompare(b.date + b.type);
});

if (liste.length === 0) {

zone.innerHTML =
"<div class='empty-state'>" +
"<span>🍝</span>" +
"<strong>Aucun repas prévu</strong>" +
"<p>Construis ton menu au fur et à mesure.</p>" +
"</div>";

return;
}

zone.innerHTML = liste.map(function(repas) {

return `

<div class="meal-card">
<div class="meal-card-top">
<span class="big-icon">🍝</span>
<span class="card-date">${echapper(formatDateLongue(repas.date))}</span>
</div>

<h3>${echapper(repas.nom)}</h3>
<p>${echapper(repas.type)}</p>

<div class="item-buttons" style="margin-top:14px;">
<button class="icon-button" data-action="edit-meal" data-id="${repas.id}">✏️</button>
<button class="icon-button delete" data-action="delete-meal" data-id="${repas.id}">🗑️</button>
</div>
</div>
`;

}).join("");

}

function afficherPlanning() {

const recherche = document.getElementById("recherche-planning").value.toLowerCase().trim();

const liste = donnees.evenements
.filter(function(event) {
return event.nom.toLowerCase().includes(recherche);
})
.sort(function(a, b) {
return (a.date + a.heure).localeCompare(b.date + b.heure);
});

const zone = document.getElementById("liste-planning");

if (liste.length === 0) {

zone.innerHTML =
"<div class='empty-state'>" +
"<span>📅</span>" +
"<strong>Aucun événement</strong>" +
"<p>Ton planning est vide.</p>" +
"</div>";

return;
}

zone.innerHTML = liste.map(function(event) {

return `

<div class="event-card">
<div class="event-card-top">
<span class="big-icon">${event.icone}</span>
<span class="card-date">${echapper(formatDateLongue(event.date))}</span>
</div>

<h3>${echapper(event.nom)}</h3>
<p>${event.heure ? "🕐 " + echapper(event.heure) : "Toute la journée"}</p>

<div class="item-buttons" style="margin-top:14px;">
<button class="icon-button" data-action="edit-event" data-id="${event.id}">✏️</button>
<button class="icon-button delete" data-action="delete-event" data-id="${event.id}">🗑️</button>
</div>
</div>
`;

}).join("");

}

function afficherNotes() {

const recherche = document.getElementById("recherche-notes").value.toLowerCase().trim();

const liste = donnees.notes.filter(function(note) {
return note.titre.toLowerCase().includes(recherche) ||
note.contenu.toLowerCase().includes(recherche);
});

const zone = document.getElementById("liste-notes");

if (liste.length === 0) {

zone.innerHTML =
"<div class='empty-state'>" +
"<span>📝</span>" +
"<strong>Aucune note</strong>" +
"<p>Écris ta première note.</p>" +
"</div>";

return;
}

zone.innerHTML = liste.map(function(note) {

return `

<div class="note-card">
<div class="note-card-top">
<strong>${echapper(note.titre)}</strong>
<span class="card-date">${echapper(formatDateFr(note.date.slice(0, 10)))}</span>
</div>

<p class="note-content">${echapper(note.contenu)}</p>

<div class="item-buttons" style="margin-top:14px;">
<button class="icon-button" data-action="edit-note" data-id="${note.id}">✏️</button>
<button class="icon-button delete" data-action="delete-note" data-id="${note.id}">🗑️</button>
</div>
</div>
`;

}).join("");

}

function afficherBudget() {

const maintenant = new Date();
const moisActuel = maintenant.getFullYear() + "-" + String(maintenant.getMonth() + 1).padStart(2, "0");

const depensesDuMois = donnees.depenses.filter(function(depense) {
return depense.date.startsWith(moisActuel);
});

const total = depensesDuMois.reduce(function(somme, depense) {
return somme + Number(depense.montant);
}, 0);

document.getElementById("total-budget").textContent = argent(total);

const zone = document.getElementById("liste-depenses");

if (depensesDuMois.length === 0) {

zone.innerHTML =
"<div class='empty-state'>" +
"<span>💰</span>" +
"<strong>Aucune dépense ce mois-ci</strong>" +
"<p>Ton budget est vide pour le moment.</p>" +
"</div>";

return;
}

zone.innerHTML = depensesDuMois
.sort(function(a, b) {
return b.date.localeCompare(a.date);
})
.map(function(depense) {

return `

<div class="expense-card">
<div class="expense-top">
<div>
<strong>${echapper(depense.nom)}</strong>
<div class="item-meta">
<span class="badge">${echapper(depense.categorie)}</span>
<span class="badge">${echapper(formatDateFr(depense.date))}</span>
</div>
</div>

<strong class="expense-amount">
${echapper(argent(depense.montant))}
</strong>
</div>

<div class="item-buttons" style="margin-top:14px;">
<button class="icon-button" data-action="edit-expense" data-id="${depense.id}">✏️</button>
<button class="icon-button delete" data-action="delete-expense" data-id="${depense.id}">🗑️</button>
</div>
</div>
`;

}).join("");

}

function afficherMaman() {

const image = document.getElementById("photo-maman");
const placeholder = document.getElementById("photo-placeholder");

if (donnees.maman.photo) {

image.src = donnees.maman.photo;
image.hidden = false;
placeholder.hidden = true;

} else {

image.hidden = true;
placeholder.hidden = false;

}

}

function afficherTout() {

afficherDate();
afficherProfil();
afficherCompteurs();
afficherProgression();
afficherAccueil();
afficherTaches();
afficherCourses();
afficherRepas();
afficherPlanning();
afficherNotes();
afficherBudget();
afficherMaman();
appliquerTheme();

}

function ouvrirModal(id) {
document.getElementById(id).classList.add("open");
}

function fermerModales() {

document.querySelectorAll(".modal").forEach(function(modal) {
modal.classList.remove("open");
});

idEdition = null;

}

function ouvrirNouvelleTache() {

idEdition = null;

document.getElementById("titre-modal-tache").textContent = "Nouvelle tâche";
document.getElementById("tache-nom").value = "";
document.getElementById("tache-categorie").value = "Maison";
document.getElementById("tache-priorite").value = "normale";
document.getElementById("tache-date").value = "";
document.getElementById("tache-recurrence").value = "aucune";
document.getElementById("tache-intervalle").value = "2";

afficherChampIntervalle();
ouvrirModal("modal-tache");

}

function modifierTache(id) {

const tache = donnees.taches.find(function(element) {
return element.id === id;
});

if (!tache) {
return;
}

idEdition = id;

document.getElementById("titre-modal-tache").textContent = "Modifier la tâche";
document.getElementById("tache-nom").value = tache.nom;
document.getElementById("tache-categorie").value = tache.categorie;
document.getElementById("tache-priorite").value = tache.priorite;
document.getElementById("tache-date").value = tache.date;
document.getElementById("tache-recurrence").value = tache.recurrence;
document.getElementById("tache-intervalle").value = tache.intervalle;

afficherChampIntervalle();
ouvrirModal("modal-tache");

}

function afficherChampIntervalle() {

const visible =
document.getElementById("tache-recurrence").value === "intervalle";

document.getElementById("tache-intervalle").classList.toggle("hidden", !visible);
document.getElementById("label-intervalle").classList.toggle("hidden", !visible);

}

function enregistrerTache() {

const nom = document.getElementById("tache-nom").value.trim();

if (!nom) {
return;
}

const objet = {
nom: nom,
categorie: document.getElementById("tache-categorie").value,
priorite: document.getElementById("tache-priorite").value,
date: document.getElementById("tache-date").value,
recurrence: document.getElementById("tache-recurrence").value,
intervalle: Number(document.getElementById("tache-intervalle").value) || 2
};

if (idEdition) {

const tache = donnees.taches.find(function(element) {
return element.id === idEdition;
});

if (tache) {
Object.assign(tache, objet);
}

afficherToast("Tâche modifiée ✏️");

} else {

donnees.taches.push({
id: idUnique(),
...objet,
terminee: false,
creee: new Date().toISOString()
});

afficherToast("Tâche ajoutée ✅");
}

sauvegarder();
fermerModales();
afficherTout();

}

function changerEtatTache(id, terminee) {

const tache = donnees.taches.find(function(element) {
return element.id === id;
});

if (!tache) {
return;
}

const ancienEtat = tache.terminee;

tache.terminee = terminee;

if (!ancienEtat && terminee && tache.recurrence !== "aucune") {

const prochaineDate = prochaineDateTache(tache);

donnees.taches.push({
...tache,
id: idUnique(),
date: prochaineDate,
terminee: false,
creee: new Date().toISOString()
});

afficherToast("Tâche récurrente suivante créée 🔄");
}

sauvegarder();
afficherTout();

}

function prochaineDateTache(tache) {

const base = tache.date
? new Date(tache.date + "T12:00:00")
: new Date();

if (tache.recurrence === "quotidienne") {
base.setDate(base.getDate() + 1);
}

if (tache.recurrence === "hebdomadaire") {
base.setDate(base.getDate() + 7);
}

if (tache.recurrence === "intervalle") {
base.setDate(base.getDate() + tache.intervalle);
}

return formatDateInput(base);

}

function supprimerTache(id) {

if (!confirm("Supprimer cette tâche ?")) {
return;
}

donnees.taches = donnees.taches.filter(function(tache) {
return tache.id !== id;
});

sauvegarder();
afficherTout();
afficherToast("Tâche supprimée 🗑️");

}

function nettoyerTaches() {

const nombre = donnees.taches.filter(function(tache) {
return tache.terminee;
}).length;

if (nombre === 0) {
afficherToast("Aucune tâche terminée à nettoyer.");
return;
}

if (!confirm("Supprimer les " + nombre + " tâche(s) terminée(s) ?")) {
return;
}

donnees.taches = donnees.taches.filter(function(tache) {
return !tache.terminee;
});

sauvegarder();
afficherTout();
afficherToast("Tâches terminées supprimées 🧹");

}

function ouvrirNouvelleCourse() {

idEdition = null;

document.getElementById("titre-modal-course").textContent = "Ajouter une course";
document.getElementById("course-nom").value = "";
document.getElementById("course-quantite").value = "";
document.getElementById("course-categorie").value = "Alimentation";

ouvrirModal("modal-course");

}

function modifierCourse(id) {

const course = donnees.courses.find(function(element) {
return element.id === id;
});

if (!course) {
return;
}

idEdition = id;

document.getElementById("titre-modal-course").textContent = "Modifier la course";
document.getElementById("course-nom").value = course.nom;
document.getElementById("course-quantite").value = course.quantite;
document.getElementById("course-categorie").value = course.categorie;

ouvrirModal("modal-course");

}

function enregistrerCourse() {

const nom = document.getElementById("course-nom").value.trim();

if (!nom) {
return;
}

const objet = {
nom: nom,
quantite: document.getElementById("course-quantite").value.trim(),
categorie: document.getElementById("course-categorie").value
};

if (idEdition) {

const course = donnees.courses.find(function(element) {
return element.id === idEdition;
});

Object.assign(course, objet);

afficherToast("Course modifiée ✏️");

} else {

donnees.courses.push({
id: idUnique(),
...objet,
achetee: false
});

afficherToast("Course ajoutée 🛒");
}

sauvegarder();
fermerModales();
afficherTout();

}

function changerEtatCourse(id, achetee) {

const course = donnees.courses.find(function(element) {
return element.id === id;
});

if (!course) {
return;
}

course.achetee = achetee;

sauvegarder();
afficherTout();

}

function supprimerCourse(id) {

if (!confirm("Supprimer cet article ?")) {
return;
}

donnees.courses = donnees.courses.filter(function(course) {
return course.id !== id;
});

sauvegarder();
afficherTout();
afficherToast("Article supprimé 🗑️");

}

function nettoyerCourses() {

const nombre = donnees.courses.filter(function(course) {
return course.achetee;
}).length;

if (nombre === 0) {
afficherToast("Aucun article acheté à nettoyer.");
return;
}

if (!confirm("Supprimer les " + nombre + " article(s) acheté(s) ?")) {
return;
}

donnees.courses = donnees.courses.filter(function(course) {
return !course.achetee;
});

sauvegarder();
afficherTout();
afficherToast("Courses achetées supprimées 🧹");

}

function ouvrirNouveauRepas() {

idEdition = null;

document.getElementById("titre-modal-repas").textContent = "Ajouter un repas";
document.getElementById("repas-date").value = dateDansXJours(0);
document.getElementById("repas-type").value = "Dîner";
document.getElementById("repas-nom").value = "";

ouvrirModal("modal-repas");

}

function modifierRepas(id) {

const repas = donnees.repas.find(function(element) {
return element.id === id;
});

if (!repas) {
return;
}

idEdition = id;

document.getElementById("titre-modal-repas").textContent = "Modifier le repas";
document.getElementById("repas-date").value = repas.date;
document.getElementById("repas-type").value = repas.type;
document.getElementById("repas-nom").value = repas.nom;

ouvrirModal("modal-repas");

}

function enregistrerRepas() {

const nom = document.getElementById("repas-nom").value.trim();

if (!nom) {
return;
}

const objet = {
date: document.getElementById("repas-date").value,
type: document.getElementById("repas-type").value,
nom: nom
};

if (idEdition) {

const repas = donnees.repas.find(function(element) {
return element.id === idEdition;
});

Object.assign(repas, objet);

afficherToast("Repas modifié 🍝");

} else {

donnees.repas.push({
id: idUnique(),
...objet
});

afficherToast("Repas ajouté 🍝");
}

sauvegarder();
fermerModales();
afficherTout();

}

function supprimerRepas(id) {

if (!confirm("Supprimer ce repas ?")) {
return;
}

donnees.repas = donnees.repas.filter(function(repas) {
return repas.id !== id;
});

sauvegarder();
afficherTout();
afficherToast("Repas supprimé 🗑️");

}

function ideeRepas() {

const idee = ideesRepas[Math.floor(Math.random() * ideesRepas.length)];

document.getElementById("repas-date").value = dateDansXJours(0);
document.getElementById("repas-type").value = "Dîner";
document.getElementById("repas-nom").value = idee;

idEdition = null;

document.getElementById("titre-modal-repas").textContent = "Idée de repas";
ouvrirModal("modal-repas");

}

function ouvrirNouvelEvenement() {

idEdition = null;

document.getElementById("titre-modal-evenement").textContent = "Ajouter un événement";
document.getElementById("event-nom").value = "";
document.getElementById("event-date").value = dateDansXJours(0);
document.getElementById("event-heure").value = "";
document.getElementById("event-icone").value = "📅";

ouvrirModal("modal-evenement");

}

function modifierEvenement(id) {

const event = donnees.evenements.find(function(element) {
return element.id === id;
});

if (!event) {
return;
}

idEdition = id;

document.getElementById("titre-modal-evenement").textContent = "Modifier l'événement";
document.getElementById("event-nom").value = event.nom;
document.getElementById("event-date").value = event.date;
document.getElementById("event-heure").value = event.heure;
document.getElementById("event-icone").value = event.icone;

ouvrirModal("modal-evenement");

}

function enregistrerEvenement() {

const nom = document.getElementById("event-nom").value.trim();

if (!nom) {
return;
}

const objet = {
nom: nom,
date: document.getElementById("event-date").value,
heure: document.getElementById("event-heure").value,
icone: document.getElementById("event-icone").value
};

if (idEdition) {

const event = donnees.evenements.find(function(element) {
return element.id === idEdition;
});

Object.assign(event, objet);

afficherToast("Événement modifié 📅");

} else {

donnees.evenements.push({
id: idUnique(),
...objet
});

afficherToast("Événement ajouté 📅");
}

sauvegarder();
fermerModales();
afficherTout();

}

function supprimerEvenement(id) {

if (!confirm("Supprimer cet événement ?")) {
return;
}

donnees.evenements = donnees.evenements.filter(function(event) {
return event.id !== id;
});

sauvegarder();
afficherTout();
afficherToast("Événement supprimé 🗑️");

}

function ouvrirNouvelleNote() {

idEdition = null;

document.getElementById("titre-modal-note").textContent = "Nouvelle note";
document.getElementById("note-titre").value = "";
document.getElementById("note-contenu").value = "";

ouvrirModal("modal-note");

}

function modifierNote(id) {

const note = donnees.notes.find(function(element) {
return element.id === id;
});

if (!note) {
return;
}

idEdition = id;

document.getElementById("titre-modal-note").textContent = "Modifier la note";
document.getElementById("note-titre").value = note.titre;
document.getElementById("note-contenu").value = note.contenu;

ouvrirModal("modal-note");

}

function enregistrerNote() {

const titre = document.getElementById("note-titre").value.trim();
const contenu = document.getElementById("note-contenu").value.trim();

if (!titre || !contenu) {
return;
}

if (idEdition) {

const note = donnees.notes.find(function(element) {
return element.id === idEdition;
});

note.titre = titre;
note.contenu = contenu;

afficherToast("Note modifiée 📝");

} else {

donnees.notes.push({
id: idUnique(),
titre: titre,
contenu: contenu,
date: new Date().toISOString()
});

afficherToast("Note ajoutée 📝");
}

sauvegarder();
fermerModales();
afficherTout();

}

function supprimerNote(id) {

if (!confirm("Supprimer cette note ?")) {
return;
}

donnees.notes = donnees.notes.filter(function(note) {
return note.id !== id;
});

sauvegarder();
afficherTout();
afficherToast("Note supprimée 🗑️");

}

function ouvrirNouvelleDepense() {

idEdition = null;

document.getElementById("depense-nom").value = "";
document.getElementById("depense-montant").value = "";
document.getElementById("depense-categorie").value = "Courses";
document.getElementById("depense-date").value = dateDansXJours(0);

ouvrirModal("modal-depense");

}

function modifierDepense(id) {

const depense = donnees.depenses.find(function(element) {
return element.id === id;
});

if (!depense) {
return;
}

idEdition = id;

document.getElementById("depense-nom").value = depense.nom;
document.getElementById("depense-montant").value = depense.montant;
document.getElementById("depense-categorie").value = depense.categorie;
document.getElementById("depense-date").value = depense.date;

ouvrirModal("modal-depense");

}

function enregistrerDepense() {

const nom = document.getElementById("depense-nom").value.trim();
const montant = Number(document.getElementById("depense-montant").value);

if (!nom || !montant || montant < 0) {
return;
}

const objet = {
nom: nom,
montant: montant,
categorie: document.getElementById("depense-categorie").value,
date: document.getElementById("depense-date").value
};

if (idEdition) {

const depense = donnees.depenses.find(function(element) {
return element.id === idEdition;
});

Object.assign(depense, objet);

afficherToast("Dépense modifiée 💰");

} else {

donnees.depenses.push({
id: idUnique(),
...objet
});

afficherToast("Dépense ajoutée 💰");
}

sauvegarder();
fermerModales();
afficherTout();

}

function supprimerDepense(id) {

if (!confirm("Supprimer cette dépense ?")) {
return;
}

donnees.depenses = donnees.depenses.filter(function(depense) {
return depense.id !== id;
});

sauvegarder();
afficherTout();
afficherToast("Dépense supprimée 🗑️");

}

function enregistrerNom() {

const nom = document.getElementById("nom-maman-input").value.trim();

donnees.profil.nom = nom || "Maman";

sauvegarder();
afficherTout();
afficherToast("Nom enregistré ❤️");

}

function appliquerTheme() {

document.body.classList.toggle("dark", donnees.profil.theme === "dark");

const bouton = document.querySelector(".header-button");

if (bouton) {
bouton.textContent = donnees.profil.theme === "dark" ? "☀️" : "🌙";
}

}

function changerTheme() {

donnees.profil.theme =
donnees.profil.theme === "dark"
? "light"
: "dark";

sauvegarder();
appliquerTheme();
afficherToast("Thème modifié ✨");

}

function exporterDonnees() {

const contenu = JSON.stringify(donnees, null, 2);
const fichier = new Blob([contenu], {
type: "application/json"
});

const url = URL.createObjectURL(fichier);
const lien = document.createElement("a");

lien.href = url;
lien.download = "maison-sauvegarde.json";
lien.click();

URL.revokeObjectURL(url);

afficherToast("Sauvegarde exportée 📤");

}

function importerDonnees() {
document.getElementById("import-file").click();
}

function traiterImport(fichier) {

if (!fichier) {
return;
}

const lecteur = new FileReader();

lecteur.onload = function(event) {

try {

const importation = JSON.parse(event.target.result);

if (!importation || typeof importation !== "object") {
throw new Error("Format invalide");
}

localStorage.setItem(
CLE_SAUVEGARDE,
JSON.stringify(importation)
);

donnees = chargerDonnees();

afficherTout();

afficherToast("Données importées 📥");

} catch (erreur) {

console.error(erreur);
alert("Impossible d'importer ce fichier JSON.");
}
};

lecteur.readAsText(fichier);

}

function reinitialiser() {

const confirmation = confirm(
"⚠️ ATTENTION\n\n" +
"Toutes les tâches, courses, repas, notes, événements, dépenses, photo et message seront supprimés.\n\n" +
"L'application redeviendra complètement vide.\n\n" +
"Continuer ?"
);

if (!confirmation) {
return;
}

donnees = structureVide();

sauvegarder();
afficherTout();

ouvrirPage("accueil");

afficherToast("Application réinitialisée 🧹");

}

function supprimerPhoto() {

if (!donnees.maman.photo) {
afficherToast("Aucune photo à supprimer.");
return;
}

if (!confirm("Supprimer la photo ?")) {
return;
}

donnees.maman.photo = "";

sauvegarder();
afficherMaman();

afficherToast("Photo supprimée 🗑️");

}

function chargerPhoto(fichier) {

if (!fichier) {
return;
}

if (!fichier.type.startsWith("image/")) {
alert("Ce fichier n'est pas une image.");
return;
}

const lecteur = new FileReader();

lecteur.onload = function(event) {

donnees.maman.photo = event.target.result;

sauvegarder();
afficherMaman();

afficherToast("Photo enregistrée 📸");
};

lecteur.readAsDataURL(fichier);

}

function afficherToast(message) {

const conteneur = document.getElementById("toast-container");

const toast = document.createElement("div");
toast.className = "toast";
toast.textContent = message;

conteneur.appendChild(toast);

setTimeout(function() {
toast.remove();
}, 2800);

}

document.addEventListener("click", function(event) {

const pageButton = event.target.closest("[data-page]");

if (pageButton) {
ouvrirPage(pageButton.dataset.page);
return;
}

const actionButton = event.target.closest("[data-action]");

if (!actionButton) {
return;
}

const action = actionButton.dataset.action;
const id = actionButton.dataset.id;

if (action === "open-task") ouvrirNouvelleTache();
if (action === "open-course") ouvrirNouvelleCourse();
if (action === "open-meal") ouvrirNouveauRepas();
if (action === "open-event") ouvrirNouvelEvenement();
if (action === "open-note") ouvrirNouvelleNote();
if (action === "open-expense") ouvrirNouvelleDepense();

if (action === "edit-task") modifierTache(id);
if (action === "edit-meal") modifierRepas(id);
if (action === "edit-event") modifierEvenement(id);
if (action === "edit-note") modifierNote(id);
if (action === "edit-expense") modifierDepense(id);

if (action === "delete-task") supprimerTache(id);
if (action === "delete-course") supprimerCourse(id);
if (action === "delete-meal") supprimerRepas(id);
if (action === "delete-event") supprimerEvenement(id);
if (action === "delete-note") supprimerNote(id);
if (action === "delete-expense") supprimerDepense(id);

if (action === "clean-tasks") nettoyerTaches();
if (action === "clean-courses") nettoyerCourses();

if (action === "random-meal") ideeRepas();

if (action === "toggle-theme") changerTheme();
if (action === "save-name") enregistrerNom();

if (action === "export-data") exporterDonnees();
if (action === "import-data") importerDonnees();
if (action === "reset-data") reinitialiser();

if (action === "close-modal") fermerModales();

});

document.addEventListener("change", function(event) {

if (event.target.matches("[data-task-id]")) {
changerEtatTache(
event.target.dataset.taskId,
event.target.checked
);
}

if (event.target.matches("[data-course-id]")) {
changerEtatCourse(
event.target.dataset.courseId,
event.target.checked
);
}

if (event.target.id === "tache-recurrence") {
afficherChampIntervalle();
}

if (event.target.id === "filtre-taches" ||
event.target.id === "tri-taches") {
afficherTaches();
}

if (event.target.id === "filtre-courses") {
afficherCourses();
}

if (event.target.id === "import-file") {
traiterImport(event.target.files[0]);
event.target.value = "";
}

});

document.addEventListener("input", function(event) {

if (event.target.id === "recherche-taches") {
afficherTaches();
}

if (event.target.id === "recherche-courses") {
afficherCourses();
}

if (event.target.id === "recherche-planning") {
afficherPlanning();
}

if (event.target.id === "recherche-notes") {
afficherNotes();
}

});

document.addEventListener("submit", function(event) {

event.preventDefault();

if (event.target.id === "form-tache") {
enregistrerTache();
}

if (event.target.id === "form-course") {
enregistrerCourse();
}

if (event.target.id === "form-repas") {
enregistrerRepas();
}

if (event.target.id === "form-evenement") {
enregistrerEvenement();
}

if (event.target.id === "form-note") {
enregistrerNote();
}

if (event.target.id === "form-depense") {
enregistrerDepense();
}

});

document.addEventListener("keydown", function(event) {

if (event.key === "Escape") {
fermerModales();
}

});

document.querySelectorAll(".modal").forEach(function(modal) {

modal.addEventListener("click", function(event) {

if (event.target === modal) {
fermerModales();
}

});

});

document.addEventListener("DOMContentLoaded", function() {

afficherTout();

console.log("🏠 Maison MAX chargée !");

});
