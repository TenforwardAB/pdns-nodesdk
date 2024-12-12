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
 * Created on 12/12/24 :: 11:47AM BY joyider <andre(-at-)sess.se>
 *
 * This file :: apiCache.spec.ts is part of the pdns-nodesdk project.
 */

import { Cache } from "../../src/api/Cache";
import { ApiClient } from "../../src/utils/ApiClient";

jest.mock("../../src/utils/ApiClient");

describe("Cache Module", () => {
    let mockClient: jest.Mocked<ApiClient>;
    let cache: Cache;

    beforeEach(() => {
        mockClient = new ApiClient("mock-api-key", "http://mock-api-url") as jest.Mocked<ApiClient>;
        cache = new Cache(mockClient);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("flushCache", () => {
        test("flushCache sends the correct request and returns result", async () => {
            const serverId = "localhost";
            const domain = "example.com";
            const mockResponse = {
                count: 1,
                result: "Flushed cache",
            };

            mockClient.put.mockResolvedValueOnce(mockResponse);

            const result = await cache.flushCache(serverId, domain);

            expect(mockClient.put).toHaveBeenCalledWith(
                `/servers/${serverId}/cache/flush?domain=${encodeURIComponent(domain)}`,
                null
            );
            expect(result).toEqual(mockResponse);
        });

        test("flushCache handles API errors", async () => {
            const serverId = "localhost";
            const domain = "example.com";

            mockClient.put.mockRejectedValueOnce(new Error("API request failed"));

            await expect(cache.flushCache(serverId, domain)).rejects.toThrow("API request failed");
            expect(mockClient.put).toHaveBeenCalledWith(
                `/servers/${serverId}/cache/flush?domain=${encodeURIComponent(domain)}`,
                null
            );
        });
    });
});
