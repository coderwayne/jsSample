var myStr = "老胡";

var fs = require("fs");

fs.readFile("./file/myFile.txt", function (error, data) {
    // 成功，data--数据，error--null
    // 失败，data--null/undefined，error--错误信息
    if (error) {
        console.log("error:" + error);
        return;
    }
    console.log(data.toString())
});

fs.writeFile("./file/edit.txt", "怕什么西行无归\n什么事与愿违", function (error) {
    if (error) {
        console.log("error:" + error);
        return;
    }
    console.log("写入成功");
})