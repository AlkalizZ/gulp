$(function(){
    var oContainer = $('#container');
    var oLoader = $('#loader');
    var iWidth = 200;
    var iSpace = 10;
    var iTotalWidth = iWidth + iSpace;
    var iCells = 0;
    var iPage = 0;
    var url = "http://www.wookmark.com/api/json/popular?callback=?";
    var arrL = [];
    var arrT = [];
    var iSure = true;
    function setCells(){
        iCells = Math.floor($(window).innerWidth() / iTotalWidth);
        if(iCells < 3) iCells = 3;
        if(iCells > 10) iCells =10;
        oContainer.css('width', iTotalWidth * iCells - iSpace);
    }
    setCells();
    for(var i = 0;i < iCells;i++){
        arrL.push(i * iTotalWidth);
        arrT.push(0);
    }
    function getData(){
        if(iSure){
            iSure = false;
            oLoader.show();
            $.getJSON(url, "page=" + iPage, function(data){
                $.each(data, function(index, obj){
                    console.log();
                    var oImg = $('<img/>');
                    oImg.attr('src', obj.preview);
                    oContainer.append(oImg);

                    var iHeight = iWidth / obj.width * obj.height;
                    oImg.css({
                        width: iWidth,
                        height: iHeight
                    });
                    var minIndex = getMin();
                    oImg.css({
                        left: arrL[minIndex],
                        top: arrT[minIndex]
                    });
                    arrT[minIndex] += iHeight + 10;
                    oLoader.hide();
                    iSure = true;
                });
            });
        }
    }
    getData();
    $(window).on('scroll', function(){
        var iH = $(window).scrollTop() + $(window).innerHeight();
        var minIndex = getMin();
        if(arrT[minIndex] + oContainer.offset().top < iH){
            iPage++;
            getData();
        }
    });
    $(window).on('resize', function(){
        arrT = [];
        arrL = [];
        var iOldCells = iCells;
        setCells();
        if(iOldCells == iCells) return;
        for(i = 0;i < iCells;i++){
            arrL.push(i * iTotalWidth);
            arrT.push(0);
        }
        var allImg = oContainer.find('img');
        allImg.each(function(){
            var minIndex = getMin();
            $(this).animate({
                left: arrL[minIndex],
                top: arrT[minIndex]
            });
            arrT[minIndex] += $(this).height() + 10;
        })
    });
    function getMin(){
        var iv = arrT[0];
        var _index = 0;
        for(var i = 1;i < arrT.length;i++){
            if(arrT[i] < iv){
                iv = arrT[i];
                _index = i;
            }
        }
        return _index;
    }
});