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
 * Created on 12/12/24 :: 2:22PM BY joyider <andre(-at-)sess.se>
 *
 * This file :: apiZones.integration.spec.ts is part of the pdns-nodesdk project.
 */

import dotenv from "dotenv";
import {PdnsNodeSDK} from "../../src";
dotenv.config();

describe("Zones Integration Test", () => {
    let pdns: PdnsNodeSDK

    const serverId = "localhost";
    const testZoneId = "test.org.";
    const apiKey = process.env.PDNS_API_KEY || 'secret';
    const apiUrl = process.env.PDNS_API_URL || 'http://localhost:8081/api/v1/';

    beforeAll(() => {

        pdns = new PdnsNodeSDK(apiKey, apiUrl);
    });

    test("List all zones (initial)", async () => {
        const response = await pdns.zones.listZones(serverId);
        expect(Array.isArray(response)).toBe(true);
        if (response.length > 0) {
            expect(response[0]).toHaveProperty("id");
            expect(response[0]).toHaveProperty("name");
            expect(response[0]).toHaveProperty("kind");
            expect(response[0]).toHaveProperty("serial");
            expect(response[0]).toHaveProperty("notified_serial");
            expect(response[0]).toHaveProperty("url");
        }
    });

    test("Create a new zone (test.org.)", async () => {
        const zoneData = {
            name: testZoneId,
            kind: "Master",
            nameservers: ["ns1.test.org.", "ns2.test.org."]
        };

        const response = await pdns.zones.createZone(serverId, zoneData);

        expect(response).toHaveProperty("id", testZoneId);
        expect(response).toHaveProperty("kind", "Master");
        expect(response).toHaveProperty("rrsets");
        expect(Array.isArray(response.rrsets)).toBe(true);
    });

    test("Get newly created zone (test.org.)", async () => {
        const response = await pdns.zones.getZone(serverId, testZoneId);

        expect(response).toHaveProperty("id", testZoneId);
        expect(response).toHaveProperty("name", testZoneId);
        expect(response).toHaveProperty("kind", "Master");
        expect(response).toHaveProperty("serial");
        expect(response).toHaveProperty("rrsets");
        expect(Array.isArray(response.rrsets)).toBe(true);
    });

    test("Modify the zone (test.org.) kind to Native", async () => {
        const modifyData = { kind: "Native" };
        await pdns.zones.modifyZone(serverId, testZoneId, modifyData);

        const updatedZone = await pdns.zones.getZone(serverId, testZoneId);
        expect(updatedZone).toHaveProperty("kind", "Native");
    });

    test("Update zone RRsets for test.org.", async () => {
        const rrsetData = {
            rrsets: [
                {
                    name: "www.test.org.",
                    type: "A",
                    changetype: "REPLACE",
                    ttl: 3600,
                    records: [
                        { content: "192.0.2.123", disabled: false }
                    ]
                }
            ]
        };

        await pdns.zones.updateZoneRRsets(serverId, testZoneId, rrsetData);

        const updatedZone = await pdns.zones.getZone(serverId, testZoneId);
        const aRecord = updatedZone.rrsets.find((r: any) => r.name === "www.test.org." && r.type === "A");
        expect(aRecord).toBeDefined();
        expect(aRecord.records[0].content).toBe("192.0.2.123");
    });

    test("Delete the zone (test.org.)", async () => {
        await pdns.zones.deleteZone(serverId, testZoneId);

        await expect(pdns.zones.getZone(serverId, testZoneId)).rejects.toThrow();
    });

    test("List all zones (after deletion)", async () => {
        const response = await pdns.zones.listZones(serverId);
        const found = response.some((zone: any) => zone.id === testZoneId);
        expect(found).toBe(false);
    });
});
