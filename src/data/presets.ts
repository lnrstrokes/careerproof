import { PresetScenario } from '../types';

export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: "urgent-toronto-fullstack",
    title: "⚡ Urgent: Senior Full-Stack in Toronto (5-Day Deadline)",
    description: "Lagos-based Full-Stack Developer applying to Senior Full-Stack Developer at a Toronto fintech. Urgent 5-day deadline.",
    targetRole: "Senior Full-Stack Developer",
    targetCity: "Toronto, ON",
    deadlineDays: 5,
    deadlineDate: "2026-09-04",
    educationDegree: "B.Sc. Computer Science (University of Lagos)",
    hasWesEca: true,
    resumeText: `Emanuel Adebayo
Full-Stack Software Engineer | Lagos, Nigeria | Open to Relocate to Canada
Email: e.adebayo@example.com | GitHub: github.com/eadebayo | LinkedIn: linkedin.com/in/eadebayo

PROFESSIONAL SUMMARY:
Full-Stack Engineer with 5+ years of experience building scalable web applications using React, Node.js, Express, TypeScript, and PostgreSQL. Experienced in microservices architecture, RESTful APIs, and cloud deployments on AWS.

WORK EXPERIENCE:
Senior Software Engineer | PayTech Global (Lagos) | Jan 2022 - Present
- Led development of core payment routing microservices serving over 2M monthly transactions across West Africa.
- Engineered responsive React dashboard with Redux Toolkit and TypeScript, reducing client bundle size by 35%.
- Implemented PostgreSQL database indexing and query optimizations that improved transaction throughput by 40%.
- Integrated Redis caching layer for quick authorization token lookup, lowering API latency to under 120ms.
- Mentored 4 junior developers and conducted daily code reviews adhering to CI/CD automated pipelines.

Software Developer | InterSwitch Tech | Jun 2019 - Dec 2021
- Developed REST APIs with Node.js and Express for merchant onboarding and fraud verification pipelines.
- Built customer-facing web portals with React, HTML5, Tailwind CSS, and WebSockets for real-time payment updates.
- Automated Docker container deployments using AWS ECS and GitHub Actions CI/CD workflows.

EDUCATION & CREDENTIALS:
- B.Sc. Computer Science - University of Lagos (2019)
- WES Educational Credential Assessment (ECA): Verified Canadian Equivalency (Four-year Bachelor's Degree)
- AWS Certified Developer Associate (2023)`,

    jobDescriptionText: `Senior Full-Stack Developer - Interac FinTech Solutions
Location: Toronto, ON (Hybrid / Open to Visa Sponsorship)
Application Deadline: September 4, 2026 (5 Days)

ABOUT THE ROLE:
We are seeking an experienced Senior Full-Stack Developer to design and scale our next-generation digital payments platform in Toronto. You will collaborate with cross-functional teams to build resilient microservices and high-performance web applications.

CORE REQUIREMENTS:
- 5+ years of professional full-stack software development experience.
- Deep expertise in React, TypeScript, Node.js, and Express.
- Solid database experience with PostgreSQL or MySQL, including complex query tuning and ORM design.
- Hands-on experience with Event-Driven Architecture (RabbitMQ, Apache Kafka, or AWS SQS/SNS).
- Strong track record of building RESTful and GraphQL APIs for financial or high-concurrency systems.
- Demonstrated experience in AWS cloud infrastructure (ECS, Lambda, S3, RDS).

NICE-TO-HAVE SKILLS:
- Experience with Kubernetes container orchestration.
- Knowledge of Canadian financial regulations or PCI-DSS compliance frameworks.
- Familiarity with Next.js or server-side rendering.

DUTIES & RESPONSIBILITIES:
- Architect and develop secure full-stack software components.
- Collaborate with product managers and UX designers on technical feasibility and agile delivery.
- Conduct code reviews, establish testing standards (Jest, Cypress), and maintain high code quality.`,

    experiences: [
      {
        id: "exp-1",
        company: "PayTech Global",
        role: "Senior Software Engineer",
        startDate: "2022-01-01",
        endDate: "Present",
        bullets: [
          "Led development of core payment routing microservices serving over 2M monthly transactions across West Africa.",
          "Engineered responsive React dashboard with Redux Toolkit and TypeScript, reducing client bundle size by 35%.",
          "Implemented PostgreSQL database indexing and query optimizations that improved transaction throughput by 40%."
        ],
        hasReferenceLetter: true,
        hasPayslips: true,
        isVerified: true
      },
      {
        id: "exp-2",
        company: "InterSwitch Tech",
        role: "Software Developer",
        startDate: "2019-06-01",
        endDate: "2021-12-31",
        bullets: [
          "Developed REST APIs with Node.js and Express for merchant onboarding and fraud verification pipelines.",
          "Built customer-facing web portals with React, HTML5, Tailwind CSS, and WebSockets for real-time payment updates."
        ],
        hasReferenceLetter: false,
        hasPayslips: true,
        isVerified: false
      }
    ]
  },

  {
    id: "pivot-vancouver-noc",
    title: "🎯 NOC Strategic Pivot: Backend to Data Engineer (21-Day Deadline)",
    description: "Bangalore-based Software Engineer whose actual duties involve heavy ETL and pipeline work, evaluating a pivot from NOC 21232 to NOC 21223 for Vancouver tech role.",
    targetRole: "Senior Data & Systems Engineer",
    targetCity: "Vancouver, BC",
    deadlineDays: 21,
    deadlineDate: "2026-09-20",
    educationDegree: "B.Tech Information Technology (VTU Bangalore)",
    hasWesEca: false,
    resumeText: `Rahul Sharma
Backend & Data Systems Developer | Bangalore, India
Email: rahul.sharma@example.com | LinkedIn: linkedin.com/in/rsharma-tech

SUMMARY:
Backend Engineer with 6 years of experience building data processing systems, SQL/NoSQL databases, and API integrations using Python, PySpark, PostgreSQL, and AWS S3/Glue.

EXPERIENCE:
Lead Backend Engineer | DataCorp India | Mar 2021 - Present
- Built automated ETL data ingestion pipelines processing 500GB daily telemetry logs into AWS Redshift using PySpark and Airflow.
- Optimized relational database schemas and indexed 150M row tables in PostgreSQL, cutting query execution times by 60%.
- Designed REST APIs in Python (FastAPI) and connected them to analytical data warehouses for internal reporting dashboards.
- Maintained data security compliance, encryption at rest, and automated database failover protocols.

Software Developer | TechWave Solutions | Aug 2018 - Feb 2021
- Developed Java/Spring Boot microservices for web applications and user authentication.
- Wrote complex SQL stored procedures and database migration scripts for MySQL.

EDUCATION:
- B.Tech Information Technology - VTU (2018)`,

    jobDescriptionText: `Senior Data & Systems Engineer - CloudScale Vancouver
Location: Vancouver, BC (Relocation support available)
Application Deadline: September 20, 2026 (21 Days)

CORE REQUIREMENTS:
- 5+ years of software engineering or data engineering experience.
- Expert-level Python programming and SQL schema design.
- Hands-on experience with Apache Spark / PySpark, AWS Glue, or Databricks.
- Demonstrated experience building scalable data pipelines (Airflow, Dagster) and data warehouses (Snowflake, Redshift).
- Solid grasp of software development practices (CI/CD, Git, testing).

NICE-TO-HAVE SKILLS:
- dbt (data build tool) experience.
- Snowflake Snowpro Core certification.
- Experience with Kafka or streaming data processing.`,

    experiences: [
      {
        id: "exp-p1",
        company: "DataCorp India",
        role: "Lead Backend Engineer",
        startDate: "2021-03-01",
        endDate: "Present",
        bullets: [
          "Built automated ETL data ingestion pipelines processing 500GB daily telemetry logs into AWS Redshift using PySpark and Airflow.",
          "Optimized relational database schemas and indexed 150M row tables in PostgreSQL, cutting query execution times by 60%."
        ],
        hasReferenceLetter: false,
        hasPayslips: true,
        isVerified: false
      }
    ]
  },

  {
    id: "devops-calgary-moderate",
    title: "☁️ Cloud Engineer: DevOps to Cloud Architect in Calgary (10-Day Deadline)",
    description: "DevOps specialist in Sao Paulo applying to Cloud Infrastructure Lead in Calgary with 10 days remaining.",
    targetRole: "Cloud Infrastructure Specialist",
    targetCity: "Calgary, AB",
    deadlineDays: 10,
    deadlineDate: "2026-09-09",
    educationDegree: "B.Sc. Systems Analysis (University of São Paulo)",
    hasWesEca: true,
    resumeText: `Lucas Santos
Cloud & DevOps Engineer | São Paulo, Brazil | Open to Relocate
Email: lucas.santos@example.com

SUMMARY:
DevOps Specialist with 4+ years of cloud infrastructure administration using Terraform, Docker, Kubernetes, AWS, and GCP.

EXPERIENCE:
DevOps Engineer | CloudGrid South America | Jan 2021 - Present
- Provisioned infrastructure as code (IaC) using Terraform and Ansible across 50+ AWS EC2 and EKS clusters.
- Configured Prometheus and Grafana monitoring stacks, decreasing system outage mean-time-to-resolution (MTTR) by 45%.
- Maintained Docker container registries and created automated Helm charts for Kubernetes application deployments.

EDUCATION:
- B.Sc Systems Analysis - University of São Paulo (2020)
- WES ECA Completed`,

    jobDescriptionText: `Cloud Infrastructure Specialist - EnergyTech Alberta
Location: Calgary, AB
Application Deadline: September 9, 2026 (10 Days)

CORE REQUIREMENTS:
- 4+ years managing cloud environments (AWS / Azure).
- High proficiency in Terraform, Docker, and Kubernetes.
- Strong knowledge of CI/CD pipelines (GitHub Actions, GitLab CI).
- Experience with Linux system administration and bash/python scripting.

NICE-TO-HAVE:
- AWS Certified Solutions Architect Associate.
- HashiCorp Terraform Associate certification.`,

    experiences: [
      {
        id: "exp-c1",
        company: "CloudGrid South America",
        role: "DevOps Engineer",
        startDate: "2021-01-01",
        endDate: "Present",
        bullets: [
          "Provisioned infrastructure as code (IaC) using Terraform and Ansible across 50+ AWS EC2 and EKS clusters."
        ],
        hasReferenceLetter: true,
        hasPayslips: true,
        isVerified: true
      }
    ]
  }
];
