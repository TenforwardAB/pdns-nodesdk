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
 * Created on 12/12/24 :: 12:24PM BY joyider <andre(-at-)sess.se>
 *
 * This file :: apiServers.integration.spec.ts is part of the pdns-nodesdk project.
 */

import dotenv from "dotenv";
import { ApiClient } from "../../src/utils/ApiClient";
import { Servers } from "../../src/api/Servers";

dotenv.config();

describe("Servers Integration Test", () => {
    let client: ApiClient;
    let servers: Servers;

    const serverId = "localhost";

    beforeAll(() => {
        client = new ApiClient(process.env.PDNS_API_KEY as string|| 'secret', process.env.PDNS_API_URL as string||'http://localhost:8081/api/v1/');
        servers = new Servers(client);
    });

    test("List all servers", async () => {
        const response = await servers.listServers();

        // Verify the structure of the response
        expect(Array.isArray(response)).toBe(true);
        expect(response[0]).toHaveProperty("id", serverId);
        expect(response[0]).toHaveProperty("type", "Server");
        expect(response[0]).toHaveProperty("daemon_type");
        expect(response[0]).toHaveProperty("version");
        expect(response[0]).toHaveProperty("url");
    });

    test("Get server information", async () => {
        const response = await servers.getServer(serverId);

        // Verify the structure of the response
        expect(response).toHaveProperty("id", serverId);
        expect(response).toHaveProperty("type", "Server");
        expect(response).toHaveProperty("daemon_type");
        expect(response).toHaveProperty("version");
        expect(response).toHaveProperty("config_url");
        expect(response).toHaveProperty("zones_url");
    });
});
