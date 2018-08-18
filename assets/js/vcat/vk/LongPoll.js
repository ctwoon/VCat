let currentChatID;
let groupUsers;

let serverURL;
let server2;
let ts2;
let key2;

let isInMessages = false;

function initPoll(server, ts, pts ,key) {
    if (allowLongpoll) {
        serverURL = "https://" + server + "?act=a_check&key=" + key + "&ts=" + ts + "&wait=25&mode=2&version=4";
        server2 = server;
        ts2 = ts;
        key2 = key;
        poll();
    }
}

let pollBuffer;

function poll(){
    if (allowLongpoll) {
        if (isInMessages) {
            $.ajax({
                url: serverURL, success: function (data) {
                    ts2 = data['ts'];
                    serverURL = server2 + "?act=a_check&key=" + key2 + "&ts=" + ts2 + "&wait=25&mode=2&version=2";
                    serverURL = craftPollURL(serverURL);
                    // go work
                    $.each(data['updates'], function (index, value) {
                        console.log(value);
                        switch (value[0]) {
                            case 4:
                                if (value[3] == currentChatID) {
                                    // we are in current chat, add message
                                    if (isInMessages) {
                                        // additional check because no AJAX aborting
                                        if (value[5] !== pollBuffer) {
                                            // fix for duplicating messages
                                            let id = value[6]['from'];
                                            let name = getGroupUsername2(id);
                                            let text = value[5];
                                            if (!name) {
                                                name = "";
                                            }
                                            if (typeof value[6]['source_act'] !== "undefined") {
                                                let rs;
                                                switch (value[6]['source_act']) {
                                                    case 'chat_unpin_message':
                                                        rs = "открепил сообщение";
                                                        break;
                                                    case 'chat_pin_message':
                                                        rs = "закрепил сообщение";
                                                        break;
                                                    case 'chat_invite_user_by_link':
                                                        groupUsers = getGroupUsers(currentChatID);
                                                        name = getGroupUsername2(id, groupUsers);
                                                        rs = "вступил в чат по ссылке";
                                                        break;
                                                    case 'chat_invite_user':
                                                        groupUsers = getGroupUsers(currentChatID);
                                                        rs = "пригласил " + getGroupUsername2(value[6]['source_mid'], groupUsers);
                                                        break;
                                                    case 'chat_kick_user':
                                                        groupUsers = getGroupUsers(currentChatID);
                                                        rs = "исключил " + getGroupUsername2(value[6]['source_mid'], groupUsers);
                                                      break;
                                                    default:
                                                        rs = "выполнил неизвестное действие "+value[6]['source_act'];
                                                        break;
                                                }
                                                text = name+" "+rs+".";
                                                name = "";
                                            }
                                            $('.writeBoxWrap').before('<div class="card cardDecor semi-transparent message messageBorder">\n' +
                                                '    <div class="card-body messagePadding">\n' +
                                                '        <h5 class="card-title noPadding smallTitle">' + name + '</h5>\n' +
                                                '        <p class="card-text">' + text + '</p>\n' +
                                                '        <p class="card-text smallText"> <i>' + timestampToTime(value[4]) + '</i></p>\n' +
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
                                /* let userID = value[1];
                                 let chat_id = value[2];
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
}
function getLongpollData() {
    if (allowLongpoll) {
        let url = craftMethodURL('messages', 'getLongPollServer', 'need_pts=1&lp_version=4', '5.80');
        $.ajax({
            url: url,
            success: function (response) {
                console.log(response);
                let result = response;
                initPoll(result['response']['server'], result['response']['ts'], result['response']['pts'], result['response']['key'])
            }
        });
    }
}
