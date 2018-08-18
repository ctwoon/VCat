function getUser(userID) {
  let fields = "sex,bdate,city,country,domain,online";
  $('.cardContainer').html('<center class="spinnerLoad"><div class="spinner"></div></center>');
  sendData("users", "get", "fields="+fields+"&user_ids="+userID, "5.83", function (result) {
      let name;
      $.each(result['response'],function(index, value){
          let onlineState;
          if (value['online'] == 1) {
              onlineState = "онлайн";
          } else {
                onlineState = "оффлайн"
          }
          let sex;
          if (value['sex'] == 1) {
              sex = "Женщина";
          } else {
              sex = "Мужчина";
          }
          $('.cardContainer').append('<div class="card cardDecor semi-transparent message messageBorder userMainCard">\n' +
              '    <div class="card-body messagePadding">\n' +
              '        <h4 class="card-title noPadding">' + value['first_name'] + ' ' + value['last_name'] + '</h4>\n' +
              '        <p class="card-text">@' + value['domain'] + ', '+onlineState+'</p>\n' +
              '    </div>\n' +
              '</div>');
          name = value['first_name']+" "+value['last_name'];
      });
      feather.replace();
      $('.spinnerLoad').hide();
      userID = userID.replace("id", "");
      getUserWall(userID, name);
    });
}

function getCurrentUser() {
    getUser(user_id);
}

function getUserWall(userID) {
    sendData("wall", "get", "extended=1&owner_id="+userID, "5.83", function (result) {
        $.each(result['response']['items'],function(index, value){
            if (value['marked_as_ads'] == 0) {
                parseNewsfeed(value, result);
            } else if (!value['marked_as_ads']) {
                parseNewsfeed(value, result);
            }
        });
        feather.replace();
        $(".likeCount").click(function() {
            let id = $(this).attr('vcat-postid');
            let isLiked = $(this).attr('vcat-isliked');
            let source = $(this).attr('vcat-author');
            if(isLiked == "false") {
                likePost(id, source);
                $(this).attr('vcat-isliked', true);
                $(this).attr('class', 'likeCount text-danger');
                $(this).contents().filter(function() {
                    return this.nodeType == 3
                }).each(function(){
                    let cur = parseInt($(this).text());
                    let newt = cur + 1;
                    this.textContent = this.textContent.replace($(this).text().toString(), newt.toString());
                });
            } else {
                unlikePost(id, source);
                $(this).attr('vcat-isliked', false);
                $(this).attr('class', 'likeCount');
                $(this).contents().filter(function() {
                    return this.nodeType == 3
                }).each(function(){
                    this.textContent = this.textContent.replace($(this).text().toString(), $(this).text()-1);
                });
            }
        });
        $(".commentCount").click(function() {
            let id = $(this).attr('vcat-postid');
            let source = $(this).attr('vcat-author');
            getComments(id, source);
        });
    });
}