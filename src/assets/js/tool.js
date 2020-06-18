class Tool {

    //格式化日期
    formatDate(v, format) {
        //2020+03-09 01:20:12
        //format: yyyy+MM-dd h:mm:s

        //获取年份
        let year = v.getFullYear().toString();

        if (/(y+)/.test(format)) {

            //获取匹配的内容
            let c = RegExp.$1;

            format = format.replace(c, year.slice(year.length - c.length));
        }

        // 

        //构造对象
        let o = {
            M: v.getMonth() + 1,
            d: v.getDate(),
            h: v.getHours(),
            m: v.getMinutes(),
            s: v.getSeconds()
        };

        // 

        for (let k in o) {
            //使用动态正则
            let r = new RegExp(`(${k}{1,2})`);
            // 

            if (r.test(format)) {
                //获取组内容
                let c1 = RegExp.$1;
                // 

                //控制不足十补零
                let content = (o[k] >= 10 || c1.length == 1) ? o[k] : '0' + o[k];

                format = format.replace(c1, content);

                // 
            }

        }

        return format;

    }

    // 判断时间距今
    parseTimeDay(times) {
        let ms = times;
        let h;
        // 天前
        let daysAgo = Math.floor(parseInt(Date.now() - ms) / 1000 / 60 / 60 / 24);
        // 月前
        let monthAgo;
        // 年前

        if (daysAgo == 0) {
            h = Math.floor(parseInt(Date.now() - ms) / 1000 / 60 / 60);
            if (h != 0) {
                return h + "小时前";
            } else {
                return Math.floor(parseInt(Date.now() - ms) / 1000 / 60 % 60) + "分钟前"
            }
        } else if (daysAgo > 30) {
            monthAgo = Math.floor(parseInt(Date.now() - ms) / 1000 / 60 / 60 / 24 / 30);

            if (monthAgo > 11) {
                let l = Math.floor(monthAgo / 12);
                return l + '年前';
            }
            return monthAgo + '月前';
        } else {
            return daysAgo + '天前';
        }

    }
}

export const tool = new Tool();