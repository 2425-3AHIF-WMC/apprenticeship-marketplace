import Keycloak from 'keycloak-js';

const keycloakConfig = {
    url: 'https://auth.htl-leonding.ac.at',
    realm: 'htlleonding',
    clientId: 'htlleonding-service',
    onLoad: 'check-sso',
    silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
    checkLoginIframe: false,
    enableLogging: true,
    pkceMethod: 'S256',
    flow: 'standard'
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak; 