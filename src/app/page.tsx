"use client";

import { useFormState } from "react-dom";
import { searchAction } from "./actions/searchAction";
import { useMemo, useRef, useState } from "react";
import SubmitButton from "./components/SubmitButton";
import { estadosCidades } from "@/utils";

export default function Page() {
  const [formState, action] = useFormState(searchAction, {
    error: false,
    message: "",
    result: [],
  } as { message: string, error: boolean, result: any });
  const [searchType, setSearchType] = useState(0);
  const [UF, setUF] = useState("");

  const citiesByUF = useMemo(() => {
    for (let i = 0; i < estadosCidades.estados.length; i++) {
      if (estadosCidades.estados[i].sigla === UF) {
        return estadosCidades.estados[i].cidades;
      }
    }

    return [];
  }, [UF]);

  return (
    <section className="min-h-screen">
      {
        formState.error && (
          <div className="text-red-600 my-4 text-center bg-red-50 p-2 rounded-xl font-bold w-full md:w-1/3 mx-auto animate-bounce">{formState.message}</div>
        )
      }
      {
        (!formState.error && formState.message !== "") && (
          <div className="text-green-600 my-4 text-center bg-green-50 p-2 rounded-xl font-bold w-full md:w-1/3 mx-auto">{formState.message}</div>
        )
      }
      <form action={action} defaultValue={formState.message} className="mt-8 mx-auto flex flex-col items-center justify-center gap-8 w-full md:w-1/3 md:border p-8 rounded-xl">
        <h2 className="font-bold text-3xl text-blue-800">Busca</h2>
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="searchType" className="block font-bold cursor-pointer text-blue-800">Tipo de busca:</label>
          <select id="searchType" name="searchType" className="p-2 border rounded-xl w-full focus:outline-blue-800" onChange={(e) => setSearchType(Number(e.target.value))}>
            <option value="">Selecione uma opção</option>
            <option value="1">Por UF</option>
            <option value="2">Por UF e município</option>
            <option value="3">Por CPF</option>
          </select>
        </div>
        {
          (searchType === 1 || searchType === 2) && (
            <div className="w-full flex flex-col gap-2">
              <label htmlFor="uf" className="block font-bold cursor-pointer text-blue-800">UF:</label>
              <select id="uf" name="uf" className="p-2 border rounded-xl w-full focus:outline-blue-800" onChange={(e) => setUF(e.target.value)}>
                <option value="">Selecione uma opção</option>
                <option value="AC">Acre</option>
                <option value="AL">Alagoas</option>
                <option value="AP">Amapá</option>
                <option value="AM">Amazonas</option>
                <option value="BA">Bahia</option>
                <option value="CE">Ceará</option>
                <option value="DF">Distrito Federal</option>
                <option value="ES">Espírito Santo</option>
                <option value="GO">Goiás</option>
                <option value="MA">Maranhão</option>
                <option value="MT">Mato Grosso</option>
                <option value="MS">Mato Grosso do Sul</option>
                <option value="MG">Minas Gerais</option>
                <option value="PA">Pará</option>
                <option value="PB">Paraíba</option>
                <option value="PR">Paraná</option>
                <option value="PE">Pernambuco</option>
                <option value="PI">Piauí</option>
                <option value="RJ">Rio de Janeiro</option>
                <option value="RN">Rio Grande do Norte</option>
                <option value="RS">Rio Grande do Sul</option>
                <option value="RO">Rondônia</option>
                <option value="RR">Roraima</option>
                <option value="SC">Santa Catarina</option>
                <option value="SP">São Paulo</option>
                <option value="SE">Sergipe</option>
                <option value="TO">Tocantins</option>
              </select>
            </div>
          )
        }

        {
          (searchType === 2) && (
            <div className="w-full flex flex-col gap-2">
              <label htmlFor="municipio" className="block font-bold cursor-pointer text-blue-800">Município:</label>
              <select id="municipio" name="municipio" className="p-2 border rounded-xl w-full focus:outline-blue-800">
                <option value="">Selecione uma opção</option>
                {
                  citiesByUF?.map((c, i) => {
                    return <option value={c}>{c}</option>
                  })
                }
              </select>
            </div>
          )
        }

        {
          (searchType !== 0 && searchType !== 3) && (
            <div className="w-full flex flex-col gap-2">
              <label htmlFor="nome" className="block font-bold cursor-pointer text-blue-800">Nome:</label>
              <span className="font-light text-xs">Você pode digitar o nome completo ou apenas partes do nome. O sistema buscará todos os nomes que contém as palavras que você informar abaixo.</span>
              <input type="text" id="nome" name="nome" className="p-2 border rounded-xl w-full focus:outline-blue-800" />
            </div>
          )
        }

        {
          searchType === 3 && (
            <div className="w-full flex flex-col gap-2">
              <label htmlFor="" className="block font-bold cursor-pointer text-blue-800">CPF:</label>
              <input type="text" name="cpf" className="p-2 border rounded-xl w-full focus:outline-blue-800" placeholder="000.000.000-00" />
            </div>
          )
        }
        <SubmitButton name="Buscar" loadingName="Buscando..." />
      </form>

      <div className="flex flex-col items-center">
        {
          formState.result.length > 0 && (
            formState.result.map((result: any, i: any) => {
              if (result.uf !== "uf") {
                return <div className="border my-4 rounded-xl w-1/2 p-2">
                  <h3 className="font-bold text-2xl text-blue-600 text-center">{i + 1}</h3>
                  <p><span className="font-bold">UF:</span> {result.uf}</p>
                  <p><span className="font-bold">Município:</span> {result.municipio}</p>
                  <p><span className="font-bold">Nome:</span> {result.nome}</p>
                  <p><span className="font-bold">CPF:</span> {result.cpf}</p>
                </div>
              }
            })
          )
        }
      </div>
    </section>
  );
}