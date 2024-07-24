"use server";

import sqlite3 from "sqlite3";
import { revalidatePath } from "next/cache";

function normalize(str: string) {
    let upperStr = str.toUpperCase();
    let normalizedStr = upperStr.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return normalizedStr;
}

function executeSelectQuery(db: any, query: string) {
    return new Promise((resolve, reject) => {
        let sql = query;

        db.all(sql, [], (err: any, rows: any) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

function handleName(name: string) {
    return normalize(`%${name.split(" ").join("%")}%`)
}

function handleCpf(cpf: string) {
    let splitted = cpf.split(".");
    let lastPiece = splitted.pop();
    let splittedLastPiece = lastPiece?.split("-");

    if (Array.isArray(splittedLastPiece)) {
        return `***.${splitted[1]}.${splittedLastPiece[0]}-**`;
    }

    return "";
}

export async function searchAction(previousState: { message: string, error: boolean, result: any[] }, formData: FormData) {
    const uf = formData.get("uf") as string;
    const municipio = formData.get("municipio") as string;
    const nome = formData.get("nome") as string;
    const cpf = formData.get("cpf") as string;
    const searchType = Number(formData.get("searchType") as string);
    let result: any = [];

    const db = new sqlite3.Database(
        "all_df.db",
        sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
        (err: any) => {
            if (err) {
                return {
                    message: err.message,
                    error: true,
                    result
                };
            } else {
                console.log("Connected to the SQLite database.");
            }
        }
    );

    let missingFields = false;

    try {
        switch (searchType) {
            case 1: {
                if (!uf || !nome) {
                    missingFields = true;
                    break;
                }
                result = await executeSelectQuery(db, `select * from people where uf = '${normalize(uf)}' and nome LIKE '${handleName(nome)}';`);
            } break;
            case 2: {
                if (!uf || !nome || !municipio) {
                    missingFields = true;
                    break;
                }
                result = await executeSelectQuery(db, `select * from people where uf = '${normalize(uf)}' and nome LIKE '${handleName(nome)}' and municipio = '${normalize(municipio)}';`);
            } break;
            case 3: {
                if (!cpf) {
                    missingFields = true;
                    break;
                }
                if (!/^([0-9]){3}\.([0-9]){3}\.([0-9]){3}-([0-9]){2}$/.test(cpf)) {
                    return {
                        message: `Formato de CPF inválido.`,
                        error: true,
                        result
                    };
                }
                result = await executeSelectQuery(db, `select * from people where cpf = '${handleCpf(cpf)}';`);
            } break;
            default: {
                missingFields = true;
                result = [];
            }
        }

        if (missingFields) {
            return {
                message: `Preencha todos os campoas corretamente.`,
                error: true,
                result
            };
        }

        if (result.length === 0) {
            return {
                message: `Nenhum resultado encontrado.`,
                error: true,
                result
            };
        }
    } catch (err) {
        return {
            message: "Erro ao executar query.",
            error: true,
            result
        };
    } finally {
        db.close((err) => {
            if (err) {
                return {
                    message: err.message,
                    error: true,
                    result
                };
            } else {
                console.log('Conexão com o banco de dados fechada.');
            }
        });
    }

    // returns
    revalidatePath("/");
    return {
        message: `${result.length} resultados encontrados.`,
        error: false,
        result
    };
}
