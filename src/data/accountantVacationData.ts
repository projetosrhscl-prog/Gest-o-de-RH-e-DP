import { VacationAcquisitivePeriod } from '../types/collaborator';

export interface OfficialVacationRecord {
  employeeCode: string;
  fullName: string;
  admissionDate: string;
  branchCnpj: string;
  branchName: string;
  departmentName: string;
  periods: VacationAcquisitivePeriod[];
}

export const ACCOUNTANT_REPORT_METADATA = {
  title: 'PROGRAMAÇÃO DE FÉRIAS (Relatório de Saldo Atualizado)',
  system: 'Folha de Pagamento / Contabilidade (Picter da Silva Inoue)',
  emissionDate: '08/09/2026 15:03:15',
  baseDate: '2026-09-08',
  totalEmployees: 44,
  totalCompanies: 8
};

export const OFFICIAL_ACCOUNTANT_VACATIONS: OfficialVacationRecord[] = [
  {
    "employeeCode": "32",
    "fullName": "Gilcelia Campos do Nascimento Ramos",
    "admissionDate": "2026-06-01",
    "branchCnpj": "40.397.157/0001-17",
    "branchName": "Polo Macau",
    "departmentName": "Fábrica",
    "periods": [
      {
        "id": "vac-mac-32-1",
        "startDate": "2026-06-01",
        "endDate": "2027-05-31",
        "limitConcessionDate": "2028-05-02",
        "totalDays": 30,
        "acquiredDays": 7.5,
        "takenDays": 0,
        "remainingBalance": 30,
        "fractionAvos": "03/12",
        "status": "ADQUIRINDO"
      }
    ]
  },
  {
    "employeeCode": "29",
    "fullName": "Hellen White de Morais Fernandes",
    "admissionDate": "2026-05-01",
    "branchCnpj": "40.397.157/0001-17",
    "branchName": "Polo Macau",
    "departmentName": "Fábrica",
    "periods": [
      {
        "id": "vac-mac-29-1",
        "startDate": "2026-05-01",
        "endDate": "2027-04-30",
        "limitConcessionDate": "2028-04-01",
        "totalDays": 30,
        "acquiredDays": 10,
        "takenDays": 0,
        "remainingBalance": 30,
        "fractionAvos": "04/12",
        "status": "ADQUIRINDO"
      }
    ]
  },
  {
    "employeeCode": "24",
    "fullName": "Jefferson Araujo Pereira",
    "admissionDate": "2024-08-05",
    "branchCnpj": "40.397.157/0001-17",
    "branchName": "Polo Macau",
    "departmentName": "Fábrica",
    "periods": [
      {
        "id": "vac-mac-24-1",
        "startDate": "2025-08-05",
        "endDate": "2026-08-04",
        "limitConcessionDate": "2027-07-11",
        "totalDays": 30,
        "acquiredDays": 30,
        "takenDays": 5,
        "remainingBalance": 25,
        "fractionAvos": "12/12",
        "status": "DISPONIVEL"
      },
      {
        "id": "vac-mac-24-2",
        "startDate": "2026-08-05",
        "endDate": "2027-08-04",
        "limitConcessionDate": "2028-07-06",
        "totalDays": 30,
        "acquiredDays": 2.5,
        "takenDays": 0,
        "remainingBalance": 30,
        "fractionAvos": "01/12",
        "status": "ADQUIRINDO"
      }
    ]
  },
  {
    "employeeCode": "30",
    "fullName": "Kelson Felipe dos Santos Rodrigues",
    "admissionDate": "2026-05-01",
    "branchCnpj": "40.397.157/0001-17",
    "branchName": "Polo Macau",
    "departmentName": "Fábrica",
    "periods": [
      {
        "id": "vac-mac-30-1",
        "startDate": "2026-05-01",
        "endDate": "2027-04-30",
        "limitConcessionDate": "2028-04-01",
        "totalDays": 30,
        "acquiredDays": 10,
        "takenDays": 0,
        "remainingBalance": 30,
        "fractionAvos": "04/12",
        "status": "ADQUIRINDO"
      }
    ]
  },
  {
    "employeeCode": "3",
    "fullName": "Jeyzandra da Silva Virginio",
    "admissionDate": "2022-03-01",
    "branchCnpj": "40.397.157/0001-17",
    "branchName": "Polo Macau",
    "departmentName": "Escritório",
    "periods": [
      {
        "id": "vac-mac-3-1",
        "startDate": "2025-03-01",
        "endDate": "2026-02-28",
        "limitConcessionDate": "2027-01-30",
        "totalDays": 30,
        "acquiredDays": 30,
        "takenDays": 0,
        "remainingBalance": 30,
        "fractionAvos": "12/12",
        "status": "VENCENDO"
      },
      {
        "id": "vac-mac-3-2",
        "startDate": "2026-03-01",
        "endDate": "2027-02-28",
        "limitConcessionDate": "2028-01-30",
        "totalDays": 30,
        "acquiredDays": 15,
        "takenDays": 0,
        "remainingBalance": 30,
        "fractionAvos": "06/12",
        "status": "ADQUIRINDO"
      }
    ]
  },
  {
    "employeeCode": "34",
    "fullName": "Abnner da Silva Mendes",
    "admissionDate": "2025-12-01",
    "branchCnpj": "41.681.802/0001-91",
    "branchName": "Polo João Câmara",
    "departmentName": "Fábrica",
    "periods": [
      {
        "id": "vac-jc-34-1",
        "startDate": "2025-12-01",
        "endDate": "2026-11-30",
        "limitConcessionDate": "2027-11-01",
        "totalDays": 30,
        "acquiredDays": 22.5,
        "takenDays": 0,
        "remainingBalance": 30,
        "fractionAvos": "09/12",
        "status": "ADQUIRINDO"
      }
    ]
  },
  {
    "employeeCode": "38",
    "fullName": "Denyeivisson da Silva Freire",
    "admissionDate": "2023-07-17",
    "branchCnpj": "41.681.802/0001-91",
    "branchName": "Polo João Câmara",
    "departmentName": "Fábrica",
    "periods": [
      {
        "id": "vac-jc-38-1",
        "startDate": "2025-07-17",
        "endDate": "2026-07-16",
        "limitConcessionDate": "2027-06-17",
        "totalDays": 30,
        "acquiredDays": 30,
        "takenDays": 0,
        "remainingBalance": 30,
        "fractionAvos": "12/12",
        "status": "DISPONIVEL"
      },
      {
        "id": "vac-jc-38-2",
        "startDate": "2026-07-17",
        "endDate": "2027-07-16",
        "limitConcessionDate": "2028-06-17",
        "totalDays": 30,
        "acquiredDays": 5,
        "takenDays": 0,
        "remainingBalance": 30,
        "fractionAvos": "02/12",
        "status": "ADQUIRINDO"
      }
    ]
  },
  {
    "employeeCode": "32",
    "fullName": "Hiago Felipe Vieira de Lima",
    "admissionDate": "2025-10-01",
    "branchCnpj": "41.681.802/0001-91",
    "branchName": "Polo João Câmara",
    "departmentName": "Fábrica",
    "periods": [
      {
        "id": "vac-jc-32-1",
        "startDate": "2025-10-01",
        "endDate": "2026-09-30",
        "limitConcessionDate": "2027-09-01",
        "totalDays": 30,
        "acquiredDays": 27.5,
        "takenDays": 0,
        "remainingBalance": 30,
        "fractionAvos": "11/12",
        "status": "ADQUIRINDO"
      }
    ]
  },
  {
    "employeeCode": "27",
    "fullName": "Jose Rivan Teixeira da Silva",
    "admissionDate": "2025-06-01",
    "branchCnpj": "41.681.802/0001-91",
    "branchName": "Polo João Câmara",
    "departmentName": "Fábrica",
    "periods": [
      {
        "id": "vac-jc-27-1",
        "startDate": "2025-06-01",
        "endDate": "2026-05-31",
        "limitConcessionDate": "2027-05-02",
        "totalDays": 30,
        "acquiredDays": 30,
        "takenDays": 0,
        "remainingBalance": 30,
        "fractionAvos": "12/12",
        "status": "DISPONIVEL"
      },
      {
        "id": "vac-jc-27-2",
        "startDate": "2026-06-01",
        "endDate": "2027-05-31",
        "limitConcessionDate": "2028-05-02",
        "totalDays": 30,
        "acquiredDays": 7.5,
        "takenDays": 0,
        "remainingBalance": 30,
        "fractionAvos": "03/12",
        "status": "ADQUIRINDO"
      }
    ]
  },
  {
    "employeeCode": "26",
    "fullName": "Pedro Lucas Aguiar da Silva",
    "admissionDate": "2025-05-01",
    "branchCnpj": "41.681.802/0001-91",
    "branchName": "Polo João Câmara",
    "departmentName": "Fábrica",
    "periods": [
      {
        "id": "vac-jc-26-1",
        "startDate": "2025-05-01",
        "endDate": "2026-04-30",
        "limitConcessionDate": "2027-04-17",
        "totalDays": 30,
        "acquiredDays": 30,
        "takenDays": 16,
        "remainingBalance": 14,
        "fractionAvos": "12/12",
        "status": "DISPONIVEL"
      },
      {
        "id": "vac-jc-26-2",
        "startDate": "2026-05-01",
        "endDate": "2027-04-30",
        "limitConcessionDate": "2028-04-01",
        "totalDays": 30,
        "acquiredDays": 10,
        "takenDays": 0,
        "remainingBalance": 30,
        "fractionAvos": "04/12",
        "status": "ADQUIRINDO"
      }
    ]
  },
  {
    "employeeCode": "40",
    "fullName": "Pedro Paulino Lucio Neto",
    "admissionDate": "2026-04-01",
    "branchCnpj": "41.681.802/0001-91",
    "branchName": "Polo João Câmara",
    "departmentName": "Fábrica",
    "periods": [
      {
        "id": "vac-jc-40-1",
        "startDate": "2026-04-01",
        "endDate": "2027-03-31",
        "limitConcessionDate": "2028-03-02",
        "totalDays": 30,
        "acquiredDays": 12.5,
        "takenDays": 0,
        "remainingBalance": 30,
        "fractionAvos": "05/12",
        "faultDays": 1,
        "status": "ADQUIRINDO"
      }
    ]
  },
  {
    "employeeCode": "42",
    "fullName": "Yanca Clara Silva de Oliveira Barbosa",
    "admissionDate": "2026-07-01",
    "branchCnpj": "41.681.802/0001-91",
    "branchName": "Polo João Câmara",
    "departmentName": "Fábrica",
    "periods": [
      {
        "id": "vac-jc-42-1",
        "startDate": "2026-07-01",
        "endDate": "2027-06-30",
        "limitConcessionDate": "2028-06-01",
        "totalDays": 30,
        "acquiredDays": 5,
        "takenDays": 0,
        "remainingBalance": 30,
        "fractionAvos": "02/12",
        "status": "ADQUIRINDO"
      }
    ]
  },
  {
    "employeeCode": "4",
    "fullName": "Nallanda Lorena Silva de Araujo",
    "admissionDate": "2022-03-01",
    "branchCnpj": "41.681.802/0001-91",
    "branchName": "Polo João Câmara",
    "departmentName": "Escritório",
    "periods": [
      {
        "id": "vac-jc-4-1",
        "startDate": "2025-03-01",
        "endDate": "2026-02-28",
        "limitConcessionDate": "2027-01-30",
        "totalDays": 30,
        "acquiredDays": 30,
        "takenDays": 0,
        "remainingBalance": 30,
        "fractionAvos": "12/12",
        "faultDays": 1,
        "status": "VENCENDO"
      },
      {
        "id": "vac-jc-4-2",
        "startDate": "2026-03-01",
        "endDate": "2027-02-28",
        "limitConcessionDate": "2028-01-30",
        "totalDays": 30,
        "acquiredDays": 15,
        "takenDays": 0,
        "remainingBalance": 30,
        "fractionAvos": "06/12",
        "status": "ADQUIRINDO"
      }
    ]
  },
  {
    "employeeCode": "15",
    "fullName": "Anderson Azevedo da Silva",
    "admissionDate": "2026-03-01",
    "branchCnpj": "41.250.544/0001-99",
    "branchName": "Polo Parelhas",
    "departmentName": "Fábrica",
    "periods": [
      {
        "id": "vac-par-15-1",
        "startDate": "2026-03-01",
        "endDate": "2027-02-28",
        "limitConcessionDate": "2028-01-30",
        "totalDays": 30,
        "acquiredDays": 15,
        "takenDays": 0,
        "remainingBalance": 30,
        "fractionAvos": "06/12",
        "status": "ADQUIRINDO"
      }
    ]
  },
  {
    "employeeCode": "10",
    "fullName": "Gustavo Macedo Freire",
    "admissionDate": "2025-08-01",
    "branchCnpj": "41.250.544/0001-99",
    "branchName": "Polo Parelhas",
    "departmentName": "Fábrica",
    "periods": [
      {
        "id": "vac-par-10-1",
        "startDate": "2025-08-01",
        "endDate": "2026-07-31",
        "limitConcessionDate": "2027-07-17",
        "totalDays": 30,
        "acquiredDays": 30,
        "takenDays": 15,
        "remainingBalance": 15,
        "fractionAvos": "12/12",
        "absenceDays": 15,
        "status": "DISPONIVEL"
      },
      {
        "id": "vac-par-10-2",
        "startDate": "2026-08-01",
        "endDate": "2027-07-31",
        "limitConcessionDate": "2028-07-02",
        "totalDays": 30,
        "acquiredDays": 2.5,
        "takenDays": 0,
        "remainingBalance": 30,
        "fractionAvos": "01/12",
        "status": "ADQUIRINDO"
      }
    ]
  },
  {
    "employeeCode": "12",
    "fullName": "Joao Rogerio de Lucena Junior",
    "admissionDate": "2025-10-01",
    "branchCnpj": "41.250.544/0001-99",
    "branchName": "Polo Parelhas",
    "departmentName": "Fábrica",
    "periods": [
      {
        "id": "vac-par-12-1",
        "startDate": "2025-10-01",
        "endDate": "2026-09-30",
        "limitConcessionDate": "2027-09-01",
        "totalDays": 30,
        "acquiredDays": 27.5,
        "takenDays": 0,
        "remainingBalance": 30,
        "fractionAvos": "11/12",
        "status": "ADQUIRINDO"
      }
    ]
  },
  {
    "employeeCode": "17",
    "fullName": "Pedro Henrique de Medeiros Silva",
    "admissionDate": "2026-05-01",
    "branchCnpj": "41.250.544/0001-99",
    "branchName": "Polo Parelhas",
    "departmentName": "Fábrica",
    "periods": [
      {
        "id": "vac-par-17-1",
        "startDate": "2026-05-01",
        "endDate": "2027-04-30",
        "limitConcessionDate": "2028-04-01",
        "totalDays": 30,
        "acquiredDays": 10,
        "takenDays": 0,
        "remainingBalance": 30,
        "fractionAvos": "04/12",
        "status": "ADQUIRINDO"
      }
    ]
  },
  {
    "employeeCode": "2",
    "fullName": "Luciana Azevedo do Nascimento",
    "admissionDate": "2023-02-01",
    "branchCnpj": "41.250.544/0001-99",
    "branchName": "Polo Parelhas",
    "departmentName": "Escritório",
    "periods": [
      {
        "id": "vac-par-2-1",
        "startDate": "2025-02-01",
        "endDate": "2026-01-31",
        "limitConcessionDate": "2027-01-07",
        "totalDays": 30,
        "acquiredDays": 30,
        "takenDays": 5,
        "remainingBalance": 25,
        "fractionAvos": "12/12",
        "status": "VENCENDO"
      },
      {
        "id": "vac-par-2-2",
        "startDate": "2026-02-01",
        "endDate": "2027-01-31",
        "limitConcessionDate": "2028-01-02",
        "totalDays": 30,
        "acquiredDays": 17.5,
        "takenDays": 0,
        "remainingBalance": 30,
        "fractionAvos": "07/12",
        "status": "ADQUIRINDO"
      }
    ]
  },
  {
    "employeeCode": "10",
    "fullName": "Antonio Afranio Nunes Costa",
    "admissionDate": "2025-06-13",
    "branchCnpj": "36.779.792/0001-91",
    "branchName": "Polo Apodi",
    "departmentName": "Fábrica",
    "periods": [
      {
        "id": "vac-apo-10-1",
        "startDate": "2025-06-13",
        "endDate": "2026-06-12",
        "limitConcessionDate": "2027-05-14",
        "totalDays": 30,
        "acquiredDays": 30,
        "takenDays": 0,
        "remainingBalance": 30,
        "fractionAvos": "12/12",
        "status": "DISPONIVEL"
      },
      {
        "id": "vac-apo-10-2",
        "startDate": "2026-06-13",
        "endDate": "2027-06-12",
        "limitConcessionDate": "2028-05-14",
        "totalDays": 30,
        "acquiredDays": 7.5,
        "takenDays": 0,
        "remainingBalance": 30,
        "fractionAvos": "03/12",
        "status": "ADQUIRINDO"
      }
    ]
  },
  {
    "employeeCode": "9",
    "fullName": "Erickson Matheus dos Reis Silva",
    "admissionDate": "2025-03-10",
    "branchCnpj": "36.779.792/0001-91",
    "branchName": "Polo Apodi",
    "departmentName": "Fábrica",
    "periods": [
      {
        "id": "vac-apo-9-1",
        "startDate": "2025-03-10",
        "endDate": "2026-03-09",
        "limitConcessionDate": "2027-02-23",
        "totalDays": 30,
        "acquiredDays": 30,
        "takenDays": 15,
        "remainingBalance": 15,
        "fractionAvos": "12/12",
        "status": "VENCENDO"
      },
      {
        "id": "vac-apo-9-2",
        "startDate": "2026-03-10",
        "endDate": "2027-03-09",
        "limitConcessionDate": "2028-02-09",
        "totalDays": 30,
        "acquiredDays": 15,
        "takenDays": 0,
        "remainingBalance": 30,
        "fractionAvos": "06/12",
        "absenceDays": 6,
        "status": "ADQUIRINDO"
      }
    ]
  },
  {
    "employeeCode": "8",
    "fullName": "Pedro Bores Candido de Oliveira Mesquita",
    "admissionDate": "2024-07-01",
    "branchCnpj": "36.779.792/0001-91",
    "branchName": "Polo Apodi",
    "departmentName": "Fábrica",
    "periods": [
      {
        "id": "vac-apo-8-1",
        "startDate": "2025-07-01",
        "endDate": "2026-06-30",
        "limitConcessionDate": "2027-06-01",
        "totalDays": 30,
        "acquiredDays": 30,
        "takenDays": 0,
        "remainingBalance": 30,
        "fractionAvos": "12/12",
        "status": "DISPONIVEL"
      },
      {
        "id": "vac-apo-8-2",
        "startDate": "2026-07-01",
        "endDate": "2027-06-30",
        "limitConcessionDate": "2028-06-01",
        "totalDays": 30,
        "acquiredDays": 5,
        "takenDays": 0,
        "remainingBalance": 30,
        "fractionAvos": "02/12",
        "status": "ADQUIRINDO"
      }
    ]
  },
  {
    "employeeCode": "5",
    "fullName": "Ricardo Martins Tavares Junior",
    "admissionDate": "2023-08-28",
    "branchCnpj": "36.779.792/0001-91",
    "branchName": "Polo Apodi",
    "departmentName": "Escritório",
    "periods": [
      {
        "id": "vac-apo-5-1",
        "startDate": "2025-08-28",
        "endDate": "2026-08-27",
        "limitConcessionDate": "2027-07-29",
        "totalDays": 30,
        "acquiredDays": 30,
        "takenDays": 0,
        "remainingBalance": 30,
        "fractionAvos": "12/12",
        "faultDays": 1,
        "status": "DISPONIVEL"
      },
      {
        "id": "vac-apo-5-2",
        "startDate": "2026-08-28",
        "endDate": "2027-08-27",
        "limitConcessionDate": "2028-07-29",
        "totalDays": 30,
        "acquiredDays": 0,
        "takenDays": 0,
        "remainingBalance": 30,
        "fractionAvos": "00/12",
        "status": "ADQUIRINDO"
      }
    ]
  },
  {
    "employeeCode": "28",
    "fullName": "Aysla Candeia Mendes",
    "admissionDate": "2026-04-01",
    "branchCnpj": "48.286.909/0001-84",
    "branchName": "Polo Patos",
    "departmentName": "Fábrica",
    "periods": [
      {
        "id": "vac-pat-28-1",
        "startDate": "2026-04-01",
        "endDate": "2027-03-31",
        "limitConcessionDate": "2028-03-02",
        "totalDays": 30,
        "acquiredDays": 12.5,
        "takenDays": 0,
        "remainingBalance": 30,
        "fractionAvos": "05/12",
        "status": "ADQUIRINDO"
      }
    ]
  },
  {
    "employeeCode": "27",
    "fullName": "Douglas Cavalcante Gomes",
    "admissionDate": "2026-03-01",
    "branchCnpj": "48.286.909/0001-84",
    "branchName": "Polo Patos",
    "departmentName": "Fábrica",
    "periods": [
      {
        "id": "vac-pat-27-1",
        "startDate": "2026-03-01",
        "endDate": "2027-02-28",
        "limitConcessionDate": "2028-01-30",
        "totalDays": 30,
        "acquiredDays": 15,
        "takenDays": 0,
        "remainingBalance": 30,
        "fractionAvos": "06/12",
        "status": "ADQUIRINDO"
      }
    ]
  },
  {
    "employeeCode": "17",
    "fullName": "Kelvys Gomes de Sousa",
    "admissionDate": "2024-08-12",
    "branchCnpj": "48.286.909/0001-84",
    "branchName": "Polo Patos",
    "departmentName": "Fábrica",
    "periods": [
      {
        "id": "vac-pat-17-1",
        "startDate": "2025-08-12",
        "endDate": "2026-08-11",
        "limitConcessionDate": "2027-07-13",
        "totalDays": 30,
        "acquiredDays": 30,
        "takenDays": 0,
        "remainingBalance": 30,
        "fractionAvos": "12/12",
        "status": "DISPONIVEL"
      },
      {
        "id": "vac-pat-17-2",
        "startDate": "2026-08-12",
        "endDate": "2027-08-11",
        "limitConcessionDate": "2028-07-13",
        "totalDays": 30,
        "acquiredDays": 2.5,
        "takenDays": 0,
        "remainingBalance": 30,
        "fractionAvos": "01/12",
        "status": "ADQUIRINDO"
      }
    ]
  },
  {
    "employeeCode": "19",
    "fullName": "Leticia de Lima Martins Diniz",
    "admissionDate": "2025-06-01",
    "branchCnpj": "48.286.909/0001-84",
    "branchName": "Polo Patos",
    "departmentName": "Fábrica",
    "periods": [
      {
        "id": "vac-pat-19-1",
        "startDate": "2025-06-01",
        "endDate": "2026-05-31",
        "limitConcessionDate": "2027-05-17",
        "totalDays": 30,
        "acquiredDays": 30,
        "takenDays": 15,
        "remainingBalance": 15,
        "fractionAvos": "12/12",
        "status": "DISPONIVEL"
      },
      {
        "id": "vac-pat-19-2",
        "startDate": "2026-06-01",
        "endDate": "2027-05-31",
        "limitConcessionDate": "2028-05-02",
        "totalDays": 30,
        "acquiredDays": 7.5,
        "takenDays": 0,
        "remainingBalance": 30,
        "fractionAvos": "03/12",
        "absenceDays": 15,
        "status": "ADQUIRINDO"
      }
    ]
  },
  {
    "employeeCode": "15",
    "fullName": "Renato Rodrigues Silva Santos",
    "admissionDate": "2024-06-03",
    "branchCnpj": "48.286.909/0001-84",
    "branchName": "Polo Patos",
    "departmentName": "Fábrica",
    "periods": [
      {
        "id": "vac-pat-15-1",
        "startDate": "2025-06-03",
        "endDate": "2026-06-02",
        "limitConcessionDate": "2027-05-04",
        "totalDays": 30,
        "acquiredDays": 30,
        "takenDays": 0,
        "remainingBalance": 30,
        "fractionAvos": "12/12",
        "status": "DISPONIVEL"
      },
      {
        "id": "vac-pat-15-2",
        "startDate": "2026-06-03",
        "endDate": "2027-06-02",
        "limitConcessionDate": "2028-05-04",
        "totalDays": 30,
        "acquiredDays": 7.5,
        "takenDays": 0,
        "remainingBalance": 30,
        "fractionAvos": "03/12",
        "status": "ADQUIRINDO"
      }
    ]
  },
  {
    "employeeCode": "2",
    "fullName": "Jose Lenildo Barbosa Leite da Silva",
    "admissionDate": "2023-02-08",
    "branchCnpj": "48.286.909/0001-84",
    "branchName": "Polo Patos",
    "departmentName": "Escritório",
    "periods": [
      {
        "id": "vac-pat-2-1",
        "startDate": "2025-02-08",
        "endDate": "2026-02-07",
        "limitConcessionDate": "2027-01-09",
        "totalDays": 30,
        "acquiredDays": 30,
        "takenDays": 0,
        "remainingBalance": 30,
        "fractionAvos": "12/12",
        "status": "VENCENDO"
      },
      {
        "id": "vac-pat-2-2",
        "startDate": "2026-02-08",
        "endDate": "2027-02-07",
        "limitConcessionDate": "2028-01-09",
        "totalDays": 30,
        "acquiredDays": 17.5,
        "takenDays": 0,
        "remainingBalance": 30,
        "fractionAvos": "07/12",
        "status": "ADQUIRINDO"
      }
    ]
  },
  {
    "employeeCode": "9",
    "fullName": "Leticia Mayara Dias Moreira",
    "admissionDate": "2023-08-16",
    "branchCnpj": "48.286.909/0001-84",
    "branchName": "Polo Patos",
    "departmentName": "Escritório",
    "periods": [
      {
        "id": "vac-pat-9-1",
        "startDate": "2025-08-16",
        "endDate": "2026-08-15",
        "limitConcessionDate": "2027-07-17",
        "totalDays": 30,
        "acquiredDays": 30,
        "takenDays": 0,
        "remainingBalance": 30,
        "fractionAvos": "12/12",
        "status": "DISPONIVEL"
      },
      {
        "id": "vac-pat-9-2",
        "startDate": "2026-08-16",
        "endDate": "2027-08-15",
        "limitConcessionDate": "2028-07-17",
        "totalDays": 30,
        "acquiredDays": 2.5,
        "takenDays": 0,
        "remainingBalance": 30,
        "fractionAvos": "01/12",
        "status": "ADQUIRINDO"
      }
    ]
  },
  {
    "employeeCode": "30",
    "fullName": "Beatriz Campos Alvarenga",
    "admissionDate": "2026-06-01",
    "branchCnpj": "51.254.418/0001-66",
    "branchName": "Polo Paracatu",
    "departmentName": "Fábrica",
    "periods": [
      {
        "id": "vac-paracatu-30-1",
        "startDate": "2026-06-01",
        "endDate": "2027-05-31",
        "limitConcessionDate": "2028-05-02",
        "totalDays": 30,
        "acquiredDays": 7.5,
        "takenDays": 0,
        "remainingBalance": 30,
        "fractionAvos": "03/12",
        "status": "ADQUIRINDO"
      }
    ]
  },
  {
    "employeeCode": "27",
    "fullName": "Dinarte Jovelino da Silva",
    "admissionDate": "2023-08-28",
    "branchCnpj": "51.254.418/0001-66",
    "branchName": "Polo Paracatu",
    "departmentName": "Escritório",
    "periods": [
      {
        "id": "vac-paracatu-27-1",
        "startDate": "2025-08-28",
        "endDate": "2026-08-27",
        "limitConcessionDate": "2027-07-29",
        "totalDays": 30,
        "acquiredDays": 30,
        "takenDays": 0,
        "remainingBalance": 30,
        "fractionAvos": "12/12",
        "status": "DISPONIVEL"
      },
      {
        "id": "vac-paracatu-27-2",
        "startDate": "2026-08-28",
        "endDate": "2027-08-27",
        "limitConcessionDate": "2028-07-29",
        "totalDays": 30,
        "acquiredDays": 0,
        "takenDays": 0,
        "remainingBalance": 30,
        "fractionAvos": "00/12",
        "status": "ADQUIRINDO"
      }
    ]
  },
  {
    "employeeCode": "26",
    "fullName": "Abner Rafaell Rodrigues Apolonio de Siqueira",
    "admissionDate": "2025-07-01",
    "branchCnpj": "54.707.841/0001-62",
    "branchName": "Polo Limoeiro do Norte",
    "departmentName": "Geral",
    "periods": [
      {
        "id": "vac-lim-26-1",
        "startDate": "2026-07-01",
        "endDate": "2027-06-30",
        "limitConcessionDate": "2028-06-01",
        "totalDays": 30,
        "acquiredDays": 5,
        "takenDays": 0,
        "remainingBalance": 30,
        "fractionAvos": "02/12",
        "status": "ADQUIRINDO"
      }
    ]
  },
  {
    "employeeCode": "6",
    "fullName": "Ana Kelvia Bezerra de Matos",
    "admissionDate": "2024-07-01",
    "branchCnpj": "54.707.841/0001-62",
    "branchName": "Polo Limoeiro do Norte",
    "departmentName": "Geral",
    "periods": [
      {
        "id": "vac-lim-6-1",
        "startDate": "2025-07-01",
        "endDate": "2026-06-30",
        "limitConcessionDate": "2027-06-01",
        "totalDays": 30,
        "acquiredDays": 30,
        "takenDays": 0,
        "remainingBalance": 30,
        "fractionAvos": "12/12",
        "status": "DISPONIVEL"
      },
      {
        "id": "vac-lim-6-2",
        "startDate": "2026-07-01",
        "endDate": "2027-06-30",
        "limitConcessionDate": "2028-06-01",
        "totalDays": 30,
        "acquiredDays": 5,
        "takenDays": 0,
        "remainingBalance": 30,
        "fractionAvos": "02/12",
        "status": "ADQUIRINDO"
      }
    ]
  },
  {
    "employeeCode": "22",
    "fullName": "Antonio Alcenir Batista Morais",
    "admissionDate": "2025-10-01",
    "branchCnpj": "54.707.841/0001-62",
    "branchName": "Polo Limoeiro do Norte",
    "departmentName": "Geral",
    "periods": [
      {
        "id": "vac-lim-22-1",
        "startDate": "2025-10-01",
        "endDate": "2026-09-30",
        "limitConcessionDate": "2027-09-01",
        "totalDays": 30,
        "acquiredDays": 27.5,
        "takenDays": 0,
        "remainingBalance": 30,
        "fractionAvos": "11/12",
        "status": "ADQUIRINDO"
      }
    ]
  },
  {
    "employeeCode": "31",
    "fullName": "Arilson de Freitas Rabelo",
    "admissionDate": "2026-06-01",
    "branchCnpj": "54.707.841/0001-62",
    "branchName": "Polo Limoeiro do Norte",
    "departmentName": "Geral",
    "periods": [
      {
        "id": "vac-lim-31-1",
        "startDate": "2026-06-01",
        "endDate": "2027-05-31",
        "limitConcessionDate": "2028-05-02",
        "totalDays": 30,
        "acquiredDays": 7.5,
        "takenDays": 0,
        "remainingBalance": 30,
        "fractionAvos": "03/12",
        "status": "ADQUIRINDO"
      }
    ]
  },
  {
    "employeeCode": "8",
    "fullName": "Jose Ytalo de Menezes Pereira",
    "admissionDate": "2024-10-28",
    "branchCnpj": "54.707.841/0001-62",
    "branchName": "Polo Limoeiro do Norte",
    "departmentName": "Geral",
    "periods": [
      {
        "id": "vac-lim-8-1",
        "startDate": "2025-10-28",
        "endDate": "2026-10-27",
        "limitConcessionDate": "2027-09-28",
        "totalDays": 30,
        "acquiredDays": 25,
        "takenDays": 0,
        "remainingBalance": 30,
        "fractionAvos": "10/12",
        "status": "ADQUIRINDO"
      }
    ]
  },
  {
    "employeeCode": "35",
    "fullName": "Mateus Cavalcante Ramos",
    "admissionDate": "2024-07-01",
    "branchCnpj": "54.707.841/0001-62",
    "branchName": "Polo Limoeiro do Norte",
    "departmentName": "Geral",
    "periods": [
      {
        "id": "vac-lim-35-1",
        "startDate": "2025-07-01",
        "endDate": "2026-06-30",
        "limitConcessionDate": "2027-06-01",
        "totalDays": 30,
        "acquiredDays": 30,
        "takenDays": 0,
        "remainingBalance": 30,
        "fractionAvos": "12/12",
        "status": "DISPONIVEL"
      },
      {
        "id": "vac-lim-35-2",
        "startDate": "2026-07-01",
        "endDate": "2027-06-30",
        "limitConcessionDate": "2028-06-01",
        "totalDays": 30,
        "acquiredDays": 5,
        "takenDays": 0,
        "remainingBalance": 30,
        "fractionAvos": "02/12",
        "status": "ADQUIRINDO"
      }
    ]
  },
  {
    "employeeCode": "34",
    "fullName": "Mayara Isa Maia",
    "admissionDate": "2026-08-01",
    "branchCnpj": "54.707.841/0001-62",
    "branchName": "Polo Limoeiro do Norte",
    "departmentName": "Geral",
    "periods": [
      {
        "id": "vac-lim-34-1",
        "startDate": "2026-08-01",
        "endDate": "2027-07-31",
        "limitConcessionDate": "2028-07-02",
        "totalDays": 30,
        "acquiredDays": 2.5,
        "takenDays": 0,
        "remainingBalance": 30,
        "fractionAvos": "01/12",
        "status": "ADQUIRINDO"
      }
    ]
  },
  {
    "employeeCode": "30",
    "fullName": "Naylane Rivina Bezerra Oliveira",
    "admissionDate": "2026-05-01",
    "branchCnpj": "54.707.841/0001-62",
    "branchName": "Polo Limoeiro do Norte",
    "departmentName": "Geral",
    "periods": [
      {
        "id": "vac-lim-30-1",
        "startDate": "2026-05-01",
        "endDate": "2027-04-30",
        "limitConcessionDate": "2028-04-01",
        "totalDays": 30,
        "acquiredDays": 10,
        "takenDays": 0,
        "remainingBalance": 30,
        "fractionAvos": "04/12",
        "status": "ADQUIRINDO"
      }
    ]
  },
  {
    "employeeCode": "17",
    "fullName": "Victor Hugo Silva Merces",
    "admissionDate": "2025-08-01",
    "branchCnpj": "54.707.841/0001-62",
    "branchName": "Polo Limoeiro do Norte",
    "departmentName": "Geral",
    "periods": [
      {
        "id": "vac-lim-17-1",
        "startDate": "2025-08-01",
        "endDate": "2026-07-31",
        "limitConcessionDate": "2027-07-02",
        "totalDays": 30,
        "acquiredDays": 30,
        "takenDays": 0,
        "remainingBalance": 30,
        "fractionAvos": "12/12",
        "faultDays": 1,
        "status": "DISPONIVEL"
      },
      {
        "id": "vac-lim-17-2",
        "startDate": "2026-08-01",
        "endDate": "2027-07-31",
        "limitConcessionDate": "2028-07-02",
        "totalDays": 30,
        "acquiredDays": 2.5,
        "takenDays": 0,
        "remainingBalance": 30,
        "fractionAvos": "01/12",
        "status": "ADQUIRINDO"
      }
    ]
  },
  {
    "employeeCode": "6",
    "fullName": "Gustavo Santos de Carvalho",
    "admissionDate": "2026-04-01",
    "branchCnpj": "58.336.294/0001-07",
    "branchName": "Polo Trairi",
    "departmentName": "Fábrica",
    "periods": [
      {
        "id": "vac-tra-6-1",
        "startDate": "2026-04-01",
        "endDate": "2027-03-31",
        "limitConcessionDate": "2028-03-02",
        "totalDays": 30,
        "acquiredDays": 12.5,
        "takenDays": 0,
        "remainingBalance": 30,
        "fractionAvos": "05/12",
        "status": "ADQUIRINDO"
      }
    ]
  },
  {
    "employeeCode": "3",
    "fullName": "Maria Helena Freitas Braga de Oliveira",
    "admissionDate": "2025-05-26",
    "branchCnpj": "58.336.294/0001-07",
    "branchName": "Polo Trairi",
    "departmentName": "Fábrica",
    "periods": [
      {
        "id": "vac-tra-3-1",
        "startDate": "2025-05-26",
        "endDate": "2026-05-25",
        "limitConcessionDate": "2027-05-11",
        "totalDays": 30,
        "acquiredDays": 30,
        "takenDays": 15,
        "remainingBalance": 15,
        "fractionAvos": "12/12",
        "status": "DISPONIVEL"
      },
      {
        "id": "vac-tra-3-2",
        "startDate": "2026-05-26",
        "endDate": "2027-05-25",
        "limitConcessionDate": "2028-04-26",
        "totalDays": 30,
        "acquiredDays": 7.5,
        "takenDays": 0,
        "remainingBalance": 30,
        "fractionAvos": "03/12",
        "faultDays": 4,
        "status": "ADQUIRINDO"
      }
    ]
  },
  {
    "employeeCode": "5",
    "fullName": "Naelly Kelly Dantas de Oliveira",
    "admissionDate": "2024-03-04",
    "branchCnpj": "58.336.294/0001-07",
    "branchName": "Polo Trairi",
    "departmentName": "Fábrica",
    "periods": [
      {
        "id": "vac-tra-5-1",
        "startDate": "2025-03-04",
        "endDate": "2026-03-03",
        "limitConcessionDate": "2027-02-12",
        "totalDays": 30,
        "acquiredDays": 30,
        "takenDays": 10,
        "remainingBalance": 20,
        "fractionAvos": "12/12",
        "status": "VENCENDO"
      },
      {
        "id": "vac-tra-5-2",
        "startDate": "2026-03-04",
        "endDate": "2027-03-03",
        "limitConcessionDate": "2028-02-03",
        "totalDays": 30,
        "acquiredDays": 15,
        "takenDays": 0,
        "remainingBalance": 30,
        "fractionAvos": "06/12",
        "status": "ADQUIRINDO"
      }
    ]
  },
  {
    "employeeCode": "1",
    "fullName": "Witalo da Silva Ferreira",
    "admissionDate": "2025-03-10",
    "branchCnpj": "58.336.294/0001-07",
    "branchName": "Polo Trairi",
    "departmentName": "Fábrica",
    "periods": [
      {
        "id": "vac-tra-1-1",
        "startDate": "2025-03-10",
        "endDate": "2026-03-09",
        "limitConcessionDate": "2027-02-08",
        "totalDays": 30,
        "acquiredDays": 30,
        "takenDays": 0,
        "remainingBalance": 30,
        "fractionAvos": "12/12",
        "status": "VENCENDO"
      },
      {
        "id": "vac-tra-1-2",
        "startDate": "2026-03-10",
        "endDate": "2027-03-09",
        "limitConcessionDate": "2028-02-09",
        "totalDays": 30,
        "acquiredDays": 15,
        "takenDays": 0,
        "remainingBalance": 30,
        "fractionAvos": "06/12",
        "status": "ADQUIRINDO"
      }
    ]
  }
];

/**
 * Encontra os períodos de férias oficiais para um colaborador pelo nome ou código
 */
export function getOfficialVacationsForCollaborator(fullName: string): VacationAcquisitivePeriod[] | null {
  if (!fullName) return null;
  const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  const target = norm(fullName);

  const found = OFFICIAL_ACCOUNTANT_VACATIONS.find((rec) => {
    const recNorm = norm(rec.fullName);
    return recNorm === target || target.includes(recNorm) || recNorm.includes(target);
  });

  return found ? found.periods : null;
}
