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
 * Created on 12/12/24 :: 11:41AM BY joyider <andre(-at-)sess.se>
 *
 * This file :: apiStatistics.spec.ts is part of the pdns-nodesdk project.
 */

import {Statistics} from "../../src/api/Statistics";
import {ApiClient} from "../../src/utils/ApiClient";

jest.mock("../../src/utils/ApiClient");

describe("Statistics Module", () => {
    let mockClient: jest.Mocked<ApiClient>;
    let statistics: Statistics;

    beforeEach(() => {
        mockClient = new ApiClient("mock-api-key", "http://mock-api-url") as jest.Mocked<ApiClient>;
        statistics = new Statistics(mockClient);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("getStatistics retrieves all statistics", async () => {
        const mockResponse = [
            {name: "cache-hits", type: "StatisticItem", value: "12345"},
            {name: "cache-misses", type: "StatisticItem", value: "67890"}
        ];
        mockClient.get.mockResolvedValueOnce(mockResponse);

        const serverId = "localhost";
        const result = await statistics.getStatistics(serverId);

        expect(mockClient.get).toHaveBeenCalledWith(`/servers/${serverId}/statistics`);
        expect(result).toEqual(mockResponse);
    });

    test("getStatistics retrieves specific statistic", async () => {
        const mockResponse = [{name: "cache-hits", type: "StatisticItem", value: "12345"}];
        mockClient.get.mockResolvedValueOnce(mockResponse);

        const serverId = "localhost";
        const options = {statistic: "cache-hits"};
        const result = await statistics.getStatistics(serverId, options);

        expect(mockClient.get).toHaveBeenCalledWith(
            `/servers/${serverId}/statistics?statistic=cache-hits`
        );
        expect(result).toEqual(mockResponse);
    });

    test("getStatistics retrieves statistics without ring items", async () => {
        const mockResponse = [
            {name: "cache-hits", type: "StatisticItem", value: "12345"}
        ];
        mockClient.get.mockResolvedValueOnce(mockResponse);

        const serverId = "localhost";
        const options = {includerings: false};
        const result = await statistics.getStatistics(serverId, options);

        expect(mockClient.get).toHaveBeenCalledWith(
            `/servers/${serverId}/statistics?includerings=false`
        );
        expect(result).toEqual(mockResponse);
    });

    test("getStatistics retrieves specific statistic and excludes ring items", async () => {
        const mockResponse = [{name: "cache-hits", type: "StatisticItem", value: "12345"}];
        mockClient.get.mockResolvedValueOnce(mockResponse);

        const serverId = "localhost";
        const options = {statistic: "cache-hits", includerings: false};
        const result = await statistics.getStatistics(serverId, options);

        expect(mockClient.get).toHaveBeenCalledWith(
            `/servers/${serverId}/statistics?statistic=cache-hits&includerings=false`
        );
        expect(result).toEqual(mockResponse);
    });

    test("getStatistics handles API errors", async () => {
        const mockError = new Error("API request failed");
        mockClient.get.mockRejectedValueOnce(mockError);

        const serverId = "localhost";

        await expect(statistics.getStatistics(serverId)).rejects.toThrow("API request failed");
        expect(mockClient.get).toHaveBeenCalledWith(`/servers/${serverId}/statistics`);
    });
});
