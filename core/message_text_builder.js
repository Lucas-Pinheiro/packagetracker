exports.build_cep = (cep_json) => {

};

exports.build_help = () => {

};

exports.build_package = (package_json) => {

};

exports.build_error = (error_object) => {
    return `
    Erro: ${error_object.message}.
Acesse o link para instruções de utilização: https://github.com/Lucas-Pinheiro/smough"
    `;
};
