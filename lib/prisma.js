"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var prisma;
if (process.env.NODE_ENV === "production") {
    prisma = new client_1.PrismaClient();
}
else {
    var globalWithPrisma = global;
    if (!globalWithPrisma.prisma) {
        globalWithPrisma.prisma = new client_1.PrismaClient();
    }
    prisma = globalWithPrisma.prisma;
}
exports.default = prisma;
