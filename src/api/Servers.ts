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
 * Created on 12/12/24 :: 10:12AM BY joyider <andre(-at-)sess.se>
 *
 * This file :: Servers.ts is part of the pdns-nodesdk project.
 */

import { ApiClient } from "../utils/ApiClient";

/**
 * A class for handling server operations in the PowerDNS API.
 * This class provides methods for retrieving information about PowerDNS servers.
 *
 * @class Servers
 */
export class Servers {
    /**
     * @private
     * @property {ApiClient} client - The ApiClient instance used for making API requests.
     */
    private client: ApiClient;

    /**
     * Creates an instance of the PowerDNSServer class.
     *
     * @constructor
     * @param {ApiClient} client - An instance of the ApiClient used to communicate with the API.
     *
     * @example
     * // Example instantiation of the PowerDNSServer class
     * const powerDNSServer = new PowerDNSServer(apiClient);
     */
    constructor(client: ApiClient) {
        this.client = client;
    }

    /**
     * Retrieves a list of all servers.
     *
     * This method retrieves a list of all available servers from the PowerDNS API.
     *
     * @async
     * @function listServers
     * @returns {Promise<Array<{
     *   type: string;
     *   id: string;
     *   daemon_type: string;
     *   version: string;
     *   url: string;
     *   config_url: string;
     *   zones_url: string;
     * }>>} A promise that resolves to an array of server objects.
     *
     * @throws {Error} If the API request fails or the response is not successful.
     *
     * @example
     * const servers = await powerDNSServer.listServers();
     * console.log(servers[0].id); // "localhost"
     */
    public async listServers(): Promise<
        Array<{
            type: string;
            id: string;
            daemon_type: string;
            version: string;
            url: string;
            config_url: string;
            zones_url: string;
        }>
    > {
        return this.client.get("/servers");
    }

    /**
     * Retrieves details for a specific server.
     *
     * This method retrieves detailed information about a specific server using its ID.
     *
     * @async
     * @function getServer
     * @param {string} serverId - The ID of the server to retrieve.
     * @returns {Promise<{
     *   type: string;
     *   id: string;
     *   daemon_type: string;
     *   version: string;
     *   url: string;
     *   config_url: string;
     *   zones_url: string;
     * }>} A promise that resolves to a server object.
     *
     * @throws {Error} If the API request fails or the response is not successful.
     *
     * @example
     * const server = await powerDNSServer.getServer("localhost");
     * console.log(server.version); // "4.6.1"
     */
    public async getServer(
        serverId: string
    ): Promise<{
        type: string;
        id: string;
        daemon_type: string;
        version: string;
        url: string;
        config_url: string;
        zones_url: string;
    }> {
        return this.client.get(`/servers/${serverId}`);
    }
}
