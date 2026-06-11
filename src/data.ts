export interface Project {
  id: string;
  title: string;
  category: "Backend" | "Full-Stack" | "Fintech";
  period: string;
  techStack: string[];
  metrics: { label: string; value: string; desc: string }[];
  highlights: string[];
  architecture: {
    nodes: { id: string; label: string; type: 'client' | 'gateway' | 'service' | 'db' | 'cache' }[];
    connections: { from: string; to: string; label: string }[];
  };
}

export interface OptimizationScenario {
  id: string;
  title: string;
  problem: string;
  solution: string;
  unoptimizedMetric: string;
  unoptimizedValue: number;
  optimizedMetric: string;
  optimizedValue: number;
  codeSnippetBefore: string;
  codeSnippetAfter: string;
  benefit: string;
}

export const ACADEMIC_INFO = {
  college: "IMS Engineering College",
  degree: "B.Tech: Computer Science and Engineering (CSE)",
  period: "Aug 2018 – June 2022",
  location: "Ghaziabad, India"
};

export const CONTACT_INFO = {
  name: "Mukul Aggarwal",
  title: "Java Backend Developer / Systems Engineer",
  email: "mukul.agarwal2709@gmail.com",
  phone: "+91 9756589954",
  location: "Ghaziabad, India",
  linkedin: "https://linkedin.com/in/iam-mukul",
  github: "https://github.com"
};

export const TECH_CATEGORIES = [
  {
    name: "Backend Core",
    icon: "Cpu",
    skills: [
      { name: "Java 11 / 21", proficiency: 98, level: "Expert" },
      { name: "Spring Boot", proficiency: 96, level: "Expert" },
      { name: "Microservices", proficiency: 92, level: "Advanced" },
      { name: "RESTful APIs", proficiency: 98, level: "Expert" },
      { name: "Spring Security", proficiency: 90, level: "Expert" },
      { name: "JWT Authentication", proficiency: 95, level: "Expert" }
    ]
  },
  {
    name: "Databases & Cache",
    icon: "Database",
    skills: [
      { name: "PostgreSQL", proficiency: 94, level: "Expert" },
      { name: "Hibernate / JPA", proficiency: 95, level: "Expert" },
      { name: "Redis Cache", proficiency: 88, level: "Advanced" },
      { name: "Oracle SQL / SQL Server", proficiency: 90, level: "Advanced" },
      { name: "MongoDB", proficiency: 85, level: "Advanced" },
      { name: "MinIO S3", proficiency: 87, level: "Advanced" }
    ]
  },
  {
    name: "AI & Integrations",
    icon: "Sparkles",
    skills: [
      { name: "OpenAI API Integration", proficiency: 92, level: "Advanced" },
      { name: "Prompt Engineering", proficiency: 94, level: "Advanced" },
      { name: "WebSocket Streaming", proficiency: 89, level: "Advanced" },
      { name: "Stripe Payment Gateway", proficiency: 91, level: "Expert" },
      { name: "Apache Kafka", proficiency: 84, level: "Intermediate" }
    ]
  },
  {
    name: "DevOps & Quality",
    icon: "Terminal",
    skills: [
      { name: "Docker Containers", proficiency: 90, level: "Advanced" },
      { name: "Kubernetes Orchestration", proficiency: 82, level: "Intermediate" },
      { name: "JUnit / Mockito", proficiency: 95, level: "Expert" },
      { name: "CI/CD & Jenkins", proficiency: 88, level: "Advanced" },
      { name: "Git Version Control", proficiency: 94, level: "Expert" },
      { name: "System Design (OOP/LLD)", proficiency: 92, level: "Advanced" }
    ]
  }
];

export const WORK_EXPERIENCE = [
  {
    company: "Tata Consultancy Services (TCS)",
    role: "Software Engineer",
    period: "July 2022 - Present",
    techStack: ["Java 11", "Spring Boot", "JPA", "Hibernate", "SQL", "JUnit", "Mockito", "Sybase"],
    metrics: [
      { value: "15%", label: "Throughput", desc: "Corporate actions processing efficiency improved" },
      { value: "20%", label: "Resolution Speed", desc: "Bug-fixing cycle time reduced" },
      { value: "12%", label: "DB Latency", desc: "Response times optimized via tuning" },
      { value: "95%", label: "SLA Adherence", desc: "On-time features delivered with clean reviews" }
    ],
    highlights: [
      "Designed and developed highly complex corporate actions and securities processing transactional engines, enhancing efficiency by 15% using optimized multi-threading.",
      "Delivered major core features and rapid hotfixes for critical fintech subsystems, successfully compressing resolution turnaround cycles by 20%.",
      "Conducted extensive code refactoring, structural query reviews, and DB tuning to accelerate legacy API endpoints (12% latency reduction).",
      "Engineered comprehensive mock/unit testing architectures with JUnit and Mockito to enforce functional correctness across enterprise modules prior to deployments."
    ]
  }
];

