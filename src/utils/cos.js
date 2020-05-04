const COS = require("../js/cos-wx-sdk-v5");
const Bucket = "km-1256664426";
const Region = "ap-beijing";

const cos = new COS({
    getAuthorization: function (options, callback) {
        // 异步获取签名
        wx.request({
            url: process.env.COS_URL, // 步骤二提供的签名接口
            data: {
                Method: options.Method,
                Key: options.Key
            },
            dataType: "json",
            success: function (result) {
                var data = result.data;
                var credentials = data && data.credentials;
                if (!data || !credentials) return console.error("credentials invalid");
                callback({
                    TmpSecretId: credentials.tmpSecretId,
                    TmpSecretKey: credentials.tmpSecretKey,
                    XCosSecurityToken: credentials.sessionToken,
                    StartTime: data.startTime, // 时间戳，单位秒，如：1580000000，建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
                    ExpiredTime: data.expiredTime // 时间戳，单位秒，如：1580000900
                });
            }
        });
    }
});

module.exports = {
    cos,
    Bucket,
    Region
};
