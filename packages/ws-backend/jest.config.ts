import {createDefaultEsmPreset, type JestConfigWithTsJest} from "ts-jest";

const config: JestConfigWithTsJest = {
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageProvider: "v8",
    extensionsToTreatAsEsm: [".ts"],
    transform: {
        ...createDefaultEsmPreset().transform,
    },
};

export default config;
