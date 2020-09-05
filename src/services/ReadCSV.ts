import csvParse from "csv-parse";
import fs from "fs";
import path from "path";
import uploadConfig from "../config/upload";
import AppError from "../errors/AppError";

class ReadCSV {
  private filePath: string;

  constructor(filePath: string) {
    let fullPath = path.resolve(uploadConfig.directory, filePath);
    this.filePath = fullPath;
  }

  public async excecute(): Promise<any[]> {
    let stream = fs.createReadStream(this.filePath);

    if (!stream) throw new AppError("File not found!", 404);

    let parseStream = csvParse({
      from_line: 2, // comecar da linha 2, para nao pegar o titulo
      ltrim: true,
      rtrim: true, // remover espacos dos arquivos
    });

    let parseCSV = stream.pipe(parseStream); // o pipe envia informacao da stream para a parseStream

    let lines: Array<any>;
    lines = [];

    parseCSV.on("data", (line) => {
      lines.push(line);
    }); // enquanto tiver dados ele preenche o array

    await new Promise((resolve) => {
      parseCSV.on("end", resolve); // transformando na stream definida acima assim que a promise for resolvida
    });

    return lines;
  }
}
export default ReadCSV;
