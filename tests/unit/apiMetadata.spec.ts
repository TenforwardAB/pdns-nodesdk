/**
 * This file is licensed under the European Union Public License (EUPL) v1.2.
 * You may only use this work in compliance with the License.
 * You may obtain a copy of the License at:
 *
 * https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed "as is",
 * without any warranty or conditions of any kind.
 *
 * Copyright (c) 2024- Tenforward AB. All rights reserved.
 *
 * Created on 12/12/24 :: 11:24AM BY joyider <andre(-at-)sess.se>
 *
 * This file :: apiMetadata.spec.ts is part of the pdns-nodesdk project.
 */

import { Metadata } from "../../src/api/Metadata";
import { ApiClient } from "../../src/utils/ApiClient";

jest.mock("../../src/utils/ApiClient");

describe("Metadata Module", () => {
    let mockClient: jest.Mocked<ApiClient>;
    let metadata: Metadata;

    beforeEach(() => {
        mockClient = new ApiClient("mock-api-key", "http://mock-api-url") as jest.Mocked<ApiClient>;
        metadata = new Metadata(mockClient);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("listMetadata calls the correct API endpoint", async () => {
        const mockResponse = [
            { kind: "ALLOW-AXFR-FROM", metadata: ["192.0.2.1"] },
            { kind: "NOTIFY-TO", metadata: ["192.0.2.2"] },
        ];
        mockClient.get.mockResolvedValueOnce(mockResponse);

        const result = await metadata.listMetadata("localhost", "example.org.");

        expect(mockClient.get).toHaveBeenCalledWith("/servers/localhost/zones/example.org./metadata");
        expect(result).toEqual(mockResponse);
    });

    test("createMetadata sends the correct payload", async () => {
        const metadataEntries = [
            { kind: "ALLOW-AXFR-FROM", metadata: ["192.0.2.1"] },
            { kind: "NOTIFY-TO", metadata: ["192.0.2.2"] },
        ];
        mockClient.post.mockResolvedValueOnce(undefined);

        await metadata.createMetadata("localhost", "example.org.", metadataEntries);

        expect(mockClient.post).toHaveBeenCalledWith(
            "/servers/localhost/zones/example.org./metadata",
            metadataEntries
        );
    });

    test("getMetadata calls the correct API endpoint", async () => {
        const mockResponse = { kind: "ALLOW-AXFR-FROM", metadata: ["192.0.2.1"] };
        mockClient.get.mockResolvedValueOnce(mockResponse);

        const result = await metadata.getMetadata("localhost", "example.org.", "ALLOW-AXFR-FROM");

        expect(mockClient.get).toHaveBeenCalledWith(
            "/servers/localhost/zones/example.org./metadata/ALLOW-AXFR-FROM"
        );
        expect(result).toEqual(mockResponse);
    });

    test("updateMetadata sends the correct payload", async () => {
        const mockResponse = { kind: "ALLOW-AXFR-FROM", metadata: ["192.0.2.3"] };
        const metadataValues = ["192.0.2.3"];
        mockClient.put.mockResolvedValueOnce(mockResponse);

        const result = await metadata.updateMetadata(
            "localhost",
            "example.org.",
            "ALLOW-AXFR-FROM",
            metadataValues
        );

        expect(mockClient.put).toHaveBeenCalledWith(
            "/servers/localhost/zones/example.org./metadata/ALLOW-AXFR-FROM",
            { metadata: metadataValues }
        );
        expect(result).toEqual(mockResponse);
    });

    test("deleteMetadata calls the correct API endpoint", async () => {
        mockClient.delete.mockResolvedValueOnce(undefined);

        await metadata.deleteMetadata("localhost", "example.org.", "ALLOW-AXFR-FROM");

        expect(mockClient.delete).toHaveBeenCalledWith(
            "/servers/localhost/zones/example.org./metadata/ALLOW-AXFR-FROM"
        );
    });
});
