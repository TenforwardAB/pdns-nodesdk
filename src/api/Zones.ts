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
 * Created on 12/12/24 :: 10:41AM BY joyider <andre(-at-)sess.se>
 *
 * This file :: Zones.ts is part of the pdns-nodesdk project.
 */

import {ApiClient} from "../utils/ApiClient";

/**
 * A class for handling zone operations in the PowerDNS API.
 * This class provides methods for managing zones in a PowerDNS server.
 *
 * @class Zones
 */
export class Zones {
    /**
     * @private
     * @property {ApiClient} client - The ApiClient instance used for making API requests.
     */
    private client: ApiClient;

    /**
     * Creates an instance of the Zones class.
     *
     * @constructor
     * @param {ApiClient} client - An instance of the ApiClient used to communicate with the API.
     *
     * @example
     * // Example instantiation of the Zones class
     * const zones = new Zones(apiClient);
     */
    constructor(client: ApiClient) {
        this.client = client;
    }

    /**
     * Retrieves a list of all zones in a server.
     *
     * @async
     * @function listZones
     * @param {string} serverId - The ID of the server to retrieve zones from.
     * @returns {Promise<Array<{
     *   id: string;
     *   name: string;
     *   kind: string;
     *   serial: number;
     *   notified_serial: number;
     *   url: string;
     * }>>} A promise that resolves to an array of zone objects.
     *
     * @throws {Error} If the API request fails or the response is not successful.
     *
     * @example
     * const zones = await zones.listZones("localhost");
     * console.log(zones[0].name); // "example.org."
     */
    public async listZones(
        serverId: string
    ): Promise<
        Array<{
            id: string;
            name: string;
            kind: string;
            serial: number;
            notified_serial: number;
            url: string;
        }>
    > {
        return this.client.get(`/servers/${serverId}/zones`);
    }

    /**
     * Retrieves details for a specific zone.
     *
     * @async
     * @function getZone
     * @param {string} serverId - The ID of the server managing the zone.
     * @param {string} zoneId - The ID of the zone to retrieve.
     * @returns {Promise<{
     *   id: string;
     *   name: string;
     *   kind: string;
     *   serial: number;
     *   notified_serial: number;
     *   rrsets: Array<any>;
     * }>} A promise that resolves to a zone object.
     *
     * @throws {Error} If the API request fails or the response is not successful.
     *
     * @example
     * const zone = await zones.getZone("localhost", "example.org.");
     * console.log(zone.serial); // 2022040501
     */
    public async getZone(
        serverId: string,
        zoneId: string
    ): Promise<{
        id: string;
        name: string;
        kind: string;
        serial: number;
        notified_serial: number;
        rrsets: Array<any>;
    }> {
        return this.client.get(`/servers/${serverId}/zones/${zoneId}`);
    }

    /**
     * Creates a new zone.
     *
     * @async
     * @function createZone
     * @param {string} serverId - The ID of the server where the zone will be created.
     * @param {object} zoneData - The zone details to create.
     * @param {string} zoneData.name - The name of the zone (e.g., "example.org.").
     * @param {string} zoneData.kind - The kind of zone (e.g., "Native", "Master").
     * @param {Array<string>} [zoneData.masters] - List of master IP addresses (for slave zones).
     * @param {Array<string>} [zoneData.nameservers] - List of nameservers.
     * @returns {Promise<{
     *   account: string;
     *   api_rectify: boolean;
     *   dnssec: boolean;
     *   edited_serial: number;
     *   id: string;
     *   kind: string;
     *   last_check: number | null;
     *   master_tsig_key_ids: Array<string>;
     *   masters: Array<string>;
     *   name: string;
     *   notified_serial: number;
     *   nsec3narrow: boolean;
     *   nsec3param: string;
     *   rrsets: Array<{
     *     comments: Array<{ content: string; account: string; modified_at: number }>;
     *     name: string;
     *     records: Array<{ content: string; disabled: boolean }>;
     *     ttl: number;
     *     type: string;
     *   }>;
     *   serial: number;
     *   slave_tsig_key_ids: Array<string>;
     *   soa_edit: string;
     *   soa_edit_api: string;
     *   url: string;
     * }>} A promise that resolves to the created zone object.
     *
     * @throws {Error} If the API request fails or the response is not successful.
     *
     * @example
     * const zone = await zones.createZone("localhost", {
     *   name: "example.org.",
     *   kind: "Master",
     *   nameservers: ["ns1.example.org.", "ns2.example.org."]
     * });
     * console.log(zone.name); // "example.org."
     */
    public async createZone(
        serverId: string,
        zoneData: {
            name: string;
            kind: string;
            masters?: Array<string>;
            nameservers?: Array<string>;
        }
    ): Promise<{
        account: string;
        api_rectify: boolean;
        dnssec: boolean;
        edited_serial: number;
        id: string;
        kind: string;
        last_check: number | null;
        master_tsig_key_ids: Array<string>;
        masters: Array<string>;
        name: string;
        notified_serial: number;
        nsec3narrow: boolean;
        nsec3param: string;
        rrsets: Array<{
            comments: Array<{ content: string; account: string; modified_at: number }>;
            name: string;
            records: Array<{ content: string; disabled: boolean }>;
            ttl: number;
            type: string;
        }>;
        serial: number;
        slave_tsig_key_ids: Array<string>;
        soa_edit: string;
        soa_edit_api: string;
        url: string;
    }> {
        return this.client.post(`/servers/${serverId}/zones`, zoneData);
    }


