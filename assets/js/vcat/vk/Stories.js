function parseStories(stories) {
    try {
        let storiesHTML = '<div class="card cardDecor cardAttach"><div class="card-body messagePadding"><p class="attachment-title">Истории</p>';
        $.each(stories['items'], function (index, value) {
            let previousOwner = "";
            $.each(value, function (index, value) {
                console.log(value);
                if (previousOwner != value['owner_id']) {
                    storiesHTML += '<div class="card cardDecor cardAttach storyCard" style=\'background: url("' + value['video']['first_frame_800'] + '")\'><div class="card-body messagePadding">' +
                        '<p class="storyAuthor">' + getGroupID(Math.abs(value['owner_id']), stories).substring(0, 10) + '..</p>' +
                        '</div></div>';
                    previousOwner = value['owner_id'];
                }
            });
        });
        storiesHTML += "</div></div>";
        $('.cardContainer').append(storiesHTML);
    } catch (e) {
        console.error("[Stories] Stories load error: "+e.message);
    }
}