# 🚀 Modular Node.js API with Real MongoDB, Dependency Injection & CI/CD

A production-ready, modular Node.js REST API built with TypeScript, featuring dependency injection, automated testing, and a real MongoDB setup powered by Docker Compose.  
Includes a lightweight CI pipeline using GitHub Actions for continuous integration and quality assurance.

## 🌟 Overview

This project demonstrates a clean, scalable backend architecture using **Node.js**, **TypeScript**, and **MongoDB** with production-quality design principles.  
It’s fully containerized with **Docker Compose** and features an automated **CI/CD pipeline** for continuous testing and integration.

> 🧱 The structure encourages modular code organization, making it easy to extend services (Auth, Users, etc.) and integrate new modules while maintaining testability and separation of concerns.

---

## ✨ Features

✅ Modular folder structure for scalable development  
✅ Dependency Injection for decoupled, testable services  
✅ Real MongoDB instance through Docker Compose  
✅ Unit & integration testing with Jest  
✅ Automated CI pipeline via GitHub Actions  
✅ Strong typing with TypeScript  
✅ Reusable repository and service pattern  
✅ Configurable via environment variables  

---

## 📂 Project Structure

```bash
.
├── docker-compose.yml
├── Dockerfile
├── package.json
├── src
│   ├── api
│   │   ├── auth
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.message.ts
│   │   │   ├── auth.route.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.types.ts
│   │   │   ├── session.entity.ts
│   │   │   ├── session.repository.ts
│   │   │   └── session.service.ts
│   │   ├── users
│   │   │   ├── user.controller.ts
│   │   │   ├── user.entity.ts
│   │   │   ├── user.message.ts
│   │   │   ├── user.repository.ts
│   │   │   ├── user.route.ts
│   │   │   ├── user.service.ts
│   │   │   └── user.type.ts
│   │   └── index.ts
│   ├── config
│   │   ├── dependency.ts
│   │   ├── env.ts
│   │   └── plugins.ts
│   ├── core
│   │   ├── db
│   │   │   ├── connection.ts
│   │   │   └── delete.ts
│   │   ├── middlewares
│   │   │   └── auth.ts
│   │   └── utils
│   │       ├── errors.ts
│   │       └── objectid.ts
│   └── index.ts
├── test
│   ├── mock
│   │   ├── childcontainer.ts
│   │   └── user.mock.ts
│   └── unit
│       ├── auth.service.test.ts
│       ├── session.service.test.ts
│       └── user.service.test.ts
└── tsconfig.json
```
---

