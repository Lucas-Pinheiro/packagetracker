import * as request from "request";
import * as json_print from "printable-json";
import {IncomingMessage} from "http";


const API_DOMAIN = "http://api.postmon.com.br";

export function get_cep_info(cep: string, success: (body: PostmonCEP) => void): void {
    var url = `${API_DOMAIN}/v1/cep/${cep}`;

    request(
        {
            "method": "GET",
            "url": url,
        },
        (error: Error, response: IncomingMessage, body: any) => {
            if (error) {
                console.log(`Postmon cep API error: ${json_print.toString(error)}`);
                return;
            }

            try {
                success(JSON.parse(body));
            } catch (error) {
                success(body)
            }
        }
    );
}

export function get_package_info(package_code: string, success: (body: PostmonPackage) => void): void {
    var url = `${API_DOMAIN}/v1/rastreio/ect/${package_code}`;

    request(
        {
            "method": "GET",
            "url": url,
        },
        (error: Error, response: IncomingMessage, body: any) => {
            if (error) {
                console.log(`Postmon package API error: ${json_print.toString(error)}`);
                return;
            }

            try {
                success(JSON.parse(body));
            } catch (error) {
                success(body)
            }
        }
    );
}

export interface PostmonCEP {
    bairro: string;
    cidade: string;
    cep: string;
    logradouro: string;
    estado_info: PostmonProvince;
    cidade_info: PostmonCity;
    estado: string;
}

export interface PostmonProvince {
    area_km2: string;
    codigo_ibge: string;
    nome: string;
}

export interface PostmonCity {
    area_km2: string;
    codigo_ibge: string;
}

export interface PostmonPackage {
    codigo: string;
    servico: string;
    historico: PostmonPackageStatus[];
}

export interface PostmonPackageStatus {
    detalhes: string;
    local: string;
    data: string;
    situacao: string;
}
