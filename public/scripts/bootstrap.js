var file_service = {
    pageSize: 1000,
    remainderStore:{ Down:"",Up:""},
        seek: { Down: 0, Up: 0 },
        pageCacheLimit: 20,
        currentCache:{Down:0,Up:0},
    
        eof: false,
        getContent: function (isDown) {
            return $.ajax({
                type: "GET",
                url: "data/" + (isDown ? file_service.seek.Down : file_service.seek.Up - file_service.pageSize) + "/chunk/" + file_service.pageSize,
                cache: "false"
            }).done(function (d) {
                if (d == -1) {
                    file_service.eof = true;
                }
                else {
                    if (isDown) {
                        file_service.eof = false;
                        file_service.seek.Down += d.length;
                    }
                    else {
                        file_service.eof = false;
                        file_service.seek.Up -= d.length;
                    }

                }
            })
        .promise();
        },
        fetch: function (isDown) {
            return file_service.getContent(isDown).done(function (d) {
            
                if (isDown) {
                    
                    
                    d = file_service.remainderStore.Down + d;
                    if (d.substring(0, 3) != "S/N") {
                        var nFirst = d.indexOf('\n');
                        d = d.substring(nFirst);
                    }
                    file_service.remainderStore.Down = "";
                    var n = d.lastIndexOf('\n');
                    file_service.remainderStore.Down = d.substring(n + 1);
                    d = d.substring(0, n);
                    d = d.replace(new RegExp("S/N", 'g'), '<div seekNo="' + (isDown ? file_service.seek.Down : file_service.seek.Up) + '">S/N');
                    d = d.replace(new RegExp('\n', 'g'), '\n</div>');                
                    $('#t1')[0].innerHTML += d;                
                    file_service.currentCache.Down++;
                }
                else {
                    d = d + file_service.remainderStore.Up;
                    var n = d.lastIndexOf('\n');
                    d = d.substring(0, n+1);
                    var nFirst = d.indexOf('\n');
                    file_service.remainderStore.Up = d.substring(0, nFirst+1);
                    d = d.substring(nFirst + 1);
                    d = d.replace(new RegExp("S/N", 'g'), '<div seekNo="' + (isDown ? file_service.seek.Down : (file_service.seek.Up + file_service.pageSize)) + '">S/N');
                    d = d.replace(new RegExp('\n', 'g'), '\n</div>');
                    $('#t1')[0].innerHTML = d + $('#t1')[0].innerHTML;
                    file_service.currentCache.Up--;

                    
                }

                cleanUpPages();
            });
        }
    };


function cleanUpPages() {
    var isDown = false;
    if ((file_service.currentCache.Down - file_service.currentCache.Up) > file_service.pageCacheLimit) {
        var a = $('#t1')[0];
        if (a.scrollHeight / 2 < a.scrollTop) {
            isDown = true;
        }
        else {
            isDown = false;

        }
        if (isDown) {

            file_service.seek.Up += file_service.pageSize;
            file_service.currentCache.Up++;
            var lst = $('[seekNo="' + file_service.seek.Up + '"]', '#t1');
            var lstHeight = lst.height();
            var lstLength = lst.length;
            $('[seekNo="' + file_service.seek.Up + '"]', '#t1').remove();
            a.scrollTop -= lstHeight * lstLength;
            file_service.remainderStore.Up = "";
        }
        else {
            $('[seekNo="' + file_service.seek.Down + '"]', '#t1').remove();
            file_service.seek.Down -= file_service.pageSize;
            file_service.currentCache.Down--;
            file_service.remainderStore.Down = "";

            var a = $('#t1')[0];
            var lst = $('[seekNo="' + (file_service.seek.Up + file_service.pageSize) + '"]', '#t1');
            var lstHeight = lst.height();
            var lstLength = lst.length;
            a.scrollTop += lstHeight * lstLength;
        }
    }
    $('#sFirstPage').html(file_service.currentCache.Up);
    $('#sLastPage').html(file_service.currentCache.Down);
};

var bootstrap = {
    init: function () {
        file_service.fetch(true);
        

    }
};

bootstrap.init();


var table = {
    lastScroll:0,
    fetchData: function () {
        var a = $('#t1')[0];
        
        if (a.scrollTop > this.lastScroll) {
            
            if (a.scrollHeight-a.scrollTop<=10000) {
                file_service.fetch(true);
            }
        }
        else {
            if (a.scrollTop < 10000 && file_service.currentCache.Up > 0) {
                file_service.fetch(false);
            }
        }
        
        
        this.lastScroll = a.scrollTop;
        
    }
}

$(document).ready(function () {
    $('#t1').scroll(function () {
        table.fetchData();
        $('#sFirstPage').html(file_service.currentCache.Up);
        $('#sLastPage').html(file_service.currentCache.Down);

    });
    $('#sPageSize').html(file_service.pageSize);
    $('#sCacheLimit').html(file_service.pageCacheLimit);
});


//setInterval(function () { file_service.fetch(); }, 1000);