export const PROJECTS: Project[] = [
  {
    id: "airbnb-backend",
    title: "AirBnb Scalable Backend Engine",
    category: "Backend",
    period: "Independent System Design",
    techStack: ["Java 21", "Spring Boot", "PostgreSQL", "Stripe API", "Spring Security", "JWT Authentication", "Docker", "Kubernetes", "JPA Write Locks"],
    metrics: [
      { label: "Concurrency Protections", value: "100%", desc: "Prevention of concurrent double-bookings" },
      { label: "Database Scaling", value: "30%", desc: "Lower SQL query response latencies via indexing" },
      { label: "User Handling Cap", value: "1000+", desc: "Concurrent listing and reservation sessions" }
    ],
    highlights: [
      "Engineered a highly scalable microservice layout in Spring Boot managing property nodes, bookings, availability, and user access levels.",
      "Prevented race conditions on booking collisions by incorporating JPA PESSIMISTIC_WRITE locks combined with isolated transaction isolation boundaries.",
      "Secured endpoint gateways via custom filter chain logic powered by Spring Security, decrypting stateless JSON Web Tokens.",
      "Streamlined deployment setups using multistage Docker builds, orchestrating replicas locally via Kubernetes namespaces."
    ],
    architecture: {
      nodes: [
        { id: "cli", label: "Web Client", type: "client" },
        { id: "gtw", label: "Spring Gateway (JWT Filter)", type: "gateway" },
        { id: "svc_prop", label: "Property Service", type: "service" },
        { id: "svc_book", label: "Booking Service", type: "service" },
        { id: "db_pg", label: "PostgreSQL DB", type: "db" },
        { id: "redis", label: "Redis Cache", type: "cache" }
      ],
      connections: [
        { from: "cli", to: "gtw", label: "REST + JWT" },
        { from: "gtw", to: "svc_prop", label: "gRPC Router" },
        { from: "gtw", to: "svc_book", label: "gRPC Router" },
        { from: "svc_prop", to: "redis", label: "Property Data L2" },
        { from: "svc_book", to: "db_pg", label: "Pessimistic write" },
        { from: "svc_prop", to: "db_pg", label: "Load Listings" }
      ]
    }
  },
  {
    id: "buildable-ai",
    title: "Buildable AI - Smart App Generator",
    category: "Full-Stack",
    period: "AI Automation Venture",
    techStack: ["Java 21", "Spring Boot", "OpenAI GPT-4", "MinIO Storage", "PostgreSQL", "Stripe API", "Spring Security", "SSE Stream"],
    metrics: [
      { label: "AI Response Stream", value: "1.2s", desc: "First-token server-sent event push" },
      { label: "Database Response", value: "30%", desc: "Optimised JPA Fetch Graph schema layers" },
      { label: "Payment Flows", value: "Strict", desc: "Dynamic Stripe plans with webhooks" }
    ],
    highlights: [
      "Designed a real-time reactive Spring Boot backend piping AI code outputs into Sever-Sent Events (SSE) stream endpoints.",
      "Constructed a clean local-cloud cloud storage abstraction leveraging MinIO S3 SDK APIs for multi-tenant code tree storage.",
      "Secured payments with a full Stripe API integration, validating asynchronous payment success using safe back-channel webhooks.",
      "Configured security profiles with Spring Security OAuth2/JWT bindings, enforcing custom user quota limitations per API level."
    ],
    architecture: {
      nodes: [
        { id: "react_cli", label: "Client Workspace", type: "client" },
        { id: "api_server", label: "Spring Boot Server", type: "service" },
        { id: "openai_api", label: "OpenAI GPT Server", type: "service" },
        { id: "minio_store", label: "MinIO CDN", type: "db" },
        { id: "stripe_ipn", label: "Stripe Webhooks", type: "gateway" },
        { id: "postgre", label: "PostgreSQL", type: "db" }
      ],
      connections: [
        { from: "react_cli", to: "api_server", label: "SSE / REST Gateway" },
        { from: "api_server", to: "openai_api", label: "Streaming Request" },
        { from: "api_server", to: "minio_store", label: "S3 Node Save" },
        { from: "api_server", to: "postgre", label: "Save Specs" },
        { from: "stripe_ipn", to: "api_server", label: "Async Inquire" }
      ]
    }
  }
];

