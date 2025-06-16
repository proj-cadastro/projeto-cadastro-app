import { Professor } from "../types/professor";
import { IUser } from "../types/user";
import { professorLabels } from "./translateObject";

export const HeaderHtml = (user: IUser) => {
  const imgSrc = "http://192.168.1.12:3000/static/cabecalho.png";

  return `
    <header>
      <div style="
        display: flex;
        font-family: Arial, sans-serif;
        justify-content: space-between;
        align-items: center;
        ">
        <div style="width: 70%;">
          <img src="${imgSrc}" style="width: 100%; height: auto;" alt="Logo" />
        </div>

        <div style="
          width: 30%;
          font-size: 12px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding-left: 10px;
        ">
          <p style="margin: 0; font-weight: bold; font-size: 14px;">${user.nome}</p>
          <p style="margin: 2px 0; font-weight: semibold;">Administração Geral</p>
          <p style="margin: 2px 0;">Centro Paula Souza</p>
          <p style="margin: 2px 0;">
            <span>${user.email}</span> |
            <span style="color: #888;">11 0000-0000</span>
          </p>
          <p style="margin: 2px 0;">Rua dos Andradas, 140 – São Paulo – SP</p>
        </div>
      </div>
      <h2 style="
        color: #b20000;
        font-size: 20px;
        font-weight: bold;
        margin: 10px 0;
        font-family: Verdana, sans-serif;
        text-align: center;
      ">
        Faculdade de Tecnologia de Votorantim
      </h2>
    
      </header>
  `;
};

export const professorContent = (data: any[]) => {
  const headers = Object.keys(data[0]).filter((key) => key !== "id");

  return `
 <table>
        <thead>
          <tr>
            ${headers
              .map((key) => `<th>${professorLabels[key] || key}</th>`)
              .join("")}
          </tr>
        </thead>
        <tbody>
          ${data
            .map(
              (row) => `
            <tr>
              ${headers
                .map(
                  (key) =>
                    `<td>${
                      row[key] === null || row[key] === undefined
                        ? ""
                        : row[key]
                    }</td>`
                )
                .join("")}
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>  
  `;
};
