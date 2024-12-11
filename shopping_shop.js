        class GestionBoutique {
            constructor() {
                this.clients = [];
                this.ventes = [];
                this.promotions = [];
                this.initEventListeners();
                this.loadFromLocalStorage();
            }

            initEventListeners() {
                
                document.getElementById('nouveauClientBtn').addEventListener('click', () => this.openModal('nouveauClientModal'));
                document.getElementById('listeClientsBtn').addEventListener('click', () => {
                    this.afficherListeClients();
                    this.openModal('listeClientsModal');
                })
                    this.closeModal('listeClientsModal');
                ;
                document.getElementById('ventesBtn').addEventListener('click', () => {
                    this.populerClientsVente();
                    this.openModal('ventesModal');
                });
                document.getElementById('promotionsBtn').addEventListener('click', () => this.openModal('promotionsModal'));

                
                document.getElementById('fermerNouveauClientModal').addEventListener('click', () => this.closeModal('nouveauClientModal'));
                document.getElementById('fermerListeClientsModal').addEventListener('click', () => this.closeModal('listeClientsModal'));
                document.getElementById('fermerVentesModal').addEventListener('click', () => this.closeModal('ventesModal'));
                document.getElementById('fermerPromotionsModal').addEventListener('click', () => this.closeModal('promotionsModal'));
                document.getElementById('fermerEditClientModal').addEventListener('click', () => this.closeModal('editClientModal'));

                
                document.getElementById('nouveauClientForm').addEventListener('submit', (e) => this.ajouterClient(e));
                document.getElementById('editClientForm').addEventListener('submit', (e) => this.modifierClient(e));
                document.getElementById('nouvelleVenteForm').addEventListener('submit', (e) => this.ajouterVente(e));
                document.getElementById('nouvellePromotionForm').addEventListener('submit', (e) => this.ajouterPromotion(e));

                // Recherche de clients
                document.getElementById('rechercheClient').addEventListener('input', (e) => this.rechercherClients(e.target.value));

                // Validation des formulaires
                this.setupFormValidation();
            }

            setupFormValidation() {
                const prenomInput = document.querySelector('input[name="prenom"]');
                const nomInput = document.querySelector('input[name="nom"]');
                const telephoneInput = document.querySelector('input[name="telephone"]');
                const emailInput = document.querySelector('input[name="email"]');

                const validatePrenom = () => {
                    const prenomError = document.getElementById('prenomError');
                    if (prenomInput.value.length < 2) {
                        prenomError.textContent = 'Le prénom doit contenir au moins 2 caractères';
                        return false;
                    }
                    prenomError.textContent = '';
                    return true;
                };

                const validateNom = () => {
                    const nomError = document.getElementById('nomError');
                    if (nomInput.value.length < 2) {
                        nomError.textContent = 'Le nom doit contenir au moins 2 caractères';
                        return false;
                    }
                    nomError.textContent = '';
                    return true;
                };

                const validateTelephone = () => {
                    const telephoneError = document.getElementById('telephoneError');
                    const telephoneRegex = /^[0-9]{0}$/;
                    if (!telephoneRegex.test(telephoneInput.value)) {
                        telephoneError.textContent = 'Numéro de téléphone invalide (10 chiffres)';
                        return false;
                    }
                    telephoneError.textContent = '';
                    return true;
                };

                const validateEmail = () => {
                    const emailError = document.getElementById('emailError');
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(emailInput.value)) {
                        emailError.textContent = 'Adresse email invalide';
                        return false;
                    }
                    emailError.textContent = '';
                    return true;
                };

                prenomInput.addEventListener('input', validatePrenom);
                nomInput.addEventListener('input', validateNom);
                telephoneInput.addEventListener('input', validateTelephone);
                emailInput.addEventListener('input', validateEmail);
            }

            openModal(modalId) {
                document.getElementById(modalId).style.display = 'flex';
            }

            closeModal(modalId) {
                document.getElementById(modalId).style.display = 'none';
            }

            ajouterClient(e) {
                e.preventDefault();
                const form = e.target;
                const client = {
                    id: Date.now(), // Unique identifier
                    prenom: form.prenom.value,
                    nom: form.nom.value,
                    telephone: form.telephone.value,
                    email: form.email.value,
                    dateNaissance: form.dateNaissance.value,
                    adresse: form.adresse.value
                };

                this.clients.push(client);
                this.sauvegarderDansLocalStorage();
                form.reset();
                this.closeModal('nouveauClientModal');
                console.log('Client ajouté', client);
            }

            modifierClient(e) {
                e.preventDefault();
                const form = e.target;
                const clientIndex = this.clients.findIndex(c => c.id === parseInt(form.clientIndex.value));

                if (clientIndex !== -1) {
                    this.clients[clientIndex] = {
                        id: this.clients[clientIndex].id, // Conserver l'ID original
                        prenom: form.prenom.value,
                        nom: form.nom.value,
                        telephone: form.telephone.value,
                        email: form.email.value,
                        dateNaissance: form.dateNaissance.value,
                        adresse: form.adresse.value
                    };

                    this.sauvegarderDansLocalStorage();
                    this.afficherListeClients(); // Actualiser la liste
                    this.closeModal('editClientModal');
                }
            }

            afficherListeClients() {
                const container = document.getElementById('listeClientsContainer');
                container.innerHTML = this.clients.length === 0 
                    ? '<p>Aucun client enregistré</p>'
                    : this.clients.map((client, index) => `
                        <div class="list-item">
                            <div class="list-item-details">
                            <div class="list-item-details">
                                <strong>${client.prenom} ${client.nom}</strong>
                                <br>
                                <small>${client.telephone} | ${client.email}</small>
                                ${client.adresse ? `<br><small>Adresse : ${client.adresse}</small>` : ''}
                                ${client.dateNaissance ? `<br><small>Né(e) le : ${client.dateNaissance}</small>` : ''}
                            </div>
                            <div>
                                <button class="btn btn-edit" onclick="app.ouvrirEditionClient(${client.id})">Éditer</button>
                                <button class="btn btn-delete" onclick="app.supprimerClient(${client.id})">Supprimer</button>
                            </div>
                        </div>
                    `).join('');
            }

            rechercherClients(terme) {
                terme = terme.toLowerCase().trim();
                const clientsFiltres = this.clients.filter(client => 
                    client.prenom.toLowerCase().includes(terme) || 
                    client.nom.toLowerCase().includes(terme) ||
                    client.telephone.includes(terme) ||
                    client.email.toLowerCase().includes(terme)
                );

                const container = document.getElementById('listeClientsContainer');
                container.innerHTML = clientsFiltres.length === 0 
                    ? '<p>Aucun client trouvé</p>'
                    : clientsFiltres.map((client) => `
                            <div class="list-item-details">
                                <strong>${client.prenom} ${client.nom}</strong>
                                <br>
                                <small>${client.telephone} | ${client.email}</small>
                                ${client.adresse ? `<br><small>Adresse : ${client.adresse}</small>` : ''}
                                ${client.dateNaissance ? `<br><small>Né(e) le : ${client.dateNaissance}</small>` : ''}
                            </div>
                            <div>
                                <button class="btn btn-edit" onclick="app.ouvrirEditionClient(${client.id})">Éditer</button>
                                <button class="btn btn-delete" onclick="app.supprimerClient(${client.id})">Supprimer</button>
                            </div>
                        </div>
                    `).join('');
            }

            ouvrirEditionClient(clientId) {
                const client = this.clients.find(c => c.id === clientId);
                if (client) {
                    const form = document.getElementById('editClientForm');
                    form.clientIndex.value = clientId;
                    form.prenom.value = client.prenom;
                    form.nom.value = client.nom;
                    form.telephone.value = client.telephone;
                    form.email.value = client.email;
                    form.dateNaissance.value = client.dateNaissance;
                    form.adresse.value = client.adresse;
                    
                    this.openModal('editClientModal');
                }
            }

            supprimerClient(clientId) {
                const confirmation = confirm('Êtes-vous sûr de vouloir supprimer ce client ?');
                if (confirmation) {
                    // Supprimer le client
                    this.clients = this.clients.filter(c => c.id !== clientId);
                    
                    // Supprimer les ventes associées
                    this.ventes = this.ventes.filter(v => v.clientId !== clientId);
                    
                    this.sauvegarderDansLocalStorage();
                    this.afficherListeClients();
                }
            }

            populerClientsVente() {
                const select = document.getElementById('clientVente');
                select.innerHTML = '<option value="">Sélectionner un client</option>' +
                    this.clients.map((client) => 
                        `<option value="${client.id}">${client.prenom} ${client.nom}</option>`
                    ).join('');
            }

            ajouterVente(e) {
                e.preventDefault();
                const form = e.target;
                const clientId = form.clientVente.value;
                
                if (clientId === '') {
                    alert('Veuillez sélectionner un client');
                    return;
                }

                const client = this.clients.find(c => c.id === parseInt(clientId));

                const vente = {
                    id: Date.now(),
                    clientId: parseInt(clientId),
                    client: client.prenom + ' ' + client.nom,
                    produit: form.produit.value,
                    prix: parseFloat(form.prix.value),
                    date: form.date.value
                };

                this.ventes.push(vente);
                this.sauvegarderDansLocalStorage();
                this.afficherVentes();
                form.reset();
                console.log('Vente ajoutée', vente);
            }

            afficherVentes() {
                const container = document.getElementById('listeVentesContainer');
                container.innerHTML = this.ventes.length === 0 
                    ? '<p>Aucune vente enregistrée</p>'
                    : this.ventes.map((vente, index) => `
                        <div class="list-item">
                            <div class="list-item-details">
                                <strong>${vente.client} - ${vente.produit}</strong>
                                <br>
                                <small>${vente.prix.toFixed(2)}€ | ${vente.date}</small>
                            </div>
                            <button class="btn btn-delete" onclick="app.supprimerVente(${vente.id})">Supprimer</button>
                        </div>
                    `).join('');
            }

            supprimerVente(venteId) {
                const confirmation = confirm('Êtes-vous sûr de vouloir supprimer cette vente ?');
                if (confirmation) {
                    this.ventes = this.ventes.filter(v => v.id !== venteId);
                    this.sauvegarderDansLocalStorage();
                    this.afficherVentes();
                }
            }

            ajouterPromotion(e) {
                e.preventDefault();
                const form = e.target;
                
                // Vérifier que la date de fin est après la date de début
                const dateDebut = new Date(form.dateDebut.value);
                const dateFin = new Date(form.dateFin.value);
                
                if (dateFin <= dateDebut) {
                    alert('La date de fin doit être après la date de début');
                    return;
                }

                const promotion = {
                    id: Date.now(),
                    code: form.code.value,
                    description: form.description.value,
                    reduction: parseFloat(form.reduction.value),
                    dateDebut: form.dateDebut.value,
                    dateFin: form.dateFin.value
                };

                this.promotions.push(promotion);
                this.sauvegarderDansLocalStorage();
                this.afficherPromotions();
                form.reset();
                console.log('Promotion ajoutée', promotion);
            }

            afficherPromotions() {
                const container = document.getElementById('listePromotionsContainer');
                container.innerHTML = this.promotions.length === 0 
                    ? '<p>Aucune promotion enregistrée</p>'
                    : this.promotions.map((promo) => `
                        <div class="list-item">
                            <div class="list-item-details">
                                <strong>${promo.code} - ${promo.reduction}%</strong>
                                <br>
                                <small>${promo.description}</small>
                                <br>
                                <small>Du ${promo.dateDebut} au ${promo.dateFin}</small>
                            </div>
                            <button class="btn btn-delete" onclick="app.supprimerPromotion(${promo.id})">Supprimer</button>
                        </div>
                    `).join('');
            }

            supprimerPromotion(promotionId) {
                const confirmation = confirm('Êtes-vous sûr de vouloir supprimer cette promotion ?');
                if (confirmation) {
                    this.promotions = this.promotions.filter(p => p.id !== promotionId);
                    this.sauvegarderDansLocalStorage();
                    this.afficherPromotions();
                }
            }

            // Méthodes de sauvegarde et de chargement
            sauvegarderDansLocalStorage() {
                localStorage.setItem('clients', JSON.stringify(this.clients));
                localStorage.setItem('ventes', JSON.stringify(this.ventes));
                localStorage.setItem('promotions', JSON.stringify(this.promotions));
            }

            loadFromLocalStorage() {
                const clientsSauvegardes = localStorage.getItem('clients');
                const ventesSauvegardees = localStorage.getItem('ventes');
                const promotionsSauvegardees = localStorage.getItem('promotions');

                if (clientsSauvegardes) this.clients = JSON.parse(clientsSauvegardes);
                if (ventesSauvegardees) this.ventes = JSON.parse(ventesSauvegardees);
                if (promotionsSauvegardees) this.promotions = JSON.parse(promotionsSauvegardees);
            }
        }

        // Initialisation de l'application
        const app = new GestionBoutique();
        window.app = app;
    
