//General Config
var generalConfig = {
    expiration: function() {
        var now = new Date();
        now.setTime(now.getTime() + (7 * 24 * 60 * 60 * 1000));
        return now.toUTCString();
    }
}
//Admiral
window.admiral('addEventListener','measure.detected',writeMeasureCookies);
window.admiral('addEventListener','transact.subscribed',writeOfferCookies)
window.admiral('addEventListener','transact.loggedIn',handleLogin)
window.admiral('addEventListener','transact.loggedOut',handleLogout)
//Functions
function setupSite() {
    var subscriberToken = readCookie('state');
    if (subscriberToken === 'subscribed') {
        return;
    }
    loadAds();
}
function readCookie(cookie) {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var keyvalues = cookies[i].split('=');
        var key = keyvalues[0].trim();
        if (cookie === key) {
            var value = keyvalues[1].trim();
            return value;
        }
    }
}
function writeOfferCookies(subscriptions) {
    if (subscriptions) {
        localStorage.setItem('subscriptions', JSON.stringify(subscriptions));
        subscriptions.offers.forEach(function(offer) {
            if(!offer.addon) {
                document.cookie = "offerID=" + offer.offerID + ";expires=" + generalConfig.expiration() + ";path=/";
                document.cookie = "offerType=" + offer.offerType + ";expires=" + generalConfig.expiration() + ";path=/";
            }
        })
        return;
    }
}
function writeMeasureCookies(data) {
    if (!data.subscribed) {
        document.cookie = "state=;expires=" + generalConfig.expiration() + ";path=/";
        localStorage.removeItem('subscriptions');
        document.cookie = "offerType=;expires=" + generalConfig.expiration() + ";path=/";
        document.cookie = "offerID=;expires=" + generalConfig.expiration() + ";path=/";
        return;
    } 
    document.cookie = "state=subscribed;expires=" + generalConfig.expiration() + ";path=/";
    return;
}
function handleLogin() {
    document.cookie = "status=loggedIn;expires=" + generalConfig.expiration() + ";path=/";
    document.cookie = "state=subscribed;expires=" + generalConfig.expiration() + ";path=/";
}
function handleLogout() {
    document.cookie = "offerType=;expires=" + generalConfig.expiration() + ";path=/";
    document.cookie = "offerID=;expires=" + generalConfig.expiration() + ";path=/";
    document.cookie = "status=;expires=" + generalConfig.expiration() + ";path=/";
    document.cookie = "state=;expires=" + generalConfig.expiration() + ";path=/";
    parent.location.reload();
}
//This is an example. You will need to load ads however they have been configured to load.
function loadAds() {
    document.getElementById('demo').innerText = "Advertisements";
}
//Launch
document.addEventListener('DOMContentLoaded',setupSite)