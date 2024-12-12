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
 * Created on 12/12/24 :: 2:32PM BY joyider <andre(-at-)sess.se>
 *
 * This file :: apiCryptokeys.integration.spec.ts is part of the pdns-nodesdk project.
 */

import dotenv from "dotenv";
import {PdnsNodeSDK} from "../../src";


dotenv.config();

describe("Cryptokeys Integration Test", () => {
    let pdns: PdnsNodeSDK;

    const serverId = "localhost";
    const testZoneId = "test.org.";
    let cryptokeyId: number;

    beforeAll(async () => {

        pdns = new PdnsNodeSDK(
            process.env.PDNS_API_KEY as string || "secret",
            process.env.PDNS_API_URL as string || "http://localhost:8081/api/v1/"
        );


        // Create the test zone if it doesn't exist
        try {
            await pdns.zones.createZone(serverId, {
                name: testZoneId,
                kind: "MASTER",
                nameservers: ["ns1.test.org.", "ns2.test.org."],
            });
        } catch (error) {
            console.warn(`Zone ${testZoneId} already exists or couldn't be created:`);
        }
    });

    afterAll(async () => {
        // Clean up by deleting the test zone
        try {
            await pdns.zones.deleteZone(serverId, testZoneId);
        } catch (error) {
            console.warn(`Zone ${testZoneId} could not be deleted:`);
        }
    });

    test("Create a new cryptokey for the zone", async () => {
        const keyData = {
            keytype: "csk",
            flags: 257,
            active: true,
            algorithm: "ECDSAP256SHA256",
            bits: 256,
        };

        const response = await pdns.cryptokeys.createKey(serverId, testZoneId, keyData);


        expect(response).toHaveProperty("id");
        expect(response).toHaveProperty("keytype", "csk");
        expect(response).toHaveProperty("active", true);
        expect(response).toHaveProperty("published", true);
        expect(response).toHaveProperty("algorithm", "ECDSAP256SHA256");

        cryptokeyId = response.id;
    });


    test("List all cryptokeys for the zone", async () => {
        const response = await pdns.cryptokeys.listKeys(serverId, testZoneId);

        expect(Array.isArray(response)).toBe(true);
        if (response.length > 0) {
            expect(response[0]).toHaveProperty("id");
            expect(response[0]).toHaveProperty("keytype");
            expect(response[0]).toHaveProperty("active");
            expect(response[0]).toHaveProperty("published");
            expect(response[0]).toHaveProperty("algorithm");
        }
    });

    test("Retrieve a specific cryptokey", async () => {
        const response = await pdns.cryptokeys.getKey(serverId, testZoneId, cryptokeyId);

        expect(response).toHaveProperty("id", cryptokeyId);
        expect(response).toHaveProperty("keytype", "csk");
        expect(response).toHaveProperty("active", true);
        expect(response).toHaveProperty("published", true);
        expect(response).toHaveProperty("algorithm", "ECDSAP256SHA256");
        expect(response).toHaveProperty("privatekey"); // Ensure private key is included
    });

    test("Modify the cryptokey", async () => {
        const updateData = { active: false };

        await pdns.cryptokeys.updateKey(serverId, testZoneId, cryptokeyId, updateData);

        const updatedKey = await pdns.cryptokeys.getKey(serverId, testZoneId, cryptokeyId);

        expect(updatedKey).toHaveProperty("id", cryptokeyId);
        expect(updatedKey).toHaveProperty("active", false);
    });

    test("Delete the cryptokey", async () => {
        const response = await pdns.cryptokeys.deleteKey(serverId, testZoneId, cryptokeyId);

        expect(response).toBeNull();

        await expect(
            pdns.cryptokeys.getKey(serverId, testZoneId, cryptokeyId)
        ).rejects.toThrow();
    });
});
