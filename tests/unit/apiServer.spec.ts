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
 * Created on 12/12/24 :: 10:18AM BY joyider <andre(-at-)sess.se>
 *
 * This file :: apiServer.spec.ts is part of the pdns-nodesdk project.
 */

import { Servers } from "../../src/api/Servers";
import { ApiClient } from "../../src/utils/ApiClient";

jest.mock("../../src/utils/ApiClient");

describe("PowerDNSServer Module", () => {
    let mockClient: jest.Mocked<ApiClient>;
    let powerDNSServer: Servers;

    beforeEach(() => {
        mockClient = new ApiClient("mock-api-key", "http://mock-api-url") as jest.Mocked<ApiClient>;
        powerDNSServer = new Servers(mockClient);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("listServers calls the correct API endpoint", async () => {
        const mockResponse = [
            {
                type: "Server",
                id: "localhost",
                daemon_type: "authoritative",
                version: "4.6.1",
                url: "/api/v1/servers/localhost",
                config_url: "/api/v1/servers/localhost/config{/config_setting}",
                zones_url: "/api/v1/servers/localhost/zones{/zone}"
            }
        ];

        mockClient.get.mockResolvedValueOnce(mockResponse);

        const servers = await powerDNSServer.listServers();

        expect(mockClient.get).toHaveBeenCalledWith("/servers");
        expect(servers).toEqual(mockResponse);
    });

    test("getServer calls the correct API endpoint and returns server details", async () => {
        const mockResponse = {
            type: "Server",
            id: "localhost",
            daemon_type: "authoritative",
            version: "4.6.1",
            url: "/api/v1/servers/localhost",
            config_url: "/api/v1/servers/localhost/config{/config_setting}",
            zones_url: "/api/v1/servers/localhost/zones{/zone}"
        };

        mockClient.get.mockResolvedValueOnce(mockResponse);

        const server = await powerDNSServer.getServer("localhost");

        expect(mockClient.get).toHaveBeenCalledWith("/servers/localhost");
        expect(server).toEqual(mockResponse);
    });

    test("getServer throws an error if the API request fails", async () => {
        mockClient.get.mockRejectedValueOnce(new Error("API error"));

        await expect(powerDNSServer.getServer("localhost")).rejects.toThrow("API error");

        expect(mockClient.get).toHaveBeenCalledWith("/servers/localhost");
    });
});
