// Longpoll

var currentChatID;
var groupUsers;

var serverURL;
var server2;
var ts2;
var key2;

var isInMessages = false;

function initPoll(server, ts, pts ,key) {
    serverURL = "https://"+server+"?act=a_check&key="+key+"&ts="+ts+"&wait=25&mode=2&version=2";
    serverURL = craftURL(serverURL);
    server2 = server;
    ts2 = ts;
    key2 = key;
    poll();
}

function poll(){
    if (isInMessages) {
        console.log("LongPoll request");
        $.ajax({
            url: serverURL, success: function (data) {
                console.log(data);
                ts2 = data['ts'];
                serverURL = server2 + "?act=a_check&key=" + key2 + "&ts=" + ts2 + "&wait=25&mode=2&version=2";
                serverURL = craftURL(serverURL);
                // go work
                $.each(data['updates'], function (index, value) {
                    switch (value[0]) {
                        case 4:
                            if (value[3] == currentChatID) {
                                // we are in current chat, add message
                                if (isInMessages) {
                                    // additional check because no AJAX aborting
                                    var id = value[6]['from'];
                                    var name = getGroupUsername2(id, groupUsers);
                                    $('.cardContainer').append('<li class="mdl-list__item noPadding"><span class="mdl-list__item-primary-content"><div class="mdl-card fullWidth">\n' +
                                        '       <div class="mdl-card__title"><h2 class="mdl-card__title-text">' + name + '</h2></div>' +
                                        '        <div class="mdl-card__supporting-text"><p>' + value[5] +  '</p>\n' +
                                        '        <p class="card-text smallText"> <i>(' + timestampToTime(value[4]) + '), Using Longpoll</i></p>\n' +
                                        '</div></div></span></li>');
                                    $('.cardContainer').append('<a id="endOfDialog"></a>');
                                    setTimeout(function () {
                                        jump("endOfDialog");
                                    }, 500);
                                }
                            }
                            break;
                        case 62:
                            var userID = value[1];
                            var chat_id = value[2];
                            if (chat_id == chatID) {
                                $(".msgStatus").html(getGroupUsername2(userID, groupUsers)+" набирает...")
                            }
                            break;
                    }
                });
            }, dataType: "json", complete: poll, timeout: 30000
        });
    }
};

function getLongpollData() {
    var url = craftMethodURL('messages', 'getLongPollServer', 'need_pts=1&lp_version=3', '5.74');
    console.log(url);
    logInfo("EditMessage", "Get LongPoll");
    $.ajax({
        url: url,
        success: function (response) {
            var result = JSON.parse(response);
            initPoll(result['response']['server'], result['response']['ts'], result['response']['pts'], result['response']['key'])
        }
    });
}