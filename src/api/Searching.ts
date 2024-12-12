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
 * Created on 12/12/24 :: 11:38AM BY joyider <andre(-at-)sess.se>
 *
 * This file :: Searching.ts is part of the pdns-nodesdk project.
 */

import { ApiClient } from "../utils/ApiClient";

/**
 * A class for handling search operations in the PowerDNS API.
 * This class provides methods for searching zones, comments, and RRSets data.
 *
 * @class Searching
 */
export class Searching {
    /**
     * @private
     * @property {ApiClient} client - The ApiClient instance used for making API requests.
     */
    private client: ApiClient;

    /**
     * Creates an instance of the Searching class.
     *
     * @constructor
     * @param {ApiClient} client - An instance of the ApiClient used to communicate with the API.
     *
     * @example
     * // Example instantiation of the Searching class
     * const searching = new Searching(apiClient);
     */
    constructor(client: ApiClient) {
        this.client = client;
    }

    /**
     * Searches the data inside PowerDNS.
     *
     * This function allows searching for data in zones, records, and comments
     * using a specified search term. Wildcard characters '*' and '?' can be used
     * in the search term.
     *
     * @async
     * @function searchData
     * @param {string} serverId - The ID of the server to perform the search on.
     * @param {string} query - The search term to look for. Can include wildcards.
     * @param {number} [maxResults=100] - The maximum number of entries to return.
     * @param {"all" | "zone" | "record" | "comment"} [objectType="all"] - The type of data to search for.
     * @returns {Promise<Array<{
     *   content: string;
     *   disabled: boolean;
     *   name: string;
     *   object_type: "record" | "zone" | "comment";
     *   zone_id: string;
     *   zone: string;
     *   type: string;
     *   ttl: number;
     * }>>} A promise that resolves to an array of search result objects.
     *
     * @throws {Error} If the API request fails or the response is not successful.
     *
     * @example
     * const results = await searching.searchData("localhost", "example*", 10, "zone");
     * console.log(results[0].name); // e.g., "example.com"
     */
    public async searchData(
        serverId: string,
        query: string,
        maxResults: number = 100,
        objectType: "all" | "zone" | "record" | "comment" = "all"
    ): Promise<
        Array<{
            content: string;
            disabled: boolean;
            name: string;
            object_type: "record" | "zone" | "comment";
            zone_id: string;
            zone: string;
            type: string;
            ttl: number;
        }>
    > {
        const params = new URLSearchParams({
            q: query,
            max: maxResults.toString(),
            object_type: objectType,
        });
        return this.client.get(`/servers/${serverId}/search-data?${params.toString()}`);
    }
}
