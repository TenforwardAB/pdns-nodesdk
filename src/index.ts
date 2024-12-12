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
 * Created on 2024-11-29 :: 12:19 BY joyider <andre(-at-)sess.se>
 */
import {ApiClient} from "./utils/ApiClient";
import {Servers} from "./api/Servers";
import {Zones} from "./api/Zones";
import {Cryptokeys} from "./api/Cryptokeys";
import {Metadata} from "./api/Metadata";
import {TSIGKeys} from "./api/TSIGKeys";
import {Autoprimaries} from "./api/Autoprimaries";
import {Searching} from "./api/Searching";
import {Statistics} from "./api/Statistics";
import {Cache} from "./api/Cache";

/**
 * The main SDK class for interacting with the PowerDNS API.
 * This class provides access to various modules, including authentication and user management.
 *
 * @class PdnsNodeSDK
 */
export class PdnsNodeSDK {
    /**
     * @private
     * @property {ApiClient} client - An instance of the ApiClient used to communicate with the PowerDNS API.
     */
    private client: ApiClient;

    /**
     * Provides methods for Servers related operations, such as list servers and getting server information.
     * @public
     * @type {Servers}
     */
    public servers: Servers;

    /**
     * Provides methods for Zones related operations, such as managing zones and their details.
     * @public
     * @type {Zones}
     */
    public zones: Zones;

    /**
     * Provides methods for Cryptokeys related operations, such as creating, retrieving, and managing DNSSEC keys.
     * @public
     * @type {Cryptokeys}
     */
    public cryptokeys: Cryptokeys;

    /**
     * Provides methods for Metadata related operations, such as managing and retrieving zone metadata.
     * @public
     * @type {Metadata}
     */
    public metadata: Metadata;

    /**
     * Provides methods for TSIGKeys related operations, such as creating, retrieving, and managing TSIG keys.
     * @public
     * @type {TSIGKeys}
     */
    public tsigkeys: TSIGKeys;

    /**
     * Provides methods for Autoprimaries related operations, such as managing autoprimary servers.
     * @public
     * @type {Autoprimaries}
     */
    public autoprimaries: Autoprimaries;

    /**
     * Provides methods for Searching operations, such as querying zones, records, and comments within PowerDNS.
     * @public
     * @type {Searching}
     */
    public searching: Searching;

    /**
     * Provides methods for Statistics related operations, such as querying internal PowerDNS statistics.
     * @public
     * @type {Statistics}
     */
    public statistics: Statistics;

    /**
     * Provides methods for Cache related operations, such as flushing entries from the cache.
     * @public
     * @type {Cache}
     */
    public cache: Cache;


    /**
     * Creates an instance of the PdnsNodeSDK.
     *
     * @constructor
     * @param {string} apiKey - The API key used to authenticate requests to the PowerDNS API.
     * @param {string} apiUrl - The base URL of the PowerDNS API (e.g., "https://api.example.com").
     *
     * @example
     * // Initialize the SDK
     * const sdk = new PdnsNodeSDK("your-api-key", "https://api.example.com");
     * sdk.users.listUsers().then(users => console.log(users));
     */
    constructor(apiKey: string, apiUrl: string) {
        /**
         * @private
         * Initializes the API client with the provided API key and base URL.
         */
        this.client = new ApiClient(apiKey, apiUrl);

        /**
         * Initializes the server module.
         */
        this.servers = new Servers(this.client);

        /**
         * Initializes the Zones module.
         */
        this.zones = new Zones(this.client);

        /**
         * Initializes the Cryptokeys module.
         */
        this.cryptokeys = new Cryptokeys(this.client);

        /**
         * Initializes the Metadata module.
         */
        this.metadata = new Metadata(this.client);

        /**
         * Initializes the TSIGKeys module.
         */
        this.tsigkeys = new TSIGKeys(this.client);

        /**
         * Initializes the Autoprimaries module.
         */
        this.autoprimaries = new Autoprimaries(this.client);

        /**
         * Initializes the Searching module.
         */
        this.searching = new Searching(this.client);

        /**
         * Initializes the Statistics module.
         */
        this.statistics = new Statistics(this.client);

        /**
         * Initializes the Cache module.
         */
        this.cache = new Cache(this.client);


    }
}

