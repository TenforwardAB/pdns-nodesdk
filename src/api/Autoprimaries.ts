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
 * This file :: Autoprimaries.ts is part of the pdns-nodesdk project.
 */

import { ApiClient } from "../utils/ApiClient";

/**
 * A class for managing autoprimaries in the PowerDNS API.
 * This class provides methods for listing, adding, and deleting autoprimaries.
 *
 * @class Autoprimaries
 */
export class Autoprimaries {
    /**
     * @private
     * @property {ApiClient} client - The ApiClient instance used for making API requests.
     */
    private client: ApiClient;

    /**
     * Creates an instance of the Autoprimaries class.
     *
     * @constructor
     * @param {ApiClient} client - An instance of the ApiClient used to communicate with the API.
     *
     * @example
     * // Example instantiation of the Autoprimaries class
     * const autoprimaries = new Autoprimaries(apiClient);
     */
    constructor(client: ApiClient) {
        this.client = client;
    }

    /**
     * Retrieves a list of all autoprimaries.
     *
     * @async
     * @function listAutoprimaries
     * @param {string} serverId - The ID of the server to manage the list of autoprimaries on.
     * @returns {Promise<Array<{ ip: string; nameserver: string; account: string }>>}
     * A promise that resolves to an array of autoprimary objects.
     *
     * @throws {Error} If the API request fails or the response is not successful.
     *
     * @example
     * const autoprimaries = await autoprimaries.listAutoprimaries("localhost");
     * console.log(autoprimaries[0].ip); // "192.0.2.1"
     */
    public async listAutoprimaries(
        serverId: string
    ): Promise<Array<{ ip: string; nameserver: string; account: string }>> {
        return this.client.get(`/servers/${serverId}/autoprimaries`);
    }

    /**
     * Adds a new autoprimary entry.
     *
     * @async
     * @function addAutoprimary
     * @param {string} serverId - The ID of the server to manage the list of autoprimaries on.
     * @param {object} autoprimaryData - The details of the autoprimary to create.
     * @param {string} autoprimaryData.ip - The IP address of the autoprimary server.
     * @param {string} autoprimaryData.nameserver - The DNS name of the autoprimary server.
     * @param {string} [autoprimaryData.account] - Optional account name for the autoprimary server.
     * @returns {Promise<void>} A promise that resolves if the autoprimary is successfully created.
     *
     * @throws {Error} If the API request fails or the response is not successful.
     *
     * @example
     * await autoprimaries.addAutoprimary("localhost", {
     *   ip: "192.0.2.1",
     *   nameserver: "ns.example.com",
     *   account: "example"
     * });
     */
    public async addAutoprimary(
        serverId: string,
        autoprimaryData: { ip: string; nameserver: string; account?: string }
    ): Promise<void> {
        return this.client.post(`/servers/${serverId}/autoprimaries`, autoprimaryData);
    }

    /**
     * Deletes an autoprimary entry.
     *
     * @async
     * @function deleteAutoprimary
     * @param {string} serverId - The ID of the server to delete the autoprimary from.
     * @param {string} ip - The IP address of the autoprimary to delete.
     * @param {string} nameserver - The DNS name of the autoprimary to delete.
     * @returns {Promise<void>} A promise that resolves if the autoprimary is successfully deleted.
     *
     * @throws {Error} If the API request fails or the response is not successful.
     *
     * @example
     * await autoprimaries.deleteAutoprimary("localhost", "192.0.2.1", "ns.example.com");
     */
    public async deleteAutoprimary(
        serverId: string,
        ip: string,
        nameserver: string
    ): Promise<void> {
        return this.client.delete(`/servers/${serverId}/autoprimaries/${ip}/${nameserver}`);
    }
}
