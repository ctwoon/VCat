// Longpoll

var currentChatID;
var groupUsers;

var serverURL;
var server2;
var ts2;
var key2;

var isInMessages = false;

function initPoll(server, ts, pts ,key) {
    if (allowLongpoll) {
        serverURL = "https://" + server + "?act=a_check&key=" + key + "&ts=" + ts + "&wait=25&mode=2&version=2";
        serverURL = craftURL(serverURL);
        server2 = server;
        ts2 = ts;
        key2 = key;
        poll();
    }
}

var pollBuffer;

function poll(){
    if (allowLongpoll) {
        if (isInMessages) {
            console.log("LongPoll request");
            $.ajax({
                url: serverURL, success: function (data) {
                    console.log(data);
                    ts2 = data['ts'];
                    serverURL = server2 + "?act=a_check&key=" + key2 + "&ts=" + ts2 + "&wait=25&mode=2&version=2";
                    serverURL = craftPollURL(serverURL);
                    // go work
                    $.each(data['updates'], function (index, value) {
                        switch (value[0]) {
                            case 4:
                                if (value[3] == currentChatID) {
                                    // we are in current chat, add message
                                    if (isInMessages) {
                                        // additional check because no AJAX aborting
                                        if (value[5] !== pollBuffer) {
                                            // fix for duplicating messages
                                            var id = value[6]['from'];
                                            var name = getGroupUsername2(id, groupUsers);
                                            $('.writeBoxWrap').before('<div class="card cardDecor semi-transparent message messageBorder">\n' +
                                                '    <div class="card-body messagePadding">\n' +
                                                '        <h5 class="card-title noPadding smallTitle">' + name + '</h5>\n' +
                                                '        <p class="card-text">' + value[5] + '</p>\n' +
                                                '        <p class="card-text smallText"> <i>(' + timestampToTime(value[4]) + '), получено через Longpoll</i></p>\n' +
                                                '    </div>\n' +
                                                '</div>');
                                            setTimeout(function () {
                                                jumpToEnd();
                                            }, 500);
                                            pollBuffer = value[5];
                                        }
                                    }
                                }
                                break;
                            case 62:
                                /* var userID = value[1];
                                 var chat_id = value[2];
                                 if (chat_id == chatID) {
                                     $(".msgStatus").html(getGroupUsername2(userID, groupUsers)+" набирает...")
                                 }*/
                                break;
                        }
                    });
                }, dataType: "json", complete: poll, timeout: 30000
            });
        }
    }
};

function getLongpollData() {
    if (allowLongpoll) {
        var url = craftMethodURL('messages', 'getLongPollServer', 'need_pts=1&lp_version=3', '5.74');
        console.log(url);
        logInfo("EditMessage", "Get LongPoll");
        $.ajax({
            url: url,
            success: function (response) {
                console.log(response);
                var result = JSON.parse(response);
                initPoll(result['response']['server'], result['response']['ts'], result['response']['pts'], result['response']['key'])
            }
        });
    }
}