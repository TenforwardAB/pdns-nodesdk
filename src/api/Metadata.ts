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
 * Created on 12/12/24 :: 11:24AM BY joyider <andre(-at-)sess.se>
 *
 * This file :: Metadata.ts is part of the pdns-nodesdk project.
 */

import { ApiClient } from "../utils/ApiClient";

/**
 * A class for handling Metadata operations in the PowerDNS API.
 * This class provides methods for managing metadata associated with a DNS zone.
 *
 * @class Metadata
 */
export class Metadata {
    /**
     * @private
     * @property {ApiClient} client - The ApiClient instance used for making API requests.
     */
    private client: ApiClient;

    /**
     * Creates an instance of the Metadata class.
     *
     * @constructor
     * @param {ApiClient} client - An instance of the ApiClient used to communicate with the API.
     *
     * @example
     * const metadata = new Metadata(apiClient);
     */
    constructor(client: ApiClient) {
        this.client = client;
    }

    /**
     * Retrieves all metadata associated with a zone.
     *
     * @async
     * @function listMetadata
     * @param {string} serverId - The ID of the server managing the zone.
     * @param {string} zoneId - The ID of the zone to retrieve metadata for.
     * @returns {Promise<Array<{ kind: string; metadata: Array<string> }>>} A promise that resolves to an array of metadata objects.
     *
     * @throws {Error} If the API request fails or the response is not successful.
     *
     * @example
     * const metadata = await metadata.listMetadata("localhost", "example.org.");
     * console.log(metadata[0].kind); // "ALLOW-AXFR-FROM"
     */
    public async listMetadata(
        serverId: string,
        zoneId: string
    ): Promise<Array<{ kind: string; metadata: Array<string> }>> {
        return this.client.get(`/servers/${serverId}/zones/${zoneId}/metadata`);
    }

    /**
     * Creates a set of metadata entries for a zone.
     *
     * @async
     * @function createMetadata
     * @param {string} serverId - The ID of the server managing the zone.
     * @param {string} zoneId - The ID of the zone to add metadata to.
     * @param {Array<{ kind: string; metadata: Array<string> }>} metadataEntries - The metadata entries to create.
     * @returns {Promise<void>} A promise that resolves if the creation is successful.
     *
     * @throws {Error} If the API request fails or the response is not successful.
     *
     * @example
     * await metadata.createMetadata("localhost", "example.org.", [
     *   { kind: "ALLOW-AXFR-FROM", metadata: ["192.0.2.1"] }
     * ]);
     */
    public async createMetadata(
        serverId: string,
        zoneId: string,
        metadataEntries: Array<{ kind: string; metadata: Array<string> }>
    ): Promise<void> {
        return this.client.post(`/servers/${serverId}/zones/${zoneId}/metadata`, metadataEntries);
    }

    /**
     * Retrieves a specific kind of metadata for a zone.
     *
     * @async
     * @function getMetadata
     * @param {string} serverId - The ID of the server managing the zone.
     * @param {string} zoneId - The ID of the zone to retrieve metadata for.
     * @param {string} metadataKind - The kind of metadata to retrieve.
     * @returns {Promise<{ kind: string; metadata: Array<string> }>} A promise that resolves to a metadata object.
     *
     * @throws {Error} If the API request fails or the response is not successful.
     *
     * @example
     * const metadata = await metadata.getMetadata("localhost", "example.org.", "ALLOW-AXFR-FROM");
     * console.log(metadata.metadata); // ["192.0.2.1"]
     */
    public async getMetadata(
        serverId: string,
        zoneId: string,
        metadataKind: string
    ): Promise<{ kind: string; metadata: Array<string> }> {
        return this.client.get(`/servers/${serverId}/zones/${zoneId}/metadata/${metadataKind}`);
    }

    /**
     * Updates or replaces metadata for a specific kind in a zone.
     *
     * @async
     * @function updateMetadata
     * @param {string} serverId - The ID of the server managing the zone.
     * @param {string} zoneId - The ID of the zone to update metadata for.
     * @param {string} metadataKind - The kind of metadata to update.
     * @param {Array<string>} metadataValues - The metadata values to set.
     * @returns {Promise<{ kind: string; metadata: Array<string> }>} A promise that resolves to the updated metadata object.
     *
     * @throws {Error} If the API request fails or the response is not successful.
     *
     * @example
     * const updatedMetadata = await metadata.updateMetadata("localhost", "example.org.", "ALLOW-AXFR-FROM", ["192.0.2.2"]);
     * console.log(updatedMetadata.metadata); // ["192.0.2.2"]
     */
    public async updateMetadata(
        serverId: string,
        zoneId: string,
        metadataKind: string,
        metadataValues: Array<string>
    ): Promise<{ kind: string; metadata: Array<string> }> {
        return this.client.put(`/servers/${serverId}/zones/${zoneId}/metadata/${metadataKind}`, metadataValues);
    }

    /**
     * Deletes a specific kind of metadata for a zone.
     *
     * @async
     * @function deleteMetadata
     * @param {string} serverId - The ID of the server managing the zone.
     * @param {string} zoneId - The ID of the zone to delete metadata for.
     * @param {string} metadataKind - The kind of metadata to delete.
     * @returns {Promise<void>} A promise that resolves if the deletion is successful.
     *
     * @throws {Error} If the API request fails or the response is not successful.
     *
     * @example
     * await metadata.deleteMetadata("localhost", "example.org.", "ALLOW-AXFR-FROM");
     */
    public async deleteMetadata(
        serverId: string,
        zoneId: string,
        metadataKind: string
    ): Promise<void> {
        return this.client.delete(`/servers/${serverId}/zones/${zoneId}/metadata/${metadataKind}`);
    }
}
