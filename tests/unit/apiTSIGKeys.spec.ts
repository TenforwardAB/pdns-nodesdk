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
 * Created on 12/12/24 :: 11:33AM BY joyider <andre(-at-)sess.se>
 *
 * This file :: apiTSIGKeys.spec.ts is part of the pdns-nodesdk project.
 */

import { TSIGKeys } from "../../src/api/TSIGKeys";
import { ApiClient } from "../../src/utils/ApiClient";

jest.mock("../../src/utils/ApiClient");

describe("TSIGKeys Module", () => {
    let mockClient: jest.Mocked<ApiClient>;
    let tsigKeys: TSIGKeys;

    beforeEach(() => {
        mockClient = new ApiClient("mock-api-key", "http://mock-api-url") as jest.Mocked<ApiClient>;
        tsigKeys = new TSIGKeys(mockClient);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("listTSIGKeys calls the correct API endpoint", async () => {
        const mockResponse = [
            { name: "key1", id: "key1.", algorithm: "hmac-sha256", type: "TSIGKey" },
        ];
        mockClient.get.mockResolvedValueOnce(mockResponse);

        const keys = await tsigKeys.listTSIGKeys("localhost");

        expect(mockClient.get).toHaveBeenCalledWith("/servers/localhost/tsigkeys");
        expect(keys).toEqual(mockResponse);
    });

    test("createTSIGKey sends correct data and returns the created key", async () => {
        const mockResponse = {
            name: "mytsigkey",
            id: "mytsigkey.",
            algorithm: "hmac-sha256",
            key: "generatedKey==",
            type: "TSIGKey",
        };
        mockClient.post.mockResolvedValueOnce(mockResponse);

        const keyData = { name: "mytsigkey", algorithm: "hmac-sha256" };
        const createdKey = await tsigKeys.createTSIGKey("localhost", keyData);

        expect(mockClient.post).toHaveBeenCalledWith("/servers/localhost/tsigkeys", keyData);
        expect(createdKey).toEqual(mockResponse);
    });

    test("getTSIGKey calls the correct API endpoint and returns the key", async () => {
        const mockResponse = {
            name: "mytsigkey",
            id: "mytsigkey.",
            algorithm: "hmac-sha256",
            key: "actualKey==",
            type: "TSIGKey",
        };
        mockClient.get.mockResolvedValueOnce(mockResponse);

        const key = await tsigKeys.getTSIGKey("localhost", "mytsigkey.");

        expect(mockClient.get).toHaveBeenCalledWith("/servers/localhost/tsigkeys/mytsigkey.");
        expect(key).toEqual(mockResponse);
    });

    test("updateTSIGKey sends correct data and returns the updated key", async () => {
        const mockResponse = {
            name: "mytsigkey",
            id: "mytsigkey.",
            algorithm: "hmac-sha256",
            key: "updatedKey==",
            type: "TSIGKey",
        };
        mockClient.put.mockResolvedValueOnce(mockResponse);

        const keyData = { key: "updatedKey==" };
        const updatedKey = await tsigKeys.updateTSIGKey("localhost", "mytsigkey.", keyData);

        expect(mockClient.put).toHaveBeenCalledWith("/servers/localhost/tsigkeys/mytsigkey.", keyData);
        expect(updatedKey).toEqual(mockResponse);
    });

    test("deleteTSIGKey calls the correct API endpoint", async () => {
        mockClient.delete.mockResolvedValueOnce();

        await tsigKeys.deleteTSIGKey("localhost", "mytsigkey.");

        expect(mockClient.delete).toHaveBeenCalledWith("/servers/localhost/tsigkeys/mytsigkey.");
    });
});
