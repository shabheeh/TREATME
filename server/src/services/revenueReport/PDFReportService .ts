import puppeteer from "puppeteer";
import { Buffer } from "buffer";
import { inject, injectable } from "inversify";
import { IPDFReportService } from "./interfaces/IPDFReportService";
import { IHTMLTemplateService } from "./interfaces/IHTMLTemplateService";
import {
  RevenueReportData,
  AllDoctorsRevenueResponse,
  ReportType,
} from "../../repositories/revenueReport/interfaces/IRevenueReportRepository";
import { TYPES } from "../../types/inversifyjs.types";

@injectable()
class PDFReportService implements IPDFReportService {
  constructor(
    @inject(TYPES.IHTMLTemplateService)
    private htmlTemplateService: IHTMLTemplateService
  ) {}

  async generateRevenueReportPDF(
    data: RevenueReportData,
    reportType: ReportType
  ): Promise<Buffer> {
    const html = this.htmlTemplateService.generateRevenueReportHTML(
      data,
      reportType
    );
    return await this.generatePDFFromHTML(html);
  }

  async generateDoctorsSummaryPDF(
    data: AllDoctorsRevenueResponse
  ): Promise<Buffer> {
    const html = this.htmlTemplateService.generateDoctorsSummaryHTML(data);
    return await this.generatePDFFromHTML(html);
  }

  private async generatePDFFromHTML(html: string): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: "/usr/bin/google-chrome-stable",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--disable-gpu",
        "--disable-extensions",
        "--disable-background-timer-throttling",
        "--disable-backgrounding-occluded-windows",
        "--disable-renderer-backgrounding",
        "--disable-features=TranslateUI",
        "--disable-ipc-flooding-protection",
      ],
    });

    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1200, height: 800 });
      await page.setContent(html, { waitUntil: "networkidle0" });

      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: {
          top: "20px",
          right: "20px",
          bottom: "20px",
          left: "20px",
        },
      });

      return Buffer.from(pdfBuffer);
    } finally {
      await browser.close();
    }
  }
}

export default PDFReportService;
