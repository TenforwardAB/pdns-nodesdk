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
 * Created on 12/12/24 :: 11:19AM BY joyider <andre(-at-)sess.se>
 *
 * This file :: Cryptokeys.ts is part of the pdns-nodesdk project.
 */

import {ApiClient} from "../utils/ApiClient";

/**
 * A class for managing cryptographic keys in DNSSEC-enabled zones using the PowerDNS API.
 * This class provides methods to retrieve, create, manipulate, and delete cryptographic keys.
 *
 * @class Cryptokeys
 */
export class Cryptokeys {
    private client: ApiClient;

    /**
     * Creates an instance of the Cryptokeys class.
     *
     * @constructor
     * @param {ApiClient} client - An instance of the ApiClient used to communicate with the API.
     */
    constructor(client: ApiClient) {
        this.client = client;
    }

    /**
     * Retrieves all cryptographic keys for a specific zone, excluding private keys.
     *
     * @async
     * @function listKeys
     * @param {string} serverId - The ID of the server managing the zone.
     * @param {string} zoneId - The ID of the zone to retrieve cryptographic keys for.
     * @returns {Promise<Array<{
     *   type: string;
     *   id: number;
     *   keytype: string;
     *   active: boolean;
     *   published: boolean;
     *   dnskey: string;
     *   ds: Array<string>;
     *   cds: Array<string>;
     *   algorithm: string;
     *   bits: number;
     * }>>} A promise that resolves to an array of cryptographic key objects.
     *
     * @example
     * const keys = await cryptokeys.listKeys("localhost", "example.org.");
     * console.log(keys[0].dnskey);
     */
    public async listKeys(
        serverId: string,
        zoneId: string
    ): Promise<
        Array<{
            type: string;
            id: number;
            keytype: string;
            active: boolean;
            published: boolean;
            dnskey: string;
            ds: Array<string>;
            cds: Array<string>;
            algorithm: string;
            bits: number;
        }>
    > {
        return this.client.get(`/servers/${serverId}/zones/${zoneId}/cryptokeys`);
    }

    /**
     * Creates a new cryptographic key for a zone.
     *
     * @async
     * @function createKey
     * @param {string} serverId - The ID of the server managing the zone.
     * @param {string} zoneId - The ID of the zone to create the key for.
     * @param {object} keyData - The data for the new cryptographic key.
     * @param {string} [keyData.content] - The private key in ISC format (optional, for importing keys).
     * @param {number} [keyData.bits] - The size of the key in bits (optional).
     * @param {string} [keyData.algo] - The algorithm mnemonic for the key (optional).
     * @returns {Promise<{
     *   type: string;
     *   id: number;
     *   keytype: string;
     *   active: boolean;
     *   published: boolean;
     *   dnskey: string;
     *   ds: Array<string>;
     *   cds: Array<string>;
     *   algorithm: string;
     *   bits: number;
     * }>} A promise that resolves to the created cryptographic key object.
     *
     * @example
     * const newKey = await cryptokeys.createKey("localhost", "example.org.", {
     *   bits: 256,
     *   algo: "ECDSAP256SHA256"
     * });
     * console.log(newKey.dnskey);
     */
    public async createKey(
        serverId: string,
        zoneId: string,
        keyData: { content?: string; bits?: number; algo?: string }
    ): Promise<{
        type: string;
        id: number;
        keytype: string;
        active: boolean;
        published: boolean;
        dnskey: string;
        ds: Array<string>;
        cds: Array<string>;
        algorithm: string;
        bits: number;
    }> {
        return this.client.post(`/servers/${serverId}/zones/${zoneId}/cryptokeys`, keyData);
    }

    /**
     * Retrieves details for a specific cryptographic key, including the private key.
     *
     * @async
     * @function getKey
     * @param {string} serverId - The ID of the server managing the zone.
     * @param {string} zoneId - The ID of the zone to retrieve the key from.
     * @param {number} keyId - The ID of the cryptographic key to retrieve.
     * @returns {Promise<{
     *   type: string;
     *   id: number;
     *   keytype: string;
     *   active: boolean;
     *   published: boolean;
     *   dnskey: string;
     *   ds: Array<string>;
     *   cds: Array<string>;
     *   privatekey: string;
     *   algorithm: string;
     *   bits: number;
     * }>} A promise that resolves to the cryptographic key object.
     *
     * @example
     * const key = await cryptokeys.getKey("localhost", "example.org.", 12345);
     * console.log(key.privatekey);
     */
    public async getKey(
        serverId: string,
        zoneId: string,
        keyId: number
    ): Promise<{
        type: string;
        id: number;
        keytype: string;
        active: boolean;
        published: boolean;
        dnskey: string;
        ds: Array<string>;
        cds: Array<string>;
        privatekey: string;
        algorithm: string;
        bits: number;
    }> {
        return this.client.get(`/servers/${serverId}/zones/${zoneId}/cryptokeys/${keyId}`);
    }

    /**
     * Activates or deactivates a cryptographic key.
     *
     * @async
     * @function updateKey
     * @param {string} serverId - The ID of the server managing the zone.
     * @param {string} zoneId - The ID of the zone containing the key.
     * @param {number} keyId - The ID of the cryptographic key to update.
     * @param {object} keyData - The data for updating the key (e.g., active state).
     * @returns {Promise<void>} A promise that resolves if the update is successful.
     *
     * @example
     * await cryptokeys.updateKey("localhost", "example.org.", 12345, { active: false });
     */
    public async updateKey(
        serverId: string,
        zoneId: string,
        keyId: number,
        keyData: { active?: boolean }
    ): Promise<void> {
        return this.client.put(`/servers/${serverId}/zones/${zoneId}/cryptokeys/${keyId}`, keyData);
    }

    /**
     * Deletes a cryptographic key.
     *
     * @async
     * @function deleteKey
     * @param {string} serverId - The ID of the server managing the zone.
     * @param {string} zoneId - The ID of the zone containing the key.
     * @param {number} keyId - The ID of the cryptographic key to delete.
     * @returns {Promise<void>} A promise that resolves if the deletion is successful.
     *
     * @example
     * await cryptokeys.deleteKey("localhost", "example.org.", 12345);
     */
    public async deleteKey(serverId: string, zoneId: string, keyId: number): Promise<void> {
        return this.client.delete(`/servers/${serverId}/zones/${zoneId}/cryptokeys/${keyId}`);
    }
}
