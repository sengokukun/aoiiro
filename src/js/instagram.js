$(function(){
    var photoViewNum = 18;
    $(".photos").html('<p class="txt01">ロード中...</p>');
    $.ajax({
        url: "https://api.instagram.com/v1/users/self/media/recent/",
        data: {
          access_token: "4755284003.eabfeda.b96e0ea542324d5d8a9c5cc8c9e18122",
          count: photoViewNum
        },
        cache: false,
        dataType: "jsonp",
        error: function() {
          $(".photos").html('<p class="txt01">情報の取得に失敗しました。</p>');
        },
        success: function(data) {
          $(".txt01").remove();
          $(".photos").append('<div class="container">')
          for (var i = 0, length = photoViewNum; i < length; i++) {
            $(".photos .container").append($("<article>").append($("<a>").attr("href", data.data[i].link).attr("target", "_blank").append($("<img>").attr("src", data.data[i].images.standard_resolution.url))));
        }
      }
    });
});
