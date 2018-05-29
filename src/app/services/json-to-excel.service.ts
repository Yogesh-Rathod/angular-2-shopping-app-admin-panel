import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable()
export class JsonToExcelService {
    constructor() {}

    public exportAsExcelFile(json: any[], excelFileName: string): void {
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
        const workbook: XLSX.WorkBook = {
            Sheets: { data: worksheet },
            SheetNames: ['data']
        };
        const excelBuffer: any = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'buffer'
        });
        this.saveAsExcelFile(excelBuffer, excelFileName);
    }

    private saveAsExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
        });
        const currentDate = new Date(),
            generateExportDate = `${currentDate.getDate()}_${currentDate.getMonth() +
                1}_${currentDate.getFullYear()}_${currentDate.getHours()}_${currentDate.getMinutes()}`;
        FileSaver.saveAs(
            data,
            fileName + '_export_' + generateExportDate + EXCEL_EXTENSION
        );
    }
}
