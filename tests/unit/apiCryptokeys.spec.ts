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
 * Created on 12/12/24 :: 11:21 AM BY joyider <andre(-at-)sess.se>
 *
 * This file :: apiCryptokeys.spec.ts is part of the pdns-nodesdk project.
 */

import { Cryptokeys } from "../../src/api/Cryptokeys";
import { ApiClient } from "../../src/utils/ApiClient";

jest.mock("../../src/utils/ApiClient");

describe("Cryptokeys Module", () => {
    let mockClient: jest.Mocked<ApiClient>;
    let cryptokeys: Cryptokeys;

    beforeEach(() => {
        mockClient = new ApiClient("mock-api-key", "http://mock-api-url") as jest.Mocked<ApiClient>;
        cryptokeys = new Cryptokeys(mockClient);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("listKeys calls the correct API endpoint", async () => {
        const mockResponse = [
            {
                type: "Cryptokey",
                id: 123,
                keytype: "zsk",
                active: true,
                published: true,
                dnskey: "example-key",
                ds: ["example-ds"],
                cds: ["example-cds"],
                algorithm: "RSA",
                bits: 2048,
            },
        ];
        mockClient.get.mockResolvedValueOnce(mockResponse);

        const result = await cryptokeys.listKeys("localhost", "example.org.");

        expect(mockClient.get).toHaveBeenCalledWith("/servers/localhost/zones/example.org./cryptokeys");
        expect(result).toEqual(mockResponse);
    });

    test("createKey sends the correct payload", async () => {
        const mockResponse = {
            type: "Cryptokey",
            id: 456,
            keytype: "ksk",
            active: true,
            published: true,
            dnskey: "new-example-key",
            ds: ["new-example-ds"],
            cds: ["new-example-cds"],
            algorithm: "ECDSA",
            bits: 256,
        };
        const keyData = { bits: 256, algo: "ECDSA" };
        mockClient.post.mockResolvedValueOnce(mockResponse);

        const result = await cryptokeys.createKey("localhost", "example.org.", keyData);

        expect(mockClient.post).toHaveBeenCalledWith("/servers/localhost/zones/example.org./cryptokeys", keyData);
        expect(result).toEqual(mockResponse);
    });

    test("getKey calls the correct API endpoint", async () => {
        const mockResponse = {
            type: "Cryptokey",
            id: 123,
            keytype: "zsk",
            active: true,
            published: true,
            dnskey: "example-key",
            ds: ["example-ds"],
            cds: ["example-cds"],
            privatekey: "private-key-data",
            algorithm: "RSA",
            bits: 2048,
        };
        mockClient.get.mockResolvedValueOnce(mockResponse);

        const result = await cryptokeys.getKey("localhost", "example.org.", 123);

        expect(mockClient.get).toHaveBeenCalledWith("/servers/localhost/zones/example.org./cryptokeys/123");
        expect(result).toEqual(mockResponse);
    });

    test("updateKey sends the correct payload", async () => {
        const keyData = { active: false };
        mockClient.put.mockResolvedValueOnce(undefined);

        await cryptokeys.updateKey("localhost", "example.org.", 123, keyData);

        expect(mockClient.put).toHaveBeenCalledWith("/servers/localhost/zones/example.org./cryptokeys/123", keyData);
    });

    test("deleteKey calls the correct API endpoint", async () => {
        mockClient.delete.mockResolvedValueOnce(undefined);

        await cryptokeys.deleteKey("localhost", "example.org.", 123);

        expect(mockClient.delete).toHaveBeenCalledWith("/servers/localhost/zones/example.org./cryptokeys/123");
    });
});
