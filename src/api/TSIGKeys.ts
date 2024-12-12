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
 * Created on 12/12/24 :: 11:31AM BY joyider <andre(-at-)sess.se>
 *
 * This file :: TSIGKeys.ts is part of the pdns-nodesdk project.
 */

import { ApiClient } from "../utils/ApiClient";

/**
 * A class for handling TSIG key operations in the PowerDNS API.
 * This class provides methods for managing TSIG keys on a PowerDNS server.
 *
 * @class TSIGKeys
 */
export class TSIGKeys {
    private client: ApiClient;

    /**
     * Creates an instance of the TSIGKeys class.
     *
     * @constructor
     * @param {ApiClient} client - An instance of the ApiClient used to communicate with the API.
     *
     * @example
     * const tsigKeys = new TSIGKeys(apiClient);
     */
    constructor(client: ApiClient) {
        this.client = client;
    }

    /**
     * Retrieves all TSIG keys on the server (except the actual key material).
     *
     * @async
     * @function listTSIGKeys
     * @param {string} serverId - The ID of the server to retrieve TSIG keys from.
     * @returns {Promise<Array<{ name: string; id: string; algorithm: string; type: string }>>}
     * A promise that resolves to an array of TSIG key objects.
     *
     * @throws {Error} If the API request fails or the response is not successful.
     *
     * @example
     * const keys = await tsigKeys.listTSIGKeys("localhost");
     * console.log(keys[0].name); // "mytsigkey"
     */
    public async listTSIGKeys(
        serverId: string
    ): Promise<Array<{ name: string; id: string; algorithm: string; type: string }>> {
        return this.client.get(`/servers/${serverId}/tsigkeys`);
    }

    /**
     * Creates a new TSIG key.
     *
     * @async
     * @function createTSIGKey
     * @param {string} serverId - The ID of the server where the key will be created.
     * @param {object} keyData - The TSIG key details to create.
     * @param {string} keyData.name - The name of the key.
     * @param {string} keyData.algorithm - The algorithm of the key (e.g., "hmac-sha256").
     * @param {string} [keyData.key] - Optional Base64 encoded key. If omitted, the server generates one.
     * @returns {Promise<{ name: string; id: string; algorithm: string; key: string; type: string }>}
     * A promise that resolves to the created TSIG key object.
     *
     * @throws {Error} If the API request fails or the response is not successful.
     *
     * @example
     * const key = await tsigKeys.createTSIGKey("localhost", {
     *   name: "mytsigkey",
     *   algorithm: "hmac-sha256"
     * });
     * console.log(key.key); // Base64 encoded key
     */
    public async createTSIGKey(
        serverId: string,
        keyData: { name: string; algorithm: string; key?: string }
    ): Promise<{ name: string; id: string; algorithm: string; key: string; type: string }> {
        return this.client.post(`/servers/${serverId}/tsigkeys`, keyData);
    }

    /**
     * Retrieves a specific TSIG key, including the actual key material.
     *
     * @async
     * @function getTSIGKey
     * @param {string} serverId - The ID of the server to retrieve the key from.
     * @param {string} tsigKeyId - The ID of the TSIG key to retrieve.
     * @returns {Promise<{ name: string; id: string; algorithm: string; key: string; type: string }>}
     * A promise that resolves to the TSIG key object.
     *
     * @throws {Error} If the API request fails or the response is not successful.
     *
     * @example
     * const key = await tsigKeys.getTSIGKey("localhost", "mytsigkey.");
     * console.log(key.algorithm); // "hmac-sha256"
     */
    public async getTSIGKey(
        serverId: string,
        tsigKeyId: string
    ): Promise<{ name: string; id: string; algorithm: string; key: string; type: string }> {
        return this.client.get(`/servers/${serverId}/tsigkeys/${tsigKeyId}`);
    }

    /**
     * Updates a TSIG key.
     *
     * @async
     * @function updateTSIGKey
     * @param {string} serverId - The ID of the server where the key exists.
     * @param {string} tsigKeyId - The ID of the TSIG key to update.
     * @param {object} keyData - The new data for the key.
     * @param {string} [keyData.name] - The new name for the key.
     * @param {string} [keyData.algorithm] - The new algorithm for the key.
     * @param {string} [keyData.key] - The new Base64 encoded key.
     * @returns {Promise<{ name: string; id: string; algorithm: string; key: string; type: string }>}
     * A promise that resolves to the updated TSIG key object.
     *
     * @throws {Error} If the API request fails or the response is not successful.
     *
     * @example
     * const key = await tsigKeys.updateTSIGKey("localhost", "mytsigkey.", {
     *   key: "newBase64EncodedKey=="
     * });
     * console.log(key.key); // "newBase64EncodedKey=="
     */
    public async updateTSIGKey(
        serverId: string,
        tsigKeyId: string,
        keyData: { name?: string; algorithm?: string; key?: string }
    ): Promise<{ name: string; id: string; algorithm: string; key: string; type: string }> {
        return this.client.put(`/servers/${serverId}/tsigkeys/${tsigKeyId}`, keyData);
    }

    /**
     * Deletes a TSIG key.
     *
     * @async
     * @function deleteTSIGKey
     * @param {string} serverId - The ID of the server where the key exists.
     * @param {string} tsigKeyId - The ID of the TSIG key to delete.
     * @returns {Promise<void>} A promise that resolves if the key is successfully deleted.
     *
     * @throws {Error} If the API request fails or the response is not successful.
     *
     * @example
     * await tsigKeys.deleteTSIGKey("localhost", "mytsigkey.");
     */
    public async deleteTSIGKey(serverId: string, tsigKeyId: string): Promise<void> {
        return this.client.delete(`/servers/${serverId}/tsigkeys/${tsigKeyId}`);
    }
}
