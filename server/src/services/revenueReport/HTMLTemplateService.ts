// src/services/pdf/htmlTemplateService.ts
import { injectable } from "inversify";
import { IHTMLTemplateService } from "./interfaces/IHTMLTemplateService";
import {
  RevenueReportData,
  AllDoctorsRevenueResponse,
  ReportType,
  RevenueSummary,
  DetailedRevenueData,
  DoctorRevenueSummary,
  Pagination,
} from "../../repositories/revenueReport/interfaces/IRevenueReportRepository";

@injectable()
class HTMLTemplateService implements IHTMLTemplateService {
  private formatINR(amount: number): string {
    return `₹${amount.toLocaleString("en-IN")}`;
  }

  private formatDate(date: Date | string): string {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  private getCommonStyles(): string {
    return `
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 0;
          padding: 20px;
          color: #333;
          line-height: 1.4;
        }
        .header {
          text-align: center;
          border-bottom: 3px solid #0f766e;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .company-name {
          font-size: 24px;
          font-weight: bold;
          color: #0f766e;
          margin-bottom: 10px;
        }
        .report-title {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .report-info {
          font-size: 12px;
          color: #64748b;
        }
        .summary-cards {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
          gap: 15px;
        }
        .summary-card {
          flex: 1;
          background: #f0fdfa;
          border: 1px solid #14b8a6;
          border-radius: 8px;
          padding: 15px;
          text-align: center;
        }
        .card-title {
          font-size: 12px;
          font-weight: bold;
          color: #0f766e;
          margin-bottom: 8px;
        }
        .card-value {
          font-size: 18px;
          font-weight: bold;
          color: #0f766e;
          margin-bottom: 5px;
        }
        .card-subtitle {
          font-size: 10px;
          color: #64748b;
        }
        .section-title {
          font-size: 16px;
          font-weight: bold;
          color: #0f766e;
          margin: 30px 0 15px 0;
          border-bottom: 2px solid #0f766e;
          padding-bottom: 5px;
        }
        .data-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
          font-size: 10px;
        }
        .data-table th {
          background-color: #f0fdfa;
          color: #0f766e;
          font-weight: bold;
          padding: 10px 8px;
          border: 1px solid #14b8a6;
          text-align: left;
        }
        .data-table td {
          padding: 8px;
          border: 1px solid #e5e7eb;
        }
        .data-table tbody tr:nth-child(even) {
          background-color: #f9fafb;
        }
        .status-chip {
          background-color: #dcfce7;
          color: #166534;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 9px;
          font-weight: bold;
        }
        .footer {
          background-color: #f0fdfa;
          border: 2px solid #14b8a6;
          border-radius: 8px;
          padding: 20px;
          margin-top: 30px;
        }
        .footer-title {
          font-size: 14px;
          font-weight: bold;
          color: #0f766e;
          margin-bottom: 15px;
        }
        .footer-content {
          display: flex;
          justify-content: space-between;
        }
        .footer-column {
          flex: 1;
          margin-right: 20px;
        }
        .footer-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
          font-size: 10px;
        }
        .footer-label {
          color: #64748b;
        }
        .footer-value {
          font-weight: bold;
          color: #0f766e;
        }
        .policy-note {
          background-color: #e0f2fe;
          border-left: 4px solid #0288d1;
          padding: 10px;
          margin-top: 15px;
          font-size: 10px;
        }
      </style>
    `;
  }

  generateRevenueReportHTML(
    data: RevenueReportData,
    reportType: ReportType
  ): string {
    const title =
      reportType === "admin"
        ? "Platform Revenue Report"
        : "Doctor Revenue Report";

    const dateRange = `${this.formatDate(data.dateRange.startDate)} - ${this.formatDate(data.dateRange.endDate)}`;

    const commissionPercentage = (
      (data.summary.totalCommission / data.summary.totalFees) *
      100
    ).toFixed(1);
    const doctorEarningPercentage = (
      (data.summary.totalDoctorEarnings / data.summary.totalFees) *
      100
    ).toFixed(1);

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${title}</title>
        ${this.getCommonStyles()}
      </head>
      <body>
        ${this.generateHeader(title, dateRange, data.pagination)}
        ${this.generateTransactionsTable(data.transactions, reportType)}
        ${this.generateRevenueFooter(data.summary, commissionPercentage, doctorEarningPercentage)}
      </body>
      </html>
    `;
  }

  generateDoctorsSummaryHTML(data: AllDoctorsRevenueResponse): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>All Doctors Revenue Summary Report</title>
        ${this.getCommonStyles()}
      </head>
      <body>
        ${this.generateHeader("All Doctors Revenue Summary Report", "Current Period", data.pagination)}
        ${this.generateDoctorsTable(data.doctors)}
        ${this.generateDoctorsFooter(data.totalSummary, data.doctors.length)}
      </body>
      </html>
    `;
  }

  private generateHeader(
    title: string,
    dateRange: string,
    pagination: Pagination
  ): string {
    return `
      <div class="header">
        <div class="company-name">Treatme Health Care</div>
        <div class="report-title">${title}</div>
        <div class="report-info">
          <div>Report Period: ${dateRange}</div>
          <div>Generated on: ${new Date().toLocaleDateString("en-IN")} at ${new Date().toLocaleTimeString("en-IN")}</div>
          <div>Page ${pagination.page} • ${pagination.count} total records</div>
        </div>
      </div>
    `;
  }

  private generateTransactionsTable(
    transactions: DetailedRevenueData[],
    reportType: ReportType
  ): string {
    const headers =
      reportType === "admin"
        ? [
            "Appointment ID",
            "Date",
            "Patient Name",
            "Doctor",
            "Specialization",
            "Consultation Fee",
            "Platform Commission",
            "Status",
          ]
        : [
            "Appointment ID",
            "Date",
            "Patient Name",
            "Consultation Fee",
            "Doctor Earning",
            "Status",
          ];

    const rows = transactions.map((transaction) => {
      const commonCells = [
        transaction.appointmentId,
        this.formatDate(transaction.date),
        transaction.patientName,
      ];

      if (reportType === "admin") {
        return [
          ...commonCells,
          transaction.doctorName,
          transaction.specialization,
          this.formatINR(transaction.consultationFee),
          this.formatINR(transaction.platformCommission),
          `<span class="status-chip">${transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}</span>`,
        ];
      } else {
        return [
          ...commonCells,
          this.formatINR(transaction.consultationFee),
          this.formatINR(transaction.doctorEarning),
          `<span class="status-chip">${transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}</span>`,
        ];
      }
    });

    return `
      <div class="section-title">Detailed Transaction Report</div>
      <table class="data-table">
        <thead>
          <tr>
            ${headers.map((header) => `<th>${header}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}
        </tbody>
      </table>
    `;
  }

  private generateDoctorsTable(doctors: DoctorRevenueSummary[]): string {
    return `
      <div class="section-title">Doctors Performance Summary</div>
      <table class="data-table">
        <thead>
          <tr>
            <th>Doctor Name</th>
            <th>Specialization</th>
            <th>Total Appointments</th>
            <th>Total Earnings</th>
            <th>Average per Consultation</th>
          </tr>
        </thead>
        <tbody>
          ${doctors
            .map(
              (doctor) => `
            <tr>
              <td>${doctor.doctorName}</td>
              <td>${doctor.specialization}</td>
              <td style="text-align: center">${doctor.totalAppointments}</td>
              <td style="text-align: right">${this.formatINR(doctor.totalEarnings)}</td>
              <td style="text-align: right">${this.formatINR(doctor.averageEarningPerConsultation)}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;
  }

  private generateRevenueFooter(
    summary: RevenueSummary,
    commissionPercentage: string,
    doctorEarningPercentage: string
  ): string {
    return `
      <div class="footer">
        <div class="footer-title">Revenue Summary & Analytics</div>
        <div class="footer-content">
          <div class="footer-column">
            <div class="footer-item">
              <span class="footer-label">Total Revenue Generated:</span>
              <span class="footer-value">${this.formatINR(summary.totalFees)}</span>
            </div>
            <div class="footer-item">
              <span class="footer-label">Platform Commission:</span>
              <span class="footer-value">${this.formatINR(summary.totalCommission)} (${commissionPercentage}%)</span>
            </div>
            <div class="footer-item">
              <span class="footer-label">Doctor Earnings:</span>
              <span class="footer-value">${this.formatINR(summary.totalDoctorEarnings)} (${doctorEarningPercentage}%)</span>
            </div>
          </div>
          <div class="footer-column">
            <div class="footer-item">
              <span class="footer-label">Total Appointments:</span>
              <span class="footer-value">${summary.appointmentCount}</span>
            </div>
            <div class="footer-item">
              <span class="footer-label">Average per Consultation:</span>
              <span class="footer-value">${this.formatINR(summary.averageFeePerConsultation)}</span>
            </div>
          </div>
        </div>
        <div class="policy-note">
          <div style="font-weight: bold; color: #01579b; margin-bottom: 5px;">📊 Revenue Distribution Policy</div>
          <div style="color: #0277bd;">
            Platform maintains a ${commissionPercentage}% commission on all completed consultations. 
            Doctors receive ${doctorEarningPercentage}% of the consultation fee as their earnings.
          </div>
        </div>
      </div>
    `;
  }

  private generateDoctorsFooter(
    totalSummary: RevenueSummary,
    doctorCount: number
  ): string {
    const commissionRate = (
      (totalSummary.totalCommission / totalSummary.totalFees) *
      100
    ).toFixed(1);

    return `
      <div class="footer">
        <div class="footer-title">Platform Performance Summary</div>
        <div class="footer-content">
          <div class="footer-column">
            <div class="footer-item">
              <span class="footer-label">Active Doctors:</span>
              <span class="footer-value">${doctorCount}</span>
            </div>
            <div class="footer-item">
              <span class="footer-label">Total Platform Revenue:</span>
              <span class="footer-value">${this.formatINR(totalSummary.totalFees)}</span>
            </div>
          </div>
          <div class="footer-column">
            <div class="footer-item">
              <span class="footer-label">Total Appointments:</span>
              <span class="footer-value">${totalSummary.appointmentCount}</span>
            </div>
            <div class="footer-item">
              <span class="footer-label">Commission Rate:</span>
              <span class="footer-value">${commissionRate}%</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

export default HTMLTemplateService;
