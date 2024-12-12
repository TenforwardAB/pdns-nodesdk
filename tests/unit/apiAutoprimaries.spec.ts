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
 * Created on 12/12/24 :: 11:35AM BY joyider <andre(-at-)sess.se>
 *
 * This file :: apiAutoprimaries.spec.ts is part of the pdns-nodesdk project.
 */

import { Autoprimaries } from "../../src/api/Autoprimaries";
import { ApiClient } from "../../src/utils/ApiClient";

jest.mock("../../src/utils/ApiClient");

describe("Autoprimaries Module", () => {
    let mockClient: jest.Mocked<ApiClient>;
    let autoprimaries: Autoprimaries;

    beforeEach(() => {
        mockClient = new ApiClient("mock-api-key", "http://mock-api-url") as jest.Mocked<ApiClient>;
        autoprimaries = new Autoprimaries(mockClient);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("listAutoprimaries", () => {
        test("should fetch a list of autoprimaries", async () => {
            const serverId = "localhost";
            const mockResponse = [
                { ip: "192.0.2.1", nameserver: "ns.example.com", account: "" },
                { ip: "192.0.2.50", nameserver: "ns.example.org", account: "example" },
            ];

            mockClient.get.mockResolvedValueOnce(mockResponse);

            const result = await autoprimaries.listAutoprimaries(serverId);

            expect(mockClient.get).toHaveBeenCalledWith(`/servers/${serverId}/autoprimaries`);
            expect(result).toEqual(mockResponse);
        });
    });

    describe("addAutoprimary", () => {
        test("should add a new autoprimary", async () => {
            const serverId = "localhost";
            const autoprimaryData = {
                ip: "192.0.2.1",
                nameserver: "ns.example.com",
                account: "",
            };

            mockClient.post.mockResolvedValueOnce(undefined);

            await autoprimaries.addAutoprimary(serverId, autoprimaryData);

            expect(mockClient.post).toHaveBeenCalledWith(
                `/servers/${serverId}/autoprimaries`,
                autoprimaryData
            );
        });

        test("should throw an error if adding autoprimary fails", async () => {
            const serverId = "localhost";
            const autoprimaryData = {
                ip: "192.0.2.1",
                nameserver: "ns.example.com",
                account: "",
            };

            mockClient.post.mockRejectedValueOnce(new Error("Request failed"));

            await expect(
                autoprimaries.addAutoprimary(serverId, autoprimaryData)
            ).rejects.toThrow("Request failed");

            expect(mockClient.post).toHaveBeenCalledWith(
                `/servers/${serverId}/autoprimaries`,
                autoprimaryData
            );
        });
    });

    describe("deleteAutoprimary", () => {
        test("should delete an autoprimary", async () => {
            const serverId = "localhost";
            const ip = "192.0.2.1";
            const nameserver = "ns.example.com";

            mockClient.delete.mockResolvedValueOnce(undefined);

            await autoprimaries.deleteAutoprimary(serverId, ip, nameserver);

            expect(mockClient.delete).toHaveBeenCalledWith(
                `/servers/${serverId}/autoprimaries/${ip}/${nameserver}`
            );
        });

        test("should throw an error if deleting autoprimary fails", async () => {
            const serverId = "localhost";
            const ip = "192.0.2.1";
            const nameserver = "ns.example.com";

            mockClient.delete.mockRejectedValueOnce(new Error("Request failed"));

            await expect(
                autoprimaries.deleteAutoprimary(serverId, ip, nameserver)
            ).rejects.toThrow("Request failed");

            expect(mockClient.delete).toHaveBeenCalledWith(
                `/servers/${serverId}/autoprimaries/${ip}/${nameserver}`
            );
        });
    });
});
