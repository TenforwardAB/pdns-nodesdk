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
 * Created on 12/12/24 :: 11:39AM BY joyider <andre(-at-)sess.se>
 *
 * This file :: apiSearching.spec.ts is part of the pdns-nodesdk project.
 */

import { Searching } from "../../src/api/Searching";
import { ApiClient } from "../../src/utils/ApiClient";

jest.mock("../../src/utils/ApiClient");

describe("Searching Module", () => {
    let mockClient: jest.Mocked<ApiClient>;
    let searching: Searching;

    beforeEach(() => {
        mockClient = new ApiClient("mock-api-key", "http://mock-api-url") as jest.Mocked<ApiClient>;
        searching = new Searching(mockClient);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("searchData", () => {
        test("should call the correct API endpoint with default parameters", async () => {
            const mockResponse = [
                {
                    content: "192.0.2.1",
                    disabled: false,
                    name: "example.com.",
                    object_type: "record",
                    zone_id: "example.com.",
                    zone: "example.com.",
                    type: "A",
                    ttl: 3600,
                },
            ];
            mockClient.get.mockResolvedValueOnce(mockResponse);

            const results = await searching.searchData("localhost", "example*");

            expect(mockClient.get).toHaveBeenCalledWith(
                "/servers/localhost/search-data?q=example*&max=100&object_type=all"
            );
            expect(results).toEqual(mockResponse);
        });

        test("should call the correct API endpoint with specified maxResults and objectType", async () => {
            const mockResponse = [
                {
                    content: "example.com.",
                    disabled: false,
                    name: "example.org.",
                    object_type: "zone",
                    zone_id: "example.org.",
                    zone: "example.org.",
                    type: "",
                    ttl: 0,
                },
            ];
            mockClient.get.mockResolvedValueOnce(mockResponse);

            const results = await searching.searchData("localhost", "*.org", 5, "zone");

            expect(mockClient.get).toHaveBeenCalledWith(
                "/servers/localhost/search-data?q=*.org&max=5&object_type=zone"
            );
            expect(results).toEqual(mockResponse);
        });

        test("should handle API errors gracefully", async () => {
            const errorMessage = "API error";
            mockClient.get.mockRejectedValueOnce(new Error(errorMessage));

            await expect(searching.searchData("localhost", "example*")).rejects.toThrow(errorMessage);

            expect(mockClient.get).toHaveBeenCalledWith(
                "/servers/localhost/search-data?q=example*&max=100&object_type=all"
            );
        });

        test("should handle empty results", async () => {
            mockClient.get.mockResolvedValueOnce([]);

            const results = await searching.searchData("localhost", "nonexistent*");

            expect(mockClient.get).toHaveBeenCalledWith(
                "/servers/localhost/search-data?q=nonexistent*&max=100&object_type=all"
            );
            expect(results).toEqual([]);
        });
    });
});
