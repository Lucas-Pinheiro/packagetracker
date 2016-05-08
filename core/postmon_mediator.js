"use strict";
var request = require("request");
var json_print = require("printable-json");
var API_DOMAIN = "http://api.postmon.com.br";
function get_cep_info(cep, success) {
    var url = API_DOMAIN + "/v1/cep/" + cep;
    request({
        "method": "GET",
        "url": url,
    }, function (error, response, body) {
        if (error) {
            console.log("Postmon cep API error: " + json_print.toString(error));
            return;
        }
        try {
            success(JSON.parse(body));
        }
        catch (error) {
            success(body);
        }
    });
}
exports.get_cep_info = get_cep_info;
function get_package_info(package_code, success) {
    var url = API_DOMAIN + "/v1/rastreio/ect/" + package_code;
    request({
        "method": "GET",
        "url": url,
    }, function (error, response, body) {
        if (error) {
            console.log("Postmon package API error: " + json_print.toString(error));
            return;
        }
        try {
            success(JSON.parse(body));
        }
        catch (error) {
            success(body);
        }
    });
}
exports.get_package_info = get_package_info;
