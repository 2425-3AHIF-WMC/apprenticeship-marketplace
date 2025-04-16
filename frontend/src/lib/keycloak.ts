import Keycloak from 'keycloak-js';

const keycloakConfig = {
    url: 'https://auth.htl-leonding.ac.at',
    realm: 'htlleonding',
    clientId: 'htlleonding-service'
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak; 