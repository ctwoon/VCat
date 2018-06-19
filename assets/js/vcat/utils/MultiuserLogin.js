function switchAccount() {
    if (accountSlot == 1) {
        if (!secondAccountToken) {
            if (!secondAccountID) {
                requestLogin();
            }
        } else {
            setItem('VCat.MultiAccount.Slot', 2);
            window.location.href = "main.html";
        }
    } else {
        setItem('VCat.MultiAccount.Slot', 1);
        window.location.href = "main.html";
    }
}

function requestLogin() {
    setItem('VCat.MultiAccount.AuthRequest', 1);
    window.location.href = "index.html";
}