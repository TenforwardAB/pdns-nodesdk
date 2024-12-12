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
 * Created on 12/12/24 :: 11:40AM BY joyider <andre(-at-)sess.se>
 *
 * This file :: Statistics.ts is part of the pdns-nodesdk project.
 */

import {ApiClient} from "../utils/ApiClient";

/**
 * A class for querying PowerDNS internal statistics via the API.
 *
 * @class Statistics
 */
export class Statistics {
    /**
     * @private
     * @property {ApiClient} client - The ApiClient instance used for making API requests.
     */
    private client: ApiClient;

    /**
     * Creates an instance of the Statistics class.
     *
     * @constructor
     * @param {ApiClient} client - An instance of the ApiClient used to communicate with the API.
     *
     * @example
     * // Example instantiation of the Statistics class
     * const statistics = new Statistics(apiClient);
     */
    constructor(client: ApiClient) {
        this.client = client;
    }

    /**
     * Retrieves statistics from the PowerDNS server.
     *
     * @async
     * @function getStatistics
     * @param {string} serverId - The ID of the server to retrieve statistics from.
     * @param {object} [options] - Optional query parameters.
     * @param {string} [options.statistic] - The name of a specific statistic to retrieve.
     * @param {boolean} [options.includerings] - Whether to include Ring items in the response (default is true).
     * @returns {Promise<Array<object>>} A promise that resolves to an array of statistics.
     *
     * @throws {Error} If the API request fails or the response is not successful.
     *
     * @example
     * // Retrieve all statistics
     * const stats = await statistics.getStatistics("localhost");
     *
     * @example
     * // Retrieve a specific statistic
     * const stats = await statistics.getStatistics("localhost", { statistic: "cache-hits" });
     *
     * @example
     * // Retrieve statistics without Ring items
     * const stats = await statistics.getStatistics("localhost", { includerings: false });
     */
    public async getStatistics(
        serverId: string,
        options?: { statistic?: string; includerings?: boolean }
    ): Promise<Array<object>> {
        let queryParams = [];
        if (options?.statistic) {
            queryParams.push(`statistic=${options.statistic}`);
        }
        if (options?.includerings !== undefined) {
            queryParams.push(`includerings=${options.includerings}`);
        }
        const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";
        return this.client.get(`/servers/${serverId}/statistics${queryString}`);
    }
}
