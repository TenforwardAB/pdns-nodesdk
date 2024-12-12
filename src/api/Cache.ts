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
 * Created on 12/12/24 :: 11:47AM BY joyider <andre(-at-)sess.se>
 *
 * This file :: Cache.ts is part of the pdns-nodesdk project.
 */

import { ApiClient } from "../utils/ApiClient";

/**
 * A class for handling cache operations in the PowerDNS API.
 * This class provides methods for managing cache entries.
 *
 * @class Cache
 */
export class Cache {
    /**
     * @private
     * @property {ApiClient} client - The ApiClient instance used for making API requests.
     */
    private client: ApiClient;

    /**
     * Creates an instance of the Cache class.
     *
     * @constructor
     * @param {ApiClient} client - An instance of the ApiClient used to communicate with the API.
     *
     * @example
     * // Example instantiation of the Cache class
     * const cache = new Cache(apiClient);
     */
    constructor(client: ApiClient) {
        this.client = client;
    }

    /**
     * Flushes a cache entry by domain name.
     *
     * @async
     * @function flushCache
     * @param {string} serverId - The ID of the server to flush the cache on.
     * @param {string} domain - The domain name to flush from the cache.
     * @returns {Promise<{
     *   count: number;
     *   result: string;
     * }>} A promise that resolves to the cache flush result.
     *
     * @throws {Error} If the API request fails or the response is not successful.
     *
     * @example
     * // Flush the cache for a specific domain
     * const flushResult = await cache.flushCache("localhost", "example.com");
     * console.log(flushResult.count); // 1
     * console.log(flushResult.result); // "Flushed cache"
     */
    public async flushCache(
        serverId: string,
        domain: string
    ): Promise<{
        count: number;
        result: string;
    }> {
        const query = `domain=${encodeURIComponent(domain)}`;
        return this.client.put(`/servers/${serverId}/cache/flush?${query}`, null);
    }
}
