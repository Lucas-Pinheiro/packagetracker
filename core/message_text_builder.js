function build_cep(cep_json) {
    return `
Resultados para o CEP: ${cep_json.cep}.
-------
Estado: ${cep_json.estado_info.nome};
Cidade: ${cep_json.cidade};
Bairro: ${cep_json.bairro};
Logradouro: ${cep_json.logradouro}.`;
}

function build_error(error_object) {
    return `
Erro: ${error_object.message}.
Acesse o link para instruções de utilização: https://github.com/Lucas-Pinheiro/smough"
    `;
}

function build_help() {
    return "Acesse o link para instruções de utilização: https://github.com/Lucas-Pinheiro/smough"
}

function build_package(package_json) {
    var messages_list = [`
Histórico para o código de rastreamento: ${package_json.codigo}.
    `]

    package_json.historico.reverse();

    package_json.historico.forEach((item) => {
        messages_list.push(`
Detalhes: ${item.detalhes || "nenhum"};
Local: ${item.local};
Data: ${item.data};
Situação: ${item.situacao}.
        `);
    });

    return messages_list;
}


exports.build_cep = build_cep;
exports.build_error = build_error;
exports.build_help = build_help;
exports.build_package = build_package;
