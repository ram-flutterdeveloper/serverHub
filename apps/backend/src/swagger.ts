import swaggerAutogen from "swagger-autogen";

const doc = {
    info: {
        title: "ServiceHub API",
        description: "ServiceHub Backend APIs",
    },
    host: "localhost:5000",
    basePath: "/api/v1",
};

const outputFile = "./src/swagger-output.json";

const endpointsFiles = [
    "./src/app.ts",
];

swaggerAutogen()(outputFile, endpointsFiles, doc);