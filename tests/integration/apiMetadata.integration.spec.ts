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
 * Created on 12/12/24 :: 7:35PM BY joyider <andre(-at-)sess.se>
 *
 * This file :: apiMetadata.integration.spec.ts is part of the pdns-nodesdk project.
 */

import dotenv from "dotenv";
import { PdnsNodeSDK } from "../../src";

dotenv.config();

describe("Metadata Integration Test", () => {
    let pdns: PdnsNodeSDK;

    const serverId = "localhost";
    const testZoneId = "test.org.";
    const testMetadata = [
        { kind: "ALLOW-AXFR-FROM", metadata: ["192.0.2.1"] },
        { kind: "NOTIFY-DNSUPDATE", metadata: ["ns1.example.com", "ns2.example.com"] },
    ];

    beforeAll(async () => {
        pdns = new PdnsNodeSDK(
            process.env.PDNS_API_KEY || "secret",
            process.env.PDNS_API_URL || "http://localhost:8081/api/v1/"
        );

        // Create zone for testing
        try {
            await pdns.zones.createZone(serverId, {
                name: testZoneId,
                kind: "MASTER",
                nameservers: ["ns1.test.org.", "ns2.test.org."],
            });
        } catch (error) {
            // @ts-ignore
            console.warn(`Zone ${testZoneId} already exists or couldn't be created:`, error.message);
        }

        try {
            await pdns.metadata.createMetadata(serverId, testZoneId, testMetadata);
        } catch (error) {
            // @ts-ignore
            console.warn(`Metadata for ${testZoneId} could not be added:`, error.message);
        }
    });

    afterAll(async () => {
        try {
            await pdns.zones.deleteZone(serverId, testZoneId);
        } catch (error) {
            // @ts-ignore
            console.warn(`Zone ${testZoneId} could not be deleted:`, error.message);
        }
    });

    test("List all metadata for a zone", async () => {
        const response = await pdns.metadata.listMetadata(serverId, testZoneId);

        expect(Array.isArray(response)).toBe(true);
        expect(response.length).toBeGreaterThan(0);
        expect(response[0]).toHaveProperty("kind");
        expect(response[0]).toHaveProperty("metadata");
    });

    test("Get specific metadata for a zone", async () => {
        const metadataKind = testMetadata[0].kind;
        const response = await pdns.metadata.getMetadata(serverId, testZoneId, metadataKind);

        expect(response).toHaveProperty("kind", metadataKind);
        expect(response).toHaveProperty("metadata");
        expect(Array.isArray(response.metadata)).toBe(true);
    });

    test("Update specific metadata for a zone", async () => {
        const metadataKind = testMetadata[1].kind;
        const newMetadata = ["ns3.example.com"];
        console.log("metadataKind", metadataKind);
        console.log("metadataValues", newMetadata);

        const response = await pdns.metadata.updateMetadata(serverId, testZoneId, metadataKind, newMetadata);

        expect(response).toHaveProperty("kind", metadataKind);
        expect(response).toHaveProperty("metadata");
        expect(response.metadata).toEqual(newMetadata);
    });

    test("Delete specific metadata for a zone", async () => {
        const metadataKind = testMetadata[0].kind;

        await pdns.metadata.deleteMetadata(serverId, testZoneId, metadataKind);

        const response = await pdns.metadata.listMetadata(serverId, testZoneId);
        const kinds = response.map((meta) => meta.kind);

        expect(kinds).not.toContain(metadataKind);
    });
});
