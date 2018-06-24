function uiw_setTitle(block, data) {
    $('.widgetTitleText-'+block).html(data);
}

function uiw_setData(block, data) {
    $('.widgetBodyHTML-'+block).html(data);
}

function uiw_addData(block, data) {
    $('.widgetBodyHTML-'+block).append(data);
}

function uiw_addWidgetBlock(block) {
    $('.widgetPlace').append('<ul class="nav flex-column widget widget-'+block+'">\n' +
        '                    <li class="nav-item widgetTitle">\n' +
        '                        <a class="nav-link">\n' +
        '                            <i data-feather="grid"></i>\n' +
        '                            <span class="widgetTitleText-'+block+'">\n' +
        '                                Загрузка...\n' +
        '                            </span>\n' +
        '                        </a>\n' +
        '                    </li>\n' +
        '                    <li class="nav-item widgetBody">\n' +
        '                        <span class="nav-link widgetText widgetBodyHTML-'+block+'">\n' +
        '                            Загрузка...\n' +
        '                        </span>\n' +
        '                    </li>\n' +
        '                </ul>');
    feather.replace();
}

function uiw_destroyWidget(block) {
    $('.widget-'+block).remove();
}