    /**
     * Deletes a zone.
     *
     * @async
     * @function deleteZone
     * @param {string} serverId - The ID of the server managing the zone.
     * @param {string} zoneId - The ID of the zone to delete.
     * @returns {Promise<void>} A promise that resolves if the zone is successfully deleted.
     *
     * @throws {Error} If the API request fails or the response is not successful.
     *
     * @example
     * await zones.deleteZone("localhost", "example.org.");
     */
    public async deleteZone(serverId: string, zoneId: string): Promise<void> {
        return this.client.delete(`/servers/${serverId}/zones/${zoneId}`);
    }

    /**
     * Updates an existing zone with RRsets.
     *
     * @async
     * @function updateZoneRRsets
     * @param {string} serverId - The ID of the server managing the zone.
     * @param {string} zoneId - The ID of the zone to update.
     * @param {object} rrsetData - The RRsets data to update.
     * @returns {Promise<void>} A promise that resolves if the update is successful.
     *
     * @throws {Error} If the API request fails or the response is not successful.
     *
     * @example
     * await zones.updateZoneRRsets("localhost", "example.org.", {
     *   rrsets: [
     *     {
     *       name: "test.example.org.",
     *       type: "A",
     *       ttl: 3600,
     *       changetype: "REPLACE",
     *       records: [
     *         { content: "192.168.0.1", disabled: false }
     *       ]
     *     }
     *   ]
     * });
     */
    public async updateZoneRRsets(
        serverId: string,
        zoneId: string,
        rrsetData: object
    ): Promise<void> {
        return this.client.patch(`/servers/${serverId}/zones/${zoneId}`, rrsetData);
    }

    /**
     * Modifies basic zone data.
     *
     * @async
     * @function modifyZone
     * @param {string} serverId - The ID of the server managing the zone.
     * @param {string} zoneId - The ID of the zone to modify.
     * @param {object} zoneData - The data to modify in the zone.
     * @returns {Promise<void>} A promise that resolves if the modification is successful.
     *
     * @throws {Error} If the API request fails or the response is not successful.
     *
     * @example
     * await zones.modifyZone("localhost", "example.org.", {
     *   kind: "Master",
     *   dnssec: true
     * });
     */
    public async modifyZone(
        serverId: string,
        zoneId: string,
        zoneData: object
    ): Promise<void> {
        return this.client.put(`/servers/${serverId}/zones/${zoneId}`, zoneData);
    }

    /**
     * Retrieves a slave zone from its master.
     *
     * @async
     * @function retrieveSlaveZone
     * @param {string} serverId - The ID of the server managing the zone.
     * @param {string} zoneId - The ID of the zone to retrieve from the master.
     * @param {object} body - The JSON payload to send with the request.
     * @returns {Promise<void>} A promise that resolves if the retrieval is successful.
     *
     * @throws {Error} If the API request fails or the response is not successful.
     *
     * @example
     * // Retrieve slave zone
     * await zones.retrieveSlaveZone("localhost", "example.org.", {});
     */
    public async retrieveSlaveZone(serverId: string, zoneId: string, body: object): Promise<void> {
        return this.client.put(`/servers/${serverId}/zones/${zoneId}/axfr-retrieve`, body);
    }

    /**
     * Sends a DNS NOTIFY to all slaves for the specified zone.
     *
     * @async
     * @function sendNotify
     * @param {string} serverId - The ID of the server managing the zone.
     * @param {string} zoneId - The ID of the zone to notify slaves about.
     * @param {object} body - The JSON payload to send with the request.
     * @returns {Promise<void>} A promise that resolves if the notification is successful.
     *
     * @throws {Error} If the API request fails or the response is not successful.
     *
     * @example
     * // Send DNS NOTIFY
     * await zones.sendNotify("localhost", "example.org.", {});
     */
    public async sendNotify(serverId: string, zoneId: string, body: object): Promise<void> {
        return this.client.put(`/servers/${serverId}/zones/${zoneId}/notify`, body);
    }

    /**
     * Exports the zone in AXFR format.
     *
     * @async
     * @function exportZone
     * @param {string} serverId - The ID of the server managing the zone.
     * @param {string} zoneId - The ID of the zone to export.
     * @returns {Promise<string>} A promise that resolves to the exported zone in AXFR format.
     *
     * @throws {Error} If the API request fails or the response is not successful.
     *
     * @example
     * // Export a zone
     * const axfr = await zones.exportZone("localhost", "example.org.");
     * console.log(axfr);
     */
    public async exportZone(serverId: string, zoneId: string): Promise<string> {
        return this.client.get(`/servers/${serverId}/zones/${zoneId}/export`);
    }

    /**
     * Rectifies the zone data.
     *
     * @async
     * @function rectifyZone
     * @param {string} serverId - The ID of the server managing the zone.
     * @param {string} zoneId - The ID of the zone to rectify.
     * @param {object} body - The JSON payload to send with the request.
     * @returns {Promise<object>} A promise that resolves to the result of the rectification.
     *
     * @throws {Error} If the API request fails or the response is not successful.
     *
     * @example
     * // Rectify a zone
     * const result = await zones.rectifyZone("localhost", "example.org.", {});
     * console.log(result); // { result: "Rectified" }
     */
    public async rectifyZone(serverId: string, zoneId: string, body: object): Promise<object> {
        return this.client.put(`/servers/${serverId}/zones/${zoneId}/rectify`, body);
    }

}
