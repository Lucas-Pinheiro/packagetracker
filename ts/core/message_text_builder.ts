import {
    PostmonCEP,
    PostmonPackage,
    PostmonPackageStatus
} from "./postmon_mediator";
import {SmoughError} from "./command_parser";


export function build_cep(cep_json: PostmonCEP): string {
    return `
Resultados para o CEP: ${cep_json.cep}.
-------
Estado: ${cep_json.estado_info.nome};
Cidade: ${cep_json.cidade};
Bairro: ${cep_json.bairro};
Logradouro: ${cep_json.logradouro}.`;
}

export function build_error(error_object: SmoughError): string {
    return `
Erro: ${error_object.message}.
Acesse o link para instruções de utilização: https://github.com/Lucas-Pinheiro/smough"
    `;
}

export function build_help(): string {
    return "Acesse o link para instruções de utilização: https://github.com/Lucas-Pinheiro/smough"
}

export function build_package(package_json: PostmonPackage): string[] {
    let messages_list: string[] = [`
Histórico para o código de rastreamento: ${package_json.codigo}.
    `]

    package_json.historico.reverse();

    package_json.historico.forEach((item: PostmonPackageStatus) => {
        messages_list.push(`
Detalhes: ${item.detalhes || "nenhum"};
Local: ${item.local};
Data: ${item.data};
Situação: ${item.situacao}.
        `);
    });

    return messages_list;
}
