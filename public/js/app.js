let auth0 = null;
const fetchAuthConfig = () => fetch("/auth_config.json");

const configureClient = async () => {
    console.log('into configClient!');

    const response = await fetchAuthConfig();
    const config = await response.json();

    console.log('Oplya');
    auth0 = await createAuth0Client({
        domain: config.domain,
        client_id: config.clientId
    });
    console.log('Zdesya');
    console.log(auth0);
    console.log('Tuta');

};

window.onload = async () => {
    console.log('Into window onload');
    await configureClient();
    updateUI();
    const isAuthenticated = await auth0.isAuthenticated();

    if (isAuthenticated) {
        console.log('AUTHENTIFICATED TRUE!');
        // show the gated content
        return;
    }

    const query = window.location.search;
    if (query.includes("code=") && query.includes("state=")) {
        console.log('Into STRANGE function!');
        // Process the login state
        await auth0.handleRedirectCallback();

        updateUI();

        // Use replaceState to redirect the user away and remove the querystring parameters
        window.history.replaceState({}, document.title, "/");
    }
};

const updateUI = async () => {
    console.log('INTO UpdateUI!!!');
    const isAuthenticated = await auth0.isAuthenticated();
    console.log(isAuthenticated);

    document.getElementById("btn-logout").disabled = !isAuthenticated;
    document.getElementById("btn-login").disabled = isAuthenticated;

    document.getElementById("btn-logout").hidden = !isAuthenticated;
    document.getElementById("btn-login").hidden = isAuthenticated;

    if (isAuthenticated) {
        document.getElementById("gated-content").classList.remove("hidden");

        document.getElementById(
            "ipt-access-token"
        ).innerHTML = await auth0.getTokenSilently();

        document.getElementById("ipt-user-profile").innerHTML = JSON.stringify(
            await auth0.getUser()
        );
        let user_info = await auth0.getUser();
        console.log(user_info);
        document.getElementById("profile-name").innerHTML =  user_info["name"];
        document.getElementById("profile-avatar").hidden = false;
        document.getElementById("profile-avatar").src = user_info["picture"];

    } else {
        document.getElementById("gated-content").classList.add("hidden");
    }
};

const login = async () => {
    await auth0.loginWithRedirect({
        redirect_uri: window.location.origin
    });
};


const logout = () => {
    auth0.logout({
        returnTo: window.location.origin
    });
};

function addInstance() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/addInstance', true);
    xhr.onload = function () {
        document.getElementById("res_instance").innerHTML = 'created';
        document.getElementById("inst_id").innerHTML = xhr.responseText;

    };
    xhr.onerror = function () {
        console.log("Some error occurred - msg from onerror func");
    };
    xhr.send();
}

function deleteInstance() {
    console.log("Click Delete");
    const xhr = new XMLHttpRequest();
    let inst_id = document.getElementById("inst_id").innerHTML;
    // let inst_id = 'i-0000';
    console.log(inst_id);
    xhr.open('POST', '/deleteInstance?id='+inst_id, true);

    xhr.onload = function () {
        document.getElementById("res_instance").innerHTML ='deleted';
    };
    xhr.onerror = function () {
        console.log("Some error occurred - msg from onerror func");
    };
    xhr.send();

}