export const OPTIMIZATION_SCENARIOS: OptimizationScenario[] = [
  {
    id: "n-plus-one",
    title: "SQL N+1 Query Fix (Airbnb listings lookup)",
    problem: "When querying 100 properties, Spring Data JPA executed 1 initial query followed by 100 separate sub-queries to fetch owner profiles, triggering a cascade of 101 database trips and a 450ms lag.",
    solution: "Transitioned to optimized SQL joining using entity graphs and JPA \"JOIN FETCH\" operators. Consolidated the 101 query queries into exactly 1 optimized joint dataset.",
    unoptimizedMetric: "DB Trips",
    unoptimizedValue: 101,
    optimizedMetric: "Optimized Trip",
    optimizedValue: 1,
    benefit: "Latency plummeted from 450ms to 28ms—a total 93.7% latency saving with peak database relief.",
    codeSnippetBefore: `// ❌ Triggered N+1 database queries
@Query("SELECT p FROM Property p")
List<Property> findAllProperties();`,
    codeSnippetAfter: `// ✅ Single query fetch joins database records in a single trip
@Query("SELECT p FROM Property p JOIN FETCH p.owner JOIN FETCH p.amenities")
List<Property> findAllPropertiesWithDetails();`
  },
  {
    id: "concurrency",
    title: "Pessimistic Locking (Double-Booking Elimination)",
    problem: "During peak seasons, microsecond-aligned parallel booking requests created race conditions where two threads read the property as 'Available' simultaneously, creating a double-booking.",
    solution: "Configured Spring JPA using PESSIMISTIC_WRITE locks which commands PostgreSQL to append a 'FOR UPDATE' block on the listing row, locking access until transaction commit.",
    unoptimizedMetric: "Double Bookings",
    unoptimizedValue: 14,
    optimizedMetric: "Safeguard",
    optimizedValue: 0,
    benefit: "Eliminated double bookings completely (100% security) while protecting server transaction pools.",
    codeSnippetBefore: `// ❌ Vulnerable to parallel race conditions
Optional<Property> findById(Long id);`,
    codeSnippetAfter: `// ✅ Tells PostgreSQL DB to lock specific row (FOR UPDATE)
@Lock(LockModeType.PESSIMISTIC_WRITE)
@Query("SELECT p FROM Property p WHERE p.id = :id")
Optional<Property> findAndLockById(@Param("id") Long id);`
  },
  {
    id: "batch-inserts",
    title: "JDBC Batch Writes (Ledger Insertion Speed)",
    problem: "To digest massive financial transaction data, the standard JPA entity saveAll loops completed records sequentially, blocking active execution threads. Saving 10,000 transaction events took 12.4 seconds.",
    solution: "Substituted Hibernate default sequence operations with customized Spring JDBC batch templates and calibrated rewrite queries, grouping inputs into compact batches of 500.",
    unoptimizedMetric: "Insertion Time",
    unoptimizedValue: 12.4,
    optimizedMetric: "Batched Speed",
    optimizedValue: 1.1,
    benefit: "Reduced backend blocking from 12.4s to 1.1s (91% speedup) allowing immediate asynchronous ledger balances update.",
    codeSnippetBefore: `// ❌ Slow individual INSERT commands sent to relational database one-by-one
for (CorporateAction action : actions) {
    repository.save(action); 
}`,
    codeSnippetAfter: `// ✅ Batch array updates executing 500 records at a single write
jdbcTemplate.batchUpdate(
    "INSERT INTO corp_action (id, code, resolved) VALUES (?, ?, ?)",
    actions,
    500,
    (ps, action) -> {
        ps.setLong(1, action.getId());
        ps.setString(2, action.getCode());
        ps.setBoolean(3, action.isResolved());
    }
);`
  }
];

export const RESUME_JD_CRITERIA = [
  { key: "java", label: "Java 11 / 21 Core", regex: /java/i, experience: "3+ Years (TCS Core Engines)" },
  { key: "spring-boot", label: "Spring Boot / MVC", regex: /spring( )?boot/i, experience: "Building high-performance APIs, JWT chains, filters" },
  { key: "postgres", label: "PostgreSQL / SQL Databases", regex: /(postgres|postgresql|sql|oracle|dbms|database)/i, experience: "Database indexing, optimized schemas, JOIN FETCH strategies" },
  { key: "security", label: "Spring Security / JWT / Auth", regex: /(security|auth|jwt|authentication|role|login)/i, experience: "Securing microservices with token decodes and CORS grids" },
  { key: "stripe", label: "Stripe API Payments", regex: /(stripe|payment|billing|checkout)/i, experience: "Subscription plans, multi-tenant webhooks verification" },
  { key: "docker", label: "Docker & Kubernetes", regex: /(docker|kubernetes|k8s|container|devops|aws|ci|cd)/i, experience: "Multi-stage artifact builds, container scaling profiles" },
  { key: "testing", label: "JUnit & Mockito", regex: /(junit|mockito|test|assertions|quality)/i, experience: "Robust test methodologies, regression safety" },
  { key: "system-design", label: "Microservices & Architecture", regex: /(microservice|system design|scalability|rest api|throughput)/i, experience: "Distributed setups, concurrency handling, messaging" }
];
