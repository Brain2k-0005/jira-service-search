
import { Department } from "../types/directory";

export const mockDepartments: Department[] = [
  {
    id: "dept-1",
    name: "IT Department",
    description: "Information Technology services and support",
    categories: [
      {
        id: "cat-1",
        name: "Hardware Support",
        description: "Hardware-related services and support",
        departmentId: "dept-1",
        subcategories: [
          {
            id: "subcat-1",
            name: "Laptops",
            description: "Laptop-related services",
            categoryId: "cat-1",
            services: [
              {
                id: "serv-1",
                name: "Request a Laptop",
                description: "Request a new laptop for work",
                link: "https://example.com/request-laptop",
                contactEmail: "it-hardware@example.com",
                subcategoryId: "subcat-1"
              },
              {
                id: "serv-2",
                name: "Repair Laptop",
                description: "Submit a repair request for your laptop",
                link: "https://example.com/repair-laptop",
                contactEmail: "it-repairs@example.com",
                subcategoryId: "subcat-1"
              }
            ]
          },
          {
            id: "subcat-2",
            name: "Monitors",
            description: "Monitor-related services",
            categoryId: "cat-1",
            services: [
              {
                id: "serv-3",
                name: "Request an Additional Monitor",
                description: "Request an additional monitor for your workspace",
                link: "https://example.com/request-monitor",
                contactEmail: "it-hardware@example.com",
                subcategoryId: "subcat-2"
              }
            ]
          }
        ]
      },
      {
        id: "cat-2",
        name: "Software Support",
        description: "Software-related services and support",
        departmentId: "dept-1",
        subcategories: [
          {
            id: "subcat-3",
            name: "Business Applications",
            description: "Business application support",
            categoryId: "cat-2",
            services: [
              {
                id: "serv-4",
                name: "Software Installation Request",
                description: "Request installation of business software",
                link: "https://example.com/software-install",
                contactEmail: "it-software@example.com",
                subcategoryId: "subcat-3"
              },
              {
                id: "serv-5",
                name: "Software License Request",
                description: "Request a license for business software",
                link: "https://example.com/software-license",
                contactEmail: "it-software@example.com",
                subcategoryId: "subcat-3"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "dept-2",
    name: "HR Department",
    description: "Human Resources services and support",
    categories: [
      {
        id: "cat-3",
        name: "Employment",
        description: "Employment-related services",
        departmentId: "dept-2",
        subcategories: [
          {
            id: "subcat-4",
            name: "Contracts",
            description: "Contract-related services",
            categoryId: "cat-3",
            services: [
              {
                id: "serv-6",
                name: "Contract Amendment",
                description: "Request an amendment to your contract",
                link: "https://example.com/contract-amendment",
                contactEmail: "hr-contracts@example.com",
                subcategoryId: "subcat-4"
              },
              {
                id: "serv-7",
                name: "Resignation",
                description: "Submit your resignation",
                link: "https://example.com/resignation",
                contactEmail: "hr-contracts@example.com",
                subcategoryId: "subcat-4"
              }
            ]
          }
        ]
      },
      {
        id: "cat-4",
        name: "Benefits",
        description: "Employee benefits services",
        departmentId: "dept-2",
        subcategories: [
          {
            id: "subcat-5",
            name: "Health Insurance",
            description: "Health insurance related services",
            categoryId: "cat-4",
            services: [
              {
                id: "serv-8",
                name: "Health Insurance Enrollment",
                description: "Enroll in company health insurance",
                link: "https://example.com/health-insurance",
                contactEmail: "hr-benefits@example.com",
                subcategoryId: "subcat-5"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "dept-3",
    name: "Finance Department",
    description: "Finance and accounting services",
    categories: [
      {
        id: "cat-5",
        name: "Expenses",
        description: "Expense-related services",
        departmentId: "dept-3",
        subcategories: [
          {
            id: "subcat-6",
            name: "Travel Expenses",
            description: "Travel expense related services",
            categoryId: "cat-5",
            services: [
              {
                id: "serv-9",
                name: "Travel Expense Claim",
                description: "Submit a claim for travel expenses",
                link: "https://example.com/travel-expenses",
                contactEmail: "finance-expenses@example.com",
                subcategoryId: "subcat-6"
              }
            ]
          },
          {
            id: "subcat-7",
            name: "Project Expenses",
            description: "Project expense related services",
            categoryId: "cat-5",
            services: [
              {
                id: "serv-10",
                name: "Project Budget Request",
                description: "Request a budget for a project",
                link: "https://example.com/project-budget",
                contactEmail: "finance-projects@example.com",
                subcategoryId: "subcat-7"
              }
            ]
          }
        ]
      }
    ]
  }
];
