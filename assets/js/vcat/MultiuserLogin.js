$(".navSwitchAccount").click(function() {
    switchAccount();
});

function switchAccount() {
    if (accountSlot == 1) {
        if (!secondAccountToken) {
            if (!secondAccountID) {
                requestLogin();
            }
        } else {
            setItem('multi_slot', 2);
            window.location.href = "main.html";
        }
    } else {
        setItem('multi_slot', 1);
        window.location.href = "main.html";
    }
}

function requestLogin() {
    setItem('multi_login_request', 1);
    window.location.href = "index.html";
}