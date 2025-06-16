import * as FileSystem from 'expo-file-system'
import * as DocumentPicker from 'expo-document-picker'
import api from "../apiService";



import { shareAsync } from 'expo-sharing'
import { printToFileAsync } from 'expo-print'

import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { HeaderHtml } from '../../utils/pdfLayout';
import { getLoggedUser } from '../users/userService';
import { professorLabels } from '../../utils/translateObject';



export const downloadProfessorXlsFile = async () => {

    const save = async (uri: string, filename: string, mimetype: string) => {
        if (Platform.OS === "android") {
            const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
            if (permissions.granted) {
                const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
                await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, filename, mimetype)
                    .then(async (uri) => {
                        await FileSystem.writeAsStringAsync(uri, base64, { encoding: FileSystem.EncodingType.Base64 });
                    })
                    .catch(e => console.log(e));
            } else {
                shareAsync(uri);
            }
        } else {
            shareAsync(uri);
        }
    };

    const token = await AsyncStorage.getItem("token")

    const fileName = "planilha-modelo.xlsx"
    const result = await FileSystem.downloadAsync
        (
            `${API_URL}/professores/download/planilha-modelo.xlsx`,
            FileSystem.documentDirectory + fileName,
            { headers: { Authorization: `Bearer ${token}` } }
        )
    save(result.uri, fileName, String(result.mimeType))
    console.log(result)
}

export const uploadFile = async (pickedFile: DocumentPicker.DocumentPickerAsset) => {
    const formData = new FormData()

    formData.append('file', {
        uri: pickedFile.uri,
        name: pickedFile.name,
        type: pickedFile.mimeType || 'application/octet-stream',
    } as any) // necessário no React Native

    try {
        const response = await api.post(
            '/professores/upload/planilha-modelo.xlsx',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        )
        console.log(response.data)

        return response.data
    } catch (error: any) {
        throw error
    }

}

export const shareDataToPdfFile = async (data: any[]) => {
    const user = await getLoggedUser();

    const headers = Object.keys(data[0]).filter((key) => key !== "id");

    const htmlContent = `
  <html>
    <head>
      <meta charset="utf-8" />
      <style>
        @page {
          size: A4 landscape;
          margin: 20px;
        }

        body {
          font-family: Verdana, sans-serif;
          padding: 0;
          margin: 0;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
          word-wrap: normal;
        }

        th, td {
        border: 1px solid #ccc;
        text-align: center;
        vertical-align: top;
        word-break: break-word;
        max-width: 300px; /* 
        }


      </style>
    </head>
    <body>
      <div>
        ${HeaderHtml(user)}
      </div>

      <table>
        <thead>
          <tr>
            ${headers.map((key) => `<th>${professorLabels[key] || key}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${data
            .map(
                (row) => `
            <tr>
              ${headers
                        .map(
                            (key) => `<td>${row[key] === null || row[key] === undefined ? "" : row[key]}</td>`
                        )
                        .join("")}
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    </body>
  </html>
  `;

    const { uri } = await printToFileAsync({ html: htmlContent });
    await shareAsync(uri);
};