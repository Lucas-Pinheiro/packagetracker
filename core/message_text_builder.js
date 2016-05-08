"use strict";
function build_cep(cep_json) {
    return "\nResultados para o CEP: " + cep_json.cep + ".\n-------\nEstado: " + cep_json.estado_info.nome + ";\nCidade: " + cep_json.cidade + ";\nBairro: " + cep_json.bairro + ";\nLogradouro: " + cep_json.logradouro + ".";
}
exports.build_cep = build_cep;
function build_error(error_object) {
    return "\nErro: " + error_object.message + ".\nAcesse o link para instru\u00E7\u00F5es de utiliza\u00E7\u00E3o: https://github.com/Lucas-Pinheiro/smough\"\n    ";
}
exports.build_error = build_error;
function build_help() {
    return "Acesse o link para instruções de utilização: https://github.com/Lucas-Pinheiro/smough";
}
exports.build_help = build_help;
function build_package(package_json) {
    var messages_list = [("\nHist\u00F3rico para o c\u00F3digo de rastreamento: " + package_json.codigo + ".\n    ")];
    package_json.historico.reverse();
    package_json.historico.forEach(function (item) {
        messages_list.push("\nDetalhes: " + (item.detalhes || "nenhum") + ";\nLocal: " + item.local + ";\nData: " + item.data + ";\nSitua\u00E7\u00E3o: " + item.situacao + ".\n        ");
    });
    return messages_list;
}
exports.build_package = build_package;
